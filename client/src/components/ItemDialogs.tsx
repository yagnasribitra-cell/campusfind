import { useState } from "react";
import { BadgeCheck, CalendarDays, CheckCircle2, MapPin, MessageCircle, Send } from "lucide-react";
import { toast } from "sonner";
import { AppDialog } from "./AppDialog";
import { formatCampusDate } from "./ItemCard";
import type { CampusItem } from "../lib/campusfind-types";

export function ItemDetailsDialog({ item, onClose, onContact }: { item: CampusItem | null; onClose: () => void; onContact: (item: CampusItem) => void }) {
  if (!item) return null;
  return (
    <AppDialog open={!!item} onClose={onClose} title={item.name} eyebrow={`${item.status === "lost" ? "LOST ITEM" : "FOUND ITEM"} · ${item.category}`}>
      <div className="cf-detail-block">
        <p>{item.description}</p>
        <div className="cf-detail-pills"><span><MapPin size={14} />{item.location}</span><span><CalendarDays size={14} />{formatCampusDate(item.date)} · {item.time}</span></div>
        <div className="cf-detail-reporter"><i>{item.initials}</i><span>Posted by <strong>{item.reporter}</strong></span></div>
        <button className="cf-button cf-button-primary cf-button-wide" onClick={() => onContact(item)}><MessageCircle size={16} />Contact {item.status === "found" ? "finder" : "owner"}</button>
      </div>
    </AppDialog>
  );
}

export function ContactDialog({ item, onClose }: { item: CampusItem | null; onClose: () => void }) {
  const [message, setMessage] = useState("");
  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    toast.success("Message ready", { description: "Campus messaging will be connected in a future backend." });
    setMessage("");
    onClose();
  };
  return (
    <AppDialog open={!!item} onClose={onClose} title={item ? `Contact ${item.reporter.split(" ")[0]}` : "Contact"} eyebrow="IN-APP DEMO MESSAGE">
      <form className="cf-contact-form" onSubmit={submit}>
        {item && <p className="cf-dialog-subcopy">Ask a quick question about <strong>{item.name}</strong>. This preview does not send a real message.</p>}
        <label className="cf-field">Your message<textarea required minLength={8} maxLength={320} rows={4} value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Hi, I think this might be mine. Could you tell me…" /></label>
        <button type="submit" className="cf-button cf-button-primary cf-button-wide"><Send size={15} />Prepare message</button>
      </form>
    </AppDialog>
  );
}

export function ClaimDialog({ open, onClose, onConfirm, itemName }: { open: boolean; onClose: () => void; onConfirm: () => void; itemName: string }) {
  const [verified, setVerified] = useState(false);
  const close = () => { setVerified(false); onClose(); };
  const confirm = () => {
    if (!verified) return;
    onConfirm();
    toast.success("Great news — claim noted", { description: "Coordinate with the finder to verify and reunite the item." });
    close();
  };
  return (
    <AppDialog open={open} onClose={close} title="Before you claim it…" eyebrow="QUICK CHECK">
      <div className="cf-claim-content">
        <div className="cf-claim-icon"><BadgeCheck size={22} /></div>
        <p>Take a moment to verify <strong>{itemName}</strong> using its color, details, or contents. This keeps the hand-off safe and helps the right item get home.</p>
        <label className="cf-check-row"><input type="checkbox" checked={verified} onChange={(event) => setVerified(event.target.checked)} /><span>I can verify this item is mine.</span></label>
        <div className="cf-dialog-actions"><button className="cf-button cf-button-outline" onClick={close}>Not yet</button><button className="cf-button cf-button-primary" disabled={!verified} onClick={confirm}><CheckCircle2 size={15} />Confirm claim</button></div>
      </div>
    </AppDialog>
  );
}
