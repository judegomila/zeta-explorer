import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';

// Constants referenced by the separate Dyson / collision-flow research lane.
const C_ASYM = 0.9027902227683418;
const C_OBSERVED_MIN = 0.9015828375;
const EXCURSION_CAP = 0.5073;
const THEOREM_A_CAP = 0.25;

const GLOBAL_FRONTIER = {
  id: 'T3',
  tag: 'twin-ladder-exact-residual',
  color: '#ef4444',
  badge: 'SOLE GLOBAL RH FRONTIER',
  title: 'T3: exact Twin Ladder residual inequality',
  status: 'OPEN · RH-EQUIVALENT',
  body: [
    'For every a > 0 and every finite test in the upper half-plane C_+, prove the ' +
    'Hermitian-form inequality D_{a,R} + K_a^(S) ⪰ -K_{a,0}. Equivalently, the ' +
    'finite matrix associated to D_{a,R} + K_a^(S) + K_{a,0} must be positive ' +
    'semidefinite for every choice of test points and coefficients.',
    'The exact kernel decomposition is K_a = K_{a,0} + D_{a,R} + K_a^(S), where ' +
    'K_{a,0} ⪰ 0 is the genuine positive core. The residual D_{a,R} has a ' +
    'second-order cancellation through cos(ps) - 1, while K_a^(S) is the second ' +
    'indefinite channel. A crude absolute-value estimate spends the entire ' +
    'positive core, so the missing step is a cancellation-sensitive ' +
    'Volterra/derivative estimate controlling both channels together.',
    'T26 sharpens the quantifier: for any prescribed positive sequence a_n → 0, ' +
    'positivity at infinitely many indices already implies RH. This replaces the ' +
    'all-thickness continuum by a discrete exact target, but does not prove one ' +
    'missing small-thickness sign. Promotable progress must supply a new zeta-specific ' +
    'lemma or rigorously refute a proposed exact-kernel bridge.',
  ],
  links: [
    { to: '/twin-ladder', label: 'Twin Ladder Explorer' },
    { to: '/closure-routes', label: 'Closure Routes' },
    { to: '/route-map', label: 'Route Map' },
  ],
};

const CHANNEL_SPLIT_CERTIFICATE = {
  status: 'RIGOROUS FINITE ALLOCATION COUNTEREXAMPLE',
  title: 'No PSD partition of the positive core repairs both channels',
  configuration: 'a = 1/4,  z = (−1/2, 0, 1/2) + i/5',
  betaR: 'βR > 1.027286016',
  betaS: 'βS > 0.42200180358',
  betaSum: 'βR + βS > 1.449287819 > 1',
  radialFullCore: 'vR*(GR + G0)vR < 0',
  compensation: '−1.5588799×10⁻⁹ + 4.1550097×10⁻⁹ = 2.5961298×10⁻⁹',
  coupledTarget:
    'Radial and shear are symmetric and skew combinations of one exact theta tensor. ' +
    'The interval-energy and finite-difference terms cancel algebraically to one real ' +
    'symmetric correlation kernel, whose parity blocks preserve the full coupling. ' +
    'Each fixed integration slice is indefinite, and a generic positive weight has an ' +
    'exact negative block, so any positivity must be theta-specific and emerge only ' +
    'after integration.',
  method:
    '256-bit Arb · exact one-dimensional Laplace-product factorization · ' +
    'combined omission error < 10⁻²² · independent acb_dirichlet_xi cross-check',
  jetConfiguration: 'a = 1/4,  z* = i/5,  Taylor jets through derivative order four',
  jetOrder2: 'inertia(J0 + JR) = (2 positive, 1 negative, 0 zero)',
  jetOrder2Rescue:
    '−6.25849035165×10⁻⁹ + 1.59019647623×10⁻⁸ ≈ 9.64347441063×10⁻⁹',
  jetOrder4: 'R = N + Q,  N ⪯ 0 has rank 4,  Q ⪰ 0 has rank 1',
  jetOrder4Rescue:
    '−0.00274013664134 + 0.00419290185547 ≈ 0.00145276521413',
  jetMethod:
    '768-bit Arb · Laplace moments through order eight · all omission bounds ' +
    '< 7.776×10⁻⁶⁹ · independent completed-ξ power-series check',
};

const ONE_POINT_JET_HIERARCHY = {
  status: 'PROVED EXACT REFORMULATION',
  title: 'One point is enough only when every jet order is controlled',
  fixedA: '∀d ≥ 0:  Jₐ⁽ᵈ⁾(z*) ⪰ 0  ⇔  Kₐ ⪰ 0 globally  (fixed a)',
  sequence: '∀n,d:  Jₐₙ⁽ᵈ⁾(z*) ⪰ 0 with aₙ ↓ 0  ⇔  RH',
  caveat:
    'The two-variable kernel is entire after its diagonal singularity is removed, so ' +
    'global Taylor convergence proves the reverse implication and confluent ' +
    'Vandermonde limits prove the forward implication. This removes the need to scan ' +
    'evaluation centers; it does not provide a finite-order bound.',
  finiteWarning:
    'A rigorous de Branges toy kernel can have a positive jet through any prescribed ' +
    'finite order at a fixed center while remaining globally negative at a distant ' +
    'upper-half-plane zero. This rules out a universal cutoff based only on entireness ' +
    'and kernel structure; it does not rule out new zeta-specific input.',
};

