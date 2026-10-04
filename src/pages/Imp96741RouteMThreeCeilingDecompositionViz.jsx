import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP96741_SEGMENTS,
  IMP96741_ANNOTATIONS,
  IMP96741_HONEST_BANNER,
} from '../data/imp-96741-route-m-three-ceiling-decomposition-viz-data.js';
import { ED } from '../styles/tokens.js';

// Horizontal bar chart of the three Route M lam_max conditioning ceilings
// (trace-domination rigorous lower, Frobenius fit, measured composed), with
// the fit-vs-measured residual factor and the trace-to-measured gap-fraction
// the Frobenius fit covers, annotated between the bars.
function CeilingBarPanel() {
  const rows = IMP96741_SEGMENTS;
  const svgW = 720;
  const padL = 90;
  const padR = 90;
  const svgH = 190;
  const padT = 20;
  const padB = 30;
  const plotW = svgW - padL - padR;
  const barH = 30;
  const gap = 20;

  const maxN = Math.max(...rows.map((r) => r.N));
  const xOf = (v) => (v / maxN) * plotW;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {rows.map((r, i) => {
        const y = padT + i * (barH + gap);
        return (
          <g key={r.symbol}>
            <text x={padL - 8} y={y + barH / 2 + 4} textAnchor="end" fill={ED.inkSoft} fontSize={11}>
              {r.symbol} ({r.label})
            </text>
            <rect x={padL} y={y} width={xOf(r.N)} height={barH} fill={r.color} opacity={0.85} rx={3} />
            <text x={padL + xOf(r.N) + 8} y={y + barH / 2 + 4} fill={ED.ink} fontSize={11}>
              {r.N.toExponential(3)}
            </text>
          </g>
        );
      })}
      <text x={padL} y={svgH - padB / 2} fill={ED.inkFaint} fontSize={9}>
        N (conditioning-ceiling scale)
      </text>
    </svg>
  );
}

export default function Imp96741RouteMThreeCeilingDecompositionViz() {
  const { frobeniusOverTrace, measuredOverFrobenius, measuredOverTrace, gapFraction } = IMP96741_ANNOTATIONS;

  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Route M Three-Ceiling Conditioning Decomposition (T < F < M)" />
      <p className="ed-lbl">Related: <Link to="/viz-imp96723-route-m-three-ceiling-decomposition">earlier run (imp-96723)</Link></p>

      <div
        style={{
          marginBottom: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--series-2) 6%, transparent)',
          borderLeft: '3px solid var(--series-2)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-soft)',
          maxWidth: 700,
        }}
      >
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> {IMP96741_HONEST_BANNER}
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-96713 (re-auditing imp-96693 under the imp-96694 N=12000-updated Frobenius fit)
        tabulates three Route M lam_max double-precision conditioning ceilings, strictly
        ordered T (rigorous lower, green) &lt; F (Frobenius fit, yellow) &lt; M (measured
        composed, red). The rigorous→fit leg is F/T&asymp;{frobeniusOverTrace.toFixed(4)}, the
        fit→measured leg is M/F&asymp;{measuredOverFrobenius.toFixed(4)} (the &ldquo;~1.09x&rdquo;
        residual factor), and the two legs multiply exactly to the invariant total
        M/T&asymp;{measuredOverTrace.toFixed(4)}. The Frobenius fit covers
        (F-T)/(M-T)&asymp;{(gapFraction * 100).toFixed(1)}% of the trace-to-measured gap.
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        three ceilings, rigorous vs fit vs measured
      </h3>
      <CeilingBarPanel />

      <div
        style={{
          marginTop: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--ink-soft) 4%, transparent)',
          borderLeft: '3px solid var(--rule)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-faint)',
        }}
      >
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> only the trace ceiling
        T is a rigorous lower bound (imp-96548 exact lam_max&lt;=trace); F and M both rest on
        log-fit extrapolations (imp-96694 fourteen-rung Frobenius fit, imp-96443 measured
        composed fit) several decades past directly computed rungs. The residual factor
        M/F&asymp;1.09x and the gap-fraction&asymp;78% quantify how much of the total
        rigorous-to-measured ceiling gap the fit estimate closes; neither figure moves any
        bound.
      </div>

      <div
        style={{
          marginTop: '0.75rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--ink-soft) 4%, transparent)',
          borderLeft: '3px solid var(--rule)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-faint)',
        }}
      >
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> viz-only page consuming the
        imp-96741 viz-data (ceilings and ratios reused verbatim from imp-96713).{' '}
        {IMP96741_HONEST_BANNER}
      </div>
    </div>
  );
}
