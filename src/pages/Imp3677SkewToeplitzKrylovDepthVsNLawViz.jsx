import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP3677_NAMED_ANCHORS,
  IMP3677_SAME_PAIR2_ANCHORS,
  IMP3677_FITS,
  IMP3677_PREDICT_LINEAR,
  IMP3677_PREDICT_SQRT,
  IMP3677_PREDICT_LOG,
  IMP3677_PREDICTIONS,
  IMP3677_GROWTH_FACTORS,
} from '../data/imp-3677-skew-toeplitz-krylov-depth-vs-N-law-viz-data.js';

const NAMED_COLOR = '#f87171';
const SAME_PAIR_COLOR = '#38bdf8';
const LOG_COLOR = '#34d399';
const SQRT_COLOR = '#f59e0b';
const LINEAR_COLOR = '#f87171';

function DepthVsNChart() {
  const svgW = 680;
  const padL = 66;
  const padR = 24;
  const padT = 24;
  const padB = 44;
  const cW = svgW - padL - padR;
  const cH = 280;
  const svgH = padT + cH + padB;

  const xMin = 1100;
  const xMax = 3300;
  const yMin = 150;
  const yMax = 1150;

  const xS = (N) => padL + ((N - xMin) / (xMax - xMin)) * cW;
  const yS = (m) => padT + cH * (1 - (m - yMin) / (yMax - yMin));

  const curveNs = [];
  for (let N = 1600; N <= xMax; N += 20) curveNs.push(N);
  const pathFor = (fn) => curveNs.map((N, i) => (i === 0 ? 'M' : 'L') + xS(N).toFixed(1) + ',' + yS(fn(N)).toFixed(1)).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill="#0a0f1a" rx={2} />

      {[150, 350, 550, 750, 950, 1150].map((v) => (
        <g key={v}>
          <line x1={padL} y1={yS(v)} x2={padL + cW} y2={yS(v)} stroke="#1e293b" strokeWidth={0.7} />
          <text x={padL - 6} y={yS(v) + 3.5} textAnchor="end" fill="#475569" fontSize={9}>
            {v}
          </text>
        </g>
      ))}

      <path d={pathFor(IMP3677_PREDICT_LOG)} fill="none" stroke={LOG_COLOR} strokeWidth={1.75} />
      <path d={pathFor(IMP3677_PREDICT_SQRT)} fill="none" stroke={SQRT_COLOR} strokeWidth={1.75} strokeDasharray="5,3" />
      <path d={pathFor(IMP3677_PREDICT_LINEAR)} fill="none" stroke={LINEAR_COLOR} strokeWidth={1.75} strokeDasharray="2,2" />

      {/* flat same-pair (pair 2, lambda_3) line: m* holds at 280 over N=1600..2000 */}
      <line
        x1={xS(1600)}
        y1={yS(280)}
        x2={xS(2000)}
        y2={yS(280)}
        stroke={SAME_PAIR_COLOR}
        strokeWidth={3}
      />
      {IMP3677_SAME_PAIR2_ANCHORS.map((a) => (
        <circle
          key={'sp' + a.N}
          cx={xS(a.N)}
          cy={yS(a.mStar)}
          r={4.5}
          fill={SAME_PAIR_COLOR}
          stroke="#052e1f"
          strokeWidth={1}
          opacity={a.mStarIsUpperBound ? 0.55 : 1}
        />
      ))}

      {IMP3677_NAMED_ANCHORS.map((a) => (
        <circle key={'na' + a.N} cx={xS(a.N)} cy={yS(a.mStar)} r={5.5} fill={NAMED_COLOR} stroke="#2b0a0a" strokeWidth={1.25} />
      ))}

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke="#334155" strokeWidth={1} />

      {[1200, 1600, 2000, 2400, 2800, 3200].map((N) => (
        <g key={'x' + N}>
          <line x1={xS(N)} y1={padT + cH} x2={xS(N)} y2={padT + cH + 5} stroke="#334155" strokeWidth={1} />
          <text x={xS(N)} y={padT + cH + 17} textAnchor="middle" fill="#64748b" fontSize={9}>
            {N}
          </text>
        </g>
      ))}
      <text x={padL + cW / 2} y={padT + cH + 36} textAnchor="middle" fill="#64748b" fontSize={10}>
        N
      </text>
      <text x={14} y={padT + cH / 2} textAnchor="middle" fill="#64748b" fontSize={10} transform={'rotate(-90,14,' + (padT + cH / 2) + ')'}>
        Krylov lock depth m*
      </text>

      <g transform={`translate(${padL + 12}, ${padT + 14})`}>
        <circle cx={0} cy={0} r={4.5} fill={NAMED_COLOR} />
        <text x={10} y={3.5} fill="#94a3b8" fontSize={9}>named anchors (pair 2 then pair 3)</text>
        <circle cx={280} cy={0} r={4} fill={SAME_PAIR_COLOR} />
        <text x={290} y={3.5} fill="#94a3b8" fontSize={9}>same-pair (pair 2) -- flat at 280</text>
      </g>
      <g transform={`translate(${padL + 12}, ${padT + 32})`}>
        <line x1={0} y1={0} x2={20} y2={0} stroke={LOG_COLOR} strokeWidth={1.75} />
        <text x={25} y={3.5} fill="#94a3b8" fontSize={9}>log fit</text>
        <line x1={90} y1={0} x2={110} y2={0} stroke={SQRT_COLOR} strokeWidth={1.75} strokeDasharray="5,3" />
        <text x={115} y={3.5} fill="#94a3b8" fontSize={9}>sqrt fit</text>
        <line x1={185} y1={0} x2={205} y2={0} stroke={LINEAR_COLOR} strokeWidth={1.75} strokeDasharray="2,2" />
        <text x={210} y={3.5} fill="#94a3b8" fontSize={9}>linear fit</text>
      </g>
    </svg>
  );
}

