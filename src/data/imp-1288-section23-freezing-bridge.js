// @module data/imp-1288-section23-freezing-bridge
// imp-1288 -- §23 freezing-bridge direct attack.
//
// MOTIVATION
// ----------
// Paper §23 (twin_ladder_consolidated_v52.pdf, freezing-bridge-section.js,
// imp-1221) is titled "Freezing, Bridge Renormalization, and a Targeted
// No-Ghost Attack". The 13-conjecture audit (waves 12-15) covered §15-22
// and §25-27 explicitly; §23 was rendered as a reference doc (imp-1221) but
// never directly opened as an INDEPENDENT closure route.
//
// The ticket framing posits §23 as "a freezing-bridge between Polymath15
// shock kinematics and the de Bruijn-flow asymptotic", adjacent to G6a
// (imp-1264 Polymath15 Lemma 5.2 shock-Lipschitz). This ticket's first job
// is to CHECK that framing against the actual paper text, then walk three
// routes (direct paper argument / HJB regularity à la Bourgain-Sinai 2009
// + Caffarelli-Vasseur 2010 / numerical bracket), and finally pin down the
// relationship to G6a.
//
// PRECISE §23 STATEMENT (quoted from freezing-bridge-section.js / imp-1221)
// ------------------------------------------------------------------------
// §23 is NOT a Polymath15 shock kinematics ↔ de Bruijn-flow bridge. It is
// the answer to "can freezing tools (Schur complement, endpoint bridges,
// coherent shells, Blaschke factors) REMOVE or RULE OUT the inverse-Blaschke
// ghost factor in the shifted bridge R_a(w) = X(w - a) / X(w + a) on the
// right half-plane, where X(w) = ξ(1/2 + w)?"
//
// The load-bearing subsection is §23.5 (Conjecture 23.5, Passive frozen-
// bridge closure):
//
//   For every a > 0 and every finite window W ⊂ C_+ there exists a
//   kernel-derived frozen bridge K^pass_{a,U} such that
//     (1) K^pass_{a,U} ⪰ 0 by construction (passive);
//     (2) ‖K_a − K^pass_{a,U}‖_{op(W)} is rigorously bounded;
//     (3) the positivity margin of K^pass_{a,U} dominates the residual
//         uniformly under W ↗ C_+, U → ∞, a ↓ 0.
//   Then K_a ⪰ 0 for every a > 0, hence RH.
//
// Auxiliary facts in §23 (Propositions 23.1-23.4):
//   §23.1 Ghost freezing is DIAGNOSTIC, not a proof (multiplication by
//         B_G(w) = ∏_{α ∈ G} (w-α)/(w+α) removes only the explicitly
//         enumerated ghost poles in G ⊆ P_a);
//   §23.2 Schur-complement freezing preserves negative index
//         ind_-(Q) = ind_-(C) + ind_-(Q_eff), Q_eff = A - B C^{-1} B^*
//         (Sylvester inertia);
//   §23.3 Finite-window positive certificate
//         λ_min(G^fr_{a,U}(Z)) > ‖E_{a,U}(Z)‖_2 ⇒ G_a(Z) ≻ 0 on the
//         sampled subspace;
//   §23.4 Frozen coherent-shell domination: m_U > ε_U on the FROZEN form
//         Q_{TL,U} dominating the tail T_U ⇒ no-ghost on H_W.
//
// §23.7 conclusion: freezing is an INERTIA-PRESERVING REDUCTION TOOL +
// FINITE-WINDOW CERTIFICATION ENGINE, NOT a proof shortcut. The proof
// target is the passive frozen-bridge closure (Conjecture 23.5).
//
// RELATIONSHIP TO G6a (imp-1264) — THE KEY QUESTION
// --------------------------------------------------
// G6a (imp-1264, imp-345, imp-354, imp-366, imp-394, imp-395) is the
// Polymath15 Lemma 5.2 Hölder-1/2 modulus
//
//     |τ_c(μ_1) − τ_c(μ_2)|  ≤  C_H · W_1(μ_1, μ_2)^{1/2},   C_H uniform in N
//
// for the first-collision time functional τ_c of the BACKWARD DYSON FLOW on
// REAL eigenvalue configurations near the limiting Burgers shock measure
// ρ_∞. The Hölder exponent 1/2 is FORCED by the Whitham 1974 §2.7 fold
// catastrophe; C_H = 1/8 is fixed by the rigorous Dyson two-particle
// constant d(g_min^2)/dt = -8 (imp-395).
//
// G6a's object: τ_c on R^N empirical measures, near a Burgers shock of
// the real Stieltjes density ρ_N. Tool: real Whitham fold + Privalov-
// Sokhotski (imp-394) + quadratic-tangency (imp-395).
//
// §23's object: K_a, K^pass_{a,U}, K_{R_a} on the SHIFTED BRIDGE
// R_a = X(w-a) / X(w+a) on the right half-plane C_+. Tool: Pontryagin
// negative-index / Schur-complement / Blaschke factor freezing /
// interval-arithmetic finite-window certification.
//
// VERDICT: independent-from-G6a. The two address STRUCTURALLY DIFFERENT
// obstructions:
//   - G6a controls a Hölder-1/2 modulus on a REAL functional of empirical
//     measures (analytic on the spectral side; PDE-regularity object).
//   - §23 controls operator-positivity (negative-index = 0) on a complex
//     reproducing kernel K_a on C_+ (operator-theoretic on the
//     reproducing-kernel side; ghost-counting object).
// Closing G6a does NOT close §23 (G6a closure leaves K_a positivity open;
// indeed imp-1232 confirms ind_-(K_{R_a}) = 0 is equivalent to RH).
// Closing §23 does NOT close G6a (a passive frozen-bridge closure gives
// K_a ⪰ 0 ⇒ RH but does NOT replace the Polymath15 Hölder modulus needed
// for the Lambda <= 3.06e-5 asymptotic bound). The objects sit in
// DIFFERENT layers of the program.
//
// THREE-ROUTE EVALUATION
// ----------------------
// (a) DIRECT (paper's own argument, §23.5 Conjecture 23.5):
//     VERDICT = open-conditional-on-passive-frozen-bridge-construction.
//     The paper EXPLICITLY records the closure conjecture as a conjecture,
//     not a theorem. The argument's load-bearing gap is the EXISTENCE of
//     K^pass_{a,U} (passive by construction, kernel-derived from Φ / γ /
//     prime-delay truncation, residual bounds surviving U → ∞, W ↗ C_+,
//     a ↓ 0). No such construction is exhibited in §23; the section is a
//     reduction theorem (no-ghost ⇔ passive frozen-bridge closure), not a
//     proof. Per §23.1 (Proposition 23.1, ghost freezing is diagnostic),
//     no choice of finite freezing set G ⊂ P_a removes the ghosts without
//     ALREADY KNOWING the off-critical zero set — i.e. without RH.
//
// (b) HJB REGULARITY (Bourgain-Sinai 2009 / Caffarelli-Vasseur 2010):
//     VERDICT = approach-not-applicable-to-section-23-object.
//     The HJB / De-Giorgi-iteration machinery (Caffarelli-Vasseur 2010
//     for parabolic HJB; Bourgain-Sinai 2009 for KPZ-class regularity)
//     applies to PDE solutions of Hamilton-Jacobi-Bellman equations with
//     viscosity. The §23 object is NOT a PDE solution — K_a is a
//     reproducing kernel on C_+ built from ξ. There is no Hamilton-
//     Jacobi-Bellman equation governing R_a or K_a. The HJB regularity
//     theorems DO NOT APPLY to operator-positivity on a Schur reproducing
//     kernel. They DO apply to imp-1264 G6a (where the underlying
//     continuum-Dyson equation is inviscid Burgers / real HJB) — but
//     even there imp-1264 ELIMINATES HJB as the wrong exponent
//     (Bourgain-Sinai 2/3 not 1/2) or wrong category (Caffarelli-Vasseur
//     requires viscosity). For §23, the HJB route is doubly inapplicable:
//     wrong object (operator-positivity vs PDE regularity) and wrong
//     category (no PDE).
//
// (c) NUMERICAL BRACKET (§23.6 practical experiment):
//     VERDICT = finite-window-falsifier-protocol-not-a-proof.
//     §23.6 specifies a 5-step pass/fail protocol: (1) fix a > 0 + window
//     W ⊂ C_+; (2) build the shifted bridge Gram G_a(Z) on a dense mesh
//     Z ⊂ W; (3) build a frozen approximation G^fr_{a,U}(Z); (4) interval-
//     arithmetic certify λ_min(G^fr_{a,U}) and ‖E_{a,U}‖_2; (5) track the
//     certified negative index ind_-(G_a(Z)). The protocol delivers a
//     FALSIFIER channel (a nonzero finite-window ind_- would be a ghost
//     witness ending RH negatively) and POSITIVE EVIDENCE for no-ghost on
//     a specific window, but does NOT close the proof (uniform exhaustion
//     U → ∞, W ↗ C_+, a ↓ 0 remains analytic). Empirical-bracket scripts
//     in scripts/compute-*.mjs target other observables (L-Volterra norms,
//     E_trunc grids, Gram eigenvalues for §15 shift-bridge); no §23.6
//     experiment has been executed yet (would be a separate ticket; see
//     imp-1221 sub-experiments).
//
// OVERALL VERDICT
// ---------------
// independent-from-G6a — §23 freezing-bridge addresses operator-positivity
// of the shifted bridge reproducing kernel K_a (negative-index ghost
// freezing on C_+), G6a addresses Hölder-1/2 modulus of the first-collision
// functional τ_c on real empirical Dyson configurations. Different objects,
// different tools, different layers of the program. Closing one does NOT
// close the other.
//
// §23 is OPEN (paper records Conj 23.5 as a conjecture) with three
// classified routes: direct (passive frozen-bridge construction needed),
// HJB (not applicable, wrong object category), numerical bracket (finite-
// window falsifier protocol, not a proof). The honest residual is the
// passive frozen-bridge construction (Conj 23.5) — derive K^pass_{a,U}
// from completed kernel Φ + γ + prime-delay truncations, automatically
// passive BEFORE any zero information is inserted.
//
// CROSS-REFERENCES
// ----------------
//   imp-1221 (freezing-bridge-section.js) -- §23 reference doc (§23.1-§23.7).
//   imp-1264 (imp-1264-polymath15-g6a-bridge-review.js) -- G6a review;
//             cited for the contrast (different object).
//   imp-1184 (imp-1184-direct-selberg-esy-route-audit.js) -- shared PCC
//             obstruction caveat for any Φ-built proof.
//   imp-1258 (imp-1258-volterra-cdb-bridge.js) -- two-way collapse
//             ‖V‖ ≤ 1 ⇔ CDB-Exist; passive frozen-bridge ⇒ K_a ⪰ 0 ⇒ ‖V‖ ≤ 1.
//   imp-1289 (imp-1289-section17-4-krein-langer-attack.js) -- §17.4
//             Krein-Langer EQUIVALENCE THEOREM; independent of §23 freezing.
//   imp-1232 (imp-1232-conjectures-17-3-18-4-audit.js) -- ind_-(K_{R_a}) = 0
//             ⇔ RH (Conj 17.3 SUBSUMED-BY-RH).

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';

