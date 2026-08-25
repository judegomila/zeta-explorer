/**
 * @module animations-index
 * @fileoverview Index of rendered (Manim) animations for the /animations page.
 *
 * Each entry is one finished video walkthrough. Unlike the interactive
 * /visualizations pages, these are pre-rendered films: fixed narratives over
 * the same mathematics the app documents. Local files live under
 * public/animations/ (served from the site root); external entries point at
 * their canonical host.
 *
 * Honesty note carried from the site's grading system: the twin-ladder bridge
 * film presents an RH-EQUIVALENT reformulation (§15 shift-bridge positivity),
 * not a result; the Λ ≤ 0.1787854 film presents an unreviewed computer-assisted
 * candidate, not an established theorem. Each entry carries a `grade` string
 * shown as a badge so the films cannot be mistaken for stronger claims.
 *
 * **What this file exports**
 * - `ANIMATIONS_INDEX` — frozen list consumed by src/pages/AnimationsPage.jsx.
 * - `ANIMATIONS_INDEX_ASSERTIONS` — build-time tripwires auto-discovered by
 *   scripts/run-assertions.mjs.
 */

export const ANIMATIONS_INDEX = Object.freeze([
  Object.freeze({
    id: 'four-gate-lambda',
    watchOrder: 2,
    category: 'The Λ program',
    title: 'Λ ≤ 0.1758354 — the four-gate barrier certificate',
    grade: 'computer-assisted candidate — unrefereed, not SOTA; Λ ≤ 0.2 remains the benchmark',
    accent: '#f5c542',
    videoSrc: '/animations/four-gate-lambda.mp4',
    posterSrc: '/animations/four-gate-lambda-poster.jpg',
    external: false,
    durationLabel: '2 min 27 s · 1080p60 · Manim CE',
    description:
      'The project’s current headline candidate, filmed from ' +
      '/lambda-01758354-candidate: a revised mollifier and an extended ' +
      'finite lane (5.3×10⁶ windows, vs 3,149,013 in the 0.1787854 package) ' +
      'certify four independent gates — finite lane, tail D < 1 ' +
      '(Euler–Maclaurin, closing only after extending the verified height ' +
      'to N* = 6×10⁶), barrier reuse (monotone in t), and the y-transfer ' +
      'excision budget B ≈ 2.5×10⁻⁴ against an available margin of ' +
      '1.87×10⁻³. Includes the honest hard part: naive termwise ' +
      'monotonicity is false (double cancellations), fixed by ' +
      'profile-sector cells that dissolve an apparent 2²⁸⁷ enumeration ' +
      'into 20,546 explicit profiles. The reduction is Lean-checked, the ' +
      'gates are Arb interval computations — and neither step is a referee.',
    scenes: [
      'Title — candidate, unrefereed, not SOTA',
      'Where the number sits (the Λ number line)',
      'The method: a mollified barrier, sharpened twice',
      'The certificate: four gates, four Arb verdicts',
      'Gates 1 & 2 — the longer lane, and the tail that would not close',
      'Gate 4 — monotonicity is false; the excision budget',
      'The verification stack — and what it is not',
      'Status ledger',
      'Closing — RH ⟺ Λ ≤ 0 still open',
    ],
    relatedRoutes: [
      { to: '/lambda-01758354-candidate', label: 'The four-gate certificate' },
      { to: '/newman-lambda-01787854-candidate', label: 'The 0.1787854 package' },
      { to: '/lambda-bounds', label: 'Λ bounds ledger' },
    ],
  }),
  Object.freeze({
    id: 'flow-blindness',
    watchOrder: 5,
    category: 'Theorems & no-gos',
    title: 'Flow-Blindness — soft hypotheses cannot prove RH',
    grade: 'unconditional no-go theorem — rests only on Rodgers–Tao Λ ≥ 0',
    accent: '#ff6b6b',
    videoSrc: '/animations/flow-blindness.mp4',
    posterSrc: '/animations/flow-blindness-poster.jpg',
    external: false,
    durationLabel: '1 min 41 s · 1080p60 · Manim CE',
    description:
      'Lemma SL2, filmed from /flow-blindness-no-go: damping the de Bruijn ' +
      'profile by a Gaussian, Φ_ε = e^(−εu²)Φ, keeps every soft property ' +
      '(even, positive, log-concave, doubly-exponential decay) — yet its ' +
      'cosine transform is the BACKWARD flow Ξ_ε = H_{−ε}, and since ' +
      '−ε < 0 ≤ Λ (Rodgers–Tao) it has a non-real zero for every ε > 0. ' +
      'So no flow-invariant hypothesis can force “all zeros real”: the T3 ' +
      'strip ladder (E_a(z) = Ξ(z+ia); T3(a) ∀a>0 = RH, machine-checked to ' +
      '1.0×10⁻³⁰ / 1.1×10⁻¹⁵) is unreachable by soft means, and a proof must ' +
      'add the property the flow destroys — the exact arithmetic identity ' +
      'Ξ = c·ξ(½+i·), i.e. Euler-product / Weil-positivity input. Newman’s ' +
      '“only barely so,” upgraded from aphorism to formal no-go.',
    scenes: [
      'Title — an unconditional no-go',
      'The soft class the positivity apparatus assumes',
      'The move: damp the profile (every checkmark stays lit)',
      'The twist: the damping is the backward heat flow',
      'The no-go, and what “T3” really is',
      'What a proof must add: arithmetic',
      'Scope — retires a family of strategies, does not settle RH',
    ],
    relatedRoutes: [
      { to: '/flow-blindness-no-go', label: 'Flow-blindness no-go (SL2)' },
      { to: '/shift-bridge-positivity', label: 'Shift-Bridge Positivity (§15)' },
      { to: '/frozen-rung-pt-equivalence', label: 'Frozen-rung ⟺ PT (the twin result)' },
    ],
  }),
  Object.freeze({
    id: 'colliding-zeros',
    watchOrder: 3,
    category: 'The Λ program',
    title: 'Zeros as Colliding Particles',
    grade: 'established mechanism (the Λ ≤ 0.2 path) — proxy visuals illustrative, prove nothing about Λ',
    accent: '#3ddbd9',
    videoSrc: '/animations/colliding-zeros.mp4',
    posterSrc: '/animations/colliding-zeros-poster.jpg',
    external: false,
    durationLabel: '1 min 32 s · 1080p60 · Manim CE',
    description:
      'The mechanical heart of the Λ story: under the backward Dyson flow ' +
      'dγ_n/dt = −2Σ 1/(γ_n−γ_k) real zeros attract, and a collision at t_c ' +
      'certifies Λ ≤ |t_c| — the bookkeeping inside the Polymath 15 / ' +
      'Platt–Trudgian computation (RK4 + Kahan, collision threshold 10⁻⁴; ' +
      'the Lehmer pair near index 453 collides around t ≈ 0.9 at N = 50). ' +
      'Then the exact side: ċ_k = −(k+1)(k+2)c_{k+2} is exactly integrable ' +
      'on polynomials, the canonical pair z² − (1+2t) collides at t = −½ and ' +
      'departs as a conjugate pair, and the Lehmer preset shows the tight ' +
      'pair leaving first. Ends on the page’s own caveat: a polynomial proxy, ' +
      'not ξ — not a bound, not evidence.',
    scenes: [
      'Title', 'Backward Dyson attraction', 'The verifier and the Λ ≤ 0.2 path',
      'The exact coefficient flow', 'The canonical bifurcation at t = −½',
      'The Lehmer preset', 'Caveat — proxy, not ξ',
    ],
    relatedRoutes: [
      { to: '/dyson-verifier', label: 'Dyson verifier' },
      { to: '/debruijn-departure', label: 'De Bruijn departure' },
    ],
  }),
  Object.freeze({
    id: 'obstruction-seam',
    watchOrder: 9,
    category: 'Theorems & no-gos',
    title: 'The Obstruction Seam',
    grade: 'anatomy of the obstruction — not a proof of anything; PT Λ ≤ 0.2 stays SOTA · NO QED',
    accent: '#f5c542',
    videoSrc: '/animations/obstruction-seam.mp4',
    posterSrc: '/animations/obstruction-seam-poster.jpg',
    external: false,
    durationLabel: '1 min 32 s · 1080p60 · Manim CE',
    description:
      'The meta-verdict of 2026-07-16: a 16-angle adversarial assault on the ' +
      'two load-bearing walls (the C_H shock modulus; wide-support Montgomery ' +
      'pair correlation), every angle killed by ≥2 skeptics at ≥0.82 ' +
      'confidence. Each route splits at one seam — the provable half is ' +
      'inert (on-basin, mesoscopic, |α| ≤ 1, finite height), the sufficient ' +
      'half is RH-hard (a uniform sub-½ zero-free strip of half-width δ ' +
      'gives Λ ≤ 2δ², but producing one is RH-grade), and the overlap is ' +
      'provably empty. The 2023–26 literature (BGST, Guth–Maynard, TTY, ' +
      'Michalowski) all lands on the inert side. Thesis: the gap between ' +
      'provable and sufficient IS the Riemann Hypothesis.',
    scenes: [
      'Title', 'Two load-bearing walls', 'Every route splits at the same seam',
      'The bracket at its sharpest', 'The literature lands inert',
      'PROVABLE ∩ SUFFICIENT = ∅ · NO QED',
    ],
    relatedRoutes: [
      { to: '/obstruction-seam', label: 'The obstruction seam' },
      { to: '/what-we-know', label: 'What we know' },
    ],
  }),
  Object.freeze({
    id: 'theta-trap',
    watchOrder: 7,
    category: 'Theorems & no-gos',
    title: 'The Θ-Trap Theorems',
    grade: 'unconditional theorems on the particle-flow model — not about Λ or RH; optimistic extension refuted',
    accent: '#b58cff',
    videoSrc: '/animations/theta-trap.mp4',
    posterSrc: '/animations/theta-trap-poster.jpg',
    external: false,
    durationLabel: '1 min 34 s · 1080p60 · Manim CE',
    description:
      'The project’s cleanest new algebra on the attractive Calogero–Moser ' +
      'flow: with Θ = g²E/2 and the exact pair identity dg/ds = −(4/g)(1−Θ), ' +
      'Theorem A makes Θ ≤ ¼ an unconditional forward-invariant trap (sharp ' +
      'at the symmetric triplet; Corollary A1: t_c(N) ≤ g_min(0)²/6). ' +
      'Theorem B locates the true threshold in closed form via ' +
      'r(2r²+7r−3) ≤ 0: Θ_b = (√73−5)/8 = 0.443000…, with the measured ' +
      'dΘ/ds sign flip (−0.0176 → 0 → +0.0339) landing exactly on it. The ' +
      'optimistic absolute trap is refuted on (0.443, 0.5073) by the family ' +
      'x = {−d, 0, 1, 1+d} (d = 1.05 → +0.1378), but excursions are ' +
      're-trapped: symmetric cap exactly ½, dressed ≈ 0.5073, isolation ' +
      'onset c* = √(2+√3)−1. Real zeta-zero rows measure Θ(0) = 0.167, ' +
      '0.088, 0.046 — far below every rung.',
    scenes: [
      'Title', 'The gap, its environment, and Θ', 'Theorem A: the ¼ trap',
      'Theorem B: the threshold in closed form', 'The refuted band',
      'Where the real zeros sit', 'The ladder · closing',
    ],
    relatedRoutes: [
      { to: '/theorem-b-threshold', label: 'Theorem B threshold' },
      { to: '/spectral-attack', label: 'Spectral attack (Θ explorer)' },
    ],
  }),
  Object.freeze({
    id: 'collapse-chain',
    watchOrder: 8,
    category: 'Theorems & no-gos',
    title: 'The Collapse Chain and the 5000× Mirage',
    grade: 'RH-equivalent reformulation — refuted as a reduction; the 5000× margin is an artifact',
    accent: '#3ddbd9',
    videoSrc: '/animations/collapse-chain.mp4',
    posterSrc: '/animations/collapse-chain-poster.jpg',
    external: false,
    durationLabel: '1 min 22 s · 1080p60 · Manim CE',
    description:
      'The best honest-science story in the program: the §15–27 apparatus ' +
      'compresses into ‖V_{a,Φ}‖ ≤ 1 ∀a>0 through an 11-link chain of ' +
      'genuine theorems with exactly one load-bearing §27 link. Pilot ' +
      'numerics put 25 truncated norms 5000× below threshold — then the ' +
      'scale dial exposed it: ‖V‖ scales as c² (measured exponent 2.0000), ' +
      'min-eig(I−VV*) goes +0.029 → −119 → −1.2×10⁶ at c = 30/100/1000 ' +
      'while K_a stays PSD at every c. The biconditional is refuted as a ' +
      'reduction (a cone cannot be a ball); the survivor ' +
      '‖R‖ ≤ 1 ⟺ K_a ⪰ 0 is exactly RH-equivalent. Λ ≤ 0.2 stands.',
    scenes: [
      'Title', 'Eleven links, one central claim', 'The seductive number',
      'Turn the scale dial', 'The verdict: artifact, not evidence',
      'Lessons · closing',
    ],
    relatedRoutes: [
      { to: '/collapse-chain', label: 'The collapse chain' },
      { to: '/hidden-square-program', label: 'Hidden-square program' },
    ],
  }),
  Object.freeze({
    id: 'ghost-freeze',
    watchOrder: 6,
    category: 'Twin ladder & twistor geometry',
    title: 'The Ghost That Cannot Be Frozen',
    grade: 'kernel computation & inertia lemma are theorems; ghost absence ∀a>0 is Conjecture 17.3 — RH-equivalent',
    accent: '#ff6b6b',
    videoSrc: '/animations/ghost-freeze.mp4',
    posterSrc: '/animations/ghost-freeze-poster.jpg',
    external: false,
    durationLabel: '1 min 20 s · 1080p60 · Manim CE',
    description:
      '§17 + §23 combined: an off-critical zero ρ = ½+δ+iγ with δ > a puts ' +
      'a pole of R_a(w) = X(w−a)/X(w+a) at α = (δ−a)+iγ in the right ' +
      'half-plane — the inverse Blaschke factor whose kernel ' +
      'K_S = −k_α(z)k̄_α(w) carries exactly one rank-one negative square ' +
      '(weight −2(δ−a); demo defaults δ=0.10, γ=14.13, a=0.05). ' +
      'Krein–Langer counts ghosts by the negative index. Then §23’s squeeze: ' +
      'Sylvester inertia ind₋(Q) = ind₋(C) + ind₋(Q_eff) — a freeze can move ' +
      'the negative mode between blocks but never destroy it. Verdict: NO, ' +
      'a clever freeze cannot finish. All four closure routes funnel to ' +
      'B_a⁺ ≡ 1 ∀a>0 ⟺ RH; carries the page’s coprime-cancellation caveat.',
    scenes: [
      'Title', 'The mirror wall and the ghost', 'One ghost = one negative square',
      'The Schur-complement squeeze', 'Verdict NO · the four-route funnel',
      'Closing — the indestructible witness',
    ],
    relatedRoutes: [
      { to: '/blaschke-ghosts', label: 'Blaschke ghosts (§17)' },
      { to: '/freezing-bridge', label: 'Freezing bridge (§23)' },
    ],
  }),
  Object.freeze({
    id: 'twistor-lift2',
    watchOrder: 11,
    category: 'Twin ladder & twistor geometry',
    title: 'The Twistor Lift, Part II — the consistency-preserving construction',
    grade: 'research architecture (paper-faithful) — no RH claim, no new Λ bound',
    accent: '#b58cff',
    videoSrc: '/animations/twistor-lift2.mp4',
    posterSrc: '/animations/twistor-lift2-poster.jpg',
    external: false,
    durationLabel: '≈ 4½ min · 1080p60 · Manim CE',
    description:
      'The long-form, step-by-step construction from the paper “A ' +
      'Consistency-Preserving Twistor Framework for the Zeta Twin Ladder” ' +
      '(J. Gomila, 23 Aug 2026), which corrects the toy picture: the naive ' +
      'prime-rung bridge is not canonical (only the completed reflection ' +
      'Rξ = ξ is exact); the exact ℓ²(𝓘) prime-power ladder with trace ' +
      'identities Tr(De^{−sA}) = −ζ′/ζ and Tr(N⁻¹e^{−sA}) = log ζ; the ' +
      'bicomplex thickening 𝔹 = ℂe₊ ⊕ ℂe₋ with physical slice s₋ = 1 − s₊ ' +
      '(a choice, not a consequence); the standard double fibration and ' +
      'local Penrose class in H¹(Z_U, O(−2)); the incidence variety ' +
      'F(1,3;T) with CP² fibers, making the intertwiner a kernel transform ' +
      '𝓘_K, not a point map; the decisive square 𝓘_K F₊ = F₋ R as a design ' +
      'requirement; the logical-status ledger; heat flow, Duhamel freeze–thaw ' +
      'errors, the Rouché zero-exclusion collar; and the five open problems ' +
      'P1–P5.',
    scenes: [
      'Title — an architecture, not a proof',
      '§1 The naive picture, and two corrections',
      '§2 The exact prime-power ladder (trace identities)',
      '§2 Completion, and the exact reflection Rξ = ξ',
      '§3 Bicomplex thickening (choice, not consequence)',
      '§4.1 The standard twistor correspondence',
      '§4.2 The local scalar Penrose class',
      '§4.3 Dual twistors and the incidence variety',
      '§5 The decisive square 𝓘_K F₊ = F₋ R',
      'Table 1 — the logical status of every layer',
      '§6 Heat flow, freeze–thaw, and the Rouché collar',
      '§7–8 Five problems, one target',
    ],
    relatedRoutes: [
      { to: '/twistor', label: 'Twistor Duality (the toy picture)' },
      { to: '/shift-bridge-positivity', label: 'Shift-Bridge Positivity (§15)' },
      { to: '/twin-ladder', label: 'Twin Ladder Explorer' },
    ],
  }),
  Object.freeze({
    id: 'twistor-lift',
    watchOrder: 10,
    category: 'Twin ladder & twistor geometry',
    title: 'The Twistor Lift',
    grade: 'geometric reformulation (toy encoding) — the framework alone cannot prove RH',
    accent: '#ec4899',
    videoSrc: '/animations/twistor-lift.mp4',
    posterSrc: '/animations/twistor-lift-poster.jpg',
    external: false,
    durationLabel: '1 min 56 s · 1080p60 · Manim CE',
    description:
      'The twin ladder lifted into Penrose twistor geometry: the direct and ' +
      'dual ladders ζ(s), ζ(1−s) become a twistor / dual-twistor pair ' +
      'Z^α = (σ−½, t/2π, cos(t log 2), sin(t log 2)) and its s → 1−s mirror ' +
      'W_α, coupled by the bridge χ(s) acting as intertwiner I: Z ↦ W. The ' +
      'symplectic pairing reduces to Z·W = 2(σ−½)cos(t log 2), so the ' +
      'critical line becomes the incidence locus Z·W = 0; |χ| = 1 on the ' +
      'line makes the intertwiner unitary (rank drop det M(s) = 0 exactly ' +
      'there), and the Euler product plays the Penrose transform. Includes ' +
      'the page’s own caveats: the spurious cos(t log 2) roots of the ' +
      'p = 2-only toy encoding, and the Davenport–Heilbronn warning that ' +
      'functional-equation geometry alone cannot decide RH.',
    scenes: [
      'Title — σ = ½ ⟷ Z·W = 0',
      'The dictionary: twin ladder → twistor geometry',
      'Lifting s into twistor space (building Z)',
      'The dual twistor: the functional-equation mirror',
      'Incidence: the critical line as a geometric locus',
      'The intertwiner: the bridge as a twistor map',
      'The Penrose transform: Euler product as contour integral',
      'What it does and does not establish · closing',
    ],
    relatedRoutes: [
      { to: '/twistor', label: 'Twistor Duality' },
      { to: '/twin-ladder', label: 'Twin Ladder Explorer' },
      { to: '/proof-checker', label: 'Proof Checker (Davenport–Heilbronn)' },
    ],
  }),
  Object.freeze({
    id: 'twin-ladder-bridge',
    watchOrder: 4,
    category: 'Twin ladder & twistor geometry',
    title: 'The Twin-Ladder Bridge',
    grade: 'RH-equivalent reformulation — not a proof, not a new bound',
    accent: '#b58cff',
    videoSrc: '/animations/twin-ladder-bridge.mp4',
    posterSrc: '/animations/twin-ladder-bridge-poster.jpg',
    external: false,
    durationLabel: '2 min 00 s · 1080p60 · Manim CE',
    description:
      'The shift-bridge positivity picture of §15, filmed: every prime ' +
      'carries a ladder of rungs (log p)·p^(−m/2)·e^(−iTm log p); recentering ' +
      'ξ as X(w) := ξ(½ + w) turns the functional equation into evenness ' +
      'X(w) = X(−w) and RH into Δ := sup |Re λ| = 0; the shifted bridge ' +
      '(E_a, E_a^#, Θ_a, K_a) converts that into positivity at every bridge ' +
      'thickness a > 0, with the threshold theorem (strict diagonal ' +
      'positivity iff a ≥ Δ), the Gödelian ghost witness z_ρ(a) = −γ + i(δ − a), ' +
      'and the a → 0⁺ prime-delay domination limit Re(ξ′/ξ) > 0 on σ > ½.',
    scenes: [
      'Title — RH ⟺ Δ = 0 ⟺ K_a ⪰ 0 for all a > 0',
      'Every prime carries a ladder (rung phasors as T turns)',
      'Recenter ξ on the critical line: X(w), packets, Δ',
      'The shift-bridge between the twin ladders (the a-dial)',
      'The threshold theorem: positivity starts exactly at Δ',
      'The ghost witness inside the bridge',
      'The a → 0⁺ limit: prime-delay domination',
      'Closing — zero bridge-thickness',
    ],
    relatedRoutes: [
      { to: '/shift-bridge-positivity', label: 'Shift-Bridge Positivity (§15)' },
      { to: '/twin-ladder', label: 'Twin Ladder Explorer' },
      { to: '/blaschke-ghosts', label: 'Blaschke Ghosts (§17)' },
    ],
  }),
  Object.freeze({
    id: 'zetasota',
    watchOrder: 1,
    category: 'The Λ program',
    title: 'Λ ≤ 0.1787854 — the proof steps, animated',
    grade: 'unreviewed computer-assisted candidate — not an established theorem',
    accent: '#f5c542',
    videoSrc: 'https://www.judegomila.com/assets/zetasota/zetasota.mp4',
    posterSrc: 'https://www.judegomila.com/assets/zetasota/poster.jpg',
    external: true,
    externalPage: 'https://www.judegomila.com/assets/zetasota/index.html',
    durationLabel: '2 min 35 s · 1080p60 · Manim CE',
    description:
      'The de Bruijn–Newman candidate bound walked end to end: Euler product ' +
      'to Riemann’s ξ(s), the Polymath 15 normalization H₀(z) = ⅛ξ(½ + iz/2), ' +
      'the heat flow H_t and zero-pair landing law t ≈ y²/2, Theorem 1.2’s ' +
      'three checks at (X, t₀, y₀), the exact rational arithmetic to ' +
      '893,927/5,000,000 = 0.1787854, the certification margins, and the ' +
      'historical squeeze from de Bruijn’s ½ to today.',
    scenes: [
      'Title — Λ ≤ 0.1787854, RH ⟺ Λ ≤ 0',
      'From ζ(s) to Riemann’s ξ(s)',
      'The Polymath 15 normalization H₀',
      'De Bruijn’s heat flow and the landing law',
      'Theorem 1.2: three checks',
      'The exact parameters and the arithmetic',
      'Certifying the three checks',
      'Seventy-six years of squeezing Λ · closing',
    ],
    relatedRoutes: [
      { to: '/newman-lambda-01787854-candidate', label: 'The 0.1787854 candidate' },
      { to: '/lambda-bounds', label: 'Λ bounds' },
    ],
  }),
]);

