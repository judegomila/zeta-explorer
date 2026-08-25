import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { InlineMath, BlockMath } from '../KaTeXMath.jsx';
import { NAV_GROUPS } from '../../data/nav-groups.js';

// Drop the version/parenthetical suffix for the compact top-bar button label.
const shortLabel = (s) => s.replace(/\s*\(.*\)\s*$/, '');

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
        {shortLabel(label)} <span className="ed-ddcaret">▾</span>
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
            <Link to="/atlas">Atlas</Link>
            <Link to="/directory">Directory</Link>
            {NAV_GROUPS.map((g) => <NavDropdown key={g.label} label={g.label} items={g.items} />)}
          </nav>
          <div className="ed-headright">
            <a className="ed-headnav" style={{ color: 'var(--ink-soft)' }} href="https://github.com/judegomila/mathexplorer" target="_blank" rel="noreferrer">GitHub ↗</a>
            <button type="button" className="ed-search" onClick={openPalette} aria-label="Search pages">
              Search <kbd>⌘K</kbd>
            </button>
            {ticker && <div className="ed-tick"><span className="ed-pulse" />{ticker}</div>}
          </div>
        </div>
      </div>
    </header>
  );
}

export function GradeChip({ grade, children }) {
  const cls = { CANDIDATE: 'g-cand', THEOREM: 'g-thm', 'NO-GO': 'g-nogo', MAP: 'g-map',
    AUDIT: 'g-map', VERIFIED: 'g-ver', RESULT: 'g-thm', ENGINE: 'g-run', COLLAPSE: 'g-thm' };
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
