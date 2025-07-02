import React, { createContext, useContext, useEffect, useState } from "react";

export type Lang = "en" | "ru";

interface LangContextType {
  lang: Lang;
  toggleLang: () => void;
}

const LangContext = createContext<LangContextType | undefined>(undefined);

export const useLang = () => {
  const context = useContext(LangContext);
  if (!context) throw new Error("useLang must be used within a LangProvider");
  return context;
};

const initialLang = (): Lang => {
  const q = new URLSearchParams(window.location.search).get("lang");
  if (q === "ru" || q === "en") return q;
  try {
    return localStorage.getItem("lang") === "ru" ? "ru" : "en";
  } catch {
    return "en";
  }
};

export const LangProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Lang>(initialLang);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const toggleLang = () => {
    const next = lang === "en" ? "ru" : "en";
    setLang(next);
    try {
      localStorage.setItem("lang", next);
    } catch {
      /* storage unavailable */
    }
  };

  return <LangContext.Provider value={{ lang, toggleLang }}>{children}</LangContext.Provider>;
};
