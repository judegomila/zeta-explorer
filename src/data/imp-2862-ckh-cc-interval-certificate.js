/**
 * @module imp-2862-ckh-cc-interval-certificate
 *
 * imp-2862 (medium, numerical, S7): Machine-checked OUTWARD-ROUNDED interval
 * certificate for the Koksma-Hlawka constant C_KH = pi . C_Selberg and the
 * derived collision constant C_C = C_H . sqrt(C_KH) that feed the dominant
 * E_coll term of the Polymath15 bridge.
 *
 *     C_KH = pi . C_Selberg          (Koksma-Hlawka W_1 bound constant, imp-341)
 *     C_C  = C_H . sqrt(C_KH)        (collision prefactor, imp-366/imp-399)
 *
 * Until now C_KH and C_C were carried as POINT floats in
 * polymath15-constant-C-C.js (C_KH = 3 pi ~ 9.4248, C_C = (1/8) sqrt(3 pi) ~
 * 0.3837). Every sibling load-bearing constant already wears interval armour
 * (imp-2704 C_F, imp-2709 kappa_T, imp-2762 TC_A1); this module gives C_KH/C_C
 * the same machine-checked enclosure, built with the imp-068 outward-rounded
 * Interval class.
 *
 * THE C_Selberg BRACKET
 * ---------------------
 * imp-2641 discharges the C_Selberg = 3.0 PLACEHOLDER down to the rigorous
 * Trudgian 2014 value 2.622 (sup of the S(T) coefficient over T >= e), and
 * proves 2.622 < 3.0 so the placeholder is a CONSERVATIVE over-estimate. We
 * wrap C_Selberg in the rigorous-to-conservative bracket
 *
 *     C_Selberg in [2.622, 3.0]
 *
 * (rigorous Trudgian floor -> conservative placeholder ceiling), propagate
 * through pi and the sqrt with the Interval class, and emit
 *
 *     C_KH in [pi . 2.622, pi . 3.0]            ~ [8.2373, 9.4248]
 *     C_C  in [(1/8) sqrt(pi . 2.622), (1/8) sqrt(3 pi)] ~ [0.3588, 0.3837]
 *
 * WHICH ENDPOINT IS CONSERVATIVE
 * ------------------------------
 * C_KH and C_C are both strictly INCREASING in C_Selberg (pi > 0; sqrt and the
 * scalar 1/8 are increasing), so the UPPER endpoint is driven by the placeholder
 * 3.0 and the LOWER endpoint by the rigorous Trudgian 2.622. The carried point
 * values C_KH_PINNED = 3 pi and C_C_PINNED = (1/8) sqrt(3 pi) therefore sit at
 * the UPPER (conservative, placeholder-driven) endpoint of each bracket -- the
 * worst-case reading that keeps E_coll a valid upper bound. Assertion (A) below
 * certifies exactly that placement.
 *
 * HONEST DESIGN -- NO FALSE QED
 * -----------------------------
 * This certifies ONLY the C_Selberg-driven WIDTH of C_KH/C_C. The factor
 * C_H = 1/8 inside C_C stays a NOT-rigorous ANSATZ endpoint (imp-2642): it is
 * the exact leading-order quadratic-tangency coefficient, not a proven upper
 * bound on the Holder-1/2 modulus, so this module does NOT discharge the C_H
 * gap, does NOT make Lambda <= E(N) rigorous (imp-2643 NO-GO; imp-2701 lock),
 * and changes no committed Lambda value. C_H is carried here as an EXACT scalar
 * endpoint (Interval.exact(1/8)) purely to propagate the C_Selberg width; its
 * non-rigorous status is recorded in cHIsAnsatz below. Math.PI is the float64
 * nearest to pi (error < 1 ULP), absorbed by the Interval outward rounding.
 *
 * @see polymath15-constant-C-C (C_C_PINNED = (1/8) sqrt(3 pi) point float)
 * @see imp-2641-c-selberg-trudgian-discharge (C_Selberg 2.622 rigorous floor < 3.0 placeholder)
 * @see imp-2642 / imp-2701-ch-rigor-lock (C_H = 1/8 is an ANSATZ, not rigorous)
 * @see imp-2704-cf-interval-certificate (sibling C_F interval certificate, same pattern)
 * @see imp-2709-kappa-t-interval-certificate (sibling kappa_T interval certificate)
 * @see interval-arithmetic (imp-068 outward-rounded mul/sqrt)
 */

import { Interval } from '../math/interval-arithmetic.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';
import { IMP2641_C_SELBERG_TRUDGIAN_DISCHARGE } from './imp-2641-c-selberg-trudgian-discharge.js';

