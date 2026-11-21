/**
 * @module proportion-to-all-bridge-2026-09-22
 * @fileoverview
 * The "positive proportion -> every zero" gap: the precise step separating the
 * Levinson/Conrey/PRZZ proportion results (kappa >= 5/12 unconditional, peer-
 * reviewed) and the pair-correlation lineage (67.25% simple-and-on-line,
 * Lamzouri Sept 2026 after the Aug 2026 Anthropic/Claude result) from RH
 * (N_0(T) = N(T)); the 67.25% figure is Alpoge-Furman arXiv:2608.13637, the
 * human-authored write-up of the Claude-discovered argument, and Lamzouri's
 * shorter proof, both unrefereed. NS-RIGID (imp-95530) names this step the pointwise
 * Hilbert-transform wall (b) and lists mollified moments / Selberg proportion /
 * near-line density as the one honest loophole outside its span. This module
 * interrogates that loophole directly against the literature.
 *
 * THE GAP IN ONE SENTENCE. Every proportion theorem bounds the number of
 * exceptions N(T) - N_0(T) by a MEAN VALUE over a T-length window whose
 * asymptotic carries an error term of size >= T^{1-delta} (Levinson: the
 * Littlewood/Jensen bound on int log|VM(a+it)| dt; pair correlation: the
 * F(alpha) second moment; density: N(sigma,T) <= T^{A(1-sigma)+o(1)}), while
 * the signal of ONE exceptional zero in that same mean value is a single
 * quantum of size ~ 1/log T (Levinson: 2 pi R/L per zero of V M right of the
 * line) or a positive-but-arbitrarily-small horizontal displacement
 * (Radziwill's sum_{T<gamma<2T} |beta - 1/2| << T log(1 + I(M))); so the
 * exceptions certified by any such method are >= error/quantum >> T^{1-delta}
 * log T, and "every zero" needs the mean value resolved to better than one
 * zero's contribution -- relative precision ~ 1/N(T) -- which is a pointwise
 * statement, not a mean value.
 *
 * LEVINSON MECHANISM (Conrey 1989 sec. 1-3; Bettin-Gonek 2017 (1.1)-(1.2)).
 * V(s) = Q(-1/L d/ds) zeta(s), L = log T, mollifier M of length T^theta,
 * a = 1/2 - R/L. Levinson's first step: if the proportion of zeros of V to the
 * right of the critical line is <= p then kappa >= 1 - 2p (Conrey's phrasing).
 * Littlewood's lemma on the rectangle [a, 2] x [T, 2T]: each zero of VM with
 * beta >= 1/2 contributes >= 1/2 - a = R/L to (1/2pi) int_T^{2T} log|VM(a+it)|
 * dt, so #{zeros of VM, beta >= 1/2} <= (L/(2 pi R)) int log|VM(a+it)| dt
 * + O(L). Jensen (AM-GM) then bounds int log|VM| <= T log((1/T) int |VM|^2),
 * and the mollified second moment (1/T) int |VM|^2 ~ c(R, theta) gives the
 * classical kappa >= 1 - (1/R) log c(R, theta). Two independent losses:
 *   (J) Jensen: equality iff |VM| is a.e. constant on the a-line -- impossible
 *       for a nonconstant meromorphic VM; the loss is >= 0 and, since log|VM|
 *       has order-one fluctuations along the line, of size ~ T.
 *   (E) the error term of the moment asymptotic, O(T^{1-delta}) at best
 *       (Deshouillers-Iwaniec Kloosterman averages for theta < 4/7; general
 *       coefficients only to theta = 17/33, Bettin-Chandee-Radziwill 2017).
 * Either loss alone exceeds the one-zero quantum 2 pi R/L by a factor >~ N(T).
 *
 * PUBLISHED ANCHORS (rigorous, cited):
 *  R1 Radziwill 2012, Thm 1 (unconditional): for every theta > 0, every
 *     Dirichlet polynomial M_theta of length T^theta with a(1) = 1, a(n) << n^eps,
 *     I(M_theta) := (1/T) int_T^{2T} |1 - zeta M_theta(1/2+it)|^2 dt >= c/theta
 *     (c > 0 absolute; c = 1 for theta < 1/2 by Soundararajan's Prop. B; on
 *     RH + PCC, Thm 2: I >= (1 + o(1))/(0.5 + theta)). The floor is CAUSED by the
 *     on-line zeros: a length-T^theta polynomial cannot resolve features shorter
 *     than 1/(theta log T) in t, while zeros are spaced ~ 1/log T. So
 *     mollification at any FINITE theta leaves a definite fraction of the line
 *     unmollified -- the t-resolution form of the uncertainty principle.
 *  R2 Bettin-Gonek 2017, p.1: "[Radziwill's] work implies that Levinson's
 *     method can give kappa = 1 only if it is used with mollifiers of length
 *     T^theta, where theta is arbitrarily large." This is the published,
 *     theorem-backed statement that the fixed-length mean-value class is
 *     proportion-capped.
 *  R3 Bettin-Gonek 2017, Thm 1: if I_N(0,T) := int_0^T |M_N zeta(1/2+it)|^2 dt
 *     << T^{1+eps} for all 2 <= N <= T^theta, then zeta has no zeros in
 *     Re s > 1/2 + 1/(2 theta); theta arbitrarily large => RH. Thm 2 ([T,2T]
 *     window): half-plane Re s > 1/2 + 2/theta, nontrivial only for theta > 4,
 *     and sharp: a single off-line zero beta_0 + i gamma_0 forces
 *     I_N(T,2T) = c_1 N^{2 beta_0 - 1} log T / (T^3 log^2 N) (1 + ...) + O(T^{1+eps}),
 *     I_N(0,T) = N^{2 beta_0 - 1} (C(N) + o(1)) / log^2 N + O(T^{1+eps}).
 *     So the mollified mean square DOES see a single off-line zero -- with
 *     signal N^{2(beta_0 - 1/2)} against a diagonal noise floor T -- and the
 *     detection condition is exactly theta (2 beta_0 - 1) > 1. This is the
 *     quantitative "mean value <-> every zero" dictionary: length T^theta
 *     <-> horizontal resolution 1/(2 theta). Every finite theta is blind to
 *     the strip 1/2 < beta <= 1/2 + 1/(2 theta); "every zero" is theta = inf.
 *  R4 Montgomery-Vaughan mean value theorem: int_0^T |sum_{n<=N} a_n n^{-it}|^2 dt
 *     = sum |a_n|^2 (T + O(n)). The averaging gain of a t-mean over [0,T] is
 *     min(1, T/N): for N > T the mean value is pointwise-strength (no gain).
 *     The Bettin-Gonek threshold theta = 1 (where 1/2 + 1/(2 theta) first drops
 *     below 1 and the bound first beats the trivial half-plane) coincides with
 *     the length-equals-height point where mean-value technology loses its
 *     averaging. The two are the same wall as NS-RIGID (b): there, a FIXED-
 *     length von Mangoldt polynomial bounded POINTWISE at heights beyond its
 *     length; here, a polynomial LONGER than the height bounded in mean. Dual
 *     formulations of "Dirichlet polynomial beyond its conductor".
 *  R5 Farmer 1993 ("theta = inf conjecture": (1/T) I_{T^theta}(0,T) -> 1 + 1/theta
 *     for every theta > 0) proves kappa = 1, i.e. N(T) - N_0(T) = o(N(T)) --
 *     "100%" as asymptotic density, NOT N_0 = N. Bettin-Gonek upgrade the SAME
 *     hypothesis to RH proper, but by the single-zero signal (R3), not through
 *     Levinson's proportion functional. Farmer's heuristic and Radziwill's
 *     Thm 2 (I >= 1/(0.5 + theta) on RH + PCC) are consistent; whether RH (or
 *     RH + PCC) IMPLIES theta = inf is open (Bettin-Gonek and Dong-Wattana-
 *     wanichkul-Zaharescu 2026 prove only the direction theta = inf => RH).
 *
 * PAIRING-BY-PAIRING (task 2).
 *  (a) proportion + density + Deuring-Heilbronn. Proportion and density are
 *      both UPPER bounds on the exception count: N - N_0 <= (1 - kappa) N and
 *      N(sigma, T) <= T^{A(1-sigma)+o(1)} (Guth-Maynard A = 30/13). The
 *      integrality lever N < 1 => N = 0 needs A(1 - sigma) log T < 0, false for
 *      every sigma < 1, T > 1 (zero-density-lambda-inert-2026-07-09 lever 4);
 *      Bohr-Landau 1914 already gives N(sigma,T) = o(N(T)) for every sigma > 1/2
 *      -- a "100% within eps" statement that is not RH. Log-free density
 *      N(sigma,T) << T^{c(1-sigma)} gives BOUNDED exception counts only for
 *      1 - sigma <~ 1/log T, the far right edge, where Deuring-Heilbronn
 *      repulsion then acts on an exceptional REAL zero near s = 1 (Linnik's
 *      three principles). Repulsion presupposes the exceptional zero and moves
 *      the OTHER zeros; it never removes the exception, and it has no regime
 *      in the bulk near sigma = 1/2 where ~ (log T)/2pi zeros per unit height
 *      sit and the functional-equation pair (beta, 1 - beta) is at horizontal
 *      distance 2 beta - 1 with no repulsion normalisation available. Verdict:
 *      "few", never "none"; the pairing does not close.
 *  (b) Conrey-Ghosh-Gonek / Montgomery simple-zero route. RH-conditional
 *      results (Montgomery 2/3 simple on RH; CGG 19/27 on RH + GLH; Bui-Heath-
 *      Brown 19/27 on RH) bear on all-on-line by definition not at all.
 *      Unconditional: Baluyot-Goldston-Suriajaya-Turnage-Butterbaugh (Montgomery's
 *      theorem without RH, weight w(rho - rho') = 4/(4 - (rho - rho')^2)) => the
 *      horizontal-distribution mechanism (diagonal rho = rho' bounded by 4/3 of
 *      the zeros, symmetric-diagonal rho' = 1 - conj(rho) therefore <= 1/3, so
 *      >= 2/3 on the line) under a box hypothesis |beta - 1/2| < b/(2 log T);
 *      Lamzouri Sept 2026 (Hilbert-space inequality on the conjugation-
 *      invariant multiset Z_T = {i (rho - 1/2) log T / 2pi}: real elements
 *      <=> beta = 1/2) removes the box hypothesis and the weight: 67.25%
 *      simple-and-on-line, 83.62% distinct, unconditional; the constant is the
 *      Montgomery-Taylor C_MT = 3/2 - cot(1/sqrt 2)/sqrt 2 and is OPTIMAL for the
 *      method (Lamzouri Rem. 3.4 via Carneiro-Chandee-Littmann-Milinovich);
 *      Wang Sept 2026 adds 6.7e-8. Structural cap (Lamzouri sec. 2): horizontal
 *      control with no a priori information on beta needs a kernel with
 *      Re K(z) >= 0 for ALL complex z, and no nonconstant entire kernel has it.
 *      Ceiling of the whole lineage: Goldston-Lee-Schettler-Suriajaya show full
 *      PCC without RH => asymptotically 100% simple and on the line (Gallagher-
 *      Mueller 1978 method) -- again density 1, o(N(T)) exceptions, not RH.
 *      Does not reach RH.
 *  (c) Selberg gaps and the recent small/large-gap results (Selberg's positive
 *      proportion of gaps below and above the mean; Conrey-Ghosh-Gonek small
 *      gaps on GRH; Goldston et al. 2022+) are statistics of the ORDINATES
 *      gamma_n alone; N(T) counts zeros by ordinate irrespective of beta, so
 *      gap statements are blind to horizontal position and cannot bear on
 *      all-on-line. (The RH-conditional F(alpha) is likewise ordinate-only;
 *      horizontal content enters the unconditional versions only through the
 *      w-weight / symmetric-diagonal split of (b), capped at C_MT.)
 *
 * TASK 3 -- THE CRUX, SETTLED IN TWO HALVES.
 *  META-OBSTRUCTION MV-CAP (elementary; hypotheses exact). Let a method output
 *  N(T) - N_0(T) <= (1/q(T)) [ Phi_T + E(T) ] where Phi_T is a T-window mean
 *  value to which each exceptional zero contributes >= q(T) > 0, and E(T) is
 *  the error with which Phi_T is known. Then the certified exception bound is
 *  >= E(T)/q(T), and it is 0 only if E(T) < q(T). For Levinson q = 2 pi R/L
 *  ~ 1/log T and E >= T^{1-delta} (moment error) + Jensen loss ~ T; for pair
 *  correlation and density q ~ 1 and E >= T^{1-delta} log T. Hence: (H1) any
 *  mean value over a window of length T known to error E(T) -> inf certifies
 *  >= E(T)/q(T) -> inf exceptions; (H2) with error o(1) it would need relative
 *  precision ~ 1/(T log T) = 1/N(T), i.e. per-zero resolution = pointwise. In
 *  addition, FIXED-LENGTH mollified moments are provably capped independently
 *  of error terms: (R1) I(M_theta) >= c/theta so Levinson's functional stays
 *  strictly below 1 at every finite theta (R2), and (R3) a length-T^theta mean
 *  square is blind to the strip beta <= 1/2 + 1/(2 theta). Under H1 or the
 *  fixed-theta hypothesis the mean-value class cannot reach RH. This is the
 *  mollifier-class analogue of NS-RIGID.
 *  THE LOOPHOLE (precise, open, NOT closed by MV-CAP). Bettin-Gonek R3 is a
 *  mean-value statement that DOES imply every zero on the line: the theta = inf
 *  conjecture, or for a quasi-RH half-plane a single fixed theta > 1 (theta > 4
 *  on [T,2T]). MV-CAP does not apply because for N > T the hypothesis is not an
 *  asymptotic-with-error but a bound << T^{1+eps} on a quantity whose single-
 *  zero signal N^{2 beta_0 - 1} dwarfs T. The missing input is exact: an upper
 *  bound int_0^T |M_N zeta(1/2+it)|^2 dt << T^{1+eps} for mollifiers longer than
 *  the height, N = T^theta, theta > 1. Known: asymptotics for theta < 4/7
 *  (Conrey, specific mollifier), theta <= 17/33 = 0.5152 (BCR 2017, general
 *  coefficients), theta < 3/4 (BCR via Watt, special shape); nothing at theta = 1.
 *  Beyond theta = 1 the Montgomery-Vaughan diagonal T sum|a_n|^2/n no longer
 *  dominates the off-diagonal Mobius bilinear form sum_{m != n} a_m a_n
 *  (mn)^{-1/2} sin(T log(m/n))/log(m/n): the required cancellation is in Mobius
 *  correlations beyond the conductor, and by R3 it is at least quasi-RH-hard
 *  (theta > 1 already gives a zero-free half-plane Re s > 1/2 + 1/(2 theta) < 1,
 *  beyond every known zero-free region). No theorem shows it CIRCULAR (RH =>
 *  theta = inf is open), so the loophole is genuine; it simply carries no
 *  mean-value discount.
 *
 * ODDS (honest). That the theta > 1 twisted moment is proved by extending
 * moment technology (Kloosterman/Kuznetsov, spectral large sieve): very low --
 * the averaging gain is exhausted at theta = 1 (R4) and the target is quasi-RH
 * by R3. That the mean-value formulation nonetheless matters: moderate -- it
 * recasts a zero-free half-plane as a Mobius bilinear form, an attackable
 * shape different from the explicit-formula positivity route, and decidable
 * in a conditional form. No probability is attached to RH itself here.
 *
 * HIGHEST-VALUE SUB-QUESTION. The converse of Bettin-Gonek: does RH (or RH +
 * PCC, or RH + a Montgomery-Vaughan-type large-sieve conjecture) imply
 * I_{T^theta}(0,T) << T^{1+eps} for some theta > 1? Radziwill Thm 2 gives the
 * lower bound 1/(0.5 + theta) on RH + PCC and Farmer's heuristic the matching
 * upper bound; the upper bound is unproved for every theta >= 1/2 + 0.0152.
 * If YES: theta = inf <=> RH and the mean-value formulation is a genuine RH-
 * equivalent with bilinear-form structure. If NO: Levinson's method is capped
 * at kappa < 1 in principle, closing the mollifier class outright. Either
 * answer settles the residual that NS-RIGID left open. A cheap numerical probe
 * (I(L_theta) at T ~ 1e3, theta up to 2-3, N = T^theta <= 1e9 terms) is feasible
 * offline and would test Farmer's 1 + 1/theta beyond theta = 1 for the first time.
 *
 * SCOPE. Assessment + literature ledger; changes no bound; PT Lambda <= 0.2 is
 * SOTA; RH open; NO QED. Import-free (no zeros bundle, no sibling imports).
 */

