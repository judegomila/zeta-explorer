// @module data/imp-2668-section27-renormalization-nogo
//
// imp-2668 (CRITICAL, proof, opus-4-8/subscription) -- attack on THE_REAL_GAP
// named by section27-identity-refutation-2026-06-17 and reduced by imp-2664 to
// the single open identification Theta_V = Theta_a. The ticket asks three things:
//   (i)   does the Section-25 hidden-square factorization K_a = int Psi Psi-bar dnu
//         exist from Phi alone (Conj 25.2 / 25.3)?
//   (ii)  attack the Section-26 measure-domination Conj 26.3 (mu^pass >= nu) that
//         pins the unit-scale comparison;
//   (iii) THE CRUX -- show the renormalization IDENTIFIES the Schur complement
//         I - V V^# (non-homogeneous, with a constant I term) with the de Branges
//         Gram of K_a (degree-2 homogeneous), reconciling the homogeneity mismatch.
// Acceptance: an EXPLICIT operator identity surviving Phi -> c*Phi, NOT a
// restatement. An honest negative (the identification cannot be made) is a valid,
// valuable result.
//
// This module does NOT modify imp-1258 / imp-1265 / imp-2664 / the refutation. It
// is an independent operator-algebra attack; the orchestrator decides downstream
// edits. ("#" denotes the Hilbert-space adjoint, to avoid the JSDoc terminator.)
//
// METHOD: training-time operator theory only -- the sinh addition formula; rank
// of a finite-rank antisymmetric operator; Livshits/de Branges characteristic
// function (rank of the imaginary part = de Branges canonical-system dimension);
// the degree-counting argument of imp-2664 sharpened to the Schur complement.
// No PDF browsing beyond the structured Section-25-27 record (imp-1219).

const PAPER_REF = "research-inputs/twin_ladder_consolidated_v52.pdf Sections 25-27";

// ---------------------------------------------------------------------------
//  NEW EXPLICIT RESULT: the Volterra kernel is a causal rank-2 antisymmetric
//  kernel. This makes the Section-25 "commutator decomposition" concrete for the
//  first time (prior modules ASSERTED a rank-one defect without computing it).
// ---------------------------------------------------------------------------
//   (V_{a,Phi} f)(t) = int_0^t Phi(t) Phi(s) sinh(a(t-s)) f(s) ds   on L^2([0, inf)).
//   sinh(a(t-s)) = sinh(at) cosh(as) - cosh(at) sinh(as)            [addition formula]
//   => kernel k(t,s) = p(t) q(s) - q(t) p(s)  on {s <= t},  with
//        p(t) = Phi(t) sinh(at),   q(t) = Phi(t) cosh(at).
//   The full-square kernel p(t)q(s) - q(t)p(s) is rank-2 antisymmetric; V is its
//   CAUSAL (lower-triangular) truncation. The skew part is computed exactly:
//        V - V^#  =  p (x) q^*  -  q (x) p^*    (a (x) b^* : f |-> a <b, f>),
//   so V - V^# has RANGE span{p, q} = Phi * span{e^{at}, e^{-at}} and rank EXACTLY
//   2 whenever a != 0 and Phi is not identically 0.

