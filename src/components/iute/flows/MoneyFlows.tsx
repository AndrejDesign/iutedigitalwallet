import { useMemo, useState } from "react";
import {
  Building2, CreditCard as CCIcon, Users, Landmark, Search, Plus,
  Check, Link2, QrCode, MessageSquare, ChevronDown,
} from "lucide-react";
import { BottomSheet, PrimaryButton, SecondaryButton } from "../ui";
import { useStore, fmtMKD } from "../store";
import { CONTACTS, FX_LIST, FX_RATES, type FxCode, type Contact } from "../mockData";

/* -------------------------------------------------------------------------- */
/* ADD MONEY                                                                  */
/* -------------------------------------------------------------------------- */
const METHODS = [
  { id: "bank",   Icon: Building2, label: "Bank Transfer",     sub: "1–2 business days" },
  { id: "card",   Icon: CCIcon,    label: "Debit/Credit Card", sub: "Instant" },
  { id: "friend", Icon: Users,     label: "From a Friend",     sub: "Instant · Free" },
  { id: "agent",  Icon: Landmark,  label: "Agent / ATM",       sub: "Find nearest" },
];

export function AddMoneySheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { state, dispatch, toast } = useStore();
  const [method, setMethod] = useState<string | null>(null);
  const [amount, setAmount] = useState("");
  const [step, setStep] = useState<1 | 2 | 3>(1);

  function reset() { setMethod(null); setAmount(""); setStep(1); }
  function close() { onClose(); setTimeout(reset, 250); }

  const eur = ((+amount || 0) * FX_RATES.EUR).toFixed(2);
  const overCap = state.tier === 1 && (+amount + state.balanceMKD) > 15000;
  const methodLabel = METHODS.find((m) => m.id === method)?.label ?? "";

  return (
    <BottomSheet open={open} onClose={close} title="Add Money">
      <div className="space-y-4">
        {/* Stepper */}
        <div className="flex gap-1.5">
          {[1, 2, 3].map((n) => (
            <span key={n} className={`h-1 flex-1 rounded-full ${step >= n ? "bg-[var(--iute-red)]" : "bg-black/10"}`} />
          ))}
        </div>

        {step === 1 && (
          <>
            <p className="text-xs font-bold uppercase tracking-wide text-[var(--iute-text-soft)]">Choose Method</p>
            <div className="grid grid-cols-2 gap-3">
              {METHODS.map(({ id, Icon, label, sub }) => {
                const sel = method === id;
                return (
                  <button
                    key={id}
                    onClick={() => setMethod(id)}
                    className={`tap relative flex h-20 flex-col items-start justify-center rounded-2xl border-2 px-3 text-left transition-colors ${sel ? "border-[var(--iute-red)] bg-[var(--iute-red)]/5" : "border-transparent bg-[var(--iute-fog)]"}`}
                  >
                    <Icon size={20} className="text-[var(--iute-red)]" />
                    <p className="mt-1 text-[13px] font-extrabold text-[var(--iute-text)] leading-tight">{label}</p>
                    <p className="text-[10px] font-medium text-[var(--iute-text-soft)]">{sub}</p>
                    {sel && (
                      <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--iute-red)] text-white">
                        <Check size={12} strokeWidth={3} />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            <PrimaryButton disabled={!method} onClick={() => setStep(2)}>Continue</PrimaryButton>
          </>
        )}

        {step === 2 && (
          <>
            <p className="text-xs font-bold uppercase tracking-wide text-[var(--iute-text-soft)]">Enter Amount</p>
            <input
              autoFocus
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/[^\d.]/g, ""))}
              placeholder="0.00 ден"
              className="h-14 w-full rounded-3xl bg-[var(--iute-fog)] px-5 text-center font-mono text-2xl font-extrabold text-[var(--iute-text)] outline-none focus:ring-2 focus:ring-[var(--iute-red)]"
            />
            <div className="flex gap-2 overflow-x-auto pb-1">
              {[500, 1000, 2500, 5000].map((v) => (
                <button key={v} onClick={() => setAmount(String((+amount || 0) + v))} className="tap shrink-0 rounded-full bg-[var(--iute-cloud)] px-3 py-1.5 text-xs font-bold text-[var(--iute-text)]">
                  +{v.toLocaleString()}
                </button>
              ))}
            </div>
            <p className="text-center font-mono text-sm text-[var(--iute-text-soft)]">≈ {eur} EUR</p>
            {overCap && (
              <div className="rounded-2xl border border-amber-400/40 bg-amber-100 p-3 text-xs font-bold text-amber-900">
                ⚠️ Level 1 cap: 15,000 ден — Upgrade to Level 2 for higher limits.
              </div>
            )}
            <PrimaryButton disabled={!amount || +amount <= 0} onClick={() => setStep(3)}>Review</PrimaryButton>
          </>
        )}

        {step === 3 && (
          <>
            <div className="rounded-2xl bg-[var(--iute-parchment)] p-4">
              <p className="font-mono text-xs font-bold uppercase text-[var(--iute-merlot)]">Summary</p>
              <p className="mt-2 text-base font-extrabold text-[var(--iute-merlot)]">
                Adding: {fmtMKD(+amount)}
              </p>
              <p className="text-sm font-bold text-[var(--iute-merlot)]/80">via {methodLabel}</p>
              <p className="mt-3 font-mono text-sm font-bold text-[var(--iute-merlot)]">
                New balance: {fmtMKD(state.balanceMKD + +amount)}
              </p>
            </div>
            <PrimaryButton onClick={() => {
              dispatch({ type: "SET_BALANCE", balance: state.balanceMKD + +amount });
              toast(`✅ ${fmtMKD(+amount)} added to your wallet!`);
              close();
            }}>
              Confirm & Add Money
            </PrimaryButton>
            <SecondaryButton onClick={() => setStep(2)}>Back</SecondaryButton>
          </>
        )}
      </div>
    </BottomSheet>
  );
}

