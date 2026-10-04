/**
 * @fileoverview dag3-dhblindln3-2026-09-28 — Arb certificate of Euler-blindness at conductor 5 on supports
 * 2a ≤ ln 3 (main) and 2a ≤ ln 11 (extension). Upgrades the MEASURED tier of tlb-dh-blind-2026-09-28 on
 * 0.783 < 2a ≤ ln 3 to computer-assisted, and extends it to ln 11. Two adversarial referee passes: neither refuted the
 * certificate (one independent from-scratch re-implementation reproduced every constant); corrections applied:
 * character specified, shared object is the gamma factor (not the functional equation), β_n = 2 Re c(n) n^{-1/2},
 * K = 3 error-budget sentence fixed, "sharp no-go" wording withdrawn (tier upgrade of a known qualitative point),
 * tightness re-measured.
 *
 * Objects. χ = the odd primitive quartic character mod 5 with χ(2) = i. Euler arm L(s,χ); Davenport–Heilbronn
 * F_DH = ((1−iκ)/2) L(s,χ) + ((1+iκ)/2) L(s,χ̄), κ = (√(10−2√5)−2)/(√5−1). Both are entire with the same gamma factor
 * (5/π)^{s/2} Γ((s+1)/2) and conductor 5, hence the same archimedean symbol Ω(t) = log(5/π) + Re ψ(3/4 + it/2).
 * They do NOT share a functional equation: Λ_F(s) = Λ_F(1−s), while Λ(s,χ) = ε Λ(1−s,χ̄) with
 * ε = 0.850650808 + 0.525731112i = √((5+√5)/10) + i√((5−√5)/10). For real h, W_χ = ½ W[L(s,χ)L(s,χ̄)] (self-dual).
 * Form: W(h) = (1/2π) ∫ [Ω(t) − Σ_{2≤n≤K} β_n cos(t log n)] |ĥ(t)|² dt, β_n = 2 Re c(n) n^{−1/2}, valid for
 * 2a ≤ log(K+1). At 2a ≤ ln 3 only n = 2 survives: β_2(DH) = √2 κ ln 2 = 0.2784707961, β_2(χ) = 0 (so W_χ = Q,
 * the archimedean form, for 2a ≤ ln 4).
 *
 * PROVED (elementary): symbol form above (conditional only on the explicit formula for the zero-sum identification);
 *  floor lemma Re ψ(x+iy) nondecreasing in |y| ⇒ σ(t) ≥ Ω(T) − Σ|β_n| for |t| ≥ T; nesting of supports; affinity in β_2.
 *  Admissible class: all real h ∈ L²(−a,a) (no pole terms, no ĥ(±i/2) = 0 constraint); DH extends to complex h.
 * CERTIFIED (Arb, python-flint 0.9.0, Legendre–Galerkin + Gauss–Legendre/Bernstein-ellipse bound + LDL + HS tail;
 *  computer-assisted, internally refereed twice, not externally reviewed):
 *  - 2a ≤ ln 3: W_DH(h) ≥ 0.2080723937 ‖h‖², W_χ(h) = Q(h) ≥ 0.2923087034 ‖h‖²;
 *  - 2a ≤ ln 3: Q − β_2 G(ln 2) ≥ 0.003925642346 ‖h‖² for every β_2 ∈ [−5/2, 22/25] (Re a(2) ∈ [−2.5503, 0.8977]);
 *  - 2a ≤ ln 4 / ln 7 / ln 9 / ln 11: DH ≥ 0.0405198 / 8.0376e-5 / 6.0971e-7 / 6.9271e-9; Euler arm ≥ 0.127675 / 0.0190529 /
 *    0.00416893 / 9.8742e-4.
 * CONDITIONAL: the classical Weil explicit formula for F_DH and L(s,χ) (validated numerically to ≤ 1.2e-13 in
 *  tlb-dh-blind; referee closed it to 1e-32 on 25–50 zeros); Trefethen Thm 4.5 quadrature bound; Arb correctness.
 * MEASURED: normalisation 3-way agreement ≤ 5.7e-14; unconstrained-Legendre Ritz upper bounds at ln 3 (DH 0.2087173,
 *  Q 0.2926891) put the certificate within 0.31% / 0.13% of the true infimum; all-real-h β_2 positivity interval
 *  [−2.5509, 0.8930] (odd sector cuts the negative end; the sibling's c(2) interval [−2.920, 0.637] is even-g only);
 *  true indefiniteness onset in β_2 between 0.88 and 0.90.
 * HEURISTIC: beyond ln 11 the obstruction is the crude floor Σ|β_n| (methodological); the true DH onset a* ∈ (1.70, 1.72]
 *  (measured, certified negative witness at 1.72) is a factor ≈ 1.43 above the certified a = ln(11)/2.
 *
 * Reading (corrected by referees): at conductor 5, for real test functions and 2a ≤ ln 11, Weil positivity has the same
 * truth value for the Euler product L(s,χ) and the RH-false same-gamma-factor F_DH, so no positivity certificate at these
 * supports can by itself encode the Euler product. This certifies and quantifies a known qualitative point (DH-BLIND proved
 * to 0.783; NS-RIGID (d); Route C; Yoshida / Connes–Consani small-support folklore). It is not a sharp radius and does not
 * obstruct extending the Route I ladder for ζ; the ζ transfer is an analogy. PT Lambda <= 0.2 stands. NO QED.
 *
 * Scripts: tmp/dag3-dhblindln3-arb-cert.py (+ -arb-*-K*-T*-N*.json/.log), tmp/dag3-dhblindln3-beta-scan.py,
 * tmp/dag3-dhblindln3-normcheck.py, tmp/dag3-dhblindln3-ritz-upper.py, tmp/dag3-dhblindln3-bessel-probe.py; referee:
 * tmp/dag3-dhblindln3-ref0-indep-cert.py, tmp/dag3-dhblindln3-ref0-explicit-{chi5,dh}.py, tmp/dag3-dhblindln3-ref1-xritz*.py.
 * Import-free. ASSERTIONS recompute κ, β_2, c(2) via the log-derivative recursion, the root number closed form, the
 * digamma floor monotonicity, the β_2 interval conversions, and the certified-lower ≤ Ritz-upper consistency.
 */

