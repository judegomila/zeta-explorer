import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { InlineMath, BlockMath } from '../KaTeXMath.jsx';
import { NAV_GROUPS } from '../../data/nav-groups.js';
import { NAV_COLLAPSE_PX } from '../../styles/tokens.js';
import '../../styles/header.css';

// Drop the version/parenthetical suffix for a compact label (kept for callers).
export const shortLabel = (s) => s.replace(/\s*\(.*\)\s*$/, '');

const GITHUB_URL = 'https://github.com/judegomila/zeta-explorer';

// Minimal line icons for the top-bar groups; currentColor so they follow
// link/hover colors.
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
    <svg className="ed-navicon" width="13" height="13" viewBox="0 0 24 24" aria-hidden="true">
      {el}
    </svg>
  );
}

// Group label -> icon.
const GROUP_ICON = {
  Overview: 'atlas', 'Bounds on Λ': 'progress', 'Routes to RH': 'attack',
  'Twin-ladder model': 'ladder', Visualize: 'viz', Records: 'reference',
};

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'x';

// Split a group's sections into `k` contiguous columns with the smallest
// possible tallest column (a heading counts as one row).
function packColumns(sections, k) {
  const w = sections.map((s) => s.items.length + 1.5);
  const n = w.length;
  if (k <= 1 || n <= 1) return [sections];
  k = Math.min(k, n);
  const pre = [0];
  for (const x of w) pre.push(pre[pre.length - 1] + x);
  const best = Array.from({ length: k + 1 }, () => Array(n + 1).fill(Infinity));
  const cut = Array.from({ length: k + 1 }, () => Array(n + 1).fill(0));
  best[0][0] = 0;
  for (let c = 1; c <= k; c++) {
    for (let i = 1; i <= n; i++) {
      for (let j = c - 1; j < i; j++) {
        const v = Math.max(best[c - 1][j], pre[i] - pre[j]);
        if (v < best[c][i]) { best[c][i] = v; cut[c][i] = j; }
      }
    }
  }
  const cols = [];
  let i = n;
  for (let c = k; c >= 1; c--) { const j = cut[c][i]; cols.unshift(sections.slice(j, i)); i = j; }
  return cols;
}

export function groupColumns(group) {
  return Math.min(3, Math.ceil(group.items.length / 12));
}

function focusables(root) {
  if (!root) return [];
  return Array.from(root.querySelectorAll('a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])'))
    .filter((el) => el.getClientRects().length > 0);
}

/* ---------------------------------------------------------------------------
   Shared dropdown behaviour for the desktop nav row (editorial + classic).
   One group open at a time; hover intent; click toggles; Escape closes and
   returns focus; click outside closes; ArrowDown on a button opens the panel
   and focuses its first link; ArrowUp/ArrowDown/Home/End move inside a panel.
   ------------------------------------------------------------------------- */
export function useDropdownRow() {
  const [openIdx, setOpenIdx] = useState(-1);
  const timer = useRef();
  const hoverAt = useRef(0);
  const rowRef = useRef(null);
  const { pathname } = useLocation();

  useEffect(() => { setOpenIdx(-1); }, [pathname]);
  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => {
    if (openIdx < 0) return undefined;
    const onDown = (e) => { if (rowRef.current && !rowRef.current.contains(e.target)) setOpenIdx(-1); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('touchstart', onDown, { passive: true });
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('touchstart', onDown);
    };
  }, [openIdx]);

  return {
    openIdx,
    rowRef,
    pathname,
    open: (i) => { clearTimeout(timer.current); setOpenIdx(i); },
    close: () => { clearTimeout(timer.current); setOpenIdx(-1); },
    hoverOpen: (i) => {
      clearTimeout(timer.current);
      setOpenIdx((cur) => { if (cur !== i) hoverAt.current = Date.now(); return i; });
    },
    hoverClose: () => { clearTimeout(timer.current); timer.current = setTimeout(() => setOpenIdx(-1), 180); },
    // A click right after a hover-open (mouse, or touch emulating hover) keeps
    // the panel open instead of immediately closing it.
    toggle: (i) => {
      clearTimeout(timer.current);
      setOpenIdx((cur) => (cur === i && Date.now() - hoverAt.current > 400 ? -1 : i));
    },
  };
}

