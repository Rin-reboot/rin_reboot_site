import type { Project } from "@/app/_data/home";

type ProjectCardProps = {
  project: Project;
};

export function ProjectCard({ project }: ProjectCardProps) {
  const className = `project-card${
    project.index === "01" ? " project-card-featured" : ""
  }`;

  return (
    <article className={className}>
      <div className="project-meta">
        <span>
          {project.index} / {project.type}
        </span>
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
        {project.stack.map((technology) => (
          <li key={technology}>{technology}</li>
        ))}
      </ul>
    </article>
  );
}
