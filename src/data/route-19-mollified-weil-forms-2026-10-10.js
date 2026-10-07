/**
 * @fileoverview route-19-mollified-weil-forms-2026-10-10 — roadmap route 19 (batch 5): a Levinson-type Dirichlet-polynomial mollifier
 * and Weil test functions combined in one quadratic form. Answer: the mollified form is a restriction of the plain Weil form at
 * enlarged support, so it reduces to Route I. One run plus one adversarial internal referee pass (not refuted; severity minor); the
 * referee corrections are applied below.
 *
 * PROVED (elementary; re-derived by the referee): REDUCTION IDENTITY — with M(s) = Σ_{n≤N} m_n n^{−s} (real m_n), real g ∈ L²(−a, a),
 *  h = g * g̃, μ = Σ m_n n^{−1/2} δ_{log n}: Σ_ρ ĥ(γ_ρ) M(ρ)M(1−ρ) = W(μ*μ̃*h) = W(G*G̃), G = μ*g supported on [−a, a + log N]; the Weil form
 *  is translation-invariant, so G ∈ L²(−A, A), A = a + ½ log N (sharpenable to ½ log(N/n_min)). SUPPORT BOUND — g ↦ μ*g is injective, so
 *  inf_g W(μ*g)/‖μ*g‖² ≥ inf of the plain form on L²(−A, A): a*_mol ≥ a*_plain − ½ log N; in total support the mollified form never
 *  detects earlier. Finite-length GENERALISATION — a weight Φ(ρ)Φ*(1−ρ) with Φ the transform of a measure of support length L gives the
 *  plain form at A = a + L/2 on a subset. HOLOMORPHY CONSTRAINT — a weight with an explicit-formula representation equal to |M(½+it)|² on
 *  the line weights off-line zeros by M(ρ)M(1−ρ), not |M(ρ)|².
 * CERTIFIED (inherited, no new Arb work): with the dag3-dhblindln3 Arb certificate, for every real mollifier and real g with
 *  2a + log N ≤ ln 11: W_DH(μ*g) ≥ 6.93e-9‖μ*g‖² (Euler arm ≥ 9.87e-4); with 2a + log N ≤ ln 3: W_DH ≥ 0.2080723937, W_χ ≥ 0.2923087034.
 *  Conditional on the classical explicit formula and on that certificate (computer-assisted, internal referees only).
 * CONDITIONAL: NS-RIGID placement — each finite-(a, N) mollified positivity statement is a restriction of the plain statement on
 *  L²(−A, A), so it inherits softness wherever the plain statement is soft. The concrete softness evidence is the certified one: the
 *  RH-false DH twin satisfies mollified positivity whenever 2a + log N ≤ ln 11. Transfer to ζ needs the pole terms (pole-free G);
 *  Route I certificates for 2A ≤ 0.9 then transfer to 2a + log N ≤ 0.9 (analogous, not separately checked).
 * MEASURED (double precision; robust onset = first grid point with λ_min < −1e-9): plain DH onset a ∈ (1.78, 1.82] (λ(1.80) = −2.66e-7;
 *  certified a* ≤ 1.72 from earlier work). Levinson mollifier (DH Dirichlet inverse, P(x) = x) onsets a = 1.78/1.78/1.70/1.64/1.56/1.44
 *  for nmax = 2/3/4/8/12/19 (A = 2.13 … 2.91). Best free Dirichlet polynomials (alternating minimisation, 5 starts; upper estimates;
 *  generic polynomials, m_1 ≠ 1 in general) N = 2/4/8/16: a ≤ 1.54/1.38/1.02/0.78 (A ≤ 1.89/2.07/2.06/2.17). Every negative witness
 *  reproduced by an independent tail-free x-space evaluation (≤ 9.5e-4; referee's own Hurwitz-based F_DH reproduces them to ≤ 7e-4);
 *  Euler arm R_χ ≥ +1.06 (Levinson) / ≥ +2.71 (best) on the same G. Theorem consistency λ_mol(a, N) ≥ λ_plain(A) at 8/8 points (partial run).
 *  Levinson/plain λ_min ratio for a ≤ 1.3: 1.04–1.22 for nmax ≤ 4; ≈ 1.08–1.76 for nmax 8–19 (plain log-interpolated).
 *  DH zero-displacement homotopy (5 off-line quadruples below t = 260, distance from the line scaled by s; NOT the de Bruijn–Newman flow):
 *  plain onset 1.82 / 1.86 / 1.90 / 1.94 / 1.98 / none to 2.10 at s = 1 / 0.75 / 0.5 / 0.25 / 0.1 / 0; Levinson nmax = 19 onset moves from
 *  1.44 (s = 1) to (1.52, 1.60] (s = 0.75; −1.67e-9 at 1.60, −0.22 at 1.68) and shows no detection up to a = 1.76 (A = 3.23) at s = 0.5.
 * HEURISTIC: weights from infinite Dirichlet series (ζ′, 1/ζ) leave the finite-support setting — positivity on that subset is implied by
 *  RH but equivalence to RH is not shown (needs M(ρ)M(1−ρ) ≠ 0 at off-line zeros and L²/convergence control). Best mollifiers spend their
 *  extra support filling [−a, a + log N] with shifts of g; detection appears once A ≈ 2.0. Mollification adds no arithmetic input beyond
 *  the plain Weil form at the enlarged support: Route 19 merges into Route I and the flow-blindness wall.
 *
 * No Λ bound moves. PT Lambda <= 0.2 stands; RH open; NO QED. Import-free. ROUTE_19_ASSERTIONS recompute A = a + ½ log N for every onset,
 * the support-bound consistency (A above the certified plain a*), the savings and excess-support ranges, the inherited-certificate
 * thresholds, homotopy monotonicity and the referee's onset correction live.
 */

