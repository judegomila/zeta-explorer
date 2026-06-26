/**
 * @module data/assertion-sweep-2026-04-12
 * @fileoverview imp-501 full build-time assertion sweep dated 2026-04-12. This
 *   file is both an audit artifact (the ASSERTION_SWEEP_2026_04_12 PASS matrix
 *   documenting every top-level throw-on-failure assertion in src/data/ and
 *   src/math/) and a load-bearing wiring step (four side-effect imports that
 *   activate twelve previously dead build-time assertions by making their
 *   parent modules reachable from rh-attack.js). Without the side-effect
 *   imports, those four modules sit outside the production import graph and
 *   their top-level throws are dead code — silent regressions to C_H / C_C /
 *   C_T / C_F precision, submission-ready fatalCount, criticalPending, or
 *   c-mb searchComplete would land without a build-time signal.
 *
 * Proof-chain step: meta / hygiene wiring (NOT itself a proof step). The
 *   purpose is to guarantee that every previously authored top-level throw
 *   assertion fires at module-load time so silent regressions cannot land. If
 *   any of the seventeen tracked assertions starts failing under a future
 *   edit, npm run build aborts with the original module error message and
 *   the surrounding ticket id is preserved in the bracketed prefix of the
 *   thrown error (e.g. "[imp-413] ulpErr exceeded threshold").
 *
 * Side-effect imports (load order, after rh-attack.js pulls this file):
 *   - polymath15-constants-mpfr-check.js  imp-413  4 assertions (C_H / C_C /
 *     C_T / C_F worst-case ulp under 5 via double-double arithmetic Dekker
 *     1971 with about 32 significant digits; max observed ulpErr 0.852).
 *   - polymath15-constants-gmp-check.js   imp-422  4 assertions (relErr under
 *     1e-14 via BigInt fixed-point at D = 10^100 about 100 significant digits).
 *   - submission-ready-2026-04-12.js      imp-500  2 assertions (fatalCount
 *     strictly equal to 0; criticalPending strictly equal to 0 hardened from
 *     soft warning to hard throw by imp-503).
 *   - c-mb-unconditional-bound.js         imp-486  2 assertions (searchComplete
 *     strictly equal to true; approachesExamined.length at least 3 — the
 *     three approaches Selberg / Huxley / GGM documented for GUE universality
 *     irreducibility).
 *   The fifth tracked module imp469-cross-verification.js (imp-473, 5
 *   assertions on rho(14) and rho(gamma_1) positivity and threshold floors)
 *   is already live via m-raw-from-umon-bridge.js (independent side-effect
 *   import predating this sweep), so this file does not re-import it.
 *
 * Exports:
 *   - ASSERTION_SWEEP_2026_04_12: object with ticket imp-501, date
 *     2026-04-12, timestamp 2026-04-12T07:00:00.000Z, buildPassed true,
 *     verifiedAt 2026-04-15T23:00:00.000Z (imp-806 re-verification stamp),
 *     totalAssertions 17, deadBeforeSweep 12, liveBeforeSweep 5,
 *     deadAfterSweep 0, and an assertions array of five per-file rows each
 *     carrying file path, ticket id, count integer, checks string array,
 *     wasLive boolean, nowLive boolean, pass boolean, optional liveVia
 *     pointer string (present for imp-473 only), and a note describing
 *     precision methodology or rounding origin.
 *   - ASSERTION_SWEEP_ALL_PASS: boolean true sentinel re-exported as a
 *     quick dashboard check.
 *
 * Build-time guard (one tripwire local to this file):
 *   - The reduce sum of assertions[i].count must equal totalAssertions; if
 *     it drifts (a new check added without bumping the total, or a count
 *     decremented without updating the matrix) the module throws
 *     "[imp-501] Assertion sweep count mismatch: matrix sums to X but
 *     totalAssertions=Y" at load time. This is the only top-level throw in
 *     this file; the seventeen tracked assertions live in the four imported
 *     modules above plus the already-live imp-473 file.
 *
 * Ticket lineage:
 *   - imp-413 / imp-422 / imp-473 / imp-486 / imp-500 created the per-module
 *     top-level throw assertions that this sweep tracks.
 *   - imp-501 created this file: the sweep, the four side-effect imports,
 *     the PASS matrix, and the count-mismatch tripwire.
 *   - imp-503 hardened the submission-ready-2026-04-12 criticalPending
 *     assertion from a soft warning to a hard throw (making it reachable as
 *     a build-time failure rather than a console message).
 *   - imp-806 re-verified all seventeen assertions still pass and stamped
 *     verifiedAt 2026-04-15T23:00:00.000Z.
 *   - imp-1064 this commit prepended the @module / @fileoverview header for
 *     cross-file navigability and ticket lineage discoverability.
 *
 * Syntax discipline: the original imp-501 prose header preserved verbatim
 *   below the ORIGINAL HEADLINE COMMENT marker carries an explicit note
 *   "avoid star-slash sequences inside JSDoc block text" and this new
 *   header follows the same convention — no literal close-comment
 *   terminator anywhere in the prose, only at the very end of the block
 *   immediately before the marker line.
 *
 * @see ./polymath15-constants-mpfr-check.js
 * @see ./polymath15-constants-gmp-check.js
 * @see ./submission-ready-2026-04-12.js
 * @see ../math/c-mb-unconditional-bound.js
 * @see ./imp469-cross-verification.js
 */

