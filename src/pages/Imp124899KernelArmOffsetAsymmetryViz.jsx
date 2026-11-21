import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP124852_WIDE_OFFSET_VS_GAP,
  IMP124852_DEEP_OFFSET_VS_GAP,
  IMP124852_SUMMARY,
} from '../data/imp-124852-kernel-arm-offset-asymmetry-viz-data.js';
import { ED } from '../styles/tokens.js';

const log10 = (v) => Math.log10(v);

function ArmOffsetChart() {
  const svgW = 680;
  const padL = 60;
  const padR = 24;
  const padT = 24;
  const padB = 44;
  const cW = svgW - padL - padR;
  const cH = 260;
  const svgH = padT + cH + padB;

  const rows = IMP124852_WIDE_OFFSET_VS_GAP;
  const logGap = rows.map((r) => log10(r.gap));
  const logUp = rows.map((r) => log10(Math.abs(r.up_offset)));
  const logDown = rows.map((r) => log10(Math.abs(r.down_offset)));
  const xMin = Math.min(...logGap);
  const xMax = Math.max(...logGap);
  const yMin = Math.floor(Math.min(...logUp, ...logDown)) - 0.5;
  const yMax = Math.ceil(Math.max(...logUp, ...logDown)) + 0.5;

  const xS = (lg) => padL + ((lg - xMin) / (xMax - xMin)) * cW;
  const yS = (lv) => padT + cH * (1 - (lv - yMin) / (yMax - yMin));

  const upPath = rows.map((r, i) => (i === 0 ? 'M' : 'L') + xS(logGap[i]).toFixed(1) + ',' + yS(logUp[i]).toFixed(2)).join(' ');
  const downPath = rows.map((r, i) => (i === 0 ? 'M' : 'L') + xS(logGap[i]).toFixed(1) + ',' + yS(logDown[i]).toFixed(2)).join(' ');

  const yTicks = [];
  for (let t = Math.ceil(yMin); t <= Math.floor(yMax); t++) yTicks.push(t);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill={ED.paper} rx={2} />

      {yTicks.map((t) => (
        <g key={t}>
          <line x1={padL} y1={yS(t)} x2={padL + cW} y2={yS(t)} stroke={ED.ruleSoft} strokeWidth={0.7} />
          <text x={padL - 6} y={yS(t) + 3.5} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            1e{t}
          </text>
        </g>
      ))}

      <path d={upPath} fill="none" stroke={ED.series1} strokeWidth={1.8} />
      <path d={downPath} fill="none" stroke={ED.series5} strokeWidth={1.8} strokeDasharray="4 3" />
      {rows.map((r, i) => (
        <g key={r.gap}>
          <circle cx={xS(logGap[i])} cy={yS(logUp[i])} r={2.6} fill={ED.series1} />
          <circle cx={xS(logGap[i])} cy={yS(logDown[i])} r={2.6} fill={ED.series5} />
        </g>
      ))}

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke={ED.rule} strokeWidth={1} />

      {rows.map((r, i) => (
        <g key={'x' + r.gap}>
          <line x1={xS(logGap[i])} y1={padT + cH} x2={xS(logGap[i])} y2={padT + cH + 5} stroke={ED.rule} strokeWidth={1} />
          <text x={xS(logGap[i])} y={padT + cH + 17} textAnchor="middle" fill={ED.inkFaint} fontSize={8.5}>
            {r.gap.toExponential(0)}
          </text>
        </g>
      ))}
      <text x={padL + cW / 2} y={padT + cH + 36} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        near-peak gap g (wide window, log scale)
      </text>
      <text x={16} y={padT + cH / 2} textAnchor="middle" fill={ED.inkFaint} fontSize={10} transform={'rotate(-90,16,' + (padT + cH / 2) + ')'}>
        |arm offset| (log scale)
      </text>
    </svg>
  );
}