/* -------------------------------------------------------------------------- */
/* SEND MONEY                                                                 */
/* -------------------------------------------------------------------------- */
const SEND_CCY: FxCode[] = ["MKD", "EUR", "USD", "GBP"];

export function SendMoneySheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { dispatch, state, toast } = useStore();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [recipient, setRecipient] = useState<Contact | null>(null);
  const [q, setQ] = useState("");
  const [ccy, setCcy] = useState<FxCode>("MKD");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

  function reset() { setStep(1); setRecipient(null); setQ(""); setCcy("MKD"); setAmount(""); setNote(""); }
  function close() { onClose(); setTimeout(reset, 250); }

  const filtered = CONTACTS.filter((c) => !q || c.name.toLowerCase().includes(q.toLowerCase()) || c.phone.includes(q));
  const eqMKD = useMemo(() => ccy === "MKD" ? +amount : (+amount / FX_RATES[ccy]), [ccy, amount]);

  return (
    <BottomSheet open={open} onClose={close} title="Send Money">
      {step === 1 && (
        <div className="space-y-4">
          <div className="flex h-12 items-center gap-2 rounded-2xl bg-[var(--iute-fog)] px-4">
            <Search size={18} className="text-[var(--iute-text-soft)]" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name or phone..." className="flex-1 bg-transparent text-sm font-bold text-[var(--iute-text)] outline-none" />
          </div>
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-wide text-[var(--iute-text-soft)]">Recent Contacts</p>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {filtered.map((c) => (
                <button key={c.id} onClick={() => { setRecipient(c); setStep(2); }} className="tap flex w-16 shrink-0 flex-col items-center gap-1.5">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full text-white text-sm font-extrabold" style={{ background: c.color }}>
                    {c.name.split(" ").map((p) => p[0]).join("").slice(0, 2)}
                  </span>
                  <span className="text-[11px] font-bold text-[var(--iute-text)] text-center leading-tight">{c.name}</span>
                </button>
              ))}
            </div>
          </div>
          <button onClick={() => toast("New recipient flow coming…")} className="tap flex w-full items-center gap-2 rounded-2xl bg-[var(--iute-fog)] p-3 text-sm font-bold text-[var(--iute-red)]">
            <Plus size={18} /> Add New Recipient
          </button>
        </div>
      )}

      {step === 2 && recipient && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 rounded-2xl bg-[var(--iute-fog)] p-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-full text-white text-sm font-extrabold" style={{ background: recipient.color }}>
              {recipient.name.split(" ").map((p) => p[0]).join("").slice(0, 2)}
            </span>
            <div className="flex-1">
              <p className="text-sm font-extrabold text-[var(--iute-text)]">{recipient.name}</p>
              <p className="text-xs font-bold text-[var(--iute-text-soft)]">{recipient.phone}</p>
            </div>
            <button onClick={() => setStep(1)} className="tap text-xs font-bold text-[var(--iute-red)]">Change</button>
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {SEND_CCY.map((c) => (
              <button key={c} onClick={() => setCcy(c)} className={`tap shrink-0 rounded-full px-4 py-2 text-xs font-bold ${ccy === c ? "bg-[var(--iute-red)] text-white" : "bg-[var(--iute-fog)] text-[var(--iute-text)]"}`}>
                {c} {c === "MKD" ? "ден" : c === "EUR" ? "€" : c === "USD" ? "$" : "£"}
              </button>
            ))}
          </div>
          <input
            autoFocus
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(e.target.value.replace(/[^\d.]/g, ""))}
            placeholder="0.00"
            className="h-14 w-full rounded-3xl bg-[var(--iute-fog)] px-5 text-center font-mono text-2xl font-extrabold text-[var(--iute-text)] outline-none focus:ring-2 focus:ring-[var(--iute-red)]"
          />
          {ccy !== "MKD" && amount && (
            <p className="text-center font-mono text-sm text-[var(--iute-text-soft)]">≈ {eqMKD.toLocaleString("en-US", { maximumFractionDigits: 2 })} ден</p>
          )}
          <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add a note..." className="h-10 w-full rounded-2xl bg-[var(--iute-fog)] px-4 text-sm font-bold text-[var(--iute-text)] outline-none focus:ring-2 focus:ring-[var(--iute-red)]" />
          <PrimaryButton disabled={!amount || +amount <= 0} onClick={() => setStep(3)}>Review</PrimaryButton>
        </div>
      )}

      {step === 3 && recipient && (
        <div className="space-y-4">
          <div className="rounded-2xl bg-[var(--iute-parchment)] p-4 space-y-2">
            <Row k="To" v={recipient.name} />
            <Row k="Amount" v={`${(+amount).toLocaleString("en-US", { minimumFractionDigits: 2 })} ${ccy}`} />
            <Row k="Method" v="iute P2P · Free" />
            <Row k="Arrival" v="Instant" />
            {note && <Row k="Note" v={note} />}
          </div>
          <PrimaryButton onClick={() => {
            const debitMKD = Math.round(ccy === "MKD" ? +amount : (+amount / FX_RATES[ccy]));
            dispatch({ type: "SET_BALANCE", balance: Math.max(0, state.balanceMKD - debitMKD) });
            setStep(4);
            setTimeout(() => { close(); toast(`✓ Sent ${amount} ${ccy} to ${recipient.name}`); }, 2400);
          }}>
            Send {amount} {ccy}
          </PrimaryButton>
          <SecondaryButton onClick={() => setStep(2)}>Back</SecondaryButton>
        </div>
      )}

      {step === 4 && recipient && (
        <div className="flex flex-col items-center justify-center py-10">
          <span className="spring-in flex h-24 w-24 items-center justify-center rounded-full bg-emerald-500 text-white">
            <Check size={56} strokeWidth={3} />
          </span>
          <p className="mt-6 text-3xl font-extrabold text-[var(--iute-text)]">Sent!</p>
          <p className="mt-2 font-mono text-base font-bold text-[var(--iute-text)]">{amount} {ccy}</p>
          <p className="mt-1 text-sm font-medium text-[var(--iute-text-soft)]">to {recipient.name}</p>
        </div>
      )}
    </BottomSheet>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="font-bold text-[var(--iute-merlot)]/70">{k}</span>
      <span className="font-extrabold text-[var(--iute-merlot)]">{v}</span>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* REQUEST MONEY                                                              */
