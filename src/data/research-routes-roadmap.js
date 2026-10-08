/**
 * @fileoverview research-routes-roadmap — the fifty experimental routes of 2026-10-06 as site data.
 *
 * Source: formalization/routes/fifty-routes-2026-10-06.md (one entry per numbered route, same numbering,
 * same groups A–J, same tags). Each route states what it tries and why it is not one of the closed classes
 * (flow-blindness, NS-RIGID, Theorem U, T3 = strip, the 2026-09-23 stat-mech routes A–H, Route I as a road
 * past the verified-height crossover 2a = 7.76, mirror descent, local Levinson, paid verification).
 *
 * Status frame: PT Λ ≤ 0.2 is the accepted benchmark; project results are internal-referee only; the values
 * 0.1758354 and 0.1787854 are computer-assisted candidates; RH is open. A route's `status` records work state,
 * not a mathematical outcome ('done' = the route's question is answered, whatever the answer; 'partial' = a result
 * module exists but the route's goal is not reached). `result` / `resultModule` stay null until a route has a
 * written result module.
 *
 * Batch 1 = the five first picks (routes 2, 1, 46, 27, 49, in that order), recorded 2026-10-06 (each with one
 * adversarial internal referee pass; corrections applied in the result modules). Route 1 is back 'in progress': a
 * background certification campaign (tmp/route1-campaign) was launched 2026-10-06 17:27 for the 13 budget-stopped and
 * 125 missing P47 floors (`campaign` field). Batch 2 = routes 3, 4, 5, 6, 20, recorded 2026-10-07 (one internal referee
 * pass each, corrections applied in the route-<id>-*-2026-10-07.js modules). Batch 3 = routes 7, 8, 9, 38, 50, recorded 2026-10-08
 * (one internal referee pass each, corrections applied in the route-<id>-*-2026-10-08.js modules; the combination of the certified
 * levers is in src/data/lambda-levers-combined-2026-10-08.js). Batch 4 = routes 11, 12, 13, 14, 15 (group B, Weil positivity and the
 * Connes programme), recorded 2026-10-09 (one internal referee pass each, corrections applied in the route-<id>-*-2026-10-09.js modules;
 * the joint consumer run with route 9 and the newer campaign certificates is in src/data/lambda-levers-combined-2026-10-09.js).
 * Batch 5 = routes 16, 17, 18, 19 (group C, proportion and mollifiers) and 42 (group I, formal MV-CAP), recorded 2026-10-10 (one
 * internal referee pass each, corrections applied in the route-<id>-*-2026-10-10.js modules; route 42 is 'partial': MV-CAP is a theorem
 * for zero-side premises only). Batch 6 = routes 21, 22, 23, 24 (group D, heat flow and the fluid picture) and 37 (group G, Gram-law
 * statistics), recorded 2026-10-11 (one internal referee pass each, corrections applied in the route-<id>-*-2026-10-11.js modules; route 23
 * is 'partial': the t = 0 loop-identity test is done, its finite-τ production runs were still running). Batch 7 = routes 25, 26, 28, 29, 30
 * (group E, twin ladder and bridge model), recorded 2026-10-12 (one internal referee pass each, corrections applied in the
 * route-<id>-*-2026-10-12.js modules; all five done, none moves Λ). Batch 8 = routes 31, 32, 33, 34, 35 (group F, spectral and
 * Hilbert–Pólya), recorded 2026-10-13 (one internal referee pass each, corrections applied in the route-<id>-*-2026-10-13.js modules; all
 * five done, none moves Λ; route 32's referee pass was major: its continuum-residual claim was a grid-stretch bug). Batch 9 = routes 10
 * (group A, Lean core of Raymond's chain), 36 (group G, random local windows), 39, 40, 41 (group H, formalisation) and 43 (group I,
 * flow-criticality classes), recorded 2026-10-14 (one internal referee pass each, corrections applied in the route-<id>-*-2026-10-14.js
 * modules; routes 10, 39, 40 'partial', 36, 41, 43 'done'; none moves Λ; route 40's referee pass was major: its L1 dl_identity had
 * inconsistent hypotheses (vacuous) and the Lean file was replaced by the referee's corrected version). Batch 10 = routes 44 (group I,
 * Euler-detection depth), 45, 47, 48 (group J, creative), recorded 2026-10-15 (one internal referee pass each, corrections applied in the
 * route-<id>-*-2026-10-15.js modules; all four done, none moves Λ; route 45's referee pass was major: its 'uniformity in x forces the torus
 * supremum' item is false for t > 0 because the source damps with L = log(x/4π)). With batch 10 every route has a result module; the campaign
 * synthesis is src/data/fifty-routes-synthesis-2026-10-15.js (formalization/routes/fifty-routes-synthesis-2026-10-15.md).
 * Import-free. RESEARCH_ROUTES_ASSERTIONS check ids, groups, tags, statuses, the batch sets and result fields.
 */

export const RESEARCH_ROUTE_GROUPS = Object.freeze({
  A: 'Λ upper bound, no money',
  B: 'Weil positivity and the Connes programme',
  C: 'Proportion and mollifiers (the input NS-RIGID leaves open)',
  D: 'Heat flow and the fluid picture',
  E: 'Twin ladder and bridge model',
  F: 'Spectral and Hilbert–Pólya',
  G: 'Cheap local computation',
  H: 'Formalisation and AI-assisted proof',
  I: 'Structural no-gos',
  J: 'Creative',
});

export const RESEARCH_ROUTE_TAGS = Object.freeze({
  'Λ': 'moves the de Bruijn–Newman bound',
  RH: 'RH-level input',
  map: 'sharpens what is possible',
  tool: 'infrastructure',
});

export const RESEARCH_ROUTE_STATUSES = Object.freeze(['planned', 'in progress', 'partial', 'done', 'blocked']);

// First picks in the order given in the source file, with the stated reason.
export const RESEARCH_ROUTE_FIRST_PICKS = Object.freeze([
  Object.freeze({ id: 2, reason: 'New lever found on 2026-10-06 (barrier floor certified to 0.025); cheap to test.' }),
  Object.freeze({ id: 1, reason: 'Closest to a sub-0.145 value.' }),
  Object.freeze({ id: 46, reason: 'Could close much of the 0.75 vs 0.53 gap in certified source floors.' }),
  Object.freeze({ id: 27, reason: 'The clearest RH-level experiment.' }),
  Object.freeze({ id: 49, reason: 'Improves an input many routes use.' }),
]);

const FIRST = new Set(RESEARCH_ROUTE_FIRST_PICKS.map((p) => p.id));
export const RESEARCH_ROUTE_BATCH_2 = Object.freeze([3, 4, 5, 6, 20]);
export const RESEARCH_ROUTE_BATCH_3 = Object.freeze([7, 8, 9, 38, 50]);
export const RESEARCH_ROUTE_BATCH_4 = Object.freeze([11, 12, 13, 14, 15]);
export const RESEARCH_ROUTE_BATCH_5 = Object.freeze([16, 17, 18, 19, 42]);
export const RESEARCH_ROUTE_BATCH_6 = Object.freeze([21, 22, 23, 24, 37]);
export const RESEARCH_ROUTE_BATCH_7 = Object.freeze([25, 26, 28, 29, 30]);
export const RESEARCH_ROUTE_BATCH_8 = Object.freeze([31, 32, 33, 34, 35]);
export const RESEARCH_ROUTE_BATCH_9 = Object.freeze([10, 36, 39, 40, 41, 43]);
export const RESEARCH_ROUTE_BATCH_10 = Object.freeze([44, 45, 47, 48]);
const BATCH = new Map([...[...FIRST].map((id) => [id, 1]), ...RESEARCH_ROUTE_BATCH_2.map((id) => [id, 2]),
  ...RESEARCH_ROUTE_BATCH_3.map((id) => [id, 3]), ...RESEARCH_ROUTE_BATCH_4.map((id) => [id, 4]), ...RESEARCH_ROUTE_BATCH_5.map((id) => [id, 5]),
  ...RESEARCH_ROUTE_BATCH_6.map((id) => [id, 6]), ...RESEARCH_ROUTE_BATCH_7.map((id) => [id, 7]), ...RESEARCH_ROUTE_BATCH_8.map((id) => [id, 8]),
  ...RESEARCH_ROUTE_BATCH_9.map((id) => [id, 9]), ...RESEARCH_ROUTE_BATCH_10.map((id) => [id, 10])]);

