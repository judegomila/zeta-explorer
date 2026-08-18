import React from 'react';
import { Link } from 'react-router-dom';
import { InlineMath, BlockMath } from '../KaTeXMath.jsx';

/* ---------------------------------------------------------------------------
   Editorial design-system primitives. Everything renders inside .ed-root so the
   scoped editorial.css theme applies and nothing leaks to the legacy dark app.
   Shared by the battle-station home and every post-style explanation page.
   ------------------------------------------------------------------------- */

// Cream in-page header for editorial routes (the legacy NavBar hides itself on
// these routes — see App.jsx NavBar). Keeps app navigation reachable via links.
export function EditorialHeader({ ticker }) {
  return (
    <header className="ed-head">
      <div className="ed-headbar">
        <Link className="ed-brand" to="/">math<i>explorer</i></Link>
        <nav className="ed-headnav">
          <Link to="/">Atlas</Link>
          <Link to="/route-map">Walls</Link>
          <Link to="/explorations">Simulators</Link>
          <Link to="/lambda-bounds">Results</Link>
        </nav>
        {ticker && (
          <div className="ed-tick"><span className="ed-pulse" />{ticker}</div>
        )}
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
