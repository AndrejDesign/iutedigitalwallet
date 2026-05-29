import { useState } from "react";
import { RefreshCw, ArrowRight } from "lucide-react";
import { Card } from "../ui";
import { CONTACTS, FX_RATES, type FxCode, type Contact } from "../mockData";
import { CurrencyPicker, FxOneTapSheet, FxRatesSheet, ConvertConfirmSheet } from "./MoneyFlows";

export function FxHub() {
  const [mode, setMode] = useState<"convert" | "send">("convert");
  const [from, setFrom] = useState<FxCode>("MKD");
  const [to, setTo] = useState<FxCode>("EUR");
  const [amt, setAmt] = useState("1000");
  const [spin, setSpin] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [rates, setRates] = useState(false);
  const [oneTap, setOneTap] = useState<Contact | null>(null);

  // 1 from = x to  => via MKD: amount * (rate[to] / rate[from])
  const out = (+amt * ((FX_RATES[to] || 1) / (FX_RATES[from] || 1))).toLocaleString("en-US", { maximumFractionDigits: 4 });
  const rateLine = `1 ${from} = ${((FX_RATES[to] || 1) / (FX_RATES[from] || 1)).toFixed(5)} ${to} · Updated just now`;

  function swap() {
    setSpin(true);
    setTimeout(() => setSpin(false), 400);
    setFrom(to); setTo(from);
  }

  return (
    <Card className="col-span-2">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-wide text-[var(--iute-text-soft)]">FX Hub</p>
        <div className="flex gap-1 rounded-full bg-[var(--iute-fog)] p-0.5">
          <button onClick={() => setMode("convert")} className={`tap rounded-full px-3 py-1 text-[11px] font-bold ${mode === "convert" ? "bg-[var(--iute-red)] text-white" : "text-[var(--iute-text-soft)]"}`}>Convert</button>
          <button onClick={() => setMode("send")} className={`tap rounded-full px-3 py-1 text-[11px] font-bold ${mode === "send" ? "bg-[var(--iute-red)] text-white" : "text-[var(--iute-text-soft)]"}`}>Send in FX</button>
        </div>
      </div>

      {mode === "convert" ? (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <CurrencyPicker value={from} onChange={setFrom} />
            <input
              inputMode="decimal"
              value={amt}
              onChange={(e) => setAmt(e.target.value.replace(/[^\d.]/g, ""))}
              className="h-12 flex-1 rounded-2xl bg-[var(--iute-fog)] px-3 text-right font-mono text-lg font-extrabold text-[var(--iute-text)] outline-none focus:ring-2 focus:ring-[var(--iute-red)]"
            />
          </div>
          <div className="flex justify-center">
            <button onClick={swap} aria-label="Swap currencies" className="tap flex h-10 w-10 items-center justify-center rounded-full bg-[var(--iute-red)] text-white shadow-md">
              <RefreshCw size={20} className={spin ? "animate-spin" : ""} />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <CurrencyPicker value={to} onChange={setTo} />
            <div className="h-12 flex-1 rounded-2xl bg-[var(--iute-cloud)] px-3 flex items-center justify-end font-mono text-lg font-extrabold text-[var(--iute-text)]">
              {out}
            </div>
          </div>
          <p className="font-mono text-[11px] font-bold text-[var(--iute-text-soft)]">{rateLine}</p>
          <button onClick={() => setConfirm(true)} className="tap h-12 w-full rounded-2xl bg-[var(--iute-red)] text-sm font-bold text-white">
            Convert Now
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <div>
            <p className="text-sm font-extrabold text-[var(--iute-text)]">Send to Friends in Any Currency</p>
            <p className="text-xs font-medium text-[var(--iute-text-soft)]">They receive in their local currency, instantly.</p>
          </div>
          <div className="grid grid-cols-3 gap-3 pb-1">
            {CONTACTS.map((c) => (
              <div key={c.id} className="flex flex-col items-center gap-1.5 rounded-2xl bg-[var(--iute-fog)] p-2">
                <span className="flex h-10 w-10 items-center justify-center rounded-full text-white text-xs font-extrabold" style={{ background: c.color }}>
                  {c.name.split(" ").map((p) => p[0]).join("").slice(0, 2)}
                </span>
                <p className="text-[11px] font-bold text-[var(--iute-text)] leading-tight text-center">{c.name}</p>
                <span className="rounded-md bg-white px-1.5 py-0.5 text-[10px] font-bold text-[var(--iute-text)]">{c.flag} {c.currency}</span>
                <button onClick={() => setOneTap(c)} className="tap h-7 w-full rounded-full bg-[var(--iute-red)] text-[10px] font-bold uppercase text-white">
                  1-Tap
                </button>
              </div>
            ))}
          </div>
          <button onClick={() => setRates(true)} className="tap inline-flex items-center gap-1 text-xs font-bold text-[var(--iute-red)]">
            View all FX rates <ArrowRight size={12} />
          </button>
        </div>
      )}

      <ConvertConfirmSheet open={confirm} onClose={() => setConfirm(false)} from={from} to={to} fromAmt={amt} toAmt={out} />
      <FxRatesSheet open={rates} onClose={() => setRates(false)} />
      <FxOneTapSheet open={!!oneTap} onClose={() => setOneTap(null)} contact={oneTap} />
    </Card>
  );
}