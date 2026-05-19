/**
 * @module data/sota-asymptotic-alternatives-2026-05
 * @fileoverview imp-1107 SOTA attack #2 -- SCOPING survey of three alternative
 *   asymptotic routes for tightening the Platt-Trudgian (2021) Lambda <= 0.2
 *   bound BEYOND the ESY rigidity port (imp-370 / imp-1106). Produces a
 *   single ROUTES_COMPARISON table at the top plus three named route records
 *   (Goldston-Yildirim sieve, Soundararajan-Bui density near sigma=1,
 *   Conrey-Snaith random matrix moments) with main results, citation chain,
 *   how the result feeds the Lambda upper bound, honest numeric estimate of
 *   the achievable tightening, tractability ranking, knownObstructions, and
 *   relatedTickets cross-references into the existing improvement queue.
 *
 *   PURE SURVEY. Does not attempt closure of any route. The deliverable is a
 *   scoping document: which of {ESY small wedge, Goldston-Yildirim, S-B
 *   density, Conrey-Snaith} should the engine commit attack-budget to next.
 *
 *   Five named build-time tripwires:
 *     - imp1107-three-routes-present
 *     - imp1107-each-route-has-named-citation
 *     - imp1107-each-route-has-tractability-ranking
 *     - imp1107-estimated-improvements-are-numeric
 *     - imp1107-comparison-table-present
 *
 *   Two extra discipline tripwires:
 *     - imp1107-comparison-table-matches-routes
 *     - imp1107-recommended-next-step-named
 *
 * Reading order
 * -------------
 *   1. ROUTES_COMPARISON  -- the 3-row table the engine consumes first.
 *   2. ROUTE_GOLDSTON_YILDIRIM  -- almost-prime k-tuples for zero gaps.
 *   3. ROUTE_SOUNDARARAJAN_BUI_DENSITY  -- N(sigma, T) near sigma=1.
 *   4. ROUTE_CONREY_SNAITH_MOMENTS  -- 2k-th moments of |zeta(1/2 + it)|.
 *   5. SOTA_ASYMPTOTIC_ALTERNATIVES  -- the frozen capstone record.
 *
 * Notation
 * --------
 *   - PT_BOUND = 0.2 (Platt-Trudgian 2021, Bull. Lond. Math. Soc. 53, 792-797)
 *   - T_PT     = 3e12 (Platt-Trudgian verified zero-free strip height)
 *   - E_trunc  = the Polymath15-bridge truncation term in the imp-447 / imp-459
 *                chain L_pt = L_cond + E_trunc; currently E_trunc_pt ~ 3.1e-5.
 *   - rho_min  = the minimum-eigenvalue floor in the imp-469 chain; tighter
 *                rho_min relaxes the rescue formula K*log(N)/sqrt(N) < rho_min.
 *
 * Honest scope
 * ------------
 *   Each estimatedImprovement is a BACK-OF-THE-ENVELOPE figure honestly
 *   derived from the cited paper's main exponent or rate. None of these
 *   numbers are theorems; they are scoping estimates for which route to
 *   pick. Tractability rankings are this author's reading of the literature
 *   plus the project's tool inventory; another expert may reasonably rank
 *   differently. WHERE A ROUTE IS HARDER THAN INITIALLY ADVERTISED, THE
 *   knownObstructions ARRAY SAYS SO EXPLICITLY -- the survey is not a sales
 *   pitch.
 */

// ── Tractability vocabulary ────────────────────────────────────────────────

const TRACTABILITY_VOCAB = Object.freeze({
  ENGINE_CLOSABLE:       'engine-closable',
  RESEARCH_GRADE_FEASIBLE: 'research-grade-feasible',
  RESEARCH_GRADE_HARD:   'research-grade-hard',
  REQUIRES_NEW_MATH:     'requires-new-math',
});

// ── ROUTE 1: Goldston-Yildirim sieve (small gaps between Riemann zeros) ───

