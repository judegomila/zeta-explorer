import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP33962_ATTENUATION_RUNG_BY_RUNG_DECOMPOSITION as ARD } from '../data/imp-33962-attenuation-rung-by-rung-decomposition.js';
import { ED } from '../styles/tokens.js';

const { ladder: LADDER, normaliserDrift: ND } = ARD;
const F4_UNITY_CROSSING_K = 8.9; // imp-33962 R3 one-decimal reading; imp-34003 refines to k_c=8.8209

// Per-step F2 |ln|-magnitude share across the 20 imp-33810 quarter-decade steps: head 0.871 -> mid
// dip ~0.599 -> interior peak ~0.905 -> tail 0.079, with the imp-33922 net aggregate (0.9225) and the
// imp-33962 F4=1 crossing (~k 8.9) marked, so the headline "92% is F2" reads as a net figure, not a
// per-rung constant.
function MagShareDriftChart() {
  const svgW = 640;
  const svgH = 320;
  const padL = 44;
  const padR = 20;
  const padT = 16;
  const padB = 36;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const xs = LADDER.map((s) => (s.from_k + s.to_k) / 2);
  const ys = LADDER.map((s) => s.magShareF2);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = 0;
  const maxY = 1;

  const xAt = (x) => padL + ((x - minX) / (maxX - minX)) * cW;
  const yAt = (y) => padT + cH - ((y - minY) / (maxY - minY)) * cH;

  const linePath = xs.map((x, i) => `${xAt(x)},${yAt(ys[i])}`).join(' ');
  const aggY = yAt(ND.aggregate_mag_share_F2);
  const crossX = xAt(F4_UNITY_CROSSING_K);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={aggY} x2={padL + cW} y2={aggY} stroke={ED.rule} strokeWidth={1.25} strokeDasharray="5,3" />
      <line x1={crossX} y1={padT} x2={crossX} y2={padT + cH} stroke={ED.series2} strokeWidth={1.25} strokeDasharray="3,3" />
      <polyline points={linePath} fill="none" stroke={ED.series1} strokeWidth={2} />
      {xs.map((x, i) => (
        <circle key={`pt-${x}`} cx={xAt(x)} cy={yAt(ys[i])} r={3.25} fill={ED.series1} stroke={ED.paper} strokeWidth={0.5} />
      ))}
      {[6, 7, 8, 9, 10, 11].map((k) => (
        <text key={`xt-${k}`} x={xAt(k)} y={padT + cH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={8.5}>
          {k}
        </text>
      ))}
      {[0, 0.25, 0.5, 0.75, 1].map((y) => (
        <text key={`yt-${y}`} x={padL - 8} y={yAt(y) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={8.5}>
          {y}
        </text>
      ))}
      <text x={padL + cW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        ladder step midpoint k
      </text>
      <text x={padL + 6} y={padT + 12} fill={ED.series1} fontSize={9.5}>
        per-step |ln F2| magnitude share (20 steps)
      </text>
      <text x={padL + 6} y={aggY - 6} fill={ED.inkFaint} fontSize={9}>
        imp-33922 net aggregate {ND.aggregate_mag_share_F2}
      </text>
      <text x={crossX + 4} y={padT + 26} fill={ED.series2} fontSize={9}>
        F4=1 crossing k~{F4_UNITY_CROSSING_K}
      </text>
    </svg>
  );
}

export default function Imp34015F2MagShareDriftViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Per-Step F2 Magnitude-Share Drift (imp-33962)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-33922 read the E_N normaliser factor F2 as carrying "~92% of the attribution attenuation"
        from a single endpoint slice across the full imp-33810 quarter-decade ladder. imp-33962
        recomputed the four factors rung-by-rung (20 adjacent-rung steps over the 21 rungs) and found
        the local F2 |ln|-magnitude share is far from that constant: it starts at {ND.mag_share_F2_head}
        {' '}at the head, dips to a mid-ladder minimum near k~7.5, rises to an interior peak of{' '}
        {ND.mag_share_F2_max} (k~8.75-&gt;9.00), then collapses to {ND.mag_share_F2_tail} in the tail as
        the residual factor F4 -- whose ratio crosses unity near k~{F4_UNITY_CROSSING_K} -- takes over
        the attenuation. The chart below makes that drift visible against the net aggregate line.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        F2 |ln|-magnitude share vs ladder step -- 20 steps, k = 6.00..11.00
      </p>
      <MagShareDriftChart />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> measurement / cross-check only, no
        proof, no fresh derivation. The imp-33922 "92% is F2" headline (aggregate |ln| share{' '}
        {ND.aggregate_mag_share_F2}) is a net figure over the whole 5-decade window, not a per-rung
        property -- locally F2 carries anywhere from {ND.mag_share_F2_min} to {ND.mag_share_F2_max}.
        The inherited imp-3220/imp-3406 component model is NOT a rigorous asymptotic; changes no bound;
        imp-3066 K_a&gt;=0 untouched; C_mb GUE-conditional per imp-486 untouched; NO QED.
      </div>
    </div>
  );
}
