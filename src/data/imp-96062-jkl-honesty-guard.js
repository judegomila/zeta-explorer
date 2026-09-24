/**
 * @module imp-96062-jkl-honesty-guard
 * @description imp-96062: overclaim-registry guard for the 2026-09-23 rh-routes-jkl-non-statmech
 * batch (Route J / K / L), mirroring the imp-96134 standalone-guard pattern.
 *
 * The source module's own RH_ROUTES_JKL_ASSERTIONS array checks that specific baked numbers
 * reproduce and that RH_ROUTES_JKL.status keeps "RH open" / "NO QED", but it never scans each
 * route's own top-level `verdict` text or the `wallMap` entries for a PROMOTION word -- language
 * that would flip a "no lever found" measurement into a claimed bound or a claimed proof of RH.
 * This guard closes that gap: it imports ROUTE_J, ROUTE_K, ROUTE_L, and RH_ROUTES_JKL directly and
 * asserts none of their verdict/wall fields have been edited to read as promoted.
 *
 * Import-light: the source module imports only the import-light imp-2426 Li module, so this guard
 * carries no zeros-bundle dependency either.
 */

import {
  ROUTE_J,
  ROUTE_K,
  ROUTE_L,
  RH_ROUTES_JKL,
} from './rh-routes-jkl-non-statmech-external-input-hunt-2026-09-23.js';

// Each entry is a {id, text} pair for one verdict/wall field this guard watches.
const GUARDED_FIELDS = [
  { id: 'route-J-verdict', text: ROUTE_J.verdict },
  { id: 'route-K-verdict', text: ROUTE_K.verdict },
  { id: 'route-L-verdict', text: ROUTE_L.verdict },
  { id: 'wallmap-J', text: RH_ROUTES_JKL.wallMap.J },
  { id: 'wallmap-K', text: RH_ROUTES_JKL.wallMap.K },
  { id: 'wallmap-L', text: RH_ROUTES_JKL.wallMap.L },
];

// Promotion words that would flip a "wall hit / no lever" verdict into a claimed bound or proof.
const PROMOTION_RE = /\b(RIGOROUS|RH[- ]follows|RH is (?:true|proven|resolved)|proves? RH|unconditional(?:ly)? (?:establishes|proves))\b/i;

export const IMP_96062_JKL_HONESTY_GUARD_ASSERTIONS = GUARDED_FIELDS.flatMap(({ id, text }) => [
  {
    id: `${id}-no-promotion`,
    holds: () => !PROMOTION_RE.test(text),
    why: `${id} must never be promoted to RIGOROUS / RH-follows / a proof of RH -- it stays a wall hit, not a lever`,
  },
]);

// The three route-level verdicts must each keep asserting RH is open (the wallMap entries are
// short wall descriptors and are not expected to restate this).
export const IMP_96062_JKL_ROUTE_VERDICTS_KEEP_RH_OPEN_ASSERTIONS = [
  { id: 'route-J-verdict-keeps-rh-open', holds: () => /RH open/.test(ROUTE_J.verdict), why: 'Route J verdict must keep stating RH open' },
  { id: 'route-K-verdict-keeps-rh-open', holds: () => /RH open/.test(ROUTE_K.verdict), why: 'Route K verdict must keep stating RH open' },
  { id: 'route-L-verdict-keeps-rh-open', holds: () => /RH open/.test(ROUTE_L.verdict), why: 'Route L verdict must keep stating RH open' },
];

for (const a of [
  ...IMP_96062_JKL_HONESTY_GUARD_ASSERTIONS,
  ...IMP_96062_JKL_ROUTE_VERDICTS_KEEP_RH_OPEN_ASSERTIONS,
]) {
  if (!a.holds()) {
    throw new Error(`imp-96062-jkl-honesty-guard assertion failed: ${a.id}`);
  }
}
