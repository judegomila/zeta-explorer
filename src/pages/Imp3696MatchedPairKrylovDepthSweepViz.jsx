import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP3696_MATCHED_ANCHORS,
  IMP3696_DELTA_M,
  IMP3696_FITS,
  IMP3696_PREDICT_LINEAR,
  IMP3696_PREDICT_SQRT,
  IMP3696_PREDICT_LOG,
  IMP3696_PRED_3200,
  IMP3696_IMP3645_BRACKET,
  IMP3696_MATCHED_2400,
} from '../data/imp-3696-matched-pair-krylov-depth-sweep-viz-data.js';
import { ED } from '../styles/tokens.js';

const ANCHOR_COLOR = ED.series1;
const LOG_COLOR = ED.series3;
const SQRT_COLOR = ED.series4;
const LINEAR_COLOR = ED.series2;
const BRACKET_COLOR = ED.series8;

function DepthSweepChart() {
  const svgW = 680;
  const padL = 66;
  const padR = 24;
  const padT = 24;
  const padB = 44;
  const cW = svgW - padL - padR;
  const cH = 280;
  const svgH = padT + cH + padB;

  const xMin = 1500;
  const xMax = 3300;
  const yMin = 300;
  const yMax = 1150;

  const xS = (N) => padL + ((N - xMin) / (xMax - xMin)) * cW;
  const yS = (m) => padT + cH * (1 - (m - yMin) / (yMax - yMin));

  const curveNs = [];
  for (let N = xMin; N <= xMax; N += 20) curveNs.push(N);
  const pathFor = (fn) => curveNs.map((N, i) => (i === 0 ? 'M' : 'L') + xS(N).toFixed(1) + ',' + yS(fn(N)).toFixed(1)).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill={ED.paper} rx={2} />

      {[300, 450, 600, 750, 900, 1050].map((v) => (
        <g key={v}>
          <line x1={padL} y1={yS(v)} x2={padL + cW} y2={yS(v)} stroke={ED.ruleSoft} strokeWidth={0.7} />
          <text x={padL - 6} y={yS(v) + 3.5} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {v}
          </text>
        </g>
      ))}

      {/* imp-3645 undiscriminated bracket, marked at N=2400 and N=3200 */}
      {[
        { N: 2400, lo: IMP3696_IMP3645_BRACKET.N2400.log, hi: IMP3696_IMP3645_BRACKET.N2400.linear },
        { N: 3200, lo: IMP3696_IMP3645_BRACKET.N3200.log, hi: IMP3696_IMP3645_BRACKET.N3200.linear },
      ].map((b) => (
        <g key={'bracket' + b.N}>
          <line x1={xS(b.N)} y1={yS(b.lo)} x2={xS(b.N)} y2={yS(b.hi)} stroke={BRACKET_COLOR} strokeWidth={4} strokeOpacity={0.35} />
          <text x={xS(b.N) + 6} y={yS(b.hi) + 3} fill={BRACKET_COLOR} fontSize={9}>
            imp-3645 {b.lo}..{b.hi}
          </text>
        </g>
      ))}

      <path d={pathFor(IMP3696_PREDICT_LOG)} fill="none" stroke={LOG_COLOR} strokeWidth={1.75} />
      <path d={pathFor(IMP3696_PREDICT_SQRT)} fill="none" stroke={SQRT_COLOR} strokeWidth={1.75} strokeDasharray="5,3" />
      <path d={pathFor(IMP3696_PREDICT_LINEAR)} fill="none" stroke={LINEAR_COLOR} strokeWidth={1.75} strokeDasharray="2,2" />

      {IMP3696_MATCHED_ANCHORS.map((a) => (
        <circle key={a.N} cx={xS(a.N)} cy={yS(a.mStar)} r={5} fill={ANCHOR_COLOR} stroke="#052e1f" strokeWidth={1.25} />
      ))}

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke={ED.rule} strokeWidth={1} />

      {[1600, 2000, 2400, 2800, 3200].map((N) => (
        <g key={'x' + N}>
          <line x1={xS(N)} y1={padT + cH} x2={xS(N)} y2={padT + cH + 5} stroke={ED.rule} strokeWidth={1} />
          <text x={xS(N)} y={padT + cH + 17} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
            {N}
          </text>
        </g>
      ))}
      <text x={padL + cW / 2} y={padT + cH + 36} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        N
      </text>
      <text x={14} y={padT + cH / 2} textAnchor="middle" fill={ED.inkFaint} fontSize={10} transform={'rotate(-90,14,' + (padT + cH / 2) + ')'}>
        matched-pair lock depth m*(N)
      </text>

      <g transform={`translate(${padL + 12}, ${padT + 14})`}>
        <circle cx={0} cy={0} r={4} fill={ANCHOR_COLOR} />
        <text x={10} y={3.5} fill={ED.inkSoft} fontSize={9}>measured anchors</text>
        <line x1={130} y1={0} x2={150} y2={0} stroke={LOG_COLOR} strokeWidth={1.75} />
        <text x={155} y={3.5} fill={ED.inkSoft} fontSize={9}>log fit (rms 4.67)</text>
        <line x1={260} y1={0} x2={280} y2={0} stroke={SQRT_COLOR} strokeWidth={1.75} strokeDasharray="5,3" />
        <text x={285} y={3.5} fill={ED.inkSoft} fontSize={9}>sqrt fit (rms 7.05)</text>
        <line x1={410} y1={0} x2={430} y2={0} stroke={LINEAR_COLOR} strokeWidth={1.75} strokeDasharray="2,2" />
        <text x={435} y={3.5} fill={ED.inkSoft} fontSize={9}>linear fit (rms 9.43)</text>
      </g>
    </svg>
  );
}

