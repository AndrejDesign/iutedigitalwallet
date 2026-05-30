import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  type ReactNode,
} from "react";
import type { AppState, ScreenKey, Tier, Txn, WalletCard } from "./types";

type Action =
  | { type: "SET_SCREEN"; screen: ScreenKey }
  | { type: "SET_TIER"; tier: Tier }
  | { type: "SET_USER_NAME"; name: string }
  | { type: "SET_BALANCE"; balance: number }
  | { type: "SET_RATE"; rate: number }
  | { type: "SET_POINTS"; points: number }
  | { type: "ADD_CARD"; card: WalletCard }
  | { type: "SET_ACTIVE_CARD"; id: string }
  | { type: "TOGGLE_CARD_FREEZE"; id: string; value?: boolean }
  | { type: "TOGGLE_PANIC" }
  | { type: "SET_LIMIT"; limit: number }
  | { type: "INC_STREAK"; by: number }
  | { type: "SET_TXN"; txn: Txn | null }
  | { type: "TOAST"; msg: string | null }
  | { type: "READ_NOTIFICATIONS" };

const initial: AppState = {
  screen: "splash",
  tier: 1,
  userName: "",
  balanceMKD: 8450,
  rate: 61.5,
  iutePoints: 1450,
  panicMode: true,
  dailyLimit: 15000,
  streakDays: 7,
  selectedTxn: null,
  toast: null,
  notifications: [
    { id: "n1", icon: "money",  title: "Marko paid you 350 ден",  body: "Split: Pizza night 🍕",      when: "2m ago",  read: false },
    { id: "n2", icon: "squad",  title: "Streak unlocked — 7 days", body: "5% cashback active today.",  when: "1h ago",  read: false },
    { id: "n3", icon: "card",   title: "Card payment approved",    body: "Skopje Coffee Lab · 280 ден", when: "3h ago", read: false },
    { id: "n4", icon: "promo",  title: "1,450 iutePlus points",    body: "You can redeem rewards now.", when: "Yesterday", read: true  },
    { id: "n5", icon: "alert",  title: "New login from Skopje",    body: "iPhone · Today 09:14",        when: "Yesterday", read: true  },
  ],
  cards: [
    { id: "default", last4: "8942", name: "", exp: "09/28", brand: "iute", kind: "virtual", frozen: false },
  ],
  activeCardId: "default",
};

function reducer(s: AppState, a: Action): AppState {
  switch (a.type) {
    case "SET_SCREEN": return { ...s, screen: a.screen };
    case "SET_TIER": return { ...s, tier: a.tier };
    case "SET_USER_NAME": return { ...s, userName: a.name };
    case "SET_BALANCE": return { ...s, balanceMKD: a.balance };
    case "SET_RATE": return { ...s, rate: a.rate };
    case "SET_POINTS": return { ...s, iutePoints: a.points };
    case "ADD_CARD": return { ...s, cards: [...s.cards, a.card], activeCardId: a.card.id };
    case "SET_ACTIVE_CARD": return { ...s, activeCardId: a.id };
    case "TOGGLE_CARD_FREEZE": return {
      ...s,
      cards: s.cards.map((c) => c.id === a.id ? { ...c, frozen: a.value ?? !c.frozen } : c),
    };
    case "TOGGLE_PANIC": return { ...s, panicMode: !s.panicMode };
    case "SET_LIMIT": return { ...s, dailyLimit: a.limit };
    case "INC_STREAK": return { ...s, streakDays: s.streakDays + a.by };
    case "SET_TXN": return { ...s, selectedTxn: a.txn };
    case "TOAST": return { ...s, toast: a.msg };
    case "READ_NOTIFICATIONS": return { ...s, notifications: s.notifications.map((n) => ({ ...n, read: true })) };
  }
}

interface Ctx {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  toast: (msg: string) => void;
  go: (screen: ScreenKey) => void;
}
const StoreCtx = createContext<Ctx | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initial);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const toast = useCallback((msg: string) => {
    dispatch({ type: "TOAST", msg });
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => dispatch({ type: "TOAST", msg: null }), 3000);
  }, []);

  const go = useCallback((screen: ScreenKey) => dispatch({ type: "SET_SCREEN", screen }), []);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const value = useMemo(() => ({ state, dispatch, toast, go }), [state, toast, go]);
  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreCtx);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}

export function fmtMKD(n: number) {
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " ден";
}
export function fmtEUR(n: number) {
  return "≈ " + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " EUR";
}

export function getFirstName(name: string) {
  return name.trim().split(/\s+/)[0] ?? "";
}
export function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}