// ── Precise §23 statement (quoted from imp-1221) ─────────────────────────
const SECTION_23_PRECISE_STATEMENT = Object.freeze({
  paperSection: '23',
  paperTitle: 'Freezing, Bridge Renormalization, and a Targeted No-Ghost Attack',
  paperPageRange: [32, 36],
  paperSource: PAPER_REF,

  shiftedBridge:
    'R_a(w) = X(w − a) / X(w + a),   X(w) = ξ(1/2 + w),   ℜw > 0.',

  loadBearingConjecture23_5:
    'For every a > 0 and every finite window W ⊂ C_+ there exists a kernel-' +
    'derived frozen bridge K^pass_{a,U} such that (1) K^pass_{a,U} ⪰ 0 by ' +
    'construction; (2) ‖K_a − K^pass_{a,U}‖_{op(W)} is rigorously bounded; ' +
    '(3) the positivity margin of K^pass_{a,U} dominates the residual ' +
    'uniformly under W ↗ C_+, U → ∞, a ↓ 0. Then K_a ⪰ 0 for every a > 0, ' +
    'hence RH.',

  auxiliaryFacts: Object.freeze([
    Object.freeze({
      id: '§23.1',
      name: 'Ghost freezing is DIAGNOSTIC, not a proof',
      statement:
        'For a finite ghost set G ⊆ P_a = { α = λ − a : X(λ) = 0, ℜλ > a }, ' +
        'B_G(w) = ∏_{α ∈ G} (w−α)/(w+α) removes only the explicitly enumerated ' +
        'ghost poles. G = P_a (total removal) is EQUIVALENT to knowing the ' +
        'off-critical zero set in advance.',
      verdict: 'diagnostic-not-proof',
    }),
    Object.freeze({
      id: '§23.2',
      name: 'Schur-complement freezing preserves negative index',
      statement:
        'For a Hermitian block Q = [[A, B], [B^*, C]] with C invertible, ' +
        'Q_eff = A − B C^{-1} B^*; then ind_-(Q) = ind_-(C) + ind_-(Q_eff) ' +
        '(Sylvester inertia). A ghost mode cannot be DESTROYED by freezing, ' +
        'only MOVED between blocks.',
      verdict: 'inertia-preserved-ghosts-move-not-vanish',
    }),
    Object.freeze({
      id: '§23.3',
      name: 'Finite-window positive certificate',
      statement:
        'On a finite mesh Z ⊂ C_+, λ_min(G^fr_{a,U}(Z)) > ‖E_{a,U}(Z)‖_2 ⇒ ' +
        'G_a(Z) ≻ 0 on the sampled subspace. Conversely a negative eigenvalue ' +
        'is a finite-window GHOST WITNESS.',
      verdict: 'finite-window-falsifier-channel',
    }),
    Object.freeze({
      id: '§23.4',
      name: 'Frozen coherent-shell domination',
      statement:
        'For Q_{TL,U}[h] ≥ m_U ‖h‖^2 (frozen finite-prime form) and ' +
        '|T_U[h]| ≤ ε_U ‖h‖^2 (tail) with ε_U < m_U on h ∈ H_W, no-ghost ' +
        'follows on H_W. Global proof needs uniform margins under U → ∞, ' +
        'W ↗ C_+, a ↓ 0.',
      verdict: 'finite-shell-numerics-meets-analytic-tail-burden',
    }),
  ]),

  conclusion23_7:
    'Freezing is an INERTIA-PRESERVING REDUCTION TOOL + FINITE-WINDOW ' +
    'CERTIFICATION ENGINE, NOT a proof shortcut. The proof target is the ' +
    'passive frozen-bridge closure (Conj 23.5) surviving U → ∞, W ↗ C_+, a ↓ 0.',

  citation: 'Twin-Ladder Consolidated v52, §23 (pp. 32-36).',
});

