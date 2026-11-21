/**
 * @module imp-95448-ra-ladder-input-data-audit
 * @fileoverview imp-95448 -- import-light DATA AUDIT of part (a) of the imp-95372
 *   three-part R_A residual: the ZETA_ZEROS / Odlyzko provenance and numerical
 *   stability of the ladder inputs (M_infty(N) and the t_c(N) reconstruction)
 *   that feed the transfer inequality limsup_N |t_c^proxy(N)| = 0 -> |t_c(N)|.
 *   imp-95372 booked part (a) as "open"; this module AUDITS the actual repo
 *   state of those inputs and reconciles that booking with the imp-2563 data
 *   work. ASSESSMENT/AUDIT ONLY: it derives NO bound, closes NO leg, fires NO
 *   certificate, and does NOT re-point any consumer. R_A remains OPEN and
 *   no refereed bound is changed.
 *
 *   THE TWO LADDER INPUTS UNDER AUDIT
 *   -----------------------------------------------
 *   M_infty(N)  -- the strip-Jacobian / Stieltjes-transform functional whose
 *                  reciprocal is the proxy t_c^proxy(N) = 1/(2 M_infty(N))
 *                  (imp-1149 STEP 5). Its unconditional lower bound is the
 *                  ATOMIC self-term M_infty(N) >= sqrt(N/(2 pi)) (RvM counting +
 *                  Trudgian C_Selberg = 3).
 *   t_c(N)      -- the physical first-collision time, reconstructed from the
 *                  recorded Odlyzko ordinates either by the RK4 backward-Dyson
 *                  ladder (PATH_C_BASELINE_FIT) or, exactly, by the imp-2563
 *                  S4-3 heat-semigroup discriminant (no ODE stepping, no
 *                  collision threshold).
 *
 *   Q(a1) -- PROVENANCE: what data do the ladder inputs actually read?
 *   -----------------------------------------------
 *   Both inputs are functionals of the recorded nontrivial-zeta ordinates.
 *   The build-light rungs read ZETA_ZEROS (src/math/zeta.js, the 870-entry
 *   Odlyzko table), cross-checked against the canonical 1e6-ordinate Odlyzko
 *   table ZEROS_EXTENDED (src/data/zeros-to-1e6.js). ZETA_ZEROS was found
 *   CORRUPT from index 650 onward (onset gamma_650 ~ 1001.35; every ordinate
 *   shifted upward) by the imp-2563 corruption audit, and REPAIRED on
 *   2026-06-11 (imp-2563-sub-data-audit-fix, status closed): indices 650..869
 *   were replaced with the canonical ZEROS_EXTENDED slice and the repair is
 *   pinned by a build-time tripwire (imp-2563-zeta-zeros-corruption-audit.js).
 *   So the provenance of the ladder inputs is now the audited Odlyzko table.
 *
 *   Q(a2) -- EXPOSURE: which rungs ever touched the corrupt block?
 *   -----------------------------------------------
 *   The Path C fit uses N in {50, 100, 200, 500, 2458}. The four LOW-N rungs
 *   (N <= 500) consumed only ZETA_ZEROS indices < 650 -- the corruption-clean
 *   prefix -- so they were NEVER contaminated (imp-2563-pathc-exact-tc-ladder).
 *   Only the single HIGH-N lever-arm rung N = 2458 read the formerly-corrupt
 *   indices 650..869 (plus Riemann-Siegel-extended ordinates beyond the
 *   870-entry table); it is now on the repaired data, but its EXACT heat-method
 *   recompute (a degree-2458 discriminant) is too heavy for a build module and
 *   stays NAMED as the residual imp-2563-sub-pathc-ladder-replace-highN.
 *
 *   Q(a3) -- STABILITY: is the t_c(N) reconstruction numerically stable?
 *   -----------------------------------------------
 *   M_infty(N): the audit-relevant quantity is its unconditional lower bound
 *   sqrt(N/(2 pi)), which is a closed-form counting bound with NO data-table
 *   exposure -- numerically stable by construction. t_c(N): the RK4 ladder
 *   carries an integrator step-size / collision-threshold discretization error
 *   (imp-314/imp-315), which the imp-2563 S4-3 EXACT heat-semigroup ladder
 *   removes in principle (machine-precision, grid-limited only); heat-vs-RK4
 *   agreement is witnessed at N = 8, and the imp-2605 neighbour perturbation
 *   factor is validated in [1.06, 1.19] across all five exact low-N rungs.
 *
 *   AUDIT VERDICT (part a)
 *   -----------------------------------------------
 *   Part (a) -- the ZETA_ZEROS / Odlyzko data audit -- has in fact been
 *   DELIVERED (detection + repair) by the imp-2563 line, so the imp-95372
 *   booking that lists part (a) simply "open" is STALE relative to that repair.
 *   The genuinely-remaining data-side item is NARROWER than a full audit: only
 *   the single high-N exact recompute (imp-2563-sub-pathc-ladder-replace-highN)
 *   is unexecuted, and M_infty's audit-relevant bound has no data exposure at
 *   all. This is a provenance/stability AUDIT: it moves NO bound, closes NO leg
 *   (R_A stays open via parts b/c and the high-N residual), and even a fully
 *   audited ladder is INERT for Lambda while imp-2621 (refuted amplified rate)
 *   and imp-35164 (E(N) does not vanish) stand. NO QED. No refereed bound is changed.
 *
 * @see src/data/imp-95372-ra-proxy-true-gap-assessment.js (parent: R_A three
 *   questions; books part (a) as the Odlyzko data audit)
 * @see src/data/imp-2563-zeta-zeros-corruption-audit.js (ZETA_ZEROS corruption
 *   detection + repair pin)
 * @see src/data/imp-2563-pathc-exact-tc-ladder.js (exact t_c ladder; low-N
 *   clean prefix vs the N=2458 high-N residual)
 * @see src/data/imp-2603-imp1149-meanfield-proxy-regrade.js (Theorem-3 re-grade)
 *
 * Ticket: imp-95448 (accuracy, medium). Audit only; establishes no new bound;
 * closes no leg; fires no certificate; NO QED; no refereed bound is changed.
 */

