import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP96478_AXIS,
  IMP96478_SHARE_BARS,
  IMP96478_FINDING,
  IMP96478_HONEST_BANNER,
} from '../data/imp-96478-count-gap-share-viz-data.js';
import { ED } from '../styles/tokens.js';

function CountGapShareChart() {
  const svgW = 680;
  const svgH = 320;
  const padL = 46;
  const padR = 46;
  const padT = 20;
  const padB = 40;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const n = IMP96478_SHARE_BARS.length;
  const barSlot = plotW / n;
  const barW = barSlot * 0.5;

  const yOfFrac = (f) => padT + plotH - f * plotH;
  const yOfS = (s) => padT + plotH
    - ((s - IMP96478_AXIS.sMin) / (IMP96478_AXIS.sMax - IMP96478_AXIS.sMin)) * plotH;

  const yTicksFrac = [0, 0.25, 0.5, 0.75, 1.0];

  const sPath = IMP96478_SHARE_BARS
    .map((b, i) => {
      const cx = padL + barSlot * (i + 0.5);
      return `${i === 0 ? 'M' : 'L'}${cx.toFixed(2)},${yOfS(b.sOfGamma).toFixed(2)}`;
    })
    .join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {yTicksFrac.map((v) => (
        <g key={`y${v}`}>
          <line x1={padL} y1={yOfFrac(v)} x2={padL + plotW} y2={yOfFrac(v)} stroke={ED.rule} strokeWidth={0.5} opacity={0.2} />
          <text x={padL - 8} y={yOfFrac(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={8}>
            {`${(v * 100).toFixed(0)}%`}
          </text>
        </g>
      ))}

      {IMP96478_SHARE_BARS.map((b, i) => {
        const cx = padL + barSlot * (i + 0.5);
        const x0 = cx - barW / 2;
        const y78Top = yOfFrac(b.plus78Fraction);
        const yBase = yOfFrac(0);
        const ySTop = yOfFrac(b.plus78Fraction + b.stFraction);
        return (
          <g key={`bar${b.N}`}>
            <rect
              x={x0}
              y={y78Top}
              width={barW}
              height={yBase - y78Top}
              fill={ED.brassDeco}
              opacity={0.85}
            />
            <rect
              x={x0}
              y={ySTop}
              width={barW}
              height={y78Top - ySTop}
              fill={ED.series5}
              opacity={0.85}
            />
            <text x={cx} y={padT + plotH + 14} textAnchor="middle" fill={ED.inkFaint} fontSize={8}>
              {`N=${b.N.toExponential(0)}`}
            </text>
          </g>
        );
      })}

      {/* S(gamma_N) wobble, secondary axis */}
      <path d={sPath} fill="none" stroke={ED.series1} strokeWidth={1.5} strokeDasharray="3,2" />
      {IMP96478_SHARE_BARS.map((b, i) => {
        const cx = padL + barSlot * (i + 0.5);
        return <circle key={`s${b.N}`} cx={cx} cy={yOfS(b.sOfGamma)} r={3} fill={ED.series1} />;
      })}

      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL + plotW} y1={padT} x2={padL + plotW} y2={padT + plotH} stroke={ED.series1} strokeWidth={1} opacity={0.5} />

      <text x={padL + plotW / 2} y={svgH - 6} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5}>
        {'intermediate anchor N (log scale); dashed blue = backed-out S(gamma_N), right axis'}
      </text>

      <g transform={`translate(${padL + 8}, ${padT})`}>
        <rect x={0} y={0} width={12} height={10} fill={ED.brassDeco} opacity={0.85} />
        <text x={17} y={9} fill={ED.inkSoft} fontSize={8}>
          {'+7/8 share'}
        </text>
        <rect x={0} y={14} width={12} height={10} fill={ED.series5} opacity={0.85} />
        <text x={17} y={23} fill={ED.inkSoft} fontSize={8}>
          {'S(T) residual share'}
        </text>
        <line x1={0} y1={35} x2={12} y2={35} stroke={ED.series1} strokeWidth={1.5} strokeDasharray="3,2" />
        <text x={17} y={38} fill={ED.inkSoft} fontSize={8}>
          {'S(gamma_N)'}
        </text>
      </g>
    </svg>
  );
}

export default function Imp96478CountGapShareViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="imp-96445: Count-Inversion Gap Split (+7/8 Share vs S(T) Residual)" />

      <div
        style={{
          marginBottom: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--series-2) 6%, transparent)',
          borderLeft: '3px solid var(--series-2)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-soft)',
          maxWidth: 760,
        }}
      >
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> {IMP96478_HONEST_BANNER}
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 760 }}>
        imp-96445 split the imp-96426 count-inversion relative gap at each intermediate
        anchor (N = 1e3..1e6) into the share explained by the deterministic +7/8
        Riemann&ndash;von Mangoldt term alone and the residual share from the S(T)
        fluctuation. {IMP96478_FINDING.plus78IsDominantShare}
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        stacked +7/8-vs-S(T) share split, with the S(gamma_N) wobble overlaid
      </h3>
      <CountGapShareChart />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> each bar sums to
        100% of the measured count-inversion gap at that anchor -- yellow is the
        deterministic +7/8-only share (a 60-73% majority at every anchor), purple is the
        residual S(T) fluctuation share (27-40%, does not decay). The dashed blue line
        (right axis) is the backed-out S(gamma_N) value itself, which wobbles in
        [+0.32, +0.60] rather than tracking a smooth trend -- this is why the purple share
        does not shrink monotonically with N. {IMP96478_FINDING.stShareDoesNotVanish}
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> viz-only page consuming the
        imp-96445 baked per-anchor fractions verbatim (only the log10(N) / stacked-bar
        projection is computed here, no re-fit, no zeros-bundle import). Accuracy-audit
        diagnostic only: no gap closed, no bound changed, conditional C_H &le; 0.127 stays
        UNPROVEN. RH open. NO QED.
      </div>
    </div>
  );
}
