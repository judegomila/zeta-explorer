/**
 * @fileoverview imp-33233: Assessment of the named obstructions to a FULL
 * falsification of Conjecture 22.1 (twin-ladder usefulness) BEYOND the imp-3932
 * eq (20)-(21) monomial/Hermite-Gaussian proxy class.
 *
 * @module data/imp-33233-conjecture-22-1-modulation-band-limit-assessment
 *
 * imp-3932 rigorously falsified the STRONG GLOBAL reading of Conjecture 22.1 for
 * the paper own eq (20)-(21) frozen-ladder proxy (a single Gaussian width times
 * an even polynomial, or any finite REAL-width Gaussian mixture) at the
 * Platt-Trudgian 2021 benchmark: the coefficient-dimension zero-count cap
 * (deg Q_j <= 2 K_j, D = Sigma_j (K_j + 1)) plus the L4 sign-transfer force
 * D >= M_sc + 1 = 12,363,153,437,139 stored coefficients versus a 691,008-term
 * Riemann-Siegel main sum. imp-3932 then NAMED the obstructions to a complete
 * resolution and the surviving readings, chief among them the windowed/MODULATED
 * proxy escape hatch (obstruction 2 / surviving reading i), fenced off only as
 * "= Odlyzko-Schonhage band-limited interpolation, PARTIALLY-RELATED not novel"
 * without a quantitative bound.
 *
 * THIS MODULE attacks that class boundary quantitatively. It shows the
 * modulation escape splits into two regimes and NEITHER admits a genuine
 * equal-runtime certified-remainder advantage over the Platt-Trudgian baseline:
 *
 *  (A) SINGLE-WIDTH modulated ladder does NOT escape the cap. For
 *          Phi_fr(u) = e^{-alpha u^2} Sigma_c P_c(u^2) cos(t_c u),
 *      distinct frequencies t_c >= 0, deg_{u^2} P_c = K_c, ONE common width
 *      alpha, the transform is (product-to-sum + L1 of imp-3932)
 *          Xi_fr(t) = (1/2) Sigma_c [ e^{-(t-t_c)^2/(4a)} Q_c(t-t_c)
 *                                   + e^{-(t+t_c)^2/(4a)} Q_c(t+t_c) ],
 *      Q_c even of degree 2 K_c. Multiply by the ENTIRE, ZERO-FREE factor
 *      E(t) = e^{+t^2/(4 alpha)} (never vanishes, so the real zero SET is
 *      preserved exactly):
 *          E(t) Xi_fr(t)
 *            = (1/2) Sigma_c e^{-t_c^2/(4a)}
 *                [ e^{+ t_c t/(2a)} Q_c(t-t_c) + e^{- t_c t/(2a)} Q_c(t+t_c) ].
 *      This is EXACTLY a Polya-Szego exponential polynomial in t with DISTINCT
 *      REAL exponents mu in { +/- t_c/(2 alpha) } (t_c = 0 gives exponent 0).
 *      L2 of imp-3932 (Polya-Szego Part V Problem 75) therefore caps its real
 *      zeros. Bounding block c (t_c > 0) by two degree-2 K_c polynomials and the
 *      t_c = 0 block likewise, the full-line real-zero count is
 *          Z(Xi_fr) <= 2 Sigma_c (2 K_c + 1) - 1.
 *      Xi_fr is EVEN (Xi_fr(-t) = Xi_fr(t)), so M certified positive sign
 *      changes force 2M real zeros, hence
 *          2M <= 2 Sigma_c (2 K_c + 1) - 1 < 2(2 Sigma_c K_c + #blocks)
 *              = 2(2 D - #blocks) <= 4 D,   with D = Sigma_c (K_c + 1).
 *      Thus D > M/2. At the benchmark, matching M_sc sign changes still forces
 *          D >= ceil(M_sc / 2) = 6,181,576,718,569
 *      stored coefficients, exceeding the 691,008-term Riemann-Siegel main sum
 *      by a factor > 8.9e6. Modulation with a single width WEAKENS the imp-3932
 *      bound by at most a factor of 2; it does NOT escape it.
 *
 *  (B) MULTI-WIDTH modulated / genuinely windowed ladder reappears as a NYQUIST
 *      storage floor of the same order. With distinct widths alpha_j AND
 *      modulation there is no single Gaussian multiplier that clears every block
 *      simultaneously (the t-exponents become distinct quadratics
 *      a_j t^2 + b_j t), so L2 does not apply. But if Phi_fr is (effectively)
 *      supported in |u| <= U, then Xi_fr(t) = Integral_{-U}^{U} Phi_fr e^{itu} du
 *      is entire of exponential type <= U (Paley-Wiener), and the classical
 *      zero-density theorem for exponential type (Levinson, Gap and Density
 *      Theorems; Titchmarsh, Theory of Functions 8.71) bounds its real zeros in
 *      (0, T0] by (U/pi) T0 (1 + o(1)). Certifying M_sc sign changes then forces
 *          U >= pi M_sc / T0 ~ 12.95   (order (1/2) log(T0/2pi), BOUNDED),
 *      and a bandwidth-U function on an interval of length T0 is determined, via
 *      Whittaker-Kotelnikov-Shannon sampling at spacing pi/U, by
 *          (U/pi) T0 ~ M_sc
 *      real sample values -- i.e. the effective STORAGE/data dimension is again
 *      >= ~M_sc, and the representation IS Odlyzko-Schonhage band-limited
 *      interpolation (published state of the art). No INDEPENDENT-NOVEL
 *      equal-runtime advantage survives; imp-3932 reading (i) stands, now
 *      quantitatively pinned rather than merely fenced off.
 *
 * NET VERDICT ON THE CLASS BOUNDARY: the modulation/window obstruction does NOT
 * admit an equal-runtime certified-remainder advantage. Single-width modulation
 * is still Polya-Szego-capped (verbatim, weaker by <= 2x); multi-width/windowed
 * modulation is Nyquist-capped at the same ~M_sc order and coincides with
 * Odlyzko-Schonhage. The GENUINELY OPEN residue is narrowed to exactly two of
 * imp-3932 named obstructions, recorded here as the honest sub-gap:
 *   (1) the algebraic-complexity RUNTIME-MODEL boundary -- whether an exotic
 *       short straight-line program can EVALUATE the specific ~M_sc-coefficient
 *       exponential polynomial / band-limited function in << M_sc operations
 *       (Paterson-Stockmeyer gives O(sqrt(n)) nonscalar mults for a degree-n
 *       polynomial but does not shrink the ~M_sc storage/sample read, and no
 *       unconditional per-evaluation lower bound is known); and
 *   (3) the small fixed-height constant regime, where both runtimes are trivial
 *       and the comparison is about constants -- open and benchmarkable, but not
 *       the reading the imp-1210 audit anchored to the Platt-Trudgian height.
 *
 * NO QED on Conjecture 22.1 in full generality is claimed. De Bruijn-Newman
 * status untouched: Polymath15 Lambda <= 0.2 remains SOTA. The imp-1210 NOVELTY
 * verdict is a statement about the literature and is unchanged; this is a
 * truth-status assessment that SHARPENS imp-3932.
 *
 * NO imports. Self-contained and light (no zeros bundle). JS strings use double
 * quotes where an apostrophe is needed; JSDoc avoids the close-comment sequence.
 *
 * ADVERSARIAL SELF-CHECK BUILT IN: the assertions below (i) verify the
 * single-width reduction E(t) Xi_fr(t) = Polya-Szego exp-polynomial against an
 * INDEPENDENT Simpson quadrature of Phi_fr and against the predicted cosh form,
 * (ii) verify the weakened cap on a modulated instance that ATTAINS it, and
 * (iii) recompute the benchmark arithmetic (D >= M_sc/2, ratio > 8.9e6, the
 * Nyquist bandwidth floor and the storage identity).
 */

