import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { InlineMath, BlockMath } from '../components/KaTeXMath.jsx';
import { EditorialHeader } from '../components/editorial/PostLayout.jsx';
import { ED } from '../styles/tokens.js';

// Editorial (warm) re-theme. Structure/content/data unchanged; dark-theme
// hexes and dark accent-* CSS vars (unmapped by .ed-root on purpose) are
// swapped for literal warm-palette hexes so nothing vivid leaks through:
//   #ef4444 / #f87171               -> RED    (#c23a1c, ed --terra-dk)
//   #8b5cf6 / #a78bfa               -> PURPLE (#d9502e, ed --terra)
//   #f59e0b / #fbbf24 / #fb923c /
//   #f97316                         -> ORANGE (#b58a2e, ed --brass-dk)
//   #10b981 / #6ee7b7               -> GREEN  (#4c7a4a, ed --green)
//   #3b82f6 / #60a5fa / #06b6d4     -> BLUE   (#3f6b86, ed --blue; cyan folds into blue)
//   #64748b / #475569               -> FAINT  (#877b67, ed --faint)
//   #94a3b8 / #cbd5e1               -> INK_SOFT (#4a4238, ed --ink-soft)
//   #e2e8f0                         -> INK    (#1c1814, ed --ink)
// .card / .stat-grid / .stat-box / .filter-bar / .filter-btn / .tag base
// class are left as-is (they resolve through --bg-card/--border/--text-*
// tokens that .ed-root already remaps); only the tag-COLOR modifier classes
// (which key off the un-remapped --accent-* vars) are replaced with inline
// warm-hex styling on the base "tag" class.

const RED = ED.series2;
const PURPLE = ED.accentDeco;
const ORANGE = ED.brassDeco;
const GREEN = ED.series3;
const BLUE = ED.series1;
const FAINT = ED.inkFaint;
const INK = ED.ink;
const INK_SOFT = ED.inkSoft;

