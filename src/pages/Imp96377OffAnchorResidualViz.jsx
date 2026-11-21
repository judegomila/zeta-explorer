import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP96377_ANCHOR_POINTS,
  IMP96377_OFFANCHOR_POINTS,
  IMP96377_LINE_CURVE,
  IMP96377_LANDMARKS,
  IMP96377_HONEST_BANNER,
} from '../data/imp-96377-off-anchor-residual-scatter-viz-data.js';
import { ED } from '../styles/tokens.js';

function ResidualChart() {
  const svgW = 680;
  const svgH = 340;
  const padL = 54;
  const padR = 16;
  const padT = 16;
  const padB = 46;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const tMin = IMP96377_LINE_CURVE[0].T;
  const tMax = IMP96377_LINE_CURVE[IMP96377_LINE_CURVE.length - 1].T;
  const lnMin = Math.log(tMin);
  const lnMax = Math.log(tMax);
  const xOf = (T) => padL + ((Math.log(T) - lnMin) / (lnMax - lnMin)) * plotW;

  const yMax = 0.85;
  const yOf = (rho) => padT + plotH - (rho / yMax) * plotH;

  const xTicks = [60, 200, 500, 1000, 2000, 4506];
  const yTicks = [0, 0.2, 0.4, 0.6, 0.8];

  const linePath = IMP96377_LINE_CURVE
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${xOf(p.T).toFixed(2)} ${yOf(p.rho).toFixed(2)}`)
    .join(' ');

  const worstX = xOf(IMP96377_LANDMARKS.worstResidualT);
  const worstY = yOf(IMP96377_LANDMARKS.envelopeMin);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {yTicks.map((v) => (
        <g key={`y${v}`}>
          <line x1={padL} y1={yOf(v)} x2={padL + plotW} y2={yOf(v)} stroke={ED.rule} strokeWidth={0.5} opacity={0.4} />
          <text x={padL - 8} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={8.5}>{v.toFixed(1)}</text>
        </g>
      ))}
      {xTicks.map((T) => (
        <g key={`x${T}`}>
          <line x1={xOf(T)} y1={padT} x2={xOf(T)} y2={padT + plotH} stroke={ED.rule} strokeWidth={0.5} opacity={0.3} />
          <text x={xOf(T)} y={padT + plotH + 14} textAnchor="middle" fill={ED.inkFaint} fontSize={8.5}>{T}</text>
        </g>
      ))}

      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />

      {/* seven-anchor reciprocal-log design line, extrapolated across the full range */}
      <path d={linePath} fill="none" stroke={ED.series5} strokeWidth={1.5} opacity={0.85} />

      {/* off-anchor points, colored by residual sign relative to the line */}
      {IMP96377_OFFANCHOR_POINTS.map((p) => (
        <circle
          key={`off-${p.T}`}
          cx={xOf(p.T)}
          cy={yOf(p.rho)}
          r={2.6}
          fill={p.belowLine ? ED.series2 : ED.series3}
        />
      ))}

      {/* on-line anchors that the design line was fit on */}
      {IMP96377_ANCHOR_POINTS.map((p) => (
        <circle key={`anchor-${p.T}`} cx={xOf(p.T)} cy={yOf(p.rho)} r={3.2} fill="none" stroke={ED.series1} strokeWidth={1.5} />
      ))}

      {/* worst-residual / binding-envelope marker (both land at gamma_4000) */}
      <circle cx={worstX} cy={worstY} r={5} fill="none" stroke={ED.brassDeco} strokeWidth={1.5} />
      <text x={worstX - 4} y={worstY - 10} textAnchor="end" fill={ED.brass} fontSize={8}>
        worst residual {IMP96377_LANDMARKS.worstResidual.toFixed(4)} at T&asymp;4506
      </text>

      <text x={padL + plotW / 2} y={svgH - 6} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5}>T (log scale)</text>
      <text x={14} y={padT + plotH / 2} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5} transform={`rotate(-90 14 ${padT + plotH / 2})`}>
        rho(32,T)
      </text>

      <g transform={`translate(${padL + 8}, ${padT + 8})`}>
        <circle cx={4} cy={0} r={3.2} fill="none" stroke={ED.series1} strokeWidth={1.5} />
        <text x={12} y={3} fill={ED.inkSoft} fontSize={8.5}>seven on-line anchors (fit points)</text>
        <circle cx={4} cy={13} r={2.6} fill={ED.series3} />
        <text x={12} y={16} fill={ED.inkSoft} fontSize={8.5}>off-anchor, above line ({IMP96377_LANDMARKS.nOffAnchor - IMP96377_LANDMARKS.nBelowLine} of {IMP96377_LANDMARKS.nOffAnchor})</text>
        <circle cx={4} cy={26} r={2.6} fill={ED.series2} />
        <text x={12} y={29} fill={ED.inkSoft} fontSize={8.5}>off-anchor, below line ({IMP96377_LANDMARKS.nBelowLine} of {IMP96377_LANDMARKS.nOffAnchor})</text>
        <line x1={0} y1={39} x2={8} y2={39} stroke={ED.series5} strokeWidth={1.5} />
        <text x={12} y={42} fill={ED.inkSoft} fontSize={8.5}>seven-anchor design line (floor {IMP96377_LANDMARKS.lineFloor.toFixed(5)})</text>
      </g>
    </svg>
  );
}

function SignSplitSummary() {
  const { nBelowLine, nOffAnchor } = IMP96377_LANDMARKS;
  const nAboveLine = nOffAnchor - nBelowLine;
  const pctBelow = (100 * nBelowLine) / nOffAnchor;
  const pctAbove = (100 * nAboveLine) / nOffAnchor;

  return (
    <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
      <div
        style={{
          padding: '0.6rem 0.9rem',
          background: 'color-mix(in srgb, var(--series-2) 8%, transparent)',
          border: '1px solid color-mix(in srgb, var(--series-2) 35%, transparent)',
          borderRadius: 6,
          minWidth: 150,
        }}
      >
        <div style={{ color: 'var(--series-2)', fontSize: '1.15rem', fontWeight: 600 }}>
          {nBelowLine} / {nOffAnchor} ({pctBelow.toFixed(1)}%)
        </div>
        <div style={{ color: 'var(--ink-soft)', fontSize: '0.75rem' }}>off-anchor heights below the design line</div>
      </div>
      <div
        style={{
          padding: '0.6rem 0.9rem',
          background: 'color-mix(in srgb, var(--series-3) 8%, transparent)',
          border: '1px solid color-mix(in srgb, var(--series-3) 35%, transparent)',
          borderRadius: 6,
          minWidth: 150,
        }}
      >
        <div style={{ color: 'var(--series-3)', fontSize: '1.15rem', fontWeight: 600 }}>
          {nAboveLine} / {nOffAnchor} ({pctAbove.toFixed(1)}%)
        </div>
        <div style={{ color: 'var(--ink-soft)', fontSize: '0.75rem' }}>off-anchor heights above the design line</div>
      </div>
    </div>
  );
}

export default function Imp96377OffAnchorResidualViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="imp-96345: Off-Anchor Margin Residual Structure vs the Seven-Anchor Design Line" />

      <div
        style={{
          marginBottom: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--series-2) 6%, transparent)',
          borderLeft: '3px solid var(--series-2)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-soft)',
          maxWidth: 760,
        }}
      >
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> {IMP96377_HONEST_BANNER}
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 760 }}>
        The purple curve is the seven-anchor reciprocal-log design line rho = {IMP96377_LANDMARKS.lineFloor.toFixed(5)}
        {' '}+ d/ln T, fit only on the ring-outlined blue points. Extrapolating it to the 27 off-anchor
        measured heights (green/red dots) shows a systematic below-line residual: {IMP96377_LANDMARKS.nBelowLine} of
        {' '}{IMP96377_LANDMARKS.nOffAnchor} sit below the line (red), worsening with T, down to the marked worst
        residual at gamma_4000. The gold ring marks that same point as the binding uniform-in-T lower envelope.
      </p>

      <SignSplitSummary />

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        rho(32,T) scatter vs the seven-anchor design line (log-x scale)
      </h3>
      <ResidualChart />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> the seven-anchor line
        overstates the margin at high T -- its floor ({IMP96377_LANDMARKS.lineFloor.toFixed(5)}) is a
        design artifact of fitting only the ring-outlined points. Refitting the same law on all 34
        measured heights (anchors plus off-anchor) collapses that floor to
        {' '}{IMP96377_LANDMARKS.fullFloor.toFixed(5)}. Even so, the gold-ringed point -- the true
        binding envelope, the minimum measured margin over every height -- stays strictly positive
        ({IMP96377_LANDMARKS.envelopeMin.toFixed(4)}), so the margin SIGN survives off the line even
        though the positive FLOOR (the fitted asymptotic intercept) does not.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> viz-only page consuming the imp-96345
        baked residual structure verbatim (only the per-point below-line flag and the line-curve
        samples are computed here). Changes no bound, establishes no operator positivity, no RH
        claim. NO QED.
      </div>
    </div>
  );
}