const VOLTERRA_DECOMPOSITION = Object.freeze({
  id: "volterra-causal-rank2-antisymmetric-decomposition",
  claim:
    "The Volterra kernel factors via the sinh addition formula into the causal " +
    "truncation of a rank-2 antisymmetric kernel p(t)q(s)-q(t)p(s), with " +
    "p=Phi*sinh(a.), q=Phi*cosh(a.); hence V - V^# = p(x)q^* - q(x)p^* has rank " +
    "exactly 2 (range Phi*span{e^{at},e^{-at}}).",
  explicitAlgebra: Object.freeze([
    "sinh(a(t-s)) = sinh(at)cosh(as) - cosh(at)sinh(as) (standard addition formula).",
    "Multiply by Phi(t)Phi(s): k(t,s) = [Phi(t)sinh(at)][Phi(s)cosh(as)] - " +
      "[Phi(t)cosh(at)][Phi(s)sinh(as)] = p(t)q(s) - q(t)p(s), p=Phi*sinh(a.), q=Phi*cosh(a.).",
    "V uses k on the causal triangle s<=t. The adjoint V^# has kernel " +
      "conj(k(s,t)) = p(s)q(t)-q(s)p(t) on s>=t, and p(s)q(t)-q(s)p(t) = -(p(t)q(s)-q(t)p(s)).",
    "Therefore the kernel of V - V^# equals (p(t)q(s)-q(t)p(s)) on BOTH triangles " +
      "(the minus sign on s>=t cancels the kernel sign), i.e. on the whole square: " +
      "(V - V^#) f = p <q,f> - q <p,f>  =  p(x)q^* - q(x)p^*.",
    "p,q are linearly independent for a != 0 (sinh, cosh independent), so rank(V-V^#)=2 " +
      "with range span{p,q} = Phi*span{e^{at}, e^{-at}}.",
  ]),
  novelty:
    "Prior records (imp-1219 Section-25, imp-2664 THE_GAP) ASSERT a commutator / " +
    "rank-one-defect decomposition but never exhibit it. This is the explicit " +
    "operator-algebra identity: V-V^# = p(x)q^* - q(x)p^*, the same sinh/cosh gauges " +
    "that appear in the A_a (cosine) / B_a (sine) de Branges gauge integrals.",
  verdict: "explicit-and-verified",
});

// ---------------------------------------------------------------------------
//  (i) HIDDEN-SQUARE FACTORIZATION (Conj 25.2 / 25.3) + the rank reconciliation
// ---------------------------------------------------------------------------

const HIDDEN_SQUARE_ASSESSMENT = Object.freeze({
  id: "hidden-square-existence-equals-K_a-PSD-not-independent",
  question:
    "Does the Section-25 hidden-square factorization K_a = int Psi Psi-bar dnu exist " +
    "from Phi alone, and does the rank-2 skew part contradict the SCALAR de Branges phase?",
  findings: Object.freeze([
    "EXISTENCE is not independent leverage: a Hermitian kernel admits a square " +
      "factorization K_a = int Psi Psi-bar dnu (Aronszajn / Kolmogorov decomposition) " +
      "IF AND ONLY IF K_a >= 0. So Conj 25.2/25.3 is logically EQUIVALENT to the very " +
      "conclusion K_a >= 0 it is invoked to supply -- it cannot be a cheaper input. " +
      "(Confirms imp-2664: downstream of the unproven hypothesis, not a lever.)",
    "RANK RECONCILIATION (the substantive new point): rank(V-V^#)=2 over the REALS, " +
      "but the de Branges phase Theta_a = E_a^# / E_a is SCALAR. These are consistent, " +
      "NOT contradictory: E_a = A_a - i B_a packages the TWO real gauges (A_a cosine, " +
      "B_a sine) into ONE complex scalar, exactly as a scalar de Branges space is the " +
      "model of a 2x2 real canonical (Hamiltonian) system. The real-rank-2 imaginary " +
      "part is the canonical-system dimension; complexification halves it to one channel.",
    "So Section-25's 'rank-one defect' language is correct ONLY in the complexified " +
      "(one-complex-channel) sense; as a REAL statement the defect is rank 2. The " +
      "sinh/cosh gauges of p,q match the sinh/cosh in the A_a/B_a gauge integrals -- " +
      "structural corroboration that the correct identification is V <-> H(E_a), but " +
      "NOT a proof of the transform identity.",
  ]),
  verdict: "existence-equivalent-to-conclusion; rank-2-real-consistent-with-scalar-E_a",
});

// ---------------------------------------------------------------------------
//  (ii) SECTION-26 MEASURE DOMINATION (Conj 26.3) -- the scale-pinning step
// ---------------------------------------------------------------------------

