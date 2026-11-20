# e2-legendre-riesz-level-phase: RESULT

Combination: `legendre-lcm-identity` x `legendre-dual-restriction-rule` x `landau-one-sided-d-bound` /
`one-sided-excess-target` x `zero-complete-rational-tents` (Riesz order k), with `vaughan-forcing-is-gauge` as the
source of the two free normalisations.

**Verdict: precise obstruction, with one partial result (an exponent sandwich that closes as k grows). No proof of
RH. No statement about the location of zeros. No bound changes.**

The first decisive test was run and it kills the combination as a lever:

1. The certified one-sided excess exponent is never below 1/2. For every k, every level theta and every
   certificate, the certified value is >= psi_k(X)/X^k, and the excess of psi_k is Omega_+(X^(Theta - eps)) with
   Theta = sup Re rho >= 1/2 (CLASSICAL). So alpha_k(theta) >= Theta >= 1/2 everywhere.
2. For levels D >= about 2 sqrt X (theta > 1/2 asymptotically; this is inside the "unconditional range"
   theta <= (2k+1)/(2k+2) for k >= 1) the exact LP is pinned: its value equals psi_k(X)/X^k to 1e-10 relative
   (MEASURED: k = 0, 1 for X up to 1e6; k = 2 for X = 1e3, 1e4, and within 1e-5 sqrt X at 1e5). The certificate
   is Dirichlet's hyperbola form of Lambda = mu * log; the optimal dual point is Lambda. The LP returns the truth and adds no information.
3. For theta <= 1/2 the exact LP is not pinned and the gap grows like X^0.73 to X^0.82 (MEASURED), consistent with
   the bound X^(1 - theta(1 - Theta) + eps) proved below.
4. The sawtooth-blind (robust) LP, which is the object the first lemma is about, has excess of the size of the
   zero sum itself on the tested range for k = 1, 2 and theta >= 0.7 (0.01 to 0.03 sqrt X for k = 1, 0.001 sqrt X
   for k = 2; fitted exponents 0.52 to 0.53). Its value is a prime-free quantity. Theorem U below gives
   Theta <= nu_k <= Theta + (1 - Theta)^2/(k + 2 - Theta) for its exponent, so the method loss vanishes as k grows
   and what remains is exactly Theta. A bound O(X^(1/2+eps)) for the robust LP is equivalent to RH in the limit
   k -> infinity; nothing in the combination supplies it.

Grades: PROVED = complete argument here, author only, unrefereed. CLASSICAL. MEASURED = float64, scipy/HiGHS,
every constraint n <= X re-checked after each solve. ARGUED = mechanism stated, not written in full. OPEN.

Sources read: BRIEF.md; OBSTRUCTION_MAP.md (controls, rows P13, S2, S4, T2, positive list); graph nodes listed
above; `e1-cofinal-legendre-dual/{RESULT,REFEREE}.md`; `e1-forcing-free-bilinear-split/{RESULT,REFEREE}.md`
(Proposition G, Corollary F, referee error E1 with the restricted-level table);
`formalization/rh-attempts/2026-11-01-r3-legendre-dual-lp.md` (Lemma 1.1, Theorems RIG, S, E).

---

## 1. Plan, and what is new

Weight-1 normalisation throughout (the half-weight sum S(X) of the assignment is the same problem after partial
summation; the half-weight LP was run once, section 3.0, to reproduce the referee table).

    psi_k(X) = sum_{n<=X} Lambda(n) (X-n)^k / k!          target: psi_k(X)/X^k - X/(k+1)! <= C sqrt X  (k >= 1)
    T_k(y)   = sum_{m<=y} log m (y-m)^k / k!               (k-fold integral of log floor(y)!)
    f(t)     = sum_{b<=1/t} (1-bt)^k / k!   (0 < t <= 1),  f = 0 for t > 1
    tau(d)   = (d/X)^k T_k(X/d),   r(n) = (1-n/X)^k / k!

Steps: (i) first lemma and the two LPs; (ii) the decisive test (k = 0, 1, 2; theta = 0.3..0.9; X = 1e3..1e6);
(iii) the floor and the dual point; (iv) controls.

