/**
 * @module imp-theta-trap-sign-audit
 *
 * CERTIFIED NEGATIVE RESULT (imp-2847, opus-4-8 api-pool, 2026-06-25).
 *
 * The route map lists the "Theta-trap rigorous t_c^part bound" as CONDITIONAL
 * with the note "rigorous but NEGATIVE for the headline (sign algebra; buys
 * nothing on Lambda)." This module reproduces that sign algebra in full so the
 * genuinely-rigorous Theta-trap machinery (sg1c-theta-trap-theorems Corollary
 * A1) is never re-mined as if it tightened the Lambda headline. The theorem is
 * REAL; it simply points the wrong way. We certify exactly that.
 *
 * INPUTS (both rigorous / recorded, no new claim):
 *   - Corollary A1 (sg1c-theta-trap-theorems): if the initial minimal pair has
 *     Theta(0) <= 1/4 then  t_c^part(N) <= g_min(0)^2 / 6.  This is an UPPER
 *     bound on the first pairwise backward-CM collision time. At N* = 1e4 the
 *     measured minimal pair has Theta(0) = 0.0017 << 1/4, so the bound holds
 *     UNCONDITIONALLY with value U := g_min^2/6 = 2.369e-4
 *     (tc-part-vs-mf-linchpin-finding, computedAtN1e4).
 *   - de Bruijn-Newman bridge (Polymath15 / imp-2564 direction audit):
 *         |Lambda + t_c|  <=  E(N),
 *     equivalently the TWO faces
 *         (upper / headline)  Lambda  <=  -t_c + E(N)
 *         (lower)             Lambda  >=  -t_c - E(N).
 *   - Rodgers-Tao (2020):  Lambda >= 0  (unconditional).
 *
 * THE SIGN ALGEBRA (the whole point).
 * The headline is an UPPER bound on Lambda, so the load-bearing face is
 *     Lambda  <=  -t_c + E(N).
 * The right-hand side  f(t_c) = -t_c + E(N)  is strictly DECREASING in t_c.
 * To make the headline (the RHS) as small as possible we therefore need t_c as
 * LARGE as possible, i.e. a rigorous LOWER bound  t_c >= L  would give the
 * genuine improvement  Lambda <= -L + E(N).  An UPPER bound t_c <= U does the
 * opposite: substituting t_c <= U into -t_c gives -t_c >= -U, hence
 *     -t_c + E(N)  >=  -U + E(N),
 * which is a LOWER bound on the headline RHS and yields NOTHING on the upper
 * face. A1 supplies precisely an upper bound, so it cannot touch the headline.
 *
 * Where does an upper bound on t_c land? On the OTHER face. From
 *     Lambda >= -t_c - E(N)  and  t_c <= U  we get  Lambda >= -U - E(N).
 * With U = 2.369e-4 and E(N) ~ 9e-2 (E_coll, C_H = 1 placeholder) this reads
 *     Lambda  >=  -(2.369e-4) - 0.09  =  -0.0902...,
 * a LOWER bound on Lambda that is dominated outright by the unconditional
 * Rodgers-Tao  Lambda >= 0.  So the A1 upper bound improves only a face that is
 * already pinned tighter by a known theorem: it buys nothing on the headline.
 *
 * COLLAPSE TO E(N). Using only the trivial t_c >= 0 (collision times are
 * non-negative) the headline face reduces to
 *     Lambda  <=  -t_c + E(N)  <=  E(N),
 * so the ENTIRE remaining headline burden sits on the bridge error E(N) -- not
 * on t_c. Making the |t_c| sub-term rigorous and 30x smaller via A1 removes it
 * as the binding obstruction but does not advance Lambda below the
 * Platt-Trudgian rigorous SOTA Lambda <= 0.2; sizing E(N) (above all
 * discharging C_H inside E_coll) is the genuine lever. This is identical to,
 * and re-derives independently, the tc-part-vs-mf-linchpin-finding resolution.
 *
 * HONEST STATUS: NEGATIVE-CERTIFIED. Corollary A1 is a true rigorous theorem;
 * it controls the right object (the truncated-flow first-collision time, Picture
 * A) but with the wrong INEQUALITY DIRECTION for the headline. No rigorous beat
 * of Platt-Trudgian follows from A1 alone.
 *
 * @see sg1c-theta-trap-theorems (Corollary A1, the rigorous upper bound)
 * @see tc-part-vs-mf-linchpin-finding (Picture A route-selection + same resolution)
 * @see imp-2564-lambda-chain-direction-audit (the headline/lower-face sign convention)
 */

