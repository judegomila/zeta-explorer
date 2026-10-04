// Path1FloorExtensionViz.jsx -- imp-3265
// Visualizes the PATH-1 empirical floor extension (870 -> 1,000,000):
// plots tau_c_est(N) on a log-log scale showing the E2 predicate holds
// unconditionally across the full swept range, and marks the GUE-conditional
// analytic-chain frontier (C_mb <= 1) as the active research gap.
import React from 'react';
import { EMPIRICAL_M_SWEEP_EXTENDED_SUMMARY as SWEEP } from '../data/empirical-m-sweep-extended-summary.js';
import { ED, alpha } from '../styles/tokens.js';

const W = 580, H = 230;
const ML = 50, MR = 96, MT = 22, MB = 36;
const PW = W - ML - MR, PH = H - MT - MB;

const LOG_N_MIN = Math.log10(2), LOG_N_MAX = Math.log10(1e6);
const TAU_MAX_LOG = 1.2, TAU_MIN_LOG = -5.8;

function xS(N) {
  return ML + ((Math.log10(N) - LOG_N_MIN) / (LOG_N_MAX - LOG_N_MIN)) * PW;
}
function yS(tau) {
  const l = Math.log10(tau);
  return MT + ((TAU_MAX_LOG - l) / (TAU_MAX_LOG - TAU_MIN_LOG)) * PH;
}

const X_TICKS = [2, 10, 100, 1000, 10000, 100000, 1000000];
const X_LABELS = { 2: '2', 10: '10', 100: '10²', 1000: '10³', 10000: '10⁴', 100000: '10⁵', 1000000: '10⁶' };
const Y_TICKS = [10, 1, 0.1, 0.01, 0.001, 0.0001, 0.000001];
const Y_LABELS = { 10: '10', 1: '1', 0.1: '0.1', 0.01: '0.01', 0.001: '10⁻³', 0.0001: '10⁻⁴', 0.000001: '10⁻⁶' };

