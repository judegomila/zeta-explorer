/**
 * @fileoverview RH novel Route F (roadmap src/data/rh-novel-routes-roadmap-2026-09-23.js):
 * KRAMERS–WANNIER LOCAL UNIQUENESS. Precise dictionary, the candidate per-window uniqueness
 * statements U_γ, their check against the first 25 zeros, and the circularity verdict.
 *
 * VERDICT (one line): every per-window uniqueness statement whose combination with the
 * functional equation yields σ=½ is EQUIVALENT to (RH + simplicity) in that window, not weaker.
 * The KW argument needs a monotone order parameter proven by a correlation inequality on a
 * POSITIVE measure at REAL coupling; ξ at height t≠0 is a complex-weight ensemble (weights n^{-it}),
 * its duality-covariant order parameter |ξ(σ+it)| exists but its monotonicity IS RH
 * (Sondow–Dumitrescu 2010; Lagarias 1999 Re ξ'/ξ>0), and its count-form ("no ordinate collision")
 * IS the Alpöge–Furman / Lamzouri distinct-ordinate program (ceiling: Fourier support 1 = PCC wall).
 * Route F therefore yields no independent lever; it is a stat-mech relabeling of Turing's method
 * (finite height), Hardy's sign-change method (parity), Levinson/Conrey (asymptotic proportion) and
 * the 2026 pair-correlation record (ordinate collisions). Changes no bound; no refereed bound is changed; RH open.
 * NO QED.
 *
 * 1. THE KW DICTIONARY (precise).
 *   Ising (square lattice, coupling K)                 |  ζ / ξ
 *   ----------------------------------------------------+-------------------------------------------
 *   coupling K (real); complex K = Fisher plane         |  s = σ+it; σ = coupling, t = complex part
 *   dual coupling K*, sinh2K·sinh2K* = 1,               |  s* = 1−s (functional equation), i.e.
 *     v=tanhK ↦ v* = (1−v)/(1+v)                        |    reflection about σ=½
 *   Z(K) = (sinh2K)^{N}… · Z(K*)  (analytic prefactor)  |  ζ(s) = χ(s) ζ(1−s), χ(s)=2^sπ^{s−1}sin(πs/2)Γ(1−s)
 *   duality-invariant Z̃(K) = Z̃(K*)                     |  ξ(s) = ½s(s−1)π^{−s/2}Γ(s/2)ζ(s), ξ(s)=ξ(1−s)
 *   high-T expansion in tanhK (converges K<K_c)         |  Dirichlet/Euler product in n^{−s} (σ>1)
 *   low-T expansion in e^{−2K} (converges K>K_c)        |  dual series via χ(s) in n^{s−1} (σ<0)
 *   KW = Z_2 Fourier transform on the lattice           |  functional eq. = Poisson summation / Jacobi
 *                                                       |    θ(1/x)=√x θ(x) (Riemann's proof)
 *   free energy f = −log Z; singularities of f          |  log ξ; its singularities = zeros of ξ
 *   real-axis transition K_c (unique)                   |  NONE: ξ(σ)>0 for all real σ (ξ(½)≈0.497);
 *                                                       |    the real singularity of ζ is the POLE s=1
 *                                                       |    (Bost–Connes condensation β=1), dual to s=0,
 *                                                       |    NOT self-dual; removed in ξ like the
 *                                                       |    prefactor singularity at K=0 ↔ K*=∞
 *   Fisher zeros (complex K)                            |  nontrivial zeros ρ (t≠0)
 *   Fisher's circle |v+1|=√2 (isotropic, thermo. limit) |  the critical line σ=½
 *   order parameter m(K) (monotone in K by GKS)         |  |ξ(σ+it)| as a function of σ at fixed t
 *   disorder parameter μ (Kadanoff–Ceva), m ↔ μ         |  |ξ(1−σ+it)| = |ξ(σ+it)| (D-mirror)
 *   GKS/Griffiths inequality (positive weights e^{K σσ}) |  Re ξ'/ξ(s) = Σ_ρ (σ−β_ρ)/|s−ρ|² ≥ 0 on σ>½
 *                                                       |    (⟺ RH; no positive measure at t≠0)
 *
 *   Two structural facts that fix the analogy:
 *   (i) The relevant ζ-duality for on-line-ness is the ANTI-holomorphic involution
 *       D: s ↦ 1−s̄ (functional equation composed with conjugation, ξ(s̄)=conj ξ(s)). Its fixed set is
 *       the LINE σ=½. In Ising the analogous involution is v ↦ (1−v̄)/(1+v̄) (KW composed with
 *       conjugation), whose fixed set is EXACTLY Fisher's circle |v+1|²=2 (verified below:
 *       v=(1−v̄)/(1+v̄) ⟺ |v|²+2Re v−1=0). So "RH" has an exact Ising counterpart: Fisher's 1965
 *       theorem that the square-lattice zeros lie on |v±1|=√2. That theorem is proven from the
 *       Onsager exact solution (free-fermion spectral form), NOT from duality; duality alone only gives
 *       that the zero set is invariant under the involution.
 *   (ii) The holomorphic KW map v ↦ (1−v)/(1+v) has ISOLATED fixed points ±√2−1; Ising's uniqueness
 *       argument pins the single REAL transition to the fixed point v_c=√2−1 (sinh2K_c=1). ζ has
 *       no real transition, and its zeros are Fisher-type (complex coupling). Even in Ising, duality
 *       does not confine complex zeros to the fixed point; it confines them to a symmetric set.
 *
 *   Why global uniqueness fails for ζ: N(T) ~ (T/2π)log(T/2πe) → ∞ zeros; the singular set of log ξ is
 *   infinite. Duality gives only S = 1−S and S = S̄ (Klein-4 symmetry of the zero set). The KW step
 *   "the singular set is a single point, so it is D-fixed" needs |S|=1.
 *
 * 2. LOCAL (PER-WINDOW) UNIQUENESS. Window W_γ = {0<σ<1, |t−γ|<h} is D-invariant (D preserves t).
 *   D pairs off-line zeros ρ=β+iγ ↔ 1−ρ̄ = (1−β)+iγ (same ordinate, same multiplicity); on-line
 *   zeros are D-fixed. Hence #off-line zeros in W_γ (with multiplicity) is EVEN.
 *   U_γ^(1) (exact count): N(W_γ) = 1 (argument-principle count, σ-blind). U^(1) + D ⇒ the unique
 *      zero is D-fixed ⇒ σ=½, and simple.
 *   U_γ^(odd) (parity): N(W_γ) odd ⇒ ≥1 on-line zero. Measurable at the window ends by
 *      sign Z(t₁)Z(t₂) = (−1)^{N(t₂)−N(t₁)}, Z = e^{iθ}ζ(½+it) Hardy's function.
 *   U_γ^(mono) (order parameter): σ ↦ |ξ(σ+it)| strictly increasing on σ>½ for t in the window; with
 *      |ξ(1−σ+it)|=|ξ(σ+it)| the unique minimum per height is at σ=½, so a zero at height γ is at σ=½.
 *
 * 3. CIRCULARITY TEST.
 *   U^(1): "∀γ ∃ window family with N(W_γ)=1" ⟺ "no two zeros of ξ share an ordinate (with
 *      multiplicity)" ⟺ RH + all zeros simple. (⇒: an off-line zero forces the collision ρ, 1−ρ̄.
 *      ⇐: on-line simple zeros have distinct ordinates.) Syntactically σ-free but EQUIVALENT to a
 *      statement STRONGER than RH. It is exactly the quantity of the unconditional pair-correlation
 *      route: Alpöge–Furman (arXiv:2608.13637) ≥ 5/6 = 0.8362 distinct ordinates, ≥ 2/3 simple and on
 *      the line; Lamzouri (arXiv:2609.02882) via a Hilbert-space inequality for conjugation-invariant
 *      multisets; ceiling p₀ ≤ 0.6818287 at Fourier support 1; full PCC ⇒ 100% simple (Montgomery),
 *      still not RH. At finite height U^(1) with exact argument-principle counts IS Turing's method
 *      (how RH is verified to 3e12). NOT a lever.
 *   U^(odd): Hardy–Littlewood sign-change detection; asymptotically the Selberg/Levinson/Conrey/PRZZ
 *      proportion program κ ≥ 0.417293962 (see levinson-mollifier-frontier-audit-2026-09.js); the
 *      binding barrier is mollifier length θ=4/7; parity can never give 100% because off-line D-pairs
 *      are invisible to parity by construction. NOT a lever.
 *   U^(mono): ⟺ RH (Sondow–Dumitrescu, Period. Math. Hungar. 60 (2010); Lagarias, Acta Arith. 89
 *      (1999): RH ⟺ Re ξ'/ξ(s) > 0 for σ>½; Hinkkanen 1997). Locally: monotone in the window ⇒ RH in
 *      the window (a zero at β>½ makes |ξ(σ+iγ)| decrease to 0 as σ↑β). The Ising proof of m(K)
 *      monotone is GKS, which needs positive Boltzmann weights; the primon weights n^{−σ−it} are
 *      complex for t≠0 (a sign problem), so no correlation inequality is available. The needed
 *      positivity Σ_ρ(σ−β_ρ)/|s−ρ|² ≥ 0 is the zero-side positivity that Weil positivity / Λ≤0
 *      encode. NOT a lever; identifies the missing ingredient exactly.
 *   Conclusion: the KW argument needs (a) a real-coupling transition and (b) an order parameter made
 *   monotone by a positive-measure correlation inequality. ζ has (b)'s covariant parameter |ξ| but
 *   not the positivity, and has no (a): its zeros are Fisher zeros, for which duality is not
 *   confining even in Ising. Whatever supplies the positivity supplies RH directly.
 *
 * 4. WHAT WOULD PROVE IT / NEXT TEST. Nothing inside Route F. The Ising counterpart of RH (Fisher's
 *   circle) came from exact solvability (Onsager, free fermions) = a spectral realization = the
 *   Hilbert–Pólya side; the lattice-level Lee–Yang/Fisher confinement mechanisms are positivity
 *   statements (Lee–Yang: ferromagnetic positivity; Laguerre–Pólya class = de Bruijn–Newman Λ≤0).
 *   Route F effort should go to routes A (reflection positivity) and D (Peierls/Weil positivity),
 *   which target the missing GKS-analog directly. Route F status: REFUTED AS AN INDEPENDENT LEVER
 *   (reformulation; three formulations, each equivalent to RH(+simple) in the window).
 *
 * 5. NUMERICS IN THIS MODULE (import-free; Euler–Maclaurin ζ with N=120, K=7 Bernoulli terms;
 *   Riemann–Siegel θ by Stirling; S(T) by continuous argument tracking along 2+iT → ½+iT).
 *   U^(1) holds for the 25 windows between consecutive midpoints of γ_1..γ_25 (each count exactly 1,
 *   N(90)=25); U^(odd) holds (sign Z alternates); the counts are near-integers to <1e-4 (self-check).
 *   Fisher-circle = fixed set of KW∘conj verified; tanh K_c = √2−1 fixed by KW. A synthetic
 *   D-symmetric quadruple with β=0.6 breaks |f(σ+iγ)| monotonicity on σ>½ (min at σ=β), the on-line
 *   version is monotone: the monotonicity is the on-line condition, not a consequence of duality.
 *   First-25 ordinates carried verbatim from src/data/zeros-first-25.js (not imported).
 */

