import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight, ArrowDownLeft, Building2, Wallet,
  Lock, ShoppingBag, Loader2, Plus, Send, ArrowLeftRight, Zap, Wifi, Droplet,
  ScanLine, Camera, ChevronRight, Fingerprint, Check, Trash2,
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

      {/* My Cards carousel */}
      <MyCardsCarousel />

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
  type Biller = { key: string; name: string; Icon: typeof Zap; tint: string; ring: string; saved: string; suggested: number };
  const BILLERS: Biller[] = [
    { key: "evn",     name: "EVN Electricity",  Icon: Zap,     tint: "linear-gradient(135deg,#D8252C,#7A1218)", ring: "rgba(216,37,44,0.22)",  saved: "100-2034-882", suggested: 1840 },
    { key: "telekom", name: "Telekom Internet", Icon: Wifi,    tint: "linear-gradient(135deg,#5A0917,#1A0307)", ring: "rgba(90,9,23,0.25)",    saved: "TEL-77-401-225", suggested: 990  },
    { key: "vodovod", name: "Vodovod Water",    Icon: Droplet, tint: "linear-gradient(135deg,#2D2D2D,#0E0E0E)", ring: "rgba(45,45,45,0.28)",   saved: "VW-552-0098",   suggested: 620  },
  ];

  const [step, setStep] = useState<"select" | "addBiller" | "input" | "review" | "paid">("select");
  const [biller, setBiller] = useState<Biller | null>(null);
  const [ref, setRef] = useState("");
  const [amt, setAmt] = useState("");
  const [scanning, setScanning] = useState(false);
  const [slide, setSlide] = useState(0); // 0..1 for slide-to-pay
  const [dragging, setDragging] = useState(false);
  type CatKey = "electricity" | "internet" | "water" | "other";
  type SavedBiller = { key: string; name: string; saved: string; cat: CatKey };
  const STORAGE_KEY = "iute:customBillers:v1";
  const [savedBillers, setSavedBillers] = useState<SavedBiller[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as SavedBiller[]) : [];
    } catch { return []; }
  });
  useEffect(() => {
    if (typeof window === "undefined") return;
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(savedBillers)); } catch { /* noop */ }
  }, [savedBillers]);
  const [newCat, setNewCat] = useState<CatKey>("electricity");
  const [newName, setNewName] = useState("");
  const [newRef, setNewRef] = useState("");

  const CAT_PRESET: Record<CatKey, { Icon: typeof Zap; tint: string; ring: string; label: string }> = {
    electricity: { Icon: Zap,     tint: "linear-gradient(135deg,#D8252C,#7A1218)", ring: "rgba(216,37,44,0.22)", label: "Electricity" },
    internet:    { Icon: Wifi,    tint: "linear-gradient(135deg,#5A0917,#1A0307)", ring: "rgba(90,9,23,0.25)",   label: "Internet" },
    water:       { Icon: Droplet, tint: "linear-gradient(135deg,#2D2D2D,#0E0E0E)", ring: "rgba(45,45,45,0.28)",  label: "Water" },
    other:       { Icon: Building2, tint: "linear-gradient(135deg,#3a3a3a,#111)", ring: "rgba(0,0,0,0.25)",      label: "Other" },
  };

  const extraBillers: Biller[] = savedBillers.map((s) => {
    const p = CAT_PRESET[s.cat];
    return { key: s.key, name: s.name, Icon: p.Icon, tint: p.tint, ring: p.ring, saved: s.saved, suggested: 0 };
  });

  function deleteBiller(key: string) {
    setSavedBillers((arr) => arr.filter((b) => b.key !== key));
    toast("Biller removed");
  }

  function saveNewBiller() {
    if (!newName.trim() || !newRef.trim()) { toast("Enter name & reference"); return; }
    const preset = CAT_PRESET[newCat];
    const saved: SavedBiller = { key: `custom-${Date.now()}`, name: newName.trim(), saved: newRef.trim(), cat: newCat };
    setSavedBillers((arr) => [...arr, saved]);
    const b: Biller = { key: saved.key, name: saved.name, Icon: preset.Icon, tint: preset.tint, ring: preset.ring, saved: saved.saved, suggested: 0 };
    setNewName(""); setNewRef(""); setNewCat("electricity");
    toast(`✓ ${b.name} saved`);
    pickBiller(b);
  }

  function reset() {
    setStep("select"); setBiller(null); setRef(""); setAmt("");
    setNewName(""); setNewRef(""); setNewCat("electricity");
    setScanning(false); setSlide(0); setDragging(false);
  }
  function close() { onClose(); setTimeout(reset, 250); }

  function pickBiller(b: Biller) {
    setBiller(b);
    setRef(b.saved);
    setAmt(String(b.suggested));
    setStep("input");
  }

  function scanWholeBill() {
    setScanning(true);
    setTimeout(() => {
      const b = BILLERS[0];
      setBiller(b); setRef(b.saved); setAmt(String(b.suggested));
      setScanning(false); setStep("review");
      toast("✓ Bill parsed");
    }, 1100);
  }

  function scanReference() {
    setScanning(true);
    setTimeout(() => {
      if (biller) setRef(biller.saved);
      setScanning(false);
      toast("✓ Reference scanned");
    }, 900);
  }

  function commitPayment() {
    const n = +amt || 0;
    if (!n || n > state.balanceMKD) { toast("Invalid amount"); return; }
    dispatch({ type: "SET_BALANCE", balance: state.balanceMKD - n });
    setStep("paid");
    toast(`✓ Paid ${fmtMKD(n)} to ${biller?.name}`);
    setTimeout(close, 1400);
  }

  // Slide-to-pay handlers
  function onSlideStart() { setDragging(true); }
  function onSlideMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!dragging) return;
    const track = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - track.left - 28; // thumb radius
    const max = track.width - 56;
    const pct = Math.max(0, Math.min(1, x / max));
    setSlide(pct);
    if (pct >= 0.98) { setDragging(false); setSlide(1); commitPayment(); }
  }
  function onSlideEnd() {
    setDragging(false);
    if (slide < 0.98) setSlide(0);
  }

  const title =
    step === "select" ? "Pay a Bill" :
    step === "addBiller" ? "Add a Biller" :
    step === "input"  ? biller?.name ?? "" :
    step === "review" ? "Review Payment" : "";

  return (
    <BottomSheet open={open} onClose={close} title={title}>
      {step === "paid" ? (
        <div className="py-10 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500 text-white">
            <Check size={36} strokeWidth={3} />
          </div>
          <p className="mt-4 text-lg font-extrabold text-[var(--iute-text)]">Payment Sent</p>
          <p className="text-sm font-medium text-[var(--iute-text-soft)]">{biller?.name} · {fmtMKD(+amt || 0)}</p>
        </div>
      ) : step === "select" ? (
        <div className="space-y-4">
          {/* Scan CTA */}
          <button
            onClick={scanWholeBill}
            className="tap relative flex w-full items-center gap-4 overflow-hidden rounded-3xl p-4 text-left text-white"
            style={{ background: "linear-gradient(135deg,#D8252C,#5A0917)", boxShadow: "0 10px 30px -12px rgba(216,37,44,0.55)" }}
          >
            <span aria-hidden className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/10" />
            <span aria-hidden className="absolute -bottom-10 right-10 h-20 w-20 rounded-full bg-white/5" />
            <span className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
              {scanning ? <Loader2 size={22} className="animate-spin" /> : <ScanLine size={22} />}
            </span>
            <span className="relative flex-1">
              <span className="block font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-white/70">Fastest path</span>
              <span className="mt-0.5 block text-base font-extrabold">Scan Bill QR or Barcode</span>
              <span className="mt-0.5 block text-[11px] font-medium text-white/80">Auto-fills provider, reference and amount</span>
            </span>
            <ChevronRight size={20} className="relative opacity-80" />
          </button>

          <div className="flex items-center gap-3">
            <span className="h-px flex-1 bg-[var(--iute-divider)]" />
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--iute-text-soft)]">Or choose a biller</span>
            <span className="h-px flex-1 bg-[var(--iute-divider)]" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[...BILLERS, ...extraBillers].map((b) => {
              const isCustom = b.key.startsWith("custom-");
              return (
                <div key={b.key} className="relative">
                  <button
                    onClick={() => pickBiller(b)}
                    className="tap group relative flex h-[132px] w-full flex-col justify-between overflow-hidden rounded-3xl border border-[var(--iute-divider)] bg-[var(--iute-surface)] p-4 text-left transition"
                    style={{ boxShadow: "0 1px 0 rgba(255,255,255,0.6) inset, 0 8px 24px -18px rgba(0,0,0,0.25)" }}
                  >
                    <span
                      className="flex h-11 w-11 items-center justify-center rounded-2xl text-white"
                      style={{ background: b.tint, boxShadow: `0 8px 20px -10px ${b.ring}` }}
                    >
                      <b.Icon size={22} strokeWidth={2.25} />
                    </span>
                    <span>
                      <span className="block pr-6 text-sm font-extrabold leading-tight text-[var(--iute-text)]">{b.name}</span>
                      <span className="mt-1 block font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--iute-text-soft)]">
                        Last · {b.saved}
                      </span>
                    </span>
                  </button>
                  {isCustom && (
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); deleteBiller(b.key); }}
                      aria-label={`Delete ${b.name}`}
                      className="tap absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-[var(--iute-text)]/8 text-[var(--iute-text-soft)] hover:bg-[var(--iute-red)] hover:text-white"
                    >
                      <Trash2 size={14} strokeWidth={2.4} />
                    </button>
                  )}
                </div>
              );
            })}
            <button
              type="button"
              onClick={() => setStep("addBiller")}
              className="tap group relative flex h-[132px] flex-col justify-between overflow-hidden rounded-3xl border-2 border-dashed border-[var(--iute-text)]/20 bg-transparent p-4 text-left transition hover:border-[var(--iute-red)]/50"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl border-2 border-dashed border-[var(--iute-text)]/30 text-[var(--iute-text-soft)]">
                <Plus size={22} strokeWidth={2.5} />
              </span>
              <span>
                <span className="block text-sm font-extrabold leading-tight text-[var(--iute-text)]">Add biller</span>
                <span className="mt-1 block font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--iute-text-soft)]">
                  Save a new account
                </span>
              </span>
            </button>
          </div>
        </div>
      ) : step === "addBiller" ? (
        <div className="space-y-5">
          <div>
            <p className="mb-2 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--iute-text-soft)]">Category</p>
            <div className="grid grid-cols-4 gap-2">
              {(Object.keys(CAT_PRESET) as Array<keyof typeof CAT_PRESET>).map((k) => {
                const p = CAT_PRESET[k];
                const active = newCat === k;
                return (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setNewCat(k)}
                    className={`tap flex flex-col items-center gap-1 rounded-2xl border p-3 text-[11px] font-bold transition ${active ? "border-[var(--iute-red)] bg-[var(--iute-red)]/5 text-[var(--iute-text)]" : "border-[var(--iute-divider)] bg-[var(--iute-surface)] text-[var(--iute-text-soft)]"}`}
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl text-white" style={{ background: p.tint }}>
                      <p.Icon size={16} />
                    </span>
                    {p.label}
                  </button>
                );
              })}
            </div>
          </div>

          <label className="block">
            <span className="mb-1 block font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--iute-text-soft)]">Biller name</span>
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g. EVN — Apartment 4B"
              className="h-12 w-full rounded-2xl border border-[var(--iute-divider)] bg-[var(--iute-surface)] px-4 text-base font-semibold text-[var(--iute-text)] outline-none focus:border-[var(--iute-red)]"
            />
          </label>

          <label className="block">
            <span className="mb-1 block font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--iute-text-soft)]">Account reference</span>
            <div className="relative">
              <input
                value={newRef}
                onChange={(e) => setNewRef(e.target.value)}
                placeholder="100-2034-882"
                className="h-12 w-full rounded-2xl border border-[var(--iute-divider)] bg-[var(--iute-surface)] px-4 pr-12 text-base font-semibold text-[var(--iute-text)] outline-none focus:border-[var(--iute-red)]"
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--iute-text-soft)]">
                <Camera size={18} />
              </span>
            </div>
          </label>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setStep("select")}
              className="tap h-12 flex-1 rounded-2xl border border-[var(--iute-divider)] bg-[var(--iute-surface)] text-sm font-extrabold text-[var(--iute-text)]"
            >
              Cancel
            </button>
            <PrimaryButton className="!h-12 flex-[2]" onClick={saveNewBiller}>Save biller</PrimaryButton>
          </div>
        </div>
      ) : step === "input" ? (
        <div className="space-y-4">
          {/* Saved profile chip */}
          {biller && (
            <button
              onClick={() => setRef(biller.saved)}
              className="tap flex w-full items-center gap-3 rounded-2xl border border-[var(--iute-divider)] bg-[var(--iute-surface)] p-3 text-left"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl text-white" style={{ background: biller.tint }}>
                <biller.Icon size={16} />
              </span>
              <span className="flex-1">
                <span className="block font-mono text-[10px] font-bold uppercase tracking-widest text-[var(--iute-text-soft)]">Saved account</span>
                <span className="block text-sm font-extrabold text-[var(--iute-text)]">{biller.saved}</span>
              </span>
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[var(--iute-red)]">Use</span>
            </button>
          )}

          <label className="block">
            <span className="mb-1.5 block font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--iute-text-soft)]">Customer Reference</span>
            <div className="relative">
              <input
                value={ref}
                onChange={(e) => setRef(e.target.value)}
                placeholder="e.g. 100-2034-882"
                className="h-12 w-full rounded-2xl border border-[var(--iute-divider)] bg-[var(--iute-surface)] pl-4 pr-12 font-mono text-sm font-bold text-[var(--iute-text)] outline-none focus:border-[var(--iute-red)] focus:ring-2 focus:ring-[var(--iute-red)]/20"
              />
              <button
                type="button"
                onClick={scanReference}
                aria-label="Scan reference"
                className="tap absolute right-1.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-xl bg-[var(--iute-fog)] text-[var(--iute-text)]"
              >
                {scanning ? <Loader2 size={16} className="animate-spin" /> : <Camera size={16} />}
              </button>
            </div>
          </label>

          <label className="block">
            <span className="mb-1.5 block font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--iute-text-soft)]">Amount</span>
            <div className="relative">
              <input
                value={amt}
                onChange={(e) => setAmt(e.target.value.replace(/[^\d.]/g, ""))}
                inputMode="decimal"
                placeholder="0.00"
                className="h-16 w-full rounded-2xl border border-[var(--iute-divider)] bg-[var(--iute-surface)] pl-4 pr-16 font-mono text-3xl font-extrabold tracking-tight text-[var(--iute-text)] outline-none focus:border-[var(--iute-red)] focus:ring-2 focus:ring-[var(--iute-red)]/20"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-xs font-bold uppercase tracking-widest text-[var(--iute-text-soft)]">ден</span>
            </div>
            <span className="mt-1.5 block font-mono text-[10px] font-bold uppercase tracking-widest text-[var(--iute-text-soft)]">
              Balance · {fmtMKD(state.balanceMKD)}
            </span>
          </label>

          <PrimaryButton disabled={!ref || !amt} onClick={() => setStep("review")}>
            Review Payment
          </PrimaryButton>
          <button onClick={() => { setStep("select"); setBiller(null); }} className="tap w-full text-center text-sm font-bold text-[var(--iute-text-soft)]">
            Choose another biller
          </button>
        </div>
      ) : (
        // review
        <div className="space-y-4">
          <div
            className="relative overflow-hidden rounded-3xl p-5 text-white"
            style={{ background: "linear-gradient(135deg,#2D2D2D,#0E0E0E)", boxShadow: "0 20px 50px -25px rgba(0,0,0,0.6)" }}
          >
            <span aria-hidden className="absolute -right-10 -top-12 h-40 w-40 rounded-full bg-white/[0.04]" />
            <span aria-hidden className="absolute -bottom-16 -left-8 h-44 w-44 rounded-full bg-[var(--iute-red)]/15" />
            <div className="relative flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl" style={{ background: biller?.tint }}>
                {biller && <biller.Icon size={20} />}
              </span>
              <div>
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-white/60">Paying</p>
                <p className="text-base font-extrabold">{biller?.name}</p>
              </div>
            </div>
            <p className="relative mt-5 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-white/60">Amount</p>
            <p className="relative font-mono text-4xl font-extrabold tracking-tight">
              {(+amt).toLocaleString("en-US", { minimumFractionDigits: 2 })} <span className="text-base text-white/70">ден</span>
            </p>
            <div className="relative mt-5 grid grid-cols-2 gap-3 border-t border-white/10 pt-4 text-[11px]">
              <div>
                <p className="font-mono font-bold uppercase tracking-widest text-white/55">Reference</p>
                <p className="mt-0.5 font-mono text-sm font-bold">{ref}</p>
              </div>
              <div>
                <p className="font-mono font-bold uppercase tracking-widest text-white/55">Fee</p>
                <p className="mt-0.5 font-mono text-sm font-bold">0.00 ден</p>
              </div>
            </div>
          </div>

          {/* Slide to pay */}
          <div
            onPointerDown={onSlideStart}
            onPointerMove={onSlideMove}
            onPointerUp={onSlideEnd}
            onPointerCancel={onSlideEnd}
            className="relative h-14 w-full select-none overflow-hidden rounded-3xl bg-[var(--iute-fog)]"
          >
            <div
              className="absolute inset-y-0 left-0 rounded-3xl bg-[var(--iute-red)] transition-[width] duration-75"
              style={{ width: `${56 + slide * 100}%`, maxWidth: "100%", opacity: 0.18 + slide * 0.4 }}
            />
            <span className="pointer-events-none absolute inset-0 flex items-center justify-center font-bold text-[var(--iute-text)]">
              {slide > 0.05 ? "Release to confirm" : "Slide to Pay"}
            </span>
            <div
              className="absolute top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-2xl bg-[var(--iute-red)] text-white shadow-lg"
              style={{ left: `calc(${slide * 100}% - ${slide * 48}px + 4px)`, transition: dragging ? "none" : "left 200ms" }}
            >
              <Fingerprint size={20} />
            </div>
          </div>

          <button onClick={() => setStep("input")} className="tap w-full text-center text-sm font-bold text-[var(--iute-text-soft)]">
            Edit details
          </button>
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

function MyCardsCarousel() {
  const { state, dispatch, go } = useStore();
  const { cards, activeCardId } = state;
  const idx = Math.max(0, cards.findIndex((c) => c.id === activeCardId));
  const trackRef = useRef<HTMLDivElement>(null);
  const startX = useRef<number | null>(null);
  const deltaX = useRef(0);

  function goTo(i: number) {
    const next = Math.min(cards.length - 1, Math.max(0, i));
    const id = cards[next]?.id;
    if (id && id !== activeCardId) dispatch({ type: "SET_ACTIVE_CARD", id });
  }

  return (
    <section className="px-4 pt-4" aria-label="My cards">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-base font-extrabold text-[var(--iute-text)]">My Cards</h3>
        <button onClick={() => go("cards")} className="tap text-sm font-bold text-[var(--iute-red)]">Manage →</button>
      </div>

      <div
        ref={trackRef}
        className="relative h-[170px] w-full select-none touch-pan-y"
        onTouchStart={(e) => { startX.current = e.touches[0].clientX; deltaX.current = 0; }}
        onTouchMove={(e) => {
          if (startX.current == null) return;
          deltaX.current = e.touches[0].clientX - startX.current;
        }}
        onTouchEnd={() => {
          if (Math.abs(deltaX.current) > 40) goTo(idx + (deltaX.current < 0 ? 1 : -1));
          startX.current = null; deltaX.current = 0;
        }}
      >
        {cards.map((c, i) => {
          const offset = i - idx;
          const isActive = i === idx;
          return (
            <button
              key={c.id}
              onClick={() => isActive ? go("cards") : goTo(i)}
              aria-label={`${c.brand === "iute" ? "iute" : c.brand} card ending ${c.last4}`}
              className="absolute inset-x-0 mx-auto h-[170px] w-[92%] rounded-3xl text-left text-white shadow-2xl transition-all duration-300"
              style={{
                background: c.frozen ? "var(--iute-red)" : "var(--iute-merlot)",
                transform: `translateX(${offset * 24}px) scale(${isActive ? 1 : 0.92})`,
                opacity: Math.abs(offset) > 1 ? 0 : isActive ? 1 : 0.55,
                zIndex: 10 - Math.abs(offset),
                pointerEvents: Math.abs(offset) > 1 ? "none" : "auto",
              }}
            >
              <div className="flex h-full flex-col justify-between p-5">
                <div className="flex items-start justify-between">
                  <span className="text-xl font-extrabold tracking-tight">
                    {c.brand === "iute" ? "iute" : c.brand}
                  </span>
                  <span className="rounded-lg bg-white/15 px-2 py-1 text-[10px] font-bold uppercase tracking-wide ring-1 ring-white/30">
                    {c.kind === "virtual" ? "Virtual" : "Linked"}
                  </span>
                </div>
                <p className="font-mono text-[18px] tracking-[0.2em]">•••• {c.last4}</p>
                <div className="flex items-end justify-between font-mono text-[10px] uppercase">
                  <span>{(c.name || state.userName || "YOUR NAME").toUpperCase()}</span>
                  <span>{c.exp}</span>
                  <span className="rounded-md bg-white/15 px-1.5 py-0.5 ring-1 ring-white/30">
                    {c.frozen ? "[FROZEN]" : c.brand === "iute" ? "[ACTIVE]" : "[LINKED]"}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {cards.length > 1 && (
        <div className="mt-3 flex items-center justify-center gap-2">
          {cards.map((c, i) => (
            <button
              key={c.id}
              onClick={() => goTo(i)}
              aria-label={`Show card ${i + 1}`}
              className={`tap h-2 rounded-full transition-all ${i === idx ? "w-6 bg-[var(--iute-red)]" : "w-2 bg-[var(--iute-text)]/25"}`}
            />
          ))}
        </div>
      )}

      {cards[idx] && cards[idx].brand !== "iute" && (
        <p className="mt-2 text-center text-[11px] font-bold text-[var(--iute-text-soft)]">
          Linked {cards[idx].brand} card — cannot be frozen from iute.
        </p>
      )}
    </section>
  );
}