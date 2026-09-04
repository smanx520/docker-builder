import { json, getToken } from '../util.js';
import { whoami, getRepo, getActionsPermissions } from '../github.js';

// GET /api/fork-status
// 检测登录用户是否已 fork 宿主项目（默认 smanx/docker-builder），以及 fork 是否已开启 Actions。
export async function forkStatus(request, env) {
  const token = getToken(request);
  if (!token) return json({ error: '未登录：缺少 GitHub Token' }, 401);

  const me = await whoami(token);
  const source = (env && env.BUILDER_SOURCE) || 'smanx/docker-builder';
  const [sourceOwner, sourceRepo] = source.split('/');
  const builderOwner = me.login; // 用户自己的 fork
  const builderRepo = sourceRepo; // fork 与源仓库同名

  let forked = false;
  let forkFullName = null;
  try {
    const info = await getRepo(token, builderOwner, builderRepo);
    const parentFull = (info.parent && info.parent.full_name) || (info.source && info.source.full_name) || '';
    if (info.fork && parentFull === source) {
      forked = true;
      forkFullName = info.full_name;
    }
  } catch {
    forked = false;
  }

  let actionsEnabled = false;
  if (forked) {
    try {
      const p = await getActionsPermissions(token, builderOwner, builderRepo);
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
    forkFullName,
    forkUrl: `https://github.com/${source}/fork`,
    actionsUrl: forked ? `https://github.com/${builderOwner}/${builderRepo}/actions` : null
  });
}
