/**
 * @module imp-2871-exp-tail-bound-audit
 *
 * imp-2871 (medium, proof/rigor): Domain-validity audit for the elementary
 * exp(x) <= 1 + x + x^2 Gronwall tail bound reused across the E(N) interval
 * certificates.
 *
 * PROVENANCE OF THE BOUND
 * -----------------------
 * Define f(x) = 1 + x + x^2 - exp(x). Then f(0)=0, f.(0)=0, and
 * f..(x) = 2 - exp(x) > 0 for x < ln 2. The first derivative
 * f.(x) = 1 + 2x - exp(x) rises from 0, peaks near x = ln 2, and stays
 * POSITIVE throughout [0,1] (f.(1) = 3 - e ~ 0.28 > 0). Hence f is increasing
 * on [0,1] and f(x) >= 0 there: the bound exp(x) <= 1 + x + x^2 is rigorous on
 * the elementary domain 0 <= x <= 1 that every call site cites in its comment.
 *
 * The bound is actually valid on a STRICTLY LARGER interval: 1 + x + x^2 first
 * dips below exp(x) at the crossing x* where 1 + x + x^2 = exp(x). Bisection
 * pins x* = 1.7932821329... (see X_CEILING below). So [0,1] is the conservative
 * proven domain and x* ~ 1.7933 is the true ceiling; any call site with
 * argument 0 <= x <= 1 is safe with ~0.79 of absolute headroom to the crossing.
 *
 * CALL-SITE ENUMERATION (every use of the 1+x+x^2 exp upper bound in the ledger)
 * -----------------------------------------------------------------------------
 *   imp-2704  E_flow C_F interval cert: x = C_G . tc_hi = 2 . 2.37e-4 = 4.74e-4
 *   imp-2762  t_c A1-trap interval:     x = C_G_max . hi  = 10 . hi  ~ 2.369e-3
 * Both arguments are ~3 orders of magnitude below the proven ceiling 1, so the
 * elementary bound is applied strictly inside its valid domain at every site.
 * No out-of-domain (unguarded) call site was found; this module supplies the
 * EXECUTABLE domain guard that previously existed only as a source comment.
 *
 * @see imp-2704-cf-interval-certificate (E_flow prefactor bracket)
 * @see imp-2762-tc-a1-trap-interval     (collision-time upper bracket)
 * @see imp-2870-en-cert-liveness-tripwire (keeps both cert arrays wired)
 */

import { IMP2704_CF_INTERVAL_CERTIFICATE }
  from './imp-2704-cf-interval-certificate.js';
import { IMP2762_TC_A1_TRAP_INTERVAL }
  from './imp-2762-tc-a1-trap-interval.js';

// The elementary bound under audit (NOT Math.exp): exp(x) <= 1 + x + x^2.
function expUpperSmall(x) {
  return 1 + x + x * x;
}

// Proven elementary domain ceiling cited by every call site.
const PROVEN_DOMAIN_CEILING = 1;

// True crossing x* where 1 + x + x^2 = exp(x), pinned by bisection on [1,2].
// f(x) = 1 + x + x^2 - exp(x) is positive on [0,x*) and negative just above.
const X_CEILING = 1.7932821329;

// ── Call-site descriptors ────────────────────────────────────────────────────
// Each carries the argument the live cert feeds into expUpperSmall, recovered
// from the exported certificate object so drift in the cert re-triggers here.
const IMP2704_BRACKET = IMP2704_CF_INTERVAL_CERTIFICATE.eFlowUpperBracket;
const IMP2704_X = IMP2704_BRACKET.C_G * IMP2704_BRACKET.tc_hi; // 2 . 2.37e-4 = 4.74e-4
const IMP2762_X = IMP2762_TC_A1_TRAP_INTERVAL.gronwall.worstExponent; // 10 . hi
const IMP2704_REPORTED_FACTOR = IMP2704_BRACKET.gronwallFactorHi;
const IMP2762_REPORTED_FACTOR = IMP2762_TC_A1_TRAP_INTERVAL.gronwall.factorCeiling;

