import { useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, BadgeCheck, CalendarDays, Check, CheckCircle2, ChevronRight, Clock3, ImagePlus, MapPin, PackagePlus, Search, Sparkles, Upload, X } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";
import { MatchCard } from "../components/MatchCard";
import { ClaimDialog, ContactDialog } from "../components/ItemDialogs";
import { formatCampusDate } from "../components/ItemCard";
import { CATEGORIES, LOCATIONS, type CampusItem, type ItemStatus } from "../lib/campusfind-types";
import { useCampusStore } from "../lib/campusfind-store";
import { findMatches } from "../lib/campusfind-matching";

const STEPS = ["What happened?", "Item Information", "Where & When?", "Submit"];

function initialStatus(): ItemStatus | null {
  if (typeof window === "undefined") return null;
  const value = new URLSearchParams(window.location.search).get("type");
  return value === "lost" || value === "found" ? value : null;
}

async function compressImage(file: File) {
  if (!file.type.startsWith("image/")) throw new Error("Choose an image file.");
  if (file.size > 10 * 1024 * 1024) throw new Error("Choose an image smaller than 10 MB.");
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 720 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Image preview is unavailable in this browser.");
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return canvas.toDataURL("image/jpeg", 0.74);
}

export default function ReportItem() {
  const { items, addItem, markItemResolved } = useCampusStore();
  const fileInput = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState<ItemStatus | null>(initialStatus);
  const [name, setName] = useState("");
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("Electronics");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("");
  const [location, setLocation] = useState<(typeof LOCATIONS)[number]>("Library");
  const [date, setDate] = useState("2026-10-04");
  const [time, setTime] = useState("");
  const [photo, setPhoto] = useState<string | undefined>();
  const [imageName, setImageName] = useState("");
  const [imageLoading, setImageLoading] = useState(false);
  const [postedItem, setPostedItem] = useState<CampusItem | null>(null);
  const [contact, setContact] = useState<CampusItem | null>(null);
  const [claim, setClaim] = useState<{ own: CampusItem; candidate: CampusItem } | null>(null);

  const matches = useMemo(() => postedItem ? findMatches(postedItem, items, { limit: 3 }) : [], [postedItem, items]);
  const canContinue = () => {
    if (step === 1 && !status) { toast.error("Choose whether you lost or found something."); return false; }
    if (step === 2 && (!name.trim() || !description.trim())) { toast.error("Add an item name and a short description."); return false; }
    if (step === 3 && (!location || !date || !time)) { toast.error("Add the location, date, and approximate time."); return false; }
    return true;
  };
  const handleFile = async (file?: File) => {
    if (!file) return;
    setImageLoading(true);
    try {
      const compressed = await compressImage(file);
      setPhoto(compressed);
      setImageName(file.name);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not preview this image.");
    } finally {
      setImageLoading(false);
    }
  };
  const publish = () => {
    if (!status) return;
    const item: CampusItem = {
      id: `report-${typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : Date.now()}`,
      name: name.trim(), category, description: description.trim(), status, location, date, time,
      color: color.trim() || "Not specified", reporter: "Alex Morgan", initials: "AM", photo,
      postedAt: new Date().toISOString(),
    };
    addItem(item);
    setPostedItem(item);
    toast.success("Item posted successfully", { description: "CampusFind is checking for a match." });
  };
  const handleClaim = () => {
    if (!claim) return;
    markItemResolved(claim.own.id);
    markItemResolved(claim.candidate.id);
    setClaim(null);
    toast.success("Claim noted", { description: "Reach out to the finder or owner to verify and reunite the item." });
  };

  if (postedItem) {
    return (
      <div className="cf-page-stack cf-report-page">
        <section className="cf-success-panel"><div className="cf-success-orbit"><CheckCircle2 size={33} /></div><div className="cf-section-kicker">A LITTLE RELIEF GOES A LONG WAY</div><h1>Item Posted <em>Successfully!</em></h1><p>Don't worry — we'll automatically look for matching posts.</p><div className="cf-success-item"><span className={`cf-item-thumb cf-thumb-${postedItem.category.toLowerCase().replace(/[^a-z]+/g, "-")}`}>{photo ? <img src={photo} alt="" /> : <PackagePlus size={24} />}</span><span><strong>{postedItem.name}</strong><small>{postedItem.status === "lost" ? "Lost" : "Found"} · {postedItem.category} · {postedItem.location} · {formatCampusDate(postedItem.date)}</small></span><span className="cf-posted-check"><Check size={15} /></span></div></section>
        {matches.length > 0 ? <section className="cf-ranked-matches"><div className="cf-section-header"><div><div className="cf-section-kicker">WE CHECKED CATEGORY, LOCATION & DATE</div><h2>We found {matches.length} possible match{matches.length === 1 ? "" : "es"}!</h2><p>Here are the closest posts, ranked by the clues you shared.</p></div><Link className="cf-text-link" href="/matches">Open all matches <ArrowRight size={15} /></Link></div><div className="cf-match-list">{matches.map((match, index) => <MatchCard key={match.item.id} source={postedItem} match={match} onContact={setContact} onClaim={(own, candidate) => setClaim({ own, candidate })} featured={index === 0} />)}</div></section> : <section className="cf-no-match-followup"><div><Sparkles size={18} /><span><strong>No close match in the sample posts yet.</strong><small>Your report is saved in this browser. We’ll keep checking as more posts appear.</small></span></div><Link className="cf-button cf-button-outline" href="/dashboard">Back to dashboard</Link></section>}
        <ContactDialog item={contact} onClose={() => setContact(null)} />
        <ClaimDialog open={!!claim} itemName={claim?.candidate.name ?? "this item"} onClose={() => setClaim(null)} onConfirm={handleClaim} />
      </div>
    );
  }

  return (
    <div className="cf-page-stack cf-report-page">
      <section className="cf-welcome-row"><div><div className="cf-eyebrow">A FEW DETAILS CAN BRING IT HOME <span className="cf-eyebrow-spark">✳</span></div><h1>Report an item<span className="cf-heading-dot">.</span></h1><p>It only takes a minute — we’ll watch for the right match.</p></div><Link className="cf-back-link" href="/dashboard"><ArrowLeft size={15} />Back to dashboard</Link></section>
      <section className="cf-report-layout">
        <aside className="cf-report-steps"><p className="cf-section-kicker">YOUR QUICK REPORT</p>{STEPS.map((label, index) => { const n = index + 1; const done = step > n; return <div className={`cf-report-step ${step === n ? "is-current" : ""} ${done ? "is-done" : ""}`} key={label}><span>{done ? <Check size={15} /> : `0${n}`}</span><div><strong>{label}</strong>{n === 1 && <small>Lost or found</small>}{n === 2 && <small>Tell us what it is</small>}{n === 3 && <small>Add campus clues</small>}{n === 4 && <small>Review & post</small>}</div></div>; })}<div className="cf-report-aside-tip"><span><Sparkles size={15} /></span><strong>Little details help</strong><small>Category, location, and date are the clues our matcher looks at first.</small></div></aside>
        <div className="cf-report-form-panel">
          <div className="cf-form-step-heading"><span>STEP 0{step} <i>OF 04</i></span><div className="cf-form-progress"><i style={{ width: `${step * 25}%` }} /></div><h2>{STEPS[step - 1]}</h2><p>{step === 1 ? "Start with the basics. What happened?" : step === 2 ? "A few details make a better match." : step === 3 ? "Where and when did it happen?" : "Take one last look before it goes live."}</p></div>
          {step === 1 && <div className="cf-status-options" role="radiogroup" aria-label="Did you lose or find an item?">
            <button type="button" className={`cf-status-option ${status === "lost" ? "is-selected" : ""}`} role="radio" aria-checked={status === "lost"} onClick={() => setStatus("lost")}><span className="cf-status-option-icon lost-color"><Search size={19} /></span><span><strong>I lost something</strong><small>Help me find my item</small></span><span className="cf-radio-mark" /></button>
            <button type="button" className={`cf-status-option ${status === "found" ? "is-selected" : ""}`} role="radio" aria-checked={status === "found"} onClick={() => setStatus("found")}><span className="cf-status-option-icon found-color"><PackagePlus size={19} /></span><span><strong>I found something</strong><small>Help it find its person</small></span><span className="cf-radio-mark" /></button>
          </div>}
          {step === 2 && <div className="cf-form-fields"><div className="cf-form-two"><label className="cf-field">Item name<input autoFocus required maxLength={70} value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Black Samsung earbuds" /></label><label className="cf-field">Category<select value={category} onChange={(event) => setCategory(event.target.value as (typeof CATEGORIES)[number])}>{CATEGORIES.map((value) => <option key={value}>{value}</option>)}</select></label></div><label className="cf-field">Description<textarea required rows={4} maxLength={450} value={description} onChange={(event) => setDescription(event.target.value)} placeholder="What makes it easy to recognize? A brand, detail, or sticker…" /></label><div className="cf-form-two"><label className="cf-field">Color<input maxLength={40} value={color} onChange={(event) => setColor(event.target.value)} placeholder="e.g. Black" /></label><div className="cf-field"><span>Item photo <small>(optional)</small></span><input ref={fileInput} type="file" accept="image/*" className="cf-visually-hidden" onChange={(event) => handleFile(event.target.files?.[0])} /><button type="button" className="cf-upload-button" onClick={() => fileInput.current?.click()}><ImagePlus size={17} /><span>{imageLoading ? "Preparing photo…" : imageName || "Add a photo"}</span>{photo ? <Check size={15} /> : <Upload size={14} />}</button></div></div>{photo && <div className="cf-photo-preview"><img src={photo} alt="Selected item preview" /><span>{imageName}</span><button type="button" className="cf-icon-button" aria-label="Remove selected image" onClick={() => { setPhoto(undefined); setImageName(""); }}><X size={15} /></button></div>}</div>}
          {step === 3 && <div className="cf-form-fields"><label className="cf-field">Where on campus?<select value={location} onChange={(event) => setLocation(event.target.value as (typeof LOCATIONS)[number])}>{LOCATIONS.map((value) => <option key={value}>{value}</option>)}</select><small>Pick the closest campus location.</small></label><div className="cf-form-two"><label className="cf-field">Date<input type="date" value={date} onChange={(event) => setDate(event.target.value)} /></label><label className="cf-field">Approximate time<input type="time" value={time} onChange={(event) => setTime(event.target.value)} /></label></div><div className="cf-map-nudge"><MapPin size={17} /><span><strong>Not sure of the exact spot?</strong><small>A nearby building or campus area is just fine.</small></span><ChevronRight size={15} /></div></div>}
          {step === 4 && <div className="cf-review-card"><div className="cf-review-status"><span className={`cf-item-badge cf-badge-${status}`}>{status === "lost" ? "Lost item" : "Found item"}</span><span>Only you can see this preview</span></div><div className="cf-review-item"><div className="cf-review-photo">{photo ? <img src={photo} alt="" /> : <PackagePlus size={24} />}</div><div><h3>{name}</h3><span>{category} · {color || "Color not specified"}</span></div></div><p>{description}</p><div className="cf-review-meta"><span><MapPin size={14} />{location}</span><span><CalendarDays size={14} />{formatCampusDate(date)}</span><span><Clock3 size={14} />{time}</span></div><div className="cf-review-match-note"><Sparkles size={16} /><span><strong>Smart matching is ready</strong><small>We’ll compare category, location, and date as soon as you post.</small></span></div></div>}
          <div className="cf-form-actions">{step > 1 && <button type="button" className="cf-button cf-button-outline" onClick={() => setStep((current) => current - 1)}><ArrowLeft size={15} />Back</button>}{step < 4 ? <button type="button" className="cf-button cf-button-primary" onClick={() => { if (canContinue()) setStep((current) => current + 1); }}>Continue <ArrowRight size={15} /></button> : <button type="button" className="cf-button cf-button-primary" onClick={publish}><CheckCircle2 size={16} />Post item & find matches</button>}</div>
          <div className="cf-form-privacy"><CheckCircle2 size={14} /> Your sample post stays in this browser for this demo.</div>
        </div>
      </section>
    </div>
  );
}
