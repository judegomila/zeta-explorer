import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP3614_GRID,
  IMP3614_RATIO_BAND,
  IMP3614_GAP_BAND,
  IMP3614_BASELINE,
} from '../data/imp-3614-sigma-crossover-floor-invariance-viz-data.js';
import { ED, alpha } from '../styles/tokens.js';

const RATIO_COLOR = ED.series1;
const GAP_MEASURED_COLOR = ED.series2;
const GAP_LAW_COLOR = ED.series4;
const BAND_FILL = alpha(ED.series3, 0.08);

function RatioChart() {
  const svgW = 640;
  const padL = 60;
  const padR = 24;
  const padT = 24;
  const padB = 44;
  const cW = svgW - padL - padR;
  const cH = 260;
  const svgH = padT + cH + padB;

  const fMin = 0.4;
  const fMax = 2.1;
  const rMin = 0.99;
  const rMax = 1.0;

  const xS = (f) => padL + ((f - fMin) / (fMax - fMin)) * cW;
  const yS = (r) => padT + cH * (1 - (r - rMin) / (rMax - rMin));

  const d = IMP3614_GRID.map((r, i) => (i === 0 ? 'M' : 'L') + xS(r.factor).toFixed(1) + ',' + yS(r.ratio).toFixed(1)).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill={ED.paper} rx={2} />

      <rect x={padL} y={yS(IMP3614_RATIO_BAND.max)} width={cW} height={yS(IMP3614_RATIO_BAND.min) - yS(IMP3614_RATIO_BAND.max)} fill={BAND_FILL} />

      {[0.99, 0.992, 0.994, 0.996, 0.998, 1.0].map((v) => (
        <g key={v}>
          <line x1={padL} y1={yS(v)} x2={padL + cW} y2={yS(v)} stroke={ED.ruleSoft} strokeWidth={0.7} />
          <text x={padL - 6} y={yS(v) + 3.5} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {v.toFixed(3)}
          </text>
        </g>
      ))}

      <path d={d} fill="none" stroke={RATIO_COLOR} strokeWidth={2} />
      {IMP3614_GRID.map((r) => (
        <circle key={r.factor} cx={xS(r.factor)} cy={yS(r.ratio)} r={4} fill={r.factor === 1.0 ? ED.series3 : RATIO_COLOR} stroke="#052e1f" strokeWidth={1} />
      ))}

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke={ED.rule} strokeWidth={1} />

      {IMP3614_GRID.map((r) => (
        <g key={'x' + r.factor}>
          <line x1={xS(r.factor)} y1={padT + cH} x2={xS(r.factor)} y2={padT + cH + 5} stroke={ED.rule} strokeWidth={1} />
          <text x={xS(r.factor)} y={padT + cH + 17} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
            {r.factor}x
          </text>
        </g>
      ))}
      <text x={padL + cW / 2} y={padT + cH + 36} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        E_trunc floor factor f (0.5x .. 2x baseline)
      </text>
      <text x={14} y={padT + cH / 2} textAnchor="middle" fill={ED.inkFaint} fontSize={10} transform={'rotate(-90,14,' + (padT + cH / 2) + ')'}>
        N_half / N_x ratio
      </text>

      <g fontSize={9}>
        <circle cx={padL + 6} cy={padT + 12} r={3.6} fill={ED.series3} />
        <text x={padL + 14} y={padT + 15} fill={ED.series3}>baseline f=1.0x: ratio {IMP3614_BASELINE.ratio.toFixed(6)} (matches imp-3556)</text>
      </g>
    </svg>
  );
}

