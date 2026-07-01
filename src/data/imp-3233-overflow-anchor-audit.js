/**
 * imp-3233: Overflow-anchor audit — RE-POINT / KEEP verdicts for every in-repo
 * appearance of the stale overflow fraction anchors 0.194 / 19.4% / 0.200.
 *
 * Background (imp-3175):
 *   imp-3144 / section26-mupass-operator-verdict recorded 19.4% (0.194) as the
 *   overflow fraction at the coarse N~200 grid.  imp-3154 then swept DEG and
 *   found the fraction "pinned at 0.200" calling it a reproduction of the 19.4%
 *   anchor.  imp-3175 swept the TAU-GRID RESOLUTION N in {100..6400} and found
 *   the fraction rises MONOTONICALLY to ~0.2092285 at N=204800 — not down
 *   toward 0.194.  Both 0.194 and 0.200 are coarse-grid snapshots that
 *   UNDER-report the resolution-converged genuine overflow fraction ~0.209.
 *
 * Audit scope: src/ (pages + data modules); improvements.js and
 * improvement-queue.js excluded (historical ledger; no semantic re-point needed).
 * Non-overflow coincidences excluded (Li-coefficient ratios, PT asymptotic limit
 * 0.200, Krawczyk shear-weight parameter a=0.200, Tracy-Widom std ~0.194,
 * Wiener-Hopf A_WH ~0.199, margin-factor math).
 */

