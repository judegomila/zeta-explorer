/**
 * @fileoverview route-28-selberg-zeta-freeze-sandbox-2026-10-12 — roadmap route 28 (batch 7, group E): the freeze calculus run on the
 * prime-geodesic Euler product of the PSL2(Z) Selberg zeta function, a sandbox where the HALF-PLANE RH-analogue (no zeros in Re s > ½
 * except s = 1) is a theorem. One run plus one adversarial internal referee pass with independent re-implementation (not refuted; severity
 * major: the headline RH-blindness inference had no RH-false control). The referee corrections are applied below.
 *
 * PROVED (elementary, project-internal, not refereed beyond this pass): (a) Theorem U on the geodesic monoid: for a finite set G of primitive
 *  classes the sieve algebra is span{T_D : D ⊆ G} (dimension 2^{|G|}); every freeze word followed by a linear functional is L(diag(m)c) for a
 *  unique m; the 25-defect telescope and five-shell identities are pure telescoping algebra, so they hold verbatim with no zero information.
 *  (b) Sieved centre on σ > 1: Π_γF = F/E_γ(s), R_G F = F/A_G, the freeze cocycle is truncation-boundary terms only. (c) Collapse (referee-
 *  corrected hypothesis): if c and L are invariant under norm-preserving permutations of primitive classes (true for the Selberg monoid series;
 *  NOT "c_a depends only on N(a)", which fails since c = ∏(−N_γ^{−k})), the span of freeze scalars has dimension ≤ ∏(m_i + 1) for G a union of
 *  complete equal-norm blocks: 72 instead of 256 for the first 8 classes (traces 3–6, multiplicities 1, 2, 2, 3). (d) Modulus-first gate is
 *  confined to σ > 1 (Σ_γ N(γ)^{−1} = ∞ by the prime geodesic theorem), exactly as for ζ under PNT.
 * CERTIFIED: the length spectrum for 3 ≤ t ≤ 8000 (N ≤ 6.4e7; 3,784,618 primitive classes) by exact integer counts of reduced indefinite-form
 *  cycles in one internal C program; referee re-counted H(t) for t = 3..160 with Zagier reduction (0 mismatches). Nothing else is
 *  interval-certified; transfer-operator truncation error is measured, not bounded.
 * CONDITIONAL (cited): the half-plane RH-analogue (self-adjoint Laplacian, λ_1 = ¼ + 9.5337² ≈ 91.14, no exceptional eigenvalues); Z = det(1 − L_s²)
 *  (Mayer 1991); Z vanishes at s = ρ/2 (scattering poles of φ = ξ(2s−1)/ξ(2s)), so in 0 < Re s < ½ the sandbox contains RH itself. ψ_Γ error:
 *  x^{3/4} from the RH-analogue alone; Iwaniec 35/48, Luo–Sarnak 7/10, Soundararajan–Young 25/36, all with arithmetic input (Kuznetsov, L-values
 *  via Bykovskii). Refinement by residue classes leads to Γ(q), which is NOT KNOWN to stay RH-analogue-true (Selberg eigenvalue conjecture open;
 *  Kim–Sarnak 975/4096; verified for small levels).
 * MEASURED (referee reproduced the starred items independently): Euler product vs Mayer det at s = 2: 6.1e-9 (X = 3e5)*; π_Γ/Li = 0.99941 at
 *  6e7*; ψ_Γ step-centred error ≈ −1.93√x (−2 from the simple pole at s = ½)*, residual R/√x std 1.19, max 4.80*; sup|E|/x^{3/4} 1.26 → 0.11*;
 *  σ*(0) ζ 1.578 / Selberg 1.173*, σ*(1000) 1.04109 / 1.04082; Theorem U identity residuals ≤ 1e-15; phase gate on σ = 0.55, t ≤ 26: Selberg
 *  Re Z < 0 on 6.1% of the grid vs 0% for ζ (min Re ζ = 0.014)*; density-matched ζ at t ≈ 4.2e4: 13.1% / 7.9% / 1.0% / 0% with 0/1/5/25 primes;
 *  Chebotarev deviation × √n ≤ 1.18 for p ≤ 13.
 * HEURISTIC: the gate differences track zero density and shortest-geodesic size (CONFOUNDED by the ρ/2 zero family at Re s = ¼, ≈ 0.6 per unit
 *  in t ∈ [15, 26], with no counterpart near ζ's σ = 0.55 line); no polynomial-length direct/reflected bridge in the sandbox (Berry–Keating
 *  needs exp(πt/6) pseudo-orbits); "closing the strict-0.14 contract is neither necessary for RH nor evidence about it" (moved from the verdict);
 *  "the freeze calculus cannot see RH" is INHERITED from tlb-dh-blind / dag3-dhblindln3 / NS-RIGID, NOT shown here (no RH-false control run).
 *
 * No Λ bound moves. No refereed bound is changed; RH open; NO QED. Import-free. ROUTE_28_ASSERTIONS recompute live: geodesic norms ε_t² for
 * traces 3–6, the collapse dimension 72 vs 256, λ_1, ζ's modulus-first threshold σ*(0) (root of ζ(σ)/ζ(2σ) = 2), the ρ/2 heights and their
 * density in [15, 26], the Berry–Keating length exponent, and the ordering of the prime-geodesic exponents.
 */

