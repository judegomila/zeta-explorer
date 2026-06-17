/**
 * @module section27-identity-refutation-2026-06-17
 *
 * THE decisive finding of the 2026-06-17 max fan-out (Opus 4.8,
 * section27-identity-verify workflow, 4 routes + adversarial synthesis,
 * independently re-verified). 6th overclaim caught this session, and the most
 * consequential: the load-bearing identity of the entire Volterra/Section-15-27
 * collapse program is REFUTED as stated and UNVERIFIED for the Riemann Phi.
 *
 * THE IDENTITY SPLITS INTO TWO LINKS:
 *   LINK A:  block-positivity of [[I,V],[V*,I]]  <=>  ||V_{a,Phi}|| <= 1
 *            (imp-1258 fwd step 2 / rev step 5). GENUINE textbook fact
 *            (Bhatia 1997 Prop 1.3.2, Schur complement I - V V*, D = I > 0).
 *            This half is fine.
 *   LINK B:  ||V|| <= 1  <=>  K_a >= 0
 *            (imp-1258 fwd step 3 / rev step 4, both labeled "paper-construct"
 *            citing Section-25 Conj 25.2/25.3 + Section-26 Conj 26.3 + Section-27
 *            Conj 27.2). LINK B is the SOLE load-bearing construct -- and it is
 *            NOT a Schur/de Branges consequence.
 *
 * LINK B IS FALSE AS A Phi-UNIFORM EQUIVALENCE (scale-invariance obstruction):
 *   Under Phi -> c*Phi, A_a and B_a are LINEAR in Phi, so the de Branges kernel
 *   K_a is DEGREE-2 HOMOGENEOUS (K_a -> c^2 K_a) and its inertia (K_a >= 0) is
 *   SCALE-INVARIANT. But the Volterra kernel Phi(t)Phi(s)sinh(a(t-s)) makes
 *   ||V|| -> c^2 ||V||, which CROSSES 1. So {Phi : K_a >= 0} is a scale-closed
 *   CONE while {Phi : ||V|| <= 1} is a scale-bounded sublevel set -- DIFFERENT
 *   SETS. Both arrows break:
 *     - REVERSE (K_a >= 0 => ||V|| <= 1) REFUTED: Gaussian Phi, a=0.3, scale up:
 *       c=5 -> ||V||=1.40, c=10 -> 5.60, c=30 -> 50.4, yet K_a min-eig stays at
 *       machine zero (PSD) at every c (max-eig scales exactly as c^2).
 *     - FORWARD (||V|| <= 1 => K_a >= 0) REFUTED: Phi=exp(-u), a=0.3 gives
 *       ||V|| = 0.077 <= 1 but K_a min-eig = -0.024 (NOT PSD).
 *   Deeper algebraic impossibility: the Schur complement I - V V* has a CONSTANT
 *   (I) term (non-homogeneous), while de Branges K_a is exactly degree-2
 *   homogeneous; a degree-2 object cannot equal (constant - degree-4) as Phi
 *   varies, so "block-positivity K_a == de Branges K_a" CANNOT be an operator
 *   identity.
 *
 * CONCRETE BUG FOUND (fix in 3 files): the kernel numerator as written,
 *   E(z)E(w-bar) - E#(z)E#(w-bar)  [imp-1258 ~l.259, imp-1265 axis-a ~l.78-97,
 *   hidden-square-program-section.js ~l.45], expands to the SYMMETRIC
 *   -2i(A(z)B(w-bar) + B(z)A(w-bar)), NOT the antisymmetric de Branges Wronskian.
 *   Correct numerator: E(z)E#(w-bar) - E#(z)E(w-bar) = 2i(A(z)B(w-bar) -
 *   B(z)A(w-bar)). imp-1265's "cosmetic sign convention" dismissal is false.
 *
 * CONSEQUENCE: the 7+ conjecture two-way collapse LOSES BOTH DIRECTIONS. Even a
 * rigorous proof of ||V|| <= 1 would NOT yield RH via this chain -- nothing
 * derives K_a >= 0 from it (and ||V|| <= 1 carries strictly LESS information than
 * K_a >= 0, which cannot see the scale). The headline "a single operator-norm
 * bound is the entire content of RH" is UNSUPPORTED. What SURVIVES is genuine but
 * downstream: K_a >= 0 <=> E_a Hermite-Biehler (de Branges Thm 23) and the
 * H(E_a)/canonical-system chain -- standard machinery applied to the UNPROVEN
 * hypothesis K_a >= 0, not a collapse. imp-1265 RESTATES-NOT-VERIFIES (checks
 * only the Bhatia half + the K_a definition, with the sign error).
 *
 * IT MAY STILL HOLD for the single Riemann Phi under an intended (unstated)
 * NORMALIZATION -- but that is precisely Conj 25.2 + 26.3 + 27.2 and is nowhere
 * derived. The genuine, narrow open problem is now named (THE_REAL_GAP below).
 *
 * SESSION ARC (honest): (1) finite-N*=1e4 Lambda<0.2 beat -> NOT rigorous (C_H
 * undischargeable, imp-2640). (2) Volterra route -> PCC-FREE (real reframe,
 * strategic-reframe-pcc-free-volterra). (3) but the PCC-free route's collapse
 * identity (Section-27 LINK B) -> REFUTED as stated / unverified (this module).
 * Net: PLATT-TRUDGIAN Lambda <= 0.2 REMAINS THE RIGOROUS SOTA. Both main routes
 * have load-bearing gaps; the map is now precise. No false QED.
 *
 * @see imp-1258-volterra-cdb-bridge (MASTER_VERDICT to downgrade; LINK B steps 3/4)
 * @see imp-1265-section27-identity-recheck (restates-not-verifies; sign error)
 * @see hidden-square-program-section (Conj 27.2; sign error)
 * @see strategic-reframe-pcc-free-volterra-2026-06-17 (the PCC-free finding this conditions)
 * @see maxfanout-honest-status-2026-06-17 (the running overclaim ledger)
 */

