/**
 * @fileoverview route-3-three-point-probes-2026-10-07 — roadmap route 3 (batch 2): multi-point correlated probes (joint floor of
 * a probe measure) on top of the route-P admission. One run plus one adversarial internal referee pass (not refuted, minor);
 * the referee corrections are applied below.
 *
 * Outcome: the multi-point joint floor is valid and certified on the exact consumer, but it is a weak lever: route 3 alone moves
 * the PT-height value by −7.86e-7 (0.145694083872924 → 0.145693297586243). A side result from the same machinery (six new
 * exactly certified two-point kernels with λ < 2) gives 0.145465618111039 (−2.28e-4). Λ < 0.145 is NOT certified.
 *
 * PROVED (written, unrefereed, project-internal):
 *  - Lemma MP3 (multi-point phase lemma): Σ ω_s c_s [1 − ε Re(z u_s)] ≥ c0 (Σ ω_s − |Σ ω_s u_s|) for ω_s ≥ 0, |z| = |u_s| = 1,
 *    ε = ±1, c_s ≥ c0 ≥ 0; sharp in z. One pair, no centre weight = Raymond's Lemma 3.
 *  - Lemma R2: the second difference of the gamma phase satisfies |ψ| ≤ ε_R (same bound as Lemma R, < 1e-10 at X_PT).
 *  - Theorem MP (joint floor of a probe measure) under (OP) = G0-d, Lemma CG, Lemma R, Lemma R2. Referee correction: the
 *    reflected-label phase error is [w0 + 2(1 − w0 − w_k0)] ε_R ≤ 2(1 − w_k0) ε_R, not (1 − w_k0) ε_R. The code deducts
 *    (1 − max w_k)·EPS_REFL with EPS_REFL = 1e-9 > 2 ε_R (≤ 8.6e-12), so no table or Λ value changes.
 *  - Linearity: kernel inequality, self cap and the Lemma H2 far-field inequality are linear in the probe measure, so mixtures
 *    of certified components need no new kernel certificate (λ = min of components, v ≤ min ρ², cap = weighted sum).
 * CERTIFIED (arb two lanes 192/256 bit, exact consumer, E1–E8 re-implemented in routes-b2-r3-consume.py; conditional as below):
 *  - V1 route 3 alone: U_robust = 145693297586243/10^15 (raw 72846648793121/(5·10^14)); 1,566 of 74,595 substeps pick a
 *    four-point measure (r = 51/100 pair, weight 1/4, 1/6 or 1/3, plus Raymond's sharp pair). Only E6-altlog fails, by 1e-15.
 *  - V2 side result: six new two-point kernels (exact Bernstein certificates, H2 ratio ≥ 3318): U = 29093162795117/(2·10^14).
 *  - V3 route 3 + V2: U = 145465618111039/10^15; route 3's own share on top of V2 is −1.96e-7.
 *  - Referee re-ran all four consumer values exactly, re-certified the 6 kernels (identical poly_sha256) and found code ≤ an
 *    independent multi-point cone + Euler joint floor in every pair class (max gap 1.8e-12).
 * CONDITIONAL: shared route-P ledger (G0-c, G0-d (OP), AF gaps, Lemma B as written, producer layer, RH-win, RH-head) plus the
 *  unrefereed Theorem MP, Lemma MP3, Lemma R2. The E-checks on new option types are the author's re-implementation, not the
 *  unchanged r4-wolpd-bb replay; the Track A gains part for genuinely multi-point modes is not independently checked.
 * MEASURED: the literal three-point design (centre + one pair) never wins (cell 312: 15.12 vs 15.35); joint gain over the
 *  weighted average for chosen modes median 4.5e-4–5.9e-4, max 1.8e-3. Referee correction: the "obstruction" (centre self cap
 *  2/(h(1−v)) vs pair cap ≤ 2/(h(1+r²)), ≈ 4:1 cap-versus-gain) is MEASURED, not proved; the pair-cap bound holds only for 3r² ≥ 1
 *  (r = 1/2: self cap ≈ 1.618 > 2/(1+r²) = 1.6).
 * HEURISTIC: grafting the multi-point combination onto the r2 structured floors is worth ≈ 1e-6 in Λ.
 *
 * PT Λ ≤ 0.2 is the accepted benchmark; RH open; NO QED. Import-free. ROUTE_3_ASSERTIONS recompute exact decimals, differences
 * and orderings, a seeded random test of Lemma MP3 and its sharpness, the symmetric-measure modulus identity and the ε_R margin.
 */

