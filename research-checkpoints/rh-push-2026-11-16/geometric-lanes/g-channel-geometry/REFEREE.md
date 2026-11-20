# Referee report: g-channel-geometry/RESULT.md

Date: 2026-11-16. Adversarial pass. Sources re-read: PR 29 `research/rh/modules/channel-geometry.md` and
`SEPARATED_GOOD_CARRIERS_AND_SIGNED_CHANNEL_TEST.md` (refs/pr/29), PR 44 `theta_separated_tail.md`
(refs/pr/44), `pick/NEXT_STAGE.md`, the three scripts and logs next to RESULT.md.
Referee scripts were run from /tmp/ref-gchan (not kept in the repo); numbers are quoted below.

## Verdict

**The claimed verdict (precise obstruction) holds.** Theorems A, B, C and Proposition 2 were re-derived and
confirmed. No step assumes RH (the Bargmann statement is labeled conditional). No cancellation is claimed,
so the coordinate-change test is vacuous; Theorem A is correctly labeled a restatement. Four statements
need rewording (section "Errors" below); none of them breaks a PROVED step.

## Re-derivations

**(1.2) and (4.1).** Re-derived from the PR 29 form. For `f = J_b psi` and `log n` near `2b`,
`R_f(log n) = (1/2) R_psi(s_n)`; `log n >= log 2 > 2 delta` excludes same-packet terms; `m_{1/2}(J_b psi)
= sqrt2 cosh(b/2) m_{1/2}(psi)` vanishes on neutral envelopes. So `H[J_b psi] = Gamma[psi] - sum a_n Re
R_psi(s_n) - C_b[psi]`, and for `psi = N_t u`, `R_psi(s) = (1/2) cos(ts) R_u(s) + O(t^-K)`. Matches PR 29 (2)
and the normalisation `rho = m(t) - P(t)` in the script. CONFIRMED.

**Theorem A.** `conj V_j(-conj rho) W_k(rho) = 2 cosh^2(rho b) conj(Psi_j(conj rho)) Psi_k(rho)` checked.
On-line terms are `2 cos^2(gamma b) w w^*`. For an off-line pair the coefficients are conjugate
(`cosh^2(conj(rho) b) = conj cosh^2(rho b)`), so the pair sum is `c w v^* + conj(c) v w^*`, negative index
at most 1. Subadditivity gives the bound; the `T*T - I` count follows from congruence to `[[I,T*],[T,I]]`.
Random check: PSD plus `nu = 1, 2, 3` such terms gave at most `1, 2, 3` negative eigenvalues in 300 trials
each. CONFIRMED. Note the counting: a quartet `+-sigma +- i gamma` is TWO pairs in the theorem's sense.

**Theorem B.** The substitution `q = Lambda(e^s - 1)` was redone for general `(a, lambda)`: `ds =
dq/(Lambda + q)`, exponent `p = 2a - 1`, upper bound `1/(1-c_R) + b_R/(1-c_R)^2`, lower bound needs
`p >= 0` (stated as `a >= 1/2`). The sech factor is independent of `a, lambda, c`. `eta_R` and `E_{R,delta}`
match PR 44 sections 3 and 5 with `(1 - d_R)^-4` replaced by `((1+d_R)/(1-d_R))^4`. The DH Mellin
representation gives `a = 3/4`, `lambda = pi/5`; `d_1 = 0.6 e^{-(3 pi/5) e} = 3.57e-3 >= 3.38e-3`.
CONFIRMED.

**Theorem C.** (i) PR 29 sections 2-4 through (12) use the primes only via the three sums in its (3), then
Montgomery-Vaughan with arbitrary complex coefficients, Markov, and (6)-(8) with `M_b`. All are monotone
under `a_n -> eps_n a_n`, `|eps_n| <= 1`. CONFIRMED. (ii) `2 b t0 in 2 pi Z` gives `cos(t0 log n) =
cos(t0 s_n)`; all terms `a_n cos^2(t0 s_n) R_{u_0}(s_n) >= 0`; the lattice mean of `cos(2 t0 s)` is
`O(b/(T s))`; Chebyshev lower bound in a fixed multiplicative interval gives `M* >= c' e^b`. CONFIRMED.
(iii) `-F'/F = sum Lambda(n) cos(t0 log n) n^-s`. CONFIRMED.

**Proposition 2.** Quartet contribution `4 Re[(1 + cosh(2 rho b)) Psi(rho)^2] <= (6 - 2 e^{2 sigma b})
|Psi|^2` at the chosen phase; phase choice by continuity over a `gamma'` range `pi/b`. CONFIRMED, with the
unstated requirement that `u` have `|int u e^{-sigma x} e^{-i(gamma'-t)x} dx|` bounded below (true for
`u >= 0`, or generically after an `O(1)` offset).

## Numeric reruns (different cases)

Sign-blind carrier (independent code, different `b`, `delta`, envelope, lattice multiple):

| b | delta | envelope | t0 | P(t0), F_t0 | predicted | rho(t0), F_t0 | rho(t0), zeta |
|---:|---:|---|---:|---:|---:|---:|---:|
| 4.5 | 0.30 | bump | 9156.70 | 21.16 | 20.07 | -13.87 | +8.54 |
| 5.5 | 0.25 | cos^2 | 96397.20 | 40.27 | 40.87 | -30.63 | +7.63 |
| 6.5 | 0.20 | cos^2 | 809616.46 | 88.78 | 88.82 | -77.02 | +11.30 |

The `e^b` scaling and the negative sign reproduce. Additional observation: with the opposite lattice
phase (`2 b t1 in pi + 2 pi Z`, `eps_n = cos(t1 log n)`), `P = -40.29, -21.21, -88.78` and the carrier is
strongly positive. The sign of the resonance is set by the retained common phase `e^{-2ibt}`, as the proof
says.

