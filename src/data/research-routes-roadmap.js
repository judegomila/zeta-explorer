/**
 * @fileoverview research-routes-roadmap — the fifty experimental routes of 2026-10-06 as site data.
 *
 * Source: formalization/routes/fifty-routes-2026-10-06.md (one entry per numbered route, same numbering,
 * same groups A–J, same tags). Each route states what it tries and why it is not one of the closed classes
 * (flow-blindness, NS-RIGID, Theorem U, T3 = strip, the 2026-09-23 stat-mech routes A–H, Route I as a road
 * past the verified-height crossover 2a = 7.76, mirror descent, local Levinson, paid verification).
 *
 * Status frame: PT Λ ≤ 0.2 is the accepted benchmark; project results are internal-referee only; the values
 * 0.1758354 and 0.1787854 are computer-assisted candidates; RH is open. A route's `status` records work state,
 * not a mathematical outcome ('done' = the route's question is answered, whatever the answer; 'partial' = a result
 * module exists but the route's goal is not reached). `result` / `resultModule` stay null until a route has a
 * written result module.
 *
 * Batch 1 = the five first picks (routes 2, 1, 46, 27, 49, in that order), recorded 2026-10-06 (each with one
 * adversarial internal referee pass; corrections applied in the result modules). Batch 2 = routes 3, 4, 5, 6, 20
 * (planned). Later batches are unassigned (null).
 * Import-free. RESEARCH_ROUTES_ASSERTIONS check ids, groups, tags, statuses, the batch sets and result fields.
 */

export const RESEARCH_ROUTE_GROUPS = Object.freeze({
  A: 'Λ upper bound, no money',
  B: 'Weil positivity and the Connes programme',
  C: 'Proportion and mollifiers (the input NS-RIGID leaves open)',
  D: 'Heat flow and the fluid picture',
  E: 'Twin ladder and bridge model',
  F: 'Spectral and Hilbert–Pólya',
  G: 'Cheap local computation',
  H: 'Formalisation and AI-assisted proof',
  I: 'Structural no-gos',
  J: 'Creative',
});

export const RESEARCH_ROUTE_TAGS = Object.freeze({
  'Λ': 'moves the de Bruijn–Newman bound',
  RH: 'RH-level input',
  map: 'sharpens what is possible',
  tool: 'infrastructure',
});

export const RESEARCH_ROUTE_STATUSES = Object.freeze(['planned', 'in progress', 'partial', 'done', 'blocked']);

// First picks in the order given in the source file, with the stated reason.
export const RESEARCH_ROUTE_FIRST_PICKS = Object.freeze([
  Object.freeze({ id: 2, reason: 'New lever found on 2026-10-06 (barrier floor certified to 0.025); cheap to test.' }),
  Object.freeze({ id: 1, reason: 'Closest to a sub-0.145 value.' }),
  Object.freeze({ id: 46, reason: 'Could close much of the 0.75 vs 0.53 gap in certified source floors.' }),
  Object.freeze({ id: 27, reason: 'The clearest RH-level experiment.' }),
  Object.freeze({ id: 49, reason: 'Improves an input many routes use.' }),
]);

const FIRST = new Set(RESEARCH_ROUTE_FIRST_PICKS.map((p) => p.id));
export const RESEARCH_ROUTE_BATCH_2 = Object.freeze([3, 4, 5, 6, 20]);
const BATCH = new Map([...[...FIRST].map((id) => [id, 1]), ...RESEARCH_ROUTE_BATCH_2.map((id) => [id, 2])]);

