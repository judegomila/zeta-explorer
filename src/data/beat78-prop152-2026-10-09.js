/**
 * @fileoverview beat78-prop152-2026-10-09 — three strategies (2026-10-09) for reducing or removing the sixth-power
 * exceptional term P_a^{1/6} of Prop 15.2 (additive Gram bound) in the 7/8 paper (openai/math family 003, 'The
 * Quasi-Riemann Hypothesis: a zero-free half-plane Re s > 7/8') through a restructured Prop 15.3 step.
 * Strategies: (1) subtract the exceptional component before Cauchy-Schwarz, (2) Holder / higher moments / weighted Gram
 * bounds, (3) restrict or re-weight the rows. Each strategy had two adversarial internal referee passes; none was refuted,
 * and only referee-surviving statements are listed as proved, with referee corrections applied.
 *
 * OUTCOME: no strategy gives theta' < 7/8. theta' = 7/8 is unchanged; there is no Lemma-20.2-style endpoint certificate
 * because no Part II inequality changed, and no conditional Lambda is computed. The exceptional term is a positive dual
 * main term of the row mean square (main-term level; error terms sketched), it is not separable from the paper's column
 * coefficient, and it is dual to the high-side signal (both need xi^6 = 1; class restrictions kill both on the same
 * classes). Any bound that sees B only through Lemma 15.1 is at least ||A||_2 V. A gain needs a non-Cauchy-Schwarz
 * estimate of the exceptional piece <A^E, B> (no tool known; heuristic), or a different lever (Lemma 15.1 slack range
 * 2M >= 1 + 3l together with better high-side row counts, or a different probe).
 *
 * Sources: /tmp/qrh-verify/paper.txt (7/8), /tmp/qrh-verify/paper2.txt (11/12). Writeups
 * formalization/paper/beat78-prop152-{subtract,holder,restrict}.md. Parent: src/data/beat-seven-eighths-2026-10-08.js.
 * The 7/8 manuscript is Lean-formalised by its authors and unrefereed.
 *
 * PT Lambda <= 0.2 stands; RH is open; NO QED. Import-free. BEAT78_PROP152_ASSERTIONS recompute the exponent bookkeeping,
 * the no-gain identities, the TRO fixed-geometry values, the slack-range values, the Lemma 20.2 binding margin and its
 * Delta cap, the corrected C>1 constants, and the local constants of Lemma R and the mod-2 sketch, in exact BigInt
 * rationals or plain JS doubles.
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
const cmp = (x, y) => { const [a, b] = sub(x, y); return a === 0n ? 0 : (a > 0n ? 1 : -1); };
const max0 = (x) => (cmp(x, '0') > 0 ? q(x) : [0n, 1n]);

// 7/8-paper bookkeeping: h = 1 - lx + l, low exponent with exceptional exponent theta (paper theta = 1/6):
// sigma_low(theta) = 1 - h/6 + theta b/2. With M = 2 lx + b this is 5/6 + M/12 - l/6 at theta = 1/6.
const sigmaTheta = (lx, b, l, th) => add(sub('1', div(add(sub('1', lx), l), '6')), mul(mul(th, b), '1/2'));
// TRO(eta) at fixed geometry: exceptional factor P_a^{(1-eta)/6}.
const sigmaTRO = (lx, b, l, eta) => sigmaTheta(lx, b, l, div(sub('1', eta), '6'));
const sigmaLowLM = (l, M) => sub(add('5/6', div(M, '12')), div(l, '6'));
// Lemma 20.2 binding row bin at x = 1/2: -E*(delta) = (1224 d^2 - 948 d + 185) / (48 (185 - 138 d)).
const negE = (d) => (1224 * d * d - 948 * d + 185) / (48 * (185 - 138 * d));
// norms of the primes of Z[omega] with norm >= 5 (split p = 1 mod 3 twice, inert p = 2 mod 3, p > 2, as p^2).
const primeNorms = (N) => {
  const sv = new Uint8Array(N + 1); const out = [];
  for (let i = 2; i <= N; i++) {
    if (sv[i]) continue;
    for (let j = i * i; j <= N; j += i) sv[j] = 1;
    if (i % 3 === 1) out.push(i, i); else if (i % 3 === 2 && i > 2) out.push(i * i);
  }
  return out;
};

const GEOM = Object.freeze({ lx: '17/48', ly: '23/48', b: '1/8', l: '1/6', M: '5/6' });

export const BEAT78_PROP152 = Object.freeze({
  id: 'beat78-prop152-2026-10-09',
  date: '2026-10-09',
  title: 'Prop 15.2 exceptional term P_a^{1/6} in the 7/8 paper: subtraction, Holder and row-restriction strategies, referee-filtered',
  status: 'done',
  parents: ['src/data/beat-seven-eighths-2026-10-08.js'],
  writeups: [
    'formalization/paper/beat78-prop152-subtract.md',
    'formalization/paper/beat78-prop152-holder.md',
    'formalization/paper/beat78-prop152-restrict.md',
  ],
  scripts: [
    'tmp/beat78-prop152-subtract-algebra.py (17/17 exact checks)',
    'tmp/beat78-prop152-subtract-selftest.py, tmp/beat78-prop152-subtract-gram.py --validate (Poisson dual = brute force to 4.9e-13)',
    'tmp/beat78-prop152-holder-algebra.py (24/24 exact checks), -correlation.py, -kummer.py (6045 moduli)',
    'tmp/beat78-prop152-restrict-exponents.py (E1-E7 exact + Arb), -selftest.py (T1-T6), -crt.py (3.5e-14)',
  ],
  headline: 'None of the three strategies lowers the abscissa below 7/8; theta\' = 7/8 is unchanged and there is no endpoint certificate to give. '
    + 'The P_a^{1/6} term of Prop 15.2 is a positive dual main term of the row mean square: at C = 1 its Gram coefficient is identically 1 on sigma x sigma '
    + '(main-term level; error terms sketched). The paper\'s column coefficient equals its own exceptional component, c_sigma = kappa_sigma 1_sigma conj(chi_.(e0))/tau, '
    + 'so subtraction is vacuous in column form and circular in general. A bound that sees B only through Lemma 15.1 is at least ||A||_2 V, so Holder-type '
    + 'arguments cannot gain. Row weights and class restrictions that remove the term also remove the high-side signal (both need xi^6 = 1; local duality via '
    + 'quadratic reciprocity). PT Lambda <= 0.2 stands; NO QED.',

  outcome: Object.freeze({
    rigorousGain: false,
    thetaPrime: '7/8',
    endpointCertificate: null,
    conditionalLambda: null,
    conditionalLambdaNote: 'not computed: no rigorous theta\' < 7/8 survived the referees, so no Raymond-chain run with q0 = (2 theta\' - 1)^2 + 2e-6 was made',
  }),

  strategies: Object.freeze([
    Object.freeze({
      key: 'subtract',
      name: 'Strategy 1: subtract the exceptional component of A_m before Cauchy-Schwarz',
      writeup: 'formalization/paper/beat78-prop152-subtract.md',
      verdict: 'FAILS. Subtraction followed by Cauchy-Schwarz cannot improve 7/8: the column coefficient is its own exceptional component, every split leaves the '
        + 'full signal of every zero with beta > 83/96 in the subtracted piece I^E, and the exceptional coset exists exactly when the principal signal does. '
        + 'A gain needs a non-Cauchy-Schwarz bound for I^E; whether one exists is open (heuristic).',
      referees: Object.freeze([{ refuted: false, severity: 'minor' }, { refuted: false, severity: 'minor' }]),
      proved: Object.freeze([
        { id: 'S1', grade: 'PROVED relative to the paper (exact sextic-symbol checks; two independent referee implementations)', text: 'Structure lemma: on each ray class sigma, c_sigma = kappa_sigma 1_sigma conj(chi_s(e0))/tau with |kappa_sigma| = 1 for an explicit S-unit e0. The mean-zero remainder of c_sigma with respect to the exceptional frequencies is identically 0, and A_{m,sigma,nu} = (kappa_sigma/tau) A~_{sigma,nu}(e0 m) by the dilation identity conj(chi_s(e)) g(s,-m) = g(s,-em).' },
        { id: 'S2', grade: 'PROVED at coefficient level (exact; brute-force F)', text: 'For coprime s1, s2 in sigma the C = 1 Gram coefficient c(s1) conj(c(s2)) F(s1,s2; +-e0 a^6) is identically 1 (also for a meeting S). At a non-exceptional frequency the mean is about 0.05.' },
        { id: 'S3', grade: 'PROVED (corrected by both referees)', text: 'Lemma 2.1(ii), corrected: at p | C with c = v_p(C), the factor chi_p(n1/n2)^c of (13.8) is present in every case, so the local mean is nonzero iff 6 | v_p(j), j = Ck. For squarefree C the surviving class is j = eps e\' a^6 with C | a (k = eps e\' C^5 (a/C)^6), with coefficient identically phi(C) > 0 on sigma x sigma. The C > 1 correction is 0 <= c_sigma << Prod(1 + q_p^{-2}) - 1 = 0.0700 (not 0.0466). Exponent and positivity unchanged.' },
        { id: 'S4', grade: 'PROVED (tautological reduction)', text: 'Lemma 3.2 (circularity): for any split A = A^E + A^R whose remainder has no exceptional term, I^E = I_{eta,modified} + O(Z^{lx/2+eps}), using ly - l - 2b = 1/16 > 0. Hence any improved bound for I is equivalent to the same bound for the aggregated I^E.' },
        { id: 'S5', grade: 'PROVED relative to paper l.3182 and Lemma 10.5', text: 'Theorem 4.1 (duality): the high-side double residue at w = 1, z = 1/6 needs xi_p^6 = 1 (otherwise the a-sum is L^S(6z, xi^6), regular at z = 1/6). xi_p^6 = 1 iff xi_p lies in <chi_p> iff the low-side exceptional coset is nonempty at p.' },
        { id: 'S6', grade: 'PROVED (exact Fractions)', text: 'Proposition 4.2: letting b* grow (q_b* = Z^beta, coset norm q_b*^f, f <= 4) gives low exponent extra beta/2 + max(0, (b - (1+f) beta)/12) >= b/12, equality only at beta = 0.' },
      ]),
      notProved: Object.freeze([
        'Proposition 2.3 (exceptional main term with explicit E > 0): sketched at the level of the paper\'s Prop 15.2 proof, error terms not written out [S].',
        'Identification of the exceptional component with the sextic residual-spectrum (theta) part of the Kubota-Eisenstein series at e0 m [H]; Kazhdan-Patterson non-uniqueness for n = 6 is recalled, not re-derived.',
        'Hypothesis TRO(eta) (non-Cauchy-Schwarz bound on the correlation of completed cubic rows with the sextic theta direction): only sufficient, not equivalent to the improved low bound.',
        'Numerical illustrations (Y <= 2000, X <= 3e5) are floating point and toy-sized; the theta-fit has about 3 independent classes, not 5.',
      ]),
      refereeCorrections: Object.freeze([
        'Lemma 2.1(ii) misread (13.8); corrected class k = eps e\' C^5 (a/C)^6, per-C count (P_a/q_e\')^{1/6} q_C^{-1}, weight q_C^{-2}, constant 0.0700.',
        'Corollary 3.4 overclaimed: a bound on I^E supplies only the low input (2.4); the high input (2.5) for beta* < 7/8 needs a re-optimised geometry and re-proved Part II. At the paper geometry the certified margin 49/440640 is gone once Delta < -1.4e-4 (about -2.9e-4 with the exact margin 2.2815e-4).',
        'At fixed geometry TRO(eta) gives sigma_low = 7/8 - eta/96 (839/960 at eta = 0.1, 83/96 at eta = 1); 0.87393 and 0.8636 are heuristic re-optimised models.',
        'Obstruction item (5) (sextic theta structure) is [H]/recalled; Prop 2.3 is [S]; the 1,763,844-character check is cyclic-group bookkeeping, not arithmetic evidence.',
        'Lemma 4.2 / (4.7) need conj(H(4)): gamma1 gamma2 = conj(H(4)) gamma3 gamma2^3 (the printed form fails numerically, error 1.7; the paper\'s own step J(H,H^3) = H(4) J(H,H) forces the conjugate).',
      ]),
      endpointCertificate: null,
      nextStep: 'Test whether the sextic residual spectrum over Q(sqrt(-3)) has a global expression through cubic and quadratic theta series (cheap test: per-class constants c_sigma in sum gamma_1(s) ~ c_sigma X^{2/3} at larger X, compared with products of Patterson\'s cubic constants). If none, drop Prop 15.2 levers.',
    }),
    Object.freeze({
      key: 'holder',
      name: 'Strategy 2: Holder, higher moments, weighted / amplified / Mellin-weighted Gram bounds, column partitions',
      writeup: 'formalization/paper/beat78-prop152-holder.md',
      verdict: 'FAILS. With B controlled only through Lemma 15.1 (sum |B_m|^2 <= V^2), sup_B |sum A_m B_m| = ||A||_2 V exactly, and ||A||_2 carries P_a^{1/12} at '
        + 'main-term level on the rows prime to S. Holder, interpolation, level sets, weights, amplifiers and column partitions therefore cannot beat the paper\'s bound. '
        + 'Relative no-gain certificate: sigma_low(theta) - sigma_low(1/6) = b(6 theta - 1)/12 >= 0 for theta >= 1/6.',
      referees: Object.freeze([{ refuted: false, severity: 'minor' }, { refuted: false, severity: 'minor' }]),
      proved: Object.freeze([
        { id: 'H1', grade: 'PROVED', text: 'Lemma 1: Holder with a moment of order p >= 2 of A_m and B bounded by Lemma 15.1 equals Cauchy-Schwarz with the second-moment bound implied by the power mean; e_H(p) = e_CS + (alpha_p - alpha_p_flat)/p. Corollary 1: the exceptional factor enters the 2j-th moment as P_a^{j/6}, so the 2j-th root returns P_a^{1/12}.' },
        { id: 'H2', grade: 'PROVED (referee addition)', text: 'If B is controlled only through sum |B|^2 <= V^2, then sup_B |sum A_m B_m| = ||A||_2 V (take B = V conj(A)/||A||_2). This covers Holder, weights, level sets and column partitions (the last via the triangle inequality) without any heuristic on the true size of sum |B|^2.' },
        { id: 'H3', grade: 'PROVED at main-term level (Poisson identity exact; error terms sketched)', text: 'Prop 2: on exceptional frequencies the column coefficient is rank one, psi_eps(n1) conj psi_eps(n2), on sigma x sigma; the class eps* (and eps** = eps* lambda^3 on rows prime to S, every S-valuation <= 4) has coefficient identically 1; every main-term piece is >= 0 and M_Omega(1/6) > 0, so sum_m |A_m|^2 is of order (Q/Y\') P_a^{1/6}. A main term needs 6 | c_p + v_p(k).' },
        { id: 'H4', grade: 'PROVED', text: 'Theorem 3: every bound built from moment constraints of order >= 2 on |A| and |B| is >= the true (sum|A|^2)^{1/2}(sum|B|^2)^{1/2}, since the flat configuration satisfies the constraints. Theorem 3\' (orders >= 1) is conditional on flat fourth moments.' },
        { id: 'H5', grade: 'EXACT (identity)', text: 'sigma_low(theta) - 7/8 = (2M - 1 - 4l)/24 + b(theta/2 - 1/12) with M = 2 lx + b. Absolute form >= 0 only on the paper\'s range 2M >= 1 + 4l; the scope-free form is the relative certificate b(6 theta - 1)/12.' },
      ]),
      notProved: Object.freeze([
        'Prop 2 error terms (ray-class equidistribution, a-sum by integral, short dyads): sketched; Prop 15.2\'s estimates carry Z^eps losses, so power-saving versions are needed for an asymptotic. Part (2) of the obstruction holds at main-term level only.',
        'Theorem 3\' below order 2 (flat fourth moments: measured kurtosis about 2, heuristic pairing model).',
        'The statement that the excess is not a low-rank component of the row vector: heuristic.',
        'The a^6 regime (P around 7^6 x 100) is out of numerical reach; measurements test the S-unit exceptional frequencies only.',
      ]),
      refereeCorrections: Object.freeze([
        'The absolute certificate is scoped to 2M >= 1 + 4l. With the Z^{-d} slack of (15.8) the needed range is 2M >= 1 + 3l, where theta = 1/6 gives 11/12 - l/4 on M = 1 - l (13/15 at l = 1/5; 1049/1200 at (l, M, b) = (17/100, 83/100, 0)); there the high side sets the floor.',
        'Y = 20000 run: the excess at P = 4 is -0.00289 +- 0.00050 (negative lobe of W1-hat), not 0 within noise.',
        'Theorem 3 covers moment constraints only; level-set arguments are covered by H2 or by Theorem 3\'.',
        'a-sum remainder is O(X^{-1/12}), not O(1); (iv-d) Fourier argument must include q_{k_C}. For S-primes with q = 1 mod 4 the coherent classes are redistributed by the quadratic character mod pi (constant factor only; referee exact test, pi13).',
      ]),
      endpointCertificate: null,
      nextStep: 'Any gain must use phase information on sum A_m B_m beyond |A_m|, |B_m| (column-side pairing with the exceptional part, i.e. Strategy 1), or a different lever.',
    }),
    Object.freeze({
      key: 'restrict',
      name: 'Strategy 3: restrict or re-weight the rows (smooth weights, sieves, class restrictions, s-twists)',
      writeup: 'formalization/paper/beat78-prop152-restrict.md',
      verdict: 'FAILS for the forms covered. Smooth radial row weights keep the term (Theorem C). Class restriction mod an odd S-prime pi_p (p not dividing 6, xi_p quadratic) '
        + 'removes it on half the classes (Lemma R), but the high-side signal vanishes on the same classes (Prop E\'). Fixed-character s-twists keep the term whenever they keep the '
        + 'signal (Kummer duality). Two-place restrictions create new zero sets; a referee hand derivation (not machine-checked) shows the signal vanishes there too. '
        + 'Three or more places, mod 8 / mod 9 moduli and joint (m, s) congruences are open.',
      referees: Object.freeze([{ refuted: false, severity: 'minor' }, { refuted: false, severity: 'major' }]),
      proved: Object.freeze([
        { id: 'T1', grade: 'PROVED', text: 'Theorem A: a nonnegative row weight in the row ball has Re omega-hat(xi) >= omega-hat(0)/2 for |xi| <= sqrt3/(8 pi sqrt(C_Omega Q)); it cannot damp exceptional dual frequencies near O. Lemma K (Kummer): every exponent-6 ray character with conductor supported on S is s -> chi_s(e) for an S-unit e.' },
        { id: 'T2', grade: 'PROVED relative to Lemmas 4.1, 4.4, 13.3 and Prop 15.2', text: 'Theorem B: e0 = (b* e_xi)^{-1} gives c_sigma(s) chi_s(e0) = 1/tau and C = 1 coefficient exactly 1. Theorem C: for psi = phi*phi~ with phi >= 0 radial, sum_m psi |A_m|^2 >= kappa (Q/Y\') P_a^{1/6}.' },
        { id: 'T3', grade: 'PROVED relative (p-local computation; identity exact)', text: 'Lemma R: rows restricted to a class x mod pi_p (xi_p quadratic, p not dividing 6) carry Phi_p(x) = (q^{2/3}/(q-1))(1 + tau_p c_L chi_p^3(x)), using q^{1/6} sqrt(q)/(q-1) = q^{-1/3}/(1 - 1/q). Prop E\': the class-restricted signal is proportional to 1 + tau_p s_H chi_p^3(x) with s_H = c_L when R(pi_p, .) = 1.' },
        { id: 'T4', grade: 'PROVED (referee local Hilbert-symbol argument; numerically 3220/3220 and 542 primes)', text: 'chi_p^3 is trivial on E_T\' = <-1, lambda^3, 4> iff pi_p = 1, omega, omega^2 mod 4 iff R(pi_p, .) = 1 (R = (.,.)_2 on primary elements; (lambda, .)_2 factors through four square classes mod 4; the pairing is nondegenerate).' },
        { id: 'T5', grade: 'PROVED (single-place table, referee corrected)', text: 'Class 1: zero sets of the exceptional term and the signal coincide. Class -1: low side w0(1+a) + w3(1-a) with w3/w0 = sqrt3, never zero; the row -pi_p^3 carries a signal proportional to 1 - a. Classes +-lambda: both uniform. xi_p of order 3 or 6: low side uniform. Principal xi_p: both vanish. Restriction (m, lambda) = 1 lowers the constant by 3/(3+sqrt3) = 0.634 with no exponent change.' },
        { id: 'T6', grade: 'EXACT (sympy + Arb)', text: 'sigma0 = 5/6 + M/12 - l/6 - (1 - eta) b/12; eta = 1 forced by every covered row selection; thin row sets shift the requirement by +rho/2 or 0. Constants pi^{2/3} Gamma(1/6)/Gamma(5/6) = 10.5776476350901, pi Gamma(5/6) = 3.54618904062681.' },
      ]),
      notProved: Object.freeze([
        'Two-place restriction duality ({lambda, pi_p}, {pi_p, pi_p\'}): referee hand derivation, not machine-checked; three or more places not written out.',
        'Places over 2 and 3 beyond T\'s modulus (mod 8, mod 9, ...), joint (m, s) congruences and restrictions on the class of s: open. Mod 2 sketch gives local coefficients 3.405, 0.885, 0.885 (never zero; heuristic).',
        'Theorem C for annular or non-radial smooth weights (|x|^{-1/3}-moment law stated, not proved in the note). Remainder bounds written at the paper\'s level of detail.',
        'Toy numerics at P >= 256 lie outside Prop 15.3\'s range P^{11/6} <= Y at Y = 20000; deviations of 2.8-4.5 sigma at large P; the QR/NR toy confirms the phase structure, not the cancellation in Lemma R.',
      ]),
      refereeCorrections: Object.freeze([
        'Major: "restrictions at several S-primes multiply the local factors and change nothing" is false. Coherent types {+-e, +-e lambda^3} carry different local signs, so joint restrictions at {lambda, pi_p} or {pi_p, pi_p\'} cancel the leading coefficient on half the joint classes; the obstruction as written did not cover these. The referee extension restores the duality for two places (hand derivation).',
        'Prop E\': new principal rows are u = eps pi_p^3 with chi_.(eps) = R(pi_p, .), so u = -pi_p^3 for class -1; the class -1 signal is not uniform.',
        'Obstruction (i) holds for smooth nonnegative weights; Lemma R is a counterexample for periodic nonnegative weights. Prop D(3): the condition is on theta restricted to ker(ray group -> T), not ord theta | 6.',
        '"Minimum still 7/8" (E4) should cite the slack range 2M >= 1 + 3l and the heuristic re-tune 0.874957; 83/96 at eta = 0 is a fixed-geometry low-side value.',
      ]),
      endpointCertificate: null,
      nextStep: 'Row selection of the covered forms cannot help; the remaining Strategy-3 cases (three or more places, mod 8 / mod 9, joint (m, s) congruences) are the only untested row-side options, and each tested case so far has obeyed the duality.',
    }),
  ]),

  jointObstruction: Object.freeze({
    grade: 'PROVED relative to the paper\'s lemmas for items 1-4 (item 2 at main-term level); item 5 HEURISTIC',
    items: Object.freeze([
      '1. Inseparable: the column coefficient is its own exceptional component (c_sigma = kappa_sigma 1_sigma conj(chi_.(e0))/tau); the mean-zero remainder is 0.',
      '2. Main term: the C = 1 exceptional Gram coefficient is identically 1 and every C > 1 term is >= 0 (phi(C) on sigma x sigma), so P_a^{1/6} is attained (error terms sketched).',
      '3. Magnitudes-only methods: with Lemma 15.1 as the only B input, every bound is >= ||A||_2 V; Holder returns P_a^{1/12} at every moment order.',
      '4. Duality with the signal: the exceptional coset exists iff xi^6 = 1, which is also the condition for the zeta_F^S(6z) pole at z = 1/6; growing b* costs Z^{beta/2} >= what it removes; class restrictions that remove the term at one place p not dividing 6 remove the signal on the same classes.',
      '5. HEURISTIC: the only explicit form of the component is the sextic residual spectrum, whose coefficients are not known for n = 6; a gain needs a non-Cauchy-Schwarz estimate of <A^E, B>, for which no tool is known.',
    ]),
  }),

  crossCutting: Object.freeze([
    'Lemma 15.1 slack: with the Z^{-d} tuple factor of (15.8) the zero-loss range is 2M >= 1 + 3l (binding at d = 0), not 2M >= 1 + 4l. On that range the low side alone gives 7/8 - l/24 (13/15 at (l, M) = (1/5, 4/5)), so 7/8 is a joint limit with the high-side row counts.',
    'High-side cap at the paper geometry: Lemma 20.2 row bin min(-E*) = 35 sqrt(16354)/12696 - 1491/4232 = 2.2814731e-4 at x = 1/2, delta* = 0.38663756 (certified 49/440640). A low-side shift Delta keeps the certified margin only for Delta >= -1.4e-4 (about -2.9e-4 with the exact margin). Any gain larger than that needs a re-optimised geometry and a re-proved Part II.',
  ]),

  nextLevers: Object.freeze([
    'Lemma 15.1 slack range 2M >= 1 + 3l together with better high-side row counts near delta ~ 0.39 (row zeros of sextic Hecke L-functions near Re s ~ 0.69); the re-tune ceiling of the paper\'s own inequalities is 0.874957 (heuristic).',
    'A global identity for the sextic residual spectrum over Q(sqrt(-3)) through cubic and quadratic theta series, turning TRO into a correlation of cubic theta coefficients with completed cubic rows (test: per-class constants c_sigma X^{2/3}).',
    'A different probe (the Prop 15.2 lever is closed for every sextic-character probe that carries the principal signal, by S5).',
    'Remaining Strategy-3 cases: three or more restricted places, mod 8 / mod 9, joint (m, s) congruences.',
  ]),

  verdict: 'No theta\' < 7/8: subtraction (vacuous in column form, circular in general), Holder-type bounds (capped by ||A||_2 V) and row restrictions (dual to the '
    + 'signal) all leave the P_a^{1/6} exceptional term of Prop 15.2 and the abscissa 7/8 unchanged. No endpoint certificate is needed because no Part II inequality changed, and '
    + 'no conditional Lambda is computed. TRO-type values (839/960, 83/96 at fixed geometry; 0.87393, 0.8636 re-optimised) are heuristic, not theorems. '
    + 'PT Lambda <= 0.2 stands; RH is open; NO QED.',
});

const C = BEAT78_PROP152;
const G = GEOM;

export const BEAT78_PROP152_ASSERTIONS = Object.freeze([
  {
    id: 'p152-geometry-chain',
    holds: () => {
      const h = add(sub('1', G.lx), G.l);
      return eq(h, '13/16') && eq(add(mul('2', G.lx), G.b), G.M) && eq(sigmaTheta(G.lx, G.b, G.l, '1/6'), '7/8')
        && eq(sigmaLowLM(G.l, G.M), '7/8') && eq(sub('1', div(h, '6')), '83/96')
        && eq(sub(sub(G.ly, G.l), mul('2', G.b)), '1/16') && eq(add(div(G.lx, '2'), div(G.b, '12')), '3/16')
        && eq(mul('2', G.M), add('1', mul('4', G.l))) && eq(add(G.M, G.l), '1');
    },
    why: 'Paper geometry (lx, ly, b, l) = (17/48, 23/48, 1/8, 1/6): h = 13/16, M = 2 lx + b = 5/6, sigma0 = 7/8 both ways, visibility threshold 83/96, ly - l - 2b = 1/16, C(7/8) = lx/2 + b/12 = 3/16, zero-loss range tight (2M = 1 + 4l, M + l = 1).',
  },
  {
    id: 'p152-holder-identity',
    holds: () => {
      const pts = [['17/48', '1/8', '1/6'], ['1/3', '1/5', '1/7'], ['2/5', '0', '1/9'], ['3/10', '3/11', '1/5']];
      const ths = ['0', '1/12', '1/6', '1/4', '1/2'];
      return pts.every(([lx, b, l]) => ths.every((th) => {
        const M = add(mul('2', lx), b);
        const lhs = sub(sigmaTheta(lx, b, l, th), '7/8');
        const rhs = add(div(sub(sub(mul('2', M), '1'), mul('4', l)), '24'), mul(b, sub(div(th, '2'), '1/12')));
        const rel = sub(sigmaTheta(lx, b, l, th), sigmaTheta(lx, b, l, '1/6'));
        return eq(lhs, rhs) && eq(rel, div(mul(b, sub(mul('6', th), '1')), '12'));
      }));
    },
    why: 'Exact identity sigma_low(theta) - 7/8 = (2M - 1 - 4l)/24 + b(theta/2 - 1/12) with M = 2 lx + b, and the scope-free relative certificate sigma_low(theta) - sigma_low(1/6) = b(6 theta - 1)/12, on rational sample geometries.',
  },
  {
    id: 'p152-tro-fixed-geometry',
    holds: () => eq(sigmaTRO(G.lx, G.b, G.l, '1/10'), '839/960') && eq(sigmaTRO(G.lx, G.b, G.l, '1'), '83/96')
      && eq(sigmaTRO(G.lx, G.b, G.l, '0'), '7/8')
      && ['1/10', '1/2', '1'].every((e) => eq(sub('7/8', sigmaTRO(G.lx, G.b, G.l, e)), div(e, '96'))),
    why: 'TRO(eta) at the fixed paper geometry gives 7/8 - eta/96: 839/960 at eta = 0.1, 83/96 at eta = 1 (heuristic hypothesis; the values 0.87393 / 0.8636 need re-optimisation and a re-proved Part II).',
  },
  {
    id: 'p152-slack-range',
    holds: () => {
      const onLine = (l) => sigmaLowLM(l, sub('1', l));
      return eq(onLine('1/5'), '13/15') && eq(onLine('1/6'), '7/8')
        && ['1/6', '1/5', '3/16'].every((l) => eq(onLine(l), sub('11/12', div(l, '4'))))
        && eq(sub(sigmaLowLM('1/5', '4/5'), '7/8'), mul('-1', div('1/5', '24')))
        && eq(sigmaLowLM('17/100', '83/100'), '1049/1200')
        && cmp(mul('2', '83/100'), add('1', mul('3', '17/100'))) >= 0 && cmp(mul('2', '83/100'), add('1', mul('4', '17/100'))) < 0;
    },
    why: 'On the (15.8) slack range 2M >= 1 + 3l with M = 1 - l the low side is 11/12 - l/4: 13/15 at l = 1/5 (= 7/8 - l/24 on 2M = 1 + 3l); referee point (17/100, 83/100, 0) gives 1049/1200 and lies in the slack range but outside 2M >= 1 + 4l.',
  },
  {
    id: 'p152-growing-bstar',
    holds: () => {
      const b = G.b;
      for (let f = 0; f <= 4; f++) {
        for (let k = 0; k <= 400; k++) {
          const beta = [BigInt(k), 1600n];
          const val = add(div(beta, '2'), max0(div(sub(b, mul(add('1', String(f)), beta)), '12')));
          const c = cmp(val, div(b, '12'));
          if (c < 0 || (k > 0 && c === 0) || (k === 0 && c !== 0)) return false;
        }
      }
      return cmp(div(b, '10'), div(b, '12')) > 0;
    },
    why: 'Prop 4.2: beta/2 + max(0, (b - (1+f) beta)/12) >= b/12 for f = 0..4 on a 1/1600 grid of beta in [0, 1/4], equality only at beta = 0; killing the coset costs Z^{b/10} > Z^{b/12}.',
  },
  {
    id: 'p152-lemma202-margin-and-delta-cap',
    holds: () => {
      const s = Math.sqrt(16354);
      const minVal = 35 * s / 12696 - 1491 / 4232, dStar = 185 / 138 - 35 * s / 4692;
      const cert = 49 / 440640;
      const capCert = cert / (51 / 64), capExact = minVal / (51 / 64);
      return Math.abs(minVal - 2.2814731e-4) < 1e-11 && Math.abs(dStar - 0.38663756) < 1e-8
        && Math.abs(negE(dStar) - minVal) < 1e-13 && negE(dStar - 1e-3) > minVal && negE(dStar + 1e-3) > minVal
        && minVal > cert && Math.abs(capCert - 1.3955e-4) < 1e-8 && Math.abs(capExact - 2.863e-4) < 1e-6;
    },
    why: 'Lemma 20.2 binding row bin: min(-E*) = 35 sqrt(16354)/12696 - 1491/4232 = 2.2814731e-4 at delta* = 0.38663756 (local minimum of the closed form), above the certified 49/440640; by (20.10) a low-side shift Delta keeps the margin only down to -1.4e-4 certified (-2.9e-4 exact).',
  },
  {
    id: 'p152-c-gt-1-constants',
    holds: () => {
      const qs = primeNorms(200000);
      const P = (f) => qs.reduce((a, x) => a * (1 + f(x)), 1) - 1;
      return Math.min(...qs) === 7 && qs.includes(25) && !qs.includes(4) && Math.abs(P((x) => x ** -2) - 0.0700) < 2e-4 && Math.abs(P((x) => x ** (-13 / 6)) - 0.0466) < 2e-4
        && Math.abs(P((x) => (x - 1) / x ** 3) - 0.0624) < 2e-4;
    },
    why: 'Corrected C > 1 constant over Z[omega] primes of norm >= 5: Prod(1 + q^{-2}) - 1 = 0.0700 (referee), Prod(1 + phi(q)/q^3) - 1 = 0.062, against the write-up\'s 0.0466 from the wrong q^{-13/6} weight.',
  },
  {
    id: 'p152-local-constants',
    holds: () => {
      const okR = [7, 13, 19, 31, 49, 121].every((x) => Math.abs(x ** (1 / 6) * Math.sqrt(x) / (x - 1) - x ** (-1 / 3) / (1 - 1 / x)) < 1e-14);
      const base = (4 / 3) * (4 ** (-1 / 6) + 4 ** (-1 / 2) + 4 ** (-5 / 6)), t = 4 ** (1 / 6);
      const cls = [base + t, base - t, base - t];
      const avg = (base + t + cls[0] + cls[1] + cls[2]) / 4;
      const lamFrac = 2 / (3 + Math.sqrt(3));
      return okR && Math.abs(cls[0] - 3.405) < 1e-3 && Math.abs(cls[1] - 0.885) < 1e-3 && cls.every((c) => c > 0)
        && Math.abs(avg - base) < 1e-12 && Math.abs(base - 2.145) < 1e-3
        && Math.abs(lamFrac - 0.4226) < 1e-4 && Math.abs(lamFrac / (2 / 3) - 0.634) < 1e-3
        && Math.abs((Math.sqrt(3) - 1) / (Math.sqrt(3) + 1) - (2 - Math.sqrt(3))) < 1e-15
        && Math.abs(Math.sqrt(13) / 12 - 0.3005) < 1e-4;
    },
    why: 'Lemma R identity q^{1/6} sqrt(q)/(q-1) = q^{-1/3}/(1 - 1/q); mod-2 sketch coefficients 3.405, 0.885, 0.885 (never zero, average = unrestricted 2.145); lambda-unit rows carry 2/(3+sqrt3) = 0.4226 of the mass (factor 0.634); (w3 - w0)/(w3 + w0) = 2 - sqrt3 irrational; cancellation kernel ratio sqrt13/12 = 0.300.',
  },
  {
    id: 'p152-honest-scope',
    holds: () => /PT Lambda <= 0\.2 stands/.test(C.verdict) && /NO QED/.test(C.verdict) && /PT Lambda <= 0\.2 stands/.test(C.headline) && /NO QED/.test(C.headline)
      && C.outcome.rigorousGain === false && C.outcome.thetaPrime === '7/8' && C.outcome.endpointCertificate === null && C.outcome.conditionalLambda === null
      && C.strategies.length === 3 && C.strategies.every((s) => /^FAILS/.test(s.verdict) && s.endpointCertificate === null
        && s.referees.length === 2 && s.referees.every((r) => r.refuted === false) && s.proved.length >= 5 && s.notProved.length >= 3)
      && C.strategies[2].referees.some((r) => r.severity === 'major') && /HEURISTIC/.test(C.jointObstruction.items[4])
      && /heuristic/.test(C.verdict),
    why: 'No strategy gives theta\' < 7/8, no endpoint certificate, no conditional Lambda; each strategy has two non-refuting referees and lists unproved steps; the major referee finding on Strategy 3 is recorded; TRO values labelled heuristic; PT Lambda <= 0.2 stands; NO QED.',
  },
]);

export default BEAT78_PROP152;
