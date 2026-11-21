/**
 * Evidence-graded chronology for the de Bruijn--Newman constant.
 *
 * Peer-reviewed results and public unrefereed certificate claims share one
 * chronological display, but `status` and `accepted` prevent the latter from
 * being silently promoted to established theorems. Internal estimates are
 * excluded from the bound rows; retained audit milestones use `bound: null`
 * and `direction: null`.
 */

export const LAMBDA_TIMELINE = [
  {
    year: 1950,
    authors: ['N.G. de Bruijn'],
    bound: 0.5,
    direction: 'upper',
    relation: '≤',
    status: 'peer-reviewed',
    accepted: true,
    method: 'Established existence of the deformation threshold and the classical upper bound.',
    citation: 'N. G. de Bruijn, “The roots of trigonometric integrals,” Duke Math. J. 17 (1950), 197–226.',
    notes: 'Foundational upper bound.',
  },
  {
    year: 1988,
    authors: ['G. Csordas', 'T.S. Norfolk', 'R.S. Varga'],
    bound: -50,
    direction: 'lower',
    relation: '>',
    status: 'peer-reviewed',
    accepted: true,
    method: 'First explicit finite lower bound recorded in the modern bound ledger.',
    citation: 'G. Csordas, T. S. Norfolk, R. S. Varga, Numer. Math. 52 (1988), 483–497.',
    notes: 'Early quantitative lower bound.',
  },
  {
    year: 1991,
    authors: ['H.J.J. te Riele'],
    bound: -5,
    direction: 'lower',
    relation: '>',
    status: 'peer-reviewed',
    accepted: true,
    method: 'Improved explicit lower bound.',
    citation: 'H. J. J. te Riele, “A new lower bound for the de Bruijn-Newman constant,” Numer. Math. 58 (1991), 661–667.',
    notes: 'Improved the earlier −50 lower bound.',
  },
  {
    year: 1991,
    authors: ['G. Csordas', 'A. Ruttan', 'R.S. Varga'],
    bound: -0.0991,
    direction: 'lower',
    relation: '>',
    status: 'peer-reviewed',
    accepted: true,
    method: 'Laguerre inequalities and a close-zero configuration.',
    citation: 'G. Csordas, A. Ruttan, R. S. Varga, Numer. Algorithms 1 (1991), 305–329.',
    notes: 'Substantial tightening of the lower bound.',
  },
  {
    year: 1993,
    authors: ['G. Csordas', 'A.M. Odlyzko', 'W. Smith', 'R.S. Varga'],
    bound: -5.895e-9,
    direction: 'lower',
    relation: '>',
    status: 'peer-reviewed',
    accepted: true,
    method: 'A Lehmer pair of zeta zeros yields a much sharper lower bound.',
    citation: 'G. Csordas, A. M. Odlyzko, W. Smith, R. S. Varga, Electron. Trans. Numer. Anal. 1 (1993), 104–111.',
    notes: 'Close-pair method.',
  },
  {
    year: 2000,
    authors: ['A.M. Odlyzko'],
    bound: -2.63e-9,
    direction: 'lower',
    relation: '>',
    status: 'peer-reviewed',
    accepted: true,
    method: 'A higher close pair of zeta zeros improves the lower bound.',
    citation: 'A. M. Odlyzko, “An improved bound for the de Bruijn-Newman constant,” Numer. Algorithms 25 (2000), 293–303.',
    notes: 'Large-height zero computation.',
  },
  {
    year: 2009,
    authors: ['H. Ki', 'Y.-O. Kim', 'J. Lee'],
    bound: 0.5,
    direction: 'upper',
    relation: '<',
    status: 'peer-reviewed',
    accepted: true,
    method: 'Strictly improved de Bruijn’s original upper bound.',
    citation: 'H. Ki, Y.-O. Kim, J. Lee, “On the de Bruijn-Newman constant,” Adv. Math. 222 (2009), 281–306.',
    notes: 'The result is strict < 0.5; the numeric field marks the displayed threshold.',
  },
  {
    year: 2011,
    authors: ['Y. Saouter', 'X. Gourdon', 'P. Demichel'],
    bound: -1.14541e-11,
    direction: 'lower',
    relation: '>',
    status: 'peer-reviewed',
    accepted: true,
    method: 'A new Lehmer pair gives the pre-Rodgers–Tao lower-bound record.',
    citation: 'Y. Saouter, X. Gourdon, P. Demichel, Math. Comp. 80 (2011), 2281–2287.',
    notes: 'Strongest numerical lower bound before Λ ≥ 0.',
  },
  {
    year: 2019,
    authors: ['D.H.J. Polymath'],
    bound: 0.22,
    direction: 'upper',
    relation: '≤',
    status: 'peer-reviewed',
    accepted: true,
    method: 'Effective heat-flow approximation and a certified barrier argument.',
    citation: 'D. H. J. Polymath, Res. Math. Sci. 6 (2019), article 31; arXiv:1904.12438.',
    notes: 'Published Polymath15 upper bound.',
  },
  {
    year: 2020,
    authors: ['B. Rodgers', 'T. Tao'],
    bound: 0,
    direction: 'lower',
    relation: '≥',
    status: 'peer-reviewed',
    accepted: true,
    method: 'Proved Newman’s conjecture that the constant is non-negative.',
    citation: 'B. Rodgers, T. Tao, Forum of Mathematics, Pi 8 (2020), e6.',
    notes: 'Together with Λ ≤ 0, this makes RH equivalent to Λ = 0.',
  },
  {
    year: 2021,
    authors: ['D. Platt', 'T. Trudgian'],
    bound: 0.2,
    direction: 'upper',
    relation: '≤',
    status: 'peer-reviewed',
    accepted: true,
    method: 'Certified zero verification combined with the Polymath15 barrier criterion.',
    citation: 'D. Platt, T. Trudgian, Bull. Lond. Math. Soc. 53 (2021), 792–797.',
    notes: 'Peer-reviewed upper-bound benchmark used by this app.',
  },
  {
    year: 2026,
    authors: ['Mosaic Intelligence'],
    bound: 0.1965,
    direction: 'upper',
    relation: '≤',
    status: 'public-unrefereed',
    accepted: false,
    method: 'Public certificate-package claim using an Euler-3 mollifier route.',
    citation: 'Mosaic Intelligence, Zenodo 20724170 (2026).',
    href: 'https://doi.org/10.5281/zenodo.20724170',
    notes: 'Listed by the Optimization Problems ledger; listing is not peer review or endorsement.',
  },
  {
    year: 2026,
    authors: ['Mosaic Intelligence'],
    bound: 0.1875,
    direction: 'upper',
    relation: '≤',
    status: 'public-unrefereed-local-repair',
    accepted: false,
    method: 'Public window-tiling certificate-package claim.',
    citation: 'Mosaic Intelligence, Zenodo 21175533 (2026).',
    href: 'https://doi.org/10.5281/zenodo.21175533',
    notes:
      'A local forensic audit reconstructed an omitted 2,054,013-row finite tile. ' +
      'The repaired replay is reproducible, but remains unrefereed.',
  },
  {
    year: 2026,
    authors: ['ZPO Engine (mathexplorer project)'],
    bound: null,
    direction: null,
    relation: null,
    reportedBound: 7.98e-4,
    status: 'internal-conditional-audit',
    accepted: false,
    method: 'Conditional development record: an asymptotic value Lambda <= 7.98e-4 was obtained from an interval-arithmetic OLS enclosure on the Dyson collision-time asymptote (a <= 7.673e-4) and the Ingham truncation error (E_trunc_pt = 3.06e-5). The argument used imp-341 and imp-1149, but read them through an assumed linear-1/N expansion rather than a direct triangle-inequality path.',
    citation: 'mathexplorer auto-improvement engine, imp-1147 / imp-1162 (2026-05-20). Internal development result.',
    notes: 'Not a Lambda-bound row: the formulation assumes |t_c(N)| = a + b/N + o(1/N), with no rigorous bound on the o(1/N) residual. It was re-examined in imp-1246.',
  },
  {
    year: 2026,
    authors: ['ZPO Engine (mathexplorer project)'],
    bound: null,
    direction: null,
    relation: null,
    reportedBound: 3.06e-5,
    status: 'internal-retracted-audit',
    accepted: false,
    method: 'OVERCLAIM CORRECTED (audit 2026-07): a composed asymptotic value Lambda <= 3.06e-5 was derived (imp-1261) via the triangle inequality on |t_c(N)|, but it is NOT a rigorous sub-PT bound. It is conditional on the RH-EQUIVALENT Holder-1/2 shock modulus C_H / G6a (imp-2640 Gronwall discharge NEGATIVE, imp-35147 RH-equivalent), an uncertified E_trunc constant (imp-34791 prefactor bug -> honest ~= 5.1e-5; imp-1324 Ramare line wrong ~9.5e7), and an unsupplied E(N) -> 0 (imp-35164: E(N) floors at E_trunc, does not vanish). The |t_c(N)| -> 0 leg bounds a Stieltjes-transform PROXY (imp-2563 R_A open) on a repo-refuted M_infty rate step (imp-2621). Only limsup |t_c^proxy| = 0 is unconditional, and it is INERT (does not bound Lambda).',
    citation: 'mathexplorer auto-improvement engine, imp-1246 / imp-1261 (2026-05-28); OVERCLAIM CORRECTED by 3-auditor review 2026-07. Internal development record, NOT a rigorous bound.',
    notes: 'NOT a rigorous unconditional bound. The earlier "unconditional modulo Polymath15 G6a only / ~26x tighter" framing is retracted: G6a is RH-equivalent and not the sole gate, the constant is uncertified, and E(N) does not vanish. The only unconditional Lambda upper bound remains Platt-Trudgian Lambda <= 0.2. Listed here only to preserve the development record; the value is not a certified frontier.',
  },
  {
    year: 2026,
    authors: ['ZPO Engine (mathexplorer project)', 'Twin-Ladder v52 paper integration team'],
    bound: null,
    direction: null,
    relation: null,
    status: 'internal-infrastructure-milestone',
    accepted: false,
    method: 'Engine infrastructure milestone: WAVE 13 seeded 18 critical tasks including 6 new visualization pages (/viz-prime-caustic, /viz-prime-phase-crystal, /viz-euler-transport-flow, /viz-log-phase-spiral, /viz-hyperbolic-prime-spiral, /viz-twin-ladder-tomography), 5 paper audits (Conjectures 15.2, 15.3, 17.3, 18.4), and foundational pieces for Twin-Ladder v52 integration including the paper-audit-dashboard and twin-ladder-paper-roadmap master index.',
    citation: 'mathexplorer auto-improvement engine, WAVE 13 commit 4258d58f (2026-05-26).',
    notes: 'Infrastructure and visualization milestone; no bound update. Establishes the 13/13 paper audit structure and lays foundation for v52 paper landing and Twin-Ladder integration work.',
  },
  {
    year: 2026,
    authors: ['ZPO Engine (mathexplorer project)'],
    bound: null,
    direction: null,
    relation: null,
    status: 'internal-audit-milestone',
    accepted: false,
    method: 'Content and proof audit milestone: imp-1235 completed (lambda-roadmap vs paper §24 crosswalk with 15 entries and 8 tripwires); multiple conjectures audited and classified as SUBSUMED-BY-RH (Conjectures 15.2, 15.3, 17.3, 18.4 via imp-1229, imp-1230, imp-1232); README refreshed with wave-11/12 paper pages status; foundational /viz pages rendered live.',
    citation: 'mathexplorer auto-improvement engine, imp-1235 and subsidiary audits (2026-05-27).',
    notes: 'Content and audit consolidation day: paper audit structure stabilized with RH-subsumption verdicts. No bound update but critical context for subsequent structural collapse work.',
  },
  {
    year: 2026,
    authors: ['ZPO Engine (mathexplorer project)'],
    bound: null,
    direction: null,
    relation: null,
    status: 'internal-corrected-proof-milestone',
    accepted: false,
    method: 'Proof milestone: Conjecture 27.2 PROVEN for all a>0 (imp-1260, Wiener-Hopf + HS union closure). WAVE 19 seeded 14 new RH approach tickets (imp-1306 through imp-1324) targeting Montgomery PCC routes, Beurling-Nyman direct approach, sigma-reopt within Ingham, and final Lambda tightening follow-ups. Five RH-attack routes exhaustively audited; PCC closure requires new external input. Decision docs from this period framed Lambda 3.06e-5 as a literature-only frontier with G6a citation-conditional -- CORRECTED by the 2026-07 audit: 3.06e-5 is NOT a rigorous bound and G6a / C_H is RH-EQUIVALENT and mathematically open (imp-2640 NEGATIVE, imp-35147), not merely citation-conditional. Platt-Trudgian Lambda <= 0.2 remains the only unconditional bound.',
    citation: 'mathexplorer auto-improvement engine, imp-1260 + WAVE 19 seeded (2026-05-28), decision docs (2026-05-28 and 2026-05-29).',
    notes: 'Major structural milestone: Conj 27.2 proof unification (two-way collapse ‖V_{a,Φ}‖ ≤ 1 ⇔ CDB-Exist) + final Lambda tightening phase and PCC route exhaustion determination. Establishes end-of-cycle point before new external developments.',
  },
  {
    year: 2026,
    authors: ['Jude Gomila', 'AI fleet — Claude, Codex, ChatGPT — with human work'],
    bound: 0.1787854,
    direction: 'upper',
    relation: '≤',
    status: 'computer-assisted candidate',
    accepted: false,
    method: 'Computer-assisted candidate for an unconditional bound via the twin-ladder mollified-barrier method (compact slab, final-time zero-free half-strip, 3,149,013-row interval-arithmetic replay, exact Polymath criterion weld). Reviewed by Dan Romik and publicly posted (judegomila.com/posts/riemann-lambda-0.1787854). Not yet a peer-reviewed publication; not itself RH.',
    citation: 'mathexplorer / zetaexplorer barrier-certificate package (2026); reviewed by Dan Romik.',
    notes: 'Candidate: reviewed by Dan Romik, publicly posted, not refereed. RH remains open.',
  },
  {
    year: 2026,
    authors: ['Jude Gomila', 'AI fleet — Claude, Codex, ChatGPT — with human work'],
    bound: 0.1758354,
    direction: 'upper',
    relation: '≤',
    status: 'computer-assisted candidate',
    accepted: false,
    method: 'Sharper computer-assisted candidate: a revised mollifier and an extended finite lane certify four gates (each machine-checked in Arb interval arithmetic; the y-transfer reduction and Lemma B3 Lean-checked). Below the 0.1787854 candidate.',
    citation: 'mathexplorer / zetaexplorer four-gate barrier certificate (2026).',
    notes: 'Candidate, unrefereed. RH remains open.',
  },
  {
    year: 2026,
    authors: ['Jude Gomila', 'AI fleet — Claude, Codex, ChatGPT — with human work'],
    bound: 0.17759432,
    direction: 'upper',
    relation: '≤',
    status: 'computer-assisted candidate',
    accepted: false,
    method: 'y-thaw package (stages 1+2, 2026-09): candidate-unrefereed. The package has six obligations O1–O6; as of the record of 2026-09-22, 2 of 6 are closed (O3 error budget and O5 site coverage, certified 2026-09-10) and 4 are open (O1, O2, O4, O6). The theorem behind O1 is Lean-checked with gates G1–G4 as hypotheses; the gate computation is not done, so O1 is open. A package value, not a bound — nothing is claimed unless all obligations close. Status per obligation on /frontier-dag and the y-thaw research thread.',
    citation: 'mathexplorer / zetaexplorer y-thaw obligation package (2026-09).',
    notes: 'Candidate, unrefereed; 2 of 6 obligations closed (O3, O5). RH remains open.',
  },
];

