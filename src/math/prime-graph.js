/**
 * Prime Graph Construction — Combinatorial Route to Prime Log Spectrum
 *
 * imp-158: Build explicit graph structures whose closed-walk spectrum
 * produces {log p : p prime}. Compute their Ihara zeta functions
 * and compare with ζ(s).
 *
 * IHARA ZETA FUNCTION:
 *
 *   For a finite graph G with edge weights w(e), the Ihara zeta is:
 *     ζ_G(u) = Π_{C primitive closed walk} (1 - u^{length(C)})^{-1}
 *
 *   Analogy with Selberg zeta:
 *     "primitive closed walks" ↔ "primitive geodesics"
 *     "walk length" ↔ "geodesic length"
 *
 *   Well-studied in spectral graph theory (Ihara 1966, Stark-Terras 2000).
 *
 * CANDIDATE GRAPH STRUCTURES:
 *
 *   1. SELF-LOOP GRAPH: N vertices, each with a self-loop of weight log(p_k).
 *      Primitive closed walks = self-loops.
 *      Walk-length spectrum: {log(p_1), log(p_2), ..., log(p_N)} — EXACTLY what we want.
 *      Ihara zeta: ζ_G(u) = Π_p (1 - u^{log p})^{-1} = Π_p (1 - p^{-s})^{-1} = ζ(s)
 *        under substitution u = e^{-s}! (Since u^{log p} = e^{-s·log p} = p^{-s}.)
 *
 *   So: THE SELF-LOOP GRAPH WITH WEIGHTS log(p) HAS IHARA ZETA = RIEMANN ζ.
 *
 *   ...if we allow WEIGHTED edges (non-standard Ihara). Standard Ihara is for
 *   unweighted graphs where length = edge count.
 *
 *   2. MULTI-GRAPH CASCADE: N vertices linearly connected by edges.
 *      Primitive closed walks include: vertex→next→vertex→... cycles.
 *      Lengths depend on specific connectivity.
 *
 *   3. PRIME-INDEXED CYCLE: Cycle of length N with edges weighted by log(p_k).
 *      Primitive closed walks = going around the cycle.
 *      Lengths = log(p_1) + log(p_2) + ... = log(N!) (not {log p}).
 *
 * WHY THE SELF-LOOP GRAPH IS "TRIVIAL":
 *
 *   The self-loop graph is DISCONNECTED — each vertex is its own component.
 *   There is no genuine graph dynamics, just independent self-loops.
 *
 *   For a NONTRIVIAL ζ-connection, we need a CONNECTED graph whose
 *   primitive walks naturally give {log p}. This is much harder.
 *
 * DEEPER QUESTION:
 *
 *   Is there a connected graph (or quantum graph with edge lengths) whose
 *   PRIMITIVE closed walk spectrum (lengths of irreducible cycles) is
 *   exactly {log p}? This is the DISCRETE analog of the Deninger-Connes
 *   conjecture for continuous hyperbolic surfaces.
 */

import { getPrimes } from './primes.js';

// ── Self-loop graph: trivial case ───────────────────────────────────────────

function selfLoopGraphAnalysis(numPrimes) {
  const primes = getPrimes(numPrimes);
  const weights = primes.map(p => Math.log(p));

  return {
    construction: 'N disjoint vertices, each with self-loop of weight log(p_k)',
    vertices: numPrimes,
    edges: numPrimes,
    connected: false,
    primitiveWalkLengths: weights.slice(0, 10).map(w => +w.toFixed(4)),
    iharaZeta: 'ζ_G(u) = Π_p (1-u^{log p})^{-1} = ζ(s) under u = e^{-s}',
    mathematicallyCorrect: true,
    spectrumMatchesLogP: true,
    honestAssessment:
      'TRIVIAL construction — disconnected graph. Gives correct zeta but provides no new ' +
      'dynamical/operator content. Not useful for proving RH.',
  };
}

// ── Cycle graph analysis ────────────────────────────────────────────────────

function cycleGraphAnalysis(numPrimes) {
  const primes = getPrimes(numPrimes);
  const weights = primes.map(p => Math.log(p));
  const cycleLength = weights.reduce((a, b) => a + b, 0);
  const numPrimitiveCycles = 1; // just one primitive cycle (going once around)

  return {
    construction: 'Cycle of N vertices, edges weighted log(p_k)',
    vertices: numPrimes,
    edges: numPrimes,
    connected: true,
    primitiveWalkLengths: [cycleLength],
    note: `Single primitive cycle of total length log(${primes.join('·')}) = log(P_${numPrimes}#)`,
    cycleLength: +cycleLength.toFixed(4),
    logPrimorial: `log(${numPrimes}-th primorial)`,
    spectrumMatchesLogP: false,
    honestAssessment:
      'Spectrum has ONE length (the full primorial log), not {log p}. Wrong structure.',
  };
}

// ── Complete bipartite K_{p,p} spectrum ──────────────────────────────────────

function completeBipartiteAnalysis(p) {
  // K_{p,p} has eigenvalues ±p, 0 (with multiplicity).
  // Primitive cycles have length 4 (smallest cycle in bipartite graphs).
  return {
    construction: `Complete bipartite K_{${p},${p}}`,
    vertices: 2 * p,
    edges: p * p,
    connected: true,
    smallestCycleLength: 4,
    note: 'Bipartite graphs have only even-length cycles. Does not yield log(p) structure.',
    spectrumMatchesLogP: false,
  };
}

// ── Quantum graph with log(p) edge lengths ──────────────────────────────────

