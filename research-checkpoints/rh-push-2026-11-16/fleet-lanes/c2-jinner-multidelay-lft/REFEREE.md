# REFEREE (adversarial, lens: general) for c2-jinner-multidelay-lft/RESULT.md

Date: 2026-11-18. Referee verdict: **the claimed verdict (precise obstruction; family closed in the stated class)
holds.** Every step labelled PROVED was re-derived by hand and confirmed. One numeric check was rerun on a different
case and agrees with Theorem A' to second order; the DH formula (OUTLINE) was tested on a new non-separable case and
is consistent. No step assumes RH or restates verified height. Seven corrections of wording/scope are listed; none
changes the verdict. Flags set by the referee: R1=false, R2=false, R3=false, R4=false.

Referee scripts were kept outside the lane directory (`/tmp/ref_c2/ref.py`, `/tmp/ref_c2/corr.py`; run through
`scripts/memcap.sh 8`, local, mpmath dps 20, under 3 minutes each). The compute server was not used.

## 1. Re-derivation of the PROVED steps

**Normalisation (confirmed).** `N^2 = 0`, `JN = N*J = -E`, `N*JN = 0`, so `M(Z)* J M(Z) = J - (Re Z) E`.
`T_{M(Z)}[e] = (2e - Z(1+e))/(2 + Z(1+e)) = (1 - Z - Z_e)/(1 + Z + Z_e)`. `S = T_{M(alpha L)}[1]`.

**Lemma R (confirmed).**
- Step (1): `Theta(x_n) -> Theta~(0)` because `sup_p p^{-x} = 2^{-x} -> 0` in `c_0`. `Theta_0 y = d(-1,1)^T`,
  `0 = (Theta_0 y)* J (Theta_0 y) <= y*Jy = |e|^2 - 1 <= 0`, so `|e| = 1` and `D_0 y = 0`. Correct.
- Step (2): `Sigma` is a contraction (`|xi_1|^2 + |eta_2|^2 <= |eta_1|^2 + |xi_2|^2`), `u = (e,d)`, `v = (-d,1)`,
  `|u| = |v|`. `f = <Sigma u, v>/|u|^2`, `|f| <= 1`, `f(0) = 1`; `B` is balanced, so each point is on a disc through
  0 and `f = 1`. Equality in Cauchy-Schwarz gives `Sigma u = v`; `|Sigma* v - u|^2 <= |v|^2 - 2|u|^2 + |u|^2 = 0`
  gives `Sigma* v = u`. Correct.
- Step (3): recomputed: `(1,1) Theta~(w) = -(conj e/conj d)(1,-e)` (uses `|e| = 1`), `Delta = phi (-1,1)^T (1,-e)`,
  `H_1 = -2 conj(d) e phi`. Correct.
- Step (4): `D_0` has rank at most one with kernel `y`, `l_0 y = 0`, so `D_0 = c_0 l_0* l_0`;
  `Theta_0* E Theta_0 = l_0* l_0`; `V_0 = M(-c_0) Theta_0` is J-unitary; defect `(Re H) V_0* E V_0`. Correct.

**Lemma R' (confirmed; elementary).** Two Moebius maps agreeing on an open set have proportional matrices.

**F1, F2, F3 (confirmed).** F1 for infinite `P`: truncation to finitely many variables plus continuity plus dominated
convergence (`|a_m| <= 2 Re a_1`, `sum m^{-sigma} < infinity`). F2: the set `{|w_p| <= p^{-eps}}` is `c_0`-compact and
inside `B`. F3: Harnack disc for the slice `zeta -> H(zeta w/rho)`; centre 3, radius `2 sqrt 2` at `rho = 2^{-1/2}`.

**Theorem A' (confirmed, all steps).**
- Reflection `h(z) = -h*(-z)` from the Herglotz representation with atomic measure and no linear term. Correct.
- (0) Mass bound `mu([T,T+1]) <= 2 pi sup Re h(1+it)`; a height `T_n` with bounded `L^1` norm exists by averaging
  `log(1/|T - gamma_j|)` over `[n,n+1]`; far poles change `h` by `O(sum r_j/|T-gamma_j|^2)`. Bottom side `O(1)`
  uniformly in `delta <= 1`. The pole of `zeta(1/2+z)` at `z = 1/2` is outside (`c < 1/2`) and at height 0 when the
  line is moved to `Re z = 2`. Correct.
