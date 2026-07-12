---
title: "Markdownで育てるポートフォリオブログ"
description: "Next.jsの静的エクスポートを活かして、Markdown記事を高速なHTMLとして公開する設計を紹介します。"
publishedAt: "2026-07-12"
updatedAt: "2026-07-12"
category: "Frontend"
tags:
  - Next.js
  - Markdown
draft: false
---

## Markdownを選ぶ理由

記事をリポジトリ内のMarkdownで管理すると、コードと同じレビューの流れで文章を更新できます。データベースを必要とせず、ビルド時にHTMLへ変換できるため、静的サイトとの相性も良好です。

## 記事データの読み込み

Frontmatterにはタイトル、概要、公開日、カテゴリ、タグを記述します。本文とメタデータを分けることで、一覧ページやOGPにも同じ情報を利用できます。

```ts
type BlogPost = {
  title: string;
  description: string;
  category: string;
  tags: string[];
};
```

### ビルド時の検証

必須項目や見出し構造に問題がある記事は、公開前のチェックで検出します。記事タイトルはページ側で`h1`として出力するため、Markdown本文は`h2`から始めます。

## 静的HTMLとして公開する

記事ごとのページをビルド時に生成すれば、Cloudflare Pagesから高速に配信できます。検索エンジンもJavaScriptの実行を待たず、本文とメタデータを読み取れます。
