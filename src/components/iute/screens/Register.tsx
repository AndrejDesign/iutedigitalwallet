import { useRef, useState } from "react";
import { useStore } from "../store";
import { PrimaryButton } from "../ui";

export function Register() {
  const { go, toast } = useStore();
  const [name, setName] = useState("Anja Angelovska");
  const [phone, setPhone] = useState("71 234 572");
  const [dob, setDob] = useState("2003-04-12");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [err, setErr] = useState(false);
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  function setDigit(i: number, v: string) {
    const d = v.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[i] = d;
    setOtp(next);
    setErr(false);
    if (d && i < 3) refs.current[i + 1]?.focus();
    if (next.every((x) => x)) {
      if (next.join("") === "1234") {
        toast("✓ Welcome, Anja!");
        setTimeout(() => go("home"), 400);
      } else {
        setErr(true);
      }
    }
  }

  return (
    <div className="min-h-screen bg-[var(--iute-bg)] px-6 pb-12 pt-10">
      <h1 className="text-3xl font-extrabold text-[var(--iute-text)]">Create your wallet</h1>
      <p className="mt-2 text-sm font-medium text-[var(--iute-text-soft)]">Takes under 60 seconds.</p>

      <div className="mt-8 space-y-4">
        <Field label="Full Name">
          <input value={name} onChange={(e) => setName(e.target.value)} className="h-12 w-full rounded-2xl bg-[var(--iute-surface)] px-4 text-base font-semibold text-[var(--iute-text)] outline-none ring-1 ring-[var(--iute-divider)] focus:ring-2 focus:ring-[var(--iute-red)]" />
        </Field>
        <Field label="Phone Number">
          <div className="flex h-12 items-center rounded-2xl bg-[var(--iute-surface)] ring-1 ring-[var(--iute-divider)] focus-within:ring-2 focus-within:ring-[var(--iute-red)]">
            <span className="px-4 font-mono text-sm font-bold text-[var(--iute-text-soft)]">+389</span>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} className="h-full flex-1 bg-transparent pr-4 text-base font-semibold text-[var(--iute-text)] outline-none" />
          </div>
        </Field>
        <Field label="Date of Birth">
          <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="h-12 w-full rounded-2xl bg-[var(--iute-surface)] px-4 text-base font-semibold text-[var(--iute-text)] outline-none ring-1 ring-[var(--iute-divider)] focus:ring-2 focus:ring-[var(--iute-red)]" />
        </Field>
      </div>

      {!otpSent ? (
        <div className="mt-8">
          <PrimaryButton onClick={() => { setOtpSent(true); toast("OTP sent. Try 1234"); }}>Send OTP</PrimaryButton>
        </div>
      ) : (
        <div className="mt-8">
          <p className="mb-3 text-xs font-bold uppercase tracking-wide text-[var(--iute-text-soft)]">Enter the 4-digit code</p>
          <div className={`flex gap-3 ${err ? "shake-x" : ""}`}>
            {otp.map((d, i) => (
              <input
                key={i}
                ref={(el) => { refs.current[i] = el; }}
                value={d}
                onChange={(e) => setDigit(i, e.target.value)}
                inputMode="numeric"
                maxLength={1}
                className={`h-14 w-14 rounded-2xl bg-[var(--iute-surface)] text-center font-mono text-2xl font-bold text-[var(--iute-text)] outline-none ring-1 ${err ? "ring-2 ring-[var(--iute-red)]" : "ring-[var(--iute-divider)] focus:ring-2 focus:ring-[var(--iute-red)]"}`}
              />
            ))}
          </div>
          {err && <p className="mt-2 text-sm font-bold text-[var(--iute-red)]">Wrong code. Hint: 1234</p>}
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-[var(--iute-text-soft)]">{label}</span>
      {children}
    </label>
  );
}