// Route-1 certification campaign (launched 2026-10-06 17:27; state recorded from the launch report and status.tsv).
const ROUTE_1_CAMPAIGN = Object.freeze({
  launched: '2026-10-06 17:27',
  dir: 'tmp/route1-campaign',
  scheduler: 'tmp/route1-campaign/campaign.py (tmp/routes-b1-r1-venv/bin/python), PID 34452, log sched.log, state state.json, status status.tsv / status.json',
  engine: 'tmp/r7-full-cert.py importing tmp/r7-engine-cert-v4c.py unchanged; --adapt 0.05 --coarsen 0.05; budget-stopped floors resumed with --resume --continue (earlier certificate kept as cert_<i>.partial<secs>.json; --retarget at the same target would only print "already final")',
  order: 'cells 417–424 (idx 201–208), then cells 459–464 (idx 246, 248, 249, 251, 254), then the 125 missing floors, each warm-started from the nearest complete same-family certificate',
  floors: Object.freeze({ budgetStopped: 13, missing: 125, missingByFamily: Object.freeze({ '0.88|r_23_40': 47, '0.94|r_49_100': 32, '0.94|sharp': 29, '0.88|sharp': 17 }) }),
  budgets: '6 h per continuation run; 5 h per missing floor, plus one 6 h continuation if budget-stopped',
  limits: 'at most 8 workers; a new worker only if projected memory < 15.5 GB and 1-min load < 30; above 15.8 GB the newest worker is stopped and re-queued (resumes from its checkpoint, ≤ 10 min lost); in practice 6 workers (≈ 2.3–2.7 GB each)',
  eta: Object.freeze({ wallHours: Object.freeze([60, 65]), workerHours: 370, missingCpuHours: 290, continuationWorkerHours: 78, grade: 'heuristic' }),
  baselineCollector: 'collect.sh into collect-baseline/ reproduced r7 exactly: 369 floors (244 certified, 125 missing), 0 coverage holes, 523 certfile entries (0 bad, min slack 1.13e-13), fullref 0.145694083872924, rebuild 0.145694083872923, E1–E8 74,596 steps 0 failures',
  snapshot: '2026-10-06 20:54: 6 running (idx 201–206), 132 pending; idx 201 top open box 0.0745 against target 0.0660 (was 0.1011 at launch)',
  progress: '2026-10-07 02:39 (status.tsv): 2 done at target (idx 246 cell 459, idx 248 cell 460; margins 0.0499994, 0.0499999), 5 budget-stopped (idx 201–205, full-cover certificates at margins 0.0657–0.0740 above target), 6 running, 125 pending. Collector with these: route-P alone 0.145681937488254 (−1.2146e-5); combined with routes 3 and 5 (3 bands, 281 kernels) 0.145322418219213 (src/data/lambda-levers-combined-2026-10-08.js). 2026-10-07 06:54 (status.tsv): 15 done, 8 budget-stopped, 12 running (12 workers, 29.7 GB), 103 pending; collect6: 255 certified (246 complete), 114 missing, route-P alone 0.145535458600488; joint with routes 3 and 5 0.145276368594868 (route 9 adds exactly 0; src/data/lambda-levers-combined-2026-10-09.js). 2026-10-08 03:10 (status.tsv, read at the batch-10 record): 76 done, 10 budget-stopped, 12 running, 40 pending; no collector run since collect6, so the certified joint value is still 0.145276368594868 (Λ < 0.145 not certified); route 47 forecasts (heuristic) that the 17 pending/running 0.88-sharp floors (cells 392–416) end budget-stopped under the current policy',
  commands: Object.freeze({ monitor: 'tmp/route1-campaign/monitor.sh', drain: 'touch tmp/route1-campaign/STOP', pause: 'touch tmp/route1-campaign/PAUSE',
    hardStop: 'kill $(cat tmp/route1-campaign/sched.pid); pkill -f "r7-full-cert.py tmp/route1-campaign/run"' }),
  note: 'Originals in tmp/r7-full-out/run untouched. Route 5 (measured): with 3 bands, the 125 missing floors at target alone would give 0.144986 < 0.145; with the 281-kernel grid on top, 0.1449666 (measured). Λ < 0.145 is not certified while the campaign runs.',
  qrhPathNote: '7/8 (openai/math 003 half-plane) path, 2026-10-08 (src/data/qrh-path-push-2026-10-08.js): the route-P single-band consumer re-tuned on the lower barrier path gives the certified conditional value 0.116091488672439 (was 0.117708313410954), conditional on the 003 half-plane, G0, PT and the route-P ledger, not a bound. On that path a v4c/WOL-C floor is worth ≈ 3.2e-6 to first order (best single target), so the campaign floors placed on the strip/band path are not the lever there; the 130 7/8-path P47 targets (tmp/qrh-tune-out/lever3_targets.json) were NOT appended to the running campaign queue.',
});

