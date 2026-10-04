import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import { IMP35026_SIGMA_DECAY_LANDMARK_LADDER_VIZ_DATA } from '../data/imp-35026-sigma-decay-landmark-ladder-viz-data.js';
import { ED } from '../styles/tokens.js';

const D = IMP35026_SIGMA_DECAY_LANDMARK_LADDER_VIZ_DATA;
const GRID = D.grid;
const LADDER = D.perDecadeLadder;

const LANDMARKS = [
  { log10N: Math.log10(D.thresholdCrossings.sigma_below_0_9_at_N), label: 'σ=0.9 (N~2.57e7)', color: ED.series3 },
  { log10N: Math.log10(D.thresholdCrossings.sigma_below_0_5_at_N), label: 'σ=1/2 halving (N~3.27e9)', color: ED.series1 },
  { log10N: D.inflection.log10Nstar, label: 'imp-33721 knee N* (N~3.38e9)', color: ED.series7 },
  { log10N: Math.log10(D.thresholdCrossings.sigma_below_0_1_at_N), label: 'σ=0.1 (N~3.21e11)', color: ED.brass },
];

// sigma(N) on a log10(N) x-axis with the three threshold-crossing landmarks and the
// imp-33721 inflection knee marked as vertical guides.
function SigmaDecayChart() {
  const svgW = 680;
  const padL = 44;
  const padR = 20;
  const padT = 44;
  const padB = 40;
  const plotW = svgW - padL - padR;
  const plotH = 240;
  const svgH = padT + plotH + padB;

  const xMin = GRID[0].log10N;
  const xMax = GRID[GRID.length - 1].log10N;
  const xOf = (log10N) => padL + ((log10N - xMin) / (xMax - xMin)) * plotW;
  const yOf = (sigma) => padT + plotH - sigma * plotH;

  const path = GRID.map((r, i) => `${i === 0 ? 'M' : 'L'} ${xOf(r.log10N)} ${yOf(r.sigma)}`).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <text x={padL} y={padT - 26} fill={ED.inkSoft} fontSize={11} fontWeight={700}>
        E(N)-bridge conditional share &sigma;(N), N in [1e6, 1e12] (imp-33582)
      </text>
      {[0, 0.1, 0.25, 0.5, 0.75, 0.9, 1].map((v) => (
        <g key={v}>
          <line x1={padL} y1={yOf(v)} x2={padL + plotW} y2={yOf(v)} stroke={ED.ruleSoft} strokeWidth={1} />
          <text x={padL - 6} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {v}
          </text>
        </g>
      ))}
      {LANDMARKS.map((m) => (
        <g key={m.label}>
          <line
            x1={xOf(m.log10N)}
            y1={padT}
            x2={xOf(m.log10N)}
            y2={padT + plotH}
            stroke={m.color}
            strokeWidth={1.25}
            strokeDasharray="4 3"
          />
        </g>
      ))}
      <path d={path} fill="none" stroke={ED.series5} strokeWidth={2.25} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      {[6, 7, 8, 9, 10, 11, 12].map((d) => (
        <text key={d} x={xOf(d)} y={padT + plotH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
          1e{d}
        </text>
      ))}
      {LANDMARKS.map((m, i) => (
        <g key={`legend-${m.label}`}>
          <circle cx={padL + 4} cy={padT - 12 - i * 12} r={3} fill={m.color} />
          <text x={padL + 12} y={padT - 8 - i * 12} fill={m.color} fontSize={8.5}>
            {m.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

// Per-decade local decay exponent step chart, ramping toward the imp-3463 far-tail 1/2.
function ExponentRampChart() {
  const svgW = 680;
  const padL = 44;
  const padR = 20;
  const padT = 28;
  const padB = 40;
  const plotW = svgW - padL - padR;
  const plotH = 140;
  const svgH = padT + plotH + padB;

  const xMin = 6;
  const xMax = 12;
  const yMax = 0.55;
  const xOf = (log10N) => padL + ((log10N - xMin) / (xMax - xMin)) * plotW;
  const yOf = (p) => padT + plotH - (p / yMax) * plotH;

  const decadeLo = (r) => parseFloat(r.decade.split('->')[0].replace('1e', ''));
  const decadeHi = (r) => parseFloat(r.decade.split('->')[1].replace('1e', ''));

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <text x={padL} y={padT - 10} fill={ED.inkSoft} fontSize={11} fontWeight={700}>
        Local decay exponent d ln &sigma; / d ln N per decade, ramping toward the imp-3463 far-tail 1/2
      </text>
      <line
        x1={padL}
        y1={yOf(0.5)}
        x2={padL + plotW}
        y2={yOf(0.5)}
        stroke={ED.series2}
        strokeWidth={1.25}
        strokeDasharray="4 3"
      />
      <text x={padL + plotW - 110} y={yOf(0.5) - 4} fill={ED.series2} fontSize={9}>
        far-tail asymptote 1/2
      </text>
      {LADDER.map((r) => (
        <rect
          key={r.decade}
          x={xOf(decadeLo(r))}
          y={yOf(r.p_local)}
          width={xOf(decadeHi(r)) - xOf(decadeLo(r))}
          height={padT + plotH - yOf(r.p_local)}
          fill={ED.series5}
          fillOpacity={0.55}
          stroke={ED.series5}
          strokeWidth={1}
        />
      ))}
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      {[6, 7, 8, 9, 10, 11, 12].map((d) => (
        <text key={d} x={xOf(d)} y={padT + plotH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
          1e{d}
        </text>
      ))}
    </svg>
  );
}

export default function Imp35026SigmaDecayLandmarkLadderViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Sigma(N) Decay Landmark Ladder (imp-35026 / imp-33582 / imp-33721)" />
      <p className="ed-lbl">Related: <Link to="/viz-imp33830-sigma-decay-landmark-ladder">earlier run (imp-33830)</Link></p>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-33582 quantified the post-peak decay of the E(N)-bridge conditional share
        &sigma;(N) = E_coll/E(N): it holds above 0.9 until N&nbsp;&sim;&nbsp;2.57e7, halves at
        N&nbsp;&sim;&nbsp;3.27e9 (matching the imp-3444/imp-33723 E_coll&nbsp;=&nbsp;E_trunc crossover),
        and drops below 0.1 at N&nbsp;&sim;&nbsp;3.21e11. imp-33721 separately located the sub-decade
        ramp-inflection knee at N*&nbsp;&sim;&nbsp;3.38e9, a few percent from the halving landmark. This
        page renders the &sigma;(N) curve, all three threshold crossings, and the knee together for the
        first time.
      </p>

      <SigmaDecayChart />
      <div style={{ marginTop: '1.5rem' }}>
        <ExponentRampChart />
      </div>

      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '0.78rem',
          marginTop: '1.5rem',
        }}
      >
        <thead>
          <tr style={{ color: 'var(--ink-soft)', textAlign: 'left', borderBottom: '1px solid var(--rule)' }}>
            <th style={{ padding: '0.4rem 0.5rem' }}>decade</th>
            <th style={{ padding: '0.4rem 0.5rem' }}>p_local</th>
            <th style={{ padding: '0.4rem 0.5rem' }}>&sigma; at decade lo</th>
            <th style={{ padding: '0.4rem 0.5rem' }}>&sigma; at decade hi</th>
          </tr>
        </thead>
        <tbody>
          {LADDER.map((r) => (
            <tr key={r.decade} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
              <td style={{ padding: '0.4rem 0.5rem', fontFamily: 'monospace' }}>{r.decade}</td>
              <td style={{ padding: '0.4rem 0.5rem', fontFamily: 'monospace' }}>{r.p_local}</td>
              <td style={{ padding: '0.4rem 0.5rem', fontFamily: 'monospace' }}>{r.sigmaLo}</td>
              <td style={{ padding: '0.4rem 0.5rem', fontFamily: 'monospace' }}>{r.sigmaHi}</td>
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> Viz-only page rendering the
        imp-33582/imp-33721 landmark literals verbatim via the shared sigma-n-subterms.js helper (no new
        computation). Measurement on the inherited imp-3220/imp-3406 surrogate, NOT a rigorous asymptotic;
        C_mb GUE-conditional per imp-486 untouched; establishes no operator positivity; imp-3066
        K_a&nbsp;&ge;&nbsp;0 untouched; changes no bound; no RH verdict, NO QED.
      </div>

      <div style={{ marginTop: '1rem', fontSize: '0.85rem', color: 'var(--ink-faint)' }}>
        <strong>Related:</strong>{' '}
        <Link to="/viz-imp33549-sigma-fartail-vs-interior-max" style={{ color: 'var(--series-5)' }}>
          Sigma(N) Far-Tail Law vs Interior-Max Reconciliation (imp-33549): the pre-peak rise and
          the U-shape interior maximum (N~9.22e5) that precedes the post-peak landmarks above
        </Link>
      </div>
    </div>
  );
}
