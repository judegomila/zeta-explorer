import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP3377_RESCUE_THRESHOLD,
  IMP3377_K_MAX_LADDER,
  IMP3377_ANCHOR_K1,
  IMP3377_ANCHOR_K_CERTIFIED,
  IMP3377_ANCHOR_K_ASSEMBLY,
} from '../data/imp-3377-rescue-budget-height-map-viz-data.js';
import { ED } from '../styles/tokens.js';

const ANCHORS = [IMP3377_ANCHOR_K1, IMP3377_ANCHOR_K_CERTIFIED, IMP3377_ANCHOR_K_ASSEMBLY];
const ANCHOR_COLORS = [ED.series4, ED.series1, ED.series5];

function KMaxChart() {
  const svgW = 680;
  const padL = 60;
  const padR = 24;
  const padT = 24;
  const padB = 44;
  const cW = svgW - padL - padR;
  const cH = 260;
  const svgH = padT + cH + padB;

  const Ns = IMP3377_K_MAX_LADDER.map((r) => r.N);
  const logNMin = Math.log10(Ns[0]);
  const logNMax = Math.log10(Ns[Ns.length - 1]);
  const logKMin = Math.log10(IMP3377_K_MAX_LADDER[0].kMax);
  const logKMax = Math.log10(IMP3377_K_MAX_LADDER[IMP3377_K_MAX_LADDER.length - 1].kMax);

  const xS = (N) => padL + ((Math.log10(N) - logNMin) / (logNMax - logNMin)) * cW;
  const yS = (K) => padT + cH * (1 - (Math.log10(K) - logKMin) / (logKMax - logKMin));

  const path = IMP3377_K_MAX_LADDER.map((r, i) => (i === 0 ? 'M' : 'L') + xS(r.N).toFixed(1) + ',' + yS(r.kMax).toFixed(2)).join(' ');

  const yTicks = [0.3, 1, 3, 9, 30];
  const xTicks = [100, 1000, 10000, 100000, 1000000];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill={ED.paper} rx={2} />

      {yTicks.map((v) => (
        <g key={v}>
          <line x1={padL} y1={yS(v)} x2={padL + cW} y2={yS(v)} stroke={ED.ruleSoft} strokeWidth={0.7} />
          <text x={padL - 6} y={yS(v) + 3.5} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {v}
          </text>
        </g>
      ))}

      <path d={path} fill="none" stroke={ED.series1} strokeWidth={2} />

      {ANCHORS.map((a, i) => (
        <g key={a.label}>
          <line x1={xS(a.N)} y1={padT} x2={xS(a.N)} y2={padT + cH} stroke={ANCHOR_COLORS[i]} strokeWidth={1} strokeDasharray="4 3" opacity={0.6} />
          <circle cx={xS(a.N)} cy={yS(a.K)} r={3.8} fill={ANCHOR_COLORS[i]} />
        </g>
      ))}

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke={ED.rule} strokeWidth={1} />

      {xTicks.map((N) => (
        <g key={'x' + N}>
          <line x1={xS(N)} y1={padT + cH} x2={xS(N)} y2={padT + cH + 5} stroke={ED.rule} strokeWidth={1} />
          <text x={xS(N)} y={padT + cH + 17} textAnchor="middle" fill={ED.inkFaint} fontSize={8.5}>
            {N.toExponential(0)}
          </text>
        </g>
      ))}
      <text x={padL + cW / 2} y={padT + cH + 36} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        N, height (log scale)
      </text>
      <text x={16} y={padT + cH / 2} textAnchor="middle" fill={ED.inkFaint} fontSize={10} transform={'rotate(-90,16,' + (padT + cH / 2) + ')'}>
        K_max(N) (log scale)
      </text>
    </svg>
  );
}