/* -------------------------------------------------------------------------- */
export function RequestMoneySheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { toast } = useStore();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [recipient, setRecipient] = useState<Contact | null>(null);
  const [ccy, setCcy] = useState<FxCode>("MKD");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [delivery, setDelivery] = useState<"sms" | "qr" | null>(null);

  function reset() { setStep(1); setRecipient(null); setCcy("MKD"); setAmount(""); setNote(""); setDelivery(null); }
  function close() { onClose(); setTimeout(reset, 250); }

  return (
    <BottomSheet open={open} onClose={close} title="Request Money">
      {step === 1 && (
        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-wide text-[var(--iute-text-soft)]">Request from</p>
          <div className="grid grid-cols-3 gap-3">
            {CONTACTS.map((c) => (
              <button key={c.id} onClick={() => { setRecipient(c); setStep(2); }} className="tap flex flex-col items-center gap-1.5">
                <span className="flex h-14 w-14 items-center justify-center rounded-full text-white text-sm font-extrabold" style={{ background: c.color }}>
                  {c.name.split(" ").map((p) => p[0]).join("").slice(0, 2)}
                </span>
                <span className="text-[11px] font-bold text-[var(--iute-text)]">{c.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && recipient && (
        <div className="space-y-4">
          <p className="text-sm font-bold text-[var(--iute-text)]">Requesting from <span className="text-[var(--iute-red)]">{recipient.name}</span></p>
          <div className="flex gap-2 overflow-x-auto">
            {SEND_CCY.map((c) => (
              <button key={c} onClick={() => setCcy(c)} className={`tap shrink-0 rounded-full px-4 py-2 text-xs font-bold ${ccy === c ? "bg-[var(--iute-red)] text-white" : "bg-[var(--iute-fog)] text-[var(--iute-text)]"}`}>
                {c}
              </button>
            ))}
          </div>
          <input autoFocus inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value.replace(/[^\d.]/g, ""))} placeholder="0.00" className="h-14 w-full rounded-3xl bg-[var(--iute-fog)] px-5 text-center font-mono text-2xl font-extrabold text-[var(--iute-text)] outline-none focus:ring-2 focus:ring-[var(--iute-red)]" />
          <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="What's it for?" className="h-10 w-full rounded-2xl bg-[var(--iute-fog)] px-4 text-sm font-bold text-[var(--iute-text)] outline-none focus:ring-2 focus:ring-[var(--iute-red)]" />
          <PrimaryButton disabled={!amount || +amount <= 0} onClick={() => setStep(3)}>Choose Delivery</PrimaryButton>
        </div>
      )}

      {step === 3 && recipient && (
        <div className="space-y-4">
          <p className="text-xs font-bold uppercase tracking-wide text-[var(--iute-text-soft)]">Send via</p>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => setDelivery("sms")} className={`tap flex h-24 flex-col items-center justify-center gap-2 rounded-2xl border-2 ${delivery === "sms" ? "border-[var(--iute-red)] bg-[var(--iute-red)]/5" : "border-transparent bg-[var(--iute-fog)]"}`}>
              <MessageSquare size={22} className="text-[var(--iute-red)]" />
              <span className="text-xs font-extrabold text-[var(--iute-text)]">Send Link via SMS</span>
            </button>
            <button onClick={() => setDelivery("qr")} className={`tap flex h-24 flex-col items-center justify-center gap-2 rounded-2xl border-2 ${delivery === "qr" ? "border-[var(--iute-red)] bg-[var(--iute-red)]/5" : "border-transparent bg-[var(--iute-fog)]"}`}>
              <QrCode size={22} className="text-[var(--iute-red)]" />
              <span className="text-xs font-extrabold text-[var(--iute-text)]">Share QR Code</span>
            </button>
          </div>
          {delivery === "qr" && (
            <div className="flex flex-col items-center gap-2 rounded-2xl bg-[var(--iute-fog)] p-4">
              <div className="grid grid-cols-8 gap-0.5">
                {Array.from({ length: 64 }).map((_, i) => (
                  <span key={i} className="h-3 w-3 rounded-[1px]" style={{ background: Math.random() > 0.5 ? "#2D2D2D" : "transparent" }} />
                ))}
              </div>
              <p className="font-mono text-[10px] font-bold text-[var(--iute-text-soft)]">Scan with iute Pay</p>
            </div>
          )}
          <PrimaryButton disabled={!delivery} onClick={() => {
            close(); toast(`✓ Request sent to ${recipient.name}!`);
          }}>
            <span className="inline-flex items-center gap-2"><Link2 size={16} /> Send Request</span>
          </PrimaryButton>
        </div>
      )}
    </BottomSheet>
  );
}

/* -------------------------------------------------------------------------- */
/* FX HUB SHEETS                                                              */
/* -------------------------------------------------------------------------- */
export function FxRatesSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <BottomSheet open={open} onClose={onClose} title="All FX Rates">
      <div className="space-y-1">
        <div className="flex items-center gap-3 px-2 pb-2 text-[10px] font-bold uppercase text-[var(--iute-text-soft)]">
          <span className="w-10">Flag</span>
          <span className="flex-1">Currency</span>
          <span className="w-20 text-right">Buy</span>
          <span className="w-20 text-right">Sell</span>
        </div>
        {FX_LIST.map((c) => {
          const buy = c.code === "MKD" ? 1 : 1 / FX_RATES[c.code];
          const sell = buy * 0.985;
          return (
            <div key={c.code} className="flex items-center gap-3 rounded-2xl bg-[var(--iute-fog)] p-3">
              <span className="text-2xl w-10">{c.flag}</span>
              <div className="flex-1">
                <p className="text-sm font-extrabold text-[var(--iute-text)]">{c.code}</p>
                <p className="text-[11px] font-medium text-[var(--iute-text-soft)]">{c.name}</p>
              </div>
              <span className="w-20 text-right font-mono text-xs font-bold text-emerald-600">{buy.toFixed(4)}</span>
              <span className="w-20 text-right font-mono text-xs font-bold text-[var(--iute-red)]">{sell.toFixed(4)}</span>
            </div>
          );
        })}
      </div>
    </BottomSheet>
  );
}

