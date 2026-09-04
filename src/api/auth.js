import { json, parseCookie } from '../util.js';

const GH_AUTHORIZE = 'https://github.com/login/oauth/authorize';
const GH_ACCESS_TOKEN = 'https://github.com/login/oauth/access_token';
const STATE_COOKIE = 'db_oauth_state';

function callbackUrl(request, env) {
  if (env.GH_OAUTH_CALLBACK_URL) return env.GH_OAUTH_CALLBACK_URL;
  return new URL(request.url).origin + '/api/auth/callback';
}

// GET /api/auth/login?redirect=/ → 跳转 GitHub 授权
export async function authLogin(request, env) {
  const clientId = env.GH_OAUTH_CLIENT_ID;
  if (!clientId) {
    return json({ error: '服务端未配置 GH_OAUTH_CLIENT_ID，请先 wrangler secret put' }, 500);
  }
  const state = crypto.randomUUID();
  const cb = callbackUrl(request, env);
  const target =
    `${GH_AUTHORIZE}?client_id=${encodeURIComponent(clientId)}` +
    `&redirect_uri=${encodeURIComponent(cb)}` +
    `&scope=repo%20workflow` +
    `&state=${state}`;
  return new Response(null, {
    status: 302,
    headers: {
      Location: target,
      'Set-Cookie': `${STATE_COOKIE}=${state}; Path=/; Max-Age=600; HttpOnly; SameSite=Lax`
    }
  });
}

// GET /api/auth/callback?code=&state= → 换取 access_token 并回跳前端
export async function authCallback(request, env, url) {
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const cookieState = parseCookie(request.headers.get('Cookie') || '')[STATE_COOKIE];
  if (!code) return json({ error: '缺少授权 code' }, 400);
  if (!state || !cookieState || state !== cookieState) {
    return json({ error: 'state 校验失败，请重新登录' }, 400);
  }

  const clientId = env.GH_OAUTH_CLIENT_ID;
  const clientSecret = env.GH_OAUTH_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return json({ error: '服务端未配置 OAuth 凭据' }, 500);
  }

  const r = await fetch(GH_ACCESS_TOKEN, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      redirect_uri: callbackUrl(request, env)
    })
  });
  const j = await r.json();
  if (!j.access_token) {
    return json({ error: '授权失败: ' + (j.error_description || j.error || 'unknown') }, 400);
  }

  const origin = new URL(request.url).origin;
  return new Response(null, {
    status: 302,
    headers: {
      Location: `${origin}/?access_token=${encodeURIComponent(j.access_token)}`,
      'Set-Cookie': `${STATE_COOKIE}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax`
    }
  });
}