// ── Three-route evaluation ───────────────────────────────────────────────
const ROUTE_A_DIRECT_PAPER_ARGUMENT = Object.freeze({
  routeId: 'a-direct-section-23-passive-frozen-bridge',
  description:
    'Direct route: realise Conjecture 23.5 — construct a kernel-derived ' +
    'frozen bridge K^pass_{a,U} (passive by construction, derived from the ' +
    'completed kernel Φ + γ factor + prime-delay truncations) with rigorous ' +
    'residual bounds ‖K_a − K^pass_{a,U}‖_{op(W)} surviving U → ∞, W ↗ C_+, ' +
    'a ↓ 0.',
  verdict: 'open-conditional-on-passive-frozen-bridge-construction',
  paperGap:
    'No K^pass_{a,U} construction is exhibited in §23. The section is a ' +
    'REDUCTION THEOREM (no-ghost on the shifted bridge ⇔ passive frozen-bridge ' +
    'closure with the three properties), not a proof. Per §23.1 (Proposition ' +
    '23.1), no choice of finite freezing set G removes ghosts without already ' +
    'knowing the off-critical zero set.',
  whyConjectureNotTheorem:
    'The conjecture is NOT a restatement of RH PROVIDED K^pass_{a,U} and the ' +
    'residual bounds are constructed ONLY from the completed kernel Φ, the γ ' +
    'factor, and explicit prime-delay truncations. It WOULD become circular ' +
    'if the construction used the zero set or a pre-existing zero-free half-plane.',
  remainingWork: [
    'Exhibit a kernel-derived K^pass_{a,U} (no zero data) that is passive by construction.',
    'Establish ‖K_a − K^pass_{a,U}‖_{op(W)} → 0 as W ↗ C_+, U → ∞, a ↓ 0.',
    'Confirm the positivity margin of K^pass_{a,U} dominates the residual uniformly.',
  ],
  citationStack: Object.freeze([
    'Twin-Ladder Consolidated v52 §23.5 (Conj 23.5, Passive frozen-bridge closure).',
    'de Branges 1968 (Hilbert Spaces of Entire Functions): K_a reproducing kernel.',
    'Krein-Langer 1973/77 (S^κ class): ind_- (K_{R_a}) = #{ζ-zeros with ℜλ > a}.',
    'Feshbach 1958 (Schur-complement reduction): §23.2 Sylvester inertia.',
  ]),
});

