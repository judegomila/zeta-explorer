/**
 * @fileoverview route-25-bridge-as-scattering-2026-10-12 — roadmap route 25 (batch 7, group E): the twin-ladder bridge read as the
 * Lax–Phillips / Faddeev–Pavlov scattering matrix of the modular surface SL2(Z)\H. One run plus one adversarial internal referee pass
 * (not refuted; severity major: one measurement was a script bug and one "proved" item was false as stated). The referee corrections
 * are applied below.
 *
 * PROVED (elementary): (a) φ(s) = Λ(2s−1)/Λ(2s) = c_∞(s) · χ(2s−1) · Z(s), with c_∞(s) = √π Γ(s−½)/Γ(s) (archimedean Harish-Chandra
 *  ratio), χ the bridge (ζ(w) = χ(w) ζ(1−w)) and Z(s) = ζ(2−2s)/ζ(2s); grouping the archimedean factors gives φ = β·Z with
 *  β(s) = π^{2s−1} Γ(1−s)/Γ(s); β and Z are each unimodular on Re s = ½ and each satisfy f(s)f(1−s) = 1. (b) On the axis s = ½ + it the
 *  bridge is sampled at w = 2it (Re w = 0, off its lossless line): |χ(2it)| = √(t/π)·√(tanh πt), exactly cancelled by |c_∞| = √(π coth(πt)/t).
 *  (c) The poles of φ in 0 < Re s < ½ are exactly the ρ/2 (zeros of ζ(2s)); they sit in the ζ(2s) factor. (d) Scattering axioms are
 *  Euler-blind (referee-corrected form): for the relocation ξ → ξ·Q_δ/Q_0 with Q_0 = (w − ρ₁)(w − ρ̄₁) QUADRATIC and Q_δ the quartic of the
 *  off-line quartet, φ_δ stays unitary on the axis, satisfies φ(s)φ(1−s) = 1, has positive residue at s = 1 and S = φ(s)(s−1)/s stays inner,
 *  with the resonance at Re s = (½ + δ)/2; the de Bruijn-flow φ_t (ξ_t(w) = 8 H_t(−2i(w − ½))) keeps unitarity, the functional relation and a
 *  positive residue for every real t. (e) Causality criterion: the mirror resonance of a zero z = x + iy of H_t has Re s ≥ ½ iff |y| ≥ 1 iff
 *  Re w ≥ 1 — the ζ(1+it) ≠ 0 level. (f) The local all-pass factors z_p(s) = ζ_p(2−2s)/ζ_p(2s) need Re s > ½ and Re s < ½ at once, so their
 *  product converges absolutely nowhere. (g) Winding split W(T) = W_∞(T) + arg ζ(1+2iT)/π + ½, W_∞(T) ~ (T/π) log(T/(πe)).
 * CERTIFIED: nothing (all numerics mpmath, 30 digits; no Arb balls).
 * CONDITIONAL: inner property of φ_t for t < 0 iff ξ_t has no zero with Re w ≥ 1 (checked only for z ≤ 110); Lax–Phillips functional model,
 *  the Faddeev–Pavlov identification of the ρ/2 as resonances and the spectral proof of ζ(1+it) ≠ 0 are cited, not re-checked; off-line
 *  resonances for every t < 0 at some height come from Rodgers–Tao Λ ≥ 0.
 * MEASURED (mpmath 30 digits; referee re-ran each with independent code): factorisation 4.3e-30; |φ| = 1 on the axis to 3e-31; residue at
 *  s = 1 = 0.95492965855 = 3/π; resonances n = 1..20 equal ρ_n/2 to 2.9e-30; Gamma-shift unitarity defect ~t^-2; corrected relocation
 *  (quadratic Q_0) inner with local max|S| 0.967–0.972 near (1+ρ₁)/2; de Bruijn flow first collision t ∈ (−2.0, −1.75) (pair 48.005 / 49.774),
 *  z = 99.431 + 0.497i at t = −2 (Re s = 0.1257 / 0.3743, both causal), causality break t ≈ −2.35 (interpolated), max|S| = 1.261 at t = −4 and
 *  1.713 at t = −8 while unitarity and the functional relation stay at 1e-30; winding T = 50: W_∞ 28.1276 + arg ζ/π −0.0133 + ½ = 28.6143.
 * HEURISTIC: scattering-blindness reading (every φ-level axiom survives moving resonances off Re s = ¼, so no φ-only statement forces RH; the
 *  arithmetic lives in the geometric realisation, Maass–Selberg); "the bridge converts c_p into all-pass factors" (moved from proved: χ has no
 *  local factorisation); Phillips–Sarnak surface deformations (Fermi golden rule with L-value coefficients) as the untested lever.
 *
 * Referee kills: the original D3 relocation used a quartic Q_0, a double root, giving an ACAUSAL pole of S at (1+ρ₁)/2 (|S| 12.1 → 1211.6 →
 * 121160 at distance 1e-4 → 1e-8) that the grid skipped; "admissible bridge deformations never move ρ/2" is false (U = φ_δ/φ is unimodular,
 * U(s)U(1−s) = 1, U(1) > 0, φU inner, but U has a pole at (1+ρ₁)/2 and moves ρ₁/2), so the bridge-vs-Euler split is a bookkeeping convention,
 * not a theorem. No Λ bound moves. No refereed bound is changed; RH open; NO QED. Import-free. ROUTE_25_ASSERTIONS recompute live: the bridge
 * compensation |χ(2it)||c_∞| = 1 and √tanh(πt), the residue 3/π, the Gamma-shift ε = −1 unitarity defect |(3/2−s)/s|, the corrected relocation
 * Re s, the flow resonance geometry and the causality-break interpolation, and the winding split and shares.
 */

