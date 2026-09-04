# Docker Builder · GitHub 一键打包成 Docker 镜像

> 输入一个 GitHub 仓库地址，即可一键把它构建成 Docker 镜像并推送到 GHCR / Docker Hub。
> 构建运行在你的 GitHub Actions 上，目标仓库只需可读即可，无需任何写权限。

[English README](./README.en.md)

## 它是什么

Docker Builder 是一个基于 **Cloudflare Workers + GitHub Actions** 的镜像打包工具：

- 前端页面（静态资源）由 Cloudflare Worker 托管，纯原生 JS，无框架依赖；
- 用户输入**目标仓库地址**，Worker 校验权限、列出分支 / Tag、检查 Dockerfile；
- 用户登录 GitHub 并配置打包选项后，Worker 通过 `workflow_dispatch` 触发**构建宿主仓库**（你自己的 fork）中的 GitHub Actions；
- 目标仓库只被「克隆 → 构建 → 推送」，公共仓库匿名克隆即可，私有仓库才需要填写读取用的 Token。

## 核心特性

- **一键打包**：三步向导（检测仓库 → 打包配置 → 构建进度），无需本地安装任何工具；
- **公共仓库免登录检测**：前端直接调用 GitHub API，公共仓库无需 Token 即可检测；
- **多架构构建**：`linux/amd64`、`linux/arm64`、`linux/arm/v7`、`linux/386`（自动启用 QEMU）；
- **多推送平台**：GHCR（默认）与 / 或 Docker Hub；
- **镜像可见性**：公开 / 私有（默认公开），GHCR 推送后自动设置；
- **内置环境变量**：可为镜像烘焙 `ENV`（KEY=VALUE），先打 `-base` 再打叠加层；
- **中英文界面**：一键切换，偏好保存在浏览器本地；
- **会话恢复**：刷新 / OAuth 回跳后自动回到原步骤并回填表单，不重复触发检测。

## 工作原理

```
用户浏览器
   │  ① 输入仓库地址（前端直连 GitHub API 检测，公共仓库免 Token）
   │  ② 登录 GitHub（OAuth）或填手动 Token → 检查 fork 状态
   │  ③ 配置：镜像 Tag / 架构 / 推送平台 / 可见性 / 环境变量
   ▼
Cloudflare Worker（本仓库）
   │  ④ 校验用户已 fork 宿主项目（默认 smanx/docker-builder）且 Actions 已开启
   │  ⑤ 把 Docker Hub / 私有仓库读取凭据加密写入 fork 的 Actions secrets
   │  ⑥ workflow_dispatch 触发你的 fork 的构建
   ▼
GitHub Actions（用户自己的 fork）
   │  ⑦ 克隆目标仓库（公共匿名 / 私有用 GH_PAT）→ 检测根目录 Dockerfile
   │  ⑧ 多架构构建 → 推送 GHCR / Docker Hub → 设置 GHCR 包可见性
   ▼
ghcr.io / Docker Hub 上的镜像
```

> 关键点：**目标仓库**只是被克隆构建的对象，不需要你对它有写权限；
> **构建宿主仓库**是你 fork 出来的 `docker-builder`（fork 默认关闭 Actions，需要手动开启一次）。

## 快速开始

### 1. 部署 Worker

```bash
npm install
npx wrangler login
npx wrangler deploy
```

### 2. 配置 OAuth App

1. 在 GitHub 新建 OAuth App（Settings → Developer settings → OAuth Apps），回调地址填
   `https://你的worker域名/api/auth/callback`；
2. 注入两个 Secret（用于 GitHub 登录，scope 为 `repo + workflow`）：

```bash
npx wrangler secret put GH_OAUTH_CLIENT_ID
npx wrangler secret put GH_OAUTH_CLIENT_SECRET
```

### 3. 准备构建宿主仓库（关键）

用户打包前必须：

1. **Fork** `smanx/docker-builder` 到自己名下（Worker 会校验 fork 状态并引导）；
2. 在自己的 fork 上**开启 GitHub Actions**（fork 默认关闭）。

> 构建宿主的源仓库可用环境变量覆盖：`[vars] BUILDER_SOURCE = "owner/repo"`（见 `wrangler.toml`）。
> 修改源仓库后需重新 fork、并重新 `wrangler deploy`。