const MEASURE_DOMINATION_ASSESSMENT = Object.freeze({
  id: "conj-26-3-encodes-the-scale-cannot-be-phi-uniform",
  claim:
    "Conj 26.3 (mu^pass >= nu) is the inequality the program uses to pin the unit " +
    "scale c*. It CANNOT be a Phi-uniform theorem; it secretly encodes the " +
    "normalization rather than deriving it.",
  explicitAlgebra: Object.freeze([
    "mu^pass is tied to the passivity/contractivity of V (the ||V|| <= 1 side), which " +
      "is scale-BOUNDED: under Phi -> c*Phi, ||V|| -> c^2 ||V|| (V is quadratic in Phi).",
    "nu is tied to the de Branges measure of K_a, whose inertia is scale-INVARIANT " +
      "(K_a -> c^2 K_a leaves K_a >= 0 unchanged): a scale-closed cone.",
    "A domination mu^pass >= nu between a scale-bounded quantity and a scale-invariant " +
      "one can hold on at most a scale-bounded set of Phi. So Conj 26.3 holds (if at " +
      "all) only AFTER fixing c <= c_crit -- i.e. it ASSUMES the normalization c* it is " +
      "meant to produce. It is not a Phi-free theorem.",
  ]),
  verdict: "conj-26-3-not-phi-uniform-pins-scale-by-assumption",
});

// ---------------------------------------------------------------------------
//  (iii) THE CRUX -- rigorous degree no-go for the AS-POSED identification, and
//        the degree-consistent REFRAME that dissolves the homogeneity mismatch.
// ---------------------------------------------------------------------------

const RENORMALIZATION_NOGO = Object.freeze({
  id: "schur-complement-renormalization-nogo-and-degree-consistent-reframe",
  asPosedClaim:
    "There is NO scale-covariant (homogeneous) scalar renormalization lambda(Phi) " +
    "such that lambda(Phi) * K_a[Phi] = (I - V^# V)[Phi] for all Phi on a scale orbit " +
    "{c*Phi_0 : c > 0}. The AS-POSED crux (identify the Schur complement with the K_a " +
    "Gram) is therefore impossible as an operator identity surviving Phi -> c*Phi.",
  nogoProof: Object.freeze([
    "DEGREES. K_a is degree-2 homogeneous (A_a,B_a linear in Phi => bilinear numerator " +
      "=> K_a -> c^2 K_a). V is quadratic in Phi (kernel Phi(t)Phi(s)...) so V^# V is " +
      "degree-4; I is degree-0. Hence I - V^# V lives in degrees {0, 4} -- a TWO-degree " +
      "object -- while K_a is a SINGLE-degree (degree-2) object.",
    "Homogeneous ansatz: lambda(c*Phi_0) = kappa * c^d (the only scale-covariant scalars). " +
      "Then LHS = kappa c^{d+2} K_a[Phi_0] is a SINGLE monomial in c times a fixed nonzero " +
      "operator; RHS = I*c^0 - (V^# V)[Phi_0]*c^4 is a sum of two linearly independent " +
      "operator monomials (I non-compact, V^# V Hilbert-Schmidt => independent).",
    "Match coefficients of distinct powers of c for all c>0: if d+2 not in {0,4} the LHS " +
      "must vanish (X=0, contradiction); if d+2=0 then kappa X = I AND V^# V[Phi_0]=0 (=> " +
      "V=0, excluded); if d+2=4 then kappa X = -(V^# V)[Phi_0] AND I = 0 (absurd). No d works.",
    "A NON-homogeneous lambda is not scale-covariant: it would be a per-Phi rescaling, " +
      "i.e. the tautological restatement the acceptance criterion explicitly forbids.",
  ]),
  reframe:
    "The mismatch is a CATEGORY ERROR in the AS-POSED target, not a dead end. I - V^# V " +
    "is the WRONG object: the block-positivity/Schur framing (LINK A) injects the " +
    "spurious constant I (degree 0) and the degree-4 V^# V. The DEGREE-AND-RANK-" +
    "CONSISTENT object to identify with the (degree-2, antisymmetric-Wronskian) K_a is " +
    "the IMAGINARY PART Im V = (1/2i)(V - V^#) = (1/2i)(p(x)q^* - q(x)p^*): it is " +
    "degree-2 homogeneous (matches K_a's degree) AND rank-2 antisymmetric (matches the " +
    "corrected antisymmetric de Branges Wronskian A(z)B(w)-B(z)A(w)). The natural " +
    "(Livshits/de Branges) identification is K_a <-> Im V, NOT K_a <-> I - V^# V.",
  consequence:
    "The collapse should be re-routed through the degree-consistent Livshits imaginary-" +
    "part identification rather than the Schur block-positivity, which is what creates " +
    "the (genuine, rigorous) homogeneity obstruction. This removes 'dead by homogeneity' " +
    "as the verdict and replaces it with a degree-consistent OPEN problem: whether the " +
    "Fourier/Cayley transform of the rank-2 gauge data (p,q) reproduces (A_a,B_a) at the " +
    "Riemann normalization. That transform identity, with its normalization constant, " +
    "is exactly THE_REAL_GAP / imp-2664 THE_GAP and remains OPEN.",
  verdict: "as-posed-impossible-by-degree; degree-consistent-reframe-to-Im-V; gap-remains-open",
});

