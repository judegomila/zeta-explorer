import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP95975_IMBALANCE_LOGLOG,
  IMP95975_TAIL_POINTS,
  IMP95975_TAIL_SLOPE,
} from '../data/imp-95975-tier3-imbalance-loglog-viz-data.js';
import { ED } from '../styles/tokens.js';

function AxisFrame({ children, svgW, svgH, padL, padR, padT, padB, xLabel, yLabel }) {
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;
  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <text x={padL + plotW / 2} y={svgH - 6} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5}>
        {xLabel}
      </text>
      <text
        x={14}
        y={padT + plotH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={9.5}
        transform={`rotate(-90 14 ${padT + plotH / 2})`}
      >
        {yLabel}
      </text>
      {children}
    </svg>
  );
}

// log-log scatter of |dQ/dm| vs midM, sign-wobble interval marked distinctly
function ImbalanceLogLogPanel() {
  const rows = IMP95975_IMBALANCE_LOGLOG;
  const svgW = 640;
  const padL = 64;
  const padR = 24;
  const svgH = 320;
  const padT = 20;
  const padB = 46;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const logMidM = rows.map((r) => Math.log10(r.midM));
  const logAbs = rows.map((r) => Math.log10(r.absImbalance));
  const minLX = Math.min(...logMidM) - 0.05;
  const maxLX = Math.max(...logMidM) + 0.05;
  const minLY = Math.min(...logAbs) - 0.3;
  const maxLY = Math.max(...logAbs) + 0.3;
  const xOf = (lx) => padL + ((lx - minLX) / (maxLX - minLX)) * plotW;
  const yOf = (ly) => padT + plotH - ((ly - minLY) / (maxLY - minLY)) * plotH;

  // ~midM^-2.95 fit line anchored at the first tail point
  const anchor = IMP95975_TAIL_POINTS[0];
  const fitLX0 = Math.log10(anchor.midM);
  const fitLY0 = Math.log10(anchor.absImbalance);
  const fitLX1 = Math.max(...IMP95975_TAIL_POINTS.map((p) => Math.log10(p.midM)));
  const fitLY1 = fitLY0 + IMP95975_TAIL_SLOPE * (fitLX1 - fitLX0);

  const xTickVals = [20, 30, 50, 70, 100, 150];
  const yTickVals = [1e-8, 1e-7, 1e-6, 1e-5];

  return (
    <AxisFrame
      svgW={svgW}
      svgH={svgH}
      padL={padL}
      padR={padR}
      padT={padT}
      padB={padB}
      xLabel="midM (log scale)"
      yLabel="|dQ/dm| imbalance (log scale)"
    >
      {xTickVals.map((v) => (
        <g key={`x${v}`}>
          <line
            x1={xOf(Math.log10(v))}
            y1={padT + plotH}
            x2={xOf(Math.log10(v))}
            y2={padT + plotH + 4}
            stroke={ED.rule}
            strokeWidth={1}
          />
          <text x={xOf(Math.log10(v))} y={padT + plotH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
            {v}
          </text>
        </g>
      ))}
      {yTickVals.map((v) => (
        <g key={`y${v}`}>
          <line x1={padL - 4} y1={yOf(Math.log10(v))} x2={padL} y2={yOf(Math.log10(v))} stroke={ED.rule} strokeWidth={1} />
          <text x={padL - 8} y={yOf(Math.log10(v)) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={8.5}>
            {v.toExponential(0)}
          </text>
        </g>
      ))}
      <line
        x1={xOf(fitLX0)}
        y1={yOf(fitLY0)}
        x2={xOf(fitLX1)}
        y2={yOf(fitLY1)}
        stroke={ED.rule}
        strokeWidth={1.25}
        strokeDasharray="4 3"
      />
      {rows.map((r, i) => (
        <circle
          key={`${r.from}-${r.to}`}
          cx={xOf(logMidM[i])}
          cy={yOf(logAbs[i])}
          r={r.isSignWobble ? 5 : 3.5}
          fill={r.isSignWobble ? ED.series2 : ED.series1}
          stroke={r.isSignWobble ? ED.series2 : 'none'}
          strokeWidth={r.isSignWobble ? 1.5 : 0}
        />
      ))}
      <text x={padL + 8} y={padT + 12} fill={ED.series1} fontSize={9}>
        interval imbalance |dQ/dm|
      </text>
      <text x={padL + 8} y={padT + 25} fill={ED.series2} fontSize={9}>
        41&rarr;60 sign wobble (negative, plotted as |value|)
      </text>
      <text x={padL + 8} y={padT + 38} fill={ED.inkFaint} fontSize={9}>
        dashed: tail fit slope &asymp; {IMP95975_TAIL_SLOPE.toFixed(2)} (imbalance &sim; midM^-3)
      </text>
    </AxisFrame>
  );
}

export default function Imp95975TierImbalanceLogLogViz() {
  const first = IMP95975_IMBALANCE_LOGLOG[0];
  const last = IMP95975_IMBALANCE_LOGLOG[IMP95975_IMBALANCE_LOGLOG.length - 1];
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="TIER-1/TIER-3 Imbalance dQ/dm vs midM, Log-Log (imp-95925)" />

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
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> a measurement-only plot of an
        already-computed finite-difference sweep. It changes no Lambda bound and establishes no
        operator positivity. Platt&ndash;Trudgian &Lambda; &le; 0.2 remains state of the art.
        Catalan G irrationality stays OPEN; Sun arXiv:2609.04176 is single-author and unrefereed.
        RH does not follow from anything on this page. NO QED.
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-95925 swept the imp-95900 TIER-1/TIER-3 imbalance dQ/dm(m) = C_1 + D_3(m) to larger
        moduli (m = 60, 80, 110, 150) and found it does not floor at the ~1e-6 level: it collapses
        from |dQ/dm| = {first.absImbalance.toExponential(2)} at midM = {first.midM} to{' '}
        {last.absImbalance.toExponential(2)} at midM = {last.midM}, a ~198x drop. On a log-log
        axis the positive large-m tail (midM &ge; 70) sits close to a straight line of slope{' '}
        {IMP95975_TAIL_SLOPE.toFixed(2)}, i.e. imbalance &sim; midM<sup>-3</sup>. The single
        exception is the 41&rarr;60 interval (midM = 50.5), a genuine grid-converged sign wobble
        where the imbalance dips slightly negative before the tail resumes its decay &mdash; marked
        in red rather than hidden.
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        |dQ/dm| vs midM (log-log), sign wobble flagged
      </h3>
      <ImbalanceLogLogPanel />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> the blue points trend
        downward and roughly linear on log-log axes past the sign wobble, consistent with a clean
        asymptotic cancellation (D_3(m) &rarr; -C_1) rather than a nonzero floor. The red point is
        not part of that trend line &mdash; it is an isolated dip in the reconstructed Q0_RECON
        near m &sim; 50&ndash;60, grid-converged to ~1e-11 and not quadrature noise.
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
        imp-95975 baked viz-data (values copied verbatim from the imp-95925 sweep, no
        re-derivation). Changes no bound, establishes no operator positivity, no RH claim;
        Platt&ndash;Trudgian &Lambda; &le; 0.2 remains SOTA. NO QED.
      </div>
    </div>
  );
}
