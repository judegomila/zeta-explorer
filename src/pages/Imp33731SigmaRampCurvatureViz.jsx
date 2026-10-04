import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP33701_SIGMA_POSTPEAK_RAMP_CURVATURE_INFLECTION } from '../data/imp-33701-sigma-postpeak-ramp-curvature-inflection.js';
import { ED } from '../styles/tokens.js';

const { ladder, rampVelocity, rampAcceleration, inflectionDecade, steepestStepDecade } =
  IMP33701_SIGMA_POSTPEAK_RAMP_CURVATURE_INFLECTION;

function RampCurvatureChart() {
  const svgW = 720;
  const padL = 48;
  const padR = 32;
  const padT = 20;
  const padB = 40;
  const svgH = 300;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const kMin = 6;
  const kMax = 12;
  const xS = (k) => padL + ((k - kMin) / (kMax - kMin)) * cW;

  const yMin = -0.1;
  const yMax = 0.5;
  const yS = (v) => padT + cH - ((v - yMin) / (yMax - yMin)) * cH;

  const yTicks = [-0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.5];
  const xTicks = ladder.decadeKs;

  const p_local = ladder.decadeKs.map((k, i) => ({ k, p: ladder.p_local[i] }));
  const d1 = rampVelocity.map((r, i) => ({ k: ladder.decadeKs[i] + 0.5, d1: r.d1 }));
  const d2 = rampAcceleration.map((r, i) => ({ k: ladder.decadeKs[i + 1], d2: r.d2 }));

  const p_points = p_local.map((r) => `${xS(r.k)},${yS(r.p)}`).join(' ');
  const d1_points = d1.map((r) => `${xS(r.k)},${yS(r.d1)}`).join(' ');
  const d2_points = d2.map((r) => `${xS(r.k)},${yS(r.d2)}`).join(' ');

  const inflectionK = Number(inflectionDecade.split('->')[0].replace('1e', ''));

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={yS(0)} x2={padL + cW} y2={yS(0)} stroke={ED.rule} strokeWidth={1} />
      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />

      {yTicks.map((t) => (
        <g key={'yt' + t}>
          <line x1={padL - 4} y1={yS(t)} x2={padL + cW} y2={yS(t)} stroke={ED.ruleSoft} strokeWidth={1} />
          <text x={padL - 8} y={yS(t) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {t.toFixed(2)}
          </text>
        </g>
      ))}

      {/* inflection decade reference line -- D2 sign change lands here */}
      <line
        x1={xS(inflectionK)}
        y1={padT}
        x2={xS(inflectionK)}
        y2={padT + cH}
        stroke={ED.series2}
        strokeWidth={1.25}
        strokeDasharray="5,3"
      />
      <text x={xS(inflectionK) + 4} y={padT + 10} fill={ED.series2} fontSize={9}>
        knee ({inflectionDecade})
      </text>

      {xTicks.map((k) => (
        <g key={'xt' + k}>
          <line x1={xS(k)} y1={padT + cH - 4} x2={xS(k)} y2={padT + cH + 4} stroke={ED.rule} strokeWidth={1} />
          <text x={xS(k)} y={padT + cH + 18} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
            {'10^' + k}
          </text>
        </g>
      ))}
      <text x={padL + cW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        N (decade boundary)
      </text>
      <text
        x={14}
        y={padT + cH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={10}
        transform={`rotate(-90 14 ${padT + cH / 2})`}
      >
        p_local, D1, D2
      </text>

      <polyline points={p_points} fill="none" stroke={ED.series1} strokeWidth={1.75} />
      {p_local.map((r) => (
        <circle key={'p' + r.k} cx={xS(r.k)} cy={yS(r.p)} r={2.75} fill={ED.series1} stroke={ED.paper} strokeWidth={0.75} />
      ))}

      <polyline points={d1_points} fill="none" stroke={ED.series5} strokeWidth={1.75} />
      {d1.map((r) => (
        <circle key={'d1' + r.k} cx={xS(r.k)} cy={yS(r.d1)} r={2.75} fill={ED.series5} stroke={ED.paper} strokeWidth={0.75} />
      ))}

      <polyline points={d2_points} fill="none" stroke={ED.brassDeco} strokeWidth={1.75} strokeDasharray="4,2" />
      {d2.map((r) => (
        <circle
          key={'d2' + r.k}
          cx={xS(r.k)}
          cy={yS(r.d2)}
          r={r.k === inflectionK ? 4.5 : 2.75}
          fill={r.k === inflectionK ? ED.series2 : ED.brassDeco}
          stroke={ED.paper}
          strokeWidth={0.75}
        />
      ))}

      <g fontSize={9}>
        <circle cx={padL + 8} cy={padT + 8} r={3} fill={ED.series1} />
        <text x={padL + 16} y={padT + 11} fill={ED.inkSoft}>p_local(k) (exponent ladder)</text>
        <circle cx={padL + 8} cy={padT + 22} r={3} fill={ED.series5} />
        <text x={padL + 16} y={padT + 25} fill={ED.inkSoft}>D1 (ramp velocity)</text>
        <circle cx={padL + 8} cy={padT + 36} r={3} fill={ED.brassDeco} />
        <text x={padL + 16} y={padT + 39} fill={ED.inkSoft}>D2 (ramp acceleration)</text>
      </g>
    </svg>
  );
}

export default function Imp33731SigmaRampCurvatureViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="sigma(N) Exponent-Ramp Curvature: Ladder, Velocity, Acceleration (imp-33701 / imp-33731)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-33701 differenced the imp-33582 six-decade local decay-exponent ladder p_dec(6..11)
        and found the RAMP is monotone in value but SIGMOID in shape: the first difference (ramp
        velocity D1) rises then falls, and the second difference (ramp acceleration D2) changes
        sign exactly once -- a single knee -- landing in the [1e10,1e11] decade. This page is the
        first viz surface for that finding: the exponent ladder alongside its D1 and D2 curves,
        with the knee ({inflectionDecade}) and the steepest step ({steepestStepDecade}) marked.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        p_local(k), D1(k), D2(k) vs decade boundary N = 10^k, k = 6..11
      </p>
      <RampCurvatureChart />

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
            <th style={{ padding: '0.4rem 0.6rem' }}>decade k</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>p_local</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>D1 (velocity, to next k)</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>D2 (acceleration, centered)</th>
          </tr>
        </thead>
        <tbody>
          {ladder.decadeKs.map((k, i) => {
            const d1Row = rampVelocity[i];
            const d2Row = rampAcceleration[i - 1];
            const isKnee = d2Row && d2Row.decade === inflectionDecade;
            return (
              <tr
                key={k}
                style={{
                  borderBottom: '1px solid var(--rule-soft)',
                  color: isKnee ? 'var(--series-2)' : 'var(--ink)',
                }}
              >
                <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>10^{k}</td>
                <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{ladder.p_local[i]}</td>
                <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{d1Row ? d1Row.d1 : ''}</td>
                <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{d2Row ? d2Row.d2 : ''}</td>
              </tr>
            );
          })}
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> measurement/fit only -- the
        component model is the inherited imp-3220/imp-3406 extrapolation, not a rigorous
        asymptotic, and the C_mb GUE-conditional per imp-486 is untouched. This page adds no new
        derivation; it gives the imp-33701 curvature finding a visual surface. No bound changes;
        establishes no operator positivity; imp-3066 K_a &ge; 0 remains untouched. No RH verdict,
        NO QED.
      </div>
    </div>
  );
}
