import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP96520_OFFSET_LADDER_ROWS,
  IMP96520_SLOPES,
} from '../data/imp-96520-offset-drift-viz-data.js';
import { ED } from '../styles/tokens.js';

// Renders the imp-96467 measured-vs-analytic offset-drift comparison verbatim (no new computation):
// the imp-96431 measured offset (blue points) against the analytic leading L-drift prediction (green
// curve) across the crossover ladder, plus a slope-magnitude bar pair with the ~17-21% residual
// sub-leading share shaded as the gap the L-drift term alone does not account for.
const ROWS = IMP96520_OFFSET_LADDER_ROWS;
const MEAS_SLOPE = IMP96520_SLOPES.measuredPerDecade; // ~-0.00143
const ANA_SLOPE = IMP96520_SLOPES.analyticPerDecade; // ~-0.00173
const RATIO = IMP96520_SLOPES.ratioPredictedOverMeasured; // ~1.21
const RESIDUAL_FRACTION = IMP96520_SLOPES.residualSubleadingFraction; // ~0.174

function OffsetLadderChart() {
  const svgW = 720;
  const svgH = 320;
  const padL = 60;
  const padR = 20;
  const padT = 20;
  const padB = 44;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const xs = ROWS.map((r) => r.crossoverLog10);
  const xMin = Math.min(...xs);
  const xMax = Math.max(...xs);
  const ys = ROWS.flatMap((r) => [r.measuredOffsetLog10, r.analyticOffsetLog10]);
  const yMin = Math.min(...ys) - 0.0006;
  const yMax = Math.max(...ys) + 0.0006;

  const xAt = (x) => padL + ((x - xMin) / (xMax - xMin)) * cW;
  const yAt = (y) => padT + cH - ((y - yMin) / (yMax - yMin)) * cH;

  const measPath = ROWS.map((r, i) => `${i === 0 ? 'M' : 'L'} ${xAt(r.crossoverLog10)},${yAt(r.measuredOffsetLog10)}`).join(' ');
  const anaPath = ROWS.map((r, i) => `${i === 0 ? 'M' : 'L'} ${xAt(r.crossoverLog10)},${yAt(r.analyticOffsetLog10)}`).join(' ');

  const yTicks = [yMin, (yMin + yMax) / 2, yMax];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      {yTicks.map((t) => (
        <g key={t}>
          <line x1={padL - 4} y1={yAt(t)} x2={padL} y2={yAt(t)} stroke={ED.rule} strokeWidth={1} />
          <text x={padL - 8} y={yAt(t) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {t.toFixed(4)}
          </text>
        </g>
      ))}
      {xs.map((x) => (
        <g key={x}>
          <line x1={xAt(x)} y1={padT + cH} x2={xAt(x)} y2={padT + cH + 4} stroke={ED.rule} strokeWidth={1} />
        </g>
      ))}
      <text x={padL} y={padT + cH + 30} textAnchor="start" fill={ED.inkFaint} fontSize={9}>
        {xMin.toFixed(2)}
      </text>
      <text x={padL + cW} y={padT + cH + 30} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
        {xMax.toFixed(2)}
      </text>

      <path d={anaPath} fill="none" stroke={ED.series3} strokeWidth={2} />
      <path d={measPath} fill="none" stroke={ED.series1} strokeWidth={1.3} strokeDasharray="3 3" />
      {ROWS.map((r) => (
        <circle key={r.crossoverLog10} cx={xAt(r.crossoverLog10)} cy={yAt(r.measuredOffsetLog10)} r={2.8} fill={ED.series1} stroke={ED.paper} strokeWidth={0.5} />
      ))}

      <text x={padL + 6} y={padT + 12} fill={ED.series3} fontSize={9.5} fontWeight={700}>
        analytic L-drift offset(t) = 8t/((t-1)^3 ln10) (fitted slope {ANA_SLOPE.toFixed(5)}/decade)
      </text>
      <text x={padL + 6} y={padT + 26} fill={ED.series1} fontSize={9.5} fontWeight={700}>
        imp-96431 measured offset (fitted slope {MEAS_SLOPE.toFixed(5)}/decade)
      </text>
      <text x={padL + cW / 2} y={svgH - 6} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        (sigma-inflection minus crossover) offset vs log10(N_cross) across the imp-96431 ladder
      </text>
    </svg>
  );
}