// Recorded outcomes (batch 1, 2026-10-06; batch 2, 2026-10-07; batch 3, 2026-10-08; batch 4, 2026-10-09; batch 5, 2026-10-10; batch 6, 2026-10-11; batch 7, 2026-10-12; batch 8, 2026-10-13; batch 9, 2026-10-14; batch 10, 2026-10-15). One sentence each; details, grades and referee corrections in the module.
const RESULTS = Object.freeze({
  1: Object.freeze({ status: 'in progress', resultModule: 'src/data/route-1-finish-route-p-2026-10-06.js', campaign: ROUTE_1_CAMPAIGN,
    result: 'Round 7 certified 0.145694083872924 at PT height (244 of 369 P47 floors, interval-certified, internal referee only, conditional on the shared ledger; Λ < 0.145 not certified); the background campaign (tmp/route1-campaign, launched 2026-10-06 17:27, ETA ≈ 60–65 h wall, heuristic) has by 2026-10-07 06:54 15 floors done and 8 budget-stopped (collect6: 255 of 369 floors certified, route P alone 0.145535458600488), and stacked with routes 3 and 5 gives 0.145276368594868 (route 9 adds exactly 0; still above 0.145, so Λ < 0.145 not certified).' }),
  3: Object.freeze({ status: 'done', resultModule: 'src/data/route-3-three-point-probes-2026-10-07.js',
    result: 'The multi-point joint floor (Theorem MP, written, unrefereed) is certified on the exact consumer but moves the PT-height value only by −7.86e-7 (to 0.145693297586243); six new certified two-point kernels with λ < 2 found with the same machinery give 0.145465618111039 (−2.28e-4), so Λ < 0.145 is still not certified.' }),
  4: Object.freeze({ status: 'done', resultModule: 'src/data/route-4-fejer-riesz-wol-2026-10-07.js',
    result: 'Fejér–Riesz SOS certifies the per-prime fiber maxima exactly (residual ≤ 1.05e-12) but gains only 2.2–4.1e-4 per box, which is the θ-grid slack (a finer grid recovers it to 9.2e-7), while the binding top boxes need 0.0024–0.035 and one octree split supplies that, so route 4 is not a lever.' }),
  5: Object.freeze({ status: 'done', resultModule: 'src/data/route-5-many-bands-2026-10-07.js',
    result: 'Four bands lower the route-P value at PT height to 0.145620383931826 (−7.37e-5; 3 bands with existing windows give 0.145632847457923), certified relative to the shared ledger with one new wall and two Route-2 RH windows; band 1 binds, and with the current band-1 floors no layout goes below 0.145566855004312 (measured).' }),
  6: Object.freeze({ status: 'done', resultModule: 'src/data/route-6-sparse-verification-2026-10-07.js',
    result: 'Inside the Lemma-B framework and for the current floor catalogue (written, unrefereed; Theorem N corrected by the referee), the contiguous RH head cannot be replaced, but one window wider than D_K = 921–1639 with right wall ≥ x_** replaces ≈ 1.73e12 ordinate units (5.45e6 core-hours) at τ = 0.145; the existing 7.8e12 window serves.' }),
  20: Object.freeze({ status: 'done', resultModule: 'src/data/route-20-effective-ki-kim-lee-2026-10-07.js',
    result: 'An explicit-constant version of Polymath15 Theorem Zero(i) is Arb-certified (conditional on Polymath15 Thm 1.3 and de Bruijn): zeros of H_t with Re z ≥ x0(t) + 0.47 are real and simple, x0 ≈ 4π·exp(c/t), c ≈ 5.3–5.8 (4.07e13 at t = 0.2), but at X = 6e12 it covers only t ≥ 0.217, so it replaces no verified-height input.' }),
  7: Object.freeze({ status: 'done', resultModule: 'src/data/route-7-time-dependent-mollifiers-2026-10-08.js',
    result: 'Per-cell Euler weights λ_p ∈ [0, 1] on the {2,3,5} mollifier are admissible (Lemma CG^λ proved; Theorem 4\'^λ a written sketch), but in the float model λ = 1 is already best for every path mode (uniform and per-rectangle λ; λ > 1 and a seventh prime lower the floors), so the certified U stays 0.145694083872924 exactly.' }),
  8: Object.freeze({ status: 'done', resultModule: 'src/data/route-8-polymath-raymond-hybrid-2026-10-08.js',
    result: 'A joining lemma (Theorem B\'_P, written, unrefereed) gives Λ ≤ max(Raymond bands, t0 + y0²/2); the band next to X binds and Polymath near X is far weaker, so the best split has no Polymath band (route P / route 5) and any Polymath band gives 0.1758354 (+0.030141316127076); a band could only tie, from x ≥ ≈ 1.2e15 in the P11 lane model (measured).' }),
  9: Object.freeze({ status: 'done', resultModule: 'src/data/route-9-barrier-height-schedule-2026-10-08.js',
    result: 'One optimised height set (10-knot multiplier of PLAN, added to the multi-height menu) lowers the certified PT-height route-P value to 0.145637425999752 (−5.67e-5), all used height sets to 0.145630653648379 (−6.34e-5), relative to the shared ledger with G0-d refereed on the new sets; an option union, not additive with routes 3 and 5.' }),
  38: Object.freeze({ status: 'done', resultModule: 'src/data/route-38-barrier-height-scaling-2026-10-08.js',
    result: 'Six closed barrier slabs (≈ 2X, 5X, 10X; floors 0.17 and 0.03) certify with the unmodified sealed producer at proxy-selected X\' with margins ≈ 0.50 and 0.08–0.10, cost growing like X^0.45–X^0.57; none moves Λ until RH is verified to ≈ X\'/2 (verified height binds, not the barrier).' }),
  50: Object.freeze({ status: 'done', resultModule: 'src/data/route-50-kkl-lambda-curve-2026-10-08.js',
    result: 'Λ ≤ t0 + y0²/2 from the certified KKL step function (idealised as c/log((X − 0.47)/4π)) still needs RH to X/2 and a barrier; beating route P at PT height needs c ≤ 3.912 against the method\'s ≈ 5.53, and the triangle-inequality method is Arb-floored at c > 4.9144 for x0 ≥ X_PT, so route 50 is closed at PT height for the current technique.' }),
  11: Object.freeze({ status: 'done', resultModule: 'src/data/route-11-multi-prime-toeplitz-krein-2026-10-09.js',
    result: 'The multi-rung ARB-LEGE certificate gives pole-free Weil positivity of ζ with no zero input for every 2a ≤ ln 4 (c = 8.55e-8) and 2a ≤ ln 5 (c = 2.25e-12), cleanly also ln 6, and to ln 11 (c = 5.62e-42) conditional on closing a float-rounding gap in the torus-floor cover; margins fall like 10^(−4.8·e^{2a}) and are near-sharp, the whole range is inside the verified height, and no Λ bound moves.' }),
  12: Object.freeze({ status: 'done', resultModule: 'src/data/route-12-semilocal-s23-identity-2026-10-09.js',
    result: 'The S = {∞,2,3} trace identity is derived (conditional on the Connes–Consani framework) and its trace side measured positive (L̂(0) ≈ +0.10 to +0.12), but the remainder share on the pole-free Weil minimiser stays 99.71%–99.99997% on [ln 3, ln 4] for S = {∞,2}, {∞,2,3}, {∞,2,3,5}; that share equals 1 − λ_W/L_S(h0) by definition, so at cutoff 1 this metric cannot separate one S from another (measured, nothing certified).' }),
  13: Object.freeze({ status: 'done', resultModule: 'src/data/route-13-lacunary-muntz-cones-2026-10-09.js',
    result: 'Weil positivity on the lacunary cone Λ = {4^k} is an unconditional Arb-certified theorem (normalised Pick operator ≥ 3.6346e-4), equivalent to an indeterminate Carathéodory interpolation of ξ′/ξ; on separated lacunary lattices it sees no zeros above a finite horizon (80 for 4^k in a double-zero model, under stated conditions), so the NS-RIGID A6 loophole adds nothing there, while the near-Müntz-threshold regime stays open at the heuristic level.' }),
  14: Object.freeze({ status: 'done', resultModule: 'src/data/route-14-family-weil-positivity-2026-10-09.js',
    result: 'Weil positivity averaged over the nonprincipal characters mod q is Arb-certified to 2a ≈ 2 log q (10.0 at q = 257) against ≈ 2 for individual characters (a method limit), but the gain is Euler-blind (a family containing the RH-false F_DH is certified positive at 2a = 7.764) and at all supports it is GRH for every character mod q, so it is a mapped closed class, not a lever.' }),
  15: Object.freeze({ status: 'done', resultModule: 'src/data/route-15-epstein-euler-blindness-2026-10-09.js',
    result: 'For 27 Epstein zeta functions (12 discriminants, h = 2–4) the Weil form is Arb-certified negative at an explicit support; lower ends are measured for even test functions only (the odd sector fails first for D = −23, a* ≈ 1.662); principal forms fail near log(|D|/4) − 0.13 with DH\'s 1.72 inside that band, and forms with r(m1)/r(amin) = 2 fail early (a* ≤ 0.417 for 2x² + 2xy + 3y², below the Route I support).' }),
  16: Object.freeze({ status: 'done', resultModule: 'src/data/route-16-alpoge-furman-twin-ladder-2026-10-10.js',
    result: 'The Alpöge–Furman ≥ 2/3 mechanism (preprint: Weil form compressed to a height-localised Gabor family, Montgomery second moment, rank–trace lemma, inertia) reproduces at heights 1e3–2.9e5 with no substantive gap (certificate 0.5775 in the paper\'s form at 2.9e5, tending to 2/3 like 1/L, main-term measurement), and sits in the class NS-RIGID leaves open via a prime-side second moment over a family of growing dimension plus signature counting; ceiling ≈ 0.682 at bandwidth one, peer-reviewed record still PRZZ 5/12.' }),
  17: Object.freeze({ status: 'done', resultModule: 'src/data/route-17-mollifiers-beyond-four-sevenths-2026-10-10.js',
    result: 'Conditional on the twisted second moment, one-piece Conrey gives κ = 0.4249 (θ = 0.6), 0.5884 (θ = 1), 0.7703 (θ = 2) and passes PRZZ at θ = 0.586; at T = 1e3–1e6 the mollified mean square matches the full finite-T recipe main term within 0.52% on 4 single-seed sample sets (θ up to 2 at T = 1e3; sensitive to ≳ 1% off-diagonal terms), the reported small-T recipe failure being a series-truncation bug; no proof input.' }),
  18: Object.freeze({ status: 'done', resultModule: 'src/data/route-18-local-levinson-pair-correlation-2026-10-10.js',
    result: 'Closed as a map: pair correlation as an ordinate-only statistic is consistent with any rearrangement in windows of length o(T) and is β-blind (no known mechanism shortens the certifiable window; not a non-implication theorem), and a count certificate feeds the profile form of H_desc-mirror (c* = 0.882) only loss-free at ≈ 2 (lattice) to 4 (GUE mean) spacings, while the frozen-model profile criterion already fails at worst-case sites.' }),
  19: Object.freeze({ status: 'done', resultModule: 'src/data/route-19-mollified-weil-forms-2026-10-10.js',
    result: 'A length-N Dirichlet-polynomial mollifier at half-support a is exactly the plain Weil form at half-support a + ½ log N on a subset (proved, elementary), so it never detects earlier in total support; on Davenport–Heilbronn it detects at smaller a but with 0–1.11 more total support than the plain onset, inherits certified Euler-blindness for 2a + log N ≤ ln 11, and merges into Route I.' }),
  42: Object.freeze({ status: 'partial', resultModule: 'src/data/route-42-formal-mv-cap-2026-10-10.js',
    result: 'MV-CAP is a theorem (internal) for zero-side and O-form premises: at every window of [3.1e12, 7.50e16] an explicit admissible counter-model violates H_desc (p_viol ≤ 3.0119 < 4.3743, double-precision with margin), so certifying needs one-window resolution; it is not established for explicit function-side L² mean values, which catch the counter-model at the proxy height (σ = 2 Montgomery–Vaughan, |ζ(1+it)| bound), and the original Proposition E was false as stated.' }),
  21: Object.freeze({ status: 'done', resultModule: 'src/data/route-21-zero-flow-entropy-functionals-2026-10-11.js',
    result: 'Closed as a map: the zero flow is a graph heat equation in the imaginary parts (majorization, proved for polynomials), the monotone additive functionals are exactly the saddle functions (complex case) and, for real polynomials, a log-convex family Σ|y|^p from Pólya\'s count to de Bruijn\'s max-Im bound, but all are forward-only inequalities valid for every polynomial datum with non-real zeros (flow-blind, SL2 class), so no Λ or zero-location information.' }),
  22: Object.freeze({ status: 'done', resultModule: 'src/data/route-22-lehmer-pair-hunt-2026-10-11.js',
    result: 'Over 1,551,082 FLINT zeros near 1e10–1e13 plus Odlyzko\'s first 1e6, the best certified Lehmer-pair bound is Λ ≥ −4.2577e-6 (assuming FLINT/Arb and the CSV criterion as re-derived), ≈ 3.7e5× weaker than the superseded SGD record and adding nothing beyond Rodgers–Tao Λ ≥ 0; the small-gap rate sits 3σ below GUE and replicates the known Bogomolny et al. CUE_Neff finite-height correction (measured).' }),
  23: Object.freeze({ status: 'partial', resultModule: 'src/data/route-23-ht-vs-dyson-bm-2026-10-11.js',
    result: 'The H_t flow is the drift of Dyson BM, so the β = 2 loop identity (proved for finite CUE_N; standard) fixes dV/dτ(0) = −4; zeros near T ≈ 1e6 give Q = −0.9414 (deviation > 12σ, measured), consistent with (0.434 ± 0.008)·12Λ_B/L² over L ∈ [7, 12] only (β_eff ≈ 2.13), not evaluable in the BBLM model; the finite-τ production runs had not finished.' }),
  24: Object.freeze({ status: 'done', resultModule: 'src/data/route-24-mean-field-local-counts-2026-10-11.js',
    result: 'No rigorous gain: at X = 6e12 the P15 triangle method controls arg H_t below de Bruijn\'s ceiling only for t ≥ 0.13720 (Arb on a grid, a statement about the method), and the Poisson-smoothed count it can supply is capped by its mean L/4, which under the B2 single-width lemma caps the channel at Λ ≈ 0.148 at the current seam (above the internal 0.145535; below 0.145 only from binding height ≈ 1.75e13).' }),
  37: Object.freeze({ status: 'done', resultModule: 'src/data/route-37-gram-law-barrier-difficulty-2026-10-11.js',
    result: 'Closed as a negative result: over 451,291 certified Gram points (FLINT 3.6, 1e8–3e13) Gram-violation density predicts neither the route-P binding late-cell floors (height-free torus suprema) nor t = 0 barrier difficulty (|ρ| ≤ 0.18, both tails) nor the full flow minimum Dall (|ρ| ≤ 0.31), and the easy proxy-selected barrier sites carry three times the background bad-Gram density (measured).' }),
  2: Object.freeze({ status: 'done', resultModule: 'src/data/route-2-lowered-barrier-floor-2026-10-06.js',
    result: 'The lowered barrier floor moves nothing: route P has no floor input, and under Polymath Thm 1.2 the floor enters only through containment, which holds at every certified floor because the certified hypothesis (ii) sits at y0 = 0.18727, so 0.1787854 and 0.1758354 are unchanged.' }),
  25: Object.freeze({ status: 'done', resultModule: 'src/data/route-25-bridge-as-scattering-2026-10-12.js',
    result: 'The modular-surface scattering matrix factors exactly as φ = c_∞(s)·χ(2s−1)·ζ(2−2s)/ζ(2s) with resonances ρ/2 in the ζ(2s) factor, and the soft Lax–Phillips axioms (unitarity, functional relation, positive residue, inner) survive moving resonances off Re s = ¼ (de Bruijn flow; rational relocation with a quadratic Q_0, after the referee caught an acausal double-root bug), so φ-level scattering is RH-blind, detects zeros only at Re w ≥ 1 (the ζ(1+it) ≠ 0 level), and its bridge/Euler split is a bookkeeping convention (mpmath, not interval-certified).' }),
  26: Object.freeze({ status: 'done', resultModule: 'src/data/route-26-gl2-twin-ladder-2026-10-12.js',
    result: 'For GL(2) (11a, Δ, Δ·E4) Ramanujan is RH for each rung (Hasse for weight 2, Deligne\'s Weil I for k > 2) and buys no RH-level ladder statement; what becomes provable is conductor-driven and Euler-blind: no pole terms, positive bridge delay once c0 > 0 (k ≥ 14 at level 1, N ≥ 126 at weight 2), and Arb-certified family Weil positivity at 2a ≤ log 3 above level thresholds (weight 2: N ≥ 30; every k ≥ 20 at level 1; Δ·E6 open), which a no-Euler-product weight-24 twin with off-line zeros also passes up to log 7.' }),
  28: Object.freeze({ status: 'done', resultModule: 'src/data/route-28-selberg-zeta-freeze-sandbox-2026-10-12.js',
    result: 'On the PSL2(Z) Selberg zeta (half-plane RH-analogue a theorem; exact length spectrum to N ≤ 6.4e7, Mayer determinant agrees to 6e-9) Theorem U, the telescope and five-shell identities hold verbatim and the gate, cocycle and phase statistics are of ζ\'s order (differences heuristically tracking zero density, confounded by the ρ/2 family), but no RH-false control was run, so RH-blindness of the freeze calculus is not shown by this route.' }),
  29: Object.freeze({ status: 'done', resultModule: 'src/data/route-29-interferometer-visibility-2026-10-12.js',
    result: 'Closed negative: the exact-arm visibility V0 = sech(log|χ|) is a gamma-factor reparametrisation, the pointwise bound on the canonical theta split is sufficient but Arb-certified false for ζ and DH up to t = 200 on every tested line (even σ = 1.5), visibility is gauge-dependent with Λ as its gauge-invariant content, and fringe-zero interlacing near the line is the Laguerre–Pólya consequence of RH (DH breaks it exactly at its four off-line zero heights).' }),
  30: Object.freeze({ status: 'done', resultModule: 'src/data/route-30-finite-support-euler-detector-2026-10-12.js',
    result: 'Rung tests detect the missing Euler product of Davenport–Heilbronn at 2a just above ln 2 (full data, |c(2)| = κ ln 2), ln 4 (even data or any affine test; Toeplitz witness 2 + 2m_2(2) = −2(1+κ²), Arb) or ln 6 (Euler-only, c(6) ≠ 0), sharp relative to formal local Euler products of local degree 1 and read back from DH\'s on-line zeros, well below the Weil-form onset 3.44; a coefficient-multiplicativity test with no RH content.' }),
  31: Object.freeze({ status: 'done', resultModule: 'src/data/route-31-berry-keating-xp-regularised-2026-10-13.js',
    result: 'Against the first 10^5 zeros every operator-only regularised xp model (Berry–Keating cutoffs, the semiclassical Sierra–Rodriguez-Laguna count, the Gamma-phase / Sierra–Townsend class) reproduces only the smooth part (T/2π)(log(T/2π) − 1) + 7/8 of N(T) and leaves exactly S(T) as residual (correlation ≥ 0.99999); fluctuations return only with primes (prime-orbit sum 0.9992, explicit formula 4e-9, finite-Λ Weil form, which is a restatement of the explicit formula with a rounding-dependent near-kernel for λ² ≥ 13), and BBM reproduces the zeros only because ζ is its boundary condition (reality of its spectrum would imply RH, one direction).' }),
  32: Object.freeze({ status: 'done', resultModule: 'src/data/route-32-inverse-spectral-potential-2026-10-13.js',
    result: 'Inverse spectral (Wu–Sprung type) potentials whose lowest N eigenvalues are the first N zeros are built for N ≤ 5000 (discrete operator to ≤ 2.3e-11; continuum, sinc-interpolated, to ≈ 1–2% of a spacing after the referee found a grid-stretch bug behind the reported ≈ 0.1); the fluctuation persists scale by scale as N grows, its whiteness and limiting regularity are not established, and since the construction consumes the ordinates it gives no RH lever.' }),
  33: Object.freeze({ status: 'done', resultModule: 'src/data/route-33-arithmetic-rmt-corrections-2026-10-13.js',
    result: 'The departure of zeta-zero pair correlation from GUE is the (ratios-conjecture) Bogomolny–Keating correction at amplitude 1.0000 ± 0.0008 over 8 windows (dominated by T ≤ 1.13e6; 1.0086 ± 0.0088 at 1e10–1e13), with the Hardy–Littlewood factor, separated prime-power spikes and low-zero dips each detected; Λ_B re-derived as 1.5731511, gap variance off BBLM at L ≤ 28, and route 23\'s Q + 1 follows c·12Λ_B/L² with c = 0.441 ± 0.008 to 1e13, saturated by 2–3 neighbours.' }),
  34: Object.freeze({ status: 'done', resultModule: 'src/data/route-34-de-branges-hamiltonian-xi-2026-10-13.js',
    result: 'The de Branges Hamiltonian of Lagarias\' E = Ξ + iΞ\' (a Krein string of length ξ\'\'(1/2)/ξ(1/2) = 0.0462099862) is computable and stable from ≤ 16,000 zeros (exact rational chains confirm), mass positivity is tautological given real zeros, an off-line quadruple appears as one negative mass plus one negative length at a depth not yet N-converged, and as the a → 0 gauge limit of the T3 strip ladder the route reduces to the zero-location wall.' }),
  35: Object.freeze({ status: 'done', resultModule: 'src/data/route-35-certified-li-coefficients-2026-10-13.js',
    result: 'Arb certifies λ_n > 0 for every n ≤ 10^4 (reproducing Johansson\'s keiper_li; a separately coded Arb run confirms n ≤ 8500, a 10^6-zero sum agrees to 4e-8); with the Γ(1+s/2) split λ_n = (n/2)log n + c·n + 3/4 + osc_n + O(1/n) (constant −1/4 with Γ(s/2)) and |osc_n| ≈ (0.15–0.26)·√n — calibration data weaker than what the verified height already implies.' }),
  10: Object.freeze({ status: 'partial', resultModule: 'src/data/route-10-lean-core-raymond-chain-2026-10-14.js',
    result: 'Lemma CG / G0-a (c_n(t) ≥ 0 nondecreasing for every n ≥ 1, t ≥ 0) and the start substitution (Re s > θ ⇒ Im(z)² ≤ max((2θ−1)² − 2t, 0) for the standard H_t; θ = 7/8 via the openai/math Lean theorem, Λ ≤ 9/32) are Lean 4 theorems with no sorry and standard axioms (referee re-build confirmed, 18/18 axiom lines), Lemma R is a Lean theorem conditional on AF (4.6) and Φ\' = Re β_t, and G0-c, G0-d and the barrier certificate are not formalised, so no Λ bound moves.' }),
  36: Object.freeze({ status: 'done', resultModule: 'src/data/route-36-random-local-windows-2026-10-14.js',
    result: 'In 16 random Platt windows from 1.06e13 to 3.09e19 (150,541 zeros, wrap-patched FLINT 3.6.0) a no-parity direct-integral Turing count certifies 146,768 zeros simple and on the line without FLINT\'s Gram-block criterion, 33 RS certificates up to 2e16 confirm the anomalies (16 of 32 Rosser violations), and nothing departs from GUE expectations; the closest pair (δ = 0.0135) gives λ ≥ −3.563e-6, superseded by Rodgers–Tao.' }),
  39: Object.freeze({ status: 'partial', resultModule: 'src/data/route-39-lean-weil-small-support-2026-10-14.js',
    result: 'A 543-line Lean file (no sorry) proves the Yoshida-type reduction for ζ — prime side zero below log 2 (sharp), pole term ≥ 0, Fubini link to the explicit-formula right-hand side, uncertainty positivity for even f with supp f⋆f* ⊆ [−0.1733, 0.1733] given two Arb-certified digamma facts — but Weil\'s explicit formula enters as a hypothesis over an abstract zero functional (PNT+ Kadiri.lean is a 14-sorry scaffold for it) and integrability is not formalised.' }),
  40: Object.freeze({ status: 'partial', resultModule: 'src/data/route-40-lean-wol-band-barrier-2026-10-14.js',
    result: 'Lean checks fragments of the lemmas L1–L5 behind WOL-C (β_n(t) ≥ 0 and monotone via a new heat-equation proof, grid maxima, pieces of 4.3/4.4/5.3) and the logical/algebraic core of Theorem BB (81 declarations, standard axioms, after the referee replaced a vacuous L1 dl_identity), while WOL-C and BB1/BB2 stay unproved and the five Aristotle jobs were prepared but not submitted.' }),
  41: Object.freeze({ status: 'done', resultModule: 'src/data/route-41-lean-arb-certificate-replay-2026-10-14.js',
    result: 'A Lean soundness theorem plus decide +kernel integer certificates (no native_decide) replay the linear-algebra leg of ARB-LEGE at (T, N) = (200, 160), (200, 240), (400, 320) as a finite-dimensional assembly inequality in Galerkin coefficients (c_Lean = 8.1498e-4, 8.2044e-4, 9.0434e-4; N = 240 tail also in Lean; ≤ 892 s and 5.5 GB per instance), with the transcendental enclosures and the analytic reduction still Arb/paper-trusted.' }),
  43: Object.freeze({ status: 'done', resultModule: 'src/data/route-43-flow-criticality-classes-2026-10-14.js',
    result: 'Grading inputs by κ(P) = sup Λ over P puts the critical strip at 1/2 and QRH 7/8 at 9/32 (exact witness (z² + Y²)cos(cz), exact only in the de Bruijn class without Φ > 0), gives fixed-support Weil positivity a lower-bound ladder (T²κ_low → 0.349) and tail-blind inputs nothing beyond the strip, while flow-critical-but-not-RH statements in NS-RIGID\'s binary sense stay conditional on an escape law not tested at small τ.' }),
  44: Object.freeze({ status: 'done', resultModule: 'src/data/route-44-euler-detection-depth-2026-10-15.js',
    result: 'Across 440 same-gamma-factor Davenport–Heilbronn-type twins of Dirichlet L-functions (conductors 5–49) the Weil form is Arb-certified negative for 387 at supports a ∈ [0.36, 3.40] (upper bounds on the blindness radius; DH ≤ 1.74 against tlb-dh-blind\'s 1.72), Euler arms stay positive, 53 twins stay blind to a = 3.6 (measured), and the onset follows the root-number phase and the first off-line zero with a weak, censoring-biased conductor slope (≈ 0.2–0.37 per log q) against slope 1 for route 15\'s Epstein forms.' }),
  45: Object.freeze({ status: 'done', resultModule: 'src/data/route-45-multiplicative-chaos-source-tails-2026-10-15.js',
    result: 'A Bohr–Jessen random model (finite-variance, not log-correlated at σ_eff 0.88–1.59) cannot explain the certified-floor vs Kronecker gap, which is certification slack on one free-phase torus supremum; it predicts real heights near X reach 0.05–0.12 below the Kronecker lower bounds, and the referee (major) showed that for t > 0 the source damps with L = log(x/4π), so uniformity in x forces only a finite x-window per L-band, a candidate lever needing a deterministic finite-window bound (not usable now).' }),
  47: Object.freeze({ status: 'done', resultModule: 'src/data/route-47-learned-adversaries-2026-10-15.js',
    result: 'Surrogates trained on 1.06e6 existing θ_s-boxes find no WOL-C violation and nothing r6 missed (best Φ − K0* = −0.001563, only r6\'s kink-displaced maximum is non-central), their hard-box proposals fail exact v4c checks, and as forecasters they match K0 alone (plus g = τ − m0 within r_23_40, referee), pointing to all 17 pending 0.88-sharp floors (cells 392–416) being budget-stopped under the current policy (heuristic).' }),
  48: Object.freeze({ status: 'done', resultModule: 'src/data/route-48-phase-retrieval-zeta-2026-10-15.js',
    result: 'Without symmetry |ζ| on the critical line fixes ζ up to independent off-line flips ρ ↔ 1 − ρ̄ and e^{iα + λ(s − 1/2)} (normalised Blaschke factors; the Hilbert-transform wall stated exactly), the functional equation plus reality give ±ξ (either alone fails), a second line right of every zero locates the zeros without the FE (8 Davenport–Heilbronn off-line zeros below 400; completeness corroborated, not proved), and the unconditional Hilbert phase defect on the line is ≲ 1.48e-12·t for t ≪ 3e12.' }),
  27: Object.freeze({ status: 'done', resultModule: 'src/data/route-27-function-field-twin-ladder-2026-10-06.js',
    result: 'Over F_q the twin-ladder Weil form is minus the intersection form on primitive Frobenius-graph classes, so Hodge index gives curve-RH, while ladder data alone do not (215 exact Euler-product fakes); the lift to Q stops at the missing Spec Z × Spec Z with a Hodge index theorem.' }),
  46: Object.freeze({ status: 'partial', resultModule: 'src/data/route-46-exact-kronecker-floors-2026-10-06.js',
    result: 'Kronecker suprema are certified from below at the 12 binding cells (t = 0.075: ≥ 0.533514111339326) and slice maxima are float-validated only for k ≤ 5; on the exact consumer any floor gain is capped at U2 = 0.144254643222956, so the route reduces to certifying WOL-C on 369 P47 late-cell floors.' }),
  49: Object.freeze({ status: 'done', resultModule: 'src/data/route-49-unconditional-s-of-t-2026-10-06.js',
    result: 'An elementary sawtooth lemma on top of Trudgian 2011 (constant to be checked) improves |S(T)| by 9–17% for T in 1e11–1e17 (5.6748 vs 6.6612 at 3e12), but no pointwise S(T) input gives a usable mirror-descent lever (pessimistic weights stay above 0.2 even at E = 0).' }),
});

