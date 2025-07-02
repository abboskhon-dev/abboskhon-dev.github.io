import React, { useState } from "react";
import type { Part, Project } from "../data/profile";
import Lightbox from "./Lightbox";
import { useLang } from "../context/LangContext";
import { ui } from "../data/i18n";

// "Nov 2025 — Present" -> "2025–now", "Jun 2024 — Jul 2025" -> "2024–25"
export const years = (period?: string, now = "now") => {
  if (!period) return "";
  if (period === "Present") return now;
  const [from, to] = period.split(" — ").map((s) => s.trim());
  const y1 = from.slice(-4);
  if (!to) return y1;
  if (to === "Present") return `${y1}–${now}`;
  const y2 = to.slice(-4);
  return y1 === y2 ? y1 : `${y1}–${y2.slice(2)}`;
};

export const Row: React.FC<{ id?: string; side: string; children: React.ReactNode }> = ({ id, side, children }) => (
  <article id={id} className="grid gap-x-6 gap-y-1 border-t border-line py-6 sm:grid-cols-[6rem_1fr]">
    <p className="text-[0.9375rem] text-muted">{side}</p>
    <div className="min-w-0">{children}</div>
  </article>
);

type Shot = { src: string; alt: string };

const Highlights: React.FC<{ items: string[] }> = ({ items }) => (
  <ul className="mt-3 space-y-1.5 text-[0.9375rem] text-ink/80">
    {items.map((h) => (
      <li key={h} className="relative pl-4 before:absolute before:left-0 before:top-[0.7em] before:h-1 before:w-1 before:rounded-full before:bg-muted/60">
        {h}
      </li>
    ))}
  </ul>
);

const Gallery: React.FC<{ images: Shot[] }> = ({ images }) => {
  const t = ui[useLang().lang];
  const [shot, setShot] = useState<number | null>(null);
  return (
    <>
      <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
        {images.map((g, i) => (
          <button
            key={g.src}
            onClick={() => setShot(i)}
            className="shrink-0 overflow-hidden rounded border border-line"
            aria-label={`${t.openShot}${g.alt}`}
          >
            <img src={g.src} alt={g.alt} loading="lazy" className="h-28 w-auto" />
          </button>
        ))}
      </div>
      {shot !== null && (
        <Lightbox images={images} index={shot} onChange={setShot} onClose={() => setShot(null)} />
      )}
    </>
  );
};

const Stack: React.FC<{ items: string[] }> = ({ items }) => (
  <p className="mt-3 text-sm text-muted">
    <span className="sr-only">{ui[useLang().lang].builtWith}</span>
    {items.join(", ")}
  </p>
);

const PartBlock: React.FC<{ part: Part }> = ({ part }) => (
  <div className="mt-6">
    <h4 className="text-[0.9375rem] font-medium">{part.label}</h4>
    <Highlights items={part.highlights} />
    {part.gallery && <Gallery images={part.gallery} />}
    <Stack items={part.stack} />
  </div>
);

const Entry: React.FC<{ project: Project }> = ({ project: p }) => (
  <Row id={p.id} side={years(p.period, ui[useLang().lang].now)}>
    <h3 className="font-medium">
      {p.url ? (
        <a href={p.url} target="_blank" rel="noreferrer" className="link">
          {p.name}
        </a>
      ) : (
        p.name
      )}
    </h3>
    <p className="text-[0.9375rem] text-muted">
      {p.role},{" "}
      {p.companyUrl ? (
        <a href={p.companyUrl} target="_blank" rel="noreferrer" className="link">
          {p.company}
        </a>
      ) : (
        p.company
      )}
    </p>

    <p className="mt-3">{p.summary}</p>

    {p.parts ? (
      p.parts.map((part) => <PartBlock key={part.label} part={part} />)
    ) : (
      <>
        <Highlights items={p.highlights} />
        {p.gallery && <Gallery images={p.gallery} />}
        <Stack items={p.stack} />
      </>
    )}
  </Row>
);

export default Entry;
