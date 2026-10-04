import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP3695_XI_MAX,
  IMP3695_STEP_INCREMENT_EXACT,
  IMP3695_N_REPLICA_GENERIC_EXACT,
  IMP3695_RUNG_LADDER,
  IMP3695_PEAK_COUNT_BELOW,
  IMP3695_PEAK_COUNT_ABOVE,
} from '../data/imp-3695-feature-foldin-floor-ladder-viz-data.js';
import { ED } from '../styles/tokens.js';

const FLOOR_COLOR = ED.series1;
const GAP_COLOR = ED.series4;
const BELOW_COLOR = ED.series2;
const ABOVE_COLOR = ED.series3;

function FoldInFloorLineChart() {
  const svgW = 680;
  const padL = 66;
  const padR = 24;
  const padT = 24;
  const padB = 44;
  const cW = svgW - padL - padR;
  const cH = 260;
  const svgH = padT + cH + padB;

  const xMin = 80;
  const xMax = 420;
  const yMin = 440;
  const yMax = 800;

  const xS = (xi) => padL + ((xi - xMin) / (xMax - xMin)) * cW;
  const yS = (n) => padT + cH * (1 - (n - yMin) / (yMax - yMin));

  const linePath = IMP3695_RUNG_LADDER.map((r, i) => (i === 0 ? 'M' : 'L') + xS(r.xiTrue).toFixed(1) + ',' + yS(r.nFold).toFixed(1)).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill={ED.paper} rx={2} />

      {[450, 500, 550, 600, 650, 700, 750, 800].map((v) => (
        <g key={v}>
          <line x1={padL} y1={yS(v)} x2={padL + cW} y2={yS(v)} stroke={ED.ruleSoft} strokeWidth={0.7} />
          <text x={padL - 6} y={yS(v) + 3.5} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {v}
          </text>
        </g>
      ))}

      {/* Generic imp-3582 worst-case floor ceiling line */}
      <line
        x1={padL}
        y1={yS(IMP3695_N_REPLICA_GENERIC_EXACT)}
        x2={padL + cW}
        y2={yS(IMP3695_N_REPLICA_GENERIC_EXACT)}
        stroke={ED.rule}
        strokeWidth={1}
        strokeDasharray="2,2"
      />
      <text x={padL + cW - 4} y={yS(IMP3695_N_REPLICA_GENERIC_EXACT) - 6} textAnchor="end" fill={ED.inkSoft} fontSize={9}>
        generic floor 2400/pi ~ 763.94
      </text>

      <path d={linePath} fill="none" stroke={FLOOR_COLOR} strokeWidth={2} />
      {IMP3695_RUNG_LADDER.map((r) => (
        <circle key={r.xiTrue} cx={xS(r.xiTrue)} cy={yS(r.nFold)} r={4} fill={FLOOR_COLOR} stroke="#052e1f" strokeWidth={1} />
      ))}

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke={ED.rule} strokeWidth={1} />

      {IMP3695_RUNG_LADDER.map((r) => (
        <g key={'x' + r.xiTrue}>
          <line x1={xS(r.xiTrue)} y1={padT + cH} x2={xS(r.xiTrue)} y2={padT + cH + 5} stroke={ED.rule} strokeWidth={1} />
          <text x={xS(r.xiTrue)} y={padT + cH + 17} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
            {r.xiTrue}
          </text>
        </g>
      ))}
      <text x={padL + cW / 2} y={padT + cH + 36} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        source frequency xi_true
      </text>
      <text x={14} y={padT + cH / 2} textAnchor="middle" fill={ED.inkFaint} fontSize={10} transform={'rotate(-90,14,' + (padT + cH / 2) + ')'}>
        fold-in floor N_fold(xi_true)
      </text>
    </svg>
  );
}

function GapChart() {
  const svgW = 680;
  const padL = 66;
  const padR = 24;
  const padT = 24;
  const padB = 44;
  const cW = svgW - padL - padR;
  const cH = 200;
  const svgH = padT + cH + padB;

  const xMin = 80;
  const xMax = 420;
  const yMin = 0;
  const yMax = 300;

  const xS = (xi) => padL + ((xi - xMin) / (xMax - xMin)) * cW;
  const yS = (g) => padT + cH * (1 - (g - yMin) / (yMax - yMin));

  const path = IMP3695_RUNG_LADDER.map((r, i) => (i === 0 ? 'M' : 'L') + xS(r.xiTrue).toFixed(1) + ',' + yS(r.gapBelowGeneric).toFixed(1)).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill={ED.paper} rx={2} />

      {[0, 50, 100, 150, 200, 250, 300].map((v) => (
        <g key={v}>
          <line x1={padL} y1={yS(v)} x2={padL + cW} y2={yS(v)} stroke={ED.ruleSoft} strokeWidth={0.7} />
          <text x={padL - 6} y={yS(v) + 3.5} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {v}
          </text>
        </g>
      ))}

      <path d={path} fill="none" stroke={GAP_COLOR} strokeWidth={2} />
      {IMP3695_RUNG_LADDER.map((r) => (
        <circle key={r.xiTrue} cx={xS(r.xiTrue)} cy={yS(r.gapBelowGeneric)} r={4} fill={GAP_COLOR} stroke="#3b1f00" strokeWidth={1} />
      ))}

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke={ED.rule} strokeWidth={1} />

      {IMP3695_RUNG_LADDER.map((r) => (
        <g key={'x' + r.xiTrue}>
          <line x1={xS(r.xiTrue)} y1={padT + cH} x2={xS(r.xiTrue)} y2={padT + cH + 5} stroke={ED.rule} strokeWidth={1} />
          <text x={xS(r.xiTrue)} y={padT + cH + 17} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
            {r.xiTrue}
          </text>
        </g>
      ))}
      <text x={padL + cW / 2} y={padT + cH + 36} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        source frequency xi_true
      </text>
      <text x={14} y={padT + cH / 2} textAnchor="middle" fill={ED.inkFaint} fontSize={10} transform={'rotate(-90,14,' + (padT + cH / 2) + ')'}>
        gap below 764
      </text>
    </svg>
  );
}

