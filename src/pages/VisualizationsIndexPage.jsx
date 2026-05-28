// VisualizationsIndexPage.jsx -- imp-1228 (WAVE 13 master index)
//
// Master index for the six WAVE 13 visualization pages. Renders a
// responsive 2x3 (wide) / 1xN (narrow) grid of cards. Each card has a
// title, a one-line description, a math-bucket badge, a tiny inline-SVG
// preview, and a Link to the corresponding /viz-* route. The page also
// surfaces an intro paragraph (twin-ladder framing) and a footer
// pointing at the canonical paper source.
//
// Data + tripwires: src/data/visualizations-index.js.

import React from 'react';
import { Link } from 'react-router-dom';
import { VISUALIZATIONS_INDEX } from '../data/visualizations-index.js';

// ── Per-bucket accent colors ────────────────────────────────────────────
// Each math bucket gets one accent so the cards are visually distinct.
// Keep these in sync with VIZ_MATH_BUCKETS in the data module.
const BUCKET_ACCENTS = Object.freeze({
  'phase-spiral': '#a855f7', // purple
  'tomography':   '#06b6d4', // cyan
  'flow-field':   '#22c55e', // green
  'caustic':      '#f59e0b', // amber
  'hyperbolic':   '#ec4899', // pink
  'crystal':      '#3b82f6', // blue
});

// ── Tiny inline-SVG previews ────────────────────────────────────────────
// Each preview is a cheap geometric primitive that hints at the math
// bucket. All viewBox 0 0 100 100 so the card grid scales them uniformly.

function PreviewPhaseSpiral({ stroke }) {
  // Archimedean spiral, ~3 turns.
  const pts = [];
  for (let i = 0; i <= 200; i++) {
    const t = i / 200;
    const theta = t * Math.PI * 6;
    const r = 4 + t * 40;
    const x = 50 + r * Math.cos(theta);
    const y = 50 + r * Math.sin(theta);
    pts.push(`${x.toFixed(2)},${y.toFixed(2)}`);
  }
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%" aria-hidden="true">
      <polyline points={pts.join(' ')} fill="none" stroke={stroke} strokeWidth="1.2" />
      <circle cx="50" cy="50" r="1.5" fill={stroke} />
    </svg>
  );
}

function PreviewTomography({ stroke }) {
  // 6x6 heatmap-style gradient grid, diagonal ridge highlighted.
  const cells = [];
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 6; j++) {
      // Diagonal ridge: brightest near i + j == 5.
      const d = Math.abs(i + j - 5);
      const alpha = (1 - d / 5).toFixed(2);
      cells.push(
        <rect key={`${i}-${j}`} x={10 + i * 14} y={10 + j * 14} width="13" height="13"
              fill={stroke} opacity={alpha} />
      );
    }
  }
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%" aria-hidden="true">
      {cells}
      <line x1="10" y1="80" x2="80" y2="10" stroke="#f8fafc" strokeWidth="0.8" strokeDasharray="2 2" />
    </svg>
  );
}

function PreviewFlowField({ stroke }) {
  // Four short curved streamlines suggesting a vector field.
  const lines = [
    'M10,30 C30,20 50,40 80,30',
    'M10,50 C30,40 50,60 80,50',
    'M10,70 C30,60 50,80 80,70',
    'M50,15 C55,40 45,60 50,85',
  ];
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%" aria-hidden="true">
      {lines.map((d, i) => (
        <path key={i} d={d} stroke={stroke} strokeWidth="1.2" fill="none"
              markerEnd="url(#flowArrow)" />
      ))}
      <defs>
        <marker id="flowArrow" viewBox="0 0 10 10" refX="8" refY="5"
                markerWidth="4" markerHeight="4" orient="auto">
          <path d="M0,0 L10,5 L0,10 Z" fill={stroke} />
        </marker>
      </defs>
    </svg>
  );
}