const { log, abs } = Math;

export const ROUTE_19 = Object.freeze({
  id: 'route-19-mollified-weil-forms-2026-10-10',
  route: 19,
  date: '2026-10-10',
  title: 'Route 19: mollified Weil forms reduce to the plain Weil form at half-support a + ½ log N (Route I)',
  status: 'done',
  headline: 'A length-N Dirichlet-polynomial mollifier at test-function half-support a is exactly the plain Weil form at half-support A = a + ½ log N, '
    + 'restricted to a subset (proved, elementary), so in total support it never detects off-line zeros earlier than the plain form. On Davenport–Heilbronn '
    + 'it detects at smaller a but always with more total support than the plain onset (≈ 1.80, double precision). Mollified positivity is certified '
    + 'Euler-blind for 2a + log N ≤ ln 11 (inherited). No new arithmetic input: Route 19 merges into Route I.',

  plainDH: Object.freeze({ robustOnset: Object.freeze([1.78, 1.82]), lambdaAt180: -2.66e-7, certifiedUpper: 1.72, reference: 1.80 }),
  levinson: Object.freeze([[2, 1.78, 2.13], [3, 1.78, 2.33], [4, 1.70, 2.39], [8, 1.64, 2.68], [12, 1.56, 2.80], [19, 1.44, 2.91]]),
  best: Object.freeze([[2, 1.46, 1.54, 1.81, 1.89], [4, 1.30, 1.38, 1.99, 2.07], [8, 0.94, 1.02, 1.98, 2.06], [16, 0.70, 0.78, 2.09, 2.17]]),
  witnesses: Object.freeze([
    Object.freeze({ kind: 'best', N: 4, a: 1.38, route: -0.85497, referee: -0.85494, chi: 2.7107 }),
    Object.freeze({ kind: 'best', N: 16, a: 0.78, route: -0.65283, referee: -0.65281, chi: 2.869 }),
    Object.freeze({ kind: 'best', N: 2, a: 1.54, route: -0.10578, referee: -0.10571, chi: 2.837 }),
    Object.freeze({ kind: 'best', N: 8, a: 1.02, route: -0.358353, referee: -0.358353, chi: 2.836 }),
    Object.freeze({ kind: 'levinson', N: 19, a: 1.44, route: -0.03385, referee: -0.03395, chi: 3.980 }),
    Object.freeze({ kind: 'levinson', N: 4, a: 1.70, route: -1.2372e-7, referee: -1.23733e-7, chi: 1.0594 }),
  ]),
  inherited: Object.freeze({ ln11: Object.freeze({ dh: 6.93e-9, euler: 9.87e-4 }), ln3: Object.freeze({ dh: 0.2080723937, chi: 0.2923087034 }) }),
  homotopyPlain: Object.freeze([[1, 1.82], [0.75, 1.86], [0.5, 1.90], [0.25, 1.94], [0.1, 1.98]]),
  homotopyLev19: Object.freeze({ s1: 1.44, s075: Object.freeze([1.52, 1.60]), s075values: Object.freeze([[1.60, -1.67e-9], [1.68, -0.216], [1.76, -0.515]]), s05noneUpTo: 1.76 }),
  dhOffLineZeros: Object.freeze([[0.80852, 85.69935], [0.65083, 114.16334], [0.57436, 166.47931], [0.72426, 176.70246], [0.86953, 240.40467]]),
  levinsonCoeffs19: Object.freeze({ m2: -0.219, m4: 0.585, m6: -0.472, m9: 0.295 }),
  ratioLevPlain: Object.freeze({ nmaxLe4: Object.freeze([1.04, 1.22]), nmax8to19: Object.freeze([1.08, 1.76]) }),
  consistency: Object.freeze({ checked: 8, passed: 8, planned: 22 }),

  refereeKilled: Object.freeze([
    '"cutting the off-line displacement by 25% removes the mollified witnesses" — true only at the witness\'s fixed a; at s = 0.75 the Levinson nmax = 19 onset moves 1.44 → (1.52, 1.60] (−0.22 at 1.68), it does not vanish; at s = 0.5 no detection up to a = 1.76 (A = 3.23) while the plain form detects by 1.90',
    '"flow-soft" mixed two things: the DH test is an ad hoc zero-displacement homotopy, not the de Bruijn–Newman flow; the NS-RIGID placement is a logical inheritance (conditional on the plain statement being soft); the real softness evidence is the certified DH positivity for 2a + log N ≤ ln 11',
    'GENERALISATION second half (ζ′, 1/ζ weights "reduce to the full Weil criterion, i.e. RH") moved to heuristic: μ*g need not be in L², and equivalence needs M(ρ)M(1−ρ) ≠ 0 at off-line zeros',
    '"Levinson λ_min is 1.05–1.2× the plain value for a ≤ 1.3" holds for nmax ≤ 4 only (1.04–1.22); nmax 8–19 give ≈ 1.08–1.76',
    '"its m_n are small, so μ*g ≈ g" false for nmax = 19 (m_4 = 0.585, m_6 = −0.472); best "mollifiers" are generic Dirichlet polynomials (m_1 ≠ 1)',
    'Levinson nmax = 4 at a = 1.76, s = 0.75 is at the double-precision floor (|λ| ≤ 2e-13), not "positive"; plain λ(1.0) = 3.6e-5 is a Ritz upper bound varying 3.39–3.64e-5 with basis size',
  ]),
  nextStep: 'Optional: finish the theorem-consistency table (tmp/routes-b5-r19-plainA.py, 8 of ≈ 22 points done, ≈ 2 min per point, 1 process). No further mollifier '
    + 'work recommended: a finite-support multiplier cannot beat the plain Weil form at the enlarged support; infinite-support weights leave the finite-support '
    + 'setting (equivalence with RH not shown). Effort on this axis belongs to Route I (plain Weil positivity at larger support).',
  files: Object.freeze(['tmp/routes-b5-r19-lib.py', 'tmp/routes-b5-r19-scan.py', 'tmp/routes-b5-r19-scan-j1.json', 'tmp/routes-b5-r19-scan-j2.json',
    'tmp/routes-b5-r19-optmoll.py', 'tmp/routes-b5-r19-optmoll-o5.json', 'tmp/routes-b5-r19-xverify.py', 'tmp/routes-b5-r19-xverify-opt.json',
    'tmp/routes-b5-r19-xverify-lev.json', 'tmp/routes-b5-r19-homotopy.py', 'tmp/routes-b5-r19-homotopy.log', 'tmp/routes-b5-r19-dhzeros.json',
    'tmp/routes-b5-r19-plainA.py', 'tmp/routes-b5-r19-plainA.log', 'tmp/routes-b5-r19-results.json', 'tmp/routes-b5-ref19-zeros.py',
    'tmp/routes-b5-ref19-zeros-count.log', 'tmp/routes-b5-ref19-indep.py', 'tmp/routes-b5-ref19-indep-opt.json', 'tmp/routes-b5-ref19-indep-lev.json']),
  verdict: 'Route 19 is not an independent route. A mollified Weil form with an N-term Dirichlet polynomial is exactly the plain Weil form at half-support '
    + 'a + ½ log N on a subset of test functions (proved), so it never detects off-line zeros at smaller total support than the plain form. On the DH twin '
    + 'Levinson mollifiers save ≤ 0.36 in a and use 0.33–1.11 more total support than the plain onset; best Dirichlet polynomials save 0.3–1.1 in a and use '
    + '0–0.37 more. All negative witnesses were reproduced independently and the Euler arm is positive on them. Mollified positivity inherits the certified '
    + 'Euler-blindness of the plain form for 2a + log N ≤ ln 11. In the DH zero-displacement homotopy (not the de Bruijn–Newman flow) shrinking the '
    + 'displacement by 25% moves the Levinson nmax = 19 onset from 1.44 to (1.52, 1.60]. No new arithmetic input: merges into Route I. '
    + 'PT Lambda <= 0.2 stands; RH open; NO QED.',
});

