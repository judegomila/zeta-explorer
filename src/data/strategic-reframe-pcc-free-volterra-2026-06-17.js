/**
 * @module strategic-reframe-pcc-free-volterra-2026-06-17
 *
 * STRATEGIC REFRAME (Opus 4.8 max fan-out, 2026-06-17, fresh-angles-pcc-fanout
 * 4 routes + adversarial synthesis). The single most consequential strategic
 * finding of the session: the project's closest-to-rigorous direct-RH target
 * does NOT inherit the Montgomery pair-correlation (PCC) barrier.
 *
 * THE RESOLUTION (imp-1258 vs imp-2656 contradiction, settled for imp-2656).
 * The Volterra / Conjecture-27.2 collapse  ||V_{a,Phi}|| <= 1  =>  CDB-Exist
 * =>  K_a >= 0  =>  RH  is PCC-FREE. The imp-1258 caveat "still conditional on
 * Montgomery PCC (per imp-1184)" is an UNSUPPORTED, MIS-ATTRIBUTED assertion,
 * proven three independent ways:
 *   (1) Chain-walk: imp-1258 FORWARD (7 steps) + REVERSE (5 steps) -- NONE
 *       invokes zero pair-correlation, the sine kernel, rho_2, or rho_3. Every
 *       step is a textbook de Branges/Krein identity or the single Section-27
 *       paper-construct (block-positivity <=> K_a PSD).
 *   (2) Grep: imp-1184 has ZERO hits for Volterra|V_{a|27.2|CDB|de Branges|K_a|
 *       block-positiv|Hankel. imp-1184 is entirely about psi_N = sup|Im m_N - pi|
 *       (Stieltjes transform of the ZERO measure, Stream A), where PCC enters at
 *       steps D3 (sine-kernel rho_2) / D5 (rho_3). DISJOINT object class.
 *   (3) Self-contradiction: imp-1258's own NON_CIRCULARITY_AUDIT proves V, K_a,
 *       E_a, H(E_a), dm_a are ALL built from Phi via cosh/sinh Fourier integrals
 *       with the Hadamard/zero path EXPLICITLY avoided -- so the PCC caveat
 *       contradicts the file's own audit.
 *
 * WHY THIS MATTERS. Montgomery PCC is the documented 50-year TERMINAL wall for
 * Stream A (Lambda/ESY). The erroneous imp-1258 caveat made Stream B (Volterra)
 * look equally PCC-blocked, so bandwidth went to "routing around PCC" for a
 * chain PCC was never in. The reframe: Stream B's closest-to-rigorous target
 * (Conj 27.2; physical band; HS-bounded ~5000x margin; imp-2656 closenessScore
 * 0.65) is an OPERATOR-THEORY problem, not an analytic-number-theory
 * pair-correlation problem. This is where maximal leverage should now go.
 *
 * THE TWO REAL (PCC-free) GAPS -- the new highest-leverage targets:
 *   GAP-1 (Section-27 identity, HIGHEST leverage): the block-positivity <=>
 *     K_a-PSD equivalence is the SOLE load-bearing paper-construct; BOTH collapse
 *     directions pass through it (imp-1258 forward step 3, reverse step 4); it is
 *     taken on faith (imp-1265 collapse-with-caveats), never independently
 *     re-derived. If it holds, the whole Section 15-27 program (7+ conjectures)
 *     genuinely collapses to ONE operator-norm bound. If it has a gap, the
 *     collapse loses a direction. Verifying/breaking it is decisive.
 *   GAP-2 (L^2([0,inf)) Volterra norm bound = Conj 27.2 itself): unproven; only
 *     finite-[0,U] numerics (||V|| <= 7.45e-5, ~5000x margin), Wiener-Hopf tail
 *     past U and the a->0 limit uncontrolled. NOTE imp-1287 Wiener-Hopf was a
 *     caught overclaim -- do NOT reuse that chain without re-audit.
 *
 * HONESTY GUARD: PCC-FREE does NOT mean rigorous. 27.2 => RH is NOT proven; it
 * has the two named gaps above. The contribution here is severing a false PCC
 * dependency and naming the real (operator-theory) gaps precisely.
 *
 * DEAD / NON-BINDING (do not invest):
 *   - PCC attacks (Goldston-Gonek imp-1302, Selberg-trace imp-1297): correctly
 *     closed NEGATIVE; the support>1 strong PCC is genuinely 50-years-open.
 *     [imp-1302 separately has a BUILD-CERTIFIED fabricated citation: cites
 *     "Annals of Math 148 (1998)" but GG1998 is Acta Arithmetica 84, 155-192 --
 *     a 5th overclaim, to be fixed.]
 *   - 2024 zero-density (Guth-Maynard, Soundararajan-Tao, Bui-Sound): ZERO
 *     leverage. E_trunc_ingham = 3.06e-5 is ~261x BELOW the binding L_cond
 *     ~0.008, so no zero-density sharpening moves the Lambda headline; and they
 *     are zero-DENSITY inputs, wrong object class for PCC. (Verified: GM binds at
 *     sigma=0.75 only, o(1) not effectivized; Soundararajan-Tao 2024 is a phantom
 *     citation, real referent is conditional 2009 moments.)
 *   - Theta-trap / heat-discriminant cross-pollination: no bridge to RH or
 *     sub-0.2 Lambda; the exact discriminant t_c IS a clean PCC-free audit
 *     instrument but yields only the trivial Lambda >= -g^2/6 lower bound.
 *
 * @see imp-1258-volterra-cdb-bridge (the false PCC caveat to fix; the collapse chain)
 * @see imp-1265 (Section-27 collapse-with-caveats characterization)
 * @see imp-1267-volterra-hs-bound (the ~5000x HS margin)
 * @see imp-1184-direct-selberg-esy-route-audit (the REAL PCC obstruction -- Stream A only)
 * @see maxfanout-honest-status-2026-06-17 (the 4 caught overclaims + PT-still-SOTA status)
 */

