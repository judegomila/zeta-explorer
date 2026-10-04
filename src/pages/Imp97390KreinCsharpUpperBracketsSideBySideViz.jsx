import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP97390_TSWEEP_SERIES,
  IMP97390_TSWEEP_LIMIT,
  IMP97390_BRACKET_BARS,
  IMP97390_JOINT_BAND,
  IMP97390_PLATEAU_STD,
  IMP97390_TIGHTEST_BRACKET,
} from '../data/imp-97390-krein-csharp-upperbrackets-sidebyside-viz-data.js';
import { ED, alpha } from '../styles/tokens.js';

// imp-97390: side-by-side visualization of the imp-97355 reconciliation of the
// two independent c_sharp upper-bracket extrapolations at 2a=ln3. Panel 1 shows
// the imp-97335 fixed-N=100 T-sweep climbing toward its extrapolated T->inf
// limit (0.5822). Panel 2 places both brackets as bars against the imp-97206
// coupled joint-range band, showing they agree to ~0.001.

function TSweepPanel() {
  const svgW = 720;
  const svgH = 260;
  const padL = 52;
  const padR = 20;
  const padT = 20;
  const padB = 36;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const rows = IMP97390_TSWEEP_SERIES;
  const allVals = [...rows.map((r) => r.lamMin), IMP97390_TSWEEP_LIMIT];
  const minY = Math.min(...allVals) - 0.01;
  const maxY = Math.max(...allVals) + 0.005;
  const minX = Math.min(...rows.map((r) => r.T));
  const maxX = Math.max(...rows.map((r) => r.T));

  const xOf = (t) => padL + ((t - minX) / (maxX - minX)) * plotW;
  const yOf = (v) => padT + plotH - ((v - minY) / (maxY - minY)) * plotH;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line
        x1={padL}
        y1={yOf(IMP97390_TSWEEP_LIMIT)}
        x2={padL + plotW}
        y2={yOf(IMP97390_TSWEEP_LIMIT)}
        stroke={ED.brassDeco}
        strokeWidth={1}
        strokeDasharray="4 3"
      />
      <text x={padL + plotW - 4} y={yOf(IMP97390_TSWEEP_LIMIT) - 6} textAnchor="end" fill={ED.brass} fontSize={9}>
        T&rarr;&infin; limit {IMP97390_TSWEEP_LIMIT.toFixed(4)}
      </text>
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      {[minY, (minY + maxY) / 2, maxY].map((v) => (
        <g key={`y${v}`}>
          <line x1={padL - 4} y1={yOf(v)} x2={padL} y2={yOf(v)} stroke={ED.rule} strokeWidth={1} />
          <text x={padL - 8} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={8.5}>
            {v.toFixed(3)}
          </text>
        </g>
      ))}
      {rows.map((r) => (
        <text key={`x${r.T}`} x={xOf(r.T)} y={padT + plotH + 14} textAnchor="middle" fill={ED.inkFaint} fontSize={8}>
          {r.T}
        </text>
      ))}
      <polyline
        points={rows.map((r) => `${xOf(r.T)},${yOf(r.lamMin)}`).join(' ')}
        fill="none"
        stroke={ED.series2}
        strokeWidth={1.9}
      />
      {rows.map((r) => (
        <circle key={r.T} cx={xOf(r.T)} cy={yOf(r.lamMin)} r={3} fill={ED.series2} />
      ))}
      <text x={padL + plotW / 2} y={padT + plotH + 30} textAnchor="middle" fill={ED.inkSoft} fontSize={9}>
        T (t-truncation, fixed N=100)
      </text>
    </svg>
  );
}