function GapChart() {
  const svgW = 640;
  const padL = 60;
  const padR = 24;
  const padT = 24;
  const padB = 44;
  const cW = svgW - padL - padR;
  const cH = 240;
  const svgH = padT + cH + padB;

  const fMin = 0.4;
  const fMax = 2.1;
  const gMin = 0.15;
  const gMax = 0.75;

  const xS = (f) => padL + ((f - fMin) / (fMax - fMin)) * cW;
  const yS = (g) => padT + cH * (1 - (g - gMin) / (gMax - gMin));

  const dMeasured = IMP3614_GRID.map((r, i) => (i === 0 ? 'M' : 'L') + xS(r.factor).toFixed(1) + ',' + yS(r.gap_pct).toFixed(1)).join(' ');
  const dLaw = IMP3614_GRID.map((r, i) => (i === 0 ? 'M' : 'L') + xS(r.factor).toFixed(1) + ',' + yS(r.law_gap_pct).toFixed(1)).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill={ED.paper} rx={2} />

      {[0.2, 0.3, 0.4, 0.5, 0.6, 0.7].map((v) => (
        <g key={v}>
          <line x1={padL} y1={yS(v)} x2={padL + cW} y2={yS(v)} stroke={ED.ruleSoft} strokeWidth={0.7} />
          <text x={padL - 6} y={yS(v) + 3.5} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {v.toFixed(1)}%
          </text>
        </g>
      ))}

      <path d={dLaw} fill="none" stroke={GAP_LAW_COLOR} strokeWidth={2} strokeDasharray="4,3" />
      <path d={dMeasured} fill="none" stroke={GAP_MEASURED_COLOR} strokeWidth={2} />
      {IMP3614_GRID.map((r) => (
        <circle key={r.factor} cx={xS(r.factor)} cy={yS(r.gap_pct)} r={3.6} fill={GAP_MEASURED_COLOR} />
      ))}

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke={ED.rule} strokeWidth={1} />

      {IMP3614_GRID.map((r) => (
        <g key={'x' + r.factor}>
          <line x1={xS(r.factor)} y1={padT + cH} x2={xS(r.factor)} y2={padT + cH + 5} stroke={ED.rule} strokeWidth={1} />
          <text x={xS(r.factor)} y={padT + cH + 17} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
            {r.factor}x
          </text>
        </g>
      ))}
      <text x={padL + cW / 2} y={padT + cH + 36} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        E_trunc floor factor f (0.5x .. 2x baseline)
      </text>
      <text x={14} y={padT + cH / 2} textAnchor="middle" fill={ED.inkFaint} fontSize={10} transform={'rotate(-90,14,' + (padT + cH / 2) + ')'}>
        flow gap = 1 - N_half/N_x (%)
      </text>

      <g fontSize={9}>
        <line x1={padL + 2} y1={padT + 12} x2={padL + 10} y2={padT + 12} stroke={GAP_MEASURED_COLOR} strokeWidth={2} />
        <text x={padL + 14} y={padT + 15} fill={ED.series2}>measured gap (root-solved)</text>
        <line x1={padL + 2} y1={padT + 26} x2={padL + 10} y2={padT + 26} stroke={GAP_LAW_COLOR} strokeWidth={2} strokeDasharray="4,3" />
        <text x={padL + 14} y={padT + 29} fill={ED.brass}>structural law: 2 E_flow(N_x)/E_trunc</text>
      </g>
    </svg>
  );
}

export default function Imp3614SigmaCrossoverFloorInvarianceViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Sigma-Crossover Floor Invariance (imp-3580 / imp-3614)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-3556 found that the sigma(N)=1/2 half-decay of the conditional
        collision share coincides with the E_coll=E_trunc crossover, at a
        single baseline E_trunc floor. imp-3580 re-root-solves both crossings
        (N_half and N_x) across the imp-3443 half-to-double E_trunc floor grid
        f in {'{'}0.5, 0.75, 1.0, 1.5, 2.0{'}'} to test whether the coincidence
        and the ~0.996 ratio between the two crossings survive moving the
        floor.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        N_half/N_x ratio stays in the band [{IMP3614_RATIO_BAND.min}, {IMP3614_RATIO_BAND.max}] across the floor grid
      </p>
      <RatioChart />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', margin: '1.5rem 0 0.5rem' }}>
        Flow gap grows monotonically ({IMP3614_GAP_BAND.min}% .. {IMP3614_GAP_BAND.max}%), tracking the structural law
      </p>
      <GapChart />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the charts:</strong> the
        coincidence itself (sigma=1/2 at the same node where E_coll=E_trunc)
        is EXACTLY floor-invariant by construction. What the top chart shows
        is that the two root-solved crossings N_half and N_x, while not
        identical, stay within a tight ratio band ~0.996 across the whole
        half-to-double window -- the shaded region marks that band, and the
        green dot is the baseline f=1.0x node, which reproduces the imp-3556
        reading exactly. The bottom chart shows the refinement: the gap
        1-N_half/N_x is NOT a fixed 0.40% -- it grows monotonically with the
        floor from {IMP3614_GAP_BAND.min}% to {IMP3614_GAP_BAND.max}%, closely
        tracking the structural law 2 E_flow(N_x)/E_trunc (dashed) within the
        sqrt/log-drift linearization.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong>{' '}
        measurement/certification only -- a conditional-share diagnostic, NOT
        an RH bound. No positivity, no bridge closure, NO QED. The imp-3066
        off-diagonal endpoint-Hankel K_a &ge; 0 positivity remains untouched.
      </div>

      <div style={{ marginTop: '1rem', fontSize: '0.85rem', color: 'var(--ink-faint)' }}>
        <strong>Related:</strong>{' '}
        <Link to="/viz-imp3613-replica-fold-in-geometry" style={{ color: 'var(--series-5)' }}>
          Aliasing Fold-In Geometry (imp-3613)
        </Link>
      </div>
    </div>
  );
}
