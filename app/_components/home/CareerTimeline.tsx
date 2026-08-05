import type { CareerEntry } from "@/app/_data/career";

type CareerTimelineProps = {
  entries: CareerEntry[];
};

export function CareerTimeline({ entries }: CareerTimelineProps) {
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
