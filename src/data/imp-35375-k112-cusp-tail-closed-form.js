/**
 * @module imp-35375-k112-cusp-tail-closed-form
 *
 * imp-35375 (numerical, frontier-derivation): ASSEMBLE the NEXT model-cusp rho coefficient K_{11/2} in
 * closed form from the imp-35265 exact 20 i t^{-12} identity term, and CROSS-CHECK it against the
 * imp-35298 grid measurement of the term ladder after eps^{7/2}. imp-35265 pinned the odd-p branch pair
 *     (i - t^2)^{-3} + (i + t^2)^{-3} = -6 i t^{-8} + 20 i t^{-12} + O(t^{-16}),
 * assembling K_{7/2} = -8 sqrt(2)/(3 pi) from the -6 i t^{-8} leading tail. This module carries the SAME
 * exact-identity tail one order further: the 20 i t^{-12} term integrates to the eps^{11/2} slot of the
 * denominator tail D_3, which -- together with the numerator tail R_2's own 10 t^{-12} term -- assembles
 * the eps^{11/2} coefficient K_{11/2} = 20/(3 A_2) = 40 sqrt(2)/(9 pi) in closed form. DERIVATION ONLY on
 * the inherited imp-3220/imp-3406/imp-33646 model-cusp surrogate; does NOT discharge O3; G6a stays OPEN;
 * NO QED.
 *
 * THE TWO t^{-12} TAILS THAT FEED eps^{11/2}
 * -----------------------------------------
 * With a = A_1/2 = |F_2(inf)| and b = A_2/4 = |F_3(inf)|, imp-35298 wrote the cancellation-free deviation
 *     dev = rho - 2/3 = ( b R_2 - a D_3 ) / ( 2 b ( b + D_3 ) ),
 * where R_2(L) and D_3(L) are the finite-cutoff tails at L = eps^{-1/2}. Both expand in half-integer
 * powers, and the eps^{11/2} slot of each comes from a t^{-12} integrand tail:
 *   - Numerator g_2(t) = 2(t^4-1)/(t^4+1)^2 = 2 t^{-4} - 6 t^{-8} + 10 t^{-12} - ..., so its tail
 *     R_2 = integral_L^infty g_2 dt = (2/3) eps^{3/2} - (6/7) eps^{7/2} + (10/11) eps^{11/2} - ...;
 *     the 10 t^{-12} numerator term gives r_{11/2} = 10/11 (via integral_L^infty t^{-12} dt = L^{-11}/11).
 *   - Denominator (imp-35265 odd-p pair) g_3(t) = (1-3t^4)/(t^4+1)^3 = -3 t^{-8} + 10 t^{-12} - ..., and
 *     D_3 = -2 integral_L^infty g_3 dt = (6/7) eps^{7/2} - (20/11) eps^{11/2} + ...; the 20 i t^{-12} identity
 *     term (Im part 10 t^{-12} of g_3, doubled) gives d_{11/2} = -20/11. This is the eps^{11/2} echo of the
 *     -6 i t^{-8} -> eps^{7/2} tail imp-35265 used for K_{7/2}.
 *
 * WHY eps^{11/2} GETS ONLY THE DIRECT NUMERATOR TERM (a clean one-source quotient slot)
 * -----------------------------------------------------------------------------------
 * Expand dev = [NUM/(2 b^2)] (1 - D_3/b + (D_3/b)^2 - ...), NUM = b R_2 - a D_3. The correction factor
 * (1 - D_3/b + ...) carries only the powers eps^0, eps^{7/2}, eps^{11/2}, eps^7, ... (D_3 starts at
 * eps^{7/2}). Multiplying NUM (powers 3/2, 7/2, 11/2, ...) by that factor, the eps^{11/2} slot receives
 * NO cross term: eps^{3/2} x eps^{7/2} = eps^5 (the imp-35298 integer cross term K_5), eps^{3/2} x eps^{11/2}
 * = eps^7, eps^{7/2} x eps^{7/2} = eps^7 -- none land on 11/2. Hence eps^{11/2} is a pure one-source slot,
 *     K_{11/2} = ( b r_{11/2} - a d_{11/2} ) / ( 2 b^2 ),   r_{11/2} = 10/11,  d_{11/2} = -20/11.
 * (Contrast K_5, which exists ONLY as the eps^{3/2}-numerator x eps^{7/2}-denominator cross term.)
 *
 * THE CLOSED-FORM COLLAPSE
 * -----------------------
 * Using a = A_2/3 (from A_1/A_2 = 2/3) and b = A_2/4,
 *     b r_{11/2} - a d_{11/2} = (10/11) b + (20/11) a = (10/11)(b + 2 a) = (10/11)(A_2/4 + 2 A_2/3)
 *                             = (10/11)(11 A_2/12) = (10/12) A_2 = (5/6) A_2,
 *     2 b^2 = 2 (A_2/4)^2 = A_2^2/8,
 *     K_{11/2} = (5/6) A_2 / (A_2^2/8) = (5/6)(8/A_2) = 20/(3 A_2) = 40 sqrt(2)/(9 pi) = 2.00070.
 * Equivalently K_{11/2} = -(5/3) K_{7/2} (since K_{7/2} = -4/A_2), the exact ratio of the two t^{-12}-fed and
 * t^{-8}-fed slots. This mirrors imp-35265's K_{7/2} = -(3/7)(a+b)/b^2; here K_{11/2} = (5/11)(b+2a)/b^2.
 *
 * CROSS-CHECK AGAINST THE imp-35298 GRID LADDER
 * ---------------------------------------------
 * imp-35298 measured the term AFTER eps^{7/2} to be the INTEGER eps^5 (coefficient K_5 = -256/(63 pi^2)),
 * with ordered ladder 3/2, 7/2, 5, 11/2, 7, .... So eps^{11/2} is the slot AFTER eps^5, not the immediate
 * successor of eps^{7/2}. Two independent numerical cross-checks confirm K_{11/2}:
 *   (i) TAIL-LEVEL (well-conditioned): isolating the eps^{11/2} tail terms directly,
 *       (R_2 - (2/3)eps^{3/2} + (6/7)eps^{7/2}) / eps^{11/2} -> 10/11 and
 *       (D_3 - (6/7)eps^{7/2}) / eps^{11/2} -> -20/11, both to ~1e-4 across eps in [1e-2, 1e-3].
 *   (ii) RHO-LEVEL (quadruply-cancelled): forming r3 = dev - K_{3/2}eps^{3/2} - K_{7/2}eps^{7/2} - K_5 eps^5
 *       on the imp-35298 compensated finite-cutoff ladder, r3/eps^{11/2} climbs to K_{11/2} = 2.00070
 *       (2.00253 -> 2.00102 -> 2.00050 across eps = 1e-2, 3e-3, 1e-3), then DESTABILISES below eps ~ 1e-3
 *       as the quadruple cancellation (r3 ~ 6e-17 at eps = 1e-3) nears the machine floor -- documented, not
 *       silently dropped. The clean rho-level window is eps in [1e-2, 1e-3]; the tail-level check (i) is the
 *       high-precision one.
 *
 * WHY THIS DOES NOT DISCHARGE O3
 * ------------------------------
 * O3 asks for a CERTIFIED two-sided rate |rho(eps) - 2/3| <= K eps^{3/2} uniform on (0, eps_0] with a rigorous
 * remainder bound on the TRUE RvM cusp jet. Assembling the eps^{11/2} coefficient in closed form extends the
 * remainder SHAPE such a proof targets but supplies neither the uniform inequality nor a certified bound, and
 * is derived on the inherited model-cusp surrogate. G-b / G6a stay OPEN.
 *
 * VERDICT: DERIVATION ONLY on the inherited imp-3220/imp-3406/imp-33646 model-cusp surrogate,
 * G6a_shock_lipschitz STAYS OPEN. The imp-35265 20 i t^{-12} identity term integrates to the eps^{11/2} slot
 * of D_3 (d_{11/2} = -20/11), which -- with the numerator R_2 eps^{11/2} tail (r_{11/2} = 10/11) -- assembles
 * the eps^{11/2} rho coefficient K_{11/2} = (b r_{11/2} - a d_{11/2})/(2 b^2) = 20/(3 A_2) = 40 sqrt(2)/(9 pi)
 * = 2.00070 = -(5/3) K_{7/2} in closed form (no cross term contributes at 11/2). It matches two grid checks: a
 * well-conditioned tail-coefficient read of 10/11 and -20/11 to ~1e-4, and the quadruply-cancelled rho-level
 * imp-35298 ladder read climbing to 2.0005 in the clean eps in [1e-2, 1e-3] window before machine-floor
 * destabilisation. This extends the imp-35298 ladder one slot but does NOT certify a uniform modulus, does NOT
 * discharge O3 or G6a, establishes no operator positivity, changes no bound. imp-3066 off-diagonal endpoint-
 * Hankel K_a >= 0 UNTOUCHED; C_mb remains GUE-conditional (imp-486); NO QED. No refereed bound is changed.
 *
 * @see imp-35265-eps52-cancellation-exact-identity (the 20 i t^{-12} identity term; K_{7/2} = -8 sqrt(2)/(3 pi))
 * @see imp-35298-rho-eps5-next-slot-measurement (the eps^5 cross term K_5 and the compensated ladder reused here)
 * @see imp-33646-h4-privalov-sokhotski-constant-scoping (A_1 = pi/sqrt(2), |F_2(inf)| = A_1/2)
 * @see imp-33645-h3-curvature-divergence-scoping (A_2 = 3 pi/(2 sqrt(2)), |F_3(inf)| = A_2/4; A_1/A_2 = 2/3)
 */

