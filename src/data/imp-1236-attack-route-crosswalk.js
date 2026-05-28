/**
 * @module imp-1236-attack-route-crosswalk
 * @fileoverview Cross-walk: the 5 classical RH attacks on /rh-attack vs the
 * 4 closure routes of paper §16 (/closure-routes) and the 3 direct attacks
 * of paper §18 (/three-attacks). The page corpus currently exposes three
 * distinct lists of "attacks / routes" with significant overlap; this
 * crosswalk identifies duplicates, complements, and unique entries across
 * the 5 + 4 + 3 = 12 entries.
 *
 * Source pages:
 *   - src/pages/RHAttackPage.jsx       → Paths A-E (5 classical attacks)
 *   - src/pages/ClosureRoutesPage.jsx  → Routes A-D (4 §16 closure routes)
 *   - src/pages/ThreeAttacksPage.jsx   → Attacks I-III (3 §18 direct attacks)
 *
 * Companion data files:
 *   - src/data/closure-routes-section.js     (imp-1197 §16 reference doc)
 *   - src/data/three-attacks-section.js      (imp-1199 §18 reference doc)
 *   - src/data/imp-1205-connes-four-route-crosswalk.js (Connes vs §16)
 *
 * Verdict vocabulary:
 *   'UNIQUE'      — entry has no overlap with any other in the 12-row table
 *   'DUPLICATE'   — entry is the same mathematical object as another, just
 *                   in different language (e.g. Path C Weil = Route D = §16
 *                   Weil route)
 *   'COMPLEMENT'  — entry is a non-overlapping refinement / specialization
 *                   of another entry (proper subset of the other's program)
 *   'PARTIAL'     — entries share machinery but neither contains the other
 *
 * Pedagogical purpose: a reader navigating from /rh-attack (the classical
 * 5-attacks page) to /closure-routes (§16) or /three-attacks (§18) is left
 * uncertain whether (a) the new sections supersede the old, (b) they are
 * independent, or (c) some old paths are absorbed into the new framework.
 * This crosswalk resolves that ambiguity row by row.
 *
 * Source ticket: imp-1236.
 * Paper reference: research-inputs/twin_ladder_consolidated_v52.pdf §16, §18.
 */

/**
 * @typedef {object} AttackRouteEntry
 * @property {string} sourceList         - 'classical-5' | 'closure-4' | 'three-attacks-3'
 * @property {string} sourcePageRoute    - app route where this entry is rendered
 * @property {string} sourceLabel        - canonical name as it appears on the source page
 * @property {string} sourceKey          - source-list-local key (Path A, Route B, Attack I, ...)
 * @property {string} verdict            - UNIQUE | DUPLICATE | COMPLEMENT | PARTIAL
 * @property {string[]} overlapsWith     - source keys of related entries elsewhere in the table
 * @property {string} mathematicalObject - what the entry actually asserts, in one sentence
 * @property {string} resolution         - how the overlap (if any) is resolved pedagogically
 */

/**
 * The full 12-row crosswalk table.
 *
 * Row order: the 5 classical attacks first (in /rh-attack Path A-E order),
 * then the 4 §16 closure routes (Route A-D), then the 3 §18 direct
 * attacks (Attack I-III).
 *
 * @type {Readonly<AttackRouteEntry[]>}
 */
