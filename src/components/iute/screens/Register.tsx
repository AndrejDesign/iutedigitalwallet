import { useEffect, useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useStore, getFirstName } from "../store";
import { PrimaryButton } from "../ui";

export function Register() {
  const { go, toast, dispatch } = useStore();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("+389");
  const [dob, setDob] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [err, setErr] = useState(false);
  const hiddenRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (otpSent) hiddenRef.current?.focus();
  }, [otpSent]);

  function onOtpChange(v: string) {
    const digits = v.replace(/\D/g, "").slice(0, 4);
    setOtp(digits);
    setErr(false);
    if (digits.length === 4) {
      if (digits === "1234") {
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
    const maskedPhone = phone.trim() || "your phone";
    return (
      <div className="flex h-full flex-col bg-[var(--iute-bg)] px-6 pb-6 pt-6">
        <button
          onClick={() => { setOtpSent(false); setOtp(""); setErr(false); }}
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
          <button
            type="button"
            onClick={() => hiddenRef.current?.focus()}
            className={`flex w-full items-center justify-center gap-5 ${err ? "shake-x" : ""}`}
          >
            {[0, 1, 2, 3].map((i) => {
              const filled = i < otp.length;
              const isCursor = i === otp.length;
              return (
                <span
                  key={i}
                  className={`flex h-14 w-14 items-center justify-center rounded-full ring-2 transition-all duration-150 ${
                    err
                      ? "ring-[var(--iute-red)] bg-[var(--iute-red)]/5"
                      : filled
                        ? "ring-[var(--iute-red)] bg-[var(--iute-red)]"
                        : isCursor
                          ? "ring-[var(--iute-red)] bg-transparent"
                          : "ring-[var(--iute-divider)] bg-[var(--iute-surface)]"
                  }`}
                >
                  {filled && !err && <span className="h-3.5 w-3.5 rounded-full bg-white" />}
                  {filled && err && <span className="font-mono text-lg font-bold text-[var(--iute-red)]">{otp[i]}</span>}
                </span>
              );
            })}
          </button>
          <input
            ref={hiddenRef}
            value={otp}
            onChange={(e) => onOtpChange(e.target.value)}
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={4}
            aria-label="One-time code"
            className="sr-only"
          />
          {err && <p className="mt-4 text-center text-sm font-bold text-[var(--iute-red)]">Wrong code. Hint: 1234</p>}
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
    <div className="h-full bg-[var(--iute-bg)] px-6 pb-6 pt-24">
      <h1 className="text-2xl font-extrabold text-[var(--iute-text)]">Create your wallet</h1>
      <p className="mt-1 text-sm font-medium text-[var(--iute-text-soft)]">Takes under 60 seconds.</p>

      <div className="mt-6 space-y-3">
        <Field label="Full Name">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" className="h-11 w-full rounded-2xl bg-[var(--iute-surface)] px-4 text-base font-semibold text-[var(--iute-text)] outline-none ring-1 ring-[var(--iute-divider)] placeholder:font-medium placeholder:text-[var(--iute-text-soft)] focus:ring-2 focus:ring-[var(--iute-red)]" />
        </Field>
        <Field label="Phone Number">
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            inputMode="tel"
            placeholder="+389 71 234 567"
            className="h-11 w-full rounded-2xl bg-[var(--iute-surface)] px-4 text-base font-semibold text-[var(--iute-text)] outline-none ring-1 ring-[var(--iute-divider)] placeholder:font-medium placeholder:text-[var(--iute-text-soft)] focus:ring-2 focus:ring-[var(--iute-red)]"
          />
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