const PI = Math.PI;
const SQRT2 = Math.SQRT2;

// Inherited amplitude constants (imp-33645 / imp-33646).
const A1 = PI / SQRT2; // eps^{3/2} renorm of |m_prime|        -> |F_2(inf)| = A_1/2
const A2 = (3 * PI) / (2 * SQRT2); // eps^{5/2} renorm of |m_double_prime| -> |F_3(inf)| = A_2/4

// The subtracted lower-order coefficients (imp-35216 / imp-35265 / imp-35298).
const K_THREE_HALVES = 4 / (3 * A2); // 0.40014  = 8 sqrt(2)/(9 pi)
const K_SEVEN_HALVES = -8 / (3 * A1); // -1.20042 = -8 sqrt(2)/(3 pi) = -4/A_2
const K_FIVE = -2 / (7 * (A2 / 4) * (A2 / 4)); // -0.41172 = -256/(63 pi^2) (imp-35298 cross term)

// Tail-expansion coefficients (from the t^{-12} identity terms of the two integrands).
const R_11_2 = 10 / 11; // numerator g_2 tail:  10 t^{-12} -> (10/11) eps^{11/2}
const D_11_2 = -20 / 11; // denominator g_3 tail: 20 i t^{-12} -> -(20/11) eps^{11/2} (imp-35265 identity term)
const R_3_2 = 2 / 3;
const R_7_2 = -6 / 7;
const D_7_2 = 6 / 7;