// ---------------------------------------------------------------------------
// Baked reference constants (literals; no import of the heavy zeros bundle).
// ---------------------------------------------------------------------------
// Corruption boundary of the pre-repair ZETA_ZEROS table (imp-2563 audit):
const LAST_GOOD_INDEX = 649;        // gamma_649 = 1001.349482638 (last clean)
const CORRUPTION_ONSET_INDEX = 650; // gamma_650 truth 1002.404305488
// Path C fit rungs and the index each highest-ordinate reads (N-th zero at
// index N-1); the four low rungs sit strictly below the corruption boundary,
// the single high rung crosses it:
const PATH_C_RUNGS = Object.freeze([50, 100, 200, 500, 2458]);
const CLEAN_RUNG_MAX = 500;         // rungs <= this read indices < 650 (clean)
const HIGH_N_RUNG = 2458;           // the only rung that read indices 650..869
// M_infty unconditional atomic self-term lower bound (no data exposure):
const mInftyAtomicLB = (N) => Math.sqrt(N / (2 * Math.PI));
const proxyUB = (N) => 1 / (2 * mInftyAtomicLB(N)); // = sqrt(pi/(2N))
// imp-2605 neighbour-perturbation O(1) factor validated across low-N rungs:
const NEIGHBOUR_FACTOR_RANGE = Object.freeze([1.06, 1.19]);

const LADDER_INPUT_AUDIT = Object.freeze([
  Object.freeze({
    key: 'provenance-zeta-zeros-repaired',
    input: 'both (M_infty, t_c) via recorded Odlyzko ordinates',
    what:
      'ZETA_ZEROS (870-entry Odlyzko table) was corrupt from index 650 ' +
      '(gamma ~ 1001.35) and REPAIRED 2026-06-11 (imp-2563-sub-data-audit-fix, ' +
      'closed) against the canonical ZEROS_EXTENDED slice; repair pinned by a ' +
      'build-time tripwire.',
    verdict: 'delivered',
  }),
  Object.freeze({
    key: 'exposure-lowN-clean-highN-residual',
    input: 't_c(N) reconstruction',
    what:
      'Low-N rungs N <= 500 read only indices < 650 (never contaminated); the ' +
      'single high-N rung N = 2458 read the formerly-corrupt block 650..869 ' +
      '(now repaired) but its EXACT recompute stays named as ' +
      'imp-2563-sub-pathc-ladder-replace-highN.',
    verdict: 'narrowed-residual',
  }),
  Object.freeze({
    key: 'stability-minfty-no-data-exposure',
    input: 'M_infty(N)',
    what:
      'The audit-relevant M_infty lower bound sqrt(N/(2 pi)) is a closed-form ' +
      'counting bound with NO data-table exposure; numerically stable by ' +
      'construction (RvM + Trudgian C_Selberg = 3).',
    verdict: 'no-data-exposure',
  }),
  Object.freeze({
    key: 'stability-tc-exact-vs-rk4',
    input: 't_c(N) reconstruction',
    what:
      'The RK4 ladder carries a step-size / collision-threshold discretization ' +
      'error; the imp-2563 S4-3 EXACT heat-semigroup discriminant removes it in ' +
      'principle (heat-vs-RK4 witnessed at N = 8; imp-2605 neighbour factor in ' +
      '[1.06, 1.19] across all five exact low-N rungs).',
    verdict: 'stable-exact-method-available',
  }),
]);

