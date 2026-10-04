import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  KBN_FLOOR_ANCHOR,
  HEADROOM_LADDER,
  C_FIT,
  HEADROOM_SLOPE_PER_DECADE,
  N_CROSS,
  N_CROSS_CONSERVATIVE,
} from '../data/imp-36287-kbn-floor-headroom-divergence-viz-data.js';
import { ED } from '../styles/tokens.js';

const POINTS = HEADROOM_LADDER.map((r) => ({ ...r, log10N: Math.log10(r.N) }));

function HeadroomDivergenceChart() {
  const svgW = 680;
  const svgH = 360;
  const padL = 60;
  const padR = 24;
  const padT = 24;
  const padB = 46;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const xs = POINTS.map((p) => p.log10N);
  const ys = POINTS.map((p) => p.headroomLog10);

  const xMin = Math.min(...xs) - 0.3;
  const xMax = Math.max(...xs) + 0.3;
  const yMin = 0;
  const yMax = Math.max(...ys) + 0.6;

  const px = (x) => padL + ((x - xMin) / (xMax - xMin)) * plotW;
  const py = (y) => padT + plotH - ((y - yMin) / (yMax - yMin)) * plotH;

  const pathD = POINTS.map((p, i) => {
    const x = px(p.log10N);
    const y = py(p.headroomLog10);
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  const anchorIdx = POINTS.findIndex((p) => p.source.startsWith('direct (T_PT'));

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line
        x1={padL}
        y1={padT + plotH}
        x2={padL + plotW}
        y2={padT + plotH}
        stroke={ED.rule}
        strokeWidth={1.5}
      />

      <path d={pathD} fill="none" stroke={ED.series1} strokeWidth={2} />
      {POINTS.map((p, i) => (
        <circle
          key={p.N}
          cx={px(p.log10N)}
          cy={py(p.headroomLog10)}
          r={i === anchorIdx ? 5.5 : 4}
          fill={i === anchorIdx ? ED.series7 : p.source === 'extrapolated' ? '#94a3b8' : ED.series1}
        />
      ))}

      {anchorIdx >= 0 && (
        <text
          x={px(POINTS[anchorIdx].log10N) + 8}
          y={py(POINTS[anchorIdx].headroomLog10) - 8}
          fill={ED.series7}
          fontSize={9}
        >
          T_PT anchor (imp-36083)
        </text>
      )}

      <text x={padL + plotW / 2} y={svgH - 8} textAnchor="middle" fill={ED.inkSoft} fontSize={9.5}>
        log&#8321;&#8320; N (retained terms)
      </text>
      <text
        x={14}
        y={padT + plotH / 2}
        textAnchor="middle"
        fill={ED.inkSoft}
        fontSize={9.5}
        transform={`rotate(-90 14 ${padT + plotH / 2})`}
      >
        log&#8321;&#8320; (certRung / KBN floor)
      </text>
    </svg>
  );
}

export default function Imp36287KbnFloorHeadroomDivergenceViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="KBN Floor vs Certified Run-Max Headroom Divergence (imp-36287 / imp-36135)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-36083 measured that the imp-36023 KBN-compensated summation floor stays N-flat at{' '}
        {KBN_FLOOR_ANCHOR.toExponential(2)} while the imp-35890 certified deterministic run-max rung
        rises with N. imp-36135 extended the rung two decades past the T_PT retained-term anchor
        (N &asymp; 488602), fit it to certRung(N) &sim; C&nbsp;&radic;N with C &asymp;{' '}
        {C_FIT.toExponential(1)}, and extrapolated to N = 1e15. The headroom (log&#8321;&#8320; of the
        ratio) widens strictly, at &asymp;{HEADROOM_SLOPE_PER_DECADE} orders per decade of N, and
        solving C&radic;N = floor for a crossing gives N_cross &asymp; {N_CROSS.toExponential(0)} &mdash;
        below one retained term, so the crossing is unphysical.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        log&#8321;&#8320; headroom (certified rung / KBN floor) vs log&#8321;&#8320; N across the
        imp-36083 / imp-36135 ladder
      </p>
      <HeadroomDivergenceChart />

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
            <th style={{ padding: '0.4rem 0.6rem' }}>N</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>certified rung</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>headroom (log&#8321;&#8320;)</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>source</th>
          </tr>
        </thead>
        <tbody>
          {POINTS.map((p) => (
            <tr key={p.N} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{p.N.toExponential(3)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
                {p.certRung.toExponential(2)}
              </td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
                {p.headroomLog10.toFixed(2)}
              </td>
              <td style={{ padding: '0.4rem 0.6rem' }}>{p.source}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p style={{ color: 'var(--ink-faint)', fontSize: '0.8rem', marginTop: '1rem' }}>
        The unphysical crossing holds under either floor choice: using the anchor floor{' '}
        {KBN_FLOOR_ANCHOR.toExponential(2)} gives N_cross &asymp; {N_CROSS.toExponential(0)}; even the
        most conservative (largest) ladder floor gives N_cross &asymp;{' '}
        {N_CROSS_CONSERVATIVE.toExponential(1)}. Both sit far below one retained term, so the flat KBN
        floor never rises to meet the growing certified rung at any physical N &mdash; the
        deterministic compensated channel is unconditionally non-binding.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> presentation only, baking the
        imp-36083 measured ladder and the imp-36135 extrapolation + crossing solve unchanged. N_cross
        &lt; 1 is an algebraic artifact of solving C&radic;N = floor, not a physical event; it certifies
        no W1 bound, instantiates no directed-rounding interval, evaluates no true H_0, verifies no
        inequality, changes no bound, establishes no positivity. C_mb GUE-conditional (imp-486)
        untouched; the W1 A + B - C certificate at T_PT stays GREENFIELD; no RH verdict, NO QED.
      </div>
    </div>
  );
}
