import { useState } from "react";
import {
  CreditCard, Landmark, Fingerprint, Lock, ShieldCheck, Globe,
  Map, HelpCircle, Bell, LogOut, ChevronRight,
} from "lucide-react";
import { useStore } from "../store";
import { BottomSheet, PrimaryButton, Toggle } from "../ui";

export function Account() {
  const { state, dispatch, toast, go } = useStore();
  const [kycOpen, setKycOpen] = useState(false);
  const [delOpen, setDelOpen] = useState(false);
  const [delText, setDelText] = useState("");
  const [bio, setBio] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [deleted, setDeleted] = useState(false);

  function upgrade() {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      dispatch({ type: "SET_TIER", tier: 2 });
      setKycOpen(false);
      toast("✓ Verification submitted! Under review.");
    }, 2000);
  }

  return (
    <div className="min-h-screen bg-[var(--iute-bg)] px-4 pb-32 pt-6">
      <div className="overflow-hidden rounded-3xl bg-[var(--iute-red)] p-5 text-white">
        <div className="flex items-center gap-4">
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--iute-merlot)] text-2xl font-extrabold">AA</span>
          <div>
            <p className="text-xl font-extrabold">Anja Angelovska</p>
            <p className="text-sm font-medium opacity-80">+389 71 ••• •72</p>
          </div>
        </div>
        <button onClick={() => setKycOpen(true)} className="tap mt-4 w-full rounded-lg border border-white/40 py-2 text-[11px] font-extrabold uppercase tracking-wide">
          KYC Level {state.tier} {state.tier === 1 ? "— Tap to Upgrade" : "— Active"}
        </button>
      </div>

      <div className="mt-4 space-y-2 rounded-3xl bg-[var(--iute-surface)] p-2">
        <Row Icon={CreditCard} label="Linked External Cards" onClick={() => toast("Linked cards…")} />
        <Row Icon={Landmark} label="Bank Accounts" onClick={() => toast("Bank accounts…")} />
        <Row Icon={Fingerprint} label="Biometric Login" right={<Toggle on={bio} onChange={setBio} />} />
        <Row Icon={Lock} label="Change PIN" onClick={() => toast("Change PIN flow…")} />
        <Row Icon={ShieldCheck} label="2FA Security Rules" onClick={() => toast("2FA settings…")} />
        <Row Icon={Globe} label="Default Currency" right={<span className="rounded-lg bg-[var(--iute-cloud)] px-2 py-1 text-[10px] font-bold text-[var(--iute-text)]">MKD</span>} />
        <Row Icon={Map} label="Partner Network & Discount Map" onClick={() => toast("Opening partner map…")} />
        <Row Icon={HelpCircle} label="Help Centre FAQs" onClick={() => toast("Opening help centre…")} />
        <Row Icon={Bell} label="Notification Preferences" onClick={() => toast("Notification prefs…")} />
        <Row Icon={LogOut} label="Log Out" red onClick={() => go("splash")} />
      </div>

      <button onClick={() => setDelOpen(true)} className="tap mt-4 w-full rounded-3xl bg-[var(--iute-merlot)] py-5 text-base font-extrabold text-white" disabled={deleted}>
        {deleted ? "Deletion requested" : "Delete Account"}
      </button>

      <BottomSheet open={kycOpen} onClose={() => setKycOpen(false)} title="Unlock Full Access">
        <div className="space-y-3">
          <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/5 p-3">
            <p className="text-sm font-extrabold text-[var(--iute-text)]">✓ Level 1 — Basic Info</p>
            <p className="text-xs font-medium text-[var(--iute-text-soft)]">Max 15,000 ден · Active</p>
          </div>
          <div className={`rounded-2xl border p-3 ${state.tier === 2 ? "border-emerald-500/40 bg-emerald-500/5" : "border-[var(--iute-red)]/40 bg-[var(--iute-red)]/5"}`}>
            <p className="text-sm font-extrabold text-[var(--iute-text)]">{state.tier === 2 ? "✓ " : ""}Level 2 — ID Verification</p>
            <p className="text-xs font-medium text-[var(--iute-text-soft)]">Max 120,000 ден · Cardless ATM · BNPL</p>
          </div>
          {state.tier === 1 && (
            <>
              {scanning ? (
                <div className="space-y-2">
                  <div className="shimmer h-32 rounded-2xl" />
                  <p className="text-center text-xs font-bold text-[var(--iute-text-soft)]">Scanning your document…</p>
                </div>
              ) : (
                <PrimaryButton onClick={upgrade}>Scan Identity Document Now</PrimaryButton>
              )}
            </>
          )}
        </div>
      </BottomSheet>

      <BottomSheet open={delOpen} onClose={() => setDelOpen(false)} title="Confirm account deletion">
        <p className="mb-3 text-sm font-medium text-[var(--iute-text-soft)]">Type DELETE to confirm. This cannot be undone.</p>
        <input value={delText} onChange={(e) => setDelText(e.target.value)} className="h-12 w-full rounded-2xl bg-[var(--iute-fog)] px-4 font-mono text-base font-extrabold uppercase tracking-widest text-[var(--iute-text)] outline-none" />
        <PrimaryButton
          disabled={delText !== "DELETE"}
          onClick={() => { setDelOpen(false); setDeleted(true); toast("Account deletion requested"); }}
          className="mt-3"
        >
          Confirm Delete
        </PrimaryButton>
      </BottomSheet>
    </div>
  );
}

function Row({ Icon, label, right, onClick, red }: { Icon: typeof Lock; label: string; right?: React.ReactNode; onClick?: () => void; red?: boolean }) {
  return (
    <button onClick={onClick} className="tap flex h-12 w-full items-center gap-3 rounded-2xl px-3 hover:bg-[var(--iute-fog)]/60">
      <Icon size={18} className={red ? "text-[var(--iute-red)]" : "text-[var(--iute-text)]"} />
      <span className={`flex-1 text-left text-sm font-bold ${red ? "text-[var(--iute-red)]" : "text-[var(--iute-text)]"}`}>{label}</span>
      {right ?? <ChevronRight size={18} className="text-[var(--iute-text-soft)]" />}
    </button>
  );
}