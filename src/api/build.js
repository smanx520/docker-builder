import { json, getToken, parseRepoUrl, normalizePlatforms, parseEnvVars, sleep } from '../util.js';
import {
  whoami,
  getRepo,
  getActionsPermissions,
  getPublicKey,
  putSecret,
  deleteSecret,
  dispatchWorkflow,
  listWorkflowRuns
} from '../github.js';
import { sealSecret } from '../crypto.js';

// POST /api/build
// body: { repoUrl, ref?, tag, platforms, registries, envVars, dockerHubUsername, dockerHubToken, gitToken? }
//
// 构建宿主仓库 = 登录用户自己的 fork（默认 fork 自 smanx/docker-builder，仓库同名 docker-builder）。
// 打包前校验：1) 已 fork 宿主项目；2) fork 已开启 GitHub Actions。二者任一不满足则拒绝并给出引导。
// 目标仓库（repoUrl）只是被克隆构建的对象，无需写权限：公共仓库匿名克隆，私有仓库用 GH_PAT 克隆。
// 推送平台（registries）：ghcr / dockerhub，默认仅 ghcr；只有勾选 dockerhub 时才需要 Docker Hub 凭据。
export async function build(request, env) {
  const token = getToken(request);
  if (!token) return json({ error: '未登录：缺少 GitHub Token' }, 401);

  const body = await request.json().catch(() => ({}));
  const { owner: targetOwner, repo: targetRepo } = parseRepoUrl(body.repoUrl);

  const tag = String(body.tag || 'latest').trim();
  const platforms = normalizePlatforms(body.platforms);
  const envVars = parseEnvVars(body.envVars);
  // 推送平台：仅接受 ghcr / dockerhub；默认 GHCR
  const registries = Array.isArray(body.registries)
    ? body.registries.filter((r) => r === 'ghcr' || r === 'dockerhub')
    : ['ghcr'];
  if (!registries.length) throw new Error('请至少选择 GHCR 或 Docker Hub 作为推送平台');
  const useDhub = registries.includes('dockerhub');
  const dockerUser = String(body.dockerHubUsername || '').trim();
  const dockerToken = String(body.dockerHubToken || '').trim();
  // 私有目标仓库的读取 Token（前端传「检测 Token」或登录 Token）；公共仓库可为空
  const gitToken = String(body.gitToken || '').trim();
  // 构建的引用：分支名或 Tag（空 = 默认分支最新代码）
  const ref = String(body.ref || '').trim();

  if (!tag) throw new Error('Tag 不能为空');
  if (!/^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(tag)) throw new Error('Tag 格式不合法');
  if (useDhub && !dockerUser) throw new Error('Docker Hub 用户名不能为空');
  if (useDhub && !dockerToken) throw new Error('Docker Hub Access Token 不能为空');

  // 宿主项目（用户需 fork）：默认 smanx/docker-builder，可用环境变量覆盖
  const source = (env && env.BUILDER_SOURCE) || 'smanx/docker-builder';
  const sourceRepo = source.split('/')[1];
  const builderOwner = (await whoami(token)).login; // 用户自己的 fork
  const builderRepo = sourceRepo; // fork 与源仓库同名

  // 1. 校验：用户是否 fork 了宿主项目
  let forkInfo;
  try {
    forkInfo = await getRepo(token, builderOwner, builderRepo);
  } catch {
    return json({
      ok: false,
      needFork: true,
      source,
      forkUrl: `https://github.com/${source}/fork`,
      message: `未检测到你的 fork：${builderOwner}/${builderRepo}。请先 fork ${source} 后再打包。`
    }, 200);
  }
  const parentFull = (forkInfo.parent && forkInfo.parent.full_name) || (forkInfo.source && forkInfo.source.full_name) || '';
  if (!forkInfo.fork || parentFull !== source) {
    return json({
      ok: false,
      needFork: true,
      source,
      forkUrl: `https://github.com/${source}/fork`,
      message: `${builderOwner}/${builderRepo} 不是 ${source} 的 fork，请先 fork ${source} 后再打包。`
    }, 200);
  }

  // 2. 校验：fork 是否开启了 GitHub Actions（fork 默认关闭）
  let actionsEnabled = false;
  try {
    const p = await getActionsPermissions(token, builderOwner, builderRepo);
    actionsEnabled = !!p.enabled;
  } catch {
    actionsEnabled = false;
  }
  if (!actionsEnabled) {
    return json({
      ok: false,
      needEnableActions: true,
      actionsUrl: `https://github.com/${builderOwner}/${builderRepo}/actions`,
      message: `已 fork ${source}，但你的 fork 尚未开启 GitHub Actions。请先到 fork 的 Actions 页面启用，再回来打包。`
    }, 200);
  }

  // 3. 推送平台凭据：仅当勾选 Docker Hub 时写入 DOCKERHUB secrets；否则删除旧值避免误用
  const pk = await getPublicKey(token, builderOwner, builderRepo);
  if (useDhub) {
    await putSecret(token, builderOwner, builderRepo, 'DOCKERHUB_USERNAME', sealSecret(pk.key, dockerUser), pk.key_id);
    await putSecret(token, builderOwner, builderRepo, 'DOCKERHUB_TOKEN', sealSecret(pk.key, dockerToken), pk.key_id);
  } else {
    try {
      await deleteSecret(token, builderOwner, builderRepo, 'DOCKERHUB_USERNAME');
      await deleteSecret(token, builderOwner, builderRepo, 'DOCKERHUB_TOKEN');
    } catch {
      // 不存在则忽略
    }
  }

  // 4. 私有目标仓库：写入 GH_PAT 供 workflow 克隆；公共仓库则删除旧值避免误用
  if (gitToken) {
    await putSecret(token, builderOwner, builderRepo, 'GH_PAT', sealSecret(pk.key, gitToken), pk.key_id);
  } else {
    try {
      await deleteSecret(token, builderOwner, builderRepo, 'GH_PAT');
    } catch {
      // 不存在则忽略
    }
  }

  // 5. 触发宿主仓库 workflow（env_vars 编码为 base64，避免换行破坏 workflow shell；内容已被校验为 ASCII）
  const envB64 = btoa(envVars.join('\n'));
  await dispatchWorkflow(token, builderOwner, builderRepo, forkInfo.default_branch, {
    repo_url: String(body.repoUrl).trim(),
    ref,
    tag,
    platforms,
    registries: registries.join(','),
    env_vars: envVars.length ? envB64 : ''
  });

  // 6. 定位刚触发的 run（宿主仓库）
  const run = await findNewRun(token, builderOwner, builderRepo);
  const images = [];
  if (registries.includes('ghcr')) images.push(`ghcr.io/${builderOwner}/${targetRepo}:${tag}`);
  if (useDhub) images.push(`${dockerUser}/${targetRepo}:${tag}`);
  return json({
    ok: true,
    owner: builderOwner,
    repo: builderRepo,
    targetOwner,
    targetRepo,
    tag,
    platforms,
    registries,
    images,
    envVarCount: envVars.length,
    runId: run ? run.id : null,
    runUrl: run ? run.html_url : `https://github.com/${builderOwner}/${builderRepo}/actions`
  });
}

async function findNewRun(token, owner, repo) {
  const start = Date.now();
  while (Date.now() - start < 12000) {
    const runs = await listWorkflowRuns(token, owner, repo);
    if (runs.length) {
      const newest = runs[0];
      const created = new Date(newest.created_at).getTime();
      // 只认最近 30 秒内创建的 run，避免误取历史构建
      if (Date.now() - created < 30000) return newest;
    }
    await sleep(1500);
  }
  return null;
}
