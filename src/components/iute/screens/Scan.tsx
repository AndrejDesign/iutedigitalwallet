import { useState } from "react";
import { ArrowLeft, History, ScanLine, Flashlight } from "lucide-react";
import { useStore, fmtMKD } from "../store";
import { BottomSheet, PrimaryButton } from "../ui";

export function Scan() {
  const { state, dispatch, toast, go } = useStore();
  const [success, setSuccess] = useState<null | { amount: number; merchant: string }>(null);
  const [confirm, setConfirm] = useState<null | { amount: number; merchant: string }>(null);
  const [pin, setPin] = useState("");
  const [pinErr, setPinErr] = useState(false);
  const [bnpl, setBnpl] = useState(false);
  const [manualOpen, setManualOpen] = useState(false);
  const [manualAmt, setManualAmt] = useState("");
  const [manualRecip, setManualRecip] = useState("");
  const [torch, setTorch] = useState(false);

  function simulate() {
    const big = Math.random() > 0.5;
    if (!big) {
      const tx = { amount: 280, merchant: "Skopje Coffee Lab" };
      setSuccess(tx);
      toast("Payment approved instantly ⚡");
      setTimeout(() => setSuccess(null), 2500);
    } else {
      setConfirm({ amount: 1800, merchant: "Tinex Supermarket" });
      setPin(""); setPinErr(false); setBnpl(false);
    }
  }

  function tryPin(d: string) {
    const next = (pin + d).slice(0, 4);
    setPin(next);
    setPinErr(false);
    if (next.length === 4) {
      if (next === "1234") {
        if (confirm) {
          dispatch({ type: "SET_BALANCE", balance: state.balanceMKD - confirm.amount });
          toast(`✓ ${fmtMKD(confirm.amount)} paid to ${confirm.merchant}`);
        }
        setConfirm(null);
      } else {
        setPinErr(true);
        setTimeout(() => { setPin(""); setPinErr(false); }, 350);
      }
    }
  }

  const bnplEligible = state.tier === 2 && confirm && confirm.amount > 500;

  return (
    <div className={`relative flex h-full flex-col overflow-hidden pb-20 text-white transition-colors duration-300 ${torch ? "bg-[#3a3320]" : "bg-[#1A1A1A]"}`}>
      {torch && (
        <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_50%_55%,rgba(255,225,150,0.35),transparent_55%)]" />
      )}
      <header className="flex items-center justify-between bg-[var(--iute-red)] px-4 py-4">
        <button onClick={() => go("home")} aria-label="Back to home" className="tap"><ArrowLeft size={22} /></button>
        <h1 className="text-base font-extrabold uppercase tracking-wide">Scan to Pay</h1>
        <button aria-label="Scan history" className="tap"><History size={22} /></button>
      </header>

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6">
        {/* reticle */}
        <div className="relative h-[220px] w-[220px]">
          {([
            "top-0 left-0 border-l-4 border-t-4 rounded-tl-2xl",
            "top-0 right-0 border-r-4 border-t-4 rounded-tr-2xl",
            "bottom-0 left-0 border-l-4 border-b-4 rounded-bl-2xl",
            "bottom-0 right-0 border-r-4 border-b-4 rounded-br-2xl",
          ]).map((cls, i) => (
            <span key={i} className={`reticle-pulse absolute h-10 w-10 border-[var(--iute-red)] ${cls}`} />
          ))}
          <div className="absolute inset-6 flex items-center justify-center opacity-30">
            <ScanLine size={80} />
          </div>
        </div>
        <p className="mt-6 text-sm font-medium opacity-80">Point camera at merchant QR code</p>

        <button
          onClick={() => { setTorch((t) => !t); toast(torch ? "Flashlight off" : "Flashlight on 🔦"); }}
          aria-label="Toggle flashlight"
          aria-pressed={torch}
          className={`tap mt-6 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-extrabold uppercase tracking-wide ring-1 transition-colors ${torch ? "bg-yellow-300 text-black ring-yellow-200 shadow-[0_0_24px_rgba(253,224,71,0.6)]" : "bg-white/10 text-white ring-white/20"}`}
        >
          <Flashlight size={16} strokeWidth={2.5} />
          {torch ? "Flashlight On" : "Flashlight"}
        </button>

        <div className="mt-8 w-full max-w-[300px]">
          <PrimaryButton onClick={simulate}>Tap to Simulate Scan</PrimaryButton>
          <button onClick={() => setManualOpen(true)} className="tap mt-3 w-full text-sm font-bold underline opacity-80">
            Or enter amount manually
          </button>
        </div>
      </div>

      {success && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-emerald-600 text-white">
          <div className="spring-in flex h-24 w-24 items-center justify-center rounded-full bg-white text-emerald-600 text-5xl font-extrabold">✓</div>
          <p className="mt-6 font-mono text-2xl font-extrabold">{fmtMKD(success.amount)}</p>
          <p className="text-sm font-bold opacity-90">Paid to {success.merchant}</p>
        </div>
      )}

      <BottomSheet open={!!confirm} onClose={() => setConfirm(null)} title="Confirm Payment">
        {confirm && (
          <div className="space-y-4">
            <div className="rounded-2xl bg-[var(--iute-fog)] p-4 text-center">
              <p className="text-xs font-bold uppercase text-[var(--iute-text-soft)]">{confirm.merchant}</p>
              <p className="mt-1 font-mono text-3xl font-extrabold text-[var(--iute-text)]">{fmtMKD(confirm.amount)}</p>
            </div>
            {bnplEligible && (
              <button onClick={() => setBnpl(!bnpl)} className={`tap w-full rounded-2xl p-3 text-left text-sm font-bold ring-2 ${bnpl ? "ring-[var(--iute-red)] bg-[var(--iute-red)]/10" : "ring-[var(--iute-divider)] bg-[var(--iute-fog)]"}`}>
                <span className="block text-[var(--iute-text)]">Pay in 30 days · 0% interest</span>
                <span className="text-[11px] font-medium text-[var(--iute-text-soft)]">BNPL — only if you pay on time</span>
              </button>
            )}
            <div>
              <p className="mb-2 text-xs font-bold uppercase text-[var(--iute-text-soft)]">Enter PIN (1234)</p>
              <div className={`flex justify-center gap-3 ${pinErr ? "shake-x" : ""}`}>
                {[0,1,2,3].map((i) => (
                  <span key={i} className={`h-4 w-4 rounded-full ${i < pin.length ? "bg-[var(--iute-red)]" : "bg-black/20"}`} />
                ))}
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2">
                {[1,2,3,4,5,6,7,8,9].map((n) => (
                  <button key={n} onClick={() => tryPin(String(n))} className="tap h-12 rounded-2xl bg-[var(--iute-fog)] font-mono text-lg font-extrabold text-[var(--iute-text)]">{n}</button>
                ))}
                <span />
                <button onClick={() => tryPin("0")} className="tap h-12 rounded-2xl bg-[var(--iute-fog)] font-mono text-lg font-extrabold text-[var(--iute-text)]">0</button>
                <button onClick={() => setPin(pin.slice(0, -1))} aria-label="Delete last digit" className="tap h-12 rounded-2xl bg-[var(--iute-fog)] text-sm font-bold text-[var(--iute-text-soft)]">⌫</button>
              </div>
            </div>
            <button onClick={() => setConfirm(null)} className="tap w-full text-center text-sm font-bold text-[var(--iute-text-soft)]">Cancel</button>
          </div>
        )}
      </BottomSheet>

      <BottomSheet open={manualOpen} onClose={() => setManualOpen(false)} title="Manual Payment">
        <div className="space-y-3">
          <input placeholder="Recipient (phone or @handle)" value={manualRecip} onChange={(e) => setManualRecip(e.target.value)} className="h-12 w-full rounded-2xl bg-[var(--iute-fog)] px-4 text-sm font-bold text-[var(--iute-text)] outline-none" />
          <input placeholder="Amount (MKD)" value={manualAmt} onChange={(e) => setManualAmt(e.target.value.replace(/[^\d.]/g, ""))} className="h-12 w-full rounded-2xl bg-[var(--iute-fog)] px-4 font-mono text-lg font-extrabold text-[var(--iute-text)] outline-none" />
          <PrimaryButton onClick={() => { setManualOpen(false); toast("✓ Request sent"); }}>Send Request</PrimaryButton>
        </div>
      </BottomSheet>
    </div>
  );
}