"use client";

import { useState, type KeyboardEvent } from "react";

export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function handleMenuToggle() {
    setIsMenuOpen((isOpen) => !isOpen);
  }

  function handleNavigationClick() {
    setIsMenuOpen(false);
  }

  function handleNavigationKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key === "Enter") {
      setIsMenuOpen(false);
    }
  }

  return (
    <header className="site-header">
      <a className="brand" href="#top" aria-label="ページの先頭へ">
        R<span>.</span>
      </a>
      <button
        className="menu-toggle"
        type="button"
        aria-expanded={isMenuOpen}
        aria-controls="main-navigation"
        aria-label={isMenuOpen ? "メニューを閉じる" : "メニューを開く"}
        onClick={handleMenuToggle}
      >
        <span aria-hidden="true" />
        <span aria-hidden="true" />
        <span aria-hidden="true" />
      </button>
      <nav
        id="main-navigation"
        className={isMenuOpen ? "is-open" : undefined}
        aria-label="メインナビゲーション"
        onClick={handleNavigationClick}
        onKeyDown={handleNavigationKeyDown}
      >
        <a href="#work">Work</a>
        <a href="#about">About</a>
        <a href="/blog/">Blog</a>
      </nav>
    </header>
  );
}
