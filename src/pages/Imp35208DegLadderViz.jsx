import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP35148_G7_TRUNCATION_DEG_LEVER_PROBE } from '../data/imp-35148-g7-truncation-deg-lever-probe.js';
import { ED } from '../styles/tokens.js';

const D = IMP35148_G7_TRUNCATION_DEG_LEVER_PROBE;
const LADDER = D.measured.degLadder;
const DIFFS = D.measured.forwardDifferences;
const ANCHOR_DEG = 4;

// Two-panel chart: top panel plots ||R||(DEG) against the all-ones ceiling DEG+1 (imp-33791),
// marking the DEG=4 roadmap anchor; bottom panel bars the forward difference Delta||R||(DEG),
// showing every step strictly positive (no discrete softening lever).
function DegLadderChart() {
  const svgW = 680;
  const padL = 48;
  const padR = 20;
  const padT = 44;
  const gap = 46;
  const topH = 220;
  const botH = 150;
  const padB = 34;
  const plotW = svgW - padL - padR;
  const svgH = padT + topH + gap + botH + padB;

  const degMin = LADDER[0].deg;
  const degMax = LADDER[LADDER.length - 1].deg;
  const xOf = (deg) => padL + ((deg - degMin) / (degMax - degMin)) * plotW;

  // top panel: ||R|| vs ceiling
  const topYMax = LADDER[LADDER.length - 1].ceiling * 1.05;
  const topYOf = (v) => padT + topH - (v / topYMax) * topH;
  const opNormPath = LADDER.map((r, i) => `${i === 0 ? 'M' : 'L'} ${xOf(r.deg)} ${topYOf(r.opNorm)}`).join(' ');
  const ceilingPath = LADDER.map((r, i) => `${i === 0 ? 'M' : 'L'} ${xOf(r.deg)} ${topYOf(r.ceiling)}`).join(' ');
  const topYTicks = [0, 4, 8, 12];

  // bottom panel: forward differences (bars), all strictly positive
  const botTop = padT + topH + gap;
  const diffMax = D.measured.maxForwardDiff * 1.15;
  const botYOf = (v) => botTop + botH - (v / diffMax) * botH;
  const barW = (plotW / DIFFS.length) * 0.6;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <text x={padL} y={padT - 22} fill={ED.inkSoft} fontSize={11} fontWeight={700}>
        ||R||(DEG) vs. all-ones ceiling DEG+1, DEG=1..12 (imp-35148 / imp-3066 anchor)
      </text>
      {topYTicks.map((v) => (
        <g key={v}>
          <line x1={padL} y1={topYOf(v)} x2={padL + plotW} y2={topYOf(v)} stroke={ED.ruleSoft} strokeWidth={1} />
          <text x={padL - 6} y={topYOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {v}
          </text>
        </g>
      ))}
      {/* DEG=4 anchor marker (reproduces the roadmap ~4.617013710) */}
      <line
        x1={xOf(ANCHOR_DEG)}
        y1={padT}
        x2={xOf(ANCHOR_DEG)}
        y2={padT + topH}
        stroke={ED.series2}
        strokeWidth={1.25}
        strokeDasharray="2 3"
      />
      <text x={xOf(ANCHOR_DEG) + 4} y={padT + 12} fill={ED.series2} fontSize={8.5}>
        DEG=4 anchor (||R||&asymp;{D.measured.anchorDeg4OperatorNorm.toFixed(4)})
      </text>
      <path d={ceilingPath} fill="none" stroke={ED.brassDeco} strokeWidth={2} strokeDasharray="6 3" />
      <path d={opNormPath} fill="none" stroke={ED.series5} strokeWidth={2.25} />
      <line x1={padL} y1={padT + topH} x2={padL + plotW} y2={padT + topH} stroke={ED.rule} strokeWidth={1.5} />
      {LADDER.map((r) => (
        <text key={r.deg} x={xOf(r.deg)} y={padT + topH + 14} textAnchor="middle" fill={ED.inkFaint} fontSize={8.5}>
          {r.deg}
        </text>
      ))}
      <g>
        <circle cx={padL + 4} cy={padT - 8} r={3} fill={ED.series5} />
        <text x={padL + 12} y={padT - 4} fill={ED.series5} fontSize={8.5}>
          ||R||(DEG) (Perron norm)
        </text>
        <circle cx={padL + 190} cy={padT - 8} r={3} fill={ED.brassDeco} />
        <text x={padL + 198} y={padT - 4} fill={ED.brass} fontSize={8.5}>
          ceiling DEG+1
        </text>
      </g>

      <text x={padL} y={botTop - 8} fill={ED.inkSoft} fontSize={11} fontWeight={700}>
        Forward difference &Delta;||R||(DEG) &mdash; every step strictly positive
      </text>
      <line x1={padL} y1={botTop + botH} x2={padL + plotW} y2={botTop + botH} stroke={ED.rule} strokeWidth={1.5} />
      {DIFFS.map((d) => {
        const cx = xOf((d.fromDeg + d.toDeg) / 2);
        const barH = botH - (botYOf(d.delta) - botTop);
        return (
          <g key={d.fromDeg}>
            <rect
              x={cx - barW / 2}
              y={botYOf(d.delta)}
              width={barW}
              height={barH}
              fill={ED.series3}
              opacity={0.85}
            />
          </g>
        );
      })}
      {[0, D.measured.minForwardDiff, D.measured.maxForwardDiff].map((v) => (
        <g key={v}>
          <line x1={padL} y1={botYOf(v)} x2={padL + plotW} y2={botYOf(v)} stroke={ED.ruleSoft} strokeWidth={1} />
          <text x={padL - 6} y={botYOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {v.toFixed(2)}
          </text>
        </g>
      ))}
      {LADDER.slice(0, -1).map((r) => (
        <text key={r.deg} x={xOf(r.deg + 0.5)} y={botTop + botH + 14} textAnchor="middle" fill={ED.inkFaint} fontSize={8.5}>
          {r.deg}&rarr;{r.deg + 1}
        </text>
      ))}
    </svg>
  );
}

export default function Imp35208DegLadderViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Discrete DEG Ladder: ||R||(DEG) Monotone Inflation (imp-35208 / imp-35148)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-35075 exhausted the two continuous off-orbit parameters (decoupled pass rate, shear
        coefficient) at the imp-3066 admissible anchor, leaving the discrete truncation-size DEG
        axis as the last un-probed direction. imp-35148 stepped DEG&nbsp;=&nbsp;1..12 at the anchor
        (s_pass,&nbsp;s_shear,&nbsp;c)&nbsp;=&nbsp;(3,&nbsp;3,&nbsp;1) and measured the Perron norm
        ||R||(DEG) against the all-ones ceiling DEG+1 (imp-33791). This page plots that ladder and
        its forward difference.
      </p>

      <DegLadderChart />

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
            <th style={{ padding: '0.4rem 0.6rem' }}>DEG</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>size (DEG+1)</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>||R||(DEG)</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>ceiling DEG+1</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>&Delta;||R|| to next</th>
          </tr>
        </thead>
        <tbody>
          {LADDER.map((r, i) => (
            <tr key={r.deg} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
                {r.deg}
                {r.deg === ANCHOR_DEG ? ' (anchor)' : ''}
              </td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.truncationSize}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.opNorm.toFixed(6)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.ceiling}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
                {i < DIFFS.length ? `+${DIFFS[i].delta.toFixed(4)}` : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.8rem', marginTop: '1rem' }}>
        Every forward difference lies between&nbsp;
        {D.measured.minForwardDiff.toFixed(4)} and&nbsp;{D.measured.maxForwardDiff.toFixed(4)}
        &nbsp;&mdash; strictly positive across the whole ladder, so ||R||(DEG) is monotone
        INCREASING. The step trails the ceiling gap, which grows by exactly 1 per rung
        (DEG+1&nbsp;&minus;&nbsp;||R||(DEG) widens), so enlarging the truncation never softens the
        Perron norm; it only inflates it toward the ceiling.
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
        imp-35148 ||R||(DEG) ladder and forward-difference literals verbatim (no new computation).
        Confirms the discrete truncation-size DEG axis does NOT act as a softening mechanism on the
        imp-3066 exponential-shear metric-pair family; this is scoped to that family, not other
        kernel classes; imp-3066 K_a&nbsp;&ge;&nbsp;0 and G7 stay OPEN and untouched; establishes no
        operator positivity; changes no bound; no RH verdict, NO QED.
      </div>
    </div>
  );
}
