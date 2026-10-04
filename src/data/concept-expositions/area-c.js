/**
 * @module concept-expositions/area-c
 * @fileoverview Layered expositions ("from the beginner upwards") for area C of the concepts registry:
 * the twin-ladder / bridge model, the no-go theorems, and the project routes.
 *
 * Each entry is keyed by its registry slug (src/data/concepts-registry.js) and has:
 *   intro, levels[beginner|intermediate|advanced], physicsAnalogy {system, mapping[], whereItBreaks},
 *   examples[], whyItMatters, example, pitfalls[], prerequisites[], mentions[], furtherReading[].
 * Standalone rule: every other concept used on a page is explained inline in one or two plain sentences
 * and its slug is listed in `mentions`.
 *
 * Sources: the repo modules named in each entry's furtherReading / sources (flow-blindness-no-go.js,
 * shift-bridge-positivity-section.js, closure-routes-section.js, tlb-dh-blind-2026-09-28.js,
 * dag3-dhblindln3-2026-09-28.js, imp-95530-native-span-arithmetic-input-rigidity.js,
 * perm-arch-sieve-universality-no-go-2026-09-22.js, rh-bridge-mirror-descent-2026-09-25.js,
 * lane-arithmetic-input-audit-2026-09-22.js, imp-95218-route7-cost-curve.js,
 * rh-route-i-toeplitz-krein-certificate-2026-09-24.js, tlb-arb-lege-2026-09-28.js, project-attempts-dag.js)
 * and standard literature (cited inline).
 *
 * Status language: Platt–Trudgian Λ ≤ 0.2 is the accepted peer-reviewed benchmark. Project values below 0.2
 * are computer-assisted, unreviewed and unpublished, or conditional. Project certificates are internally
 * refereed, not externally reviewed. RH is open. Nothing here claims a proof of RH.
 *
 * Import-free (no zeros bundle, no glossary import). Not self-executing: validation is exported as a
 * function (validateAreaCExpositions) so that a failing check cannot blank a page at import time.
 */

const T = String.raw;
const scholar = (q) => `https://scholar.google.com/scholar?q=${encodeURIComponent(q)}`;

// ════════════════════════════════════════════════════════════════════════════════════════════════
// Concept expositions
// ════════════════════════════════════════════════════════════════════════════════════════════════

