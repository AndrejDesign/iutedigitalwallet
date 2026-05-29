import { LayoutGrid, Flame, ScanLine, CreditCard, User } from "lucide-react";
import { useStore } from "./store";
import type { ScreenKey } from "./types";

const TABS: { key: ScreenKey; label: string; Icon: typeof LayoutGrid }[] = [
  { key: "home", label: "Home", Icon: LayoutGrid },
  { key: "squad", label: "Squad", Icon: Flame },
  { key: "scan", label: "Scan", Icon: ScanLine },
  { key: "cards", label: "Cards", Icon: CreditCard },
  { key: "account", label: "Account", Icon: User },
];

export function BottomNav() {
  const { state, go } = useStore();
  return (
    <nav className="pointer-events-none fixed inset-x-0 bottom-0 z-30 flex justify-center">
      <div className="pointer-events-auto relative mx-auto w-full max-w-[390px] px-3 pb-3">
        <div className="relative flex h-16 items-center justify-around rounded-3xl border border-[var(--iute-divider)] bg-[var(--iute-surface)]/85 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
          {TABS.map(({ key, label, Icon }, idx) => {
            const active = state.screen === key;
            if (key === "scan") {
              return (
                <button
                  key={key}
                  onClick={() => go("scan")}
                  className="tap absolute left-1/2 -top-5 -translate-x-1/2"
                  aria-label="Scan QR"
                >
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--iute-red)] text-white shadow-[0_10px_24px_rgba(216,37,44,0.5)] ring-4 ring-[var(--iute-bg)]">
                    <ScanLine size={28} strokeWidth={2.5} />
                  </span>
                </button>
              );
            }
            return (
              <button
                key={key}
                onClick={() => go(key)}
                className={`tap flex h-full flex-1 flex-col items-center justify-center gap-1 ${idx === 2 ? "invisible" : ""}`}
              >
                <Icon size={20} className={active ? "text-[var(--iute-red)]" : "text-[var(--iute-text-soft)]"} />
                <span className={`text-[10px] font-bold uppercase tracking-wide ${active ? "text-[var(--iute-red)]" : "text-[var(--iute-text-soft)]"}`}>
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}