import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP3658_BAND,
  IMP3658_RUNGS,
  IMP3658_ACROSS_LADDER_DRIFT,
} from '../data/imp-3658-planted-replica-argmax-drift-viz-data.js';

const GENUINE_COLOR = '#10b981';
const FIRST_FOLD_COLOR = '#38bdf8';
const SECOND_FOLD_COLOR = '#f59e0b';
const CEILING_COLOR = '#f87171';
const FLOOR_COLOR = '#a78bfa';

function ArgmaxVsNChart() {
  const svgW = 640;
  const padL = 60;
  const padR = 24;
  const padT = 24;
  const padB = 46;
  const cW = svgW - padL - padR;
  const cH = 260;
  const svgH = padT + cH + padB;

  const nMin = 700;
  const nMax = 11000;
  const yMin = 100;
  const yMax = 22000;

  const xS = (n) => padL + ((Math.log10(n) - Math.log10(nMin)) / (Math.log10(nMax) - Math.log10(nMin))) * cW;
  const yS = (v) => padT + cH * (1 - (Math.log10(v) - Math.log10(yMin)) / (Math.log10(yMax) - Math.log10(yMin)));

  const dGenuine = IMP3658_RUNGS.map((r, i) => (i === 0 ? 'M' : 'L') + xS(r.N).toFixed(1) + ',' + yS(r.genuineArgmax).toFixed(1)).join(' ');
  const dFirst = IMP3658_RUNGS.map((r, i) => (i === 0 ? 'M' : 'L') + xS(r.N).toFixed(1) + ',' + yS(r.firstFoldLoc).toFixed(1)).join(' ');
  const dSecond = IMP3658_RUNGS.map((r, i) => (i === 0 ? 'M' : 'L') + xS(r.N).toFixed(1) + ',' + yS(r.secondFoldLoc).toFixed(1)).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill="#0a0f1a" rx={2} />

      {[100, 1000, 10000].map((v) => (
        <g key={v}>
          <line x1={padL} y1={yS(v)} x2={padL + cW} y2={yS(v)} stroke="#1e293b" strokeWidth={0.7} />
          <text x={padL - 6} y={yS(v) + 3.5} textAnchor="end" fill="#475569" fontSize={9}>
            {v}
          </text>
        </g>
      ))}

      <line x1={padL} y1={yS(IMP3658_BAND.xiMax)} x2={padL + cW} y2={yS(IMP3658_BAND.xiMax)} stroke={CEILING_COLOR} strokeWidth={1.5} strokeDasharray="5,3" />
      <text x={padL + 4} y={yS(IMP3658_BAND.xiMax) - 4} fill="#fca5a5" fontSize={9}>
        band ceiling xi_max = {IMP3658_BAND.xiMax}
      </text>

      <line x1={xS(IMP3658_BAND.nReplicaFloor)} y1={padT} x2={xS(IMP3658_BAND.nReplicaFloor)} y2={padT + cH} stroke={FLOOR_COLOR} strokeWidth={1.5} strokeDasharray="3,3" />
      <text x={xS(IMP3658_BAND.nReplicaFloor) + 4} y={padT + 12} fill="#c4b5fd" fontSize={9}>
        N_replica ~ {IMP3658_BAND.nReplicaFloor.toFixed(0)}
      </text>

      <path d={dFirst} fill="none" stroke={FIRST_FOLD_COLOR} strokeWidth={2} />
      <path d={dSecond} fill="none" stroke={SECOND_FOLD_COLOR} strokeWidth={2} />
      <path d={dGenuine} fill="none" stroke={GENUINE_COLOR} strokeWidth={2.5} />

      {IMP3658_RUNGS.map((r) => (
        <g key={r.N}>
          <circle cx={xS(r.N)} cy={yS(r.genuineArgmax)} r={4} fill={GENUINE_COLOR} />
          <circle cx={xS(r.N)} cy={yS(r.firstFoldLoc)} r={4} fill={FIRST_FOLD_COLOR} />
          <circle cx={xS(r.N)} cy={yS(r.secondFoldLoc)} r={4} fill={SECOND_FOLD_COLOR} />
        </g>
      ))}

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke="#334155" strokeWidth={1} />

      {IMP3658_RUNGS.map((r) => (
        <g key={'x' + r.N}>
          <line x1={xS(r.N)} y1={padT + cH} x2={xS(r.N)} y2={padT + cH + 5} stroke="#334155" strokeWidth={1} />
          <text x={xS(r.N)} y={padT + cH + 17} textAnchor="middle" fill="#64748b" fontSize={9}>
            {r.N}
          </text>
        </g>
      ))}
      <text x={padL + cW / 2} y={padT + cH + 36} textAnchor="middle" fill="#64748b" fontSize={10}>
        N (panel count, log scale)
      </text>
      <text x={14} y={padT + cH / 2} textAnchor="middle" fill="#64748b" fontSize={10} transform={'rotate(-90,14,' + (padT + cH / 2) + ')'}>
        argmax location xi (log scale)
      </text>

      <g fontSize={9}>
        <circle cx={padL + 6} cy={padT + 12} r={3.6} fill={GENUINE_COLOR} />
        <text x={padL + 14} y={padT + 15} fill="#6ee7b7">genuine feature (pinned at xi_true = 250)</text>
        <circle cx={padL + 6} cy={padT + 26} r={3.6} fill={FIRST_FOLD_COLOR} />
        <text x={padL + 14} y={padT + 29} fill="#7dd3fc">first fold m=1 (2 xi_Nyq - xi_true)</text>
        <circle cx={padL + 6} cy={padT + 40} r={3.6} fill={SECOND_FOLD_COLOR} />
        <text x={padL + 14} y={padT + 43} fill="#fcd34d">second fold m=2 (4 xi_Nyq - xi_true)</text>
      </g>
    </svg>
  );
}

