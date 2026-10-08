/**
 * @fileoverview qrh-theta-and-improvement-2026-10-08 — two follow-ups to the conditional Λ value on the 7/8 path:
 * (1) the conditional Λ(θ) curve: what Raymond's chain and the re-tuned route-P consumer give at PT height if ζ has no zeros
 *     with Re s > θ, for θ on a grid in [0.505, 0.875] (every θ other than 7/8 is hypothetical);
 * (2) two attempts (A and B) to improve the openai/math family-003 exponent 7/8 itself.
 * One adversarial internal referee pass on each of the three results (none refuted, all minor); the referee corrections are
 * applied here. Parent records: src/data/qrh-path-push-2026-10-08.js, src/data/openai-math-integration-2026-10-08.js.
 *
 * PROVED (elementary / algebra from the manuscript's displayed formulas, internal, unrefereed):
 *  - probe boundary of the 7/8 manuscript: σ0 = 5/6 + (M − 2ℓ)/12 = 5/6 + (l_x − ℓ)/6 + b/12; on M + ℓ = 1, σ0 = 11/12 − ℓ/4;
 *    (M, ℓ) = (5/6, 1/6) gives 7/8, (1, 0) gives 11/12;
 *  - with PT, a height-dependent region lowers the barrier start q0 only if sup_{γ > X/2} θ(γ) < 7/8, which is the same as a
 *    global half-plane Re s > θ' with θ' < 7/8; so a height-dependent region is not an easier target;
 *  - the 7/8 proof contains the 11/12 method (11/12 paper Prop 3.1 = 7/8 paper eq. (17.87); sixth-power amplification = Lemma 17.6).
 * CERTIFIED (exact arithmetic):
 *  - Λ(θ) values below: exact rationals from the Raymond-chain consumer (two endpoint implementations agree; referee's
 *    independent 192-bit arb integrator reproduces all 14 PT values) and from the route-P consumer + two step verifiers;
 *  - closing arithmetic of attempt A's re-tuned geometry ℓ = 5003/30000, M = 1 − ℓ, b = 1/8 (σ0 = 34999/40000), including a
 *    Sturm-count certificate for Lemma 20.2' (−E* ≥ 1/20000);
 *  - barrier formulas of the closing-exponent model: 167/192 (floor 51/100) and 13/15 (floor → 1/2) with density-hypothesis counts.
 * CONDITIONAL: every Λ value here (half-plane at θ — hypothetical except 7/8; Raymond's chain G0, internal review only; PT; for
 *  route-P the route-P ledger). Attempt A's 34999/40000 is conditional on re-using the manuscript's lemmas at a new geometry
 *  (plausible, not established; not Lean-checked) and must NOT be used as a zero-free region or in the Λ pipeline.
 * MEASURED: slopes, height levers, contraction shares, re-tuning optima, lever scenarios (floating-point optimisation on a model).
 * HEURISTIC: the linear fit, "7/8 is a rounded choice", Gram-loss-as-main-term, duality sketch for the 11/12 method.
 *
 * PT Lambda <= 0.2 stands; RH is open; NO QED. Import-free. QRH_THETA_IMPROVEMENT_ASSERTIONS recompute decimals, de Bruijn
 * values, monotonicity, route-P gains, contraction shares, boundary formulas and barrier closed forms in exact rationals.
 */

const big = (s) => { const [a, b] = String(s).split('/'); return [BigInt(a), BigInt(b ?? '1')]; };
const gcd = (a, b) => { a = a < 0n ? -a : a; b = b < 0n ? -b : b; while (b) [a, b] = [b, a % b]; return a; };
const norm = ([a, b]) => { if (b < 0n) { a = -a; b = -b; } const g = gcd(a, b) || 1n; return [a / g, b / g]; };
const q = (x) => (Array.isArray(x) ? x : big(x));
const cmp = (x, y) => { const [a, b] = q(x), [c, d] = q(y); const l = a * d, r = c * b; return l < r ? -1 : l > r ? 1 : 0; };
const lt = (x, y) => cmp(x, y) < 0;
const eq = (x, y) => cmp(x, y) === 0;
const sub = (x, y) => { const [a, b] = q(x), [c, d] = q(y); return norm([a * d - c * b, b * d]); };
const add = (x, y) => { const [a, b] = q(x), [c, d] = q(y); return norm([a * d + c * b, b * d]); };
const mul = (x, y) => { const [a, b] = q(x), [c, d] = q(y); return norm([a * c, b * d]); };
const div = (x, y) => { const [a, b] = q(x), [c, d] = q(y); return norm([a * d, b * c]); };
const dec15 = (x) => { const [a, b] = q(x); const n = a * 10n ** 15n; return n % b === 0n ? `0.${String(n / b).padStart(15, '0')}` : null; };
const num = (x) => { const [a, b] = q(x); return Number(a * 10n ** 18n / b) / 1e18; };
const deBruijn = (theta) => { const s = sub(mul('2', theta), '1'); return div(mul(s, s), '2'); };