export const IMP95448_RA_LADDER_INPUT_DATA_AUDIT = Object.freeze({
  id: 'imp-95448',
  proofSection: 'S-frontier',
  scopes: 'part (a) of the imp-95372 R_A residual: Odlyzko data audit of the ladder inputs',
  glosses: 'imp-95372',
  ladderInputs: Object.freeze({
    mInfty:
      'M_infty(N) = strip-Jacobian / Stieltjes-transform functional; ' +
      'audit-relevant unconditional lower bound sqrt(N/(2 pi)).',
    tC:
      't_c(N) = physical first-collision time, reconstructed from recorded ' +
      'Odlyzko ordinates by the RK4 ladder or the exact heat-semigroup ' +
      'discriminant (imp-2563 S4-3).',
  }),
  // Q(a1) provenance
  provenance:
    'Both ladder inputs read the recorded Odlyzko ordinates (ZETA_ZEROS, ' +
    'cross-checked vs the 1e6-ordinate ZEROS_EXTENDED). ZETA_ZEROS was corrupt ' +
    'from index 650 and REPAIRED 2026-06-11 (imp-2563-sub-data-audit-fix, ' +
    'closed); the repair is pinned by a build-time tripwire.',
  corruptionBoundary: Object.freeze({
    lastGoodIndex: LAST_GOOD_INDEX,
    corruptionOnsetIndex: CORRUPTION_ONSET_INDEX,
  }),
  // Q(a2) exposure
  exposure:
    'Path C rungs {50,100,200,500,2458}: the four low-N rungs (N <= 500) read ' +
    'only indices < 650 (corruption-clean prefix, never contaminated); only ' +
    'the high-N rung N = 2458 read the formerly-corrupt block 650..869, now on ' +
    'repaired data with the exact recompute named as ' +
    'imp-2563-sub-pathc-ladder-replace-highN.',
  pathCRungs: PATH_C_RUNGS,
  cleanRungMax: CLEAN_RUNG_MAX,
  highNRung: HIGH_N_RUNG,
  // Q(a3) stability
  stability:
    'M_infty audit-relevant bound sqrt(N/(2 pi)) has no data-table exposure ' +
    '(closed-form, stable). t_c RK4 discretization error is removed in ' +
    'principle by the exact heat-semigroup ladder (heat-vs-RK4 at N = 8; ' +
    'imp-2605 neighbour factor in [1.06, 1.19]).',
  neighbourFactorRange: NEIGHBOUR_FACTOR_RANGE,
  ladderInputAudit: LADDER_INPUT_AUDIT,
  // Verdict
  partAWasAlreadyDelivered: true,
  imp95372PartABookingStale: true,
  narrowedDataResidual: 'imp-2563-sub-pathc-ladder-replace-highN (single high-N exact recompute)',
  closingPartAProducesLambdaBound: false,
  anyEnclosureEstablished: false,
  legStillOpen: 'imp-2563 R_A (proxy-vs-true identification)',
  verdict:
    'AUDIT ONLY (no proof). Part (a) of the imp-95372 R_A residual -- the ' +
    'ZETA_ZEROS/Odlyzko data audit of the ladder inputs -- has in fact been ' +
    'DELIVERED (detection + repair) by the imp-2563 line, so the imp-95372 ' +
    'booking that lists part (a) as simply "open" is STALE. The genuine ' +
    'remaining data-side item is narrower: only the single high-N exact ' +
    'recompute (imp-2563-sub-pathc-ladder-replace-highN) is unexecuted, and ' +
    'M_infty audit-relevant bound sqrt(N/(2 pi)) has no data-table exposure at ' +
    'all. This is a provenance/stability audit: it moves NO bound, closes NO ' +
    'leg (R_A stays open via parts b/c and the high-N residual), and even a ' +
    'fully audited ladder is INERT for Lambda while imp-2621 (refuted amplified ' +
    'rate) and imp-35164 (E(N) does not vanish) stand. No refereed bound is changed' +
    '.',
  citation:
    'imp-95372-ra-proxy-true-gap-assessment.js (parent, books part a); ' +
    'imp-2563-zeta-zeros-corruption-audit.js (corruption detection + repair); ' +
    'imp-2563-pathc-exact-tc-ladder.js (low-N clean prefix vs N=2458 residual); ' +
    'imp-2603-imp1149-meanfield-proxy-regrade.js (Theorem-3 re-grade).',
});

export default IMP95448_RA_LADDER_INPUT_DATA_AUDIT;

