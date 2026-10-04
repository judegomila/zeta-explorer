/**
 * @fileoverview concept-expositions/area-b — layered expositions (beginner → intermediate → advanced) for the
 * de Bruijn–Newman / Λ-bound machinery: Λ, the heat flow H_t, zero dynamics, the Θ-trap, the Polymath15 barrier,
 * Raymond's decreasing barrier, source floors (Kronecker, structured), prefixes and cells, the weak outer lemma
 * (WOL-C), the two-band Lemma B, local RH windows, the Platt–Trudgian verified height, the project's 0.1758354
 * candidate and Arb interval certificates. Plus class expositions for the classes these concepts belong to.
 *
 * Shape of each entry (keyed by registry slug, see src/data/concepts-registry.js):
 *   { intro, levels: [{ level, heading, paragraphs[], analogy?, math?[], details?[], example? }],
 *     physicsAnalogy: { system, mapping[], whereItBreaks }, examples: [{ level, title, text }],
 *     whyItMatters, example: { title, text, source? }, pitfalls[], prerequisites[], mentions[],
 *     furtherReading: [{ label, route | url }], sources: [{ label, path }] }
 * math entries are KaTeX TeX strings (String.raw). mentions = every registry slug the text explains inline.
 *
 * Status language: Platt–Trudgian Λ ≤ 0.2 (2021) is the accepted benchmark. The project's Λ ≤ 0.1758354 is a
 * computer-assisted candidate, unreviewed and unpublished. Raymond's Λ ≤ 0.149396 is an unrefereed preprint.
 * Every project value below 0.2 from the decreasing-barrier work (route P, Lemma B bands) is conditional.
 * RH is open. Numbers are copied from the cited repo modules; nothing here is a new claim.
 *
 * Import-free: no zeros bundle, no glossary import. Not wired into a page yet.
 */

const tex = String.raw;

