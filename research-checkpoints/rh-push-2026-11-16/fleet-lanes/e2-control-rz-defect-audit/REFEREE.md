# REFEREE: e2-control-rz-defect-audit

Date 2026-11-18. Adversarial referee of `RESULT.md` (claimed verdict: precise-obstruction).
Labels as in the result. Referee numerics: a separate mpmath script (floats, run through `scripts/memcap.sh 8`,
local, under one minute; not interval-certified; not kept, since only this file is to be written here). It reuses
the result's winding routine with new members and parameters.

## Outcome

**The verdict holds.** The central claims were re-derived and are correct: the literal reading fails on `1/zeta`
and T-NR; Lemma 1 is correct for generic parameters; the fake over powers of 5 is an exact counterexample outside
the class; `zeta(2s)/zeta(s)` is correct; Lemma 2 (RZ_b) is correct. No step assumes RH, no step restates verified
height as a result (section 6 says so explicitly), and no known theorem is presented as new (the fake is credited
to the map; Statement S is labelled OPEN and equal to GRH at `delta = 0`).

Six items (E1-E6) are wrong, unsupported or overstated as written. None of them carries the verdict. They need
correction before anything from this lane enters the graph.

## Errors

**E1 (false statement, labelled CLASSICAL; section 4 "Status").** "The trivial unconditional bound in the class is
`offset <= 1/2 + sup_p (local pole abscissa)`." This fails on the lane's own member `zeta D_{2,-2.5} D_{5,2.3}`:
local pole abscissa 0, so the bound gives 1/2; the function has zeros on `Re s = 3/2`, offset 1
(`D_{2,-2.5}(3/2) = 1 - 1.25 + 0.25 = 0` exactly; `zeta(3/2) = 2.612`). It also fails on
`1/(zeta(s+a) zeta(s-a))`, which has no local poles and zeros at `1 +- a`. Absolute convergence excludes zeros only
away from the local zeros; the supremum must run over the local zero abscissae as well as the local pole
abscissae (zeros are excluded only to the right of `1 + sup_p local pole abscissa` and of every local zero line).

**E2 (false justification; section 1.1).** "A functional equation about 1/2 forces a local factor's zeros to be
symmetric about 1/2, which is why numerators are measured from 1/2." False in general: `1/zeta(s)` has a functional
equation about 1/2 and its local zeros lie on `Re s = 0` only (the result itself uses this in section 2, item (2),
to assign RZ_b defect 1/2). The symmetry is forced only when finitely many local factors are modified (the quotient
by the unmodified function must itself be symmetric). Conversely, local symmetry about 1/2 at every prime does not
give a global line 1/2: `prod_q (1 + c_q q^{1/2-s} + q^{1-2s}) = 1/L(s - 1/2, f)` has every local zero on
`Re s = 1/2` (D1 defect 0) and global symmetry about `Re s = 1`. D1 is therefore a convention fitted to two
examples (as weakest step 3 concedes), not a consequence of the functional equation. The companion claim "D1 is the
only reading under which both source examples give offset = defect" is not proved, and for `E_a` equality is RH
(as the result states elsewhere).

**E3 (false sentence under a PROVED heading; section 1.4 (i)).** "Subsets of primes with sign -1 only produce a
boundary zero at the abscissa of convergence of `sum_{p in A} p^{-s}` (Landau), not an interior one." Take
`A = {p = 3 mod 4}`: the product is `L(s, chi_4)(1 - 2^{-s})^{-1}`, the abscissa is 1, and there is no zero at 1
(`L(1, chi_4) = pi/4`). The second half ("not an interior one") cannot be proved at present: for `A = {p : chi(p) = -1}`
with `chi` a real character it is the absence of a real zero of `L(s, chi)` in `(1/2, 1)`. The sentence should be
deleted. It is not used elsewhere.

**E4 (gaps in Lemma 1 and Corollary 1; statement, not substance).**
* The offset formula is an equality only when no zero of one factor coincides with a pole of another. The proof
  says "coincidences only lower the offset" and then states equality and an "iff" in Corollary 1. With `e = -1`
  factors present, the poles of `F` include the non-real zeros of the denominator L-functions (the proof mentions
  only "finitely many real polar points"); a zero `rho - a_j` of a numerator factor can coincide with a pole
  `rho' - a_k` unless excluded. The formula is `<=` in general and `=` for generic shifts.
* Characters must be primitive. For an imprimitive `chi` the L-function has zeros on `Re s = 0` and no functional
  equation of the stated shape.
* D1 is undefined when a local parameter is 0 (`log 0`), which happens at ramified primes; the member
  `L(s +- a, chi_4)` has parameter 0 at `p = 2`. A convention (zero parameters are omitted) must be stated.
* The lemma is stated for real `c` with `|c| > 2` or `|c| <= 2`; complex `c` is not covered.
With these hypotheses added, parts (A), (B), (C) and the three bullets of Corollary 1 were re-derived and are
correct (including `delta0 = arccosh(|c|/2)/log q`, `|alpha| = q^{1/2 +- delta0}`, and the unconditional case
`|Re a_-| >= max_+ |Re a_j|` from `Theta <= 1`).

**E5 (overstated label; section 4, last paragraph).** "Each of the three inputs of S is necessary given the other
two (PROVED by the witnesses: DH for the Euler product ...)." For DH the statement S is not formulable (no local
factors), as the table in the same section says ("n/f"). DH shows that the functional equation and integer
coefficients do not locate zeros; it is not a counterexample to S with one hypothesis removed. The fake and
`zeta(2s)/zeta(s)` are genuine witnesses; for the latter the offset is measured from a line the function is not
symmetric about, which the table states. The DH offsets quoted (0.3085, real part up to 1.12) are taken from the
map and were not rerun here or there.

