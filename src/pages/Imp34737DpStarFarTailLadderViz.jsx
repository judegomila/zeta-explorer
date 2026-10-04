import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP34711_Q3_TRUST_BOUNDARY_FAR_TAIL_EXTENSION } from '../data/imp-34711-q3-trust-boundary-far-tail-extension.js';
import { ED } from '../styles/tokens.js';

const M = IMP34711_Q3_TRUST_BOUNDARY_FAR_TAIL_EXTENSION;

// -- log-log ladder: log10(dp*) vs log10(p), p = log N. A pure power law dp* ~ p^(4/3) is a straight
// line of slope 4/3 in this space, so the closed-form overlay is drawn as the exact two-point segment
// y = log10(ASYMP_PREF) + (4/3) log10(p) -- no curve-fitting, just the imp-34711 literal reproduced. --
function DpStarLadderChart() {
  const points = [
    { N: M.reference_foot.N, dp_star: M.reference_foot.dp_star },
    ...M.far_tail_table.map((r) => ({ N: r.N, dp_star: r.dp_star })),
    { N: 1e100, dp_star: M.dp_star_at_1e100_sentinel },
  ];

  const pOf = (N) => Math.log(N); // p = log N
  const xOf = (N) => Math.log10(pOf(N));
  const yOf = (dp) => Math.log10(dp);

  const xs = points.map((pt) => xOf(pt.N));
  const ys = points.map((pt) => yOf(pt.dp_star));
  const xMin = Math.min(...xs);
  const xMax = Math.max(...xs);
  const yMin = Math.min(...ys);
  const yMax = Math.max(...ys);

  const svgW = 680;
  const svgH = 320;
  const padL = 64;
  const padR = 24;
  const padT = 20;
  const padB = 44;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const sx = (x) => padL + ((x - xMin) / (xMax - xMin)) * plotW;
  const sy = (y) => padT + plotH - ((y - yMin) / (yMax - yMin)) * plotH;

  const asympPref = M.asymp_prefactor_Wmax_eps_over_480_cbrt;
  const closedFormY = (x) => Math.log10(asympPref) + (4 / 3) * x; // x = log10(p)
  const closedX1 = xMin;
  const closedX2 = xMax;
  const closedY1 = closedFormY(closedX1);
  const closedY2 = closedFormY(closedX2);

  const pathD = points
    .map((pt, i) => `${i === 0 ? 'M' : 'L'} ${sx(xOf(pt.N)).toFixed(2)} ${sy(yOf(pt.dp_star)).toFixed(2)}`)
    .join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={plotW} height={plotH} fill="none" stroke={ED.rule} strokeWidth={1} />
      <text x={padL + plotW / 2} y={svgH - 6} textAnchor="middle" fill={ED.inkSoft} fontSize={11}>
        log10(p), p = log N
      </text>
      <text
        x={16}
        y={padT + plotH / 2}
        textAnchor="middle"
        fill={ED.inkSoft}
        fontSize={11}
        transform={`rotate(-90 16 ${padT + plotH / 2})`}
      >
        log10(dp*)
      </text>

      {/* closed-form overlay: exact (4/3)-slope segment through the asymptotic prefactor */}
      <line
        x1={sx(closedX1)}
        y1={sy(closedY1)}
        x2={sx(closedX2)}
        y2={sy(closedY2)}
        stroke={ED.series1}
        strokeWidth={2}
        strokeDasharray="6 4"
      />

      {/* measured ladder */}
      <path d={pathD} fill="none" stroke={ED.series2} strokeWidth={1.5} />
      {points.map((pt) => (
        <circle
          key={pt.N}
          cx={sx(xOf(pt.N))}
          cy={sy(yOf(pt.dp_star))}
          r={3.5}
          fill={ED.series2}
          stroke={ED.paper}
          strokeWidth={0.5}
        />
      ))}

      <text x={padL + 8} y={padT + 16} fill={ED.series2} fontSize={11}>
        measured dp*(N), N = 1e13..1e100
      </text>
      <text x={padL + 8} y={padT + 32} fill={ED.series1} fontSize={11}>
        closed form: (W_max*eps/480)^(1/3) (log N)^(4/3), slope 4/3
      </text>
    </svg>
  );
}

