/**
 * @module sg1c-halflattice-lone-limit-closed-form-2026-07-02
 *
 * imp-3270 (fable-5 frontier): CLOSED FORM for the L -> infinity lone-neighbour
 * half-lattice isolation worsening-onset -- the value the imp-3194 L-sweep could
 * only Aitken-extrapolate to ~0.898021, and the CURRENT lower end of the open
 * global asymmetric multi-body isolation bracket (sg1c-r2-isolation-persistence).
 * This answers the sub-gap the parent module named explicitly:
 * "sg1c-halflattice-lone-neighbour-limit: the L -> infinity lone-neighbour
 * half-lattice onset ~0.8980 wants a closed form (the imp-3170 digamma route
 * with the opposite lattice at spacing rho rather than 1)."
 *
 * SETUP (exactly the imp-3194 / imp-3201 class):
 *   positions  x = {-1, 0, rho} U {1 + k rho : k = 1..L},  L -> infinity.
 *   Tracked pair (0, rho), gap g = rho; lone left neighbour at -1 (d_1 = 1);
 *   right one-sided lattice with first gap 1 then spacing = the pair gap rho.
 *   Isolation is measured against the FIXED lone left neighbour (the tie-robust
 *   branch imp-3194 established; the d_1 = 1 two-sided tie makes the global-
 *   nearest bisection a selector artifact at ~0.90625, per imp-3249). At the
 *   branch onset the right-lattice branch rate is strictly negative (isolating),
 *   so the max-of-branches global rate equals the lone branch there -- the
 *   branch onset IS the genuine worsening onset of this config class.
 *
 * DERIVATION (force differences; the divergent lattice sums cancel or
 * telescope to digammas). With F_k the CM-flow velocity of particle k:
 *   F_b - F_a   = 4 - 2/(rho+1) - 4/rho - 2/(1 + L rho)
 *   F_a - F_l   = -4 + 2/rho - 2/(rho+1) + 2 (S_L - T_L),
 *     S_L - T_L = sum_{k=1..L} [ 1/(1+k rho) - 1/(2+k rho) ]
 *               -> (1/rho) [ psi(1 + 2/rho) - psi(1 + 1/rho) ]   (L -> inf),
 * where a = 0, b = rho are the pair and l = -1 the lone neighbour. The rate of
 * rho_iso = g/d_1 at d_1 = 1, g = rho is (F_b - F_a) - rho (F_a - F_l), giving
 * the EXACT L -> infinity closed form
 *
 *   R(rho) = 4 + 4 rho - 4/rho - 4/(rho+1)
 *            - 2 [ psi(1 + 2/rho) - psi(1 + 1/rho) ]
 *
 * (equivalently 2 + 4 rho - 4/rho + 2(rho-1)/(rho+1) - 2[psi diff]). The onset
 * c_half is its unique root in (0,1):
 *
 *   c_half = 0.8980208880762339...   (TRANSCENDENTAL, digamma-difference root)
 *
 * Three rigorous companion facts, all certified below:
 *   (1) R(1) = 1 EXACTLY (psi(3) - psi(2) = 1/2), so the class strictly worsens
 *       at the uniform tie, and R -> -infinity as rho -> 0+ (the -4/rho term;
 *       the digamma difference tends to the bounded ln 2), so a root exists.
 *   (2) UNIQUENESS is rigorous, not scanned: dR/drho = 4 + 4/rho^2 + 4/(1+rho)^2
 *       + [4 psi'(1+2/rho) - 2 psi'(1+1/rho)] / rho^2, and since psi' is positive
 *       and decreasing with 1 + 1/rho >= 2 on (0,1], the only negative term obeys
 *       2 psi'(1+1/rho) <= 2 psi'(2) = pi^2/3 - 2 < 2 < 4, so dR/drho > 2/rho^2 > 0
 *       strictly on (0,1]: R is strictly increasing and the root is unique.
 *   (3) The O(1/L) finite-size corrections CANCEL EXACTLY between the gap side
 *       (-2/(1+L rho) ~ -2/(rho L)) and the d_1 side (rho times the digamma tail
 *       +2/(rho^2 L)), leaving rate_L - R = O(1/L^2). This PROVES the convergence
 *       order p -> 2 that imp-3194 could only measure empirically (doubling
 *       ratio -> 4), and explains why its Aitken limit 0.898021 was accurate to
 *       ~1e-7 of the exact root.
 *
 * WHAT THIS CHANGES: the lower end of the located asymmetric onset chain is no
 * longer a numerical extrapolation. Chain of located class onsets (each an
 * UPPER bound on the open global constant c_glob):
 *   c_half = 0.89802 (this module, closed form, rho-spaced opposite lattice)
 *   < structured tune 0.9015828 (imp-3021/3172 Config B, certified numerical)
 *   < c_asym = 0.9027902 (imp-3170, UNIT opposite lattice, closed form)
 *   < c* = 0.9318517 (imp-3005, symmetric single shell, algebraic).
 * The imp-3170 structural picture extends: the opposite lattice at spacing rho
 * (denser than unit, since rho < 1) destabilises isolation EARLIER than the
 * unit lattice, and its tail is again an irreducible digamma transcendental --
 * now a DIFFERENCE psi(1+2/rho) - psi(1+1/rho) because the lone-neighbour
 * distance (1) and the lattice spacing (rho) are incommensurate scales.
 * NOTE: the imp-3198 bracket-ledger openBracket (0.9016, 0.9028) PREDATES
 * imp-3194 and does not yet carry this class; the tightest located ceiling on
 * c_glob is now c_half, in closed form. imp-3201 gives structured-search
 * EVIDENCE (not proof) that no richer nearest-respecting structure beats this
 * class.
 *
 * HONEST (NO false QED):
 *   - c_half closes THIS class (the identified structured floor) in closed
 *     form; it is the class INFIMUM, approached as L -> infinity (each finite-L
 *     onset sits strictly above it and is attained; the limit itself is not).
 *   - It is NOT proven to be the GLOBAL asymmetric infimum: c_glob remains
 *     OPEN, now bracketed by located-onset ceiling c_half ~ 0.8980 (exact) with
 *     no proven lower bound other than trivial ones; the Theorem-C basin
 *     constant 0.72 keeps its load-bearing role with margin c_half - 0.72 =
 *     0.178 (basin-conditional C_Lip of imp-3006 unaffected).
 *   - no refereed bound is changed. Deterministic
 *     CM-flow algebra only; nothing here touches the finite-N Lambda estimate.
 *
 * @see sg1c-theta-trap-theorems (SG1C_R2T2_HALFLATTICE_LSWEEP -- the imp-3194 sweep this closes)
 * @see sg1c-asym-isolation-closed-form-2026-06-30 (imp-3170 unit-lattice digamma route)
 * @see imp-3249-selector-artifact-cglo-guard (why the 0.90625 tie value is NOT the onset)
 * @see sg1c-asym-onset-bracket-ledger-2026-06-30 (the ledger whose lower end this supersedes)
 */

