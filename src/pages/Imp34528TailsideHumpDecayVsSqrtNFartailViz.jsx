import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP34528_TAILSIDE_HUMP_DECAY_VS_SQRT_N_FARTAIL } from '../data/imp-34528-tailside-hump-decay-vs-sqrt-n-fartail.js';
import { ED } from '../styles/tokens.js';

const {
  tailLadder,
  sqrt10PerDecadeRate,
  crossoverDecadeK,
  humpPeak,
} = IMP34528_TAILSIDE_HUMP_DECAY_VS_SQRT_N_FARTAIL;

function OvershootChart() {
  const svgW = 720;
  const padL = 48;
  const padR = 32;
  const padT = 20;
  const padB = 36;
  const svgH = 260;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const n = tailLadder.length;
  const groupW = cW / n;
  const barW = groupW * 0.32;

  const yMax = Math.max(...tailLadder.map((r) => r.measFrac)) * 1.1;
  const yS = (frac) => padT + cH - (frac / yMax) * cH;

  const yTicks = [0, 0.2, 0.4, 0.6, 0.8].filter((t) => t <= yMax);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />

      {yTicks.map((t) => (
        <g key={'yt' + t}>
          <line x1={padL - 4} y1={yS(t)} x2={padL + cW} y2={yS(t)} stroke={ED.ruleSoft} strokeWidth={1} />
          <text x={padL - 8} y={yS(t) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {t.toFixed(2)}
          </text>
        </g>
      ))}

      {tailLadder.map((r, i) => {
        const cx = padL + groupW * (i + 0.5);
        const measX = cx - barW - 3;
        const lawX = cx + 3;
        return (
          <g key={'j' + r.offset}>
            <rect x={measX} y={yS(r.measFrac)} width={barW} height={cH - (yS(r.measFrac) - padT)} fill={ED.series1} />
            <rect x={lawX} y={yS(r.lawFrac)} width={barW} height={cH - (yS(r.lawFrac) - padT)} fill={ED.series2} />
            <text x={measX + barW / 2} y={yS(r.measFrac) - 6} textAnchor="middle" fill={ED.series1} fontSize={8.5}>
              {r.measFrac.toFixed(3)}
            </text>
            <text x={lawX + barW / 2} y={yS(r.lawFrac) - 6} textAnchor="middle" fill={ED.series2} fontSize={8.5}>
              {r.lawFrac.toFixed(3)}
            </text>
            <text x={cx} y={padT + cH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
              j={r.offset} (k={r.k})
            </text>
          </g>
        );
      })}

      <text x={padL + cW / 2} y={svgH - 2} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        tail offset j from the k = {crossoverDecadeK} peak
      </text>
      <text
        x={14}
        y={padT + cH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={10}
        transform={`rotate(-90 14 ${padT + cH / 2})`}
      >
        cumulative fraction of peak
      </text>

      <rect x={padL + cW - 150} y={padT} width={10} height={10} fill={ED.series1} />
      <text x={padL + cW - 136} y={padT + 9} fill={ED.inkSoft} fontSize={9}>
        measFrac = hump(9+j)/hump(9)
      </text>
      <rect x={padL + cW - 150} y={padT + 14} width={10} height={10} fill={ED.series2} />
      <text x={padL + cW - 136} y={padT + 23} fill={ED.inkSoft} fontSize={9}>
        lawFrac = 10^(-j/2)
      </text>
    </svg>
  );
}

function LocalDecayChart() {
  const svgW = 720;
  const padL = 48;
  const padR = 32;
  const padT = 20;
  const padB = 36;
  const svgH = 220;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const n = tailLadder.length;
  const yMax = sqrt10PerDecadeRate * 1.08;
  const xS = (i) => padL + (cW * i) / (n - 1);
  const yS = (v) => padT + cH - (v / yMax) * cH;

  const yTicks = [0, 1, 2, 3, sqrt10PerDecadeRate];

  const points = tailLadder.map((r, i) => `${xS(i)},${yS(r.localDecay)}`).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />

      {yTicks.map((t, ti) => (
        <g key={'yt' + ti}>
          <line
            x1={padL - 4}
            y1={yS(t)}
            x2={padL + cW}
            y2={yS(t)}
            stroke={t === sqrt10PerDecadeRate ? ED.brassDeco : ED.ruleSoft}
            strokeWidth={1}
            strokeDasharray={t === sqrt10PerDecadeRate ? '4 3' : undefined}
          />
          <text x={padL - 8} y={yS(t) + 3} textAnchor="end" fill={t === sqrt10PerDecadeRate ? ED.brass : ED.inkFaint} fontSize={9}>
            {t === sqrt10PerDecadeRate ? `sqrt(10)=${t.toFixed(3)}` : t.toFixed(1)}
          </text>
        </g>
      ))}

      <polyline points={points} fill="none" stroke={ED.series3} strokeWidth={2} />
      {tailLadder.map((r, i) => (
        <g key={'pt' + r.k}>
          <circle cx={xS(i)} cy={yS(r.localDecay)} r={3.5} fill={ED.series3} />
          <text x={xS(i)} y={yS(r.localDecay) - 8} textAnchor="middle" fill={ED.series3} fontSize={9}>
            {r.localDecay.toFixed(3)}
          </text>
          <text x={xS(i)} y={padT + cH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
            k={r.k}
          </text>
        </g>
      ))}

      <text x={padL + cW / 2} y={svgH - 2} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        decade k
      </text>
      <text
        x={14}
        y={padT + cH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={10}
        transform={`rotate(-90 14 ${padT + cH / 2})`}
      >
        localDecay(k) = hump(k-1)/hump(k)
      </text>
    </svg>
  );
}

export default function Imp34528TailsideHumpDecayVsSqrtNFartailViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="M3 Hump Tail vs the Pure N^(-1/2) Law (imp-34528)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-33851 attributed the lighter, faster-decaying tail side (k &gt; {crossoverDecadeK}) of the
        M3 hump envelope (peak hump({crossoverDecadeK}) = {humpPeak.toExponential(4)}) to the imp-3463
        far-tail sigma ~ sqrt(1/N) form, but only qualitatively. This page tabulates the cumulative
        fraction measFrac(j) = hump({crossoverDecadeK}+j)/hump({crossoverDecadeK}) against the idealized
        law lawFrac(j) = 10^(-j/2), and separately the local per-decade decay rate hump(k-1)/hump(k)
        against sqrt(10) = {sqrt10PerDecadeRate.toFixed(4)}.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        measFrac(j) vs lawFrac(j) -- the cumulative fraction OVERSHOOTS the pure law at every offset
      </p>
      <OvershootChart />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
        localDecay(k) climbs toward sqrt(10) -- the N^(-1/2) rate is an asymptotic LOCAL per-decade slope
      </p>
      <LocalDecayChart />

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
            <th style={{ padding: '0.4rem 0.6rem' }}>j</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>k</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>measFrac</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>lawFrac</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>resRatio</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>localDecay</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>gapToSqrt10</th>
          </tr>
        </thead>
        <tbody>
          {tailLadder.map((r) => (
            <tr key={r.offset} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.offset}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.k}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.measFrac}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.lawFrac}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace', color: 'var(--series-2)' }}>{r.resRatio}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace', color: 'var(--series-3)' }}>{r.localDecay}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.resSqrt10}</td>
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> measurement / cross-check only --
        reuses the imp-33809/imp-33851 hump amplitudes and imp-3463 exact-sigma landmarks verbatim; the
        component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the
        C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator
        positivity; imp-3066 K_a &ge; 0 remains untouched. No RH verdict, NO QED.
      </div>
    </div>
  );
}
