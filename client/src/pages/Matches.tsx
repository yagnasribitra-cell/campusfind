import { useMemo, useState } from "react";
import { ArrowRight, CheckCircle2, ChevronDown, Search, Sparkles } from "lucide-react";
import { Link } from "wouter";
import { MatchCard } from "../components/MatchCard";
import { ClaimDialog, ContactDialog } from "../components/ItemDialogs";
import { FEATURED_LOST_EARBUDS } from "../lib/campusfind-samples";
import { findMatches } from "../lib/campusfind-matching";
import { useCampusStore } from "../lib/campusfind-store";
import type { CampusItem } from "../lib/campusfind-types";

export default function Matches() {
  const { items, markItemResolved } = useCampusStore();
  const lostItems = useMemo(() => items.filter((item) => item.status === "lost" && !item.resolved), [items]);
  const [selectedId, setSelectedId] = useState(FEATURED_LOST_EARBUDS.id);
  const [contact, setContact] = useState<CampusItem | null>(null);
  const [claim, setClaim] = useState<{ own: CampusItem; candidate: CampusItem } | null>(null);
  const source = lostItems.find((item) => item.id === selectedId) ?? lostItems[0] ?? FEATURED_LOST_EARBUDS;
  const matches = findMatches(source, items, { limit: 3 });
  const handleClaim = () => {
    if (!claim) return;
    markItemResolved(claim.own.id);
    markItemResolved(claim.candidate.id);
    setClaim(null);
  };

  return (
    <div className="cf-page-stack">
      <section className="cf-welcome-row"><div><div className="cf-eyebrow">THE DETAILS ARE LINING UP <span className="cf-eyebrow-spark">✳</span> SMART MATCH</div><h1>Smart matches<span className="cf-heading-dot">.</span></h1><p>Category, place, and day — the clues that bring something home.</p></div><span className="cf-match-bubble"><span className="cf-live-indicator"><i /> MATCHER ACTIVE</span></span></section>
      <section className="cf-match-intro-card"><div className="cf-match-intro-icon"><Sparkles size={22} /></div><div><span className="cf-section-kicker">A GOOD CLUE CAN GO A LONG WAY</span><h2>{matches.length ? `We found ${matches.length} possible match${matches.length === 1 ? "" : "es"}!` : "We’re still watching for a match."}</h2><p>{matches.length ? "Here’s how a few campus clues are lining up for your item." : "Try another lost post, or let us keep looking as new items arrive."}</p></div><div className="cf-match-intro-decoration"><i /><i /><i /></div></section>
      {lostItems.length > 1 && <label className="cf-match-item-picker"><Search size={16} /><span>Looking for matches for</span><select aria-label="Choose a lost item to match" value={source.id} onChange={(event) => setSelectedId(event.target.value)}>{lostItems.map((item) => <option key={item.id} value={item.id}>{item.name} · {item.location}</option>)}</select><ChevronDown size={15} /></label>}
      <div className="cf-matching-rules"><span><CheckCircle2 size={15} />Category <b>40%</b></span><i /><span><CheckCircle2 size={15} />Location <b>35%</b></span><i /><span><CheckCircle2 size={15} />Date <b>25%</b></span></div>
      <section className="cf-ranked-matches">
        <div className="cf-section-header"><div><div className="cf-section-kicker">RANKED BY THE CLOSEST CLUES</div><h2>Possible finds</h2></div><span className="cf-result-count">Top {matches.length} of {matches.length}</span></div>
        {matches.length ? <div className="cf-match-list">{matches.map((match, index) => <div className="cf-match-result-row" key={match.item.id}><div className="cf-rank-number">0{index + 1}</div><MatchCard source={source} match={match} onContact={setContact} onClaim={(own, candidate) => setClaim({ own, candidate })} featured={index === 0} /></div>)}</div> : <div className="cf-empty-state"><span><Sparkles size={22} /></span><h3>No close matches in the sample posts yet</h3><p>CampusFind will compare category, location, and date when another item is reported.</p><Link className="cf-button cf-button-primary" href="/report">Report an item <ArrowRight size={15} /></Link></div>}
      </section>
      <ContactDialog item={contact} onClose={() => setContact(null)} />
      <ClaimDialog open={!!claim} itemName={claim?.candidate.name ?? "this item"} onClose={() => setClaim(null)} onConfirm={handleClaim} />
    </div>
  );
}
