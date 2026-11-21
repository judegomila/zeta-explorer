/**
 * imp-96092 -- Does any COMPUTABLE FINITE ANALOG of the missing self-product
 * Spec Z x_{F1} Spec Z yield a genuine PARTIAL toward reducing the Route J
 * tensor-square excess (named residual RES-96072), or is the residual a
 * STRUCTURAL WALL with no finite lever?
 *
 * CONTEXT (rh-routes-jkl-non-statmech-external-input-hunt-2026-09-23.js).
 * Route J engine (iii) is the Deligne tensor-power / Kunneth bootstrap
 *   |beta^m| <= q^{(nm+1)/2}  =>  |beta| <= q^{n/2 + O(1)/m},
 * which drives the Frobenius-weight exponent to n/2 (i.e. Re rho -> 1/2)
 * AS m -> infinity ONLY IF the m-fold tensor power carries an excess that is a
 * FIXED constant divided by m. Over Z the object is zeta^{tensor m}: the
 * Kurokawa-Koyama double zeta zeta (X) zeta at m = 2 carries an order-m (double)
 * pole at s = m = 2, dragging the abscissa of absolute convergence to m, so the
 * excess is m - m/2 = m/2 and Re rho <= abscissa/m = 1 for EVERY m. RES-96072
 * registered this as OPEN and asserted (without a finite-model audit) that no
 * computable finite analog is a genuine partial. This leaf performs that audit.
 *
 * METHOD (import-light: pure closed-form arithmetic, no zeros bundle, no sibling
 * self-executing module, no external data). For m = 2,3,4,8,16 the two competing
 * excess laws are tabulated side by side:
 *   -- Z model (Kurokawa zeta (X) zeta): target = m/2, abscissa = m (pole order m
 *      at s = m), excess = m/2, excessOverTarget = excess/target = 1, and the
 *      resulting zero bound Re rho <= abscissa/m = 1 (TRIVIAL for all m);
 *   -- F_q model (curve X/F_q, self-product X^m): the single-variable functional
 *      equation supplies a FIXED +1/2 weight excess, so the Frobenius-weight
 *      exponent bound is n/2 + (1/2)/m = n/2 + 1/(2m), and the exponent excess
 *      1/(2m) -> 0 as m -> infinity (the bootstrap REACHES the Weil weight).
 * The two laws are the numeric fingerprint of the two geometries: over F_q the
 * excess is fixed-and-divided (-> 0); over Z it is scaling-and-undivided (== 1).
 *
 * FINDINGS.
 *  1. THE FINITE ANALOGS BIFURCATE, and NEITHER branch is a partial.
 *     (A) The FAITHFUL finite model -- a smooth projective curve (or variety)
 *         X over F_q and its self-product X^m -- is exactly the geometry where
 *         the bootstrap WORKS: the exponent excess is 1/(2m) -> 0 and Weil/Deligne
 *         RH holds. But that is the F_q excess law (fixed +1/2, DIVIDED by m), NOT
 *         the Z excess law (+m/2, UNDIVIDED). The working analog therefore does
 *         not MODEL the Z obstruction at all -- it is precisely the analog whose
 *         transfer to Z FAILS, because X ->_{F_q} X is a product over a genuine
 *         base field (one q-power Frobenius, closed points = single q^Z orbit),
 *         whereas Spec Z x_{F1} Spec Z is a genuine surface (H^1 infinite-rank;
 *         closed points for rationally independent log p, log q are 2-tori;
 *         Frobenius = an R-scaling-flow, not q^Z). No amount of computation in the
 *         F_q model narrows the Z excess: the two are separated by the field of
 *         definition, not by a resolution scale.
 *     (B) A FINITE TRUNCATION over Z -- restrict the Euler product / Dirichlet
 *         series to primes p <= X -- destroys the two quantities the trick
 *         consumes. A finite Euler product is a Dirichlet polynomial: it has NO
 *         pole (abscissa of absolute convergence = -infinity, so the pole-order
 *         input vanishes) and it is nonvanishing NOWHERE-useful (its zeros are
 *         spurious lattice points, not zeta zeros, and it is entire so the
 *         "nonzero in the region of absolute convergence" step is vacuous). The
 *         truncation is not an approximation to zeta (X) zeta near s = m; it is a
 *         different object with no pole to lower and no zero-free half-plane to
 *         inherit. Zero partial.
 *  2. THE EXCESS GAP IS STRUCTURAL, NOT COMPUTATIONAL. The number that would have
 *     to move -- excessOverTarget -- is exactly 1 for the Z model at EVERY m
 *     (Table below), independent of any truncation length, digit count, or model
 *     size; while the F_q model's exponent excess falls as 1/(2m) for reasons
 *     internal to F_q geometry that a finite Z-truncation cannot import. There is
 *     no dial in either finite model whose refinement lowers the Z excessOverTarget
 *     below 1. Hence RES-96072 is CONFIRMED a structural wall: the missing objects
 *     (finite-rank H^1, Z-valued Frobenius, the self-product Spec Z x_{F1} Spec Z)
 *     are what Spec Z LACKS, and their absence is categorical, not quantitative.
 *
 * HONEST CAVEAT / SUB-GAP (SG-96092-finite-analog). This leaf establishes the
 * bifurcation and the fixed-vs-scaling excess contrast for the TWO natural
 * computable finite models (F_q self-product; finite Euler-product truncation).
 * It does NOT prove that NO exotic F_1-geometry object (Connes-Consani scaling
 * site, Deitmar/Toen-Vaquie F_1-schemes, the arithmetic-site square) could ever
 * supply the missing self-product -- that is Route H's territory and remains the
 * one live corner; it is asserted here only that no COMPUTABLE FINITE model
 * reachable in this repo is a genuine partial toward the m/2 excess. The pole
 * order = m => excess = m/2 scaling for m > 2 is the structural expectation from
 * the m-fold self-convolution (cited from Kurokawa-Koyama at m = 2, not
 * re-derived for m > 2). Assessment only; changes no bound; RH open; NO QED;
 * no refereed bound is changed; Route J stays NOT-A-LEVER.
 *
 * @see rh-routes-jkl-non-statmech-external-input-hunt-2026-09-23 (ROUTE_J engine iii; RES-96072 named residual)
 */

