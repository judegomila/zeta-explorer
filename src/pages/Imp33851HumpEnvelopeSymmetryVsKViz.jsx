import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP33851_HUMP_ENVELOPE_SYMMETRY_VS_K } from '../data/imp-33851-hump-envelope-symmetry-vs-k.js';
import { ED } from '../styles/tokens.js';

const { symmetryLadder, skewRatios, asymmetryIndices, humpPeak, crossoverDecadeK, windowMass } =
  IMP33851_HUMP_ENVELOPE_SYMMETRY_VS_K;

function MirrorBarChart() {
  const svgW = 720;
  const padL = 48;
  const padR = 32;
  const padT = 20;
  const padB = 36;
  const svgH = 260;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const n = symmetryLadder.length;
  const groupW = cW / n;
  const barW = groupW * 0.32;

  const yMax = 1.0;
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

      {symmetryLadder.map((r, i) => {
        const cx = padL + groupW * (i + 0.5);
        const headX = cx - barW - 3;
        const tailX = cx + 3;
        return (
          <g key={'j' + r.offset}>
            <rect
              x={headX}
              y={yS(r.headFrac)}
              width={barW}
              height={cH - (yS(r.headFrac) - padT)}
              fill={ED.series2}
            />
            <rect
              x={tailX}
              y={yS(r.tailFrac)}
              width={barW}
              height={cH - (yS(r.tailFrac) - padT)}
              fill={ED.series1}
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
          </g>
        );
      })}

      <text x={padL + cW / 2} y={svgH - 2} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        symmetric offset j from the k = {crossoverDecadeK} peak
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
        headFrac = hump(k-j)/hump(k)
      </text>
      <rect x={padL + cW - 130} y={padT + 14} width={10} height={10} fill={ED.series1} />
      <text x={padL + cW - 116} y={padT + 23} fill={ED.inkSoft} fontSize={9}>
        tailFrac = hump(k+j)/hump(k)
      </text>
    </svg>
  );
}

export default function Imp33851HumpEnvelopeSymmetryVsKViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="M3 Hump Envelope Head/Tail Mirror Symmetry (imp-33851)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-33809 reported one-sided step ratios hump(k)/hump(k-1) and hump(k)/hump(k+1) around the
        k&nbsp;=&nbsp;{crossoverDecadeK} saturation-curvature peak (hump({crossoverDecadeK})&nbsp;=&nbsp;
        {humpPeak.toExponential(4)}). imp-33851 instead mirrors hump({crossoverDecadeK}-j) against
        hump({crossoverDecadeK}+j) at each symmetric offset j and finds the envelope is skewed
        head-heavy, not symmetric: the skew ratio climbs {skewRatios[0].toFixed(2)}&nbsp;&rarr;&nbsp;
        {skewRatios[skewRatios.length - 1].toFixed(2)} and the asymmetry index climbs{' '}
        {asymmetryIndices[0].toFixed(3)}&nbsp;&rarr;&nbsp;{asymmetryIndices[asymmetryIndices.length - 1].toFixed(3)}
        as j runs 1..{symmetryLadder.length}.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        headFrac(j) vs tailFrac(j) at each symmetric offset from the k = {crossoverDecadeK} peak
      </p>
      <MirrorBarChart />

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
          {symmetryLadder.map((r) => (
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
        Over the symmetric &plusmn;3 window the head decades sum to{' '}
        {windowMass.headMassK678.toExponential(4)} and the tail decades to{' '}
        {windowMass.tailMassK101112.toExponential(4)}, a head/tail mass ratio of{' '}
        {windowMass.massRatioHeadOverTail} (windowed asymmetry index {windowMass.windowedAsymmetryIndex}).
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> measurement only -- reuses the
        imp-33809 per-k hump amplitudes verbatim; the component model is the inherited
        imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per
        imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066
        K_a &ge; 0 remains untouched. No RH verdict, NO QED.
      </div>
    </div>
  );
}