export const STRATEGIC_REFRAME = {
  date: '2026-06-17',
  finding: 'The Volterra/Conj-27.2 route to RH is PCC-FREE (imp-1258 PCC caveat is a mis-attributed unsupported assertion)',
  closestToRigorousTarget: 'Conjecture 27.2 (||V_{a,Phi}||<=1, physical band), closenessScore 0.65, ~5000x HS margin',
  realGaps: ['GAP-1 Section-27 block-positivity<=>K_a-PSD identity (highest leverage)', 'GAP-2 L^2([0,inf)) Volterra norm bound (Conj 27.2 itself)'],
  pccStatus: 'Montgomery strong PCC (support>1) remains 50-years-open; NOT in the 27.2 chain; do not invest in attacking it',
  literatureLeverage: 'ZERO rigorous leverage from 2024 zero-density (E_trunc non-binding, wrong object for PCC)',
  fifthOverclaim: 'imp-1302 build-certifies a fabricated citation (Annals 148 vs real Acta Arithmetica 84, 155-192)',
  honestGuard: 'PCC-FREE does NOT mean rigorous; 27.2=>RH has the two named operator-theory gaps',
};

export const STRATEGIC_REFRAME_ASSERTIONS = [
  {
    id: 'reframe-volterra-is-pcc-free',
    description: 'Records the decisive finding: the 27.2 route is PCC-free, real gaps are operator-theory not pair-correlation',
    holds: () => /PCC-FREE/.test(STRATEGIC_REFRAME.finding) && STRATEGIC_REFRAME.realGaps.length === 2 && /Section-27/.test(STRATEGIC_REFRAME.realGaps[0]),
  },
  {
    id: 'reframe-honesty-guard-present',
    description: 'PCC-free is not conflated with rigorous; the honesty guard is recorded',
    holds: () => /does NOT mean rigorous/.test(STRATEGIC_REFRAME.honestGuard),
  },
  {
    id: 'reframe-literature-and-pcc-dead-ends-named',
    description: '2024 literature zero-leverage and the live PCC wall both recorded as non-investment',
    holds: () => /ZERO rigorous leverage/.test(STRATEGIC_REFRAME.literatureLeverage) && /50-years-open/.test(STRATEGIC_REFRAME.pccStatus),
  },
];

for (const a of STRATEGIC_REFRAME_ASSERTIONS) {
  if (!a.holds()) throw new Error(`strategic-reframe-pcc-free-volterra assertion failed: ${a.id}`);
}
