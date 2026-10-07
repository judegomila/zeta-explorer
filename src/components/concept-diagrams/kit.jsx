/**
 * Shared pieces for the concept diagrams (src/components/concept-diagrams/*.jsx).
 *
 * Each diagram is a responsive inline SVG (viewBox, width 100%, styled by classes in
 * src/styles/concepts.css that read the editorial tokens). The SVG carries role="img" with a
 * <title> and <desc>; DiagramText adds a collapsible text description and, where the figure
 * plots numbers, the data table. No imports beyond React.
 */
import React from 'react';

/** Linear map from [d0, d1] to [r0, r1]. */
export const scale = (d0, d1, r0, r1) => (v) => r0 + ((v - d0) / (d1 - d0)) * (r1 - r0);

/** SVG path through [x, y] points (already in SVG units). */
export const pathOf = (pts) => pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(2)} ${y.toFixed(2)}`).join('');

export function DiagramSvg({ idBase, title, desc, viewBox, children, className = '' }) {
  const t = `${idBase}-title`;
  const d = `${idBase}-desc`;
  return (
    <svg className={`cd-svg ${className}`} viewBox={viewBox} role="img" aria-labelledby={`${t} ${d}`} preserveAspectRatio="xMidYMid meet">
      <title id={t}>{title}</title>
      <desc id={d}>{desc}</desc>
      {children}
    </svg>
  );
}

export function DiagramText({ alt, children }) {
  if (!alt && !children) return null;
  return (
    <details className="cd-alt">
      <summary>Text description{children ? ' and data' : ''}</summary>
      {alt && <p>{alt}</p>}
      {children}
    </details>
  );
}

/** Small legend key for a line style: a short stroke sample then the label (text in ink tokens). */
export function LineKey({ x, y, cls, label, w = 22 }) {
  return (
    <g>
      <line x1={x} y1={y} x2={x + w} y2={y} className={cls} />
      <text x={x + w + 6} y={y + 3.5} className="cd-t cd-sm">{label}</text>
    </g>
  );
}

/** Arrow-head marker definitions, one per stroke class used. */
export function ArrowDefs({ idBase }) {
  return (
    <defs>
      <marker id={`${idBase}-arr`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M0 0L10 5L0 10z" className="cd-fill-ink" />
      </marker>
    </defs>
  );
}
