/**
 * @module imp-96099-route-i-sonine-honesty-guard
 * @description imp-96099: overclaim-registry guard for the 2026-09-23 Route I Sonine/pencil
 * pair (rh-route-i-semilocal-sonine-trace-identity, rh-route-i-pencil-highres-map), mirroring
 * the imp-96062 standalone-guard pattern.
 *
 * Both source modules already carry their own inline verdict-honesty assertion, but nothing
 * watches the OTHER prose fields (correction, verdict, forTheProof, honestLimits) that state the
 * central finding: the semilocal trace identity Arch - P_2 = L_S - D_S is EXACT and its trace
 * side is unconditionally positive, but D_S is explicit and nonzero, so Weil positivity on
 * g-support < ln 3 is the INEQUALITY D_S <= L_S on pole-free test functions, not an identity
 * between the two sides. This guard closes that gap: it imports the two modules' exported
 * verdict objects and asserts that (a) both keep stating RH open, (b) both keep "NO QED" and
 * never use QED standing alone, (c) the inequality-not-identity framing (D_S <= L_S, D_S
 * explicit/nonzero) survives verbatim, and (d) no field has been promoted to a claimed bound or
 * proof of RH.
 *
 * Import-light: both source modules import only the import-light Route H Galerkin assembly, so
 * this guard carries no zeros-bundle dependency either.
 */

import { RH_ROUTE_I_SEMILOCAL_SONINE_TRACE } from './rh-route-i-semilocal-sonine-trace-identity-2026-09-23.js';
import { RH_ROUTE_I_PENCIL_HIGHRES_MAP } from './rh-route-i-pencil-highres-map-2026-09-23.js';

// Each entry is a {id, text} pair for one verdict-bearing field this guard watches.
const GUARDED_FIELDS = [
  { id: 'sonine-status', text: RH_ROUTE_I_SEMILOCAL_SONINE_TRACE.status },
  { id: 'sonine-correction', text: RH_ROUTE_I_SEMILOCAL_SONINE_TRACE.correction },
  { id: 'sonine-verdict', text: RH_ROUTE_I_SEMILOCAL_SONINE_TRACE.verdict },
  { id: 'sonine-honestLimits', text: RH_ROUTE_I_SEMILOCAL_SONINE_TRACE.honestLimits },
  { id: 'pencil-status', text: RH_ROUTE_I_PENCIL_HIGHRES_MAP.status },
  { id: 'pencil-forTheProof', text: RH_ROUTE_I_PENCIL_HIGHRES_MAP.forTheProof },
  { id: 'pencil-honestLimits', text: RH_ROUTE_I_PENCIL_HIGHRES_MAP.honestLimits },
];

// Promotion words that would flip an inequality/measurement into a claimed bound or proof of RH.
const PROMOTION_RE = /\b(RIGOROUS|RH[- ]follows|RH is (?:true|proven|resolved)|proves? RH|unconditional(?:ly)? (?:establishes|proves)|gap[- ]free identity holds|identity closes the gap)\b/i;

export const IMP_96099_ROUTE_I_SONINE_HONESTY_GUARD_ASSERTIONS = GUARDED_FIELDS.flatMap(
  ({ id, text }) => [
    {
      id: `${id}-no-promotion`,
      holds: () => !PROMOTION_RE.test(text),
      why: `${id} must never be promoted to RIGOROUS / RH-follows / a gap-free identity / a proof of RH`,
    },
  ],
);

// The two top-level status fields must each keep RH open / NO QED verbatim.
export const IMP_96099_ROUTE_I_STATUS_KEEP_RH_OPEN_ASSERTIONS = [
  {
    id: 'sonine-status-keeps-rh-open',
    holds: () => /RH open/.test(RH_ROUTE_I_SEMILOCAL_SONINE_TRACE.status),
    why: 'the semilocal Sonine trace identity status must keep stating RH open',
  },
  {
    id: 'sonine-status-keeps-no-qed',
    holds: () => {
      const text = RH_ROUTE_I_SEMILOCAL_SONINE_TRACE.status;
      const qed = (text.match(/QED/g) || []).length, noQed = (text.match(/NO QED/g) || []).length;
      return noQed >= 1 && qed === noQed;
    },
    why: 'the semilocal Sonine trace identity status must keep "NO QED" and never use QED standing alone',
  },
  {
    id: 'pencil-status-keeps-rh-open',
    holds: () => /RH open/.test(RH_ROUTE_I_PENCIL_HIGHRES_MAP.status),
    why: 'the pencil highres-map status must keep stating RH open',
  },
  {
    id: 'pencil-status-keeps-no-qed',
    holds: () => {
      const text = RH_ROUTE_I_PENCIL_HIGHRES_MAP.status;
      const qed = (text.match(/QED/g) || []).length, noQed = (text.match(/NO QED/g) || []).length;
      return noQed >= 1 && qed === noQed;
    },
    why: 'the pencil highres-map status must keep "NO QED" and never use QED standing alone',
  },
];

// The inequality-not-identity framing must survive: D_S is explicit/nonzero and Weil positivity
// on g-support < ln 3 is the comparison D_S <= L_S, not an unconditional identity between the sides.
export const IMP_96099_ROUTE_I_INEQUALITY_NOT_IDENTITY_ASSERTIONS = [
  {
    id: 'sonine-status-keeps-no-gap-free-identity',
    holds: () => /no gap-free identity/.test(RH_ROUTE_I_SEMILOCAL_SONINE_TRACE.status)
      && /D_S <= L_S/.test(RH_ROUTE_I_SEMILOCAL_SONINE_TRACE.status),
    why: 'the semilocal Sonine trace identity status must keep recording NO gap-free identity, with Weil positivity read as the inequality D_S <= L_S',
  },
  {
    id: 'sonine-correction-keeps-comparison-not-identity',
    holds: () => /D_S <= L_S/.test(RH_ROUTE_I_SEMILOCAL_SONINE_TRACE.correction)
      && /UNCONDITIONALLY/.test(RH_ROUTE_I_SEMILOCAL_SONINE_TRACE.correction),
    why: 'the correction field must keep the trace side positive UNCONDITIONALLY while the RH content stays the comparison D_S <= L_S, not an identity',
  },
  {
    id: 'pencil-forTheProof-keeps-inequality-with-finite-margin',
    holds: () => /D_S <= L_S/.test(RH_ROUTE_I_PENCIL_HIGHRES_MAP.forTheProof)
      && /FALSE for 2a/.test(RH_ROUTE_I_PENCIL_HIGHRES_MAP.forTheProof),
    why: 'the pencil forTheProof field must keep recording D_S <= L_S as true only up to a finite support and FALSE past it, not a support-free identity',
  },
];

for (const a of [
  ...IMP_96099_ROUTE_I_SONINE_HONESTY_GUARD_ASSERTIONS,
  ...IMP_96099_ROUTE_I_STATUS_KEEP_RH_OPEN_ASSERTIONS,
  ...IMP_96099_ROUTE_I_INEQUALITY_NOT_IDENTITY_ASSERTIONS,
]) {
  if (!a.holds()) {
    throw new Error(`imp-96099-route-i-sonine-honesty-guard assertion failed: ${a.id}`);
  }
}
