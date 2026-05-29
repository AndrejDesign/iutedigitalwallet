import { useEffect, useState } from "react";
import { TrendingUp, Ticket, Check } from "lucide-react";
import { useStore, fmtMKD } from "../store";
import { BottomSheet, PrimaryButton, SecondaryButton, Confetti } from "../ui";
import { PARTNER_VOUCHERS } from "../mockData";

type Mode = "cashback" | "voucher";

export function RedeemSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { state, dispatch, toast } = useStore();
  const [mode, setMode] = useState<Mode | null>(null);
  const [points, setPoints] = useState(500);
  const [voucher, setVoucher] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (open) { setMode(null); setPoints(Math.min(500, state.iutePoints)); setVoucher(null); setSuccess(false); }
  }, [open, state.iutePoints]);

  const cash = Math.floor(points / 10);
  const selectedVoucher = PARTNER_VOUCHERS.find(v => v.id === voucher);

  function confirm() {
    if (mode === "cashback") {
      if (points <= 0 || points > state.iutePoints) return;
      dispatch({ type: "SET_POINTS", points: state.iutePoints - points });
      dispatch({ type: "SET_BALANCE", balance: state.balanceMKD + cash });
    } else if (mode === "voucher" && selectedVoucher) {
      if (selectedVoucher.cost > state.iutePoints) { toast("Not enough points"); return; }
      dispatch({ type: "SET_POINTS", points: state.iutePoints - selectedVoucher.cost });
    } else return;
    setSuccess(true);
    toast("🎉 Successfully redeemed points! Your cash balance has been updated.");
    setTimeout(() => { setSuccess(false); onClose(); }, 1800);
  }

  const canConfirm =
    (mode === "cashback" && points > 0 && points <= state.iutePoints) ||
    (mode === "voucher" && !!selectedVoucher && selectedVoucher.cost <= state.iutePoints);

  return (
    <BottomSheet open={open} onClose={onClose} title="Redeem iutePlus Points">
      {success && <Confetti />}
      {success ? (
        <div className="flex flex-col items-center py-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500 text-white animate-[scale-in_0.3s_ease-out]">
            <Check size={44} strokeWidth={3} />
          </div>
          <p className="mt-4 text-lg font-extrabold text-[var(--iute-text)]">Redemption Confirmed</p>
          <p className="mt-1 text-xs font-medium text-[var(--iute-text-soft)]">Balance updated instantly</p>
        </div>
      ) : !mode ? (
        <div className="space-y-3">
          <p className="text-xs font-bold text-[var(--iute-text-soft)]">Available: {state.iutePoints.toLocaleString()} pts</p>
          <RewardCard Icon={TrendingUp} title="Cashback Booster" sub="Convert points directly into wallet cash" color="var(--iute-red)" onClick={() => setMode("cashback")} />
          <RewardCard Icon={Ticket} title="Partner Vouchers" sub="Get discount codes for Skopje Coffee Lab & local cinemas" color="#0066B3" onClick={() => setMode("voucher")} />
        </div>
      ) : mode === "cashback" ? (
        <div className="space-y-4">
          <div className="rounded-2xl bg-[var(--iute-parchment)] p-4 text-center dark:bg-[var(--iute-merlot)]">
            <p className="font-mono text-2xl font-extrabold text-[var(--iute-text)]">
              {points.toLocaleString()} pts = {cash.toLocaleString()} ден
            </p>
            <p className="mt-1 text-[10px] font-bold uppercase tracking-wide text-[var(--iute-text-soft)]">10 points = 1 MKD</p>
          </div>
          <input
            type="range" min={0} max={state.iutePoints} step={10}
            value={points} onChange={(e) => setPoints(+e.target.value)}
            className="w-full accent-[var(--iute-red)]"
            aria-label="Points to redeem"
          />
          <div className="flex justify-between font-mono text-[10px] font-bold text-[var(--iute-text-soft)]">
            <span>0</span><span>{state.iutePoints.toLocaleString()} pts</span>
          </div>
          <p className="text-xs font-medium text-[var(--iute-text-soft)]">
            New balance after redemption: <span className="font-bold text-[var(--iute-text)]">{fmtMKD(state.balanceMKD + cash)}</span>
          </p>
          <button onClick={confirm} disabled={!canConfirm} className="tap h-14 w-full rounded-3xl bg-[var(--iute-red)] text-base font-extrabold text-white disabled:opacity-40">
            Confirm Redemption
          </button>
          <SecondaryButton onClick={() => setMode(null)}>Back</SecondaryButton>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <div className="grid grid-cols-2 gap-3 pb-2">
              {PARTNER_VOUCHERS.map((v) => {
                const sel = voucher === v.id;
                const can = v.cost <= state.iutePoints;
                return (
                  <button
                    key={v.id}
                    onClick={() => can && setVoucher(v.id)}
                    disabled={!can}
                    className={`tap flex flex-col rounded-2xl p-3 text-left ring-2 transition-all ${sel ? "ring-[var(--iute-red)] bg-[var(--iute-red)]/5" : "ring-[var(--iute-divider)] bg-[var(--iute-fog)]"} ${!can ? "opacity-40" : ""}`}
                  >
                    <span className="text-2xl">{v.emoji}</span>
                    <p className="mt-1 text-xs font-extrabold text-[var(--iute-text)]">{v.name}</p>
                    <p className="text-[10px] font-medium text-[var(--iute-text-soft)]">{v.partner}</p>
                    <p className="mt-2 font-mono text-xs font-extrabold text-[var(--iute-red)]">{v.cost} pts</p>
                  </button>
                );
              })}
            </div>
          </div>
          <button onClick={confirm} disabled={!canConfirm} className="tap h-14 w-full rounded-3xl bg-[var(--iute-red)] text-base font-extrabold text-white disabled:opacity-40">
            Confirm Redemption
          </button>
          <SecondaryButton onClick={() => setMode(null)}>Back</SecondaryButton>
        </div>
      )}
    </BottomSheet>
  );
}

function RewardCard({ Icon, title, sub, color, onClick }: { Icon: typeof TrendingUp; title: string; sub: string; color: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="tap flex w-full items-center gap-3 rounded-2xl border-2 border-transparent bg-[var(--iute-fog)] p-4 text-left hover:border-[var(--iute-red)]">
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl" style={{ background: `${color}22`, color }}>
        <Icon size={22} />
      </span>
      <div className="flex-1">
        <p className="text-sm font-extrabold text-[var(--iute-text)]">{title}</p>
        <p className="text-[11px] font-medium text-[var(--iute-text-soft)]">{sub}</p>
      </div>
    </button>
  );
}