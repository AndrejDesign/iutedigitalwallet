import { type ReactNode, useEffect, useState } from "react";
import { X } from "lucide-react";

export function Card({
  children, className = "", padded = true, onClick,
}: { children: ReactNode; className?: string; padded?: boolean; onClick?: () => void }) {
  return (
    <div
      onClick={onClick}
      className={`rounded-3xl bg-[var(--iute-surface)] ${padded ? "p-4" : ""} ${onClick ? "tap cursor-pointer" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

export function PrimaryButton({
  children, onClick, className = "", disabled = false,
}: { children: ReactNode; onClick?: () => void; className?: string; disabled?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`tap h-14 w-full rounded-3xl bg-[var(--iute-red)] text-white font-bold text-base ${disabled ? "opacity-50" : ""} ${className}`}
    >
      {children}
    </button>
  );
}

export function SecondaryButton({
  children, onClick, className = "",
}: { children: ReactNode; onClick?: () => void; className?: string }) {
  return (
    <button
      onClick={onClick}
      className={`tap h-14 w-full rounded-3xl border-2 border-[var(--iute-text)] text-[var(--iute-text)] font-bold text-base bg-transparent ${className}`}
    >
      {children}
    </button>
  );
}

export function Toggle({
  on, onChange,
}: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={(e) => { e.stopPropagation(); onChange(!on); }}
      className={`tap relative h-7 w-[52px] rounded-full transition-colors duration-200 ${on ? "bg-[var(--iute-red)]" : "bg-black/15"}`}
    >
      <span
        className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform duration-200 ${on ? "translate-x-[26px]" : "translate-x-0.5"}`}
      />
    </button>
  );
}

export function Chip({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center rounded-lg px-2 py-1 text-[10px] font-bold uppercase tracking-wide ${className}`}>
      {children}
    </span>
  );
}

export function BottomSheet({
  open, onClose, title, children,
}: { open: boolean; onClose: () => void; title?: string; children: ReactNode }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <button
        type="button"
        aria-label="Close sheet"
        onClick={onClose}
        className="absolute inset-0 bg-black/50"
      />
      <div className="sheet-in relative w-full max-w-[390px] rounded-t-3xl bg-[var(--iute-surface)] text-[var(--iute-text)] max-h-[92vh] flex flex-col shadow-[0_-20px_60px_-10px_rgba(0,0,0,0.4)]">
        <div className="relative shrink-0 px-5 pt-3 pb-2">
          <div className="mx-auto h-1 w-10 rounded-full bg-black/20" />
          <div className="mt-3 flex items-center justify-between min-h-[44px]">
            {title ? <h3 className="text-lg font-extrabold">{title}</h3> : <span />}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="tap flex h-11 w-11 items-center justify-center rounded-full bg-[var(--iute-fog)] text-[var(--iute-text)] -mr-1"
            >
              <X size={22} strokeWidth={2.4} />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-5 pb-8">{children}</div>
      </div>
    </div>
  );
}

export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`shimmer rounded-2xl ${className}`} />;
}

export function Confetti() {
  const colors = ["#D8252C", "#5A0917", "#FBF1E4", "#EBF3FF", "#2D2D2D"];
  const pieces = Array.from({ length: 40 });
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {pieces.map((_, i) => {
        const left = Math.random() * 100;
        const delay = Math.random() * 600;
        const size = 6 + Math.random() * 8;
        const bg = colors[i % colors.length];
        return (
          <span
            key={i}
            className="confetti-piece absolute top-0 block rounded-sm"
            style={{ left: `${left}%`, width: size, height: size, background: bg, animationDelay: `${delay}ms` }}
          />
        );
      })}
    </div>
  );
}