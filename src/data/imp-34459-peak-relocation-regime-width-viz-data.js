/**
 * @module imp-34459-peak-relocation-regime-width-viz-data
 * @fileoverview imp-34459 -- VIZ DATA ONLY for the imp-34369 peak-relocation regime-width finding:
 *   the imp-34085 |trough|/|peak| OLS amplitude ratio peaks at 0.9072 at the last endpoint-locked
 *   width w = 9.25, then the argmax peak RELOCATES off the receding right endpoint to the near-left
 *   rung k = 6.5 the instant the discrete k = 15.5 rung is added (w* = 9.5). Because the imp-33810
 *   ladder is quantized at dk = 0.25, the migration width is not a continuously-resolvable threshold
 *   -- it is bracketed to the HALF-OPEN rung interval (9.25, 9.5].
 *
 *   Values below are baked reference literals, reproduced exactly from the imp-34369 module's fine
 *   kEnd probe (kEnd = 15.00..15.75, 0.05 steps), collapsed to the four distinct effective-rung rows
 *   (rows within the same dk = 0.25 rung produce identical fits by construction). Direct re-statement,
 *   not re-derived here. This module does NOT import lambda-rh-height-mapping.js or
 *   polymath15-constant-C-C.js -- no fresh computation, per [[no_heavy_imports_in_pages]].
 *
 *   @see imp-34369-peak-relocation-regime-width.js (source measurement: the fine migration probe)
 *   @see imp-34288-trough-peak-ratio-ceiling-extension (the ~0.907 max and w ~ 9.25 this refines)
 *   @see imp-34085-trough-peak-ratio-convergence (the |trough|/|peak| ratio sequence)
 *
 *   Ticket: imp-34459 (ux, medium). Presentation only of an already-established measurement; adds
 *   no new Lambda bound. Component model is the inherited surrogate diagnostic, NOT rigorous;
 *   C_mb GUE-conditional per imp-486 UNTOUCHED; imp-3066 K_a>=0 untouched; NO QED; no refereed bound is changed.
 */

// -- the baked imp-34369 fine migration probe, collapsed to the four distinct effective-rung rows --
// Reproduced verbatim from the imp-34369 MIGRATION_PROBE sweep (direct re-statement).
export const IMP34459_MIGRATION_PROBE_ROWS = Object.freeze([
  Object.freeze({ effectiveW: 9.0, peakK: 15.0, peakIsEndpoint: true, ratio: 0.8873 }),
  Object.freeze({ effectiveW: 9.25, peakK: 15.25, peakIsEndpoint: true, ratio: 0.9072 }),
  Object.freeze({ effectiveW: 9.5, peakK: 6.5, peakIsEndpoint: false, ratio: 0.8946 }),
  Object.freeze({ effectiveW: 9.75, peakK: 6.5, peakIsEndpoint: false, ratio: 0.8752 }),
]);

// -- the bracket: the half-open rung interval (lastLockedW, firstMigratedW] that contains w* --
export const IMP34459_BRACKET = Object.freeze({
  lastEndpointLockedW: 9.25,
  lastEndpointLockedRatio: 0.9072,
  firstMigratedW: 9.5,
  firstMigratedRatio: 0.8946,
  triggerRungK: 15.5,
});

export default Object.freeze({
  id: 'imp-34459-peak-relocation-regime-width-viz-data',
  ticket: 'imp-34459',
  source: ['imp-34369-peak-relocation-regime-width.js'],
  migrationProbeRows: IMP34459_MIGRATION_PROBE_ROWS,
  bracket: IMP34459_BRACKET,
});

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP34459_ASSERTIONS = [
  {
    id: 'imp34459-four-distinct-effective-rows',
    holds: () => IMP34459_MIGRATION_PROBE_ROWS.length === 4,
    why: 'The fine probe collapses to exactly four distinct effective-rung rows (9.0, 9.25, 9.5, 9.75) because rows sharing a dk = 0.25 rung produce identical fits.',
  },
  {
    id: 'imp34459-peak-is-endpoint-flips-at-bracket',
    holds: () => {
      const r = IMP34459_MIGRATION_PROBE_ROWS;
      return (
        r[0].peakIsEndpoint === true &&
        r[1].peakIsEndpoint === true &&
        r[2].peakIsEndpoint === false &&
        r[3].peakIsEndpoint === false
      );
    },
    why: 'The endpoint-locked regime holds through w = 9.25 and flips to migrated at w = 9.5, matching the imp-34369 discrete-step finding.',
  },
  {
    id: 'imp34459-bracket-matches-rows',
    holds: () =>
      IMP34459_BRACKET.lastEndpointLockedW === IMP34459_MIGRATION_PROBE_ROWS[1].effectiveW &&
      IMP34459_BRACKET.lastEndpointLockedRatio === IMP34459_MIGRATION_PROBE_ROWS[1].ratio &&
      IMP34459_BRACKET.firstMigratedW === IMP34459_MIGRATION_PROBE_ROWS[2].effectiveW &&
      IMP34459_BRACKET.firstMigratedRatio === IMP34459_MIGRATION_PROBE_ROWS[2].ratio,
    why: 'The bracket summary must agree exactly with the two straddling rows in the probe table.',
  },
  {
    id: 'imp34459-max-ratio-at-last-locked-width',
    holds: () => {
      const r = IMP34459_MIGRATION_PROBE_ROWS;
      const maxRatio = Math.max(...r.map((x) => x.ratio));
      return maxRatio === IMP34459_BRACKET.lastEndpointLockedRatio;
    },
    why: 'The maximum ratio across the probe sits at the last endpoint-locked width w = 9.25, not after the migration.',
  },
];

for (const assertion of IMP34459_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-34459-peak-relocation-regime-width-viz-data assertion failed: ${assertion.id}`);
  }
}
