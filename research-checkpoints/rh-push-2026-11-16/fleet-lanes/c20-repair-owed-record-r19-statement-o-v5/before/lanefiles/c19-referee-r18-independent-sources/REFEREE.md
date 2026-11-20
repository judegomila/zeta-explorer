# REFEREE (adversarial, lens: general) for c19-referee-r18-independent-sources/RESULT.md

Date 2026-11-19 PST (2026-11-20 UTC). Object: a referee lane (second referees for five round-18 lanes, a source for Turan's
theorem, a referee for W5c). It makes no attack and no statement about zeros of zeta; neither does this file.

**Verdict: holds, with minor corrections (E1 to E5 below). No PROVED step of the lane failed re-derivation.**
Flags set by this referee: R1 false, R2 false, R3 false, R4 false (nothing of the kind is established; the lane claims none).

## 1. What was re-derived by hand

- tz bridge, constant of Theorem A (b). For D_P = sum a_n n^-s, a_1 = 1, a_P != 0: D'/D -> 0 as Re s -> +inf and -> -u as
  Re s -> -inf; a symmetric sum over zeros of density u/(2 pi) per unit height tends to +u/2 and -u/2 there. So the constant
  is -u/2 on both sides, for every a_P != 0, and no log abs(a_P) term can appear. Agrees with the lane's contour argument and
  with its closed form on 1 + a P^-s.
