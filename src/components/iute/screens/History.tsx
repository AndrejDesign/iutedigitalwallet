import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Search, SlidersHorizontal, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { useStore } from "../store";
import { Skeleton } from "../ui";
import { TRANSACTIONS } from "../mockData";
import type { Txn } from "../types";

const FILTERS = ["All", "Sent", "Received", "Swaps", "BNPL", "Card Payments", "Squad Splits"] as const;
type Filter = typeof FILTERS[number];

export function History() {
  const { dispatch, go } = useStore();
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<Filter>("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  const filtered = useMemo(() => {
    return TRANSACTIONS.filter((t) => {
      if (q && !t.name.toLowerCase().includes(q.toLowerCase())) return false;
      switch (filter) {
        case "All": return true;
        case "Sent": return t.amount < 0;
        case "Received": return t.amount > 0;
        case "Swaps": return t.method === "Swap";
        case "BNPL": return t.method === "BNPL";
        case "Card Payments": return t.method === "Card";
        case "Squad Splits": return !!t.squad;
      }
    });
  }, [q, filter]);

  const groups = useMemo(() => {
    const out: Record<string, Txn[]> = {};
    filtered.forEach((t) => { (out[t.day] ||= []).push(t); });
    return out;
  }, [filtered]);

  return (
    <div className="min-h-screen bg-[var(--iute-bg)] px-4 pb-32 pt-12">
      <header className="flex items-center gap-3 py-2 pt-2">
        <button onClick={() => go("home")} className="tap rounded-2xl bg-[var(--iute-surface)] p-2">
          <ArrowLeft size={20} className="text-[var(--iute-text)]" />
        </button>
        <h1 className="flex-1 text-center text-2xl font-extrabold text-[var(--iute-text)]">Transactions</h1>
        <button className="tap rounded-2xl bg-[var(--iute-surface)] p-2">
          <SlidersHorizontal size={20} className="text-[var(--iute-text)]" />
        </button>
      </header>

      <div className="mt-3 flex h-12 items-center gap-2 rounded-2xl bg-[var(--iute-fog)] px-4">
        <Search size={18} className="text-[var(--iute-text-soft)]" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search transactions..." className="flex-1 bg-transparent text-sm font-bold text-[var(--iute-text)] outline-none placeholder:text-[var(--iute-text-soft)]" />
      </div>

      <div className="mt-3 grid grid-cols-4 gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`tap rounded-full px-3 py-2 text-[11px] font-bold ${filter === f ? "bg-[var(--iute-red)] text-white" : "bg-[var(--iute-fog)] text-[var(--iute-text)]"}`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-5">
        {loading ? (
          <div className="space-y-3">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-12" />)}</div>
        ) : Object.keys(groups).length === 0 ? (
          <p className="py-12 text-center text-sm font-bold text-[var(--iute-text-soft)]">No transactions match.</p>
        ) : (
          Object.entries(groups).map(([day, list]) => (
            <div key={day}>
              <p className="mb-2 font-mono text-[10px] font-bold uppercase tracking-widest text-[var(--iute-text-soft)]">{day}</p>
              <div className="space-y-1 rounded-3xl bg-[var(--iute-surface)] p-2">
                {list.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => { dispatch({ type: "SET_TXN", txn: t }); go("txdetail"); }}
                    className="tap flex w-full items-center gap-3 rounded-2xl px-2 py-2"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--iute-fog)]">
                      {t.amount < 0
                        ? <ArrowUpRight size={14} className="text-[var(--iute-red)]" />
                        : <ArrowDownLeft size={14} className="text-emerald-600" />}
                    </span>
                    <div className="flex-1 text-left">
                      <p className="text-sm font-bold text-[var(--iute-text)]">{t.name}</p>
                      <span className="mt-0.5 inline-block rounded-md bg-[var(--iute-fog)] px-1.5 py-0.5 text-[10px] font-bold text-[var(--iute-text-soft)]">{t.category}</span>
                    </div>
                    <p className={`font-mono text-sm font-extrabold ${t.amount < 0 ? "text-[var(--iute-red)]" : "text-emerald-600"}`}>
                      {t.amount > 0 ? "+" : ""}{t.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}