const LN2 = Math.log(2);
const EULER_GAMMA = 0.5772156649015329;
const KAPPA = (Math.sqrt(10 - 2 * Math.sqrt(5)) - 2) / (Math.sqrt(5) - 1);
const BETA2_DH = Math.SQRT2 * KAPPA * LN2;

/** Re ψ(x+iy) = ψ(x) + Σ_k y²/((k+x)((k+x)²+y²)); ψ(3/4) closed form; series truncated at kMax with integral tail. */
function rePsi34(y, kMax = 20000) {
  const x = 0.75; let s = -EULER_GAMMA + Math.PI / 2 - 3 * LN2;
  for (let k = 0; k < kMax; k++) { const u = k + x; s += (y * y) / (u * (u * u + y * y)); }
  const U = kMax + x; s += 0.5 * Math.log(1 + (y * y) / (U * U)); // ∫_U^∞ y²/(u(u²+y²)) du
  return s;
}
const omega = (t) => Math.log(5 / Math.PI) + rePsi34(t / 2);

export const DAG3_DHBLINDLN3 = Object.freeze({
  id: 'dag3-dhblindln3-2026-09-28',
  date: '2026-09-28',
  title: 'DH Euler-blindness certified in Arb on 2a ≤ ln 3 (and ln 11) at conductor 5',
  supersedesTier: 'tlb-dh-blind-2026-09-28: "MEASURED Euler-blind on 0.783 < 2a ≤ ln 3" → CERTIFIED (Arb) on 2a ≤ ln 11; its c2PositivityIntervalAtLn3 is even-g only',
  status:
    'CERTIFIED (computer-assisted, Arb; two internal referee passes incl. an independent re-implementation; not externally reviewed): '
    + 'W_DH ≥ 0.2080723937‖h‖² and W_χ = Q ≥ 0.2923087034‖h‖² for all real h ∈ L²(−a,a), 2a ≤ ln 3; both positive definite through '
    + '2a ≤ ln 11 (DH 6.93e-9, Euler arm 9.87e-4). Conditional on the classical explicit formula for the zero-sum reading. '
    + 'Tier upgrade of a known qualitative point, not a new or sharp no-go. No Λ bound moves. NO QED.',
  verdict:
    'SUCCESS (tier upgrade): the ARB-LEGE Galerkin machinery ports to the conductor-5 symbol; Euler-blindness of Weil positivity is '
    + 'certified on 2a ≤ ln 11 for real test functions. Not sharp (true DH onset a* ∈ (1.70, 1.72]); does not obstruct the Route I '
    + 'ladder for ζ; ζ transfer is an analogy. PT Lambda <= 0.2 stands; 0.1758354 remains a computer-assisted candidate. NO QED.',
  character: { modulus: 5, chiOfN: '(χ(1..4)) = (1, i, −i, −1)', parity: 'odd', reChi: [0, 1, 0, 0, -1], imChi: [0, 0, 1, -1, 0],
    rootNumber: [0.850650808, 0.525731112], rootNumberClosedForm: '√((5+√5)/10) + i√((5−√5)/10)' },
  setup: {
    kappa: KAPPA, beta2DH: 0.278470796113322584, beta2Chi: 0, c2DH: 0.196908588294,
    omegaFormula: 'Ω(t) = log(5/π) + Re ψ(3/4 + it/2)',
    betaFormula: 'β_n = 2 Re c(n) n^{−1/2} (real h); support 2a ≤ log(K+1) sees n ≤ K',
    sharedObject: 'gamma factor (5/π)^{s/2}Γ((s+1)/2) and conductor 5 (not the functional equation)',
  },
  certificates: [
    // twoA label, K, T, N, cDH lower, cChi lower
    { support: 'ln 3', twoA: Math.log(3), K: 2, T: 200, N: 200, cDH: 0.2080723937224665, cChi: 0.2923087034308, enclosureDH: [0.20807239372247, 0.20807239372346], normE: 2.0e-30, hsTail: 3.6e-27 },
    { support: 'ln 4', twoA: Math.log(4), K: 3, T: 200, N: 200, cDH: 0.04051982580, cChi: 0.1276749892, normE: 5.7e-22, hsTail: 6.61e-7, note: 'old bessel_j path; tails ~6e-7 subtracted in cLower (referee rerun T=250,N=280: tails 7e-23, DH ≥ 0.0406229, χ ≥ 0.1277378)' },
    { support: 'ln 7', twoA: Math.log(7), K: 6, T: 200, N: 300, cDH: 8.037563849e-5, cChi: 0.01905285268, normE: 1.6e-27, hsTail: 7e-18 },
    { support: 'ln 9', twoA: Math.log(9), K: 8, T: 200, N: 340, cDH: 6.097059991e-7, cChi: 0.004168927325, normE: 1.6e-27, hsTail: 7e-18 },
    { support: 'ln 11', twoA: Math.log(11), K: 10, T: 400, N: 700, cDH: 6.927132818e-9, cChi: 9.874190175e-4, normE: 1.6e-27, hsTail: 7e-18, note: 'DH LDL at 1024 bits' },
  ],
  independentRuns: { lnThree: [[100, 120, 0.2072460362], [20, 40, 0.1974210772]], refereeIndep: { dhT250N240: 0.20822253043, archT250N240: 0.29239626541, k10DH: 6.9181e-9, k10Chi: 9.87419e-4 } },
  betaInterval: {
    certified: { lo: -5 / 2, hi: 22 / 25, cAtLo: 0.02314630512, cAtHi: 0.003925642346, cMin: 0.003925642346 },
    reA2Certified: [-2.5503, 0.8977],
    measuredAllRealH: [-2.5509, 0.8930], measuredEvenOnly: [-4.1059, 0.8930], measuredOddOnly: [-2.5509, 4.4224],
    c2AllRealH: [-1.8038, 0.6315], siblingEvenOnlyC2: [-2.920238, 0.637232],
    arbLowerFailures: [[0.9, -0.00331]], refereeRitzIndefiniteAt: 0.9, onsetBracket: [0.88, 0.90],
  },
  ritzUpper: {
    // unconstrained Legendre Ritz (referee), certified lower below
    lnThreeDH: [0.2080724, 0.2087173], lnThreeQ: [0.2923087, 0.2926891],
    lnThreeBeta088: [0.003925642346, 0.005373], lnThreeBetaM25: [0.02314630512, 0.026957],
    lnElevenDH: [6.927132818e-9, 7.84e-9], lnElevenChi: [9.874190175e-4, 9.9075e-4],
    superseded: 'basis (1−x²/a²)P_n values 0.21494 / 0.2098–0.2132 were unconverged',
  },
  measured: { normalisationRelDiff: 5.7e-14, dhOnsetMeasured: [1.70, 1.72], certifiedHalfSupportMax: Math.log(11) / 2 },
  refereeCorrections: [
    'Error-budget sentence: ‖E‖ ≤ 1.6e-27 and tails ≤ 7e-18 hold for K = 2, 6, 8, 10; the K = 3 runs have tails ≈ 6e-7 and ‖E‖ ≈ 6e-22 (included in cLower; constants stand).',
    'Euler arm is the odd quartic character with χ(2) = i (the quadratic character mod 5 is even and has a different symbol).',
    'Shared: gamma factor + conductor (archimedean symbol Ω), not the functional equation (root number ε = 0.85065 + 0.52573i for L(s,χ)).',
    'β_n = 2 Re c(n) n^{−1/2} (real h).',
    'Not a sharp no-go: certified radius ln 11 vs true onset a* ∈ (1.70, 1.72]; qualitative content known (DH-BLIND to 0.783, NS-RIGID (d), Route C, folklore); present as a tier upgrade.',
    'DH margin at ln 11 (6.93e-9) is essentially at the floor: certified but not robust.',
    'W_χ = Q holds through 2a ≤ ln 4 (G(ln 4) = 0 at the endpoint).',
  ],
  tiers: {
    proved: ['symbol form (given explicit formula)', 'floor lemma (Re ψ monotone in |y|)', 'support nesting', 'affinity in β_2', 'admissible class = all real h'],
    certified: ['c_DH ≥ 0.2080723937, c_χ ≥ 0.2923087034 at ln 3', 'β_2 ∈ [−5/2, 22/25] ⇒ ≥ 0.003925642346', 'ln 4 / ln 7 / ln 9 / ln 11 constants'],
    conditional: ['classical explicit formula for F_DH and L(s,χ)', 'Trefethen quadrature bound', 'Arb correctness'],
    measured: ['normalisation check', 'Ritz upper bounds (0.31% / 0.13% tightness)', 'parity-sector β_2 intervals'],
    heuristic: ['obstruction past ln 11 is methodological', 'ζ transfer is an analogy'],
  },
  nextStep:
    'Bake the Arb endpoints into tlb-dh-blind (move 0.783 < 2a ≤ ln 11 from measured to certified; add the all-real-h correction to its even-only '
    + 'c(2) interval). Optional: push past ln 11 with a sharper almost-periodic floor (dependencies 4 = 2², 8 = 2³, 9 = 3²) and a C-level Arb Cholesky; '
    + 'certify the complex-h Euler-arm form (sine term).',
  scripts: [
    'tmp/dag3-dhblindln3-arb-cert.py', 'tmp/dag3-dhblindln3-beta-scan.py', 'tmp/dag3-dhblindln3-normcheck.py', 'tmp/dag3-dhblindln3-ritz-upper.py',
    'tmp/dag3-dhblindln3-bessel-probe.py', 'tmp/dag3-dhblindln3-ref0-indep-cert.py', 'tmp/dag3-dhblindln3-ref0-explicit-chi5.py',
    'tmp/dag3-dhblindln3-ref0-explicit-dh.py', 'tmp/dag3-dhblindln3-ref1-xritz.py', 'tmp/dag3-dhblindln3-ref1-xritz-k10.py',
  ],
});