// ── Literature constants (cited via imp-3932; not re-derived) ──────────────
const PT_HEIGHT = 3000175332800; // Platt-Trudgian 2021 verified height T0
const PT_ZEROS = 12363153437138; // sign changes M_sc of Xi on (0, T0]
const TWO_PI = 2 * Math.PI;
const RS_MAIN_SUM_TERMS_AT_TOP = Math.floor(Math.sqrt(PT_HEIGHT / TWO_PI));

// Weakened single-width-modulation coefficient floor D > M_sc/2.
const D_SINGLE_WIDTH_FLOOR = Math.ceil(PT_ZEROS / 2);
const SINGLE_WIDTH_GAP_FACTOR = D_SINGLE_WIDTH_FLOOR / RS_MAIN_SUM_TERMS_AT_TOP;

// Multi-width / windowed Nyquist bandwidth floor U >= pi M_sc / T0, and the
// resulting Whittaker-Kotelnikov-Shannon sample-count storage floor (U/pi) T0.
const NYQUIST_BANDWIDTH_FLOOR = (Math.PI * PT_ZEROS) / PT_HEIGHT;
const NYQUIST_SAMPLE_FLOOR = (NYQUIST_BANDWIDTH_FLOOR / Math.PI) * PT_HEIGHT;

// ── Numeric helpers for the single-width reduction (alpha = 1 instances) ────

