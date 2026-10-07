/**
 * @fileoverview route-27-function-field-twin-ladder-2026-10-06 — roadmap route 27 (batch 1): the twin ladder built exactly
 * for curves over F_q (where RH is Weil's theorem), the ladder property behind Weil's proof identified, and the lift to Q
 * mapped. One run plus one adversarial internal referee pass (independent re-implementation; not refuted, minor);
 * corrections applied. Write-up: formalization/paper/function-field-twin-ladder.md.
 *
 * Outcome: the twin-ladder Weil form of a curve is minus the intersection form on primitive Frobenius-graph classes in
 * NS(C × C); Hodge index (restricted to span{P_j}) gives Q_TL ≥ 0 and hence RH for the curve. Ladder data alone (Euler
 * product with nonnegative integer closed-point counts, functional equation, lossless bridge, rationality) do not imply RH:
 * 215 exact fakes in the census boxes satisfy all of them. The lift to Q stops at the missing surface Spec Z × Spec Z with a
 * Hodge index theorem (O3) plus a regularisation of the infinite zero count (O1). Nothing is claimed for ζ.
 *
 * PROVED (project-internal re-derivations of classical content; one internal referee pass):
 *  - R_a(z) = X(q^a z)/X(q^-a z) is a degree-2g finite Blaschke product under curve-RH; each β with |β| > q^a gives one ghost.
 *  - Exact ghost index: for N ≥ #distinct β the Toeplitz T_N = [S_{j−k}], S_n = q^{−n/2} Σ α_i^n, has exactly ν negative
 *    eigenvalues (ν = off-circle pairs). Curve-RH ⇔ T_{2g} ≥ 0. Q_TL has rank = #distinct Frobenius eigenvalues ≤ 2g (corrected).
 *  - Gram identity: q^j + q^k − Γ_j·Γ_k = −P_j·P_k = q^{(j+k)/2} S_{k−j}, P_j = Γ_j − H − q^j V. For j < k, Γ_j·Γ_k = q^j N_{k−j}
 *    (N_{k−j} points of multiplicity q^j; transversal only for j = 0 — corrected). Restricted to span{P_j}, Hodge index is the
 *    statement Q_TL ≥ 0; Weil's proof uses Hodge index ⇒ Q_TL ≥ 0 ⇒ RH (corrected: not "exactly Hodge index").
 *  - Approaches II and III coincide (Carathéodory–Toeplitz). Approach I: given semisimplicity of Frobenius on H^1 (Weil,
 *    cited), RH ⇔ U = q^{−1/2}Frob unitary for a positive Hermitian form (semisimplicity added by the referee).
 *  - Λ_E = 4 log(|a|/(2√q)) / (log q)² (−∞ at a = 0); sup over E/F_p tends to 0 along ALL primes (corrected), with
 *    |sup Λ_E| ≤ 4/((2√p − 1)(log p)²); 0 exactly for maximal curves over F_{p²}.
 *  - Ghost sensitivity: λ_min(T_2g) = −C ε² + o(ε²) with exactly one negative eigenvalue; C depends on the on-circle spectrum
 *    (corrected: 0.1586 / 0.4701 / 0.7297 are for the script's angles, not invariants of g; other angles give 7.802, 2.57e-4).
 * CERTIFIED (exact integer/rational arithmetic, no Arb): 11 curves counted over F_{p^n}; RH decided exactly; Hodge Gram inertia
 *  (2g, 0, 2) for every curve, (1, 0, 3) for the maximal curve over F_9; fake census 17 (q = 3, g = 2; stable in an enlarged box)
 *  and 198 (q = 5, g = 2; count inside the box |c1| ≤ 2q, |c2| ≤ 6q only — a survivor sits on the edge), plus g = 1 fakes
 *  1 − 5T + 5T² and 1 + 6T + 7T²; Deuring census p ≤ 97.
 * CONDITIONAL: closed-point nonnegativity for d > 60 — the run's max|α| ≤ q^0.8 hypothesis is FALSE for the census (true max
 *  log|α|/log q = 0.8926 at q = 3, 0.9767 at q = 5); repaired with the true bound (relative error ≤ 0.406 / 0.0030 at d = 61,
 *  decreasing; MEASURED roots + explicit inequality). Gram entries with delay > g + 2 use rationality of zeta (a theorem).
 *  Literature cited from memory, not re-verified.
 * MEASURED: Euler product vs P/((1−T)(1−qT)) to 1.2e-26; FE error ≤ 7.8e-41; Pick inertia (2g − ν_a, ν_a); Λ_C for curves
 *  −0.62 … −0.085 (−∞ supersingular, 0 maximal), fakes +0.020 … +0.172; one-sided Stepanov-type bound for real ghosts.
 * HEURISTIC: (O1) S_0 infinite ⇒ archimedean term as regularised self-intersection; (O3) no Spec Z × Spec Z with Hodge index
 *  (Faltings–Hriljac covers arithmetic surfaces over Spec Z, the analogue of a fibred surface, not of C × C).
 *
 * PT Λ ≤ 0.2 is the accepted benchmark; 0.1758354 and 0.1787854 remain computer-assisted candidates; RH open; NO QED.
 * Import-free. ROUTE_27_ASSERTIONS count points on elliptic curves over F_p, test Hasse ⇔ T_2 ≥ 0, check the g = 1 fakes
 * (RH false, closed-point counts integral and ≥ 0 for d ≤ 60), the Gram identity, the Λ_E census for p ≤ 97 and the d > 60 bound.
 */

