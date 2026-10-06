import { Bell, Check, CheckCheck, MapPin, Sparkles, X } from "lucide-react";
import { Link } from "wouter";
import { formatCampusDateLong } from "../components/ItemCard";
import { useCampusStore } from "../lib/campusfind-store";

export default function Notifications() {
  const { notifications, dismissNotification, markNotificationRead } = useCampusStore();
  const unread = notifications.filter((notification) => !notification.read).length;
  return (
    <div className="cf-page-stack">
      <section className="cf-welcome-row"><div><div className="cf-eyebrow">A GOOD LITTLE UPDATE <span className="cf-eyebrow-spark">✳</span> MATCH ALERTS</div><h1>Notifications<span className="cf-heading-dot">.</span></h1><p>The kind of ping you’re always happy to get.</p></div><span className="cf-notification-summary"><Bell size={15} /> {unread} unread</span></section>
      <section className="cf-notification-center"><div className="cf-notification-heading"><div><div className="cf-section-kicker">YOUR MATCH MOMENTS</div><h2>A little progress, in real time.</h2></div><span className="cf-notif-count-pill"><span />{notifications.length} updates</span></div>
        {notifications.length ? <div className="cf-notification-list">{notifications.map((note) => <article className={`cf-notification-card ${note.read ? "is-read" : ""}`} key={note.id}><span className="cf-notification-card-icon"><Sparkles size={19} /></span><div className="cf-notification-card-main"><div className="cf-notification-title-row"><h3>{note.title}</h3>{!note.read && <span className="cf-new-label">NEW</span>}</div><p>{note.body}</p><div className="cf-notification-meta"><span><MapPin size={13} />Found near {note.location}</span><span>·</span><span>{formatCampusDateLong(note.date)}</span><span className="cf-notification-match"><Sparkles size={13} />{note.matchScore}% match</span></div><div className="cf-notification-actions"><Link className="cf-button cf-button-primary cf-button-small" href="/matches" onClick={() => markNotificationRead(note.id)}>View Match <Check size={14} /></Link><button className="cf-text-button" onClick={() => dismissNotification(note.id)}><X size={14} />Dismiss</button></div></div><span className="cf-notification-card-glow" /></article>)}</div> : <div className="cf-empty-state"><span><CheckCheck size={22} /></span><h3>All caught up.</h3><p>New match moments will show up here as campus posts arrive.</p><Link className="cf-button cf-button-outline" href="/dashboard">Back to dashboard</Link></div>}
        <div className="cf-notifications-footnote"><CheckCheck size={15} /><span><strong>That’s everything for now.</strong><small>Dismissed notifications stay dismissed in this browser.</small></span></div>
      </section>
    </div>
  );
}