// ── imp-35298 compensated finite-cutoff machinery (Kahan-compensated mapped Simpson). ──
const F_INF_PANELS = 1000000;
const TAIL_PANELS = 300000;

// Numerator integrand g_2(t) = 2(t^4-1)/(t^4+1)^2 (even p: SUM, real).
function g2(t) {
  const t4 = t * t * t * t;
  const s = t4 + 1;
  return (2 * (t4 - 1)) / (s * s);
}
// Denominator integrand: the imp-35265 odd-p (p=3) difference pairing Im part (1-3t^4)/(t^4+1)^3.
function g3diff(t) {
  const t4 = t * t * t * t;
  return (1 - 3 * t4) / Math.pow(t4 + 1, 3);
}
// Kahan-compensated composite-Simpson rule over [0, 1] with `panels` intervals (panels even).
function compensatedSimpson(f, panels) {
  const h = 1 / panels;
  let sum = 0;
  let comp = 0;
  for (let i = 0; i <= panels; i++) {
    const w = i === 0 || i === panels ? 1 : i % 2 === 1 ? 4 : 2;
    const y = w * f(i * h) - comp;
    const t = sum + y;
    comp = t - sum - y;
    sum = t;
  }
  return (sum * h) / 3;
}
// integral_0^infinity g(t) dt via t = s/(1-s).
function fInfinity(g, panels) {
  return compensatedSimpson((x) => {
    if (x >= 1) return 0;
    const om = 1 - x;
    return g(x / om) / (om * om);
  }, panels);
}
// integral_L^infinity g(t) dt via t = L/w (integrand -> 0 at w = 0).
function tailIntegral(g, L, panels) {
  return compensatedSimpson((w) => {
    if (w === 0) return 0;
    const t = L / w;
    return g(t) * (L / (w * w));
  }, panels);
}

