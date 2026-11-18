# REFEREE (adversarial, lens: general): c2-cutoff-hecke-defect

Date 2026-11-18. Target: RESULT.md, claimed verdict precise-obstruction, flags R1-R4 all false.

Verdict: **the obstruction holds, with four corrections.** Every step labelled PROVED was re-derived and is
correct. The errors are in unlabelled inferences of section 3 (what the node matrices bound) and in one
"must" statement about DH. None of them rescues the idea; two of them weaken what the measurement shows.
Nothing in the result assumes RH, restates verified height, or claims a statement about zeros of zeta.

## 1. PROVED steps, re-derived

| step | check | outcome |
|---|---|---|
| Lemma 1(a),(b) | `(QV - VQ)v(u) = p^-1/2 v(u+2l)[1_{u>c} - 1_{u>c-2l}]`; `V_p W` and `P V_p Q` computed separately; `Q V_p P = 0` since `u > c` and `u + 2l <= c` are incompatible | correct |
| Lemma 1(c) | Leibniz rule for `[Q, V_m V_n]`; `[Q,Z] = -PZQ` by linearity and absolute convergence | correct |
| Lemma 1(d) | substitution `r = u + 2l`: factor `p^-1/2 e^{-wl} = p^{-1/2-w}` | correct |
| Lemma 2 identity | `P M_c P = -P S* Q S P = -(QSP)*(QSP)`; `ran D_p` in `ran P_c` | correct |
| Lemma 2 "zero for one p iff Gamma_- = 0" | supports of `g(r - .)`, `r > c`, `supp g` in `(c-2l, c)`, cover `(0, inf)`; partition of unity | correct (uses that `S` is a convolution by a tempered distribution; true, `|S| = 1` on the axis) |
| Explicit residue form | `int_c^inf e^{-(conj w_k + w_k') r/2} dr = 2 e^{-(.)c/2}/(conj w_k + w_k')`, with the `(1/2)^2` of the two residue sums: prefactor `1/2` | correct under its stated finiteness hypothesis |
| Proposition 2' | `QZP = 0` gives `T_Z T_S = QZSQ`, `T_S T_Z = QSZQ - QSPZQ`, so `[T_Z,T_S] = QSPZQ = -Gamma_- [Q,Z]` | correct |
| Lemma 3 | `(1+aX/2)(1+aY/2) - (1-aX/2)(1-aY/2) = a(X+Y)`; `h_+^ = F + alpha F' = D`, `h_-^ = N`, so `SA = h_- *`; kernel of `Gamma_1 Gamma_0 + Gamma_0 Gamma_1` matches `M` | correct; holds for every even kernel, no hypothesis on zeros |
| Lemma 3(ii) bound | ratio of the `n = 2` term to the seed at `x = 0`: `(32 pi^2 - 12 pi) e^{-4 pi} / ((2 pi^2 - 3 pi) e^{-pi}) = 2.2e-3`; prefactor decreases from 26.96 to 16 | correct |
| Lemma 3(iv) | `kappa_theta = e^{i theta u/2} kappa`, conjugation by `E` | correct |
| Proposition 4 | reduces to G6 (3.1) (refereed) with `g = Q_c(kappa * a)`; convergence of `y_gamma` for all complex gamma follows from the `exp(-pi e^r)` decay | correct as a reduction; the Weil explicit formula step is quoted, not audited (the result says so) |

The equivalence "RH iff `[T_S, T_{V_p}] = 0`" depends on the refereed G6 statement `Gamma_- = 0 iff RH`; it
adds nothing to it.

## 2. Numeric check rerun with a different case (independent code)