function AcrossLadderDriftChart() {
  const svgW = 640;
  const padL = 60;
  const padR = 24;
  const padT = 24;
  const padB = 44;
  const cW = svgW - padL - padR;
  const cH = 200;
  const svgH = padT + cH + padB;

  const bars = [
    { label: 'genuine', value: IMP3658_ACROSS_LADDER_DRIFT.genuine, color: GENUINE_COLOR },
    { label: 'first fold', value: IMP3658_ACROSS_LADDER_DRIFT.firstFold, color: FIRST_FOLD_COLOR },
    { label: 'second fold', value: IMP3658_ACROSS_LADDER_DRIFT.secondFold, color: SECOND_FOLD_COLOR },
  ];
  const vMax = 20000;
  const yS = (v) => padT + cH * (1 - v / vMax);
  const barW = 90;
  const gap = (cW - bars.length * barW) / (bars.length + 1);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill="#0a0f1a" rx={2} />

      {[0, 5000, 10000, 15000, 20000].map((v) => (
        <g key={v}>
          <line x1={padL} y1={yS(v)} x2={padL + cW} y2={yS(v)} stroke="#1e293b" strokeWidth={0.7} />
          <text x={padL - 6} y={yS(v) + 3.5} textAnchor="end" fill="#475569" fontSize={9}>
            {v}
          </text>
        </g>
      ))}

      {bars.map((b, i) => {
        const bx = padL + gap * (i + 1) + barW * i;
        const by = yS(b.value);
        return (
          <g key={b.label}>
            <rect x={bx} y={by} width={barW} height={padT + cH - by} fill={b.color} />
            <text x={bx + barW / 2} y={by - 6} textAnchor="middle" fill="#94a3b8" fontSize={9}>
              {b.value.toFixed(2)}
            </text>
            <text x={bx + barW / 2} y={padT + cH + 17} textAnchor="middle" fill="#64748b" fontSize={9}>
              {b.label}
            </text>
          </g>
        );
      })}

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke="#334155" strokeWidth={1} />
      <text x={padL + cW / 2} y={padT + cH + 36} textAnchor="middle" fill="#64748b" fontSize={10}>
        across-ladder argmax shift, N = 1200 to 9600
      </text>
      <text x={14} y={padT + cH / 2} textAnchor="middle" fill="#64748b" fontSize={10} transform={'rotate(-90,14,' + (padT + cH / 2) + ')'}>
        location shift (xi units)
      </text>
    </svg>
  );
}