// ── live helpers ──
const isPrime = (n) => { if (n < 2) return false; for (let d = 2; d * d <= n; d++) if (n % d === 0) return false; return true; };
const mobius = (n) => { let r = 1; for (let p = 2; p * p <= n; p++) { if (n % p === 0) { n /= p; if (n % p === 0) return 0; r = -r; } } return n > 1 ? -r : r; };
// #E(F_p) for y² = x³ + ax + b (p odd prime), including the point at infinity.
const countE = (p, a, b) => {
  const sq = new Array(p).fill(0); for (let y = 0; y < p; y++) sq[(y * y) % p]++;
  let n = 1; for (let x = 0; x < p; x++) n += sq[(((x * x % p) * x + a * x + b) % p + p) % p]; return n;
};
// Power sums s_e of the inverse roots of P(T) = 1 + c1 T + c2 T² (genus 1), BigInt.
const powerSums = (c1, c2, D) => { const s = [2n, -BigInt(c1)]; for (let e = 2; e <= D; e++) s.push(-BigInt(c1) * s[e - 1] - BigInt(c2) * s[e - 2]); return s; };
const closedPoints = (q, c1, c2, D) => {
  const s = powerSums(c1, c2, D); const Q = BigInt(q); const N = (e) => Q ** BigInt(e) + 1n - s[e]; const out = [];
  for (let d = 1; d <= D; d++) { let t = 0n; for (let e = 1; e <= d; e++) if (d % e === 0) t += BigInt(mobius(d / e)) * N(e); out.push({ integral: t % BigInt(d) === 0n, a: t / BigInt(d) }); }
  return out;
};
const lambdaE = (a, q) => (a === 0 ? -Infinity : 4 * Math.log(Math.abs(a) / (2 * Math.sqrt(q))) / Math.log(q) ** 2);