export default ANIMATIONS_INDEX;

// ── Build-time tripwires ─────────────────────────────────────────────────────

export const ANIMATIONS_INDEX_ASSERTIONS = [
  {
    id: 'animations-index-watch-order-permutation',
    holds: () => {
      const ns = ANIMATIONS_INDEX.map((a) => a.watchOrder).sort((x, y) => x - y);
      return ns.length === ANIMATIONS_INDEX.length &&
        ns.every((n, i) => n === i + 1);
    },
    why:
      'The /animations page renders in curated watch order. watchOrder must ' +
      'be a permutation of 1..N — a duplicate or gap would silently scramble ' +
      'or drop cards from the viewing sequence.',
  },
  {
    id: 'animations-index-entries-complete',
    holds: () =>
      Array.isArray(ANIMATIONS_INDEX) &&
      ANIMATIONS_INDEX.length >= 2 &&
      ANIMATIONS_INDEX.every(
        (a) =>
          typeof a.id === 'string' &&
          typeof a.title === 'string' &&
          typeof a.grade === 'string' &&
          a.grade.length >= 20 &&
          typeof a.videoSrc === 'string' &&
          typeof a.posterSrc === 'string' &&
          typeof a.description === 'string' &&
          a.description.length >= 200 &&
          Array.isArray(a.scenes) &&
          a.scenes.length >= 6 &&
          Array.isArray(a.relatedRoutes) &&
          a.relatedRoutes.length >= 1 &&
          a.relatedRoutes.every(
            (r) => typeof r.to === 'string' && r.to.startsWith('/') &&
                   typeof r.label === 'string'
          )
      ),
    why:
      'The /animations index must list both films with a substantive ' +
      'description (>= 200 chars), a scene list, at least one internal ' +
      'related route, and a non-trivial honesty grade. A stub regression ' +
      'would ship an empty gallery or strip the evidence-grading badge.',
  },
  {
    id: 'animations-index-honesty-grades-present',
    holds: () => {
      const tl = ANIMATIONS_INDEX.find((a) => a.id === 'twin-ladder-bridge');
      const zs = ANIMATIONS_INDEX.find((a) => a.id === 'zetasota');
      return (
        !!tl && !!zs &&
        tl.grade.includes('RH-equivalent') &&
        tl.grade.includes('not a proof') &&
        zs.grade.includes('candidate') &&
        zs.grade.includes('not an established theorem') &&
        tl.external === false &&
        tl.videoSrc === '/animations/twin-ladder-bridge.mp4' &&
        zs.external === true &&
        zs.videoSrc.startsWith('https://www.judegomila.com/')
      );
    },
    why:
      'The two films carry the same evidence-grading discipline as the rest ' +
      'of the site: the bridge film is an RH-equivalent reformulation and must ' +
      'say so; the 0.1787854 film is an unreviewed candidate and must say so. ' +
      'The local/external split (and the local public/ path) must not drift, ' +
      'or the player breaks silently.',
  },
];
