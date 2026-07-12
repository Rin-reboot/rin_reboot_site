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

## ブログ記事

記事は `content/blog` に Markdown ファイルとして追加します。記事タイトルはページ側で `h1` になるため、本文の見出しは `h2` から始め、階層を飛ばさないでください。

執筆中の軽量チェック:

```bash
pnpm content:check
```

記事を更新したときの push 前チェック:

```bash
pnpm check:blog
```

このチェックは Markdown、静的ビルド、生成 HTML の見出し・メタデータ・パンくず・構造化データを検証します。pre-push フックや GitHub Actions からは自動実行しません。
