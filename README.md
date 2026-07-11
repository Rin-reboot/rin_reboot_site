# Rin — Portfolio

Rin の個人ポートフォリオサイトです。Next.js / TypeScript / Tailwind CSS で構築し、Cloudflare Pages へ静的ファイルだけを配信します。

## 構成

- Next.js（Static Export）
- TypeScript
- Tailwind CSS 4
- Cloudflare Pages

DB、API Route、Pages Functions、Cloudflare Workers は使用していません。画像とフォントもローカル配信のため、ページ表示時にサイト自身から不要な外部リクエストは発生しません。GitHub・X・各プロジェクトへのリンクは、ユーザーがクリックした場合のみ開きます。

## ローカル開発

Node.js 22.13.0 以降が必要です。

```bash
npm ci
npm run dev
```

ブラウザで `http://localhost:3000` を開きます。

## 確認

```bash
npm run lint
npm run typecheck
npm test
```

`npm run build` の出力先は `out/` です。Cloudflare Pages では、このフォルダを配信します。

## Cloudflare Pages の初期設定

1. Cloudflare Dashboard で **Direct Upload** の Pages プロジェクトを作成します。
2. GitHub リポジトリの `Settings > Secrets and variables > Actions` に次を登録します。

| 種類 | 名前 | 内容 |
| --- | --- | --- |
| Secret | `CLOUDFLARE_API_TOKEN` | Cloudflare Pages を編集できる API Token |
| Secret | `CLOUDFLARE_ACCOUNT_ID` | Cloudflare Account ID |
| Variable | `CLOUDFLARE_PAGES_PROJECT_NAME` | 作成した Pages プロジェクト名 |
| Variable | `NEXT_PUBLIC_SITE_URL` | 公開 URL。例: `https://example.com` |

API Token には対象アカウントの `Cloudflare Pages: Edit` 権限だけを付与してください。

`main` ブランチへ push すると `.github/workflows/cloudflare-pages.yml` がビルド・テスト・本番デプロイを実行します。Pull Request ではデプロイせず、ビルドと静的出力テストだけを実行します。

Cloudflare の Git integration ではなく Direct Upload を選んでください。Git integration と GitHub Actions を併用すると二重デプロイになるため、この構成では GitHub Actions だけを使用します。

## 主な編集箇所

- `app/page.tsx`: 掲載内容、作品、技術一覧
- `app/globals.css`: レイアウト、配色、レスポンシブデザイン
- `app/layout.tsx`: タイトル、説明、SNS 共有設定
- `public/avatar.jpg`: プロフィール画像
- `public/og.png`: SNS 共有画像
