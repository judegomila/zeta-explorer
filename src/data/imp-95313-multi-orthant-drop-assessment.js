/**
 * @module imp-95313-multi-orthant-drop-assessment
 * @fileoverview imp-95313 -- ASSESSMENT (derivation, no new bound) of whether
 *   the imp-95254 LEMMA ODROP orthant cross-term drop extends from TWO
 *   orthants to a finer SIGNED MULTI-ORTHANT (multi-block) decomposition
 *   without re-adding left-tail cancellation mass.
 *
 *   SETUP (imp-95221/95222/95233/95254 model)
 *   -----------------------------------------------
 *   Packets f_n(s) = e^(-mu_n|s-u_n|), rates mu_n > 0, centers u_n > 0, real
 *   amplitudes c_n. The left-tail Gram L_mn = e^(-(mu_m u_m + mu_n u_n))
 *   / (mu_m + mu_n) is ENTRYWISE POSITIVE (every center positive). Left-tail
 *   seam energy W(f) = c^T L c. LEMMA ODROP splits c = c_plus - c_minus into
 *   its two nonnegative-orthant parts (disjoint supports) and drops the
 *   single cross term:
 *     c^T L c = c_plus^T L c_plus + c_minus^T L c_minus - 2 c_plus^T L c_minus
 *             <= c_plus^T L c_plus + c_minus^T L c_minus,
 *   valid UNCONDITIONALLY because c_plus^T L c_minus >= 0 (nonnegative
 *   vectors, entrywise-positive L).
 *
 *   THE GENERAL MULTI-BLOCK DROP
 *   -----------------------------------------------
 *   Partition the index set into blocks B_1, ..., B_p (disjoint supports),
 *   let c^(k) be c restricted to B_k with its signs kept, so c = sum_k c^(k).
 *   Then
 *     c^T L c = D + X,   D = sum_k (c^(k))^T L c^(k),
 *               X = sum_(k != l) (c^(k))^T L c^(l)   (cross-block mass).
 *   Dropping ALL cross-block terms, i.e. bounding W(f) <= D, is valid as an
 *   UPPER bound iff X <= 0.
 *
 *   THE SIGN CONDITION (the derived condition on the partition)
 *   -----------------------------------------------
 *   The clean case is a partition into SIGNED blocks: every index in B_k
 *   shares one sign sigma_k in {+, -} (a "sign/scale orthant"). Write the
 *   magnitude-Gram block mass G_kl = sum_(i in B_k, j in B_l) |c_i| |c_j|
 *   L_ij >= 0. Then (c^(k))^T L c^(l) = sigma_k sigma_l G_kl, so
 *     X = 2 * sum_(k < l) sigma_k sigma_l G_kl
 *       = 2 * [ SUM_same G_kl  -  SUM_opp G_kl ],
 *   where SUM_same runs over same-sign block pairs and SUM_opp over
 *   opposite-sign pairs. Hence the multi-block drop W(f) <= D is valid iff
 *     SUM_same G_kl  <=  SUM_opp G_kl                        (CONDITION MOD)
 *   -- the total SAME-sign cross overlap must not exceed the total
 *   OPPOSITE-sign cross overlap.
 *
 *   WHY TWO ORTHANTS IS THE UNIQUE FREE-LUNCH PARTITION
 *   -----------------------------------------------
 *   In the two-orthant split each sign CLASS is a single block, so there are
 *   NO same-sign block pairs: SUM_same = 0, and CONDITION MOD holds
 *   unconditionally (X = -2 c_plus^T L c_minus <= 0). This is exactly the
 *   ODROP free lunch. The two-orthant partition is the UNIQUE coarsest
 *   partition making each sign class one block; it is the maximal partition
 *   for which dropping every cross term is valid for ALL amplitude
 *   geometries at once.
 *
 *   WHY A STRICT REFINEMENT RE-ADDS CANCELLATION MASS
 *   -----------------------------------------------
 *   Splitting a sign class (say the positive part into sub-blocks A, B, both
 *   +) creates a SAME-sign pair with G_AB > 0 whenever A and B overlap in
 *   the Gram sense (generic, since L > 0). That term is now DROPPED, so the
 *   refined diagonal sum obeys the exact identity
 *     D_refine = D_two-orthant - 2 * SUM_same G_kl <= D_two-orthant.
 *   The drop is valid ONLY when the discarded same-sign mass is dominated by
 *   opposite-sign mass (CONDITION MOD). It is NOT a uniform rule: take
 *   c_minus = 0 (all amplitudes one sign). Then SUM_opp = 0 while
 *   SUM_same > 0, so CONDITION MOD FAILS and W(f) <= D_refine is FALSE (it
 *   becomes a strict LOWER bound). So no fixed refinement of a sign class
 *   drops cross mass for free -- it re-adds exactly the cancellation the
 *   two-orthant split had removed at cost zero.
 *
 *   CAN A REFINEMENT STRENGTHEN PHASE-AM? -- NO (uniform); pointwise only.
 *   -----------------------------------------------
 *   PHASE-AM is a UNIFORM certificate in the (theta, y_min) currency, built
 *   as ODROP then LEMMA ENT (entrywise L_mn <= (1/2) e^(-y_min) M_mn) summed
 *   inside each orthant block. A finer partition would strengthen it only if
 *   D_refine were a valid upper bound for ALL families -- but CONDITION MOD
 *   is exactly a sign-GEOMETRY statement that the currency (theta, y_min)
 *   does not encode (theta is a magnitude/energy ratio; the c_minus = 0
 *   counterexample has arbitrary theta). So no fixed finer partition yields
 *   a uniform sharpening. When CONDITION MOD HAPPENS to hold, D_refine is
 *   strictly smaller than the two-orthant D, so refinement is a POINTWISE,
 *   geometry-conditional sharpening -- data-dependent, not a certificate.
 *   The deepest refinement (singletons, D = sum_n c_n^2 L_nn, all
 *   off-diagonal dropped) is valid iff sum_(i != j) c_i c_j L_ij <= 0, the
 *   strongest sign-alternation demand and the most fragile.
 *
 *   VERDICT
 *   -----------------------------------------------
 *   The ODROP drop does NOT extend to a finer signed multi-orthant partition
 *   for free. The exact condition is CONDITION MOD (SUM_same G <= SUM_opp G);
 *   the two-orthant split is the unique partition satisfying it
 *   unconditionally (SUM_same = 0). Any strict refinement re-adds same-sign
 *   cancellation mass and is valid only under a data-dependent sign-geometry
 *   condition invisible to (theta, y_min), so it cannot strengthen PHASE-AM
 *   uniformly -- at most a pointwise conditional sharpening. Assessment only;
 *   changes NO Lambda bound; NO QED; no refereed bound is changed.
 *
 * @see imp-95254-orthant-split-phase-certificate.js (LEMMA ODROP, LEMMA ENT,
 *   THEOREM PHASE-AM)
 * @see imp-95321-odrop-orthant-cross-term-drop-concept-note.js (ODROP note)
 *
 * Ticket: imp-95313 (proof, medium). Import-light; no new bound.
 */