const ROUTE_B_HJB_REGULARITY = Object.freeze({
  routeId: 'b-hjb-regularity-bourgain-sinai-caffarelli-vasseur',
  description:
    'Alternative route via Hamilton-Jacobi-Bellman regularity (Bourgain-Sinai ' +
    '2009 KPZ class; Caffarelli-Vasseur 2010 parabolic HJB with viscosity, ' +
    'De Giorgi iteration). The same machinery considered for imp-1264 G6a.',
  verdict: 'approach-not-applicable-to-section-23-object',
  whyNotApplicable:
    'HJB / De-Giorgi regularity controls Hölder regularity of PDE SOLUTIONS ' +
    '(viscous HJB with bounded RHS). The §23 object is OPERATOR POSITIVITY ' +
    '(ind_- = 0) of the reproducing kernel K_a on C_+ — not a PDE solution. ' +
    'There is no Hamilton-Jacobi-Bellman equation governing R_a(w) = ' +
    'X(w−a)/X(w+a) or its kernel K_a. The HJB regularity theorems DO NOT ' +
    'APPLY to negative-index counting on a Schur reproducing kernel; the ' +
    'category mismatch is total.',
  contrastWithG6a:
    'For imp-1264 G6a, HJB at least targets the right CATEGORY (real PDE ' +
    'regularity for the inviscid-Burgers shock of τ_c), but is eliminated ' +
    'for SHARPNESS reasons: Bourgain-Sinai 2009 gives wrong exponent 2/3, ' +
    'Caffarelli-Vasseur 2010 requires viscosity (inviscid Burgers does not ' +
    'satisfy the De Giorgi hypotheses). For §23 the elimination is more ' +
    'fundamental: the category itself is wrong (operator-positivity vs ' +
    'PDE regularity).',
  citationStack: Object.freeze([
    'Bourgain-Sinai 2009 (KPZ class regularity): wrong category for §23.',
    'Caffarelli-Vasseur 2010 (parabolic HJB via De Giorgi): wrong category for §23.',
    'imp-1264 (Polymath15 G6a bridge review): HJB elimination context.',
  ]),
});

const ROUTE_C_NUMERICAL_BRACKET = Object.freeze({
  routeId: 'c-numerical-bracket-via-section-23-6-five-step-protocol',
  description:
    'Numerical bracket via §23.6 5-step pass/fail protocol: build G_a(Z) on a ' +
    'dense mesh Z ⊂ W ⊂ C_+, build frozen approximation G^fr_{a,U}(Z), ' +
    'interval-certify λ_min(G^fr_{a,U}) and ‖G_a − G^fr_{a,U}‖_2, track ' +
    'certified negative index ind_-(G_a(Z)).',
  verdict: 'finite-window-falsifier-protocol-not-a-proof',
  whatItDelivers:
    'A pass/fail FALSIFIER channel — a nonzero finite-window ind_- would be ' +
    'an explicit ghost witness ending RH negatively; persistent zero index ' +
    'supports no-ghost on the sampled window. Same kind of pass/fail ' +
    'certification used for zero-transfer windows.',
  whyNotAProof:
    'The protocol is a finite-window certification. Global proof requires ' +
    'UNIFORM exhaustion U → ∞, W ↗ C_+, a ↓ 0 — pure analytic work, not ' +
    'numerics. Numerics can FALSIFY (a found ghost ends RH); it cannot CLOSE.',
  empiricalBracketStatus:
    'Existing scripts/compute-*.mjs target other observables (L-Volterra ' +
    'norms, E_trunc grids, Gram eigenvalues for §15 shift-bridge). No §23.6 ' +
    'experiment has been executed yet; would be a separate ticket sized to ' +
    'the dense-mesh + interval-arithmetic budget.',
  fiveSteps: Object.freeze([
    'Fix a > 0 and a rectangle W ⊂ C_+.',
    'Build the shifted bridge Gram matrix G_a(Z) on a dense mesh Z ⊂ W.',
    'Build a frozen kernel / prime-shell approximation G^fr_{a,U}(Z) using Hermite-Gaussian or endpoint-jet bridge data.',
    'Interval-certify λ_min(G^fr_{a,U}) and ‖G_a(Z) − G^fr_{a,U}(Z)‖_2.',
    'Track certified ind_-(G_a(Z)). Nonzero = ghost witness; persistent zero = no-ghost support on W.',
  ]),
});