// Slope-magnitude bar pair with the residual sub-leading share shaded as the gap between them.
function SlopeResidualBars() {
  const svgW = 720;
  const svgH = 220;
  const padL = 70;
  const padR = 40;
  const padT = 24;
  const padB = 50;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const measAbs = Math.abs(MEAS_SLOPE);
  const anaAbs = Math.abs(ANA_SLOPE);
  const yMax = anaAbs * 1.15;
  const yAt = (v) => padT + cH - (v / yMax) * cH;
  const barW = 120;
  const gap = 160;
  const xMeas = padL + 60;
  const xAna = xMeas + gap;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      {[0, yMax / 2, yMax].map((t) => (
        <g key={t}>
          <line x1={padL - 4} y1={yAt(t)} x2={padL} y2={yAt(t)} stroke={ED.rule} strokeWidth={1} />
          <text x={padL - 8} y={yAt(t) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {t.toFixed(5)}
          </text>
        </g>
      ))}

      {/* measured bar */}
      <rect x={xMeas} y={yAt(measAbs)} width={barW} height={cH - (yAt(measAbs) - padT)} fill={ED.series1} opacity={0.85} />
      <text x={xMeas + barW / 2} y={padT + cH + 18} textAnchor="middle" fill={ED.series1} fontSize={9.5} fontWeight={700}>
        measured
      </text>
      <text x={xMeas + barW / 2} y={padT + cH + 31} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
        (imp-96431)
      </text>

      {/* analytic bar, with the residual (measured-to-analytic gap) shaded on top of the measured height */}
      <rect x={xAna} y={yAt(anaAbs)} width={barW} height={cH - (yAt(anaAbs) - padT)} fill={ED.series3} opacity={0.35} />
      <rect x={xAna} y={yAt(anaAbs)} width={barW} height={yAt(measAbs) - yAt(anaAbs)} fill={ED.brassDeco} opacity={0.55} />
      <rect x={xAna} y={yAt(measAbs)} width={barW} height={cH - (yAt(measAbs) - padT)} fill={ED.series3} opacity={0.85} />
      <text x={xAna + barW / 2} y={padT + cH + 18} textAnchor="middle" fill={ED.series3} fontSize={9.5} fontWeight={700}>
        analytic L-drift
      </text>
      <text x={xAna + barW / 2} y={padT + cH + 31} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
        (imp-96467)
      </text>

      <text
        x={xAna + barW + 14}
        y={(yAt(measAbs) + yAt(anaAbs)) / 2 + 4}
        textAnchor="start"
        fill={ED.brass}
        fontSize={9.5}
        fontWeight={700}
      >
        residual sub-leading
        <tspan x={xAna + barW + 14} dy="11">
          share ~{(RESIDUAL_FRACTION * 100).toFixed(1)}%
        </tspan>
      </text>
    </svg>
  );
}

export default function Imp96520OffsetDriftLdriftPredictionViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Offset-Drift L-Drift Prediction vs Measured (imp-96467 / imp-96431)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        The imp-96431 measured (sigma-inflection minus crossover) offset drift across the ~5.24-decade
        crossover ladder (dashed blue), against the imp-96467 analytic leading L(N)-drift prediction
        offset(t)&nbsp;=&nbsp;8t/((t-1)^3 ln10) (solid green). The analytic curve reproduces the sign
        and near-linearity of the measured drift and brackets its endpoints, but runs consistently above
        it.
      </p>
      <OffsetLadderChart />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', margin: '1.25rem 0 0.5rem' }}>
        Fitted slope magnitude: measured {Math.abs(MEAS_SLOPE).toFixed(5)}/decade vs analytic{' '}
        {Math.abs(ANA_SLOPE).toFixed(5)}/decade (ratio predicted/measured ~{RATIO.toFixed(2)}). The
        L-drift term is the dominant, correctly-signed driver but over-predicts the slope; the shaded
        band is the ~{(RESIDUAL_FRACTION * 100).toFixed(1)}% residual sub-leading share it does not
        account for.
      </p>
      <SlopeResidualBars />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> Viz-only page rendering the imp-96467
        fit literals verbatim (no new computation). Derivation + measurement only on the inherited
        imp-3220/imp-3406 extrapolation; the C_mb GUE-conditional per imp-486 is untouched; changes no
        bound; establishes no operator positivity; imp-3066 K_a&nbsp;&ge;&nbsp;0 untouched; no RH
        verdict, NO QED.
      </div>
    </div>
  );
}
