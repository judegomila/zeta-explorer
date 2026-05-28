// imp-1245: OPUS-4.8 adversarial stress-test of the imp-1241 CDB-Exist
//           three-of-four unification claim.
//
// QUESTION UNDER TEST
// -------------------
// imp-1241 concluded that paper Conjectures 16.4, 16.6, 18.1 collapse to a
// single Canonical de Branges Existence statement (CDB-Exist):
//
//   For every a > 0 there exists a positive Hamiltonian canonical system
//   (R_+, dm_a) constructed directly from Phi (NOT from the zero set of X)
//   whose Krein-Weyl transfer function after Cayley transform equals
//   Theta_a(z) = E_a^#(z) / E_a(z).
//
// Before recommending to the paper author that 3 conjectures be folded into
// 1, the unification needs adversarial review along three axes:
//
//   (a) Does 18.1 actually reduce to canonical-system existence, or is it
//       a fundamentally different KYP-passivity problem that only LOOKS
//       similar?
//   (b) Is the unified statement strong enough that CDB-Exist implies the
//       three corollaries (16.4, 16.6, 18.1) without gaps?
//   (c) Does the unified statement avoid the same Phi-non-circularity
//       obstruction that blocks the three originals?
//
// METHOD
// ------
// Training-time knowledge only. No external browsing. Each axis is walked
// from first principles against the textbook references (de Branges 1968,
// Krein 1955, Romanov 2010, Anderson-Vongpanitlerd 1973, Arov-Nudelman
// 1996, Eckhardt-Kostenko 2014).
//
// SYNTAX NOTE: no apostrophes inside single-quoted JS strings.

// -- Axis (a): does 18.1 reduce to canonical-system existence? --------------

