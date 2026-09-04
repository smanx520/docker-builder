import { handleApi } from './api/index.js';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    // API 路由
    if (url.pathname.startsWith('/api/')) {
      return handleApi(request, env, ctx, url);
    }
    // 其余请求走静态资源（前端页面）
    return env.ASSETS.fetch(request);
  }
};

