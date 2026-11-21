/**
 * @fileoverview r3-outer-2026-10-03 — the weak outer lemma for the r2 structured floors, in the exact form route P consumes (WOL-C):
 *   K^sup(E) := sup over θ_S ∈ T^S, t ∈ [t_lo, t_hi], a ∈ [a_lo, a_hi] of Φ_E(θ_S; t, a)  ≤  K0*(E) + 0.0223/(1 + 1e-12)
 * for each r2 floor E on the route-P band path. WOL-C absorbs both the 0.02 outer allowance and the 0.0023 time-box allowance (t ranges
 * over the whole cell), so it needs no separate time-box lemma. Written statement and reduction: formalization/paper/outer-lemma-weak.md.
 * One adversarial internal referee pass (tmp/r3-ref-outer-*): not refuted, minor.
 *
 * Referee corrections applied:
 *  - Unsplit start boxes in the five S = {2,3,5} certificates: 95.6–99.4% (1957–2036 of 2048), not 92–99%.
 *  - r3 excess over K0* at θ_S = 0 (whole cell and a-range): +0.000015 to +0.00195 over six entries, not "+0.0003 to +0.002".
 *  - 0.147074904937842 (S = {2,3,5} floors admitted only in cells ≥ 400) is reached on a path using 191 r2 floors (146 shared with the
 *    185 late entries of the full S = {2,3,5} path, plus 45 others); WOL-C is needed for those 191.
 *  - Certified-only exact consumer, using the smaller of the original and referee margins per entry:
 *    73770784989943/(5·10^14) = 0.147541569979886 (same 7 floors), reproduced in this synthesis by tmp/r3-outer-mixed.py with
 *    tmp/r3-ref-outer-out/certfile_ref.json (log tmp/r3-synth-out/cons_certref_mixed.txt, 21 s).
 *  - Section 2.5 (large-label lemma): it proves growth of |w_j|, hence of beta^± ∝ 1/|c_1^±| and the tails, not of |X~_j|. The
 *    conclusion (Φ is not a sum of terms each maximised at θ = 0) holds via the beta/extra terms.
 *  - The 0.0023 time-box allowance is measured (4 cells), not certified; WOL-C absorbs it.
 *
 * PROVED (written, one internal referee pass): Lemma 1 (floor validity under WOL-C, corollary for any certified margin m), symmetry
 *  θ ↦ −θ, factorisation c_1 = Π F_q(z_q)(1 + D), time-tilt identity, time monotonicity of a_n, P_n, large-label lemma.
 * CERTIFIED (in-session Taylor-model engine r3core4.c + arb, outward rounding; referee re-runs at prec 192 on other grids; no line-by-line
 *  audit of r3core4.c): WOL-C for 9 single entries (4 route-P, 5 S = {2,3,5}); exact consumer values below.
 * CONDITIONAL: route-P Λ ≤ 0.1448843462793 on WOL-C for 626 uncertified band-path entries + shared inputs.
 * MEASURED: central-box excesses (P13 cell 141: 0.033; P47 cell 235: 1.29), cost per entry. HEURISTIC: 480 CPU-h campaign estimate.
 * Verdict: see `verdict`. Import-free. ASSERTIONS recompute the rationals, the Lemma-1 shift arithmetic of both admission files, the
 *  entry bookkeeping, the margin ladder monotonicity, the unsplit-box shares and the ordering against the b145 PT value.
 */

const rat = (s) => { const [a, b] = String(s).split('/').map(Number); return a / (b ?? 1); };