// ── Relationship to G6a (imp-1264) — the key question ────────────────────
const RELATIONSHIP_TO_G6A = Object.freeze({
  g6aObject:
    'τ_c (first-collision time) on R^N empirical Dyson configurations near ' +
    'the limiting Burgers shock measure ρ_∞; controlled by a Hölder-1/2 ' +
    'modulus |τ_c(μ_1) − τ_c(μ_2)| ≤ C_H · W_1(μ_1, μ_2)^{1/2}.',

  section23Object:
    'K_a, K^pass_{a,U}, K_{R_a} on the shifted bridge R_a(w) = X(w−a)/X(w+a) ' +
    'on the right half-plane C_+; controlled by operator-positivity ' +
    '(ind_-(K_a) = 0 ⇔ no off-critical zeros with horizontal displacement > a).',

  g6aTools:
    'Real Whitham 1974 §2.7 fold catastrophe (forces exponent 1/2) + ' +
    'Privalov-Sokhotski real-boundary fold (imp-394) + quadratic-tangency ' +
    'C_H = 1/8 from rigorous Dyson constant d(g^2)/dt = -8 (imp-395).',

  section23Tools:
    'Pontryagin negative-index counting (Krein-Langer 1973/77) + Schur-' +
    'complement Sylvester inertia + Blaschke factor freezing (§23.1-§23.2) + ' +
    'interval-arithmetic finite-window certification (§23.3, §23.6).',

  g6aLayer:
    'PDE / analytic-number-theory layer (Dyson Burgers shock kinematics, ' +
    'continuum-limit empirical measure, W_1 distance, Hölder modulus).',

  section23Layer:
    'Operator / reproducing-kernel layer (shifted bridge Schur kernel, ' +
    'negative-index counting, finite Gram eigenvalues, ghost frozen by ' +
    'Blaschke factors).',

  doesG6aImplySection23:
    'NO. G6a delivers a Hölder-1/2 modulus for τ_c uniform in N. This ' +
    'controls the τ_c → Λ asymptotic chain (imp-345 / imp-1264) but says ' +
    'nothing about ind_-(K_{R_a}). G6a closure leaves K_a ⪰ 0 (i.e. ' +
    'ind_-(K_a) = 0) entirely OPEN — indeed imp-1232 confirms ind_-(K_{R_a}) ' +
    '= #{X-zeros with ℜλ > a}, equivalent to RH.',

  doesSection23ImplyG6a:
    'NO. Conj 23.5 (Passive frozen-bridge closure) ⇒ K_a ⪰ 0 ∀a > 0 ⇒ RH. ' +
    'It does NOT deliver a Hölder modulus for τ_c on Dyson empirical measures; ' +
    'the Polymath15 Lemma 5.2 modulus needed for Lambda ≤ 3.06e-5 is ' +
    'untouched. (Closing §23 closes RH directly, which formally implies G6a ' +
    'trivially — but this is the trivial implication "RH ⇒ anything", not a ' +
    'structural reduction.)',

  whyIndependentNotEquivalent:
    'The objects, tools, and layers all differ. Closing G6a does NOT close ' +
    '§23; the §23 question (operator-positivity on C_+) survives. Closing ' +
    '§23 closes RH, which formally implies G6a only via the trivial ' +
    'implication "RH ⇒ Polymath15 Lemma 5.2 is conditional on conditions ' +
    'that include RH-conditional input". The honest reading is INDEPENDENT.',

  verdict: 'independent-from-G6a',
  verdictRationale:
    'Different objects (τ_c vs K_a), different tools (Whitham fold + ' +
    'Privalov-Sokhotski vs Pontryagin / Schur-complement / interval ' +
    'arithmetic), different layers (PDE / empirical-measure vs operator / ' +
    'reproducing-kernel). Neither implies the other structurally. The ticket ' +
    'framing "freezing-bridge between Polymath15 shock kinematics and the ' +
    'de Bruijn-flow asymptotic" was based on adjacency hypothesis; on direct ' +
    'inspection of §23 the freezing-bridge is operator-theoretic, not PDE-' +
    'theoretic, and is independent of G6a.',
});

// ── Verdict ──────────────────────────────────────────────────────────────
const ALLOWED_VERDICTS = Object.freeze([
  'equivalent-to-G6a',
  'strictly-stronger-than-G6a',
  'strictly-weaker-than-G6a',
  'independent-from-G6a',
]);

const VERDICT = 'independent-from-G6a';

const VERDICT_RATIONALE =
  '§23 freezing-bridge controls operator-positivity (ind_- = 0) of the ' +
  'shifted bridge reproducing kernel K_a on C_+; G6a controls a Hölder-1/2 ' +
  'modulus of the first-collision functional τ_c on real Dyson empirical ' +
  'measures. Different objects, different tools, different layers. Neither ' +
  'implies the other structurally. The ticket framing of §23 as a ' +
  '"Polymath15 ↔ de Bruijn-flow freezing-bridge" was based on adjacency ' +
  'hypothesis; on direct inspection of §23 (paper pp. 32-36 / freezing-' +
  'bridge-section.js) the §23 object is ghost-freezing on R_a, not shock ' +
  'kinematics on τ_c. Honest verdict: independent-from-G6a.';

// ── Cross-references ─────────────────────────────────────────────────────
const CROSS_REFERENCES = Object.freeze([
  Object.freeze({
    ticket: 'imp-1221',
    role: '§23 reference doc — source of the §23.1-§23.7 statements quoted here',
    path: 'src/data/freezing-bridge-section.js',
  }),
  Object.freeze({
    ticket: 'imp-1264',
    role: 'Polymath15 G6a shock-Lipschitz bridge review — the comparison object',
    path: 'src/data/imp-1264-polymath15-g6a-bridge-review.js',
  }),
  Object.freeze({
    ticket: 'imp-1184',
    role: 'Shared Montgomery PCC obstruction — caveat for any Φ-built proof',
    path: 'src/data/imp-1184-direct-selberg-esy-route-audit.js',
  }),
  Object.freeze({
    ticket: 'imp-1258',
    role: 'Two-way collapse ‖V‖ ≤ 1 ⇔ CDB-Exist; passive frozen-bridge ⇒ K_a ⪰ 0 ⇒ ‖V‖ ≤ 1',
    path: 'src/data/imp-1258-volterra-cdb-bridge.js',
  }),
  Object.freeze({
    ticket: 'imp-1289',
    role: '§17.4 Krein-Langer EQUIVALENCE THEOREM (κ = 0 ⇔ K_a ⪰ 0); ' +
      'parallels the §23 ind_- = 0 ⇔ no-ghost statement',
    path: 'src/data/imp-1289-section17-4-krein-langer-attack.js',
  }),
  Object.freeze({
    ticket: 'imp-1232',
    role: 'Conj 17.3 (B_a^+ ≡ 1) SUBSUMED-BY-RH — establishes ind_-(K_{R_a}) ≡ RH',
    path: 'src/data/imp-1232-conjectures-17-3-18-4-audit.js',
  }),
  Object.freeze({
    ticket: 'imp-394',
    role: 'G6a-sub-hyperbolic Privalov-Sokhotski closure — example of G6a-side tools',
    path: 'src/data/g6a-sub-hyperbolic-closure.js',
  }),
  Object.freeze({
    ticket: 'imp-395',
    role: 'G6a-sub-constant C_H = 1/8 — example of G6a-side rigorous constant',
    path: 'src/data/g6a-sub-constant-value.js',
  }),
]);

