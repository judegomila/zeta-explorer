// imp-35354 — decompose the ~1.31e-7 RK4 dt/2 collision-time gap at N=2000
// between the imp-35324 finer-grid MIN-SPACING GATE estimate (t_c=1.1923626880e-3)
// and the imp-35278 resolved-grid SIGNED-CROSSING estimate (t_c=1.1924935719e-3)
// into a GRID-resolution component and an EVENT-DEFINITION component.
//
// WHY THIS TEST
// imp-35324 changed TWO things at once relative to imp-35278: the base grid
// (tauC/4000 vs tauC/1000) AND the event definition (min-spacing (0,1e-4) gate,
// which quantizes t_c to an integer step multiple, vs signed-crossing with linear
// sub-step interpolation). The 1.31e-7 gap therefore conflates grid and event.
// To isolate them we run the SAME RK4 dt/2 flow through a full 2x2 factorial:
//   grid in {tauC/1000 (resolved), tauC/4000 (finer)}
//   event in {min-spacing gate, signed-crossing interpolated}
// Cell B (resolved,crossing) reproduces imp-35278 RK4 dt/2; cell C (finer,gate)
// reproduces imp-35324 RK4 dt/2. Cells A (resolved,gate) and D (finer,crossing)
// are the missing off-diagonals. Two paths C->A->B and C->D->B each split the
// total gap into (grid effect) + (event effect); their difference is the
// interaction. MEASUREMENT ONLY; the ladder stays at N=1000; changes NO bound;
// NO QED.
//
// Run: node scripts/imp-35354-n2000-rk4-dthalf-grid-event-decomp.mjs

const { ZEROS_EXTENDED } = await import('../src/data/zeros-to-1e6.js');
const { EMPIRICAL_M_SWEEP_EXTENDED } = await import('../src/data/empirical-m-sweep-extended.js');

// ── Verbatim Kahan-Neumaier Dyson derivative (imp-306/imp-357/imp-363). ───────
function dysonDerivativesKahan(gammas, direction) {
  const N = gammas.length;
  const dg = new Float64Array(N);
  for (let n = 0; n < N; n++) {
    let sum = 0, c = 0;
    for (let k = 0; k < N; k++) {
      if (k === n) continue;
      const diff = gammas[n] - gammas[k];
      if (Math.abs(diff) < 1e-15) continue;
      const term = 1 / diff;
      const t = sum + term;
      c += Math.abs(sum) >= Math.abs(term) ? (sum - t) + term : (term - t) + sum;
      sum = t;
    }
    dg[n] = direction * 2 * (sum + c);
  }
  return dg;
}

// ── Verbatim RK4 step (order 4) — the reference under study. ──────────────────
function rk4StepKahan(gammas, dt, direction) {
  const N = gammas.length;
  const k1 = dysonDerivativesKahan(gammas, direction);
  const y1 = new Float64Array(N);
  for (let i = 0; i < N; i++) y1[i] = gammas[i] + dt / 2 * k1[i];
  const k2 = dysonDerivativesKahan(y1, direction);
  const y2 = new Float64Array(N);
  for (let i = 0; i < N; i++) y2[i] = gammas[i] + dt / 2 * k2[i];
  const k3 = dysonDerivativesKahan(y2, direction);
  const y3 = new Float64Array(N);
  for (let i = 0; i < N; i++) y3[i] = gammas[i] + dt * k3[i];
  const k4 = dysonDerivativesKahan(y3, direction);
  const result = new Float64Array(N);
  for (let i = 0; i < N; i++) {
    result[i] = gammas[i] + dt / 6 * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]);
  }
  return result;
}

function minSpacing(gammas) {
  let minS = Infinity, minIdx = -1;
  for (let i = 0; i < gammas.length - 1; i++) {
    const s = gammas[i + 1] - gammas[i];
    if (s < minS) { minS = s; minIdx = i; }
  }
  return { spacing: minS, index: minIdx };
}

// EVENT A/C: verbatim imp-35324/imp-35235 min-spacing gate. t_c = step*dt (the
// first step whose min neighbour spacing drops below 1e-4). Quantized to a grid
// step multiple — this quantization IS the event-definition difference vs crossing.
function runGate(initial, dt, maxSteps, stepper) {
  let gammas = Float64Array.from(initial);
  for (let step = 0; step < maxSteps; step++) {
    const { spacing, index } = minSpacing(gammas);
    if (spacing < 1e-4) return { t_c: step * dt, pair_index: index, steps: step };
    gammas = stepper(gammas, dt, -1);
  }
  return { t_c: null, pair_index: null, steps: maxSteps };
}

// EVENT B/D: verbatim imp-35278 signed-crossing with linear sub-step interpolation.
// t_c = (step-1)*dt + frac*dt where frac = gPrev/(gPrev-gCurr) — sub-grid precise.
function runCrossing(initial, dt, maxSteps, stepper) {
  let gammas = Float64Array.from(initial);
  let prev = minSpacing(gammas);
  for (let step = 1; step <= maxSteps; step++) {
    const next = stepper(gammas, dt, -1);
    const i = prev.index;
    const gPrev = gammas[i + 1] - gammas[i];
    const gCurr = next[i + 1] - next[i];
    if (gCurr <= 0 && gPrev > 0) {
      const frac = gPrev / (gPrev - gCurr);
      return { t_c: (step - 1) * dt + frac * dt, cross_index: i, step, frac };
    }
    gammas = next;
    prev = minSpacing(gammas);
  }
  return { t_c: null, cross_index: null, step: maxSteps, frac: null };
}