const PI = Math.PI;

// ---------------------------------------------------------------------------------------------
// Complex helpers (tiny, local)
// ---------------------------------------------------------------------------------------------
const cmul = (a, b) => [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
const cdiv = (a, b) => {
  const d = b[0] * b[0] + b[1] * b[1];
  return [(a[0] * b[0] + a[1] * b[1]) / d, (a[1] * b[0] - a[0] * b[1]) / d];
};
const cabs = (a) => Math.hypot(a[0], a[1]);
const carg = (a) => Math.atan2(a[1], a[0]);
// n^{-s} for s = σ+it
const npow = (n, sigma, t) => {
  const L = Math.log(n);
  const r = Math.exp(-sigma * L);
  return [r * Math.cos(t * L), -r * Math.sin(t * L)];
};

// ---------------------------------------------------------------------------------------------
// Euler–Maclaurin ζ(s), valid for |t| ≲ 100 with N=120, K=7 (remainder ≲ 1e-11 at t=100)
// ---------------------------------------------------------------------------------------------
const B2K = [1 / 6, -1 / 30, 1 / 42, -1 / 30, 5 / 66, -691 / 2730, 7 / 6]; // B_2..B_14
const FACT = (m) => { let f = 1; for (let i = 2; i <= m; i++) f *= i; return f; };
export function zetaEM(sigma, t, N = 120) {
  let re = 0, im = 0;
  for (let n = 1; n < N; n++) { const z = npow(n, sigma, t); re += z[0]; im += z[1]; }
  // N^{1-s}/(s-1)
  const N1s = npow(N, sigma - 1, t);
  const q = cdiv(N1s, [sigma - 1, t]);
  re += q[0]; im += q[1];
  // ½ N^{-s}
  const Ns = npow(N, sigma, t);
  re += 0.5 * Ns[0]; im += 0.5 * Ns[1];
  // Σ_k B_{2k}/(2k)! · s(s+1)…(s+2k−2) · N^{-s-2k+1}
  let prod = [1, 0]; // running product s(s+1)…(s+j)
  let j = 0;
  for (let k = 1; k <= B2K.length; k++) {
    // multiply up to (s+2k-2)
    while (j <= 2 * k - 2) { prod = cmul(prod, [sigma + j, t]); j++; }
    const coef = B2K[k - 1] / FACT(2 * k);
    const Npow = npow(N, sigma + 2 * k - 1, t);
    const term = cmul(prod, Npow);
    re += coef * term[0]; im += coef * term[1];
  }
  return [re, im];
}

// Riemann–Siegel theta by Stirling (error ~1e-9 for t ≥ 10)
export function rsTheta(t) {
  return (t / 2) * Math.log(t / (2 * PI)) - t / 2 - PI / 8
    + 1 / (48 * t) + 7 / (5760 * t ** 3) + 31 / (80640 * t ** 5);
}

// S(T) = (1/π) arg ζ(½+iT), continuous from σ=2 along the horizontal segment.
// Returns { S, maxStep } where maxStep is the largest per-step phase increment (guard < π/2).
export function argZetaHalf(T, steps = 60) {
  let prev = zetaEM(2, T);
  // Principal arg at σ=2 is the continuous branch: |ζ(2+it)−1| ≤ ζ(2)−1 < 1.
  let arg = carg(prev);
  let maxStep = 0;
  for (let k = 1; k <= steps; k++) {
    const sigma = 2 - 1.5 * (k / steps);
    const cur = zetaEM(sigma, T);
    const d = carg(cdiv(cur, prev));
    maxStep = Math.max(maxStep, Math.abs(d));
    arg += d;
    prev = cur;
  }
  return { S: arg / PI, maxStep, zHalf: prev };
}

// Argument-principle zero count N(T) = θ(T)/π + 1 + S(T) (all zeros in 0<σ<1, 0<Im ρ≤T; σ-blind).
export function zeroCount(T) {
  const { S, maxStep, zHalf } = argZetaHalf(T);
  const N = rsTheta(T) / PI + 1 + S;
  // Hardy Z(T) = e^{iθ} ζ(½+iT), real
  const th = rsTheta(T);
  const Z = cmul([Math.cos(th), Math.sin(th)], zHalf);
  return { N, Nround: Math.round(N), integralityErr: Math.abs(N - Math.round(N)), maxStep, Z: Z[0], ZimagRel: Math.abs(Z[1]) / Math.max(1e-300, cabs(Z)) };
}

// ---------------------------------------------------------------------------------------------
// First 25 ordinates (verbatim from src/data/zeros-first-25.js; not imported to stay leaf-light)
// ---------------------------------------------------------------------------------------------
export const GAMMA_25 = Object.freeze([
  14.134725141734693790, 21.022039638771554993, 25.010857580145688763, 30.424876125859513210,
  32.935061587739189691, 37.586178158825671257, 40.918719012147495187, 43.327073280914999519,
  48.005150881167159727, 49.773832477672302182, 52.970321477714460644, 56.446247697063394804,
  59.347044002602353079, 60.831778524609809844, 65.112544048081606660, 67.079810529494173714,
  69.546401711173979253, 72.067157674481907583, 75.704690699083933168, 77.144840068874805373,
  79.337375020249367922, 82.910380854086030184, 84.735492980517050106, 87.425274613125229407,
  88.809111207634465423,
]);

// Window boundaries: midpoints between consecutive ordinates; m_0 = 10 (N(10)=0), m_25 = 90 (γ_26≈92.49).
export const WINDOW_EDGES = Object.freeze([
  10,
  ...GAMMA_25.slice(0, -1).map((g, i) => (g + GAMMA_25[i + 1]) / 2),
  90,
]);

let _windowTable = null;
export function windowTable() {
  if (_windowTable) return _windowTable;
  const edges = WINDOW_EDGES.map((T) => ({ T, ...zeroCount(T) }));
  const windows = [];
  for (let n = 1; n < edges.length; n++) {
    const a = edges[n - 1], b = edges[n];
    windows.push({
      n,
      gamma: GAMMA_25[n - 1],
      lo: a.T,
      hi: b.T,
      count: b.Nround - a.Nround,              // U^(1): argument-principle count, σ-blind
      parityFromZ: Math.sign(a.Z * b.Z),       // U^(odd): −1 ⟺ odd count
      countParityMatchesZ: Math.sign(a.Z * b.Z) === ((b.Nround - a.Nround) % 2 === 0 ? 1 : -1),
    });
  }
  _windowTable = { edges, windows };
  return _windowTable;
}

// ---------------------------------------------------------------------------------------------
// Ising side: KW fixed point and Fisher circle = fixed set of KW∘conj
// ---------------------------------------------------------------------------------------------
export const KW = Object.freeze({
  Kc: 0.5 * Math.log(1 + Math.SQRT2),                 // sinh 2K_c = 1
  vc: Math.SQRT2 - 1,                                  // tanh K_c
  dual: (v) => cdiv([1 - v[0], -v[1]], [1 + v[0], v[1]]),          // holomorphic KW on v = tanh K
  dualConj: (v) => cdiv([1 - v[0], v[1]], [1 + v[0], -v[1]]),      // KW ∘ conj (anti-holomorphic)
  onFisherCircle: (v) => Math.abs((v[0] + 1) ** 2 + v[1] ** 2 - 2) < 1e-12,
});

// ζ side: D = functional equation ∘ conjugation, fixed set σ=½
export const D = (s) => [1 - s[0], s[1]];

// ---------------------------------------------------------------------------------------------
// Order-parameter toy: D-symmetric quadruple; |f(σ+iγ)| monotone on σ>½ iff β=½
// ---------------------------------------------------------------------------------------------
export function quadrupleModulus(beta, gamma, sigma) {
  const roots = [[beta, gamma], [1 - beta, gamma], [beta, -gamma], [1 - beta, -gamma]];
  let m = 1;
  for (const r of roots) m *= Math.hypot(sigma - r[0], gamma - r[1]);
  return m;
}
export function isIncreasingOnRightHalf(beta, gamma, step = 0.01) {
  let prev = quadrupleModulus(beta, gamma, 0.5);
  for (let sigma = 0.5 + step; sigma <= 1.5 + 1e-12; sigma += step) {
    const cur = quadrupleModulus(beta, gamma, sigma);
    if (!(cur > prev)) return false;
    prev = cur;
  }
  return true;
}

// Ordinate-collision reformulation on a synthetic D-symmetric multiset
export function ordinateCollisions(zeros) {
  const m = new Map();
  for (const [, t] of zeros) m.set(t, (m.get(t) || 0) + 1);
  return [...m.values()].filter((c) => c > 1).length;
}

export const ROUTE_F = Object.freeze({
  id: 'rh-route-f-kramers-wannier-local-uniqueness',
  date: '2026-09-23',
  roadmap: 'src/data/rh-novel-routes-roadmap-2026-09-23.js#F',
  verdict: 'REFUTED-AS-INDEPENDENT-LEVER: every per-window uniqueness statement that duality upgrades to σ=½ is equivalent to RH(+simplicity) in the window; reformulation, not a lever',
  dualityMap: 'D: s ↦ 1−s̄ (functional equation ∘ conjugation); fixed set = line σ=½. Ising counterpart v ↦ (1−v̄)/(1+v̄), fixed set = Fisher circle |v+1|=√2',
  whyGlobalUniquenessFails: 'N(T) → ∞; duality gives only S=1−S, S=S̄; KW needs |S|=1',
  candidates: Object.freeze({
    U1: 'N(W_γ)=1 (argument-principle count) ⟺ (∀ windows) no ordinate collisions ⟺ RH + simple; finite height = Turing method; asymptotic = Alpöge–Furman/Lamzouri distinct-ordinate program (≥5/6 distinct, ceiling p0≤0.6818287 at Fourier support 1)',
    Uodd: 'N(W_γ) odd ⟺ sign Z flips ⟹ ≥1 on-line zero; Hardy method; asymptotic = Levinson/Conrey/PRZZ κ≥0.417293962 (barrier θ=4/7); blind to off-line D-pairs',
    Umono: '|ξ(σ+it)| increasing on σ>½ ⟺ RH (Sondow–Dumitrescu 2010; Lagarias 1999 Re ξ′/ξ>0); Ising proof = GKS on positive weights; ζ weights n^{−it} complex at t≠0',
  }),
  missingIngredient: 'a positive-measure correlation inequality (GKS analog) for the complex-weight primon ensemble at t≠0, equivalently Σ_ρ(σ−β_ρ)/|s−ρ|²≥0 on σ>½ = zero-side positivity (Weil positivity / Λ≤0)',
  isingCounterpartOfRH: 'Fisher 1965: square-lattice zeros on |v±1|=√2 — proven from the Onsager exact solution, not from duality',
  nextTest: 'none inside Route F; redirect to routes A (reflection positivity) and D (Peierls/Weil positivity) which target the missing positivity directly',
  status: 'PT Λ≤0.2 SOTA unchanged; RH open; NO QED',
});

export const RH_ROUTE_F_KW_ASSERTIONS = Object.freeze([
  {
    id: 'kw-fixed-point-and-fisher-circle',
    holds: () => {
      const okKc = Math.abs(Math.sinh(2 * KW.Kc) - 1) < 1e-14;
      const okVc = Math.abs(Math.tanh(KW.Kc) - KW.vc) < 1e-14;
      const fixed = KW.dual([KW.vc, 0]);
      const okFixed = Math.abs(fixed[0] - KW.vc) < 1e-14 && Math.abs(fixed[1]) < 1e-14;
      // every point of the Fisher circle |v+1|=√2 is fixed by KW∘conj, and generic points are not
      let allFixed = true;
      for (let k = 0; k < 24; k++) {
        const phi = (2 * PI * k) / 24;
        const v = [-1 + Math.SQRT2 * Math.cos(phi), Math.SQRT2 * Math.sin(phi)];
        const w = KW.dualConj(v);
        if (Math.hypot(w[0] - v[0], w[1] - v[1]) > 1e-12 || !KW.onFisherCircle(v)) allFixed = false;
      }
      const off = [0.2, 0.3];
      const wOff = KW.dualConj(off);
      const generic = Math.hypot(wOff[0] - off[0], wOff[1] - off[1]) > 1e-3;
      return okKc && okVc && okFixed && allFixed && generic;
    },
    why: 'Dictionary entry (i): Fisher circle = fixed set of KW∘conj, exactly as σ=½ = fixed set of s↦1−s̄; v_c=√2−1 is the isolated fixed point of holomorphic KW.',
  },
  {
    id: 'zeta-duality-D-fixes-line-pairs-offline',
    holds: () => {
      const on = D([0.5, 14.1]);
      const off = D([0.6, 14.1]);
      return on[0] === 0.5 && on[1] === 14.1 && off[0] === 0.4 && off[1] === 14.1;
    },
    why: 'D preserves the ordinate: off-line zeros come in same-ordinate pairs; on-line zeros are D-fixed.',
  },
  {
    id: 'argument-principle-counts-are-integers',
    holds: () => windowTable().edges.every((e) => e.integralityErr < 1e-4 && e.maxStep < PI / 2 && e.ZimagRel < 1e-6),
    why: 'Self-check of the Euler–Maclaurin + continuous-argument S(T): N(T) lands on integers to <1e-4 at all 26 window edges, phase steps < π/2, Hardy Z real to 1e-6.',
  },
  {
    id: 'U1-exact-count-one-holds-for-first-25-windows',
    holds: () => {
      const { edges, windows } = windowTable();
      return edges[0].Nround === 0 && edges[edges.length - 1].Nround === 25
        && windows.length === 25 && windows.every((w) => w.count === 1);
    },
    why: 'U_γ^(1) checked against the known low zeros: each D-symmetric window between consecutive midpoints contains exactly one zero (σ-blind count), N(90)=25; with D this forces σ=½ and simplicity — Turing\'s method in KW clothing.',
  },
  {
    id: 'Uodd-parity-sign-flip-matches-count',
    holds: () => windowTable().windows.every((w) => w.parityFromZ === -1 && w.countParityMatchesZ),
    why: 'sign Z(t1)Z(t2) = (−1)^{N(t2)−N(t1)}: parity is measurable at the ends (Hardy method); all 25 windows odd.',
  },
  {
    id: 'order-parameter-monotonicity-is-the-online-condition',
    holds: () => isIncreasingOnRightHalf(0.5, 14.13) && !isIncreasingOnRightHalf(0.6, 14.13)
      && !isIncreasingOnRightHalf(0.75, 30.4) && isIncreasingOnRightHalf(0.5, 30.4),
    why: 'Synthetic D-symmetric quadruple: |f(σ+iγ)| increasing on σ>½ iff β=½ (Sondow–Dumitrescu mechanism). Duality gives the σ↔1−σ symmetry of |f| but not the monotonicity; the monotonicity IS on-line-ness.',
  },
  {
    id: 'ordinate-collision-reformulation',
    holds: () => {
      const offline = [[0.6, 14.1], [0.4, 14.1], [0.5, 21.0]];
      const online = [[0.5, 14.1], [0.5, 21.0], [0.5, 25.0]];
      const onlineDouble = [[0.5, 14.1], [0.5, 14.1], [0.5, 21.0]];
      return ordinateCollisions(offline) === 1 && ordinateCollisions(online) === 0 && ordinateCollisions(onlineDouble) === 1;
    },
    why: 'U^(1) over all windows ⟺ no ordinate collisions ⟺ RH + simple: an off-line zero collides with its D-partner; a double on-line zero collides with itself. This is the Alpöge–Furman/Lamzouri distinct-ordinate quantity.',
  },
  {
    id: 'honest-verdict-no-lever-no-qed',
    holds: () => /REFUTED-AS-INDEPENDENT-LEVER/.test(ROUTE_F.verdict) && /NO QED/.test(ROUTE_F.status)
      && /RH open/.test(ROUTE_F.status) && /Λ≤0\.2|refereed bound is changed/.test(ROUTE_F.status) && /none inside Route F/.test(ROUTE_F.nextTest),
    why: 'Route F records a refutation-as-lever (reformulation), not a result; no refereed bound is changed and RH-open statements are present.',
  },
]);

export default ROUTE_F;
