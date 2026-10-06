import { useState } from "react";
import {
  Backpack,
  BookOpen,
  CreditCard,
  Glasses,
  KeyRound,
  Laptop,
  Package,
  PenLine,
  Shirt,
  Sparkles,
  MapPin,
  Clock3,
  ArrowRight,
  ArrowUpRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { CampusItem } from "../lib/campusfind-types";

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  Electronics: Laptop,
  Bags: Backpack,
  Accessories: Glasses,
  Books: BookOpen,
  Keys: KeyRound,
  Clothing: Shirt,
  "ID/Cards": CreditCard,
  Stationery: PenLine,
  "Personal Items": Sparkles,
  Other: Package,
};

export function formatCampusDate(date: string) {
  const parsed = new Date(`${date}T12:00:00`);
  if (!Number.isFinite(parsed.getTime())) return date;
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(parsed);
}

export function formatCampusDateLong(date: string) {
  const parsed = new Date(`${date}T12:00:00`);
  if (!Number.isFinite(parsed.getTime())) return date;
  return new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric" }).format(parsed);
}

interface ItemCardProps {
  item: CampusItem;
  score?: number;
  onView: (item: CampusItem) => void;
  compact?: boolean;
}

export function ItemCard({ item, score, onView, compact = false }: ItemCardProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const Icon = CATEGORY_ICONS[item.category] ?? Package;
  return (
    <article className={`cf-item-card ${compact ? "cf-item-card-compact" : ""}`}>
      <button className="cf-item-card-main" onClick={() => onView(item)} aria-label={`View ${item.name}`}>
        <div className={`cf-item-thumb cf-thumb-${item.category.toLowerCase().replace(/[^a-z]+/g, "-")}`}>
          {item.photo && !imageFailed ? (
            <><span className={`cf-thumb-skeleton ${imageLoaded ? "is-loaded" : ""}`} /><img src={item.photo} alt="" loading="lazy" onLoad={() => setImageLoaded(true)} onError={() => setImageFailed(true)} /></>
          ) : (
            <><span className="cf-thumb-glow" /><Icon size={29} strokeWidth={1.7} /></>
          )}
          <span className={`cf-item-badge cf-badge-${item.status}`}>{item.status === "lost" ? "Lost" : "Found"}</span>
        </div>
        <div className="cf-item-content">
          <div className="cf-item-title-row">
            <h3>{item.name}</h3>
            <ArrowUpRight className="cf-item-arrow" size={16} />
          </div>
          <span className="cf-item-category">{item.category}</span>
          <p className="cf-item-description">{item.description}</p>
          <div className="cf-item-meta">
            <span><MapPin size={13} />{item.location}</span>
            <span><Clock3 size={13} />{formatCampusDate(item.date)}</span>
          </div>
          <div className="cf-item-card-foot">
            <span className="cf-reporter"><i>{item.initials}</i> {item.reporter.split(" ")[0]}</span>
            {score !== undefined && <span className="cf-score-pill"><Sparkles size={13} />{score}% match</span>}
          </div>
          <span className="cf-item-details-action">View Details <ArrowRight size={12} /></span>
        </div>
      </button>
    </article>
  );
}