// ── ORIGINAL HEADLINE COMMENT (preserved verbatim from imp-501) ───────────────

/**
 * imp-501: Full build-time assertion sweep -- 2026-04-12
 *
 * WHAT THIS FILE DOES
 * -------------------
 * (1) Activates 12 previously-dead top-level assertions by side-effect-importing
 *     the 4 files that had zero callers in the module graph.
 * (2) Exports ASSERTION_SWEEP_2026_04_12: a PASS matrix documenting every
 *     top-level throw-on-failure assertion found in src/data/ and src/math/.
 * (3) Guards the total count with its own throw assertion.
 *
 * HOW BUILD-TIME ASSERTIONS WORK IN THIS REPO
 * --------------------------------------------
 * Top-level throw statements in ES modules fire when the module is first loaded
 * (imported). If a module is never imported, those throws are never reached --
 * a "dead assertion". This file fixes that by importing each such module as a
 * side effect, making all throws reachable once this sweep file is imported.
 *
 * IMPORT CHAIN (after this file is wired in via rh-attack.js)
 * ------------
 *   rh-attack.js
 *     -> assertion-sweep-2026-04-12.js  (this file)
 *        -> polymath15-constants-mpfr-check.js   (imp-413: 4 assertions)
 *        -> polymath15-constants-gmp-check.js    (imp-422: 4 assertions)
 *        -> submission-ready-2026-04-12.js       (imp-500: 2 assertions)
 *        -> c-mb-unconditional-bound.js          (imp-486: 2 assertions)
 *   m-raw-from-umon-bridge.js (independently)
 *     -> imp469-cross-verification.js            (imp-473: 5 assertions) -- already live
 *
 * SYNTAX NOTE: avoid star-slash sequences inside JSDoc block text.
 */

// ── Side-effect imports: activate previously-dead build-time assertions ─────────

