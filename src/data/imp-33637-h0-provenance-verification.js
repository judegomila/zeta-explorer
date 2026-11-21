/**
 * @module imp-33637-h0-provenance-verification
 *
 * imp-33637 (content, provenance-audit): VERIFY the imp-33603 H0 provenance residual -- check the
 * verbatim hypothesis list of "Polymath15 / Tao, arXiv:1802.05390v3, Lemma 5.2" against the imp-33603
 * structural H1..H5 reconstruction, and record which of the five reconstructed hypotheses match the
 * published lemma text vs which are repo-side structural inferences. imp-33603 left H0 OPEN: "the
 * H1..H5 catalogue is a structural reconstruction from the repo scaffold ... NOT a verbatim
 * transcription of the arXiv text. Confirming the verbatim hypothesis list against the arXiv source is
 * itself flagged below as part of the scoping residual (H0)."
 *
 * VERIFICATION RESULT: TWO INDEPENDENT MIS-CITATIONS, NOT A CONFIRMATION
 * ------------------------------------------------------------------------
 * (1) WRONG ARXIV ID. arXiv:1802.05390 is NOT a Polymath15 / de Bruijn-Newman paper -- that identifier
 *     belongs to an unrelated PDE paper on asymptotic stability of a 1-D compressible Navier-Stokes-
 *     Cahn-Hilliard system. The actual Polymath15 paper -- "Effective approximation of heat flow
 *     evolution of the Riemann xi function, and a new upper bound for the de Bruijn-Newman constant",
 *     D.H.J. Polymath -- is arXiv:1904.12438 (checked v2, 4 Aug 2019, 68 pages, Section 5 titled
 *     "Elementary estimates").
 * (2) NO LEMMA 5.2 EXISTS. Even under the corrected id arXiv:1904.12438, Section 5 contains exactly ONE
 *     numbered lemma -- Lemma 5.1 ("Elementary estimates. Let x > 0.") -- a set of elementary numerical
 *     bounds (monotonicity / decay estimates on x > 0) feeding the Section 6-8 numerics. There is no
 *     Lemma 5.2 anywhere in the paper. Lemma 5.1's actual subject matter has nothing to do with a fold
 *     catastrophe, a Holder-1/2 blow-up modulus, a curvature lower bound, perturbation-strip control, or
 *     a Riemann-Hilbert transcription -- the subject matter the repo's H1..H5 catalogue describes.
 *
 * CONSEQUENCE FOR H0 AND FOR H1..H5
 * ----------------------------------
 * The verbatim-transcription check H0 asked for cannot be performed AS POSED, because the cited lemma
 * does not exist under either the given or the corrected arXiv id. So none of H1..H5 can be scored as
 * "matches the published lemma text" -- ALL FIVE remain, and must stay, REPO-SIDE STRUCTURAL INFERENCES
 * with zero verified matches to any actual Polymath15 lemma. H0 does NOT close here; it upgrades from
 * "provenance unconfirmed" to "citation identified as incorrect", which is a STRONGER (more negative)
 * finding than the original OPEN mark, not a resolution of it.
 *
 * SCOPE OF THIS MODULE (deliberately narrow / atomic)
 * -----------------------------------------------------
 * This module performs and records ONLY the H0 verbatim-provenance check requested by imp-33637. The
 * "Polymath15 Lemma 5.2" mis-citation recurs across 17 files / 49 occurrences of "1802.05390" repo-wide
 * (lambda-polymath15-bridge.js, lambda-burgers-shock-lipschitz.js, polymath15-lemma52-shock-holder.js,
 * sota-lambda-claim.js, glossary.js, and others) -- correcting all of them is a separate, larger change
 * and is explicitly OUT OF SCOPE here; it is left as a follow-up ticket (correct the arXiv id repo-wide
 * and either retire the "Lemma 5.2" label or identify what source the shock/fold-catastrophe argument
 * was actually meant to cite). This module does not modify any of those 17 files. No positivity, no
 * bridge closure, no RH claim, NO QED. G6a_shock_lipschitz stays OPEN regardless of this citation
 * finding -- the mathematical residual (H4 strip-height-uniformity) is unaffected by which paper is
 * cited for H1/H2; a correct citation would still leave H3/H4/H5 open on the repo's own analysis.
 *
 * @see imp-33603-lemma52-port-scoping (the H1..H5 catalogue + H0 provenance flag being checked here)
 * @see lambda-polymath15-bridge (imp-345: the module that first cites "Polymath15 Lemma 5.2 arXiv:1802.05390v3")
 */