- U4. 2(1 + cos x)^2 = 3 + 4 cos x + cos 2x. Lemma GL (b) of the refereed lane (text read: "iff ... k -> Lambda_k(n) is
  positive definite") is false in the "only if" direction: Lambda_0 = 1, Lambda_1 = i gives symbol 1 - 2 sin(theta), minimum -1,
  while the inequalities read a_0 >= 0 only. The corrected statement (real parts, even extension) is the F. Riesz duality for
  the cone of non-negative cosine polynomials and is correct. T-NR values 4.81, -7.52, 22.03 recomputed from
  a + b = 2.2 sqrt 3, ab = 3: correct.
- HQ2. (1/u)^2/(1 - 1/u)^4 = u^2/(1 - u)^4; u^2 (1 - u)^-4 = sum_{k>=2} C(k+1, 3) u^k; a(n) = f(v_q(n)) is multiplicative and
  >= 1; zeros of m at 4 sinh^2(zL/2) = -+ i sqrt(eps); leading pole coefficient eps zeta(1/2)/L^4 (= -0.063264 at q = 2,
  eps = 1e-2 by hand). Proposition F: roots u = -q^(+-1/4); bound 0.1266 at q = 11, sigma = 2 recomputed. Lemma Q: correct.
- W5c. (i) is abs(A + B)^2 >= 0; (ii) sub-mean-value on disjoint discs plus Plancherel on horizontal lines gives
  (2 e^(u rho)/(pi rho)) with rho = min(D/2, 2/u); (iii) Plancherel; (iv) follows. Constant 0.499 = sqrt(2/(1.0862 e^2)) and
  "ub <= 1 when M <= 4u" recomputed: correct.
- Turan. sum abs(b_j) < (1/2)(8e(M+N)/N)^N gives the factor 2 and 8e. Corollary K.5 from K.4 with M = L: (N/(8e(L+N)))^N is
  decreasing in N on [1, L], value (16e)^-L at N = L: correct.
- tz server table: every summary number recomputed from `tz_server/compare.json`: ratio D(192)/D(96) in [0.2782, 0.9969], median
  0.7514; Form C negative in 30 of 30 at m = 48, 96, 192; lam_min/Lg in [-1.4186, -0.1937]; largest relative difference at m = 96
  5.93e-5 (next 6.5e-6, then 1.5e-7); largest absolute difference in Form D 7.6e-6; medians 0.368/0.320/0.226 and
  0.043/0.021/0.012. All as printed. Nesting of the 48/96/192-mode spaces confirmed in `ref2_tz_asm.py` (half-integer
  lattice with the same centre and spacing); monotonicity in m holds in every row.

## 2. Numeric checks run by this referee (different cases, own code, local, memcap 8 GB)

1. Truncation identity, new case: P = 7, non-multiplicative, complex leading coefficient a_7 = -2.5 + i (abs 2.69), a_4 complex;
   mpmath 30 digits; zeros by grid Newton, count equal to the argument-principle count (37 at T = 60.05, 149 at T = 240.05).
   Residual D'/D(s) + u/2 - sum_{abs Im beta < T} 1/(s - beta) at s = 0.5 + 3.3i: (-2.2e-4 + 0.0362i), then (-4.5e-6 + 0.0090i);
   at s = 1.7 - 11.2i: (0.01265 - 0.11551i), then (0.00309 - 0.02835i). It falls like 1/T and matches
   (u s - log abs(a_P))/(pi T) (predicted 0.01228 - 0.11553i and 0.00307 - 0.02890i). With a constant log abs(a_P) kept the
   residual stays at -0.99. Mean of Re beta 0.495, 0.516 against log abs(a_P)/u = 0.509. The lane's correction C1/C2 holds for
   complex a_P as well, with abs(a_P) (not a complex logarithm) in the tail.
2. HQ2, new parameters (q, eps) = (5, 0.3), (7, 3), (2, 50), 40 digits: functional equation residual 7e-43; G vanishes at
   1/2 + z_0 and at 1/2 + conj(z_0) + 2 pi i/L (2e-40); (s - 1/2)^4 G -> eps zeta(1/2)/L^4 to 6 digits; coefficient series
   against the closed form at s = 8: 1e-25. For (7, 3) and (2, 50) the distance is 0.505 and 2.90: the zeros of the factor
   leave the open strip, as the lane's corrected sentence 18 says ("inside the open strip when that distance is below 1/2").
3. D10: the lane's `local/d10_check.py` rerun with two other seeds (31337, 4242): identity 180 of 180 both times; (6, 0) at
   29 of 29; (4, 2) at 3 of 3 outside; (1, 2) and (3, 0) for the unpaired pairs; e_6 = product at 12 of 12 both times.
4. Turan K.3: 2,000 random instances (N <= 6, M <= 8): max over the range of abs(S_h) divided by the bound >= 10.9; no violation.
5. Source: the cited PDF was downloaded and Theorem K.3, Corollaries K.4, K.5 and the start of the proof were read in the
   extracted text. The statement is as the lane quotes it (factor 2, 8e, ordering, range M + 1 .. M + N).
6. Server: `rhstatus` shows no unit with the lane's prefix running; 106 MB of moment files remain, as stated.

## 3. Errors and corrections

| # | Where | Severity | Finding |
|---|---|---|---|
| E1 | RESULT section 8, "No file outside this directory was edited" | process, minor | `c18-d10-inertia-law-theorem-t-lemma-d/__pycache__/lib.cpython-313.pyc` and `quartet_lib.cpython-313.pyc` carry the time of the lane's `d10_check.py` run (22:40:26): importing the lane's `quartet_lib` wrote byte-code there. Also `RESULT.md` of three refereed lanes (tz bridge, D10, exact relation) carry one common modification time 22:34:35 inside this lane's run; this referee could not attribute that change (it may come from another workflow). Sentence to use: "No source or result file outside this directory was edited by this lane; importing `quartet_lib` wrote two .pyc files in the D10 lane's `__pycache__`." |
| E2 | REFEREE2 D10, section 1: "0 negative squares in 8 of 8 (ranks 1, 3, 6, 10, 15 = n(n-1)/2)" | wording | The rank formula is specific to that seed. With other seeds the same code gives rank 3 at degree 5 and rank 6 at degree 6 (the generator allows roots on the imaginary axis and at 0). The statement "0 negative squares" is unaffected (24 of 24 over three seeds). Sentence to use: "rank n(n-1)/2 when no root lies on the imaginary axis; lower otherwise". |
| E3 | `local/d10_check.py` | robustness | With seed 977 the fit stops with a singular evaluation matrix (section C). This is a property of the random point set, not of the theorem; the check has no retry. Not an error of a claim. |
| E4 | REFEREE2 U4, T-NR line: "the sign at 3^2 is negative because both roots are negative" | wording | With a + b = 3.81 and ab = 3 both a and b are positive; the sign comes from the factor (-1)^(k+1) (the local roots are -a, -b). The numbers are correct. |
| E5 | RESULT top and section 2, "Each lane now has 2 referees, both holding" | scope, already stated in weakest step 2 but not in the headline | For D10 the second referee confirmed Theorem Q through its conclusion at fresh points and the factorisation with the lane's own `Hmat`; for the tz bridge lane only Theorem A was re-derived; for the tz server lane only zeta cells were rerun (no control class). "2 referees" counts files, not two full re-derivations of every PROVED label. The learn step should keep that qualifier with the count. |

Not errors: the date 2026-11-20 is the UTC date of the server units; the first-test statement in section 1 agrees with the
ball run; the count "23 corrected sentences" matches section 3.

## 4. Controls, RH, verified height, novelty

- No zeta-only mechanism is claimed, so no control has to fail. The control statements that could be rerun cheaply were: the
  truncation identity for non-multiplicative and complex-coefficient series (holds, check 1: the identity reads no
  multiplicativity) and HQ2 (multiplicative, zeta's functional equation, off-line zeros: holds, check 2).
- Nothing in the lane assumes RH. One sentence in REFEREE2 tz server ("Form D ... must be non-negative at every m if the
  zeros seen are real") is a conditional remark about the measured windows and is not used.
- Nothing restates verified height as a result. Turan's theorem is presented as a located known theorem, not as new.
- Not checked by this referee: the ball-arithmetic runs themselves (only their logs and one independent float case), the
  server prime sums (only the comparison file), Theorem Q beyond the reruns above, Lemma S, Lemma V, Identity E.

## 5. Flags

R1 false, R2 false, R3 false, R4 false. aboutZeros false. The lane's
headline stands with E1, E2, E4, E5 applied.
