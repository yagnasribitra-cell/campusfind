import { useState } from "react";
import { Check, MapPin, CalendarDays, Sparkles, UserRound, MessageCircle, BadgeCheck, Clock3, Eye } from "lucide-react";
import { formatCampusDateLong } from "./ItemCard";
import type { CampusItem, MatchScore } from "../lib/campusfind-types";

interface MatchCardProps {
  source: CampusItem;
  match: MatchScore;
  onContact: (item: CampusItem) => void;
  onClaim: (source: CampusItem, match: CampusItem) => void;
  featured?: boolean;
}

export function MatchCard({ source, match, onContact, onClaim, featured = false }: MatchCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const candidate = match.item;
  return (
    <article className={`cf-match-card ${featured ? "cf-match-featured" : ""}`}>
      <div className="cf-match-card-top">
        <div className="cf-match-label"><Sparkles size={14} /> POSSIBLE MATCH</div>
        <div className="cf-match-score-wrap" aria-label={`${match.score}% match`}>
          <div className="cf-score-ring" style={{ background: `conic-gradient(var(--cyan) ${match.score * 3.6}deg, #e9edf4 ${match.score * 3.6}deg)` }}>
            <span><strong>{match.score}</strong><small>%</small></span>
          </div>
          <span className="cf-score-caption">MATCH SCORE</span>
        </div>
      </div>
      <div className="cf-match-items">
        <MiniItem item={source} tag={source.status === "lost" ? "YOU LOST" : "YOU FOUND"} />
        <div className="cf-match-connector"><span><Sparkles size={16} /></span><i /><i /><i /></div>
        <MiniItem item={candidate} tag={candidate.status === "found" ? "FOUND NEARBY" : "ALSO LOST"} />
      </div>
      <div className="cf-match-breakdown">
        <span className={match.categoryScore ? "is-match" : ""}><Check size={13} />Category</span>
        <span className={match.locationScore ? "is-match" : ""}><MapPin size={13} />Location</span>
        <span className={match.dateScore ? "is-match" : ""}><CalendarDays size={13} />Date</span>
      </div>
      <div className="cf-match-breakdown-bars" aria-label={`Category ${match.categoryScore} of 40, location ${match.locationScore} of 35, date ${match.dateScore} of 25`}>
        <div><span>Category</span><i><b style={{ width: `${match.categoryScore / 40 * 100}%` }} /></i><small>{match.categoryScore}/40</small></div>
        <div><span>Location</span><i><b style={{ width: `${match.locationScore / 35 * 100}%` }} /></i><small>{match.locationScore}/35</small></div>
        <div><span>Date</span><i><b style={{ width: `${match.dateScore / 25 * 100}%` }} /></i><small>{match.dateScore}/25</small></div>
      </div>
      {showDetails && <div className="cf-match-expanded"><div><span>{source.status === "lost" ? "YOUR LOST POST" : "YOUR FOUND POST"}</span><strong>{source.color} · {source.category}</strong><p>{source.description}</p><small>{source.location} · {formatCampusDateLong(source.date)} · {source.time}</small></div><div><span>{candidate.status === "found" ? "POSSIBLE FOUND POST" : "POSSIBLE LOST POST"}</span><strong>{candidate.color} · {candidate.category}</strong><p>{candidate.description}</p><small>{candidate.location} · {formatCampusDateLong(candidate.date)} · {candidate.time}</small></div></div>}
      <div className="cf-match-actions">
        <button className="cf-button cf-button-outline" aria-expanded={showDetails} onClick={() => setShowDetails((visible) => !visible)}><Eye size={15} />{showDetails ? "Hide details" : "View Match"}</button>
        <button className="cf-button cf-button-outline" onClick={() => onContact(candidate)}><MessageCircle size={15} />Contact {source.status === "lost" ? "Finder" : "Owner"}</button>
        {source.status === "lost" && <button className="cf-button cf-button-primary" onClick={() => onClaim(source, candidate)}><BadgeCheck size={15} />This is My Item</button>}
      </div>
    </article>
  );
}

function MiniItem({ item, tag }: { item: CampusItem; tag: string }) {
  return (
    <div className="cf-mini-item">
      <span className={`cf-mini-status cf-mini-${item.status}`}>{tag}</span>
      <strong>{item.name}</strong>
      <span className="cf-mini-meta"><MapPin size={13} />{item.location}<i>·</i><CalendarDays size={13} />{formatCampusDateLong(item.date)}</span>
      <span className="cf-mini-meta"><UserRound size={13} />Posted by {item.reporter}<i>·</i><Clock3 size={13} />{item.time}</span>
    </div>
  );
}
