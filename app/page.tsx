"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import careerEntries from "./career.json";

const educationEntries = careerEntries.filter((entry) => entry.type === "education");
const workEntries = careerEntries.filter((entry) => entry.type === "work");

function CareerTimeline({ entries }: { entries: typeof careerEntries }) {
  return (
    <ol className="career-timeline">
      {entries.map((entry) => (
        <li key={`${entry.period}-${entry.title}`}>
          <div className="career-marker" aria-hidden="true" />
          <div className="career-entry-meta">
            <time>{entry.period}</time>
          </div>
          <h4>{entry.title}</h4>
          <p className="career-organization">{entry.organization}</p>
          <p className="career-description">{entry.description}</p>
        </li>
      ))}
    </ol>
  );
}

const projects = [
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

const technologies = [
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

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCareerOpen, setIsCareerOpen] = useState(false);
  const [canScrollProjectsBack, setCanScrollProjectsBack] = useState(false);
  const [canScrollProjectsForward, setCanScrollProjectsForward] = useState(true);
  const [isDraggingProjects, setIsDraggingProjects] = useState(false);
  const careerDialogRef = useRef<HTMLDialogElement>(null);
  const projectCarouselRef = useRef<HTMLElement>(null);
  const projectDragRef = useRef({
    pointerId: null as number | null,
    startX: 0,
    startScrollLeft: 0,
    hasMoved: false,
  });
  const projectSnapCleanupRef = useRef<(() => void) | null>(null);

  const updateProjectNavigation = useCallback(() => {
    const carousel = projectCarouselRef.current;

    if (!carousel) {
      return;
    }

    const maxScrollLeft = carousel.scrollWidth - carousel.clientWidth;
    const edgeTolerance = 8;
    setCanScrollProjectsBack(carousel.scrollLeft > edgeTolerance);
    setCanScrollProjectsForward(carousel.scrollLeft < maxScrollLeft - edgeTolerance);
  }, []);

  const scrollProjects = (direction: -1 | 1) => {
    const carousel = projectCarouselRef.current;
    const firstCard = carousel?.querySelector<HTMLElement>(".project-card");

    if (!carousel || !firstCard) {
      return;
    }

    const track = carousel.querySelector<HTMLElement>(".project-grid");
    const gap = track ? Number.parseFloat(getComputedStyle(track).columnGap) || 0 : 0;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    carousel.scrollBy({
      left: direction * (firstCard.offsetWidth + gap),
      behavior: reduceMotion ? "auto" : "smooth",
    });
  };

  const snapProjectsToNearest = (carousel: HTMLElement, releasePosition = carousel.scrollLeft) => {
    const firstCard = carousel.querySelector<HTMLElement>(".project-card");
    const track = carousel.querySelector<HTMLElement>(".project-grid");

    if (!firstCard || !track) {
      return;
    }

    const gap = Number.parseFloat(getComputedStyle(track).columnGap) || 0;
    const cardStep = firstCard.offsetWidth + gap;
    const maxScrollLeft = carousel.scrollWidth - carousel.clientWidth;
    const nearestPosition = Math.round(releasePosition / cardStep) * cardStep;
    const targetPosition = Math.min(maxScrollLeft, Math.max(0, nearestPosition));
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    projectSnapCleanupRef.current?.();
    carousel.style.scrollSnapType = "none";

    if (reduceMotion || Math.abs(carousel.scrollLeft - targetPosition) < 1) {
      carousel.scrollLeft = targetPosition;
      carousel.style.removeProperty("scroll-snap-type");
      projectSnapCleanupRef.current = null;
      return;
    }

    let fallbackTimeout = 0;
    const restoreScrollSnap = () => {
      carousel.removeEventListener("scrollend", restoreScrollSnap);
      window.clearTimeout(fallbackTimeout);
      carousel.style.removeProperty("scroll-snap-type");
      projectSnapCleanupRef.current = null;
    };

    carousel.addEventListener("scrollend", restoreScrollSnap, { once: true });
    fallbackTimeout = window.setTimeout(restoreScrollSnap, 600);
    projectSnapCleanupRef.current = restoreScrollSnap;

    carousel.scrollTo({
      left: targetPosition,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const dialog = careerDialogRef.current;

    if (isCareerOpen && !dialog?.open) {
      dialog?.showModal();
      dialog?.querySelector<HTMLButtonElement>(".career-close")?.focus();
    } else if (!isCareerOpen && dialog?.open) {
      dialog.close();
    }
  }, [isCareerOpen]);

  useEffect(() => {
    updateProjectNavigation();
    window.addEventListener("resize", updateProjectNavigation);

    return () => window.removeEventListener("resize", updateProjectNavigation);
  }, [updateProjectNavigation]);

  return (
    <div className="site-shell">
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
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>
        <nav
          id="main-navigation"
          className={isMenuOpen ? "is-open" : undefined}
          aria-label="メインナビゲーション"
          onClick={() => setIsMenuOpen(false)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              setIsMenuOpen(false);
            }
          }}
        >
          <a href="#work">Work</a>
          <a href="#about">About</a>
          <a href="/blog/">Blog</a>
        </nav>
      </header>

      <main id="top">
        <section className="hero" aria-labelledby="hero-title">
          <aside className="floating-card avatar-card">
            <div className="avatar-frame">
              <Image
                src="/avatar.jpg"
                alt="ノートパソコンでコードを書く黒猫のピクセルアート"
                width={400}
                height={400}
                priority
              />
            </div>
            <p>@Rin-reboot</p>
          </aside>

          <div className="hero-copy">
            <p className="eyebrow">FRONTEND ENGINEER / JAPAN</p>
            <h1 id="hero-title">
              Rin<span>.</span>
              <small>Interfaces, systems, and everything between.</small>
            </h1>
            <p className="hero-lead">
              使う人の手に自然になじむインターフェースを考え、実装しています。
              フロントエンドを軸に、気になった技術を自分の手で確かめることが好きです。
            </p>
            <nav className="hero-actions" aria-label="プロフィールと経歴">
              <a className="button" href="/blog/">
                Blog <span aria-hidden="true">→</span>
              </a>
              <button
                className="button career-button"
                type="button"
                onClick={() => setIsCareerOpen(true)}
              >
                Career <span aria-hidden="true">＋</span>
              </button>
              <a
                className="button button-primary"
                href="https://github.com/Rin-reboot"
                target="_blank"
                rel="noreferrer"
              >
                View GitHub <span aria-hidden="true">↗</span>
              </a>
              <a
                className="button"
                href="https://x.com/dev_rin_fl"
                target="_blank"
                rel="noreferrer"
              >
                X / @dev_rin_fl <span aria-hidden="true">↗</span>
              </a>
              <a
                className="button"
                href="https://qiita.com/rin_reboot"
                target="_blank"
                rel="noreferrer"
              >
                Qiita <span aria-hidden="true">↗</span>
              </a>
            </nav>
          </div>

          <aside className="floating-card status-card">
            <div className="status-label">
              <span aria-hidden="true" /> NOW EXPLORING
            </div>
            <p>Web とデスクトップの境界。軽く、長く使える道具の設計。</p>
          </aside>
        </section>

        <section className="work-section" id="work" aria-labelledby="work-title">
          <div className="section-heading">
            <p>SELECTED WORK / 04</p>
            <h2 id="work-title">Things I build.</h2>
          </div>
          <div className="project-carousel">
            <button
              className="project-navigation project-navigation-previous"
              type="button"
              aria-label="前のプロジェクトを表示"
              aria-controls="project-carousel-viewport"
              disabled={!canScrollProjectsBack}
              onClick={() => scrollProjects(-1)}
            >
              <span aria-hidden="true">←</span>
            </button>
            <section
              className={`project-viewport${isDraggingProjects ? " is-dragging" : ""}`}
              id="project-carousel-viewport"
              ref={projectCarouselRef}
              aria-label="プロジェクト一覧"
              aria-describedby="project-carousel-hint"
              onScroll={updateProjectNavigation}
              onDragStart={(event) => event.preventDefault()}
              onPointerDown={(event) => {
                if (event.pointerType === "touch" || event.button !== 0) {
                  return;
                }

                projectSnapCleanupRef.current?.();
                event.currentTarget.style.scrollSnapType = "none";
                projectDragRef.current = {
                  pointerId: event.pointerId,
                  startX: event.clientX,
                  startScrollLeft: event.currentTarget.scrollLeft,
                  hasMoved: false,
                };
                event.currentTarget.classList.add("is-dragging");
                event.currentTarget.setPointerCapture(event.pointerId);
                setIsDraggingProjects(true);
              }}
              onPointerMove={(event) => {
                const drag = projectDragRef.current;

                if (drag.pointerId !== event.pointerId) {
                  return;
                }

                const distance = event.clientX - drag.startX;
                if (Math.abs(distance) > 4) {
                  drag.hasMoved = true;
                  event.preventDefault();
                }
                event.currentTarget.scrollLeft = drag.startScrollLeft - distance;
              }}
              onPointerUp={(event) => {
                if (projectDragRef.current.pointerId !== event.pointerId) {
                  return;
                }

                event.currentTarget.releasePointerCapture(event.pointerId);
                if (projectDragRef.current.hasMoved) {
                  const releasePosition =
                    projectDragRef.current.startScrollLeft -
                    (event.clientX - projectDragRef.current.startX);
                  snapProjectsToNearest(event.currentTarget, releasePosition);
                } else {
                  event.currentTarget.style.removeProperty("scroll-snap-type");
                }
                event.currentTarget.classList.remove("is-dragging");
                projectDragRef.current.pointerId = null;
                setIsDraggingProjects(false);
              }}
              onPointerCancel={(event) => {
                if (projectDragRef.current.hasMoved) {
                  snapProjectsToNearest(event.currentTarget);
                } else {
                  event.currentTarget.style.removeProperty("scroll-snap-type");
                }
                event.currentTarget.classList.remove("is-dragging");
                projectDragRef.current.pointerId = null;
                projectDragRef.current.hasMoved = false;
                setIsDraggingProjects(false);
              }}
              onClickCapture={(event) => {
                if (projectDragRef.current.hasMoved) {
                  event.preventDefault();
                  event.stopPropagation();
                  projectDragRef.current.hasMoved = false;
                }
              }}
            >
              <div className="project-grid">
                {projects.map((project) => (
                  <article
                    className={`project-card${project.index === "01" ? " project-card-featured" : ""}`}
                    key={project.title}
                  >
                    <div className="project-meta">
                      <span>{project.index} / {project.type}</span>
                      <a
                        className="project-card-link"
                        href={project.href}
                        target="_blank"
                        rel="noreferrer"
                        draggable={false}
                        aria-label={`${project.title} の GitHub リポジトリを開く`}
                      >
                        OPEN <span aria-hidden="true">↗</span>
                      </a>
                    </div>
                    <h3>{project.title}</h3>
                    <p>{project.description}</p>
                    <ul aria-label={`${project.title} の使用技術`}>
                      {project.stack.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            </section>
            <button
              className="project-navigation project-navigation-next"
              type="button"
              aria-label="次のプロジェクトを表示"
              aria-controls="project-carousel-viewport"
              disabled={!canScrollProjectsForward}
              onClick={() => scrollProjects(1)}
            >
              <span aria-hidden="true">→</span>
            </button>
          </div>
          <p className="project-carousel-hint" id="project-carousel-hint">
            DRAG / SWIPE / USE CONTROLS
          </p>
        </section>

        <section className="about-section" id="about" aria-labelledby="about-title">
          <div className="about-copy">
            <p className="section-kicker">ABOUT / APPROACH</p>
            <h2 id="about-title">Build, learn, repeat.</h2>
            <p>
              本職はフロントエンドエンジニアです。React / Next.js と
              TypeScript を中心に、理解しやすく、保守しやすい Web
              体験をつくっています。
            </p>
            <p>
              仕事の外では Go、Rust、Docker、Terraform、AWS
              などにも手を伸ばし、アプリケーションの外側まで含めて仕組みを組み立てます。
              気の赴くままに開発することがモットーです。
            </p>
          </div>
          <div className="tech-panel">
            <div className="panel-heading">
              <p>TECHNOLOGY PLAYGROUND</p>
              <span>09 TOOLS</span>
            </div>
            <ul>
              {technologies.map((technology) => (
                <li key={technology}>{technology}</li>
              ))}
            </ul>
          </div>
          <aside className="hobby-note">
            <span>OFF SCREEN / 01</span>
            <p>
              コードを書いていない時間は、ゲームの世界へ。遊ぶ側の体験からも、心地よい操作や表現のヒントを探しています。
            </p>
          </aside>
        </section>

        <section className="closing" aria-labelledby="closing-title">
          <p>LET&apos;S KEEP BUILDING</p>
          <h2 id="closing-title">作りながら、できることを増やしていく。</h2>
          <a
            href="https://x.com/dev_rin_fl"
            target="_blank"
            rel="noreferrer"
          >
            Follow the journey <span aria-hidden="true">↗</span>
          </a>
        </section>
      </main>

      <dialog
        className="career-dialog"
        ref={careerDialogRef}
        aria-labelledby="career-title"
        onClose={() => setIsCareerOpen(false)}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            setIsCareerOpen(false);
          }
        }}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            setIsCareerOpen(false);
          }
        }}
      >
        <div className="career-modal">
          <header className="career-modal-header">
            <div>
              <p>EDUCATION + EXPERIENCE</p>
              <h2 id="career-title">Career timeline.</h2>
            </div>
            <button
              className="career-close"
              type="button"
              aria-label="経歴を閉じる"
              onClick={() => setIsCareerOpen(false)}
            >
              <span aria-hidden="true">×</span>
            </button>
          </header>

          <section className="career-section" aria-labelledby="education-title">
            <h3 id="education-title">Education <span>学歴</span></h3>
            <CareerTimeline entries={educationEntries} />
          </section>

          <section
            className="career-section career-section-work"
            aria-labelledby="work-history-title"
          >
            <h3 id="work-history-title">Experience <span>職歴</span></h3>
            <CareerTimeline entries={workEntries} />
          </section>
        </div>
      </dialog>

      <footer>
        <span>© {new Date().getFullYear()} Rin</span>
        <span>FRONTEND / SYSTEMS / CURIOSITY</span>
      </footer>
    </div>
  );
}
