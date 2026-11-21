/**
 * @fileoverview beat-seven-eighths-2026-10-08 — synthesis of the four-angle attempt (2026-10-08) to improve the zeta
 * zero-free half-plane Re s > 7/8 of openai/math family 003, globally or above the verified height 3e12.
 * Angles: (1) amplifier, (2) mean square / large sieve, (3) height restriction, (4) project inputs. Each angle had two
 * adversarial internal referee passes; only referee-surviving statements are listed as rigorous, with referee corrections
 * applied (Lemma C1 scope, Lemma A scope, exact minimum of the binding row-bin margin, RES-T support scale, P4 window, the
 * Prop 15.2 exceptional-term omission, the 13/15 ceiling scope, the blocked Lemma 17.2 next step).
 *
 * OUTCOME: 7/8 is NOT beaten, neither globally nor above 3e12. No rigorous gain. The heuristic re-tune ceiling of the 7/8
 * paper's own inequalities is 0.874957 (gain 4.3e-5, endgame-only certificate at 7/8 - 1/25000, not a theorem).
 * Most promising open lever: the sixth-power exceptional-frequency term P_a^{1/6} of the additive Gram bound (Prop 15.2),
 * which supplies the b/12 in the low exponent; exponent-model value only (0.8739 at a 10% reduction, about 0.8635 if
 * removed), unproved, and possibly a genuine dual main term.
 *
 * Sources: /tmp/qrh-verify/paper.txt (7/8), /tmp/qrh-verify/paper2.txt (11/12), Lean tree /tmp/qrh-verify/lean (OAI),
 * angle writeups formalization/paper/beat78-{amplifier,meansquare,height,project}.md, synthesis
 * formalization/paper/beat78-synthesis.md. Both manuscripts are Lean-formalised by their authors and unrefereed.
 *
 * No refereed bound is changed; RH is open; NO QED. Import-free. BEAT_SEVEN_EIGHTHS_ASSERTIONS recompute the exact abscissa
 * algebra, frontiers and ceilings, the corrected binding margin, the certified endgame point, the de Bruijn bounds and
 * q0 values in exact BigInt rationals / plain JS doubles.
 */

const big = (s) => { const [a, b] = String(s).split('/'); return [BigInt(a), BigInt(b ?? '1')]; };
const gcd = (a, b) => { a = a < 0n ? -a : a; b = b < 0n ? -b : b; while (b) [a, b] = [b, a % b]; return a; };
const norm = ([a, b]) => { if (b < 0n) { a = -a; b = -b; } const g = gcd(a, b) || 1n; return [a / g, b / g]; };
const q = (x) => (Array.isArray(x) ? x : big(x));
const add = (x, y) => { const [a, b] = q(x), [c, d] = q(y); return norm([a * d + c * b, b * d]); };
const sub = (x, y) => { const [a, b] = q(x), [c, d] = q(y); return norm([a * d - c * b, b * d]); };
const mul = (x, y) => { const [a, b] = q(x), [c, d] = q(y); return norm([a * c, b * d]); };
const div = (x, y) => { const [a, b] = q(x), [c, d] = q(y); return norm([a * d, b * c]); };
const eq = (x, y) => { const [a, b] = q(x), [c, d] = q(y); return a * d === c * b; };
const num = (x) => { const [a, b] = q(x); return Number(a) / Number(b); };

// 7/8-paper exponent bookkeeping (eqs. (10.3), (12.4), (15.6), (15.9)): h = 1 - lx + l, sigma0 = 1 - h/6 + b/12.
const sigma0 = (lx, b, l) => { const h = add(sub('1', lx), l); return add(sub('1', div(h, '6')), div(b, '12')); };
// low side in (l, M) form: sigma_low = 5/6 + M/12 - l/6.
const sigmaLow = (l, M) => sub(add('5/6', div(M, '12')), div(l, '6'));
// Framework A (11/12 paper): theta = 1/2 + (1 - 1/k) lambda / 2.
const thetaA = (k, lam) => add('1/2', mul(div(sub(k, '1'), mul('2', k)), lam));
// de Bruijn: a half-plane Re s <= theta alone gives Lambda <= (2 theta - 1)^2 / 2; chain start q0 = (2 theta - 1)^2.
const q0 = (th) => { const t = sub(mul('2', th), '1'); return mul(t, t); };
// binding row bin of Lemma 20.2 at y = 0 (x = 1/2): -E*(delta) = (1224 d^2 - 948 d + 185) / (48 (185 - 138 d)).
const negE = (d) => (1224 * d * d - 948 * d + 185) / (48 * (185 - 138 * d));