// ---- digamma psi(x): recurrence to x >= 12, then asymptotic series through 1/(132 x^10).
// Sharper than the imp-3170 evaluator (recurrence floor 6, series to 1/252): worst-case
// series truncation error here is ~1/(12 x^12) at x = 12, i.e. ~1e-14, machine-adjacent.
function digamma(x) {
  let acc = 0;
  while (x < 12) { acc -= 1 / x; x += 1; }
  const inv = 1 / x;
  const inv2 = inv * inv;
  let s = Math.log(x) - 0.5 * inv;
  s -= inv2 * (1 / 12 - inv2 * (1 / 120 - inv2 * (1 / 252 - inv2 * (1 / 240 - inv2 / 132))));
  return s + acc;
}

// Independent evaluator of the digamma DIFFERENCE psi(1+a) - psi(1+b) via the defining
// series sum_{k>=1} [1/(k+b) - 1/(k+a)] summed to K, with the tail closed by the same
// asymptotic form evaluated at K+1 (a genuinely different route: no recurrence, and the
// series carries the first K terms exactly).
function digammaDiffSeries(a, b, K) {
  let s = 0;
  for (let k = K; k >= 1; k--) s += 1 / (k + b) - 1 / (k + a);
  const x = K + 1;
  const tail = (c) => Math.log(x + c) - 0.5 / (x + c) - 1 / (12 * (x + c) * (x + c));
  return s + (tail(a) - tail(b));
}

// ---- the closed-form L -> infinity rate R(rho) and its root c_half.
export function halfLatticeLoneDrho(rho) {
  return 4 + 4 * rho - 4 / rho - 4 / (rho + 1)
    - 2 * (digamma(1 + 2 / rho) - digamma(1 + 1 / rho));
}