const AXIS_A = Object.freeze({
  id: 'axis-a-18-1-reduces-to-canonical-system',
  question:
    'Does Conjecture 18.1 (positive Hamiltonian canonical system whose Weyl ' +
    'transfer function is Theta_a; K_a is the energy kernel of a passive ' +
    'realization) actually reduce to the de Branges canonical-system ' +
    'existence problem of 16.6, or is it a fundamentally different KYP ' +
    'passivity problem that only LOOKS similar?',

  imp1241ClaimUnderTest:
    'imp-1241 asserted 18.1 is identical TYPE of existence as 16.4 + 16.6 ' +
    'because the passive realization, the canonical-system dm, the Hermite- ' +
    'Biehler E_a, the PSD kernel K_a, and the Kolmogorov factorization are ' +
    'five faces of the same de Branges-Krein object. KYP adds the state-space ' +
    'controls perspective but produces the same existence theorem.',

  firstPrinciplesWalk: Object.freeze([
    'Classical KYP (Kalman-Yakubovich-Popov; Anderson-Vongpanitlerd 1973) ' +
      'produces a state-space realization (A, B, C, D) with a quadratic ' +
      'storage function (Gramian P >= 0) such that the Schur transfer ' +
      'function S(z) = D + C(zI - A)^{-1} B is passive. This is a FINITE- ' +
      'DIMENSIONAL or BOUNDED-OPERATOR statement in its original form.',
    'de Branges canonical system (de Branges 1968 chap 3; Romanov 2010): a ' +
      '2x2 positive Hamiltonian H(x) on R_+ with the Krein-Weyl m-function ' +
      'obtained from the boundary behaviour of the fundamental solution. ' +
      'The Cayley transform of the m-function is a Schur function in C_+.',
    'BRIDGE between the two (Arov-Nudelman 1996, Passive Systems and ' +
      'Characteristic Functions; also Brodskii 1971, Sz.-Nagy-Foias dilation ' +
      'theory): every Schur function in C_+ admits a passive realization in ' +
      'a Hilbert state space; the conservative simple realization is UNIQUE ' +
      'up to unitary equivalence and is naturally isomorphic to a de Branges ' +
      'canonical system on R_+ via the Liouville parametrization.',
    'CONCRETE ISOMORPHISM for 18.1: the state space of the conservative ' +
      'realization of Theta_a is unitarily equivalent to H(E_a); the system ' +
      'semigroup is multiplication by exp(itx) under the canonical-system ' +
      'parameter x; A_a / B_a are the standard de Branges A/B decomposition ' +
      'of E_a, which appear as the fundamental-solution components u(x, z), ' +
      'v(x, z) at the right endpoint x = x_a.',
  ]),

  caveatsIdentified: Object.freeze([
    'CAVEAT 1: classical KYP (Anderson-Vongpanitlerd 1973) is finite- ' +
      'dimensional. The infinite-dimensional bridge requires Arov-Nudelman ' +
      '1996, Brodskii 1971, or Sz.-Nagy-Foias dilation theory; imp-1241 ' +
      'cited only Anderson-Vongpanitlerd 1973 and classical Yakubovich- ' +
      'Kalman-Popov, missing the Arov-Nudelman citation needed for the ' +
      'INFINITE-DIM bridge.',
    'CAVEAT 2: KYP-passive realization is not unique. Three classes ' +
      'coexist: simple-conservative (= de Branges canonical system), ' +
      'minimal-passive (= Sz.-Nagy-Foias model), Pontryagin-passive (= ' +
      'Krein-Langer S^kappa class). 18.1 says POSITIVE Hamiltonian, which ' +
      'singles out the simple-conservative class. The implication 18.1 ' +
      '<=> 16.6 holds iff we agree to pick this class. The paper does ' +
      'not state this disambiguation explicitly.',
    'CAVEAT 3: the energy kernel K_a interpretation needs the simple- ' +
      'conservative realization to be UNITARILY equivalent to H(E_a), not ' +
      'merely Hilbert-isomorphic. This requires the canonical-system ' +
      'Hamiltonian to be regular (no singular intervals carrying mass) ' +
      'and the right endpoint to be the limit-point case in Weyls ' +
      'classification (de Branges 1968 Theorem XII). For Phi-built E_a ' +
      'this is expected but not automatic.',
  ]),

  verdict: 'pass-with-caveats',
  verdictRationale:
    '18.1 DOES reduce to canonical-system existence (16.6), but via the ' +
    'Arov-Nudelman 1996 infinite-dimensional bridge, not via classical ' +
    'finite-dim KYP. The unification is real once the bridge is invoked. ' +
    'imp-1241 cited only Anderson-Vongpanitlerd 1973 / classical KYP; the ' +
    'paper recommendation should also cite Arov-Nudelman 1996 and ' +
    'Brodskii 1971 to make the infinite-dim bridge explicit. Class ' +
    'disambiguation (simple-conservative vs minimal-passive vs Pontryagin- ' +
    'passive) and right-endpoint limit-point regularity should also be ' +
    'stated to avoid leaving a non-uniqueness loophole.',
});

// -- Axis (b): is the unified statement strong enough? ----------------------

