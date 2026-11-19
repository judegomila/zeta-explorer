# c6-pair-probe-bridge-order2: a probe quadratic in the target (pair probe) in the 7/8 estimate system

Internal working note, 2026-11-18. Slug `c6-pair-probe-bridge-order2`. Kind: combine (bridge Krein square x coherent
set). Not refereed. Nothing committed, pushed or posted. Files: `pair_lp.py` + `pair_lp.log` (exact rational LP by
vertex enumeration, python stdlib, one local run through `scripts/memcap.sh 8`, 43 s). The compute server was not used.

Every abscissa below is the value of a hypothetical ESTIMATE SYSTEM relative to unrefereed sources (openai/math
manuscript `~/lean-deps/qrh-verify/paper.txt`; Liu II). None is a zero-free region. No statement about any zero of
zeta is made. 7/8 (unrefereed) stands; RH open. NO QED.

Labels: PROVED (complete argument here) / PROVED-rel X / EXACT (rational LP; CONFIRMED = feasible at the value and
infeasible 1e-9 below) / LP (bisection to 2^-36) / MODEL / ARGUED / OPEN.

## Verdict

**Precise obstruction. The pair probe is a re-expression of the linear probe; the decisive test returns no vertex
with h > 1.** Three statements.

1. **Two kinds of pair, and neither carries new size information (Lemma P, PROVED).** A probe bilinear in the target
   has signal f(Z1) f'(Z2) (product of two linear signals). (a) The same-side pair (rho, rho') has size Z^{2 beta}:
   slope two, and Proposition 2.1 applied to it is Proposition 2.1 for the linear signal with every exponent halved.
   It does not use the functional equation (it exists for THIN). (b) The functional-equation pair (rho, 1 - conj rho),
   which is the pair of the bridge involution J, has product of size Z^{beta} Z^{1 - beta} = Z, the same exponent
   as an on-line pair. Its exponent does not depend on beta; a size comparison of Prop. 2.1 type cannot see it. The
   bridge reads this pair through a sign (Krein signature), not a size.
2. **Homogeneity (Lemma H; algebra PROVED, inputs MODEL; checked EXACT).** The product-row pair probe with rows of
   mark lengths l1, l2 has frequency exponent h2 = 2 + l1 + l2 - lx and per-zero signal constant
   h_pair = h2/2 = 1 + (l1 + l2)/2 - lx/2. Its full estimate system (low side, range losses, ideal high side) at
   (lx, ly, l1, l2) is the single-probe system of `c5-target-fe-order2-ledger` at (lx/2, ly/2, (l1 + l2)/2):
   36,000 exact membership comparisons, 0 mismatches. The pair probe is the linear probe at scale Z^2 with the
   squared target.
3. **Decisive test (EXACT).** With both compensations applied (lx, ly >= l1 + l2) h_pair <= 1 and the ledger is
   13/15 (h_pair = 4/5), 31/36, 5/6 (h_pair = 1), all CONFIRMED; doubling the prime amplitude of the squared target
   changes none of them. In the hypothetical per-row geometry (lx >= max(l1, l2)), where h_pair > 1 is allowed, the
   full ledger still returns 13/15 at h_pair = 4/5; vertices with h_pair > 1 appear only with range losses deleted
   (K removed and G = 0: 0.80556 at h_pair = 7/6; k = 0: falls to the search bound 0.25 for every box, so that
   reduced system is inconsistent). These are the lx < l vertices already found by the referee of c5, in new
   coordinates.

Stop rule of the assignment met twice: "re-expression under Lemma U" (statement 2) and "high-side cost doubles with
the signal" (the whole system is degree-one homogeneous: signal, low side and high side all double). No vertex goes
to referees. No pivot produced a new object (section 7).

---

## 0. Plan; relation to closed rows

