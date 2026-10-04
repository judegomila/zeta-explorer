import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP34888_SIGMA_KNEE_PADE_BOREL_RESUMMATION } from '../data/imp-34888-sigma-knee-pade-borel-resummation.js';
import { ED } from '../styles/tokens.js';

const D = IMP34888_SIGMA_KNEE_PADE_BOREL_RESUMMATION;

// Bar chart of each method's SC-to-exactF dex residual against the +4.86e-5 plateau and the ~9.2e-5 FD floor.
function ResidualBarChart() {
  const svgW = 720;
  const svgH = 280;
  const padL = 60;
  const padR = 20;
  const padT = 24;
  const padB = 50;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const rb = D.residualBudget;
  const bars = [
    { label: 'plain 9-term sum', v: rb.plainSum9ToExactFLog10 },
    { label: 'Pade [4/4]', v: rb.padeDiagToExactFLog10 },
    { label: 'Wynn epsilon', v: rb.wynnToExactFLog10 },
    { label: 'Borel-Laplace', v: rb.borelToExactFLog10 },
  ];

  const yMax = 1.05e-4; // just above the FD floor so the floor line is visible inside the plot
  const yAt = (v) => padT + cH - (v / yMax) * cH;
  const barW = cW / bars.length / 2;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke={ED.rule} strokeWidth={1} />

      {[0, 2.5e-5, 5e-5, 7.5e-5, 1e-4].map((t) => (
        <g key={t}>
          <line x1={padL - 4} y1={yAt(t)} x2={padL + cW} y2={yAt(t)} stroke={ED.ruleSoft} strokeWidth={1} />
          <text x={padL - 8} y={yAt(t) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {t.toExponential(1)}
          </text>
        </g>
      ))}

      <line
        x1={padL}
        y1={yAt(rb.fdFloorDex)}
        x2={padL + cW}
        y2={yAt(rb.fdFloorDex)}
        stroke={ED.series2}
        strokeWidth={1.5}
        strokeDasharray="4 3"
      />
      <text x={padL + cW - 2} y={yAt(rb.fdFloorDex) - 4} textAnchor="end" fill={ED.series2} fontSize={9}>
        FD floor ({rb.fdFloorDex.toExponential(1)} dex)
      </text>

      {bars.map((b, i) => {
        const cx = padL + ((i + 0.5) / bars.length) * cW;
        const y = yAt(b.v);
        return (
          <g key={b.label}>
            <rect x={cx - barW / 2} y={y} width={barW} height={padT + cH - y} fill={ED.series1} rx={2} />
            <text x={cx} y={y - 6} textAnchor="middle" fill={ED.inkSoft} fontSize={9}>
              {b.v.toExponential(4)}
            </text>
            <text x={cx} y={padT + cH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
              {b.label}
            </text>
          </g>
        );
      })}

      <text x={padL + cW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        resummation method
      </text>
    </svg>
  );
}

// The radius context: physical eval point eps=1 sits deep inside both convergence-radius reads.
function RadiusContextChart() {
  const svgW = 720;
  const svgH = 160;
  const padL = 70;
  const padR = 20;
  const padT = 24;
  const padB = 30;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const rc = D.radiusContext;
  const maxV = rc.rootTestRadius * 1.1;
  const rows = [
    { label: 'Domb-Sykes R', v: rc.dombSykesRadius, color: ED.series3 },
    { label: 'root-test R', v: rc.rootTestRadius, color: ED.series1 },
  ];
  const rowH = cH / (rows.length + 1);
  const xAt = (v) => padL + (v / maxV) * cW;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      {rows.map((r, i) => (
        <g key={r.label}>
          <text
            x={padL - 6}
            y={padT + i * rowH + rowH / 2 + 3}
            textAnchor="end"
            fill={ED.inkSoft}
            fontSize={9}
            fontFamily="monospace"
          >
            {r.label}
          </text>
          <line
            x1={padL}
            y1={padT + i * rowH + rowH / 2}
            x2={xAt(r.v)}
            y2={padT + i * rowH + rowH / 2}
            stroke={r.color}
            strokeWidth={8}
            strokeLinecap="round"
          />
          <text x={xAt(r.v) + 6} y={padT + i * rowH + rowH / 2 + 3} fill={ED.inkFaint} fontSize={9}>
            {r.v}
          </text>
        </g>
      ))}
      <circle cx={xAt(rc.physicalEvalPoint)} cy={padT + cH} r={4} fill={ED.series2} />
      <text x={xAt(rc.physicalEvalPoint)} y={padT + cH + 18} textAnchor="middle" fill={ED.series2} fontSize={9}>
        eps = {rc.physicalEvalPoint} (physical point)
      </text>
    </svg>
  );
}

export default function Imp34912PadeBorelResummationInertnessViz() {
  const rb = D.residualBudget;
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Pade-Borel Resummation Inertness (imp-34912 / imp-34888)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        {D.question}
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        All four resummations of the delta_1..delta_9 series sit on the plain-sum SC-to-exactF residual
        plateau: plain sum, Pade [4/4] and Wynn epsilon are IDENTICAL at{' '}
        {rb.plainSum9ToExactFLog10.toExponential(4)} dex, and Borel-Laplace moves the knee by only ~9e-8
        dex to {rb.borelToExactFLog10.toExponential(4)} dex &mdash; every method stays well below the{' '}
        {rb.fdFloorDex.toExponential(1)} dex finite-difference floor (max residual-ratio deviation{' '}
        {rb.maxResidRatioDeviation.toExponential(2)}, {'<'} 5%).
      </p>
      <ResidualBarChart />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', margin: '1.25rem 0 0.5rem' }}>
        Both convergence-radius reads put the physical resummation point eps = 1 deep inside the disk
        &mdash; the Domb-Sykes/Neville-sharpened radius ({D.radiusContext.dombSykesRadius}) and the
        Cauchy-Hadamard root-test radius ({D.radiusContext.rootTestRadius}) &mdash; explaining why the
        series is already converged and there is nothing left to accelerate.
      </p>
      <RadiusContextChart />

      <p style={{ color: 'var(--ink-faint)', fontSize: '0.78rem', marginTop: '0.75rem' }}>
        Resummed totals at eps = 1 (plain sum {D.resummedTotals.plainSum9}): Pade [4/4] departs by{' '}
        {D.resummedTotals.pade4over4MinusSum9}, Wynn by {D.resummedTotals.wynnMinusSum9}, Borel by{' '}
        {D.resummedTotals.borelMinusSum9} &mdash; all negligible relative to the tail the series has
        already summed away.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> Viz-only page rendering the
        imp-34888 residualBudget/resummedTotals/radiusContext literals verbatim (no new computation).
        Measurement/derivation on the INHERITED imp-3220/imp-3406 extrapolation, NOT a rigorous
        asymptotic; C_mb GUE-conditional per imp-486 UNTOUCHED; imp-3066 K_a&ge;0 untouched; far-tail
        exponent stays 1/2 (imp-3463); changes no bound; establishes no operator positivity; no RH
        verdict, NO QED.
      </div>
    </div>
  );
}