export default function Path1FloorExtensionViz() {
  const samples = SWEEP.samples.filter(s => s.tauC_est != null && s.tauC_est > 0);
  const xOld = xS(SWEEP.previousEmpiricalFloor.N_max);
  const xNew = xS(SWEEP.newEmpiricalFloor.N_max);

  const pts = samples
    .map(s => `${xS(s.N).toFixed(1)},${yS(s.tauC_est).toFixed(1)}`)
    .join(' ');

  return (
    <div style={{ margin: '16px 0' }}>
      <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--ink-faint)', marginBottom: 4 }}>
        τ_c_est(N) = H_N² / (8 ρ_{'{J*(N)}'}²)  &nbsp;—&nbsp; log-log scale; E2 predicate: non-increasing ✓
      </div>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`}
        style={{ fontFamily: 'var(--font-mono)', overflow: 'visible', display: 'block' }}>

        {/* shaded regions */}
        <rect x={ML} y={MT} width={xOld - ML} height={PH}
          fill={alpha(ED.series2, 0.07)} />
        <rect x={xOld} y={MT} width={xNew - xOld} height={PH}
          fill={alpha(ED.series3, 0.07)} />
        <rect x={xNew} y={MT} width={MR} height={PH}
          fill={alpha(ED.brassDeco, 0.1)} />

        {/* grid */}
        {X_TICKS.map(N => (
          <line key={N} x1={xS(N)} x2={xS(N)} y1={MT} y2={MT + PH}
            stroke={ED.ruleSoft} strokeWidth={1} />
        ))}
        {Y_TICKS.map(tau => {
          const y = yS(tau);
          return (y >= MT && y <= MT + PH)
            ? <line key={tau} x1={ML} x2={ML + PW} y1={y} y2={y} stroke={ED.ruleSoft} strokeWidth={1} />
            : null;
        })}

        {/* old floor */}
        <line x1={xOld} x2={xOld} y1={MT} y2={MT + PH}
          stroke={ED.series2} strokeWidth={1.5} strokeDasharray="4 3" />
        <text x={xOld - 3} y={MT + 12} textAnchor="end" fill={ED.series2} fontSize={8.5}>N=870</text>

        {/* new floor */}
        <line x1={xNew} x2={xNew} y1={MT} y2={MT + PH}
          stroke={ED.series3} strokeWidth={1.5} />
        <text x={xNew - 3} y={MT + 12} textAnchor="end" fill={ED.series3} fontSize={8.5}>N=10⁶</text>

        {/* plot border */}
        <rect x={ML} y={MT} width={PW} height={PH}
          fill="none" stroke={ED.rule} strokeWidth={1} />

        {/* tau_c_est line */}
        <polyline points={pts} fill="none" stroke={ED.series1} strokeWidth={2}
          strokeLinejoin="round" />

        {/* data dots */}
        {samples.map(s => {
          const cx = xS(s.N), cy = yS(s.tauC_est);
          return (cy >= MT && cy <= MT + PH)
            ? <circle key={s.N} cx={cx} cy={cy} r={2.5}
                fill={ED.series1} stroke={ED.paper} strokeWidth={0.8} />
            : null;
        })}

        {/* x-axis */}
        {X_TICKS.map(N => (
          <g key={N}>
            <line x1={xS(N)} x2={xS(N)} y1={MT + PH} y2={MT + PH + 4} stroke={ED.rule} strokeWidth={1} />
            <text x={xS(N)} y={MT + PH + 14} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
              {X_LABELS[N]}
            </text>
          </g>
        ))}
        <text x={ML + PW / 2} y={H - 2} textAnchor="middle" fill={ED.inkSoft} fontSize={10}>N</text>

        {/* y-axis */}
        {Y_TICKS.map(tau => {
          const y = yS(tau);
          if (y < MT - 1 || y > MT + PH + 1) return null;
          return (
            <g key={tau}>
              <line x1={ML - 4} x2={ML} y1={y} y2={y} stroke={ED.rule} strokeWidth={1} />
              <text x={ML - 6} y={y + 3} textAnchor="end" fill={ED.inkFaint} fontSize={8}>
                {Y_LABELS[tau]}
              </text>
            </g>
          );
        })}
        <text transform={`translate(9,${MT + PH / 2}) rotate(-90)`}
          textAnchor="middle" fill={ED.inkSoft} fontSize={9}>τ_c_est</text>

        {/* region labels */}
        <text x={ML + (xOld - ML) / 2} y={MT + PH - 6} textAnchor="middle" fill={ED.series2} fontSize={8}>
          prev floor
        </text>
        <text x={(xOld + xNew) / 2} y={MT + PH - 6} textAnchor="middle" fill={ED.series3} fontSize={8}>
          new empirical floor
        </text>
        <text x={(xOld + xNew) / 2} y={MT + PH - 16} textAnchor="middle" fill={ED.series3} fontSize={8}>
          (unconditional)
        </text>

        {/* GUE gap annotation */}
        <text x={xNew + 5} y={MT + PH / 2 - 16} textAnchor="start" fill={ED.brass} fontSize={8.5}>GUE-cond.</text>
        <text x={xNew + 5} y={MT + PH / 2 - 4}  textAnchor="start" fill={ED.brass} fontSize={8.5}>analytic</text>
        <text x={xNew + 5} y={MT + PH / 2 + 8}  textAnchor="start" fill={ED.brass} fontSize={8.5}>chain</text>
        <text x={xNew + 5} y={MT + PH / 2 + 20} textAnchor="start" fill={ED.brass} fontSize={8.5}>(C_mb≤1)</text>
        <text x={xNew + 5} y={MT + PH / 2 + 36} textAnchor="start" fill={ED.inkFaint} fontSize={7.5}>← active</text>
        <text x={xNew + 5} y={MT + PH / 2 + 46} textAnchor="start" fill={ED.inkFaint} fontSize={7.5}>frontier</text>

        {/* E1/E2 status badge */}
        <text x={xNew - 6} y={MT + 24} textAnchor="end" fill={ED.series3} fontSize={8.5}>
          E1 ✓  E2 ✓  (0 violations)
        </text>
      </svg>

      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', fontSize: 11,
        fontFamily: 'var(--font-mono)', color: 'var(--ink-soft)', marginTop: 6 }}>
        <span><span style={{ color: 'var(--series-2)' }}>▌</span> prev floor N≤{SWEEP.previousEmpiricalFloor.N_max}</span>
        <span><span style={{ color: 'var(--series-3)' }}>▌</span> new empirical floor N≤{SWEEP.newEmpiricalFloor.N_max.toLocaleString()} — unconditional, no C_mb, no GUE</span>
        <span><span style={{ color: 'var(--brass)' }}>▌</span> GUE-conditional analytic chain (C_mb≤1 required)</span>
      </div>
    </div>
  );
}
