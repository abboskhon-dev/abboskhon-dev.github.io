import type { Lang } from "../context/LangContext";
import * as base from "./profile";
import type { Project } from "./profile";
import enJson from "../i18n/en.json";
import ruJson from "../i18n/ru.json";

type Dict = typeof enJson;
type ProjectText = Partial<Project> & { parts?: { label: string; highlights: string[] }[] };
const dicts: Record<Lang, Dict> = { en: enJson, ru: ruJson };

const localize = (p: Project, d: Dict): Project => {
  const t = (d.projects as Record<string, ProjectText>)[p.id];
  if (!t) return p;
  const { parts, ...rest } = t;
  return { ...p, ...rest, parts: p.parts?.map((part, i) => ({ ...part, ...parts?.[i] })) };
};

export const ui = { en: enJson.ui, ru: ruJson.ui };

export const content = (lang: Lang) => {
  const d = dicts[lang];
  return {
    profile: base.profile,
    neutuneProjects: base.neutuneProjects.map((p) => localize(p, d)),
    earlierProjects: base.earlierProjects.map((p) => localize(p, d)),
    openSource: base.openSource.map((p) => localize(p, d)),
    article: { ...base.article, ...d.article },
    research: base.research.map((r, i) => ({ ...r, ...d.research[i] })),
    education: {
      ...base.education,
      ...d.education,
      notes: base.education.notes.map((n, i) => ({ ...n, text: d.education.notes[i] })),
    },
    skills: d.skills,
    ui: d.ui,
  };
};
