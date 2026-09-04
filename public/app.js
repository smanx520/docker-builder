(() => {
  'use strict';

  const $ = (id) => document.getElementById(id);

  // ---------- i18n ----------
  const I18N = {
    zh: {
      docTitle: 'Docker Builder · GitHub 一键打包',
      brandSub: 'GitHub 一键打包成 Docker 镜像',
      pageTitle: '把 GitHub 仓库打包成 Docker 镜像',
      desc: '输入仓库地址检测权限 → 选择分支 / Tag → 登录 GitHub 并配置打包选项 → 一键触发 GitHub Actions 构建并推送到镜像仓库。构建运行在 docker-builder 仓库，目标仓库只需可读取（公共仓库直接克隆，私有仓库填 Token）。',
      step1Name: '仓库检测与版本',
      step2Name: '打包配置',
      step3Name: '构建进度',
      footer: 'Cloudflare Workers · GitHub Actions · Docker Hub',
      repoPh: 'https://github.com/owner/repo 或 owner/repo',
      detect: '检测',
      detectNote: '说明：公共仓库无需 Token 即可直接检测；私有仓库需要一个能读取它的 Token。已登录且登录账户对该私有仓库有权限时，会自动复用登录身份，无需在此重复填写；仅当登录账户无权访问该仓库时，才需要在此单独填写一个可读取该仓库的 Token。',
      detectTokenPh: '检测用 GitHub Token（可选，仅私有仓库需要）',
      detecting: '检测中…',
      needRepo: '请输入仓库地址',
      parseEmpty: '仓库地址不能为空',
      parseFail: '无法解析仓库地址，支持 https://github.com/owner/repo 或 owner/repo',
      repo404: '仓库不存在或为私有仓库。公共仓库可直接检测；私有仓库请在「检测 Token」处填写可读取该仓库的 GitHub Token。',
      detectFail: '检测失败：{msg}',
      hasAccess: '✅ 有权限',
      privateTag: '（私有）',
      defaultBranchK: '默认分支',
      branchesK: '分支',
      tagsK: 'Tag',
      dockerfileK: 'Dockerfile',
      noDockerfile: '默认分支未找到（构建时会校验所选版本）',
      branchLabel: '分支（默认选择默认分支）',
      tagLabel: 'Tag / 版本（默认最新代码，可切换）',
      latestCode: '最新代码（默认分支）',
      step2Hint: '默认使用所选分支的最新代码；也可在右侧下拉选择某个 Tag 固定版本打包。构建时会自动检测所选版本是否包含 Dockerfile。',
      next: '下一步',
      back: '上一步',
      logout: '退出登录',
      authLoginOpt: 'GitHub 登录',
      authTokenOpt: '手动 Token',
      loginGithub: '登录 GitHub',
      tokenPh: 'ghp_xxx / github_pat_xxx（需要 repo + workflow 权限）',
      save: '保存',
      tokenHint: 'Token 仅保存在浏览器本地，请求时随 Authorization 头发送，不会上传到其它位置。',
      loggedInAs: '已登录 GitHub',
      needToken: '请输入 Token',
      forkIdle: '登录后可检查构建宿主 fork 状态',
      forkCheck: '检查',
      forkLink: '去 fork / 开启 Actions',
      forkChecking: '正在检查 fork 状态…',
      forkNotForked: '❌ 尚未 fork <b>{source}</b>，请先 fork 后返回重新检查',
      forkNoActions: '⚠️ 已 fork <b>{source}</b>，但 fork 未开启 GitHub Actions，请先启用后返回重新检查',
      forkOk: '✅ 已 fork <b>{source}</b> 且 Actions 已开启，可直接打包',
      forkCheckFailed: '❌ 检查失败：{msg}',
      imageTagLabel: '镜像 Tag',
      platformsLabel: '构建架构',
      envVarsLabel: '内置环境变量（每行 KEY=VALUE）',
      registryLabel: '推送平台',
      registryHint: 'GHCR（GitHub Container Registry）无需额外账号，镜像推送到 ghcr.io；勾选 Docker Hub 时需填写下方用户名与 Access Token。',
      dockerUserLabel: 'Docker Hub 用户名',
      dockerTokenLabel: 'Docker Hub Access Token',
      dockerUserPh: 'your_dockerhub_username',
      dockerTokenPh: 'Read & Write 权限的 Token',
      needDhubUser: '勾选了 Docker Hub，请填写 Docker Hub 用户名',
      needDhubToken: '勾选了 Docker Hub，请填写 Docker Hub Access Token',
      needRegistry: '请至少选择 GHCR 或 Docker Hub 作为推送平台',
      build: '开始打包',
      step3Hint: '在「GitHub 登录」与「手动 Token」中二选一完成认证并检查 fork 状态，再填写打包所需信息（推送到 Docker Hub 时才需要其凭据），即可开始打包。',
      buildTriggering: '正在触发…',
      needLoginFirst: '请先登录 GitHub',
      needDetectFirst: '请先完成仓库检测',
      stepTrigger: '触发 GitHub Actions',
      stepBuild: '构建镜像',
      stepPush: '推送到镜像仓库',
      queued: '排队中',
      building: '构建中',
      cannotLocateRun: '未能自动定位到构建任务，请在 <a href="{url}" target="_blank" rel="noopener">Actions 页面</a> 查看进度。',
      triggerFailed: '❌ 触发失败：{msg}',
      buildSuccess: '✅ 打包完成！',
      imageAddr: '镜像地址',
      pullCmd: '拉取命令',
      buildLog: '构建日志',
      viewActions: '查看 Actions',
      buildFailed: '❌ 构建失败，结论：{conclusion}',
      viewBuildLog: '查看构建日志',
      pollTimeout: '轮询超时，请到 <a href="{url}" target="_blank" rel="noopener">Actions 页面</a> 查看。',
      apiFail: '请求失败 ({status})'
    },
    en: {
      docTitle: 'Docker Builder · GitHub One-click Build',
      brandSub: 'Turn GitHub repos into Docker images',
      pageTitle: 'Build GitHub repos into Docker images',
      desc: 'Enter a repo URL to check access → pick a branch / tag → log in to GitHub and configure build options → trigger a GitHub Actions build and push to a registry. The build runs in the docker-builder repo; the target repo only needs to be readable (public repos clone anonymously, private repos need a Token).',
      step1Name: 'Detect & Version',
      step2Name: 'Build Config',
      step3Name: 'Progress',
      footer: 'Cloudflare Workers · GitHub Actions · Docker Hub',
      repoPh: 'https://github.com/owner/repo or owner/repo',
      detect: 'Detect',
      detectNote: 'Public repos need no Token to be detected; private repos need a Token with read access.',
      detectTokenPh: 'GitHub Token for detection (optional, private repos only)',
      detecting: 'Detecting…',
      needRepo: 'Please enter a repo URL',
      parseEmpty: 'Repo URL cannot be empty',
      parseFail: 'Cannot parse repo URL. Supported: https://github.com/owner/repo or owner/repo',
      repo404: 'Repo not found or it is private. Public repos can be detected directly; for private repos, provide a GitHub Token that can read it in the "detect Token" field.',
      detectFail: 'Detection failed: {msg}',
      hasAccess: '✅ Access OK',
      privateTag: ' (private)',
      defaultBranchK: 'Default branch',
      branchesK: 'Branches',
      tagsK: 'Tag',
      dockerfileK: 'Dockerfile',
      noDockerfile: 'Not found on default branch (re-checked during build)',
      branchLabel: 'Branch (default branch selected by default)',
      tagLabel: 'Tag / version (latest code by default, switchable)',
      latestCode: 'Latest code (default branch)',
      step2Hint: 'Uses the latest code of the selected branch by default; you can also pick a fixed Tag from the dropdown. The build re-checks that the selected version contains a Dockerfile.',
      next: 'Next',
      back: 'Back',
      logout: 'Log out',
      authLoginOpt: 'GitHub login',
      authTokenOpt: 'Manual token',
      loginGithub: 'Log in with GitHub',
      tokenPh: 'ghp_xxx / github_pat_xxx (needs repo + workflow scopes)',
      save: 'Save',
      tokenHint: 'The Token is stored only in your browser and sent with the Authorization header; it is never uploaded elsewhere.',
      loggedInAs: 'Logged in to GitHub',
      needToken: 'Please enter a Token',
      forkIdle: 'Log in to check the builder fork status',
      forkCheck: 'Check',
      forkLink: 'Fork / Enable Actions',
      forkChecking: 'Checking fork status…',
      forkNotForked: '❌ You have not forked <b>{source}</b>. Please fork it and check again',
      forkNoActions: '⚠️ <b>{source}</b> is forked, but GitHub Actions is not enabled on your fork. Enable it and check again',
      forkOk: '✅ <b>{source}</b> is forked and Actions is enabled, ready to build',
      forkCheckFailed: '❌ Check failed: {msg}',
      imageTagLabel: 'Image Tag',
      platformsLabel: 'Platforms',
      envVarsLabel: 'Built-in env vars (one KEY=VALUE per line)',
      registryLabel: 'Registry',
      registryHint: 'GHCR (GitHub Container Registry) needs no extra account; images push to ghcr.io. When Docker Hub is checked, fill in the username and Access Token below.',
      dockerUserLabel: 'Docker Hub username',
      dockerTokenLabel: 'Docker Hub Access Token',
      dockerUserPh: 'your_dockerhub_username',
      dockerTokenPh: 'Token with Read & Write access',
      needDhubUser: 'Docker Hub is selected; please enter the Docker Hub username',
      needDhubToken: 'Docker Hub is selected; please enter the Docker Hub Access Token',
      needRegistry: 'Please select at least GHCR or Docker Hub as the push target',
      build: 'Start Build',
      step3Hint: 'Pick either "GitHub login" or "Manual token" to authenticate and finish the fork check, then fill in the build options (Docker Hub credentials only needed when pushing to Docker Hub), and you are ready to build.',
      buildTriggering: 'Triggering…',
      needLoginFirst: 'Please log in to GitHub first',
      needDetectFirst: 'Please finish repo detection first',
      stepTrigger: 'Trigger GitHub Actions',
      stepBuild: 'Build image',
      stepPush: 'Push to registry',
      queued: 'Queued',
      building: 'Building',
      cannotLocateRun: 'Could not auto-locate the build run. Check the <a href="{url}" target="_blank" rel="noopener">Actions page</a> for progress.',
      triggerFailed: '❌ Trigger failed: {msg}',
      buildSuccess: '✅ Build complete!',
      imageAddr: 'Image',
      pullCmd: 'Pull command',
      buildLog: 'Build log',
      viewActions: 'View Actions',
      buildFailed: '❌ Build failed, conclusion: {conclusion}',
      viewBuildLog: 'View build log',
      pollTimeout: 'Polling timed out. Check the <a href="{url}" target="_blank" rel="noopener">Actions page</a>.',
      apiFail: 'Request failed ({status})'
    }
  };

  const LANG_KEY = 'db_lang';
  const DRAFT_KEY = 'db_draft';
  let lang = localStorage.getItem(LANG_KEY) || 'zh';

  const state = {
    token: localStorage.getItem('db_gh_token') || '',
    repo: null,
    build: null
  };

  // 当前步骤（1 仓库检测与版本 / 2 打包配置 / 3 构建进度）。
  // 声明在文件顶部：initFromUrl 会在文件后面部分声明该变量之前就调用 saveToken，必须提前初始化。
  let currentStep = 1;

  function t(key, vars) {
    let s = (I18N[lang] && I18N[lang][key]) || I18N.zh[key] || key;
    if (vars) for (const k in vars) s = s.split('{' + k + '}').join(String(vars[k]));
    return s;
  }

  function renderStatic() {
    document.title = t('docTitle');
    document.documentElement.lang = lang === 'en' ? 'en' : 'zh-CN';
    document.querySelectorAll('[data-i18n]').forEach((el) => { el.textContent = t(el.dataset.i18n); });
    document.querySelectorAll('[data-i18n-ph]').forEach((el) => { el.placeholder = t(el.dataset.i18nPh); });
  }

  const els = {
    userChip: $('user-chip'),
    btnLogin: $('btn-login'),
    btnLogout: $('btn-logout'),
    accountLogged: $('account-logged'),
    accountAnon: $('account-anon'),
    authPanelLogin: $('auth-panel-login'),
    authPanelToken: $('auth-panel-token'),
    btnNext: $('btn-next'),
    btnBackConfig: $('btn-back-config'),
    stepDetect: $('step-detect'),
    stepConfig: $('step-config'),
    stepProgress: $('step-progress'),
    inpRepo: $('inp-repo'),
    inpDetectToken: $('inp-detect-token'),
    btnDetect: $('btn-detect'),
    detectResult: $('detect-result'),
    versionPanel: $('version-panel'),
    selBranch: $('sel-branch'),
    selRef: $('sel-ref'),
    inpTag: $('inp-tag'),
    platforms: $('platforms'),
    registries: $('registries'),
    dhubFields: $('dhub-fields'),
    inpEnv: $('inp-env'),
    inpDhubUser: $('inp-dhub-user'),
    inpDhubToken: $('inp-dhub-token'),
    forkStatus: $('fork-status'),
    btnForkCheck: $('btn-fork-check'),
    forkLink: $('fork-link'),
    btnBuild: $('btn-build'),
    progress: $('progress'),
    buildResult: $('build-result')
  };

  // ---------- 登录态 ----------
  function saveToken(t) {
    state.token = t || '';
    if (t) {
      localStorage.setItem('db_gh_token', t);
      fetchUser().catch(() => {});
      // 已停在打包配置步骤时，登录后自动检查 fork 状态
      if (currentStep === 2) checkFork();
    } else {
      localStorage.removeItem('db_gh_token');
      sessionStorage.removeItem(DRAFT_KEY);
      state.user = null;
      resetFork();
    }
    renderAuth();
  }

  function renderAuth() {
    const logged = !!state.token;
    els.accountLogged.hidden = !logged;
    els.accountAnon.hidden = logged;
    if (logged) els.userChip.textContent = state.user ? state.user.login : t('loggedInAs');
  }

  // ---------- 认证方式：登录 / Token 二选一 ----------
  const AUTH_MODE_KEY = 'db_authmode';
  let authMode = localStorage.getItem(AUTH_MODE_KEY) || 'login';
  function setAuthMode(m) {
    authMode = m === 'token' ? 'token' : 'login';
    localStorage.setItem(AUTH_MODE_KEY, authMode);
    document.querySelectorAll('.auth-opt input[name="authmode"]').forEach((i) => { i.checked = (i.value === authMode); });
    els.authPanelLogin.hidden = authMode !== 'login';
    els.authPanelToken.hidden = authMode !== 'token';
  }
  document.querySelectorAll('.auth-opt input[name="authmode"]').forEach((i) => {
    i.addEventListener('change', () => setAuthMode(i.value));
  });

  // 从 URL 取 OAuth 回调的 token 并清理
  (function initFromUrl() {
    const u = new URL(location.href);
    const token = u.searchParams.get('access_token');
    if (token) {
      saveToken(token);
      u.searchParams.delete('access_token');
      history.replaceState(null, '', u.pathname + u.search);
      // OAuth 登录回来：恢复登录前填写的仓库与打包配置
      restoreDraft();
    }
  })();

  // ---------- API ----------
  async function api(path, options = {}) {
    const headers = { ...(options.headers || {}) };
    if (state.token) headers.Authorization = 'Bearer ' + state.token;
    if (options.body) headers['Content-Type'] = 'application/json';
    const res = await fetch(path, {
      method: options.method || 'GET',
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || t('apiFail', { status: res.status }));
    return data;
  }

  // ---------- 事件 ----------
  els.btnLogin.addEventListener('click', () => {
    saveDraft(); // OAuth 跳转前保存当前进度，登录后恢复
    location.href = '/api/auth/login';
  });
  els.btnLogout.addEventListener('click', () => {
    saveToken('');
    location.reload();
  });
  $('btn-save-token').addEventListener('click', () => {
    const v = $('inp-manual-token').value.trim();
    if (!v) return alert(t('needToken'));
    saveToken(v);
    $('inp-manual-token').value = '';
  });

  els.btnForkCheck.addEventListener('click', checkFork);

  // ---------- 构建宿主 fork 检查 ----------
  function setForkStatus(msg, cls) {
    els.forkStatus.className = 'fork-status' + (cls ? ' ' + cls : '');
    els.forkStatus.innerHTML = msg;
  }
  function resetFork() {
    els.forkLink.hidden = true;
    els.btnBuild.disabled = true;
    setForkStatus(t('forkIdle'), '');
  }
  async function checkFork() {
    if (!state.token) return resetFork();
    els.btnForkCheck.disabled = true;
    setForkStatus(t('forkChecking'), '');
    try {
      const s = await api('/api/fork-status');
      if (!s.forked) {
        els.forkLink.href = s.forkUrl;
        els.forkLink.hidden = false;
        els.btnBuild.disabled = true;
        setForkStatus(t('forkNotForked', { source: s.source }), 'err');
      } else if (!s.actionsEnabled) {
        els.forkLink.href = s.actionsUrl;
        els.forkLink.hidden = false;
        els.btnBuild.disabled = true;
        setForkStatus(t('forkNoActions', { source: s.source }), 'err');
      } else {
        els.forkLink.hidden = true;
        els.btnBuild.disabled = false;
        setForkStatus(t('forkOk', { source: s.source }), 'ok');
      }
    } catch (e) {
      els.forkLink.hidden = true;
      els.btnBuild.disabled = true;
      setForkStatus(t('forkCheckFailed', { msg: e.message }), 'err');
    } finally {
      els.btnForkCheck.disabled = false;
    }
  }

  // ---------- 步骤切换（同一时间只显示一步，可返回上一步） ----------
  const STEP_SECTIONS = { 1: 'step-detect', 2: 'step-config', 3: 'step-progress' };
  function setStep(n) {
    document.querySelectorAll('#stepper .sstep').forEach((el) => {
      const s = Number(el.dataset.step);
      el.classList.toggle('active', s === n);
      el.classList.toggle('done', s < n);
    });
  }
  function goToStep(n) {
    currentStep = n;
    for (const k in STEP_SECTIONS) {
      document.getElementById(STEP_SECTIONS[k]).hidden = (Number(k) !== n);
    }
    setStep(n);
  }

  // ---------- 草稿：OAuth 登录回来时恢复检测 / 打包进度 ----------
  function saveDraft() {
    const draft = {
      repo: els.inpRepo.value.trim(),
      detectToken: els.inpDetectToken.value.trim(),
      ref: els.selRef.value,
      branch: els.selBranch.value,
      tag: els.inpTag.value.trim(),
      env: els.inpEnv.value,
      dhubUser: els.inpDhubUser.value.trim(),
      dhubToken: els.inpDhubToken.value.trim(),
      registries: getRegistries(),
      platforms: [...els.platforms.querySelectorAll('input:checked')].map((i) => i.value)
    };
    sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  }
  async function restoreDraft() {
    let d;
    try { d = JSON.parse(sessionStorage.getItem(DRAFT_KEY) || 'null'); } catch { d = null; }
    if (!d || !d.repo) return;
    els.inpRepo.value = d.repo;
    els.inpDetectToken.value = d.detectToken || '';
    els.inpTag.value = d.tag || 'latest';
    els.inpEnv.value = d.env || '';
    els.inpDhubUser.value = d.dhubUser || '';
    els.inpDhubToken.value = d.dhubToken || '';
    els.platforms.querySelectorAll('input').forEach((i) => { i.checked = (d.platforms || []).includes(i.value); });
    els.registries.querySelectorAll('input').forEach((i) => { i.checked = (d.registries || ['ghcr']).includes(i.value); });
    renderRegistry();
    await detect(); // 重新检测并恢复分支 / Tag 列表
    if (d.ref) els.selRef.value = d.ref;
    if (d.branch && [...els.selBranch.options].some((o) => o.value === d.branch)) els.selBranch.value = d.branch;
    sessionStorage.removeItem(DRAFT_KEY);
    // 登录前停留在打包配置步骤，登录后直接回到该步骤并自动检查 fork
    goToStep(2);
    if (state.token) checkFork();
  }

  // ---------- 步骤导航 ----------
  // 第 1 步内检测成功后点「下一步」进入打包配置（第 2 步）
  els.btnNext.addEventListener('click', () => {
    goToStep(2);
    if (state.token) checkFork();
  });
  // 打包配置「上一步」返回第 1 步（仓库检测与版本）
  els.btnBackConfig.addEventListener('click', () => goToStep(1));

  // ---------- 语言切换 ----------
  function setLang(l) {
    lang = l === 'en' ? 'en' : 'zh';
    localStorage.setItem(LANG_KEY, lang);
    document.querySelectorAll('.lang-btn').forEach((b) => b.classList.toggle('on', b.dataset.lang === lang));
    renderStatic();
    renderAuth();
    // 重新渲染动态区域（保持当前步骤）
    if (els.inpRepo.value.trim()) detect(true);
    if (currentStep === 2) {
      if (state.token) checkFork();
      else resetFork();
    }
  }
  document.querySelectorAll('.lang-btn').forEach((b) => {
    b.addEventListener('click', () => setLang(b.dataset.lang));
  });

  els.btnDetect.addEventListener('click', () => detect());
  els.inpRepo.addEventListener('keydown', (e) => { if (e.key === 'Enter') detect(); });

  // ---------- 仓库检测（浏览器直连 GitHub API，公共仓库无需登录 / Token） ----------
  const GH_API = 'https://api.github.com';

  function parseRepoUrl(raw) {
    const s = (raw || '').trim();
    if (!s) throw new Error(t('parseEmpty'));
    let m = s.match(/^git@github\.com:([^/]+)\/([^/]+?)(?:\.git)?\/?$/);
    if (m) return { owner: m[1], repo: m[2] };
    m = s.match(/^https?:\/\/(?:www\.)?github\.com\/([^/]+)\/([^/]+?)(?:\.git)?\/?$/);
    if (m) return { owner: m[1], repo: m[2] };
    m = s.match(/^([^/\s]+)\/([^/\s]+?)(?:\.git)?\/?$/);
    if (m) return { owner: m[1], repo: m[2] };
    throw new Error(t('parseFail'));
  }

  // 直连 GitHub API。token 为空时按匿名访问（公共仓库可读）
  async function ghApi(token, path) {
    const headers = { Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' };
    if (token) headers.Authorization = 'Bearer ' + token;
    const res = await fetch(GH_API + path, { headers });
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      if (res.status === 404) throw new Error(t('repo404'));
      const msg = (data && data.message) || `GitHub API ${res.status}`;
      throw new Error(t('detectFail', { msg }));
    }
    return data;
  }

  async function detect(silent = false) {
    const repoUrl = els.inpRepo.value.trim();
    if (!repoUrl) return alert(t('needRepo'));
    // 优先用「检测 Token」；未填时自动复用登录账户 Token（可读私有仓库）；两者皆无则匿名（公共仓库）
    const detectToken = els.inpDetectToken.value.trim() || state.token || '';
    setBtn(els.btnDetect, true, t('detecting'));
    els.versionPanel.hidden = true;
    show(els.detectResult, t('detecting'), '');
    try {
      const { owner, repo } = parseRepoUrl(repoUrl);
      // 1) 仓库信息：可读取即视为有权限（公共仓库匿名即可，私有仓库需 Token）
      const info = await ghApi(detectToken, `/repos/${owner}/${repo}`);
      const branch = info.default_branch;
      // 2) 分支 + Tag 列表（并行拉取）
      const [branches, tags] = await Promise.all([
        ghApi(detectToken, `/repos/${owner}/${repo}/branches?per_page=100`).catch(() => []),
        ghApi(detectToken, `/repos/${owner}/${repo}/tags?per_page=100`).catch(() => [])
      ]);
      const branchList = Array.isArray(branches) ? branches : [];
      const tagList = Array.isArray(tags) ? tags : [];
      // 3) 默认分支上的 Dockerfile（参考用；构建时会按所选版本再次校验）
      let dockerfile = null;
      try {
        const rootItems = await ghApi(detectToken, `/repos/${owner}/${repo}/contents?ref=${encodeURIComponent(branch)}`);
        const files = Array.isArray(rootItems) ? rootItems : [];
        const rootFile = files.find((i) => i.type === 'file' && /^Dockerfile/.test(i.name));
        if (rootFile) {
          dockerfile = rootFile.path;
        } else if (files.some((i) => i.type === 'dir' && i.name === 'docker')) {
          const dockerItems = await ghApi(detectToken, `/repos/${owner}/${repo}/contents/docker?ref=${encodeURIComponent(branch)}`);
          const f = (Array.isArray(dockerItems) ? dockerItems : []).find((i) => i.type === 'file' && /^Dockerfile/.test(i.name));
          if (f) dockerfile = f.path;
        }
      } catch {
        dockerfile = null;
      }

      // 填充分支下拉（默认默认分支）
      els.selBranch.innerHTML = '';
      branchList.forEach((b) => {
        const opt = document.createElement('option');
        opt.value = b.name;
        opt.textContent = b.name;
        els.selBranch.appendChild(opt);
      });
      if (branchList.some((b) => b.name === branch)) els.selBranch.value = branch;

      // 填充 Tag 下拉（默认「最新代码」）
      els.selRef.innerHTML = `<option value="">${t('latestCode')}</option>`;
      tagList.forEach((tg) => {
        const opt = document.createElement('option');
        opt.value = tg.name;
        opt.textContent = tg.name;
        els.selRef.appendChild(opt);
      });

      state.repo = { owner, repo, fullName: info.full_name, private: info.private, branch, branches: branchList, tags: tagList };
      renderAuth();
      // 检测成功后：在本步内显示「选择版本」区域 + 「下一步」按钮（点下一步进入打包配置）
      els.versionPanel.hidden = (silent === true || currentStep !== 1);

      const dfText = dockerfile
        ? `<span class="k">${t('dockerfileK')}:</span> <code>${dockerfile}</code>`
        : `<span class="k">${t('dockerfileK')}:</span> ${t('noDockerfile')}`;
      show(els.detectResult,
        `${t('hasAccess')} · <b>${info.full_name}</b>${info.private ? t('privateTag') : ''}<br>` +
        `<span class="k">${t('defaultBranchK')}:</span> <code>${branch}</code> · ` +
        `<span class="k">${t('branchesK')}:</span> ${branchList.length} · <span class="k">${t('tagsK')}:</span> ${tagList.length} · ${dfText}`,
        dockerfile ? 'ok' : '');
    } catch (e) {
      els.versionPanel.hidden = true;
      show(els.detectResult, `❌ ${e.message}`, 'err');
    } finally {
      setBtn(els.btnDetect, false, t('detect'));
    }
  }

  // ---------- 推送平台（registry） ----------
  function getRegistries() {
    return [...els.registries.querySelectorAll('input:checked')].map((i) => i.value);
  }
  function renderRegistry() {
    const showDhub = getRegistries().includes('dockerhub');
    els.dhubFields.hidden = !showDhub;
  }
  els.registries.addEventListener('change', renderRegistry);

  els.btnBuild.addEventListener('click', startBuild);

  async function startBuild() {
    if (!state.token) return alert(t('needLoginFirst'));
    if (!state.repo) return alert(t('needDetectFirst'));
    const registries = getRegistries();
    if (!registries.length) return alert(t('needRegistry'));
    const useDhub = registries.includes('dockerhub');
    if (useDhub && !els.inpDhubUser.value.trim()) return alert(t('needDhubUser'));
    if (useDhub && !els.inpDhubToken.value.trim()) return alert(t('needDhubToken'));
    const platforms = [...els.platforms.querySelectorAll('input:checked')].map((i) => i.value);
    // 选择了 Tag 则以 Tag 为准；否则用所选分支（默认默认分支）的最新代码
    const ref = els.selRef.value || els.selBranch.value || '';
    const body = {
      repoUrl: els.inpRepo.value.trim(),
      ref,
      tag: els.inpTag.value.trim(),
      platforms,
      registries,
      envVars: els.inpEnv.value,
      dockerHubUsername: els.inpDhubUser.value.trim(),
      dockerHubToken: els.inpDhubToken.value.trim(),
      // 私有目标仓库的读取 Token：优先「检测 Token」，否则用登录 Token
      gitToken: els.inpDetectToken.value.trim() || state.token || ''
    };
    setBtn(els.btnBuild, true, t('buildTriggering'));
    goToStep(3);
    renderSteps([
      { label: t('stepTrigger'), state: 'active' },
      { label: t('stepBuild'), state: '' },
      { label: t('stepPush'), state: '' }
    ]);
    hide(els.buildResult);
    try {
      const r = await api('/api/build', { method: 'POST', body });
      // images 为完整镜像地址数组（GHCR / Docker Hub）
      state.build = { images: r.images || [], tag: r.tag, owner: r.owner, repo: r.repo };
      renderSteps([
        { label: t('stepTrigger'), state: 'done' },
        { label: t('stepBuild'), state: 'active' },
        { label: t('stepPush'), state: '' }
      ]);
      if (r.runId) {
        poll(r.runId, r.owner, r.repo);
      } else {
        renderSteps([
          { label: t('stepTrigger'), state: 'done' },
          { label: t('stepBuild'), state: 'active' },
          { label: t('stepPush'), state: '' }
        ]);
        show(els.buildResult, t('cannotLocateRun', { url: `https://github.com/${r.owner}/${r.repo}/actions` }), '');
      }
    } catch (e) {
      renderSteps([
        { label: t('stepTrigger'), state: 'fail' },
        { label: t('stepBuild'), state: '' },
        { label: t('stepPush'), state: '' }
      ]);
      show(els.buildResult, t('triggerFailed', { msg: e.message }), 'err');
    } finally {
      setBtn(els.btnBuild, false, t('build'));
    }
  }

  async function poll(runId, owner, repo) {
    const started = Date.now();
    const timer = setInterval(async () => {
      if (!state.build) return clearInterval(timer);
      try {
        const s = await api(`/api/status?owner=${owner}&repo=${repo}&run_id=${runId}`);
        if (s.status === 'queued') {
          renderSteps([
            { label: t('stepTrigger'), state: 'done' },
            { label: t('stepBuild'), state: 'active', extra: t('queued') },
            { label: t('stepPush'), state: '' }
          ]);
        } else if (s.status === 'in_progress') {
          renderSteps([
            { label: t('stepTrigger'), state: 'done' },
            { label: t('stepBuild'), state: 'active', extra: t('building') },
            { label: t('stepPush'), state: 'active' }
          ]);
        } else if (s.status === 'completed') {
          clearInterval(timer);
          const ok = s.conclusion === 'success';
          renderSteps([
            { label: t('stepTrigger'), state: 'done' },
            { label: t('stepBuild'), state: ok ? 'done' : 'fail' },
            { label: t('stepPush'), state: ok ? 'done' : 'fail' }
          ]);
          if (ok) {
            const images = state.build.images || [];
            const imgHtml = images.map((img) => `<code>${img}</code>`).join('<br>');
            const primary = images[0] || '';
            show(els.buildResult,
              t('buildSuccess') + '<br>' +
              `<span class="k">${t('imageAddr')}:</span><br>${imgHtml}<br>` +
              (primary ? `<span class="k">${t('pullCmd')}:</span> <code>docker pull ${primary}</code><br>` : '') +
              `<span class="k">${t('buildLog')}:</span> <a href="${s.htmlUrl}" target="_blank" rel="noopener">${t('viewActions')}</a>`,
              'ok');
          } else {
            show(els.buildResult,
              t('buildFailed', { conclusion: s.conclusion || 'unknown' }) + '<br>' +
              `<a href="${s.htmlUrl}" target="_blank" rel="noopener">${t('viewBuildLog')}</a>`,
              'err');
          }
        }
      } catch (e) {
        // 轮询出错不中断，超时兜底
        if (Date.now() - started > 900000) {
          clearInterval(timer);
          show(els.buildResult, t('pollTimeout', { url: `https://github.com/${owner}/${repo}/actions` }), '');
        }
      }
    }, 4000);
  }

  // ---------- 渲染辅助 ----------
  function renderSteps(steps) {
    els.progress.innerHTML = steps.map((s) =>
      `<div class="pstep ${s.state}"><span class="dot"></span><span>${s.label}${s.extra ? ` <span class="k">(${s.extra})</span>` : ''}</span></div>`
    ).join('');
  }
  function show(el, html, cls) {
    el.className = 'result ' + cls;
    el.innerHTML = html;
    el.hidden = false;
  }
  function hide(el) { el.hidden = true; }
  function setBtn(btn, disabled, text) {
    btn.disabled = disabled;
    btn.textContent = text;
  }

  // ---------- 启动 ----------
  async function fetchUser() {
    const r = await api('/api/whoami');
    state.user = r;
    els.userChip.textContent = r.login;
  }

  renderStatic();
  document.querySelectorAll('.lang-btn').forEach((b) => b.classList.toggle('on', b.dataset.lang === lang));
  setAuthMode(authMode);
  goToStep(1);
  renderRegistry();
  if (state.token) fetchUser().catch(() => {});
  renderAuth();
})();