const big = (s) => { if (Array.isArray(s)) return s; const [a, b] = String(s).split('/'); return [BigInt(a), BigInt(b ?? '1')]; };
const cmp = (x, y) => { const [a, b] = big(x), [c, d] = big(y); const l = a * d, r = c * b; return l < r ? -1 : l > r ? 1 : 0; };
const lt = (x, y) => cmp(x, y) < 0;
const sub = (x, y) => { const [a, b] = big(x), [c, d] = big(y); return [a * d - c * b, b * d]; };
const eq = (x, y) => cmp(x, y) === 0;
const exact15 = (s) => { const [a, b] = big(s); const n = a * 10n ** 15n; return n % b === 0n ? n / b : null; };

const V = (exact, dec, grade, label) => Object.freeze({ exact, dec, grade, label });

export const ROUTE_3 = Object.freeze({
  id: 'route-3-three-point-probes-2026-10-07',
  route: 3,
  date: '2026-10-07',
  title: 'Route 3: multi-point joint floor certified, worth −7.86e-7; side result (new λ < 2 kernels) worth −2.28e-4; Λ < 0.145 not certified',
  status: 'done',
  headline: 'The multi-point joint floor (Theorem MP) is proved as written, implemented and certified; on the route-P admission it lowers '
    + 'the PT-height value only from 0.145694083872924 to 0.145693297586243. Six new certified two-point kernels with λ < 2, found with '
    + 'the same machinery, give 0.145465618111039. Λ < 0.145 is not certified.',

  values: Object.freeze({
    baseline: V('36423520968231/250000000000000', '0.145694083872924', 'CERTIFIED', 'route-P baseline (reproduced twice)'),
    v1raw: V('72846648793121/500000000000000', '0.145693297586242', 'CERTIFIED', 'V1 route 3 alone, raw consumer value'),
    v1robust: V('145693297586243/1000000000000000', '0.145693297586243', 'CERTIFIED', 'V1 route 3 alone, robust (r7 E6-altlog convention)'),
    v2: V('29093162795117/200000000000000', '0.145465813975585', 'CERTIFIED', 'V2 side result: six new two-point kernels'),
    v3: V('145465618111039/1000000000000000', '0.145465618111039', 'CERTIFIED', 'V3 route 3 + new kernels (best)'),
  }),
  deltas: Object.freeze({
    route3Alone: '-786286681/1000000000000000',
    v2: '-228269897339/1000000000000000',
    v3: '-228465761885/1000000000000000',
    route3OnV2: '-195864546/1000000000000000',
  }),
  multipointSubsteps: Object.freeze({ total: 1566, steps: 74595, byWeight: Object.freeze({ '1/4': 1045, '1/6': 265, '1/3': 256 }) }),
  newKernels: Object.freeze([ // (r, λ, ρ), exact Bernstein certificates, all PASS; H2 exact check ratio ≥ 3318
    Object.freeze({ r: '3/5', lambda: '79/40', rho: '2/5' }), Object.freeze({ r: '3/5', lambda: '397/200', rho: '3/10' }),
    Object.freeze({ r: '13/20', lambda: '389/200', rho: '2/5' }), Object.freeze({ r: '13/20', lambda: '393/200', rho: '3/10' }),
    Object.freeze({ r: '7/10', lambda: '193/100', rho: '3/10' }), Object.freeze({ r: '7/10', lambda: '387/200', rho: '1/4' }),
  ]),
  controls: Object.freeze({ pass: Object.freeze(['(3/5, 199/100, 1/5) catalogue', 'centre kernel (λ 2, ρ 2/5)', '(13/20, 39/20, 2/5)']),
    fail: Object.freeze(['Raymond invalid (1/2, ρ 1/2, λ 2)', '(13/20, λ 2)', '(3/5, λ 2, ρ 2/5) negative vertex', '(7/10, 97/50, 3/10) depth']) }),
  constants: Object.freeze({ epsRbound: 4.3e-12, EPS_REFL: 1e-9 }), // ε_R ≤ 4.3e-12 at X_PT (2 ε_R ≤ 8.6e-12)
  measured: Object.freeze({ cell312: Object.freeze({ centrePlusPair: 15.12, chosenTwoPoint: 15.35 }),
    jointGainChosen: Object.freeze({ medianLo: 4.5e-4, medianHi: 5.9e-4, max: 1.77e-3, min: -1.28e-4 }),
    referee: Object.freeze({ thetaBoxes: 1500, violations: 0, attenuationLabels: 12564, maxCodeMinusExact: -4.7e-29, mpbaseMaxGap: 1.8e-12 }) }),

  refereeKilled: Object.freeze([
    'Theorem MP reflected-label phase error understated as (1 − w_k0) ε_R; correct bound [w0 + 2(1 − w0 − w_k0)] ε_R ≤ 2(1 − w_k0) ε_R (code unaffected: EPS_REFL = 1e-9 > 2 ε_R)',
    '"Obstruction, analytic" listed as proved: the pair-cap bound sup s_r ≤ 2/(1+r²) holds only for 3r² ≥ 1, and the ≈ 4:1 cap-versus-gain imbalance is measured at 8 cells — moved to measured/heuristic',
    'E-checks on the new option types are the author\'s own re-implementation, not an independent band check',
  ]),
  nextStep: '(1) Internal referee on Theorem MP (corrected), Lemma MP3, Lemma R2 and the linearity argument, with the consume.py check logic. '
    + '(2) Follow the side result: certify a denser (r, λ, ρ) kernel grid (r 0.58–0.75, ρ 1/4–2/5; ≈ 1 s each, tmp/routes-b2-r3-kcert.py), '
    + 'Track A floors on all fallback cells (tmp/routes-b2-r3-tables.py, 2 workers), then decide on r2 structured floors at the new shifts. '
    + '(3) No further work on pure multi-point designs (route 3 capped near 1e-6 in Λ, measured).',
  files: Object.freeze(['tmp/routes-b2-r3-lib.py', 'tmp/routes-b2-r3-consume.py', 'tmp/routes-b2-r3-kcert.py', 'tmp/routes-b2-r3-out/results.json',
    'tmp/routes-b2-r3-out/kernels_new2pt.json', 'tmp/routes-b2-r3-out/tab_A.json', 'tmp/routes-b2-ref3-out/']),
  verdict: 'Route 3 works but is a weak lever: certified −7.86e-7 on the route-P admission (0.145693297586243). The literal three-point design '
    + 'with a centre probe is dominated (measured). The useful find is outside route 3: new certified λ < 2 two-point kernels give '
    + '0.145465618111039 (−2.28e-4). All values are certified relative to the shared ledger and the unrefereed Theorem MP / MP3 / R2; '
    + 'single implementation, internal referee only. Λ < 0.145 is not certified. PT Lambda <= 0.2 stands; RH open; NO QED.',
});

