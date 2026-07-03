/**
 * @module imp-3603-inner-truncation-gauss-legendre-crossval
 * @fileoverview imp-3603 -- CROSS-VALIDATE the imp-3576 fitted inner-A(tau)
 *   composite-Simpson truncation constants K_n^inner (M_0..M_4) against a
 *   genuinely INDEPENDENT, higher-order Gauss-Legendre inner reference, to
 *   confirm the reported clean O(h^4) decay and ~4x-per-rung monotone shrink is
 *   NOT a reference-quadrature self-reference artifact.
 *
 *   WHAT imp-3576 DID, AND THE RESIDUAL WORRY
 *   -----------------------------------------
 *   imp-3576 isolated the inner Simpson error along a Richardson inner-panel
 *   h-ladder (innerN in {300,600,1200,2400}) and fitted K_n^inner = innerErr/h^4,
 *   reporting observed order -> 4.000, K_n stable to < 0.3% across the ladder, and
 *   a monotone-decreasing ladder 6.88e-2 / 2.45e-2 / 5.51e-3 / 1.28e-3 / 3.14e-4
 *   for M_0..M_4. Its inner reference was a Gauss-Legendre rule (GL-16, 200 panels
 *   on [0,7]) and its outer moment integral was composite Simpson (NM=1600). Two
 *   independence worries survive: (a) if that single GL-16/200 inner reference were
 *   itself under-resolved, a residual reference bias could MASQUERADE as a clean
 *   O(h^4) inner-Simpson signal; (b) the outer moment weighting was Simpson, so the
 *   whole K_n read-out shared the Simpson family on the outer path. This module
 *   removes both worries.
 *
 *   THE INDEPENDENT CROSS-CHECK (this module)
 *   -----------------------------------------
 *   (i) INDEPENDENT INNER REFERENCE. Rebuild the inner A(tau) reference with a
 *       higher-order, differently-panelled Gauss-Legendre rule (GL-24, 100 panels)
 *       and CERTIFY it agrees with the imp-3576 GL-16/200 reference to machine
 *       precision on every outer node -- so both references are converged and the
 *       reference is not the artifact.
 *   (ii) REFIT ON THE MATCHED (Simpson) OUTER GRID. Refit K_n^inner via the same
 *       Richardson ladder but isolating the inner error against the INDEPENDENT
 *       GL-24 reference (outer grid held at the imp-3576 NM=1600 Simpson grid), and
 *       confirm the constants match the imp-3576 GL-16 refit to fitting tolerance.
 *   (iii) FULLY SIMPSON-FREE OUTER LEG. Refit K_n^inner a second time with a
 *       Gauss-Legendre OUTER moment rule (GL-16 outer panels) AND the GL-24 inner
 *       reference -- removing Simpson from BOTH the inner reference and the outer
 *       weighting. K_n = int_0^{T_A} tau^n C(tau) d(tau) is a property of the inner
 *       Simpson rule alone, so any accurate outer rule must return the same
 *       constant; agreement here is the decisive no-Simpson-self-reference check.
 *
 *   MEASURED RESULT
 *   ---------------
 *   (R1) THE TWO GL INNER REFERENCES AGREE TO MACHINE PRECISION. max_tau
 *        |A_{GL24/100}(tau) - A_{GL16/200}(tau)| is at the rounding floor, so the
 *        imp-3576 inner reference was already converged -- the clean O(h^4) signal
 *        is not a reference-resolution artifact.
 *   (R2) THE INDEPENDENT-REFERENCE REFIT REPRODUCES imp-3576. On the matched Simpson
 *        outer grid, the GL-24-referenced K_n^inner match the GL-16-referenced
 *        constants (and the published 6.88e-2 / 2.45e-2 / 5.51e-3 / 1.28e-3 /
 *        3.14e-4) to within a few tenths of a percent, with observed order -> 4.0.
 *   (R3) THE SIMPSON-FREE OUTER LEG RETURNS THE SAME CONSTANTS. Weighting tau^n
 *        C(tau) with a Gauss-Legendre OUTER rule (no Simpson anywhere on the
 *        reference path) recovers the same monotone-decreasing K_n ladder and
 *        order -> 4.0, so the O(h^4) decay is intrinsic to the inner Simpson rule,
 *        not an artifact of a shared Simpson outer weighting.
 *   (R4) THE ~4x-PER-RUNG MONOTONE DECAY IS CERTIFIED INDEPENDENTLY. K_n^inner is
 *        strictly decreasing in n with each successive ratio in a ~[2, 6] band
 *        (average ~4x, K_0/K_4 ~ 2.2e2), matching imp-3576.
 *
 *   VERDICT: the imp-3576 inner-truncation constants and their clean O(h^4),
 *   ~4x-per-rung monotone decay are CONFIRMED by an independent higher-order
 *   Gauss-Legendre inner reference and a fully Simpson-free outer path. The
 *   reported decay is a genuine leading-order Simpson truncation signal, not a
 *   Simpson-vs-Simpson (or under-resolved-reference) self-reference artifact.
 *
 *   HONEST CAVEAT (mandatory)
 *   -------------------------
 *   CROSS-VALIDATION / MEASUREMENT ONLY, at the RH-equivalent scale class. This
 *   re-measures a composite-Simpson inner-truncation constant against an
 *   independent quadrature; it adds NO new mathematical structure and establishes
 *   NO operator positivity. Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT
 *   (imp-3481); the operator-level K_a &gt;= 0 sign-positivity (off-diagonal
 *   endpoint-Hankel step, imp-3066) is UNTOUCHED. No RH verdict, no QED.
 *   Platt-Trudgian Lambda &lt;= 0.2 remains the rigorous SOTA.
 *
 *   @see imp-3576-inner-simpson-truncation-constant.js (the K_n^inner ladder cross-validated here)
 *   @see imp-3547-lower-moment-simpson-residual-localization.js (the inner-fraction ladder K_n sets)
 *   @see imp-3503-moment-ladder-gauss-legendre-crossval.js (the Simpson-vs-GL gap ladder machinery)
 *
 *   Ticket: imp-3603 (accuracy, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';
const NPHI = 10;                                // completed-Riemann kernel truncation (imp-3481)
const T_A = 6;                                  // same tau cap as imp-3481/imp-3503/imp-3547/imp-3576
const INNER_CAP = 7;                            // A(tau) inner upper limit (imp-3481)

/** de Bruijn-Newman completed-Riemann kernel, truncated at n = NPHI (imp-2686 / imp-3481). */
function phiKernel(u) {
  let s = 0;
  const e2 = Math.exp(2 * u);
  const e4 = Math.exp(4 * u);
  for (let n = 1; n <= NPHI; n += 1) {
    const n2 = n * n;
    const n4 = n2 * n2;
    s += (2 * Math.PI * Math.PI * n4 * e4 - 3 * Math.PI * n2 * e2) * Math.exp(-Math.PI * n2 * e4);
  }
  return s;
}

