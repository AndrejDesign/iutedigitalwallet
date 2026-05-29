import type { Txn } from "./types";

export const TRANSACTIONS: Txn[] = [
  { id: "TXN-98421064-MKD", name: "Marko Kostovski", category: "P2P Social Split", amount: -350, day: "TODAY", when: "14:32", method: "P2P Social Split", squad: true },
  { id: "TXN-98421063-MKD", name: "Salary Top-Up", category: "Incoming", amount: 15000, day: "TODAY", when: "09:01", method: "Top-Up" },
  { id: "TXN-98421062-MKD", name: "Skopje Coffee Lab", category: "BNPL", amount: -420, day: "YESTERDAY", when: "18:24", method: "BNPL" },
  { id: "TXN-98421061-MKD", name: "Sara Petrovska", category: "P2P Transfer", amount: -800, day: "YESTERDAY", when: "12:10", method: "P2P Social Split", squad: true },
  { id: "TXN-98421060-MKD", name: "MKD → EUR Swap", category: "Swap", amount: -1230, day: "YESTERDAY", when: "10:02", method: "Swap" },
  { id: "TXN-98421059-MKD", name: "Tinex Supermarket", category: "Card Payment", amount: -1845, day: "MON 26 MAY", when: "19:44", method: "Card" },
  { id: "TXN-98421058-MKD", name: "Bojan Trajkov", category: "Squad Split", amount: -240, day: "MON 26 MAY", when: "13:15", method: "P2P Social Split", squad: true },
  { id: "TXN-98421057-MKD", name: "Spotify", category: "Card Payment", amount: -329, day: "MON 26 MAY", when: "08:00", method: "Card" },
  { id: "TXN-98421056-MKD", name: "Elena Ristova", category: "Received", amount: 600, day: "MON 26 MAY", when: "07:32", method: "P2P Social Split" },
  { id: "TXN-98421055-MKD", name: "Public Transport", category: "QR Payment", amount: -50, day: "SUN 25 MAY", when: "21:11", method: "QR Payment" },
  { id: "TXN-98421054-MKD", name: "Skopje City Mall", category: "BNPL", amount: -2450, day: "SUN 25 MAY", when: "17:50", method: "BNPL" },
  { id: "TXN-98421053-MKD", name: "Wolt Delivery", category: "QR Payment", amount: -560, day: "SUN 25 MAY", when: "13:09", method: "QR Payment" },
  { id: "TXN-98421052-MKD", name: "Marko Kostovski", category: "Squad Split", amount: -180, day: "SUN 25 MAY", when: "11:00", method: "P2P Social Split", squad: true },
  { id: "TXN-98421051-MKD", name: "Top-Up via Card", category: "Top-Up", amount: 5000, day: "SAT 24 MAY", when: "20:00", method: "Top-Up" },
  { id: "TXN-98421050-MKD", name: "Kino Frosina", category: "QR Payment", amount: -220, day: "SAT 24 MAY", when: "19:30", method: "QR Payment" },
];

export const LEADERBOARD = [
  { rank: 1, name: "Marko K.", days: 12, color: "#D8252C" },
  { rank: 2, name: "Sara P.", days: 9, color: "#5A0917" },
  { rank: 3, name: "Anja A. (you)", days: 7, color: "#2D2D2D" },
  { rank: 4, name: "Bojan T.", days: 5, color: "#FBF1E4" },
  { rank: 5, name: "Elena R.", days: 3, color: "#EBF3FF" },
];

export const CHALLENGES = [
  "🔥 Buddy Challenge: Split 3 coffees this weekend → 15% cashback!",
  "💸 Refer a friend → Earn 500 iutePlus pts each!",
  "🏆 Top splitter this week gets double cashback!",
];

export interface Contact { id: string; name: string; phone: string; color: string; flag: string; currency: "MKD" | "EUR" | "USD" | "GBP" | "CHF" }
export const CONTACTS: Contact[] = [
  { id: "marko",  name: "Marko K.", phone: "+389 71 234 100", color: "#D8252C", flag: "🇲🇰", currency: "MKD" },
  { id: "sara",   name: "Sara P.",  phone: "+49 151 22456",   color: "#5A0917", flag: "🇩🇪", currency: "EUR" },
  { id: "bojan",  name: "Bojan T.", phone: "+44 7700 900123", color: "#2D2D2D", flag: "🇬🇧", currency: "GBP" },
  { id: "elena",  name: "Elena R.", phone: "+41 79 555 7788", color: "#0d6e6e", flag: "🇨🇭", currency: "CHF" },
  { id: "ana",    name: "Ana V.",   phone: "+1 415 555 0199", color: "#346751", flag: "🇺🇸", currency: "USD" },
];

export type FxCode = "MKD" | "EUR" | "USD" | "GBP" | "CHF" | "TRY" | "AUD";
export const FX_LIST: { code: FxCode; flag: string; name: string }[] = [
  { code: "MKD", flag: "🇲🇰", name: "Macedonian Denar" },
  { code: "EUR", flag: "🇪🇺", name: "Euro" },
  { code: "USD", flag: "🇺🇸", name: "US Dollar" },
  { code: "GBP", flag: "🇬🇧", name: "British Pound" },
  { code: "CHF", flag: "🇨🇭", name: "Swiss Franc" },
  { code: "TRY", flag: "🇹🇷", name: "Turkish Lira" },
  { code: "AUD", flag: "🇦🇺", name: "Australian Dollar" },
];
// rates expressed as "1 MKD = X <code>"
export const FX_RATES: Record<FxCode, number> = {
  MKD: 1,
  EUR: 0.01625,
  USD: 0.01768,
  GBP: 0.01394,
  CHF: 0.00143,
  TRY: 0.56200,
  AUD: 0.02740,
};

export const CARD_INSIGHTS = [
  { title: "iute Insight", body: "You spend 34% more on weekends. Setting a weekend daily limit of 2,000 ден could save you ≈1,400 ден/month.", cta: "Set Weekend Limit" },
  { title: "iute Insight", body: "You haven't used this card in 7 days. Freeze it to stay safe?", cta: "Freeze Card" },
  { title: "iute Insight", body: "You're 1,200 ден away from unlocking 7% cashback tier this month.", cta: "View Tiers" },
];

export const CARD_CATEGORIES = [
  { icon: "🛒", label: "Shopping",      amount: 4200, color: "#FF6A00", badge: "🔥 Splurging" }, // EVN orange
  { icon: "☕", label: "Food & Drink",  amount: 3100, color: "#E63946" },                          // Makpetrol coral
  { icon: "🎵", label: "Entertainment", amount: 1450, color: "#0066B3" },                          // Telekom blue
  { icon: "💳", label: "Transfers",     amount:  980, color: "#22B8CF", badge: "💸 Minimal" },     // Vodovod cyan
];

export const PARTNER_VOUCHERS = [
  { id: "espresso", name: "Free Espresso", partner: "Skopje Coffee Lab", cost: 300, emoji: "☕" },
  { id: "cinema",   name: "Cinema Ticket", partner: "Kino Frosina",     cost: 800, emoji: "🎬" },
  { id: "wolt",     name: "200 ден Wolt Credit", partner: "Wolt",       cost: 500, emoji: "🛵" },
  { id: "tinex",    name: "5% Off Groceries", partner: "Tinex",         cost: 400, emoji: "🛒" },
  { id: "spotify",  name: "1 Month Spotify",    partner: "Spotify",     cost: 1200, emoji: "🎵" },
];