// Recorded outcomes (batch 1, 2026-10-06). One sentence each; details, grades and referee corrections in the module.
const RESULTS = Object.freeze({
  1: Object.freeze({ status: 'partial', resultModule: 'src/data/route-1-finish-route-p-2026-10-06.js',
    result: 'Round 7 lowers the certified route-P value at PT height to 0.145694083872924 (from 0.146660920737233; 244 of 369 P47 floors, interval-certified, internal referee only, conditional on the shared ledger), but Λ < 0.145 is not certified: 125 floors are missing and 13 are budget-stopped.' }),
  2: Object.freeze({ status: 'done', resultModule: 'src/data/route-2-lowered-barrier-floor-2026-10-06.js',
    result: 'The lowered barrier floor moves nothing: route P has no floor input, and under Polymath Thm 1.2 the floor enters only through containment, which holds at every certified floor because the certified hypothesis (ii) sits at y0 = 0.18727, so 0.1787854 and 0.1758354 are unchanged.' }),
  27: Object.freeze({ status: 'done', resultModule: 'src/data/route-27-function-field-twin-ladder-2026-10-06.js',
    result: 'Over F_q the twin-ladder Weil form is minus the intersection form on primitive Frobenius-graph classes, so Hodge index gives curve-RH, while ladder data alone do not (215 exact Euler-product fakes); the lift to Q stops at the missing Spec Z × Spec Z with a Hodge index theorem.' }),
  46: Object.freeze({ status: 'partial', resultModule: 'src/data/route-46-exact-kronecker-floors-2026-10-06.js',
    result: 'Kronecker suprema are certified from below at the 12 binding cells (t = 0.075: ≥ 0.533514111339326) and slice maxima are float-validated only for k ≤ 5; on the exact consumer any floor gain is capped at U2 = 0.144254643222956, so the route reduces to certifying WOL-C on 369 P47 late-cell floors.' }),
  49: Object.freeze({ status: 'done', resultModule: 'src/data/route-49-unconditional-s-of-t-2026-10-06.js',
    result: 'An elementary sawtooth lemma on top of Trudgian 2011 (constant to be checked) improves |S(T)| by 9–17% for T in 1e11–1e17 (5.6748 vs 6.6612 at 3e12), but no pointwise S(T) input gives a usable mirror-descent lever (pessimistic weights stay above 0.2 even at E = 0).' }),
});

const R = (id, group, tag, title, summary, whyNotClosed, seeAlso = []) => Object.freeze({
  id,
  group,
  groupName: RESEARCH_ROUTE_GROUPS[group],
  title,
  summary,
  tag,
  whyNotClosed,
  status: RESULTS[id]?.status ?? 'planned',
  batch: BATCH.get(id) ?? null,
  result: RESULTS[id]?.result ?? null,
  resultModule: RESULTS[id]?.resultModule ?? null,
  resultPage: null, // site path of a result page, when one exists
  firstPick: FIRST.has(id),
  seeAlso: Object.freeze(seeAlso),
});

