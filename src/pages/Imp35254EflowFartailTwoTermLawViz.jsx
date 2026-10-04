import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP35217_EFLOW_FARTAIL_EXPONENT_X2_CORRECTION } from '../data/imp-35217-eflow-fartail-exponent-x2-correction.js';
import { ED, TINT } from '../styles/tokens.js';

// Baked literals imported verbatim from the imp-35217 data module; no new
// computation is performed here (viz/UX only).
const {
  ladder: LADDER,
  c2SignCrossover: CROSSOVER,
  topRung: TOP,
  deepRung: DEEP,
} = IMP35217_EFLOW_FARTAIL_EXPONENT_X2_CORRECTION;

const CROSSOVER_LOG10_N = Math.log10(CROSSOVER.N);

function TwoTermLawChart() {
  const svgW = 720;
  const padL = 60;
  const padR = 24;
  const padT = 50;
  const padB = 48;
  const plotW = svgW - padL - padR;
  const plotH = 300;
  const svgH = padT + plotH + padB;

  const xMin = 6;
  const xMax = 16;
  const yMin = -1.0;
  const yMax = -0.7;

  const xOf = (log10N) => padL + ((log10N - xMin) / (xMax - xMin)) * plotW;
  const yOf = (v) => padT + plotH - ((v - yMin) / (yMax - yMin)) * plotH;

  const xTicks = [6, 8, 10, 12, 14, 16];
  const yTicks = [-1.0, -0.95, -0.9, -0.85, -0.8, -0.75, -0.7];

  const leadPath = LADDER.map((r, i) => `${i === 0 ? 'M' : 'L'} ${xOf(r.logN / Math.LN10)} ${yOf(r.leadingExponent)}`).join(' ');
  const twoTermPath = LADDER.map((r, i) => `${i === 0 ? 'M' : 'L'} ${xOf(r.logN / Math.LN10)} ${yOf(r.twoTermExponent)}`).join(' ');

  const crossX = xOf(CROSSOVER_LOG10_N);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <text x={padL} y={padT - 30} fill={ED.inkSoft} fontSize={11} fontWeight={700}>
        imp-35217 E_flow far-tail exponent: leading vs two-term law vs imp-35135 measured
      </text>

      <rect x={padL} y={padT} width={crossX - padL} height={plotH} fill={TINT.terra} opacity={0.12} />
      <rect x={crossX} y={padT} width={padL + plotW - crossX} height={plotH} fill={TINT.green} opacity={0.14} />

      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />

      {xTicks.map((v) => (
        <g key={v}>
          <line x1={xOf(v)} y1={padT + plotH} x2={xOf(v)} y2={padT + plotH + 4} stroke={ED.rule} strokeWidth={1} />
          <text x={xOf(v)} y={padT + plotH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
            1e{v}
          </text>
        </g>
      ))}
      {yTicks.map((v) => (
        <g key={v}>
          <line x1={padL - 4} y1={yOf(v)} x2={padL + plotW} y2={yOf(v)} stroke={ED.ruleSoft} strokeWidth={1} />
          <text x={padL - 8} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {v.toFixed(2)}
          </text>
        </g>
      ))}

      <line
        x1={crossX}
        y1={padT}
        x2={crossX}
        y2={padT + plotH}
        stroke={ED.brassDeco}
        strokeWidth={1.5}
        strokeDasharray="5,4"
      />
      <text x={crossX} y={padT - 8} textAnchor="middle" fill={ED.brass} fontSize={9}>
        c2 sign-change, N~{CROSSOVER.N.toExponential(2)}
      </text>

      <path d={leadPath} fill="none" stroke={ED.series1} strokeWidth={2} />
      <path d={twoTermPath} fill="none" stroke={ED.series4} strokeWidth={2} />

      {[TOP, DEEP].map((r) => (
        <circle
          key={r.N}
          cx={xOf(Math.log10(r.N))}
          cy={yOf(r.measuredExpEflow)}
          r={4.5}
          fill={ED.series3}
          stroke="#166534"
          strokeWidth={1}
        />
      ))}

      <g>
        <line x1={padL + 4} y1={padT - 22} x2={padL + 20} y2={padT - 22} stroke={ED.series1} strokeWidth={2} />
        <text x={padL + 26} y={padT - 18} fill={ED.series1} fontSize={8.5}>
          leading: -1 + 3/log N
        </text>
        <line x1={padL + 190} y1={padT - 22} x2={padL + 206} y2={padT - 22} stroke={ED.series4} strokeWidth={2} />
        <text x={padL + 212} y={padT - 18} fill={ED.series4} fontSize={8.5}>
          two-term: + c2(x)/x^2
        </text>
        <circle cx={padL + 400} cy={padT - 22} r={4.5} fill={ED.series3} stroke="#166534" strokeWidth={1} />
        <text x={padL + 410} y={padT - 18} fill={ED.series3} fontSize={8.5}>
          imp-35135 measured
        </text>
      </g>
    </svg>
  );
}

export default function Imp35254EflowFartailTwoTermLawViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="E_flow Far-Tail Two-Term Exponent Law vs Measurement (imp-35254)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-35217 evaluated the imp-35198 named-but-unevaluated next-order coefficient
        c2(x) = 2 log x - 2 log(2 pi) - 2 in the two-term far-tail exponent law
        -1 + 3/log N + c2(x)/(log N)^2. The coefficient changes sign at N ~ 2.615e7
        (shaded red below, green above): below the crossover the two-term law moves
        FURTHER from the imp-35135 measured exponent (worsening the N = 1e6 residual
        0.0119 to 0.0141); above it, it only trims the gap (N = 1e16: 0.0044 to 0.0032).
      </p>

      <TwoTermLawChart />

      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '0.78rem',
          marginTop: '1.5rem',
        }}
      >
        <thead>
          <tr style={{ color: 'var(--ink-soft)', textAlign: 'left', borderBottom: '1px solid var(--rule)' }}>
            <th style={{ padding: '0.4rem 0.6rem' }}>N</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>leading (-1+3/x)</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>c2(x)</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>two-term</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>full surrogate</th>
          </tr>
        </thead>
        <tbody>
          {LADDER.map((r) => (
            <tr key={r.N} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.N.toExponential(0)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.leadingExponent.toFixed(4)}</td>
              <td
                style={{
                  padding: '0.4rem 0.6rem',
                  fontFamily: 'monospace',
                  color: r.c2Coefficient < 0 ? 'var(--series-2)' : 'var(--series-3)',
                }}
              >
                {r.c2Coefficient.toFixed(4)}
              </td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.twoTermExponent.toFixed(4)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.fullSurrogateExponent.toFixed(4)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.8rem', marginTop: '1rem' }}>
        At N = {TOP.N.toExponential(0)}: leading residual {TOP.leadResidual.toFixed(4)}, two-term residual{' '}
        {TOP.twoTermResidual.toFixed(4)} ({TOP.twoTermImprovesResidual ? 'improves' : 'WORSENS'}). At N ={' '}
        {DEEP.N.toExponential(0)}: leading residual {DEEP.leadResidual.toFixed(4)}, two-term residual{' '}
        {DEEP.twoTermResidual.toFixed(4)} ({DEEP.twoTermImprovesResidual ? 'improves' : 'worsens'}). The two-term
        law is the Taylor image of the exact surrogate (agrees to &lt;2e-4 across the ladder), so its residual
        against the measurement is the surrogate-vs-true-RvM-inverse gap, not a missing power of log N.
      </p>

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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> Viz-only page reusing the
        imp-35217 baked ladder/topRung/deepRung literals verbatim (no new computation).
        Derivation/measurement only on the inherited imp-3220/imp-3406 extrapolation, NOT
        rigorous; E_flow &gt; 0 strictness (imp-33848) untouched; C_mb GUE-conditional
        (imp-486) untouched; changes no bound; establishes no operator positivity; no RH
        verdict, NO QED.
      </div>
    </div>
  );
}