// ---------------------------------------------------------------------------
//  Overall verdict -- honest partial, no false QED.
// ---------------------------------------------------------------------------

const OVERALL = Object.freeze({
  finalVerdict:
    "crux-as-posed-refuted-by-degree-counting; reframed-to-degree-consistent-Im-V-identification; THE_REAL_GAP-remains-open",
  summary: Object.freeze([
    "NEW EXPLICIT: V-V^# = p(x)q^* - q(x)p^*, p=Phi*sinh(a.), q=Phi*cosh(a.) -- the " +
      "Section-25 commutator decomposition, made concrete (rank 2, range Phi*span{e^{at},e^{-at}}).",
    "(i) Hidden-square existence (Conj 25.2/25.3) <=> K_a >= 0 (Aronszajn): equivalent " +
      "to the conclusion, NOT independent leverage. Rank-2-real defect is consistent " +
      "with the scalar de Branges phase via the E_a = A_a - i B_a complex packaging.",
    "(ii) Conj 26.3 (mu^pass >= nu) cannot be Phi-uniform (scale-bounded vs scale-" +
      "invariant); it pins the scale by ASSUMPTION, it does not derive it.",
    "(iii) CRUX as posed (identify Schur complement I - V^# V with K_a Gram) is " +
      "IMPOSSIBLE by a rigorous degree-counting no-go (single-degree-2 K_a vs two-degree " +
      "{0,4} I - V^# V; no homogeneous renormalization reconciles them). BUT this is a " +
      "category error: the degree-2, rank-2 object Im V matches K_a in BOTH degree and " +
      "antisymmetry. Reframe the identification to K_a <-> Im V.",
    "Net: the homogeneity mismatch is dissolved (wrong object identified), the route is " +
      "NOT dead but re-based onto a degree-consistent OPEN transform identity. No " +
      "verified Section-27 identity; collapse stays CONDITIONAL.",
  ]),
  honestPartialClosure: true,
  collapseConfirmed: false,
  cruxAsPosedImpossible: true,
  gapReframedNotClosed: true,
  sotaUnchanged:
    "Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA; this does not move it.",
});

const HONEST_SCOPE = Object.freeze([
  "Training-time operator theory only (sinh addition formula; finite-rank antisymmetric " +
    "operators; Livshits/de Branges characteristic-function = canonical-system dimension; " +
    "Aronszajn factorization; the imp-2664 degree-counting argument). Citations recalled, " +
    "not freshly verified against texts.",
  "The Volterra decomposition V-V^# = p(x)q^* - q(x)p^* and the degree no-go for the " +
    "AS-POSED Schur-complement identification are rigorous first-principles derivations.",
  "The REFRAME (K_a <-> Im V is the degree-and-rank-consistent identification) is a " +
    "structural claim that says WHERE the genuine content sits; it does NOT prove the " +
    "transform identity (p,q) -> (A_a,B_a) at the Riemann normalization. That is open.",
  "THE_REAL_GAP / imp-2664 THE_GAP is NOT closed here. The reframe shows it is " +
    "degree-consistent (so not 'dead by homogeneity'), but the normalization constant " +
    "(Conj 26.3) and the transform identity remain unproven.",
  "Maximal skepticism: the module went looking to either build or kill the as-posed " +
    "identification; it KILLED the as-posed Schur-complement form rigorously and " +
    "RELOCATED the surviving content to a degree-consistent open problem. No false QED.",
]);

