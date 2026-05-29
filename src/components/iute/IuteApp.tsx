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

  return (
    <div className="iute-phone relative flex h-full w-full flex-col overflow-hidden bg-[var(--iute-bg)] text-[var(--iute-text)] transition-colors duration-200">
      {showHeader && <GlobalHeader open={notifOpen} setOpen={setNotifOpen} />}
      <div className="relative flex-1 overflow-y-auto overflow-x-hidden">
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
        <div className="toast-in pointer-events-none fixed left-1/2 top-6 z-[100] -translate-x-1/2 rounded-lg bg-[var(--iute-red)] px-4 py-3 text-sm font-bold text-white shadow-2xl">
          {state.toast}
        </div>
      )}
    </div>
  );
}

export function IuteApp() {
  return (
    <StoreProvider>
      <div className="min-h-screen w-full bg-[var(--iute-black)] py-0 sm:py-6">
        <div className="relative mx-auto h-screen w-full max-w-[393px] overflow-hidden bg-[var(--iute-bg)] sm:h-[852px] sm:rounded-[47px] sm:shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] sm:ring-1 sm:ring-white/10">
          <Shell />
        </div>
      </div>
    </StoreProvider>
  );
}