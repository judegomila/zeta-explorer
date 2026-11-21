/**
 * @module imp-35459-etrunc-ct-kappat-dependence-scope
 *
 * imp-35459 (proof/assessment, S-frontier): SCOPE the C_T / kappa_T constant
 * dependence of the E_trunc = 3.06e-5 fixed-strip barrier-lemma value (imp-2631,
 * cited UNTOUCHED across the imp-35411/35413/35417 sigma/far-tail cohort) and
 * ASSESS whether a tighter or literature-anchored (Trudgian/Platt line) value is
 * available, or whether 3.06e-5 is genuinely pinned. This is the CONSTANT-
 * DEPENDENCE companion to imp-35419 (which scoped what PORTING the barrier lemma
 * would require): here we hold the barrier reclassification fixed and ask the
 * narrower question -- how does the recorded numeric value move under its inputs
 * C_T, kappa_T, B, and could any admissible literature refinement of those
 * inputs reduce it below its committed 3.06e-5.
 *
 * ASSESSMENT / SCOPING ONLY. Changes NOTHING about the current 3.06e-5, tightens
 * no bound, closes no gap, establishes no operator positivity; no RH verdict,
 * NO QED. No refereed bound is changed.
 *
 * PART A -- THE C_T / kappa_T FUNCTIONAL FORM OF THE RECORDED VALUE
 * -----------------------------------------------------------------------------
 * The PT-anchored far-tail truncation is an integration-by-parts count integral
 * (imp-34791 R2, the honest dN route):
 *     E_trunc_pt = int_{T_PT}^inf (2/t) dN_off(t)
 *                = [2 N_off(t)/t]_{T_PT}^inf + 2 int_{T_PT}^inf N_off(t)/t^2 dt
 *                <= 2 int_{T_PT}^inf N(sigma, t)/t^2 dt,
 * with the boundary term vanishing EXACTLY because N_off(T_PT) = 0 (Platt-
 * Trudgian 2021 verified the RH to T_PT = 3e12). Feeding the explicit zero-
 * density envelope N(sigma, t) <= C_T t^{1 - kappa_T} (log t)^B and taking the
 * geometric-envelope tail gives the closed leading form:
 *
 *     E_trunc_pt  ~  (2 C_T / kappa_T) * (log T_PT)^B * T_PT^{-kappa_T}.
 *
 * So the value has THREE constant inputs, in three DIFFERENT sensitivity classes:
 *   - kappa_T (the density exponent gap): appears BOTH as T_PT^{-kappa_T} (an
 *     EXPONENTIAL lever at T_PT = 3e12) and as the 1/kappa_T prefactor. This is
 *     the dominant lever by far. d(log E)/d(kappa_T) = -(log T_PT + 1/kappa_T)
 *     = -31.23 at kappa_T = 0.4: a +0.01 shift in kappa_T cuts E by ~27%.
 *   - C_T (the explicit density leading constant): a LINEAR lever,
 *     d(log E)/d(C_T) = 1/C_T. Order-unity leverage only.
 *   - B (the log-power): a mild lever via (log T_PT)^B = 28.73^B.
 *
 * The recorded clean-count 3.06e-5 is exactly the C_T = 1, B = 0 idealization at
 * the clean prefactor 2 e_I/kappa_T = 3.0 (e_I(3/4) = 0.6):
 *     3.0 * T_PT^{-0.4} = 3.0 * 1.021e-5 = 3.064e-5.
 * imp-34791 R2 corrected the prefactor to 2/kappa_T = 5.0 (the dN <= dNbar step
 * was unsound), giving the parts-corrected 5.0 * 1.021e-5 = 5.106e-5. BOTH are
 * C_T = 1, B = 0 IDEALIZATIONS, not literature-anchored values.
 *
 * PART B -- IS kappa_T TIGHTENABLE? (LOCKED, NOT LITERATURE-IMPROVABLE)
 * -----------------------------------------------------------------------------
 * kappa_T is NOT a free literature constant one can shop for a tighter value of.
 * At the PT anchor the strip is FIXED at sigma = 3/4 and kappa_T = 1 - e_I(3/4)
 * = 1 - 0.6 = 2/5 EXACTLY (imp-34791 R1, height-independent by construction).
 * Pushing kappa_T higher (which WOULD shrink E exponentially) means pushing the
 * exponent 1 - kappa_T of the density bound DOWN, i.e. a stronger zero-density
 * result -- but that is bought only by moving sigma toward 1/2, and sigma is
 * FLOOR-CAPPED at 1/2 + sqrt(0.1) = 0.8162 by the de Bruijn isolated-pair budget
 * ((2 beta - 1)^2/2 <= 0.2 forces beta <= 0.816; imp-34791 R4). So kappa_T sits
 * in a NARROW pinned band: raise sigma toward 0.816 and the exponent gap and the
 * explicit constants both degrade; lower sigma toward 1/2 and the de Bruijn cap
 * breaks. There is no admissible Trudgian/Platt line that lifts kappa_T for free.
 *
 * PART C -- IS C_T / B TIGHTENABLE? (THE DIRECTION RUNS THE WRONG WAY)
 * -----------------------------------------------------------------------------
 * A literature-anchored value moves C_T and B (not kappa_T). Crucially the honest
 * explicit direction makes E_trunc LARGER, not smaller, because every published
 * explicit zero-density constant has C_T >> 1 and B >= 2 (imp-34791 R4):
 *   - Chourasiya-Simonic 2025 (sharpest explicit at sigma = 3/4): C_T = 8.185,
 *     B = 2.6 -> E_trunc_pt = 3.34, i.e. ~1.1e5x LARGER than the 3.06e-5
 *     idealization and still 16.7x SHORT of 0.2.
 *   - Kadiri-Lumley-Ng 2021 at sigma = 0.9: passes (1.22e-3 < 0.2) but leaves
 *     beta in (1/2, 0.9) unpriced and BREAKS the de Bruijn cap (realness time
 *     0.32 > 0.2).
 *   - Ramare 2016 at sigma = 3/4 (exponent 2/3, B = 3.5): E_trunc_pt = 1.67e5.
 * So 3.06e-5 is NOT a conservative literature value that a tighter line could
 * shave -- it is an OPTIMISTIC C_T = 1 idealization that the honest explicit
 * constants blow past by 5+ orders. A "literature-anchored" replacement makes the
 * number WORSE, not better.
 *
 * PART D -- WHY IT IS GENUINELY PINNED (THE LEVER IS MOOT)
 * -----------------------------------------------------------------------------
 * The decisive point (imp-34791 Part 3 / imp-35419) is that the ENTIRE count
 * integral is unsound as a realness certificate: the 2/gamma per-zero kernel
 * misprices a single admissible deep zero at (beta = 3/4, gamma = 6e12) by
 * ~3.75e11x (price 3.33e-13 vs isolated-pair realness time 0.125), and no count
 * bound excludes one zero. The mispricing ratio is INDEPENDENT of C_T, kappa_T,
 * and B. Therefore ANY refinement of these constants -- tighter or looser --
 * moves a mispriced count ARTIFACT, never the operative residual, which is the
 * deterministic barrier lemma S_barrier (off-line contribution above T_PT is
 * EXACTLY zero under S_barrier; imp-35419). Neither a tighter kappa_T nor a
 * tighter C_T is a Lambda lever: both leave Platt-Trudgian Lambda <= 0.2
 * unchanged. So 3.06e-5 is genuinely PINNED in the only sense that matters for
 * the frontier -- as a vestigial artifact that no literature refinement can
 * promote to a bound-moving quantity. Porting the barrier lemma (the ONLY thing
 * that discharges it) is the imp-35419 breakthrough-tier work item, whose payoff
 * is rigor-parity with PT, not a beat.
 *
 * The punchline: E_trunc_pt = (2 C_T/kappa_T)(log T_PT)^B T_PT^{-kappa_T};
 * kappa_T (the exponential lever) is LOCKED at 2/5 by the sigma = 3/4 strip,
 * which is itself floor-capped at 0.816 by the de Bruijn budget, so kappa_T is
 * not literature-improvable; C_T/B are movable but the honest explicit direction
 * makes E LARGER (3.34 at best explicit), so 3.06e-5 is an optimistic C_T = 1
 * idealization, not a shaveable literature value; and the whole count integral is
 * a mispriced artifact (3.75e11x, C_T/kappa_T-independent) whose true residual is
 * the barrier lemma -- so no C_T/kappa_T refinement is a Lambda lever and 3.06e-5
 * is genuinely pinned. Assessment/scoping only; changes no bound; NO QED.
 *
 * @see imp-35419-etrunc-barrier-lemma-porting-scope (the PORTING companion; the parity-not-beat scope)
 * @see imp-34791-etrunc-eflow-pt-anchor-honest-discharge (kappa_T = 2/5 lock R1; prefactor 3 -> 5 R2; R4 literature mapping)
 * @see imp-35334 (E_trunc dominates the far-tail bridge as sigma -> 0); imp-3933 (gap law, isolated-pair realness time)
 * @see imp-2631 (the recorded fixed-strip E_trunc value); imp-397 (the 2/gamma kernel); imp-2643 (committed N*=1e4 ledger)
 */