export const ROUTE_27 = Object.freeze({
  id: 'route-27-function-field-twin-ladder-2026-10-06',
  route: 27,
  date: '2026-10-06',
  title: 'Route 27: function-field twin ladder — the Weil form is minus an intersection form; the lift stops at Spec Z × Spec Z',
  status: 'done',
  headline: 'For curves over F_q every twin-ladder object has an exact finite form, and the twin-ladder Weil form equals minus the intersection '
    + 'form on primitive Frobenius-graph classes in NS(C × C); Hodge index on their span gives Q_TL ≥ 0 and RH for the curve. Ladder data '
    + 'alone do not imply RH (215 exact Euler-product fakes in the census boxes). The lift to Q stops at the missing surface Spec Z × Spec Z with a Hodge index theorem.',

  curves: Object.freeze({ total: 11, byGenus: Object.freeze({ 1: 6, 2: 3, 3: 2 }), gramInertia: '(2g, 0, 2)', maximalF9Inertia: '(1, 0, 3)' }),
  fakes: Object.freeze({
    g2q3: 17, g2q3Stable: true, g2q5: 198, g2q5Box: '|c1| ≤ 2q, |c2| ≤ 6q (edge survivor [1,8,30,40,25]: count within the box only)',
    g1: Object.freeze([Object.freeze({ q: 5, c1: -5, c2: 5, poly: '1 − 5T + 5T²' }), Object.freeze({ q: 7, c1: 6, c2: 7, poly: '1 + 6T + 7T²' })]),
    analysed: 6, gramInertia: Object.freeze(['(1,1,2)', '(1,1,2)', '(3,1,2)', '(2,2,2)', '(3,1,2)', '(2,2,2)']),
    nDet: Object.freeze([2, 2, 4, 3, 4, 3]), hasseFirstFail: Object.freeze([1, 1, 5, 2, 5, 2]),
    maxLogAlphaOverLogQ: Object.freeze({ 3: 0.8926, 5: 0.9767 }), runHypothesis: 0.8, runHypothesisHolds: false,
  }),
  lambdaE: Object.freeze({ sup: Object.freeze({ 5: -0.172, 73: -0.0011, 97: -0.0069 }) }),
  ghostC: Object.freeze([
    Object.freeze({ g: 2, angles: '1.0', C: 0.1586 }), Object.freeze({ g: 2, angles: '2.0', C: 7.802 }),
    Object.freeze({ g: 3, angles: '0.7, 2.1', C: 0.4701 }), Object.freeze({ g: 3, angles: '0.3, 1.2', C: 2.57e-4 }),
    Object.freeze({ g: 4, angles: '0.5, 1.4, 2.6', C: 0.7297 }),
  ]),
  d61RelativeError: Object.freeze({ 3: 0.0030, 5: 0.406 }),
  measured: Object.freeze({ eulerProductRelErr: 1.2e-26, feRelErr: 7.8e-41, lambdaCCurves: [-0.62, -0.085], lambdaCFakes: [0.020, 0.172] }),

  qObstructions: Object.freeze({
    carriesOver: Object.freeze(['direct ladder', 'bridge', 'explicit formula', 'Weil criterion']),
    doesNot: Object.freeze(['finite genus', 'delay lattice and constant-field tower', 'surface C × C with Hodge index', 'Stepanov derivative trick']),
    O1: 'S_0 = number of zeros is infinite: archimedean term as a regularised self-intersection of the diagonal (HEURISTIC)',
    O3: 'no product Spec Z × Spec Z carrying a Hodge index theorem — the Approach III blocker (HEURISTIC; matches routes-j)',
  }),
  refereeKilled: Object.freeze([
    'max|α| ≤ q^0.8 hypothesis for d > 60 (false: 0.8926 / 0.9767); conclusion repaired with the true bound',
    'ghost constants as functions of g only (they depend on the on-circle angles)',
    '"Q_TL has rank 2g" → rank = #distinct eigenvalues ≤ 2g',
    '"Hodge index is exactly Q_TL ≥ 0" → Hodge index restricted to span{P_j}',
    'Approach I without semisimplicity (Jordan block with unimodular eigenvalue: RH but not unitary)',
    '"transversal" intersections Γ_j·Γ_k for j ≥ 1 (multiplicity q^j)',
    '"restricted support detects only at (2g−1) log q" → guaranteed by N = 2g; 4 of 6 fakes detected at N = 2 or 3',
    'sup Λ_E → 0 "along primes with 2√p near an integer" → along all primes',
    'q = 5 census 198 read as complete (box-dependent)',
  ]),
  nextStep: '(1) Port the Gram identity to the semilocal S = {∞, 2} Route I trace identity: test whether D_S is a primitive-projection correction '
    + '(analogue of subtracting the H and V classes). (2) Rebuild a python-flint venv and redo the Pick/Toeplitz steps in Arb balls. (3) Optional site page.',
  files: Object.freeze(['formalization/paper/function-field-twin-ladder.md', 'tmp/routes-b1-r27-ffladder.py', 'tmp/routes-b1-r27-results.json',
    'tmp/routes-b1-r27-ghost-eps.py', 'tmp/routes-b1-r27-onesided.py', 'tmp/routes-b1-ref27-verify.py', 'tmp/routes-b1-ref27-census.py']),
  verdict: 'Route 27 is built and mapped: over F_q the twin-ladder Weil form is minus the intersection form on primitive Frobenius-graph '
    + 'classes, so Weil\'s proof is Approach III with B built from divisor classes. Ladder data alone do not imply RH (215 exact fakes in the '
    + 'census boxes; some pass Weil positivity up to delay 2 log q). The lift to Q stops at the missing Spec Z × Spec Z with Hodge index (O3) '
    + 'and needs a regularisation of the infinite zero count (O1). Nothing is claimed for ζ. PT Lambda <= 0.2 stands; 0.1758354 and 0.1787854 '
    + 'remain computer-assisted candidates; RH open; NO QED.',
});

