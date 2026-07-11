# Rin — Portfolio

Rin の個人ポートフォリオサイトです。Next.js / TypeScript / Tailwind CSS で構築し、Cloudflare Pages へ静的ファイルだけを配信します。

## 構成

- Next.js（Static Export）
- TypeScript
- Tailwind CSS 4
- Cloudflare Pages

## ローカル開発

Node.js 22.13.0 以降が必要です。

```bash
pnpm ci
pnpm run dev
```

ブラウザで `http://localhost:3000` を開きます。

## 確認

```bash
pnpm run lint
pnpm run typecheck
pnpm test
```
