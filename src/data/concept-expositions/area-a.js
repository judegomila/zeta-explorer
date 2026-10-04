/**
 * @module concept-expositions/area-a
 * @fileoverview Layered expositions for the area-A concepts of src/data/concepts-registry.js:
 * classical RH and analytic number theory background. Each page reads on its own: every other concept it
 * uses is explained in a sentence or two where it first appears and is listed in `mentions` (registry slugs).
 *
 * Shape of one entry (keyed by registry slug):
 *   {
 *     slug, term,
 *     intro: string                         2–3 sentences, everyday words, no formulas
 *     levels: [
 *       { level: 'beginner', heading, paragraphs[], analogy?, example? }        high-school maths only
 *       { level: 'intermediate', heading, paragraphs[], math?, example? }       calculus + complex numbers
 *       { level: 'advanced', heading, paragraphs[], math?, details? }           research level
 *     ],
 *     physicsAnalogy: { system, mapping[], whereItBreaks },
 *     examples: [{ title, level, steps[], result }],                            worked, with real numbers
 *     whyItMatters, example, pitfalls[], prerequisites[], mentions[], furtherReading[{label, route|url}]
 *   }
 * `math` items are { tex, note }: tex is a KaTeX string (String.raw), note explains every symbol in it.
 *
 * Class expositions (key = CONCEPT_CLASSES slug): { name, intro, membersOverview[], physicsAnalogy, readingOrder[] }.
 *
 * Status language: Platt–Trudgian Λ ≤ 0.2 is the accepted peer-reviewed benchmark for the de Bruijn–Newman
 * constant. Project results (Route I certificates, the Λ ≤ 0.1758354 candidate, RES-T) are computer-assisted or
 * project-internal, unreviewed and unpublished. RH is open. Nothing here claims a proof of RH.
 *
 * Numbers marked "repo" are copied from the cited modules; the hand-checkable numbers in the examples were
 * recomputed with mpmath (dps 20) when this file was written. Import-free: no zeros bundle, no glossary import.
 */

const T = String.raw;
const R = (label, route) => Object.freeze({ label, route });
const U = (label, url) => Object.freeze({ label, url });

