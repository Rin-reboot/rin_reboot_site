"use client";

import { useEffect, useRef, type KeyboardEvent, type MouseEvent } from "react";
import { educationEntries, workEntries } from "@/app/_data/career";
import { CareerTimeline } from "./CareerTimeline";

type CareerDialogProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function CareerDialog({ isOpen, onClose }: CareerDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (isOpen && !dialog?.open) {
      dialog?.showModal();
      dialog?.querySelector<HTMLButtonElement>(".career-close")?.focus();
    } else if (!isOpen && dialog?.open) {
      dialog.close();
    }
  }, [isOpen]);

  function handleBackdropClick(event: MouseEvent<HTMLDialogElement>) {
    if (event.target === event.currentTarget) {
      onClose();
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key === "Escape") {
      onClose();
    }
  }

  return (
    <dialog
      className="career-dialog"
      ref={dialogRef}
      aria-labelledby="career-title"
      onClose={onClose}
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
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
            onClick={onClose}
          >
            <span aria-hidden="true">×</span>
          </button>
        </header>

        <section className="career-section" aria-labelledby="education-title">
          <h3 id="education-title">
            Education <span>学歴</span>
          </h3>
          <CareerTimeline entries={educationEntries} />
        </section>

        <section
          className="career-section career-section-work"
          aria-labelledby="work-history-title"
        >
          <h3 id="work-history-title">
            Experience <span>職歴</span>
          </h3>
          <CareerTimeline entries={workEntries} />
        </section>
      </div>
    </dialog>
  );
}
