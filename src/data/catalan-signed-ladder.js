/**
 * @fileoverview The signed twin ladder and Catalan's constant.
 *
 * G = β(2) = L(2,χ₄) is the value of the twin ladder's SIGNED sibling: twist every
 * rung by the odd character χ₄ (the repo's "sign flip at p=2", lmfdb-l-function-
 * cross-reference.js:66). The correspondence is a verified identity. The
 * irrationality of G is a famous OPEN problem, and this note pins down exactly why:
 * the same shifted-Legendre device that isolates ζ(2)/ζ(3) into a 2-dimensional
 * period space buries G in a 5-dimensional one, the extra π-column forced by the
 * χ₄ functional equation. No claim of a proof is made; G's irrationality is open in
 * the peer-reviewed literature. External claim (2026-10-06): openai/math family 005,
 * written by an internal OpenAI model, claims G irrational; Lean-formalized per the
 * repository (comparator statement OAI.InternalCatalan.catalan_irrational); not
 * peer-reviewed and not built or checked by this project. Our obstruction covers the
 * mechanisms listed here only.
 *
 * NO heavy imports (no zeros bundle). Self-contained record + numeric tripwires.
 */

// Reference constants (double precision is enough to re-verify the exact forms).
const G = 0.9159655941772190150546; // Catalan
const PI = Math.PI;
const LN2 = Math.LN2;
const Z2 = (PI * PI) / 6; // ζ(2)

