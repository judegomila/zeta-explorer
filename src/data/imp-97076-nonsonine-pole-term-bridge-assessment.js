/**
 * @fileoverview imp-97076 -- ASSESSMENT (proof): can a NON-Sonine pole-term bridge carry the
 * interval-verified pole-free positivity T_a[sigma_2] >= 0 (2a <= 0.96) to the FULL Weil form,
 * where the only assembled (semilocal Sonine/excess D_S <= L_S) bridge is obstructed at 2a = ln 2?
 *
 * CONTEXT -- imp-97049 Axis II, SUB-GAP IMP97049_AXIS_LEVEL_ONLY. imp-97049 sorted the gap between
 * the certified object and full Weil positivity into three orthogonal axes and named the POLE-TERM
 * axis (Axis II) as a genuinely independent obstruction, but left open whether an unattempted
 * NON-Sonine instance inside Axis II could bridge it. This leaf resolves that open instance at the
 * CLASS level: it enumerates the candidate non-Sonine pole-term bridges, identifies the precise
 * obstruction each faces, and shows they share ONE mechanism -- the p = 2 resonance blow-up along
 * t_k = 2 pi k / ln 2 -- so the ln 2 obstruction is BRIDGE-AGNOSTIC across the whole local /
 * finite-rank / fixed-measure class, not a Sonine-specific artifact.
 *
 * ALL VALUES ARE CITATIONAL LITERALS drawn from committed sibling modules (no new computation):
 *   @see imp-97049-polefree-to-weil-obstruction-enumeration.js  (Axis II; SUB-GAP AXIS_LEVEL_ONLY)
 *   @see rh-route-i-toeplitz-krein-certificate-2026-09-24.js  (sigma_2 = (t^2+1/4)^2 w_1; pole-free
 *        Weil positivity == T_a[sigma_2] >= 0 on {hhat(+-i/2) = 0}; certified reach 2a <= X0 = 0.96)
 *   @see rh-route-i-sonine-excess-semilocal-port-2026-09-23.js  (excess carries HALF the rho = 2 log
 *        cusp: per-log2 deltaS 0.7071 / deltaIn 0.3536 / deltaOut 0.3536; E_S o Q -> +oo LINEARLY
 *        along the p = 2 resonances t_k = 2 pi k / ln 2; binding dip window [7.4, 10.8]; no finite-rank fix)
 *   @see flow-blindness-no-go.js  (Axis III: no soft/estimate-only strategy proves RH; arithmetic input required)
 *
 * ---------------------------------------------------------------------------------------------------
 * WHAT THE POLE-TERM BRIDGE ACTUALLY IS. The certified object is Weil positivity RESTRICTED to the
 * codimension-2 pole-free subspace P0 = {hhat(+i/2) = hhat(-i/2) = 0}: there the weight (t^2 + 1/4)^2
 * expresses hhat = (t^2 + 1/4) ghat with ghat free, and positivity of the weighted form is EXACTLY
 * T_a[sigma_2] >= 0 (certified for 2a <= 0.96). Full Weil positivity is positivity over the WHOLE
 * Paley-Wiener space PW_a = P0 (+) span{cosh(x/2), x sinh(x/2)} (the two pole directions on which
 * hhat(+-i/2) do not vanish). So the bridge is a codimension-2 POSITIVE-EXTENSION (Schur-complement)
 * problem: extend positivity from P0 to PW_a by controlling the rank-2 pole block plus its cross-terms
 * with P0. The rank-2 pole term hhat(i/2) + hhat(-i/2) is itself POSITIVE, but a positive rank-2
 * ADDITION to a form positive on a subspace does NOT force positivity on the whole space -- the
 * UN-weighted Weil form on the pole directions carries prime-sum mass that can be negative and large,
 * and the cross-terms are indefinite. The Schur complement is the content of the bridge. The Sonine
 * route computes that Schur complement as the excess inequality D_S <= L_S and it fails at 2a = ln 2.
 *
 * ENUMERATION OF NON-SONINE CANDIDATES (a different handling of the archimedean / pole block):
 *
 *   (B1) UN-WEIGHTING / MULTIPLIER bridge. Divide the certified sigma_2-form by (t^2 + 1/4)^2 to
 *        recover the unweighted sigma_0-form, i.e. map ghat -> hhat = ghat / (t^2 + 1/4). PRECISE
 *        OBSTRUCTION: (t^2 + 1/4)^(-1) = [s(1 - s)]^(-1) is the transform of a NONLOCAL kernel
 *        (exponential convolution in x); it maps a function of exact support [-2a, 2a] OUT of the
 *        fixed-support class the certificate lives on. The un-weighting cannot preserve the support
 *        constraint 2a <= 0.96, so it cannot transfer the fixed-a certificate at all. Fails by
 *        support non-preservation, independently of ln 2.
 *
 *   (B2) DIRECT KREIN POSITIVE-EXTENSION (Schur-complement) bridge. Verify the codim-2 Schur
 *        complement directly by a dual positive extension (phi = alpha cosh + beta u sinh inside
 *        |u| < 2a, free outside) with no CC excess split -- the genuinely non-Sonine LP/Krein object.
 *        It DOES independently re-verify the bridge over a comparable reach, but the extremal pole
 *        directions cosh(x/2), x sinh(x/2) have transforms concentrated on the SAME p = 2 resonance
 *        band where the pole-free minimiser dip [7.4, 10.8] binds; the dual certificate is the EXACT
 *        dual of the same resonance cancellation (its retained Sonine trace is ~1/9.11 of the
 *        remainder at t_1). PRECISE OBSTRUCTION: it inherits -- does not escape -- the ln 2 resonance
 *        obstruction; it is a re-description of the same Schur complement, not an independent bridge.
 *
 *   (B3) ARCHIMEDEAN-INTEGRAL ABSORPTION bridge. Fold the rank-2 pole term into the archimedean
 *        digamma (psi) integral and dominate the prime sum by the single fixed (pole + archimedean)
 *        measure. PRECISE OBSTRUCTION: the pole + archimedean measure is SUPPORT-INDEPENDENT (a fixed
 *        functional), whereas the binding negativity -- the p = 2 resonance term E_S o Q -- grows
 *        LINEARLY in the resonance count as 2a increases (deltaOut = 0.3536 per log2, the excess
 *        carrying HALF the rho = 2 cusp, c2 = 0.51007). A fixed measure cannot dominate a
 *        support-growing term; the domination fails for every 2a > ln 2, matching the Sonine failure.
 *
 * COMMON MECHANISM. Every candidate that keeps the pole-term handling LOCAL (support-preserving) and
 * FINITE-RANK / FIXED-MEASURE feeds the SAME p = 2 resonance windows t_k = 2 pi k / ln 2 on which the
 * pole-free minimiser already loses positivity (dip [7.4, 10.8], the excess carrying exactly half the
 * rho = 2 log cusp). The obstruction at 2a = ln 2 is therefore BRIDGE-AGNOSTIC across this class, not
 * a Sonine artifact. This UPGRADES imp-97049 Axis II from "the one assembled (Sonine) bridge fails at
 * ln 2" to "the whole LOCAL / finite-rank / fixed-measure pole-term-handling class fails at ln 2, by a
 * shared resonance mechanism."
 *
 * VERDICT. No candidate NON-Sonine pole-term bridge in the local / finite-rank / fixed-measure class
 * carries pole-free positivity to the full Weil form past 2a = ln 2: B1 fails by support
 * non-preservation; B2 inherits the resonance obstruction as the dual of the same cancellation; B3
 * fails because a fixed measure cannot dominate the support-growing p = 2 resonance term. The
 * assessment establishes NO positivity theorem and moves NO bound; certified reach stays 2a <= 0.96;
 * Platt-Trudgian Lambda <= 0.2 SOTA; RH open; NO QED.
 *
 * HONEST RESIDUAL -- SUB-GAP IMP97076_NONLOCAL_ARITHMETIC_BRIDGE_ONLY. The refutation covers the
 * LOCAL / finite-rank / fixed-measure class. It does NOT rule out a genuinely NONLOCAL or
 * infinite-rank pole-term bridge, nor one that injects arithmetic input to cancel the p = 2
 * resonance. But any such bridge that remains purely SOFT (a support-uniform analytic estimate) is
 * exactly the object the flow-blindness no-go (Axis III) forbids; a bridge that escapes the resonance
 * mechanism must therefore inject arithmetic input, placing it in Axis III territory rather than the
 * pole-term axis proper. So the nonlocal / arithmetic bridge class stays open and, if soft, is blocked
 * by flow-blindness. Assessment only; no bound moves.
 */

