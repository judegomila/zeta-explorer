# REFEREE: c6-square-intertwiner-weyl (lens: general)

Date: 2026-11-18. Labels: CONFIRMED (re-derived here), ERROR (false as written), GAP (repairable),
MEASURED (my float run), RECALLED (not re-read; no online search was run).

## Verdict

**The verdict "precise obstruction, no class survives with R1, score does not rise" holds, with the
corrections below.** No PROVED step failed beyond repair. Four statements are false or incomplete
as written (E1 to E4); none changes the verdict. Nothing assumes RH, nothing restates verified
height, and nothing is a statement about zeros of zeta. Flags: R1 = R2 = R3 = R4 = false.

The novelty is smaller than "NEW" suggests: H2(a) is a routine corollary of Rankin-Selberg
(Selberg orthogonality of a cusp form against the characters `p^(ikt)`), and the fact that
`gamma_1` is not a level-1 spectral parameter follows from the published certified lists.

## 1. Theorem H2(a): CONFIRMED

Re-derived line by line.
- `A(sigma) = sum |lambda_p|^2 p^(-sigma) = log(1/(sigma-1)) + O(1)`: simple pole of
  `L(s, f x conj f)` at 1; prime-power terms of order `k >= 2` are bounded by
  `p^(4k.7/64 - k sigma)`, convergent for `sigma > 0.4375 + 1/k`, worst case 0.9375 at k = 2. OK.
- Substitution `lambda_p = psi(p^(-it))`, Weierstrass approximation, and
  `|R| <= eps (A(sigma) sum p^(-sigma))^(1/2) = eps (log(1/(sigma-1)) + O(1))`. OK.
- `sum_p conj(lambda_p) p^(-sigma-ikt) = log L^S(sigma+ikt, conj f) + holomorphic`, bounded as
  `sigma -> 1+` for each fixed k including k = 0 (holomorphy and non-vanishing on `Re s = 1`). OK.
- Conclusion `(1 - eps) log(1/(sigma-1)) <= O_eps(1)`: contradiction. OK. `t = 0` is included.
- Eisenstein sanity check (`lambda_p = 2 cos(t log p)`: the k = +-1 sums are singular): correct.

Reduction step: correct in substance. One wrong clause (E1 below).

## 2. Theorem H2(b): CONFIRMED for trivial nebentypus; GAP otherwise

- Prime-power bound for `sym^i`, `i <= 4`: `sigma > 1/2 + i.7/64 <= 0.9375`. OK.
- Cuspidality criteria (Kim-Shahidi) as recalled agree with what I recall: `sym^2` non-cuspidal iff
  dihedral; `sym^3` iff dihedral or tetrahedral; `sym^4` iff dihedral, tetrahedral or octahedral.
  Tetrahedral: `sym^3 = (f x w) + (f x w^2)`, `sym^4 = sym^2 + w + w^2`, w cubic. Octahedral
  `sym^4`: no GL_1 constituent. The GL_1 constituents are finite order by their definition; the
  sentence "f is of Artin type" is not needed and should be removed (it is not what Kim-Shahidi's
  definition gives directly).
- Dihedral case, re-derived: `nu o N = (chi chi^sigma)^b chi^(a-b)`; on ideles of Q, `N(x) = x^2`,
  so `nu^2 = (chi chi^sigma)^b|_Q . (chi|_Q)^(a-b)`, finite order because `det Ind chi =
  eps_K chi|_Q` is the central character. Hence `nu` has finite order and `t_0 = 0`. CONFIRMED.
- Final step: `D(s)` can be singular on `Re s = 1` only at `s = 1`; `log zeta(s+it)` is singular
  at `1 - it`, `t != 0`. CONFIRMED.

**E2 (GAP, repairable).** The setting allows "finite-order nebentypus", but the identity
`U_i(lambda_p) = a_p(sym^i f)` needs `alpha_p beta_p = 1`. With nebentypus `chi`,
`lambda_p^2 = a_p(sym^2 f) + chi(p)` and in general `lambda_p^i` is a combination of
`chi(p)^m a_p(sym^j f)`. The proof goes through with twists by the finite-order characters `chi^m`
(a GL_1 constituent times `chi^m` is still finite order), but that is not what is written. As
written, (b) is proved for trivial nebentypus.