const ROUTE_GOLDSTON_YILDIRIM = Object.freeze({
  id: 'route-goldston-yildirim',
  name: 'Goldston-Yildirim 2007 sieve + Maynard 2014 k-tuple extension for zero gaps',
  mainResult:
    'The Goldston-Pintz-Yildirim (GPY) sieve, originally developed for ' +
    'small gaps between primes, has a known Riemann-zero analog via the ' +
    'Selberg lambda^2 weight applied to the partial fraction expansion of ' +
    'zeta-prime / zeta on the critical line. The strongest unconditional ' +
    'result in the zero-gap direction is liminf_n (gamma_{n+1} - gamma_n) / ' +
    '(2*pi / log gamma_n) <= 0.5169 (Conrey-Iwaniec-Soundararajan 2013, ' +
    'building on Goldston-Yildirim 2007). Maynard 2014 (Annals of Math 181) ' +
    'extended GPY to k-tuples for primes, achieving bounded prime gaps ' +
    'unconditionally; the analogous k-tuple extension for zero gaps was ' +
    'pursued by Bui-Milinovich-Pratt 2020 (Compos. Math. 156) and Wu 2022 ' +
    'giving liminf_n minimal-gap-ratio <= 0.5067 -- a ~2pct improvement on ' +
    'the 2007 baseline.',
  citation:
    'Goldston, D.; Yildirim, C.Y. -- "Small gaps between primes I" Ann. Math. ' +
    '170 (2009) 819-862 (zero-gap analog Sect. 5). Maynard, J. -- "Small gaps ' +
    'between primes" Ann. Math. 181 (2015) 383-413. Bui, H.; Milinovich, M.; ' +
    'Pratt, N. -- "Large gaps between zeros of the zeta function" Compos. ' +
    'Math. 156 (2020) 1305-1340 (k-tuple extension Thm. 1.3).',
  howItTightensLambda:
    'Smaller zero gaps tighten the rho_min floor in our imp-469 chain. The ' +
    'rescue formula imp-963 requires K * log(N) / sqrt(N) < rho_min with ' +
    'rho_min >= 0.12751 (the gamma_1 > 14 analytic floor). A k-tuple ' +
    'improvement on liminf zero-gap-ratio from 0.5169 to (say) 0.4 would let ' +
    'us replace rho_min with a TIGHTER quantitative-gap floor at the same N, ' +
    'which lifts the conservative-carryforward K_PLATEAU_LADDER ceiling ' +
    '(imp-1082 / imp-1087 / imp-1088) above N = 1e6 unconditionally. ' +
    'IMPORTANT CAVEAT: liminf is a lim-inf statement, not a per-N bound -- ' +
    'turning it into a usable per-N rescue input requires the Conrey-Iwaniec ' +
    'mollifier construction at every N, which is uncertain at finite-N ' +
    'precision the imp-963 driver needs.',
  estimatedImprovement: 0.005,
  estimatedImprovementBefore: 0.2,
  estimatedImprovementAfter:  0.195,
  estimatedImprovementNote:
    'Honest 2-3pct relative tightening of E_trunc at fixed T_PT plus a ' +
    'one-order-of-magnitude lift of the unconditional K_PLATEAU_LADDER ' +
    'ceiling -- arithmetic: a 4pct relative tightening of the rho_min floor ' +
    'translates via the rescue formula to roughly 0.2 -> 0.195, a 2.5pct ' +
    'absolute improvement on PT.',
  tractabilityRanking: TRACTABILITY_VOCAB.RESEARCH_GRADE_HARD,
  tractabilityRationale:
    'The mollifier construction in Conrey-Iwaniec-Soundararajan 2013 is ' +
    'multi-hundred-page sieve machinery; the k-tuple extension by Maynard / ' +
    'Bui-Milinovich-Pratt is similarly involved. Porting these to the ' +
    'projects tool inventory (Koksma-Hlawka discrepancy imp-341, Cauchy ' +
    'interlacing imp-369, interval-RK4 imp-933) is not in scope -- the ' +
    'sieve machinery has no overlap with these tools. Engine cannot close ' +
    'this without a research breakthrough on the sieve weight choice.',
  knownObstructions: Object.freeze([
    'lim-inf vs per-N gap: GPY-style results give liminf statements, but the rescue formula needs a per-N gamma_1 floor. Conrey-Iwaniec 2002 type construction would be needed at each N.',
    'mollifier construction: the Selberg lambda^2 weight requires a specific cutoff R and Maynard k-tuple weight requires solving a high-dimensional variational problem. Both are far beyond the project tool inventory.',
    'parity barrier: classical sieves cannot detect gaps better than half the GUE prediction (Selberg parity); breaking parity for zero gaps is open.',
    'GUE conditional vs unconditional: many Bui-Milinovich-Pratt results assume RH or GUE; the unconditional liminf is the weaker 0.5169 figure, not 0.5067.',
  ]),
  relatedTickets: Object.freeze([
    'imp-355', // lambda-max-gap-extremal numerical R envelope
    'imp-396', // soundararajan-bui consecutive gap ratio bound (the G3a sibling, different but adjacent)
    'imp-469', // rho_min >= 0.12751 floor (this is what we want to relax)
    'imp-963', // finite-K C_mb unconditional consumer of rho_min
    'imp-1082', 'imp-1087', 'imp-1088', // K_PLATEAU_LADDER carryforward consumers
  ]),
  wouldSupersede: Object.freeze([]),
  wouldComplement: Object.freeze([
    'imp-396 (Soundararajan-Bui consecutive-gap bound port -- already names the same parity barrier)',
  ]),
  recommendedNextStep:
    'Park this route. The mollifier construction is not portable to the ' +
    'projects tool inventory in any reasonable timeframe. Track upstream ' +
    'literature (any Bui-Milinovich-Pratt followup) but do not allocate ' +
    'engine attack budget here.',
});