function AsymmetryRatioChart() {
  const svgW = 680;
  const padL = 60;
  const padR = 24;
  const padT = 24;
  const padB = 44;
  const cW = svgW - padL - padR;
  const cH = 200;
  const svgH = padT + cH + padB;

  const rows = IMP124852_DEEP_OFFSET_VS_GAP;
  const yMin = Math.min(0.98, ...rows.map((r) => r.asymmetry_ratio)) - 0.005;
  const yMax = 1.002;
  const barW = (cW / rows.length) * 0.5;

  const xS = (i) => padL + ((i + 0.5) / rows.length) * cW;
  const yS = (v) => padT + cH * (1 - (v - yMin) / (yMax - yMin));

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill={ED.paper} rx={2} />
      <line x1={padL} y1={yS(1)} x2={padL + cW} y2={yS(1)} stroke={ED.ruleSoft} strokeWidth={1} strokeDasharray="3 2" />
      <text x={padL + cW - 2} y={yS(1) - 4} textAnchor="end" fill={ED.inkFaint} fontSize={8.5}>
        ratio = 1
      </text>
      {rows.map((r, i) => (
        <rect
          key={r.gap}
          x={xS(i) - barW / 2}
          y={yS(r.asymmetry_ratio)}
          width={barW}
          height={yS(yMin) - yS(r.asymmetry_ratio)}
          fill={ED.brassDeco}
        />
      ))}
      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke={ED.rule} strokeWidth={1} />
      {rows.map((r, i) => (
        <g key={'x' + r.gap}>
          <text x={xS(i)} y={padT + cH + 17} textAnchor="middle" fill={ED.inkFaint} fontSize={8.5}>
            {r.gap.toExponential(0)}
          </text>
          <text x={xS(i)} y={yS(r.asymmetry_ratio) - 6} textAnchor="middle" fill={ED.inkSoft} fontSize={8}>
            {r.asymmetry_ratio.toFixed(4)}
          </text>
        </g>
      ))}
      <text x={padL + cW / 2} y={padT + cH + 36} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        near-peak gap g (deep window) -- asymmetry ratio |up|/|down| climbing toward 1
      </text>
    </svg>
  );
}

export default function Imp124899KernelArmOffsetAsymmetryViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 940, margin: '0 auto' }}>
      <PageHeader title="Kernel Arm-Offset Asymmetry vs sqrt(10) (imp-124852)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 760 }}>
        imp-97823 measured that the imp-97520 reconstruction-kernel per-decade growth ratio |K|
        brackets sqrt(10) = 3.162278 from opposite sides on the upslope and downslope arms.
        imp-124852 quantified the signed offset of each arm from sqrt(10) as a function of the
        near-peak gap g: both offsets shrink as |offset| ~ g^(1/2) (log-log slope ~+0.499 / +0.501),
        and the arm-asymmetry ratio |up_offset| / |down_offset| climbs toward 1 as g -&gt; 0, showing
        the leading finite-gap correction is antisymmetric.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontSize: '0.78rem', fontStyle: 'italic', marginBottom: '1rem', maxWidth: 760 }}>
        Honest status: presentation only, reusing the frozen imp-124852 leaf verbatim. This is a
        conditional-share diagnostic on the inherited imp-3220/imp-3406 extrapolation, not a
        rigorous asymptotic. It moves no bound and establishes no operator positivity.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        per-arm offset from sqrt(10) vs gap (wide window, 6 rungs)
      </p>
      <ArmOffsetChart />

      <div style={{ marginTop: '0.75rem', fontSize: '0.78rem', color: 'var(--ink-faint)', display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
        <span><span style={{ color: 'var(--series-1)' }}>&#9644;</span> |upslope offset| (always negative-signed)</span>
        <span><span style={{ color: 'var(--series-5)' }}>&#9644;</span> |downslope offset| (always positive-signed)</span>
      </div>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', margin: '1.75rem 0 0.5rem' }}>
        asymmetry ratio |up_offset| / |down_offset| (deep window) -&gt; 1
      </p>
      <AsymmetryRatioChart />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> {IMP124852_SUMMARY.verdict}
      </div>
    </div>
  );
}
