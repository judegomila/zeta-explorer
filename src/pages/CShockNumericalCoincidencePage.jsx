import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import COINCIDENCE_DATA from '../data/imp-3126-regular-mass-vs-c-shock-coincidence.js';
import { effectiveHeightForN } from '../data/lambda-rh-height-mapping.js';
import { ED, alpha } from '../styles/tokens.js';

const D = COINCIDENCE_DATA;
const REG_MASS = D.regularMass;

function cShockAtN(N) {
  const g = effectiveHeightForN(N);
  return Math.sqrt(2 / (3 * Math.log(g)));
}

const LOG_N_MIN = 3;
const LOG_N_MAX = 7;
const Y_MIN = 0.14;
const Y_MAX = 0.32;

function CShockChart() {
  const svgW = 560;
  const padL = 54;
  const padR = 24;
  const padT = 24;
  const padB = 50;
  const cW = svgW - padL - padR;
  const cH = 290;
  const svgH = padT + cH + padB;

  const xS = (N) => padL + ((Math.log10(N) - LOG_N_MIN) / (LOG_N_MAX - LOG_N_MIN)) * cW;
  const yS = (v) => padT + cH * (1 - (v - Y_MIN) / (Y_MAX - Y_MIN));

  const curvePts = [];
  for (let i = 0; i <= 140; i++) {
    const logN = LOG_N_MIN + (i / 140) * (LOG_N_MAX - LOG_N_MIN);
    const N = Math.pow(10, logN);
    const cs = cShockAtN(N);
    if (isFinite(cs) && cs >= Y_MIN - 0.02 && cs <= Y_MAX + 0.02) {
      curvePts.push({ N, cs });
    }
  }
  const curvePath = curvePts
    .map((p, i) => (i === 0 ? 'M' : 'L') + xS(p.N).toFixed(1) + ',' + yS(p.cs).toFixed(1))
    .join(' ');

  const yMass = yS(REG_MASS);

  const xTicks = [3, 4, 5, 6, 7].map((logN) => ({
    x: padL + ((logN - LOG_N_MIN) / (LOG_N_MAX - LOG_N_MIN)) * cW,
    logN,
  }));

  const yGridVals = [0.16, 0.18, 0.20, 0.22, 0.24, 0.26, 0.28, 0.30];

  const xNear = xS(1e4);
  const yNear = yS(cShockAtN(1e4));

  const xGap6 = xS(1e6);
  const cs1e6 = cShockAtN(1e6);
  const yGap1 = yMass;
  const yGap2 = yS(cs1e6);
  const yGapMid = (yGap1 + yGap2) / 2;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <defs>
        <clipPath id="cshock3126-clip">
          <rect x={padL} y={padT} width={cW} height={cH} />
        </clipPath>
      </defs>

      <rect x={padL} y={padT} width={cW} height={cH} fill={ED.paper} rx={2} />

      {yGridVals.map((v) => {
        const y = yS(v);
        if (y < padT - 2 || y > padT + cH + 2) return null;
        return (
          <g key={v}>
            <line x1={padL} y1={y} x2={padL + cW} y2={y}
              stroke={ED.ruleSoft} strokeWidth={0.7} />
            <text x={padL - 4} y={y + 3.5} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
              {v.toFixed(2)}
            </text>
          </g>
        );
      })}

      {xTicks.map(({ x, logN }) => (
        <line key={logN} x1={x} y1={padT} x2={x} y2={padT + cH}
          stroke={ED.ruleSoft} strokeWidth={0.6} />
      ))}

      <line x1={padL} y1={yMass} x2={padL + cW} y2={yMass}
        stroke={ED.series3} strokeWidth={2.2} strokeDasharray="9 4"
        clipPath="url(#cshock3126-clip)" />

      <path d={curvePath} fill="none" stroke={ED.series1} strokeWidth={2.4}
        clipPath="url(#cshock3126-clip)" />

      <line x1={xNear} y1={padT} x2={xNear} y2={padT + cH}
        stroke={ED.brassDeco} strokeWidth={1.1} strokeDasharray="4 3"
        clipPath="url(#cshock3126-clip)" />

      <circle cx={xNear} cy={yNear} r={4.5} fill={ED.brassDeco} />
      <circle cx={xNear} cy={yMass} r={3.5} fill={ED.series3} />

      <text x={xNear + 7} y={yNear - 10} fill={ED.brass} fontSize={8.5} fontWeight="700">
        N=10^4: gap=2.1e-4
      </text>
      <text x={xNear + 7} y={yNear + 4} fill={ED.brass} fontSize={8}>
        near-miss (only here)
      </text>

      <line x1={xGap6} y1={yGap1} x2={xGap6} y2={yGap2}
        stroke={ED.series2} strokeWidth={1.8}
        clipPath="url(#cshock3126-clip)" />
      <line x1={xGap6 - 5} y1={yGap1} x2={xGap6 + 5} y2={yGap1}
        stroke={ED.series2} strokeWidth={1.2} />
      <line x1={xGap6 - 5} y1={yGap2} x2={xGap6 + 5} y2={yGap2}
        stroke={ED.series2} strokeWidth={1.2} />
      <text x={xGap6 + 8} y={yGapMid - 5} fill={ED.series2} fontSize={8.5} fontWeight="700">
        N=10^6: gap=4.5e-2
      </text>
      <text x={xGap6 + 8} y={yGapMid + 7} fill={ED.series2} fontSize={8}>
        213x the N=10^4 gap
      </text>

      <rect x={padL} y={padT} width={cW} height={cH}
        fill="none" stroke={ED.rule} strokeWidth={1} />

      <g transform={'translate(' + (padL + 8) + ',' + (padT + 8) + ')'}>
        <rect x={0} y={0} width={218} height={50} fill={alpha(ED.paper, 0.93)} rx={4}
          stroke={ED.rule} strokeWidth={0.8} />
        <line x1={8} y1={14} x2={24} y2={14} stroke={ED.series1} strokeWidth={2.4} />
        <text x={30} y={18} fill={ED.series1} fontSize={9.5}>
          C_shock(N) = sqrt(2/(3 log gamma_N))
        </text>
        <line x1={8} y1={30} x2={24} y2={30} stroke={ED.series3} strokeWidth={2.2}
          strokeDasharray="7 3" />
        <text x={30} y={34} fill={ED.series3} fontSize={9.5}>
          regular mass {REG_MASS.toFixed(5)} (FIXED, N-free)
        </text>
        <text x={8} y={46} fill={ED.inkFaint} fontSize={7.5}>
          horizontal line: a definite integral, no N dependence (imp-3106)
        </text>
      </g>

      {xTicks.map(({ x, logN }) => (
        <g key={logN}>
          <line x1={x} y1={padT + cH} x2={x} y2={padT + cH + 5}
            stroke={ED.rule} strokeWidth={1} />
          <text x={x} y={padT + cH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5}>
            {'10^' + logN}
          </text>
        </g>
      ))}
      <text x={padL + cW / 2} y={padT + cH + 34} textAnchor="middle"
        fill={ED.inkFaint} fontSize={10}>
        N  (zero count; log scale)
      </text>

      <text
        x={11}
        y={padT + cH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={10}
        transform={'rotate(-90,11,' + (padT + cH / 2) + ')'}
      >
        value
      </text>
    </svg>
  );
}

