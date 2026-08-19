import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP34902_SIGMA_KNEE_RESUMMATION_EPS_SWEEP } from '../data/imp-34902-sigma-knee-resummation-eps-sweep.js';

const D = IMP34902_SIGMA_KNEE_RESUMMATION_EPS_SWEEP;
const ROWS = D.epsSweep;
const S = D.summary;
const INERT_THRESHOLD = D.radiusContext.inertThreshold;

// max cross-method SC-to-exactF residual-ratio deviation vs the swept bookkeeping eps (log-x), showing
// every rung staying below the imp-34888 5% inertness threshold across the whole convergent disk (0, R].
function InertnessChart() {
  const svgW = 720;
  const svgH = 260;
  const padL = 60;
  const padR = 20;
  const padT = 24;
  const padB = 40;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const logEps = ROWS.map((r) => Math.log10(r.eps));
  const devs = ROWS.map((r) => r.maxResidRatioDev);
  const xMin = Math.min(...logEps) - 0.1;
  const xMax = Math.max(...logEps) + 0.1;
  const yMax = Math.max(INERT_THRESHOLD, ...devs) * 1.15;
  const xAt = (x) => padL + ((x - xMin) / (xMax - xMin)) * cW;
  const yAt = (y) => padT + cH - (y / yMax) * cH;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke="#334155" strokeWidth={1.5} />
      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke="#334155" strokeWidth={1} />

      {[0, yMax / 4, yMax / 2, (3 * yMax) / 4, yMax].map((t) => (
        <g key={t}>
          <line x1={padL - 4} y1={yAt(t)} x2={padL + cW} y2={yAt(t)} stroke="#1e293b" strokeWidth={1} />
          <text x={padL - 8} y={yAt(t) + 3} textAnchor="end" fill="#64748b" fontSize={9}>
            {(t * 100).toFixed(1)}%
          </text>
        </g>
      ))}
      {logEps.map((x, i) => (
        <g key={i}>
          <line x1={xAt(x)} y1={padT + cH} x2={xAt(x)} y2={padT + cH + 4} stroke="#334155" strokeWidth={1} />
          <text x={xAt(x)} y={padT + cH + 16} textAnchor="middle" fill="#64748b" fontSize={9}>
            {ROWS[i].eps}
          </text>
        </g>
      ))}

      {/* imp-34888 5% inertness threshold */}
      <line
        x1={padL}
        y1={yAt(INERT_THRESHOLD)}
        x2={padL + cW}
        y2={yAt(INERT_THRESHOLD)}
        stroke="#f87171"
        strokeWidth={1.5}
        strokeDasharray="5,4"
      />
      <text x={padL + 6} y={yAt(INERT_THRESHOLD) - 6} fill="#f87171" fontSize={9.5} fontWeight={700}>
        5% inertness threshold
      </text>

      {/* physical eps = 1 marker */}
      <line
        x1={xAt(0)}
        y1={padT}
        x2={xAt(0)}
        y2={padT + cH}
        stroke="#fbbf24"
        strokeWidth={1}
        strokeDasharray="2,3"
      />
      <text x={xAt(0) + 4} y={padT + 10} fill="#fbbf24" fontSize={9}>
        eps=1
      </text>

      <polyline
        points={devs.map((d, i) => `${xAt(logEps[i])},${yAt(d)}`).join(' ')}
        fill="none"
        stroke="#38bdf8"
        strokeWidth={2}
      />
      {devs.map((d, i) => (
        <circle key={i} cx={xAt(logEps[i])} cy={yAt(d)} r={4} fill="#38bdf8" />
      ))}

      <text x={padL + cW / 2} y={svgH - 4} textAnchor="middle" fill="#64748b" fontSize={10}>
        max cross-method SC-to-exactF residual-ratio deviation vs eps (x-axis: bookkeeping eps, log-spaced) --
        stays below 5% across the whole swept (0, {D.radiusContext.dombSykesRadius}]
      </text>
    </svg>
  );
}

