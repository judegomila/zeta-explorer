import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP34925_EFLOW_CROSSING_STRENGTH_CMB_FUNCTIONAL_FORM as D } from '../data/imp-34925-eflow-crossing-strength-cmb-functional-form.js';
import { ED } from '../styles/tokens.js';

// Renders the imp-34925 grid + fit literals verbatim (no new computation): the measured s*(C_mb)
// points, the winning power law s*(1)*C_mb^p, and the imp-34907 reported linear fit a + b*C_mb.
const GRID = D.grid; // [{C_mb, s_star, power_law_pred, pinned_ratio}], 21 points over [0.5,1]
const K = D.fits.power_law_pinned.K;
const P = D.fits.power_law_pinned.p;
const LIN_A = D.fits.linear_reported.a;
const LIN_B = D.fits.linear_reported.b;

const powerPred = (c) => K * Math.pow(c, P);
const linearPred = (c) => LIN_A + LIN_B * c;

const C_LO = GRID[GRID.length - 1].C_mb; // 0.5
const C_HI = GRID[0].C_mb; // 1.0
const CURVE_POINTS = 100;
const CURVE = [];
for (let i = 0; i <= CURVE_POINTS; i++) {
  const c = C_LO + ((C_HI - C_LO) * i) / CURVE_POINTS;
  CURVE.push({ c, power: powerPred(c), linear: linearPred(c) });
}

// s*(C_mb) measured points vs the power-law and linear-fit curves.
function CrossingStrengthChart() {
  const svgW = 720;
  const svgH = 280;
  const padL = 60;
  const padR = 20;
  const padT = 20;
  const padB = 40;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const yMin = Math.min(...GRID.map((g) => g.s_star)) * 0.95;
  const yMax = Math.max(...GRID.map((g) => g.s_star)) * 1.05;
  const xAt = (c) => padL + ((c - C_LO) / (C_HI - C_LO)) * cW;
  const yAt = (v) => padT + cH - ((v - yMin) / (yMax - yMin)) * cH;

  const powerPath = CURVE.map((p, i) => `${i === 0 ? 'M' : 'L'} ${xAt(p.c)},${yAt(p.power)}`).join(' ');
  const linearPath = CURVE.map((p, i) => `${i === 0 ? 'M' : 'L'} ${xAt(p.c)},${yAt(p.linear)}`).join(' ');
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
      {[0.5, 0.75, 1.0].map((c) => (
        <text key={c} x={xAt(c)} y={padT + cH + 14} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
          {c.toFixed(2)}
        </text>
      ))}
      <path d={linearPath} fill="none" stroke={ED.series2} strokeWidth={1.5} strokeDasharray="5 3" />
      <path d={powerPath} fill="none" stroke={ED.series3} strokeWidth={2} />
      {GRID.map((g) => (
        <circle key={g.C_mb} cx={xAt(g.C_mb)} cy={yAt(g.s_star)} r={2.5} fill={ED.series1} stroke={ED.paper} strokeWidth={0.5} />
      ))}
      <text x={padL + 6} y={padT + 12} fill={ED.series3} fontSize={9.5} fontWeight={700}>
        power law s*(1)&middot;C_mb^p (winner, RMS {D.fits.power_law_pinned.rms})
      </text>
      <text x={padL + 6} y={padT + 26} fill={ED.series2} fontSize={9.5} fontWeight={700}>
        linear a+b&middot;C_mb (imp-34907 reported, RMS {D.fits.linear_reported.rms})
      </text>
      <text x={padL + cW / 2} y={svgH - 6} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        C_mb (x-axis) vs measured s* (blue points) over [0.5,1]
      </text>
    </svg>
  );
}

// Residuals: measured s* minus each fit's prediction, at the 21 grid points.
function ResidualChart() {
  const svgW = 720;
  const svgH = 240;
  const padL = 60;
  const padR = 20;
  const padT = 20;
  const padB = 40;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const powerResid = GRID.map((g) => g.s_star - g.power_law_pred);
  const linearResid = GRID.map((g) => g.s_star - linearPred(g.C_mb));
  const allResid = [...powerResid, ...linearResid];
  const yMax = Math.max(...allResid.map(Math.abs)) * 1.15;
  const yMin = -yMax;
  const xAt = (c) => padL + ((c - C_LO) / (C_HI - C_LO)) * cW;
  const yAt = (v) => padT + cH - ((v - yMin) / (yMax - yMin)) * cH;

  const powerPath = GRID.map((g, i) => `${i === 0 ? 'M' : 'L'} ${xAt(g.C_mb)},${yAt(powerResid[i])}`).join(' ');
  const linearPath = GRID.map((g, i) => `${i === 0 ? 'M' : 'L'} ${xAt(g.C_mb)},${yAt(linearResid[i])}`).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={yAt(0)} x2={padL + cW} y2={yAt(0)} stroke={ED.rule} strokeWidth={1} strokeDasharray="3 3" />
      {[yMin, yMin / 2, 0, yMax / 2, yMax].map((t) => (
        <g key={t}>
          <line x1={padL - 4} y1={yAt(t)} x2={padL} y2={yAt(t)} stroke={ED.rule} strokeWidth={1} />
          <text x={padL - 8} y={yAt(t) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {t.toFixed(3)}
          </text>
        </g>
      ))}
      <path d={linearPath} fill="none" stroke={ED.series2} strokeWidth={1.5} strokeDasharray="5 3" />
      <path d={powerPath} fill="none" stroke={ED.series3} strokeWidth={2} />
      <text x={padL + 6} y={padT + 12} fill={ED.series3} fontSize={9.5} fontWeight={700}>
        power-law residual (max {D.fits.power_law_pinned.max_resid})
      </text>
      <text x={padL + 6} y={padT + 26} fill={ED.series2} fontSize={9.5} fontWeight={700}>
        linear-fit residual (max {D.fits.linear_reported.max_resid})
      </text>
      <text x={padL + cW / 2} y={svgH - 6} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        C_mb (x-axis) vs measured-minus-predicted residual (power law ~12x tighter throughout)
      </text>
    </svg>
  );
}

export default function Imp34963EflowCrossingStrengthPowerLawViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="E_flow Crossing-Strength Power Law (imp-34963 / imp-34925)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        {D.question}
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        The measured E_flow knee-vs-inflection crossing strength s* over the 21-point C_mb grid on
        [0.5,1], with the winning power law s* = s*(1)&middot;C_mb^p (p&nbsp;&asymp;&nbsp;{D.fits.power_law_pinned.p})
        overlaid against the imp-34907 reported linear fit.
      </p>
      <CrossingStrengthChart />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', margin: '1.25rem 0 0.5rem' }}>
        Residuals (measured minus predicted) at each grid point: the power law stays within{' '}
        {D.fits.power_law_pinned.max_resid} throughout, versus the linear fit&apos;s{' '}
        {D.fits.linear_reported.max_resid} maximum -- about 12x looser at equal parameter count.
      </p>
      <ResidualChart />

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
        imp-34925 grid and fit literals verbatim (no new computation). Measurement only on the
        inherited imp-3220/imp-3406 surrogate; this SWEEPS C_mb as a free knob and does NOT discharge
        the GUE conditional (C_mb GUE-conditional per imp-486); the power-law origin argument is a
        hint, not a derivation. C_C 1/8 ansatz (imp-2642/imp-2643) UNTOUCHED; imp-3066 K_a&ge;0
        untouched; far-tail exponent stays 1/2 (imp-3463); changes no bound; establishes no operator
        positivity; no RH verdict, NO QED.
      </div>
    </div>
  );
}
