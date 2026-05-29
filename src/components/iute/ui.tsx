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
      role="switch"
      aria-checked={on}
      onClick={() => onChange(!on)}
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
  const [mounted, setMounted] = useState(open);
  useEffect(() => { if (open) setMounted(true); }, [open]);
  if (!mounted && !open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <button
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
      />
      <div
        className="sheet-in relative w-full max-w-[390px] rounded-t-3xl bg-[var(--iute-surface)] p-5 pb-8 text-[var(--iute-text)] max-h-[85vh] overflow-y-auto"
        onAnimationEnd={() => { if (!open) setMounted(false); }}
      >
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-black/15" />
        <div className="mb-3 flex items-center justify-between">
          {title ? <h3 className="text-lg font-bold">{title}</h3> : <span />}
          <button onClick={onClose} className="tap rounded-full p-1.5 text-[var(--iute-text-soft)]">
            <X size={20} />
          </button>
        </div>
        {children}
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