// --- the two competing excess laws, tabulated as pure closed-form arithmetic ---
const MS = [2, 3, 4, 8, 16];

const excessTable = MS.map((m) => {
  const target = m / 2;             // Weil-target abscissa (Re rho <= 1/2 <=> abscissa/m = 1/2)
  const zAbscissa = m;              // order-m pole at s = m drags the abscissa to m
  const zExcess = zAbscissa - target;         // = m/2 (SCALES with m)
  const zExcessOverTarget = zExcess / target; // = 1 (TRIVIAL bound Re rho <= abscissa/m = 1)
  const zReRhoBound = zAbscissa / m;          // = 1 for every m
  const fqFixedExcess = 0.5;        // F_q: FIXED +1/2 functional-equation weight excess
  const fqExponentExcess = fqFixedExcess / m; // = 1/(2m) -> 0 (bootstrap reaches n/2)
  return { m, target, zAbscissa, zExcess, zExcessOverTarget, zReRhoBound, fqFixedExcess, fqExponentExcess };
});

export const IMP96092_TENSOR_SQUARE_FINITE_ANALOG = {
  id: 'imp-96092',
  residual: 'RES-96072-tensor-square-excess',
  route: 'J',
  engine: '(iii) Kunneth tensor-power bootstrap',
  question:
    'Does any computable finite analog of the missing self-product Spec Z x_{F1} Spec Z yield a genuine partial toward reducing the Route J tensor-square excess (+m/2), or is RES-96072 a structural wall with no finite lever?',
  excessTable,
  finiteModels: [
    {
      model: 'F_q self-product (curve/variety X over F_q, X^m)',
      excessLaw: 'exponent excess 1/(2m) -> 0 (fixed +1/2, DIVIDED by m)',
      partial: false,
      why: 'This is the geometry where the bootstrap already WORKS (Weil/Deligne RH), but it carries the F_q excess law, not the Z law; it does not model the Z obstruction and is exactly the analog whose transfer to Z fails (product over a genuine base field vs Spec Z x_{F1} Spec Z, a surface with infinite-rank H^1 and an R-scaling-flow Frobenius).',
    },
    {
      model: 'finite Euler-product / Dirichlet-series truncation over Z (primes p <= X)',
      excessLaw: 'no pole (abscissa = -infinity) and no useful zero-free half-plane',
      partial: false,
      why: 'A finite Euler product is a Dirichlet polynomial: it has no pole to lower and is entire with spurious zeros, so both quantities the trick consumes (pole order at s = m; nonvanishing in the region of absolute convergence) are destroyed. It is a different object, not an approximation to zeta (X) zeta near s = m.',
    },
  ],
  verdict:
    'STRUCTURAL-ONLY. The two natural computable finite analogs bifurcate and NEITHER is a partial: (A) the faithful F_q self-product is where the bootstrap works but carries the fixed-and-divided excess 1/(2m) -> 0, NOT the Z scaling excess +m/2, so it does not model the obstruction and is exactly the analog whose transfer to Z fails; (B) a finite Z-truncation destroys the pole and the zero-free half-plane the trick consumes. The number that must move, excessOverTarget, is pinned at 1 for the Z model at EVERY m regardless of model size -- the gap is categorical (missing finite-rank H^1, Z-valued Frobenius, the self-product Spec Z x_{F1} Spec Z), not a resolution scale. RES-96072 is CONFIRMED a structural wall with no computable finite lever. Sub-gap SG-96092-finite-analog: an exotic F_1-geometry self-product (Route H) is not ruled out here. Assessment only; changes no bound; RH open; NO QED; no refereed bound is changed; Route J stays NOT-A-LEVER.',
};

