/**
 * @module imp-95372-ra-proxy-true-gap-assessment
 * @fileoverview imp-95372 -- import-light ASSESSMENT of the imp-2563 residual
 *   R_A (the proxy-vs-true identification gap) inside the |t_c(N)| -> 0 leg of
 *   the imp-1261 conditional asymptotic redirect. It answers three questions
 *   the lambda-roadmap note ("our-asymptotic-via-imp-1261-redirect") leaves
 *   named-but-open: (Q1) what R_A actually quantifies, (Q2) whether the
 *   genuinely-unconditional limit limsup_N |t_c^proxy(N)| = 0 transfers to the
 *   PHYSICAL first-collision time |t_c(N)|, and (Q3) what closing R_A would
 *   require. ASSESSMENT ONLY: it derives NO bound, closes NO leg, fires NO
 *   certificate. The leg remains OPEN and no refereed bound is changed.
 *
 *   THE TWO OBJECTS THE LEG SEPARATES
 *   -----------------------------------------------
 *   True quantity   t_c(N)       = first-collision time of the N-particle
 *                                  attractive Dyson / Calogero-Moser flow,
 *                                  i.e. the smallest positive root of the
 *                                  discriminant Disc(s) (imp-2563 Theorem
 *                                  S4-1..3, discriminant-tc-characterization).
 *   Stieltjes proxy t_c^proxy(N) = 1/(2 M_infty(N)), where M_infty(N) is the
 *                                  strip-Jacobian / Stieltjes-transform
 *                                  functional of the recorded zeros
 *                                  (imp-1149 STEP 5). The |t_c| -> 0 leg
 *                                  proves a statement about THIS proxy, not
 *                                  about t_c(N) itself.
 *
 *   Q1 -- WHAT R_A QUANTIFIES
 *   -----------------------------------------------
 *   R_A is the IDENTIFICATION RESIDUAL between the two objects:
 *       R_A(N)  :=  | t_c(N) - t_c^proxy(N) |  =  | t_c(N) - 1/(2 M_infty(N)) |.
 *   It is exactly the quantity the imp-1261 chain bounds by the triangle step
 *       |t_c(N)|  <=  |t_c(N) - 1/(2 M_infty(N))|  +  1/(2 M_infty(N))
 *                 =   R_A(N)                        +  |t_c^proxy(N)|.
 *   In the imp-2563 discriminant module R_A is booked as a THREE-part named
 *   residual: (a) a ZETA_ZEROS / Odlyzko data audit of the ladder inputs,
 *   (b) the PATH_C_BASELINE_FIT ladder replacement by the offline corrected
 *   ladder, and (c) the imp-1149 Theorem-3 particle-vs-proxy re-grade against
 *   those verified inputs -- "NOT done here". So R_A is not a missing theorem
 *   but a missing VERIFICATION: the candidate closing device (imp-1149
 *   Theorem 3) exists on paper; its application to the actual recorded ladder
 *   has not been executed.
 *
 *   Q2 -- DOES limsup |t_c^proxy| = 0 TRANSFER TO |t_c(N)|?
 *   -----------------------------------------------
 *   The genuinely-unconditional content of the leg is
 *       limsup_N |t_c^proxy(N)| = 0
 *   which holds via the ATOMIC self-term of the Stieltjes transform,
 *       M_infty(N)  >=  sqrt(N / (2 pi))   (unconditional, no GUE, no RH),
 *   so |t_c^proxy(N)| = 1/(2 M_infty(N)) <= sqrt(pi/(2N)) -> 0 (RvM counting +
 *   Trudgian C_Selberg = 3). By the triangle step above,
 *       limsup_N |t_c(N)|  <=  limsup_N R_A(N)  +  limsup_N |t_c^proxy(N)|
 *                          =   limsup_N R_A(N)  +  0,
 *   so the transfer holds IF AND ONLY IF limsup_N R_A(N) = 0. The only
 *   documented device for R_A(N) -> 0 is imp-1149 Theorem 3, the labelled-
 *   unconditional rate R_A(N) <= C_HO / (L * N^{3/2}) -> 0. Hence the transfer
 *   is delivered CONDITIONALLY on the imp-1149 Theorem-3 re-grade (Q1 items
 *   a-c) being executed against the recorded ladder; no separate hypothesis
 *   (RH, GUE, C_H) is needed for R_A itself. CRUCIAL, and the point of this
 *   assessment: R_A is NOT the binding obstruction of the route. Even a fully
 *   closed R_A yields only limsup_N |t_c(N)| = 0, which is INERT -- it does
 *   NOT bound Lambda. The fatal, non-closable obstruction is elsewhere: the
 *   AMPLIFIED quantitative rate K_1 (L - log 4pi) sqrt(N) is repo-REFUTED
 *   (imp-2621 falsified the continuum amplification; only the bare
 *   sqrt(N/2pi) self-term limit survives), and E(N) does not vanish
 *   (imp-35164). So the honest disentangling is: R_A = closable-in-principle
 *   identification/verification residual; imp-2621 + imp-35164 = the actual
 *   walls. Closing R_A alone changes nothing about Lambda.
 *
 *   Q3 -- WHAT CLOSING R_A WOULD REQUIRE
 *   -----------------------------------------------
 *   (1) The ZETA_ZEROS / Odlyzko data audit: verify the ladder inputs against
 *       the external high-precision zero table (the data-audit leg).
 *   (2) The PATH_C_BASELINE_FIT ladder replacement: swap the baseline-fit
 *       ladder for the offline corrected ladder so t_c(N) and M_infty(N) are
 *       read from a certified source, not a fit.
 *   (3) The imp-1149 Theorem-3 re-grade: apply the unconditional N^{-3/2}
 *       approximation bound R_A(N) <= C_HO/(L N^{3/2}) to those verified
 *       inputs, confirming C_HO and L are the recorded constants.
 *   NONE of these resurrects a Lambda bound: they upgrade the leg from
 *   "limsup of a proxy" to "limsup of the true t_c", still INERT while
 *   imp-2621 (refuted amplified rate) and imp-35164 (E(N) does not vanish)
 *   stand. R_A is therefore a correctness/verification obligation, not a
 *   Lambda lever.
 *
 * @see src/data/lambda-roadmap.js (entry our-asymptotic-via-imp-1261-redirect,
 *   the note that names R_A open on a repo-refuted rate step)
 * @see src/data/asymptotic-lambda-bound-2026-05-20.js (honestScope /
 *   numericalStatus; imp-1147-sub-proxy-particle-identification = R_A)
 * @see src/data/imp-2563-discriminant-tc-characterization.js (R_A booked as
 *   the three-part data-audit + ladder + Theorem-3 re-grade residual)
 * @see src/data/imp-1261-asymptotic-lambda-redirect-shipped.js (the triangle
 *   step |t_c| <= |t_c - 1/(2 M_infty)| + 1/(2 M_infty))
 *
 * Ticket: imp-95372 (proof, medium). Assessment only; establishes no new
 * bound; closes no leg; fires no certificate; NO QED; no refereed bound is changed.
 */