DH control for Theorem B (referee, full DH kernel, exact `q`-substitution, 40 digits): evenness ratio 1.0;
`R = 40, delta = 3`, 8 jittered points (proved margin 4.75e-3): min eigenvalue 0.38265 against sech Gram
0.38283, row-sum deviation 9.6e-4, entrywise `|C - sech| / (d^2 sech / 8R^2) <= 0.93`. Outside the proved
range (`R = 3, delta ~ 3`; `R = 1, delta = 1`; `R = 0, delta = 0.25`, 10 points) the DH matrices are also
positive (0.372, 4.8e-3, 1.7e-10). DH passes. CONFIRMED.

DH control for the carrier theorem (referee, independent recursion for `Lambda_f`; `Lambda_f(2) = a_2 log 2`,
`Lambda_f(4)` checked by hand): `b = 5.5, delta = 0.25`: `max |Lambda_f| = 349`, `sum c^2 = 120`, exceptional
fraction 0.113, 20 of 2000 sampled carriers negative, min `rho = -7.9`. `b = 4.5, delta = 0.3`: 2 of 2000
negative, min `-1.96`. CONFIRMED (MEASURED).

## Errors and overstatements

1. **"The only property of Lambda it uses is |Lambda(n)| <= log n" is wrong as stated** (Verdict item 2,
   section 4.2 last bullet, section 4.3, section 6 table). With only `|c_n| <= log n` one gets `sum c_n^2/n
   = O(b^2)` in the annulus, the Markov threshold is `(log T / 2)^2 = b^2`, and the exceptional fraction is
   `O(r)`, not `O(r/b)`: the theorem is lost. What the proof uses is Chebyshev, `sum_{n <= Y} |c_n| = O(Y)`,
   together with `|c_n| <= log n`. The correct invariance class is the one Theorem C actually states:
   coefficients dominated by `Lambda(n)`. The DH failure is likewise failure of both bounds, not of the
   pointwise bound alone.

2. **`F_t0` is a witness for sign-blindness of the proof, not an L-function countermodel.** `H^eps` keeps
   zeta's gamma and pole terms and twists only the primes. It is not the Weil form of `F_t0`, which has
   square-root branch points at `1 +- i t0` and at the shifted zeros. The `-c e^b` is the uncancelled
   continuous-prime main term at height `t0`, the same term PR 29 cancels at height 0 with
   `e^b |c_{1/2}><c_{1/2}|`. RESULT section 4.2 says this in part, but "a countermodel inside the
   Euler-product class" (section 0) and "the carrier at t0 is negative for that form" should say "for the
   mixed form `H^eps`".

3. **"So it has to use Lambda >= 0 or Hecke structure at the carrier height" (sections 4.2, 7) is ARGUED,
   not PROVED.** Theorem C excludes arguments invariant under `Lambda -> eps Lambda`. An argument that uses
   the exact explicit formula, or the analytic continuation of `zeta'/zeta` across `Re s = 1`, is not in
   that class. The witness resonance sits at `sigma = 1/2` (the 1-line), which is the classically excluded
   case; the theorem says nothing about resonances of strength `T^sigma`, `0 < sigma < 1/2`, beyond the
   size-bound class. "Exceptional carriers are out of reach" must carry the qualifier "of size-bound and
   mean-value arguments".

4. **Minor.** (a) Section 3 numerics: the reported "min eig" is the minimum over two trials while the
   sech minimum and row-sum deviation are from the last (jittered) trial; `0.93` vs `0.979` with deviation
   `1.6e-3` is not a Weyl violation, but the juxtaposition is misleading. The last configuration never ran.
   (b) `dh_separated_tail.py` prints a different `L - 1` bound formula from the `d_R` in the text.
   (c) Section 5 gives Pick nodes as `x > 1/2`; `pick/NEXT_STAGE.md` states all positive reals in the
   centered variable. The identification Pick matrix = `Q` on `e^{-xt}` was checked:
   `(L(x)+L(y))/(x+y) = sum_rho 1/((x-rho)(y+rho))`. (d) Proposition 2 is true but close to automatic:
   any test whose zero-side mass sits above `H_0` is independent of verified height. The twin is an
   entire function with the symmetry, not a Dirichlet series (RESULT weak step 3 says so).
   (e) Theorem B is a statement about the PR 44 formula `H(U,V)` with `kappa_f` substituted; that this is
   "the" DH boundary-energy kernel rests on the PR 43 derivation being kernel-generic (not re-audited
   here; evenness of `kappa_f` was checked).

## Surviving claim

- Theorem A: PROVED (channel matrices have at most `nu` negative eigenvalues; restatement of Weil
  positivity, no mechanism).
- Theorem B: PROVED (PR 44 separated-tail positivity holds for the DH theta kernel; Euler-blind).
- Theorem C: PROVED given PR 29 (1)-(2), in the form: the separated-carrier proof is invariant under
  `Lambda -> eps Lambda`, `|eps_n| <= 1`, and for `eps_n = cos(t0 log n)` the mixed form `H^eps` has a
  carrier at `t0` of value `<= (1/2) log t0 - c e^b`. Arguments that see the primes only through sums of
  `|Lambda|` cannot certify exceptional carriers.
- Proposition 2: PROVED (independence from verified height; non-explicit family).
- DH sampled carriers negative: MEASURED, reproduced.
- Not established: that closing exceptional carriers requires positivity of `Lambda` or Hecke structure.

Nothing moves a bound. The result is an obstruction map for the PR 29 / PR 44 lanes.