// -- Composite Simpson (the imp-3481/imp-3547/imp-3576 rule, exactly) ------------
/** Composite Simpson quadrature of f on [lo, hi] with n subintervals (n even). */
function simpson(f, lo, hi, n) {
  const m = n % 2 === 0 ? n : n + 1;
  const h = (hi - lo) / m;
  let sum = f(lo) + f(hi);
  for (let i = 1; i < m; i += 1) {
    sum += (i % 2 === 0 ? 2 : 4) * f(lo + i * h);
  }
  return (sum * h) / 3;
}

// -- Gauss-Legendre rule builder (Newton-on-Legendre, the imp-3503/imp-3576 recipe) --
function gaussLegendreRule(n) {
  const x = new Array(n);
  const w = new Array(n);
  const half = (n + 1) >> 1;
  for (let i = 0; i < half; i += 1) {
    let z = Math.cos(Math.PI * (i + 0.75) / (n + 0.5));
    let dpn = 0;
    for (let it = 0; it < 100; it += 1) {
      let p0 = 1;
      let p1 = z;
      for (let k = 2; k <= n; k += 1) {
        const p2 = ((2 * k - 1) * z * p1 - (k - 1) * p0) / k;
        p0 = p1;
        p1 = p2;
      }
      dpn = (n * (z * p1 - p0)) / (z * z - 1);
      const dz = p1 / dpn;
      z -= dz;
      if (Math.abs(dz) < 1e-15) break;
    }
    const wi = 2 / ((1 - z * z) * dpn * dpn);
    x[i] = -z;
    x[n - 1 - i] = z;
    w[i] = wi;
    w[n - 1 - i] = wi;
  }
  return Object.freeze({ nodes: Object.freeze(x), weights: Object.freeze(w) });
}