export const ATTACK_ROUTE_CROSSWALK = Object.freeze([
  // ── Classical 5 (/rh-attack, Paths A-E) ──────────────────────────────────

  Object.freeze({
    sourceList: 'classical-5',
    sourcePageRoute: '/rh-attack',
    sourceLabel: 'Hilbert-Polya',
    sourceKey: 'Path A',
    verdict: 'COMPLEMENT',
    overlapsWith: ['KYP / Bounded-Real (Apps M-O)'],
    mathematicalObject:
      'Construct a self-adjoint operator whose spectrum is the imaginary ' +
      'parts of the non-trivial zeta zeros. RH iff the operator is ' +
      'self-adjoint with real spectrum.',
    resolution:
      'COMPLEMENT to the v52 program. Hilbert-Polya is a structural ' +
      'meta-strategy (find an operator); the v52 paper does not pursue ' +
      'this directly but the KYP / bounded-real machinery (Apps M-O) is ' +
      'the operator-theoretic refinement that could supply the missing ' +
      'self-adjointness certificate.',
  }),

  Object.freeze({
    sourceList: 'classical-5',
    sourcePageRoute: '/rh-attack',
    sourceLabel: 'Darlington synthesis',
    sourceKey: 'Path B',
    verdict: 'COMPLEMENT',
    overlapsWith: ['Route B (de Branges positivity)', 'KYP / Bounded-Real'],
    mathematicalObject:
      'Realize zeta-1 as the scattering matrix of a lossless reciprocal ' +
      '2-port network. Darlington 1939: zeros of S_21 lie on jw axis when ' +
      'the network is lossless.',
    resolution:
      'COMPLEMENT to Route B. Both express RH as kernel/operator ' +
      'positivity on a transmission-line / Hilbert-space object. The v52 ' +
      'paper does not invoke Darlington by name but the KYP / bounded-real ' +
      'lemma (Apps M-O) is the modern operator-theoretic restatement of ' +
      'Darlington losslessness in state-space form.',
  }),

  Object.freeze({
    sourceList: 'classical-5',
    sourcePageRoute: '/rh-attack',
    sourceLabel: 'Weil positivity',
    sourceKey: 'Path C',
    verdict: 'DUPLICATE',
    overlapsWith: ['Route D (Weil / twin-ladder)'],
    mathematicalObject:
      'Weil 1952 explicit formula: RH iff the Weil distribution W is ' +
      'non-negative on positive test functions. Equivalently, the prime + ' +
      'archimedean trace pairing is a positive semi-definite quadratic form.',
    resolution:
      'DUPLICATE. Route D (the twin-ladder norm-square in §16.5) is the ' +
      'same Weil positivity criterion, rewritten in log-prime delay ' +
      'coordinates. The two presentations carry identical information; ' +
      'they differ only in coordinate language.',
  }),

  Object.freeze({
    sourceList: 'classical-5',
    sourcePageRoute: '/rh-attack',
    sourceLabel: 'Nyman-Beurling',
    sourceKey: 'Path D',
    verdict: 'UNIQUE',
    overlapsWith: [],
    mathematicalObject:
      'RH iff the function 1_{(0,1]} lies in the L^2 closure of the ' +
      'fractional-part dilations { {theta/x} : 0 < theta <= 1 }. A density / ' +
      'approximation criterion, not a positivity one.',
    resolution:
      'UNIQUE among the 12 entries. Nyman-Beurling is an L^2-approximation ' +
      'criterion; the v52 paper organizes itself around bridge-kernel ' +
      'positivity and Pontryagin index closure. No row in the §16 / §18 ' +
      'tables addresses the L^2-density formulation.',
  }),

  Object.freeze({
    sourceList: 'classical-5',
    sourcePageRoute: '/rh-attack',
    sourceLabel: 'Li criterion',
    sourceKey: 'Path E',
    verdict: 'UNIQUE',
    overlapsWith: [],
    mathematicalObject:
      'Li 1997: RH iff lambda_n >= 0 for every n >= 1, where lambda_n are ' +
      'the Li coefficients of (1 - 1/s)^n / s expanded around s = 1.',
    resolution:
      'UNIQUE among the 12 entries. Li is a coefficient-positivity ' +
      'criterion derived from the Hadamard factorization; the v52 §16 / ' +
      '§18 program does not phrase RH in Li-coefficient language. The two ' +
      'are independent attacks.',
  }),

  // ── §16 four closure routes (/closure-routes, Routes A-D) ────────────────

  Object.freeze({
    sourceList: 'closure-4',
    sourcePageRoute: '/closure-routes',
    sourceLabel: 'Schur contractivity / horizontal monotonicity',
    sourceKey: 'Route A',
    verdict: 'UNIQUE',
    overlapsWith: [],
    mathematicalObject:
      '|Theta_a(z)| < 1 on the right half-plane for every shift a > 0, ' +
      'where Theta_a = E_a^# / E_a is the shifted bridge ratio. RH iff ' +
      'this Schur-contractivity holds for all a > 0.',
    resolution:
      'UNIQUE among the 12 entries. Route A introduces the shift ' +
      'parameter a and asks for a horizontal-monotonicity Schur bound ' +
      'tied to that shift. None of the 5 classical attacks or the 3 §18 ' +
      'attacks shares this shifted-bridge formulation.',
  }),

  Object.freeze({
    sourceList: 'closure-4',
    sourcePageRoute: '/closure-routes',
    sourceLabel: 'de Branges positivity',
    sourceKey: 'Route B',
    verdict: 'COMPLEMENT',
    overlapsWith: ['Path B (Darlington synthesis)', 'KYP / Bounded-Real'],
    mathematicalObject:
      'For every shift a > 0 the shifted bridge kernel K_a is positive ' +
      'definite. Equivalently (E_a, E_a^#) is a Hermite-Biehler / de ' +
      'Branges structure function and K_a >= 0 is a Pick-class condition.',
    resolution:
      'COMPLEMENT to Path B (Darlington). Both are operator/kernel ' +
      'positivity conditions and share the same Hilbert-space ' +
      'losslessness flavour, but Route B fixes the de Branges kernel as ' +
      'the canonical object, whereas Path B presents the lossless 2-port ' +
      'as the canonical object. Neither contains the other; they ' +
      'illuminate the same condition from operator vs network angles.',
  }),

  Object.freeze({
    sourceList: 'closure-4',
    sourcePageRoute: '/closure-routes',
    sourceLabel: 'Hidden-square kernel factorization',
    sourceKey: 'Route C',
    verdict: 'UNIQUE',
    overlapsWith: [],
    mathematicalObject:
      'Kolmogorov factorization: K_a(zeta, z) = <B_a(z), B_a(zeta)>_{H_a} ' +
      'for some Hilbert-space-valued analytic map B_a. RH iff this Gram ' +
      'factorization can be constructed non-circularly from the ' +
      'completed kernel Phi.',
    resolution:
      'UNIQUE among the 12 entries. The hidden-square factorization is ' +
      'specific to §16.4 and has no counterpart in the classical-5 list ' +
      'or in §18. The non-circular construction of B_a is the precise ' +
      'open obstruction.',
  }),

  Object.freeze({
    sourceList: 'closure-4',
    sourcePageRoute: '/closure-routes',
    sourceLabel: 'Weil / twin-ladder norm square',
    sourceKey: 'Route D',
    verdict: 'DUPLICATE',
    overlapsWith: ['Path C (Weil positivity)'],
    mathematicalObject:
      'The twin-ladder quadratic form Q_TL[h] equals the Weil explicit ' +
      'formula sum sum_p W_p(h) + W_inf(h) - h(i/2) - h(-i/2) in ' +
      'log-prime delay coordinates. RH iff Q_TL[h] >= 0 for all ' +
      'admissible h.',
    resolution:
      'DUPLICATE of Path C. Same Weil positivity criterion in a different ' +
      'coordinate language. The crosswalk imp-1205 (Connes vs four-route) ' +
      'identifies Route D as the DIRECT Connes realisation, ratifying ' +
      'this identification.',
  }),

  // ── §18 three direct attacks (/three-attacks, Attacks I-III) ─────────────

  Object.freeze({
    sourceList: 'three-attacks-3',
    sourcePageRoute: '/three-attacks',
    sourceLabel: 'Kernel/passivity closure',
    sourceKey: 'Attack I',
    verdict: 'PARTIAL',
    overlapsWith: ['Route B (de Branges positivity)', 'Route C (hidden-square)'],
    mathematicalObject:
      'Conjecture 18.1: the bridge kernel K_a is the energy kernel of a ' +
      'passive linear system constructed directly from the completed ' +
      'Riemann kernel Phi. Passive = bounded-real transfer function on the ' +
      'right half-plane.',
    resolution:
      'PARTIAL overlap with Routes B and C. Attack I asserts both ' +
      'positivity (Route B) AND a concrete realization (Route C ' +
      'hidden-square) for the same K_a, packaged as a passive-system ' +
      'closure. It is a unification of Routes B + C under the additional ' +
      'requirement that the realization be passive, not merely positive.',
  }),

  Object.freeze({
    sourceList: 'three-attacks-3',
    sourcePageRoute: '/three-attacks',
    sourceLabel: 'Prime-delay domination',
    sourceKey: 'Attack II',
    verdict: 'PARTIAL',
    overlapsWith: ['Route D (Weil / twin-ladder)', 'Path C (Weil positivity)'],
    mathematicalObject:
      'Conjecture 18.2: Re G_inf(w) > Re of the coherent prime-delay echo ' +
      'train, for all admissible w. Equivalently, the archimedean ' +
      'contribution to the Weil quadratic form dominates the prime side.',
    resolution:
      'PARTIAL overlap with Route D / Path C. Both target Weil-style ' +
      'positivity, but Attack II asks for a SIGN-pointwise domination ' +
      '(archimedean > prime), which is strictly stronger than overall ' +
      'positivity of the sum. Attack II implies Route D but not ' +
      'conversely.',
  }),

  Object.freeze({
    sourceList: 'three-attacks-3',
    sourcePageRoute: '/three-attacks',
    sourceLabel: 'Weil/Pontryagin index closure',
    sourceKey: 'Attack III',
    verdict: 'DUPLICATE',
    overlapsWith: ['Inverse Blaschke ghosts (§17)'],
    mathematicalObject:
      'Theorem 18.3 + Conj 18.4: the Pontryagin negative index of the ' +
      'bridge kernel K_a equals the count of off-critical zeros (via the ' +
      'Krein-Langer identity). RH iff this index vanishes for all a > 0.',
    resolution:
      'DUPLICATE of the §17 inverse-Blaschke-ghosts statement. Attack III ' +
      'is the §18 restatement of the §17 obstruction: B_a^+ = 1 ⇔ ' +
      'ind_-(K_{R_a}) = 0 ⇔ RH. The two sections present the same ' +
      'mathematical content (off-critical zeros = ghost poles = ' +
      'negative-index defects), so the §18 attack is a duplicate up to ' +
      'rephrasing.',
  }),
]);