const AXIS_B = Object.freeze({
  id: 'axis-b-cdb-exist-implies-three-corollaries',
  question:
    'Is the unified CDB-Exist statement strong enough that proving it ' +
    'implies the three corollaries (16.4, 16.6, 18.1) without hidden gaps? ' +
    'For each implication CDB-Exist => 16.X, identify the extra ingredient ' +
    '(compactness, regularity, basis choice) the implication requires.',

  imp1241ClaimUnderTest:
    'imp-1241 listed three corollary derivations: 16.4 via Kolmogorov ' +
    'factorization in H(E_a); 16.6 via Cayley of passive transfer is Schur; ' +
    '18.1 via de Branges A/B decomposition + KYP energy kernel.',

  implicationWalk: Object.freeze([
    {
      target: '16.4',
      derivationGiven:
        'From CDB-Exist, take H_a = H(E_a), B_a(z) = K_a(., z). The ' +
        'Kolmogorov factorization K_a = <B_a, B_a> is the reproducing-kernel ' +
        'identity in H(E_a). Phi-built dm_a supplies non-circular realization.',
      gapIdentified:
        'GAP: CDB-Exist as stated guarantees only that the Krein-Weyl ' +
        'transfer function CAYLEY-EQUALS Theta_a. But a passive transfer ' +
        'function determines E only up to an OUTER FACTOR (de Branges 1968 ' +
        'Theorem XII; more sharply, only up to inner-outer factorization). ' +
        'To identify H_a with H(E_a) where E_a(z) = X(a - iz) PRECISELY ' +
        '(not up to outer factor), the construction must yield the dm_a ' +
        'whose structure function at the right endpoint is exactly E_a, ' +
        'not just any E with the same Cayley-Theta. This requires E_a to ' +
        'be specified as an entire-function-of-bounded-type with no inner ' +
        'factor (de Branges 1968 Theorem XXIII, regularity).',
      extraIngredientNeeded:
        'OUTER-FACTOR RIGIDITY: the unified statement must require not just ' +
        '"Cayley transfer equals Theta_a" but also "E_a has no inner factor" ' +
        '(equivalently, the canonical system has no singular intervals on ' +
        'the left). For the Riemann E_a(z) = X(a - iz), inner-factor- ' +
        'freedom is equivalent to absence of off-critical zeros of X, ' +
        'i.e. RH itself. So the rigidity gap is already RH-equivalent, ' +
        'consistent with the openContent declaration but worth flagging.',
      status: 'gap-flagged-rigidity',
    },
    {
      target: '16.6',
      derivationGiven:
        'From CDB-Exist, Theta_a Schur in C_+ is immediate -- the Cayley ' +
        'transform of a passive transfer function is Schur. The passive ' +
        'canonical-system realization is dm_a itself.',
      gapIdentified:
        'NO GAP: this implication is direct and tautological once dm_a is ' +
        'constructed. The Cayley transform of a positive m-function (i.e. ' +
        'a Nevanlinna function with positive imaginary part) is Schur. The ' +
        'canonical-system existence side is exactly what CDB-Exist asserts.',
      extraIngredientNeeded: 'none',
      status: 'clean',
    },
    {
      target: '18.1',
      derivationGiven:
        'From CDB-Exist, (A_a, B_a) is the de Branges A/B decomposition of ' +
        'E_a, which arises canonically from the Hamiltonian via the funda- ' +
        'mental solution. K_a is the energy kernel of the passive realiza- ' +
        'tion by KYP (Anderson-Vongpanitlerd 1973).',
      gapIdentified:
        'GAP: the implication uses two extra structural facts: (i) the ' +
        'de Branges A/B decomposition E_a = A_a - i B_a IS the fundamental- ' +
        'solution decomposition of the canonical system at the right end- ' +
        'point (de Branges 1968 Theorem XII); this requires the limit- ' +
        'point case at infinity. (ii) the energy-kernel interpretation of ' +
        'K_a uses the state-space inner product after Krein-Cayley, which ' +
        'is the Arov-Nudelman 1996 bridge, not classical KYP. The first is ' +
        'a textbook regularity hypothesis; the second is a non-trivial ' +
        'identification.',
      extraIngredientNeeded:
        'LIMIT-POINT-AT-INFINITY (de Branges 1968 Theorem XII) + ARROV- ' +
        'NUDELMAN 1996 (simple-conservative passive realization). Both are ' +
        'standard but unstated in imp-1241; should be added to CDB-Exists ' +
        'corollary derivation for 18.1.',
      status: 'gap-flagged-bridge-citation',
    },
  ]),

  verdict: 'pass-with-gaps',
  verdictRationale:
    'CDB-Exist => 16.6 is clean (no extra ingredient). CDB-Exist => 16.4 ' +
    'needs OUTER-FACTOR RIGIDITY of E_a (inner-factor freedom, equivalent ' +
    'to RH on the Riemann side -- circular within the unified statements ' +
    'open content, but worth flagging). CDB-Exist => 18.1 needs LIMIT- ' +
    'POINT-AT-INFINITY + ARROV-NUDELMAN 1996 bridge. None of these gaps ' +
    'invalidate the unification; they should be explicitly stated as ' +
    'standing regularity hypotheses in the unified statement so the paper ' +
    'reader does not encounter hidden surprises when proving the corollaries.',
});