function InverseChart() {
  const svgW = 680;
  const padL = 74;
  const padR = 24;
  const padT = 24;
  const padB = 44;
  const cW = svgW - padL - padR;
  const cH = 220;
  const svgH = padT + cH + padB;

  const Ks = IMP3377_K_MAX_LADDER.map((r) => r.kMax);
  const logKMin = Math.log10(Ks[0]);
  const logKMax = Math.log10(Ks[Ks.length - 1]);
  const logNMin = Math.log10(IMP3377_K_MAX_LADDER[0].N);
  const logNMax = Math.log10(IMP3377_K_MAX_LADDER[IMP3377_K_MAX_LADDER.length - 1].N);

  const xS = (K) => padL + ((Math.log10(K) - logKMin) / (logKMax - logKMin)) * cW;
  const yS = (N) => padT + cH * (1 - (Math.log10(N) - logNMin) / (logNMax - logNMin));

  const path = IMP3377_K_MAX_LADDER.map((r, i) => (i === 0 ? 'M' : 'L') + xS(r.kMax).toFixed(1) + ',' + yS(r.N).toFixed(2)).join(' ');

  const yTicks = [100, 1000, 10000, 100000, 1000000];
  const xTicks = [0.3, 1, 3, 9, 30];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill={ED.paper} rx={2} />

      {yTicks.map((v) => (
        <g key={v}>
          <line x1={padL} y1={yS(v)} x2={padL + cW} y2={yS(v)} stroke={ED.ruleSoft} strokeWidth={0.7} />
          <text x={padL - 6} y={yS(v) + 3.5} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {v.toExponential(0)}
          </text>
        </g>
      ))}

      <path d={path} fill="none" stroke={ED.series3} strokeWidth={2} />

      {ANCHORS.map((a, i) => (
        <circle key={a.label} cx={xS(a.K)} cy={yS(a.N)} r={3.8} fill={ANCHOR_COLORS[i]} />
      ))}

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke={ED.rule} strokeWidth={1} />

      {xTicks.map((K) => (
        <g key={'x' + K}>
          <line x1={xS(K)} y1={padT + cH} x2={xS(K)} y2={padT + cH + 5} stroke={ED.rule} strokeWidth={1} />
          <text x={xS(K)} y={padT + cH + 17} textAnchor="middle" fill={ED.inkFaint} fontSize={8.5}>
            {K}
          </text>
        </g>
      ))}
      <text x={padL + cW / 2} y={padT + cH + 36} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        K, tolerated C_mb bound (log scale)
      </text>
      <text x={16} y={padT + cH / 2} textAnchor="middle" fill={ED.inkFaint} fontSize={10} transform={'rotate(-90,16,' + (padT + cH / 2) + ')'}>
        N_min(K) (log scale)
      </text>
    </svg>
  );
}

export default function Imp3377RescueBudgetHeightMapViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 940, margin: '0 auto' }}>
      <PageHeader title="Rescue-Budget K-to-Height Map (imp-3275)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 760 }}>
        The imp-486 rescue gate K &middot; log(N)/sqrt(N) &lt; {IMP3377_RESCUE_THRESHOLD} tolerates
        a weaker unconditional many-body-correction bound C_mb &le; K only above a K-dependent
        entry height. The rescue budget K_max(N) = {IMP3377_RESCUE_THRESHOLD} &middot; sqrt(N) /
        log(N) is strictly increasing and diverges as N &rarr; infinity, so any finite K clears
        the gate at a finite height &mdash; the cost of a weaker K is paid entirely in height, not
        in the beat value.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        K_max(N) vs N: the rescue budget rising across the recorded assembly
      </p>
      <KMaxChart />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', margin: '1.75rem 0 0.5rem' }}>
        Inverse map N_min(K) vs K: smallest height clearing the gate for a given tolerated K
      </p>
      <InverseChart />

      <div style={{ marginTop: '0.75rem', fontSize: '0.78rem', color: 'var(--ink-faint)', display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
        <span><span style={{ color: ANCHOR_COLORS[0] }}>&#9679;</span> {IMP3377_ANCHOR_K1.label}, N={IMP3377_ANCHOR_K1.N}</span>
        <span><span style={{ color: ANCHOR_COLORS[1] }}>&#9679;</span> {IMP3377_ANCHOR_K_CERTIFIED.label}</span>
        <span><span style={{ color: ANCHOR_COLORS[2] }}>&#9679;</span> {IMP3377_ANCHOR_K_ASSEMBLY.label}</span>
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> this chart is a
        measure/assess-only map of the imp-3275 rescue-budget formula; it does not extend the
        imp-963 interval-RK4 sweep or the imp-452 L_pt assembly. K &le; ~1.384 is unconditional
        TODAY (imp-963 reach [100, 10^4]); K up to ~9.23 needs the imp-962 sweep extended to
        (10^4, 10^6]. No RH claim, no change to conditional status.
      </div>
    </div>
  );
}