/**
 * Summary statistics over the 12-row table.
 * @type {Readonly<object>}
 */
export const ATTACK_ROUTE_CROSSWALK_SUMMARY = Object.freeze({
  totalEntries: 12,
  classical5Count: 5,
  closureRoutes4Count: 4,
  threeAttacks3Count: 3,
  verdictCounts: Object.freeze({
    UNIQUE: 4,      // Path D, Path E, Route A, Route C
    DUPLICATE: 3,   // Path C ↔ Route D, Attack III ↔ §17 ghosts (counted on §18 side)
    COMPLEMENT: 3,  // Path A ↔ KYP, Path B ↔ Route B, Route B ↔ Path B
    PARTIAL: 2,     // Attack I ↔ Routes B/C, Attack II ↔ Route D / Path C
  }),
  headlineDuplicates: [
    'Path C (Weil positivity) === Route D (Weil / twin-ladder norm square): ' +
      'identical Weil explicit formula in different coordinates.',
    'Attack III (Weil/Pontryagin index closure) === §17 inverse Blaschke ' +
      'ghosts: same Pontryagin negative-index condition.',
  ],
  headlineUnique: [
    'Path D (Nyman-Beurling) — L^2 density criterion not addressed by §16/§18.',
    'Path E (Li criterion) — coefficient positivity not addressed by §16/§18.',
    'Route A (Schur contractivity) — shift-bridge formulation not in classical-5.',
    'Route C (hidden-square factorization) — Kolmogorov factorization not in classical-5.',
  ],
  pedagogicalNote:
    'A reader landing on /rh-attack should NOT conclude that the 5 ' +
    'classical attacks are independent of the v52 program. Path C is ' +
    'literally Route D in a different language; Path B and Path A find ' +
    'their modern operator-theoretic refinements in Route B and the ' +
    'KYP/bounded-real machinery (Apps M-O). Paths D and E remain ' +
    'genuinely independent and could in principle close RH without ' +
    'invoking the v52 §16/§18 framework.',
});