const R = (id, group, tag, title, summary, whyNotClosed, seeAlso = []) => Object.freeze({
  id,
  group,
  groupName: RESEARCH_ROUTE_GROUPS[group],
  title,
  summary,
  tag,
  whyNotClosed,
  status: RESULTS[id]?.status ?? 'planned',
  batch: BATCH.get(id) ?? null,
  result: RESULTS[id]?.result ?? null,
  resultModule: RESULTS[id]?.resultModule ?? null,
  campaign: RESULTS[id]?.campaign ?? null, // background computation in flight, when one exists
  resultPage: null, // site path of a result page, when one exists
  firstPick: FIRST.has(id),
  seeAlso: Object.freeze(seeAlso),
});

export const RESEARCH_ROUTES = Object.freeze([
  // A. Λ upper bound, no money
  R(1, 'A', 'Λ', 'Finish route P',
    'Certify the remaining P47 late cells at margin ≤ 0.050 (round 7 full run, then referee) for a sub-0.145 value at PT height.',
    'Uses only the verified PT height; the r6 synthesis shows late margins ≤ 0.050 reach < 0.145 while the best corrected late margin 0.0533 gives 0.145017, so the gap is a tighter late-cell majorant, not new height.',
    ['/lambda-bounds', '/pt-floor-audit']),
  R(2, 'A', 'Λ', 'Lowered barrier floor into route P',
    'Feed the lowered barrier floor (certified to 0.025 on 2026-10-06) into the Raymond/route-P architecture at early times; measure how much Λ drops when the band argument can start lower.',
    'The floor of the barrier rectangle was certified down to 0.025 on [X, X+1] for 0 ≤ t ≤ 0.16125 (Arb, 2026-10-06). The 2026-07 audit found barrier slack non-binding for the PT architecture; the effect of a lower floor on the route-P band argument at early times has not been measured.',
    ['/pt-floor-audit', '/lambda-01758354-candidate']),
  R(3, 'A', 'Λ', 'Three-point correlated probes',
    "Raymond's surplus terms cannot hit worst cases at two translations at once; extend to three or more translations.",
    'Exploits correlation between probes, which single-probe worst-case bounds discard; not a barrier-slack tightening.'),
  R(4, 'A', 'Λ', 'Fejér–Riesz certificate for the weak outer lemma',
    'Sum-of-squares (Fejér–Riesz) certificate for the weak outer lemma on the outer torus, replacing box/cone bounds on P47.',
    'Replaces the late-cell majorant itself (the binding input of route P) with an exact positivity certificate; the box/cone bounds are what currently leave the 0.0533 margin.',
    ['/lambda-bounds']),
  R(5, 'A', 'Λ', 'Many barriers',
    'Certify compact-slab barriers at several abscissas X_k (10-minute runs) and use them to split the band argument into more bands.',
    'Changes the band architecture (more cut points), not the slack of one barrier; each slab is a cheap local certificate.'),
  R(6, 'A', 'Λ', 'Sparse verification theorem',
    'Which minimal set of local RH windows (62 CPU-s each with FLINT) can stand in for contiguous verification in Lemma B-type band arguments?',
    'Asks for a replacement of contiguous verified height by sparse local windows; contiguous paid verification is the closed class, sparse windows are not.'),
  R(7, 'A', 'Λ', 'Time-dependent mollifiers',
    'Time-dependent mollifiers in the barrier and source floors (mollifier that changes with t).',
    'The fixed-height mollifier lever is capped near 0.174; a t-dependent mollifier is outside that measurement.'),
  R(8, 'A', 'Λ', 'Hybrid schedule',
    'Polymath fixed-time on one height band, Raymond decreasing barrier on another, joined by a certified barrier.',
    'Combines two existing architectures on disjoint bands; neither single architecture is the object of a closed no-go.'),
  R(9, 'A', 'Λ', 'Optimised barrier schedule y(t)',
    'Optimise the barrier schedule y(t) as a piecewise function with the exact consumer in the loop (gradient-free search, then certify the winner).',
    'Searches the schedule with the exact consumer rather than tightening a fixed schedule; the winner must still be certified.'),
  R(10, 'A', 'tool', "Lean core of Raymond's chain",
    "Formalise the core of Raymond's chain (G0) in Lean, starting with the C_g identity and Lemma R, to reduce dependence on external referees.",
    'Infrastructure: reduces referee dependence of existing results; makes no new mathematical claim.'),

  // B. Weil positivity and the Connes programme
  R(11, 'B', 'map', 'Multi-prime Toeplitz–Krein past ln 3',
    'Multi-prime Toeplitz–Krein certificate past ln 3 (to ln 4, ln 5): a zero-free method that keeps working when the prime 3 enters.',
    'Route I is closed as a road past 2a = 7.76; this asks a bounded question (supports ln 4, ln 5) about a zero-free certificate method, mapping where it stops.'),
  R(12, 'B', 'RH', 'Semilocal trace identity for S = {∞, 2, 3}',
    'Exact semilocal trace identity for S = {∞, 2, 3}; measure whether the remainder share falls as primes are added.',
    'The S = {∞, 2} identity exists with a remainder of 96.7–99.7% of the trace; whether the share falls with more primes has not been measured.'),
  R(13, 'B', 'RH', 'Lacunary / Müntz-incomplete cones',
    'Positivity on lacunary or Müntz-incomplete test-function cones: the one loophole NS-RIGID leaves inside the native span (its A6 remark).',
    'NS-RIGID itself names this cone as outside its hypotheses (A6 remark).'),
  R(14, 'B', 'map', 'Family Weil positivity',
    'Average over twists by Dirichlet characters, where symmetry-type averaging may make positivity provable at larger support.',
    'Family averages change the object (a mean over L-functions), which the single-function no-gos do not cover.'),
  R(15, 'B', 'map', 'Euler-blindness radius for Epstein twins',
    'Euler-blindness radius for other same-gamma-factor twins (Epstein zeta functions with class number > 1), mapping at what support the Euler product is first detected.',
    'A measurement of where Euler-product detection starts; extends the Davenport–Heilbronn comparison to other twins.'),

  // C. Proportion and mollifiers
  R(16, 'C', 'RH', 'Alpöge–Furman ≥ 2/3 in twin-ladder terms',
    'Reproduce the Alpöge–Furman ≥ 2/3 argument numerically and translate it into twin-ladder terms.',
    'Proportion input is the one input NS-RIGID leaves open.',
    ['/critical-line-proportion', '/twin-ladder']),
  R(17, 'C', 'map', 'Mollifiers beyond θ = 4/7',
    'Numerical sanity of longer mollifier lengths beyond θ = 4/7 (twisted second moments), at heights we can compute.',
    'A numerical map of an unproved regime; makes no claim that the regime holds.',
    ['/critical-line-proportion']),
  R(18, 'C', 'map', 'Local Levinson under pair correlation',
    "Local Levinson conditional on pair correlation: how short a window becomes certifiable if Montgomery's conjecture is assumed.",
    'Unconditional local Levinson is closed; this measures the conditional version, labelled as conditional.',
    ['/pair-correlation']),
  R(19, 'C', 'RH', 'Mollified Weil forms',
    'Combine a Levinson mollifier with Weil test functions in one quadratic form.',
    'Mixes the two inputs into one form; each alone has a recorded wall, the combined form does not.'),

  // D. Heat flow and the fluid picture
  R(20, 'D', 'Λ', 'Effective Ki–Kim–Lee',
    'Make "all but finitely many zeros of H_t are real" explicit with constants, to replace part of the verified-height input.',
    'Arithmetic input (effective constants), not a soft flow hypothesis; the flow-blindness no-go covers soft hypotheses only.',
    ['/flow-blindness-no-go']),
  R(21, 'D', 'map', 'Entropy functional for the zero flow',
    'Entropy-type Lyapunov functional for the zero flow (Burgers entropy inequality) beyond the pair law.',
    'Maps what flow functionals can see; flow-blindness bounds the outcome, so the route is tagged map.'),
  R(22, 'D', 'Λ', 'Lehmer-pair hunt at large height',
    'Lehmer-pair hunt at large height to push the lower bound side (Λ ≥ −ε records).',
    'Lower-bound side; none of the closed classes concern Λ ≥ 0 records.'),
  R(23, 'D', 'map', 'H_t dynamics vs Dyson Brownian motion',
    "Compare H_t zero dynamics with Dyson Brownian motion on Odlyzko's high zeros, looking for arithmetic deviations.",
    'A measurement of arithmetic deviations; makes no claim about Λ.'),
  R(24, 'D', 'Λ', 'Mean-field descent with local zero counts',
    'Mean-field descent with an improved local zero-count bound at t > 0, where the effective approximation controls the argument.',
    'Mirror descent is closed at t = 0; this uses a t > 0 local count where the effective approximation applies.'),

  // E. Twin ladder and bridge model
  R(25, 'E', 'map', 'Bridge as scattering',
    'Lax–Phillips / Pavlov–Faddeev picture for the modular surface; compute resonance motion under bridge deformations.',
    'A model computation on the modular surface; makes no claim about ζ zeros.',
    ['/freezing-bridge']),
  R(26, 'E', 'map', 'Twin ladder for GL(2)',
    'Twin ladder for GL(2) L-functions where Ramanujan is known: find which ladder statements become provable there.',
    'Tests the ladder where an extra theorem (Ramanujan) is available; maps which rungs it buys.',
    ['/twin-ladder']),
  R(27, 'E', 'RH', 'Function-field twin ladder',
    'Build the ladder for curves over F_q (RH proved) and identify the ladder property that encodes the Weil-conjecture proof; attempt the lift.',
    'Works where RH is a theorem (Weil), so the ladder property that holds there can be identified directly; the closed ladder classes were derived for ζ, not for curves over F_q.',
    ['/twin-ladder']),
  R(28, 'E', 'map', 'Freeze calculus on Selberg zeta',
    'Freeze calculus on the Selberg zeta function as a sandbox where an RH analogue holds.',
    'Sandbox with a known RH analogue; maps which freeze statements survive.'),
  R(29, 'E', 'map', 'Interferometer visibility functional',
    'Test whether a finite-height visibility bound gives an RH-equivalent or a genuinely weaker statement.',
    'Classifies one functional against RH; not yet placed in any closed class.'),
  R(30, 'E', 'RH', 'Finite-support Euler detector',
    'A ladder-native quantity that separates ζ from Davenport–Heilbronn at support below 3.44.',
    'Any RH route must detect the Euler product; this asks for a detector at a support where none is recorded yet.'),

  // F. Spectral and Hilbert–Pólya
  R(31, 'F', 'map', 'Berry–Keating xp, regularised',
    'Berry–Keating xp with Connes or Sierra regularisations, tested against the first 10^5 zeros.',
    'Numerical test of a spectral model; not a proof route.'),
  R(32, 'F', 'map', 'Inverse spectral potential',
    'Inverse spectral potential reproducing the zeros (Wu–Sprung type) and its regularity.',
    'Measures regularity of a reconstructed potential; not a proof route.'),
  R(33, 'F', 'map', 'Arithmetic corrections to RMT statistics',
    'Arithmetic corrections to random-matrix statistics (Bogomolny–Keating) on high zeros: detect the prime signal.',
    'Detection of a known predicted correction; a measurement.',
    ['/pair-correlation']),
  R(34, 'F', 'map', 'de Branges Hamiltonian for ξ',
    'de Branges canonical-system Hamiltonian for ξ computed numerically (Lagarias); study its mass positivity.',
    'Numerical study of one structure; makes no claim about de Branges positivity in general.'),
  R(35, 'F', 'map', 'Certified Li coefficients',
    'Certified Li coefficients to large n, compared with Keiper–Li asymptotics.',
    'Certified finite data; RH-equivalence needs all n, so this maps behaviour only.',
    ['/rh-equivalents']),

  // G. Cheap local computation
  R(36, 'G', 'map', 'Random local windows at 10^13–10^20',
    "Random local windows at heights 10^13–10^20 with FLINT's Platt code: exploratory search for anomalies.",
    'Local windows (62 CPU-s each), not contiguous paid verification.'),
  R(37, 'G', 'map', 'Gram-law violation statistics',
    'Gram-law violation statistics as a model of barrier difficulty at large height.',
    'A statistical model of barrier cost; a measurement.',
    ['/gram-points']),
  R(38, 'G', 'Λ', 'Barrier slab at higher X',
    'Certify the barrier slab at higher X to test how the floor-lowering result scales with height.',
    'Extends the 2026-10-06 floor-lowering certificate to new heights; local, cheap, not paid verification.',
    ['/pt-floor-audit']),

  // H. Formalisation and AI-assisted proof
  R(39, 'H', 'tool', 'Lean: Weil explicit formula + Yoshida',
    'Lean: Weil explicit formula plus small-support positivity (Yoshida).',
    'Infrastructure; formalises known theorems.'),
  R(40, 'H', 'tool', 'Aristotle on WOL and BB1/BB2',
    'Aristotle runs on the weak outer lemma and the band barriers BB1/BB2.',
    'Infrastructure; machine-checks lemmas already in the route-P ledger.'),
  R(41, 'H', 'tool', 'Lean replay of Arb certificates',
    'Lean checking of Arb certificates via certificate replay.',
    'Infrastructure; moves certified results toward machine-checked ones.'),

  // I. Structural no-gos
  R(42, 'I', 'map', 'Formal MV-CAP theorem',
    'Formal MV-CAP theorem: mean-value inputs cannot certify every-window statements.',
    'States a no-go as a theorem; maps a class, does not attempt RH.',
    ['/no-gos']),
  R(43, 'I', 'map', 'Flow-criticality classes',
    'Classify inputs by degree of flow-criticality; look for an intermediate class between soft and RH.',
    'Refines the flow-blindness dichotomy rather than contradicting it.',
    ['/flow-blindness-no-go']),
  R(44, 'I', 'map', 'Euler-detection depth across conductors',
    'Euler-detection depth against support across many conductors.',
    'A measurement across conductors; extends route 15 and route 30 data.'),

  // J. Creative
  R(45, 'J', 'map', 'Multiplicative chaos for source-floor tails',
    'Multiplicative-chaos models of ζ on the line (Saksman–Webb) to predict source-floor tails.',
    'A prediction model for an input of the Λ chain; not itself a certificate.'),
  R(46, 'J', 'Λ', 'Exact Kronecker floors',
    'Kronecker floors as exact Bohr–Jessen extrema: for finitely many primes the torus supremum is deterministic, so compute it exactly instead of bounding it.',
    'Replaces a bound on a finite-prime torus extremum by its exact value, a different computation from the bounds behind the current certified source floors (the 0.75 vs 0.53 gap).'),
  R(47, 'J', 'Λ', 'Learned adversaries',
    'Train a surrogate to search for weak-outer-lemma violations and hard cells, guiding where certificates must be tight.',
    'A search aid; every result it guides still needs an interval certificate.'),
  R(48, 'J', 'map', 'Phase retrieval for ζ',
    'How much of ζ is determined by |ζ| on vertical lines (the Hilbert-transform wall made quantitative).',
    'Quantifies a recorded wall; a map.'),
  R(49, 'J', 'Λ', 'Unconditional S(T) constants',
    'Unconditional S(T) constants via extremal (Beurling–Selberg) functions computed with our engines; better constants feed local zero counting and descent arguments.',
    'Improves a constant used by several routes (local zero counting, descent); unconditional input, not verified height.'),
  R(50, 'J', 'Λ', 'Verified-height-free Λ curve',
    'Λ as a function of the constants in an effective Ki–Kim–Lee theorem.',
    'Expresses Λ through effective constants (route 20) instead of verified height; an arithmetic input, outside flow-blindness.'),
]);

