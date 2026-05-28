// @module imp-1233-conjectures-18-1-18-2-audit
// imp-1233: Literature audit for v52 paper Conjectures 18.1 (kernel /
//           passivity closure) and 18.2 (prime-delay domination closure).
//
// PAPER
// -----
// research-inputs/twin_ladder_consolidated_v52.pdf
//   Section 18.1 (page 38): Conjecture 18.1 -- kernel/passivity closure.
//   Section 18.2 (page 39): Conjecture 18.2 -- prime-delay domination
//                           closure (completed analytic-continuation sense).
//
// COMPANIONS
// ----------
// imp-1210: Conjectures 22.1-22.4 audit. 22.3 (bridge-norm realization)
//           is the bridge-side cousin of 18.1; PARTIALLY-RELATED via
//           Weil 1952 / de Branges 1968 / Lagarias 2007.
// imp-1202: Conjecture 15.4 audit. 15.4 is the EULER-HALF-PLANE
//           (sigma > 1/2) version of the 18.2 inequality; SUBSUMED-BY-RH
//           via the paired Hadamard expansion in the Euler-convergent
//           half-plane.
// imp-1232: Conjectures 17.3 + 18.4 (ghost-absence theorem) -- both
//           SUBSUMED-BY-RH. The same paper paragraph (18.4) explicitly
//           classifies 18.1-18.3 as the GENUINELY OPEN routes, not RH
//           restatements.
// imp-1184: Direct-Selberg ESY-closure route audit -- all three live
//           ESY-closure routes share Montgomery PCC at 2-point as the
//           same obstruction, so 18.1 / 18.2 are expected to be
//           PARTIALLY-RELATED to existing analytic-NT literature rather
//           than SUBSUMED-BY-RH.
//
// VERDICT SUMMARY
// ---------------
// Both conjectures are PARTIALLY-RELATED to existing literature.
//
//   18.1: PARTIALLY-RELATED to KYP / passive realization theory
//         (Yakubovich 1962, Kalman 1963, Anderson-Vongpanitlerd 1973)
//         and de Branges canonical-system theory (Krein 1955,
//         de Branges 1968). KYP-style realization of a given Schur /
//         bounded-real transfer function is classical; the OPEN content
//         is the NON-CIRCULAR construction of the realization directly
//         from Phi (the centered completed kernel) WITHOUT using
//         zero-freeness of X as an input. The paper itself notes "this
//         conjecture would prove RH"; therefore 18.1 implies RH and
//         cannot be classified SUBSUMED-BY-RH (a SUBSUMED conjecture is
//         a known restatement of RH, not a tool that PROVES it).
//
//   18.2: PARTIALLY-RELATED to PNT-with-error-term mean-value theorems
//         (Bombieri 1965, Vinogradov-Korobov 1958, Iwaniec-Kowalski 2004,
//         Selberg sieve large-sieve framework) and to Weil-explicit-
//         formula positivity programs (Weil 1952, Bombieri 2003, Connes
//         1999). The paper itself states "a literal Euler-series proof
//         cannot work in the critical half-strip"; the open content is
//         the COMPLETED ANALYTIC CONTINUATION of the prime-delay echo
//         train via the Weil explicit formula or kernel-side proxy. In
//         the Euler-convergent half-plane (sigma > 1/2), the structurally
//         identical 15.4 inequality is SUBSUMED-BY-RH (imp-1202: paired
//         Hadamard); BUT 18.2 demands the inequality in the full critical
//         half-strip Re(w) > 0 (i.e. sigma > 1/2 - a for arbitrarily small
//         a > 0), where Euler diverges and the Hadamard expansion no
//         longer gives a manifest positivity proof.
//
// HONEST SCOPE
// ------------
// No external browsing. Verdicts use training-time knowledge plus
// the v52 paper itself and the established five-element vocabulary.
//
// SYNTAX NOTE: No apostrophes inside single-quoted JS strings.

// -- Per-conjecture audit entries ------------------------------------------

