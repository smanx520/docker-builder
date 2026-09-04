import { json, getToken } from '../util.js';
import { whoami as ghWhoami } from '../github.js';

// GET /api/whoami → 当前登录用户信息
export async function whoami(request) {
  const token = getToken(request);
  if (!token) return json({ error: '未登录' }, 401);
  const user = await ghWhoami(token);
  return json({ login: user.login, name: user.name, avatar: user.avatar_url, htmlUrl: user.html_url });
}