// -- deceleration bar: per-two-decade fractional rise, first far-tail window vs last --
function RiseDecelerationBars() {
  const svgW = 660;
  const svgH = 110;
  const padL = 200;
  const padR = 40;
  const barH = 26;
  const gap = 18;
  const scaleMax = 25; // percent, axis ceiling

  const rows = [
    { label: '1e13 -> 1e15 (first window)', pct: M.rise_pct_first_window, color: ED.series2 },
    { label: '1e27 -> 1e29 (last window)', pct: M.rise_pct_last_window, color: ED.series1 },
  ];

  const cW = svgW - padL - padR;
  const xOf = (pct) => (pct / scaleMax) * cW;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {rows.map((r, i) => {
        const y = 8 + i * (barH + gap);
        return (
          <g key={r.label}>
            <text x={padL - 10} y={y + barH / 2 + 4} textAnchor="end" fill={ED.inkSoft} fontSize={11}>
              {r.label}
            </text>
            <rect x={padL} y={y} width={cW} height={barH} fill="none" stroke={ED.rule} strokeWidth={1} />
            <rect x={padL} y={y} width={Math.max(xOf(r.pct), 2)} height={barH} fill={r.color} />
            <text x={padL + xOf(r.pct) + 8} y={y + barH / 2 + 4} fill={r.color} fontSize={11} fontWeight={700}>
              {r.pct}%
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default function Imp34737DpStarFarTailLadderViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="dp* Far-Tail Ladder, N = 1e13..1e100 (imp-34737 / imp-34711)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-34711 extended the smallest-usable q-derivative step dp*(N) = (W_max&middot;eps&middot;|q| /
        (240&middot;|q3|))^(1/3) past N&nbsp;=&nbsp;1e15 to a 1e100 sentinel and found it keeps rising
        with no saturation and no turnover (F1), while the fractional per-two-decade rise decelerates
        like 1/log&nbsp;N (F2). Plotted in log10(p)-log10(dp*) space (p = log N), a pure power law is a
        straight line: the measured ladder tracks the closed form dp*&nbsp;~&nbsp;(W_max&middot;eps/480)^(1/3)&nbsp;(log&nbsp;N)^(4/3)
        (slope 4/3) to within {M.asymp_max_rel_err_1e15_to_1e100} relative error over 1e15..1e100 (F3).
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        dp*(N) ladder vs the (log N)^(4/3) closed-form overlay
      </p>
      <DpStarLadderChart />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
        Fractional rise decelerates like 1/log N
      </p>
      <RiseDecelerationBars />

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
            <th style={{ padding: '0.4rem 0.6rem' }}>dp*(N)</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>rise / two decades</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{M.reference_foot.N.toExponential(0)}</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{M.reference_foot.dp_star}</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>&mdash;</td>
          </tr>
          {M.far_tail_table.map((r) => (
            <tr key={r.N} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.N.toExponential(0)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.dp_star}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.rise_pct_per_two_decades}%</td>
            </tr>
          ))}
          <tr style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>1e+100 (sentinel)</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{M.dp_star_at_1e100_sentinel}</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>&mdash;</td>
          </tr>
        </tbody>
      </table>

      <div
        style={{
          marginTop: '1rem',
          padding: '0.6rem 1rem',
          background: 'color-mix(in srgb, var(--ink-soft) 4%, transparent)',
          borderLeft: '3px solid var(--rule)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-soft)',
        }}
      >
        dp*(N) rises without bound (~{M.dp_star_at_1e29} at 1e29, ~{M.dp_star_at_1e100_sentinel} at
        1e100) while the per-two-decade fractional rise decelerates from ~{M.rise_pct_first_window}% to
        ~{M.rise_pct_last_window}% (predicted ~{M.rise_pct_last_predicted_from_slope}% from the (4/3)/p
        log-slope), because q(p)/p &rarr; {M.q_over_p_deep_1e60} and q3(p)&middot;p&sup3; &rarr;{' '}
        {M.q3_times_p3_deep_1e60} deep in the tail.
      </div>

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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> Viz-only page presenting the
        imp-34711 far-tail ladder (imported literals, no new computation); establishes no new numerical
        claim. q1..q3 are inherited central differences on the imp-3220/imp-3406 component model, not
        fresh closed forms, so the ladder is a property of that inherited model, not an independent
        physical claim. C_C = (1/8)&radic;(3&pi;) (imp-2714) and C_mb GUE-conditional per imp-486
        untouched; imp-3066 K_a&nbsp;&ge;&nbsp;0 untouched; changes no bound; establishes no operator
        positivity; no RH verdict, NO QED.
      </div>
    </div>
  );
}
