/**
 * @fileoverview route-15-epstein-euler-blindness-2026-10-09 — roadmap route 15 (batch 4): the Euler-blindness radius a* (support at
 * which the Weil form first goes negative) for Epstein zeta functions of binary quadratic forms with class number h = 2, 3, 4 —
 * same gamma factor and conductor as ζ_K, no Euler product for non-trivial classes.
 * One run plus one adversarial internal referee pass (not refuted; severity MAJOR); the referee corrections are applied below.
 *
 * Referee correction (major, applied throughout): every computation used EVEN real test functions g. Weil's criterion also needs odd g,
 * where the pole term becomes −2(∫ g sinh(x/2))² ≤ 0, so the odd sector can fail first. All measured lower ends and the closed-form
 * proved radii are EVEN-SECTOR statements. The certified upper bounds a* ≤ A remain valid for the full Weil form (a negative even witness
 * is a negative witness of the full form). Counterexample: D = −23 principal (1,1,6) — even bracket (1.679, 1.689], but the odd sector
 * goes negative at ≈ 1.662 (measured, referee, cross-checked against the zero sum), so the full-form a* ≈ 1.662.
 *
 * PROVED: explicit formula for Λ_Q(s) = (√|D|/2π)^s Γ(s) Z_Q(s) on even real g (re-derived by the referee): pole term 2(∫ g cosh(x/2))²,
 *  log term 2 log(√|D|/(2π·amin)), archimedean 2ψ(1/2) − 2 log tanh(a/2) + ∫(G(0) − G)/sinh(x/2), arithmetic −2Σ c_q q^{−1/2} G(log q) with
 *  exact rational d_q. Closed-form Arb lower bound: W_Q ≥ 0 for EVEN g at a ≤ a_proved = 0.13–0.57 (e.g. 0.3294 for x² + 5y², 0.1647 for
 *  2x² + 2xy + 3y²); not a full Weil-form radius.
 * CERTIFIED (Arb; explicit rational Gegenbauer witnesses, exact rational autocorrelation and d_q, 4000–6800 bits; radii ≤ 4.7e-22, deep forms
 *  ≤ 1e-30): upper bounds a* ≤ A for all 27 forms (table below). The Λ_Q evaluator matches the Hecke decomposition
 *  Z_(1,0,5) ± Z_(2,2,3) = ζ L(χ_−20) ± L(χ_−4) L(χ_5) to ≈ 1e-13 at height 85 and the functional equation to ≈ 1e-21.
 * CONDITIONAL / not certified: lower ends (finite-basis λ_min > 0 is only an upper bound on the infimum); exact-subspace positives for the
 *  deep forms (30-dim float-derived subspace) are evidence only.
 * MEASURED: even-sector crossings (double-precision Rayleigh–Ritz, N ≤ 240; table). Odd sector checked and not earlier than even (referee,
 *  N = 40/80): all 12 principal forms except D = −23, and (2,2,3), (2,0,3), (3,3,4), (2,0,5), (2,2,7), (2,0,7), (3,1,5). Odd sector OPEN for
 *  (2,1,2), (4,3,4), (2,1,4), (2,1,5), (2,1,7), (2,1,3), (3,1,3), (3,2,5) (odd λ_min 1e-9 … 1e-13 at their onsets). In every attributed case
 *  the lowest off-line zero carries the negativity (e.g. (1,0,5) at a = 1.52: −6.02e-3 vs on-line +5.92e-3). Lowest off-line zeros
 *  (count-verified): (2,2,3) 2.07941 + 7.62887i, (1,0,5) 0.93297 + 15.66825i, (3,3,4) 2.25126 + 11.11652i, … ; DH 0.8085 + 85.699i.
 *  ζ_K Euler arms stay ≥ −1e-9 on a ∈ [0.1, 3.5]. At the Route I support a = (ln 3)/2 every form is positive in both sectors except
 *  (2,2,3) (even −0.0779; odd min over all 27 forms 0.034).
 * HEURISTIC: principal forms a* ≈ log(|D|/4) − δ, δ ∈ [0.02, 0.37], mean ≈ 0.13 (even sector; D = −23 full form δ ≈ 0.087): below the second
 *  minimum ≈ |D|/4 the principal form represents only squares. Non-principal forms with β = r(m1)/r(amin) = 2 fail early; the two-term
 *  model 1 + β(m1/amin)^{−s} gives Re ρ = log β/log(m1/amin) > 1 only for (2,2,3) (1.71) and (3,3,4) (2.41), not for (2,2,7) (0.553).
 *  Route I analogy: positivity at 2a ≤ ln 3 is blind for every principal-form twin but not for (2,2,3) (degree-2 twins of ζ_K, not ζ).
 *
 * No Λ bound moves. No refereed bound is changed; RH open; NO QED. Import-free. ROUTE_15_ASSERTIONS enumerate the reduced forms of the 12
 * discriminants (27 Epstein classes), recompute representation counts β and the two-term model, the δ law, measured ≤ certified, and the
 * D = −23 odd-before-even correction live.
 */