// -- Axis (c): does CDB-Exist avoid the Phi-non-circularity obstruction? ----

const AXIS_C = Object.freeze({
  id: 'axis-c-non-circularity-obstruction',
  question:
    'The original three (16.4, 16.6, 18.1) all require construction ' +
    '"directly from Phi, not from the zero set of X". This is the open ' +
    'content -- existence given Hermite-Biehler E_a is automatic. Does ' +
    'CDB-Exist BYPASS this obstruction (canonical-systems literature has ' +
    'genuine Phi-style constructed examples), or does it inherit the ' +
    'same obstruction?',

  imp1241ClaimUnderTest:
    'imp-1241 openContent: "CDB-Exist is RH-equivalent by the Krein-de ' +
    'Branges bijection plus the shift-bridge threshold theorem (K_a PSD ' +
    'for every a > 0 iff RH). The open content is the NON-CIRCULAR ' +
    'construction of dm_a from Phi." imp-1241 DID NOT explicitly evaluate ' +
    'whether the unification advances this open content or merely renames it.',

  obstructionAnalysis: Object.freeze([
    'CIRCULARITY of the bijection direction E -> dm: the de Branges chain ' +
      'theorem and Krein-de Branges bijection both REQUIRE the input E to ' +
      'be Hermite-Biehler (equivalently, K_a PSD; equivalently for Riemann, ' +
      'RH). So if you start from E_a built from Phi via the cosh-cos / ' +
      'sinh-sin Fourier integral, you cannot invoke the bijection without ' +
      'first proving E_a is Hermite-Biehler. That proof IS RH.',
    'CANONICAL-SYSTEMS LITERATURE: the Eckhardt-Kostenko 2014 inverse- ' +
      'spectral programme, Romanov 2010, and the classical Krein 1955 ' +
      'theory all produce dm from SPECTRAL DATA (a Herglotz/Nevanlinna ' +
      'function with positive imaginary part on C_+, or a Hermite-Biehler ' +
      'structure function). None of them construct dm from a candidate E ' +
      'whose Hermite-Biehler property is unproven and equivalent to a ' +
      'major open conjecture. So the literature does not supply a Phi- ' +
      'style template that bypasses the obstruction.',
    'PROXY ATTEMPT: one might hope that constructing dm_a from Phi as a ' +
      'limit of dm_a^{(N)} with finite-rank approximations would yield ' +
      'a Phi-constructive dm whose limit Hermite-Biehler property could ' +
      'then be verified separately. But each finite-rank approximation ' +
      'already requires PSD of an approximate K_a^{(N)}, and the limit ' +
      'theorem (de Branges 1968 chap 3, Remlings 2002 inverse-spectral) ' +
      'requires PSD uniformly in N. Same obstruction in disguise.',
    'COMPARISON with 18.2: 18.2 was correctly excluded from CDB-Exist ' +
      '(it lives on the Hadamard logarithmic-derivative side). 18.2 was ' +
      'audited SUBSUMED-BY-RH via paired Hadamard. Crucially, paired ' +
      'Hadamard SUPPLIES a non-circular RH-conditional argument because ' +
      'each zero pair gives a positive contribution. There is no ' +
      'analogous Phi-constructive trick for the canonical-system side ' +
      'because the bijection direction Phi -> dm is precisely where the ' +
      'circularity lives.',
  ]),

  verdict: 'fail',
  verdictRationale:
    'CDB-Exist INHERITS the same Phi-non-circularity obstruction as the ' +
    'three originals; it does NOT bypass it. The unification is a real ' +
    'structural insight at the LOGICAL level (three notational presenta- ' +
    'tions of one existence problem) but does NOT advance the proof ' +
    'programme: the hard open content (non-circular construction of dm_a ' +
    'from Phi, equivalently non-circular proof that E_a is Hermite-Biehler, ' +
    'equivalently RH) is unchanged. Canonical-systems literature has no ' +
    'Phi-constructive template that bypasses the obstruction. The paper ' +
    'should therefore present CDB-Exist as an expository simplification ' +
    'and NOT as a more tractable target.',
});

