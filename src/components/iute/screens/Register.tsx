import { useEffect, useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useStore, getFirstName } from "../store";
import { PrimaryButton } from "../ui";

export function Register() {
  const { go, toast, dispatch } = useStore();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [err, setErr] = useState(false);
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (otpSent) refs.current[0]?.focus();
  }, [otpSent]);

  function setDigit(i: number, v: string) {
    const d = v.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[i] = d;
    setOtp(next);
    setErr(false);
    if (d && i < 3) refs.current[i + 1]?.focus();
    if (next.every((x) => x)) {
      if (next.join("") === "1234") {
        const trimmed = name.trim();
        if (trimmed) dispatch({ type: "SET_USER_NAME", name: trimmed });
        const first = getFirstName(trimmed);
        toast(first ? `✓ Welcome, ${first}!` : "✓ Welcome!");
        setTimeout(() => go("home"), 400);
      } else {
        setErr(true);
      }
    }
  }

  if (otpSent) {
    const maskedPhone = phone ? `+389 ${phone}` : "your phone";
    return (
      <div className="flex h-full flex-col bg-[var(--iute-bg)] px-6 pb-6 pt-6">
        <button
          onClick={() => { setOtpSent(false); setOtp(["", "", "", ""]); setErr(false); }}
          className="tap -ml-2 flex h-10 w-10 items-center justify-center rounded-full text-[var(--iute-text)] hover:bg-[var(--iute-surface)]"
          aria-label="Back"
        >
          <ArrowLeft size={22} />
        </button>

        <div className="mt-6">
          <h1 className="text-2xl font-extrabold text-[var(--iute-text)]">Enter verification code</h1>
          <p className="mt-2 text-sm font-medium text-[var(--iute-text-soft)]">
            We sent a 4-digit code to <span className="font-bold text-[var(--iute-text)]">{maskedPhone}</span>.
          </p>
        </div>

        <div className="mt-10">
          <div className={`flex justify-between gap-3 ${err ? "shake-x" : ""}`}>
            {otp.map((d, i) => (
              <input
                key={i}
                ref={(el) => { refs.current[i] = el; }}
                value={d}
                onChange={(e) => setDigit(i, e.target.value)}
                inputMode="numeric"
                maxLength={1}
                className={`h-16 flex-1 rounded-2xl bg-[var(--iute-surface)] text-center font-mono text-3xl font-bold text-[var(--iute-text)] outline-none ring-1 ${err ? "ring-2 ring-[var(--iute-red)]" : "ring-[var(--iute-divider)] focus:ring-2 focus:ring-[var(--iute-red)]"}`}
              />
            ))}
          </div>
          {err && <p className="mt-3 text-sm font-bold text-[var(--iute-red)]">Wrong code. Hint: 1234</p>}
        </div>

        <button
          onClick={() => toast("OTP resent. Try 1234")}
          className="tap mt-6 self-start text-sm font-bold text-[var(--iute-red)]"
        >
          Resend code
        </button>
      </div>
    );
  }

  return (
    <div className="h-full bg-[var(--iute-bg)] px-6 pb-6 pt-8">
      <h1 className="text-2xl font-extrabold text-[var(--iute-text)]">Create your wallet</h1>
      <p className="mt-1 text-sm font-medium text-[var(--iute-text-soft)]">Takes under 60 seconds.</p>

      <div className="mt-6 space-y-3">
        <Field label="Full Name">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" className="h-11 w-full rounded-2xl bg-[var(--iute-surface)] px-4 text-base font-semibold text-[var(--iute-text)] outline-none ring-1 ring-[var(--iute-divider)] placeholder:font-medium placeholder:text-[var(--iute-text-soft)] focus:ring-2 focus:ring-[var(--iute-red)]" />
        </Field>
        <Field label="Phone Number">
          <div className="flex h-11 items-center rounded-2xl bg-[var(--iute-surface)] ring-1 ring-[var(--iute-divider)] focus-within:ring-2 focus-within:ring-[var(--iute-red)]">
            <span className="px-4 font-mono text-sm font-bold text-[var(--iute-text-soft)]">+389</span>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="71 234 567" className="h-full flex-1 bg-transparent pr-4 text-base font-semibold text-[var(--iute-text)] outline-none placeholder:font-medium placeholder:text-[var(--iute-text-soft)]" />
          </div>
        </Field>
        <Field label="Date of Birth">
          <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="h-11 w-full rounded-2xl bg-[var(--iute-surface)] px-4 text-base font-semibold text-[var(--iute-text)] outline-none ring-1 ring-[var(--iute-divider)] focus:ring-2 focus:ring-[var(--iute-red)]" />
        </Field>
      </div>

      <div className="mt-6">
        <PrimaryButton onClick={() => { setOtpSent(true); toast("OTP sent. Try 1234"); }}>Send OTP</PrimaryButton>
      </div>
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