function PredictionTable() {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', color: '#94a3b8' }}>
      <thead>
        <tr style={{ borderBottom: '1px solid #334155' }}>
          <th style={{ textAlign: 'left', padding: '0.35rem 0.5rem' }}>N</th>
          <th style={{ textAlign: 'right', padding: '0.35rem 0.5rem', color: LOG_COLOR }}>log</th>
          <th style={{ textAlign: 'right', padding: '0.35rem 0.5rem', color: SQRT_COLOR }}>sqrt</th>
          <th style={{ textAlign: 'right', padding: '0.35rem 0.5rem', color: LINEAR_COLOR }}>linear</th>
          <th style={{ textAlign: 'right', padding: '0.35rem 0.5rem' }}>spread</th>
        </tr>
      </thead>
      <tbody>
        {IMP3677_PREDICTIONS.map((p) => {
          const lo = Math.min(p.linear, p.sqrt, p.log);
          const hi = Math.max(p.linear, p.sqrt, p.log);
          return (
            <tr key={p.N} style={{ borderBottom: '1px solid #1e293b' }}>
              <td style={{ padding: '0.35rem 0.5rem' }}>{p.N}</td>
              <td style={{ textAlign: 'right', padding: '0.35rem 0.5rem' }}>{p.log.toFixed(0)}</td>
              <td style={{ textAlign: 'right', padding: '0.35rem 0.5rem' }}>{p.sqrt.toFixed(0)}</td>
              <td style={{ textAlign: 'right', padding: '0.35rem 0.5rem' }}>{p.linear.toFixed(0)}</td>
              <td style={{ textAlign: 'right', padding: '0.35rem 0.5rem' }}>{(((hi - lo) / lo) * 100).toFixed(1)}%</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default function Imp3677SkewToeplitzKrylovDepthVsNLawViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 940, margin: '0 auto' }}>
      <PageHeader title="Skew-Toeplitz Krylov Depth-vs-N Law (imp-3645)" />

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 760 }}>
        imp-3645 unified the two skew-Toeplitz converged-Krylov-depth anchors -- lambda_3
        (pair 2) locking at m*=280 at N=1600, and lambda_5=lambda_6 (pair 3) locking at
        m*=480 at N=2000 -- and asked whether the minimal converged depth m*(N) grows
        linearly, as sqrt(N), or as log(N). Two heterogeneous points fit any two-parameter
        form exactly, so the three candidate fits below agree at the named anchors by
        construction and only start to separate once extrapolated.
      </p>

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        Named anchors (red) vs. the homogeneous same-pair evidence (blue, flat at 280)
      </p>
      <DepthVsNChart />

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', margin: '1.75rem 0 0.5rem' }}>
        Extrapolated depth predictions at the next two ladder rungs
      </p>
      <PredictionTable />

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
        <strong style={{ color: '#94a3b8' }}>Reading the chart:</strong> the named-anchor
        jump (red dots, 280 &rarr; 480) rises a factor {IMP3677_GROWTH_FACTORS.mStar.toFixed(3)} while
        N rises only a factor {IMP3677_GROWTH_FACTORS.n.toFixed(2)} -- far outstripping even
        sqrt(N)&apos;s factor {IMP3677_GROWTH_FACTORS.sqrtN.toFixed(3)}. But the homogeneous
        same-pair evidence (blue line) shows lambda_3&apos;s own depth requirement holds flat at
        280 across that same N range: the apparent super-linear growth is a PAIR-INDEX step
        (2 &rarr; 3), not a genuine N-law. The three fits agree to within a few percent at
        N=2400 but diverge to &sim;18% at N=3200, so the extrapolation is trustworthy only one
        rung out.
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
        <strong style={{ color: '#94a3b8' }}>Honest status:</strong> measurement/fit only --
        this visualizes the imp-3645 two-point fits and the pair-index confound; it does NOT
        construct the missing magnitude and does NOT attempt the imp-3066 K_a &ge; 0
        positivity. The matched-pair sweep needed to discriminate log vs sqrt vs linear for a
        FIXED pair was later carried out by imp-3663 (see the related page below).
        RH-equivalent, necessary-but-not-sufficient. Platt-Trudgian &Lambda; &le; 0.2 remains
        the rigorous SOTA.
      </div>

      <div style={{ marginTop: '1rem', fontSize: '0.85rem', color: '#64748b' }}>
        <strong>Related:</strong>{' '}
        <Link to="/viz-imp3696-matched-pair-krylov-depth-sweep" style={{ color: '#7c3aed' }}>
          Matched-Pair Krylov Depth Sweep (imp-3663 / imp-3696)
        </Link>
      </div>
    </div>
  );
}
