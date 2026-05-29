import { useState } from "react";
import {
  ArrowUpRight, ArrowDownLeft, Building2, Wallet,
  Lock, ShoppingBag, Loader2, Plus, Send, ArrowLeftRight, Zap, Wifi, Droplet, Flame,
} from "lucide-react";
import { useStore, fmtMKD, fmtEUR } from "../store";
import { Card, BottomSheet, PrimaryButton } from "../ui";
import { TRANSACTIONS } from "../mockData";
import { AddMoneySheet, SendMoneySheet, RequestMoneySheet } from "../flows/MoneyFlows";
import { RedeemSheet } from "../flows/RedeemSheet";

export function Home() {
  const { state, dispatch, toast, go } = useStore();
  const [kycOpen, setKycOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [sendOpen, setSendOpen] = useState(false);
  const [requestOpen, setRequestOpen] = useState(false);
  const [payBillOpen, setPayBillOpen] = useState(false);
  const [redeemOpen, setRedeemOpen] = useState(false);
  const [swapAmt, setSwapAmt] = useState("1230");
  const [swapDir, setSwapDir] = useState<"MKD_TO_EUR" | "EUR_TO_MKD">("MKD_TO_EUR");
  const [refreshing, setRefreshing] = useState(false);
  const [pullY, setPullY] = useState(0);
  const [startY, setStartY] = useState<number | null>(null);

  const mkdToEur = (state.balanceMKD / state.rate).toFixed(2);

  function toggleSwap() {
    const n = +swapAmt || 0;
    const converted = swapDir === "MKD_TO_EUR" ? (n / state.rate).toFixed(2) : (n * state.rate).toFixed(2);
    setSwapAmt(converted);
    setSwapDir((d) => (d === "MKD_TO_EUR" ? "EUR_TO_MKD" : "MKD_TO_EUR"));
  }

  function onRefresh() {
    if (refreshing) return;
    setRefreshing(true);
    setTimeout(() => {
      const delta = Math.round((Math.random() - 0.5) * 100);
      dispatch({ type: "SET_BALANCE", balance: Math.max(0, state.balanceMKD + delta) });
      dispatch({ type: "SET_RATE", rate: +(60 + Math.random() * 3).toFixed(2) });
      setRefreshing(false);
      setPullY(0);
      toast("Balance updated ⚡");
    }, 1200);
  }

  return (
    <div
      className="min-h-screen bg-[var(--iute-bg)] pb-24 pt-2"
      onTouchStart={(e) => setStartY(e.touches[0].clientY)}
      onTouchMove={(e) => {
        if (startY != null && window.scrollY === 0) {
          const dy = e.touches[0].clientY - startY;
          if (dy > 0) setPullY(Math.min(dy * 0.5, 80));
        }
      }}
      onTouchEnd={() => {
        if (pullY > 50) onRefresh();
        else setPullY(0);
        setStartY(null);
      }}
    >
      {(pullY > 0 || refreshing) && (
        <div className="flex justify-center pt-4" style={{ height: pullY || 48 }}>
          <Loader2 className={`text-[var(--iute-red)] ${refreshing ? "animate-spin" : ""}`} size={24} />
        </div>
      )}

      <header className="px-5 pt-3">
        <p className="text-xs font-bold uppercase tracking-wide text-[var(--iute-text-soft)]">Good morning</p>
        <h1 className="text-xl font-extrabold text-[var(--iute-text)]">
          {state.userName ? `My Wallet — ${state.userName.trim().split(/\s+/)[0]} 👋` : "My Wallet 👋"}
        </h1>
      </header>

      {/* Hero balance */}
      <div className="px-4 pt-5">
        <div className="relative overflow-hidden rounded-3xl bg-[var(--iute-red)] p-6 text-white shadow-[0_20px_40px_-15px_rgba(216,37,44,0.55)]" style={{ minHeight: 200 }}>
          <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-black/10" />
          <div className="pointer-events-none absolute right-10 bottom-0 h-24 w-24 rounded-full bg-white/5" />
          <div className="relative flex h-full flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-mono text-[11px] font-bold uppercase tracking-widest opacity-80">Total Balance</p>
                <p className="mt-3 font-mono text-[40px] font-extrabold leading-none">{fmtMKD(state.balanceMKD)}</p>
                <p className="mt-2 text-base font-medium opacity-80">{fmtEUR(+mkdToEur)}</p>
              </div>
              <button onClick={() => setKycOpen(true)} className="tap rounded-xl bg-white/15 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide ring-1 ring-white/30">
                Level {state.tier} ●
              </button>
            </div>
            <div className="mt-6 flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-white">
                <Wallet size={14} strokeWidth={2.4} />
              </span>
              <span className="text-[11px] font-semibold opacity-70">Available for instant transfer</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="mx-4 mt-4 grid grid-cols-4 gap-2 rounded-3xl bg-[var(--iute-surface)] p-4">
        {[
          { Icon: ArrowUpRight, label: "Send",    onClick: () => setSendOpen(true) },
          { Icon: ArrowDownLeft, label: "Request", onClick: () => setRequestOpen(true) },
          { Icon: Building2,    label: "Pay Bill", onClick: () => setPayBillOpen(true) },
          { Icon: Wallet,       label: "Top Up",   onClick: () => setAddOpen(true) },
        ].map(({ Icon, label, onClick }) => (
          <button key={label} className="tap flex min-h-[48px] flex-col items-center gap-2" onClick={onClick} aria-label={label}>
            <span className="flex h-[60px] w-[60px] items-center justify-center rounded-2xl bg-[var(--iute-cloud)] text-[var(--iute-red)]">
              <Icon size={24} strokeWidth={2.4} />
            </span>
            <span className="text-[11px] font-bold text-[var(--iute-text)]">{label}</span>
          </button>
        ))}
      </div>

      {/* Bento grid */}
      <h2 className="sr-only">Wallet Overview</h2>
      <div className="grid grid-cols-2 gap-3 px-4 pt-4">
        <Card className="col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wide text-[var(--iute-text-soft)]">Instant Swap</p>
            <span className="font-mono text-[11px] font-bold text-[var(--iute-text-soft)]">1 EUR = {state.rate} ден</span>
          </div>
          {(() => {
            const fromCcy = swapDir === "MKD_TO_EUR" ? "MKD" : "EUR";
            const toCcy = swapDir === "MKD_TO_EUR" ? "EUR" : "MKD";
            const n = +swapAmt || 0;
            const converted = swapDir === "MKD_TO_EUR" ? (n / state.rate) : (n * state.rate);
            return (
              <button
                onClick={toggleSwap}
                aria-label={`Swap ${fromCcy} to ${toCcy}`}
                className="tap flex w-full items-center gap-2 text-left"
              >
                <div className="flex-1 rounded-2xl bg-[var(--iute-fog)] p-3">
                  <p className="text-[10px] font-bold uppercase text-[var(--iute-text-soft)]">{fromCcy}</p>
                  <input
                    value={swapAmt}
                    onChange={(e) => setSwapAmt(e.target.value.replace(/[^\d.]/g, ""))}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full bg-transparent font-mono text-xl font-extrabold text-[var(--iute-text)] outline-none"
                  />
                </div>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--iute-red)] text-white shadow-md transition-transform active:rotate-180">
                  <ArrowLeftRight size={18} />
                </span>
                <div className="flex-1 rounded-2xl bg-[var(--iute-cloud)] p-3">
                  <p className="text-[10px] font-bold uppercase text-[var(--iute-text-soft)]">{toCcy}</p>
                  <p className="font-mono text-xl font-extrabold text-[var(--iute-text)]">
                    {converted.toFixed(2)}
                  </p>
                </div>
              </button>
            );
          })()}
        </Card>

        <Card>
          <p className="text-xs font-bold uppercase tracking-wide text-[var(--iute-text-soft)]">iutePlus</p>
          <p className="mt-2 font-mono text-3xl font-extrabold text-[var(--iute-red)]">{state.iutePoints.toLocaleString()}</p>
          <p className="text-xs font-medium text-[var(--iute-text-soft)]">loyalty points</p>
          <button onClick={() => setRedeemOpen(true)} className="tap mt-3 text-sm font-bold text-[var(--iute-red)]">Redeem →</button>
        </Card>

        <Card className="relative overflow-hidden">
          <p className="text-xs font-bold uppercase tracking-wide text-[var(--iute-text-soft)]">Cardless ATM</p>
          <p className="mt-2 text-lg font-extrabold text-[var(--iute-text)]">Withdraw without a card</p>
          {state.tier === 1 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[var(--iute-surface)]/85 backdrop-blur-sm p-3 text-center">
              <Lock size={20} className="text-[var(--iute-red)]" />
              <p className="mt-2 text-xs font-bold text-[var(--iute-text)]">Upgrade to Level 2</p>
              <button onClick={() => setKycOpen(true)} className="tap mt-2 rounded-lg bg-[var(--iute-red)] px-3 py-1 text-[11px] font-bold text-white">Unlock</button>
            </div>
          )}
        </Card>

        <Card className="col-span-2 bg-[var(--iute-parchment)] dark:bg-[var(--iute-merlot)]">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-base font-extrabold text-[var(--iute-text)]">🔥 {state.streakDays}-Day Streak with Marko!</p>
              <p className="mt-1 text-xs font-semibold text-[var(--iute-text-soft)]">Keep splitting bills to climb tiers.</p>
            </div>
            <span className="rounded-lg bg-[var(--iute-red)] px-2 py-1 text-[10px] font-bold uppercase text-white">5% Cashback</span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-black/10">
            <div className="h-full rounded-full bg-[var(--iute-red)] transition-all duration-500" style={{ width: `${(state.streakDays / 14) * 100}%` }} />
          </div>
          <p className="mt-1 font-mono text-[11px] font-bold text-[var(--iute-text-soft)]">{state.streakDays}/14 days · next reward 10%</p>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="mx-4 mt-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-base font-extrabold text-[var(--iute-text)]">Recent Activity</h3>
          <button onClick={() => go("history")} className="tap text-sm font-bold text-[var(--iute-red)]">See All →</button>
        </div>
        <div className="space-y-1">
          {TRANSACTIONS.slice(0, 3).map((t) => (
            <button
              key={t.id}
              onClick={() => { dispatch({ type: "SET_TXN", txn: t }); go("txdetail"); }}
              className="tap flex w-full items-center gap-3 rounded-2xl py-2"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--iute-fog)]">
                {t.amount < 0
                  ? <ArrowUpRight size={16} className="text-[var(--iute-red)]" />
                  : t.amount > 0
                    ? <ArrowDownLeft size={16} className="text-emerald-600" />
                    : <ShoppingBag size={16} className="text-[var(--iute-text-soft)]" />}
              </span>
              <div className="flex-1 text-left">
                <p className="text-sm font-bold text-[var(--iute-text)]">{t.name}</p>
                <p className="text-[11px] font-medium text-[var(--iute-text-soft)]">{t.category}</p>
              </div>
              <div className="text-right">
                <p className={`font-mono text-sm font-bold ${t.amount < 0 ? "text-[var(--iute-red)]" : "text-emerald-600"}`}>
                  {t.amount > 0 ? "+" : ""}{t.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </p>
                <p className="text-[10px] text-[var(--iute-text-soft)]">{t.when}</p>
              </div>
            </button>
          ))}
        </div>
      </Card>

      {/* KYC sheet */}
      <BottomSheet open={kycOpen} onClose={() => setKycOpen(false)} title="Unlock Full Access">
        <div className="space-y-3">
          <KycStep done step={1} title="Level 1 — Basic Info" sub="Max 15,000 ден · Active" />
          <KycStep step={2} title="Level 2 — ID Verification" sub="Max 120,000 ден · Cardless ATM · BNPL" current={state.tier === 1} />
          {state.tier === 1 ? (
            <PrimaryButton onClick={() => {
              dispatch({ type: "SET_TIER", tier: 2 });
              setKycOpen(false);
              toast("✓ Verification submitted — Level 2 unlocked");
            }}>Scan Identity Document Now</PrimaryButton>
          ) : (
            <div className="rounded-2xl bg-[var(--iute-parchment)] p-3 text-center text-sm font-bold text-[var(--iute-merlot)]">
              You're at Level 2 — full access unlocked.
            </div>
          )}
        </div>
      </BottomSheet>

      <AddMoneySheet open={addOpen} onClose={() => setAddOpen(false)} />
      <SendMoneySheet open={sendOpen} onClose={() => setSendOpen(false)} />
      <RequestMoneySheet open={requestOpen} onClose={() => setRequestOpen(false)} />
      <RedeemSheet open={redeemOpen} onClose={() => setRedeemOpen(false)} />
      <PayBillSheet open={payBillOpen} onClose={() => setPayBillOpen(false)} />
    </div>
  );
}

function PayBillSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { state, dispatch, toast } = useStore();
  const [biller, setBiller] = useState<null | { name: string; Icon: typeof Zap; color: string }>(null);
  const [ref, setRef] = useState("");
  const [amt, setAmt] = useState("");
  const [paid, setPaid] = useState(false);

  const BILLERS = [
    { name: "EVN Electricity",  Icon: Zap,     color: "#D8252C" }, // iute red
    { name: "Telekom Internet", Icon: Wifi,    color: "#5A0917" }, // iute merlot
    { name: "Vodovod Water",    Icon: Droplet, color: "#2D2D2D" }, // iute black
    { name: "Makpetrol Gas",    Icon: Flame,   color: "#C9A84C" }, // parchment gold
  ];

  function reset() { setBiller(null); setRef(""); setAmt(""); setPaid(false); }
  function close() { onClose(); setTimeout(reset, 250); }

  function pay() {
    const n = +amt || 0;
    if (!n || n > state.balanceMKD) { toast("Invalid amount"); return; }
    dispatch({ type: "SET_BALANCE", balance: state.balanceMKD - n });
    setPaid(true);
    toast(`✓ Paid ${fmtMKD(n)} to ${biller?.name}`);
    setTimeout(close, 1200);
  }

  return (
    <BottomSheet open={open} onClose={close} title={biller ? biller.name : "Pay a Bill"}>
      {paid ? (
        <div className="py-8 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500 text-white text-4xl">✓</div>
          <p className="mt-4 text-lg font-extrabold text-[var(--iute-text)]">Payment Sent</p>
          <p className="text-sm font-medium text-[var(--iute-text-soft)]">{biller?.name}</p>
        </div>
      ) : !biller ? (
        <div className="grid grid-cols-2 gap-3">
          {BILLERS.map((b) => (
            <button key={b.name} onClick={() => setBiller(b)} className="tap flex flex-col items-start gap-3 rounded-2xl bg-[var(--iute-fog)] p-4 text-left hover:ring-2 hover:ring-[var(--iute-red)]">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl text-white" style={{ background: b.color }}>
                <b.Icon size={20} />
              </span>
              <span className="text-sm font-extrabold text-[var(--iute-text)]">{b.name}</span>
            </button>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          <label className="block">
            <span className="mb-1 block text-xs font-bold uppercase text-[var(--iute-text-soft)]">Customer Reference</span>
            <input value={ref} onChange={(e) => setRef(e.target.value)} placeholder="e.g. 100-2034-882" className="h-12 w-full rounded-2xl bg-[var(--iute-fog)] px-4 font-mono text-sm font-bold text-[var(--iute-text)] outline-none focus:ring-2 focus:ring-[var(--iute-red)]" />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-bold uppercase text-[var(--iute-text-soft)]">Amount (MKD)</span>
            <input value={amt} onChange={(e) => setAmt(e.target.value.replace(/[^\d.]/g, ""))} inputMode="decimal" placeholder="0.00" className="h-14 w-full rounded-2xl bg-[var(--iute-fog)] px-4 font-mono text-2xl font-extrabold text-[var(--iute-text)] outline-none focus:ring-2 focus:ring-[var(--iute-red)]" />
          </label>
          <p className="text-[11px] font-bold text-[var(--iute-text-soft)]">Balance: {fmtMKD(state.balanceMKD)}</p>
          <PrimaryButton disabled={!ref || !amt} onClick={pay}>Pay Now</PrimaryButton>
          <button onClick={() => setBiller(null)} className="tap w-full text-center text-sm font-bold text-[var(--iute-text-soft)]">Back</button>
        </div>
      )}
    </BottomSheet>
  );
}

function KycStep({ step, title, sub, done, current }: { step: number; title: string; sub: string; done?: boolean; current?: boolean }) {
  return (
    <div className={`flex items-start gap-3 rounded-2xl border p-3 ${done ? "border-emerald-500/40 bg-emerald-500/5" : current ? "border-[var(--iute-red)]/40 bg-[var(--iute-red)]/5" : "border-[var(--iute-divider)]"}`}>
      <span className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${done ? "bg-emerald-500 text-white" : "bg-[var(--iute-red)] text-white"}`}>
        {done ? "✓" : step}
      </span>
      <div>
        <p className="text-sm font-extrabold text-[var(--iute-text)]">{title}</p>
        <p className="text-xs font-medium text-[var(--iute-text-soft)]">{sub}</p>
      </div>
    </div>
  );
}