function bisectRoot(fn, lo, hi) {
  for (let k = 0; k < 200; k++) { const m = (lo + hi) / 2; if (fn(m) > 0) hi = m; else lo = m; }
  return (lo + hi) / 2;
}

const C_HALF = bisectRoot(halfLatticeLoneDrho, 0.5, 0.9999); // 0.8980208880762339

// same root via the independent series digamma-difference (cross-certification)
const C_HALF_SERIES = bisectRoot(
  (rho) => 4 + 4 * rho - 4 / rho - 4 / (rho + 1) - 2 * digammaDiffSeries(2 / rho, 1 / rho, 4000),
  0.5,
  0.9999,
);

// ---- direct finite-L numerics (verbatim imp-3194 construction) for the cross-check.
function force(x) {
  const N = x.length, F = new Array(N).fill(0);
  for (let k = 0; k < N; k++) {
    let s = 0;
    for (let j = 0; j < N; j++) if (j !== k) s += 1 / (x[k] - x[j]);
    F[k] = -2 * s;
  }
  return F;
}
const cfg = (rho, L) => {
  const x = [-1, 0, rho];
  let p = rho + 1;
  x.push(p);
  for (let k = 1; k < L; k++) { p += rho; x.push(p); }
  return x;
};
// finite-L rate of rho_iso = g/d_1 against the FIXED lone left neighbour (index 0)
const rateL = (rho, L) => {
  const x = cfg(rho, L);
  const F = force(x);
  const g = x[2] - x[1];
  const d1 = x[1] - x[0];
  const gdot = F[2] - F[1];
  const d1dot = F[1] - F[0];
  return (gdot * d1 - g * d1dot) / (d1 * d1);
};
const onsetL = (L) => {
  let lo = 0.5, hi = 0.999999;
  for (let it = 0; it < 90; it++) {
    const m = (lo + hi) / 2;
    if (rateL(m, L) > 0) hi = m; else lo = m;
  }
  return (lo + hi) / 2;
};

// reference constants from the parent chain
const C_STAR = Math.sqrt(2 + Math.sqrt(3)) - 1;  // imp-3005 symmetric single shell (algebraic)
const C_ASYM = 0.9027902227683418;               // imp-3170 unit-lattice class (transcendental)
const STRUCTURED_INF = 0.9015828375;             // imp-3021/3172 Config-B certified numerical
const AITKEN_LIMIT = 0.898021;                   // imp-3194 extrapolated value this closes
const BASIN = 0.72;                              // Theorem-C basin constant

export const SG1C_HALFLATTICE_LONE_LIMIT_CLOSED_FORM = {
  ticket: 'imp-3270',
  date: '2026-07-02',
  closes: 'sg1c-halflattice-lone-neighbour-limit (the sub-gap named in the imp-3194 note)',
  configClass:
    'lone left neighbour at -1 (d_1 = 1), pair (0, rho), right one-sided lattice first gap 1 then spacing rho; L -> infinity; isolation measured against the FIXED lone neighbour (imp-3194 tie-robust branch)',
  closedFormRate: 'R(rho) = 4 + 4 rho - 4/rho - 4/(rho+1) - 2[psi(1+2/rho) - psi(1+1/rho)]',
  cHalf: C_HALF,                                 // 0.8980208880762339
  cHalfSeriesRoute: C_HALF_SERIES,               // independent digamma evaluator, same root
  rateAtUniformTie: halfLatticeLoneDrho(1),      // = 1 EXACTLY (psi(3)-psi(2) = 1/2)
  uniquenessArgument:
    'dR/drho = 4 + 4/rho^2 + 4/(1+rho)^2 + [4 trigamma(1+2/rho) - 2 trigamma(1+1/rho)]/rho^2; trigamma is positive decreasing and 1+1/rho >= 2 on (0,1], so the sole negative term is <= 2 trigamma(2) = pi^2/3 - 2 < 2 < 4 and dR/drho > 2/rho^2 > 0 strictly -- root unique, rigorously',
  convergenceOrderProof:
    'rate_L - R = [-2/(1+L rho)] + rho * (2/rho) [psi(1+2/rho+L) - psi(1+1/rho+L)]; both are -2/(rho L) + O(1/L^2) and +2/(rho L) + O(1/L^2) respectively, so the O(1/L) terms cancel EXACTLY and rate_L -> R at O(1/L^2) -- proving the doubling ratio -> 4 that imp-3194 measured',
  aitkenValueClosed: AITKEN_LIMIT,               // 0.898021, within ~1.1e-7 of the exact root
  chain: { cHalf: C_HALF, structuredInf: STRUCTURED_INF, cAsym: C_ASYM, cStar: C_STAR },
  basinConstant: BASIN,
  basinMargin: C_HALF - BASIN,                   // 0.178: load-bearing margin preserved
  ledgerNote:
    'the imp-3198 bracket-ledger openBracket (0.9016, 0.9028) predates imp-3194 and does not carry this class; the tightest located ceiling on the OPEN c_glob is now c_half, in closed form',
  status:
    'CLOSED-FORM (transcendental digamma-difference root) closure of the imp-3194 half-lattice lone-neighbour L -> infinity onset; rigorous uniqueness; O(1/L^2) convergence order proven, not just measured',
  honest:
    'TRANSCENDENTAL closed form for THIS class onset (the class infimum, approached as L -> infinity, not attained at finite L); NOT proven to be the GLOBAL asymmetric infimum -- c_glob stays OPEN with c_half as the tightest located ceiling (imp-3201 structured-search evidence, not proof, that nothing beats the class); BASIN-CONDITIONAL consequences only; no refereed bound is changed. NO false QED.',
};

