import { useEffect } from "react";
import { useStore } from "../store";

export function Splash() {
  const { go } = useStore();
  useEffect(() => {
    const t = setTimeout(() => go("onboarding"), 1500);
    return () => clearTimeout(t);
  }, [go]);
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[var(--iute-red)] text-white">
      <div className="spring-in flex flex-col items-center gap-4">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white text-[var(--iute-red)] font-extrabold text-3xl shadow-2xl">
          iP
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight">MyIute Pay</h1>
        <p className="text-sm font-semibold opacity-80">Social-first wallet · Skopje</p>
      </div>
    </div>
  );
}