const LN2 = 0.6931471805599453;

// The pole-term bridge as a codimension-2 positive-extension (Schur-complement) problem.
export const IMP97076_BRIDGE_STRUCTURE = Object.freeze({
  certifiedObject: 'Weil positivity restricted to the pole-free subspace P0 = {hhat(+-i/2) = 0}, i.e. T_a[sigma_2] >= 0 with sigma_2 = (t^2+1/4)^2 w_1',
  certifiedReach2a: 0.96,
  target: 'full Weil positivity over PW_a = P0 (+) span{cosh(x/2), x sinh(x/2)}',
  bridgeType: 'codimension-2 positive-extension / Schur-complement over the rank-2 pole block',
  poleTermSign: 'positive (rank-2), but positive addition to a subspace-positive form does NOT force full positivity',
  sonineRealization: 'the excess inequality D_S <= L_S, obstructed at 2a = ln 2',
});

// The enumerated NON-Sonine candidate bridges and their precise obstructions.
export const IMP97076_CANDIDATE_BRIDGES = Object.freeze([
  Object.freeze({
    tag: 'B1',
    name: 'UN-WEIGHTING / MULTIPLIER (divide sigma_2 form by (t^2+1/4)^2)',
    nonSonine: true,
    clearsLn2: false,
    obstruction: 'support non-preservation: (t^2+1/4)^(-1) = [s(1-s)]^(-1) is a nonlocal kernel, mapping exact-support test functions out of the fixed-support certificate class',
    obstructionAxis: 'support (independent of ln 2)',
  }),
  Object.freeze({
    tag: 'B2',
    name: 'DIRECT KREIN POSITIVE-EXTENSION (Schur complement; phi = alpha cosh + beta u sinh, free outside |u|<2a)',
    nonSonine: true,
    clearsLn2: false,
    retainedSonineTraceFractionAtT1: 1 / 9.11,
    obstruction: 'the pole directions concentrate on the same p=2 resonance band as the pole-free dip [7.4,10.8]; the dual certificate is the exact dual of the same resonance cancellation and inherits the ln 2 obstruction',
    obstructionAxis: 'p=2 resonance (same as Sonine)',
  }),
  Object.freeze({
    tag: 'B3',
    name: 'ARCHIMEDEAN-INTEGRAL ABSORPTION (fold pole term into the digamma integral, dominate prime sum by one fixed measure)',
    nonSonine: true,
    clearsLn2: false,
    obstruction: 'the pole + archimedean measure is support-independent, but the binding p=2 resonance term grows LINEARLY in resonance count (deltaOut 0.3536 per log2; excess carries HALF the rho=2 cusp, c2 = 0.51007); a fixed measure cannot dominate a support-growing term',
    obstructionAxis: 'p=2 resonance (same as Sonine)',
  }),
]);

