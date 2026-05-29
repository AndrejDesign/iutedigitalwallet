import { useState } from "react";
import {
  Plus, Snowflake, Flame, CreditCard as CCIcon, Package, Sparkles,
  Check, X as XIcon,
} from "lucide-react";
import { useStore, fmtMKD } from "../store";
import { Card, BottomSheet, PrimaryButton, SecondaryButton } from "../ui";
import { CARD_INSIGHTS, CARD_CATEGORIES } from "../mockData";

export function Cards() {
  const { state, dispatch, toast } = useStore();
  const [last4, setLast4] = useState("8942");
  const [addOpen, setAddOpen] = useState(false);
  const [insightIdx, setInsightIdx] = useState(0);
  const [insightDismissed, setInsightDismissed] = useState(false);

  function toggleFreeze() {
    const newFrozen = !state.cardFrozen;
    dispatch({ type: "TOGGLE_FREEZE", value: newFrozen });
    toast(newFrozen ? "❄️ Card frozen — all payments paused." : "🔥 Card unfrozen — ready to use.");
  }

  const insight = CARD_INSIGHTS[insightIdx];
  function nextInsight() {
    setInsightIdx((i) => (i + 1) % CARD_INSIGHTS.length);
    setInsightDismissed(false);
  }

  return (
    <div className="min-h-screen bg-[var(--iute-bg)] px-4 pb-32 pt-12">
      <header className="mb-4 flex items-center justify-between px-1 pt-2">
        <h1 className="text-3xl font-extrabold text-[var(--iute-text)]">My Cards</h1>
        <button onClick={() => setAddOpen(true)} aria-label="Add card" className="tap flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--iute-surface)]">
          <Plus size={20} className="text-[var(--iute-text)]" />
        </button>
      </header>

      {/* Card graphic */}
      <div
        className="relative h-[220px] w-full overflow-hidden rounded-3xl text-white shadow-2xl transition-colors duration-500"
        style={{ background: state.cardFrozen ? "var(--iute-red)" : "var(--iute-merlot)" }}
      >
        {state.cardFrozen && (
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5" />
        )}
        <div className="absolute inset-0 flex flex-col justify-between p-5">
          <div className="flex items-start justify-between">
            <span className="text-2xl font-extrabold tracking-tight">iute</span>
            <span className="rounded-lg bg-white/15 px-2 py-1 text-[10px] font-bold uppercase tracking-wide ring-1 ring-white/30">Virtual</span>
          </div>
          <p className="font-mono text-[22px] tracking-[0.2em]">•••• •••• •••• {last4}</p>
          <div className="flex items-end justify-between font-mono text-[11px] uppercase">
            <span>Anja Angelovska</span>
            <span>09/28</span>
            <span className="rounded-md bg-white/15 px-1.5 py-0.5 ring-1 ring-white/30">
              {state.cardFrozen ? "[FROZEN]" : "[ACTIVE]"}
            </span>
          </div>
        </div>
      </div>

      {/* Freeze / Unfreeze button */}
      <button
        onClick={toggleFreeze}
        className={`tap mt-4 inline-flex h-14 w-full items-center justify-center gap-2 rounded-3xl text-sm font-extrabold ${state.cardFrozen ? "bg-[var(--iute-red)] text-white" : "bg-[var(--iute-surface)] text-[var(--iute-red)] ring-1 ring-[var(--iute-divider)]"}`}
      >
        {state.cardFrozen ? <Flame size={18} strokeWidth={2.5} /> : <Snowflake size={18} strokeWidth={2.5} />}
        {state.cardFrozen ? "Unfreeze Card" : "Freeze Card"}
      </button>

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
          <p className="mb-2 px-1 text-[10px] font-bold uppercase tracking-wide text-[var(--iute-text-soft)]">Spending by Category</p>
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

      <AddCardSheet open={addOpen} onClose={() => setAddOpen(false)} onAdded={(n) => { setLast4(n); toast("✅ Card added!"); }} />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* ADD CARD FLOW                                                              */
/* -------------------------------------------------------------------------- */
function AddCardSheet({ open, onClose, onAdded }: { open: boolean; onClose: () => void; onAdded: (last4: string) => void }) {
  const [type, setType] = useState<"existing" | "virtual" | "physical" | null>(null);
  const [num, setNum] = useState("");
  const [name, setName] = useState("");
  const [exp, setExp] = useState("");
  const [cvv, setCvv] = useState("");
  const [loading, setLoading] = useState(false);

  function reset() { setType(null); setNum(""); setName(""); setExp(""); setCvv(""); setLoading(false); }
  function close() { onClose(); setTimeout(reset, 250); }

  function formatCardNumber(v: string) {
    return v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  }
  const last4 = num.replace(/\D/g, "").slice(-4) || "••••";

  return (
    <BottomSheet open={open} onClose={close} title="Add New Card">
      {!type && (
        <div className="space-y-3">
          <TypeOption Icon={CCIcon} label="Add Existing Card" sub="Link a Visa/Mastercard you already own" onClick={() => setType("existing")} />
          <TypeOption Icon={Plus} label="Request Virtual Card" sub="Instant · Free · No physical card needed" onClick={() => setType("virtual")} />
          <TypeOption Icon={Package} label="Order Physical Card" sub="Delivered in 3–5 business days" onClick={() => setType("physical")} />
        </div>
      )}

      {type === "existing" && (
        <div className="space-y-3">
          {/* Mini live preview */}
          <div className="relative h-32 rounded-2xl bg-[var(--iute-merlot)] p-4 text-white">
            <p className="text-xs font-bold opacity-70">VISA</p>
            <p className="mt-2 font-mono text-base tracking-widest">{num || "•••• •••• •••• ••••"}</p>
            <div className="mt-2 flex items-end justify-between font-mono text-[10px] uppercase">
              <span>{name || "CARDHOLDER NAME"}</span>
              <span>{exp || "MM/YY"}</span>
            </div>
          </div>
          <input value={num} onChange={(e) => setNum(formatCardNumber(e.target.value))} placeholder="Card number" inputMode="numeric" className="h-12 w-full rounded-2xl bg-[var(--iute-fog)] px-4 font-mono text-base font-bold text-[var(--iute-text)] outline-none focus:ring-2 focus:ring-[var(--iute-red)]" />
          <input value={name} onChange={(e) => setName(e.target.value.toUpperCase())} placeholder="Cardholder name" className="h-12 w-full rounded-2xl bg-[var(--iute-fog)] px-4 text-sm font-bold text-[var(--iute-text)] outline-none focus:ring-2 focus:ring-[var(--iute-red)]" />
          <div className="grid grid-cols-2 gap-2">
            <input value={exp} onChange={(e) => { const v = e.target.value.replace(/\D/g, "").slice(0, 4); setExp(v.length > 2 ? `${v.slice(0, 2)}/${v.slice(2)}` : v); }} placeholder="MM/YY" className="h-12 rounded-2xl bg-[var(--iute-fog)] px-4 font-mono text-base font-bold text-[var(--iute-text)] outline-none focus:ring-2 focus:ring-[var(--iute-red)]" />
            <input type="password" value={cvv} onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))} placeholder="CVV" inputMode="numeric" className="h-12 rounded-2xl bg-[var(--iute-fog)] px-4 font-mono text-base font-bold text-[var(--iute-text)] outline-none focus:ring-2 focus:ring-[var(--iute-red)]" />
          </div>
          <PrimaryButton disabled={num.length < 19 || !name || !exp || !cvv} onClick={() => { onAdded(last4); close(); }}>Add Card</PrimaryButton>
          <SecondaryButton onClick={() => setType(null)}>Back</SecondaryButton>
        </div>
      )}

      {type === "virtual" && (
        <div className="space-y-4">
          <p className="text-sm font-bold text-[var(--iute-text)]">Your virtual card will be generated instantly.</p>
          <div className="flex gap-2">
            {(["MKD", "EUR"] as const).map((c) => (
              <button key={c} className="tap h-11 flex-1 rounded-2xl bg-[var(--iute-fog)] text-sm font-bold text-[var(--iute-text)] ring-1 ring-[var(--iute-divider)]">{c}</button>
            ))}
          </div>
          {loading ? (
            <div className="shimmer h-32 rounded-2xl" />
          ) : (
            <PrimaryButton onClick={() => {
              setLoading(true);
              setTimeout(() => {
                const n = String(8000 + Math.floor(Math.random() * 999));
                onAdded(n); close();
              }, 1500);
            }}>Generate Card Now</PrimaryButton>
          )}
          {!loading && <SecondaryButton onClick={() => setType(null)}>Back</SecondaryButton>}
        </div>
      )}

      {type === "physical" && (
        <div className="space-y-3">
          <input defaultValue="Anja Angelovska" placeholder="Full name" className="h-12 w-full rounded-2xl bg-[var(--iute-fog)] px-4 text-sm font-bold text-[var(--iute-text)] outline-none focus:ring-2 focus:ring-[var(--iute-red)]" />
          <input defaultValue="ул. Македонија 24, Скопје" placeholder="Address" className="h-12 w-full rounded-2xl bg-[var(--iute-fog)] px-4 text-sm font-bold text-[var(--iute-text)] outline-none focus:ring-2 focus:ring-[var(--iute-red)]" />
          <input defaultValue="1000" placeholder="Postal code" className="h-12 w-full rounded-2xl bg-[var(--iute-fog)] px-4 font-mono text-sm font-bold text-[var(--iute-text)] outline-none focus:ring-2 focus:ring-[var(--iute-red)]" />
          <PrimaryButton onClick={() => { onAdded("9012"); close(); }}>Ship to Me</PrimaryButton>
          <SecondaryButton onClick={() => setType(null)}>Back</SecondaryButton>
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