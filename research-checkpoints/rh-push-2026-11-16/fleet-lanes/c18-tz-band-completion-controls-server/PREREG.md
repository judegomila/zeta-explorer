# PREREG: c18-tz-band-completion-controls-server

Written 2026-11-20 before any run of this lane. Nothing below is a result.

## 0. Reading of the assignment (a choice of this lane, stated before the runs)

c17 lane 5 (section 3, Remark K) names the form N(theta) and a "completion candidate" but writes no formula for a completed form. Two forms are registered here. Form D is N(theta) itself and has no free choice. Form C is this lane's formalisation of "completion by the reflected half n -> t/(2 pi n)"; the sibling lane c18-tz-one-sided-bound-fe-reserve-bridge may define another one, and a verdict on Form C is a verdict on this formula only.

## 1. Operators (exact definitions)

Space. U > 0, H_U = L^2[0, U]. Test vectors at height t_w: h_j(s) = exp(i tau_j s), tau_j = t_w + (j - (m-1)/2) Delta, Delta = 2 pi/U, j = 0..m-1 (m consecutive Fourier modes of [0, U]; orthogonal, norm^2 = U). W(t_w, U, m) is their span. All forms are divided by U, so the statistic is inf of <h, Q h>/norm(h)^2 over W. A negative value is a violation by an explicit vector of L^2[0, U]; a positive value is a statement about W only.

Shift measures. For a (complex) measure mu on (0, U) with transform F(tau) = int e^(-i tau a) d mu(a), F1(tau) = int a e^(-i tau a) d mu(a), the operator A_mu = int C_a d mu(a) (C_a = compression of the shift by a) has, on the nodes, 2 Re A_mu with entries
  offdiag(j, k) = 2 (Im F(tau_k) - Im F(tau_j)) / ((k - j) Delta),   diag(j) = 2 Re (U F(tau_j) - F1(tau_j)).
(Derivation: <h_j, C_a h_k> = (e^(-i tau_k a) - e^(-i tau_j a))/(i (k-j) Delta), and (U - a) e^(-i tau_j a) on the diagonal.)

Components.
- Prime part P_F(theta): mu = sum over n <= X_theta of c_F(n) n^(-1/2) delta_(log n), X_theta = T0^theta (T0 the nominal height), c_F = coefficients of -F'/F. F(tau) = D(tau) = sum c_F(n) n^(-1/2 - i tau). Enters with sign -.
- Arch_F: the Fourier multiplier const_F + sum over gamma factors of Re psi(lambda + i x/2), compressed to W exactly (closed form with digamma, trigamma and an exponentially small Lerch sum; zeta: lambda = 1/4, const = -log pi; DH: lambda = 3/4, const = log 5 - log pi; E_a: lambda = 1/4 +- a/2, const = -2 log pi). Leading value: log(t/2 pi) Id.
- Pole_F: sum over pole points z (zeta: +-i/2; E_a: +-i(1/2 +- a)) of the rank-one terms N(z)/((tau_j - z)(tau_k - z)), N(z) = 2 - w e^(-i z U) - conj(w) e^(i z U), w = e^(i tau_0 U). Sign +.
- Zero terms (for controls defined by a zero exchange): the same rank-one formula at the zeros.
- Reflected part R_F(theta) (Form C only): mu = nu = sum over 2 <= n <= e^(Lg - u) of r_n delta_(Lg - log n), r_n = e^(-i omega_w) c_F(n) n^(-1/2) (Lg - log n)/log n, omega_w = 2 vartheta(t_w) - t_w Lg, Lg = log(t_w/2 pi), u = theta log T0. This is the term of frequency Lg - log n of the first phase harmonic -(1/pi) d/dx sin(2 Phi), Phi = vartheta + arg of the truncated Euler factor, linearised in the prime amplitudes, with the phase 2 vartheta frozen to its tangent at t_w. Atoms lie in (u, Lg): the candidate supplies the frequencies above the data band from the data below Lg - u. Sign -.

Form D (data form, N(theta)): U = u = theta log T0. Q_D = Arch + Pole - 2 Re A_P. For zeta the explicit formula gives Q_D = T_Z restricted to W (all zeros).
Form C (completed form): U = Lg(t_w), defined when u < Lg. Q_C = Arch + Pole - 2 Re A_(P restricted to a <= u) - 2 Re A_nu.

Statistic: s = lambda_min(Q/U)/Lg, Lg = log(t_w/2 pi). Tolerance M in {0, 1}: pass in a window iff lambda_min(Q/U) + 2M >= 0.

## 2. Discretisation and sizes

m = 96 (matrix 96 x 96 real symmetric; 9216 balls; under 1 MB). Heights T0 = 1e6, 1e8, 1e10, 1e12; 40 windows each, t_w = T0 + 128 w, w = 0..39. theta in {0.55, 0.65, 0.75, 0.85, 0.95, 1.0} for Form D; Form C where u < Lg (theta <= 0.85 at these heights).
Prime sums: a C program (quad-precision phases T0 log n, segmented sieve, OpenMP) accumulates, per object and window, moments sum c(n) n^(-1/2) e^(-i t_w log n)(log n - a_c)^q, q = 0..7, over cells of width 2^-9 in log n; D and D1 at any node follow by an 8-term expansion (truncation below 2e-16 of sum abs). Planned arrays: 26 objects x 40 windows x up to 14150 cells x 8 x complex = at most 1.9 GB per height; request at most 16 cores and 16 GB.
Range of n: 1e6: all theta. 1e8: all theta (X = 1e8). 1e10: all theta if the benchmark allows 4.6e8 primes with 26 objects, else zeta to 1e10 and chains to a stated smaller X. 1e12: all objects to X = 1e12^0.85 = 1.6e10 if the benchmark allows; zeta alone beyond that only if the measured rate allows it inside the 6 hours; cells not run are reported "not run".
A-priori radius of each D value: 1e-11 times sum abs(c(n)) n^(-1/2) (rounding of block sums of at most 4e4 terms, phase error below 1e-14 per term, expansion remainder). This bound is derived, not machine-checked; it is checked against a direct ball evaluation at 1e6.
Signs: each matrix is assembled in python-flint balls (128 bits; Arch, pole and zero terms in balls; D values as balls with the radius above). "Pass" = every pivot of an LDL factorisation of Q/U + 2M certified positive. "Fail" = v^T (Q/U + 2M) v certified negative for the float eigenvector v. Eigenvalues for zeta are enclosed to a stated tolerance by the same two tests. No GPU stage is planned (the matrices are small; the cost is the prime sum, which is CPU work with quad phases).