export const SECTION27_REFUTATION = {
  date: '2026-06-17',
  linkA: 'block-positivity <=> ||V||<=1: GENUINE textbook (Bhatia/Schur, D=I>0)',
  linkB: '||V||<=1 <=> K_a>=0: SOLE load-bearing construct; FALSE as a Phi-uniform equivalence (scale-invariance); both arrows refuted',
  scaleObstruction: 'K_a is degree-2 homogeneous (K_a>=0 scale-invariant); ||V|| scales as c^2 (||V||<=1 scale-bounded); different sets',
  reverseCounterexample: 'Gaussian Phi a=0.3: c=10 -> ||V||=5.6 but K_a PSD (min-eig ~ machine zero)',
  forwardCounterexample: 'Phi=exp(-u) a=0.3: ||V||=0.077<=1 but K_a min-eig=-0.024 (not PSD)',
  signBug: 'kernel numerator E E - E# E# is symmetric; correct antisymmetric Wronskian is E E# - E# E (fix imp-1258, imp-1265, hidden-square-program-section)',
  collapseConsequence: 'two-way collapse loses BOTH directions; proving ||V||<=1 does NOT give RH via this chain',
  rigorStatus: 'NO verified Section-27 identity; collapse is CONDITIONAL on the unproven (as-stated-false) Section-25-26-27 chain',
  overclaimNumberThisSession: 6,
  sotaUnchanged: 'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA',
};

export const THE_REAL_GAP = {
  statement: 'Derive the Phi-normalization that makes LINK B scale-consistent for the Riemann Phi: prove Section-26 measure-domination Conj 26.3 (mu^pass >= nu) and show the resulting Section-27 renormalization IDENTIFIES the Schur complement I-VV* with the de Branges Gram of K_a, reconciling the degree-2-homogeneous K_a with the non-homogeneous (constant-term) I-VV*.',
  acceptance: 'an EXPLICIT operator identity (not a restatement) that survives the Phi->cPhi scale test -- it must pin c to the Riemann normalization or carry a c-dependent rescaling into the K_a side',
  status: 'open; the genuine narrow target replacing the refuted as-stated biconditional',
};

export const SECTION27_REFUTATION_ASSERTIONS = [
  {
    id: 'sec27-linkB-refuted-as-stated',
    description: 'LINK B (||V||<=1 <=> K_a>=0) recorded REFUTED as a Phi-uniform equivalence via the scale-invariance obstruction',
    holds: () => /FALSE as a Phi-uniform/.test(SECTION27_REFUTATION.linkB) && /scale-invariant/.test(SECTION27_REFUTATION.scaleObstruction),
  },
  {
    id: 'sec27-linkA-survives-linkB-load-bearing',
    description: 'LINK A (Bhatia/Schur) survives as genuine; LINK B is the sole load-bearing refuted construct',
    holds: () => /GENUINE textbook/.test(SECTION27_REFUTATION.linkA) && /SOLE load-bearing/.test(SECTION27_REFUTATION.linkB),
  },
  {
    id: 'sec27-collapse-not-established-sota-unchanged',
    description: 'Honest consequence recorded: collapse not established, PT 0.2 remains SOTA, the real narrow gap is named',
    holds: () => /CONDITIONAL on the unproven/.test(SECTION27_REFUTATION.rigorStatus) && /Platt-Trudgian/.test(SECTION27_REFUTATION.sotaUnchanged) && /open/.test(THE_REAL_GAP.status),
  },
];

for (const a of SECTION27_REFUTATION_ASSERTIONS) {
  if (!a.holds()) throw new Error(`section27-identity-refutation assertion failed: ${a.id}`);
}