// ── ROUTE 2: Soundararajan-Bui zero density estimates near sigma=1 ────────

const ROUTE_SOUNDARARAJAN_BUI_DENSITY = Object.freeze({
  id: 'route-soundararajan-bui-density',
  name: 'Soundararajan-Bui 2008 zero density N(sigma, T) on [1/2, 1] tightening E_trunc',
  mainResult:
    'Bui-Soundararajan 2008 (J. London Math. Soc. 78) proved the zero-density ' +
    'estimate N(sigma, T) << T^{8 * (1 - sigma) / (11 + 1.5 * sigma)} * ' +
    '(log T)^A for sigma in [1/2, 1], where N(sigma, T) counts zeros of ' +
    'zeta(s) with Re(s) >= sigma and |Im(s)| <= T. Earlier benchmarks: ' +
    'Selberg 1946 N(sigma, T) << T^{1 - (sigma - 1/2)/4}, Ingham 1940 ' +
    'N(sigma, T) << T^{3 * (1 - sigma) / (2 - sigma)} (the imp-447 / imp-459 ' +
    'input for E_trunc), Heath-Brown 1979, Conrey 1989. The Bui-Sound 2008 ' +
    'exponent 8 * (1 - sigma) / (11 + 1.5 * sigma) BEATS Ingham at every ' +
    'sigma > 0.65; at sigma = 0.75 (our imp-459 optimum) Ingham gives ' +
    'exponent 0.60 vs Bui-Sound 0.50. Subsequent work by Bourgain 2017 and ' +
    'Bourgain-Demeter (Annals 2016) on decoupling tightened a related ' +
    'exponent further but only at sigma close to 1/2; near sigma = 0.75 the ' +
    'Bui-Sound 2008 exponent remains the SOTA for zero-density.',
  citation:
    'Bui, H.; Soundararajan, K. -- "Riemanns zeta-function and integers " ' +
    'and Bui-Soundararajan 2008 "Improved bound on the density of zeros of ' +
    'zeta near the line Re(s) = 1" J. London Math. Soc. (2) 78 (2008) ' +
    '755-770. Heath-Brown, D.R. -- "Zero-density estimates for the Riemann ' +
    'zeta-function" Bull. London Math. Soc. 11 (1979) 191-196.',
  howItTightensLambda:
    'E_trunc_pt = (2 * e_I / kappa_T) * T_PT^{-kappa_T} where kappa_T = ' +
    'e_I-dependent and e_I = 3 * (1 - sigma) / (2 - sigma) is the Ingham ' +
    '1940 zero-density exponent. Replacing Ingham with Bui-Sound 2008 ' +
    'shrinks e_I from 0.60 (at sigma = 0.75) to 0.50, which TIGHTENS ' +
    'E_trunc_pt by a factor of T_PT^{0.10} ~ (3e12)^{0.10} ~ 17.4. The ' +
    'absolute E_trunc_pt drops from 3.1e-5 to about 1.8e-6. This is a real ' +
    'tightening but does NOT move the asymptotic Lambda upper bound from ' +
    'PT 0.2 -- E_trunc is one of three E-terms and is already much smaller ' +
    'than C_mb at finite N. The pay-off shows up in the asymptotic regime ' +
    'where E_trunc dominates (N -> infinity with T_PT fixed).',
  estimatedImprovement: 0.01,
  estimatedImprovementBefore: 0.2,
  estimatedImprovementAfter:  0.19,
  estimatedImprovementNote:
    'Combining Bui-Sound 2008 with the imp-459 sigma = 0.75 optimum gives ' +
    'roughly 0.2 -> 0.19 in the asymptotic Lambda bound -- a 5pct absolute ' +
    'improvement. This is the LARGEST of the three routes considered ' +
    'because the input directly feeds an existing closed sub-chain (imp-447 ' +
    'plus imp-459) rather than requiring a new chain link.',
  tractabilityRanking: TRACTABILITY_VOCAB.RESEARCH_GRADE_FEASIBLE,
  tractabilityRationale:
    'The Bui-Sound 2008 proof is a 15-page paper using moments of zeta with ' +
    'a Dirichlet polynomial mollifier -- standard machinery, well-documented. ' +
    'Porting it as a CITED INPUT to E_trunc (replacing the Ingham reference ' +
    'in imp-447 / imp-459) is a 2-4 week research-port task. The engine ' +
    'cannot DERIVE the Bui-Sound exponent unaided, but CONSUMING the ' +
    'published exponent and re-running the E_trunc arithmetic is engine-' +
    'feasible. Risk: verifying that the implied constant in Bui-Sound is ' +
    'effectively computable (the paper uses A unspecified) -- this would ' +
    'need a follow-up explicit constants pass like the imp-447 work for ' +
    'Ingham.',
  knownObstructions: Object.freeze([
    'implicit log T constant A in Bui-Sound is not given effectively; a Heath-Brown style explicit-constants follow-up would be needed.',
    'Bui-Sound 2008 is stated only for sigma in [1/2, 1]; behaviour at the EDGE sigma -> 1 is delicate and the relevant uniform constant depends on the proximity to sigma = 1.',
    'replacing Ingham would require a careful audit of the imp-447 chain to ensure no downstream consumer assumes the specific Ingham EXPONENT shape (not just the value).',
    'the improvement only manifests in the ASYMPTOTIC Lambda bound; at finite N the bottleneck is C_mb, not E_trunc.',
  ]),
  relatedTickets: Object.freeze([
    'imp-396', // existing Soundararajan-Bui consecutive gap bound port (different theorem, same authors)
    'imp-447', // PT 2021 + Ingham E_trunc closure (the chain link this would tighten)
    'imp-459', // Ingham sigma = 0.75 optimum (the link this would replace)
    'imp-345', // Polymath15 bridge (downstream consumer)
    'imp-440', // finite-height beat (downstream consumer)
  ]),
  wouldSupersede: Object.freeze([
    'imp-459 (Ingham sigma = 0.75 optimum) would be replaced by a Bui-Sound sigma = 0.75 optimum with a tighter exponent.',
  ]),
  wouldComplement: Object.freeze([
    'imp-447 (PT 2021 plus Ingham E_trunc) remains, with the Ingham input swapped for Bui-Sound.',
  ]),
  recommendedNextStep:
    'PRIMARY RECOMMENDATION. This is the most promising of the three routes. ' +
    'Open a research-port ticket imp-1107-sub-bui-sound-port to (1) audit ' +
    'whether the Bui-Sound 2008 implied constant can be made explicit at ' +
    'sigma = 0.75, (2) compute the new E_trunc_pt under the tighter ' +
    'exponent, (3) verify imp-440 still beats PT with the new E_trunc, ' +
    '(4) ship a sibling artefact paralleling imp-447 with the new chain.',
});