function PreviewCaustic({ stroke }) {
  // Cluster of bright dots concentrated near a vertical caustic line.
  const dots = [];
  // Deterministic pseudo-random by index so SSR/CSR agree (and we don't
  // need to memo it). Cluster x around 50 with Gaussian-ish spread.
  for (let i = 0; i < 30; i++) {
    const u = ((i * 9301 + 49297) % 233280) / 233280;
    const v = ((i * 7919 + 31) % 233280) / 233280;
    // Box-Muller-lite: concentrate around x=50.
    const x = 50 + (u - 0.5) * 30;
    const y = 10 + v * 80;
    const r = 1 + ((i % 3) === 0 ? 1.2 : 0.5);
    dots.push(<circle key={i} cx={x.toFixed(2)} cy={y.toFixed(2)} r={r} fill={stroke} />);
  }
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%" aria-hidden="true">
      <line x1="50" y1="10" x2="50" y2="90" stroke={stroke} strokeWidth="0.6" opacity="0.4" />
      {dots}
    </svg>
  );
}

function PreviewHyperbolic({ stroke }) {
  // Poincaré disk: outer circle + a few primes-on-spiral points.
  const pts = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 1; i <= 16; i++) {
    const r = 5 + Math.log(i + 1) * 11; // log-radial spacing
    const theta = i * golden;
    const x = 50 + r * Math.cos(theta);
    const y = 50 + r * Math.sin(theta);
    pts.push(<circle key={i} cx={x.toFixed(2)} cy={y.toFixed(2)} r="1.8" fill={stroke} />);
  }
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%" aria-hidden="true">
      <circle cx="50" cy="50" r="42" fill="none" stroke={stroke} strokeWidth="0.8" opacity="0.6" />
      <circle cx="50" cy="50" r="42" fill="none" stroke={stroke} strokeWidth="0.4" opacity="0.3" strokeDasharray="2 2" />
      {pts}
    </svg>
  );
}

function PreviewCrystal({ stroke }) {
  // Bragg-style peaks: 5x5 grid of dots with central dot largest.
  const cells = [];
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      const dx = Math.abs(i - 2);
      const dy = Math.abs(j - 2);
      const r = Math.max(0.6, 3 - 0.7 * (dx + dy));
      cells.push(
        <circle key={`${i}-${j}`}
                cx={(20 + i * 15).toFixed(2)}
                cy={(20 + j * 15).toFixed(2)}
                r={r.toFixed(2)} fill={stroke} />
      );
    }
  }
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%" aria-hidden="true">
      {cells}
    </svg>
  );
}

const PREVIEWS = Object.freeze({
  'phase-spiral': PreviewPhaseSpiral,
  'tomography':   PreviewTomography,
  'flow-field':   PreviewFlowField,
  'caustic':      PreviewCaustic,
  'hyperbolic':   PreviewHyperbolic,
  'crystal':      PreviewCrystal,
});

// ── Card component ─────────────────────────────────────────────────────
function VizCard({ entry }) {
  const accent = BUCKET_ACCENTS[entry.mathBucket] || '#94a3b8';
  const Preview = PREVIEWS[entry.mathBucket] || null;
  return (
    <Link
      to={entry.route}
      style={{
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--bg-panel)',
        border: '1px solid var(--border)',
        borderLeft: `3px solid ${accent}`,
        borderRadius: 8,
        padding: 16,
        textDecoration: 'none',
        color: 'inherit',
        transition: 'transform 120ms ease, border-color 120ms ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.borderColor = accent;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = 'var(--border)';
        e.currentTarget.style.borderLeftColor = accent;
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 10 }}>
        <div
          aria-hidden="true"
          style={{
            width: 60,
            height: 60,
            flexShrink: 0,
            background: '#0a0e1a',
            border: '1px solid #1e293b',
            borderRadius: 6,
            color: accent,
          }}
        >
          {Preview ? <Preview stroke={accent} /> : null}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: 16,
            fontWeight: 600,
            color: 'var(--text-primary)',
            lineHeight: 1.3,
            marginBottom: 4,
          }}>
            {entry.title}
          </div>
          <div style={{
            display: 'inline-block',
            fontSize: 10,
            fontFamily: 'var(--font-mono)',
            background: `${accent}22`,
            color: accent,
            padding: '2px 6px',
            borderRadius: 3,
            textTransform: 'uppercase',
            letterSpacing: 0.4,
          }}>
            {entry.mathBucket}
          </div>
        </div>
      </div>
      <p style={{
        color: 'var(--text-secondary)',
        fontSize: 13,
        lineHeight: 1.55,
        margin: 0,
        marginBottom: 10,
      }}>
        {entry.oneLine}
      </p>
      <div style={{
        marginTop: 'auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: 11,
        fontFamily: 'var(--font-mono)',
        color: 'var(--text-muted)',
      }}>
        <span>{entry.ticket} · step {entry.pedagogicalStep}/6</span>
        <span style={{ color: accent }}>view &rarr;</span>
      </div>
    </Link>
  );
}

