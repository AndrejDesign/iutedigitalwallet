import { useState } from "react";
import {
  Plus, Snowflake, Flame, CreditCard as CCIcon, Sparkles, Info,
} from "lucide-react";
import { useStore, fmtMKD } from "../store";
import { Card, BottomSheet, PrimaryButton, SecondaryButton } from "../ui";
import { CARD_INSIGHTS, CARD_CATEGORIES } from "../mockData";
import type { WalletCard } from "../types";

export function Cards() {
  const { state, dispatch, toast } = useStore();
  const [addOpen, setAddOpen] = useState(false);
  const [insightIdx, setInsightIdx] = useState(0);
  const [insightDismissed, setInsightDismissed] = useState(false);

  const { cards, activeCardId } = state;
  const active = cards.find((c) => c.id === activeCardId) ?? cards[0];
  const isIute = active.brand === "iute";

  function toggleFreeze() {
    if (!isIute) {
      toast("🔒 Only iute cards can be frozen from the app.");
      return;
    }
    const newFrozen = !active.frozen;
    dispatch({ type: "TOGGLE_CARD_FREEZE", id: active.id, value: newFrozen });
    toast(newFrozen ? "❄️ Card frozen — all payments paused." : "🔥 Card unfrozen — ready to use.");
  }

  function addCard(card: Omit<WalletCard, "id" | "frozen">) {
    const id = `c_${Date.now()}`;
    dispatch({ type: "ADD_CARD", card: { ...card, id, frozen: false } });
  }

  const insight = CARD_INSIGHTS[insightIdx];
  function nextInsight() {
    setInsightIdx((i) => (i + 1) % CARD_INSIGHTS.length);
    setInsightDismissed(false);
  }

  return (
    <div className="min-h-screen bg-[var(--iute-bg)] px-4 pb-24 pt-2">
      <header className="mb-4 flex items-center justify-between px-1 pt-2">
        <h1 className="text-3xl font-extrabold text-[var(--iute-text)]">My Cards</h1>
        <button onClick={() => setAddOpen(true)} aria-label="Add card" className="tap flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--iute-surface)]">
          <Plus size={20} className="text-[var(--iute-text)]" />
        </button>
      </header>

      {/* Card graphic */}
      <div
        className="relative h-[220px] w-full overflow-hidden rounded-3xl text-white shadow-2xl transition-colors duration-500"
        style={{ background: active.frozen ? "var(--iute-red)" : "var(--iute-merlot)" }}
      >
        {active.frozen && (
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5" />
        )}
        <div className="absolute inset-0 flex flex-col justify-between p-5">
          <div className="flex items-start justify-between">
            <span className="text-2xl font-extrabold tracking-tight">{active.brand === "iute" ? "iute" : active.brand}</span>
            <span className="rounded-lg bg-white/15 px-2 py-1 text-[10px] font-bold uppercase tracking-wide ring-1 ring-white/30">{active.kind === "virtual" ? "Virtual" : "Linked"}</span>
          </div>
          <p className="font-mono text-[22px] tracking-[0.2em]">•••• •••• •••• {active.last4}</p>
          <div className="flex items-end justify-between font-mono text-[11px] uppercase">
            <span>{(active.name || state.userName || "YOUR NAME").toUpperCase()}</span>
            <span>{active.exp}</span>
            <span className="rounded-md bg-white/15 px-1.5 py-0.5 ring-1 ring-white/30">
              {active.frozen ? "[FROZEN]" : "[ACTIVE]"}
            </span>
          </div>
        </div>
      </div>

      {/* Card switcher */}
      {cards.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar">
          {cards.map((c) => {
            const isActive = c.id === active.id;
            return (
              <button
                key={c.id}
                onClick={() => dispatch({ type: "SET_ACTIVE_CARD", id: c.id })}
                className={`tap shrink-0 rounded-2xl px-3 py-2 text-[11px] font-extrabold ring-1 transition ${
                  isActive
                    ? "bg-[var(--iute-red)] text-white ring-[var(--iute-red)]"
                    : "bg-[var(--iute-surface)] text-[var(--iute-text)] ring-[var(--iute-divider)]"
                }`}
              >
                {c.brand === "iute" ? "iute" : c.brand} •••• {c.last4}
              </button>
            );
          })}
        </div>
      )}

      {/* Freeze / Unfreeze button (only iute cards can be frozen) */}
      {isIute ? (
        <button
          onClick={toggleFreeze}
          className={`tap mt-4 inline-flex h-14 w-full items-center justify-center gap-2 rounded-3xl text-sm font-extrabold ${active.frozen ? "bg-[var(--iute-red)] text-white" : "bg-[var(--iute-surface)] text-[var(--iute-red)] ring-1 ring-[var(--iute-divider)]"}`}
        >
          {active.frozen ? <Flame size={18} strokeWidth={2.5} /> : <Snowflake size={18} strokeWidth={2.5} />}
          {active.frozen ? "Unfreeze Card" : "Freeze Card"}
        </button>
      ) : (
        <div className="mt-4 flex items-start gap-3 rounded-3xl bg-[var(--iute-surface)] p-4 ring-1 ring-[var(--iute-divider)]">
          <Info size={18} className="mt-0.5 shrink-0 text-[var(--iute-text-soft)]" />
          <div>
            <p className="text-sm font-extrabold text-[var(--iute-text)]">Freeze unavailable</p>
            <p className="mt-0.5 text-[12px] font-medium text-[var(--iute-text-soft)]">
              This is a linked {active.brand} card, not an iute card. To freeze it, please use your bank's app.
            </p>
          </div>
        </div>
      )}

      {/* Daily Limit */}
      <Card className="mt-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold text-[var(--iute-text)]">Daily Limit</p>
          <span className="font-mono text-sm font-extrabold text-[var(--iute-text)]">{fmtMKD(state.dailyLimit)}</span>
        </div>
        <input
          type="range" min={500} max={50000} step={500} aria-label="Daily limit"
          value={state.dailyLimit}
          onChange={(e) => dispatch({ type: "SET_LIMIT", limit: +e.target.value })}
          className="mt-3 w-full accent-[var(--iute-red)]"
        />
        <div className="mt-1 flex justify-between font-mono text-[10px] font-bold text-[var(--iute-text-soft)]">
          <span>500</span><span>50,000</span>
        </div>
      </Card>

      {/* Statistics */}
      <h3 className="mt-5 mb-2 text-base font-extrabold text-[var(--iute-text)]">Card Statistics</h3>
      <div className="grid grid-cols-2 gap-3">
        <Card>
          <p className="text-[10px] font-bold uppercase tracking-wide text-[var(--iute-text-soft)]">This Month</p>
          <p className="mt-1 font-mono text-xl font-extrabold text-[var(--iute-text)]">-12,450 ден</p>
          <p className="text-[11px] font-medium text-[var(--iute-text-soft)]">Total Spent</p>
          <p className="mt-1 text-[11px] font-bold text-[var(--iute-red)]">↑ 12% vs last month</p>
        </Card>
        <Card>
          <p className="text-[10px] font-bold uppercase tracking-wide text-[var(--iute-text-soft)]">Transactions</p>
          <p className="mt-1 font-mono text-xl font-extrabold text-[var(--iute-red)]">23</p>
          <p className="text-[11px] font-medium text-[var(--iute-text-soft)]">This Month</p>
          <p className="mt-1 text-[11px] font-medium text-[var(--iute-text-soft)]">Avg: 541 ден each</p>
        </Card>
        <div className="col-span-2">
          <h3 className="mb-2 text-base font-extrabold text-[var(--iute-text)]">Spending by Category</h3>
          <CategoryBento />
        </div>
      </div>

      {/* AI Insight */}
      {!insightDismissed && (
        <Card className="mt-4 bg-[var(--iute-parchment)] dark:bg-[var(--iute-merlot)]">
          <div className="flex items-start gap-2">
            <Sparkles size={20} className="mt-0.5 text-[var(--iute-red)]" />
            <div className="flex-1">
              <p className="text-sm font-extrabold text-[var(--iute-text)]">{insight.title}</p>
              <p className="mt-1 text-[13px] font-medium text-[var(--iute-text)]">{insight.body}</p>
              <div className="mt-3 flex gap-2">
                <button onClick={() => { toast(`✓ ${insight.cta} actioned`); nextInsight(); }} className="tap h-10 flex-1 rounded-xl bg-[var(--iute-red)] text-xs font-bold text-white">
                  {insight.cta}
                </button>
                <button onClick={() => { setInsightDismissed(true); setTimeout(nextInsight, 300); }} className="tap h-10 flex-1 rounded-xl bg-[var(--iute-fog)] text-xs font-bold text-[var(--iute-text-soft)]">
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </Card>
      )}

      <AddCardSheet
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onAddExisting={(card) => { addCard({ ...card, kind: "existing" }); toast("✅ Card linked!"); }}
        onRequestVirtual={() => toast("📨 Virtual card requested — we'll notify you when it's ready.")}
      />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* ADD CARD FLOW                                                              */
/* -------------------------------------------------------------------------- */
function AddCardSheet({
  open, onClose, onAddExisting, onRequestVirtual,
}: {
  open: boolean;
  onClose: () => void;
  onAddExisting: (card: { last4: string; name: string; exp: string; brand: "VISA" | "MC" }) => void;
  onRequestVirtual: () => void;
}) {
  const [type, setType] = useState<"existing" | "virtual" | null>(null);
  const [num, setNum] = useState("");
  const [name, setName] = useState("");
  const [exp, setExp] = useState("");
  const [cvv, setCvv] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function reset() { setType(null); setNum(""); setName(""); setExp(""); setCvv(""); setSubmitted(false); }
  function close() { onClose(); setTimeout(reset, 250); }

  function formatCardNumber(v: string) {
    return v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  }
  const digits = num.replace(/\D/g, "");
  const last4 = digits.slice(-4) || "••••";
  const brand: "VISA" | "MC" = digits.startsWith("5") ? "MC" : "VISA";
  const expValid = /^\d{2}\/\d{2}$/.test(exp);
  const canSubmit = digits.length === 16 && name.trim().length >= 2 && expValid && cvv.length >= 3;

  return (
    <BottomSheet open={open} onClose={close} title="Add New Card">
      {!type && (
        <div className="space-y-3">
          <TypeOption Icon={CCIcon} label="Add Existing Card" sub="Link a Visa/Mastercard you already own" onClick={() => setType("existing")} />
          <TypeOption Icon={Plus} label="Request Virtual Card" sub="Free · No physical card needed" onClick={() => setType("virtual")} />
        </div>
      )}

      {type === "existing" && (
        <div className="space-y-3">
          {/* Mini live preview */}
          <div className="relative h-32 rounded-2xl bg-[var(--iute-merlot)] p-4 text-white">
            <p className="text-xs font-bold opacity-70">{brand}</p>
            <p className="mt-2 font-mono text-base tracking-widest">{num || "•••• •••• •••• ••••"}</p>
            <div className="mt-2 flex items-end justify-between font-mono text-[10px] uppercase">
              <span>{name || "CARDHOLDER NAME"}</span>
              <span>{exp || "MM/YY"}</span>
            </div>
          </div>
          <input value={num} onChange={(e) => setNum(formatCardNumber(e.target.value))} placeholder="Card number" inputMode="numeric" autoComplete="cc-number" className="h-12 w-full rounded-2xl bg-[var(--iute-fog)] px-4 font-mono text-base font-bold text-[var(--iute-text)] outline-none focus:ring-2 focus:ring-[var(--iute-red)]" />
          <input value={name} onChange={(e) => setName(e.target.value.toUpperCase())} placeholder="Cardholder name" autoComplete="cc-name" className="h-12 w-full rounded-2xl bg-[var(--iute-fog)] px-4 text-sm font-bold text-[var(--iute-text)] outline-none focus:ring-2 focus:ring-[var(--iute-red)]" />
          <div className="grid grid-cols-2 gap-2">
            <input value={exp} onChange={(e) => { const v = e.target.value.replace(/\D/g, "").slice(0, 4); setExp(v.length > 2 ? `${v.slice(0, 2)}/${v.slice(2)}` : v); }} placeholder="MM/YY" inputMode="numeric" autoComplete="cc-exp" className="h-12 rounded-2xl bg-[var(--iute-fog)] px-4 font-mono text-base font-bold text-[var(--iute-text)] outline-none focus:ring-2 focus:ring-[var(--iute-red)]" />
            <input type="password" value={cvv} onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))} placeholder="CVV" inputMode="numeric" autoComplete="cc-csc" className="h-12 rounded-2xl bg-[var(--iute-fog)] px-4 font-mono text-base font-bold text-[var(--iute-text)] outline-none focus:ring-2 focus:ring-[var(--iute-red)]" />
          </div>
          <PrimaryButton
            disabled={!canSubmit}
            onClick={() => {
              onAddExisting({ last4, name: name.trim(), exp, brand });
              close();
            }}
          >
            Add Card
          </PrimaryButton>
          <SecondaryButton onClick={() => setType(null)}>Back</SecondaryButton>
        </div>
      )}

      {type === "virtual" && (
        <div className="space-y-4">
          {submitted ? (
            <>
              <div className="rounded-2xl bg-[var(--iute-fog)] p-4 text-center">
                <p className="text-3xl">📨</p>
                <p className="mt-2 text-sm font-extrabold text-[var(--iute-text)]">Request submitted</p>
                <p className="mt-1 text-[12px] font-medium text-[var(--iute-text-soft)]">
                  We'll review your request and notify you when your virtual card is ready.
                </p>
              </div>
              <PrimaryButton onClick={close}>Done</PrimaryButton>
            </>
          ) : (
            <>
              <p className="text-sm font-bold text-[var(--iute-text)]">Request a new virtual card. Our team will issue it after a quick review.</p>
              <div className="flex gap-2">
                {(["MKD", "EUR"] as const).map((c) => (
                  <button key={c} className="tap h-11 flex-1 rounded-2xl bg-[var(--iute-fog)] text-sm font-bold text-[var(--iute-text)] ring-1 ring-[var(--iute-divider)]">{c}</button>
                ))}
              </div>
              <PrimaryButton onClick={() => { onRequestVirtual(); setSubmitted(true); }}>Submit Request</PrimaryButton>
              <SecondaryButton onClick={() => setType(null)}>Back</SecondaryButton>
            </>
          )}
        </div>
      )}
    </BottomSheet>
  );
}