export const expositions = {
  // ─────────────────────────────────────────────────────────────────────────────────────────────
  'de-bruijn-newman-constant': {
    intro: `The de Bruijn–Newman constant, written Λ (capital lambda), is one number that records how far the Riemann Hypothesis is from being true or false. It comes from deforming the function whose zeros RH is about, step by step, and noting the first moment at which all of its zeros lie on one line. RH is true exactly when Λ is 0; today it is known that Λ lies between 0 and 0.2.`,
    levels: [
      {
        level: 'beginner',
        heading: 'A dial that lines up the zeros',
        paragraphs: [
          `The Riemann zeta function is a function of a complex number s. Apart from some easy zeros at −2, −4, −6, …, it has infinitely many "nontrivial zeros": points where it equals zero, all inside a vertical strip. The Riemann Hypothesis (RH) says every one of these lies on a single vertical line, the critical line Re(s) = 1/2. This has been checked for more than ten trillion zeros but is not proved.`,
          `Mathematicians rescale zeta into a cleaner function, usually called Ξ (capital xi), whose zeros are the nontrivial zeros of zeta rotated so that the critical line becomes the horizontal real axis. RH then says: every zero of Ξ is a real number.`,
          `Now add a dial labelled t. At t = 0 you have Ξ itself. Turning the dial to a positive t applies a smoothing operation called the heat flow, which produces a new function H_t. A basic fact, proved by de Bruijn in 1950, is that once all zeros of H_t are real at some setting, they stay real at every larger setting. So there is a threshold: Λ is the smallest dial setting from which on every zero is real.`,
          `If Λ ≤ 0, the zeros are already real at t = 0, which is RH. If Λ > 0, some zero of Ξ is off the line and RH is false. In 2018 Rodgers and Tao proved Λ ≥ 0, so RH is now equivalent to the single statement Λ = 0. The best accepted upper bound is Λ ≤ 0.2 (Platt and Trudgian, 2021). Newman, who conjectured Λ ≥ 0 in 1976, summarised it as: if RH is true, it is only barely true.`,
          `What this picture leaves out: the deformed functions H_t for t ≠ 0 are not zeta functions of anything; they are a device. Also, the dial does not move each zero monotonically toward the axis. The precise statement is about the whole set of zeros (the largest distance from the axis cannot grow), not about each zero separately.`,
        ],
        analogy: `Think of a sheet of ice forming on a pond as the temperature drops. Λ is like the temperature at which the last patch of open water freezes. RH says the pond is already fully frozen at the temperature we live at (t = 0); Rodgers–Tao says it is certainly not frozen any earlier, so we would be sitting exactly at the freezing point.`,
        example: `Toy version with a quadratic: take p(z) = z² + 1, whose zeros ±i are off the real axis. The heat flow used here changes a polynomial by p_t = p − t·p″ (exact for degree 2), so p_t(z) = z² + 1 − 2t. Its zeros are ±√(2t − 1). At t = 0.25 they are ±0.71i (still off the axis); at t = 0.5 they meet at 0; for t = 0.625 they are ±0.5, both real. For this toy, "Λ" equals 0.5.`,
      },
      {
        level: 'intermediate',
        heading: 'Definition through H_t',
        paragraphs: [
          `Write z = x + iy. The Polymath15 normalisation defines H_t(z) = ∫₀^∞ e^{tu²} Φ(u) cos(zu) du with a fixed, rapidly decaying, positive kernel Φ (a theta-function series). At t = 0 this is H_0(z) = ξ((1 + iz)/2)/8, where ξ is Riemann's completed zeta function (zeta multiplied by gamma and polynomial factors so that it has no poles and is symmetric). A zero ρ = β + iγ of zeta corresponds to the zero z = 2γ + i(1 − 2β) of H_0. So "β = 1/2" (on the critical line) is the same as "z real".`,
          `The family satisfies the backward heat equation ∂_t H_t = −∂²_z H_t; see the separate page on the heat flow. De Bruijn proved: if H_{t₀} has only real zeros, then so does H_t for every t > t₀. Hence the set of t with all zeros real is a half-line [Λ, ∞), and this defines Λ.`,
          `De Bruijn also proved a quantitative "strip theorem": if all zeros of H_{t₀} satisfy |y| ≤ y₀, then all zeros of H_t satisfy |y|² ≤ max(y₀² − 2(t − t₀), 0). Taking t₀ = 0 and y₀ = 1 (zeta has no zeros on Re s = 0 or 1, so |y| < 1 at t = 0) gives Λ ≤ 1/2. Every upper bound since then shrinks the starting strip at some positive time; the barrier method is the standard way.`,
        ],
        math: [
          tex`H_t(z)=\int_0^\infty e^{tu^2}\,\Phi(u)\cos(zu)\,du,\qquad \Phi(u)=\sum_{n\ge1}\left(2\pi^2n^4e^{9u}-3\pi n^2e^{5u}\right)e^{-\pi n^2e^{4u}}`,
          tex`H_0(z)=\tfrac18\,\xi\!\left(\tfrac{1+iz}{2}\right),\qquad \rho=\beta+i\gamma\;\longleftrightarrow\; z=2\gamma+i(1-2\beta)`,
          tex`\Lambda=\inf\{t\in\mathbb R:\ \text{all zeros of }H_t\text{ are real}\},\qquad \mathrm{RH}\iff\Lambda\le 0`,
        ],
        example: `Strip theorem in numbers: if at t₀ = 0.2 every zero has |y| ≤ y₀ = 0.2, then |y|² ≤ 0.04 − 2(t − 0.2), which reaches 0 at t = 0.2 + 0.04/2 = 0.22. This is the arithmetic behind the Polymath15 bound Λ ≤ 0.22.`,
      },
      {
        level: 'advanced',
        heading: 'Known results and what bounds them',
        paragraphs: [
          `Lower side. Newman (1976) proved Λ > −∞ and conjectured Λ ≥ 0. Numerical lower bounds came from close pairs of zeros (Lehmer pairs), ending at Λ > −1.14541·10⁻¹¹ (Saouter–Gourdon–Demichel 2011). Rodgers and Tao (2018, Forum Math. Pi 2020) proved Λ ≥ 0. Their argument: if Λ were negative, the forward flow from time Λ to time 0 would make the zeros of H_0 locally close to an arithmetic progression, which contradicts known pair-correlation-type statistics of the zeta zeros.`,
          `Upper side. De Bruijn: Λ ≤ 1/2. Ki–Kim–Lee (2009): Λ < 1/2. Polymath15 (Res. Math. Sci. 2019): Λ ≤ 0.22, using effective approximations of H_t, a barrier computation and RH verified to about 3·10¹⁰ in the needed range. Platt–Trudgian (2021): Λ ≤ 0.2 with RH verified to T = 3.0001753·10¹². This is the accepted peer-reviewed benchmark.`,
          `Barrier upper bounds are limited by verified height. The Polymath15 §10 heuristic and the project's measurements on Raymond's chain both give Λ·ln T roughly constant (4.29–4.33 from X to 10X on the regenerated chain), so doubling the verified height lowers the bound by only about 0.003. No finite computation reaches Λ = 0, and the project's flow-blindness note records why: hypotheses that are stable under the backward flow cannot separate RH from its failure.`,
        ],
        math: [
          tex`0\le\Lambda\le 0.2\quad(\text{Rodgers–Tao 2020; Platt–Trudgian 2021})`,
          tex`\mathrm{RH}\iff\Lambda=0\quad(\text{given }\Lambda\ge0)`,
          tex`\Lambda_{\text{barrier}}(T)\approx \frac{c}{\ln T},\qquad c\approx4.29\ \text{(measured on the regenerated Raymond chain)}`,
        ],
        details: [
          `de Bruijn, Duke Math. J. 17 (1950), Thm 13 (strip contraction); Newman, Proc. AMS 61 (1976); Rodgers–Tao, arXiv:1801.05914; Polymath15, arXiv:1904.12438; Platt–Trudgian, Bull. LMS 53 (2021) 792–797.`,
          `Project values below 0.2: Λ ≤ 0.1758354 (computer-assisted candidate, unreviewed, unpublished); Raymond's preprint Λ ≤ 0.149396 (unrefereed); route-P 0.14666 certified-conditional and 0.14480 conditional on WOL-C. None displaces 0.2.`,
        ],
      },
    ],
    physicsAnalogy: {
      system: 'Lee–Yang zeros of a ferromagnet near its critical point',
      mapping: [
        'The dial t ↔ a control parameter such as coupling strength or temperature.',
        'Zeros of H_t ↔ zeros of a partition function in the complex magnetic field (Lee–Yang zeros); for ferromagnetic Ising models these are proved to lie on a circle.',
        'Λ ↔ the critical value of the control parameter beyond which the zeros are confined to the circle (here: the real axis).',
        'Λ ≥ 0 ("RH is at best barely true") ↔ a system sitting exactly at its critical point. Newman made this comparison explicitly.',
      ],
      whereItBreaks: 'H_t is not known to be the partition function of any physical system, there is no thermodynamic limit or free energy behind it, and t is not a temperature. Lee–Yang confinement is a theorem for a class of models; for Ξ the confinement at t = 0 is exactly the open problem.',
    },
    examples: [
      { level: 'beginner', title: 'Quadratic toy', text: `p_t(z) = z² + 1 − 2t: zeros ±√(2t − 1) are non-real for t < 0.5 and real for t ≥ 0.5, so the toy constant is 0.5. With p(z) = z² − 1 instead (zeros ±1, already real), p_t = z² − 1 − 2t has real zeros for t ≥ −0.5: the toy constant is −0.5, negative, because the zeros start on the axis with room to spare.` },
      { level: 'intermediate', title: 'From a strip to a bound', text: `(t₀, y₀) = (0.2, 0.2) gives 0.2 + 0.2²/2 = 0.22 (Polymath15). The project candidate uses t₀ = 0.1583, y₀² = 0.0350708, giving 0.1583 + 0.0175354 = 0.1758354.` },
      { level: 'advanced', title: 'Height lever', text: `With c = 4.292 and T = 3.0001753·10¹² (ln T = 28.73), c/ln T = 0.1494, matching Raymond's 0.149395 at PT height. Raymond's chain re-run at twice the height gives 0.146118, a gain of 0.0033, close to the c/ln T prediction 0.0035.` },
    ],
    whyItMatters: `Λ turns RH into a question about one real number, which makes partial progress measurable: each upper bound on Λ is a rigorous statement of how far zeros can be from the line after a small deformation. The upper-bound side is where this project works. Platt–Trudgian Λ ≤ 0.2 is the accepted benchmark. The project's Λ ≤ 0.1758354 is a computer-assisted candidate (four gates certified in Arb), unreviewed and unpublished, and the decreasing-barrier values near 0.145–0.147 are conditional. RH is open, and no upper bound on Λ obtained this way can reach 0.`,
    example: { title: 'The accepted ladder', text: `1/2 (de Bruijn 1950) → < 1/2 (Ki–Kim–Lee 2009) → 0.22 (Polymath15 2019) → 0.2 (Platt–Trudgian 2021). Lower side: Λ ≥ 0 (Rodgers–Tao 2018/2020).`, source: 'src/data/rh-landscape-dag.js' },
    pitfalls: [
      'Λ ≤ 0.2 does not mean that any zeros are off the line, or that a fraction of them is; it means that after deforming by t = 0.2 none can be.',
      'Upper bounds on Λ obtained from finite computations cannot prove RH; they approach 0 only logarithmically in the verified height.',
      'Project values below 0.2 are candidates or conditional results, not accepted bounds.',
      'Normalisations differ: some papers scale z or t differently. The values quoted here use the Polymath15 normalisation H_0(z) = ξ((1 + iz)/2)/8.',
    ],
    prerequisites: ['riemann-hypothesis', 'xi-function', 'heat-flow-ht'],
    mentions: ['riemann-zeta-function', 'nontrivial-zeros', 'riemann-hypothesis', 'critical-line', 'xi-function', 'heat-flow-ht', 'newman-conjecture', 'lambda-upper-bound-ladder', 'barrier-method', 'lehmer-pair', 'platt-trudgian-verified-height', 'lambda-log-height-law', 'flow-blindness', 'project-lambda-candidate', 'decreasing-zero-height-barrier', 'route-p', 'lee-yang', 'pair-correlation'],
    furtherReading: [
      { label: 'Λ bounds', route: '/lambda-bounds' },
      { label: 'Λ timeline', route: '/lambda-timeline' },
      { label: 'Flow-blindness no-go', route: '/flow-blindness-no-go' },
      { label: 'Rodgers–Tao, The de Bruijn–Newman constant is non-negative', url: 'https://arxiv.org/abs/1801.05914' },
      { label: 'Polymath15, Effective approximation of heat flow evolution of the Riemann ξ function', url: 'https://arxiv.org/abs/1904.12438' },
    ],
    sources: [
      { label: 'RH landscape DAG', path: 'src/data/rh-landscape-dag.js' },
      { label: 'Raymond height contract (Λ·ln T)', path: 'src/data/s145-raymond-height-contract-2026-09-30.js' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────────────────────
  'heat-flow-ht': {
    intro: `The heat flow H_t is a one-parameter family of functions obtained by smoothing the Riemann Ξ function with the heat equation. At t = 0 it is Ξ itself; as t grows its zeros move. It is the object whose zeros define the de Bruijn–Newman constant Λ.`,
    levels: [
      {
        level: 'beginner',
        heading: 'Smoothing a function and watching its zeros',
        paragraphs: [
          `The heat equation describes how temperature spreads along a metal rod: hot spots cool, cold spots warm, and the profile gets smoother with time. The same rule can be applied to any function, not only temperatures. Applying it to a function is called running a heat flow on it.`,
          `Here the function is Ξ, a rescaled version of the Riemann zeta function whose zeros are the nontrivial zeros of zeta, turned so that the Riemann Hypothesis (RH) reads "every zero of Ξ is a real number". Running the heat flow for a time t gives a new function, written H_t. The zeros of H_t move as t changes.`,
          `Two facts make this useful. First, running the flow forward (t increasing) never turns a real zero into a non-real one, and it pulls non-real zeros toward the real axis. Second, the size of the pull can be computed. So the question "are all zeros of Ξ real?" becomes "how long must the flow run before all zeros are real?". That time is the de Bruijn–Newman constant Λ.`,
          `What this leaves out: for functions of a complex variable the heat flow runs "forward" in one direction of the plane and "backward" in the other, and the parameter t is a bookkeeping variable, not physical time. The smoothing description is exact for the vertical direction only (see the intermediate level).`,
        ],
        analogy: `A row of sandcastles at the waterline: each wave smooths the sand. Bumps that stick up (zeros off the axis) get flattened toward the waterline, and once something is flat at the waterline the next wave does not raise it again.`,
        example: `Polynomial version: for a quadratic p, the flow is p_t = p − t·p″. With p(z) = z² + 1 (zeros ±i): p_t = z² + 1 − 2t. At t = 0.375 the zeros are ±0.5i; at t = 0.5 both are 0; at t = 1 they are ±1. The off-axis pair came down to the axis and then split along it.`,
      },
      {
        level: 'intermediate',
        heading: 'The formula and the equation',
        paragraphs: [
          `With z = x + iy, H_t(z) = ∫₀^∞ e^{tu²} Φ(u) cos(zu) du, where Φ is a positive, very rapidly decaying kernel built from a theta series. At t = 0, H_0(z) = ξ((1 + iz)/2)/8, with ξ the completed zeta function (zeta times gamma and polynomial factors, which make it entire and symmetric). In words, H_t is a cosine Fourier transform of the kernel e^{tu²}Φ(u) (a Fourier transform writes a function as a superposition of waves cos(zu)); multiplying the kernel by e^{tu²} is the whole deformation.`,
          `Differentiating under the integral sign gives ∂_t H_t = −∂²_z H_t: each u² from e^{tu²} matches a −∂²_z acting on cos(zu). Because H_t is analytic, ∂²_z equals ∂²_x and equals −∂²_y. So in the horizontal (real) direction this is the backward heat equation, and in the vertical (imaginary) direction it is the ordinary forward heat equation ∂_t H = ∂²_y H. The vertical smoothing is what flattens zeros onto the real axis.`,
          `The flow is classical for polynomials: e^{−t d²/dz²} maps a polynomial with only real zeros to one with only real zeros for t ≥ 0 (Pólya–Schur theory of multiplier sequences). For H_t, de Bruijn proved the same persistence and a quantitative strip theorem.`,
        ],
        math: [
          tex`\partial_t H_t(z)=-\,\partial_z^2H_t(z)=\partial_y^2H_t(x+iy)`,
          tex`\text{polynomial case: } p_t=e^{-t\,d^2/dz^2}p=p-t\,p''+\tfrac{t^2}{2}p^{(4)}-\cdots`,
        ],
        example: `For a cubic p(z) = z³ + z (zeros 0, ±i): p″ = 6z and p⁗ = 0, so p_t = z³ + (1 − 6t)z. Zeros: 0 and ±√(6t − 1). They are non-real for t < 1/6 and all real from t = 1/6 on.`,
      },
      {
        level: 'advanced',
        heading: 'Properties used by the Λ machinery',
        paragraphs: [
          `Joint regularity: (t, z) ↦ H_t(z) is continuous, entire in z, of order 1, even, and real on the real axis; H_t(iy) > 0 for real y (Φ > 0), so no zero lies on the imaginary axis. Zeros of H_t move continuously in t (Hurwitz/Rouché), simple zeros smoothly with velocity given by Polymath15 Prop. 3.1 (see zero dynamics).`,
          `De Bruijn strip theorem (1950, Thm 13; P15 Thm 3.2): if H_{t₀} has no zeros with |y| > y₀, then for t > t₀ it has none with |y| > max(y₀² − 2(t − t₀), 0)^{1/2}. Positive-time confinement (P15 Thm 1.5(i)): for 0 < t ≤ 1/2 every zero with x ≥ exp(C/t) is real. Effective approximation (P15 Thm 1.3): H_t equals an explicit finite Dirichlet-type sum over n ≤ N plus a mirror term, up to an error ε_cap that is bounded explicitly; every barrier certificate must clear that error.`,
          `For t < 0 some zeros of H_t are non-real (Rodgers–Tao). The log-derivative of H_t satisfies a viscous Burgers equation (Cole–Hopf), in which zero collisions are shocks. Separately, the project's flow-blindness note observes that the backward flow keeps Ξ inside every "soft" analytic class while creating off-line zeros, so such properties cannot by themselves imply RH.`,
        ],
        math: [
          tex`|y|\le y_0\ \text{at}\ t_0\ \Longrightarrow\ |y|^2\le\max\!\left(y_0^2-2(t-t_0),0\right)\ \text{for}\ t>t_0`,
          tex`H_t(x+iy)\approx \sum_{n\le N} b_n^t\, n^{-s_*}+\text{(mirror term)},\qquad N\approx\sqrt{x/4\pi}`,
        ],
        details: [
          `The finite-sum approximation is written schematically; exact forms and the error bound are in Polymath15 §§4–6 and the project's effective-error-cap page.`,
          `N = ⌊√((X − 4)/4π)⌋ = 690988 at X = 6000000185827, the barrier abscissa used at PT height (checked in s145-raymond-height-contract).`,
        ],
      },
    ],
    physicsAnalogy: {
      system: 'Heat diffusion in a rod laid across the critical line',
      mapping: [
        'Vertical coordinate y ↔ position along the rod; ∂_t H = ∂²_y H is the ordinary heat equation in y.',
        'Increasing t ↔ letting heat diffuse; sharp features in the vertical direction are smoothed.',
        'Zeros off the axis ↔ features that diffusion erodes; they are drawn down to y = 0.',
        'Running t backward ↔ "un-diffusing", which is unstable and creates structure (non-real zeros), as Rodgers–Tao show.',
      ],
      whereItBreaks: 'H_t is complex-valued and the diffusion statement is about its values, not its zeros; the zeros obey their own interacting-particle law (see zero dynamics). In the horizontal direction the same equation is backward diffusion, which has no counterpart for an ordinary heated rod.',
    },
    examples: [
      { level: 'beginner', title: 'Quadratic', text: `z² + 1 − 2t: zeros ±i at t = 0, meet at 0 at t = 0.5, real afterwards.` },
      { level: 'intermediate', title: 'Cubic', text: `z³ + (1 − 6t)z: all zeros real from t = 1/6 ≈ 0.1667. The pair ±i started at distance y₀ = 1 and the strip theorem bound 0 + 1²/2 = 0.5 is valid but not sharp here, because the third zero at 0 pushes the pair down faster.` },
      { level: 'advanced', title: 'Truncation length at PT height', text: `At X = 6000000185827 the main sum has N₀ = 690988 terms; the project candidate's finite lane covers N = 690988 … 6000000 (5,309,013 rows).` },
    ],
    whyItMatters: `Every statement about Λ is a statement about the zeros of H_t. The barrier method, Raymond's decreasing barrier and the Lemma B bands all certify zero-free regions of H_t for t between 0 and about 0.164 and then use the strip theorem to conclude that all zeros are real by some time U, giving Λ ≤ U. In this project H_t is evaluated through the Polymath15 effective approximation in Arb ball arithmetic. The accepted bound remains Platt–Trudgian Λ ≤ 0.2; RH is open.`,
    example: { title: 'Toy flow with exact numbers', text: `z³ + z → z³ + (1 − 6t)z: zeros 0, ±i at t = 0; 0, ±0.577i at t = 1/9 (1 − 6/9 = 1/3); all real from t = 1/6.` },
    pitfalls: [
      'The equation ∂_t H = −∂²_z H is a backward heat equation in x; describing the flow simply as "smoothing" is correct only in the y direction.',
      'H_t for t > 0 is not the zeta function of anything; its zeros are not zeros of zeta.',
      'Sign and scale conventions vary between papers (some use ∂_t H = ∂²_z H with t ↦ −t, or z scaled by 2).',
    ],
    prerequisites: ['xi-function', 'complex-number', 'fourier-transform'],
    mentions: ['xi-function', 'riemann-zeta-function', 'riemann-hypothesis', 'de-bruijn-newman-constant', 'complex-number', 'fourier-transform', 'entire-function', 'zero-dynamics', 'effective-error-cap', 'burgers-cole-hopf', 'flow-blindness', 'barrier-method', 'decreasing-zero-height-barrier', 'two-band-lemma-b', 'arb-interval-certificate'],
    furtherReading: [
      { label: 'de Bruijn departure', route: '/debruijn-departure' },
      { label: 'Supercritical (Burgers view)', route: '/supercritical' },
      { label: 'Polymath15 paper', url: 'https://arxiv.org/abs/1904.12438' },
    ],
    sources: [
      { label: 'Lemma B note §0–§1 (normalisation, cited theorems)', path: 'formalization/paper/lemma-B-two-band.md' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────────────────────
  'zero-dynamics': {
    intro: `As the heat-flow parameter t changes, each zero of H_t moves, and its velocity depends only on where all the other zeros are. The result is a system of interacting particles: zeros on the real line push each other apart, and a zero above the line is pulled down by its mirror image below it. This page describes that particle system.`,
    levels: [
      {
        level: 'beginner',
        heading: 'Zeros as particles that push and pull',
        paragraphs: [
          `Under the heat flow H_t (a smoothing of the Riemann Ξ function, whose zeros encode the nontrivial zeros of zeta), the zeros are not fixed: they move as t increases. The zeros are complex numbers, which can be drawn as points in a plane: a horizontal real axis and a vertical imaginary axis. There is a simple rule for their motion. Each zero moves with a velocity equal to a sum of contributions, one from every other zero, and each contribution is 2 divided by the difference of their positions.`,
          `On the real line this means: two real zeros push each other apart, and the closer they are, the harder they push. For a zero sitting above the real axis there is always a partner below it (zeros come in mirror pairs, because H_t is real on the real axis). The partner's contribution points straight down, so a non-real zero is pulled toward the axis.`,
          `Run the flow backward (t decreasing) and every push becomes a pull: close real zeros attract, can collide, and then leave the axis as a mirror pair. This is how non-real zeros appear for t < 0, and it is why the de Bruijn–Newman constant Λ cannot be negative.`,
          `What the simple rule leaves out: there are infinitely many zeros, so the sum has infinitely many terms and must be added in symmetric pairs to converge; the rule holds for simple zeros, and at a collision the zeros split according to a different (Hermite polynomial) law.`,
        ],
        analogy: `Electric charges of the same sign threaded on a wire, moving through thick oil: each charge drifts away from its neighbours, slower when they are far. A charge lifted off the wire feels its mirror image and is drawn back down.`,
        example: `Two zeros at −1 and +1. The rule gives the zero at +1 the velocity 2/(1 − (−1)) = 1, moving right, and the other moves left at speed 1. Check with the quadratic z² − 1 − 2t, whose zeros are ±√(1 + 2t): the derivative of √(1 + 2t) at t = 0 is 1. Backward in time they meet at t = −0.5.`,
      },
      {
        level: 'intermediate',
        heading: 'The velocity law',
        paragraphs: [
          `Let z_k(t) be the zeros of H_t. If z_k is simple, implicit differentiation of H_t(z_k(t)) = 0 and the equation ∂_t H = −∂²_z H give dz_k/dt = H″/H′ at z_k, and for a function with a Hadamard product this equals 2Σ′ 1/(z_k − z_j) over the other zeros (Polymath15 Prop. 3.1; the primed sum groups j and −j to converge).`,
          `Real zeros: if all zeros are real, each velocity is real, so real zeros stay on the axis and repel. Conjugate pair z = x ± iy: the term from the partner is 2/(2iy) = −i/y, which alone gives dy/dt = −1/y, that is d(y²)/dt = −2. De Bruijn's strip theorem makes this global: the largest |y|² decreases at least at rate 2.`,
          `Backward flow: with s = −t the law becomes dz_k/ds = −2Σ′ 1/(z_k − z_j), an attractive Calogero–Moser-type gradient flow. An isolated real pair with gap g has d(g²)/ds = −8 and collides at s = g²/8. Neighbours slow this; the Θ-trap theorems quantify by how much.`,
        ],
        math: [
          tex`\frac{dz_k}{dt}=2\sum_{j\ne k}{}'\,\frac{1}{z_k-z_j}`,
          tex`z=x\pm iy:\quad \frac{d}{dt}\,y^2=-2+\text{(contributions of other zeros)}`,
          tex`\text{isolated real pair, gap }g:\quad \frac{d(g^2)}{dt}=8`,
        ],
        example: `Pair at ±i (quadratic z² + 1 − 2t): the rule gives the zero at i the velocity 2/(i − (−i)) = −i, straight down at speed 1. Exact zeros ±i√(1 − 2t): derivative of √(1 − 2t) at t = 0 is −1. They reach the axis at t = 0.5 = y₀²/2.`,
      },
      {
        level: 'advanced',
        heading: 'Precise statements and uses',
        paragraphs: [
          `P15 Prop. 3.1: (i) a simple zero z* of H_{t*} continues to a smooth curve with dz/dt = 2Σ′ 1/(z* − z_k); (ii) a zero of order m splits as z* + √2 (t − t*)^{1/2} λ_j + O(|t − t*|), λ_j the roots of the Hermite polynomial He_m. Forward in time the leading terms are real; backward they are purely imaginary. So collisions on the axis are the only way real zeros leave it, and only backward in time.`,
          `The project uses the law in three places. (1) Barrier arguments (proofs that no zero can cross a certified region): at a first contact between a zero and a descending ceiling, the zero's vertical velocity is split into near-field kernel terms (nearby zeros, bounded by Bernstein certificates, i.e. exact positivity checks of polynomials) and a smooth source term (bounded by source floors, certified lower bounds). (2) Collision-time analysis (Θ-trap, isolation ratio): rigorous statements about the backward attractive flow. (3) The Burgers view: the log-derivative of H_t solves viscous Burgers, and collisions are shocks.`,
          `Rodgers–Tao's proof of Λ ≥ 0 uses this dynamics: if Λ < 0, the zeros at t = 0 would be the result of running the repulsive forward flow from time Λ, which relaxes the gaps toward an arithmetic-progression-like arrangement; that contradicts known pair-correlation-type statistics of the zeta zeros.`,
        ],
        math: [
          tex`\text{order }m:\quad z_j(t)=z^*+\sqrt2\,(t-t^*)^{1/2}\lambda_j+O(|t-t^*|),\qquad \mathrm{He}_m(\lambda_j)=0`,
        ],
        details: [
          `Measured at N = 10⁴ real-zero samples: the minimal pair has Θ(0) = 0.0017 and the Θ-trap collision ceiling g²/6 = 2.369·10⁻⁴ (sg1c-theta-trap-theorems; imp-theta-trap-sign-audit).`,
        ],
      },
    ],
    physicsAnalogy: {
      system: 'Overdamped like charges on a line (a deterministic Coulomb/Dyson gas in two dimensions)',
      mapping: [
        'Zeros ↔ point charges; the 1/(z_k − z_j) velocity is the 2-D Coulomb force (logarithmic potential).',
        'Overdamped motion (velocity proportional to force) ↔ first-order law dz/dt = force; there is no inertia.',
        'Mirror symmetry of zeros ↔ a conducting plane producing image charges; an off-axis charge is attracted to its image.',
        'Backward flow ↔ reversing the sign of the charges: attraction, collisions, and pairs leaving the axis.',
      ],
      whereItBreaks: 'The gas has infinitely many particles with density growing like log x, so sums converge only conditionally; there is no noise term (unlike Dyson Brownian motion); collisions resolve by a Hermite-polynomial splitting rule that has no counterpart for physical charges.',
    },
    examples: [
      { level: 'beginner', title: 'Repelling pair', text: `Zeros at ±1 move apart at speed 1 each (2/2 = 1). After t = 1.5 they sit at ±√4 = ±2.` },
      { level: 'intermediate', title: 'Isolated collision time', text: `Gap g = 2 between real zeros, no neighbours: g² = 4 shrinks at rate 8 under the backward flow, so they collide after 4/8 = 0.5, matching the quadratic toy.` },
      { level: 'advanced', title: 'Close pairs and the old lower bounds', text: `Close pairs of consecutive zeta zeros (Lehmer pairs) collide quickly under the backward flow; that is how numerical lower bounds such as Λ > −1.14541·10⁻¹¹ were obtained before Rodgers–Tao.` },
    ],
    whyItMatters: `Upper bounds on Λ need to show that zeros cannot stay above some height; lower bounds and the meaning of Λ ≥ 0 come from collisions in the backward flow. The velocity law is the common tool. The project's barrier certificates (candidate Λ ≤ 0.1758354, unreviewed; route P and Lemma B values, conditional) and its collision-time theorems all start from P15 Prop. 3.1. None of these moves the accepted Platt–Trudgian bound Λ ≤ 0.2; RH is open.`,
    example: { title: 'Mirror-pair descent', text: `A lone conjugate pair at height y₀ = 0.2 reaches the axis by t = 0.2²/2 = 0.02 after the time its strip is certified; other zeros can only help (de Bruijn).` },
    pitfalls: [
      'The sum over other zeros converges only when grouped symmetrically; truncating it naively gives wrong velocities.',
      'Real zeros repel only forward in time; the backward flow is attractive.',
      'A single zero can move up locally; only the maximum height over all zeros is guaranteed to decrease.',
    ],
    prerequisites: ['heat-flow-ht', 'complex-number'],
    mentions: ['heat-flow-ht', 'complex-number', 'xi-function', 'nontrivial-zeros', 'de-bruijn-newman-constant', 'theta-trap', 'zero-collision-time', 'isolation-ratio', 'burgers-cole-hopf', 'barrier-method', 'source-floor', 'bernstein-certificate', 'pair-correlation', 'lehmer-pair'],
    furtherReading: [
      { label: 'Dyson verifier', route: '/dyson-verifier' },
      { label: 'Winding Dyson flow', route: '/viz-winding-dyson-flow' },
      { label: 'Supercritical (Burgers view)', route: '/supercritical' },
    ],
    sources: [
      { label: 'Θ-trap theorems', path: 'src/data/sg1c-theta-trap-theorems.js' },
      { label: 'Lemma B note §1 [P15-3.1]', path: 'formalization/paper/lemma-B-two-band.md' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────────────────────
  'theta-trap': {
    intro: `The Θ-trap is a set of project theorems about the closest pair of zeros when the heat flow is run backward. A single number Θ measures how strongly the other zeros hold the pair apart. The theorems show that once Θ is below a threshold it stays below it, and as a consequence the pair must collide within a computable time.`,
    levels: [
      {
        level: 'beginner',
        heading: 'A pair, its neighbours, and a number that cannot rise',
        paragraphs: [
          `Run the heat flow backward (see zero dynamics): real zeros of H_t now attract each other. Two neighbouring zeros a small gap g apart are pulled together by each other, while the zeros further away pull each member of the pair outward, in opposite directions, slowing the collision.`,
          `Θ (theta) compares those two effects. It is built from the gap and from the positions of all the other zeros (the "environment"). Θ = 0 means the pair is alone and collides as fast as possible; Θ = 1 would mean the environment exactly cancels the pair's attraction.`,
          `Theorem A says: if Θ starts at or below 1/4, it never rises above 1/4 while the pair exists. With Θ ≤ 1/4 the squared gap shrinks at rate at least 6, so the pair collides within time g²/6. A trap of this kind is a statement about every configuration, not about one simulation.`,
          `What this leaves out: the theorems concern the attractive particle system, which matches the zeros of a truncated flow; transferring a collision time from that system to Λ needs a separate error term, and the sign of that transfer matters (see pitfalls).`,
        ],
        analogy: `A binary star in a cluster: the two stars attract each other, and tidal forces from the rest of the cluster tug them apart. Θ is like the ratio of tidal pull to binding pull. If it starts small, it stays small, and the pair spirals together within a known time.`,
        example: `Points −1, 0, 1, with the pair (0, 1) and one neighbour at −1. The neighbour's term is 1/((0 − (−1))·(1 − (−1))) = 1/2, so E = 1/2 and Θ = g²E/2 = 1·(1/2)/2 = 1/4: exactly at the Theorem A threshold. Then g² shrinks at rate 8(1 − 1/4) = 6.`,
      },
      {
        level: 'intermediate',
        heading: 'Definitions and the exact identities',
        paragraphs: [
          `Use the backward time s = −t, so the flow is dx_k/ds = −2Σ_{j≠k} 1/(x_k − x_j) on real points. Fix an adjacent pair x_k < x_{k+1} with gap g. For each other point j put T_j = 1/((x_k − x_j)(x_{k+1} − x_j)), which is positive because x_j lies outside the pair. Let E = Σ_j T_j and Θ = g²E/2.`,
          `Two exact identities hold for every configuration: dg/ds = −(4/g)(1 − Θ), and a closed formula for dΘ/ds in terms of Θ, g and the power sums Σ T_j², Σ T_j³. Because of the second identity, whether a level Θ* can be crossed upward is a static inequality on configurations: no simulation is needed.`,
          `Theorem A (threshold 1/4, any adjacent pair). Using g²T_j ≤ 2Θ termwise, dΘ/ds ≤ 4Θ(Θ + 2)(4Θ − 1)/g² < 0 for 0 < Θ < 1/4. Corollary A1: if the minimal pair starts with Θ ≤ 1/4, then d(g²)/ds ≤ −6 and the first collision happens by s = g_min(0)²/6.`,
        ],
        math: [
          tex`T_j=\frac{1}{(x_k-x_j)(x_{k+1}-x_j)},\qquad E=\sum_j T_j,\qquad \Theta=\frac{g^2E}{2}`,
          tex`\frac{dg}{ds}=-\frac{4}{g}(1-\Theta),\qquad \frac{d\Theta}{ds}=-\frac{4\Theta(2-\Theta)}{g^2}+6g^2\sum_jT_j^2+2g^4\sum_jT_j^3`,
          tex`\Theta(0)\le\tfrac14\ \Longrightarrow\ t_c\le \frac{g_{\min}(0)^2}{6}`,
        ],
        example: `Isolated pair (Θ = 0): d(g²)/ds = −8, collision at g²/8. Trapped pair at the threshold: rate −6, collision by g²/6. For g = 0.1 these are 0.00125 and 0.00167.`,
      },
      {
        level: 'advanced',
        heading: 'Sharp thresholds, refutation band, and the sign audit',
        paragraphs: [
          `Theorem B (minimal-gap trap): if g is the minimal gap, then μ_j = g²T_j ≤ 1/2, and Schur-convexity of power sums puts the worst case at a capped-greedy profile. The boundary inequality reduces to r(2r² + 7r − 3) ≤ 0 with Θ = 1/4 + r/2, so the trap holds at every level up to Θ_b = (√73 − 5)/8 ≈ 0.4430, and Θ_b is sharp (realised by d₁ = g on one side, d₂ ≈ 1.185g on the other). Theorem C: if g ≤ c·d₁ with c ≤ 0.72, every level up to 1 is trapped while the isolation holds. Theorem B underlies the project's min-gap sandwich (two-sided bounds on the smallest gap along the flow).`,
          `Refuted band: the family {−d, 0, 1, 1 + d}, d ∈ (1, 1.0735), has a strict minimal gap and dΘ/ds > 0 (at d = 1.05, Θ(0) = 0.4646 and dΘ/ds = +0.1378), and integrates up to Θ ≈ 0.5000 (dressed variant 0.5073) before minimality transfers. So every threshold in (0.443, 0.5073) is crossed by some minimal-gap configuration; the open residual is a dynamic excursion cap.`,
          `Sign audit (imp-2847): the bridge to Λ has two faces, Λ ≤ −t_c + E(N) and Λ ≥ −t_c − E(N). A1 is an upper bound on t_c, so it only improves the lower face, which Rodgers–Tao (Λ ≥ 0) already dominates. A1 is a true theorem that does not lower any upper bound on Λ; the headline burden sits on the bridge error E(N).`,
        ],
        math: [
          tex`\Theta_b=\frac{\sqrt{73}-5}{8}\approx0.4430,\qquad r(2r^2+7r-3)\le0,\ \Theta=\tfrac14+\tfrac r2`,
          tex`\Lambda\le -t_c+E(N)\quad\text{(upper face: needs a lower bound on }t_c)`,
        ],
        details: [
          `On measured real-zero rows Θ(0) = 0.167, 0.088, 0.046, all below 1/4, so Theorem A applies to them directly.`,
          `Status: project theorems derived in-session with independent numerical re-verification (Lemma 1 identity: max relative error 9.1·10⁻⁹ against finite differences over 50 random configurations); internal, not externally refereed.`,
        ],
      },
    ],
    physicsAnalogy: {
      system: 'A bound binary in a tidal field, with overdamped (friction-dominated) motion',
      mapping: [
        'Pair gap g ↔ binary separation; mutual attraction ∝ 1/g.',
        'Environment energy E ↔ tidal field from the rest of the cluster, pulling the members apart.',
        'Θ = g²E/2 ↔ ratio of tidal to binding force.',
        'Trap theorem ↔ "a tightly bound binary stays tightly bound and merges in finite time".',
      ],
      whereItBreaks: 'The dynamics is first order (no inertia, no orbits), one-dimensional, with a logarithmic interaction; the environment is the infinite zero set, not a finite cluster. The trap is a theorem about this model flow; its effect on Λ goes through a separate error term and has the wrong sign for upper bounds.',
    },
    examples: [
      { level: 'beginner', title: 'Symmetric triplet', text: `−1, 0, 1 with pair (0, 1): Θ = 1/4 exactly and dΘ/ds = 0; this triplet shows the 1/4 threshold of Theorem A cannot be improved for arbitrary pairs.` },
      { level: 'intermediate', title: 'Collision ceiling at N = 10⁴', text: `Measured minimal pair Θ(0) = 0.0017, so Corollary A1 applies: t_c ≤ g_min²/6 = 2.369·10⁻⁴.` },
      { level: 'advanced', title: 'Theorem B constant', text: `√73 = 8.5440, so Θ_b = (8.5440 − 5)/8 = 0.4430; plugging Θ_b into the A1 argument gives the weaker ceiling g²/(13 − √73) = g²/4.456.` },
    ],
    whyItMatters: `The Θ-trap closes the static part of a question the project had left open: does the closest pair of zeros keep collapsing under the backward flow, or can neighbours rescue it? The answer is rigorous on the isolated-pair basin. For Λ it is a negative result: the collision bound points in the direction that cannot lower an upper bound, which redirected work to the bridge error and, later, to barrier methods. Platt–Trudgian Λ ≤ 0.2 remains the accepted bound; RH is open.`,
    example: { title: 'Threshold ladder', text: `1/4 (any pair, sharp) < 0.4430 (minimal pair, sharp) < refuted band (0.443, 0.5073) < Θ ≤ 1 with isolation ratio ≤ 0.72 (Theorem C).`, source: 'src/data/sg1c-theta-trap-theorems.js' },
    pitfalls: [
      'The trap does not say the pair "cannot close"; it says Θ cannot rise, which forces the pair to close within g²/6.',
      'An upper bound on collision time does not improve an upper bound on Λ (sign audit).',
      'Theorem B needs g to be the minimal gap; Theorem A does not.',
    ],
    prerequisites: ['zero-dynamics', 'heat-flow-ht'],
    mentions: ['zero-dynamics', 'heat-flow-ht', 'zero-collision-time', 'isolation-ratio', 'excursion-cap', 'min-gap-sandwich', 'bridge-error-split', 'de-bruijn-newman-constant', 'newman-conjecture', 'barrier-method'],
    furtherReading: [
      { label: 'Theorem B threshold', route: '/theorem-b-threshold' },
      { label: 'Spectral attack', route: '/spectral-attack' },
      { label: 'Θ-basin closure', route: '/theta-basin-closure' },
    ],
    sources: [
      { label: 'Θ-trap theorems', path: 'src/data/sg1c-theta-trap-theorems.js' },
      { label: 'Θ-trap sign audit', path: 'src/data/imp-theta-trap-sign-audit.js' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────────────────────
  'barrier-method': {
    intro: `The barrier method is the standard way to prove an upper bound on the de Bruijn–Newman constant Λ. It combines three checks: zeros are verified on the line up to some height, a computer certifies that no zero of the heat-flowed function crosses a thin "barrier" region at that height, and an approximation formula shows that beyond the barrier all zeros are already close to the line. Together these give Λ ≤ t₀ + y₀²/2 for chosen numbers t₀ and y₀.`,
    levels: [
      {
        level: 'beginner',
        heading: 'Fence, survey, and settling',
        paragraphs: [
          `Recall the setting: the de Bruijn–Newman constant Λ is the first time t at which the heat-flowed function H_t (a smoothing of the Riemann Ξ function) has all its zeros on the real axis. RH is the statement Λ ≤ 0. To prove an upper bound such as Λ ≤ 0.2 you must show that by time 0.2 every one of infinitely many zeros has reached the axis.`,
          `The barrier method splits the zeros by horizontal position x (which is twice the height of the corresponding zeta zero). Low zeros, below some large X: these are covered by direct verification that zeta's zeros are on the line up to height X/2. High zeros, far beyond X: an approximation formula for H_t is accurate there and shows the zeros are low. The danger is a zero that travels from one region to the other while the flow runs. The barrier is a narrow strip at x ≈ X, of width 1, in which a computer checks, for all times from 0 to t₀, that H_t has no zeros above a certain height. No zero can cross it.`,
          `Once all three checks pass, every zero has height at most y₀ at time t₀. A separate theorem of de Bruijn says that from then on the squared height falls at rate at least 2, so all zeros are real by time t₀ + y₀²/2.`,
          `What this leaves out: each of the three checks is a large computation with its own error bounds (the approximation formula has an explicit error that the certificate must beat), and choosing t₀ smaller makes the region beyond the barrier much more expensive to check.`,
        ],
        analogy: `A long trench filled with settling sediment: you survey the near part by hand, you know the far part is already flat, and you put a fence between them so nothing slides across while you wait. After that, gravity flattens what is left at a known minimum rate.`,
        example: `With t₀ = 0.2 and y₀ = 0.2: 0.2 + 0.2²/2 = 0.2 + 0.02 = 0.22, the Polymath15 bound. If instead every zero were within height y₀ = 0.1 by t₀ = 0.15, the bound would be 0.15 + 0.005 = 0.155.`,
      },
      {
        level: 'intermediate',
        heading: 'The three hypotheses',
        paragraphs: [
          `Polymath15 Theorem 1.2 (as transcribed in the project's candidate audit; the paper is authoritative) uses z = x + iy and the normalisation H_0(z) = ξ((1 + iz)/2)/8, in which a zeta zero at height γ sits at x = 2γ. Fix 0 < t₀ ≤ 1/2, 0 < y₀ with y₀² < 1 − 2t₀, and a large X.`,
          `(i) Height: zeta has no zeros with real part between (1 + y₀)/2 and 1 up to height X/2. In practice this comes from RH verified to height X/2 (Platt–Trudgian: 3.0001753·10¹²). (ii) Beyond the barrier at time t₀: H_{t₀} has no zeros with x ≥ X + √(1 − y₀²) and y₀ ≤ y ≤ √(1 − 2t₀); this is checked with the effective approximation over a finite "lane" of truncation lengths N plus an analytic tail. (iii) Barrier: H_t has no zeros in the strip X ≤ x ≤ X + √(1 − y₀²) above the curve y = √(y₀² + 2(t₀ − t)), for 0 ≤ t ≤ t₀. Then Λ ≤ t₀ + y₀²/2.`,
          `The last step is de Bruijn's strip theorem: if every zero of H_{t₀} has |y| ≤ y₀, all zeros of H_t have |y|² ≤ y₀² − 2(t − t₀), which reaches 0 at t = t₀ + y₀²/2.`,
        ],
        math: [
          tex`\text{(iii)}\quad H_t(x+iy)\ne0\ \ \text{for}\ X\le x\le X+\sqrt{1-y_0^2},\ \sqrt{y_0^2+2(t_0-t)}\le y\le\sqrt{1-2t},\ 0\le t\le t_0`,
          tex`\text{(i)–(iii)}\ \Longrightarrow\ \Lambda\le t_0+\tfrac12y_0^2`,
        ],
        example: `Project candidate: X = 6000000185827, so X/2 = 3000000092913.5, below Platt–Trudgian's 3000175332800 by 175239886.5. Parameters t₀ = 1583/10000 and y₀² = 87677/2500000 give t₀ + y₀²/2 = 879177/5000000 = 0.1758354.`,
      },
      {
        level: 'advanced',
        heading: 'Cost structure and the fixed-t₀ floor',
        paragraphs: [
          `Hypothesis (ii) is the expensive one. At small t₀ the effective approximation must be certified over truncation lengths N from N₀ = ⌊√((X − 4)/4π)⌋ (690988 at the PT abscissa) up to a point N₁* where an analytic tail argument takes over. The project's Route VII cost law fits ln N₁* = (2c₀ − y)/t + L₀ (c₀ = 1.2218525, L₀ = 1.1676005), so the lane length grows like exp(Θ(1/t)). At fixed verified height this floors the method near Λ ≈ 0.145–0.150, independently of how the barrier itself is certified.`,
          `Hypothesis (iii) is certified on a box of closed time prisms by evaluating H_t (via its effective approximation plus the explicit error ε_cap of P15 Thm 1.3) in ball arithmetic and checking a winding or lower-bound condition. In the project candidate the region at t₀ lies inside a sealed box [X, X + 1] × [0.1809, 1] × [0, 129/800] (883 closed time prisms), so the interface holds by containment. A separate y-transfer gate extends lower bounds proved at one height y to every y in a box, with a certified excision budget.`,
          `Hypothesis (i) ties the method to verified height (the verification-height wall). Λ·ln T stays roughly constant for barrier-type bounds, so the accepted bound moved from 0.22 (Polymath15) to 0.2 (Platt–Trudgian) mainly through height. Raymond's decreasing barrier removes the t₀ + y₀²/2 term and the lane altogether; it is a different architecture with its own floors.`,
        ],
        math: [
          tex`N_0=\left\lfloor\sqrt{\tfrac{X-4}{4\pi}}\right\rfloor=690988\quad(X=6000000185827)`,
          tex`\ln N_1^*\approx\frac{2c_0-y}{t}+L_0\quad\text{(Route VII fit)}`,
        ],
        details: [
          `Candidate gate margins (Arb): finite lane rows 690988…6000000, 5,309,013 rows, 0 uncertain, minimum margin A1 = 1.872347259·10⁻³; tail verifier D ≤ 0.880148631881 < 1; ε_cap ≤ 2.668232·10⁻⁷ on the lane.`,
          `Status: Polymath15 (Λ ≤ 0.22) and Platt–Trudgian (Λ ≤ 0.2) are peer reviewed; the project's 0.1758354 instance is a computer-assisted candidate, unreviewed and unpublished.`,
        ],
      },
    ],
    physicsAnalogy: {
      system: 'A partitioned settling tank with a sealed bulkhead',
      mapping: [
        'Zeros ↔ particles suspended at various heights; the real axis ↔ the tank floor.',
        'Verified RH region (i) ↔ the near compartment, inspected directly.',
        'Lane and tail (ii) ↔ the far compartment, where a model (the approximation formula) shows particles are already low.',
        'Barrier (iii) ↔ a bulkhead that no particle can pass while the experiment runs from 0 to t₀.',
        'De Bruijn strip theorem ↔ settling at a guaranteed minimum rate: squared height falls at least at rate 2.',
      ],
      whereItBreaks: 'Particles in a tank move independently under gravity; zeros interact (they repel along the axis and are pulled down by mirror partners), and the "minimum settling rate" is a theorem about the maximum height of the whole set, not about each zero. The bulkhead is not a physical wall: it is a computed statement that a function has no zeros in a region.',
    },
    examples: [
      { level: 'beginner', title: 'Two parameter choices', text: `(t₀, y₀) = (0.2, 0.2) → 0.22; (0.1583, 0.18727) → 0.1583 + 0.0175354 = 0.1758354.` },
      { level: 'intermediate', title: 'Height check for the candidate', text: `X/2 = 3000000092913.5 ≤ 3000175332800 = T_PT, margin 350479773/2.` },
      { level: 'advanced', title: 'Lane length versus t', text: `The Route VII law makes N₁* grow like exp((2c₀ − y)/t); halving t roughly squares the factor exp((2c₀ − y)/t), which is why fixed-t₀ certificates stall near 0.145–0.150 at PT height.` },
    ],
    whyItMatters: `The barrier method produced every accepted upper bound since 2019 (Polymath15 0.22; Platt–Trudgian 0.2, the accepted benchmark) and the project's Λ ≤ 0.1758354, a computer-assisted candidate with all four gates certified in Arb, unreviewed and unpublished. Its structure explains where improvements can come from: more verified height, cheaper lane certification, or a different architecture such as Raymond's decreasing barrier. RH is open; the method cannot reach Λ = 0.`,
    example: { title: 'Candidate row', text: `t₀ = 1583/10000, y₀² = 87677/2500000, t₀ + y₀²/2 = 879177/5000000 = 0.1758354; y₀² < 1 − 2t₀ = 3417/5000.`, source: 'src/data/dag3-audit01758-2026-09-28.js' },
    pitfalls: [
      'The barrier is not a wall in the zeta plane at a fixed height; it is a strip in the H_t plane at x ≈ X, certified for a whole time interval.',
      'Hypothesis (i) needs RH (or a zero-free region) only up to height X/2, not beyond.',
      'Lowering t₀ is not free: the lane in hypothesis (ii) grows exponentially in 1/t₀.',
    ],
    prerequisites: ['de-bruijn-newman-constant', 'heat-flow-ht', 'platt-trudgian-verified-height'],
    mentions: ['de-bruijn-newman-constant', 'heat-flow-ht', 'xi-function', 'platt-trudgian-verified-height', 'effective-error-cap', 'route-vii-lane', 'y-transfer', 'arb-interval-certificate', 'project-lambda-candidate', 'decreasing-zero-height-barrier', 'lambda-log-height-law', 'verification-height-wall'],
    furtherReading: [
      { label: 'Λ bounds', route: '/lambda-bounds' },
      { label: 'PT floor audit', route: '/pt-floor-audit' },
      { label: 'Λ ≤ 0.1758354 candidate', route: '/lambda-01758354-candidate' },
      { label: 'Polymath15 paper', url: 'https://arxiv.org/abs/1904.12438' },
    ],
    sources: [
      { label: 'Candidate composition audit', path: 'src/data/dag3-audit01758-2026-09-28.js' },
      { label: 'Requirements map (Route VII law)', path: 'src/data/s145-requirements-map-2026-09-30.js' },
      { label: 'Referee checklist (Thm 1.2 transcription)', path: 'formalization/review-packet-01758354/REFEREE_CHECKLIST.md' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────────────────────
  'decreasing-zero-height-barrier': {
    intro: `A decreasing zero-height barrier is a ceiling on how far zeros can be from the real axis that is lowered step by step as the heat-flow time runs, starting at time 0. Instead of waiting until a fixed time t₀ and then applying a general theorem, it proves at every step that no zero can touch the ceiling as it comes down. This architecture is used in Raymond's unrefereed preprint, which reports Λ ≤ 0.149396.`,
    levels: [
      {
        level: 'beginner',
        heading: 'Lowering a lid without touching anything',
        paragraphs: [
          `Background: the de Bruijn–Newman constant Λ is the first time t at which every zero of the heat-flowed function H_t lies on the real axis; RH says Λ ≤ 0, and the accepted bound is Λ ≤ 0.2. At time 0 every zero is known to lie within height 1 of the axis (zeta has no zeros on the edges of the critical strip).`,
          `Picture a lid at height 1 over all the zeros. Lower it slowly. At each moment, ask: could some zero be touching the lid right now? If at the first possible moment of contact the zero would be moving down faster than the lid, contact is impossible, and the lid can keep going. When the lid reaches the axis at some time U, every zero is real, so Λ ≤ U.`,
          `How fast the lid may move depends on how hard the zeros are pushed down near it. That push has two parts: from nearby zeros, and from the smooth "source" part of H_t. Certified lower bounds on the source part are called source floors; higher floors allow a faster lid.`,
          `What this leaves out: the low zeros (below a large height) are handled separately by verified RH and vertical "walls" where H_t is checked to be nonzero; the lid's path is computed in about 600 small time steps, each with its own certificate; and the whole argument rests on analytic lemmas in Raymond's preprint that have not been refereed externally.`,
        ],
        analogy: `A piston lowered into a cylinder of floating particles that are always drifting down. If at every height the slowest-falling particle that could be at the piston face is still falling faster than the piston, the piston never touches a particle.`,
        example: `Raymond's lid goes from height² ≈ 1 at t = 0 to 0 at t ≈ 0.1494. That is an average descent of 1/0.1494 ≈ 6.7 units of height² per unit of t, compared with the rate 2 that de Bruijn's general theorem guarantees (which alone gives only Λ ≤ 0.5).`,
      },
      {
        level: 'intermediate',
        heading: 'Barrier function, first contact, and output',
        paragraphs: [
          `Work with q = y² (squared height). A barrier is a function B(t) on [0, t_e], piecewise smooth with only upward jumps, such that every zero of H_t to the right of a head wall satisfies y² < B(t). It starts at q₀ = 1.000002 (just above 1, since all zeros have |y| < 1 at t = 0) or, using the Mossinghoff–Trudgian–Yang zero-free region, at q_MTY(x) = (1 − 2/(5.558691 ln(x/2)))² ≈ 0.9751 at the PT abscissa. It ends when B reaches q_e = 10⁻⁸; then de Bruijn's local contraction finishes in time q_e/2, giving Λ ≤ U = t_e + q_e/2.`,
          `First contact: suppose a zero first reaches y² = B(t) at time t. Its vertical velocity, from the zero-dynamics law, splits into near-field kernel terms (other zeros within a bounded distance, controlled by kernel inequalities proved with Bernstein certificates, exact positivity checks of polynomials) and a source term computed from the effective approximation. If that velocity points down more steeply than B′(t), contact is impossible. The certified source floors in each time cell set how steep B′ may be.`,
          `Head region: zeros below the barrier abscissa X are covered by RH verified to X/2 and by finite-head walls, vertical lines x = x_w where |H_t/B_t| > 3/4 is certified for all 0 ≤ y ≤ 1 and 0 ≤ t ≤ 41/250. No lane of truncation lengths and no t₀ + y₀²/2 term is used.`,
        ],
        math: [
          tex`y^2<B(t)\ \ \forall\ \text{zeros right of the head wall},\quad B(0)=q_0,\ \ B(t_e)=q_e=10^{-8}`,
          tex`\Lambda\le U=t_e+\tfrac{q_e}{2}`,
          tex`q_{\mathrm{MTY}}(x)=\left(1-\frac{2}{5.558691\,\ln(x/2)}\right)^2`,
        ],
        example: `At X = 6000000185827: q_MTY = 0.97511. Raymond's chain at PT height outputs U = 18674384228461/125000000000000 = 0.149395073827688, regenerated bit-identically by the project.`,
      },
      {
        level: 'advanced',
        heading: 'Project replays, levers and status',
        paragraphs: [
          `Source: Raymond, Zenodo 22867547 (main paper "correlated translated probes" plus Analytic Foundations Parts I–II). The source cost is evaluated jointly at two probe points x ± a (a = r·h, kernel parameter r), which is where the "joint floor" comes from. Guards in the assembler: strict entry at t = 0, U < 41/250, h·r < 2, 0 < rate·δ < 1, terminal time inside the last cell.`,
          `Project work on the architecture (all conditional): Track A added three surplus-pair families to the joint floor, 0.149395073827688 → 0.148963469500858 at PT height. Height contract: the same chain with floors at 2.6X gives 0.144960215684847, conditional on RH to T* = 7.80·10¹² (not verified). Two-band Lemma B with a FLINT-certified local RH window and structured floors (route P): certified-conditional 0.146660920737233, and 0.144797588795775 if the weak outer lemma (WOL-C) holds on 369 P47 floors. The end time U is computed from the floor tables by an exact-rational program (the multi-height consumer). Measured: Λ·ln T = 4.29–4.33 from X to 10X; 0.145 at fixed PT height on Raymond's schedule would need floors about 0.266 higher in every cell, more than the Kronecker floor (the limit for floors that treat prime phases as free) allows at early cells.`,
          `Referee status: three internal passes graded AF §§2–5, §§10–12 and Part II SOUND (no error); AF §§6–9 and main-paper Lemmas 2–4 have one internal re-derivation. The G0 gate (independent external referee) is open. Raymond's 0.149396 is an unrefereed preprint; the accepted bound is Platt–Trudgian Λ ≤ 0.2.`,
        ],
        math: [
          tex`U_{\text{Raymond}}=\tfrac{18674384228461}{125000000000000}=0.149395073827688`,
          tex`\Lambda\cdot\ln T\in[4.29,\,4.33]\quad(X\ \text{to}\ 10X)`,
        ],
        details: [
          `A band split at a single vertical wall is not enough: a band-2 zero within distance 1 can repel the band-1 top zero; Lemma B therefore puts a verified RH window between two walls.`,
          `The "barrier stays above model torus zeros" test is not a valid necessary condition: Raymond's own certified barrier sits below a model zero at t = 0.0875 (0.4766 vs 0.4887).`,
        ],
      },
    ],
    physicsAnalogy: {
      system: 'A piston lowered onto a layer of sinking particles, with a contact-free guarantee',
      mapping: [
        'Piston height² ↔ the barrier B(t); particles ↔ zeros; floor of the cylinder ↔ the real axis.',
        'Particle sinking speed near the piston ↔ the vertical velocity of a zero at first contact.',
        'Guaranteed minimum sinking from the background flow ↔ the source floor; contributions of nearby particles ↔ kernel terms.',
        'Inspected section of the cylinder with its own walls ↔ the verified head region and finite-head walls.',
      ],
      whereItBreaks: 'In a cylinder, particles below the piston do not care where it is; here the "contact" is purely logical (a proof by first time of failure), and the sinking speed comes from an interacting zero system plus an analytic approximation, certified cell by cell. There is no fluid and no force law beyond the velocity formula for zeros.',
    },
    examples: [
      { level: 'beginner', title: 'Average descent rate', text: `1/0.149395 ≈ 6.69 units of y² per unit of t, against de Bruijn's guaranteed 2.` },
      { level: 'intermediate', title: 'Height contract', text: `Floors at X′ = 15600000009475 (2.6X) give U = 0.144960216 with T* = (x_w + 1)/2 = 7.80000000474·10¹², which is 2.6 times the Platt–Trudgian height; conditional on RH to T* (not verified).` },
      { level: 'advanced', title: 'Log-height law check', text: `0.149395·ln(3.0001753·10¹²) = 0.149395·28.730 = 4.292. At 10X (T = 3·10¹³) the chain gives 0.139614 and 0.139614·31.03 ≈ 4.33.` },
    ],
    whyItMatters: `The decreasing barrier is the architecture behind every sub-0.15 value the project has studied: Raymond's preprint, Track A, the height contract, Lemma B bands and route P. It avoids the lane whose cost floors the fixed-t₀ barrier method near 0.145–0.150, and it reduces the problem to certifying source floors cell by cell. All values from it are conditional (Raymond's chain is not externally refereed; some floors need the weak outer lemma). Platt–Trudgian Λ ≤ 0.2 is the accepted benchmark; RH is open.`,
    example: { title: 'Value ladder at PT height', text: `Raymond 0.149395 → Track A 0.148963 → b145 stack 0.147274 → route P certified 0.146661 → route P with WOL-C 0.144798 (all conditional).`, source: 'src/data/r6-synthesis-2026-10-06.js' },
    pitfalls: [
      'Raymond 0.149396 is an unrefereed preprint, not an accepted bound; the project reproduced its numerics, it did not referee it externally.',
      'Values at 2.6X or 1.6X height need RH verified up to those heights, which has not been done.',
      'The barrier constrains squared height y², and ends at q_e = 10⁻⁸, not exactly at 0.',
    ],
    prerequisites: ['barrier-method', 'zero-dynamics', 'de-bruijn-newman-constant'],
    mentions: ['de-bruijn-newman-constant', 'heat-flow-ht', 'barrier-method', 'zero-dynamics', 'source-floor', 'bernstein-certificate', 'zero-free-region', 'platt-trudgian-verified-height', 'two-band-lemma-b', 'local-rh-window', 'structured-floor', 'weak-outer-lemma', 'route-p', 'multi-height-consumer', 'lambda-log-height-law', 'route-vii-lane', 'kronecker-floor'],
    furtherReading: [
      { label: 'PT floor audit', route: '/pt-floor-audit' },
      { label: 'Verified-height lever', route: '/verified-height-lever' },
      { label: 'Raymond deposit (Zenodo 22867547)', url: 'https://zenodo.org/records/22867547' },
    ],
    sources: [
      { label: 'Raymond height contract', path: 'src/data/s145-raymond-height-contract-2026-09-30.js' },
      { label: 'Raymond internal referee', path: 'src/data/b145-raymond-referee-2026-10-01.js' },
      { label: 'Track A floor', path: 'src/data/b145-floor-2026-10-01.js' },
      { label: 'r6 synthesis', path: 'src/data/r6-synthesis-2026-10-06.js' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────────────────────
  'source-floor': {
    intro: `A source floor is a certified lower bound, valid over one small time cell, for the part of a zero's downward motion that comes from the smooth "source" term of the heat-flowed function. In a decreasing-barrier proof the floors decide how fast the barrier may descend: higher floors give a faster descent and a smaller bound on Λ.`,
    levels: [
      {
        level: 'beginner',
        heading: 'A guaranteed minimum push',
        paragraphs: [
          `In the decreasing-barrier method, a ceiling over all zeros of H_t (the heat-flowed Riemann Ξ function) is lowered over time, and at each moment one shows that a zero touching the ceiling would be moving down faster than the ceiling. When the ceiling reaches the real axis at time U, all zeros are real and the de Bruijn–Newman constant satisfies Λ ≤ U.`,
          `A zero's downward speed at the ceiling has two parts: the influence of nearby zeros, and a smooth background term computed from an explicit approximating sum. The background term is called the source. It depends on unknown quantities (where exactly along the line the zero sits), so one cannot compute it exactly; one proves a lower bound valid for every possibility. That lower bound, valid over a short time window, is the source floor.`,
          `The project usually reports the complement, called the cost (a fixed reference value minus the floor): lower cost means a higher floor. If every floor were raised by the same small amount, the bound on Λ would drop by about 0.017 times that amount.`,
          `What this leaves out: the floor is not a single number but a table over about 600 time cells, several heights and several probe settings, and its validity rests on analytic lemmas from Raymond's chain and the project.`,
        ],
        analogy: `A sledge going downhill on a slope whose steepness varies in a way you cannot predict. You cannot know the exact speed, but if you can prove a minimum slope on each stretch, you know a minimum speed, and you can plan to be ahead of something chasing it.`,
        example: `Uniform-shift test on the structured-floor tables: lowering every floor by 0.02 raises the two-band value from 0.144505 to 0.144845, an increase of 0.00034, which is about 0.017 × 0.02.`,
      },
      {
        level: 'intermediate',
        heading: 'What is bounded',
        paragraphs: [
          `Near height x (the H_t coordinate, twice the zeta height) the approximation of H_t has a main sum over n ≤ N₀ with coefficients a_n(t) = exp(t·v(v − L)/4 − (1 + h)v/2), where v = log n, L = 2 log N₀ and h is the barrier height. Each term carries a phase n^{−ix/2}. The source cost J is the average of a quantity κ, built from the vertical log-derivative of the main sum, evaluated at two probe points x + a and x − a ("joint" floor); one-point floors use a single probe.`,
          `Because the phases depend on x, which ranges over a huge interval, a floor must hold for every x in the source domain [X − 2, ∞). The project bounds J from above by a function Φ of a few small-prime phases (other phases handled by worst-case arguments), and the floor is then fl = v₀/2 − (small certified terms) − sup Φ. The consumer program uses cost = ln(N₀)/2 − floor.`,
          `Floors can be raised by keeping more arithmetic structure: Track A added surplus-pair families (head, Euler product-tail and reflected labels), and the structured floors treat primes up to 47 exactly. The theoretical ceiling for phase-blind floors is the Kronecker floor.`,
        ],
        math: [
          tex`a_n(t)=\exp\!\left(\tfrac{t\,v(v-L)}{4}-\tfrac{(1+h)v}{2}\right),\quad v=\log n,\ L=2\log N_0`,
          tex`J=\tfrac12\big(\kappa(x+a)+\kappa(x-a)\big),\qquad \mathrm{cost}=\tfrac{\ln N_0}{2}-\ell`,
        ],
        example: `Costs at t = 0.075: Raymond's certified 0.8008, Track A 0.7495, Kronecker torus 0.5335 (float ascent). Track A's higher floors moved the PT-height output from 0.149395073827688 to 0.148963469500858.`,
      },
      {
        level: 'advanced',
        heading: 'Floor families and their status',
        paragraphs: [
          `Raymond's joint floor: certified in his deposit; regenerated by the project bit-identically. Track A (b145-floor): head labels 1025…N₀, Euler product-tail labels and reflected labels, certified in arb at 128/192/320 bit on 608 cells × 9 pair classes × 11 modes, using Lemma R (phase change of reflected labels) and the C_g monotonicity lemma, each refereed once internally. Structured floors (r2): primes in an adaptive prefix S = {p ≤ P} held at phase 0, rough labels by an exact Dirichlet-log recursion, tails and the reflected branch in interval arithmetic; validity needs the weak outer lemma (sup over prefix phases attained near 0).`,
          `Zero-conditioned floor: using H_t = 0 at the contact point as a constraint lowers the worst-case torus cost at t = 0.075 from 0.5335 to 0.4516 but moves Λ only by about −0.0008 to −0.0009 in the model; not pursued to a certificate.`,
          `Sensitivity (r2, exact consumer): a uniform floor loss δ raises the band value at 0.0166–0.0171 per unit, crossing 0.145 at δ ≈ 0.0292. Reaching 0.145 at PT height on Raymond's schedule would need about +0.266 in every cell, more than the gap to the Kronecker torus at early cells; hence the move to two-band and height levers.`,
        ],
        math: [
          tex`\frac{\partial U}{\partial\delta}\approx0.0166\text{–}0.0171\quad(\text{uniform floor loss }\delta)`,
        ],
        details: [
          `Floor validity (F) in Lemma B: every floor read by a band run is a valid lower bound for the probe average on its whole time cell whenever all probe points lie in [X − 2, ∞). Status: conditional input.`,
          `A slope-bug fix (r2 referee) lowered 1985 of 4474 stored floors by at most 3.29·10⁻⁴ and raised the band value by 6.8·10⁻⁷.`,
        ],
      },
    ],
    physicsAnalogy: {
      system: 'Minimum guaranteed restoring force from a fluctuating background field',
      mapping: [
        'Source term ↔ the force on a particle from a background field made of many oscillating components.',
        'Unknown phases ↔ the unknown instantaneous phases of those components.',
        'Source floor ↔ the minimum force over every phase combination allowed by the model, over a short time window.',
        'Cost = reference − floor ↔ how far the guaranteed force falls short of the ideal.',
      ],
      whereItBreaks: 'The "force" is a term in the velocity formula for zeros of an analytic function, not a physical force, and the floor is a proved inequality over a mathematically defined set of phases. Which phase combinations actually occur at real zeros is unknown; that is the gap the Kronecker floor and the zero-conditioned floor discuss.',
    },
    examples: [
      { level: 'beginner', title: 'Uniform shift', text: `−0.02 on every floor → +0.00034 on the bound (0.144505 → 0.144845).` },
      { level: 'intermediate', title: 'Track A ablation', text: `Raymond 0.149395 → +head 0.149193 → +tail 0.149131 → +reflected 0.148963.` },
      { level: 'advanced', title: 'Required uniform gain', text: `On Raymond's fixed schedule the output crosses 0.145 at a uniform shift of ≈ +0.265 (0.145003 at 0.265, 0.144931 at 0.27).` },
    ],
    whyItMatters: `Source floors are the quantities that a decreasing-barrier bound actually consumes; every improvement from 0.149395 (Raymond) toward 0.145 at PT height came from higher certified floors or from using them at larger heights. All resulting Λ values are conditional (Raymond's chain, internal lemmas, the weak outer lemma for structured floors). Platt–Trudgian Λ ≤ 0.2 stands; RH is open.`,
    example: { title: 'Cost gap at t = 0.075', text: `Certified 0.8008 (Raymond), 0.7495 (Track A); free-label relaxation ≥ 0.636 (ascent); Kronecker 0.5335; zero-conditioned model 0.4516.`, source: 'src/data/b145-floor-2026-10-01.js' },
    pitfalls: [
      '"Floor" and "cost" move in opposite directions: a higher floor is a lower cost.',
      'Float ascent values (Kronecker, free-label) are lower bounds on a supremum, not certified floors.',
      'A floor is valid only for probe points inside its source domain [X − 2, ∞); moving to a different height needs regenerated floors.',
    ],
    prerequisites: ['decreasing-zero-height-barrier', 'zero-dynamics'],
    mentions: ['decreasing-zero-height-barrier', 'heat-flow-ht', 'xi-function', 'de-bruijn-newman-constant', 'zero-dynamics', 'kronecker-floor', 'structured-floor', 'prefix-and-cell', 'weak-outer-lemma', 'zero-conditioned-floor', 'multi-height-consumer', 'two-band-lemma-b', 'arb-interval-certificate', 'euler-product'],
    furtherReading: [
      { label: 'PT floor audit', route: '/pt-floor-audit' },
      { label: 'Raymond deposit (Zenodo 22867547)', url: 'https://zenodo.org/records/22867547' },
    ],
    sources: [
      { label: 'Track A floor', path: 'src/data/b145-floor-2026-10-01.js' },
      { label: 'Structured floor', path: 'src/data/r2-structured-floor-2026-10-02.js' },
      { label: 'Zero-conditioned floor', path: 'src/data/s145-zero-conditioned-floor-2026-09-30.js' },
      { label: 'Weak outer lemma note §1', path: 'formalization/paper/outer-lemma-weak.md' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────────────────────
  'kronecker-floor': {
    intro: `The Kronecker floor is the best source floor obtainable when the phases attached to different primes are treated as completely independent angles. Kronecker's theorem says that, as the height varies, those angles come arbitrarily close to every combination, so a floor valid at all heights must survive the worst combination. It is a reference line: certified floors cannot beat it without using extra information about where zeros actually sit.`,
    levels: [
      {
        level: 'beginner',
        heading: 'Clocks that never repeat',
        paragraphs: [
          `Source floors are lower bounds on a smooth background term in the motion of zeros of H_t (the heat-flowed Riemann Ξ function); they control how fast a decreasing barrier may descend and so how small a bound on the de Bruijn–Newman constant Λ can be proved. The background term is a sum over whole numbers n, and each prime p contributes an angle that turns as the height x changes, at a speed proportional to log p.`,
          `Think of one clock per prime, each hand turning at its own speed log p. Because log 2, log 3, log 5, … have no rational relations, the hands never return to an earlier joint position, and over a long enough stretch of heights they pass arbitrarily close to every possible combination. That is Kronecker's theorem.`,
          `So a floor that must hold at every height has to hold for the worst arrangement of the hands. The Kronecker floor is the value of the background term at that worst arrangement. Any method that ignores how the hands are positioned at actual zeros cannot do better.`,
          `What this leaves out: the model is the leading-order term with finitely many primes treated as independent; the project's Kronecker numbers are floating-point maximisations (they are lower bounds on the true worst case, not certificates).`,
        ],
        analogy: `Two pendulums whose frequencies have an irrational ratio: plotted against each other, their positions trace a Lissajous figure that eventually fills the whole rectangle. Any statement "for all times" has to hold at every point of that rectangle.`,
        example: `cos(x·ln 2) + cos(x·ln 3) equals 2 at x = 0. It equals −1.90 at x ≈ 13.96, −1.99 at x ≈ 77.08 and −1.999997 at x ≈ 1627.11. It never equals −2 exactly (that would make ln 3/ln 2 rational) but gets as close as you like.`,
      },
      {
        level: 'intermediate',
        heading: 'The torus model',
        paragraphs: [
          `At height x the main sum of H_t has terms a_n(t)·n^{−ix/2}. For n = ∏ p^{e_p} the phase factorises: n^{−ix/2} = ∏ p^{−i e_p x/2}. Writing θ_p = −(x/2)·log p mod 2π, the sum is a function of the vector θ = (θ₂, θ₃, θ₅, …) on a torus. Since the log p are linearly independent over the rationals, the orbit {θ(x)} is dense in any finite-dimensional sub-torus (Kronecker–Weyl), so sup over x equals sup over θ.`,
          `The Kronecker floor at a cell is the floor computed with the source cost maximised over the whole torus. The project computes it by numerical ascent at leading order. Comparison at t = 0.075: Kronecker cost 0.5335, Raymond's certified 0.8008, Track A 0.7495. The structured floors (exact small-prime phases) close most of this gap: their certified cost stays 0.0049–0.0309 above Kronecker across 12 sample cells.`,
          `The zero-conditioned floor tries to go below the Kronecker floor by imposing H_t = 0 at the contact point (an S-procedure multiplier); in the model the cost at t = 0.075 falls to 0.4516, but the effect on Λ is only about −0.0008 to −0.0009.`,
        ],
        math: [
          tex`n^{-ix/2}=\prod_p e^{i e_p\theta_p},\qquad \theta_p\equiv-\tfrac{x}{2}\log p\pmod{2\pi}`,
          tex`\sup_{x\ \text{large}}\ (\cdot)=\sup_{\theta\in\mathbb T^{S}}(\cdot)\quad\text{(Kronecker–Weyl, finitely many primes)}`,
        ],
        example: `Replaying Raymond's fixed schedule with Kronecker floors gives about 0.14615 at PT height. Even a perfect phase-blind certificate stays above 0.145 there.`,
      },
      {
        level: 'advanced',
        heading: 'Role as a ceiling and the relaxation ladder',
        paragraphs: [
          `Any certificate that bounds the source cost uniformly over all phase vectors is bounded below (in cost) by the Kronecker value; to beat it one must use constraints that real zeros satisfy and generic torus points do not. The zero-conditioned study (s145) measured how much such a constraint can buy and found the gain is invisible to phase-decoupled certificates with ≤ 11 exactly coupled primes.`,
          `Relaxation ladder R_P (prime-rough cofactors given free phases): measured gaps against the conditioned ascent 0.4516 are 0.126 (P = 7), 0.098 (P = 31), 0.027 (P = 100), 0.0029 (P = 300), 10⁻⁵ (P = 1000). R_P is a genuine relaxation only for P < √N₀ ≈ 831, because 1009·1013 > N₀ = 690988, so R_1000 is the exact torus.`,
          `Torus obstruction: in the model the minimum over verified brackets of t + y²/2 at model zeros is 0.1451–0.1457 (repo value 0.1455). This is a heuristic statement about the model, not a lower bound on Λ.`,
        ],
        math: [
          tex`1009\cdot1013=1022117>N_0=690988,\qquad \sqrt{N_0}\approx831.3`,
        ],
        details: [
          `The earlier criterion "the barrier must stay above model torus zeros" was withdrawn: Raymond's certified barrier passes below a model zero at t = 0.0875 (0.4766 vs 0.4887) and t = 0.1 (0.4030 vs 0.4041).`,
          `Grades: Kronecker values are MEASURED (float ascent, leading-order model); none is a certified floor.`,
        ],
      },
    ],
    physicsAnalogy: {
      system: 'Quasi-periodic motion on a torus (incommensurate oscillators)',
      mapping: [
        'One oscillator per prime, frequency log p ↔ one angle θ_p per prime.',
        'Height x ↔ time; the trajectory winds densely around the torus.',
        'Worst-case floor ↔ the minimum of a quantity over the whole invariant torus, which the trajectory approaches arbitrarily closely.',
        'Conditioning on zeros ↔ restricting to a sub-manifold of the torus picked out by an extra equation.',
      ],
      whereItBreaks: 'There are infinitely many primes, so the full torus is infinite-dimensional and density holds only for finite sub-tori; the quantity is a ratio of sums, not an energy; and actual zeros are special points of the trajectory whose phase statistics are not known.',
    },
    examples: [
      { level: 'beginner', title: 'Two clocks', text: `cos(x ln 2) + cos(x ln 3) reaches −1.99 at x ≈ 77.08: phases 8.504 and 13.478 turns, so both hands are near half a turn.` },
      { level: 'intermediate', title: 'Cost comparison', text: `t = 0.075: Kronecker 0.5335 < Track A 0.7495 < Raymond 0.8008 (cost; lower is better).` },
      { level: 'advanced', title: 'Structured-floor gap', text: `At cell 350 the structured cost falls from 0.6539 (P = 5) to 0.5921 (P = 47), still 0.0308 above Kronecker 0.5613.` },
    ],
    whyItMatters: `The Kronecker floor tells the project how much a better certificate can possibly buy before new arithmetic information is needed. It showed that 0.145 at Platt–Trudgian height cannot be reached by floors alone on Raymond's schedule (Kronecker replay ≈ 0.14615), which is why the work moved to the two-band Lemma B and to height. All values are conditional or measured; Platt–Trudgian Λ ≤ 0.2 stands; RH is open.`,
    example: { title: 'Kronecker replay', text: `Raymond's fixed schedule with Kronecker floors: ≈ 0.14615 at PT height (model).`, source: 'src/data/b145-floor-2026-10-01.js' },
    pitfalls: [
      'Kronecker values are floating-point ascents; they bound the true worst case from below and are not certified.',
      'Density on the torus needs the log p to be rationally independent, which holds for distinct primes; it fails for composite n alone.',
      'Beating the Kronecker floor requires information specific to zeros; it is not a matter of tighter arithmetic.',
    ],
    prerequisites: ['source-floor'],
    mentions: ['source-floor', 'heat-flow-ht', 'xi-function', 'decreasing-zero-height-barrier', 'de-bruijn-newman-constant', 'prime-number', 'structured-floor', 'zero-conditioned-floor', 'two-band-lemma-b', 'platt-trudgian-verified-height'],
    furtherReading: [
      { label: 'PT floor audit', route: '/pt-floor-audit' },
    ],
    sources: [
      { label: 'Zero-conditioned floor', path: 'src/data/s145-zero-conditioned-floor-2026-09-30.js' },
      { label: 'Track A floor', path: 'src/data/b145-floor-2026-10-01.js' },
      { label: 'Structured floor', path: 'src/data/r2-structured-floor-2026-10-02.js' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────────────────────
  'structured-floor': {
    intro: `A structured floor is a source floor that keeps the exact arithmetic of the smallest primes instead of treating every prime's phase as a free unknown. Primes up to some P (between 5 and 47) are fixed at phase 0, the remaining terms are bounded rigorously by interval arithmetic, and a separate lemma (the weak outer lemma) is needed to justify that fixing the small-prime phases at 0 is the worst case.`,
    levels: [
      {
        level: 'beginner',
        heading: 'Track the big players exactly, bound the rest',
        paragraphs: [
          `Source floors are certified lower bounds on the smooth background push that drives zeros of H_t (the heat-flowed Riemann Ξ function) toward the real axis; in a decreasing-barrier proof they decide how small a bound on the de Bruijn–Newman constant Λ comes out. The background term is a sum over whole numbers, and its value depends on one angle per prime (see the Kronecker floor page: these angles behave like clocks that never repeat).`,
          `A simple certificate treats each prime's angle as unknown and takes the worst case for each separately. That loses accuracy, because the terms are linked: the number 6 = 2·3 has its angle fixed by the angles of 2 and 3. A structured floor keeps those links for the small primes (2, 3, 5, … up to P), which carry most of the weight, by computing with their angles set to 0, and bounds everything else with rigorous error bars.`,
          `Setting the small-prime angles to 0 is only valid if that is the worst setting (or within a stated tolerance of it). That claim is the weak outer lemma. Without it, structured floors are not proved valid.`,
          `What this leaves out: P is chosen separately for each entry of the floor table by a rule that keeps only primes whose contribution is favourable at angle 0; the tails above the truncation point, a "reflected" branch and a short time window are all bounded in interval arithmetic.`,
        ],
        analogy: `In a model of tides, you compute the few largest tidal components (Moon, Sun) exactly with their real phase relations and put an error bar on the hundreds of tiny ones, instead of treating every component as an independent unknown.`,
        example: `At one time cell (cell 350), the certified cost (lower is better) falls as more primes are kept exact: 0.6539 with P = 5, 0.6221 with P = 11, 0.5993 with P = 29, 0.5921 with P = 47. The Kronecker floor there is 0.5613.`,
      },
      {
        level: 'intermediate',
        heading: 'Construction',
        paragraphs: [
          `Each floor entry has a time cell, a height h, a probe displacement a and a prefix S = {p ≤ P}. The main sum is split by the small primes: c₁(θ) = Σ a_m z^m over S-smooth m (all prime factors in S), and for each "rough" label j (no factor in S) a sum over m ≤ N₀/j. The bound function Φ_E(θ_S; t, a) = K₀ + Σ_j |X̃_j| + extra is, for each fixed small-prime phase vector θ_S, an upper bound on the source cost over all other phases.`,
          `The stored value K₀*(E) is the interval enclosure of Φ_E at θ_S = 0, maximised over time sub-cells and a-pieces. The floor is fl(E) = v₀/2 − 10⁻⁶ − pert − K₀*(E) − D_slope − 10⁻¹² (with small relative pads). Adaptive prefix rule: take the largest P ≤ 47 such that every prime p ≤ P has cos(a·log p/2) ≥ 0.3; this decides S but does not by itself validate a floor.`,
          `Certification: 2074 adaptive and 326 sharp-window entries in arb at 128 bit with an outward-rounded complex-ball C engine, reproduced by an internal referee to within 2.1·10⁻¹⁵. One referee pass found and fixed a slope bug that lowered 1985 of 4474 floors by at most 3.29·10⁻⁴.`,
        ],
        math: [
          tex`\Phi_E(\theta_S;t,a)=K_0+\sum_j|\tilde X_j|+\text{extra}\ \ \ge\ \sup_{\text{other phases}}J`,
          tex`P(E)=\max\{P\le47:\ \cos(\tfrac a2\log p)\ge0.3\ \ \forall p\le P\}`,
        ],
        example: `Cell 0 has a = 1.0355. cos(a·ln p/2) = 0.936, 0.843, 0.672, 0.534, 0.323 for p = 2, 3, 5, 7, 11, then 0.240 for p = 13. So P = 11 there.`,
      },
      {
        level: 'advanced',
        heading: 'Values, conditions and the outer-lemma subtlety',
        paragraphs: [
          `With the b145 two-band stack, slope-fixed structured floors give Λ ≤ 36126446200683/250000000000000 = 0.144505784802732 at PT floor height (margin 4.94·10⁻⁴ below 0.145), conditional on the outer lemma (θ_S = 0 maximises Φ), the time-box zero-freeness step, Raymond's chain (G0), the multi-height consumer and the band inputs (Lemma B, FLINT window, MTY, H2). Without the band: 0.146147388063520. With the weak outer lemma at margin 0.02 and the lemma-free time-box allowance 0.0023: 0.1448843462793.`,
          `Necessity of the cos-positive rule: at cell 0 a prefix containing primes with cos < 0 (S up to 29 or 47) gives Φ(0) = 0.37547 or 0.3583, below the Kronecker ascent 0.37702, which is impossible for a sup; so θ_S = 0 is not the maximiser there.`,
          `Referee finding: a float ascent of the true relaxed J over all prime phases peaks slightly off θ_S = 0 (excess 2.2·10⁻⁴, 2.7·10⁻⁵, 10⁻⁶ at three entries), while Φ itself decreases away from 0 along those directions. So the outer lemma must be proved for Φ specifically; it cannot be inherited from J. Later rounds (route P) replaced the assumption by single-entry certificates where possible.`,
        ],
        math: [
          tex`\Lambda\le0.144505784802732\ \ (\text{band, conditional}),\qquad 0.146147388063520\ \ (\text{no band})`,
        ],
        details: [
          `Gap to Kronecker across 12 cells: 0.0049–0.0309; structured floors close 87.8–94.7% of the gap between Raymond's certificate and the Kronecker torus.`,
          `Grades (r2): floors CERTIFIED; every Λ value CONDITIONAL; Kronecker references MEASURED; the cos ≥ 0.3 rule HEURISTIC (it selects, it does not validate).`,
        ],
      },
    ],
    physicsAnalogy: {
      system: 'Resolved modes plus a bounded sub-grid model (as in spectral simulations)',
      mapping: [
        'Small primes p ≤ P ↔ low modes that are simulated exactly, with their true couplings.',
        'Rough labels, tails and reflected branch ↔ unresolved modes whose total effect is bounded, not modelled.',
        'Phase 0 for the resolved modes ↔ assuming the resolved modes are in the configuration that gives the largest load.',
        'Weak outer lemma ↔ the check that this configuration is in fact the worst one, within a tolerance.',
      ],
      whereItBreaks: 'In a physical simulation the sub-grid model is an approximation; here every unresolved contribution is bounded rigorously with outward rounding. And the "worst configuration" claim is a mathematical lemma that must be proved per entry, not a physical intuition about resonance.',
    },
    examples: [
      { level: 'beginner', title: 'Prefix ladder at cell 350', text: `Cost 0.6539 (P = 5) → 0.6094 (P = 17) → 0.5921 (P = 47); Kronecker 0.5613.` },
      { level: 'intermediate', title: 'Adaptive prefix at cell 0', text: `a = 1.0355: p = 11 gives cos = 0.323 ≥ 0.3; p = 13 gives 0.240 < 0.3, so P = 11.` },
      { level: 'advanced', title: 'Robustness', text: `A uniform loss δ in the structured floors raises the band value by 0.0166–0.0171 per unit; 0.145 is crossed at δ ≈ 0.0292.` },
    ],
    whyItMatters: `Structured floors are the floors route P uses at Platt–Trudgian height. They are what brings the conditional two-band value below 0.145 without new verified height. Their validity depends on the weak outer lemma, which is certified only for part of the entries (see that page). Platt–Trudgian Λ ≤ 0.2 is the accepted benchmark; every structured-floor value is conditional; RH is open.`,
    example: { title: 'Headline value', text: `Λ ≤ 0.144505784802732 at PT floor height with the two-band stack, conditional on the outer lemma and band inputs.`, source: 'src/data/r2-structured-floor-2026-10-02.js' },
    pitfalls: [
      'A structured floor computed at θ_S = 0 is not valid until the outer lemma is established for that entry.',
      'Adding more primes to the prefix is not always better: primes with negative cos(a log p/2) break the phase-0 maximisation.',
      'The cos ≥ 0.3 rule selects the prefix; it is not part of the proof.',
    ],
    prerequisites: ['source-floor', 'kronecker-floor', 'prefix-and-cell'],
    mentions: ['source-floor', 'heat-flow-ht', 'xi-function', 'decreasing-zero-height-barrier', 'de-bruijn-newman-constant', 'kronecker-floor', 'weak-outer-lemma', 'prefix-and-cell', 'interval-arithmetic', 'arb-interval-certificate', 'two-band-lemma-b', 'multi-height-consumer', 'route-p'],
    furtherReading: [
      { label: 'PT floor audit', route: '/pt-floor-audit' },
    ],
    sources: [
      { label: 'Structured floor', path: 'src/data/r2-structured-floor-2026-10-02.js' },
      { label: 'Weak outer lemma note', path: 'formalization/paper/outer-lemma-weak.md' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────────────────────
  'prefix-and-cell': {
    intro: `"Cell" and "prefix" are the two indices of a structured floor table. A cell is one short time interval of the decreasing-barrier path, with its own height and probe settings. Its prefix is the set of small primes, all primes up to some P between 5 and 47, whose phases are treated exactly in that cell.`,
    levels: [
      {
        level: 'beginner',
        heading: 'Time steps and tracked primes',
        paragraphs: [
          `A decreasing-barrier proof (a method for bounding the de Bruijn–Newman constant Λ by lowering a ceiling over the zeros of the heat-flowed function H_t) cannot be done in one piece. The time from 0 to about 0.15 is cut into roughly 600 short intervals called cells. In each cell the ceiling's height is nearly constant, and one certificate covers the whole cell.`,
          `In every cell the proof needs a source floor: a guaranteed minimum for the smooth push on zeros. That push is a sum over whole numbers whose behaviour depends on one angle per prime. The prefix of a cell is the list of small primes handled exactly (with their angles fixed at 0) rather than bounded crudely: for example {2, 3, 5, 7, 11}, called P = 11.`,
          `The prefix changes from cell to cell. Early cells use short prefixes, late cells use longer ones, up to all primes ≤ 47 ("P47").`,
          `What this leaves out: each cell has several entries (different height multipliers and probe modes), and each entry has its own prefix and its own certificate; "cell" is shorthand for that whole group.`,
        ],
        analogy: `A long numerical simulation run in time steps, where at each step you decide which of the lowest vibration modes of a structure to compute exactly and which to cover by an error bar. Different steps can resolve different numbers of modes.`,
        example: `On the route-P band path, 630 floor entries are used: 15 with P = 7 (cells 0–41), 70 with P = 11 (cells 8–82), … and 363 with P = 47 (cells 232–579).`,
      },
      {
        level: 'intermediate',
        heading: 'Entries, cells and prefixes in the tables',
        paragraphs: [
          `An entry E = (cell i, height multiplier κ ∈ {1, 0.94, 0.88}, mode) has a time cell [t_lo, t_hi] (row i of the barrier plan), a height h = κ·height_i, a displacement range for the two probes x ± a (a single point a = r·h for "cat" modes with kernel r, an interval from a certified contact window for "sharp" modes), and a prefix S = {p ≤ P}. Base tables use S = {2, 3, 5}; adaptive tables use P ≥ 7.`,
          `The prefix is chosen by the rule: the largest P ≤ 47 such that every prime p ≤ P satisfies cos(a·log p/2) ≥ 0.3. At phase 0 the two probes see prime p at angles ±a·log p/2; a positive cosine means that prime's factor is favourable at phase 0.`,
          `The time direction is handled exactly in the newer certificates: for n ≤ N₀, the coefficients a_n(t) decrease in t, so θ-uniform terms can be bounded by their value at the start of the cell.`,
        ],
        math: [
          tex`E=(i,\kappa,\text{mode}),\quad [t_{lo},t_{hi}],\quad h=\kappa\,h_i,\quad S=\{p\le P\},\ P\in\{5,7,\dots,47\}`,
          tex`a_n(t)=e^{\,t\,v(v-L)/4-(1+h)v/2},\ v<L\ \Rightarrow\ \partial_ta_n<0`,
        ],
        example: `Cell 0 (a = 1.0355): cos values 0.936, 0.843, 0.672, 0.534, 0.323 for p = 2…11 and 0.240 for p = 13, so P = 11.`,
      },
      {
        level: 'advanced',
        heading: 'Where the open cells are',
        paragraphs: [
          `Distribution on the route-P band path (630 entries, cells 0–579): P7 15 (cells 0–41), P11 70 (8–82), P13 74 (52–141), P17 22 (139–166), P19 34 (161–199), P23 39 (192–237), P29 8 (226–246), P31 5 (248–254), P47 363 (232–579; κ = 1: 31, 0.94: 155, 0.88: 177). The value 0.1448843462793 needs the weak outer lemma for exactly these entries; removing any entry changes the path chosen by the multi-height consumer (the exact-rational program that turns floor tables into a Λ value).`,
          `In the r6 round the certified path has 337 floors (272 with a certified WOL-C margin, 65 with a larger finite margin), and the hybrid path that would reach 0.144797588795775 has 635 floors of which 369, all P47 in cells 234–579, are not certified.`,
          `Methods scale differently with P: the three-angle Taylor-model box search certified S = {2, 3, 5} entries at about 46 CPU-minutes each, but fails for P = 13…47; the late P47 cells are where route P is blocked.`,
        ],
        math: [
          tex`\#\text{entries on path}=15+70+74+22+34+39+8+5+363=630`,
        ],
        details: [
          `Entries per prefix and cell ranges: formalization/paper/outer-lemma-weak.md §1.2. Certified/hybrid path counts: src/data/r6-synthesis-2026-10-06.js.`,
        ],
      },
    ],
    physicsAnalogy: {
      system: 'Time-stepped simulation with a per-step choice of resolved modes',
      mapping: [
        'Cell ↔ one time step of the simulation, certified as a whole.',
        'Prefix S = {p ≤ P} ↔ the set of resolved modes in that step.',
        'Height multiplier κ and probe mode ↔ different sensor placements within a step.',
        'Open P47 cells ↔ late steps where the resolved-mode check has not been completed.',
      ],
      whereItBreaks: 'A simulation step approximates; a cell certificate proves an inequality for every time inside the cell. Primes are not modes of a physical structure, and their "coupling" is multiplicative (through factorisation of integers), not mechanical.',
    },
    examples: [
      { level: 'beginner', title: 'Counting entries', text: `15 + 70 + 74 + 22 + 34 + 39 + 8 + 5 + 363 = 630 entries on the band path.` },
      { level: 'intermediate', title: 'Prefix at cell 0', text: `P = 11 because cos(1.0355·ln 13/2) = 0.240 < 0.3.` },
      { level: 'advanced', title: 'Uncertified block', text: `369 P47 floors in cells 234–579 separate the certified 0.146660920737233 from the conditional 0.144797588795775.` },
    ],
    whyItMatters: `Prefix and cell are the coordinates in which the project's open problem for route P is stated: which cells, at which prefix, still lack a certified weak-outer-lemma margin. All Λ values involved are conditional; Platt–Trudgian Λ ≤ 0.2 stands; RH is open.`,
    example: { title: 'Where route P is blocked', text: `All 369 uncertified floors are P47 entries in cells 234–579.`, source: 'src/data/r6-synthesis-2026-10-06.js' },
    pitfalls: [
      '"P47" is a prefix label (primes ≤ 47), not 47 primes; there are 15 primes ≤ 47.',
      'A cell is a time interval, not a height interval.',
    ],
    prerequisites: ['structured-floor', 'decreasing-zero-height-barrier'],
    mentions: ['decreasing-zero-height-barrier', 'de-bruijn-newman-constant', 'heat-flow-ht', 'source-floor', 'structured-floor', 'weak-outer-lemma', 'route-p', 'multi-height-consumer', 'prime-number'],
    furtherReading: [
      { label: 'PT floor audit', route: '/pt-floor-audit' },
    ],
    sources: [
      { label: 'Weak outer lemma note §1', path: 'formalization/paper/outer-lemma-weak.md' },
      { label: 'Structured floor', path: 'src/data/r2-structured-floor-2026-10-02.js' },
      { label: 'r6 synthesis', path: 'src/data/r6-synthesis-2026-10-06.js' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────────────────────
  'weak-outer-lemma': {
    intro: `The weak outer lemma (WOL-C) is the statement that, for each structured floor entry, the bound function is maximised, up to a tolerance of 0.0223, when the small-prime phases are all 0. It is what licenses computing structured floors at phase 0. It has been certified for many entries, measured to hold on all of them, and not proved for 369 late-cell entries.`,
    levels: [
      {
        level: 'beginner',
        heading: 'Is "all in step" really the worst case?',
        paragraphs: [
          `Structured floors are guaranteed minimum values for the smooth push on zeros of H_t (the heat-flowed Riemann Ξ function) in a decreasing-barrier bound on the de Bruijn–Newman constant Λ. To compute one, the project sets the angles of the small primes (2, 3, 5, … up to P) to 0 and bounds everything else rigorously.`,
          `That is only valid if angle 0 is the worst case for the quantity being bounded, or nearly so. The weak outer lemma says exactly this, with a stated tolerance: moving the small-prime angles away from 0 can never raise the bound by more than 0.0223. "Weak" refers to the tolerance: the strong form, with tolerance 0, would say angle 0 is exactly the maximum. The lemma is about the maximisation over the small-prime angles only; the maximisation over all other angles is already built into the bound function.`,
          `It is not obvious. Part of the bound gets smaller away from angle 0, but another part (terms divided by a quantity that shrinks away from 0) gets larger. The lemma has to show the first effect wins.`,
          `What this leaves out: the lemma is needed separately for each of several hundred table entries, and it is proved by computer-assisted search in interval arithmetic (Arb ball arithmetic and outward-rounded C code, where every number carries a guaranteed error bound), entry by entry.`,
        ],
        analogy: `Several speakers playing the same tone: the loudness at a point is largest when all are in phase. But if the room's absorption also changes with the phases, the loudest point could shift slightly. The lemma says the shift is less than a given tolerance.`,
        example: `For one entry (cell 0), the factor for prime 2 has size 1.43 at angle 0 and 0.76 at angle π. Terms divided by it roughly double at π, which is why angle 0 is not automatically the maximum.`,
      },
      {
        level: 'intermediate',
        heading: 'Exact statement',
        paragraphs: [
          `For an entry E with prefix S, let K^sup(E) be the supremum of the bound function Φ_E(θ_S; t, a) over all small-prime phases θ_S in the torus T^S, all t in the time cell and all a in the displacement range. Let K₀*(E) be the stored interval value at θ_S = 0. WOL-C is K^sup(E) ≤ K₀*(E) + 0.0223/(1 + 10⁻¹²).`,
          `Lemma 1 (proved): if WOL-C holds, the floor actually used by the consumer, floor_str − 0.0023 − 0.02, is at most the true floor computed with K^sup. The 0.0223 combines the weak margin 0.02 with a 0.0023 allowance for the time box; WOL-C as stated covers the whole time cell directly, so no separate time-box step is needed.`,
          `More generally, any certified margin m with K^sup ≤ K₀* + m gives a valid floor floor_str − m(1 + 10⁻¹²); entries with margins larger than 0.0223 are still usable, just with lower floors.`,
        ],
        math: [
          tex`\text{(WOL-C)}\qquad K^{\sup}(E)=\sup_{\theta_S\in\mathbb T^S,\ t,\ a}\Phi_E(\theta_S;t,a)\ \le\ K_0^*(E)+\frac{0.0223}{1+10^{-12}}`,
          tex`\Phi_E(-\theta_S)=\Phi_E(\theta_S)\quad\text{(symmetry, proved)}`,
        ],
        example: `Certified single entries (r3): four early route-P entries (P7, P11, cells 0–82) with margins 0.0137–0.0190, and five S = {2,3,5} entries with margins 0.0220–0.0223, about 46 CPU-minutes each.`,
      },
      {
        level: 'advanced',
        heading: 'Structure, certificates and the P47 obstruction',
        paragraphs: [
          `Proved structural facts: symmetry under θ_S ↦ −θ_S; an exact factorisation c₁(θ) = ∏_{q∈S} F_q(z_q)·(1 + D(θ)) giving K₀ = Σ_q sep_q(θ_q) + K₀_def; time monotonicity of a_n(t) for n ≤ N₀; and a large-label lemma: for rough labels j > N₀/2, w_j = a_j/c₁ exactly, so sup_θ |w_j| ≥ |w_j(0)| with strict inequality unless θ_S = 0 minimises |c₁|. Hence Φ is not a sum of terms each maximised at 0, and a term-by-term monotonicity proof cannot work.`,
          `Certificates: second-order Taylor models in the box-prime angles and in η_q = e^{iθ_q} − 1 for the other prefix primes, first order in t and a, with branch-and-bound over boxes. This works for S = {2,3,5} and P ≤ 11, and fails for P = 13…47. The r6 round admitted 337 certified floors (Λ ≤ 0.146660920737233, route P certified-conditional) and left 369 P47 floors in cells 234–579 open; with WOL-C assumed there, 0.144797588795775.`,
          `Measured: a targeted search on the 369 floors found no violation (max excess over Φ(0) 1.98·10⁻⁶; sup_found Φ − K₀* ≤ −0.00156 everywhere), so the obstruction is the looseness of the majorants, not Φ. A factorised-fiber engine was refuted by its referee (a tails defect). Scenario runs show route P reaches < 0.145 if late-cell margins ≤ about 0.050 (early cells at 0.0223) or ≤ 0.0436 uniformly; the best corrected late margin, 0.0533, gives 0.145017.`,
        ],
        math: [
          tex`c_1(\theta)=\prod_{q\in S}F_q(z_q)\,\big(1+D(\theta)\big),\qquad F_q(z)=\sum_{k:\,q^k\le N_0}a_{q^k}z^k`,
        ],
        details: [
          `Ledger grade (r6): WOL-C open; P47 search measured; 337 path floors certified; fiber engine refuted, not merged.`,
          `Do not infer WOL-C from the true relaxed cost J: a float ascent of J peaks slightly off θ_S = 0 (excess up to 2.2·10⁻⁴), while Φ decreases there.`,
        ],
      },
    ],
    physicsAnalogy: {
      system: 'Interference maximum with phase-dependent damping',
      mapping: [
        'Small-prime phases θ_S ↔ relative phases of a few coherent sources.',
        'K₀ part of Φ ↔ the interference term, largest when all sources are in phase.',
        'Large-label terms divided by |c₁| ↔ a damping or normalisation that weakens when the sources are in phase, partly offsetting the gain.',
        'WOL-C ↔ "the total peaks at zero phase, up to tolerance 0.0223".',
      ],
      whereItBreaks: 'Φ is an upper-bound function built for a proof, with absolute values and relaxations, not a measured intensity; its peak location is a property of that construction. The tolerance must be certified with outward-rounded arithmetic over a torus of up to 15 dimensions, which no physical measurement replaces.',
    },
    examples: [
      { level: 'beginner', title: 'Prime-2 factor', text: `|F₂| = 1.43 at θ₂ = 0 and 0.76 at θ₂ = π: a ratio of about 1.9.` },
      { level: 'intermediate', title: 'Certified margins', text: `0.0137–0.0190 (P7/P11 early cells) and 0.0220–0.0223 (S = {2,3,5}), all within 0.0223.` },
      { level: 'advanced', title: 'Scenario threshold', text: `Late-cell margin 0.050 with early 0.0223 → 0.144993 (below 0.145); late 0.0533 → 0.145017 (above).` },
    ],
    whyItMatters: `WOL-C is the single open input that separates route P's certified-conditional value 0.146660920737233 from its sub-0.145 conditional value 0.144797588795775 at Platt–Trudgian height. Settling it would not need new verified height, only tighter computer-assisted majorants on about 300 late cells and an independent referee. Both values remain conditional on Raymond's chain and the other ledger inputs; Platt–Trudgian Λ ≤ 0.2 is the accepted benchmark; RH is open.`,
    example: { title: 'What WOL-C is worth', text: `0.146660920737233 (337 certified floors) → 0.144797588795775 (plus WOL-C on 369 P47 floors).`, source: 'src/data/r6-synthesis-2026-10-06.js' },
    pitfalls: [
      '"Measured true with headroom 0.00156" is evidence, not a proof; the grade stays open.',
      'WOL-C is about the bound function Φ, not the underlying cost J; the two have different maximisers.',
      'A refuted engine (the fiber certificates) contributes nothing, even where its numbers looked favourable.',
    ],
    prerequisites: ['structured-floor', 'prefix-and-cell', 'arb-interval-certificate'],
    mentions: ['structured-floor', 'heat-flow-ht', 'xi-function', 'decreasing-zero-height-barrier', 'de-bruijn-newman-constant', 'source-floor', 'prefix-and-cell', 'route-p', 'arb-interval-certificate', 'interval-arithmetic', 'adversarial-referee', 'evidence-grades'],
    furtherReading: [
      { label: 'PT floor audit', route: '/pt-floor-audit' },
    ],
    sources: [
      { label: 'Weak outer lemma note', path: 'formalization/paper/outer-lemma-weak.md' },
      { label: 'r6 synthesis', path: 'src/data/r6-synthesis-2026-10-06.js' },
      { label: 'Structured floor (outer-lemma section)', path: 'src/data/r2-structured-floor-2026-10-02.js' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────────────────────
  'two-band-lemma-b': {
    intro: `The two-band argument (Lemma B) runs two separate decreasing barriers on two ranges of height, separated by a window in which every zero has been checked individually to lie on the line. Vertical walls at the edges keep zeros from crossing between ranges. The result is Λ ≤ max(U1, U2), the larger of the two barrier end times. The proofs are written and not externally refereed.`,
    levels: [
      {
        level: 'beginner',
        heading: 'Two compartments and an inspected gap',
        paragraphs: [
          `Background: a decreasing barrier proves an upper bound on the de Bruijn–Newman constant Λ by lowering a ceiling over the zeros of the heat-flowed function H_t until it reaches the real axis at time U; then Λ ≤ U. A single barrier must cover all heights at once.`,
          `Lemma B splits the zeros into a lower band (band 1) and an upper band (band 2). Each band gets its own barrier with its own end time, U1 and U2. Band 1 can start lower, because a known zero-free region for zeta limits how far its zeros can be from the line at bounded heights. Band 2 sits at larger height, where the source floors (guaranteed pushes on zeros) are better.`,
          `The danger is that a zero in one band disturbs a zero in the other. So the bands are separated by a window several thousand units wide in which every single zero has been verified to lie on the line (a local RH window), with "walls" at its edges where the function is certified nonzero. Zeros in the window are real and stay real; the two barriers are far enough apart that their mutual influence can be bounded.`,
          `What this leaves out: the window must be verified by a separate large computation; the gluing needs three written lemmas plus the two band barrier proofs; and every input (floors, walls, window software) carries its own status.`,
        ],
        analogy: `A ship with two flooded compartments and a dry, inspected compartment between them. Each flooded compartment is pumped out on its own schedule; watertight bulkheads (walls) and the dry compartment stop water moving between them. The ship is dry when the slower pump finishes.`,
        example: `Route P values: band 1 ends at U1 = 0.144797588795775 (conditional on WOL-C), band 2 at U2 = 0.144254643222956. The result is max(U1, U2) = U1 = 0.1447976.`,
      },
      {
        level: 'intermediate',
        heading: 'Geometry and the theorem',
        paragraphs: [
          `Use z = x + iy with x twice the zeta height. Three walls x_f < x_L < x_R: the head wall x_f (below it RH is verified), and the window walls x_L, x_R. Band 1 is the cell x_f < x < x_L, the window is x_L < x < x_R, band 2 is x > x_R (half-infinite). Each wall certificate states |H_t(x_w + iy)/B_t(x_w + iy)| > 3/4 for 0 ≤ y ≤ 1 and 0 ≤ t ≤ 41/250, so no zero lies on a wall.`,
          `Lemma B.1 (boundary): under the wall and strip hypotheses, H_t has no zero on the walls or on |y| = 1 for t ∈ [0, 41/250]. Lemma B.3 (real stays real): if every zero of H_{t₀} inside a walled cell is real, then so is every zero there for later t in range. Lemma B.2 (local strip contraction): de Bruijn's contraction holds inside a walled or half-infinite cell. Theorem B: walls (W), RH below the head wall (RH-head), RH in the window (RH-win), band barriers (BB1), (BB2) and the horizon U1, U2 < 41/250 imply all zeros of H_T real at T = max(U1, U2).`,
          `Band 1 starts from the Mossinghoff–Trudgian–Yang zero-free region, q₀ slightly above q_MTY(x_L) ≈ 0.9759, instead of q₀ = 1.000002; band 2 uses floors regenerated at the larger height.`,
        ],
        math: [
          tex`\text{(W)}\wedge\text{(RH-head)}\wedge\text{(RH-win)}\wedge\text{(BB1)}\wedge\text{(BB2)}\wedge(U_1,U_2<\tfrac{41}{250})\ \Longrightarrow\ \Lambda\le\max(U_1,U_2)`,
          tex`x_R-x_L=\tfrac{9065257}{1250}=7252.2056`,
        ],
        example: `Window at zeta height 7.8·10¹²: x_L/2 = 7800000001111.6172, x_R/2 = 7800000004737.72, width 3626.10. At density ln(T/2π)/2π ≈ 4.432 zeros per unit height this holds about 16,071 zeros, all verified on the line.`,
      },
      {
        level: 'advanced',
        heading: 'Why a window, status, and values',
        paragraphs: [
          `A band split at a single wall is insufficient: a band-2 zero within distance 1 can repel the band-1 top zero (pair contraction needs d² > b² − y²). The verified window removes near-field cross-band zeros; cross-band pairs are then at distance ≥ 7252, where the far-field kernel inequality (Lemma H2) is proved analytically for all 24 kernels in use (h ∈ [1/2, 5/2]) and checked in exact rational arithmetic.`,
          `Status (r2/r6 ledgers): B.1–B.3 and Theorem B written, not re-refereed as written; band barriers BB1/BB2 proved in §6.1 (Theorem BB, Lemma C, Lemma H2) with one adversarial internal pass; walls certified in two lanes (256/384 bit); RH-win certified conditional on FLINT 3.6.0's Platt/Turing lemmas (one-reader audit, wrap-around patch applied); RH-head given by Platt–Trudgian at PT floor height and open at 1.6X/1.7X.`,
          `Values: b145 PT band stack 0.147273668782792; floor height 1.7X 0.144867568901016 (needs RH to 5.10·10¹²); route P certified 0.146660920737233 and conditional 0.144797588795775 (WOL-C); Route H three-band at 1.6X 0.144951726247781 (needs RH to 4.80·10¹²). None is below 0.2 unconditionally.`,
        ],
        math: [
          tex`|d|\ge7252:\quad 2K_y(d,b)\ \ge\ \lambda\,\tfrac yh\,\tfrac{K_h(d+rh,b)+K_h(d-rh,b)}{2}\quad\text{(Lemma H2)}`,
        ],
        details: [
          `Window zeros: FLINT Platt isolation with Turing anchors, indices 33328427938874…33328427960538 (21,665 consecutive zeros), first and last outside the window by 111.70 and 1150.20.`,
          `Without the band at PT floor height the structured floors give 0.146147388063520; the band is what brings the value below 0.145 there.`,
        ],
      },
    ],
    physicsAnalogy: {
      system: 'Compartmented hull with watertight bulkheads and an inspected dry compartment',
      mapping: [
        'Band 1 and band 2 ↔ two flooded compartments, each with its own pump schedule (U1, U2).',
        'Walls x_f, x_L, x_R ↔ watertight bulkheads certified to hold for the whole operation.',
        'Local RH window ↔ the dry compartment between them, inspected item by item.',
        'Far-field inequality H2 ↔ the residual pressure transmitted across the thick dry compartment, bounded explicitly.',
        'Λ ≤ max(U1, U2) ↔ the ship is dry when the slower pump finishes.',
      ],
      whereItBreaks: 'Zeros interact at long range (a 1/distance velocity law), so the "bulkheads" alone do not isolate the bands; the separation distance and a proved far-field inequality are needed. Water does not change compartments by itself; zeros could, if a wall certificate failed.',
    },
    examples: [
      { level: 'beginner', title: 'max rule', text: `U1 = 0.1447976, U2 = 0.1442546, so Λ ≤ 0.1447976 (conditional).` },
      { level: 'intermediate', title: 'Zeros in the window', text: `3626.10 × 4.432 ≈ 16,071 zeros between x_L/2 and x_R/2.` },
      { level: 'advanced', title: 'Wall spacing', text: `x_R − x_L = 7252.2056 > 7252, the distance from which Lemma H2 is proved.` },
    ],
    whyItMatters: `Lemma B is how the project gets conditional values below 0.145 at Platt–Trudgian floor height: the band lets band 1 start from a zero-free region and band 2 use better floors at larger height. It also turns the open problem into explicit hypotheses with grades. Every value it produces is conditional; Platt–Trudgian Λ ≤ 0.2 is the accepted benchmark; RH is open.`,
    example: { title: 'With and without the band', text: `Structured floors at PT floor height: 0.146147388063520 without the band, 0.144505784802732 with it (both conditional).`, source: 'src/data/r2-structured-floor-2026-10-02.js' },
    pitfalls: [
      'The window is not "RH up to 7.8·10¹²"; it verifies only zeros between x_L/2 and x_R/2. Zeros between 3·10¹² and the window are handled by the band-1 barrier, not by verification.',
      'Two walls without verified RH between them do not replace the window (a referee point recorded in b145-stack).',
      'Written proofs that have not been refereed are graded "written, unrefereed", not proved.',
    ],
    prerequisites: ['decreasing-zero-height-barrier', 'local-rh-window', 'source-floor'],
    mentions: ['decreasing-zero-height-barrier', 'de-bruijn-newman-constant', 'heat-flow-ht', 'zero-free-region', 'source-floor', 'local-rh-window', 'platt-zero-isolation', 'turing-method', 'structured-floor', 'weak-outer-lemma', 'route-p', 'platt-trudgian-verified-height'],
    furtherReading: [
      { label: 'PT floor audit', route: '/pt-floor-audit' },
      { label: 'Verified-height lever', route: '/verified-height-lever' },
    ],
    sources: [
      { label: 'Lemma B note', path: 'formalization/paper/lemma-B-two-band.md' },
      { label: 'Lemma B status', path: 'src/data/r2-lemma-b-status-2026-10-02.js' },
      { label: 'b145 stack', path: 'src/data/b145-stack-2026-10-01.js' },
      { label: 'Band barriers (r3)', path: 'src/data/r3-bb-2026-10-03.js' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────────────────────
  'local-rh-window': {
    intro: `A local RH window is a finite stretch of heights, above the range where RH has been verified from the bottom up, inside which every zero of zeta has been individually checked to lie on the critical line. It is an island of verification. In this project such windows separate the two bands of the Lemma B argument.`,
    levels: [
      {
        level: 'beginner',
        heading: 'Checking one stretch of road',
        paragraphs: [
          `The Riemann Hypothesis (RH) says every nontrivial zero of the zeta function lies on the critical line. Computers have checked this for all zeros up to height about 3·10¹² (the Platt–Trudgian verified height). Checking always started at the bottom and went up.`,
          `A local RH window checks a single stretch higher up, for example the heights between 7,800,000,001,111.6 and 7,800,000,004,737.7, without checking anything below it. Inside the window every zero is located, counted, and shown to be on the line.`,
          `Counting is the key step. On the critical line zeta can be turned into a real-valued function Z(t) (Hardy's Z-function) whose sign changes mark zeros on the line. A separate formula says how many zeros there should be in total up to a height. If the number of sign changes found equals the number predicted, no zero can be hiding off the line. Turing's method makes this comparison rigorous.`,
          `What this leaves out: the count at the window's edges needs extra care (the "anchors"), the computation uses a large program whose error lemmas must themselves be correct, and the window says nothing about zeros outside it.`,
        ],
        analogy: `Surveying one section of a long pipeline: you inspect every joint between two marker posts and confirm the count of joints matches the construction drawings, without walking the rest of the line.`,
        example: `Small-scale version of counting: the formula N(T) ≈ (T/2π)·ln(T/2π) − T/2π + 7/8 gives 29.00 at T = 100, and Z(t) has exactly 29 sign changes for 0 < t ≤ 100 (the first at t ≈ 14.13, the 29th at t ≈ 98.83). Counts agree, so all 29 zeros are on the line.`,
      },
      {
        level: 'intermediate',
        heading: 'How the project window was produced',
        paragraphs: [
          `Method: Platt's FFT-based zero isolation as implemented in FLINT 3.6.0 (rigorous evaluation of Z on a grid with interval error bounds, then interpolation), with Turing's method to confirm completeness. Zero indices are fixed by Turing anchors, so the zeros found are known to be the n-th through m-th zeros of zeta for explicit n, m.`,
          `The 7.8·10¹² window used by Lemma B: three glued chunks, zero indices 33328427938874 to 33328427960538 (21,665 consecutive zeros, all on the line). A second FLINT entry point places the first of them at 7800000000999.9154… (111.70 below the window's lower end x_L/2) and the last at 7800000005887.9204… (1150.20 above the upper end x_R/2). By the index gluing lemma every zero with height in the window has an index in that range.`,
          `Inside the window itself, width 3626.10, the zero density ln(T/2π)/2π ≈ 4.432 per unit height predicts about 16,071 zeros, which is the count the r6 ledger records for the window.`,
        ],
        math: [
          tex`N(T)=\frac{T}{2\pi}\ln\frac{T}{2\pi}-\frac{T}{2\pi}+\frac78+S(T)+O(1/T)`,
          tex`\frac{1}{2\pi}\ln\frac{T}{2\pi}\Big|_{T=7.8\cdot10^{12}}\approx4.432`,
        ],
        example: `Window [x_L/2, x_R/2] = [7800000001111.6172, 7800000004737.72]: width 3626.10 × 4.432 ≈ 16,071 zeros.`,
      },
      {
        level: 'advanced',
        heading: 'Trust base and audit findings',
        paragraphs: [
          `The window is certified conditional on FLINT's Platt error lemmas and Turing bound. A single-reader audit of FLINT 3.6.0 found: an ERROR in Platt 2017 Lemma A.3 as printed (both terms a factor π low, inherited by acb_dirichlet_platt_c_bound; counterexample ratio 1.973 at σ = 3), harmless at the parameters used (corrected factor π/64 ≈ 0.049 < 1 at σ_interp = 25); a GAP in the convolution wrap-around (aliased table entries not bounded), closed by an 18-line patch; the window was rerun with the patch and reproduced. The Turing bound (b = 6), anchor logic and index gluing were found sound.`,
          `Role in Lemma B: hypothesis (RH-win), every zero with x_L/2 ≤ γ ≤ x_R/2 has β = 1/2. Simplicity of the zeros is also certified but not needed. Combined with walls at x_L and x_R it removes near-field cross-band zeros; the remaining cross-band interaction is at distance ≥ 7252 and is bounded by Lemma H2.`,
          `Cost: the verification pilot measured about 88 units of height per core-second, so a window of width 3626 costs on the order of a core-minute; the PT-scale extension of all heights to 4.8·10¹² is priced at 5.68·10⁶ core-hours.`,
        ],
        math: [
          tex`\text{(RH-win)}:\ \ \zeta(\beta+i\gamma)=0,\ \ \tfrac{x_L}{2}\le\gamma\le\tfrac{x_R}{2}\ \Longrightarrow\ \beta=\tfrac12`,
        ],
        details: [
          `A 1.65X window was also rerun with the patched driver: 42,429 indices, all 42,383 original indices present, no disagreement on doubly certified indices.`,
          `Grade: certified (computer-assisted), single-reader audit, no independent referee, nothing sent upstream.`,
        ],
      },
    ],
    physicsAnalogy: {
      system: 'Pipeline inspection between two marker posts with a counted-joints check',
      mapping: [
        'Zeros ↔ joints along the pipeline; on-line zeros ↔ joints in the expected position.',
        'Sign changes of Z(t) ↔ joints actually found by the inspection device.',
        'N(T) from the Riemann–von Mangoldt formula ↔ the number of joints on the construction drawing.',
        'Turing anchors ↔ marker posts with known joint numbers, so the inspected stretch is located exactly.',
      ],
      whereItBreaks: 'A pipeline drawing is exact; N(T) has a fluctuating term S(T) that is only controlled on average, which is what Turing\'s method handles. An off-line zero is not a misplaced joint but a pair of zeros missing from the line, detected only through the count.',
    },
    examples: [
      { level: 'beginner', title: 'Zeros below 100', text: `N(100) ≈ 29.00 by the formula; 29 sign changes of Z found.` },
      { level: 'intermediate', title: 'Window count', text: `21,665 consecutive zeros isolated; about 16,071 of them lie inside the window proper.` },
      { level: 'advanced', title: 'Audit factor', text: `Corrected Lemma A.3 bound = π((1 + σ²/t₀²)/2)^{(σ−1)/4} × FLINT's value; at σ = 25 this factor is about 0.049, so FLINT's printed bound still covers the true constant there.` },
    ],
    whyItMatters: `A local window lets the project use verified RH far above the Platt–Trudgian height without verifying everything below it. That is what makes the two-band Lemma B possible and gives conditional values below 0.145 at PT floor height. The window is a computer-assisted certificate resting on audited (single-reader) FLINT code. Platt–Trudgian Λ ≤ 0.2 is the accepted benchmark; RH is open.`,
    example: { title: 'Window at 7.8·10¹²', text: `Indices 33328427938874…33328427960538 (21,665 zeros), margins 111.70 and 1150.20 beyond the window ends.`, source: 'formalization/paper/lemma-B-two-band.md' },
    pitfalls: [
      'A window above the verified height does not extend the verified height; zeros between 3·10¹² and the window remain unverified.',
      'A computer-assisted window is only as reliable as the error lemmas in the software; the audit found a printed-constant error that happens to be harmless at the parameters used.',
      'Counting zeros on the line without a Turing-type completeness check does not exclude off-line zeros.',
    ],
    prerequisites: ['riemann-hypothesis', 'hardy-z-function', 'turing-method'],
    mentions: ['riemann-hypothesis', 'nontrivial-zeros', 'riemann-zeta-function', 'critical-line', 'platt-trudgian-verified-height', 'hardy-z-function', 'turing-method', 'zero-counting-function', 'platt-zero-isolation', 'two-band-lemma-b'],
    furtherReading: [
      { label: 'Verified-height lever', route: '/verified-height-lever' },
      { label: 'FLINT library', url: 'https://flintlib.org' },
    ],
    sources: [
      { label: 'Lemma B note (RH-win)', path: 'formalization/paper/lemma-B-two-band.md' },
      { label: 'FLINT audit', path: 'src/data/r2-flint-audit-2026-10-02.js' },
      { label: 'b145 stack', path: 'src/data/b145-stack-2026-10-01.js' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────────────────────
  'platt-trudgian-verified-height': {
    intro: `The Platt–Trudgian verified height is the height up to which every nontrivial zero of the zeta function has been proved to lie on the critical line: 3,000,175,332,800 (about 3·10¹²), published by Platt and Trudgian in 2021. It covers about 12.4 trillion zeros. It is the input that, through the barrier method, gives the accepted bound Λ ≤ 0.2.`,
    levels: [
      {
        level: 'beginner',
        heading: 'How far RH has been checked',
        paragraphs: [
          `The Riemann Hypothesis (RH) says all nontrivial zeros of the zeta function lie on the critical line Re(s) = 1/2. Zeros come with heights (their imaginary parts), starting at about 14.13, then 21.02, 25.01, and getting closer together as the height grows.`,
          `Since Riemann himself, people have checked the zeros one by one from the bottom. Platt and Trudgian (2021) proved, with rigorous computer arithmetic, that every zero up to height 3,000,175,332,800 is on the line. There are about 12,363,153,437,138 zeros below that height.`,
          `This does not prove RH: there are infinitely many zeros above. But the verified height is used as an ingredient in proofs of other statements. In particular it is the ingredient that limits upper bounds on the de Bruijn–Newman constant Λ (the heat-flow time after which all zeros are on the line).`,
          `What this leaves out: the check proves that no zero below the height is off the line; the method combines rigorous evaluation of zeta with a counting argument (Turing's method), and its reliability rests on the published error analysis and code.`,
        ],
        analogy: `A coastline surveyed from the harbour outward to a certain distance. Beyond the last survey marker nothing is known directly, but navigation charts (here: bounds on Λ) are drawn using the surveyed part.`,
        example: `Zero count from the formula N(T) ≈ (T/2π)·ln(T/2π) − T/2π + 7/8 at T = 3,000,175,332,800: T/2π ≈ 4.775·10¹¹, ln(T/2π) ≈ 26.89, so N ≈ 4.775·10¹¹ × 25.89 ≈ 1.2363·10¹³, matching the 12,363,153,437,138 zeros reproduced by the project's FLINT run.`,
      },
      {
        level: 'intermediate',
        heading: 'Method and use in Λ bounds',
        paragraphs: [
          `Platt's method evaluates Hardy's Z-function (a real function equal in size to zeta on the critical line) on a fine grid using an FFT-based multi-evaluation method in interval arithmetic, isolates each sign change, and uses Turing's method to prove the count of zeros found equals the true count N(T). Platt–Trudgian recorded about 7.5·10⁶ core-hours for the run.`,
          `In the barrier method (Polymath15 Theorem 1.2), hypothesis (i) needs RH (or a weaker zero-free strip) up to height X/2, where X is the barrier abscissa. With T_PT = 3000175332800 one can take X up to 2·T_PT; at X = 6000000185827, X/2 = 3000000092913.5 < T_PT. The resulting bound is Λ ≤ 0.2 (Platt–Trudgian) and, in the project's candidate, Λ ≤ 0.1758354 (unreviewed).`,
          `Empirically, barrier bounds behave like Λ ≈ c/ln T with c ≈ 4.29 on Raymond's chain: at T = 3·10¹², ln T = 28.73 and c/ln T = 0.1494. Doubling T lowers this by only about 0.0033.`,
        ],
        math: [
          tex`T_{PT}=3000175332800,\qquad N(T_{PT})=12{,}363{,}153{,}437{,}138`,
          tex`\frac{X}{2}=3000000092913.5\le T_{PT}\quad(X=6000000185827)`,
          tex`\Lambda_{\text{barrier}}\approx\frac{c}{\ln T},\quad c\approx4.29`,
        ],
        example: `Raymond's chain re-run with floors at 2× and 2.6× the height gives 0.146118 and 0.144960 (conditional on RH to those heights, not verified), against 0.149395 at T_PT.`,
      },
      {
        level: 'advanced',
        heading: 'Why the height binds, and what extending it costs',
        paragraphs: [
          `Project audit (pt-floor-audit): a diagnostic sensitivity audit asked which of three inputs binds the Λ ≤ 0.2 floor at the barrier operating point (verified height, barrier mesh slack, approximation tail) and found the verified height binds while the barrier slack does not. This is the verification-height wall. Bounds below 0.2 at the same height therefore come from changing other parameters or the architecture (the project's 0.1758354 candidate; the decreasing barrier), not from tightening the barrier check. Every sub-0.2 claim surveyed in the requirements map (Planat 0.177954, Kornaus 0.172422, Raymond v1 0.163297, Gordon 0.157657, Raymond v2 0.149396) uses the same PT height; the rigorous verified height has not moved since 2020.`,
          `Pricing (heuristic, scaled from PT's recorded core-hours by zero count): RH to 7.8·10¹² (Raymond-architecture contract 0.14496) costs about 1.27–1.65·10⁷ core-hours; RH to 4.8·10¹² (Route H three-band, 0.144951726247781) about 5.68·10⁶ core-hours, $0.11M–0.28M at $0.02–0.05 per core-hour. The fixed-t₀ Polymath15 architecture would need T ≈ 4.5·10¹⁴ for 0.145.`,
          `Open trust item recorded in the r6 ledger: the exposure of the PT Turing step to a Gram-block gap has not been determined by the project; the result is published and peer reviewed.`,
        ],
        math: [
          tex`\text{price}(T)\approx7.5\cdot10^6\,\kappa\,\frac{N(T)-N(T_{PT})}{N(T_{PT})}\ \text{core-hours},\ \ \kappa\in[1,1.3]`,
        ],
        details: [
          `Reference: D. J. Platt, T. S. Trudgian, The Riemann hypothesis is true up to 3·10¹², Bull. LMS 53 (2021) 792–797, doi:10.1112/blms.12460; arXiv:2004.09765.`,
          `The project's FLINT run reproduced N(3000175332800) = 12,363,153,437,138 with the wrap-fixed driver.`,
        ],
      },
    ],
    physicsAnalogy: {
      system: 'A surveyed baseline used to calibrate an instrument',
      mapping: [
        'Verified height ↔ length of the surveyed baseline.',
        'Λ upper bound ↔ the precision of the instrument calibrated on that baseline.',
        'Λ·ln T ≈ constant ↔ precision improving only logarithmically with baseline length.',
        'Core-hours to extend ↔ cost of surveying further.',
      ],
      whereItBreaks: 'A survey has measurement noise; the verification is an exact (computer-assisted) proof for every zero below the height, with no statistical error. And the logarithmic law is an empirical fit for barrier methods, not a physical law.',
    },
    examples: [
      { level: 'beginner', title: 'Zero count', text: `About 12.36 trillion zeros below 3,000,175,332,800, all on the line.` },
      { level: 'intermediate', title: 'Height margin in the candidate', text: `T_PT − X/2 = 175,239,886.5 for X = 6,000,000,185,827.` },
      { level: 'advanced', title: 'Height lever arithmetic', text: `4.292/ln(3.0·10¹²) = 0.1494; 4.292/ln(6.0·10¹²) = 0.1459 (prediction); measured 0.146118 at 2X.` },
    ],
    whyItMatters: `Every Λ upper bound in use, accepted or candidate, is built on this height. It is why Platt–Trudgian could improve Polymath15's 0.22 to 0.2, and why the project prices further progress in core-hours. Platt–Trudgian Λ ≤ 0.2 is the accepted benchmark; the project's 0.1758354 is an unreviewed computer-assisted candidate; RH is open.`,
    example: { title: 'Height and bound', text: `T_PT = 3000175332800 → Platt–Trudgian Λ ≤ 0.2 (accepted); same height → project candidate Λ ≤ 0.1758354 (unreviewed).`, source: 'src/data/rh-landscape-dag.js' },
    pitfalls: [
      'Verification to a height says nothing about zeros above it.',
      'Unrefereed verifications to larger heights exist in the literature but are not used as inputs by the accepted bounds.',
      'In H_t coordinates the barrier sits at x ≈ 2T (x = 2γ); mixing x and γ doubles or halves heights.',
    ],
    prerequisites: ['riemann-hypothesis', 'turing-method', 'hardy-z-function'],
    mentions: ['riemann-hypothesis', 'nontrivial-zeros', 'riemann-zeta-function', 'critical-line', 'de-bruijn-newman-constant', 'turing-method', 'hardy-z-function', 'zero-counting-function', 'platt-zero-isolation', 'barrier-method', 'project-lambda-candidate', 'lambda-log-height-law', 'verified-height-lever', 'verification-height-wall', 'decreasing-zero-height-barrier', 'interval-arithmetic'],
    furtherReading: [
      { label: 'Verified-height lever', route: '/verified-height-lever' },
      { label: 'PT floor audit', route: '/pt-floor-audit' },
      { label: 'Platt–Trudgian, Bull. LMS 2021', url: 'https://doi.org/10.1112/blms.12460' },
    ],
    sources: [
      { label: 'RH landscape DAG', path: 'src/data/rh-landscape-dag.js' },
      { label: 'Requirements map (pricing, literature)', path: 'src/data/s145-requirements-map-2026-09-30.js' },
      { label: 'FLINT audit (N(T_PT) reproduction)', path: 'src/data/r2-flint-audit-2026-10-02.js' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────────────────────
  'project-lambda-candidate': {
    intro: `The project's Λ ≤ 0.1758354 is an upper bound on the de Bruijn–Newman constant obtained by the Polymath15 barrier method with new parameters and four computer-certified gates. Every numerical inequality in it is checked in interval arithmetic or exact rational arithmetic. It is a computer-assisted candidate: unreviewed and unpublished, and not an accepted bound.`,
    levels: [
      {
        level: 'beginner',
        heading: 'A bound built from four checked parts',
        paragraphs: [
          `The de Bruijn–Newman constant Λ is the heat-flow time after which every zero of the deformed Riemann Ξ function is on the real axis; RH says Λ ≤ 0. The accepted upper bound is Λ ≤ 0.2 (Platt–Trudgian, 2021). The barrier method gives bounds of the form Λ ≤ t₀ + y₀²/2 once a computer has certified a few regions free of zeros.`,
          `The project chose t₀ = 0.1583 and y₀² = 0.0350708, so t₀ + y₀²/2 = 0.1758354, and certified the four parts the method needs: a finite "lane" of approximation checks, a tail beyond it, the barrier strip, and a "y-transfer" step that extends a check made at one height to all heights in a box.`,
          `Each part was computed with interval arithmetic (every number is an interval guaranteed to contain the true value), and an assembly script checks that all the pieces fit together with exact fractions. An internal audit found no gap. But no independent expert has reviewed it and it has not been published, so it is called a candidate.`,
          `What this leaves out: the argument also relies on theorems from the Polymath15 paper and on the Platt–Trudgian verification; some analytic steps (the y-transfer theorems) await human sign-off.`,
        ],
        analogy: `A structure rated for a load after four components were each tested with measured margins, and the margins were added up against the error allowances. The builder's own inspectors have signed off; the external authority has not.`,
        example: `0.1583 + 0.0350708 ÷ 2 = 0.1583 + 0.0175354 = 0.1758354. As exact fractions: 1583/10000 + 87677/5000000 = 879177/5000000.`,
      },
      {
        level: 'intermediate',
        heading: 'Parameters and gates',
        paragraphs: [
          `Row: t₀ = 1583/10000, y₀² = 87677/2500000 (y₀ ≈ 0.18727), X = 6000000185827. Height hypothesis: X/2 = 3000000092913.5 < T_PT = 3000175332800. Strip condition: y₀² < 1 − 2t₀ = 3417/5000.`,
          `Gates (Arb ball arithmetic): finite lane over truncation lengths N = 690988…6000000 (5,309,013 rows, 0 undecided, minimum margin 1.872347259·10⁻³); tail beyond N₁ = 6·10⁶ (38/38 checks at 256 and 512 bit, D ≤ 0.880148631881 < 1); barrier box [X, X + 1] × [0.1809, 1] × [0, 129/800] (883 closed time prisms), which contains the region needed at t₀; y-transfer excision budget B ≤ 2.495763535·10⁻⁴ (two full runs).`,
          `Error cap: the Polymath15 Thm 1.3 approximation error is bounded by ε_cap ≤ 2.668232·10⁻⁷ uniformly on the lane. The tightened gate is L12_min − B_max − ε_cap = 1.622504·10⁻³ > 0, about 6000 times ε_cap, recomputed from the logs by a fail-closed assembly script with 16 SHA-256-pinned inputs.`,
        ],
        math: [
          tex`t_0+\tfrac12y_0^2=\tfrac{1583}{10000}+\tfrac{87677}{5000000}=\tfrac{879177}{5000000}=0.1758354`,
          tex`L_{12,\min}-B_{\max}-\varepsilon_{\mathrm{cap}}=1.622504\cdot10^{-3}>0`,
        ],
        example: `Gate arithmetic: 1.872347·10⁻³ (lane minimum) − 2.4958·10⁻⁴ (y-transfer budget) − 2.7·10⁻⁷ (ε_cap) ≈ 1.6225·10⁻³.`,
      },
      {
        level: 'advanced',
        heading: 'Audit status and dependencies',
        paragraphs: [
          `Composition audit (dag3, two adversarial internal passes): exact-rational row checks; barrier interface (P15 Thm 1.2 hypothesis iii) holds by containment, no monotonicity in t needed; lane inputs equal (t₀, y₀²) exactly; binding rows reproduced bit-identically on all three shards with a fresh build. Verdict: composition closes, no parameter mismatch or math gap found.`,
          `Conditional on: Polymath15 Thms 1.2/1.3 and Prop. 6.6 as cited; Platt–Trudgian Theorem 1; inherited analytic residuals of the barrier (B_t ≠ 0 on ℝ; the t → 0 limit in Lemma 8.4/Thm 1.3); human sign-off on the y-transfer Theorems B/C and Lemmas B1–B4; sign-off on the general-weight native binding note. Lean covers the y-transfer reduction logic and Lemma B3 (Dini gate), with numerical gates entering as hypotheses.`,
          `Relation to other values: Raymond's preprint 0.149396 and the project's route-P values (0.14666 certified-conditional, 0.14480 with WOL-C) are lower but depend on a different, unrefereed analytic chain (the decreasing barrier, which lowers a ceiling on zero heights from t = 0 instead of using t₀ + y₀²/2). None of these displaces Platt–Trudgian 0.2.`,
        ],
        math: [
          tex`y_0^2=\tfrac{87677}{2500000}<1-2t_0=\tfrac{3417}{5000}`,
        ],
        details: [
          `Package ~/dbn-lambda-01758354-candidate SHA256SUMS 30/30 OK; replay and referee checklist under formalization/review-packet-01758354/.`,
          `The two full y-transfer runs differ by 5.415·10⁻⁹ (per-thread accumulation order under ball rounding); both are upper bounds and the larger is used.`,
        ],
      },
    ],
    physicsAnalogy: {
      system: 'Load rating of a structure from component tests and error allowances',
      mapping: [
        'Four gates ↔ four component tests (lane, tail, barrier, y-transfer).',
        'Lane minimum margin 1.87·10⁻³ ↔ the weakest component\'s measured reserve.',
        'ε_cap and y-transfer budget ↔ allowances for model error and for extrapolating a test to untested conditions.',
        'Gate margin 1.62·10⁻³ > 0 ↔ positive reserve after all allowances.',
        '"Candidate, unreviewed" ↔ signed off by in-house inspectors, not yet by the certifying authority.',
      ],
      whereItBreaks: 'Engineering reserves cover statistical variation in loads and materials; here the margins are exact inequalities and the residual risk is in the mathematical reduction and the software, not in variation. A positive margin proves the inequality only if the code computes what the reduction says it computes.',
    },
    examples: [
      { level: 'beginner', title: 'Row arithmetic', text: `0.1583 + 0.0175354 = 0.1758354.` },
      { level: 'intermediate', title: 'Lane size', text: `6000000 − 690988 + 1 = 5,309,013 rows, all decided.` },
      { level: 'advanced', title: 'Safety factor', text: `1.622504·10⁻³ / 2.668232·10⁻⁷ ≈ 6081: the final margin is about 6000 times the approximation error cap.` },
    ],
    whyItMatters: `This is the project's main fixed-t₀ result and the one with every numerical gate certified in ball arithmetic. It would improve the accepted bound from 0.2 to 0.1758354 if it survives external review. Until then: Platt–Trudgian Λ ≤ 0.2 is the accepted benchmark; Λ ≤ 0.1758354 is a computer-assisted candidate, unreviewed and unpublished; RH is open.`,
    example: { title: 'Exact row', text: `t₀ + y₀²/2 = 879177/5000000 = 0.1758354; tightened gate margin 1.622504·10⁻³.`, source: 'src/data/dag3-audit01758-2026-09-28.js' },
    pitfalls: [
      'Do not quote 0.1758354 as the current bound on Λ; the accepted bound is 0.2.',
      '"All gates certified" means the inequalities were checked in interval arithmetic; it does not mean the proof has been refereed.',
      'Lower project numbers (0.149, 0.145) come from a different architecture with more conditions; they do not supersede this candidate\'s status.',
    ],
    prerequisites: ['barrier-method', 'de-bruijn-newman-constant', 'arb-interval-certificate'],
    mentions: ['de-bruijn-newman-constant', 'xi-function', 'heat-flow-ht', 'barrier-method', 'route-vii-lane', 'y-transfer', 'effective-error-cap', 'interval-arithmetic', 'arb-interval-certificate', 'platt-trudgian-verified-height', 'lean-formalization', 'replay-packet', 'adversarial-referee', 'decreasing-zero-height-barrier', 'route-p'],
    furtherReading: [
      { label: 'Λ ≤ 0.1758354 candidate', route: '/lambda-01758354-candidate' },
      { label: 'Λ bounds', route: '/lambda-bounds' },
    ],
    sources: [
      { label: 'Composition audit', path: 'src/data/dag3-audit01758-2026-09-28.js' },
      { label: 'Referee checklist', path: 'formalization/review-packet-01758354/REFEREE_CHECKLIST.md' },
      { label: 'RH landscape DAG (status wording)', path: 'src/data/rh-landscape-dag.js' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────────────────────
  'arb-interval-certificate': {
    intro: `An Arb interval certificate is a proof step in which a computer checks an inequality using ball arithmetic: every number is stored as a midpoint with an error radius that is guaranteed to contain the true value. If the computed ball lies entirely on the right side of the inequality, the inequality is proved, assuming the software is correct. This is different from ordinary floating-point evidence, which gives no such guarantee.`,
    levels: [
      {
        level: 'beginner',
        heading: 'Numbers with guaranteed error bars',
        paragraphs: [
          `Ordinary computer arithmetic rounds every result to about 16 significant digits and does not record how much was lost. After millions of operations the answer can be wrong in ways the program does not notice. That is fine for experiments but not for proofs.`,
          `Ball arithmetic stores each number as a pair: a midpoint and a radius, written m ± r, meaning "the true value is somewhere in [m − r, m + r]". Every operation computes a new midpoint and a new radius large enough to cover all possibilities, including the rounding error of the operation itself (rounding is always done outward). Arb is a widely used library that does this; it is now part of FLINT.`,
          `To prove that some quantity is positive, compute it as a ball. If the whole ball is above zero, the quantity is positive. If the ball straddles zero, the computation proves nothing and must be refined (more precision, smaller pieces) or reported as undecided.`,
          `What this leaves out: the guarantee holds only if the library and the program are correct and if the program computes what the mathematical argument needs (for example, a true upper bound of a function, not an approximation of it).`,
        ],
        analogy: `Engineering tolerances: a part is 1.5 ± 0.1 cm and another is 2.0 ± 0.1 cm. Stacked end to end the total is 3.5 ± 0.2 cm, and you can guarantee it fits a 3.8 cm slot without measuring further.`,
        example: `(1.5 ± 0.1) × (2 ± 0.1): the true product lies in [1.4 × 1.9, 1.6 × 2.1] = [2.66, 3.36]. Ball arithmetic returns 3 ± (1.5·0.1 + 2·0.1 + 0.1·0.1) = 3 ± 0.36, i.e. [2.64, 3.36], which contains it. So "the product is > 2.5" is proved; "the product is > 3" is undecided.`,
      },
      {
        level: 'intermediate',
        heading: 'From balls to certificates',
        paragraphs: [
          `Arb (Johansson) implements real and complex balls with arbitrary-precision midpoints, elementary and special functions (gamma, digamma, zeta), and polynomial and matrix operations, each returning a ball proved to contain the exact result. python-flint exposes it to Python. The project also uses outward-rounded C engines where Arb would be too slow, with rounding errors folded into the radius.`,
          `A certificate typically has three layers: (1) a mathematical reduction of the target inequality to finitely many checks (for example, splitting a time interval into prisms and bounding the derivative inside each); (2) the checks, run in ball arithmetic, each fail-closed (an undecided ball counts as failure); (3) an assembly step combining the margins in exact rational arithmetic, with hashed inputs so a referee can replay it.`,
          `Grade vocabulary used by the project: PROVED (a complete argument), CERTIFIED (computer-assisted with outward rounding), CONDITIONAL, MEASURED (floating point or sampling), HEURISTIC. Only the first two are proofs.`,
        ],
        math: [
          tex`x\in[m-r,\,m+r]\ \text{written}\ m\pm r;\qquad (m_1\pm r_1)(m_2\pm r_2)\subseteq m_1m_2\pm\big(|m_1|r_2+|m_2|r_1+r_1r_2+\epsilon_{\text{round}}\big)`,
        ],
        example: `Project candidate lane: 5,309,013 rows checked in Arb, 0 undecided, smallest margin 1.872347259·10⁻³; final gate 1.622504·10⁻³ > 0 combined in exact rationals.`,
      },
      {
        level: 'advanced',
        heading: 'What a certificate does and does not establish',
        paragraphs: [
          `Example of a full certificate (ARB-LEGE, Route I): for pole-free test functions h of support width 2a ≤ ln 3, the one-prime Weil functional satisfies W(h) ≥ 8.2045368·10⁻⁴ ‖h‖², with Galerkin matrix entries computed by Gauss–Legendre quadrature in Arb (256 bit) and the quadrature error bounded by a rigorous Trefethen-type estimate. Two internal adversarial passes found one quadrature constant to correct, conclusion unchanged; not externally refereed.`,
          `Failure modes the project has met: (1) software lemmas: a single-reader audit of FLINT 3.6.0's Platt zero-isolation found a printed constant a factor π low (harmless at the parameters used) and an unbounded wrap-around term (closed by a patch); (2) majorant defects: the r6 factorised-fiber WOL-C engine produced certified-looking margins but omitted a term (tails_defect), so its outputs were not upper bounds and were rejected; (3) wiring bugs: a slope check used the wrong sub-cell norm, caught by a referee and fixed. In each case the arithmetic was rigorous and the error was in what was computed.`,
          `So a certificate is a proof of the inequality the code encodes. Whether that is the inequality the argument needs is a mathematical question for referees, supported by replay packets, second implementations and Lean formalisation of the reduction logic where available.`,
        ],
        math: [
          tex`W(h)=\frac1{2\pi}\int w(t)\,|\hat h(t)|^2\,dt\ \ge\ 8.2045368\cdot10^{-4}\,\|h\|^2\quad(2a\le\ln3,\ \hat h(\pm i/2)=0)`,
        ],
        details: [
          `Reference implementation: Arb/FLINT (https://flintlib.org); python-flint 0.8–0.9 used in the project.`,
          `IEEE-754 double results, floating-point ascents and sampling are graded MEASURED in the project and never enter a certified value.`,
        ],
      },
    ],
    physicsAnalogy: {
      system: 'Measurement with worst-case tolerance stack-up',
      mapping: [
        'Ball m ± r ↔ a dimension with a guaranteed tolerance.',
        'Outward rounding ↔ always rounding tolerances up, never down.',
        'Inequality decided when the ball clears zero ↔ a part guaranteed to fit when the worst-case stack clears the slot.',
        'Undecided ball ↔ a tolerance stack that overlaps the limit: measure more precisely or split the part.',
      ],
      whereItBreaks: 'Physical tolerances are themselves measured and statistical; ball radii are mathematical bounds with no probability attached. And a tolerance stack cannot detect that you measured the wrong part; a certificate likewise cannot detect that it bounds the wrong quantity.',
    },
    examples: [
      { level: 'beginner', title: 'Tolerance product', text: `(1.5 ± 0.1)(2 ± 0.1) = 3 ± 0.36: proves > 2.5, leaves > 3 undecided.` },
      { level: 'intermediate', title: 'Candidate gate', text: `1.872347·10⁻³ − 2.4958·10⁻⁴ − 2.7·10⁻⁷ ≈ 1.6225·10⁻³ > 0.` },
      { level: 'advanced', title: 'Positivity floor', text: `ARB-LEGE: W(h) ≥ 8.2045·10⁻⁴‖h‖² gives λ₁(T_a[σ₂]) ≥ 8.2045·10⁻⁴ × 71.01967 = 0.058268 > 0 for every 2a ≤ ln 3.` },
    ],
    whyItMatters: `Every certified number in the project's Λ work (candidate gates, source floors, walls, WOL-C margins) and in the Route I Weil-positivity certificates is an Arb or outward-rounded ball computation. The grade "certified" means exactly this. It makes results replayable and checkable, but it is not peer review: Platt–Trudgian Λ ≤ 0.2 remains the accepted bound, the 0.1758354 candidate is unreviewed, and RH is open.`,
    example: { title: 'Lane certificate', text: `5,309,013 rows, 0 undecided, minimum 1.872347259·10⁻³ (Arb, triangle-weight build reproduced bit-identically on binding rows).`, source: 'src/data/dag3-audit01758-2026-09-28.js' },
    pitfalls: [
      'Floating-point agreement to many digits is evidence, not a certificate.',
      'A certified computation of the wrong quantity proves nothing about the right one (the refuted fiber engine).',
      'Intervals overestimate; an undecided result does not mean the inequality is false.',
    ],
    prerequisites: ['interval-arithmetic', 'ieee-754-double'],
    mentions: ['interval-arithmetic', 'ieee-754-double', 'evidence-grades', 'replay-packet', 'lean-formalization', 'project-lambda-candidate', 'weil-positivity', 'pole-free-test-function', 'arb-lege-certificate', 'route-i-weil-ladder', 'platt-zero-isolation', 'weak-outer-lemma', 'adversarial-referee', 'source-floor'],
    furtherReading: [
      { label: 'Rigorous numerics stages', route: '/rigorous-numerics-stages' },
      { label: 'FLINT / Arb', url: 'https://flintlib.org' },
    ],
    sources: [
      { label: 'ARB-LEGE module', path: 'src/data/tlb-arb-lege-2026-09-28.js' },
      { label: 'Candidate composition audit', path: 'src/data/dag3-audit01758-2026-09-28.js' },
      { label: 'FLINT audit', path: 'src/data/r2-flint-audit-2026-10-02.js' },
      { label: 'r6 synthesis (fiber refutation)', path: 'src/data/r6-synthesis-2026-10-06.js' },
    ],
  },
};

export const classExpositions = {
  'heat-flow-and-dbn': {
    intro: `This class collects the ideas around deforming the Riemann Ξ function by the heat equation. The deformation produces a family H_t; its zeros move as t changes; and the first time at which they are all real is the de Bruijn–Newman constant Λ. RH is equivalent to Λ = 0 (given Rodgers–Tao's Λ ≥ 0); the accepted upper bound is Λ ≤ 0.2 (Platt–Trudgian).`,
    membersOverview: [
      { group: 'The constant and its history', members: ['de-bruijn-newman-constant', 'heat-flow-ht', 'newman-conjecture', 'lambda-upper-bound-ladder', 'lambda-log-height-law'], relation: `H_t defines Λ; Newman's conjecture (Λ ≥ 0, proved by Rodgers–Tao) fixes the lower side; the ladder 1/2 → 0.22 → 0.2 records the upper side; the log-height law (Λ ≈ c/ln T) explains why upper bounds move slowly.` },
      { group: 'How zeros move', members: ['zero-dynamics', 'zero-collision-time', 'lehmer-pair', 'burgers-cole-hopf'], relation: `Each zero moves with velocity 2Σ1/(z_k − z_j). Forward in t real zeros repel; backward they attract and collide, close (Lehmer) pairs first. The Burgers view treats collisions as shocks.` },
      { group: 'Collision program (backward flow)', members: ['theta-trap', 'min-gap-sandwich', 'isolation-ratio', 'excursion-cap', 'c-shock-modulus', 'squared-gap-coordinate', 'bridge-error-split', 'conditional-share-sigma', 'ch-wall'], relation: `Project results on the closest pair under the backward flow: traps on Θ, bounds on the minimal gap, the isolation ratio and its basin, and the error budget for transferring a finite model to Λ. The C_H wall records where this route stays conditional; the Θ-trap sign audit records that collision upper bounds do not lower Λ upper bounds.` },
      { group: 'Local descent', members: ['mirror-descent'], relation: `A proved lemma that a lower complex neighbour pulls an off-line zero down; turning it into a Λ bound needs an unproved local zero surplus.` },
    ],
    physicsAnalogy: {
      system: 'An overdamped gas of like charges on a line near a conducting plane, run forward and backward in time',
      mapping: [
        'Zeros ↔ charges; the 1/distance velocity law ↔ 2-D Coulomb repulsion with friction.',
        'Mirror-image zeros ↔ image charges in a conducting plane, which pull off-axis charges down.',
        'Forward t ↔ the gas spreading and settling onto the axis; backward t ↔ attraction, collisions, and pairs lifting off.',
        'Λ ↔ the time at which the last charge settles onto the axis.',
      ],
      whereItBreaks: 'The gas is infinite with growing density, there is no noise or inertia, collisions follow a Hermite-polynomial rule, and t is a deformation parameter, not physical time. The analogy explains the direction of motion, not the arithmetic that decides whether Λ = 0.',
    },
    readingOrder: ['heat-flow-ht', 'de-bruijn-newman-constant', 'zero-dynamics', 'newman-conjecture', 'lambda-upper-bound-ladder', 'lambda-log-height-law', 'zero-collision-time', 'lehmer-pair', 'theta-trap', 'isolation-ratio', 'burgers-cole-hopf', 'bridge-error-split', 'ch-wall'],
    mentions: ['xi-function', 'heat-flow-ht', 'de-bruijn-newman-constant', 'riemann-hypothesis', 'newman-conjecture', 'lambda-upper-bound-ladder', 'lambda-log-height-law', 'zero-dynamics', 'zero-collision-time', 'lehmer-pair', 'burgers-cole-hopf', 'theta-trap', 'min-gap-sandwich', 'isolation-ratio', 'excursion-cap', 'c-shock-modulus', 'squared-gap-coordinate', 'bridge-error-split', 'conditional-share-sigma', 'ch-wall', 'mirror-descent'],
  },

  'barrier-and-certification-methods': {
    intro: `This class is the machinery that turns verified zeros and computer certificates into an upper bound on Λ. Two architectures appear: the fixed-t₀ Polymath15 barrier (Λ ≤ t₀ + y₀²/2), used by Platt–Trudgian's accepted 0.2 and the project's 0.1758354 candidate (unreviewed), and the decreasing barrier of Raymond's unrefereed preprint, used by the project's conditional values near 0.145–0.147.`,
    membersOverview: [
      { group: 'Fixed-t₀ barrier', members: ['barrier-method', 'route-vii-lane', 'effective-error-cap', 'y-transfer', 'barrier-mollifier', 'project-lambda-candidate'], relation: `The barrier criterion needs a finite lane of approximation checks plus a tail, all clearing the approximation error ε_cap; the y-transfer extends a check from one height to a box; a mollifier can shorten the sums. The candidate is one complete instance.` },
      { group: 'Decreasing barrier', members: ['decreasing-zero-height-barrier', 'multi-height-consumer'], relation: `A ceiling on y² lowered from t = 0 cell by cell; the multi-height consumer integrates the certified floors into an exact-rational end time U.` },
      { group: 'Floors that feed it', members: ['source-floor', 'kronecker-floor', 'structured-floor', 'prefix-and-cell', 'weak-outer-lemma', 'zero-conditioned-floor'], relation: `Source floors set the descent speed. The Kronecker floor is the phase-blind limit; structured floors keep small primes exact on per-cell prefixes and need the weak outer lemma; the zero-conditioned floor measured how little the zero constraint adds.` },
      { group: 'Splitting by height', members: ['two-band-lemma-b', 'local-rh-window', 'route-p'], relation: `Lemma B runs two barriers separated by a verified window; route P combines it with structured floors at Platt–Trudgian height.` },
    ],
    physicsAnalogy: {
      system: 'Containment of settling particles with sealed partitions and a descending piston',
      mapping: [
        'Fixed-t₀ barrier ↔ a sealed bulkhead held for a set time, after which particles settle at a guaranteed minimum rate.',
        'Decreasing barrier ↔ a piston lowered continuously, never touching a particle.',
        'Source floors ↔ the guaranteed minimum downward drift that sets how fast the piston may move.',
        'Two-band Lemma B ↔ two cylinders with separate pistons and an inspected compartment between them.',
      ],
      whereItBreaks: 'Every "wall" and "drift" here is a certified inequality about an analytic function, and particles (zeros) interact at long range. The physical picture motivates the structure of the proof; it does not supply any of its estimates.',
    },
    readingOrder: ['barrier-method', 'effective-error-cap', 'route-vii-lane', 'y-transfer', 'project-lambda-candidate', 'decreasing-zero-height-barrier', 'source-floor', 'kronecker-floor', 'structured-floor', 'prefix-and-cell', 'weak-outer-lemma', 'zero-conditioned-floor', 'local-rh-window', 'two-band-lemma-b', 'multi-height-consumer', 'route-p', 'barrier-mollifier'],
    mentions: ['barrier-method', 'route-vii-lane', 'effective-error-cap', 'y-transfer', 'barrier-mollifier', 'project-lambda-candidate', 'decreasing-zero-height-barrier', 'multi-height-consumer', 'source-floor', 'kronecker-floor', 'structured-floor', 'prefix-and-cell', 'weak-outer-lemma', 'zero-conditioned-floor', 'two-band-lemma-b', 'local-rh-window', 'route-p', 'de-bruijn-newman-constant'],
  },

  'zero-counting-and-verification': {
    intro: `This class covers how zeros of zeta are found, counted and proved to lie on the critical line up to a height, and what is proved about where zeros can be in general. Finite verification cannot prove RH, but it is an input to every bound on Λ; the general results (zero-free regions, density estimates, proportions on the line) describe the zeros beyond any computation.`,
    membersOverview: [
      { group: 'Counting', members: ['zero-counting-function', 'argument-principle', 'turing-method'], relation: `N(T) counts zeros up to height T via the argument principle; Turing's method proves that the zeros found on the line are all of them.` },
      { group: 'Locating on the line', members: ['hardy-z-function', 'gram-points', 'riemann-siegel-formula', 'platt-zero-isolation'], relation: `Z(t) is real on the line, so its sign changes are zeros; Gram points organise the search; the Riemann–Siegel formula and Platt's FFT method evaluate Z rigorously at scale.` },
      { group: 'Verified heights and windows', members: ['platt-trudgian-verified-height', 'verified-height-lever', 'local-rh-window', 'lehmer-pair'], relation: `Platt–Trudgian's 3·10¹² is the input to the accepted Λ ≤ 0.2; the lever measures what more height buys; local windows verify isolated stretches higher up; Lehmer pairs are the close pairs that verification must resolve.` },
      { group: 'Where zeros can be (theorems)', members: ['zero-free-region', 'zero-density-estimate', 'critical-line-proportion', 'levinsons-method', 'mollifier', 'pair-correlation'], relation: `Zero-free regions near Re s = 1, bounds on how many zeros lie off to the right, lower bounds on the share on the line (via mollified Levinson-type methods), and Montgomery's pair correlation.` },
    ],
    physicsAnalogy: {
      system: 'Surveying a long pipeline: counting joints against the drawings',
      mapping: [
        'N(T) ↔ the number of joints on the construction drawing up to a marker.',
        'Sign changes of Z ↔ joints found by an inspection device in the expected position.',
        'Turing\'s method ↔ the check that found and expected counts agree, so nothing is out of place.',
        'Zero-free regions and density bounds ↔ engineering guarantees about the parts of the line no one has inspected.',
      ],
      whereItBreaks: 'The "drawing" N(T) has a fluctuating term controlled only on average, and an off-line zero shows up only as a missing pair of sign changes. The general theorems are proofs, not inspection statistics.',
    },
    readingOrder: ['zero-counting-function', 'hardy-z-function', 'gram-points', 'argument-principle', 'turing-method', 'riemann-siegel-formula', 'platt-zero-isolation', 'platt-trudgian-verified-height', 'local-rh-window', 'verified-height-lever', 'lehmer-pair', 'zero-free-region', 'zero-density-estimate', 'critical-line-proportion', 'mollifier', 'levinsons-method', 'pair-correlation'],
    mentions: ['zero-counting-function', 'argument-principle', 'turing-method', 'hardy-z-function', 'gram-points', 'riemann-siegel-formula', 'platt-zero-isolation', 'platt-trudgian-verified-height', 'verified-height-lever', 'local-rh-window', 'lehmer-pair', 'zero-free-region', 'zero-density-estimate', 'critical-line-proportion', 'levinsons-method', 'mollifier', 'pair-correlation', 'riemann-hypothesis', 'de-bruijn-newman-constant'],
  },

  'interval-arithmetic-and-computer-assisted-proof': {
    intro: `This class explains how a computer calculation becomes a step in a proof. Ordinary floating point gives evidence; interval and ball arithmetic give enclosures that make a computed inequality exact; positivity certificates and replay packets make the result checkable by someone else. Every "certified" grade in this project rests on these tools.`,
    membersOverview: [
      { group: 'Floating point and its limits', members: ['ieee-754-double', 'condition-number', 'compensated-summation'], relation: `Double precision rounds every operation; the condition number says how much those roundings are amplified; compensated summation reduces loss in long sums. None of these produces a proof.` },
      { group: 'Enclosures', members: ['interval-arithmetic', 'arb-interval-certificate', 'interval-newton-krawczyk', 'bernstein-certificate', 'platt-zero-isolation'], relation: `Intervals and Arb balls enclose true values; Krawczyk proves a unique root in a box; Bernstein coefficients prove polynomial positivity exactly; Platt's method uses enclosures to isolate zeta zeros.` },
      { group: 'Positivity certificates', members: ['toeplitz-krein-certificate', 'arb-lege-certificate', 'rayleigh-ritz-bound'], relation: `Route I's Weil-positivity certificates (Toeplitz–Krein for 2a ≤ 0.96, ARB-LEGE for 0.96 < 2a ≤ ln 3). Rayleigh–Ritz gives only upper bounds on a minimum eigenvalue, so a positive finite-basis value is not a positivity proof by itself.` },
      { group: 'Checkability', members: ['replay-packet', 'lean-formalization'], relation: `Hashed replay packets let a referee rerun a certificate; Lean checks the logical reduction, with numerical gates entering as hypotheses.` },
    ],
    physicsAnalogy: {
      system: 'Metrology: measurements with guaranteed worst-case tolerances and calibration records',
      mapping: [
        'Floating point ↔ an uncalibrated reading with unknown error.',
        'Ball arithmetic ↔ a reading with a guaranteed tolerance, always rounded outward.',
        'Certificate ↔ a tolerance stack that clears the limit, so the part fits.',
        'Replay packet ↔ the calibration record that lets an inspector repeat the measurement.',
      ],
      whereItBreaks: 'Physical tolerances are statistical; ball radii are mathematical bounds. And no tolerance record can tell whether the measured quantity is the one the argument needs: that remains a mathematical check.',
    },
    readingOrder: ['ieee-754-double', 'condition-number', 'interval-arithmetic', 'arb-interval-certificate', 'compensated-summation', 'interval-newton-krawczyk', 'bernstein-certificate', 'rayleigh-ritz-bound', 'platt-zero-isolation', 'toeplitz-krein-certificate', 'arb-lege-certificate', 'replay-packet', 'lean-formalization'],
    mentions: ['ieee-754-double', 'condition-number', 'compensated-summation', 'interval-arithmetic', 'arb-interval-certificate', 'interval-newton-krawczyk', 'bernstein-certificate', 'platt-zero-isolation', 'toeplitz-krein-certificate', 'arb-lege-certificate', 'rayleigh-ritz-bound', 'replay-packet', 'lean-formalization', 'weil-positivity', 'evidence-grades'],
  },
};

export const AREA_B_SLUGS = Object.freeze(Object.keys(expositions));

export default expositions;