const R = ROUTE_27;

export const ROUTE_27_ASSERTIONS = Object.freeze([
  {
    id: 'r27-hasse-equals-toeplitz-g1',
    holds: () => {
      // Every nonsingular y² = x³ + ax + b over F_p, p ∈ {5, 7, 11, 13}: a_p = p + 1 − #E satisfies Hasse, i.e. T_2 = [[2, S1],[S1, 2]] ≥ 0.
      let curves = 0;
      for (const p of [5, 7, 11, 13]) for (let a = 0; a < p; a++) for (let b = 0; b < p; b++) {
        if ((4 * a ** 3 + 27 * b ** 2) % p === 0) continue; curves++;
        const ap = p + 1 - countE(p, a, b);
        if (!(ap * ap <= 4 * p) || !(4 - (ap * ap) / p >= 0)) return false;
      }
      return curves > 100;
    },
    why: 'Live: for every elliptic curve over F_5, F_7, F_11, F_13, |a_p| ≤ 2√p, equivalently det T_2 = 4 − a_p²/p ≥ 0 (curve-RH ⇔ T_{2g} ≥ 0 at g = 1).',
  },
  {
    id: 'r27-g1-fakes',
    holds: () => R.fakes.g1.every(({ q, c1, c2 }) => {
      const disc = c1 * c1 - 4 * c2; // real distinct inverse roots ⇒ off the circle |α| = √q
      const detT2 = 4 - (c1 * c1) / q; // one negative eigenvalue ⇔ det < 0
      const cp = closedPoints(q, c1, c2, 60);
      return c2 === q && disc > 0 && detT2 < 0 && cp.every((x) => x.integral && x.a >= 0n);
    }),
    why: 'Live: 1 − 5T + 5T² (q = 5) and 1 + 6T + 7T² (q = 7) satisfy the FE (c2 = q), violate RH (real inverse roots, det T_2 < 0: ghost index 1), and have integral, nonnegative closed-point counts for d ≤ 60.',
  },
  {
    id: 'r27-gram-identity',
    holds: () => {
      // q^j + q^k − Γ_j·Γ_k with Γ_j·Γ_k = q^j N_{k−j} equals q^j s_{k−j} (= q^{(j+k)/2} S_{k−j}), on a live-counted curve.
      const p = 7, a = 1, b = 3; const ap = p + 1 - countE(p, a, b); const s = powerSums(-ap, p, 6); const Q = BigInt(p);
      const N = (e) => Q ** BigInt(e) + 1n - s[e];
      for (let j = 0; j <= 3; j++) for (let k = j + 1; k <= 6; k++) if (Q ** BigInt(j) + Q ** BigInt(k) - Q ** BigInt(j) * N(k - j) !== Q ** BigInt(j) * s[k - j]) return false;
      return N(1) === BigInt(countE(p, a, b));
    },
    why: 'Gram identity q^j + q^k − q^j N_{k−j} = q^j s_{k−j} on y² = x³ + x + 3 over F_7 (point counts live; N_e for e ≥ 2 from P(T), i.e. rationality).',
  },
  {
    id: 'r27-lambda-e-census',
    holds: () => {
      let ok = true;
      for (let p = 3; p <= 97; p++) {
        if (!isPrime(p)) continue;
        const sup = lambdaE(Math.floor(2 * Math.sqrt(p)), p); // Deuring: every |a| ≤ 2√p occurs
        if (!(sup < 0 && Math.abs(sup) <= 4 / ((2 * Math.sqrt(p) - 1) * Math.log(p) ** 2))) ok = false;
        if (R.lambdaE.sup[p] !== undefined && Math.abs(sup - R.lambdaE.sup[p]) > 5e-4) ok = false;
      }
      return ok && lambdaE(0, 5) === -Infinity && Math.abs(lambdaE(6, 9)) < 1e-15;
    },
    why: 'sup_{E/F_p} Λ_E = 4 log(⌊2√p⌋/(2√p))/(log p)² is < 0, bounded by 4/((2√p−1)(log p)²) for all p ≤ 97 (−0.172 at 5, −0.0011 at 73, −0.0069 at 97); 0 for a maximal curve (q = 9, a = 6).',
  },
  {
    id: 'r27-d-gt-60-repair',
    holds: () => {
      const rel = (q, e) => { const Rr = q ** e; return 4 * (Rr / q) ** 61 + 61 * (q ** 30.5 + 1 + 4 * Rr ** 30.5) / q ** 61; };
      const r3 = rel(3, R.fakes.maxLogAlphaOverLogQ[3]); const r5 = rel(5, R.fakes.maxLogAlphaOverLogQ[5]);
      return R.fakes.runHypothesisHolds === false && R.fakes.maxLogAlphaOverLogQ[5] > R.fakes.runHypothesis
        && Math.abs(r3 - R.d61RelativeError[3]) < 2e-4 && Math.abs(r5 - R.d61RelativeError[5]) < 2e-3 && r5 < 1 && rel(5, 0.9767) > rel(5, 0.9);
    },
    why: 'Referee repair: with the true max log|α|/log q (0.8926, 0.9767) the d = 61 relative error is 0.0030 / 0.406 < 1, so closed-point counts stay positive for d > 60.',
  },
  {
    id: 'r27-census-and-ghosts',
    holds: () => R.fakes.g2q3 + R.fakes.g2q5 === 215 && R.fakes.gramInertia.length === R.fakes.analysed
      && R.fakes.nDet.filter((n) => n < 4).length === 4 && R.fakes.nDet.every((n) => n <= 4)
      && new Set(R.ghostC.filter((x) => x.g === 2).map((x) => x.C)).size === 2 && R.curves.byGenus[1] + R.curves.byGenus[2] + R.curves.byGenus[3] === R.curves.total,
    why: '17 + 198 = 215 g = 2 fakes; N_det ≤ 2g = 4 always and < 4 for 4 of 6; ghost constant C differs between angle choices at fixed g.',
  },
  {
    id: 'r27-honest-scope',
    holds: () => /Nothing is claimed for ζ/.test(R.verdict) && /PT Lambda <= 0\.2 stands/.test(R.verdict) && /NO QED/.test(R.verdict)
      && /Spec Z × Spec Z/.test(R.qObstructions.O3) && R.status === 'done',
    why: 'Route is done as a map; no claim about ζ; the lift is blocked at O3; no QED.',
  },
]);

export default ROUTE_27;
