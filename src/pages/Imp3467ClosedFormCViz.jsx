import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import IMP3467_TTILDE_CLOSED_FORM_C_INF_ASSEMBLY from '../data/imp-3467-Ttilde-closed-form-C-inf-assembly.js';
import { ED } from '../styles/tokens.js';

const CELLS = IMP3467_TTILDE_CLOSED_FORM_C_INF_ASSEMBLY.measured.cells;
const C_CLOSED_MEAN = IMP3467_TTILDE_CLOSED_FORM_C_INF_ASSEMBLY.measured.cClosedMean;
const C_INF_3346 = 0.1751;
const C_INF_3461 = 0.17512;

const U_MIN = 4;
const U_MAX = 20;

function CAssemblyChart() {
  const svgW = 620;
  const padL = 68;
  const padR = 24;
  const padT = 24;
  const padB = 44;
  const cW = svgW - padL - padR;
  const cH = 220;
  const svgH = padT + cH + padB;

  const yMin = 0.174;
  const yMax = 0.1755;

  const xS = (U) => padL + ((U - U_MIN) / (U_MAX - U_MIN)) * cW;
  const yS = (v) => padT + cH * (1 - (v - yMin) / (yMax - yMin));

  const closedPath = CELLS.map((c, i) => (i === 0 ? 'M' : 'L') + xS(c.U).toFixed(1) + ',' + yS(c.cClosed).toFixed(2)).join(' ');
  const directPath = CELLS.map((c, i) => (i === 0 ? 'M' : 'L') + xS(c.U).toFixed(1) + ',' + yS(c.cDirect).toFixed(2)).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill={ED.paper} rx={2} />

      {[0.174, 0.1745, 0.175, 0.1755].map((v) => (
        <g key={v}>
          <line x1={padL} y1={yS(v)} x2={padL + cW} y2={yS(v)} stroke={ED.ruleSoft} strokeWidth={0.7} />
          <text x={padL - 4} y={yS(v) + 3.5} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {v.toFixed(4)}
          </text>
        </g>
      ))}

      <line x1={padL} y1={yS(C_INF_3346)} x2={padL + cW} y2={yS(C_INF_3346)} stroke={ED.series5} strokeWidth={1} strokeDasharray="4 3" />
      <text x={padL + 4} y={yS(C_INF_3346) + 12} fill={ED.series5} fontSize={9}>
        imp-3346 C_inf~{C_INF_3346}
      </text>

      <line x1={padL} y1={yS(C_INF_3461)} x2={padL + cW} y2={yS(C_INF_3461)} stroke={ED.brassDeco} strokeWidth={1} strokeDasharray="4 3" />
      <text x={padL + cW - 4} y={yS(C_INF_3461) - 5} textAnchor="end" fill={ED.brass} fontSize={9}>
        imp-3461 recentred {C_INF_3461}
      </text>

      <path d={directPath} fill="none" stroke={ED.series1} strokeWidth={2} strokeDasharray="2 2" />
      {CELLS.map((c) => (
        <circle key={'d' + c.U} cx={xS(c.U)} cy={yS(c.cDirect)} r={3} fill={ED.series1} />
      ))}

      <path d={closedPath} fill="none" stroke={ED.series3} strokeWidth={2.4} />
      {CELLS.map((c) => (
        <circle key={'c' + c.U} cx={xS(c.U)} cy={yS(c.cClosed)} r={4} fill={ED.series3} />
      ))}

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke={ED.rule} strokeWidth={1} />

      {CELLS.map((c) => (
        <g key={c.U}>
          <line x1={xS(c.U)} y1={padT + cH} x2={xS(c.U)} y2={padT + cH + 5} stroke={ED.rule} strokeWidth={1} />
          <text x={xS(c.U)} y={padT + cH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5}>
            {c.U}
          </text>
        </g>
      ))}
      <text x={padL + cW / 2} y={padT + cH + 34} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        U (window length)
      </text>

      <text
        x={12}
        y={padT + cH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={10}
        transform={'rotate(-90,12,' + (padT + cH / 2) + ')'}
      >
        assembled capture constant C
      </text>
    </svg>
  );
}

export default function Imp3467ClosedFormCViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Closed-Form C-Assembly Across the Full U-Grid (imp-3467)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-3467 certified the imp-3400 closed form &Vert;Ttilde&Vert; = a&middot;sup<sub>&xi;</sub>
        |d/d&xi; |&Phi;hat(&xi;)|<sup>2</sup>| against the direct power-iteration numerator norm across the
        full imp-3240 U-grid {'{4, 6, 8, 10, 12, 16, 20}'}, then divided the closed-form numerator by the
        exact rank-2 shear-Gram denominator a&middot;m<sub>0</sub>&middot;&sigma;<sub>&Phi;</sub> to reassemble
        the capture constant. The{' '}
        <strong style={{ color: 'var(--series-3)' }}>closed-form assembly</strong> (green) sits flat at
        C&nbsp;=&nbsp;{C_CLOSED_MEAN.toFixed(7)} across every U, while the{' '}
        <strong style={{ color: 'var(--series-1)' }}>direct-numerator assembly</strong> (blue, dashed) converges up
        toward it from below as U grows — the two independent numerator routes meeting on the imp-3346
        target.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        Assembled C(U): closed-form numerator vs. direct power-iteration numerator
      </p>
      <CAssemblyChart />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> certification/measurement only — no
        proof, no reduction below RH. The closed-form C is assembled directly (no Richardson extrapolation)
        from two fixed Phi-shape spectral quantities and is U-independent by construction; the direct-numerator
        route is the extrapolated cross-check that converges to the same number. The imp-3470 obstruction
        confirms the peak value xi*~12.11 stays transcendental — no third independent closed-form number
        exists to overlay, only the confirmation that no elementary maximizer is available. The binding
        RH-equivalent K_a &ge; 0 sign-positivity residual (imp-3066) is untouched.
      </div>

      <div style={{ marginTop: '1rem', fontSize: '0.85rem', color: 'var(--ink-faint)' }}>
        <strong>Related:</strong>{' '}
        <Link to="/viz-imp3252-scaled-mu" style={{ color: 'var(--series-5)' }}>
          Shear-Gram Continuum Magnitude (imp-3252)
        </Link>
        {', '}
        <Link to="/viz-imp3256-vhs-crossval" style={{ color: 'var(--series-5)' }}>
          Volterra-HS Cross-Validation (imp-3256)
        </Link>
      </div>
    </div>
  );
}