// Raymond chain at PT height (X1, x = 6.0e12), q0 = (2θ−1)² + 2e-6. sharpSubsteps = substeps using Raymond AF Part II Thm 1.
const R = (theta, U, dec, lastRow, share, sharpSubsteps) => Object.freeze({ theta, U, dec, lastRow, share, sharpSubsteps });

export const QRH_THETA_IMPROVEMENT = Object.freeze({
  id: 'qrh-theta-and-improvement-2026-10-08',
  date: '2026-10-08',
  title: 'Conditional Λ against the zero-free abscissa θ, and two attempts to improve the 7/8 half-plane',
  status: 'done',
  parents: Object.freeze(['src/data/qrh-path-push-2026-10-08.js', 'src/data/openai-math-integration-2026-10-08.js']),
  headline: 'At PT height a better zero-free half-plane converts almost directly into a better conditional Λ: about 0.003 of Λ per 0.01 of θ near 7/8 '
    + '(Raymond chain 0.111178 at θ = 0.85, 0.095022 at 0.80; re-tuned route-P 0.108886 and 0.093069). No chain constraint binds for θ ≤ 7/8. '
    + 'No rigorous improvement of 7/8 itself was found: re-tuning the manuscript\'s geometry gains about 4.3e-5 in θ (model optimum 0.8749571; '
    + 'exact closing arithmetic for 34999/40000, conditional on re-used lemmas), and the method cannot go below 13/15 even with density-hypothesis counts. '
    + 'All Λ values are conditional, not bounds. PT Lambda <= 0.2 stands; RH is open; NO QED.',

  // ── (1) the Λ(θ) curve ────────────────────────────────────────────────────
  theta: Object.freeze({
    method: 'tmp/oai-lambda-raymond.py X1 --alt over a θ grid (tmp/qrh-theta-curve-raymond.sh); route-P via tmp/qrh-theta-curve-routeP.sh (F2 configuration, q0 = (2θ−1)² + 1e-7) and the step verifier tmp/qrh-tune-verify.py; table tmp/qrh-theta-curve-out/table.json.',
    raymondPT: Object.freeze([
      R('7/8', '118505710922701/1000000000000000', '0.118505710922701', 474, 0.5786, 0),
      R('43/50', '57083652654079/500000000000000', '0.114167305308158', 456, 0.5595, 124),
      R('17/20', '55588925440021/500000000000000', '0.111177850880042', 444, 0.5462, 270),
      R('21/25', '6756871713629/62500000000000', '0.108109947418064', 432, 0.5324, 571),
      R('41/50', '6358282847349/62500000000000', '0.101732525557584', 406, 0.5033, 1944),
      R('4/5', '5938882831221/62500000000000', '0.095022125299536', 380, 0.4721, 3078),
      R('39/50', '43991948911187/500000000000000', '0.087983897822374', 351, 0.4389, 2869),
      R('3/4', '15365087116223/200000000000000', '0.076825435581115', 307, 0.3854, 1372),
      R('7/10', '28474625469199/500000000000000', '0.056949250938398', 227, 0.2881, 0),
      R('13/20', '18311272879037/500000000000000', '0.036622545758074', 146, 0.1862, 0),
      R('3/5', '1814934587641/100000000000000', '0.018149345876410', 72, 0.0926, 0),
      R('11/20', '1219088138853/250000000000000', '0.004876352555412', 19, 0.0249, 0),
      R('13/25', '797732865289/1000000000000000', '0.000797732865289', 3, 0.0041, 0),
      R('101/200', '25493347487/500000000000000', '0.000050986694974', 0, 0.0003, 0),
    ]),
    routePPT: Object.freeze([
      Object.freeze({ theta: '7/8', U: '116091488672439/1000000000000000', dec: '0.116091488672439', steps: 59439, cell: 464, strictEntry: 1.808e-8, source: 'existing F2 run (qrh-path-push); not re-run' }),
      Object.freeze({ theta: '17/20', U: '21777271209277/200000000000000', dec: '0.108886356046385', steps: 55750, cell: 435, strictEntry: 2.597e-8, source: 'routeP_t85: consumer + step verifier, 0 failures; referee re-ran the 2026-10-07 from-scratch verifier and a 640-bit dump check, 0 failures' }),
      Object.freeze({ theta: '4/5', U: '2908415146281/31250000000000', dec: '0.093069284680992', steps: 47652, cell: 372, strictEntry: 4.02e-8, source: 'routeP_t80: consumer + step verifier, 0 failures; referee re-ran the from-scratch verifier and a 640-bit dump check, 0 failures' }),
    ]),
    // Raymond chain, change in U from PT (X1) to X1000 (1000× PT, what-if) and to XL25 (x = 2.5e12, below PT).
    heightLever: Object.freeze([
      Object.freeze({ theta: '7/8', toX1000: -0.015890119642122, toXL25: 0.002807712106949 }),
      Object.freeze({ theta: '17/20', toX1000: -0.014240964682746, toXL25: 0.002460252204152 }),
      Object.freeze({ theta: '4/5', toX1000: -0.010824943240737, toXL25: 0.001766725287876 }),
      Object.freeze({ theta: '3/4', toX1000: -0.007435596566737, toXL25: 0.001138553538963 }),
      Object.freeze({ theta: '7/10', toX1000: -0.004325746835623, toXL25: 0.00062765611028 }),
      Object.freeze({ theta: '13/20', toX1000: -0.001900165714475, toXL25: 0.000262443227925 }),
      Object.freeze({ theta: '3/5', toX1000: -0.000493518304187, toXL25: 0.000065259453813 }),
      Object.freeze({ theta: '11/20', toX1000: -0.000037111224049, toXL25: 0.000004755002489 }),
    ]),
    // Referee direct runs settling "θ vs 10× height" at 7/8.
    rivalLever: Object.freeze({
      X10at78: '0.112235848057212', theta8535: '0.112233029447535', theta855: '0.112682656940557',
      statement: '10× verified height at 7/8 is worth a θ improvement of about 0.0215 (θ = 0.8535 at PT is just below the X10 value; θ = 0.855 is 4.47e-4 above it).',
    }),
    noSharp: Object.freeze({ '43/50': '0.114167306871069', '17/20': '0.111177858413529', '4/5': '0.095022411148551', '3/4': '0.076825501076697',
      note: 'Raymond chain with the AF Part II sharp continuum law disabled: at most 2.9e-7 higher, so the Part II premise can be dropped at no visible cost.' }),
    thetaFor: Object.freeze([
      Object.freeze({ target: '0.116091 (F2)', raymond: 0.8667 }),
      Object.freeze({ target: '0.11', raymond: 0.846 }),
      Object.freeze({ target: '0.10', raymond: 0.815, routeP: 0.82 }),
      Object.freeze({ target: '0.09', raymond: 0.786 }),
      Object.freeze({ target: '0.08', raymond: 0.759 }),
      Object.freeze({ target: '0.05', raymond: 0.683 }),
    ]),
    findings: Object.freeze([
      'U(θ) at PT height decreases strictly with θ on the whole grid; no plateau. Slope dU/dθ: 0.289 on 0.86–0.875, 0.307 on 0.84–0.85, 0.336 on 0.80–0.82, 0.372 on 0.75–0.78, peak 0.407 on 0.65–0.70, 0.265 on 0.55–0.60, 0.136 on 0.52–0.55, 0.050 on 0.505–0.52.',
      'No chain constraint binds for θ ≤ 7/8: the terminal cell falls with θ (474 at 7/8, 380 at 0.80, 227 at 0.70, 0 at 0.505) inside the 608-row plan; U stays below the 41/250 horizon; kernel availability never fails; kernel admissibility v = q/h² ≤ ρ² gets easier as q shrinks; per-row premises (k > 0, h·v0 > 2, producer moment cap) do not depend on θ.',
      'Mechanism: the chain solves q\' = −2 − rate·q from q0 = (2θ−1)² + offset. The share of the descent carried by the X-dependent contraction term, 1 − 2U/q0, is 0.579 at 7/8, 0.472 at 0.80, 0.288 at 0.70, 0.093 at 0.60, 0.025 at 0.55. Below about θ = 0.6, U is within 10% of the de Bruijn value (2θ−1)²/2, which uses no verified height.',
      'Verified height matters less as θ falls: X1 → X1000 gains 0.0159 at 7/8 but 0.0043 at 0.70 and 3.7e-5 at 0.55; going below PT (x = 2.5e12) costs 0.0028 at 7/8 and at most 0.00063 for θ ≤ 0.70.',
      'Route-P gain over the Raymond chain: 0.002414 at 7/8, 0.002291 at 0.85, 0.001953 at 0.80. The 0.85 and 0.80 runs reuse the height sets tuned on the 7/8 trajectory and could probably be pushed lower.',
    ]),
    refereeCorrections: Object.freeze([
      'T1: "a 0.02 improvement in θ beats 10× verified height" is false. Direct runs: θ = 0.855 gives 0.112682656940557, 4.47e-4 above the 7/8 X10 value 0.112235848057212; θ = 0.8535 gives 0.112233029447535. 10× height ≈ 0.0215 of θ; 0.025 of θ is worth more.',
      'T2: missing dependency. Raymond-chain values at θ ∈ [0.75, 0.86] use Raymond AF Part II Thm 1 (sharp continuum law) on 124–3078 substeps; value (i) at 7/8, θ ≤ 0.70 and route-P at 0.85/0.80 use it on 0. With the sharp mode off the values rise by at most 2.9e-7.',
      'T3: the heuristic fit "U ≈ 0.40θ − 0.22" sits above the data everywhere; least-squares on [0.65, 0.875] is U ≈ 0.364θ − 0.198 (max residual 0.0022). U is concave there.',
      'T4: at θ = 0.505 the chain value 5.0987e-5 exceeds the de Bruijn value 5e-5 because of the 2e-6 start offset; report the de Bruijn value there. As θ → 1/2 the chain tends to (q_b + 2e-6)/2.',
      'T5: route-P values at θ = 0.85 and 0.80 are exact computations but rest on a hypothetical θ: graded CONDITIONAL, not certified.',
      'T6: XL25 values are MEASURED (the finite-head wall near x = 2.5e12 is not certified).',
      'T7: Λ < 0.10 at PT needs θ ≈ 0.815 with the Raymond chain alone, θ ≈ 0.82 with route-P (interpolated). Rounding: slope on 0.55–0.60 is 0.265; X1 → X1000 at 0.80 is −0.01082.',
    ]),
  }),

  // ── (2) improving 7/8 ──────────────────────────────────────────────────────
  improvement: Object.freeze({
    boundary: Object.freeze({
      formulaA: 'σ0 = 5/6 + (M − 2ℓ)/12, M = l_x + l_y, ℓ = total slot length; = 11/12 − ℓ/4 on M + ℓ = 1',
      formulaB: 'σ0 = 5/6 + (l_x − ℓ)/6 + b/12, b = l_y − l_x',
      source: 'Prop 15.3 (eq. 15.6) low exponent l_x/2 + b/12 minus the Mellin shift of Def 10.1 / Lemma 10.5 (eq. 15.9); referee re-derived both forms in sympy',
      paperGeometry: Object.freeze({ lx: '17/48', b: '1/8', ell: '1/6', M: '5/6' }),
      bindingBin: 'Lemma 20.2 critical bin, x = 1/2, δ ≈ 0.386638 (maximal prime amplitude); exact minimum of −E* = 2.281473e-4 (value at δ = 79/204 is 7/30672 ≈ 2.282212e-4); the paper certifies 49/440640 ≈ 1.112e-4 via J ≤ 5/2',
      paperValue7over30672: '7/30672',
      paperCertified: '49/440640',
    }),
    A: Object.freeze({
      file: 'formalization/paper/qrh-improvement-attempt-a.md',
      scripts: Object.freeze(['formalization/paper/verify_qrh_improvement_a.py (60 exact checks, exit 0)', 'formalization/paper/qrh_improvement_a_sensitivity.py']),
      retuned: Object.freeze({ ell: '5003/30000', b: '1/8', sigma0: '34999/40000', C: '7499/40000', C0: '-497/24000', lemma202Margin: '1/20000',
        grade: 'CLOSING ARITHMETIC CERTIFIED (exact rationals + Sturm count); half-plane CONDITIONAL on re-using the manuscript\'s lemmas at the new geometry (patches P1–P9, plus Lemma 16.2 ε0 = 3/8 → 37/100 added by the referee); not Lean-checked; NOT to be used as a zero-free region or in the Λ pipeline' }),
      optimum: Object.freeze({ sigma0: 0.8749570698, ell: 0.16683839, b: 0.12340544, gain: 4.293e-5, grade: 'MEASURED (mpmath envelope, referee)' }),
      levers: Object.freeze([
        Object.freeze({ lever: 'moment inputs α = 4/5', theta: 0.874795 }),
        Object.freeze({ lever: 'moment inputs α = 2/3 (balanced-t count on d ≤ 1/2)', theta: 0.873916 }),
        Object.freeze({ lever: 'α = 1/2 (balanced-t)', theta: 0.872227 }),
        Object.freeze({ lever: 'all three moment upgrades tested together', theta: 0.873934 }),
        Object.freeze({ lever: 'relax M + ℓ ≤ 1 to 1.05', theta: 0.871831 }),
        Object.freeze({ lever: 'additive Gram loss P_a^{1/6} → P_a^{1/12}', theta: 0.869615 }),
        Object.freeze({ lever: 'no additive Gram loss (c\' = 0), unpadded', theta: 0.86395 }),
        Object.freeze({ lever: 'no Gram loss + density-hypothesis counts', theta: 0.863539 }),
      ]),
      barriers: Object.freeze({ formula: 'ℓ* = (1 − 2δ0)/(5 + 6δ0), σ0 = 11/12 − ℓ*/4 (density-hypothesis counts, b = 0, M = 1 − ℓ)', paperFloor: '167/192', floorToHalf: '13/15', delta0Paper: '1/50' }),
      verdict: 'Parameter optimisation cannot improve 7/8 meaningfully: 7/8 is the low-side boundary 11/12 − ℓ/4 at ℓ = 1/6, where M + ℓ ≤ 1 is tight and the critical bin has 2.28e-4 of slack. Best re-tuning ≈ 0.8749571 (gain 4.3e-5). Moment-input upgrades of the tested size buy about 1e-3. With density-hypothesis counts the method stops at 167/192 (13/15 as the floor → 1/2). The largest lever is the P_a^{1/6} loss in the additive Gram bound (Prop 15.2): removing it gives ≈ 0.864, and it looks like a genuine main term, so this needs a new estimate.',
      referee: Object.freeze({ refuted: false, severity: 'minor', corrections: Object.freeze([
        'A1: the minimiser of −E* is not δ = 79/204 (J depends on δ): minimum 2.281473e-4 at δ ≈ 0.386638; value at 79/204 is 7/30672 ≈ 2.282212e-4.',
        'A2: Lean edit surface understated: in the 2926-file DirichletL tree 440640 appears in 17 files, 7/8 in 84, 17/48 in 55, 13/16 in 38.',
        'A3: attempt B\'s 0.8749635 is a suboptimal point (b = 0.1346), not independent corroboration; the optimum over b is 0.8749570698 at b ≈ 0.1234.',
        'A4: "moment inputs buy at most 1e-3" holds only for the tested magnitudes under the paper\'s t = 1 count on d ≤ 1/2; with a balanced-t count α = 2/3 → 0.873916, α = 1/2 → 0.872227, α → 0 → 167/192.',
        'A5: c\' = 0 value depends on the script\'s 1e-3 supply padding: unpadded ≈ 0.86395 (floor and ℓ/h = 7/37 binding); with DH counts 0.863539.',
        'A6: 34999/40000 is plausible, not established; add Lemma 16.2 (ε0 = 3/8 → 37/100) to patch P4; keep it out of any zero-free-region claim and out of the Λ pipeline.',
      ]) }),
    }),
    B: Object.freeze({
      file: 'formalization/paper/qrh-improvement-attempt-b.md',
      scripts: Object.freeze(['tmp/qrh-attemptB/geom_model.py', 'tmp/qrh-attemptB/geom_opt2.py', 'tmp/qrh-attemptB/verify_w0.py', 'tmp/qrh-attemptB/lever_table.py']),
      findings: Object.freeze([
        'PROVED: with PT, a height-dependent region (β ≤ θ(γ) for γ > X/2) lowers q0 only if sup θ(γ) < 7/8 — the same as a global half-plane below 7/8.',
        'PROVED: the 7/8 proof contains the 11/12 method; adding Lemma 17.1 prime factors to the 11/12 amplifier cannot beat 11/12 (best exponent 11r/6).',
        'PROVED: the low-side identity σ0 = 5/6 + (l_x − ℓ)/6 + b/12 cannot go below 5/6 under the structure of Prop 15.3 (l_x ≥ ℓ, b ≥ 0); it is not a floor for every probe-type argument.',
        'PROVED: Mossinghoff–Trudgian–Yang at γ = 3.0001753e12 gives β < 0.99373824, (2β − 1)² = 0.9751098 > 9/16; its width exceeds 1/8 only for γ < e^{8/5.558691} = 4.217.',
        'MEASURED: feeding β* ≤ 7/8 back in ("Part III") gives the same optimum; the binding bin is interior (δ ≈ 0.387, x = 1/2) and dR*/dβ* ≈ 0.0077, so bootstrapping cannot move it.',
        'MEASURED (model, hypothetical inputs, each an open problem): α = 1/2 → 0.87276; density-hypothesis counts → 167/192; DH + floor removed → 13/15; Gram bound without P_a^{1/6} → 0.86395; all three → 0.85991.',
        'HEURISTIC: no classical input (zero-free regions near Re s = 1, density/proportion results, PT, Route I positivity with bounded support) lowers the bound over all heights above 3e12.',
      ]),
      verdict: 'No rigorous improvement of 7/8, uniform or height-dependent. q0 stays at 9/16 + ε; the conditional values 0.116091488672439 and 0.118505710922701 are unchanged. Re-tuning the paper\'s own parameters gains about 4.3e-5 in θ (model, not proof), about 1.2e-5 on Λ.',
      referee: Object.freeze({ refuted: false, severity: 'minor', corrections: Object.freeze([
        'B1: model optimum is 0.874957019 at (l_x, b, ℓ) ≈ (0.35488, 0.12341, 0.16684), gain 4.30e-5, not 0.87496352 (3.65e-5): the side penalty applied M + ℓ ≤ 1 with zero tolerance and stalled Nelder–Mead on the ridge. q0 becomes 0.562371; ΔΛ ≈ −1.2e-5.',
        'B2: lever values on exact evaluation: α = 1/2 0.87276; α = 0 0.87223; DH 167/192; DH + no floor 13/15; no-P_a^{1/6} Gram 0.86395; all three 0.85991.',
        'B3: MTY wording inverted in the summary (region narrower than 1/8 for every γ > 4.217).',
        'B4: zero density at T = 3e12 is (1/2π)log(T/2π) = 4.28 per unit height, not 4.6.',
        'B5: Lemma 18.1 is stated for κ ∈ [3/4, 1]; use κ\' = max(2β − 1, 3/4) (effect 5e-8).',
        'B6: duality sketch for the 11/12 method needs an unproved upper bound Σ|S(u)|² ≲ H^{1/6}D² + HD; stays heuristic.',
        'B7: scope: "sup_{T>3e12} θ(T) < 7/8" (not pointwise); the 5/6 floor is a floor of the low-side identity under Prop 15.3\'s structure only.',
      ]) }),
    }),
    limits: 'What limits 7/8: the dual-length condition M + ℓ ≤ 1 (from T_d ≤ H − 3d + (M + ℓ − 1) in Lemma 15.1) together with the Lemma 20.2 critical row bin at x = 1/2, δ ≈ 0.387 (2.28e-4 of slack). On M + ℓ = 1 the boundary is 11/12 − ℓ/4, so θ falls only as ℓ grows, and ℓ is capped by that bin. Beyond re-tuning the obstruction is the P_a^{1/6} sixth-power exceptional-frequency loss in the additive Gram bound (Prop 15.2), then the trivially counted floor bin and the prime supply ℓ/h.',
  }),

  verdict: 'Λ(θ): at PT height each 0.01 of θ near 7/8 is worth about 0.003 of conditional Λ, and nothing in the chain caps the gain for θ ≤ 7/8; smaller θ needs no more verified height (10× height ≈ 0.0215 of θ at 7/8). Every θ other than 7/8 is hypothetical. '
    + 'Improving 7/8: no rigorous gain. The geometry re-tune reaches about 0.8749571 (4.3e-5, model); 34999/40000 has certified closing arithmetic but rests on re-used lemmas and is kept out of the Λ pipeline. '
    + 'The method stops at 13/15 even with density-hypothesis counts; the one lever worth more than 5e-3 is a new additive Gram estimate without the P_a^{1/6} term (≈ 0.864, open). '
    + 'The conditional values 0.116091488672439 and 0.118505710922701 are unchanged; they are conditional values, not bounds. PT Lambda <= 0.2 stands; RH is open; NO QED.',
  nextStep: 'Lowering θ is worth far more than more verified height. If a θ below 7/8 becomes available, re-tune the route-P height sets on the new trajectory. For θ itself: test whether the sixth-power exceptional frequencies in Prop 15.2 can be cancelled by a modified probe while keeping c_S ≠ 0. A Lean-checked 34999/40000 is possible but low value (edits across 17–84 DirichletL files).',
});