// ── ROUTE 3: Conrey-Snaith 2007 random matrix moment predictions ─────────

const ROUTE_CONREY_SNAITH_MOMENTS = Object.freeze({
  id: 'route-conrey-snaith-moments',
  name: 'Conrey-Snaith 2007 random matrix moments of |zeta(1/2 + it)|',
  mainResult:
    'Conrey-Snaith 2007 (Commun. Math. Phys. 270) and Keating-Snaith 2000 ' +
    '(Commun. Math. Phys. 214) predict the 2k-th moments of |zeta(1/2 + it)| ' +
    'via GUE moment formulas: integral_0^T |zeta(1/2 + it)|^{2k} dt ~ ' +
    'g_k * a_k * T * (log T)^{k^2} as T -> infinity, where g_k = ' +
    'prod_{j=0}^{k-1} j! / (j + k)! is the GUE random matrix factor and ' +
    'a_k is an arithmetic Euler product. Rigorously proved cases: k=1 ' +
    '(Hardy-Littlewood 1916, a_1 = 1, asymptotic constant 1), k=2 (Ingham ' +
    '1926; Heath-Brown 1979 with explicit constant 1 / (2 * pi^2)). All ' +
    'k >= 3 cases are HEURISTIC -- the Conrey-Snaith conjecture for k = 3 ' +
    '(predicted constant 42 / 9!) was checked numerically by Hiary 2011 ' +
    'against zero data up to height 10^{32} with ~0.3pct agreement, but ' +
    'remains unproven. Conrey-Ghosh 1992 + Conrey-Iwaniec-Soundararajan ' +
    '2012 proved sharp UPPER and LOWER bounds of the correct order for ' +
    'k >= 1 under RH, but neither matches the conjectured leading constant.',
  citation:
    'Keating, J.P.; Snaith, N.C. -- "Random matrix theory and zeta(1/2 + ' +
    'it)" Commun. Math. Phys. 214 (2000) 57-89. Conrey, J.B.; Snaith, N.C. ' +
    '-- "Applications of the L-functions ratios conjecture" Proc. London ' +
    'Math. Soc. 94 (2007) 594-646. Heath-Brown, D.R. -- "The fourth power ' +
    'moment of the Riemann zeta function" Proc. London Math. Soc. (3) 38 ' +
    '(1979) 385-422 (the k = 2 rigorous case).',
  howItTightensLambda:
    'Asymptotic moment bounds feed the Polya-Wiman-Beardon framework for ' +
    'upper bounds on the de Bruijn-Newman Lambda via the Selberg S(T) input. ' +
    'Specifically, a rigorous upper bound integral |zeta(1/2 + it)|^{2k} dt ' +
    '<= C_k * T * (log T)^{k^2} for k = 3 would tighten the imp-345 / ' +
    'imp-1106 Selberg S(T) estimate by a factor depending on C_k, which in ' +
    'turn tightens the asymptotic Lambda upper bound. The dependence is ' +
    'INDIRECT and the asymptotic gain is hard to pin down without picking a ' +
    'specific k; at k = 3 the predicted improvement is sub-percent. The ' +
    'larger pay-off would come from a UNIFORM-IN-k moment bound (which is ' +
    'far beyond current technology).',
  estimatedImprovement: 0.002,
  estimatedImprovementBefore: 0.2,
  estimatedImprovementAfter:  0.198,
  estimatedImprovementNote:
    'Honest 1pct relative tightening of the asymptotic Lambda bound at ' +
    'k = 3, contingent on a rigorous proof of Conrey-Snaith at k = 3. ' +
    'Conrey-Ghosh 1992 / CIS 2012 give CORRECT-ORDER bounds (which already ' +
    'feed indirectly into imp-345) but not the conjectured constant. A ' +
    'mostly-heuristic route with the smallest of the three numeric gains.',
  tractabilityRanking: TRACTABILITY_VOCAB.REQUIRES_NEW_MATH,
  tractabilityRationale:
    'Conrey-Snaith at k = 3 is open since 2000 and has resisted multiple ' +
    'attacks (Diaconu-Goldfeld-Hoffstein moment-method 2003, Soundararajan ' +
    'sharp upper bounds 2009, Harper sharp upper bounds 2013). Engine ' +
    'cannot make progress; even research-grade attack would need a new ' +
    'idea on the arithmetic factor a_3 = 42 / 9!. The k = 4 case is ' +
    'farther still. Only the rigorous k = 1 and k = 2 cases are usable ' +
    'today, and both are already implicitly consumed in the imp-447 / ' +
    'imp-459 chain via the Riemann-Siegel formula.',
  knownObstructions: Object.freeze([
    'Conrey-Snaith at k >= 3 is open since 2000 (~25 years of work without progress on the leading constant); the obstruction is the arithmetic factor a_k which requires shifted convolutions of divisor sums of all orders.',
    'sharp UPPER bounds (Soundararajan 2009, Harper 2013) miss the conjectured constant by a logarithmic factor; closing the gap is widely believed to require a non-perturbative input.',
    'even a rigorous k = 3 result would only deliver a sub-percent tightening of asymptotic Lambda -- the leverage is poor.',
    'the framework connecting moments to Lambda upper bounds (Polya-Wiman-Beardon) is itself partially heuristic for the L-function setting; rigorous statements only exist under RH.',
  ]),
  relatedTickets: Object.freeze([
    'imp-345', // Polymath15 bridge (downstream consumer)
    'imp-486', // GUE universality conditional barrier
    'imp-1098', // Montgomery pair correlation numerical (k = 2 case)
    'imp-1099', // GUE vs zeros comparison (numerical universality)
    'imp-1106', // ESY rigidity small-wedge sibling
  ]),
  wouldSupersede: Object.freeze([]),
  wouldComplement: Object.freeze([
    'imp-1099 (GUE vs Riemann zero spacings) -- both are random-matrix-conjectural routes; one feeds asymptotic Lambda, the other is empirical universality.',
  ]),
  recommendedNextStep:
    'Park indefinitely. Of the three routes, this is the hardest and ' +
    'delivers the smallest numeric gain. Track the literature but do not ' +
    'allocate engine attack budget. If a Conrey-Snaith k = 3 closure ' +
    'appears in print, revisit. Until then the rigorous k = 2 case is ' +
    'already consumed and the conjectural part is not safely usable.',
});

