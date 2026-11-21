/**
 * @module mollified-barrier-certificate-2026-07-08
 * @fileoverview
 * The ONLY marginal survivor of the 79-agent novel-Λ-attacks review
 * (candidate 2): a mollified Polymath15 barrier certificate. Built and
 * interval-certified as a PILOT. Verdict: MATCHES-PT-cleaner — a better-
 * conditioned, machine-checkable recertification of the barrier non-vanishing
 * check, NOT a route below Λ ≤ 0.2.
 *
 * The key honest finding is a PROVABLE CEILING: for any mollifier M,
 *     min_R |M·f| / max_R |M|  ≤  min_R |f|,
 * so the min-modulus channel yields gain EXACTLY ZERO (max|M| eats all of it).
 * One-line proof: at z* = argmin|f|, |Mf|(z*) = |M(z*)|·min|f| ≤ max|M|·min|f|,
 * hence min|Mf| ≤ max|M|·min|f|. The optimizer always ties the trivial M = 1.
 *
 * What IS real: in the phase-blind TRIANGLE channel (the SOS-friendly one),
 * a degree-2/3 mollifier convolution-cancels the largest low-n tail terms and
 * converts a FAILING raw triangle bound into a PASSING one — a small (~12–25%
 * of the true min-modulus) gain that shrinks as the low-n window widens.
 *
 * Backend: python-flint acb ball arithmetic (sister repo .venv). Faithful P15
 * §8.3 pure-triangle regime, exact heat weights, TRUE incommensurate log(n)
 * frequencies (no commensuration — that is what eliminated the naive Fejér–Riesz
 * variant and is deliberately not reintroduced).
 *
 * HONEST SCOPE: no bound, no beat, no QED. No refereed bound is changed.
 */

export const MOLLIFIER_META = {
  date: '2026-07-08',
  verdict: 'MATCHES-PT-cleaner',
  headline:
    'A legitimate, better-conditioned, ball-arithmetic-certified barrier certificate that turns a ' +
    'FAILING phase-blind triangle bound (−0.155) into a PASSING SOS-friendly one (+0.206) — but it ' +
    'provably cannot beat PT (min|Mf|/max|M| ≤ min|f|, min-modulus gain exactly 0). Formalization ' +
    'infrastructure, not a beat.',
  setup:
    'Faithful Polymath15 §8.3 pure-triangle regime at x₀ = 2.83×10¹³ (N₁=1.5×10⁶ threshold), t=0.18 (lit), ' +
    'y∈[0.14142, 0.8], barrier width Wₓ=0.98995. f(s)=1+Σ c_n(s)·n^{−s} with the EXACT P15 heat weights ' +
    'c_n = exp((t/4)(log²n − L·log n)) and TRUE incommensurate log(n) frequencies. Short Dirichlet ' +
    'mollifier M(s)=1+Σ_{d=2}^{D} m_d·d^{−s}, D=2,3, no commensuration.',
  backend: 'python-flint acb ball arithmetic (sister repo .venv); float dense-scan cross-checked by interval re-verification',
};

// Provable ceiling on the min-modulus channel.
export const PROVABLE_CEILING = {
  statement: 'min_R |M·f| / max_R |M|  ≤  min_R |f|   for every mollifier M',
  proof: 'At z* = argmin|f|: |Mf|(z*) = |M(z*)|·min|f| ≤ max|M|·min|f|, so min|Mf| ≤ max|M|·min|f|.',
  consequence: 'Min-modulus-channel gain is EXACTLY 0. Confirmed across Nb∈{4,8,16,32}, over/under-mollified — the optimizer always ties the trivial M=1.',
};

// Representative numbers at the Nb = 8 low-n window.
export const PILOT_NUMBERS = [
  { label: '(ii) plain triangle margin |B|−|A|−|C|', value: '−0.1547', note: 'FAILS — phase-blind modulus bound is negative' },
  { label: 'true min-modulus min_R|f| (ideal ceiling)', value: '1.6753', note: 'the real object the barrier certifies' },
  { label: '(iii) max_R|M| (optimal D=2, m₂=−0.248)', value: '0.8338', note: 'the cost that eats the min-modulus gain' },
  { label: '(i) min_R|M·f|', value: '1.3968', note: '' },
  { label: 'candidate-2 recoverable = min|Mf|/max|M|', value: '1.6753', note: '= true ceiling exactly (ratio 1.0000) — zero gain' },
  { label: 'mollified triangle (1−tail(Mf))/max|M| (SOS-friendly)', value: '+0.206', note: 'was −0.155 → now PASSES (the real, small win)' },
  { label: 'arb-certified min_R|f| ≥', value: '1.6703', note: 'ball-arithmetic lower bound' },
  { label: 'arb-certified min|Mf|/max|M| ≥', value: '1.6645', note: 'ball-arithmetic lower bound' },
];

// The triangle-channel gain vs low-n window width Nb (real but shrinking).
export const TRIANGLE_CHANNEL_SCAN = [
  { Nb: 4,  plain: '+0.215', mollified: '+0.385', outcome: '≈1.8× better' },
  { Nb: 8,  plain: '−0.155', mollified: '+0.206', outcome: 'FAIL → PASS (rescued)' },
  { Nb: 16, plain: '−0.497', mollified: '+0.0004', outcome: 'barely passes' },
  { Nb: 32, plain: '−0.817', mollified: '−0.24', outcome: 'cannot rescue' },
];

export const TRIANGLE_CHANNEL_NOTE =
  'The gain is real but small and shrinks as the low-n window widens: a degree-2/3 mollifier only eliminates ' +
  'the n=2,3 terms (S1=0.313, S2=0.161; isolation (S1−S2)/S1≈0.48), and the incommensurate product ' +
  'regenerates mass at higher k=n·d. It recovers only ~12–25% of the true min-modulus (0.2–0.4 vs 1.7).';

export const MOLLIFIER_LIMITATIONS = [
  'Incommensurate log(nd) ⇒ Bohr/Lasserre, not one LMI. |Mf|² is almost-periodic (ℚ-linearly independent frequencies), so a single finite SOS/LMI cannot represent it — you need a truncated Bohr-lift / Lasserre moment hierarchy.',
  'Instantiating max|M| ⇒ bilinear (BMI). Optimizing m to maximize min|Mf|/max|M| couples design variables multiplicatively → non-convex BMI, not a single SDP.',
  'Gain hard-capped by dip isolation D_rest/S1. The recoverable triangle gain tracks the extremal dip’s isolation margin and cannot exceed the true min-modulus (the provable ceiling).',
  'Adding the real P15 error budget C = e_A+e_B+e_{C,0} only pushes the plain triangle more negative (strengthens the "mollifier rescues a narrow window" story) but does not move the ceiling.',
];

export const MOLLIFIER_CERTIFICATE = {
  meta: MOLLIFIER_META,
  provableCeiling: PROVABLE_CEILING,
  pilotNumbers: PILOT_NUMBERS,
  triangleChannelScan: TRIANGLE_CHANNEL_SCAN,
  triangleChannelNote: TRIANGLE_CHANNEL_NOTE,
  limitations: MOLLIFIER_LIMITATIONS,
};