const CITED_ARXIV_ID = '1802.05390';

// What arXiv:1802.05390 actually is (checked directly): an unrelated PDE paper, not Polymath15.
const CITED_ID_ACTUAL_SUBJECT = {
  arxivId: CITED_ARXIV_ID,
  actualTopic: 'asymptotic stability of a 1-D compressible Navier-Stokes-Cahn-Hilliard system',
  isPolymath15DeBruijnNewmanPaper: false,
};

// The real Polymath15 de Bruijn-Newman paper, checked directly (v2, 4 Aug 2019, 68 pages).
const CORRECT_POLYMATH15_PAPER = {
  arxivId: '1904.12438',
  title:
    'Effective approximation of heat flow evolution of the Riemann xi function, and a new upper ' +
    'bound for the de Bruijn-Newman constant',
  author: 'D.H.J. Polymath',
  versionChecked: 'v2 (4 Aug 2019)',
  pageCount: 68,
  section5Title: 'Elementary estimates',
  lemmasInSection5: ['Lemma 5.1'],
  hasLemma52: false,
  lemma51Statement: 'Elementary estimates. Let x > 0.',
  lemma51Subject:
    'elementary numerical monotonicity/decay bounds feeding the Section 6-8 estimates -- unrelated ' +
    'to fold catastrophe, Holder-1/2 modulus, curvature bounds, or Riemann-Hilbert transcription',
};

// The five structural hypotheses imp-33603 catalogued (mirrored here as ids only, for the match table).
const H1_H5_IDS = ['H1', 'H2', 'H3', 'H4', 'H5'];

// Because no Lemma 5.2 exists to check against (under either arXiv id), none of H1..H5 can be scored
// as verified matches to published lemma text -- all five are repo-side structural inferences.
const H1_H5_VERBATIM_MATCH_TABLE = H1_H5_IDS.map((id) => ({
  id,
  matchesPublishedLemmaText: false,
  reasonNoMatch: 'no Lemma 5.2 exists in the correctly-identified Polymath15 paper to check against',
  classification: 'repo-side structural inference',
}));

export const IMP33637_H0_PROVENANCE_VERIFICATION = {
  id: 'imp-33637',
  proofSection: 'S-frontier',
  verifies: 'imp-33603 H0 provenance residual (verbatim hypothesis list of "Polymath15 Lemma 5.2" vs the H1..H5 reconstruction)',
  citedArxivId: CITED_ARXIV_ID,
  citedIdActualSubject: CITED_ID_ACTUAL_SUBJECT,
  correctPolymath15Paper: CORRECT_POLYMATH15_PAPER,
  findings: [
    'wrong-arxiv-id: arXiv:1802.05390 is an unrelated PDE paper, not Polymath15',
    'no-lemma-5.2: the correct paper (arXiv:1904.12438) has only Lemma 5.1 in Section 5, no Lemma 5.2',
  ],
  h1h5VerbatimMatchTable: H1_H5_VERBATIM_MATCH_TABLE,
  matchedCount: 0,
  totalCount: H1_H5_IDS.length,
  h0Resolution: 'upgraded-to-citation-error', // NOT "closed" / NOT "confirmed"
  affectedFilesOutOfScope: 17, // grep -rl "1802.05390" src/ -- correction left as a follow-up ticket
  affectedOccurrencesOutOfScope: 49, // grep -ro "1802.05390" src/ | wc -l
  isRigorous: false,
  verdict:
    'H0 VERIFIED AS A CITATION ERROR, NOT CONFIRMED: arXiv:1802.05390 is not a Polymath15 paper (it is ' +
    'an unrelated Navier-Stokes-Cahn-Hilliard stability paper); the actual Polymath15 de Bruijn-Newman ' +
    'paper (arXiv:1904.12438) contains only Lemma 5.1 (elementary numerical estimates) and no Lemma 5.2 ' +
    'at all. Consequently the requested verbatim check cannot be performed, and all five of H1..H5 stay ' +
    'classified as repo-side structural inferences with ZERO verified matches to any published ' +
    'Polymath15 lemma text. This does not change the mathematical content of imp-33603: G6a_shock_lipschitz ' +
    'stays OPEN, the H4 strip-height-uniformity residual is unaffected, no positivity, no bridge closure, ' +
    'no RH claim, NO QED. imp-3066 off-diagonal endpoint-Hankel K_a >= 0 positivity UNTOUCHED; C_mb share ' +
    'untouched. No refereed bound is changed. The mis-citation recurs in 17 ' +
    'files / 49 occurrences repo-wide and its correction is left as a follow-up ticket, out of scope here.',
  citation:
    'imp-33603-lemma52-port-scoping (the H1..H5 catalogue + H0 flag verified here); arXiv:1904.12438 ' +
    '(D.H.J. Polymath, "Effective approximation of heat flow evolution of the Riemann xi function, and ' +
    'a new upper bound for the de Bruijn-Newman constant", v2, checked directly for this verification).',
};