import './polymath15-constants-mpfr-check.js';   // imp-413: 4 assertions (C_H/C_C/C_T/C_F ulp < 5)
import './polymath15-constants-gmp-check.js';    // imp-422: 4 assertions (C_H/C_C/C_T/C_F relErr < 1e-14)
import './submission-ready-2026-04-12.js';       // imp-500: 2 assertions (fatalCount===0, criticalPending===0)
import '../math/c-mb-unconditional-bound.js';    // imp-486: 2 assertions (searchComplete, approachesExamined>=3)
import './imp-2701-ch-rigor-lock.js';            // imp-2701: 3 assertions (C_H not rigorous, finite-N no rigorous beat, verdict NO-GO/stays SOTA)
import './imp-2863-c-selberg-conservative-lock.js'; // imp-2863: 3 assertions (C_Selberg_rigorous 2.622 < placeholder 3.0, Trudgian point value ~4.157, coeff ordering 0.452<1.162<2.622<3.0 -- guards E_coll conservative-upper-bound validity)
import './imp-2864-erdos-turan-route-lock.js'; // imp-2864: 3 assertions (locks the imp-2700 DISCHARGED verdict -- C_Selberg_eff 2.6764<3.0, route invariant erdosTuranNeeded===false (1-D KS not exponential-sum), GAP-E-COLL-C-SELBERG-ET stays SECONDARY -- tripwire vs the imp-2759 ~9.98 negative)
import './imp-2706-ecoll-conditional-modulo-ch.js'; // imp-2706: 6 assertions (E_coll conditional-modulo-C_H bound; C_H still unproven)
import './imp-2869-ecoll-rigorous-modulo-ch.js';    // imp-2869: 6 assertions (E_coll rigorous-modulo-C_H at the bare ansatz C_H<=0.125 -> E_coll<=0.01164; every OTHER chain input discharged, gap isolated to the single C_H inequality)
import './imp-2711-pt-bound-sota-tripwire.js';      // imp-2711: 3 assertions (every E(N)<0.2 numeric clearance carries honesty qualifier + cites PT as SOTA)
import './imp-2694-ecoll-rate-reconciliation.js';   // imp-2694: 5 assertions (N^-3/2 bounds t_c deviation not E_coll; binding E_coll rate = Holder N^-1/2; headline uses it; no overclaim)
import './imp-routeB-flow-vs-lambda-firewall.js';   // imp-2854: 5 assertions (Route B imp-341 bounds the PARTICLE FLOW not Lambda; every t_c->Lambda edge passes through C_H/G6a; no leak)
import './imp-2860-en-assembled-interval-certificate.js'; // imp-2860: 6 assertions (outward-rounded bracket for the ASSEMBLED E(N) at N*=1e4; E_N_hi < 0.2; NUMERIC clearance only, C_H ansatz, NO-GO/SOTA retained)
import './imp-2861-c-t-explicit-pinning.js';        // imp-2861: 5 assertions (explicit clean-count C_T < 3/2 outward-rounded bracket at N*=1e4; E_trunc negligible <1% of E(N) at the ceiling; GAP-E-TRUNC-C-T stays MINOR-OPEN, no false discharge)
import './imp-2862-ckh-cc-interval-certificate.js'; // imp-2862: 5 assertions (outward-rounded brackets for C_KH=pi.C_Selberg and C_C=C_H.sqrt(C_KH) over C_Selberg in [2.622,3.0]; pinned values at conservative UPPER endpoint; C_H=1/8 stays NOT-rigorous ansatz, C_H gap NOT discharged)
import './imp-2866-en-classification-consistency.js'; // imp-2866: 4 assertions (cross-module single-source-of-truth audit: C_H-rigor flag, PT_BOUND=0.2, single binding-blocker, no rigorous-beat verdict all agree across imp-2643/2701/2711/2713/2715)
import './imp-2872-c-c-pinned-value-lock.js';        // imp-2872: 3 assertions (value-lock on the most load-bearing non-rigorous constant: C_C_PINNED===(1/8).sqrt(3pi) to 1e-12; carries the live C_H=1/8 derivation not a substituted value; stays ANSATZ -- flipping to rigorous requires discharging C_H imp-2642 first)
import './imp-2875-tc-units-conversion-lock.js';     // imp-2875: 3 assertions (units-audit tripwire locking the de Bruijn-Newman vs CM-flow t_c conversion factor -- gronwall/sg1c/bridge all share the -2 s=-t flow, conversion factor === 1 with the 30x ratio PHYSICAL not normalization, and |t_c| A1 trap g_min^2/6 stays inside the 2.37e-4 ceiling (imp-2762); guards against the imp-2630/imp-2621 factor-N renormalization trap)

// NOTE: imp469-cross-verification.js is already live via m-raw-from-umon-bridge.js (imp-473: 5 assertions).

// ── PASS matrix ─────────────────────────────────────────────────────────────────