const CROSS_REFERENCES = Object.freeze([
  Object.freeze({ ticket: "imp-2664", role: "Reduced LINK B to one open identification Theta_V=Theta_a; named the rank-one-defect step unverified.", path: "src/data/imp-2664-section27-identity-rederivation.js" }),
  Object.freeze({ ticket: "section27-identity-refutation-2026-06-17", role: "Refutation + THE_REAL_GAP this module attacks; antisymmetric-Wronskian sign correction matches Im V here.", path: "src/data/section27-identity-refutation-2026-06-17.js" }),
  Object.freeze({ ticket: "imp-1258", role: "Parent two-way collapse (LINK B steps 3/4), now CONDITIONAL.", path: "src/data/imp-1258-volterra-cdb-bridge.js" }),
  Object.freeze({ ticket: "imp-1219", role: "Section-25-27 structured record (commutator decomposition, A_a/B_a gauges).", path: "src/data/hidden-square-program-section.js" }),
  Object.freeze({ ticket: "strategic-reframe-pcc-free-volterra-2026-06-17", role: "PCC-free reframe naming GAP-1 (this identity).", path: "src/data/strategic-reframe-pcc-free-volterra-2026-06-17.js" }),
]);

export const IMP_2668_SECTION27_RENORMALIZATION_NOGO = Object.freeze({
  id: "imp-2668-section27-renormalization-nogo",
  ticket: "imp-2668",
  auditDate: "2026-06-17",
  auditedByModel: "opus-4-8",
  channel: "subscription",
  paperSourcePath: PAPER_REF,
  target: "THE_REAL_GAP: identify the Schur complement I - V^# V with the de Branges Gram of K_a",
  volterraDecomposition: VOLTERRA_DECOMPOSITION,
  hiddenSquareAssessment: HIDDEN_SQUARE_ASSESSMENT,
  measureDominationAssessment: MEASURE_DOMINATION_ASSESSMENT,
  renormalizationNoGo: RENORMALIZATION_NOGO,
  overall: OVERALL,
  honestScope: HONEST_SCOPE,
  crossReferences: CROSS_REFERENCES,
});

export default IMP_2668_SECTION27_RENORMALIZATION_NOGO;

// ---------------------------------------------------------------------------
//  Tripwires
// ---------------------------------------------------------------------------