// absolute SC-to-exactF plain-sum residual (dex) vs eps, showing the monotonic drift from negative
// through the near-zero physical crossing at eps = 1 up to the large-positive value near R.
function ResidualDriftChart() {
  const svgW = 720;
  const svgH = 260;
  const padL = 60;
  const padR = 20;
  const padT = 24;
  const padB = 40;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const logEps = ROWS.map((r) => Math.log10(r.eps));
  const resids = ROWS.map((r) => r.plainResidDex);
  const xMin = Math.min(...logEps) - 0.1;
  const xMax = Math.max(...logEps) + 0.1;
  const yMin = Math.min(...resids) * 1.15;
  const yMax = Math.max(...resids) * 1.15;
  const xAt = (x) => padL + ((x - xMin) / (xMax - xMin)) * cW;
  const yAt = (y) => padT + cH - ((y - yMin) / (yMax - yMin)) * cH;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke="#334155" strokeWidth={1.5} />
      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke="#334155" strokeWidth={1} />

      {[yMin, yMin + (yMax - yMin) / 4, yMin + (yMax - yMin) / 2, yMin + (3 * (yMax - yMin)) / 4, yMax].map(
        (t) => (
          <g key={t}>
            <line x1={padL - 4} y1={yAt(t)} x2={padL + cW} y2={yAt(t)} stroke="#1e293b" strokeWidth={1} />
            <text x={padL - 8} y={yAt(t) + 3} textAnchor="end" fill="#64748b" fontSize={9}>
              {t.toFixed(2)}
            </text>
          </g>
        )
      )}
      {logEps.map((x, i) => (
        <g key={i}>
          <line x1={xAt(x)} y1={padT + cH} x2={xAt(x)} y2={padT + cH + 4} stroke="#334155" strokeWidth={1} />
          <text x={xAt(x)} y={padT + cH + 16} textAnchor="middle" fill="#64748b" fontSize={9}>
            {ROWS[i].eps}
          </text>
        </g>
      ))}

      {/* zero-residual reference */}
      <line x1={padL} y1={yAt(0)} x2={padL + cW} y2={yAt(0)} stroke="#334155" strokeWidth={1} strokeDasharray="3,3" />

      {/* physical eps = 1 crossing marker */}
      <circle cx={xAt(0)} cy={yAt(S.plainResidAtEps1Dex)} r={5} fill="#fbbf24" />
      <text x={xAt(0) + 6} y={yAt(S.plainResidAtEps1Dex) - 8} fill="#fbbf24" fontSize={9}>
        eps=1: {S.plainResidAtEps1Dex.toExponential(2)} dex
      </text>

      <polyline
        points={resids.map((r, i) => `${xAt(logEps[i])},${yAt(r)}`).join(' ')}
        fill="none"
        stroke="#a78bfa"
        strokeWidth={2}
      />
      {resids.map((r, i) => (
        <circle key={i} cx={xAt(logEps[i])} cy={yAt(r)} r={4} fill="#a78bfa" />
      ))}

      <text x={padL + cW / 2} y={svgH - 4} textAnchor="middle" fill="#64748b" fontSize={10}>
        plain-sum SC-to-exactF residual (dex) vs eps -- drifts monotonically through the near-zero physical
        crossing, NOT a flat plateau
      </text>
    </svg>
  );
}

export default function Imp34936SigmaKneeEpsSweepViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Sigma-Knee Resummation Eps-Sweep (imp-34936 / imp-34902)" />

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        {D.question}
      </p>

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        Cross-method inertness (max residual-ratio deviation among the plain/Pade/Wynn/Borel resummations)
        stays BELOW the 5% threshold across the entire swept eps range, rising from
        {' '}{S.residResidRatioDevAtEps1.toExponential(2)} at the physical eps=1 to only
        {' '}{S.maxResidRatioDevOverSweep.toExponential(2)} at eps={D.radiusContext.dombSykesRadius}.
      </p>
      <InertnessChart />

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', margin: '1.25rem 0 0.5rem' }}>
        The ABSOLUTE SC-to-exactF residual is not flat off eps=1: it drifts monotonically from
        {' '}{S.plainResidAtEps0p1Dex.toExponential(2)} dex (eps=0.1) through the near-zero physical crossing
        {' '}{S.plainResidAtEps1Dex.toExponential(2)} dex (eps=1) up to {S.plainResidAtEps91Dex.toFixed(2)} dex
        (eps={D.radiusContext.dombSykesRadius}) -- the imp-34821/imp-34888 "plateau" is the value AT the
        physical bookkeeping point, not a flat shelf across eps.
      </p>
      <ResidualDriftChart />

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
        <strong style={{ color: '#94a3b8' }}>Status:</strong> Viz-only page rendering the
        imp-34902 eps-sweep literals verbatim (no new computation). Measurement on the INHERITED
        imp-3220/imp-3406 surrogate crossover map, NOT a rigorous asymptotic; C_mb GUE-conditional per
        imp-486 UNTOUCHED; imp-3066 K_a&ge;0 untouched; far-tail exponent stays 1/2 (imp-3463); changes
        no bound; establishes no operator positivity; no RH verdict, NO QED. Platt-Trudgian
        Lambda&nbsp;&le;&nbsp;0.2 remains SOTA.
      </div>
    </div>
  );
}