Read: BRIEF to the end; OBSTRUCTION_MAP section 2 (controls) and rows Z13-Z18, Z21; `g-spinor-square-root` RESULT
(sections 1-4); `c5-target-fe-order2-ledger` RESULT + REFEREE + `tiers_fe.py`; `r3-method-limit` (system, GEO);
`h-seven-eighths-in-bridge` (verdict, section 4); `e2-sixfold-period-z2` (verdict, sections 1-3); manuscript
Proposition 2.1 (paper.txt 381-455).

Not repeated: the wall dictionary (h-seven-eighths-in-bridge), the Z/2 x Z/3 character of the exceptional term (e2),
target reflection and Lemma U (c5), the bridge identities (g-spinor).

New here: (i) the definition of a pair probe in Prop. 2.1 format and its signal constant; (ii) Lemma P, separating
the same-side pair from the functional-equation pair and showing the second is beta-blind in size; (iii) Lemma H and
its exact check; (iv) the LP in pair variables, including the one geometry in which the pair probe could differ from
the single probe (per-row compensation).

## 1. First lemma: the pair probe and its signal constant

Single probe (manuscript (6.2); notation of `r3-method-limit`): I = Q^{-1/2} Sum_m A_m B_m(eta), Q = XY = Z^{lx+ly},
A_m an additive polynomial of length Y with |A_m| ~ Y^{-1/2}, B_m(eta) the completed cubic-theta row over A = c n^3
of scale Z (marked Z^{1+l}) with weight psi(A) = nu(A) theta(A) chi_A(m), the target eta inside nu. Signal
Z^{C(s)} H(s)/L(s, eta), C(s) = s - 1 + lx/2 + h/6, h = 1 - lx + l (frequency length after Poisson in m: modulus
Y Z^{1+l} over length XY).

**Definition (pair probe).** I2(Z1, Z2) = Q^{-1/2} Sum_m A_m B_m(eta; Z1, l1) B'_m(eta'; Z2, l2), eta' in {eta, conj eta},
rows of scales Z1, Z2 and mark lengths l1, l2. It is bilinear in the target. The character of the summand in m is
chi_A(m) chi_{A'}(m) = chi_{AA'}(m), so the product of the two rows is one row over A'' = A A' of scale Z1 Z2 whose
target coefficient is the Dirichlet convolution of eta and eta' restricted to the factorisation A'' = A A' (for
coprime c, c' the Gauss-sum weights multiply up to a cubic cross symbol between c and c'; ARGUED, weakest step 1).

Frequencies at Z1 = Z2 = Z: modulus Y Z^{1+l1} Z^{1+l2} over length XY, so

  h2 = 2 + l1 + l2 - lx,     signal exponent  C2(s1, s2) = s1 + s2 - 2 + lx/2 + h2/6      [MODEL transplant of (S)]

