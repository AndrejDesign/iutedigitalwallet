import { useEffect, useState } from "react";
import { ArrowLeft, Share2, Check, AlertTriangle } from "lucide-react";
import { useStore, fmtMKD, fmtEUR } from "../store";
import { PrimaryButton, SecondaryButton } from "../ui";

export function TxDetail() {
  const { state, go, toast } = useStore();
  const t = state.selectedTxn;
  const [pulse, setPulse] = useState(false);
  useEffect(() => {
    const i = setInterval(() => { setPulse(true); setTimeout(() => setPulse(false), 300); }, 3000);
    return () => clearInterval(i);
  }, []);

  if (!t) {
    return (
      <div className="min-h-screen bg-[var(--iute-bg)] p-6">
        <button onClick={() => go("home")} className="tap text-sm font-bold text-[var(--iute-red)]">← Back</button>
        <p className="mt-12 text-center text-sm font-bold text-[var(--iute-text-soft)]">No transaction selected</p>
      </div>
    );
  }

  const completed = t.amount !== 0;
  return (
    <div className="min-h-screen bg-[var(--iute-bg)] px-4 pb-24 pt-4">
      <header className="flex items-center justify-between py-2">
        <button onClick={() => go("history")} className="tap rounded-2xl bg-[var(--iute-surface)] p-2">
          <ArrowLeft size={20} className="text-[var(--iute-text)]" />
        </button>
        <h1 className="text-base font-extrabold text-[var(--iute-text)]">Transaction Detail</h1>
        <button onClick={() => toast("Receipt link copied")} className="tap rounded-2xl bg-[var(--iute-surface)] p-2">
          <Share2 size={20} className="text-[var(--iute-text)]" />
        </button>
      </header>

      <div className="mt-4 flex flex-col items-center">
        <span className={`flex h-20 w-20 items-center justify-center rounded-full text-white ${completed ? "bg-[var(--iute-red)]" : "bg-[var(--iute-merlot)]"}`}>
          {completed ? <Check size={36} strokeWidth={3} /> : <AlertTriangle size={36} />}
        </span>
        <p className={`mt-4 font-mono text-4xl font-extrabold ${t.amount < 0 ? "text-[var(--iute-text)]" : "text-emerald-600"}`}>
          {t.amount > 0 ? "+" : ""}{Math.abs(t.amount).toLocaleString("en-US", { minimumFractionDigits: 2 })} ден
        </p>
        <p className="text-sm font-medium text-[var(--iute-text-soft)]">{fmtEUR(Math.abs(t.amount) / state.rate)}</p>
      </div>

      <div className="mt-6 divide-y divide-[var(--iute-divider)] rounded-3xl bg-[var(--iute-surface)] p-4">
        <Row label="Recipient" value={t.name} />
        <Row label="Transaction ID" value={t.id} mono />
        <Row label="Method" value={t.method} />
        <Row label="Date & Time" value={`${t.day === "TODAY" ? "Today" : t.day} · ${t.when}`} />
        <Row label="Processing Fee" value="0.00 ден (Free)" />
        <Row label="Status" value={completed ? "[COMPLETED]" : "[PENDING]"} accent />
      </div>

      {t.squad && (
        <div className="mt-4 rounded-3xl bg-[var(--iute-parchment)] p-4 text-sm font-bold text-[var(--iute-merlot)]">
          <span className={`inline-block transition-transform ${pulse ? "haptic-pulse" : ""}`}>🔥</span> Streak with {t.name.split(" ")[0]} extended to {state.streakDays + 1} Days! +50 iutePoints auto-applied.
        </div>
      )}

      <div className="mt-6 space-y-3">
        <PrimaryButton onClick={() => toast("Support ticket opened")}>Get Help with This Transaction</PrimaryButton>
        <SecondaryButton onClick={() => toast("Receipt saved to downloads")}>Download PDF Receipt</SecondaryButton>
      </div>
    </div>
  );
}

function Row({ label, value, mono, accent }: { label: string; value: string; mono?: boolean; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between py-3">
      <span className="text-xs font-bold uppercase tracking-wide text-[var(--iute-text-soft)]">{label}</span>
      <span className={`text-sm font-extrabold ${mono ? "font-mono" : ""} ${accent ? "text-[var(--iute-red)]" : "text-[var(--iute-text)]"}`}>{value}</span>
    </div>
  );
}