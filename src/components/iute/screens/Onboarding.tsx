import { useState } from "react";
import { ArrowRight, Send, Flame, ShieldCheck } from "lucide-react";
import { useStore } from "../store";
import { PrimaryButton } from "../ui";

const SLIDES = [
  { bg: "#EBF3FF", title: "Send cash like a DM.", sub: "Tap, scan, done. No IBANs, no waiting.", Icon: Send },
  { bg: "#FBF1E4", title: "Squad Hub: Split bills, build streaks.", sub: "Turn every coffee run into a cashback streak with your crew.", Icon: Flame },
  { bg: "#F3F3F3", title: "Shake to freeze. Instant peace of mind.", sub: "Lost your phone? One shake freezes your card in 0.3 seconds.", Icon: ShieldCheck },
];

export function Onboarding() {
  const { go } = useStore();
  const [i, setI] = useState(0);
  const slide = SLIDES[i];
  const Icon = slide.Icon;
  return (
    <div className="flex min-h-screen flex-col" style={{ background: slide.bg }}>
      <div className="flex flex-1 flex-col items-center justify-center gap-8 px-7 pt-12 text-center text-[var(--iute-black)]">
        <div className="spring-in flex h-40 w-40 items-center justify-center rounded-[40px] bg-white shadow-xl">
          <Icon size={64} className="text-[var(--iute-red)]" strokeWidth={2.2} />
        </div>
        <div className="space-y-3">
          <h2 className="text-3xl font-extrabold leading-tight">{slide.title}</h2>
          <p className="text-base font-medium opacity-70">{slide.sub}</p>
        </div>
      </div>
      <div className="flex justify-center gap-2 pb-6">
        {SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setI(idx)}
            className={`h-2 rounded-full transition-all duration-300 ${idx === i ? "w-8 bg-[var(--iute-red)]" : "w-2 bg-black/20"}`}
            aria-label={`Slide ${idx + 1}`}
          />
        ))}
      </div>
      <div className="px-6 pb-10">
        <PrimaryButton onClick={() => (i < SLIDES.length - 1 ? setI(i + 1) : go("register"))}>
          <span className="inline-flex items-center justify-center gap-2">
            {i < SLIDES.length - 1 ? "Next" : "Get Started"} <ArrowRight size={18} />
          </span>
        </PrimaryButton>
        <button onClick={() => go("register")} className="mt-3 w-full text-sm font-bold uppercase tracking-wide opacity-60">
          Skip
        </button>
      </div>
    </div>
  );
}