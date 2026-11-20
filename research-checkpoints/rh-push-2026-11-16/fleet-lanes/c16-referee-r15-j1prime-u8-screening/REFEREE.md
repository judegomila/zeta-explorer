# REFEREE: c16-referee-r15-j1prime-u8-screening (adversarial pass, lens: general)

Date 2026-11-19. Independent of the lane's author. Own derivations by hand; own code, local only, under
`scripts/memcap.sh 8` with `.venv-arb` (scripts kept outside the repo in `/tmp/ref_c16/`; no server unit was
started). Nothing here is a statement about zeros of zeta. Labels: PROVED (re-derived here), MEASURED
(floating point, no certificate), NOT CHECKED.

## 0. Ruling

**Holds, with one correction to a sentence the lane itself issued as a correction (E1).** The verdict
"partial result, referee lane, no attack, score 0" stands. No statement labelled PROVED in RESULT.md or in the
two files I re-derived in full (`REFEREE2_lemma-j1prime-u8-heat-inheritance.md`, `REFEREE2_control-zq.md`) is
broken. Lemma H now has two derivations (the lane's and this one). Requirement flags: R1 false, R2 false,
R3 false, R4 false, as the lane says.

## 1. Re-derivation of the PROVED statements

| statement | my derivation | result |
|---|---|---|
| Lemma J1' | lift = common pointwise factor `g(u) = exp(tau u^2/4) > 0`; a functional invariant under positive node scalings is unchanged | holds (one line). Function-side sign check: `u^2 <-> -d^2/dz^2`, so the multiplier is `exp(-(tau/4) d^2/dz^2)`; the series in the file is right |
| Lemma J1'' | monomial picks up `prod g(u_i)^(e_i) = exp(tau S/4)` | holds |
| Lemma H (H1) to (H4) | case table over sign of S (f in (0,1), f = 1, f > 1, f ranging over the whole interval as tau < 0 varies) and the position of M, lam relative to 0. `S > 0`: `M >= 0` or `M < 0 <= lam` inherited; `M <= lam < 0`: `fM <= lam` iff `f >= lam/M` iff `abs(tau) <= 4 log(M/lam)/S`. `S < 0`: `M <= 0` inherited; `0 < M <= lam`: iff `f <= lam/M`. In each inherited sub-case `lam S >= 0` or `M lam <= 0` is true, in each non-inherited one both are false. (H3) by `M -> -M`, `lam -> -lam`. (H4) immediate | holds exactly as stated, including the boundary `M = lam` (`tau* = 0`) and `lam = 0` |
| (C1) to (C3) | (C1) from H1/H2 with strict margin; (C2) margin for reverse Turan ratio, `S = 2h^2 = 0.32`, `abs(tau) S/4 = 1.6e-3` at `abs(tau) = 0.02`; (C3) division by a term of known sign | hold |
| (C4), (C5) | `F_tau = sum a_j exp(tau S_j/4) M_j`; Laguerre's rule is correctly quoted (CLASSICAL); `exp(tau (x-y)^2/4) = exp(tau x^2/4) exp(tau y^2/4) exp(abs(tau) x y/2)` | hold; (C5) is a list of what is not covered, not a theorem |
| ZQ: functional equation | `m` is a function of `(s - 1/2)^2` | holds |
| ZQ: density D | `-m'/m = sum_removed 1/(s - rho) - sum_added 1/(s - rho')`, `1/(s - rho) = int_1^inf x^(-s) x^(rho-1) dx`; removed pairs give `4 x^(-1/2) cos(gbar L) cos(dL)`, the quartet `4 x^(-1/2) cos(gbar L) cosh(eta L)` (d = half the gap) | `D = -4 x^(-1/2) cos(gbar L)(cosh(eta L) - cos(dL))`: holds |
| ZQ: defect bound | `cosh a - 1 <= a^2 cosh(a)/2`, `1 - cos b <= b^2/2`, `cosh(eta L) <= e^(eta L)`, `max L^2 e^(-aL) = 4e^-2/a^2`; `abs D <= 4 x^(-1/2)(x^eta + 1) <= 8` | holds |
| Lemma L with the pole clause | (1) no real pole of m: trivial zeros of zeta are simple, `G(-2n) != 0` gives a pole of `G gam` at `-2n`, hence at `1 + 2n` where gam is finite and non-zero; pole of m at 1 or 0 is a double pole at 1 or a pole at 0. (2) Landau at a finite abscissa gives a real zero of m and `-m'/m -> -inf` from the right against a non-negative transform. (3) `f >= 0` on the axis and `f(sigma) = -f(1 - sigma)` give `f = 0` | holds, relative to Landau's theorem (CLASSICAL). The pole clause is used in (1) only |
| translate lane: reflection branch | see E1 | the lane's corrected sentence is not exact |
| Klein row 1.6 | `T^(2A abs(e+a0)) + T^(2A abs(e-a0)) >= 2 T^(A(abs(e+a0) + abs(e-a0))) >= 2 T^(2A a0)` | holds |
| Klein W1 numbers | `(1 + log(10.8 log T)/log T)/(8/3)` at 3e12 | 0.44989: agrees |
| edge row 1.1 | `tau(p) = alpha + 1/alpha`: `i + 1/i = 0`; `i p^(-delta/2) - i p^(delta/2)` | holds |
| u7: closed form of `K_u`, Lemma 2, Lemma 3 | direct integration; `-phi'(v) = e^(-xv)(1/u + x(1 - v/u))` non-negative and non-increasing; `S_1 - S_2` algebra | hold |
| u5 Lemma 4 | half-plane harmonic measure `(2/pi) arctan(L/(2 delta))` | holds |
| counts row 1.5 | 360 + 392 = 752; 360 + 2,414 = 2,774; 40 + 4 x 80 = 360 | hold |
| T-NR | `w + 1/w = -c`: `abs w = 1` iff `abs c <= 2`; c = 2.2, q = 3: `log(1.55826)/log 3 = 0.40375`, height `pi/log 3 = 2.8596`; q = 2, c = 2.0506: b = 0.32385 | agree |
| Haar variance | `(1/2) sum_p Li_2(p^(-2 sigma))` (variance of `Re sum_k theta^k p^(-k sigma)/k`) | holds |

NOT CHECKED by me (the lane's rulings there are taken as reported): Maass-Selberg chain of the edge lane
(formulas (1) to (6), Proposition C), Theorem E1' (i) to (v), W2 converse, Theorem 1 (b), Proposition 4,
Lemma 2 (existence) of the translate lane, and the screening recomputations other than those in section 2.

## 2. Numeric checks rerun on different cases (MEASURED)

| check | case (not used by the lane) | result |
|---|---|---|
| Lemma H at kernel level (heat member built as `exp(tau u^2/4) Phi(u)` node by node, not through the factor `exp(tau S/4)`) | 1,500 random monomials of `Phi_zeta`, 2 to 4 nodes in [-1.2, 1.2], exponents +-1, +-2, +-3, both signs, both sides of the rule, six values of tau | 0 mismatches against (H1)/(H2) (inherited: 822; (H2): 678) |
| Turan ratio | u = -0.45, h = 0.25, tau = -1.3 | 0.128516553275 -> 0.123400197912 = `exp(tau h^2/2)` times the first, to 2e-17 |
| ZQ | zeros 150, 151 (318.853104256; d = 1.153515), eta = 0.2 | functional-equation defect 3.7e-31; closed form of m against the eight-point product 4.2e-34; `sup abs D` = 2.5809 against bound 16.488 (and 8); Laplace integral of D against `-m'/m(1.4 + 3.1i)`: 3.1e-21 on 5.1e-9; `f(2) = 2.35247e-9`, `f(-1) = -2.35247e-9`; `abs zeta` at the quartet point 2.39 |
| Davenport-Heilbronn | own evaluation (python-flint, four Hurwitz values) | `abs DH(0.808517 + 85.699348i)` = 6.5e-7, 0.357 on the line; sign changes on the line below 418 at step 0.0125: 302 (lane: 302), no near-touch below 0.01 |
| Haar variance | own sieve to 1e7 | 0.9709, 1.1688, 1.3113, 1.4224, 1.5134, 1.5905 (sigma = 1/2); 0.7035 ... 0.8405 (sigma = 0.59045): the lane's exact values; the 1.63 of the screened lane is not reproduced |
| reflection translate | six (T, L), exact minimisation over c | see E1 |

## 3. Errors

**E1 (substantive for one sentence; no ruling changes).** Row 1.3 of RESULT.md, false sentence 3 and
`REFEREE2_c15-u5-...` replace the lane's sentence by: "the reflected translate `alpha = -2c` has defect
`L^2/(8T)` and is better on spans shorter than `8 pi/log(T/2 pi)`". The first half is a lower bound, not the
value, and the second half is false for some origins.
Derivation: `Psi(t) = 2 theta(t) + 2 theta(2c - t) = 4 theta(c) + (t - c)^2/c + O(L^4/c^3)`. The single
parameter c sets both the stationary point and the constant `4 theta(c) mod 2 pi`; the constant has period
`pi/log(c/2 pi)` in c. Centring the phase therefore moves the stationary point off the midpoint by
`delta`, `abs(delta) <= pi/(2 log(T/2 pi))`, fixed by the arithmetic of T, and the defect is

`(L + 2 abs(delta))^2/(8T)`, between `L^2/(8T)` and `L^2/(8T) (1 + pi/(L log(T/2 pi)))^2`.

Measured (30 digits, exact minimisation in c):

| T | L | defect | `L^2/(8T)` | ratio | delta (half period) | `(L + 2 abs(delta))^2/(8c)` |
|---|---|---|---|---|---|---|
| 1e4 | 1 | 1.48133e-5 | 1.25e-5 | 1.185 | -0.0443 (0.213) | 1.48149e-5 |
| 1e5 | 1 | 1.86888e-6 | 1.25e-6 | 1.495 | 0.1115 (0.162) | 1.86954e-6 |
| 1e5 | 2 | 5.65742e-6 | 5.0e-6 | 1.132 | -0.0638 | 5.65837e-6 |
| 1e6 | 1 | 1.35213e-7 | 1.25e-7 | 1.082 | 0.0200 (0.131) | 1.35225e-7 |
| 1e7 | 1 | 1.62135e-8 | 1.25e-8 | 1.297 | 0.0695 (0.110) | 1.6215e-8 |
| 3e6 | 2 | 1.80695e-7 | 1.6667e-7 | 1.084 | -0.0413 | 1.80708e-7 |

The lane's own three numbers (1.491e-5, 1.3543e-7, 1.2336e-6) are 8 to 19 percent above `L^2/(8T)` for this
reason, not because "my minimisation in c stops a little short" (that accounts for 1.491 against 1.481 only);
the first referee's 1.87e-6 at T = 1e5 is 50 percent above. Counterexample to the crossover clause:
T = 100000.1, L = 2 < `8 pi/log(T/2 pi)` = 2.598: reflection 6.73e-6, k = 1 translate 6.49e-6 (reflection
worse); at T = 100000.25 the reflection gives 5.11e-6. Corrected sentence: "the reflected translate
`alpha = -2c` has defect `(L + 2 abs(delta))^2/(8T)`, `abs(delta) <= pi/(2 log(T/2 pi))` depending on T; it is
better than the k = 1 translate when `(L + 2 abs(delta))^2 < 8 pi L/log(T/2 pi)`, which holds for every origin
if `L < 8 pi/log(T/2 pi) - 2 pi/log(T/2 pi) (1 + o(1))` and for no origin if `L > 8 pi/log(T/2 pi)`. For a
fixed number of unit windows `K_tr = max(eta T log(T/2 pi)/pi, sqrt(8 eta T))(1 + O(1/log T))`; the second
term is an upper bound for the reflection branch." The asymptotic law with `(1 + o(1))` at fixed L survives
(the relative error is `O(1/(L log T))`, 50 percent at T = 1e5, L = 1).

**E2 (wording).** RESULT section 0 and section 3 count "eleven sentences false as written". Sentence 3 is
replaced by a sentence that needs E1; the count of false sentences in the refereed files is unchanged, but
the list of corrected sentences has one entry that should not be applied to campaign files as written.

**E3 (scope, already conceded by the lane).** "Every PROVED statement re-derived" (claim line) is wider than
the files support for lanes 2, 4, 5: several rows of `REFEREE2_control-zq.md` say "not rerun", and K1, the
kernel-search outcome and the paper runs against Z34, Z36, P53 were not redone. The lane states these
exclusions; the claim line should read "every PROVED statement except K1".

**E4 (label).** Lemma H is called "new". It is elementary sign bookkeeping for a positive scalar factor; it
is new as a campaign rule, not as mathematics. The lane does not present it as more. (C4) is correctly
labelled CLASSICAL. No known theorem is presented as new elsewhere; the lane itself relabels Theorem 1 of the
u7 lane as classical in content.

**E5 (fifth kind).** The "fifth kind of separation" is a reading of the screened lanes' tables, not a
recomputation; I confirm only that the three examples cited (DH coefficient relation `c(6) != 0`, the Haar
law of the torus function, the variance of `arg DH(1 + it)`) are properties of the coefficients and do not
fit any of the four kinds as worded. The lane labels this correctly in weakest step 2.

## 4. Other checks asked for

- Assumes RH: no. The conditional statements (Theorem 1 (a), Lemma 3, W1 to W3) are reported as conditional.
  Scope line 2 of the zero-statistics file correctly restricts "E_a has no on-line zero" to the verified
  height.
- Restates verified height: no statement at height is made.
- Controls: the lane has no device, so no battery applies. I ran the control objects that enter the lemmas:
  ZQ (new pair), backward heat (kernel level), Davenport-Heilbronn (off-line zero and on-line count), T-NR
  (closed form). All agree with the lane.
- Compute rules: two server units through `rhrun`, 8 cores and 12 GB, both reported stopped; Davenport-
  Heilbronn to T = 1e4 only, stated. I did not inspect the server.

## 5. Requirement flags (set by this referee)

| flag | value | reason |
|---|---|---|
| R1 | false | no argument about zeta; Lemma H, J1', Lemma L use nothing multiplicative |
| R2 | false | no statement at height |
| R3 | false | the lane confirms controls that pass; no mechanism is claimed to fail on controls |
| R4 | false | nothing passes to the critical line |

## 6. Weakest points of this pass

1. The rows listed as NOT CHECKED in section 1 rest on the lane's and the first referees' derivations.
2. All numerics are floating point; the reflection table uses a 41-point sup on each span.
3. The decision "a U8 search may run, restricted" is a recommendation; what is established is Lemma H and
   (C1) to (C4), now with two derivations.
