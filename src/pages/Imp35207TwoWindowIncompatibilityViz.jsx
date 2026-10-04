import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP35168_MESOSCOPIC_I3_LIPSCHITZ_WINDOW_ASSESSMENT } from '../data/imp-35168-mesoscopic-i3-lipschitz-window-assessment.js';
import { ED } from '../styles/tokens.js';

const D = IMP35168_MESOSCOPIC_I3_LIPSCHITZ_WINDOW_ASSESSMENT;
const ROWS = D.rows;
// y_prop_min is N-independent; recover it from any row's exported y_acc_min /
// height_gap_factor ratio (both already computed by the imp-35168 module).
const Y_PROP_MIN = ROWS[0].y_acc_min / ROWS[0].height_gap_factor;

// log-log chart of the propagation-safe height y_prop (flat, N-independent) against the
// accumulation-safe height y_acc ~ sqrt(N) (imp-35168), showing the sqrt(N) divergence that
// means no fixed mesoscopic strip height can serve both windows once N grows past the
// coincidence point N=2.
function TwoWindowChart() {
  const svgW = 680;
  const padL = 58;
  const padR = 20;
  const padT = 54;
  const padB = 40;
  const plotW = svgW - padL - padR;
  const plotH = 260;
  const svgH = padT + plotH + padB;

  const nMin = ROWS[0].N;
  const nMax = ROWS[ROWS.length - 1].N;
  const xMin = Math.log10(nMin);
  const xMax = Math.log10(nMax);
  const yMin = Math.log10(Y_PROP_MIN * 0.7);
  const yMax = Math.log10(ROWS[ROWS.length - 1].y_acc_min * 1.3);
  const xOf = (N) => padL + ((Math.log10(N) - xMin) / (xMax - xMin)) * plotW;
  const yOf = (v) => padT + plotH - ((Math.log10(v) - yMin) / (yMax - yMin)) * plotH;

  const yAccPath = ROWS.map((r, i) => `${i === 0 ? 'M' : 'L'} ${xOf(r.N)} ${yOf(r.y_acc_min)}`).join(' ');
  const yPropY = yOf(Y_PROP_MIN);

  const yTicks = [1, 10, 100, 1000];
  const xTicks = ROWS.map((r) => r.N);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <text x={padL} y={padT - 38} fill={ED.inkSoft} fontSize={11} fontWeight={700}>
        Propagation-safe y_prop vs. accumulation-safe y_acc ~ sqrt(N), log-log (imp-35168)
      </text>
      {yTicks.map((v) => (
        <g key={v}>
          <line x1={padL} y1={yOf(v)} x2={padL + plotW} y2={yOf(v)} stroke={ED.ruleSoft} strokeWidth={1} />
          <text x={padL - 6} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {v}
          </text>
        </g>
      ))}
      {/* coincidence marker: N=2, the only point where the two windows meet */}
      <line
        x1={xOf(D.windows.coincidenceN)}
        y1={padT}
        x2={xOf(D.windows.coincidenceN)}
        y2={padT + plotH}
        stroke={ED.series2}
        strokeWidth={1.25}
        strokeDasharray="2 3"
      />
      <text x={xOf(D.windows.coincidenceN) + 4} y={padT + 10} fill={ED.series2} fontSize={8.5}>
        N={D.windows.coincidenceN} (windows coincide)
      </text>
      <line x1={padL} y1={yPropY} x2={padL + plotW} y2={yPropY} stroke={ED.brassDeco} strokeWidth={2} strokeDasharray="6 3" />
      <path d={yAccPath} fill="none" stroke={ED.series5} strokeWidth={2.25} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      {xTicks.map((N) => (
        <text key={N} x={xOf(N)} y={padT + plotH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
          N={N}
        </text>
      ))}
      <g>
        <circle cx={padL + 4} cy={padT - 10} r={3} fill={ED.series5} />
        <text x={padL + 12} y={padT - 6} fill={ED.series5} fontSize={8.5}>
          y_acc_min = sqrt(2 N S / E_acc)
        </text>
        <circle cx={padL + 220} cy={padT - 10} r={3} fill={ED.brassDeco} />
        <text x={padL + 228} y={padT - 6} fill={ED.brass} fontSize={8.5}>
          y_prop_min = sqrt(2 S / E_vac) &asymp; {Y_PROP_MIN.toFixed(4)}
        </text>
      </g>
    </svg>
  );
}

export default function Imp35207TwoWindowIncompatibilityViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Two-Window Incompatibility: y_prop vs. y_acc ~ sqrt(N) (imp-35207 / imp-35168)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-35168 found that a mesoscopic strip carries two DIFFERENT constants that scale
        differently in N: the propagation coefficient L_prop&nbsp;=&nbsp;2/y_star^2 (O(1),
        N-uniform) that the imp-2520 Gronwall transport lemma needs, and the field Lipschitz
        L_field&nbsp;=&nbsp;2N/y_star^2 (N-linear) that the imp-35127 I3 step-to-global
        accumulation actually needs. Keeping each e-fold below threshold forces a minimum strip
        height for each: y_prop_min is N-independent, while y_acc_min&nbsp;=&nbsp;sqrt(2NS/E_acc)
        grows like sqrt(N). This page plots both minimum heights against N.
      </p>

      <TwoWindowChart />

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
            <th style={{ padding: '0.4rem 0.6rem' }}>N</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>L_prop</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>L_field</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>y_acc_min</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>y_acc_min / y_prop_min</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>acc N-uniform?</th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map((r) => (
            <tr key={r.N} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.N}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.L_prop}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.L_field}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.y_acc_min}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.height_gap_factor}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.acc_n_uniform ? 'yes' : 'no'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.8rem', marginTop: '1rem' }}>
        The two windows coincide only at N&nbsp;=&nbsp;{D.windows.coincidenceN} (where
        L_field&nbsp;=&nbsp;L_prop). Past that point the height gap
        y_acc_min/y_prop_min&nbsp;=&nbsp;sqrt(N) diverges: at N&nbsp;=&nbsp;
        {ROWS[ROWS.length - 1].N} the accumulation-safe height must exceed the
        propagation-safe height by a factor of&nbsp;
        {ROWS[ROWS.length - 1].height_gap_factor}&times;. A fixed mesoscopic y_star (e.g. the
        imp-2520 working height y_star&nbsp;&asymp;&nbsp;{D.yStarMesoscopic}) that is
        propagation-safe at every N is accumulation-safe only up to a bounded N, never
        N-uniformly.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> Viz-only page rendering the
        imp-35168 rows and derived y_prop_min literal verbatim (no new computation beyond
        recovering the N-independent y_prop_min from already-exported per-row values). Confirms
        the imp-35168 verdict that no fixed mesoscopic strip serves both the propagation lemma
        and the I3 accumulation constant; I3 stays OPEN; assessment only; establishes no operator
        positivity; changes no bound; C_mb GUE-conditional per imp-486 untouched; no RH verdict,
        NO QED.
      </div>
    </div>
  );
}
