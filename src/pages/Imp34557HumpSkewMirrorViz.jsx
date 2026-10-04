import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP34557_HUMP_SKEW_MIRROR_VIZ_J5 } from '../data/imp-34557-hump-skew-mirror-viz-j5.js';
import { ED } from '../styles/tokens.js';

const { mirrorLadder, skewLadder, asymmetryLadder, successiveSkewRatios, humpPeak, crossoverDecadeK } =
  IMP34557_HUMP_SKEW_MIRROR_VIZ_J5;

function MirrorBarChart() {
  const svgW = 720;
  const padL = 48;
  const padR = 32;
  const padT = 20;
  const padB = 36;
  const svgH = 280;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const n = mirrorLadder.length;
  const groupW = cW / n;
  const barW = groupW * 0.32;

  const yS = (frac) => padT + cH - frac * cH;
  const yTicks = [0, 0.25, 0.5, 0.75, 1.0];

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

      {mirrorLadder.map((r, i) => {
        const cx = padL + groupW * (i + 0.5);
        const headX = cx - barW - 3;
        const tailX = cx + 3;
        const j45 = r.offset >= 4;
        return (
          <g key={'j' + r.offset}>
            <rect
              x={headX}
              y={yS(r.headFrac)}
              width={barW}
              height={cH - (yS(r.headFrac) - padT)}
              fill={j45 ? '#fca5a5' : ED.series2}
            />
            <rect
              x={tailX}
              y={yS(r.tailFrac)}
              width={barW}
              height={cH - (yS(r.tailFrac) - padT)}
              fill={j45 ? '#93c5fd' : ED.series1}
            />
            <text x={headX + barW / 2} y={yS(r.headFrac) - 6} textAnchor="middle" fill={ED.series2} fontSize={8.5}>
              {r.headFrac.toFixed(3)}
            </text>
            <text x={tailX + barW / 2} y={yS(r.tailFrac) - 6} textAnchor="middle" fill={ED.series1} fontSize={8.5}>
              {r.tailFrac.toFixed(3)}
            </text>
            <text x={cx} y={padT + cH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
              j={r.offset} (k={r.headK} vs k={r.tailK})
            </text>
            <text x={cx} y={padT + cH + 28} textAnchor="middle" fill={ED.inkSoft} fontSize={8.5}>
              skew={r.skew.toFixed(2)}
            </text>
          </g>
        );
      })}

      <text x={padL + cW / 2} y={svgH - 2} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        symmetric offset j from the k = {crossoverDecadeK} peak (j = 4,5 = extended head/tail rungs)
      </text>
      <text
        x={14}
        y={padT + cH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={10}
        transform={`rotate(-90 14 ${padT + cH / 2})`}
      >
        fraction of peak retained
      </text>

      <rect x={padL + cW - 130} y={padT} width={10} height={10} fill={ED.series2} />
      <text x={padL + cW - 116} y={padT + 9} fill={ED.inkSoft} fontSize={9}>
        headFrac = hump(9-j)/hump(9)
      </text>
      <rect x={padL + cW - 130} y={padT + 14} width={10} height={10} fill={ED.series1} />
      <text x={padL + cW - 116} y={padT + 23} fill={ED.inkSoft} fontSize={9}>
        tailFrac = hump(9+j)/hump(9)
      </text>
    </svg>
  );
}

function SkewAccelerationChart() {
  const svgW = 720;
  const padL = 56;
  const padR = 32;
  const padT = 20;
  const padB = 36;
  const svgH = 200;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const n = successiveSkewRatios.length;
  const xS = (i) => padL + (i / (n - 1)) * cW;
  const yMin = Math.min(...successiveSkewRatios) - 0.3;
  const yMax = Math.max(...successiveSkewRatios) + 0.3;
  const yS = (v) => padT + cH - ((v - yMin) / (yMax - yMin)) * cH;

  const pts = successiveSkewRatios.map((v, i) => `${xS(i)},${yS(v)}`).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />

      <polyline points={pts} fill="none" stroke={ED.brassDeco} strokeWidth={2} />
      {successiveSkewRatios.map((v, i) => (
        <g key={'ssr' + i}>
          <circle cx={xS(i)} cy={yS(v)} r={4} fill={ED.brassDeco} />
          <text x={xS(i)} y={yS(v) - 10} textAnchor="middle" fill={ED.brass} fontSize={8.5}>
            {v.toFixed(3)}
          </text>
          <text x={xS(i)} y={padT + cH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
            j={i + 1}&rarr;{i + 2}
          </text>
        </g>
      ))}

      {[yMin, (yMin + yMax) / 2, yMax].map((t, ti) => (
        <text key={'yt' + ti} x={padL - 8} y={yS(t) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
          {t.toFixed(2)}
        </text>
      ))}

      <text x={padL + cW / 2} y={svgH - 2} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        successive offset step j &rarr; j+1
      </text>
      <text
        x={16}
        y={padT + cH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={10}
        transform={`rotate(-90 16 ${padT + cH / 2})`}
      >
        skew(j+1) / skew(j)
      </text>
    </svg>
  );
}

export default function Imp34557HumpSkewMirrorViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="M3 Hump Skew Mirror, Extended to j=5 (imp-34557)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-33851 mirrored hump({crossoverDecadeK}-j) against hump({crossoverDecadeK}+j) about the k =
        {' '}{crossoverDecadeK} saturation-curvature peak (hump({crossoverDecadeK}) &asymp; {humpPeak.toExponential(4)})
        only out to offset j = 3. imp-34532 extended the underlying hump(k) ladder to k = 4,5,14 and
        found the head-heavy skew does NOT saturate at j = 4,5 -- it ACCELERATES. This page extends the
        mirror visualization to the full j = 1..{mirrorLadder.length} ladder: skew(j) = {skewLadder.join(', ')}, with the
        successive-skew ratio itself growing {successiveSkewRatios.join(' → ')}.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        headFrac(j) vs tailFrac(j) at each symmetric offset from the k = {crossoverDecadeK} peak, j = 1..{mirrorLadder.length}
      </p>
      <MirrorBarChart />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
        successive-skew ratio skew(j+1)/skew(j) itself GROWS -- the climb accelerates, it does not saturate
      </p>
      <SkewAccelerationChart />

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
            <th style={{ padding: '0.4rem 0.6rem' }}>head k</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>tail k</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>headFrac</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>tailFrac</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>skew</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>asym</th>
          </tr>
        </thead>
        <tbody>
          {mirrorLadder.map((r) => (
            <tr key={r.offset} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.offset}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.headK}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.tailK}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.headFrac}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.tailFrac}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace', color: 'var(--series-2)' }}>{r.skew}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace', color: 'var(--series-2)' }}>{r.asym}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.85rem', marginTop: '1rem' }}>
        The asymmetry index climbs {asymmetryLadder[0].toFixed(3)} &rarr; {asymmetryLadder[asymmetryLadder.length - 1].toFixed(3)}
        {' '}as j runs 1..{mirrorLadder.length}, approaching its ceiling of 1 (complete head-dominance); by
        j = 5 the head carries &asymp;{skewLadder[skewLadder.length - 1].toFixed(1)}x the tail at equal offset.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> visualization/presentation only --
        reuses the imp-33809 per-k hump amplitudes and the imp-34532 head/tail extension (k = 4,5,14)
        literals verbatim, no fresh computation. The j = 4,5 rungs sit in the deep collision-dominated
        (sigma &rarr; 1) regime where the inherited imp-3220/imp-3406 component model is least
        trustworthy. The C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no
        operator positivity; imp-3066 K_a &ge; 0 remains untouched. No RH verdict, NO QED.
      </div>
    </div>
  );
}