export const BEAT_SEVEN_EIGHTHS = Object.freeze({
  id: 'beat-seven-eighths-2026-10-08',
  date: '2026-10-08',
  title: 'Attempt to improve the zeta zero-free half-plane Re s > 7/8: four angles, referee-filtered synthesis',
  status: 'done',
  parents: ['src/data/openai-math-integration-2026-10-08.js', 'src/data/qrh-path-push-2026-10-08.js'],
  writeups: [
    'formalization/paper/beat78-synthesis.md',
    'formalization/paper/beat78-amplifier.md',
    'formalization/paper/beat78-meansquare.md',
    'formalization/paper/beat78-height.md',
    'formalization/paper/beat78-project.md',
  ],
  headline: '7/8 was not beaten, neither globally nor above the verified height 3e12. Given Platt-Trudgian, a half-plane above 3e12 is the same '
    + 'statement as the global one, and the 7/8 proof has no height parameter. In the 7/8 paper the abscissa is sigma0 = 1 - h/6 + b/12; it is set jointly by '
    + 'the zero-loss range 2M >= 1 + 4l of Lemma 15.1, the sixth-power exceptional term P_a^{1/6} of Prop 15.2 (which supplies the b/12), and the high-side '
    + 'row counts (binding margin about 2.2815e-4 at delta about 0.3866). Re-tuning the paper\'s own inequalities gives at most 0.874957 (gain 4.3e-5; '
    + 'endgame-only certificate, not a theorem). The most promising open lever is the P_a^{1/6} term: model values 0.8739 at a 10% reduction and about 0.8635 '
    + 'if removed, none proved. No refereed bound is changed; NO QED.',

  outcome: Object.freeze({
    beatenGlobally: false,
    beatenAbove3e12: false,
    rigorousTheta: '7/8',
    heuristicRetuneCeiling: 0.874957,
    heuristicRetuneGain: 4.3e-5,
    endgameCertificatePoint: Object.freeze({ lx: '106451/300000', b: '247/2000', l: '1564/9375', sigma0: '21874/25000',
      scope: 'endgame inequalities of Section 20 only (E(h) < 0 on [1/50,3/4]x[0,1/2], floor bin, E(1/2), small rows, L1, L3, supply 7/37, 5l - h > 0); '
        + 'Lemmas 10.3-10.6, Section 16, Lemmas 17.1/18.1 meshes and Prop 20.3 not re-verified at this geometry; NOT a theorem' }),
  }),

  rigorous: Object.freeze([
    { id: 'R1', grade: 'PROVED (exact algebra from displayed formulas)', text: 'In the 7/8 paper, sigma0 = 1 - h/6 + b/12 = 5/6 + M/12 - l/6 with h = 1 - lx + l (eqs. (10.3), (12.4), Prop 15.3 (15.6), (15.9)). On M + l = 1 this is 11/12 - l/4. Exact at l = 0 (Part I, 11/12) and l = 1/6 (Part II, 7/8); for other l it is an extrapolation of the displayed formulas.' },
    { id: 'R2', grade: 'PROVED (elementary)', text: 'Proposition H / P1: assume PT (RH for 0 < gamma <= 3000175332800). For 1/2 <= theta < 1 and T0 <= 3000175332800, "no zeros with beta > theta and gamma >= T0" is equivalent to the global "no zeros with Re s > theta". A height-restricted half-plane above 3e12 is the global problem.' },
    { id: 'R3', grade: 'PROVED (within the Raymond chain, Lemma FB)', text: 'The chain reads time-zero zeros only through q* = sup{(2beta-1)^2 : gamma > (X+1)/2}, (X+1)/2 = 3000000092914 the chain-head ordinate (175239886 below the PT height). An improvement valid only for gamma >= T0 > PT height does not change the chain value.' },
    { id: 'R4', grade: 'PROVED (11/12 paper)', text: 'Prop 3.1 of the 11/12 paper holds for every fixed theta > 0; theta <= 1/10 is never used in the proof. The amplified exponent 11/12 + 5 theta/12 increases with theta, so 11/12 is the limit for natural-range (H >= D) mean squares with sixth-power amplifier rows.' },
    { id: 'R5', grade: 'PROVED', text: 'Any family-blind bound (any large sieve) over a row set containing u = 1 and u = p^6 has constant >= J N; for D <= H < D^{6/5} Prop 3.1 is strictly stronger than every family-blind bound. Heath-Brown cubic, Baier-Young and sextic large sieves cannot improve the 11/12 architecture.' },
    { id: 'R6', grade: 'PROVED (scoped by referee)', text: 'Lemma A: among arguments whose only inputs are the mean square sum_{N(u)<=H}|A_u|^2 <= B and sixth-power invariance A_{um^6} = A_u, |A_1|^2 << B/#{m: N(m)^6 <= H} cannot be beaten (covers p^2, p^3, sums over p^j, products of primes, smooth weights; units/S-units give at most constants). Says nothing about higher moments, separately proved sub-family bounds, or the 7/8 architecture.' },
    { id: 'R7', grade: 'PROVED (corrected by referee)', text: 'Lemma C1 (Galois parity): if g(chi^{-1}) = c(pi) prod g(chi^t)^{e_t} with c(pi) in K and t restricted to cubic (k/3, 2k/3) and quadratic (k/2) exponents, then k in {2,3,6}; if some cubic e_t != 0 then k in {3,6}. (The original statement "k in {3,6}" was false: k = 2 satisfies the hypothesis.)' },
    { id: 'R8', grade: 'EXACT (rational arithmetic)', text: 'Endgame certificate: at (lx, b, l) = (106451/300000, 247/2000, 1564/9375), sigma0 = 7/8 - 1/25000, the Section-20 endgame inequalities hold (Bernstein enclosures, 31 boxes, worst -5.9e-6; independent interval re-certification 383 boxes, worst -1.80e-6). Endgame only; the full 7/8 proof is not re-verified at this geometry, so no theorem follows.' },
    { id: 'R9', grade: 'EXACT (sympy; corrected by referee)', text: 'Binding row bin of Lemma 20.2: min(-E*) = 35 sqrt(16354)/12696 - 1491/4232 ~ 2.281473e-4 at x = 1/2, delta* = 185/138 - 35 sqrt(16354)/4692 ~ 0.3866376 (row zeros at Re s ~ 0.693319, R* ~ 0.668464). The earlier "7/30672 at delta = 79/204" is only the value at 79/204 (an upper bound on the minimum). The paper certifies 49/440640.' },
    { id: 'R10', grade: 'PROVED (structural, at the level of displayed inequalities)', text: 'Proposition D: the low exponent and principal margins of the 7/8 proof do not read the target L-function; row-bin exponents are nondecreasing in the row ceiling kappa. A zeta-only version is no easier: theta_zeta >= theta_family (not "slightly harder": Lemma 18.1 is stated only for 3/4 <= kappa <= 1).' },
    { id: 'R11', grade: 'VERIFIED (Lean source)', text: 'riemannZeta_ne_zero_of_seven_eighths_lt_re reduces to HeckeDirichlet.zeta_seven_eighths_of_hecke, whose only hypothesis is the statement for all Hecke characters of Q(sqrt(-3)); geometry hard-coded (Parameters.compensated_geometry 17/48, 23/48, 1/8; Endpoint.balancedExponent 13/16, 5/6).' },
    { id: 'R12', grade: 'CERTIFIED (Arb 256-bit)', text: 'At the PT height the explicit regions give abscissae MTY (R = 5.558691) 0.99373823 and Ford VK (c = 57.54) 0.99876276, both tending to 1; MTY lies below 7/8 only for t < e^{8/R} = 4.21726895, Ford nowhere for t >= 3. Even R = 1 or c = 1 would lie below 7/8 only for t < 2980.96 or t < 1.13e6.' },
    { id: 'R13', grade: 'CERTIFIED (sympy identity)', text: 'Push-up identity: a conjugate pair at height y_e adds V = 4 y_k (y_e^2 - y_k^2 - Delta^2)/[(Delta^2 + (y_e - y_k)^2)(Delta^2 + (y_e + y_k)^2)] to dy_k/dt; it pushes a lower zero up exactly when |Delta| < sqrt(y_e^2 - y_k^2). That an unlocated exceptional zero breaks the chain is a READING of Lemma FB (hypothesis b_j <= y), not part of the certified identity.' },
    { id: 'R14', grade: 'NUMERICAL (double precision, 58 primes)', text: 'Gauss-sum identities gamma2^3 = mu alpha (max error 7e-15), gamma1 gamma2 = mu alpha G (4e-15), quartic Jacobi J(chi,chi) = -chi(-1) pi (exact) for 7 < p < 700.' },
  ]),

  obstructions: Object.freeze([
    { id: 'O1', name: 'Height restriction is vacuous', grade: 'PROVED (R2, R3) + READING', text: 'Given PT, theta(T) < 7/8 for T >= 3e12 is the global statement. The 7/8 proof is height-free (Prop 2.1 continuation global in Im s; T1 = Z^tau absorbed by Lemma 11.1) and uses beta* over all Hecke characters at all heights, so no verified-height data can be inserted. A zero-free box (PT, T2) would need T2 ~ 4.9x / 16x / 63x the PT height for theta\' = 0.86 / 0.85 / 0.84 plus an unwritten lateral-wall lemma, and verifying RH to T2 gives the same or lower Lambda (heuristic cost comparison).' },
    { id: 'O2', name: 'Low side of the 7/8 probe (joint limit)', grade: 'PROVED relative to the paper\'s lemmas as stated', text: 'sigma_low = 1 - h/6 + c_G b with c_G = 1/12 from the P_a^{1/6} exceptional frequencies of Prop 15.2; b cancels, and Lemma 15.1\'s zero-loss range 2M >= 1 + 4l forces sigma_low >= 7/8 with equality on that line. 7/8 is the JOINT limit of Lemma 15.1\'s range, Prop 15.2\'s exceptional term and the high-side row counts, not of Lemma 15.1 alone. A sharper cubic or optimal large sieve leaves Lemma 14.3\'s worst case unchanged (extremal v = 0).' },
    { id: 'O3', name: 'High side (row counts)', grade: 'EXACT margin (R9) + HEURISTIC re-optimisation', text: 'The binding inequality is the intermediate row bin delta ~ 0.3866, x = 1/2 (low-lying zeros of sextic Hecke L-functions over Q(sqrt(-3)) near Re s ~ 0.693), margin 2.2815e-4, dE/dl ~ 1.333. Using the unused Z^{-d} slack of (15.8) (range 2M >= 1 + 3l) lets l exceed 1/6 by only ~1.7e-4: sigma0 ~ 0.874957.' },
    { id: 'O4', name: 'Amplifier density 1/6', grade: 'STRUCTURAL obstruction (not a theorem)', text: 'Within Poisson in u -> Gauss sums -> cubic-theta reflection -> quadratic large sieve, and assuming the recalled literature fact that only the cubic GL(2) theta has explicit squarefree Gauss-sum coefficients (Kazhdan-Patterson; not re-checked), k = 6 is the only usable residue degree (R7 + Mobius absorption; k = 2 circular, k = 3 leaves mu unabsorbed within single-theta forms, k = 4 needs quartic theta coefficients). Metaplectic Eisenstein series, higher-rank covers and multi-variable families are not excluded.' },
    { id: 'O5', name: 'Zeta-specific project inputs', grade: 'PROVED (R10, R11) + classification', text: 'The target enters only through its signal exponent; no zeta property (real coefficients, pole, verified zeros, near-1 regions, zeta zero density, proportion on the line) can enter. Fixed-support Weil positivity / Toeplitz-Krein has a finite horizon: corrected RES-T (T = a) gives horizons H ~ 6.77 / 6.97 / 8.07 for 2a = ln5 / ln6 / ln11 for a beta = 7/8 zero, required full support 2a* ~ 9.65 at 3e12 (margin-law extrapolation ~10^(-74,600)). Density and proportion results cannot exclude a zero. Near-1 regions hold at all heights but their width tends to 0.' },
    { id: 'O6', name: '13/15 ceiling (scoped)', grade: 'EXACT algebra relative to Prop 15.2 as stated', text: 'With Prop 15.2\'s P_a^{1/6} term and the column-branch range M + l <= 1 as stated, the floor bin (R = 1, any rows) gives sigma0 >= 2/3 + l + b/6 and the low side gives 11/12 - l/4; they meet at (l, M, b) = (1/5, 4/5, 0): 13/15 even with density-hypothesis counts. Without the exceptional term the same three-constraint algebra gives 31/36. A stronger reflected-energy bound (Lemma 15.1) alone cannot go below 13/15.' },
  ]),

  heuristicExponents: Object.freeze([
    { scenario: 'paper inequalities re-optimised (L1 tight, kappa = 3/4)', sigma0: 0.874957, note: 'gain 4.3e-5; three independent optimisers agree' },
    { scenario: 'Prop 15.2 term P_a^{(1-eta)/6}, eta = 0.02 / 0.05 / 0.1 / 0.25 / 0.5 / 1', sigma0: [0.87478, 0.87449, 0.87393, 0.87208, 0.86881, 0.86362], note: 'paper row counts, amplifier-referee model' },
    { scenario: 'Prop 15.2 term P_a^{th}, th = 1/6 / 1/8 / 1/12 / 1/24 / 0, Lemma 15.1 as proved', sigma0: [0.875, 0.872335, 0.869612, 0.866535, 0.863539], note: 'paper row counts, mean-square-referee model; th = 0 optimum at (l, M, b) = (0.152, 0.848, 0.181)' },
    { scenario: 'density-hypothesis counts R = 1 - delta', sigma0: 13 / 15, note: 'with Prop 15.2 as stated; 31/36 = 0.8611 if the exceptional term is removed' },
    { scenario: 'natural-range moment inputs in Lemmas 17.1 / 18.1', sigma0: 0.8731, note: 'BLOCKED: the first canonical invariant is also forced by the u = z_a column branch of Lemma 17.2 (reflected dual diagonal), so a kernel-saving row-branch bound alone does not relax it' },
    { scenario: 'hypothetical amplifier densities 1/5, 1/4, 1/3', sigma0: [0.849, 0.810, 0.743], note: 'ad hoc substitutions; densities unavailable (O4)' },
    { scenario: 'Raymond chain at hypothetical theta = 13/15', sigma0: 13 / 15, lambdaU: '0.11611697513897', note: 'prices an unproved half-plane; not a bound (7/8 value 0.118505710922701)' },
  ]),

  wouldBeNeeded: Object.freeze([
    'Below 7/8 at all: a change to the Cauchy-Schwarz/Gram step of Prop 15.3 that lowers the sixth-power exceptional exponent below 1/6 (e.g. subtract the explicit exceptional component of A_m before Cauchy-Schwarz, Holder, or a row restriction avoiding the sixth-power dual frequencies). By Lemma 13.3 the exceptional coefficients are periodic residue-symbol products with generically nonzero mean, so the term is a dual main term of the full row mean square when P_a > 1; it is NOT a question of cancellation in Mobius-twisted cubic Gauss sums. Any such change requires the full Part II bookkeeping redone with a rational endpoint certificate in the style of Lemma 20.2.',
    'Alternatively a reflected-energy bound (Lemma 14.3/15.1) beyond 2M >= 1 + 4l together with better high-side row counts near Re s ~ 0.69 for the sextic family; with Prop 15.2 as stated this stops at 13/15.',
    'Below 13/15: the P_a^{1/6} change above, b < 0 (a new additive Gram range), a change to M + l = 1, a better near-critical row-sum bound, or a different probe.',
    'For Lambda specifically, the only other lever is verified height (7/8 start at 10x the PT height gives a MEASURED 0.112236), HPC-scale and out of scope.',
  ]),

  refereeCorrections: Object.freeze([
    'Amplifier: Lemma C1 gives k in {2,3,6}, not {3,6}; Lemma A scoped to mean square + sixth-power invariance; density 1/6 is a structural obstruction, not a theorem.',
    'Amplifier: the P_a^{1/6} loss is a dual main term (periodic residue-symbol coefficients, Lemma 13.3), not tied to Mobius-twisted cubic Gauss sums or the cubic-family failure.',
    'Mean square: 7/8 is the joint limit of Lemma 15.1 and Prop 15.2 (not Lemma 15.1 alone); the 13/15 hard stop holds only with Prop 15.2 as stated; the Lemma 17.2 kernel-saving next step is blocked by the column branch.',
    'Height: the P4 example window must lie above the PT height (3000175332800, 3000175332801]; 3000000092914 is (X+1)/2, the chain-head ordinate, not the verified height; the saving ratio ~0.75 is plan-specific.',
    'Project: binding margin minimum is 2.281473e-4 at delta ~ 0.38664, not 7/30672 at 79/204; RES-T horizons use T = a (6.77/6.97/8.07, 2a* = 9.65), not T = 2a; Prop D gives "no easier", not "slightly harder".',
  ]),

  verdict: 'No improvement on 7/8: neither a global half-plane nor a half-plane above 3e12 better than Re s > 7/8 was obtained, and above 3e12 is logically '
    + 'the same problem given PT. The re-tune ceiling 0.874957 is heuristic (endgame-only certificate at 7/8 - 1/25000), not a theorem. The most promising open '
    + 'lever is the sixth-power exceptional term of Prop 15.2 (model values only). Conditional Lambda values from the 7/8 start (0.118505710922701 Raymond chain, '
    + '0.116091488672439 route P) are unchanged and remain conditional, not bounds. No refereed bound is changed; RH is open; NO QED.',
});

