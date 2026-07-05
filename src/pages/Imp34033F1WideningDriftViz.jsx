import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP33969_EFLOW_DECAY_WIDENING_RATIO_KEND_SWEEP } from '../data/imp-33969-eflow-decay-widening-ratio-kend-sweep.js';

const { sweep: SWEEP, anchor: ANCHOR, endpoint: ENDPOINT, driftAttribution: DRIFT } =
  IMP33969_EFLOW_DECAY_WIDENING_RATIO_KEND_SWEEP;

// Top panel: the F1/widening over-prediction ratio across the 9-window kEnd sweep (log scale).
// Bottom panel: the per-factor F2/F3/F4 drift, each normalised to its kEnd=11 anchor value, showing
// F4 as the dominant collapse (the ~96.5% drift driver) against the nearly-flat F2/F3.
function RatioAndFactorDriftChart() {
  const svgW = 640;
  const svgH = 420;
  const padL = 56;
  const padR = 24;
  const padT = 16;
  const padMid = 24;
  const padB = 36;
  const topH = 220;
  const botH = 120;
  const cW = svgW - padL - padR;

  const xs = SWEEP.map((r) => r.kEnd);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const xAt = (x) => padL + ((x - minX) / (maxX - minX)) * cW;

  // Top: log10(ratio), strictly increasing 19.913 -> 165.351.
  const logRatios = SWEEP.map((r) => Math.log10(r.ratio));
  const minLog = Math.min(...logRatios);
  const maxLog = Math.max(...logRatios);
  const padLog = (maxLog - minLog) * 0.15 || 1;
  const yAtRatio = (v) =>
    padT + topH - ((v - minLog - padLog) / (maxLog - minLog + 2 * padLog)) * topH;
  const ratioPoints = xs.map((x, i) => `${xAt(x)},${yAtRatio(logRatios[i])}`).join(' ');

  // Bottom: per-factor drift, each series normalised to its own kEnd=11 value (F2/F2_0, F3/F3_0, F4/F4_0).
  const f2Rel = SWEEP.map((r) => r.F2 / SWEEP[0].F2);
  const f3Rel = SWEEP.map((r) => r.F3 / SWEEP[0].F3);
  const f4Rel = SWEEP.map((r) => r.F4 / SWEEP[0].F4);
  const allRel = [...f2Rel, ...f3Rel, ...f4Rel];
  const minRel = Math.min(...allRel);
  const maxRel = Math.max(...allRel);
  const padRel = (maxRel - minRel) * 0.12 || 0.05;
  const botTop = padT + topH + padMid;
  const yAtRel = (v) =>
    botTop + botH - ((v - minRel - padRel) / (maxRel - minRel + 2 * padRel)) * botH;
  const f2Points = xs.map((x, i) => `${xAt(x)},${yAtRel(f2Rel[i])}`).join(' ');
  const f3Points = xs.map((x, i) => `${xAt(x)},${yAtRel(f3Rel[i])}`).join(' ');
  const f4Points = xs.map((x, i) => `${xAt(x)},${yAtRel(f4Rel[i])}`).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {/* top panel: F1/widening over-prediction ratio, log10 scale */}
      <polyline points={ratioPoints} fill="none" stroke="#38bdf8" strokeWidth={1.5} />
      {xs.map((x, i) => (
        <circle key={`r-${x}`} cx={xAt(x)} cy={yAtRatio(logRatios[i])} r={3} fill="#38bdf8" stroke="#0a0f1a" strokeWidth={0.75} />
      ))}
      {xs.map((x) => (
        <text key={`xt-top-${x}`} x={xAt(x)} y={padT + topH + 14} textAnchor="middle" fill="#64748b" fontSize={8.5}>
          {x}
        </text>
      ))}
      <text x={padL + 4} y={padT + 12} fill="#38bdf8" fontSize={9.5}>
        F1/widening over-prediction ratio = 1/(F2*F3*F4), log10 scale
      </text>
      <text
        x={16}
        y={padT + topH / 2}
        textAnchor="middle"
        fill="#64748b"
        fontSize={10}
        transform={`rotate(-90 16 ${padT + topH / 2})`}
      >
        log10(ratio)
      </text>

      {/* bottom panel: per-factor drift relative to kEnd=11 anchor */}
      <polyline points={f2Points} fill="none" stroke="#facc15" strokeWidth={1.5} />
      <polyline points={f3Points} fill="none" stroke="#94a3b8" strokeWidth={1.5} />
      <polyline points={f4Points} fill="none" stroke="#f87171" strokeWidth={2} />
      {xs.map((x, i) => (
        <circle key={`f4-${x}`} cx={xAt(x)} cy={yAtRel(f4Rel[i])} r={2.5} fill="#f87171" stroke="#0a0f1a" strokeWidth={0.75} />
      ))}
      {xs.map((x) => (
        <text key={`xt-bot-${x}`} x={xAt(x)} y={botTop + botH + 14} textAnchor="middle" fill="#64748b" fontSize={8.5}>
          {x}
        </text>
      ))}
      <text x={padL + cW / 2} y={svgH - 4} textAnchor="middle" fill="#64748b" fontSize={10}>
        kEnd (fit boundary)
      </text>
      <text
        x={16}
        y={botTop + botH / 2}
        textAnchor="middle"
        fill="#64748b"
        fontSize={10}
        transform={`rotate(-90 16 ${botTop + botH / 2})`}
      >
        factor / anchor value
      </text>
      <text x={padL + 4} y={botTop + 12} fill="#facc15" fontSize={9.5}>
        F2 (normaliser, x{DRIFT.F2_drift_factor} -- nearly flat)
      </text>
      <text x={padL + 4} y={botTop + 24} fill="#94a3b8" fontSize={9.5}>
        F3 (log-slope ratio, x{DRIFT.F3_drift_factor} -- nearly flat)
      </text>
      <text x={padL + 4} y={botTop + 36} fill="#f87171" fontSize={9.5}>
        F4 (imp-33773 residual ratio, x{DRIFT.F4_drift_factor} -- the drift driver)
      </text>
    </svg>
  );
}

