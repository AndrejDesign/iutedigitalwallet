import { useEffect, useState } from "react";
import { Shield, ArrowRight, UserPlus, Search, Check, Send, TrendingUp, Flame, Users, PiggyBank } from "lucide-react";
import { useStore } from "../store";
import { Card, PrimaryButton, SecondaryButton, BottomSheet, Toggle, Confetti } from "../ui";
import { LEADERBOARD, CHALLENGES, CONTACTS } from "../mockData";

type Buddy = { rank: number; name: string; days: number; color: string };

const SUGGESTIONS = [
  { id: "ivan",   name: "Ivan M.",    phone: "+389 70 112 233", color: "#8B5A3C" },
  { id: "tea",    name: "Tea K.",     phone: "+389 71 998 110", color: "#4A6741" },
  { id: "filip",  name: "Filip S.",   phone: "+389 75 221 884", color: "#6B3A2A" },
  { id: "maja",   name: "Maja D.",    phone: "+389 78 553 027", color: "#0F3460" },
  { id: "stefan", name: "Stefan V.",  phone: "+389 72 449 661", color: "#7D3C98" },
];

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
  const [buddyOpen, setBuddyOpen] = useState(false);
  const [extraBuddies, setExtraBuddies] = useState<Buddy[]>([]);

  const myDisplay = (() => {
    const n = state.userName.trim();
    if (!n) return "You";
    const parts = n.split(/\s+/);
    const first = parts[0];
    const lastInitial = parts.length > 1 ? ` ${parts[parts.length - 1][0]}.` : "";
    return `${first}${lastInitial} (you)`;
  })();
  const renamedLeaderboard = LEADERBOARD.map((u) =>
    u.name.toLowerCase().includes("(you)") ? { ...u, name: myDisplay } : u
  );
  const board: Buddy[] = [...renamedLeaderboard, ...extraBuddies].sort((a, b) => b.days - a.days).map((u, i) => ({ ...u, rank: i + 1 }));
  const friends = board.filter((u) => !u.name.toLowerCase().includes("you"));
  const me = board.find((u) => u.name.toLowerCase().includes("you")) ?? board[0];
  const friendAvgDays = friends.length ? Math.round(friends.reduce((s, u) => s + u.days, 0) / friends.length) : 0;
  const myRank = me.rank;
  const beats = friends.filter((u) => me.days >= u.days).length;
  const myPts = state.iutePoints;
  const friendAvgPts = 980;
  const mySplits = 12;
  const friendAvgSplits = 7;

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

  function addBuddy(b: { name: string; color: string }) {
    const colors = ["#D8252C", "#5A0917", "#2D2D2D", "#C9A84C", "#0F3460", "#4A6741"];
    const next: Buddy = {
      rank: 99,
      name: b.name,
      days: 1 + Math.floor(Math.random() * 6),
      color: b.color || colors[extraBuddies.length % colors.length],
    };
    setExtraBuddies((prev) => [...prev, next]);
    toast(`✓ ${b.name} added to your Squad`);
  }

  return (
    <div className="min-h-screen bg-[var(--iute-bg)] px-4 pb-24 pt-2">
      <header className="mb-4 flex items-center justify-between px-1 pt-2">
        <h1 className="text-3xl font-extrabold text-[var(--iute-text)]">Squad Hub</h1>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-[var(--iute-parchment)] px-3 py-1.5 text-xs font-bold text-[var(--iute-black)]">
            {state.iutePoints.toLocaleString()} pts
          </span>
          <button
            onClick={() => setBuddyOpen(true)}
            aria-label="Add buddy"
            className="tap flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--iute-red)] text-white"
          >
            <UserPlus size={20} />
          </button>
        </div>
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
        <div className="flex items-center justify-between">
          <h3 className="text-base font-extrabold text-[var(--iute-text)]">Streak Leaderboard</h3>
          <button onClick={() => setBuddyOpen(true)} className="tap inline-flex items-center gap-1 rounded-full bg-[var(--iute-fog)] px-3 py-1.5 text-[11px] font-bold text-[var(--iute-red)]">
            <UserPlus size={14} /> Add Buddy
          </button>
        </div>
        <div className="mt-3 space-y-1">
          {board.map((u) => (
            <div key={u.rank} className={`flex items-center gap-3 rounded-2xl py-2 pl-2 ${u.rank <= 3 ? "border-l-4 border-[var(--iute-red)]" : "border-l-4 border-transparent"}`}>
              <span className="w-5 font-mono text-xs font-bold text-[var(--iute-text-soft)]">{u.rank}</span>
              <span className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-extrabold" style={{ background: u.color, color: u.color === "#FBF1E4" || u.color === "#EBF3FF" ? "#2D2D2D" : "#fff" }}>
                {u.name.split(" ").map((p) => p[0]).join("").slice(0, 2)}
              </span>
              <span className="flex-1 text-sm font-bold text-[var(--iute-text)]">{u.name}</span>
              <span className="font-mono text-sm font-bold text-[var(--iute-red)]">🔥 {u.days}d</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Compared to Friends bento */}
      <h3 className="mt-5 mb-2 px-1 text-base font-extrabold text-[var(--iute-text)]">You vs. Squad</h3>
      <div className="grid grid-cols-2 gap-3">
        <BentoStat
          Icon={Flame}
          color="#D8252C"
          label="Streak"
          mine={`${state.streakDays}d`}
          friend={`${friendAvgDays}d avg`}
          delta={state.streakDays - friendAvgDays}
          unit="d"
        />
        <BentoStat
          Icon={TrendingUp}
          color="#5A0917"
          label="Squad Rank"
          mine={`#${myRank}`}
          friend={`of ${board.length}`}
          delta={friends.length - (myRank - 1) - beats * 0}
          custom={`Beats ${beats}/${friends.length}`}
        />
        <BentoStat
          Icon={PiggyBank}
          color="#C9A84C"
          label="iutePoints"
          mine={myPts.toLocaleString()}
          friend={`${friendAvgPts.toLocaleString()} avg`}
          delta={myPts - friendAvgPts}
          unit="pts"
        />
        <BentoStat
          Icon={Users}
          color="#2D2D2D"
          label="Splits / mo"
          mine={String(mySplits)}
          friend={`${friendAvgSplits} avg`}
          delta={mySplits - friendAvgSplits}
        />
      </div>

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

      <AddBuddySheet
        open={buddyOpen}
        onClose={() => setBuddyOpen(false)}
        onAdd={addBuddy}
        existing={[...CONTACTS.map((c) => c.name), ...extraBuddies.map((b) => b.name)]}
      />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* COMPARED-TO-FRIENDS BENTO TILE                                             */
/* -------------------------------------------------------------------------- */
function BentoStat({
  Icon, color, label, mine, friend, delta, unit, custom,
}: {
  Icon: typeof Flame; color: string; label: string;
  mine: string; friend: string; delta: number; unit?: string; custom?: string;
}) {
  const positive = delta >= 0;
  return (
    <div
      className="relative overflow-hidden rounded-2xl bg-[var(--iute-surface)] p-3 shadow-sm ring-1 ring-[var(--iute-divider)]"
      style={{ borderTop: `3px solid ${color}` }}
    >
      <div className="flex items-center justify-between">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: `${color}22`, color }}>
          <Icon size={18} />
        </span>
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold ${positive ? "bg-emerald-500/15 text-emerald-600" : "bg-[var(--iute-red)]/10 text-[var(--iute-red)]"}`}
        >
          {custom ?? `${positive ? "+" : ""}${delta}${unit ?? ""}`}
        </span>
      </div>
      <p className="mt-2 text-[10px] font-bold uppercase tracking-wide text-[var(--iute-text-soft)]">{label}</p>
      <p className="font-mono text-lg font-extrabold text-[var(--iute-text)]">{mine}</p>
      <p className="text-[10px] font-medium text-[var(--iute-text-soft)]">vs. {friend}</p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* ADD BUDDY FLOW                                                             */
/* -------------------------------------------------------------------------- */
function AddBuddySheet({
  open, onClose, onAdd, existing,
}: {
  open: boolean;
  onClose: () => void;
  onAdd: (b: { name: string; color: string }) => void;
  existing: string[];
}) {
  const [q, setQ] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [mode, setMode] = useState<"suggest" | "invite">("suggest");

  const suggestions = SUGGESTIONS.filter(
    (s) => !existing.includes(s.name) && (!q || s.name.toLowerCase().includes(q.toLowerCase()) || s.phone.includes(q)),
  );

  function invite() {
    if (!name || !phone) return;
    onAdd({ name, color: "#D8252C" });
    setName(""); setPhone(""); setMode("suggest");
    onClose();
  }

  return (
    <BottomSheet open={open} onClose={onClose} title="Add Buddy to Squad">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-2 rounded-2xl bg-[var(--iute-fog)] p-1">
          <button
            onClick={() => setMode("suggest")}
            className={`tap h-10 rounded-xl text-xs font-extrabold ${mode === "suggest" ? "bg-[var(--iute-red)] text-white" : "text-[var(--iute-text)]"}`}
          >
            From Contacts
          </button>
          <button
            onClick={() => setMode("invite")}
            className={`tap h-10 rounded-xl text-xs font-extrabold ${mode === "invite" ? "bg-[var(--iute-red)] text-white" : "text-[var(--iute-text)]"}`}
          >
            Invite by Phone
          </button>
        </div>

        {mode === "suggest" && (
          <>
            <div className="flex h-12 items-center gap-2 rounded-2xl bg-[var(--iute-fog)] px-4">
              <Search size={18} className="text-[var(--iute-text-soft)]" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search by name or phone..."
                className="flex-1 bg-transparent text-sm font-bold text-[var(--iute-text)] outline-none placeholder:text-[var(--iute-text-soft)]"
              />
            </div>
            <div className="space-y-2">
              {suggestions.length === 0 && (
                <p className="py-6 text-center text-xs font-bold text-[var(--iute-text-soft)]">
                  No new contacts. Try inviting by phone.
                </p>
              )}
              {suggestions.map((s) => (
                <div key={s.id} className="flex items-center gap-3 rounded-2xl bg-[var(--iute-fog)] p-2 pr-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full text-xs font-extrabold text-white" style={{ background: s.color }}>
                    {s.name.split(" ").map((p) => p[0]).join("").slice(0, 2)}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-extrabold text-[var(--iute-text)]">{s.name}</p>
                    <p className="font-mono text-[11px] font-bold text-[var(--iute-text-soft)]">{s.phone}</p>
                  </div>
                  <button
                    onClick={() => onAdd({ name: s.name, color: s.color })}
                    className="tap inline-flex h-9 items-center gap-1 rounded-full bg-[var(--iute-red)] px-3 text-[11px] font-extrabold text-white"
                  >
                    <Check size={14} strokeWidth={3} /> Add
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {mode === "invite" && (
          <div className="space-y-3">
            <label className="block">
              <span className="mb-1 block text-xs font-bold uppercase text-[var(--iute-text-soft)]">Friend's name</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Marko Stojanov"
                className="h-12 w-full rounded-2xl bg-[var(--iute-fog)] px-4 text-sm font-bold text-[var(--iute-text)] outline-none focus:ring-2 focus:ring-[var(--iute-red)]"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-bold uppercase text-[var(--iute-text-soft)]">Phone number</span>
              <input
                value={phone}
                inputMode="tel"
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+389 7X XXX XXX"
                className="h-12 w-full rounded-2xl bg-[var(--iute-fog)] px-4 font-mono text-sm font-bold text-[var(--iute-text)] outline-none focus:ring-2 focus:ring-[var(--iute-red)]"
              />
            </label>
            <div className="rounded-2xl bg-[var(--iute-parchment)] p-3 text-[11px] font-bold text-[var(--iute-merlot)]">
              🎁 You both earn 500 iutePoints when they join iute Pay.
            </div>
            <PrimaryButton disabled={!name || !phone} onClick={invite}>
              <span className="inline-flex items-center gap-2"><Send size={16} /> Send Invite</span>
            </PrimaryButton>
            <SecondaryButton onClick={() => setMode("suggest")}>Back</SecondaryButton>
          </div>
        )}
      </div>
    </BottomSheet>
  );
}