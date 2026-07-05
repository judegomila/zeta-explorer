import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP34008_APEX_PARABOLA_WING_FIDELITY } from '../data/imp-34008-apex-parabola-wing-fidelity.js';

const {
  apexParabola: APEX,
  wingCurve: CURVE,
  wingFidelity: WING,
  asymmetry: ASYM,
  e2FlatTopFidelity: E2,
} = IMP34008_APEX_PARABOLA_WING_FIDELITY;

// Primary chart: the fitted apex parabola P(t) overlaid on the true resid_exp(k*+t) hump,
// both sampled directly from the imp-34008 wingCurve array (no new computation), with the
// 1%/5% departure radii and the imp-33948 E2 flat-top half-widths shaded for context.
function WingFidelityChart() {
  const svgW = 680;
  const svgH = 340;
  const padL = 60;
  const padR = 24;
  const padT = 20;
  const padB = 40;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const tMin = CURVE[0].t;
  const tMax = CURVE[CURVE.length - 1].t;
  const yMin = 0;
  const yMax = APEX.apexResid * 1.15;

  const xAt = (t) => padL + ((t - tMin) / (tMax - tMin)) * cW;
  const yAt = (y) => padT + cH - ((y - yMin) / (yMax - yMin)) * cH;

  const parabolaPts = CURVE.map((p) => `${xAt(p.t)},${yAt(p.parabola)}`).join(' ');
  const truthPts = CURVE.map((p) => `${xAt(p.t)},${yAt(p.truth)}`).join(' ');

  const r1L = WING.departureRadiusDecade.left_1pct;
  const r1R = WING.departureRadiusDecade.right_1pct;
  const r5L = WING.departureRadiusDecade.left_5pct;
  const r5R = WING.departureRadiusDecade.right_5pct;
  const hw1 = E2.flatTopHalfWidth1pct;
  const hw5 = E2.flatTopHalfWidth5pct;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {/* 5% faithful band (outer, lighter) */}
      <rect x={xAt(-r5L)} y={padT} width={xAt(r5R) - xAt(-r5L)} height={cH} fill="rgba(56,189,248,0.06)" />
      {/* 1% faithful band (inner, stronger) */}
      <rect x={xAt(-r1L)} y={padT} width={xAt(r1R) - xAt(-r1L)} height={cH} fill="rgba(56,189,248,0.13)" />
      {/* E2 flat-top half-widths, sitting deep inside both bands */}
      <rect x={xAt(-hw1)} y={padT} width={xAt(hw1) - xAt(-hw1)} height={cH} fill="rgba(250,204,21,0.16)" />

      <line x1={xAt(0)} y1={padT} x2={xAt(0)} y2={padT + cH} stroke="#334155" strokeWidth={1} strokeDasharray="3,3" />

      <polyline points={truthPts} fill="none" stroke="#f472b6" strokeWidth={2} strokeDasharray="5,3" />
      <polyline points={parabolaPts} fill="none" stroke="#38bdf8" strokeWidth={2} />

      {[
        { t: -r1L, label: '1%', color: '#38bdf8' },
        { t: r1R, label: '1%', color: '#38bdf8' },
        { t: -r5L, label: '5%', color: '#0ea5e9' },
        { t: r5R, label: '5%', color: '#0ea5e9' },
      ].map((m, i) => (
        <line
          key={i}
          x1={xAt(m.t)}
          y1={padT}
          x2={xAt(m.t)}
          y2={padT + cH}
          stroke={m.color}
          strokeWidth={1}
          strokeDasharray="2,2"
          opacity={0.6}
        />
      ))}

      <text x={xAt(0)} y={padT + 14} textAnchor="middle" fill="#64748b" fontSize={9.5}>
        k* (apex)
      </text>
      <text x={xAt(-hw1)} y={padT + cH + 14} textAnchor="middle" fill="#facc15" fontSize={9}>
        E2 1% h.w. {hw1}
      </text>
      <text x={xAt(-r1L)} y={padT + cH + 28} textAnchor="middle" fill="#38bdf8" fontSize={9}>
        1% radius {r1L.toFixed(3)}
      </text>
      <text x={xAt(r1R)} y={padT + cH + 28} textAnchor="middle" fill="#38bdf8" fontSize={9}>
        1% radius {r1R.toFixed(3)}
      </text>
      <text x={xAt(-r5L)} y={padT + 12} textAnchor="middle" fill="#0ea5e9" fontSize={9}>
        5% radius {r5L.toFixed(3)}
      </text>
      <text x={xAt(r5R)} y={padT + 12} textAnchor="middle" fill="#0ea5e9" fontSize={9}>
        5% radius {r5R.toFixed(3)}
      </text>

      <text x={padL + cW / 2} y={svgH - 4} textAnchor="middle" fill="#64748b" fontSize={10}>
        t = k - k* (decades from apex, negative = low-k / left wing)
      </text>
      <text
        x={16}
        y={padT + cH / 2}
        textAnchor="middle"
        fill="#64748b"
        fontSize={10}
        transform={`rotate(-90 16 ${padT + cH / 2})`}
      >
        resid_exp(k)
      </text>

      <line x1={padL + 380} y1={padT + 4} x2={padL + 400} y2={padT + 4} stroke="#38bdf8" strokeWidth={2} />
      <text x={padL + 404} y={padT + 8} fill="#38bdf8" fontSize={9.5}>
        fitted parabola P(t)
      </text>
      <line
        x1={padL + 380}
        y1={padT + 20}
        x2={padL + 400}
        y2={padT + 20}
        stroke="#f472b6"
        strokeWidth={2}
        strokeDasharray="5,3"
      />
      <text x={padL + 404} y={padT + 24} fill="#f472b6" fontSize={9.5}>
        true resid_exp(k*+t)
      </text>
    </svg>
  );
}