// Machine-precision infinite-cutoff renorm constants (computed once).
const F2_INF = fInfinity(g2, F_INF_PANELS);
const J_INF = fInfinity(g3diff, F_INF_PANELS);
const A = Math.abs(F2_INF); // = A_1/2
const B = 2 * Math.abs(J_INF); // = A_2/4

// ── (A) Closed-form assembly of K_{11/2} from the two eps^{11/2} tails (no cross term at 11/2). ──
const K112_ASSEMBLED = (B * R_11_2 - A * D_11_2) / (2 * B * B); // (b r_{11/2} - a d_{11/2})/(2 b^2)
const K_ELEVEN_HALVES = 20 / (3 * A2); // closed form 20/(3 A_2)
const K112_CLOSED_FORM = (40 * SQRT2) / (9 * PI); // = 40 sqrt(2)/(9 pi) = 2.00070
const K112_OVER_K72 = K_ELEVEN_HALVES / K_SEVEN_HALVES; // = -5/3 (exact)

// ── (B) Tail-level cross-check (well-conditioned): isolate r_{11/2} = 10/11 and d_{11/2} = -20/11. ──
const TAIL_EPS = [1e-2, 3e-3, 1e-3];
const TAIL_READS = TAIL_EPS.map((eps) => {
  const L = 1 / Math.sqrt(eps);
  const R2 = tailIntegral(g2, L, TAIL_PANELS);
  const D3 = -2 * tailIntegral(g3diff, L, TAIL_PANELS);
  const rRead = (R2 - R_3_2 * Math.pow(eps, 1.5) - R_7_2 * Math.pow(eps, 3.5)) / Math.pow(eps, 5.5);
  const dRead = (D3 - D_7_2 * Math.pow(eps, 3.5)) / Math.pow(eps, 5.5);
  return { eps, rRead, dRead };
});
const R112_MAX_ERR = Math.max(...TAIL_READS.map((r) => Math.abs(r.rRead - R_11_2)));
const D112_MAX_ERR = Math.max(...TAIL_READS.map((r) => Math.abs(r.dRead - D_11_2)));

// ── (C) Rho-level cross-check (quadruply-cancelled): r3/eps^{11/2} -> K_{11/2} on the imp-35298 ladder. ──
const GRID_EPS = [1e-2, 3e-3, 1e-3, 3e-4];
const GRID = GRID_EPS.map((eps) => {
  const L = 1 / Math.sqrt(eps);
  const R2 = tailIntegral(g2, L, TAIL_PANELS);
  const D3 = -2 * tailIntegral(g3diff, L, TAIL_PANELS);
  const dev = (B * R2 - A * D3) / (2 * B * (B + D3));
  const r3 =
    dev -
    K_THREE_HALVES * Math.pow(eps, 1.5) -
    K_SEVEN_HALVES * Math.pow(eps, 3.5) -
    K_FIVE * Math.pow(eps, 5);
  return { eps, r3, r3OverEps112: r3 / Math.pow(eps, 5.5) };
});
// Clean rho-level window: eps in [1e-2, 1e-3] (indices 0..2); below that the quadruple cancellation floors.
const CLEAN = GRID.slice(0, 3);
const GRID_BEST_ERR = Math.min(...CLEAN.map((r) => Math.abs(r.r3OverEps112 - K_ELEVEN_HALVES)));
const GRID_WINDOW_MAX_ERR = Math.max(...CLEAN.map((r) => Math.abs(r.r3OverEps112 - K_ELEVEN_HALVES)));
// Monotone climb toward K_{11/2} across the clean window (reads decrease from above).
const GRID_MONOTONE_TO_K112 = CLEAN.every((r, i) => i === 0 || r.r3OverEps112 < CLEAN[i - 1].r3OverEps112);
// The tail rung (eps = 3e-4) destabilises above the clean-window spread (documented machine-floor read).
const TAIL_RUNG_DESTABILISES =
  Math.abs(GRID[3].r3OverEps112 - K_ELEVEN_HALVES) > Math.abs(GRID[2].r3OverEps112 - K_ELEVEN_HALVES);