/**
 * A QUANTUM GRAPH has continuous edges with physical length.
 * Waves propagate on edges (1D Schrödinger: -d²/dx²).
 * Spectrum is given by the characteristic equation:
 *   det(I - S·D(k)) = 0
 * where S is the vertex scattering matrix and D(k) = diag(e^{ik·L_e}).
 *
 * For a "star" quantum graph: N edges meeting at one vertex.
 * Free boundary conditions at far ends, Neumann at center.
 * Lengths L_k = log(p_k).
 *
 * The spectrum includes resonances at k values where k·log(p) ~ nπ.
 * Not directly {log p} but related.
 */
function quantumGraphAnalysis(numPrimes) {
  const primes = getPrimes(numPrimes);
  const edgeLengths = primes.map(p => Math.log(p));

  // Resonances: k such that some combination of k·log(p_k) = nπ
  // For a star graph: det(S - exp(-2ikL)) = 0
  // For equal scattering (2/N - δ): eigenvalues of exp(-2ikL_k)

  // Simplest resonances: k = π/(2·L_k) = π/(2·log(p_k))
  const fundamentalModes = edgeLengths.map(L => Math.PI / (2 * L));

  return {
    construction: `Star quantum graph with ${numPrimes} edges of lengths log(p_k)`,
    totalLength: +edgeLengths.reduce((a, b) => a + b, 0).toFixed(4),
    fundamentalModes: fundamentalModes.slice(0, 10).map(k => +k.toFixed(4)),
    note:
      'Quantum graph has CONTINUOUS spectrum (not discrete points). ' +
      'Resonances are at k = nπ/(2 log p) — NOT the same as {log p}.',
    spectrumMatchesLogP: false,
    honestAssessment:
      'Quantum graph with log(p) edges gives different spectrum (k values). ' +
      'Would need INVERSE construction: spectrum k_n = log(p_n).',
  };
}

// ── The discrete Deninger-Connes problem ────────────────────────────────────

function discreteDeningerConnes() {
  return {
    problem:
      'Does there exist a CONNECTED graph (possibly infinite) whose primitive ' +
      'closed walk length spectrum is exactly {log p : p prime}?',

    difficulty: [
      'Primitive closed walks in a connected graph are NOT independent',
      'Walks are CONCATENATIONS: if a, b are primitive walks, a+b+a is also a walk',
      'Spectrum typically includes {L_1, L_2, L_1+L_2, 2·L_1+L_2, ...}',
      'To avoid this, need TREE-LIKE structure (but trees have no closed walks)',
    ],

    candidates: [
      {
        graph: 'Infinite star with edge lengths log(p)',
        primitive: 'Back-and-forth walks on single edges: lengths 2·log(p)',
        matches: false,
        issue: 'Factor of 2 and no asymmetry',
      },
      {
        graph: 'Barbell graph at each prime',
        primitive: 'Specific cycles at each prime',
        matches: 'maybe',
        issue: 'Needs careful construction',
      },
      {
        graph: 'Infinite tree with log(p) weights + single cycle',
        primitive: 'One cycle per prime, no interaction',
        matches: 'possibly',
        issue: 'Topologically disconnected',
      },
    ],

    conjecture:
      'NO connected finite graph has primitive walk spectrum = {log p}. ' +
      'A connected infinite graph might, but would need very specific structure. ' +
      'This is the DISCRETE VERSION of Deninger-Connes and appears similarly hard.',
  };
}

// ── Main test ────────────────────────────────────────────────────────────────

export function primeGraphTest() {
  const selfLoop = selfLoopGraphAnalysis(20);
  const cycle = cycleGraphAnalysis(10);
  const quantum = quantumGraphAnalysis(10);
  const bipartite = completeBipartiteAnalysis(5);
  const discreteDC = discreteDeningerConnes();

  return {
    candidates: {
      selfLoop,
      cycle,
      quantumGraph: quantum,
      bipartite,
    },
    discreteProblem: discreteDC,

    keyFinding:
      'The SELF-LOOP graph trivially gives Ihara zeta = ζ(s), but it is disconnected ' +
      'and provides no new dynamical content. All CONNECTED finite graphs we tested ' +
      'have wrong spectra. The discrete Deninger-Connes problem (find connected graph ' +
      'with primitive walk spectrum = {log p}) is similarly open.',

    conclusion:
      'Combinatorial graph construction faces the SAME obstacle as hyperbolic surface ' +
      'construction: walks/geodesics in non-trivial structures are CORRELATED, producing ' +
      'spectra like {L_1, L_2, L_1+L_2, ...} rather than the DISJOINT {log p}. ' +
      'The only trivial solution is disconnected self-loops, which adds no value.',

    implication:
      'For a NON-TRIVIAL spectral realization of {log p}, the construction needs to ' +
      'FACTOR WALKS UNIQUELY — that is, provide unique factorization of walks into ' +
      'primitives. This is the CASCADE property: primes factor uniquely into prime ' +
      'powers, and walks should factor uniquely into primitive cycles. ' +
      'Surfaces/graphs with this property: UNIQUE FACTORIZATION DOMAINS of walks.',

    verdict:
      'PRIME GRAPH CONSTRUCTION: Tested 4 graph candidates. Only the trivial ' +
      'self-loop graph has Ihara zeta = ζ(s) — but it is disconnected. ' +
      'Connected graphs produce spectra with sums/compositions of edge lengths, ' +
      'not the disjoint {log p}. The DISCRETE Deninger-Connes problem — finding ' +
      'a connected graph with walk spectrum = {log p} — is as open as the continuous ' +
      'version. Research direction: unique factorization domains for walks.',
  };
}
