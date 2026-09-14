import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { InlineMath, BlockMath } from '../KaTeXMath.jsx';
import { NAV_GROUPS } from '../../data/nav-groups.js';

// Drop the version/parenthetical suffix for the compact top-bar button label.
const shortLabel = (s) => s.replace(/\s*\(.*\)\s*$/, '');


// Minimal line icons for the top-bar groups — thin geometric strokes matching
// the wireframe aesthetic; currentColor so they follow link/hover colors.
function NavIcon({ name }) {
  const P = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' };
  const paths = {
    atlas: <g {...P}><circle cx="12" cy="12" r="9" /><path d="M12 3v18M3 12h18M5.5 6.5c3.5 2.5 9.5 2.5 13 0M5.5 17.5c3.5-2.5 9.5-2.5 13 0" /></g>,
    directory: <g {...P}><path d="M5 6h14M5 12h14M5 18h9" /></g>,
    research: <g {...P}><circle cx="10.5" cy="10.5" r="6" /><path d="M15 15l5 5" /></g>,
    model: <g {...P}><path d="M4 15c2-6 4-6 6 0s4 6 6 0 3-4 4-3" /></g>,
    analysis: <g {...P}><path d="M4 19V5M4 19h16" /><path d="M6.5 15l4-6 3.5 4 4.5-7" /></g>,
    ladder: <g {...P}><path d="M8 3v18M16 3v18M8 7h8M8 12h8M8 17h8" /></g>,
    viz: <g {...P}><path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6z" /><circle cx="12" cy="12" r="2.6" /></g>,
    attack: <g {...P}><circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="4.5" /><path d="M12 12h.01" /></g>,
    proof: <g {...P}><path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" /><path d="M9 12l2.2 2.2L15.5 9.5" /></g>,
    progress: <g {...P}><path d="M4 19V5M4 19h16" /><path d="M7 15l3.5-4 3 2.5L18 8" /><path d="M18 11V8h-3" /></g>,
    reference: <g {...P}><path d="M5 4h11a3 3 0 013 3v13H8a3 3 0 01-3-3V4z" /><path d="M5 17a3 3 0 013-3h11" /></g>,
  };
  const el = paths[name];
  if (!el) return null;
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" aria-hidden="true"
      style={{ marginRight: 5, verticalAlign: '-2px', opacity: 0.75 }}>
      {el}
    </svg>
  );
}

// Map group labels (post-shortLabel) to icons.
const GROUP_ICON = {
  Research: 'research', Model: 'model', Analysis: 'analysis',
  'Twin-Ladder Program': 'ladder', Visualizations: 'viz', Attack: 'attack',
  'Proof Tools': 'proof', Progress: 'progress', Reference: 'reference',
};

function NavDropdown({ label, items }) {
  const [open, setOpen] = useState(false);
  const timer = useRef();
  // Hover-intent: a short close delay so moving the mouse into the panel
  // (across any small gap) doesn't dismiss it.
  const show = () => { clearTimeout(timer.current); setOpen(true); };
  const hide = () => { clearTimeout(timer.current); timer.current = setTimeout(() => setOpen(false), 180); };
  return (
    <div className="ed-ddwrap" onMouseEnter={show} onMouseLeave={hide}>
      <button type="button" className="ed-ddbtn" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        <NavIcon name={GROUP_ICON[shortLabel(label)]} />{shortLabel(label)} <span className="ed-ddcaret">▾</span>
      </button>
      {open && (
        <div className="ed-ddpanel" onMouseEnter={show} onMouseLeave={hide}>
          {items.map((it) => (
            <Link key={it.to} to={it.to} onClick={() => setOpen(false)}>{it.label}</Link>
          ))}
        </div>
      )}
    </div>
  );
}

function openPalette() {
  if (typeof window !== 'undefined') window.dispatchEvent(new Event('open-command-palette'));
}

/* ---------------------------------------------------------------------------
   Editorial design-system primitives. Everything renders inside .ed-root so the
   scoped editorial.css theme applies and nothing leaks to the legacy dark app.
   Shared by the battle-station home and every post-style explanation page.
   ------------------------------------------------------------------------- */

// Cream in-page header for editorial routes (the legacy NavBar hides itself on
// these routes — see App.jsx NavBar). Keeps app navigation reachable via links.
export function EditorialHeader({ ticker }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();
  // Close the mobile menu whenever the route changes (SPA nav keeps the header
  // mounted, so an open menu would otherwise stay covering the new page).
  useEffect(() => { setMenuOpen(false); }, [pathname]);
  return (
    <header className="ed-head">
      <div className="ed-headbar">
        <Link className="ed-brand" to="/">zeta<i>explorer</i></Link>
        <button
          type="button"
          className="ed-burger"
          aria-label="Menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((o) => !o)}
        >
          {menuOpen ? '✕' : '☰'}
        </button>
        <div className={menuOpen ? 'ed-headcollapse open' : 'ed-headcollapse'}>
          <nav className="ed-headnav">
            <Link to="/atlas"><NavIcon name="atlas" />Atlas</Link>
            <Link to="/directory"><NavIcon name="directory" />Directory</Link>
            {NAV_GROUPS.map((g) => <NavDropdown key={g.label} label={g.label} items={g.items} />)}
          </nav>
          <div className="ed-headright">
            <a className="ed-headnav" style={{ color: 'var(--ink-soft)' }} href="https://github.com/judegomila/mathexplorer" target="_blank" rel="noreferrer">GitHub ↗</a>
            <button type="button" className="ed-search" onClick={openPalette} aria-label="Search pages">
              Search <kbd>⌘K</kbd>
            </button>
                      </div>
        </div>
      </div>
    </header>
  );
}

export function GradeChip({ grade, children }) {
  const cls = { CANDIDATE: 'g-cand', THEOREM: 'g-thm', 'NO-GO': 'g-nogo', MAP: 'g-map',
    AUDIT: 'g-map', VERIFIED: 'g-ver', RESULT: 'g-thm', ENGINE: 'g-run', COLLAPSE: 'g-thm',
    CONTRACT: 'g-cand' };
  return <span className={`ed-grade ${cls[grade] || 'g-map'}`}>{children || grade}</span>;
}

export function TheoremBox({ label = 'Theorem', children }) {
  return (
    <div className="ed-thm">
      <div className="tlab">{label}</div>
      <div>{children}</div>
    </div>
  );
}

export function Figure({ children, caption }) {
  return (
    <figure className="ed-figure">
      <div className="frame">{children}</div>
      {caption && <figcaption className="ed-figcap">{caption}</figcaption>}
    </figure>
  );
}

export function Pull({ children }) {
  return <div className="ed-pull">{children}</div>;
}

export { InlineMath, BlockMath };

/* Full post reading-view: narrow column, article head, prose. */
export default function PostLayout({ grade, meta = [], title, dek, byline, children, footer, ticker }) {
  return (
    <div className="ed-root ed-prose">
      <EditorialHeader ticker={ticker} />
      <article className="ed-col">
        <div className="ed-artmeta">
          {grade && <GradeChip grade={grade} />}
          {meta.map((m, i) => <span key={i}>{i > 0 ? '· ' : ''}{m}</span>)}
        </div>
        <h1 className="ed-h1">{title}</h1>
        {dek && <div className="ed-dek">{dek}</div>}
        {byline && (
          <div className="ed-byline">
            {Array.isArray(byline) ? byline.map((b, i) => <span key={i}>{b}</span>) : <span>{byline}</span>}
          </div>
        )}
        {children}
        {footer && <div className="ed-postfoot">{footer}</div>}
      </article>
    </div>
  );
}