### 本地开发

```bash
npm run dev
```

本地 Secret 写入 `.dev.vars`（参考 `.dev.vars.example`，已被 `.gitignore` 忽略）。

## 打包流程详解

| 步骤 | 内容 |
| --- | --- |
| 第 1 步 仓库检测 | 输入 `https://github.com/owner/repo` 或 `owner/repo`；公共仓库匿名检测，私有仓库填「检测 Token」；列出默认分支 / 分支 / Tag，并校验所选版本根目录是否存在 Dockerfile |
| 第 2 步 打包配置 | GitHub 登录 或 手动 Token（需要 `repo + workflow` 权限）→ 检查 fork 状态 → 填写镜像 Tag、架构、推送平台、可见性、环境变量 |
| 第 3 步 构建进度 | 轮询 GitHub Actions 运行状态，实时展示「触发 → 构建 → 推送」，成功后给出镜像地址与 `docker pull` 命令 |

## API 端点

| 端点 | 方法 | 说明 |
| --- | --- | --- |
| `/api/health` | GET | 健康检查 |
| `/api/whoami` | GET | 当前登录用户（需 Bearer Token） |
| `/api/auth/login` | GET | 跳转 GitHub OAuth 授权 |
| `/api/auth/callback` | GET | OAuth 回调，换取 access_token 并回跳前端 |
| `/api/fork-status` | GET | 检查登录用户是否已 fork 宿主项目、Actions 是否开启 |
| `/api/build` | POST | 校验 fork → 写入 secrets → 触发 workflow_dispatch |
| `/api/status` | GET | 查询指定 run_id 的构建状态（queued / in_progress / completed） |

## 配置项

| 配置 | 类型 | 说明 |
| --- | --- | --- |
| `GH_OAUTH_CLIENT_ID` / `GH_OAUTH_CLIENT_SECRET` | Secret | GitHub OAuth 登录凭据（`repo + workflow` scope） |
| `GH_OAUTH_CALLBACK_URL` | Secret（可选） | 自定义 OAuth 回调地址，默认取当前域名的 `/api/auth/callback` |
| `BUILDER_SOURCE` | Var | 构建宿主源仓库，默认 `smanx/docker-builder` |

> 每次打包时 Worker 会动态写入 / 删除你 fork 上的 Secrets：
> `DOCKERHUB_USERNAME` / `DOCKERHUB_TOKEN`（仅勾选 Docker Hub）、`GH_PAT`（仅私有目标仓库）。
> 这些值通过 libsodium 兼容的 crypto_box_seal 加密后写入，不会明文存储。

## 目录结构

```
public/              前端静态资源（index.html / style.css / app.js，原生 JS）
src/index.js         Worker 入口：/api/* 走 API，其余走静态资源
src/api/            API 路由（auth / whoami / fork / build / status）
src/github.js        GitHub API 封装（仓库、Actions secrets、workflow_dispatch、runs）
src/crypto.js        libsodium 兼容的 sealed box 加密（secrets 写入用）
src/util.js          工具函数（Token 解析、仓库地址解析、平台 / 环境变量校验）
.github/workflows/
  docker-build.yml   构建宿主 workflow（workflow_dispatch 触发）
wrangler.toml        Worker 配置（静态资源绑定、BUILDER_SOURCE）
```

## 注意事项 / 限制

- **Dockerfile 必须位于仓库根目录**：支持 `Dockerfile` 或 `Dockerfile.*` 变体，否则构建失败；
- **GHCR 可见性**：推送后由 workflow 自动调用 GitHub API 设置公开 / 私有；首次推送可能存在传播延迟，失败不阻断构建（会给出告警链接）；
- **Docker Hub 可见性**：Docker Hub 无 API 自动设置，由其仓库默认设置决定，需在 Docker Hub 网页端手动调整；
- **私有目标仓库**：需要在第 1 步填写能读取它的 Token（或登录账户对其有权限，自动复用登录身份）；
- **Docker Hub 凭据**：仅当勾选 Docker Hub 时才需要填写用户名 + Access Token（需要 Read & Write 权限）。

## License

MIT