const LOG = Math.log;
const gcd = (a, b) => (b === 0 ? Math.abs(a) : gcd(b, a % b));
const reducedForms = (D) => { const out = []; for (let a = 1; 3 * a * a <= -D; a += 1) for (let b = -a + 1; b <= a; b += 1) {
  if ((b * b - D) % (4 * a) !== 0) continue; const c = (b * b - D) / (4 * a); if (c < a || (a === c && b < 0)) continue;
  if (gcd(gcd(a, Math.abs(b)), c) !== 1) continue; out.push([a, b, c]); } return out; };
const reps = ([a, b, c], n) => { let r = 0; for (let x = -30; x <= 30; x += 1) for (let y = -30; y <= 30; y += 1) if (a * x * x + b * x * y + c * y * y === n) r += 1; return r; };
const values = (f, upto) => Array.from({ length: upto }, (_, i) => i + 1).filter((n) => reps(f, n) > 0);

// [form, D, measured even-sector crossing (or bracket), certified upper bound A, kind]
const F = (form, D, meas, cert, kind, extra = {}) => Object.freeze({ form: Object.freeze(form), D, meas, cert, kind, ...extra });

export const ROUTE_15 = Object.freeze({
  id: 'route-15-epstein-euler-blindness-2026-10-09',
  route: 15,
  date: '2026-10-09',
  title: 'Route 15: Euler-blindness radius of 27 Epstein twins — certified upper bounds, even-sector lower ends (measured)',
  status: 'done',
  headline: 'For 27 Epstein zeta functions (12 discriminants, h = 2–4) the Weil form is Arb-certified negative at an explicit support (upper bound on a*). '
    + 'Lower ends are measured and only for even test functions (referee: the odd sector can fail first; it does for D = −23, a* ≈ 1.662 instead of 1.679–1.689). '
    + 'Principal forms: a* ≈ log(|D|/4) − 0.13 (1.28–2.60), with Davenport–Heilbronn\'s 1.72 inside the band; forms with r(m1)/r(amin) = 2 fail early, down to '
    + 'a* ≤ 0.417 for 2x² + 2xy + 3y².',

  forms: Object.freeze([
    F([1, 1, 4], -15, 1.283, 1.286, 'principal'), F([1, 0, 5], -20, 1.4935, 1.497, 'principal'),
    F([1, 1, 6], -23, [1.679, 1.689], 1.697, 'principal', { fullFormMeasured: 1.662, oddFirst: true }),
    F([1, 0, 6], -24, 1.729, 1.733, 'principal'), F([1, 1, 8], -31, 2.029, 2.042, 'principal'), F([1, 1, 9], -35, 2.024, 2.038, 'principal'),
    F([1, 1, 10], -39, 2.141, 2.144, 'principal'), F([1, 0, 10], -40, 2.234, 2.237, 'principal'), F([1, 0, 13], -52, 2.390, 2.394, 'principal'),
    F([1, 1, 14], -55, 2.374, 2.378, 'principal'), F([1, 0, 14], -56, 2.274, 2.278, 'principal'), F([1, 1, 15], -59, 2.604, 2.607, 'principal'),
    F([2, 2, 3], -20, 0.4139, 0.417, 'non-principal'), F([2, 1, 3], -23, 1.4075, 1.411, 'non-principal', { oddOpen: true }),
    F([2, 0, 3], -24, 0.781, 0.785, 'non-principal'), F([3, 1, 3], -35, 1.182, 1.185, 'non-principal', { oddOpen: true }),
    F([3, 3, 4], -39, 0.567, 0.570, 'non-principal'), F([2, 0, 5], -40, 1.136, 1.14, 'non-principal'), F([2, 2, 7], -52, 1.248, 1.251, 'non-principal'),
    F([2, 0, 7], -56, 1.681, 1.684, 'non-principal'), F([3, 2, 5], -56, 1.342, 1.345, 'non-principal', { oddOpen: true }), F([3, 1, 5], -59, 1.230, 1.233, 'non-principal'),
    F([2, 1, 2], -15, [1.37, 1.38], 1.38, 'deep', { witness: -7.25e-14, oddOpen: true }), F([2, 1, 4], -31, [1.65, 1.70], 1.70, 'deep', { witness: -4.88e-13, oddOpen: true }),
    F([2, 1, 5], -39, [1.85, 1.90], 1.90, 'deep', { witness: -5.11e-14, oddOpen: true }), F([4, 3, 4], -55, [1.50, 1.55], 1.55, 'deep', { witness: -3.79e-17, oddOpen: true }),
    F([2, 1, 7], -55, [2.40, 2.50], 2.50, 'deep', { witness: -5.55e-20, oddOpen: true }),
  ]),
  classNumbers: Object.freeze({ '-15': 2, '-20': 2, '-23': 3, '-24': 2, '-31': 3, '-35': 2, '-39': 4, '-40': 2, '-52': 2, '-55': 4, '-56': 4, '-59': 3 }),
  dh: Object.freeze({ certifiedUpper: 1.72, measuredPositiveTo: 1.70, zero: '0.8085 + 85.699i' }),
  odd23: Object.freeze({ N60: Object.freeze([[1.660, 3.6e-4], [1.665, -5.7e-4], [1.670, -1.16e-3], [1.679, -1.66e-3]]), evenAt1679: 5.8e-4, zeroSum1679: -1.620e-3, matrix1679N40: -1.559e-3 }),
  routeISupport: Object.freeze({ even223: -0.0779, oddMinAll: 0.034, even334: 0.0117, even434: 0.0153 }),
  provedEvenRadius: Object.freeze({ '1,0,5': 0.3294, '2,2,3': 0.1647, range: Object.freeze([0.1299, 0.566]) }),

  refereeKilled: Object.freeze([
    'MAJOR: a* reported as "the support radius at which the Weil form goes negative" — every computation used even g only; the odd sector (pole term −2(∫ g sinh(x/2))²) can fail first; all lower ends and the proved radii are even-sector statements',
    'D = −23 principal (1,1,6) bracket (1.679, 1.689] — wrong for the full form: odd sector negative from ≈ 1.662 (−5.7e-4 at 1.665, matrix vs zero sum −1.559e-3 vs −1.620e-3 at 1.679)',
    'deep and near-floor forms (2,1,2), (4,3,4), (2,1,4), (2,1,5), (2,1,7), (2,1,3), (3,1,3), (3,2,5) — odd sector unresolved (λ_min 1e-9 … 1e-13 at the onsets)',
    '"proved" closed-form radii 0.13–0.57 — even sector only (the odd pole term cannot be dropped)',
    '"β = 2 gives zeros with Re ρ > 1" as the reason for early failure — true for (2,2,3) and (3,3,4) only; (2,2,7) has two-term Re ≈ 0.553',
  ]),
  nextStep: '(1) Rerun onset and exact-subspace machinery in the odd sector for the 8 open forms; restate every a* as an even-sector radius until then. '
    + '(2) Route-I-style dual certificates for lower bounds on (1,0,5) and (2,2,3) (both sectors), making their brackets two-sided rigorous. '
    + '(3) Arb argument-principle certification of the off-line zeros 2.0794 + 7.6289i and 0.93297 + 15.66825i. (4) Test the δ law on h ≥ 5 (D = −47, −79, −103).',
  files: Object.freeze(['tmp/routes-b4-15-lib.py', 'tmp/routes-b4-15-weil.py', 'tmp/routes-b4-15-onset.py', 'tmp/routes-b4-15-certify.py', 'tmp/routes-b4-15-exactsub.py',
    'tmp/routes-b4-15-summary.json', 'tmp/routes-b4-15-lowerbound.json', 'tmp/routes-b4-15-routeI.json', 'tmp/routes-b4-ref-15-indep.py', 'tmp/routes-b4-ref-15-oddscan.py',
    'tmp/routes-b4-ref-15-odd116.py', 'tmp/routes-b4-ref-15-oddscan-N40.jsonl', 'tmp/routes-b4-ref-15-oddscan-N80.jsonl']),
  verdict: 'The Euler-detection radius is mapped for 27 Epstein twins of ζ_K: every form has an Arb-certified upper bound on a* (valid for the full Weil form); lower ends '
    + 'are measured and even-sector only (the odd sector fails first for D = −23, full-form a* ≈ 1.662; 8 forms have the odd sector open). Principal forms fail near '
    + 'log(|D|/4) − 0.13, DH\'s 1.72 sits in that band, and β = 2 forms fail early ((2,2,3) at ≤ 0.417, below the Route I support (ln 3)/2). Analogy only for Route I; '
    + 'no Λ bound moves. No refereed bound is changed; RH open; NO QED.',
});

