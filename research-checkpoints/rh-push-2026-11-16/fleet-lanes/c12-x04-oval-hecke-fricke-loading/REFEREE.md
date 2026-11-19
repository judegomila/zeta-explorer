# REFEREE.md for c12-x04-oval-hecke-fricke-loading

## Independent adversarial referee (lens: general), 2026-11-19

Independent of the author. Method: every PROVED step re-derived by hand; numerics rerun with other cases and, for
the Epstein zeros, by a different method (incomplete-gamma expansion of the completed Epstein zeta instead of the
author's flint midpoints / L-function decomposition). Runs: local, `scripts/memcap.sh 8`, mpmath 30 digits, single
process, under 200 MB. Server not used. Scratch code kept outside the lane (`/tmp/c12ref-general-47223-ovalhf/`);
no lane file other than this one was changed. The author's second pass is kept unchanged as the appendix below.

**Outcome: holds.** The verdict "precise obstruction; the device closes at the decisive test" is confirmed for the
four forms the result lists in weakest step 1 (linear expressions in Hecke images of theta on the arc,
dilation-covariant quadratic forms, single complex points, their second moment). It is not a no-go theorem beyond
those forms, and the result says so. Nothing about zeros of zeta is claimed or supported. RH is not assumed
anywhere; verified height is not used. Four corrections (E1 to E4) and three remarks follow; none changes the
verdict or a flag.

### 1. PROVED steps, re-derived

| Step | Check | Result |
|---|---|---|
| Lemma 1, operator | Shimura coefficients for weight 1/2 (`lambda = 0`): `a(p^2 n) + p^(-1)(n/p)a(n) + p^(-1)a(n/p^2)`; point form: `sum_b (b/p) e(nb/p) = G_p (n/p)` | holds |
| Lemma 1(b) | `n = 0`: the twisted term has `(0/p) = 0`, so the constant is removed, matching `theta - D_{p^2} theta`; `a(p^2 n) = a(n)` on squares; eigenvalue `1 + 1/p` | holds |
| Lemma 1(a) | vertical fixed lines of `tau -> gamma(-conj tau)`, `gamma` in `Gamma_0(4)` fixing `inf`, are `Re tau in (1/2)Z`; other real arcs are countably many semicircles; `b/p^2`, `b/p` are not half-integers for odd `p` | holds outside a countable set of `x`, as stated |
| Lemma 1(c) | `a(2n) != 0` iff `n = 2k^2`; `sum (-1)^n q^(n^2/2) = 2 theta(2x) - theta(x/2)` | holds |
| Lemma 1(d) | `W D_l W g(x) = l^(-1/2) g(x/l)` | holds; value at `x = 0.37` recomputed by hand: 0.4482 |
| Lemma 2(a),(b) | `p^(-2) (p^(-2))^(-s/2) + p^(-1) (p^2)^(-s/2) = p^(s-2) + p^(-1-s)` | holds |
| Lemma 2(c) | zeros of `C_q`: `u = q^s` solves `u^2 - (q^2 + q) u + q = 0`; `q = 2, 3, 5` give `Re s = 2.497, 2.242, 2.110` and `1 - Re s` | holds; matches map row NR/G21 with `c = -(q^(3/2) + q^(1/2))` |
| Lemma 2(d) | 0.9484 (`p = 3`), 1.0211 (`p = 5`) | holds |
| Lemma 3 | normal form `a + bW` from `W D_l = l^(-1/2) D_{1/l} W`; commutator multiplier `2^((s-1)/2) - 2^(-s/2) = 2^(3/4) sinh((s - 1/2)(log 2)/2)` | holds |
| Lemma 4 | specialisation `X_p -> 0` is a ring homomorphism of formal Euler-variable series; local factors at `q = 3, 7 mod 20`: `(1 - X)^(-2)` in `zeta L(chi_-20)`, `(1 + X)^(-2)` in `L(chi_-4) L(chi_5)`; coefficients of `X^0`, `X^1` | holds |
| Section 5(a) | even function on `(Z/5)^*` = `cos(2 pi b/5) chi_0 + i sin(2 pi b/5) chi_5`; `1 - cos = (b/5) sqrt(5) cos` for `b = 1, 2`; general `p = 1 mod 4`: `(p - 1)/(G - 1) = G + 1` | holds |
| Section 5(b) | `(1/p) sum_b e(b(m^2 - n^2)/p)` = indicator of `n = +-m mod p`; form of `L+`: basis `(1,1)`, `((1-p)/2, (1+p)/2)` gives `[2, 2, (p^2+1)/2]`, discriminant `-4p^2` | holds |

### 2. Reruns with other cases (this referee)

- `T_{p^2}` point by point at `p = 17, 19`, `x = 0.83, 2.9`: eigen-equation residual `<= 7.2e-30`; complex part
  minus dilates `<= 7.2e-30`; `Cx_p theta > 0` at all four points.
- Commutator on theta at `x = 2.1`: `-0.2406643326...`, equal by both routes.
- Mellin multiplier by quadrature in `log x` with an analytic tail: `M[Cx_3 theta]` against `C_3(s) 2 Lambda(s)` at
  `s = 2.4 - 1.7i`: `5e-23`. (`p = 7`, `s = 1.9 + 3.3i`: `3.6e-5`, the size of my truncation at `x = e^5`.)
- Section 5(a) identity through Hurwitz zeta at `(b, s) = (1, 0.4 + 7.7i), (2, 1.6 - 2.2i), (3, 0.8 + 30i)`:
  `<= 2.3e-30` (the last two are outside the half-plane of convergence, so this tests the continuation).
- Single-point zeros (`p = 5`, `b = 1`) re-solved from the Hurwitz form: `0.279910642 + 6.578785251i`,
  `0.830178439 + 12.054841079i`, `0.860769634 + 19.669206022i`, `0.898942635 + 28.703613120i`, residual `< 2e-30`.
  All agree with the result to its 7 digits.
- Second moment at `p = 7`, `x = 0.45`: residual `3.9e-31`.
- Epstein zeros by a different method (`pi^(-s) Gamma(s) Z` = sum of incomplete gamma terms for the form scaled to
  determinant 1; sanity against `4 zeta L(chi_-4)` for `[1,0,1]`: `8e-33`): `[1,0,5]`: `0.9329696975 + 15.66824953i`;
  `[1,0,6]`: `0.8037491286 + 15.11757853i`; `[2,2,5]`: `0.6290199 + 18.3199520i`, `0.9528637 + 23.9522365i`,
  `1.1667746 + 30.9939343i`. Scaled residuals `7e-23` to `4e-12`, against values of order 1 at distance 0.05. All
  agree with the result. These remain float results: no enclosure, no argument-principle count.
- DH coefficients: `kappa = 0.2840790438`, `-1/kappa = -3.5201470213`.

### 3. Errors and corrections

- **E1 (control table, DH row; minor).** "fails at `p = 2, 3, 7` (`c(pn)/c(n)` takes the two values `0.284, -3.520`)"
  is right for `p = 2, 7` (`p = 2 mod 5`). For `p = 3` (`p = 3 mod 5`) the two values are `-0.284` and `+3.520`
  (period-5 coefficients `1, kappa, -kappa, -1, 0`: `c(3)/c(1) = -kappa`, `c(6)/c(2) = 1/kappa`). The conclusion
  (not multiplicative at `p`) is unchanged.
- **E2 (verdict paragraph and T-NR row; scope).** The specific twin produced by the device,
  `c = -(q^(3/2) + q^(1/2))`, has its extra zeros on `Re s = 1/2 +- (>1.6)`, outside the closed critical strip. A
  statement restricted to the strip is true for this twin, so "the object the candidate proposed to bound is itself
  a named control" does not by itself give a counterexample inside the strip. The R3 conclusion survives for another
  reason, which the result states only in one clause: every twin, including those with
  `2 < |c| < q^(1/2) + q^(-1/2)` (zeros inside the strip), is `(q^(-1/2) D_{q^(-2)} + q^(1/2) D_{q^2} + c) theta`
  and so lies in the module `A theta`; no statement about the module separates them from theta. The row should say
  this explicitly.
- **E3 (Lemma 2, statement).** `M[W g](s) = M[g](1 - s)` is asserted for general `g` "with constant terms handled
  as for theta". For general `g` the two sides have disjoint half-planes of convergence and the statement is a
  statement about regularised transforms. It is used only on `W`-fixed vectors, where it is the functional equation
  of `Lambda`; Lemma 3 does not need it (it uses `b W g = b g` before taking transforms). No consequence.
- **E4 (wording).** Lemma 2(b): `1 - p^(-s)` is the inverse of the Euler factor of zeta at `p`. Section 3 item 2:
  `p theta(p^2 x) - theta(x)` is not zero; it is of size `exp(-pi/(p^2 x))`, far below the quoted `3e-27`, which is
  working precision.

### 4. Remarks

1. `Cx_p theta > 0` on the whole arc is provable, not only measured at 9 points:
   `theta(x) - p^(-2) theta(x/p^2) = x^(-1/2) (theta(1/x) - p^(-1) theta(p^2/x)) >= (1 - 1/p) x^(-1/2) theta(1/x) > 0`
   because theta is decreasing, and `theta(x) - theta(p^2 x) >= 0`. The T-NR row's "passes positivity" can be
   labelled PROVED for this twin.
2. Controls. E_a is a weight-0 function on `X(1)` and DH is not a restriction of a form on `X_0(4)`; both rows are
   controls for the three named inputs (positivity, Fricke, one-point Hecke orbit), by analogy, as the author's
   pass item 2 says. The backward-heat entry "no extension periodic in `Re tau`" is asserted without proof; it
   should carry ARGUED. Beurling, phase-rotated transfer operator and `theta^w` were not run; since T-NR and E_a
   already pass, R3 is false regardless.
3. Novelty. Every identity here is classical (Shimura's `T_{p^2}` on theta, Serre-Stark, Hecke on binary theta
   series, quadratic Gauss sums). The result labels them CLASSICAL or elementary and does not present them as new;
   what the lane adds is the bookkeeping of real against complex isogenous points and the reduction to map rows
   NR/G21 and G16. The map row should carry "classical identities", not a new theorem.

### 5. Requirement flags (set by this referee)

- R1: **false**. Multiplicativity appears only as the identity `c(pm) = c(m)`; no inequality depends on it.
- R2: **false**. The one inequality (Lemma 2(d)) concerns the multiplier `C_p`, not zeros.
- R3: **false**. T-NR (all `|c| > 2`, see E2) and E_a pass every step; three controls not run.
- R4: **false**. The all-prime form converges for `Re s > 1` only.

### 6. Surviving claim

On theta restricted to the arc of `X_0(4)(R)`: `T_{p^2}` has 2 real and `p^2 + p - 2` complex isogenous points
(outside a countable set of `x`); the summed complex points are the dilate combination
`theta - p^(-2) D_{p^(-2)} theta + p^(-1)(theta - D_{p^2} theta)`, positive on the arc, with Mellin multiplier
`C_p = 1 + 1/p - R_p`, `R_p = 2 p^(-3/2) cosh((s - 1/2) log p)`; `C_p Lambda` is `-p^(-3/2)` times the T-NR twin
with `c = -(p^(3/2) + p^(1/2))`; `<D_l, W>` acts on a `W`-fixed vector through `a + bW -> a + b`; termwise bounds
lose `(p - 1) p^(-1/2)`; the second moment over the points `tau + b/p` is `Theta_{L+} + Theta_{L-} - theta(p^2 x)^2`
(map row G16). MEASURED (float, confirmed by a second method, not enclosed): off-line zeros of the single-point
function at `p = 5` and of the Epstein zeta of `[2,2,5]`. The device is closed for the four listed forms.

---

## Appendix: author's second pass (unchanged text)


Author's adversarial second pass, 2026-11-19. This is NOT an independent referee; no independent referee has read
the lane. Runs: local, `scripts/memcap.sh 8`, mpmath 30 digits, under 200 MB, under 1 minute (`ref_check.py`,
`ref_check.log`). No server job.

**Outcome: the verdict "precise obstruction; device closed at the decisive test" holds on re-derivation, with
corrections E1 to E3 already applied to RESULT.md.** No statement about zeros of zeta is made or supported.

## 1. PROVED steps, re-derived

| Step | Re-derivation | Result |
|---|---|---|
| Lemma 1(b) | coefficients of theta: `a(0) = 1`, `a(m^2) = 2`; three cases `n = 0`, `n = m^2` with `p | m`, `p` not dividing `m` | holds; eigenvalue `1 + 1/p` in all three |
| Lemma 1(a) | real locus of `X_0(4)` | first draft said "generic" with a translation-only argument; corrected to "outside a countable set" with the list of vertical real arcs (E1) |
| Lemma 1(c) | `a(2n) != 0` iff `n = 2 m^2`; `sum (-1)^n q^(n^2/2)` = even part minus odd part | holds |
| Lemma 1(d) | `W D_l W g(x) = l^(-1/2) g(x/l)` by substitution | holds |
| Lemma 2(a),(b) | `D_l -> l^(-s/2)`: `p^(-2) p^s + p^(-1) p^(-s)` | holds; `R_p(1 - s) = R_p(s)` |
| Lemma 2(c) | `1 + 1/q - q^(-3/2) 2 cosh = -q^(-3/2)(2 cosh - q^(3/2) - q^(1/2))` | holds; numerically `1e-32` at `0.3 + 4.4i`, and `C_q` vanishes (`3e-31`, `1e-30`) at the predicted zero for `q = 3, 7` |
| Lemma 3 | `b W g = b g` when `W g = g` | holds. `a + bW -> a + b` is not an algebra homomorphism; it is the action on the fixed vector only. RESULT.md says "acts through", which is correct for the cyclic module |
| Lemma 4 | coefficients of `X_q^0`, `X_q^1` | holds. Uses: class characters decomposition (classical), existence of a prime `q = 3, 7 mod 20` outside `S` (Dirichlet) |
| Section 5(a) | `r^2 mod 5`: `1, 4, 4, 1`; `A + B = (1 - 5^(-s)) zeta`, `A - B = L(chi_5)`; `cos(72)/(1 - cos(72)) = 5^(-1/2)` | holds. First draft computed the local zero at `Re s = 0.13` (arithmetic slip); the run gives exactly `1/2` (E2). First draft said "the real part of the point is an Euler product" for all `p`; true at `p = 5` only (E3; `p = 13` check) |
| Section 5(b) | `(1/p) sum_b e(b(n^2 - m^2)/p)` is the indicator of `n = +-m mod p`; inclusion-exclusion with `p Z^2` | holds |

## 2. Reruns with different cases (`ref_check.log`)

- Complex part = dilates at `p = 11, 13`, `x = 0.2`: `5e-31`, `8e-31`.
- `T_7 Theta_[1,0,5] = 2 Theta_[2,2,3]` (`7e-26`), `T_11 Theta_[1,0,6] = 2 Theta_[2,0,3]` (`3e-27`),
  `T_41 Theta_[1,0,5] = 2 Theta_[1,0,5]` (`3e-22`, truncation), `T_3 Theta_[2,2,3] = 2 Theta_[1,0,5]` (`1e-30`).
- Commutator multiplier `2^(3/4) sinh((s - 1/2)(log 2)/2)`: `2e-31`.

## 3. Attacks on the verdict

1. "The candidate could be an inequality that is not linear in theta." Covered only for the second moment
   (section 5(b)). Listed as weakest step 1. The verdict is an obstruction for the four stated forms, not a no-go
   theorem.
2. "E_a is weight 0, not weight 1/2, so it is not a control for this device." It is a control for the three inputs
   the candidate names (positivity of the kernel on the arc, Fricke invariance, one-point Hecke orbit with the
   real/complex split). It is not a control for a statement that reads the weight. No such statement was found.
3. "T-NR passes" rests on Lemma 2(c), an algebraic identity; it does not depend on numerics.
4. The off-line zeros of the single-point function and of `[2,2,5]` are float results. If they were wrong the
   verdict would not change: sections 3 and 4 do not use them.
5. Controls not run: Beurling, phase-rotated transfer operator, `theta^w`. R3 is reported as not met on the
   controls that were run; the missing ones cannot change that.

## 4. Requirement flags after this pass

R1 false, R2 false, R3 false, R4 false. Unchanged.