export const LAMBDA_TIMELINE_ASSERTIONS = [
  {
    id: 'timeline-chronological',
    description: 'Timeline entries are in non-decreasing year order',
    holds: () => LAMBDA_TIMELINE.every(
      (entry, index) => index === 0 || entry.year >= LAMBDA_TIMELINE[index - 1].year,
    ),
  },
  {
    id: 'timeline-directions-and-grades-are-explicit',
    description: 'Every bound row has a direction; every audit row is non-bound; all rows are graded',
    holds: () => LAMBDA_TIMELINE.every(
      (entry) =>
        (
          (Number.isFinite(entry.bound) &&
            (entry.direction === 'upper' || entry.direction === 'lower')) ||
          (entry.bound === null && entry.direction === null)
        ) &&
        typeof entry.status === 'string' &&
        typeof entry.accepted === 'boolean',
    ),
  },
  {
    id: 'timeline-rodgers-tao-present',
    description: 'Rodgers-Tao 2020 (Lambda >= 0) is in the timeline',
    holds: () => LAMBDA_TIMELINE.some(
      (entry) =>
        entry.authors.some((author) => author.includes('Rodgers')) &&
        entry.bound === 0 &&
        entry.direction === 'lower' &&
        entry.accepted,
    ),
  },
  {
    id: 'timeline-peer-reviewed-pt-benchmark-present',
    description: 'Platt-Trudgian 2021 Lambda <= 0.2 is the accepted benchmark',
    holds: () => LAMBDA_TIMELINE.some(
      (entry) =>
        entry.authors.some((author) => author.includes('Platt')) &&
        entry.bound === 0.2 &&
        entry.direction === 'upper' &&
        entry.accepted,
    ),
  },
  {
    id: 'timeline-public-claims-remain-unaccepted',
    description: 'The 2026 public package claims are not promoted to accepted theorems',
    holds: () => LAMBDA_TIMELINE.filter((entry) => entry.status.startsWith('public-')).every(
      (entry) => entry.accepted === false,
    ),
  },
  {
    id: 'timeline-excludes-internal-model-bounds',
    description: 'Internal engine records are retained only as unaccepted, non-bound audit milestones',
    holds: () => LAMBDA_TIMELINE.filter(
      (entry) => entry.authors.some((author) => /ZPO Engine|mathexplorer/i.test(author)),
    ).every(
      (entry) => entry.bound === null && entry.direction === null && entry.accepted === false,
    ),
  },
  {
    id: 'timeline-july-retraction-preserved',
    description: 'The July 2026 correction of the 3.06e-5 overclaim remains explicit',
    holds: () => LAMBDA_TIMELINE.some(
      (entry) =>
        entry.reportedBound === 3.06e-5 &&
        entry.status === 'internal-retracted-audit' &&
        entry.accepted === false &&
        /NOT a rigorous/i.test(entry.notes),
    ),
  },
  {
    id: 'timeline-accepted-upper-bounds-tighten',
    description: 'Accepted upper bounds are non-increasing over time',
    holds: () => {
      const upper = LAMBDA_TIMELINE.filter(
        (entry) => entry.direction === 'upper' && entry.accepted,
      );
      return upper.every(
        (entry, index) => index === 0 || entry.bound <= upper[index - 1].bound,
      );
    },
  },
  {
    id: 'timeline-lower-bounds-tighten',
    description: 'Accepted lower bounds are non-decreasing over time',
    holds: () => {
      const lower = LAMBDA_TIMELINE.filter(
        (entry) => entry.direction === 'lower' && entry.accepted,
      );
      return lower.every(
        (entry, index) => index === 0 || entry.bound >= lower[index - 1].bound,
      );
    },
  },
];

/** Returns all upper-bound rows, including explicitly graded public claims. */
export function getUpperBounds() {
  return LAMBDA_TIMELINE.filter((entry) => entry.direction === 'upper').sort(
    (left, right) => left.bound - right.bound,
  );
}

/** Returns accepted upper-bound rows only. */
export function getEstablishedUpperBounds() {
  return getUpperBounds().filter((entry) => entry.accepted);
}

/** Returns lower-bound rows, strongest first. */
export function getLowerBounds() {
  return LAMBDA_TIMELINE.filter((entry) => entry.direction === 'lower').sort(
    (left, right) => right.bound - left.bound,
  );
}

/** Tightest ledger row; inspect `accepted` before describing it as a theorem. */
export function getBestUpperBound() {
  return getUpperBounds()[0] ?? null;
}

/** Tightest peer-reviewed/accepted upper bound. */
export function getBestEstablishedUpperBound() {
  return getEstablishedUpperBounds()[0] ?? null;
}

export function getBestLowerBound() {
  return getLowerBounds()[0] ?? null;
}

export default LAMBDA_TIMELINE;