function TypeOption({ Icon, label, sub, onClick }: { Icon: typeof Plus; label: string; sub: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="tap flex h-[72px] w-full items-center gap-3 rounded-2xl border-2 border-transparent bg-[var(--iute-fog)] px-4 text-left hover:border-[var(--iute-red)]">
      <Icon size={22} className="text-[var(--iute-red)]" />
      <div className="flex-1">
        <p className="text-sm font-extrabold text-[var(--iute-text)]">{label}</p>
        <p className="text-[11px] font-medium text-[var(--iute-text-soft)]">{sub}</p>
      </div>
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/* CATEGORY BENTO                                                             */
/* -------------------------------------------------------------------------- */
function CategoryBento() {
  const [active, setActive] = useState<string | null>(null);
  const total = CARD_CATEGORIES.reduce((s, c) => s + c.amount, 0);
  return (
    <div className="grid grid-cols-2 gap-3">
      {CARD_CATEGORIES.map((c) => {
        const pct = Math.round((c.amount / total) * 100);
        const isActive = active === c.label;
        return (
          <button
            key={c.label}
            onClick={() => setActive(isActive ? null : c.label)}
            className={`tap relative overflow-hidden rounded-2xl bg-white p-3 text-left shadow-sm ring-1 ring-[var(--iute-divider)] transition-transform duration-200 dark:bg-[var(--iute-surface)] ${isActive ? "scale-[1.02]" : "hover:scale-[1.02]"}`}
            style={{ borderTop: `3px solid ${c.color}` }}
          >
            {c.badge && (
              <span
                className="absolute right-2 top-2 rounded-full px-2 py-0.5 text-[9px] font-extrabold text-white shadow"
                style={{ background: c.color }}
              >
                {c.badge}
              </span>
            )}
            <span
              className="flex h-9 w-9 items-center justify-center rounded-xl text-lg"
              style={{ background: `${c.color}22`, color: c.color }}
            >
              {c.icon}
            </span>
            <p className="mt-2 text-xs font-extrabold text-[var(--iute-text)]">{c.label}</p>
            <p className="font-mono text-base font-extrabold" style={{ color: c.color }}>
              {c.amount.toLocaleString()} <span className="text-[10px] opacity-70">ден</span>
            </p>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--iute-fog)]">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${pct}%`, background: c.color }}
              />
            </div>
            {isActive && (
              <p className="mt-1 font-mono text-[10px] font-bold" style={{ color: c.color }}>
                {pct}% of total
              </p>
            )}
          </button>
        );
      })}
    </div>
  );
}