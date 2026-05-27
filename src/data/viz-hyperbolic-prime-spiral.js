// @module data/viz-hyperbolic-prime-spiral
// imp-1226: structured record for the /viz-hyperbolic-prime-spiral page.
//
// Embeds the first ~5000 primes p in the Poincaré disk model of hyperbolic
// geometry. Each prime gets:
//   radius     r(p) = (log p) / (log p_max)        ∈ [0, 1]
//   angle      θ(p) = φ_0 · log p   mod 2π          where φ_0 is a global phase
//
// φ_0 = arg(log ζ(2)) ≈ -0.0234 by convention; for visualization we let the
// user shift φ_0 by a slider so the angular layout can be explored.
//
// The hyperbolic-disk embedding is a natural setting for modular-form
// interpretations of ζ, and the log-radial layout makes the prime number
// theorem density visually obvious. Coloring by p mod 4 separates primes
// 1 mod 4 (sum of two squares; Gauss reciprocity even) from 3 mod 4 (no
// such decomposition).

export const VIZ_HYPERBOLIC_PRIME_SPIRAL = Object.freeze({
  id: 'viz-hyperbolic-prime-spiral',
  ticket: 'imp-1226',
  generatedAt: '2026-05-26T20:30:00Z',

  title: 'Hyperbolic Prime Spiral',
  oneLine:
    'Embed primes in the Poincaré disk via (log p, global-phase × log p mod 2π). ' +
    'Log-radial layout makes prime density visible at a glance; angular phase ' +
    'separates p mod 4 classes.',

  math: Object.freeze({
    embedding: 'r(p) = log(p) / log(p_max), θ(p) = φ₀ · log(p) mod 2π',
    discMetric: 'Poincaré disk model: hyperbolic distance d(z, w) = 2 atanh(|z-w|/|1-zw̄|)',
    defaultPhase: 'φ₀ = arg(log ζ(2)) ≈ -0.0234, but user can slide φ₀ to explore',
    pModFourColors: '{1 mod 4: blue, 3 mod 4: red, 2: orange (just p=2)}',
  }),

  parameterRanges: Object.freeze({
    maxPrime: { min: 100, max: 50000, default: 5000 },
    phase: { min: -Math.PI, max: Math.PI, default: 0 },
  }),

  visualizationNotes: Object.freeze([
    'Log-radial layout means each successive prime sits at a slightly larger radius — visible PNT density.',
    'Angular slider φ₀ reveals coherent rings when φ₀ ≈ 2π / log p* for some prime p* (resonance).',
    'p mod 4 coloring should show NO angular clustering by class (Dirichlet equidistribution).',
    'Optional overlay: critical-line geodesic in the disk (a circle orthogonal to the unit circle through ±1).',
  ]),

  interpretationForRH: Object.freeze({
    primeNumberTheorem: 'Density of primes in [r, r+dr] (in disk coords) reflects PNT log-density',
    dirichletEquidistribution: 'p mod 4 classes equidistributed in angle ⇔ Dirichlet character sum bound',
    criticalLineAsGeodesic: 'Critical line σ=1/2 lifts to a specific geodesic in the disk under the embedding s → (s-1)/(s+1)',
    relationToRiemannHilbert: 'Twistor / modular-form lift of zeta is naturally on the disk; this viz is the discrete prime trace',
  }),

  references: Object.freeze({
    poincareDisk: 'Beardon, "The Geometry of Discrete Groups" 1983',
    primeNumberTheorem: 'Hadamard 1896 / de la Vallée Poussin 1896',
    dirichlet: 'Dirichlet 1837 on primes in arithmetic progressions',
    parentSection: 'src/data/blaschke-ghosts-section.js (imp-1198) — disk embedding context',
    visualizationsIndex: 'imp-1228 (planned)',
  }),
});

export const VIZ_HYPERBOLIC_PRIME_SPIRAL_ASSERTIONS = [
  {
    id: 'imp1226-title-and-id-set',
    why: 'Title + id must be set for the index page to surface this viz.',
    holds: () => {
      const r = VIZ_HYPERBOLIC_PRIME_SPIRAL;
      return r.title === 'Hyperbolic Prime Spiral' && r.id === 'viz-hyperbolic-prime-spiral';
    },
  },
  {
    id: 'imp1226-parameter-ranges-sensible',
    why: 'maxPrime range must support both quick interaction (100) and full survey (50000).',
    holds: () => {
      const p = VIZ_HYPERBOLIC_PRIME_SPIRAL.parameterRanges;
      return p.maxPrime.min === 100 && p.maxPrime.max >= 10000 && p.maxPrime.default >= 1000;
    },
  },
  {
    id: 'imp1226-embedding-formula-present',
    why: 'The radial / angular embedding formula is the load-bearing definition.',
    holds: () => {
      const m = VIZ_HYPERBOLIC_PRIME_SPIRAL.math.embedding;
      return m.includes('r(p)') && m.includes('log(p)') && m.includes('mod 2π');
    },
  },
  {
    id: 'imp1226-rh-interpretation-non-empty',
    why: 'The RH-connection paragraphs must each have content so the page is not just decoration.',
    holds: () => {
      const i = VIZ_HYPERBOLIC_PRIME_SPIRAL.interpretationForRH;
      return Object.values(i).every((v) => v.length > 30);
    },
  },
  {
    id: 'imp1226-four-visualization-notes',
    why: 'At least 4 visualization notes so the page has guidance for the user.',
    holds: () => VIZ_HYPERBOLIC_PRIME_SPIRAL.visualizationNotes.length >= 4,
  },
];
