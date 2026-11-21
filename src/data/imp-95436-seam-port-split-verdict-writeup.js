/**
 * @module imp-95436-seam-port-split-verdict-writeup
 *
 * imp-95436 (content, honest-status writeup): a plain-language consolidation of
 * the imp-95376 SPLIT VERDICT on whether the imp-95212 Fresnel-Airy envelope
 * port, together with the already-mapped per-window Q, discharges the
 * gate-side admissibility of a signed seam certificate value R. This module
 * writes no new mathematics; it restates the imp-95376 findings (source
 * module: imp-95376-fa-port-admissibility-assessment.js) as a single readable
 * status record, distinct from the broader imp-95388 seam-chain
 * obligation-ledger. Content only; no bound moved; NO QED.
 *
 * PLAIN-LANGUAGE SUMMARY.
 *
 * The question. A signed seam certificate turns a value R into an admissible
 * bound on sqrt(Lambda) for the paper's actual seam functional only if two
 * things hold: the gate-side pipeline (R -> g_R -> gammaSL) is well-posed
 * (imp-95276 already showed this), and the input side -- the Fresnel-Airy
 * envelope port that transcribes the paper window into the exponential model
 * E_V -- correctly carries the paper's geometry into the certificate. imp-95376
 * asked whether the port, plus the per-window Q extraction that is already
 * mapped, is ENOUGH on its own for admissibility, or whether something more is
 * needed.
 *
 * The answer is a SPLIT VERDICT, not a single yes or no, because the seam
 * program has two different families of certificate:
 *
 * LEG A (closes): for the count/depth-currency family -- SGN-EQ, SGN-C,
 * COAL-N, SPLIT-LOO -- the port plus Q are enough. These certificates only use
 * transcribed geometry: a depth parameter, a count of distinct rates, and a
 * set of per-block angles. None of them use the sign or amplitude pattern of
 * the paper window. The reason this is safe is a property of the underlying
 * eigenvalue Lambda itself: it is defined as the SUPREMUM over every possible
 * signed coefficient vector, so a bound built from Lambda already covers every
 * sign pattern the paper window could have, known or not. No further
 * transcription of that sign data (called theta elsewhere in the program) is
 * needed for this family to be admissible.
 *
 * LEG B (stays open): one certificate family, PHASE-CERT, is different -- its
 * bound is built using theta, the paper window's own sign functional, so it is
 * not covered by the LEG A argument. But the honest residual for the whole
 * program is more basic than that special case: for ANY signed R (LEG A
 * included) to actually bound the PAPER window's ratio, and not just the
 * exponential model's, the port has to prove an inequality --
 * LamBar_paper(d) <= Lambda(E_V, d) -- showing the paper window's restricted
 * energy ratio is majorized by the exponential model, at every depth d. A port
 * that only matches up rates and centers between the two objects (a geometric
 * substitution) does not prove this; the majorization is the actual content
 * the port is supposed to deliver, and it remains unproved. This is the one
 * surviving ingredient, and it lives INSIDE the port, not beside it.
 *
 * Two secondary checks ride along with LEG A, flagged but not obstructions:
 * (S1) the SPLIT-LOO block angles must be transcribed as upper bounds, so the
 * collar factor they feed is over-, never under-, estimated; (S2) if the
 * SPLIT-LOO aggregate grows past 1/sqrt(2) it leaves the monotone gate branch
 * and must switch to per-block gate application, a routing rule already on
 * record rather than a new mathematical input.
 *
 * WHY THIS MATTERS. Before imp-95376, it was not clear whether "the port maps
 * geometry" was the same claim as "the port makes R admissible." The split
 * verdict shows those are different claims for most of the certificate family
 * (LEG A: they coincide, because of the Rayleigh-sup argument) but not for the
 * program as a whole (LEG B: the envelope-domination inequality is a distinct,
 * still-open requirement). Nothing here proves or refutes that inequality; it
 * only isolates it as the correct place to focus further work, and confirms no
 * other stealth ingredient is needed.
 *
 * HONEST LIMITS. This module restates a prior ASSESSMENT; it re-derives none
 * of the imp-95376 numerics and adds no new claim. LEG B (the envelope-
 * domination inequality) remains open and is tracked separately at
 * imp-95212-subgap-fresnel-airy-envelope-port. Changes no bound; NO QED;
 * no refereed bound is changed; RH open.
 *
 * Import-light: no zeros bundle, no sibling data-module imports (all facts
 * restated as literals so this module stays independently checkable).
 */

