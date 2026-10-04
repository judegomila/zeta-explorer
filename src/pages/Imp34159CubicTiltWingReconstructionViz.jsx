import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import SurrogateDiagnosticCohortNote from '../components/SurrogateDiagnosticCohortNote.jsx';
import { IMP34084_APEX_CUBIC_TILT_COEFFICIENT } from '../data/imp-34084-apex-cubic-tilt-coefficient.js';
import { ED } from '../styles/tokens.js';

const { cubicFit: FIT, oddPartMatch: ODD, wingAsymmetryReconstruction: RECON } =
  IMP34084_APEX_CUBIC_TILT_COEFFICIENT;

// Reconstruct the parabola-only and cubic-augmented curves near k* from the stored fit
// coefficients so the odd tilt is visible directly against the quadratic baseline.
const A = FIT.apexResid;
const B2 = FIT.residSecondDeriv / 2;
const D = FIT.cubicCoeffD;
const parabola = (t) => A + B2 * t * t;
const cubic = (t) => A + B2 * t * t + D * t * t * t;

const CURVE_POINTS = 41;
const W = FIT.fitWindow;
const curveTs = Array.from({ length: CURVE_POINTS }, (_, i) => -W + (2 * W * i) / (CURVE_POINTS - 1));

// Primary chart: parabola-only vs cubic-augmented reconstruction over the fit window, with the
// probe offsets |t|=0.5*W marked (scaled visually to the actual FIT_WINDOW=0.1 span).
function ReconstructionChart() {
  const svgW = 640;
  const svgH = 300;
  const padL = 64;
  const padR = 24;
  const padT = 16;
  const padB = 36;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const ys = curveTs.flatMap((t) => [parabola(t), cubic(t)]);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const pad = (maxY - minY) * 0.15 || 1e-6;

  const xAt = (t) => padL + ((t - -W) / (2 * W)) * cW;
  const yAt = (y) => padT + cH - ((y - (minY - pad)) / (maxY - minY + 2 * pad)) * cH;

  const probeT = ODD.probeOffset;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <polyline
        points={curveTs.map((t) => `${xAt(t)},${yAt(parabola(t))}`).join(' ')}
        fill="none"
        stroke={ED.series7}
        strokeWidth={1.75}
        strokeDasharray="5,3"
      />
      <polyline
        points={curveTs.map((t) => `${xAt(t)},${yAt(cubic(t))}`).join(' ')}
        fill="none"
        stroke={ED.series1}
        strokeWidth={1.75}
      />
      {[-probeT, probeT].map((t) => (
        <g key={`probe-${t}`}>
          <line x1={xAt(t)} y1={padT} x2={xAt(t)} y2={padT + cH} stroke={ED.rule} strokeWidth={1} strokeDasharray="2,3" />
          <circle cx={xAt(t)} cy={yAt(parabola(t))} r={4} fill={ED.series7} stroke={ED.paper} strokeWidth={1} />
          <circle cx={xAt(t)} cy={yAt(cubic(t))} r={4} fill={ED.series1} stroke={ED.paper} strokeWidth={1} />
        </g>
      ))}
      <text x={xAt(0)} y={padT + cH + 20} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        t = k - k* (t=0 is the apex)
      </text>
      <text
        x={16}
        y={padT + cH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={10}
        transform={`rotate(-90 16 ${padT + cH / 2})`}
      >
        reconstructed resid_exp
      </text>
      <text x={padL + 4} y={padT + 12} fill={ED.series7} fontSize={9.5}>
        parabola only (even, imp-33948)
      </text>
      <text x={padL + 4} y={padT + 26} fill={ED.series1} fontSize={9.5}>
        + cubic tilt d~{FIT.cubicCoeffD.toExponential(3)} (odd, imp-34084)
      </text>
    </svg>
  );
}

// Secondary chart: the imp-34008 left/right wing-discrepancy split, before (quadratic) vs after
// (cubic), showing the split collapsing from ~0.193% to ~-0.007%.
function AsymmetryBarChart() {
  const svgW = 640;
  const svgH = 220;
  const padL = 64;
  const padR = 24;
  const padT = 16;
  const padB = 36;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const rows = [
    { label: 'quadratic (imp-33948/imp-34008)', left: RECON.quadraticSplit.leftPct, right: RECON.quadraticSplit.rightPct },
    { label: 'cubic-augmented (imp-34084)', left: RECON.cubicSplit.leftPct, right: RECON.cubicSplit.rightPct },
  ];
  const maxVal = Math.max(...rows.flatMap((r) => [r.left, r.right])) * 1.15;
  const xAt = (v) => padL + (v / maxVal) * cW;
  const barH = 20;
  const groupGap = 56;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {rows.map((r, i) => {
        const y0 = padT + i * groupGap;
        return (
          <g key={r.label}>
            <rect x={padL} y={y0} width={xAt(r.left) - padL} height={barH} fill={ED.series7} />
            <text x={xAt(r.left) + 6} y={y0 + barH - 5} fill={ED.series7} fontSize={10}>
              left {r.left}%
            </text>
            <rect x={padL} y={y0 + barH + 4} width={xAt(r.right) - padL} height={barH} fill={ED.series1} />
            <text x={xAt(r.right) + 6} y={y0 + 2 * barH - 1} fill={ED.series1} fontSize={10}>
              right {r.right}%
            </text>
            <text x={padL} y={y0 - 4} fill={ED.inkSoft} fontSize={10}>
              {r.label}
            </text>
          </g>
        );
      })}
      <text x={padL + cW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        wing discrepancy at |t|=0.5 (% of apex)
      </text>
    </svg>
  );
}

export default function Imp34159CubicTiltWingReconstructionViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Apex Cubic-Tilt Odd-Part Wing-Asymmetry Reconstruction (imp-34084 / imp-34159)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-34008 found the imp-33948 apex parabola tracks the true resid_exp(k) hump asymmetrically
        (left wing departs first, 0.410% vs 0.218% at |t|=0.5) and inferred a nonzero cubic tilt without
        fitting it. imp-34084 fits the full cubic basis on the same 21-point k* &plusmn; {FIT.fitWindow}{' '}
        grid and gets d &sim; {FIT.cubicCoeffD.toExponential(4)} (resid triple-prime(k*) = 6d &sim;{' '}
        {FIT.residThirdDeriv.toExponential(4)}, NEGATIVE), leaving the even apex ({FIT.apexResid.toExponential(4)})
        and curvature ({FIT.residSecondDeriv.toExponential(4)}) untouched by symmetry.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        parabola-only vs cubic-augmented reconstruction near the apex
      </p>
      <ReconstructionChart />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', margin: '1.25rem 0 0.25rem' }}>
        imp-34008 left/right wing discrepancy split: quadratic vs cubic-augmented
      </p>
      <AsymmetryBarChart />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> at |t|={ODD.probeOffset} the odd part of
        the quadratic residual ({ODD.oddResidAtProbe.toExponential(3)}) is reproduced by the fitted cubic term
        ({ODD.cubicTermAtProbe.toExponential(3)}) to within ~6% (ratio {ODD.ratio}), and including the cubic
        collapses the imp-34008 wing split from {RECON.quadraticSplit.splitPct}% to{' '}
        {RECON.cubicSplit.splitPct}% ({RECON.reconstructedPct}% reconstructed).{' '}
        <SurrogateDiagnosticCohortNote />
      </div>
    </div>
  );
}
