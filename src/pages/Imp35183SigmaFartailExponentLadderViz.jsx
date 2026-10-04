import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import { IMP35183_SIGMA_FARTAIL_EXPONENT_LADDER_VIZ_DATA } from '../data/imp-35183-sigma-fartail-exponent-ladder-viz-data.js';
import { ED } from '../styles/tokens.js';

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
      <text x={padL} y={padT - 26} fill={ED.inkSoft} fontSize={11} fontWeight={700}>
        Per-decade local exponent p_dec of &sigma;(N), k=11..30 (imp-35036)
      </text>
      {[0.43, 0.45, 0.47, 0.49, D.farTailExponent].map((v) => (
        <g key={v}>
          <line x1={padL} y1={yOf(v)} x2={padL + plotW} y2={yOf(v)} stroke={ED.ruleSoft} strokeWidth={1} />
          <text x={padL - 6} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {v}
          </text>
        </g>
      ))}
      <line
        x1={padL}
        y1={yOf(D.farTailExponent)}
        x2={padL + plotW}
        y2={yOf(D.farTailExponent)}
        stroke={ED.series2}
        strokeWidth={1.25}
        strokeDasharray="4 3"
      />
      <text x={padL + plotW - 150} y={yOf(D.farTailExponent) - 4} fill={ED.series2} fontSize={9}>
        imp-3463 asymptote: 1/2
      </text>
      <path d={envelopePath} fill="none" stroke={ED.brassDeco} strokeWidth={1.5} strokeDasharray="5 3" />
      <path d={measuredPath} fill="none" stroke={ED.series5} strokeWidth={2.25} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      {[11, 14, 17, 20, 23, 26, 30].map((k) => (
        <text key={k} x={xOf(k)} y={padT + plotH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
          1e{k}
        </text>
      ))}
      <g>
        <circle cx={padL + 4} cy={padT - 10} r={3} fill={ED.series5} />
        <text x={padL + 12} y={padT - 6} fill={ED.series5} fontSize={8.5}>
          measured p_dec
        </text>
        <circle cx={padL + 4} cy={padT - 22} r={3} fill={ED.brassDeco} />
        <text x={padL + 12} y={padT - 18} fill={ED.brass} fontSize={8.5}>
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
      <text x={padL} y={padT - 10} fill={ED.inkSoft} fontSize={11} fontWeight={700}>
        Residual gap g = 1/2 - p_dec (log10 scale): shrinks in tiny, ever-slower steps
      </text>
      <path d={path} fill="none" stroke={ED.series1} strokeWidth={2} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      {[11, 14, 17, 20, 23, 26, 30].map((k) => (
        <text key={k} x={xOf(k)} y={padT + plotH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
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
      <p className="ed-lbl">Related: <Link to="/viz-imp97427-sigma-fartail-exponent-ladder">later run (imp-97427)</Link></p>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
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
          <tr style={{ color: 'var(--ink-soft)', textAlign: 'left', borderBottom: '1px solid var(--rule)' }}>
            <th style={{ padding: '0.4rem 0.6rem' }}>p_dec reaches</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>first decade</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
            <td style={{ padding: '0.4rem 0.6rem' }}>0.49</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
              {D.crossings.p_reaches_0_49_first_decade}
            </td>
          </tr>
          <tr style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
            <td style={{ padding: '0.4rem 0.6rem' }}>0.495</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
              {D.crossings.p_reaches_0_495_first_decade}
            </td>
          </tr>
          <tr style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
            <td style={{ padding: '0.4rem 0.6rem' }}>0.499 (within 1e-3 of 1/2)</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
              {D.crossings.p_reaches_0_499_first_decade}
            </td>
          </tr>
        </tbody>
      </table>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.8rem', marginTop: '1rem' }}>
        The gap-to-envelope ratio g&nbsp;/&nbsp;[1/(2&nbsp;ln&nbsp;N)] falls from
        &asymp;{D.gapLaw.ratio_at_1e12.toFixed(2)} at [1e12,1e13] and plateaus at
        &asymp;{D.gapLaw.ratio_at_1e30.toFixed(3)} by the 1e20..1e30 decades, converging to 1 from above: the
        last approach to 1/2 halves only every time ln&nbsp;N doubles, i.e. every squaring of N.
      </p>

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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> Viz-only page rendering the imp-35036
        per-decade exponent ladder literals verbatim (no new computation). Measurement on the inherited
        imp-3220/imp-3406 surrogate, NOT a rigorous asymptotic; C_mb GUE-conditional per imp-486 untouched;
        establishes no operator positivity; imp-3066 K_a&nbsp;&ge;&nbsp;0 untouched; changes no bound; no RH
        verdict, NO QED.
      </div>
    </div>
  );
}