export const R3_OUTER = Object.freeze({
  id: 'r3-outer-2026-10-03',
  date: '2026-10-03',
  title: 'Weak outer lemma (consumed form WOL-C): NOT PROVED; 9 single-entry certificates; certified-only route-P value 0.1475416',
  status: 'NOT PROVED (WOL-C certified for 9 single entries; 626 of 630 route-P band-path entries uncertified). One internal referee pass (minor). NO QED.',
  doc: 'formalization/paper/outer-lemma-weak.md',

  wolc: Object.freeze({ combinedMargin: 0.0223, outer: 0.02, timeBox: 0.0023, inflate: 1e-12, statement: 'K^sup(E) ≤ K0*(E) + 0.0223/(1+1e-12), sup over θ_S, whole time cell, whole a-range' }),
  routePEntries: Object.freeze({ total: 630, cat: 305, sharp: 325, byPrefix: { P7: 15, P11: 70, P13: 74, P17: 22, P19: 34, P23: 39, P29: 8, P31: 5, P47: 363 }, certified: 4 }),
  s235Entries: Object.freeze({ total: 628, certified: 5, campaignCpuHours: 480 }),
  // per-entry margins m with K^sup ≤ K0* + m: [original, referee re-run]; admission shift xs = 0.0023 − m(1 + 1e-12)
  certificates: Object.freeze([
    ['0|1|r_49_100', 'P7', 0.015340, 0.018424], ['41|1|sharp', 'P7', 0.018361, 0.019492], ['40|1|r_49_100', 'P11', 0.013742, 0.017611],
    ['82|1|sharp', 'P11', 0.018984, 0.019314], ['99|1|sharp', 'S235', 0.022135, 0.017864], ['286|0.94|r_19_40', 'S235', 0.022191, 0.019862],
    ['437|0.88|sharp', 'S235', 0.021959, 0.019996], ['517|0.88|r_23_40', 'S235', 0.022288, 0.017918], ['555|0.88|r_3_5', 'S235', 0.022208, 0.017842],
  ]),
  // exact admission shifts actually consumed (tmp/r3-outer-out/certfile_now.json, tmp/r3-ref-outer-out/certfile_ref.json)
  shifts: Object.freeze({
    now: { '286|0.94|r_19_40': '-198903160353/10000000000000', '99|1|sharp': '-99171437231/5000000000000', '0|1|r_49_100': '-130398140749/10000000000000' },
    ref: { '286|0.94|r_19_40': '-7024867263/400000000000', '99|1|sharp': '-155638670591/10000000000000', '0|1|r_49_100': '-130398140749/10000000000000' },
  }),
  unsplitStartBoxes: Object.freeze([2036, 1974, 1968, 1970, 1957]),
  thetaZeroExcess: Object.freeze([0.000015, 0.000161, 0.000262, 0.000301, 0.000502, 0.001948]),

  exact: Object.freeze({
    routePConditional: '1448843462793/10000000000000',
    certifiedOnlyRef: '73770784989943/500000000000000',
    certifiedOnlyOrig: '147541824070553/1000000000000000',
    noR2Floors: '29511133454807/200000000000000',
    s235Route: '36434271002361/250000000000000',
    b145PT: '18409208597849/125000000000000',
  }),
  floorsOnCertifiedPath: 7,
  // uniform combined margin → exact consumer value (all prefixes)
  ladderAll: Object.freeze([[0.0023, 0.144544975039788], [0.0223, 0.1448843462793], [0.0623, 0.145566399715088], [0.1023, 0.146203867808489], [0.1523, 0.146941197032611], [0.2023, 0.147264127210863]]),
  ladderS235: Object.freeze([[0.0023, 0.145416234753928], [0.0123, 0.14557773094205], [0.0223, 0.145737084009444], [0.0423, 0.146055102819095], [0.0623, 0.146369867334082]]),
  partial: Object.freeze({ s235CellsGe400: { value: 0.147074904937842, floorsNeeded: 191, sharedWithLate185: 146, others: 45 }, allCellsLe200: 0.147056041434642 }),
  measured: Object.freeze({ centralBoxExcess: { 'P7 c0': 0.00079, 'P11 c82': 0.0016, 'P13 c141': 0.033441, 'P17 c166': 0.097, 'P19 c199': 0.195, 'P23 c237': 0.39, 'P47 c235': 1.286834 }, eta5Cost555: 0.101, crossCheckMinGap: 9.7e-4, crossCheckPoints: 18909 }),

  verdict:
    'NOT PROVED. WOL-C (sup over θ_S, the whole time cell and the a-range ≤ K0* + 0.0223) is certified for 9 single entries only (4 of the 630 '
    + 'route-P band-path entries). The box method does not reach the 0.0223 margin for prefixes P ≥ 13 at cells ≳ 140 (central-box excess 0.033–1.29). '
    + 'Route-P Λ ≤ 0.1448843462793 stays conditional. With only certified floors the exact consumer gives 73770784989943/(5·10^14) = 0.147541569979886, '
    + 'above the b145 PT value 0.147273668782792. Certifying the 628 S = {2,3,5} floors (≈480 CPU-h, heuristic estimate) would give 0.145737084009444, '
    + 'not below 0.145. No refereed bound is changed. RH open. NO QED.',
  nextStep:
    'For Λ < 0.145 at PT height: a Φ-specific structural argument (or label factorisation a_j Π F_q(ρz_q)/F_q(z_q)(1 + E_j) with exact defect '
    + 'expansion) for P ≥ 13 late cells; the box search does not reach them. Independent line-by-line audit of r3core4.c before any r2 floor is consumed.',
});

const O = R3_OUTER;
const E = O.exact;

