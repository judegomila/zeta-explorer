/**
 * @fileoverview r2-flint-audit-2026-10-02 — single-reader audit of FLINT 3.6.0’s Platt/Turing zero-isolation chain (the premise of every
 * local RH window used by Lemma B and of the RH-height campaign), formalization/rh-verification-campaign/FLINT_AUDIT.md, plus a wrap-fixed
 * rerun of the 1.65X window done in this synthesis.
 *
 * Findings: 1 ERROR, 3 GAPs, 1 citation replacement.
 *  - ERROR: Platt 2017 Lemma A.3 is printed a factor π low (both terms); acb_dirichlet_platt_c_bound inherits it. Counterexamples by 30-digit
 *    quadrature: σ = 3, t0 = 100, h = 2: true C = 628.35 vs FLINT 318.40 (ratio 1.973); σ = 5, t0 = 1000, h = 5: ratio 1.220. Corrected bound
 *    C_true ≤ π((1 + σ²/t0²)/2)^{(σ−1)/4}·C_FLINT. At the pilot’s σ_interp = 25 the factor is π/64 ≈ 0.049 < 1, so every pilot use holds.
 *  - GAP (needs code): step-5 convolution wrap-around. Table indices q ∈ (N/2, N) are read as u = q/B > A/2 but hold the aliased u = q/B − A
 *    ∈ (−4, −1.64]; neither Platt 2017 nor FLINT bounds this. Closed by an 18-line patch (#ifdef WRAP_FIX: overwrite with 0 ± A7_k/k!, valid
 *    by the right-shift part of A.6). The patched code reproduces the 21,665-zero window at 7.8e12 and N(3000175332800) = 12,363,153,437,138.
 *  - GAP: A.5 hypothesis (B ≥ 2h√(K−1)) satisfied (4096 vs ≤ 1508). GAP: A.6 Γ-ratio claim fails at σ = 3 (2.667), holds numerically for
 *    σ ≥ 5 on y ∈ [0, 40] (no proof for all y); the pilot uses σ_grid ≈ 1963.
 *  - Citation: PT15’s |ζ(1/2 + it)| bound (0.732 t^{1/6} log t) is replaced by HPY22’s 0.618 t^{1/6} log t in A.10/A.11/C.2 (HPY22 reports
 *    a Kusmin–Landau constant off by a factor 2 in PT15-era bounds).
 *  - Sound: Turing bound (b = 6 at 3e12–7.8e12; Trudgian Cor 2.3 constants valid for log g ≤ 203), Arias de Reyna anchor logic, index gluing.
 *
 * This synthesis: the 1.65X window (6 chunks, original run without recorded binary provenance) rerun with the wrap-fixed driver
 *  (/tmp/flintaudit/patch/drv_fix, same T and n_first per chunk, ≈ 100 CPU-s): 42,429 distinct indices 20792484253745..20792484296173,
 *  all 42,383 original indices present, monotone and disjoint, 0 disagreements on doubly certified indices, cover of [x_L/2, x_R/2]
 *  (tmp/r2-synth-out/w165fix/{c0..c5.txt, check.py, SUMMARY.json}). The chunk 4/5 seam now overlaps (chunk 4 reaches 4950000008631.5198).
 *
 * PROVED (re-derived, single reader): A.5, A.7, A.8/A.9, A.11, B.1, B.2, C.1, C.3 match the code; the A.3 correction; the wrap gap.
 * CERTIFIED (on Arb, the patched lemmas, HPY22, Trudgian 2011, Brent 1979): the 7.8e12 window, the PT hand-off, the 1.65X window.
 * CONDITIONAL: other pilot windows (unpatched) on an unwritten Lemma A.6′. MEASURED: bound magnitudes, patched/original counts.
 * HEURISTIC: wrapped entries ≈ e^{−10^6}; A.6′ order of magnitude.
 * Verdict: the chain is sound at the pilot parameters once the wrap patch is used. Single reader, no independent referee, nothing sent upstream.
 *  PT Lambda <= 0.2 stands. RH open. NO QED.
 * Files: formalization/rh-verification-campaign/FLINT_AUDIT.md, flint_audit/{platt_multieval_wrapfix.patch, wrapfix_driver.c, bounds.c, cb.c,
 *  ctest.py, gam.py, gram.py, sup4.c}; tmp/r2-synth-out/w165fix/.
 * Import-free. ASSERTIONS recompute the A.3 correction factor against the counterexample ratios and the σ = 25 slack, the wrapped u-range and the
 * ℓ_J < A/2 guard, the A.5 margin, the Trudgian-constant validity range, the Γ sup margin, and the window index bookkeeping.
 */