// ── The C_Selberg bracket: rigorous Trudgian floor -> conservative placeholder ─
// Single-sourced from imp-2641 so a change to either endpoint there flows here.
const C_SELBERG_RIGOROUS = IMP2641_C_SELBERG_TRUDGIAN_DISCHARGE.C_Selberg.rigorousExplicit; // 2.622
const C_SELBERG_PLACEHOLDER = IMP2641_C_SELBERG_TRUDGIAN_DISCHARGE.C_Selberg.placeholder;    // 3.0
const C_SELBERG_INTERVAL = new Interval(C_SELBERG_RIGOROUS, C_SELBERG_PLACEHOLDER);

// ── Propagate through pi (exact endpoint) to get C_KH = pi . C_Selberg ─────────
const PI_INTERVAL = Interval.exact(Math.PI);
const C_KH_INTERVAL = PI_INTERVAL.mul(C_SELBERG_INTERVAL);

// ── C_H = 1/8 ANSATZ scalar (NOT rigorous, imp-2642), then C_C = C_H . sqrt(C_KH)
const C_H_ANSATZ = Interval.exact(1 / 8);
const C_C_INTERVAL = C_H_ANSATZ.mul(C_KH_INTERVAL.sqrt());

// ── The carried point values (placeholder-driven, conservative endpoint) ───────
const C_KH_PINNED = Math.PI * C_SELBERG_PLACEHOLDER;          // 3 pi ~ 9.4248
// C_C_PINNED = (1/8) sqrt(3 pi) ~ 0.3837 imported live from polymath15-constant-C-C.js.

// Outward-rounding floor: width of one Interval EPS pad at this magnitude. The
// pinned point sits at the bracket UPPER endpoint up to this much slack.
const ENDPOINT_TOL = 1e-9;

export const IMP2862_CKH_CC_INTERVAL_CERTIFICATE = {
  id: 'imp-2862',
  proofSection: 'S7',
  question:
    'Convert the point floats C_KH = pi . C_Selberg and C_C = C_H . sqrt(C_KH) into outward-rounded interval certificates over the C_Selberg bracket [2.622, 3.0], and certify the carried point values sit at the conservative (placeholder-driven) upper endpoint.',
  cSelbergBracket: {
    rigorousTrudgian_lo: C_SELBERG_RIGOROUS,    // 2.622
    placeholder_hi: C_SELBERG_PLACEHOLDER,      // 3.0
    placeholderIsConservative: C_SELBERG_RIGOROUS < C_SELBERG_PLACEHOLDER,
  },
  cKhInterval: {
    lo: C_KH_INTERVAL.lo,
    hi: C_KH_INTERVAL.hi,
    width: C_KH_INTERVAL.width,
    pinned: +C_KH_PINNED.toFixed(6),            // 9.424778 (= 3 pi)
    pinnedAtUpperEndpoint: Math.abs(C_KH_INTERVAL.hi - C_KH_PINNED) < ENDPOINT_TOL
      || C_KH_PINNED <= C_KH_INTERVAL.hi,
    note:
      'C_KH = pi . C_Selberg is increasing in C_Selberg, so the carried 3 pi sits '
      + 'at the placeholder-driven UPPER endpoint; the Trudgian floor 2.622 drives '
      + 'the lower endpoint pi . 2.622 ~ 8.2373.',
  },
  cCInterval: {
    lo: C_C_INTERVAL.lo,
    hi: C_C_INTERVAL.hi,
    width: C_C_INTERVAL.width,
    pinned: +C_C_PINNED.toFixed(6),             // 0.383701 (= (1/8) sqrt(3 pi))
    pinnedAtUpperEndpoint: C_C_PINNED <= C_C_INTERVAL.hi
      && Math.abs(C_C_INTERVAL.hi - C_C_PINNED) < ENDPOINT_TOL,
    note:
      'C_C = (1/8) sqrt(C_KH) is increasing in C_Selberg, so the carried '
      + '(1/8) sqrt(3 pi) ~ 0.3837 sits at the conservative UPPER endpoint; the '
      + 'rigorous floor gives (1/8) sqrt(pi . 2.622) ~ 0.3588.',
  },
  cHIsAnsatz: {
    value: 1 / 8,
    rigorous: false,
    note:
      'C_H = 1/8 is the exact leading-order quadratic-tangency coefficient, NOT a '
      + 'rigorous Holder-1/2 modulus upper bound (imp-2642). This certificate pins '
      + 'the C_Selberg-driven WIDTH of C_KH/C_C only; it does NOT discharge the C_H '
      + 'gap, does NOT make Lambda <= E(N) rigorous (imp-2643 NO-GO; imp-2701 lock).',
  },
  verdict:
    'C_KH and C_C INTERVAL-CERTIFIED over C_Selberg in [2.622, 3.0]. C_KH in ['
    + C_KH_INTERVAL.lo.toFixed(6) + ', ' + C_KH_INTERVAL.hi.toFixed(6) + '], C_C in ['
    + C_C_INTERVAL.lo.toFixed(6) + ', ' + C_C_INTERVAL.hi.toFixed(6)
    + '] (outward-rounded). The carried point values 3 pi and (1/8) sqrt(3 pi) sit '
    + 'at the conservative placeholder-driven UPPER endpoint. C_H = 1/8 remains a '
    + 'NOT-rigorous ansatz endpoint -- the C_H gap is NOT certified here.',
  citation:
    'polymath15-constant-C-C.js (C_C_PINNED point float); '
    + 'imp-2641-c-selberg-trudgian-discharge.js (C_Selberg 2.622 floor < 3.0 placeholder); '
    + 'imp-2701-ch-rigor-lock.js (C_H = 1/8 ansatz, not rigorous); '
    + 'imp-2704-cf-interval-certificate.js / imp-2709-kappa-t-interval-certificate.js (sibling certs); '
    + 'interval-arithmetic.js (imp-068 outward-rounded mul/sqrt)',
};