export default function Imp34033F1WideningDriftViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="F1/widening Over-prediction Drift (imp-33969)" />

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-33922 measured the raw (log N)^3/N decay F1 over-predicting the empirical widening by
        ~19.9x, but only at the fixed imp-33884 boundary kEnd=11. imp-33969 recomputed the same
        ratio across the imp-33917 9-window sweep kEnd = 11.00..13.00 and found it is NOT
        window-invariant: it drifts monotonically from {ANCHOR.ratio} to {ENDPOINT.ratio}, a factor
        of ~8.30. The top panel plots the ratio (log scale); the bottom panel plots the three
        attenuation factors F2, F3, F4, each normalised to its kEnd=11 anchor value, showing F4 (the
        imp-33773 residual ratio) as the dominant collapse while F2 and F3 stay nearly flat.
      </p>

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        over-prediction ratio vs kEnd, with per-factor F2/F3/F4 drift below
      </p>
      <RatioAndFactorDriftChart />

      <div
        style={{
          marginTop: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'rgba(148,163,184,0.04)',
          borderLeft: '3px solid #334155',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: '#64748b',
        }}
      >
        <strong style={{ color: '#94a3b8' }}>Honest status:</strong> accuracy / window-stability
        cross-check only, on the inherited imp-3220/imp-3406 component model. F4 supplies ~
        {(DRIFT.F4_drift_log_share * 100).toFixed(1)}% of the ln(attenuation) drift vs F2 ~
        {(DRIFT.F2_drift_log_share * 100).toFixed(1)}% and F3 ~
        {(DRIFT.F3_drift_log_share * 100).toFixed(1)}%. The model is NOT a rigorous asymptotic;
        establishes no operator positivity; imp-3066 K_a&gt;=0 untouched; no RH verdict; NO QED.
        Platt-Trudgian Lambda&lt;=0.2 remains SOTA.
      </div>
    </div>
  );
}
