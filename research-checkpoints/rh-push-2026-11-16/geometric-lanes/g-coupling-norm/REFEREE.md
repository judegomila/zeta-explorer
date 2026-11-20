# Referee report: g-coupling-norm (Target A)

Date 2026-11-16. Adversarial referee. Claimed verdict: precise-obstruction.
Referee verdict: **HOLDS, with four corrections** (none changes the verdict). No RH claim is made and none is implied.

Referee scripts and logs (outside the repo): `/tmp/ref-gcn/` (`t1.py`, `t2.py`, `cmp.py`, `dhrun.py`, `log_D.txt`);
remote copy `~/rh-push/g-coupling-norm-referee/` on the motherbox (CPU only, 7 processes, 288 s).

## 1. PROVED steps, re-derived by hand

| Step | Result |
|---|---|
| Zero-side form `K(x,y) = sum_w 1/((x-w)(y+w))`, `Q(v) = sum_w V(w)V(-w)` | CONFIRMED (pair `w <-> -w` in `L(y)`; converges absolutely for all `x,y > 0`). |
| Thm 1 (i) RH iff `rho(X;y) <= 1` whenever `P_X` is PD | CONFIRMED, but not "verbatim eq48 (a)". See correction C1. |
| Thm 1 (ii) strict `< 1` on every finite split iff RH | CONFIRMED (under RH `Q = sum |V(i gamma)|^2`, zero only for `V = 0`; converse via (i)). |
| Thm 1 (iii) sup = 1 | CONFIRMED (trivial: `y -> x_1`; also from Thm 2). |
| Thm 1 (iv) principal angles, `rho(X,Y) >= max_y rho(X;y)` | CONFIRMED when the full Gram matrix is PD. |
| Thm 2 factorization | CONFIRMED. Checked: `L+L' = 2 l_1 (1-phi phi')/((1-phi)(1-phi'))`; `1/(z+w) - 2x_1/((z+x_1)(w+x_1)) = b(z)b(w)/(z+w)`; reduced kernel `G G (L_1+L_1)/(z+w)` with `G = g b (1-phi_1)`; Richards formula; diagonal ratio `b^2(1-phi_1^2)/(1-b^2 phi_1^2)`. |
| Thm 2 inequality `1-rho^2 <= B_X(y)^2` | CONFIRMED. `r in [0,1]` excludes `phi^2 > 1/b^2` (gives `r > 1`) and `1 < phi^2 < 1/b^2` (gives `r < 0`); then `r <= b^2`. Needs PD prefixes so each ratio is defined; that is the stated hypothesis. |
| Thm 3 Christoffel form | CONFIRMED. `p(-y) = prod (x_j - y)`, bijection `c <-> q`, `Delta = min_q Q` needs only `P_X` PD; `L(y)/y = sum_{all gamma} 1/(y^2+gamma^2)`. RH is used only for `q(w)q(-w) = |q|^2`. |
| Thm 4 upper bound (under RH) | CONFIRMED. Uses `N >= 2m` and `gamma >= 1`. |
| Thm 4 lower bound (under RH) | CONFIRMED. `deg q <= N <= 2M-1 = deg omega - 2`; `|omega'(i gamma_k)|^2 = 4 gamma_k^2 (y^2+gamma_k^2) prod_{l != k}(gamma_l^2-gamma_k^2)^2`; Cauchy-Schwarz gives the stated constant. Needs the first M ordinates distinct (true). |
| Thm 5 | CONFIRMED. `-log b^2 >= 4xy/(x+y)^2 >= 8/9` inside a dyadic shell; shell count `<= 1 + (9/8) log(1/(1-q^2))`; Blaschke sum converges geometrically in both directions. |
| Invariance under block congruence | CONFIRMED (trivial). No claimed cancellation rests on a coordinate change. |
| `-4 sum_{k<=N/2} log gamma_k = -2N log N + 2N loglog N + O(N)` | CONFIRMED. |

Nothing labelled unconditional uses RH. Thm 3 (definite form) and Thm 4 are correctly labelled "under RH".

## 2. Numeric checks rerun on different cases (referee code, not the lane's)

1. Thm 2 product versus direct Schur complement, mpmath 120 digits, 9 random nodes in (0.05, 6), three draws each
   for xi and DH: relative agreement 1e-97 to 1e-104; `pivot <= B_X(y)^2` and `max|phi_k| < 1` in all six.
2. Thm 3 and Thm 4 on shuffled Chebyshev nodes (not a lane family), mpmath 400 digits, zeros from `zetazero`:

   | interval, N | pivot | upper | lower | truncated zero sum (400 zeros) / pivot |
   |---|---|---|---|---|
   | [0.2, 3], 9 | 2.80e-28 | 1.72e-22 | 3.30e-30 | 0.9985 |
   | [0.2, 3], 16 | 3.96e-55 | 2.23e-50 | 7.51e-59 | 0.9499 |
   | [0.05, 0.9], 23 | 1.29e-105 | 1.63e-95 | 2.80e-110 | 0.9774 |
   | [1, 30], 12 | 5.25e-17 | 1.71e-12 | 2.70e-20 | 0.9553 |

   Both bounds hold; the zero sum approaches the pivot from below as Thm 3 requires.