Own code (mpmath, 90 digits, not the lane's `defect_gram.py`): `M(x,y)` by composite Gauss-Legendre
(96 nodes per panel), **Chebyshev nodes** (non-uniform, unlike the lane's uniform grid), 16 nodes on the
window `(0, 2 log 3]`, eigenvalues of the diagonally scaled matrix. Run through `scripts/memcap.sh 8`.
Two panel widths (0.25, 0.2) give identical `M_00` to 40 digits and identical eigenvalues for zeta and DH.

| kernel | negative eigenvalues | log10 of the negative ones | smallest positive (log10) | RESULT (uniform nodes) |
|---|---|---|---|---|
| zeta | 0 | none | -15.4 | 0 |
| DH | 0 | none | -15.8 | 0 |
| heat tau = -2 | 0 | none | -15.6 | 0 |
| T-NR | 3 | -3.7, -6.4, -12.0 | | 4 at 28 nodes: -4.1, -6.6, -12.1, -18.0 |
| seed only | 2 | -8.8, -12.9 | | 2: -9.4, -12.9 |
| Liouville (Hankel form) | 2 | -7.8, -11.8 | | 2: -8.0, -11.6 |
| heat tau = -40 | 3 | -9.6, -11.0, -16.2 | | 10 at 28 nodes: -9.5, -11.0, -15.8, ... |

Evenness `kappa(-x) = kappa(x)` confirmed to `1e-91` for the zeta and the DH kernel at `x = 0.37, 1.9`
(so the DH coefficients and normalisation are right). The measured table is reproduced in sign and in
magnitude at the depth I reached (`1e-16`). I did not reproduce the depth `1e-153` or `1e-390` runs.
The controls were run by me: DH and heat `tau = -2` pass; the result's statement that no zeta-only
mechanism exists is confirmed, not contradicted.

## 3. Errors and corrections

**E1 (wrong direction of a bound; section 3 "Object" and section 3.4).** The result says the inertia of the
node matrix `[M(x_i, x_j)]` "bounds the signature of every Gram matrix of `{D_p y}` on that window, for any
choice of vectors `y`". This is false as stated. A finite node matrix is a compression of the window
operator to point masses: its negative index is a LOWER bound for the negative index of `M` on
`L^2(0, 2 log p]`. Positive definiteness on 183 or 222 nodes gives no upper bound for Gram matrices of `L^2`
vectors. Consequences: (a) "zeta / DH positive definite on every window" must read "on every node set
tried"; (b) the sentence in 3.4 that the literal DH family `{D_p K_gamma}` "is bounded by the DH rows of
3.1 and 3.2, which are positive definite" is unsupported; the literal DH family was not run and nothing is
known about it from this lane.

**E2 (unproved "must").** Section 3.3: "by Lemma 3(iii) and G6 it must become yes at some larger
dimension". Neither cited item gives this. G6 gives indefiniteness of `H_c` on all of `L^2(R)` for DH.
(i) For the half-line compression `P_c H_c P_c` a density step is needed: `{h_+ * a : supp a in (-inf, c]}`
has transforms `D * H^2`, and this is dense in `L^2` of the axis because `int log|D(it)| dt/(1+t^2) = -inf`
(Szego; `log|D(it)|` is linear in `|t|`). With that step, positivity of the half-line compression is
equivalent to RH for every even kernel of order one. This is a referee sketch, not in the result and not
independently checked. (ii) For a FIXED finite window `(0, 2 log P]` no argument is given at all. The
one-prime argument of Lemma 2 lives in f-space (the range of `D_p` is the window in the variable of `f`);
in a-space the test is `f = h_+ * a` with `a` in the window, which is not supported in a window. Whether the
a-space compression to a fixed finite window is indefinite for DH is OPEN. So item 3 of the verdict
("restriction of the compression") and the reading "the form counts the off-line zeros that the
dimension resolves" are ARGUED for T-NR, `E_a`, heat `tau = -40` (measured growth 4, 6, 14) and
unestablished for DH.

**E3 (what the windows p > 5 test).** `out_zeta_P97.json`: `M_00 = 4.0e-2`, `M_{91,91} = 8.7e-256`,
`M_{182,182} = 3.3e-25039`. After diagonal scaling the block of nodes with `x` above about 3 is the identity
to many digits (the smallest of 183 pivots is only `1e-80`, against `1e-65` already at 64 nodes). The rows
`p = 13, 47, 97` add directions that are positive for a trivial reason (near-orthogonality from the
`exp(-pi e^x)` decay) for every kernel. "Every window `p <= 97`" contains the information of the window
`p <= 5` and nothing more. The result notes this for primes above 2 in 3.3; the headline should not count
the large windows as additional evidence. The effective depth of the test is the `p = 2` run with 222 nodes.

**E4 (novelty labels).** Proposition 2' is listed under "New here (ii)". It is the continuous-time form
of the Brown-Halmos / Sarason statement (a Wiener-Hopf operator commutes with the one-sided shift
semigroup iff its symbol is analytic); the result itself calls it CLASSICAL in the "Reading" paragraph. It
should be labelled CLASSICAL in both places. Lemma 3 is a two-line rewriting of G6 (2.1); Proposition 4 is
map row P21 on a subclass of tests (`g = Q_c(kappa * a)`, `a` left of the cut), not on all one-sided tests:
"equal to the Weil form on one-sided tests" should say "on the one-sided tests of the form `Q_c(kappa * a)`".

Minor.
- Provenance of the "after the fix" statement: the logs of the `P97` and `P13_h025` runs (23:54 to 23:56)
  print an allocation line of a different format from the current `defect_gram.py` (00:10); they were
  produced by an earlier revision. Whether that revision already had the endpoint fix cannot be confirmed
  from the files. Indirect support: probe entries `(0,0)`, `(0,5)` of `out_zeta_P5.json` and `out_zeta_P97.json`
  agree to 60 digits, and my independent 16-node run agrees in sign.
- Quadrature error outside the balls (weakest step 1 of the result) stands. My estimate: tail truncation
  is `10^-dps/2` absolute (`1e-500` for the 222-node runs, pivots `1e-390`), Gauss-Legendre error far below;
  no sign of a problem, but the inertia at depth is MEASURED, as the result says.
- The comparison of T-NR pivot ratios with `10^{-0.68 gamma}` (6.2 per step of 9.06) fits the last two steps
  (5.5, 6.0) and not the first (2.5). It is an order-of-magnitude remark.
- Liouville and seed rows are not instances of `H_c` (the kernel is not even); the result says so. They
  show only that the Hankel form is sensitive to evenness. "Completely multiplicative fails" should not
  be read as a control of the same object.
- Phase-rotated transfer operator and `theta^w`: not run. The control table is incomplete; since the lane
  has no positive mechanism this does not affect the verdict.

## 4. Checks requested

- Assumes RH anywhere: no. Zeta's positive table is stated as not being evidence.
- Restates verified height: no height input is used. The positive zeta table is consistent with any
  location of zeros above the resolved range; it is not presented as information on zeros.
- Known theorem presented as new: Proposition 2' (E4), partially.
- Zeta-only mechanism: none claimed; DH and heat `tau = -2` pass in my rerun as well.

## 5. Requirement flags (referee's own setting)

- R1 = false. Lemma 1 and Proposition 2' are kernel-free and length-only; Lemma 3 is bilinear in the
  coefficients; DH passes the test.
- R2 = false. `c`-independence is translation covariance; no height localisation; sensitivity to an
  off-line pair decays exponentially in its height.
- R3 = false. No argument exists that a control could fail; DH and backward heat `tau = -2` pass.
- R4 = false. Finite-stage object; no passage to the line.

## 6. Surviving claim

`D_p = [Q_c, V_p] = -P_c V_p Q_c` has range `L^2(c - 2 log p, c]` and carries the prime only as a length
(PROVED). In f-space the defect form is `-||Gamma_- D_p v||^2`, the PP block of G6; with G6 it vanishes for
one prime, or one translation, iff RH (PROVED from G6; CLASSICAL commutant statement). In a-space the
left compression of `H_c` is `alpha(Gamma_1 Gamma_0 + Gamma_0 Gamma_1)`, independent of `c` (PROVED), and is
the Weil form on tests `Q_c(kappa * a)` (PROVED from G6 (3.1)). MEASURED, on finite node sets only (uniform
nodes in the result, Chebyshev nodes in this report): zeta, DH and heat `tau = -2` give positive definite
node matrices at every size tried; T-NR, `E_a`, heat `tau = -40`, the seed and the Liouville Hankel form
give negative directions. The construction does not separate zeta from DH at any depth reached and uses
no multiplicativity. Not established: any upper bound on the negative index of the window operator from
node matrices; that the fixed-window compression detects DH at any dimension.

Scratch code for section 2 was kept outside the lane directory (`/tmp/c2ref.*/ref_check.py`); only this file
was written here.
