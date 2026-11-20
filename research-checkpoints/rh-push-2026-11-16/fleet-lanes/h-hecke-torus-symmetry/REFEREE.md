# Referee report: h-hecke-torus-symmetry

Date: 2026-11-16. Adversarial referee. Independent checks: `/tmp/ref_hecke/chk.py` (mpmath 25 digits,
Hurwitz-zeta route for DH, not the lane's theta-integral route; numpy for the operator identity).

## Verdict

holds = false as written (two steps labelled PROVED are false as stated, and Theorem 6 is not an
identity for the Hecke operators). The verdict "precise obstruction" and Theorems 1, 2, 3, 4(a,b,d),
5 survive. Nothing here bears on RH; the lane does not claim it does.

## Confirmed

- T1. Re-derived: `n^4 x^(9/4) = n^(-1/2)(n^2 x)^(9/4)`, `n^2 x^(5/4) = n^(-1/2)(n^2 x)^(5/4)`,
  multiplier `n^(-1/2-z)`, `V_m V_n = V_mn`, `J V_n J = V_n*`. Correct.
- Weight 1/2 handling. `V_p` is the level-raising operator `tau -> p^2 tau`, not a Hecke operator.
  The lane's eigen-statement is correct in the `T(p^2)` sense: Shimura's formula
  `a(p^2 n) + (n/p) p^-1 a(n) + p^-1 a(n/p^2)` on `theta` gives eigenvalue `1 + 1/p`
  (checked exactly, `p = 3, 5, 7`, `n < 500`, including `n = 0`). I derived the equivalence: for a
  series supported on squares with coefficients `c(m)`, the `T(p^2)` equation gives
  `sum_k c(p^k m) X^k = c(m)(1 - X/p)/(1 - lambda X + X^2/p)`; at `lambda = 1 + 1/p` this is
  `c(m)/(1 - X)`, i.e. `c(pm) = c(m)`, i.e. `(1 - V_p) kappa` is `p`-primitive. So "equivalent" is an
  identity. No `T_p` at half-integral weight is used.
- T2. Sublattice count re-derived (lines of `L/pL`). Correct. It is the statement that Eisenstein
  series are Hecke eigenfunctions; it is an identity in the lattice variable only.
- T3. Re-derived all four coefficient relations and the sign `(ic) eps = -conj(ic)`. Numerics:
  `Lambda_a(1-s)/Lambda_a(s) = 1`, `Lambda_b(1-s)/Lambda_b(s) = -1` to `3e-26` at `s = 0.3+4.2i`.
  DH off-line zeros recomputed: `0.8085171825 + 85.6993484854i`, `0.6508300806 + 114.1633427308i`
  (`|L| < 1e-25`).
- Laguerre failure for DH (cited by the lane, recomputed here): with `f(t) = Lambda_DH(1/2+it)`
  (real on the line), `f'^2 - f f''` is negative at `t = 85.7` and `t = 114.16`, positive at
  `85.4, 86.0, 113.8, 114.5`.
- T4(a),(b),(d), T5(a)-(c): correct. T5(d) algebra `Im(conj(D) D') = alpha(f'^2 - f f'')` correct.

## Errors

1. **Theorem 4(c) is false as stated.** With the lane's conventions the cross terms are
   `T_(2l) H_(c-l) + H_(c-l) T_(-2l)`, not `T_(2l) H_(c+l) + H_(c+l) T_(-2l)`. Discrete check
   (circulant `A`, `N = 64`): stated formula error 24.2 on scale 25.4; corrected formula error
   `9e-15`. Not used downstream.
2. **Theorem 7 weight is wrong.** On `L^2(R, e^(-2 delta u) du)`, `||V_p|| = p^(-1/2 + 2 delta)`,
   and the product diverges for every `delta > 0`. The stated norm `p^(-1/2-delta)` holds on
   `L^2(R, e^(delta u) du)`. Conclusion (`Re s > 1` only) unchanged after the fix.
3. **NR table entry contradicts the lane's own example.** `q = 2`, `c = 2.2` has zeros at
   `Re s = 1.1399 > 1`, so NR fails the "zero-free `Re s > 1`" row at that `c`. NR passes that row
   only for `2 < c < q^(1/2) + q^(-1/2) = 2.1213`. The qualitative NR conclusion (eigen-property at
   all primes but one plus functional equation does not put zeros on the line) stands.
4. **Theorem 6 is an analogy, not an identity, for the Hecke operators.** The exact relation is
   `D_c V_p = p^(-1/2) D_(c+2 log p)`: `V_p` maps the `c`-module to a different module. The stated
   `D_c V_p = p^(-rho) D_c` holds only when `kappa*a = 0` on `(c, c + 2 log p)`. Requiring this for
   all `p` forces `kappa*a = 0` on `(c, inf)`, i.e. `y = 0`. Invariance of `ker D_c` under `V_p` is
   not shown, so the action is not shown to descend to the zero module. `U_p = diag(p^(-i gamma))`
   is defined directly on the index set. It is the restriction to `h = 2 log p` of the
   one-parameter group `diag(e^(-i gamma h/2))`, `h` real: primes play no role. "RH iff tempered" is
   then `|p^(-i gamma)| = 1 iff Im gamma = 0`, a restatement. The lane says "circular", which is
   accurate; the summary line "sqrt(p) V_p = diag(p^(-i gamma))" is not.
5. Smaller points.
   - T5(d): `int <a, H_c a> dc` is not an invariant mean (the normalised mean is 0, since
     `H_c -> 0` at both ends). It is the unnormalised orbit integral, convergent only as a
     symmetric limit using `||Aa|| = ||A* a||`. The constant `2 pi`, `alpha/pi` is unchecked.
   - T5(b): `e^(itu)` versus the transform variable `e^(itu/2)`: factor 2 in the character.
   - T3 "Reading": for zeta, `V_p` does not fix the line of `kappa` (`V_p kappa` is not a multiple of
     `kappa`); the coefficient operator `U_p` does. `U_p` and `V_p` are conflated there.
   - T3: `theta_chi` and `theta_conj(chi)` have different nebentypus; the DH theta is a form on
     `Gamma_1`, and "eigen-object" must be read there.
   - T6(c),(d) assume simple zeros (rank-one terms in (3.1)).

## DH failure step

Confirmed, and correctly scoped by the lane: DH fails the eigen-property at `p = +-2 mod 5`
(`T(p^2)` eigenvalues `chi(p)(1+p)` and `conj(chi)(p)(1+p)` differ by sign), but T4-T6 are
kernel-independent, so no sign statement in the lane uses the step. The eigen-property is
equivalent to complete multiplicativity of the coefficients; the Hecke language adds no content
beyond the Euler product in rank one.

## Surviving claim

T1, T2, T3, T4(a,b,d), T5 (up to normalisation) are correct. T6 reduces to: translation in `c`
acts on the zero-indexed sums by `diag(e^(-i gamma h/2))`, which is `J`-unitary, and RH iff that
group is unitary; this is a restatement, not a Hecke statement. Obstruction verdict stands.