3. PR 56 cross-check reproduced: `rho = 0.99999999996638047952`, `1-rho^2 = 6.723904095e-11`.
4. DH inputs: functional equation to 8e-121; off-line zeros `0.808517182457 + 85.6993484854 i` and
   `0.65083008061 + 114.163342731 i` found by root-finding; 43 and 61 on-line ordinates below them
   (from `data/dh_zeros.json`; consistent with the DH counting function 43.95, 63.76).
   My Arb `L_dh` agrees with an independent mpmath evaluation and with a numerical derivative of
   `log Lambda` to 30 and 25 digits.

## 3. Davenport-Heilbronn control, run independently

New family D (not in the lane): base-3 van der Corput, linear in x on [0.3, 2]; 230 nodes; 14000 bits;
own right-looking LDL on the unnormalized Pick matrix in Arb.

* Orders 2 to 148: all pivots certified positive, and `pivot <= B_X(y)^2` at each.
* Order 149: `-7.9283933e-680 +/- 1.6e-689`. Order 150: `-1.6530355e-708 +/- 4.5e-716`.
* Non-positive pivots to order 230: exactly **149, 150, 218, 219**.

This is the same list as the lane's families A and B. The claim "DH positive through 148, first negative
pivot at 149" is CONFIRMED and extends to a third, unrelated family. Two negative squares per off-line
quartet is what a generalized-Nevanlinna count predicts (two poles of L in the right half-plane per quartet).
The result does not claim a zeta-only mechanism; it claims DH-blindness, and that is what the control shows.

Remark (not an error). Three families with different bases, scales and intervals give identical failure
orders. That points to an exact node-independent rule for bounded clustered families (the sign of the
confluent determinant), not an approximate constant `c x index`. The lane's `3.4 to 4` heuristic stays ARGUED.

## 4. Corrections

**C1 (Thm 1 (i), wording and domain).** eq48 condition (a) is stated for rates `x_j > 1/2`, not for `(0, inf)`,
and the refereed Weil/prime-side identity (21) converges only there. The lane's statement on `(0, inf)` is still
equivalent to RH, but by a two-line argument that is missing: (=>) RH gives `Q = sum |V(i gamma)|^2 >= 0` for all
positive nodes by the zero-side formula; (<=) the `(0, inf)` condition contains eq48 (a). It is not "verbatim".
Family A lies in [0.01, 0.5], outside the eq48 domain, so its link to the Weil identity is through the zero side only.

**C2 (two-sided asymptotic law needs a node hypothesis).** "For nodes in a fixed compact set,
`log(1-rho_N^2) = -2N log N + 2N loglog N + O(N)`" is false as a two-sided statement. Thm 4 shows
`1-rho^2` is proportional to `prod (x_j - y)^2`, which can be arbitrarily small for clustered nodes. The upper
side is correct as stated. The lower side needs `sum_j log|x_j - y| >= -O(N)` (true for the van der Corput
families) in addition to the zero-gap control already listed as MEASURED.

**C3 (DH and Thm 4).** "The upper bound of Theorem 4 with DH's own ordinates applies verbatim below the failing
order" is not proved. For `N >= 88` the trial polynomial uses `m >= 44` on-line ordinates, which passes the
off-line quartet at height 85.70; that quartet contributes an indefinite term that the proof does not bound.
The data files record `upper_ok = None` for DH, so it was not interval-checked either. The midpoint values do
satisfy the inequality (A, N=100: pivot -636.0, upper -608.1). Label: MEASURED (float), not PROVED.

**C4 (Thm 5, "non-determining").** Thm 5 proves margin => Blaschke. A Blaschke node set is necessary for
non-uniqueness of the positive-real interpolant; it is not shown that positivity on such a family fails to
imply RH. "Non-determining" should read "the identity-theorem uniqueness argument is not available".

Not checked: the citation "all node sets of order <= 5 are unconditionally positive (PR 48/50/54)"; section 4
extremal-vector shares and the twin horizon table; the half/half split values.

## 5. Surviving claim

`||T|| <= 1` on all splits with positive real nodes is RH, and so is strict `< 1` on every finite split; sup is 1.
`1-rho^2` equals the Schur-Blaschke product of Thm 2 and is at most the Hardy value `B_X(y)^2` under positivity.
Under RH it is a Christoffel function of the zero measure with the two explicit bounds of Thm 4; the upper
asymptotic `-2N log N + 2N loglog N + O(N)` is proved for bounded nodes, the matching lower side is measured
and needs node separation plus zero-gap control. A uniform margin forces a Blaschke node sequence. The law is
DH-blind: DH pivots are positive through order 148 and negative first at order 149 on three bounded nested
families (two by the lane, one by the referee), with further negatives at 150, 218, 219. No reparametrization
changes a singular value. No route to RH is opened; the obstruction is stated correctly.