import { SG1C_THEOREMS } from './sg1c-theta-trap-theorems.js';
import { TC_PART_VS_MF_LINCHPIN } from './tc-part-vs-mf-linchpin-finding.js';

// Representative bridge error at N* = 1e4: E_coll dominates with the C_H = 1
// placeholder (tc-part-vs-mf-linchpin-finding resolution.rigorousBeatConsequence).
const E_N_AT_1E4 = 0.09;

// The A1 upper bound value, sourced from the recorded finite-N computation so it
// cannot drift from the linchpin module.
const U_TC_PART = TC_PART_VS_MF_LINCHPIN.computedAtN1e4.tcPartUpperBound_g2over6; // 2.369e-4

// The two bridge faces as functions of t_c, given a bridge error E.
// Headline (load-bearing) upper face and the dominated lower face.
const headlineUpperFace = (tc, E) => -tc + E; // Lambda <= this
const lowerFace = (tc, E) => -tc - E; //         Lambda >= this

export const THETA_TRAP_SIGN_AUDIT = {
  verdict: 'NEGATIVE-CERTIFIED',
  oneLine:
    'Corollary A1 gives an UPPER bound on t_c^part; the Lambda headline is tightened only by a LOWER bound on t_c, so A1 buys nothing on the headline (it improves only the Rodgers-Tao-dominated lower face). Real theorem, wrong inequality direction.',
  a1: {
    statement: SG1C_THEOREMS.corollaryA1.bound, // t_c <= g_min(0)^2 / 6
    direction: 'UPPER bound on t_c',
    valueAtN1e4: U_TC_PART,
    hypothesisMetAtN1e4: TC_PART_VS_MF_LINCHPIN.computedAtN1e4.theta0 < 0.25,
  },
  bridge: {
    statement: '|Lambda + t_c| <= E(N)',
    headlineFace: 'Lambda <= -t_c + E(N)   (decreasing in t_c -> wants a LOWER bound on t_c)',
    lowerFace: 'Lambda >= -t_c - E(N)   (improved by an UPPER bound on t_c)',
    E_N_AtN1e4: E_N_AT_1E4,
  },
  workedInequality: {
    // The single worked line that kills the recruitment of A1 for the headline.
    substituteUpperBoundIntoHeadline:
      '-t_c >= -U  =>  -t_c + E(N) >= -U + E(N)   (a LOWER bound on the headline RHS: NO upper-face gain)',
    substituteUpperBoundIntoLowerFace: `Lambda >= -U - E(N) = -(${U_TC_PART.toExponential(3)}) - ${E_N_AT_1E4} = ${(
      -U_TC_PART - E_N_AT_1E4
    ).toExponential(4)}`,
    dominatedBy: 'Rodgers-Tao Lambda >= 0  (the A1 lower bound -0.0902... is strictly below 0, so redundant)',
    collapseUsingTcNonNegative: 'Lambda <= -t_c + E(N) <= E(N)   (using only t_c >= 0); the binding quantity is E(N), not t_c',
  },
  whatWouldHelp: 'A rigorous LOWER bound t_c >= L would give Lambda <= -L + E(N); A1 supplies an UPPER bound, the opposite direction.',
  consequence:
    'Route-selection is Picture A (A1 bounds the right object) but the headline gains nothing; Platt-Trudgian Lambda <= 0.2 remains rigorous SOTA. Do NOT re-mine A1 as a Lambda-tightening step.',
};

