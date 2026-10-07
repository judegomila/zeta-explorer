/**
 * @fileoverview route-46-exact-kronecker-floors-2026-10-06 — roadmap route 46 (batch 1): Kronecker floors as exact
 * Bohr–Jessen torus extrema of the leading-order source at the 12 binding cells, and what exactness would be worth on the
 * exact route-P consumer. One run plus one adversarial internal referee pass (not refuted, minor); corrections applied.
 *
 * Outcome: lower bounds on the Kronecker supremum are certified at all 12 cells (t = 0.075: ≥ 0.533514111339326); slice
 * maxima are float-validated for k = 4 (12 cells) and k = 5 (2 cells); k ≥ 6 is out of reach for this box engine. On the exact
 * consumer any floor improvement, Kronecker-exact or not, is capped at band = U2 = 0.144254643222956 (a hard-coded constant).
 * The remaining lever is WOL-C on the 369 P47 late-cell floors, not Kronecker exactness.
 *
 * PROVED: nothing new.
 * CERTIFIED (python-flint arb, 128 bit, outward-rounded): lower bounds on sup_torus J of the leading-order model (Raymond's
 *  definitions rebuilt; labels ≤ 690988, all prime phases and the reflected phase free), ROUNDED DOWN per referee (7 of the 12
 *  originally quoted values were rounded to nearest and exceeded the arb lower end by ≤ 4.8e-16;
 *  the referee's '≤ 4.1e-16' is low: cell 450 4.8e-16, cell 250 4.6e-16, cell 550 only by the 6.9e-33 ball radius). The 7 ratio-mode JSON
 *  enclosures used a binary64 displacement h·r instead of exact r·h and are not reproducible from the current script; the
 *  referee re-runs give enclosures disjoint by ≤ 2.6e-17 — numerically negligible, to be regenerated.
 * CONDITIONAL: every Λ value on the shared ledger (G0, Lemma B with BB1/BB2, FLINT window, MTY, H2, U2, multi-height consumer).
 *  P47 diagnostic at cells 0/50: U_lo exceeds the r2 K0* there, so if J_model ≤ Φ_E the exact outer lemma fails for a P47 prefix
 *  (by ≥ 0.0187 / 0.0089); those entries are excluded by the adaptive prefix rule and lie on no path.
 * MEASURED: slice branch-and-bound (float64 box bounds with 1e-9 a-priori slack, LAPACK eigenvalues) — demoted from "certified"
 *  by the referee; exact consumer scenarios with hypothetical margins; referee multistart on k = 5, 8, 12 slices (every ascent
 *  converges to J(θ*) within 7e-14); box-bound stress test (≈ 978k points, 0 violations, max(J − bound) = −1.0e-9 = slack).
 * HEURISTIC: A_kron scenario (12-cell interpolation of K0* − U gaps, mode and κ ignored); 3–7× box growth per added prime.
 *
 * PT Λ ≤ 0.2 is the accepted benchmark; 0.1758354 and 0.1787854 remain computer-assisted candidates; RH open; NO QED.
 * Import-free. ROUTE_46_ASSERTIONS recompute exact decimals, scenario gains, the U2 cap, rounding direction and bracket widths live.
 */

const big = (s) => { if (Array.isArray(s)) return s; const [a, b] = String(s).split('/'); return [BigInt(a), BigInt(b ?? '1')]; };
const cmp = (x, y) => { const [a, b] = big(x), [c, d] = big(y); const l = a * d, r = c * b; return l < r ? -1 : l > r ? 1 : 0; };
const lt = (x, y) => cmp(x, y) < 0;
const sub = (x, y) => { const [a, b] = big(x), [c, d] = big(y); return [a * d - c * b, b * d]; };
const num = (x) => { const [a, b] = big(x); return Number(a) / Number(b); };
const exact15 = (s) => { const [a, b] = big(s); const n = a * 10n ** 15n; return n % b === 0n ? n / b : null; };
const dec = (s) => { const [i, f = ''] = s.split('.'); return `${BigInt(i + f)}/${10n ** BigInt(f.length)}`; };

const C = (cell, mode, quoted, corrected, stored = null) => Object.freeze({ cell, mode, quoted, corrected, stored });
const S = (tag, what, exact, decimal, grade) => Object.freeze({ tag, what, exact, dec: decimal, grade });

