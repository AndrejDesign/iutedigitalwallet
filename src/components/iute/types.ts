export type ScreenKey =
  | "splash"
  | "onboarding"
  | "register"
  | "home"
  | "squad"
  | "scan"
  | "cards"
  | "account"
  | "history"
  | "txdetail";

export type Tier = 1 | 2;

export interface Txn {
  id: string;
  name: string;
  category: string;
  amount: number; // negative = sent
  day: string; // header bucket
  when: string; // human time
  method: "P2P Social Split" | "QR Payment" | "BNPL" | "Top-Up" | "Swap" | "Card";
  squad?: boolean;
}

export interface AppState {
  screen: ScreenKey;
  tier: Tier;
  userName: string;
  balanceMKD: number;
  rate: number; // EUR per MKD denominator (MKD per 1 EUR)
  iutePoints: number;
  cardFrozen: boolean;
  panicMode: boolean;
  dailyLimit: number;
  streakDays: number;
  selectedTxn: Txn | null;
  toast: string | null;
  notifications: Notification[];
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  when: string;
  icon: "money" | "card" | "squad" | "promo" | "alert";
  read: boolean;
}