export const CONJ_18_1_AUDIT = Object.freeze({
  id: '18.1',
  label: 'Conjecture 18.1',
  shortName: 'Kernel/passivity closure',
  paperSection: 'para 18.1',
  paperPage: 38,
  auditTicket: 'imp-1233',
  auditDate: '2026-05-28',
  verdict: 'PARTIALLY-RELATED',

  paraphrased_statement:
    'For every shift a > 0, the pair (A_a, B_a) -- the even cosine and odd ' +
    'sine Fourier channels of the centered completed kernel Phi -- arises ' +
    'from a positive Hamiltonian canonical system whose Weyl transfer ' +
    'function is Theta_a(z) = E_a^#(z) / E_a(z). Equivalently, the Wronskian ' +
    'kernel K_a is the energy kernel of a passive system constructed ' +
    'directly from the completed Riemann kernel Phi without zero-freeness ' +
    'as an input.',

  // Why this is NOT SUBSUMED-BY-RH:
  //   The paper itself notes "this conjecture would prove RH" (page 38,
  //   immediately after Conjecture 18.1). A statement that IMPLIES RH and
  //   is not known to follow from RH alone is by definition NOT a
  //   restatement of RH. (Contrast 17.3 / 18.4, which the paper labels
  //   "equivalently RH holds".)

  related_work: Object.freeze([
    {
      ref: 'Yakubovich (1962), Kalman (1963), Popov (1962) -- KYP lemma',
      overlap:
        'The KYP (Kalman-Yakubovich-Popov) lemma gives the necessary and ' +
        'sufficient algebraic condition for a finite-dimensional linear ' +
        'system to be passive / bounded-real / positive-real. For a given ' +
        'Schur / bounded-real transfer function T(z) on the right half-plane, ' +
        'a passive realization (A, B, C, D) ALWAYS EXISTS (standard result). ' +
        'The DIFFICULTY in 18.1 is not the existence of SOME realization, but ' +
        'the existence of a realization whose state-space data are CONSTRUCTED ' +
        'DIRECTLY from Phi (the completed Riemann kernel) without circular ' +
        'use of zero-freeness of X. KYP gives the existence half; the ' +
        'non-circular construction is the OPEN content.',
    },
    {
      ref: 'Anderson-Vongpanitlerd (1973), Network Analysis and Synthesis',
      overlap:
        'Standard reference for passive / bounded-real realization theory ' +
        'in the infinite-dimensional setting via Darlington / Belevitch ' +
        'synthesis. The transfer function Theta_a(z) = E_a^# / E_a is exactly ' +
        'the inner-outer type quotient that classical Darlington synthesis ' +
        'handles. PARTIALLY-RELATED because the classical theory presupposes ' +
        'that Theta_a is Schur in the upper / lower half-plane -- which is ' +
        'precisely what 18.1 must prove non-circularly.',
    },
    {
      ref: 'Krein (1955), Theory of canonical systems',
      overlap:
        'Canonical systems with positive Hamiltonian H(t) >= 0 are exactly the ' +
        'objects whose Weyl transfer function is a Schur / Herglotz / Nevanlinna ' +
        'class function. The de Branges-Krein dictionary makes 18.1 equivalent ' +
        'to: there exists a positive H_a(t) with the right Weyl function. The ' +
        'EXISTENCE of such an H_a for the bridge E_a is the de Branges program. ' +
        'PARTIALLY-RELATED: the technology is precisely the right machine, but ' +
        'the constructive identification of H_a from Phi alone is the gap.',
    },
    {
      ref: 'de Branges (1968), Hilbert Spaces of Entire Functions',
      overlap:
        'De Branges established that K_a(w, z) is the reproducing kernel of a ' +
        'Hilbert space H(E_a) iff E_a is Hermite-Biehler. The bridge ratio ' +
        'Theta_a = E_a^# / E_a is automatically inner in the upper half-plane ' +
        'when E_a is Hermite-Biehler. The Hermite-Biehler hypothesis is what ' +
        '18.1 is trying to construct rather than assume. PARTIALLY-RELATED to ' +
        '22.3 (bridge-norm realization, audited PARTIALLY-RELATED via imp-1210).',
    },
    {
      ref: 'Lagarias (2007), Hilbert spaces of entire functions and the ' +
        'Riemann zeta function',
      overlap:
        'Lagarias surveys the open problem: find a de Branges Hilbert-space-of-' +
        'entire-functions realization of the Weil quadratic form built ' +
        'from xi WITHOUT circular use of RH. Conjecture 18.1 is a specific ' +
        'twin-ladder-shaped instance of that survey-level open problem. The ' +
        'paper Sections 17-18 contribute the explicit channel pair (A_a, B_a) ' +
        'and the Wronskian-kernel symplectic obstruction (off-diagonal ' +
        'cosh(au) sinh(av) terms in the u, v double integral) -- which is new.',
    },
    {
      ref: 'Connes (1999, 2025-2026), trace formula and RH',
      overlap:
        'The Connes noncommutative-geometric attack realizes RH as positivity ' +
        'of a trace on a specific noncommutative space (adele class space). ' +
        'PARTIALLY-RELATED because Connes positivity and 18.1 passive ' +
        'realization both aim at the same target by different functional ' +
        'analytic routes. Neither is known to imply the other; both face the ' +
        'circularity barrier (Montgomery PCC at 2-point per imp-1184).',
    },
  ]),

  overlap: 'PARTIALLY-RELATED',

  rationale:
    'Conjecture 18.1 sits squarely on top of two mature bodies of work -- ' +
    'KYP / Darlington passive realization (control theory) and ' +
    'de Branges-Krein canonical systems (operator theory) -- but neither ' +
    'literature delivers the SPECIFIC non-circular construction of the ' +
    'realization from Phi alone that 18.1 requires. The Wronskian-kernel ' +
    'symplectic obstruction (off-diagonal u != v terms in the double Phi(u) ' +
    'Phi(v) integral) identified in para 18.1 is the new content. Because ' +
    'the paper itself states 18.1 IMPLIES RH (page 38), and because the ' +
    'realization is not known to follow from RH alone, 18.1 cannot be ' +
    'SUBSUMED-BY-RH or SUBSUMED-BY-LITERATURE. The verdict ' +
    'PARTIALLY-RELATED reflects that the LITERATURE supplies the machinery ' +
    'but not the specific non-circular instance.',

  recommendation_for_paper:
    'KEEP Conjecture 18.1 as a research target, but reframe explicitly as ' +
    'a CONTRIBUTION TO the existing de Branges-Krein / KYP program for ' +
    'realizing Theta_a = E_a^# / E_a as the Weyl function of a positive ' +
    'Hamiltonian canonical system, rather than as a free-standing ' +
    'conjecture. Cite Yakubovich (1962), Kalman (1963), ' +
    'Anderson-Vongpanitlerd (1973) for KYP / passive realization; Krein ' +
    '(1955), de Branges (1968) for canonical systems; Lagarias (2007) for ' +
    'the surveyed open de Branges-space-of-entire-functions Weil-form ' +
    'realization problem. Acknowledge the structural overlap with ' +
    'Conjectures 16.6 (canonical-system closure) and 22.3 (bridge-norm ' +
    'realization, PARTIALLY-RELATED via imp-1210). The genuinely NEW ' +
    'content is the explicit Wronskian-symplectic-pairing form ' +
    'K_a(w,z) = [<C_a(z), S_a(w)> - <S_a(z), C_a(w)>] / [pi(wbar - z)] ' +
    'and the diagnosis that the obstruction is the off-diagonal ' +
    'commutator between the even cosh-cos channel and the odd sinh-sin ' +
    'channel.',
});