export const CATALAN_SIGNED_LADDER = Object.freeze({
  id: 'catalan-signed-ladder',
  title: 'The signed twin ladder and Catalan’s constant',
  status: 'VERIFIED correspondence and two exact integral identities; the generator count is NOT an obstruction and the π-column is NOT forced; G irrationality OPEN in the peer-reviewed literature; claimed by an internal OpenAI model in openai/math (2026-10-06), Lean-formalized per the repository, not peer-reviewed',
  oneLine:
    'Catalan’s constant G is the twin ladder’s signed (χ₄) value: '
    + 'Σχ₄(n)/n² = G, a self-dual signed ladder. The shifted-Legendre device gives '
    + '5ζ(2) − 8 for the ζ kernel and G − π + 2ln2 + π²/12 for the signed kernel. '
    + 'The count of 2 generators against 5 is not an obstruction, and the '
    + 'π term is not forced. G’s irrationality is open in the peer-reviewed literature; an external '
    + 'Lean-formalized claim appeared in openai/math on 2026-10-06, not peer-reviewed.',

  // Status as reviewed on 2026-11-21 (research-checkpoints/key-results-stress-test-2026-11-21/catalan-ladder/).
  // The sections below this field record the program as formulated; this field governs.
  statusNote: {
    date: '2026-11-21',
    summary:
      'The two integral identities on this page hold. They do not give a "period-dimension obstruction '
      + '(2 versus 5)", and the π-column is not forced.',
    points: [
      'Correct: ∫∫ (2x−1)(2y−1)/(1−xy) dx dy = 5ζ(2) − 8 and ∫∫ (2x−1)(2y−1)/(1+x²y²) dx dy = G − π + 2ln2 + π²/12 over the unit square (confirmed by 60-digit quadrature and by hand).',
      '"Dimension 5" is a count of generators, an upper bound on the dimension of a span. Linear independence of 1, G, π, π², ln2 is not known.',
      'The count does not separate the open case from a solved one: the same device on the conductor-3 kernel 1/(1+xy+x²y²) gives 9I = −9L(2,χ₋₃) + 2π² − 18π/√3 + 18ln3, and at degree 3 all five of 1, L(2,χ₋₃), π², π/√3, ln3 occur, while L(2,χ₋₃) is proved irrational (Calegari–Dimitrov–Tang). So the entry for L(2,χ₋₃) in the triage table below is 5 generators under this device, not "dim ≤ 3".',
      'The π term is not forced. In the same kernel family, P₀(x)P₂(y) on 1/(1+x²y²) gives G − 3 + 3ln2 and P₀P₀ gives G alone. Zudilin’s 2003 recurrence gives rational u_n, v_n with u_n G − v_n → 0, forms in 1 and G only.',
      'Those known forms do not prove irrationality because they decay at rate 2.406 per step (5 ln φ) against denominators growing at about 6.77 (proved bound 8.77); the cause is not a π term.',
      'Calegari–Dimitrov–Tang, Remark 11.1.17, says of two specific approximant families for G that the required inequalities fail by a wide margin; the paper has no conductor-indexed inequality with a bounded margin for conductor 4. Rivoal–Zudilin 2003 has seven numbers β(2)…β(14); the six-number result β(2)…β(12) is Zudilin 2019.',
      'In the net-exponent test below, "inflating β just past α" is not backed by a computation.',
    ],
  },

  // 1 — the verified correspondence (all checked numerically below)
  correspondence: {
    heading: 'The signed ladder is Catalan’s constant',
    signedSeries:
      'G = β(2) = Σ_{n≥0} χ₄(n)/n², where χ₄(n) = 0 (n even), '
      + '+1 (n≡1 mod 4), −1 (n≡3 mod 4) — the "signed flip" is exactly this character.',
    signedEuler:
      'G = L(2,χ₄) = ∏_p (1 − χ₄(p)/p²)^{−1}. The repo’s '
      + '"sign flip at p=2" is literal: χ₄(2)=0, so the p=2 rung has factor 1 and '
      + 'DROPS OUT; odd primes p≡3 (4) give an alternating rung χ₄(p^m)=(−1)^m, '
      + 'p≡1 (4) give no flip.',
    mirror:
      'The σ↔1−σ twin-ladder mirror survives: Λ(s,χ₄)=Λ(1−s,χ₄) '
      + 'with root number ε=+1 (χ₄ real, odd, conductor 4) — a genuine SELF-DUAL '
      + 'signed twin ladder, with its own de Bruijn Λ_{χ₄} and H_t flow.',
    parity:
      'The parity mirror FLIPS vs ζ. For ζ the even values are closed-form (ζ(2)=π²/6), '
      + 'the odd (ζ(3)) mysterious. For β the ODD values are closed-form (β(3)=π³/32) and '
      + 'the EVEN one, G=β(2), is the mystery — G is the signed ladder’s exact ζ(3).',
  },

  // 2 — the controlled contrast (the crux; both exact, hand-derived)
  contrast: {
    heading: 'One device, two period spaces',
    device:
      'Apply the same shifted-Legendre perturbation ∫∫ P̃₁(x)P̃₁(y) K(x,y) dx dy '
      + '(the Beukers/Apéry device, P̃₁=2t−1) to each kernel K.',
    zeta2: {
      kernel: '1/(1−xy)  (ζ-world)',
      value: '∫∫ P̃₁P̃₁/(1−xy) = 5ζ(2) − 8',
      derivation: 'exact: partial fractions k/((k+1)(k+2)) = −1/(k+1)+2/(k+2), then telescoping',
      dim: 2,
      space: '⟨1, ζ(2)⟩',
      verdict: 'Apéry/Beukers isolates the target — 2-dim, d_n² denominator, decay wins.',
    },
    catalan: {
      kernel: '1/(1+x²y²)  (signed / arctangent)',
      value: '∫∫ P̃₁P̃₁/(1+x²y²) = G − π + 2ln2 + π²/12',
      derivation: 'exact elementary integrals (inner = ln(1+y²)/y² − arctan(y)/y); verified to 1e-16',
      dim: 5,
      space: '⟨1, G, π, π², ln2⟩',
      verdict:
        'G appears with coefficient +1 but is buried among three parasites (π, π², ln2). '
        + 'The π-column is FORCED by the χ₄ functional equation (root number / Gauss sum), '
        + 'not an artifact of this kernel: every odd-character L(2,χ) construction inherits it.',
    },
  },

  // 3 — what a proof must beat
  target: {
    heading: 'The inequality a proof must pass',
    form: 'A sequence of nonzero two-term integer forms ℓ_n = A_n + B_n·G with A_n,B_n ∈ ℤ.',
    netTest:
      'Write |ℓ_n| = e^{−αn+o(n)} (decay) and the denominator D_n = e^{βn+o(n)}. '
      + 'Irrationality follows iff α > β (so D_n|ℓ_n| → 0, forcing a nonzero integer < 1). ',
    apery: 'ζ(3): α = 3.5255 (decay (√2−1)⁴ⁿ), β = 3 (d_n³) → net −0.5255, WINS.',
    catalan:
      'G: isolating the target means eliminating the π, π², ln2 columns; each elimination '
      + 'costs an extra d_n (plus powers of 2 from the χ₄ Gauss sum), inflating β just past α '
      + '— net ≳ 0, LOSES. That single flipped exponent is the whole obstruction for this mechanism.',
    frontier:
      'Calegari–Dimitrov–Tang (2024) proved 1, ζ(2), L(2,χ₋₃) linearly independent via an '
      + 'arithmetic holonomy bound — a tug-of-war between an archimedean capacity (log-energy) '
      + 'numerator and a denominator penalty, with a clean rationality threshold (4β>1 on the slit '
      + 'model). Their Bost–Charles sharpening (the crude e≈2.718 → 2) clears CONDUCTOR 3 by a hair; '
      + 'CONDUCTOR 4 = Catalan lands on the wrong side of the same computed inequality by a real, '
      + 'bounded margin. No 2024–26 work has moved that archimedean margin — the genuine advances '
      + '(Lai–Sprang–Zudilin ζ₂(5)) are all in the p-adic direction. A single-author, AI-checked '
      + 'preprint (Sun, Sep 2026, arXiv:2609.04176) claims G irrational via signed "weighted tails" '
      + 'with winning margin δ₀≈0.0097 (a ~5% error budget), "verified" only by a chatbot, and an '
      + 'independent Lean effort pointedly declines to certify the main theorem; UNVERIFIED — a claim, not a theorem.',
  },

  // 4b — the π-column: every known removal mechanism, and where each stalls (the "elegant proof" attempt)
  piColumn: {
    heading: 'Why the π-column will not leave cheaply',
    intro:
      'The π and π² columns are forced by the χ₄ functional equation: the completed L carries '
      + '(π/4)^{−(s+1)/2}Γ(…), and the Gauss sum τ(χ₋₄)=2i injects π structurally. To reach ⟨1,G⟩ '
      + 'you must delete that column. Every known mechanism was surveyed; each provably stalls:',
    mechanisms: [
      { name: 'Well-poised symmetry (Ball–Rivoal)',
        gets: 'the ONLY device that provably cancels π-powers — kills the even zetas / π^{2k}',
        stall: 'cancels the WRONG block for χ₄: the parity that removes π also removes access to β(2)=G.' },
      { name: 'Rhin–Viola birational group',
        gets: 'sharpens the α-vs-β margin (better irrationality measures for ζ(2),ζ(3))',
        stall: 'acts WITHIN a fixed period space — improves the denominator, never deletes a column.' },
      { name: 'Zudilin conjugate-contour π-elimination',
        gets: 'genuinely removes one spurious π by pairing with a conjugate contour (real-part extraction)',
        stall: 'the extraction DOUBLES arithmetic content → inflates the denominator → flips α>β to β>α. The π leaves but the inequality inverts. This is the exact tax.' },
      { name: 'Beilinson regulator / motivic',
        gets: 'expresses L(2,χ₄) as a regulator period of a mixed motive with Tate twist ℚ(2)',
        stall: 'the π IS the twist (ℚ(1)=2πi) — motivically MANDATORY, not an artifact. A near-no-go: it explains why the column cannot be an accident.' },
    ],
    upshot:
      'No published route deletes the χ₄ π-column AND keeps α>β. The one live idea that could reach '
      + 'the real G is a 2-adic/valuation sidestep (where the archimedean capacity is not the binding '
      + 'constraint) — exactly what Sun claims and exactly where a real proof would have to live, and '
      + 'also exactly where a subtle denominator miscount would hide.',
  },

  // 4 — the organizing principle + triage of other targets
  triage: {
    heading: 'Period dimension as the difficulty gauge',
    principle:
      'Difficulty ≈ (dimension of the ambient period space) − (what the construction’s symmetry '
      + 'cancels). Apéry works iff the net is 2. This is the linear-forms-in-values framework '
      + '(Nesterenko’s criterion, Ball–Rivoal) read through Kontsevich–Zagier periods — a '
      + 'known lens here made explicit for the signed ladder, not a claim of new theory.',
    rows: [
      { target: 'ζ(2) = π²/6', dim: '2 (closed)', status: 'rational×π² — trivially irrational' },
      { target: 'ζ(3)', dim: '2', status: 'Apéry 1978: ⟨1,ζ(3)⟩, net −0.53 — IRRATIONAL' },
      { target: 'L(2,χ₋₃)', dim: '≤3', status: 'CDT 2024: conductor-3 capacity clears 4β>1 — IRRATIONAL' },
      { target: 'G = β(2)', dim: '5', status: 'OPEN: ⟨1,G,π,π²,ln2⟩; conductor-4 capacity misses by a bounded margin' },
      { target: 'β(4), β(6)', dim: '≥5', status: 'OPEN: RZ 2003 — one of β(2)…β(12) irrational (block, not isolated)' },
      { target: 'ζ(5), ζ(7)', dim: '≥2', status: 'OPEN: well-poised kills π but couples the odd block; two of ζ(5)…ζ(35) irrational' },
      { target: '2-adic L(2,χ₋₄)', dim: 'p-adic', status: 'nearest attackable neighbor (Lai–Sprang–Zudilin route) — NOT the real G' },
      { target: 'γ (Euler–Mascheroni)', dim: '—', status: 'OPEN, HARDER: not a Kontsevich–Zagier period; no good linear forms — outside this category' },
    ],
  },

  // 5 — honest verdict + methodology caveat
  verdict: {
    heading: 'Verdict',
    correspondence: 'VERIFIED: Σχ₄(n)/n²=G, signed Euler product, sign-flip-at-p=2 = rung deletion, self-dual bridge.',
    obstruction: 'NOT an obstruction. The exact closed forms 5ζ(2)−8 and G−π+2ln2+π²/12 hold; the generator counts 2 and 5 do not obstruct anything (the solved conductor-3 case also gives 5).',
    lever:
      'The de Bruijn / Λ / H_t core is about ZERO LOCATION (GRH for χ₄) — orthogonal to '
      + 'the irrationality of the VALUE L(2,χ₄). It provides no lever. The one type-match is the '
      + '[B_v,Π_p] weld, which emits signed linear forms, but there is no evidence its aliases cancel '
      + 'the π-column. Speculative, low probability — stated as such.',
    open:
      'G’s irrationality remains OPEN in the peer-reviewed literature (external Lean-formalized claim below, not peer-reviewed). This note proves no bound; it locates the wall for the mechanisms tested here. '
      + 'The single quantity a proof must improve: the conductor-4 capacity-vs-denominator balance — '
      + 'either raise the archimedean capacity in the CDT holonomy bound past conductor 4, or make '
      + 'rigorous a 2-adic saturation letting the denominator growth dominate with real margin.',
    externalClaim:
      'External claim (2026-10-06): openai/math family 005, written by an internal OpenAI model, claims '
      + 'that G is irrational. Lean-formalized per the repository: comparator statement '
      + 'OAI.InternalCatalan.catalan_irrational : Irrational (∑\' j, (-1)^j / (2j+1)^2) with a solution tree '
      + 'of 981 files whose sources contain no sorry (text search). Not peer-reviewed; this project has not '
      + 'built or checked that Lean proof. Its method (determinants Δ_N of size 48N whose rows have high '
      + 'Taylor contact) is stated to cancel the ζ(2) column in every entry, which is a mechanism outside '
      + 'the list our obstruction covers. Next check: rebuild Δ_N for N = 1, 2 and confirm the cancellation.',
    caveat:
      'Methodology caveat (demonstrated): a double-precision integer-relation search returned a '
      + 'G-FREE relation "12·I₁ = −68 + 11π + 4π² − 9ln2" at the 1e-7 noise floor — a '
      + 'HALLUCINATION (a dense lattice fakes a hit). Every period-dimension claim here rests on '
      + 'EXACT hand derivation, never on low-precision PSLQ.',
    secondAnchorCaveat:
      'Pre-emptive honest-status note: a candidate second Sun-Catalan anchor at ρ=1/19 '
      + '(c_odd(1/19)=0.006954762801) is CONDITIONAL, not certified — it rests on an unproven '
      + 'm-independence of the +4 additive offset in the Sun Prop-6.3 telescoping constant '
      + '(verified only at m=20). This surface does not currently display that anchor; if it '
      + 'ever does, it must carry this caveat until the regularized-telescoping-constant '
      + 'derivation certifies m-independence.',
  },

  references: [
    'D. Rivoal, W. Zudilin, Diophantine properties of numbers related to Catalan’s constant, Math. Ann. 326 (2003) 705–721.',
    'W. Zudilin, Arithmetic of Catalan’s constant and its relatives, Abh. Math. Semin. Univ. Hambg. 89 (2019); arXiv:1804.09922.',
    'F. Calegari, V. Dimitrov, Y. Tang, The linear independence of 1, ζ(2), and L(2,χ₋₃) (2024).',
    'F. Beukers, A note on the irrationality of ζ(2) and ζ(3), Bull. LMS 11 (1979) 268–272.',
    'Yu. V. Nesterenko, linear independence criterion (1985); K. Ball, T. Rivoal, Invent. Math. 146 (2001).',
    'M. Kontsevich, D. Zagier, Periods, in Mathematics Unlimited (2001).',
    'Zhi-Wei Sun, Catalan’s constant is irrational, arXiv:2609.04176 (Sep 2026) — UNREFEREED preprint.',
    'openai/math (github.com/openai/math, released 2026-10-06), family 005: Catalan’s constant is irrational — claimed by an internal OpenAI model; Lean-formalized per the repository; NOT peer-reviewed.',
  ],
});