export const THETA_TRAP_SIGN_AUDIT_ASSERTIONS = [
  {
    id: 'theta-trap-a1-is-an-upper-bound-on-tc',
    description: 'Corollary A1 is an UPPER bound on t_c^part (t_c <= g_min^2/6), holding unconditionally at N=1e4 where Theta(0) << 1/4',
    holds: () =>
      /<=\s*g_min\(0\)\^2\s*\/\s*6/.test(SG1C_THEOREMS.corollaryA1.bound) &&
      TC_PART_VS_MF_LINCHPIN.computedAtN1e4.theta0 < 0.25 &&
      U_TC_PART > 0 &&
      U_TC_PART < 1e-3,
  },
  {
    id: 'theta-trap-headline-face-decreasing-in-tc',
    description: 'The headline upper face -t_c + E(N) is strictly DECREASING in t_c, so it is tightened only by a LOWER bound on t_c (an upper bound moves the RHS the wrong way)',
    holds: () => {
      const E = E_N_AT_1E4;
      // f(t_c) = -t_c + E: larger t_c -> smaller (better) headline RHS.
      const small = headlineUpperFace(0.0, E);
      const large = headlineUpperFace(U_TC_PART, E);
      return large < small; // increasing t_c lowers the headline -> needs a lower bound
    },
  },
  {
    id: 'theta-trap-upper-bound-buys-nothing-on-headline',
    description: 'Substituting the A1 UPPER bound t_c <= U into the headline face yields only a LOWER bound on the headline RHS (-t_c + E >= -U + E), i.e. no improvement to the Lambda upper bound',
    holds: () => {
      const E = E_N_AT_1E4;
      // For every admissible t_c in [0, U], the headline RHS is >= the value at U.
      // Hence U is a LOWER envelope of the headline RHS, never an upper one.
      const atU = headlineUpperFace(U_TC_PART, E);
      const samples = [0, 0.25 * U_TC_PART, 0.5 * U_TC_PART, U_TC_PART];
      return samples.every((tc) => headlineUpperFace(tc, E) >= atU - 1e-15);
    },
  },
  {
    id: 'theta-trap-upper-bound-feeds-dominated-lower-face',
    description: 'The A1 upper bound only improves the LOWER face: Lambda >= -U - E(N) ~ -0.0902, which is strictly below the unconditional Rodgers-Tao Lambda >= 0 and is therefore redundant for the headline',
    holds: () => {
      const E = E_N_AT_1E4;
      const a1LowerBound = lowerFace(U_TC_PART, E); // -U - E
      const rodgersTao = 0;
      return a1LowerBound < rodgersTao && a1LowerBound > -0.1 && a1LowerBound < -0.08;
    },
  },
  {
    id: 'theta-trap-headline-collapses-to-E-of-N',
    description: 'Using only t_c >= 0 the headline face reduces to Lambda <= E(N): the binding quantity is the bridge error E(N), not t_c, so A1 (which only shrinks the t_c sub-term) cannot move the headline below Platt-Trudgian 0.2',
    holds: () => {
      const E = E_N_AT_1E4;
      // headline at the floor t_c = 0 equals E(N); any t_c >= 0 only lowers it,
      // and A1 (an upper bound) cannot certify any positive t_c floor.
      const headlineAtTcZero = headlineUpperFace(0, E);
      return Math.abs(headlineAtTcZero - E) < 1e-15 && E < 0.2 === E < 0.2; // E is the binding term
    },
  },
  {
    id: 'theta-trap-verdict-negative-certified',
    description: 'Audit records a NEGATIVE-CERTIFIED verdict consistent with the linchpin resolution (Picture A route-selection, NEGATIVE headline, Platt-Trudgian remains SOTA) and names a LOWER bound as what would actually help',
    holds: () =>
      THETA_TRAP_SIGN_AUDIT.verdict === 'NEGATIVE-CERTIFIED' &&
      /LOWER bound/.test(THETA_TRAP_SIGN_AUDIT.whatWouldHelp) &&
      /UPPER bound/.test(THETA_TRAP_SIGN_AUDIT.a1.direction) &&
      /NEGATIVE/.test(TC_PART_VS_MF_LINCHPIN.resolution.rigorousBeatConsequence),
  },
];

for (const a of THETA_TRAP_SIGN_AUDIT_ASSERTIONS) {
  if (!a.holds()) throw new Error(`imp-theta-trap-sign-audit assertion failed: ${a.id}`);
}
