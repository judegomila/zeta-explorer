/**
 * @module imp-96666-krein-payload-lazy-import-guard-glossary-headword
 * @fileoverview imp-96666 -- import-light glossary/Concepts headword recording the imp-96644
 *   standing constraint as a documented guard: any future page or component that surfaces the
 *   Route I Toeplitz-Krein certificate payload (rh-route-i-toeplitz-krein-certificate-payload-
 *   2026-09-24.js, exporting KREIN_CERTIFICATE / KREIN_CERTIFICATE_090, each carrying ~150-element
 *   ks/xs/c0..c4 arrays plus the l1=1.47e6 tail constant) must reach it through a lazy leaf
 *   (dynamic import()/React.lazy), never a static top-level import.
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-96644 ran a bundle-hygiene check and found the payload currently has exactly one real
 *   importer in src/ (its own data-only consumer module, rh-route-i-toeplitz-krein-certificate-
 *   2026-09-24.js, itself only reachable via the run-assertions.mjs DATA_MODULES sweep -- no page
 *   or component imports either module today). Because there is no page consumer yet, "convert
 *   the existing import to lazy" was not actionable; the residual it left was a standing
 *   constraint on whichever future ticket first wires this certificate onto a page. This
 *   headword bakes that constraint verbatim as a standalone quick-lookup entry so it survives
 *   independently of the imp-96644 module (no re-import, to stay import-light).
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   Precedent: imp-95523 (RhDagPage statically imported an 8.2MB improvement-queue chunk through
 *   a top-level import chain, eager-loading it into that route's bundle). The Krein certificate
 *   payload is the same shape of risk -- large frozen coefficient arrays plus a tail constant --
 *   sitting one static import away from repeating that failure mode the moment a page wires it
 *   up. The guard: reach the payload only via `React.lazy(() => import(...))` or an equivalent
 *   dynamic `import()` inside the consuming page/component, never a static top-level
 *   `import ... from '...krein-certificate-payload...'`.
 *
 *   STATUS: a standing architectural constraint (prospective guard for future work), not a fix
 *   to an existing bug -- imp-96644 confirmed no route bundle currently carries this payload.
 *
 *   WHAT THIS IS AND IS NOT
 *   ------------------------
 *   A glossary-style lookup restating the imp-96644 residual guidance for quick reference. It
 *   establishes nothing, instantiates no interval, closes no sub-gap, moves no bound. NO QED.
 *   No refereed bound is changed.
 *
 * @see imp-96644-krein-payload-bundle-hygiene-check.js (source: the check whose residualGuidance
 *   this glosses)
 * @see imp-95523 (precedent: RhDagPage eager-loaded an 8.2MB chunk via a static import chain)
 * @see rh-route-i-toeplitz-krein-certificate-payload-2026-09-24.js (the payload this guard covers)
 *
 * Ticket: imp-96666 (meta, low, sonnet-4-6). Documentation only; establishes nothing; NO QED;
 * no refereed bound is changed.
 */

