# REFEREE2: c1-missing-controls, Part D (the two classical inputs)

Date: 2026-11-17. Second pass, owed from round 1 (lane `c2-repair-owed-passes`). Scope: the statements (Sel) and
(BJ) of Part D as written in RESULT.md section 3, each compared with the classical theorem; then the use made of them
in Theorem D1. Sources were not opened in this pass (the comparison is with the standard statements as given in
Selberg 1946, Tsang's 1984 thesis, Bohr-Jessen 1930/32, Jessen-Wintner 1935, Borchsenius-Jessen 1948; see section 4).

## Outcome

**Both statements agree with the classical theorems. (BJ) as written is slightly weaker than the classical statement.
D1 follows from them as written.** No correction changes a conclusion. Two citations should be made more precise.

## 1. (Sel) as written against the classical statement

As written: for every real lambda, `(1/T) meas{t in [T, 2T] : pi S(t) <= lambda sqrt((1/2) log log T)} -> Phi(lambda)`,
with the moments `int_T^{2T} S^{2k} = ((2k)!/(k! (2 pi)^{2k})) T (log log T)^k (1 + o(1))`.

Classical (Selberg 1946, unconditional): `int_0^T S(t)^{2k} dt = ((2k)!/(k! (2 pi)^{2k})) T (log log T)^k
+ O(T (log log T)^{k - 1/2})` for each fixed k, and odd moments of lower order.

Checks.
- Constant. The 2k-th moment of a centred normal variable of variance v is `(2k)!/(k! 2^k) v^k`. With
  `v = (log log T)/(2 pi^2)`: `(2k)!/(k! 2^k (2 pi^2)^k) = (2k)!/(k! (2 pi)^{2k})`. The moment formula in the result is
  the classical one, and it corresponds to variance `(1/(2 pi^2)) log log T` for S, i.e. `(1/2) log log T` for
  `pi S = Im log zeta(1/2 + it)`. The normalisation in (Sel) is right.
- From moments to the distribution: the normal law is determined by its moments, so convergence of all moments of
  `pi S/sqrt((1/2) log log T)` gives convergence in distribution. Dyadic range `[T, 2T]` against `[0, T]`: the main
  term is linear in T and `log log` is slowly varying, so the two forms are equivalent.
- Unconditional: yes for S(t) (Selberg's 1946 moment theorem does not assume RH).
- Convention: S(t) by continuous variation along the horizontal line from the right, t not an ordinate. This is the
  convention of the classical statement.
Verdict on (Sel): AGREES. Precision to add: the citation should read "Selberg 1946 (moments, unconditional); the
distributional form follows by the method of moments (stated in this form in Tsang 1984 and later surveys)".

## 2. (BJ) as written against the classical statement

As written: for fixed `sigma_0 > 1/2`, `log zeta(sigma_0 + it)` with the horizontal convention has a limit
distribution mu on C, with convergence of `(1/T) meas{t <= T : log zeta(sigma_0 + it) in B}` for rectangles B with
mu-null boundary.

Classical (Bohr-Jessen 1930 for `sigma > 1`, 1932 for `1/2 < sigma <= 1`; Jessen-Wintner 1935; Borchsenius-Jessen
1948): for fixed `sigma > 1/2` and every rectangle R with sides parallel to the axes the limit
`lim (1/T) meas{t in [0, T] : sigma + it in G, log zeta(sigma + it) in R}` exists, where G is the half-plane
`Re s > 1/2` with the horizontal cuts from the zeros (and from the pole) removed and `log zeta` is continued from the
right along horizontals. The limit measure is absolutely continuous with a continuous density.

Checks.
- Convention: the same horizontal continuation; the excluded heights (ordinates of zeros to the right of sigma_0)
  are countable, measure 0. The result's remark "the match of the argument convention ... was not checked" is
  resolved: the classical theorem is stated for exactly this branch.
- Class of sets: the classical statement holds for every rectangle; the result's restriction to mu-null boundary is
  implied (the density is continuous, so every rectangle has mu-null boundary). The statement as written is weaker
  than the classical one. AGREES.
- Unconditional for `1/2 < sigma_0 <= 1`: yes (the 1932 paper uses the mean square of zeta in the strip, not RH).
- Range used in Part D: `sigma_0 = 1/2 + a`, `0 < a <= 1/2`, inside the classical range.
Verdict on (BJ): AGREES (weaker form).

## 3. Use in Theorem D1

- Tightness of `S_{sigma_0}` on `[T, 2T]`: choose a rectangle `[-A, A] x [-pi R, pi R]` of mu-mass at least `1 - eps/4`;
  the proportion of `t <= 2T` outside it tends to at most `eps/4`, so its measure inside `[T, 2T]` is at most `eps T`
  for large T. Correct. (The set `{|Im w| > pi R}` is not a rectangle; the argument needs this bounded rectangle. The
  result's wording "the family is tight" covers it.)
- `lambda_T -> 0` in (Sel): convergence to a continuous limit law is uniform in lambda (Polya), so the proportion
  with `S > M + R` tends to 1/2. Correct.
- Both proportions tend to 1/2: each is at least `1/2 - eps - o(1)` and the two sets are disjoint. Correct.
- Quantitative form: `int_T^{2T} S^2 = (T/(2 pi^2)) log log T + O(T sqrt(log log T))` is Selberg's k = 1 case with his
  error term. The third input `int_T^{2T} |arg zeta(sigma_0 + it)|^2 dt << T` for fixed `sigma_0 > 1/2` is not a
  consequence of (BJ) (a limit law does not bound second moments); it is in Tsang's thesis for `sigma >= 1/2` and was
  not checked here. It is used only in the quantitative remark, not in D1 or D2. Label it CLASSICAL (Tsang 1984), not
  re-read. The variance bookkeeping `(1/(2 pi^2)) sum_p (2 p^{-1/2-sigma_0} - p^{-2 sigma_0})` matches the prime model
  (per prime, `(1/2)(p^{-1/2} - p^{-sigma_0})^2` against `(1/2)/p`).

D2 was not in the scope of this pass except for its use of D1: under RH there are no zeros right of `sigma_0`, so
the conventions agree, and `N(T) - N_u(T) = D_a(T) + O(1)` then contradicts `|N - N_u| <= 1` by D1.

## 4. Limits of this pass

The five sources were not opened (one web lookup for another item of this lane succeeded, none was made for these).
The comparison is with the statements as they are standardly quoted; the constants were checked by computation
(section 1). If a referee with the papers at hand finds a difference in the set class of Bohr-Jessen (rectangles
against Jordan-measurable sets), D1 is unaffected: it uses one bounded rectangle.

Requirement flags: unchanged (all false; Part D is a filter statement, not an attack).