const R = ROUTE_19;

export const ROUTE_19_ASSERTIONS = Object.freeze([
  {
    id: 'r19-support-A',
    holds: () => R.levinson.every(([n, a, A]) => abs(a + 0.5 * log(n) - A) < 6e-3)
      && R.best.every(([n, alo, ahi, Alo, Ahi]) => abs(alo + 0.5 * log(n) - Alo) < 6e-3 && abs(ahi + 0.5 * log(n) - Ahi) < 6e-3),
    why: 'A = a + ½ log N for every recorded onset: Levinson nmax 2 … 19 give A = 2.13, 2.33, 2.39, 2.68, 2.80, 2.91; best N = 2, 4, 8, 16 give A ∈ (1.81, 1.89], (1.99, 2.07], (1.98, 2.06], (2.09, 2.17].',
  },
  {
    id: 'r19-support-bound-consistency',
    holds: () => R.levinson.every(([, , A]) => A > R.plainDH.certifiedUpper) && R.best.every((b) => b[3] > R.plainDH.certifiedUpper)
      && R.consistency.passed === R.consistency.checked && R.plainDH.robustOnset[0] < R.plainDH.reference && R.plainDH.reference < R.plainDH.robustOnset[1],
    why: 'Every mollified onset sits at total half-support A ≥ 1.81 > 1.72 ≥ a*_plain (certified), as the support bound requires; λ_mol ≥ λ_plain(A) at 8/8 checked points.',
  },
  {
    id: 'r19-savings-and-excess',
    holds: () => { const ref = R.plainDH.reference; const levSave = R.levinson.map(([, a]) => ref - a); const levExcess = R.levinson.map(([, , A]) => A - ref);
      const bestSave = R.best.map((b) => ref - b[2]); const bestExcessHi = R.best.map((b) => b[4] - ref);
      return abs(Math.max(...levSave) - 0.36) < 1e-9 && levSave.every((s, i) => s <= 0.5 * log(R.levinson[i][0]))
        && abs(Math.min(...levExcess) - 0.33) < 1e-9 && abs(Math.max(...levExcess) - 1.11) < 1e-9
        && Math.min(...bestSave) > 0.25 && Math.max(...bestSave) <= 1.1 && Math.max(...bestExcessHi) <= 0.37 + 1e-9 && Math.min(...R.best.map((b) => b[3])) - ref >= 0; },
    why: 'Levinson saves ≤ 0.36 in a (≤ ½ log N, up to 1.47) and spends 0.33–1.11 extra total support; best polynomials save 0.26–1.02 in a (upper estimates) and spend 0–0.37 extra.',
  },
  {
    id: 'r19-witnesses-independent',
    holds: () => R.witnesses.every((w) => w.route < 0 && w.referee < 0 && w.chi > 1 && abs(w.route / w.referee - 1) < 3e-3)
      && R.witnesses.filter((w) => w.kind === 'best').every((w) => w.chi >= 2.71),
    why: 'Six DH witnesses reproduced by the referee\'s Hurwitz-based F_DH and own coefficients to ≤ 0.3% relative; the Euler arm is ≥ +1.06 on every witness G (≥ +2.71 for the best polynomials).',
  },
  {
    id: 'r19-inherited-certificate',
    holds: () => { const ln11 = log(11), ln3 = log(3); const ok = (a, N, cap) => 2 * a + log(N) <= cap;
      return ok(0.2, 2, ln3) && !ok(0.25, 2, ln3) && !ok(1.44, 19, ln11) && R.levinson.every(([n, a]) => !ok(a, n, ln11)) && R.best.every(([n, alo]) => !ok(alo, n, ln11))
        && R.inherited.ln3.dh > R.inherited.ln11.dh && R.inherited.ln11.euler > R.inherited.ln11.dh && R.inherited.ln11.dh > 0; },
    why: 'Certified Euler-blind range 2a + log N ≤ ln 11 = 2.398 (DH ≥ 6.93e-9‖μ*g‖²); every measured DH detection lies outside it (2A ≥ 3.6), as it must.',
  },
  {
    id: 'r19-homotopy-referee-correction',
    holds: () => { const h = R.homotopyPlain; const l = R.homotopyLev19;
      return h.every(([, a], i) => i === 0 || a > h[i - 1][1]) && l.s075[0] > l.s1 && l.s075values.every(([, v]) => v < 0)
        && l.s075values[0][0] === l.s075[1] && l.s05noneUpTo + 0.5 * log(19) > 3.2 && h[2][1] > l.s05noneUpTo
        && R.dhOffLineZeros.every(([b]) => b > 0.5 && b < 1) && R.dhOffLineZeros.length === 5; },
    why: 'Plain onset rises 1.82 → 1.98 as displacement shrinks; Levinson-19 onset moves 1.44 → (1.52, 1.60] at s = 0.75 (still negative at 1.60, 1.68, 1.76) instead of vanishing; at s = 0.5 none up to 1.76 (A = 3.23). Five off-line DH zeros below 260 with 1/2 < β < 1.',
  },
  {
    id: 'r19-ratios-and-coefficients',
    holds: () => R.ratioLevPlain.nmaxLe4[1] < R.ratioLevPlain.nmax8to19[1] && Object.values(R.levinsonCoeffs19).some((m) => abs(m) > 0.5),
    why: 'Levinson/plain λ_min ratio 1.04–1.22 (nmax ≤ 4) but up to 1.76 (nmax 8–19); nmax = 19 coefficients reach |m_4| = 0.585, so "m_n small" is false.',
  },
  {
    id: 'r19-honest-scope',
    holds: () => R.status === 'done' && /proved/.test(R.verdict) && /not the de Bruijn–Newman flow/.test(R.verdict)
      && /PT Lambda <= 0\.2 stands/.test(R.verdict) && /NO QED/.test(R.verdict) && /merges into Route I/.test(R.verdict),
    why: 'Reduction proved (elementary); softness inherited/certified; homotopy is not the dB–N flow; no Λ change; no QED.',
  },
]);

export default ROUTE_19;