export const IMP33637_H0_PROVENANCE_VERIFICATION_ASSERTIONS = [
  {
    // The cited id and the correct Polymath15 id must differ (the core mis-citation finding).
    id: 'imp33637-cited-id-is-wrong',
    description: 'the cited arXiv id (1802.05390) differs from the actual Polymath15 paper id (1904.12438)',
    holds: () =>
      CITED_ID_ACTUAL_SUBJECT.arxivId !== CORRECT_POLYMATH15_PAPER.arxivId &&
      CITED_ID_ACTUAL_SUBJECT.isPolymath15DeBruijnNewmanPaper === false,
  },
  {
    // The correct paper has exactly one lemma in Section 5 (Lemma 5.1) and no Lemma 5.2.
    id: 'imp33637-no-lemma-5-2-in-correct-paper',
    description: 'the correct Polymath15 paper has exactly Lemma 5.1 in Section 5 and no Lemma 5.2',
    holds: () =>
      CORRECT_POLYMATH15_PAPER.hasLemma52 === false &&
      CORRECT_POLYMATH15_PAPER.lemmasInSection5.length === 1 &&
      CORRECT_POLYMATH15_PAPER.lemmasInSection5[0] === 'Lemma 5.1',
  },
  {
    // All five hypotheses must be marked as unmatched / structural inferences (no verbatim check possible).
    id: 'imp33637-all-five-unmatched',
    description: 'all five of H1..H5 are recorded as unmatched repo-side structural inferences',
    holds: () =>
      H1_H5_VERBATIM_MATCH_TABLE.length === 5 &&
      H1_H5_VERBATIM_MATCH_TABLE.every(
        (row) => row.matchesPublishedLemmaText === false && row.classification === 'repo-side structural inference',
      ) &&
      IMP33637_H0_PROVENANCE_VERIFICATION.matchedCount === 0,
  },
  {
    // H0 resolution must be recorded as an upgrade to a citation error, not a closure/confirmation.
    id: 'imp33637-h0-not-confirmed',
    description: 'H0 resolves to a citation-error finding, not a confirmation of the H1..H5 catalogue',
    holds: () =>
      IMP33637_H0_PROVENANCE_VERIFICATION.h0Resolution === 'upgraded-to-citation-error' &&
      IMP33637_H0_PROVENANCE_VERIFICATION.findings.length === 2,
  },
  {
    // Honesty gate: not rigorous, G6a stays OPEN, no QED, no refereed bound is changed, imp-3066 untouched.
    id: 'imp33637-honesty-gate-no-qed',
    description: 'Verification only: not rigorous, G6a stays OPEN, no QED, no refereed bound is changed, imp-3066 untouched',
    holds: () =>
      IMP33637_H0_PROVENANCE_VERIFICATION.isRigorous === false &&
      /NO QED/.test(IMP33637_H0_PROVENANCE_VERIFICATION.verdict) &&
      /stays OPEN/.test(IMP33637_H0_PROVENANCE_VERIFICATION.verdict) &&
      /refereed bound is changed/i.test(IMP33637_H0_PROVENANCE_VERIFICATION.verdict) &&
      /imp-3066[^.]*UNTOUCHED/.test(IMP33637_H0_PROVENANCE_VERIFICATION.verdict),
  },
];

for (const a of IMP33637_H0_PROVENANCE_VERIFICATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33637-h0-provenance-verification assertion failed: ${a.id}`);
  }
}
