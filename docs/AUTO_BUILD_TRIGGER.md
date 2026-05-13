# 内容仓库更新时自动触发博客部署

博客仓库（本仓库）的 [Deploy 工作流](../.github/workflows/deploy.yml) 已监听 **`repository_dispatch`**，事件类型为 **`content-updated`**。  
内容仓库在推送后需要**主动调用 GitHub API**，向博客仓库发送该事件，部署才会启动。

## 原理

```text
内容仓库 push ──► 内容仓库 Actions ──► GitHub API dispatches
                                              │
                                              ▼
                              博客仓库收到 content-updated
                                              │
                                              ▼
                                    运行 Deploy 工作流
```

## 一、在博客仓库（本仓库）确认

1. `.github/workflows/deploy.yml` 中已存在：
   - `repository_dispatch.types: [ content-updated ]`
2. 无需再改事件名；若你改过 `types`，下文 `event_type` 必须与之**完全一致**。

## 二、创建 Personal Access Token（PAT）

在能管理博客仓库的 GitHub 账号上创建 Token，用于代替你「对博客仓库发起 dispatch」。

### 方案 A：Fine-grained token（推荐）

1. GitHub → **Settings** → **Developer settings** → **Fine-grained tokens** → **Generate new token**
2. **Resource owner**：选博客仓库所在用户或组织。
3. **Repository access**：仅勾选你的**博客仓库**（例如 `你的用户名/Mizuki`）。
4. **Permissions** → **Repository permissions**：
   - **Contents**：**Read and write**（发起 `repository_dispatch` 需要写权限级别）
   - **Metadata**：Read（一般默认即可）
5. 生成后复制 Token，**只显示一次**，请保存到密码管理器。

### 方案 B：Classic token

1. **Developer settings** → **Personal access tokens** → **Generate new token (classic)**
2. 勾选 **`repo`**（完整仓库权限）。
3. 生成并保存 Token。

> 若博客仓库在组织内且开启 SSO，生成后需在 Token 页对该组织 **Authorize**。

## 三、在内容仓库配置 Secrets

打开 **内容仓库**（不是博客仓库）：

1. **Settings** → **Secrets and variables** → **Actions** → **New repository secret**
2. 新建 **`BLOG_DISPATCH_TOKEN`**：值为上一步的 PAT。
3. 新建 **`BLOG_REPO_FULL`**：值为 `博客仓库所有者/仓库名`，例如 `codefarmer-11/Mizuki`（**区分大小写**）。

## 四、在内容仓库添加 Workflow

在内容仓库中新建文件：`.github/workflows/trigger-blog-deploy.yml`

将下面 `branches` 改成你内容仓库实际使用的默认分支（`main` 或 `master` 等）：

```yaml
name: Trigger blog deploy

on:
  push:
    branches:
      - main # 若内容仓库默认分支是 master，改为 master

concurrency:
  group: trigger-blog-deploy
  cancel-in-progress: true

jobs:
  dispatch:
    runs-on: ubuntu-latest
    steps:
      - name: Send repository_dispatch (content-updated)
        env:
          TOKEN: ${{ secrets.BLOG_DISPATCH_TOKEN }}
          REPO: ${{ secrets.BLOG_REPO_FULL }}
        run: |
          set -euo pipefail
          if [ -z "${TOKEN:-}" ] || [ -z "${REPO:-}" ]; then
            echo "::error::请在内容仓库 Actions Secrets 中配置 BLOG_DISPATCH_TOKEN 与 BLOG_REPO_FULL"
            exit 1
          fi
          curl -fsS -X POST \
            -H "Accept: application/vnd.github+json" \
            -H "Authorization: Bearer ${TOKEN}" \
            -H "X-GitHub-Api-Version: 2022-11-28" \
            "https://api.github.com/repos/${REPO}/dispatches" \
            -d '{"event_type":"content-updated","client_payload":{}}'
          echo "已触发 ${REPO} 的 content-updated 部署"
```

提交并推送到内容仓库默认分支。

## 五、验证

1. 在内容仓库做一次小改动并 **push**。
2. 打开内容仓库 **Actions**，确认 `Trigger blog deploy` 成功。
3. 打开博客仓库 **Actions**，应出现由 **repository_dispatch** 触发的 **Deploy to Pages Branch** 运行记录。

若第 2 步失败，展开日志查看 HTTP 状态码：

| 状态码 | 常见原因 |
|--------|----------|
| 401 | Token 无效、过期或未 Authorize SSO |
| 403 | Token 对博客仓库无写权限，或 `BLOG_REPO_FULL` 写错 |
| 404 | `BLOG_REPO_FULL` 拼写错误，或仓库不存在 |

## 六、常见问题

**Q：我不想把博客仓库名写进 Secret，能写死在 workflow 里吗？**  
可以：把 `REPO` 换成固定字符串，例如 `echo "REPO=owner/Mizuki" >> $GITHUB_ENV`，或直接在 URL 里写死 `owner/Mizuki`，只保留 `BLOG_DISPATCH_TOKEN` 为 Secret。

**Q：Gitee / GitLab 怎么办？**  
本文针对 GitHub `repository_dispatch`。其他平台需使用对应「触发远程流水线 / Webhook」的方式，博客侧也要能接收（例如 Generic Webhook + 自建转发）。

**Q：能否不用 PAT？**  
同一组织内可用 GitHub App 安装凭据代替 PAT，配置成本更高；个人博客 PAT + Secrets 最常见。

**Q：事件类型必须叫 `content-updated` 吗？**  
必须与博客仓库 `deploy.yml` 里 `repository_dispatch.types` 列表中的字符串**完全一致**。