// -- Anchor + operative constants (matching imp-34791/imp-35419; no heavy imports) --
const T_PT = 3e12; // Platt-Trudgian 2021 verified height
const SIGMA_FIXED = 0.75; // fixed strip
const E_I = 0.6; // e_I(3/4), the Ingham exponent input
const KAPPA_T = 1 - E_I; // 2/5 EXACTLY, locked at the PT anchor (imp-34791 R1)
const PREF_CLEAN = (2 * E_I) / KAPPA_T; // 3.0 -- the old clean-count prefactor
const PREF_CORR = 2 / KAPPA_T; // 5.0 -- imp-34791 R2 parts-corrected prefactor
const T_PT_POW = Math.pow(T_PT, -KAPPA_T); // 1.021e-5 -- the exponential tail factor
const E_TRUNC_CLEAN = PREF_CLEAN * T_PT_POW; // 3.064e-5 (C_T = 1, B = 0 idealization)
const E_TRUNC_CORR = PREF_CORR * T_PT_POW; // 5.106e-5 (parts-corrected, still C_T = 1)
const DLOGE_DKAPPA = -(Math.log(T_PT) + 1 / KAPPA_T); // -31.23 -- exponential kappa lever
const SIGMA_DEBRUIJN_CAP = 0.5 + Math.sqrt(0.1); // 0.8162 -- de Bruijn realness-budget floor on sigma
const CS_C = 8.185; // Chourasiya-Simonic 2025 explicit leading constant at sigma = 3/4
const CS_B = 2.6; // its log-power
const E_TRUNC_EXPLICIT_CS = 3.34; // recorded honest explicit value (16.7x short of 0.2)
const MISPRICING_RATIO = 3.75e11; // count-kernel mispricing (imp-34791 Part 3), C_T/kappa_T-INDEPENDENT
const L_PT = 0.2; // Platt-Trudgian 2021 bound (unchanged by any C_T/kappa_T refinement)

