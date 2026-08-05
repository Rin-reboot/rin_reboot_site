"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type DragEvent,
  type MouseEvent,
  type PointerEvent,
} from "react";

const EDGE_TOLERANCE = 8;
const DRAG_THRESHOLD = 4;
const SCROLL_SNAP_RESTORE_DELAY = 600;
const INTERACTIVE_SELECTOR =
  'a, button, input, select, textarea, summary, [role="button"], [contenteditable="true"]';

type ProjectDragState = {
  pointerId: number | null;
  startX: number;
  startScrollLeft: number;
  hasMoved: boolean;
};

const initialDragState: ProjectDragState = {
  pointerId: null,
  startX: 0,
  startScrollLeft: 0,
  hasMoved: false,
};

function getCarouselStep(carousel: HTMLElement) {
  const firstCard = carousel.querySelector<HTMLElement>(".project-card");
  const track = carousel.querySelector<HTMLElement>(".project-grid");

  if (!firstCard || !track) {
    return null;
  }

  const gap = Number.parseFloat(getComputedStyle(track).columnGap) || 0;
  return firstCard.offsetWidth + gap;
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function useProjectCarousel() {
  const [canScrollBack, setCanScrollBack] = useState(false);
  const [canScrollForward, setCanScrollForward] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const carouselRef = useRef<HTMLElement>(null);
  const dragRef = useRef<ProjectDragState>({ ...initialDragState });
  const snapCleanupRef = useRef<(() => void) | null>(null);

  const handleCarouselScroll = useCallback(() => {
    const carousel = carouselRef.current;

    if (!carousel) {
      return;
    }

    const maxScrollLeft = carousel.scrollWidth - carousel.clientWidth;
    setCanScrollBack(carousel.scrollLeft > EDGE_TOLERANCE);
    setCanScrollForward(carousel.scrollLeft < maxScrollLeft - EDGE_TOLERANCE);
  }, []);

  const scrollProjects = useCallback((direction: -1 | 1) => {
    const carousel = carouselRef.current;
    const cardStep = carousel ? getCarouselStep(carousel) : null;

    if (!carousel || cardStep === null) {
      return;
    }

    carousel.scrollBy({
      left: direction * cardStep,
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  }, []);

  const snapToNearestProject = useCallback(
    (carousel: HTMLElement, releasePosition = carousel.scrollLeft) => {
      const cardStep = getCarouselStep(carousel);

      if (cardStep === null) {
        return;
      }

      const maxScrollLeft = carousel.scrollWidth - carousel.clientWidth;
      const nearestPosition = Math.round(releasePosition / cardStep) * cardStep;
      const targetPosition = Math.min(
        maxScrollLeft,
        Math.max(0, nearestPosition),
      );

      snapCleanupRef.current?.();
      carousel.style.scrollSnapType = "none";

      if (
        prefersReducedMotion() ||
        Math.abs(carousel.scrollLeft - targetPosition) < 1
      ) {
        carousel.scrollLeft = targetPosition;
        carousel.style.removeProperty("scroll-snap-type");
        snapCleanupRef.current = null;
        return;
      }

      let fallbackTimeout = 0;

      function restoreScrollSnap() {
        carousel.removeEventListener("scrollend", restoreScrollSnap);
        window.clearTimeout(fallbackTimeout);
        carousel.style.removeProperty("scroll-snap-type");
        snapCleanupRef.current = null;
      }

      carousel.addEventListener("scrollend", restoreScrollSnap, { once: true });
      fallbackTimeout = window.setTimeout(
        restoreScrollSnap,
        SCROLL_SNAP_RESTORE_DELAY,
      );
      snapCleanupRef.current = restoreScrollSnap;

      carousel.scrollTo({
        left: targetPosition,
        behavior: "smooth",
      });
    },
    [],
  );

  function handlePreviousClick() {
    scrollProjects(-1);
  }

  function handleNextClick() {
    scrollProjects(1);
  }

  function handleDragStart(event: DragEvent<HTMLElement>) {
    event.preventDefault();
  }

  function handlePointerDown(event: PointerEvent<HTMLElement>) {
    const isInteractiveTarget =
      event.target instanceof Element &&
      event.target.closest(INTERACTIVE_SELECTOR);

    if (
      event.pointerType === "touch" ||
      event.button !== 0 ||
      isInteractiveTarget
    ) {
      return;
    }

    snapCleanupRef.current?.();
    event.currentTarget.style.scrollSnapType = "none";
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startScrollLeft: event.currentTarget.scrollLeft,
      hasMoved: false,
    };
    event.currentTarget.classList.add("is-dragging");
    event.currentTarget.setPointerCapture(event.pointerId);
    setIsDragging(true);
  }

  function handlePointerMove(event: PointerEvent<HTMLElement>) {
    const drag = dragRef.current;

    if (drag.pointerId !== event.pointerId) {
      return;
    }

    const distance = event.clientX - drag.startX;
    if (Math.abs(distance) > DRAG_THRESHOLD) {
      drag.hasMoved = true;
      event.preventDefault();
    }
    event.currentTarget.scrollLeft = drag.startScrollLeft - distance;
  }

  function handlePointerUp(event: PointerEvent<HTMLElement>) {
    const drag = dragRef.current;

    if (drag.pointerId !== event.pointerId) {
      return;
    }

    event.currentTarget.releasePointerCapture(event.pointerId);
    if (drag.hasMoved) {
      const releasePosition =
        drag.startScrollLeft - (event.clientX - drag.startX);
      snapToNearestProject(event.currentTarget, releasePosition);
    } else {
      event.currentTarget.style.removeProperty("scroll-snap-type");
    }
    event.currentTarget.classList.remove("is-dragging");
    drag.pointerId = null;
    setIsDragging(false);
  }

  function handlePointerCancel(event: PointerEvent<HTMLElement>) {
    if (dragRef.current.hasMoved) {
      snapToNearestProject(event.currentTarget);
    } else {
      event.currentTarget.style.removeProperty("scroll-snap-type");
    }
    event.currentTarget.classList.remove("is-dragging");
    dragRef.current.pointerId = null;
    dragRef.current.hasMoved = false;
    setIsDragging(false);
  }

  function handleClickCapture(event: MouseEvent<HTMLElement>) {
    if (dragRef.current.hasMoved) {
      event.preventDefault();
      event.stopPropagation();
      dragRef.current.hasMoved = false;
    }
  }

  useEffect(() => {
    handleCarouselScroll();
    window.addEventListener("resize", handleCarouselScroll);

    return () => window.removeEventListener("resize", handleCarouselScroll);
  }, [handleCarouselScroll]);

  useEffect(() => {
    return () => snapCleanupRef.current?.();
  }, []);

  return {
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
  };
}