// ---------------------------------------------------------------------------
// Baked reference constants (literals; no re-import of the heavy modules).
// ---------------------------------------------------------------------------
// Atomic Stieltjes self-term lower bound M_infty(N) >= sqrt(N/(2 pi)):
const mInftyAtomicLB = (N) => Math.sqrt(N / (2 * Math.PI));
// Proxy value under the atomic self-term: |t_c^proxy(N)| <= 1/(2 M_infty):
const proxyUB = (N) => 1 / (2 * mInftyAtomicLB(N)); // = sqrt(pi/(2N))
// imp-1149 Theorem-3 approximation residual majorant R_A(N) <= C_HO/(L N^{3/2}).
// Illustrative unit constants (C_HO = L = 1) -- the SHAPE (N^{-3/2} -> 0) is
// the assessed fact, not the numeric prefactor:
const raThm3UB = (N) => 1 / Math.pow(N, 1.5);

const THREE_PART_RESIDUAL = Object.freeze([
  Object.freeze({
    key: 'ra-a-zeta-zeros-data-audit',
    what:
      'ZETA_ZEROS / Odlyzko data audit of the recorded ladder inputs -- ' +
      'DELIVERED (detection + repair) by imp-2563; narrowed to the single ' +
      'unexecuted high-N exact recompute (imp-2563-sub-pathc-ladder-' +
      'replace-highN), per the imp-95448 audit.',
    status: 'delivered-except-high-n',
  }),
  Object.freeze({
    key: 'ra-b-pathc-ladder-replacement',
    what: 'Replace the PATH_C_BASELINE_FIT ladder by the offline corrected ladder.',
    status: 'open',
  }),
  Object.freeze({
    key: 'ra-c-imp1149-theorem3-regrade',
    what:
      'Apply the imp-1149 Theorem-3 N^{-3/2} approximation bound to the ' +
      'verified inputs (particle-vs-proxy re-grade).',
    status: 'open',
  }),
]);