export const conceptExpositions = {
  // ──────────────────────────────────────────────────────────────────────────────────────────────
  'twin-ladder': {
    slug: 'twin-ladder',
    term: 'Twin ladder',
    intro:
      `The twin ladder is this project's circuit-style picture of the Riemann zeta function. One chain of stages, one stage per prime number, builds ζ(s); a mirror-image chain builds ζ(1−s); and a coupling element called the bridge joins the two chains. It is a way of organising identities that are already known, not a new theorem about where the zeros of ζ are.`,
    levels: [
      {
        level: 'beginner',
        heading: 'Primes as stages in a chain',
        paragraphs: [
          `The Riemann zeta function ζ(s) starts life as the infinite sum 1 + 1/2^s + 1/3^s + 1/4^s + … . For numbers s larger than 1 this sum settles to a finite value; for other s the function is defined by a standard extension procedure called analytic continuation (a unique way of extending a smooth complex function beyond the region where its formula works). The Riemann Hypothesis (RH) is the open conjecture that all the "non-trivial" zeros of ζ lie on one vertical line, Re s = 1/2.`,
          `Euler noticed that the same sum can be written as a product with one factor per prime: ζ(s) = 1/(1 − 2^(−s)) × 1/(1 − 3^(−s)) × 1/(1 − 5^(−s)) × … . This Euler product is the reason ζ knows about primes. The twin ladder draws each factor as one stage (one rung) of a chain, so the chain of all prime stages is the "direct arm" that produces ζ(s).`,
          `Riemann also proved a symmetry, the functional equation: ζ(s) = χ(s) ζ(1−s), where χ(s) is an explicit factor built from powers of π and the Gamma function (the extension of the factorial n! to non-integers). So ζ at s is tied to ζ at the mirror point 1−s. The twin ladder adds a second chain, the "dual arm", for ζ(1−s), and calls χ(s) the bridge between the arms.`,
          `What this picture leaves out: the product over primes only converges when the real part of s is greater than 1. The zeros RH is about lie in the critical strip 0 < Re s < 1, where the chain of stages does not converge and ζ is defined by analytic continuation instead. So the ladder does not, by itself, tell you where the zeros are.`,
        ],
        analogy:
          `Picture a row of echo chambers, one per prime. A sound entering the chamber for prime p echoes back and forth; each round trip takes a time proportional to log p and loses a fixed fraction of its loudness. Passing a signal through all the chambers in turn is the direct arm. A second, mirror-image row of chambers is the dual arm, and the bridge is a connector between the two rows.`,
        example:
          `At s = 2 the direct arm can be built stage by stage. The stage for p = 2 contributes 1/(1 − 1/4) = 1.3333; adding p = 3 gives 1.3333 × 9/8 = 1.5; then p = 5 gives 1.5625, p = 7 gives 1.5951, p = 11 gives 1.6083, p = 13 gives 1.6179. The full product is π²/6 = 1.6449. On the dual arm, ζ(1−2) = ζ(−1) = −1/12 (a value fixed by analytic continuation, not by adding 1 + 2 + 3 + …). The bridge is χ(2) = −2π² ≈ −19.74, and indeed −19.74 × (−1/12) = 1.645 = ζ(2).`,
      },
      {
        level: 'intermediate',
        heading: 'Stages as feedback loops, and the bridge',
        paragraphs: [
          `Write s = σ + it with σ the real part and t the imaginary part (the "frequency"). Then p^(−s) = p^(−σ) e^(−it log p): a factor of size p^(−σ) times a pure rotation by angle t log p. The Euler factor 1/(1 − p^(−s)) = 1 + p^(−s) + p^(−2s) + … is a geometric series, which is exactly the response of a feedback loop with loop gain p^(−σ) and delay log p, driven at frequency t. The project calls a single such stage an Euler factor or oscillator stage, and the framework that treats each prime as a resonator the Zeta Prime Oscillator (ZPO).`,
          `Stages can be written as 2×2 transfer matrices T_p (one matrix per prime, multiplied along the chain). The project uses two different matrix models — an algebraic one and a physical LC-circuit one — and they are different mathematical objects with different zeros and poles, so results in one do not transfer automatically to the other.`,
          `The bridge is χ(s) = π^(s−1/2) Γ((1−s)/2)/Γ(s/2). The completed zeta function ξ(s) = ½ s(s−1) π^(−s/2) Γ(s/2) ζ(s) packages ζ and its Gamma factor so that the functional equation becomes the plain symmetry ξ(s) = ξ(1−s). On the critical line |χ(1/2 + it)| = 1 exactly: in circuit language the bridge is lossless there. The same picture can be read as a two-arm Mach–Zehnder interferometer, with arms ζ(s) and ζ(1−s), relative phase χ(s), and zeros as dark fringes.`,
        ],
        math: [
          T`\zeta(s)=\prod_{p}\bigl(1-p^{-s}\bigr)^{-1},\qquad \operatorname{Re}s>1`,
          T`\frac{1}{1-p^{-s}}=\sum_{m\ge 0}p^{-ms}=\sum_{m\ge0}p^{-m\sigma}\,e^{-i\,t\,m\log p}`,
          T`\zeta(s)=\chi(s)\,\zeta(1-s),\qquad \chi(s)=\pi^{s-\frac12}\,\frac{\Gamma\!\left(\frac{1-s}{2}\right)}{\Gamma\!\left(\frac{s}{2}\right)}`,
          T`\xi(s)=\tfrac12\,s(s-1)\,\pi^{-s/2}\,\Gamma(s/2)\,\zeta(s)=\xi(1-s)`,
        ],
        example:
          `Stage p = 2 at σ = 1/2: loop gain 2^(−1/2) = 0.7071, delay ln 2 = 0.6931. The response |1/(1 − 0.7071 e^(−it ln 2))| peaks at 1/(1 − 0.7071) = 3.414 when t ln 2 is a multiple of 2π (t = 0, 9.06, 18.13, …) and dips to 1/(1 + 0.7071) = 0.586 halfway between. Each prime contributes such a periodic comb of peaks with period 2π/log p.`,
      },
      {
        level: 'advanced',
        heading: 'What the model encodes, and what has been proved about it',
        paragraphs: [
          `The twin-ladder paper ("Twin-Ladder Deformations of ξ") builds a chain of positivity statements on this picture: the T3 strip statement, the shift-bridge threshold (§15), the four closure routes A–D (§16), the hidden-square program (writing the ladder kernel as a sum of squares) and the Volterra program (an attempted reduction to one operator-norm bound ‖V‖ ≤ 1, refuted as a reduction). The project has since shown that each terminal statement is either RH-equivalent or a classical statement in operator language: T3(a) is exactly "ζ has no zero with Re s > 1/2 + a" (verified dictionary, flow-blindness-no-go.js).`,
          `Four no-go results bound what the ladder can do. Flow-blindness: the backward heat flow keeps the ladder's input profile in every class the apparatus uses, yet creates non-real zeros (by Rodgers–Tao, Λ ≥ 0), so no such hypothesis proves RH. Davenport–Heilbronn twin: a function with the same bridge but no Euler-product arm has zeros off the line, so the bridge does not force RH. NS-RIGID: on the ladder's native span, each finite positivity test either survives the flow (so it is soft) or refutes RH. Theorem U: rearranging the ladder's sieve operations is a change of basis and produces the same number.`,
        ],
        math: [
          T`E_a(z)=A_a(z)-iB_a(z)=\Xi(z+ia),\qquad \Xi(z)=\xi\!\left(\tfrac12+iz\right)`,
          T`\bigl|\chi(\tfrac12+it)\bigr|=1\quad(t\in\mathbb R)`,
        ],
        details: [
          `Lossless bridge on σ = 1/2 is an unconditional identity (Γ(z̄) = conj Γ(z)); it carries no information about zero location.`,
          `T3(a) ⟺ E_a is Hermite–Biehler ⟺ no zero of ζ with Re s > 1/2 + a; T3(a) for all a > 0 ⟺ RH.`,
          `Flow-blindness (SL2) is unconditional given Rodgers–Tao Λ ≥ 0 (Forum Math. Pi 8, 2020).`,
          `The Davenport–Heilbronn twin at conductor 5 has its first off-line zero at 0.8085171825 + 85.6993484854i (tlb-dh-blind-2026-09-28.js).`,
          `The /twin-ladder explorer page shows a separate thermodynamically weighted rung model; it is a teaching tool and does not track zeta zeros.`,
        ],
      },
    ],
    physicsAnalogy: {
      system: 'A cascade of feedback comb filters (echo chambers, or Fabry–Pérot optical cavities) coupled to a mirror cascade by a lossless phase-shifting connector.',
      mapping: [
        'Prime p ↔ a cavity whose round-trip delay is log p.',
        'Real part σ ↔ the loss per round trip: the echo keeps a fraction p^(−σ) of its amplitude.',
        'Imaginary part t ↔ the driving frequency.',
        'Euler product ↔ passing the signal through every cavity in turn (a cascade); its total response is the product of the stage responses.',
        'Bridge χ(s) ↔ the connector to the mirror cascade; on σ = 1/2 it changes only the phase (all-pass), off the line it amplifies or attenuates.',
        'Zeros of ζ ↔ frequencies at which the total output vanishes.',
      ],
      whereItBreaks:
        'The cascade converges only for σ > 1, so in the critical strip there is no physical cascade to point to. No finite stage ever outputs zero (each factor 1/(1 − p^(−s)) is never 0), so the zeros are not produced by any stage. The lossless bridge restates the functional equation; it is shared by functions that violate RH-type statements (the Davenport–Heilbronn twin), so the circuit picture alone cannot locate zeros.',
    },
    examples: [
      { level: 'beginner', title: 'Building ζ(2) one prime at a time', body: `Partial products 1.3333, 1.5, 1.5625, 1.5951, 1.6083, 1.6179 (primes up to 13) approach π²/6 = 1.6449.` },
      { level: 'beginner', title: 'Checking the bridge at s = 2', body: `χ(2) = π^(3/2) Γ(−1/2)/Γ(1) = π^(3/2) × (−2√π) = −2π² ≈ −19.739; χ(2) ζ(−1) = (−19.739)(−0.08333) = 1.6449 = ζ(2).` },
      { level: 'intermediate', title: 'One stage as a comb filter', body: `At σ = 1/2 the p = 2 stage swings between 3.414 and 0.586 with period 2π/ln 2 ≈ 9.06 in t.` },
      { level: 'advanced', title: 'Same bridge, off-line zero', body: `The Davenport–Heilbronn function shares the conductor-5 bridge of L(s, χ) but has a zero at 0.8085 + 85.699i (repo: tlb-dh-blind-2026-09-28.js).` },
    ],
    whyItMatters:
      `The twin ladder is the organising frame of the project's twin-ladder paper and of the pages on closure routes, shift-bridge positivity and the no-go theorems. Its main use so far has been diagnostic: it made it possible to identify which ladder statements are RH-equivalent restatements (T3, closure routes A–D) and which hypotheses are "soft" and therefore cannot prove RH (flow-blindness, NS-RIGID). No bound on the de Bruijn–Newman constant Λ follows from the ladder alone; Platt–Trudgian Λ ≤ 0.2 remains the accepted benchmark and RH is open.`,
    example:
      `Repo number: the dictionary identity E_a(z) = Ξ(z + ia) behind T3 was machine-checked to 1.0e-30 on its trigonometric core over 2000 random complex (a, z, u), and to 1.1e-15 for the full identity with the test profile e^(−u²) (flow-blindness-no-go.js).`,
    pitfalls: [
      `"Lossless on the critical line" is a property of the bridge χ, true for every t; it does not say the zeros are on the line.`,
      `The two matrix embeddings of a prime stage (algebraic and LC) are different objects; a result for one is not a result for the other.`,
      `The /twin-ladder explorer page is a separate, deformed rung model for teaching; its zeros are artifacts of its weights.`,
      `The Euler product does not converge in the critical strip; statements "about the ladder" there are statements about ζ defined by continuation.`,
    ],
    prerequisites: ['riemann-zeta-function', 'euler-product', 'functional-equation', 'complex-number'],
    mentions: ['complex-number', 'riemann-zeta-function', 'analytic-continuation', 'riemann-hypothesis', 'euler-product', 'functional-equation', 'gamma-function', 'critical-strip', 'euler-factor', 'zpo', 'transfer-matrix-tp', 'embedding-a-vs-b', 'xi-function', 'bridge-chi', 't3-strip', 'shift-bridge-threshold', 'closure-routes', 'hidden-square-program', 'volterra-bound', 'flow-blindness', 'davenport-heilbronn-twin', 'ns-rigid', 'theorem-u', 'de-bruijn-newman-constant', 'heat-flow-ht', 'mach-zehnder'],
    furtherReading: [
      { label: 'Twin-ladder paper roadmap', route: '/twin-ladder-paper-roadmap' },
      { label: 'Oscillators (LC ladder model)', route: '/oscillators' },
      { label: 'Closure routes A–D', route: '/closure-routes' },
      { label: 'Flow-blindness no-go', route: '/flow-blindness-no-go' },
      { label: 'Twin ladder explorer (deformed rung model, teaching tool)', route: '/twin-ladder' },
      { label: 'E. C. Titchmarsh, The Theory of the Riemann Zeta-Function, 2nd ed. (Oxford, 1986), ch. 2', url: scholar('Titchmarsh The Theory of the Riemann Zeta-Function') },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────────────────────────
  'bridge-chi': {
    slug: 'bridge-chi',
    term: 'Bridge χ(s)',
    intro:
      `χ(s) is the exact conversion factor between the zeta function at a point s and at the mirror point 1−s. In the project's twin-ladder picture it is the coupling element between the two arms. On the critical line its size is exactly 1, so there it changes only the phase.`,
    levels: [
      {
        level: 'beginner',
        heading: 'The exchange rate between s and 1−s',
        paragraphs: [
          `The Riemann zeta function ζ(s) is first defined by the sum 1 + 1/2^s + 1/3^s + … for s greater than 1 and then extended to almost every complex number by analytic continuation (the unique smooth extension of a function past the region where its formula converges). Riemann's functional equation says ζ(s) = χ(s) ζ(1−s): if you know ζ at 1−s, multiplying by χ(s) gives ζ at s.`,
          `The factor χ(s) is built from a power of π and the Gamma function Γ (the extension of the factorial, Γ(n) = (n−1)! for whole numbers n). It is completely explicit and does not depend on primes.`,
          `Points on the critical line Re s = 1/2 have a special property: their mirror point 1−s is their complex conjugate (1 − (1/2 + it) = 1/2 − it). On that line |χ| = 1 exactly, so ζ(s) and ζ(1−s) have the same size there and differ only by a rotation. Off the line, χ makes one side larger than the other.`,
          `Simplification left out: χ has zeros at s = 0, −2, −4, … and poles at s = 1, 3, 5, …, so "multiply by χ" must be read with care at those points; the zeros of χ produce the "trivial" zeros of ζ at −2, −4, … .`,
        ],
        analogy:
          `Think of χ as an exchange rate between two currencies, "ζ at s" and "ζ at 1−s". On the critical line the exchange rate has size 1 — the amounts are equal, only relabelled (rotated). Off the line the rate inflates one side and deflates the other.`,
        example:
          `ζ(2) = π²/6 ≈ 1.6449 and ζ(−1) = −1/12 ≈ −0.08333. So χ(2) = ζ(2)/ζ(−1) = −2π² ≈ −19.74. Off the line at height t = 100: |χ(0.6 + 100i)| = 0.7583 and |χ(0.4 + 100i)| = 1.3188 (one is the reciprocal of the other), while |χ(0.5 + 100i)| = 1.`,
      },
      {
        level: 'intermediate',
        heading: 'Formula, size on and off the line, and the Riemann–Siegel phase',
        paragraphs: [
          `With s = σ + it, the formula is χ(s) = π^(s−1/2) Γ((1−s)/2)/Γ(s/2). On σ = 1/2: π^(it) has modulus 1, and Γ((1−s)/2) = Γ(1/4 − it/2) is the complex conjugate of Γ(s/2) = Γ(1/4 + it/2) because Γ(z̄) = conj Γ(z). So the ratio has modulus 1.`,
          `Stirling's formula for Γ gives the size off the line: |χ(σ + it)| = (t/2π)^(1/2−σ) (1 + O(1/t)) for large t. To the right of the line (σ > 1/2) the bridge attenuates, to the left it amplifies. Applying the functional equation twice gives χ(s) χ(1−s) = 1.`,
          `On the line one writes χ(1/2 + it) = e^(−2iθ(t)), where θ is the Riemann–Siegel theta function. Then Z(t) = e^(iθ(t)) ζ(1/2 + it) — Hardy's Z function — is real for real t, and its sign changes mark zeros on the critical line. This is how zeros are verified numerically: the bridge supplies the phase that makes ζ real on the line.`,
        ],
        math: [
          T`\chi(s)=\pi^{s-\frac12}\,\frac{\Gamma\!\left(\frac{1-s}{2}\right)}{\Gamma\!\left(\frac{s}{2}\right)},\qquad \chi(s)\,\chi(1-s)=1`,
          T`\bigl|\chi(\sigma+it)\bigr|=\Bigl(\frac{t}{2\pi}\Bigr)^{\frac12-\sigma}\bigl(1+O(t^{-1})\bigr)`,
          T`\chi(\tfrac12+it)=e^{-2i\theta(t)},\qquad Z(t)=e^{i\theta(t)}\zeta(\tfrac12+it)\in\mathbb R`,
        ],
        example:
          `The leading term (t/2π)^(1/2−σ) at σ = 0.6, t = 100 is (15.915)^(−0.1) = e^(−0.2767) = 0.7583, which matches the exact |χ(0.6 + 100i)| = 0.75826 to four digits. At σ = 0.75, t = 20 the leading term (3.183)^(−0.25) = 0.7489 matches the exact 0.74868.`,
      },
      {
        level: 'advanced',
        heading: 'The bridge as the archimedean factor',
        paragraphs: [
          `In the language of L-functions χ is the ratio of archimedean (Gamma) factors: Λ(s) = π^(−s/2)Γ(s/2)ζ(s) satisfies Λ(s) = Λ(1−s), and multiplying by ½s(s−1) to remove the poles gives the completed function ξ(s) = ξ(1−s). For a Dirichlet L-function of an odd character mod q the corresponding factor is (q/π)^(s/2) Γ((s+1)/2). The same Gamma factor determines the archimedean term of the Weil explicit formula: its density is 2θ'(t) = Re ψ(1/4 + it/2) − ln π, where ψ = Γ'/Γ. So "the bridge" and "the archimedean side of Weil positivity" are the same object seen from two directions.`,
          `Two project results bound what the bridge alone can do. The Davenport–Heilbronn twin shares its bridge (5/π)^(s/2)Γ((s+1)/2) with L(s, χ mod 5), satisfies Λ_F(s) = Λ_F(1−s) with root number 1, and still has zeros off the line; so a bridge plus a Dirichlet series does not force RH. Flow-blindness shows that properties such as functional symmetry are preserved by the backward heat flow, which creates non-real zeros; so they are "soft" and cannot prove RH alone.`,
        ],
        math: [
          T`2\theta'(t)=\operatorname{Re}\psi\!\left(\tfrac14+\tfrac{it}{2}\right)-\ln\pi,\qquad \theta'(t)\sim\tfrac12\log\frac{t}{2\pi}`,
        ],
        details: [
          `|χ(1/2 + it)| = 1 for all real t is unconditional.`,
          `Zeros of χ at s = 0, −2, −4, … (poles of Γ(s/2)) give the trivial zeros of ζ at −2, −4, …; at s = 0 the zero of χ meets the pole of ζ(1−s), giving ζ(0) = −1/2. Poles of χ at s = 3, 5, … (poles of Γ((1−s)/2)) are cancelled by ζ(−2) = ζ(−4) = … = 0, and the one at s = 1 gives the pole of ζ.`,
          `Davenport–Heilbronn twin: same Gamma factor as L(s, χ mod 5), off-line zero 0.8085171825 + 85.6993484854i (tlb-dh-blind-2026-09-28.js).`,
        ],
      },
    ],
    physicsAnalogy: {
      system: 'An all-pass filter (a lossless phase shifter) in signal processing.',
      mapping: [
        'On σ = 1/2, |χ| = 1 ↔ an all-pass filter passes every frequency at full strength and only shifts its phase.',
        'Phase −2θ(t) ↔ the filter phase; θ\'(t) ≈ ½ log(t/2π) ↔ group delay that grows slowly with frequency (≈ 1.38 at t = 100).',
        'Off the line, |χ| ≈ (t/2π)^(1/2−σ) ↔ a filter that attenuates (σ > 1/2) or amplifies (σ < 1/2).',
      ],
      whereItBreaks:
        'χ is not the response of a stable physical filter: it has poles at s = 1, 3, 5, …. And "lossless on the line" is a property every t satisfies, independent of where ζ vanishes; a real all-pass filter tells you nothing about the zeros of whatever signal passes through it, and likewise χ tells nothing about the zeros of ζ.',
    },
    examples: [
      { level: 'beginner', title: 'χ(2) from known values', body: `χ(2) = ζ(2)/ζ(−1) = (π²/6)/(−1/12) = −2π² ≈ −19.74.` },
      { level: 'beginner', title: 'Mirror sizes at t = 100', body: `|χ(0.6 + 100i)| = 0.7583, |χ(0.4 + 100i)| = 1.3188 = 1/0.7583, |χ(0.5 + 100i)| = 1.` },
      { level: 'intermediate', title: 'Stirling check', body: `(100/2π)^(−0.1) = 0.7583 vs exact 0.75826; (20/2π)^(−0.25) = 0.7489 vs exact 0.74868.` },
      { level: 'advanced', title: 'Conductor-5 bridge', body: `(5/π)^(s/2)Γ((s+1)/2), archimedean symbol Ω(t) = log(5/π) + Re ψ(3/4 + it/2), Ω(0) = −0.62115 (tlb-dh-blind-2026-09-28.js).` },
    ],
    whyItMatters:
      `The bridge is the shared archimedean ingredient of every route in this area: the twin ladder, the shift-bridge threshold, the closure routes and Route I's Weil form all contain it. Knowing exactly what it contributes — and that it is shared by functions with off-line zeros — tells the project where arithmetic (prime) input has to enter. It moves no bound: Platt–Trudgian Λ ≤ 0.2 stands and RH is open.`,
    example:
      `Repo number: the conductor-5 archimedean symbol Ω(t) = log(5/π) + Re ψ(3/4 + it/2) takes the value Ω(0) = −0.621152853202 (tlb-dh-blind-2026-09-28.js); it is identical for the Euler product L(s, χ) and for the Davenport–Heilbronn twin.`,
    pitfalls: [
      `|χ| = 1 on the line is not evidence for RH; it holds at every point of the line, zero or not.`,
      `Conventions differ by where the Gamma factors are placed (χ(s) vs its reciprocal, or 2^s π^(s−1) sin(πs/2) Γ(1−s)); check the normalisation before comparing numbers.`,
      `"Same bridge" for the Davenport–Heilbronn twin means the same Gamma factor; L(s, χ) and F_DH do not have literally the same functional equation (different root numbers).`,
    ],
    prerequisites: ['riemann-zeta-function', 'functional-equation', 'gamma-function', 'complex-number'],
    mentions: ['complex-number', 'riemann-zeta-function', 'analytic-continuation', 'functional-equation', 'gamma-function', 'critical-line', 'twin-ladder', 'riemann-siegel-theta', 'hardy-z-function', 'xi-function', 'dirichlet-l-function', 'weil-explicit-formula', 'weil-positivity', 'davenport-heilbronn-twin', 'flow-blindness', 'shift-bridge-threshold', 'closure-routes', 'route-i-weil-ladder'],
    furtherReading: [
      { label: 'Twin-ladder paper roadmap', route: '/twin-ladder-paper-roadmap' },
      { label: 'Shift-bridge positivity (§15)', route: '/shift-bridge-positivity' },
      { label: 'H. M. Edwards, Riemann\'s Zeta Function (Academic Press, 1974), ch. 1 and 6', url: scholar('Edwards Riemann\'s Zeta Function 1974') },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────────────────────────
  't3-strip': {
    slug: 't3-strip',
    term: 'T3 (zero-free strip in operator form)',
    intro:
      `T3(a) is the statement that no zero of the zeta function lies more than a distance a to the right of the critical line. The twin-ladder paper reached it as a positivity statement about an operator; the project checked that it is exactly the classical "zero-free strip" statement written in another language. RH is the case "T3(a) for every a > 0".`,
    levels: [
      {
        level: 'beginner',
        heading: 'How far can a zero stray from the line?',
        paragraphs: [
          `The non-trivial zeros of the zeta function ζ lie in the critical strip, the band of complex numbers with real part between 0 and 1. They come in mirror groups: if ρ is a zero, so are 1−ρ and the complex conjugates of both (this follows from the functional equation, the exact symmetry between ζ(s) and ζ(1−s)). So the zeros are arranged symmetrically about the critical line Re s = 1/2.`,
          `T3(a) says: every zero lies within horizontal distance a of the critical line, i.e. no zero has real part bigger than 1/2 + a. The Riemann Hypothesis says every zero is on the line, which is the same as T3(a) holding for every a > 0, however small.`,
          `What is known: T3(1/2) is true, because it only says there are no zeros with real part above 1, and the Euler product (ζ written as a product over primes) is non-zero there. For every a smaller than 1/2, T3(a) is open: no vertical zero-free strip of any width inside the critical strip has been proved. The known zero-free regions get thinner as the height grows.`,
          `Also known: every zero up to height 3 × 10^12 has been checked to lie exactly on the line (Platt and Trudgian, 2021). So T3(a) could only fail through zeros above that height.`,
        ],
        analogy:
          `Imagine every zero as a musical tone. Its height is the pitch, and its distance from the critical line is how fast the tone swells or dies away. RH says every tone is perfectly steady. T3(a) says no tone swells or fades faster than rate a.`,
        example:
          `Mossinghoff and Trudgian (2015) proved that ζ has no zeros with real part at least 1 − 1/(5.573412 · log t), for t ≥ 2. At height t = 10^6 (log t = 13.82) that excludes real parts above 1 − 0.0130 = 0.9870. At t = 10^100 (log t = 230.3) the excluded zone only starts at 1 − 0.00078 = 0.99922. The zone keeps shrinking towards Re s = 1, so it never gives a fixed strip, and T3(a) for a < 1/2 remains unproved.`,
      },
      {
        level: 'intermediate',
        heading: 'The dictionary: Hermite–Biehler functions and strips',
        paragraphs: [
          `Rotate coordinates so that the critical line becomes the real axis: Ξ(z) = ξ(1/2 + iz), where ξ is the completed zeta function (ζ multiplied by its Gamma factor so that ξ(s) = ξ(1−s)). A zero ρ = 1/2 + δ + iγ of ζ becomes a zero z = γ − iδ of Ξ (and, by symmetry, also γ + iδ). RH says Ξ has only real zeros.`,
          `Shift up by a: E_a(z) := Ξ(z + ia), and split it into real-on-the-axis parts A_a and B_a as E_a = A_a − iB_a. A Hermite–Biehler function is an entire function E with |E(z̄)| < |E(z)| in the upper half-plane; such an E generates a de Branges space, a Hilbert space of entire functions with a positive reproducing kernel. The verified dictionary says: E_a is Hermite–Biehler ⟺ Ξ has no zero with imaginary part above a ⟺ ζ has no zero with Re s > 1/2 + a. That is T3(a).`,
          `The identity was checked by machine: the trigonometric core cos(2(z + ia)u) = cosh(2au) cos(2zu) − i sinh(2au) sin(2zu) holds to 1.0e-30 on 2000 random complex triples, and the full identity to 1.1e-15 (quadrature-limited) for the profile e^(−u²).`,
        ],
        math: [
          T`\Xi(z)=\xi\!\left(\tfrac12+iz\right),\qquad \rho=\tfrac12+\delta+i\gamma\;\longleftrightarrow\; z=\gamma-i\delta`,
          T`E_a(z)=A_a(z)-iB_a(z)=\Xi(z+ia)`,
          T`\mathrm{T3}(a)\iff E_a\in\mathrm{HB}\iff \zeta(s)\neq0\ \text{for}\ \operatorname{Re}s>\tfrac12+a`,
        ],
        example:
          `Factor-2 audit (repo): the canonical A_a uses cosh(2au), giving strip shift a; some channel numerics used cosh(at), giving shift a/2. A number quoted "at level a" from those channels is really at canonical half-width a/2 — a relabelling, not an error, but it must be tracked when comparing tables.`,
      },
      {
        level: 'advanced',
        heading: 'Status, consequences, and why soft methods cannot reach it',
        paragraphs: [
          `A zero-free half-plane Re s > 1/2 + a for some fixed a < 1/2 would go beyond every known zero-free region: by the explicit formula it would give ψ(x) = x + O(x^(1/2 + a) log² x) for Chebyshev's prime-counting function ψ(x) (the sum of log p over all prime powers p^k ≤ x). Current zero-free regions (de la Vallée Poussin type, Vinogradov–Korobov type) all approach Re s = 1 as t → ∞, limited by how well exponential sums Σ n^(−it) can be bounded (the exponential-sum wall).`,
          `The flow-blindness theorem (SL2) shows that no hypothesis on the profile Φ that is preserved by the Gaussian multiplier Φ ↦ e^(−εu²)Φ can prove T3(a) for all a > 0, because that multiplier is the backward de Bruijn heat flow and creates non-real zeros (Rodgers–Tao Λ ≥ 0). The module concludes that the whole T3 strip ladder is unreachable by such "soft" means; a proof needs arithmetic input such as the Euler product.`,
          `T3 is not a lever on the de Bruijn–Newman bound: the barrier method needs every zero below a height to be real, not a strip, so a strip result of any width a > 0 does not move Λ (zero-density-lambda-inert-2026-07-09.js; NS-RIGID B2).`,
        ],
        math: [
          T`\zeta(s)\neq0\ \ (\operatorname{Re}s>\theta)\ \Longrightarrow\ \psi(x)=x+O\!\left(x^{\theta}\log^2x\right)`,
        ],
        details: [
          `T3(1/2) holds (Euler product). T3(a) for 0 < a < 1/2 is open.`,
          `Verified height: all zeros with 0 < t ≤ 3·10^12 are on the line (Platt–Trudgian, Bull. LMS 53, 2021).`,
          `The wall is a zero-free strip plus flow rigidity; it is not Montgomery pair correlation (off-line exclusion is a different axis from on-line spacing).`,
        ],
      },
    ],
    physicsAnalogy: {
      system: 'The "damping margin" (relative stability) test for a linear system of oscillators.',
      mapping: [
        'Each zero 1/2 + δ + iγ ↔ a mode with frequency γ and growth-or-decay rate δ measured from the critical line.',
        'RH ↔ every mode is a pure, undamped oscillation (δ = 0).',
        'T3(a) ↔ no mode grows or decays faster than rate a.',
        'Shifting z → z + ia and testing Hermite–Biehler ↔ the engineering trick of substituting s → s + a and checking that the shifted system has no unstable poles.',
      ],
      whereItBreaks:
        'No physical system is known whose modes are the zeta zeros (that is the open Hilbert–Pólya idea), and there are infinitely many modes. The shift test is exact, but it gives no way to perform the check: verifying it for all heights is the whole problem.',
    },
    examples: [
      { level: 'beginner', title: 'A shrinking zero-free zone', body: `1 − 1/(5.573412 log t): 0.9870 at t = 10^6, 0.99922 at t = 10^100.` },
      { level: 'intermediate', title: 'Translating a zero', body: `A hypothetical zero ρ = 0.6 + 100i (δ = 0.1, γ = 100) becomes z = 100 − 0.1i for Ξ; T3(a) fails for every a < 0.1.` },
      { level: 'advanced', title: 'Machine-checked dictionary', body: `Trig core to 1.0e-30, full identity to 1.1e-15 (flow-blindness-no-go.js).` },
    ],
    whyItMatters:
      `T3 is the sole global frontier of the twin-ladder positivity program. Identifying it as the classical zero-free strip statement told the project that the ladder had not produced a new intermediate target: proving T3(a) for any fixed a < 1/2 would go beyond every known zero-free region, and proving it for every a is RH. Together with flow-blindness, it redirected the project away from soft positivity estimates and towards arithmetic input. RH is open; no bound on Λ moves.`,
    example:
      `Repo number: flow-blindness-no-go.js records the T3 dictionary as machine-checked (1.0e-30 on the trigonometric core; 1.1e-15 on the full identity with Φ = e^(−u²)).`,
    pitfalls: [
      `T3(a) for a fixed a > 0 is not known for any a < 1/2; it is not a "weak" statement.`,
      `Verified height (zeros on the line up to 3·10^12) does not give T3(a) for any a, because T3 is about all heights.`,
      `Zero-density estimates bound how many zeros can be off the line; they never give "none", so they do not prove T3.`,
      `Check the factor-2 convention (cosh(2au) vs cosh(at)) before comparing T3 numbers from different modules.`,
    ],
    prerequisites: ['critical-strip', 'nontrivial-zeros', 'xi-function', 'zero-free-region'],
    mentions: ['riemann-zeta-function', 'critical-strip', 'critical-line', 'nontrivial-zeros', 'functional-equation', 'euler-product', 'riemann-hypothesis', 'platt-trudgian-verified-height', 'xi-function', 'de-branges-spaces', 'entire-function', 'zero-free-region', 'chebyshev-psi', 'explicit-formula', 'exponential-sum-wall', 'flow-blindness', 'heat-flow-ht', 'de-bruijn-newman-constant', 'barrier-method', 'zero-density-estimate', 'ns-rigid', 'pair-correlation', 'twin-ladder'],
    furtherReading: [
      { label: 'Flow-blindness no-go (SL0/SL1 dictionary)', route: '/flow-blindness-no-go' },
      { label: 'Closure routes A–D', route: '/closure-routes' },
      { label: 'M. J. Mossinghoff, T. S. Trudgian, Nonnegative trigonometric polynomials and a zero-free region for the Riemann zeta-function, J. Number Theory 157 (2015)', url: scholar('Mossinghoff Trudgian nonnegative trigonometric polynomials zero-free region Riemann zeta-function') },
      { label: 'D. Platt, T. Trudgian, The Riemann hypothesis is true up to 3·10^12, Bull. LMS 53 (2021)', url: 'https://arxiv.org/abs/2004.09765' },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────────────────────────
  'shift-bridge-threshold': {
    slug: 'shift-bridge-threshold',
    term: 'Shift-bridge threshold (a-dial)',
    intro:
      `Shift the completed zeta function sideways by an amount a and compare its size on the two sides of each point. The comparison comes out the right way everywhere exactly when the dial a is at least as large as the furthest any zero sits from the critical line. So RH is the statement that the comparison works for every dial setting a > 0.`,
    levels: [
      {
        level: 'beginner',
        heading: 'A dial that measures how far zeros stray',
        paragraphs: [
          `Use the completed zeta function ξ (ζ multiplied by a Gamma factor so that the functional equation becomes the plain symmetry ξ(s) = ξ(1−s)), and re-centre it on the critical line: X(w) = ξ(1/2 + w). Then X is symmetric, X(w) = X(−w), and a zero of ζ at 1/2 + δ + iγ becomes a zero of X at δ + iγ. Let Δ be the largest horizontal offset |δ| among all zeros. The critical strip forces 0 ≤ Δ ≤ 1/2, and RH is the statement Δ = 0.`,
          `The test with dial a: at every point w to the right of the centre line, is |X(w + a)| larger than |X(w − a)|? The project's corrected Theorem 15.1 says the answer is "yes everywhere" exactly when a ≥ Δ. So the smallest dial setting that passes measures Δ.`,
          `What the beginner picture leaves out: ξ has infinitely many zeros, so the proof groups them in symmetric packets and passes to a limit; and the theorem is about strict inequality (see the advanced level for why that distinction matters).`,
        ],
        analogy:
          `Put a small electric charge at each zero. |X| behaves like the electric potential of those charges in a flat (two-dimensional) world: it is small near a charge. If all charges sit on the centre line, a probe placed further to the right is always further from every charge than its partner on the left, so the right-hand reading wins. A charge sitting off the line at distance δ > a can be landed on exactly by the right-hand probe, and the comparison fails.`,
        example:
          `Toy with an off-line pair: X(w) = w² − 0.09, zeros at ±0.3, so Δ = 0.3. Dial a = 0.1 at w = 0.2: |X(0.3)| = 0 but |X(0.1)| = |0.01 − 0.09| = 0.08, so the test fails. Dial a = 0.5 at the same w: |X(0.7)| = 0.40 > |X(−0.3)| = 0, so it passes. Toy with zeros on the line: X(w) = w² + 1 (zeros ±i) passes for every a > 0; at w = 1, a = 0.1: |X(1.1)| = 2.21 > |X(0.9)| = 1.81.`,
      },
      {
        level: 'intermediate',
        heading: 'The shifted bridge and its de Branges kernel',
        paragraphs: [
          `For each a > 0 define E_a(z) = X(a − iz) and its reflection E_a^#(z) = X(−a − iz). The ratio Θ_a = E_a^#/E_a has modulus below 1 in the upper half-plane exactly when |X(w − a)| < |X(w + a)| for Re w > 0 (substitute w = −iz). In the original variable this is |ξ(s − a)| < |ξ(s + a)| for Re s > 1/2: "horizontal monotonicity".`,
          `The pair (E_a, E_a^#) defines a de Branges kernel K_a (a de Branges space is a Hilbert space of entire functions whose reproducing kernel is built from one generating function; positivity of the kernel is the condition for the space to exist). Strict positivity of the kernel's diagonal K_a(z, z) > 0 is the same as |Θ_a| < 1.`,
          `The proof rests on one identity for a symmetric zero packet. For zeros at ±δ + iγ the quadratic factor Q(w) = (w − iγ)² − δ² satisfies |Q(w + a)|² − |Q(w − a)|² = 8ax(x² + Y² + a² − δ²), with w = x + iy and Y = y − γ. For x > 0 and a ≥ δ the right side is positive.`,
        ],
        math: [
          T`X(w)=\xi\!\left(\tfrac12+w\right),\qquad \Delta=\sup_{X(\lambda)=0}|\operatorname{Re}\lambda|\in[0,\tfrac12]`,
          T`E_a(z)=X(a-iz),\quad E_a^{\#}(z)=X(-a-iz),\quad \Theta_a=\frac{E_a^{\#}}{E_a}=\frac{X(w-a)}{X(w+a)}`,
          T`K_a(w,z)=\frac{E_a(z)\overline{E_a(w)}-E_a^{\#}(z)\overline{E_a^{\#}(w)}}{2\pi i(\bar w-z)}`,
          T`|Q(w+a)|^2-|Q(w-a)|^2=8ax\,(x^2+Y^2+a^2-\delta^2)`,
        ],
        example:
          `Check the identity on the toy X(w) = w² − 0.09 (γ = 0, δ = 0.3) at w = 0.2, a = 0.5: the right side is 8(0.5)(0.2)(0.04 + 0 + 0.25 − 0.09) = 0.16, and the left side is |0.40|² − |0|² = 0.16.`,
      },
      {
        level: 'advanced',
        heading: 'Corrected Theorem 15.1, the endpoint, and the common-zero caveat',
        paragraphs: [
          `Corrected Theorem 15.1 (twin-ladder audit): for fixed a > 0, |X(w − a)| < |X(w + a)| for every Re w > 0 if and only if a ≥ Δ, including the endpoint a = Δ. If 0 < a < Δ, a zero with δ > a gives w₀ = δ − a + iγ with X(w₀ + a) = 0, so strict inequality fails. This is a threshold for strict diagonal positivity, not for positive semidefiniteness of the whole kernel at fixed a: a common zero of X(w − a) and X(w + a) can cancel in the ratio and leave a zero row that PSD permits. Negative-index counts must use uncancelled pole orders and a coprime Krein–Langer factorisation.`,
          `Nevertheless K_a ⪰ 0 for every a > 0 ⟺ Δ = 0 ⟺ RH. An off-line zero acts as a "Gödelian witness" (an analogy only; no logic theorem is used): for 0 < a < δ it produces the point z_ρ(a) = −γ + i(δ − a) in the upper half-plane where E_a vanishes, an internal certificate of failed strict positivity. The prime-delay reading writes the same inequality as "completed Gamma/kernel drift dominates coherent prime-delay pull" to the right of the line.`,
        ],
        details: [
          `Theorem 15.1 is unconditional; Conjectures 15.2–15.4 built on it are RH-equivalent.`,
          `Relation to T3: the strict threshold a ≥ Δ is the statement T3(a) (no zero with Re s > 1/2 + a). The unshifted Gamma-factor ratio χ(s) is the twin-ladder bridge; "shifted bridge" refers to E_a built from the shifted completed function.`,
          `An off-line zero appears in the kernel as a negative square when uncancelled; the paper calls this a Blaschke ghost.`,
          `The threshold gives no information on the value of Δ; it only translates Δ into a kernel statement.`,
          `Source: src/data/shift-bridge-positivity-section.js (§15 of the twin-ladder paper, endpoint correction from the twin-ladder audit).`,
        ],
      },
    ],
    physicsAnalogy: {
      system: 'Two-dimensional electrostatics: the logarithmic potential of point charges in a plane (equivalently, infinite parallel line charges in 3D).',
      mapping: [
        'Zeros of X ↔ unit charges; log|X(w)| ↔ the potential at w (up to a constant).',
        'Comparing |X(w + a)| with |X(w − a)| ↔ comparing the potential at two probes placed symmetrically about w.',
        'All charges on the centre line ↔ RH: for Re w > 0 the right probe is farther from every charge, since (x + a)² > (x − a)².',
        'A charge at horizontal offset δ > a ↔ the right probe can sit on it, and the comparison fails.',
      ],
      whereItBreaks:
        'There are infinitely many charges and the plain sum of potentials diverges; the proof must group charges in symmetric packets and use the Hadamard product. The test is a sign comparison at pairs of points, not an energy, and no physical charge distribution is known to produce ξ.',
    },
    examples: [
      { level: 'beginner', title: 'Dial below and above Δ', body: `X(w) = w² − 0.09: a = 0.1 fails at w = 0.2 (0 vs 0.08); a = 0.5 passes (0.40 vs 0).` },
      { level: 'intermediate', title: 'Packet identity', body: `8ax(x² + Y² + a² − δ²) = 0.16 = |Q(0.7)|² − |Q(−0.3)|² at x = 0.2, a = 0.5, δ = 0.3.` },
      { level: 'advanced', title: 'Witness point', body: `A hypothetical zero 1/2 + 0.1 + 100i and dial a = 0.05 give z_ρ = −100 + 0.05i, where E_a = 0.` },
    ],
    whyItMatters:
      `The a-dial converts "how far are the zeros from the line" into a one-parameter family of positivity statements. It is the entry point to the four closure routes (§16) and to the Blaschke-ghost picture of off-line zeros as negative squares. It is a reformulation, not a bound: it gives no estimate of Δ, RH is open, and no Λ bound moves.`,
    example:
      `Repo number: the twin-ladder audit corrected the endpoint — the strict threshold includes a = Δ — and separated strict diagonal positivity from fixed-a PSD (shift-bridge-positivity-section.js, endpointAndCoprimalityCaveat).`,
    pitfalls: [
      `The fixed-a theorem is about strict diagonal positivity; it is not a fixed-a criterion for positive semidefiniteness when E_a and E_a^# share zeros.`,
      `"Gödelian witness" is an analogy for a self-produced certificate; no incompleteness theorem is involved.`,
      `The threshold being exact does not make Δ computable; the whole difficulty is unchanged.`,
    ],
    prerequisites: ['xi-function', 'critical-strip', 'de-branges-spaces', 'complex-number'],
    mentions: ['complex-number', 'xi-function', 'functional-equation', 'critical-strip', 'critical-line', 'riemann-hypothesis', 'de-branges-spaces', 'entire-function', 'bridge-chi', 'closure-routes', 'blaschke-ghosts', 'rh-equivalent-statement', 'twin-ladder', 't3-strip'],
    furtherReading: [
      { label: 'Shift-bridge positivity (§15)', route: '/shift-bridge-positivity' },
      { label: 'Closure routes A–D (§16)', route: '/closure-routes' },
      { label: 'L. de Branges, Hilbert Spaces of Entire Functions (Prentice–Hall, 1968)', url: scholar('de Branges Hilbert spaces of entire functions 1968') },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────────────────────────
  'closure-routes': {
    slug: 'closure-routes',
    term: 'Closure routes A–D',
    intro:
      `The closure routes are four ways the twin-ladder paper tried to finish its argument. Each is a positivity or "size never exceeds 1" statement about the shifted completed zeta function. The paper proves all four are equivalent to each other and to RH, so they share a single bottleneck: proving any one of them without already assuming another.`,
    levels: [
      {
        level: 'beginner',
        heading: 'Four doors into the same room',
        paragraphs: [
          `Write X(w) = ξ(1/2 + w), the completed zeta function re-centred on the critical line (ξ is ζ multiplied by a Gamma factor so that the functional equation is the symmetry ξ(s) = ξ(1−s)). Let Δ be the largest horizontal distance of any zero from the line; RH is the statement Δ = 0 ("zero bridge thickness").`,
          `Route A (Schur contractivity): the ratio X(w − a)/X(w + a) has size less than 1 to the right of the line, for every shift a > 0. Route B (de Branges positivity): a certain kernel built from the shifted function is positive for every a > 0. Route C (hidden square): that kernel can be written as a sum of squares, built directly from ξ's integral formula without knowing the zeros. Route D (Weil / twin-ladder norm): a quadratic form made of an archimedean part minus a sum over prime "delays" is never negative.`,
          `"Equivalent" means: a proof of any one of them is a proof of RH, and none is easier than the others. The paper's Theorem 16.1 proves the equivalence; it does not prove any of the four.`,
        ],
        analogy:
          `Four doors into the same locked room. Opening one door opens them all, but finding that the doors are connected does not give you a key.`,
        example:
          `Route D's prime "delays" are the numbers m log p with weights (log p) p^(−m/2). The first few: log 2 = 0.693 with weight 0.490; log 3 = 1.099 with weight 0.634; log 4 = 1.386 (p = 2, m = 2) with weight 0.347; log 5 = 1.609 with weight 0.720. Route D asks that the archimedean part always outweighs every combination of these delayed echoes.`,
      },
      {
        level: 'intermediate',
        heading: 'Statements and the obstruction each one meets',
        paragraphs: [
          `Route A: |X(w − a)/X(w + a)| < 1 for Re w > 0 and all a > 0, equivalently |ξ(s − a)| < |ξ(s + a)| for Re s > 1/2. The natural proof is the maximum principle (an analytic function's modulus is largest on the boundary): on the boundary Re w = 0 the ratio has modulus exactly 1. But the maximum principle needs the ratio to be analytic, i.e. X(w + a) ≠ 0 in the right half-plane — which is the zero-free statement itself. Route A is circular without an independent zero-free region.`,
          `Route B: the shifted kernel K_a is positive semidefinite for all a > 0. A de Branges space (a Hilbert space of entire functions with this kernel as reproducing kernel) exists unconditionally for shifts outside the strip; extending to every positive shift is RH.`,
          `Route C: K_a(ζ, z) = ⟨B_a(z), B_a(ζ)⟩ for some map B_a built non-circularly from the kernel Φ in X(w) = ∫₀^∞ Φ(u) cosh(wu) du. Expanding cosh gives a Wronskian-type kernel whose cross terms in two independent integration variables are sign-indefinite, so any square must come from a non-local transform; none has been constructed.`,
          `Route D: Q_TL[h] = A_∞[h] − 2 Σ_p Σ_{m≥1} (log p) p^(−m/2) Re C_h(m log p) ≥ 0 for all admissible h. This is the Weil explicit formula written in log-prime delay coordinates; under RH the zero side is Σ_γ |ĥ(γ)|².`,
        ],
        math: [
          T`\text{A:}\ \left|\frac{X(w-a)}{X(w+a)}\right|<1\quad(\operatorname{Re}w>0,\ a>0)`,
          T`\text{B:}\ K_a\succeq0\ \ \forall a>0\qquad \text{C:}\ K_a(\zeta,z)=\langle B_a(z),B_a(\zeta)\rangle_{\mathcal H_a}`,
          T`\text{D:}\ Q_{TL}[h]=A_\infty[h]-2\sum_p\sum_{m\ge1}(\log p)\,p^{-m/2}\operatorname{Re}C_h(m\log p)\ \ge 0`,
        ],
        example:
          `Route A on a toy: for X(w) = w² + 1 (zeros on the line), at w = 1 and a = 0.1 the ratio is |X(0.9)|/|X(1.1)| = 1.81/2.21 = 0.819 < 1. For X(w) = w² − 0.09 (off-line zeros at ±0.3) and a = 0.1, at w = 0.2 the ratio is 0.08/0 — infinite — so Route A fails, as it must when Δ = 0.3 > a.`,
      },
      {
        level: 'advanced',
        heading: 'Theorem 16.1, the shared bottleneck, and what the project measured',
        paragraphs: [
          `Theorem 16.1: A ⟺ B ⟺ C ⟺ D ⟺ Δ = 0 ⟺ RH. The shared bottleneck (§16.6) is to prove zero bridge thickness non-circularly. The "Gödelian witness principle" records that an off-line zero ρ = 1/2 + δ + iγ with 0 < a < δ produces z_ρ(a) = −γ + i(δ − a) with E_a(z_ρ(a)) = 0, certifying failure of strict Hermite–Biehler positivity; it certifies a pole, a negative square (a "Blaschke ghost"), or PSD failure only when not cancelled by a common zero of E_a^# (residual multiplicity controls the negative index).`,
          `Later no-go results classify the routes. Routes A–C use only properties of the profile Φ that flow-blindness shows are preserved by the backward heat flow, so no proof using only those properties can close them. Route D is the one route containing prime (arithmetic) input; it is Weil positivity, and on the ladder's native span NS-RIGID reduces it to Pick matrices of ξ'/ξ, where every finite truncation is either soft or RH-refuting. Route I is the project's support-restricted attack on Route D.`,
          `Project measurements on the K_a ≥ 0 residual of the §26 μ-pass analysis — built from the same antisymmetric Wronskian entry Φ(u)Φ(v) sinh(a(v − u)) that appears in Route C — split it into a sign question (closed: fixed by Φ alone) and a magnitude question (binding: the shear operator norm ≈ 0.876 at lag ≤ 0.2, of which a lag-stationary 1D Toeplitz surrogate — an operator depending only on the difference of its two arguments — captures only about 3%).`,
        ],
        details: [
          `Conjecture 16.4 (shift-bridge square): the hidden square exists and is built directly from Φ. Open, RH-equivalent.`,
          `Conjecture 16.6 (canonical-system closure, §16.7): Θ_a is the transfer function of a passive canonical system built directly from Φ, equivalently Schur for every a > 0. A strengthened form of Route C; open, implies RH.`,
          `Sources: src/data/closure-routes-section.js, /closure-routes; flow-blindness-no-go.js; imp-95530 (NS-RIGID).`,
        ],
      },
    ],
    physicsAnalogy: {
      system: 'Passive (energy-non-generating) electrical networks, where several classical criteria for passivity are known to be equivalent.',
      mapping: [
        'Route A ↔ the reflection coefficient of a passive network has modulus at most 1 (a Schur function).',
        'Route B ↔ the network\'s "energy kernel" (Pick matrix) is positive semidefinite.',
        'Route C ↔ the network can be realised by actual components: a factorisation K = B*B is like a state-space or Darlington realisation.',
        'Route D ↔ the energy absorbed for every input signal is non-negative.',
        'Theorem 16.1 ↔ the classical equivalence of these passivity criteria.',
      ],
      whereItBreaks:
        'For rational impedances (finitely many components) the equivalences come with algorithms that check passivity. Here the "network" is defined by ξ itself, has infinitely many zeros and poles of the ratio, and the equivalence only shows that the four checks are equally hard. There is no physical device whose passivity is known for independent reasons.',
    },
    examples: [
      { level: 'beginner', title: 'Route D delays', body: `(log 2, 0.490), (log 3, 0.634), (log 4, 0.347), (log 5, 0.720): delays m log p with weights (log p)p^(−m/2).` },
      { level: 'intermediate', title: 'Route A on toys', body: `Ratio 0.819 < 1 for w² + 1 at w = 1, a = 0.1; infinite for w² − 0.09 at w = 0.2, a = 0.1.` },
      { level: 'advanced', title: 'K_a ≥ 0 magnitude residual', body: `Shear operator norm ≈ 0.876 (lag ≤ 0.2); a 1D Toeplitz surrogate captures ≈ 3% (imp-3197-mupass-bridge-sign-phi-only.js).` },
    ],
    whyItMatters:
      `The closure routes are where the twin-ladder paper's chain of reductions ends. Knowing that all four are RH-equivalent, and that three of them use only flow-invariant ("soft") properties, told the project that the paper's program cannot be finished by estimates on the ladder and that any progress must come through Route D's prime input — which is where Route I picks up. RH is open; no Λ bound moves.`,
    example:
      `Repo number: in the K_a ≥ 0 residual (imp-3197), the binding magnitude obstruction is the shear operator norm ≈ 0.876 at lag ≤ 0.2, of which a lag-stationary 1D Toeplitz surrogate captures only ≈ 3% (a ≈ 33× under-report); the sign half is fixed by Φ alone.`,
    pitfalls: [
      `Equivalence is not progress: Theorem 16.1 proves the four statements stand or fall together, not that any of them holds.`,
      `Route A's maximum-principle argument is circular for small a: it presupposes the zero-free region it is meant to prove.`,
      `Route D is not a new criterion; it is Weil's explicit-formula positivity in delay coordinates.`,
    ],
    prerequisites: ['xi-function', 'shift-bridge-threshold', 'de-branges-spaces', 'weil-positivity'],
    mentions: ['xi-function', 'functional-equation', 'critical-line', 'riemann-hypothesis', 'shift-bridge-threshold', 'de-branges-spaces', 'entire-function', 'hidden-square-program', 'weil-explicit-formula', 'weil-positivity', 'rh-equivalent-statement', 'blaschke-ghosts', 'flow-blindness', 'heat-flow-ht', 'ns-rigid', 'route-i-weil-ladder', 'twin-ladder', 'toeplitz-matrix'],
    furtherReading: [
      { label: 'Closure routes A–D (§16)', route: '/closure-routes' },
      { label: 'Shift-bridge positivity (§15)', route: '/shift-bridge-positivity' },
      { label: 'Flow-blindness no-go', route: '/flow-blindness-no-go' },
      { label: 'Novel routes roadmap (Route I)', route: '/rh-novel-routes-roadmap' },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────────────────────────
  'de-branges-spaces': {
    slug: 'de-branges-spaces',
    term: 'de Branges spaces',
    intro:
      `A de Branges space is a space of smooth complex functions built from a single generating function E whose zeros all lie on one side of the real axis. Whether a shifted version of the completed zeta function can serve as such a generator is equivalent to a statement about where its zeros are. Louis de Branges proposed positivity conditions in this setting that would imply RH; one of them was shown to fail (Conrey–Li, 2000), and RH remains open.`,
    levels: [
      {
        level: 'beginner',
        heading: 'Functions whose zeros all sit on one side',
        paragraphs: [
          `An entire function is a complex function given by a power series that converges everywhere, like a polynomial, e^z, or sin z. Its zeros are the points where it equals 0.`,
          `A Hermite–Biehler function E is an entire function that is larger above the real axis than at the mirror point below: |E(z)| > |E(z̄)| whenever z is in the upper half-plane (z̄ is the complex conjugate, the reflection of z across the real axis). For a polynomial this happens exactly when every zero lies strictly below the real axis.`,
          `From such an E one builds a de Branges space: a collection of entire functions with a way of measuring their size (a Hilbert-space norm) in which "evaluate at the point w" is given by an explicit kernel function K(w, z). The kernel is automatically positive. The connection to the zeta function: shift the completed zeta function by a and ask whether the shifted function is Hermite–Biehler. That holds exactly when no zeta zero is more than a to the right of the critical line, so asking it for every a > 0 is RH.`,
          `What this leaves out: the spaces relevant to zeta use functions with infinitely many zeros and a precise growth rate; the polynomial picture shows the mechanism, not the analytic details.`,
        ],
        analogy:
          `In engineering, a filter whose zeros all lie in one half of the complex frequency plane is called minimum-phase; it is the stable, well-behaved kind. A Hermite–Biehler function is the same idea: all its zeros are on the "safe" side.`,
        example:
          `E(z) = z + i has its only zero at −i, below the axis. At z = 2i: |E(2i)| = |3i| = 3, and at the mirror point |E(−2i)| = |−i| = 1; 3 > 1, as required. E(z) = z − i fails: its zero i is above the axis, and |E(i)| = 0 < |E(−i)| = 2. For one factor z − z_k with z_k = c − ib (b > 0) and z = x + iy (y > 0): |z − z_k|² − |z̄ − z_k|² = (y + b)² − (y − b)² = 4yb > 0.`,
      },
      {
        level: 'intermediate',
        heading: 'Definition, kernel, and the Paley–Wiener example',
        paragraphs: [
          `Let E^#(z) = conj E(z̄). E is Hermite–Biehler (class HB) if |E^#(z)| < |E(z)| for Im z > 0. The de Branges space H(E) consists of entire F such that F/E and F^#/E belong to the Hardy space H²(ℂ₊) (analytic in the upper half-plane with bounded L² norms on horizontal lines), with norm ‖F‖² = ∫ |F(x)/E(x)|² dx over the real line.`,
          `H(E) is a reproducing-kernel Hilbert space: F(w) = ⟨F, K(w, ·)⟩ with the kernel below. When E and E^# have no common zeros, positivity of K corresponds to the Hermite–Biehler property (|E^#/E| ≤ 1 in the upper half-plane).`,
          `Standard example: E(z) = e^(−iaz). Then |E(x + iy)| = e^(ay) > e^(−ay) = |E^#(x + iy)| for y > 0, and H(E) is the Paley–Wiener space PW_a of entire functions of exponential type at most a that are square-integrable on the real line — the band-limited signals with frequencies in [−a, a]. The kernel is the sinc kernel of Shannon sampling.`,
          `For zeta: with Ξ(z) = ξ(1/2 + iz), the shifted function E_a(z) = Ξ(z + ia) is Hermite–Biehler ⟺ Ξ has no zero with imaginary part above a ⟺ ζ has no zero with Re s > 1/2 + a. This is the project's T3(a) statement. It holds unconditionally for a > 1/2; for every a > 0 it is RH.`,
        ],
        math: [
          T`E^{\#}(z)=\overline{E(\bar z)},\qquad E\in\mathrm{HB}\iff |E^{\#}(z)|<|E(z)|\ \ (\operatorname{Im}z>0)`,
          T`K(w,z)=\frac{E(z)\overline{E(w)}-E^{\#}(z)\overline{E^{\#}(w)}}{2\pi i\,(\bar w-z)}`,
          T`E(z)=e^{-iaz}\ \Longrightarrow\ K(w,z)=\frac{\sin a(z-\bar w)}{\pi\,(z-\bar w)}`,
        ],
        example:
          `Check the Paley–Wiener kernel: E(z)E(w)‾ − E^#(z)E^#(w)‾ = e^(−ia(z − w̄)) − e^(ia(z − w̄)) = −2i sin(a(z − w̄)); dividing by 2πi(w̄ − z) gives sin(a(z − w̄))/(π(z − w̄)). On the diagonal at a real point, K(x, x) = a/π > 0.`,
      },
      {
        level: 'advanced',
        heading: 'de Branges theory and RH: what is proved and what failed',
        paragraphs: [
          `de Branges' structure theory (1968) shows that the spaces H(E) are ordered in chains described by canonical systems (a differential-equation description of the kernel), and gives an indefinite (Pontryagin) version where finitely many negative squares are allowed (Krein–Langer). In the project's twin-ladder language an off-line zero shows up as a negative square of a shifted kernel — a "Blaschke ghost".`,
          `de Branges proposed sufficient positivity conditions on the generating function that would imply RH. Conrey and Li (IMRN 2000) showed that the proposed condition fails for ζ (and for L-functions), so that particular route does not work as stated. Lagarias (2006) studied de Branges spaces attached to ζ and Dirichlet L-functions; Burnol related Sonine spaces (functions vanishing with their Fourier transform on an interval) to de Branges spaces.`,
          `In this project: Route B of the closure routes is de Branges positivity of the shifted kernel K_a for all a > 0 (RH-equivalent); the flow-blindness module lists the standard ingredients of this apparatus (positivity and decay of the profile Φ, functional symmetry, log-concavity, total positivity of Wronskians) as hypotheses preserved by the backward heat flow, so they cannot by themselves imply RH.`,
        ],
        details: [
          `E_a = Ξ(· + ia) ∈ HB for a > 1/2 unconditionally; for all a > 0 ⟺ RH.`,
          `Fixed-a PSD of the shifted kernel needs a coprimality condition (common zeros of E_a and E_a^# leave PSD zero rows); see the shift-bridge threshold.`,
          `References: L. de Branges, Hilbert Spaces of Entire Functions (1968); J. B. Conrey, X.-J. Li, IMRN 2000; J. C. Lagarias, Frontiers in Number Theory, Physics and Geometry I (2006).`,
        ],
      },
    ],
    physicsAnalogy: {
      system: 'Band-limited signals and minimum-phase (stable, causal) filters in signal processing.',
      mapping: [
        'Paley–Wiener space PW_a ↔ signals containing only frequencies in [−a, a].',
        'Reproducing kernel sin(a(z − w̄))/(π(z − w̄)) ↔ the sinc interpolation kernel of Shannon sampling.',
        'Hermite–Biehler generator ↔ a minimum-phase transfer function: all zeros on one side of the frequency axis.',
        'E_a = Ξ(· + ia) being Hermite–Biehler ↔ asking whether the shifted ξ is such a "well-behaved" generator.',
      ],
      whereItBreaks:
        'For a physical filter one can locate the zeros by measurement or algebra. For Ξ the question "are all zeros on one side after shifting by a" is the zero-free strip statement, so the analogy organises the problem without giving a way to check it. Ξ has infinitely many zeros, so finite-filter design rules do not apply.',
    },
    examples: [
      { level: 'beginner', title: 'One factor', body: `E(z) = z + i: |E(2i)| = 3 > |E(−2i)| = 1. E(z) = z − i fails at z = i.` },
      { level: 'intermediate', title: 'Paley–Wiener diagonal', body: `K(x, x) = a/π; for a = 1, K(x, x) = 0.3183.` },
      { level: 'advanced', title: 'Shift threshold', body: `E_a = Ξ(· + ia) ∈ HB for a > 1/2 (unconditional); RH ⟺ for all a > 0 (flow-blindness-no-go.js dictionary).` },
    ],
    whyItMatters:
      `de Branges spaces are the language in which the twin-ladder paper states its strip (T3) and its closure routes B and C. Knowing that membership of the shifted ξ in this class is exactly a zero-free strip statement, and that de Branges' own sufficient condition fails (Conrey–Li), sets realistic expectations: the framework reformulates RH precisely but has not supplied the missing arithmetic input. RH is open.`,
    example:
      `Repo number: the dictionary E_a(z) = A_a(z) − iB_a(z) = Ξ(z + ia) was checked to 1.1e-15 for the profile e^(−u²) (flow-blindness-no-go.js), confirming that the twin ladder's A_a, B_a are the de Branges pair of the a-shifted ξ.`,
    pitfalls: [
      `A positive de Branges kernel for one shift a does not say anything about smaller shifts.`,
      `de Branges' published positivity condition is known to fail (Conrey–Li 2000); citing de Branges spaces is not citing a proof strategy known to work.`,
      `Strict Hermite–Biehler, PSD kernel and "no negative squares" coincide only when E and E^# have no common zeros.`,
    ],
    prerequisites: ['entire-function', 'complex-number', 'xi-function', 'fourier-transform'],
    mentions: ['entire-function', 'complex-number', 'xi-function', 'critical-line', 'riemann-hypothesis', 'fourier-transform', 't3-strip', 'blaschke-ghosts', 'closure-routes', 'flow-blindness', 'heat-flow-ht', 'sonine-space', 'shift-bridge-threshold', 'twin-ladder'],
    furtherReading: [
      { label: 'Closure routes A–D (Route B)', route: '/closure-routes' },
      { label: 'Flow-blindness no-go', route: '/flow-blindness-no-go' },
      { label: 'RH landscape DAG', route: '/rh-landscape-dag' },
      { label: 'J. B. Conrey, X.-J. Li, A note on some positivity conditions related to zeta and L-functions, IMRN 2000', url: scholar('Conrey Li A note on some positivity conditions related to zeta and L-functions') },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────────────────────────
  'davenport-heilbronn-twin': {
    slug: 'davenport-heilbronn-twin',
    term: 'Davenport–Heilbronn twin',
    intro:
      `The Davenport–Heilbronn function is an imitation of a genuine L-function: it has exactly the same symmetry and the same Gamma factor (the same "bridge"), but it is not built from primes in the Euler-product way. It has zeros off the critical line. In the twin-ladder picture it is a "same-bridge, no-cascade" twin, and it shows that the bridge and the symmetry alone cannot force RH.`,
    levels: [
      {
        level: 'beginner',
        heading: 'An imitation with the right symmetry and the wrong structure',
        paragraphs: [
          `A Dirichlet series is a sum a(1)/1^s + a(2)/2^s + a(3)/3^s + … with chosen coefficients a(n). The zeta function is the case a(n) = 1. An Euler product (a factorisation into one factor per prime) exists only when the coefficients are multiplicative: a(mn) = a(m)·a(n) whenever m and n share no common factor.`,
          `The Davenport–Heilbronn function uses coefficients that repeat every 5 steps: (a(1), a(2), a(3), a(4), a(5)) = (1, κ, −κ, −1, 0), then repeat, with κ ≈ 0.28408. These were chosen so that the function satisfies an exact functional equation (a mirror symmetry between s and 1−s, the analogue of the one ζ satisfies) with the same Gamma factor — the factor built from the Gamma function (the extension of the factorial) that the twin ladder calls the bridge — as a genuine L-function of "conductor 5".`,
          `It nevertheless has zeros off the critical line Re s = 1/2. Below height 130 the project counted 75 zeros: 71 on the line and 2 off-line pairs. The first off-line zero is at 0.8085 + 85.699i.`,
          `What this simplification leaves out: the genuine L-functions it imitates are only conjectured (GRH) to have all zeros on the line; the point of the example is that symmetry plus a Dirichlet series is not enough, not that the genuine ones are known to satisfy GRH.`,
        ],
        analogy:
          `Two light waves can each be well behaved, yet where they overlap they cancel at dark fringes whose positions neither wave has on its own. The Davenport–Heilbronn function is a weighted sum of two genuine L-functions, and its zeros are cancellation points of that sum.`,
        example:
          `Multiplicativity test by hand: 2 and 3 share no factor, so an Euler product would need a(6) = a(2)·a(3) = κ·(−κ) = −0.0807. But 6 leaves remainder 1 when divided by 5, so a(6) = a(1) = 1. Since 1 ≠ −0.0807, there is no Euler product.`,
      },
      {
        level: 'intermediate',
        heading: 'Construction and zeros',
        paragraphs: [
          `Let χ be the odd primitive quartic Dirichlet character mod 5 with χ(2) = i, so (χ(1), χ(2), χ(3), χ(4)) = (1, i, −i, −1); a Dirichlet character is a periodic, completely multiplicative function used to sort integers by residue, and its L-function L(s, χ) = Σ χ(n) n^(−s) has an Euler product. Define F_DH = ((1 − iκ)/2) L(s, χ) + ((1 + iκ)/2) L(s, χ̄) with κ = (√(10 − 2√5) − 2)/(√5 − 1) = 0.2840790438. Its coefficients are a(n) = Re χ(n) + κ Im χ(n), which gives the pattern (1, κ, −κ, −1, 0).`,
          `Both L(s, χ) and F_DH have the Gamma factor (5/π)^(s/2) Γ((s + 1)/2). F_DH satisfies Λ_F(s) = Λ_F(1 − s) with root number 1, whereas L(s, χ) satisfies Λ(s, χ) = ε Λ(1 − s, χ̄) with ε = 0.8507 + 0.5257i: they share the Gamma factor (the bridge), not literally the same functional equation.`,
          `Zeros below height 130 (tlb-dh-blind-2026-09-28.js): argument-principle total 75; 71 on the line (first ones at 5.094, 8.940, 12.134, …); off-line pairs at 0.80852 + 85.69935i and 0.65083 + 114.16334i, each with its mirror 1 − ρ̄; none with real part above 1 below 130.`,
        ],
        math: [
          T`F_{DH}(s)=\tfrac{1-i\kappa}{2}L(s,\chi)+\tfrac{1+i\kappa}{2}L(s,\bar\chi),\qquad \kappa=\frac{\sqrt{10-2\sqrt5}-2}{\sqrt5-1}`,
          T`\Lambda_F(s)=\Bigl(\frac{5}{\pi}\Bigr)^{s/2}\Gamma\!\Bigl(\frac{s+1}{2}\Bigr)F_{DH}(s)=\Lambda_F(1-s)`,
          T`-\frac{F'}{F}(s)=\sum_{n\ge2}c(n)\,n^{-s}`,
        ],
        example:
          `Coefficients of −F'/F (the "prime-side" weights): c(2) = κ ln 2 = 0.19691 for F_DH but 0 for the real part of the Euler arm; c(6) = 1.93636 for F_DH, while for any Euler product c(n) vanishes unless n is a prime power. So the prime side of the explicit formula already differs at n = 2.`,
      },
      {
        level: 'advanced',
        heading: 'DH-BLIND: how wide must a positivity test be to notice?',
        paragraphs: [
          `Weil positivity (the criterion that a quadratic form built from the explicit formula is never negative) is tested with even real g supported in [−a, a]; the Weil form is W_F(g) = (1/2π) ∫ Ω(t) |ĝ(t)|² dt − 2 Σ_{n ≤ e^(2a)} c(n) n^(−1/2) (g∗g)(log n), with Ω(t) = log(5/π) + Re ψ(3/4 + it/2). Define a*_F as the infimum of half-widths a at which W_F takes a negative value. The project's DH-BLIND study (two adversarial referee passes) found:`,
          `PROVED: W_DH ≥ 0 for 2a ≤ 0.78306 by a closed-form bound. CERTIFIED (Arb ball arithmetic, explicit rational test function g₀): W_DH(g₀) < 0 at a = 1.72, so a*_DH ≤ 1.72; the negative direction is carried by the first off-line zero 0.8085 + 85.699i. MEASURED: exact Rayleigh–Ritz bases (restricting the form to a finite basis; the smallest eigenvalue found is an upper bound on the true infimum) give λ_min > 0 for a ≤ 1.70; a = 1.71 is basis-unsettled. The later dag3 certificate upgraded positivity to Arb-certified on 2a ≤ ln 11 for both F_DH and L(s, χ).`,
        ],
        details: [
          `Explicit formula for F_DH validated against its computed zeros on 5 test functions, residuals ≤ 1.2e-13.`,
          `c(n) for L(s, χ) from the same recursion equals Λ(n)χ(n) to 2.8e-30 for n ≤ 3000 (Λ(n) is the von Mangoldt function: log p if n is a power of the prime p, else 0).`,
          `Novelty statement (module): the qualitative point is already in NS-RIGID (d) and Route C; what is new is the quantified radius, the certified negative witness and the c(2) interval. The transfer to ζ is an analogy. No bound on Λ moves.`,
          `Classical reference: Titchmarsh, The Theory of the Riemann Zeta-Function, §10.25; Bombieri–Ghosh, Around the Davenport–Heilbronn function, Russian Math. Surveys 66 (2011).`,
        ],
      },
    ],
    physicsAnalogy: {
      system: 'Interference of two waves.',
      mapping: [
        'L(s, χ) and L(s, χ̄) ↔ two waves, each with its own structure (Euler product).',
        'Weights (1 ∓ iκ)/2 ↔ chosen amplitudes and phases that make the sum symmetric (real on the line after the standard rotation).',
        'Zeros of F_DH ↔ dark fringes where the two waves cancel.',
        'Off-line zeros ↔ cancellation points that need not respect the symmetry line, because cancellation depends on the mix, not on either wave alone.',
      ],
      whereItBreaks:
        'The "waves" are complex functions of a complex variable, not physical oscillations; that each component has its zeros on the line is the unproved GRH. The weights are fixed by an exact algebraic requirement (the functional equation), not by a physical superposition principle.',
    },
    examples: [
      { level: 'beginner', title: 'No Euler product', body: `a(6) = 1 but a(2)·a(3) = −κ² = −0.0807.` },
      { level: 'intermediate', title: 'Zero count below 130', body: `75 zeros: 71 on the line, off-line pairs at 0.80852 + 85.69935i and 0.65083 + 114.16334i.` },
      { level: 'advanced', title: 'Certified negative witness', body: `W_DH(g₀)/‖g₀‖² = −8.0474645199628e-30 at a = 1.72 (Arb), reproduced independently twice.` },
    ],
    whyItMatters:
      `Any proposed proof of RH must use something that the Davenport–Heilbronn function lacks; otherwise it would also "prove" that F_DH has all zeros on the line, which is false. Since the twin-ladder bridge, the functional equation and the Dirichlet-series form are all shared, the missing ingredient must be the Euler product (arithmetic input). The project uses this twin to test whether a given positivity check can detect the Euler product at all (Euler-blindness). PT Λ ≤ 0.2 stands; RH is open.`,
    example:
      `Repo number: the first off-line zero of F_DH is 0.808517182456637 + 85.6993484853776i, and it carries the certified negative Weil-form witness at half-width a = 1.72 (tlb-dh-blind-2026-09-28.js).`,
    pitfalls: [
      `"Same bridge" means the same Gamma factor; L(s, χ) is not self-dual and has root number ε ≈ 0.8507 + 0.5257i, while F_DH has root number 1.`,
      `The example is at conductor 5; for ζ itself the Davenport–Heilbronn argument is an analogy, not a theorem.`,
      `Off-line zeros of F_DH say nothing about zeros of ζ; they only show which hypotheses are insufficient.`,
    ],
    prerequisites: ['dirichlet-l-function', 'euler-product', 'functional-equation', 'davenport-heilbronn-function'],
    mentions: ['dirichlet-l-function', 'euler-product', 'functional-equation', 'gamma-function', 'critical-line', 'grh', 'davenport-heilbronn-function', 'bridge-chi', 'twin-ladder', 'von-mangoldt-function', 'explicit-formula', 'weil-quadratic-form', 'weil-positivity', 'arb-interval-certificate', 'rayleigh-ritz-bound', 'euler-blindness', 'ns-rigid', 'closure-routes', 'riemann-hypothesis'],
    furtherReading: [
      { label: 'Novel routes roadmap', route: '/rh-novel-routes-roadmap' },
      { label: 'Twin-ladder paper roadmap', route: '/twin-ladder-paper-roadmap' },
      { label: 'E. Bombieri, A. Ghosh, Around the Davenport–Heilbronn function, Russian Math. Surveys 66 (2011)', url: scholar('Bombieri Ghosh Around the Davenport-Heilbronn function') },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────────────────────────
  'euler-blindness': {
    slug: 'euler-blindness',
    term: 'Euler-blindness',
    intro:
      `A test is "Euler-blind" if it gives the same verdict for a genuine Euler product and for an imitation that shares its symmetry but has zeros off the line. Such a test cannot be what forces zeros onto the line. The project certified that Weil positivity, restricted to narrow test functions, is Euler-blind at conductor 5.`,
    levels: [
      {
        level: 'beginner',
        heading: 'A test with limited resolution',
        paragraphs: [
          `Weil positivity is a criterion for RH-type statements: a certain quantity built from a test function must never be negative. The quantity has two kinds of terms: an "archimedean" part coming from the Gamma factor (a fixed function attached to the symmetry of the L-function), and a "prime" part that samples the coefficients of the function at integers n.`,
          `A test function that is confined to a window of width 2a only samples integers n up to e^(2a). If 2a is smaller than ln 2 = 0.693, it samples no integer at all beyond 1, and the test only sees the archimedean part. So two functions with the same Gamma factor give exactly the same answer: the test is blind to how they are built from primes.`,
          `The Davenport–Heilbronn twin is the standard imitation: same Gamma factor (built from the Gamma function, the extension of the factorial) as the genuine Dirichlet L-function L(s, χ mod 5) — a zeta-like series whose coefficients follow a pattern repeating mod 5 and which has an Euler product — but no Euler product of its own, and zeros off the line. The question "how wide must the window be before the test tells them apart?" is the Euler-blindness radius.`,
        ],
        analogy:
          `A microscope with limited resolution cannot tell apart two samples that differ only in fine detail. Narrow test functions are low-resolution probes: they see the shared coarse structure (the Gamma factor) and only a few of the integers where the two functions differ.`,
        example:
          `Which integers enter: 2a = 0.6 → e^0.6 = 1.82, none. 2a = ln 3 = 1.0986 → only n = 2. 2a = ln 11 = 2.398 → n = 2, …, 10. At n = 2 the two prime-side weights already differ: c(2) = 0.1969 for the imitation versus 0 for the real part of the genuine one. Yet both forms stay positive up to 2a = ln 11.`,
      },
      {
        level: 'intermediate',
        heading: 'The symbol form and the certified numbers',
        paragraphs: [
          `For real h supported in [−a, a], with ĥ its Fourier transform, the Weil form at conductor 5 can be written as one integral against a "symbol": W(h) = (1/2π) ∫ [Ω(t) − Σ_{2 ≤ n ≤ K} β_n cos(t log n)] |ĥ(t)|² dt, valid for 2a ≤ log(K + 1). Here Ω(t) = log(5/π) + Re ψ(3/4 + it/2) is the archimedean symbol (ψ = Γ'/Γ), and β_n = 2 Re c(n) n^(−1/2), where c(n) are the coefficients of −F'/F.`,
          `At 2a ≤ ln 3 only n = 2 survives: β₂ = √2 κ ln 2 = 0.27847 for the Davenport–Heilbronn function and β₂ = 0 for L(s, χ). The project's Arb certificate (ball arithmetic with rigorous error bounds) gives W_DH(h) ≥ 0.2081 ‖h‖² and W_χ(h) ≥ 0.2923 ‖h‖² there, and both remain positive definite through 2a ≤ ln 11.`,
        ],
        math: [
          T`W(h)=\frac1{2\pi}\int_{\mathbb R}\Bigl[\Omega(t)-\sum_{2\le n\le K}\beta_n\cos(t\log n)\Bigr]|\hat h(t)|^2\,dt,\qquad 2a\le\log(K+1)`,
          T`\Omega(t)=\log\frac5\pi+\operatorname{Re}\psi\!\left(\tfrac34+\tfrac{it}{2}\right),\qquad \beta_n=2\operatorname{Re}c(n)\,n^{-1/2}`,
        ],
        example:
          `Certified lower bounds (dag3-dhblindln3-2026-09-28.js), as multiples of ‖h‖²: at 2a ≤ ln 4 / ln 7 / ln 9 / ln 11 the Davenport–Heilbronn form is ≥ 0.0405 / 8.04e-5 / 6.10e-7 / 6.93e-9 and the Euler arm ≥ 0.1277 / 0.0191 / 0.00417 / 9.87e-4. Both positive: same verdict.`,
      },
      {
        level: 'advanced',
        heading: 'Radius, tiers, and the resolution law',
        paragraphs: [
          `Define a*_F = inf{a : W_F(g) < 0 for some g supported in [−a, a]}. For F_DH: PROVED W_DH ≥ 0 for 2a ≤ 0.78306 (closed-form bound B(a) − β/2 > 0); CERTIFIED (Arb) positive definite through 2a ≤ ln 11; CERTIFIED negative at a = 1.72 (explicit rational g₀); MEASURED onset a* ∈ (1.70, 1.72]. The certified positivity is therefore not sharp: the true onset sits a factor ≈ 1.43 above ln(11)/2.`,
          `Why the onset is so late: by the fixed-support resolution law (Theorem RES-T, NS-RIGID module), a test of half-width a registers an off-line zero at height H with displacement δ only when δ²S⁴T³ exceeds about log(H/2π) (T = 2a, the support half-width of the explicit-formula function g∗g; S = sinh(Tδ/2)/(Tδ/2); leading order in the zero density). The first off-line zero of F_DH is at height 85.7 with δ = 0.31; for it the leading-order threshold is 2a ≈ 2.9, above ln 11 = 2.40 and below the certified failure at 2a = 3.44, so it is invisible to narrow tests.`,
          `Reading (as corrected by referees): at conductor 5, for real test functions and 2a ≤ ln 11, Weil positivity has the same truth value for the Euler product and for the RH-false same-Gamma-factor F_DH, so no positivity certificate at these supports can by itself encode the Euler product. It is a tier upgrade of a known qualitative point (NS-RIGID (d), Route C, small-support folklore), not a sharp no-go, and it does not obstruct extending Route I for ζ; the ζ transfer is an analogy.`,
        ],
        details: [
          `Admissible class for the certificate: all real h ∈ L²(−a, a); no pole terms because both functions are entire.`,
          `β₂ positivity interval at ln 3: Q − β₂G(ln 2) ≥ 0.003926 ‖h‖² for every β₂ ∈ [−5/2, 22/25]; true onset in β₂ between 0.88 and 0.90.`,
          `Certificate method: Legendre–Galerkin (ARB-LEGE machinery ported to conductor 5), Gauss–Legendre quadrature with Bernstein-ellipse bound, LDL factorisation, Hilbert–Schmidt tail; python-flint 0.9.0. Conditional on the classical explicit formula for the zero-sum reading. Internally refereed twice, not externally reviewed.`,
        ],
      },
    ],
    physicsAnalogy: {
      system: 'Resolution-limited imaging (the diffraction limit).',
      mapping: [
        'Test-function half-width a ↔ the probe\'s resolving power; a window of width 2a resolves integers n ≤ e^(2a).',
        'Shared Gamma factor ↔ the coarse structure both samples share.',
        'Euler product vs. its absence ↔ fine structure (a lattice vs. a random packing) that only a fine probe resolves.',
        'Off-line zero at height H ↔ a feature whose detection needs a probe width T that grows with log H (resolution law RES-T: δ²S⁴T³ > log(H/2π)).',
      ],
      whereItBreaks:
        'In imaging, once a probe resolves the difference it produces a different picture. Here the forms do differ in value as soon as n = 2 enters (β₂ = 0.278 vs 0), but blindness is about the sign verdict: both stay positive up to much wider windows. The analogy covers "what is sampled", not "when the sign flips".',
    },
    examples: [
      { level: 'beginner', title: 'Integers sampled', body: `2a < ln 2: none; 2a ≤ ln 3: n = 2; 2a ≤ ln 11: n ≤ 10.` },
      { level: 'intermediate', title: 'Same verdict at ln 3', body: `W_DH ≥ 0.2081‖h‖², W_χ ≥ 0.2923‖h‖² (Arb).` },
      { level: 'advanced', title: 'First failure', body: `Certified negative at a = 1.72 via the off-line zero 0.8085 + 85.699i; measured onset in (1.70, 1.72].` },
    ],
    whyItMatters:
      `Route I certifies Weil positivity for ζ on growing supports. Euler-blindness says that, at least at conductor 5 and supports up to ln 11, such a certificate would also hold for a function violating RH, so the certificate by itself carries no Euler-product information. The arithmetic input that a proof of RH needs must enter through wider supports or another mechanism. No Λ bound moves; PT Λ ≤ 0.2 stands; the project candidate Λ ≤ 0.1758354 remains computer-assisted and unreviewed; RH is open.`,
    example:
      `Repo number: at 2a ≤ ln 11 the Arb certificate gives W_DH ≥ 6.9271e-9 ‖h‖² and W_χ ≥ 9.8742e-4 ‖h‖² (dag3-dhblindln3-2026-09-28.js).`,
    pitfalls: [
      `Euler-blindness here is certified at conductor 5; for ζ it is an analogy.`,
      `It does not say Route I is wrong or useless; it says positivity at these supports does not distinguish Euler products.`,
      `The certified range (2a ≤ ln 11) is not the blindness radius; the measured radius is near a = 1.70–1.72.`,
    ],
    prerequisites: ['weil-positivity', 'davenport-heilbronn-twin', 'explicit-formula'],
    mentions: ['weil-positivity', 'weil-quadratic-form', 'gamma-function', 'dirichlet-l-function', 'euler-product', 'davenport-heilbronn-twin', 'fourier-transform', 'arb-interval-certificate', 'theorem-res-t', 'ns-rigid', 'closure-routes', 'route-i-weil-ladder', 'arb-lege-certificate', 'explicit-formula', 'project-lambda-candidate'],
    furtherReading: [
      { label: 'Novel routes roadmap (Route I)', route: '/rh-novel-routes-roadmap' },
      { label: 'Route I remainder resonance', route: '/viz-imp96103-route-i-remainder-resonance' },
      { label: 'H. Yoshida, On Hermitian forms attached to zeta functions, Adv. Stud. Pure Math. 21 (1992)', url: scholar('Yoshida On Hermitian forms attached to zeta functions') },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────────────────────────
  'flow-blindness': {
    slug: 'flow-blindness',
    term: 'Flow-blindness',
    intro:
      `Flow-blindness is a proved limit on a large family of proof strategies for RH. Running the de Bruijn heat flow slightly backwards changes the completed zeta function into a function that still has every "soft" property one might assume — positivity, symmetry, fast decay — yet has zeros off the line. So no argument that uses only such properties can prove RH; arithmetic input is required.`,
    levels: [
      {
        level: 'beginner',
        heading: 'A property shared by a failing neighbour cannot prove success',
        paragraphs: [
          `The completed zeta function can be written as an integral of a fixed positive function Φ(u) against cos(zu). Multiplying Φ by a gentle bell curve e^(−εu²) (ε a small positive number) gives a new function with an almost identical profile. This multiplication is the "backward heat flow": it is what you get by running the heat equation (the equation of heat diffusion) backwards for time ε.`,
          `The de Bruijn–Newman constant Λ records how far forward or backward one can run this flow before zeros leave the real axis; RH is the statement Λ ≤ 0. Rodgers and Tao proved in 2020 that Λ ≥ 0. Combined, this means: if RH is true, the completed zeta function sits exactly on the edge, and any backward step, however small, produces zeros off the line.`,
          `Now suppose a proof of RH used only properties of Φ like "positive", "even", "decays fast", "log-concave". The bell-curve-multiplied Φ has all of them too. The same proof would then show that the backward-flowed function has all zeros real, which is false. So such a proof cannot exist.`,
          `What this does not say: it does not say RH is false or unprovable. It only rules out proofs whose hypotheses survive the backward step.`,
        ],
        analogy:
          `Water exactly at its freezing point: properties like density or colour are nearly identical just above and just below the transition, so measuring them cannot tell you which side you are on. If RH holds, ξ sits exactly at the transition (Λ = 0), and "soft" properties are like density — the same on both sides.`,
        example:
          `A toy heat flow by hand: H_t(z) = z² − 0.5 − 2t solves the flow equation ∂H/∂t = −∂²H/∂z² (both sides equal −2). Its zeros are ±√(0.5 + 2t). At t = 0 they are real (±0.707); at t = −0.25 they meet at 0; at t = −0.3 they are ±0.316i, off the real axis. This toy has a margin of 0.25 before zeros leave the axis. For the zeta function, Λ ≥ 0 means there is no margin: if RH holds, any backward step at all produces non-real zeros.`,
      },
      {
        level: 'intermediate',
        heading: 'The heat flow H_t and the soft class',
        paragraphs: [
          `Define H_t(z) = ∫₀^∞ e^(tu²) Φ(u) cos(zu) du, with Φ the positive, rapidly decaying Riemann kernel (a sum of theta-function terms) and H₀(z) = ξ(1/2 + iz/2)/8. Differentiating under the integral gives ∂_t H_t = −∂_z² H_t, a backward heat equation in z. De Bruijn (1950) showed that if H_t has only real zeros then so does H_{t'} for t' > t; Newman (1976) showed there is a constant Λ with H_t having only real zeros exactly for t ≥ Λ. RH ⟺ Λ ≤ 0. Bounds: Λ ≥ 0 (Rodgers–Tao 2020), Λ ≤ 0.2 (Platt–Trudgian 2021, the accepted benchmark).`,
          `Call a property of profiles "soft" if it is preserved by Φ ↦ e^(−εu²)Φ for all small ε > 0. Evenness, positivity, doubly-exponential decay and log-concavity are soft (a product of log-concave functions is log-concave). Φ_ε := e^(−εu²)Φ has cosine transform H_(−ε), which has a non-real zero for every ε > 0 because −ε < 0 ≤ Λ.`,
        ],
        math: [
          T`H_t(z)=\int_0^\infty e^{tu^2}\Phi(u)\cos(zu)\,du,\qquad \partial_tH_t=-\partial_z^2H_t`,
          T`\Phi_\varepsilon(u)=e^{-\varepsilon u^2}\Phi(u)\ \Longrightarrow\ \int_0^\infty\Phi_\varepsilon(u)\cos(zu)\,du=H_{-\varepsilon}(z)`,
          T`\text{RH}\iff\Lambda\le0,\qquad 0\le\Lambda\le0.2`,
        ],
        example:
          `Before Rodgers–Tao, Saouter, Gourdon and Demichel (2011) showed Λ > −1.15·10^(−11) using a Lehmer pair (two unusually close zeros). That already gives non-real zeros of H_(−ε) unconditionally for every ε > 1.15·10^(−11); Rodgers–Tao extends this to every ε > 0.`,
      },
      {
        level: 'advanced',
        heading: 'Lemma SL2 and its consequences',
        paragraphs: [
          `SL2 (flow-blindness). For ε > 0, Φ_ε is even, positive, log-concave and doubly-exponentially decaying (the same soft class as Φ), and its cosine transform is Ξ_ε = H_(−ε). Since −ε < 0 ≤ Λ, Ξ_ε has a non-real zero for every ε > 0. Hence Φ_ε satisfies every soft hypothesis Φ does while failing "all zeros real".`,
          `Corollary. No proof of RH whose hypotheses on the profile are invariant under {· e^(−εu²)} can be correct. The module classifies the hypotheses of the de Branges / twin-ladder positivity apparatus (de Branges spaces are Hilbert spaces of entire functions whose positive kernel encodes zero location) (kernel positivity, Wronskian total positivity, log-concavity, decay, functional symmetry) as flow-invariant, so the T3 strip ladder is unreachable by soft means. A proof must invoke what the flow destroys: the exact arithmetic identity of Ξ with ξ (Jacobi theta function, Euler product) — for example, prime-side input such as Weil explicit-formula positivity.`,
          `Ties. It upgrades Newman's remark "RH, if true, is only barely so" to a formal no-go; it is the analytic twin of the frozen-rung ⟺ Platt–Trudgian result (freezing one ladder rung is inert, so the only genuine lever is verified height); and the wall it identifies is a zero-free strip plus flow rigidity, not Montgomery pair correlation. Its refinement NS-RIGID shows that within the twin ladder's native span even arithmetic positivity tests are either soft or already refute RH, unless the full infinite family is used.`,
        ],
        details: [
          `Status: THEOREM, unconditional, resting only on Rodgers–Tao Λ ≥ 0 and closure of the soft class under the Gaussian multiplier.`,
          `Scope: does not say RH is false or unprovable; rules out one large family of strategies and locates what a proof must add.`,
          `References: de Bruijn, Duke Math. J. 17 (1950); Newman, Proc. AMS 61 (1976); Rodgers–Tao, Forum Math. Pi 8 (2020).`,
        ],
      },
    ],
    physicsAnalogy: {
      system: 'Heat diffusion run backwards, near a phase transition.',
      mapping: [
        'H_t ↔ a temperature profile evolving under the heat equation; forward time smooths, backward time sharpens.',
        'Zeros of H_t ↔ marked points carried by the flow: forward in time they become real and spread apart; backward they approach, collide and leave the real axis.',
        'Λ ↔ the time of the last collision; RH ⟺ Λ ≤ 0; Rodgers–Tao ⟺ the zeta profile is not strictly inside the "all real" phase.',
        'Soft property ↔ a bulk property (density, colour) that is continuous across the transition and therefore cannot tell the two phases apart.',
        'Arithmetic input ↔ an order parameter that does change across the transition.',
      ],
      whereItBreaks:
        'The backward heat equation is ill-posed for general initial data; here it is well defined only because Φ decays doubly exponentially. The "phase transition" is a mathematical boundary in a one-parameter family, not a thermodynamic one, and there is no known physical order parameter for RH.',
    },
    examples: [
      { level: 'beginner', title: 'Toy collision', body: `H_t = z² − 0.5 − 2t: zeros ±0.707 at t = 0, collide at t = −0.25, become ±0.316i at t = −0.3.` },
      { level: 'intermediate', title: 'Known bounds on Λ', body: `−1.15e-11 < Λ (2011), 0 ≤ Λ (2020), Λ ≤ 0.22 (Polymath15, 2019), Λ ≤ 0.2 (Platt–Trudgian 2021).` },
      { level: 'advanced', title: 'NS-RIGID witness', body: `Finite Pick tests stay PSD at ε = 1, 10, 100 — ten orders past ε = 1.15e-11 — while Ξ_ε has non-real zeros (imp-95530).` },
    ],
    whyItMatters:
      `Flow-blindness retired the project's sub-threshold "residual-grinding" program on the twin ladder: estimates on soft properties cannot close the T3 strip or the closure routes. It points the project at arithmetic mechanisms (Weil positivity with prime terms, Route I) and at verified height, which is the only lever that has moved the Λ bound. It does not move Λ itself: PT Λ ≤ 0.2 stands and RH is open.`,
    example:
      `Repo number: flow-blindness-no-go.js records the dictionary behind T3 as machine-checked (1.0e-30 / 1.1e-15) and rests the theorem on Rodgers–Tao Λ ≥ 0; the NS-RIGID module measures flowed Pick matrices staying positive at ε = 1, 10 and 100, i.e. at least ten orders of magnitude past ε = 1.15e-11.`,
    pitfalls: [
      `Flow-blindness does not say RH is false or unprovable.`,
      `It does not rule out arguments that use the Euler product or the exact theta-function identity; it rules out arguments that use only flow-invariant properties.`,
      `It is not a statement about pair correlation of zeros (that is a different axis).`,
    ],
    prerequisites: ['heat-flow-ht', 'de-bruijn-newman-constant', 'xi-function'],
    mentions: ['xi-function', 'heat-flow-ht', 'de-bruijn-newman-constant', 'newman-conjecture', 'riemann-hypothesis', 'lehmer-pair', 'platt-trudgian-verified-height', 'de-branges-spaces', 'twin-ladder', 't3-strip', 'euler-product', 'weil-positivity', 'frozen-rung', 'pair-correlation', 'ns-rigid', 'closure-routes', 'route-i-weil-ladder', 'zero-dynamics'],
    furtherReading: [
      { label: 'Flow-blindness no-go (page + PDF)', route: '/flow-blindness-no-go' },
      { label: 'NS-RIGID pencil eigenvalue', route: '/viz-imp95549-ns-rigid-pencil-eigenvalue' },
      { label: 'B. Rodgers, T. Tao, The de Bruijn–Newman constant is non-negative, Forum Math. Pi 8 (2020)', url: 'https://arxiv.org/abs/1801.05914' },
      { label: 'C. M. Newman, Fourier transforms with only real zeros, Proc. AMS 61 (1976)', url: scholar('Newman Fourier transforms with only real zeros 1976') },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────────────────────────
  'ns-rigid': {
    slug: 'ns-rigid',
    term: 'NS-RIGID (native-span softness dichotomy)',
    intro:
      `NS-RIGID is a project theorem about finite positivity tests built from the zeta function's logarithmic derivative. Each such test either passes with some room to spare — in which case it also passes for a slightly heat-flowed function that violates RH, so it cannot prove RH — or it fails, which would disprove RH. Only the complete infinite family of tests is equivalent to RH.`,
    levels: [
      {
        level: 'beginner',
        heading: 'Finite checks cannot certify an edge case',
        paragraphs: [
          `Lagarias proved that RH is equivalent to a positivity property: a certain function built from the completed zeta function ξ, namely its logarithmic derivative ξ'/ξ (the rate of change of log ξ), has positive real part everywhere to the right of the critical line. A classical result from complex analysis (Carathéodory and Pick) turns "positive real part" into a family of checks: pick finitely many points, build a small matrix from the function's values there, and check that the matrix is positive (all its eigenvalues are ≥ 0).`,
          `NS-RIGID asks what any finite collection of these checks can achieve. If RH is true, each finite check passes strictly, with a small margin. A small margin survives a small change to the function. The backward heat flow (multiplying the integral kernel Φ by e^(−εu²) for small ε) is such a small change — and by the Rodgers–Tao theorem it always produces zeros off the line. So each finite check that passes also passes for a function that violates RH. It therefore cannot be the step that proves RH. If instead some finite check fails, RH is false.`,
          `What is left out here: the checks are taken at real points to the right of the line, and the theorem also covers every Hermitian form the twin-ladder machinery can build on its "native span" (the functions it naturally uses), not only Pick matrices.`,
        ],
        analogy:
          `An engineer can test whether a circuit is passive (never generates energy) by measuring its impedance at finitely many frequencies and checking a positivity condition. A circuit that is very slightly active may pass all those finite measurements. Finitely many measurements can catch a clearly active circuit, but they cannot certify one that sits exactly on the boundary.`,
        example:
          `Two points, s = 2 and s = 3. The module's values are φ(2) = ξ'/ξ(2) = 0.06907 and φ(3) = 0.11439. The Pick matrix has entries (φ(s_i) + φ(s_j))/(s_i + s_j − 1): top-left 2(0.06907)/3 = 0.04604, bottom-right 2(0.11439)/5 = 0.04576, off-diagonal (0.06907 + 0.11439)/4 = 0.04586. Its determinant is 0.04604 × 0.04576 − 0.04586² = 3.28 × 10^(−6) > 0, and its eigenvalues are 0.0918 and 3.6 × 10^(−5): positive, but the small eigenvalue is a small margin.`,
      },
      {
        level: 'intermediate',
        heading: 'The flowed Pick matrix',
        paragraphs: [
          `Let H_t(z) = ∫₀^∞ e^(tu²) Φ(u) cos(zu) du (the Polymath15 normalisation, H₀(z) = ξ(1/2 + iz/2)/8) and for real s > 1/2 define φ_ε(s) = (d/ds) log H_(−ε)(−2i(s − 1/2)). Then φ₀ = ξ'/ξ on (1/2, ∞). For a finite node set S = {s₁, …, s_n} ⊂ (1, ∞) put P_S(ε)_ij = (φ_ε(s_i) + φ_ε(s_j))/(s_i + s_j − 1).`,
          `Lagarias' criterion (Acta Arith. 89, 1999): RH ⟺ Re ξ'/ξ(s) > 0 for Re s > 1/2. By the Carathéodory–Pick theory, this is equivalent to P_S(0) ⪰ 0 for every finite S. On the native span E_V = span{e^(−νt) 1_{t>0}} the Weil form — the quadratic form of the Weil explicit formula, the exact balance between sums over zeros and sums over primes — is exactly such a Pick matrix (imp-95520): the primes enter only through the n numbers ζ'/ζ(s_i).`,
        ],
        math: [
          T`\varphi_\varepsilon(s)=\frac{2\int\Phi(u)e^{-\varepsilon u^2}u\sinh(2(s-\frac12)u)\,du}{\int\Phi(u)e^{-\varepsilon u^2}\cosh(2(s-\frac12)u)\,du}`,
          T`P_S(\varepsilon)_{ij}=\frac{\varphi_\varepsilon(s_i)+\varphi_\varepsilon(s_j)}{s_i+s_j-1}`,
          T`\text{RH}\iff P_S(0)\succeq0\ \text{for every finite }S\subset(1,\infty)`,
        ],
        example:
          `Measured λ_min(P_S(ε); G) relative to the Cauchy Gram G (imp-95530), for nodes ν = {1, 2, 4} (s = 1/2 + ν): 3.242e-5 at ε = 0, 2.900e-5 at ε = 1, 1.125e-5 at ε = 10, 3.02e-8 at ε = 100. All positive, ten orders of magnitude past the Lehmer-pair scale ε = 1.15e-11 (a Lehmer pair is two unusually close zeros; it gives the bound Λ > −1.15e-11 on the de Bruijn–Newman constant Λ), while Ξ_ε has non-real zeros at every ε in the sweep.`,
      },
      {
        level: 'advanced',
        heading: 'Theorem NS-RIGID (A1–A6) and the loophole',
        paragraphs: [
          `(A1) Every Hermitian form the machinery can build on E_V(S) from the explicit formula is a function of P_S(0) and the Cauchy Gram. (A2) φ_ε(s) is real-analytic in ε (the denominator is a positive integral). (A3) Under RH, P_S(0) is strictly positive definite for distinct nodes. (A4) Dichotomy: for each finite S, either P_S(0) ≻ 0 and then P_S(ε) ≻ 0 for 0 ≤ ε < ε₀(S) — flow-stable, hence soft in the SL2 sense — or P_S(0) is not PD and RH is false. (A5) The full family {P_S ⪰ 0 : all finite S} is the unique flow-critical member: true at ε = 0 iff RH, false for every ε > 0 (a Carathéodory interpolant agreeing with φ_ε on (1, ∞) must equal φ_ε by the identity theorem). (A6) Lacunary node sets with Σ 1/s < ∞ are Blaschke sequences, the identity-theorem step fails, and they do not reach RH; reaching RH needs Müntz-complete node sets.`,
          `The loophole, stated in the module: inputs that use the Dirichlet coefficients on the critical line directly — mollified moments, Levinson's method as refined by Conrey (more than 41.7% of zeros on the line, Pratt–Robles–Zaharescu–Zeindler 2020), Selberg's positive proportion — are flow-critical and non-circular, but give mean-value or proportion statements; the step to "every zero" is the pointwise wall (averages over many heights do not control a single height). No theorem here closes that class, and the twin-ladder machinery has no object in it.`,
        ],
        details: [
          `Theorem RES-T (same module): a fixed-support Weil test of half-width T excludes an off-line quadruple at height H with displacement δ iff, up to the local configuration, δ²S⁴T³ > log(H/2π), S = sinh(Tδ/2)/(Tδ/2). Hence T_X = 3.88 at X = 3·10^12 (3.17 at 10^6, 4.36 at 10^20).`,
          `Candidate reductions: (a) twin-ladder weld sums A_{k,h} collapse to (b) zero-density estimates (bounds on how many zeros can lie off the line, which give "few", never "none") + a second device, which collapses to (a); (c) non-positive-type explicit formulas collapse by T; (d) Hadamard product, evenness, order 1 and the functional equation are class properties (soft); Davenport–Heilbronn shows functional equation + Dirichlet series do not imply RH.`,
          `Changes no bound; PT Λ ≤ 0.2 remains the benchmark; RH open.`,
        ],
      },
    ],
    physicsAnalogy: {
      system: 'Passivity testing of an electrical circuit from finitely many impedance measurements.',
      mapping: [
        'φ = ξ\'/ξ on Re s > 1/2 ↔ an impedance function; Re φ > 0 ↔ the circuit is passive (Lagarias ⟺ RH).',
        'Pick matrix at nodes s_i ↔ the standard positivity matrix built from impedance values at test frequencies.',
        'Backward heat flow by ε ↔ adding a tiny amount of gain (making the circuit slightly active).',
        'Dichotomy ↔ a finite set of measurements either detects activity outright, or passes with a margin that a sufficiently tiny activity also passes.',
      ],
      whereItBreaks:
        'Real circuits have finitely many components and passivity can be certified algebraically. Here the "circuit" has infinitely many poles (the zeros of ξ), the nodes are restricted to real s > 1, and the full infinite family of measurements is exactly as hard as RH. The analogy describes the logic of the dichotomy, not a method for checking it.',
    },
    examples: [
      { level: 'beginner', title: '2×2 Pick matrix at s = 2, 3', body: `Entries 0.04604, 0.04586, 0.04576; determinant 3.28e-6; eigenvalues 0.0918 and 3.6e-5.` },
      { level: 'intermediate', title: 'Flowed margins', body: `ν = 2^k, k = 0..7: λ_min = 7.266e-8 (ε = 0), 5.958e-8 (1), 1.05e-8 (10); at ε = 100 it reaches the float floor.` },
      { level: 'advanced', title: 'RES-T threshold', body: `At H = 6.0e5, δ = 0.25: predicted T* = 5.18; measured blind at T = 4, detected at T = 5.` },
    ],
    whyItMatters:
      `NS-RIGID closes the question "is there a finite arithmetic positivity test, other than RH itself, that the twin-ladder machinery could prove?" within the machinery's native span: there is none. Together with the A_{k,h} prime-side no-go and Theorem U, it forms the sub-0.14 last-lever closure. It also contains Theorem RES-T, which fixes the T_X = 3.88 ceiling below which fixed-support Weil positivity adds nothing beyond verified height. No bound moves; RH is open.`,
    example:
      `Repo number: φ₀(2) = 0.06906623 and φ₀(3) = 0.11439070 (baked imp-95520 values), and T_X = 3.88 at X = 3·10^12 (imp-95530-native-span-arithmetic-input-rigidity.js).`,
    pitfalls: [
      `A finite Pick check passing is not evidence for RH; NS-RIGID shows it also passes for RH-violating flowed functions.`,
      `The theorem covers the native span of the machinery; the loophole class (moments, Levinson–Conrey) is outside it and not closed.`,
      `Lacunary node sets (Σ 1/s < ∞) never reach RH, even with infinitely many nodes.`,
    ],
    prerequisites: ['flow-blindness', 'lagarias-criterion', 'xi-function', 'weil-positivity'],
    mentions: ['lagarias-criterion', 'xi-function', 'critical-line', 'heat-flow-ht', 'de-bruijn-newman-constant', 'flow-blindness', 'lehmer-pair', 'weil-positivity', 'weil-explicit-formula', 'twin-ladder', 'theorem-res-t', 'localized-barrier-sum', 'zero-density-estimate', 'davenport-heilbronn-twin', 'mollifier', 'levinsons-method', 'critical-line-proportion', 'pointwise-vs-average-wall', 'theorem-u', 'last-lever-closure', 'platt-trudgian-verified-height'],
    furtherReading: [
      { label: 'NS-RIGID pencil eigenvalue', route: '/viz-imp95549-ns-rigid-pencil-eigenvalue' },
      { label: 'Flow-blindness no-go', route: '/flow-blindness-no-go' },
      { label: 'Frontier DAG', route: '/frontier-dag' },
      { label: 'J. C. Lagarias, On a positivity property of the Riemann ξ-function, Acta Arith. 89 (1999)', url: scholar('Lagarias On a positivity property of the Riemann xi-function') },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────────────────────────
  'theorem-u': {
    slug: 'theorem-u',
    term: 'Theorem U (sieve-algebra universality)',
    intro:
      `Theorem U is a project no-go result about rearranging the operations of the twin-ladder "permutation architecture". All those operations, as far as the final number is concerned, live in one commutative algebra generated by simple prime filters. So every rearrangement — any order, grouping or change of coordinates — produces the same number; rearranging can change what is easy to prove, never what is true.`,
    levels: [
      {
        level: 'beginner',
        heading: 'Stacking sieves in a different order does not change what passes',
        paragraphs: [
          `The project's permutation architecture is a catalogue of operations that can be applied to the twin ladder (the chain of prime stages that builds the zeta function) when building a numerical certificate: completing with Gamma factors, reflecting through the bridge, heat-flowing, masking out primes, Fourier-type transforms, and so on. The hope was that a different order or grouping would make a hard inequality — a conditional "Λ ≤ 0.14 contract" — easier to certify.`,
          `The core operations are prime filters. For a prime p, "T_p" keeps only the positions n that are multiples of p, and "Π_p = I − T_p" removes them. These filters commute: applying "remove multiples of 2" then "remove multiples of 3" gives the same result as the other order. Theorem U says that, for the 25 primes up to 97, every expression you can build from these filters, in any order and grouping, followed by any of the exact transforms, collapses to a single filter-combination applied to the data — so the final number is the same in every configuration.`,
          `What the simplification leaves out: the data are weighted sequences with signs (so cancellation matters), and the theorem is an exact algebraic identity. A different configuration can still change which bounds are convenient to prove; it cannot change the value being bounded.`,
        ],
        analogy:
          `A stack of kitchen sieves: a grain passes the stack only if it fits through every mesh, so the order of the sieves does not matter. Theorem U says the twin-ladder operations behave like such a stack.`,
        example:
          `Positions 1 to 12, primes 2 and 3. Remove multiples of 2: {1, 3, 5, 7, 9, 11}; then multiples of 3: {1, 5, 7, 11}. Other order: remove multiples of 3: {1, 2, 4, 5, 7, 8, 10, 11}; then of 2: {1, 5, 7, 11}. Same set. The filters generate exactly 2² = 4 basic pieces: coprime to 6 {1, 5, 7, 11}; divisible by 2 only {2, 4, 8, 10}; by 3 only {3, 9}; by 6 {6, 12}. Every combination of the filters is a sum of these pieces.`,
      },
      {
        level: 'intermediate',
        heading: 'The sieve algebra',
        paragraphs: [
          `Let T_p = diag(1_{p|n}) act on sequences c = (c_n), and Π_p = I − T_p. Let 𝒮 be the algebra generated by the 25 commuting idempotents T_p, p ≤ 97. Then 𝒮 = span{T_d : d | P} with P = ∏_{p ≤ 97} p, dim 𝒮 = 2^25, and its minimal idempotents e_S project onto "n has prime signature S among the primes ≤ 97". In Fourier terms 𝒮 is spanned by Ramanujan sums c_q(n) for q | P (a Ramanujan sum is the sum of e^(2πi a n/q) over residues a coprime to q).`,
          `The sieve R₉₇ = ∏ Π_p keeps the n coprime to every prime ≤ 97. The quantity in the contract is E₉₇ = L(M_A c) with M_A = R₉₇ − A₉₇ I and L a linear functional (a weighted sum).`,
        ],
        math: [
          T`T_p=\operatorname{diag}(\mathbf 1_{p\mid n}),\quad \Pi_p=I-T_p,\quad \mathcal S=\operatorname{span}\{T_d:\ d\mid P\},\ \dim\mathcal S=2^{25}`,
          T`\sum_{h=1}^{p-1}S_c(h/p)=p\sum_{p\mid n}c_n-L(c),\qquad S_c(\alpha)=\sum_n c_n\,e(n\alpha)`,
        ],
        example:
          `Check the identity at p = 2: S_c(1/2) = Σ c_n (−1)^n = 2 Σ_{n even} c_n − Σ c_n. So the "equal-weight one-prime alias family" is literally the p-sub-ladder. The module verified the identity to 1e-12 for p up to 97.`,
      },
      {
        level: 'advanced',
        heading: 'Statement, consequences, and the small-prime closure',
        paragraphs: [
          `Theorem U. Every word of the freeze calculus in {Π_p, T_p, scalars, sums, products, any order or grouping}, followed by the exact transform B_v (Poisson summation is an identity on the scalar) and/or any isometry, then L, equals L(diag(m) c) for a unique m ∈ 𝒮 — the same number in every configuration. Consequences: prime order is irrelevant (all 25! orders give the same E₉₇); block cuts (five-shell, divisor, Heat–Euler fiber) give the same scalar cocycle, so their error budgets cannot be added; isometries (DFT, chirp, twistor) give no gain; replacing A₉₇ I by any diag(r), r ∈ 𝒮, gives cocycle zero only for the sieve itself, so no in-algebra mollifier cancels the alias content. Per-alias objects S_c(a/P), whose Poisson terms are the localized barrier sums A_{k,h}, are a proof-strategy refinement (splitting by residue class) — and that refinement is exactly what imports Dirichlet characters.`,
          `Small-prime closure (§5(i)). In the page normalisation the per-weld constants S̄_p are a pure geometric quantity (no arithmetic): S̄₂ = 0.397, S̄₃ = 0.462, S̄₅ = 0.381, …, S̄₉₇ = 0.0381. The contract budget is R_ex = 0.27969. Even with perfect cross-prime orthogonality, √(Σ_{p≤97} S̄_p) = 1.867, so the best achievable target is R_ex/1.867 = 0.150 < 1: the ℓ²-collapse route is over budget by about 6.7× before any arithmetic enters; the three welds {2, 3, 5} alone give 1.114 > 0.2797.`,
        ],
        details: [
          `An alias e(an/P) has energy fraction 1/φ(q) inside 𝒮, q = P/gcd(a, P) (verified 1.736e-4 = 1/φ(30030)).`,
          `The §5(i) closure and the imp-95519 prime-side no-go (A_{k,h} square-root-cancellation exponent 0 vs 1/2 needed) are complementary, not nested.`,
          `Together with NS-RIGID and the A_{k,h} no-go, Theorem U forms the sub-0.14 last-lever closure. Not a bound; the Λ ≤ 0.14 contract is conditional; PT Λ ≤ 0.2 stands; RH open.`,
        ],
      },
    ],
    physicsAnalogy: {
      system: 'A stack of commuting filters (kitchen sieves, or absorptive colour filters in an optical beam).',
      mapping: [
        'T_p (keep multiples of p) and Π_p (remove them) ↔ individual sieves/filters.',
        'Commutativity ↔ the transmitted result does not depend on stacking order.',
        'Minimal idempotents e_S ↔ the distinct "grain classes" a stack can separate (2^25 of them for 25 primes).',
        'Isometries (Fourier transforms, chirps) ↔ changing the measuring coordinates; the transmitted quantity is unchanged.',
        'Theorem U ↔ every arrangement of the stack is the same overall filter.',
      ],
      whereItBreaks:
        'Physical sieves pass or block whole grains; here the data are signed, complex-weighted sequences, and the quantity of interest is a cancellation-bearing sum. The theorem is an exact algebraic identity — a rearrangement can make an estimate easier or harder to prove even though the value is fixed, which has no counterpart for a sieve stack.',
    },
    examples: [
      { level: 'beginner', title: 'Two sieves on 1..12', body: `Either order leaves {1, 5, 7, 11}; four basic classes = 2².` },
      { level: 'intermediate', title: 'Alias identity at p = 2', body: `S_c(1/2) = 2Σ_{even} c_n − Σ c_n.` },
      { level: 'advanced', title: 'Over budget before arithmetic', body: `√(S̄₂ + S̄₃ + S̄₅) = √1.240 = 1.114 > R_ex = 0.2797; full aggregate 1.867 → Q_target = 0.150.` },
    ],
    whyItMatters:
      `Theorem U closed the permutation architecture as a lever for a Λ bound below 0.2: no reordering of the twin-ladder operations can lower the number to be certified. It moved the project's attention to the genuinely arithmetic inputs (prime sums localised at one height), where the remaining obstruction is a pointwise wall. It derives no bound; the Λ ≤ 0.14 contract is conditional; PT Λ ≤ 0.2 is the accepted benchmark; RH is open.`,
    example:
      `Repo number: the contract surface is |C_{E,17}| < 0.27968819555261474 pointwise on 690,988 ≤ N ≤ 54,799,999; the ℓ²-collapse aggregate √(Σ_{p≤97} S̄_p) = 1.867 over-shoots it by ≈ 6.7× (perm-arch-sieve-universality-no-go-2026-09-22.js).`,
    pitfalls: [
      `"Universality" here means all configurations give the same scalar; it does not mean the scalar is small or large.`,
      `Splitting by residue classes (aliases) is a proof strategy, not a configuration; it is where Dirichlet characters enter.`,
      `The S̄_p asymptotic "~4.8/p" is a loose upper envelope at finite p (effective ≈ 3.70/p at p = 97).`,
    ],
    prerequisites: ['twin-ladder', 'prime-number', 'fourier-transform'],
    mentions: ['twin-ladder', 'prime-number', 'heat-flow-ht', 'bridge-chi', 'fourier-transform', 'localized-barrier-sum', 'dirichlet-l-function', 'mollifier', 'ns-rigid', 'last-lever-closure', 'de-bruijn-newman-constant', 'twistor'],
    furtherReading: [
      { label: 'Permutation architecture', route: '/permutation-architecture' },
      { label: 'Frontier DAG', route: '/frontier-dag' },
      { label: 'Project Λ ≤ 0.1758354 candidate (status)', route: '/lambda-01758354-candidate' },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────────────────────────
  'mirror-descent': {
    slug: 'mirror-descent',
    term: 'Mirror descent',
    intro:
      `Mirror descent is a set of project lemmas about how an off-line zero moves under the de Bruijn heat flow. A zero above the real axis is pulled down by its own mirror image and by neighbours below it; the project proved a sharp lower bound for that pull. Turning the lemma into a bound on Λ needs an unproved assumption: enough zeros near every off-line zero.`,
    levels: [
      {
        level: 'beginner',
        heading: 'Zeros as particles pulled towards a mirror',
        paragraphs: [
          `The de Bruijn heat flow deforms the completed zeta function step by step (it is the heat equation applied to it), and its zeros move as the flow runs. The de Bruijn–Newman constant Λ is the flow time after which all zeros are real; RH says Λ ≤ 0, Rodgers and Tao proved Λ ≥ 0, and the accepted upper bound is Λ ≤ 0.2 (Platt–Trudgian).`,
          `Because the function is real on the real axis, a zero at height y above the axis always has a mirror partner at −y. The equations of motion say the mirror partner pulls the zero down at speed 1/y, and other zeros pull or push depending on where they are. Zeros below it (including real ones) pull it down.`,
          `The barrier method bounds Λ by showing that, by some time t₀, no zero is higher than a height y₀; then Λ ≤ t₀ + y₀²/2. Mirror descent asks: if we knew each high zero has enough neighbours pulling it down, could we reach a smaller t₀ — and so a smaller bound?`,
          `What this leaves out: there are infinitely many zeros, collisions happen, and for t > 0 the moving zeros are zeros of a deformed function that is no longer built from primes.`,
        ],
        analogy:
          `A charged particle near a flat metal sheet is attracted to the sheet as if by an "image charge" behind it at the mirror position. Here the real axis plays the sheet and the conjugate zero plays the image charge.`,
        example:
          `With only the mirror pull, the height obeys dy/dt = −1/y, and falling from y = 1 to y₀ = 0.165 takes time (1 − 0.165²)/2 = 0.486. To finish by t₀ = 0.1314 the neighbours must add a constant pull of at least p = 4.37 (because the time ∫ Y/(1 + pY) dY from 0.165 to 1 equals 0.1314 at p = 4.3743). That would give Λ ≤ 0.1314 + 0.165²/2 = 0.1450.`,
      },
      {
        level: 'intermediate',
        heading: 'Equations of motion and the pair lemma',
        paragraphs: [
          `With H_t(z) = ∫₀^∞ e^(tu²) Φ(u) cos(zu) du and ∂_t H_t = −∂_z² H_t, simple zeros move by dz_k/dt = 2 Σ_{j≠k} 1/(z_k − z_j) (Csordas–Smith–Varga; used rigorously by Rodgers–Tao). For z_k = x + iy the vertical speed is dy/dt = −2 Σ_{j≠k} (y − y_j)/|z_k − z_j|²; the conjugate zero gives the self term −1/y. Horizontally zeros repel; vertically a neighbour below pulls down.`,
          `Pair lemma (proved, all horizontal offsets Δ > 0): with f(h) = h/(Δ² + h²), for a ∈ [0, 2y], f(a) + f(2y − a) ≥ f(2y) = 2y/(Δ² + 4y²), with equality only at a ∈ {0, 2y}. So a conjugate pair of neighbours no higher than z contributes at least 2 × 2y/(Δ² + 4y²) to the downward pull (the "mirror kernel" 2y/(Δ² + 4y²) per zero); a real zero contributes 2y/(Δ² + y²), which is more than one mirror kernel.`,
        ],
        math: [
          T`\frac{dz_k}{dt}=2\sum_{j\ne k}\frac{1}{z_k-z_j},\qquad \frac{dy}{dt}=-2\sum_{j\ne k}\frac{y-y_j}{|z_k-z_j|^2}`,
          T`f(a)+f(2y-a)\ \ge\ f(2y)=\frac{2y}{\Delta^2+4y^2},\qquad f(h)=\frac{h}{\Delta^2+h^2}`,
          T`\Lambda\le t_0+\tfrac12y_0^2\quad\text{if}\quad\int_{y_0}^{1}\frac{dY}{1/Y+p(Y)}\le t_0`,
        ],
        example:
          `Pair lemma by hand with Δ = 1, y = 0.5, a = 0.3: f(0.3) = 0.3/1.09 = 0.275, f(0.7) = 0.7/1.49 = 0.470; sum 0.745 ≥ f(1) = 1/2 = 0.5.`,
      },
      {
        level: 'advanced',
        heading: 'What is proved, what is conditional, what the Palm correction shows',
        paragraphs: [
          `PROVED (each re-derived by at least two referees): the pair lemma; the self-term identity dy/dt ≤ −Σ_ρ 2y/((x − Re ρ)² + 4y²) for a globally topmost simple non-real zero; a higher-neighbour bound K_Y(Δ) for |Δ| ≥ (y + Y)/√3; Poisson domination dy/dt ≤ −1/y + 4y/(η² − y²) − (2y/η) S_t(x, η) for η ≥ √5 y; and a t = 0 Euler-product rate for a hypothetical globally topmost zero (an implication, vacuous under RH, one instant, no Λ bound).`,
          `CONDITIONAL: P15 (i), (ii) + H_desc-mirror(p) ⇒ Λ ≤ t₀ + y₀²/2, modulo flagged residuals (Dini/envelope through collision times, P15 localisation, hypothesis needed for all x ≥ X + 1 and all t ∈ (0, t₀]). For the U = 0.145 row (t₀ = 0.1314, y₀ = 0.165) the required constant pull is p_req = 4.3743.`,
          `Palm correction (referee, model): measured against the correct conditioned-on-a-zero baseline, the neutral rigid-lattice mirror count at y₀ = 0.165 is 2.530 (0.376 of the mean) at the seam, so p_req demands a local surplus of about 1.73× around every off-line zero — not "no shortage". Any such hypothesis below y = 1/2 is pointwise at σ < 1 (NS-RIGID class), and for t > 0 it concerns zeros of H_t, which carry no Euler product. Error-term-free t > 0 models land on Polymath15's Λ = O(1/log X) curve (≈ 0.19 at X = 6e12).`,
        ],
        details: [
          `t = 0 rate at the seam (ln N = 13.446): −6.909 at y = 0.165 vs de Bruijn −6.061; it is not a flow theorem.`,
          `H_desc ⇒ H_desc-mirror; the height-blind count C_t and H_desc are incomparable (real/mirror kernel ratio in (1, 4]).`,
          `Unrefereed empirics on zeta zeros (no data inside the lane 3e12–7.5e16): descent time 0.114 with location-free 1e12 minima, 0.140 with the pair-replacement profile, vs the target 0.1314.`,
          `Status: no new Λ bound; PT Λ ≤ 0.2 stands; NO QED.`,
        ],
      },
    ],
    physicsAnalogy: {
      system: 'A charge near a conducting plane, attracted by its image charge; more generally, particles moving under a two-dimensional inverse-distance interaction.',
      mapping: [
        'Real axis ↔ the conducting plane (mirror).',
        'Conjugate zero at −y ↔ the image charge; self term −1/y ↔ attraction to the image.',
        'Neighbour zeros ↔ other particles; the velocity 2/(z_k − z_j) gives horizontal repulsion and vertical attraction.',
        'Barrier bound Λ ≤ t₀ + y₀²/2 ↔ a deadline by which every particle must have settled close to the plane.',
        'H_desc ↔ an assumption about the local density of particles around each one.',
      ],
      whereItBreaks:
        'The interaction is not ordinary electrostatics: the velocity is the complex conjugate of a Coulomb force, so the vertical component attracts while the horizontal repels. There are infinitely many particles, collisions are singular, and the needed density assumption is a statement about zeros of a deformed function with no physical (or arithmetic) reason to hold pointwise.',
    },
    examples: [
      { level: 'beginner', title: 'Mirror pull alone', body: `Descent from y = 1 to 0.165 takes (1 − 0.0272)/2 = 0.486 without help; to finish by 0.1314 needs extra pull p = 4.37.` },
      { level: 'intermediate', title: 'Pair lemma', body: `Δ = 1, y = 0.5, a = 0.3: 0.275 + 0.470 = 0.745 ≥ 0.5.` },
      { level: 'advanced', title: 'Palm surplus', body: `Neutral Palm count 2.530 (0.376 of mean) at the seam ⇒ required surplus ≈ 1.73×.` },
    ],
    whyItMatters:
      `Mirror descent tested whether the hypothesis that would let the barrier method go below the Route VII floor could be weakened to a natural statement about zero counts. The lemmas are proved, but the hypothesis did not become easier: it is a pointwise surplus of zeros of the flowed function, which no known arithmetic input supplies. It records the model value 0.145 as a conditional target, not a bound. PT Λ ≤ 0.2 stands; RH is open.`,
    example:
      `Repo number: for the U = 0.145 row, t₀ = 0.1314, y₀ = 0.165, p_req = 4.3743, θ_req = 0.650 of the mirror mean at the seam and 0.473 at N1*, Palm surplus factor 1.73 (rh-bridge-mirror-descent-2026-09-25.js).`,
    pitfalls: [
      `The pair lemma is proved; the Λ bound is conditional on H_desc-mirror and on flagged residuals.`,
      `"No shortage of nearby zeros" is the wrong reading; the Palm baseline shows a surplus is required.`,
      `The earlier "Λ 0.1035 / 0.0809 if the mirror mean held pointwise" reading is withdrawn as inconsistent.`,
      `The t = 0 Euler-product rate is one instant for a zero whose existence is unknown; it gives no bound.`,
    ],
    prerequisites: ['zero-dynamics', 'heat-flow-ht', 'barrier-method', 'de-bruijn-newman-constant'],
    mentions: ['heat-flow-ht', 'zero-dynamics', 'de-bruijn-newman-constant', 'riemann-hypothesis', 'platt-trudgian-verified-height', 'barrier-method', 'zero-collision-time', 'euler-product', 'ns-rigid', 'route-vii-lane', 'lambda-log-height-law', 'pointwise-vs-average-wall'],
    furtherReading: [
      { label: 'Mirror descent Poisson kernel', route: '/viz-imp97068-mirror-descent-poisson-kernel' },
      { label: 'Palm mirror surplus comparison', route: '/viz-imp97106-palm-mirror-surplus-comparison' },
      { label: 'B. Rodgers, T. Tao, The de Bruijn–Newman constant is non-negative (arXiv:1801.05914)', url: 'https://arxiv.org/abs/1801.05914' },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────────────────────────
  'route-vii-lane': {
    slug: 'route-vii-lane',
    term: 'Route VII lane',
    intro:
      `Route VII is the project's name for pushing the Polymath15 barrier method to smaller Λ by choosing a smaller flow time t. Each attempt requires a finite "lane" of rows to be checked by computer, and the number of rows grows exponentially as t shrinks. That growth puts a practical floor near Λ ≈ 0.150 (0.145 at a stretch) on this route — a floor for this method, not for Λ.`,
    levels: [
      {
        level: 'beginner',
        heading: 'Why each step down costs exponentially more',
        paragraphs: [
          `The de Bruijn–Newman constant Λ measures how close RH is to failing; RH says Λ ≤ 0, it is known that Λ ≥ 0, and the accepted upper bound is Λ ≤ 0.2 (Platt and Trudgian, 2021). Upper bounds come from the barrier method: pick a flow time t₀ and a small height y₀, then show by computation that no zero can be above height y₀ at time t₀; this gives Λ ≤ t₀ + y₀²/2.`,
          `The computation has three parts. Zeros up to a large height must be known to be on the line (Platt–Trudgian's 3 × 10^12). A "barrier" region is checked so that no zero sneaks past. And all higher regions are checked using an approximation of the zeta function by a finite sum of N terms. For very large N a simple inequality (the triangle inequality: the size of a sum is at most the sum of the sizes) closes the check. Between the verified height and that point there is a "lane" of N-values that must be checked one row at a time.`,
          `The lane's end point N1* grows like e^(c/t): exponential in 1/t. Halving t squares the number of rows. So below some t the computation becomes infeasible — and better computers only move the floor a little.`,
        ],
        analogy:
          `Chemical reaction rates follow the Arrhenius law: the time to get over an energy barrier grows like e^(E/kT), exponentially as the temperature T drops. Here the flow time t plays the temperature, and the lane length grows like e^(c/t).`,
        example:
          `If the row count were e^(2.28/t): at t = 0.2 it is e^(11.4) ≈ 89,000 rows; at t = 0.1 it is e^(22.8) ≈ 8.0 × 10^9 rows — exactly 89,000². Halving t squared the work.`,
      },
      {
        level: 'intermediate',
        heading: 'The barrier theorem, the lane, and the cost law',
        paragraphs: [
          `Polymath15 Theorem 1.2 (arXiv:1904.12438): Λ ≤ t₀ + y₀²/2 given (i) RH up to the verified height, (ii) the barrier: H_t has no zeros crossing a strip x ∈ [X, X + 1] for t ∈ [0, t₀], (iii) H_{t₀}(x + iy) ≠ 0 for x ≥ X and y₀ ≤ y ≤ √(1 − 2t₀). Here H_t is the heat-flowed completed zeta function ξ in the normalisation where x ≈ 2γ, so X = 6.0 × 10^12 matches height 3 × 10^12.`,
          `Hypothesis (iii) is certified with a heat-lifted Dirichlet polynomial with N = √(x/4π) terms. The tail verifier closes when its triangle-inequality contraction is below 1, which by two Arb calibration points happens at (t/2) ln N1* + y/2 = c₀ = 1.2218525, i.e. at an abscissa σ_c ≈ 1.72, close to where ζ(σ) = 2. Rows N from the seam N_seam = 690,988 (x = 4πN² = 6.0e12) up to N1* must be checked individually.`,
          `Calibrated cost law (imp-95218): ln N1*(t, y) = (2c₀ − y)/t + L₀, c₀ = 1.221852, L₀ = 1.1676. The threshold combination stayed constant to 1.6% across a 57× change in N1*, and the verifier's own gate forces ln N1* > (1 + √(1 − 2t))/t → 2/t, so the exponential is built into this architecture.`,
        ],
        math: [
          T`\Lambda\le t_0+\tfrac12y_0^2`,
          T`\ln N_1^*(t,y)=\frac{2c_0-y}{t}+L_0,\qquad c_0=1.221852,\ L_0=1.1676`,
          T`U=t+\tfrac12y^2,\qquad x=4\pi N^2`,
        ],
        example:
          `U = 0.145 row (t₀ = 0.1314, y₀ = 0.165): ln N1* = (2.4437 − 0.165)/0.1314 + 1.1676 = 18.51, N1* = 1.09 × 10^8 rows; at 1.143 CPU-seconds per row that is ≈ 1.44 × 10^3 CPU-days. Consistency check: the project's 0.1758354 package (t = 129/800, y = 0.170795) predicts a minimum N1* ≈ 4.25 × 10^6 and used N* = 6 × 10^6.`,
      },
      {
        level: 'advanced',
        heading: 'Floor, audit, and what the lane is not about',
        paragraphs: [
          `Floor (analysis grade, not a bound on Λ): the reachable floor of the complete-row program is U ≈ 0.150 (t ≈ 0.137, y = 0.165) at the K2 economic budget, with a stretch to 0.145; the 0.14 contract row predicts N1* ≈ 2.85 × 10^8, about 5× the economic line. Going lower needs a tail mechanism that breaks the coupling σ − 1/2 = (t/2) ln N — arithmetic input rather than compute.`,
          `Lane audit (2026-09-22): no unconditional input closes the lane. The lane object sits at abscissa above 1 where zeta has no zeros, so zero-density theorems are vacuous; mean-value inputs lose to the triangle inequality once the exceptional-cell budget (4πN)^(−1) is paid; the heat lift b_n^t = exp((t/4) ln² n) destroys multiplicativity, so Euler-product structure does not transfer to t > 0; and the flow-descent rate is a pointwise von Mangoldt sum at zero-free-region strength. It records one conditional flow-descent theorem (H_desc), developed further as mirror descent.`,
          `Context: Raymond's unrefereed preprint uses a decreasing zero-height barrier with no finite lane; its value 0.149396 lies inside the Route VII band by numerical coincidence, not by the same floor. Every sub-0.2 claim found uses the PT 3e12 height; compute moves the constant in Λ·ln T ≈ 4.3, not the 1/ln T rate.`,
        ],
        details: [
          `Calibration points: t = 129/800 → N1 = 3.84e6; t = 10103/80000, y = 0.165 → N1* = 220,495,706 (Arb, exact boundary at 320/512 bits).`,
          `Caveat: both calibration points have y ∈ [0.165, 0.19]; a second wall ln N1 ≳ c/y as y → 0 is not seen, so the law is a lower estimate of cost at small y.`,
          `Status: PT Λ ≤ 0.2 accepted; project Λ ≤ 0.1758354 candidate computer-assisted, unreviewed, unpublished; RH open.`,
        ],
      },
    ],
    physicsAnalogy: {
      system: 'Thermally activated processes (the Arrhenius law).',
      mapping: [
        'Flow time t ↔ temperature.',
        'Lane length N1* ∝ e^((2c₀ − y)/t) ↔ activation time ∝ e^(E/kT).',
        '2c₀ − y ↔ the activation energy, fixed by the verifier architecture.',
        'Faster computers ↔ a larger prefactor: they shift the floor slightly but do not change the exponential.',
        'Arithmetic input that breaks the σ − 1/2 = (t/2) ln N coupling ↔ a catalyst that lowers the barrier itself.',
      ],
      whereItBreaks:
        'Arrhenius behaviour comes from a Boltzmann distribution over states; here the exponential comes from a deterministic inequality structure in the verifier (where the triangle inequality first closes). There is no thermodynamics, and the law is calibrated on two points only.',
    },
    examples: [
      { level: 'beginner', title: 'Squaring the work', body: `e^(2.28/0.2) ≈ 89,000; e^(2.28/0.1) ≈ 8.0e9 = 89,000².` },
      { level: 'intermediate', title: 'U = 0.145 row', body: `ln N1* = 18.51, N1* = 1.09e8 rows, ≈ 1.44e3 CPU-days.` },
      { level: 'advanced', title: 'Calibration constancy', body: `(t/2) ln N1 + y/2 = 1.31599 at point A and 1.29558 at point B: constant to 1.6% across 57× in N1*.` },
    ],
    whyItMatters:
      `Route VII is the most direct way to lower the project's barrier bounds: keep the Polymath15 architecture and push t down. Its cost law explains why this cannot go far below 0.150 and why the project's sub-0.2 candidates are not routes to Λ → 0. It is the reason the project looked for arithmetic inputs (lane audit, mirror descent, decreasing barriers). PT Λ ≤ 0.2 is the accepted benchmark; RH is open.`,
    example:
      `Repo number: ln N1* = (2c₀ − y)/t + L₀ with c₀ = 1.221852, L₀ = 1.167600, calibrated on N1 = 3,840,000 at t = 0.16125 and N1* = 220,495,706 at t = 0.1262875 (imp-95218-route7-cost-curve.js).`,
    pitfalls: [
      `The Route VII floor is a floor of the fixed-t₀ Polymath15 architecture, not a lower bound on Λ.`,
      `The lane has nothing to do with zeta zeros at the lane heights; it is the price of the triangle inequality.`,
      `Raymond's 0.149396 falling in the band [0.145, 0.150] is a coincidence of values, not of mechanism.`,
    ],
    prerequisites: ['barrier-method', 'de-bruijn-newman-constant', 'heat-flow-ht', 'platt-trudgian-verified-height'],
    mentions: ['de-bruijn-newman-constant', 'riemann-hypothesis', 'platt-trudgian-verified-height', 'barrier-method', 'heat-flow-ht', 'xi-function', 'arb-interval-certificate', 'zero-density-estimate', 'euler-product', 'von-mangoldt-function', 'zero-free-region', 'mirror-descent', 'decreasing-zero-height-barrier', 'project-lambda-candidate', 'lambda-log-height-law', 'verification-height-wall'],
    furtherReading: [
      { label: 'Cost floor', route: '/viz-cost-floor' },
      { label: 'Frontier DAG', route: '/frontier-dag' },
      { label: 'PT-floor audit', route: '/pt-floor-audit' },
      { label: 'D.H.J. Polymath, Effective approximation of heat flow evolution of the Riemann ξ function (arXiv:1904.12438)', url: 'https://arxiv.org/abs/1904.12438' },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────────────────────────
  'route-i-weil-ladder': {
    slug: 'route-i-weil-ladder',
    term: 'Route I (Weil-positivity ladder)',
    intro:
      `Route I is the project's attempt to prove Weil positivity — a statement equivalent to RH — one rung at a time. Each rung allows test functions of a wider window, which lets one more prime into the balance between primes and zeros. The literature has the lowest rung (window width up to ln 2); the project has computer-assisted certificates up to width ln 3 for test functions without pole terms; the next prime brings a structural obstruction.`,
    levels: [
      {
        level: 'beginner',
        heading: 'A balance between primes and zeros, checked one prime at a time',
        paragraphs: [
          `The explicit formula is an exact balance. Pick a smooth "test function" g. On one side, add up a number computed from g at every zero of the zeta function. On the other side put three things: a term from the Gamma factor (built from the Gamma function, the extension of the factorial; this smooth, prime-free part of zeta's symmetry is called the archimedean term), two "pole terms" from the single point where zeta is infinite, and a sum over prime powers n = 2, 3, 4, 5, 7, 8, 9, … of a weight times g(log n). Primes and zeros are two descriptions of the same information.`,
          `Weil positivity: build g as the self-overlap of another function h (slide h across its mirror image and record the overlap; this is called an autocorrelation). If every zero is on the critical line, each zero contributes a square, so the zero side is ≥ 0. Weil proved the converse: if the zero side is ≥ 0 for every such g, then RH holds. So RH is equivalent to "this balance never comes out negative".`,
          `Route I confines h to a window of half-width a, so g lives on width 2a, and only prime powers with log n < 2a appear. That gives a ladder. Width below ln 2 = 0.693: no prime at all, only the archimedean term. Between ln 2 and ln 3 = 1.099: only n = 2. Between ln 3 and ln 4: n = 2 and 3. Each rung adds one prime power. Proving positivity rung by rung is the plan.`,
          `Status. The lowest rung (2a ≤ ln 2) is proved in the literature (Yoshida 1992; Connes–Consani 2021). The project has certificates — computer-assisted, internally refereed, not externally reviewed — for 2a ≤ ln 3, for test functions whose pole terms vanish. What this leaves out: those "pole-free" functions are a subclass; the full criterion also needs the general case and all widths, which is RH.`,
        ],
        analogy:
          `A system of masses and springs is stable exactly when its energy is positive for every way of displacing it, and then every vibration has a real frequency. Weil positivity is the "energy is never negative" test; RH is "every frequency (zero) is real". Route I checks the energy for displacements of limited extent first, adding one long-range spring (prime) per rung.`,
        example:
          `Which prime powers enter: 2a = 1.0 → e^1.0 = 2.72, so only n = 2. 2a = 1.5 → e^1.5 = 4.48, so n = 2, 3, 4. The n = 2 term has weight 2 × (log 2)/√2 = √2 ln 2 = 0.980. On the rung 2a ≤ ln 3 the whole balance is "archimedean term minus 0.980 × (overlap of h at distance ln 2)".`,
      },
      {
        level: 'intermediate',
        heading: 'The Weil form on a window, and the symbol w₁',
        paragraphs: [
          `Take h in L²(−a, a) (square-integrable, zero outside [−a, a]), with Fourier transform ĥ(t) = ∫ h(x) e^(−itx) dx (an entire function). Let g = h ∗ h̃, h̃(x) = conj h(−x), so ĝ(t) = |ĥ(t)|² on the real line and g is supported in [−2a, 2a]. For a zero 1/2 + iγ (γ real if the zero is on the line) the zero side contributes ĥ(γ) conj ĥ(γ̄), which is |ĥ(γ)|² ≥ 0 when γ is real.`,
          `The explicit formula turns the zero side into W(h) = (pole terms in ĥ(±i/2)) + (1/2π) ∫ 2θ'(t) |ĥ(t)|² dt − 2 Σ_n Λ(n) n^(−1/2) Re g(log n), where Λ(n) is the von Mangoldt function (log p if n is a power of the prime p, else 0) and 2θ'(t) = Re ψ(1/4 + it/2) − ln π is the archimedean density (ψ = Γ'/Γ). "Pole-free" means ĥ(±i/2) = 0, which removes the pole terms.`,
          `For 2a ≤ ln 3 only n = 2 contributes (n = 4 would need 2a > 2 ln 2 = 1.386), so on pole-free h the form is (1/2π) ∫ w₁(t) |ĥ(t)|² dt with the symbol w₁(t) = 2θ'(t) − √2 ln 2 cos(t ln 2). The symbol is not positive everywhere: it has a "well" on (0, 3.31), a positive band (3.31, 6.94), a "dip" (6.94, 10.53) caused by the p = 2 cosine, and is positive beyond. Positivity of the form is a cancellation: a function confined to a short window cannot concentrate its Fourier transform inside the negative regions.`,
        ],
        math: [
          T`W(h)=\sum_\gamma \hat h(\gamma)\,\overline{\hat h(\bar\gamma)}\ \overset{\text{RH}}{=}\ \sum_\gamma|\hat h(\gamma)|^2\ \ge 0`,
          T`W(h)=\text{pole}(h)+\frac1{2\pi}\int_{\mathbb R}2\theta'(t)\,|\hat h(t)|^2\,dt-2\sum_{n\ge2}\frac{\Lambda(n)}{\sqrt n}\operatorname{Re}g(\log n)`,
          T`2\theta'(t)=\operatorname{Re}\psi\!\left(\tfrac14+\tfrac{it}2\right)-\ln\pi,\qquad w_1(t)=2\theta'(t)-\sqrt2\,\ln2\,\cos(t\ln2)`,
          T`\text{RH}\iff W(h)\ge0\ \text{for all admissible }h\quad(\text{Weil 1952})`,
        ],
        example:
          `Values of the symbol: w₁(0) = −6.352 (since ψ(1/4) − ln π = −5.372 and √2 ln 2 = 0.980), w₁(5) = +0.699, w₁(9) = −0.620, w₁(12) = +1.085. Despite the negative regions, the ARB-LEGE certificate proves W(h) ≥ 8.2045 × 10^(−4) ‖h‖² for every real pole-free h with 2a ≤ ln 3.`,
      },
      {
        level: 'advanced',
        heading: 'Rungs, certificates, the next-prime obstruction, and the T_X ceiling',
        paragraphs: [
          `Literature. Weil (1952) stated the criterion; Bombieri (2000) gave the standard modern form. Yoshida (1992) and Connes–Consani ("Weil positivity and trace formula, the archimedean place", Selecta Math. 2021) proved positivity for supports where no prime enters (width ln 2), Connes–Consani through a trace-formula argument at the archimedean place. Route H found that crossing ln 2 is an archimedean-vs-p = 2 cancellation (to 5–6 relative digits).`,
          `Route I reformulation. An exact semilocal trace identity for S = {∞, 2}: Tr(ϑ(f) P P̂_S P) = W_∞(f) + W₂(f) + D_S(f), with an unconditionally positive trace side (multiplier minimum 0.0650). It is not gap-free: the remainder D_S carries 96.7% (a = 0.5) and 99.71% (a = (ln 3)/2) of the trace on the pole-free minimiser. Weil positivity on width below ln 3 is equivalent to D_S ≤ L_S between two explicit RH-free functionals. Porting the Connes–Consani Sonine-excess refinement (Sonine spaces are functions that vanish, together with their Fourier transform, on a fixed interval) is obstructed past ln 2 (the excess inherits half the ρ = 2 log cusp; one-prime reach a₂ = 0.565920).`,
          `Certificates on the rung ln 2 < 2a ≤ ln 3 (pole-free h). Toeplitz–Krein: pole-free positivity is exactly positivity of a truncated Toeplitz form (an operator depending only on differences of positions) T_a[σ₂] ≥ 0 with σ₂ = (t² + 1/4)² w₁, proved for 2a ≤ 0.96 by an interval-arithmetic certificate. ARB-LEGE: Legendre–Galerkin in Arb ball arithmetic closes 0.96 < 2a ≤ ln 3 with W(h) ≥ 8.2045e-4 ‖h‖² (9.04e-4 at higher resolution), hence λ₁(T_a[σ₂]) ≥ 0.058268. The p = 2-only pencil crosses at 2a* = 1.1316 through an odd vector; ≈100% of the extremal's negativity sits in the first p = 2 resonance window.`,
          `Next rung. For S ⊇ {2, 3} the positive trace exists abstractly but its remainder is not a regular function: log of the S-units {2^a 3^b} is dense in ℝ (Dirichlet rank > 1), so the one-prime Sonine lever does not extend — an instance of the Weil-support wall (each added prime brings terms with no general positivity proof); adjoining −P₃ to the pencil makes D_S cancel and reduces to W_{∞,2,3} ≥ 0 itself. Euler-blindness: at conductor 5 the analogous positivity is certified through 2a ≤ ln 11 for both the Euler product and the RH-false Davenport–Heilbronn twin, so these rungs carry no Euler-product information by themselves.`,
          `Ceiling T_X. Theorem RES-T: a Weil test of support T (T = 2a in Route I's notation) excludes an off-line zero quadruple at height H and displacement δ only when, up to the local zero configuration, δ²S⁴T³ > log(H/2π), with S = sinh(Tδ/2)/(Tδ/2) (closed-form change of the zero side −2δ²S⁴, checked against Odlyzko zeros at H = 9.9e3, 7.5e4, 6.0e5). Off-line zeros can only exist above the verified height X = 3·10^12, so for T below T_X = 3.88 (the root of (1/4)S(T/2)⁴T³ = log(X/2π)) the test cannot see them: W_T ≥ 0 there adds nothing beyond verified height. Route I's support 2a = ln 3 = 1.099 is about 28% of T_X. Beyond T_X, W_T ≥ 0 would give zero-free regions, not Λ bounds.`,
        ],
        math: [
          T`\operatorname{Tr}\bigl(\vartheta(f)\,P\hat P_SP\bigr)=W_\infty(f)+W_2(f)+D_S(f),\qquad S=\{\infty,2\}`,
          T`\delta^2S^4T^3>\log\frac{H}{2\pi},\qquad S=\frac{\sinh(T\delta/2)}{T\delta/2},\qquad T_X(3\cdot10^{12})=3.88`,
        ],
        details: [
          `Rung ledger: 2a ≤ ln 2 proved (Yoshida 1992; Connes–Consani 2021). 2a ≤ 0.96: Toeplitz–Krein, interval arithmetic (mpmath.iv). 0.96 < 2a ≤ ln 3: ARB-LEGE (python-flint Arb). Both computer-assisted, internally refereed, not externally reviewed; pole-free test functions only.`,
          `T_X = 3.17 at X = 10^6, 3.88 at 3·10^12, 4.36 at 10^20 (imp-95530).`,
          `Route I moves no Λ bound. PT Λ ≤ 0.2 is the accepted benchmark; RH is open.`,
          `Unverified third-party claims (Sept. 2026 preprints asserting support 2a = 1.6) are not used.`,
        ],
      },
    ],
    physicsAnalogy: {
      system: 'Stability of a vibrating mechanical system (masses and springs): stable ⟺ the energy (stiffness form) is positive ⟺ every normal-mode frequency is real.',
      mapping: [
        'Test function h ↔ a displacement pattern; W(h) ↔ the potential energy of that displacement.',
        'Zeros 1/2 + iγ ↔ normal modes; each on-line zero contributes |ĥ(γ)|² ≥ 0, like a mode contributing amplitude² × (frequency² ≥ 0).',
        'An off-line zero ↔ a mode with complex frequency (an instability); its contribution is no longer a square and can make the energy negative.',
        'Archimedean term ↔ the local (short-range) stiffness; prime power n ↔ a long-range coupling of length log n and strength Λ(n)/√n.',
        'Window half-width a ↔ the longest displacement pattern tested; each rung of the ladder switches on one more long-range coupling.',
        'Weil criterion ↔ "energy positive for every displacement" ⟺ "all frequencies real".',
      ],
      whereItBreaks:
        'A finite mechanical system has finitely many modes and its stiffness matrix can be diagonalised. Here there are infinitely many modes and couplings, the energy form is only conditionally convergent, and there is no underlying physical system known to produce the zeros (the Hilbert–Pólya idea is open). The analogy explains why positivity and "all frequencies real" are equivalent; it supplies no mechanism that makes the energy positive.',
    },
    examples: [
      { level: 'beginner', title: 'Prime powers on each rung', body: `2a = 1.0 → n = 2; 2a = 1.5 → n = 2, 3, 4; weight of n = 2 is √2 ln 2 = 0.980.` },
      { level: 'intermediate', title: 'The symbol is negative in places', body: `w₁(0) = −6.352, w₁(5) = +0.699, w₁(9) = −0.620, w₁(12) = +1.085; still W(h) ≥ 8.2045e-4‖h‖² on 2a ≤ ln 3.` },
      { level: 'advanced', title: 'Distance to the ceiling', body: `Support 2a = ln 3 = 1.099 vs T_X = 3.88: Route I is at ≈ 28% of the support where Weil positivity starts to see beyond verified height.` },
    ],
    whyItMatters:
      `Weil positivity is the classical device that converts prime information into zero-location information, and flow-blindness shows that some such arithmetic input is unavoidable for a proof of RH. Route I is the project's direct attack on it. Its results extend the interval-rigorous range of pole-free one-prime positivity from ln 2 to ln 3 and identify exactly why the next prime is harder (dense S-unit resonances). Its limits are equally clear: Euler-blindness at these supports, and the RES-T ceiling T_X = 3.88 below which the positivity adds nothing to verified height. It moves no Λ bound; PT Λ ≤ 0.2 stands; RH is open.`,
    example:
      `Repo numbers: ARB-LEGE certifies W(h) ≥ 8.2045368e-4 ‖h‖² for every real pole-free h with 2a ≤ ln 3 (tlb-arb-lege-2026-09-28.js); the Toeplitz–Krein certificate covers 2a ≤ 0.96 (rh-route-i-toeplitz-krein-certificate-2026-09-24.js); T_X = 3.88 at X = 3·10^12 (imp-95530).`,
    pitfalls: [
      `The project's certificates are for pole-free test functions (ĥ(±i/2) = 0); they are not positivity of the full Weil functional.`,
      `"Certified to ln 3" is computer-assisted and internally refereed; it is not externally reviewed, and novelty against the small-support literature has not been checked.`,
      `The crossing at 2a* = 1.1316 is for the p = 2-only form; past ln 3 the true form also contains p = 3.`,
      `Positivity on narrow windows does not detect the Euler product (Euler-blindness) and does not move Λ.`,
    ],
    prerequisites: ['explicit-formula', 'weil-positivity', 'von-mangoldt-function', 'fourier-transform'],
    mentions: ['explicit-formula', 'weil-explicit-formula', 'weil-positivity', 'weil-quadratic-form', 'riemann-zeta-function', 'gamma-function', 'critical-line', 'riemann-hypothesis', 'von-mangoldt-function', 'fourier-transform', 'pole-free-test-function', 'connes-consani-scaling-site', 'sonine-space', 'toeplitz-matrix', 'toeplitz-krein-certificate', 'arb-lege-certificate', 'arb-interval-certificate', 'interval-arithmetic', 'euler-blindness', 'davenport-heilbronn-twin', 'theorem-res-t', 'platt-trudgian-verified-height', 'flow-blindness', 'weil-support-wall', 'hilbert-polya', 'de-bruijn-newman-constant'],
    furtherReading: [
      { label: 'Novel routes roadmap (Route I)', route: '/rh-novel-routes-roadmap' },
      { label: 'Route I remainder resonance', route: '/viz-imp96103-route-i-remainder-resonance' },
      { label: 'Route I certificate constant ladder', route: '/viz-imp96577-route-i-certificate-constant-ladder' },
      { label: 'Krein certificate margin', route: '/viz-imp96646-krein-certificate-margin' },
      { label: 'A. Connes, C. Consani, Weil positivity and trace formula, the archimedean place (arXiv:2006.13771)', url: 'https://arxiv.org/abs/2006.13771' },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────────────────────────
  'toeplitz-krein-certificate': {
    slug: 'toeplitz-krein-certificate',
    term: 'Toeplitz–Krein certificate',
    intro:
      `The Toeplitz–Krein certificate is a way to prove that a quadratic form is never negative, even though the function defining it dips below zero. It adds a correction that the test functions cannot "see" (because they are confined to a short window) and checks that the corrected function is non-negative everywhere. The project used it, with interval arithmetic, to prove pole-free Weil positivity for all supports 2a ≤ 0.96, past the published ln 2.`,
    levels: [
      {
        level: 'beginner',
        heading: 'Adding something invisible to fill a dip',
        paragraphs: [
          `Many positivity questions have the form: for every test function f confined to a window, is the average of a weight function σ, weighted by the "frequency content" of f, non-negative? If σ is never negative the answer is obviously yes. The difficulty is when σ dips below zero somewhere.`,
          `Functions confined to a short window cannot put all their frequency content into a narrow band (an uncertainty principle), so a narrow dip may be outweighed. A certificate makes that precise: find an extra term ν that contributes exactly zero for every test function in the window, such that σ + ν is non-negative everywhere. Then the original form is non-negative for every test function in the window. The extra terms are oscillations cos(x t) with x at least the window width: they correspond to "distances" the window cannot reach.`,
          `What this leaves out: finding ν is a large optimisation problem, and the check "σ + ν ≥ 0 everywhere" has to be done rigorously on an infinite range, which is why interval arithmetic and tail estimates are needed.`,
        ],
        analogy:
          `A sound recording of duration L cannot contain an echo that arrives later than L. You may add any such late echo to the room's acoustics without changing what the recording measures. The certificate adds "late echoes" that fill the room's dead spots, then checks that the room response is non-negative everywhere.`,
        example:
          `Toy: σ(t) = 1 + 1.5 cos(2t) is negative when cos(2t) < −2/3 (minimum −0.5). For test functions confined to a window of width below 2, the cos(2t) term contributes exactly zero (it only "sees" distance 2). So ν = −1.5 cos(2t) is invisible, σ + ν = 1 ≥ 0, and the form is positive for all such test functions, although σ itself is not.`,
      },
      {
        level: 'intermediate',
        heading: 'Truncated Toeplitz forms and the pole-free reduction',
        paragraphs: [
          `For f in L²(−a, a) with Fourier transform f̂, the truncated Toeplitz form with symbol σ is ⟨T_a[σ] f, f⟩ = (1/2π) ∫ σ(t) |f̂(t)|² dt. (A Toeplitz matrix has constant diagonals; T_a[σ] is its continuous analogue.) It depends only on the inverse Fourier transform of σ on (−2a, 2a), because |f̂|² is the transform of the autocorrelation f ∗ f̃, which vanishes outside that interval.`,
          `For Route I's rung 2a ≤ ln 3, the Weil form on test functions h is the Toeplitz form with symbol w₁(t) = 2θ'(t) − √2 ln 2 cos(t ln 2), where 2θ'(t) = Re ψ(1/4 + it/2) − ln π comes from the Gamma function (ψ = Γ'/Γ). Pole-free means ĥ(±i/2) = 0; by Paley–Wiener this holds exactly when ĥ = (t² + 1/4) ĝ for some g in L²(−a, a). Hence pole-free Weil positivity ⟺ T_a[σ₂] ≥ 0 on all of L²(−a, a), σ₂ = (t² + 1/4)² w₁. The half-pole-free form σ₁ = (t² + 1/4) w₁ (the Connes–Consani "Q-trick") is a stronger statement; near ln 3 its sign is only measured (floating-point Galerkin gives λ_min ≈ +2.1·10⁻⁴ at a = (ln 3)/2), not interval-certified.`,
          `Certificate lemma: let ν(t) = Σ c_{k,j} t^k trig_k(x_j t) with x_j ≥ X₀ (trig_k = cos for even k, sin for odd k). Each atom has Fourier support at ±x_j, so ∫ ν |f̂|² = 0 whenever 2a ≤ X₀. If σ₂ + ν ≥ 0 on ℝ, then T_a[σ₂] ≥ 0 for every 2a ≤ X₀ — all supports at once from one pointwise inequality.`,
        ],
        math: [
          T`\langle T_a[\sigma]f,f\rangle=\frac1{2\pi}\int_{\mathbb R}\sigma(t)\,|\hat f(t)|^2\,dt,\qquad f\in L^2(-a,a)`,
          T`\sigma_2(t)=\bigl(t^2+\tfrac14\bigr)^2w_1(t),\qquad w_1(t)=2\theta'(t)-\sqrt2\ln2\,\cos(t\ln2)`,
          T`\sigma_2+\nu\ge0\ \text{on}\ \mathbb R,\quad \operatorname{supp}\check\nu\subset\{|x|\ge X_0\}\ \Longrightarrow\ T_a[\sigma_2]\succeq0\ \ (2a\le X_0)`,
        ],
        example:
          `The dip of σ₂ is deep: σ₂(9) ≈ −4096 and the minimum is about −4336, inside (6.94, 10.53), while the margin to be certified at (ln 3)/2 is λ_min(T_a[σ₂]) = 0.552 — a relative margin of 1.3 × 10^(−4).`,
      },
      {
        level: 'advanced',
        heading: 'The interval-verified theorem and its limits',
        paragraphs: [
          `Theorem (machine-verified, interval arithmetic). For every 0 < a ≤ 0.48 and every h ∈ L²(−a, a) with ĥ(±i/2) = 0, the Weil form satisfies W(h) = (1/2π) ∫ (2θ' − m₂) |ĥ|² dt ≥ 0, where m₂(t) = 2 ln 2 Σ_k 2^(−k/2) cos(k t ln 2) is the p = 2 prime term. The certificate has atoms on the lattice x_j = 0.02 k_j, k_j ≥ 48 (X₀ = 0.96), degree families k = 0..4, found by a cutting-plane LP (HiGHS) and then verified independently with mpmath.iv at 80 bits: shifted digamma plus Stirling with explicit Binet remainders, cell-wise enclosures of σ₂ and its derivatives, a second-order between-grid guard, and a rigorous tail bound for t ≥ 60. Main certificate: 154 atoms; compact version: 150 atoms at X₀ = 0.90 (ℓ¹ = 53.8).`,
          `Limits. Any margin ε with σ₂ + ν ≥ ε must satisfy ε ≤ λ_min(T_a[σ₂]) (0.552 at (ln 3)/2); the double-precision LP hits its conditioning wall (its condition number makes rounding errors swamp the margin) between 2a = 0.96 and 1.0. The converse (a certificate exists whenever T_a[σ₂] > 0) is the Krein extension theorem for positive-definite distributions on an interval; it is not needed for the sufficiency direction. The two-window "uncertainty" split bound λ_min(T[σ⁺]) − λ_max(T[σ⁻]) fails already at 2a = 0.6026 < ln 2, so splitting the symbol is not a route; the Krein certificate is the exact dual of the cancellation that splitting discards.`,
          `The ARB-LEGE certificate (Arb, Legendre–Galerkin with a rigorous lower bound on the smallest eigenvalue: Galerkin matrix in ball arithmetic plus a Hilbert–Schmidt bound on the truncation tail; a plain Rayleigh–Ritz value would only be an upper bound) closes 0.96 < 2a ≤ ln 3 and gives λ₁(T_a[σ₂]) ≥ 0.058268 on the whole rung, replacing the Krein c♯ cohort's best rigorous floor (−3065.4).`,
        ],
        details: [
          `Published proved range: 2a ≤ ln 2 (Yoshida 1992; Connes–Consani 2021). Project range: 2a ≤ 0.96 (this certificate, interval-verified) and 0.96 < 2a ≤ ln 3 (ARB-LEGE). Computer-assisted, internally refereed, not externally reviewed.`,
          `Same-day siblings (direct Sonine dual LP; primal Galerkin with margin 9.04e-4) are IEEE-double arguments (ordinary floating point without rigorous error enclosure), not interval-verified.`,
          `No positivity for 2a > X₀ is claimed by this certificate. No bound on the de Bruijn–Newman constant Λ moves; RH is open.`,
        ],
      },
    ],
    physicsAnalogy: {
      system: 'Power spectra of time-limited signals, and echoes that arrive after a recording ends.',
      mapping: [
        'Test function f of duration 2a ↔ a short recorded signal; |f̂(t)|² ↔ its power spectrum.',
        'Symbol σ(t) ↔ a frequency-dependent gain; the form ↔ the total output energy.',
        'Negative dip of σ ↔ a band where the "gain" is negative; uncertainty ↔ a short signal cannot put all its power into that band.',
        'Certificate atoms cos(x_j t), x_j ≥ X₀ ↔ echoes delayed beyond the signal\'s autocorrelation length; they change nothing the recording can measure.',
        'σ₂ + ν ≥ 0 ↔ after adding those invisible echoes, the gain is non-negative at every frequency.',
      ],
      whereItBreaks:
        'A physical gain cannot be negative and a physical spectrum is measured, not certified. Here σ is a mathematical symbol from the explicit formula, the "echoes" are distributions (derivatives of point masses), and the check must be rigorous on an infinite frequency range with explicit error bounds.',
    },
    examples: [
      { level: 'beginner', title: 'Invisible cosine', body: `σ = 1 + 1.5 cos 2t (min −0.5); for windows narrower than 2, adding ν = −1.5 cos 2t gives σ + ν = 1.` },
      { level: 'intermediate', title: 'Depth vs margin', body: `Dip of σ₂ ≈ −4336; margin λ_min = 0.552 at (ln 3)/2 (relative 1.3e-4).` },
      { level: 'advanced', title: 'Certificate sizes', body: `154 atoms at X₀ = 0.96; 150 atoms (ℓ¹ = 53.8) at X₀ = 0.90; verified worst midpoint values F ≈ 20.0 / 8.3 / > 0 at X₀ = 0.90 / 0.94 / 0.96.` },
    ],
    whyItMatters:
      `This was the project's first interval-rigorous statement of Weil positivity past the published ln 2: one pointwise inequality, checked with outward rounding, proves positivity for every support up to 0.96. It also settled the right target (σ₂, not the half-pole-free σ₁) and showed why naive "positive part minus dip" bounds fail. Together with ARB-LEGE it covers Route I's rung to ln 3. It moves no Λ bound; PT Λ ≤ 0.2 stands; RH is open.`,
    example:
      `Repo numbers: X₀ = 0.96 > ln 2 = 0.6931 by 0.267; λ_min(T_a[σ₂]) = 56.1 / 7.74 / 0.552 at a = 0.45 / 0.50 / (ln 3)/2, crossing near 2a = 1.13 (rh-route-i-toeplitz-krein-certificate-2026-09-24.js).`,
    pitfalls: [
      `The LP margin is not what is certified; the interval verifier certifies σ₂ + ν ≥ 0 only.`,
      `Pole-free positivity (σ₂) and half-pole-free positivity (σ₁) are different statements; σ₁ near ln 3 is only measured positive in floating point, not certified.`,
      `The certificate proves positivity on the subclass of pole-free test functions, not the full Weil criterion.`,
    ],
    prerequisites: ['toeplitz-matrix', 'fourier-transform', 'pole-free-test-function', 'route-i-weil-ladder'],
    mentions: ['toeplitz-matrix', 'fourier-transform', 'weil-positivity', 'weil-quadratic-form', 'pole-free-test-function', 'route-i-weil-ladder', 'interval-arithmetic', 'arb-lege-certificate', 'connes-consani-scaling-site', 'gamma-function', 'arb-interval-certificate', 'ieee-754-double', 'condition-number', 'rayleigh-ritz-bound', 'de-bruijn-newman-constant'],
    furtherReading: [
      { label: 'Krein certificate margin', route: '/viz-imp96646-krein-certificate-margin' },
      { label: 'Krein c♯ floor ladder', route: '/viz-imp97418-krein-csharp-floor-ladder' },
      { label: 'Novel routes roadmap (Route I)', route: '/rh-novel-routes-roadmap' },
    ],
  },
};

// ════════════════════════════════════════════════════════════════════════════════════════════════
// Class expositions (classes whose members are mostly area-C concepts)
// ════════════════════════════════════════════════════════════════════════════════════════════════

export const classExpositions = {
  'twin-ladder-model-objects': {
    slug: 'twin-ladder-model-objects',
    name: 'Twin-ladder model objects',
    intro:
      `These concepts make up the project's circuit model of the zeta function. Each prime is a stage of a chain (an echo-chamber or resonator); the chain builds ζ(s); a mirror chain builds ζ(1−s); the factor χ(s) bridges the two. On top of this picture the twin-ladder paper builds positivity statements. The model reorganises known identities; the project has proved which of its statements are RH-equivalent and which hypotheses cannot prove RH.`,
    membersOverview: [
      `Stages: euler-factor (one factor 1/(1 − p^(−s)) read as a resonator), zpo (the framework treating primes as resonators), twin-ladder (the two chains for ζ(s) and ζ(1−s) joined by the bridge), transfer-matrix-tp (one stage as a 2×2 matrix) and embedding-a-vs-b (the two different matrix models; results do not transfer between them).`,
      `Network quantities: scattering-matrix, transmission-coefficient, reflection-coefficient, unitarity-deficit and cluster-point-argument describe the truncated ladder as a scattering network; mach-zehnder and intertwiner are interference and representation-theory readings of the bridge.`,
      `The bridge and its statements: bridge-chi (lossless on the critical line), t3-strip (the strip statement, identified with the classical zero-free strip), shift-bridge-threshold (the a-dial), closure-routes (four RH-equivalent finishing statements), blaschke-ghosts (off-line zeros as negative squares), hidden-square-program, volterra-bound and conjecture-22-1.`,
      `Tests of what the model can do: davenport-heilbronn-twin (same bridge, no Euler product, off-line zeros), frozen-rung (inertness of freezing one rung; analytic twin of flow-blindness), seam-pencil-bound, twin-pair-block-floor and phase-alignment-ratio (measured floors of specific ladder certificates).`,
    ],
    physicsAnalogy: {
      system: 'A cascade of optical cavities (or audio comb filters) coupled to a mirror cascade by a lossless phase shifter; equivalently a two-arm interferometer.',
      mapping: [
        'Prime p ↔ a cavity with round-trip delay log p and round-trip loss p^(−σ).',
        'ζ(s) ↔ the transmission of the full cascade (convergent only for σ > 1).',
        'χ(s) ↔ an all-pass coupler; |χ| = 1 on σ = 1/2.',
        'Zeros of ζ ↔ dark fringes (frequencies of zero output).',
      ],
      whereItBreaks:
        'The cascade has no physical meaning in the critical strip where the zeros live; the bridge is shared by functions that have off-line zeros (Davenport–Heilbronn); and flow-blindness shows that properties preserved by the backward heat flow — which include the model\'s structural hypotheses — cannot locate zeros.',
    },
    readingOrder: ['euler-factor', 'zpo', 'twin-ladder', 'bridge-chi', 'transfer-matrix-tp', 'embedding-a-vs-b', 'scattering-matrix', 'mach-zehnder', 't3-strip', 'shift-bridge-threshold', 'closure-routes', 'blaschke-ghosts', 'hidden-square-program', 'davenport-heilbronn-twin', 'frozen-rung', 'conjecture-22-1'],
  },

  'no-go-theorems-and-walls': {
    slug: 'no-go-theorems-and-walls',
    name: 'No-go theorems and standing walls',
    intro:
      `A no-go theorem proves that a whole class of methods cannot reach a goal; a wall is an obstruction that every known method has met but that is not proved to be impassable. Together they map where a proof of RH, or a better bound on Λ, cannot come from, and therefore what kind of input it must use. None of them says RH is false or unprovable.`,
    membersOverview: [
      `Project no-go theorems on the twin ladder: flow-blindness (soft, flow-invariant hypotheses cannot prove RH; rests on Rodgers–Tao Λ ≥ 0), ns-rigid (finite native-span positivity tests are soft or RH-refuting), theorem-res-t (fixed-support Weil tests only see off-line zeros at limited height; ceiling T_X = 3.88), theorem-u (rearranging the ladder's sieve operations never changes the number), euler-blindness (narrow Weil tests cannot tell an Euler product from the Davenport–Heilbronn twin, certified at conductor 5 through 2a ≤ ln 11). localized-barrier-sum and last-lever-closure combine these into the closure of the sub-0.14 levers; route-map-no-shortcut classifies 44 routes.`,
      `Classical walls from the literature: exponential-sum-wall (zero-free regions limited by exponential-sum bounds), pair-correlation-support-barrier, mollifier-length-wall, parity-barrier, siegel-zero, pointwise-vs-average-wall (averages do not give pointwise control), weil-support-wall (each prime adds terms with no general positivity proof), verification-height-wall (fixed verified height caps barrier bounds near c/ln T).`,
      `Project-internal walls and labels: ch-wall (the Gronwall constant of the heat-flow route) and pcc-free (arguments not assuming pair correlation).`,
    ],
    physicsAnalogy: {
      system: 'Conservation laws and impossibility results in physics (e.g. no perpetual-motion machine, the diffraction limit).',
      mapping: [
        'A no-go theorem ↔ a conservation law: it rules out every machine of a given type, without inspecting each design.',
        'Flow-blindness ↔ "no measurement of a quantity that is continuous across a phase transition can tell the phases apart".',
        'Euler-blindness and RES-T ↔ resolution limits: a probe of limited width cannot see features below its resolution.',
        'Theorem U ↔ invariance: changing coordinates or the order of commuting operations cannot change a measured value.',
      ],
      whereItBreaks:
        'Physical impossibility results rest on laws that are accepted empirically; mathematical no-go theorems are proved, but only for the class of methods they describe. A method outside the class (for RH: genuinely arithmetic input such as the Euler product used pointwise) is not ruled out, and walls (as opposed to theorems) may yet be passed.',
    },
    readingOrder: ['flow-blindness', 'ns-rigid', 'theorem-res-t', 'euler-blindness', 'theorem-u', 'localized-barrier-sum', 'last-lever-closure', 'route-map-no-shortcut', 'pointwise-vs-average-wall', 'weil-support-wall', 'verification-height-wall', 'exponential-sum-wall', 'pair-correlation-support-barrier', 'mollifier-length-wall', 'parity-barrier', 'siegel-zero', 'ch-wall', 'pcc-free'],
  },

  'project-routes': {
    slug: 'project-routes',
    name: 'Project routes',
    intro:
      `A route is a named line of attack the project has run, with a recorded status and the wall it met. Some routes aim at upper bounds on the de Bruijn–Newman constant Λ (barrier methods at the verified height); others aim at RH-equivalent positivity statements (Weil positivity, Nyman–Beurling). Each page states what is proved, what is certified by computer, what is measured, and what is conditional.`,
    membersOverview: [
      `Λ-bound routes: route-vii-lane (fixed-t₀ Polymath15 barrier; cost exp(Θ(1/t)) floors it near 0.150), project-lambda-candidate (the Λ ≤ 0.1758354 computer-assisted, unreviewed, unpublished candidate), decreasing-zero-height-barrier (Raymond's unrefereed preprint, 0.149396), route-p (structured floors on the decreasing barrier; conditional values), mirror-descent (proved pair lemma; conditional Λ bound needing a local zero surplus).`,
      `Positivity routes: route-i-weil-ladder (pole-free Weil positivity certified to 2a ≤ ln 3), connes-consani-scaling-site (the Connes–Consani program; archimedean positivity proved), reflection-positivity (Route A of the novel routes; indefinite at every N), route-m-nyman-beurling (Vasyunin Gram matrices; no tightening with N), closure-routes (four RH-equivalent finishing statements of the twin-ladder paper), novel-routes-a-m (the 2026 sweep; routes A–G converge on Weil positivity).`,
      `Accepted benchmark throughout: Platt–Trudgian Λ ≤ 0.2. RH is open.`,
    ],
    physicsAnalogy: {
      system: 'Expeditions up a mountain by different faces, each with a logbook of the highest camp reached and the obstacle that stopped it.',
      mapping: [
        'Route ↔ a face of the mountain; its status ↔ the highest verified camp.',
        'Wall ↔ the obstacle recorded in the logbook (a cliff band, an avalanche zone).',
        'No-go theorem ↔ a survey proving a face cannot lead to the summit.',
        'Computer-assisted, unreviewed result ↔ a camp reached but not yet independently confirmed.',
      ],
      whereItBreaks:
        'Mountain faces are independent physical paths; mathematical routes are often secretly equivalent (several routes reduce to Weil positivity), so "a different face" may be the same face relabelled. The summit (RH) is not known to be reachable at all.',
    },
    readingOrder: ['route-vii-lane', 'project-lambda-candidate', 'decreasing-zero-height-barrier', 'route-p', 'mirror-descent', 'closure-routes', 'route-i-weil-ladder', 'connes-consani-scaling-site', 'novel-routes-a-m', 'reflection-positivity', 'route-m-nyman-beurling'],
  },
};

// ════════════════════════════════════════════════════════════════════════════════════════════════
// Non-throwing validation (call from a test or a node script; never runs at import time)
// ════════════════════════════════════════════════════════════════════════════════════════════════

const wordCount = (s) => (String(s).match(/\S+/g) || []).length;

/** Words of prose across the three levels (headings, paragraphs, analogy, example, details); target 500–1400. */
export function expositionWordCount(e) {
  let n = 0;
  for (const L of e.levels) {
    n += wordCount(L.heading);
    for (const p of L.paragraphs) n += wordCount(p);
    if (L.analogy) n += wordCount(L.analogy);
    if (L.example) n += wordCount(L.example);
    for (const d of L.details || []) n += wordCount(d);
  }
  return n;
}

/** Words of prose across every field of one concept exposition (levels plus intro, physics analogy, examples, etc.). */
export function expositionTotalWordCount(e) {
  let n = expositionWordCount(e) + wordCount(e.intro) + wordCount(e.whyItMatters) + wordCount(e.example);
  for (const p of e.pitfalls || []) n += wordCount(p);
  n += wordCount(e.physicsAnalogy.system) + wordCount(e.physicsAnalogy.whereItBreaks);
  for (const m of e.physicsAnalogy.mapping) n += wordCount(m);
  for (const x of e.examples) n += wordCount(x.body);
  return n;
}

/**
 * Structural checks. `knownSlugs` (optional) is the registry slug set; `knownRoutes` (optional) the set of
 * routes in src/App.jsx. Returns { ok, errors[] } and never throws.
 */
export function validateAreaCExpositions({ knownSlugs = null, knownRoutes = null, classMembers = null } = {}) {
  const errors = [];
  const LEVELS = ['beginner', 'intermediate', 'advanced'];
  for (const [slug, e] of Object.entries(conceptExpositions)) {
    if (e.slug !== slug) errors.push(`${slug}: slug field mismatch`);
    if (!e.intro || !e.whyItMatters || !e.example) errors.push(`${slug}: missing intro/whyItMatters/example`);
    if (!Array.isArray(e.levels) || e.levels.map((l) => l.level).join() !== LEVELS.join()) errors.push(`${slug}: levels must be beginner, intermediate, advanced`);
    if (!e.levels[0]?.analogy) errors.push(`${slug}: beginner analogy missing`);
    if (!e.levels[0]?.example) errors.push(`${slug}: beginner worked example missing`);
    if (!e.physicsAnalogy?.system || !(e.physicsAnalogy?.mapping?.length >= 3) || !e.physicsAnalogy?.whereItBreaks) errors.push(`${slug}: physicsAnalogy incomplete`);
    if (!(e.examples?.length >= 2)) errors.push(`${slug}: need at least two examples`);
    const words = expositionWordCount(e);
    if (words < 500 || words > 1400) errors.push(`${slug}: ${words} words across the levels (target 500–1400)`);
    for (const fr of e.furtherReading || []) {
      if (!fr.label || (!fr.route && !fr.url) || (fr.route && fr.url)) errors.push(`${slug}: furtherReading needs label and exactly one of route/url`);
      if (fr.route && knownRoutes && !knownRoutes.has(fr.route)) errors.push(`${slug}: unknown route ${fr.route}`);
    }
    if (knownSlugs) {
      if (!knownSlugs.has(slug)) errors.push(`${slug}: not in registry`);
      for (const s of [...e.mentions, ...e.prerequisites]) if (!knownSlugs.has(s)) errors.push(`${slug}: unknown slug ${s}`);
    }
    for (const s of e.prerequisites) if (!e.mentions.includes(s)) errors.push(`${slug}: prerequisite ${s} not in mentions`);
    if (e.mentions.includes(slug)) errors.push(`${slug}: mentions itself`);
  }
  for (const [k, c] of Object.entries(classExpositions)) {
    if (!c.intro || !c.membersOverview?.length || !c.physicsAnalogy?.system || !c.readingOrder?.length) errors.push(`class ${k}: incomplete`);
    if (classMembers && classMembers[k]) for (const s of c.readingOrder) if (!classMembers[k].includes(s)) errors.push(`class ${k}: reading-order slug ${s} not a member`);
    if (knownSlugs) for (const s of c.readingOrder) if (!knownSlugs.has(s)) errors.push(`class ${k}: unknown slug ${s}`);
  }
  return { ok: errors.length === 0, errors };
}

export const AREA_C_EXPOSITIONS = conceptExpositions;
export const AREA_C_CLASS_EXPOSITIONS = classExpositions;
export default { conceptExpositions, classExpositions };
