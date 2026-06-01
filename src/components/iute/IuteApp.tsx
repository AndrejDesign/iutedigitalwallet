import { useState } from "react";
import { useStore, StoreProvider } from "./store";
import { BottomNav } from "./BottomNav";
import { GlobalHeader } from "./GlobalHeader";
import { Splash } from "./screens/Splash";
import { Onboarding } from "./screens/Onboarding";
import { Register } from "./screens/Register";
import { Home } from "./screens/Home";
import { Squad } from "./screens/Squad";
import { Scan } from "./screens/Scan";
import { Cards } from "./screens/Cards";
import { Account } from "./screens/Account";
import { History } from "./screens/History";
import { TxDetail } from "./screens/TxDetail";

function Shell() {
  const { state } = useStore();
  const [notifOpen, setNotifOpen] = useState(false);

  const chromeless = ["splash", "onboarding", "register", "scan"];
  const showHeader = !chromeless.includes(state.screen);
  const showNav = !["splash", "onboarding", "register"].includes(state.screen);
  const noScroll = ["splash", "onboarding", "register", "scan"].includes(state.screen);

  return (
    <div className="iute-phone relative flex h-full w-full flex-col overflow-hidden bg-[var(--iute-bg)] text-[var(--iute-text)] transition-colors duration-200">
      {showHeader && <GlobalHeader open={notifOpen} setOpen={setNotifOpen} />}
      <div className={`no-scrollbar relative flex-1 overflow-x-hidden ${noScroll ? "overflow-hidden" : "overflow-y-auto"}`}>
      {state.screen === "splash" && <Splash />}
      {state.screen === "onboarding" && <Onboarding />}
      {state.screen === "register" && <Register />}
      {state.screen === "home" && <Home />}
      {state.screen === "squad" && <Squad />}
      {state.screen === "scan" && <Scan />}
      {state.screen === "cards" && <Cards />}
      {state.screen === "account" && <Account />}
      {state.screen === "history" && <History />}
      {state.screen === "txdetail" && <TxDetail />}
      </div>
      {showNav && <BottomNav />}
      {state.toast && (
        <div className="toast-in pointer-events-none absolute left-1/2 top-6 z-[100] -translate-x-1/2 rounded-lg bg-[var(--iute-red)] px-4 py-3 text-sm font-bold text-white shadow-2xl">
          {state.toast}
        </div>
      )}
    </div>
  );
}

export function IuteApp() {
  return (
    <StoreProvider>
      <div className="min-h-screen w-full bg-[var(--iute-black)] sm:flex sm:items-center sm:justify-center sm:py-8">
        {/* Mobile: full-screen. Desktop (sm+): iPhone mockup frame */}
        <div className="relative h-screen w-full max-w-none sm:h-auto sm:w-auto sm:max-w-none">
          {/* Desktop iPhone frame */}
          <div className="hidden sm:block">
            <div className="relative rounded-[60px] bg-[#1a1a1a] p-[14px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.7),0_30px_60px_-30px_rgba(0,0,0,0.5),inset_0_0_0_2px_rgba(255,255,255,0.08)] ring-1 ring-black/40">
              {/* Side buttons */}
              <span aria-hidden className="absolute left-[-3px] top-[110px] h-8 w-[3px] rounded-l-md bg-[#2a2a2a]" />
              <span aria-hidden className="absolute left-[-3px] top-[170px] h-14 w-[3px] rounded-l-md bg-[#2a2a2a]" />
              <span aria-hidden className="absolute left-[-3px] top-[240px] h-14 w-[3px] rounded-l-md bg-[#2a2a2a]" />
              <span aria-hidden className="absolute right-[-3px] top-[180px] h-20 w-[3px] rounded-r-md bg-[#2a2a2a]" />
              {/* Screen */}
              <div className="relative h-[852px] w-[393px] overflow-hidden rounded-[47px] bg-[var(--iute-bg)]">
                {/* Dynamic Island */}
                <div aria-hidden className="pointer-events-none absolute left-1/2 top-[11px] z-50 h-[34px] w-[120px] -translate-x-1/2 rounded-full bg-black" />
                <Shell />
              </div>
            </div>
          </div>
          {/* Mobile: bare full-screen */}
          <div className="h-screen w-full overflow-hidden bg-[var(--iute-bg)] sm:hidden">
            <Shell />
          </div>
        </div>
      </div>
    </StoreProvider>
  );
}