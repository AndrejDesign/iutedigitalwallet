import { useEffect, useState } from "react";
import { Shield, ArrowRight } from "lucide-react";
import { useStore } from "../store";
import { Card, PrimaryButton, BottomSheet, Toggle, Confetti } from "../ui";
import { LEADERBOARD, CHALLENGES } from "../mockData";

export function Squad() {
  const { state, dispatch, toast } = useStore();
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("1200");
  const [size, setSize] = useState(4);
  const [equal, setEqual] = useState(true);
  const [partner, setPartner] = useState(true);
  const [slide, setSlide] = useState(0);
  const [celebrate, setCelebrate] = useState(false);
  const [custom, setCustom] = useState<string[]>(Array(10).fill(""));

  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % CHALLENGES.length), 4000);
    return () => clearInterval(t);
  }, []);

  const perPerson = ((+amount || 0) / size).toFixed(2);

  function buyFreeze() {
    if (state.iutePoints < 200) { toast("Not enough points"); return; }
    dispatch({ type: "SET_POINTS", points: state.iutePoints - 200 });
    toast("✓ Streak Freeze added");
  }

  function extendStreak() {
    dispatch({ type: "INC_STREAK", by: 7 });
    if (state.streakDays + 7 >= 14) setCelebrate(true);
    setOpen(false);
    toast("✓ Split requests sent");
  }

  return (
    <div className="min-h-screen bg-[var(--iute-bg)] px-4 pb-32 pt-6">
      <header className="mb-4 flex items-center justify-between px-1">
        <h1 className="text-3xl font-extrabold text-[var(--iute-text)]">Squad Hub</h1>
        <span className="rounded-full bg-[var(--iute-parchment)] px-3 py-1.5 text-xs font-bold text-[var(--iute-black)]">
          {state.iutePoints.toLocaleString()} pts
        </span>
      </header>

      <div className="grid grid-cols-2 gap-3">
        <Card className="col-span-2">
          <p className="text-xs font-bold uppercase tracking-wide text-[var(--iute-text-soft)]">Group Split</p>
          <p className="mt-1 text-xl font-extrabold text-[var(--iute-text)]">Split a Bill</p>
          <p className="mt-1 text-xs font-medium text-[var(--iute-text-soft)]">Send fair share requests in seconds.</p>
          <div className="mt-3">
            <PrimaryButton onClick={() => setOpen(true)}>
              <span className="inline-flex items-center gap-2">Launch New Split <ArrowRight size={18} /></span>
            </PrimaryButton>
          </div>
        </Card>

        <Card className="bg-[var(--iute-cloud)] dark:bg-[var(--iute-merlot)]">
          <Shield size={22} className="text-[var(--iute-red)]" />
          <p className="mt-2 text-base font-extrabold text-[var(--iute-text)]">Streak Freeze</p>
          <p className="text-[11px] font-medium text-[var(--iute-text-soft)]">1 Available This Month</p>
          <button onClick={buyFreeze} className="tap mt-3 h-12 w-full rounded-2xl bg-[var(--iute-red)] text-sm font-bold text-white">
            Buy Extra (200 pts)
          </button>
        </Card>

        <Card className="overflow-hidden">
          <p className="text-xs font-bold uppercase tracking-wide text-[var(--iute-text-soft)]">Challenges</p>
          <p className="mt-2 min-h-[64px] text-sm font-bold leading-snug text-[var(--iute-text)]">
            {CHALLENGES[slide]}
          </p>
          <div className="mt-2 flex gap-1.5">
            {CHALLENGES.map((_, i) => (
              <span key={i} className={`h-1.5 rounded-full transition-all ${i === slide ? "w-5 bg-[var(--iute-red)]" : "w-1.5 bg-black/15"}`} />
            ))}
          </div>
        </Card>
      </div>

      <Card className="mt-4">
        <h3 className="text-base font-extrabold text-[var(--iute-text)]">Streak Leaderboard</h3>
        <div className="mt-3 space-y-1">
          {LEADERBOARD.map((u) => (
            <div key={u.rank} className={`flex items-center gap-3 rounded-2xl py-2 pl-2 ${u.rank <= 3 ? "border-l-4 border-[var(--iute-red)]" : "border-l-4 border-transparent"}`}>
              <span className="w-5 font-mono text-xs font-bold text-[var(--iute-text-soft)]">{u.rank}</span>
              <span className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-extrabold text-white" style={{ background: u.color, color: u.rank === 4 ? "#2D2D2D" : "#fff" }}>
                {u.name.split(" ").map((p) => p[0]).join("").slice(0, 2)}
              </span>
              <span className="flex-1 text-sm font-bold text-[var(--iute-text)]">{u.name}</span>
              <span className="font-mono text-sm font-bold text-[var(--iute-red)]">🔥 {u.days}d</span>
            </div>
          ))}
        </div>
      </Card>

      <BottomSheet open={open} onClose={() => setOpen(false)} title="Split a Bill">
        <div className="space-y-4">
          <label className="block">
            <span className="mb-1 block text-xs font-bold uppercase text-[var(--iute-text-soft)]">Amount (MKD)</span>
            <input value={amount} onChange={(e) => setAmount(e.target.value.replace(/[^\d.]/g, ""))} className="h-12 w-full rounded-2xl bg-[var(--iute-fog)] px-4 font-mono text-lg font-extrabold text-[var(--iute-text)] outline-none" />
          </label>
          <div>
            <p className="mb-2 text-xs font-bold uppercase text-[var(--iute-text-soft)]">Splitting with {size} friends</p>
            <input type="range" min={2} max={10} value={size} onChange={(e) => setSize(+e.target.value)} className="w-full accent-[var(--iute-red)]" />
            <p className="mt-1 text-sm font-bold text-[var(--iute-text)]">≈ {perPerson} ден each</p>
          </div>
          <div className="flex items-center justify-between rounded-2xl bg-[var(--iute-fog)] p-3">
            <span className="text-sm font-bold text-[var(--iute-text)]">{equal ? "Equal Split" : "Custom Split"}</span>
            <Toggle on={!equal} onChange={(v) => setEqual(!v)} />
          </div>
          {!equal && (
            <div className="grid grid-cols-2 gap-2">
              {Array.from({ length: size }).map((_, i) => (
                <input
                  key={i}
                  placeholder={`Person ${i + 1}`}
                  value={custom[i] || ""}
                  onChange={(e) => { const n = [...custom]; n[i] = e.target.value; setCustom(n); }}
                  className="h-11 rounded-xl bg-[var(--iute-fog)] px-3 font-mono text-sm text-[var(--iute-text)] outline-none"
                />
              ))}
            </div>
          )}
          <div className="flex items-center justify-between rounded-2xl bg-[var(--iute-fog)] p-3">
            <span className="text-sm font-bold text-[var(--iute-text)]">Partner venue</span>
            <Toggle on={partner} onChange={setPartner} />
          </div>
          {partner && (
            <div className="rounded-2xl bg-[var(--iute-parchment)] p-3 text-sm font-bold text-[var(--iute-merlot)]">
              🎁 iutePlus Cashback Boost active at partner venues!
            </div>
          )}
          <PrimaryButton onClick={extendStreak}>Confirm & Send Requests</PrimaryButton>
        </div>
      </BottomSheet>

      <BottomSheet open={celebrate} onClose={() => setCelebrate(false)} title="Milestone unlocked!">
        <div className="relative min-h-[160px]">
          <Confetti />
          <div className="text-center">
            <p className="text-3xl">🎉</p>
            <p className="mt-2 text-lg font-extrabold text-[var(--iute-text)]">{state.streakDays}-Day Streak!</p>
            <p className="text-sm font-medium text-[var(--iute-text-soft)]">Cashback upgraded to 10%</p>
          </div>
          <PrimaryButton onClick={() => setCelebrate(false)} className="mt-6">Nice 🔥</PrimaryButton>
        </div>
      </BottomSheet>
    </div>
  );
}