export const RESEARCH_ROUTES = Object.freeze([
  // A. Λ upper bound, no money
  R(1, 'A', 'Λ', 'Finish route P',
    'Certify the remaining P47 late cells at margin ≤ 0.050 (round 7 full run, then referee) for a sub-0.145 value at PT height.',
    'Uses only the verified PT height; the r6 synthesis shows late margins ≤ 0.050 reach < 0.145 while the best corrected late margin 0.0533 gives 0.145017, so the gap is a tighter late-cell majorant, not new height.',
    ['/lambda-bounds', '/pt-floor-audit']),
  R(2, 'A', 'Λ', 'Lowered barrier floor into route P',
    'Feed the lowered barrier floor (certified to 0.025 on 2026-10-06) into the Raymond/route-P architecture at early times; measure how much Λ drops when the band argument can start lower.',
    'The floor of the barrier rectangle was certified down to 0.025 on [X, X+1] for 0 ≤ t ≤ 0.16125 (Arb, 2026-10-06). The 2026-07 audit found barrier slack non-binding for the PT architecture; the effect of a lower floor on the route-P band argument at early times has not been measured.',
    ['/pt-floor-audit', '/lambda-01758354-candidate']),
  R(3, 'A', 'Λ', 'Three-point correlated probes',
    "Raymond's surplus terms cannot hit worst cases at two translations at once; extend to three or more translations.",
    'Exploits correlation between probes, which single-probe worst-case bounds discard; not a barrier-slack tightening.'),
  R(4, 'A', 'Λ', 'Fejér–Riesz certificate for the weak outer lemma',
    'Sum-of-squares (Fejér–Riesz) certificate for the weak outer lemma on the outer torus, replacing box/cone bounds on P47.',
    'Replaces the late-cell majorant itself (the binding input of route P) with an exact positivity certificate; the box/cone bounds are what currently leave the 0.0533 margin.',
    ['/lambda-bounds']),
  R(5, 'A', 'Λ', 'Many barriers',
    'Certify compact-slab barriers at several abscissas X_k (10-minute runs) and use them to split the band argument into more bands.',
    'Changes the band architecture (more cut points), not the slack of one barrier; each slab is a cheap local certificate.'),
  R(6, 'A', 'Λ', 'Sparse verification theorem',
    'Which minimal set of local RH windows (62 CPU-s each with FLINT) can stand in for contiguous verification in Lemma B-type band arguments?',
    'Asks for a replacement of contiguous verified height by sparse local windows; contiguous paid verification is the closed class, sparse windows are not.'),
  R(7, 'A', 'Λ', 'Time-dependent mollifiers',
    'Time-dependent mollifiers in the barrier and source floors (mollifier that changes with t).',
    'The fixed-height mollifier lever is capped near 0.174; a t-dependent mollifier is outside that measurement.'),
  R(8, 'A', 'Λ', 'Hybrid schedule',
    'Polymath fixed-time on one height band, Raymond decreasing barrier on another, joined by a certified barrier.',
    'Combines two existing architectures on disjoint bands; neither single architecture is the object of a closed no-go.'),
  R(9, 'A', 'Λ', 'Optimised barrier schedule y(t)',
    'Optimise the barrier schedule y(t) as a piecewise function with the exact consumer in the loop (gradient-free search, then certify the winner).',
    'Searches the schedule with the exact consumer rather than tightening a fixed schedule; the winner must still be certified.'),
  R(10, 'A', 'tool', "Lean core of Raymond's chain",
    "Formalise the core of Raymond's chain (G0) in Lean, starting with the C_g identity and Lemma R, to reduce dependence on external referees.",
    'Infrastructure: reduces referee dependence of existing results; makes no new mathematical claim.'),

  // B. Weil positivity and the Connes programme
  R(11, 'B', 'map', 'Multi-prime Toeplitz–Krein past ln 3',
    'Multi-prime Toeplitz–Krein certificate past ln 3 (to ln 4, ln 5): a zero-free method that keeps working when the prime 3 enters.',
    'Route I is closed as a road past 2a = 7.76; this asks a bounded question (supports ln 4, ln 5) about a zero-free certificate method, mapping where it stops.'),
  R(12, 'B', 'RH', 'Semilocal trace identity for S = {∞, 2, 3}',
    'Exact semilocal trace identity for S = {∞, 2, 3}; measure whether the remainder share falls as primes are added.',
    'The S = {∞, 2} identity exists with a remainder of 96.7–99.7% of the trace; whether the share falls with more primes has not been measured.'),
  R(13, 'B', 'RH', 'Lacunary / Müntz-incomplete cones',
    'Positivity on lacunary or Müntz-incomplete test-function cones: the one loophole NS-RIGID leaves inside the native span (its A6 remark).',
    'NS-RIGID itself names this cone as outside its hypotheses (A6 remark).'),
  R(14, 'B', 'map', 'Family Weil positivity',
    'Average over twists by Dirichlet characters, where symmetry-type averaging may make positivity provable at larger support.',
    'Family averages change the object (a mean over L-functions), which the single-function no-gos do not cover.'),
  R(15, 'B', 'map', 'Euler-blindness radius for Epstein twins',
    'Euler-blindness radius for other same-gamma-factor twins (Epstein zeta functions with class number > 1), mapping at what support the Euler product is first detected.',
    'A measurement of where Euler-product detection starts; extends the Davenport–Heilbronn comparison to other twins.'),

  // C. Proportion and mollifiers
  R(16, 'C', 'RH', 'Alpöge–Furman ≥ 2/3 in twin-ladder terms',
    'Reproduce the Alpöge–Furman ≥ 2/3 argument numerically and translate it into twin-ladder terms.',
    'Proportion input is the one input NS-RIGID leaves open.',
    ['/critical-line-proportion', '/twin-ladder']),
  R(17, 'C', 'map', 'Mollifiers beyond θ = 4/7',
    'Numerical sanity of longer mollifier lengths beyond θ = 4/7 (twisted second moments), at heights we can compute.',
    'A numerical map of an unproved regime; makes no claim that the regime holds.',
    ['/critical-line-proportion']),
  R(18, 'C', 'map', 'Local Levinson under pair correlation',
    "Local Levinson conditional on pair correlation: how short a window becomes certifiable if Montgomery's conjecture is assumed.",
    'Unconditional local Levinson is closed; this measures the conditional version, labelled as conditional.',
    ['/pair-correlation']),
  R(19, 'C', 'RH', 'Mollified Weil forms',
    'Combine a Levinson mollifier with Weil test functions in one quadratic form.',
    'Mixes the two inputs into one form; each alone has a recorded wall, the combined form does not.'),

  // D. Heat flow and the fluid picture
  R(20, 'D', 'Λ', 'Effective Ki–Kim–Lee',
    'Make "all but finitely many zeros of H_t are real" explicit with constants, to replace part of the verified-height input.',
    'Arithmetic input (effective constants), not a soft flow hypothesis; the flow-blindness no-go covers soft hypotheses only.',
    ['/flow-blindness-no-go']),
  R(21, 'D', 'map', 'Entropy functional for the zero flow',
    'Entropy-type Lyapunov functional for the zero flow (Burgers entropy inequality) beyond the pair law.',
    'Maps what flow functionals can see; flow-blindness bounds the outcome, so the route is tagged map.'),
  R(22, 'D', 'Λ', 'Lehmer-pair hunt at large height',
    'Lehmer-pair hunt at large height to push the lower bound side (Λ ≥ −ε records).',
    'Lower-bound side; none of the closed classes concern Λ ≥ 0 records.'),
  R(23, 'D', 'map', 'H_t dynamics vs Dyson Brownian motion',
    "Compare H_t zero dynamics with Dyson Brownian motion on Odlyzko's high zeros, looking for arithmetic deviations.",
    'A measurement of arithmetic deviations; makes no claim about Λ.'),
  R(24, 'D', 'Λ', 'Mean-field descent with local zero counts',
    'Mean-field descent with an improved local zero-count bound at t > 0, where the effective approximation controls the argument.',
    'Mirror descent is closed at t = 0; this uses a t > 0 local count where the effective approximation applies.'),

  // E. Twin ladder and bridge model
  R(25, 'E', 'map', 'Bridge as scattering',
    'Lax–Phillips / Pavlov–Faddeev picture for the modular surface; compute resonance motion under bridge deformations.',
    'A model computation on the modular surface; makes no claim about ζ zeros.',
    ['/freezing-bridge']),
  R(26, 'E', 'map', 'Twin ladder for GL(2)',
    'Twin ladder for GL(2) L-functions where Ramanujan is known: find which ladder statements become provable there.',
    'Tests the ladder where an extra theorem (Ramanujan) is available; maps which rungs it buys.',
    ['/twin-ladder']),
  R(27, 'E', 'RH', 'Function-field twin ladder',
    'Build the ladder for curves over F_q (RH proved) and identify the ladder property that encodes the Weil-conjecture proof; attempt the lift.',
    'Works where RH is a theorem (Weil), so the ladder property that holds there can be identified directly; the closed ladder classes were derived for ζ, not for curves over F_q.',
    ['/twin-ladder']),
  R(28, 'E', 'map', 'Freeze calculus on Selberg zeta',
    'Freeze calculus on the Selberg zeta function as a sandbox where an RH analogue holds.',
    'Sandbox with a known RH analogue; maps which freeze statements survive.'),
  R(29, 'E', 'map', 'Interferometer visibility functional',
    'Test whether a finite-height visibility bound gives an RH-equivalent or a genuinely weaker statement.',
    'Classifies one functional against RH; not yet placed in any closed class.'),
  R(30, 'E', 'RH', 'Finite-support Euler detector',
    'A ladder-native quantity that separates ζ from Davenport–Heilbronn at support below 3.44.',
    'Any RH route must detect the Euler product; this asks for a detector at a support where none is recorded yet.'),

  // F. Spectral and Hilbert–Pólya
  R(31, 'F', 'map', 'Berry–Keating xp, regularised',
    'Berry–Keating xp with Connes or Sierra regularisations, tested against the first 10^5 zeros.',
    'Numerical test of a spectral model; not a proof route.'),
  R(32, 'F', 'map', 'Inverse spectral potential',
    'Inverse spectral potential reproducing the zeros (Wu–Sprung type) and its regularity.',
    'Measures regularity of a reconstructed potential; not a proof route.'),
  R(33, 'F', 'map', 'Arithmetic corrections to RMT statistics',
    'Arithmetic corrections to random-matrix statistics (Bogomolny–Keating) on high zeros: detect the prime signal.',
    'Detection of a known predicted correction; a measurement.',
    ['/pair-correlation']),
  R(34, 'F', 'map', 'de Branges Hamiltonian for ξ',
    'de Branges canonical-system Hamiltonian for ξ computed numerically (Lagarias); study its mass positivity.',
    'Numerical study of one structure; makes no claim about de Branges positivity in general.'),
  R(35, 'F', 'map', 'Certified Li coefficients',
    'Certified Li coefficients to large n, compared with Keiper–Li asymptotics.',
    'Certified finite data; RH-equivalence needs all n, so this maps behaviour only.',
    ['/rh-equivalents']),

  // G. Cheap local computation
  R(36, 'G', 'map', 'Random local windows at 10^13–10^20',
    "Random local windows at heights 10^13–10^20 with FLINT's Platt code: exploratory search for anomalies.",
    'Local windows (62 CPU-s each), not contiguous paid verification.'),
  R(37, 'G', 'map', 'Gram-law violation statistics',
    'Gram-law violation statistics as a model of barrier difficulty at large height.',
    'A statistical model of barrier cost; a measurement.',
    ['/gram-points']),
  R(38, 'G', 'Λ', 'Barrier slab at higher X',
    'Certify the barrier slab at higher X to test how the floor-lowering result scales with height.',
    'Extends the 2026-10-06 floor-lowering certificate to new heights; local, cheap, not paid verification.',
    ['/pt-floor-audit']),

  // H. Formalisation and AI-assisted proof
  R(39, 'H', 'tool', 'Lean: Weil explicit formula + Yoshida',
    'Lean: Weil explicit formula plus small-support positivity (Yoshida).',
    'Infrastructure; formalises known theorems.'),
  R(40, 'H', 'tool', 'Aristotle on WOL and BB1/BB2',
    'Aristotle runs on the weak outer lemma and the band barriers BB1/BB2.',
    'Infrastructure; machine-checks lemmas already in the route-P ledger.'),
  R(41, 'H', 'tool', 'Lean replay of Arb certificates',
    'Lean checking of Arb certificates via certificate replay.',
    'Infrastructure; moves certified results toward machine-checked ones.'),

  // I. Structural no-gos
  R(42, 'I', 'map', 'Formal MV-CAP theorem',
    'Formal MV-CAP theorem: mean-value inputs cannot certify every-window statements.',
    'States a no-go as a theorem; maps a class, does not attempt RH.',
    ['/no-gos']),
  R(43, 'I', 'map', 'Flow-criticality classes',
    'Classify inputs by degree of flow-criticality; look for an intermediate class between soft and RH.',
    'Refines the flow-blindness dichotomy rather than contradicting it.',
    ['/flow-blindness-no-go']),
  R(44, 'I', 'map', 'Euler-detection depth across conductors',
    'Euler-detection depth against support across many conductors.',
    'A measurement across conductors; extends route 15 and route 30 data.'),

  // J. Creative
  R(45, 'J', 'map', 'Multiplicative chaos for source-floor tails',
    'Multiplicative-chaos models of ζ on the line (Saksman–Webb) to predict source-floor tails.',
    'A prediction model for an input of the Λ chain; not itself a certificate.'),
  R(46, 'J', 'Λ', 'Exact Kronecker floors',
    'Kronecker floors as exact Bohr–Jessen extrema: for finitely many primes the torus supremum is deterministic, so compute it exactly instead of bounding it.',
    'Replaces a bound on a finite-prime torus extremum by its exact value, a different computation from the bounds behind the current certified source floors (the 0.75 vs 0.53 gap).'),
  R(47, 'J', 'Λ', 'Learned adversaries',
    'Train a surrogate to search for weak-outer-lemma violations and hard cells, guiding where certificates must be tight.',
    'A search aid; every result it guides still needs an interval certificate.'),
  R(48, 'J', 'map', 'Phase retrieval for ζ',
    'How much of ζ is determined by |ζ| on vertical lines (the Hilbert-transform wall made quantitative).',
    'Quantifies a recorded wall; a map.'),
  R(49, 'J', 'Λ', 'Unconditional S(T) constants',
    'Unconditional S(T) constants via extremal (Beurling–Selberg) functions computed with our engines; better constants feed local zero counting and descent arguments.',
    'Improves a constant used by several routes (local zero counting, descent); unconditional input, not verified height.'),
  R(50, 'J', 'Λ', 'Verified-height-free Λ curve',
    'Λ as a function of the constants in an effective Ki–Kim–Lee theorem.',
    'Expresses Λ through effective constants (route 20) instead of verified height; an arithmetic input, outside flow-blindness.'),
]);