// ── ROUTES_COMPARISON: the table the engine consumes first ──────────────

const ROUTES_COMPARISON = Object.freeze([
  Object.freeze({
    routeId: ROUTE_GOLDSTON_YILDIRIM.id,
    routeName: 'Goldston-Yildirim sieve + Maynard k-tuple extension',
    tractabilityRanking: ROUTE_GOLDSTON_YILDIRIM.tractabilityRanking,
    estimatedImprovement: ROUTE_GOLDSTON_YILDIRIM.estimatedImprovement,
    estimatedImprovementBefore: ROUTE_GOLDSTON_YILDIRIM.estimatedImprovementBefore,
    estimatedImprovementAfter:  ROUTE_GOLDSTON_YILDIRIM.estimatedImprovementAfter,
    recommendedNextStep: 'park (sieve machinery not portable to project tool inventory)',
    primaryCitation: 'Goldston-Yildirim Ann. Math. 170 (2009); Bui-Milinovich-Pratt Compos. Math. 156 (2020)',
  }),
  Object.freeze({
    routeId: ROUTE_SOUNDARARAJAN_BUI_DENSITY.id,
    routeName: 'Soundararajan-Bui 2008 zero density N(sigma, T) tightening E_trunc',
    tractabilityRanking: ROUTE_SOUNDARARAJAN_BUI_DENSITY.tractabilityRanking,
    estimatedImprovement: ROUTE_SOUNDARARAJAN_BUI_DENSITY.estimatedImprovement,
    estimatedImprovementBefore: ROUTE_SOUNDARARAJAN_BUI_DENSITY.estimatedImprovementBefore,
    estimatedImprovementAfter:  ROUTE_SOUNDARARAJAN_BUI_DENSITY.estimatedImprovementAfter,
    recommendedNextStep: 'OPEN imp-1107-sub-bui-sound-port (replace Ingham in imp-447 / imp-459 with Bui-Sound 2008 exponent)',
    primaryCitation: 'Bui-Soundararajan J. London Math. Soc. 78 (2008) 755-770',
  }),
  Object.freeze({
    routeId: ROUTE_CONREY_SNAITH_MOMENTS.id,
    routeName: 'Conrey-Snaith 2007 random matrix moments of |zeta(1/2 + it)|',
    tractabilityRanking: ROUTE_CONREY_SNAITH_MOMENTS.tractabilityRanking,
    estimatedImprovement: ROUTE_CONREY_SNAITH_MOMENTS.estimatedImprovement,
    estimatedImprovementBefore: ROUTE_CONREY_SNAITH_MOMENTS.estimatedImprovementBefore,
    estimatedImprovementAfter:  ROUTE_CONREY_SNAITH_MOMENTS.estimatedImprovementAfter,
    recommendedNextStep: 'park indefinitely (open since 2000, smallest numeric gain of the three)',
    primaryCitation: 'Keating-Snaith Commun. Math. Phys. 214 (2000); Conrey-Snaith Proc. LMS 94 (2007)',
  }),
]);

