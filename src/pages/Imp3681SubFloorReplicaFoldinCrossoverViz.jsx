import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP3681_N_FOLD_EXACT,
  IMP3681_N_COLOCATE_EXACT,
  IMP3681_N_REPLICA_GENERIC,
  IMP3681_RUNG_LADDER,
  IMP3681_XI_MAX,
} from '../data/imp-3681-sub-floor-replica-foldin-crossover-viz-data.js';

const GENUINE_COLOR = '#34d399';
const REPLICA_COLOR = '#f87171';
const FLOOR_COLOR = '#38bdf8';
const COLOCATE_COLOR = '#f59e0b';

function ReplicaCrossoverChart() {
  const svgW = 680;
  const padL = 66;
  const padR = 24;
  const padT = 24;
  const padB = 44;
  const cW = svgW - padL - padR;
  const cH = 260;
  const svgH = padT + cH + padB;

  const xMin = 380;
  const xMax = 920;
  const yMin = 0;
  const yMax = 720;

  const xS = (N) => padL + ((N - xMin) / (xMax - xMin)) * cW;
  const yS = (v) => padT + cH * (1 - (v - yMin) / (yMax - yMin));

  const ladderDesc = [...IMP3681_RUNG_LADDER].sort((a, b) => b.N - a.N);
  const replicaPath = ladderDesc
    .map((r, i) => (i === 0 ? 'M' : 'L') + xS(r.N).toFixed(1) + ',' + yS(r.replicaLoc).toFixed(1))
    .join(' ');
  const genuinePath =
    'M' + xS(xMin).toFixed(1) + ',' + yS(250).toFixed(1) + ' L' + xS(xMax).toFixed(1) + ',' + yS(250).toFixed(1);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill="#0a0f1a" rx={2} />

      {[0, 100, 200, 300, 400, 500, 600, 700].map((v) => (
        <g key={v}>
          <line x1={padL} y1={yS(v)} x2={padL + cW} y2={yS(v)} stroke="#1e293b" strokeWidth={0.7} />
          <text x={padL - 6} y={yS(v) + 3.5} textAnchor="end" fill="#475569" fontSize={9}>
            {v}
          </text>
        </g>
      ))}

      {/* band ceiling xi_max = 400 */}
      <line x1={padL} y1={yS(IMP3681_XI_MAX)} x2={padL + cW} y2={yS(IMP3681_XI_MAX)} stroke="#64748b" strokeWidth={1} strokeDasharray="2,2" />
      <text x={padL + 4} y={yS(IMP3681_XI_MAX) - 6} fill="#94a3b8" fontSize={9}>
        band ceiling xi_max = 400
      </text>

      {/* genuine peak, fixed at 250 */}
      <path d={genuinePath} fill="none" stroke={GENUINE_COLOR} strokeWidth={2} strokeDasharray="5,3" />
      <text x={padL + 4} y={yS(250) + 12} fill={GENUINE_COLOR} fontSize={9}>
        genuine peak xi_true = 250 (fixed)
      </text>

      {/* replica location vs N */}
      <path d={replicaPath} fill="none" stroke={REPLICA_COLOR} strokeWidth={2} />
      {ladderDesc.map((r) => (
        <circle key={r.N} cx={xS(r.N)} cy={yS(r.replicaLoc)} r={4} fill={REPLICA_COLOR} stroke="#3b0d0d" strokeWidth={1} />
      ))}

      {/* feature floor N_fold */}
      <line x1={xS(IMP3681_N_FOLD_EXACT)} y1={padT} x2={xS(IMP3681_N_FOLD_EXACT)} y2={padT + cH} stroke={FLOOR_COLOR} strokeWidth={1.5} strokeDasharray="4,2" />
      <text x={xS(IMP3681_N_FOLD_EXACT) + 4} y={padT + 12} fill={FLOOR_COLOR} fontSize={9}>
        N_fold ~ {IMP3681_N_FOLD_EXACT.toFixed(2)}
      </text>

      {/* co-location N_colocate, where replica crosses the genuine peak */}
      <circle cx={xS(IMP3681_N_COLOCATE_EXACT)} cy={yS(250)} r={5} fill="none" stroke={COLOCATE_COLOR} strokeWidth={2} />
      <text x={xS(IMP3681_N_COLOCATE_EXACT) + 6} y={yS(250) - 8} fill={COLOCATE_COLOR} fontSize={9}>
        N_colocate ~ {IMP3681_N_COLOCATE_EXACT.toFixed(2)}
      </text>

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke="#334155" strokeWidth={1} />

      {ladderDesc.map((r) => (
        <g key={'x' + r.N}>
          <line x1={xS(r.N)} y1={padT + cH} x2={xS(r.N)} y2={padT + cH + 5} stroke="#334155" strokeWidth={1} />
          <text x={xS(r.N)} y={padT + cH + 17} textAnchor="middle" fill="#64748b" fontSize={9}>
            {r.N}
          </text>
        </g>
      ))}
      <text x={padL + cW / 2} y={padT + cH + 36} textAnchor="middle" fill="#64748b" fontSize={10}>
        grid size N (sweeping 900 -&gt; 400)
      </text>
      <text x={14} y={padT + cH / 2} textAnchor="middle" fill="#64748b" fontSize={10} transform={'rotate(-90,14,' + (padT + cH / 2) + ')'}>
        frequency
      </text>
    </svg>
  );
}

