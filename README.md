# Cloudflare Workers Minimal Demo

这是一个可直接部署到 Cloudflare Workers 的最小 TypeScript 示例。

## 本地开发

```bash
npm install
npm run dev
```

## 本地检查

```bash
npm run check
```

## 手动部署

先登录 Cloudflare：

```bash
npx wrangler login
```

然后执行：

```bash
npm run deploy
```

## 自动部署

仓库中的 `.github/workflows/deploy.yml` 已配置为：

- 当远程 `main` 分支收到推送时自动部署
- 支持在 GitHub Actions 页面手动触发部署

在 GitHub 仓库的 `Settings > Secrets and variables > Actions` 中新增以下 Secrets：

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

建议 `CLOUDFLARE_API_TOKEN` 至少具备：

- `Account` 的 `Workers Scripts: Edit`
- `Zone` 相关权限仅在你后续配置自定义域名时再按需补充

## 重要说明

- `wrangler.toml` 中的 `name` 可以改成你自己的 Worker 名称
- 第一次部署前，建议先在本地执行一次 `npm run deploy`，确认 Cloudflare 账号、权限和 Worker 名称都正确
