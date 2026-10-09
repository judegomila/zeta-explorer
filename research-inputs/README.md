# research-inputs/

PDFs of external research papers that feed into the Λ-attack queue.

## Workflow

1. Drop a PDF here (any filename — `bui-soundararajan-2008.pdf`,
   `bourgade-2010-mesoscopic-clt.pdf`, etc.).
2. In a Claude Code session, say:
   > read `research-inputs/<filename>.pdf` and seed tickets for relevant
   > follow-ups in the asymptotic-SOTA chain.
3. Claude extracts claims, algorithms, conjectures, and ingredient lists,
   then appends new tickets to `src/data/improvement-queue.js` with the
   `dependsOn` field pointing back at the source PDF.

## Why commit PDFs to the repo

- Survives machine switches and CI without re-fetching.
- Lets every engine see the same source material.
- Lets reviewers verify our citations against the actual paper.

## Copyright / size guardrails

- Prefer arxiv-format preprints over publisher PDFs where available.
- Soft cap: 5 MB per file. Anything larger should be hosted off-repo
  and linked instead (use `research-inputs/<name>.url` containing the URL).
- Do not commit copyrighted material the project has no license to mirror;
  use the `.url` pointer form for such cases.

## Convention for filenames

`<lastname1>-<lastname2>-<year>-<short-topic>.pdf`

Examples:
- `bui-soundararajan-2008-zero-density.pdf`
- `conrey-snaith-2008-ratios-conjecture.pdf`
- `hughes-rudnick-2003-linear-statistics.pdf`
- `bourgade-2010-mesoscopic-clt-zeta.pdf`

## What Claude will extract per PDF

Per the Λ-attack ticket-seeding template:

1. Headline result + assumptions (RH? PCC? sine-kernel? unconditional?).
2. Constants / exponents that appear in our composition chain
   (E_trunc, E_flow, E_coll, log-T-power A, density exponent e, etc.).
3. Citation chain — what does this paper depend on, and is any
   dependency already loaded into the queue?
4. Sub-claims that could be empirical-validated via the existing 1e6
   Odlyzko zeros bundle (numerical cross-checks).
5. Open follow-ups the paper itself names — those become new tickets.
6. Conflict / refinement against the current asymptotic-SOTA composition:
   does this paper tighten any constant in `src/data/asymptotic-lambda-bound-2026-05-20.js`?

The output is one or more tickets seeded into `src/data/improvement-queue.js`
with explicit `dependsOn: ['research-inputs/<filename>.pdf']` references
so the provenance trail is auditable.

## RH research checkpoints

- [Moment-transfer audit](../formalization/paper/rh-moment-transfer-2026-10-06.md): exact arithmetic reductions and the imported 7/8 endpoint.
- [Principal-sector follow-up](../formalization/paper/rh-principal-sector-2026-10-08.md): grouped energy, centering, and the missing signed far-correlation bound.
- [Cross-project synthesis](../formalization/paper/rh-cross-project-synthesis-2026-10-09.md): saved-research coverage, a finite directional residual repair, and conditional twistor/SELF transfers. Includes explicit failed continuum test and remaining RH gaps.
