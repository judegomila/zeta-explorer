import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP3864_CERTIFIED_ROWS,
  IMP3864_CERTIFIED_LEFT_EDGE,
  IMP3864_SMALL_N_FLOOR,
  imp3864IllustrativeRrelUpper,
} from '../data/imp-3864-fmb-small-n-enclosure-viz-data.js';

const CERTIFIED_COLOR = '#38bdf8';
const ILLUSTRATIVE_COLOR = '#f59e0b';
const LOWER_COLOR = '#10b981';

function SmallNEnclosureChart() {
  const svgW = 680;
  const padL = 78;
  const padR = 24;
  const padT = 20;
  const padB = 46;
  const cW = svgW - padL - padR;
  const cH = 260;
  const svgH = padT + cH + padB;

  const nMin = IMP3864_SMALL_N_FLOOR;
  const nMax = 1e6;
  const logNMin = Math.log10(nMin);
  const logNMax = Math.log10(nMax);
  const yMax = 0.003;

  const xS = (n) => padL + ((Math.log10(n) - logNMin) / (logNMax - logNMin)) * cW;
  const yS = (v) => padT + cH * (1 - v / yMax);
  const floorY = padT + cH;

  // Illustrative segment: sampled points from N=2 to N=1e4.
  const illustrativeNs = [2, 4, 8, 20, 50, 150, 500, 1500, 4000, 8000, 10000];
  const illustrativePts = illustrativeNs
    .map((n) => `${xS(n)},${yS(imp3864IllustrativeRrelUpper(n))}`)
    .join(' ');

  // Certified segment: left edge + the 10 plateau rows.
  const certifiedNs = [IMP3864_CERTIFIED_LEFT_EDGE.N, ...IMP3864_CERTIFIED_ROWS.map((r) => r.endN)];
  const certifiedVals = [IMP3864_CERTIFIED_LEFT_EDGE.RrelUpper, ...IMP3864_CERTIFIED_ROWS.map((r) => r.RrelUpper)];
  const certifiedPts = certifiedNs.map((n, i) => `${xS(n)},${yS(certifiedVals[i])}`).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill="#0a0f1a" rx={2} />

      {[0, 0.0005, 0.001, 0.0015, 0.002, 0.0025, 0.003].map((v) => (
        <g key={v}>
          <line x1={padL} y1={yS(v)} x2={padL + cW} y2={yS(v)} stroke="#1e293b" strokeWidth={0.7} />
          <text x={padL - 6} y={yS(v) + 3.5} textAnchor="end" fill="#475569" fontSize={9}>
            {v.toFixed(4)}
          </text>
        </g>
      ))}

      {/* Lower bound: exactly 0 for every N, N-agnostic and rigorous. */}
      <line x1={padL} y1={floorY} x2={padL + cW} y2={floorY} stroke={LOWER_COLOR} strokeWidth={2} />

      {/* Illustrative model, N in [2,1e4]. */}
      <polyline points={illustrativePts} fill="none" stroke={ILLUSTRATIVE_COLOR} strokeWidth={2} strokeDasharray="5,4" />

      {/* Certified band, N in [1e4,1e6]. */}
      <polyline points={certifiedPts} fill="none" stroke={CERTIFIED_COLOR} strokeWidth={2} />
      {certifiedNs.map((n, i) => (
        <circle key={n} cx={xS(n)} cy={yS(certifiedVals[i])} r={2.6} fill={CERTIFIED_COLOR} />
      ))}

      {/* N=2 exact collapse marker. */}
      <circle cx={xS(2)} cy={floorY} r={4} fill="#f8fafc" stroke={LOWER_COLOR} strokeWidth={1.5} />

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke="#334155" strokeWidth={1} />

      {[2, 10, 100, 1000, 1e4, 1e5, 1e6].map((n) => (
        <g key={'x' + n}>
          <line x1={xS(n)} y1={padT + cH} x2={xS(n)} y2={padT + cH + 5} stroke="#334155" strokeWidth={1} />
          <text x={xS(n)} y={padT + cH + 17} textAnchor="middle" fill="#64748b" fontSize={9}>
            {n < 1000 ? n : n.toExponential(0)}
          </text>
        </g>
      ))}
      <text x={padL + cW / 2} y={padT + cH + 36} textAnchor="middle" fill="#64748b" fontSize={10}>
        N (log scale)
      </text>
      <text
        x={16}
        y={padT + cH / 2}
        textAnchor="middle"
        fill="#64748b"
        fontSize={10}
        transform={'rotate(-90,16,' + (padT + cH / 2) + ')'}
      >
        F_mb(N) / (H^2/8), normalized
      </text>

      <g fontSize={9}>
        <line x1={padL + 2} y1={padT + 12} x2={padL + 10} y2={padT + 12} stroke={LOWER_COLOR} strokeWidth={2} />
        <text x={padL + 14} y={padT + 15} fill="#6ee7b7">
          Lower bound F_mb(N) &ge; 0 -- exact, N-agnostic, all N &ge; 2
        </text>
        <line x1={padL + 2} y1={padT + 26} x2={padL + 10} y2={padT + 26} stroke={CERTIFIED_COLOR} strokeWidth={2} />
        <text x={padL + 14} y={padT + 29} fill="#7dd3fc">
          Certified upper edge 1/theta_N - 1 (imp-3725, N in [1e4,1e6])
        </text>
        <line
          x1={padL + 2}
          y1={padT + 40}
          x2={padL + 10}
          y2={padT + 40}
          stroke={ILLUSTRATIVE_COLOR}
          strokeWidth={2}
          strokeDasharray="5,4"
        />
        <text x={padL + 14} y={padT + 43} fill="#fcd34d">
          Illustrative model, N in [2,1e4] -- shape only, not a computed sweep
        </text>
      </g>
    </svg>
  );
}

export default function Imp3864FmbSmallNEnclosureViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="F_mb Two-Sided Enclosure Down to N=2 (imp-3729)" />

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-3725 certifies the two-sided true-flow enclosure 0 &le; F_mb(N) &le; (H^2/8)(1/theta_N - 1)
        uniformly for N in [1e4,1e6]. imp-3729 assessed how this enclosure behaves below that floor: the
        lower bound F_mb(N) &ge; 0 is N-agnostic (its per-gap proof holds for every N &ge; 2), and the upper
        bound does not degrade as N shrinks -- Psi_N(T) is a partial sum of positive terms indexed by
        particles j &le; N, so removing particles only drops terms and theta_N rises toward 1, making the
        upper bound tighter. At the smallest non-vacuous case, N = {IMP3864_SMALL_N_FLOOR}, there is no
        third particle, Psi = 0, theta = 1, and the enclosure collapses to the exact two-particle Dyson
        equality t_c(2) = H^2/8, F_mb(2) = 0.
      </p>

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        Normalized enclosure F_mb(N)/(H^2/8), N from {IMP3864_SMALL_N_FLOOR} down-collapse point up to 1e6
      </p>
      <SmallNEnclosureChart />

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
        <strong style={{ color: '#94a3b8' }}>Reading the chart:</strong> the green floor is the exact,
        N-agnostic lower bound F_mb &ge; 0. The blue segment (N &ge; 1e4) is the imp-3725 certified upper
        edge, plotted from the real per-plateau RrelUpper = 1/theta_N - 1 values. The amber dashed segment
        (N &lt; 1e4) is a schematic model illustrating the rigorously-argued SHAPE of the collapse -- it is
        not a computed sweep, since imp-3729 is a derivation-only assessment with no small-N zero-table scan
        -- anchored so it meets the real certified value at N=1e4 and lands exactly on 0 at N = 2, where the
        white-ringed marker sits on the floor.
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
        <strong style={{ color: '#94a3b8' }}>Honest status:</strong> presentation of an existing
        derivation-only assessment (imp-3729); no new bound, no new computation. The N &ge; 1e4 segment is
        rigorous (imp-3725); the N &lt; 1e4 segment is illustrative only. imp-3066 untouched; Platt-Trudgian
        Lambda &le; 0.2 remains the rigorous SOTA. NO QED.
      </div>

      <div style={{ marginTop: '1rem', fontSize: '0.85rem', color: '#64748b' }}>
        <strong>Related:</strong>{' '}
        <Link to="/viz-imp3738-fmb-plateau-enclosure" style={{ color: '#7c3aed' }}>
          F_mb Per-Plateau Two-Sided Enclosure (imp-3725)
        </Link>
      </div>
    </div>
  );
}