- (1) `R = a_1/(2 pi delta) + O(1)`; terms `k >= 2` are bounded by `sum |d_k|/log 2`. Correct.
- (2), (3) `|chi - chi_+| << t^2 e^{-pi t}` (`t >= 0`), `|chi_+| e^{-delta t} << t^2 e^{-(pi-delta)|t|}` (`t <= 0`); the
  `O(1)` is uniform in `k` because `|k^{it}| = 1`, and `sum |e_k| < infinity` sums it. Mellin-Barnes with
  `Y = 2 pi k (sin delta - i cos delta)`, `|arg Y| < pi/2`: value `k^{5/2} e^{5i delta/2} e^{-Y}`,
  `e^{-Y} = e^{-2 pi k eta}` using `e^{2 pi i k} = 1`. Recomputed; correct.
- (4) `e_k k^{5/2} = sum_{nm=k} conj(a_m) m^{1/2}`; Mellin integrand `Gamma(w)(2 pi eta)^{-w} zeta(w) h*(w-1/2)`;
  residue at `w = 1` gives `e^{i delta/2} h*(1/2)/(2 pi eta) = conj h(1/2)/(4 pi sin(delta/2))`. Correct.
- (5) `Re h(1/2) >= (3 - 2 sqrt 2) Re a_1`. Correct.

**Theorem B' (confirmed).** `0 <= mu_h <= mu_{alpha L}`, atomic on zeros of `F`; A' with left side 0 forces
`Re a_1 = 0`. The remark "no pole has `0 < gamma <= 14`" is not needed (any `t_0` that is not a pole height works).
The proof does not assume RH; the hypothesis implies RH, as the note says.

**Theorem C (confirmed).** `T_{V_0}` maps the closed disc to itself; `S_1' = -1` identically would give `S = -1`
identically; `alpha L = h + Z_1'`; B' applies; uniqueness of Dirichlet coefficients gives `H` constant.

**Proposition E (inequality confirmed; premise is OUTLINE).** `kappa = 0.284079`,
`3 - 2 sqrt 2 sqrt(1 + kappa^2) = 0.05965`, bracket `>= 1.0597 Re a_1`. `sum f_m conj(a_m) m^{-1/2}` equals
`c_1 conj H(w') + c_2 conj H(w'')` by complete multiplicativity of `chi`.

**Proposition L (confirmed with one correction).** (L3): mean-zero tail is `> -1` with positive probability and is
independent of the first `Q` coordinates. (L4): Harnack, Vitali, and identity theorem as stated; `L = xi'/xi` has no
pole at `s = 1`, which the equivalence needs since `theta < 1`. (L4) is a restatement of zero-freeness in
`Re s > theta`, as the note says.

## 2. Numeric rerun on a different case (MEASURED by the referee)

Same two-delay inner function, phase `PHI = 2.5` instead of `1.0` (904 poles in `1 < gamma < 3200`), and the DH
function on the same non-separable `h` (not run by the author; prediction uses `w' = (-i 2^{-1/2}, i 3^{-1/2})`).

| `delta` | zeta: `2 pi delta * sum` | predicted | DH: `2 pi delta * sum` | predicted |
|---|---|---|---|---|
| 0.04 | 2.6125 + 1.0987i | 2.5067 + 2.0609i | 0.9881 - 0.2828i | 1.4656 - 0.2667i |
| 0.02 | 2.8373 + 1.5121i | same | 1.2370 - 0.3062i | same |
| 0.01 | 2.8674 + 1.8419i | same | 1.3956 - 0.3592i | same |