// Secondary chart: the discrepancy magnitude |P(t)-truth(t)|/apex on each wing, showing the
// monotone-in-|t| departure and the low-k-departs-first asymmetry.
function DiscrepancyChart() {
  const svgW = 680;
  const svgH = 220;
  const padL = 60;
  const padR = 24;
  const padT = 16;
  const padB = 36;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const tMin = CURVE[0].t;
  const tMax = CURVE[CURVE.length - 1].t;
  const discPct = CURVE.map((p) => (100 * Math.abs(p.parabola - p.truth)) / APEX.apexResid);
  const yMax = Math.max(...discPct) * 1.1;

  const xAt = (t) => padL + ((t - tMin) / (tMax - tMin)) * cW;
  const yAt = (y) => padT + cH - (y / yMax) * cH;
  const y1 = yAt(1);
  const y5 = yAt(5);

  const pts = CURVE.map((p, i) => `${xAt(p.t)},${yAt(discPct[i])}`).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={y1} x2={padL + cW} y2={y1} stroke="#38bdf8" strokeWidth={1} strokeDasharray="3,3" />
      <text x={padL + cW} y={y1 - 4} textAnchor="end" fill="#38bdf8" fontSize={9}>
        1%
      </text>
      <line x1={padL} y1={y5} x2={padL + cW} y2={y5} stroke="#0ea5e9" strokeWidth={1} strokeDasharray="3,3" />
      <text x={padL + cW} y={y5 - 4} textAnchor="end" fill="#0ea5e9" fontSize={9}>
        5%
      </text>
      <polyline points={pts} fill="none" stroke="#a78bfa" strokeWidth={1.75} />
      <text x={padL + cW / 2} y={svgH - 4} textAnchor="middle" fill="#64748b" fontSize={10}>
        t = k - k*
      </text>
      <text
        x={16}
        y={padT + cH / 2}
        textAnchor="middle"
        fill="#64748b"
        fontSize={10}
        transform={`rotate(-90 16 ${padT + cH / 2})`}
      >
        |P-truth| / apex (%)
      </text>
    </svg>
  );
}

