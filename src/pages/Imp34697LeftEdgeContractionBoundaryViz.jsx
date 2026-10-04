import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { effectiveHeightForN } from '../data/lambda-rh-height-mapping.js';
import { IMP34675_CROSSOVER_CONTRACTION_LEFT_EDGE } from '../data/imp-34675-crossover-contraction-left-edge.js';
import { ED, alpha } from '../styles/tokens.js';

const EDGE = IMP34675_CROSSOVER_CONTRACTION_LEFT_EDGE;
const K_AMPL = EDGE.closedForm.K; // ~1.572709e8, reused verbatim from imp-34675
const TWO_PI = 2 * Math.PI;
const N_STAR = EDGE.closedForm.N_star; // ~1.474994e8
const A = EDGE.location.imp34650_left_edge_a; // 1e9
const L = EDGE.verification.g_prime_1e9; // ~0.1485
const N_CROSS = EDGE.location.N_cross; // ~3.280294e9

// Same derivative formula as imp-34675/imp-34650, reusing K_AMPL verbatim.
const gPrime = (N) => {
  const T0 = effectiveHeightForN(N);
  return (K_AMPL * TWO_PI) / (T0 * Math.log(T0 / TWO_PI));
};

const CURVE_POINTS = Array.from({ length: 48 }, (_, i) => {
  const logN = Math.log10(N_STAR * 0.85) + (i / 47) * (Math.log10(N_CROSS * 1.15) - Math.log10(N_STAR * 0.85));
  const n = 10 ** logN;
  return { n, gp: gPrime(n) };
});

function GPrimeDescentChart() {
  const svgW = 640;
  const svgH = 280;
  const padL = 60;
  const padR = 24;
  const padT = 20;
  const padB = 40;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const minLogN = Math.log10(N_STAR * 0.85);
  const maxLogN = Math.log10(N_CROSS * 1.15);
  const maxGp = Math.max(...CURVE_POINTS.map((p) => p.gp), 1.05);
  const minGp = 0;

  const xAt = (n) => padL + ((Math.log10(n) - minLogN) / (maxLogN - minLogN)) * cW;
  const yAt = (gp) => padT + cH - ((gp - minGp) / (maxGp - minGp)) * cH;

  const curvePath = CURVE_POINTS.map((p) => `${xAt(p.n)},${yAt(p.gp)}`).join(' ');
  const oneLineY = yAt(1);

  const MARKS = [
    { label: 'N_star', n: N_STAR, gp: 1, color: ED.series7 },
    { label: 'a = 1e9', n: A, gp: L, color: ED.series1 },
    { label: 'N_cross', n: N_CROSS, gp: gPrime(N_CROSS), color: ED.series5 },
  ];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect
        x={xAt(N_STAR)}
        y={padT}
        width={Math.max(xAt(A) - xAt(N_STAR), 0)}
        height={cH}
        fill={alpha(ED.series7, 0.08)}
      />
      <line x1={padL} y1={oneLineY} x2={padL + cW} y2={oneLineY} stroke={ED.series7} strokeWidth={1} strokeDasharray="4,3" />
      <text x={padL + 4} y={oneLineY - 6} fill={ED.series7} fontSize={9.5}>
        g_prime = 1 (contraction boundary)
      </text>
      <polyline points={curvePath} fill="none" stroke={ED.series1} strokeWidth={1.5} />
      {MARKS.map((m) => (
        <g key={m.label}>
          <circle cx={xAt(m.n)} cy={yAt(m.gp)} r={5} fill={m.color} stroke={ED.paper} strokeWidth={0.75} />
          <text x={xAt(m.n)} y={yAt(m.gp) - 10} textAnchor="middle" fill={ED.inkSoft} fontSize={9.5}>
            {m.gp.toFixed(4)}
          </text>
          <text x={xAt(m.n)} y={svgH - padB + 16} textAnchor="middle" fill={ED.inkSoft} fontSize={10}>
            {m.label}
          </text>
        </g>
      ))}
      <text x={16} y={padT + cH / 2} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5} transform={`rotate(-90 16 ${padT + cH / 2})`}>
        g_prime(N)
      </text>
      <text x={padL + cW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        N (log scale, N_star &asymp; 1.475e8 to N_cross &asymp; 3.28e9)
      </text>
    </svg>
  );
}

export default function Imp34697LeftEdgeContractionBoundaryViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Left Edge of the Crossover Contraction Region (imp-34675)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-34650 certified the imp-33723 crossover map g(N) = K log T0(N) a Banach L-contraction on
        the deep-tail interval I = [{A.toExponential(0)}, 1e10], with L = g_prime(a) &asymp; {L}. imp-34675
        located the exact LEFT edge of the wider contraction region in closed form via the Lambert W
        function: N_star = K(1 &minus; 1/W(K)) &asymp; {N_STAR.toExponential(4)}, the point where
        g_prime(N_star) = 1 exactly. The chart below plots g_prime(N) descending monotonically as N
        grows, crossing 1 at N_star, easing to L &asymp; {L} at the certificate edge a = {A.toExponential(0)},
        and continuing down toward the fixed point N_cross &asymp; {N_CROSS.toExponential(4)}. The shaded
        band marks [N_star, a] &asymp; [{N_STAR.toExponential(3)}, {A.toExponential(0)}], the margin by
        which the imp-34650 certificate edge a = 1e9 was conservative.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        g_prime(N) crossing 1 at the Lambert-W closed form N_star, easing to L at a = 1e9
      </p>
      <GPrimeDescentChart />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Finding:</strong> g_prime(N) = K&middot;2pi/(T0
        log(T0/2pi)) is positive and strictly decreasing in N, crossing the contraction boundary
        g_prime = 1 exactly at N_star = K(1 &minus; 1/W(K)) &asymp; {N_STAR.toExponential(4)} (Lambert
        W closed form, imp-34675). Below N_star the map is not a contraction; above it, g_prime falls
        further to L &asymp; {L} at the imp-34650 certificate edge a = {A.toExponential(0)}, a factor
        &asymp; {EDGE.location.a_over_N_star}x above N_star, and keeps falling toward N_cross &asymp;{' '}
        {N_CROSS.toExponential(4)}. So the certificate left edge a = 1e9 was conservative: the
        contraction region already begins at N_star, roughly {EDGE.location.a_over_N_star}x further
        left.
      </div>

      <div
        style={{
          marginTop: '0.75rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--ink-soft) 4%, transparent)',
          borderLeft: '3px solid var(--rule)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-faint)',
        }}
      >
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> visualization of an existing
        derivation, isRigorous false. N_star is a double-precision root of the Riemann-von Mangoldt
        asymptotic (Lambert W by Halley iteration), not an interval-arithmetic enclosure (imp-34675a
        sub-gap open). Locates a boundary of a property of the inherited imp-3220/imp-3406 surrogate
        crossover map; C_C 1/8 ansatz untouched; C_mb GUE-conditional per imp-486 untouched; changes no
        bound; no operator positivity; imp-3066 K_a &gt;= 0 untouched; no RH verdict, NO QED.
      </div>
    </div>
  );
}