// L1 base case (P = 1, alpha = 1): Integral_R e^{-u^2} cos(s u) du = sqrt(pi) e^{-s^2/4}.
function gaussCosFT(s) {
  return Math.sqrt(Math.PI) * Math.exp((-s * s) / 4);
}

// Modulated instance M1: Phi(u) = e^{-u^2} cos(2u). One width, one frequency,
// P = 1 (D = 1). Xi_fr(t) = (1/2)[G(t-2) + G(t+2)], strictly positive.
function xiFrM1(t) {
  return 0.5 * (gaussCosFT(t - 2) + gaussCosFT(t + 2));
}

// Modulated instance M2: Phi(u) = e^{-u^2} (cos(2u) - 0.5). Adds an
// un-modulated (t_c = 0) block, D = 2. Exponents { +1, 0, -1 } after the
// E(t) = e^{+t^2/4} multiplier, so L2 caps the full-line real zeros at 2 -- and
// M2 ATTAINS it (zeros at t = +/- arccosh(e/2) ~ +/- 0.83).
function phiM2(u) {
  return Math.exp(-u * u) * (Math.cos(2 * u) - 0.5);
}
function xiFrM2(t) {
  return 0.5 * (gaussCosFT(t - 2) + gaussCosFT(t + 2)) - 0.5 * gaussCosFT(t);
}

// The zero-free entire multiplier E(t) = e^{+t^2/(4 alpha)}, alpha = 1.
function bigE(t) {
  return Math.exp((t * t) / 4);
}

// Predicted Polya-Szego exponential polynomials after multiplying by E(t):
//   E * Xi_fr(M1) = sqrt(pi) e^{-1} cosh(t)
//   E * Xi_fr(M2) = sqrt(pi) [ e^{-1} cosh(t) - 0.5 ]
function predictedExpPolyM1(t) {
  return Math.sqrt(Math.PI) * Math.exp(-1) * Math.cosh(t);
}
function predictedExpPolyM2(t) {
  return Math.sqrt(Math.PI) * (Math.exp(-1) * Math.cosh(t) - 0.5);
}

// Independent verification: composite Simpson for the even cosine transform
// 2 * Integral_0^U Phi(u) cos(t u) du of a supplied Phi.
function cosTransformQuad(phi, t, U, n) {
  if (n % 2 === 1) n += 1;
  const h = U / n;
  const f = (u) => phi(u) * Math.cos(t * u);
  let sum = f(0) + f(U);
  for (let i = 1; i < n; i++) sum += (i % 2 === 1 ? 4 : 2) * f(i * h);
  return 2 * ((h / 3) * sum);
}

// Grid sign-change counter (tripwire helper; a grid can only undercount).
function countSignChangesOnGrid(fn, t0, t1, steps) {
  let count = 0;
  let lastSign = 0;
  for (let i = 0; i <= steps; i++) {
    const t = t0 + ((t1 - t0) * i) / steps;
    const v = fn(t);
    const s = v > 0 ? 1 : v < 0 ? -1 : 0;
    if (s !== 0) {
      if (lastSign !== 0 && s !== lastSign) count += 1;
      lastSign = s;
    }
  }
  return count;
}

// ── Frozen assessment record ────────────────────────────────────────────────