**E3 (ERROR in a remark).** "For phi continuous and injective on the Hecke spectrum the rule is
case (a) with psi = phi^(-1)". (a) needs psi continuous on the whole circle. For Maass forms the
known range of `lambda_p` is `|lambda_p| <= p^(7/64) + p^(-7/64)`, unbounded in p, and an injective
continuous `phi: R -> S^1` (for example `x -> e^(2i arctan x)`) has an inverse with no continuous
extension to the circle. The remark holds when the `lambda_p` lie in a fixed compact set
(holomorphic forms; Maass forms under Ramanujan, or `phi` required to be injective and unimodular
only on `[-2, 2]` with all `lambda_p` there). Otherwise it is unproved.

## 3. Smaller errors in section 2

**E1 (ERROR, harmless).** "joint eigenspaces of `{T_p}`, each finite-dimensional". On
`L^2(Gamma_0(N)\G)` with `G = SL_2(R)` (all K-types, as in the setting) the joint eigenspace is
`pi_infinity` tensor a finite-dimensional space: infinite-dimensional. The reduction only needs
that `u_gamma` has a nonzero component in some `pi`, whose `lambda_p` then satisfy the relation.
That holds.

**E4 (ERROR, repairable).** Residual line in (b): "`p^(-it) = c` for `p = 2, 3` and `p^2 = 4`
forces `c = 1`". 4 is not a prime and the rule is stated for primes only; 2 and 3 may lie in S;
and from `2^(-it) = 3^(-it)` alone nothing follows. Repair: `p^(-it) = c` for all `p` outside S
gives `sum_(p not in S) p^(-sigma-it) = c sum p^(-sigma)`, unbounded as `sigma -> 1+`, while the
left side is bounded for `t != 0`. (Or three primes and unique factorisation.) The conclusion
stands.

**Scope overstatement.** "Closes U a function of Hecke operators for fixed rules" is: every
continuous `psi` in the direction `T_p = psi(U(log p))`; polynomials of degree at most 4 with
`p`-independent coefficients in the direction `U(log p) = P(T_p)`. The n-fold cover claim
(Kubota cubic, sextic) is not established: those covers live over `Q(omega)`, and H2 is stated
and proved over Q. The proof should transfer to a number field (the inputs exist there), but the
transfer and the form of the rule at prime ideals are not written. Together with the unread
Flicker citation this row is conditional twice.

## 4. Sections 3 and 4

- Weyl constants: SL_2(Z) `R^2/12 - (2R/pi) log R` (area `pi/3`); Gamma_0(4) area `2 pi`, `R^2/2`;
  dimension 3 gives `R^3`; dihedral `r = pi k / log eps_K`; the inversion
  `H ~ (area/2) lambda / log lambda` for a `T log T` law. CONFIRMED by recomputation.
- Caveat 3.2: the arithmetic of the three ranges of `a` is CONFIRMED (`a = 1` straddles: lower
  bound `c' T log T` against `(T/2 pi) log T`). The inputs (multiplicity `O(R/log R)`, positive
  proportion of simple zeros) are RECALLED and consistent with what I know. This is a correct
  weakening of the earlier table.
- C3 rank one: lattice spectrum, at most `T/omega + 1` values against `>> T log T` distinct
  ordinates. CONFIRMED. Rank `>= 2` without a Hecke rule: left OPEN, correctly.
- Lemma N: correct at the level of representations.

## 5. Numerics rerun (MEASURED, my runs, `scripts/memcap.sh 8`, single process, different cases)

Hejhal scan, using the lane's `system`/`refine` with changed inputs:

| Check | Result |
|---|---|
| refine near 9.5337, odd (the parameter the lane's 0.02 grid missed) | r = 9.5336953, residual 4e-7 (known 9.5336952613) |
| gamma_1, (M,Q) = (9,26), horocycles (0.30, 0.25) | even 0.681, odd 0.738 |
| gamma_1, (9,26), horocycles (0.35, 0.22) | even 0.596, odd 0.422 |
| 13.7797513519 / 14.3585095182, both horocycle pairs | 1e-11 to 3e-10 in the right parity, 0.59 to 0.80 in the other |
| gamma_1/2, both horocycle pairs | 0.49 to 0.89 |
| scan [6.6, 7.6], step 0.01, horocycles (0.35, 0.22) | minimum even 0.632, odd 0.747 |
| scan [14.05, 14.22], step 0.005, horocycles (0.35, 0.22) | minimum even 0.592, odd 0.197 |
| gamma_4 = 30.424876, (13,34) | even 0.116, odd 0.094 (not a parameter at this resolution; not claimed by the lane) |

The reading "gamma_1 is neither `r_j` nor `2 r_j` at level 1" is reproduced with different
truncation and horocycles. It is a float result; it agrees with the level-1 list as I recall it
(odd 9.534, 12.173, 14.359, 16.138, ...; even 13.780, 17.739, ...). The lane's own caveats
(grid, level 1 only, plus space through a recalled normalisation) are accurate.

Pivot, cut T = 500 and step 0.025 instead of 2000 and 0.02:

| n | F(gamma_n), mine | lane |
|---|---|---|
| 1 | +5.7279 | +5.72696 |
| 2 | +1.8487 | +1.84726 |
| 4 | -0.4759 | -0.47798 |
| 8 | +15.2376 | +15.23464 |
| 14 | +18.4438 | +18.43970 |
| 15 | -10.5495 | -10.55394 |
| 16 to 20 (new) | +1.539, +7.433, +13.920, -4.752, +5.648 | not run |

Agreement to about 4e-3, consistent with the stated tail error. `F` is not constant on the zeros.
The constant `2E PV int_0^inf log t dt/(t^2 - E^2) = pi^2/2` is CONFIRMED (closed form and
quadrature at E = 7: 4.93480220054).

Two remarks on section 6. (i) For a functional outside the form domain, `F` is defined only up to
an additive constant (the choice of subtraction); "F constant on the zeros" does not depend on it,
so the conclusion stands, but "the Friedrichs member (F = 0)" and the comparison of the mean with
`pi^2/2` depend on the symmetric-PV convention and carry no content. (ii) The statement is
Euler-blind by the lane's own account; I did not run DH and nothing depends on it.

## 6. Controls

No zeta-only mechanism is claimed, so there is no separation to test. Section 7 is accurate that
H2 and the scan are statements about the automorphic target and any real `t`. One sentence should
be removed: "The only object with the eigencharacter of a zero is `E(., 1/2 + i gamma)` ... for
zeta and for no control with an Euler product over Q other than zeta itself". `E(., 1/2 + it)` has
the eigencharacter `p^(it) + p^(-it)` for every real `t`, zero or not, so this sentence separates
nothing and is not supported by anything in the file.

## 7. Bookkeeping

- STRATEGY.md lists lead 7 under "Never run by this campaign"; `push/res-point-spectrum-square`
  (RESULT + REFEREE) ran it. The lane's correction is right.
- Lemma 1(d) matches the earlier referee report (Theorem V, Theorem H for GL_2, Proposition C
  confirmed; GL_n gap; DH failure of Proposition P not observed).
- Memory discipline: arrays of 24 x 12 and 1e5 floats, both runs through the cap. The compute
  server was not used, by the lane or by me.

## 8. Requirement flags (set by the referee)

| Flag | Value | Reason |
|---|---|---|
| R1 | false | Multiplicativity is used only inside a no-go about the target space; no attack exists in which it acts. |
| R2 | false | Nothing uniform in height is established; the exact test is at `gamma_1`, the pivot at 20 zeros. |
| R3 | false | Every new statement holds for the controls alike. |
| R4 | false | No passage to the critical line. |

## 9. What survives

Narrower no-go rows for covariant squares with a cuspidal GL_2 target over Q: (a) no rule
`T_p = psi(U(log p))`, psi continuous (proved); (b) no rule `U(log p) = P(T_p)`, deg P <= 4,
`gamma != 0`, proved as written for trivial nebentypus (nontrivial nebentypus after the twist
repair; injective continuous `phi` only when the `lambda_p` lie in a compact set); Casimir class:
no Weyl law of the form `T log T`, full-spectrum density exclusion for `H = c r^a`, `1 <= a < 2`,
conditional on multiplicities, and a float exclusion of `gamma_1` as `r_j` or `2 r_j` at level 1;
compact at infinity: rank one closed, rank `>= 2` without a Hecke rule open and without R1; the
non-L^2 rank-one family does not carry the zeros with one coupling (measured on 20 zeros). Weight
1/2, quaternionic and n-fold cover rows rest on recalled correspondences; the n-fold cover row
also needs H2 over `Q(omega)`, not written. Score unchanged.