const PER_AXIS = Object.freeze([AXIS_A, AXIS_B, AXIS_C]);

// -- Overall verdict --------------------------------------------------------

const OVERALL = Object.freeze({
  axisResults: Object.freeze({
    'axis-a-18-1-reduces-to-canonical-system': 'pass-with-caveats',
    'axis-b-cdb-exist-implies-three-corollaries': 'pass-with-gaps',
    'axis-c-non-circularity-obstruction': 'fail',
  }),

  countPass: 2,
  countFail: 1,
  countTotal: 3,

  finalVerdict: 'unification-holds-partially',

  finalVerdictRationale:
    'Two of three axes pass with named caveats: (a) 18.1 DOES reduce to ' +
    'canonical-system existence via the Arov-Nudelman 1996 infinite-dim ' +
    'bridge (imp-1241 missed this citation but the structural claim is ' +
    'correct); (b) CDB-Exist DOES imply the three corollaries with named ' +
    'extra ingredients (outer-factor rigidity, limit-point-at-infinity, ' +
    'Arov-Nudelman bridge); (c) CDB-Exist FAILS to bypass the Phi-non- ' +
    'circularity obstruction -- the unification renames the open content ' +
    'rather than advancing it. Net assessment: the unification is a real ' +
    'expository simplification but does NOT make the proof program more ' +
    'tractable.',

  failureAxisName: 'axis-c-non-circularity-obstruction',
  failureSummary:
    'CDB-Exist has the same Phi-non-circularity obstruction as the three ' +
    'originals. The unification is logical but not strategic.',
});

// -- Recommendation update relative to imp-1241 -----------------------------

