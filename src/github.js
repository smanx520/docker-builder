const API = 'https://api.github.com';

async function gh(token, path, options = {}) {
  const headers = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    // GitHub API 强制要求 User-Agent，否则返回 403；Worker fetch 不会自动携带
    'User-Agent': 'docker-builder-worker',
    ...(options.body !== undefined ? { 'Content-Type': 'application/json' } : {})
  };
  // token 为空时按匿名访问（可读取公共仓库）
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(API + path, {
    method: options.method || 'GET',
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined
  });
  if (res.status === 204) return null;
  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null;
  }
  if (!res.ok) {
    const detail = (data && data.message) || text || res.statusText;
    throw new Error(`GitHub API ${res.status}: ${detail}`);
  }
  return data;
}

export async function whoami(token) {
  return gh(token, '/user');
}

export async function getRepo(token, owner, repo) {
  return gh(token, `/repos/${owner}/${repo}`);
}

// 仓库是否开启 GitHub Actions（fork 默认关闭，需要用户在 fork 上手动开启）
export async function getActionsPermissions(token, owner, repo) {
  return gh(token, `/repos/${owner}/${repo}/actions/permissions`);
}

// GitHub Actions secret 相关
export async function getPublicKey(token, owner, repo) {
  return gh(token, `/repos/${owner}/${repo}/actions/secrets/public-key`);
}

export async function putSecret(token, owner, repo, name, encryptedValue, keyId) {
  return gh(token, `/repos/${owner}/${repo}/actions/secrets/${name}`, {
    method: 'PUT',
    body: { encrypted_value: encryptedValue, key_id: keyId }
  });
}

export async function deleteSecret(token, owner, repo, name) {
  return gh(token, `/repos/${owner}/${repo}/actions/secrets/${name}`, { method: 'DELETE' });
}

// 触发宿主仓库的 workflow_dispatch（workflow 静态提交在宿主仓库 .github/workflows/docker-build.yml）
export async function dispatchWorkflow(token, owner, repo, ref, inputs) {
  return gh(token, `/repos/${owner}/${repo}/actions/workflows/docker-build.yml/dispatches`, {
    method: 'POST',
    body: { ref, inputs }
  });
}

export async function listWorkflowRuns(token, owner, repo) {
  const data = await gh(token, `/repos/${owner}/${repo}/actions/workflows/docker-build.yml/runs?per_page=5`);
  return data.workflow_runs || [];
}

export async function getRun(token, owner, repo, runId) {
  return gh(token, `/repos/${owner}/${repo}/actions/runs/${runId}`);
}