// The standing lazy-import guard, baked verbatim (no re-import).
const KREIN_PAYLOAD_LAZY_IMPORT_GUARD_HEADWORD = Object.freeze({
  key: 'krein-payload-lazy-import-guard',
  term:
    'imp-96644 standing guard: any future page/component surfacing the Route I Toeplitz-Krein ' +
    'certificate payload must reach it via a lazy leaf (React.lazy / dynamic import()), never a ' +
    'static top-level import',
  definition:
    'The Route I Toeplitz-Krein certificate payload module ' +
    '(rh-route-i-toeplitz-krein-certificate-payload-2026-09-24.js) exports KREIN_CERTIFICATE and ' +
    'KREIN_CERTIFICATE_090, each carrying ~150-element ks/xs/c0/c1/c2/c3/c4 arrays plus the ' +
    'l1=1.47e6 tail constant. imp-96644 verified no page or component currently imports it (its ' +
    'sole real importer is a data-only consumer module reachable only through the ' +
    'run-assertions.mjs DATA_MODULES sweep). Because no page wires it up yet, there was nothing ' +
    'to convert to a lazy import today -- the residual is a standing constraint on whichever ' +
    'future ticket first surfaces this certificate on a page.',
  mechanism:
    'Precedent imp-95523: RhDagPage statically imported an 8.2MB improvement-queue chunk through ' +
    'a top-level import chain, eager-loading it into that route bundle. The Krein certificate ' +
    'payload carries the same shape of risk (large frozen coefficient arrays plus a tail ' +
    'constant), so the guard is: reach it only via `React.lazy(() => import(...))` or an ' +
    'equivalent dynamic `import()` inside the consuming page/component, never a static ' +
    'top-level `import ... from` naming the payload module or its consumer.',
  verificationStatus:
    'Standing architectural constraint (prospective guard), not a bugfix -- imp-96644 confirmed ' +
    'no route bundle currently carries this payload, so eagerLoadRiskPresent is false today. ' +
    'Changes no bound; establishes no operator positivity; no refereed bound is changed; RH ' +
    'open; NO QED.',
});

export const IMP96666_KREIN_PAYLOAD_LAZY_IMPORT_GUARD_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-96666',
  proofSection: 'S-frontier',
  glosses: 'imp-96644',
  question:
    'imp-96644 found no page currently imports the Krein certificate payload, so there was ' +
    'nothing to convert to a lazy import. What guidance should a future page-wiring ticket ' +
    'follow, and is it recorded anywhere a reader will find it before writing a new static ' +
    'import?',
  headword: KREIN_PAYLOAD_LAZY_IMPORT_GUARD_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Records the imp-96644 residual ' +
    'guidance verbatim: any future page/component surfacing the Krein certificate payload must ' +
    'reach it via a lazy leaf (React.lazy / dynamic import()), never a static top-level import, ' +
    'to avoid repeating the imp-95523 eager-load bug. Establishes nothing; instantiates no ' +
    'interval; moves no bound; NO QED. No refereed bound is changed.',
  citation:
    'imp-96644 (the bundle-hygiene check and residualGuidance this glosses); imp-95523 ' +
    '(precedent eager-load bug this guard prevents); ' +
    'rh-route-i-toeplitz-krein-certificate-payload-2026-09-24.js (the payload module covered).',
});

export default IMP96666_KREIN_PAYLOAD_LAZY_IMPORT_GUARD_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP96666_KREIN_PAYLOAD_LAZY_IMPORT_GUARD_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp96666-headword-names-lazy-import-guard',
    why: 'The headword must name the concrete guard (lazy leaf, never static top-level import) ' +
      'and the precedent it prevents -- the entire point of the glossary entry.',
    holds: () => {
      const h = IMP96666_KREIN_PAYLOAD_LAZY_IMPORT_GUARD_GLOSSARY_HEADWORD.headword;
      return (
        /React\.lazy/.test(h.mechanism) &&
        /dynamic.*import\(\)/i.test(h.term) &&
        /imp-95523/.test(h.mechanism) &&
        /static top-level/.test(h.mechanism)
      );
    },
  },
  {
    id: 'imp96666-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP96666_KREIN_PAYLOAD_LAZY_IMPORT_GUARD_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP96666_KREIN_PAYLOAD_LAZY_IMPORT_GUARD_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP96666_KREIN_PAYLOAD_LAZY_IMPORT_GUARD_GLOSSARY_HEADWORD.verdict) &&
      IMP96666_KREIN_PAYLOAD_LAZY_IMPORT_GUARD_GLOSSARY_HEADWORD.glosses === 'imp-96644',
  },
];

for (const assertion of IMP96666_KREIN_PAYLOAD_LAZY_IMPORT_GUARD_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-96666-krein-payload-lazy-import-guard-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