export const R3_OUTER_ASSERTIONS = Object.freeze([
  {
    id: 'r3-outer-exact-values',
    holds: () => Math.abs(rat(E.routePConditional) - 0.1448843462793) < 1e-15 && Math.abs(rat(E.certifiedOnlyRef) - 0.147541569979886) < 1e-15
      && Math.abs(rat(E.certifiedOnlyOrig) - 0.147541824070553) < 1e-15 && Math.abs(rat(E.noR2Floors) - 0.147555667274035) < 1e-15
      && Math.abs(rat(E.s235Route) - 0.145737084009444) < 1e-15 && Math.abs(rat(E.b145PT) - 0.147273668782792) < 1e-15,
    why: 'Exact consumer rationals match their decimals.',
  },
  {
    id: 'r3-outer-ordering',
    holds: () => rat(E.routePConditional) < 0.145 && rat(E.s235Route) > 0.145 && rat(E.certifiedOnlyRef) > rat(E.b145PT)
      && rat(E.certifiedOnlyRef) < rat(E.certifiedOnlyOrig) && rat(E.certifiedOnlyOrig) < rat(E.noR2Floors)
      && rat(E.noR2Floors) - rat(E.certifiedOnlyRef) < 2e-5,
    why: 'Only the uncertified uniform WOL-C gives < 0.145; certified floors move the route-P consumer by 1.4e-5, still above b145 PT; the S235 route stays above 0.145.',
  },
  {
    id: 'r3-outer-lemma1-shifts',
    holds: () => {
      const m = Object.fromEntries(O.certificates.map(([k, , a, b]) => [k, [a, b]]));
      const ok = (sh, idx) => Object.entries(sh).every(([k, s]) => {
        const xs = rat(s), mm = m[k][idx], bound = 0.0023 - mm * (1 + 1e-12);
        return Math.abs(xs - bound) < 1e-6 && xs < 0; // shift = Lemma-1 shift of the certified margin (margins quoted to 6 decimals)
      });
      const best = (k) => Math.max(m[k][0], m[k][1]);
      // the referee file uses the better (smaller) margin where the re-run improved it
      return ok({ '0|1|r_49_100': O.shifts.now['0|1|r_49_100'], '286|0.94|r_19_40': O.shifts.now['286|0.94|r_19_40'], '99|1|sharp': O.shifts.now['99|1|sharp'] }, 0)
        && ok({ '286|0.94|r_19_40': O.shifts.ref['286|0.94|r_19_40'], '99|1|sharp': O.shifts.ref['99|1|sharp'] }, 1)
        && O.certificates.every(([, , a, b]) => a < O.wolc.combinedMargin && b < O.wolc.combinedMargin) && best('0|1|r_49_100') > 0;
    },
    why: 'Lemma 1: a certified margin m < 0.0223 licenses floor_str − 0.0023 − (m(1+1e-12) − 0.0023); admission shifts recomputed from the margins.',
  },
  {
    id: 'r3-outer-bookkeeping',
    holds: () => {
      const p = Object.values(O.routePEntries.byPrefix).reduce((s, x) => s + x, 0);
      return p === 630 && O.routePEntries.cat + O.routePEntries.sharp === 630 && O.certificates.filter(([, P]) => P !== 'S235').length === O.routePEntries.certified
        && O.certificates.length === 9 && O.floorsOnCertifiedPath === 7 && O.partial.s235CellsGe400.sharedWithLate185 + O.partial.s235CellsGe400.others === 191
        && Math.abs(O.wolc.outer + O.wolc.timeBox - O.wolc.combinedMargin) < 1e-15;
    },
    why: '630 band-path entries (305 cat + 325 sharp) by prefix; 4 route-P + 5 S235 certificates; 191 = 146 + 45 floors behind the partial value.',
  },
  {
    id: 'r3-outer-ladders-monotone',
    holds: () => [O.ladderAll, O.ladderS235].every((L) => L.every(([m, v], i) => i === 0 || (m > L[i - 1][0] && v > L[i - 1][1])))
      && O.ladderAll[1][1] === 0.1448843462793 && O.ladderS235[2][1] === 0.145737084009444 && O.ladderAll.every(([, v]) => v < 0.1473)
      && O.ladderAll.filter(([, v]) => v < 0.145).length === 2,
    why: 'Exact consumer value increases with the uniform margin; only margins ≤ 0.0223 give < 0.145 on all prefixes.',
  },
  {
    id: 'r3-outer-referee-corrected-shares',
    holds: () => {
      const sh = O.unsplitStartBoxes.map((x) => x / 2048);
      return Math.abs(Math.min(...sh) - 0.956) < 1e-3 && Math.abs(Math.max(...sh) - 0.994) < 1e-3
        && Math.min(...O.thetaZeroExcess) === 0.000015 && Math.max(...O.thetaZeroExcess) === 0.001948
        && O.measured.centralBoxExcess['P13 c141'] > O.wolc.combinedMargin && O.measured.centralBoxExcess['P11 c82'] < O.wolc.combinedMargin;
    },
    why: 'Referee-corrected unsplit share 95.6–99.4%; θ=0 excess range over six entries; the central box already exceeds 0.0223 from P13 on.',
  },
  {
    id: 'r3-outer-honest-scope',
    holds: () => /NOT PROVED/.test(O.verdict) && /refereed bound is changed/i.test(O.verdict) && /NO QED/.test(O.verdict) && /NOT PROVED/.test(O.status),
    why: 'The outer lemma is not proved; no bound below 0.2 is proved.',
  },
]);

export default R3_OUTER;
