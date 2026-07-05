import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP33802_PERRON_NORM_CURVE_VIZ_DATA } from '../data/imp-33802-perron-norm-curve-viz-data.js';

const {
  perronCeiling,
  perronNormCurve,
  decoupledSofteningAnchorShear,
  decoupledSofteningSeries,
  unityLine,
  honestCaveat,
} = IMP33802_PERRON_NORM_CURVE_VIZ_DATA;

// log10-x line chart of the coupled ||R||(s) curve rising toward the DEG+1 ceiling.
function PerronNormCurveChart() {
  const svgW = 640;
  const svgH = 300;
  const padL = 48;
  const padR = 24;
  const padT = 16;
  const padB = 36;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const logS = perronNormCurve.map((p) => Math.log10(p.s));
  const minLogS = Math.min(...logS);
  const maxLogS = Math.max(...logS);
  const maxNorm = perronCeiling;

  const xAt = (s) => padL + ((Math.log10(s) - minLogS) / (maxLogS - minLogS)) * cW;
  const yAt = (v) => padT + cH - (v / maxNorm) * cH;

  const linePoints = perronNormCurve.map((p) => `${xAt(p.s)},${yAt(p.operatorNorm)}`).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line
        x1={padL}
        y1={yAt(perronCeiling)}
        x2={padL + cW}
        y2={yAt(perronCeiling)}
        stroke="#f87171"
        strokeWidth={1.5}
        strokeDasharray="6,3"
      />
      <text x={padL + cW - 4} y={yAt(perronCeiling) - 6} textAnchor="end" fill="#f87171" fontSize={9.5}>
        {`Perron ceiling (DEG+1 = ${perronCeiling})`}
      </text>

      <polyline points={linePoints} fill="none" stroke="#38bdf8" strokeWidth={2} />
      {perronNormCurve.map((p) => (
        <circle key={`pt-${p.s}`} cx={xAt(p.s)} cy={yAt(p.operatorNorm)} r={3} fill="#38bdf8" stroke="#0a0f1a" strokeWidth={0.75} />
      ))}

      {perronNormCurve.map((p) => (
        <text key={`xt-${p.s}`} x={xAt(p.s)} y={padT + cH + 16} textAnchor="middle" fill="#64748b" fontSize={8.5}>
          {p.s}
        </text>
      ))}
      <text x={padL + cW / 2} y={svgH - 4} textAnchor="middle" fill="#64748b" fontSize={10}>
        shear rate s (coupled, log-spaced ladder)
      </text>

      <text
        x={14}
        y={padT + cH / 2}
        textAnchor="middle"
        fill="#64748b"
        fontSize={10}
        transform={`rotate(-90 14 ${padT + cH / 2})`}
      >
        ||R||(s)
      </text>
    </svg>
  );
}

// Linear line chart of the fixed-shear decoupled softening series, with the ||R|| = 1 reference line.
function SofteningSeriesChart() {
  const svgW = 640;
  const svgH = 260;
  const padL = 48;
  const padR = 24;
  const padT = 16;
  const padB = 36;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const sPassValues = decoupledSofteningSeries.map((p) => p.sPass);
  const minSPass = Math.min(...sPassValues);
  const maxSPass = Math.max(...sPassValues);
  const maxNorm = Math.max(...decoupledSofteningSeries.map((p) => p.operatorNorm));

  const xAt = (sPass) => padL + ((sPass - minSPass) / (maxSPass - minSPass)) * cW;
  const yAt = (v) => padT + cH - (v / maxNorm) * cH;

  const linePoints = decoupledSofteningSeries.map((p) => `${xAt(p.sPass)},${yAt(p.operatorNorm)}`).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line
        x1={padL}
        y1={yAt(unityLine)}
        x2={padL + cW}
        y2={yAt(unityLine)}
        stroke="#facc15"
        strokeWidth={1.5}
        strokeDasharray="6,3"
      />
      <text x={padL + cW - 4} y={yAt(unityLine) - 6} textAnchor="end" fill="#facc15" fontSize={9.5}>
        ||R|| = 1
      </text>

      <polyline points={linePoints} fill="none" stroke="#a78bfa" strokeWidth={2} />
      {decoupledSofteningSeries.map((p) => (
        <circle key={`pt-${p.sPass}`} cx={xAt(p.sPass)} cy={yAt(p.operatorNorm)} r={3} fill="#a78bfa" stroke="#0a0f1a" strokeWidth={0.75} />
      ))}

      {decoupledSofteningSeries.map((p) => (
        <text key={`xt-${p.sPass}`} x={xAt(p.sPass)} y={padT + cH + 16} textAnchor="middle" fill="#64748b" fontSize={8.5}>
          {p.sPass}
        </text>
      ))}
      <text x={padL + cW / 2} y={svgH - 4} textAnchor="middle" fill="#64748b" fontSize={10}>
        {`pass rate s_b (shear fixed at s_a = ${decoupledSofteningAnchorShear})`}
      </text>

      <text
        x={14}
        y={padT + cH / 2}
        textAnchor="middle"
        fill="#64748b"
        fontSize={10}
        transform={`rotate(-90 14 ${padT + cH / 2})`}
      >
        ||R||(s_b)
      </text>
    </svg>
  );
}

export default function Imp33950PerronNormCurveViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="G7 Perron-Norm Curve + Decoupled Softening Probe (imp-33802 / imp-33950)" />

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-33802 packaged the imp-33765 coupled ||R||(s) curve and the fixed-shear decoupled
        softening series into self-computing viz-data. This page is the first UI consumer. The
        top chart shows ||R||(s) rising monotonically with the shear/pass rate s, saturating below
        the DEG+1 = {perronCeiling} all-ones Perron ceiling and never crossing it. The bottom chart
        holds the shear rate fixed at s_a = {decoupledSofteningAnchorShear} and sweeps the
        independent pass rate s_b: the norm falls monotonically, crossing the ||R|| = 1 reference
        line between s_b = 2 and s_b = 4.
      </p>

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        Coupled ||R||(s), s in {'{0.25 .. 32}'}
      </p>
      <PerronNormCurveChart />

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', margin: '1.5rem 0 0.5rem' }}>
        Decoupled softening series ||R||(s_b) at fixed s_a = {decoupledSofteningAnchorShear}
      </p>
      <SofteningSeriesChart />

      <div
        style={{
          marginTop: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'rgba(148,163,184,0.04)',
          borderLeft: '3px solid #334155',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: '#64748b',
        }}
      >
        <strong style={{ color: '#94a3b8' }}>Honest status:</strong> structural diagnostic only, not
        a proof and not a reduction below RH; the decoupled probe is diagnostic (not an admissible
        imp-3066 modification); imp-3066 / imp-33765 / imp-33789 are untouched; positivity was not
        attempted; {honestCaveat.sota}
      </div>
    </div>
  );
}