export const RESEARCH_ROUTES_META = Object.freeze({
  date: '2026-10-06',
  source: 'formalization/routes/fifty-routes-2026-10-06.md',
  frame: 'Fifty experimental routes built from the project results to date. Each states what it tries and why it is not one of the closed classes.',
  closedClasses: Object.freeze([
    'flow-blindness', 'NS-RIGID', 'Theorem U', 'T3 = strip', 'stat-mech routes A–H (2026-09-23)',
    'Route I as a road past 2a = 7.76', 'mirror descent', 'local Levinson', 'paid verification',
  ]),
  statusNote: 'PT Λ ≤ 0.2 is the accepted benchmark. Project results are internal-referee only; 0.1758354 and 0.1787854 are computer-assisted candidates. RH is open. A route status records work state, not a mathematical outcome.',
});

const TAGS = Object.keys(RESEARCH_ROUTE_TAGS);
const GROUP_RANGES = { A: [1, 10], B: [11, 15], C: [16, 19], D: [20, 24], E: [25, 30], F: [31, 35], G: [36, 38], H: [39, 41], I: [42, 44], J: [45, 50] };
// Tags as written in the source file, by route id.
const SOURCE_TAGS = 'ΛΛΛΛΛΛΛΛΛT' + 'mRRmm' + 'RmmR' + 'ΛmΛmΛ' + 'mmRmmR' + 'mmmmm' + 'mmΛ' + 'TTT' + 'mmm' + 'mΛΛmΛΛ';
const TAG_CODE = { 'Λ': 'Λ', R: 'RH', m: 'map', T: 'tool' };