// ── N=2000 setup. dt/2 refinements of the two base grids. ─────────────────────
const N = 2000;
const sample = EMPIRICAL_M_SWEEP_EXTENDED.samples.find((s) => s.N === N);
const initial = ZEROS_EXTENDED.slice(0, N);
const tauC_est = sample.tauC_est;

const dtResolvedHalf = tauC_est / 2000;   // imp-35278 dt/2  (base tauC/1000)
const dtFinerHalf = tauC_est / 8000;      // imp-35324 dt/2  (base tauC/4000)

console.log(`N=${N} tauC_est=${tauC_est}`);
console.log(`resolved dt/2 = tauC/2000 = ${dtResolvedHalf.toExponential(6)}`);
console.log(`finer    dt/2 = tauC/8000 = ${dtFinerHalf.toExponential(6)}\n`);

let t0 = Date.now();
const A = runGate(initial, dtResolvedHalf, 6000, rk4StepKahan);       // resolved,gate
console.log(`A resolved,gate     t_c=${fmt(A.t_c)} steps=${A.steps} pair=${A.pair_index} (${sec(t0)}s)`);

t0 = Date.now();
const B = runCrossing(initial, dtResolvedHalf, 6000, rk4StepKahan);   // resolved,crossing (=imp-35278)
console.log(`B resolved,crossing t_c=${fmt(B.t_c)} step=${B.step} idx=${B.cross_index} frac=${fmtF(B.frac)} (${sec(t0)}s)`);

t0 = Date.now();
const C = runGate(initial, dtFinerHalf, 20000, rk4StepKahan);         // finer,gate (=imp-35324)
console.log(`C finer,gate        t_c=${fmt(C.t_c)} steps=${C.steps} pair=${C.pair_index} (${sec(t0)}s)`);

t0 = Date.now();
const D = runCrossing(initial, dtFinerHalf, 20000, rk4StepKahan);     // finer,crossing
console.log(`D finer,crossing    t_c=${fmt(D.t_c)} step=${D.step} idx=${D.cross_index} frac=${fmtF(D.frac)} (${sec(t0)}s)`);

// ── Decomposition of the total gap B - C. ─────────────────────────────────────
const total = B.t_c - C.t_c;                 // ~ +1.31e-7 (imp-35278 minus imp-35324)
// Path 1: C -> A (grid effect, gate event) -> B (event effect, resolved grid)
const gridEffectAtGate = A.t_c - C.t_c;      // resolved-gate minus finer-gate
const eventEffectAtResolved = B.t_c - A.t_c; // crossing minus gate, resolved grid
// Path 2: C -> D (event effect, finer grid) -> B (grid effect, crossing event)
const eventEffectAtFiner = D.t_c - C.t_c;    // crossing minus gate, finer grid
const gridEffectAtCrossing = B.t_c - D.t_c;  // resolved-crossing minus finer-crossing
const interaction = eventEffectAtResolved - eventEffectAtFiner; // == gridEffectAtGate - gridEffectAtCrossing

console.log('\n── 2x2 grid x event decomposition of the RK4 dt/2 gap at N=2000 ──');
console.log(`imp-35324 anchor  C finer,gate        = ${C.t_c.toExponential(10)}`);
console.log(`imp-35278 anchor  B resolved,crossing = ${B.t_c.toExponential(10)}`);
console.log(`TOTAL gap  B - C                       = ${signed(total)}`);
console.log('  Path 1 (grid first, at gate event):');
console.log(`    grid  effect (A-C, gate)           = ${signed(gridEffectAtGate)}`);
console.log(`    event effect (B-A, resolved grid)  = ${signed(eventEffectAtResolved)}`);
console.log('  Path 2 (event first, at finer grid):');
console.log(`    event effect (D-C, finer grid)     = ${signed(eventEffectAtFiner)}`);
console.log(`    grid  effect (B-D, crossing event) = ${signed(gridEffectAtCrossing)}`);
console.log(`  interaction (Path1 - Path2 split)    = ${signed(interaction)}`);
const eventAvg = (eventEffectAtResolved + eventEffectAtFiner) / 2;
const gridAvg = (gridEffectAtGate + gridEffectAtCrossing) / 2;
console.log(`  EVENT effect (avg over both grids)   = ${signed(eventAvg)}  (${(100 * eventAvg / total).toFixed(1)}% of total)`);
console.log(`  GRID  effect (avg over both events)  = ${signed(gridAvg)}  (${(100 * gridAvg / total).toFixed(1)}% of total)`);
console.log(`  check: eventAvg + gridAvg            = ${(eventAvg + gridAvg).toExponential(10)}  (should equal total)`);

function fmt(x) { return x === null ? 'null' : x.toExponential(10); }
function fmtF(x) { return x === null ? 'null' : x.toFixed(4); }
function signed(x) { return (x >= 0 ? '+' : '') + x.toExponential(6); }
function sec(t) { return ((Date.now() - t) / 1000).toFixed(1); }
