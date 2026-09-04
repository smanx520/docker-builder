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
      noDockerfileInRef: '⚠️ 所选版本 {ref} 在仓库根目录未检测到 Dockerfile，构建会失败，请更换版本或确认 Dockerfile 在根目录',
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
      forkSetupRunning: '正在自动检测并准备 fork（未 fork 将自动创建并同步到最新）…',
      forkChecked: '已检测到已 fork',
      forkCreated: '已自动创建 fork',
      forkUpToDate: '已是最新版本',
      forkUpdated: '已同步到最新版本',
      forkSyncConflict: '⚠️ fork 与上游存在冲突，未能自动同步，请手动处理',
      forkActionsEnabled: 'GitHub Actions 已开启',
      forkActionsManual: '⚠️ 需要手动开启 GitHub Actions',
      imageTagLabel: '镜像 Tag',
      platformsLabel: '构建架构',
      envVarsLabel: '内置环境变量（每行 KEY=VALUE）',
      registryLabel: '推送平台',
      registryHint: 'GHCR（GitHub Container Registry）无需额外账号，镜像推送到 ghcr.io；勾选 Docker Hub 时需填写下方用户名与 Access Token。',
      visibilityLabel: '镜像可见性',
      visibilityPublic: '公开',
      visibilityPrivate: '私有',
      visibilityHint: 'GHCR 镜像会在推送后自动设置可见性；Docker Hub 的可见性由其仓库默认设置决定，需在 Docker Hub 网页端手动调整。',
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
      noDockerfileInRef: '⚠️ No Dockerfile found at repo root for {ref} — the build will fail. Pick another version or make sure the Dockerfile is at the root.',
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
      forkSetupRunning: 'Checking fork and preparing automatically (forks and syncs if needed)…',
      forkChecked: 'Fork detected',
      forkCreated: 'Fork created automatically',
      forkUpToDate: 'Up to date',
      forkUpdated: 'Synced to latest',
      forkSyncConflict: '⚠️ Conflict with upstream, auto-sync failed — resolve manually',
      forkActionsEnabled: 'GitHub Actions enabled',
      forkActionsManual: '⚠️ GitHub Actions must be enabled manually',
      imageTagLabel: 'Image Tag',
      platformsLabel: 'Platforms',
      envVarsLabel: 'Built-in env vars (one KEY=VALUE per line)',
      registryLabel: 'Registry',
      registryHint: 'GHCR (GitHub Container Registry) needs no extra account; images push to ghcr.io. When Docker Hub is checked, fill in the username and Access Token below.',
      visibilityLabel: 'Image visibility',
      visibilityPublic: 'Public',
      visibilityPrivate: 'Private',
      visibilityHint: 'GHCR image visibility is set automatically after the push; Docker Hub visibility follows its repository default settings and must be adjusted manually on Docker Hub.',
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
      retryHint: 'Please confirm you have forked the builder repo and enabled GitHub Actions, then retry below.',
      retryNotForked: '❌ <b>{source}</b> has not been forked. <a href="{url}" target="_blank" rel="noopener">Fork it</a> and enable Actions, then retry.',
      retryNoActions: '⚠️ <b>{source}</b> is forked, but GitHub Actions is not enabled. <a href="{url}" target="_blank" rel="noopener">Enable Actions</a> and retry.',
      confirmRetry: 'Confirm & Retry',
      retrying: 'Confirming & retrying…',
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
  // 会话持久化：表单 + 当前步骤 + 构建状态，页面刷新 / OAuth 跳转后恢复
  const SESSION_KEY = 'db_session';
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
    configFields: $('config-fields'),
    btnBuild: $('btn-build'),
    progress: $('progress'),
    buildResult: $('build-result'),
    btnBackProgress: $('btn-back-progress')
  };

  // ---------- 登录态 ----------
  function saveToken(t) {
    state.token = t || '';
    if (t) {
      localStorage.setItem('db_gh_token', t);
      fetchUser().catch(() => {});
      // 已停在打包配置步骤时，登录后自动准备 fork
      if (currentStep === 2) setupFork();
    } else {
      localStorage.removeItem('db_gh_token');
      localStorage.removeItem(SESSION_KEY);
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
      // 登录后的表单 / 步骤 / 构建状态统一在启动流程 restoreState() 中恢复
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
    persistState(); // OAuth 跳转前保存当前进度，登录后恢复
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

  els.btnForkCheck.addEventListener('click', setupFork);

  // ---------- 构建宿主 fork 自动准备：检测 → 自动 fork → 同步最新 → 开启 Actions ----------
  function setForkStatus(msg, cls) {
    els.forkStatus.className = 'fork-status' + (cls ? ' ' + cls : '');
    els.forkStatus.innerHTML = msg;
  }
  // 渲染 fork 准备步骤列表（done / active / fail）
  function setForkSteps(steps, cls) {
    els.forkStatus.className = 'fork-status' + (cls ? ' ' + cls : '');
    els.forkStatus.innerHTML = steps.map((s) =>
      `<div class="fstep ${s.state}"><span class="dot"></span><span>${t(s.key)}</span></div>`
    ).join('');
  }
  // 打包配置只在 fork 就绪后可见；否则隐藏操作相关内容
  function setConfigVisible(visible) {
    els.configFields.hidden = !visible;
    els.btnBuild.hidden = !visible;
    els.btnBuild.disabled = !visible;
  }
  function resetFork() {
    els.forkLink.hidden = true;
    setConfigVisible(false);
    setForkStatus(t('forkIdle'), '');
  }
  async function setupFork() {
    if (!state.token) return resetFork();
    els.btnForkCheck.disabled = true;
    els.btnForkCheck.classList.add('is-loading'); // 自动准备中：按钮显示 loading
    setForkStatus(t('forkSetupRunning'), '');
    els.forkLink.hidden = true;
    setConfigVisible(false);
    try {
      const s = await api('/api/fork-setup', { method: 'POST' });
      if (!s || s.ok === false || s.error) throw new Error(s && s.error ? s.error : t('forkCheckFailed', { msg: '' }));
      if (!s.canBuild) {
        // 同步冲突：无自动解法，仅展示步骤；Actions 未开启：给出手动开启链接
        if (s.conflict) {
          els.forkLink.hidden = true;
        } else {
          els.forkLink.href = s.actionsUrl;
          els.forkLink.hidden = false;
        }
        setConfigVisible(false);
        setForkSteps(s.steps, 'err');
        return;
      }
      els.forkLink.hidden = true;
      setConfigVisible(true);
      setForkSteps(s.steps, 'ok');
    } catch (e) {
      els.forkLink.hidden = true;
      setConfigVisible(false);
      setForkStatus(t('forkCheckFailed', { msg: e.message }), 'err');
    } finally {
      els.btnForkCheck.disabled = false;
      els.btnForkCheck.classList.remove('is-loading');
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
    persistState(); // 切换步骤时显式保存当前进度（不再依赖 beforeunload）
  }

  // ---------- 会话持久化：页面刷新 / OAuth 跳转后恢复表单、步骤与构建状态 ----------
  function persistState() {
    const snap = {
      repo: els.inpRepo.value.trim(),
      detectToken: els.inpDetectToken.value.trim(),
      ref: els.selRef.value,
      branch: els.selBranch.value,
      tag: els.inpTag.value.trim(),
      env: els.inpEnv.value,
      dhubUser: els.inpDhubUser.value.trim(),
      dhubToken: els.inpDhubToken.value.trim(),
      registries: getRegistries(),
      visibility: getVisibility(),
      platforms: [...els.platforms.querySelectorAll('input:checked')].map((i) => i.value),
      // 保存分支 / Tag 列表与仓库元信息：刷新后纯回填下拉框，无需重新请求 GitHub。
      // 兼容两种形态：detect 写入的对象（{name}）与会话恢复写入的字符串，并剔除脏数据（null/undefined）
      branches: state.repo ? (state.repo.branches || []).map((b) => (b && b.name !== undefined ? b.name : b)).filter((n) => typeof n === 'string') : [],
      tags: state.repo ? (state.repo.tags || []).map((t) => (t && t.name !== undefined ? t.name : t)).filter((n) => typeof n === 'string') : [],
      repoMeta: state.repo ? { owner: state.repo.owner, repo: state.repo.repo, fullName: state.repo.fullName, private: state.repo.private, branch: state.repo.branch } : null,
      step: currentStep,
      build: state.build
    };
    try { localStorage.setItem(SESSION_KEY, JSON.stringify(snap)); } catch { /* 忽略写入失败 */ }
  }
  // 表单变更（select / checkbox / blur）即持久化——这就是「一步步保存」；
  // 不再监听 beforeunload：避免刷新 / 关闭页面时把内存状态写回 localStorage，导致清空数据后数据又复活。
  // 其余保存点见 goToStep()、detect() 成功处、构建触发与轮询更新处的显式 persistState() 调用。
  document.addEventListener('change', (e) => {
    if (e.target && e.target.closest && e.target.closest('.step')) persistState();
  });

  // 刷新 / OAuth 回跳后恢复：只回填表单 / 下拉框 / 步骤，不触发检测、不触发「下一步」、不触发 fork 检查等动作
  function restoreState() {
    let s;
    try { s = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null'); } catch { s = null; }
    if (!s || !s.repo) return;

    els.inpRepo.value = s.repo;
    els.inpDetectToken.value = s.detectToken || '';
    els.inpTag.value = s.tag || 'latest';
    els.inpEnv.value = s.env || '';
    els.inpDhubUser.value = s.dhubUser || '';
    els.inpDhubToken.value = s.dhubToken || '';
    els.platforms.querySelectorAll('input').forEach((i) => { i.checked = (s.platforms || []).includes(i.value); });
    els.registries.querySelectorAll('input').forEach((i) => { i.checked = (s.registries || ['ghcr']).includes(i.value); });
    document.querySelectorAll('input[name="visibility"]').forEach((i) => { i.checked = (i.value === (s.visibility || 'public')); });
    renderRegistry();

    const step = s.step || 1;

    // 用会话中保存的分支 / Tag 列表纯回填下拉框（不发请求、不触发检测）。
    // 兼容旧会话里的对象 / 字符串 / 脏数据（null/undefined），统一清洗为字符串数组
    const branches = (Array.isArray(s.branches) ? s.branches : []).map((b) => (b && b.name !== undefined ? b.name : b)).filter((n) => typeof n === 'string');
    const tags = (Array.isArray(s.tags) ? s.tags : []).map((t) => (t && t.name !== undefined ? t.name : t)).filter((n) => typeof n === 'string');
    els.selBranch.innerHTML = '';
    branches.forEach((b) => {
      const opt = document.createElement('option');
      opt.value = b;
      opt.textContent = b;
      els.selBranch.appendChild(opt);
    });
    if (s.branch && branches.includes(s.branch)) els.selBranch.value = s.branch;
    els.selRef.innerHTML = `<option value="">${t('latestCode')}</option>`;
    tags.forEach((tg) => {
      const opt = document.createElement('option');
      opt.value = tg;
      opt.textContent = tg;
      els.selRef.appendChild(opt);
    });
    if (s.ref && tags.includes(s.ref)) els.selRef.value = s.ref;

    // 恢复仓库元信息（构建与后续手动检测依赖），仅数据回填，不发起请求
    if (s.repoMeta) {
      state.repo = {
        owner: s.repoMeta.owner,
        repo: s.repoMeta.repo,
        fullName: s.repoMeta.fullName,
        private: s.repoMeta.private,
        branch: s.repoMeta.branch,
        branches,
        tags
      };
    }

    // 版本选择区域：回到第 1 步且有分支 / Tag 数据时才展示（仅展示，不触发 Dockerfile 检测）
    els.versionPanel.hidden = (step !== 1) || (branches.length === 0 && tags.length === 0);

    if (s.build) {
      state.build = { images: s.build.images || [], tag: s.build.tag, owner: s.build.owner, repo: s.build.repo, runId: s.build.runId || null };
    }

    if (step === 3 && state.build) {
      // 正在 / 曾经构建：回到构建进度并恢复轮询（若已完成会直接显示成功 / 失败）
      goToStep(3);
      renderSteps([
        { label: t('stepTrigger'), state: 'done' },
        { label: t('stepBuild'), state: 'active' },
        { label: t('stepPush'), state: '' }
      ]);
      if (state.build.runId) {
        hide(els.buildResult);
        poll(state.build.runId, state.build.owner, state.build.repo);
      } else {
        show(els.buildResult, t('cannotLocateRun', { url: `https://github.com/${state.build.owner}/${state.build.repo}/actions` }), '');
        setBackProgress(true);
      }
      return;
    }

    goToStep(step >= 2 ? 2 : 1);
    if (step === 1) {
      // 回填后不自动触发 Dockerfile 检测：先把「下一步」置灰，待用户切换分支 / Tag 重新校验后再放开
      setNextEnabled(false);
    } else if (step === 2) {
      // 只回填打包配置数据，不自动触发 fork 检查：配置区保持隐藏，fork 状态显示为待检查，待用户点「检查」通过后再显示
      resetFork();
    }
  }

  // ---------- 步骤导航 ----------
  // 第 1 步内检测成功后点「下一步」进入打包配置（第 2 步）
  function setNextEnabled(enabled) {
    els.btnNext.disabled = !enabled;
  }
  // Dockerfile 检测中：按钮进入加载态并禁止点击；结束时由 setNextEnabled 决定最终可用状态
  function setNextLoading(loading) {
    els.btnNext.classList.toggle('is-loading', loading);
    if (loading) els.btnNext.disabled = true;
  }
  els.btnNext.addEventListener('click', () => {
    // 进入打包配置前，把第一步当前所选 Tag 同步到「镜像 Tag」，确保一定带过去
    const v = els.selRef.value;
    if (v) els.inpTag.value = v;
    goToStep(2);
    if (state.token) setupFork();
  });
  // 打包配置「上一步」返回第 1 步（仓库检测与版本）
  els.btnBackConfig.addEventListener('click', () => {
    goToStep(1);
    // 已检测到仓库时，重新展示版本选择区域（含分支 / Tag），避免返回后看不到 tag
    if (state.repo) els.versionPanel.hidden = false;
  });
  // 构建进度「上一步」返回打包配置（仅在构建停止后显示）；返回时清除构建状态以停止轮询
  function setBackProgress(visible) {
    els.btnBackProgress.hidden = !visible;
  }
  els.btnBackProgress.addEventListener('click', () => {
    state.build = null; // 清除以停止 poll 轮询
    persistState();
    goToStep(2);
    if (state.token) setupFork();
    else resetFork();
  });

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
      if (state.token) setupFork();
      else resetFork();
    }
  }
  document.querySelectorAll('.lang-btn').forEach((b) => {
    b.addEventListener('click', () => setLang(b.dataset.lang));
  });

  els.btnDetect.addEventListener('click', () => detect());
  els.inpRepo.addEventListener('keydown', (e) => { if (e.key === 'Enter') detect(); });
  // 第一步选择 Tag 时，同步第二步的「镜像 Tag」；选择「最新代码」时不改动
  els.selRef.addEventListener('change', () => {
    const v = els.selRef.value;
    if (v) els.inpTag.value = v;
    checkRefDockerfile();
  });
  els.selBranch.addEventListener('change', checkRefDockerfile);

  // 校验所选分支 / Tag 是否包含 Dockerfile（构建按所选版本检出，默认分支有 ≠ 该版本有）
  let refCheckSeq = 0; // 并发校验序号：只让最新一次检测更新按钮状态
  async function checkRefDockerfile() {
    const hint = $('sel-ref-hint');
    if (!state.repo) { hint.hidden = true; setNextEnabled(false); return; }
    const ref = els.selRef.value || els.selBranch.value || state.repo.branch;
    if (!ref) { hint.hidden = true; setNextEnabled(false); return; }
    const token = els.inpDetectToken.value.trim() || state.token || '';
    const seq = ++refCheckSeq;
    setNextLoading(true); // 检测中：按钮显示 loading 并不可点击
    try {
      const rootItems = await ghApi(token, `/repos/${state.repo.owner}/${state.repo.repo}/contents?ref=${encodeURIComponent(ref)}`);
      if (seq !== refCheckSeq) return; // 已被更新的检测覆盖，丢弃本次结果
      const files = Array.isArray(rootItems) ? rootItems : [];
      const rootFile = files.find((i) => i.type === 'file' && /^Dockerfile/.test(i.name));
      const df = rootFile ? rootFile.path : null;
      setNextEnabled(!!df); // 未检测到 Dockerfile 时「下一步」置灰
      hint.hidden = false;
      hint.className = 'hint' + (df ? ' ok' : ' warn');
      hint.innerHTML = df
        ? `<span class="k">${t('dockerfileK')}:</span> <code>${df}</code>（${ref}）`
        : t('noDockerfileInRef', { ref });
    } catch {
      if (seq !== refCheckSeq) return;
      hint.hidden = true;
      setNextEnabled(false); // 校验失败视为未检测到 Dockerfile，「下一步」保持置灰
    } finally {
      if (seq === refCheckSeq) setNextLoading(false); // 结束加载态，最终可用状态已由 setNextEnabled 设置
    }
  }

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
    setBtn(els.btnDetect, true, t('detecting'));
    els.versionPanel.hidden = true;
    setNextEnabled(false); // 重新检测期间禁用「下一步」
    show(els.detectResult, t('detecting'), '');
    try {
      const { owner, repo } = parseRepoUrl(repoUrl);
      // 公共仓库匿名即可检测；匿名失败（私有仓库 / 限流）再退回「检测 Token」或登录 Token。
      // 先匿名可避免本地残留的无效 Token 让公共仓库检测也返回 401。
      let info;
      let detectToken = '';
      try {
        info = await ghApi('', `/repos/${owner}/${repo}`);
      } catch {
        detectToken = els.inpDetectToken.value.trim() || state.token || '';
        if (!detectToken) throw new Error(t('repo404'));
        info = await ghApi(detectToken, `/repos/${owner}/${repo}`);
      }
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
        if (rootFile) dockerfile = rootFile.path;
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
      checkRefDockerfile(); // 校验当前所选分支 / Tag 的 Dockerfile
      persistState(); // 检测成功后立即保存仓库 / 分支 / Tag 数据，刷新可直接回填
    } catch (e) {
      els.versionPanel.hidden = true;
      setNextEnabled(false); // 检测失败：「下一步」置灰
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

  // ---------- 镜像可见性（public / private，默认 public） ----------
  function getVisibility() {
    const checked = document.querySelector('input[name="visibility"]:checked');
    return checked ? checked.value : 'public';
  }

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
      visibility: getVisibility(),
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
      state.build = { images: r.images || [], tag: r.tag, owner: r.owner, repo: r.repo, runId: r.runId || null };
      setBackProgress(false); // 构建进行中不显示「上一步」
      persistState(); // 记录构建状态，刷新后恢复进度
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
        setBackProgress(true);
      }
    } catch (e) {
      state.build = null; // 触发失败：没有可轮询的构建，刷新后回到打包配置
      persistState();
      renderSteps([
        { label: t('stepTrigger'), state: 'fail' },
        { label: t('stepBuild'), state: '' },
        { label: t('stepPush'), state: '' }
      ]);
      renderRetry(t('triggerFailed', { msg: e.message }) + '<br><span class="k">' + t('retryHint') + '</span>', 'err');
    } finally {
      setBtn(els.btnBuild, false, t('build'));
    }
  }

  // 触发失败后：展示失败原因 + 「确认并重试」按钮（重试前先确认 fork 与 Actions 状态）
  function renderRetry(msgHtml, cls) {
    show(els.buildResult,
      msgHtml + '<div class="retry-row"><button type="button" class="btn btn-primary">' + t('confirmRetry') + '</button></div>',
      cls);
    els.buildResult.querySelector('.retry-row button').addEventListener('click', retryBuild);
    setBackProgress(true); // 构建已停止，允许返回打包配置
  }
  async function retryBuild() {
    const btn = els.buildResult.querySelector('.retry-row button');
    if (btn) { btn.disabled = true; btn.textContent = t('retrying'); }
    try {
      const s = await api('/api/fork-status');
      if (!s.forked) {
        renderRetry(t('retryNotForked', { source: s.source, url: s.forkUrl }), 'err');
        return;
      }
      if (!s.actionsEnabled) {
        renderRetry(t('retryNoActions', { source: s.source, url: s.actionsUrl }), 'err');
        return;
      }
      // 已 fork 且 Actions 已开启 → 重新触发构建
      startBuild();
    } catch (e) {
      renderRetry(t('forkCheckFailed', { msg: e.message }), 'err');
    }
  }

  async function poll(runId, owner, repo) {
    const started = Date.now();
    let timer = null;
    const check = async () => {
      if (!state.build) { if (timer) clearInterval(timer); return; }
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
          if (timer) clearInterval(timer);
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
          setBackProgress(true); // 构建结束，显示「上一步」
          persistState();
        }
      } catch (e) {
        // 轮询出错不中断，超时兜底
        if (Date.now() - started > 900000) {
          if (timer) clearInterval(timer);
          show(els.buildResult, t('pollTimeout', { url: `https://github.com/${owner}/${repo}/actions` }), '');
          setBackProgress(true);
        }
      }
    };
    check(); // 立即查询一次，刷新恢复时马上拿到最新状态
    timer = setInterval(check, 4000);
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
  // 登录相关只在「打包配置」步骤触发（saveToken / checkFork），不要在页面加载时自动请求 whoami
  renderAuth();
  // 恢复上次会话：表单 / 步骤 / 进行中的构建（刷新后依然显示「构建中」或最新结果）
  restoreState();
})();
