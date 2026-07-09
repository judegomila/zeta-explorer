import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP35183_SIGMA_FARTAIL_EXPONENT_LADDER_VIZ_DATA } from '../data/imp-35183-sigma-fartail-exponent-ladder-viz-data.js';

const D = IMP35183_SIGMA_FARTAIL_EXPONENT_LADDER_VIZ_DATA;
const LADDER = D.ladder;

// p_dec climbing toward the imp-3463 1/2 asymptote, overlaid with the 1/(2 ln N) envelope curve.
function ExponentLadderChart() {
  const svgW = 680;
  const padL = 50;
  const padR = 20;
  const padT = 44;
  const padB = 40;
  const plotW = svgW - padL - padR;
  const plotH = 260;
  const svgH = padT + plotH + padB;

  const kMin = LADDER[0].k;
  const kMax = LADDER[LADDER.length - 1].k;
  const yMin = 0.42;
  const yMax = 0.505;
  const xOf = (k) => padL + ((k - kMin) / (kMax - kMin)) * plotW;
  const yOf = (p) => padT + plotH - ((p - yMin) / (yMax - yMin)) * plotH;

  const measuredPath = LADDER.map((r, i) => `${i === 0 ? 'M' : 'L'} ${xOf(r.k)} ${yOf(r.p_local)}`).join(' ');
  const envelopePath = LADDER.map((r, i) => `${i === 0 ? 'M' : 'L'} ${xOf(r.k)} ${yOf(r.p_envelope)}`).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <text x={padL} y={padT - 26} fill="#94a3b8" fontSize={11} fontWeight={700}>
        Per-decade local exponent p_dec of &sigma;(N), k=11..30 (imp-35036)
      </text>
      {[0.43, 0.45, 0.47, 0.49, D.farTailExponent].map((v) => (
        <g key={v}>
          <line x1={padL} y1={yOf(v)} x2={padL + plotW} y2={yOf(v)} stroke="#1e293b" strokeWidth={1} />
          <text x={padL - 6} y={yOf(v) + 3} textAnchor="end" fill="#64748b" fontSize={9}>
            {v}
          </text>
        </g>
      ))}
      <line
        x1={padL}
        y1={yOf(D.farTailExponent)}
        x2={padL + plotW}
        y2={yOf(D.farTailExponent)}
        stroke="#f87171"
        strokeWidth={1.25}
        strokeDasharray="4 3"
      />
      <text x={padL + plotW - 150} y={yOf(D.farTailExponent) - 4} fill="#f87171" fontSize={9}>
        imp-3463 asymptote: 1/2
      </text>
      <path d={envelopePath} fill="none" stroke="#facc15" strokeWidth={1.5} strokeDasharray="5 3" />
      <path d={measuredPath} fill="none" stroke="#a78bfa" strokeWidth={2.25} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke="#64748b" strokeWidth={1.5} />
      {[11, 14, 17, 20, 23, 26, 30].map((k) => (
        <text key={k} x={xOf(k)} y={padT + plotH + 16} textAnchor="middle" fill="#64748b" fontSize={9}>
          1e{k}
        </text>
      ))}
      <g>
        <circle cx={padL + 4} cy={padT - 10} r={3} fill="#a78bfa" />
        <text x={padL + 12} y={padT - 6} fill="#a78bfa" fontSize={8.5}>
          measured p_dec
        </text>
        <circle cx={padL + 4} cy={padT - 22} r={3} fill="#facc15" />
        <text x={padL + 12} y={padT - 18} fill="#facc15" fontSize={8.5}>
          1/(2 ln N) envelope
        </text>
      </g>
    </svg>
  );
}

// Residual gap g = 1/2 - p_dec on a log10 scale, showing the log-slow (not power-law) decay.
function ResidualGapChart() {
  const svgW = 680;
  const padL = 55;
  const padR = 20;
  const padT = 28;
  const padB = 40;
  const plotW = svgW - padL - padR;
  const plotH = 160;
  const svgH = padT + plotH + padB;

  const kMin = LADDER[0].k;
  const kMax = LADDER[LADDER.length - 1].k;
  const logGaps = LADDER.map((r) => Math.log10(r.residualGap));
  const yMin = Math.min(...logGaps) - 0.1;
  const yMax = Math.max(...logGaps) + 0.1;
  const xOf = (k) => padL + ((k - kMin) / (kMax - kMin)) * plotW;
  const yOf = (logGap) => padT + plotH - ((logGap - yMin) / (yMax - yMin)) * plotH;

  const path = LADDER.map((r, i) => `${i === 0 ? 'M' : 'L'} ${xOf(r.k)} ${yOf(Math.log10(r.residualGap))}`).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <text x={padL} y={padT - 10} fill="#94a3b8" fontSize={11} fontWeight={700}>
        Residual gap g = 1/2 - p_dec (log10 scale): shrinks in tiny, ever-slower steps
      </text>
      <path d={path} fill="none" stroke="#38bdf8" strokeWidth={2} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke="#64748b" strokeWidth={1.5} />
      {[11, 14, 17, 20, 23, 26, 30].map((k) => (
        <text key={k} x={xOf(k)} y={padT + plotH + 16} textAnchor="middle" fill="#64748b" fontSize={9}>
          1e{k}
        </text>
      ))}
    </svg>
  );
}

export default function Imp35183SigmaFartailExponentLadderViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Sigma(N) Far-Tail Exponent Ladder: The Log-Slow Approach to 1/2 (imp-35183 / imp-35036)" />

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-33582 stopped the per-decade local decay-exponent ladder of the conditional share
        &sigma;(N)&nbsp;=&nbsp;E_coll/E(N) at the decade [1e11,&nbsp;1e12], where p_dec&nbsp;&sim;&nbsp;0.4310,
        still ~0.069 short of the imp-3463 far-tail 1/2 asymptote. imp-35036 extended the same ladder to
        k&nbsp;=&nbsp;30 and found the residual gap g&nbsp;=&nbsp;1/2&nbsp;-&nbsp;p_dec decays only
        LOGARITHMICALLY, g&nbsp;&sim;&nbsp;1/(2&nbsp;ln&nbsp;N) (ratio&nbsp;&rarr;&nbsp;1 from above): the
        exponent first lands within 1e-3 of 1/2 only at N&nbsp;&sim;&nbsp;10<sup>219</sup>. This page renders
        the ladder against the imp-3463 asymptote with the 1/(2&nbsp;ln&nbsp;N) envelope overlaid, plus the
        residual gap itself on a log scale, for the first time.
      </p>

      <ExponentLadderChart />
      <div style={{ marginTop: '1.5rem' }}>
        <ResidualGapChart />
      </div>

      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '0.8rem',
          marginTop: '1.5rem',
        }}
      >
        <thead>
          <tr style={{ color: '#94a3b8', textAlign: 'left', borderBottom: '1px solid #334155' }}>
            <th style={{ padding: '0.4rem 0.6rem' }}>p_dec reaches</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>first decade</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderBottom: '1px solid #1e293b', color: '#cbd5e1' }}>
            <td style={{ padding: '0.4rem 0.6rem' }}>0.49</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
              {D.crossings.p_reaches_0_49_first_decade}
            </td>
          </tr>
          <tr style={{ borderBottom: '1px solid #1e293b', color: '#cbd5e1' }}>
            <td style={{ padding: '0.4rem 0.6rem' }}>0.495</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
              {D.crossings.p_reaches_0_495_first_decade}
            </td>
          </tr>
          <tr style={{ borderBottom: '1px solid #1e293b', color: '#cbd5e1' }}>
            <td style={{ padding: '0.4rem 0.6rem' }}>0.499 (within 1e-3 of 1/2)</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
              {D.crossings.p_reaches_0_499_first_decade}
            </td>
          </tr>
        </tbody>
      </table>

      <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginTop: '1rem' }}>
        The gap-to-envelope ratio g&nbsp;/&nbsp;[1/(2&nbsp;ln&nbsp;N)] falls from
        &asymp;{D.gapLaw.ratio_at_1e12.toFixed(2)} at [1e12,1e13] and plateaus at
        &asymp;{D.gapLaw.ratio_at_1e30.toFixed(3)} by the 1e20..1e30 decades, converging to 1 from above: the
        last approach to 1/2 halves only every time ln&nbsp;N doubles, i.e. every squaring of N.
      </p>

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
        <strong style={{ color: '#94a3b8' }}>Honest status:</strong> Viz-only page rendering the imp-35036
        per-decade exponent ladder literals verbatim (no new computation). Measurement on the inherited
        imp-3220/imp-3406 surrogate, NOT a rigorous asymptotic; C_mb GUE-conditional per imp-486 untouched;
        establishes no operator positivity; imp-3066 K_a&nbsp;&ge;&nbsp;0 untouched; changes no bound; no RH
        verdict, NO QED. Platt-Trudgian Lambda&nbsp;&le;&nbsp;0.2 remains SOTA.
      </div>
    </div>
  );
}