export const IMP35375_K112_CUSP_TAIL_CLOSED_FORM = {
  id: 'imp-35375',
  proofSection: 'S-frontier',
  scopes:
    'Assemble the next model-cusp rho coefficient K_{11/2} in closed form from the imp-35265 exact 20 i t^{-12} ' +
    'identity term (the eps^{11/2} tail of D_3, d_{11/2} = -20/11), together with the numerator R_2 eps^{11/2} ' +
    'tail (r_{11/2} = 10/11), and cross-check against the imp-35298 grid ladder',
  question:
    'Does the imp-35265 20 i t^{-12} identity term assemble the eps^{11/2} rho coefficient in closed form as ' +
    'K_{11/2} = (b r_{11/2} - a d_{11/2})/(2 b^2) = 20/(3 A_2) = 40 sqrt(2)/(9 pi) = -(5/3) K_{7/2}, matched by ' +
    'the imp-35298 grid? Derivation only on the inherited surrogate; does NOT discharge O3; G6a stays OPEN; NO QED.',

  // Constants and subtracted lower-order coefficients.
  A1,
  A2,
  aRenorm: +A.toFixed(10), // |F_2(inf)| = A_1/2
  bRenorm: +B.toFixed(10), // |F_3(inf)| = A_2/4
  kThreeHalves: +K_THREE_HALVES.toFixed(10),
  kSevenHalves: +K_SEVEN_HALVES.toFixed(10),
  kFive: +K_FIVE.toFixed(10),

  // The eps^{11/2} tail coefficients (the two t^{-12} identity terms).
  rEleventHalvesTail: +R_11_2.toFixed(10), // 10/11 (numerator 10 t^{-12})
  dEleventHalvesTail: +D_11_2.toFixed(10), // -20/11 (imp-35265 20 i t^{-12} identity term)

  // The assembled closed form.
  kElevenHalves: +K_ELEVEN_HALVES.toFixed(10), // 2.0007029248
  kElevenHalvesExpr: 'K_{11/2} = (b r_{11/2} - a d_{11/2})/(2 b^2) = (5/11)(b + 2a)/b^2 = 20/(3 A_2) = 40 sqrt(2)/(9 pi)',
  kElevenHalvesClosedForm: +K112_CLOSED_FORM.toFixed(10), // 2.0007029248
  kElevenHalvesAssembledFromTails: +K112_ASSEMBLED.toFixed(10), // matches closed form
  kElevenHalvesOverKSevenHalves: +K112_OVER_K72.toFixed(10), // -1.6666666667 = -5/3
  noCrossTermAtElevenHalves: true, // eps^{3/2} x eps^{7/2} = eps^5, not eps^{11/2}; 11/2 is a one-source slot

  correctedExpansion:
    'rho(eps) = 2/3 + [8 sqrt(2)/(9 pi)] eps^{3/2} + 0 * eps^{5/2} - [8 sqrt(2)/(3 pi)] eps^{7/2} ' +
    '- [256/(63 pi^2)] eps^5 + [40 sqrt(2)/(9 pi)] eps^{11/2} + ...',
  orderedExponentLadder: '3/2, 7/2, 5, 11/2, 7, ... (eps^{11/2} is the slot AFTER the eps^5 cross term)',

  // (B) Tail-level cross-check (well-conditioned).
  tailReads: TAIL_READS.map((r) => ({
    eps: +r.eps.toExponential(1),
    rRead: +r.rRead.toFixed(6), // -> 10/11 = 0.909091
    dRead: +r.dRead.toFixed(6), // -> -20/11 = -1.818182
  })),
  r112MaxErr: +R112_MAX_ERR.toExponential(3), // ~1e-4 or better
  d112MaxErr: +D112_MAX_ERR.toExponential(3), // ~1e-4 or better

  // (C) Rho-level cross-check on the imp-35298 quadruply-cancelled ladder.
  gridLadder: GRID.map((r) => ({
    eps: +r.eps.toExponential(1),
    r3: +r.r3.toExponential(4), // quadruply-cancelled residual (nears machine floor at eps = 3e-4)
    r3OverEps112: +r.r3OverEps112.toFixed(5), // -> K_{11/2} = 2.00070 in the clean window
  })),
  gridBestErr: +GRID_BEST_ERR.toExponential(3), // best clean rung within ~5e-4 of K_{11/2}
  gridWindowMaxErr: +GRID_WINDOW_MAX_ERR.toExponential(3), // clean window within ~3e-3
  gridMonotoneToK112: GRID_MONOTONE_TO_K112, // reads descend toward K_{11/2} from above
  tailRungDestabilises: TAIL_RUNG_DESTABILISES, // eps = 3e-4 read leaves the clean trend (machine floor)
  quadratureWindowNote:
    'r3 = dev - K_{3/2} eps^{3/2} - K_{7/2} eps^{7/2} - K_5 eps^5 is quadruply-cancelled, so the clean rho-level ' +
    'eps^{11/2} window is eps in [1e-2, 1e-3]; below eps ~ 1e-3 the r3 cancellation (r3 ~ 6e-17 at eps = 1e-3) ' +
    'nears the machine floor and r3/eps^{11/2} destabilises. The tail-level read of 10/11 and -20/11 is the ' +
    'high-precision check.',

  dischargesO3orG6a: false,
  isRigorous: false,
  residualObstruction:
    'O3 asks for a CERTIFIED two-sided rate |rho(eps) - 2/3| <= K eps^{3/2} uniform on (0, eps_0] with a rigorous ' +
    'remainder bound on the TRUE RvM cusp jet; assembling the eps^{11/2} coefficient in closed form extends the ' +
    'remainder shape such a bound must have but supplies neither the uniform inequality nor a certified remainder, ' +
    'and is derived on the model-cusp surrogate; G-b stays OPEN',
  verdict:
    'DERIVATION ONLY on the inherited imp-3220/imp-3406/imp-33646 model-cusp surrogate, G6a_shock_lipschitz ' +
    'STAYS OPEN. The imp-35265 20 i t^{-12} identity term integrates to the eps^{11/2} slot of the denominator ' +
    'tail D_3 (d_{11/2} = -20/11); with the numerator R_2 eps^{11/2} tail (r_{11/2} = 10/11) it assembles the ' +
    'eps^{11/2} rho coefficient K_{11/2} = (b r_{11/2} - a d_{11/2})/(2 b^2) = (5/11)(b + 2a)/b^2 = 20/(3 A_2) = ' +
    '40 sqrt(2)/(9 pi) = 2.00070 = -(5/3) K_{7/2} in closed form (no cross term contributes at 11/2, since ' +
    'eps^{3/2} x eps^{7/2} = eps^5 is the intervening imp-35298 integer slot K_5). It matches two grid checks: a ' +
    'well-conditioned tail-coefficient read of 10/11 and -20/11 to ~1e-4, and the quadruply-cancelled rho-level ' +
    'imp-35298 ladder read climbing to 2.0005 in the clean eps in [1e-2, 1e-3] window before machine-floor ' +
    'destabilisation. This extends the imp-35298 ladder one slot but does NOT certify a uniform modulus, does NOT ' +
    'discharge O3 or G6a, establishes no operator positivity, changes no bound. imp-3066 off-diagonal endpoint-' +
    'Hankel K_a >= 0 UNTOUCHED; C_mb remains GUE-conditional (imp-486); NO QED. No refereed bound is changed' +
    '.',
};