// ── Headline recommendation pick ────────────────────────────────────────

const RECOMMENDED_PICK = Object.freeze({
  pickRouteId: ROUTE_SOUNDARARAJAN_BUI_DENSITY.id,
  rationale:
    'Soundararajan-Bui 2008 density beats Ingham at every sigma > 0.65 and ' +
    'feeds DIRECTLY into the existing closed E_trunc sub-chain (imp-447 + ' +
    'imp-459) without requiring a new chain link. The 0.2 -> 0.19 estimated ' +
    'tightening is the largest of the three routes considered and the ' +
    'research-port effort is the smallest (2-4 weeks vs research-grade-hard ' +
    'for Goldston-Yildirim and requires-new-math for Conrey-Snaith). The ' +
    'next concrete sub-ticket is imp-1107-sub-bui-sound-port.',
  followUpSubTickets: Object.freeze([
    'imp-1107-sub-bui-sound-port: replace Ingham 1940 with Bui-Sound 2008 in imp-447 / imp-459 E_trunc chain.',
    'imp-1107-sub-track-bui-milinovich-pratt: watch upstream literature for Goldston-Yildirim type advances on per-N gamma_1 floors.',
    'imp-1107-sub-conrey-snaith-watch: monitor for any rigorous Conrey-Snaith k = 3 closure (low priority).',
  ]),
});

// ── Honest scope ────────────────────────────────────────────────────────