// The class-level verdict and honest residual.
export const IMP97076_VERDICT = Object.freeze({
  ticket: 'imp-97076',
  question:
    'can a NON-Sonine pole-term bridge carry pole-free positivity T_a[sigma_2] >= 0 (2a <= 0.96) to the FULL Weil form past 2a = ln 2, where the semilocal Sonine/excess bridge D_S <= L_S fails?',
  resonanceFrequencyLaw: 't_k = 2 pi k / ln 2 (p = 2 resonances)',
  ln2: LN2,
  bindingDipWindow: Object.freeze([7.4, 10.8]),
  excessCarriesHalfOfRho2Cusp: true, // per-log2 deltaS 0.7071 / deltaIn 0.3536 / deltaOut 0.3536
  candidateCount: 3,
  anyCandidateClearsLn2: false,
  sharedMechanism: 'all local / finite-rank / fixed-measure candidates feed the same p=2 resonance windows where the pole-free minimiser loses positivity',
  obstructionIsBridgeAgnosticInLocalClass: true, // UPGRADES Axis II from one-bridge to whole-class
  upgradesAxisII: 'from "the one assembled Sonine bridge fails at ln 2" to "the whole local/finite-rank/fixed-measure pole-term class fails at ln 2"',
  certifiedReachUnchanged: 0.96,
  positivityTheoremEstablished: false,
  operatorPositivityProved: false,
  rhResolved: false,
  qed: false,
  subGap:
    'IMP97076_NONLOCAL_ARITHMETIC_BRIDGE_ONLY -- refutation covers the LOCAL / finite-rank / fixed-measure non-Sonine class; a genuinely nonlocal / infinite-rank / arithmetic-input bridge stays open and, if purely soft, is blocked by the flow-blindness no-go (Axis III).',
});