// ── Honest scope ─────────────────────────────────────────────────────────
const HONEST_SCOPE = Object.freeze([
  'The §23 statements quoted here are sourced from freezing-bridge-section.js ' +
    '(imp-1221, rendered Twin-Ladder Consolidated v52 §23 pp. 32-36). The ' +
    'paper PDF itself was not re-read for this ticket; the §23 wording is ' +
    'mediated by the imp-1221 reference doc.',
  'The verdict "independent-from-G6a" is a STRUCTURAL reading based on the ' +
    'category mismatch between operator-positivity (§23) and PDE Hölder ' +
    'regularity (G6a). It is NOT a proof of structural independence — a ' +
    'future ticket could discover a hidden bridge (e.g. via a microlocal ' +
    'reading of K_a in terms of the de Bruijn flow). The current honest ' +
    'reading is independence.',
  'Bourgain-Sinai 2009 and Caffarelli-Vasseur 2010 are training-time recall. ' +
    'Their elimination for §23 is structural (wrong category: not a PDE) and ' +
    'does not depend on exact theorem numbers.',
  'Krein-Langer 1973/77 negative-index / S^κ class theory is training-time ' +
    'recall (cf. imp-1289). The ind_-(K_{R_a}) = #{ X-zeros with ℜλ > a } ' +
    'identity is the §17.4 statement (imp-1232 audit) and is taken as given.',
  'The HJB elimination (Route b) is CATEGORICALLY different from the imp-1264 ' +
    'HJB elimination. For imp-1264 G6a, HJB at least targets the right ' +
    'category (PDE regularity) but is eliminated for sharpness; for §23, HJB ' +
    'targets the wrong category entirely (no PDE governs K_a).',
  'PCC obstruction (imp-1184): any Φ-built unconditional closure of §23 ' +
    'still faces the Montgomery pair-correlation barrier at 2-point. This ' +
    'is structural, not specific to §23.',
  'The "passive frozen-bridge construction" remaining work (Route a) is ' +
    'the conjectural part of §23.5. No K^pass_{a,U} construction is offered ' +
    'in this ticket; the route is classified, not closed.',
  'No §23.6 numerical experiment is executed in this ticket. The 5-step ' +
    'protocol is recorded for a future sibling ticket sized to dense-mesh + ' +
    'interval-arithmetic certification of λ_min(G^fr_{a,U}) and ‖E_{a,U}‖_2.',
]);

// ── Export ───────────────────────────────────────────────────────────────
export const IMP_1288_SECTION23_FREEZING_BRIDGE = Object.freeze({
  id: 'imp-1288-section23-freezing-bridge',
  ticket: 'imp-1288',
  generatedAt: '2026-05-28T23:30:00Z',
  paperSourcePath: PAPER_REF,
  paperSection: '§23',

  question:
    'Is the §23 freezing-bridge equivalent to Polymath15 G6a (imp-1264), or ' +
    'strictly stronger/weaker, or independent? What does a direct attack on ' +
    '§23 deliver via (a) the paper argument, (b) HJB regularity (Bourgain-' +
    'Sinai 2009 / Caffarelli-Vasseur 2010), and (c) numerical bracket from ' +
    'scripts/compute-*.mjs?',

  oneLine:
    'INDEPENDENT-FROM-G6a — §23 controls operator-positivity (ind_- = 0) of ' +
    'the shifted bridge reproducing kernel K_a on C_+; G6a controls a Hölder-' +
    '1/2 modulus of τ_c on real Dyson empirical measures. Different objects, ' +
    'different tools, different layers.',

  sectionStatement: SECTION_23_PRECISE_STATEMENT,

  routes: Object.freeze({
    a_directPaperArgument: ROUTE_A_DIRECT_PAPER_ARGUMENT,
    b_hjbRegularity: ROUTE_B_HJB_REGULARITY,
    c_numericalBracket: ROUTE_C_NUMERICAL_BRACKET,
  }),

  relationshipToG6a: RELATIONSHIP_TO_G6A,

  verdict: VERDICT,
  verdictRationale: VERDICT_RATIONALE,
  allowedVerdicts: ALLOWED_VERDICTS,

  crossReferences: CROSS_REFERENCES,
  honestScope: HONEST_SCOPE,
});

export default IMP_1288_SECTION23_FREEZING_BRIDGE;