export default function CShockNumericalCoincidencePage() {
  const { ladder, regularMass, absDiffStar, absDiffBlowupOverLadder, nStar } = D;

  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="C_shock(N) Near-Miss: Numerical Coincidence (imp-3126)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        The imp-3106 regular tail mass &int;<sub>s<sub>0</sub>+1</sub><sup>&infin;</sup> &phi; ds
        {' '}= {regularMass.toFixed(7)} is a <em>fixed, N-independent</em> definite integral.
        The imp-3026/imp-3070 cusp constant C_shock(N) = sqrt(2/(3 log &gamma;<sub>N</sub>))
        decays monotonically in N. They agree to ~2.1&times;10<sup>-4</sup> near N=10<sup>4</sup>,
        because C_shock(N) slides through the fixed line there and keeps falling. Moving
        two decades in N grows the gap {Math.round(absDiffBlowupOverLadder)}&times;.
        This is a{' '}
        <strong style={{ color: 'var(--series-2)' }}>numerical coincidence, not a structural identity</strong>.
      </p>

      <CShockChart />

      <div style={{
        marginTop: '1.25rem',
        background: 'color-mix(in srgb, var(--paper) 80%, transparent)', border: '1px solid var(--rule)',
        borderRadius: 6, padding: '0.9rem', overflowX: 'auto',
      }}>
        <p style={{ color: 'var(--ink-soft)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
          N-FRAGILITY: |C_shock(N) - 0.2690| GROWS {Math.round(absDiffBlowupOverLadder)}x OVER TWO DECADES
        </p>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
          <thead>
            <tr>
              {['N', 'C_shock(N)', 'regular mass', '|diff|', 'ratio vs N=10^4'].map((h) => (
                <th key={h} style={{
                  color: 'var(--ink-faint)', textAlign: 'right', paddingBottom: 4,
                  paddingRight: 10, fontWeight: 600,
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ladder.map((row, i) => {
              const ratioToStar = i === 0 ? null : (row.absDiff / absDiffStar);
              const isNear = row.N === nStar;
              return (
                <tr key={row.N}>
                  <td style={{ color: isNear ? 'var(--brass)' : 'var(--ink-soft)', textAlign: 'right', paddingRight: 10 }}>
                    10^{Math.log10(row.N)}
                    {isNear && <span style={{ marginLeft: 5, color: 'var(--brass)' }}>&#9733; near-miss</span>}
                  </td>
                  <td style={{ color: 'var(--series-1)', textAlign: 'right', paddingRight: 10 }}>
                    {row.cShock.toFixed(8)}
                  </td>
                  <td style={{ color: 'var(--series-3)', textAlign: 'right', paddingRight: 10 }}>
                    {row.regularMass.toFixed(8)}
                  </td>
                  <td style={{ color: isNear ? 'var(--brass)' : 'var(--series-2)', textAlign: 'right', paddingRight: 10 }}>
                    {row.absDiff.toExponential(4)}
                  </td>
                  <td style={{ color: isNear ? 'var(--brass)' : 'var(--series-2)', textAlign: 'right' }}>
                    {i === 0 ? '1x' : Math.round(ratioToStar) + 'x'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div style={{
        marginTop: '1rem', padding: '0.75rem 1rem',
        background: 'color-mix(in srgb, var(--ink-soft) 4%, transparent)', borderLeft: '3px solid var(--rule)',
        borderRadius: '0 4px 4px 0', fontSize: '0.8rem', color: 'var(--ink-faint)',
      }}>
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> Pure cross-validation of two
        degree-0 scalars. Neither quantity is an operator step; neither proves nor weakens RH.
        The off-diagonal endpoint-Hankel step (imp-3066) remains the lone obstruction and is
        untouched here.
        {' '}<strong style={{ color: 'var(--series-2)' }}>COINCIDENCE verdict — not structural.</strong>
      </div>

      <div style={{ marginTop: '1rem', fontSize: '0.85rem', color: 'var(--ink-faint)' }}>
        <strong>Related:</strong>{' '}
        <Link to="/excess-fraction-phi" style={{ color: 'var(--series-5)' }}>
          &phi;(s) = G(s)/F(s) Regular Mass (imp-3106)
        </Link>
        {', '}
        <Link to="/section26-conditioning-artifact" style={{ color: 'var(--series-5)' }}>
          Section-26 Conditioning Artifact
        </Link>
      </div>
    </div>
  );
}