export const IMP2862_CKH_CC_INTERVAL_CERTIFICATE_ASSERTIONS = [
  {
    id: 'imp2862-ckh-bracket-encloses-pinned-at-upper-endpoint',
    description:
      'The outward-rounded C_KH bracket equals [pi . 2.622, pi . 3.0] and the carried point value 3 pi lies inside it at the conservative UPPER (placeholder-driven) endpoint.',
    holds: () =>
      C_KH_INTERVAL.contains(C_KH_PINNED)
      && C_KH_PINNED <= C_KH_INTERVAL.hi + ENDPOINT_TOL
      && Math.abs(C_KH_INTERVAL.hi - C_KH_PINNED) < ENDPOINT_TOL
      && C_KH_INTERVAL.lo < C_KH_PINNED,
  },
  {
    id: 'imp2862-cc-pinned-at-conservative-upper-endpoint',
    description:
      'C_C_PINNED = (1/8) sqrt(3 pi) lies inside the outward-rounded C_C bracket at the conservative UPPER endpoint (placeholder-driven), strictly above the rigorous-Trudgian-driven lower endpoint.',
    holds: () =>
      C_C_INTERVAL.contains(C_C_PINNED)
      && C_C_PINNED <= C_C_INTERVAL.hi + ENDPOINT_TOL
      && Math.abs(C_C_INTERVAL.hi - C_C_PINNED) < ENDPOINT_TOL
      && C_C_INTERVAL.lo < C_C_PINNED,
  },
  {
    id: 'imp2862-brackets-finite-positive-ordered-tight',
    description:
      'Both brackets are genuine machine enclosures: finite, strictly positive, correctly ordered (lo < hi), and tight enough to be useful (C_C width < 0.03, C_KH width < 1.2).',
    holds: () =>
      Number.isFinite(C_KH_INTERVAL.lo) && Number.isFinite(C_KH_INTERVAL.hi)
      && Number.isFinite(C_C_INTERVAL.lo) && Number.isFinite(C_C_INTERVAL.hi)
      && C_KH_INTERVAL.lo > 0 && C_C_INTERVAL.lo > 0
      && C_KH_INTERVAL.lo < C_KH_INTERVAL.hi && C_C_INTERVAL.lo < C_C_INTERVAL.hi
      && C_KH_INTERVAL.width > 0 && C_KH_INTERVAL.width < 1.2
      && C_C_INTERVAL.width > 0 && C_C_INTERVAL.width < 0.03,
  },
  {
    id: 'imp2862-c-selberg-bracket-from-discharge-and-conservative',
    description:
      'The C_Selberg bracket endpoints are single-sourced from imp-2641 (rigorous Trudgian 2.622, placeholder 3.0) and the rigorous floor is strictly below the conservative placeholder ceiling.',
    holds: () =>
      Math.abs(C_SELBERG_RIGOROUS - 2.622) < 1e-9
      && Math.abs(C_SELBERG_PLACEHOLDER - 3.0) < 1e-9
      && C_SELBERG_RIGOROUS < C_SELBERG_PLACEHOLDER,
  },
  {
    id: 'imp2862-ch-stays-non-rigorous-ansatz',
    description:
      'HONEST: this certificate pins the C_Selberg-driven width only; the C_H = 1/8 factor stays a NOT-rigorous ansatz endpoint (imp-2642), so the C_H gap is explicitly NOT discharged here.',
    holds: () =>
      IMP2862_CKH_CC_INTERVAL_CERTIFICATE.cHIsAnsatz.rigorous === false
      && Math.abs(IMP2862_CKH_CC_INTERVAL_CERTIFICATE.cHIsAnsatz.value - 1 / 8) < 1e-15,
  },
];

for (const a of IMP2862_CKH_CC_INTERVAL_CERTIFICATE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error('imp-2862-ckh-cc-interval-certificate assertion failed: ' + a.id);
  }
}