export const ROUTE_46 = Object.freeze({
  id: 'route-46-exact-kronecker-floors-2026-10-06',
  route: 46,
  date: '2026-10-06',
  title: 'Route 46: Kronecker suprema certified from below at 12 cells; exactness is worth at most the U2 cap, the lever is WOL-C',
  status: 'partial',
  headline: 'The Kronecker supremum of the leading-order source is certified from below at all 12 binding cells (t = 0.075: '
    + '≥ 0.533514111339326) and the ascent point is the slice maximum for k = 4 (12 cells) and k = 5 (2 cells), float-validated, not certified; '
    + 'k ≥ 6 is out of reach for this engine. On the exact consumer every floor improvement is capped at band = U2 = 0.144254643222956, '
    + 'and the 0.21 slack at t = 0.075 sits in the uncertified P47 (k = 15) late-cell floors, so route 46 reduces to certifying WOL-C.',

  // Lower bounds on sup_torus J (arb 128 bit). `quoted` = run value; `corrected` = referee value rounded DOWN; `stored` = arb lower
  // centre (20 digits; radius ≤ 9e-33) recorded in the JSON for the 7 cells that were mis-rounded (ratio modes use binary64 h·r: regenerate).
  kroneckerLower: Object.freeze([
    C(0, 'ratio', '0.377020355618632', '0.37702035561863', '0.37702035561863158982'),
    C(50, 'ratio', '0.397137123454267', '0.39713712345426', '0.39713712345426690'),
    C(100, 'ratio', '0.418841881320334', '0.41884188132033'),
    C(150, 'ratio', '0.445743596036179', '0.44574359603617', '0.44574359603617885'),
    C(200, 'sharp', '0.456891089293854', '0.45689108929385'),
    C(250, 'sharp', '0.478522539712500', '0.47852253971249', '0.47852253971249954'),
    C(300, 'sharp', '0.533514111339326', '0.533514111339326'),
    C(350, 'sharp', '0.561276104930620', '0.56127610493062'),
    C(400, 'sharp', '0.548675440338394', '0.54867544033839', '0.54867544033839361'),
    C(450, 'ratio', '0.494226984273611', '0.49422698427361', '0.49422698427361052'),
    C(500, 'ratio', '0.519053348106297', '0.51905334810629'),
    C(550, 'ratio', '0.496117318644305', '0.49611731864430', '0.49611731864430500'),
  ]),
  // Float-validated slice maxima (MEASURED): [arb J(θ*), max leaf bound] over the (k+1)-dim slice (k smallest primes + ψ).
  sliceMax: Object.freeze([
    Object.freeze({ cell: 300, k: 4, tol: 1e-6, lo: 0.533514111338652, hi: 0.533515110741, boxes: 213047 }),
    Object.freeze({ cell: 300, k: 5, tol: 1e-4, lo: 0.533514111339326, hi: 0.533614108102, boxes: 1.29e6 }),
    Object.freeze({ cell: 350, k: 5, tol: 1e-4, lo: 0.561276104930620, hi: 0.561376072638, boxes: 4.21e6 }),
  ]),
  k6Partial: Object.freeze({ cell: 300, volumeCovered: 0.024, boxes: 9.2e5, extrapolatedBoxes: 4e7 }),
  usedCostAt300: Object.freeze({ floor: 'TA r_21_40', used: 0.7426, kronLo: 0.5306, p47K0: 0.5644, kron: 0.5335 }),

  // Exact consumer tmp/r3-outer-mixed.py (unchanged) from the r6 admission with HYPOTHETICAL margins (MEASURED).
  scenarios: Object.freeze([
    S('base', 'r6 admission (reproduced)', '146660920737233/1000000000000000', '0.146660920737233', 'CERTIFIED'),
    S('C7_0', 'certified P7 entries at m = 0', '146657963912683/1000000000000000', '0.146657963912683', 'MEASURED'),
    S('C11_0', 'certified P≤11 at m = 0', '36662036381309/250000000000000', '0.146648145525236', 'MEASURED'),
    S('C13_0', 'certified P≤13 at m = 0', '73312153091419/500000000000000', '0.146624306182838', 'MEASURED'),
    S('C37_0', 'certified P≤37 (k ≤ 12, 270 entries) at m = 0', '36644533254657/250000000000000', '0.146578133018628', 'MEASURED'),
    S('C47_0', 'certified P47 only (67 finite-margin) at m = 0', '73177847883083/500000000000000', '0.146355695766166', 'MEASURED'),
    S('C0', 'all 337 certified entries at m = 0', '73136604106781/500000000000000', '0.146273208213562', 'MEASURED'),
    S('C0015', 'all certified at m = −0.0015', '2285307191597/15625000000000', '0.146259660262208', 'MEASURED'),
    S('A12_cert0223', 'all r2 P≤37 at 0.0223', '145543021441783/1000000000000000', '0.145543021441783', 'MEASURED'),
    S('A12_0', 'all r2 P≤37 at m = 0', '145265886341083/1000000000000000', '0.145265886341083', 'MEASURED'),
    S('A_0223', 'all r2 P≤47 at 0.0223 (= P-cond up to pad rounding)', '1131231162467/7812500000000', '0.144797588795776', 'MEASURED'),
    S('A_0', 'all r2 at exact class extremum (WOL exact)', '72252892401367/500000000000000', '0.144505784802734', 'MEASURED'),
    S('A_m0015', 'all r2 at m = −0.0015', '28896022500123/200000000000000', '0.144480112500615', 'MEASURED'),
    S('A_kron_U1', 'P47 raised to interpolated Kronecker cost: U1', '18031603333553/125000000000000', '0.144252826668424', 'HEURISTIC'),
  ]),
  U2: '36063660805739/250000000000000',
  Pcond: '5791903551831/40000000000000',
  p47LateFloors: Object.freeze({ count: 369, cells: [234, 579] }),

  refereeKilled: Object.freeze([
    '7 of 12 lower bounds rounded to nearest, not down (exceeded the arb lower end by ≤ 4.8e-16; referee said 4.1e-16): now rounded down',
    'ratio-mode arb JSONs used binary64 h·r, not exact r·h: not reproducible from the current script (≤ 2.6e-17); regenerate',
    'slice maxima listed as certified: they are float64 branch-and-bound with a-priori slack, i.e. MEASURED',
    '"exact torus maxima": they are slice maxima with ~55,870 other phases pinned at θ*, not the WOL-C class extremum',
    'nextStep "1.86e-3 of the 2.16e-3 gain": 1.863e-3 is base → 0.144798; the class gain at m = 0 is 2.155e-3',
    '"no box centre beat θ*": centres exceed J_lo by up to 1.1e-14 (float noise far below tol)',
  ]),
  nextStep: 'Certify WOL-C for the 369 P47 late-cell floors (cells 234–579): worth 0.146660920737233 → 0.144797588795776 at margin 0.0223 '
    + '(1.863e-3 of the 2.155e-3 available at m = 0). Needs a structured, label-factorised bound (outer-lemma-weak §6.2); T^k boxes stop at k = 5. '
    + 'Regenerate the 7 ratio-mode arb JSONs with the current kron-arb.py. Resume k = 5 at cell 400 (≈ 20 min): '
    + 'R46_NEAR=-1 tmp/routes-b1-r46-py.sh tmp/routes-b1-r46-slicebb3.py tmp/routes-b1-r46-out/kronB_400.json 5 1e-4 6e6 256.',
  environment: 'The /tmp venvs (refCvenv, rhvenv, s145venv) lost pyvenv.cfg and python-flint .py files to /tmp cleanup; this run used a private overlay /tmp/r46-flint.',
  files: Object.freeze(['tmp/routes-b1-r46-kron-arb.py', 'tmp/routes-b1-r46-slicebb3.py', 'tmp/routes-b1-r46-scen.py', 'tmp/routes-b1-r46-out/SUMMARY.json',
    'tmp/routes-b1-r46-out/scen.log', 'tmp/routes-b1-ref46-indepJ.py', 'tmp/routes-b1-ref46-boundstress.py', 'tmp/routes-b1-ref46-slicems.py']),
  verdict: 'Kronecker suprema are certified from below at 12 cells (t = 0.075: ≥ 0.533514111339326); slice maxima k = 4/5 are float-validated '
    + 'only; k ≥ 6 is infeasible with this engine. These are lower bounds on cost and do not change Λ. On the exact consumer any floor '
    + 'improvement is capped at band = U2 = 0.144254643222956; exactness on the certified k ≤ 12 entries is worth 8.3e-5. The lever is WOL-C '
    + 'on 369 P47 late-cell floors. PT Lambda <= 0.2 stands; 0.1758354 and 0.1787854 remain computer-assisted candidates; RH open; NO QED.',
});