const M = DAG3_DHBLINDLN3;

export const DAG3_DHBLINDLN3_ASSERTIONS = Object.freeze([
  {
    id: 'dhblindln3-kappa-beta2',
    holds: () => Math.abs(KAPPA - 0.2840790438404123) < 1e-15 && Math.abs(BETA2_DH - M.setup.beta2DH) < 1e-15
      && Math.abs(KAPPA * LN2 - M.setup.c2DH) < 1e-12,
    why: 'κ = (√(10−2√5)−2)/(√5−1); β_2(DH) = √2 κ ln 2 = 0.2784707961; c_DH(2) = κ ln 2.',
  },
  {
    id: 'dhblindln3-euler-arm-re-c2-zero',
    holds: () => {
      // c(n) recursion for χ (complex): a(n) log n = Σ_{d|n} c(d) a(n/d); Re c(2) = Λ(2) Re χ(2) = 0, Re c(4) = −ln 2
      const cr = [0, 0, 0, 0, 0], ci = [0, 0, 0, 0, 0], ar = M.character.reChi, ai = M.character.imChi;
      for (let n = 2; n <= 4; n++) {
        let sr = ar[n % 5] * Math.log(n), si = ai[n % 5] * Math.log(n);
        for (let d = 2; d < n; d++) if (n % d === 0) { const r = ar[(n / d) % 5], i = ai[(n / d) % 5]; sr -= cr[d] * r - ci[d] * i; si -= cr[d] * i + ci[d] * r; }
        cr[n] = sr; ci[n] = si;
      }
      return Math.abs(cr[2]) < 1e-15 && Math.abs(ci[2] - LN2) < 1e-15 && Math.abs(cr[4] + LN2) < 1e-12 && ar[4] === -1;
    },
    why: 'χ(2) = i, χ(4) = −1 (odd): Re c_χ(2) = 0, so at 2a ≤ ln 3 the Euler-arm form is Q; Re c_χ(4) = −ln 2 enters from ln 4.',
  },
  {
    id: 'dhblindln3-root-number-closed-form',
    holds: () => {
      const [re, im] = M.character.rootNumber;
      return Math.abs(re - Math.sqrt((5 + Math.sqrt(5)) / 10)) < 1e-9 && Math.abs(im - Math.sqrt((5 - Math.sqrt(5)) / 10)) < 1e-9
        && Math.abs(re * re + im * im - 1) < 1e-8;
    },
    why: 'L(s,χ) is not self-dual: ε = √((5+√5)/10) + i√((5−√5)/10), |ε| = 1; only the gamma factor is shared with F_DH.',
  },
  {
    id: 'dhblindln3-floor-lemma-monotone',
    holds: () => {
      let prev = -Infinity, ok = true;
      for (let y = 0; y <= 200; y += 5) { const v = rePsi34(y, 4000); ok = ok && v >= prev - 1e-12; prev = v; }
      const om0 = omega(0);
      return ok && Math.abs(om0 - (-0.621152853202)) < 1e-9 && omega(400) > omega(200);
    },
    why: 'Re ψ(3/4 + iy) nondecreasing in |y| (floor lemma); Ω(0) = log(5/π) + ψ(3/4) = −0.62115 matches tlb-dh-blind.',
  },
  {
    id: 'dhblindln3-certificates-positive-nested',
    holds: () => {
      const c = M.certificates;
      const pos = c.every((x) => x.cDH > 0 && x.cChi > 0 && x.twoA <= Math.log(x.K + 1) + 1e-15);
      const dec = c.every((x, i) => i === 0 || (x.cDH < c[i - 1].cDH && x.cChi < c[i - 1].cChi && x.twoA > c[i - 1].twoA));
      const enc = c[0].enclosureDH[0] <= c[0].cDH + 1e-14 && c[0].cDH <= c[0].enclosureDH[1];
      const tails = c.every((x) => x.hsTail < x.cDH || x.K === 3) && c.filter((x) => x.K !== 3).every((x) => x.hsTail <= 7e-18 || x.K === 2);
      return pos && dec && enc && tails && c[0].cChi > c[0].cDH;
    },
    why: 'All five Arb constants are positive, decrease with support, respect 2a ≤ log(K+1); K = 3 tails (~6e-7) are the referee-flagged exception.',
  },
  {
    id: 'dhblindln3-beta-interval-contains-both-functions',
    holds: () => {
      const b = M.betaInterval.certified;
      const inside = (x) => b.lo < x && x < b.hi;
      const a2lo = b.lo / Math.SQRT2 / LN2, a2hi = b.hi / Math.SQRT2 / LN2;
      const c2 = M.betaInterval.measuredAllRealH.map((x) => x / Math.SQRT2);
      return inside(0) && inside(BETA2_DH) && b.cMin === Math.min(b.cAtLo, b.cAtHi) && b.cMin > 0
        && Math.abs(a2lo - M.betaInterval.reA2Certified[0]) < 1e-4 && Math.abs(a2hi - M.betaInterval.reA2Certified[1]) < 1e-4
        && Math.abs(c2[0] - M.betaInterval.c2AllRealH[0]) < 1e-4 && Math.abs(c2[1] - M.betaInterval.c2AllRealH[1]) < 1e-4
        && M.betaInterval.measuredAllRealH[0] > M.betaInterval.measuredEvenOnly[0]
        && M.betaInterval.onsetBracket[0] >= b.hi && M.betaInterval.arbLowerFailures[0][0] >= M.betaInterval.onsetBracket[1];
    },
    why: 'Euler arm (β_2 = 0) and DH (0.2785) lie strictly inside the certified [−5/2, 22/25]; affine ⇒ min endpoint constant; odd sector cuts the even-only interval.',
  },
  {
    id: 'dhblindln3-lower-le-ritz-upper',
    holds: () => {
      const r = M.ritzUpper;
      const pairs = [r.lnThreeDH, r.lnThreeQ, r.lnThreeBeta088, r.lnThreeBetaM25, r.lnElevenDH, r.lnElevenChi];
      return pairs.every(([lo, up]) => lo <= up) && (r.lnThreeDH[1] - r.lnThreeDH[0]) / r.lnThreeDH[1] < 0.0032
        && (r.lnThreeQ[1] - r.lnThreeQ[0]) / r.lnThreeQ[1] < 0.0014;
    },
    why: 'Every certified lower bound sits below the referee’s unconstrained Ritz upper bound; gap 0.31% (DH) / 0.13% (Q) at ln 3.',
  },
  {
    id: 'dhblindln3-not-sharp',
    holds: () => M.measured.certifiedHalfSupportMax < M.measured.dhOnsetMeasured[0] && M.measured.dhOnsetMeasured[0] / M.measured.certifiedHalfSupportMax > 1.4
      && Math.log(3) / 2 < M.measured.certifiedHalfSupportMax,
    why: 'Certified a = ln(11)/2 = 1.199 is a factor ≈ 1.43 below the measured DH onset (1.70, 1.72]: not a sharp radius.',
  },
  {
    id: 'dhblindln3-honest-scope',
    holds: () => /PT Lambda <= 0\.2 stands/.test(M.verdict) && /NO QED/.test(M.verdict) && /NO QED/.test(M.status)
      && /not a new or sharp no-go/.test(M.status) && /analogy/.test(M.verdict) && /explicit formula/.test(M.status)
      && !/sharp no-go for the Route I/.test(M.verdict),
    why: 'Referee corrections: tier upgrade, not sharp, ζ transfer analogy, explicit formula conditional.',
  },
]);

export default DAG3_DHBLINDLN3;