const R = ROUTE_15;
const lowEnd = (f) => (Array.isArray(f.meas) ? f.meas[0] : f.meas);
const highEnd = (f) => (Array.isArray(f.meas) ? f.meas[1] : f.meas);

export const ROUTE_15_ASSERTIONS = Object.freeze([
  {
    id: 'r15-discriminants-and-classes',
    holds: () => R.forms.every((f) => { const [a, b, c] = f.form; return b * b - 4 * a * c === f.D && Math.abs(b) <= a && a <= c; })
      && Object.entries(R.classNumbers).every(([D, h]) => reducedForms(Number(D)).length === h)
      && Object.keys(R.classNumbers).reduce((s, D) => s + new Set(reducedForms(Number(D)).map(([a, b, c]) => `${a},${Math.abs(b)},${c}`)).size, 0) === 27
      && R.forms.length === 27 && new Set(R.forms.map((f) => `${f.form.join(',')}`)).size === 27
      && R.forms.every((f) => reducedForms(f.D).some(([a, b, c]) => a === f.form[0] && Math.abs(b) === f.form[1] && c === f.form[2])),
    why: 'Each form is reduced with b² − 4ac = D; class numbers 2, 2, 3, 2, 3, 2, 4, 2, 2, 4, 4, 3; modulo b ↔ −b (same Epstein zeta) the 12 discriminants give exactly the 27 forms listed.',
  },
  {
    id: 'r15-beta-two-term-model',
    holds: () => { const info = (form) => { const v = values(form, 40); const amin = v[0], m1 = v[1]; return { amin, m1, beta: reps(form, m1) / reps(form, amin) }; };
      const re = (x) => LOG(x.beta) / LOG(x.m1 / x.amin); const i223 = info([2, 2, 3]), i334 = info([3, 3, 4]), i227 = info([2, 2, 7]), i213 = info([2, 1, 3]);
      return i223.beta === 2 && i334.beta === 2 && i227.beta === 2 && i213.beta === 1 && Math.abs(re(i223) - 1.7095) < 1e-3 && Math.abs(re(i334) - 2.4094) < 1e-3
        && re(i227) < 1 && Math.abs(re(i227) - 0.5533) < 1e-3 && Math.abs(Math.PI / LOG(i223.m1 / i223.amin) - 7.748) < 1e-3; },
    why: 'r(m1)/r(amin) = 2 for (2,2,3), (3,3,4), (2,2,7) and 1 for (2,1,3); two-term model Re ρ = log β/log(m1/amin) = 1.71, 2.41 but 0.553 for (2,2,7); height π/log 1.5 = 7.75 for (2,2,3).',
  },
  {
    id: 'r15-delta-law',
    holds: () => { const P = R.forms.filter((f) => f.kind === 'principal'); const mid = (f) => (Array.isArray(f.meas) ? (f.meas[0] + f.meas[1]) / 2 : f.meas);
      const d = P.map((f) => LOG(-f.D / 4) - mid(f)); const dFull = P.map((f) => LOG(-f.D / 4) - (f.fullFormMeasured ?? mid(f)));
      const mean = d.reduce((a, b) => a + b) / d.length, meanFull = dFull.reduce((a, b) => a + b) / dFull.length;
      return P.length === 12 && Math.min(...d) > 0.015 && Math.max(...d) < 0.37 && mean > 0.11 && mean < 0.14 && meanFull > 0.12 && meanFull < 0.14
        && Math.abs(LOG(23 / 4) - 1.662 - 0.087) < 2e-3; },
    why: 'δ = log(|D|/4) − a* over the 12 principal forms lies in [0.019, 0.365] with mean ≈ 0.127 (even sector) / 0.130 (D = −23 at its full-form 1.662, δ = 0.087).',
  },
  {
    id: 'r15-measured-below-certified',
    holds: () => R.forms.every((f) => highEnd(f) <= f.cert && f.cert - lowEnd(f) < 0.11) && R.forms.filter((f) => f.kind === 'deep').every((f) => f.witness < 0 && f.witness > -1e-12),
    why: 'Every measured crossing (or bracket top) is ≤ the certified upper bound A; deep forms have rigorous negative witnesses of size 1e-13 … 1e-20.',
  },
  {
    id: 'r15-odd-sector-correction',
    holds: () => { const f = R.forms.find((x) => x.D === -23 && x.kind === 'principal'); const o = R.odd23.N60;
      const cross = o.findIndex(([, v]) => v < 0); return f.oddFirst && f.fullFormMeasured < lowEnd(f) && o[cross - 1][1] > 0 && o[cross][0] <= 1.665
        && R.odd23.evenAt1679 > 0 && Math.abs(R.odd23.matrix1679N40 / R.odd23.zeroSum1679 - 1) < 0.05
        && R.forms.filter((x) => x.oddOpen).length === 8; },
    why: 'D = −23 principal: odd λ_min changes sign between 1.660 and 1.665 while even is still +5.8e-4 at 1.679; matrix and zero sum agree to 4%; 8 forms have the odd sector open.',
  },
  {
    id: 'r15-route-i-support-and-dh',
    holds: () => { const a = LOG(3) / 2; const f223 = R.forms.find((x) => x.form.join(',') === '2,2,3');
      return f223.cert < a && f223.meas < f223.cert && R.routeISupport.even223 < 0 && R.routeISupport.oddMinAll > 0
        && R.forms.filter((x) => x.kind === 'principal').every((x) => lowEnd(x) > a)
        && R.dh.certifiedUpper > R.forms[0].cert && R.dh.certifiedUpper < R.forms[4].meas; },
    why: '(2,2,3) fails below the Route I support a = (ln 3)/2 = 0.549 (a* ≤ 0.417); every principal form is positive there; DH 1.72 lies between D = −15 (1.286) and D = −31 (2.029).',
  },
  {
    id: 'r15-honest-scope',
    holds: () => R.status === 'done' && /even-sector only/.test(R.verdict) && /no Λ bound moves/.test(R.verdict) && /refereed bound is changed/i.test(R.verdict)
      && /NO QED/.test(R.verdict) && /^MAJOR/.test(R.refereeKilled[0]),
    why: 'Lower ends graded even-sector measured; upper bounds certified; analogy only; no Λ change; no QED.',
  },
]);

export default ROUTE_15;