export const CONJ_18_2_AUDIT = Object.freeze({
  id: '18.2',
  label: 'Conjecture 18.2',
  shortName: 'Prime-delay domination closure',
  paperSection: 'para 18.2',
  paperPage: 39,
  auditTicket: 'imp-1233',
  auditDate: '2026-05-28',
  verdict: 'PARTIALLY-RELATED',

  paraphrased_statement:
    'For every w with Re(w) > 0, the completed archimedean drift dominates ' +
    'the coherent prime-delay echo train in the analytically continued ' +
    'sense dictated by the Weil explicit formula: Re G_infty(w) > ' +
    'Re sum_p sum_{m >= 1} (log p) exp(-(1/2 + w) m log p), ' +
    'where G_infty(w) = 1/s + 1/(s-1) - (1/2) log pi + (1/2) psi(s/2) and ' +
    's = 1/2 + w. Equivalently, Re(X^prime / X)(w) > 0 for every w with ' +
    'Re(w) > 0.',

  // Relation to 15.4:
  //   Conjecture 15.4 (imp-1202) is the EULER-CONVERGENT case sigma > 1/2.
  //   For sigma > 1/2 the Euler series converges absolutely and a paired
  //   Hadamard expansion makes Re(xi^prime / xi)(sigma + it) > 0 manifest
  //   under RH (imp-1202 verdict SUBSUMED-BY-RH).
  //
  //   Conjecture 18.2 demands the SAME inequality on the full critical
  //   half-strip Re(w) > 0 (i.e. sigma > 1/2 - a for arbitrarily small
  //   a > 0), where Euler DIVERGES. The paper itself notes "a literal
  //   Euler-series proof cannot work in the critical half-strip" and
  //   stipulates the completed analytic continuation via the explicit
  //   formula. This is structurally STRONGER than 15.4 and is NOT
  //   manifestly RH-equivalent: the Hadamard expansion of xi^prime / xi
  //   on the critical half-strip mixes BOTH zero contributions AND prime
  //   contributions in a way that is not term-by-term positive even under
  //   RH.

  related_work: Object.freeze([
    {
      ref: 'Weil (1952), Sur les "formules explicites" de la theorie des ' +
        'nombres premiers',
      overlap:
        'Weil established the explicit-formula bridge between zeros and ' +
        'primes and its associated quadratic form. The "completed analytic ' +
        'continuation" of the prime-delay echo train in para 18.2 is ' +
        'EXACTLY the Weil-explicit-formula reformulation. Weil-form ' +
        'positivity is equivalent to RH (Bombieri 2003 survey). 18.2 is ' +
        'an INFINITESIMAL / LOG-DERIVATIVE variant of Weil-form positivity.',
    },
    {
      ref: 'Bombieri (1965), On the large sieve; Bombieri (1974), Le grand ' +
        'crible dans la theorie analytique des nombres',
      overlap:
        'Bombieri large-sieve mean-value theorems give average bounds on ' +
        'prime sums that are TIGHTER than the trivial PNT-with-error-term. ' +
        'PARTIALLY-RELATED: 18.2 demands a POINTWISE inequality at every ' +
        'w with Re(w) > 0, not a mean-value bound. Bombieri-type tools ' +
        'show prime sums concentrate at the expected mean, but do not ' +
        'directly produce term-by-term archimedean domination.',
    },
    {
      ref: 'Vinogradov (1958), Korobov (1958) -- zero-free region and ' +
        'log-derivative bounds',
      overlap:
        'The Vinogradov-Korobov zero-free region gives quantitative bounds ' +
        'on -zeta^prime / zeta(s) near s = 1 (effectively in the Euler ' +
        'half-plane up to a logarithmic / log-log boundary). PARTIALLY-' +
        'RELATED: these bounds make Re(-zeta^prime / zeta) > 0 in part of ' +
        'the critical strip CLOSE TO sigma = 1, but the Vinogradov-Korobov ' +
        'region does NOT reach all of sigma > 1/2 (the critical half-strip ' +
        'remains open). 18.2 demands the inequality on the full critical ' +
        'half-strip Re(w) > 0, which Vinogradov-Korobov does not deliver.',
    },
    {
      ref: 'Iwaniec-Kowalski (2004), Analytic Number Theory, Ch. 5 + 17',
      overlap:
        'Standard reference for PNT-with-error-term and explicit-formula ' +
        'manipulations of -zeta^prime / zeta in the critical strip. ' +
        'PARTIALLY-RELATED: the explicit-formula manipulations are exactly ' +
        'the tools available to prove 18.2 if it is provable; the book ' +
        'does NOT contain a pointwise Re(-zeta^prime / zeta) > 0 statement ' +
        'on the critical half-strip (such a statement would be a major ' +
        'result and is exactly the content of 18.2).',
    },
    {
      ref: 'Selberg (1942) -- large-sieve framework; Selberg trace formula',
      overlap:
        'PARTIALLY-RELATED via the trace-formula route to RH-equivalent ' +
        'positivity statements. Selberg-style sieve bounds do not directly ' +
        'produce the pointwise prime-delay domination 18.2 demands.',
    },
    {
      ref: 'imp-1202 (Conjecture 15.4 audit) -- paired Hadamard, sigma > 1/2',
      overlap:
        'Conjecture 15.4 is the structurally identical inequality in the ' +
        'EULER-convergent half-plane sigma > 1/2. imp-1202 verdict: ' +
        'SUBSUMED-BY-RH (paired Hadamard makes Re(xi^prime / xi) > 0 ' +
        'manifest term-by-term under RH for sigma > 1/2). The STRONGER ' +
        '18.2 statement at sigma > 1/2 - a for arbitrarily small a > 0 ' +
        'is NOT manifest from the same paired Hadamard, because the ' +
        'zero-side and prime-side terms no longer separate cleanly in the ' +
        'critical half-strip. 18.2 demands the COMPLETED-ANALYTIC-' +
        'CONTINUATION reading via Weil, which is genuinely stronger.',
    },
    {
      ref: 'imp-1184 -- ESY-closure direct-Selberg route audit',
      overlap:
        'imp-1184 identifies that all three live ESY-closure routes share ' +
        'Montgomery PCC at 2-point as the same obstruction. The 18.2 ' +
        'closure route inherits this obstruction: the completed analytic ' +
        'continuation of the prime-delay echo train into the critical ' +
        'half-strip is what Montgomery PCC at 2-point would need to ' +
        'control. PARTIALLY-RELATED via that shared obstruction.',
    },
  ]),

  overlap: 'PARTIALLY-RELATED',

  rationale:
    'Conjecture 18.2 is the COMPLETED-ANALYTIC-CONTINUATION strengthening ' +
    'of Conjecture 15.4 from the Euler-convergent half-plane sigma > 1/2 ' +
    'down to the critical half-strip Re(w) > 0. 15.4 is SUBSUMED-BY-RH ' +
    '(imp-1202: paired Hadamard); 18.2 is NOT, because in the critical ' +
    'half-strip the Hadamard expansion no longer cleanly separates zero ' +
    'and prime contributions. The paper itself acknowledges this: ' +
    '"a literal Euler-series proof cannot work in the critical half-strip" ' +
    '(para 18.2). The off-critical-zero witness Q_{delta, gamma}(w) = ' +
    '(w - i gamma)^2 - delta^2 manufactures its OWN local violation at ' +
    'y = gamma, 0 < x < delta -- so 18.2 is sharply equivalent to ' +
    'zero-freeness off the critical line. PARTIALLY-RELATED because ' +
    'Bombieri-Iwaniec mean-value bounds, Vinogradov-Korobov log-derivative ' +
    'bounds, Selberg sieve large-sieve bounds, and Weil explicit-formula ' +
    'positivity each cover ADJACENT statements but none delivers the ' +
    'pointwise domination on the critical half-strip directly.',

  recommendation_for_paper:
    'KEEP Conjecture 18.2 as a research target. Reframe explicitly as the ' +
    'CRITICAL-HALF-STRIP STRENGTHENING of Conjecture 15.4 (audited ' +
    'SUBSUMED-BY-RH via imp-1202) via the Weil-explicit-formula analytic ' +
    'continuation. Cite Weil (1952), Bombieri (1965, 1974), Iwaniec-Kowalski ' +
    '(2004 ch 5, 17), Selberg (1942), Vinogradov-Korobov (1958). Cross-' +
    'reference imp-1184 to make the Montgomery PCC at 2-point obstruction ' +
    'explicit. Acknowledge that 18.2 implies RH (the off-critical-zero ' +
    'witness Q_{delta, gamma} manufactures a local violation), so 18.2 is ' +
    'NOT a mere RH restatement -- it would PROVE RH. The genuinely NEW ' +
    'content is the twin-ladder-native reformulation of pointwise ' +
    'prime-delay domination as Re(X^prime / X)(w) > 0 on the full ' +
    'critical half-strip via the COMPLETED kernel (not the divergent ' +
    'Euler series). The follow-up quantitative-form sub-ticket of imp-1202 ' +
    'is the natural home for the precise critical-half-strip constant.',
});