/** Composite Gauss-Legendre integral of f on [lo, hi] with `panels` uniform panels. */
function integrateGL(f, lo, hi, panels, rule) {
  const { nodes, weights } = rule;
  const step = (hi - lo) / panels;
  const halfWidth = step / 2;
  let sum = 0;
  for (let p = 0; p < panels; p += 1) {
    const center = lo + (p + 0.5) * step;
    for (let k = 0; k < nodes.length; k += 1) {
      sum += weights[k] * f(center + halfWidth * nodes[k]);
    }
  }
  return sum * halfWidth;
}

// imp-3576 inner reference (GL-16, 200 panels) and the INDEPENDENT higher-order
// reference (GL-24, 100 panels) -- different order AND different panel count.
const GL16_RULE = gaussLegendreRule(16);
const GL24_RULE = gaussLegendreRule(24);
const REF16_PANELS = 200;                       // imp-3576 inner-reference panel count
const REF24_PANELS = 100;                       // independent inner-reference panel count

/** Inner autocorrelation A(tau) = int_0^7 Phi(s)Phi(s+tau)ds via a GL rule. */
function innerAgl(tau, panels, rule) {
  return integrateGL((s) => phiKernel(s) * phiKernel(s + tau), 0, INNER_CAP, panels, rule);
}

// -- The imp-3576-converged outer moment grid (matched Simpson outer path) --------
const OUTER_NM = 1600;                          // imp-3576 base outer grid (converged at NM=1600)
const OUTER_H = T_A / OUTER_NM;
const OUTER_TAUS = new Array(OUTER_NM + 1);
for (let j = 0; j <= OUTER_NM; j += 1) OUTER_TAUS[j] = j * OUTER_H;

/** Composite-Simpson outer moment M_n from a precomputed A(tau) grid on OUTER_TAUS. */
function outerMomentSimpson(nMom, aVals) {
  let sum = 0;
  for (let j = 0; j <= OUTER_NM; j += 1) {
    const w = j === 0 || j === OUTER_NM ? 1 : (j % 2 === 0 ? 2 : 4);
    sum += w * Math.pow(OUTER_TAUS[j], nMom) * aVals[j];
  }
  return (sum * OUTER_H) / 3;
}

/** Inner A(tau) grid on the outer Simpson nodes, via composite Simpson at `innerN` panels. */
function innerSimpsonGrid(innerN) {
  return OUTER_TAUS.map((tau) => simpson((s) => phiKernel(s) * phiKernel(s + tau), 0, INNER_CAP, innerN));
}

const MOMENTS = Object.freeze([0, 1, 2, 3, 4]);
const INNER_LADDER = Object.freeze([300, 600, 1200, 2400]);

// Shared inner Simpson grids on the outer nodes (one per ladder rung).
const LADDER_GRIDS = INNER_LADDER.map(innerSimpsonGrid);

// The two inner GL reference grids on the outer nodes: imp-3576 (GL-16/200) and the
// independent higher-order rule (GL-24/100).
const INNER_GL16_GRID = OUTER_TAUS.map((tau) => innerAgl(tau, REF16_PANELS, GL16_RULE));
const INNER_GL24_GRID = OUTER_TAUS.map((tau) => innerAgl(tau, REF24_PANELS, GL24_RULE));

