import { json, getToken } from '../util.js';
import { getRun } from '../github.js';

// GET /api/status?owner=&repo=&run_id=
export async function status(request, url) {
  const token = getToken(request);
  if (!token) return json({ error: '未登录：缺少 GitHub Token' }, 401);

  const owner = url.searchParams.get('owner');
  const repo = url.searchParams.get('repo');
  const runId = url.searchParams.get('run_id');
  if (!owner || !repo || !runId) return json({ error: '缺少 owner/repo/run_id 参数' }, 400);

  const run = await getRun(token, owner, repo, runId);
  return json({
    status: run.status, // queued | in_progress | completed
    conclusion: run.conclusion, // success | failure | ... | null
    htmlUrl: run.html_url,
    logsUrl: run.logs_url,
    name: run.display_title || run.name,
    created: run.created_at,
    updated: run.updated_at
  });
}