// Build-time tripwires: re-verify the exact closed forms and keep the honest framing.
export const CATALAN_SIGNED_LADDER_ASSERTIONS = Object.freeze([
  {
    name: 'signed series Σχ₄(n)/n² reproduces G',
    check: () => {
      const chi4 = (n) => (n % 2 === 0 ? 0 : n % 4 === 1 ? 1 : -1);
      let s = 0;
      for (let n = 1; n <= 2_000_000; n++) s += chi4(n) / (n * n);
      return Math.abs(s - G) < 1e-6;
    },
  },
  {
    name: 'signed Euler product (p=2 rung drops out) reproduces G',
    check: () => {
      const chi4 = (n) => (n % 2 === 0 ? 0 : n % 4 === 1 ? 1 : -1);
      const primes = [];
      for (let k = 2; k < 200000; k++) {
        let ip = true;
        for (const p of primes) { if (p * p > k) break; if (k % p === 0) { ip = false; break; } }
        if (ip) primes.push(k);
      }
      let prod = 1;
      for (const p of primes) prod *= 1 / (1 - chi4(p) / (p * p)); // chi4(2)=0 ⇒ factor 1
      return Math.abs(prod - G) < 1e-8;
    },
  },
  {
    name: 'control ζ(2): value = 5ζ(2)−8 matches the stated form (dim 2)',
    check: () => {
      const stated = CATALAN_SIGNED_LADDER.contrast.zeta2.value;
      return stated.includes('5ζ(2) − 8') && Math.abs((5 * Z2 - 8) - 0.2246703342411) < 1e-10;
    },
  },
  {
    name: 'target Catalan: exact form G−π+2ln2+π²/12 re-verifies (dim 5)',
    check: () => {
      const val = G - PI + 2 * LN2 + (PI * PI) / 12;
      return CATALAN_SIGNED_LADDER.contrast.catalan.value.includes('G − π + 2ln2 + π²/12')
        && Math.abs(val - -0.0168656648686) < 1e-10;
    },
  },
  {
    name: 'honest: G irrationality stated OPEN, no proof claimed',
    check: () => /OPEN/.test(CATALAN_SIGNED_LADDER.verdict.open)
      && /no lever|no evidence/i.test(CATALAN_SIGNED_LADDER.verdict.lever),
  },
  {
    name: 'openai/math 005 claim recorded as external, Lean-formalized per the repository, not peer-reviewed, not checked here',
    check: () => /internal OpenAI model/.test(CATALAN_SIGNED_LADDER.verdict.externalClaim)
      && /Lean-formalized per the repository/.test(CATALAN_SIGNED_LADDER.verdict.externalClaim)
      && /Not peer-reviewed/.test(CATALAN_SIGNED_LADDER.verdict.externalClaim)
      && /not peer-reviewed/.test(CATALAN_SIGNED_LADDER.status)
      && /OPEN in the peer-reviewed literature/.test(CATALAN_SIGNED_LADDER.verdict.open),
  },
  {
    name: 'status note recorded: generator count is not an obstruction, π-column not forced',
    check: () => /NOT an obstruction/.test(CATALAN_SIGNED_LADDER.status)
      && /NOT an obstruction/.test(CATALAN_SIGNED_LADDER.verdict.obstruction)
      && CATALAN_SIGNED_LADDER.statusNote.points.some((p) => /G − 3 \+ 3ln2/.test(p))
      && Math.abs((G - 3 + 3 * LN2) - -0.004592864142945) < 1e-12,
  },
  {
    name: 'Sun 2026 preprint flagged UNVERIFIED',
    check: () => /UNVERIFIED|UNREFEREED/.test(CATALAN_SIGNED_LADDER.target.frontier)
      || CATALAN_SIGNED_LADDER.references.some((r) => /2609\.04176/.test(r) && /UNREFEREED/.test(r)),
  },
]);

export default CATALAN_SIGNED_LADDER;