// ── Page component ─────────────────────────────────────────────────────
export default function VisualizationsIndexPage() {
  const V = VISUALIZATIONS_INDEX;
  return (
    <div className="page">
      <div className="page-header">
        <h1>{V.title}</h1>
        <p className="page-subtitle">{V.intro}</p>
      </div>

      {/* Card grid: 2x3 wide, 1xN narrow. We use minmax(280px, 1fr) so
          cards collapse cleanly on small viewports. */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 16,
          marginTop: 20,
        }}
      >
        {V.entries.map((e) => (
          <VizCard key={e.route} entry={e} />
        ))}
      </div>

      {/* Honest scope */}
      <div
        className="card"
        style={{ marginTop: 28, padding: 14, borderLeft: '3px solid #06b6d4' }}
      >
        <div
          style={{
            fontSize: 11,
            color: '#06b6d4',
            fontFamily: 'var(--font-mono)',
            textTransform: 'uppercase',
            letterSpacing: 0.4,
            marginBottom: 8,
          }}
        >
          honest scope
        </div>
        <ul
          style={{
            color: 'var(--text-secondary)',
            fontSize: 13,
            lineHeight: 1.7,
            paddingLeft: 18,
            margin: 0,
          }}
        >
          <li>
            <strong>Index, not proof.</strong> These six visualizations are
            geometric / interferometric aids for intuition. They visualize
            structure, they do not prove anything about RH, Λ, or the
            twin-ladder closure routes.
          </li>
          <li>
            <strong>Pedagogical order.</strong> The cards are ordered
            phase-spiral → tomography → flow-field → caustic → hyperbolic →
            crystal so the reader moves from a single-curve view through 2D
            (σ, t) representations and finally into discrete prime structure.
          </li>
          <li>
            <strong>Reusability.</strong> Each card&apos;s data module is
            the single source-of-truth for that visualization&apos;s
            parameters and tripwires; see the dataModule field on each card
            for the import path.
          </li>
        </ul>
      </div>

      {/* Paper source */}
      <div
        className="card"
        style={{ marginTop: 20, padding: 14, borderLeft: '3px solid #f59e0b' }}
      >
        <div
          style={{
            fontSize: 11,
            color: '#f59e0b',
            fontFamily: 'var(--font-mono)',
            textTransform: 'uppercase',
            letterSpacing: 0.4,
            marginBottom: 8,
          }}
        >
          paper source
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.7, margin: 0 }}>
          <code style={{ color: '#cbd5e1' }}>{V.paperSource.path}</code>{' '}
          &mdash; {V.paperSource.note}
        </p>
      </div>

      {/* Source footer */}
      <div
        style={{
          marginTop: 20,
          fontSize: 11,
          color: 'var(--text-muted)',
          lineHeight: 1.6,
          fontFamily: 'var(--font-mono)',
        }}
      >
        source: src/data/visualizations-index.js · ticket: {V.ticketId} ·{' '}
        renderer: src/pages/VisualizationsIndexPage.jsx
      </div>
    </div>
  );
}