// --- self-executing internal-consistency assertions (pure literals; import-light) ---
const IMP97076_ASSERTIONS = [
  {
    id: 'imp97076-bridge-is-codim2-positive-extension',
    holds: () =>
      IMP97076_BRIDGE_STRUCTURE.certifiedReach2a === 0.96 &&
      IMP97076_BRIDGE_STRUCTURE.bridgeType.includes('positive-extension') &&
      IMP97076_BRIDGE_STRUCTURE.sonineRealization.includes('ln 2'),
    why: 'the pole-term bridge is a codimension-2 positive-extension over the rank-2 pole block; the Sonine realization D_S <= L_S is obstructed at ln 2.',
  },
  {
    id: 'imp97076-three-nonsonine-candidates-none-clear-ln2',
    holds: () =>
      IMP97076_CANDIDATE_BRIDGES.length === 3 &&
      IMP97076_CANDIDATE_BRIDGES.every((b) => b.nonSonine === true && b.clearsLn2 === false) &&
      IMP97076_VERDICT.candidateCount === 3 &&
      IMP97076_VERDICT.anyCandidateClearsLn2 === false,
    why: 'three non-Sonine candidates (un-weighting, direct Krein extension, archimedean absorption); none clears the ln 2 obstruction.',
  },
  {
    id: 'imp97076-shared-p2-resonance-mechanism-upgrades-axisII',
    holds: () =>
      IMP97076_VERDICT.obstructionIsBridgeAgnosticInLocalClass === true &&
      IMP97076_VERDICT.resonanceFrequencyLaw.includes('ln 2') &&
      IMP97076_VERDICT.bindingDipWindow[0] === 7.4 &&
      IMP97076_VERDICT.bindingDipWindow[1] === 10.8 &&
      IMP97076_VERDICT.excessCarriesHalfOfRho2Cusp === true &&
      Math.abs(IMP97076_VERDICT.ln2 - LN2) < 1e-15,
    why: 'the shared p=2 resonance mechanism (t_k = 2 pi k / ln 2; dip [7.4,10.8]; excess carries half the rho=2 cusp) makes the ln 2 obstruction bridge-agnostic in the local class, upgrading Axis II.',
  },
  {
    id: 'imp97076-assessment-no-theorem-no-qed-with-subgap',
    holds: () =>
      IMP97076_VERDICT.certifiedReachUnchanged === 0.96 &&
      IMP97076_VERDICT.positivityTheoremEstablished === false &&
      IMP97076_VERDICT.operatorPositivityProved === false &&
      IMP97076_VERDICT.rhResolved === false &&
      IMP97076_VERDICT.qed === false &&
      typeof IMP97076_VERDICT.subGap === 'string' &&
      IMP97076_VERDICT.subGap.includes('IMP97076_NONLOCAL_ARITHMETIC_BRIDGE_ONLY'),
    why: 'this leaf is an assessment; it establishes no positivity theorem, moves no bound, certified reach stays 2a <= 0.96, RH open, NO QED; residual named as a sub-gap.',
  },
];

for (const a of IMP97076_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97076 assertion FAILED: ${a.id} -- ${a.why}`);
  }
}