// (R1) The two GL inner references agree to machine precision on every outer node.
let maxRefDisagreement = 0;
for (let j = 0; j <= OUTER_NM; j += 1) {
  const d = Math.abs(INNER_GL24_GRID[j] - INNER_GL16_GRID[j]);
  if (d > maxRefDisagreement) maxRefDisagreement = d;
}

/** Richardson refit of K_n^inner on the matched Simpson outer grid against `refGrid`. */
function fitKsimpsonOuter(nMom, refGrid) {
  const refInnerExact = outerMomentSimpson(nMom, refGrid);
  const rungs = INNER_LADDER.map((innerN, i) => {
    const h = INNER_CAP / innerN;
    const mSimpson = outerMomentSimpson(nMom, LADDER_GRIDS[i]);
    const innerErr = Math.abs(mSimpson - refInnerExact);
    return { innerN, h, innerErr, K: innerErr / Math.pow(h, 4) };
  });
  const orders = [];
  for (let i = 1; i < rungs.length; i += 1) {
    orders.push(Math.log(rungs[i - 1].innerErr / rungs[i].innerErr) / Math.log(rungs[i - 1].h / rungs[i].h));
  }
  const Ks = rungs.map((r) => r.K);
  const Kconverged = Ks[Ks.length - 1];
  const KsFine = Ks.slice(1);
  const Kspread = (Math.max(...KsFine) - Math.min(...KsFine)) / Kconverged;
  return { n: nMom, Kconverged, Kspread, observedOrder: orders[orders.length - 1] };
}

// (R2) matched-outer refit: imp-3576 GL-16 reference vs the independent GL-24 reference.
const KFIT_GL16 = MOMENTS.map((n) => fitKsimpsonOuter(n, INNER_GL16_GRID));
const KFIT_GL24 = MOMENTS.map((n) => fitKsimpsonOuter(n, INNER_GL24_GRID));

const K_GL16 = KFIT_GL16.map((f) => f.Kconverged);
const K_GL24 = KFIT_GL24.map((f) => f.Kconverged);

// -- (R3) Fully Simpson-free outer leg: GL outer moment rule + GL-24 inner reference --
const GL_OUTER_PANELS = 80;                     // independent Gauss-Legendre OUTER panel count
const GL_OUTER_STEP = T_A / GL_OUTER_PANELS;
const GL_OUTER_HALF = GL_OUTER_STEP / 2;
// Outer GL tau-nodes across [0, T_A] (a Simpson-free set of moment abscissae).
const GL_OUTER_TAUS = [];
const GL_OUTER_WEIGHTS = [];
for (let p = 0; p < GL_OUTER_PANELS; p += 1) {
  const center = (p + 0.5) * GL_OUTER_STEP;
  for (let k = 0; k < GL16_RULE.nodes.length; k += 1) {
    GL_OUTER_TAUS.push(center + GL_OUTER_HALF * GL16_RULE.nodes[k]);
    GL_OUTER_WEIGHTS.push(GL16_RULE.weights[k]);
  }
}

// Inner Simpson grids and the GL-24 inner reference on the GL outer tau-nodes.
const GL_OUTER_LADDER_GRIDS = INNER_LADDER.map((innerN) =>
  GL_OUTER_TAUS.map((tau) => simpson((s) => phiKernel(s) * phiKernel(s + tau), 0, INNER_CAP, innerN)));
const GL_OUTER_REF_GRID = GL_OUTER_TAUS.map((tau) => innerAgl(tau, REF24_PANELS, GL24_RULE));

/** Gauss-Legendre outer moment M_n from a precomputed A(tau) grid on the GL outer nodes. */
function outerMomentGL(nMom, aVals) {
  let sum = 0;
  for (let q = 0; q < GL_OUTER_TAUS.length; q += 1) {
    sum += GL_OUTER_WEIGHTS[q] * Math.pow(GL_OUTER_TAUS[q], nMom) * aVals[q];
  }
  return sum * GL_OUTER_HALF;
}

