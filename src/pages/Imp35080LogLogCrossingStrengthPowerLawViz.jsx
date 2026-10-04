import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP34925_EFLOW_CROSSING_STRENGTH_CMB_FUNCTIONAL_FORM as D25 } from '../data/imp-34925-eflow-crossing-strength-cmb-functional-form.js';
import { IMP34950_EFLOW_CROSSING_STRENGTH_CMB_EXPONENT_STRUCTURAL as D50 } from '../data/imp-34950-eflow-crossing-strength-cmb-exponent-structural.js';
import { ED } from '../styles/tokens.js';

// Renders the imp-34925 21-point C_mb grid and the imp-34950 pinned-exponent CI + F2 local-slope
// drift band verbatim (no new computation): log10(s*) vs log10(C_mb), overlaying the fitted power
// law and the two clean rationals 3/2 and 8/5 for visual comparison.
const GRID = D25.grid; // [{C_mb, s_star, ...}], 21 points over [0.5,1]
const K = D25.fits.power_law_pinned.K; // s*(1)
const P_PINNED = D50.exponent.pinned.p; // ~1.5493
const CI_LO = D50.exponent.pinned.ci95_lo;
const CI_HI = D50.exponent.pinned.ci95_hi;
const LS_MIN = D50.powerLawConstancy.local_loglog_slope_min; // ~1.528
const LS_MAX = D50.powerLawConstancy.local_loglog_slope_max; // ~1.562
const RAT_1P5 = 1.5;
const RAT_1P6 = 1.6;

const log10 = (v) => Math.log(v) / Math.LN10;
const C_LO = GRID[GRID.length - 1].C_mb; // 0.5
const C_HI = GRID[0].C_mb; // 1.0
const LOG_C_LO = log10(C_LO);
const LOG_C_HI = log10(C_HI);
const LOG_K = log10(K);

// straight lines in log-log space anchored at the same point (C_mb=1, s*(1)); slope = exponent.
function loglogLine(slope) {
  return [
    { lc: LOG_C_LO, ls: LOG_K + slope * LOG_C_LO },
    { lc: LOG_C_HI, ls: LOG_K + slope * LOG_C_HI },
  ];
}
const FIT_LINE = loglogLine(P_PINNED);
const RAT_1P5_LINE = loglogLine(RAT_1P5);
const RAT_1P6_LINE = loglogLine(RAT_1P6);
const POINTS = GRID.map((g) => ({ lc: log10(g.C_mb), ls: log10(g.s_star) }));