export default function Imp3658PlantedReplicaArgmaxDriftViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Planted-Replica Argmax-Drift Discriminator (imp-3622 / imp-3658)" />

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-3601 derived the m-fold aliasing fold-in ladder and asserted, from
        alias-image geometry alone, that an m-fold replica shifts by 2 m
        xi_Nyq per panel doubling. imp-3622 MEASURES this end to end on a
        synthetic feature planted at xi_true = 250: a sampled cosine whose
        discrete periodogram is a Dirichlet comb peaking exactly at the
        alias-image set. The genuine in-band argmax stays pinned at 250 at
        every rung (drift 0), while the first- and second-fold replica images
        climb far above the band ceiling xi_max = 400 -- and above the
        imp-3582 generic clearance floor N_replica &asymp; 764 -- across the
        four imp-3558 rungs N in &#123;1200, 2400, 4800, 9600&#125;.
      </p>

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        Genuine argmax pinned at 250 vs replica images climbing well past the
        band ceiling xi_max = 400
      </p>
      <ArgmaxVsNChart />

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', margin: '1.5rem 0 0.5rem' }}>
        Across-ladder shift (N=1200 to N=9600): 0 for the genuine feature vs
        &asymp;8796.46 (first fold) and &asymp;17592.92 (second fold, exactly 2x)
      </p>
      <AcrossLadderDriftChart />

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
        <strong style={{ color: '#94a3b8' }}>Reading the charts:</strong> the
        top chart plots argmax location against N on log-log axes for three
        series: the genuine planted feature (green, flat at 250, drift 0),
        the first-fold replica (blue, m = 1, climbing 2 xi_Nyq per doubling),
        and the second-fold replica (amber, m = 2, climbing 4 xi_Nyq per
        doubling). The dashed red line marks the band ceiling xi_max = 400;
        every replica point sits above it for every rung, and the dashed
        purple line marks the imp-3582 generic clearance floor N_replica
        &asymp; 764, below the smallest rung N = 1200. The bottom chart makes
        the discriminator quantitative: it bars the total location shift from
        N = 1200 to N = 9600 for each series -- 0 for the genuine feature, and
        the far larger 8796.46 / 17592.92 for the first/second-fold replicas
        (the second exactly double the first), the 0-vs-huge drift split the
        imp-3558 argmax-drift-0 test relies on to unmask a replica.
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
        <strong style={{ color: '#94a3b8' }}>Honest status:</strong>{' '}
        measurement/certification only on a SYNTHETIC planted feature -- it
        confirms the imp-3601 asserted drift law and the imp-3558
        discriminator, not a new bound on |P1|. No positivity, no bridge
        closure, NO QED. The imp-3066 off-diagonal endpoint-Hankel K_a &ge; 0
        positivity remains untouched. Platt-Trudgian &Lambda; &le; 0.2 remains
        the rigorous SOTA.
      </div>

      <div style={{ marginTop: '1rem', fontSize: '0.85rem', color: '#64748b' }}>
        <strong>Related:</strong>{' '}
        <Link to="/viz-imp3657-sigma-crossover-tc-closedform-pin" style={{ color: '#7c3aed' }}>
          Closed-Form Flow-Factor Pin at the Sigma-Crossover (imp-3620 / imp-3657)
        </Link>
      </div>
    </div>
  );
}