// -- Audit summary ---------------------------------------------------------

export const IMP_1233_AUDIT_SUMMARY = Object.freeze({
  id: 'imp-1233-conjectures-18-1-18-2-audit',
  ticket: 'imp-1233',
  auditDate: '2026-05-28',
  paper: 'twin_ladder_consolidated_v52.pdf',
  paperSections: Object.freeze(['para 18.1', 'para 18.2']),

  verdicts: Object.freeze({
    '18.1': 'PARTIALLY-RELATED',
    '18.2': 'PARTIALLY-RELATED',
  }),

  sharedRationale:
    'Both conjectures sit on top of mature literature -- 18.1 on KYP / ' +
    'Darlington passive realization + de Branges-Krein canonical systems; ' +
    '18.2 on Bombieri-Iwaniec mean-value theorems + Vinogradov-Korobov ' +
    'log-derivative bounds + Weil-explicit-formula positivity. Neither ' +
    'literature delivers the specific non-circular closure the paper ' +
    'demands. Both IMPLY RH (the paper para 18.1 says "this conjecture ' +
    'would prove RH"; the 18.2 off-critical-zero witness Q_{delta,gamma} ' +
    'is local), so neither is SUBSUMED-BY-RH (subsumed = restatement, not ' +
    'a tool that proves it). Per imp-1184, the shared obstruction is ' +
    'Montgomery PCC at 2-point.',

  contrastWithSubsumedConjectures:
    'Conjectures 17.3 and 18.4 (imp-1232) are SUBSUMED-BY-RH because the ' +
    'paper itself labels them "equivalently RH holds" -- they are ' +
    'restatements. Conjectures 18.1 and 18.2 are NOT restatements -- they ' +
    'are CLOSURE PROGRAMS that would PROVE RH. The paper para 18.4 ' +
    'synthesis table makes this distinction explicit: 18.1-18.3 are the ' +
    'three independent attack routes; 18.4 is the synthesis statement ' +
    '(ghost-absence) which is itself RH.',

  crossReferences: Object.freeze([
    'imp-1202: Conjecture 15.4 audit (SUBSUMED-BY-RH; Euler-half-plane sigma > 1/2)',
    'imp-1210: Conjectures 22.1-22.4 audit (22.3 PARTIALLY-RELATED; bridge-norm realization)',
    'imp-1232: Conjectures 17.3 + 18.4 audit (both SUBSUMED-BY-RH; ghost-absence)',
    'imp-1184: ESY-closure routes audit (Montgomery PCC at 2-point shared obstruction)',
    'imp-1218: paper-audit-dashboard (single source of truth for verdicts)',
  ]),
});