function ResidualBarChart() {
  const svgW = 420;
  const padL = 80;
  const padR = 24;
  const padT = 20;
  const padB = 34;
  const cW = svgW - padL - padR;
  const cH = 140;
  const svgH = padT + cH + padB;

  const rows = [
    { label: 'log', rms: IMP3696_FITS.log.rms, color: LOG_COLOR },
    { label: 'sqrt', rms: IMP3696_FITS.sqrt.rms, color: SQRT_COLOR },
    { label: 'linear', rms: IMP3696_FITS.linear.rms, color: LINEAR_COLOR },
  ];
  const maxRms = 10;
  const barH = cH / rows.length - 12;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill={ED.paper} rx={2} />
      {rows.map((r, i) => {
        const y = padT + i * (cH / rows.length) + 6;
        const w = (r.rms / maxRms) * cW;
        return (
          <g key={r.label}>
            <text x={padL - 8} y={y + barH / 2 + 3.5} textAnchor="end" fill={ED.inkSoft} fontSize={10}>
              {r.label}
            </text>
            <rect x={padL} y={y} width={w} height={barH} fill={r.color} rx={2} />
            <text x={padL + w + 6} y={y + barH / 2 + 3.5} fill={ED.inkSoft} fontSize={10}>
              {r.rms.toFixed(2)}
            </text>
          </g>
        );
      })}
      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke={ED.rule} strokeWidth={1} />
      <text x={padL + cW / 2} y={padT + cH + 24} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        least-squares residual RMS (lower is better)
      </text>
    </svg>
  );
}

function AnchorTable() {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', color: 'var(--ink-soft)' }}>
      <thead>
        <tr style={{ borderBottom: '1px solid var(--rule)' }}>
          <th style={{ textAlign: 'left', padding: '0.35rem 0.5rem' }}>N</th>
          <th style={{ textAlign: 'right', padding: '0.35rem 0.5rem' }}>m*(N)</th>
          <th style={{ textAlign: 'right', padding: '0.35rem 0.5rem' }}>Delta m from prior</th>
        </tr>
      </thead>
      <tbody>
        {IMP3696_MATCHED_ANCHORS.map((a, i) => (
          <tr key={a.N} style={{ borderBottom: '1px solid var(--rule-soft)' }}>
            <td style={{ padding: '0.35rem 0.5rem' }}>{a.N}</td>
            <td style={{ textAlign: 'right', padding: '0.35rem 0.5rem', color: ANCHOR_COLOR }}>{a.mStar}</td>
            <td style={{ textAlign: 'right', padding: '0.35rem 0.5rem' }}>
              {i === 0 ? '--' : i === 1 ? `+${IMP3696_DELTA_M.lo}` : `+${IMP3696_DELTA_M.hi}`}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function Imp3696MatchedPairKrylovDepthSweepViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 940, margin: '0 auto' }}>
      <PageHeader title="Matched-Pair Krylov Depth Sweep (imp-3663)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 760 }}>
        imp-3663 measured the minimal converged Lanczos Krylov depth m*(N) for the FIXED
        lambda_5=lambda_6 pair (index 3) across N in {'{'}1600, 2000, 2400{'}'}, obtaining the
        matched-pair anchor triple m*(1600)=360, m*(2000)=480, m*(2400)=560. Two equal N steps
        (Delta N=400) give unequal, decelerating depth steps ({IMP3696_DELTA_M.lo} then{' '}
        {IMP3696_DELTA_M.hi}) -- a concave, sub-linear growth that rules out a linear law.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        m*(N) anchor triple with the three candidate fits, overlaid against the imp-3645 undiscriminated bracket
      </p>
      <DepthSweepChart />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', margin: '1.75rem 0 0.5rem' }}>
        Least-squares residual RMS ranking: log ({IMP3696_FITS.log.rms.toFixed(2)}) &lt; sqrt (
        {IMP3696_FITS.sqrt.rms.toFixed(2)}) &lt; linear ({IMP3696_FITS.linear.rms.toFixed(2)})
      </p>
      <ResidualBarChart />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', margin: '1.75rem 0 0.5rem' }}>
        Matched-pair anchor triple (fixed pair index 3)
      </p>
      <AnchorTable />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> the log fit (green)
        edges the sqrt fit (amber) and both clear the linear fit (red), but the log-sqrt RMS
        gap ({(IMP3696_FITS.sqrt.rms - IMP3696_FITS.log.rms).toFixed(2)} units) sits below the
        &plusmn;20 uncertainty of the 40-step Krylov sub-depth grid, so log vs sqrt is NOT
        separated by these three anchors (sg-3663-log-vs-sqrt-fixed-pair). What IS resolved: the
        matched-pair extrapolation ({IMP3696_MATCHED_2400} at N=2400, ~{IMP3696_PRED_3200.log.toFixed(0)}
        {'-'}
        {IMP3696_PRED_3200.linear.toFixed(0)} at N=3200) sits clearly BELOW the imp-3645
        pair-index-confounded bracket (grey bands) at both N -- imp-3645's slope over-estimated
        the fixed-pair depth by roughly 15% to 40%.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> measurement/fit only --
        this visualizes the imp-3663 matched-pair anchor triple and fit discrimination; it does
        NOT construct the missing magnitude and does NOT attempt the imp-3066 K_a &ge; 0
        positivity. RH-equivalent, necessary-but-not-sufficient.
      </div>

      <div style={{ marginTop: '1rem', fontSize: '0.85rem', color: 'var(--ink-faint)' }}>
        <strong>Related:</strong>{' '}
        <Link to="/viz-imp3695-feature-foldin-floor-ladder" style={{ color: 'var(--series-5)' }}>
          Feature-Specific Fold-In Floor Ladder (imp-3666 / imp-3695)
        </Link>
      </div>
    </div>
  );
}