// ── Tripwires (8+ required) ──────────────────────────────────────────────
export const IMP_1288_SECTION23_FREEZING_BRIDGE_ASSERTIONS = [
  {
    id: 'imp1288-verdict-is-one-of-allowed-strings',
    why:
      'The verdict must be drawn from the explicit four-element vocabulary ' +
      '{equivalent-to-G6a, strictly-stronger-than-G6a, strictly-weaker-than-G6a, ' +
      'independent-from-G6a}. Drift would put the §23↔G6a classification ' +
      'outside the agreed scheme.',
    holds: () =>
      IMP_1288_SECTION23_FREEZING_BRIDGE.allowedVerdicts.includes(
        IMP_1288_SECTION23_FREEZING_BRIDGE.verdict,
      ),
  },
  {
    id: 'imp1288-verdict-is-independent-from-g6a',
    why:
      'The structural argument is: §23 is operator-positivity on K_a (C_+ ' +
      'reproducing kernel layer); G6a is Hölder-1/2 modulus on τ_c (real ' +
      'Dyson empirical-measure layer). Neither implies the other structurally. ' +
      'A different verdict here means the ticket conclusion has drifted from ' +
      'the file body.',
    holds: () =>
      IMP_1288_SECTION23_FREEZING_BRIDGE.verdict === 'independent-from-G6a',
  },
  {
    id: 'imp1288-section-23-statement-quoted-with-key-tokens',
    why:
      'The §23 quoted statement (paper-mediated via imp-1221) must mention ' +
      'the shifted bridge R_a = X(w−a)/X(w+a), the load-bearing Conj 23.5 ' +
      '(passive frozen-bridge closure K^pass_{a,U} ⪰ 0 with residual bounds ' +
      'surviving U → ∞, W ↗ C_+, a ↓ 0), and the §23.7 conclusion that ' +
      'freezing is a reduction tool / certification engine not a proof shortcut.',
    holds: () => {
      const s = IMP_1288_SECTION23_FREEZING_BRIDGE.sectionStatement;
      if (!s) return false;
      const sb = s.shiftedBridge;
      const conj = s.loadBearingConjecture23_5;
      const concl = s.conclusion23_7;
      return (
        typeof sb === 'string' &&
        sb.includes('X(w − a)') &&
        sb.includes('X(w + a)') &&
        sb.includes('ξ(1/2 + w)') &&
        typeof conj === 'string' &&
        conj.includes('K^pass_{a,U}') &&
        conj.includes('kernel-derived') &&
        conj.includes('U → ∞') &&
        conj.includes('W ↗ C_+') &&
        conj.includes('a ↓ 0') &&
        typeof concl === 'string' &&
        concl.includes('INERTIA-PRESERVING REDUCTION TOOL') &&
        concl.includes('FINITE-WINDOW CERTIFICATION ENGINE') &&
        s.paperSection === '23' &&
        s.paperSource.includes('twin_ladder_consolidated_v52')
      );
    },
  },
  {
    id: 'imp1288-section-23-auxiliary-facts-cover-23-1-through-23-4',
    why:
      '§23 has four named auxiliary results before Conj 23.5: §23.1 ' +
      '(Proposition: ghost freezing is diagnostic), §23.2 (Schur-complement ' +
      'Sylvester inertia), §23.3 (finite-window positive certificate), §23.4 ' +
      '(frozen coherent-shell domination). All four must be quoted with their ' +
      'verdict tags so the §23 surface is not collapsed to the headline Conj 23.5.',
    holds: () => {
      const facts = IMP_1288_SECTION23_FREEZING_BRIDGE.sectionStatement.auxiliaryFacts;
      if (!Array.isArray(facts) || facts.length !== 4) return false;
      const expectedIds = ['§23.1', '§23.2', '§23.3', '§23.4'];
      const ids = facts.map((f) => f.id);
      if (JSON.stringify(ids) !== JSON.stringify(expectedIds)) return false;
      return facts.every(
        (f) =>
          typeof f.id === 'string' &&
          typeof f.name === 'string' &&
          f.name.length >= 10 &&
          typeof f.statement === 'string' &&
          f.statement.length >= 80 &&
          typeof f.verdict === 'string' &&
          f.verdict.length >= 10,
      );
    },
  },
  {
    id: 'imp1288-three-routes-evaluated-with-verdicts',
    why:
      'The ticket promises three routes (a) direct paper argument; (b) HJB ' +
      'regularity Bourgain-Sinai 2009 / Caffarelli-Vasseur 2010; (c) ' +
      'numerical bracket via §23.6 5-step protocol. Each must have a routeId, ' +
      'description, verdict, and at least one substantive analysis field.',
    holds: () => {
      const r = IMP_1288_SECTION23_FREEZING_BRIDGE.routes;
      if (!r || !r.a_directPaperArgument || !r.b_hjbRegularity || !r.c_numericalBracket) {
        return false;
      }
      const routes = [r.a_directPaperArgument, r.b_hjbRegularity, r.c_numericalBracket];
      const verdictsExpected = [
        'open-conditional-on-passive-frozen-bridge-construction',
        'approach-not-applicable-to-section-23-object',
        'finite-window-falsifier-protocol-not-a-proof',
      ];
      for (let i = 0; i < routes.length; i++) {
        const rt = routes[i];
        if (typeof rt.routeId !== 'string' || rt.routeId.length < 10) return false;
        if (typeof rt.description !== 'string' || rt.description.length < 60) return false;
        if (rt.verdict !== verdictsExpected[i]) return false;
      }
      return true;
    },
  },
  {
    id: 'imp1288-relationship-to-g6a-is-independent',
    why:
      'The KEY question of this ticket is the §23 ↔ G6a relationship. The ' +
      'record must explicitly state that G6a does NOT imply §23 and §23 does ' +
      'NOT imply G6a (the formal RH-implies-anything caveat is acknowledged), ' +
      'name the different objects (τ_c vs K_a), tools (Whitham/Privalov-' +
      'Sokhotski/quadratic-tangency vs Pontryagin/Schur/interval-arithmetic), ' +
      'and layers (PDE / empirical-measure vs operator / reproducing-kernel), ' +
      'and carry the verdict independent-from-G6a.',
    holds: () => {
      const rel = IMP_1288_SECTION23_FREEZING_BRIDGE.relationshipToG6a;
      if (!rel) return false;
      const substantiveKeys = [
        'g6aObject',
        'section23Object',
        'g6aTools',
        'section23Tools',
        'g6aLayer',
        'section23Layer',
        'doesG6aImplySection23',
        'doesSection23ImplyG6a',
        'whyIndependentNotEquivalent',
        'verdictRationale',
      ];
      for (const k of substantiveKeys) {
        if (typeof rel[k] !== 'string' || rel[k].length < 40) return false;
      }
      if (typeof rel.verdict !== 'string' || rel.verdict.length < 10) return false;
      return (
        rel.verdict === 'independent-from-G6a' &&
        rel.doesG6aImplySection23.includes('NO') &&
        rel.doesSection23ImplyG6a.includes('NO') &&
        rel.g6aObject.includes('τ_c') &&
        rel.section23Object.includes('K_a') &&
        rel.g6aTools.includes('Whitham') &&
        rel.section23Tools.includes('Pontryagin')
      );
    },
  },
  {
    id: 'imp1288-cites-four-or-more-sources-with-primary-and-de-branges',
    why:
      'The ticket requires 4+ source citations across routes. The citation ' +
      'stacks must include the v52 paper primary source, de Branges 1968 for ' +
      'the reproducing kernel K_a, Krein-Langer 1973/77 for ind_- counting, ' +
      'and Bourgain-Sinai 2009 / Caffarelli-Vasseur 2010 for the HJB elimination.',
    holds: () => {
      const stacks = [
        IMP_1288_SECTION23_FREEZING_BRIDGE.routes.a_directPaperArgument.citationStack,
        IMP_1288_SECTION23_FREEZING_BRIDGE.routes.b_hjbRegularity.citationStack,
      ];
      const all = stacks.flat();
      const requiredSubstrings = [
        'Twin-Ladder Consolidated v52',
        'de Branges 1968',
        'Krein-Langer 1973/77',
        'Bourgain-Sinai 2009',
        'Caffarelli-Vasseur 2010',
      ];
      for (const sub of requiredSubstrings) {
        if (!all.some((c) => typeof c === 'string' && c.includes(sub))) return false;
      }
      return all.length >= 4;
    },
  },
  {
    id: 'imp1288-cross-references-include-imp-1264-and-imp-1184',
    why:
      'Per ticket spec, cross-references must include imp-1264 (G6a — the ' +
      'comparison object) and imp-1184 (shared PCC obstruction caveat). ' +
      'imp-1221 (§23 reference doc) must also be cited as the source of the ' +
      '§23 quoted statements.',
    holds: () => {
      const xref = IMP_1288_SECTION23_FREEZING_BRIDGE.crossReferences;
      if (!Array.isArray(xref) || xref.length < 5) return false;
      const tickets = xref.map((x) => x.ticket);
      const required = ['imp-1221', 'imp-1264', 'imp-1184', 'imp-1258', 'imp-1232'];
      for (const t of required) {
        if (!tickets.includes(t)) return false;
      }
      return xref.every(
        (x) =>
          typeof x.ticket === 'string' &&
          typeof x.role === 'string' &&
          x.role.length >= 30 &&
          typeof x.path === 'string',
      );
    },
  },
  {
    id: 'imp1288-hjb-route-is-not-applicable-with-correct-rationale',
    why:
      'The HJB route (Bourgain-Sinai 2009 / Caffarelli-Vasseur 2010) for §23 ' +
      'is structurally inapplicable (wrong CATEGORY: no PDE governs K_a). ' +
      'This is different from imp-1264 G6a HJB elimination (right category, ' +
      'eliminated for sharpness). The route record must capture the category-' +
      'mismatch rationale explicitly, and must contrast with imp-1264.',
    holds: () => {
      const b = IMP_1288_SECTION23_FREEZING_BRIDGE.routes.b_hjbRegularity;
      if (!b) return false;
      return (
        b.verdict === 'approach-not-applicable-to-section-23-object' &&
        typeof b.whyNotApplicable === 'string' &&
        b.whyNotApplicable.length >= 100 &&
        b.whyNotApplicable.includes('OPERATOR POSITIVITY') &&
        b.whyNotApplicable.includes('PDE') &&
        b.whyNotApplicable.includes('category mismatch') &&
        typeof b.contrastWithG6a === 'string' &&
        b.contrastWithG6a.length >= 100 &&
        b.contrastWithG6a.includes('imp-1264')
      );
    },
  },
  {
    id: 'imp1288-numerical-bracket-five-steps-recorded',
    why:
      'The §23.6 practical experiment is a 5-step pass/fail protocol. The ' +
      'fiveSteps array on route (c) must contain exactly five substantive ' +
      'entries so the protocol is recorded for a future sibling ticket.',
    holds: () => {
      const c = IMP_1288_SECTION23_FREEZING_BRIDGE.routes.c_numericalBracket;
      if (!c) return false;
      if (!Array.isArray(c.fiveSteps) || c.fiveSteps.length !== 5) return false;
      return c.fiveSteps.every(
        (step) => typeof step === 'string' && step.length >= 30,
      );
    },
  },
  {
    id: 'imp1288-honest-scope-flags-training-recall-and-pcc',
    why:
      'The honest-scope record must flag: (1) the §23 statements are mediated ' +
      'by imp-1221 (paper PDF not re-read), (2) HJB references Bourgain-Sinai ' +
      '/ Caffarelli-Vasseur are training-time recall, (3) the PCC obstruction ' +
      '(imp-1184) is still binding for any Φ-built closure, (4) no §23.6 ' +
      'numerical experiment is executed in this ticket. Drift on any of these ' +
      'would inflate the ticket beyond its scope.',
    holds: () => {
      const scope = IMP_1288_SECTION23_FREEZING_BRIDGE.honestScope;
      if (!Array.isArray(scope) || scope.length < 5) return false;
      const allText = scope.join(' ');
      return (
        scope.every((s) => typeof s === 'string' && s.length >= 60) &&
        allText.includes('imp-1221') &&
        allText.includes('Bourgain-Sinai') &&
        allText.includes('Caffarelli-Vasseur') &&
        allText.includes('PCC') &&
        allText.includes('imp-1184') &&
        allText.includes('§23.6')
      );
    },
  },
];
