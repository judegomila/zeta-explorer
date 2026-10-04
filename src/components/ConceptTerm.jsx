/**
 * <ConceptTerm slug="theta-trap">Θ-trap</ConceptTerm>  (or term="Θ-trap")
 *
 * Renders its children with a dotted underline. Hover, keyboard focus or a tap shows a tooltip
 * (role="tooltip", linked by aria-describedby) with the concept name, its short definition and a
 * "Read more →" link to /concept/<slug>. Clicking the term navigates to the concept page.
 *
 * Touch: the first tap opens the tooltip, a second tap on the term (or a tap on "Read more")
 * navigates; tapping elsewhere closes it. Escape closes it. The tooltip stays open while the
 * pointer is over it and is positioned (fixed, portalled) so that it stays inside the viewport.
 *
 * `nested`: set when the term sits inside another link (e.g. a home-page tile). The term then
 * renders as a <span role="link"> and navigates programmatically, so no <a> is nested in an <a>.
 *
 * The registry is loaded lazily (see conceptRegistryClient.js). Until it resolves the children
 * render as plain text; an unknown slug/term also renders plain text.
 */
import React, { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, useNavigate } from 'react-router-dom';
import { useConceptIndex, resolveConcept } from './conceptRegistryClient.js';
import '../styles/concept-term.css';

const MARGIN = 8;
const OPEN_DELAY = 90;
const CLOSE_DELAY = 160;

export function conceptPath(slug) {
  return `/concept/${slug}`;
}