export const IMP_2668_SECTION27_RENORMALIZATION_NOGO_ASSERTIONS = [
  {
    id: "imp2668-volterra-decomposition-explicit-rank2",
    why:
      "The new explicit result: the Volterra kernel factors via the sinh addition " +
      "formula and V-V^# = p(x)q^* - q(x)p^* is rank 2 with range Phi*span{e^{at},e^{-at}}.",
    holds: () => {
      const t = JSON.stringify(VOLTERRA_DECOMPOSITION);
      return (
        /addition formula/i.test(t) &&
        /rank/i.test(t) &&
        /e\^\{at\}, e\^\{-at\}/.test(t) &&
        VOLTERRA_DECOMPOSITION.verdict === "explicit-and-verified"
      );
    },
  },
  {
    id: "imp2668-hidden-square-equivalent-to-conclusion",
    why:
      "(i) Conj 25.2/25.3 existence is Aronszajn-equivalent to K_a >= 0 -- the conclusion " +
      "itself, not an independent input; rank-2-real is consistent with scalar E_a.",
    holds: () => {
      const t = JSON.stringify(HIDDEN_SQUARE_ASSESSMENT);
      return (
        /Aronszajn/i.test(t) &&
        /IF AND ONLY IF K_a >= 0/i.test(t) &&
        /complex/i.test(t) &&
        /existence-equivalent-to-conclusion/.test(HIDDEN_SQUARE_ASSESSMENT.verdict)
      );
    },
  },
  {
    id: "imp2668-conj-26-3-not-phi-uniform",
    why:
      "(ii) Conj 26.3 dominates a scale-bounded quantity by a scale-invariant one, so it " +
      "cannot be Phi-uniform; it pins the scale by assumption.",
    holds: () => {
      const t = JSON.stringify(MEASURE_DOMINATION_ASSESSMENT);
      return (
        /scale-BOUNDED/i.test(t) &&
        /scale-INVARIANT/i.test(t) &&
        MEASURE_DOMINATION_ASSESSMENT.verdict === "conj-26-3-not-phi-uniform-pins-scale-by-assumption"
      );
    },
  },
  {
    id: "imp2668-crux-as-posed-impossible-by-degree",
    why:
      "(iii) The crux as posed (identify I - V^# V with K_a) is impossible: a single-" +
      "degree-2 K_a cannot equal a two-degree {0,4} object under any homogeneous " +
      "renormalization (rigorous degree-counting no-go).",
    holds: () => {
      const t = JSON.stringify(RENORMALIZATION_NOGO);
      return (
        /degrees \{0, 4\}|degrees \{0,4\}|\{0, 4\}/i.test(t) &&
        /No d works|no homogeneous/i.test(t) &&
        /impossible/i.test(RENORMALIZATION_NOGO.verdict)
      );
    },
  },
  {
    id: "imp2668-degree-consistent-reframe-to-Im-V",
    why:
      "The productive reframe: the degree-2, rank-2, antisymmetric Im V (not the Schur " +
      "complement) is the degree-and-rank-consistent object to identify with K_a.",
    holds: () => {
      const t = JSON.stringify(RENORMALIZATION_NOGO);
      return (
        /Im V/.test(t) &&
        /category error/i.test(t) &&
        /K_a <-> Im V/.test(t) &&
        /reframe/i.test(RENORMALIZATION_NOGO.verdict)
      );
    },
  },
  {
    id: "imp2668-overall-honest-partial-not-confirmed-collapse",
    why:
      "Honest framing: crux-as-posed impossible, gap reframed not closed, collapse NOT " +
      "confirmed, SOTA unchanged.",
    holds: () =>
      OVERALL.honestPartialClosure === true &&
      OVERALL.collapseConfirmed === false &&
      OVERALL.cruxAsPosedImpossible === true &&
      OVERALL.gapReframedNotClosed === true &&
      /Platt-Trudgian/i.test(OVERALL.sotaUnchanged) &&
      OVERALL.summary.length >= 5,
  },
  {
    id: "imp2668-honest-scope-flags-training-time-and-open-gap",
    why:
      "Honest scope must disclose training-time-only methodology and that the transform " +
      "identity / THE_REAL_GAP is NOT closed here.",
    holds: () => {
      const s = IMP_2668_SECTION27_RENORMALIZATION_NOGO.honestScope.join(" | ");
      return /training[- ]time/i.test(s) && /NOT closed here/i.test(s) && /transform identity/i.test(s);
    },
  },
  {
    id: "imp2668-cross-references-name-prior-artifacts",
    why:
      "Audit trail: cross-references must name imp-2664 (the parent reduction), the " +
      "refutation (THE_REAL_GAP), and imp-1258 (parent collapse).",
    holds: () => {
      const ids = IMP_2668_SECTION27_RENORMALIZATION_NOGO.crossReferences.map((c) => c.ticket);
      return (
        ids.some((t) => /imp-2664/.test(t)) &&
        ids.some((t) => /refutation/.test(t)) &&
        ids.some((t) => /imp-1258/.test(t))
      );
    },
  },
];

for (const a of IMP_2668_SECTION27_RENORMALIZATION_NOGO_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-2668-section27-renormalization-nogo assertion failed: ${a.id}`);
  }
}