export const IMP95372_RA_PROXY_TRUE_GAP_ASSESSMENT = Object.freeze({
  id: 'imp-95372',
  proofSection: 'S-frontier',
  scopes: 'imp-2563 R_A (proxy-vs-true identification) in the imp-1261 redirect',
  glosses: 'imp-1261',
  objects: Object.freeze({
    trueQuantity:
      't_c(N) = first-collision time of the attractive Dyson/CM flow ' +
      '(smallest positive root of the discriminant, imp-2563 S4).',
    stieltjesProxy:
      't_c^proxy(N) = 1/(2 M_infty(N)), M_infty the strip-Jacobian / ' +
      'Stieltjes-transform functional (imp-1149 STEP 5).',
  }),
  // Q1
  raDefinition:
    'R_A(N) := | t_c(N) - t_c^proxy(N) | = | t_c(N) - 1/(2 M_infty(N)) |, ' +
    'the identification residual between the true collision time and the ' +
    'Stieltjes proxy. Booked as a THREE-part verification residual (data ' +
    'audit + ladder replacement + imp-1149 Theorem-3 re-grade), not a ' +
    'missing theorem.',
  threePartResidual: THREE_PART_RESIDUAL,
  // Q2
  triangleStep:
    'limsup_N |t_c(N)| <= limsup_N R_A(N) + limsup_N |t_c^proxy(N)| ' +
    '= limsup_N R_A(N) + 0, so transfer holds iff limsup_N R_A(N) = 0.',
  proxyLimitUnconditional:
    'limsup_N |t_c^proxy(N)| = 0 via the atomic self-term ' +
    'M_infty(N) >= sqrt(N/(2 pi)) (RvM counting + Trudgian C_Selberg = 3; ' +
    'no GUE, no RH).',
  transferConclusion:
    'The transfer of limsup=0 from proxy to true t_c is delivered ' +
    'CONDITIONALLY on the imp-1149 Theorem-3 re-grade (R_A(N) <= ' +
    'C_HO/(L N^{3/2}) -> 0); no RH/GUE/C_H hypothesis is needed for R_A ' +
    'itself. R_A is NOT the binding obstruction: even fully closed it yields ' +
    'only limsup_N |t_c(N)| = 0, which is INERT (does not bound Lambda).',
  fatalObstructionsElsewhere: Object.freeze([
    'imp-2621: the amplified quantitative rate K_1 (L - log 4pi) sqrt(N) is ' +
      'repo-REFUTED (continuum amplification falsified); only the bare ' +
      'sqrt(N/2pi) self-term limit survives.',
    'imp-35164: E(N) FLOORS at E_trunc and does NOT vanish, so the ' +
      'asymptotic -> 0 statement is unsupplied even granting limsup |t_c| = 0.',
  ]),
  // Q3
  whatClosingRAWouldRequire: Object.freeze([
    'ZETA_ZEROS / Odlyzko data audit of the ladder inputs.',
    'PATH_C_BASELINE_FIT ladder replacement by the offline corrected ladder.',
    'imp-1149 Theorem-3 re-grade applying R_A(N) <= C_HO/(L N^{3/2}) to the ' +
      'verified inputs (confirming C_HO, L are the recorded constants).',
  ]),
  closingRAProducesLambdaBound: false,
  anyEnclosureEstablished: false,
  legStillOpen: 'imp-2563 R_A (proxy-vs-true identification)',
  verdict:
    'ASSESSMENT ONLY (no proof). R_A(N) = |t_c(N) - 1/(2 M_infty(N))| is the ' +
    'identification residual between the physical first-collision time and ' +
    'the Stieltjes proxy; it is a three-part VERIFICATION residual (data ' +
    'audit + ladder replacement + imp-1149 Theorem-3 re-grade), not a ' +
    'missing theorem. The unconditional limsup_N |t_c^proxy(N)| = 0 (atomic ' +
    'self-term sqrt(N/2pi)) transfers to |t_c(N)| iff limsup_N R_A(N) = 0, ' +
    'which imp-1149 Theorem 3 delivers unconditionally-in-principle once the ' +
    're-grade is executed -- so R_A is closable and is NOT the binding wall. ' +
    'The fatal, non-closable obstructions are imp-2621 (refuted amplified ' +
    'rate; only the inert bare limit survives) and imp-35164 (E(N) does not ' +
    'vanish); closing R_A produces NO Lambda bound. Leg remains OPEN. ' +
    'No refereed bound is changed.',
  citation:
    'lambda-roadmap.js (our-asymptotic-via-imp-1261-redirect); ' +
    'asymptotic-lambda-bound-2026-05-20.js (imp-1147-sub-proxy-particle-' +
    'identification = R_A); imp-2563-discriminant-tc-characterization.js ' +
    '(R_A three-part booking); imp-1261-asymptotic-lambda-redirect-shipped.js ' +
    '(triangle step).',
});

export default IMP95372_RA_PROXY_TRUE_GAP_ASSESSMENT;