export const imp3233OverflowAnchorAudit = Object.freeze({

  id: 'imp-3233',
  resolvedOverflowFraction: 0.2092285,   // imp-3175 / imp-3199 / imp-3211 converged value
  staleAnchors: Object.freeze({
    imp3144: 0.194,   // section26-mupass coarse-grid recording
    imp3154: 0.200,   // imp-3154 DEG-sweep N=200 snapshot
  }),

  sites: Object.freeze([

    {
      file: 'src/data/section26-mupass-operator-verdict-2026-06-30.js',
      lines: '19,52,78,91,101,108,116',
      appearance: '19.4% of tau, 9.28e-9 deficit; genuineDeg2OverflowFractionOfTau check == 0.194',
      verdict: 'KEEP',
      reason:
        'This IS the original measurement document that first recorded 19.4% at the ' +
        'coarse N~200 grid.  The value here is authoritative as the historical snapshot; ' +
        'it is not presented as the converged resolved fraction.',
    },

    {
      file: 'src/data/imp-3007-mupass-overflow-cover.js',
      lines: '261-370',
      appearance: 'genuineDeg2OverflowFractionOfTau: 0.194 field; "9.28e-9, 19.4% of tau" strings',
      verdict: 'KEEP',
      reason:
        'The 0.194 field is explicitly labeled: "COARSE-GRID (N=200-class) snapshot; ' +
        'UNDER-reports -- see resolvedOverflowFractionOfTau".  The module also exports a ' +
        'resolvedOverflowFractionOfTau field (~0.209) from imp-3175.  Both anchors are ' +
        'correctly framed; no re-point needed.',
    },

    {
      file: 'src/data/imp-3154-genuine-deg2-deficit-degree-sweep.js',
      lines: '7,48,64,71,166,171,206-207,235,243,251,267,308',
      appearance:
        'summary: "overflow fraction is pinned at 0.200 of tau at every degree, ' +
        'reproducing the recorded 19.4% anchor"; ' +
        'interpretation.reproducesRecordedAnchor: "0.200 of tau reproduces the recorded ' +
        'imp-3144 / section26-verdict 19.4% anchor"',
      verdict: 'RE-POINT',
      reason:
        'The "reproduces" framing implies 0.200 and 0.194 are consistent measurements ' +
        'of the same value.  They are NOT: imp-3175 showed both are coarse-grid under-' +
        'reporters — 0.200 is the DEG-sweep value at N=200, 0.194 is the section26 coarse ' +
        'snapshot, and both are BELOW the resolved genuine fraction ~0.209.  Saying 0.200 ' +
        '"reproduces 19.4%" suggests equality and implies ~20% is the correct answer.  ' +
        'The interpretation.reproducesRecordedAnchor key should be updated to clarify: ' +
        '"both 0.200 and 0.194 are coarse-grid snapshots in the same ~20% ballpark; ' +
        'neither is the resolution-converged value (~0.209 per imp-3175)".',
      suggestedFix:
        'In interpretation.reproducesRecordedAnchor: replace "reproduces the recorded ' +
        'imp-3144 / section26-verdict 19.4% anchor" with "is in the same ~20% coarse-grid ' +
        'ballpark as the recorded imp-3144 / section26-verdict 19.4% anchor; both 0.200 ' +
        'and 0.194 are single-resolution snapshots that under-report the resolution-' +
        'converged genuine fraction ~0.209 (imp-3175)".',
    },

    {
      file: 'src/data/imp-3175-overflow-fraction-resolution-reconcile.js',
      lines: '4-313 (entire module)',
      appearance:
        'RECORDED_IMP3144_OVERFLOW = 0.194; RECORDED_IMP3154_OVERFLOW = 0.200; all uses ' +
        'compare against resolved ~0.209; verdict string encodes direction',
      verdict: 'KEEP',
      reason:
        'This IS the reconciliation module.  Every 0.194/0.200 reference here is the ' +
        'point of the module: track the stale anchors and demonstrate the fraction rises ' +
        'away from them.  No re-point needed.',
    },

    {
      file: 'src/data/imp-3211-overflow-fraction-converged-lock.js',
      lines: '6-132 (entire module)',
      appearance:
        '0.194 and 0.200 used as lock-guard constants; assertions that resolved value > both',
      verdict: 'KEEP',
      reason:
        'This is the lock-guard that prevents re-promotion of stale anchors.  References ' +
        'to 0.194/0.200 are exactly the constants being guarded against.  No re-point needed.',
    },

    {
      file: 'src/data/imp-3199-overflow-fraction-cell-sweep.js',
      lines: '74',
      appearance: '@see section26-mupass-operator-verdict-2026-06-30.js (imp-3144: the 19.4% anchor)',
      verdict: 'KEEP',
      reason:
        'JSDoc cross-reference only.  Identifies the source of the historical anchor; ' +
        'does not present 19.4% as the current value.',
    },

    {
      file: 'src/data/glossary.js',
      lines: '727',
      appearance: '"snapshots 0.194 and 0.200 which both under-report the tail contribution at insufficient resolution"',
      verdict: 'KEEP',
      reason:
        'Correctly frames both values as under-reporting snapshots.  No re-point needed.',
    },

    {
      file: 'src/pages/ClosureRoutesPage.jsx',
      lines: '2450-2577',
      appearance:
        'const anchor194 = 0.194; const anchor200 = 0.200; rendered as "stale 0.194 anchor" ' +
        'and "stale 0.200 anchor (imp-3154 N=200)" in the overflow-fraction viz',
      verdict: 'KEEP',
      reason:
        'Both anchors are explicitly labeled "stale" in both the SVG annotations and the ' +
        'legend.  The prose above the viz states "not down to the coarse 0.194 anchor" and ' +
        '"both recorded anchors under-report the resolution-converged genuine fraction ~0.209". ' +
        'Already fully re-pointed.',
    },

  ]),

  summary: Object.freeze({
    keepCount: 7,
    repointCount: 1,
    repointFile: 'src/data/imp-3154-genuine-deg2-deficit-degree-sweep.js',
    repointKey: 'interpretation.reproducesRecordedAnchor',
    ignoredCoincidences: [
      'src/data/imp-2426-li-coefficients-bombieri-lagarias-2026-06.js  (ratio: 0.1940 — Li coefficient)',
      'src/data/bui-sound-plus-polymath-bridge-2026-05.js              (L_ASYMPTOTIC = 0.200 — PT asymptotic limit)',
      'src/data/goldston-yildirim-projection-2026-05.js                (PT_ASYMPTOTIC_BASELINE — same)',
      'src/data/imp-2437-sympow-rs-second-moment-2026-06.js            (log_c_m: -0.1944 — unrelated)',
      'src/data/imp-1296-tracy-widom-edge.js                           (stdSmax: 0.1944 — Tracy-Widom std)',
      'src/data/imp-2338-volterra-krawczyk.js                          (a: 0.200 — Krawczyk shear-weight param)',
      'src/data/finite-height-beats-platt-trudgian.js                  (0.200/0.00803 — margin factor)',
      'src/data/imp-1260-volterra-rigorous-bound-attempt.js            (A_WH ~0.19954 — Wiener-Hopf constant)',
    ],
  }),

});
