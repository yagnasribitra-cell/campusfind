import { useMemo, useState } from "react";
import { ArrowRight, BadgeCheck, BookOpen, ChevronRight, MapPin, PackageOpen, Sparkles, UserRound } from "lucide-react";
import { Link } from "wouter";
import { ItemCard } from "../components/ItemCard";
import { AppDialog } from "../components/AppDialog";
import { ContactDialog, ItemDetailsDialog } from "../components/ItemDialogs";
import { CAMPUS_PROFILE } from "../lib/campusfind-data";
import { findMatches } from "../lib/campusfind-matching";
import { useCampusStore } from "../lib/campusfind-store";
import type { CampusItem } from "../lib/campusfind-types";

const TABS = ["My Lost Items", "My Found Items", "My Matches"] as const;
type Tab = (typeof TABS)[number];

export default function Profile() {
  const { items } = useCampusStore();
  const [tab, setTab] = useState<Tab>("My Lost Items");
  const [details, setDetails] = useState<CampusItem | null>(null);
  const [contact, setContact] = useState<CampusItem | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const mine = useMemo(() => items.filter((item) => item.reporter === CAMPUS_PROFILE.name), [items]);
  const recovered = mine.filter((item) => item.resolved).length;
  const matchedCount = mine.filter((item) => findMatches(item, items).length > 0).length;
  const listed = tab === "My Lost Items" ? mine.filter((item) => item.status === "lost") : tab === "My Found Items" ? mine.filter((item) => item.status === "found") : mine.filter((item) => findMatches(item, items).length > 0);
  return (
    <div className="cf-page-stack">
      <section className="cf-welcome-row"><div><div className="cf-eyebrow">YOUR CAMPUS STORY <span className="cf-eyebrow-spark">✳</span> MY PROFILE</div><h1>My profile<span className="cf-heading-dot">.</span></h1><p>A little help from you goes a long way.</p></div><button className="cf-button cf-button-outline" onClick={() => setProfileOpen(true)}>Edit profile <UserRound size={15} /></button></section>
      <section className="cf-profile-hero"><div className="cf-profile-avatar-wrap"><img src="/profile-sky.svg" alt="Illustrated profile portrait of Alex Morgan" /><span className="cf-profile-online" /></div><div className="cf-profile-identity"><span className="cf-profile-campus"><span className="cf-campus-dot" /> NORTHSTAR UNIVERSITY · {CAMPUS_PROFILE.year.toUpperCase()}</span><h2>{CAMPUS_PROFILE.name}</h2><p><BookOpen size={15} />{CAMPUS_PROFILE.department}</p></div><div className="cf-profile-kindness"><span><Sparkles size={15} /> KINDNESS, IN ACTION</span><strong>Good neighbor</strong><small>Making campus a little more connected.</small></div></section>
      <section className="cf-profile-stats">{[{ label: "Items reported", value: mine.length, icon: PackageOpen }, { label: "Items recovered", value: recovered, icon: BadgeCheck }, { label: "Successful matches", value: matchedCount, icon: Sparkles }].map((stat) => { const Icon = stat.icon; return <article key={stat.label}><span><Icon size={17} /></span><div><strong>{stat.value}</strong><small>{stat.label}</small></div></article>; })}</section>
      <section className="cf-profile-items"><div className="cf-profile-items-head"><div><div className="cf-section-kicker">YOUR POSTS, ALL TOGETHER</div><h2>My campus activity</h2></div><Link className="cf-text-link" href="/report">Report an item <ArrowRight size={14} /></Link></div><div className="cf-profile-tabs" role="tablist" aria-label="Filter your campus activity">{TABS.map((label) => <button role="tab" aria-selected={tab === label} key={label} className={tab === label ? "is-active" : ""} onClick={() => setTab(label)}>{label}{label === "My Lost Items" && <span>{mine.filter((item) => item.status === "lost").length}</span>}{label === "My Found Items" && <span>{mine.filter((item) => item.status === "found").length}</span>}</button>)}</div>{listed.length ? <div className="cf-item-grid">{listed.map((item) => <ItemCard key={item.id} item={item} score={findMatches(item, items, { limit: 1 })[0]?.score} onView={setDetails} />)}</div> : <div className="cf-empty-profile"><span><MapPin size={21} /></span><h3>No posts in this section — yet.</h3><p>Whether lost or found, your next small step could help someone out.</p><Link className="cf-button cf-button-primary" href="/report">Make a report <ChevronRight size={14} /></Link></div>}</section>
      <AppDialog open={profileOpen} onClose={() => setProfileOpen(false)} title="Profile details" eyebrow="DEMO PROFILE"><p className="cf-dialog-subcopy">This demo profile is sample content for Northstar University. Profile editing will be available when CampusFind has campus accounts.</p><button className="cf-button cf-button-primary cf-button-wide" onClick={() => setProfileOpen(false)}>Sounds good</button></AppDialog>
      <ItemDetailsDialog item={details} onClose={() => setDetails(null)} onContact={(item) => { setDetails(null); setContact(item); }} /><ContactDialog item={contact} onClose={() => setContact(null)} />
    </div>
  );
}