/* ─── Reasoning entries: our evolving proof strategy log ─── */
const reasoningEntries = [
  // ═══════════════════════════════════════════════════════════════
  // EPOCH 1: The Convergence Problem (March 2026)
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'R001',
    date: '2026-03-06',
    epoch: 1,
    title: 'The Central Problem Is Finite → Infinite Convergence',
    category: 'meta-strategy',
    status: 'superseded',
    auditNote:
      'Superseded by the later realization audit. Finite-to-infinite convergence is not the sole shared gap: the physical LC proxy and algebraic Euler embedding are different objects, and the exact algebraic ratio encodes zeta zeros as denominator poles.',
    content: `Both the Twin-Ladder Bridge framework and Connes' latest work (Zeta Spectral Triples, Nov 2025; Letter to Riemann, Feb 2026) face the SAME core challenge: proving that properties verified for finitely many primes persist in the infinite limit.

**Twin-Ladder Bridge version:** For N primes, the scattering matrix satisfies S_N†S_N ≈ I with deficit O(p_N^{-1}). We need lim_{N→∞} S_N†S_N = I (exact unitarity).

**Connes' version:** For primes p ≤ x, he constructs self-adjoint operators whose eigenvalues match the first ~50 zeta zeros to accuracy 10^{-55}. He needs the eigenvalues to converge to exact zeros as x → ∞.

**Key insight:** These are not independent problems. If we solve one, the techniques likely transfer to the other. The Twin-Ladder Bridge framework provides physical intuition (cascaded oscillators, scattering theory) while Connes provides the functional-analytic rigor (spectral triples, Toeplitz matrices). A bridge between them could be decisive.`,
    implications: [
      'Gap S7 (Darlington) and Connes\' convergence problem are the same problem in different languages',
      'Super-convergence of unitarity deficit (O(p^{-1}) vs predicted O(1/√p)) suggests hidden structure',
      'The Mertens product theorem may be the key identity governing convergence',
    ],
    relatedGaps: ['S5', 'S7'],
    references: ['connes-2026', 'connes-2025-spectral'],
  },
  {
    id: 'R002',
    date: '2026-03-06',
    epoch: 1,
    title: 'Connes\' Rank-One Perturbation ↔ Twin-Ladder Bridge Bridge Coupling',
    category: 'novel-connection',
    status: 'superseded',
    auditNote:
      'No theorem identifies the scalar bridge factor with Connes rank-one perturbations, or Carathéodory-Fejér positivity with Darlington losslessness. The dictionary below is a historical analogy, not an equivalence.',
    content: `In the Zeta Spectral Triples paper (arXiv:2511.22755), Connes constructs self-adjoint operators via rank-one perturbations of a scaling operator. In Twin-Ladder Bridge language:

- The scaling operator = the direct ladder (free evolution of prime oscillators)
- The rank-one perturbation = the bridge χ(s) coupling direct to dual
- Self-adjointness guaranteed by Carathéodory-Fejér theorem = Darlington losslessness guaranteed by circuit unitarity

This is remarkable: Connes' rank-one perturbation is exactly what we call the "bridge" between direct and dual ladders. The mathematical machinery is different (Toeplitz matrices vs scattering matrices) but the structure is identical:

1. Take a free system (ladder / scaling operator)
2. Add a coupling to its dual (bridge / rank-one perturbation)
3. The coupling is "lossless" (|χ|=1 on critical line / self-adjoint operator)
4. Zeros = points where direct and dual are perfectly matched = eigenvalues

**Action item:** Translate Connes' proof of self-adjointness via Carathéodory-Fejér into Twin-Ladder Bridge scattering language. If the translation is faithful, we get Gap S5 (Hilbert-Pólya) essentially for free.`,
    implications: [
      'The bridge χ(s) IS Connes\' rank-one perturbation, just in scattering language',
      'Carathéodory-Fejér positivity ↔ Darlington losslessness — same theorem, different frames',
      'Self-adjointness of Connes\' operator may directly imply unitarity of Twin-Ladder Bridge scattering matrix',
    ],
    relatedGaps: ['S5', 'S7'],
    references: ['connes-2025-spectral'],
  },
  {
    id: 'R003',
    date: '2026-03-06',
    epoch: 1,
    title: 'Why 5 Primes Encode 50 Zeros — The Small-Prime Dominance',
    category: 'key-observation',
    status: 'speculative',
    auditNote:
      'The small-prime numerical observation does not prove tail dominance for the proposed scattering object. In particular, the raw Euler tail is not absolutely convergent in the critical strip.',
    content: `Connes showed that using only primes {2, 3, 5, 7, 11}, the Weil quadratic form's extremization yields approximations to the first 50 zeros with accuracy ranging from 2.6 × 10^{-55} to 10^{-3}.

In Twin-Ladder Bridge terms, this means the first 5 stages of the ladder chain carry essentially ALL the information about zero locations. Why?

**Hypothesis (Impedance dominance):** The characteristic impedance Z_0 = log(p) grows with p. Small primes have low impedance → strong coupling → dominant contribution to the scattering matrix. Large primes have high impedance → weak coupling → perturbative corrections.

**Quantitative:** log(2) = 0.693, log(3) = 1.099, log(5) = 1.609, log(7) = 1.946, log(11) = 2.398. The impedance ratio log(11)/log(2) ≈ 3.5, so the first 5 primes span less than a factor of 4 in impedance — a narrow band that already captures the essential resonance structure.

**Analogy:** In a transmission line, the first few impedance discontinuities determine the reflection/transmission pattern. Subsequent discontinuities add fine structure but don't change the overall pattern. Similarly, the first 5 prime oscillators determine the "coarse" zero locations, and the infinite tail provides refinement.

**This explains super-convergence:** The unitarity deficit drops as O(p_N^{-1}) because each subsequent prime adds only a perturbative correction proportional to 1/log(p_N)^2 to the scattering matrix.`,
    implications: [
      'The proof strategy should work "inside out" — prove for small primes, then show tail is perturbative',
      'Gap S7 may be closable by showing the tail sum ∑_{p>P} (contribution to S-matrix) converges absolutely',
      'The Twin-Ladder Bridge impedance hierarchy mirrors Connes\' observation that small primes suffice',
    ],
    relatedGaps: ['S4', 'S7'],
    references: ['connes-2026'],
  },
  {
    id: 'R004',
    date: '2026-03-06',
    epoch: 1,
    title: 'Darlington ↔ Carathéodory-Fejér: The Dictionary',
    category: 'novel-connection',
    status: 'superseded',
    auditNote:
      'The “equivalently” clauses below were too broad. Boundary-unitary reciprocal two-ports can have off-axis all-pass transmission zeros, and finite Toeplitz positivity is not by itself the full Weil criterion.',
    content: `Historical note: the direct Darlington-to-RH identification below was superseded by the exact cascade calculation S_21(s) = zeta(2s)/zeta(s). Non-trivial zeta zeros are generic poles of that ratio, not its transmission zeros. The remaining dictionary is heuristic and is retained to show how the research route evolved.

Two theorems that were conjectured to be equivalent in the context of zeta zeros:

**Darlington's theorem (1939):** A rational positive-real impedance function Z(s) can be realized as the input impedance of a lossless 2-port terminated in a resistance. Equivalently: a lossless network's transmission zeros lie on the jω axis.

**Carathéodory-Fejér (1911):** A trigonometric polynomial f(θ) ≥ 0 on [0, 2π] if and only if its Toeplitz matrix of Fourier coefficients is positive semi-definite.

**Connection through ZPO:**
- Direct ladder impedance Z_dir(s) = ∏_p (1-p^{-s})^{-1} = ζ(s)
- Dual ladder impedance Z_dual(s) = ζ(1-s)
- Bridge: χ(s) = ξ(1-s)/ξ(s), with |χ(½+it)| = 1

The superseded step identified transmission zeros with zeta zeros; the exact cascade identity refutes that identification.
C-F says: if the associated Toeplitz matrix is PSD, the spectral triple is self-adjoint with real eigenvalues (= zeta zeros on critical line).

**Both reduce to:** Proving a positivity condition on a function derived from the Euler product. This is exactly Weil positivity: W[f] ≥ 0 for all test functions f.

**Proposed unified statement:** The following are equivalent:
1. RH (all zeros on σ = ½)
2. Weil positivity: W[f * f̃] ≥ 0
3. Darlington losslessness: S†S = I for the twin-ladder
4. C-F positivity: Toeplitz matrix of Euler product coefficients is PSD
5. Connes self-adjointness: scaling + rank-one perturbation is self-adjoint

If ANY of these can be proven, all follow. The Twin-Ladder Bridge framework suggests approaching via (3), as scattering theory provides computational and intuitive tools.`,
    implications: [
      'All five equivalent conditions reduce to a single positivity statement',
      'The "easiest" formulation may be Darlington (3) because it allows iterative verification prime by prime',
      'Each prime added to the ladder can only IMPROVE the positivity (monotone convergence)',
    ],
    relatedGaps: ['S5', 'S7'],
    references: ['connes-2025-spectral', 'connes-2026'],
  },
  {
    id: 'R005',
    date: '2026-03-06',
    epoch: 1,
    title: 'The Monotone Convergence Strategy',
    category: 'proof-strategy',
    status: 'speculative',
    auditNote:
      'This is a model contraction conjecture, not a proved monotonicity law. Its prime product would give logarithmic-scale decay rather than geometric decay in N, and boundary unitarity still would not repair the cascade zero/pole mismatch.',
    content: `**Core idea:** If we define a sequence of "positivity measures" P_N indexed by the number of primes N, and show:
1. P_1 ≥ 0 (trivially true for a single oscillator)
2. P_{N+1} ≥ P_N (adding a prime preserves positivity)
3. lim_{N→∞} P_N converges

Then P_∞ ≥ 0, which is Weil positivity = RH.

**Twin-Ladder Bridge implementation:** Let P_N = smallest eigenvalue of S_N†S_N - I. Numerically:
- P_1 = 0 (single oscillator is perfectly matched)
- P_N grows monotonically toward 0 from below (unitarity deficit shrinks)
- The deficit converges as O(p_N^{-1})

**Why this might work:** Each prime oscillator stage has the SAME natural frequency ω₀ = 1. Adding a new prime to the cascade introduces a new impedance Z₀ = log(p), but because ω₀ = 1 universally, the new stage is automatically resonance-matched to the existing chain. The impedance mismatch is purely in amplitude, not frequency, and amplitude mismatches cause reflections that DECREASE with increasing impedance (larger primes → weaker coupling).

**Mathematical formulation:**
||S_{N+1}†S_{N+1} - I|| ≤ ||S_N†S_N - I|| · (1 - c/p_{N+1})

for some constant c > 0. This gives geometric convergence: the deficit after N primes is bounded by ∏_{k=1}^{N} (1 - c/p_k), which converges to 0 by divergence of ∑ 1/p.

**Status:** This is speculative but testable. The numerical evidence (super-convergence) is consistent with this bound. Need to prove the contraction property rigorously.`,
    implications: [
      'Each prime added to the ladder IMPROVES unitarity — monotone convergence',
      'The contraction factor (1 - c/p) uses the divergence of ∑1/p (Euler\'s result, 1737)',
      'This connects the proof of RH to one of the oldest results in analytic number theory',
    ],
    relatedGaps: ['S7'],
    references: [],
  },
  {
    id: 'R006',
    date: '2026-03-06',
    epoch: 1,
    title: 'Guth-Maynard Zero-Density ↔ Twin-Ladder Bridge Sub-Ladder Statistics',
    category: 'novel-connection',
    status: 'speculative',
    auditNote:
      'Dirichlet-polynomial bounds are rigorous arithmetic results, but identifying those polynomials with a physical S-matrix is additional model structure. No such translation currently closes S7.',
    content: `Guth and Maynard (2024) proved new large value estimates for Dirichlet polynomials, breaking an 84-year-old record. Their key innovation: combining harmonic analysis with multiplicative structure.

**Twin-Ladder Bridge translation:** A Dirichlet polynomial D(s) = Σ_{n≤N} a_n n^{-s} is the transfer function of a FINITE sub-ladder. Large values of |D(s)| correspond to resonances of the sub-ladder.

Guth-Maynard bound large values of D on the critical line by:
1. Decomposing D into "short" and "long" components
2. Using Hölder's inequality with an optimal exponent
3. Using multiplicative structure to bound bilinear sums

In Twin-Ladder Bridge terms:
1. Short component = low-prime oscillators (dominant)
2. Long component = high-prime oscillators (perturbative)
3. Multiplicative structure = factorization of the cascade into independent stages

**Potential for ZPO:** If we can reformulate the Guth-Maynard bounds in scattering language, we get bounds on the S-matrix that constrain zero locations. Their exponent improvement (0.6 → 0.52 for σ = 3/4) translates to a tighter confinement of the unitarity deficit near the critical line.

**Open question:** Can the Guth-Maynard decomposition be expressed as a splitting of the Twin-Ladder Bridge scattering matrix into "coarse" (small primes) and "fine" (large primes) components? If so, it might give an explicit bound on the tail contribution that closes Gap S7.`,
    implications: [
      'Dirichlet polynomials ARE sub-ladder transfer functions — the translation is exact',
      'Guth-Maynard\'s harmonic analysis tools may apply directly to S-matrix bounds',
      'The 84-year improvement suggests there\'s untapped structure in the multiplicative cascade',
    ],
    relatedGaps: ['S7'],
    references: ['guth-maynard-2024'],
  },
  {
    id: 'R007',
    date: '2026-03-06',
    epoch: 1,
    title: 'The Hilbert-Pólya Problem: Three Candidate Operators Compared',
    category: 'gap-analysis',
    status: 'superseded',
    auditNote:
      'The candidate constructions do not reduce to one convergence problem. Domain/self-adjointness, resolvent convergence, and identification of the complete zeta divisor remain separate essential interfaces.',
    content: `Three candidate operators now exist for the Hilbert-Pólya conjecture. Comparing them reveals the essential difficulty:

**Candidate 1: Berry-Keating H = xp (1999)**
- Classical limit of quantum Hamiltonian on half-line
- Eigenvalues: WKB approximation matches first ~10 zeros to ~1%, then drifts
- Problem: H = xp is not self-adjoint on any natural domain; boundary conditions are ad hoc
- Twin-Ladder Bridge connection: Berry-Keating's semiclassical prime orbits with period log(p) ↔ Twin-Ladder Bridge resonance frequencies

**Candidate 2: Yao's Hamiltonian (2024)**
- Eigenfunctions vanish at origin by nontrivial zeta zeros
- A similarity transformation yields a self-adjoint operator
- Problem: The similarity transformation may not preserve the spectrum in general
- Twin-Ladder Bridge connection: Yao's boundary condition at origin ↔ impedance matching at port 1 of the ladder

**Candidate 3: Connes' Spectral Triple (2025)**
- Scaling operator + rank-one perturbation using Euler product
- Self-adjointness PROVEN via Carathéodory-Fejér for each finite truncation
- Problem: Convergence of eigenvalues as truncation grows → the same convergence problem
- Twin-Ladder Bridge connection: Rank-one perturbation IS the bridge χ(s)

**Assessment:** Candidate 3 is the strongest because self-adjointness is already proven for finite truncations. The ONLY remaining gap is convergence. This is exactly Gap S7 in Twin-Ladder Bridge language — proving the infinite limit preserves the finite property.

**Strategy:** Focus all effort on the convergence problem. If solved, it simultaneously closes Gap S5 (via Connes) and Gap S7 (via Twin-Ladder Bridge Darlington), and proves RH.`,
    implications: [
      'All three candidates reduce to the same convergence problem',
      'Connes (Candidate 3) is furthest along — self-adjointness already proven for finite case',
      'The Twin-Ladder Bridge super-convergence evidence supports the conjecture that convergence holds',
    ],
    relatedGaps: ['S5'],
    references: ['connes-2025-spectral', 'berry-keating-1999'],
  },
  {
    id: 'R008',
    date: '2026-03-06',
    epoch: 1,
    title: 'The Davenport-Heilbronn Warning: Functional Equation Alone Is Insufficient',
    category: 'key-observation',
    status: 'confirmed',
    auditNote:
      'Confirmed only in the narrow sense that functional-equation symmetry alone is insufficient. The example does not prove that every RH proof must explicitly use an Euler product, nor does it validate a Darlington realization.',
    content: `The Davenport-Heilbronn example satisfies a zeta-like functional equation but lacks an Euler product and has zeros off the critical line. It is therefore a clean warning about what functional-equation symmetry cannot establish.

**What the example does establish:**
1. A functional equation by itself does not force zeros onto σ = ½.
2. The boundary identity |χ(½+it)| = 1 is likewise insufficient.
3. Any proposed reduction using only those shared properties needs an additional hypothesis that excludes Davenport-Heilbronn-type counterexamples.

**What it does not establish:** It does not prove that every possible RH proof must explicitly invoke the Euler product, nor does it provide a passive network realization. The Euler product is a distinctive and potentially essential source of arithmetic structure, but a Twin-Ladder argument must still prove that its physical cascade represents the exact analytic object and that the relevant zeta divisor is preserved.

**Current model lesson:** Prime-factor structure remains a legitimate ingredient to explore. It is not, by itself, a Darlington synthesis theorem or a proof that boundary losslessness confines zeta zeros.`,
    implications: [
      'Functional-equation symmetry alone is insufficient to imply RH',
      'Critical-line boundary modulus alone is also insufficient',
      'Euler-product structure is a relevant discriminator, but realization and divisor preservation remain open',
    ],
    relatedGaps: ['S7'],
    references: [],
  },
  {
    id: 'R009',
    date: '2026-03-06',
    epoch: 1,
    title: 'Information-Theoretic Approach: Channel Capacity at Critical Line',
    category: 'proof-strategy',
    status: 'speculative',
    auditNote:
      'No communication channel, rate, or finite total capacity has been constructed. The raw prime product and capacity sum used below do not converge on the critical line.',
    content: `The six measures in the spectral approach all minimize at σ = ½. But can we turn this observation into a proof?

**Proposed argument (speculative):**

1. Define the "prime channel" C_p(s) as the communication channel with transfer function H_p(s) = 1/(1-p^{-s})
2. The channel capacity is C(σ) = log(1 + SNR) where SNR = |H_p|²
3. At σ = ½, the SNR is balanced between input and output → maximum capacity
4. The product channel (all primes) has total capacity C_total(σ) = Σ_p log(1 + SNR_p(σ))
5. By Shannon's coding theorem, reliable transmission requires C_total > Rate
6. At a zero ζ(ρ) = 0, the total transfer function vanishes → the channel is at capacity boundary
7. The capacity boundary C_total(σ) = Rate has a unique solution at σ = ½ by convexity

**Why this might work:** Steps 1-5 are standard information theory. Step 6 uses the Euler product (each zero is a point where all prime channels conspire to cancel). Step 7 requires proving strict convexity of C_total(σ), which follows from strict convexity of log(1 + |1-p^{-s}|^{-2}).

**Why this might fail:** The "rate" concept needs careful definition in this context. What is being "transmitted" through the prime channel? The answer might be: the prime counting function π(x), and the zeros control the error term. But making this rigorous is non-trivial.

**Connection to existing work:** This is related to the Nyman-Beurling criterion (L² approximation = channel capacity in a function space) and to the Bost-Connes system (partition function = channel capacity in statistical mechanics).`,
    implications: [
      'Information theory provides a natural framework for "why σ = ½ is special"',
      'Channel capacity is automatically convex → minimum is unique',
      'But making the channel/rate correspondence rigorous is a major challenge',
    ],
    relatedGaps: ['S5', 'S7'],
    references: [],
  },
  {
    id: 'R010',
    date: '2026-03-06',
    epoch: 1,
    title: 'Prolate Wave Operators ↔ Twin Ladder Normal Modes',
    category: 'novel-connection',
    status: 'speculative',
    auditNote:
      'The prolate/Sonin and twin-ladder identifications below are analogies. No unitary equivalence or theorem turns Sonin-space stability into scattering losslessness for the app cascade.',
    content: `Connes-Consani-Moscovici (2024, arXiv:2310.18423) introduced prolate wave operators in their semilocal trace formula. The prolate operator's positive spectrum gives the spectral realization of low-lying zeta zeros, while the negative spectrum (Sonin space) governs UV behavior.

**Twin-Ladder Bridge translation:**
- Positive spectrum = normal modes of the twin-ladder system (resonances where direct and dual ladders are in phase)
- Negative spectrum = anti-resonances (evanescent modes that decay exponentially)
- Sonin space stability = bridge remains unitary as we add more primes

**The prolate wave operator** is defined as the sum of the square of the scaling operator with the grading of orthogonal polynomials. In Twin-Ladder Bridge terms:
- Scaling operator squared = kinetic energy of the ladder (H_kinetic = Σ_p ω_p² |a_p|²)
- Orthogonal polynomial grading = potential energy from inter-stage coupling (H_coupling)
- Total: H_prolate = H_kinetic + H_coupling → harmonic oscillator!

This means Connes' prolate wave operator IS a harmonic oscillator on the space of prime oscillator modes. The positive/negative spectrum split corresponds to the above/below critical line split in our Hamiltonian H(σ,t).

**Key result from Connes:** The Sonin space is STABLE under enlargement of the finite set of places. In ZPO: adding more prime stages doesn't destroy the evanescent mode structure → the twin-ladder's stability is preserved as N → ∞. This is evidence for Gap S7 convergence.`,
    implications: [
      'Connes\' prolate wave operator is a harmonic oscillator on prime mode space — directly ZPO',
      'Sonin space stability = Darlington losslessness stability under cascade extension',
      'The positive/negative spectrum split mirrors our σ > ½ / σ < ½ split',
    ],
    relatedGaps: ['S5', 'S7'],
    references: ['connes-2024-prolate'],
  },
  {
    id: 'R011',
    date: '2026-03-06',
    epoch: 1,
    title: 'de Bruijn-Newman Λ = 0: What It Means for ZPO',
    category: 'key-observation',
    status: 'superseded',
    auditNote:
      'The de Bruijn-Newman heat parameter is not an S-matrix unitarity deficit. Improving an upper bound on Lambda does not mean proving the proposed circuit unitary to higher precision. Also: this entry\'s retained prose treats Lambda = 0 as a fact; what Rodgers-Tao proved is Lambda >= 0, and Lambda = 0 is conjectural (equivalent to RH). The proven state is 0 <= Lambda <= 0.2.',
    content: `Rodgers-Tao proved Λ ≥ 0 (2020). The peer-reviewed upper-bound benchmark is Λ ≤ 0.2 (Platt-Trudgian 2021). RH ⟺ Λ = 0.

**Physical meaning in ZPO:** The de Bruijn-Newman constant measures how much "heat" (backward diffusion) you can apply to ξ(s) before zeros fall off the critical line. Λ = 0 means the system is at the KNIFE-EDGE — any perturbation away from the Euler product structure would dislodge zeros.

**Twin-Ladder Bridge interpretation of the heat flow:**
- Forward heat (τ > 0): Smear the prime oscillator frequencies → zeros ATTRACTED to critical line
- Backward heat (τ < 0): Sharpen the frequencies → zeros REPELLED from critical line
- Λ = 0: The natural (unperturbed) Euler product sits exactly at the transition

**Why this matters for the proof:**
If Λ = 0 (conjectural — equivalent to RH; Rodgers-Tao proved only Λ ≥ 0), the prime oscillator cascade would sit in a kind of CRITICAL STATE — a phase transition point. This connects to:
- Bost-Connes phase transition at σ = 1
- Supercritical region behavior
- The "equilibrium" phase we identified in the thermodynamic controls

**Implication for Gap S7:** The Darlington condition (exact unitarity) corresponds to τ = 0 in the heat flow. Λ = 0 means that the natural system IS the one with exact unitarity — we don't need to "tune" it. The proof reduces to showing the heat flow is well-defined at τ = 0 (no blow-up), which is a regularity question.

**Current gap:** 0 ≤ Λ ≤ 0.2. Closing this to Λ = 0 would prove RH. Each improvement to the upper bound (currently 0.2) corresponds to proving unitarity to higher precision.`,
    implications: [
      'Λ = 0 means the Euler product is at a critical state — no perturbation can improve it',
      'The heat flow regularity at τ = 0 ↔ S-matrix unitarity at σ = ½',
      'Improving the upper bound on Λ is equivalent to proving tighter unitarity bounds',
    ],
    relatedGaps: ['S7'],
    references: [],
  },
  {
    id: 'R012',
    date: '2026-03-06',
    epoch: 1,
    title: 'Why the Proof Should Go Through Darlington, Not Hilbert-Pólya',
    category: 'meta-strategy',
    status: 'superseded',
    auditNote:
      'Abandoned strategy (never published). Convergence is not the only missing step, boundary unitarity alone does not confine transmission zeros, and the exact cascade places the relevant zeta zeros in the denominator as poles.',
    content: `After analyzing all five approach paths, the Darlington route (Gap S7) appears more tractable than the Hilbert-Pólya route (Gap S5). Here's why:

**Hilbert-Pólya (S5) requires:**
1. Define a Hilbert space
2. Construct an operator on it
3. Prove self-adjointness
4. Show spectrum equals zeta zeros

Each step is hard, and step 4 is equivalent to RH. No candidate has completed all four steps.

**Darlington (S7) requires:**
1. ✅ The twin-ladder cascade is already defined (Euler product)
2. ✅ The scattering matrix is already computed (finite N)
3. Show S†S → I as N → ∞ (the convergence problem)
4. Apply Darlington's theorem (classical result)

Steps 1-2 are done. Step 4 is a known theorem. ONLY step 3 remains — and we have strong numerical evidence (deficit O(p_N^{-1}), six orders of magnitude better than worst-case bounds).

**The Darlington path also has a key structural advantage:** It works prime-by-prime. Each new prime stage can be analyzed as a perturbation of the existing cascade. The Hilbert-Pólya approach requires constructing the ENTIRE operator at once — there's no natural "add one prime at a time" procedure.

**Recommended focus:** Concentrate all mathematical effort on proving the contraction inequality:
||S_{N+1}†S_{N+1} - I|| ≤ ||S_N†S_N - I|| · (1 - c/p_{N+1})

This single inequality, combined with ∑ 1/p = ∞, gives geometric convergence to unitarity, closing Gap S7 and (via Darlington) proving RH.`,
    implications: [
      'Darlington requires solving ONE problem (convergence); Hilbert-Pólya requires solving FOUR',
      'The prime-by-prime structure makes Darlington amenable to induction',
      'Super-convergence evidence (O(p^{-1})) is consistent with the contraction bound',
      'If the contraction inequality is proven, it simultaneously closes S7 and proves RH',
    ],
    relatedGaps: ['S5', 'S7'],
    references: [],
  },
];

