import { LayoutGrid, Flame, ScanLine, CreditCard, User } from "lucide-react";
import { useStore } from "./store";
import type { ScreenKey } from "./types";

const LEFT: { key: ScreenKey; label: string; Icon: typeof LayoutGrid }[] = [
  { key: "home", label: "Home", Icon: LayoutGrid },
  { key: "squad", label: "Squad", Icon: Flame },
];
const RIGHT: { key: ScreenKey; label: string; Icon: typeof LayoutGrid }[] = [
  { key: "cards", label: "Cards", Icon: CreditCard },
  { key: "account", label: "Account", Icon: User },
];

function Tab({ tabKey, label, Icon }: { tabKey: ScreenKey; label: string; Icon: typeof LayoutGrid }) {
  const { state, go } = useStore();
  const active = state.screen === tabKey;
  return (
    <button
      onClick={() => go(tabKey)}
      aria-label={label}
      className="tap flex min-h-[48px] min-w-[48px] flex-1 flex-col items-center justify-center gap-1"
    >
      <Icon size={20} className={active ? "text-[var(--iute-red)]" : "text-[var(--iute-text-soft)]"} />
      <span className={`text-[10px] font-bold uppercase tracking-wide whitespace-nowrap ${active ? "text-[var(--iute-red)]" : "text-[var(--iute-text-soft)]"}`}>
        {label}
      </span>
    </button>
  );
}

export function BottomNav() {
  const { go } = useStore();
  return (
    <nav className="pointer-events-none absolute inset-x-0 bottom-0 z-30 flex justify-center">
      <div className="pointer-events-auto relative mx-auto w-full max-w-[393px] px-3 pb-3">
        <div className="relative flex h-16 items-center rounded-3xl border border-[var(--iute-divider)] bg-[var(--iute-surface)]/90 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
          {/* Left side */}
          <div className="flex flex-1 items-center" style={{ paddingLeft: 12, paddingRight: 52 }}>
            {LEFT.map((t) => <Tab key={t.key} tabKey={t.key} label={t.label} Icon={t.Icon} />)}
          </div>
          {/* Right side */}
          <div className="flex flex-1 items-center" style={{ paddingLeft: 52, paddingRight: 12 }}>
            {RIGHT.map((t) => <Tab key={t.key} tabKey={t.key} label={t.label} Icon={t.Icon} />)}
          </div>
          {/* Center QR */}
          <button
            onClick={() => go("scan")}
            aria-label="Scan QR code"
            className="tap absolute left-1/2 -top-3 -translate-x-1/2"
          >
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--iute-red)] text-white shadow-[0_10px_24px_rgba(216,37,44,0.5)] ring-4 ring-[var(--iute-bg)]">
              <ScanLine size={28} strokeWidth={2.5} />
            </span>
          </button>
        </div>
      </div>
    </nav>
  );
}