const MARKOV_NORMALIZATION = {
  status: 'PROVED EXACT FRONTIER MAP',
  title: 'The fixed-thickness frontier is one Wiener–Hopf phase condition',
  rowMass: 'mₐ(t) = 2(∫₀∞ Pₐ(u)du)(∫|t|∞ Qₐ(u)du)',
  equivalence: 'fixed a:  Twin Ladder positivity  ⇔  𝖯ₐ ⪰ 0 on L²(mₐ dt)',
  sameSign:
    'fixed a:  𝒜ₐ ⪰ 0  ⇔  X(w−a)/X(w+a) is Schur on Re w > 0  ⇔  full kernel PSD',
  divisor:
    'fixed a:  𝒜ₐ ⪰ 0  ⇔  m(λ) ≤ m(λ−2a) for every zero with Re λ > a',
  sequence:
    'any aₙ → 0⁺:  𝒜ₐₙ ⪰ 0 for infinitely many n  ⇔  RH',
  outer: 'unconditional outer ray:  a ≥ 1/2  ⇒  𝒜ₐ ⪰ 0 and full kernel PSD',
  halfAnchor:
    'a = 1/2:  B(w) = ξ(w)/ξ(w+1) is inner unconditionally; ordinary Clark positivity is automatic',
  poisson:
    'RH  ⇔  q(t) = ∫ dμ(u)/((t−u)² + 1/4) for one positive weighted measure μ',
  dyadic:
    'R₂ₐ(w) = Rₐ(w−a)Rₐ(w+a); arbitrary-depth counterpackets block descent to a/2',
  crossScale:
    'exact Qₐ = 𝒜ₐ⁄₂/𝒜ₐ:  det Q₁⁄₂(0, 1/10) = −0.0001676906566…  (certified)',
  crossScaleScope:
    'same test: det 𝒜₁⁄₂ > 6.2560×10⁻⁵ and det 𝒜₁⁄₄ > 1.4539×10⁻⁵',
  landen:
    'tested nome-power / even-index identities translate t and preserve |a|',
  explicitFormula:
    'direct half-Poisson deconvolution = full Guinand–Weil; every nonempty pure prime grouping is indefinite',
  compensatedPrime:
    'all-positive finite-group compact repair needs infinite aggregate charge; no convergent scalar allocation reconstructs Weil',
  tempered:
    'RH ⇔ e^{|u|/2} q̂(u)/(2π) admits a tempered distributional extension',
  weightedPnt:
    'RH ⇔ 2√x − 2 − Σₙ≤ₓ Λ(n)/√n = O((log x)³)',
  finiteModes:
    'any nonzero fixed reflected finite raw packet: qF,p(t) = −4(r+1)p/t² + O(t⁻³)',
  gaussian:
    'Gσ=Ψ*φσ: qσ=q+σ² and Wσ=W+σ²δ₀; positivity of its inverse half-Poisson target ⇔ RH',
  cellQuotient:
    'positive Jacobi cells C*c=A with ℱ₂c=q/2>0; e^{|u|}c is exactly the RH-equivalent Weil target',
  gradedBackward:
    'e^{λ|u|}c tempered/PD ⇔ λ/2 ≤ Re ρ ≤ 1−λ/2; any positive rung would prove a uniform zero strip',
  levy:
    'certified κ₄ = (log ξ)⁽⁴⁾(1) = −0.00044176332757…; not classically infinitely divisible',
  edge:
    'Jacobi edge redraw:  ℛₐ*ℛₐ = (I + 𝖯ₐ)/2;  𝖯ₐ ⪰ 0 ⇔ ℛₐ*ℛₐ ⪰ I/2',
  douglas:
    'Douglas:  Γ₋ₐ = DₐΓₐ, ‖Dₐ‖ ≤ 1; uniqueness forces Dₐ = TΘₐ*',
  hankel:
    'certified:  Ψ(0)Ψ(1/5) − Ψ(1/10)² < −0.4695376253506527',
  infinitesimal:
    'a ↓ 0:  𝖳₀ ⪰ 0  ⇔  −Im(Ξ′/Ξ) ≥ 0 on C₊  ⇔  RH',
  boundary:
    'off-axis zero dipoles vanish on the real boundary; boundary sign cannot detect them',
  cubic:
    'v = (4,−10,7):  vᵀ𝒜⁽³⁾v < −6.1770462820×10⁻⁵  (certified)',
  structure:
    'After row normalization, the complete correlation kernel is always a ' +
    'positivity-preserving, self-adjoint Markov contraction with spectrum in [−1,1]. ' +
    'The new Wiener–Hopf identity writes the same-sign block as one half of a Toeplitz ' +
    'self-commutator. Cowen rigidity removes every analytic remainder for the completed-ξ ' +
    'symbol, so same-sign positivity alone is already the complete fixed-a obligation. ' +
    'The residual zero divisor reduces the continuous family to infinitely many points of ' +
    'any one sequence tending to zero. At the unconditional half-thickness anchor, the ' +
    'boundary phase gives a scalar positive-Poisson criterion—but that criterion is itself ' +
    'equivalent to RH. Its exact Fourier deconvolution is the Guinand–Weil functional, and ' +
    'even tempered extendibility recovers the full von Koch/RH threshold. Fractional ' +
    'backward weighting now supplies an exact graded target: one positive rung proves a ' +
    'uniform zero strip, while the endpoint is RH.',
  routeAudit:
    'The complete Jacobi lattice does give positive latent edges, but Gibbs resampling ' +
    'factors only the lazy operator. The direct Douglas factor is uniquely the missing ' +
    'Schur phase, and both tilted Hankel kernels are individually indefinite. At a = 0, ' +
    'off-axis zero dipoles are invisible on the real boundary, so boundary/PDE shortcuts ' +
    'are circular. Exact polynomial and positive-Schwartz counterpackets also show that ' +
    'the dyadic quotient identity has no generic downward sign propagation. The exact ' +
    'theta cross-scale quotient is not a PSD Schur multiplier, while the tested nome-power and ' +
    'even-index identities preserve thickness. Every nonempty pure grouping of inherited prime ' +
    'atoms is indefinite; finite-budget local and exact-reconstruction scalar partitions fail; every nonzero ' +
    'fixed reflected finite raw packet eventually loses phase ' +
    'positivity; and the exact tilted law is not ' +
    'classically infinitely divisible. The cubic ' +
    'coefficient, raw modes, total positivity, gcd blocks, and shellwise SOS routes fail ' +
    'as well. Exact Gaussian smoothing adds only an origin atom. Non-Gaussian tail corrections, ' +
    'infinite or non-scalar/noncompact compensation, coupled groups, and nonlocal transforms ' +
    'remain unexcluded. T3 and RH remain open.',
};