const corrA3 = (sigma, t0) => Math.PI * ((1 + (sigma * sigma) / (t0 * t0)) / 2) ** ((sigma - 1) / 4);

export const R2_FLINT_AUDIT = Object.freeze({
  id: 'r2-flint-audit-2026-10-02',
  date: '2026-10-02',
  title: 'FLINT 3.6.0 Platt/Turing audit: one printed-lemma ERROR (harmless at pilot σ), wrap-around GAP closed by patch',
  status: 'AUDIT (single reader, internal; no independent referee). 1 ERROR, 3 GAPs, 1 citation replacement. Windows used by Lemma B rerun with the patch. NO QED.',

  a3: Object.freeze({
    counterexamples: [{ sigma: 3, t0: 100, h: 2, trueC: 628.35, flintC: 318.40, ratio: 1.973 }, { sigma: 5, t0: 1000, h: 5, ratio: 1.220 }],
    sigma25Ratios: [0.0476, 0.0491],
  }),
  wrap: Object.freeze({ A: 8, B: 4096, mJ: [9348, 9656], uRange: [-4, -1.64], patchLines: 18 }),
  params: Object.freeze({ hMax: 117.74, Kmax: 42, sigmaGrid: [1961, 1965], sigmaInterp: 25, lJ: [2.28, 2.36] }),
  turing: Object.freeze({ lehman: [[0.006048, 0.0061], [0.07907, 0.08]], trudgian: { exact: [0.003130, 0.1039], used: [0.0031, 0.11] }, blockBound: 6 }),
  gammaSup: Object.freeze({ value: 3.9164, radius: 0.058, bound: 4 }),
  a6Ratio: Object.freeze([[3, 2.667], [5, 0.711], [7, 0.081], [25, 1.3e-17]]),
  windows: Object.freeze([
    { at: '7.8e12 (2.6X, PT-height band)', first: 33328427938874, last: 33328427960538, zeros: 21665, patched: 'rerun with patch (audit)' },
    { at: 'PT hand-off', N: 12363153437138, T: 3000175332800, patched: 'rerun with patch (audit)' },
    { at: '4.95e12 (1.65X, height route)', first: 20792484253745, last: 20792484296127, zeros: 42383, patched: 'rerun with patch (this synthesis)',
      rerun: { distinct: 42429, lastFound: 20792484296173, missingOriginal: 0, disagreements: 0, monotoneDisjoint: true, cover: [4950000000499.687057964114, 4950000010231.875123917275] } },
  ]),
  walls165: Object.freeze({ xL: 9900000003031.5801, xR: 9900000018622.2559 }),
  chunk0: Object.freeze({ original: 7227, patched: 7247, cpuOrig: 16.6, cpuPatched: 17.2 }),

  verdict:
    'FLINT 3.6.0’s Platt/Turing chain is sound at the pilot parameters when the 18-line wrap patch is used; Platt’s Lemma A.3 as printed is false at '
    + 'σ = 3, 5 but holds with slack π/64 at σ_interp = 25. Every window Lemma B uses (7.8e12, PT hand-off, 4.95e12) is reproduced by the patched code. '
    + 'Single-reader audit; an independent referee and the campaign-build guards are pending. PT Lambda <= 0.2 stands. RH open. NO QED.',
  nextStep: 'Campaign build with WRAP_FIX and the FLINT_AUDIT §6 guards (c_bound ×π or σ ≥ 9 and t0 ≥ 2σ, B ≥ 2h√(K−1), σ_grid ≥ 5, m_J < N/2, sign changes = zn); rerun the remaining pilot windows; independent referee of §2.1–2.2 before any spend.',
});

const A = R2_FLINT_AUDIT;

