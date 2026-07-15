// imp-35536 (numerical, api-pool): HEIGHT-MAP sensitivity of the imp-3406/imp-35337
// sigma interior PEAK (N_max ~ 9.2186e5, sigma_max ~ 0.94942901).
//
// imp-35458 measured the height-map sensitivity of the E_coll=E_trunc CROSSOVER;
// imp-35497 applied the same swap to the E_flow far-tail crossing. This script
// applies the identical method to the INTERIOR PEAK: re-run the imp-35337 peak
// locator on the double surrogate sigma(N) = E_coll/(E_trunc + E_flow + E_coll)
// under a bracketing family of perturbed effective-height maps T0(N):
//   (A) exact RvM inverse effectiveHeightForN (the map imp-35337 uses -- the BASE),
//   (B) closed surrogate T0 = 2 pi N / log N,
//   (C) small multiplicative perturbations T0_base * (1 +/- delta), delta in {2%,5%}.
// Measure how far N_max and sigma_max move under each map. Measurement only;
// surrogate-vs-true fidelity (imp-35337a) UNTOUCHED; changes no bound; NO QED.

const TWO_PI = 2 * Math.PI;
const C_C_PINNED = (1 / 8) * Math.sqrt(3 * Math.PI); // imp-2642/imp-2643/imp-2714 ansatz
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP);

// Height map A: exact RvM inverse (Newton solve of (T/2pi)(log(T/2pi)-1)=N).
function effectiveHeightForN(N) {
  if (!(N > 0) || !Number.isFinite(N)) return 0;
  let T = Math.max(TWO_PI * Math.E, (TWO_PI * N) / Math.max(1, Math.log(N + TWO_PI)));
  for (let i = 0; i < 60; i++) {
    const u = Math.log(T / TWO_PI);
    const f = (T / TWO_PI) * (u - 1) - N;
    const fp = u / TWO_PI;
    if (!(Math.abs(fp) > 0) || !Number.isFinite(fp)) break;
    const dT = f / fp;
    T -= dT;
    if (!(T > TWO_PI)) T = TWO_PI * 1.0001;
    if (Math.abs(dT) < 1e-12 * Math.max(1, T)) break;
  }
  return T;
}
// Height map B: closed surrogate.
function surrogateHeightForN(N) {
  return (TWO_PI * N) / Math.log(N);
}

// sigma(N) parameterised by the height map (single swap; everything else identical).
function makeSigma(heightForN) {
  return function sigma(N) {
    const T0 = heightForN(N);
    const L = Math.log(T0);
    const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI;
    const E_flow = C_F * (L / T0) * GRONWALL;
    const E_coll = C_C_PINNED * Math.sqrt(L / N);
    return E_coll / (E_TRUNC_PT + E_flow + E_coll);
  };
}

// imp-35337 peak locator: sign-of-derivative bisection in log N over [1e4, 1e7].
function locatePeak(sigma) {
  const dSigmadN = (N) => {
    const h = N * 1e-6;
    return (sigma(N + h) - sigma(N - h)) / (2 * h);
  };
  let a = Math.log(1e4);
  let b = Math.log(1e7);
  for (let i = 0; i < 200; i++) {
    const m = (a + b) / 2;
    if (dSigmadN(Math.exp(m)) > 0) a = m;
    else b = m;
  }
  const Nmax = Math.exp((a + b) / 2);
  return { Nmax, sigmaMax: sigma(Nmax) };
}

const maps = [
  ['RvM inverse (BASE, imp-35337)', effectiveHeightForN],
  ['closed surrogate 2 pi N / log N', surrogateHeightForN],
  ['RvM * 1.02', (N) => 1.02 * effectiveHeightForN(N)],
  ['RvM * 0.98', (N) => 0.98 * effectiveHeightForN(N)],
  ['RvM * 1.05', (N) => 1.05 * effectiveHeightForN(N)],
  ['RvM * 0.95', (N) => 0.95 * effectiveHeightForN(N)],
];

const base = locatePeak(makeSigma(effectiveHeightForN));
console.log('=== sigma interior PEAK under perturbed height maps ===');
console.log('BASE (RvM):  N_max =', base.Nmax.toExponential(6), ' sigma_max =', base.sigmaMax.toFixed(8));
console.log('');
for (const [name, hf] of maps) {
  const p = locatePeak(makeSigma(hf));
  const dLog10 = (Math.log10(p.Nmax) - Math.log10(base.Nmax));
  const dSigma = p.sigmaMax - base.sigmaMax;
  console.log(
    name.padEnd(34) +
      ' N_max=' + p.Nmax.toExponential(6) +
      ' sigma_max=' + p.sigmaMax.toFixed(8) +
      '  d(log10 N)=' + dLog10.toFixed(5) +
      '  d(sigma)=' + dSigma.toExponential(4),
  );
}

// Height-map divergence at the peak scale.
const T0s = surrogateHeightForN(base.Nmax);
const T0r = effectiveHeightForN(base.Nmax);
console.log('\nheight-map divergence at N_max:');
console.log('  T0_surrogate =', T0s.toExponential(6), ' T0_RvM =', T0r.toExponential(6),
  ' rel=', ((T0r - T0s) / T0s).toExponential(4));