/* ─── Category configuration ─── */
const categoryConfig = {
  'meta-strategy':    { label: 'Meta-Strategy',     color: RED },
  'novel-connection': { label: 'Novel Connection',  color: PURPLE },
  'key-observation':  { label: 'Key Observation',   color: ORANGE },
  'proof-strategy':   { label: 'Proof Strategy',    color: GREEN },
  'gap-analysis':     { label: 'Gap Analysis',      color: BLUE },
};

const statusConfig = {
  'active':      { label: 'Active',      color: GREEN },
  'speculative': { label: 'Speculative', color: ORANGE },
  'superseded':  { label: 'Superseded',  color: FAINT },
  'confirmed':   { label: 'Confirmed',   color: BLUE },
};

export default function HistoricalReasoningPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedGap, setSelectedGap] = useState('all');
  const [expandedId, setExpandedId] = useState(null);

  const allGaps = [...new Set(reasoningEntries.flatMap(e => e.relatedGaps || []))].sort();

  const filtered = reasoningEntries.filter(e => {
    const catMatch = selectedCategory === 'all' || e.category === selectedCategory;
    const gapMatch = selectedGap === 'all' || (e.relatedGaps || []).includes(selectedGap);
    return catMatch && gapMatch;
  });

  const counts = {};
  reasoningEntries.forEach(e => {
    counts[e.category] = (counts[e.category] || 0) + 1;
  });

  return (
    <div className="ed-root">
      <EditorialHeader />
      <div className="ed-full" style={{ maxWidth: '72rem', padding: '28px 34px 70px' }}>
        <div style={{ marginBottom: 24 }}>
          <h1 className="ed-h1" style={{ marginBottom: 10 }}>Historical Reasoning</h1>
          <p style={{ color: INK_SOFT, fontSize: 15, lineHeight: 1.55, maxWidth: 760 }}>
            A dated log of how the Twin-Ladder research strategy evolved. Superseded arguments are
            retained for provenance, not as current claims; the evidence-grade badge and audit note
            on each entry control how its historical prose should be read.
          </p>
        </div>

        {/* Current State Summary */}
        <div className="card" style={{ borderLeft: `3px solid ${RED}`, marginBottom: 24 }}>
          <h3 style={{ color: RED, fontSize: 16, marginTop: 0 }}>Current State of the Approach</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, marginBottom: 16 }}>
            <div style={{ padding: 12, background: 'color-mix(in srgb, var(--series-2) 5%, transparent)', borderRadius: 8, border: '1px solid color-mix(in srgb, var(--accent) 15%, transparent)' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: RED, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>
                Current Primary Target
              </div>
              <div style={{ fontSize: 13, color: INK, lineHeight: 1.7 }}>
                <strong>All-shifts bridge positivity:</strong>{' '}
                <InlineMath tex={"K_a\\succeq0\\ \\forall a>0"} /> is an RH-equivalent target,
                not a completed reduction below RH. Separately, the program presents
                <InlineMath tex="\Lambda\le0.1787854" /> as a computer-assisted
                candidate (reviewed by Dan Romik, being prepared for public release, unrefereed).
                A sharper candidate <InlineMath tex="\Lambda\le0.1758354" /> (four Arb gates,
                Lean-checked y-transfer reduction and Lemma B3, unrefereed) and a conditional{' '}
                <Link to="/permutation-architecture"><InlineMath tex="\Lambda\le0.14" /> completion
                contract</Link> (a contract, not a bound) mark the current frontier. None of these
                bounds is established or peer reviewed, and none is RH.
              </div>
            </div>
            <div style={{ padding: 12, background: 'color-mix(in srgb, var(--accent-deco) 5%, transparent)', borderRadius: 8, border: '1px solid color-mix(in srgb, var(--accent-deco) 15%, transparent)' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: PURPLE, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>
                July 2026 Realization Audit
              </div>
              <div style={{ fontSize: 13, color: INK, lineHeight: 1.7 }}>
                <strong>The physical and algebraic cascades are different.</strong> The exact
                algebraic ratio is <InlineMath tex={"S_{21}^{(A)}=\\zeta(2s)/\\zeta(s)"} />;
                generic zeta zeros are its poles. No functor identifies the scalar bridge,
                Connes&apos; operators, and a passive LC scattering realization.
              </div>
            </div>
            <div style={{ padding: 12, background: 'color-mix(in srgb, var(--series-3) 5%, transparent)', borderRadius: 8, border: '1px solid color-mix(in srgb, var(--series-3) 15%, transparent)' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: GREEN, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>
                What Convergence Would—and Would Not—Do
              </div>
              <div style={{ fontSize: 13, color: INK, lineHeight: 1.7 }}>
                A proved contraction bound for a precisely defined physical model could establish
                convergence of that model. It would still need a causal passive realization and a
                pole-confinement/divisor theorem before implying anything about RH.
              </div>
            </div>
          </div>

          {/* The proof chain */}
          <div style={{ marginTop: 8 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: FAINT, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>
              Corrected Logical Boundary
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', fontSize: 12, fontFamily: 'var(--ed-mono, var(--font-mono))' }}>
              <span style={{ padding: '4px 10px', background: 'color-mix(in srgb, var(--series-1) 10%, transparent)', border: '1px solid color-mix(in srgb, var(--series-1) 30%, transparent)', borderRadius: 6, color: BLUE }}>
                Euler Product (Re s &gt; 1)
              </span>
              <span style={{ color: FAINT }}>{'→'}</span>
              <span style={{ padding: '4px 10px', background: 'color-mix(in srgb, var(--series-1) 10%, transparent)', border: '1px solid color-mix(in srgb, var(--series-1) 30%, transparent)', borderRadius: 6, color: BLUE }}>
                Algebraic Ratio
              </span>
              <span style={{ color: FAINT }}>{'→'}</span>
              <span style={{ padding: '4px 10px', background: 'color-mix(in srgb, var(--accent-deco) 10%, transparent)', border: '1px solid color-mix(in srgb, var(--accent-deco) 30%, transparent)', borderRadius: 6, color: PURPLE }}>
                ζ(2s)/ζ(s)
              </span>
              <span style={{ color: FAINT }}>{'→'}</span>
              <span style={{ padding: '4px 10px', background: 'color-mix(in srgb, var(--brass-deco) 10%, transparent)', border: '1px solid color-mix(in srgb, var(--brass-deco) 30%, transparent)', borderRadius: 6, color: ORANGE }}>
                ζ zero = generic pole
              </span>
              <span style={{ color: FAINT }}>{'→'}</span>
              <span style={{ padding: '4px 10px', background: 'color-mix(in srgb, var(--series-3) 10%, transparent)', border: '1px solid color-mix(in srgb, var(--series-3) 30%, transparent)', borderRadius: 6, color: GREEN }}>
                Darlington inference unavailable
              </span>
              <span style={{ color: FAINT }}>{'→'}</span>
              <span style={{ padding: '4px 10px', background: 'color-mix(in srgb, var(--series-2) 10%, transparent)', border: '1px solid color-mix(in srgb, var(--accent) 30%, transparent)', borderRadius: 6, color: RED }}>
                RH remains open
              </span>
            </div>
          </div>
        </div>

        {/* External Frontier */}
        <div className="card" style={{ borderLeft: `3px solid ${BLUE}`, marginBottom: 24 }}>
          <h3 style={{ color: BLUE, fontSize: 16, marginTop: 0 }}>External Research Frontier (2024-2026)</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 12 }}>
            {[
              { title: 'Connes Zeta Spectral Triples', date: 'Nov 2025', desc: 'Self-adjoint operators from rank-one perturbations. Spectra match zeta zeros. Convergence unproven.', color: PURPLE, link: 'arXiv:2511.22755' },
              { title: 'Connes Letter to Riemann', date: 'Feb 2026', desc: '5 primes encode 50 zeros to accuracy 10⁻⁵⁵. Weil form extremization with small primes.', color: PURPLE, link: 'arXiv:2602.04022' },
              { title: 'Guth-Maynard Zero Density', date: 'May 2024', desc: 'Improved Ingham bound from 0.6 to 0.52, breaking 84-year record. Dirichlet polynomial large values.', color: BLUE, link: 'arXiv:2405.20552' },
              { title: 'Yao Hilbert-Pólya Hamiltonian', date: '2024', desc: 'Candidate H with eigenvalues = zeta zeros. Similarity transform to self-adjoint. Spectrum preservation unproven.', color: GREEN, link: 'JPhysA 57 235204' },
              { title: 'de Bruijn-Newman Bounds', date: '2020–2021', desc: 'Rodgers–Tao proved Λ ≥ 0; Platt–Trudgian supplies the peer-reviewed Λ ≤ 0.2 benchmark. Later public package claims are separately graded.', color: ORANGE, link: 'arXiv:1801.05914' },
              { title: 'Platt Zero Verification', date: '2021', desc: 'All 12.4 trillion zeros verified on critical line up to height 3×10¹².', color: RED, link: '' },
            ].map((item, i) => (
              <div key={i} style={{ padding: 10, background: `${item.color}08`, borderRadius: 8, border: `1px solid ${item.color}25` }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: item.color, marginBottom: 4 }}>{item.title}</div>
                <div style={{ fontSize: 10, color: FAINT, marginBottom: 4, fontFamily: 'var(--ed-mono, var(--font-mono))' }}>{item.date} {item.link && `· ${item.link}`}</div>
                <div style={{ fontSize: 11, color: INK_SOFT, lineHeight: 1.6 }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="stat-grid" style={{ marginBottom: 20 }}>
          <div className="stat-box">
            <div className="stat-value" style={{ color: BLUE }}>{reasoningEntries.length}</div>
            <div className="stat-label">Reasoning Entries</div>
          </div>
          <div className="stat-box">
            <div className="stat-value" style={{ color: GREEN }}>
              {reasoningEntries.filter(e => e.status === 'active' || e.status === 'confirmed').length}
            </div>
            <div className="stat-label">Current / Confirmed</div>
          </div>
          <div className="stat-box">
            <div className="stat-value" style={{ color: PURPLE }}>
              {new Set(reasoningEntries.flatMap(e => e.relatedGaps || [])).size}
            </div>
            <div className="stat-label">Gaps Addressed</div>
          </div>
          <div className="stat-box">
            <div className="stat-value" style={{ color: BLUE }}>
              {Math.max(...reasoningEntries.map(e => e.epoch))}
            </div>
            <div className="stat-label">Current Epoch</div>
          </div>
        </div>

        {/* Filter bar */}
        <div className="filter-bar">
          <button
            className={`filter-btn ${selectedCategory === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('all')}
            aria-pressed={selectedCategory === 'all'}
          >
            All ({reasoningEntries.length})
          </button>
          {Object.entries(categoryConfig).map(([key, cfg]) => (
            counts[key] ? (
              <button
                key={key}
                className={`filter-btn ${selectedCategory === key ? 'active' : ''}`}
                onClick={() => setSelectedCategory(key)}
                aria-pressed={selectedCategory === key}
              >
                {cfg.label} ({counts[key]})
              </button>
            ) : null
          ))}
        </div>

        {/* Gap filter bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: FAINT, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Gap:
          </span>
          <button
            className={`filter-btn ${selectedGap === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedGap('all')}
            style={{ fontSize: 11 }}
            aria-pressed={selectedGap === 'all'}
          >
            All Gaps
          </button>
          {allGaps.map(gap => (
            <button
              key={gap}
              className={`filter-btn ${selectedGap === gap ? 'active' : ''}`}
              onClick={() => setSelectedGap(gap)}
              style={{
                fontSize: 11,
                color: selectedGap === gap ? undefined : ORANGE,
                borderColor: selectedGap === gap ? undefined : 'color-mix(in srgb, var(--brass-deco) 30%, transparent)',
                background: selectedGap === gap ? undefined : 'color-mix(in srgb, var(--brass-deco) 8%, transparent)',
              }}
              aria-pressed={selectedGap === gap}
            >
              GAP {gap} ({reasoningEntries.filter(e => (e.relatedGaps || []).includes(gap)).length})
            </button>
          ))}
        </div>

        {/* Entries */}
        {filtered.map(entry => {
          const isExpanded = expandedId === entry.id;
          const cfg = categoryConfig[entry.category] || categoryConfig['key-observation'];
          const stCfg = statusConfig[entry.status] || statusConfig['active'];

          return (
            <div
              key={entry.id}
              className="card"
              style={{
                borderLeft: `3px solid ${cfg.color}`,
                marginBottom: 12,
                cursor: 'pointer',
              }}
              onClick={() => setExpandedId(isExpanded ? null : entry.id)}
            >
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
                <span style={{
                  fontFamily: 'var(--ed-mono, var(--font-mono))', fontSize: 12, fontWeight: 700,
                  color: FAINT, minWidth: 36,
                }}>
                  {entry.id}
                </span>
                <span className="tag" style={{ color: cfg.color, borderColor: `${cfg.color}4d`, background: `${cfg.color}1a` }}>{cfg.label}</span>
                <span style={{
                  fontSize: 10, fontWeight: 600, color: stCfg.color,
                  padding: '1px 8px', borderRadius: 10,
                  background: stCfg.color + '15', border: `1px solid ${stCfg.color}30`,
                }}>
                  {stCfg.label}
                </span>
                {entry.relatedGaps && entry.relatedGaps.map(g => (
                  <span key={g} style={{
                    fontSize: 9, fontWeight: 700, color: ORANGE,
                    padding: '1px 6px', borderRadius: 4,
                    background: 'color-mix(in srgb, var(--brass-deco) 10%, transparent)', border: '1px solid color-mix(in srgb, var(--brass-deco) 20%, transparent)',
                    fontFamily: 'var(--ed-mono, var(--font-mono))',
                  }}>
                    GAP {g}
                  </span>
                ))}
                <span style={{ fontSize: 11, color: FAINT, fontFamily: 'var(--ed-mono, var(--font-mono))', marginLeft: 'auto' }}>
                  {entry.date}
                </span>
              </div>

              {/* Title */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{
                  display: 'inline-block', fontSize: 12, color: FAINT,
                  transition: 'transform 0.2s ease',
                  transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                }}>{'▶'}</span>
                <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: INK }}>
                  {entry.title}
                </h3>
              </div>

              {/* Expanded content */}
              {isExpanded && (
                <div style={{ marginTop: 16 }}>
                  {entry.auditNote && (
                    <div style={{
                      marginBottom: 14,
                      padding: '10px 12px',
                      borderRadius: 7,
                      border: `1px solid ${stCfg.color}45`,
                      background: `${stCfg.color}0d`,
                      color: INK_SOFT,
                      fontSize: 12,
                      lineHeight: 1.65,
                    }}>
                      <strong style={{ color: stCfg.color }}>Current audit:</strong>{' '}
                      {entry.auditNote}
                    </div>
                  )}
                  <div style={{
                    whiteSpace: 'pre-wrap', fontSize: 13, color: INK_SOFT,
                    lineHeight: 1.8, fontFamily: 'inherit',
                  }}>
                    {entry.content.split('\n\n').map((para, i) => {
                      // Handle bold markers
                      const parts = para.split(/(\*\*[^*]+\*\*)/g);
                      return (
                        <p key={i} style={{ marginBottom: 12 }}>
                          {parts.map((part, j) => {
                            if (part.startsWith('**') && part.endsWith('**')) {
                              return <strong key={j} style={{ color: INK }}>{part.slice(2, -2)}</strong>;
                            }
                            return <span key={j}>{part}</span>;
                          })}
                        </p>
                      );
                    })}
                  </div>

                  {/* Implications */}
                  {entry.implications && entry.implications.length > 0 && (
                    <div style={{
                      marginTop: 16, padding: '12px 16px',
                      background: `${stCfg.color}0d`, borderRadius: 8,
                      border: `1px solid ${stCfg.color}30`,
                    }}>
                      <h4 style={{
                        fontSize: 11, fontWeight: 700, color: stCfg.color,
                        textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8, marginTop: 0,
                      }}>
                        {entry.status === 'confirmed'
                          ? 'Confirmed takeaway'
                          : 'Recorded implications (historical)'}
                      </h4>
                      <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12, color: INK_SOFT, lineHeight: 1.8 }}>
                        {entry.implications.map((imp, i) => (
                          <li key={i}>{imp}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Collapsed preview */}
              {!isExpanded && (
                <p style={{ marginTop: 8, fontSize: 12, color: FAINT, lineHeight: 1.6 }}>
                  {(entry.auditNote || entry.content).slice(0, 220).replace(/\*\*/g, '')}
                  {(entry.auditNote || entry.content).length > 220 ? '…' : ''}
                </p>
              )}
            </div>
          );
        })}

        {/* Corrected relationship map */}
        <div className="card" style={{ marginTop: 24, borderLeft: `3px solid ${PURPLE}` }}>
          <h3 style={{ color: PURPLE, fontSize: 16, marginTop: 0 }}>Corrected Relationship Map</h3>
          <p style={{ color: INK_SOFT, fontSize: 13, lineHeight: 1.8, marginBottom: 16 }}>
            The March log conflated established RH criteria, RH-equivalent bridge formulations,
            and physical analogies. They now carry different evidence grades:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
            {[
              { framework: 'Number Theory', grade: 'Definition of RH', condition: 'All nontrivial zeros on σ = ½', math: '\\zeta(\\rho)=0\\Rightarrow\\Re\\rho=\\tfrac12' },
              { framework: 'Weil Criterion', grade: 'Established equivalent', condition: 'Positivity on the full admissible class', math: 'W[f*\\tilde f]\\ge0\\quad\\forall f' },
              { framework: 'twin-ladder Shift Bridge', grade: 'RH-equivalent and open', condition: 'Positive for every shift', math: 'K_a\\succeq0\\quad\\forall a>0' },
              { framework: 'Circuit Theory', grade: 'Analogy; insufficient', condition: 'Boundary losslessness alone', math: 'S^\\dagger S=I\\;\\not\\Rightarrow\\;\\mathrm{RH}' },
              { framework: 'Spectral Theory', grade: 'Open identification target', condition: 'Self-adjoint operator plus exact divisor map', math: '\\operatorname{Spec}(A)\\stackrel{?}{=}\\{\\gamma_\\rho\\}' },
            ].map((item, i) => (
              <div key={i} style={{ padding: 10, background: 'color-mix(in srgb, var(--accent-deco) 5%, transparent)', borderRadius: 8, border: '1px solid color-mix(in srgb, var(--accent-deco) 15%, transparent)' }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: PURPLE, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>
                  {item.framework}
                </div>
                <div style={{ fontSize: 10, color: ORANGE, marginBottom: 5 }}>{item.grade}</div>
                <div style={{ fontSize: 12, color: INK, fontWeight: 600, marginBottom: 6 }}>{item.condition}</div>
                <BlockMath tex={item.math} />
              </div>
            ))}
          </div>
        </div>

        {/* Related Pages */}
        <div className="card" style={{ marginTop: 24 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: BLUE }}>
            Related Pages
          </h3>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {[
              { to: '/gap-closing', label: 'Gap Closing', color: ORANGE },
              { to: '/formal-proof', label: 'Formal Proof', color: RED },
              { to: '/rh-attack', label: 'RH Approach', color: BLUE },
              { to: '/spectral-attack', label: 'Spectral Approach', color: PURPLE },
              { to: '/connes-adelic', label: 'Connes Adelic Trace', color: PURPLE },
              { to: '/berry-keating-xp', label: 'Berry-Keating H = xp', color: ORANGE },
              { to: '/rigor', label: 'Rigor', color: GREEN },
              { to: '/explorations', label: 'Explorations', color: BLUE },
            ].map(({ to, label, color }) => (
              <Link key={to} to={to} style={{
                padding: '6px 14px', borderRadius: 6,
                background: color + '15', color, fontSize: 12,
                fontWeight: 600, textDecoration: 'none', border: `1px solid ${color}30`,
              }}>
                {label}
              </Link>
            ))}
          </div>
          <p style={{ marginTop: 16, fontSize: 12 }}>
            <Link to="/">← the atlas</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