export default function ConceptTerm({ slug, term, children, nested = false, className = '', label, marker = false }) {
  const idx = useConceptIndex();
  const concept = idx ? resolveConcept(idx, slug || term || (typeof children === 'string' ? children : '')) : null;
  const navigate = useNavigate();
  const tipId = useId();
  const anchorRef = useRef(null);
  const tipRef = useRef(null);
  const timer = useRef(null);
  const lastPointer = useRef({ type: '', at: 0 });
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState(null);
  const [container, setContainer] = useState(null);

  const content = children ?? concept?.term ?? term ?? slug;

  const clear = () => { clearTimeout(timer.current); timer.current = null; };
  const show = useCallback((delay = 0) => {
    clear();
    if (delay) timer.current = setTimeout(() => setOpen(true), delay);
    else setOpen(true);
  }, []);
  const hide = useCallback((delay = 0) => {
    clear();
    if (delay) timer.current = setTimeout(() => setOpen(false), delay);
    else setOpen(false);
  }, []);
  useEffect(() => () => clear(), []);

  // Portal into the nearest themed root so the tooltip picks up the editorial tokens when the
  // term is on an editorial page and the classic tokens otherwise.
  useLayoutEffect(() => {
    if (!open || !anchorRef.current) return;
    setContainer(anchorRef.current.closest('.ed-root') || document.body);
  }, [open]);

  const place = useCallback(() => {
    const a = anchorRef.current; const t = tipRef.current;
    if (!a || !t) return;
    const r = a.getClientRects()[0] || a.getBoundingClientRect();
    const vw = document.documentElement.clientWidth || window.innerWidth;
    const vh = window.innerHeight;
    const w = t.offsetWidth; const h = t.offsetHeight;
    let left = r.left + r.width / 2 - w / 2;
    left = Math.max(MARGIN, Math.min(left, vw - w - MARGIN));
    let top = r.bottom + 6;
    let placement = 'below';
    if (top + h > vh - MARGIN && r.top - h - 6 >= MARGIN) { top = r.top - h - 6; placement = 'above'; }
    top = Math.max(MARGIN, Math.min(top, vh - h - MARGIN));
    setPos({ left: Math.round(left), top: Math.round(top), placement });
  }, []);

  useLayoutEffect(() => {
    if (!open) { setPos(null); return undefined; }
    place();
    const onMove = () => place();
    window.addEventListener('scroll', onMove, true);
    window.addEventListener('resize', onMove);
    return () => {
      window.removeEventListener('scroll', onMove, true);
      window.removeEventListener('resize', onMove);
    };
  }, [open, container, place]);

  // Escape closes; a pointer press outside the term and the tooltip closes.
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') { e.stopPropagation(); hide(); }
    };
    const onDown = (e) => {
      const a = anchorRef.current; const t = tipRef.current;
      if ((a && a.contains(e.target)) || (t && t.contains(e.target))) return;
      hide();
    };
    document.addEventListener('keydown', onKey, true);
    document.addEventListener('pointerdown', onDown, true);
    return () => {
      document.removeEventListener('keydown', onKey, true);
      document.removeEventListener('pointerdown', onDown, true);
    };
  }, [open, hide]);

  if (!concept) {
    return <span className={className}>{content}</span>;
  }

  const to = conceptPath(concept.slug);

  const onPointerDown = (e) => { lastPointer.current = { type: e.pointerType, at: Date.now() }; };
  const onPointerEnter = (e) => { if (e.pointerType === 'mouse') show(OPEN_DELAY); };
  const onPointerLeave = (e) => { if (e.pointerType === 'mouse') hide(CLOSE_DELAY); };
  const onFocus = () => {
    // A focus caused by a press is handled by the click (touch) or by hover (mouse).
    if (Date.now() - lastPointer.current.at < 800) return;
    show();
  };
  const onBlur = (e) => {
    if (tipRef.current && e.relatedTarget && tipRef.current.contains(e.relatedTarget)) return;
    hide(CLOSE_DELAY);
  };
  const onKeyDown = (e) => {
    if (e.key === 'Escape' && open) { e.preventDefault(); e.stopPropagation(); hide(); }
    if (nested && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault(); e.stopPropagation(); hide(); navigate(to);
    }
  };
  const onClick = (e) => {
    const lp = lastPointer.current;
    const touch = (lp.type === 'touch' || lp.type === 'pen') && Date.now() - lp.at < 1500;
    lastPointer.current = { type: '', at: 0 };
    if (touch && !open) {
      // First tap: show the definition instead of navigating.
      e.preventDefault(); e.stopPropagation(); show();
      return;
    }
    hide();
    if (nested) { e.preventDefault(); e.stopPropagation(); navigate(to); }
    else e.stopPropagation();
  };

  const common = {
    ref: anchorRef,
    className: `ct-term${marker ? ' ct-marker' : ''}${open ? ' ct-open' : ''}${className ? ` ${className}` : ''}`,
    'aria-describedby': open ? tipId : undefined,
    'aria-label': label || (marker ? `Concept: ${concept.term}` : undefined),
    onPointerDown, onPointerEnter, onPointerLeave, onFocus, onBlur, onKeyDown, onClick,
  };

  const tip = open && container ? createPortal(
    <span
      ref={tipRef}
      id={tipId}
      role="tooltip"
      className={`ct-tip ct-${pos?.placement || 'below'}`}
      style={pos ? { left: pos.left, top: pos.top } : { left: -9999, top: 0, visibility: 'hidden' }}
      onPointerEnter={(e) => { if (e.pointerType === 'mouse') clear(); }}
      onPointerLeave={(e) => { if (e.pointerType === 'mouse') hide(CLOSE_DELAY); }}
      onClick={(e) => e.stopPropagation()}
    >
      <span className="ct-tip-term">{concept.term}</span>
      <span className="ct-tip-def">{concept.short}</span>
      <Link className="ct-tip-more" to={to} onClick={() => hide()} onBlur={() => hide(CLOSE_DELAY)}>
        Read more →
      </Link>
    </span>,
    container,
  ) : null;

  return (
    <>
      {nested ? (
        <span {...common} role="link" tabIndex={0} data-href={`#${to}`}>{marker ? '↗' : content}</span>
      ) : (
        <Link {...common} to={to}>{marker ? '↗' : content}</Link>
      )}
      {tip}
    </>
  );
}