export const IMP_33233_MODULATION_BAND_LIMIT_ASSESSMENT = Object.freeze({
  id: 'imp-33233',
  ticket: 'imp-33233',
  date: '2026-07-04',
  extendsTicket: 'imp-3932',
  paper: 'twin_ladder_consolidated_v52.pdf',
  target:
    'Named obstructions to a FULL falsification of Conjecture 22.1 BEYOND the ' +
    'imp-3932 eq (20)-(21) monomial/Hermite-Gaussian proxy class: does the ' +
    'coefficient-dimension zero-count cap and sign-transfer extend to a ' +
    'general frozen-ladder approximant, or does a surviving reading admit a ' +
    'genuine equal-runtime certified-remainder advantage over Platt-Trudgian ' +
    '2021?',
  question:
    'imp-3932 capped the paper own REAL-width Gaussian(-mixture) class. The ' +
    'chief named escape is the windowed/MODULATED proxy (obstruction 2 / ' +
    'surviving reading i), fenced off only qualitatively as ' +
    '"= Odlyzko-Schonhage, PARTIALLY-RELATED not novel". Does modulation ' +
    'actually escape the cap, and if so does it buy an equal-runtime edge?',
  findings: Object.freeze({
    singleWidthModulation: Object.freeze({
      claim:
        'A single-width modulated ladder e^{-alpha u^2} Sigma_c P_c(u^2) ' +
        'cos(t_c u) does NOT escape the cap. Multiplying Xi_fr(t) by the ' +
        'entire zero-free factor E(t) = e^{+t^2/(4 alpha)} turns it into a ' +
        'Polya-Szego exponential polynomial with distinct real exponents ' +
        '+/- t_c/(2 alpha), so L2-L4 of imp-3932 still fire. The full-line ' +
        'real-zero count is <= 2 Sigma_c (2 K_c + 1) - 1; Xi_fr is even, so M ' +
        'positive sign changes force 2M real zeros and hence D > M/2.',
      benchmarkFloor: D_SINGLE_WIDTH_FLOOR,
      benchmarkFloorNote:
        'Matching M_sc sign changes forces D >= ceil(M_sc/2) = ' +
        '6,181,576,718,569 stored coefficients, exceeding the 691,008-term ' +
        'Riemann-Siegel main sum by a factor > 8.9e6. Modulation weakens the ' +
        'imp-3932 D >= M_sc + 1 bound by at most a factor of 2 -- NOT an escape.',
      status: 'RIGOROUS (zero-free-multiplier reduction to Polya-Szego L2)',
    }),
    multiWidthWindowed: Object.freeze({
      claim:
        'A multi-width modulated / genuinely windowed ladder (distinct widths ' +
        'alpha_j) is not reachable by a single Gaussian multiplier, so L2 does ' +
        'not apply; but a window of half-width U makes Xi_fr entire of ' +
        'exponential type <= U (Paley-Wiener), and the exponential-type ' +
        'zero-density theorem bounds its real zeros on (0, T0] by (U/pi) T0. ' +
        'Certifying M_sc sign changes forces U >= pi M_sc / T0, and a ' +
        'bandwidth-U function on [0, T0] is fixed by (U/pi) T0 ~ M_sc ' +
        'Whittaker-Kotelnikov-Shannon samples -- the storage floor reappears ' +
        'at the same ~M_sc order, and the object IS Odlyzko-Schonhage ' +
        'band-limited interpolation.',
      bandwidthFloor: NYQUIST_BANDWIDTH_FLOOR,
      sampleFloor: NYQUIST_SAMPLE_FLOOR,
      bandwidthFloorNote:
        'U >= pi M_sc / T0 ~ 12.95 (order (1/2) log(T0/2pi), BOUNDED), so the ' +
        'window half-width stays O(log T0) but the Nyquist sample count ' +
        '(U/pi) T0 is exactly ~M_sc. No equal-runtime advantage; matches ' +
        'imp-3932 reading (i), now quantitatively pinned.',
      status:
        'RIGOROUS for the compactly-supported window (Paley-Wiener + ' +
        'exponential-type zero density + Nyquist sampling); for a Gaussian ' +
        '(non-compact) window the bound holds up to the eq (22) ' +
        'incomplete-gamma tail truncation the paper already carries.',
    }),
  }),
  verdictForClassBoundary:
    'The class-boundary obstruction (windowed/modulated proxies) does NOT ' +
    'admit a genuine equal-runtime certified-remainder advantage over ' +
    'Platt-Trudgian 2021. Single-width modulation is still Polya-Szego-capped ' +
    '(verbatim, weaker by <= 2x: D > M_sc/2); multi-width/windowed modulation ' +
    'is Nyquist-capped at the SAME ~M_sc storage order and coincides with ' +
    'Odlyzko-Schonhage band-limited interpolation (published SOTA, not novel).',
  residualSubGap: Object.freeze({
    id: 'imp-33233-sub-eval-lower-bound',
    statement:
      'GENUINELY OPEN residue (unchanged from imp-3932, now isolated as the ' +
      'only surviving cracks): (1) the algebraic-complexity RUNTIME-MODEL ' +
      'boundary -- whether an exotic short straight-line program EVALUATES the ' +
      'specific ~M_sc-coefficient exponential polynomial / band-limited ' +
      'function in << M_sc operations (a circuit lower-bound question; ' +
      'Paterson-Stockmeyer O(sqrt(n)) nonscalar mults does not shrink the ' +
      '~M_sc storage/sample read, and no unconditional per-evaluation lower ' +
      'bound is known); and (3) the small fixed-height constant regime.',
    whyNotClosedHere:
      'Both are lower-bound gaps outside Fourier/zero-counting: (1) needs an ' +
      'unconditional arithmetic-circuit lower bound for a specific coefficient ' +
      'family; (3) needs explicit constant-chasing at a fixed small height. ' +
      'Neither is reachable by the coefficient-dimension / Nyquist machinery ' +
      'that closes the class boundary.',
  }),
  honestScope: Object.freeze([
    'The Platt-Trudgian height T0 and zero count M_sc are literature ' +
      'constants inherited from imp-3932 (cross-checked there against the ' +
      'Riemann-von Mangoldt main term); they are not re-derived here.',
    'The single-width reduction is fully rigorous: E(t) = e^{+t^2/(4 alpha)} ' +
      'is entire and nowhere zero, so it preserves the real zero set exactly, ' +
      'and the reduced object is a genuine Polya-Szego exponential polynomial.',
    'The multi-width bound is rigorous for a compactly-supported window; for a ' +
      'Gaussian window it is a soft (effective-support) bound at the level of ' +
      'the eq (22) tail already in the paper. Either way the storage floor is ' +
      '~M_sc, so no equal-runtime advantage is created.',
    'NO false QED: Conjecture 22.1 in full generality is NOT resolved. The ' +
      'residual sub-gap (algebraic-complexity runtime model + small-height ' +
      'regime) is named, not hidden. Polymath15 Lambda <= 0.2 remains SOTA and ' +
      'is untouched; the imp-1210 novelty verdict is unchanged.',
  ]),
  relationToLambda:
    'Independent of the de Bruijn-Newman constant; Lambda <= 0.2 (Polymath15) ' +
    'remains the SOTA upper bound and is untouched.',
  auditCrossRefs: Object.freeze(['imp-3932', 'imp-1210', 'imp-1258']),
});

