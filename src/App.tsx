import React, { useEffect, useState } from "react";
import { Menu, Moon, Sun, X } from "lucide-react";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { LangProvider, useLang } from "./context/LangContext";
import Entry, { Row, years } from "./components/Entry";
import { content, ui } from "./data/i18n";

const Section: React.FC<{
  id: string;
  title: string;
  children: React.ReactNode;
}> = ({ id, title, children }) => (
  <section id={id} aria-labelledby={`${id}-h`} className="mt-16 scroll-mt-20">
    <h2 id={`${id}-h`} className="mb-2 text-[0.875rem] font-medium text-muted">
      {title}
    </h2>
    {children}
  </section>
);

const ThemeToggle: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  const t = ui[useLang().lang];
  return (
    <button
      onClick={toggleTheme}
      className="rounded-md p-2 text-muted hover:text-ink sm:-mr-2"
      aria-label={isDark ? t.theme.light : t.theme.dark}
    >
      {isDark ? <Sun size={17} /> : <Moon size={17} />}
    </button>
  );
};

const LangToggle: React.FC = () => {
  const { lang, toggleLang } = useLang();
  return (
    <button
      onClick={toggleLang}
      className="rounded-md px-1 py-2 text-sm font-medium text-muted hover:text-ink"
      aria-label={ui[lang].switchLang}
    >
      {lang === "en" ? "RU" : "EN"}
    </button>
  );
};