(count Z^{h2/6} of sixth powers among the frequencies; square-root level lx/2 unchanged because Cauchy-Schwarz has
||A||^2 = Q/Y and at best |B_m B'_m| ~ 1). The principal row gives the reciprocal of each factor:
signal = f_eta(Z1) f_{eta'}(Z2) up to a coupling factor H(s1, s2).

**Signal constant per zero.** Lemma U's normalisation is slope one in the real part of the zero that is read.
At a pair of zeros of real part beta, C2 = 2 beta - 2 + lx/2 + h2/6 = 2 [beta - 1 + lx/4 + (h2/2)/6]. So

  **h_pair = h2/2 = 1 + (l1 + l2)/2 - lx/2.**

Compare h = 1 + l - lx at the same X and per-row mark length l: h_pair = 1 + l - lx/2 > h. The gain is that the two
rows share the row variable m (X is paid once). The low level lx/2 is also shared, so per zero it is lx/4, and the
floor reads 1 - h_pair/6 = 5/6 + (lx/2 - l)/6.

**Lemma P [PROVED; analytic conditions of Proposition 2.1; factorised H].**
(a) Suppose H(s1, s2) = H1(s1) H1(s2), eta' = eta (or conj eta with H1 symmetric under conjugation), and for
J2(Z) := I2(Z, Z): |J2| << Z^{E}, |J2 - f(Z) f'(Z)| << Z^{2 beta* + c2 - 2 sigma}. Then |f(Z)| << Z^{max(E/2, beta* + c2/2 - sigma)}
(for eta' = conj eta, f' = conj f and the product is |f|^2; for eta' = eta, f' = f). This is hypothesis (2.6) of
Proposition 2.1 for the LINEAR signal with constant c = c2/2 and low exponent E/2; the rest of that proof runs
unchanged. So a same-side pair probe proves exactly what the linear probe with halved exponents proves, and by
Lemma U of c5 the constant c2/2 is an invariant of f.
(b) The formal residue expansion of the product contains, for a zero rho = beta + i gamma and its partner
1 - conj rho = 1 - beta + i gamma (a zero of the same L by the functional equation), the term
Z^{1 + 2 i gamma + c2} / (L'(rho) L'(1 - conj rho)). Its modulus is Z^{1 + c2} |L'(rho) L'(1 - conj rho)|^{-1} for every beta in
(0, 1); on-line zeros give the same exponent. The dominant term at Z -> infinity is the same-side term Z^{2 beta + c2}.
(c) Shifted product: a probe with signal Z^{s+c} H(s)/(L(s, eta) L(s - d, eta)) (the "zeta(s) zeta(1 - s + d)" form after
the functional equation, which turns 1/L(1 - s + d) into a gamma ratio times 1/L(s - d)) is the linear probe for the
degree-two target with local parameters eta(p), eta(p) Np^{d}. Its rightmost pole is at beta* + d and every row
coefficient grows by N(A)^{d}: signal and low side both shift by d (the E_a scaling, row Z18). At the resonant
shift d = 2 beta - 1 the product L(s) L(s - d) has a double zero at rho (partner of one factor on the zero of the
other): a factor log Z, no exponent.

Proof of (a): triangle inequality, then a square root. (b), (c): direct computation; for (c)
Sum mu(c) t(c) Nc^{-s} with t multiplicative equals Prod (1 - t(p) Np^{-s}), which for t = eta (1 * N^d) is
1/(L(s) L(s - d)) times a product absolutely convergent for Re s > (1 + d)/2. QED

Reading for the combination. The bridge identity H_c = alpha Sum y_gamma conj(y_{conj gamma}) pairs gamma with conj gamma,
i.e. rho with 1 - conj rho; the two factors grow like e^{+bc} and e^{-bc} in the cutoff, the product is c-independent, and the
off-line pair is detected by the signature (1,1) of the hyperbolic plane. That is statement (b): the pair product
has no size information. The coherent-set mechanism is a size comparison. The two supplies do not compose: the
bridge side gives a sign at every height with no margin (eq48 Theorem 4), the coherent set gives a size with slope
one in beta, and the pair product has slope zero. Also, the bridge kernel (1.1) of g-spinor is linear in F'/F; it is
quadratic in the test vectors, not in the target.

## 2. Lemma H: the pair system is the single system at scale Z^2

Pair system in units of log Z, l = l1 + l2, M = lx + ly, b = ly - lx (formulas typed independently in `pair_lp.py`):

| item | pair | single (c5, w = 0) at lx' = lx/2, ly' = ly/2, l' = l/2 |
|---|---|---|
| frequency exponent | h2 = 2 + l - lx | h' = 1 + l' - lx' = h2/2 |
| low side | 2B >= 2 - h2/6 + G + k2/2 | B >= 1 - h'/6 + G' + k'/2 |
| Gram excess | G = max(0, b/12, b - ly/2) | G' = G/2 |
| dual length of the product row (length 2 + l, marks l) | T2 = 2M + 2l - (2 + l) = 2M + l - 2 | T' = 2M' + l' - 1 = T2/2 |
| range loss | k2 = max(0, l - T2/4, T2 - M, (3l - 2)/2) | k' = k2/2 |
| ideal high side | 1/2 + d/2 - B - ly/4 + (h2/2)(5/6 - d) - l/4 + amp (l/2) d x <= 0 | E(d, x) <= 0 at amp = 1 |
| geometry | lx, ly >= l1 + l2 | lx', ly' >= l' |

**Lemma H [algebra PROVED; every input MODEL].** Each constraint of the pair system is the corresponding constraint
of the single system at (lx/2, ly/2, (l1 + l2)/2). Hence the abscissa functions agree and so do all infima.
Reason: every exponent of the single system is homogeneous of degree one in (lx, ly, l, 1), where "1" is the length
of the target row; the pair probe replaces Z by Z^2 in the target and leaves X, Y, P alone.
Check (`pair_lp.log` S): 4000 random rational points x 3 choices of G x 3 choices of deleted losses, B random:
membership in the pair system (typed in pair variables) equals membership in `tiers_fe.system` at the rescaled point
in all 36,000 cases.

The modelling of the product row is the optimistic one (one reflection of the whole product row with the same
range-loss law). The alternatives are worse: without a Voronoi formula for the convolution weight the product row
is on the unreflected branch (abscissa >= 1, statement (D) of c5), and Holder gives the fourth moment of single
rows.

Geometry. With marks in both rows the compensated probe is the inclusion-exclusion over both mark primes; its last
term has lengths X/(P1 P2), Y/(P1 P2), which must be >= 1: lx, ly >= l1 + l2 [PROVED-rel (GEO) of r3-method-limit].
Then **h_pair = 1 + (l1 + l2 - lx)/2 <= 1**, with equality at lx = l1 + l2. Marking only one row (l2 = 0) gives
h_pair = 1 + (l1 - lx)/2 <= 1 under lx >= l1. No allocation of marks gives h_pair > 1 with all compensations present.

## 3. Decisive test (`pair_lp.py`, `pair_lp.log`)

Pair geometry lx, ly >= l1 + l2, ideal high side:

| run | infimum | point (lx, ly, l1, l2) | h_pair |
|---|---|---|---|
| P1 full ledger | 13/15 CONFIRMED | (4/5, 4/5, 0, 2/5) | 4/5 |
| P2 full ledger, prime amplitude doubled (squared target) | 13/15 CONFIRMED | same | 4/5 |
| P3 K removed | 31/36 CONFIRMED | (1, 1, 0, 2/3) | 5/6 |
| P4, P5, P7 k = 0 (G src; G = 0; GRH counts) | 5/6 CONFIRMED | (1, 1, 0, 1) | 1 |
| P6 k = 0, G = 0, amplitude doubled | 5/6 (LP) | (1, 1, 0, 1) | 1 |

Only l1 + l2 enters outside the geometry; the vertex (l1, l2) = (0, 2/5) and the symmetric one (1/5, 1/5) (run R11)
give the same value.

Hypothetical per-row geometry lx, ly >= max(l1, l2) (each row compensated as if alone; no construction is given for
it; it is the only compensated geometry in which h_pair > 1 is admitted, up to h_pair = 1 + lx/2):

| run | infimum | point | h_pair |
|---|---|---|---|
| R1, R2, R3, R14, R16 full ledger (G src or polar; amp 1 or 2; boxes 2, 4, 8, 16; GRH counts) | 13/15 (LP) | (4/5, 4/5, 0, 2/5) | 4/5 |
| R4, R5 K removed (G src, polar) | 31/36 (LP) | (1, 1, 0, 2/3) | 5/6 |
| R15 K removed, G = 0 | 0.8055556 (LP) | (1/3, 2, 1/3, 1/3) | 7/6 |
| R6 K, P removed, G polar | 2/3 at box 8 (box-bound) | (8, 8, 8, 2) | 2 |
| R7-R10, R12, R13 k = 0 | 2/3, 1/2, 1/4 at boxes 2, 4, >= 8 (search bound) | l1 = l2 = lx = box | up to 4.5 |
| R18 full ledger, uncompensated high side | 0.8809524 (LP) | (6/7, 6/7, 0, 2/7) | 5/7 |

Free and anti geometry: F1, F2 full ledger 13/15 at h_pair = 4/5; F3 anti, no compensation, full ledger: 1;
F4 same with G polar: 9/10 at h_pair = 1; F5 anti, K removed, G = 0: 7/9 at h_pair = 4/3. F4 and F5 are the
referee's corrected c5 values (9/10; 7/9 at h = 4/3) at the rescaled points, as Lemma H requires.

**Answer to the test: no.** With the losses of the sources in place, h_pair > 1 at no feasible optimal point in any
geometry; the optimum stays at 13/15 with h_pair = 4/5. h_pair > 1 occurs only (i) outside the compensated geometry
or in the hypothetical per-row geometry, and (ii) with at least the K-loss and the Gram excess deleted; with k = 0
the value runs to the search bound for every box, below 1/2, which no consistent system can return (zeros on the
critical line exist). The R15 vertex (0.80556, h_pair = 7/6) needs three unsupported inputs at once (per-row
compensation, K-loss deleted, polar and P_a^2/Y' terms deleted at b = 5/3); it is the single-system point
(1/6, 1, 1/3), inside the region lx < l that c5 and its referee already mapped. It is not a model vertex of the
required kind: no stated lemma supplies the inputs, and the low estimate there is not derived.

## 4. Why the cost doubles with the signal

The signal of the pair probe is the square of the linear signal (Lemma P(a)); the low side is Cauchy-Schwarz with
the product row, whose mean square is the fourth moment of the rows (optimistically the mean square of one row of
doubled length); the high side counts the remaining rows of the doubled row. Every exponent is degree-one
homogeneous in the length of the target row, so replacing the target by its square at the same X, Y multiplies
target-length terms by 2 and the per-zero abscissa is a function of (lx/2, ly/2, l/2) only. The one new degree of
freedom is that X is not doubled; it is equivalent to using a shorter X in the single probe, and the binding
constraint in that direction is the compensation geometry (lx >= total mark length), which the pair probe inherits
as lx >= l1 + l2.

## 5. Controls

No statement about zeros is made, so no control has to fail for a conclusion. Where each sits:

* **DH (has off-line pairs).** The target is a combination c_1 eta_1 + c_2 eta_2. The pair probe is bilinear:
  signal Sum c_i c_j f_{eta_i} f_{eta_j}, with poles at zeros of the constituents only. It is blind to the off-line
  pairs of DH, at the same step as the linear probe (signal extraction; Lemma 4.1 of h-seven-eighths-in-bridge:
  mu a is the Dirichlet inverse only for completely multiplicative a). Quadratic dependence on the target does not
  help: no bilinear form in the coefficients has the Dirichlet inverse of the sum as its principal row. [PROVED for
  the product form of the signal; the extraction itself PROVED-rel manuscript Lemma 7.1]
* **THIN (no functional equation; pair absent).** A zero at b has no partner. The same-side pair probe exists
  (Lemma P(a) needs no functional equation) and reads (b, b) with size Z^{2b}; the row reflection is unavailable,
  so only the unreflected branch remains and by Lemma H its abscissa is the single value 1 [MODEL, from statement (D)
  of c5]. This shows the same-side pair probe does not use the pair structure of the bridge at all.
* **Unimodular twist U.** With eta' = conj eta the twist cancels only on the diagonal A = A'; the signal is |f_{eta u}|^2,
  a non-negative quantity whose size is that of the linear signal squared. Reflection is unavailable unless u is a
  Hecke character. Same position as THIN. [ARGUED]
* **E_a = zeta(s+a) zeta(s-a).** Lemma P(c): the shifted-product pair probe is the linear probe of a twist of E_{d/2}.
  Local parameters are not unimodular; every exponent shifts by a per target factor, the pair signal and the pair
  low side by 2a, and the per-zero floor reads 5/6 + a against zeros at real part 1/2 + a. [PROVED-rel the ledger]
* **Window translate WT.** With eta' = conj eta and Z1 = Z2 the product |f|^2 carries no oscillation Z^{i gamma}: the pair
  probe is invariant under translating the target in height. The reflection cost in height (w = 4 tau, +w/15 in c5)
  is paid by each row separately and is unchanged. Height-translation invariance of the signal gives no uniformity
  in height for any estimate. [ARGUED]
* Backward heat, T-NR, Beurling, phase-rotated transfer operator, theta^w: not formulable (no row/target structure);
  nothing is claimed for them.

## 6. Requirement flags

| flag | value | evidence |
|---|---|---|
| R1 multiplicativity essential | false | Lemma P and Lemma H use no Euler product beyond what Prop. 2.1 uses; they hold for every admitted target (THIN included) |
| R2 height-uniform, every window | false | no conclusion about zeros; the pair signal is height-translation invariant but no estimate is |
| R3 controls fail structurally | false | nothing is claimed that a control must break; section 5 records positions only |
| R4 reaches the critical line | false | h_pair <= 1 in the compensated geometry; full-ledger optimum 13/15 at h_pair = 4/5 in every geometry; h_pair > 1 only in an inconsistent reduced system or with three unsupported deletions |

## 7. Pivot (one, examined and closed)

Adjacent idea: unequal rows (scales Z and Z^theta, or n rows). The same homogeneity applies: target length
1 + theta (or n), h_n = (target length) + l - lx, per-zero constant h_n / (target length), and the system is the
single system at (lx, ly, l)/(target length) [ARGUED by the same algebra; not run]. No new object. The remaining
adjacent idea, reading the functional-equation pair through its sign instead of its size, is the bridge positivity
problem itself (rows of the map on finite-test positivity: no margin) and has no Prop. 2.1 format. Stopped.

## 8. Three weakest steps

1. **The pair signal formula is a transplant.** C2 = s1 + s2 - 2 + lx/2 + h2/6 and "product row = one row of doubled
   length with convolution weight" are ARGUED from multiplicativity of chi_A(m) in A; the cubic cross symbol between
   c and c', non-coprime pairs, and the coupling factor H(s1, s2) were not derived from manuscript sections 6-10.
   Lemma P(a) is proved for factorised H only; with a coupled H and only the diagonal Z1 = Z2 one gets the
   convolution of the two reciprocals, and the non-cancellation of its singularities at rho + rho' is not shown.
   Since the result is negative, the optimistic reading is the conservative one.
2. **The low side and high side of the product row are models.** One reflection of the product row with the single
   range-loss law is assumed (optimistic); "prime amplitude doubled" for the squared target is a guess at the only
   term that might not be homogeneous, tested in both forms. All inputs come from unrefereed sources, as in
   r3-method-limit and c5.
3. **The compensation geometry lx >= l1 + l2.** It is read from the inclusion-exclusion form of the compensated
   probe, not derived for a two-row probe. If a compensation scheme with lx >= max(l1, l2) existed, the full ledger
   would still give 13/15 (runs R1-R3, R14, R16), so statement 3 of the verdict does not depend on this step; only
   the classification of the deleted-loss vertices does.

## 9. Proposed map row (not applied)

| Z15c | Probe quadratic in the target (pair probe) | A bilinear probe has signal f(Z1) f'(Z2). Same-side pair: slope two, equal to the linear probe at scale Z^2 with the squared target; system identical under (lx, ly, l) -> (lx/2, ly/2, (l1+l2)/2) (36,000 exact comparisons); h_pair = 1 + (l1+l2-lx)/2 <= 1 under lx >= l1 + l2; ledger 13/15, 31/36, 5/6 unchanged. Functional-equation pair (rho, 1 - conj rho): product of size Z for every beta, no size information; the bridge reads it by sign. Shifted product zeta(s) zeta(s - d): E_a scaling, invariant. | PROVED (Lemma P, factorised H); algebra PROVED and EXACT LP on MODEL inputs (Lemma H) | DH: blind at signal extraction; THIN: same-side probe exists, unreflected branch, abscissa 1; E_a: shift by a | `c6-pair-probe-bridge-order2` |

No abscissa below 0.874886647 is proved. Nothing here concerns zeros of zeta.