New relative to the two e1 lanes and the source: the Riesz-order LPs (exact and robust) at restricted level, the
pin threshold D* ~ 1.4 to 2.2 sqrt X for k = 0, 1, 2, Theorem U (level/Riesz exponent sandwich; at k = 0 its
optimum reproduces the source's Theorem S bound 1/(2 - Theta)), and the measured size of the robust excess for
k = 1, 2. Nothing here is claimed as novel mathematics; every step is elementary.

---

## 2. First lemma and the two LPs

### 2.1 Certificate inequality (PROVED)

For c supported on d <= D put phi_c(n) = sum_{d<=D} c_d f(nd/X). If phi_c(n) >= r(n) for 2 <= n <= X, then

    psi_k(X)/X^k <= V(c) := sum_{d<=D} c_d tau(d).

Proof. sum_n Lambda(n) f(nd/X) = sum_n Lambda(n) sum_b (1 - bnd/X)_+^k/k! = sum_m log m (1 - md/X)_+^k/k! = tau(d)
by 1 * Lambda = log. So V(c) = sum_n Lambda(n) phi_c(n) >= sum_n Lambda(n) r(n), using Lambda >= 0 and
Lambda(1) = 0. QED. The only arithmetic inputs are 1 * Lambda = log and Lambda >= 0. The LP does not know which n
are prime powers.

c = mu on all d <= X is feasible with equality at every n (sum_d mu(d) f(nd/X) = r(n)) and V(mu) = psi_k(X)/X^k.

### 2.2 Sawtooth of T_k (PROVED form, constants MEASURED)

    T_k(y) = P_k(y) + s_k(y),
    P_k(y) = y^(k+1) (log y - H_{k+1})/(k+1)! + sum_{j=0}^{k} a_{k,j} y^(k-j),  a_{k,j} = (-1)^(j+1) zeta'(-j)/(j!(k-j)!),
    s_k(y) = -(-1)^k-type Bernoulli term:  |s_k(y)| <= b_k log y + 0.1,   b_k = sup|B_{k+1}|/(k+1)! = 1/2, 1/12, sqrt3/216.

P_k is the sum of residues of -zeta'(s) y^(s+k)/(s(s+1)...(s+k)) at s = 1, 0, -1, ..., -k (CLASSICAL). The
remainder is the Euler-Maclaurin term of order k+1, B~_{k+1}(y) log y/(k+1)! + O(1/y). Checked: `saw.py`
(float64, y < 2e5, k = 0, 1: sup|s_k|/log y = 0.50001, 0.0839) and 40-digit mpmath at seven points for k = 1, 2
(s_1(3000)/log 3000 = -0.0833333, s_2(3000.2113)/log = -0.0080188 against sqrt3/216 = 0.0080188). The constant 0.1
covers the measured maximum of |s_k| - b_k log y (0.081 for k = 0).

The assignment's lemma is therefore correct up to a logarithm: for any c,

    V(c) = Main(c) + S(c),   Main(c) = sum_d c_d (d/X)^k P_k(X/d),
    |S(c)| <= N(c) := sum_d |c_d| (d/X)^k (b_k log(X/d) + 0.1) <= (b_k log X + 0.1) max|c| D^(k+1)/X^k.

With max|c| = O(1) the sawtooth error is below sqrt X for theta < (2k+1)/(2k+2). Main(c) is explicit:
Main(c) = [A (log X - H_{k+1}) + B] X/(k+1)! + sum_j a_{k,j} X^(-j) sum_d c_d d^j, A = sum c_d/d,
B = -sum c_d log d/d.

### 2.3 The two LPs

* **LP-E (exact).** G^E_k(X, theta) = min V(c) over feasible c on d <= D = X^theta. Dual: max sum_n y_n r(n) over
  y >= 0 with sum_n y_n f(nd/X) = tau(d) for d <= D ("every nonnegative sequence that satisfies the k-fold
  integrated Legendre identities at the levels X/d, d <= D").
* **LP-R (robust, sawtooth-blind).** G^R_k(X, theta) = min [Main(c) + N(c)] over the same feasible set. For every
  c, Main(c) + N(c) >= V(c), so G^R >= G^E >= psi_k(X)/X^k. LP-R contains no prime: its data are floors, logs and
  three constants zeta'(-j). At k = 0, theta = 1 it is the source's LP nu_1 with A, B priced instead of fixed.

Both are valid upper bounds for psi_k(X)/X^k at the X where they are solved. Neither is uniform in X by itself.

---

## 3. First decisive test (MEASURED)

Code `lrlib.py`, `run_grid.py` (LP-E), `run_robust.py` (LP-R), `analyse.py`; logs and tables in `out/`
(`out/analysis.log` is the full table). Rows: all n <= 3 sqrt X, both ends of every cell of the hyperbola tiling,
interior points for k = 2, then cutting planes until every n <= X satisfies the constraint to 1e-9 (relative to
max|c|). Planned memory is printed per run; the largest LP had 2.0e7 planned nonzeros (0.3 GB); peak RSS stayed
below 2 GB; all runs through `scripts/memcap.sh 8`. The compute server was not used.

### 3.0 Reproduction of the referee table (half weight, k = 0)

| X | D | LP - S(X), referee | LP - S(X), here |
|---|---|---|---|
| 1e4 | 100 | 2.08 | 1.92 |
| 1e5 | 316 | 3.3 | 2.88 |
| 1e4 | 631 (X^0.7) | pinned at X^0.75 | 8.5e-13 |
| 1e5 | 3162 (X^0.7) | < 5e-4 | 3.8e-12 |

The small differences at D = sqrt X come from the row n = 1 (excluded here because Lambda(1) = 0).

### 3.1 LP-E: gap/sqrt X = (G^E_k - psi_k(X)/X^k)/sqrt X

k = 0

| X | 0.3 | 0.4 | 0.5 | 0.6 | 0.7 | 0.8 | 0.9 |
|---|---|---|---|---|---|---|---|
| 1e3 | 4.24 | 3.40 | 1.19 | 0 | 0 | 0 | 0 |
| 1e4 | 13.1 | 5.59 | 2.27 | 0 | 0 | 0 | 0 |
| 1e5 | 28.4 | 12.7 | 3.27 | 0 | 0 | 0 | 0 |
| 3e5 | 37.5 | 16.7 | 5.67 | 0 | 0 | - | - |
| 1e6 | 57.7 | 23.4 | 6.41 | 0 | 0 | - | - |

k = 1

| X | 0.3 | 0.4 | 0.5 | 0.6 | 0.7 | 0.8 | 0.9 |
|---|---|---|---|---|---|---|---|
| 1e3 | 0.190 | 0.100 | 0.061 | 0 | 0 | 0 | 0 |
| 1e4 | 0.315 | 0.160 | 0.085 | 0 | 0 | 0 | 0 |
| 1e5 | 0.639 | 0.314 | 0.137 | 0 | 0 | 0 | 0 |
| 3e5 | 0.851 | 0.446 | 0.194 | 0 | 0 | - | - |
| 1e6 | 1.408 | 0.560 | 0.285 | - | 0 | - | - |

k = 2

| X | 0.3 | 0.4 | 0.5 | 0.6 | 0.7 | 0.8 | 0.9 |
|---|---|---|---|---|---|---|---|
| 1e3 | 0.0163 | 0.0062 | 0.0036 | 0 | 0 | 0 | 0 |
| 1e4 | 0.0205 | 0.0118 | 0.0054 | 0 | 0 | 0 | 0 |
| 1e5 | 0.0390 | 0.0201 | 0.0105 | - | - | - | - |
| 3e5 | 0.0501 | 0.0259 | 0.0120 | - | - | - | - |

"0" means |gap| < 3e-7 absolute (1e-10 relative to the value). "-" = no value: theta >= 0.8 above 1e5 was not run
(time); for k = 2, theta = 0.6 and 0.7 at X = 1e5 HiGHS returned a numerical failure (status 4), and larger X was
stopped. For k = 2, X = 1e5 there is an upper bound from the LP-R optimum instead: its exact value V(c) exceeds
psi_2/X^2 by 3.0e-3 at theta = 0.7 and 1.3e-4 at theta = 0.9 (1e-5 sqrt X and 4e-7 sqrt X; constraint tolerance
1e-7), so G^E_2 - truth is at most that. Pinning for k = 2 is therefore established to solver precision only at
X = 1e3 and 1e4.

Fits gap ~ X^alpha on X >= 1e4 (3 or 4 points each, so the second digit is not meaningful):

| k | theta = 0.3 | 0.4 | 0.5 |
|---|---|---|---|
| 0 | 0.82 | 0.81 | 0.74 |
| 1 | 0.82 | 0.78 | 0.76 |
| 2 | 0.77 | 0.73 | 0.75 |
| Theorem U bound with Theta = 1/2: 1 - theta/2 | 0.85 | 0.80 | 0.75 |

### 3.2 Pin threshold (MEASURED; mechanism ARGUED)

`pin.py`: smallest D with gap < 1e-7 sqrt X, by bisection.

| k | X | D* | D*/sqrt X | sqrt X + #{prime powers <= sqrt X} |
|---|---|---|---|---|
| 0 | 1e3, 3e3, 1e4, 3e4, 1e5 | 63, 101, 173, 327, 589 | 1.99, 1.84, 1.73, 1.89, 1.86 | 48, 78, 135, 227, 398 |
| 1 | 1e3, 3e3, 1e4, 3e4, 1e5 | 59, 84, 157, 248, 451 | 1.87, 1.53, 1.57, 1.43, 1.43 | same |
| 2 | 1e3, 3e3, 1e4 | 59, 96, 215 | 1.87, 1.75, 2.15 | 48, 78, 135 |

Mechanism (ARGUED). Equality V(c) = psi_k(X)/X^k needs phi_c = r at every prime power. On a cell
n in (X/(v+1), X/v], v <= sqrt X, phi_c - r is a polynomial of degree <= k in n; it is >= 0 and vanishes at the
prime powers of the cell, so on cells with enough prime powers it vanishes identically. Taking differences in v
this forces (1 * c)(m) = [m = 1] for m <= sqrt X, i.e. c_d = mu(d) for d <= sqrt X (the forced Moebius head of the
source, for every k). The remaining conditions are one equation or inequality for each n <= sqrt X in the unknowns
c_d, sqrt X < d <= D, in triangular order (the equation at n involves d <= X/n). Counting gives solvability for
D >= 2 sqrt X when equality is imposed at every n, and from about sqrt X + #{prime powers <= sqrt X} when it is
imposed only where needed. The measured D* lies between these two counts for k = 0, 1 and near the upper one for
k = 2. This is Dirichlet's hyperbola method: with levels X/d, d <= 2 sqrt X, the system already contains T_k at
every level the full system contains, in the positions that matter.

Consequence. For theta > 1/2 (large X) the exact LP value is psi_k(X)/X^k. This corrects the picture in the
assignment: the pinned value at D = X^0.7 found by the e1 referee is not special to k = 0 or to theta = 0.7; it
holds from 2 sqrt X on, for every Riesz order tested.

### 3.3 LP-R: robust value

robust gap = (G^R_k - psi_k(X)/X^k)/sqrt X; excess = (G^R_k - X/(k+1)!)/sqrt X; pen = N(c)/sqrt X at the optimum.
The true excess contains the constant -log(2 pi)/k!, which is why it is negative at small X.

k = 1, theta = 0.7

| X | D | excess | robust gap | pen | true excess |
|---|---|---|---|---|---|
| 1e3 | 126 | -0.0394 | 0.0284 | 0.0304 | -0.0677 |
| 5e3 | 388 | -0.0072 | 0.0207 | 0.0281 | -0.0279 |
| 2e4 | 1025 | +0.0062 | 0.0231 | 0.0391 | -0.0169 |
| 1e5 | 3162 | +0.0215 | 0.0204 | 0.0366 | +0.0010 |
| 2e5 | 5137 | +0.0155 | 0.0242 | 0.0441 | -0.0087 |
| 5e5 | 9756 | +0.0140 | 0.0252 | 0.0506 | -0.0113 |

k = 2, theta = 0.7

| X | D | excess | robust gap | pen | true excess |
|---|---|---|---|---|---|
| 1e3 | 126 | -0.0279 | 0.0013 | 0.0008 | -0.0291 |
| 1e4 | 631 | -0.0085 | 0.0016 | 0.0015 | -0.0101 |
| 1e5 | 3162 | -0.0019 | 0.0014 | 0.0016 | -0.0033 |
| 2e5 | 5137 | -0.0010 | 0.0012 | 0.0014 | -0.0022 |
| 5e5 | 9756 | -0.0005 | 0.0011 | 0.0014 | -0.0016 |

Fitted exponent of the robust gap (robust gap ~ X^s; 5 to 9 points):

| k | theta | range of X | robust gap/sqrt X, first to last | s |
|---|---|---|---|---|
| 0 | 0.5 | 1e3 .. 1e6 | 2.46 -> 10.1 | 0.71 |
| 0 | 0.7 | 1e3 .. 1e6 | 1.76 -> 2.26 | 0.54 |
| 1 | 0.6 | 2e3 .. 1e6 | 0.034 -> 0.057 (max 0.079 at 5e5) | 0.61 |
| 1 | 0.7 | 1e3 .. 5e5 | 0.028 -> 0.025 | 0.52 |
| 1 | 0.8 | 2e3 .. 5e5 | 0.013 -> 0.016 | 0.52 |
| 2 | 0.7 | 1e3 .. 5e5 | 0.0013 -> 0.0011 | 0.53 |

Reading. For k = 1, 2 and theta >= 0.7 the robust gap stays between 0.010 and 0.028 sqrt X (k = 1) and between
0.0006 and 0.0016 sqrt X (k = 2) over almost three decades. These numbers are of the size of the leading zero term
of psi_k (2/|rho_1(rho_1+1)| = 0.0100, 2/|rho_1(rho_1+1)(rho_1+2)| = 0.0007). The data cannot distinguish
C sqrt X from sqrt X times a power of log X or a small power of X; the same statement was made for nu_1 in the
source (drift 1.036 -> 1.088 between 1e6 and 1e7). The penalty N(c) at the optimum grows like 0.012 sqrt X per
decade for k = 1, theta = 0.7.

The Riesz order does what the assignment expected of it at the level of constants: the forced Moebius head
d <= sqrt X costs sum_{d<=sqrt X} (d/X)^k log X = O(X^((1-k)/2) log X) in N(c), which is O(log X) for k = 1,
against 0.6 sqrt X for k = 0 (source Theorem E). It does not change the exponent question.

### 3.4 Decision

alpha_k(theta) < 1/2 does not occur and cannot occur (section 4.1). Inside the unconditional range the two LPs
bracket the same quantity:

* LP-E equals psi_k(X)/X^k for theta > 1/2; its certified excess is the true excess, Omega_pm(sqrt X), and
  O(sqrt X) if and only if RH (k >= 1).
* LP-R exceeds it by the sawtooth sum S(c) = sum_d c_d (d/X)^k s_k(X/d) bounded termwise. Bounding G^R by
  X/(k+1)! + C sqrt X for all X is a statement about sequences c on d <= X^theta with (1 * c) - e_1 of nonnegative
  k-th Riesz mean at the points X/n, |B - 1| + |A| log X <= C X^(-1/2) and N(c) <= C sqrt X. That statement is
  open, implies RH, and by Theorem U is implied by RH only up to the exponent loss (1 - Theta)^2/(k + 2 - Theta).

The combination therefore stops where the source stopped ((DR), Claim 5C), in a version where the loss of the
method can be made arbitrarily small by raising k.

---

## 4. The floor, the dual point, and the sandwich

### 4.1 Floor (CLASSICAL)

For every k >= 0, theta and X: G^R_k >= G^E_k >= psi_k(X)/X^k (2.1). If psi_k(x)/x^k - x/(k+1)! <= C x^alpha for
all large x with alpha < 1, then the Mellin transform -zeta'/zeta(s)/(s(s+1)...(s+k)) - 1/((s-1)(k+1)!) + ... is
holomorphic in Re s > alpha by Landau's lemma (zeta has no zero on the real segment (0, 1)), so alpha >= Theta.
Hence limsup log(G - X/(k+1)!)/log X >= Theta >= 1/2 for both LPs. The dual point that realises the floor is the
true Lambda: it is feasible for every theta (it satisfies every Legendre identity) and has objective psi_k(X)/X^k.
In the pinned regime it is an optimal dual point. The dual vertex returned by HiGHS is a redistribution of Lambda
inside the cells with the same cell moments (about 74% of its mass sits on non-prime-powers at X = 1e5, k = 1),
which shows the LP has no information on which n are prime powers beyond the cell moments.

### 4.2 Theorem U (upper bound; PROVED, author only)

Let M*(y) = max_{t<=y} |sum_{d<=t} mu(d)| and suppose M*(y) <= K y^kappa (CLASSICAL: every kappa > Theta is
admissible; unconditionally K y exp(-c sqrt(log y))). Let 2 <= D <= X and

    eta = 2^(k+2) (k+1) K D^(kappa-1) / (1-kappa),      c = mu 1_{d<=D} + eta e_1.

Then c is feasible, and

    0 <= V(c) - psi_k(X)/X^k <= C_k K X D^(kappa-1) (log X + 1)/(1-kappa),
    Main(c) + N(c) - psi_k(X)/X^k <= the same + 2 (b_k log X + 0.1)(eta + D^(k+1)/X^k).

Proof. phi_{mu 1_{<=D}}(n) = r(n) - R(n), R(n) = sum_{D<d<=X/n} mu(d) f(nd/X)
= sum_{b>=1} sum_{D<d<=X/(nb)} mu(d) (1 - bnd/X)^k/k!. For fixed b the weight is nonnegative and decreasing in d,
at most 1/k!, so by Abel's inequality the inner sum is at most (2/k!) M*(X/(nb)) in absolute value. Summing over
b <= X/(nD): |R(n)| <= (2K/k!) (X/n)^kappa sum_{b<=X/(nD)} b^(-kappa) <= (2K/(k!(1-kappa))) (X/n) D^(kappa-1), and
R(n) = 0 for n > X/D. For n <= X/D <= X/2: f(n/X) >= integral_1^{X/n} (1 - tn/X)^k dt/k!
= (X/n)(1 - n/X)^(k+1)/(k+1)! >= (X/n) 2^(-k-1)/(k+1)!, and f >= 0 always. So eta f(n/X) >= |R(n)| and
phi_c >= r. Then V(c) - psi_k/X^k = eta tau(1) - sum_n Lambda(n) R(n), with tau(1) <= X log X/(k+1)! and
sum_{n<=X/D} Lambda(n)/n <= log X + O(1). The robust bound follows from Main + N <= V + 2N. QED.

Numerical check (`construct.py`, the minimal eta instead of the proved one): the certificate is feasible and
(V(c) - truth) / (X log X / sqrt D) lies in [0.0002, 0.38] over k = 0, 1, 2, X = 1e4, 1e5, 1e6,
theta = 0.3, 0.5, 0.7, 0.9. It is far from optimal in the pinned regime (e.g. k = 1, X = 1e6, theta = 0.7:
7.4 sqrt X against 0 for LP-E and about 0.02 sqrt X for LP-R).

### 4.3 Corollary (sandwich; PROVED from 4.1, 4.2)

Let nu^E_k(theta), nu^R_k(theta) be the limsup exponents of G - X/(k+1)! with D = X^theta. Then

    Theta <= nu^E_k(theta) <= max(Theta, 1 - theta(1 - Theta)),
    Theta <= nu^R_k(theta) <= max(Theta, 1 - theta(1 - Theta), theta(k+1) - k),
    Theta <= min_theta nu^R_k <= (1 + k Theta)/(k + 2 - Theta) = Theta + (1 - Theta)^2/(k + 2 - Theta)
           (at theta = (k+1)/(k+2-Theta)).

k = 0 gives 1/(2 - Theta), the bound of the source's Theorem S. With Theta = 1/2 the upper bounds are 2/3, 3/5,
4/7, ..., (k+2)/(2k+3). So lim_k min_theta nu^R_k = Theta, and

    RH  <=>  for every eps > 0 there are k and theta with G^R_k(X, theta) <= X/(k+1)! + O(X^(1/2+eps)).

The right side is a statement about a prime-free linear programme. This is a reformulation. It gives no
zero-free region: the upper bound is proved from M(y) << y^(Theta+eps), i.e. from the zero-free half-plane it
would be used to prove.

At the edge of the unconditional range, theta = (2k+1)/(2k+2), Theorem U gives 1 - theta/2 = (2k+3)/(4k+4) under
RH (3/4, 5/8, 7/12), above 1/2 for every k. The measured LP-R optimum is much smaller than the Theorem U
certificate, so the true exponent may be 1/2 for each fixed k >= 1; this is OPEN, and it is the same question as
(DR) of the source at k = 0.

### 4.4 Where the missing statement sits

Feasibility for n <= X/D is the inequality  (slack supplied by the correction) >= R(n), where
R(n) = sum_{D<d<=X/n} mu(d) f(nd/X) is a Moebius sum over the Type-II range against a spline. Theorem U buys it
with the absolute bound |R(n)| <= C (X/n) D^(Theta-1+eps), paid for by the coefficient A = eta at cost
eta X log X. To reach sqrt X one needs the one-sided statement

    there is a correction c' on d <= D with cost Main(c') + N(c') <= C sqrt X and phi_{c'}(n) >= R(n) for n <= X/D.

This is a one-sided bound for a Moebius-weighted sawtooth sum at all scales X/n simultaneously: Step 7 of the
source, and the "largest value on a line where the prime series does not converge absolutely" of the obstruction
map (filter (c)). Positivity of Lambda has been spent in 2.1; the sign information needed here is about mu.

### 4.5 The three requirements

| requirement | status |
|---|---|
| uses all primes together | only through 1 * Lambda = log and Lambda >= 0; LP-R contains no prime |
| uniform in height, every window | each LP is solved at one X; the uniform statement is the open one-sided bound of 4.4 |
| fails for the controls for a structural reason | DH and Liouville fail at Lambda_w >= 0; E_a and Beurling pass every proved step and return their own Theta (section 5) |

---

## 5. Controls

`controls.py`, `out/controls.log`. The LP is run with the integers replaced by a weight sequence w and
Lambda_w = w^(-1) * (w log); k = 1, theta = 0.7.

| control | step that fails | evidence |
|---|---|---|
| E_a (w = coefficients of zeta(s+a) zeta(s-a), Lambda_w = Lambda (n^a + n^-a) >= 0) | none. 2.1 holds; LP-E is pinned to the truth; the truth has zeros on Re s = 1/2 + a, so the LP returns 1/2 + a. The assignment's lemma fails at the sawtooth: sum_{m<=y} w(m) has a divisor-problem error, not O(log y) | MEASURED: LP - truth = 4e-11, -1e-9, 6e-9 (a = 0.1) and 5e-12, -7e-9, -7e-7 (a = 0.2) at X = 1e3, 1e4, 1e5; Lambda_w >= -5e-12. Excess over the two main terms divided by X^(1/2+a): -0.071, -0.013, +0.004 (a = 0.1); -0.040, -0.005, +0.006 (a = 0.2). Theorem U holds with Theta_E = 1/2 + a |
| Beurling integers (no sawtooth, N(y) = y + O(y^beta)) | none in 2.1 or Theorem U (both use only w * Lambda_w = w log, Lambda_w >= 0 and the size of M_w). The LP returns Theta of the system fed in. Beurling systems with well-behaved N and zeros off the line exist (Diamond-Montgomery-Vorhauer, N(y) = kappa y + O(y^(1/2+eps)); cited from memory, not re-verified), so a small sawtooth is not what excludes zeros | ARGUED; not computed |
| Liouville-twisted Lambda (w = lambda, Lambda_w = lambda Lambda) | Lambda_w >= 0 in 2.1. The certificate inequality has no sign, and the LP itself is unbounded below (the kernel f_w is not positive) | MEASURED: 176 and 1245 negative values (X = 1e3, 1e4), negative mass 965 and 9919; HiGHS status "unbounded" |
| Davenport-Heilbronn (w = period-5 coefficients) | Lambda_w >= 0 in 2.1; Lambda_w is not supported on prime powers | MEASURED: 249 and 2049 negative values, min -18.5 and -71.6; LP unbounded |
| sign twists eps_n Lambda, unimodular twist | 1 * (eps Lambda) is not log: no identity (as in the e1 lanes) | ARGUED |
| backward heat, T-NR, phase-rotated transfer operator, theta^w | no coefficient sequence with an integer sawtooth is attached; not tested | not tested |

Controls verdict. The step that separates zeta from DH and the sign twists is Lambda >= 0. Nothing separates zeta
from E_a or from a Beurling system: for those the LP gives the correct, larger exponent through the size of their
own Moebius function. The exponent the LP returns is always Theta of the system fed in. The combination has no
step that fails for E_a for a structural reason, so it does not meet the third requirement.

---

## 6. Verdict

**Precise obstruction; partial result (Theorem U and its corollary).**

1. PROVED (author): certificate inequality 2.1 for every Riesz order; sawtooth decomposition 2.2; Theorem U and the
   sandwich Theta <= min_theta nu^R_k <= Theta + (1 - Theta)^2/(k + 2 - Theta).
2. CLASSICAL: floor alpha_k(theta) >= Theta >= 1/2 for both LPs.
3. MEASURED: LP-E is pinned to psi_k(X)/X^k from D* in [1.4, 2.2] sqrt X for k = 0, 1, 2 (k = 2 to solver
   precision only for X <= 1e4); below sqrt X the gap
   grows like X^0.73..0.82; LP-R for k = 1, 2, theta >= 0.7 has robust gap 0.010 to 0.028 sqrt X and
   0.0006 to 0.0016 sqrt X on 1e3..5e5 with fitted exponent 0.52 to 0.53.
4. OPEN: the exponent of LP-R at fixed k (whether it is 1/2); the one-sided Moebius-spline bound of 4.4; a proved
   floor above Theta for LP-E at theta < 1/2.

Why the combination stops: the level restriction and the Riesz order remove the two losses that were specific to
the method (the forced head and the sawtooth triangle inequality), and what is left is the exponent of the
Moebius function, i.e. Theta itself. No pivot was taken: the adjacent combinations seen (half-weight version,
gauge conditions A = 0, B = 1 imposed exactly, higher k) are the same LP with different constants.

## 7. Three weakest steps

1. **Theorem U is author-proved and unrefereed.** The Abel step uses that (1 - bnd/X)^k is monotone in d on the
   whole range D < d <= X/(nb), and the constant in eta was not optimised or checked against the proved value (the
   numerical check uses the minimal eta). The Landau step in 4.1 for Riesz means is quoted, not written out.
2. **All LP statements are float64 HiGHS vertices.** "Pinned" means |gap| < 3e-7 absolute; the pin thresholds use
   the tolerance 1e-7 sqrt X and one of the k = 2 bisections (X = 3e4) failed its bracket check and is not
   reported. For k = 2 the pinned LPs are badly scaled (max|c| up to 1e6) and HiGHS failed at X = 1e5. LP optima are not unique: N(c), A, B, C(0) and the dual vertex are properties of the vertex returned.
   Exponents are fitted on at most three decades with 3 to 9 points and cannot separate sqrt X from
   sqrt X polylog; the statement "robust gap = O(sqrt X)" is not supported beyond X = 1e6 and is not claimed.
3. **The pin mechanism (3.2) and the Beurling row are argued, not proved or computed.** The count gives
   solvability generically; non-degeneracy of the triangular system and the sign of the inequalities at
   non-prime-power n were not proved. No floor above Theta was proved for theta < 1/2; the measured exponents
   0.73 to 0.82 there are close to, and in two cells slightly above, the Theorem U bound with Theta = 1/2, which
   is within the fitting error but was not resolved.

## 8. Files

All in `tmp/research-2026-11-16/push/e2-legendre-riesz-level-phase/`.

* `lrlib.py`: sieve, kernel entries, LP with cutting planes (exact and robust objective, general weight system).
* `run_grid.py` (LP-E), `run_robust.py` (LP-R), `pin.py` (threshold), `construct.py` (Theorem U certificate),
  `saw.py` (sawtooth constants), `controls.py`, `analyse.py`.
* `out/*.log`, `out/*.json`: all runs; `out/analysis.log` is the aggregated table.
* `venv/`: local numpy/scipy/mpmath environment (git-ignored).
* Runs stopped for time and not reported: LP-E k = 2 at X >= 3e5 for theta >= 0.6; LP-R k = 1, 2 at X = 1e6,
  theta = 0.7 (each had used 33 CPU-minutes). The compute server was not used.