const C_MT = 1.5 - Math.cos(1 / Math.SQRT2) / Math.sin(1 / Math.SQRT2) / Math.SQRT2; // Montgomery-Taylor
const bgHalfPlane = (theta) => 0.5 + 1 / (2 * theta); // Bettin-Gonek Thm 1, window [0,T]
const bgHalfPlane2T = (theta) => 0.5 + 2 / theta; // Bettin-Gonek Thm 2, window [T,2T]
const detectionTheta = (beta) => 1 / (2 * (beta - 0.5)); // mollifier exponent needed to see a zero at beta
const densityBound = (sigma, T, A) => Math.pow(T, A * (1 - sigma)); // N(sigma,T) <= T^{A(1-sigma)}
const levinsonQuantum = (R, T) => (2 * Math.PI * R) / Math.log(T); // 2 pi R / L per exceptional zero of VM

export const PROPORTION_TO_ALL_BRIDGE = Object.freeze({
  id: 'proportion-to-all-bridge-2026-09-22',
  date: '2026-09-22',
  question:
    'What exactly separates "a positive proportion kappa of zeros on the line" from "every zero on the line", and is the mean-value (mollified-moment / pair-correlation / density) class intrinsically proportion-capped?',
  gapStatement:
    'Every proportion theorem bounds N(T) - N_0(T) by a T-window mean value known only to error >= T^{1-delta}, while one exceptional zero contributes a single quantum ~ 1/log T (Levinson: 2 pi R/L) to that mean value; certifying zero exceptions needs the mean value to relative precision ~ 1/N(T), which is a pointwise statement -- the NS-RIGID wall (b) in its dual, long-mollifier form.',
  verdict:
    'FIXED-LENGTH mean-value methods are provably proportion-capped (Radziwill I >= c/theta; Bettin-Gonek: kappa = 1 needs theta arbitrarily large; length T^theta is blind to beta <= 1/2 + 1/(2 theta)); the class is NOT closed as a whole, because Bettin-Gonek prove the theta = inf conjecture (a mean value with mollifiers LONGER than the height) implies RH. The bridge is real, exact, and quasi-RH-hard: I_{T^theta}(0,T) << T^{1+eps} for some theta > 1.',
  ledger: {
    levinsonRecord: { kappa: 5 / 12, source: 'Pratt-Robles-Zaharescu-Zeindler 2020 (peer-reviewed)' },
    pairCorrelationRecord: { simpleAndOnLine: 0.6725007, distinct: 0.8362505, source: 'Alpoge-Furman arXiv:2608.13637 (Aug 2026; argument discovered and written by Claude/Anthropic, verified by the listed authors) and Lamzouri arXiv:2609.02882 (Sept 2026, shorter Hilbert-space proof); both unconditional, unrefereed; B. Wang arXiv:2609.24167 adds 6.66624e-8' },
    montgomeryTaylorConstant: C_MT,
    twistedMomentRange: { conreySpecific: 4 / 7, generalCoefficients: 17 / 33, specialShapeViaWatt: 3 / 4, neededForQuasiRH: 1, neededForRH: Infinity },
    radziwillFloor: 'I(M_theta) >= c/theta for all theta > 0 (c = 1 for theta < 1/2; on RH+PCC I >= 1/(0.5+theta))',
    bettinGonek: 'I_N(0,T) << T^{1+eps} for N <= T^theta => zeta zero-free in Re s > 1/2 + 1/(2 theta); [T,2T] version: Re s > 1/2 + 2/theta',
    pccCeiling: 'full PCC without RH => asymptotically 100% simple and on the line (Goldston-Lee-Schettler-Suriajaya), i.e. o(N(T)) exceptions, not RH',
    kernelObstruction: 'unconditional horizontal control by the Hilbert-space / pair-correlation method needs Re K(z) >= 0 on all of C; no nonconstant entire kernel exists (Lamzouri sec. 2)',
  },
  pairings: {
    densityRepulsion: 'FAILS: density is a positive upper bound (>1 for all sigma<1); Bohr-Landau already gives 100%-within-eps; log-free bounded counts exist only at 1 - sigma <~ 1/log T; Deuring-Heilbronn presupposes the exceptional zero and moves the others; no bulk analogue near sigma = 1/2.',
    simpleZerosPairCorrelation: 'FAILS: RH-conditional results bear nothing; unconditional lineage capped at C_MT = 0.6725 (method-optimal), full PCC gives asymptotic 100% only; kernel positivity on C impossible.',
    gaps: 'IRRELEVANT: ordinate-only statistics, blind to beta.',
  },
  metaObstruction: {
    name: 'MV-CAP',
    hypotheses: [
      'H1: output has the form N - N_0 <= (Phi_T + E(T))/q(T), Phi_T a T-window mean value, each exception contributing >= q(T) to Phi_T, and E(T) -> inf (true of every asymptotic-with-error-term method: Levinson E >= T^{1-delta} + Jensen loss ~ T, q = 2 pi R/L; pair correlation and density E >= T^{1-delta} log T, q ~ 1).',
      'H2 (fixed length): the mollifier has length T^theta with theta fixed -- then Radziwill I >= c/theta caps Levinson below 1 and Bettin-Gonek blindness to beta <= 1/2 + 1/(2 theta) caps the mean square, independently of error terms.',
    ],
    conclusion: 'Under H1 the certified exception count is >= E(T)/q(T) -> inf; under H2 the output is a proportion < 1 or a half-plane strictly right of the line. Neither reaches RH. Analogue of NS-RIGID for the mollifier class.',
    doesNotCover: 'Bounds (not asymptotics) on mollified moments with N > T: there the single-zero signal N^{2 beta_0 - 1} exceeds the noise floor T, and Bettin-Gonek show such a bound implies a zero-free half-plane / RH.',
  },
  loophole: {
    statement: 'int_0^T |M_N zeta(1/2+it)|^2 dt << T^{1+eps} for all 2 <= N <= T^theta with some theta > 1 (=> zero-free Re s > 1/2 + 1/(2 theta)); for all theta (=> RH).',
    missingInput: 'Cancellation in the off-diagonal Mobius bilinear form sum_{m != n <= N} a_m a_n (mn)^{-1/2} sin(T log(m/n))/log(m/n) for N > T, beyond the Montgomery-Vaughan / Kuznetsov averaging range; not circular by any known theorem (RH => theta = inf is open) but at least quasi-RH-hard by Bettin-Gonek Thm 1.',
    sameWallAs: 'NS-RIGID (b): a Dirichlet polynomial beyond its conductor -- fixed length pointwise at large height (b) <-> length exceeding height in mean (here); Montgomery-Vaughan T + N makes the two equivalent in strength.',
  },
  odds: 'Extension of moment technology past theta = 1: very low (averaging gain exhausted at theta = 1; target is quasi-RH by theorem). Value of the reformulation: moderate (zero-free half-plane as a Mobius bilinear form; decidable conditionally). No probability attached to RH.',
  subQuestion: 'Converse of Bettin-Gonek: does RH (+ PCC or a large-sieve-type conjecture) imply I_{T^theta}(0,T) << T^{1+eps} for some theta > 1? YES => theta = inf <=> RH (new RH-equivalent with bilinear structure); NO => Levinson capped at kappa < 1 in principle. Cheap offline probe: I(L_theta) at T ~ 1e3, theta in (1, 3].',
  status: 'RH OPEN; no refereed bound is changed; NO QED; changes no bound',
  references: [
    'N. Levinson, More than one third of zeros of Riemann\'s zeta-function are on sigma = 1/2, Adv. Math. 13 (1974) 383-436.',
    'J. B. Conrey, More than two fifths of the zeros of the Riemann zeta function are on the critical line, J. reine angew. Math. 399 (1989) 1-26.',
    'K. Pratt, N. Robles, A. Zaharescu, D. Zeindler, More than five-twelfths of the zeros of zeta are on the critical line, Res. Math. Sci. 7 (2020); arXiv:1802.10521.',
    'D. W. Farmer, Long mollifiers of the Riemann zeta-function, Mathematika 40 (1993) 71-87.',
    'M. Radziwill, Limitations to mollifying zeta(s), arXiv:1207.6583 (2012).',
    'S. Bettin, S. M. Gonek, The theta = infinity conjecture implies the Riemann hypothesis, Mathematika 63 (2017) 29-33; arXiv:1604.02740.',
    'S. Bettin, V. Chandee, M. Radziwill, The mean square of the product of the Riemann zeta-function with Dirichlet polynomials, J. reine angew. Math. 729 (2017) 51-79; arXiv:1411.7764.',
    'A. Dong, N. Wattanawanichkul, A. Zaharescu, The theta = infinity conjecture and the Riemann Hypothesis for automorphic L-functions, arXiv:2605.24363 (2026).',
    'S. Baluyot, D. A. Goldston, A. I. Suriajaya, C. L. Turnage-Butterbaugh, Pair correlation of zeros of the Riemann zeta function I: proportions of simple zeros and critical zeros, arXiv:2501.14545.',
    'D. A. Goldston, A. I. Suriajaya, An unconditional Montgomery theorem for pair correlation of zeros of the Riemann zeta function, arXiv:2306.04799.',
    'D. A. Goldston, J. Lee, J. Schettler, A. I. Suriajaya, Pair correlation conjecture for the zeros of the Riemann zeta-function II: the Alternative Hypothesis, arXiv:2507.06823.',
    'Y. Lamzouri, A new proof that more than 2/3 of the zeros of the Riemann zeta function are simple and on the critical line, arXiv:2609.02882 (Sept 2026).',
    'L. Alpoge, Furman (argument by Claude, Anthropic), More than two thirds of the zeros of the Riemann zeta function are simple and on the critical line, arXiv:2608.13637 (Aug 2026).',
    'B. Wang, Proportions of the non-trivial zeros of the Riemann zeta function, arXiv:2609.24167 (Sept 2026).',
    'H. Bohr, E. Landau, Ein Satz ueber Dirichletsche Reihen mit Anwendung auf die zeta-Funktion und die L-Funktionen, Rend. Circ. Mat. Palermo 37 (1914).',
    'L. Guth, J. Maynard, New large value estimates for Dirichlet polynomials, Ann. of Math. 203 (2026); arXiv:2405.20552.',
    'H. L. Montgomery, R. C. Vaughan, Hilbert\'s inequality, J. London Math. Soc. 8 (1974) 73-82.',
  ],
});

