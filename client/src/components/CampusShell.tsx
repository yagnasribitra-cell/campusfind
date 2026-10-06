import { useState, type ReactNode } from "react";
import { Link, useLocation } from "wouter";
import {
  Bell,
  BookOpen,
  ChevronRight,
  Home,
  MapPin,
  Menu,
  PackageSearch,
  Plus,
  Search,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { useCampusStore } from "../lib/campusfind-store";
import { AppDialog } from "./AppDialog";

const NAV = [
  { label: "Dashboard", href: "/dashboard", icon: Home },
  { label: "Lost Items", href: "/lost", icon: Search },
  { label: "Found Items", href: "/found", icon: PackageSearch },
  { label: "Smart Matches", href: "/matches", icon: Sparkles },
  { label: "Campus Map", href: "/map", icon: MapPin },
  { label: "Report Item", href: "/report", icon: Plus },
  { label: "Notifications", href: "/notifications", icon: Bell },
  { label: "My Profile", href: "/profile", icon: UserRound },
];

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className={`cf-brand ${compact ? "cf-brand-compact" : ""}`} aria-label="CampusFind home">
      <span className="cf-brand-icon" aria-hidden="true">
        <svg viewBox="0 0 40 40" fill="none">
          <path d="M20 35s12-10.3 12-20A12 12 0 0 0 8 15c0 9.7 12 20 12 20Z" fill="currentColor" />
          <circle cx="20" cy="15" r="6.1" fill="#14233B" />
          <path d="m20 10.2 1.4 3 3.2 1.3-3.2 1.3-1.4 3-1.3-3-3.1-1.3 3.1-1.3 1.3-3Z" fill="#79F0F0" />
        </svg>
      </span>
      {!compact && <span className="cf-brand-word">Campus<span>Find</span></span>}
    </Link>
  );
}

export function CampusShell({ children }: { children: ReactNode }) {
  const [path] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const { notifications } = useCampusStore();
  const unread = notifications.filter((notification) => !notification.read).length;

  return (
    <div className={`cf-app-shell ${mobileOpen ? "cf-mobile-open" : ""}`}>
      {mobileOpen && <button className="cf-mobile-backdrop" aria-label="Close navigation" onClick={() => setMobileOpen(false)} />}
      <aside className="cf-sidebar">
        <div className="cf-sidebar-top">
          <BrandMark />
          <button className="cf-icon-button cf-mobile-close" aria-label="Close navigation" onClick={() => setMobileOpen(false)}>
            <X size={19} />
          </button>
        </div>
        <div className="cf-campus-chip"><span className="cf-campus-dot" /> Northstar University</div>
        <p className="cf-nav-label">WORKSPACE</p>
        <nav className="cf-side-nav" aria-label="Main navigation">
          {NAV.map(({ label, href, icon: Icon }) => {
            const active = path === href;
            const badge = href === "/notifications" && unread > 0;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={`cf-nav-link ${active ? "is-active" : ""}`}
                aria-current={active ? "page" : undefined}
              >
                <Icon size={18} strokeWidth={active ? 2.2 : 1.8} />
                <span>{label}</span>
                {badge && <span className="cf-nav-count">{unread}</span>}
                {label === "Smart Matches" && <span className="cf-nav-spark"><Sparkles size={12} /></span>}
              </Link>
            );
          })}
        </nav>
        <div className="cf-sidebar-spacer" />
        <div className="cf-sidebar-tip">
          <span className="cf-tip-icon"><BookOpen size={16} /></span>
          <strong>A little kindness goes a long way.</strong>
          <span>Found something? Help it find its way home.</span>
          <Link href="/report" onClick={() => setMobileOpen(false)}>Post a found item <ChevronRight size={14} /></Link>
        </div>
        <Link href="/profile" className="cf-sidebar-profile" onClick={() => setMobileOpen(false)}>
          <img src="/profile-sky.svg" alt="" />
          <span><strong>Alex Morgan</strong><small>Computer Science</small></span>
          <ChevronRight size={16} />
        </Link>
      </aside>

      <div className="cf-app-main">
        <header className="cf-topbar">
          <button className="cf-icon-button cf-mobile-menu" aria-label="Open navigation" onClick={() => setMobileOpen(true)}>
            <Menu size={20} />
          </button>
          <div className="cf-topbar-campus"><span className="cf-campus-dot" /> Northstar University <span className="cf-topbar-slash">/</span> Lost & Found</div>
          <div className="cf-topbar-actions">
            <Link href="/notifications" className="cf-icon-button cf-notification-button" aria-label={`Notifications${unread ? `, ${unread} unread` : ""}`}>
              <Bell size={19} />{unread > 0 && <span className="cf-notification-dot" />}
            </Link>
            <button className="cf-button cf-button-small cf-button-outline" onClick={() => setAuthOpen(true)}>Log in</button>
            <Link className="cf-button cf-button-small cf-button-primary" href="/report"><Plus size={16} /> Report an item</Link>
          </div>
        </header>
        <main className="cf-page-content">{children}</main>
      </div>

      <AppDialog open={authOpen} onClose={() => setAuthOpen(false)} title="Your campus, a little more connected" eyebrow="DEMO ACCOUNT">
        <DemoAuth onDone={() => setAuthOpen(false)} />
      </AppDialog>
    </div>
  );
}

function DemoAuth({ onDone }: { onDone: () => void }) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    toast.success("Demo preview", { description: "Accounts will be connected when CampusFind adds its campus backend." });
    onDone();
  };

  return (
    <form className="cf-auth-form" onSubmit={submit}>
      <div className="cf-auth-tabs" role="tablist" aria-label="Choose sign in or sign up">
        <button type="button" role="tab" aria-selected={mode === "login"} className={mode === "login" ? "is-selected" : ""} onClick={() => setMode("login")}>Log in</button>
        <button type="button" role="tab" aria-selected={mode === "signup"} className={mode === "signup" ? "is-selected" : ""} onClick={() => setMode("signup")}>Sign up</button>
      </div>
      {mode === "signup" && <label className="cf-field">Your name<input required placeholder="Jordan Lee" autoComplete="name" /></label>}
      <label className="cf-field">Campus email<input required type="email" placeholder="you@northstar.edu" autoComplete="email" /></label>
      <label className="cf-field">Password<input required type="password" minLength={6} placeholder="At least 6 characters" autoComplete={mode === "login" ? "current-password" : "new-password"} /></label>
      <p className="cf-demo-note">This is a UI preview. No account or password is stored.</p>
      <button className="cf-button cf-button-primary cf-button-wide" type="submit">Continue <ChevronRight size={16} /></button>
    </form>
  );
}