export const RESEARCH_ROUTES_META = Object.freeze({
  date: '2026-10-06',
  source: 'formalization/routes/fifty-routes-2026-10-06.md',
  frame: 'Fifty experimental routes built from the project results to date. Each states what it tries and why it is not one of the closed classes.',
  closedClasses: Object.freeze([
    'flow-blindness', 'NS-RIGID', 'Theorem U', 'T3 = strip', 'stat-mech routes A–H (2026-09-23)',
    'Route I as a road past 2a = 7.76', 'mirror descent', 'local Levinson', 'paid verification',
  ]),
  statusNote: 'PT Λ ≤ 0.2 is the accepted benchmark. Project results are internal-referee only; 0.1758354 and 0.1787854 are computer-assisted candidates. RH is open. A route status records work state, not a mathematical outcome.',
});

const TAGS = Object.keys(RESEARCH_ROUTE_TAGS);
const GROUP_RANGES = { A: [1, 10], B: [11, 15], C: [16, 19], D: [20, 24], E: [25, 30], F: [31, 35], G: [36, 38], H: [39, 41], I: [42, 44], J: [45, 50] };
// Tags as written in the source file, by route id.
const SOURCE_TAGS = 'ΛΛΛΛΛΛΛΛΛT' + 'mRRmm' + 'RmmR' + 'ΛmΛmΛ' + 'mmRmmR' + 'mmmmm' + 'mmΛ' + 'TTT' + 'mmm' + 'mΛΛmΛΛ';
const TAG_CODE = { 'Λ': 'Λ', R: 'RH', m: 'map', T: 'tool' };