export const IMP35459_ETRUNC_CT_KAPPAT_DEPENDENCE_SCOPE = {
  id: 'imp-35459',
  proofSection: 'S-frontier',
  question:
    'SCOPE the C_T/kappa_T constant dependence of the E_trunc = 3.06e-5 fixed-strip value (imp-2631, ' +
    'cited UNTOUCHED across imp-35411/35413/35417) and assess whether a tighter or literature-anchored ' +
    '(Trudgian/Platt) value is available, or whether 3.06e-5 is genuinely pinned. Assessment/scoping ' +
    'only; changes no bound; NO QED.',
  functionalForm: {
    closedLeadingForm:
      'E_trunc_pt ~ (2 C_T / kappa_T) * (log T_PT)^B * T_PT^{-kappa_T}, from the imp-34791 R2 ' +
      'integration-by-parts count integral 2 int_{T_PT}^inf N(sigma,t)/t^2 dt with the geometric-' +
      'envelope tail and N(sigma,t) <= C_T t^{1-kappa_T} (log t)^B.',
    inputs: {
      kappa_T:
        'EXPONENTIAL lever: appears as T_PT^{-kappa_T} AND 1/kappa_T; d(log E)/d(kappa_T) = ' +
        '-(log T_PT + 1/kappa_T) = -31.23 at kappa_T = 0.4 (a +0.01 shift cuts E by ~27%).',
      C_T: 'LINEAR lever: d(log E)/d(C_T) = 1/C_T; order-unity leverage only.',
      B: 'mild lever via (log T_PT)^B = 28.73^B.',
    },
    recordedIsIdealization:
      '3.06e-5 = PREF_CLEAN(3.0) * T_PT^{-0.4} at C_T = 1, B = 0; 5.106e-5 = PREF_CORR(5.0) * T_PT^{-0.4} ' +
      'is the imp-34791 R2 parts-corrected value, still a C_T = 1, B = 0 idealization -- NOT literature-anchored.',
    kappaT: KAPPA_T, // 0.4
    prefClean: PREF_CLEAN, // 3.0
    prefCorrected: PREF_CORR, // 5.0
    tailFactor: +T_PT_POW.toExponential(4), // 1.0213e-5
    eTruncClean: +E_TRUNC_CLEAN.toExponential(4), // 3.0639e-5
    eTruncCorrected: +E_TRUNC_CORR.toExponential(4), // 5.1065e-5
    dLogE_dKappa: +DLOGE_DKAPPA.toFixed(3), // -31.230
  },
  kappaTIsLocked: {
    lockedValue:
      'kappa_T = 1 - e_I(3/4) = 1 - 0.6 = 2/5 EXACTLY at the PT anchor (imp-34791 R1), height-independent ' +
      'by construction; NOT a free literature constant to shop a tighter value of.',
    narrowBand:
      'Raising kappa_T (which WOULD shrink E exponentially) means lowering the density exponent 1-kappa_T, ' +
      'bought only by moving sigma toward 1/2 -- but sigma is floor-capped at 1/2 + sqrt(0.1) = 0.8162 by ' +
      'the de Bruijn isolated-pair budget ((2 beta - 1)^2/2 <= 0.2). No admissible line lifts kappa_T for free.',
    sigmaDeBruijnCap: +SIGMA_DEBRUIJN_CAP.toFixed(4), // 0.8162
  },
  ctBDirectionRunsWrong: {
    honestExplicitIsLarger:
      'A literature-anchored value moves C_T and B (not kappa_T), and every published explicit constant has ' +
      'C_T >> 1, B >= 2. Chourasiya-Simonic 2025 (sharpest explicit at sigma = 3/4): C_T = 8.185, B = 2.6 ' +
      '-> E_trunc_pt = 3.34, ~1.1e5x LARGER than the 3.06e-5 idealization and still 16.7x short of 0.2. ' +
      'Kadiri-Lumley-Ng 2021 at sigma = 0.9 passes but breaks the de Bruijn cap (0.32 > 0.2); Ramare 2016 ' +
      'at sigma = 3/4 gives 1.67e5.',
    conclusion:
      '3.06e-5 is an OPTIMISTIC C_T = 1 idealization, not a conservative literature value a tighter line ' +
      'could shave; a literature-anchored replacement makes the number WORSE, not better.',
    eTruncExplicitCS: E_TRUNC_EXPLICIT_CS, // 3.34
  },
  genuinelyPinnedBecauseMoot: {
    mispricingIsConstantIndependent:
      'The entire count integral is unsound as a realness certificate: the 2/gamma kernel misprices a single ' +
      'admissible deep zero (beta = 3/4, gamma = 6e12) by ~3.75e11x, and the mispricing ratio is INDEPENDENT ' +
      'of C_T, kappa_T, B. Any refinement moves a mispriced count ARTIFACT, never the operative residual.',
    operativeResidualIsBarrier:
      'The operative residual is the deterministic barrier lemma S_barrier (off-line contribution above T_PT ' +
      'is EXACTLY zero under S_barrier; imp-35419). Neither a tighter kappa_T nor a tighter C_T is a Lambda ' +
      'lever: both leave Platt-Trudgian Lambda <= 0.2 unchanged.',
    verdict:
      '3.06e-5 is genuinely PINNED in the only frontier-relevant sense -- a vestigial artifact no literature ' +
      'refinement can promote to a bound-moving quantity; the ONLY discharge is the imp-35419 barrier port ' +
      '(rigor-parity with PT, not a beat).',
    mispricingRatio: MISPRICING_RATIO, // 3.75e11
    L_pt_unchanged: L_PT, // 0.2
  },
  isRigorous: false,
  verdict:
    'ASSESSMENT / SCOPING (frontier-direction, NOT rigorous). (Part A) E_trunc_pt ~ (2 C_T/kappa_T) ' +
    '(log T_PT)^B T_PT^{-kappa_T}: kappa_T is the EXPONENTIAL lever (d log E/d kappa_T = -31.23 at 0.4), ' +
    'C_T linear, B mild; the recorded 3.06e-5 (clean) / 5.106e-5 (corrected) is the C_T = 1, B = 0 ' +
    'idealization at prefactor 3 / 5. (Part B) kappa_T is LOCKED at 2/5 by the sigma = 3/4 strip, which is ' +
    'floor-capped at 0.8162 by the de Bruijn budget -- NOT literature-improvable for free. (Part C) A ' +
    'literature-anchored value moves C_T/B, and the honest explicit direction makes E LARGER (3.34 at the ' +
    'sharpest explicit constant, ~1.1e5x above the idealization, still 16.7x short of 0.2) -- so 3.06e-5 is ' +
    'an OPTIMISTIC C_T = 1 idealization, not a shaveable conservative value. (Part D) The whole count ' +
    'integral is a mispriced artifact (3.75e11x, C_T/kappa_T-INDEPENDENT) whose true residual is the ' +
    'barrier lemma, so NO C_T/kappa_T refinement is a Lambda lever and 3.06e-5 is genuinely PINNED; the ' +
    'only discharge is the imp-35419 barrier port (parity, not beat). Changes NOTHING about 3.06e-5; ' +
    'tightens no bound; establishes no operator positivity; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-34791 (kappa_T = 2/5 lock R1; prefactor 3 -> 5 R2; the R4 explicit-literature mapping; the 3.75e11 ' +
    'mispricing Part 3); imp-35419 (the barrier-lemma porting companion, parity-not-beat); imp-35334 ' +
    '(E_trunc dominates the far-tail bridge); imp-3933 (gap law, isolated-pair realness time); imp-2631 ' +
    '(the recorded fixed-strip value); imp-397 (2/gamma kernel); imp-2643 (committed N*=1e4 ledger); ' +
    'Chourasiya-Simonic 2025; Kadiri-Lumley-Ng 2021; Ramare 2016; Platt-Trudgian 2021.',
};