// -- exact left-tail Gram (closed form; no quadrature) -----------------------
function leftL(mu1, u1, mu2, u2) {
  return Math.exp(-(mu1 * u1 + mu2 * u2)) / (mu1 + mu2);
}
function mulberry(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const IMP95313_MULTI_ORTHANT_DROP_ASSESSMENT = Object.freeze({
  id: 'imp-95313',
  proofSection: 'S-frontier',
  glosses: 'imp-95254',
  question:
    'Does the imp-95254 LEMMA ODROP two-orthant cross-term drop extend to a ' +
    'finer signed multi-orthant partition without re-adding left-tail ' +
    'cancellation mass, and can any such refinement strengthen PHASE-AM?',
  conditionMOD:
    'For a partition into signed blocks B_k (each index one sign sigma_k), ' +
    'with G_kl = sum_(i in B_k, j in B_l) |c_i||c_j| L_ij >= 0, the ' +
    'all-cross-terms drop W(f) = c^T L c <= sum_k (c^(k))^T L c^(k) is valid ' +
    'iff X = 2[SUM_same G_kl - SUM_opp G_kl] <= 0, i.e. SUM_same G_kl <= ' +
    'SUM_opp G_kl (total same-sign cross overlap does not exceed total ' +
    'opposite-sign cross overlap).',
  twoOrthantIsUnique:
    'The two-orthant split makes each sign class a single block, so ' +
    'SUM_same = 0 and CONDITION MOD holds UNCONDITIONALLY (X = ' +
    '-2 c_plus^T L c_minus <= 0). It is the unique coarsest / maximal ' +
    'partition for which dropping every cross term is valid for all ' +
    'amplitude geometries -- the ODROP free lunch.',
  refinementReAddsMass:
    'Splitting any sign class into sub-blocks A, B creates a same-sign pair ' +
    'with G_AB > 0 (generic, L entrywise positive). The refined diagonal ' +
    'sum obeys D_refine = D_two-orthant - 2 SUM_same G_kl, and the drop is ' +
    'valid only under CONDITION MOD; the c_minus = 0 family (all one sign) ' +
    'has SUM_opp = 0 < SUM_same, so W(f) <= D_refine is FALSE there. A ' +
    'strict refinement re-adds cancellation mass the two-orthant split had ' +
    'removed at cost zero.',
  phaseAMImpact:
    'PHASE-AM is a UNIFORM (theta, y_min) certificate. CONDITION MOD is a ' +
    'sign-GEOMETRY statement not encoded by that currency (the c_minus = 0 ' +
    'counterexample has arbitrary theta), so no fixed finer partition ' +
    'sharpens PHASE-AM uniformly. When CONDITION MOD happens to hold, ' +
    'D_refine is strictly below the two-orthant bound -- a POINTWISE, ' +
    'data-dependent sharpening only, never a certificate-level one.',
  anyEnclosureEstablished: false,
  verdict:
    'ASSESSMENT (derivation, no new bound): the ODROP drop does NOT extend ' +
    'to a finer signed multi-orthant partition for free. Exact validity ' +
    'condition = CONDITION MOD (SUM_same G <= SUM_opp G); the two-orthant ' +
    'split is the unique partition satisfying it unconditionally ' +
    '(SUM_same = 0). Every strict refinement re-adds same-sign cancellation ' +
    'mass and is valid only under a data-dependent sign-geometry condition ' +
    'invisible to (theta, y_min), so it cannot strengthen PHASE-AM ' +
    'uniformly -- at most a pointwise conditional sharpening. Changes NO ' +
    'Lambda bound; NO QED; no refereed bound is changed.',
  citation:
    'imp-95254-orthant-split-phase-certificate.js (LEMMA ODROP / ENT / ' +
    'THEOREM PHASE-AM); imp-95321 (ODROP concept note).',
});

export default IMP95313_MULTI_ORTHANT_DROP_ASSESSMENT;

// -- self-executing assertions (import-light; THROW on violation) ------------
export const IMP95313_MULTI_ORTHANT_DROP_ASSERTIONS = [
  {
    id: 'imp95313-two-orthant-drop-unconditional',
    why:
      'The two-orthant drop must hold with X <= 0 on every signed family ' +
      '(the ODROP free lunch), confirming SUM_same = 0 there.',
    holds: () => {
      const rand = mulberry(953130);
      for (let t = 0; t < 8000; t++) {
        const n = 2 + Math.floor(rand() * 4);
        const mu = [];
        const u = [];
        const c = [];
        for (let k = 0; k < n; k++) {
          mu.push(0.2 + 4 * rand());
          u.push(0.1 + 3 * rand());
          c.push((rand() - 0.5) * 6);
        }
        let cTLc = 0;
        let D2 = 0;
        for (let i = 0; i < n; i++)
          for (let j = 0; j < n; j++) {
            const L = leftL(mu[i], u[i], mu[j], u[j]);
            cTLc += c[i] * c[j] * L;
            const ip = Math.max(c[i], 0);
            const im = Math.max(-c[i], 0);
            const jp = Math.max(c[j], 0);
            const jm = Math.max(-c[j], 0);
            D2 += (ip * jp + im * jm) * L;
          }
        if (cTLc > D2 + 1e-9) return false;
      }
      return true;
    },
  },
  {
    id: 'imp95313-refinement-fails-when-single-sign',
    why:
      'CONDITION MOD must FAIL for an all-positive family: splitting the ' +
      'positive class re-adds mass, so the refined diagonal sum is a strict ' +
      'LOWER bound (D_refine < c^T L c), proving refinement is not a uniform ' +
      'free lunch.',
    holds: () => {
      const mu = [1, 2];
      const u = [0.5, 0.7];
      const c = [1, 1];
      const L11 = leftL(1, 0.5, 1, 0.5);
      const L22 = leftL(2, 0.7, 2, 0.7);
      const L12 = leftL(1, 0.5, 2, 0.7);
      const cTLc = c[0] * c[0] * L11 + c[1] * c[1] * L22 + 2 * c[0] * c[1] * L12;
      const Dref = c[0] * c[0] * L11 + c[1] * c[1] * L22; // same-sign cross dropped
      // refinement invalid: dropping the (positive) same-sign cross UNDERSHOOTS
      return Dref < cTLc - 1e-12 && L12 > 0;
    },
  },
  {
    id: 'imp95313-condition-mod-identity-decides-validity',
    why:
      'On random signed families with a random refinement of the positive ' +
      'class into two sub-blocks, the dropped cross mass satisfies the exact ' +
      'identity c^T L c - D_refine = 2 (SUM_same G - SUM_opp G) -- so the ' +
      'multi-block drop is valid (D_refine >= c^T L c) precisely when ' +
      'CONDITION MOD (SUM_same <= SUM_opp) holds. Both the valid and invalid ' +
      'regimes must occur.',
    holds: () => {
      const rand = mulberry(20260914);
      let sawValid = false;
      let sawInvalid = false;
      for (let t = 0; t < 12000; t++) {
        const n = 2 + Math.floor(rand() * 4);
        const mu = [];
        const u = [];
        const c = [];
        for (let k = 0; k < n; k++) {
          mu.push(0.2 + 4 * rand());
          u.push(0.1 + 3 * rand());
          c.push((rand() - 0.5) * 6);
        }
        const posIdx = [];
        for (let i = 0; i < n; i++) if (c[i] > 0) posIdx.push(i);
        if (posIdx.length < 2) continue;
        // block map: 0 = A (pos), 1 = B (pos), 2 = negatives
        const blk = new Array(n).fill(2);
        posIdx.forEach((idx, k) => {
          blk[idx] = rand() < 0.5 ? 0 : 1;
        });
        let cTLc = 0;
        let Dref = 0;
        let sumSame = 0;
        let sumOpp = 0;
        for (let i = 0; i < n; i++)
          for (let j = 0; j < n; j++) {
            const L = leftL(mu[i], u[i], mu[j], u[j]);
            cTLc += c[i] * c[j] * L;
            if (blk[i] === blk[j]) Dref += c[i] * c[j] * L;
            else if (i < j) {
              const g = Math.abs(c[i]) * Math.abs(c[j]) * L;
              const si = c[i] >= 0 ? 1 : -1;
              const sj = c[j] >= 0 ? 1 : -1;
              if (si === sj) sumSame += g;
              else sumOpp += g;
            }
          }
        // the exact cross-mass identity (the analytic content of CONDITION MOD)
        const X = cTLc - Dref;
        if (Math.abs(X - 2 * (sumSame - sumOpp)) > 1e-9) return false;
        // validity of the drop is governed by the sign of X = 2(SUM_same-SUM_opp)
        if (X <= 0) sawValid = true;
        else sawInvalid = true;
      }
      return sawValid && sawInvalid;
    },
  },
  {
    id: 'imp95313-valid-refinement-can-be-tighter',
    why:
      'When CONDITION MOD holds the refined bound can be strictly below the ' +
      'two-orthant bound -- confirming refinement is a genuine but ' +
      'data-dependent (pointwise) sharpening, not a uniform one.',
    holds: () => {
      const rand = mulberry(77313);
      for (let t = 0; t < 20000; t++) {
        const n = 3 + Math.floor(rand() * 3);
        const mu = [];
        const u = [];
        const c = [];
        for (let k = 0; k < n; k++) {
          mu.push(0.2 + 4 * rand());
          u.push(0.1 + 3 * rand());
          c.push((rand() - 0.5) * 6);
        }
        const posIdx = [];
        for (let i = 0; i < n; i++) if (c[i] > 0) posIdx.push(i);
        if (posIdx.length < 2) continue;
        const blk = new Array(n).fill(2);
        posIdx.forEach((idx, k) => {
          blk[idx] = rand() < 0.5 ? 0 : 1;
        });
        let cTLc = 0;
        let Dref = 0;
        let D2 = 0;
        for (let i = 0; i < n; i++)
          for (let j = 0; j < n; j++) {
            const L = leftL(mu[i], u[i], mu[j], u[j]);
            cTLc += c[i] * c[j] * L;
            if (blk[i] === blk[j]) Dref += c[i] * c[j] * L;
            const ip = Math.max(c[i], 0);
            const im = Math.max(-c[i], 0);
            const jp = Math.max(c[j], 0);
            const jm = Math.max(-c[j], 0);
            D2 += (ip * jp + im * jm) * L;
          }
        if (Dref >= cTLc - 1e-9 && Dref < D2 - 1e-9) return true; // valid AND tighter
      }
      return false;
    },
  },
  {
    id: 'imp95313-honesty-gate-no-qed',
    why:
      'Assessment only: no enclosure established, no-refereed-bound-change line present, ' +
      'glosses imp-95254.',
    holds: () =>
      IMP95313_MULTI_ORTHANT_DROP_ASSESSMENT.anyEnclosureEstablished ===
        false &&
      IMP95313_MULTI_ORTHANT_DROP_ASSESSMENT.glosses === 'imp-95254' &&
      /refereed bound is changed/i.test(IMP95313_MULTI_ORTHANT_DROP_ASSESSMENT.verdict) &&
      /CONDITION MOD/.test(IMP95313_MULTI_ORTHANT_DROP_ASSESSMENT.verdict) &&
      /NO QED/.test(IMP95313_MULTI_ORTHANT_DROP_ASSESSMENT.verdict),
  },
];

for (const assertion of IMP95313_MULTI_ORTHANT_DROP_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-95313-multi-orthant-drop-assessment assertion failed: ${assertion.id}`
    );
  }
}