const R = ROUTE_46;
const sc = Object.fromEntries(R.scenarios.map((s) => [s.tag, s.exact]));

export const ROUTE_46_ASSERTIONS = Object.freeze([
  {
    id: 'r46-scenarios-exact',
    holds: () => R.scenarios.every((x) => { const n = exact15(x.exact); return n !== null && Math.abs(Number(n) / 1e15 - Number(x.dec)) < 1e-16; })
      && exact15(R.U2) !== null,
    why: 'Every scenario decimal is the exact value of its rational.',
  },
  {
    id: 'r46-scenario-gains',
    holds: () => { const g = (t) => num(sub(sc.base, sc[t]));
      return Math.abs(g('C37_0') - 8.28e-5) < 1e-7 && Math.abs(g('C0') - 3.88e-4) < 1e-6 && Math.abs(g('A_0223') - 1.863e-3) < 1e-6
        && Math.abs(g('A_0') - 2.155e-3) < 1e-6 && Math.abs(num(sub(sc.C37_0, sc.A_0223)) - 1.78e-3) < 1e-5
        && Math.abs(num(sub(sc.A_0223, R.Pcond))) < 2e-15; },
    why: 'Exactness on certified k ≤ 12 entries: 8.28e-5; WOL-C at 0.0223 on P47: 1.863e-3 (= P-cond up to 1e-15 pad rounding); full class at m = 0: 2.155e-3.',
  },
  {
    id: 'r46-u2-cap',
    holds: () => lt(sc.A_kron_U1, R.U2) && R.scenarios.filter((s) => s.tag !== 'A_kron_U1').every((s) => !lt(s.exact, R.U2))
      && lt(R.U2, sc.A_m0015) && Math.abs(num(sub(R.U2, sc.A_kron_U1)) - 1.8166e-6) < 1e-9,
    why: 'band = max(U1, U2): with Kronecker floors U1 = 0.1442528 < U2, so the band is the constant U2 = 0.144254643222956; no floor change goes lower.',
  },
  {
    id: 'r46-rounded-down',
    holds: () => R.kroneckerLower.every((c) => !lt(dec(c.quoted), dec(c.corrected)))
      && R.kroneckerLower.filter((c) => c.stored).every((c) => !lt(dec(c.quoted), dec(c.stored)) && lt(dec(c.corrected), dec(c.stored))
        && num(sub(dec(c.quoted), dec(c.stored))) <= 4.9e-16)
      && R.kroneckerLower.filter((c) => c.stored).length === 7 && R.kroneckerLower.length === 12,
    why: 'Referee correction: the 7 mis-rounded quotes are ≥ the stored arb centre (by ≤ 4.8e-16, so above the lower end); every corrected bound is strictly below it.',
  },
  {
    id: 'r46-t0075-gap',
    holds: () => { const u = R.usedCostAt300; const c300 = R.kroneckerLower.find((c) => c.cell === 300);
      return Math.abs(u.used - u.kronLo - 0.212) < 1e-3 && Math.abs(u.p47K0 - u.kron - 0.031) < 1e-3 && Number(c300.corrected) > 0.5335; },
    why: 'At t = 0.075 the floor in use (0.7426) is 0.212 above the Kronecker cost; the conditional P47 K0* is only 0.031 above.',
  },
  {
    id: 'r46-slice-brackets',
    holds: () => R.sliceMax.every((s) => s.hi >= s.lo && s.hi - s.lo <= s.tol * (1 + 1e-6))
      && Math.abs(R.sliceMax[1].lo - Number(R.kroneckerLower.find((c) => c.cell === 300).corrected)) < 1e-15
      && R.k6Partial.volumeCovered < 0.05 && R.k6Partial.extrapolatedBoxes > 9 * R.sliceMax[2].boxes,
    why: 'Slice brackets close within tol (k = 4: 1e-6; k = 5: 1e-4); k = 6 covered 2.4% of the volume, extrapolating to > 4e7 boxes.',
  },
  {
    id: 'r46-honest-scope',
    holds: () => R.status === 'partial' && /float-validated/.test(R.headline) && /MEASURED/.test(R.refereeKilled[2])
      && /PT Lambda <= 0\.2 stands/.test(R.verdict) && /NO QED/.test(R.verdict),
    why: 'Slice maxima graded measured, not certified; no Λ change; no QED.',
  },
]);

export default ROUTE_46;