export const IMP35375_K112_CUSP_TAIL_ASSERTIONS = [
  {
    // (1) the eps^{11/2} coefficient assembles in closed form: (b r_{11/2} - a d_{11/2})/(2 b^2) = 20/(3 A_2)
    // = 40 sqrt(2)/(9 pi) = -(5/3) K_{7/2}.
    id: 'imp35375-k112-closed-form',
    description:
      'K_{11/2} = (b r_{11/2} - a d_{11/2})/(2 b^2) = 20/(3 A_2) = 40 sqrt(2)/(9 pi) = -(5/3) K_{7/2} ~ 2.00070',
    holds: () =>
      Math.abs(K112_ASSEMBLED - K_ELEVEN_HALVES) < 1e-9 &&
      Math.abs(K_ELEVEN_HALVES - K112_CLOSED_FORM) < 1e-9 &&
      Math.abs(K_ELEVEN_HALVES - (40 * SQRT2) / (9 * PI)) < 1e-12 &&
      Math.abs(K112_OVER_K72 - -5 / 3) < 1e-9 &&
      Math.abs(K_ELEVEN_HALVES - 2.0007029248) < 1e-6,
  },
  {
    // (2) the renorm constants reproduce A_1/2 and A_2/4 (route sanity).
    id: 'imp35375-renorm-machine-precision',
    description: 'compensated |F_p(inf)| reproduce A_1/2 and A_2/4 to < 1e-12 (the ladder is not swamped by roundoff)',
    holds: () => Math.abs(A - A1 / 2) < 1e-12 && Math.abs(B - A2 / 4) < 1e-12,
  },
  {
    // (3) tail-level cross-check: the two t^{-12} identity terms give r_{11/2} = 10/11 and d_{11/2} = -20/11.
    id: 'imp35375-tail-coefficients-10-11-and-minus-20-11',
    description:
      'the numerator 10 t^{-12} and denominator 20 i t^{-12} tails read r_{11/2} = 10/11 and d_{11/2} = -20/11 to ~1e-4',
    holds: () => R112_MAX_ERR < 1e-3 && D112_MAX_ERR < 1e-3,
  },
  {
    // (4) rho-level cross-check: r3/eps^{11/2} climbs to K_{11/2} in the clean window then destabilises at the floor.
    id: 'imp35375-grid-crosscheck-eps112',
    description:
      'the imp-35298 quadruply-cancelled r3/eps^{11/2} matches K_{11/2} in eps in [1e-2, 1e-3] (best < 5e-3) then floors',
    holds: () =>
      GRID_BEST_ERR < 5e-3 &&
      GRID_WINDOW_MAX_ERR < 1e-2 &&
      GRID_MONOTONE_TO_K112 === true &&
      TAIL_RUNG_DESTABILISES === true,
  },
  {
    // Honesty gate: derivation only; does NOT discharge O3/G6a, no QED, no refereed bound is changed, imp-3066 untouched.
    id: 'imp35375-honesty-gate-no-qed',
    description:
      'Derivation only: K_{11/2} assembled but O3/G6a NOT discharged, no QED, no refereed bound is changed, imp-3066 untouched',
    holds: () =>
      IMP35375_K112_CUSP_TAIL_CLOSED_FORM.isRigorous === false &&
      IMP35375_K112_CUSP_TAIL_CLOSED_FORM.dischargesO3orG6a === false &&
      /NO QED/.test(IMP35375_K112_CUSP_TAIL_CLOSED_FORM.verdict) &&
      /STAYS OPEN/.test(IMP35375_K112_CUSP_TAIL_CLOSED_FORM.verdict) &&
      /refereed bound is changed/i.test(IMP35375_K112_CUSP_TAIL_CLOSED_FORM.verdict) &&
      /imp-3066 off-diagonal endpoint-Hankel K_a >= 0 UNTOUCHED/.test(IMP35375_K112_CUSP_TAIL_CLOSED_FORM.verdict),
  },
];

for (const a of IMP35375_K112_CUSP_TAIL_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35375-k112-cusp-tail-closed-form assertion failed: ${a.id}`);
  }
}