export const AREA_A_EXPOSITIONS = {
  // ══════════════════════════════════════════════════════════════════════════
  'functional-equation': {
    slug: 'functional-equation',
    term: 'Functional equation',
    intro: 'The functional equation is a symmetry of the zeta function: its value at a point and its value at the mirror-image point are tied together by a known correction factor. Because of it, the unknown zeros of zeta come in mirror pairs on either side of a central vertical line. The Riemann Hypothesis says the pairs actually sit on that line.',
    levels: [
      {
        level: 'beginner',
        heading: 'A mirror with a correction factor',
        paragraphs: [
          'The Riemann zeta function ζ(s) starts life as the sum 1 + 1/2^s + 1/3^s + 1/4^s + … . This sum only adds up to a finite number when the real part of s is bigger than 1 (it is the zeta function, slug riemann-zeta-function). Mathematicians extend it to almost every complex number s by a process called analytic continuation (analytic-continuation): there is exactly one smooth way to extend it, and that extension is what "ζ(s)" means elsewhere.',
          'A complex number s = σ + it has a real part σ (left–right position) and an imaginary part t (height) (complex-number). The functional equation says: if you know ζ at s, you know it at the mirror point 1 − s. The mirror is the vertical line where σ = 1/2, called the critical line (critical-line). The point 0.3 + 5i, for example, is mirrored to 0.7 − 5i.',
          'The relation is not "the values are equal". The two values differ by a factor built from π, a sine and the gamma function (gamma-function, the extension of the factorial n! to non-whole numbers). On the critical line this factor has size exactly 1, so ζ has the same size at s and at its mirror image there.',
          'Consequence for zeros: if ζ(ρ) = 0 for some ρ in the strip 0 < σ < 1 (the critical strip, critical-strip), then ζ(1 − ρ) = 0 too, because the factor is finite and non-zero there. Zeros in the strip therefore come in pairs placed symmetrically about the line σ = 1/2. The functional equation does not say they are on the line; that is the open Riemann Hypothesis (riemann-hypothesis).',
        ],
        analogy: 'Think of a mirror that is not perfectly clear: what you see in it is the object multiplied by a tint. The tint (the gamma factor) is known exactly, so the mirror image still tells you everything about the object. Along the middle line the tint is colourless (size 1).',
        example: 'The equation turns the famous sum 1 + 1/4 + 1/9 + … = π²/6 (that is ζ(2)) into the value ζ(−1) = −1/12. Working it by hand: ζ(−1) = 2^(−1) · π^(−2) · sin(−π/2) · Γ(2) · ζ(2) = (1/2) · (1/π²) · (−1) · 1 · (π²/6) = −1/12. The π² cancels. The sum 1 + 2 + 3 + … does not converge; −1/12 is the value of the continued function, not of that divergent sum.',
      },
      {
        level: 'intermediate',
        heading: 'The equation and where it comes from',
        paragraphs: [
          'In its asymmetric form the functional equation is ζ(s) = χ(s) ζ(1 − s), where χ(s) is an explicit ratio of gamma functions and powers of π. In this project χ(s) is called the bridge (bridge-chi) because it carries values from the "dual" side 1 − s to the "direct" side s.',
          'A symmetric form is obtained by multiplying ζ by its archimedean factor π^(−s/2) Γ(s/2). The product is invariant under s ↦ 1 − s. Multiplying once more by s(s − 1)/2 removes the pole at s = 1 and gives the Riemann xi function (xi-function), an entire function with ξ(s) = ξ(1 − s).',
          'Riemann’s proof uses the theta series θ(x) = Σ_{n∈ℤ} e^{−πn²x}. Poisson summation (a fact about the Fourier transform, fourier-transform, which decomposes a function into frequencies: summing a function over the integers equals summing its Fourier transform over the integers) gives θ(1/x) = √x · θ(x). The Mellin transform turns this x ↦ 1/x symmetry into the s ↦ 1 − s symmetry.',
          'Two consequences used everywhere: the sine factor makes ζ(−2) = ζ(−4) = … = 0 (the trivial zeros), and the nontrivial zeros (nontrivial-zeros) are symmetric under ρ ↦ 1 − ρ as well as under complex conjugation ρ ↦ ρ̄, which comes from ζ having real coefficients. An off-line zero would therefore come as a quadruple {ρ, ρ̄, 1 − ρ, 1 − ρ̄}.',
        ],
        math: [
          { tex: T`\zeta(s) = 2^{s}\pi^{s-1}\sin\!\left(\tfrac{\pi s}{2}\right)\Gamma(1-s)\,\zeta(1-s)`, note: 's is a complex number; Γ is the gamma function, Γ(n) = (n − 1)! for whole n; sin is the usual sine extended to complex arguments. At s = −2, −4, … the sine vanishes, giving the trivial zeros.' },
          { tex: T`\chi(s) = \pi^{s-1/2}\,\frac{\Gamma\!\left(\frac{1-s}{2}\right)}{\Gamma\!\left(\frac{s}{2}\right)}, \qquad \zeta(s)=\chi(s)\,\zeta(1-s)`, note: 'The same equation written with the bridge factor χ(s). χ(s)χ(1 − s) = 1.' },
          { tex: T`\bigl|\chi(\tfrac12+it)\bigr| = 1 \quad (t \in \mathbb{R})`, note: 'On the critical line the bridge factor has modulus one: the mirror is lossless there. This is why |ζ(1/2 + it)| = |ζ(1/2 − it)|.' },
          { tex: T`\theta(1/x)=\sqrt{x}\,\theta(x),\qquad \theta(x)=\sum_{n\in\mathbb Z} e^{-\pi n^2 x}`, note: 'Jacobi’s theta identity, the source of the functional equation; x > 0 is a real variable.' },
        ],
        example: 'On the critical line, χ(1/2 + it) = e^{−2iθ(t)}, where θ(t) is the Riemann–Siegel theta function (riemann-siegel-theta), a smooth real phase. At t = 14.1347 (the first zero height) θ = −1.72867 (mpmath), so χ there is the unit complex number e^{3.4573 i}. The Hardy function Z(t) = e^{iθ(t)} ζ(1/2 + it) (hardy-z-function) is real because of this.',
      },
      {
        level: 'advanced',
        heading: 'Completed L-functions, uniqueness, and what symmetry does not decide',
        paragraphs: [
          'Write ζ_∞(s) = π^{−s/2}Γ(s/2) for the archimedean Euler factor. The completed function ζ_∞(s)ζ(s) is meromorphic with simple poles at s = 0, 1 and satisfies ζ_∞(s)ζ(s) = ζ_∞(1−s)ζ(1−s). For a Dirichlet L-function L(s, χ) of conductor q the analogue is Λ(s, χ) = (q/π)^{(s+κ)/2} Γ((s+κ)/2) L(s, χ) = ε(χ) Λ(1 − s, χ̄), κ ∈ {0, 1} the parity and |ε(χ)| = 1 the root number (dirichlet-l-function).',
          'Hamburger’s theorem (1921): a Dirichlet series with the gamma factor and functional equation of ζ, of finite order with finitely many poles, is a constant multiple of ζ. At conductor 1 the functional equation therefore pins down ζ. At higher conductor it does not: the Davenport–Heilbronn function (davenport-heilbronn-function) is a linear combination of two L-functions mod 5 that satisfies a functional equation of the same shape, has no Euler product, and has zeros off its critical line. Symmetry alone does not imply RH.',
          'In the project’s twin-ladder language (twin-ladder: a scattering model in which ζ’s Euler product is a cascade of prime sections and χ is the bridge between the direct and dual arms) the functional equation is the statement that the bridge is lossless on σ = 1/2. The project’s no-go results (euler-blindness, flow-blindness) record that tests depending only on the functional equation and the gamma factor cannot separate ζ from functions that violate RH.',
        ],
        math: [
          { tex: T`\xi(s)=\tfrac12 s(s-1)\pi^{-s/2}\Gamma(\tfrac s2)\zeta(s),\qquad \xi(s)=\xi(1-s)=\overline{\xi(\bar s)}`, note: 'The completed, entire, symmetric form. The two symmetries together make Ξ(t) = ξ(1/2 + it) real for real t.' },
          { tex: T`\Lambda(s,\chi)=\varepsilon(\chi)\,\Lambda(1-s,\bar\chi),\quad |\varepsilon(\chi)|=1`, note: 'Functional equation of a primitive Dirichlet L-function; for non-real χ it relates L(s, χ) to a different function L(s, χ̄).' },
        ],
        details: [
          'Proof sketch (Riemann 1859, second proof): for Re s > 1, ζ_∞(s)ζ(s) = ∫_0^∞ ((θ(x) − 1)/2) x^{s/2} dx/x; split at x = 1, apply θ(1/x) = √x θ(x) on (0, 1), and obtain an expression symmetric in s ↔ 1 − s that converges for all s ≠ 0, 1.',
          'The functional equation gives the Riemann–von Mangoldt count N(T) = (T/2π) log(T/2πe) + 7/8 + S(T) + O(1/T), where the smooth part comes from the gamma factor (the phase θ(t)) and S(T) = (1/π) arg ζ(1/2 + iT).',
          'Symmetric-form features of σ = 1/2 are "RH-blind" (project lesson L1 of the novel-routes sweep, src/data/project-attempts-dag.js): any argument that uses only them also applies to the Davenport–Heilbronn function.',
        ],
      },
    ],
    physicsAnalogy: {
      system: 'Heat on a ring (a thin circular wire of circumference 1), computed two ways.',
      mapping: [
        'Short-time picture: put a unit heat pulse at one point. For small times the temperature is a sum of Gaussian bumps, one for each way of wrapping around the ring (method of images). This is the sum Σ e^{−πn²/x} up to normalisation.',
        'Long-time picture: the same temperature is a sum of Fourier modes e^{2πinθ} decaying at rates n². This is the sum Σ e^{−πn²x}.',
        'Both pictures describe the same physical temperature, so they must agree. That agreement is Jacobi’s identity θ(1/x) = √x θ(x): short time and long time are exchanged, x ↦ 1/x.',
        'The Mellin transform turns "time x" into the complex variable s, and x ↦ 1/x into s ↦ 1 − s. The functional equation of ζ is this short-time/long-time duality of the ring.',
      ],
      whereItBreaks: 'The duality is a symmetry statement only. It says nothing about where the zeros sit; the Davenport–Heilbronn function has a functional equation of the same type and zeros off the line. The "time" variable is a Mellin variable, not physical time, and the ring model does not contain the primes.',
    },
    examples: [
      {
        title: 'ζ(−1) from ζ(2)',
        level: 'beginner',
        steps: [
          'Start from ζ(s) = 2^s π^(s−1) sin(πs/2) Γ(1−s) ζ(1−s) with s = −1.',
          '2^(−1) = 1/2; π^(−2) = 1/π²; sin(−π/2) = −1; Γ(2) = 1! = 1; ζ(2) = π²/6.',
          'Multiply: (1/2)(1/π²)(−1)(1)(π²/6) = −1/12.',
        ],
        result: 'ζ(−1) = −1/12, matching mpmath to 20 digits.',
      },
      {
        title: 'A trivial zero',
        level: 'beginner',
        steps: ['Take s = −2: sin(π·(−2)/2) = sin(−π) = 0.', 'Γ(3) = 2 and ζ(3) ≈ 1.202 are finite, so the right side is 0.'],
        result: 'ζ(−2) = 0. The same works at −4, −6, … . These are the trivial zeros, outside the critical strip.',
      },
    ],
    whyItMatters: 'The functional equation is what makes the critical line special and what makes the zeros symmetric, so that RH can be stated as "the symmetric pairs collapse onto the axis of symmetry". Every zero-counting method (Hardy Z, Gram points, Turing’s method, Platt’s verification to 3·10^12) uses it to turn ζ into a real function on the line. In this project it is the bridge factor χ of the twin-ladder model; results such as Euler-blindness record that the functional equation plus the gamma factor are not enough to force RH, so any proof must also use the Euler product.',
    example: 'ζ(−1) = −1/12 from ζ(2) = π²/6, and |χ(1/2 + it)| = 1 for every real t.',
    pitfalls: [
      'The functional equation does not imply RH. It forces symmetric pairs, not zeros on the line.',
      '"1 + 2 + 3 + … = −1/12" is a misreading: −1/12 is the value of the continued function ζ at −1, not the sum of a divergent series.',
      'ζ(s) and ζ(1 − s) are not equal in general; only the completed function ξ is exactly symmetric.',
    ],
    prerequisites: ['complex-number', 'riemann-zeta-function', 'analytic-continuation', 'gamma-function'],
    mentions: ['riemann-zeta-function', 'analytic-continuation', 'complex-number', 'critical-line', 'gamma-function', 'critical-strip', 'riemann-hypothesis', 'bridge-chi', 'xi-function', 'nontrivial-zeros', 'riemann-siegel-theta', 'hardy-z-function', 'dirichlet-l-function', 'davenport-heilbronn-function', 'twin-ladder', 'euler-blindness', 'flow-blindness', 'fourier-transform'],
    furtherReading: [R('Zeta function explorer', '/zeta'), R('Twin ladder', '/twin-ladder'), R('Hardy Z-function', '/hardy-z'), R('RH equivalents', '/rh-equivalents')],
  },

  // ══════════════════════════════════════════════════════════════════════════
  'xi-function': {
    slug: 'xi-function',
    term: 'Riemann xi function',
    intro: 'The xi function is a cleaned-up version of the zeta function. It removes zeta’s one infinite value and its easy zeros, so that what remains has exactly the interesting zeros and is perfectly symmetric. On the critical line it becomes a real-valued wave, and the Riemann Hypothesis says all of its zeros are crossings of that real wave through zero.',
    levels: [
      {
        level: 'beginner',
        heading: 'Removing the clutter',
        paragraphs: [
          'The zeta function ζ(s) (riemann-zeta-function) has three kinds of special points: a single point s = 1 where it becomes infinite (a pole, slug pole), the "trivial" zeros at −2, −4, −6, …, and the nontrivial zeros inside the vertical strip 0 < Re s < 1 (nontrivial-zeros). Only the last kind is the subject of the Riemann Hypothesis.',
          'Riemann multiplied ζ by a few simple factors chosen to cancel the clutter. The factor (s − 1) cancels the infinity at 1. The gamma-function factor Γ(s/2) (gamma-function, the extension of the factorial) has its own infinities exactly at 0, −2, −4, …, which cancel the trivial zeros. The factor s cancels the leftover infinity at 0. The result, ξ(s), is finite everywhere and its zeros are exactly the nontrivial zeros of ζ.',
          'Because of zeta’s mirror symmetry (functional-equation), ξ satisfies ξ(s) = ξ(1 − s) exactly, with no correction factor. Along the critical line s = 1/2 + it (critical-line) the values of ξ are real numbers. So instead of a complex function you can draw an ordinary graph of Ξ(t) = ξ(1/2 + it) against the height t. Zeros on the line are the places where this graph crosses the axis.',
        ],
        analogy: 'Recording a guitar note in a noisy room: you subtract the hum of the fridge (the pole) and the echo pattern of the room (the trivial zeros and gamma factor). What is left is the clean string vibration, and its silent instants are the nontrivial zeros.',
        example: 'ξ(0) = 1/2, ξ(1) = 1/2 and ξ(2) = π/6 ≈ 0.5236. The last is a hand calculation: ξ(2) = ½·2·1·π^(−1)·Γ(1)·ζ(2) = (1/π)(π²/6) = π/6. At the centre, ξ(1/2) ≈ 0.49712.',
      },
      {
        level: 'intermediate',
        heading: 'Definition, symmetry, and product over zeros',
        paragraphs: [
          'ξ is entire (entire-function: analytic at every complex number). It has order 1: |ξ(s)| grows roughly like exp(|s| log |s|). For such functions Hadamard’s theorem gives a factorisation over the zeros, the analogue of writing a polynomial as a product over its roots.',
          'Combining ξ(s) = ξ(1 − s) with ξ(s̄) = conj ξ(s) shows that Ξ(t) = ξ(1/2 + it) is real and even for real t. The Riemann Hypothesis is the statement that every zero of Ξ is real.',
          'Riemann showed Ξ is a Fourier cosine transform of a positive, rapidly decaying function Φ(u). Pólya and de Bruijn studied what happens when Φ is multiplied by e^{tu²}; this is the heat flow H_t (heat-flow-ht) whose real-zero threshold is the de Bruijn–Newman constant Λ (de-bruijn-newman-constant). In the Polymath15 normalisation used by this project, H_0(z) = (1/8) ξ((1 + iz)/2).',
        ],
        math: [
          { tex: T`\xi(s)=\tfrac12\,s(s-1)\,\pi^{-s/2}\,\Gamma\!\left(\tfrac s2\right)\zeta(s)`, note: 's complex; π^{−s/2} and Γ(s/2) form the archimedean factor; s(s − 1)/2 cancels the poles at 0 and 1.' },
          { tex: T`\xi(s)=\xi(0)\prod_{\rho}\Bigl(1-\frac{s}{\rho}\Bigr)`, note: 'Hadamard product; ρ runs over nontrivial zeros, the product taken with ρ and 1 − ρ grouped together so that it converges. ξ(0) = 1/2.' },
          { tex: T`\Xi(t)=\xi(\tfrac12+it)=4\int_{-\infty}^{\infty}\Phi(u)\,e^{2itu}\,du,\qquad \Phi(u)>0`, note: 't real; Φ(u) = Σ_{n≥1} (2π²n⁴e^{9u} − 3πn²e^{5u}) exp(−πn²e^{4u}) is even, positive and decays faster than exponentially (checked numerically: 8∫_0^∞ Φ = ξ(1/2) = 0.4971208).' },
        ],
        example: 'Ξ(0) = ξ(1/2) ≈ 0.49712 > 0, and Ξ(t) first changes sign at t = 14.134725… (the first zero). Between 0 and 100 there are 29 sign changes; the smooth zero count (T/2π) log(T/2πe) + 7/8 gives 29.002 at T = 100.',
      },
      {
        level: 'advanced',
        heading: 'Entire-function structure and the heat-flow family',
        paragraphs: [
          'ξ is of order 1 and maximal type in the sense of Hadamard. Σ_ρ 1/|ρ|^{1+ε} converges for every ε > 0 and Σ 1/|ρ| diverges. Unconditionally 2 Σ_ρ Re(1/ρ) = 2 + γ − log 4π = 0.0461914 (γ = Euler’s constant); under RH, Re(1/ρ) = (1/2)/|ρ|², so this is Σ_ρ 1/|ρ|². The same number appears as 2λ_1 in the Li criterion (li-criterion) and as Burnol’s constant in the Nyman–Beurling distance (nyman-beurling-criterion).',
          'Because Φ is positive and has the decay above, Ξ belongs to the class studied by Pólya: whether its Fourier transform has only real zeros. The deformation H_t(z) = ∫ e^{tu²}Φ(u) cos(zu) du is the backward/forward heat flow. De Bruijn (1950) showed H_t has only real zeros for t ≥ 1/2; Newman (1976) showed there is a constant Λ with real zeros exactly for t ≥ Λ; Rodgers–Tao (2020) proved Λ ≥ 0; RH is equivalent to Λ = 0. Platt–Trudgian Λ ≤ 0.2 is the accepted peer-reviewed upper bound; this project’s Λ ≤ 0.1758354 is a computer-assisted, unreviewed, unpublished candidate (project-lambda-candidate).',
          'Equivalent forms of RH stated directly on Ξ: hyperbolicity of all Jensen polynomials of its Taylor coefficients (polya-jensen-hyperbolicity), positivity of Li coefficients (derivatives of log ξ at s = 1), and the de Branges-space structure of associated entire functions (de-branges-spaces).',
        ],
        math: [
          { tex: T`H_t(z)=\int_0^\infty e^{tu^2}\,\Phi(u)\cos(zu)\,du,\qquad H_0(z)=\tfrac18\,\xi\!\left(\tfrac{1+iz}{2}\right)`, note: 't real is the flow time; z complex; the e^{tu²} weight is the heat-kernel multiplier. Λ = inf{t : H_t has only real zeros}.' },
          { tex: T`2\sum_{\rho}\operatorname{Re}\frac{1}{\rho}=2+\gamma-\log 4\pi = 0.046191\ldots`, note: 'Sum over nontrivial zeros with multiplicity, ρ and ρ̄ taken together; follows from the Hadamard product (it is 2λ_1). Under RH the left side equals Σ_ρ 1/|ρ|².' },
        ],
        details: [
          'Riemann–von Mangoldt: N(T) = (T/2π) log(T/2πe) + 7/8 + S(T) + O(1/T), with S(T) = O(log T).',
          'Real-valuedness of Ξ on ℝ is what lets sign changes certify zeros on the line (Hardy Z, Gram points, Turing’s method).',
          'Note on the Σ 1/|ρ|² identity: unconditionally Σ_ρ Re(1/ρ) = λ_1 = 1 + γ/2 − ½ log 4π = 0.0230957; Re(1/ρ) = β/|ρ|² equals (1/2)/|ρ|² only for on-line zeros, so the form Σ 1/|ρ|² = 2λ_1 uses RH.',
        ],
      },
    ],
    physicsAnalogy: {
      system: 'A vibrating string or drumhead described by its resonance (characteristic) function.',
      mapping: [
        'A finite resonator has a characteristic function, for example det(ω² − K) for a spring network with stiffness matrix K, which vanishes exactly at the resonant frequencies. ξ plays this role for the zeros: it is a "spectral determinant" whose zeros are the nontrivial zeros (spectral-determinant).',
        'The Hadamard product ξ(s) = ξ(0) Π(1 − s/ρ) is the infinite-dimensional version of writing det(ω² − K) as a product over resonances.',
        'Ξ(t) real on the real line corresponds to a lossless resonator, whose response along the real frequency axis is real and whose resonances are real frequencies. RH says ξ behaves like a lossless system.',
        'The heat-flow family H_t is like adding damping or anti-damping by a parameter t; at t ≥ Λ all resonances are on the real axis.',
      ],
      whereItBreaks: 'No physical resonator with these frequencies is known; that would be a Hilbert–Pólya operator (hilbert-polya). A finite resonator has finitely many modes, while ξ has infinitely many zeros with density growing like (1/2π) log(t/2π), so the infinite product needs the ρ, 1 − ρ grouping to converge.',
    },
    examples: [
      {
        title: 'ξ(2) by hand',
        level: 'beginner',
        steps: ['ξ(2) = ½ · 2 · (2 − 1) · π^(−1) · Γ(1) · ζ(2).', '½·2·1 = 1; Γ(1) = 0! = 1; ζ(2) = π²/6.', 'So ξ(2) = (1/π)(π²/6) = π/6.'],
        result: 'ξ(2) = π/6 ≈ 0.5235988 (mpmath: 0.52359877559829887).',
      },
      {
        title: 'ξ(0) = 1/2 as a limit',
        level: 'intermediate',
        steps: ['Near s = 0, Γ(s/2) ≈ 2/s, π^{−s/2} → 1 and ζ(0) = −1/2.', 'So ξ(s) ≈ ½ · s · (−1) · (2/s) · (−1/2) = 1/2.'],
        result: 'ξ(0) = 1/2; by symmetry ξ(1) = 1/2.',
      },
    ],
    whyItMatters: 'ξ is the object on which most RH equivalents are stated: real zeros of Ξ, Λ = 0 for the heat flow H_t, Li positivity, Jensen hyperbolicity. The project’s de Bruijn–Newman work flows ξ forward and backward in t and certifies where its zeros are real; Platt–Trudgian Λ ≤ 0.2 is the accepted bound, and the project’s 0.1758354 is an unreviewed candidate.',
    example: 'ξ(1/2) = 0.4971208 and ξ(2) = π/6; the first real zero of Ξ is at t = 14.134725.',
    pitfalls: [
      'Ξ(t) (capital) uses the height t on the critical line; ξ(s) (lower case) uses s. Ξ(t) = ξ(1/2 + it).',
      'The xi function has no trivial zeros; counting its zeros counts only nontrivial zeros of ζ.',
      'Several normalisations exist (some omit the factor ½ or use H_0(z) = ξ((1+iz)/2)/8); constants differ by such factors.',
    ],
    prerequisites: ['riemann-zeta-function', 'functional-equation', 'gamma-function', 'entire-function'],
    mentions: ['riemann-zeta-function', 'pole', 'gamma-function', 'nontrivial-zeros', 'functional-equation', 'critical-line', 'entire-function', 'heat-flow-ht', 'de-bruijn-newman-constant', 'li-criterion', 'nyman-beurling-criterion', 'project-lambda-candidate', 'polya-jensen-hyperbolicity', 'de-branges-spaces', 'spectral-determinant', 'hilbert-polya'],
    furtherReading: [R('Zeta function explorer', '/zeta'), R('Λ bounds', '/lambda-bounds'), R('RH equivalents', '/rh-equivalents'), U('Rodgers–Tao, Λ ≥ 0 (arXiv:1801.05914)', 'https://arxiv.org/abs/1801.05914')],
  },

  // ══════════════════════════════════════════════════════════════════════════
  'riemann-siegel-formula': {
    slug: 'riemann-siegel-formula',
    term: 'Riemann–Siegel formula',
    intro: 'The Riemann–Siegel formula is a fast recipe for computing the zeta function high up on the critical line. Instead of adding millions of terms of a slowly converging sum, it adds about the square root of that many cosine waves and then a small, explicitly known correction. It is the standard tool for locating zeros by computer.',
    levels: [
      {
        level: 'beginner',
        heading: 'A short sum of waves plus a correction',
        paragraphs: [
          'On the critical line (critical-line, the vertical line Re s = 1/2) the zeta function (riemann-zeta-function: the function ζ(s) = 1 + 1/2^s + 1/3^s + … and its continuation) can be turned into a real-valued function Z(t) of the height t, called the Hardy Z-function (hardy-z-function). Every time Z(t) changes sign, ζ has a zero on the line between those heights. So computing Z at many heights and watching its sign is how zeros are found.',
          'The Riemann–Siegel formula says Z(t) is approximately a sum of N cosine waves, where N is the whole-number part of √(t/2π). At height t = 100 that is 3 waves; at t = 3·10^12 it is about 690,988 waves. Each wave is cos(θ(t) − t log n) divided by √n, where θ(t) is a smooth, known phase (riemann-siegel-theta).',
          'After the sum there is a remainder. The formula gives its leading part explicitly and the rest is small: the error shrinks like t^(−3/4) and smaller terms can be added for more accuracy. This is an approximation formula, not an exact infinite series; that is what the simplification "Z is a sum of waves" leaves out.',
        ],
        analogy: 'Think of hearing a chord: only a handful of notes are loud, and the rest blend into a soft hiss you can estimate. The Riemann–Siegel formula keeps the loud notes (the first √(t/2π) terms) and replaces the hiss by a known correction.',
        example: 'At the first zero, t = 14.1347, √(t/2π) = 1.4999, so N = 1 and there is a single wave: 2 cos(θ(t)) with θ = −1.72867, giving −0.31444. The leading correction term is +0.31247. The sum is −0.0020, close to the true value Z = 0; adding the next correction term reduces the error further.',
      },
      {
        level: 'intermediate',
        heading: 'The formula',
        paragraphs: [
          'The Hardy function is Z(t) = e^{iθ(t)} ζ(1/2 + it), real for real t, where θ(t) = arg Γ(1/4 + it/2) − (t/2) log π. The functional equation (functional-equation) makes ζ(1/2 + it) equal to a direct sum Σ n^{−1/2 − it} plus the bridge factor times a dual sum; on the line the two halves are complex conjugates of each other after multiplying by e^{iθ}, so they combine into 2 Σ cos(·).',
          'The cut-off N = ⌊√(t/2π)⌋ is where the two halves balance (the general "approximate functional equation" allows lengths x and y with 2πxy = t; Riemann–Siegel takes x = y). The remainder is written in terms of the fractional part p of √(t/2π).',
        ],
        math: [
          { tex: T`Z(t)=2\sum_{n=1}^{N}\frac{\cos\bigl(\theta(t)-t\log n\bigr)}{\sqrt n}+R(t),\qquad N=\Bigl\lfloor\sqrt{t/2\pi}\Bigr\rfloor`, note: 't > 0 height; n whole numbers; log natural logarithm; R(t) the remainder.' },
          { tex: T`R(t)=(-1)^{N-1}\Bigl(\frac{t}{2\pi}\Bigr)^{-1/4}\Bigl[C_0(p)+C_1(p)\Bigl(\frac{t}{2\pi}\Bigr)^{-1/2}+\cdots\Bigr],\quad C_0(p)=\frac{\cos\bigl(2\pi(p^2-p-\tfrac1{16})\bigr)}{\cos(2\pi p)}`, note: 'p = √(t/2π) − N in [0, 1); C_0, C_1, … are explicit functions of p. Truncating after C_0 leaves an error O(t^{−3/4}).' },
          { tex: T`\theta(t)=\frac t2\log\frac{t}{2\pi}-\frac t2-\frac{\pi}{8}+\frac{1}{48t}+O(t^{-3})`, note: 'Asymptotic expansion of the Riemann–Siegel theta function.' },
        ],
        example: 'At t = 100: N = 3, the main sum is 2.23945, the C_0 correction is +0.44996, total 2.68941, against the true Z(100) = 2.69270 (mpmath). At t = 1000: N = 12, sum 1.11211, correction −0.11444, total 0.99767 vs Z(1000) = 0.99779. The relative error falls as t grows.',
      },
      {
        level: 'advanced',
        heading: 'Error control, fast multi-evaluation, and rigorous verification',
        paragraphs: [
          'Gabcke (1979) gave explicit bounds for the remainder after k correction terms; for example the error after the C_0 term is below 0.127 (t/2π)^{−3/4} for t ≥ 200. Such explicit bounds are what allow Riemann–Siegel evaluations to be used in proofs.',
          'Cost: one evaluation needs O(√t) operations. The Odlyzko–Schönhage algorithm evaluates the main sum at many nearby heights in about O(t^{ε}) amortised time per point, which made the computations of Odlyzko (zeros near the 10^20-th) and Gourdon (first 10^13 zeros) possible.',
          'Rigorous verification of RH to a height uses a sign-change count (Gram points, gram-points, organise where to look) plus Turing’s method (turing-method), which proves via an averaged bound on S(t) that no zeros were missed. Platt’s method (platt-zero-isolation), which underlies the Platt–Trudgian verification to γ ≤ 3.0001753·10^12 (platt-trudgian-verified-height), evaluates a Gaussian-windowed completed zeta function on a grid with FFTs in interval arithmetic rather than using the Riemann–Siegel sum directly; the FLINT implementation is acb_dirichlet_platt_multieval (formalization/rh-verification-campaign/PLAN.md).',
        ],
        details: [
          'Approximate functional equation (Hardy–Littlewood): ζ(s) = Σ_{n≤x} n^{−s} + χ(s) Σ_{n≤y} n^{s−1} + O(x^{−σ} + |t|^{1/2−σ} y^{σ−1}) for 0 ≤ σ ≤ 1 and 2πxy = |t|.',
          'The direct sum and the χ-weighted dual sum are the two arms of the twin-ladder model (twin-ladder); in the project’s barrier work the truncated sum Σ_{n≤N} b_t(n) n^{−s} with N0 = 690988 at verified height γ ≤ 3·10^12 is the heat-flow analogue of this main sum (src/data/barrier-mollifier-length-ceiling-2026-09.js, written in the doubled coordinate X = 6·10^12).',
          'Number of zeros below the PT height: 12,363,153,437,138 (formalization/rh-verification-campaign/PLAN.md).',
        ],
      },
    ],
    physicsAnalogy: {
      system: 'Stationary-phase (ray) optics with a diffraction correction.',
      mapping: [
        'Each term n^{−1/2} cos(θ(t) − t log n) is a wave with phase t log n. Writing ζ as an integral and applying stationary phase, only terms whose phase is "stationary" near the saddle contribute strongly; that saddle sits at n ≈ √(t/2π), which sets the cut-off N.',
        'The main sum is the geometric-optics (ray) contribution: a finite number of rays reach the observer.',
        'The remainder C_0(p), C_1(p), … is the diffraction correction near the edge where rays stop contributing. It depends on how far the edge sits from the last whole ray, the fractional part p, just as an edge-diffraction correction depends on the observer’s position relative to the shadow boundary.',
      ],
      whereItBreaks: 'The expansion is asymptotic, not convergent: adding more correction terms helps only up to a point at fixed t. Nothing physical is being diffracted; the "rays" are terms of a Dirichlet series.',
    },
    examples: [
      {
        title: 'The first zero with one wave',
        level: 'beginner',
        steps: [
          't = 14.134725; t/2π = 2.24959; √ = 1.49987, so N = 1 and p = 0.49987.',
          'θ(t) ≈ (t/2) log(t/2π) − t/2 − π/8 + 1/(48t) = 5.72981 − 7.06736 − 0.39270 + 0.00147 = −1.72878 (exact −1.72867).',
          'Main sum: 2 cos(−1.72867) = −0.31444.',
          'Correction: C_0(0.49987) ≈ cos(2π(0.25 − 0.5 − 0.0625))/cos(π) = 0.38268; times (t/2π)^{−1/4} = 0.8166 and sign (−1)^0 = +1: +0.31247.',
        ],
        result: 'Z ≈ −0.31444 + 0.31247 = −0.0020, against the true value 0 at the zero.',
      },
    ],
    whyItMatters: 'Locating zeros numerically is the first step of every verification of RH up to a height, and that verified height is the input that binds the de Bruijn–Newman bound Λ ≤ 0.2 (Platt–Trudgian). The project’s barrier and verification modules use the same main-sum structure, and its verification-campaign plan prices extending the height from 3·10^12 to 6·10^12 and beyond.',
    example: 'At t = 100 three waves plus the C_0 correction give 2.68941 vs Z(100) = 2.69270; at γ = 3·10^12 the main sum has 690,988 terms.',
    pitfalls: [
      'It is an asymptotic formula: the number of terms is fixed by t, and the corrections do not converge to an exact answer.',
      'It evaluates Z on the critical line; off the line other forms (approximate functional equation, Euler–Maclaurin) are used.',
      'Sign changes of Z show zeros on the line; showing that there are no other zeros needs Turing’s method or the argument principle.',
      'Platt’s rigorous verification method is FFT-based and windowed, not a direct Riemann–Siegel evaluation.',
    ],
    prerequisites: ['riemann-zeta-function', 'functional-equation', 'hardy-z-function', 'riemann-siegel-theta'],
    mentions: ['riemann-zeta-function', 'critical-line', 'hardy-z-function', 'riemann-siegel-theta', 'functional-equation', 'gram-points', 'turing-method', 'platt-zero-isolation', 'platt-trudgian-verified-height', 'twin-ladder'],
    furtherReading: [R('Riemann–Siegel Z', '/riemann-siegel-z'), R('Hardy Z-function', '/hardy-z'), R('Gram points', '/gram-points'), R('Verified-height lever', '/verified-height-lever'), U('Platt–Trudgian, RH true up to 3·10^12 (arXiv:2004.09765)', 'https://arxiv.org/abs/2004.09765')],
  },

  // ══════════════════════════════════════════════════════════════════════════
  'davenport-heilbronn-function': {
    slug: 'davenport-heilbronn-function',
    term: 'Davenport–Heilbronn function',
    intro: 'The Davenport–Heilbronn function is a carefully built counterexample. It looks like the zeta function in its symmetry, it is a sum of the same kind, but it is not built from primes in the multiplicative way zeta is, and it has zeros off its critical line. It shows that symmetry alone cannot prove the Riemann Hypothesis.',
    levels: [
      {
        level: 'beginner',
        heading: 'Same symmetry, no prime structure, wrong zeros',
        paragraphs: [
          'The zeta function (riemann-zeta-function) has two key properties. First, a mirror symmetry (functional-equation) relating its values at s and 1 − s. Second, the Euler product (euler-product): it equals a product of one simple factor per prime, which is unique factorisation of whole numbers written as a formula.',
          'Davenport and Heilbronn (1936) built a function F of the form a(1)/1^s + a(2)/2^s + a(3)/3^s + …, where the numbers a(n) repeat every 5 steps, and chose them so that F has a mirror symmetry of exactly the same shape as zeta’s. But the a(n) are not multiplicative: a(2)·a(3) is not a(6). So F has no Euler product.',
          'Computers find zeros of F off its central line; the first one is at 0.8085 + 85.6993i (repo, tlb-dh-blind module), real part 0.8085 instead of 0.5. So any argument for RH that uses only the symmetry and the general shape of the series would also "prove" RH for F, which is false. A proof must use the primes.',
        ],
        analogy: 'Two buildings with the same floor plan and the same mirror symmetry, one built from steel beams joined at every node (the Euler product), one from the same beams merely leaned together. Drawings of the outline cannot tell them apart; a load test can.',
        example: 'The repeating coefficients are 1, κ, −κ, −1, 0 with κ = 0.28408. So a(2) = 0.28408, a(3) = −0.28408 and a(6) = a(1) = 1. Multiplicativity would need a(6) = a(2)·a(3) = −0.0807. It fails, so there is no Euler product.',
      },
      {
        level: 'intermediate',
        heading: 'Construction from two L-functions mod 5',
        paragraphs: [
          'A Dirichlet character mod 5 (dirichlet-l-function) is a function χ on whole numbers that repeats every 5, is multiplicative, and vanishes on multiples of 5. Take χ the odd character with χ(2) = i; its L-function L(s, χ) = Σ χ(n) n^{−s} has an Euler product. Its functional equation relates L(s, χ) to L(1 − s, χ̄) with a root number ε of modulus 1 that is not real.',
          'Davenport and Heilbronn combine L(s, χ) and L(s, χ̄) with complex weights chosen so the root numbers cancel: F_DH(s) = ((1 − iκ)/2) L(s, χ) + ((1 + iκ)/2) L(s, χ̄). The completed function then satisfies Λ_F(s) = Λ_F(1 − s) exactly, the same shape as ζ’s, with gamma factor (5/π)^{s/2} Γ((s + 1)/2).',
          'A sum of two functions with Euler products is not itself an Euler product, and zeros of a sum are not controlled by zeros of the parts. The off-line zeros are proven to exist (infinitely many in σ > 1, by Davenport–Heilbronn; and computed ones inside the strip).',
        ],
        math: [
          { tex: T`F_{DH}(s)=\tfrac{1-i\kappa}{2}L(s,\chi)+\tfrac{1+i\kappa}{2}L(s,\bar\chi),\qquad \kappa=\frac{\sqrt{10-2\sqrt5}-2}{\sqrt5-1}`, note: 'χ the odd quartic character mod 5 with χ(2) = i; χ̄ its complex conjugate; κ = 0.2840790 is a real constant.' },
          { tex: T`\Lambda_F(s)=\Bigl(\tfrac{5}{\pi}\Bigr)^{s/2}\Gamma\!\Bigl(\tfrac{s+1}{2}\Bigr)F_{DH}(s)=\Lambda_F(1-s)`, note: 'The completed function is symmetric under s ↦ 1 − s with root number 1.' },
        ],
        example: 'Coefficients for n = 1…10: 1, 0.2841, −0.2841, −1, 0, 1, 0.2841, −0.2841, −1, 0. The first off-line zero 0.8085171825 + 85.6993484854i was validated in the repo against the explicit formula for F_DH to residual ≤ 1.2·10^{−13} (src/data/tlb-dh-blind-2026-09-28.js).',
      },
      {
        level: 'advanced',
        heading: 'Euler-blindness: quantifying what symmetry-only tests can see',
        paragraphs: [
          'F_DH and the Euler arm L(s, χ) share the gamma factor, hence the same archimedean symbol Ω(t) = log(5/π) + Re ψ(3/4 + it/2) in the Weil explicit formula (weil-positivity: RH for a function is equivalent to positivity of a quadratic form built from its explicit formula). They differ only in the prime-side coefficients c(n) of −F′/F.',
          'Project results (computer-assisted, internally refereed twice, not externally reviewed): Weil positivity for F_DH is proved for test functions of support 2a ≤ 0.78306 by a closed-form bound, Arb-certified for 2a ≤ ln 3 with W_DH(h) ≥ 0.2080723937 ‖h‖² and extended to 2a ≤ ln 11 (dag3-dhblindln3); a certified negative witness exists at support parameter a = 1.72, carried by the first off-line zero (tlb-dh-blind). So at conductor 5, Weil positivity on supports up to ln 11 has the same truth value for an Euler product and for this RH-false function: positivity certificates at those supports cannot by themselves encode the Euler product. The project calls this Euler-blindness (euler-blindness) and models F_DH as the Davenport–Heilbronn twin (davenport-heilbronn-twin), a twin ladder with the same bridge but no prime cascade.',
          'For ζ itself (conductor 1) no such twin exists, by Hamburger’s theorem; the DH function is the standard witness that degree-1 symmetry plus a Dirichlet series does not force zeros onto the line once the conductor allows more than one such series.',
        ],
        details: [
          'Davenport–Heilbronn (1936): F_DH has infinitely many zeros with σ > 1 and (Voronin-type arguments) many in 1/2 < σ < 1; numerical zeros inside the strip appear in symmetric pairs about σ = 1/2.',
          'Below the first prime (2a < ln 2) small-support positivity is the same for every Dirichlet series with a(1) = 1 and the same gamma factor, since no prime term enters; the project result quantifies how far past that the blindness extends.',
          'The NS-RIGID no-go (ns-rigid) and the Route C verdict record the same qualitative point in other languages (src/data/project-attempts-dag.js).',
        ],
      },
    ],
    physicsAnalogy: {
      system: 'Two filters connected in parallel (signal-processing / circuit theory).',
      mapping: [
        'A filter whose transfer function has all its zeros in a "good" region (minimum phase) is the analogue of an L-function obeying the Riemann Hypothesis (transfer-function).',
        'Connecting two such filters in parallel adds their transfer functions. The sum generally has zeros in new places, including the "bad" region, even when each part is well behaved.',
        'F_DH is a parallel combination of L(s, χ) and L(s, χ̄), with weights chosen to make the combined response mirror-symmetric. Symmetry of the response does not restore the zero locations.',
        'The Euler product corresponds to a cascade (series) connection of one stage per prime; cascading multiplies transfer functions, so zeros are only those of the stages. That structure is what F_DH lacks.',
      ],
      whereItBreaks: 'It is not known that L(s, χ) itself has all zeros on the line (that is GRH, grh), so "each part is good" is an assumption in the analogy, not a fact. The zeros of ζ are not produced by a cascade of finitely many stages; the Euler product converges only for Re s > 1.',
    },
    examples: [
      {
        title: 'Multiplicativity test',
        level: 'beginner',
        steps: ['κ = (√(10 − 2√5) − 2)/(√5 − 1) = (2.35114 − 2)/1.23607 = 0.28408.', 'a(2)a(3) = 0.28408 × (−0.28408) = −0.08070.', 'a(6) = a(1) = 1 (6 leaves remainder 1 on division by 5).'],
        result: 'a(6) ≠ a(2)a(3), so F_DH is not multiplicative and has no Euler product.',
      },
      {
        title: 'Certified margins at conductor 5',
        level: 'advanced',
        steps: ['Support 2a ≤ ln 3: W_DH ≥ 0.2080723937 ‖h‖² (Arb), Euler-arm form ≥ 0.2923087034 ‖h‖².', 'Support 2a ≤ ln 11: W_DH ≥ 6.9271·10^{−9} ‖h‖², Euler arm ≥ 9.8742·10^{−4} ‖h‖².', 'Support parameter a = 1.72: certified negative W_DH(g0) < 0.'],
        result: 'Positivity has the same sign for both functions on all supports 2a ≤ ln 11 = 2.398. For F_DH it fails by support parameter a = 1.72 (2a = 3.44; certified negative witness); the measured onset is a ∈ (1.70, 1.72], not certified, since a positive finite-basis λ_min is only an upper bound.',
      },
    ],
    whyItMatters: 'The DH function is the test any RH strategy must pass: if the argument would apply verbatim to F_DH, it cannot be right. The project uses it this way in the Euler-blindness results, which show that small-support Weil positivity certificates (including the Route I range 2a ≤ ln 3) do not distinguish an Euler product from an RH-false function at conductor 5. RH is open; these are project-internal computer-assisted results.',
    example: 'First off-line zero 0.8085171825 + 85.6993484854i; certified negative Weil form at a = 1.72.',
    pitfalls: [
      'F_DH is not a counterexample to RH for ζ; it is a counterexample to "functional equation ⇒ RH".',
      'Its functional equation has the same shape as ζ’s but a different gamma factor and conductor (5, not 1).',
      'Euler-blindness at small support is a statement about what a test can detect, not about whether RH holds.',
    ],
    prerequisites: ['functional-equation', 'euler-product', 'dirichlet-l-function'],
    mentions: ['riemann-zeta-function', 'functional-equation', 'euler-product', 'dirichlet-l-function', 'weil-positivity', 'euler-blindness', 'davenport-heilbronn-twin', 'ns-rigid', 'transfer-function', 'grh'],
    furtherReading: [R('Twin ladder', '/twin-ladder'), R('RH novel routes roadmap', '/rh-novel-routes-roadmap'), R('RH landscape DAG', '/rh-landscape-dag')],
  },

  // ══════════════════════════════════════════════════════════════════════════
  'explicit-formula': {
    slug: 'explicit-formula',
    term: 'Explicit formula',
    intro: 'The explicit formula is an exact equation linking the primes to the zeros of the zeta function. On one side is a count of primes; on the other side is a smooth main term plus one oscillating wave for each zero. It is the reason the location of the zeros controls how regularly the primes are spread out.',
    levels: [
      {
        level: 'beginner',
        heading: 'The prime staircase as a sum of waves',
        paragraphs: [
          'Count primes with a weight: every prime p up to x adds log p, and so does every prime power p², p³, … up to x. The total is called ψ(x) (chebyshev-psi; the weight log p for prime powers and 0 otherwise is the von Mangoldt function, von-mangoldt-function). Plotted against x, ψ(x) is a staircase that jumps at each prime power. The prime number theorem (prime-number-theorem) says the staircase rises at an average slope of 1: ψ(x) is about x.',
          'The explicit formula says exactly how the staircase differs from the straight line x. The difference is a sum of waves, one for each nontrivial zero ρ of zeta (nontrivial-zeros: the zeros inside the strip 0 < Re s < 1). A zero at height γ produces a wave that oscillates γ/(2π) times each time x is multiplied by e. A zero with real part β produces a wave whose size grows like x^β.',
          'If every zero has β = 1/2 (the Riemann Hypothesis, riemann-hypothesis), all waves grow like √x, and the staircase stays within about √x · (log x)² of the line. A zero with larger β would make one wave grow faster and the primes less regular. That is why the zeros matter for primes.',
          'The simplification: there are infinitely many waves, and their sum converges only slowly and only when the waves are added in order of height. At the exact jump points the formula gives the midpoint of the jump.',
        ],
        analogy: 'A staircase built out of sound: the straight ramp is the bass note, and each zero adds a higher tone. With enough tones the steps appear sharply, the way enough harmonics reproduce the sharp edges of a square wave.',
        example: 'At x = 10 the prime powers are 2, 3, 4, 5, 7, 8, 9, so ψ(10) = log(2·3·2·5·7·2·3) = log 2520 = 7.832. The smooth terms give 10 − log 2π − ½ log(1 − 1/100) = 8.167. The first zero pair (height 14.1347) contributes −0.411, giving 7.756; 100 zero pairs give 7.826.',
      },
      {
        level: 'intermediate',
        heading: 'Statement and derivation by contour integration',
        paragraphs: [
          'The link starts from the logarithmic derivative of the Euler product (euler-product): −ζ′(s)/ζ(s) = Σ Λ(n) n^{−s} for Re s > 1, where Λ(n) is the von Mangoldt weight (not to be confused with the de Bruijn–Newman constant, also written Λ). Perron’s formula recovers ψ(x) from this series as a contour integral (contour-integral: an integral of a complex function along a path).',
          'Moving the path to the left and collecting residues (residue: the coefficient that a pole contributes to a contour integral) gives one term per singularity of −ζ′/ζ · x^s/s: the pole of ζ at s = 1 gives x; each zero ρ gives −x^ρ/ρ; s = 0 gives −log 2π; the trivial zeros −2, −4, … give −½ log(1 − x^{−2}).',
          'Pairing ρ = β + iγ with its conjugate, the zero terms become real waves −2 Re(x^ρ/ρ), of size about 2x^β/|ρ| and phase γ log x − arg ρ.',
        ],
        math: [
          { tex: T`\psi(x)=\sum_{n\le x}\Lambda(n),\qquad \Lambda(n)=\begin{cases}\log p & n=p^k\\ 0 & \text{otherwise}\end{cases}`, note: 'x > 1 real; p prime, k ≥ 1.' },
          { tex: T`\psi(x)=x-\sum_{\rho}\frac{x^{\rho}}{\rho}-\log 2\pi-\tfrac12\log\bigl(1-x^{-2}\bigr)`, note: 'Valid for x > 1 not a prime power; the sum over nontrivial zeros ρ is taken as lim_{T→∞} Σ_{|Im ρ|<T}.' },
          { tex: T`\psi(x)=x+O\bigl(\sqrt{x}\,\log^2 x\bigr)\iff \text{RH}`, note: 'The size of the error term is equivalent to the largest real part of the zeros (von Koch 1901).' },
        ],
        example: 'Partial sums of the zero series at x = 10 (mpmath, zeros from zetazero): 1 pair 7.7561, 3 pairs 7.8257, 10 pairs 7.7868, 50 pairs 7.8808, 100 pairs 7.8265, against ψ(10) = 7.8320. The oscillation of the partial sums shows the conditional convergence.',
      },
      {
        level: 'advanced',
        heading: 'The Guinand–Weil form for test functions',
        paragraphs: [
          'For an even test function g with Fourier transform ĝ(r) = ∫ g(x) e^{irx} dx, smooth and decaying fast enough (fourier-transform), the explicit formula reads: sum over zeros of ĝ(γ_ρ), with ρ = 1/2 + iγ_ρ, equals pole terms plus an archimedean integral minus a prime sum. Here γ_ρ is real exactly when ρ is on the critical line. This is the Weil explicit formula (weil-explicit-formula); the classical ψ(x) formula is the case of a sharp cut-off.',
          'The formula is a duality: g is evaluated at the logarithms of prime powers, ĝ at the zero heights. Narrow support of g in x means ĝ is spread out in r, so a test function supported in [−L, L] sees only prime powers n ≤ e^L but weighs zeros over a wide range of heights. This trade-off controls every small-support result on Weil positivity (weil-positivity).',
          'Interpretations: Selberg’s trace formula (selberg-trace-formula) for hyperbolic surfaces has the same structure with closed geodesics in place of prime powers and Laplace eigenvalues in place of zeros; Connes’ trace formula (connes-spectral-approach) realises the zero side spectrally on the adele class space.',
        ],
        math: [
          { tex: T`\sum_{\rho}\hat g(\gamma_\rho)=\hat g(\tfrac i2)+\hat g(-\tfrac i2)-g(0)\log\pi+\frac1{2\pi}\int_{-\infty}^{\infty}\hat g(r)\,\operatorname{Re}\psi\!\left(\tfrac14+\tfrac{ir}2\right)dr-2\sum_{n\ge2}\frac{\Lambda(n)}{\sqrt n}\,g(\log n)`, note: 'ψ here is the digamma function Γ′/Γ (not Chebyshev’s ψ); γ_ρ = (ρ − 1/2)/i; zeros counted with multiplicity. This is the normalisation used by the Route I modules: (1/2π)(Re ψ − log π) = θ′(t)/π, the derivative of the Riemann–Siegel phase.' },
        ],
        details: [
          'Validity: g even, g and ĝ satisfying mild decay so that ĝ extends holomorphically to |Im r| ≤ 1/2 + ε.',
          'Repo check of the normalisation: for a Gaussian ĝ(r) = exp(−r²/2σ²) with σ = 100, the zero side over the 869 zeros with |γ| ≤ 1280 is 43.40457229556881 (src/data/imp-901-weil-formula-verification.js); ψ(1/4) = −γ − π/2 − 3 log 2 = −4.2274535 enters the archimedean term at r = 0.',
          'For the Davenport–Heilbronn function the explicit formula was validated against 71 on-line and 2 off-line zero pairs to residual ≤ 1.2·10^{−13} (src/data/tlb-dh-blind-2026-09-28.js).',
        ],
      },
    ],
    physicsAnalogy: {
      system: 'The Gutzwiller / Selberg trace formula of quantum chaos: energy levels on one side, periodic orbits on the other.',
      mapping: [
        'Zeros γ ↔ energy levels of a quantum system; the zero side Σ ĝ(γ) is a smoothed density of states.',
        'Primes p ↔ primitive periodic orbits with lengths (periods) log p; prime powers p^k ↔ k-fold repetitions of an orbit.',
        'The weight Λ(n)/√n = log p · p^{−k/2} ↔ the orbit amplitude: period times an instability factor that decays exponentially with the number of repetitions.',
        'The archimedean (gamma-factor) term ↔ the smooth Weyl term counting levels by phase-space volume; it gives the average zero density (1/2π) log(t/2π).',
      ],
      whereItBreaks: 'No dynamical system with these orbits and levels is known (quantum-chaos, hilbert-polya). The prime sum enters with the opposite sign to the Gutzwiller periodic-orbit sum, one reason Connes describes the zeros as an absorption rather than an emission spectrum. The formula is an exact identity for ζ, while Gutzwiller’s formula is a semiclassical approximation.',
    },
    examples: [
      {
        title: 'ψ(10) from the zeros',
        level: 'beginner',
        steps: [
          'ψ(10) = log 2 + log 3 + log 2 + log 5 + log 7 + log 2 + log 3 = log 2520 = 7.83201.',
          'Smooth part: 10 − log(2π) − ½ log(0.99) = 10 − 1.83788 + 0.00503 = 8.16715.',
          'First zero ρ = 1/2 + 14.13473i: 10^ρ = √10 · e^{i·14.13473·ln 10} = 1.3523 + 2.8587i; dividing by ρ and doubling the real part gives 0.41100, entering with a minus sign.',
          '8.16715 − 0.41100 = 7.75615.',
        ],
        result: 'One zero pair already moves the smooth value 8.167 most of the way to 7.832; 100 pairs give 7.8265.',
      },
    ],
    whyItMatters: 'The explicit formula is the bridge between the two sides of the RH problem: arithmetic (primes) and analysis (zeros). Every positivity criterion in this project (Weil positivity, Li coefficients, the Route I certificates) is an inequality between its two sides, and the prime-power positions log n determine which terms enter a test function of given support.',
    example: 'ψ(10) = log 2520 = 7.832; smooth part 8.167; with 100 zero pairs 7.826.',
    pitfalls: [
      'The zero sum converges only conditionally (in order of |γ|); truncations oscillate.',
      'Λ(n) (von Mangoldt) and Λ (de Bruijn–Newman constant) are different objects.',
      'The formula holds unconditionally; RH is a statement about the size of its zero terms, not about its validity.',
    ],
    prerequisites: ['chebyshev-psi', 'von-mangoldt-function', 'nontrivial-zeros', 'contour-integral'],
    mentions: ['chebyshev-psi', 'von-mangoldt-function', 'prime-number-theorem', 'nontrivial-zeros', 'riemann-hypothesis', 'euler-product', 'contour-integral', 'residue', 'fourier-transform', 'weil-explicit-formula', 'weil-positivity', 'selberg-trace-formula', 'connes-spectral-approach', 'quantum-chaos', 'hilbert-polya'],
    furtherReading: [R('Zeta function explorer', '/zeta'), R('Fourier', '/fourier'), R('Selberg trace formula', '/selberg-trace'), R('Connes adelic approach', '/connes-adelic')],
  },

  // ══════════════════════════════════════════════════════════════════════════
  'weil-positivity': {
    slug: 'weil-positivity',
    term: 'Weil positivity',
    intro: 'Weil positivity is a way of restating the Riemann Hypothesis as a balance that must never tip below zero. The explicit formula balances a smooth background term and the primes against the zeros; if all zeros are on the critical line, the zero side is a sum of squares and so can never be negative. Weil proved the converse: if the balance is never negative, all zeros are on the line.',
    levels: [
      {
        level: 'beginner',
        heading: 'A balance between primes and zeros',
        paragraphs: [
          'The explicit formula (explicit-formula) is an exact equation with the zeros of zeta on one side and two things on the other side: a smooth "background" term coming from the gamma factor of zeta (gamma-function, the extension of the factorial), and a sum over primes and prime powers. To use it you pick a probe, called a test function: a smooth bump h that is zero outside some interval. Both sides of the formula are then numbers you can compute.',
          'Each nontrivial zero (nontrivial-zeros) contributes one term to the zero side. If a zero sits on the critical line (critical-line), its term is a square of a real number, so it is zero or positive. If every zero is on the line (the Riemann Hypothesis, riemann-hypothesis), the zero side is a sum of squares, so it is at least zero for every probe. Then the other side, background minus primes, can never be negative.',
          'Weil (1952) proved the reverse. If a zero were off the line, a well-chosen probe would make its term negative and larger than everything else, and the balance would go below zero. So: RH is true exactly when "background minus primes" is at least zero for every probe. Such statements are RH-equivalents (rh-equivalent-statement): proving one proves RH; it moves the problem without shortening it.',
          'What this leaves out: the probes must be smooth and used through their autocorrelation (h convolved with its mirror image) so that the zero-side terms are squares, and the infinite sums need care. Off the line a term is a product of two different complex numbers, which can be negative.',
        ],
        analogy: 'A bank account that must never be overdrawn. Deposits come from the smooth background, withdrawals from the primes. The Riemann Hypothesis says that whatever pattern of transactions you choose (whatever probe), the balance stays at or above zero.',
        example: 'A real number squared is never negative: 0.25 × 0.25 = 0.0625. An off-line zero contributes instead a product like (−0.25i) × (−0.25i) = 0.0625 × i² = −0.0625. One such negative term, if not outweighed by the others, tips the balance.',
      },
      {
        level: 'intermediate',
        heading: 'The quadratic form, support, and which primes enter',
        paragraphs: [
          'Take h even and supported in [−a, a], and let g = h ∗ h̃ be its autocorrelation (h convolved with its reflection), supported in [−2a, 2a]. The Fourier transform (fourier-transform) of g is ĝ = |ĥ|² on the real line. Plugging g into the Weil explicit formula (weil-explicit-formula) gives the Weil form W(h) (weil-quadratic-form). Its zero side is Σ_ρ ĝ(γ_ρ), where ρ = 1/2 + iγ_ρ. For an on-line zero γ_ρ is real and the term is |ĥ(γ_ρ)|² ≥ 0.',
          'Its other side is: pole terms at r = ±i/2, the archimedean integral (1/2π)∫ |ĥ(t)|² · 2θ′(t) dt, where θ is the Riemann–Siegel phase (riemann-siegel-theta) and 2θ′(t) ≈ log(t/2π) grows slowly, minus the prime sum 2 Σ Λ(n) n^{−1/2} g(log n). Because g vanishes outside [−2a, 2a], only prime powers with log n ≤ 2a enter. Support width is therefore the number of primes the test "sees".',
          'So 2a < ln 2 = 0.693 sees no prime, ln 2 ≤ 2a < ln 3 = 1.099 sees only n = 2, and each further prime power adds a term with no general sign control.',
          'Why an off-line zero is detectable: replace an on-line zero at height H by a quadruple at heights ±H ± iδ (δ = β − 1/2). The project lemma RES-T (theorem-res-t, project-internal, unreviewed) takes ĥ-packets of exponential type T that vanish at H and computes the change of the zero side exactly as −2δ² S(Tδ)⁴, S(x) = sinh(x/2)/(x/2), against an on-line mass ≈ 2 log(H/2π)/T³ from nearby zeros. Longer support T makes the negative term win.',
        ],
        math: [
          { tex: T`W(h)=\sum_{\rho}\hat h(\gamma_\rho)\,\overline{\hat h(\bar\gamma_\rho)}=\underbrace{\hat g(\tfrac i2)+\hat g(-\tfrac i2)}_{\text{poles}}+\underbrace{\frac1{2\pi}\int|\hat h(t)|^2\,2\theta'(t)\,dt}_{\text{background}}-\underbrace{2\sum_{\log n\le 2a}\frac{\Lambda(n)}{\sqrt n}g(\log n)}_{\text{primes}}`, note: 'ĥ(r) = ∫ h(x) e^{irx} dx; γ̄ is the complex conjugate of γ; Λ(n) = log p on prime powers; 2θ′(t) = Re ψ(1/4 + it/2) − log π with ψ the digamma function. For real γ the zero term is |ĥ(γ)|².' },
          { tex: T`\text{RH}\iff W(h)\ge 0\ \text{ for all admissible } h`, note: 'Weil’s criterion; admissible means smooth, compactly supported (Bombieri’s formulation, 2000).' },
          { tex: T`\Delta Z=-2\delta^2 S(T\delta)^4,\qquad M_{\rm on}=\frac{2\log(H/2\pi)}{T^3}`, note: 'RES-T: δ = distance of a hypothetical zero from the line, T = support, H = height. W < 0 (detection) when |ΔZ| > M_on.' },
        ],
        example: 'RES-T at height H = 6·10^5, δ = 0.25: with T = 4, ΔZ = −0.1475 and M_on = 0.3583, so W ≈ +0.211 and the off-line quadruple is invisible. With T = 6, ΔZ = −0.1806 and M_on = 0.1062, so W ≈ −0.074 and it is detected. The repo’s detection scan found blind at T = 4, detected at T = 5 (src/data/imp-95533-res-t-standalone-lemma.js).',
      },
      {
        level: 'advanced',
        heading: 'Proved ranges, Route I certificates, and the information ceiling',
        paragraphs: [
          'Proved small-support positivity (peer-reviewed): Yoshida (1992) showed W ≥ 0 for test functions of sufficiently small support. Connes and Consani (Selecta Math. 2021) proved positivity for test functions supported in [2^{−1/2}, 2^{1/2}] in the multiplicative variable, log-support width 2a = ln 2, where only the archimedean place contributes; the proof uses the semilocal trace formula and prolate spheroidal functions. Past ln 2 each prime term carries arithmetic with no general positivity proof: this is the Weil-support wall (weil-support-wall). The Connes–Consani scaling-site program (connes-consani-scaling-site) aims to supply that positivity geometrically and is open.',
          'Pole-free reduction (repo, rh-route-i-toeplitz-krein-certificate-2026-09-24.js). A pole-free test function (pole-free-test-function) has ĥ(±i/2) = 0, which removes the pole terms. Pole-free h are exactly h = (−d²/dx² + 1/4)φ, with ĥ = (t² + 1/4)φ̂, so pole-free positivity at support 2a is equivalent to positivity of the Toeplitz form T_a[σ₂] (toeplitz-matrix: the quadratic form φ ↦ (1/2π)∫ σ|φ̂|² on functions supported in [−a, a]) with symbol σ₂ = (t² + 1/4)² w₁, w₁(t) = 2θ′(t) − √2 ln 2 cos(t ln 2). Off-line zeros remain detectable after the (t² + 1/4) multiplication, so pole-free positivity over all supports is still RH-equivalent; at a fixed support it tests fewer functions than full positivity.',
          'Route I (route-i-weil-ladder) certifies pole-free one-prime positivity on 2a ≤ ln 3 in two interval-arithmetic legs: the Toeplitz–Krein certificate (toeplitz-krein-certificate) adds a measure ν with Fourier support outside (−2a, 2a) so that σ₂ + ν ≥ 0 pointwise, proving positivity for every 2a ≤ 0.96 at once; the ARB-LEGE certificate (arb-lege-certificate) covers 0.96 < 2a ≤ ln 3 with W(h) ≥ 8.2045368·10^{−4} ‖h‖² (9.19·10^{−4} with the single-cosine floor), within about 5% of the Rayleigh–Ritz upper bounds. Status: computer-assisted (Arb), two internal adversarial referee passes, not externally refereed; novelty against Yoshida/Bombieri/Connes–Consani not checked. With only the p = 2 term kept, positivity fails at 2a* = 1.1316 = ln 3 + 0.033; past ln 3 the p = 3 term enters anyway.',
          'Two limits. Euler-blindness (euler-blindness): at conductor 5 the same positivity is Arb-certified both for an Euler-product L-function and for the RH-false Davenport–Heilbronn function (davenport-heilbronn-function) on all supports 2a ≤ ln 11, so small-support certificates do not by themselves use the Euler product. The information ceiling: by RES-T, W_T ≥ 0 can detect a δ = 1/2 quadruple at the verified height X = 3·10^12 only for support T > T_X = 3.882, so for T < T_X it adds nothing beyond the Platt–Trudgian zero verification (platt-trudgian-verified-height). T_X involves every prime power up to e^{3.882} ≈ 48.5; Route I stops at T = ln 3 = 1.099. Beyond T_X, RES-T reduces W_T ≥ 0 to a pointwise short Dirichlet-polynomial bound (the pointwise Hilbert-transform wall).',
        ],
        math: [
          { tex: T`\hat h(\pm\tfrac i2)=0\iff h=\bigl(-\tfrac{d^2}{dx^2}+\tfrac14\bigr)\varphi,\qquad W(h)=\frac1{2\pi}\int\sigma_2(t)\,|\hat\varphi(t)|^2dt,\quad \sigma_2=(t^2+\tfrac14)^2 w_1`, note: 'φ smooth with support in [−a, a]; valid for 2a ≤ ln 3, where only the k = 1 term of the p = 2 cosine series survives.' },
          { tex: T`\tfrac14\,S(T_X/2)^4\,T_X^3=\log\frac{X}{2\pi},\qquad X=3\cdot10^{12}\Rightarrow T_X=3.882`, note: 'RES-T height ceiling (project-internal, leading order in the zero density). log(X/2π) = 26.892.' },
        ],
        details: [
          'Weil, Comm. Sém. Math. Univ. Lund (1952) 252–265; Bombieri, Rend. Mat. Acc. Lincei 11 (2000) 183–233 (precise admissible class and the form used here).',
          'Li coefficients are values of the Weil functional on specific test functions (Bombieri–Lagarias 1999), so Li’s criterion (li-criterion) is a special case.',
          'Connes’ global trace formula positivity and the positivity in all seven novel routes A–G of this project reduce to Weil positivity (src/data/project-attempts-dag.js, routes-sweep-synthesis).',
          'Semilocal Sonine identity (sonine-space): Tr(ϑ(f) P P̂_S P) = W_∞ + W_2 + D_S with a positive trace side, but the remainder D_S carries 99.71% of the trace at a = (ln 3)/2; the extremal negativity sits in the p = 2 resonance window (8.145, 9.875).',
          'Alpöge–Furman (2026, external, not peer-reviewed) use inertia of a finite compression of Weil’s form for their ≥ 2/3 on-line claim.',
        ],
      },
    ],
    physicsAnalogy: {
      system: 'Stability of an elastic chain tested with trial deformations: positive potential energy for every deformation means stable.',
      mapping: [
        'Test function h ↔ a trial deformation of a long elastic chain, confined to a segment of length 2a. W(h) ↔ the potential energy stored by that deformation.',
        'Background term (1/2π)∫ 2θ′|ĥ|² ↔ on-site stiffness, slightly stiffer for short wavelengths (2θ′(t) ≈ log(t/2π)).',
        'Prime terms ↔ "negative springs" connecting points at separation log n with strength Λ(n)/√n. Written out, W is ∫∫ h(x)K(x − y)h(y), and the prime part of K is a sum of point couplings at |x − y| = log n. A deformation confined to length 2a feels only couplings with log n ≤ 2a, which is why small support sees few primes.',
        'Zeros on the line ↔ real normal-mode frequencies (stable modes). An off-line zero ↔ an unstable mode with complex frequency, which some deformation can excite to give negative energy. RH ↔ the chain is stable.',
        'Support length ↔ probe length and frequency resolution (uncertainty principle). A short probe averages over many modes and cannot isolate one unstable mode in a dense spectrum; this is the RES-T ceiling T_X = 3.88 at the verified height.',
      ],
      whereItBreaks: 'No physical chain realising this energy is known; constructing one would be a Hilbert–Pólya realisation (hilbert-polya: an operator whose eigenvalues are the zero heights) or a Connes-type one. Positivity must hold for every support length at once, not for one fixed chain. The on-site stiffness grows logarithmically with frequency, unlike ordinary springs, and the prime couplings are fixed by arithmetic rather than tunable.',
    },
    examples: [
      {
        title: 'Which primes does a test of support 2a see?',
        level: 'beginner',
        steps: ['ln 2 = 0.693, ln 3 = 1.099, ln 4 = 1.386, ln 5 = 1.609, ln 7 = 1.946.', '2a = 0.5: none. 2a = 1.0: only 2. 2a = 1.2: 2 and 3. 2a = 1.5: 2, 3, 4. 2a = 3.88: every prime power up to 48.'],
        result: 'Support 2a sees prime powers n ≤ e^{2a}. The Connes–Consani range is 2a ≤ ln 2 (no primes); Route I is 2a ≤ ln 3 (prime 2 only).',
      },
      {
        title: 'Detecting an off-line zero (RES-T)',
        level: 'intermediate',
        steps: [
          'H = 6·10^5, δ = 0.25: log(H/2π) = 11.467.',
          'T = 4: S(1) = sinh(0.5)/0.5 = 1.0422, S⁴ = 1.1798, ΔZ = −2(0.0625)(1.1798) = −0.1475; M_on = 2(11.467)/64 = 0.3583.',
          'T = 6: S(1.5) = 1.0964, S⁴ = 1.4452, ΔZ = −0.1806; M_on = 22.934/216 = 0.1062.',
        ],
        result: 'W ≈ +0.211 at T = 4 (blind), W ≈ −0.074 at T = 6 (detected). The leading-order threshold is T* = 5.183.',
      },
      {
        title: 'The T_X ceiling',
        level: 'advanced',
        steps: ['X = 3·10^12: log(X/2π) = 26.892.', 'T = 3.882: S(1.941) = 1.1646, S⁴ = 1.8392, T³ = 58.50, (1/4)(1.8392)(58.50) = 26.90.', 'e^{3.882} = 48.5.'],
        result: 'T_X = 3.882: Weil positivity only carries information beyond the verified height for supports involving all prime powers up to about 48.',
      },
    ],
    whyItMatters: 'Weil positivity is the common endpoint of most positivity approaches to RH: Li’s criterion, Connes’ trace formula, and all seven of this project’s novel routes A–G reduce to it. The project’s Route I gives interval-certified pole-free positivity for supports 2a ≤ ln 3, past the published Connes–Consani range ln 2 (computer-assisted, internally refereed, not externally reviewed). Euler-blindness and the RES-T ceiling T_X = 3.88 quantify what such small-support certificates cannot do: they do not use the Euler product and carry no information beyond the verified zero height. RH is open.',
    example: 'ARB-LEGE: W(h) ≥ 8.2045368·10^{−4} ‖h‖² for every pole-free h of support 2a ≤ ln 3; RES-T ceiling T_X = 3.882 at X = 3·10^12.',
    pitfalls: [
      'Positivity at small support is proved; the full statement (all supports) is equivalent to RH and open.',
      'Pole-free positivity at a fixed support is a weaker statement than full positivity at that support: it tests fewer functions.',
      'A positivity certificate at support 2a ≤ ln 3 does not exclude any new off-line zero; by RES-T such supports cannot detect zeros above the verified height.',
      'Small-support positivity is shared by RH-false functions with the same gamma factor at conductor 5 (Euler-blindness), so it cannot be the whole proof.',
      'Normalisations differ (support of h vs of g, additive vs multiplicative variable); "2a" in this project is the support width of g = h ∗ h̃.',
    ],
    prerequisites: ['explicit-formula', 'weil-explicit-formula', 'nontrivial-zeros', 'fourier-transform'],
    mentions: ['explicit-formula', 'gamma-function', 'nontrivial-zeros', 'critical-line', 'riemann-hypothesis', 'rh-equivalent-statement', 'fourier-transform', 'weil-explicit-formula', 'weil-quadratic-form', 'riemann-siegel-theta', 'theorem-res-t', 'weil-support-wall', 'connes-consani-scaling-site', 'pole-free-test-function', 'toeplitz-matrix', 'route-i-weil-ladder', 'toeplitz-krein-certificate', 'arb-lege-certificate', 'euler-blindness', 'davenport-heilbronn-function', 'platt-trudgian-verified-height', 'li-criterion', 'sonine-space', 'hilbert-polya'],
    furtherReading: [
      R('RH novel routes roadmap (Route I)', '/rh-novel-routes-roadmap'),
      R('Route I remainder resonance', '/viz-imp96103-route-i-remainder-resonance'),
      R('Krein c♯ floor ladder', '/viz-imp97418-krein-csharp-floor-ladder'),
      R('RH landscape DAG', '/rh-landscape-dag'),
      R('Connes adelic approach', '/connes-adelic'),
      U('Connes–Consani, Weil positivity and trace formula, the archimedean place (arXiv:2006.13771)', 'https://arxiv.org/abs/2006.13771'),
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════
  'li-criterion': {
    slug: 'li-criterion',
    term: 'Li criterion',
    intro: 'The Li criterion turns the Riemann Hypothesis into an infinite list of numbers, λ_1, λ_2, λ_3, …, each built from all the zeros of zeta. RH is true exactly when every number in the list is zero or positive. The first few hundred have been computed and are positive, but the list never ends, and an off-line zero high up would only show in very late entries.',
    levels: [
      {
        level: 'beginner',
        heading: 'Moving each zero onto a circle',
        paragraphs: [
          'Every nontrivial zero ρ of zeta (nontrivial-zeros: the zeros in the strip 0 < Re s < 1) is a complex number (complex-number: a point σ + it of the plane, with real part σ and height t). Each one can be moved by a fixed rule to a new point z = 1 − 1/ρ. The rule is chosen so that zeros on the critical line (critical-line, Re s = 1/2) land exactly on the circle of radius 1 around 0, and zeros off the line land off the circle: those left of the line land outside, those right of it inside. Because zeros come in mirror pairs (functional-equation), an off-line zero always has a partner landing outside.',
          'Li’s numbers are λ_n = sum over all zeros of (1 − z^n), with the zeros’ contributions combined in pairs so that the result is real. For a point on the circle, z^n just rotates around the circle, so 1 − z^n stays bounded and its real part is never negative. For a point outside the circle, z^n grows without limit as n grows, and its real part eventually swings very negative.',
          'Li (1997) proved: the Riemann Hypothesis (riemann-hypothesis) holds exactly when every λ_n is ≥ 0. The simplification here is that the sum over zeros is infinite and has to be added in a specific paired order; the circle picture is exact.',
        ],
        analogy: 'A row of clock hands, one per zero, each turning by a fixed angle per tick. Hands of length exactly 1 (zeros on the line) keep the total bounded in a way that never goes negative; a single hand slightly longer than 1 grows a little every tick and eventually dominates.',
        example: 'λ_1 = 1 + γ/2 − ½ log(4π), where γ = 0.5772157 is Euler’s constant. By hand: 1 + 0.2886078 − ½(2.5310242) = 1.2886078 − 1.2655121 = 0.0230957. It is positive. The first zero pair alone contributes 0.0049990 of it, about 21.6%.',
      },
      {
        level: 'intermediate',
        heading: 'Definition and two formulas',
        paragraphs: [
          'λ_n can be written as a sum over zeros or as derivatives of log ξ at s = 1, where ξ is the completed zeta function (xi-function: an entire, symmetric version of ζ whose zeros are exactly the nontrivial zeros). The map z = 1 − 1/ρ = (ρ − 1)/ρ is a Möbius transformation sending the line Re ρ = 1/2 to |z| = 1, because |ρ − 1| = |ρ| exactly when Re ρ = 1/2.',
          'Under RH, ρ = 1/2 + iγ and each conjugate pair contributes 2 − 2 Re((1 − 1/ρ)^n) = 2 − 2 cos(nφ_ρ) ≥ 0 with φ_ρ the angle of z_ρ. For high zeros φ_ρ ≈ 1/γ, so the contribution is about 4 sin²(n/2γ): low zeros dominate λ_n for moderate n.',
          'Bombieri and Lagarias (1999) showed the λ_n are values of the Weil quadratic form (weil-positivity: RH is equivalent to positivity of a quadratic form built from the explicit formula) on specific test functions, and gave the arithmetic formula expressing λ_n through primes and gamma-factor terms.',
        ],
        math: [
          { tex: T`\lambda_n=\sum_{\rho}\Bigl[1-\Bigl(1-\frac1\rho\Bigr)^{n}\Bigr]=\frac{1}{(n-1)!}\,\frac{d^{n}}{ds^{n}}\Bigl[s^{n-1}\log\xi(s)\Bigr]_{s=1}`, note: 'n = 1, 2, 3, …; ρ over nontrivial zeros with ρ and 1 − ρ paired; ξ the completed zeta function.' },
          { tex: T`\Bigl|1-\frac1\rho\Bigr|^2=1+\frac{1-2\beta}{\beta^2+\gamma^2},\qquad \rho=\beta+i\gamma`, note: 'Equals 1 exactly when β = 1/2; greater than 1 when β < 1/2.' },
          { tex: T`\text{RH}\iff\lambda_n\ge0\ \ (n=1,2,3,\ldots)`, note: 'Li (1997); also equivalent to λ_n > 0 for all n.' },
        ],
        example: 'Repo values (src/data/imp-2426-li-coefficients-bombieri-lagarias-2026-06.js, 10^6 zeros): λ_1 = 0.023092 (closed form 0.0230957, truncation bias 3.3·10^{−6}), λ_2 = 0.092333, λ_3 = 0.207609, λ_10 = 2.279, λ_100 = 118.571, λ_300 = 519.40. All 300 are positive.',
      },
      {
        level: 'advanced',
        heading: 'Asymptotics and why finite checks say little',
        paragraphs: [
          'Under RH, Bombieri–Lagarias proved λ_n = (n/2)(log n − 1 + γ − log 2π) + O(√n log n) (Keiper had conjectured this). If RH fails, λ_n is negative for infinitely many n and |λ_n| grows exponentially along a subsequence. Note: the comparison curve in imp-2426 omits the − log 2π term; with it, the asymptote gives 117.2 at n = 100 and 516.5 at n = 300, within about 1.2% and 0.6% of the computed 118.571 and 519.40, so the "slow approach" reported there is an artefact of the missing constant.',
          'Sensitivity: from the modulus formula, an off-line zero at height γ with displacement 1/2 − β has |z|^n ≈ exp(n(1 − 2β)/(2γ²)), so it begins to dominate only when n is of order γ²/(1 − 2β). Since RH is verified up to γ = 3·10^12 (platt-trudgian-verified-height), a new off-line zero could not affect λ_n until n is of order 10^25 or more. Computing λ_n for n in the hundreds or thousands therefore tests only the low zeros, which are already verified.',
          'Generalisations: Lagarias defined Li coefficients for automorphic L-functions; the Bombieri–Lagarias theorem holds for any multiset of points with Σ(1 + |Re ρ|)/(1 + |ρ|²) < ∞, which shows the criterion is a statement about point configurations rather than specifically about ζ.',
        ],
        math: [
          { tex: T`\lambda_n=\frac n2\Bigl(\log n-1+\gamma-\log 2\pi\Bigr)+O(\sqrt n\log n)\quad(\text{under RH})`, note: 'γ = 0.5772157 Euler’s constant; this asymptotic is RH-conditional.' },
          { tex: T`\lambda_1=1+\frac{\gamma}{2}-\frac12\log 4\pi=\sum_\rho\operatorname{Re}\frac1\rho=0.0230957\ldots`, note: 'Unconditional closed form.' },
        ],
        details: [
          'X.-J. Li, J. Number Theory 65 (1997) 325–333; E. Bombieri and J. C. Lagarias, J. Number Theory 77 (1999) 274–287.',
          'Coffey and others computed λ_n to large n through the arithmetic formula; all computed values are positive.',
          '2λ_1 = 0.0461914 equals Σ_ρ 1/|ρ|² under RH, the constant governing the Nyman–Beurling distance (nyman-beurling-criterion).',
        ],
      },
    ],
    physicsAnalogy: {
      system: 'Stability of a discrete-time linear system (a digital filter or a sampled oscillator).',
      mapping: [
        'In a discrete-time system each mode multiplies its amplitude by a fixed complex number z per time step. |z| = 1 is an undamped oscillation; |z| > 1 is a growing (unstable) mode.',
        'Each zero ρ gives such a mode with z_ρ = 1 − 1/ρ; the time step is n. RH says all modes are undamped (on the unit circle).',
        'λ_n = Σ(1 − z_ρ^n) is a response measured at step n. With all |z| = 1 its real part is a sum of non-negative terms 1 − cos(nφ); one mode with |z| > 1 eventually makes the response large and negative.',
        'The growth rate of an unstable mode is tiny for high zeros (|z|² − 1 ≈ (1 − 2β)/γ²), so it takes about γ² steps to see it: a slow instability is invisible in a short recording.',
      ],
      whereItBreaks: 'There are infinitely many modes and the sum converges only with pairing. Under RH, λ_n grows like (n/2) log n, so "bounded oscillation" describes each term, not the total. No physical system with these modes is known.',
    },
    examples: [
      {
        title: 'λ_1 by hand',
        level: 'beginner',
        steps: ['γ/2 = 0.2886078.', 'log 4π = log 12.566371 = 2.5310242; half is 1.2655121.', '1 + 0.2886078 − 1.2655121 = 0.0230957.'],
        result: 'λ_1 = 0.0230957 > 0.',
      },
      {
        title: 'How late an off-line zero would show',
        level: 'advanced',
        steps: ['Suppose a zero at height γ = 3·10^12 with β = 0.4 (1 − 2β = 0.2).', '|z|^n ≈ exp(n · 0.2 / (2γ²)) = exp(n / (9·10^{25})).', 'This exceeds e (a factor 2.7) only for n ≈ 9·10^25.'],
        result: 'λ_n for n ≤ 10^6 is insensitive to such a zero; Li positivity is checked far beyond verified height only through its asymptotic behaviour.',
      },
    ],
    whyItMatters: 'Li’s criterion is one of the simplest-looking RH equivalents and a special case of Weil positivity. For this project it illustrates the general point recorded in RES-T and the Weil-support wall: finite or small-scale positivity checks only probe zeros that are already verified. The numerical values in imp-2426 are consistent with RH; they are not evidence beyond the verified height.',
    example: 'λ_1 = 0.0230957; repo λ_100 = 118.571 and λ_300 = 519.40, all 300 positive.',
    pitfalls: [
      'Positivity of the first few hundred (or million) λ_n is consistent with RH but does not test zeros above the verified height.',
      'The comparison asymptotic must include −log 2π: (n/2)(log n − 1 + γ − log 2π).',
      'The sum over zeros must pair ρ with 1 − ρ (or ρ̄) to converge.',
    ],
    prerequisites: ['nontrivial-zeros', 'xi-function', 'complex-number'],
    mentions: ['nontrivial-zeros', 'complex-number', 'critical-line', 'functional-equation', 'riemann-hypothesis', 'xi-function', 'weil-positivity', 'platt-trudgian-verified-height', 'nyman-beurling-criterion'],
    furtherReading: [R('RH equivalents', '/rh-equivalents'), R('RH landscape DAG', '/rh-landscape-dag')],
  },

  // ══════════════════════════════════════════════════════════════════════════
  'nyman-beurling-criterion': {
    slug: 'nyman-beurling-criterion',
    term: 'Nyman–Beurling criterion',
    intro: 'The Nyman–Beurling criterion restates the Riemann Hypothesis as an approximation problem: can a flat, constant signal be built, as closely as you like, out of stretched copies of one simple sawtooth-shaped function? RH is true exactly when the error can be made as small as you want. Computations show the error shrinking, but only very slowly, at a rate fixed by the zeros themselves.',
    levels: [
      {
        level: 'beginner',
        heading: 'Building a flat line out of sawtooth waves',
        paragraphs: [
          'The fractional part {y} of a number y is what is left after removing the whole-number part: {2.7} = 0.7. As a function of y it is a sawtooth: it climbs from 0 to 1 and drops back at every whole number.',
          'For each whole number k, the function x ↦ {1/(kx)} on the interval 0 < x < 1 is a stretched and squeezed sawtooth. The question is whether a combination c_1·{1/x} + c_2·{1/(2x)} + … + c_N·{1/(Nx)}, with well-chosen numbers c_k, can approximate the constant function 1 with average squared error d_N² going to zero as N grows.',
          'Nyman (1950) and Beurling (1955), with Báez-Duarte’s (2003) version using whole-number stretches, proved: this approximation succeeds exactly when the Riemann Hypothesis (riemann-hypothesis) is true. The criterion contains no zeros and no complex numbers on its face.',
          'The simplification: the error is measured in an averaged (squared-integral) sense on a precise interval, and the version with only whole-number k needs a careful normalisation; the core equivalence is as stated.',
        ],
        analogy: 'Trying to produce a perfectly steady background hum by mixing a bank of sawtooth oscillators, each running at a different speed. With more oscillators the mix gets steadier, but some leftover ripple remains; RH says the ripple can be driven to zero.',
        example: 'At x = 0.3: {1/0.3} = {3.333} = 0.333, {1/(2·0.3)} = {1.667} = 0.667, {1/(3·0.3)} = {1.111} = 0.111. The approximation has to choose c_1, c_2, c_3, … so that the weighted sum of such values is close to 1 at every x at once.',
      },
      {
        level: 'intermediate',
        heading: 'Distance, Gram matrix, and the Mellin picture',
        paragraphs: [
          'Let ρ(y) = {y} (here ρ denotes the fractional-part function, not a zero). Báez-Duarte’s form: let d_N be the L² distance (square root of the integrated squared difference) from the indicator of (0, 1] to the span of ρ(1/(kx)), k = 1, …, N. RH is equivalent to d_N → 0. Computing d_N is linear algebra: d_N² = 1 − bᵀG_N^{−1}b with Gram matrix G_N of inner products of the sawtooth functions.',
          'Vasyunin found the Gram entries exactly in terms of cotangent sums c_0(h/k) = −Σ_{m<k} (m/k) cot(πmh/k). The project’s Route M (route-m-nyman-beurling) uses these exact entries.',
          'Mellin transform (the multiplicative analogue of the Fourier transform) turns the distance into an integral on the critical line involving the zeta function ζ (riemann-zeta-function): the approximant becomes ζ(s)·D_N(s) with D_N(s) = Σ c_k k^{−s} a short Dirichlet polynomial, and d_N² measures how far ζ·D_N is from 1. At a nontrivial zero of ζ on the line (nontrivial-zeros: the zeros inside the strip 0 < Re s < 1), ζ·D_N = 0 whatever the c_k are, so the integrand equals its maximum value there. Each zero is a fixed loss the approximation can never remove.',
        ],
        math: [
          { tex: T`d_N^2=\inf_{c_1,\dots,c_N}\int_0^\infty\Bigl|\mathbf 1_{(0,1]}(x)-\sum_{k=1}^{N}c_k\,\rho\!\Bigl(\frac1{kx}\Bigr)\Bigr|^2dx=\frac1{2\pi}\inf_{D_N}\int_{-\infty}^{\infty}\frac{|1-\zeta D_N(\tfrac12+it)|^2}{\tfrac14+t^2}\,dt`, note: 'ρ(y) = fractional part; D_N(s) = Σ_{k≤N} c_k k^{−s}; t real height on the critical line.' },
          { tex: T`\liminf_{N\to\infty}\,d_N^2\log N\ \ge\ \sum_{\operatorname{Re}\rho=1/2}\frac{m(\rho)^2}{|\rho|^2}`, note: 'Burnol (2002), unconditional; m(ρ) the multiplicity. With simple zeros the right side is 2 + γ − log 4π = 0.046191 under RH.' },
        ],
        example: 'Repo ladder (src/data/rh-route-m-nyman-beurling-vasyunin-reciprocity-2026-09-23.js): d_5² = 0.036102, d_50² = 0.011869, d_500² = 0.0074199. Check by hand: 0.0074199 × log 500 = 0.0074199 × 6.2146 = 0.04611, ratio 0.998 to the Burnol constant 0.046191.',
      },
      {
        level: 'advanced',
        heading: 'Rate, mollifiers, and the Route M verdict',
        paragraphs: [
          'Báez-Duarte, Balazard, Landreau and Saias conjectured d_N² ~ C/log N with C = Σ_ρ 1/|ρ|² (RH, simple zeros), and Burnol proved the matching lower bound. The heuristic: each on-line zero forces |1 − ζD_N|² = 1 on a window of width about 1/log N around its height, contributing ≈ 1/|ρ|² · 1/log N. So d_N → 0 at best like (log N)^{−1/2}: at N = 500, d_N = 0.086; reaching d_N = 0.01 would need log N ≈ 462.',
          'Near-optimal coefficients are c_k ≈ μ(k)(1 − log k/log N), a mollifier for 1/ζ (mollifier: a short Dirichlet polynomial approximating 1/ζ, as in Levinson’s method, levinsons-method, for zeros on the line). Bettin, Conrey and Farmer showed, under RH and a bound on Σ|ζ′(ρ)|^{−2}, that this choice attains (2 + γ − log 4π)/log N asymptotically.',
          'Project Route M verdict (assessment, no bound): the Bettin–Conrey reciprocity of the Vasyunin sums is the functional equation of the Estermann function and so adds no arithmetic beyond ζ’s functional equation; perturbative use returns the Möbius-mollifier lineage, and the non-perturbative statement d_N → 0 needs a completeness proof equivalent to RH. Neither d_N nor the captured mass tightens faster than the Burnol floor. The Gram matrix is a rank-4 smooth part plus the cotangent matrix; at N = 500, λ_min(G_N) = 5.46·10^{−6} and cond(G_N) ≈ 9.6·10^5.',
        ],
        details: [
          'Nyman, thesis Uppsala (1950); Beurling, PNAS 41 (1955) 312–314 (also: no zeros in Re s > 1/p ⇔ density in L^p); Báez-Duarte, Rend. Mat. Acc. Lincei 14 (2003) 5–11; Burnol, Adv. Math. 170 (2002) 56–70.',
          'An off-line zero ρ_0 would make the integrand |1 − ζD_N|² equal 1 at a point off the line, which yields a positive lower bound for d_N independent of N, hence the criterion.',
          'Route M remainder and sign-law ladders: /route-m-cohort2-audit and the /viz-imp96075-route-m-vasyunin-dn-ladder page.',
        ],
      },
    ],
    physicsAnalogy: {
      system: 'A bank of filters with fixed notches trying to pass a flat spectrum.',
      mapping: [
        'Mellin variable t ↔ frequency; the target "1" ↔ a flat spectrum; ζ·D_N ↔ the combined response of the filter bank.',
        'Each zero of ζ on the line ↔ a notch at a fixed frequency that no filter setting can fill (ζ·D_N = 0 there whatever D_N is).',
        'More filters (larger N) ↔ narrower notches, of width about 1/log N, so the residual energy d_N² ≈ (sum of notch weights 1/|ρ|²)/log N.',
        'An off-line zero ↔ a notch that cannot be narrowed on the measurement line, so the residual stays bounded below: approximation fails.',
      ],
      whereItBreaks: 'The "filters" are Dirichlet polynomials, not physical circuits, and the weight 1/(1/4 + t²) is fixed by the problem. The notch widths shrink only logarithmically, much more slowly than in any practical filter design.',
    },
    examples: [
      {
        title: 'Reading the d_N ladder',
        level: 'intermediate',
        steps: ['N = 5: d² = 0.036102, d² log N = 0.058103, ratio to 0.046191 is 1.258.', 'N = 100: d² = 0.010189, d² log N = 0.046921, ratio 1.016.', 'N = 500: d² = 0.0074199, d² log N = 0.046112, ratio 0.998.'],
        result: 'd_N² log N settles on the Burnol constant 0.046191 = Σ 1/|ρ|²: the decrease of d_N is exactly the rate the on-line zeros allow, no faster.',
      },
    ],
    whyItMatters: 'The criterion converts RH into a concrete, zero-free linear-algebra problem, which is why the project tested it as Route M. The result was a precise measurement (d_N² log N → Burnol constant) and a structural verdict: the extra arithmetic it seemed to offer reduces to the functional equation and to the mollifier lineage. RH is open; Route M changes no bound.',
    example: 'd_500² = 0.0074199 and d_500² log 500 = 0.04611, 99.8% of Σ 1/|ρ|² = 0.046191.',
    pitfalls: [
      'Slow decrease of d_N is expected under RH; it is not evidence against RH.',
      'Here ρ(y) is the fractional-part function, not a zero.',
      'A numerically small d_N for finite N proves nothing; the criterion is about the limit.',
    ],
    prerequisites: ['riemann-hypothesis', 'riemann-zeta-function', 'nontrivial-zeros'],
    mentions: ['riemann-hypothesis', 'riemann-zeta-function', 'route-m-nyman-beurling', 'mollifier', 'levinsons-method', 'nontrivial-zeros'],
    furtherReading: [R('Route M audit', '/route-m-cohort2-audit'), R('Vasyunin d_N ladder', '/viz-imp96075-route-m-vasyunin-dn-ladder'), R('RH equivalents', '/rh-equivalents')],
  },

  // ══════════════════════════════════════════════════════════════════════════
  'hilbert-polya': {
    slug: 'hilbert-polya',
    term: 'Hilbert–Pólya conjecture',
    intro: 'The Hilbert–Pólya idea is that the zeros of zeta might be the energy levels of some physical or mathematical system. In quantum mechanics, energy levels of a closed system are always real numbers; if the zero heights were such levels, they would be real and the Riemann Hypothesis would follow. Nobody has found the system, but the statistics of the zeros look like those of quantum energy levels.',
    levels: [
      {
        level: 'beginner',
        heading: 'Zeros as energy levels',
        paragraphs: [
          'Write each nontrivial zero (nontrivial-zeros) as ρ = 1/2 + iE. The Riemann Hypothesis (riemann-hypothesis) says every E is a real number; if a zero were off the line, its E would have an imaginary part.',
          'In quantum mechanics, the possible energies of a closed system are the eigenvalues of an operator called the Hamiltonian (hamiltonian). For closed (energy-conserving) systems that operator is "self-adjoint", the infinite-dimensional version of a symmetric matrix, and the eigenvalues of a symmetric matrix are always real. The Hilbert–Pólya proposal: find a self-adjoint operator whose eigenvalues are exactly the E’s. Its existence would prove RH.',
          'The simplification: a self-adjoint operator alone is not enough; one must also prove its eigenvalues are exactly the zeros, which is the hard part. The idea is attributed to Hilbert and Pólya around 1914 but was not published by them.',
        ],
        analogy: 'The tones a guitar string can play are fixed real frequencies because the string does not lose energy. If the zeros were the tones of some ideal lossless instrument, they would have to be real.',
        example: 'The symmetric matrix [[2, 1], [1, 0]] has eigenvalues 1 + √2 = 2.414 and 1 − √2 = −0.414, both real. The non-symmetric [[0, 1], [−1, 0]] has eigenvalues i and −i. Symmetry forces reality.',
      },
      {
        level: 'intermediate',
        heading: 'Self-adjointness, counting, and statistics',
        paragraphs: [
          'For a self-adjoint H on a Hilbert space, ⟨Hv, v⟩ is real for every v, so if Hv = Ev then E⟨v, v⟩ is real and E is real. That is the whole mechanism.',
          'Two kinds of evidence make the idea attractive. Counting: the number of zeros with 0 < E ≤ T is N(T) = (T/2π) log(T/2πe) + 7/8 + S(T), and Berry and Keating (berry-keating) observed that a semiclassical count for the classical Hamiltonian H = xp, with a cut-off, reproduces the smooth part. Statistics: the spacings of high zeros match those of eigenvalues of large random Hermitian matrices from the Gaussian Unitary Ensemble (gue), as Montgomery’s pair correlation (pair-correlation) and Odlyzko’s computations show. GUE rather than GOE statistics suggest an operator without time-reversal symmetry.',
          'Proven analogues: for a compact hyperbolic surface, the zeros of the Selberg zeta function sit at s = 1/2 ± ir_j where λ_j = 1/4 + r_j² are eigenvalues of the Laplacian, a self-adjoint operator; the Selberg trace formula (selberg-trace-formula) is the analogue of the explicit formula. For curves over finite fields the zeros are eigenvalues of Frobenius on cohomology (rh-for-curves), and RH there is a theorem (Weil 1948, Deligne 1974).',
        ],
        math: [
          { tex: T`\rho=\tfrac12+iE,\qquad H=H^{*}\ \Rightarrow\ E\in\mathbb R`, note: 'H* is the adjoint (conjugate transpose for matrices); real eigenvalues give zeros on the line.' },
          { tex: T`N(T)=\frac{T}{2\pi}\log\frac{T}{2\pi e}+\frac78+S(T)`, note: 'Riemann–von Mangoldt count; S(T) = (1/π) arg ζ(1/2 + iT) is small on average.' },
        ],
        example: 'At T = 100 the smooth count gives (100/2π) log(100/2πe) + 7/8 = 15.9155 × 1.7673 + 0.875 = 29.00, and there are exactly 29 zeros below height 100. The first three heights are 14.1347, 21.0220, 25.0109.',
      },
      {
        level: 'advanced',
        heading: 'Candidates and what they would need',
        paragraphs: [
          'Berry–Keating: quantise H = xp with boundary conditions that make the spectrum discrete. The symmetric operator (xp + px)/2 has continuous spectrum on L²(ℝ); with phase-space cut-offs the semiclassical count matches the smooth part of N(T) but not the fluctuations S(T). The repo’s demo truncates H_sym in a Hermite basis and compares with the first 30 zeros (src/data/berry-keating-xp-spectral.js, /berry-keating-xp); it is a demonstration, not a candidate operator.',
          'Connes (1999) (connes-spectral-approach): the zeros appear as an absorption spectrum of the scaling action on the adele class space (adele-class-space); RH becomes positivity of a global trace formula, which is equivalent to Weil positivity (weil-positivity). Connes–Consani’s 2021 archimedean result proves the semilocal positivity for small support (log width ln 2).',
          'Constraints any candidate must meet: the eigenvalue density (1/2π) log(E/2π); GUE local statistics; the explicit formula as its trace formula, including the opposite sign of the prime (periodic-orbit) term compared with Gutzwiller’s formula; and, by the project’s Euler-blindness results (euler-blindness: a test that gives the same answer for an Euler product and for an RH-false look-alike cannot detect the Euler product), it must use the Euler product, since operators built from the functional equation and gamma factor alone would also apply to RH-false functions. The NS-RIGID dichotomy (ns-rigid: finite positivity statements on the heat flow’s native span are either stable under the flow or already refute RH) points the same way.',
        ],
        details: [
          'Berry and Keating, SIAM Review 41 (1999) 236–266.',
          'Sierra, Bender–Brody–Müller and others proposed refinements of xp; none is established, and Bender–Brody–Müller’s operator is not self-adjoint in the standard sense.',
          'Status (src/data/rh-landscape-dag.js): open, conjectural program; candidate Hamiltonians are not established.',
        ],
      },
    ],
    physicsAnalogy: {
      system: 'A closed quantum system (for example a particle in a chaotic billiard) and its energy levels.',
      mapping: [
        'Zero heights E ↔ energy eigenvalues; the critical line ↔ the real energy axis.',
        'Self-adjoint Hamiltonian ↔ energy conservation (no loss, no gain); real spectrum ↔ RH.',
        'Primes ↔ periodic orbits (lengths log p) through the trace formula; the smooth zero count ↔ Weyl’s phase-space volume law.',
        'GUE statistics of the zeros ↔ a chaotic system without time-reversal symmetry (quantum-chaos).',
      ],
      whereItBreaks: 'No such system is known. The prime-orbit term enters with the opposite sign to Gutzwiller’s formula, and the semiclassical xp model reproduces only the smooth count. An operator that is self-adjoint but whose spectrum is not provably the zeros proves nothing.',
    },
    examples: [
      {
        title: 'Real eigenvalues from symmetry',
        level: 'beginner',
        steps: ['[[2, 1], [1, 0]]: eigenvalues solve λ² − 2λ − 1 = 0, so λ = 1 ± √2.', 'Discriminant 4 + 4 = 8 > 0: real.', 'For any symmetric [[a, b], [b, c]] the discriminant is (a − c)² + 4b² ≥ 0.'],
        result: 'Symmetric matrices always have real eigenvalues; this is the finite version of the Hilbert–Pólya mechanism.',
      },
      {
        title: 'Counting zeros below 100',
        level: 'intermediate',
        steps: ['100/2π = 15.9155; 100/(2πe) = 5.8550; log 5.8550 = 1.7673.', '15.9155 × 1.7673 = 28.128; + 0.875 = 29.00.'],
        result: 'The smooth count 29.00 matches the 29 zeros below height 100.',
      },
    ],
    whyItMatters: 'Hilbert–Pólya is the main spectral heuristic for why RH should be true, and it organises the physics analogies used across this project (twin-ladder scattering, Connes’ spectral approach, GUE comparisons). The project’s Euler-blindness and NS-RIGID results add a constraint: a spectral realisation must use the Euler product. RH is open; no operator is established.',
    example: 'Smooth count 29.00 vs 29 zeros below height 100; first zero 14.134725.',
    pitfalls: [
      'Matching statistics (GUE) is evidence of a similarity, not a construction.',
      'Self-adjointness gives reality of eigenvalues; identifying the spectrum with the zeros is the actual problem.',
      'The xp model has continuous spectrum without extra boundary conditions.',
    ],
    prerequisites: ['nontrivial-zeros', 'hamiltonian', 'riemann-hypothesis'],
    mentions: ['nontrivial-zeros', 'riemann-hypothesis', 'hamiltonian', 'berry-keating', 'gue', 'pair-correlation', 'selberg-trace-formula', 'rh-for-curves', 'connes-spectral-approach', 'adele-class-space', 'weil-positivity', 'quantum-chaos', 'euler-blindness', 'twin-ladder', 'ns-rigid'],
    furtherReading: [R('Berry–Keating xp', '/berry-keating-xp'), R('Connes adelic approach', '/connes-adelic'), R('GUE comparison', '/gue-comparison'), R('Selberg trace formula', '/selberg-trace'), R('Spectral attack', '/spectral-attack')],
  },

  // ══════════════════════════════════════════════════════════════════════════
  'zero-free-region': {
    slug: 'zero-free-region',
    term: 'Zero-free region',
    intro: 'A zero-free region is a part of the complex plane that has been proven to contain no zeros of the zeta function. The proven regions are thin slivers next to the right edge of the critical strip, and they get thinner as you go higher. The Riemann Hypothesis is the claim that the whole right half of the strip is zero-free.',
    levels: [
      {
        level: 'beginner',
        heading: 'A proven safe zone near the edge',
        paragraphs: [
          'All nontrivial zeros of zeta lie in the critical strip (critical-strip): the vertical band of complex numbers s = σ + it with real part σ between 0 and 1. By the mirror symmetry (functional-equation), a zero at real part σ has a partner at 1 − σ, so it is enough to ask how far right zeros can be.',
          'In 1896 Hadamard and de la Vallée Poussin proved that there are no zeros on the right edge σ = 1. That fact is equivalent to the prime number theorem (prime-number-theorem), which says the number of primes up to x is about x/log x.',
          'A zero-free region pushes this a little further left: no zeros with σ > 1 − (a small amount that depends on the height t). The best simple explicit version (Mossinghoff–Trudgian–Yang) is σ > 1 − 1/(5.558691 · log t). The amount shrinks as t grows, so the region never reaches a fixed vertical line. RH (riemann-hypothesis) would make everything with σ > 1/2 zero-free.',
          'The simplification: there are also small technical conditions (t at least 2, say), and stronger but more complicated regions exist for very large t.',
        ],
        analogy: 'A coastline survey that has proven the last few metres before the cliff edge are free of rocks, but where the surveyed strip narrows the further along the coast you go. RH would clear the whole bay.',
        example: 'At height t = 10^6: log t = 13.8155, so 5.558691 × 13.8155 = 76.80 and 1/76.80 = 0.0130. No zeros with σ > 0.98698. At t = 10^20 the boundary is 0.99609. RH would put it at 0.5.',
      },
      {
        level: 'intermediate',
        heading: 'Why the edge is zero-free, and why the region is thin',
        paragraphs: [
          'The classical proof uses the inequality 3 + 4cos φ + cos 2φ = 2(1 + cos φ)² ≥ 0. Applied to the logarithm of the Euler product (euler-product) it gives |ζ(σ)³ ζ(σ + it)⁴ ζ(σ + 2it)| ≥ 1 for σ > 1. A zero at 1 + it would make the left side tend to 0 as σ → 1 (the triple pole of ζ(σ)³ is beaten by the fourth-order zero), a contradiction. Quantifying this argument near σ = 1 gives the de la Vallée Poussin region σ > 1 − c/log t.',
          'Vinogradov and Korobov (1958) improved the shape using bounds for exponential sums Σ n^{−it}: σ > 1 − c/((log t)^{2/3}(log log t)^{1/3}). The exponent 2/3 has not changed since 1958 (exponential-sum-wall: zero-free regions are limited by how well such sums can be bounded).',
          'Consequences for primes go through the explicit formula (explicit-formula): the error ψ(x) − x is a sum of waves x^ρ/ρ, and a zero-free region bounds every x^β. The classical region gives ψ(x) − x = O(x exp(−c√log x)).',
        ],
        math: [
          { tex: T`3+4\cos\varphi+\cos2\varphi=2(1+\cos\varphi)^2\ge0`, note: 'φ real; applied with φ = t log p for each prime p.' },
          { tex: T`\zeta(\sigma+it)\neq0\quad\text{for}\quad \sigma>1-\frac{1}{5.558691\,\log|t|},\ \ |t|\ge2`, note: 'Mossinghoff–Trudgian–Yang explicit classical region.' },
          { tex: T`\sigma>1-\frac{c}{(\log|t|)^{2/3}(\log\log|t|)^{1/3}}`, note: 'Vinogradov–Korobov shape; explicit c = 1/57.54 (Ford 2002), 1/53.989 (Bellotti 2024) for large |t|.' },
        ],
        example: 'Check the trigonometric inequality at φ = π: 3 + 4(−1) + 1 = 0, and 2(1 + (−1))² = 0. At φ = π/2: 3 + 0 + (−1) = 2 = 2(1 + 0)². It is a perfect square, so never negative.',
      },
      {
        level: 'advanced',
        heading: 'Strip statements, RH-equivalence, and the project’s uses',
        paragraphs: [
          'RH is equivalent to: no zeros with σ > 1/2 + a, for every a > 0. No strip σ > 1 − δ with fixed δ > 0 is known to be zero-free; such a strip would already give ψ(x) − x = O(x^{1−δ+ε}), far beyond current methods. Zero-density estimates (zero-density-estimate) bound how many zeros could lie right of a line, which is weaker than excluding them.',
          'In the project’s twin-ladder language the statement T3(a) is exactly "no zeros with Re s > 1/2 + a" (t3-strip), so T3 for all a > 0 is RH: a strip in operator form, verified numerically to the dictionary precision 10^{−30}.',
          'RES-T (theorem-res-t, project-internal): for Weil positivity at support T beyond the ceiling T_X = 3.882, the content of W_T ≥ 0 is a zero-free region β − 1/2 ≤ √(log(t/2π)/(T³ S(T(β − 1/2))⁴)), nontrivial up to height about 2π exp(T³/4S⁴): stronger than verified height, weaker than RH. Zero-free regions are Λ-inert for the de Bruijn–Newman bound (src/data/zero-density-lambda-inert-2026-07-09.js): the barrier method needs every zero below the verified height to be on the line, not a strip.',
        ],
        details: [
          'de la Vallée Poussin (1899); Vinogradov, Korobov (1958); Ford, Proc. LMS 85 (2002) 565–633; Mossinghoff–Trudgian–Yang arXiv:2212.06867; Bellotti arXiv:2306.10680.',
          'VK region gives ψ(x) − x = O(x exp(−c (log x)^{3/5} (log log x)^{−1/5})).',
          'Below the verified height (γ ≤ 3.0001753·10^12) every zero is known to be on the line, a far stronger statement in that range than any zero-free region.',
        ],
      },
    ],
    physicsAnalogy: {
      system: 'Relaxation to equilibrium governed by the slowest-decaying mode (a spectral gap), e.g. heat diffusion in a rod.',
      mapping: [
        'Write x = e^u. Each zero contributes e^{βu}e^{iγu}/ρ to ψ(e^u) − e^u: a mode with growth rate β (relative to the main term’s rate 1) and frequency γ.',
        'The prime-counting error behaves like a signal whose size is set by the least-damped mode, just as the approach of a heated rod to equilibrium is set by the smallest decay rate (the spectral gap).',
        'A zero-free region is a proven lower bound on the damping, 1 − β ≥ c/log γ, and the bound weakens for high frequencies γ.',
        'RH says every mode has exactly half the growth rate of the main term: a uniform gap of 1/2.',
      ],
      whereItBreaks: 'In a physical rod the gap is a fixed number; here the proven gap shrinks to 0 with frequency, and infinitely many modes contribute. The zeros are not known to be modes of any physical system.',
    },
    examples: [
      {
        title: 'Width of the region at three heights',
        level: 'beginner',
        steps: ['t = 10^6: 1/(5.558691 × 13.8155) = 0.01302 → σ > 0.98698.', 't = 3·10^12: log t = 28.73 → σ > 0.99374.', 't = 10^20: log t = 46.05 → σ > 0.99609.'],
        result: 'The proven zero-free sliver narrows from 1.3% of the strip at t = 10^6 to 0.39% at t = 10^20; RH would make it 50%.',
      },
    ],
    whyItMatters: 'Zero-free regions are what make the prime number theorem quantitative, and they fix what unconditional prime-counting bounds are available. In this project they appear as the T3 strip of the twin-ladder model, as the content of Weil positivity beyond the RES-T ceiling, and as an example of a lever that cannot move the de Bruijn–Newman bound: Platt–Trudgian Λ ≤ 0.2 needs verified height, not a strip.',
    example: 'At t = 10^6 no zeros with σ > 0.98698 (MTY constant 5.558691).',
    pitfalls: [
      'A zero-free region near σ = 1 says nothing about zeros near σ = 1/2.',
      'The region shrinks with height; there is no proven zero-free vertical strip.',
      'Zero-free regions do not imply that any zeros are on the line.',
    ],
    prerequisites: ['critical-strip', 'prime-number-theorem', 'euler-product'],
    mentions: ['critical-strip', 'functional-equation', 'prime-number-theorem', 'riemann-hypothesis', 'euler-product', 'exponential-sum-wall', 'explicit-formula', 'zero-density-estimate', 't3-strip', 'theorem-res-t'],
    furtherReading: [R('RH landscape DAG', '/rh-landscape-dag'), R('Flow-blindness no-go (T3 strip)', '/flow-blindness-no-go'), U('Mossinghoff–Trudgian–Yang (arXiv:2212.06867)', 'https://arxiv.org/abs/2212.06867')],
  },

  // ══════════════════════════════════════════════════════════════════════════
  'zero-density-estimate': {
    slug: 'zero-density-estimate',
    term: 'Zero-density estimate',
    intro: 'A zero-density estimate puts an upper limit on how many zeros of zeta could lie away from the critical line. It does not say there are none; it says that if there are any, they must be rare compared with the total. The strongest such results are a large part of modern progress on primes.',
    levels: [
      {
        level: 'beginner',
        heading: 'Counting possible exceptions',
        paragraphs: [
          'Write a nontrivial zero (nontrivial-zeros) as ρ = β + iγ, with β its real part and γ its height. Let N(σ, T) be the number of zeros with β > σ and 0 < γ ≤ T. Under RH (riemann-hypothesis) this is 0 for every σ > 1/2. Without RH we can only bound it from above.',
          'For comparison, the total number of zeros up to height T is about (T/2π) log(T/2π): roughly T log T. Zero-density estimates show N(σ, T) is at most about T raised to a power below 1 when σ > 1/2, so off-line zeros, if any, form a vanishing fraction.',
          'Ingham (1940) proved an exponent 3(1 − σ)/(2 − σ). Guth and Maynard (2024) improved it to 30(1 − σ)/13 near σ = 3/4, the first improvement there in about 80 years. The Density Hypothesis conjectures 2(1 − σ). Bohr and Landau (1914) had already shown that for any fixed small ε, almost all zeros are within ε of the line.',
          'The simplification: the bounds hold up to constant factors and small powers of log T (or T^ε), so they describe growth rates, not exact counts.',
        ],
        analogy: 'Quality control on a production line: you cannot prove every item is perfect, but sampling shows defective items, if any, are at most a vanishing fraction. A density estimate is such a defect-rate bound for zeros.',
        example: 'At σ = 3/4 and T = 10^12, ignoring constants: Ingham allows at most about T^0.6 = 1.6·10^7 zeros, Guth–Maynard about T^0.577 = 8.4·10^6, the Density Hypothesis T^0.5 = 10^6, while the total number of zeros below 10^12 is about 3.9·10^12. (Below 3·10^12, verification shows there are none at all.)',
      },
      {
        level: 'intermediate',
        heading: 'Method: large values of Dirichlet polynomials',
        paragraphs: [
          'The standard method multiplies ζ by a mollifier (mollifier: a short sum M(s) = Σ_{n≤y} μ(n) n^{−s} approximating 1/ζ). Near a zero ρ, ζ(ρ)M(ρ) = 0, while away from zeros ζM ≈ 1. So each zero forces some short Dirichlet polynomial Σ a_n n^{−s} to be large at a nearby point. Counting zeros becomes counting points where a Dirichlet polynomial takes large values.',
          'Mean-value theorems bound the average size: ∫_0^T |Σ_{n≤N} a_n n^{−it}|² dt = Σ |a_n|²(T + O(n)). By a Chebyshev-type argument, a polynomial with bounded mean square can be large only on a small set. Guth–Maynard’s advance is a new large-values estimate for these polynomials.',
          'Zero-density results feed primes in short intervals: Guth–Maynard give primes in [x, x + x^{17/30+ε}] for large x.',
        ],
        math: [
          { tex: T`N(\sigma,T)=\#\{\rho=\beta+i\gamma:\ \beta>\sigma,\ 0<\gamma\le T\}`, note: 'Counted with multiplicity; 1/2 ≤ σ ≤ 1.' },
          { tex: T`N(\sigma,T)\ll T^{\frac{3(1-\sigma)}{2-\sigma}}\log^5T\ \ (\text{Ingham}),\qquad N(\sigma,T)\le T^{\frac{30(1-\sigma)}{13}+o(1)}\ \ (\text{Guth–Maynard})`, note: '≪ means "at most a constant times"; o(1) is a quantity tending to 0 as T → ∞.' },
          { tex: T`N(\sigma,T)\ll T^{2(1-\sigma)+\varepsilon}\ \ (\text{Density Hypothesis; implied by Lindelöf})`, note: 'Lindelöf hypothesis (lindelof-hypothesis): ζ(1/2 + it) = O(t^ε); it is implied by RH.' },
        ],
        example: 'Exponents at σ = 3/4: Ingham 3(1/4)/(5/4) = 0.6; Guth–Maynard 30/52 = 0.5769; Density Hypothesis 0.5. At σ = 1/2 all three give exponent ≥ 1, i.e. no information beyond the total count.',
      },
      {
        level: 'advanced',
        heading: 'Density versus existence: why density is Λ-inert',
        paragraphs: [
          'Density estimates complement zero-free regions (zero-free-region: proven zones near Re s = 1 containing no zeros at all). They are averages: they bound counts over a whole height range and allow T^ε exceptions. They cannot certify N(σ, T) = 0 in any range, because a bound that gave 0 in a strip would already be RH there. This is the pointwise-versus-average wall (pointwise-vs-average-wall): most zero results control averages over many heights, while barrier arguments need control at one height.',
          'Project scoping (src/data/zero-density-lambda-inert-2026-07-09.js): the Polymath15 / Platt–Trudgian bound for the de Bruijn–Newman constant (de-bruijn-newman-constant) is gated by the verified height X ≈ 3·10^12, a computation certifying that the count of off-line zeros below X is exactly 0. Density cannot replace or reduce that computation, so even the full Density Hypothesis moves the rigorous Λ ≤ 0.2 bound by exactly zero.',
          'Related exponents: Huxley (1972) proved A(σ) ≤ 12/5 uniformly; Guth–Maynard’s 30/13 ≈ 2.31 improves the region near 3/4. Tao–Trudgian–Yang (2025) mechanised the bookkeeping of exponent-pair and additive-energy inputs.',
        ],
        details: [
          'Ingham, Quart. J. Math. Oxford 11 (1940); Huxley, Invent. Math. 15 (1972) 164–170; Guth–Maynard, arXiv:2405.20552, Ann. of Math. 203 (2026) 623–675.',
          'Selberg: N(σ, T) ≪ T^{1 − (σ − 1/2)/4} log T, which shows most zeros are within O(1/log T) of the line on average.',
          'Project pages: /zero-density-scoping and /guth-maynard-scoping.',
        ],
      },
    ],
    physicsAnalogy: {
      system: 'A tail bound for particle energies in a gas (Markov/Chebyshev inequality from a known average energy).',
      mapping: [
        'Each zero off the line forces a short Dirichlet polynomial to be large somewhere, as a high-energy particle carries a large energy.',
        'The mean-value theorem fixes the total (average) "energy" of the polynomial over the height range.',
        'A fixed total energy limits how many particles can have energy above a threshold; likewise it limits how many zeros can sit right of σ.',
        'Better large-values estimates (Guth–Maynard) are like using higher moments of the energy distribution to get sharper tail bounds.',
      ],
      whereItBreaks: 'A tail bound never excludes a single high-energy particle, just as density never excludes a single off-line zero. The "energy" here is a Dirichlet-polynomial value, not a physical quantity, and the counting is in height ranges, not in a thermal ensemble.',
    },
    examples: [
      {
        title: 'Exponents at σ = 3/4',
        level: 'beginner',
        steps: ['Ingham: 3 × 0.25 / 1.25 = 0.6.', 'Guth–Maynard: 30 × 0.25 / 13 = 0.5769.', 'Density Hypothesis: 2 × 0.25 = 0.5.', 'At T = 10^12: 10^{7.2} = 1.58·10^7; 10^{6.92} = 8.38·10^6; 10^6.'],
        result: 'All three allow at most a tiny fraction of the ~3.9·10^12 zeros below 10^12 to have β > 3/4 (constants and log factors ignored).',
      },
    ],
    whyItMatters: 'Zero-density estimates are central to unconditional results about primes in short intervals and arithmetic progressions, and Guth–Maynard is the main recent advance. For this project they are a calibrated non-lever: the scoping module shows density is Λ-inert because the de Bruijn–Newman barrier needs exact zero-freeness below the verified height, not a count.',
    example: 'At σ = 3/4: exponents 0.6 (Ingham), 0.5769 (Guth–Maynard), 0.5 (Density Hypothesis).',
    pitfalls: [
      'A density bound does not exclude any single off-line zero.',
      '"100% of zeros near the line" (density one) does not imply RH.',
      'Exponents describe growth rates; constants and log factors are suppressed.',
    ],
    prerequisites: ['nontrivial-zeros', 'zero-free-region', 'mollifier'],
    mentions: ['nontrivial-zeros', 'riemann-hypothesis', 'mollifier', 'lindelof-hypothesis', 'zero-free-region', 'pointwise-vs-average-wall', 'de-bruijn-newman-constant'],
    furtherReading: [R('Zero-density scoping', '/zero-density-scoping'), R('Guth–Maynard scoping', '/guth-maynard-scoping'), U('Guth–Maynard (arXiv:2405.20552)', 'https://arxiv.org/abs/2405.20552')],
  },

  // ══════════════════════════════════════════════════════════════════════════
  'critical-line-proportion': {
    slug: 'critical-line-proportion',
    term: 'Proportion of zeros on the critical line',
    intro: 'Since nobody can prove that all zeros of zeta are on the critical line, mathematicians prove that at least a certain fraction of them are. The proven fraction has grown from "infinitely many" in 1914 to more than five-twelfths (about 41.7%) in the peer-reviewed literature. The Riemann Hypothesis would make it 100%, but even 100% in this averaged sense would not by itself prove RH.',
    levels: [
      {
        level: 'beginner',
        heading: 'What fraction is proven to be on the line?',
        paragraphs: [
          'Count all nontrivial zeros (nontrivial-zeros) up to height T: call that N(T). Count those proven to sit exactly on the critical line (critical-line) up to the same height: N_0(T). The proportion κ is the long-run ratio N_0(T)/N(T) as T grows.',
          'The record: Hardy (1914) infinitely many on the line; Selberg (1942) a positive proportion; Levinson (1974) at least 1/3; Conrey (1989) at least 40.88%, and these are simple zeros; Bui–Conrey–Young (2011) 41.05%; Feng (2012) 41.28%; Pratt–Robles–Zaharescu–Zeindler (2020) more than 5/12 = 41.67%, the current peer-reviewed record.',
          'In 2026 Alpöge and Furman posted a different method claiming at least 2/3 of zeros are simple and on the line (0.6725 with a refinement), with a proof found with Claude (Anthropic), checked in Lean and reproved by Lamzouri, but not yet peer-reviewed. It is an external result, not this project’s.',
          'What the simplification leaves out: κ is an asymptotic (limiting) statement. It is compatible with infinitely many off-line zeros, as long as they are a vanishing fraction. So κ = 100% would not prove RH.',
        ],
        analogy: 'A census that can directly confirm the address of only some residents. Over the years the confirmed share has risen from "some" to about 42%, but even a confirmed share approaching 100% would allow a thinning set of unconfirmed residents.',
        example: 'Below height 100 there are 29 zeros; numerically all 29 are on the line. Proportion theorems say nothing about this small range: 5/12 of 29 would be 12.1, but the theorem is a statement about the limit as T → ∞. Separately, verification shows all 12,363,153,437,138 zeros below 3.0001753·10^12 are on the line.',
      },
      {
        level: 'intermediate',
        heading: 'How zeros on the line are counted',
        paragraphs: [
          'Zeros on the line are detected as sign changes of the real Hardy function Z(t) = e^{iθ(t)} ζ(1/2 + it) (hardy-z-function). The total N(T) is known from the argument principle (argument-principle): N(T) = (T/2π) log(T/2πe) + 7/8 + S(T). A proportion result needs a lower bound for sign changes that is a fixed fraction of N(T).',
          'Selberg used a mollifier (mollifier: a short Dirichlet polynomial M ≈ 1/ζ that damps the large values of ζ) to show Z changes sign often in short intervals. Levinson’s method (levinsons-method) instead relates zeros on the line to zeros of a related function V = ζ + ζ′/L off the line and counts the latter using a mollified mean square, giving κ ≥ 1 − (1/R) log c, with c a mean-square constant and R a free shift parameter.',
          'Longer mollifiers give better constants; their length is limited by mean-value theorems, which is the mollifier-length wall (mollifier-length-wall).',
        ],
        math: [
          { tex: T`\kappa=\liminf_{T\to\infty}\frac{N_0(T)}{N(T)},\qquad N(T)\sim\frac{T}{2\pi}\log\frac{T}{2\pi}`, note: 'N_0(T) = number of zeros 1/2 + iγ with 0 < γ ≤ T (on the line).' },
          { tex: T`\kappa\ \ge\ 1-\frac1R\log c(P,Q,R)+o(1)`, note: 'Levinson–Conrey inequality; P is the mollifier shape, Q the differential-operator polynomial, R > 0 the shift σ_0 = 1/2 − R/log T.' },
        ],
        example: 'Repo reproduction of the classical constants (src/data/dag3-levbridge-2026-09-28.js): Levinson 0.34276 at R = 1.287; Conrey with θ = 1/2 and a degree-5 Q: 0.365796 (literature 0.36581); θ = 4/7: 0.408953 (literature 0.4088).',
      },
      {
        level: 'advanced',
        heading: 'Records, lineages, and what κ = 1 would and would not give',
        paragraphs: [
          'Lineage 1 (Levinson–Conrey mollifier): Levinson 1/3 (1974), Conrey 0.4088 with mollifier length θ = 4/7 via Deshouillers–Iwaniec Kloosterman-sum bounds (1989), Bui–Conrey–Young two-piece mollifier 0.4105 (2011), Feng 0.4128 (2012), Pratt–Robles–Zaharescu–Zeindler > 5/12 (2020). Gains are incremental and capped by the mollifier length.',
          'Lineage 2 (pair correlation, external, 2026): Alpöge–Furman make Montgomery’s RH-conditional 2/3 simple-zero bound unconditional through Sylvester inertia and a rank–trace inequality on a finite compression of Weil’s Hermitian form (weil-positivity), using the pair-correlation form factor on [−1, 1] (pair-correlation). Status in the repo: claimed, Lean-verified, independently reproved, not peer-reviewed (src/data/critical-line-proportion.js).',
          'Relation to RH: RH ⇒ κ = 1, but κ = 1 as a density statement does not imply RH. Proportion results are independent of the de Bruijn–Newman bound and of the verified height; the project’s Levinson-bridge study (dag3-levbridge) re-reads the method in twin-ladder language and finds no proportion improvement and no Λ movement.',
        ],
        details: [
          'Hardy (1914); Selberg (1942); Levinson, Adv. Math. 13 (1974) 383–436; Conrey, J. reine angew. Math. 399 (1989) 1–26; PRZZ, Res. Math. Sci. 7 (2020); Alpöge–Furman arXiv:2608.13637; Lamzouri arXiv:2609.02882.',
          'Repo finite-T measurement: with a fixed asymptotic Q, the primorial Euler-product mollifier κ_T proxy changes sign between T = 10^16 and 10^20, while length-truncated μ-mollifiers stay positive; these are main-term proxies, not proportion statements.',
        ],
      },
    ],
    physicsAnalogy: {
      system: 'Certifying undamped modes of a resonator by watching them oscillate, against a total mode count from Weyl’s law.',
      mapping: [
        'Total zero count N(T) ↔ Weyl’s law: the number of modes below a frequency, known from the geometry (here from the gamma factor).',
        'Sign changes of the real function Z(t) ↔ directly observed zero crossings of an undamped oscillation: each one certifies a mode on the real axis (a zero on the line).',
        'κ ↔ the fraction of modes you can certify this way. Levinson-type methods are measurement schemes that guarantee a fixed fraction of crossings is seen.',
        'Mollifier length ↔ the bandwidth of the measurement filter; a longer filter certifies more crossings, but available bandwidth is capped.',
      ],
      whereItBreaks: 'A real resonator has finitely many modes below any frequency and can be measured mode by mode; here only asymptotic fractions are proven. A certified fraction near 1 still allows a sparse set of uncertified (possibly off-line) zeros.',
    },
    examples: [
      {
        title: 'Back-solving Levinson’s mean square',
        level: 'intermediate',
        steps: ['Levinson’s inequality κ ≥ 1 − (1/R) log c.', 'With κ = 0.34276 at R = 1.287: log c = 1.287 × (1 − 0.34276) = 0.8459.', 'c = e^{0.8459} = 2.330.'],
        result: 'Levinson’s 34.3% corresponds to a mollified mean-square constant of about 2.33; reducing c (better mollifiers) raises κ.',
      },
    ],
    whyItMatters: 'Proportion results are the second classical measure of progress on RH, alongside zero-free regions and verified height. They are independent of the de Bruijn–Newman constant: no proportion result moves Λ. The project tracks the record (> 5/12 peer-reviewed; the 2026 Alpöge–Furman ≥ 2/3 claim external and unreviewed) and used Levinson’s method as a test case for twin-ladder mollifiers.',
    example: 'Peer-reviewed record κ > 5/12 = 0.41667 (PRZZ 2020); repo reproduction of Conrey’s θ = 4/7 constant 0.408953.',
    pitfalls: [
      'κ = 100% would not prove RH.',
      'Proportion theorems are asymptotic and say nothing about any finite range of heights.',
      'The 2/3 result is an external claim, not peer-reviewed, and not this project’s result.',
    ],
    prerequisites: ['nontrivial-zeros', 'critical-line', 'hardy-z-function'],
    mentions: ['nontrivial-zeros', 'critical-line', 'hardy-z-function', 'argument-principle', 'mollifier', 'levinsons-method', 'mollifier-length-wall', 'weil-positivity', 'pair-correlation'],
    furtherReading: [R('Critical-line proportion', '/critical-line-proportion'), R('RH landscape DAG', '/rh-landscape-dag'), U('Alpöge–Furman (arXiv:2608.13637)', 'https://arxiv.org/abs/2608.13637')],
  },

  // ══════════════════════════════════════════════════════════════════════════
  'levinsons-method': {
    slug: 'levinsons-method',
    term: 'Levinson’s method',
    intro: 'Levinson’s method is the technique behind most proofs that a fixed fraction of the zeta zeros lie on the critical line. It counts zeros on the line indirectly: it shows that a closely related function has few zeros to the left of the line, and the functional equation turns that into many zeros of zeta on the line. In 1974 it gave one third; refinements have reached about 41.7%.',
    levels: [
      {
        level: 'beginner',
        heading: 'Counting on-line zeros by counting off-line zeros of a helper',
        paragraphs: [
          'The total number of zeros up to height T is known accurately (zero-counting-function). If you can show that some helper function has few zeros in a region just left of the critical line (critical-line), and that every "missing" on-line zero of zeta forces a zero of the helper there, then most zeros of zeta must be on the line.',
          'Levinson’s helper is V = ζ + ζ′/L: zeta plus a small multiple of its derivative, with L = log(T/2π). Because of the mirror symmetry of zeta (functional-equation), zeros of zeta on the line correspond to sign changes of a real combination built from V, and the number of zeros of zeta that are not on the line is at most twice the number of zeros of V to the left of the line.',
          'Counting zeros of V in a region uses an averaging trick (Littlewood’s lemma, from complex analysis), which needs the average size of |V| along a vertical line. That average is huge unless V is first multiplied by a damping factor, a mollifier (mollifier: a short sum that approximates 1/ζ). With the mollifier, the average is computable and the count comes out small enough to give at least one third of zeros on the line.',
          'The simplification: the bounds are asymptotic (as T → ∞), and the real argument has several error terms; the outline is accurate.',
        ],
        analogy: 'To count how many people in a building are standing in the central corridor, count instead how many are in the side rooms (fewer, easier), using a rule that every person missing from the corridor must be in a side room. The mollifier is the noise-cancelling headset that makes the side rooms countable.',
        example: 'If an averaging argument shows the helper has at most 1/3 of N(T) zeros in the side region, then at most 2 × 1/3 of zeta zeros are off the line, so at least 1/3 are on it. Levinson’s numbers give exactly 1 − 0.65724 = 0.34276 at shift R = 1.287.',
      },
      {
        level: 'intermediate',
        heading: 'The identity and the inequality',
        paragraphs: [
          'Levinson’s identity: since the Hardy function Z(t) = e^{iθ(t)} ζ(1/2 + it) is real (hardy-z-function), differentiating gives Z(t) = 2 Re[e^{iθ(t)} (ζ + ζ′/(2θ′(t)))(1/2 + it)], with 2θ′(t) ≈ log(t/2π) = L. Replacing 2θ′ by L defines V; zeros of Z on the line become points where e^{iθ}V is purely imaginary.',
          'Littlewood’s lemma (a consequence of the argument principle, argument-principle) bounds the number of zeros of V right of σ_0 = 1/2 − R/L by an integral of log|VM| along Re s = σ_0, where M is a mollifier. Jensen’s inequality for the concave logarithm (the average of log is at most log of the average) then bounds that by the log of the mean square of VM.',
          'The mean square of VM is computed as a main term c(P, Q, R) from twisted second-moment formulas of ζ, giving κ ≥ 1 − (1/R) log c + o(1).',
        ],
        math: [
          { tex: T`Z(t)=2\,\operatorname{Re}\Bigl[e^{i\theta(t)}\Bigl(\zeta+\frac{\zeta'}{2\theta'(t)}\Bigr)(\tfrac12+it)\Bigr]`, note: 'θ(t) the Riemann–Siegel theta function; ζ′ the derivative; an exact identity.' },
          { tex: T`\frac1T\int_T^{2T}\log|VM(\sigma_0+it)|\,dt\ \le\ \frac12\log\Bigl(\frac1T\int_T^{2T}|VM(\sigma_0+it)|^2dt\Bigr)`, note: 'Jensen/AM–GM step: average of a logarithm is at most the logarithm of the average. σ_0 = 1/2 − R/L.' },
          { tex: T`\kappa\ \ge\ 1-\frac1R\log c(P,Q,R)+o(1)`, note: 'κ = proportion of zeros on the line; c the mollified mean-square constant.' },
        ],
        example: 'Levinson: R = 1.287, κ = 0.34276, so log c = 1.287 × 0.65724 = 0.8459 and c = 2.33. Conrey’s longer mollifier (θ = 4/7) lowers the effective constant and gives 0.4088 (repo reproduction 0.408953).',
      },
      {
        level: 'advanced',
        heading: 'Inputs, limits, and the project’s twin-ladder reading',
        paragraphs: [
          'Hard input: an asymptotic for the twisted second moment ∫|ζ(1/2 + it)|² (h/k)^{it} dt summed against mollifier coefficients of length T^θ (Balasubramanian–Conrey–Heath-Brown for θ < 1/2; Conrey’s θ = 4/7 for the specific Levinson structure via Deshouillers–Iwaniec; Bettin–Chandee–Radziwiłł θ < 17/33 for arbitrary coefficients). The mollifier-length wall (mollifier-length-wall) caps κ within this lineage.',
          'Project study (src/data/dag3-levbridge-2026-09-28.js, two internal referee passes, no proportion claim): in twin-ladder terms (twin-ladder: ζ’s Euler product as a cascade of prime sections, χ as the bridge between direct and dual arms), Z² = ζ(s)ζ(1 − s) is the geometric mean of direct and dual arms, and the only non-soft input of Levinson’s method is the length-truncated μ-mollifier with its twisted second moment. Ladder-native Euler-product mollifiers did worse: the exact primorial Euler product has κ → −∞ at each fixed R (conditional on BCHB), and its finite-T proxy changes sign between T = 10^16 and 10^20. Pure phase multipliers e^{iφ(t)} leave the functional unchanged (difference 1.8·10^{−15}).',
          'Verdict recorded there: no proportion statement, no Λ movement; RH open; PT Λ ≤ 0.2 stands; the project’s Λ ≤ 0.1758354 is an unreviewed computer-assisted candidate.',
        ],
        details: [
          'Levinson, Adv. Math. 13 (1974) 383–436; Conrey, J. reine angew. Math. 399 (1989) 1–26; Young, "A short proof of Levinson’s theorem" (2010).',
          'Direct integration at T = 10^4 (repo): pre-AM-GM Littlewood value 0.8134; after AM-GM, Conrey mollifier 0.5007, Euler product 0.3866, no mollifier −0.3945 (R = 1.3). The AM-GM step costs most of the information.',
          'Conrey’s version also shows that the counted zeros are simple: at least 40.88% of zeros are simple and on the line.',
        ],
      },
    ],
    physicsAnalogy: {
      system: 'Locating resonances by measuring a damped, equalised response a small distance off the real frequency axis.',
      mapping: [
        'Measuring along σ_0 = 1/2 − R/L, slightly off the critical line, is like measuring a resonator’s response at slightly complex frequency: peaks are broadened and the signal is averaged.',
        'Littlewood’s lemma ↔ the relation between the integrated log-amplitude response along a line and the number and positions of resonances on one side of it (a Jensen/Poisson-type formula from complex analysis, also used for minimum-phase filters).',
        'The mollifier M ↔ an equaliser that divides out the large background response so the averaged log-amplitude reflects only the resonances.',
        'Jensen’s inequality step ↔ replacing the average of log-power by log of average power, an upper bound that loses information when the response fluctuates.',
      ],
      whereItBreaks: 'The "resonator" has infinitely many resonances and no known physical realisation, and the equaliser can only be built to a limited length (θ < 1/2 or 4/7), unlike an ideal inverse filter. The final count is asymptotic, not an observation of individual resonances.',
    },
    examples: [
      {
        title: 'From helper zeros to a proportion',
        level: 'beginner',
        steps: ['Levinson’s accounting: N(T) − N_0(T) ≤ 2 × (number of zeros of V left of the line) + a smaller error.', 'If V has at most a fraction f of N(T) zeros there, then κ ≥ 1 − 2f.', 'Levinson’s mollified mean-square bound gives 2f ≤ (1/R) log c = 0.65724 at R = 1.287.'],
        result: 'At least 34.3% of zeros on the line (Levinson 1974, stated as ≥ 1/3).',
      },
    ],
    whyItMatters: 'Levinson’s method produced every peer-reviewed critical-line proportion from 1/3 to > 5/12, and its mollifier is the same object that appears in zero-density estimates, the Nyman–Beurling criterion and the project’s barrier mollifiers. The project tested whether twin-ladder (Euler-product) mollifiers could improve it; they did not. No result here moves Λ or proves a proportion.',
    example: 'Repo reproduction: Levinson κ = 0.34276 (R = 1.287); Conrey θ = 4/7 κ = 0.408953.',
    pitfalls: [
      'The method gives a lower bound for a limiting proportion, not a statement about any finite range.',
      'Finite-T "κ_T" values in project modules are main-term proxies, not proportion theorems.',
      'Euler-product mollifiers are not better than length-truncated Möbius mollifiers in this method.',
    ],
    prerequisites: ['hardy-z-function', 'mollifier', 'functional-equation', 'argument-principle'],
    mentions: ['zero-counting-function', 'critical-line', 'functional-equation', 'mollifier', 'hardy-z-function', 'argument-principle', 'mollifier-length-wall', 'twin-ladder'],
    furtherReading: [R('Critical-line proportion', '/critical-line-proportion'), R('Twin ladder', '/twin-ladder')],
  },

  // ══════════════════════════════════════════════════════════════════════════
  'mollifier': {
    slug: 'mollifier',
    term: 'Mollifier',
    intro: 'A mollifier is a short, explicitly written sum that approximates one divided by the zeta function. Multiplying zeta by it cancels most of zeta’s wild fluctuations, so that averages become small and informative. Mollifiers are the working tool behind critical-line proportions, zero-density estimates and, in this project, the barrier computations for the de Bruijn–Newman constant.',
    levels: [
      {
        level: 'beginner',
        heading: 'Cancelling the first few terms',
        paragraphs: [
          'The zeta function is the sum 1 + 1/2^s + 1/3^s + … (riemann-zeta-function), which also equals a product of one factor 1/(1 − p^(−s)) per prime p (the Euler product, euler-product). Inverting that product shows the reciprocal 1/ζ(s) is also a sum, 1 − 1/2^s − 1/3^s − 1/5^s + 1/6^s − …, with coefficients μ(n) given by the Möbius function: μ(n) = 0 if n has a repeated prime factor, otherwise +1 or −1 according to whether n has an even or odd number of prime factors.',
          'A mollifier keeps only the first terms of 1/ζ, up to some length y: M(s) = Σ_{n≤y} μ(n)/n^s, usually with smooth weights. The product ζ·M is then close to 1 in an averaged sense: the early terms cancel exactly and only later ones remain.',
          'Why this helps: ζ can be very large or very small at different heights, so averages of |ζ|² are dominated by rare large values. ζ·M is much flatter, so its average reflects typical behaviour. The longer the mollifier, the better the cancellation, but proofs can only handle mollifiers up to a certain length.',
          'The simplification: near a zero of ζ, 1/ζ is infinite, so no finite sum approximates it there; the approximation is only good on average.',
        ],
        analogy: 'Noise-cancelling headphones play an inverted copy of the incoming noise. The mollifier is an inverted copy of zeta’s first few terms; it cancels them and leaves a quieter signal.',
        example: 'Take M = 1 − 1/2^s − 1/3^s − 1/5^s + 1/6^s (all μ(n) for n ≤ 6; μ(4) = 0). Multiplying by ζ, the coefficient of 1/n^s in ζ·M is the sum of μ(d) over the divisors d ≤ 6 of n. For n = 2, 3, 4, 5, 6 these sums are 1 − 1 = 0, 0, 0, 0, and 1 − 1 − 1 + 1 = 0. The product is 1 + 1/7^s − 1/10^s + 1/11^s + …: everything from 2 to 6 cancels.',
      },
      {
        level: 'intermediate',
        heading: 'Standard form and mean values',
        paragraphs: [
          'The standard mollifier has length y = T^θ (T the height range, θ the length exponent) and a smooth weight P with P(0) = 0, P(1) = 1. The weight tapers the coefficients so that the cut-off does not create oscillations.',
          'Integrals of |ζM|² are computed with mean-value theorems for Dirichlet polynomials (a Dirichlet polynomial is a finite sum Σ a_n n^{−s}) together with twisted second moments of ζ. These are known only for θ below a threshold, which is the mollifier-length wall (mollifier-length-wall): θ < 1/2 in general, θ = 4/7 for Conrey’s structured case, θ < 17/33 for arbitrary coefficients (Bettin–Chandee–Radziwiłł).',
          'Uses: Levinson’s method (levinsons-method) for proportions of zeros on the line; zero-density estimates (zero-density-estimate), where ζM ≈ 1 off zeros forces a polynomial to be large near each zero; the Nyman–Beurling criterion (nyman-beurling-criterion), where the near-optimal coefficients are μ(k)(1 − log k/log N).',
        ],
        math: [
          { tex: T`M(s)=\sum_{n\le y}\frac{\mu(n)}{n^{s}}\,P\!\Bigl(\frac{\log(y/n)}{\log y}\Bigr),\qquad y=T^{\theta}`, note: 'μ the Möbius function; P a polynomial with P(0) = 0, P(1) = 1; θ the length exponent.' },
          { tex: T`\int_0^T\Bigl|\sum_{n\le N}a_n n^{-it}\Bigr|^2dt=\sum_{n\le N}|a_n|^2\bigl(T+O(n)\bigr)`, note: 'Montgomery–Vaughan mean-value theorem; this is why length N ≲ T is natural and why products ζM are limited in length.' },
          { tex: T`\frac1{\zeta(s)}=\sum_{n\ge1}\frac{\mu(n)}{n^s}\quad(\operatorname{Re}s>1)`, note: 'The series converges only for Re s > 1; in the critical strip only truncated, weighted versions are used.' },
        ],
        example: 'In the Nyman–Beurling setting the mollifier coefficients μ(k)(1 − log k/log N) attain, under RH and a moment hypothesis, the optimal rate d_N² ~ (2 + γ − log 4π)/log N = 0.046191/log N asymptotically (Bettin–Conrey–Farmer). At N = 500 the formula gives 0.00743 and the exact optimum (repo) is 0.0074199, but the linear-taper coefficients themselves give 0.0990 there, 13.3 times the optimum: the asymptotic rate is reached only slowly (src/data/rh-route-m-nyman-beurling-vasyunin-reciprocity-2026-09-23.js).',
      },
      {
        level: 'advanced',
        heading: 'Barrier mollifiers and the fixed-height ceiling',
        paragraphs: [
          'In the de Bruijn–Newman barrier method (barrier-method: a computation that rules out zeros of the heat-flowed function H_t, heat-flow-ht, passing through a vertical barrier; it is used to prove upper bounds on the de Bruijn–Newman constant Λ, de-bruijn-newman-constant, the time after which H_t has only real zeros), the effective Dirichlet polynomial B(s) = Σ_{n≤N} b_t(n) n^{−s}, b_t(n) = exp((t/4) log² n), is multiplied by a mollifier to reduce the coefficient mass that must be bounded (barrier-mollifier). Polymath15 used short Euler-product mollifiers.',
          'Project theorem (src/data/barrier-mollifier-length-ceiling-2026-09.js, project-internal): at the verified height γ ≤ 3·10^12 (the module’s doubled coordinate X = 6·10^12, N0 = 690988), the triangle-weight ℓ¹ certificate class satisfies Mass(M) ≥ 1 for every mollifier whenever B has a zero on the Bohr torus (Wiener’s lemma in the algebra of Dirichlet series with weight n^{−σ}). Consequence: the mollifier-length lever is capped at Λ ≈ 0.154–0.156, and no coefficient-magnitude certificate of any kind exists below Λ ≈ 0.1455 at y0. The cap is an invertibility limit of the truncated heat-flow polynomial, not the Levinson θ = 4/7 wall.',
          'Status: the project’s Λ ≤ 0.1758354 is a computer-assisted, unreviewed, unpublished candidate (project-lambda-candidate); Platt–Trudgian Λ ≤ 0.2 is the accepted benchmark. The ceiling result says longer mollifiers at fixed verified height cannot push below about 0.155.',
        ],
        details: [
          'Selberg introduced mollifiers (1942) for the positive-proportion theorem; Levinson and Conrey refined them; Radziwiłł–Soundararajan used Euler-product-type mollifiers for other moment problems.',
          'Repo: exact primorial Euler-product mollifiers do worse than length-truncated μ-mollifiers in Levinson’s method (dag3-levbridge).',
          'Mollifier-length ceiling viz: /viz-imp95770-barrier-mollifier-length-ceiling.',
        ],
      },
    ],
    physicsAnalogy: {
      system: 'An inverse filter (equaliser) with a finite number of taps.',
      mapping: [
        'ζ(s) ↔ a channel that distorts a signal; 1/ζ ↔ the ideal inverse filter that undoes the distortion.',
        'Mollifier M of length y ↔ a finite-tap (FIR) approximation to the inverse filter; ζ·M ≈ 1 ↔ a nearly flat equalised channel.',
        'Zeros of ζ ↔ frequencies the channel blocks completely; no finite equaliser restores them, just as 1/ζ has poles at the zeros.',
        'The length limit θ ↔ the number of taps you can afford; in number theory the cost is the inability to evaluate the mean square for longer sums.',
      ],
      whereItBreaks: 'An engineer can add taps at will; here the limit is what can be proved about mean values, not computing cost. The "channel" ζ is fixed and has infinitely many blocked frequencies whose exact location is the question.',
    },
    examples: [
      {
        title: 'Cancellation in ζ·M',
        level: 'beginner',
        steps: ['M has μ(1..6) = 1, −1, −1, 0, −1, 1.', 'Coefficient at n = 6: divisors 1, 2, 3, 6 → 1 − 1 − 1 + 1 = 0.', 'Coefficient at n = 10: divisors in M are 1, 2, 5 → 1 − 1 − 1 = −1.', 'Coefficient at n = 7 (prime > 6): only divisor 1 → 1.'],
        result: 'ζ·M = 1 + 7^{−s} − 10^{−s} + 11^{−s} + 13^{−s} − 15^{−s} + …: the terms 2 to 6 vanish exactly.',
      },
    ],
    whyItMatters: 'Mollifiers turn averages of ζ into usable estimates; they underlie critical-line proportions, zero-density estimates, the Nyman–Beurling rate and the de Bruijn–Newman barrier checks. In this project the barrier-mollifier ceiling shows that at the current verified height no mollifier can bring a coefficient-magnitude (ℓ¹) barrier certificate of the fixed-y0 finite-lane class below Λ ≈ 0.1455, which is why the project identifies verified height as the binding input.',
    example: 'ζ·(1 − 2^{−s} − 3^{−s} − 5^{−s} + 6^{−s}) = 1 + 7^{−s} − 10^{−s} + …; barrier length lever capped at Λ ≈ 0.154–0.156.',
    pitfalls: [
      'The Dirichlet series for 1/ζ converges only for Re s > 1; mollifiers are truncations used inside the strip and approximate 1/ζ only on average.',
      'Longer is not always provable: mean-value theorems limit the length.',
      'The barrier-mollifier ceiling is a separate limit from the Levinson θ = 4/7 wall.',
    ],
    prerequisites: ['riemann-zeta-function', 'euler-product'],
    mentions: ['riemann-zeta-function', 'euler-product', 'mollifier-length-wall', 'levinsons-method', 'zero-density-estimate', 'nyman-beurling-criterion', 'barrier-method', 'barrier-mollifier', 'project-lambda-candidate', 'de-bruijn-newman-constant', 'heat-flow-ht'],
    furtherReading: [R('Mollified barrier certificate', '/mollified-barrier-certificate'), R('Barrier-mollifier length ceiling', '/viz-imp95770-barrier-mollifier-length-ceiling'), R('Critical-line proportion', '/critical-line-proportion')],
  },

  // ══════════════════════════════════════════════════════════════════════════
  'pair-correlation': {
    slug: 'pair-correlation',
    term: 'Pair correlation of zeros',
    intro: 'Pair correlation describes how the zeros of zeta are spaced relative to each other: how often two zeros are found at a given distance apart. Montgomery showed in 1973 that, assuming RH, nearby zeros repel each other in exactly the way energy levels of large random quantum systems do. This link between primes and random matrices is one of the main pieces of evidence for a spectral explanation of RH.',
    levels: [
      {
        level: 'beginner',
        heading: 'Do zeros cluster or avoid each other?',
        paragraphs: [
          'Under RH (riemann-hypothesis), the nontrivial zeros (nontrivial-zeros) are points 1/2 + iγ on a vertical line, so they can be described by their heights γ: 14.13, 21.02, 25.01, 30.42, … . They get denser higher up: near height t the average gap is about 2π/log(t/2π). To compare spacings at different heights, rescale so that the average gap is 1.',
          'Now ask: given a zero, how likely is it to find another zero at rescaled distance u? If zeros were scattered independently at random (like raindrops), the answer would be the same for every u. Montgomery found instead that the likelihood is 1 − (sin πu/(πu))², which is close to 0 for small u: zeros rarely sit close together. They repel.',
          'Freeman Dyson recognised the same formula from random matrix theory: eigenvalues of large random Hermitian matrices (gue: the Gaussian Unitary Ensemble) have exactly this pair correlation. Odlyzko’s computations of zeros near the 10^20-th confirmed the match.',
          'The simplification: Montgomery proved this only for a limited range of "frequencies" (described below) and assuming RH; the full formula is the pair-correlation conjecture.',
        ],
        analogy: 'Charged beads on a wire repel one another: they rarely bunch up but are not perfectly evenly spaced either. Zeros behave statistically like such beads, while independent random points behave like raindrops on a wire.',
        example: 'The first two zeros are at 14.1347 and 21.0220, a gap of 6.887. The local density near t = 17.6 is log(t/2π)/2π = 0.1637 zeros per unit height, so the rescaled gap is 6.887 × 0.1637 = 1.13. The repulsion formula at u = 0.1 gives 1 − (sin(0.314)/0.314)² = 0.032, about 3% of the independent-points value; at u = 0.5 it gives 0.595.',
      },
      {
        level: 'intermediate',
        heading: 'Montgomery’s function F(α) and the sine-kernel',
        paragraphs: [
          'Montgomery studied F(α), a weighted sum over pairs of zeros up to height T of T^{iα(γ − γ′)}: a Fourier transform of the pair-correlation measure, with α as frequency. Using the explicit formula (explicit-formula: the identity linking sums over zeros to sums over primes), he evaluated F(α) for |α| < 1, assuming RH.',
          'The result, F(α) = |α| + T^{−2|α|} log T (1 + o(1)) + o(1) for |α| < 1, together with the conjecture F(α) = 1 for |α| ≥ 1, is equivalent to the pair-correlation formula 1 − (sin πu/πu)². The theorem alone already implies that, under RH, at least 2/3 of zeros are simple.',
          'The prime side of Montgomery’s computation only reaches |α| < 1 because the primes enter through sums of length T^α that can be evaluated by mean-value theorems only up to α = 1. This is the pair-correlation support barrier (pair-correlation-support-barrier).',
        ],
        math: [
          { tex: T`F(\alpha)=\frac{2\pi}{T\log T}\sum_{0<\gamma,\gamma'\le T}T^{i\alpha(\gamma-\gamma')}\,w(\gamma-\gamma'),\qquad w(u)=\frac{4}{4+u^2}`, note: 'γ, γ′ zero heights (RH assumed), α real frequency, w a weight that damps distant pairs.' },
          { tex: T`F(\alpha)=|\alpha|+T^{-2|\alpha|}\log T\,(1+o(1))+o(1)\quad(|\alpha|<1)`, note: 'Montgomery’s theorem under RH.' },
          { tex: T`R_2(u)=1-\Bigl(\frac{\sin\pi u}{\pi u}\Bigr)^2`, note: 'Conjectured pair-correlation density for rescaled gaps u; identical to the GUE sine-kernel result.' },
        ],
        example: 'R_2 values: u = 0.1 → 0.0325; u = 0.25 → 0.1894; u = 0.5 → 0.5947; u = 1 → 1.0000; u = 1.5 → 0.9550. Independent points would give 1 everywhere.',
      },
      {
        level: 'advanced',
        heading: 'Unconditional uses, the α > 1 wall, and PCC-free routes',
        paragraphs: [
          'The pair-correlation conjecture (PCC) for |α| ≥ 1 is open; Goldston and Montgomery showed it is equivalent to an asymptotic for the variance of primes in short intervals, and Bogomolny and Keating derived it heuristically from the Hardy–Littlewood prime-pair conjectures. Arguments that need F(α) beyond α = 1 stall at the support barrier.',
          'The project requires every surviving route to be PCC-free (pcc-free: not assuming the pair-correlation conjecture). The localized barrier-sum no-go (src/data/imp-95519-localized-barrier-sum-prime-zero-nogo.js) found that at p = 97, 59.26% of the majorant mass sits at α > 1, outside Montgomery’s range; for p ≥ 7 the α > 1 fraction is 47–60%. That lever is therefore PCC-gated on its zero side.',
          'External 2026 result (claimed, Lean-checked, reproved, not peer-reviewed; not this project’s): Alpöge–Furman use the pair-correlation form factor on [−1, 1], with Sylvester inertia on a finite compression of Weil’s Hermitian form (weil-positivity), to obtain ≥ 2/3 of zeros simple and on the line unconditionally (critical-line-proportion).',
        ],
        details: [
          'Montgomery, Proc. Symp. Pure Math. 24 (1973) 181–193; Odlyzko, Math. Comp. 48 (1987) 273–308 and later computations near zero 10^20 and 10^23.',
          'Higher correlations: Rudnick–Sarnak proved n-level correlations agree with GUE for test functions of restricted Fourier support.',
          'Repo pages: /pair-correlation, /gue-comparison, /pcc-route-exhaustion.',
        ],
      },
    ],
    physicsAnalogy: {
      system: 'A one-dimensional Coulomb (log-) gas: charged particles on a line repelling with a logarithmic potential, at inverse temperature β = 2.',
      mapping: [
        'Zero heights ↔ particle positions; rescaled gap u ↔ distance in units of mean spacing.',
        'R_2(u) = 1 − (sin πu/πu)² ↔ the radial distribution function g(r) of a liquid: low at short range (repulsion, eigenvalue-repulsion), approaching 1 at long range.',
        'β = 2 log-gas ↔ eigenvalues of GUE random Hermitian matrices; the R_2(u) ≈ (π²/3)u² behaviour at small u is the quadratic repulsion characteristic of β = 2.',
        'Independent (Poisson) points ↔ an ideal gas with g(r) = 1.',
      ],
      whereItBreaks: 'The zeros are deterministic, not a thermal sample, and the match is statistical and local. At long range the zeros show arithmetic deviations from GUE (Berry’s and Bogomolny–Keating’s corrections from the primes). The gas picture does not explain why the zeros are on the line; it presupposes RH.',
    },
    examples: [
      {
        title: 'Rescaled gap of the first two zeros',
        level: 'beginner',
        steps: ['Gap: 21.0220 − 14.1347 = 6.8873.', 'Midpoint t = 17.58; density log(t/2π)/(2π) = log(2.798)/6.2832 = 0.16374.', 'Rescaled gap: 6.8873 × 0.16374 = 1.128.'],
        result: 'The first gap is 1.13 mean spacings, a typical value under GUE statistics.',
      },
      {
        title: 'Repulsion at small distances',
        level: 'intermediate',
        steps: ['u = 0.1: πu = 0.31416, sin = 0.30902, ratio 0.98363, squared 0.96753.', 'R_2(0.1) = 1 − 0.96753 = 0.0325.', 'Small-u approximation (π²/3)u² = 0.0329.'],
        result: 'Pairs closer than 0.1 mean spacings are about 30 times rarer than for independent points.',
      },
    ],
    whyItMatters: 'Pair correlation links ζ zeros to random-matrix eigenvalues and supports the Hilbert–Pólya spectral picture (hilbert-polya: zeros as eigenvalues of a self-adjoint operator). It also marks a wall: Montgomery’s theorem stops at α = 1, and the project’s route map requires PCC-free arguments because several levers (e.g. the localized barrier sum) need α > 1. RH is open; PCC is open.',
    example: 'R_2(0.1) = 0.0325, R_2(0.5) = 0.5947; first rescaled gap 1.128; 59.26% of the p = 97 majorant mass at α > 1.',
    pitfalls: [
      'Montgomery’s theorem assumes RH and covers only |α| < 1; the full sine-kernel law is a conjecture.',
      'GUE agreement is statistical and local; it is not a proof that a Hilbert–Pólya operator exists.',
      'Pair correlation concerns spacings of zeros, not their distance from the line.',
    ],
    prerequisites: ['nontrivial-zeros', 'gue', 'explicit-formula'],
    mentions: ['riemann-hypothesis', 'gue', 'explicit-formula', 'pair-correlation-support-barrier', 'pcc-free', 'weil-positivity', 'critical-line-proportion', 'eigenvalue-repulsion', 'hilbert-polya', 'nontrivial-zeros'],
    furtherReading: [R('Pair correlation', '/pair-correlation'), R('GUE comparison', '/gue-comparison'), R('PCC route exhaustion', '/pcc-route-exhaustion')],
  },
};

// ══════════════════════════════════════════════════════════════════════════
// Class expositions for the classes that contain area-A concepts
// ══════════════════════════════════════════════════════════════════════════
export const AREA_A_CLASS_EXPOSITIONS = {
  'zeta-and-l-functions': {
    name: 'The zeta function and L-functions',
    intro: 'This class collects the objects the Riemann Hypothesis is about: the zeta function, its symmetric and real-valued versions, the related L-functions, and the hypotheses about where their zeros lie. Everything else in the project is a tool for studying these functions.',
    membersOverview: [
      'Definition and structure: the Riemann zeta function (riemann-zeta-function) is defined by a sum over whole numbers and, equivalently, by the Euler product over primes (euler-product). The Dirichlet eta function (dirichlet-eta-function) gives a convergent formula inside the critical strip. The functional equation (functional-equation) ties s to 1 − s and yields the completed, entire, symmetric xi function (xi-function).',
      'Where the zeros are: the critical strip (critical-strip) contains all nontrivial zeros (nontrivial-zeros); the Riemann Hypothesis (riemann-hypothesis) says they are on the critical line (critical-line). The Lindelöf hypothesis (lindelof-hypothesis) is a weaker growth statement implied by RH.',
      'Computing on the line: the Riemann–Siegel theta function (riemann-siegel-theta) is the phase that makes the Hardy function Z(t) real (hardy-z-function); the Riemann–Siegel formula (riemann-siegel-formula) evaluates it fast, and Gram points (gram-points) organise the search for sign changes.',
      'Generalisations and a warning: Dirichlet L-functions (dirichlet-l-function) carry the same structure with a character, and GRH (grh) is RH for all of them. The Davenport–Heilbronn function (davenport-heilbronn-function) has the symmetry but no Euler product, and zeros off the line: it shows the Euler product is essential.',
    ],
    physicsAnalogy: {
      system: 'A lossless scattering system: waves passing through a cascade of filters (one per prime) and reflected by a mirror (the functional equation).',
      mapping: [
        'Euler product ↔ a cascade of independent stages, one per prime; the zeta function ↔ the overall transfer function.',
        'Functional equation ↔ a mirror at Re s = 1/2 with a known, lossless correction factor (|χ| = 1 on the line).',
        'Nontrivial zeros ↔ resonances; RH ↔ every resonance sits on the mirror axis.',
        'Davenport–Heilbronn ↔ a system with the same mirror but stages connected in parallel instead of in cascade, which allows resonances off the axis.',
      ],
      whereItBreaks: 'The Euler product converges only for Re s > 1, so the cascade picture is formal inside the strip. No physical scattering system with these resonances is known. This is the project’s twin-ladder model, which is a heuristic language, not a proof device.',
    },
    readingOrder: ['riemann-zeta-function', 'euler-product', 'critical-strip', 'functional-equation', 'critical-line', 'nontrivial-zeros', 'riemann-hypothesis', 'xi-function', 'dirichlet-eta-function', 'riemann-siegel-theta', 'hardy-z-function', 'riemann-siegel-formula', 'gram-points', 'dirichlet-l-function', 'grh', 'lindelof-hypothesis', 'davenport-heilbronn-function'],
  },

  'primes-and-explicit-formulas': {
    name: 'Primes and explicit formulas',
    intro: 'This class is about counting primes and about the exact formulas that express prime counts through the zeros of zeta. It is the arithmetic side of the Riemann Hypothesis: RH is equivalent to the primes being as regularly spread as possible.',
    membersOverview: [
      'Counting: primes (prime-number) are counted by π(x); the prime number theorem (prime-number-theorem) says π(x) ≈ x/log x. The weighted count ψ(x) (chebyshev-psi), built from the von Mangoldt weight (von-mangoldt-function), is the natural object because −ζ′/ζ is its generating series.',
      'Exact formulas: the explicit formula (explicit-formula) writes ψ(x) as x minus one wave per zero; the Weil explicit formula (weil-explicit-formula) is the same identity for general test functions and is the starting point of Weil positivity.',
      'Explicit constants: Mertens’ theorems (mertens-theorems) and the Rosser–Schoenfeld bounds (rosser-schoenfeld-bounds) give numerical inequalities used wherever constants must be numbers; the primorial (primorial) is the natural scale of an Euler product truncated at a prime P.',
    ],
    physicsAnalogy: {
      system: 'A trace formula of quantum chaos: a spectrum (energy levels) on one side, periodic orbits on the other.',
      mapping: [
        'Prime powers p^k ↔ periodic orbits of length k log p.',
        'Zeros ↔ energy levels; the explicit formula ↔ the trace formula equating the two descriptions.',
        'Smooth term x (or the gamma-factor integral) ↔ the smooth Weyl term of the level count.',
      ],
      whereItBreaks: 'The identity is exact for ζ but no underlying dynamical system is known, and the prime sum carries the opposite sign to Gutzwiller’s orbit sum.',
    },
    readingOrder: ['prime-number', 'prime-number-theorem', 'von-mangoldt-function', 'chebyshev-psi', 'explicit-formula', 'weil-explicit-formula', 'mertens-theorems', 'rosser-schoenfeld-bounds', 'primorial'],
  },

  'equivalent-forms-of-rh': {
    name: 'Equivalent forms of RH',
    intro: 'An RH-equivalent statement is true exactly when the Riemann Hypothesis is true. This class collects the main ones: positivity criteria, approximation criteria, divisor-sum inequalities, spectral and heat-flow formulations, and the project’s own twin-ladder versions. Each moves the problem into a different language; none is known to be easier.',
    membersOverview: [
      'What equivalence means: rh-equivalent-statement explains that reducing a goal to an RH-equivalent moves the problem rather than shortening it; the Riemann Hypothesis itself (riemann-hypothesis) is the anchor.',
      'Positivity: Weil positivity (weil-positivity) is the central one; Li’s criterion (li-criterion) is a special case on specific test functions; de Branges spaces (de-branges-spaces) express RH as positivity of a kernel.',
      'Approximation and arithmetic: the Nyman–Beurling criterion (nyman-beurling-criterion) asks whether sawtooth functions approximate a constant; Robin’s inequality (robin-inequality) and Lagarias’ criterion (lagarias-criterion) are inequalities for the divisor sum σ(n).',
      'Zeros as a geometric or dynamic object: Pólya–Jensen hyperbolicity (polya-jensen-hyperbolicity) asks for real-rooted polynomials; vortex exclusion (vortex-exclusion) reads zeros as phase vortices; the de Bruijn–Newman constant (de-bruijn-newman-constant) gives RH ⇔ Λ = 0 for the heat-flowed xi function; Hilbert–Pólya (hilbert-polya) is the spectral program.',
      'Project formulations: the T3 strip (t3-strip), the shift-bridge threshold (shift-bridge-threshold) and the four closure routes of the twin-ladder paper (closure-routes) are RH-equivalent restatements in the twin-ladder model.',
    ],
    physicsAnalogy: {
      system: 'One stability question for a physical system asked in several measurement languages: energy, spectrum, time evolution, impedance.',
      mapping: [
        'Weil and Li positivity ↔ positive energy for every trial deformation.',
        'Hilbert–Pólya ↔ real eigenfrequencies of a self-adjoint operator.',
        'de Bruijn–Newman Λ = 0 ↔ the critical time at which a heat flow makes all modes real.',
        'de Branges / closure routes ↔ passivity of an impedance (a positive-real response).',
      ],
      whereItBreaks: 'For a physical system these equivalences are theorems about one known operator; here the operator is unknown, and the equivalences are proved through ζ itself. Equivalent statements share the same difficulty.',
    },
    readingOrder: ['riemann-hypothesis', 'rh-equivalent-statement', 'weil-positivity', 'li-criterion', 'nyman-beurling-criterion', 'robin-inequality', 'lagarias-criterion', 'hilbert-polya', 'de-bruijn-newman-constant', 'polya-jensen-hyperbolicity', 'de-branges-spaces', 'vortex-exclusion', 't3-strip', 'shift-bridge-threshold', 'closure-routes'],
  },

  'positivity-criteria': {
    name: 'Positivity criteria',
    intro: 'Many approaches to RH reduce it to showing that some quadratic form, an "energy", is never negative. This class collects those forms, the techniques for certifying positivity in limited ranges, and the project’s results and no-gos about how far such certificates can reach.',
    membersOverview: [
      'The form: the Weil quadratic form (weil-quadratic-form) is the explicit formula applied to autocorrelations; Weil positivity (weil-positivity) is RH-equivalent. Li’s criterion (li-criterion) evaluates the same form on specific test functions. Pole-free test functions (pole-free-test-function) remove the pole terms; the resulting form is a Toeplitz form (toeplitz-matrix) with an explicit symbol.',
      'Certificates: the Toeplitz–Krein certificate (toeplitz-krein-certificate) and the ARB-LEGE certificate (arb-lege-certificate) together give interval-certified pole-free one-prime positivity for supports 2a ≤ ln 3 (Route I, route-i-weil-ladder; computer-assisted, internally refereed, not externally reviewed). Gaussian subordination (gaussian-subordination) and Sonine spaces (sonine-space) are tools for building positive kernels and localising the form.',
      'Other positivity languages: de Branges spaces (de-branges-spaces) and reflection positivity (reflection-positivity) from quantum field theory; the project’s Route A found the finite reflection Gram indefinite and the infinite version equivalent to Weil positivity.',
      'Limits: Euler-blindness (euler-blindness) shows small-support positivity is shared by an RH-false function at conductor 5; RES-T (theorem-res-t) shows Weil positivity carries information beyond the verified height only for supports above T_X = 3.88.',
    ],
    physicsAnalogy: {
      system: 'Proving a mechanical structure is stable by showing its potential energy is positive for every allowed deformation.',
      mapping: [
        'Test function ↔ deformation; quadratic form ↔ potential energy; positivity ↔ stability.',
        'Support width ↔ size of the region the deformation may occupy; larger regions feel more (prime) couplings.',
        'A certificate ↔ an explicit decomposition of the energy as a sum of squares plus terms that vanish on allowed deformations (the Krein measure ν).',
      ],
      whereItBreaks: 'A physical structure has a fixed size; RH needs positivity at every size at once, and the couplings (primes) are fixed by arithmetic. Certificates at small sizes do not extend automatically.',
    },
    readingOrder: ['weil-quadratic-form', 'weil-positivity', 'li-criterion', 'pole-free-test-function', 'toeplitz-matrix', 'route-i-weil-ladder', 'toeplitz-krein-certificate', 'arb-lege-certificate', 'sonine-space', 'gaussian-subordination', 'de-branges-spaces', 'reflection-positivity', 'euler-blindness', 'theorem-res-t'],
  },

  'zero-counting-and-verification': {
    name: 'Zero counting and verification',
    intro: 'This class covers how zeros are counted, found and certified, and what is proven about where they can and cannot be. It joins the computational side (verifying RH up to a height) with the classical analytic side (zero-free regions, density estimates, proportions on the line, pair correlation).',
    membersOverview: [
      'Counting and finding: the zero-counting function N(T) (zero-counting-function) comes from the argument principle (argument-principle). Zeros on the line are found as sign changes of the Hardy function (hardy-z-function), evaluated by the Riemann–Siegel formula (riemann-siegel-formula) and organised by Gram points (gram-points); Turing’s method (turing-method) proves none were missed.',
      'Certified heights: Platt’s interval method (platt-zero-isolation) underlies the Platt–Trudgian verification to γ ≤ 3.0001753·10^12 (platt-trudgian-verified-height). How much higher verification would move the de Bruijn–Newman bound is the verified-height lever (verified-height-lever); local RH windows (local-rh-window) check finite intervals above it. Lehmer pairs (lehmer-pair) are close zero pairs that give lower bounds on Λ.',
      'Classical theorems about all heights: zero-free regions (zero-free-region) exclude zeros near Re s = 1; zero-density estimates (zero-density-estimate) bound how many can be off the line; critical-line proportion results (critical-line-proportion), proved with Levinson’s method (levinsons-method) and mollifiers (mollifier), bound the fraction on the line from below; pair correlation (pair-correlation) describes spacings.',
    ],
    physicsAnalogy: {
      system: 'Surveying the modes of a large resonator: counting modes by a volume law, detecting each one, and proving statistical facts about the rest.',
      mapping: [
        'N(T) ↔ Weyl’s law for the number of modes below a frequency.',
        'Sign changes of Z(t) and Turing’s method ↔ detecting each mode and checking the count matches the law.',
        'Verified height ↔ the frequency up to which every mode has been individually measured.',
        'Zero-free regions, density and proportion results ↔ guarantees about modes that have not been measured individually.',
      ],
      whereItBreaks: 'The resonator is not physical, there are infinitely many modes, and the classical theorems are asymptotic. Measuring more modes never proves the statement for all of them.',
    },
    readingOrder: ['zero-counting-function', 'argument-principle', 'hardy-z-function', 'riemann-siegel-formula', 'gram-points', 'turing-method', 'platt-zero-isolation', 'platt-trudgian-verified-height', 'verified-height-lever', 'local-rh-window', 'lehmer-pair', 'zero-free-region', 'zero-density-estimate', 'mollifier', 'levinsons-method', 'critical-line-proportion', 'pair-correlation'],
  },

  'random-matrices-and-quantum-chaos': {
    name: 'Random matrices and quantum chaos',
    intro: 'The zeros of zeta are statistically indistinguishable, at short range, from eigenvalues of large random Hermitian matrices, and the explicit formula has the shape of a quantum trace formula. This class collects the random-matrix ensembles, the quantum-chaos tools, and the spectral programs (Hilbert–Pólya, Berry–Keating, Connes) built on these observations.',
    membersOverview: [
      'Statistics: the Gaussian Unitary Ensemble (gue) and the Circular Unitary Ensemble (cue) model zero spacings and zeta moments; eigenvalue repulsion (eigenvalue-repulsion), the Wigner surmise (wigner-surmise) and Montgomery’s pair correlation (pair-correlation) are the quantitative statements.',
      'Spectral programs: Hilbert–Pólya (hilbert-polya) asks for a self-adjoint operator with the zeros as spectrum; Berry–Keating (berry-keating) proposes a quantised xp; Connes’ approach (connes-spectral-approach) uses the adele class space (adele-class-space) and reduces RH to Weil positivity.',
      'Semiclassical tools: quantum chaos (quantum-chaos), path integrals (path-integral), Bohr–Sommerfeld quantisation (bohr-sommerfeld), spectral determinants (spectral-determinant) and scattering resonances (scattering-resonance) supply the dictionary; the Selberg trace formula (selberg-trace-formula) is the proven analogue where the spectral picture holds exactly.',
    ],
    physicsAnalogy: {
      system: 'A chaotic quantum billiard without time-reversal symmetry.',
      mapping: [
        'Energy levels ↔ zero heights; level repulsion ↔ GUE pair correlation of zeros.',
        'Periodic orbits ↔ prime powers; Gutzwiller trace formula ↔ explicit formula.',
        'Weyl law ↔ the smooth zero count N(T).',
      ],
      whereItBreaks: 'No billiard or Hamiltonian with the zeta zeros as levels is known; long-range zero statistics carry arithmetic corrections; the prime-orbit sum has the opposite sign to Gutzwiller’s formula.',
    },
    readingOrder: ['gue', 'eigenvalue-repulsion', 'wigner-surmise', 'pair-correlation', 'cue', 'hilbert-polya', 'berry-keating', 'quantum-chaos', 'bohr-sommerfeld', 'path-integral', 'spectral-determinant', 'scattering-resonance', 'selberg-trace-formula', 'connes-spectral-approach', 'adele-class-space'],
  },
};

export const expositions = AREA_A_EXPOSITIONS;
export const classExpositions = AREA_A_CLASS_EXPOSITIONS;

// ══════════════════════════════════════════════════════════════════════════
// Structural checks (not self-executing; run from node or the assertion runner).
// Slug resolution against concepts-registry.js is checked externally to keep this module import-free.
// ══════════════════════════════════════════════════════════════════════════
const LEVELS = ['beginner', 'intermediate', 'advanced'];
const words = (e) => e.levels.flatMap((l) => [l.heading, ...l.paragraphs, l.analogy || '', l.example || '', ...(l.details || []), ...(l.math || []).map((m) => m.note)]).join(' ').split(/\s+/).filter(Boolean).length;

export const AREA_A_SLUGS = Object.freeze(Object.keys(AREA_A_EXPOSITIONS));

export const AREA_A_ASSERTIONS = Object.freeze([
  { name: 'every entry has the three levels in order', holds: () => Object.values(AREA_A_EXPOSITIONS).every((e) => e.levels.map((l) => l.level).join() === LEVELS.join()) },
  { name: 'every entry has intro, physics analogy with mapping and whereItBreaks, and at least one worked example',
    holds: () => Object.values(AREA_A_EXPOSITIONS).every((e) => e.intro && e.physicsAnalogy && e.physicsAnalogy.system && e.physicsAnalogy.mapping.length >= 3 && e.physicsAnalogy.whereItBreaks && e.examples.length >= 1 && e.examples.every((x) => x.steps.length && x.result)) },
  { name: 'every entry has whyItMatters, example, prerequisites, mentions, furtherReading',
    holds: () => Object.values(AREA_A_EXPOSITIONS).every((e) => e.whyItMatters && e.example && Array.isArray(e.prerequisites) && e.mentions.length > 0 && e.furtherReading.length > 0) },
  { name: 'key equals slug field', holds: () => Object.entries(AREA_A_EXPOSITIONS).every(([k, e]) => k === e.slug) },
  { name: 'no self-mention or self-prerequisite', holds: () => Object.values(AREA_A_EXPOSITIONS).every((e) => !e.mentions.includes(e.slug) && !e.prerequisites.includes(e.slug)) },
  { name: 'prerequisites are mentioned or linked', holds: () => Object.values(AREA_A_EXPOSITIONS).every((e) => e.prerequisites.every((p) => typeof p === 'string' && p.length > 0)) },
  { name: 'furtherReading items have a label and exactly one of route/url', holds: () => Object.values(AREA_A_EXPOSITIONS).every((e) => e.furtherReading.every((r) => r.label && (('route' in r) !== ('url' in r)))) },
  { name: 'level word counts are within 500–1400', holds: () => Object.values(AREA_A_EXPOSITIONS).every((e) => { const w = words(e); return w >= 500 && w <= 1400; }) },
  { name: 'math items carry tex and a note', holds: () => Object.values(AREA_A_EXPOSITIONS).every((e) => e.levels.every((l) => (l.math || []).every((m) => typeof m.tex === 'string' && m.tex.length > 0 && m.note))) },
  { name: 'status language: no unqualified claim that RH is proved', holds: () => !/RH (is|has been) (proved|proven)/i.test(JSON.stringify(AREA_A_EXPOSITIONS)) },
  { name: 'class expositions have intro, overview, analogy and a reading order', holds: () => Object.values(AREA_A_CLASS_EXPOSITIONS).every((k) => k.intro && k.membersOverview.length && k.physicsAnalogy.mapping.length && k.readingOrder.length) },
]);

/** Word count across the three levels of one entry (for UI reading-time estimates). */
export function levelWordCount(slug) {
  const e = AREA_A_EXPOSITIONS[slug];
  return e ? words(e) : 0;
}

export default { expositions: AREA_A_EXPOSITIONS, classExpositions: AREA_A_CLASS_EXPOSITIONS };
