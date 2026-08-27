import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP36192_STEP2_G_STEP_ERROR_APRIORI_TRUNCATION_SCOPE } from '../data/imp-36192-step2-g-step-error-apriori-truncation-scope.js';
import { IMP36250_SHARED_DELTA_LO_TRIAD_CROSS_REFERENCE } from '../data/imp-36250-shared-delta-lo-triad-cross-reference.js';

// Illustrative curve only -- reuses the imp-36192 baked crux exponents (dt^5, delta^-9) and the
// same representative dt = 1e-5 used to derive localTruncScaleBulk / localTruncScaleFront there.
// log10(scale) = 5*log10(dt) - 9*log10(delta); a straight line in log-log space (power law).
const DT_REPRESENTATIVE = 1e-5;
const { localTruncExponentDt, cruxDeltaPower } = IMP36192_STEP2_G_STEP_ERROR_APRIORI_TRUNCATION_SCOPE.cruxNumbers;

function log10TruncScale(delta) {
  return localTruncExponentDt * Math.log10(DT_REPRESENTATIVE) - cruxDeltaPower * Math.log10(delta);
}

function TruncationBlowupChart() {
  const svgW = 700;
  const padL = 68;
  const padR = 24;
  const padT = 24;
  const padB = 44;
  const cW = svgW - padL - padR;
  const cH = 280;
  const svgH = padT + cH + padB;

  // x axis: log10(delta) from bulk (delta=1, log10=0) down to the front (delta=1e-4, log10=-4)
  const xMin = -4;
  const xMax = 0;
  const yMin = -26;
  const yMax = 12;

  const xS = (log10Delta) => padL + ((log10Delta - xMin) / (xMax - xMin)) * cW;
  const yS = (log10Scale) => padT + cH * (1 - (log10Scale - yMin) / (yMax - yMin));

  const N_SAMPLES = 40;
  const points = Array.from({ length: N_SAMPLES + 1 }, (_, i) => {
    const log10Delta = xMin + (i / N_SAMPLES) * (xMax - xMin);
    return { log10Delta, log10Scale: log10TruncScale(10 ** log10Delta) };
  });

  const path = points
    .map((p, i) => (i === 0 ? 'M' : 'L') + xS(p.log10Delta).toFixed(1) + ',' + yS(p.log10Scale).toFixed(2))
    .join(' ');

  const xTicks = [-4, -3, -2, -1, 0];
  const yTicks = [-25, -15, -5, 0, 5, 11];

  const bulkPoint = { log10Delta: 0, log10Scale: log10TruncScale(1) };
  const frontPoint = { log10Delta: -4, log10Scale: log10TruncScale(1e-4) };

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill="#0a0f1a" rx={2} />

      {/* certificate-vacuous boundary: local-truncation scale = 1 */}
      <rect x={padL} y={padT} width={cW} height={yS(0) - padT} fill="rgba(248,113,113,0.06)" />
      <line x1={padL} y1={yS(0)} x2={padL + cW} y2={yS(0)} stroke="#f87171" strokeWidth={1.2} strokeDasharray="4,3" />
      <text x={padL + cW - 4} y={yS(0) - 5} textAnchor="end" fill="#fca5a5" fontSize={8.5}>
        scale = 1 (vacuous above)
      </text>

      {yTicks.map((v) => (
        <g key={v}>
          <line x1={padL} y1={yS(v)} x2={padL + cW} y2={yS(v)} stroke="#1e293b" strokeWidth={0.7} />
          <text x={padL - 4} y={yS(v) + 3.5} textAnchor="end" fill="#475569" fontSize={9}>
            1e{v}
          </text>
        </g>
      ))}

      <path d={path} fill="none" stroke="#38bdf8" strokeWidth={2.2} />

      <circle cx={xS(bulkPoint.log10Delta)} cy={yS(bulkPoint.log10Scale)} r={4.4} fill="#4ade80" />
      <text x={xS(bulkPoint.log10Delta) - 6} y={yS(bulkPoint.log10Scale) - 8} textAnchor="end" fill="#86efac" fontSize={8.5}>
        bulk (delta~1): tiny
      </text>

      <circle cx={xS(frontPoint.log10Delta)} cy={yS(frontPoint.log10Scale)} r={4.4} fill="#facc15" />
      <text x={xS(frontPoint.log10Delta) + 6} y={yS(frontPoint.log10Scale) + 12} textAnchor="start" fill="#fde68a" fontSize={8.5}>
        front (delta~1e-4): vacuous
      </text>

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke="#334155" strokeWidth={1} />

      {xTicks.map((t) => (
        <g key={t}>
          <line x1={xS(t)} y1={padT + cH} x2={xS(t)} y2={padT + cH + 5} stroke="#334155" strokeWidth={1} />
          <text x={xS(t)} y={padT + cH + 16} textAnchor="middle" fill="#64748b" fontSize={9}>
            1e{t}
          </text>
        </g>
      ))}
      <text x={padL + cW / 2} y={padT + cH + 34} textAnchor="middle" fill="#64748b" fontSize={10}>
        min gap delta (log scale, bulk to boundary layer)
      </text>

      <text
        x={12}
        y={padT + cH / 2}
        textAnchor="middle"
        fill="#64748b"
        fontSize={10}
        transform={'rotate(-90,12,' + (padT + cH / 2) + ')'}
      >
        dt^5 * delta^-9 local-trunc scale
      </text>
    </svg>
  );
}

