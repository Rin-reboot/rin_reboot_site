import careerEntries from "./career.json";

export type CareerEntry = (typeof careerEntries)[number];

export const educationEntries = careerEntries.filter(
  (entry) => entry.type === "education",
);
export const workEntries = careerEntries.filter(
  (entry) => entry.type === "work",
);
