import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP33699_GAP_VS_TROUGH_DEPTH_CORRELATION } from '../data/imp-33699-gap-vs-trough-depth-correlation-n400-1200.js';
import { ED } from '../styles/tokens.js';

const POINT_COLOR = ED.series1;
const FIT_COLOR = ED.series4;

const { measured } = IMP33699_GAP_VS_TROUGH_DEPTH_CORRELATION;
const gaps = measured.gaps;
const troughEnvs = measured.troughEnvs;

function leastSquares(xs, ys) {
  const m = xs.length;
  const sx = xs.reduce((a, b) => a + b, 0);
  const sy = ys.reduce((a, b) => a + b, 0);
  const mx = sx / m;
  const my = sy / m;
  let sxy = 0;
  let sxx = 0;
  for (let i = 0; i < m; i += 1) {
    sxy += (xs[i] - mx) * (ys[i] - my);
    sxx += (xs[i] - mx) * (xs[i] - mx);
  }
  const slope = sxx > 0 ? sxy / sxx : 0;
  return { slope, intercept: my - slope * mx };
}

const { slope, intercept } = leastSquares(gaps, troughEnvs);

function ScatterChart() {
  const svgW = 700;
  const padL = 50;
  const padR = 20;
  const padT = 20;
  const padB = 44;
  const cW = svgW - padL - padR;
  const cH = 300;
  const svgH = padT + cH + padB;

  const gMin = Math.min(...gaps);
  const gMax = Math.max(...gaps);
  const tMin = Math.min(...troughEnvs);
  const tMax = Math.max(...troughEnvs);
  const gPad = (gMax - gMin) * 0.1 || 1;
  const tPad = (tMax - tMin) * 0.1 || 1;

  const xS = (g) => padL + ((g - (gMin - gPad)) / (gMax - gMin + 2 * gPad)) * cW;
  const yS = (t) => padT + cH * (1 - (t - (tMin - tPad)) / (tMax - tMin + 2 * tPad));

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill={ED.paper} rx={2} />

      {/* negative-slope regression line */}
      <line
        x1={xS(gMin)}
        y1={yS(intercept + slope * gMin)}
        x2={xS(gMax)}
        y2={yS(intercept + slope * gMax)}
        stroke={FIT_COLOR}
        strokeWidth={1.3}
        strokeDasharray="5,3"
      />

      {gaps.map((g, i) => (
        <circle key={`pt-${g}-${troughEnvs[i].toFixed(1)}`} cx={xS(g)} cy={yS(troughEnvs[i])} r={3.8} fill={POINT_COLOR} />
      ))}

      {[gMin, Math.round((gMin + gMax) / 2), gMax].map((g) => (
        <text key={g} x={xS(g)} y={padT + cH + 14} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
          {g}
        </text>
      ))}
      <text x={padL + cW / 2} y={padT + cH + 30} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
        inter-peak gap (rungs)
      </text>

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke={ED.rule} strokeWidth={1} />
      <text x={12} y={padT + cH / 2} textAnchor="middle" fill={ED.inkFaint} fontSize={10} transform={`rotate(-90,12,${padT + cH / 2})`}>
        inter-cluster trough depth, envelope (ULP)
      </text>

      <text x={padL + 8} y={padT + 16} fill={FIT_COLOR} fontSize={9}>
        Pearson r ~ {measured.pearsonR.toFixed(2)} (R&sup2; ~ {measured.pearsonR2.toFixed(2)})
      </text>
    </svg>
  );
}

export default function Imp33738GapVsTroughDepthCouplingViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 980, margin: '0 auto' }}>
      <PageHeader title="Gap-vs-Trough-Depth Weak-Negative Coupling, n in [400,1200] (imp-33699)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 820 }}>
        imp-33699 cross-correlated the imp-33661 fifteen inter-peak GAPS against the imp-33662 fifteen
        inter-cluster TROUGH DEPTHS at the shared [400,1200] band-clearing peaks, using the single
        natural one-to-one alignment: each trough sits INSIDE its own gap. The scatter below plots each
        gap against its aligned trough envelope, with the least-squares fit line overlaid.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        gap (rungs) vs. inter-cluster trough depth (ULP), fifteen points
      </p>
      <ScatterChart />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.85rem', margin: '1rem 0 1.25rem' }}>
        The single natural alignment gives Pearson r ~{measured.pearsonR.toFixed(2)} (R&sup2; ~
        {measured.pearsonR2.toFixed(2)}, Spearman &rho; ~{measured.spearmanRho.toFixed(2)}) -- a
        weak-to-moderate NEGATIVE association: wider gaps sit at marginally DEEPER (lower-env) troughs.
        This is distinct from the imp-33682 gap-vs-HEIGHT independence (|r| ~
        {measured.imp33682GapVsHeightPearson.toFixed(2)}, R&sup2; ~
        {measured.imp33682GapVsHeightR2.toFixed(3)}). But the coupling is NOT deterministic: the deepest
        trough (~{measured.troughMin.toFixed(1)} ULP) sits in a near-mean {measured.gapAtDeepestTrough}-rung
        gap, not the widest {measured.gapMax}-rung gap, which holds only a middling ~
        {measured.troughAtWidestGap.toFixed(1)}-ULP trough.
      </p>

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> the gently downward-sloping fit
        line illustrates the WIDER-GAP-WEAK-NEGATIVE-TROUGH-DEPTH-COUPLING verdict -- wider spacings sit
        at marginally deeper troughs, but the scatter is loose, not a tight line. Part of the negative
        sign is a mundane sampling-window effect: a wider gap spans more interior rungs, so its local
        minimum envelope is taken over more samples and mechanically tends lower. Fifteen paired points is
        a small sample; exact per-rung ULP values are jittery arithmetic-floor lattice hits, so the robust
        reading is the qualitative weak-negative conclusion, not the precise fit coefficients.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> accuracy/rule-design measurement only. It
        changes no bound and patches no literal. Mass-feasibility is necessary-but-not-sufficient; the
        operator-level positivity (imp-3066 K_a &ge; 0) is UNTOUCHED. RH-equivalent, NO QED.
      </div>
    </div>
  );
}
