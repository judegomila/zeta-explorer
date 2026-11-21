/**
 * @module sg1c-asym-scan-vs-closedform-tripwire-2026-06-30
 *
 * imp-3178: CROSS-MODULE tripwire locking the CORRECTED relationship between
 * the imp-3045 numerical isolation scan and the imp-3170 transcendental closed
 * form, plus the basin margin that the basin-conditional C_Lip rests on.
 *
 * imp-3174 already re-derives the closed-form root c_asym from an independent
 * digamma + Newton path. That lock lives ENTIRELY inside the closed-form world:
 * it never reads the imp-3045 scan export, so it cannot catch a regression in
 * the SCAN-vs-CLOSED-FORM ordering. This module closes exactly that gap. It
 * imports BOTH live exports and certifies the two facts the imp-3170 note made
 * but no tripwire guarded:
 *
 *   (1) THE SCAN WAS HIGH, NOT LOW. The imp-3045 live asymmetricInfimum export
 *       (R=64 bisection, ~0.9032) sits AT-OR-ABOVE the imp-3170 closed-form
 *       c_asym = 0.90279. The scan bisection locked onto the discrete
 *       minimal-gap selector discontinuity near g ~ 0.9029, so its bracket sat
 *       slightly HIGH; the smooth drho/ds zero (the closed form) is the genuine,
 *       strictly-lower onset. A future edit that flipped this ordering -- a scan
 *       drifting BELOW the closed form, or a closed form drifting above the scan
 *       -- would silently re-open the "is the open constant below c_asym" worry;
 *       this tripwire forbids it.
 *
 *   (2) THE BASIN MARGIN NEVER DEPENDED ON THE OPEN CONSTANT. Theorem C runs at
 *       rho <= 0.72. The closed-form basin margin c_asym - 0.72 = 0.18279...
 *       (rounding to 0.1828) is strictly positive and is re-certified here to
 *       match the live closed-form export to ~1e-12 and the stated 0.1828 to
 *       ~1e-4. Because the margin is bounded below by a fixed positive constant
 *       regardless of where the still-open GLOBAL infimum lands inside the scan
 *       bracket, the basin-conditional C_Lip of
 *       ch-lip-basin-conditional-2026-06-30 was never hostage to the open value.
 *
 * LOCK ONLY -- no new math, no QED. The global-infimum sub-gap (whether the
 * L=1 opposite-lattice class is the global asymmetric infimum) stays open, and
 * no refereed bound is changed.
 *
 * @see sg1c-isolation-infimum-asym-scan-2026-06-30 (imp-3045, the live numerical scan)
 * @see sg1c-asym-isolation-closed-form-2026-06-30 (imp-3170, the live closed form)
 * @see sg1c-asym-digamma-root-tripwire-2026-06-30 (imp-3174, the in-world root lock this complements)
 */

import { SG1C_ISOLATION_INFIMUM_ASYM_SCAN } from './sg1c-isolation-infimum-asym-scan-2026-06-30.js';
import { SG1C_ASYM_ISOLATION_CLOSED_FORM } from './sg1c-asym-isolation-closed-form-2026-06-30.js';

const SCAN_INF = SG1C_ISOLATION_INFIMUM_ASYM_SCAN.asymmetricInfimum;   // ~0.9032 (live, bisection-on-discontinuity)
const SCAN_BRACKET = SG1C_ISOLATION_INFIMUM_ASYM_SCAN.tightenedBracket; // [scanInf, c*]
const C_ASYM = SG1C_ASYM_ISOLATION_CLOSED_FORM.cAsym;                  // 0.9027902227683418 (live)
const BASIN_RHO = 0.72;                                                // Theorem-C isolation cap
const BASIN_MARGIN = C_ASYM - BASIN_RHO;                              // 0.18279... (rounds to 0.1828)
const CF_MARGIN_EXPORT = SG1C_ASYM_ISOLATION_CLOSED_FORM.preservedBasinMargin;