// The name in the bar only shows once the page's own heading has scrolled away.
const useScrolledPast = (id: string) => {
  const [past, setPast] = useState(false);
  useEffect(() => {
    const el = document.getElementById(id);
    if (!el) return;
    // The callback only fires when the heading crosses the bar's bottom edge
    // (56px), so compare against that edge rather than the viewport top.
    const io = new IntersectionObserver(
      ([e]) =>
        setPast(
          !e.isIntersecting &&
            e.boundingClientRect.top < (e.rootBounds?.top ?? 56),
        ),
      {
        rootMargin: "-56px 0px 0px 0px",
      },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [id]);
  return past;
};

const TopBar: React.FC = () => {
  const showName = useScrolledPast("name");
  const { profile, ui: t } = content(useLang().lang);
  const sections = [
    { href: "#work", label: t.nav.work },
    { href: "#projects", label: t.nav.other },
    { href: "#writing", label: t.nav.writing },
    { href: "#contact", label: t.nav.contact },
  ];
  const [open, setOpen] = useState(false);
  return (
    <div className="sticky top-0 z-20 border-b border-line bg-bg/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-page items-center justify-between gap-4 px-5">
        <a
          href="#top"
          tabIndex={showName ? 0 : -1}
          aria-hidden={!showName}
          className={`font-medium transition-opacity duration-200 hover:text-accent ${
            showName ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          {profile.name}
        </a>
        <div className="flex items-center gap-x-3.5 text-[0.9375rem] text-muted sm:gap-x-5">
          <nav
            aria-label={t.sectionsLabel}
            className="hidden items-center gap-x-5 sm:flex"
          >
            {sections.map((s) => (
              <a key={s.href} href={s.href} className="hover:text-ink">
                {s.label}
              </a>
            ))}
          </nav>
          <LangToggle />
          <ThemeToggle />
          <button
            onClick={() => setOpen(!open)}
            className="-mr-2 rounded-md p-2 hover:text-ink sm:hidden"
            aria-label={open ? t.menuClose : t.menuOpen}
            aria-expanded={open}
            aria-controls="mobile-nav"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>
      {open && (
        <nav
          id="mobile-nav"
          aria-label={t.sectionsLabel}
          className="border-t border-line px-5 py-2 sm:hidden"
        >
          {sections.map((s) => (
            <a
              key={s.href}
              href={s.href}
              onClick={() => setOpen(false)}
              className="block py-2.5 text-muted hover:text-ink"
            >
              {s.label}
            </a>
          ))}
        </nav>
      )}
    </div>
  );
};

const Page: React.FC = () => {
  const { lang } = useLang();
  const {
    profile,
    selectedWork,
    otherProjects,
    article,
    research,
    education,
    ui: t,
  } = content(lang);
  return (
    <>
      <TopBar />
      <div
        id="top"
        className="mx-auto max-w-page scroll-mt-20 px-5 pb-20 pt-12 sm:pt-16"
      >
        <header>
          <h1
            id="name"
            className="text-[1.625rem] font-semibold leading-tight tracking-tight"
          >
            {profile.name}
          </h1>
          <p className="mt-1.5 text-muted">
            {t.headline[0]}
            <a
              href="https://neutune.com/"
              target="_blank"
              rel="noreferrer"
              className="link"
            >
              Neutune
            </a>
            {t.headline[1]}
          </p>

          <div className="mt-8 space-y-4">
            {t.bio.map((para) => (
              <p key={para}>{para}</p>
            ))}
          </div>

          <nav
            aria-label="Contact"
            className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-[0.9375rem]"
          >
            <a href={`mailto:${profile.email}`} className="link">
              {t.email}
            </a>
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer"
              className="link"
            >
              GitHub
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer"
              className="link"
            >
              LinkedIn
            </a>
            <a href={profile.cv} download className="link">
              {t.resume}
            </a>
            <span className="text-muted">{t.location}</span>
          </nav>
        </header>

        <main>
          <Section id="work" title={t.sections.work}>
            {selectedWork.map((p) => (
              <Entry key={p.id} project={p} />
            ))}
          </Section>

          <Section id="projects" title={t.sections.other}>
            {otherProjects.map((p) => (
              <Entry key={p.id} project={p} compact />
            ))}
          </Section>

          <Section id="writing" title={t.sections.writing}>
            <Row side={years(article.date, t.now)}>
              <h3 className="font-medium">
                <a
                  href={article.url}
                  target="_blank"
                  rel="noreferrer"
                  className="link"
                >
                  {article.title}
                </a>
              </h3>
              <p className="mt-3">{article.subtitle}</p>
              <p className="mt-3 flex flex-wrap gap-x-5 text-[0.9375rem]">
                <a
                  href={article.url}
                  target="_blank"
                  rel="noreferrer"
                  className="link"
                >
                  {t.readOnLinkedIn}
                </a>
                <a
                  href={article.researchUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="link"
                >
                  {t.researchNote}
                </a>
              </p>
            </Row>
          </Section>

          <Section id="background" title={t.sections.background}>
            <Row side={years(education.period, t.now)}>
              <h3 className="font-medium">{education.degree}</h3>
              <p className="text-[0.9375rem] text-muted">
                <a
                  href={education.url}
                  target="_blank"
                  rel="noreferrer"
                  className="link"
                >
                  {education.school}
                </a>
              </p>
              <ul className="mt-3 space-y-1 text-[0.9375rem] text-ink/80">
                {education.notes.map((n) => (
                  <li key={n.text}>
                    {n.url ? (
                      <a
                        href={n.url}
                        target="_blank"
                        rel="noreferrer"
                        className="link"
                      >
                        {n.text}
                      </a>
                    ) : (
                      n.text
                    )}
                  </li>
                ))}
              </ul>
            </Row>
            {research.map((r) => (
              <Row key={r.org + r.role} side={years(r.period, t.now)}>
                <h3 className="font-medium">{r.role}</h3>
                <p className="text-[0.9375rem] text-muted">
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noreferrer"
                    className="link"
                  >
                    {r.org}
                  </a>
                </p>
                <p className="mt-3">{r.detail}</p>
              </Row>
            ))}
          </Section>
        </main>

        <footer
          id="contact"
          className="mt-16 scroll-mt-20 border-t border-line pt-6"
        >
          <p>
            {t.contact}
            <a href={`mailto:${profile.email}`} className="link break-all">
              {profile.email}
            </a>
          </p>
          <p className="mt-6 text-sm text-muted">
            © {new Date().getFullYear()} {profile.name}
          </p>
        </footer>
      </div>
    </>
  );
};

const App = () => (
  <ThemeProvider>
    <LangProvider>
      <Page />
    </LangProvider>
  </ThemeProvider>
);

export default App;
