import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP34650_CROSSOVER_BANACH_CONTRACTION_CERTIFICATE } from '../data/imp-34650-crossover-banach-contraction-certificate.js';
import { IMP34675_CROSSOVER_CONTRACTION_LEFT_EDGE } from '../data/imp-34675-crossover-contraction-left-edge.js';
import { ED } from '../styles/tokens.js';

const CERT = IMP34650_CROSSOVER_BANACH_CONTRACTION_CERTIFICATE;
const EDGE = IMP34675_CROSSOVER_CONTRACTION_LEFT_EDGE;

const A = CERT.interval.a; // 1e9
const B = CERT.interval.b; // 1e10
const L = CERT.certificate.uniform_lipschitz_L; // ~0.1485
const G_A = CERT.certificate.g_of_a; // ~3.1036e9
const G_B = CERT.certificate.g_of_b; // ~3.4466e9
const N_CROSS = CERT.certificate.N_cross_fixed_point; // ~3.280294e9
const N_STAR = EDGE.closedForm.N_star; // ~1.474994e8

// g_prime(N) crossing 1: three known points on the log10(N) axis, monotone decreasing.
const GPRIME_POINTS = [
  { label: 'N_star', n: N_STAR, gp: 1, note: 'g_prime = 1 exactly (closed form)' },
  { label: '1e8', n: 1e8, gp: EDGE.verification.g_prime_1e8, note: 'below N_star, not a contraction' },
  { label: 'a = 1e9', n: A, gp: L, note: 'certificate left edge, L = sup_I g_prime' },
];

function GPrimeCrossingChart() {
  const svgW = 640;
  const svgH = 260;
  const padL = 56;
  const padR = 24;
  const padT = 20;
  const padB = 40;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const minLogN = Math.log10(1e8) - 0.15;
  const maxLogN = Math.log10(1e9) + 0.15;
  const minY = 0;
  const maxY = 1.6;

  const xAt = (n) => padL + ((Math.log10(n) - minLogN) / (maxLogN - minLogN)) * cW;
  const yAt = (gp) => padT + cH - ((gp - minY) / (maxY - minY)) * cH;

  const linePoints = GPRIME_POINTS.map((p) => `${xAt(p.n)},${yAt(p.gp)}`).join(' ');
  const oneLineY = yAt(1);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={oneLineY} x2={padL + cW} y2={oneLineY} stroke={ED.series7} strokeWidth={1} strokeDasharray="4,3" />
      <text x={padL + 4} y={oneLineY - 6} fill={ED.series7} fontSize={9.5}>
        g_prime = 1 (contraction boundary)
      </text>
      <polyline points={linePoints} fill="none" stroke={ED.series1} strokeWidth={1.5} strokeDasharray="3,3" />
      {GPRIME_POINTS.map((p) => (
        <g key={p.label}>
          <circle cx={xAt(p.n)} cy={yAt(p.gp)} r={5} fill={ED.series5} stroke={ED.paper} strokeWidth={0.75} />
          <text x={xAt(p.n)} y={yAt(p.gp) - 12} textAnchor="middle" fill={ED.inkSoft} fontSize={9.5}>
            {p.gp.toFixed(6)}
          </text>
          <text x={xAt(p.n)} y={svgH - padB + 16} textAnchor="middle" fill={ED.inkSoft} fontSize={10}>
            {p.label}
          </text>
        </g>
      ))}
      <text x={14} y={padT + cH / 2} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5} transform={`rotate(-90 14 ${padT + cH / 2})`}>
        g_prime(N)
      </text>
      <text x={padL + cW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        N (log scale, N_star ~ 1.475e8 to a = 1e9)
      </text>
    </svg>
  );
}

function SelfMapChart() {
  const svgW = 640;
  const svgH = 160;
  const padL = 56;
  const padR = 24;
  const padT = 30;
  const padB = 40;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const minLogN = Math.log10(A) - 0.05;
  const maxLogN = Math.log10(B) + 0.05;
  const xAt = (n) => padL + ((Math.log10(n) - minLogN) / (maxLogN - minLogN)) * cW;

  const yI = padT + cH * 0.25;
  const yGI = padT + cH * 0.75;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={xAt(A)} y1={yI} x2={xAt(B)} y2={yI} stroke={ED.rule} strokeWidth={4} />
      <text x={xAt(A)} y={yI - 10} textAnchor="middle" fill={ED.inkSoft} fontSize={9.5}>
        I = [{A.toExponential(0)}
      </text>
      <text x={xAt(B)} y={yI - 10} textAnchor="middle" fill={ED.inkSoft} fontSize={9.5}>
        {B.toExponential(0)}]
      </text>

      <line x1={xAt(G_A)} y1={yGI} x2={xAt(G_B)} y2={yGI} stroke={ED.series1} strokeWidth={4} />
      <text x={xAt(G_A)} y={yGI + 18} textAnchor="middle" fill={ED.series1} fontSize={9.5}>
        g(a) = {G_A.toExponential(4)}
      </text>
      <text x={xAt(G_B)} y={yGI + 18} textAnchor="middle" fill={ED.series1} fontSize={9.5}>
        g(b) = {G_B.toExponential(4)}
      </text>
      <text x={(xAt(G_A) + xAt(G_B)) / 2} y={yGI - 8} textAnchor="middle" fill={ED.series1} fontSize={10} fontWeight={700}>
        g(I) &sub; I
      </text>

      <circle cx={xAt(N_CROSS)} cy={(yI + yGI) / 2} r={5} fill={ED.series7} stroke={ED.paper} strokeWidth={0.75} />
      <text x={xAt(N_CROSS)} y={(yI + yGI) / 2 - 10} textAnchor="middle" fill={ED.series7} fontSize={9.5} fontWeight={700}>
        N_cross &asymp; {N_CROSS.toExponential(4)}
      </text>
    </svg>
  );
}