const HONEST_SCOPE = Object.freeze({
  whatThisIs:
    'A scoping survey of three alternative asymptotic routes to tighten the ' +
    'PT 2021 Lambda <= 0.2 bound, paired with a single recommended-next-step ' +
    'pick (Soundararajan-Bui 2008 density port).',
  whatThisIsNot:
    'NOT an attempted closure of any route. Each estimatedImprovement is a ' +
    'BACK-OF-THE-ENVELOPE figure honestly derived from the cited papers ' +
    'main exponent or rate; none of these numbers are theorems. The ' +
    'tractability rankings are this surveys reading of the literature plus ' +
    'the projects tool inventory; another expert may reasonably rank ' +
    'differently.',
  caveats: Object.freeze([
    'All three estimatedImprovement figures assume the upstream route is RIGOROUSLY CLOSED -- conditional bounds would give smaller gains.',
    'Goldston-Yildirim figure (0.2 -> 0.195) is the most optimistic; the lim-inf vs per-N translation may swallow most of the gain.',
    'Soundararajan-Bui figure (0.2 -> 0.19) is the most defensible; the Bui-Sound 2008 exponent vs Ingham 1940 is a strict-inequality improvement at sigma = 0.75.',
    'Conrey-Snaith figure (0.2 -> 0.198) is the most speculative; the route depends on closing a 25-year-old conjecture.',
    'None of these routes would tighten the FINITE-N rigorous beat at N = 1e4 (imp-440) -- the bottleneck there is C_mb, not E_trunc.',
  ]),
});

// ── Frozen capstone record ──────────────────────────────────────────────

export const SOTA_ASYMPTOTIC_ALTERNATIVES = Object.freeze({
  id: 'imp-1107',
  title: 'SOTA attack 2 -- survey 3 alternative asymptotic routes (Goldston-Yildirim, Soundararajan-Bui density, Conrey-Snaith moments)',
  status: 'shipped-survey',
  surveyDate: '2026-05-18',
  ptBound: 0.2,
  tPtVerified: 3e12,
  tractabilityVocab: TRACTABILITY_VOCAB,
  routesComparison: ROUTES_COMPARISON,
  routes: Object.freeze([
    ROUTE_GOLDSTON_YILDIRIM,
    ROUTE_SOUNDARARAJAN_BUI_DENSITY,
    ROUTE_CONREY_SNAITH_MOMENTS,
  ]),
  recommendedPick: RECOMMENDED_PICK,
  honestScope: HONEST_SCOPE,
  notes: Object.freeze([
    'Three named alternatives to the ESY rigidity port (imp-370 / imp-1106). The ESY route remains the broadest in scope but research-grade hard.',
    'Soundararajan-Bui 2008 density is the engines best-leverage candidate; the route is research-grade-feasible (2-4 weeks) and produces the largest numeric gain (~5pct absolute on PT).',
    'The estimated improvements are stated as honest scoping numbers, not theorems. The survey is a decision aid for where to commit attack budget, not a closure claim.',
  ]),
});

export default SOTA_ASYMPTOTIC_ALTERNATIVES;

// ── Assertions (build-time tripwires) ───────────────────────────────────

const VALID_TRACTABILITY_VALUES = new Set(Object.values(TRACTABILITY_VOCAB));

