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
import type { AppState, ScreenKey, Tier, Txn } from "./types";

type Action =
  | { type: "SET_SCREEN"; screen: ScreenKey }
  | { type: "TOGGLE_DARK" }
  | { type: "SET_TIER"; tier: Tier }
  | { type: "SET_BALANCE"; balance: number }
  | { type: "SET_RATE"; rate: number }
  | { type: "SET_POINTS"; points: number }
  | { type: "TOGGLE_FREEZE"; value?: boolean }
  | { type: "TOGGLE_PANIC" }
  | { type: "SET_LIMIT"; limit: number }
  | { type: "INC_STREAK"; by: number }
  | { type: "SET_TXN"; txn: Txn | null }
  | { type: "TOAST"; msg: string | null };

const initial: AppState = {
  dark: false,
  screen: "splash",
  tier: 1,
  balanceMKD: 8450,
  rate: 61.5,
  iutePoints: 1450,
  cardFrozen: false,
  panicMode: true,
  dailyLimit: 15000,
  streakDays: 7,
  selectedTxn: null,
  toast: null,
};

function reducer(s: AppState, a: Action): AppState {
  switch (a.type) {
    case "SET_SCREEN": return { ...s, screen: a.screen };
    case "TOGGLE_DARK": return { ...s, dark: !s.dark };
    case "SET_TIER": return { ...s, tier: a.tier };
    case "SET_BALANCE": return { ...s, balanceMKD: a.balance };
    case "SET_RATE": return { ...s, rate: a.rate };
    case "SET_POINTS": return { ...s, iutePoints: a.points };
    case "TOGGLE_FREEZE": return { ...s, cardFrozen: a.value ?? !s.cardFrozen };
    case "TOGGLE_PANIC": return { ...s, panicMode: !s.panicMode };
    case "SET_LIMIT": return { ...s, dailyLimit: a.limit };
    case "INC_STREAK": return { ...s, streakDays: s.streakDays + a.by };
    case "SET_TXN": return { ...s, selectedTxn: a.txn };
    case "TOAST": return { ...s, toast: a.msg };
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