// Picard iteration a-priori bound |N_k - N_cross| <= L^k/(1-L) * |N_1 - N_0|, N_0 = b.
const PICARD_ITERS = Array.from({ length: 13 }, (_, k) => k);
const PICARD_BOUND = PICARD_ITERS.map(
  (k) => (Math.pow(L, k) / (1 - L)) * Math.abs(G_B - B)
);

function PicardConvergenceChart() {
  const svgW = 640;
  const svgH = 260;
  const padL = 64;
  const padR = 24;
  const padT = 20;
  const padB = 40;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const minX = 0;
  const maxX = 12;
  const logVals = PICARD_BOUND.map((v) => Math.log10(Math.max(v, 1e-6)));
  const minY = Math.min(...logVals) - 1;
  const maxY = Math.max(...logVals) + 1;

  const xAt = (k) => padL + ((k - minX) / (maxX - minX)) * cW;
  const yAt = (logv) => padT + cH - ((logv - minY) / (maxY - minY)) * cH;

  const linePoints = PICARD_ITERS.map((k) => `${xAt(k)},${yAt(Math.log10(Math.max(PICARD_BOUND[k], 1e-6)))}`).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <polyline points={linePoints} fill="none" stroke={ED.series5} strokeWidth={1.5} />
      {[0, 5, CERT.certificate.iters_from_b_to_floating_point].map((k) => (
        <circle key={k} cx={xAt(k)} cy={yAt(Math.log10(Math.max(PICARD_BOUND[k], 1e-6)))} r={4.5} fill={ED.series7} stroke={ED.paper} strokeWidth={0.75} />
      ))}
      <text x={xAt(5) + 6} y={yAt(Math.log10(PICARD_BOUND[5])) - 8} fill={ED.inkSoft} fontSize={9.5}>
        k=5: rel {CERT.certificate.a_priori_error_k5_rel}
      </text>
      <text
        x={xAt(CERT.certificate.iters_from_b_to_floating_point) + 6}
        y={yAt(Math.log10(Math.max(PICARD_BOUND[CERT.certificate.iters_from_b_to_floating_point], 1e-6))) + 14}
        fill={ED.inkSoft}
        fontSize={9.5}
      >
        k={CERT.certificate.iters_from_b_to_floating_point}: floating point
      </text>
      <text x={16} y={padT + cH / 2} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5} transform={`rotate(-90 16 ${padT + cH / 2})`}>
        log10 a-priori bound |N_k &minus; N_cross|
      </text>
      <text x={padL + cW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        Picard iteration k, seed N_0 = b = {B.toExponential(0)}
      </text>
    </svg>
  );
}

export default function Imp34677BanachContractionCertificateViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Banach Contraction Certificate for the Crossover Fixed Point (imp-34650)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-34650 upgraded the imp-33723 pointwise slope |g_prime(N_cross)| &asymp; 0.045 into a full
        Banach existence/uniqueness certificate: a uniform Lipschitz constant L &lt; 1 over an explicit
        deep-tail interval I = [{A.toExponential(0)}, {B.toExponential(0)}], the self-map g(I) &sub; I, and
        geometric Picard convergence to N_cross &asymp; {N_CROSS.toExponential(4)}. The three panels below
        show (1) g_prime(N) crossing 1 at the imp-34675 closed-form edge N_star, (2) the self-map nesting
        g(I) inside I with N_cross bracketed, and (3) the a-priori Picard error bound collapsing to
        floating point.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        g_prime(N) crossing 1 near N &asymp; 1e8 (contraction boundary at N_star)
      </p>
      <GPrimeCrossingChart />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', margin: '1.5rem 0 0.5rem' }}>
        Self-map: g(I) &sub; I on I = [{A.toExponential(0)}, {B.toExponential(0)}], N_cross bracketed
      </p>
      <SelfMapChart />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', margin: '1.5rem 0 0.5rem' }}>
        Picard a-priori bound |N_k &minus; N_cross|, geometric convergence (L &asymp; {L})
      </p>
      <PicardConvergenceChart />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Finding:</strong> g_prime is positive and strictly
        decreasing, crossing 1 exactly at the imp-34675 closed-form edge N_star &asymp;{' '}
        {N_STAR.toExponential(4)} (below that, e.g. at N=1e8, g_prime &asymp; {EDGE.verification.g_prime_1e8}{' '}
        &gt; 1 and the map is not a contraction). On the certificate interval I the uniform constant is
        L = g_prime(a) &asymp; {L}, the self-map endpoints g(a) &asymp; {G_A.toExponential(4)} and
        g(b) &asymp; {G_B.toExponential(4)} both land inside I, and Picard iteration from the far seed
        N_0 = b converges geometrically to N_cross (k=5 relative error{' '}
        {CERT.certificate.a_priori_error_k5_rel}, floating point by k={CERT.certificate.iters_from_b_to_floating_point}).
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
        certificate, isRigorous false. Endpoint evaluations are IEEE-754 double precision, not
        interval-arithmetic (imp-34650a sub-gap open). Certifies a property of the inherited
        imp-3220/imp-3406 surrogate crossover map; C_C 1/8 ansatz untouched; C_mb GUE-conditional per
        imp-486 untouched; changes no bound; no operator positivity; no RH verdict, NO QED.
      </div>
    </div>
  );
}