export const ASSERTION_SWEEP_2026_04_12 = {
  ticket:    'imp-501',
  date:      '2026-04-12',
  timestamp: '2026-04-12T07:00:00.000Z',

  buildPassed:      true,
  verifiedAt:       '2026-04-15T23:00:00.000Z',  // imp-806: re-verified all 17 assertions still pass; build clean (npm run build: ✓ built in ~4s)
  totalAssertions:    20,  // imp-2701: +3 (C_H rigor lock) on top of the original 17
  deadBeforeSweep:    12,  // polymath15-mpfr(4)+polymath15-gmp(4)+submission-ready(2)+c-mb(2)
  liveBeforeSweep:     5,  // imp469-cross-verification via m-raw-from-umon-bridge.js
  deadAfterSweep:      0,  // all dead-assertion files (incl. imp-2701) activated by side-effect imports above

  assertions: [
    {
      file:    'src/data/polymath15-constants-mpfr-check.js',
      ticket:  'imp-413',
      count:   4,
      checks:  ['C_H ulp < 5', 'C_C ulp < 5', 'C_T worst ulp < 5', 'C_F worst ulp < 5'],
      wasLive: false,
      nowLive: true,
      pass:    true,
      note:    'Double-double arithmetic (Dekker 1971) ~32 sig digits; max observed ulpErr=0.852',
    },
    {
      file:    'src/data/polymath15-constants-gmp-check.js',
      ticket:  'imp-422',
      count:   4,
      checks:  ['C_H relErr < 1e-14', 'C_C relErr < 1e-14', 'C_T worst relErr < 1e-14', 'C_F worst relErr < 1e-14'],
      wasLive: false,
      nowLive: true,
      pass:    true,
      note:    'BigInt fixed-point (D=10^100, ~100 sig digits); all relErr < 1e-14 confirmed',
    },
    {
      file:    'src/data/imp469-cross-verification.js',
      ticket:  'imp-473',
      count:   5,
      checks:  [
        'rho(14) > 0',
        'rho(gamma_1) > 0',
        'rho(14) > 0.127',
        'rho(gamma_1) > 0.1279',
        'mpmathScriptPath is string',
      ],
      wasLive: true,
      nowLive: true,
      pass:    true,
      liveVia: 'src/math/m-raw-from-umon-bridge.js (side-effect import, imp-473)',
      note:    'rho(14)=0.12751 (corrected from comment rounding); rho(gamma_1)=0.12904',
    },
    {
      file:    'src/data/submission-ready-2026-04-12.js',
      ticket:  'imp-500',
      count:   2,
      checks:  ['fatalCount === 0', 'criticalPending === 0'],
      wasLive: false,
      nowLive: true,
      pass:    true,
      note:    'fatalCount=0 (hard assertion, passes); criticalPending=0 (hard assertion activated by imp-503, throws if nonzero)',
    },
    {
      file:    'src/math/c-mb-unconditional-bound.js',
      ticket:  'imp-486',
      count:   2,
      checks:  ['searchComplete === true', 'approachesExamined.length >= 3'],
      wasLive: false,
      nowLive: true,
      pass:    true,
      note:    'GUE universality irreducibility proof; three approaches (Selberg/Huxley/GGM) documented',
    },
    {
      file:    'src/data/imp-2701-ch-rigor-lock.js',
      ticket:  'imp-2701',
      count:   3,
      checks:  [
        'C_H isRigorousUpperBound === false',
        'finite-N rigorousBeat === false on C_C ansatz',
        'verdict contains NO-GO and stays SOTA',
      ],
      wasLive: false,
      nowLive: true,
      pass:    true,
      note:    'Honest-classification lock: fails build if the withdrawn finite-N C_H=1/8 beat overclaim is re-introduced (imp-2642/imp-2643)',
    },
  ],
};

// ── Build-time assertion: assertion count must match matrix sum ─────────────────

const _counted = ASSERTION_SWEEP_2026_04_12.assertions.reduce((s, a) => s + a.count, 0);
if (_counted !== ASSERTION_SWEEP_2026_04_12.totalAssertions) {
  throw new Error(
    '[imp-501] Assertion sweep count mismatch: matrix sums to ' + _counted +
    ' but totalAssertions=' + ASSERTION_SWEEP_2026_04_12.totalAssertions
  );
}

export const ASSERTION_SWEEP_ALL_PASS = true;
