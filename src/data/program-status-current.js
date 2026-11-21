// Current status of the program, one statement per topic, each with the file
// of this repository that supports it. Read by the status pages
// (/state-of-program, /what-we-know, /lambda-bounds, the Research home page)
// and by the snapshot banner on dated status pages.
//
// Rules for editing this file:
//   - every statement is taken from the `source` file named beside it;
//   - conditional results name their conditions in the same sentence;
//   - third-party claims are attributed and carry the status the record gives;
//   - `asOf` is the date of the newest source reflected here.
//
// No imports: this module must stay light and must never pull in the zeros
// bundle through a page import.

export const PROGRAM_STATUS_AS_OF = '2026-11-20';

const REPO_BLOB = 'https://github.com/judegomila/zeta-explorer/blob/main/';
export const sourceUrl = (path) => REPO_BLOB + path;

const PUSH = 'research-checkpoints/rh-push-2026-11-16/';
const MAP = PUSH + 'fleet-lanes/OBSTRUCTION_MAP.md';

export const PROGRAM_STATUS = [
  {
    id: 'rh-open',
    group: 'rh',
    label: 'Riemann Hypothesis',
    value: 'open',
    statement:
      'The Riemann Hypothesis is open. Nothing in this repository proves it, and no work recorded here gives new ' +
      'information about the location of any zero of ζ.',
    sources: [MAP],
  },
  {
    id: 'lambda-accepted',
    group: 'lambda',
    label: 'Accepted bounds on Λ',
    value: '0 ≤ Λ ≤ 0.2',
    statement:
      'The accepted bounds on the de Bruijn–Newman constant are Λ ≥ 0 (Rodgers–Tao 2020) and Λ ≤ 0.2 ' +
      '(Platt–Trudgian 2021, peer reviewed). Neither is a result of this project. No work in this repository ' +
      'changes an unconditional bound.',
    sources: [MAP],
  },
  {
    id: 'lambda-conditional-0116091',
    group: 'lambda',
    label: 'Smallest conditional value',
    value: 'Λ ≤ 0.116091488672439',
    statement:
      'Λ ≤ 116091488672439/10¹⁵ = 0.116091488672439 holds if four inputs hold: (1) ζ(s) ≠ 0 for Re s > 7/8 ' +
      '(openai/math family 003; Lean proof rebuilt locally with standard axioms only; not peer reviewed), ' +
      '(2) D. J. Raymond’s decreasing-barrier chain (Zenodo 10.5281/zenodo.22867547; unrefereed), ' +
      '(3) the Platt–Trudgian verification of RH to height 3000175332800 (peer reviewed), and (4) this project’s ' +
      'internal floor and kernel certificates. With (1)–(3) only, the same argument gives 0.118505710922701. ' +
      'Three of the four inputs are not established: (1) and (2) are unrefereed, and (4) is internal and partly ' +
      'uncertified (89 of its 468 floor entries rest on a measured allowance of 0.0023 and an unreviewed lemma). ' +
      'Earlier wording counted two; that count fits 0.118505710922701 (corrected 2026-11-21). ' +
      'This is not an established bound. Draft of 9 October 2026; not submitted, ' +
      'not peer reviewed.',
    route: '/lambda-0116091',
    sources: ['papers/lambda-qrh-0.116091/README.md', 'src/data/qrh-path-push-2026-10-08.js'],
  },
  {
    id: 'lambda-conditional-claimed-abscissa',
    group: 'lambda',
    label: 'Same chain at a claimed smaller abscissa',
    value: '0.116060108665412',
    statement:
      'If the zero-free half-plane is taken at the abscissa 0.87488665 claimed in preprints (not checked here, not in ' +
      'Lean), a fixed-mode replay of the same chain gives 0.116060108665412. This value carries the conditions of ' +
      '0.116091 and additionally depends on that unrefereed abscissa.',
    sources: [MAP, PUSH + 'campaign/SCOREBOARD.md'],
  },
  {
    id: 'lambda-candidates-unconditional',
    group: 'lambda',
    label: 'This project’s unconditional candidates',
    value: 'Λ ≤ 0.1758354 and Λ ≤ 0.1787854',
    statement:
      'Λ ≤ 0.1787854 and Λ ≤ 0.1758354 are computer-assisted candidates of this project for an unconditional bound. ' +
      'Neither is refereed and neither is established. 0.1787854 was reviewed by Dan Romik and is publicly posted (judegomila.com/posts/riemann-lambda-0.1787854). 0.1758354 is the smaller of the two. The smaller values listed ' +
      'here (0.116091 and the route-P value) depend on D. J. Raymond’s unrefereed chain, and 0.116091 also on the ' +
      'half-plane Re s > 7/8.',
    route: '/lambda-01758354-candidate',
    sources: [
      'research-checkpoints/vortex-blocker-reduction-2026-11-01/README.md',
      'formalization/rh-attempts/2026-11-01-r3-heegner-heights.md',
    ],
  },
  {
    id: 'lambda-route-p-0144997',
    group: 'lambda',
    label: 'Route P value 0.144997',
    value: 'unconfirmed below 0.145',
    statement:
      'The route-P value 0.144997328111268 (conditional on Raymond’s chain and the internal route-P ledger) is ' +
      'unconfirmed below 0.145. It uses 369 floors, 36 of them on incomplete covers; an independent re-certification ' +
      'confirmed 0 of those 36, and with the 36 excluded the same computation returns 0.145135157752420. The ' +
      're-certification record itself has no referee pass.',
    sources: [MAP, PUSH + 'fleet-lanes/b-route-p-recert/RESULT.md'],
  },
  {
    id: 'lambda-packages',
    group: 'lambda',
    label: 'Package and contract values',
    value: '0.17759432 and 0.14 are not bounds',
    statement:
      '0.17759432 is the value of the y-thaw package. The package has six obligations O1–O6; 2 are closed (O3, O5) and 4 are open (O1, O2, O4, O6), per the record of 2026-09-22. It is not a bound. ' +
      'Λ ≤ 0.14 is a completion contract with one open family; it is not a bound.',
    route: '/permutation-architecture',
    sources: ['src/data/graded-results.js', 'src/data/frontier-dag.js', 'src/data/imp-95140-ythaw-obligation-ledger.js', 'formalization/y-thaw-01775943/SHARP_WEIGHT_NATIVE_BINDING.md', 'formalization/lean-aristotle/sharp_mass_monotonicity/ARISTOTLE_SUMMARY.md'],
  },
  {
    id: 'lambda-third-party-0107965',
    group: 'lambda',
    label: 'Third-party claim',
    value: 'Λ ≤ 0.107964910079 (D. J. Raymond), partly checked',
    statement:
      'D. J. Raymond claims Λ ≤ 0.107964910079 in a 63-page computer-assisted manuscript. It is a third-party claim, ' +
      'not a result of this project, and it depends on the unrefereed half-plane Re s > 7/8. Status in this ' +
      'repository’s record (report of 2026-11-17): replayed and partially refereed, not verified. The author’s ' +
      'exact-rational checker was replayed in full (15 stages) and the stage that fixes the final fraction was ' +
      're-implemented independently (221,010 arcs, 0 failures). Not confirmed: Proposition 3.2 of the manuscript ' +
      'is not proved in the paper, and each analytic part had one internal reading only.',
    sources: [PUSH + 'fleet-lanes/verify-0107965/VERIFICATION_REPORT.md', PUSH + 'campaign/SCOREBOARD.md'],
  },
  {
    id: 'zero-free',
    group: 'zeros',
    label: 'Zero-free half-plane',
    value: 'Re s > 7/8 Lean-checked; smaller abscissae claimed in preprints',
    statement:
      'ζ(s) ≠ 0 for Re s > 7/8 is a Lean theorem of the openai/math release of 2026-10-06 (family 003; the release ' +
      'states its manuscripts were produced by a model). The Lean proof was rebuilt locally and depends only on the ' +
      'axioms propext, Classical.choice and Quot.sound. It is not peer reviewed. Preprints claim smaller abscissae: ' +
      '0.8748875 and 0.8748867 (Xu–Sang, arXiv:2610.15291) and a method infimum 0.874886647 (Liu, arXiv:2610.26835). ' +
      'These are not in Lean, several manuscript lemmas were not checked here, and none is refereed. No abscissa ' +
      'below 0.874886647 is proved at any level.',
    sources: [MAP, 'formalization/external/openai-math-qrh-verification.md', 'formalization/external/openai-math-survey.md'],
  },
  {
    id: 'direct-attempts',
    group: 'rh',
    label: 'Direct attempts at RH',
    value: 'all failed; one obstruction map',
    statement:
      'Fifteen written attempts at RH were made in three rounds on 2026-11-01; each was attacked by an internal ' +
      'referee and all fifteen fail. A further push on 2026-11-16/17 ran 196 lanes (186 with an internal referee ' +
      'pass); on the campaign’s four requirements for a mechanism outside the 7/8 method, every lane has a ' +
      'referee-confirmed score of 0 of 4. The record is one obstruction map: for every route, where it stops and ' +
      'which control function defeats it.',
    sources: [
      'formalization/rh-attempts/2026-11-01-synthesis.md',
      'formalization/rh-attempts/2026-11-01-r2-synthesis.md',
      'formalization/rh-attempts/2026-11-01-r3-synthesis.md',
      MAP,
      PUSH + 'campaign/SCOREBOARD.md',
    ],
  },
  {
    id: 'obstruction-controls',
    group: 'rh',
    label: 'The common obstruction',
    value: 'seven control functions',
    statement:
      'The obstruction map uses seven control functions: the Davenport–Heilbronn function, the backward heat family, ' +
      'the two sign twists of the von Mangoldt function, E_a(s) = ζ(s+a)ζ(s−a), the T-NR twin, and Beurling zeta ' +
      'functions. Each lacks at least one of four properties of ζ (the functional equation, the size normalisation, ' +
      'unimodular local parameters, an ordinary Dirichlet series). A valid argument for RH must fail on each ' +
      'control at a named step. Every route recorded ends at the same requirement: an inequality that is uniform in ' +
      'height and holds in every window. The common finding is that positivity and support of the von Mangoldt ' +
      'function together with the functional equation do not suffice; a proof must use multiplicativity in an ' +
      'essential step.',
    sources: [MAP, PUSH + 'direct-attacks/README.md'],
  },
  {
    id: 'arithmetic-theta',
    group: 'rh',
    label: 'Arithmetic theta completion (2026-11-20)',
    value: 'conditional manuscript',
    statement:
      'The arithmetic theta completion checkpoint is a conditional research manuscript with an audit package. It is ' +
      'not an unconditional proof of RH: the arithmetic Gram comparison (or the alternative growth-data construction ' +
      'and total error estimate) remains open.',
    sources: ['research-checkpoints/rh-arithmetic-theta-2026-11-20/README.md'],
  },
  {
    id: 'lean-november',
    group: 'formal',
    label: 'Lean formalisations added in November 2026',
    value: 'Lee–Yang circle theorem (2 theorems, 407 lines) in a batch of 8 files; 7 files (29 theorems) for PR-48',
    statement:
      'Two sets of Lean 4 / Mathlib files were added. (a) 2026-11-20: the multivariate Lee–Yang circle theorem in ' +
      'occupation form (2 theorems, 407 lines) and parts (i) to (iii) of the stage theorem (6 theorems, 292 lines), ' +
      'checked locally with Lean v4.28.0, standard axioms only, no sorry. They are two files of an eight-file batch; ' +
      'the batch total is 44 theorems and 2576 lines, and the other six files (36 theorems, 1877 lines) are on other ' +
      'topics (corrected 2026-11-21: the batch total had been quoted as the size of the Lee–Yang formalisation). (b) 2026-11-16: seven files, 29 theorems, 1612 ' +
      'lines, no sorry, for the PR-48 theta-bridge residual target. A written theorem with one internal referee pass ' +
      'identifies that residual target with Weil’s quadratic functional on one-sided tests (this identity is not in ' +
      'Lean); the Lean files check its ' +
      'Pick-matrix / Schur-complement equivalence for Mathlib’s ξ, and the equivalence with RH only as a logical ' +
      'assembly with two analytic statements as named hypotheses. None of these statements bears on whether RH is ' +
      'true, and no bound changes.',
    sources: [
      PUSH + 'fleet-lanes/lean-harmonic-rh-push/RESULT.md',
      PUSH + 'fleet-lanes/b-lean-eq48/RESULT.md',
      PUSH + 'equivalence-and-pick/README.md',
    ],
  },
  {
    id: 'observatory',
    group: 'site',
    label: 'Observatory',
    value: 'served at /observatory/',
    statement:
      'The Observatory, a geometry workbench for ζ, is served from /observatory/ and is the first page of the site. ' +
      'It includes an Arb interval certificate that the 1517 zeros of ζ below height 2000 are on the critical line; ' +
      'this range is far inside the published verification.',
    href: './observatory/',
    sources: ['observatory/README.md', 'observatory/docs/ZERO-LINE-CERTIFICATE.md'],
  },
  {
    id: 'repository',
    group: 'site',
    label: 'Repository',
    value: 'judegomila/zeta-explorer since 2026-11-20',
    statement:
      'The source is the repository judegomila/zeta-explorer, created on 2026-11-20 from an earlier private ' +
      'repository. Every commit keeps its original author and date; commit hashes and pull-request numbers changed, ' +
      'and a map from the old ones is in the repository.',
    href: 'https://github.com/judegomila/zeta-explorer',
    sources: ['docs/old-repository-map/README.md'],
  },
];