For zeta the gap to the main term is 30, 20, 13 percent, not 1 to 3 percent. It is explained by the next term of
step (4): moving the line past `Re w = 1/2` crosses the poles of `h*(w - 1/2)` at `w = 1/2 - i gamma_j`, each
contributing `e^{i delta/2} r_j Gamma(1/2 - i gamma_j)(2 pi eta)^{-1/2 + i gamma_j} zeta(1/2 - i gamma_j)`. For
`PHI = 2.5` there is a pole at `gamma = -0.7534`, `r = 2.3397`. Summing these terms over `|gamma_j| < 25` gives
corrections `0.052 - 0.786i`, `0.304 - 0.462i`, `0.348 - 0.176i` to `2 pi delta * sum`; the observed gaps are
`0.106 - 0.962i`, `0.331 - 0.549i`, `0.361 - 0.219i`. Residuals `0.054 - 0.176i`, `0.026 - 0.087i`, `0.013 - 0.043i`
halve with `delta`, i.e. the remaining error in the sum is `O(1)`. This confirms Theorem A' including its error
term. For `PHI = 1.0` the same correction is below 0.03, which is why the author's table shows 1 to 3 percent.

DH: gaps 0.48, 0.23, 0.12 in modulus, decreasing with `delta`, 8 percent at `delta = 0.01`. Consistent with the
outlined DH main term on a case with complex pairing values; not a proof.

## 3. Corrections (none changes the verdict)

1. Lemma R step (1): `Theta* J Theta <= J` gives `|Theta_22|^2 >= 1 + |Theta_12|^2` directly; the stated inequality
   with `Theta_21` needs the equivalent form `Theta J Theta* <= J`. The conclusion (denominator nonzero on the closed
   disc) is correct.
2. "Numerical agreement 1 to 3 percent" is case-dependent (Section 2 above: 13 percent at `delta = 0.01` for
   `PHI = 2.5`). The error term `delta^{-1/2}` is attained generically, by every pole of `h` on the axis, not only by
   a pole at `z = 0`. The theorem as stated is unaffected.
3. (L1): `||U - U_Q||^2 = sum_{p>Q} log^2 p/(p^{2 sigma} - 1)`; the stated value with the extra factor `1/2` is the
   variance of `Re U`.
4. Section 7 summary "the first-moment no-go holds for zeta, Dirichlet L-functions, DH and `E_a`": proved for zeta
   only. DH is OUTLINE plus MEASURED (and for infinite `P` the convergence of the pairing is not written). For `E_a`
   the functional equation has two gamma factors, so step (3) does not give an exponential and step (4) does not
   carry over as written; that row is a guess, not an inference. Dirichlet L-functions were not derived.
5. Consequently "multiplicativity is not essential in the first-moment no-go" is supported by the proved inequality
   of Proposition E plus an unproved DH moment formula. Status: OUTLINE + MEASURED.
6. Lemma R is a standard maximum-principle rigidity for contraction-valued holomorphic functions (a unit singular
   pair at an interior point is constant). It is correctly labelled PROVED; it should not be presented as a new
   technique. Theorem A' is an extension of c1 Theorem A (same main term); the note says so.
7. Scope of "closed": sections holomorphic on the full polydisc, including `w = 0`, with Schur termination, or
   termination depending on the other primes. The note's Section 9 item 3 lists what is not covered; the headline
   should carry that qualifier.

## 4. Checks requested

- RH assumed: no. Theorems B', C have a hypothesis that implies RH; the conclusion (no nonconstant section) is
  unconditional.
- Verified height: not used.
- Known theorem presented as new: no (see correction 6).
- Zeta-only mechanism: none claimed. Controls: Lemma R uses only `S(x) -> -1`; the referee's DH run agrees with the
  DH main term whose sign Proposition E fixes.

## 5. Requirement flags (set by the referee)

| Flag | Value | Reason |
|---|---|---|
| R1 | false | No step uses multiplicativity; zeta enters through the functional equation and integer frequencies. |
| R2 | false | No-go statements and an Abel mean; no inequality for zeta in every window. |
| R3 | false | Lemma R holds for every control with a gamma factor; the first-moment sign is the same for DH (outline). |
| R4 | false | Proposition L: convergence left of 1 excludes the zeta orbit or is equivalent to zero-freeness. |

No statement about zeros of zeta is made or supported.