export const RESEARCH_ROUTES_ASSERTIONS = Object.freeze([
  {
    id: 'rr-fifty-unique-ids',
    holds: () => RESEARCH_ROUTES.length === 50 && new Set(RESEARCH_ROUTES.map((r) => r.id)).size === 50
      && RESEARCH_ROUTES.every((r, i) => r.id === i + 1),
    why: 'Exactly 50 routes with unique ids 1..50 in source order.',
  },
  {
    id: 'rr-valid-tags-status',
    holds: () => RESEARCH_ROUTES.every((r) => TAGS.includes(r.tag) && RESEARCH_ROUTE_STATUSES.includes(r.status)),
    why: "Every tag is one of 'Λ' | 'RH' | 'map' | 'tool'; every status is planned | in progress | partial | done | blocked.",
  },
  {
    id: 'rr-tags-match-source',
    holds: () => SOURCE_TAGS.length === 50 && RESEARCH_ROUTES.every((r, i) => r.tag === TAG_CODE[SOURCE_TAGS[i]]),
    why: 'Tags match the [Λ]/[RH]/[map]/[tool] tags of the source file route by route.',
  },
  {
    id: 'rr-groups',
    holds: () => RESEARCH_ROUTES.every((r) => {
      const g = GROUP_RANGES[r.group];
      return g && r.id >= g[0] && r.id <= g[1] && r.groupName === RESEARCH_ROUTE_GROUPS[r.group];
    }) && Object.keys(RESEARCH_ROUTE_GROUPS).join('') === 'ABCDEFGHIJ',
    why: 'Groups A–J cover the source id ranges (A 1–10, B 11–15, C 16–19, D 20–24, E 25–30, F 31–35, G 36–38, H 39–41, I 42–44, J 45–50).',
  },
  {
    id: 'rr-batch-1',
    holds: () => {
      const b1 = RESEARCH_ROUTES.filter((r) => r.batch === 1).map((r) => r.id).sort((a, b) => a - b).join(',');
      const fp = RESEARCH_ROUTES.filter((r) => r.firstPick).map((r) => r.id).sort((a, b) => a - b).join(',');
      return b1 === '1,2,27,46,49' && fp === b1 && RESEARCH_ROUTE_FIRST_PICKS.map((p) => p.id).join(',') === '2,1,46,27,49'
        && RESEARCH_ROUTES.every((r) => r.batch === 1 || r.batch === 2 || r.batch === null);
    },
    why: 'Batch 1 = first picks = routes 2, 1, 46, 27, 49; batch 2 is the only other batch; the rest are null.',
  },
  {
    id: 'rr-batch-2',
    holds: () => RESEARCH_ROUTES.filter((r) => r.batch === 2).map((r) => r.id).join(',') === '3,4,5,6,20'
      && RESEARCH_ROUTES.filter((r) => r.batch === 2).every((r) => r.status === 'planned' && !r.firstPick && r.result === null),
    why: 'Batch 2 = routes 3, 4, 5, 6, 20, status planned, no result yet.',
  },
  {
    id: 'rr-batch-1-recorded',
    holds: () => RESEARCH_ROUTES.filter((r) => r.batch === 1).every((r) => ['done', 'partial', 'blocked'].includes(r.status)
        && r.resultModule.startsWith(`src/data/route-${r.id}-`) && r.resultModule.endsWith('-2026-10-06.js')
        && typeof r.result === 'string' && r.result.length > 40)
      && RESEARCH_ROUTES.filter((r) => r.result !== null).length === 5
      && ['1:partial', '2:done', '27:done', '46:partial', '49:done'].every((x) => { const [i, s] = x.split(':'); return RESEARCH_ROUTES[Number(i) - 1].status === s; }),
    why: 'Batch 1 recorded: routes 2, 27, 49 done; 1 and 46 partial; each with a one-sentence result and a route-<id>-*-2026-10-06.js module.',
  },
  {
    id: 'rr-result-fields',
    holds: () => RESEARCH_ROUTES.every((r) => (['done', 'partial'].includes(r.status) ? r.result !== null && r.resultModule !== null : true)
      && (r.resultModule === null || /^src\/data\/.+\.js$/.test(r.resultModule))
      && (r.resultPage === null || /^\/[a-z0-9-]+$/.test(r.resultPage))
      && typeof r.title === 'string' && r.title && typeof r.summary === 'string' && r.summary
      && typeof r.whyNotClosed === 'string' && r.whyNotClosed),
    why: "A 'done' or 'partial' route carries a result and a result module; every route has title, summary and whyNotClosed.",
  },
  {
    id: 'rr-no-qed-language',
    holds: () => !RESEARCH_ROUTES.some((r) => /\b(proves RH|RH proved for ζ|QED)\b/.test(`${r.summary} ${r.whyNotClosed} ${r.result ?? ''}`)),
    why: 'No route text claims a proof of RH.',
  },
]);

for (const a of RESEARCH_ROUTES_ASSERTIONS) {
  if (!a.holds()) throw new Error(`research-routes-roadmap assertion failed: ${a.id} — ${a.why}`);
}