// ── Build-time tripwires ────────────────────────────────────────────────────

export const IMP_33233_MODULATION_BAND_LIMIT_ASSESSMENT_ASSERTIONS = [
  {
    id: 'imp33233-single-width-reduction-matches-quadrature-and-cosh',
    holds: () => {
      // The single-width reduction E(t) Xi_fr(t) must equal (i) the predicted
      // Polya-Szego exp-polynomial and (ii) E(t) times an INDEPENDENT Simpson
      // quadrature of Phi_fr, across a spread of t. If the zero-free-multiplier
      // reduction were wrong this identity would break.
      const ts = [-3.7, -1.1, 0, 0.83, 2.4, 5.2];
      return ts.every((t) => {
        // M1 (P = 1): analytic closed form vs predicted cosh.
        const e1 = bigE(t) * xiFrM1(t);
        const okM1 = Math.abs(e1 - predictedExpPolyM1(t)) <= 1e-7 * Math.max(1, Math.abs(e1));
        // M2 (adds t_c = 0 block): analytic vs predicted, and analytic vs
        // e^{+t^2/4} * (independent quadrature of Phi_fr).
        const e2 = bigE(t) * xiFrM2(t);
        const okM2pred = Math.abs(e2 - predictedExpPolyM2(t)) <= 1e-7 * Math.max(1, Math.abs(e2));
        const quad = bigE(t) * cosTransformQuad(phiM2, t, 12, 20000);
        const okM2quad = Math.abs(e2 - quad) <= 1e-6 * Math.max(1, Math.abs(e2));
        return okM1 && okM2pred && okM2quad;
      });
    },
    why:
      'Finding (A) rests on E(t) = e^{+t^2/(4 alpha)} (entire, nowhere zero) ' +
      'turning a single-width modulated Xi_fr into a Polya-Szego exponential ' +
      'polynomial. The instances give E * Xi_fr(M1) = sqrt(pi) e^{-1} cosh(t) ' +
      'and E * Xi_fr(M2) = sqrt(pi)[e^{-1} cosh(t) - 0.5]; both must match the ' +
      'analytic Gaussian-shift form AND an independent Simpson quadrature of ' +
      'Phi_fr. A slip in the product-to-sum reduction or the L1 base case ' +
      'would break the equality and must fail here.',
  },
  {
    id: 'imp33233-weakened-cap-attained-on-modulated-instance',
    holds: () => {
      // M2 has coefficient dimension D = 2, so the full-line real-zero cap is
      // 2 Sigma_c (2 K_c + 1) - 1 = 2*(1) + 2*(1) - 1 with K_c = 0 => bounded
      // by 4 D - 1 = 7, and the exp-poly with exponents {+1,0,-1} caps at 2.
      // M2 ATTAINS 2 (zeros at +/- arccosh(e/2)). The grid count must equal 2
      // (respecting AND attaining the cap) and must not exceed 4 D - 1.
      const D = 2;
      const zeros = countSignChangesOnGrid(xiFrM2, -12, 12, 60000);
      return zeros === 2 && zeros <= 4 * D - 1;
    },
    why:
      'The weakened single-width cap D > M/2 comes from 2M <= 4 D on an EVEN ' +
      'Xi_fr. The M2 instance (D = 2) attains the sharp exp-polynomial cap of ' +
      '2 full-line real zeros at t = +/- arccosh(e/2) ~ +/- 0.83, so the grid ' +
      'must count exactly 2 -- proving the cap is both respected and sharp and ' +
      'the counter is not blind. A count of 0 or 3+ would falsify the ' +
      'reduction or the cap.',
  },
  {
    id: 'imp33233-benchmark-and-nyquist-arithmetic',
    holds: () => {
      const f = IMP_33233_MODULATION_BAND_LIMIT_ASSESSMENT.findings;
      const single = f.singleWidthModulation;
      const multi = f.multiWidthWindowed;
      // (A) single-width weakened floor D >= ceil(M_sc/2), gap factor > 8.9e6.
      const okSingle =
        single.benchmarkFloor === Math.ceil(PT_ZEROS / 2) &&
        single.benchmarkFloor === 6181576718569 &&
        SINGLE_WIDTH_GAP_FACTOR > 8.9e6 &&
        single.benchmarkFloor > RS_MAIN_SUM_TERMS_AT_TOP;
      // (B) Nyquist bandwidth floor U = pi M_sc / T0 ~ 12.95, BOUNDED (O(log)),
      // and the sample-count identity (U/pi) T0 = M_sc reproduces the storage
      // floor at the same ~M_sc order.
      const okMulti =
        Math.abs(multi.bandwidthFloor - NYQUIST_BANDWIDTH_FLOOR) < 1e-9 &&
        multi.bandwidthFloor > 12.5 &&
        multi.bandwidthFloor < 13.5 &&
        Math.abs(multi.sampleFloor - PT_ZEROS) < 1;
      return okSingle && okMulti;
    },
    why:
      'The two headline floors must be computed, not hand-typed: the ' +
      'single-width floor D >= ceil(M_sc/2) = 6,181,576,718,569 (gap > 8.9e6 ' +
      'vs the 691,008-term RS main sum), and the multi-width Nyquist bandwidth ' +
      'floor U = pi M_sc / T0 ~ 12.95 with the sample identity (U/pi) T0 = ' +
      'M_sc. Drift in either means the assessment no longer matches its inputs.',
  },
  {
    id: 'imp33233-record-structure-and-honesty',
    holds: () => {
      const r = IMP_33233_MODULATION_BAND_LIMIT_ASSESSMENT;
      return (
        r.extendsTicket === 'imp-3932' &&
        !!r.findings.singleWidthModulation &&
        !!r.findings.multiWidthWindowed &&
        /Polya-Szego/.test(r.findings.singleWidthModulation.claim) &&
        /Odlyzko-Schonhage/.test(r.findings.multiWidthWindowed.claim) &&
        /does NOT admit/.test(r.verdictForClassBoundary) &&
        r.residualSubGap.id === 'imp-33233-sub-eval-lower-bound' &&
        /algebraic-complexity/.test(r.residualSubGap.statement) &&
        /small fixed-height/.test(r.residualSubGap.statement) &&
        r.honestScope.some((s) => /NO false QED/.test(s)) &&
        /Lambda <= 0.2/.test(r.relationToLambda)
      );
    },
    why:
      'Honesty guards: the record must keep BOTH regime findings (single-width ' +
      'Polya-Szego reduction and multi-width Odlyzko-Schonhage/Nyquist bound), ' +
      'the "does NOT admit an equal-runtime advantage" verdict, the named ' +
      'residual sub-gap (algebraic-complexity runtime model + small-height ' +
      'regime -- no silent promotion to a full falsification), the NO false ' +
      'QED disclosure, and the untouched Polymath15 Lambda <= 0.2 SOTA. ' +
      'Softening any of these would misrepresent a PARTIAL result as complete.',
  },
];

export default IMP_33233_MODULATION_BAND_LIMIT_ASSESSMENT;