## 3. Objects

zeta. Liouville twist (eps(p) = -1). 24 random completely multiplicative sign chains, eps_j(p) = sign bit of splitmix64(p * 0x9E3779B97F4A7C15 + 121000 + j), j = 0..23 (own generator; not the harness arrays, which stop at 1e7). For these 25 the form is the pairing of N(theta): zeta's Arch, no pole. E_a = zeta(s+a) zeta(s-a), a = 0.1, 0.3 (prime side: D(tau + i a) + D(tau - i a)). T-NR (q, c) = (3, 2.2) as in the control battery: zeta's form plus 2 log q Id plus atoms -log q (-1)^k (rho^k + rho^-k) at k log q, rho = (c + sqrt(c^2 - 4))/2. ZQ (rational multiplier): in each window the two consecutive zeta zeros g1, g2 nearest t_w (Arb zeta_zero) are exchanged for the quartet gbar +- i eta, eta in {0.25, 0.05}; zero-side rank-one terms, mirror images included. DH (conductor 5): coefficients of -F'/F by the convolution recursion for n <= 1e8, own Arch; run where X_theta <= 1e8.
Backward heat (tau = -1): NOT RUN, registered as such. The object has no Dirichlet series and no zero table above height 2000 in the campaign; in this frame it enters through its zero set only (c17 section 6).

## 4. Controls of the code (before any reported cell)

K1. Two c17 section 5.3 reference entries: one pair against the tight background at T = 1e6, theta = 1/2, M = 0 (0.3901) and one pair alone at theta = 2, M = 1 (0.0236), by bisection on the sign of the smallest eigenvalue of this lane's matrices on W augmented by the two vectors v_z, v_conj(z) (so that the result does not depend on m); agreement to the four digits.
K2. Explicit formula: Form D for zeta at T0 = 1e4 from the prime side against the zero side (all Arb zeros below 1e5 on both signs, smooth tail): entries agree to 1e-3 absolute.
K3. D values from the moment engine against a direct ball sum over prime powers at T0 = 1e6: inside the radius.
K4. Each object: sum abs(c(n)) n^(-1/2) and max abs D on the nodes are printed; an object with zero coefficients is an error. DH: sum c(n) n^(-3) against -F'/F(3) from the Hurwitz form.

## 5. Predictions

Form D.
- Arch: log(t/2 pi) Id to relative 1e-5. Pole: norm below 1e-5 (size e^u/t^2).
- zeta: lambda_min >= 0 in every window (explicit formula and the verified height; a failure means an error of the code or of the radius). s = lower frame bound of the ordinates on W: predicted median between 0.02 and 0.5 for theta <= 0.85, decreasing in theta, abs(s) below 0.02 at theta = 0.95 and 1.0 (u > Lg: above the Nyquist band); at fixed theta not decreasing with t beyond 30 percent between 1e6 and 1e12.
- Sign chains and Liouville: fail at M = 1 in at least 90 percent of windows for theta >= 0.65 and in at least 50 percent at theta = 0.55 (heuristic: the symbol Lg - 2 Re D has standard deviation about u; for Liouville the condition is roughly lambda_max(T_Z/U) <= 2 Lg).
- E_a: a = 0.3 fails in every window; a = 0.1 passes in most windows at 1e6 for theta <= 0.65 and fails at 1e10 and 1e12 (heuristic cosh(a u) times the relative end-to-end fluctuation). Uncertain.
- T-NR (3, 2.2): fails in every window (atoms of weight log q rho^k, k up to u/log 3).
- ZQ: eta = 0.25 fails in every window; eta = 0.05 passes at M = 1 for theta <= 0.75 in most windows (c17 Theorem 2 (c): one pair below the one-pair threshold). If so, outcome (b) holds for Form D by a lemma already on file.
- DH: fails in every window by a large factor (zeros right of 1; coefficients of size n^0.62 after the normalisation).
Form C.
- Reflected part: mean-zero, operator norm of order Lg/2 (atoms of weight about Lg Lambda(n)/(sqrt n log n) at n = 2, 3, ...).
- zeta: FAILS at M = 0 in at least half of the windows for theta <= 0.75 (the linearised first harmonic drops products of prime amplitudes of the same order; no identity makes the completed measure positive). If zeta fails, outcome (c): the component at fault is the reflected part, and Form C is not run on the controls.
- If zeta passes Form C in every window at M = 0 with s not decreasing in t, Form C is run on chains, Liouville and ZQ, and the pass threshold for outcome (a) is: zeta passes in all windows at all heights run, with median s at 1e12 at least 0.7 of the median at 1e6, and every control class fails in at least 90 percent of windows at M = 1.

## 6. Outcomes

(a) as above, for Form C or Form D: MEASURED support, no score. (b) a control class passes (more than 10 percent of windows at M = 1 at some theta): named, with the mechanism. (c) zeta fails a form: which component. The requirement flags are set only from what is established; a measured separation is not R1 to R4.