const { PI, abs, sqrt, log } = Math;

export const ROUTE_28 = Object.freeze({
  id: 'route-28-selberg-zeta-freeze-sandbox-2026-10-12',
  route: 28,
  date: '2026-10-12',
  title: 'Route 28: freeze calculus on the PSL2(Z) Selberg zeta — every tested object behaves like ζ\'s; no RH-false control, so no blindness theorem here',
  status: 'done',
  headline: 'In the PSL2(Z) sandbox, where the half-plane RH-analogue (no zeros in Re s > ½ except s = 1) is a theorem, all tested freeze-calculus '
    + 'objects behave like their ζ counterparts at accessible scales. Theorem U, the telescope and the five-shell identity are algebraic and carry no '
    + 'zero information. The gate statistics differ from ζ by amounts consistent with zero density and shortest-geodesic size (heuristic attribution, '
    + 'confounded by the ρ/2 zero family). No RH-false control was run, so this route does not show that the freeze calculus is blind to RH; that '
    + 'conclusion is inherited from the project\'s DH-blind work. Caveat: Z_PSL2(Z) has infinitely many zeros off Re s = ½ (at ρ/2) and no s ↔ 1−s '
    + 'symmetry, so its RH-analogue is only the half-plane statement.',

  spectrum: Object.freeze({ tMax: 8000, NMax: 6.4e7, primitive: 3784618, piOverLi: 0.99941, refereeZagierMismatches: 0, refereeTRange: Object.freeze([3, 160]),
    norms: Object.freeze([[3, 6.8541, 1], [4, 13.9282, 2], [5, 22.9564, 2], [6, 33.9706, 3]]) }),
  transfer: Object.freeze({ eulerVsDetS2: Object.freeze([[1e3, 4.0e-5], [1e4, 1.2e-6], [1e5, 3.6e-8], [3e5, 6.1e-9]]), Z2Referee: 0.9537995978, Z2Euler: 0.9537995986,
    absZr1: 4.3e-13, absZrho1Half: 1.4e-14, poleLimit: -1.887, r: Object.freeze([9.5337, 12.1730, 13.7798]) }),
  pgt: Object.freeze({ sqrtCoeff: -1.93, sqrtLogCoeff: -0.005, sqrtOnlyFit: -2.013, meanJumpOverSqrt: 2.0, residualStd: 1.19, residualMax: 4.80,
    supOverX34: Object.freeze([1.26, 0.11]), exponents: Object.freeze({ rhAnalogue: 0.75, iwaniec: 35 / 48, luoSarnak: 7 / 10, soundYoung: 25 / 36, conjecture: 0.5 }) }),
  gate: Object.freeze({ sigmaStar: Object.freeze([[0, 1.578017, 1.17310], [1, 1.335, 1.143], [25, 1.0864, 1.0794], [100, 1.0624, 1.0606], [1000, 1.04109, 1.04082]]) }),
  freeze: Object.freeze({ identityResidual: 1.0e-15, signatureClasses: 256, invariantDim: 72,
    cocycle: Object.freeze([['1.2+9.53i', 2.96e-4, 1.52e-4], ['0.75+12i', 3.53e-2, 4.14e-2]]) }),
  phaseGate: Object.freeze({ sigma055: Object.freeze({ selbergNegFrac: 0.061, zetaNegFrac: 0, zetaMinRe: 0.014, selberg25Geodesics: 0.002, selbergMaxArg: 2.67, zetaMaxArg: 1.53 }),
    densityMatchedZeta: Object.freeze({ height: 4.2e4, negFrac: Object.freeze([[0, 0.131], [1, 0.079], [5, 0.010], [25, 0]]) }),
    selbergBySieve: Object.freeze([[0, 0.061], [1, 0.025], [5, 0.019], [25, 0.002]]) }),
  chebotarevMaxDevTimesSqrtN: 1.18,
  zetaZeros: Object.freeze([14.134725, 21.022040, 25.010858, 30.424876, 32.935062, 37.586178, 40.918719, 43.327073, 48.005151, 49.773832, 52.970321, 56.446248]),

  refereeKilled: Object.freeze([
    'headline/verdict overreach (major): "the freeze calculus cannot see whether RH holds" needs an RH-false control; every comparison paired two (presumably) RH-true objects. Only the trivial algebraic independence (Theorem U, telescope, five-shell) is shown; the gate-statistic blindness is inherited from tlb-dh-blind / dag3-dhblindln3 / NS-RIGID — downgraded to heuristic',
    '"every freeze object behaves the same as for ζ" contradicts the data: σ = 0.55, t ≤ 26: Selberg Re Z < 0 on 6.1% vs 0% for ζ (referee: min Re ζ = 0.014); the density attribution rests on one matched control that ignores the ρ/2 family (≈ 0.6 per unit in [15, 26]) — confounded, heuristic',
    'sandbox is not RH-true in ζ\'s sense: no s ↔ 1−s symmetry (scattering factor) and infinitely many zeros at ρ/2 off Re s = ½ regardless of RH; the half-plane statement is strictly weaker than "all zeros on the line"',
    '"does not stay RH-true under the refinement" → "is not known to stay RH-true" (Selberg eigenvalue conjecture open, not refuted)',
    'collapse hypothesis misstated: c_a does not depend only on N(a) ((γ,0) and (γ,1) share N, differ in c); correct: c and L invariant under norm-preserving permutations; the 72 is a rank bound for G a union of complete equal-norm blocks',
    'verdict-level "strict-0.14 contract neither necessary for RH nor evidence about it" is an extrapolation from one sandbox — moved to heuristic',
    'low novelty: the three algebraic proved items restate the closed class Theorem U on a new monoid',
    'not independently re-run (stay measured, plausible): phase-ext growth 0.64 → 1.43 to t = 40, ζ t = 4.2e4 matched-density percentages, cocycle/weld sizes, strip partial sums, Chebotarev ≤ 1.18, σ*(k) for k ≥ 1',
  ]),
  nextStep: 'Run the RH-true / RH-false Selberg pair (the Davenport–Heilbronn test for the sandbox): (a) a cocompact arithmetic group (quaternion or '
    + '(2,3,7) triangle group; no cusp, no ρ/2 contamination); (b) a same-shape group with an exceptional eigenvalue (short separating geodesic or a '
    + 'noncongruence subgroup), where the half-plane analogue fails by a real zero in (½, 1). Run the same freeze objects (σ* thresholds, cocycle and '
    + 'weld sizes, the phase gate at matched density and shortest geodesic, prime-geodesic secondary terms) and check whether any statistic separates them.',
  files: Object.freeze(['tmp/routes-b7-r28-geodesics.c', 'tmp/routes-b7-r28-geodesics-t8000.txt', 'tmp/routes-b7-r28-transfer.py', 'tmp/routes-b7-r28-pgt-mid.py',
    'tmp/routes-b7-r28-freeze.py', 'tmp/routes-b7-r28-phase.py', 'tmp/routes-b7-r28-phase-ext.py', 'tmp/routes-b7-r28-zeta-matched.py', 'tmp/routes-b7-r28-chebotarev.py',
    'tmp/routes-b7-r28-summary.json', 'tmp/routes-b7-ref28-forms.py', 'tmp/routes-b7-ref28-transfer.py', 'tmp/routes-b7-ref28-euler.py']),
  verdict: 'Route 28 is done as a map. The freeze calculus built on the PSL2(Z) prime-geodesic Euler product (exact length spectrum to N ≤ 6.4e7; '
    + 'Mayer determinant agrees to 6e-9) reproduces Theorem U, the telescope and the five-shell identities verbatim (pure algebra), keeps the '
    + 'modulus-first gate at σ > 1, and gives cocycle, weld, partial-sum and phase-gate statistics of the same order as ζ\'s, with differences '
    + 'attributed heuristically to zero density and shortest-geodesic size (confounded by the ρ/2 family). The half-plane RH-analogue comes from the '
    + 'self-adjoint Laplacian and does not supply the Euler-side square-root cancellation (ψ_Γ error proved to x^{25/36}, measured ≈ √x). No RH-false '
    + 'control was run, so RH-blindness of the freeze calculus is not shown here (it is inherited from the DH-blind work). No Λ bound moves. '
    + 'No refereed bound is changed; RH open; NO QED.',
});