// -- Build-time tripwires --------------------------------------------------

export const IMP_1233_ASSERTIONS = [
  {
    id: 'imp1233-18-1-verdict-is-partially-related',
    why:
      'The audit concludes 18.1 is PARTIALLY-RELATED to KYP / de Branges-Krein ' +
      'literature. The paper itself states 18.1 implies RH, so 18.1 cannot be ' +
      'SUBSUMED-BY-RH (subsumed = restatement, not a tool that proves it). The ' +
      'verdict field must be PARTIALLY-RELATED.',
    holds: () => CONJ_18_1_AUDIT.verdict === 'PARTIALLY-RELATED',
  },
  {
    id: 'imp1233-18-2-verdict-is-partially-related',
    why:
      'The audit concludes 18.2 is PARTIALLY-RELATED to Bombieri-Iwaniec / ' +
      'Vinogradov-Korobov / Weil-positivity literature. 18.2 is the critical-' +
      'half-strip strengthening of 15.4 (SUBSUMED-BY-RH) and is genuinely ' +
      'stronger because Euler diverges in the critical strip. The verdict ' +
      'field must be PARTIALLY-RELATED.',
    holds: () => CONJ_18_2_AUDIT.verdict === 'PARTIALLY-RELATED',
  },
  {
    id: 'imp1233-overlap-field-matches-verdict',
    why:
      'The overlap field uses the same five-element vocabulary as verdict; ' +
      'they must agree per the imp-1210 format. Drift would silently break ' +
      'downstream filtering.',
    holds: () =>
      CONJ_18_1_AUDIT.overlap === CONJ_18_1_AUDIT.verdict &&
      CONJ_18_2_AUDIT.overlap === CONJ_18_2_AUDIT.verdict,
  },
  {
    id: 'imp1233-18-1-cites-kyp-or-yakubovich',
    why:
      'KYP / Yakubovich / Kalman is the load-bearing reference making the 18.1 ' +
      'realization a PARTIALLY-RELATED rather than INDEPENDENT-NOVEL claim. ' +
      'At least one related_work entry must mention KYP, Yakubovich, or Kalman.',
    holds: () =>
      CONJ_18_1_AUDIT.related_work.some((r) =>
        /KYP|Yakubovich|Kalman/i.test(r.ref + ' ' + r.overlap),
      ),
  },
  {
    id: 'imp1233-18-1-cites-de-branges-or-krein',
    why:
      'de Branges-Krein canonical-system theory is the second load-bearing ' +
      'literature pillar for 18.1. At least one related_work entry must ' +
      'mention de Branges or Krein.',
    holds: () =>
      CONJ_18_1_AUDIT.related_work.some((r) =>
        /de Branges|Krein/i.test(r.ref + ' ' + r.overlap),
      ),
  },
  {
    id: 'imp1233-18-2-cites-bombieri-iwaniec-or-vinogradov',
    why:
      'Bombieri / Iwaniec / Vinogradov-Korobov are the load-bearing analytic-NT ' +
      'references making the 18.2 verdict PARTIALLY-RELATED. At least one ' +
      'related_work entry must mention one of them.',
    holds: () =>
      CONJ_18_2_AUDIT.related_work.some((r) =>
        /Bombieri|Iwaniec|Vinogradov/i.test(r.ref + ' ' + r.overlap),
      ),
  },
  {
    id: 'imp1233-18-2-cross-links-to-imp-1202',
    why:
      'Conjecture 15.4 (imp-1202) is the Euler-half-plane version of 18.2 and ' +
      'is SUBSUMED-BY-RH. The 18.2 audit must explicitly cross-link to imp-1202 ' +
      'so the reader understands why the critical-half-strip version is ' +
      'genuinely stronger.',
    holds: () =>
      CONJ_18_2_AUDIT.related_work.some((r) =>
        /imp-1202|15\.4/i.test(r.ref + ' ' + r.overlap),
      ) || CONJ_18_2_AUDIT.rationale.includes('15.4'),
  },
  {
    id: 'imp1233-paper-section-references-correct',
    why:
      'The audit must pin the correct paper sections (18.1 for 18.1, 18.2 ' +
      'for 18.2). Wrong section numbers would disconnect the audit from the ' +
      'source document.',
    holds: () =>
      CONJ_18_1_AUDIT.paperSection === 'para 18.1' &&
      CONJ_18_2_AUDIT.paperSection === 'para 18.2',
  },
  {
    id: 'imp1233-audit-ticket-is-imp-1233',
    why:
      'Both audit entries must point at the correct audit ticket imp-1233. ' +
      'Wrong ticket would break the completedAuditTickets cross-reference in ' +
      'paper-audit-dashboard.js.',
    holds: () =>
      CONJ_18_1_AUDIT.auditTicket === 'imp-1233' &&
      CONJ_18_2_AUDIT.auditTicket === 'imp-1233',
  },
  {
    id: 'imp1233-recommendations-cite-related-literature',
    why:
      'The recommendation_for_paper for each conjecture must explicitly name ' +
      'a related-literature citation so the paper author has concrete prior ' +
      'work to engage with.',
    holds: () =>
      /Yakubovich|Kalman|de Branges|Krein|Lagarias/.test(
        CONJ_18_1_AUDIT.recommendation_for_paper,
      ) &&
      /Weil|Bombieri|Iwaniec|Selberg|Vinogradov/.test(
        CONJ_18_2_AUDIT.recommendation_for_paper,
      ),
  },
  {
    id: 'imp1233-paraphrased-statement-nonempty',
    why:
      'Each conjecture record must carry a non-empty paraphrased_statement ' +
      'field of at least 200 characters so the audit is self-contained ' +
      'without needing to re-open the PDF.',
    holds: () =>
      typeof CONJ_18_1_AUDIT.paraphrased_statement === 'string' &&
      CONJ_18_1_AUDIT.paraphrased_statement.length >= 200 &&
      typeof CONJ_18_2_AUDIT.paraphrased_statement === 'string' &&
      CONJ_18_2_AUDIT.paraphrased_statement.length >= 200,
  },
  {
    id: 'imp1233-summary-records-both-verdicts',
    why:
      'The IMP_1233_AUDIT_SUMMARY.verdicts dictionary must record both ' +
      '18.1 and 18.2 as PARTIALLY-RELATED. Drift between summary and ' +
      'per-conjecture entries would silently produce a misleading dashboard.',
    holds: () =>
      IMP_1233_AUDIT_SUMMARY.verdicts['18.1'] === 'PARTIALLY-RELATED' &&
      IMP_1233_AUDIT_SUMMARY.verdicts['18.2'] === 'PARTIALLY-RELATED',
  },
];