export function FxOneTapSheet({ open, onClose, contact }: { open: boolean; onClose: () => void; contact: Contact | null }) {
  const { toast, dispatch, state } = useStore();
  const [amount, setAmount] = useState("1200");
  if (!contact) return null;
  const converted = (+amount * FX_RATES[contact.currency]).toFixed(2);
  return (
    <BottomSheet open={open} onClose={onClose} title={`Send to ${contact.name}`}>
      <div className="space-y-4">
        <div className="flex items-center gap-3 rounded-2xl bg-[var(--iute-fog)] p-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-full text-white text-sm font-extrabold" style={{ background: contact.color }}>
            {contact.name.split(" ").map((p) => p[0]).join("").slice(0, 2)}
          </span>
          <div className="flex-1">
            <p className="text-sm font-extrabold text-[var(--iute-text)]">Sending to {contact.name}</p>
            <p className="text-xs font-bold text-[var(--iute-text-soft)]">in {contact.flag} {contact.currency}</p>
          </div>
        </div>
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-[var(--iute-text-soft)]">You send (MKD)</p>
          <input autoFocus inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value.replace(/[^\d.]/g, ""))} className="h-14 w-full rounded-3xl bg-[var(--iute-fog)] px-5 text-center font-mono text-2xl font-extrabold text-[var(--iute-text)] outline-none focus:ring-2 focus:ring-[var(--iute-red)]" />
        </div>
        <div className="rounded-2xl bg-[var(--iute-parchment)] p-4 text-center">
          <p className="text-xs font-bold uppercase text-[var(--iute-merlot)]/70">They receive</p>
          <p className="mt-1 font-mono text-2xl font-extrabold text-[var(--iute-merlot)]">= {converted} {contact.currency}</p>
        </div>
        <PrimaryButton onClick={() => {
          dispatch({ type: "SET_BALANCE", balance: Math.max(0, state.balanceMKD - +amount) });
          onClose();
          toast(`✓ Sent ${converted} ${contact.currency} to ${contact.name}`);
        }}>
          Send Now
        </PrimaryButton>
      </div>
    </BottomSheet>
  );
}