// -- Tripwire assertions ------------------------------------------------------
export const IMP95448_RA_LADDER_INPUT_DATA_AUDIT_ASSERTIONS = [
  {
    id: 'imp95448-provenance-repaired-boundary',
    why:
      'Q(a1): the ladder-input provenance must record the repaired ZETA_ZEROS ' +
      'corruption boundary (last good index 649, onset 650) and that the ' +
      'repair is delivered.',
    holds: () => {
      const a = IMP95448_RA_LADDER_INPUT_DATA_AUDIT;
      return (
        a.corruptionBoundary.lastGoodIndex === 649 &&
        a.corruptionBoundary.corruptionOnsetIndex === 650 &&
        /REPAIRED/.test(a.provenance) &&
        a.partAWasAlreadyDelivered === true
      );
    },
  },
  {
    id: 'imp95448-exposure-lowN-clean-highN-crosses',
    why:
      'Q(a2): the four low-N Path C rungs (N <= 500) sit below the corruption ' +
      'onset while the single high-N rung N = 2458 crosses it; cross-check the ' +
      'baked rung set against the boundary arithmetic (N-th zero at index N-1).',
    holds: () => {
      const a = IMP95448_RA_LADDER_INPUT_DATA_AUDIT;
      const clean = a.pathCRungs.filter((N) => N <= a.cleanRungMax);
      const crossing = a.pathCRungs.filter((N) => N > a.cleanRungMax);
      // every clean rung reads a top index strictly below the onset:
      const cleanBelow = clean.every((N) => N - 1 < a.corruptionBoundary.corruptionOnsetIndex);
      // the single crossing rung reads a top index at/above the onset:
      const crossesAbove =
        crossing.length === 1 &&
        crossing[0] === a.highNRung &&
        a.highNRung - 1 >= a.corruptionBoundary.corruptionOnsetIndex;
      return clean.length === 4 && cleanBelow && crossesAbove;
    },
  },
  {
    id: 'imp95448-minfty-no-data-exposure-stable',
    why:
      'Q(a3): the audit-relevant M_infty lower bound sqrt(N/(2 pi)) is a ' +
      'closed-form counting bound; cross-check its reciprocal proxy = ' +
      'sqrt(pi/(2N)) is finite, positive and strictly decreasing (stable, no ' +
      'data-table lookup).',
    holds: () => {
      let prev = Infinity;
      for (const N of [1e2, 1e3, 1e4, 1e5, 1e6]) {
        const v = proxyUB(N);
        if (!(v > 0 && Number.isFinite(v) && v < prev)) return false;
        if (Math.abs(v - Math.sqrt(Math.PI / (2 * N))) > 1e-12) return false;
        prev = v;
      }
      return true;
    },
  },
  {
    id: 'imp95448-tc-neighbour-factor-in-range',
    why:
      'Q(a3): the imp-2605 neighbour-perturbation factor validating the exact ' +
      't_c ladder must be recorded as the O(1) window [1.06, 1.19] (a genuine ' +
      'O(1) band strictly above 1, below 2).',
    holds: () => {
      const [lo, hi] = IMP95448_RA_LADDER_INPUT_DATA_AUDIT.neighbourFactorRange;
      return lo > 1 && hi < 2 && lo < hi && Math.abs(lo - 1.06) < 1e-12 && Math.abs(hi - 1.19) < 1e-12;
    },
  },
  {
    id: 'imp95448-audit-only-no-lambda-bound',
    why:
      'The core disentangling: part (a) is delivered/narrowed but closing it ' +
      'produces NO Lambda bound; the fatal walls (imp-2621, imp-35164) are ' +
      'named in the verdict and the narrowed residual is recorded.',
    holds: () => {
      const a = IMP95448_RA_LADDER_INPUT_DATA_AUDIT;
      return (
        a.closingPartAProducesLambdaBound === false &&
        a.imp95372PartABookingStale === true &&
        /imp-2563-sub-pathc-ladder-replace-highN/.test(a.narrowedDataResidual) &&
        /imp-2621/.test(a.verdict) &&
        /imp-35164/.test(a.verdict) &&
        a.ladderInputAudit.length === 4
      );
    },
  },
  {
    id: 'imp95448-honesty-gate-no-qed',
    why:
      'Audit only: no enclosure established, leg still open, no-refereed-bound-change line ' +
      'present, scopes part (a) and glosses imp-95372.',
    holds: () => {
      const a = IMP95448_RA_LADDER_INPUT_DATA_AUDIT;
      return (
        a.anyEnclosureEstablished === false &&
        /refereed bound is changed/i.test(a.verdict) &&
        a.glosses === 'imp-95372' &&
        /R_A/.test(a.legStillOpen) &&
        /part \(a\)/.test(a.scopes)
      );
    },
  },
];

for (const assertion of IMP95448_RA_LADDER_INPUT_DATA_AUDIT_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-95448-ra-ladder-input-data-audit assertion failed: ${assertion.id}`
    );
  }
}