/** Richardson refit of K_n^inner on the fully Simpson-free GL outer path. */
function fitKglOuter(nMom) {
  const refInnerExact = outerMomentGL(nMom, GL_OUTER_REF_GRID);
  const rungs = INNER_LADDER.map((innerN, i) => {
    const h = INNER_CAP / innerN;
    const mSimpson = outerMomentGL(nMom, GL_OUTER_LADDER_GRIDS[i]);
    const innerErr = Math.abs(mSimpson - refInnerExact);
    return { innerN, h, innerErr, K: innerErr / Math.pow(h, 4) };
  });
  const orders = [];
  for (let i = 1; i < rungs.length; i += 1) {
    orders.push(Math.log(rungs[i - 1].innerErr / rungs[i].innerErr) / Math.log(rungs[i - 1].h / rungs[i].h));
  }
  const Ks = rungs.map((r) => r.K);
  const Kconverged = Ks[Ks.length - 1];
  return { n: nMom, Kconverged, observedOrder: orders[orders.length - 1] };
}

const KFIT_GLOUTER = MOMENTS.map((n) => fitKglOuter(n));
const K_GLOUTER = KFIT_GLOUTER.map((f) => f.Kconverged);

// -- Agreement metrics -----------------------------------------------------------
// imp-3576 published (3-sig-fig) inner-truncation constants for M_0..M_4.
const IMP3576_K = Object.freeze([6.88e-2, 2.45e-2, 5.51e-3, 1.28e-3, 3.14e-4]);

function maxRelDiff(a, b) {
  let m = 0;
  for (let i = 0; i < a.length; i += 1) {
    const r = Math.abs(a[i] - b[i]) / Math.abs(b[i]);
    if (r > m) m = r;
  }
  return m;
}

const maxRelDiff_gl24_vs_gl16 = maxRelDiff(K_GL24, K_GL16);       // independent ref vs imp-3576 ref (matched outer)
const maxRelDiff_gl24_vs_pub = maxRelDiff(K_GL24, IMP3576_K);     // independent ref vs published literals
const maxRelDiff_glouter_vs_gl24 = maxRelDiff(K_GLOUTER, K_GL24); // Simpson-free outer vs matched outer
const maxRelDiff_glouter_vs_pub = maxRelDiff(K_GLOUTER, IMP3576_K);

// Observed order stays ~4 on every leg / moment.
const allOrders = [
  ...KFIT_GL24.map((f) => f.observedOrder),
  ...KFIT_GLOUTER.map((f) => f.observedOrder),
];
const minObservedOrder = Math.min(...allOrders);
const maxObservedOrder = Math.max(...allOrders);

// The independent K ladder is strictly monotone decreasing in n.
let kIsMonotoneDecreasing = true;
for (let i = 1; i < K_GL24.length; i += 1) {
  if (!(K_GL24[i] < K_GL24[i - 1])) kIsMonotoneDecreasing = false;
}
// Each successive ratio lives in a ~4x band (2..6); average is ~4x, K_0/K_4 ~ 2.2e2.
const ratios = [];
for (let i = 1; i < K_GL24.length; i += 1) ratios.push(K_GL24[i - 1] / K_GL24[i]);
const minRatio = Math.min(...ratios);
const maxRatio = Math.max(...ratios);
const overallDecay = K_GL24[0] / K_GL24[K_GL24.length - 1];

const maxKspread24 = Math.max(...KFIT_GL24.map((f) => f.Kspread));

const verdict =
  maxRefDisagreement < 1e-9 &&
  maxRelDiff_gl24_vs_gl16 < 0.01 &&
  maxRelDiff_gl24_vs_pub < 0.03 &&
  maxRelDiff_glouter_vs_gl24 < 0.03 &&
  minObservedOrder > 3.9 && maxObservedOrder < 4.1 &&
  kIsMonotoneDecreasing && minRatio > 2 && maxRatio < 6
    ? 'IMP3576-K_n-INNER-CONFIRMED-BY-INDEPENDENT-GL24-INNER-REFERENCE-AND-SIMPSON-FREE-GL-OUTER-LEG-CLEAN-O(h^4)-MONOTONE-~4x-DECAY-NOT-A-QUADRATURE-SELF-REFERENCE-ARTIFACT'
    : 'INDETERMINATE';