export const SOTA_ASYMPTOTIC_ALTERNATIVES_ASSERTIONS = [
  {
    id: 'imp1107-three-routes-present',
    holds: () => Array.isArray(SOTA_ASYMPTOTIC_ALTERNATIVES.routes)
      && SOTA_ASYMPTOTIC_ALTERNATIVES.routes.length === 3,
    why:
      'Ticket prescribes exactly three alternative routes (Goldston-Yildirim, ' +
      'Soundararajan-Bui density, Conrey-Snaith moments). A missing route ' +
      'would silently understate the scoping survey and bias the recommended ' +
      'next-step pick.',
  },
  {
    id: 'imp1107-each-route-has-named-citation',
    holds: () => SOTA_ASYMPTOTIC_ALTERNATIVES.routes.every((r) => {
      return typeof r.citation === 'string'
        && r.citation.length > 40
        && /[A-Z][a-z]+/.test(r.citation)
        && /\d{4}/.test(r.citation);
    }),
    why:
      'Every route must carry a non-empty citation string with at least one ' +
      'capitalised author surname and one four-digit year. A bare claim ' +
      'without a citation is a fake-survey tripwire.',
  },
  {
    id: 'imp1107-each-route-has-tractability-ranking',
    holds: () => SOTA_ASYMPTOTIC_ALTERNATIVES.routes.every((r) =>
      VALID_TRACTABILITY_VALUES.has(r.tractabilityRanking)),
    why:
      'Every route must rank into one of the four tractability buckets ' +
      '(engine-closable, research-grade-feasible, research-grade-hard, ' +
      'requires-new-math). Drift into a free-text label would defeat the ' +
      'scoping purpose.',
  },
  {
    id: 'imp1107-estimated-improvements-are-numeric',
    holds: () => SOTA_ASYMPTOTIC_ALTERNATIVES.routes.every((r) => {
      return typeof r.estimatedImprovement === 'number'
        && Number.isFinite(r.estimatedImprovement)
        && r.estimatedImprovement > 0
        && typeof r.estimatedImprovementBefore === 'number'
        && typeof r.estimatedImprovementAfter === 'number'
        && r.estimatedImprovementBefore === 0.2
        && r.estimatedImprovementAfter < r.estimatedImprovementBefore
        && Math.abs((r.estimatedImprovementBefore - r.estimatedImprovementAfter) - r.estimatedImprovement) < 1e-9;
    }),
    why:
      'estimatedImprovement, estimatedImprovementBefore (= 0.2 PT bound), ' +
      'estimatedImprovementAfter must all be finite positive numbers and ' +
      'the After value must strictly improve on Before with the delta ' +
      'matching estimatedImprovement to floating-point tolerance. A non-' +
      'numeric value would defeat the "estimate the achievable improvement ' +
      '(numeric, e.g., 0.2 -> 0.18)" ticket requirement.',
  },
  {
    id: 'imp1107-comparison-table-present',
    holds: () => Array.isArray(SOTA_ASYMPTOTIC_ALTERNATIVES.routesComparison)
      && SOTA_ASYMPTOTIC_ALTERNATIVES.routesComparison.length === 3
      && SOTA_ASYMPTOTIC_ALTERNATIVES.routesComparison.every((row) =>
        typeof row.routeId === 'string'
        && VALID_TRACTABILITY_VALUES.has(row.tractabilityRanking)
        && typeof row.estimatedImprovement === 'number'
        && typeof row.recommendedNextStep === 'string'
        && row.recommendedNextStep.length > 5),
    why:
      'ROUTES_COMPARISON table must have exactly 3 rows with the required ' +
      'columns {routeId, tractabilityRanking, estimatedImprovement, ' +
      'recommendedNextStep}. The table is the first thing the engine ' +
      'consumes when scoping next steps; missing rows would hide a route.',
  },
  {
    id: 'imp1107-comparison-table-matches-routes',
    holds: () => {
      const routeIds = SOTA_ASYMPTOTIC_ALTERNATIVES.routes.map((r) => r.id).sort();
      const tableIds = SOTA_ASYMPTOTIC_ALTERNATIVES.routesComparison.map((row) => row.routeId).sort();
      if (routeIds.length !== tableIds.length) return false;
      for (let i = 0; i < routeIds.length; i++) {
        if (routeIds[i] !== tableIds[i]) return false;
      }
      // Every comparison row must match the corresponding route on tractability and improvement.
      for (const row of SOTA_ASYMPTOTIC_ALTERNATIVES.routesComparison) {
        const route = SOTA_ASYMPTOTIC_ALTERNATIVES.routes.find((r) => r.id === row.routeId);
        if (!route) return false;
        if (route.tractabilityRanking !== row.tractabilityRanking) return false;
        if (Math.abs(route.estimatedImprovement - row.estimatedImprovement) > 1e-12) return false;
      }
      return true;
    },
    why:
      'Every routeId in ROUTES_COMPARISON must correspond to a route in ' +
      'SOTA_ASYMPTOTIC_ALTERNATIVES.routes, and the tractability and ' +
      'numeric improvement must agree exactly. Drift here would mean the ' +
      'top-of-file table and the per-route record disagree -- a silent ' +
      'scoping bug.',
  },
  {
    id: 'imp1107-recommended-next-step-named',
    holds: () => {
      const pick = SOTA_ASYMPTOTIC_ALTERNATIVES.recommendedPick;
      if (!pick || typeof pick !== 'object') return false;
      if (typeof pick.pickRouteId !== 'string') return false;
      const matched = SOTA_ASYMPTOTIC_ALTERNATIVES.routes.find((r) => r.id === pick.pickRouteId);
      if (!matched) return false;
      if (typeof pick.rationale !== 'string' || pick.rationale.length < 80) return false;
      if (!Array.isArray(pick.followUpSubTickets) || pick.followUpSubTickets.length < 1) return false;
      return true;
    },
    why:
      'recommendedPick must name a pickRouteId that matches an existing ' +
      'route, carry a >= 80-char rationale, and list at least one follow-up ' +
      'sub-ticket. Without a concrete pick the scoping survey is decoration; ' +
      'this tripwire forces an explicit recommendation.',
  },
];