function PeakCountTable() {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', color: 'var(--ink-soft)' }}>
      <thead>
        <tr style={{ borderBottom: '1px solid var(--rule)' }}>
          <th style={{ textAlign: 'left', padding: '0.35rem 0.5rem' }}>xi_true</th>
          <th style={{ textAlign: 'right', padding: '0.35rem 0.5rem' }}>N_fold</th>
          <th style={{ textAlign: 'right', padding: '0.35rem 0.5rem' }}>N_below</th>
          <th style={{ textAlign: 'right', padding: '0.35rem 0.5rem' }}>peaks (below)</th>
          <th style={{ textAlign: 'right', padding: '0.35rem 0.5rem' }}>N_above</th>
          <th style={{ textAlign: 'right', padding: '0.35rem 0.5rem' }}>peaks (above)</th>
        </tr>
      </thead>
      <tbody>
        {IMP3695_RUNG_LADDER.map((r) => (
          <tr key={r.xiTrue} style={{ borderBottom: '1px solid var(--rule-soft)' }}>
            <td style={{ padding: '0.35rem 0.5rem' }}>{r.xiTrue}</td>
            <td style={{ textAlign: 'right', padding: '0.35rem 0.5rem' }}>{r.nFold.toFixed(2)}</td>
            <td style={{ textAlign: 'right', padding: '0.35rem 0.5rem', color: BELOW_COLOR }}>{r.nBelow}</td>
            <td style={{ textAlign: 'right', padding: '0.35rem 0.5rem', color: BELOW_COLOR }}>{IMP3695_PEAK_COUNT_BELOW}</td>
            <td style={{ textAlign: 'right', padding: '0.35rem 0.5rem', color: ABOVE_COLOR }}>{r.nAbove}</td>
            <td style={{ textAlign: 'right', padding: '0.35rem 0.5rem', color: ABOVE_COLOR }}>{IMP3695_PEAK_COUNT_ABOVE}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function Imp3695FeatureFoldinFloorLadderViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 940, margin: '0 auto' }}>
      <PageHeader title="Feature-Specific Fold-In Floor Ladder (imp-3666)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 760 }}>
        The imp-3647 feature-specific fold-in floor N_fold(xi_true) = (xi_max + xi_true) U/(2 pi)
        MAPPED across a ladder of planted sources xi_true in {'{'}100, 150, ..., {IMP3695_XI_MAX}{'}'}.
        The floor is a LINE with slope U/(2 pi) = 3/pi and intercept xi_max U/(2 pi) = 1200/pi,
        equally spaced by 150/pi ~ {IMP3695_STEP_INCREMENT_EXACT.toFixed(2)} per 50-unit step. The
        top rung xi_true = xi_max lands EXACTLY on the generic imp-3582 worst-case floor 2400/pi ~
        {' '}
        {IMP3695_N_REPLICA_GENERIC_EXACT.toFixed(2)} (764 rounded) -- the generic floor is the
        xi_true = xi_max endpoint of this feature line, not a separate constant.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        Fold-in floor N_fold(xi_true), linear across the ladder, meeting the generic 764 ceiling at xi_true=400
      </p>
      <FoldInFloorLineChart />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', margin: '1.75rem 0 0.5rem' }}>
        gap(xi_true) = (400 - xi_true) 3/pi below the generic floor, closing linearly to 0 at the top rung
      </p>
      <GapChart />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', margin: '1.75rem 0 0.5rem' }}>
        Measured in-band comb-peak count flip: 2 peaks at N_below (replica folded in), 1 peak at N_above (replica folded out)
      </p>
      <PeakCountTable />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the charts:</strong> every rung's
        fold-in floor sits strictly below the generic 764 ceiling except the top rung
        xi_true = 400, where the gap closes to exactly 0 -- the generic worst-case
        floor is the loosest-source endpoint of this feature-specific line, not an
        independent constant. At every rung the bracketing grids N_below and N_above
        measure the discriminator flip directly: two equal-height in-band comb peaks
        below the floor (the folded replica ties the genuine peak), one peak above.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> measurement/certification
        only -- this MAPS the feature-specific fold-in floor line across planted synthetic
        sources and confirms the generic imp-3582 764 is its xi_true = xi_max endpoint. It
        does NOT give xi* or the sup a closed form (the imp-3470 stationarity equation stays
        transcendental) and does not extend the finite-domain (0, 400] measurement of |P1|.
        RH-equivalent, necessary-but-not-sufficient; the imp-3066 K_a &ge; 0 positivity remains
        the lone obstruction, untouched.
      </div>

      <div style={{ marginTop: '1rem', fontSize: '0.85rem', color: 'var(--ink-faint)' }}>
        <strong>Related:</strong>{' '}
        <Link to="/viz-imp3613-replica-fold-in-geometry" style={{ color: 'var(--series-5)' }}>
          Aliasing Fold-In Geometry (imp-3582 / imp-3613)
        </Link>
      </div>
    </div>
  );
}
