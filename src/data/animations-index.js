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
    grade: 'computer-assisted candidate — awaiting journal review; measured against the peer-reviewed Λ ≤ 0.2',
    accent: '#f5c542',
    videoSrc: '/animations/four-gate-lambda.mp4',
    posterSrc: '/animations/four-gate-lambda-poster.jpg',
    external: false,
    durationLabel: '2 min 27 s · 1080p60 · Manim CE',
    description:
      'The four-gate certificate, filmed from ' +
      '/lambda-01758354-candidate: a revised mollifier and an extended ' +
      'finite lane (5.3×10⁶ windows, vs 3,149,013 in the 0.1787854 package) ' +
      'certify four independent gates — finite lane, tail D < 1 ' +
      '(endpoint-cap bound, closing only after raising the finite/tail ' +
      'cutoff to N* = 6×10⁶; the verified zero height X is unchanged), ' +
      'barrier reuse (containment in the certified barrier box), and the y-transfer ' +
      'excision budget B ≈ 2.5×10⁻⁴ against an available margin of ' +
      '1.87×10⁻³. Includes the honest hard part: naive termwise ' +
      'monotonicity is false (double cancellations), fixed by ' +
      'profile-sector cells that dissolve an apparent 2²⁸⁷ enumeration ' +
      'into 20,546 explicit profiles. The y-transfer reduction and Lemma B3 are Lean-checked, the ' +
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
    watchOrder: 13,
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
    watchOrder: 24,
    category: 'Theorems & no-gos',
    title: 'The Obstruction Seam',
    grade: 'anatomy of the obstruction — not a proof of anything; PT Λ ≤ 0.2 is the peer-reviewed benchmark · NO QED',
    accent: '#f5c542',
    videoSrc: '/animations/obstruction-seam.mp4',
    posterSrc: '/animations/obstruction-seam-poster.jpg',
    external: false,
    durationLabel: '1 min 32 s · 1080p60 · Manim CE',
    description:
      'The meta-verdict of 2026-07-16: a 16-angle skeptical push on the ' +
      'two load-bearing walls (the C_H shock modulus; wide-support Montgomery ' +
      'pair correlation), every angle eliminated by ≥2 skeptics at ≥0.82 ' +
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
    watchOrder: 17,
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
      { to: '/spectral-attack', label: 'Spectral approach (Θ explorer)' },
    ],
  }),
  Object.freeze({
    id: 'collapse-chain',
    watchOrder: 20,
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
      '‖R‖ ≤ 1 ⟺ K_a ⪰ 0 is exactly RH-equivalent. Λ ≤ 0.2 is the peer-reviewed benchmark.',
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
    watchOrder: 14,
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
    grade: 'evidence-graded history — solid rows are peer-reviewed; dashed rows are computer-assisted results awaiting journal publication',
    accent: '#f5c542',
    videoSrc: '/animations/lambda-history.mp4',
    posterSrc: '/animations/lambda-history-poster.jpg',
    external: false,
    durationLabel: '39 s · 1080p60 · Manim CE',
    description:
      'Every bound in the timeline module, graded: the lower-bound climb (−50' +
      ' in 1988 through −1.14541×10⁻¹¹ in 2011) to Rodgers–Tao’s floor Λ ≥ 0;' +
      ' the upper squeeze ½ → 0.22 → 0.2 (peer-reviewed); the dashed 2026 cla' +
      'ims (0.1965 and 0.1875 unrefereed; 0.1787854 and 0.1758354 candidates' +
      '). The module’s own rule on screen: inspect accepted before calling a' +
      'nything a theorem.',
    scenes: [
      'Title — RH ⟺ Λ = 0, graded',
      'The climb from below (seven lower bounds)',
      'The squeeze from above (solid vs dashed)',
      'Closing — the solid interval [0, 0.2]',
    ],
    relatedRoutes: [
      { to: '/lambda-bounds', label: 'Λ bounds ledger' },
      { to: '/history', label: 'History' },
    ],
  }),
  Object.freeze({
    id: 'route-b-limsup',
    watchOrder: 19,
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
    watchOrder: 22,
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
      'er engine, not an analytic wall; six barrier-tightening approaches die ag' +
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
    watchOrder: 15,
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
    watchOrder: 16,
    category: 'Twin ladder & twistor geometry',
    title: 'Three Approaches on Ghost Absence (§18)',
    grade: 'corrected audit — I rejected as stated; II finite model; III RH-equivalent target; nothing proves RH',
    accent: '#ff6b6b',
    videoSrc: '/animations/three-attacks.mp4',
    posterSrc: '/animations/three-attacks-poster.jpg',
    external: false,
    durationLabel: '59 s · 1080p60 · Manim CE',
    description:
      'Section 18 with the corrected audit on screen: Approach I (kernel passiv' +
      'ity) is REJECTED AS STATED — the proposed Gram-sum is a sum of squares' +
      ', positive whether or not RH holds, a detector that always says yes; A' +
      'ttack II (prime-delay domination, Re X′/X > 0 on the right half-plane)' +
      ' is a FINITE MODEL, with the retracted mis-normalized surrogate pivot ' +
      'acknowledged; Approach III (the Krein–Langer/Pontryagin index) is the RH' +
      '-EQUIVALENT TARGET, with index tracking that reads 0 across the grid a' +
      'nd jumps to 1 for an injected off-line zero, exactly as it must.',
    scenes: [
      'Title — the corrected scoreboard',
      'Approach I: rejected as stated',
      'Approach II: finite model',
      'Approach III: the index target',
      'Closing — the wall still standing',
    ],
    relatedRoutes: [
      { to: '/three-attacks', label: 'Three approaches (§18)' },
      { to: '/blaschke-ghosts', label: 'Blaschke ghosts (§17)' },
    ],
  }),
  Object.freeze({
    id: 'frozen-rung-pt',
    watchOrder: 21,
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
    watchOrder: 23,
    category: 'Theorems & no-gos',
    title: 'The Mollified Barrier and the Zero-Gain Theorem',
    grade: 'formalization infrastructure — matches PT, provably cannot beat it; no bound, NO QED',
    accent: '#f5c542',
    videoSrc: '/animations/mollified-barrier.mp4',
    posterSrc: '/animations/mollified-barrier-poster.jpg',
    external: false,
    durationLabel: '56 s · 1080p60 · Manim CE',
    description:
      'The sole survivor of a 79-agent skeptical review of 22 candidates: a' +
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
    id: 'gue-3point',
    watchOrder: 32,
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
    watchOrder: 35,
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
    watchOrder: 36,
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
    watchOrder: 43,
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
    watchOrder: 45,
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
    watchOrder: 44,
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
    watchOrder: 6,
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
    watchOrder: 46,
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
    watchOrder: 47,
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
    watchOrder: 48,
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
    watchOrder: 49,
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
    watchOrder: 50,
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
    watchOrder: 51,
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
    watchOrder: 52,
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
    watchOrder: 53,
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
    watchOrder: 54,
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
  Object.freeze({
    id: 'oscillators',
    watchOrder: 7,
    category: 'Twin ladder & twistor geometry',
    title: 'Every Prime Is an Oscillator',
    grade: 'the LC ladder model — a property of the model, not a theorem about the Euler product',
    accent: '#3ddbd9',
    videoSrc: '/animations/oscillators.mp4',
    posterSrc: '/animations/oscillators-poster.jpg',
    external: false,
    durationLabel: '48 s · 1080p60 · Manim CE',
    description:
      'The Euler product as a cascade of filter stages: each factor 1/(1 − e^' +
      '(−s log p)) is a delay-feedback cell with echoes at multiples of log p' +
      ' and poles spaced 2π/log p; the LC matching L_p = log p, C_p = 1/log p' +
      ' makes every prime resonate at the same ω₀ = 1 with impedance log p; Q' +
      '(σ) = 1/(2σ) is prime-independent, hitting critical coupling Q = 1 for' +
      ' all stages simultaneously at σ = ½, where the χ two-port between the ' +
      'direct and dual ladders becomes lossless (Γ = 0, unitary S). Suggestiv' +
      'e — and not a proof of anything about RH.',
    scenes: [
      'Title',
      'Each Euler factor is a transfer function',
      'LC matching: same pitch, different impedance',
      'The χ-bridge two-port · caveat',
    ],
    relatedRoutes: [
      { to: '/oscillators', label: 'Oscillators' },
      { to: '/twin-ladder', label: 'Twin ladder' },
    ],
  }),
  Object.freeze({
    id: 'hamiltonian',
    watchOrder: 8,
    category: 'Twin ladder & twistor geometry',
    title: 'The Energy Landscape',
    grade: 'exploratory analogy — constructed to exhibit the minimum; the zeros shown are inputs, not outputs',
    accent: '#b58cff',
    videoSrc: '/animations/hamiltonian.mp4',
    posterSrc: '/animations/hamiltonian-poster.jpg',
    external: false,
    durationLabel: '45 s · 1080p60 · Manim CE',
    description:
      'A Hamiltonian H = T + V_mismatch + V_bridge over the strip whose minim' +
      'um sits exactly on the critical line: kinetic balance between the twin' +
      ' ladders, the conjugate match Z_dual = conj(Z_dir) forced by 1 − s = s' +
      '̄ on the line, and bridge losslessness |χ| = 1 all coincide at σ = ½ (' +
      'with the bridge term weighted 100(1−|χ|)²). The explicit formula ψ(x) ' +
      '= x − Σ x^ρ/ρ − … then reads as the chain’s impulse response, every ze' +
      'ro one damped mode ringing at rate x^½. The page’s caveat carried: the' +
      ' σ = ½ on display is an input from Odlyzko’s tables, not a derivation.',
    scenes: [
      'Title',
      'Three energies, one minimum',
      'Why the minimum lands there',
      'The explicit formula as impulse response · caveat',
    ],
    relatedRoutes: [
      { to: '/hamiltonian', label: 'Hamiltonian' },
      { to: '/oscillators', label: 'Oscillators' },
    ],
  }),
  Object.freeze({
    id: 'spectral-attack',
    watchOrder: 18,
    category: 'Theorems & no-gos',
    title: 'Six Probes, One Well',
    grade: 'numerical convergence of independent measures — strong evidence, not proof',
    accent: '#f07ab8',
    videoSrc: '/animations/spectral-attack.mp4',
    posterSrc: '/animations/spectral-attack-poster.jpg',
    external: false,
    durationLabel: '50 s · 1080p60 · Manim CE',
    description:
      'The unified confinement potential Φ(σ,t): six heuristically independen' +
      't measures — KL divergence of the prime distribution (Gibbs ≥ 0), twis' +
      'tor incidence |Z·W|², bridge unitarity (1−|χ|)², entropy shift, channe' +
      'l capacity, and the Fisher/free-energy term — each extremal at σ = ½, ' +
      'summed into a well with Φ ≥ 0 and Φ(½,t) = 0. The app measures their p' +
      'airwise Pearson correlations for independence (|r| < 0.3) and stress-t' +
      'ests every probe against Davenport–Heilbronn, the classic impostor wit' +
      'h off-line zeros. The stated gap: a proof needs the unique minimum ana' +
      'lytically, at the zeros and not merely on the line.',
    scenes: [
      'Title',
      'The potential: six measures, one sum',
      'Each probe alone — then fused',
      'Independence, the impostor test, and the seventh vector',
    ],
    relatedRoutes: [
      { to: '/spectral-attack', label: 'Spectral approach' },
      { to: '/theorem-b-threshold', label: 'Theorem B threshold' },
    ],
  }),
  Object.freeze({
    id: 'pair-correlation',
    watchOrder: 31,
    category: 'Evidence, engines & gallery',
    title: 'Montgomery’s Pair Correlation',
    grade: 'proved for |α| < 1 (Montgomery 1973); conjectured beyond; the N = 1000 test ships as qualitative agreement',
    accent: '#7bd88f',
    videoSrc: '/animations/pair-correlation.mp4',
    posterSrc: '/animations/pair-correlation-poster.jpg',
    external: false,
    durationLabel: '40 s · 1080p60 · Manim CE',
    description:
      'The 1 − (sin πα/πα)² form factor against 1,000 unfolded Odlyzko zeros:' +
      ' 5,044 local pairs (|j−k| ≤ 200), the repulsion dip at α = 0, and the ' +
      'wall at |α| = 1 — proved inside, conjectured (Dyson: GUE) outside. The' +
      ' honest scoreboard as stored: KS ≈ 0.094 on |α| ≤ 1 versus the strict ' +
      '0.05 threshold — NOT met at N = 1000, shipped as qualitative-agreement' +
      '-finite-N, with the convergence ladder KS ≈ 0.062 at 10⁴ and < 0.01 at' +
      ' Odlyzko’s 10⁹, because convergence is O(1/log γ).',
    scenes: [
      'Title',
      'Level repulsion against the sine kernel',
      'The wall at |α| = 1',
      'The honest scoreboard at N = 1000',
    ],
    relatedRoutes: [
      { to: '/pair-correlation', label: 'Pair correlation' },
      { to: '/gue-comparison', label: 'GUE comparison' },
    ],
  }),
  Object.freeze({
    id: 'gram-hardy',
    watchOrder: 33,
    category: 'Evidence, engines & gallery',
    title: 'Gram Points & the Hardy Z Machine',
    grade: 'Gram’s law is an empirical rule, not a theorem; Riemann–Siegel + Turing are the rigorous part',
    accent: '#4da6ff',
    videoSrc: '/animations/gram-hardy.mp4',
    posterSrc: '/animations/gram-hardy-poster.jpg',
    external: false,
    durationLabel: '47 s · 1080p60 · Manim CE',
    description:
      'Z(t) = e^{iθ(t)}ζ(½+it) is real on the line, so its sign changes are o' +
      'n-line zeros; Gram points solve θ(g_n) = nπ and Gram’s law predicts al' +
      'ternating signs — true most of the time, first violated at n = 126 (Hu' +
      'tchinson 1925), running near 27% violations in the first 1,000 points ' +
      '(a finite-window figure; Titchmarsh 1935: violations are infinite). Un' +
      'derneath sits the rigorous machine: the Riemann–Siegel sum with C₀+C₁+' +
      'C₂ corrections (error O(t^{−5/4}), θ-residual < 10⁻⁹ at t = 1000), the' +
      ' Titchmarsh mean value, and Turing’s method restoring the exact zero c' +
      'ount when the rule of thumb fails.',
    scenes: [
      'Title',
      'Gram’s law on schedule',
      'Then n = 126 happens',
      'The rigorous machine underneath',
    ],
    relatedRoutes: [
      { to: '/gram-points', label: 'Gram points' },
      { to: '/hardy-z', label: 'Hardy Z' },
    ],
  }),
  Object.freeze({
    id: 'voronin',
    watchOrder: 37,
    category: 'Evidence, engines & gallery',
    title: 'Zeta Imitates Everything',
    grade: 'established theorem (Voronin 1975) — qualitative and ineffective; the in-app witness is one finite glimpse',
    accent: '#f07ab8',
    videoSrc: '/animations/voronin.mp4',
    posterSrc: '/animations/voronin-poster.jpg',
    external: false,
    durationLabel: '42 s · 1080p60 · Manim CE',
    description:
      'Voronin universality: for any nonvanishing analytic f on a compact pat' +
      'ch of the strip ½ < Re s < 1 and any ε > 0, the set of heights τ where' +
      ' ζ(s+iτ) approximates f within ε has positive lower density. The in-ap' +
      'p witness sweeps τ over [10, 1000] against three targets (e^s, s²+1, s' +
      'in s) on a 5×5 grid, marking τ* and the achieved ε ≈ 0.27 for the easi' +
      'est target — one finite glimpse of an ineffective theorem that names n' +
      'o τ and no rate, only the promise that searching longer always works.',
    scenes: [
      'Title',
      'The statement',
      'The finite witness: the sup-norm dips at τ*',
      'Ineffective by nature — the horizon',
    ],
    relatedRoutes: [
      { to: '/voronin-universality', label: 'Voronin universality' },
    ],
  }),
  Object.freeze({
    id: 'wave-echo',
    watchOrder: 9,
    category: 'Twin ladder & twistor geometry',
    title: 'The Prime Echo Chamber — Wave Mechanics I',
    grade: 'illustrative dynamics of the model — established mathematics visualized, not evidence about RH',
    accent: '#3ddbd9',
    videoSrc: '/animations/wave-echo.mp4',
    posterSrc: '/animations/wave-echo-poster.jpg',
    external: false,
    durationLabel: '1 min 00 s · 1080p60 · Manim CE',
    description:
      'Pluck the prime ladder once and the reverb that returns is arithmetic' +
      ': each stage p echoes at delays k·log p, and the cascade’s echogram is' +
      ' exactly the von Mangoldt function — computed exactly on screen, spike' +
      's of weight Λ(n)/√n at log n for every prime power, silence at every c' +
      'omposite. A Gaussian packet convolved with the train (real numerics) b' +
      'lurs at large width and resolves the primes as it sharpens; by the exp' +
      'licit formula the zeros are this reverberator’s resonant frequencies.',
    scenes: [
      'Title',
      'One stage: the p = 2 delay line',
      'The cascade echogram = Λ(n)',
      'A packet hears the primes',
      'Closing — resonances',
    ],
    relatedRoutes: [
      { to: '/oscillators', label: 'Oscillators' },
      { to: '/twin-ladder', label: 'Twin ladder' },
    ],
  }),
  Object.freeze({
    id: 'wave-bridge',
    watchOrder: 10,
    category: 'Twin ladder & twistor geometry',
    title: 'Crossing the Bridge — Wave Mechanics II',
    grade: 'scattering computed from the model’s Γ = (1−|χ|)/(1+|χ|); ghost absence ∀a>0 is Conjecture 17.3 — RH-equivalent',
    accent: '#f5c542',
    videoSrc: '/animations/wave-bridge.mp4',
    posterSrc: '/animations/wave-bridge-poster.jpg',
    external: false,
    durationLabel: '58 s · 1080p60 · Manim CE',
    description:
      'A wave packet scatters off the χ two-port with σ on a dial: the reflec' +
      'tion curve Γ(σ) is computed from |χ(σ+it)| ~ (t/2π)^{½−σ} at t = 25, v' +
      'anishing exactly on the line. Two runs of the same packet — a clean lo' +
      'ssless pass at σ = ½, a split into transmitted τ and reflected Γ ampli' +
      'tudes at σ = 0.8 with energy R + T = 1 conserved. Then the ghost reson' +
      'ance: an off-critical zero puts a pole of Θ_a in the bridge, carving a' +
      ' Lorentzian dip at γ = 14.13 with linewidth 2(δ−a) and leaving the bri' +
      'dge ringing after the packet passes — a failure of RH you could hear.',
    scenes: [
      'Title',
      'The dial: Γ(σ) computed',
      'Same packet, two dial settings',
      'The ghost resonance and the ringing bridge',
    ],
    relatedRoutes: [
      { to: '/oscillators', label: 'Oscillators' },
      { to: '/blaschke-ghosts', label: 'Blaschke ghosts (§17)' },
    ],
  }),
  Object.freeze({
    id: 'wave-cavity',
    watchOrder: 11,
    category: 'Twin ladder & twistor geometry',
    title: 'The Cavity of Zeros — Wave Mechanics III',
    grade: 'illustrative dynamics of the model — not evidence about RH',
    accent: '#f07ab8',
    videoSrc: '/animations/wave-cavity.mp4',
    posterSrc: '/animations/wave-cavity-poster.jpg',
    external: false,
    durationLabel: '57 s · 1080p60 · Manim CE',
    description:
      'The twin ladders as the two mirrors of an interferometer: phase-matche' +
      'd at σ = ½, the cavity’s standing-wave comb sits at the zero ordinates' +
      ' γ₁…γ₅; drag σ off the line and the finesse (computed from Γ(σ)) colla' +
      'pses, washing the comb into a blur. The finale runs the exact polynomi' +
      'al heat flow: the inner root pair collides at t = −g²/8 and fissions i' +
      'nto a conjugate pair, and the wave visibly stops crossing zero — two a' +
      'xis crossings gone, the birth of off-axis zeros seen without ever draw' +
      'ing the complex plane.',
    scenes: [
      'Title',
      'A phase-matched cavity, modes at the zeros',
      'Detune: the comb washes out',
      'Soliton fission — the wave stops crossing zero',
    ],
    relatedRoutes: [
      { to: '/twin-ladder', label: 'Twin ladder' },
      { to: '/debruijn-departure', label: 'De Bruijn departure' },
    ],
  }),
  Object.freeze({
    id: 'line-proportion',
    watchOrder: 28,
    category: 'Evidence, engines & gallery',
    title: 'The Critical-Line Proportion',
    grade: 'peer-reviewed theorems (1914–2020); the dated 2026 two-thirds claim shown as a separate, unrefereed tier',
    accent: '#7bd88f',
    videoSrc: '/animations/line-proportion.mp4',
    posterSrc: '/animations/line-proportion-poster.jpg',
    external: false,
    durationLabel: '53 s · 1080p60 · Manim CE',
    description:
      'A century of climbing toward 100%: Hardy 1914 (infinitely many zeros o' +
      'n the line), Selberg 1942 (a positive proportion), then the mollifier ' +
      'ladder — Levinson ≥ ⅓, Conrey 40.88%, Bui–Conrey–Young 41.05%, Feng 41' +
      '.28%, Pratt–Robles–Zaharescu–Zeindler ≥ 5/12 — each rung a peer-review' +
      'ed unconditional theorem. A dashed second tier marks the August 2026 A' +
      'I-produced ≥ ⅔ claim (optimised 0.6725; Lean-checked, reviewed by Conr' +
      'ey and Goldston, unrefereed). Closing: any κ < 100% is qualitatively s' +
      'hort of RH — one off-line zero anywhere would end it.',
    scenes: [
      'Title — κ and RH',
      'Hardy and Selberg',
      'The mollifier ladder (live bar)',
      'The separate 2026 tier',
      'A proportion is not all of them',
    ],
    relatedRoutes: [
      { to: '/critical-line-proportion', label: 'Critical line proportion' },
    ],
  }),
  Object.freeze({
    id: 'supercritical',
    watchOrder: 25,
    category: 'Twin ladder & twistor geometry',
    title: 'The Thermodynamics of ζ',
    grade: 'Bost–Connes transition and Λ bounds cited theorems; primon-gas reading interpretive; Z_TL zeros a model artifact',
    accent: '#ff6b6b',
    videoSrc: '/animations/supercritical.mp4',
    posterSrc: '/animations/supercritical-poster.jpg',
    external: false,
    durationLabel: '54 s · 1080p60 · Manim CE',
    description:
      'Zeta as a partition function with β = σ as inverse temperature: the sp' +
      'ecific heat spiking at β = 1 (Bost–Connes: unique KMS state for β ≤ 1,' +
      ' condensation into many for β > 1, labeled by cyclotomic embeddings), ' +
      'the frozen Euler product decoupling for β > 1 and the hot strip where ' +
      'prime-phase interference forges the zeros, Julia’s primon-gas reading ' +
      'as interpretation, and the honest negative that a numerical search fou' +
      'nd no symmetry-breaking transition inside (½, 1). Finale: the engineer' +
      'ed Z_TL deformation’s ground-state collapse as β → ∞ — with the artifa' +
      'ct stamp on its zeros.',
    scenes: [
      'Title',
      'The phase transition at β = 1',
      'Crossing into the hot strip',
      'Ground-state collapse · the artifact stamp · heat-flow coda',
    ],
    relatedRoutes: [
      { to: '/supercritical', label: 'Supercritical' },
      { to: '/twin-ladder', label: 'Twin ladder' },
    ],
  }),
  Object.freeze({
    id: 'connes-adelic',
    watchOrder: 26,
    category: 'Twin ladder & twistor geometry',
    title: 'The Absorption Spectrum',
    grade: 'Connes 1999 trace-formula recasting established; full positivity is the RH-equivalent program — open',
    accent: '#b58cff',
    videoSrc: '/animations/connes-adelic.mp4',
    posterSrc: '/animations/connes-adelic-poster.jpg',
    external: false,
    durationLabel: '43 s · 1080p60 · Manim CE',
    description:
      'Connes’ adelic program as the structural answer to the Berry–Keating f' +
      'ailure: one completion per prime assembles into the adele class space ' +
      'C_Q = A_Q*/Q*, the Weil–Connes trace formula balances zeros against pr' +
      'ime terms W_p(h) = log p Σ p^(−k/2)[g(k log p)+g(−k log p)], and the z' +
      'eros appear as an absorption spectrum — missing lines, conjecturally a' +
      't exactly the ordinates. The in-app 25-term heat-damped probe (primes ' +
      '≤ 11, K ≤ 5) is a sign tripwire, positive by construction; full positi' +
      'vity for every admissible h is equivalent to RH and stays the open sum' +
      'mit.',
    scenes: [
      'Title',
      'One completion per prime, assembled',
      'The trace-formula balance and the dark lines',
      'The 25-term probe, and the honest boundary',
    ],
    relatedRoutes: [
      { to: '/connes-adelic', label: 'Connes adelic' },
      { to: '/berry-keating-xp', label: 'Berry–Keating xp' },
    ],
  }),
  Object.freeze({
    id: 'certificate-anatomy',
    watchOrder: 5,
    category: 'The Λ program',
    title: 'Anatomy of a Certificate',
    grade: 'verified execution facts on a reviewed computer-assisted result — logical form unconditional, journal publication the remaining step',
    accent: '#3ddbd9',
    videoSrc: '/animations/certificate-anatomy.mp4',
    posterSrc: '/animations/certificate-anatomy-poster.jpg',
    external: false,
    durationLabel: '51 s · 1080p60 · Manim CE',
    description:
      'One window row of the Λ ≤ 0.1787854 chain, slowed all the way down: ro' +
      'w N = 690988 with primes {2,3,5,7,11}, the floor 7.91366×10⁻⁷ against ' +
      'the certified error 2.33494905…×10⁻⁷ (margin ≥ 5.57871×10⁻⁷); the wind' +
      'ow freeze evaluating once at the left edge and holding across the wind' +
      'ow through the kinks; native binding by exact Dirichlet convolution; t' +
      'he Dini transfer’s worst certified ratio 0.99999860767275095 < 1 at tw' +
      'o Arb precisions; then the assembly — 3,149,013 rows, 883 prisms, one ' +
      'tail contraction — into 893927/5000000. Documentary gates are labeled ' +
      'as such: a green replay verifies execution, and the mathematics is wha' +
      't review is for.',
    scenes: [
      'Title',
      'Zoom into one row of 3,149,013',
      'The window freeze',
      'Binding and transfer',
      'Assembly into one number',
    ],
    relatedRoutes: [
      { to: '/newman-lambda-01787854-candidate', label: 'The 0.1787854 package' },
    ],
  }),
  Object.freeze({
    id: 'fourier-duality',
    watchOrder: 29,
    category: 'Evidence, engines & gallery',
    title: 'Primes ⇄ Zeros',
    grade: 'the explicit formula and Mellin identities are established; the per-zero waves assume the zeros are on the line',
    accent: '#f07ab8',
    videoSrc: '/animations/fourier-duality.mp4',
    posterSrc: '/animations/fourier-duality-poster.jpg',
    external: false,
    durationLabel: '52 s · 1080p60 · Manim CE',
    description:
      'The explicit formula run in both directions with live numerics: twenty' +
      ' stored zero ordinates bend the smooth ramp x into the exact prime-pow' +
      'er staircase ψ(x), corner by corner; then the reverse — the transform ' +
      'of the first 400 prime powers F(ω) = |Σ Λ(n)n^(−½)e^(−iω log n)| compu' +
      'ted live, every peak landing exactly on a zero ordinate. Underneath, W' +
      'eil’s balance: zeros on one pan, primes on the other, a test function ' +
      'trading places with its Fourier transform. RH in this language: every ' +
      'AC mode of the prime signal has amplitude x^½ — no rogue loud mode.',
    scenes: [
      'Title',
      'Zero-waves carve the staircase (live)',
      'The prime comb’s spectrum is the zeros (live)',
      'Weil’s balance · RH as no-rogue-mode',
    ],
    relatedRoutes: [
      { to: '/fourier', label: 'Fourier' },
    ],
  }),
  Object.freeze({
    id: 'wave-collar',
    watchOrder: 12,
    category: 'Twin ladder & twistor geometry',
    title: 'The Containment Field — Wave Mechanics IV',
    grade: 'the actual inequality behind every zero-exclusion certificate, visualized',
    accent: '#7bd88f',
    videoSrc: '/animations/wave-collar.mp4',
    posterSrc: '/animations/wave-collar-poster.jpg',
    external: false,
    durationLabel: '1 min 03 s · 1080p60 · Manim CE',
    description:
      'The Rouché collar from the consistency-preserving twistor framework (§' +
      '6.3): compute only on a thin collar around the contour, and if the tru' +
      'ncation stays a floor’s height above zero — inf|H_t^(N)| ≥ δ on Γ whil' +
      'e sup|H_t − H_t^(N)| < δ — the exact zero count inside transfers from ' +
      'the finite object to the infinite one. The error becomes a wave sloshi' +
      'ng under a golden waterline with the count LOCKED; the one leak is the' +
      ' freeze–thaw Duhamel commutator, which must be bounded along with the ' +
      'tail. Every barrier prism, window scan, and clearance band in the prog' +
      'ram is one of these collars.',
    scenes: [
      'Title',
      'A contour, a collar, two numbers',
      'The two-sided lock (Rouché)',
      'The error as a wave inside the field',
      'The one leak · closing',
    ],
    relatedRoutes: [
      { to: '/twistor', label: 'Twistor framework' },
      { to: '/newman-lambda-01787854-candidate', label: 'The 0.1787854 package' },
    ],
  }),
  Object.freeze({
    id: 'selberg-trace',
    watchOrder: 27,
    category: 'Evidence, engines & gallery',
    title: 'Where Hilbert–Pólya Is Real',
    grade: 'established theorems — Selberg 1956; Hejhal, Sarnak, Iwaniec',
    accent: '#7bd88f',
    videoSrc: '/animations/selberg-trace.mp4',
    posterSrc: '/animations/selberg-trace-poster.jpg',
    external: false,
    durationLabel: '45 s · 1080p60 · Manim CE',
    description:
      'The one setting where the spectral dream is a theorem: on the modular ' +
      'surface, closed geodesics (lengths log N(P)) play the primes and the L' +
      'aplace spectrum λₙ = ¼ + rₙ² plays the zeros, with the Selberg trace f' +
      'ormula balancing the two sides exactly for every admissible test funct' +
      'ion. The dictionary to ζ then closes on the one missing entry: there t' +
      'he operator is the Laplacian — real, self-adjoint, constructed; here t' +
      'he operator is still a question mark. Selberg realizes the Hilbert–Pól' +
      'ya philosophy where Riemann conjectures it.',
    scenes: [
      'Title',
      'Geodesics play the primes',
      'The trace formula: a scale that balances',
      'The dictionary and the missing entry',
    ],
    relatedRoutes: [
      { to: '/selberg-trace', label: 'Selberg trace' },
    ],
  }),
  Object.freeze({
    id: 'gilbreath',
    watchOrder: 38,
    category: 'Evidence, engines & gallery',
    title: 'The {0, 2} Lock',
    grade: 'parity lemma and exact reduction proved on screen; the conjecture open — verified through ~3.4×10¹¹ primes',
    accent: '#3ddbd9',
    videoSrc: '/animations/gilbreath.mp4',
    posterSrc: '/animations/gilbreath-poster.jpg',
    external: false,
    durationLabel: '48 s · 1080p60 · Manim CE',
    description:
      'Gilbreath’s triangle computed exactly from the primes up to 47: iterat' +
      'ed absolute differences with every leading entry 1 (gold) and the inte' +
      'rior snapping to {0, 2} (teal). The parity lemma falls in one binomial' +
      ' line — mod 2 the triangle is Pascal’s, so the leading entry is odd fo' +
      'rever — and the exact reduction shows the conjecture is precisely pers' +
      'istence of the {0,2} state. Verified through π(10¹³) ≈ 3.4×10¹¹ leadin' +
      'g terms (Odlyzko 1993); no proof in either direction since 1958.',
    scenes: [
      'Title',
      'Build the triangle (exact)',
      'The one-line parity lemma and the reduction',
      'What could break the lock',
    ],
    relatedRoutes: [
      { to: '/gilbreath', label: 'Gilbreath observation' },
    ],
  }),
  Object.freeze({
    id: 'calabi-yau',
    watchOrder: 41,
    category: 'Evidence, engines & gallery',
    title: 'The Weight Gap',
    grade: 'Weil/Deligne/modularity classical; payload is the honest negative — no known motive over ℚ carries ζ',
    accent: '#b58cff',
    videoSrc: '/animations/calabi-yau.mp4',
    posterSrc: '/animations/calabi-yau-poster.jpg',
    external: false,
    durationLabel: '42 s · 1080p60 · Manim CE',
    description:
      'The Riemann Hypothesis that was proven: over finite fields, Deligne 19' +
      '74 locks every Frobenius eigenvalue to its circle |α| = p^{k/2}. The f' +
      'ilm tours the geometry that carries such L-functions (the quintic with' +
      ' h^{1,1} = 1, h^{2,1} = 101, χ = −200, its Picard–Fuchs operator, and ' +
      'the proved bound |a_p| ≤ 2p^{3/2}), then hits the wall: motivic weight' +
      ' puts eigenvalues at p^{3/2}, ζ’s zeros would need p^{1/2}, and no kno' +
      'wn variety or motive over ℚ has ζ as its L-function. The strongest RH ' +
      'proof ever found lives in characteristic p.',
    scenes: [
      'Title',
      'Deligne: eigenvalues locked to circles',
      'The quintic and its operator',
      'The gap no functor bridges',
    ],
    relatedRoutes: [
      { to: '/calabi-yau', label: 'Calabi–Yau' },
    ],
  }),
  Object.freeze({
    id: 'mills',
    watchOrder: 39,
    category: 'Evidence, engines & gallery',
    title: 'The Constant That Knows the Primes',
    grade: 'Mills 1947 + Ingham 1937, theorems — with the fixed-point twist stated plainly',
    accent: '#f5c542',
    videoSrc: '/animations/mills.mp4',
    posterSrc: '/animations/mills-poster.jpg',
    external: false,
    durationLabel: '45 s · 1080p60 · Manim CE',
    description:
      'Mills’ constant A ≈ 1.30637788…: the floor of A^{3ⁿ} is prime for ever' +
      'y n, with the tower 2 → 11 → 1361 → 2,521,008,887 → … landing exactly ' +
      'on primes and the approximants pₙ^{1/3ⁿ} collapsing eleven orders of m' +
      'agnitude in three steps. The twist: A is defined FROM the primes it ge' +
      'nerates — a fixed point, not an oracle; the theorem runs on Ingham’s p' +
      'rime-gap bound, and pinning A’s digits unconditionally would take gaps' +
      ' O(√x log x), an RH-strength statement.',
    scenes: [
      'Title',
      'The tower: cube, floor, prime',
      'Lock-on: doubly-exponential collapse',
      'The twist and the RH-shaped tail',
    ],
    relatedRoutes: [
      { to: '/mills-theorem', label: 'Mills’ theorem' },
    ],
  }),
  Object.freeze({
    id: 'odd-zeta',
    watchOrder: 40,
    category: 'Evidence, engines & gallery',
    title: 'Apéry’s Escape',
    grade: 'established theorems — Apéry 1979, Rhin–Viola 2001, Ball–Rivoal 2001, Zudilin 2001; the frontier stated as open',
    accent: '#ff6b6b',
    videoSrc: '/animations/odd-zeta.mp4',
    posterSrc: '/animations/odd-zeta-poster.jpg',
    external: false,
    durationLabel: '42 s · 1080p60 · Manim CE',
    description:
      '1978: Roger Apéry, 61, announces ζ(3) ∉ ℚ to a disbelieving room — and' +
      ' the proof holds. The film runs the racing recurrence live (six terms ' +
      'of the 5/2 Σ (−1)^{n−1}/(n³ C(2n,n)) series already give ten digits, e' +
      'rror crushed like (1+√2)^{−4n}), shows the escape certificate μ(ζ(3)) ' +
      '≤ 5.513891, and ends on the strange frontier: infinitely many odd zeta' +
      ' values are irrational (Ball–Rivoal), at least one of ζ(5), ζ(7), ζ(9)' +
      ', ζ(11) is (Zudilin) — yet not one more specific value has escaped sin' +
      'ce 1978.',
    scenes: [
      'Title',
      'The racing recurrence (live)',
      'The escape certificate',
      'One escapee in 1978 — none named since',
    ],
    relatedRoutes: [
      { to: '/odd-zeta', label: 'Odd zeta' },
    ],
  }),
  Object.freeze({
    id: 'rh-equivalents',
    watchOrder: 30,
    category: 'Evidence, engines & gallery',
    title: 'Twelve Masks, One Line',
    grade: 'every equivalence peer-reviewed and cited; an equivalence is a translation, not a step',
    accent: '#f07ab8',
    videoSrc: '/animations/rh-equivalents.mp4',
    posterSrc: '/animations/rh-equivalents-poster.jpg',
    external: false,
    durationLabel: '40 s · 1080p60 · Manim CE',
    description:
      'One unproven sentence, twelve published costumes: Robin’s divisor thre' +
      'shold σ(n) < e^γ n log log n past 5040, Lagarias’ harmonic-number form' +
      ', Li positivity, Nyman–Beurling density, Mertens growth, Speiser’s der' +
      'ivative zeros, Volchkov’s single definite integral, the de Bruijn–Newm' +
      'an Λ = 0, and more — each exactly equivalent to RH, each carrying a jo' +
      'urnal citation. The closing sting: twelve doors, all locked by the sam' +
      'e key; the value of a mask is choosing the room you’d rather work in.',
    scenes: [
      'Title',
      'The calculator mask (Robin, Lagarias)',
      'The gallery',
      'Twelve doors, one key',
    ],
    relatedRoutes: [
      { to: '/rh-equivalents', label: 'RH equivalents' },
    ],
  }),
  Object.freeze({
    id: 'prime-caustics',
    watchOrder: 42,
    category: 'Evidence, engines & gallery',
    title: 'Caustics of the Primes',
    grade: 'exact elementary resonance law + exploratory renderings — no claim about Λ or RH',
    accent: '#f07ab8',
    videoSrc: '/animations/prime-caustics.mp4',
    posterSrc: '/animations/prime-caustics-poster.jpg',
    external: false,
    durationLabel: '46 s · 1080p60 · Manim CE',
    description:
      'Fold the phases t·log p mod 2π and structure condenses: resonance rows' +
      ' at exactly t = 2πk/log(p_j/p_i) — every bright band the signature of ' +
      'a named pair of primes beating (computed on screen: (2,3) at 15.494, (' +
      '3,5) at 12.301, (5,7) at 18.675). The diffraction test seals it: the c' +
      'rystal built from the 46 real prime logs holds sharp Bragg structure, ' +
      'and the same crystal built from shuffled logs dissolves toward the √N ' +
      'noise floor. The structure was arithmetic, not artifact.',
    scenes: [
      'Title',
      'Fold the fan (real phases)',
      'Every band names its prime pair',
      'The diffraction test: real vs shuffled',
    ],
    relatedRoutes: [
      { to: '/viz-prime-caustic', label: 'Prime caustic' },
      { to: '/viz-caustic-resonance', label: 'Caustic resonance' },
      { to: '/viz-prime-phase-crystal', label: 'Phase crystal' },
    ],
  }),
  Object.freeze({
    id: 'esy-rigidity',
    watchOrder: 34,
    category: 'Evidence, engines & gallery',
    title: 'The Slope That Refused',
    grade: 'a numerical test against cited literature (Erdős–Schlein–Yau 2009), reporting a clean negative',
    accent: '#ff6b6b',
    videoSrc: '/animations/esy-rigidity.mp4',
    posterSrc: '/animations/esy-rigidity-poster.jpg',
    external: false,
    durationLabel: '39 s · 1080p60 · Manim CE',
    description:
      'A rigidity hypothesis failing on camera: if the zeta zeros obeyed ESY ' +
      'local-law rigidity, the statistic ψ_N(E;η) = |Im m_N(E+iη) + π| would ' +
      'fall at slope −1 in the bulk and −2/3 at the edge (Tracy–Widom). Measu' +
      'red on the first 10⁴ unfolded Odlyzko zeros, the recorded slopes are −' +
      '0.10628… and −0.06714… — nearly flat across two decades of η, nowhere ' +
      'near the targets. Verdict as recorded: ESY-INCOMPATIBLE, bulk and edge' +
      '. Negative results kept on camera are what make the positive ones cred' +
      'ible.',
    scenes: [
      'Title',
      'The hope: Wigner-grade rigidity',
      'The fan of lines: targets plunge, measurement refuses',
      'Verdict: incompatible — tested, closed, written down',
    ],
    relatedRoutes: [
      { to: '/esy-rigidity-empirical', label: 'ESY rigidity' },
      { to: '/edge-rigidity', label: 'Edge rigidity' },
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