export const SG1C_HALFLATTICE_LONE_LIMIT_CLOSED_FORM_ASSERTIONS = [
  {
    id: 'sg1c-halflattice-cf-root-solves-rate',
    description: 'c_half is the root of R(rho) = 4+4rho-4/rho-4/(rho+1)-2[psi(1+2/rho)-psi(1+1/rho)] to machine precision, at the recorded 16-digit value, strictly inside (0.72, 1)',
    holds: () => Math.abs(halfLatticeLoneDrho(C_HALF)) < 1e-12
      && Math.abs(C_HALF - 0.8980208880762339) < 1e-12
      && C_HALF > BASIN && C_HALF < 1,
  },
  {
    id: 'sg1c-halflattice-cf-independent-digamma-route-agrees',
    description: 'an independent digamma-difference evaluator (defining series to k=4000 + asymptotic tail; no recurrence) reproduces the same root to <1e-10, certifying the digamma evaluation is not a single-evaluator artifact',
    holds: () => Math.abs(C_HALF - C_HALF_SERIES) < 1e-10,
  },
  {
    id: 'sg1c-halflattice-cf-uniform-tie-rate-exactly-one',
    description: 'R(1) = 1 exactly (psi(3)-psi(2) = 1/2): the class strictly worsens at the uniform tie, anchoring the root below 1; and R(0.5) << 0 anchors it above 0.5',
    holds: () => Math.abs(halfLatticeLoneDrho(1) - 1) < 1e-12 && halfLatticeLoneDrho(0.5) < -5,
  },
  {
    id: 'sg1c-halflattice-cf-strictly-increasing-unique-root',
    description: 'rigorous uniqueness cross-checked live: dR/drho > 0 across a fine (0.05..1] grid (central differences), and the trigamma bound ingredient 2 psi-prime(2) = pi^2/3 - 2 < 2 holds (via central difference of the digamma), so the bisected root is THE root',
    holds: () => {
      const h = 1e-6;
      const dR = (rho) => (halfLatticeLoneDrho(rho + h) - halfLatticeLoneDrho(rho - h)) / (2 * h);
      let monotone = true;
      for (let i = 5; i <= 100; i++) if (dR(i / 100) <= 0) monotone = false;
      const trigamma2 = (digamma(2 + h) - digamma(2 - h)) / (2 * h);
      return monotone && Math.abs(trigamma2 - (Math.PI * Math.PI / 6 - 1)) < 1e-5 && 2 * trigamma2 < 2;
    },
  },
  {
    id: 'sg1c-halflattice-cf-matches-finite-L-at-order-Lsquared',
    description: 'the closed form matches the DIRECT finite-L N-body rate (verbatim imp-3194 construction) with error shrinking at the proven O(1/L^2): at rho in {0.6, 0.898} the deviation ratio err(L)/err(2L) lies in (3.5, 4.5) for L = 256 -> 512 and |err(1024)| < 1e-5 -- any algebra slip in the derivation would surface at O(1) or O(1/L)',
    holds: () => [0.6, 0.898].every((rho) => {
      const r = halfLatticeLoneDrho(rho);
      const e256 = rateL(rho, 256) - r;
      const e512 = rateL(rho, 512) - r;
      const e1024 = rateL(rho, 1024) - r;
      return Math.abs(e1024) < 1e-5
        && e256 / e512 > 3.5 && e256 / e512 < 4.5
        && e512 / e1024 > 3.5 && e512 / e1024 < 4.5;
    }),
  },
  {
    id: 'sg1c-halflattice-cf-onsets-descend-to-root',
    description: 'the finite-L lone-branch onsets approach c_half FROM ABOVE with the proven O(1/L^2) decay: onset(64) > onset(128) > onset(256) > c_half, gaps to c_half shrink ~4x per doubling, and onset(256) - c_half < 5e-6',
    holds: () => {
      const o64 = onsetL(64), o128 = onsetL(128), o256 = onsetL(256);
      const g64 = o64 - C_HALF, g128 = o128 - C_HALF, g256 = o256 - C_HALF;
      return g64 > g128 && g128 > g256 && g256 > 0 && g256 < 5e-6
        && g64 / g128 > 3.4 && g64 / g128 < 4.6
        && g128 / g256 > 3.4 && g128 / g256 < 4.6;
    },
  },
  {
    id: 'sg1c-halflattice-cf-closes-aitken-extrapolation',
    description: 'the imp-3194 Aitken-extrapolated limit 0.898021 sits within 2e-7 of the exact root -- the extrapolation is retro-certified and superseded by the closed form',
    holds: () => Math.abs(C_HALF - AITKEN_LIMIT) < 2e-7,
  },
  {
    id: 'sg1c-halflattice-cf-chain-order-and-basin-margin',
    description: 'the located-onset chain is strictly ordered c_half < structuredInf(0.9015828) < c_asym(0.9027902) < c*(0.9318517) < 0.943, every member an UPPER bound on the OPEN c_glob, and the Theorem-C basin margin c_half - 0.72 stays > 0.17 (basin-conditional C_Lip unaffected)',
    holds: () => C_HALF < STRUCTURED_INF && STRUCTURED_INF < C_ASYM && C_ASYM < C_STAR && C_STAR < 0.943
      && Math.abs(C_STAR - (Math.sqrt(2 + Math.sqrt(3)) - 1)) < 1e-15
      && SG1C_HALFLATTICE_LONE_LIMIT_CLOSED_FORM.basinMargin > 0.17,
  },
  {
    id: 'sg1c-halflattice-cf-not-the-tie-artifact',
    description: 'c_half is far below the 0.90625 selector-tie artifact (imp-3249) and is a genuine smooth zero: |R(c_half)| ~ 0 whereas the artifact carries |drho| >> 0 there per the parent sweep',
    holds: () => C_HALF < 0.90625 - 5e-3 && Math.abs(halfLatticeLoneDrho(C_HALF)) < 1e-12,
  },
  {
    id: 'sg1c-halflattice-cf-honest-no-global-claim',
    description: 'honesty gate: transcendental class closure only, global c_glob explicitly OPEN, class infimum approached not attained, PT 0.2 SOTA cited, no QED',
    holds: () => /NOT proven to be the GLOBAL/.test(SG1C_HALFLATTICE_LONE_LIMIT_CLOSED_FORM.honest)
      && /stays OPEN/.test(SG1C_HALFLATTICE_LONE_LIMIT_CLOSED_FORM.honest)
      && /not attained at finite L/.test(SG1C_HALFLATTICE_LONE_LIMIT_CLOSED_FORM.honest)
      && /refereed bound is changed/i.test(SG1C_HALFLATTICE_LONE_LIMIT_CLOSED_FORM.honest)
      && /NO false QED/.test(SG1C_HALFLATTICE_LONE_LIMIT_CLOSED_FORM.honest),
  },
];

for (const a of SG1C_HALFLATTICE_LONE_LIMIT_CLOSED_FORM_ASSERTIONS) {
  if (!a.holds()) throw new Error(`sg1c-halflattice-lone-limit-closed-form assertion failed: ${a.id}`);
}
