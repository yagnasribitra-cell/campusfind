import { ArrowDown, ArrowRight, ArrowUpRight, BadgeCheck, BookOpen, Box, Check, CheckCircle2, ChevronRight, Clock3, HeartHandshake, MapPin, PackageOpen, Search, ShieldCheck, Sparkles, Target } from "lucide-react";
import { Link } from "wouter";
import { BrandMark } from "../components/CampusShell";
import { CAMPUS_STATS, IMPACT_STATS } from "../lib/campusfind-data";

const STAT_ICONS = [PackageOpen, Sparkles, Clock3, Target];

export default function Home() {
  return (
    <div className="cf-landing-page">
      <header className="cf-site-header">
        <BrandMark />
        <nav className="cf-site-nav" aria-label="Landing page navigation">
          <a href="#how-it-works">How it works</a>
          <a href="#campus-impact">Our impact</a>
          <Link href="/dashboard">Explore the app</Link>
        </nav>
        <div className="cf-site-header-actions">
          <Link className="cf-site-login" href="/dashboard">Log in</Link>
          <Link className="cf-button cf-button-primary cf-site-start" href="/report">Get started <ArrowRight size={15} /></Link>
        </div>
      </header>

      <main>
        <section className="cf-hero">
          <div className="cf-hero-glow cf-glow-one" /><div className="cf-hero-glow cf-glow-two" />
          <div className="cf-hero-grid">
            <div className="cf-hero-copy">
              <div className="cf-hero-kicker"><span className="cf-kicker-pulse" />A little closer to found</div>
              <h1>Lost something?<br /><em>Let us find</em><br />the match.</h1>
              <p className="cf-hero-subtitle">Post a lost or found item and let our smart matcher connect it with the right person.</p>
              <div className="cf-hero-actions">
                <Link className="cf-button cf-button-primary cf-button-large" href="/report?type=lost"><Search size={17} />I Lost Something <ArrowRight size={16} /></Link>
                <Link className="cf-button cf-button-glass cf-button-large" href="/report?type=found"><Box size={17} />I Found Something</Link>
              </div>
              <div className="cf-hero-proof"><span className="cf-proof-faces"><i>A</i><i>J</i><i>M</i><i>+</i></span><span><strong>Small finds, big relief.</strong><br />For everyone on campus.</span></div>
            </div>

            <div className="cf-hero-visual" aria-label="Illustration of a lost item becoming a smart match and being found">
              <div className="cf-visual-topline"><span><i /> MATCHING LIVE</span><span>JUST NOW</span></div>
              <div className="cf-visual-path">
                <div className="cf-visual-item cf-visual-lost">
                  <span className="cf-visual-label">LOST ITEM</span>
                  <span className="cf-visual-object cf-object-earbuds"><span /><span /><i /></span>
                  <strong>Samsung earbuds</strong><small><MapPin size={12} /> Library · October 4</small>
                </div>
                <div className="cf-visual-match"><div className="cf-visual-match-orbit"><span><Sparkles size={19} /></span><i /><i /><i /></div><b>SMART<br />MATCHING</b></div>
                <div className="cf-visual-item cf-visual-found">
                  <span className="cf-visual-label">FOUND ITEM</span>
                  <span className="cf-visual-object cf-object-case"><span /><i /></span>
                  <strong>Wireless earbuds</strong><small><MapPin size={12} /> Central Library</small>
                </div>
              </div>
              <div className="cf-visual-result"><div className="cf-visual-result-icon"><Check size={18} /></div><span><strong>94% match</strong><small>Same category · nearby · same day</small></span><span className="cf-result-arrow"><ArrowUpRight size={16} /></span></div>
              <div className="cf-visual-foot"><span><span className="cf-campus-dot" /> Northstar University</span><span>Good things find their way</span></div>
              <div className="cf-visual-floating cf-float-pin"><MapPin size={15} /><span>Library</span></div>
              <div className="cf-visual-floating cf-float-badge"><CheckCircle2 size={16} /><span>One step closer</span></div>
            </div>
          </div>
          <a className="cf-hero-scroll" href="#community"><span>Take a look around</span><ArrowDown size={14} /></a>
        </section>

        <section className="cf-stat-ribbon" id="community" aria-label="CampusFind community stats">
          {CAMPUS_STATS.map((stat, index) => {
            const Icon = STAT_ICONS[index];
            return <div className="cf-stat-tile" key={stat.label}><span className={`cf-stat-icon cf-stat-icon-${index}`}><Icon size={17} /></span><span><strong>{stat.value}</strong><small>{stat.label}</small></span></div>;
          })}
        </section>

        <section className="cf-how-section" id="how-it-works">
          <div className="cf-section-intro"><div className="cf-section-kicker">THE RIGHT PLACE, RIGHT TIME</div><h2>A small clue can make<br /><em>a big difference.</em></h2><p>Three little details bring a lost item one step closer to home.</p></div>
          <div className="cf-how-flow">
            <article><span className="cf-step-no">01</span><div className="cf-how-icon how-lost"><Search size={20} /></div><h3>Tell us what’s missing</h3><p>Share the item, where you last saw it, and the day it went missing.</p><span className="cf-how-tag"><MapPin size={13} /> Category · Location · Date</span></article>
            <div className="cf-flow-dots"><i /><i /><i /><ArrowRight size={14} /></div>
            <article className="cf-how-featured"><span className="cf-step-no">02</span><div className="cf-how-icon how-match"><Sparkles size={20} /></div><h3>Let the smart match begin</h3><p>Our campus matcher lines up category, location, and date clues.</p><span className="cf-how-tag"><Target size={13} /> Your best match, first</span></article>
            <div className="cf-flow-dots"><i /><i /><i /><ArrowRight size={14} /></div>
            <article><span className="cf-step-no">03</span><div className="cf-how-icon how-home"><HeartHandshake size={20} /></div><h3>Make someone’s day</h3><p>Check the match, connect with the finder, and reunite with your item.</p><span className="cf-how-tag"><BadgeCheck size={13} /> A little kindness goes far</span></article>
          </div>
        </section>

        <section className="cf-match-feature">
          <div className="cf-match-feature-copy"><div className="cf-section-kicker">A BETTER KIND OF SEARCH</div><h2>Not just a list.<br /><em>A little bit of detective work.</em></h2><p>CampusFind looks for the details that make an item yours: what it is, where it turned up, and when you last had it.</p><Link className="cf-text-link" href="/matches">See the smart matcher <ArrowRight size={16} /></Link></div>
          <div className="cf-feature-score-card"><div className="cf-feature-card-head"><span><Sparkles size={15} /> MATCH BREAKDOWN</span><span className="cf-live-pill">SAMPLE MATCH</span></div><div className="cf-feature-card-item"><span className="cf-feature-item-icon"><BookOpen size={20} /></span><div><small>YOU LOST</small><strong>Black Samsung Earbuds</strong><span>Electronics · Library · October 4</span></div></div><div className="cf-feature-card-item"><span className="cf-feature-item-icon found-icon"><PackageOpen size={20} /></span><div><small>POSSIBLE FIND</small><strong>Black Wireless Earbuds</strong><span>Electronics · Central Library · October 4</span></div></div><div className="cf-score-line"><span><i /><b style={{ width: "94%" }} /></span><strong>94%</strong></div><div className="cf-feature-card-foot"><span><Check size={13} /> Category</span><span><Check size={13} /> Nearby</span><span><Check size={13} /> Same day</span></div></div>
        </section>

        <section className="cf-impact-section" id="campus-impact">
          <div className="cf-impact-copy"><div className="cf-section-kicker">GOOD THINGS FIND THEIR WAY</div><h2>Together, we're making<br />campus a little less <em>forgetful.</em></h2><p>A lost item is a small thing. Finding the person who cares about it can mean a lot.</p><div className="cf-impact-metrics">{IMPACT_STATS.map((stat) => <div key={stat.label}><strong>{stat.value}</strong><small>{stat.label}</small></div>)}</div></div>
          <figure className="cf-story-card"><div className="cf-story-quote-mark">“</div><blockquote>“I lost my ID card near the library. CampusFind matched it with a found-item post within minutes!”</blockquote><figcaption><img src="/profile-sky.svg" alt="Illustrated profile portrait of Alex Morgan" /><span><strong>Alex Morgan</strong><small>Computer Science · Year 3</small></span><span className="cf-story-check"><ShieldCheck size={19} /></span></figcaption><div className="cf-story-match"><CheckCircle2 size={15} /><span>ITEM REUNITED<small>At Northstar University</small></span><Sparkles size={18} /></div></figure>
        </section>

        <section className="cf-bottom-cta"><div className="cf-bottom-cta-orb" /><div><span className="cf-section-kicker">THE NEXT GOOD FIND STARTS WITH YOU</span><h2>Ready to bring something back?</h2><p>One quick post could be somebody’s whole good day.</p></div><Link className="cf-button cf-button-primary cf-button-large" href="/report">Make a report <ArrowRight size={16} /></Link></section>
      </main>
      <footer className="cf-site-footer"><BrandMark /><span>Made for the little things that matter on campus.</span><Link href="/dashboard">Open the CampusFind demo <ChevronRight size={14} /></Link></footer>
    </div>
  );
}
