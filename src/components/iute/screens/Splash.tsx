import { useEffect } from "react";
import { useStore } from "../store";
import iuteLogo from "@/assets/iute-logo.png";

export function Splash() {
  const { go } = useStore();
  useEffect(() => {
    const t = setTimeout(() => go("onboarding"), 1500);
    return () => clearTimeout(t);
  }, [go]);
  return (
    <div className="flex min-h-screen w-full justify-center bg-[var(--iute-red)] pt-32 text-white">
      <div className="spring-in flex flex-col items-center gap-5 px-8">
        <img src={iuteLogo} alt="iute" className="h-auto w-[220px] max-w-[70%]" />
        <h1 className="sr-only">MyIute Pay — Social-first Wallet</h1>
        <p className="text-sm font-semibold opacity-80">Social-first wallet · Skopje</p>
      </div>
    </div>
  );
}