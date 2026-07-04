import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP3929_ROWS,
  IMP3929_MIN_DMIN_VS_GLOBAL,
  IMP3929_MAX_DMIN_VS_GLOBAL,
} from '../data/imp-3929-horizon-elasticity-sharpening-viz-data.js';

const REALISED_COLOR = '#38bdf8';
const DMIN_COLOR = '#34d399';
const GLOBAL_COLOR = '#f472b6';

function ThreeBarChart() {
  const svgW = 700;
  const padL = 70;
  const padR = 24;
  const padT = 16;
  const padB = 40;
  const cW = svgW - padL - padR;
  const cH = 260;
  const svgH = padT + cH + padB;

  const yMin = 1;
  const yMax = 1e6;
  const logYMin = Math.log10(yMin);
  const logYMax = Math.log10(yMax);
  const yS = (v) => padT + cH * (1 - (Math.log10(v) - logYMin) / (logYMax - logYMin));
  const yTicks = [1, 1e1, 1e2, 1e3, 1e4, 1e5, 1e6];

  const groupW = cW / IMP3929_ROWS.length;
  const barW = 17;
  const bottom = padT + cH;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill="#0a0f1a" rx={2} />

      {yTicks.map((v) => (
        <g key={v}>
          <line x1={padL} y1={yS(v)} x2={padL + cW} y2={yS(v)} stroke="#1e293b" strokeWidth={0.7} />
          <text x={padL - 6} y={yS(v) + 3.5} textAnchor="end" fill="#475569" fontSize={9}>
            {v.toExponential(0)}
          </text>
        </g>
      ))}

      {IMP3929_ROWS.map((r, i) => {
        const cx = padL + (i + 0.5) * groupW;
        return (
          <g key={r.plateauIndex}>
            <rect
              x={cx - 1.5 * barW - 6}
              y={yS(r.realisedElasticity)}
              width={barW}
              height={Math.max(bottom - yS(r.realisedElasticity), 0)}
              fill={REALISED_COLOR}
              opacity={0.9}
              rx={2}
            />
            <rect
              x={cx - 0.5 * barW}
              y={yS(r.dminCeil)}
              width={barW}
              height={Math.max(bottom - yS(r.dminCeil), 0)}
              fill={DMIN_COLOR}
              opacity={0.9}
              rx={2}
            />
            <rect
              x={cx + 0.5 * barW + 6}
              y={yS(r.globalCeil)}
              width={barW}
              height={Math.max(bottom - yS(r.globalCeil), 0)}
              fill={GLOBAL_COLOR}
              opacity={0.85}
              rx={2}
            />
          </g>
        );
      })}

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke="#334155" strokeWidth={1} />

      {IMP3929_ROWS.map((r, i) => (
        <text
          key={'x' + r.plateauIndex}
          x={padL + (i + 0.5) * groupW}
          y={padT + cH + 17}
          textAnchor="middle"
          fill="#64748b"
          fontSize={9}
        >
          plateau {r.plateauIndex}
        </text>
      ))}
      <text x={padL + cW / 2} y={padT + cH + 32} textAnchor="middle" fill="#64748b" fontSize={10}>
        imp-3874-verified plateau (log axis)
      </text>
      <text
        x={16}
        y={padT + cH / 2}
        textAnchor="middle"
        fill="#64748b"
        fontSize={10}
        transform={'rotate(-90,16,' + (padT + cH / 2) + ')'}
      >
        elasticity scale
      </text>

      <rect x={padL + cW - 210} y={padT + 4} width={9} height={9} fill={REALISED_COLOR} />
      <text x={padL + cW - 197} y={padT + 12} fill="#94a3b8" fontSize={9}>
        realised (dPsi/dT)/Psi
      </text>
      <rect x={padL + cW - 210} y={padT + 18} width={9} height={9} fill={DMIN_COLOR} />
      <text x={padL + cW - 197} y={padT + 26} fill="#94a3b8" fontSize={9}>
        8/Dmin&sup2; sharp proxy
      </text>
      <rect x={padL + cW - 210} y={padT + 32} width={9} height={9} fill={GLOBAL_COLOR} />
      <text x={padL + cW - 197} y={padT + 40} fill="#94a3b8" fontSize={9}>
        8/smin&sup2; global ceiling
      </text>
    </svg>
  );
}