export const PROPORTION_TO_ALL_BRIDGE_ASSERTIONS = Object.freeze([
  {
    id: 'ptab-montgomery-taylor-constant',
    why: 'C_MT = 3/2 - cot(1/sqrt2)/sqrt2 reproduces the Lamzouri/Claude 0.6725007 headline to 1e-6',
    holds: () => Math.abs(C_MT - 0.6725007) < 1e-6 && C_MT > 5 / 12 && C_MT < 1,
  },
  {
    id: 'ptab-bettin-gonek-threshold-theta-1',
    why: 'the Bettin-Gonek half-plane 1/2 + 1/(2 theta) is nontrivial (< 1) iff theta > 1: the length-equals-height point where Montgomery-Vaughan averaging gain min(1,T/N) vanishes',
    holds: () =>
      Math.abs(bgHalfPlane(1) - 1) < 1e-12 &&
      bgHalfPlane(17 / 33) > 1 &&
      bgHalfPlane(4 / 7) > 1 &&
      bgHalfPlane(2) < 1 &&
      bgHalfPlane(1e9) > 0.5 &&
      Math.abs(bgHalfPlane2T(4) - 1) < 1e-12,
  },
  {
    id: 'ptab-finite-theta-blind-strip',
    why: 'a mollifier of length T^theta detects an off-line zero at beta only if theta > 1/(2(beta-1/2)); a zero at 1/2 + 1e-3 needs theta = 500, and the needed theta diverges as beta -> 1/2+ (every finite theta is blind to some strip)',
    holds: () => {
      if (Math.abs(detectionTheta(0.501) - 500) > 1e-9) return false;
      let prev = 0;
      for (const d of [1e-1, 1e-2, 1e-3, 1e-4, 1e-6]) {
        const th = detectionTheta(0.5 + d);
        if (!(th > prev)) return false;
        prev = th;
      }
      return prev > 1e5;
    },
  },
  {
    id: 'ptab-density-integrality-never-below-one',
    why: 'N(sigma,T) <= T^{A(1-sigma)} with Guth-Maynard A = 30/13 (or any A > 0) is > 1 for every sigma < 1, T > 1: the "few -> none" integrality lever has no regime in the strip',
    holds: () => {
      const A = 30 / 13;
      for (const T of [10, 1e6, 3e12])
        for (const s of [0.5, 0.75, 0.9, 0.999, 1 - 1e-9])
          if (!(densityBound(s, T, A) > 1)) return false;
      return Math.abs(densityBound(1, 1e6, A) - 1) < 1e-12;
    },
  },
  {
    id: 'ptab-levinson-quantum-vs-error',
    why: 'MV-CAP arithmetic: the one-zero quantum 2 pi R / log T (R = 1.3) at T = 3e12 is ~0.28 while any moment error T^{1-delta} (delta = 1/2) is ~1.7e6, so the certified exception floor E/q exceeds 1e6 and no fixed-length mean value certifies zero exceptions',
    holds: () => {
      const T = 3e12, q = levinsonQuantum(1.3, T), E = Math.sqrt(T);
      return q > 0.2 && q < 0.4 && E / q > 1e6 && q / T < 1e-12;
    },
  },
  {
    id: 'ptab-radziwill-farmer-consistency',
    why: 'Radziwill\'s RH+PCC floor 1/(0.5+theta) sits below Farmer\'s conjectured 1/theta for every theta > 0 and both -> 0 only as theta -> inf; at every finite theta the floor is positive (Levinson deficit (1/R) log(1 + c/theta) > 0)',
    holds: () => {
      for (const th of [0.1, 0.5, 4 / 7, 1, 4, 100, 1e6]) {
        const floor = 1 / (0.5 + th), farmer = 1 / th;
        if (!(floor > 0 && floor <= farmer)) return false;
        if (!(Math.log(1 + floor) / 1.3 > 0)) return false;
      }
      return 1 / (0.5 + 1e12) < 1e-11;
    },
  },
  {
    id: 'ptab-honest-scope',
    why: 'record states RH open / no QED / no refereed bound is changed, distinguishes asymptotic 100% from RH, and names the loophole as open rather than closed',
    holds: () =>
      /RH OPEN/.test(PROPORTION_TO_ALL_BRIDGE.status) &&
      /NO QED/.test(PROPORTION_TO_ALL_BRIDGE.status) &&
      /not RH/.test(PROPORTION_TO_ALL_BRIDGE.ledger.pccCeiling) &&
      /NOT closed as a whole/.test(PROPORTION_TO_ALL_BRIDGE.verdict) &&
      /open/.test(PROPORTION_TO_ALL_BRIDGE.loophole.missingInput) &&
      PROPORTION_TO_ALL_BRIDGE.references.length >= 12,
  },
]);

export default PROPORTION_TO_ALL_BRIDGE;
