import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP33810_EFLOW_RESID_RATIO_N_LADDER } from '../data/imp-33810-eflow-resid-ratio-N-ladder.js';
import { ED } from '../styles/tokens.js';

const { ladder, ratioTrend } = IMP33810_EFLOW_RESID_RATIO_N_LADDER;
// The head/tail resid_over_eflow ratios come straight off the ladder's first/last rungs
// (k=6 -> ~2.1x, k=11 -> ~1927x). (An earlier revision destructured imp33773_M2_* keys that
// ratioTrend no longer carries, which rendered these undefined and crashed the page on .toFixed.)
const HEAD_ROE = ladder[0].resid_over_eflow;
const TAIL_ROE = ladder[ladder.length - 1].resid_over_eflow;
const SAME_SIGN = ratioTrend.same_sign_positive;

function EflowResidRatioChart() {
  const svgW = 720;
  const padL = 48;
  const padR = 32;
  const padT = 20;
  const padB = 40;
  const svgH = 300;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const kMin = 6;
  const kMax = 11;
  const xS = (k) => padL + ((k - kMin) / (kMax - kMin)) * cW;

  // log10 scale on y: ratio ranges from ~5.2e-4 (tail) to ~0.47 (head), unity=1 sits above all points.
  const logMin = -3.4;
  const logMax = 0.15;
  const yS = (ratio) => padT + cH - ((Math.log10(ratio) - logMin) / (logMax - logMin)) * cH;

  const yTicks = [1, 0.1, 0.01, 0.001];
  const xTicks = [6, 7, 8, 9, 10, 11];

  const points = ladder.map((r) => `${xS(r.k)},${yS(r.eflow_over_resid)}`).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />

      {yTicks.map((t) => (
        <g key={'yt' + t}>
          <line x1={padL - 4} y1={yS(t)} x2={padL + cW} y2={yS(t)} stroke={ED.ruleSoft} strokeWidth={1} />
          <text x={padL - 8} y={yS(t) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {t}
          </text>
        </g>
      ))}

      {/* unity reference line -- ratio never reaches it */}
      <line
        x1={padL}
        y1={yS(1)}
        x2={padL + cW}
        y2={yS(1)}
        stroke={ED.series2}
        strokeWidth={1.25}
        strokeDasharray="5,3"
      />
      <text x={padL + cW - 4} y={yS(1) - 5} textAnchor="end" fill={ED.series2} fontSize={9}>
        unity (eflow = resid)
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
        N (window upper endpoint, log scale)
      </text>
      <text
        x={14}
        y={padT + cH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={10}
        transform={`rotate(-90 14 ${padT + cH / 2})`}
      >
        eflow_attr / resid_exp (log scale)
      </text>

      <polyline points={points} fill="none" stroke={ED.series5} strokeWidth={1.75} />
      {ladder.map((r) => (
        <circle
          key={'pt' + r.k}
          cx={xS(r.k)}
          cy={yS(r.eflow_over_resid)}
          r={2.75}
          fill="#c4b5fd"
          stroke={ED.paper}
          strokeWidth={0.75}
        />
      ))}
    </svg>
  );
}

export default function Imp33831EflowResidRatioLadderViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="E_flow / Offset-Residual Ratio Ladder (imp-33810 / imp-33831)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-33810 tracked the E_flow-term / offset-residual ratio across a quarter-decade sliding
        window ladder, k = 6.00 .. 11.00 (21 rungs), to lock the imp-33773 M2 refutation as a
        robust trend rather than a single tail number. This page is the first consumer of that
        module: eflow_attr/resid_exp plotted against the window upper endpoint N, with the unity
        reference line showing that the ratio never reaches 1 -- the separation only widens as N
        grows, from &sim;0.4687 at the head (k=6) down to &sim;5.19e-4 in the tail (k=11).
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        eflow_attr / resid_exp vs N, 21 quarter-decade rungs, log-log axes
      </p>
      <EflowResidRatioChart />

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
            <th style={{ padding: '0.4rem 0.6rem' }}>k</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>resid_exp</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>eflow_attr</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>eflow / resid</th>
          </tr>
        </thead>
        <tbody>
          {ladder.map((r) => (
            <tr key={r.k} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.k.toFixed(2)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.resid_exp}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.eflow_attr}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace', color: 'var(--series-5)' }}>
                {r.eflow_over_resid}
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> measurement/attribution only
        -- imp-33810 changes no value and derives nothing new, and this page adds no new
        derivation either. It gives the 21-rung ratio ladder a visual surface: the ratio is
        strictly below unity at every rung ({ratioTrend.all_below_unity ? 'confirmed' : 'not confirmed'})
        and strictly monotone-decreasing in N. E_flow is a strictly-shrinking <strong>positive</strong>{' '}
        fraction of the offset residual throughout -- resid_exp and eflow_attr share the same sign
        at all 21 rungs ({SAME_SIGN ? 'confirmed, no sign flip' : 'not confirmed'}), so this is a
        magnitude separation, not a sign coincidence. That separation itself widens monotonically
        from only &sim;{HEAD_ROE.toFixed(1)}x at the head (k=6) to &sim;{TAIL_ROE.toFixed(1)}x in
        the tail (k=11) -- the imp-33773 M2 "~1900x" figure is the tail endpoint of this trend, not
        a uniform order-of-magnitude gap. No bound changes; establishes no operator
        positivity; imp-3066 K_a &ge; 0 remains untouched. No RH verdict, NO QED.
      </div>

      <div
        style={{
          marginTop: '0.75rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--ink-soft) 4%, transparent)',
          borderLeft: '3px solid var(--rule)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-faint)',
        }}
      >
        <strong style={{ color: 'var(--ink-soft)' }}>Precision note (imp-33956):</strong> the head/tail
        figures above ({HEAD_ROE.toFixed(1)}x and {TAIL_ROE.toFixed(1)}x) are toFixed(1) displays,
        not exact ratios -- the head value is really 2.1334x (a ~1.57% rounding understatement, the
        largest reporting error anywhere in this ladder), while the tail value is accurate to
        ~1e-6. See imp-33884 and imp-33926 for the full-precision recompute and cohort-wide audit.
      </div>
    </div>
  );
}