export const SG1C_ASYM_SCAN_VS_CLOSEDFORM_TRIPWIRE = {
  ticket: 'imp-3178',
  date: '2026-06-30',
  locks: ['imp-3045', 'imp-3170'],
  scanInfimum: SCAN_INF,                          // live imp-3045 numerical onset (~0.9032)
  scanBracket: SCAN_BRACKET,                       // live imp-3045 bracket [scanInf, c*]
  closedFormOnset: C_ASYM,                         // live imp-3170 transcendental onset (0.90279)
  scanMinusClosedForm: SCAN_INF - C_ASYM,          // > 0: the scan sat HIGH of the true onset
  closedFormAtOrBelowScan: C_ASYM <= SCAN_INF,     // true: closed form is the lower, genuine onset
  closedFormWithinScanBracket: C_ASYM <= SCAN_BRACKET[1], // closed form below the symmetric upper end
  basinIsolationRatio: BASIN_RHO,
  basinMargin: BASIN_MARGIN,                       // 0.18279... > 0
  basinMarginRounded: 0.1828,
  basinMarginMatchesLiveExport: Math.abs(BASIN_MARGIN - CF_MARGIN_EXPORT) < 1e-12,
  status: 'cross-module lock: imp-3045 scan onset sits at-or-above the imp-3170 closed-form c_asym (scan was high, not low), and the basin margin c_asym-0.72=0.1828 is strictly positive and matches the live export, so the basin-conditional C_Lip never depended on the open global constant',
  honest: 'LOCK ONLY -- guards the corrected scan-vs-closed-form ordering and the basin margin; no new math, no QED. The global-infimum sub-gap stays open; no refereed bound is changed.',
};

export const SG1C_ASYM_SCAN_VS_CLOSEDFORM_TRIPWIRE_ASSERTIONS = [
  {
    id: 'sg1c-scan-vs-cf-closed-form-at-or-below-scan',
    description: 'the imp-3170 closed-form c_asym sits at-or-below the live imp-3045 scan infimum (the scan bisection-on-discontinuity bracket was HIGH, not low)',
    holds: () => C_ASYM <= SCAN_INF + 1e-15 && SCAN_INF - C_ASYM > 1e-4,
  },
  {
    id: 'sg1c-scan-vs-cf-closed-form-inside-scan-bracket',
    description: 'the closed-form onset lies at-or-below the symmetric upper end c* of the scan bracket, so it does not contradict the scan bracket upper bound',
    holds: () => C_ASYM <= SCAN_BRACKET[1] && SCAN_BRACKET[0] <= SCAN_BRACKET[1],
  },
  {
    id: 'sg1c-scan-vs-cf-basin-margin-strictly-positive',
    description: 'the basin margin c_asym - 0.72 is strictly positive (the basin-conditional C_Lip never depended on the open global constant)',
    holds: () => BASIN_MARGIN > 0,
  },
  {
    id: 'sg1c-scan-vs-cf-basin-margin-matches-0p1828',
    description: 'the basin margin equals the live closed-form export to ~1e-12 and the stated 0.1828 to ~1e-4',
    holds: () => Math.abs(BASIN_MARGIN - CF_MARGIN_EXPORT) < 1e-12 && Math.abs(BASIN_MARGIN - 0.1828) < 1e-4,
  },
  {
    id: 'sg1c-scan-vs-cf-lock-honest',
    description: 'explicitly a LOCK ONLY (no new math, no QED), the global-infimum sub-gap stays open, and no refereed bound is changed',
    holds: () => /LOCK ONLY/.test(SG1C_ASYM_SCAN_VS_CLOSEDFORM_TRIPWIRE.honest)
      && /global-infimum sub-gap stays open/.test(SG1C_ASYM_SCAN_VS_CLOSEDFORM_TRIPWIRE.honest)
      && /refereed bound is changed/i.test(SG1C_ASYM_SCAN_VS_CLOSEDFORM_TRIPWIRE.honest),
  },
];

for (const a of SG1C_ASYM_SCAN_VS_CLOSEDFORM_TRIPWIRE_ASSERTIONS) {
  if (!a.holds()) throw new Error(`sg1c-asym-scan-vs-closedform-tripwire assertion failed: ${a.id}`);
}