export const IMP35459_ETRUNC_CT_KAPPAT_DEPENDENCE_SCOPE_ASSERTIONS = [
  {
    // Part A: the recorded value reproduces from the C_T = 1, B = 0 closed form; kappa_T is the exponential lever.
    id: 'imp35459-functional-form-reproduces-recorded',
    description: 'E_trunc_pt ~ (2 C_T/kappa_T)(log T_PT)^B T_PT^{-kappa_T} reproduces 3.06e-5 (clean) and 5.106e-5 (corrected) at C_T=1, B=0',
    holds: () =>
      Math.abs(KAPPA_T - 0.4) < 1e-15 &&
      Math.abs(PREF_CLEAN - 3.0) < 1e-12 &&
      Math.abs(PREF_CORR - 5.0) < 1e-12 &&
      Math.abs(E_TRUNC_CLEAN - 3.06e-5) / 3.06e-5 < 5e-3 && // reproduces the recorded clean count
      Math.abs(E_TRUNC_CORR - 5.106e-5) / 5.106e-5 < 5e-3 && // reproduces the parts-corrected count
      Math.abs(DLOGE_DKAPPA) > Math.log(T_PT), // kappa_T is an EXPONENTIAL (> log T_PT) lever, not linear
  },
  {
    // Parts B+C: kappa_T is locked (sigma floor-capped) and the C_T/B literature direction runs the WRONG way.
    id: 'imp35459-kappat-locked-ct-direction-wrong',
    description: 'kappa_T locked at 2/5 by the sigma floor-cap 0.8162; honest explicit C_T makes E LARGER (3.34 >> 3.06e-5)',
    holds: () =>
      SIGMA_FIXED < SIGMA_DEBRUIJN_CAP && // sigma = 3/4 sits below the de Bruijn floor-cap; kappa_T cannot be lifted for free
      SIGMA_DEBRUIJN_CAP < 1.0 &&
      CS_C > 1 && CS_B >= 2 && // every explicit constant has C_T >> 1, B >= 2
      E_TRUNC_EXPLICIT_CS > E_TRUNC_CLEAN * 1e4 && // the honest explicit value is orders LARGER, not smaller
      E_TRUNC_EXPLICIT_CS > L_PT, // and still exceeds 0.2 (16.7x short) -- 3.06e-5 is an optimistic idealization
  },
  {
    // Part D honesty gate: the mispricing is C_T/kappa_T-independent, so 3.06e-5 is genuinely pinned; no QED.
    id: 'imp35459-pinned-because-moot-no-qed',
    description: 'Count integral mispriced 3.75e11x (C_T/kappa_T-independent); 3.06e-5 genuinely pinned, PT 0.2 unchanged, NO QED',
    holds: () =>
      MISPRICING_RATIO > 1e11 && // the mispricing that voids the count value as a lever
      Math.abs(L_PT - 0.2) < 1e-15 && // Platt-Trudgian SOTA unchanged by any C_T/kappa_T refinement
      IMP35459_ETRUNC_CT_KAPPAT_DEPENDENCE_SCOPE.isRigorous === false &&
      /genuinely PINNED/.test(IMP35459_ETRUNC_CT_KAPPAT_DEPENDENCE_SCOPE.verdict) &&
      /NO C_T\/kappa_T refinement is a Lambda lever/.test(IMP35459_ETRUNC_CT_KAPPAT_DEPENDENCE_SCOPE.verdict) &&
      /NO QED/.test(IMP35459_ETRUNC_CT_KAPPAT_DEPENDENCE_SCOPE.verdict) &&
      /refereed bound is changed/i.test(IMP35459_ETRUNC_CT_KAPPAT_DEPENDENCE_SCOPE.verdict),
  },
];

for (const a of IMP35459_ETRUNC_CT_KAPPAT_DEPENDENCE_SCOPE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35459-etrunc-ct-kappat-dependence-scope assertion failed: ${a.id}`);
  }
}