function LogLogChart() {
  const svgW = 720;
  const svgH = 320;
  const padL = 60;
  const padR = 20;
  const padT = 20;
  const padB = 44;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const allLs = [...POINTS.map((p) => p.ls), ...RAT_1P5_LINE.map((p) => p.ls), ...RAT_1P6_LINE.map((p) => p.ls)];
  const yMin = Math.min(...allLs) - 0.01;
  const yMax = Math.max(...allLs) + 0.01;
  const xAt = (lc) => padL + ((lc - LOG_C_LO) / (LOG_C_HI - LOG_C_LO)) * cW;
  const yAt = (ls) => padT + cH - ((ls - yMin) / (yMax - yMin)) * cH;

  const pathOf = (pts) => pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${xAt(p.lc)},${yAt(p.ls)}`).join(' ');
  const xTicks = [0.5, 0.6, 0.7, 0.8, 0.9, 1.0];
  const yTicks = [yMin, (yMin + yMax) / 2, yMax];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      {yTicks.map((t) => (
        <g key={t}>
          <line x1={padL - 4} y1={yAt(t)} x2={padL} y2={yAt(t)} stroke={ED.rule} strokeWidth={1} />
          <text x={padL - 8} y={yAt(t) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {t.toFixed(3)}
          </text>
        </g>
      ))}
      {xTicks.map((c) => (
        <g key={c}>
          <line x1={xAt(log10(c))} y1={padT + cH} x2={xAt(log10(c))} y2={padT + cH + 4} stroke={ED.rule} strokeWidth={1} />
          <text x={xAt(log10(c))} y={padT + cH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
            {c.toFixed(2)}
          </text>
        </g>
      ))}

      <path d={pathOf(RAT_1P6_LINE)} fill="none" stroke={ED.series2} strokeWidth={1.3} strokeDasharray="2 3" />
      <path d={pathOf(RAT_1P5_LINE)} fill="none" stroke={ED.rule} strokeWidth={1.3} strokeDasharray="2 3" />
      <path d={pathOf(FIT_LINE)} fill="none" stroke={ED.series3} strokeWidth={2} />
      {POINTS.map((p, i) => (
        <circle key={GRID[i].C_mb} cx={xAt(p.lc)} cy={yAt(p.ls)} r={2.8} fill={ED.series1} stroke={ED.paper} strokeWidth={0.5} />
      ))}

      <text x={padL + 6} y={padT + 12} fill={ED.series3} fontSize={9.5} fontWeight={700}>
        fitted power law, p = {P_PINNED.toFixed(4)} (95% CI [{CI_LO.toFixed(4)}, {CI_HI.toFixed(4)}])
      </text>
      <text x={padL + 6} y={padT + 26} fill={ED.inkFaint} fontSize={9.5} fontWeight={700}>
        slope 3/2 = 1.5 (clean rational, for comparison)
      </text>
      <text x={padL + 6} y={padT + 40} fill={ED.series2} fontSize={9.5} fontWeight={700}>
        slope 8/5 = 1.6 (clean rational, for comparison)
      </text>
      <text x={padL + cW / 2} y={svgH - 6} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        log10(C_mb) vs log10(s*) -- 21-point grid (blue), all reference lines anchored at C_mb=1
      </text>
    </svg>
  );
}

// F2 local-slope drift band [1.528, 1.562]: where the pinned exponent and the two clean
// rationals sit relative to the measured near-constant local log-log slope.
function SlopeDriftBand() {
  const svgW = 720;
  const svgH = 150;
  const padL = 40;
  const padR = 40;
  const padT = 26;
  const cW = svgW - padL - padR;
  const axisY = padT + 40;

  const xMin = 1.4;
  const xMax = 1.7;
  const xAt = (v) => padL + ((v - xMin) / (xMax - xMin)) * cW;

  const marks = [
    { v: RAT_1P5, label: '3/2', color: ED.inkFaint, y: 1 },
    { v: P_PINNED, label: `p = ${P_PINNED.toFixed(4)}`, color: ED.series1, y: -1 },
    { v: RAT_1P6, label: '8/5', color: ED.series2, y: 1 },
  ];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={axisY} x2={padL + cW} y2={axisY} stroke={ED.rule} strokeWidth={1.5} />
      {[1.4, 1.45, 1.5, 1.55, 1.6, 1.65, 1.7].map((t) => (
        <g key={t}>
          <line x1={xAt(t)} y1={axisY - 4} x2={xAt(t)} y2={axisY + 4} stroke={ED.rule} strokeWidth={1} />
          <text x={xAt(t)} y={axisY + 18} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
            {t.toFixed(2)}
          </text>
        </g>
      ))}

      {/* F2 local log-log slope drift band [LS_MIN, LS_MAX] */}
      <rect x={xAt(LS_MIN)} y={axisY - 12} width={xAt(LS_MAX) - xAt(LS_MIN)} height={24} fill={ED.series3} opacity={0.22} />
      <text x={(xAt(LS_MIN) + xAt(LS_MAX)) / 2} y={axisY - 16} textAnchor="middle" fill={ED.series3} fontSize={9}>
        F2 local log-log slope band [{LS_MIN.toFixed(3)}, {LS_MAX.toFixed(3)}]
      </text>

      {marks.map((m) => (
        <g key={m.label}>
          <line x1={xAt(m.v)} y1={axisY} x2={xAt(m.v)} y2={axisY + m.y * 22} stroke={m.color} strokeWidth={1.5} />
          <circle cx={xAt(m.v)} cy={axisY} r={4} fill={m.color} stroke={ED.paper} strokeWidth={1} />
          <text x={xAt(m.v)} y={axisY + m.y * 22 + (m.y > 0 ? 12 : -8)} textAnchor="middle" fill={m.color} fontSize={9.5} fontWeight={700}>
            {m.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

export default function Imp35080LogLogCrossingStrengthPowerLawViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="E_flow Crossing-Strength Power Law, Log-Log View (imp-35080 / imp-34950)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        The imp-34925 measured crossing strength s*(C_mb) on the 21-point grid over [0.5,1], plotted
        on log-log axes. A genuine power law appears as a straight line here; the fitted exponent
        p&nbsp;=&nbsp;{P_PINNED.toFixed(4)} (imp-34950 95% CI [{CI_LO.toFixed(4)}, {CI_HI.toFixed(4)}])
        tracks the data closely while the clean rationals 3/2 and 8/5 visibly diverge toward C_mb&nbsp;=&nbsp;0.5.
      </p>
      <LogLogChart />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', margin: '1.25rem 0 0.5rem' }}>
        imp-34950 F2: the local log-log slope d ln s*/d ln C_mb stays inside a narrow{' '}
        [{LS_MIN.toFixed(3)}, {LS_MAX.toFixed(3)}] band across the whole grid -- the signature of a
        genuine power law. 3/2 sits just below the band and 8/5 sits well above it; the pinned exponent
        sits inside.
      </p>
      <SlopeDriftBand />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> Viz-only page rendering the
        imp-34925 grid and imp-34950 fit literals verbatim (no new computation). Measurement only on
        the inherited imp-3220/imp-3406 surrogate; this SWEEPS C_mb as a free knob and does NOT
        discharge the GUE conditional (C_mb GUE-conditional per imp-486); changes no bound;
        establishes no operator positivity; imp-3066 K_a&nbsp;&ge;&nbsp;0 untouched; far-tail
        exponent stays 1/2 (imp-3463); no RH verdict, NO QED.
      </div>
    </div>
  );
}