export const RESEARCH_ROUTES_ASSERTIONS = Object.freeze([
  {
    id: 'rr-fifty-unique-ids',
    holds: () => RESEARCH_ROUTES.length === 50 && new Set(RESEARCH_ROUTES.map((r) => r.id)).size === 50
      && RESEARCH_ROUTES.every((r, i) => r.id === i + 1),
    why: 'Exactly 50 routes with unique ids 1..50 in source order.',
  },
  {
    id: 'rr-valid-tags-status',
    holds: () => RESEARCH_ROUTES.every((r) => TAGS.includes(r.tag) && RESEARCH_ROUTE_STATUSES.includes(r.status)),
    why: "Every tag is one of 'Λ' | 'RH' | 'map' | 'tool'; every status is planned | in progress | partial | done | blocked.",
  },
  {
    id: 'rr-tags-match-source',
    holds: () => SOURCE_TAGS.length === 50 && RESEARCH_ROUTES.every((r, i) => r.tag === TAG_CODE[SOURCE_TAGS[i]]),
    why: 'Tags match the [Λ]/[RH]/[map]/[tool] tags of the source file route by route.',
  },
  {
    id: 'rr-groups',
    holds: () => RESEARCH_ROUTES.every((r) => {
      const g = GROUP_RANGES[r.group];
      return g && r.id >= g[0] && r.id <= g[1] && r.groupName === RESEARCH_ROUTE_GROUPS[r.group];
    }) && Object.keys(RESEARCH_ROUTE_GROUPS).join('') === 'ABCDEFGHIJ',
    why: 'Groups A–J cover the source id ranges (A 1–10, B 11–15, C 16–19, D 20–24, E 25–30, F 31–35, G 36–38, H 39–41, I 42–44, J 45–50).',
  },
  {
    id: 'rr-batch-1',
    holds: () => {
      const b1 = RESEARCH_ROUTES.filter((r) => r.batch === 1).map((r) => r.id).sort((a, b) => a - b).join(',');
      const fp = RESEARCH_ROUTES.filter((r) => r.firstPick).map((r) => r.id).sort((a, b) => a - b).join(',');
      return b1 === '1,2,27,46,49' && fp === b1 && RESEARCH_ROUTE_FIRST_PICKS.map((p) => p.id).join(',') === '2,1,46,27,49'
        && RESEARCH_ROUTES.every((r) => [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, null].includes(r.batch));
    },
    why: 'Batch 1 = first picks = routes 2, 1, 46, 27, 49; batches 2–10 are the only other batches; the rest are null.',
  },
  {
    id: 'rr-batch-2',
    holds: () => RESEARCH_ROUTES.filter((r) => r.batch === 2).map((r) => r.id).join(',') === '3,4,5,6,20'
      && RESEARCH_ROUTES.filter((r) => r.batch === 2).every((r) => r.status === 'done' && !r.firstPick && typeof r.result === 'string'
        && r.result.length > 40 && r.resultModule.startsWith(`src/data/route-${r.id}-`) && r.resultModule.endsWith('-2026-10-07.js')),
    why: 'Batch 2 = routes 3, 4, 5, 6, 20, all done (2026-10-07), each with a one-sentence result and a route-<id>-*-2026-10-07.js module.',
  },
  {
    id: 'rr-batch-3',
    holds: () => RESEARCH_ROUTES.filter((r) => r.batch === 3).map((r) => r.id).join(',') === '7,8,9,38,50'
      && RESEARCH_ROUTE_BATCH_3.join(',') === '7,8,9,38,50'
      && RESEARCH_ROUTES.filter((r) => r.batch === 3).every((r) => r.status === 'done' && !r.firstPick && typeof r.result === 'string'
        && r.result.length > 40 && r.resultModule.startsWith(`src/data/route-${r.id}-`) && r.resultModule.endsWith('-2026-10-08.js')),
    why: 'Batch 3 = routes 7, 8, 9, 38, 50, all done (2026-10-08), each with a one-sentence result and a route-<id>-*-2026-10-08.js module.',
  },
  {
    id: 'rr-batch-4',
    holds: () => RESEARCH_ROUTES.filter((r) => r.batch === 4).map((r) => r.id).join(',') === '11,12,13,14,15'
      && RESEARCH_ROUTE_BATCH_4.join(',') === '11,12,13,14,15'
      && RESEARCH_ROUTES.filter((r) => r.batch === 4).every((r) => r.status === 'done' && !r.firstPick && r.group === 'B' && typeof r.result === 'string'
        && r.result.length > 40 && r.resultModule.startsWith(`src/data/route-${r.id}-`) && r.resultModule.endsWith('-2026-10-09.js')),
    why: 'Batch 4 = routes 11, 12, 13, 14, 15 (group B, Weil positivity and the Connes programme), all done (2026-10-09), each with a one-sentence result and a route-<id>-*-2026-10-09.js module.',
  },
  {
    id: 'rr-batch-5',
    holds: () => RESEARCH_ROUTES.filter((r) => r.batch === 5).map((r) => r.id).join(',') === '16,17,18,19,42'
      && RESEARCH_ROUTE_BATCH_5.join(',') === '16,17,18,19,42'
      && RESEARCH_ROUTES.filter((r) => r.batch === 5).every((r) => ['done', 'partial'].includes(r.status) && !r.firstPick && typeof r.result === 'string'
        && r.result.length > 40 && r.resultModule.startsWith(`src/data/route-${r.id}-`) && r.resultModule.endsWith('-2026-10-10.js'))
      && RESEARCH_ROUTES.filter((r) => r.batch === 5).map((r) => r.status).join(',') === 'done,done,done,done,partial'
      && RESEARCH_ROUTES.filter((r) => r.batch === 5).map((r) => r.group).join('') === 'CCCCI',
    why: 'Batch 5 = routes 16, 17, 18, 19 (group C, proportion and mollifiers) done and 42 (group I, formal MV-CAP) partial (2026-10-10), each with a one-sentence result and a route-<id>-*-2026-10-10.js module.',
  },
  {
    id: 'rr-batch-6',
    holds: () => RESEARCH_ROUTES.filter((r) => r.batch === 6).map((r) => r.id).join(',') === '21,22,23,24,37'
      && RESEARCH_ROUTE_BATCH_6.join(',') === '21,22,23,24,37'
      && RESEARCH_ROUTES.filter((r) => r.batch === 6).every((r) => ['done', 'partial'].includes(r.status) && !r.firstPick && typeof r.result === 'string'
        && r.result.length > 40 && r.resultModule.startsWith(`src/data/route-${r.id}-`) && r.resultModule.endsWith('-2026-10-11.js'))
      && RESEARCH_ROUTES.filter((r) => r.batch === 6).map((r) => r.status).join(',') === 'done,done,partial,done,done'
      && RESEARCH_ROUTES.filter((r) => r.batch === 6).map((r) => r.group).join('') === 'DDDDG',
    why: 'Batch 6 = routes 21, 22, 24 (group D) done, 23 (group D) partial and 37 (group G, Gram-law statistics) done (2026-10-11), each with a one-sentence result and a route-<id>-*-2026-10-11.js module.',
  },
  {
    id: 'rr-batch-7',
    holds: () => RESEARCH_ROUTES.filter((r) => r.batch === 7).map((r) => r.id).join(',') === '25,26,28,29,30'
      && RESEARCH_ROUTE_BATCH_7.join(',') === '25,26,28,29,30'
      && RESEARCH_ROUTES.filter((r) => r.batch === 7).every((r) => r.status === 'done' && !r.firstPick && typeof r.result === 'string'
        && r.result.length > 40 && r.resultModule.startsWith(`src/data/route-${r.id}-`) && r.resultModule.endsWith('-2026-10-12.js'))
      && RESEARCH_ROUTES.filter((r) => r.batch === 7).map((r) => r.group).join('') === 'EEEEE',
    why: 'Batch 7 = routes 25, 26, 28, 29, 30 (group E, twin ladder and bridge model; route 27 was a first pick), all done (2026-10-12), each with a one-sentence result and a route-<id>-*-2026-10-12.js module.',
  },
  {
    id: 'rr-batch-8',
    holds: () => RESEARCH_ROUTES.filter((r) => r.batch === 8).map((r) => r.id).join(',') === '31,32,33,34,35'
      && RESEARCH_ROUTE_BATCH_8.join(',') === '31,32,33,34,35'
      && RESEARCH_ROUTES.filter((r) => r.batch === 8).every((r) => r.status === 'done' && !r.firstPick && typeof r.result === 'string'
        && r.result.length > 40 && r.resultModule.startsWith(`src/data/route-${r.id}-`) && r.resultModule.endsWith('-2026-10-13.js'))
      && RESEARCH_ROUTES.filter((r) => r.batch === 8).map((r) => r.group).join('') === 'FFFFF',
    why: 'Batch 8 = routes 31, 32, 33, 34, 35 (group F, spectral and Hilbert–Pólya), all done (2026-10-13), each with a one-sentence result and a route-<id>-*-2026-10-13.js module.',
  },
  {
    id: 'rr-batch-9',
    holds: () => RESEARCH_ROUTES.filter((r) => r.batch === 9).map((r) => r.id).join(',') === '10,36,39,40,41,43'
      && RESEARCH_ROUTE_BATCH_9.join(',') === '10,36,39,40,41,43'
      && RESEARCH_ROUTES.filter((r) => r.batch === 9).every((r) => ['done', 'partial'].includes(r.status) && !r.firstPick && typeof r.result === 'string'
        && r.result.length > 40 && r.resultModule.startsWith(`src/data/route-${r.id}-`) && r.resultModule.endsWith('-2026-10-14.js'))
      && RESEARCH_ROUTES.filter((r) => r.batch === 9).map((r) => r.status).join(',') === 'partial,done,partial,partial,done,done'
      && RESEARCH_ROUTES.filter((r) => r.batch === 9).map((r) => r.group).join('') === 'AGHHHI',
    why: 'Batch 9 = routes 10 (group A, Lean core of Raymond\'s chain) partial, 36 (group G) done, 39, 40 (group H) partial, 41 (group H) done and 43 (group I) done (2026-10-14), each with a one-sentence result and a route-<id>-*-2026-10-14.js module.',
  },
  {
    id: 'rr-batch-10',
    holds: () => RESEARCH_ROUTES.filter((r) => r.batch === 10).map((r) => r.id).join(',') === '44,45,47,48'
      && RESEARCH_ROUTE_BATCH_10.join(',') === '44,45,47,48'
      && RESEARCH_ROUTES.filter((r) => r.batch === 10).every((r) => r.status === 'done' && !r.firstPick && typeof r.result === 'string'
        && r.result.length > 40 && r.resultModule.startsWith(`src/data/route-${r.id}-`) && r.resultModule.endsWith('-2026-10-15.js'))
      && RESEARCH_ROUTES.filter((r) => r.batch === 10).map((r) => r.group).join('') === 'IJJJ',
    why: 'Batch 10 = routes 44 (group I, Euler-detection depth across conductors), 45, 47, 48 (group J: multiplicative chaos, learned adversaries, phase retrieval), all done (2026-10-15), each with a one-sentence result and a route-<id>-*-2026-10-15.js module.',
  },
  {
    id: 'rr-route-1-campaign',
    holds: () => { const r = RESEARCH_ROUTES[0]; const c = r.campaign;
      return r.status === 'in progress' && c !== null && c.floors.budgetStopped === 13 && c.floors.missing === 125
        && Object.values(c.floors.missingByFamily).reduce((a, b) => a + b, 0) === c.floors.missing && c.eta.grade === 'heuristic'
        && /not certified/.test(c.note) && /not certified/.test(r.result) && RESEARCH_ROUTES.filter((x) => x.campaign !== null).length === 1
        && /conditional/.test(c.qrhPathNote) && /not a bound/.test(c.qrhPathNote) && /NOT appended/.test(c.qrhPathNote); },
    why: 'Route 1 is in progress with one recorded campaign: 13 budget-stopped + 125 missing floors (47 + 32 + 29 + 17), heuristic ETA, Λ < 0.145 not certified.',
  },
  {
    id: 'rr-batch-1-recorded',
    holds: () => RESEARCH_ROUTES.filter((r) => r.batch === 1).every((r) => ['done', 'partial', 'blocked', 'in progress'].includes(r.status)
        && r.resultModule.startsWith(`src/data/route-${r.id}-`) && r.resultModule.endsWith('-2026-10-06.js')
        && typeof r.result === 'string' && r.result.length > 40)
      && RESEARCH_ROUTES.filter((r) => r.result !== null).length === 50
      && ['1:in progress', '2:done', '27:done', '46:partial', '49:done'].every((x) => { const [i, s] = x.split(':'); return RESEARCH_ROUTES[Number(i) - 1].status === s; }),
    why: 'Batch 1 recorded: routes 2, 27, 49 done; 46 partial; 1 in progress (campaign running); each with a one-sentence result and a route-<id>-*-2026-10-06.js module; all 50 routes carry results (batches 1–10).',
  },
  {
    id: 'rr-result-fields',
    holds: () => RESEARCH_ROUTES.every((r) => (['done', 'partial'].includes(r.status) ? r.result !== null && r.resultModule !== null : true)
      && (r.resultModule === null || /^src\/data\/.+\.js$/.test(r.resultModule))
      && (r.resultPage === null || /^\/[a-z0-9-]+$/.test(r.resultPage))
      && typeof r.title === 'string' && r.title && typeof r.summary === 'string' && r.summary
      && typeof r.whyNotClosed === 'string' && r.whyNotClosed),
    why: "A 'done' or 'partial' route carries a result and a result module; every route has title, summary and whyNotClosed.",
  },
  {
    id: 'rr-no-qed-language',
    holds: () => !RESEARCH_ROUTES.some((r) => /\b(proves RH|RH proved for ζ|QED)\b/.test(`${r.summary} ${r.whyNotClosed} ${r.result ?? ''}`)),
    why: 'No route text claims a proof of RH.',
  },
]);

for (const a of RESEARCH_ROUTES_ASSERTIONS) {
  if (!a.holds()) throw new Error(`research-routes-roadmap assertion failed: ${a.id} — ${a.why}`);
}