function BracketBarsPanel() {
  const svgW = 720;
  const svgH = 260;
  const padL = 52;
  const padR = 20;
  const padT = 20;
  const padB = 60;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const bars = IMP97390_BRACKET_BARS;
  const band = IMP97390_JOINT_BAND;
  const allVals = [...bars.map((b) => b.value), band.lo, band.hi];
  const minY = Math.min(...allVals) - 0.002;
  const maxY = Math.max(...allVals) + 0.002;

  const yOf = (v) => padT + plotH - ((v - minY) / (maxY - minY)) * plotH;
  const barW = (plotW / bars.length) * 0.5;
  const gap = plotW / bars.length;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={yOf(band.hi)} width={plotW} height={yOf(band.lo) - yOf(band.hi)} fill={alpha(ED.series3, 0.1)} />
      <text x={padL + plotW - 4} y={yOf(band.hi) - 6} textAnchor="end" fill={ED.series3} fontSize={8.5}>
        imp-97206 joint range [{band.lo}, {band.hi}]
      </text>
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      {[minY, (minY + maxY) / 2, maxY].map((v) => (
        <g key={`y${v}`}>
          <line x1={padL - 4} y1={yOf(v)} x2={padL} y2={yOf(v)} stroke={ED.rule} strokeWidth={1} />
          <text x={padL - 8} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={8.5}>
            {v.toFixed(4)}
          </text>
        </g>
      ))}
      {bars.map((b, i) => {
        const cx = padL + gap * (i + 0.5);
        const y0 = yOf(minY);
        const y1 = yOf(b.value);
        return (
          <g key={b.key}>
            <rect x={cx - barW / 2} y={y1} width={barW} height={y0 - y1} fill={b.color} opacity={0.85} />
            <text x={cx} y={y1 - 6} textAnchor="middle" fill={b.color} fontSize={9}>
              {b.value.toFixed(6)}
            </text>
            <foreignObject x={cx - gap / 2 + 6} y={padT + plotH + 6} width={gap - 12} height={44}>
              <div style={{ color: 'var(--ink-soft)', fontSize: '8px', textAlign: 'center', lineHeight: 1.25 }}>
                {b.label}
              </div>
            </foreignObject>
          </g>
        );
      })}
    </svg>
  );
}

export default function Imp97390KreinCsharpUpperBracketsSideBySideViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Route I Krein Floor: Two Upper Brackets on c_sharp at 2a=ln3, Side by Side" />

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
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> measurement only. Both
        figures below are Rayleigh-Ritz UPPER bounds on c_sharp = lambda_min(P_a M_sigma2 P_a)
        at 2a=ln3, not a certified floor. No operator positivity established; interval-rigorous
        certificate reach stays 2a&le;0.96; RH open; NO QED.
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-97355 reconciled two independently-produced extrapolations of c_sharp: imp-97335's
        fixed-N=100 T-sweep extrapolated to a measured T&rarr;&infin; limit, and imp-97206's
        coupled N,T grid extrapolated (T first, then N) to a flat plateau. They agree to ~0.0011
        (&lt;0.2%).
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        imp-97335: fixed-N=100 T-sweep converging to its extrapolated limit
      </h3>
      <TSweepPanel />

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', margin: '1.5rem 0 0.5rem' }}>
        Both measured upper brackets against the imp-97206 joint range
      </h3>
      <BracketBarsPanel />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the charts:</strong> the imp-97335 T-sweep
        (top) rises toward its fitted 1/T&sup2; limit {IMP97390_TSWEEP_LIMIT.toFixed(4)} at fixed
        N=100. In the bar comparison (bottom), all three readings fall inside or at the edge of
        the imp-97206 joint range [{IMP97390_JOINT_BAND.lo}, {IMP97390_JOINT_BAND.hi}] (plateau
        std &plusmn;{IMP97390_PLATEAU_STD.toFixed(6)}). Since Rayleigh-Ritz floors bracket the
        true lambda_min from ABOVE, the LOWER reading is the tighter bracket: the imp-97206
        coupled inner value ({IMP97390_TIGHTEST_BRACKET.value.toFixed(6)}) is the tightest and
        most complete measured upper-bracket on c_sharp.
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
        imp-97335 / imp-97206 / imp-97355 committed values verbatim (no re-solve, no new
        numerics). Rayleigh-Ritz upper bounds only; establishes no operator positivity; changes
        no bound; Platt-Trudgian Lambda&le;0.2 remains SOTA; RH open; NO QED.
      </div>
    </div>
  );
}