export const IMP3603_INNER_TRUNCATION_GL_CROSSVAL = Object.freeze({
  id: 'imp-3603-inner-truncation-gauss-legendre-crossval',
  ticket: 'imp-3603',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  crossValidates: 'imp-3576-inner-simpson-truncation-constant.js',
  reuses: 'imp-3503-moment-ladder-gauss-legendre-crossval.js',

  summary:
    'CROSS-VALIDATES the imp-3576 inner-A(tau) composite-Simpson truncation constants K_n^inner (M_0..M_4) against a ' +
    'genuinely INDEPENDENT higher-order Gauss-Legendre inner reference (GL-24/100 panels, vs the imp-3576 GL-16/200 ' +
    'panels) and a fully Simpson-free Gauss-Legendre OUTER moment leg. MEASURED: the two GL inner references agree to ' +
    'machine precision on every outer node (max disagreement < 1e-9), so the imp-3576 reference was converged and the ' +
    'O(h^4) signal is not a reference-resolution artifact; refitting K_n^inner against the independent GL-24 reference ' +
    'on the matched Simpson outer grid reproduces the imp-3576 GL-16 constants to < 1% and the published ' +
    '6.88e-2/2.45e-2/5.51e-3/1.28e-3/3.14e-4 ladder to < 3%, with observed order -> 4.0; and a fully Simpson-free ' +
    'GL-outer refit (no Simpson on the reference path) returns the same monotone-decreasing ladder to < 3%. The ' +
    '~4x-per-rung monotone decay (successive ratios in [2,6], K_0/K_4 ~ 2.2e2) is confirmed independently. VERDICT: the ' +
    'imp-3576 clean O(h^4), ~4x-per-rung inner-truncation-constant decay is a genuine leading-order Simpson signal, NOT ' +
    'a Simpson-vs-Simpson (or under-resolved-reference) self-reference artifact. CROSS-VALIDATION/MEASUREMENT, ' +
    'RH-EQUIVALENT, necessary-but-not-sufficient; adds no new structure; operator positivity (imp-3066) untouched; no ' +
    'RH verdict.',

  method: Object.freeze({
    moment: 'M_n = int_0^{T_A} tau^n A(tau)d(tau), A(tau)=int_0^7 Phi(s)Phi(s+tau)ds, NPHI=10 (imp-3481 recipe)',
    innerConstant: 'K_n^inner = int_0^{T_A} tau^n C(tau)d(tau); moment inner-error ~ K_n^inner h^4, h = INNER_CAP/innerN',
    independentInnerReference: 'GL-' + GL24_RULE.nodes.length + ' / ' + REF24_PANELS + ' panels (vs imp-3576 GL-16 / ' + REF16_PANELS + ' panels)',
    referenceAgreementCheck: 'max_tau |A_{GL24}(tau) - A_{GL16}(tau)| over the outer nodes -- both references converged if machine-small',
    matchedOuterRefit: 'refit K_n via the innerN ladder against GL-24, outer moment grid held at the imp-3576 Simpson NM=' + OUTER_NM,
    simpsonFreeOuterLeg: 'refit K_n via the innerN ladder against GL-24 with a Gauss-Legendre OUTER rule (GL-16, ' + GL_OUTER_PANELS + ' panels) -- no Simpson on the reference path',
    richardsonLadder: 'innerN in {' + INNER_LADDER.join(', ') + '}, K = innerErr / h^4; observedOrder = log(err(h)/err(h/2)) / log(2)',
    moments: MOMENTS,
    tauCap: T_A,
    innerCap: INNER_CAP,
    nphi: NPHI,
    selfComputing: true,
  }),

  measured: Object.freeze({
    kFitGl16: Object.freeze(KFIT_GL16.map((f) => Object.freeze(f))),   // imp-3576-style refit (GL-16 inner ref)
    kFitGl24: Object.freeze(KFIT_GL24.map((f) => Object.freeze(f))),   // independent GL-24 inner ref, matched Simpson outer
    kFitGlOuter: Object.freeze(KFIT_GLOUTER.map((f) => Object.freeze(f))), // fully Simpson-free GL outer leg
    K_GL16: Object.freeze(K_GL16),
    K_GL24: Object.freeze(K_GL24),
    K_GLOUTER: Object.freeze(K_GLOUTER),
    imp3576K: IMP3576_K,
    maxRefDisagreement,                          // < 1e-9: GL-24 and GL-16 references agree (both converged)
    maxRelDiff_gl24_vs_gl16,                      // < 1%: independent-reference refit reproduces imp-3576
    maxRelDiff_gl24_vs_pub,                       // < 3%: matches the published 3-sig-fig ladder
    maxRelDiff_glouter_vs_gl24,                   // < 3%: Simpson-free outer leg returns the same constants
    maxRelDiff_glouter_vs_pub,
    minObservedOrder,                             // ~ 4.0 across every leg/moment
    maxObservedOrder,                             // ~ 4.0
    maxKspread24,                                 // < 1%: constant stable across the ladder
    kIsMonotoneDecreasing,                        // TRUE: strictly decreasing independent ladder
    minRatio,                                     // successive-rung decay ratio band...
    maxRatio,                                     // ...both in ~[2, 6] (average ~4x)
    overallDecay,                                 // K_0/K_4 ~ 2.2e2
    verdict,
  }),

  interpretation: Object.freeze({
    referenceWasConverged:
      'The imp-3576 GL-16/200 inner reference and the independent GL-24/100 reference agree to machine precision on ' +
      'every outer node, so the reported clean O(h^4) inner-Simpson signal cannot be a residual bias of an ' +
      'under-resolved single reference.',
    independentRefitReproducesImp3576:
      'Refitting K_n^inner against the independent GL-24 reference on the matched Simpson outer grid reproduces the ' +
      'imp-3576 GL-16 constants to < 1% and the published 6.88e-2/2.45e-2/5.51e-3/1.28e-3/3.14e-4 ladder to < 3%, with ' +
      'observed order -> 4.0 -- the fitted constants do not depend on which converged GL inner reference is used.',
    simpsonFreeOuterConfirms:
      'K_n^inner = int_0^{T_A} tau^n C(tau) d(tau) is a property of the inner Simpson rule alone. A fully Simpson-free ' +
      'refit -- Gauss-Legendre OUTER moment rule plus the GL-24 inner reference -- returns the same monotone-decreasing ' +
      'ladder, so the O(h^4) decay is intrinsic to the inner rule, not an artifact of a shared Simpson outer weighting.',
    decayIsGenuine:
      'The ~4x-per-rung monotone decay (successive ratios in [2, 6], K_0/K_4 ~ 2.2e2) is certified independently; the ' +
      'imp-3576 result is a genuine leading-order Simpson truncation constant, not a quadrature self-reference artifact.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    numericalCharacterizationOnly:
      'This module re-measures a composite-Simpson inner-truncation constant against an independent higher-order ' +
      'Gauss-Legendre quadrature and a Simpson-free outer path. It adds no new mathematical structure and establishes ' +
      'NO operator positivity.',
    necessaryNotSufficient:
      'Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT (imp-3481). The operator-level K_a >= 0 sign-positivity ' +
      '(off-diagonal endpoint-Hankel step, imp-3066) remains the lone obstruction, UNTOUCHED. No RH verdict.',
    didNotAttemptPositivity: true,
    sota: 'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA',
  }),
});

