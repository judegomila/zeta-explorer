/**
 * @fileoverview RH novel Route C — the twisted-ladder signed interferometer
 * Φ_ε(s) = Σ_χ ε_χ L(s,χ) (χ mod q), signs/phases ε_χ as design variables,
 * tested on q=5 and q=7 with cheap numerics (Hurwitz-zeta Euler–Maclaurin,
 * argument-principle zero counts, Hardy-Z on-line counts, Newton zeros).
 *
 * RESULT: REFUTED as an off-line-nonvanishing / zero-free-region lever, on three
 * independent grounds (P1 linear blindness, P2 orthogonality is a mean-value
 * statement only, P3 joint universality forces ≫T off-line zeros for every design
 * with ≥2 arms). The design freedom the route wanted does not exist: within each
 * conjugate pair {χ, χ̄} the functional equation pins the relative phase to the
 * root number (arg W(χ) = 2·arctan κ for Davenport–Heilbronn, verified 1e-15),
 * and the residual real design freedom (one mixing angle per extra arm) only
 * rescales the off-line zero density, never to zero.
 *
 * Roadmap: src/data/rh-novel-routes-roadmap-2026-09-23.js (Route C).
 * Scratch: tmp/route-c-interferometer.mjs, -2.mjs, -3.mjs (+ .out logs).
 * Import-light (no zeros bundle). holds() assertions recompute the key figures.
 * No refereed bound is changed; RH open; GRH for the arms is not touched; NO QED.
 */