const CALL_SITES = [
  { id: 'imp-2704', x: IMP2704_X, reportedFactor: IMP2704_REPORTED_FACTOR, factorTol: 1e-8 },
  { id: 'imp-2762', x: IMP2762_X, reportedFactor: IMP2762_REPORTED_FACTOR, factorTol: 1e-9 },
];

export const IMP2871_EXP_TAIL_BOUND_AUDIT = {
  id: 'imp-2871',
  question:
    'Is the elementary exp(x) <= 1 + x + x^2 Gronwall tail bound applied only inside '
    + 'its proven domain at every E(N)-certificate call site, and where exactly does it fail.',
  provenDomain: [0, PROVEN_DOMAIN_CEILING],
  trueCeiling: X_CEILING,
  callSites: CALL_SITES.map((s) => ({
    id: s.id,
    argument: s.x,
    factor: expUpperSmall(s.x),
    headroomToProvenCeiling: +(PROVEN_DOMAIN_CEILING - s.x).toFixed(6),
    inProvenDomain: s.x >= 0 && s.x <= PROVEN_DOMAIN_CEILING,
  })),
  note:
    'Both call sites feed x ~ 5e-4 and x ~ 2.4e-3 into 1+x+x^2, ~3 orders of magnitude '
    + 'below the proven ceiling 1 (and ~1.79 below the true crossing). The bound is '
    + 'rigorous at both. This module is the executable domain guard for the bound, '
    + 'which previously lived only in source comments.',
};

export const IMP2871_EXP_TAIL_BOUND_AUDIT_ASSERTIONS = [
  {
    id: 'imp2871-x-ceiling-bound-holds-below',
    description:
      'At the proven domain ceiling x=1 (and just below the true crossing x*), the '
      + 'elementary bound 1+x+x^2 >= exp(x) holds.',
    holds: () =>
      expUpperSmall(1) >= Math.exp(1)
      && expUpperSmall(X_CEILING - 1e-4) >= Math.exp(X_CEILING - 1e-4),
  },
  {
    id: 'imp2871-x-ceiling-bound-fails-above',
    description:
      'Just above the pinned crossing x* the bound is genuinely violated '
      + '(1+x+x^2 < exp(x)), certifying x* ~ 1.7932821 is the true ceiling, not a guess.',
    holds: () => expUpperSmall(X_CEILING + 1e-4) < Math.exp(X_CEILING + 1e-4),
  },
  {
    id: 'imp2871-all-call-sites-in-proven-domain',
    description:
      'Every enumerated call site feeds an argument inside the proven elementary '
      + 'domain 0 <= x <= 1, so the bound is rigorous at each.',
    holds: () =>
      CALL_SITES.every((s) => s.x >= 0 && s.x <= PROVEN_DOMAIN_CEILING),
  },
  {
    id: 'imp2871-call-site-bound-valid-numerically',
    description:
      'At each call-site argument the elementary upper bound dominates the true '
      + 'exponential: 1+x+x^2 >= exp(x).',
    holds: () =>
      CALL_SITES.every((s) => expUpperSmall(s.x) >= Math.exp(s.x)),
  },
  {
    id: 'imp2871-reported-factors-match-1px-px2',
    description:
      'The Gronwall factor each cert REPORTS equals 1+x+x^2 at its argument, '
      + 'confirming the audited bound is the one actually wired into the cert.',
    holds: () =>
      CALL_SITES.every((s) => Math.abs(s.reportedFactor - expUpperSmall(s.x)) <= s.factorTol),
  },
  {
    id: 'imp2871-call-sites-have-domain-headroom',
    description:
      'Both call-site arguments sit at least 0.99 below the proven ceiling 1 '
      + '(orders of magnitude of slack), so future inflation cannot silently '
      + 'push them out of domain.',
    holds: () =>
      CALL_SITES.every((s) => PROVEN_DOMAIN_CEILING - s.x >= 0.99),
  },
];

for (const a of IMP2871_EXP_TAIL_BOUND_AUDIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-2871-exp-tail-bound-audit assertion failed: ${a.id}`);
  }
}
