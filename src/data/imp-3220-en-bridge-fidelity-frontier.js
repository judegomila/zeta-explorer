/**
 * @module imp-3220-en-bridge-fidelity-frontier
 *
 * imp-3220 (numerical, frontier-direction): the lambda-roadmap currentStatus
 * (PHASE 51) names the E(N) BRIDGE CONSTANTS -- the fidelity of the Step-4
 * connection |Lambda - (-t_c(N))| <= E(N) -- and states that the empirical
 * leading-order predicates E1/E2 now hold UNCONDITIONALLY on the full assembly
 * range N* in {2..10^6} (PATH 1), while the analytic chain still carries the
 * GUE-conditional C_mb <= 1 (imp-486). "Closing the gap between the empirical
 * regime and the analytic chain is the active research frontier."
 *
 * imp-2643 assembles the bridge budget E(N) = E_trunc + E_flow + E_coll at the
 * SINGLE working point N* = 1e4, and imp-2715 pessimizes every constant at that
 * same point. Neither TABULATES E(N) across the assembly range, so it is not
 * visible WHERE along {2..10^6} the empirical-vs-analytic fidelity gap is widest.
 * This module reuses the repo-computed E(N) formula (same effectiveHeightForN,
 * the same C_C_PINNED, the same C_F prefactor) and tabulates the bridge-constant
 * fidelity quantities across a decade ladder, then locates the widest gap.
 *
 * THE FIDELITY QUANTITY
 * ---------------------
 * Exactly ONE of the three sub-terms carries the GUE-conditional content: the
 * dominant E_coll = C_C sqrt(log T0 / N), whose C_C = C_H sqrt(pi C_Selberg)
 * rests on the C_H = 1/8 ansatz (imp-2642) that IS the C_mb <= 1 GUE conditional
 * (imp-486). E_flow (C_F pinned, imp-398; Gronwall non-binding, imp-2644) and
 * E_trunc (fixed-strip Platt-Trudgian route at the T_PT = 3e12 verification
 * height, imp-2631 -- N-independent and negligible) are UNCONDITIONALLY rigorous.
 * So the natural fidelity gap is the CONDITIONAL SHARE
 *     sigma(N) = E_coll(N) / E(N),
 * the fraction of the bridge budget the analytic chain must borrow from the
 * GUE conditional but the E1/E2 empirical predicates do NOT need.
 *
 * THE FINDING (assessment only)
 * -----------------------------
 * sigma(N) is U-SHAPED across the assembly range, NOT monotone: it starts at
 * ~0.912 at N = 2, DIPS to a minimum ~0.841 near N approx 100 (the lower edge of
 * the imp-963 measured-C_mb window [100, 1e4]), then RISES monotonically to its
 * WIDEST value ~0.949 at the N* = 10^6 assembly ceiling. The two ends are
 * conditional-dominated for opposite reasons: at small N the height T0 is tiny so
 * E_flow ~ (log T0)^2 / T0 is comparatively large but E_coll (order 0.5) simply
 * dwarfs it; toward N* = 10^6 the E_coll/E_flow ratio grows ~32x because
 * E_flow ~ (log T0)^2 / T0 decays far faster than E_coll ~ sqrt(log T0 / N).
 *
 * The punchline: the empirical-vs-analytic gap is WIDEST precisely at the top of
 * the range PATH 1 extended the UNCONDITIONAL empirical floor to (N* = 10^6). The
 * two frontiers diverge exactly where the empirical coverage was hardest-won --
 * as the unconditional empirical floor is pushed up, the analytic bridge budget
 * concentrates ever more (94.9% at 10^6) onto the single GUE-conditional constant.
 *
 * WHAT AN UNCONDITIONAL BRIDGE WOULD REQUIRE
 * ------------------------------------------
 * At every N in the range >= 84% of E(N) is E_coll, so an unconditional E(N) is
 * gated by ONE thing: discharging C_H to a rigorous N-uniform Holder-1/2 modulus
 * upper bound (Polymath15 Lemma 5.2 cusp-density C_cusp for C_shock, plus a
 * non-Gronwall microscopic gap-stability C_Lip). imp-486 proved no unconditional
 * C_mb bound exists without GUE universality (Erdos-Schlein-Yau local law), so
 * this remains the sole irreducible conditional. E_flow and E_trunc are already
 * unconditional; closing the gap does NOT require touching them.
 *
 * ASSESSMENT ONLY. No positivity, no bridge closure, no RH claim, NO QED.
 * No refereed bound is changed.
 *
 * @see imp-2643-honest-assembled-EN (single-point E(N) capstone at N* = 1e4)
 * @see imp-2715-worst-case-EN-headroom-audit (single-point worst-case brackets)
 * @see polymath15-constant-C-C (C_C = C_H sqrt(pi C_Selberg); C_H = 1/8 ansatz)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';
import { IMP2643_HONEST_ASSEMBLED_EN } from './imp-2643-honest-assembled-EN.js';

const TWO_PI = 2 * Math.PI;
const PT_BOUND = 0.2; // Platt-Trudgian 2021 bound upper bound.

// E_trunc via the fixed-strip Platt-Trudgian route (imp-2631/imp-2715): tied to
// the T_PT = 3e12 verification height, so it is N-INDEPENDENT across the assembly
// instantiation and numerically negligible (~3e-5). Held constant here, matching
// the imp-2643 capstone treatment; the fidelity conclusion is driven by the
// E_coll/E_flow ratio and is robust to this term.
const E_TRUNC_PT = 3.06e-5;

// |t_c| <= 2.37e-4 A1 unconditional trap; Gronwall exponent C_G = 1 (non-binding,
// imp-2644): the amplification exp(C_G |t_c|) stays within [1.00024, 1.00237].
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP);

// One assembly-range row: reuse the exact repo E(N) sub-term formulas.
function bridgeRow(N) {
  const T0 = effectiveHeightForN(N); // gamma_N via Riemann-von Mangoldt inverse
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // pinned prefactor (imp-398)
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // dominant, GUE-conditional (C_H)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  const conditionalShare = E_coll / E_N; // fraction on the GUE conditional
  return {
    N,
    T0: +T0.toExponential(3),
    logT0: +L.toFixed(4),
    E_trunc: +E_TRUNC_PT.toExponential(3),
    E_flow: +E_flow.toExponential(4),
    E_coll: +E_coll.toExponential(4),
    E_N: +E_N.toExponential(5),
    conditionalShare: +conditionalShare.toFixed(5),
    rigorousShare: +(1 - conditionalShare).toFixed(5),
    E_coll_over_E_flow: +(E_coll / E_flow).toFixed(2),
    // full-precision copies for downstream live re-derivation (no storage floor)
    _condShareFull: conditionalShare,
    _E_N_full: E_N,
    _E_coll_full: E_coll,
  };
}

const LADDER_N = [2, 10, 100, 1000, 1e4, 1e5, 1e6];
const TABLE = LADDER_N.map(bridgeRow);

// Locate the widest gap (largest conditional share) and the U-shape minimum.
const widest = TABLE.reduce((a, b) => (b._condShareFull > a._condShareFull ? b : a));
const narrowest = TABLE.reduce((a, b) => (b._condShareFull < a._condShareFull ? b : a));

// Cross-check the N* = 1e4 row against the imp-2643 single-point capstone.
const ROW_1E4 = TABLE.find((r) => r.N === 1e4);
const CAPSTONE_E_N = IMP2643_HONEST_ASSEMBLED_EN.E_N; // 0.0129087

export const IMP3220_EN_BRIDGE_FIDELITY_FRONTIER = {
  id: 'imp-3220',
  proofSection: 'S-frontier',
  question:
    'Tabulate the E(N) bridge-constant fidelity quantities across the assembly range ' +
    'N* in {2..10^6} and assess WHERE the empirical-vs-analytic gap is widest, ' +
    'surfacing what an unconditional bridge would require. Assessment only, no QED.',
  fidelityQuantity:
    'conditionalShare sigma(N) = E_coll(N) / E(N): the fraction of the bridge budget ' +
    'the analytic chain borrows from the GUE-conditional C_C (C_H = 1/8 ansatz, ' +
    'imp-2642, = the C_mb <= 1 conditional of imp-486). E_flow and E_trunc are ' +
    'unconditionally rigorous, so 1 - sigma(N) is the unconditionally-rigorous share.',
  table: TABLE.map(({ _condShareFull, _E_N_full, _E_coll_full, ...pub }) => pub),
  widestGap: {
    N: widest.N,
    conditionalShare: widest.conditionalShare,
    note:
      'The empirical-vs-analytic gap is WIDEST at the N* = 10^6 assembly ceiling ' +
      '(sigma ~ 0.949): 94.9% of the bridge budget rests on the GUE-conditional ' +
      'C_H there, precisely the top of the range PATH 1 extended the UNCONDITIONAL ' +
      'empirical E1/E2 floor to. The two frontiers diverge where empirical coverage ' +
      'was hardest-won -- E_coll/E_flow grows ~32x over the range.',
  },
  narrowestGap: {
    N: narrowest.N,
    conditionalShare: narrowest.conditionalShare,
    note:
      'sigma(N) is U-SHAPED, not monotone: it dips to its minimum ~0.841 near ' +
      'N approx 100 (lower edge of the imp-963 measured-C_mb window [100,1e4]) where ' +
      'E_flow ~ (log T0)^2 / T0 is comparatively largest, then rises to both ends.',
  },
  capstoneCrossCheck: {
    N: 1e4,
    E_N_here: ROW_1E4.E_N,
    E_N_capstone: +CAPSTONE_E_N.toFixed(7),
    note:
      'The N* = 1e4 row reproduces the imp-2643 single-point capstone E(N) ~ 0.0129 ' +
      'to the display floor -- the tabulation uses the identical sub-term formulas.',
  },
  unconditionalBridgeRequires:
    'At every N in {2..10^6} at least 84% of E(N) is E_coll, so an unconditional ' +
    'E(N) is gated by ONE thing: discharging C_H to a rigorous N-uniform Holder-1/2 ' +
    'modulus upper bound (Polymath15 Lemma 5.2 cusp-density C_cusp for C_shock plus a ' +
    'non-Gronwall microscopic gap-stability C_Lip). imp-486 proved no unconditional ' +
    'C_mb bound exists without GUE universality (Erdos-Schlein-Yau local law); this is ' +
    'the sole irreducible conditional. E_flow / E_trunc are already unconditional.',
  isRigorous: false,
  verdict:
    'ASSESSMENT (frontier-direction, NOT rigorous). Across the full assembly range ' +
    'N* in {2..10^6} the bridge budget E(N) is dominated (>= 84%) by the single ' +
    'GUE-conditional term E_coll at every N; the conditional share sigma(N) is ' +
    'U-shaped, minimized ~0.841 near N approx 100 and WIDEST ~0.949 at the N* = 10^6 ' +
    'ceiling -- exactly where PATH 1 pushed the unconditional empirical E1/E2 floor. ' +
    'The gap between the unconditional empirical regime and the analytic chain is ' +
    'therefore widest at the top of the range, and closing it requires discharging ' +
    'the sole GUE conditional C_H (C_mb, imp-486), not the already-unconditional ' +
    'E_flow / E_trunc. No positivity, no bridge closure, no RH claim, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-2643 (single-point E(N) capstone); imp-2715 (single-point worst-case); ' +
    'imp-2642 (C_H = 1/8 ansatz); imp-486 (C_mb GUE-conditional, no unconditional bound); ' +
    'imp-963 (measured C_mb on [100,1e4]); imp-398/imp-2644 (E_flow rigor); ' +
    'imp-2631 (E_trunc fixed-strip route); lambda-roadmap PHASE 51 (PATH 1 empirical floor).',
};

export const IMP3220_EN_BRIDGE_FIDELITY_FRONTIER_ASSERTIONS = [
  {
    id: 'imp3220-table-covers-assembly-range',
    description: 'Tabulation spans the assembly range N* endpoints 2 and 10^6',
    holds: () => TABLE.length === 7 && TABLE[0].N === 2 && TABLE[TABLE.length - 1].N === 1e6,
  },
  {
    // The N*=1e4 row must reproduce the imp-2643 single-point capstone E(N) ~ 0.0129,
    // proving the tabulation reuses the identical sub-term formulas (not a fresh model).
    id: 'imp3220-reproduces-capstone-at-1e4',
    description: 'The N*=1e4 row reproduces the imp-2643 capstone E(N) ~ 0.0129 (identical formulas)',
    holds: () => Math.abs(ROW_1E4._E_N_full - CAPSTONE_E_N) < 5e-4,
  },
  {
    // The fidelity substance: at EVERY N the GUE-conditional E_coll carries the
    // majority (>= 84%) of the bridge budget, so the whole E(N) rigor is governed
    // by the single conditional constant across the entire assembly range.
    id: 'imp3220-conditional-share-dominant-everywhere',
    description: 'E_coll (GUE-conditional) is >= 84% of E(N) at every tabulated N',
    holds: () => TABLE.every((r) => r._condShareFull >= 0.84),
  },
  {
    // The gap is WIDEST at the top of the range (N*=10^6), exactly where PATH 1
    // extended the unconditional empirical floor -- the headline assessment.
    id: 'imp3220-widest-gap-at-ceiling',
    description: 'The conditional share is widest at the N*=10^6 assembly ceiling (~0.949)',
    holds: () => widest.N === 1e6 && Math.abs(widest._condShareFull - 0.9494) < 5e-3,
  },
  {
    // U-shape: the minimum is interior (near N~100), NOT at an endpoint -- so the
    // gap is non-monotone and the two ends are conditional-dominated for opposite
    // reasons. Guards against a mis-read as a monotone decay.
    id: 'imp3220-conditional-share-is-U-shaped',
    description: 'The conditional share is U-shaped: interior minimum near N~100, below both ends',
    holds: () =>
      narrowest.N === 100 &&
      narrowest._condShareFull < TABLE[0]._condShareFull &&
      narrowest._condShareFull < widest._condShareFull &&
      Math.abs(narrowest._condShareFull - 0.8410) < 5e-3,
  },
  {
    // E_coll/E_flow must grow strongly toward the ceiling (~32x at 10^6 vs ~5x at
    // the minimum) -- the mechanism behind the rising right arm of the U.
    id: 'imp3220-ecoll-over-eflow-grows-to-ceiling',
    description: 'E_coll/E_flow grows to ~32x at N*=10^6, driving the widening gap',
    holds: () => {
      const top = TABLE[TABLE.length - 1].E_coll_over_E_flow;
      return top > 25 && top > narrowest.E_coll_over_E_flow;
    },
  },
  {
    // Honesty gate: assessment only, names the single blocking conditional C_H/C_mb,
    // keeps PT as SOTA, and makes no rigorous / RH claim.
    id: 'imp3220-honesty-gate-no-qed',
    description: 'Assessment only: names the C_H/C_mb conditional, no QED, no refereed bound is changed',
    holds: () =>
      IMP3220_EN_BRIDGE_FIDELITY_FRONTIER.isRigorous === false &&
      /C_H/.test(IMP3220_EN_BRIDGE_FIDELITY_FRONTIER.unconditionalBridgeRequires) &&
      /NO QED/.test(IMP3220_EN_BRIDGE_FIDELITY_FRONTIER.verdict) &&
      /refereed bound is changed/i.test(IMP3220_EN_BRIDGE_FIDELITY_FRONTIER.verdict),
  },
];

for (const a of IMP3220_EN_BRIDGE_FIDELITY_FRONTIER_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-3220-en-bridge-fidelity-frontier assertion failed: ${a.id}`);
  }
}
