import { json, getToken, sleep } from '../util.js';
import { whoami, getRepo, getActionsPermissions, setActionsEnabled, createFork, mergeUpstream } from '../github.js';

const MAX_FORK_WAIT = 60000; // 等待 fork 完全就绪的最长时间
const FORK_POLL_MS = 1500;   // fork 就绪轮询间隔

// 判断某仓库是否为指定源仓库的 fork
async function isForkOf(token, owner, repo, source) {
  try {
    const info = await getRepo(token, owner, repo);
    const parentFull = (info.parent && info.parent.full_name) || (info.source && info.source.full_name) || '';
    return info.fork && parentFull === source;
  } catch {
    return false;
  }
}

// 确保用户已 fork 宿主项目；未 fork 则自动创建并等待就绪
async function ensureForked(token, userLogin, sourceOwner, sourceRepo) {
  const forkOwner = userLogin;
  const forkRepo = sourceRepo;
  const source = `${sourceOwner}/${sourceRepo}`;
  if (await isForkOf(token, forkOwner, forkRepo, source)) {
    return { created: false, owner: forkOwner, repo: forkRepo };
  }
  try {
    await createFork(token, sourceOwner, sourceRepo);
  } catch (e) {
    // 同名仓库已存在但并非 fork（例如用户自己建过同名仓库）——无法自动 fork
    const exists = await getRepo(token, forkOwner, forkRepo).catch(() => null);
    if (exists) {
      throw new Error(`你名下已存在 ${forkOwner}/${forkRepo}，但它不是 ${source} 的 fork，无法自动 fork，请先处理该仓库`);
    }
    throw new Error(`自动 fork 失败：${e.message}`);
  }
  // 轮询等待 fork 就绪
  const start = Date.now();
  while (Date.now() - start < MAX_FORK_WAIT) {
    if (await isForkOf(token, forkOwner, forkRepo, source)) {
      return { created: true, owner: forkOwner, repo: forkRepo };
    }
    await sleep(FORK_POLL_MS);
  }
  throw new Error('fork 创建超时，请稍后重试');
}

// 将 fork 同步到上游最新（GitHub「Sync fork」API，仅支持 fast-forward）
async function syncFork(token, owner, repo, sourceOwner, sourceRepo) {
  const source = await getRepo(token, sourceOwner, sourceRepo);
  const branch = source.default_branch || 'main';
  try {
    const r = await mergeUpstream(token, owner, repo, branch);
    const msg = (r && r.message) || '';
    return { branch, upToDate: /already up-to-date/i.test(msg), updated: !/already up-to-date/i.test(msg) };
  } catch {
    // 409 冲突：fork 与上游分叉，无法 fast-forward
    return { branch, conflict: true, upToDate: false, updated: false };
  }
}

// 确保 fork 已开启 GitHub Actions；未开启则自动开启
async function ensureActions(token, owner, repo) {
  try {
    const p = await getActionsPermissions(token, owner, repo);
    if (p && p.enabled) return { enabled: true };
  } catch {
    // 查询失败则尝试直接开启
  }
  try {
    await setActionsEnabled(token, owner, repo, true);
    return { enabled: true };
  } catch {
    return { enabled: false };
  }
}

// GET /api/fork-status —— 只读快速检测（不自动 fork / 不同步，供重试等场景快速校验）
export async function forkStatus(request, env) {
  const token = getToken(request);
  if (!token) return json({ error: '未登录：缺少 GitHub Token' }, 401);

  const me = await whoami(token);
  const source = (env && env.BUILDER_SOURCE) || 'smanx/docker-builder';
  const [sourceOwner, sourceRepo] = source.split('/');

  const forked = await isForkOf(token, me.login, sourceRepo, source);
  let actionsEnabled = false;
  if (forked) {
    try {
      const p = await getActionsPermissions(token, me.login, sourceRepo);
      actionsEnabled = !!p.enabled;
    } catch {
      actionsEnabled = false;
    }
  }

  return json({
    forked,
    actionsEnabled,
    canBuild: forked && actionsEnabled,
    login: me.login,
    source,
    forkUrl: `https://github.com/${source}/fork`,
    actionsUrl: forked ? `https://github.com/${me.login}/${sourceRepo}/actions` : null
  });
}

// POST /api/fork-setup —— 自动准备构建宿主：
// 检测是否已 fork → 未 fork 自动创建 → 同步到上游最新 → 确保开启 GitHub Actions。
// 返回逐步结果供前端展示；全程幂等，可安全重复调用。
export async function forkSetup(request, env) {
  const token = getToken(request);
  if (!token) return json({ error: '未登录：缺少 GitHub Token' }, 401);

  const me = await whoami(token);
  const source = (env && env.BUILDER_SOURCE) || 'smanx/docker-builder';
  const [sourceOwner, sourceRepo] = source.split('/');
  const steps = [];

  try {
    // 1) 确保已 fork
    const f = await ensureForked(token, me.login, sourceOwner, sourceRepo);
    steps.push({ key: f.created ? 'forkCreated' : 'forkChecked', state: 'done' });

    // 2) 同步到上游最新（确保 workflow 文件是最新版）
    const s = await syncFork(token, me.login, sourceRepo, sourceOwner, sourceRepo);
    if (s.conflict) {
      steps.push({ key: 'forkSyncConflict', state: 'fail' });
      return json({
        ok: true,
        forked: true,
        synced: false,
        actionsEnabled: false,
        canBuild: false,
        conflict: true,
        login: me.login,
        source,
        steps,
        forkUrl: `https://github.com/${me.login}/${sourceRepo}`,
        actionsUrl: `https://github.com/${me.login}/${sourceRepo}/actions`
      });
    }
    steps.push({ key: s.upToDate ? 'forkUpToDate' : 'forkUpdated', state: 'done' });

    // 3) 确保开启 GitHub Actions（fork 默认关闭）
    const a = await ensureActions(token, me.login, sourceRepo);
    steps.push(a.enabled ? { key: 'forkActionsEnabled', state: 'done' } : { key: 'forkActionsManual', state: 'fail' });

    return json({
      ok: true,
      forked: true,
      synced: true,
      actionsEnabled: a.enabled,
      canBuild: a.enabled,
      login: me.login,
      source,
      steps,
      forkUrl: `https://github.com/${me.login}/${sourceRepo}`,
      actionsUrl: `https://github.com/${me.login}/${sourceRepo}/actions`
    });
  } catch (e) {
    // 返回 200 + ok:false，让前端读取 error 展示（与 build.js 的 needFork 风格一致）
    return json({
      ok: false,
      error: e.message || 'fork 准备失败',
      login: me.login,
      source,
      steps
    });
  }
}