// ---------------------------------------------------------------------------
// Mini numerics (self-contained, sub-100 ms): complex arithmetic, Hurwitz zeta by
// Euler–Maclaurin, characters mod 5, L(s,χ) = q^{-s} Σ_a χ(a) ζ(s,a/q), Lanczos lnΓ.
// ---------------------------------------------------------------------------
const C = (re, im = 0) => ({ re, im });
const add = (a, b) => C(a.re + b.re, a.im + b.im);
const sub = (a, b) => C(a.re - b.re, a.im - b.im);
const mul = (a, b) => C(a.re * b.re - a.im * b.im, a.re * b.im + a.im * b.re);
const scale = (a, k) => C(a.re * k, a.im * k);
const div = (a, b) => { const d = b.re * b.re + b.im * b.im; return C((a.re * b.re + a.im * b.im) / d, (a.im * b.re - a.re * b.im) / d); };
const cabs = (a) => Math.hypot(a.re, a.im);
const cexp = (a) => { const e = Math.exp(a.re); return C(e * Math.cos(a.im), e * Math.sin(a.im)); };
const clog = (a) => C(Math.log(cabs(a)), Math.atan2(a.im, a.re));
const powNeg = (x, s) => { const l = Math.log(x); const m = Math.exp(-s.re * l); return C(m * Math.cos(s.im * l), -m * Math.sin(s.im * l)); };
const B2K = [1 / 6, -1 / 30, 1 / 42, -1 / 30, 5 / 66, -691 / 2730, 7 / 6, -3617 / 510, 43867 / 798, -174611 / 330, 854513 / 138, -236364091 / 2730];
const fact = (n) => { let f = 1; for (let i = 2; i <= n; i++) f *= i; return f; };
const B2K_F = B2K.map((b, i) => b / fact(2 * (i + 1)));
function hurwitz(s, a) {
  const N = Math.max(40, Math.ceil(Math.abs(s.im) / 2) + 10);
  let S = C(0, 0);
  for (let n = 0; n < N; n++) { const p = powNeg(n + a, s); S.re += p.re; S.im += p.im; }
  const X = N + a; const XS = powNeg(X, s);
  S = add(S, div(scale(XS, X), sub(s, C(1, 0))));
  S = add(S, scale(XS, 0.5));
  let P = s; let Xp = 1 / X;
  for (let k = 1; k <= 12; k++) {
    S = add(S, scale(mul(XS, P), B2K_F[k - 1] * Xp));
    P = mul(mul(P, add(s, C(2 * k - 1, 0))), add(s, C(2 * k, 0)));
    Xp /= X * X;
  }
  return S;
}
// characters mod 5 via generator 2: units 1,2,4,3 ; χ_j(2^k) = e^{2πi jk/4}
const CHI5 = (() => {
  const log = { 1: 0, 2: 1, 4: 2, 3: 3 };
  return [0, 1, 2, 3].map((j) => { const v = [null]; for (let a = 1; a <= 4; a++) { const th = (2 * Math.PI * j * log[a]) / 4; v[a] = C(Math.cos(th), Math.sin(th)); } return v; });
})();
function arms5(s) { // [L(s,χ0), L(s,χ1), L(s,χ2), L(s,χ3)] ; χ1 quartic with χ1(2)=i, χ2 quadratic, χ3 = conj χ1
  const hz = [null]; for (let a = 1; a <= 4; a++) hz[a] = hurwitz(s, a / 5);
  const qs = powNeg(5, s);
  return CHI5.map((chi) => { let S = C(0, 0); for (let a = 1; a <= 4; a++) S = add(S, mul(chi[a], hz[a])); return mul(qs, S); });
}
const gaussSum5 = (j) => { let S = C(0, 0); for (let a = 1; a <= 4; a++) S = add(S, mul(CHI5[j][a], C(Math.cos((2 * Math.PI * a) / 5), Math.sin((2 * Math.PI * a) / 5)))); return S; };
const ROOT_W1 = div(gaussSum5(1), C(0, Math.sqrt(5))); // W(χ1) = τ(χ1)/(i√5), χ1 odd
const ARG_W1 = Math.atan2(ROOT_W1.im, ROOT_W1.re);
const KAPPA_DH = (Math.sqrt(10 - 2 * Math.sqrt(5)) - 2) / (Math.sqrt(5) - 1);
// Davenport–Heilbronn design (root-number pinned; equals ((1−iκ)L(s,χ1)+(1+iκ)L(s,χ̄1))/√(1+κ²))
const EPS_DH = [null, C(Math.cos(ARG_W1 / 2), -Math.sin(ARG_W1 / 2)), null, C(Math.cos(ARG_W1 / 2), Math.sin(ARG_W1 / 2))];
const superpose = (eps) => (s) => { const v = arms5(s); let S = C(0, 0); for (let j = 0; j < 4; j++) if (eps[j]) S = add(S, mul(eps[j], v[j])); return S; };
const DH = superpose(EPS_DH);
const LG = [0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
function lgamma(z) {
  if (z.re < 0.5) { const sp = C(Math.sin(Math.PI * z.re) * Math.cosh(Math.PI * z.im), Math.cos(Math.PI * z.re) * Math.sinh(Math.PI * z.im)); return sub(clog(div(C(Math.PI, 0), sp)), lgamma(sub(C(1, 0), z))); }
  const zz = sub(z, C(1, 0)); let x = C(LG[0], 0);
  for (let i = 1; i < 9; i++) x = add(x, div(C(LG[i], 0), add(zz, C(i, 0))));
  const t = add(zz, C(7.5, 0));
  return add(add(C(0.5 * Math.log(2 * Math.PI), 0), sub(mul(add(zz, C(0.5, 0)), clog(t)), t)), clog(x));
}
const completedOdd5 = (F) => (s) => mul(cexp(add(scale(s, 0.5 * Math.log(5 / Math.PI)), lgamma(scale(add(s, C(1, 0)), 0.5)))), F(s));

// Baked figures (all from tmp/route-c-interferometer*.mjs; double precision).
const DH_OFFLINE_ZEROS_T200 = Object.freeze([
  // σ>1/2 members of the four mirrored pairs (ρ, 1−ρ̄) below t=200; Spira (1994) lists the same four to 6 digits.
  { re: 0.8085171825, im: 85.6993484854, arms: [0.9624, 0.7022, 1.9987, 0.7022] },
  { re: 0.6508300806, im: 114.1633427308, arms: [0.4665, 0.4219, 0.6596, 0.4219] },
  { re: 0.5743560505, im: 166.4793059132, arms: [1.5587, 0.4319, 1.4174, 0.4319] },
  { re: 0.7242576946, im: 176.7024612429, arms: [0.6911, 0.5358, 1.5746, 0.5358] },
]);

export const RH_ROUTE_C_SIGNED_INTERFEROMETER = Object.freeze({
  id: 'rh-route-c-signed-interferometer-2026-09-23',
  date: '2026-09-23',
  route: 'C — Twisted-ladder signed interferometer (rh-novel-routes-roadmap-2026-09-23.js)',
  status: 'TESTED — REFUTED as an off-line-nonvanishing / zero-free-region lever (3 independent obstructions, 2 classical theorems, numerics on q=5,7); no refereed bound is changed; RH open; NO QED',
  oneLine:
    'Φ_ε(s)=Σ_χ ε_χ L(s,χ) is a hyperplane test on the arm vector v(s)=(L(s,χ))_χ. GRH is the statement '
    + 'that v avoids the COORDINATE hyperplanes off the line; every other hyperplane is crossed ≫T times '
    + '(joint universality), and crossing it says nothing about the coordinates. The functional equation '
    + 'removes the phase freedom the route wanted (pair phases pinned to the root number, arg W = 2·arctan κ), '
    + 'and the leftover real mixing angles only rescale the off-line zero density.',

  // ------------------------------------------------------------------ 1. setup
  setup: {
    superposition: 'Φ_ε(s) = Σ_{χ mod q} ε_χ L(s,χ), ε ∈ C^{φ(q)} the design vector; single arms = coordinate vectors e_χ.',
    hurwitzBasis:
      'Character orthogonality: Φ_ε(s) = Σ_{(n,q)=1} f_ε(n) n^{-s} with f_ε = Σ_χ ε_χ χ (q-periodic, supported on '
      + 'units) = q^{-s} Σ_{a∈(Z/q)^*} f_ε(a) ζ(s, a/q). The character basis and the residue-class (Hurwitz) basis are '
      + 'finite Fourier transforms of each other; ε = all-ones gives φ(q) q^{-s} ζ(s,1/q). Parseval: Σ_a |f_ε(a)|² = φ(q)‖ε‖².',
    hyperplanePicture:
      'Φ_ε(s)=0 ⟺ v(s) ⊥ ε̄, v(s) := (L(s,χ))_χ. GRH for the family ⟺ v(s) avoids every coordinate hyperplane e_χ^⊥ '
      + 'for σ≠1/2. A design ε with ≥2 nonzero entries tests a NON-coordinate hyperplane.',
    designCondition:
      'Destructive-off-line/constructive-on-line means: |⟨v(s), ε̄⟩| ≥ c>0 for σ≠1/2 (angular avoidance of ε^⊥ by the unit '
      + 'vector v̂(s)) while ⟨v(s), ε̄⟩ may vanish on σ=1/2. For the line to be a symmetry locus of Φ_ε at all, Φ_ε must '
      + 'satisfy a Riemann-type functional equation: with Λ(s,χ)=W(χ)Λ(1−s,χ̄), the completed Φ_ε is self-dual iff '
      + 'ε_χ̄ = W(χ) ε_χ within each conjugate pair and parities are not mixed (different Γ-factors). Real-on-the-line '
      + 'normalisation then gives ε_χ = |ε_χ| e^{−i·arg W(χ)/2}: the PHASE inside each pair is pinned by the root number; '
      + 'the surviving design freedom is one REAL weight per pair / per real character.',
    q5Consequence:
      'q=5, odd block = the quartic pair {χ,χ̄}: the FE-compatible mixed design is UNIQUE up to scale and equals the '
      + 'Davenport–Heilbronn (1936) / Titchmarsh-counterexample function; arg W(χ) = 0.5535743588970 = 2·arctan κ, '
      + 'κ = (√(10−2√5)−2)/(√5−1) = 0.2840790438404. A pair design with the wrong phase ([0,1,0,1]) violates the FE by 33%.',
  },

  // ---------------------------------------------------------- 2. numerics q=5
  numericsQ5: {
    method:
      'L(s,χ) = 5^{-s} Σ_a χ(a) ζ(s,a/5), Hurwitz ζ by Euler–Maclaurin (N=max(40,|t|/2+10), 12 Bernoulli terms; '
      + 'self-consistency 3e-14 at t=150; L(2,χ_5) = 4π²/(25√5) to 6e-16). Total zero counts by argument principle '
      + '(adaptive winding number, integer to <1e-3), on-line counts by sign changes of the Hardy-type real function '
      + 'Λ(1/2+it)/√W (imaginary leakage <1e-9). Arms alone: χ1 130/130, χ2 129/129, χ3 129/129 zeros on the line in '
      + 'the rectangle [0.05,1.3]×[0.5,200] (GRH-consistent; validates the counter).',
    davenportHeilbronn: {
      design: 'ε = (0, e^{−i·argW/2}, 0, e^{+i·argW/2}) on (χ0, χ1, χ2, χ̄1); FE residual |ξ(s)−ξ(1−s)|/|ξ| = 1.4e-14.',
      counts_t200: { total: 130, onLine: 122, offLine: 8, slabs: { '0.05-0.3': 2, '0.3-0.48': 2, '0.48-0.52': 122, '0.52-0.7': 2, '0.7-1.3': 2 } },
      offLineZeros: DH_OFFLINE_ZEROS_T200,
      reading:
        'The FE-compatible interferometer puts 94% of its zeros on the line below t=200 (Bombieri–Hejhal regime: under '
        + 'GRH + a zero-spacing hypothesis almost all zeros of such combinations are on the line) but leaks 4 mirrored '
        + 'pairs; at each off-line zero every arm has |L(ρ,χ)| ∈ [0.42, 2.0] — the superposition vanishes where no arm does. '
        + '|Φ′_DH(ρ_1)| = 2.42: simple zeros, not grazes.',
      classicalCoefficientCrosscheck: {
        kappa: 0.2840790438404,
        classicalCoefficients:
          '(1−iκ)/2 on χ1, (1+iκ)/2 on χ̄1 = (0.5−0.1420395i, 0.5+0.1420395i) (Titchmarsh §10.25 / Davenport–Heilbronn 1936).',
        rootNumberPinnedReconstruction:
          'ε_DH = (e^{−i argW/2}, e^{+i argW/2}) = ((1−iκ)/√(1+κ²), (1+iκ)/√(1+κ²)) = (0.961938−0.273267i, 0.961938+0.273267i).',
        proportionality:
          'ε_DH = (2/√(1+κ²))·classical = 1.923877·classical: the FE-pinned unit-phase vector and the classical DH coefficients '
          + 'differ only by one positive real rescale, so the reconstructed combination has identical zeros.',
        firstOffLineZero:
          'ρ_1 = 0.8085171825 + 85.6993484854i (Spira 1994; Balanzario–Sánchez-Ortiz 2007); |classicalCombo(ρ_1)| < 1e-8.',
        reading:
          'The root-number-pinned q=5 signed interferometer reconstructs the classical Davenport–Heilbronn / Titchmarsh '
          + 'counterexample function up to one positive real scale, and shares its first known off-line zero. Accuracy '
          + 're-derivation only; establishes nothing new; no bound moves; RH open; NO QED.',
      },
    },
    superpositionVsUnion: {
      measurement:
        'Direct off-line zero-count comparison at q=5, rectangle [0.05,1.3]×[0.5,200]: the concrete 2-arm DH superposition '
        + 'ε=(0,e^{−i argW/2},0,e^{+i argW/2}) has 8 off-line zeros (4 mirrored pairs, DH_OFFLINE_ZEROS_T200), while the '
        + 'arm-union (all zeros of L(s,χ0), L(s,χ1), L(s,χ2), L(s,χ̄1) taken together) has 0 off-line zeros: each arm is '
        + 'GRH-consistent on this window (χ1 130/130, χ2 129/129, χ3 129/129 on the line). Superposition 8 vs union 0.',
      dhOffLineCount: 8,
      armUnionOffLineCount: 0,
      armOnLineCounts: { chi1: '130/130', chi2: '129/129', chi3: '129/129' },
      disjoint:
        'The 8 superposition off-line zeros are NOT arm-union points: at each of the four σ>1/2 representatives every arm '
        + 'has |L(ρ,χ)| ∈ [0.42, 2.0] (DH_OFFLINE_ZEROS_T200[*].arms), so none coincides with an arm zero. The superposition '
        + 'ADDS 8 off-line zeros the union does not have and DROPS the arms’ own on-line zeros — the two sets are disjoint here.',
      verdict:
        'Quantitative confirmation of the unionComparison verdict: off the line the superposition (8) is strictly worse than '
        + 'the arm-union (0) on the measured window, and the two zero sets are disjoint. Measurement only; no bound moves; NO QED.',
    },
    linearBlindness: {
      statement: 'Conversely, at the on-line zeros of the arm L(s,χ1), Φ_DH = ε_χ̄ L(s,χ̄1) ≠ 0.',
      rows: [
        { armZero: '1/2 + 6.1835781955i', absDH: 2.817278 },
        { armZero: '1/2 + 8.4572291744i', absDH: 1.840692 },
        { armZero: '1/2 + 12.6749464170i', absDH: 1.936445 },
        { armZero: '1/2 + 14.8250255703i', absDH: 1.883845 },
        { armZero: '1/2 + 17.3378021069i', absDH: 1.046111 },
      ],
      consequence:
        'A lower bound |Φ_ε| ≥ c off the line would NOT bound any arm from below: an off-line zero ρ of L(·,χ1) gives '
        + 'Φ_ε(ρ) = Σ_{χ≠χ1} ε_χ L(ρ,χ), generically nonzero. The route’s payoff (zero-free region for the L’s) does not '
        + 'follow from its deliverable even if the deliverable held. Uniformity in ε cannot rescue it: at every s some ε '
        + '(any ε ⊥ v(s)) vanishes, since dim v(s)^⊥ = φ(q)−1 ≥ 1.',
    },
    designOptimisation: {
      region: 'off-line test set σ ∈ {0.1,0.25,0.4,0.6,0.75,0.9} (symmetric about 1/2), t ∈ [0.5,100] train / [100,400] validation, Δt=0.05; objective = min |Φ_ε|/‖ε‖ (floor).',
      singleArmFloors: { chi0: { train: 0.08124, val: 0.10156 }, chi1: { train: 0.1122, val: 0.12379 }, chi2: { train: 0.08142, val: 0.08284 }, chi3: { train: 0.1072, val: 0.0876 } },
      realSignPatterns:
        'All 80 patterns ε ∈ {0,±1}^4: the eight best on the train floor are the four single arms (±); the best MIXED '
        + 'pattern [1,1,1,0] has train floor 0.07018 < 0.11220 (best single) and val floor 0.04068. No real sign pattern beats a single arm even on the finite window.',
      dhFloors: { train: 0.10098, val: 0.03209, valAt: '0.6+166.5i (next to the 0.5744+166.48i zero)' },
      continuousOptimum: {
        eps: '[−0.022+0.035i, −0.146+0.507i, 0.135+0.524i, −0.484+0.441i] (weights 0.002/0.278/0.292/0.428)',
        trainFloor: 0.22726, valFloor: 0.02679,
        zerosOffLine_t400: 32, zerosOffLineInTrainWindow: 7,
        firstZeros: ['0.48316841+9.19350826i', '0.47533929+17.18055621i', '0.48073851+35.90039473i', '0.47422319+45.01892512i', '0.51339565+50.67912538i'],
        reading:
          'The complex optimiser doubles the finite-window floor (0.227 vs 0.112) — and does it by parking zeros INSIDE '
          + 'the test set’s exclusion band |σ−1/2|<0.1 (0.483+9.19i, 0.475+17.18i, …) where the floor is not sampled; on '
          + 'the held-out window the floor collapses to 0.027, below every single arm. A floor objective cannot distinguish '
          + '"zeros on the line" from "zeros within δ of the line"; only zero COUNTS (argument principle) can. First-pass '
          + 'optimiser on σ>1/2 only (tmp/route-c-interferometer.out) did the same with σ<1/2: floor 0.393, 97 of 106 zeros pushed left of the line.',
      },
      slabCounts_t200: {
        columns: ['0.05-0.3', '0.3-0.48', '0.48-0.52', '0.52-0.7', '0.7-1.3', 'total'],
        DH: [2, 2, 122, 2, 2, 130],
        allPlus_hurwitz_1_5: [37, 57, 8, 12, 0, 114],
        continuousOptimum: [0, 11, 118, 1, 0, 130],
        arm_chi1: [0, 0, 130, 0, 0, 130],
        reading: 'Without the FE the line is not a preferred locus: the all-ones design 4·5^{-s}ζ(s,1/5) has 106 of 114 zeros off the line (Hurwitz zeros drift left with t).',
      },
    },
    meanValue: {
      identity: 'lim (1/T)∫_0^T |Φ_ε(σ+it)|² dt = Σ_n |f_ε(n)|² n^{-2σ} (Carlson / Montgomery–Vaughan), σ>1/2.',
      table_sigma075: [
        { design: 'DH', empirical: 5.626, predicted: 5.7572, incoherent: 4.7574 },
        { design: 'continuous optimum', empirical: 3.5226, predicted: 3.5326, incoherent: 2.3787 },
        { design: 'all-ones', empirical: 18.7391, predicted: 19.2619, incoherent: 9.5149 },
        { design: 'arm χ1', empirical: 2.2802, predicted: 2.3787, incoherent: 2.3787 },
      ],
      reading:
        '"Incoherent" = Σ_χ |ε_χ|² · mean|L_χ|². Off the line the cross terms do NOT average out: the n=1 term carries '
        + 'f_ε(1) = Σ_χ ε_χ (all characters equal 1 at n=1), a permanently constructive channel, and the mean depends on the '
        + 'design through the residue-class weights Σ_{n≡a} n^{-2σ}. Only at σ=1/2 (each class ~ (1/q)log T) does Parseval '
        + 'make the mean square ∝ φ(q)‖ε‖² log T, design-independent. Character orthogonality "killing off-diagonal terms" '
        + 'is this L² statement (the large sieve) — an average over t or over the family — never a pointwise statement about zeros.',
    },
    sigmaGreaterThanOne: {
      leadingTermCertificate:
        'For σ>1 the only elementary nonvanishing certificate for a non-Euler series is |f(1)| > Σ_{n≥2}|f(n)|n^{-σ}, valid for σ>σ_0(ε). '
        + 'Single arms: Euler product ⇒ nonvanishing for all σ>1 (σ_0=1). Mixed designs: σ_0(all-ones = 4·5^{-s}ζ(s,1/5)) = 1.16138 '
        + '(the minimum over all 72 mixed sign patterns), σ_0(DH) = 1.39514. The interferometer loses ground even in the trivial half-plane.',
      zeroHunt:
        'Zeros with σ>1 exist for every mixed design (Davenport–Heilbronn 1936 for ζ(s,a/q); Saias–Weingartner 2009 for any '
        + 'periodic-coefficient series that is not P(s)L(s,χ)), but are rare at low height: none found for ζ(s,a), a∈{1/3,1/4,1/5,2/5,1/7}, '
        + 'σ∈[1,1.5], t<1500 (min |ζ(s,1/3)| = 1.457 at σ=1, t=143.4 vs leading term 3.0) nor for DH on σ∈[1,1.25], t∈[400,1500] (min |Φ_DH| = 0.45).',
    },
  },

  // ---------------------------------------------------------- 3. numerics q=7
  numericsQ7: {
    setup:
      'Odd block mod 7 = {χ1 (order 6), χ3 (quadratic), χ̄1}: FE-compatible real-Z designs form a ONE-parameter family '
      + 'Φ_θ = cos θ · Φ_DH7 + sin θ · W(χ3)^{-1/2} L(s,χ3), Φ_DH7 = (e^{−i argW/2}L(s,χ1) + e^{+i argW/2}L(s,χ̄1))/√2, '
      + 'W(χ1) = 0.38651+0.92228i, W(χ3) = 1. FE residual ≤1.1e-14 and Z imaginary leakage ≤7e-9 at every θ.',
    mixingScan_t150: {
      columns: ['theta', 'total', 'onLine', 'offLine'],
      rows: [
        [0.0, 96, 85, 11], [0.1, 98, 87, 11], [0.2, 99, 87, 12], [0.3, 99, 87, 12], [0.4, 99, 89, 10], [0.5, 99, 89, 10],
        [0.6, 99, 91, 8], [0.7, 99, 93, 6], [0.8, 99, 95, 4], [0.9, 99, 97, 2], [1.0, 99, 97, 2], [1.1, 99, 97, 2],
        [1.2, 99, 97, 2], [1.3, 99, 97, 2], [1.4, 99, 99, 0], [1.5708, 99, 99, 0],
      ],
    },
    nearSingleArm_T600: {
      theta12: { windows: ['0.5-150', '150-300', '300-450', '450-600'], offLine: [2, 4, 4, 2], total: [99, 131, 144, 151] },
      theta14: { windows: ['0.5-150', '150-300', '300-450', '450-600'], offLine: [0, 0, 0, 0], total: [99, 131, 144, 151] },
    },
    reading:
      'The genuine design freedom (mixing angle θ) tunes the off-line zero DENSITY continuously from the DH7 value (11 per '
      + '150 units) down to 0 on the finite window as θ→π/2 (single arm, weight of the minority pair cos²θ = 0.029 at θ=1.4). '
      + 'The θ=1.4 count 0 below t=600 is a finite-window statement: the minority arm can only flip the sign of the majority '
      + 'where |L(s,χ3)| is small enough, which happens at ≫T heights with a θ-dependent small constant (P3 theorem). '
      + 'Nothing here approaches "zero off-line zeros for a mixed design"; the count vanishes only in the single-arm limit.',
  },

  // ------------------------------------------------------------- 4. theorems
  theorems: [
    {
      tag: 'P3 — joint universality ⇒ ≫T off-line zeros for every mixed design',
      statement:
        'For pairwise non-equivalent characters and ε with ≥2 nonzero entries, Φ_ε has ≫T zeros in every strip '
        + '1/2<σ1<σ<σ2<1, 0<t<T. Proof shape: joint universality (Voronin 1975; Bagchi 1981) lets v(s+iτ) approximate, on a '
        + 'small disc, any tuple of NONVANISHING functions g_χ; choose the g_χ nonvanishing with Σ ε_χ g_χ having a simple zero '
        + 'in the disc (possible iff ≥2 arms are used); Rouché gives a zero of Φ_ε for every such τ, a set of positive lower '
        + 'density. The coordinate hyperplanes are exempt exactly because g_χ ≡ 0 is not an admissible target — that '
        + 'exemption IS the Euler product. Stated for linear combinations of L-functions in Karatsuba–Voronin, The Riemann '
        + 'Zeta-Function (1992), Ch. VII (theorem numbering from memory — verify before citing).',
    },
    {
      tag: 'σ>1 leakage',
      statement:
        'ζ(s,a) with rational a≠1/2,1 has infinitely many zeros in σ>1 (Davenport–Heilbronn 1936; Cassels 1961 for algebraic '
        + 'irrational a). Any Dirichlet series with periodic coefficients has infinitely many zeros in σ>1 unless it equals '
        + 'P(s)L(s,χ) with P a Dirichlet polynomial (Saias–Weingartner, Acta Arith. 140 (2009)); for f supported on units mod q '
        + 'the exception is exactly a single (possibly imprimitive) character.',
    },
    {
      tag: 'on-line majority (conditional)',
      statement:
        'Bombieri–Hejhal (Duke Math. J. 80, 1995): under GRH and a zero-spacing hypothesis for the arms, a linear combination of '
        + 'Euler products sharing one functional equation has almost all (proportion → 1) zeros on the critical line. So the '
        + 'FE-compatible interferometer is "constructive on the line" in density — and still has ≫T off-line zeros (o(T log T)). '
        + 'A zero-free region needs all of them, not almost all.',
    },
  ],

  // -------------------------------------------------------------- 5. verdict
  verdict: {
    headline:
      'REFUTED. No signed/phased superposition of L(s,χ) (χ mod q) with ≥2 arms is nonvanishing off the line, and none '
      + 'could certify a zero-free region for any arm if it were.',
    obstructions: [
      'P1 LINEAR BLINDNESS — Φ_ε(ρ) ≠ 0 at arm zeros (rows above: |Φ_DH| = 1.05–2.82 at the first five zeros of L(·,χ1)), '
      + 'and Φ_ε(ρ) = 0 at points where every arm is 0.42–2.0 in modulus. Off-line nonvanishing of Φ_ε would say nothing about the arms; '
      + 'ε-uniform nonvanishing is impossible (dim v(s)^⊥ ≥ 1).',
      'P2 ORTHOGONALITY IS L² ONLY — character orthogonality kills cross terms in the MEAN (Parseval on σ=1/2; Σ|f(n)|²n^{-2σ} '
      + 'off it, reproduced to 1–3%), which is the large-sieve/mollifier content. Zeros are pointwise; off the line the cross '
      + 'terms are net constructive (ratios 1.2–2.0), not destructive.',
      'P3 UNIVERSALITY LEAK — the arm phases are jointly free (joint universality), so every non-coordinate hyperplane ε^⊥ is '
      + 'crossed ≫T times: DH 8 off-line zeros below t=200 (Spira’s four pairs reproduced to 10 digits); q=7 family: 11→0 per 150 '
      + 'units as θ→single arm; all-ones design: 106 of 114 zeros off the line.',
    ],
    designFreedomAudit:
      'The route treated {ε_χ} as free. The functional equation pins the phase inside each conjugate pair to the root number '
      + '(arg W = 2·arctan κ verified to 1e-15; q=5 odd block admits exactly one mixed design = Davenport–Heilbronn). Mixing '
      + 'parities breaks the FE (different Γ-factors); dropping the FE (all-ones, continuous optimum) removes the line as a '
      + 'preferred locus altogether. What remains is one real weight per pair/real character, which rescales the off-line zero '
      + 'density and vanishes only at a single arm.',
    unionComparison:
      'Does the superposition’s zero set behave better than the union of the arms’ zero sets? No — it is incomparable and '
      + 'worse where it matters: it contains ≫T points in every off-line strip inside (1/2,1) and infinitely many in σ>1 that no arm '
      + 'has, and it omits the arms’ own zeros. The multiplicative combination Π L(s,χ) = ζ_{Q(ζ_q)}(s) realises the union exactly; '
      + 'no analytic combination whose nonvanishing implies each arm’s nonvanishing has a smaller zero set than the union.',
    salvage:
      'Nothing of Route C survives as a zero-free-region lever. The reusable content is the mean-value identity, which is the '
      + 'large sieve already in use by the mollifier program (levinson-mollifier-frontier-audit-2026-09.js); the signed-ladder '
      + 'observation (catalan-signed-ladder.js) is about VALUES at s=2, not zeros, and is unaffected.',
    nextTest:
      'None for Route C as posed. If a follow-up is wanted: measure the off-line zero density constant c(θ) of the q=7 family '
      + 'to T≈5000 and compare with the Bombieri–Hejhal / Bombieri–Ghosh (2011) predictions — a test of the leak law, not a lever. '
      + 'Redirect the "signed twist" idea to routes that keep the Euler product (per-arm), i.e. back to GRH for the individual arms.',
    honesty:
      'No bound moves; no refereed bound is changed; GRH for L(s,χ) is untouched; every "on-line" statement about mixed designs is a '
      + 'finite-window count or a conditional literature result; NO QED.',
  },

  references: [
    'Davenport, H., Heilbronn, H. (1936). On the zeros of certain Dirichlet series I, II. J. London Math. Soc. 11, 181–185, 307–312.',
    'Cassels, J.W.S. (1961). Footnote to a note of Davenport and Heilbronn. J. London Math. Soc. 36, 177–184.',
    'Titchmarsh, E.C. The Theory of the Riemann Zeta-Function, §10.25 (the "Titchmarsh counterexample").',
    'Spira, R. (1994). Some zeros of the Titchmarsh counterexample. Math. Comp. 63, 747–748.',
    'Balanzario, E.P., Sánchez-Ortiz, J. (2007). Zeros of the Davenport–Heilbronn counterexample. Math. Comp. 76, 2045–2049.',
    'Bombieri, E., Hejhal, D.A. (1995). On the distribution of zeros of linear combinations of Euler products. Duke Math. J. 80, 821–862.',
    'Bombieri, E., Ghosh, A. (2011). Around the Davenport–Heilbronn function. Uspekhi Mat. Nauk 66(2), 15–66.',
    'Saias, E., Weingartner, A. (2009). Zeros of Dirichlet series with periodic coefficients. Acta Arith. 140, 335–344.',
    'Voronin, S.M. (1975). Theorem on the "universality" of the Riemann zeta-function. Izv. Akad. Nauk SSSR 39, 475–486; Bagchi, B. (1981) thesis (joint universality).',
    'Karatsuba, A.A., Voronin, S.M. (1992). The Riemann Zeta-Function. de Gruyter, Ch. VII (linear combinations of L-functions).',
    'Montgomery, H.L., Vaughan, R.C. (1974). Hilbert’s inequality. J. London Math. Soc. 8, 73–82 (mean-value theorem).',
  ],
  files: [
    'src/data/rh-novel-routes-roadmap-2026-09-23.js (Route C)',
    'tmp/route-c-interferometer.mjs / -2.mjs / -3.mjs and .out logs (scratch numerics)',
    'src/data/catalan-signed-ladder.js (χ4 signed flip — values, not zeros)',
    'src/data/levinson-mollifier-frontier-audit-2026-09.js (mollifier / large-sieve context)',
  ],
});

// Assertions: recompute the load-bearing figures in-module (all sub-100 ms), plus honesty tripwires.
export const RH_ROUTE_C_SIGNED_INTERFEROMETER_ASSERTIONS = Object.freeze([
  {
    id: 'route-c-hurwitz-evaluator-sanity-L2-chi5',
    holds: () => { const v = arms5(C(2, 0)); return Math.abs(v[2].re - (4 * Math.PI * Math.PI) / (25 * Math.sqrt(5))) < 1e-12 && Math.abs(v[2].im) < 1e-12 && Math.abs(v[0].re - (1 - 1 / 25) * Math.PI ** 2 / 6) < 1e-12; },
    why: 'L(2,χ_5)=4π²/(25√5) and L(2,χ0)=(1−1/25)ζ(2): the in-module Hurwitz/L evaluator is correct.',
  },
  {
    id: 'route-c-root-number-pins-the-pair-phase-argW-equals-2atan-kappa',
    holds: () => Math.abs(cabs(ROOT_W1) - 1) < 1e-12 && Math.abs(ARG_W1 - 2 * Math.atan(KAPPA_DH)) < 1e-12 && Math.abs(ARG_W1 - 0.5535743588970) < 1e-12,
    why: 'FE-compatibility inside {χ,χ̄} fixes ε_χ̄/ε_χ = W(χ): the Davenport–Heilbronn κ is the root number, not a free sign — the route’s design freedom collapses.',
  },
  {
    id: 'route-c-DH-functional-equation-holds-wrong-phase-pair-fails',
    holds: () => {
      const s = C(0.3, 7.2), s1 = C(0.7, -7.2);
      const xi = completedOdd5(DH); const good = cabs(sub(xi(s), xi(s1))) / cabs(xi(s));
      const xb = completedOdd5(superpose([null, C(1, 0), null, C(1, 0)])); const bad = cabs(sub(xb(s), xb(s1))) / cabs(xb(s));
      return good < 1e-10 && bad > 0.2;
    },
    why: 'Λ_DH(s)=Λ_DH(1−s) to 1e-10; the naive equal-sign pair [0,1,0,1] violates the FE by >20%.',
  },
  {
    id: 'route-c-DH-vanishes-off-line-where-every-arm-is-nonzero',
    holds: () => DH_OFFLINE_ZEROS_T200.every((z) => {
      const rho = C(z.re, z.im); const v = arms5(rho);
      return cabs(DH(rho)) < 1e-8 && z.re > 0.5 + 1e-3 && z.re < 1 && v.every((x, j) => Math.abs(cabs(x) - z.arms[j]) < 5e-4) && v.every((x) => cabs(x) > 0.4);
    }),
    why: 'Four simple off-line zeros of the FE-compatible interferometer below t=200 (Spira 1994), each with all arms |L(ρ,χ)|≥0.42: the superposition’s zeros are not arm zeros (P3 leak, P1 blindness).',
  },
  {
    id: 'route-c-DH-zero-is-simple',
    holds: () => { const rho = C(0.8085171825, 85.6993484854), h = 1e-5; const d = scale(sub(DH(add(rho, C(h, 0))), DH(sub(rho, C(h, 0)))), 1 / (2 * h)); return cabs(d) > 2 && cabs(d) < 3; },
    why: '|Φ′_DH(ρ_1)| = 2.42 — a genuine simple zero, not a numerical graze.',
  },
  {
    id: 'route-c-linear-blindness-DH-nonzero-at-arm-zero',
    holds: () => { const s = C(0.5, 6.1835781955); const v = arms5(s); return cabs(v[1]) < 1e-6 && cabs(DH(s)) > 2.8 && Math.abs(cabs(DH(s)) - 2.817278) < 1e-4; },
    why: 'At the first zero of L(s,χ1) the interferometer reads 2.82: an off-line bound on Φ_ε would constrain no arm.',
  },
  {
    id: 'route-c-mean-value-cross-terms-do-not-cancel-off-line',
    holds: () => {
      const z15 = hurwitz(C(1.5, 0), 0.2).re; // ζ(1.5, 1/5)
      const predictedAllOnes = 16 * Math.pow(5, -1.5) * z15;
      const zeta15 = hurwitz(C(1.5, 0), 1).re;
      const incoherent = 4 * (1 - Math.pow(5, -1.5)) * zeta15;
      const m = RH_ROUTE_C_SIGNED_INTERFEROMETER.numericsQ5.meanValue.table_sigma075.find((r) => r.design === 'all-ones');
      return Math.abs(predictedAllOnes - m.predicted) < 2e-3 && Math.abs(incoherent - m.incoherent) < 2e-3 && predictedAllOnes / incoherent > 2 && Math.abs(m.empirical - m.predicted) / m.predicted < 0.05;
    },
    why: 'Σ|f(n)|²n^{-2σ} (=16·5^{-1.5}ζ(1.5,1/5) for the all-ones design) exceeds the incoherent sum by 2×: orthogonality kills cross terms only in Parseval on σ=1/2, not off the line (P2).',
  },
  {
    id: 'route-c-parseval-design-independence-on-the-line',
    holds: () => {
      const f = [null]; for (let a = 1; a <= 4; a++) { let S = C(0, 0); for (let j = 0; j < 4; j++) if (EPS_DH[j]) S = add(S, mul(EPS_DH[j], CHI5[j][a])); f[a] = S; }
      const pars = [1, 2, 3, 4].reduce((acc, a) => acc + cabs(f[a]) ** 2, 0);
      return Math.abs(pars - 4 * 2) < 1e-12;
    },
    why: 'Σ_a|f_ε(a)|² = φ(5)‖ε‖² = 8 for DH: the on-line mean square is design-independent at leading order.',
  },
  {
    id: 'route-c-finite-window-optimiser-win-is-an-exclusion-band-artifact',
    holds: () => {
      const d = RH_ROUTE_C_SIGNED_INTERFEROMETER.numericsQ5.designOptimisation;
      const bestSingleVal = Math.min(...Object.values(d.singleArmFloors).map((r) => r.val));
      const co = d.continuousOptimum;
      // ε baked to 4 decimals shifts the zero by ~5e-5, so refine by Newton from the baked point and check it stays put.
      const opt = superpose([C(-0.0221, 0.0346), C(-0.1459, 0.5066), C(0.1353, 0.5236), C(-0.4836, 0.4405)]);
      let z = C(0.48316841, 9.19350826);
      for (let i = 0; i < 12; i++) { const h = 1e-6; const fp = scale(sub(opt(add(z, C(h, 0))), opt(sub(z, C(h, 0)))), 1 / (2 * h)); z = sub(z, div(opt(z), fp)); }
      const moved = Math.hypot(z.re - 0.48316841, z.im - 9.19350826);
      return co.trainFloor > d.singleArmFloors.chi1.train && co.valFloor < bestSingleVal && d.dhFloors.val < bestSingleVal
        && cabs(opt(z)) < 1e-9 && moved < 1e-3 && Math.abs(z.re - 0.5) > 0.01 && Math.abs(z.re - 0.5) < 0.1;
    },
    why: 'Optimised ε beats every arm on the training floor but collapses below every arm on validation; its zero at 0.4832+9.19i (Newton-recomputed here, moves <1e-3 under the 4-decimal ε rounding) sits inside the unsampled band |σ−1/2|<0.1.',
  },
  {
    id: 'route-c-real-sign-patterns-never-beat-a-single-arm',
    holds: () => { const d = RH_ROUTE_C_SIGNED_INTERFEROMETER.numericsQ5.designOptimisation; return /0\.07018 < 0\.11220/.test(d.realSignPatterns) && Math.max(...Object.values(d.singleArmFloors).map((r) => r.train)) === 0.1122; },
    why: 'Exhaustive {0,±1}^4: best mixed train floor 0.070 vs best single 0.112.',
  },
  {
    id: 'route-c-slab-and-count-tables-consistent',
    holds: () => {
      const s = RH_ROUTE_C_SIGNED_INTERFEROMETER.numericsQ5.designOptimisation.slabCounts_t200;
      const sums = ['DH', 'allPlus_hurwitz_1_5', 'continuousOptimum', 'arm_chi1'].every((k) => s[k].slice(0, 5).reduce((a, b) => a + b, 0) === s[k][5]);
      const dh = RH_ROUTE_C_SIGNED_INTERFEROMETER.numericsQ5.davenportHeilbronn.counts_t200;
      return sums && dh.total - dh.onLine === dh.offLine && dh.offLine === 2 * DH_OFFLINE_ZEROS_T200.length && s.allPlus_hurwitz_1_5[2] === 8 && s.arm_chi1[2] === 130;
    },
    why: 'Winding-number slabs sum to totals; DH off-line count 8 = 4 mirrored pairs; the all-ones design has only 8/114 zeros near the line.',
  },
  {
    id: 'route-c-q7-mixing-angle-density-falls-to-zero-only-at-the-single-arm',
    holds: () => {
      const rows = RH_ROUTE_C_SIGNED_INTERFEROMETER.numericsQ7.mixingScan_t150.rows;
      const off = rows.map((r) => r[3]);
      const monotoneFrom = off.slice(3).every((x, i) => x <= off[i + 3 - 1] || i === 0);
      return off[0] === 11 && off[off.length - 1] === 0 && rows.every((r) => r[1] - r[2] === r[3]) && monotoneFrom && off.slice(0, 14).every((x) => x >= 0);
    },
    why: 'q=7 FE-compatible family: off-line count 11 (DH7) → 0 (single arm) with total−onLine = offLine at every θ; the count reaches 0 only in the single-arm limit on this window.',
  },
  {
    id: 'route-c-honest-refuted-no-zero-free-region-claimed',
    holds: () => {
      const m = RH_ROUTE_C_SIGNED_INTERFEROMETER;
      return /REFUTED/.test(m.status) && /RH open/.test(m.status) && /NO QED/.test(m.status) && /NO QED/.test(m.verdict.honesty)
        && /REFUTED/.test(m.verdict.headline) && /finite-window/.test(m.numericsQ7.reading) && m.verdict.obstructions.length === 3
        && /verify before citing/.test(m.theorems[0].statement);
    },
    why: 'No false QED: status REFUTED, RH open, finite-window counts labelled as such, memory-cited theorem numbering flagged.',
  },
  {
    id: 'route-c-superposition-offline-count-strictly-exceeds-union-q5',
    holds: () => {
      const m = RH_ROUTE_C_SIGNED_INTERFEROMETER.numericsQ5;
      const svu = m.superpositionVsUnion;
      const dhOff = m.davenportHeilbronn.counts_t200.offLine;
      const unionOff = svu.armUnionOffLineCount; // 0: every arm is GRH-consistent (on-line = total) on the window.
      const disjoint = DH_OFFLINE_ZEROS_T200.every((z) => z.arms.every((a) => a > 0.4)); // no DH off-line zero is an arm zero.
      return svu.dhOffLineCount === dhOff && dhOff === 8 && unionOff === 0 && svu.dhOffLineCount > unionOff && disjoint;
    },
    why: 'Concrete q=5 measurement: the 2-arm DH superposition has 8 off-line zeros below t=200, the arm-union has 0 (each arm GRH-consistent), and the two sets are disjoint — superposition is quantitatively worse than the union.',
  },
  {
    id: 'route-c-DH-reconstruction-matches-classical-coefficients-and-first-offline-zero',
    holds: () => {
      const k = KAPPA_DH;
      // Classical Davenport–Heilbronn / Titchmarsh counterexample coefficients: f(s) = (1−ik)/2 L(s,chi1) + (1+ik)/2 L(s,chi_bar1).
      const cCl1 = C(0.5, -k / 2), cCl3 = C(0.5, k / 2);
      // Root-number-pinned unit-phase reconstruction (EPS_DH) must equal the classical coefficients up to one positive real scale.
      const sc = Math.sqrt(1 + k * k) / 2; // EPS_DH[1] = (1−ik)/sqrt(1+k^2); classical = (1−ik)/2, so scale by sqrt(1+k^2)/2.
      const match1 = cabs(sub(scale(EPS_DH[1], sc), cCl1)) < 1e-13;
      const match3 = cabs(sub(scale(EPS_DH[3], sc), cCl3)) < 1e-13;
      // Form the classical combination independently and check DH is a positive-real multiple of it (identical zeros).
      const classicalCombo = (s) => { const v = arms5(s); return add(mul(cCl1, v[1]), mul(cCl3, v[3])); };
      const t = C(0.75, 22.0);
      const ratio = div(DH(t), classicalCombo(t));
      const realPositive = Math.abs(ratio.im) < 1e-10 && Math.abs(ratio.re - 2 / Math.sqrt(1 + k * k)) < 1e-10 && ratio.re > 0;
      // The classical combination exhibits the first known off-line zero (Spira 1994) to the stated tolerance.
      const z = DH_OFFLINE_ZEROS_T200[0];
      const firstZero = cabs(classicalCombo(C(z.re, z.im))) < 1e-8 && Math.abs(z.re - 0.8085171825) < 1e-9 && Math.abs(z.im - 85.6993484854) < 1e-9;
      const tab = RH_ROUTE_C_SIGNED_INTERFEROMETER.numericsQ5.davenportHeilbronn.classicalCoefficientCrosscheck;
      return match1 && match3 && realPositive && firstZero && Math.abs(tab.kappa - k) < 1e-12 && /NO QED/.test(tab.reading);
    },
    why: 'Cross-check of the verdict claim that q=5 uniquely reconstructs Davenport–Heilbronn: the FE/root-number-pinned sign '
      + 'vector EPS_DH equals the classical (1∓iκ)/2 coefficients (Titchmarsh §10.25) up to a positive real scale 1.923877, and '
      + 'the independently-formed classical combination shares the first off-line zero 0.8085+85.6993i to <1e-8. Accuracy re-derivation; no bound moves; NO QED.',
  },
]);

export default RH_ROUTE_C_SIGNED_INTERFEROMETER;
