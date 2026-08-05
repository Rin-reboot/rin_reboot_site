export const projects = [
  {
    index: "01",
    type: "DESKTOP",
    title: "pure_board",
    description:
      "CPU・メモリ・ネットワークの状態と、日常で使う小さな機能を一つにまとめた Windows 11 向けデスクトップダッシュボード。",
    stack: ["Tauri", "React", "TypeScript", "Rust"],
    href: "https://github.com/Rin-reboot/pure_board",
  },
  {
    index: "02",
    type: "CLI",
    title: "log_total",
    description:
      "Apache / nginx のアクセスログを集計し、必要な情報へ素早くたどり着くための CLI ツール。",
    stack: ["Go", "CLI", "Log analysis"],
    href: "https://github.com/Rin-reboot/log_total",
  },
  {
    index: "03",
    type: "WEB APP",
    title: "chatapp",
    description:
      "Next.js の UI と AWS のマネージドサービスを組み合わせ、リアルタイムな体験を検証したチャットアプリ。",
    stack: ["Next.js", "AWS", "GraphQL"],
    href: "https://github.com/Rin-reboot/chatapp",
  },
  {
    index: "04",
    type: "CHROME EXTENSION",
    title: "anti-popup-guard",
    description:
      "通常のページ JavaScript を止めずに、クリックに便乗する別タブ広告やポップアンダー、透明なメディアオーバーレイを遮断する Chrome 拡張。",
    stack: ["Manifest V3", "JavaScript", "DNR"],
    href: "https://github.com/Rin-reboot/anti-popup-guard",
  },
] as const;

export const technologies = [
  "TypeScript",
  "JavaScript",
  "React",
  "Next.js",
  "Go",
  "Rust",
  "Docker",
  "Terraform",
  "AWS",
] as const;

export type Project = (typeof projects)[number];
