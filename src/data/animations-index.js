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
    id: 'twistor-lift2',
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
    title: 'The Twistor Lift',
    grade: 'geometric reformulation (toy encoding) — the framework alone cannot prove RH',
    accent: '#ec4899',
    videoSrc: '/animations/twistor-lift.mp4',
    posterSrc: '/animations/twistor-lift-poster.jpg',
    external: false,
    durationLabel: '2 min 27 s · 1080p60 · Manim CE',
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
    title: 'The Twin-Ladder Bridge',
    grade: 'RH-equivalent reformulation — not a proof, not a new bound',
    accent: '#b58cff',
    videoSrc: '/animations/twin-ladder-bridge.mp4',
    posterSrc: '/animations/twin-ladder-bridge-poster.jpg',
    external: false,
    durationLabel: '2 min 27 s · 1080p60 · Manim CE',
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