export default function Imp36192I2TruncationBlowupViz() {
  const data = IMP36192_STEP2_G_STEP_ERROR_APRIORI_TRUNCATION_SCOPE;
  const { localTruncScaleBulk, localTruncScaleFront, dtTamingExponent } = data.cruxNumbers;

  return (
    <div style={{ padding: '1.5rem', maxWidth: 940, margin: '0 auto' }}>
      <PageHeader title="I2 Local-Truncation Blow-up dt^5 &middot; delta^-9 vs Min Gap (imp-36192)" />

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        The imp-36192 I2 ingredient (the crux of the Step-2 G-step-error scoping): the RK4 local
        truncation error per step scales like dt^5 &middot; delta^-9, where delta is the min particle
        gap along the backward Dyson flow. At a representative step dt = {DT_REPRESENTATIVE.toExponential(0)}
        {' '}(one rung of the imp-36077 dt ladder), this SCALE is a tiny ~1e-25 in the bulk (delta &asymp; O(1))
        but explodes to ~1e11 &mdash; vacuous, above the red dashed scale=1 line &mdash; as delta &rarr; 1e-4
        near the collision front. Illustrative only; reuses the baked imp-36192 crux exponents; certifies
        nothing; NO QED.
      </p>

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        local-truncation scale across the bulk-to-boundary-layer transition
      </p>
      <TruncationBlowupChart />

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
        <strong style={{ color: '#94a3b8' }}>Reading the chart:</strong> the curve is a straight
        line in log-log space (a pure power law, slope -9 in delta): bulk scale &asymp;{' '}
        {localTruncScaleBulk.toExponential(2)}, front scale &asymp; {localTruncScaleFront.toExponential(2)}.
        Taming the crux at the front needs dt to shrink faster than delta^{dtTamingExponent} &mdash;
        the same collision-front blow-up seen in the coupled G-gronwall reading (imp-2520).
      </div>

      <div
        style={{
          marginTop: '1rem',
          padding: '0.75rem 1rem',
          background: 'rgba(148,163,184,0.04)',
          borderLeft: '3px solid #334155',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: '#64748b',
        }}
      >
        <strong style={{ color: '#94a3b8' }}>Status:</strong> {data.verdict}
      </div>

      <div
        style={{
          marginTop: '1rem',
          padding: '0.75rem 1rem',
          background: 'rgba(248,113,113,0.04)',
          borderLeft: '3px solid #f87171',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: '#64748b',
        }}
      >
        <strong style={{ color: '#fca5a5' }}>Shared-crux circularity (imp-36250):</strong> the delta
        floor this page charts is not a standalone I4 concern &mdash; it is the SAME certified
        min-gap object delta_lo(t) needed by the imp-36193 E3 interval pole-reduction crux, and the
        only candidate supplier of delta_lo(t) is the imp-2520 G-gronwall reading, which is itself
        documented Gronwall-vacuous exactly at this collision front. So none of the three
        obligations (G-step-error here, G-interval-enclosure, G-gronwall) is independently
        dischargeable. {IMP36250_SHARED_DELTA_LO_TRIAD_CROSS_REFERENCE.circularityStatement} All
        three stay OPEN; NO QED.
      </div>
    </div>
  );
}