// -- Tripwire assertions ---------------------------------------------------------
export const IMP3603_INNER_TRUNCATION_GL_CROSSVAL_ASSERTIONS = [
  {
    id: 'imp3603-gl-references-agree-to-machine-precision',
    why: 'THE INDEPENDENCE ANCHOR: the independent GL-24/100 inner reference must agree with the imp-3576 GL-16/200 ' +
         'reference to < 1e-9 on every outer node, so both are converged and the O(h^4) signal is not a ' +
         'reference-resolution artifact.',
    holds: () => maxRefDisagreement < 1e-9,
  },
  {
    id: 'imp3603-independent-refit-reproduces-imp3576-constants',
    why: 'The K_n^inner refit against the independent GL-24 reference (matched Simpson outer grid) must match the ' +
         'imp-3576 GL-16 refit to < 1%, confirming the constants do not depend on the choice of converged GL reference.',
    holds: () => maxRelDiff_gl24_vs_gl16 < 0.01,
  },
  {
    id: 'imp3603-independent-refit-matches-published-ladder',
    why: 'The independent-reference K_n ladder must match the imp-3576 published 6.88e-2/2.45e-2/5.51e-3/1.28e-3/' +
         '3.14e-4 (3-sig-fig) constants to < 3%.',
    holds: () => maxRelDiff_gl24_vs_pub < 0.03,
  },
  {
    id: 'imp3603-simpson-free-outer-leg-returns-same-constants',
    why: 'THE DECISIVE CHECK: a fully Simpson-free refit (Gauss-Legendre OUTER rule + GL-24 inner reference) must ' +
         'return the same K_n ladder to < 3%, proving the O(h^4) decay is intrinsic to the inner Simpson rule and not ' +
         'a Simpson-vs-Simpson self-reference artifact.',
    holds: () => maxRelDiff_glouter_vs_gl24 < 0.03 && maxRelDiff_glouter_vs_pub < 0.05,
  },
  {
    id: 'imp3603-observed-order-is-four-on-every-leg',
    why: 'The observed convergence order must stay in (3.9, 4.1) for every moment on both the independent-reference and ' +
         'Simpson-free-outer legs, so K = err/h^4 is a genuine leading-order Simpson constant on each path.',
    holds: () => minObservedOrder > 3.9 && maxObservedOrder < 4.1,
  },
  {
    id: 'imp3603-independent-ladder-is-monotone-4x-decay',
    why: 'The independent K_n ladder must be strictly monotone decreasing with each successive ratio in a ~[2, 6] band ' +
         '(average ~4x, K_0/K_4 ~ 2.2e2), matching the imp-3576 monotone-decay finding.',
    holds: () => kIsMonotoneDecreasing && minRatio > 2 && maxRatio < 6 && overallDecay > 100,
  },
  {
    id: 'imp3603-verdict-confirms-not-a-self-reference-artifact',
    why: 'The classified verdict must be the imp-3576-confirmed / not-a-quadrature-self-reference result, not ' +
         'indeterminate.',
    holds: () =>
      verdict ===
      'IMP3576-K_n-INNER-CONFIRMED-BY-INDEPENDENT-GL24-INNER-REFERENCE-AND-SIMPSON-FREE-GL-OUTER-LEG-CLEAN-O(h^4)-MONOTONE-~4x-DECAY-NOT-A-QUADRATURE-SELF-REFERENCE-ARTIFACT',
  },
  {
    id: 'imp3603-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: cross-validation/measurement only, mass-feasibility necessary-but-not-sufficient, ' +
         'operator positivity (imp-3066) untouched, PT 0.2 stays SOTA.',
    holds: () => {
      const c = IMP3603_INNER_TRUNCATION_GL_CROSSVAL.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.isStructuralDiagnostic === true &&
        c.didNotAttemptPositivity === true &&
        /Platt-Trudgian/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP3603_INNER_TRUNCATION_GL_CROSSVAL_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3603-inner-truncation-gauss-legendre-crossval assertion failed: ${assertion.id}`);
  }
}

export default IMP3603_INNER_TRUNCATION_GL_CROSSVAL;