function AsymmetryStrip() {
  const svgW = 680;
  const svgH = 140;
  const padL = 60;
  const padT = 20;
  const cW = svgW - padL - 24;

  const bars = [
    { label: `left (low-k) at |t|=${ASYM.probe.offset}`, value: ASYM.probe.leftPct, color: '#fb7185' },
    { label: `right (high-k) at |t|=${ASYM.probe.offset}`, value: ASYM.probe.rightPct, color: '#38bdf8' },
  ];
  const maxV = Math.max(...bars.map((b) => b.value)) * 1.25;
  const barH = 28;
  const gap = 20;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {bars.map((b, i) => {
        const y = padT + i * (barH + gap);
        const w = (b.value / maxV) * cW;
        return (
          <g key={b.label}>
            <rect x={padL} y={y} width={w} height={barH} fill={b.color} opacity={0.75} rx={3} />
            <text x={padL - 6} y={y + barH / 2 + 4} textAnchor="end" fill="#94a3b8" fontSize={10}>
              {b.label}
            </text>
            <text x={padL + w + 8} y={y + barH / 2 + 4} fill="#e2e8f0" fontSize={10.5}>
              {b.value.toFixed(4)}%
            </text>
          </g>
        );
      })}
      <text x={padL + cW / 2} y={svgH - 6} textAnchor="middle" fill="#64748b" fontSize={10}>
        |P(t) - resid_exp(k*+t)| / apex
      </text>
    </svg>
  );
}

export default function Imp34100ApexParabolaWingFidelityViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Apex-Parabola Wing Fidelity (imp-34008 / imp-34100)" />

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 720 }}>
        imp-33948 E2 read flat-top half-widths off the apex quadratic P(t)=a+b t+c t^2 fitted at
        k*={APEX.kStar.toFixed(4)} without checking it against the true imp-33878 resid_exp(k)
        hump in the wings. imp-34008 measured that the parabola stays within 1% of the apex out
        to |k-k*|~{WING.departureRadiusDecade.left_1pct.toFixed(3)} (low-k) /{' '}
        {WING.departureRadiusDecade.right_1pct.toFixed(3)} (high-k), and within 5% out to ~
        {WING.departureRadiusDecade.left_5pct.toFixed(3)} / {WING.departureRadiusDecade.right_5pct.toFixed(3)}.
        The low-k wing departs first (a cubic tilt the parabola cannot capture), and the imp-33948
        E2 flat-top half-widths ({E2.flatTopHalfWidth1pct} / {E2.flatTopHalfWidth5pct} decade) sit
        deep inside this faithful zone.
      </p>

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        fitted parabola vs true hump, with 1%/5% departure radii and the E2 flat-top zone shaded
      </p>
      <WingFidelityChart />

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', margin: '1.25rem 0 0.25rem' }}>
        discrepancy |P(t)-truth(t)|/apex vs t, showing the monotone low-k-departs-first asymmetry
      </p>
      <DiscrepancyChart />

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', margin: '1.25rem 0 0.25rem' }}>
        wing asymmetry: discrepancy at the |t|=0.5 probe, low-k vs high-k
      </p>
      <AsymmetryStrip />

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
        <strong style={{ color: '#94a3b8' }}>Honest status:</strong> measurement only; the parabola
        tracks the true hump across a ~1.27-decade (1%) to ~1.96-decade (5%) window, and the E2
        flat-top readings are validated as honest, not extrapolation artifacts. Refines, does not
        overturn, imp-33948. The inherited imp-3220/imp-3406 component model is not a rigorous
        asymptotic; C_mb GUE-conditional per imp-486 untouched; C_C 1/8 ansatz untouched; changes
        no bound; imp-3066 K_a&gt;=0 untouched; NO QED; Platt-Trudgian Lambda&lt;=0.2 remains SOTA.
      </div>
    </div>
  );
}
