import { json } from '../util.js';
import { authLogin, authCallback } from './auth.js';
import { build } from './build.js';
import { status } from './status.js';
import { whoami } from './whoami.js';
import { forkStatus } from './fork.js';

export async function handleApi(request, env, ctx, url) {
  const path = url.pathname;
  try {
    if (path === '/api/health') return json({ ok: true });
    if (path === '/api/whoami' && request.method === 'GET') return whoami(request);
    if (path === '/api/auth/login' && request.method === 'GET') return authLogin(request, env);
    if (path === '/api/auth/callback' && request.method === 'GET') return authCallback(request, env, url);
    if (path === '/api/fork-status' && request.method === 'GET') return forkStatus(request, env);
    if (path === '/api/build' && request.method === 'POST') return build(request, env);
    if (path === '/api/status' && request.method === 'GET') return status(request, url);
    return json({ error: '接口不存在' }, 404);
  } catch (e) {
    return json({ error: e.message || '服务器内部错误' }, 500);
  }
}