function TighteningChart() {
  const svgW = 700;
  const padL = 70;
  const padR = 24;
  const padT = 20;
  const padB = 40;
  const cW = svgW - padL - padR;
  const cH = 180;
  const svgH = padT + cH + padB;

  const yMin = 1e3;
  const yMax = 4e4;
  const logYMin = Math.log10(yMin);
  const logYMax = Math.log10(yMax);
  const yS = (v) => padT + cH * (1 - (Math.log10(v) - logYMin) / (logYMax - logYMin));
  const yTicks = [1e3, 1e4, 3e4];

  const xS = (i) => padL + ((i + 0.5) / IMP3929_ROWS.length) * cW;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill="#0a0f1a" rx={2} />

      {yTicks.map((v) => (
        <g key={v}>
          <line x1={padL} y1={yS(v)} x2={padL + cW} y2={yS(v)} stroke="#1e293b" strokeWidth={0.7} />
          <text x={padL - 6} y={yS(v) + 3.5} textAnchor="end" fill="#475569" fontSize={9}>
            {v.toExponential(0)}
          </text>
        </g>
      ))}

      {IMP3929_ROWS.map((r, i) => {
        const barTop = yS(r.dminVsGlobal);
        const barBottom = padT + cH;
        const isMin = r.dminVsGlobal === IMP3929_MIN_DMIN_VS_GLOBAL;
        const isMax = r.dminVsGlobal === IMP3929_MAX_DMIN_VS_GLOBAL;
        return (
          <rect
            key={r.plateauIndex}
            x={xS(i) - 16}
            y={barTop}
            width={32}
            height={Math.max(barBottom - barTop, 0)}
            fill={isMin || isMax ? '#fbcfe8' : '#a78bfa'}
            opacity={isMin || isMax ? 1 : 0.75}
            rx={2}
          />
        );
      })}

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke="#334155" strokeWidth={1} />

      {IMP3929_ROWS.map((r, i) => (
        <text key={'x' + r.plateauIndex} x={xS(i)} y={padT + cH + 17} textAnchor="middle" fill="#64748b" fontSize={9}>
          plateau {r.plateauIndex}
        </text>
      ))}
      <text x={padL + cW / 2} y={padT + cH + 32} textAnchor="middle" fill="#64748b" fontSize={10}>
        imp-3874-verified plateau (log axis)
      </text>
      <text
        x={16}
        y={padT + cH / 2}
        textAnchor="middle"
        fill="#64748b"
        fontSize={10}
        transform={'rotate(-90,16,' + (padT + cH / 2) + ')'}
      >
        (8/smin&sup2;) / (8/Dmin&sup2;)
      </text>
    </svg>
  );
}

export default function Imp3929HorizonElasticitySharpeningViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 940, margin: '0 auto' }}>
      <PageHeader title="imp-3898 Horizon-Elasticity Sharpening: Realised Elasticity vs 8/Dmin&sup2; Sharp Proxy vs Loose Global 8/smin&sup2; Ceiling (1987x-35493x Tightening)" />

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-3854 bounded the horizon elasticity by a GLOBAL constant 8/smin&sup2;, which imp-3874
        found 2279x-34004x looser than the realised (dPsi_N/dT)/Psi_N. imp-3898 derived a rigorous
        per-term PATH-LOCAL majorant e_j &le; 8/s_min(j)&sup2;, tight at the nearest-cumulative-distance
        proxy 8/Dmin&sup2;, and certified live against imp-3874/imp-3725 that this proxy reproduces the
        realised elasticity to a factor in [0.83, 1.05] &mdash; a 1987x-35493x sharpening of the global
        ceiling on the same three plateaus (0, 4, 9).
      </p>

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        realised elasticity vs Dmin proxy vs global ceiling per plateau, log axis
      </p>
      <ThreeBarChart />

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', margin: '1.5rem 0 0.5rem' }}>
        (8/smin&sup2;) / (8/Dmin&sup2;) tightening factor per plateau, log axis &mdash; labelled bars mark
        the overall min and max
      </p>
      <TighteningChart />

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
        <strong style={{ color: '#94a3b8' }}>Reading the chart:</strong> the top chart puts three bars
        per plateau on a shared log axis &mdash; the realised elasticity (blue), the 8/Dmin&sup2;
        path-local proxy (green), and the loose global 8/smin&sup2; ceiling (pink). Blue and green sit
        within a factor of ~1.05 of each other on every plateau while pink towers 3-4 orders of
        magnitude above both. The bottom chart plots that gap directly as the (8/smin&sup2;)/(8/Dmin&sup2;)
        tightening factor, ranging from {IMP3929_MIN_DMIN_VS_GLOBAL.toFixed(0)}x (plateau 4) to{' '}
        {IMP3929_MAX_DMIN_VS_GLOBAL.toFixed(0)}x (plateau 9).
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
        <strong style={{ color: '#94a3b8' }}>Honest status:</strong> 8/Dmin&sup2; is a sharp PROXY, not
        a certified upper bound &mdash; it is exceeded by the realised elasticity by ~4.4%-4.5% on
        plateaus 0 and 9 (green bar sits fractionally below blue there). The certified rigorous object
        is the weighted path-local majorant, whose collapse to an explicit C/Dmin&sup2; constant is a
        named open sub-gap (imp-3898-sub-tail-weight-constant); LEMMA-3854 stays a valid loose
        over-bound. Only the 3 imp-3874-verified plateaus are shown here; no new Lambda bound;
        imp-3066 K_a &ge; 0 positivity untouched; Platt-Trudgian &Lambda; &le; 0.2 remains the rigorous
        SOTA. NO QED.
      </div>
    </div>
  );
}