export const PROGRAM_STATUS_BY_ID = Object.fromEntries(PROGRAM_STATUS.map((s) => [s.id, s]));

// One-paragraph summary used in page leads. Every clause repeats an entry above.
export const PROGRAM_STATUS_SUMMARY =
  'RH is open. The smallest value recorded in this project is Λ ≤ 0.116091488672439, which holds only if three ' +
  'inputs that are not established hold (the zero-free half-plane Re s > 7/8 and D. J. Raymond’s decreasing-barrier ' +
  'chain, both unrefereed, and this project’s internal, partly uncertified floor and kernel tables) together with the ' +
  'Platt–Trudgian verified height; with the two external results alone the value is 0.118505710922701. It is not an ' +
  'established bound. ' +
  'The project’s candidates for an unconditional bound, Λ ≤ 0.1758354 and Λ ≤ 0.1787854, are computer-assisted and ' +
  'unrefereed. The earlier route-P value 0.144997 is unconfirmed below 0.145. No bound of this project is refereed.';

// Values that older pages show as the program's leading number, with what replaced them.
export const SUPERSEDED_HEADLINES = [
  {
    value: 'Λ ≤ 0.1787854',
    was: 'smallest candidate of this project (2026-08)',
    now: 'still an unrefereed candidate; superseded as the smaller of the two unconditional candidates by 0.1758354',
  },
  {
    value: 'Λ ≤ 0.1758354',
    was: 'smallest value recorded by this project (2026-08 to 2026-10)',
    now:
      'still an unrefereed candidate for an unconditional bound; no longer the smallest recorded value: the ' +
      'conditional 0.116091488672439 (2026-10-09) is smaller and depends on three inputs that are not established (two unrefereed external results and this project’s own partly uncertified tables)',
  },
  {
    value: 'U ≈ 0.145–0.150 and 0.144997',
    was: 'route-VII compute floor and route-P value (2026-09 to 2026-10)',
    now:
      'the route-P value 0.144997328111268 is unconfirmed below 0.145 (re-certification of 2026-11-16/17: 0 of 36 ' +
      'floors confirmed; 0.145135157752420 without them)',
  },
];

// Self-check at import: ids unique, every entry has a statement and a source,
// the as-of date is an ISO date. A failure here would blank the pages that
// import this module, so the checks are structural only.
(() => {
  const ids = new Set();
  for (const s of PROGRAM_STATUS) {
    if (!s.id || ids.has(s.id)) throw new Error(`program-status-current: duplicate or missing id ${s.id}`);
    ids.add(s.id);
    if (!s.statement || !Array.isArray(s.sources) || s.sources.length === 0) {
      throw new Error(`program-status-current: ${s.id} needs a statement and a source`);
    }
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(PROGRAM_STATUS_AS_OF)) throw new Error('program-status-current: bad as-of date');
})();
