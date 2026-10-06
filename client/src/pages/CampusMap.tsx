import { useMemo, useState } from "react";
import { ArrowRight, Building2, MapPin, Navigation, Search, Sparkles } from "lucide-react";
import { Link } from "wouter";
import { MOST_REPORTED_LOCATIONS } from "../lib/campusfind-data";
import { useCampusStore } from "../lib/campusfind-store";
import { LOCATIONS, type CampusItem } from "../lib/campusfind-types";
import { formatCampusDate } from "../components/ItemCard";

const PLACEMENTS = [
  { name: "Library", x: 28, y: 24, color: "mint", short: "LIB" },
  { name: "Cafeteria", x: 58, y: 40, color: "violet", short: "CAF" },
  { name: "Main Block", x: 44, y: 67, color: "blue", short: "MAIN" },
  { name: "Parking Area", x: 81, y: 72, color: "amber", short: "PARK" },
  { name: "Hostel", x: 79, y: 25, color: "coral", short: "HOSTEL" },
  { name: "Sports Ground", x: 22, y: 76, color: "green", short: "SPORTS" },
  { name: "Computer Lab", x: 56, y: 16, color: "blue", short: "LAB" },
];

export default function CampusMap() {
  const { items } = useCampusStore();
  const [selected, setSelected] = useState("Library");
  const selectedItems = useMemo(() => items.filter((item) => !item.resolved && (item.location === selected || item.location.toLowerCase().includes(selected.toLowerCase()))), [items, selected]);
  const countAt = (name: string) => items.filter((item) => !item.resolved && (item.location === name || item.location.toLowerCase().includes(name.toLowerCase()))).length;

  return (
    <div className="cf-page-stack">
      <section className="cf-welcome-row"><div><div className="cf-eyebrow">A LITTLE CLUE ABOUT WHERE <span className="cf-eyebrow-spark">✳</span> NORTHSTAR UNIVERSITY</div><h1>Campus map<span className="cf-heading-dot">.</span></h1><p>See where good finds are waiting to happen.</p></div><span className="cf-map-live"><i /> CAMPUS ACTIVITY</span></section>
      <div className="cf-map-layout">
        <section className="cf-campus-map-card">
          <div className="cf-map-card-head"><div><div className="cf-section-kicker">NORTHSTAR CAMPUS</div><h2>Places we look for each other</h2></div><span className="cf-map-key"><i /> Reported item</span></div>
          <div className="cf-campus-map" role="img" aria-label="Schematic campus map with selectable reported-item markers">
            <div className="cf-map-grid" />
            <svg className="cf-map-paths" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d="M28 24 L43 32 L56 40 L44 67 L22 76 M43 32 L56 16 M56 40 L79 25 M44 67 L81 72 M56 40 L44 67" /><path d="M28 24 Q42 18 56 16 M58 40 Q70 56 81 72" className="cf-path-secondary" /></svg>
            <div className="cf-map-building cf-building-library"><span>THE ATHENAEUM</span><i>◌</i></div><div className="cf-map-building cf-building-cafe"><span>COMMONS</span><i>▤</i></div><div className="cf-map-building cf-building-main"><span>HALL A</span><i>▥</i></div><div className="cf-map-building cf-building-hostel"><span>RESIDENCE</span><i>⌂</i></div><div className="cf-map-building cf-building-lab"><span>MAKER LAB</span><i>⌘</i></div><div className="cf-map-building cf-building-parking"><span>PARKING</span><i>···</i></div><div className="cf-map-field"><span>GREEN</span></div><div className="cf-map-garden"><span>GARDEN</span></div>
            {PLACEMENTS.map((place) => <button key={place.name} className={`cf-map-pin pin-${place.color} ${selected === place.name ? "is-selected" : ""}`} style={{ left: `${place.x}%`, top: `${place.y}%` }} onClick={() => setSelected(place.name)} aria-label={`${place.name}, ${countAt(place.name)} reported items`} aria-pressed={selected === place.name}><span className="cf-pin-shadow" /><span className="cf-pin-icon"><MapPin size={17} fill="currentColor" /></span><span className="cf-pin-count">{countAt(place.name)}</span><span className="cf-pin-label">{place.name}</span></button>)}
            <div className="cf-map-compass"><Navigation size={18} /><span>N</span></div><span className="cf-map-caption">A FRIENDLY, NOT-TO-SCALE CAMPUS MAP</span>
          </div>
          <div className="cf-map-place-list">{LOCATIONS.map((name, index) => <button key={name} className={selected === name ? "is-active" : ""} onClick={() => setSelected(name)}><span className={`cf-map-mini-dot mini-dot-${index}`} /><span>{name}</span><strong>{countAt(name)}</strong></button>)}</div>
        </section>
        <aside className="cf-map-side-column">
          <section className="cf-map-location-detail"><div className="cf-map-selected-icon"><MapPin size={19} /></div><div className="cf-section-kicker">SELECTED SPOT</div><h2>{selected}</h2><p>{selectedItems.length ? `${selectedItems.length} demo ${selectedItems.length === 1 ? "post" : "posts"} connected to this area.` : "No sample posts here just yet — but the next one could start here."}</p>{selectedItems.length ? <div className="cf-map-recent-list">{selectedItems.slice(0, 3).map((item) => <MapRecentItem key={item.id} item={item} />)}</div> : <div className="cf-map-empty"><Search size={17} /><span>Quiet for now. Good to know.</span></div>}<Link className="cf-map-report-link" href="/report"><span><MapPin size={14} /> Report an item here</span><ArrowRight size={15} /></Link></section>
          <section className="cf-reported-list-card"><div className="cf-section-kicker">THE BUSIEST SPOTS</div><h3>Most reported<br /><em>locations.</em></h3><div className="cf-top-locations">{MOST_REPORTED_LOCATIONS.map((place, index) => <div key={place.name}><span className="cf-location-number">0{index + 1}</span><span>{place.name}</span><strong>{place.count}<small>items</small></strong></div>)}</div><p><Sparkles size={14} /> Little things turn up in familiar places.</p></section>
        </aside>
      </div>
      <div className="cf-map-note"><Building2 size={15} /> Locations and counts are demo data for Northstar University; this map isn’t GPS or a live campus map.</div>
    </div>
  );
}

function MapRecentItem({ item }: { item: CampusItem }) {
  return <div className="cf-map-recent-item"><span className={`cf-mini-dot-status ${item.status}`} /><span><strong>{item.name}</strong><small>{item.status === "lost" ? "Lost" : "Found"} · {formatCampusDate(item.date)}</small></span></div>;
}