// -- Tripwire assertions ------------------------------------------------------
export const IMP95372_RA_PROXY_TRUE_GAP_ASSESSMENT_ASSERTIONS = [
  {
    id: 'imp95372-ra-is-identification-residual',
    why:
      'Q1: R_A must be defined as the identification residual between the ' +
      'true collision time and the Stieltjes proxy 1/(2 M_infty(N)), booked ' +
      'as the three-part data-audit + ladder + Theorem-3 re-grade residual.',
    holds: () => {
      const a = IMP95372_RA_PROXY_TRUE_GAP_ASSESSMENT;
      return (
        /1\/\(2 M_infty/.test(a.raDefinition) &&
        a.threePartResidual.length === 3 &&
        a.threePartResidual.find((p) => p.key === 'ra-a-zeta-zeros-data-audit')?.status ===
          'delivered-except-high-n' &&
        a.threePartResidual.find((p) => p.key === 'ra-b-pathc-ladder-replacement')?.status === 'open' &&
        a.threePartResidual.find((p) => p.key === 'ra-c-imp1149-theorem3-regrade')?.status === 'open'
      );
    },
  },
  {
    id: 'imp95372-proxy-limit-vanishes-via-atomic-self-term',
    why:
      'Q2 numeric cross-check: under the unconditional atomic self-term ' +
      'M_infty(N) >= sqrt(N/(2 pi)), the proxy value 1/(2 M_infty) = ' +
      'sqrt(pi/(2N)) is strictly decreasing to 0 over N in {1e2..1e8}.',
    holds: () => {
      let prev = Infinity;
      for (const N of [1e2, 1e3, 1e4, 1e5, 1e6, 1e7, 1e8]) {
        const v = proxyUB(N);
        if (!(v < prev)) return false;
        // sqrt(pi/(2N)) identity cross-check
        if (Math.abs(v - Math.sqrt(Math.PI / (2 * N))) > 1e-12) return false;
        prev = v;
      }
      return prev < 1e-3; // -> 0
    },
  },
  {
    id: 'imp95372-thm3-residual-vanishes',
    why:
      'Q2: the only documented device for R_A(N) -> 0 is the imp-1149 ' +
      'Theorem-3 N^{-3/2} rate; cross-check the shape N^{-3/2} decays ' +
      'strictly to 0 (faster than the proxy N^{-1/2}).',
    holds: () => {
      let prev = Infinity;
      for (const N of [1e2, 1e3, 1e4, 1e5, 1e6]) {
        const v = raThm3UB(N);
        if (!(v < prev)) return false;
        // N^{-3/2} beats the proxy N^{-1/2} for large N
        if (!(v < proxyUB(N))) return false;
        prev = v;
      }
      return prev < 1e-6;
    },
  },
  {
    id: 'imp95372-transfer-iff-ra-vanishes',
    why:
      'Q2 structural: the triangle step gives limsup |t_c| <= limsup R_A + ' +
      'limsup |t_c^proxy| = limsup R_A + 0, so with both sample sequences ' +
      '-> 0 the composed bound -> 0 (transfer holds when R_A vanishes).',
    holds: () => {
      const N = 1e8;
      const composed = raThm3UB(N) + proxyUB(N);
      return composed < 2e-4 && composed >= proxyUB(N); // dominated by proxy tail
    },
  },
  {
    id: 'imp95372-closing-ra-produces-no-lambda-bound',
    why:
      'The core disentangling: R_A is closable-in-principle but INERT -- the ' +
      'fatal walls are imp-2621 (refuted amplified rate) and imp-35164 (E(N) ' +
      'does not vanish); closing R_A produces no Lambda bound.',
    holds: () => {
      const a = IMP95372_RA_PROXY_TRUE_GAP_ASSESSMENT;
      return (
        a.closingRAProducesLambdaBound === false &&
        a.fatalObstructionsElsewhere.length === 2 &&
        a.fatalObstructionsElsewhere.some((s) => /imp-2621/.test(s)) &&
        a.fatalObstructionsElsewhere.some((s) => /imp-35164/.test(s)) &&
        a.whatClosingRAWouldRequire.length === 3
      );
    },
  },
  {
    id: 'imp95372-honesty-gate-no-qed',
    why:
      'Assessment only: no enclosure established, leg still open, no-refereed-bound-change ' +
      'line present, and it scopes the R_A residual and glosses imp-1261.',
    holds: () => {
      const a = IMP95372_RA_PROXY_TRUE_GAP_ASSESSMENT;
      return (
        a.anyEnclosureEstablished === false &&
        /refereed bound is changed/i.test(a.verdict) &&
        a.glosses === 'imp-1261' &&
        /R_A/.test(a.legStillOpen)
      );
    },
  },
];

for (const assertion of IMP95372_RA_PROXY_TRUE_GAP_ASSESSMENT_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-95372-ra-proxy-true-gap-assessment assertion failed: ${assertion.id}`
    );
  }
}
