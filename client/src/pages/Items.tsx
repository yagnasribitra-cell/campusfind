import { useMemo, useState } from "react";
import { ArrowRight, CalendarDays, Filter, MapPin, Search, SlidersHorizontal } from "lucide-react";
import { Link, useLocation } from "wouter";
import { ItemCard } from "../components/ItemCard";
import { ContactDialog, ItemDetailsDialog } from "../components/ItemDialogs";
import { findMatches } from "../lib/campusfind-matching";
import { useCampusStore } from "../lib/campusfind-store";
import { CATEGORIES, LOCATIONS, type CampusItem, type ItemStatus } from "../lib/campusfind-types";

export default function Items({ status }: { status: ItemStatus }) {
  const { items } = useCampusStore();
  const [, setLocation] = useLocation();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [location, setFilterLocation] = useState("");
  const [date, setDate] = useState("");
  const [details, setDetails] = useState<CampusItem | null>(null);
  const [contact, setContact] = useState<CampusItem | null>(null);
  const filtered = useMemo(() => items.filter((item) => {
    if (item.status !== status || item.resolved) return false;
    const searchText = `${item.name} ${item.description} ${item.category} ${item.location}`.toLowerCase();
    return searchText.includes(query.toLowerCase()) && (!category || item.category === category) && (!location || item.location.toLowerCase().includes(location.toLowerCase())) && (!date || item.date === date);
  }).sort((a, b) => b.postedAt.localeCompare(a.postedAt)), [items, status, query, category, location, date]);
  const clearFilters = () => { setQuery(""); setCategory(""); setFilterLocation(""); setDate(""); };
  const title = status === "lost" ? "Lost items" : "Found items";
  return (
    <div className="cf-page-stack">
      <section className="cf-welcome-row cf-listing-heading"><div><div className="cf-eyebrow">THE CAMPUS NOTICEBOARD <span className="cf-eyebrow-spark">✳</span> NORTHSTAR UNIVERSITY</div><h1>{title}<span className="cf-heading-dot">.</span></h1><p>{status === "lost" ? "A few details can make all the difference." : "Every found item could be someone’s good day."}</p></div><Link className="cf-button cf-button-primary" href="/report"><span className="cf-button-plus">+</span>Report an item</Link></section>
      <div className="cf-listing-tabs" role="tablist" aria-label="Choose lost or found items"><button role="tab" aria-selected={status === "lost"} className={status === "lost" ? "is-active" : ""} onClick={() => setLocation("/lost")}>Lost items <span>{items.filter((item) => item.status === "lost" && !item.resolved).length}</span></button><button role="tab" aria-selected={status === "found"} className={status === "found" ? "is-active" : ""} onClick={() => setLocation("/found")}>Found items <span>{items.filter((item) => item.status === "found" && !item.resolved).length}</span></button></div>
      <section className="cf-listing-panel">
        <div className="cf-listing-intro"><div><h2>Find the right post</h2><p>Search the little details — item, category, place, or day.</p></div><span className="cf-result-count"><SlidersHorizontal size={14} /> {filtered.length} posts</span></div>
        <div className="cf-discovery-toolbar cf-listing-toolbar">
          <label className="cf-search-field"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search lost or found items…" aria-label="Search lost or found items" /></label>
          <label className="cf-select-label"><Filter size={14} /><select aria-label="Filter by category" value={category} onChange={(event) => setCategory(event.target.value)}><option value="">All categories</option>{CATEGORIES.map((value) => <option key={value}>{value}</option>)}</select></label>
          <label className="cf-select-label"><MapPin size={14} /><select aria-label="Filter by location" value={location} onChange={(event) => setFilterLocation(event.target.value)}><option value="">All locations</option>{LOCATIONS.map((value) => <option key={value}>{value}</option>)}</select></label>
          <label className="cf-date-filter"><CalendarDays size={14} /><input type="date" value={date} aria-label="Filter by date" onChange={(event) => setDate(event.target.value)} /></label>
        </div>
        {filtered.length ? <div className="cf-item-grid">{filtered.map((item) => <ItemCard key={item.id} item={item} score={findMatches(item, items, { limit: 1 })[0]?.score} onView={setDetails} />)}</div> : <div className="cf-empty-state"><span><Search size={22} /></span><h3>No {status} posts found</h3><p>Try another search, or share the details so your campus can help.</p><button className="cf-button cf-button-outline" onClick={clearFilters}>Clear filters</button><Link className="cf-button cf-button-primary" href="/report">Post a {status} item <ArrowRight size={15} /></Link></div>}
      </section>
      <ItemDetailsDialog item={details} onClose={() => setDetails(null)} onContact={(item) => { setDetails(null); setContact(item); }} />
      <ContactDialog item={contact} onClose={() => setContact(null)} />
    </div>
  );
}