const { PI, abs, sqrt, log, tanh, cosh, sinh, E } = Math;

export const ROUTE_25 = Object.freeze({
  id: 'route-25-bridge-as-scattering-2026-10-12',
  route: 25,
  date: '2026-10-12',
  title: 'Route 25: the bridge as a scattering matrix — φ-level Lax–Phillips axioms are RH-blind; detection only at the ζ(1+it) ≠ 0 level',
  status: 'done',
  headline: 'The modular-surface scattering matrix factors exactly as φ(s) = c_∞(s) · χ(2s−1) · ζ(2−2s)/ζ(2s); its resonances ρ/2 sit in the '
    + 'ζ(2s) factor. Under the soft Lax–Phillips axioms (unitarity, functional relation, positive residue at s = 1, inner) resonances can be '
    + 'moved off Re s = ¼ (de Bruijn flow; rational relocation with a quadratic Q_0), so φ-level axioms are RH-blind; causality fails only once a '
    + 'zero reaches Re w ≥ 1, the ζ(1+it) ≠ 0 level.',

  factorisation: Object.freeze({ maxDev: 4.3e-30, refereeRiemannForm: 3.3e-30, betaZ: 1.3e-30, axisUnitarity: 3e-31, phiHalf: -1, residue: 0.954929658552,
    chiOverSqrtTpi: Object.freeze([[1, 0.99813], [5, 1.0], [10, 1.0]]) }),
  resonances: Object.freeze({ n: 20, maxDevVsRhoHalf: 2.9e-30, residueN1: Object.freeze([-0.3871, 0.3390]) }),
  gammaShift: Object.freeze({ epsTested: Object.freeze([-0.2, -0.05, 0.05, 0.2, 0.5]), resonanceShift: 7e-31,
    unitarityDefectEpsM02: Object.freeze([[0.5, 0.184], [2, 8.9e-3], [10, 3.5e-4], [50, 1.4e-5], [200, 8.75e-7]]),
    epsM1AxisModulus: Object.freeze([[0.5, 1.58], [2, 1.085], [10, 1.0037]]), epsM1RatioErr: 2e-26 }),
  admissible: Object.freeze({ timeDelayA: 0.7, blaschkeB: '0.30 + 5i', maxS: Object.freeze([0.9706, 0.9975]), baselineMaxS: 0.99815 }),
  relocation: Object.freeze({ deltas: Object.freeze([0.05, 0.15, 0.3]), reS: Object.freeze([0.275, 0.325, 0.4]),
    correctedLocalMaxS: Object.freeze([0.967, 0.968, 0.972]), correctedUnitarity: 2e-31, correctedFE: 4.3e-31,
    buggyPoleBlowup: Object.freeze({ delta: 0.05, dist: Object.freeze([1e-4, 1e-6, 1e-8]), absS: Object.freeze([12.1, 1211.6, 121160]) }),
    buggyLocalMax: Object.freeze([[0.15, 8.56], [0.3, 36.8]]) }),
  flow: Object.freeze({ window: 'γ ≤ 55 (z ≤ 110)', firstCollision: Object.freeze([-2.0, -1.75]), pair: Object.freeze([48.005, 49.774]),
    zAtM2: Object.freeze([99.43089514, 0.497154828]), reSAtM2: Object.freeze([0.125711, 0.374289]), imSAtM2: 24.858, residueAtM2: 0.95668,
    maxSAtM2: 0.99911, zAtM25: Object.freeze([99.85239808, 1.150612088]), mirrorReSAtM25: 0.537653, causalityBreak: -2.35,
    maxS: Object.freeze([[-4, 1.261], [-8, 1.713]]), furtherCollisions: Object.freeze([-4, -5, -14]),
    caveat: 'entries at t ≤ −20 are tracking/window artifacts (nine real zeros lost at t = −32, one complex zero reported); not cited' }),
  winding: Object.freeze({ T50: Object.freeze({ Winf: 28.127609, argOverPi: -0.01327, total: 28.614335 }),
    T5000: Object.freeze({ Winf: 10142.09, War: 0.2235 }) }),
  allPassProducts: Object.freeze({ at: '0.75 + 3.3i', partial: Object.freeze([0.84, 2.01, 0.224, 12.66, 0.0082]), target: 1.0158 }),

  refereeKilled: Object.freeze([
    'script bug (major): the D3 relocation used the quartic for Q_0 too; for ρ₁ on the line this is a double root, so S_δ had an ACAUSAL simple pole at (1+ρ₁)/2 = 0.75 + 7.0674i (|S| 12.1 / 1211.6 / 121160 at distance 1e-4 / 1e-6 / 1e-8, δ = 0.05); the reported "grid max |S| = 0.99815, still contractive" was a grid artifact (grid skipped Im s = 7.067). Corrected with quadratic Q_0: inner, local max |S| 0.967–0.972',
    'false as stated: "admissible bridge deformations are ONLY inner factors and never move ρ/2". U = φ_δ/φ is unimodular, U(s)U(1−s) = 1, U(1) > 0, φU inner, yet has a pole at (1+ρ₁)/2 and moves ρ₁/2; only multipliers holomorphic and zero-free near the ρ/2 leave them fixed (near-tautological)',
    'bookkeeping, not structure: "resonances do not depend on the bridge; moving them needs the Euler part" is an artifact of writing φ = c_∞·χ(2s−1)·Z; φ = c_∞·ζ(2s−1)/ζ(2s) has no bridge at all, and the de Bruijn flow can be booked as χ_t = χ·φ_t/φ. Headline phrase "do not move under ANY deformation of the bridge" dropped',
    'Gamma-shift mechanism: the pole ladder at s = k + ε and the s = ½ pole fail for ε a negative integer (ε = −1: c_∞χ_ε(2s−1) = β(s)(3/2−s)/s exactly); "not Lax–Phillips" still holds for every ε ≠ 0, via unitarity failure',
    'winding wording: "arithmetic share < 5e-4 for T ≥ 50" holds for arg ζ(1+2iT)/π only; with the +½ term the share is 1.7e-2 at T = 50 and 2.2e-5 at T = 5000; arg ζ(1+it) is not bounded (can grow like log log t); W_∞ ~ (T/π)log(T/(πe)), not (1/π)T log T',
    'proved → heuristic: "the bridge converts the non-unitary c_p into all-pass factors" (χ is global archimedean, no prime-by-prime conversion); the non-convergence half is correct',
    'de Bruijn trajectory entries at t ≤ −20 are tracking/window artifacts and are not cited',
  ]),
  nextStep: 'Record route 25 as closed under the flow-blindness class (scattering-blind). The only untested scattering-side lever is deforming the '
    + 'surface, not the bridge: Phillips–Sarnak Teichmüller deformations, where cusp forms dissolve into resonances with L-value (Fermi golden rule) '
    + 'coefficients; a first step is the Fermi rate for the first few Maass cusp forms and a check for any ρ/2 motion beyond first order. An optional '
    + 'Arb pass would make the identity and resonance numbers certified.',
  files: Object.freeze(['tmp/routes-b7-r25-scatter/r25_a_identities.py', 'tmp/routes-b7-r25-scatter/r25_d_bridge_deform.py', 'tmp/routes-b7-r25-scatter/r25_d3_only.py (BUGGY: quartic Q_0)',
    'tmp/routes-b7-r25-scatter/r25_e_debruijn_flow.py', 'tmp/routes-b7-r25-scatter/r25_f_local_factors.py', 'tmp/routes-b7-r25-scatter/r25_summary.json',
    'tmp/routes-b7-ref25/ref25_a.py', 'tmp/routes-b7-ref25/ref25_b.py', 'tmp/routes-b7-ref25/ref25_c.py', 'tmp/routes-b7-ref25/ref25_d.py']),
  verdict: 'Route 25 is mapped and closed under the flow-blindness class. φ = c_∞·χ(2s−1)·ζ(2−2s)/ζ(2s) exactly; the ρ/2 poles sit in the ζ(2s) factor. '
    + 'Unitarity, the functional relation, the positive residue at s = 1 and (inside the strip) the inner property all survive moving resonances off '
    + 'Re s = ¼ (de Bruijn flow; corrected rational relocation), so φ-level scattering axioms are RH-blind; causality detects only zeros with Re w ≥ 1 '
    + '(ζ(1+it) ≠ 0 level). The bridge-vs-Euler split of φ is a bookkeeping convention, not a theorem. Numerics are mpmath, not interval-certified. '
    + 'No Λ bound moves. No refereed bound is changed; RH open; NO QED.',
});