const RECOMMENDATION_UPDATE = Object.freeze({
  imp1241OriginalRecommendation:
    'Reframe Conjectures 16.4 + 16.6 + 18.1 as a SINGLE unified conjecture ' +
    '(CDB-Exist: de Branges canonical-system existence non-circularly from ' +
    'Phi) with three corollaries listed by notation. Mark 18.2 as SUBSUMED- ' +
    'BY-RH. This reduces the paper open-conjecture count by 3 (4 collapse ' +
    'to 1) and isolates the non-circularity constraint as the genuine open ' +
    'content.',

  imp1245UpdatedRecommendation:
    'KEEP the expository unification (16.4 + 16.6 + 18.1 as corollaries of ' +
    'CDB-Exist; 18.2 SUBSUMED-BY-RH). This is correct on the structural ' +
    'logical level. BUT do NOT present CDB-Exist as a more tractable proof ' +
    'target than the originals -- it inherits the same Phi-non-circularity ' +
    'obstruction. Add the following technical clauses to the CDB-Exist ' +
    'statement: ' +
    '(1) cite Arov-Nudelman 1996 and Brodskii 1971 alongside classical KYP ' +
    '(Anderson-Vongpanitlerd 1973) to justify the infinite-dimensional ' +
    'passive-realization bridge needed for 18.1; ' +
    '(2) require simple-conservative class disambiguation (vs minimal- ' +
    'passive vs Pontryagin-passive) so 18.1 <=> 16.6 holds tightly; ' +
    '(3) require LIMIT-POINT-AT-INFINITY regularity of the canonical ' +
    'system at the right endpoint (de Branges 1968 Theorem XII); ' +
    '(4) require OUTER-FACTOR RIGIDITY of E_a (no inner factor) so the ' +
    'CDB-Exist => 16.4 implication identifies H(E_a) precisely (note: this ' +
    'rigidity is itself RH-equivalent on the Riemann side); ' +
    '(5) STATE EXPLICITLY in the paper that CDB-Exist is RH-equivalent and ' +
    'that the unification does not advance the proof programme -- the ' +
    'open content (non-circular Phi-built dm_a) is identical across the ' +
    'three originals and the unified statement. Reader should not be ' +
    'misled into thinking the unification is a strategic win.',

  diff: Object.freeze([
    'imp-1241 implied unification reduces open-conjecture COUNT (4 -> 1). ' +
      'imp-1245 confirms count reduction is real but adds: it does NOT ' +
      'reduce open-PROBLEM DIFFICULTY.',
    'imp-1241 cited Anderson-Vongpanitlerd 1973 + classical KYP. ' +
      'imp-1245 adds: cite Arov-Nudelman 1996 + Brodskii 1971 for the ' +
      'infinite-dimensional bridge.',
    'imp-1241 left class disambiguation (simple-conservative vs minimal- ' +
      'passive vs Pontryagin-passive) implicit. imp-1245 makes it explicit.',
    'imp-1241 unified statement said "Krein-Weyl transfer function after ' +
      'Cayley equals Theta_a". imp-1245 adds: outer-factor rigidity of E_a ' +
      'plus limit-point at infinity are needed to identify H(E_a) precisely.',
  ]),
});

// -- Export -----------------------------------------------------------------

export const IMP_1245_CDB_EXIST_STRESS_TEST = Object.freeze({
  id: 'imp-1245-cdb-exist-stress-test',
  ticket: 'imp-1245',
  parentTicket: 'imp-1241',
  auditDate: '2026-05-28',
  auditedByModel: 'opus-4-8',
  paper: 'twin_ladder_consolidated_v52.pdf',
  paperSections: Object.freeze(['para 16.4', 'para 16.7', 'para 18.1']),

  question:
    'Stress-test the imp-1241 CDB-Exist three-of-four unification along ' +
    'three axes: (a) does 18.1 actually reduce to canonical-system ' +
    'existence; (b) is the unified statement strong enough; (c) does the ' +
    'unification bypass the Phi-non-circularity obstruction?',

  perAxis: PER_AXIS,
  perAxisLookup: Object.freeze({
    'axis-a': AXIS_A,
    'axis-b': AXIS_B,
    'axis-c': AXIS_C,
  }),

  overall: OVERALL,
  recommendationUpdate: RECOMMENDATION_UPDATE,

  honestScope: Object.freeze([
    'This stress-test uses training-time knowledge only. No external ' +
      'browsing. The verdict that axis (c) fails is based on the textbook ' +
      'fact that the Krein-de Branges bijection direction E -> dm requires ' +
      'Hermite-Biehler E as input; for the Riemann E_a this is RH-equivalent.',
    'The verdict unification-holds-partially is the honest conclusion: the ' +
      'unification is a real structural insight (two axes pass) but does NOT ' +
      'advance the proof programme (axis c fails). The paper recommendation ' +
      'should reflect this distinction.',
    'A possible counterargument we considered: maybe a Phi-constructive dm ' +
      'could be built via finite-rank approximation dm^{(N)} converging to ' +
      'dm_a, with Hermite-Biehler verified at the limit. This was rejected ' +
      'because the limit theorem (de Branges 1968 chap 3, Remling 2002) ' +
      'requires uniform PSD of K_a^{(N)}, which is the same obstruction.',
    'A second counterargument considered: maybe the KYP-passivity framing ' +
      '(18.1) supplies a state-space Lyapunov-function route that ' +
      'circumvents the Hermite-Biehler hypothesis. This was rejected ' +
      'because passive realization of a candidate transfer function still ' +
      'requires the function to BE Schur, which for Theta_a is K_a PSD, ' +
      'which is RH. The state-space LMI does not bypass the Schur input ' +
      'requirement.',
    'Axes (a) and (b) verdicts are pass-with-caveats and pass-with-gaps ' +
      'respectively, not clean passes. The caveats and gaps are textbook ' +
      'and resolvable by additional citations / standing hypotheses in ' +
      'the unified statement. They do not threaten the unification.',
    'No empirical or numerical work is done in this audit; it is a pure ' +
      'adversarial review of a structural claim. Empirical verification ' +
      'of CDB-Exist would require constructing dm_a from Phi, which is ' +
      'precisely the open content.',
  ]),

  crossReferences: Object.freeze([
    'imp-1241: parent ticket -- original three-of-four unification claim',
    'imp-1218: paper-audit-dashboard',
    'imp-1231: original audit of 16.4 + 16.6 (PARTIALLY-RELATED)',
    'imp-1233: original audit of 18.1 + 18.2 (PARTIALLY-RELATED)',
    'imp-1232: 17.3 + 18.4 (ghost-absence, SUBSUMED-BY-RH)',
    'imp-1202: 15.4 Re(xi/xi) > 0 SUBSUMED-BY-RH via paired Hadamard',
    'imp-1258: pending -- does Conj 27.2 ||V|| <= 1 imply CDB-Exist? ' +
      'Future cross-bridge between sec 27 and CDB-Exist',
    'imp-1244: pending -- second-pass on the 7 SUBSUMED-BY-RH conjectures',
  ]),
});