/**
 * Helper: lookup a crosswalk row by source key.
 * @param {string} key - 'Path A'..'Path E' | 'Route A'..'Route D' | 'Attack I'..'Attack III'
 * @returns {AttackRouteEntry|null}
 */
export function findAttackRouteEntry(key) {
  if (typeof key !== 'string' || key.length === 0) return null;
  const norm = key.trim();
  const hit = ATTACK_ROUTE_CROSSWALK.find((e) => e.sourceKey === norm);
  return hit || null;
}

/**
 * Helper: partition the table by verdict.
 * @returns {Record<string, AttackRouteEntry[]>}
 */
export function partitionByVerdict() {
  /** @type {Record<string, AttackRouteEntry[]>} */
  const out = { UNIQUE: [], DUPLICATE: [], COMPLEMENT: [], PARTIAL: [] };
  for (const e of ATTACK_ROUTE_CROSSWALK) {
    if (out[e.verdict]) out[e.verdict].push(e);
  }
  return out;
}

// ── Build-time tripwires (>= 5) ──────────────────────────────────────────────

export const ATTACK_ROUTE_CROSSWALK_ASSERTIONS = [
  {
    id: 'imp1236-twelve-entries-total',
    holds: () => ATTACK_ROUTE_CROSSWALK.length === 12,
    why:
      'The crosswalk must contain exactly 12 rows = 5 classical attacks + ' +
      '4 closure routes + 3 direct attacks. Drift to 11 or 13 means an ' +
      'entry was silently dropped or duplicated and the page-table ' +
      'symmetry breaks.',
  },
  {
    id: 'imp1236-source-list-counts-5-4-3',
    holds: () => {
      const classical = ATTACK_ROUTE_CROSSWALK.filter(
        (e) => e.sourceList === 'classical-5'
      );
      const closure = ATTACK_ROUTE_CROSSWALK.filter(
        (e) => e.sourceList === 'closure-4'
      );
      const three = ATTACK_ROUTE_CROSSWALK.filter(
        (e) => e.sourceList === 'three-attacks-3'
      );
      return classical.length === 5 && closure.length === 4 && three.length === 3;
    },
    why:
      'The three source lists must contribute exactly 5, 4, and 3 entries ' +
      'respectively. Any reclassification of an entry would silently change ' +
      'the page-by-page counts the reader sees on /rh-attack vs ' +
      '/closure-routes vs /three-attacks.',
  },
  {
    id: 'imp1236-source-keys-unique',
    holds: () => {
      const keys = ATTACK_ROUTE_CROSSWALK.map((e) => e.sourceKey);
      return new Set(keys).size === keys.length;
    },
    why:
      'Each (source list, source key) pair must be unique across the table; ' +
      'duplicate keys would make findAttackRouteEntry ambiguous and ' +
      'misrender the page-companion section that cites this crosswalk.',
  },
  {
    id: 'imp1236-classical5-paths-A-through-E',
    holds: () => {
      const expected = ['Path A', 'Path B', 'Path C', 'Path D', 'Path E'];
      const got = ATTACK_ROUTE_CROSSWALK
        .filter((e) => e.sourceList === 'classical-5')
        .map((e) => e.sourceKey);
      return expected.every((k) => got.includes(k));
    },
    why:
      'The five classical attacks on /rh-attack (Hilbert-Polya, Darlington, ' +
      'Weil, Nyman-Beurling, Li) are exposed as Paths A-E in ' +
      'RHAttackPage.jsx. Drift in the labels would break the cross-page ' +
      'identification.',
  },
  {
    id: 'imp1236-closure4-routes-A-through-D',
    holds: () => {
      const expected = ['Route A', 'Route B', 'Route C', 'Route D'];
      const got = ATTACK_ROUTE_CROSSWALK
        .filter((e) => e.sourceList === 'closure-4')
        .map((e) => e.sourceKey);
      return expected.every((k) => got.includes(k));
    },
    why:
      '§16 enumerates exactly four closure routes (A: Schur, B: de Branges, ' +
      'C: hidden-square, D: Weil) per closure-routes-section.js. The ' +
      'crosswalk must mirror that A-D enumeration.',
  },
  {
    id: 'imp1236-three-attacks-I-II-III',
    holds: () => {
      const expected = ['Attack I', 'Attack II', 'Attack III'];
      const got = ATTACK_ROUTE_CROSSWALK
        .filter((e) => e.sourceList === 'three-attacks-3')
        .map((e) => e.sourceKey);
      return expected.every((k) => got.includes(k));
    },
    why:
      '§18 names exactly three direct attacks (I: kernel/passivity, II: ' +
      'prime-delay, III: Weil/Pontryagin) per three-attacks-section.js. ' +
      'Drift in this labeling would mis-cite the paper section.',
  },
  {
    id: 'imp1236-headline-duplicate-PathC-RouteD',
    holds: () => {
      const pathC = findAttackRouteEntry('Path C');
      const routeD = findAttackRouteEntry('Route D');
      return (
        pathC !== null &&
        routeD !== null &&
        pathC.verdict === 'DUPLICATE' &&
        routeD.verdict === 'DUPLICATE' &&
        pathC.overlapsWith.includes('Route D (Weil / twin-ladder)') &&
        routeD.overlapsWith.includes('Path C (Weil positivity)')
      );
    },
    why:
      'The headline finding of the crosswalk is that Path C (Weil ' +
      'positivity, classical) and Route D (Weil / twin-ladder, §16) are ' +
      'the SAME criterion in different coordinates. Both rows must carry ' +
      'verdict DUPLICATE and cross-reference each other; otherwise the ' +
      'pedagogical conclusion is lost and the reader keeps the impression ' +
      'they are independent.',
  },
  {
    id: 'imp1236-verdict-values-valid',
    holds: () =>
      ATTACK_ROUTE_CROSSWALK.every((e) =>
        ['UNIQUE', 'DUPLICATE', 'COMPLEMENT', 'PARTIAL'].includes(e.verdict)
      ),
    why:
      'Every verdict must be one of the four enum values. A typo or ' +
      'invented verdict would silently fall through partitionByVerdict ' +
      'and not appear on the rendered page.',
  },
  {
    id: 'imp1236-every-entry-has-required-fields',
    holds: () =>
      ATTACK_ROUTE_CROSSWALK.every(
        (e) =>
          typeof e.sourceList === 'string' && e.sourceList.length > 0 &&
          typeof e.sourcePageRoute === 'string' && e.sourcePageRoute.startsWith('/') &&
          typeof e.sourceLabel === 'string' && e.sourceLabel.length >= 5 &&
          typeof e.sourceKey === 'string' && e.sourceKey.length >= 5 &&
          typeof e.verdict === 'string' && e.verdict.length > 0 &&
          Array.isArray(e.overlapsWith) &&
          typeof e.mathematicalObject === 'string' && e.mathematicalObject.length >= 80 &&
          typeof e.resolution === 'string' && e.resolution.length >= 80
      ),
    why:
      'Every row must carry substantive mathematicalObject + resolution ' +
      'text (>= 80 chars each) so the reader gets a self-contained ' +
      'explanation of the overlap. Thin entries would defeat the ' +
      'pedagogical purpose of the crosswalk.',
  },
  {
    id: 'imp1236-find-entry-helper-works',
    holds: () => {
      const a = findAttackRouteEntry('Path A');
      const r = findAttackRouteEntry('Route D');
      const t = findAttackRouteEntry('Attack III');
      const bogus = findAttackRouteEntry('Path Z');
      return (
        a !== null && a.sourceKey === 'Path A' &&
        r !== null && r.sourceKey === 'Route D' &&
        t !== null && t.sourceKey === 'Attack III' &&
        bogus === null &&
        findAttackRouteEntry('') === null &&
        findAttackRouteEntry(null) === null
      );
    },
    why:
      'findAttackRouteEntry must look up real entries by exact source ' +
      'key, return null for unknown keys, and handle empty / non-string ' +
      'inputs gracefully. Regression breaks any page component that ' +
      'cites this crosswalk by key.',
  },
  {
    id: 'imp1236-partition-by-verdict-totals-12',
    holds: () => {
      const p = partitionByVerdict();
      return p.UNIQUE.length + p.DUPLICATE.length + p.COMPLEMENT.length +
        p.PARTIAL.length === 12;
    },
    why:
      'partitionByVerdict must place every row into exactly one bucket. ' +
      'If the verdict enum is extended without updating partitionByVerdict, ' +
      'this tripwire fires and the page-rendered totals will be wrong.',
  },
];