export const IMP95436_SEAM_PORT_SPLIT_VERDICT_WRITEUP = {
  ticket: 'imp-95436',
  sourceTicket: 'imp-95376',
  sourceModule: 'imp-95376-fa-port-admissibility-assessment.js',
  relatedLedger: 'imp-95388-seam-chain-obligation-ledger.js',
  question:
    'does the imp-95212 Fresnel-Airy envelope port ALONE (with the already-mapped per-window Q) make a '
    + 'signed seam certificate value R admissible as a bound on sqrt(LamBar) for the paper packet actual '
    + 'seam functional?',
  verdict: 'SPLIT',
  legA: {
    name: 'count/depth currency (SGN-EQ, SGN-C, COAL-N, SPLIT-LOO)',
    status: 'CLOSES',
    plain:
      'the port plus Q suffice; R is built only from transcribed geometry (depth, distinct-rate count, '
      + 'block angles), never from the window sign or amplitude pattern. Because the underlying Lambda is '
      + 'the supremum over EVERY signed coefficient vector, R already dominates whatever sign and modulus '
      + 'pattern the real window has, so no extra sign transcription is required for admissibility.',
  },
  legB: {
    name: 'envelope-domination inequality (inside the port)',
    status: 'OPEN',
    plain:
      'the port must prove LamBar_paper(d) <= Lambda(E_V, d) at every depth d -- majorizing the paper '
      + 'window restricted energy ratio by the transcribed exponential model. Matching rates and centers '
      + 'alone (a geometric substitution) does not prove this; it is the one surviving ingredient, and it '
      + 'is the honest substance still owed by the still-open Fresnel-Airy envelope port.',
  },
  secondaryChecks: {
    S1: 'SPLIT-LOO block angles must be transcribed as upper bounds (safe direction of the collar factor).',
    S2: 'if the SPLIT-LOO aggregate exceeds 1/sqrt(2) it must switch to per-block gate application, a '
      + 'routing rule already on record, not a new mathematical input.',
  },
  whyItMatters:
    'before imp-95376 it was unclear whether "the port maps geometry" and "the port makes R admissible" '
    + 'were the same claim. LEG A shows they coincide for the count/depth family (Rayleigh-sup argument); '
    + 'LEG B shows they do not coincide for the program as a whole, isolating the envelope-domination '
    + 'inequality as the correct remaining target.',
  honest:
    'RESTATEMENT ONLY -- no new derivation, no numerics re-run, no port re-attempted; LEG B remains open '
    + 'at imp-95212-subgap-fresnel-airy-envelope-port. Changes no bound; NO QED; no refereed bound is changed'
    + '; RH open.',
};

export const IMP95436_SEAM_PORT_SPLIT_VERDICT_WRITEUP_ASSERTIONS = [
  {
    id: 'imp-95436-verdict-is-split',
    description: 'the consolidated writeup records a SPLIT verdict, matching the imp-95376 source finding',
    holds: () => IMP95436_SEAM_PORT_SPLIT_VERDICT_WRITEUP.verdict === 'SPLIT',
  },
  {
    id: 'imp-95436-leg-a-closes-leg-b-open',
    description: 'LEG A is recorded as CLOSES and LEG B as OPEN, preserving the asymmetry of the split verdict',
    holds: () =>
      IMP95436_SEAM_PORT_SPLIT_VERDICT_WRITEUP.legA.status === 'CLOSES'
      && IMP95436_SEAM_PORT_SPLIT_VERDICT_WRITEUP.legB.status === 'OPEN',
  },
  {
    id: 'imp-95436-secondary-checks-present',
    description: 'both secondary checks S1 and S2 are carried over from the source assessment',
    holds: () =>
      typeof IMP95436_SEAM_PORT_SPLIT_VERDICT_WRITEUP.secondaryChecks.S1 === 'string'
      && typeof IMP95436_SEAM_PORT_SPLIT_VERDICT_WRITEUP.secondaryChecks.S2 === 'string'
      && IMP95436_SEAM_PORT_SPLIT_VERDICT_WRITEUP.secondaryChecks.S1.length > 0
      && IMP95436_SEAM_PORT_SPLIT_VERDICT_WRITEUP.secondaryChecks.S2.length > 0,
  },
  {
    id: 'imp-95436-honesty-gate-no-qed',
    description: 'restatement-only, no bound promoted, NO QED, no refereed bound is changed, RH open',
    holds: () =>
      /RESTATEMENT ONLY/.test(IMP95436_SEAM_PORT_SPLIT_VERDICT_WRITEUP.honest)
      && /NO QED/.test(IMP95436_SEAM_PORT_SPLIT_VERDICT_WRITEUP.honest)
      && /refereed bound is changed/i.test(IMP95436_SEAM_PORT_SPLIT_VERDICT_WRITEUP.honest)
      && /RH open/.test(IMP95436_SEAM_PORT_SPLIT_VERDICT_WRITEUP.honest),
  },
];

for (const a of IMP95436_SEAM_PORT_SPLIT_VERDICT_WRITEUP_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95436-seam-port-split-verdict-writeup assertion failed: ${a.id}`);
  }
}

export default IMP95436_SEAM_PORT_SPLIT_VERDICT_WRITEUP;