const C = BEAT_SEVEN_EIGHTHS;
const PT_HEIGHT = 3000175332800;
const X_CHAIN = 6000000185827;

export const BEAT_SEVEN_EIGHTHS_ASSERTIONS = Object.freeze([
  {
    id: 'b78-abscissa-parts',
    holds: () => eq(sigma0('1/2', '0', '0'), '11/12') && eq(sigma0('17/48', '1/8', '1/6'), '7/8')
      && eq(sigmaLow('0', '1'), '11/12') && eq(sigmaLow('1/6', '5/6'), '7/8')
      && [['0', '11/12'], ['1/6', '7/8'], ['1/5', '13/15']].every(([l, s]) => eq(sub('11/12', div(l, '4')), s)),
    why: 'sigma0 = 1 - h/6 + b/12 gives 11/12 at Part I (lx = 1/2, b = l = 0) and 7/8 at Part II (17/48, 1/8, 1/6); 5/6 + M/12 - l/6 agrees; 11/12 - l/4 on M + l = 1.',
  },
  {
    id: 'b78-certified-endgame-point',
    holds: () => {
      const P = C.outcome.endgameCertificatePoint;
      const s = sigma0(P.lx, P.b, P.l);
      const l1Tight = eq(P.lx, div(sub(sub('1', P.b), P.l), '2'));
      return eq(s, sub('7/8', '1/25000')) && eq(s, P.sigma0) && l1Tight && eq(s, sub('1', div(add('1', mul('3', P.l)), '12')))
        && /NOT a theorem/.test(P.scope);
    },
    why: 'At (106451/300000, 247/2000, 1564/9375) L1 is tight (lx = (1 - b - l)/2) and sigma0 = 1 - (1 + 3l)/12 = 7/8 - 1/25000 exactly; scope says endgame only.',
  },
  {
    id: 'b78-framework-a',
    holds: () => eq(thetaA('6', '1'), '11/12') && eq(thetaA('6', '9/10'), '7/8')
      && eq(thetaA('4', '1'), '7/8') && eq(thetaA('3', '1'), '5/6') && eq(thetaA('2', '1'), '3/4'),
    why: 'theta = 1/2 + (1 - 1/k) lambda / 2: k = 6 gives 11/12 at lambda = 1 and 7/8 at lambda = 9/10; k = 4, 3, 2 give 7/8, 5/6, 3/4 at lambda = 1.',
  },
  {
    id: 'b78-lemma151-frontiers',
    holds: () => {
      // range 2M >= 1 + c l with M + l <= 1: minimise sigma_low at M = (1 + c l)/2, l at its maximum 1/(2 + c).
      const front = (c) => { const l = div('1', add('2', c)); return sigmaLow(l, div(add('1', mul(c, l)), '2')); };
      const flat = [0, 1, 2].every((i) => eq(sigmaLow(div(String(i), '30'), div(add('1', mul('4', div(String(i), '30'))), '2')), '7/8'));
      return flat && eq(front('3'), '13/15') && eq(front('2'), '41/48');
    },
    why: 'Under 2M >= 1 + 4l, sigma_low = 7/8 identically on the boundary; ranges 1 + 3l and 1 + 2l with M + l <= 1 give corners 13/15 and 41/48.',
  },
  {
    id: 'b78-ceilings',
    holds: () => {
      const high = (l, b) => add(add('2/3', l), div(b, '6'));
      const triv = (lx, ly, l) => add(sub(sub('4/3', mul('5/6', lx)), div(ly, '2')), div(l, '3'));
      const noExc = sub('1', div(add(sub('1', '1/3'), '1/6'), '6'));
      return eq(high('1/5', '0'), '13/15') && eq(sigmaLow('1/5', '4/5'), '13/15')
        && eq(noExc, '31/36') && eq(triv('1/3', '1/2', '1/6'), '31/36') && eq(high('1/6', '1/6'), '31/36');
    },
    why: '13/15: floor bin 2/3 + l + b/6 meets the low side at (1/5, 4/5, 0); without the exceptional term, 1 - h/6 = 31/36 at (1/3, 1/2, 1/6) matches sigma_triv and the floor bin.',
  },
  {
    id: 'b78-binding-margin-corrected',
    holds: () => {
      const s = Math.sqrt(16354);
      const dStar = 185 / 138 - 35 * s / 4692;
      const vStar = 35 * s / 12696 - 1491 / 4232;
      let best = Infinity, arg = 0;
      for (let i = 0; i <= 200000; i++) { const d = (5 / 6) * i / 200000; const v = negE(d); if (v < best) { best = v; arg = d; } }
      const at79 = div(add(sub(mul('1224', mul('79/204', '79/204')), mul('948', '79/204')), '185'), mul('48', sub('185', mul('138', '79/204'))));
      return eq(at79, '7/30672') && Math.abs(negE(dStar) - vStar) < 1e-15 && Math.abs(best - vStar) < 1e-12 && Math.abs(arg - dStar) < 1e-5
        && vStar < num('7/30672') && Math.abs(vStar - 2.281473e-4) < 1e-10 && vStar > num('49/440640');
    },
    why: 'min over delta of (1224d^2 - 948d + 185)/(48(185 - 138d)) is 35 sqrt(16354)/12696 - 1491/4232 ~ 2.281473e-4 at delta ~ 0.3866376, below 7/30672 (the value at 79/204) and above the certified 49/440640.',
  },
  {
    id: 'b78-retune-gain',
    holds: () => {
      const gain = 0.875 - C.outcome.heuristicRetuneCeiling;
      const slotCap = 4 * gain; // sigma0 = 7/8 - (l - 1/6)/4 on the L1-tight family
      return Math.abs(gain - 4.3e-5) < 1e-6 && Math.abs(slotCap - 1.72e-4) < 5e-6 && gain < 1 / 25000 + 4e-6 && gain > 1 / 25000;
    },
    why: 'Ceiling 0.874957 = 7/8 - 4.3e-5, i.e. l <= 1/6 + 1.7e-4 on the L1-tight family; the certified endgame point 7/8 - 4e-5 sits just inside it.',
  },
  {
    id: 'b78-height-vacuous',
    holds: () => {
      const head = (X_CHAIN + 1) / 2;
      const R = 5.558691, L = Math.log(PT_HEIGHT);
      return head === 3000000092914 && PT_HEIGHT - head === 175239886 && X_CHAIN / 2 + 1 < PT_HEIGHT
        && Math.abs(1 - 1 / (R * L) - 0.99373823) < 1e-8 && Math.abs(Math.exp(8 / R) - 4.21726895) < 1e-7
        && Math.abs(Math.exp(8) - 2980.958) < 1e-3;
    },
    why: 'Chain head (X+1)/2 = 3000000092914 lies 175239886 below the PT height (so the original P4 window was inside PT); MTY abscissa at PT height 0.99373823; MTY below 7/8 only for t < e^{8/R} = 4.217; R = 1 only for t < e^8.',
  },
  {
    id: 'b78-debruijn-q0',
    holds: () => eq(div(q0('7/8'), '2'), '9/32') && eq(div(q0('13/15'), '2'), '121/450') && eq(q0('7/8'), '9/16')
      && Math.abs(num(q0('7/8')) - 0.5625) < 1e-15 && Math.abs((2 * 0.874957 - 1) ** 2 - 0.56237) < 1e-5 && eq(q0('13/15'), '121/225'),
    why: 'Half-plane alone: Lambda <= (2 theta - 1)^2/2 = 9/32 at 7/8, 121/450 at 13/15; chain start q0 = 9/16 at 7/8, 0.56237 at the re-tune ceiling, 121/225 at 13/15.',
  },
  {
    id: 'b78-heuristic-tables-consistent',
    holds: () => {
      const eta = C.heuristicExponents[1].sigma0, th = C.heuristicExponents[2].sigma0;
      const mono = (a) => a.every((x, i) => i === 0 || x < a[i - 1]);
      return mono(eta) && mono(th) && th[0] === 0.875 && Math.abs(eta[5] - th[4]) < 2e-4
        && eta.every((x) => x < C.outcome.heuristicRetuneCeiling) && th[4] < 13 / 15 && th[4] > 31 / 36
        && /BLOCKED/.test(C.heuristicExponents[4].note);
    },
    why: 'Both P_a-exponent tables decrease monotonically, agree at full removal (0.86362 vs 0.863539), every eta > 0 beats the re-tune ceiling, and full removal lies between 31/36 and 13/15; the Lemma 17.1 scenario is marked BLOCKED.',
  },
  {
    id: 'b78-honest-scope',
    holds: () => /refereed bound is changed/i.test(C.verdict) && /NO QED/.test(C.verdict) && /refereed bound is changed/i.test(C.headline) && /NO QED/.test(C.headline)
      && C.outcome.beatenGlobally === false && C.outcome.beatenAbove3e12 === false && C.outcome.rigorousTheta === '7/8'
      && C.rigorous.length === 14 && C.obstructions.length === 6 && C.refereeCorrections.length === 5
      && /not a theorem/.test(C.verdict) && /not bounds/.test(C.verdict),
    why: 'Verdict and headline: no improvement, no refereed bound is changed, NO QED; re-tune ceiling labelled not a theorem; conditional Lambda values not bounds.',
  },
]);

export default BEAT_SEVEN_EIGHTHS;
