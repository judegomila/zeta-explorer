import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP95409_RHOSTAR_CURVE,
  IMP95409_DEPTH_FLIP_SERIES,
  IMP95409_SUMMARY,
} from '../data/imp-95409-rhostar-depthflip-viz-data.js';
import { ED, alpha } from '../styles/tokens.js';

function RhoStarCurve() {
  const svgW = 640;
  const svgH = 320;
  const padL = 56;
  const padR = 24;
  const padT = 20;
  const padB = 44;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  // rhoStar spans [1, ~+inf) as sigma -> 0; clip the log-y axis at rho = 30.
  const logMin = 0; // log10(1)
  const logMax = Math.log10(30);
  const xOf = (sigma) => padL + sigma * cW;
  const yOf = (rho) =>
    padT + cH - ((Math.log10(Math.max(rho, 1)) - logMin) / (logMax - logMin)) * cH;

  const clipped = IMP95409_RHOSTAR_CURVE.filter((p) => p.rhoStar <= 30);
  const path = clipped
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${xOf(p.sigma)},${yOf(p.rhoStar)}`)
    .join(' ');

  const sigmaFixed = IMP95409_DEPTH_FLIP_SERIES[0].sigma;
  const rhoStarAtFixed = IMP95409_DEPTH_FLIP_SERIES[0].rhoStar;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill={ED.paper} stroke={ED.ruleSoft} />

      {/* SPLIT-LOO region: rho above the rhoStar curve */}
      <polygon
        points={`${clipped.map((p) => `${xOf(p.sigma)},${yOf(p.rhoStar)}`).join(' ')} ${xOf(0.99)},${padT} ${xOf(0.01)},${padT}`}
        fill={alpha(ED.series1, 0.06)}
      />

      <path d={path} fill="none" stroke={ED.brassDeco} strokeWidth={2} />

      {[1, 2, 5, 10, 20, 30].map((v) => (
        <g key={`gy-${v}`}>
          <line x1={padL} y1={yOf(v)} x2={padL + cW} y2={yOf(v)} stroke={ED.ruleSoft} strokeWidth={0.5} />
          <text x={padL - 8} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9.5}>
            {v}
          </text>
        </g>
      ))}
      {[0, 0.2, 0.4, 0.6, 0.8, 1].map((v) => (
        <g key={`gx-${v}`}>
          <line x1={xOf(v)} y1={padT} x2={xOf(v)} y2={padT + cH} stroke={ED.ruleSoft} strokeWidth={0.5} />
          <text x={xOf(v)} y={padT + cH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5}>
            {v}
          </text>
        </g>
      ))}

      <line
        x1={xOf(sigmaFixed)}
        y1={padT}
        x2={xOf(sigmaFixed)}
        y2={padT + cH}
        stroke={ED.series2}
        strokeWidth={1.5}
        strokeDasharray="4,3"
      />
      <circle cx={xOf(sigmaFixed)} cy={yOf(rhoStarAtFixed)} r={5} fill="none" stroke={ED.series2} strokeWidth={2} />

      <text x={padL + cW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkSoft} fontSize={11}>
        sigma (principal-angle cosine)
      </text>
      <text
        x={12}
        y={padT + cH / 2}
        textAnchor="middle"
        fill={ED.inkSoft}
        fontSize={11}
        transform={`rotate(-90 12 ${padT + cH / 2})`}
      >
        rho (log scale, clipped at 30)
      </text>
      <text x={padL + 8} y={padT + 16} fill={ED.series1} fontSize={10}>
        SPLIT-LOO region (rho &gt; rhoStar)
      </text>
      <text x={padL + cW - 8} y={padT + cH - 8} textAnchor="end" fill={ED.brass} fontSize={10}>
        rhoStar(sigma) curve
      </text>
    </svg>
  );
}

function DepthFlipSeries() {
  const svgW = 640;
  const svgH = 300;
  const padL = 56;
  const padR = 24;
  const padT = 20;
  const padB = 44;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const xs = IMP95409_DEPTH_FLIP_SERIES.map((r) => r.x);
  const xMin = Math.min(...xs);
  const xMax = Math.max(...xs);
  const logXMin = Math.log10(xMin);
  const logXMax = Math.log10(xMax);
  const xOf = (x) => padL + ((Math.log10(x) - logXMin) / (logXMax - logXMin)) * cW;

  const logRhos = IMP95409_DEPTH_FLIP_SERIES.map((r) => Math.log10(r.rho));
  const logRhoStar = Math.log10(IMP95409_DEPTH_FLIP_SERIES[0].rhoStar);
  const yMin = Math.min(...logRhos, logRhoStar) - 0.3;
  const yMax = Math.max(...logRhos, logRhoStar) + 0.3;
  const yOf = (logRho) => padT + cH - ((logRho - yMin) / (yMax - yMin)) * cH;

  const path = IMP95409_DEPTH_FLIP_SERIES.map(
    (r, i) => `${i === 0 ? 'M' : 'L'}${xOf(r.x)},${yOf(Math.log10(r.rho))}`,
  ).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill={ED.paper} stroke={ED.ruleSoft} />

      <line
        x1={padL}
        y1={yOf(logRhoStar)}
        x2={padL + cW}
        y2={yOf(logRhoStar)}
        stroke={ED.brassDeco}
        strokeWidth={2}
      />
      <text x={padL + 4} y={yOf(logRhoStar) - 4} fill={ED.brass} fontSize={9.5}>
        rhoStar(sigma) = {IMP95409_DEPTH_FLIP_SERIES[0].rhoStar.toFixed(3)}
      </text>

      <path d={path} fill="none" stroke={ED.rule} strokeWidth={1} />
      {IMP95409_DEPTH_FLIP_SERIES.map((r, i) => (
        <circle
          key={`pt-${i}`}
          cx={xOf(r.x)}
          cy={yOf(Math.log10(r.rho))}
          r={5}
          fill={r.winner === 'LOO' ? ED.series1 : ED.series2}
        />
      ))}

      {[0.01, 0.02, 0.05, 0.1, 0.2, 0.5].map((v) => (
        <text key={`xt-${v}`} x={xOf(v)} y={padT + cH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5}>
          {v}
        </text>
      ))}

      <text x={padL + cW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkSoft} fontSize={11}>
        depth x (log scale)
      </text>
      <text
        x={12}
        y={padT + cH / 2}
        textAnchor="middle"
        fill={ED.inkSoft}
        fontSize={11}
        transform={`rotate(-90 12 ${padT + cH / 2})`}
      >
        log10(rho)
      </text>
      <text x={padL + 8} y={padT + 16} fill={ED.series2} fontSize={10}>
        SPLIT-2 wins (rho &lt; rhoStar)
      </text>
      <text x={padL + cW - 8} y={padT + cH - 8} textAnchor="end" fill={ED.series1} fontSize={10}>
        SPLIT-LOO wins (rho &gt; rhoStar)
      </text>
    </svg>
  );
}

export default function Imp95409RhoStarDepthFlipViz() {
  const s = IMP95409_SUMMARY;
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="SPLIT-2 vs SPLIT-LOO Crossover: rhoStar(sigma) Locus and the Depth Flip (imp-95256 / imp-95409)" />

      <div
        style={{
          marginBottom: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--series-2) 6%, transparent)',
          borderLeft: '3px solid var(--series-2)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-soft)',
          maxWidth: 700,
        }}
      >
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> measurement only, a
        re-render of the imp-95256 crossover identity in its rho-vs-rhoStar(sigma) form (equivalent
        to the g-vs-sigma form already rendered by imp-95391). It changes no Lambda bound. RH does not follow from
        anything on this page. NO QED.
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1rem', maxWidth: 700 }}>
        With rho := max(&radic;(&Lambda;<sub>1</sub>/&Lambda;<sub>2</sub>),
        &radic;(&Lambda;<sub>2</sub>/&Lambda;<sub>1</sub>)) &ge; 1 the per-block imbalance,
        {' '}{s.rhoStarFormula}. {s.criterion}. The curve below traces rhoStar(sigma); the region
        above it (larger rho, more imbalanced) is where SPLIT-LOO is the tighter bound.
      </p>
      <RhoStarCurve />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', margin: '1.5rem 0 0.5rem', maxWidth: 700 }}>
        Because sigma is a fixed geometric angle (depth-independent) while &Lambda;<sub>1</sub>,
        &Lambda;<sub>2</sub> both decay with depth x, rho drifts with depth at fixed sigma &mdash;
        so the same geometry can flip winners purely by moving x. The depth-flip witness{' '}
        {s.depthFlipConfig} has sigma = {s.sigmaFixed.toFixed(4)} fixed throughout, and rho crosses
        rhoStar(sigma) = {IMP95409_DEPTH_FLIP_SERIES[0].rhoStar.toFixed(3)} {s.flipInterval}.
      </p>
      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        rho(x) vs the fixed rhoStar(sigma) threshold, {s.depthFlipConfig}
      </p>
      <DepthFlipSeries />

      <table
        style={{
          width: '100%',
          marginTop: '1.5rem',
          borderCollapse: 'collapse',
          fontSize: '0.78rem',
        }}
      >
        <thead>
          <tr style={{ color: 'var(--ink-soft)', textAlign: 'left', borderBottom: '1px solid var(--rule)' }}>
            <th style={{ padding: '0.4rem 0.6rem' }}>x</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>rho</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>rhoStar(sigma)</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>winner</th>
          </tr>
        </thead>
        <tbody>
          {IMP95409_DEPTH_FLIP_SERIES.map((r, i) => (
            <tr
              key={`row-${i}`}
              style={{
                borderBottom:
                  i < IMP95409_DEPTH_FLIP_SERIES.length - 1 ? '1px solid var(--rule-soft)' : 'none',
                color: 'var(--ink)',
              }}
            >
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.x}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
                {r.rho.toExponential(4)}
              </td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
                {r.rhoStar.toFixed(4)}
              </td>
              <td style={{ padding: '0.4rem 0.6rem' }}>
                {r.winner === 'LOO' ? 'SPLIT-LOO' : 'SPLIT-2'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> {s.verdict}
      </div>
    </div>
  );
}