const R = ROUTE_25;
const chiAbsOnAxis = (t) => sqrt(t / PI) * sqrt(tanh(PI * t)); // |χ(2it)|
const cinfAbsOnAxis = (t) => sqrt((PI / t) * (cosh(PI * t) / sinh(PI * t))); // √π |Γ(it)| / |Γ(½+it)|
const resonanceReS = (y) => [(0.5 - y / 2) / 2, (0.5 + y / 2) / 2]; // z = x + iy → w = ½ − y/2 + ix/2, s = w/2 and mirror

export const ROUTE_25_ASSERTIONS = Object.freeze([
  {
    id: 'r25-bridge-compensation',
    holds: () => [0.5, 1, 5, 10, 50].every((t) => abs(chiAbsOnAxis(t) * cinfAbsOnAxis(t) - 1) < 1e-12)
      && R.factorisation.chiOverSqrtTpi.every(([t, v]) => abs(sqrt(tanh(PI * t)) - v) < 6e-5),
    why: '|χ(2it)| = √(t/π)·√tanh(πt) (gain) and |c_∞(½+it)| = √(π coth(πt)/t) (free-cusp loss) multiply to 1; √tanh(π) = 0.99813.',
  },
  {
    id: 'r25-residue-3-over-pi',
    holds: () => abs(3 / PI - R.factorisation.residue) < 2e-12 && R.factorisation.phiHalf === -1 && R.resonances.maxDevVsRhoHalf < 1e-29,
    why: 'Res_{s=1} φ = 3/π = 0.954929658551 (measured 0.954929658552); φ(½) = −1; resonances n ≤ 20 = ρ_n/2 to 2.9e-30.',
  },
  {
    id: 'r25-gamma-shift-eps-minus-1',
    holds: () => R.gammaShift.epsM1AxisModulus.every(([t, v]) => abs(sqrt(1 + t * t) / sqrt(0.25 + t * t) - v) < 6e-3)
      && R.gammaShift.unitarityDefectEpsM02.every(([t, d], i, a) => i === 0 || d < a[i - 1][1])
      && abs(R.gammaShift.unitarityDefectEpsM02[3][1] / R.gammaShift.unitarityDefectEpsM02[4][1] - 16) < 0.5,
    why: 'ε = −1: φ_ε = φ·(3/2−s)/s, so |φ_ε(½+it)| = |1+it|/|½+it| = 1.58 / 1.085 / 1.0037 (unitarity failure, no pole ladder); ε = −0.2 defect decays like t^-2 (ratio 16 from t = 50 to 200).',
  },
  {
    id: 'r25-corrected-relocation',
    holds: () => R.relocation.deltas.every((d, i) => abs((0.5 + d) / 2 - R.relocation.reS[i]) < 1e-12)
      && R.relocation.correctedLocalMaxS.every((m) => m < 1) && R.relocation.buggyLocalMax.every(([, m]) => m > 1)
      && R.relocation.buggyPoleBlowup.absS.every((v, i, a) => i === 0 || abs(v / a[i - 1] - 100) < 1),
    why: 'Quadratic Q_0: resonance at Re s = (½+δ)/2 = 0.275 / 0.325 / 0.400 with S inner (local max 0.967–0.972); the buggy quartic Q_0 gives |S| ∝ 1/dist at (1+ρ₁)/2 (×100 per 100× closer), max 8.56 / 36.8.',
  },
  {
    id: 'r25-flow-geometry-and-causality',
    holds: () => { const f = R.flow; const [lo, hi] = resonanceReS(f.zAtM2[1]); const mirror25 = resonanceReS(f.zAtM25[1])[1];
      const y2a = f.zAtM2[1] ** 2; const y2b = f.zAtM25[1] ** 2; const tBreak = -2 - 0.5 * (1 - y2a) / (y2b - y2a);
      return abs(lo - f.reSAtM2[0]) < 1e-6 && abs(hi - f.reSAtM2[1]) < 1e-6 && abs(f.zAtM2[0] / 4 - f.imSAtM2) < 1e-3 && hi < 0.5
        && abs(mirror25 - f.mirrorReSAtM25) < 1e-6 && mirror25 > 0.5 && abs(tBreak - f.causalityBreak) < 0.01 && f.maxSAtM2 < 1
        && f.maxS.every(([, m]) => m > 1); },
    why: 'z = x + iy ↦ s = (½ − y/2 + ix/2)/2 and mirror: z(−2) = 99.431 + 0.497i gives Re s = 0.1257 / 0.3743, Im s = 24.858 (causal); y(−2.5) = 1.1506 puts the mirror at 0.5377 > ½; linear y² interpolation gives the break t ≈ −2.35; max|S| > 1 at t = −4, −8.',
  },
  {
    id: 'r25-winding-split',
    holds: () => { const w = R.winding.T50; const wi = (T) => (T / PI) * log(T / (PI * E));
      return abs(w.Winf + w.argOverPi + 0.5 - w.total) < 1e-5 && abs(wi(50) - w.Winf) < 5e-3 && abs(wi(5000) - R.winding.T5000.Winf) < 0.2
        && abs(w.argOverPi) / w.total < 5e-4 && abs((w.argOverPi + 0.5) / w.total - 1.7e-2) < 1e-3
        && abs(R.winding.T5000.War / (R.winding.T5000.Winf + R.winding.T5000.War) - 2.2e-5) < 1e-6; },
    why: 'W = W_∞ + arg ζ(1+2iT)/π + ½: 28.1276 − 0.0133 + 0.5 = 28.6143 at T = 50; W_∞ ≈ (T/π)log(T/(πe)); arg part share 4.6e-4, full arithmetic share 1.7e-2 (T = 50) and 2.2e-5 (T = 5000).',
  },
  {
    id: 'r25-honest-scope',
    holds: () => R.status === 'done' && /refereed bound is changed/i.test(R.verdict) && /NO QED/.test(R.verdict) && /bookkeeping convention/.test(R.verdict)
      && !/ANY deformation of the bridge/.test(R.headline) && R.refereeKilled.length === 7 && /not interval-certified/.test(R.verdict),
    why: 'Bridge/Euler split recorded as a convention (referee); no "any bridge deformation" claim; no certification claimed; no Λ change; no QED.',
  },
]);

export default ROUTE_25;