function RungLadderTable() {
  const ladderDesc = [...IMP3681_RUNG_LADDER].sort((a, b) => b.N - a.N);
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', color: '#94a3b8' }}>
      <thead>
        <tr style={{ borderBottom: '1px solid #334155' }}>
          <th style={{ textAlign: 'left', padding: '0.35rem 0.5rem' }}>N</th>
          <th style={{ textAlign: 'right', padding: '0.35rem 0.5rem' }}>replica location</th>
          <th style={{ textAlign: 'right', padding: '0.35rem 0.5rem' }}>in band?</th>
          <th style={{ textAlign: 'right', padding: '0.35rem 0.5rem' }}>in-band peaks</th>
        </tr>
      </thead>
      <tbody>
        {ladderDesc.map((r) => (
          <tr key={r.N} style={{ borderBottom: '1px solid #1e293b' }}>
            <td style={{ padding: '0.35rem 0.5rem' }}>{r.N}</td>
            <td style={{ textAlign: 'right', padding: '0.35rem 0.5rem' }}>{r.replicaLoc.toFixed(2)}</td>
            <td style={{ textAlign: 'right', padding: '0.35rem 0.5rem', color: r.inBand ? REPLICA_COLOR : GENUINE_COLOR }}>
              {r.inBand ? 'yes' : 'no'}
            </td>
            <td style={{ textAlign: 'right', padding: '0.35rem 0.5rem', color: r.inBand ? REPLICA_COLOR : GENUINE_COLOR }}>
              {r.peakCount}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function Imp3681SubFloorReplicaFoldinCrossoverViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 940, margin: '0 auto' }}>
      <PageHeader title="Sub-Floor Replica Fold-In Crossover (imp-3647)" />

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 760 }}>
        The imp-3647 planted mid-band feature at xi_true = 250 has its own, LOWER fold-in floor
        N_fold = (xi_max + xi_true) U/(2 pi) ~ {IMP3681_N_FOLD_EXACT.toFixed(2)}, strictly below the
        imp-3582 generic worst-case floor N_replica = {IMP3681_N_REPLICA_GENERIC}. As the ladder
        sweeps N from 900 down to 400, the first-order replica 2 xi_Nyq - 250 descends through the
        band ceiling xi_max = 400 at N_fold, then sweeps THROUGH the fixed genuine peak at
        N_colocate ~ {IMP3681_N_COLOCATE_EXACT.toFixed(2)} -- the full masking crossover.
      </p>

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        Replica location vs the fixed genuine peak as N sweeps 900 -&gt; 400, crossing the band
        ceiling at N_fold and the genuine peak at N_colocate
      </p>
      <ReplicaCrossoverChart />

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', margin: '1.75rem 0 0.5rem' }}>
        Per-rung ladder: replica location, in-band status, and in-band comb-peak count
      </p>
      <RungLadderTable />

      <div
        style={{
          marginTop: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'rgba(148,163,184,0.04)',
          borderLeft: '3px solid #334155',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: '#64748b',
        }}
      >
        <strong style={{ color: '#94a3b8' }}>Reading the chart:</strong> above N_fold ~
        {' '}
        {IMP3681_N_FOLD_EXACT.toFixed(2)} (N = 900, 764, 700, 640) the replica sits above the band
        ceiling xi_max = 400, so exactly one peak (the genuine one) survives in-band and the
        argmax-drift-0 discriminator stays decisive -- even at N = 764, 700, 640, which lie below
        the generic worst-case floor of 764 yet remain replica-free for this specific feature. Below
        N_fold (N = 512, 400) the replica folds in-band with EXACTLY the same periodogram height as
        the genuine peak, and the crossover point N_colocate ~ {IMP3681_N_COLOCATE_EXACT.toFixed(2)}{' '}
        marks where the folded replica sweeps directly through the fixed genuine peak -- the worst
        masking case.
      </div>

      <div
        style={{
          marginTop: '0.75rem',
          padding: '0.75rem 1rem',
          background: 'rgba(148,163,184,0.04)',
          borderLeft: '3px solid #334155',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: '#64748b',
        }}
      >
        <strong style={{ color: '#94a3b8' }}>Honest status:</strong> measurement/certification only
        -- this MEASURES the sub-floor fold-in crossover of a SYNTHETIC planted feature and shows
        the imp-3582 generic floor 764 is a conservative worst-case bound (the mid-band feature
        floor is lower, ~{IMP3681_N_FOLD_EXACT.toFixed(2)}). It does NOT give xi* or the sup a closed
        form (the imp-3470 stationarity equation stays transcendental) and does not extend the
        finite-domain (0, 400] measurement of |P1|. RH-equivalent, necessary-but-not-sufficient; the
        imp-3066 K_a &ge; 0 positivity remains the lone obstruction, untouched. Platt-Trudgian
        &Lambda; &le; 0.2 remains the rigorous SOTA.
      </div>

      <div style={{ marginTop: '1rem', fontSize: '0.85rem', color: '#64748b' }}>
        <strong>Related:</strong>{' '}
        <Link to="/viz-imp3695-feature-foldin-floor-ladder" style={{ color: '#7c3aed' }}>
          Feature-Specific Fold-In Floor Ladder (imp-3666 / imp-3695)
        </Link>
      </div>
    </div>
  );
}