export default IMP_1245_CDB_EXIST_STRESS_TEST;

// -- Build-time tripwires ---------------------------------------------------

export const IMP_1245_ASSERTIONS = [
  {
    id: 'imp1245-overall-verdict-is-unification-holds-partially',
    why:
      'Two of three axes pass with caveats / gaps and one fails (axis c). ' +
      'The honest overall verdict is unification-holds-partially. Anything ' +
      'else would either understate (failing on c without admitting the ' +
      'structural unification is real) or overstate (full pass without ' +
      'admitting the Phi-non-circularity obstruction is unchanged).',
    holds: () =>
      IMP_1245_CDB_EXIST_STRESS_TEST.overall.finalVerdict ===
      'unification-holds-partially',
  },
  {
    id: 'imp1245-three-axes-tracked',
    why:
      'The stress-test must cover exactly the three axes spelled out in the ' +
      'imp-1245 ticket: (a) reduction of 18.1, (b) implication strength, ' +
      '(c) non-circularity bypass. Adding or dropping one would misalign ' +
      'with the ticket scope.',
    holds: () => {
      const ids = IMP_1245_CDB_EXIST_STRESS_TEST.perAxis.map((a) => a.id);
      return (
        ids.length === 3 &&
        ids[0] === 'axis-a-18-1-reduces-to-canonical-system' &&
        ids[1] === 'axis-b-cdb-exist-implies-three-corollaries' &&
        ids[2] === 'axis-c-non-circularity-obstruction'
      );
    },
  },
  {
    id: 'imp1245-axis-c-is-the-failing-axis',
    why:
      'The named failure axis must be axis-c (Phi-non-circularity ' +
      'obstruction). Axes (a) and (b) both pass with caveats/gaps. ' +
      'Misidentifying the failure axis would mislead the paper recommendation.',
    holds: () => {
      const o = IMP_1245_CDB_EXIST_STRESS_TEST.overall;
      return (
        o.failureAxisName === 'axis-c-non-circularity-obstruction' &&
        o.axisResults['axis-c-non-circularity-obstruction'] === 'fail' &&
        o.axisResults['axis-a-18-1-reduces-to-canonical-system'] ===
          'pass-with-caveats' &&
        o.axisResults['axis-b-cdb-exist-implies-three-corollaries'] ===
          'pass-with-gaps'
      );
    },
  },
  {
    id: 'imp1245-axis-a-flags-arov-nudelman-missing-citation',
    why:
      'A central content finding of axis (a) is that imp-1241 cited only ' +
      'Anderson-Vongpanitlerd 1973 / classical KYP, missing Arov-Nudelman ' +
      '1996, which is the infinite-dimensional bridge needed for the ' +
      'KYP <-> de Branges identification. The caveat list must mention ' +
      'Arov-Nudelman 1996.',
    holds: () => {
      const txt = JSON.stringify(AXIS_A);
      return /Arov-Nudelman/.test(txt) && /1996/.test(txt);
    },
  },
  {
    id: 'imp1245-axis-b-flags-outer-factor-rigidity-gap',
    why:
      'A central content finding of axis (b) is that CDB-Exist => 16.4 ' +
      'requires outer-factor rigidity of E_a (inner-factor freedom) to ' +
      'identify H(E_a) precisely. This gap must be explicitly named in the ' +
      '16.4 implication walk.',
    holds: () => {
      const conj164 = AXIS_B.implicationWalk.find((w) => w.target === '16.4');
      if (!conj164) return false;
      const txt = JSON.stringify(conj164);
      return /outer.factor/i.test(txt) || /OUTER-FACTOR/.test(txt);
    },
  },
  {
    id: 'imp1245-axis-c-flags-bijection-circularity',
    why:
      'The axis (c) failure rationale must explicitly identify the source ' +
      'of the obstruction: the bijection direction E -> dm requires ' +
      'Hermite-Biehler input, which for Riemann E_a is RH-equivalent. ' +
      'Without this explicit identification, the failure verdict is opaque.',
    holds: () => {
      const txt = JSON.stringify(AXIS_C);
      return /Hermite-Biehler/.test(txt) && /bijection/i.test(txt) &&
        /RH-equivalent/.test(txt);
    },
  },
  {
    id: 'imp1245-recommendation-keeps-unification-but-clarifies-no-strategic-win',
    why:
      'The updated recommendation must KEEP the expository unification ' +
      '(axes a + b pass) but explicitly state that CDB-Exist is NOT a more ' +
      'tractable target than the originals (axis c fails). Dropping either ' +
      'half would misrepresent the stress-test conclusion.',
    holds: () => {
      const txt = RECOMMENDATION_UPDATE.imp1245UpdatedRecommendation;
      const keepsUnification = /KEEP/.test(txt) || /keep the expository/i.test(txt);
      const noStrategic = /do NOT present/i.test(txt) ||
        /not.*more tractable/i.test(txt) ||
        /not advance the proof programme/i.test(txt);
      return keepsUnification && noStrategic;
    },
  },
  {
    id: 'imp1245-honest-scope-discloses-training-time-and-counterarguments',
    why:
      'The honestScope array must disclose training-time-only methodology ' +
      'AND must address at least one considered counterargument (finite- ' +
      'rank limit, KYP-Lyapunov bypass) explicitly, so future readers can ' +
      'judge whether the axis (c) FAIL verdict was reached after honest ' +
      'consideration of escape routes.',
    holds: () => {
      const scope = IMP_1245_CDB_EXIST_STRESS_TEST.honestScope;
      if (!Array.isArray(scope) || scope.length < 4) return false;
      const joined = scope.join(' | ');
      return (
        /training-time|no external browsing/i.test(joined) &&
        /counterargument/i.test(joined)
      );
    },
  },
  {
    id: 'imp1245-cross-references-include-imp-1241',
    why:
      'The stress-test must cross-reference its parent imp-1241 to make ' +
      'the audit chain navigable.',
    holds: () => {
      const refs = IMP_1245_CDB_EXIST_STRESS_TEST.crossReferences.join(' | ');
      return refs.includes('imp-1241');
    },
  },
];
