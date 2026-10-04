import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP34529_RECOVERED_POLE_CONVERGENCE_VS_INHERITED } from '../data/imp-34529-recovered-pole-convergence-vs-inherited.js';
import { ED } from '../styles/tokens.js';

const {
  poleLocation,
  ladder,
  recoveredPoles,
  residuals,
  shrinkGeoMean,
  totalContraction,
  residualLastPctOfKStar,
} = IMP34529_RECOVERED_POLE_CONVERGENCE_VS_INHERITED;

function RecoveredPoleClimbChart() {
  const svgW = 720;
  const padL = 56;
  const padR = 32;
  const padT = 20;
  const padB = 36;
  const svgH = 240;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const rungIdx = ladder.map((_, i) => i);
  const yMin = Math.min(...recoveredPoles) - 0.3;
  const yMax = poleLocation + 0.05;

  const xS = (i) => padL + (i / (rungIdx.length - 1)) * cW;
  const yS = (v) => padT + cH - ((v - yMin) / (yMax - yMin)) * cH;

  const climbPoints = recoveredPoles.map((p, i) => `${xS(i)},${yS(p)}`).join(' ');
  const poleY = yS(poleLocation);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />

      <line
        x1={padL}
        y1={poleY}
        x2={padL + cW}
        y2={poleY}
        stroke={ED.series2}
        strokeWidth={1.5}
        strokeDasharray="4 3"
      />
      <text x={padL + cW - 4} y={poleY - 6} textAnchor="end" fill={ED.series2} fontSize={9}>
        inherited k* = {poleLocation.toFixed(5)}
      </text>

      <polyline points={climbPoints} fill="none" stroke={ED.series1} strokeWidth={2} />
      {recoveredPoles.map((p, i) => (
        <g key={'rp' + i}>
          <circle cx={xS(i)} cy={yS(p)} r={4} fill={ED.series1} />
          <text x={xS(i)} y={yS(p) - 10} textAnchor="middle" fill={ED.series1} fontSize={8.5}>
            {p.toFixed(3)}
          </text>
          <text x={xS(i)} y={padT + cH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
            {i + 1}
          </text>
        </g>
      ))}

      {[yMin, poleLocation, yMax].map((t, ti) => (
        <text key={'yt' + ti} x={padL - 8} y={yS(t) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
          {t.toFixed(2)}
        </text>
      ))}

      <text x={padL + cW / 2} y={svgH - 2} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        rung (window tightens left to right)
      </text>
      <text
        x={16}
        y={padT + cH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={10}
        transform={`rotate(-90 16 ${padT + cH / 2})`}
      >
        recovered pole estimate
      </text>
    </svg>
  );
}

function ResidualDecayChart() {
  const svgW = 720;
  const padL = 56;
  const padR = 32;
  const padT = 20;
  const padB = 36;
  const svgH = 220;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const rungIdx = residuals.map((_, i) => i);
  const logResid = residuals.map((r) => Math.log10(r));
  const yMin = Math.min(...logResid) - 0.2;
  const yMax = Math.max(...logResid) + 0.2;

  const xS = (i) => padL + (i / (rungIdx.length - 1)) * cW;
  const yS = (v) => padT + cH - ((v - yMin) / (yMax - yMin)) * cH;

  const decayPoints = logResid.map((v, i) => `${xS(i)},${yS(v)}`).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />

      <polyline points={decayPoints} fill="none" stroke={ED.series3} strokeWidth={2} />
      {logResid.map((v, i) => (
        <g key={'res' + i}>
          <circle cx={xS(i)} cy={yS(v)} r={4} fill={ED.series3} />
          <text x={xS(i)} y={yS(v) - 10} textAnchor="middle" fill={ED.series3} fontSize={8.5}>
            {residuals[i].toFixed(5)}
          </text>
          <text x={xS(i)} y={padT + cH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
            {i + 1}
          </text>
        </g>
      ))}

      {[yMin, (yMin + yMax) / 2, yMax].map((t, ti) => (
        <text key={'yt' + ti} x={padL - 8} y={yS(t) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
          {t.toFixed(2)}
        </text>
      ))}

      <text x={padL + cW / 2} y={svgH - 2} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        rung (window tightens left to right)
      </text>
      <text
        x={16}
        y={padT + cH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={10}
        transform={`rotate(-90 16 ${padT + cH / 2})`}
      >
        log10(residual to k*)
      </text>
    </svg>
  );
}

export default function Imp34529RecoveredPoleConvergenceViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Recovered-Pole Convergence: 1/leak-Root Ladder onto k* (imp-34529)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-34529 tabulated the imp-34512 naive 1/leak-linear-root pole estimator over a graded
        seven-rung ladder of tightening OLS windows, reusing the imp-34247 metric, imp-34188 y(k)
        surrogate, and imp-34023 pole verbatim. The recovered pole climbs monotonically toward the
        inherited k* &asymp; {poleLocation.toFixed(5)} while the residual shrinks geometrically at
        &asymp;{shrinkGeoMean.toFixed(3)} per rung ({totalContraction.toFixed(1)}x total contraction),
        ending &asymp;{residualLastPctOfKStar.toFixed(4)}% of k* away.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        recovered pole climbing toward the inherited k* across the seven-rung ladder
      </p>
      <RecoveredPoleClimbChart />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
        residual |k*_recovered - k*| shrinking geometrically (&asymp;1/3 per rung, log scale)
      </p>
      <ResidualDecayChart />

      <table
        style={{
          width: '100%',
          marginTop: '1.5rem',
          borderCollapse: 'collapse',
          fontSize: '0.8rem',
        }}
      >
        <thead>
          <tr style={{ color: 'var(--ink-soft)', textAlign: 'left', borderBottom: '1px solid var(--rule)' }}>
            <th style={{ padding: '0.4rem 0.6rem' }}>rung</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>window</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>recovered pole</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>residual</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>shrink</th>
          </tr>
        </thead>
        <tbody>
          {ladder.map((r, i) => (
            <tr key={i} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
              <td style={{ padding: '0.4rem 0.6rem' }}>{i + 1}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
                [{r.window[0]}, {r.window[1]}]
              </td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.recoveredPole}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.residual}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
                {r.shrink == null ? '--' : r.shrink}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> cross-validation / measurement
        only -- reuses the imp-34247 metric, imp-34188 y(k) surrogate, imp-34023 pole, and imp-34512
        invLeakRoot estimator verbatim; the component model is the inherited imp-3220/imp-3406
        extrapolation, NOT a rigorous asymptotic; the residExp simple-zero structure is a
        numerical/structural observation, not a derivation; the C_mb GUE-conditional per imp-486 is
        UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a &ge; 0 remains
        untouched. No RH verdict, NO QED.
      </div>
    </div>
  );
}
