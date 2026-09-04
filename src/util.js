export function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store'
    }
  });
}

// 从 Authorization: Bearer xxx 提取 GitHub Token
export function getToken(request) {
  const auth = request.headers.get('Authorization') || '';
  return auth.startsWith('Bearer ') ? auth.slice(7).trim() : '';
}

// 解析仓库地址，支持多种写法
export function parseRepoUrl(raw) {
  const s = (raw || '').trim();
  if (!s) throw new Error('仓库地址不能为空');
  let m = s.match(/^git@github\.com:([^/]+)\/([^/]+?)(?:\.git)?\/?$/);
  if (m) return { owner: m[1], repo: m[2] };
  m = s.match(/^https?:\/\/(?:www\.)?github\.com\/([^/]+)\/([^/]+?)(?:\.git)?\/?$/);
  if (m) return { owner: m[1], repo: m[2] };
  m = s.match(/^([^/\s]+)\/([^/\s]+?)(?:\.git)?\/?$/);
  if (m) return { owner: m[1], repo: m[2] };
  throw new Error('无法解析仓库地址，支持 https://github.com/owner/repo 或 owner/repo');
}

export function parseCookie(header) {
  const out = {};
  if (!header) return out;
  for (const part of header.split(';')) {
    const i = part.indexOf('=');
    if (i > -1) out[part.slice(0, i).trim()] = part.slice(i + 1).trim();
  }
  return out;
}

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// 平台白名单
const ALLOWED_PLATFORMS = ['linux/amd64', 'linux/arm64', 'linux/arm/v7', 'linux/386'];

export function normalizePlatforms(value) {
  let list = [];
  if (Array.isArray(value)) list = value;
  else if (typeof value === 'string') list = value.split(',').map((x) => x.trim()).filter(Boolean);
  else list = ['linux/amd64'];
  if (list.length === 0) list = ['linux/amd64'];
  const unique = [...new Set(list)];
  for (const p of unique) {
    if (!ALLOWED_PLATFORMS.includes(p)) {
      throw new Error(`不支持的架构: ${p}`);
    }
  }
  return unique.join(',');
}

// 解析多行 KEY=VALUE 环境变量，返回行数组
export function parseEnvVars(value) {
  if (!value) return [];
  const lines = String(value).split(/\r?\n/).map((x) => x.trim()).filter(Boolean);
  const out = [];
  for (const line of lines) {
    const m = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!m) throw new Error(`环境变量格式不正确（应为 KEY=VALUE）: ${line}`);
    out.push(`${m[1]}=${m[2]}`);
  }
  return out;
}
