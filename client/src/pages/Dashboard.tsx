import { useMemo, useState } from "react";
import { Activity, ArrowRight, Bell, CalendarDays, Check, ChevronRight, Filter, MapPin, PackageOpen, Search, Sparkles, Target } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";
import { ItemCard } from "../components/ItemCard";
import { MatchCard } from "../components/MatchCard";
import { ClaimDialog, ContactDialog, ItemDetailsDialog } from "../components/ItemDialogs";
import { CAMPUS_STATS, MOST_REPORTED_LOCATIONS } from "../lib/campusfind-data";
import { FEATURED_LOST_EARBUDS } from "../lib/campusfind-samples";
import { useCampusStore } from "../lib/campusfind-store";
import { findMatches } from "../lib/campusfind-matching";
import { CATEGORIES, LOCATIONS, type CampusItem, type ItemStatus } from "../lib/campusfind-types";

const STAT_ICONS = [PackageOpen, Sparkles, Activity, Target];

export default function Dashboard() {
  const { items, markItemResolved } = useCampusStore();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState<"all" | ItemStatus>("all");
  const [details, setDetails] = useState<CampusItem | null>(null);
  const [contact, setContact] = useState<CampusItem | null>(null);
  const [claim, setClaim] = useState<{ own: CampusItem; candidate: CampusItem } | null>(null);

  const featuredSource = items.find((item) => item.id === FEATURED_LOST_EARBUDS.id) ?? FEATURED_LOST_EARBUDS;
  const featuredMatches = findMatches(featuredSource, items, { limit: 3 });
  const filtered = useMemo(() => items.filter((item) => {
    if (item.resolved) return false;
    const matchesQuery = `${item.name} ${item.description} ${item.category} ${item.location}`.toLowerCase().includes(query.toLowerCase());
    return matchesQuery && (!category || item.category === category) && (!location || item.location.toLowerCase().includes(location.toLowerCase())) && (!date || item.date === date) && (status === "all" || item.status === status);
  }), [items, query, category, location, date, status]);
  const resetFilters = () => { setQuery(""); setCategory(""); setLocation(""); setDate(""); setStatus("all"); };
  const handleClaim = () => {
    if (!claim) return;
    markItemResolved(claim.own.id);
    markItemResolved(claim.candidate.id);
    setClaim(null);
  };

  return (
    <div className="cf-page-stack">
      <section className="cf-welcome-row">
        <div><div className="cf-eyebrow">TUESDAY, OCTOBER 6 <span className="cf-eyebrow-spark">✳</span> NORTHSTAR UNIVERSITY</div><h1>Good afternoon, Alex <span>✦</span></h1><p>A little extra attention is bringing more things home.</p></div>
        <Link className="cf-button cf-button-primary" href="/report"><span className="cf-button-plus">+</span>Report an item</Link>
      </section>

      <section className="cf-stats-grid" aria-label="CampusFind activity">
        {CAMPUS_STATS.map((stat, index) => { const Icon = STAT_ICONS[index]; return <article className={`cf-dashboard-stat cf-dstat-${index}`} key={stat.label}><span className="cf-dashboard-stat-icon"><Icon size={17} /></span><div><strong>{stat.value}</strong><small>{stat.label}</small></div><span className="cf-stat-spark">{index === 1 ? <Sparkles size={15} /> : <i />}</span></article>; })}
      </section>

      <section className="cf-dashboard-feature-grid">
        <div className="cf-spotlight-panel">
          <div className="cf-panel-heading"><div><div className="cf-section-kicker">SMART MATCH SPOTLIGHT</div><h2>Your next happy ending might be right here.</h2></div><Link className="cf-round-link" href="/matches" aria-label="See all smart matches"><ArrowRight size={17} /></Link></div>
          {featuredMatches.length ? <>
            <div className="cf-spotlight-summary"><span className="cf-live-indicator"><i /> 3 GOOD POSSIBILITIES</span><span>For <strong>{featuredSource.name}</strong></span></div>
            <MatchCard source={featuredSource} match={featuredMatches[0]} onContact={setContact} onClaim={(own, candidate) => setClaim({ own, candidate })} featured />
            {featuredMatches.length > 1 && <Link className="cf-match-more" href="/matches">See all {featuredMatches.length} possible matches <ArrowRight size={14} /></Link>}
          </> : <div className="cf-empty-inline"><span><Sparkles size={19} /></span><strong>We’re looking for the right match.</strong><small>New finds will show here as they’re reported.</small><Link href="/report">Post an item <ArrowRight size={14} /></Link></div>}
        </div>
        <aside className="cf-side-insights">
          <div className="cf-insight-card cf-insight-quick"><div className="cf-insight-heading"><span className="cf-insight-icon"><MapPin size={16} /></span><span><strong>Where things turn up</strong><small>Most reported today</small></span><Link href="/map" aria-label="Open campus map"><ArrowRight size={15} /></Link></div>
            <div className="cf-location-bars">{MOST_REPORTED_LOCATIONS.map((entry, index) => <div className="cf-location-bar-row" key={entry.name}><span className="cf-location-number">0{index + 1}</span><span className="cf-location-bar-label">{entry.name}</span><span className="cf-location-bar-track"><i className={`bar-${entry.color}`} style={{ width: `${entry.count / 24 * 100}%` }} /></span><strong>{entry.count}</strong></div>)}</div>
            <Link className="cf-insight-foot-link" href="/map">Open campus map <ArrowRight size={14} /></Link>
          </div>
          <div className="cf-insight-card cf-tip-card"><span className="cf-tip-spark"><Sparkles size={18} /></span><p className="cf-section-kicker">A KINDNESS TIP</p><h3>Found something?<br /><em>Be somebody’s good day.</em></h3><Link className="cf-button cf-button-dark" href="/report?type=found">Post a found item <ArrowRight size={14} /></Link><div className="cf-tip-decoration"><span /><span /><span /></div></div>
        </aside>
      </section>

      <section className="cf-discover-section">
        <div className="cf-section-header"><div><div className="cf-section-kicker">ON CAMPUS RIGHT NOW</div><h2>Items making the rounds</h2><p>Little clues, waiting for their people.</p></div><Link className="cf-text-link" href="/lost">Browse all items <ArrowRight size={15} /></Link></div>
        <div className="cf-discovery-toolbar">
          <label className="cf-search-field"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search lost or found items…" aria-label="Search lost or found items" /></label>
          <div className="cf-toolbar-filters"><label className="cf-select-label"><Filter size={14} /><select aria-label="Filter by category" value={category} onChange={(event) => setCategory(event.target.value)}><option value="">All categories</option>{CATEGORIES.map((value) => <option key={value}>{value}</option>)}</select></label><label className="cf-select-label"><MapPin size={14} /><select aria-label="Filter by location" value={location} onChange={(event) => setLocation(event.target.value)}><option value="">All locations</option>{LOCATIONS.map((value) => <option key={value}>{value}</option>)}</select></label><label className="cf-date-filter"><CalendarDays size={14} /><input aria-label="Filter by date" type="date" value={date} onChange={(event) => setDate(event.target.value)} /></label></div>
        </div>
        <div className="cf-toggle-row"><div className="cf-segmented" role="group" aria-label="Filter lost or found items">{(["all", "lost", "found"] as const).map((value) => <button key={value} className={status === value ? "is-active" : ""} onClick={() => setStatus(value)}>{value === "all" ? "Everything" : value === "lost" ? "Lost" : "Found"}</button>)}</div><span className="cf-result-count">{filtered.length} items to explore</span></div>
        {filtered.length ? <div className="cf-item-grid">{filtered.slice(0, 6).map((item) => <ItemCard key={item.id} item={item} score={findMatches(item, items, { limit: 1 })[0]?.score} onView={setDetails} />)}</div> : <div className="cf-empty-state"><span><Search size={22} /></span><h3>No items with those clues just yet</h3><p>Try clearing a filter, or let the campus know what you’re looking for.</p><button className="cf-button cf-button-outline" onClick={resetFilters}>Clear filters</button><Link className="cf-button cf-button-primary" href="/report">Report an item</Link></div>}
        <div className="cf-dashboard-footnote"><Check size={14} /> These are demo campus posts. Your own reports stay in this browser.</div>
      </section>

      <ItemDetailsDialog item={details} onClose={() => setDetails(null)} onContact={(item) => { setDetails(null); setContact(item); }} />
      <ContactDialog item={contact} onClose={() => setContact(null)} />
      <ClaimDialog open={!!claim} itemName={claim?.candidate.name ?? "this item"} onClose={() => setClaim(null)} onConfirm={handleClaim} />
    </div>
  );
}