const DYSON_LANE_RESIDUALS = [
  {
    id: 'R1',
    tag: 'sg1c-r1-excursion-cap',
    color: '#f97316',
    badge: 'DYNAMICAL REACHABILITY',
    title: 'R1: Excursion-cap dynamical reachability',
    status: 'OPEN',
    body: [
      'The static obstruction is settled: Theorem R1-T2 shows the uniform-lattice tie value ' +
      'Theta_K = K/(K+1) rises to 1 as K grows, so no static Theta comparison can cap Theta_exc < 1. ' +
      'Theorem R1-T3 gives the exact asymmetric seizing-margin 1/(b(b+1)(b+2)) -> 0, ' +
      'and empirical basin closure (R1-T4) shows worst dynamical excursion ~0 over the 34-run config set.',
      'The open residual is DYNAMICAL REACHABILITY: does the attractive Calogero-Moser flow ' +
      'started from genuine real-zero-like data ever drive the minimal-gap locus onto a long ' +
      'near-uniform lattice — the sole route by which Theta_exc could drop below 1? ' +
      'The dressed static excursion ceiling is ' + EXCURSION_CAP + ' (empirical, config set) ' +
      'with dynamical excursion evidence 0.51. Neither number is inside the ' +
      'stated Theorem-A trap Theta <= ' + THEOREM_A_CAP + ' on its face; any ' +
      'basin implication needs a separately proved map between the quantities. ' +
      'But this is an empirical bound on a finite config set, not a global proof that ' +
      'arbitrary real-zero configurations avoid the near-uniform-lattice locus.',
    ],
    links: [
      { to: '/theta-static-obstruction', label: 'R1-T2/T3 Static Obstruction' },
      { to: '/theta-basin-closure', label: 'R1-T4 Basin Closure' },
      { to: '/spectral-attack', label: 'Spectral Attack (c_glob context)' },
    ],
  },
  {
    id: 'R2',
    tag: 'sg1c-r2-isolation-persistence',
    color: '#a78bfa',
    badge: 'OBSERVED RANGE · NO LOWER BOUND',
    title: 'R2: sampled asymmetric isolation onsets (' +
      C_OBSERVED_MIN.toFixed(7) + ', ' + C_ASYM.toFixed(7) + ')',
    status: 'OPEN',
    body: [
      'The global asymmetric multi-body isolation constant c_glob is defined as the infimum of ' +
      'all worsening-onset values rho(c) over all asymmetric multi-body environments. ' +
      'Every numerically located onset is only an UPPER BOUND on c_glob; no rigorous lower bound ' +
      'below the basin constant 0.72 has been proven.',
      'Observed values include ' + C_OBSERVED_MIN.toFixed(7) +
      ' (imp-3172 Config-B smooth onset, the lowest computationally located ' +
      'onset) and c_asym = ' + C_ASYM.toFixed(10) +
      ' (the asymmetric R-to-infinity class, imp-3170). Both are witnesses ' +
      'that upper-bound the infimum; they are not a rigorous lower/upper bracket. ' +
      'The Theorem-C basin (C_Lip) only requires c <= 0.72, so closing c_glob is NOT needed ' +
      'for the current load-bearing Lipschitz argument — the observed range matters for the program ' +
      'isolation record, not for the core proof chain.',
      'Turning the observations into a bracket requires either a proven lower ' +
      'bound or a structured search that exhausts the class and certifies the infimum.',
    ],
    links: [
      { to: '/onset-bracket-ledger', label: 'Onset Bracket Ledger' },
      { to: '/spectral-attack', label: 'Spectral Attack (c_glob viz)' },
    ],
  },
  {
    id: 'G6a',
    tag: 'step-4-polymath15-bridge',
    color: '#22d3ee',
    badge: 'PARTIAL CLOSURE',
    title: 'G6a: Step-4 Polymath15 bridge — G6a_shock_lipschitz',
    status: 'OPEN (PARTIAL)',
    body: [
      'The Polymath15 route to Λ <= 0 requires a rigorous Hölder-1/2 (Lipschitz) bound on ' +
      'the Burgers shock modulus C_H in G6a_shock_lipschitz. imp-354 partially reduced the ' +
      'gap from "full Hölder-1/2 lemma missing" to two sub-sub-gaps: ' +
      'G6a-sub-hyperbolic (hyperbolic region bound) and G6a-sub-constant (constant region). ' +
      'Per imp-2640 NEGATIVE, C_H is undischargeable via the current approach, so the ' +
      'finite-N beat on Lambda remains an ESTIMATE, not a rigorous unconditional result. ' +
      'The peer-reviewed benchmark remains Lambda <= 0.2; separately, this repository ' +
      'now proves the unreviewed computer-assisted theorem Lambda <= 0.1787854 through ' +
      'an independent sealed route. That theorem does not close G6a or descend to zero.',
      'Closing G6a fully requires the actual missing strip-uniform fold estimate or one ' +
      'of the parallel routes (imp-368+369+336 Route A, or imp-342+337 Route C). ' +
      'Those routes remain open.',
      'Citation audit (imp-33637): arXiv:1904.12438 contains only Lemma 5.1 in ' +
      'Section 5, not a Lemma 5.2 matching this Hölder-1/2 claim. imp-33649 ' +
      'traced the fold-catastrophe exponent instead to Whitham, Linear and ' +
      'Nonlinear Waves (1974). The nonexistent lemma is not a live closure ' +
      'route; G6a_shock_lipschitz remains OPEN (PARTIAL).',
      'Honest-status note (imp-33766): H4 (the strip-height fold-reading derivative m_prime) ' +
      'is NOT independently dischargeable -- the Holder-modulus back-conversion couples it to ' +
      'H3 (the curvature coefficient m_double_prime) through the same quadratic fold expansion, ' +
      'and H3 dominates H4 a fortiori. H4 and H3 therefore collapse into ONE coupled ' +
      'strip-height-uniformity object, load-bearing at the H3 rung; this is scoping only and ' +
      'discharges nothing, so G6a_shock_lipschitz stays OPEN (PARTIAL) exactly as above.',
      'Honest-status note (imp-33794): the measured finite-band C_ren(N) window (the renormalized ' +
      'fold-reading amplitude across the eps = y_N^sharp ladder) is CONSISTENT-WITH the H4 ' +
      'finite-window minimal-input requirement but does NOT DISCHARGE H4 -- the uniform bound needs ' +
      'the ANALYTIC tracking of C_ren through the fold-modulus back-conversion, not an empirical ' +
      'band checked on a finite ladder, and it says nothing about the coupled H3 curvature rung ' +
      '(imp-33786) that dominates and jointly governs discharge. Measurement only; ' +
      'G6a_shock_lipschitz stays OPEN (PARTIAL) exactly as above.',
      'Honest-status note (imp-35101, sharpening imp-3671): the direct-flow V0(gamma) route carries two ' +
      'INDEPENDENT obstructions, not one -- S1 (V0 is a strip-sup density scalar, the wrong TYPE of object for the ' +
      'required two-point spatial modulus |tau_c(x) - tau_c(x_prime)| <= C_Lip|x - x_prime|^{1/2}) and S2, now sharpened ' +
      'from merely Gronwall-vacuous to the wrong MONOTONE DIRECTION: tau_c is set by the nearest pair -- the ' +
      'HIGHEST-density region -- exactly where a density FLOOR carries no information. Retyping V0 to fix S1 does not ' +
      'fix S2; the only object fixing both is a minimal-gap LOWER bound, which is itself the RH-hard nearest-pair ' +
      'control (imp-2520/imp-348, GUE-conditional per imp-486). Separately, per imp-2640 the direct Gronwall discharge ' +
      'of C_H remains NEGATIVE, and the asymptotic modulo (imp-35056) persists regardless of route. No candidate ' +
      'closure via the density-floor measurement exists; G6a_shock_lipschitz stays OPEN (PARTIAL) exactly as above; ' +
      'changes no bound; NO QED.',
    ],
    links: [
      { to: '/rh-dag', label: 'Proof DAG (G6a node)' },
      { to: '/lambda-bounds', label: 'Lambda Bounds' },
      { to: '/route-map', label: 'Route Map' },
    ],
  },
];