export const R2_FLINT_AUDIT_ASSERTIONS = Object.freeze([
  {
    id: 'r2-flint-a3-correction',
    holds: () => {
      const [c3, c5] = A.a3.counterexamples, f25 = corrA3(25, 4.95e12);
      return c3.ratio > 1 && c5.ratio > 1 && c3.ratio <= corrA3(3, 100) && c5.ratio <= corrA3(5, 1000)
        && Math.abs(c3.trueC / c3.flintC - c3.ratio) < 1e-3 && Math.abs(f25 - Math.PI / 64) < 1e-12 && f25 < 1
        && A.a3.sigma25Ratios.every((r) => r <= f25 + 1e-4);
    },
    why: 'FLINT c_bound is below the true C at σ = 3, 5 (ratios 1.973, 1.220), within the corrected factor π((1+σ²/t0²)/2)^{(σ−1)/4} (2.22, 1.57); at σ = 25 the factor is π/64 = 0.0491 < 1.',
  },
  {
    id: 'r2-flint-wrap-range-and-guard',
    holds: () => {
      const { A: a, B: b, mJ, uRange } = A.wrap, N = a * b;
      const uMax = mJ.map((m) => (N / 2 + m) / b - a), lJ = mJ.map((m) => m / b);
      return (N / 2 + 1) / b - a > uRange[0] && uMax.every((u) => u > -1.72 && u <= uRange[1] + 0.005) && lJ.every((l) => l < a / 2)
        && Math.abs(lJ[0] - A.params.lJ[0]) < 0.01 && Math.abs(lJ[1] - A.params.lJ[1]) < 0.01;
    },
    why: 'Wrapped indices q ∈ (N/2, N/2 + m_J] hold u = q/B − A ∈ (−4, −1.64]; ℓ_J = m_J/B ≤ 2.36 < A/2 = 4, so the zero-padding guard holds.',
  },
  {
    id: 'r2-flint-hypotheses-and-turing',
    holds: () => {
      const t = A.turing, [e1, e0] = t.trudgian.exact, [u1, u0] = t.trudgian.used;
      const Lmax = (u0 - e0) / (e1 - u1); // used ≥ exact ⟺ log g ≤ Lmax
      return A.wrap.B >= 2 * A.params.hMax * Math.sqrt(A.params.Kmax - 1) && t.lehman.every(([x, y]) => x <= y)
        && Lmax > 203 && Lmax < 204 && Math.log(7.8e12) < Lmax && A.gammaSup.value + A.gammaSup.radius < A.gammaSup.bound
        && A.a6Ratio[0][1] > 1 && A.a6Ratio.slice(1).every(([, r]) => r < 1) && A.params.sigmaGrid[0] >= 5;
    },
    why: 'A.5: 4096 ≥ 2·117.74·√41 = 1508; Lehman constants round up; Trudgian Cor 2.3 as coded is valid for log g ≤ 203.3 (log 7.8e12 = 29.7); sup |Γ|e^{πx/4} ≤ 3.975 < 4; A.6 ratio fails at σ = 3 only.',
  },
  {
    id: 'r2-flint-windows-rerun',
    holds: () => {
      const [w26, ho, w165] = A.windows, r = w165.rerun;
      return w26.last - w26.first + 1 === w26.zeros && w165.last - w165.first + 1 === w165.zeros
        && r.lastFound - w165.first + 1 === r.distinct && r.distinct >= w165.zeros && r.missingOriginal === 0 && r.disagreements === 0
        && r.monotoneDisjoint && r.cover[0] <= A.walls165.xL / 2 && r.cover[1] >= A.walls165.xR / 2 && ho.N === 12363153437138
        && A.chunk0.patched >= A.chunk0.original && A.windows.every((w) => /rerun with patch/.test(w.patched));
    },
    why: 'All windows Lemma B uses are reproduced by the wrap-fixed code; the 1.65X rerun keeps every original index (42,429 ⊇ 42,383) and covers [x_L/2, x_R/2].',
  },
  {
    id: 'r2-flint-honest-scope',
    holds: () => /PT Lambda <= 0\.2 stands/.test(A.verdict) && /NO QED/.test(A.verdict) && /Single-reader/.test(A.verdict) && /no independent referee/.test(A.status),
    why: 'Audit by one reader; moves no bound.',
  },
]);

export default R2_FLINT_AUDIT;
