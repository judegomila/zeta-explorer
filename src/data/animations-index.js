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
    watchOrder: 6,
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
    watchOrder: 4,
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
    watchOrder: 16,
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
    watchOrder: 10,
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
    watchOrder: 12,
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
    watchOrder: 7,
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
    id: 'lambda-history',
    watchOrder: 3,
    category: 'The Λ program',
    title: 'Seventy-Six Years of Λ',
    grade: 'evidence-graded history — solid rows are theorems; dashed rows are labeled claims and candidates',
    accent: '#f5c542',
    videoSrc: '/animations/lambda-history.mp4',
    posterSrc: '/animations/lambda-history-poster.jpg',
    external: false,
    durationLabel: '44 s · 1080p60 · Manim CE',
    description:
      'Every bound in the timeline module, graded: the lower-bound climb (−50' +
      ' in 1988 through −1.14541×10⁻¹¹ in 2011) to Rodgers–Tao’s floor Λ ≥ 0;' +
      ' the upper squeeze ½ → 0.22 → 0.2 (peer-reviewed); the dashed 2026 cla' +
      'ims (0.1965 and 0.1875 unrefereed; 0.1787854 and 0.1758354 candidates)' +
      '; and the struck-through retraction of the 3.06×10⁻⁵ framing. The modu' +
      'le’s own rule on screen: inspect accepted before calling anything a th' +
      'eorem.',
    scenes: [
      'Title — RH ⟺ Λ = 0, graded',
      'The climb from below (seven lower bounds)',
      'The squeeze from above (solid vs dashed)',
      'The retraction · the solid interval [0, 0.2]',
    ],
    relatedRoutes: [
      { to: '/lambda-bounds', label: 'Λ bounds ledger' },
      { to: '/history', label: 'History' },
    ],
  }),
  Object.freeze({
    id: 'route-b-limsup',
    watchOrder: 11,
    category: 'The Λ program',
    title: 'Route B: the Limsup Claim and Its Audit',
    grade: 'PARTIAL — rigorous modulo one named gap (finite-N collision-formula validity); not unconditional as first advertised',
    accent: '#4da6ff',
    videoSrc: '/animations/route-b-limsup.mp4',
    posterSrc: '/animations/route-b-limsup-poster.jpg',
    external: false,
    durationLabel: '58 s · 1080p60 · Manim CE',
    description:
      'The flagship almost-theorem, limsup |t_c(N)| = 0, built from the Koksm' +
      'a–Hlawka bound with y_N♯ = √(2π/N) and Selberg’s |S(T)| as the only an' +
      'alytic input — and its public downgrade: the Burgers surrogate τ_c = 1' +
      '/(2 sup Im m) fails at pole scale, falsified at N = 2 where the exact ' +
      't_c = g²/8 breaks it for g > 2.66. The audit table on screen: what is ' +
      'established (the discrepancy bound; the Dyson min-gap monotonicity lem' +
      'ma), what is open (the G5 residual), and the word that was retracted.',
    scenes: [
      'Title — the claim and the verdict',
      'Koksma–Hlawka and the Selberg input',
      'The surrogate that cracked (the N = 2 falsifier)',
      'The audit ledger',
      'Closing — Λ ≤ 0.2 unaffected',
    ],
    relatedRoutes: [
      { to: '/route-b-limsup', label: 'Route B limsup' },
    ],
  }),
  Object.freeze({
    id: 'pt-floor',
    watchOrder: 14,
    category: 'The Λ program',
    title: 'What Actually Binds Λ ≤ 0.2',
    grade: 'diagnostic audit — verdict CONFIRM: the verified height binds; produces no bound, NO QED',
    accent: '#3ddbd9',
    videoSrc: '/animations/pt-floor.mp4',
    posterSrc: '/animations/pt-floor-poster.jpg',
    external: false,
    durationLabel: '43 s · 1080p60 · Manim CE',
    description:
      'The sensitivity audit of the Λ ≤ 0.2 floor: three legs — verified heig' +
      'ht X = 3×10¹², barrier slack (corridor margin 1.23), AFE tail (margin ' +
      '≈ 1.047) — of which only the height is load-bearing. The margin table ' +
      'runs 10,880 down to 0.14 with the failing cells traced to a ~170×-loos' +
      'er engine, not an analytic wall; six barrier-tightening attacks die ag' +
      'ainst non-binding slack; and the one real lever — Λ ≤ 0.19 needs X = 2' +
      '×10¹³ — is a computation (mesh cost logarithmic in height), not a tric' +
      'k.',
    scenes: [
      'Title — three legs, one binder',
      'The floor and its legs',
      'The margin table and the engine ceiling',
      'The lever and its price',
    ],
    relatedRoutes: [
      { to: '/pt-floor-audit', label: 'PT floor sensitivity audit' },
    ],
  }),
  Object.freeze({
    id: 'closure-routes',
    watchOrder: 8,
    category: 'Twin ladder & twistor geometry',
    title: 'Four Roads to the Same Wall (§16)',
    grade: 'Theorem 16.1 equivalence established; every route RH-equivalent and open — no shortcut',
    accent: '#4da6ff',
    videoSrc: '/animations/closure-routes.mp4',
    posterSrc: '/animations/closure-routes-poster.jpg',
    external: false,
    durationLabel: '45 s · 1080p60 · Manim CE',
    description:
      'The four closure routes — A Schur contractivity, B de Branges positivi' +
      'ty K_a ⪰ 0 ∀a>0, C the hidden-square factorization, D the Weil/twin-la' +
      'dder quadratic form — drawn as four cards converging on Δ = 0 ⟺ RH, wi' +
      'th Theorem 16.1 making them provably equivalent. Includes the 5,656-po' +
      'int sweep (max ratio 0.99990759 at σ = 0.51, a = 0.1, zero failures, f' +
      'alling to 0.97738 at σ = 3) and the circularity loop that explains why' +
      ' Route A cannot bootstrap itself: the sweep supports, and can never pr' +
      'ove.',
    scenes: [
      'Title — provably equivalent, all open',
      'A, B, C, D — one bottleneck',
      'The numerical sweep',
      'The circularity loop',
    ],
    relatedRoutes: [
      { to: '/closure-routes', label: 'Closure routes (§16)' },
      { to: '/shift-bridge-positivity', label: 'Shift-Bridge (§15)' },
    ],
  }),
  Object.freeze({
    id: 'three-attacks',
    watchOrder: 9,
    category: 'Twin ladder & twistor geometry',
    title: 'Three Attacks on Ghost Absence (§18)',
    grade: 'corrected audit — I rejected as stated; II finite model; III RH-equivalent target; nothing proves RH',
    accent: '#ff6b6b',
    videoSrc: '/animations/three-attacks.mp4',
    posterSrc: '/animations/three-attacks-poster.jpg',
    external: false,
    durationLabel: '59 s · 1080p60 · Manim CE',
    description:
      'Section 18 with the corrected audit on screen: Attack I (kernel passiv' +
      'ity) is REJECTED AS STATED — the proposed Gram-sum is a sum of squares' +
      ', positive whether or not RH holds, a detector that always says yes; A' +
      'ttack II (prime-delay domination, Re X′/X > 0 on the right half-plane)' +
      ' is a FINITE MODEL, with the retracted mis-normalized surrogate pivot ' +
      'acknowledged; Attack III (the Krein–Langer/Pontryagin index) is the RH' +
      '-EQUIVALENT TARGET, with index tracking that reads 0 across the grid a' +
      'nd jumps to 1 for an injected off-line zero, exactly as it must.',
    scenes: [
      'Title — the corrected scoreboard',
      'Attack I: rejected as stated',
      'Attack II: finite model',
      'Attack III: the index target',
      'Closing — the wall still standing',
    ],
    relatedRoutes: [
      { to: '/three-attacks', label: 'Three attacks (§18)' },
      { to: '/blaschke-ghosts', label: 'Blaschke ghosts (§17)' },
    ],
  }),
  Object.freeze({
    id: 'frozen-rung-pt',
    watchOrder: 13,
    category: 'Twin ladder & twistor geometry',
    title: 'Frozen Rungs ⟺ Platt–Trudgian',
    grade: 'inertia half: proven theorem · full equivalence: one open lemma · a reformulation, not a new bound — NO QED',
    accent: '#b58cff',
    videoSrc: '/animations/frozen-rung-pt.mp4',
    posterSrc: '/animations/frozen-rung-pt-poster.jpg',
    external: false,
    durationLabel: '44 s · 1080p60 · Manim CE',
    description:
      'The operator certificate and the classical zero count are the same obj' +
      'ect: ind₋(K_{R_a}) counts exactly the ξ-zeros with Re λ > a, so RH ⟺ i' +
      'ndex zero at every shift. The proven inertia half shows passive frozen' +
      ' rungs can NEVER beat Platt–Trudgian; the winding-form identity equate' +
      's the PT/Turing count with the certificate; lemma L1 (tail leakage) is' +
      ' plausibly provable, L2 (mesh detection) genuinely open. The dial land' +
      's exactly on 0.1787854 and 0.2 — no improvement, because it is the sam' +
      'e count. The only genuine lever is verified height.',
    scenes: [
      'Title',
      'The index counts off-strip zeros',
      'One theorem half, one open lemma',
      'The dial lands on the known rows',
    ],
    relatedRoutes: [
      { to: '/frozen-rung-pt-equivalence', label: 'Frozen-rung ⟺ PT' },
      { to: '/pt-floor-audit', label: 'What binds the floor' },
    ],
  }),
  Object.freeze({
    id: 'mollified-barrier',
    watchOrder: 15,
    category: 'Theorems & no-gos',
    title: 'The Mollified Barrier and the Zero-Gain Theorem',
    grade: 'formalization infrastructure — matches PT, provably cannot beat it; no bound, NO QED',
    accent: '#f5c542',
    videoSrc: '/animations/mollified-barrier.mp4',
    posterSrc: '/animations/mollified-barrier-poster.jpg',
    external: false,
    durationLabel: '56 s · 1080p60 · Manim CE',
    description:
      'The sole survivor of a 79-agent adversarial review of 22 candidates: a' +
      ' Dirichlet mollifier with m₂ = −0.248 rescues a failing triangle bound' +
      ' at x₀ = 2.83×10¹³ (margin −0.1547 → +0.206) — and then the one-line z' +
      'ero-gain theorem min|Mf|/max|M| ≤ min|f| shows the min-modulus channel' +
      ' has exactly zero gain (1.3968/0.8338 = 1.6753 = min|f|, ratio 1.0000)' +
      '. The Nb-scan shows the rescue dying as the band widens (+0.385 → +0.2' +
      '06 → +0.0004 → −0.24); ball-arithmetic seals at ≥ 1.6703 and ≥ 1.6645 ' +
      'certify it.',
    scenes: [
      'Title — the sole survivor',
      'Fails, then passes',
      'The zero-gain theorem',
      'The scan and the seals',
    ],
    relatedRoutes: [
      { to: '/mollified-barrier-certificate', label: 'Mollified barrier certificate' },
    ],
  }),
  Object.freeze({
    id: 'overclaim-ledger',
    watchOrder: 17,
    category: 'Theorems & no-gos',
    title: 'The Six-Overclaim Ledger',
    grade: 'the no-false-QED discipline — six confident claims, all refuted by the project’s own review',
    accent: '#ff6b6b',
    videoSrc: '/animations/overclaim-ledger.mp4',
    posterSrc: '/animations/overclaim-ledger-poster.jpg',
    external: false,
    durationLabel: '43 s · 1080p60 · Manim CE',
    description:
      'The framing film: six struck-through overclaims with their corrections' +
      ' — the height-mismatch Λ ≤ 0.0X, the false Wiener–Hopf bound (the norm' +
      ' actually grows like e^{aT}), the §27 collapse identity (refuted by sc' +
      'ale invariance), the Volterra 5000× margin (a homogeneity artifact), t' +
      'he finite-N* beat (an ESTIMATE, C_H undischargeable), and the operator' +
      ' collapse (RH-equivalent, not a reduction). The rule: a bound dependin' +
      'g on an unproved constant is a conditional estimate and must be labele' +
      'd as one. What is actually established: 0 ≤ Λ ≤ 0.2.',
    scenes: [
      'Title — no-false-QED',
      'Six claims, six corrections',
      'The one that mattered most',
      'Closing — why the surviving claims can be trusted',
    ],
    relatedRoutes: [
      { to: '/what-we-know', label: 'What we know' },
    ],
  }),
  Object.freeze({
    id: 'gue-3point',
    watchOrder: 18,
    category: 'Evidence, engines & gallery',
    title: 'The 3-Point GUE Test on a Million Zeros',
    grade: 'empirical — Pearson 0.97780; not rigorous (Rudnick–Sarnak support (−⅔, ⅔) is the open gap)',
    accent: '#7bd88f',
    videoSrc: '/animations/gue-3point.mp4',
    posterSrc: '/animations/gue-3point-poster.jpg',
    external: false,
    durationLabel: '50 s · 1080p60 · Manim CE',
    description:
      'Unfold a million verified zeros to mean spacing 0.9998987588864481, wa' +
      'tch the spacing histogram fill the Wigner surmise (KL divergence 0.008' +
      '13, Hellinger 0.0483 on 10⁴ Odlyzko zeros), then climb to triples: the' +
      ' sine-kernel determinant R₃(x,y) tested on a 7-point grid over the bul' +
      'k window — the (2,3) bin hits GUE exactly, Pearson 0.97780, mean |Δ| 0' +
      '.14684. Ends on the honest wall: Rudnick–Sarnak proves n-level GUE onl' +
      'y for test functions with Fourier support in (−⅔, ⅔), so all of this i' +
      's evidence, not proof.',
    scenes: [
      'Title',
      'Unfolding and the Wigner surmise',
      'The 3-level correlation table',
      'The support-gap wall',
    ],
    relatedRoutes: [
      { to: '/gue-comparison', label: 'GUE comparison' },
    ],
  }),
  Object.freeze({
    id: 'berry-keating',
    watchOrder: 19,
    category: 'Evidence, engines & gallery',
    title: 'H = xp: a Failure Exhibit',
    grade: 'documented negative result — a gap exhibit, not a Hilbert–Pólya realization',
    accent: '#4da6ff',
    videoSrc: '/animations/berry-keating.mp4',
    posterSrc: '/animations/berry-keating-poster.jpg',
    external: false,
    durationLabel: '43 s · 1080p60 · Manim CE',
    description:
      'The Berry–Keating conjecture tested naively and kept on display precis' +
      'ely because it fails: quantize H_sym = (xp+px)/2 via ladder operators,' +
      ' truncate at N = 50/100/200, and the RMS residual against the first fi' +
      'fteen zeros stays flat at 39.52/39.87/39.80 — no convergence, the trun' +
      'cated spectrum (max ≈ 9.7) far below γ₁…γ₁₅ = 14.13…65.1. The page’s d' +
      'iagnosis: the missing ingredient is prime-dependent boundary condition' +
      's (Connes-adelic style), and N_smooth is an output of RH-adjacent asym' +
      'ptotics, not a proof of them.',
    scenes: [
      'Title',
      'The classical hyperbolas and the hope',
      'The flat residual',
      'What is missing — and why exhibit failure',
    ],
    relatedRoutes: [
      { to: '/berry-keating-xp', label: 'Berry–Keating xp' },
    ],
  }),
  Object.freeze({
    id: 'barnes-hut',
    watchOrder: 20,
    category: 'Evidence, engines & gallery',
    title: 'The 854× Rigorous Engine',
    grade: 'measured, sound computation — 854× is vs a projected dense time; production wiring separate (imp-1136)',
    accent: '#3ddbd9',
    videoSrc: '/animations/barnes-hut.mp4',
    posterSrc: '/animations/barnes-hut-poster.jpg',
    external: false,
    durationLabel: '45 s · 1080p60 · Manim CE',
    description:
      'How the program computes fast without lying: an O(N log N) Barnes–Hut ' +
      'tree for the zero-drift sum with a proved monopole envelope carried in' +
      ' interval arithmetic (θ = 0.1, leaves of 32). The ladder climbs 1.3× →' +
      ' 3.3× → 9.7× → 20.6× → 39.9× → ≈854× at N = 10⁵ (dense projected ~3,47' +
      '5 s vs 4.065 s measured); at θ = 0.01 the BH–dense midpoint difference' +
      ' is 5.51×10⁻¹⁴ inside a 7.82×10⁻¹⁴ interval; soundness violations acro' +
      'ss every tested configuration: zero. The refuted 10⁻⁶-at-θ=0.5 target ' +
      'is shown struck through.',
    scenes: [
      'Title',
      'The tree and the proved error box',
      'The speedup ladder',
      'The soundness ledger',
    ],
    relatedRoutes: [
      { to: '/rigorous-numerics-stages', label: 'Rigorous numerics stages' },
    ],
  }),
  Object.freeze({
    id: 'viz-gallery',
    watchOrder: 21,
    category: 'Evidence, engines & gallery',
    title: 'Four Windows onto ζ',
    grade: 'illustrative — visual geometry of established mathematics; no analytic claim',
    accent: '#f07ab8',
    videoSrc: '/animations/viz-gallery.mp4',
    posterSrc: '/animations/viz-gallery-poster.jpg',
    external: false,
    durationLabel: '1 min 01 s · 1080p60 · Manim CE',
    description:
      'A gallery interlude: the log-phase spiral r = log(t+e), θ = arg ζ(½+it' +
      ') with π-jump cusps at every zero (γ₁ = 14.134725…); the tomography pr' +
      'oduct P(σ,t) = |ζ(σ+it)|·|ζ((1−σ)+it)| whose interference trough at σ ' +
      '= ½ is forced by |χ(½+it)| = 1; the Euler transport flow whose streaml' +
      'ines sink into every zero; and the hyperbolic prime spiral in the Poin' +
      'caré disk, colored by p mod 4 with no angular clustering, its radial l' +
      'og-density the prime number theorem made visible. Every panel stamped:' +
      ' illustration, not proof.',
    scenes: [
      'Title — four windows, one object',
      'The log-phase spiral',
      'Twin-ladder tomography',
      'The Euler transport flow',
      'The hyperbolic prime spiral · closing stamp',
    ],
    relatedRoutes: [
      { to: '/viz-log-phase-spiral', label: 'Log-phase spiral' },
      { to: '/viz-twin-ladder-tomography', label: 'Tomography' },
      { to: '/viz-euler-transport-flow', label: 'Transport flow' },
      { to: '/viz-hyperbolic-prime-spiral', label: 'Prime spiral' },
    ],
  }),
  Object.freeze({
    id: 'twistor-lift2',
    watchOrder: 23,
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
    watchOrder: 22,
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
    watchOrder: 5,
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
  Object.freeze({
    id: 'concepts-foundations',
    watchOrder: 24,
    category: 'Concepts',
    title: 'Concepts I — Foundations & Analysis',
    grade: 'reference deck — definitions verbatim from the explorer glossary; established textbook material unless marked',
    accent: '#f07ab8',
    videoSrc: '/animations/concepts-foundations.mp4',
    posterSrc: '/animations/concepts-foundations-poster.jpg',
    external: false,
    durationLabel: '1 min 12 s · 1080p60 · Manim CE',
    description:
      'Flash-card deck of 8 glossary concepts (complex numbers, analytic continuation, convergence, the gamma function, poles, residues, contour integrals), each card showing the term, its formula, the definition, and the intuition line — rendered verbatim from the /concepts page so the films and the glossary can never drift apart.',
    scenes: [
      'Title card', '8 concept cards in sequence', 'each: term · formula · definition · intuition', 'source: the explorer glossary',
    ],
    relatedRoutes: [
      { to: '/concepts', label: 'The concepts glossary' },
    ],
  }),
  Object.freeze({
    id: 'concepts-zeta',
    watchOrder: 25,
    category: 'Concepts',
    title: 'Concepts II — The Zeta Function',
    grade: 'reference deck — definitions verbatim from the explorer glossary; established textbook material unless marked',
    accent: '#f07ab8',
    videoSrc: '/animations/concepts-zeta.mp4',
    posterSrc: '/animations/concepts-zeta-poster.jpg',
    external: false,
    durationLabel: '1 min 37 s · 1080p60 · Manim CE',
    description:
      'Flash-card deck of 11 glossary concepts (zeta, the Euler product, the functional equation, the critical strip, nontrivial zeros, RH, the xi function), each card showing the term, its formula, the definition, and the intuition line — rendered verbatim from the /concepts page so the films and the glossary can never drift apart.',
    scenes: [
      'Title card', '11 concept cards in sequence', 'each: term · formula · definition · intuition', 'source: the explorer glossary',
    ],
    relatedRoutes: [
      { to: '/concepts', label: 'The concepts glossary' },
    ],
  }),
  Object.freeze({
    id: 'concepts-primes-info',
    watchOrder: 26,
    category: 'Concepts',
    title: 'Concepts III — Primes & Information',
    grade: 'reference deck — definitions verbatim from the explorer glossary; established textbook material unless marked',
    accent: '#f07ab8',
    videoSrc: '/animations/concepts-primes-info.mp4',
    posterSrc: '/animations/concepts-primes-info-poster.jpg',
    external: false,
    durationLabel: '1 min 54 s · 1080p60 · Manim CE',
    description:
      'Flash-card deck of 13 glossary concepts (primes, the prime number theorem, von Mangoldt, the explicit formula, and the information-theory dictionary), each card showing the term, its formula, the definition, and the intuition line — rendered verbatim from the /concepts page so the films and the glossary can never drift apart.',
    scenes: [
      'Title card', '13 concept cards in sequence', 'each: term · formula · definition · intuition', 'source: the explorer glossary',
    ],
    relatedRoutes: [
      { to: '/concepts', label: 'The concepts glossary' },
    ],
  }),
  Object.freeze({
    id: 'concepts-physics',
    watchOrder: 27,
    category: 'Concepts',
    title: 'Concepts IV — The Physics Dictionary',
    grade: 'reference deck — definitions verbatim from the explorer glossary; established textbook material unless marked',
    accent: '#f07ab8',
    videoSrc: '/animations/concepts-physics.mp4',
    posterSrc: '/animations/concepts-physics-poster.jpg',
    external: false,
    durationLabel: '1 min 12 s · 1080p60 · Manim CE',
    description:
      'Flash-card deck of 8 glossary concepts (oscillator stages, quality factors, impedance, transfer functions, scattering, the Hamiltonian), each card showing the term, its formula, the definition, and the intuition line — rendered verbatim from the /concepts page so the films and the glossary can never drift apart.',
    scenes: [
      'Title card', '8 concept cards in sequence', 'each: term · formula · definition · intuition', 'source: the explorer glossary',
    ],
    relatedRoutes: [
      { to: '/concepts', label: 'The concepts glossary' },
    ],
  }),
  Object.freeze({
    id: 'concepts-rmt-quantum',
    watchOrder: 28,
    category: 'Concepts',
    title: 'Concepts V — Random Matrices & Quantum',
    grade: 'reference deck — definitions verbatim from the explorer glossary; established textbook material unless marked',
    accent: '#f07ab8',
    videoSrc: '/animations/concepts-rmt-quantum.mp4',
    posterSrc: '/animations/concepts-rmt-quantum-poster.jpg',
    external: false,
    durationLabel: '2 min 10 s · 1080p60 · Manim CE',
    description:
      'Flash-card deck of 15 glossary concepts (GUE, eigenvalue repulsion, pair correlation, Hilbert–Pólya, Berry–Keating, quantum chaos), each card showing the term, its formula, the definition, and the intuition line — rendered verbatim from the /concepts page so the films and the glossary can never drift apart.',
    scenes: [
      'Title card', '15 concept cards in sequence', 'each: term · formula · definition · intuition', 'source: the explorer glossary',
    ],
    relatedRoutes: [
      { to: '/concepts', label: 'The concepts glossary' },
    ],
  }),
  Object.freeze({
    id: 'concepts-thermo-geometry',
    watchOrder: 29,
    category: 'Concepts',
    title: 'Concepts VI — Thermodynamics & Geometry',
    grade: 'reference deck — definitions verbatim from the explorer glossary; established textbook material unless marked',
    accent: '#f07ab8',
    videoSrc: '/animations/concepts-thermo-geometry.mp4',
    posterSrc: '/animations/concepts-thermo-geometry-poster.jpg',
    external: false,
    durationLabel: '1 min 45 s · 1080p60 · Manim CE',
    description:
      'Flash-card deck of 12 glossary concepts (partition functions, free energy, phase transitions, KMS states, Bost–Connes, and the geometric pictures), each card showing the term, its formula, the definition, and the intuition line — rendered verbatim from the /concepts page so the films and the glossary can never drift apart.',
    scenes: [
      'Title card', '12 concept cards in sequence', 'each: term · formula · definition · intuition', 'source: the explorer glossary',
    ],
    relatedRoutes: [
      { to: '/concepts', label: 'The concepts glossary' },
    ],
  }),
  Object.freeze({
    id: 'concepts-proof-1',
    watchOrder: 30,
    category: 'Concepts',
    title: 'Concepts VII — Proof Machinery 1',
    grade: 'reference deck — definitions verbatim from the explorer glossary; established textbook material unless marked',
    accent: '#f07ab8',
    videoSrc: '/animations/concepts-proof-1.mp4',
    posterSrc: '/animations/concepts-proof-1-poster.jpg',
    external: false,
    durationLabel: '2 min 02 s · 1080p60 · Manim CE',
    description:
      'Flash-card deck of 14 glossary concepts (the program-specific vocabulary of the Λ certificates, part 1), each card showing the term, its formula, the definition, and the intuition line — rendered verbatim from the /concepts page so the films and the glossary can never drift apart.',
    scenes: [
      'Title card', '14 concept cards in sequence', 'each: term · formula · definition · intuition', 'source: the explorer glossary',
    ],
    relatedRoutes: [
      { to: '/concepts', label: 'The concepts glossary' },
    ],
  }),
  Object.freeze({
    id: 'concepts-proof-2',
    watchOrder: 31,
    category: 'Concepts',
    title: 'Concepts VIII — Proof Machinery 2',
    grade: 'reference deck — definitions verbatim from the explorer glossary; established textbook material unless marked',
    accent: '#f07ab8',
    videoSrc: '/animations/concepts-proof-2.mp4',
    posterSrc: '/animations/concepts-proof-2-poster.jpg',
    external: false,
    durationLabel: '2 min 02 s · 1080p60 · Manim CE',
    description:
      'Flash-card deck of 14 glossary concepts (the program-specific vocabulary of the Λ certificates, part 2), each card showing the term, its formula, the definition, and the intuition line — rendered verbatim from the /concepts page so the films and the glossary can never drift apart.',
    scenes: [
      'Title card', '14 concept cards in sequence', 'each: term · formula · definition · intuition', 'source: the explorer glossary',
    ],
    relatedRoutes: [
      { to: '/concepts', label: 'The concepts glossary' },
    ],
  }),
  Object.freeze({
    id: 'concepts-proof-3',
    watchOrder: 32,
    category: 'Concepts',
    title: 'Concepts IX — Proof Machinery 3',
    grade: 'reference deck — definitions verbatim from the explorer glossary; established textbook material unless marked',
    accent: '#f07ab8',
    videoSrc: '/animations/concepts-proof-3.mp4',
    posterSrc: '/animations/concepts-proof-3-poster.jpg',
    external: false,
    durationLabel: '2 min 02 s · 1080p60 · Manim CE',
    description:
      'Flash-card deck of 14 glossary concepts (the program-specific vocabulary of the Λ certificates, part 3), each card showing the term, its formula, the definition, and the intuition line — rendered verbatim from the /concepts page so the films and the glossary can never drift apart.',
    scenes: [
      'Title card', '14 concept cards in sequence', 'each: term · formula · definition · intuition', 'source: the explorer glossary',
    ],
    relatedRoutes: [
      { to: '/concepts', label: 'The concepts glossary' },
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
          a.scenes.length >= 4 &&
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