export const ED_DD_CLASSES = {
  wrap: 'ed-ddwrap', btn: 'ed-ddbtn', caret: 'ed-ddcaret', panel: 'ed-ddpanel',
  col: 'ed-ddcol', sec: 'ed-ddsec', head: 'ed-ddhead',
};

export function GroupDropdown({ group, idx, row, classes = ED_DD_CLASSES, idPrefix = 'ed-dd', showIcon = true }) {
  const open = row.openIdx === idx;
  const wrapRef = useRef(null);
  const btnRef = useRef(null);
  const panelRef = useRef(null);
  const focusFirst = useRef(false);
  const [shift, setShift] = useState(0);
  const active = group.items.some((it) => it.to === row.pathname);
  const k = groupColumns(group);
  const cols = packColumns(group.sections, k);
  const panelId = `${idPrefix}-${slug(group.label)}`;

  // Keep the open panel inside the viewport: shift it left when its right edge
  // would overflow (right-aligned to the viewport margin), never past the left margin.
  useLayoutEffect(() => {
    if (!open) { setShift(0); return; }
    const wrap = wrapRef.current; const panel = panelRef.current;
    if (!wrap || !panel) return;
    const vw = document.documentElement.clientWidth;
    const left0 = wrap.getBoundingClientRect().left;
    const width = panel.offsetWidth;
    let s = 0;
    if (left0 + width > vw - 8) s = vw - 8 - width - left0;
    if (left0 + s < 8) s = 8 - left0;
    setShift(Math.round(s));
  }, [open]);

  useEffect(() => {
    if (open && focusFirst.current) {
      focusFirst.current = false;
      const links = focusables(panelRef.current);
      if (links[0]) links[0].focus();
    }
  }, [open]);

  const onBtnKey = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      focusFirst.current = true;
      if (open) { const links = focusables(panelRef.current); if (links[0]) links[0].focus(); } else row.open(idx);
    } else if (e.key === 'Escape' && open) {
      e.preventDefault();
      row.close();
    }
  };
  const onPanelKey = (e) => {
    const links = focusables(panelRef.current);
    const i = links.indexOf(document.activeElement);
    if (e.key === 'Escape') {
      e.preventDefault(); e.stopPropagation();
      row.close(); btnRef.current?.focus();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault(); links[Math.min(links.length - 1, i + 1)]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (i <= 0) btnRef.current?.focus(); else links[i - 1]?.focus();
    } else if (e.key === 'Home') {
      e.preventDefault(); links[0]?.focus();
    } else if (e.key === 'End') {
      e.preventDefault(); links[links.length - 1]?.focus();
    }
  };
  // Tabbing out of the group closes its panel.
  const onBlur = (e) => {
    const next = e.relatedTarget;
    if (open && next && wrapRef.current && !wrapRef.current.contains(next)) row.close();
  };

  return (
    <div
      ref={wrapRef}
      className={classes.wrap}
      onMouseEnter={() => row.hoverOpen(idx)}
      onMouseLeave={row.hoverClose}
      onBlur={onBlur}
    >
      <button
        ref={btnRef}
        type="button"
        className={classes.btn}
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls={panelId}
        aria-current={active ? 'true' : undefined}
        onClick={() => row.toggle(idx)}
        onKeyDown={onBtnKey}
      >
        {showIcon && <NavIcon name={GROUP_ICON[group.label]} />}
        {group.label}
        <span className={classes.caret} aria-hidden="true">▾</span>
      </button>
      <div
        ref={panelRef}
        id={panelId}
        className={classes.panel}
        hidden={!open}
        style={{ '--cols': cols.length, transform: shift ? `translateX(${shift}px)` : undefined }}
        onKeyDown={onPanelKey}
      >
        {cols.map((col, ci) => (
          <div key={ci} className={classes.col}>
            {col.map((sec) => {
              const hid = `${panelId}-${slug(sec.heading)}`;
              return (
                <div key={sec.heading} className={classes.sec} role="group" aria-labelledby={hid}>
                  <div id={hid} className={classes.head}>{sec.heading}</div>
                  {sec.items.map((it) => (
                    <NavLink key={it.to} to={it.to} end onClick={row.close}>{it.label}</NavLink>
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------------
   Mobile/narrow menu behaviour shared by both headers: focus trap over
   [burger, ...panel], Escape closes and refocuses the burger, body scroll lock,
   closes on route change and when the viewport widens past NAV_COLLAPSE_PX.
   ------------------------------------------------------------------------- */
export function useMenuPanel({ burgerRef, panelRef, onOpenFocus }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined;
    const mq = window.matchMedia(`(min-width: ${NAV_COLLAPSE_PX}px)`);
    const onChange = (e) => { if (e.matches) setMenuOpen(false); };
    mq.addEventListener ? mq.addEventListener('change', onChange) : mq.addListener(onChange);
    return () => { mq.removeEventListener ? mq.removeEventListener('change', onChange) : mq.removeListener(onChange); };
  }, []);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const body = document.body;
    const prev = body.style.overflow;
    body.style.overflow = 'hidden';
    const t = setTimeout(() => {
      const first = onOpenFocus ? onOpenFocus() : focusables(panelRef.current)[0];
      if (first) first.focus();
    }, 0);
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setMenuOpen(false);
        burgerRef.current?.focus();
        return;
      }
      if (e.key !== 'Tab') return;
      const list = [burgerRef.current, ...focusables(panelRef.current)].filter(Boolean);
      if (list.length === 0) return;
      e.preventDefault();
      const i = list.indexOf(document.activeElement);
      const next = e.shiftKey ? (i <= 0 ? list.length - 1 : i - 1) : (i < 0 || i >= list.length - 1 ? 0 : i + 1);
      list[next].focus();
    };
    document.addEventListener('keydown', onKey);
    return () => {
      clearTimeout(t);
      body.style.overflow = prev;
      document.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  return [menuOpen, setMenuOpen];
}

function MobileGroup({ group, idx, expanded, onToggle, pathname, btnRef }) {
  const bodyId = `ed-navgrp-${slug(group.label)}`;
  const active = group.items.some((it) => it.to === pathname);
  return (
    <div className="ed-navgrp">
      <button
        ref={btnRef}
        type="button"
        className="ed-navgrp-btn"
        aria-expanded={expanded}
        aria-controls={bodyId}
        aria-current={active ? 'true' : undefined}
        onClick={() => onToggle(idx)}
      >
        <span><NavIcon name={GROUP_ICON[group.label]} />{group.label}</span>
        <svg className="ed-navgrp-chev" width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <div id={bodyId} className="ed-navgrp-body" hidden={!expanded}>
        {group.sections.map((sec) => {
          const hid = `${bodyId}-${slug(sec.heading)}`;
          return (
            <div key={sec.heading} className="ed-navgrp-sec" role="group" aria-labelledby={hid}>
              <div id={hid} className="ed-ddhead">{sec.heading}</div>
              {sec.items.map((it) => (
                <NavLink key={it.to} to={it.to} end>{it.label}</NavLink>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function openPalette() {
  if (typeof window !== 'undefined') window.dispatchEvent(new Event('open-command-palette'));
}

/* ---------------------------------------------------------------------------
   Editorial design-system primitives. Everything renders inside .ed-root so the
   scoped editorial.css theme applies and nothing leaks to the legacy dark app.
   Shared by the dashboard home and every post-style explanation page.
   ------------------------------------------------------------------------- */

// Cream site header for editorial routes (the classic NavBar hides itself on
// these routes; see App.jsx AppShell). At >= NAV_COLLAPSE_PX it shows the six
// group dropdowns; below that, brand + Search + a burger that opens a panel.
export function EditorialHeader({ ticker }) { // eslint-disable-line no-unused-vars
  const row = useDropdownRow();
  const { pathname } = row;
  const headRef = useRef(null);
  const burgerRef = useRef(null);
  const panelRef = useRef(null);
  const groupBtnRefs = useRef([]);
  const [expanded, setExpanded] = useState(() => new Set());
  const [panelTop, setPanelTop] = useState(56);
  const [menuOpen, setMenuOpen] = useMenuPanel({
    burgerRef, panelRef, onOpenFocus: () => groupBtnRefs.current[0],
  });

  const openMenu = () => {
    const cur = NAV_GROUPS.findIndex((g) => g.items.some((it) => it.to === pathname));
    setExpanded(new Set(cur >= 0 ? [cur] : []));
    const b = headRef.current?.getBoundingClientRect().bottom;
    setPanelTop(Math.max(0, Math.round(b ?? 56)));
    setMenuOpen(true);
  };
  const toggleGroup = (i) => setExpanded((s) => {
    const n = new Set(s);
    if (n.has(i)) n.delete(i); else n.add(i);
    return n;
  });

  return (
    <header className="ed-head" ref={headRef}>
      <div className="ed-headbar">
        <Link className="ed-brand" to="/" aria-label="zetaexplorer home">zeta<i>explorer</i></Link>
        <nav className="ed-headnav" aria-label="Site sections" ref={row.rowRef}>
          {NAV_GROUPS.map((g, i) => <GroupDropdown key={g.label} group={g} idx={i} row={row} />)}
        </nav>
        <div className="ed-headright">
          <a className="ed-gh" href={GITHUB_URL} target="_blank" rel="noreferrer" aria-label="GitHub repository" title="GitHub repository">
            <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
            </svg>
          </a>
          <button type="button" className="ed-search" onClick={openPalette} aria-label="Search pages">
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.5" />
              <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <span className="ed-search-txt">Search</span>
            <kbd>⌘K</kbd>
          </button>
          <button
            ref={burgerRef}
            type="button"
            className="ed-burger"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="ed-navpanel"
            onClick={() => (menuOpen ? setMenuOpen(false) : openMenu())}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
              {menuOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>
      {menuOpen && (
        <div className="ed-navbackdrop" style={{ top: panelTop }} onClick={() => setMenuOpen(false)} aria-hidden="true" />
      )}
      <div
        id="ed-navpanel"
        ref={panelRef}
        className="ed-navpanel"
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        hidden={!menuOpen}
        style={{ top: panelTop, maxHeight: `calc(100dvh - ${panelTop}px)` }}
      >
        {NAV_GROUPS.map((g, i) => (
          <MobileGroup
            key={g.label}
            group={g}
            idx={i}
            expanded={expanded.has(i)}
            onToggle={toggleGroup}
            pathname={pathname}
            btnRef={(el) => { groupBtnRefs.current[i] = el; }}
          />
        ))}
        <div className="ed-navpanel-foot">
          <a href={GITHUB_URL} target="_blank" rel="noreferrer">GitHub ↗</a>
        </div>
      </div>
    </header>
  );
}

export function GradeChip({ grade, children }) {
  const cls = {
    CANDIDATE: 'g-cand', CONDITIONAL: 'g-cond',
    THEOREM: 'g-thm', RESULT: 'g-thm', COLLAPSE: 'g-thm',
    VERIFIED: 'g-ver', CERTIFIED: 'g-ver', FORMAL: 'g-ver',
    'NO-GO': 'g-nogo', REFUTED: 'g-ref',
    MAP: 'g-map', AUDIT: 'g-map', CONTRACT: 'g-map', ENGINE: 'g-run',
    MEASURED: 'g-meas', 'RH-EQUIVALENT': 'g-rheq',
  };
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
