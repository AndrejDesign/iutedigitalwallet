import { Bell, Wallet, ArrowDownLeft, CreditCard, Flame, Gift, ShieldAlert } from "lucide-react";
import { useStore } from "./store";
import { BottomSheet } from "./ui";
import type { Notification } from "./types";

const ICONS: Record<Notification["icon"], typeof Bell> = {
  money: ArrowDownLeft,
  card: CreditCard,
  squad: Flame,
  promo: Gift,
  alert: ShieldAlert,
};

export function GlobalHeader({ open, setOpen }: { open: boolean; setOpen: (v: boolean) => void }) {
  const { state, dispatch } = useStore();
  const unread = state.notifications.filter((n) => !n.read).length;

  function openSheet() {
    setOpen(true);
    // mark as read after a small delay so the badge animates out
    setTimeout(() => dispatch({ type: "READ_NOTIFICATIONS" }), 400);
  }

  return (
    <>
      <header className="sticky top-0 z-20 flex h-12 items-center justify-between border-b border-[var(--iute-divider)] bg-[var(--iute-bg)]/90 px-4 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--iute-red)] text-white">
            <Wallet size={15} strokeWidth={2.6} />
          </span>
          <span className="text-sm font-extrabold tracking-tight text-[var(--iute-text)]">MyIute<span className="text-[var(--iute-red)]">Pay</span></span>
        </div>
        <button
          onClick={openSheet}
          aria-label={`Notifications${unread ? ` (${unread} unread)` : ""}`}
          className="tap relative flex h-9 w-9 items-center justify-center rounded-2xl bg-[var(--iute-surface)]"
        >
          <Bell size={18} className="text-[var(--iute-text)]" />
          {unread > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--iute-red)] px-1 text-[10px] font-bold leading-none text-white">
              {unread}
            </span>
          )}
        </button>
      </header>

      <BottomSheet open={open} onClose={() => setOpen(false)} title="Notifications">
        {state.notifications.length === 0 ? (
          <p className="py-10 text-center text-sm font-bold text-[var(--iute-text-soft)]">You're all caught up ✨</p>
        ) : (
          <div className="space-y-2">
            {state.notifications.map((n) => {
              const Icon = ICONS[n.icon];
              return (
                <div key={n.id} className="flex items-start gap-3 rounded-2xl bg-[var(--iute-fog)] p-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--iute-red)] text-white">
                    <Icon size={16} />
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-extrabold text-[var(--iute-text)]">{n.title}</p>
                    <p className="text-xs font-medium text-[var(--iute-text-soft)]">{n.body}</p>
                    <p className="mt-1 font-mono text-[10px] font-bold uppercase tracking-wide text-[var(--iute-text-soft)]">{n.when}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </BottomSheet>
    </>
  );
}