**E6 (internal inconsistency; section 2, "Additions to the graph node", item (1)).** "against 'a Dirichlet series
with zeta's archimedean side has no zero in Re s > 7/8' it is effective." Two paragraphs earlier RZ_b is listed as
lacking zeta's gamma factor (its own is the reciprocal, shifted). RZ_b is outside the scope of the quoted
statement, so it is not a counterexample to it. The control row's "Use" column states the correct scope.

## Scope remark (not an error)

Class `C` of section 1.1 is larger than the class of Lemma 1. Example found by the referee: `zeta(2s - 1/2)` has
local factor `1/((1 - p^{1/4}T)(1 + p^{1/4}T))`, a functional equation about `Re s = 1/2` (checked, residual 3e-19),
D1 defect 1/4, and zeros on `Re s = 1/4 + Re rho / 2`, so offset `Theta/2 - 1/4 <= 1/4` unconditionally. Here
"offset <= defect" is true without RH and is not one of mechanisms (A), (B), (C). The phrase "the offset arises by
exactly three mechanisms" is correct only for the Lemma 1 class, which is how the verdict words it; the summary
sentence in section 1.5 ("on infinitely many primes it is RH") should carry the same restriction. No counterexample
to S was found in class `C` by the referee; S at `delta = 0` is GRH, so none is expected.

## Re-derivations (PROVED steps)

| Step | Result |
|---|---|
| D0 fails on `1/zeta` (defect 0, completed function `1/G` has zeros exactly at 0 and 1) and on T-NR (`1/2 + delta0` vs `delta0`) | confirmed |
| Lemma 1 (A), (B), (C); defect and offset formulas | confirmed for generic shifts, primitive characters (E4) |
| `E_a`: `sup offset = a + Theta - 1/2`, equality with the defect iff RH | confirmed |
| Fake: `Z(1/(5T)) = Z(T)`; zeros `T = (5 -+ sqrt 5)/10`, `Re s = 0.79899, 0.20101`; `alpha = (5 +- sqrt 5)/2`, not of modulus `sqrt 5`; `A_n = (5^n - 1)/4`; `N_1 = 1`, `N_2 = 11`, `a_2 = 5`; bound `d a_d >= 5^d - 2(3.62)^d - (5/4)5^{d/2} - d/2 > 0` for `d >= 6` | confirmed by hand |
| `zeta(2s)/zeta(s) = prod (1 + p^{-s})^{-1}`, zero at 1 with slope `zeta(2)`, no single symmetry line | confirmed |
| Lemma 2: Euler product, coefficients, `c(n) = -n^{b-1} Lambda(n)`, poles `rho - (1 - b)`, symmetry `s -> 2b - 1 - s`, zeros of `1/G` at `b`, `b - 1` with slopes +1, -1 | confirmed |
| T-NR log-derivative coefficients `Lambda_F(q) = (1 + c sqrt q) log q`, `Lambda_F(q^2) = (1 - q(c^2 - 2)) log q` (items 20, 21) | confirmed |

## Numeric rerun with different cases (MEASURED)

| Check | Result |
|---|---|
| RZ_b at `b = 0.9` (result used 0.93): functional-equation residuals at three points | 6.2e-31, 2.9e-31, 1.7e-30 |
| Slopes of `1/G` at `b`, `b - 1`; slope of RZ_b at `b` | +1.0000000001, -0.9999999999, 0.99999999994 |
| `zeta D_{5,-3}` (new member; `delta0 = 0.59799`), box `[-0.7, 30.3]`: right of the line / strip | 0 / 8; predicted 8 (heights `2 pi k / log 5`, `k = 0..7`) |
| `E_a`, `a = 0.35` (new shift): right box / strip | -1 (pole at 1.35) / 3 (zeta zeros below 30.3) |
| `zeta(2s - 1/2)` (outside Lemma 1 class): right of 0.513 / strip around 1/2, height 20.3 | -1 (pole at 3/4) / 6 |
| `L(s, chi_4)` zero nearest the result's top edge 40.3 | 40.32247: the contour passes 0.022 below a zero; the count 14 is correct, the margin is small |

All windings integral to 4 decimals, largest argument step 1.31 rad.

## Controls

The lane makes no zero-location argument, so there is no mechanism to run against the controls. The referee checked
the control-related assertions that are stated as facts: T-NR zero positions (exact at `q = 2, c = -2.5`), the
RZ_b row, and the fake. The table of section 3 remains ARGUED for most cells, as the result says; the referee
re-derived only the T-NR and RZ_b cells of items 17, 19, 20, 21 and the UT cells of items 20, 21. The 7/8 row for
RZ_b ("the conclusion is true: no pole in `Re s > b - 1/8`") depends on the zero-free half-plane `Re s > 7/8`,
which the row labels as relative to the unrefereed manuscript; it must keep that label wherever it is copied.

## What survives

Under the literal reading the test "zero offset <= sup_p local defect" is false (`1/zeta`, T-NR). Under the
convention D1, inside the class of products and quotients of shifted zeta and primitive Dirichlet L-functions with
T-NR factors at finitely many primes and generic shifts, the offset is given by Lemma 1, and "offset <= defect" is
an identity for finite-prime zeros and quotient poles and is equivalent to a bound on `Theta_j` (RH/GRH at maximal
shift) for product factors. For `E_a`, `offset = a + Theta - 1/2`. The fake over powers of 5 (exact) and
`zeta(2s)/zeta(s)` show that the integers and the functional equation cannot be dropped; DH shows only that S is
not formulable without local factors. Not a lead. The "trivial bound" of section 4, the stated reason for D1, and
the Landau sentence of section 1.4 (i) are withdrawn.