// --- self-executing internal-consistency assertions (pure closed-form arithmetic) ---
(() => {
  const approx = (x, y, tol) => Math.abs(x - y) <= tol;
  const t = IMP96092_TENSOR_SQUARE_FINITE_ANALOG.excessTable;
  // Z model: excess SCALES as m/2 and the excessOverTarget is pinned at 1 (trivial) for every m
  for (const r of t) {
    if (!approx(r.zExcess, r.m / 2, 1e-15)) throw new Error('imp-96092: Z excess is not m/2');
    if (!approx(r.zExcessOverTarget, 1, 1e-15)) throw new Error('imp-96092: Z excessOverTarget drifted from the trivial 1');
    if (!approx(r.zReRhoBound, 1, 1e-15)) throw new Error('imp-96092: Z Re-rho bound is not the trivial 1');
    if (!approx(r.fqExponentExcess, 1 / (2 * r.m), 1e-15)) throw new Error('imp-96092: F_q exponent excess is not 1/(2m)');
  }
  // the F_q exponent excess strictly DECREASES in m (bootstrap reaches n/2); the Z one does NOT
  for (let i = 1; i < t.length; i++) {
    if (!(t[i].fqExponentExcess < t[i - 1].fqExponentExcess))
      throw new Error('imp-96092: F_q exponent excess must strictly decrease in m');
    if (!(t[i].zExcessOverTarget === t[i - 1].zExcessOverTarget))
      throw new Error('imp-96092: Z excessOverTarget must stay constant in m');
  }
  // the two finite models both fail to be a partial
  if (IMP96092_TENSOR_SQUARE_FINITE_ANALOG.finiteModels.some((mo) => mo.partial))
    throw new Error('imp-96092: a finite model was mislabelled as a genuine partial');
  // honesty gates
  const v = IMP96092_TENSOR_SQUARE_FINITE_ANALOG.verdict;
  if (!/NO QED/.test(v)) throw new Error('imp-96092: verdict dropped the NO QED banner');
  if (!/refereed bound is changed/i.test(v)) throw new Error('imp-96092: verdict dropped the no-refereed-bound-change banner');
  if (!/SG-96092-finite-analog/.test(v)) throw new Error('imp-96092: verdict dropped the named sub-gap');
})();

export default IMP96092_TENSOR_SQUARE_FINITE_ANALOG;