export default function OpenFrontierPage() {
  return (
    <div className="page">
      <PageHeader
        title="Open Frontier"
        subtitle="One exact global RH-equivalent frontier, with separate subsidiary research lanes"
      />

      <div className="card" style={{ marginBottom: 20, borderLeft: '3px solid #64748b' }}>
        <p style={{ fontSize: 13, color: '#94a3b8', margin: 0, lineHeight: 1.65 }}>
          The canonical global frontier is the exact T3 residual below. It is the
          current full-strength Twin Ladder formulation of RH and is not yet a
          simplification of RH. The R1, R2, and G6a questions remain useful
          research inside a distinct Dyson / collision-flow lane, but they are
          not the complete global gap and do not replace T3.
        </p>
      </div>

      <div
        className="card"
        style={{ marginBottom: 22, borderLeft: `4px solid ${GLOBAL_FRONTIER.color}` }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, flexWrap: 'wrap' }}>
          <span
            style={{
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 0.5,
              color: GLOBAL_FRONTIER.color,
              border: `1px solid ${GLOBAL_FRONTIER.color}`,
              borderRadius: 4,
              padding: '2px 7px',
            }}
          >
            {GLOBAL_FRONTIER.badge}
          </span>
          <span
            style={{
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: 10.5,
              fontWeight: 700,
              color: '#ef4444',
              border: '1px solid #ef4444',
              borderRadius: 4,
              padding: '1px 6px',
            }}
          >
            {GLOBAL_FRONTIER.status}
          </span>
          <code style={{ fontSize: 11, color: '#64748b' }}>{GLOBAL_FRONTIER.tag}</code>
        </div>
        <strong style={{ color: '#f8fafc', fontSize: 15, display: 'block', marginBottom: 10 }}>
          {GLOBAL_FRONTIER.title}
        </strong>
        <div
          style={{
            marginBottom: 12,
            padding: '10px 12px',
            borderRadius: 6,
            background: 'rgba(239,68,68,0.07)',
            color: '#fecaca',
            fontFamily: 'var(--font-mono, monospace)',
            fontSize: 13,
            overflowX: 'auto',
          }}
        >
          D<sub>a,R</sub> + K<sub>a</sub><sup>(S)</sup> ⪰ −K<sub>a,0</sub>
        </div>
        {GLOBAL_FRONTIER.body.map((para, i) => (
          <p key={i} style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.65, marginTop: i === 0 ? 0 : 10, marginBottom: 0 }}>
            {para}
          </p>
        ))}
        <div style={{ marginTop: 12, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {GLOBAL_FRONTIER.links.map((lnk) => (
            <Link
              key={lnk.to}
              to={lnk.to}
              style={{ fontSize: 12, color: GLOBAL_FRONTIER.color, textDecoration: 'none', borderBottom: `1px solid ${GLOBAL_FRONTIER.color}` }}
            >
              {lnk.label} →
            </Link>
          ))}
        </div>
      </div>

      <div
        className="card"
        style={{ marginBottom: 22, borderLeft: '4px solid #f59e0b' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, flexWrap: 'wrap' }}>
          <span
            style={{
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: 10.5,
              fontWeight: 700,
              letterSpacing: 0.45,
              color: '#fbbf24',
              border: '1px solid #f59e0b',
              borderRadius: 4,
              padding: '2px 7px',
            }}
          >
            {CHANNEL_SPLIT_CERTIFICATE.status}
          </span>
          <code style={{ fontSize: 11, color: '#64748b' }}>T11 · exact Riemann kernel</code>
        </div>
        <strong style={{ color: '#fde68a', fontSize: 15, display: 'block', marginBottom: 8 }}>
          {CHANNEL_SPLIT_CERTIFICATE.title}
        </strong>
        <p style={{ color: '#cbd5e1', fontSize: 13, lineHeight: 1.65, margin: 0 }}>
          On the certified block <code>{CHANNEL_SPLIT_CERTIFICATE.configuration}</code>,
          the coupled matrix K<sub>a,0</sub> + D<sub>a,R</sub> +
          K<sub>a</sub><sup>(S)</sup> is positive definite. Separate
          scalar-multiple estimates D<sub>a,R</sub> ⪰ −β<sub>R</sub>K<sub>a,0</sub> and
          K<sub>a</sub><sup>(S)</sup> ⪰ −β<sub>S</sub>K<sub>a,0</sub> must obey:
        </p>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 8,
            margin: '12px 0',
          }}
        >
          {[CHANNEL_SPLIT_CERTIFICATE.betaR, CHANNEL_SPLIT_CERTIFICATE.betaS, CHANNEL_SPLIT_CERTIFICATE.betaSum].map((value) => (
            <code
              key={value}
              style={{
                padding: '8px 10px',
                borderRadius: 5,
                background: 'rgba(245,158,11,0.08)',
                border: '1px solid rgba(245,158,11,0.25)',
                color: '#fde68a',
                fontSize: 12,
              }}
            >
              {value}
            </code>
          ))}
        </div>
        <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.65, margin: 0 }}>
          The radial witness is stronger: <code>{CHANNEL_SPLIT_CERTIFICATE.radialFullCore}</code>.
          Any PSD partition P<sub>R</sub> + P<sub>S</sub> = G<sub>0</sub> has
          P<sub>R</sub> ⪯ G<sub>0</sub>, so that same witness remains negative
          after every matrix-valued radial suballocation. This refutes all
          independent PSD partitions of the same core, not the coupled T3
          inequality or RH. On that same witness, the exact interval certificate
          isolates the shear rescue as <code>{CHANNEL_SPLIT_CERTIFICATE.compensation}</code>.
          The live target is direct radial/shear cancellation, a genuinely new
          positive resource, or a different zeta-specific mechanism.
        </p>
        <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.65, margin: '10px 0 0' }}>
          {CHANNEL_SPLIT_CERTIFICATE.coupledTarget}
        </p>
        <p style={{ color: '#64748b', fontSize: 11.5, lineHeight: 1.55, margin: '10px 0 0' }}>
          Certificate method: {CHANNEL_SPLIT_CERTIFICATE.method}.
        </p>
        <div
          style={{
            marginTop: 14,
            padding: '12px 14px',
            borderRadius: 7,
            background: 'rgba(14,165,233,0.06)',
            border: '1px solid rgba(56,189,248,0.22)',
          }}
        >
          <strong style={{ color: '#7dd3fc', fontSize: 13 }}>
            Confluent derivative-jet refinement
          </strong>
          <p style={{ color: '#cbd5e1', fontSize: 12.5, lineHeight: 1.65, margin: '8px 0 0' }}>
            The obstruction survives after all evaluation points coalesce:
            <code style={{ marginLeft: 5 }}>{CHANNEL_SPLIT_CERTIFICATE.jetConfiguration}</code>.
            At order two, <code>{CHANNEL_SPLIT_CERTIFICATE.jetOrder2}</code>, while the
            full core/radial/shear jet is positive definite. One exact rational
            direction records the same-vector channel rescue:
          </p>
          <code
            style={{
              display: 'block',
              marginTop: 8,
              padding: '7px 9px',
              borderRadius: 5,
              color: '#bae6fd',
              background: 'rgba(14,165,233,0.08)',
              fontSize: 11.5,
              overflowX: 'auto',
            }}
          >
            {CHANNEL_SPLIT_CERTIFICATE.jetOrder2Rescue}
          </code>
          <p style={{ color: '#94a3b8', fontSize: 12.5, lineHeight: 1.65, margin: '9px 0 0' }}>
            Order four is stricter: under one fixed rational, basis-dependent
            Schur/LDL split, <code>{CHANNEL_SPLIT_CERTIFICATE.jetOrder4}</code>.
            Core plus shear plus N has a negative witness; restoring Q gives the
            positive-definite full jet and flips that witness:
          </p>
          <code
            style={{
              display: 'block',
              marginTop: 8,
              padding: '7px 9px',
              borderRadius: 5,
              color: '#bae6fd',
              background: 'rgba(14,165,233,0.08)',
              fontSize: 11.5,
              overflowX: 'auto',
            }}
          >
            {CHANNEL_SPLIT_CERTIFICATE.jetOrder4Rescue}
          </code>
          <p style={{ color: '#64748b', fontSize: 11.5, lineHeight: 1.55, margin: '9px 0 0' }}>
            This refutes discarding that positive radial component before
            estimating the negative component. It is not a universal statement
            about every radial split and does not prove T3 or RH. Certificate
            method: {CHANNEL_SPLIT_CERTIFICATE.jetMethod}.
          </p>
        </div>
      </div>

      <div
        className="card"
        style={{ marginBottom: 22, borderLeft: '4px solid #a78bfa' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, flexWrap: 'wrap' }}>
          <span
            style={{
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: 10.5,
              fontWeight: 700,
              letterSpacing: 0.45,
              color: '#c4b5fd',
              border: '1px solid #8b5cf6',
              borderRadius: 4,
              padding: '2px 7px',
            }}
          >
            {ONE_POINT_JET_HIERARCHY.status}
          </span>
          <code style={{ fontSize: 11, color: '#64748b' }}>T13–T15 · full coupled kernel</code>
        </div>
        <strong style={{ color: '#ddd6fe', fontSize: 15, display: 'block', marginBottom: 8 }}>
          {ONE_POINT_JET_HIERARCHY.title}
        </strong>
        <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.65, margin: 0 }}>
          {ONE_POINT_JET_HIERARCHY.caveat}
        </p>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))',
            gap: 8,
            margin: '12px 0',
          }}
        >
          {[ONE_POINT_JET_HIERARCHY.fixedA, ONE_POINT_JET_HIERARCHY.sequence].map((value) => (
            <code
              key={value}
              style={{
                padding: '9px 10px',
                borderRadius: 5,
                background: 'rgba(139,92,246,0.08)',
                border: '1px solid rgba(167,139,250,0.25)',
                color: '#ddd6fe',
                fontSize: 11.5,
                overflowX: 'auto',
              }}
            >
              {value}
            </code>
          ))}
        </div>
        <p style={{ color: '#a78bfa', fontSize: 12.5, lineHeight: 1.65, margin: 0 }}>
          {ONE_POINT_JET_HIERARCHY.finiteWarning}
        </p>
        <p style={{ color: '#64748b', fontSize: 11.5, lineHeight: 1.55, margin: '9px 0 0' }}>
          A single fixed-a hierarchy may also be weaker than strict
          Hermite–Biehler positivity when shifted zeros cancel. The exact
          RH-equivalent obligation remains the all-order hierarchy along
          thicknesses tending to zero; neither the current finite certificates
          nor this reformulation proves RH.
        </p>
      </div>

      <div
        className="card"
        style={{ marginBottom: 22, borderLeft: '4px solid #14b8a6' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, flexWrap: 'wrap' }}>
          <span
            style={{
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: 10.5,
              fontWeight: 700,
              letterSpacing: 0.45,
              color: '#5eead4',
              border: '1px solid #14b8a6',
              borderRadius: 4,
              padding: '2px 7px',
            }}
          >
            {MARKOV_NORMALIZATION.status}
          </span>
          <code style={{ fontSize: 11, color: '#64748b' }}>T18–T39 · Markov / divisor / explicit-formula frontier</code>
        </div>
        <strong style={{ color: '#99f6e4', fontSize: 15, display: 'block', marginBottom: 8 }}>
          {MARKOV_NORMALIZATION.title}
        </strong>
        <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.65, margin: 0 }}>
          {MARKOV_NORMALIZATION.structure}
        </p>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))',
            gap: 8,
            margin: '12px 0',
          }}
        >
          {[
            MARKOV_NORMALIZATION.rowMass,
            MARKOV_NORMALIZATION.equivalence,
            MARKOV_NORMALIZATION.sameSign,
            MARKOV_NORMALIZATION.divisor,
            MARKOV_NORMALIZATION.sequence,
            MARKOV_NORMALIZATION.outer,
            MARKOV_NORMALIZATION.halfAnchor,
            MARKOV_NORMALIZATION.poisson,
            MARKOV_NORMALIZATION.dyadic,
            MARKOV_NORMALIZATION.crossScale,
            MARKOV_NORMALIZATION.crossScaleScope,
            MARKOV_NORMALIZATION.landen,
            MARKOV_NORMALIZATION.explicitFormula,
            MARKOV_NORMALIZATION.compensatedPrime,
            MARKOV_NORMALIZATION.tempered,
            MARKOV_NORMALIZATION.weightedPnt,
            MARKOV_NORMALIZATION.finiteModes,
            MARKOV_NORMALIZATION.gaussian,
            MARKOV_NORMALIZATION.cellQuotient,
            MARKOV_NORMALIZATION.gradedBackward,
            MARKOV_NORMALIZATION.levy,
            MARKOV_NORMALIZATION.edge,
            MARKOV_NORMALIZATION.douglas,
            MARKOV_NORMALIZATION.hankel,
            MARKOV_NORMALIZATION.infinitesimal,
            MARKOV_NORMALIZATION.boundary,
            MARKOV_NORMALIZATION.cubic,
          ].map((value) => (
            <code
              key={value}
              style={{
                padding: '9px 10px',
                borderRadius: 5,
                background: 'rgba(20,184,166,0.08)',
                border: '1px solid rgba(45,212,191,0.25)',
                color: '#ccfbf1',
                fontSize: 11.5,
                overflowX: 'auto',
              }}
            >
              {value}
            </code>
          ))}
        </div>
        <p style={{ color: '#5eead4', fontSize: 12.5, lineHeight: 1.65, margin: 0 }}>
          {MARKOV_NORMALIZATION.routeAudit}
        </p>
        <p style={{ color: '#64748b', fontSize: 11.5, lineHeight: 1.55, margin: '9px 0 0' }}>
          Sharpened surviving target: either prove the exact full-theta same-sign block
          𝒜<sub>aₙ</sub> is positive at infinitely many points of one explicit sequence
          a<sub>n</sub> → 0, or construct the positive half-Poisson measure directly from
          the Jacobi theta ratio. A strict intermediate target is now explicit: prove
          temperedness of e<sup>λ|u|</sup>c(u) for one 0 &lt; λ &lt; 1 to obtain a
          uniform zero strip, then increase λ toward one. No positive fractional rung is
          currently proved. A successful argument must use arithmetic beyond
          symmetry, divisor recursion, ordinary inner-function positivity, separate
          modes, individual Hankel factors, boundary traces, entrywise cross-scale
          multipliers, fixed reflected finite raw-mode packets, pure prime-group positivity,
          finite-budget local and exact-reconstruction scalar prime partitions, and
          exact Gaussian smoothing.
          The current exact reformulations retain global Jacobi cancellation and the
          complete archimedean/prime explicit formula; non-Gaussian tail corrections,
          infinite or non-scalar/noncompact compensation, coupled groups, and nonlocal
          transforms remain unexcluded.
        </p>
      </div>

      <div className="card" style={{ marginBottom: 18, borderLeft: '3px solid #38bdf8' }}>
        <strong style={{ color: '#7dd3fc', fontSize: 13 }}>Separate Dyson / collision-flow lane</strong>
        <p style={{ fontSize: 13, color: '#94a3b8', margin: '8px 0 0', lineHeight: 1.65 }}>
          The three records below track internal residuals of the dynamical
          de Bruijn–Newman program. They can sharpen subsidiary flow estimates
          or eliminate proposed mechanisms. Closing them would not, by itself,
          discharge the exact T3 kernel inequality or prove RH.
        </p>
      </div>

      {DYSON_LANE_RESIDUALS.map((r) => (
        <div
          key={r.id}
          className="card"
          style={{ marginBottom: 18, borderLeft: "3px solid " + r.color }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, flexWrap: 'wrap' }}>
            <span
              style={{
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 0.5,
                color: r.color,
                border: "1px solid " + r.color,
                borderRadius: 4,
                padding: '2px 7px',
              }}
            >
              {r.badge}
            </span>
            <span
              style={{
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: 10.5,
                fontWeight: 700,
                color: r.status === 'OPEN' ? '#ef4444' : '#f97316',
                border: "1px solid " + (r.status === 'OPEN' ? '#ef4444' : '#f97316'),
                borderRadius: 4,
                padding: '1px 6px',
              }}
            >
              {r.status}
            </span>
            <code style={{ fontSize: 11, color: '#64748b' }}>{r.tag}</code>
          </div>
          <strong style={{ color: '#e2e8f0', fontSize: 14, display: 'block', marginBottom: 10 }}>
            {r.title}
          </strong>
          {r.body.map((para, i) => (
            <p key={i} style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.65, marginTop: i === 0 ? 0 : 10, marginBottom: 0 }}>
              {para}
            </p>
          ))}
          {r.links.length > 0 && (
            <div style={{ marginTop: 12, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {r.links.map((lnk) => (
                <Link
                  key={lnk.to}
                  to={lnk.to}
                  style={{ fontSize: 12, color: r.color, textDecoration: 'none', borderBottom: "1px solid " + r.color }}
                >
                  {lnk.label} →
                </Link>
              ))}
            </div>
          )}
        </div>
      ))}

      <div className="card" style={{ marginTop: 8, borderLeft: '3px solid #64748b' }}>
        <div style={{ fontSize: 12.5, color: '#94a3b8', lineHeight: 1.65 }}>
          <strong style={{ color: '#cbd5e1' }}>Scope separation:</strong>{' '}
          The Theorem-C Lipschitz basin (C_Lip, requiring only c &le; 0.72) does
          not depend on closing R2. The static-obstruction chain inside R1 is
          rigorous, while the 34-run excursion study remains finite empirical
          evidence. G6a remains a subsidiary open flow estimate. None of these
          statements changes the global verdict: RH is open, and T3 is the sole
          exact global frontier recorded here.
        </div>
      </div>

      <div className="card" style={{ marginTop: 10 }}>
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', fontSize: 12.5 }}>
          <Link to="/state-of-program" style={{ color: '#94a3b8' }}>State of the Program</Link>
          <Link to="/route-map" style={{ color: '#94a3b8' }}>Route Map</Link>
          <Link to="/rh-dag" style={{ color: '#94a3b8' }}>Proof DAG</Link>
          <Link to="/spectral-attack" style={{ color: '#94a3b8' }}>Spectral Attack</Link>
        </div>
      </div>
    </div>
  );
}