const R = ROUTE_3;
const v = (k) => R.values[k].exact;

// Seeded PRNG (mulberry32) for the Lemma MP3 test.
const rng = (seed) => () => { seed |= 0; seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };

export const ROUTE_3_ASSERTIONS = Object.freeze([
  {
    id: 'r3-values-exact',
    holds: () => Object.values(R.values).every((x) => { const n = exact15(x.exact); return n !== null && Math.abs(Number(n) / 1e15 - Number(x.dec)) < 1e-16; }),
    why: 'Every stated decimal is the exact value of its rational.',
  },
  {
    id: 'r3-deltas-exact',
    holds: () => eq(sub(v('v1robust'), v('baseline')), R.deltas.route3Alone) && eq(sub(v('v2'), v('baseline')), R.deltas.v2)
      && eq(sub(v('v3'), v('baseline')), R.deltas.v3) && eq(sub(v('v3'), v('v2')), R.deltas.route3OnV2)
      && eq(sub(v('v1robust'), v('v1raw')), '1/1000000000000000'),
    why: 'Route 3 alone −786286681e-15; V2 −2.28269897339e-4; V3 −2.28465761885e-4; route 3 on V2 −1.95864546e-7; robust = raw + 1e-15.',
  },
  {
    id: 'r3-ordering',
    holds: () => lt('145/1000', v('v3')) && lt(v('v3'), v('v2')) && lt(v('v2'), v('v1robust')) && lt(v('v1robust'), v('baseline')),
    why: '0.145 < V3 < V2 < V1 < route-P baseline: every variant is still above 0.145.',
  },
  {
    id: 'r3-counts',
    holds: () => Object.values(R.multipointSubsteps.byWeight).reduce((a, b) => a + b, 0) === R.multipointSubsteps.total
      && R.newKernels.length === 6 && R.newKernels.every((k) => lt(k.lambda, '2/1') && !lt(k.rho, '1/4') && !lt('2/5', k.rho)),
    why: '1045 + 265 + 256 = 1566 multi-point substeps; six new kernels, all λ < 2, ρ in [1/4, 2/5].',
  },
  {
    id: 'r3-mp3-random',
    holds: () => {
      const r = rng(20261007);
      for (let trial = 0; trial < 4000; trial++) {
        const m = 1 + Math.floor(r() * 6), c0 = r() * 2, eps = r() < 0.5 ? -1 : 1;
        const zt = 2 * Math.PI * r(); let lhs = 0, sw = 0, sx = 0, sy = 0, lhsC0 = 0;
        const us = [];
        for (let s = 0; s < m; s++) { const w = r(), c = c0 + r(), ph = 2 * Math.PI * r(); us.push([w, ph]);
          lhs += w * c * (1 - eps * Math.cos(zt + ph)); sw += w; sx += w * Math.cos(ph); sy += w * Math.sin(ph); }
        const rhs = c0 * (sw - Math.hypot(sx, sy));
        if (lhs < rhs - 1e-12) return false;
        // sharpness in z: c_s = c0 and z = ε·conj(Σωu)/|Σωu| gives equality
        const zs = (eps > 0 ? 0 : Math.PI) - Math.atan2(sy, sx);
        for (const [w, ph] of us) lhsC0 += w * c0 * (1 - eps * Math.cos(zs + ph));
        if (Math.abs(lhsC0 - rhs) > 1e-9) return false;
      }
      return true;
    },
    why: 'Lemma MP3 holds on 4000 seeded random instances and is attained at z = ε·conj(Σωu)/|Σωu| when all c_s = c0 (sharp in z).',
  },
  {
    id: 'r3-symmetric-modulus',
    holds: () => {
      const r = rng(7);
      for (let i = 0; i < 500; i++) {
        const K = 1 + Math.floor(r() * 3); const ws = Array.from({ length: K }, () => r()); const w0 = r();
        const tot = w0 + ws.reduce((a, b) => a + b, 0); const phs = ws.map(() => 2 * Math.PI * r());
        let sx = w0 / tot, sy = 0, cosSum = w0 / tot;
        ws.forEach((w, k) => { sx += (w / tot) * Math.cos(phs[k]); cosSum += (w / tot) * Math.cos(phs[k]); }); // ±φ halves: imaginary parts cancel
        if (Math.abs(Math.hypot(sx, sy) - Math.abs(cosSum)) > 1e-14) return false;
      }
      return true;
    },
    why: 'For μ = w0 δ0 + Σ w_k (δ_{a_k} + δ_{−a_k})/2 the modulus term |Σ ω_s u_s| is |w0 + Σ w_k cos φ_k|.',
  },
  {
    id: 'r3-reflected-margin',
    holds: () => 2 * R.constants.epsRbound < R.constants.EPS_REFL && [0, 0.25, 0.5].every((w0) => [1 / 6, 1 / 4, 1 / 3, 1 / 2].every((wk0) => w0 + wk0 > 1
      || (w0 + 2 * (1 - w0 - wk0)) * R.constants.epsRbound <= (1 - wk0) * R.constants.EPS_REFL)),
    why: 'Referee-corrected reflected-label error [w0 + 2(1 − w0 − w_k0)] ε_R stays below the coded deduction (1 − w_k0)·1e-9 since 2 ε_R ≤ 8.6e-12.',
  },
  {
    id: 'r3-honest-scope',
    holds: () => R.status === 'done' && /PT Lambda <= 0\.2 stands/.test(R.verdict) && /NO QED/.test(R.verdict) && /not certified/.test(R.verdict)
      && /measured/.test(R.refereeKilled[1]) && R.measured.referee.violations === 0 && R.measured.referee.maxCodeMinusExact < 0,
    why: 'Λ < 0.145 not certified; obstruction downgraded to measured; referee checks show code attenuations conservative; no QED.',
  },
]);

export default ROUTE_3;
