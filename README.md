# Sub2Dsh

![JGY.AI homepage preview](docs/preview.png)

JGY.AI 的独立深色 Vue 3 主页，包含 WebGL 波浪、等高线动效、双语切换和响应式布局。项目不依赖后端 API，可直接构建为静态站点。

JGY.AI's standalone dark Vue 3 homepage with WebGL waves, topographic motion,
bilingual copy, and responsive layouts. It has no backend dependency and can
be deployed as a static site.

## 功能 Features

- 可配置品牌名称、副标题、Logo、主 CTA 和文档入口
- 中文 / English 切换，并持久化访客选择
- GradientWaves WebGL2 首屏与 OGL Topography CTA 动效
- WebGL 不可用、IntersectionObserver 缺失和 reduced-motion 时自动降级
- 代码示例标签、复制反馈、工作流交互和桌面滚动联动
- 固定保留源仓库归属链接：<https://github.com/yigehaozi/sub2-dsh>

## 快速开始 Quick Start

需要 Node 20+ 与 pnpm 9.15.9。

```bash
corepack pnpm@9.15.9 install --frozen-lockfile
pnpm dev
```

本地构建：

```bash
pnpm typecheck
pnpm test:run
pnpm build
```

## 配置 Configuration

复制 `.env.example` 后，在构建时设置以下变量：

| 变量 | 默认值 | 说明 |
| --- | --- | --- |
| `VITE_SITE_NAME` | `JGY.AI` | 页面品牌名称 |
| `VITE_SITE_SUBTITLE` | `AI API Gateway Platform` | 首屏副标题 |
| `VITE_SITE_LOGO` | 当前 base 下的 `logo.png` | 仅接受绝对 HTTP/HTTPS URL |
| `VITE_PRIMARY_CTA_URL` | `https://jgy.ai/login` | 非法地址回退默认值 |
| `VITE_DOCS_URL` | 空 | 非法或空值时隐藏文档入口 |
| `VITE_BASE_PATH` | `/` | GitHub Pages 使用 `/sub2-dsh/` |

主 CTA 和文档地址必须是绝对 `http://` 或 `https://` URL。源仓库 URL 是固定归属地址，不能通过环境变量替换。

## GitHub Pages

推送到 `main` 后，`.github/workflows/pages.yml` 会使用 Node 20、pnpm 9.15.9 完成依赖安装、类型检查、单测和 `/sub2-dsh/` 子路径构建，再部署到 GitHub Pages。

页面地址：<https://yigehaozi.github.io/sub2-dsh/>

仓库的 Pages 发布源应设置为 **GitHub Actions**。本项目保持 GitHub Packages 为空，也不发布 npm 包。

## 归属与再分发 Attribution

本项目使用 `LGPL-3.0-or-later`。再分发或制作衍生主页时，请保留 `NOTICE`、本仓库地址以及页面页脚中的可见源链接：

<https://github.com/yigehaozi/sub2-dsh>

第三方依赖及字体的许可证记录在 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)。完整许可证文本见 [LICENSE](LICENSE)。

This project is licensed under `LGPL-3.0-or-later`. Redistributions and
derived homepage pages must retain `NOTICE`, the repository URL, and the
visible source link in the footer. Third-party package and font notices are
listed in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