const R = ROUTE_28;
const zetaReal = (s) => { const N = 50; let sum = 0; for (let n = 1; n < N; n += 1) sum += n ** -s; sum += N ** (1 - s) / (s - 1) + 0.5 * N ** -s;
  const B = [1 / 6, -1 / 30, 1 / 42, -1 / 30]; let fact = 1; let poch = s;
  for (let k = 1; k <= 4; k += 1) { fact *= (2 * k - 1) * (2 * k); sum += (B[k - 1] / fact) * poch * N ** (-s - 2 * k + 1); poch *= (s + 2 * k - 1) * (s + 2 * k); } return sum; };
const normOfTrace = (t) => ((t + sqrt(t * t - 4)) / 2) ** 2;

export const ROUTE_28_ASSERTIONS = Object.freeze([
  {
    id: 'r28-geodesic-norms',
    holds: () => R.spectrum.norms.every(([t, N]) => abs(normOfTrace(t) - N) < 1e-4) && normOfTrace(3) > 2 * 3,
    why: 'N(γ) = ε_t², ε_t = (t + √(t² − 4))/2: traces 3, 4, 5, 6 give 6.8541, 13.9282, 22.9564, 33.9706; the shortest norm 6.854 exceeds the smallest prime 2 by > 3×.',
  },
  {
    id: 'r28-collapse-dimension',
    holds: () => { const ms = R.spectrum.norms.map(([, , m]) => m); const total = ms.reduce((a, b) => a + b, 0);
      return total === 8 && 2 ** total === R.freeze.signatureClasses && ms.reduce((a, m) => a * (m + 1), 1) === R.freeze.invariantDim; },
    why: 'Multiplicities 1, 2, 2, 3 (8 classes): full sieve algebra 2^8 = 256, permutation-invariant span ∏(m_i + 1) = 72 (rank bound, G a union of complete equal-norm blocks).',
  },
  {
    id: 'r28-lambda1',
    holds: () => abs(0.25 + R.transfer.r[0] ** 2 - 91.14) < 0.01 && R.transfer.r.every((r) => r * r + 0.25 > 0.25),
    why: 'λ_1 = ¼ + r_1² = ¼ + 9.5337² = 91.14 > ¼: no exceptional eigenvalue, the cited source of the half-plane RH-analogue.',
  },
  {
    id: 'r28-zeta-gate-threshold',
    holds: () => { let lo = 1.1; let hi = 3; for (let i = 0; i < 70; i += 1) { const m = (lo + hi) / 2; if (zetaReal(m) / zetaReal(2 * m) > 2) lo = m; else hi = m; }
      const g = R.gate.sigmaStar; return abs(lo - g[0][1]) < 1e-5 && g.every(([, z, s]) => s <= z) && abs(g[4][1] - g[4][2]) < 3e-4
        && g.every(([, z], i, a) => i === 0 || z < a[i - 1][1]); },
    why: 'σ*(0) for ζ is the root of ∏(1 + p^{−σ}) = ζ(σ)/ζ(2σ) = 2: 1.578017 (live); Selberg σ* ≤ ζ\'s at every k (shortest geodesic 6.85 vs prime 2) and within 3e-4 at k = 1000.',
  },
  {
    id: 'r28-rho-half-family',
    holds: () => { const h = R.zetaZeros.map((g) => g / 2); const inWin = h.filter((x) => x >= 15 && x <= 26).length;
      return abs(h[0] - 7.0674) < 1e-3 && inWin === 7 && abs(inWin / 11 - 0.64) < 0.01 && abs(R.transfer.absZrho1Half) < 1e-12; },
    why: 'Z vanishes at ρ/2 (Re ¼ under RH): heights γ/2 = 7.07, …; 7 of them in t ∈ [15, 26] (≈ 0.6 per unit), the confounder of the density-matched control; |Z(ρ₁/2)| = 1.4e-14 measured.',
  },
  {
    id: 'r28-pgt-and-bridge-length',
    holds: () => { const e = R.pgt.exponents; return e.conjecture < e.soundYoung && e.soundYoung < e.luoSarnak && e.luoSarnak < e.iwaniec && e.iwaniec < e.rhAnalogue
      && abs(R.pgt.sqrtCoeff + 2) < 0.1 && abs(R.pgt.sqrtOnlyFit + 2) < 0.02 && R.pgt.supOverX34[1] < R.pgt.supOverX34[0]
      && abs((PI / 3) / 2 - PI / 6) < 1e-15; },
    why: 'Exponents ½ < 25/36 < 7/10 < 35/48 < ¾ (RH-analogue alone gives ¾); the −2√x term from the pole at s = ½ fits −1.93 (−2.013 √x-only); Berry–Keating length exp(area·t/2) = exp(πt/6), area π/3.',
  },
  {
    id: 'r28-gate-statistics-and-scope',
    holds: () => { const p = R.phaseGate; return p.sigma055.selbergNegFrac > p.sigma055.zetaNegFrac && p.sigma055.zetaMinRe > 0
      && p.densityMatchedZeta.negFrac.every(([, f], i, a) => i === 0 || f <= a[i - 1][1]) && p.selbergBySieve.every(([, f], i, a) => i === 0 || f <= a[i - 1][1])
      && R.status === 'done' && /No RH-false/.test(R.verdict) && /not shown here/.test(R.verdict) && /refereed bound is changed/i.test(R.verdict)
      && /NO QED/.test(R.verdict) && /half-plane/.test(R.headline) && R.refereeKilled.length === 8; },
    why: 'Measured difference kept (6.1% vs 0%), monotone in the number of sieved primes/geodesics; RH-blindness not claimed (no RH-false control); half-plane caveat in the headline; no Λ change; no QED.',
  },
]);

export default ROUTE_28;