/* -------------------------------------------------------------------------- */
/* CONVERT CONFIRM (used by FX Hub Convert mode)                              */
/* -------------------------------------------------------------------------- */
export function ConvertConfirmSheet({
  open, onClose, from, to, fromAmt, toAmt,
}: { open: boolean; onClose: () => void; from: FxCode; to: FxCode; fromAmt: string; toAmt: string }) {
  const { toast } = useStore();
  return (
    <BottomSheet open={open} onClose={onClose} title="Confirm Conversion">
      <div className="space-y-4">
        <div className="rounded-2xl bg-[var(--iute-parchment)] p-4 space-y-2">
          <Row k="From" v={`${fromAmt} ${from}`} />
          <Row k="To" v={`${toAmt} ${to}`} />
          <Row k="Rate" v={`1 ${from} = ${((FX_RATES[to] || 1) / (FX_RATES[from] || 1)).toFixed(5)} ${to}`} />
          <Row k="Fee" v="Free" />
        </div>
        <PrimaryButton onClick={() => { onClose(); toast(`✓ Converted ${fromAmt} ${from} → ${toAmt} ${to}`); }}>
          Confirm Conversion
        </PrimaryButton>
      </div>
    </BottomSheet>
  );
}

/* Dropdown helper for currency pickers */
export function CurrencyPicker({ value, onChange }: { value: FxCode; onChange: (c: FxCode) => void }) {
  const [open, setOpen] = useState(false);
  const cur = FX_LIST.find((f) => f.code === value)!;
  return (
    <div className="relative">
      <button onClick={() => setOpen((o) => !o)} className="tap flex h-12 items-center gap-1.5 rounded-2xl bg-[var(--iute-surface)] px-3 ring-1 ring-[var(--iute-divider)]">
        <span className="text-lg">{cur.flag}</span>
        <span className="text-sm font-extrabold text-[var(--iute-text)]">{cur.code}</span>
        <ChevronDown size={16} className="text-[var(--iute-text-soft)]" />
      </button>
      {open && (
        <div className="absolute left-0 top-14 z-10 w-44 rounded-2xl bg-[var(--iute-surface)] p-1.5 shadow-2xl ring-1 ring-[var(--iute-divider)]">
          {FX_LIST.map((f) => (
            <button key={f.code} onClick={() => { onChange(f.code); setOpen(false); }} className={`tap flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-bold ${f.code === value ? "bg-[var(--iute-fog)] text-[var(--iute-red)]" : "text-[var(--iute-text)] hover:bg-[var(--iute-fog)]"}`}>
              <span>{f.flag}</span>
              <span className="flex-1">{f.code}</span>
              <span className="text-[10px] font-medium text-[var(--iute-text-soft)]">{f.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}