import { useState } from "react";
import { Plus, RefreshCw, Package, Smartphone, AlertTriangle } from "lucide-react";
import { useStore, fmtMKD } from "../store";
import { Card, Toggle, BottomSheet, PrimaryButton, SecondaryButton } from "../ui";

export function Cards() {
  const { state, dispatch, toast } = useStore();
  const [flip, setFlip] = useState(false);
  const [panicSheet, setPanicSheet] = useState(false);
  const [orderSheet, setOrderSheet] = useState(false);
  const [last4, setLast4] = useState("8942");

  function toggleFreeze(v: boolean) {
    setFlip(true);
    setTimeout(() => setFlip(false), 600);
    dispatch({ type: "TOGGLE_FREEZE", value: v });
    toast(v ? "Card frozen — all transactions blocked." : "Card unfrozen — back to normal.");
  }

  return (
    <div className="min-h-screen bg-[var(--iute-bg)] px-4 pb-32 pt-6">
      <header className="mb-4 flex items-center justify-between px-1">
        <h1 className="text-3xl font-extrabold text-[var(--iute-text)]">My Cards</h1>
        <button onClick={() => toast("Add card flow…")} className="tap rounded-2xl bg-[var(--iute-surface)] p-2.5">
          <Plus size={20} className="text-[var(--iute-text)]" />
        </button>
      </header>

      <div className="perspective-[1000px]">
        <div
          className="relative h-[220px] w-full rounded-3xl text-white shadow-2xl transition-transform duration-500"
          style={{
            transform: flip ? "rotateY(180deg)" : "rotateY(0deg)",
            transformStyle: "preserve-3d",
            background: state.cardFrozen ? "var(--iute-red)" : "var(--iute-merlot)",
          }}
        >
          <div className="absolute inset-0 flex flex-col justify-between p-5" style={{ backfaceVisibility: "hidden" }}>
            <div className="flex items-start justify-between">
              <span className="font-extrabold tracking-tight text-2xl">iute</span>
              <span className="rounded-lg bg-white/15 px-2 py-1 text-[10px] font-bold uppercase tracking-wide ring-1 ring-white/30">Virtual</span>
            </div>
            <p className="font-mono text-[22px] tracking-[0.2em]">•••• •••• •••• {last4}</p>
            <div className="flex items-end justify-between text-[11px] font-mono uppercase">
              <span>Anja Angelovska</span>
              <span>09/28</span>
              <span className="rounded-md bg-white/15 px-1.5 py-0.5 ring-1 ring-white/30">{state.cardFrozen ? "[FROZEN]" : "[ACTIVE]"}</span>
            </div>
          </div>
        </div>
      </div>

      <Card className="mt-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-[var(--iute-text)]">Card Status</p>
            <p className="text-xs font-medium text-[var(--iute-text-soft)]">{state.cardFrozen ? "Frozen — no payments" : "Active — ready to use"}</p>
          </div>
          <Toggle on={state.cardFrozen} onChange={toggleFreeze} />
        </div>
      </Card>

      <Card className="mt-3">
        <div className="flex items-center justify-between">
          <div className="flex items-start gap-3">
            <Smartphone size={20} className="mt-0.5 text-[var(--iute-red)]" />
            <div>
              <p className="text-sm font-bold text-[var(--iute-text)]">Shake-to-Freeze Panic Mode</p>
              <p className="text-xs font-medium text-[var(--iute-text-soft)]">Gyroscope trigger at &gt;12 m/s²</p>
            </div>
          </div>
          <Toggle on={state.panicMode} onChange={() => dispatch({ type: "TOGGLE_PANIC" })} />
        </div>
        {state.panicMode && (
          <button onClick={() => { toggleFreeze(true); setPanicSheet(true); }} className="tap mt-3 inline-flex items-center gap-1.5 rounded-lg bg-[var(--iute-fog)] px-3 py-1.5 text-[11px] font-bold text-[var(--iute-text-soft)]">
            <AlertTriangle size={12} /> Simulate Shake
          </button>
        )}
      </Card>

      <Card className="mt-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold text-[var(--iute-text)]">Daily Limit</p>
          <span className="font-mono text-sm font-extrabold text-[var(--iute-text)]">{fmtMKD(state.dailyLimit)}</span>
        </div>
        <input
          type="range"
          min={500}
          max={50000}
          step={500}
          value={state.dailyLimit}
          onChange={(e) => dispatch({ type: "SET_LIMIT", limit: +e.target.value })}
          className="mt-3 w-full accent-[var(--iute-red)]"
        />
        <div className="mt-1 flex justify-between font-mono text-[10px] font-bold text-[var(--iute-text-soft)]">
          <span>500</span><span>50,000</span>
        </div>
      </Card>

      <div className="mt-3 grid grid-cols-2 gap-3">
        <button onClick={() => { const n = String(8900 + Math.floor(Math.random() * 100)); setLast4(n); toast(`New card number generated: ••••${n}`); }} className="tap flex items-center gap-2 rounded-2xl bg-[var(--iute-surface)] p-4 text-left">
          <RefreshCw size={18} className="text-[var(--iute-red)]" />
          <span className="text-xs font-bold leading-tight text-[var(--iute-text)]">New Virtual<br/>Card Number</span>
        </button>
        <button onClick={() => setOrderSheet(true)} className="tap flex items-center gap-2 rounded-2xl bg-[var(--iute-surface)] p-4 text-left">
          <Package size={18} className="text-[var(--iute-red)]" />
          <span className="text-xs font-bold leading-tight text-[var(--iute-text)]">Order Physical<br/>Card</span>
        </button>
      </div>

      <BottomSheet open={panicSheet} onClose={() => setPanicSheet(false)} title="⚠️ Card frozen via Panic Mode">
        <p className="mb-4 text-sm font-medium text-[var(--iute-text-soft)]">Report this card as lost or keep it frozen and continue testing.</p>
        <div className="space-y-2">
          <PrimaryButton onClick={() => { setPanicSheet(false); toast("✓ Card reported as lost — replacement on the way"); }}>Report Lost</PrimaryButton>
          <SecondaryButton onClick={() => { setPanicSheet(false); toggleFreeze(false); }}>No, just testing</SecondaryButton>
        </div>
      </BottomSheet>

      <BottomSheet open={orderSheet} onClose={() => setOrderSheet(false)} title="Order Physical Card">
        <div className="space-y-3">
          <input defaultValue="Anja Angelovska" placeholder="Full name" className="h-12 w-full rounded-2xl bg-[var(--iute-fog)] px-4 text-sm font-bold text-[var(--iute-text)] outline-none" />
          <input defaultValue="ул. Македонија 24, Скопје" placeholder="Address" className="h-12 w-full rounded-2xl bg-[var(--iute-fog)] px-4 text-sm font-bold text-[var(--iute-text)] outline-none" />
          <input defaultValue="1000" placeholder="Postal code" className="h-12 w-full rounded-2xl bg-[var(--iute-fog)] px-4 font-mono text-sm font-bold text-[var(--iute-text)] outline-none" />
          <PrimaryButton onClick={() => { setOrderSheet(false); toast("✓ Physical card ordered"); }}>Ship to Me</PrimaryButton>
        </div>
      </BottomSheet>
    </div>
  );
}