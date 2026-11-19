# c12-heat-tied-family-open-cell: pre-registration (written before any run, 2026-11-19)

Source: `push/c11-rs3-debranges-positivity-family/RESULT.md` (formula labels (C), (N1), (N2), (P), Lemma 1, rows "backward heat" and V3b).

## Cell 1: backward heat at (N2)

Object. X_tau(s) = 8 int_0^inf e^{tau v^2} Phi(v) cosh(2 (s - 1/2) v) dv, Phi(v) = sum_n (2 pi^2 n^4 e^{9v} - 3 pi n^2 e^{5v}) exp(-pi n^2 e^{4v}); X_0 = xi/2 in the c11 normalisation (to be checked numerically); tau is the Polymath time t (kernel e^{tau u^2/16} kappa with u = 4v). E_tau(z) = X_tau(1 - iz).
(N2) for the family, c11 formula (N2) with xi replaced by X_tau:

    (N2_tau)   q_1(rho; tau) := - Re{ X_tau'(rho) X_tau(rho + 1) } / ( |X_tau'(rho)| |X_tau(rho + 1)| ) >= 0   at every zero rho of X_tau with Re rho = 1/2.

Statistic. For tau in {-2, -1, -0.5, -0.2, -0.1, -0.05, 0, 0.05, 0.1, 0.2, 0.5, 1, 2}: F(tau) = number of on-line zeros with 0 < Im rho <= 500 at which q_1 < 0, N(tau) = number of on-line zeros found (sign changes of X_tau(1/2 + it), grid 0.02), T*(tau) = height of the first failure.
Outcomes.
- F(tau) >= 1 for every tau < 0 on the grid: heat FAILS at (N2) (as well as at the hypothesis/(N1)).
- F(tau) = 0 for some tau < 0: heat passes (N2) to height 500 at that tau; its only failing steps are the hypothesis and (N1).
- Monotonicity: T*(tau) non-decreasing in tau over the whole grid = "monotone"; one inversion or more = "not monotone" (the number of inversions between adjacent grid values is reported).
Prediction (not a result): F >= 1 for all tau < 0; T* non-decreasing; for tau large positive F = 0 to height 500 (zeros approach GAM-like spacing).
Control: LAT, E(z) = sin(L(z + i/2)) (passed in round 11); heat acts on it by a scalar (e^{-tau L^2/4} in the variable where it is cos), so its zeros do not move: to be stated as a lemma, with q recomputed.

## Cell 2: tied family V3b

Object. Row V3b of c11: w(s) = sum over chi in the family of 1/( xi(s, chi) xi(2 - s, conj chi) ), s = 1 - iz; on Re s = 1 this is sum |xi(1 - ix, chi)|^-2. Same parity, same modulus: the gamma and conductor factors are common, so zeros of w are zeros of

    w0(s) = sum_chi 1 / ( L(s, chi) L(2 - s, conj chi) ),    and for a pair {chi, conj chi}:  w0 = 0  iff  R(s) = [L(s,chi)/L(s,conj chi)] [L(2-s,conj chi)/L(2-s,chi)] = -1.

Necessary condition from Theorem 2 (to be written as a lemma): the tied condition implies w has no zeros and no poles in 1/2 < Re s < 3/2 (symmetric under s -> 2 - conj s).
Families: q = 5: {chi, conj chi}, chi(2) = i (odd). q = 7: the 3 odd characters; the 2 non-principal even characters. q = 13: the 6 odd characters; the 5 non-principal even characters.
Statistic. Z(q, family) = number of zeros of w0 in 1/2 < Re s < 1, 0 < Im s <= 500 for q = 5 (<= 100 for q = 7, 13 if cost requires; stated in the result). Each located zero used for a verdict is confirmed by (i) Newton refinement at 30 digits and (ii) a winding number of w0 on a small square, computed in Arb ball arithmetic.
Outcomes.
- Z >= 1 with one confirmed zero: V3b CLOSED BY COMPUTATION for that family (the joint-universality argument is not needed).
- Z = 0 to the stated height: V3b OPEN for that family, with the displayed inequality "w0(s) != 0 on 1/2 < Re s < 1, Im s <= T" and the measured minimum of |R + 1|.
Controls. T-NR: xi(s,chi) m(s), m(s) = 2 cosh((s - 1/2) log p) + c, |c| > 2. E_a: L(s + a, chi) L(s - a, chi). For each: name the first step at which its tied family fails and whether zeta's family fails at the same step.
Score rule. R3 for the tied family only if zeta's family satisfies an inequality that T-NR, E_a and heat fail at named steps. If Z >= 1 no score change.

## Addendum (written after the q = 5 screen to height 40 returned Z = 0 and before any run of the statistic below)

Reading Conrey-Li Theorem 2 (text opened in this lane): the hypothesis gives W(z)/W(z+i) analytic with non-negative real part on Im z > -1/2. On the boundary line Im z = -1/2 the outer function drops out: W(x - i/2)/W(x + i/2) = 1/( m(x - i/2) |W(x + i/2)|^2 ) where m is the analytic continuation of |W(x)|^-2. So a necessary condition is Re m >= 0 on Re s = 1/2 (to be written as a lemma). Three readings of "tied" are registered: (a) m = w (c11 literal), (b) m = 1/w (sum of the reproducing kernels), (c) m = v := sum_chi xi(s,chi) xi(2-s,conj chi) (sum of the norms).
Second statistic. C_w(q, family) and C_v(q, family) = number of sign changes on a grid of step 0.01, 0 < t <= 500, of

    S_w(t) = Re{ sum_chi 1/( xi(1/2+it,chi) conj xi(3/2+it,chi) ) },    S_v(t) = Re{ sum_chi xi(1/2+it,chi) conj xi(3/2+it,chi) }

(each divided by the common positive gamma modulus). One negative value of each is to be certified in Arb.
Outcomes: C >= 1 with a certified negative value: that reading of V3b is CLOSED BY COMPUTATION at the boundary step. C = 0: OPEN, with the displayed inequality S(t) >= 0 for 0 < t <= 500.
Controls for this statistic: single character (C must equal the number of zeros of L(s,chi) unless a phase vanishes), T-NR (p = 2, c = 2.5), E_a (a = 0.25).

## Addendum 2 (written after the T = 500 boundary runs for q = 5, 7 and before the runs below)

Observed: every fixed family at q = 5, 7 has C_v >= 1 (closed). The fraction of negative grid points falls with family size (0.25 single, 0.18 pair, 0.15 triple).
Conjectured mechanism (to be tested, mean-value type): for the full same-parity family mod q, orthogonality gives sum_chi L(1/2+it,chi) conj L(3/2+it,chi) = (phi(q)/2)(diagonal > 0) + off-diagonal of relative size about t/q, and the gamma phase is about -pi/4, so S_v(t) > 0 for t << q with margin about cos(pi/4).
Statistic: T_0(q) = first grid height (step 0.01, t <= 200) with S_v < 0, full odd family, q in {13, 29, 53, 101}; same for T-NR (p = 2, c = 2.5) and E_a (a = 1/4).
Predictions: T_0(q) grows with q (roughly linearly); T-NR first negative height stays in (2.97, 4.53) for every q (phase of m(3/2+it) exceeds pi/4 there); E_a has no margin (degree 2: gamma phase about -pi/2), negative fraction near 1/2.
Meaning: if confirmed this is a q-aspect mean-value inequality (orthogonality of characters, no multiplicativity), not a statement in every window of t; no score change.