const C = QRH_THETA_IMPROVEMENT;
const T = C.theta;
const ray = (th) => T.raymondPT.find((r) => r.theta === th);

export const QRH_THETA_IMPROVEMENT_ASSERTIONS = Object.freeze([
  {
    id: 'qti-decimals',
    holds: () => [...T.raymondPT, ...T.routePPT].every((r) => dec15(r.U) === r.dec),
    why: 'Every stated 15-digit decimal is the exact expansion of its rational.',
  },
  {
    id: 'qti-anchor-values',
    holds: () => ray('7/8').U === '118505710922701/1000000000000000' && T.routePPT[0].dec === '0.116091488672439'
      && eq(sub(ray('7/8').U, T.routePPT[0].U), '2414222250262/1000000000000000'),
    why: 'θ = 7/8 reproduces value (i) 0.118505710922701 and value (ii) 0.116091488672439 of the parent records; gap 0.002414222250262.',
  },
  {
    id: 'qti-monotone',
    holds: () => T.raymondPT.every((r, i, a) => i === 0 || (lt(r.theta, a[i - 1].theta) && lt(r.U, a[i - 1].U) && r.lastRow <= a[i - 1].lastRow))
      && T.raymondPT.every((r) => lt(r.U, '41/250')),
    why: 'U(θ) strictly decreases with θ on the grid, the terminal row is non-increasing, and U stays below the 41/250 horizon.',
  },
  {
    id: 'qti-de-bruijn',
    holds: () => T.raymondPT.every((r) => (r.theta === '101/200' ? lt(deBruijn(r.theta), r.U) : lt(r.U, deBruijn(r.theta))))
      && eq(deBruijn('7/8'), '9/32') && eq(deBruijn('101/200'), '1/20000')
      && lt(sub(ray('101/200').U, deBruijn('101/200')), '1/1000000') && num(ray('11/20').U) / num(deBruijn('11/20')) > 0.97,
    why: 'Chain value below the de Bruijn value (2θ−1)²/2 for every θ ≥ 0.52; at θ = 0.505 it exceeds 5e-5 by < 1e-6 (2e-6 start offset, referee T4); at 0.55 U/deBruijn > 0.97.',
  },
  {
    id: 'qti-contraction-share',
    holds: () => T.raymondPT.every((r) => { const q0 = add(mul(sub(mul('2', r.theta), '1'), sub(mul('2', r.theta), '1')), '1/500000'); return Math.abs(1 - 2 * num(r.U) / num(q0) - r.share) < 6e-5; }),
    why: 'Contraction share 1 − 2U/q0 with q0 = (2θ−1)² + 2e-6 recomputes to 4 decimals at every grid point.',
  },
  {
    id: 'qti-routeP-gain',
    holds: () => {
      const g = T.routePPT.map((p) => num(sub(ray(p.theta).U, p.U)));
      return g.every((x) => x > 0) && Math.abs(g[0] - 0.002414) < 1e-6 && Math.abs(g[1] - 0.002291) < 1e-6 && Math.abs(g[2] - 0.001953) < 1e-6
        && T.routePPT.every((p, i, a) => i === 0 || (lt(p.U, a[i - 1].U) && p.steps < a[i - 1].steps)) && T.routePPT.every((p) => p.strictEntry > 0);
    },
    why: 'Route-P lies below the Raymond chain at each θ (gain 0.002414 / 0.002291 / 0.001953) and decreases with θ; strict-entry margins positive.',
  },
  {
    id: 'qti-rival-lever',
    holds: () => { const r = T.rivalLever; return Number(r.theta8535) < Number(r.X10at78) && Number(r.X10at78) < Number(r.theta855) && Math.abs(Number(r.theta855) - Number(r.X10at78) - 4.47e-4) < 1e-6; },
    why: 'Referee T1: θ = 0.8535 at PT < 7/8 at 10× height < θ = 0.855 at PT, so 10× height ≈ 0.0215 of θ (not "0.02 beats 10×").',
  },
  {
    id: 'qti-height-lever',
    holds: () => T.heightLever.every((h, i, a) => h.toX1000 < 0 && h.toXL25 > 0 && (i === 0 || (Math.abs(h.toX1000) < Math.abs(a[i - 1].toX1000) && h.toXL25 < a[i - 1].toXL25)))
      && T.heightLever.filter((h) => num(h.theta) <= 0.7).every((h) => Math.abs(h.toX1000) < 0.0044 && h.toXL25 < 0.00063),
    why: 'The height lever shrinks monotonically as θ falls; for θ ≤ 0.70, PT → 1000×PT gains < 0.0044 and dropping to x = 2.5e12 costs < 0.00063.',
  },
  {
    id: 'qti-part-ii-dependency',
    holds: () => ray('7/8').sharpSubsteps === 0 && T.raymondPT.filter((r) => num(r.theta) <= 0.7).every((r) => r.sharpSubsteps === 0)
      && Object.entries(T.noSharp).filter(([k]) => k !== 'note').every(([k, v]) => { const d = Number(v) - num(ray(k).U); return d >= 0 && d < 3e-7; }),
    why: 'Referee T2: AF Part II is used only for θ ∈ [0.75, 0.86]; disabling it raises those values by < 3e-7.',
  },
  {
    id: 'qti-theta-for-0.10',
    holds: () => { const a = ray('4/5'), b = ray('41/50'); const t = 0.8 + 0.02 * (0.1 - num(a.U)) / (num(b.U) - num(a.U));
      const p0 = T.routePPT[2], p1 = T.routePPT[1]; const tp = 0.8 + 0.05 * (0.1 - num(p0.U)) / (num(p1.U) - num(p0.U));
      return Math.abs(t - 0.815) < 0.001 && Math.abs(tp - 0.82) < 0.003; },
    why: 'Λ < 0.10 needs θ ≈ 0.815 (Raymond chain) or ≈ 0.82 (route-P), by linear interpolation (referee T7).',
  },
  {
    id: 'qti-boundary-formula',
    holds: () => {
      const fA = (M, l) => add('5/6', div(sub(M, mul('2', l)), '12'));
      const fB = (lx, b, l) => add(add('5/6', div(sub(lx, l), '6')), div(b, '12'));
      const lre = C.improvement.A.retuned.ell;
      return eq(fA('5/6', '1/6'), '7/8') && eq(fA('1', '0'), '11/12') && eq(fB('17/48', '1/8', '1/6'), '7/8')
        && eq(fA(sub('1', lre), lre), C.improvement.A.retuned.sigma0) && eq(sub('11/12', div(lre, '4')), '34999/40000')
        && eq(sub('7/8', '34999/40000'), '1/40000');
    },
    why: 'σ0 = 5/6 + (M − 2ℓ)/12 gives 7/8 at (5/6, 1/6), 11/12 at (1, 0); B\'s form gives 7/8 at (17/48, 1/8, 1/6); ℓ = 5003/30000 on M + ℓ = 1 gives 34999/40000 = 7/8 − 1/40000.',
  },
  {
    id: 'qti-barriers',
    holds: () => {
      const ls = (d0) => div(sub('1', mul('2', d0)), add('5', mul('6', d0)));
      const G = (l, d0) => add(add('2/3', l), div(mul(d0, add('1', mul('3', l))), '2'));
      const s = (l) => sub('11/12', div(l, '4'));
      return eq(ls('1/50'), '3/16') && eq(s(ls('1/50')), '167/192') && eq(G('3/16', '1/50'), '167/192')
        && eq(ls('0'), '1/5') && eq(s('1/5'), '13/15') && eq(G('1/5', '0'), '13/15');
    },
    why: 'Density-hypothesis barrier: ℓ* = (1 − 2δ0)/(5 + 6δ0); δ0 = 1/50 → ℓ* = 3/16, σ0 = 167/192 where the floor exponent meets 11/12 − ℓ/4; δ0 → 0 → 13/15.',
  },
  {
    id: 'qti-binding-bin',
    holds: () => lt(C.improvement.boundary.paperCertified, C.improvement.boundary.paperValue7over30672)
      && Math.abs(num('7/30672') - 2.282212e-4) < 1e-9 && Math.abs(num('49/440640') - 1.112e-4) < 1e-7
      && C.improvement.A.optimum.sigma0 < 0.875 && Math.abs(0.875 - C.improvement.A.optimum.sigma0 - C.improvement.A.optimum.gain) < 1e-8
      && Math.abs((2 * C.improvement.A.optimum.sigma0 - 1) ** 2 - 0.562371) < 1e-6,
    why: 'Paper certificate 49/440640 < 7/30672 (value at δ = 79/204); referee-corrected optimum 0.8749570698 = 7/8 − 4.293e-5; q0 = 0.562371 there.',
  },
  {
    id: 'qti-levers-floor',
    holds: () => C.improvement.A.levers.every((l) => l.theta < 0.875 && l.theta > 13 / 15 - 0.004)
      && Math.min(...C.improvement.A.levers.map((l) => l.theta)) > 0.8635 && Math.abs(Math.exp(8 / 5.558691) - 4.217) < 1e-3,
    why: 'Every tested lever stays above 0.8635; no tested single change goes below 13/15 − 0.004; MTY crossover e^{8/5.558691} = 4.217.',
  },
  {
    id: 'qti-honest-scope',
    holds: () => /PT Lambda <= 0\.2 stands/.test(C.verdict) && /NO QED/.test(C.verdict) && /not bounds/.test(C.verdict)
      && /PT Lambda <= 0\.2 stands/.test(C.headline) && /NO QED/.test(C.headline)
      && /NOT to be used/.test(C.improvement.A.retuned.grade) && /CONDITIONAL/.test(C.improvement.A.retuned.grade)
      && /No rigorous improvement/.test(C.improvement.B.verdict) && !C.improvement.A.referee.refuted && !C.improvement.B.referee.refuted
      && T.refereeCorrections.length === 7 && C.improvement.A.referee.corrections.length === 6 && C.improvement.B.referee.corrections.length === 7,
    why: 'Verdict and headline: PT stands, no QED, conditional values not bounds; 34999/40000 graded conditional and kept out of the pipeline; referee corrections T1–T7, A1–A6, B1–B7 recorded.',
  },
]);

export default QRH_THETA_IMPROVEMENT;
