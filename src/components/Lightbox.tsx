import React, { useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface Props {
  images: { src: string; alt: string }[];
  index: number;
  onChange: (i: number) => void;
  onClose: () => void;
}

const Lightbox: React.FC<Props> = ({ images, index, onChange, onClose }) => {
  const n = images.length;
  const go = (d: number) => onChange((index + d + n) % n);
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  // Latest handlers, so the mount-only effect below never goes stale.
  const handlers = useRef({ go, onClose });
  handlers.current = { go, onClose };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handlers.current.onClose();
      if (e.key === "ArrowRight") handlers.current.go(1);
      if (e.key === "ArrowLeft") handlers.current.go(-1);
      if (e.key === "Tab") trapFocus(e);
    };
    // Keep Tab inside the dialog while it is open.
    const trapFocus = (e: KeyboardEvent) => {
      const items = dialogRef.current?.querySelectorAll<HTMLElement>("button:not([tabindex='-1'])");
      if (!items?.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      const inside = dialogRef.current?.contains(document.activeElement);
      if (e.shiftKey && (!inside || document.activeElement === first)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (!inside || document.activeElement === last)) {
        e.preventDefault();
        first.focus();
      }
    };
    const opener = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      opener?.focus();
    };
  }, []);

  const img = images[index];
  const ctrl = "rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={img.alt}
      ref={dialogRef}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4"
    >
      <button onClick={onClose} tabIndex={-1} aria-hidden="true" className="absolute inset-0 cursor-default bg-black/90" />
      <button ref={closeRef} onClick={onClose} className={`absolute right-4 top-4 z-10 ${ctrl}`} aria-label="Close">
        <X size={20} />
      </button>
      <img
        src={img.src}
        alt={img.alt}
        className="relative max-h-[80vh] max-w-full rounded-lg object-contain"
      />
      <div className="relative mt-4 flex items-center gap-4 text-sm text-white/80">
        {n > 1 && (
          <button onClick={() => go(-1)} className={ctrl} aria-label="Previous screenshot">
            <ChevronLeft size={20} />
          </button>
        )}
        <span>
          {img.alt}
          {n > 1 && ` · ${index + 1}/${n}`}
        </span>
        {n > 1 && (
          <button onClick={() => go(1)} className={ctrl} aria-label="Next screenshot">
            <ChevronRight size={20} />
          </button>
        )}
      </div>
    </div>
  );
};

export default Lightbox;
