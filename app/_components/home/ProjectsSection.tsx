"use client";

import { projects } from "@/app/_data/home";
import { ProjectCard } from "./ProjectCard";
import { useProjectCarousel } from "./useProjectCarousel";

export function ProjectsSection() {
  const {
    canScrollBack,
    canScrollForward,
    carouselRef,
    handleCarouselScroll,
    handleClickCapture,
    handleDragStart,
    handleNextClick,
    handlePointerCancel,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handlePreviousClick,
    isDragging,
  } = useProjectCarousel();
  const viewportClassName = `project-viewport${isDragging ? " is-dragging" : ""}`;

  return (
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
          disabled={!canScrollBack}
          onClick={handlePreviousClick}
        >
          <span aria-hidden="true">←</span>
        </button>
        <section
          className={viewportClassName}
          id="project-carousel-viewport"
          ref={carouselRef}
          aria-label="プロジェクト一覧"
          aria-describedby="project-carousel-hint"
          onScroll={handleCarouselScroll}
          onDragStart={handleDragStart}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
          onClickCapture={handleClickCapture}
        >
          <div className="project-grid">
            {projects.map((project) => (
              <ProjectCard key={project.title} project={project} />
            ))}
          </div>
        </section>
        <button
          className="project-navigation project-navigation-next"
          type="button"
          aria-label="次のプロジェクトを表示"
          aria-controls="project-carousel-viewport"
          disabled={!canScrollForward}
          onClick={handleNextClick}
        >
          <span aria-hidden="true">→</span>
        </button>
      </div>
      <p className="project-carousel-hint" id="project-carousel-hint">
        DRAG / SWIPE / USE CONTROLS
      </p>
    </section>
  );
}
