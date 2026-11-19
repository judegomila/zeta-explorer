# c13-noncone-kernel-separator-search: PREREG

Written 2026-11-19 before any run of this lane (no kernel, no functional and no table of this lane existed when this
file was written). Kind: compute (heavy). Nothing here is a statement about zeros of zeta.

## 1. Registered question

In the dictionary D of section 4, is there a functional (a discrete label and at most three real parameters) that
(a) takes one strict sign on every training positive (section 2), (b) takes the opposite strict sign on at least one
training member of each of the nine control classes (section 3), and (c) on held-out members keeps the pattern on at
least 95%: at least 95% of the 24 held-out positives have the sign of (a), and in each control class at least 95% of
its 24 held-out members (23 of 24) have the opposite sign?

- Outcome "survivor": at least one functional meets (a), (b), (c) in float64 and after the ball recheck of section 7.
- Outcome "none": no functional meets (a), (b), (c). D is then recorded as a closed device class with the table of
  section 6. "None" is a statement about the registered grid and the registered random draws of the parameters
  (MEASURED), not about all real parameter values.
- A run of a different kernel, a different normalisation or a different object set does not answer the question
  (NOT-RUN).

Secondary tiers, reported in every table and registered here so that they are not chosen afterwards:
- T-train: (a) and (b) only. T-weak: (a), (b), and on held-out data at least one opposite sign per class and no
  held-out positive of the wrong sign.
- Positive sets P0 = {zeta}; P1 = zeta and the real primitive characters; P2 = all training positives (the registered
  one). P0 and P1 are reported because a "none" under P2 could be caused by the complex characters alone.
- Strict and favourable sign reading (section 5).

## 2. Kernels and positives

Convention. For a completed function Lambda(1/2 + z) = int (K(u) - polar terms) e^(zu) du (regularised), K is the
kernel on the line u = log(scale); the Dirichlet factor n^(-s) acts as the shift K(u) -> n^(-1/2) K(u + log n), so a
Hecke dilation is a shift by log n. Two kernels per object:

- Kpol ("theta-normalised kernel with polar terms"), used by D1 and D2.
- K3 ("kernel without polar terms") = P(D) Kpol, D = d/du, P the even polynomial that annihilates the polar
  exponentials; used by D3. For objects with no polar term, K3 = Kpol.

| object | Kpol(u) | P(D) |
|---|---|---|
| ZETA | e^(u/2) theta(e^(2u)), theta(y) = sum over n in Z of exp(-pi n^2 y); even | D^2 - 1/4 (K3 is the Riemann-Polya kernel up to a constant) |
| primitive chi mod q, parity d in {0, 1} | conj(omega) e^((1/2+d)u) sum_{n>=1} 2 chi(n) n^d exp(-pi n^2 e^(2u)/q), omega^2 = eps(chi) (the constant in K(-u) = eps conj K(u), measured from the series at u = 0.2 and checked at u = 0.35), Re omega > 0 | 1 |
| DH class | Re or Im of the chi-kernel above for a complex primitive chi (Re: root number +1; Im: root number -1), sign fixed so that the n = 1 coefficient is positive. Battery DH = (q = 5, the odd pair, Re); checked against the coefficients (1, kappa, -kappa, -1, 0) | 1 |
| T-NR (p0, c) | K_zeta(u + log p0) + c K_zeta(u) + K_zeta(u - log p0), 2 < c < p0^(1/2) + p0^(-1/2) | D^2 - 1/4 |
| E_a, 0 < a < 1/2 | E*(i e^u, 1/2 + a) = xi*(1+2a) y^(1/2+a) + xi*(2a) y^(1/2-a) + 4 sqrt(y) sum n^a sigma_(-2a)(n) K_a(2 pi n y), y = e^u, xi*(s) = pi^(-s/2) Gamma(s/2) zeta(s); even | (D^2 - (1/2+a)^2)(D^2 - (1/2-a)^2) |
| EIS-w | the same with complex a = alpha + i beta (w' = 1/2 + a off the line) | the same |
| HEAT tau < 0 | K3 = e^(tau u^2/4) K3_zeta(u) (the battery's e^(tau u'^2/16) kappa(u') at u' = 2u). Kpol = the even solution of (D^2 - 1/4) Kpol = K3 with Kpol - c e^(u/2) rapidly decreasing at +infinity: Kpol(u) = c e^(u/2) + e^(-u/2) int_u^inf K3 e^(v/2) dv - e^(u/2) int_u^inf K3 e^(-v/2) dv for u >= 0, c = int K3(v) e^(v/2) dv. Check: tau = 0 returns K_zeta | D^2 - 1/4 |
| SGN, U, DEL, THIN (no functional equation) | e^(u/2)(1 + 2 sum_{n>=1} a(n) exp(-pi n^2 e^(2u))): the n = 0 lattice term is kept untwisted (a convention: no continuation fixes it; K3 does not depend on it) | D^2 - 1/4 |
| theta^w, w > 0 | K_zeta(u)^w | D^2 - w^2/4 |

EA-1/2 of the battery is NOT-RUN: at a = 1/2 the polar part has a logarithmic term and the normalisation above is
singular. WT, BEU of the battery are not classes of the registered question and are not run.

Complex kernels (complex chi, U, EIS-w): the functional is evaluated on the complex kernel and the real part is the
value. This is a convention; functionals that would need a Hermitian form are outside D.

Training positives (24): ZETA; the 9 real primitive characters of conductor 3, 4, 5, 7, 8 (two), 11, 12, 13; one
character from each of the 14 conjugate pairs of complex primitive characters of conductor <= 13 (the member with the
smaller Conrey number). Held-out positives (24): drawn without replacement, numpy PCG64 seed 130000, from the list
(sorted by conductor, then Conrey number) of primitive characters of conductor 14 to 40, one per conjugate pair.

## 3. Control classes: training members and held-out members (24 each)

rng_k = numpy.random.Generator(PCG64(130000 + k)).

| k | class | training members | held-out rule |
|---|---|---|---|
| 1 | DH | battery DH (q = 5, Re) | 24 drawn without replacement by rng_1 from the sorted list of (q, pair, part), part in {Re, Im}, complex primitive pairs of conductor 7 to 40, plus (5, Im) |
| 2 | T-NR | (3, 2.2) | p0 = rng_2 choice of {2, 3, 5, 7, 11, 13}; c = 2 + t (p0^(1/2) + p0^(-1/2) - 2), t uniform (0.05, 0.95) |
| 3 | E_a | a = 1/8, 1/4 | a uniform (0.03, 0.47) by rng_3 |
| 4 | HEAT | tau = -0.1, -0.5 | tau = -10^x, x uniform (-1.7, 0.3) by rng_4 |
| 5 | SGN | battery SGN-00 .. SGN-05 (seeds 121000 + j) and SGN-LIOU | eps(p) = 1 - 2 bit, bits = PCG64(122000 + j).integers(0, 2, pi), j = 0..23, primes in increasing order |
| 6 | U | battery U-00 .. U-05 (seeds 120000 + j) | chi(p) = e(u_p), u = PCG64(123000 + j).random(pi), j = 0..23 |
| 7 | DEL/THIN | DEL-0.75, DEL-0.9, THIN-0.9 (greedy floor sets, battery rule) | j even: DEL, j odd: THIN; b = round(uniform(0.55, 0.98), 4) by rng_7; same greedy rule |
| 8 | EIS-w | a = 0.2 + 3i, 0.1 + 5i | alpha uniform (0.03, 0.47), beta uniform (0.5, 6) by rng_8 |
| 9 | theta^w | w = 1/2, 3 | w uniform (0.25, 6) by rng_9, redrawn while abs(w - k) < 0.05 for k in {1, 2, 4} (Euler-product cases) |

The battery arrays for SGN and U are regenerated from the seeds (prefix of the same stream); SGN is checked against
`local_SGN.npy` and the sets against `set_*.npy` of c12.

## 4. Dictionary D

Evaluation window: every point at which a functional reads its kernel lies in [-2.6, 2.6] (float64 underflow of the
theta tail beyond). Shifts made inside a kernel (T-NR, Hecke compensation) are exempt.

Kernel labels for D2 and D3b: k = K, or k = (1 - p^(-1/2) D_p)K with (D_p K)(u) = K(u + log p), p in {2, 3, 5, 7, 11, 13}
(7 labels).

- **D1 (minors, Kpol).** Order m in {2, 3, 4}; column set N = {n_1 < ... < n_m} a subset of {1, ..., 13} (1079 labels);
  nodes u_i = u_0 + i h + i^2 g, i = 0..m-1, strictly increasing; value det[Kpol(u_i + log n_j)].
  Grid: u_0 in {-2.6, -2.5, ..., 2.6}; h in {0.05, 0.10, ..., 1.00} and {log 2, log 3, log(3/2)}; g in
  {-0.1, -0.05, 0, 0.05, 0.1} (g = 0 only for m = 2).
- **D2 (Turan type, Kpol), 7 kernel labels each.**
  - F1(u, h, lam) = k(u-h) k(u+h) - lam k(u)^2. u in {-2.5, -2.45, ..., 2.5}; h in {0.02, 0.05, 0.1, 0.2, 0.3, 0.5,
    0.75, 1.0, 1.5}; lam in {0.5, 0.75, 0.9, 1, 1.1, 1.25, 1.5, 2, 4}.
  - F2(u, lam, mu) = k_mu'(u)^2 - lam k_mu(u) k_mu''(u), k_mu = e^(mu u) k. u as F1; lam as F1; mu in
    {-2, -1, -0.5, 0, 0.5, 1, 2}. (lam = 1 is the Turan expression K'^2 - K K''.)
  - F3(u, h) = det[k(u + (i + j - 2)h)], i, j = 0..2. u as F1; h in {0.02, 0.05, 0.1, 0.2, 0.3, 0.5, 0.75, 1.0}.
  - F4(u) = det[k^(i+j)(u)], i, j = 0..2 (derivatives; the limit of F3).
  - F5(u, mu) = 4(k'^2 - k k'')(k''^2 - k' k''') - (k' k'' - k k''')^2 for k_mu (the order-3 Turan expression of the
    Jensen cubic). u, mu as F2.
- **D3.** D3a = D1 with K3 in place of Kpol; D3b = D2 with K3 in place of Kpol.
- **Random draws (same families, continuous parameters).** For each of D1, D3a: 400,000 draws (m, N uniform over the
  labels; u_0, h, g uniform over the boxes [-2.6, 2.6], [0.02, 1.2], [-0.12, 0.12]; rejected if outside the window).
  For each of F1, F2, F3, F5 in D2 and D3b: 100,000 draws (kernel label uniform; u uniform [-2.5, 2.5]; h uniform
  [0.01, 1.5]; lam uniform [0.25, 4]; mu uniform [-2, 2]). numpy PCG64 seed 131000 + family index.
- **Adaptive stage (allowed once, after the grid).** Around the 200 functionals per family that reject the largest
  number of classes: 500 Gaussian perturbations each of the real parameters (sd 0.05 in u, 0.3 h in h, 0.02 in g,
  0.1 lam in lam, 0.2 in mu), seed 132000 + family index. Their survivors count as survivors.

## 5. Sign reading

Float64. Before a determinant the matrix is equilibrated (rows, then columns, divided by the largest modulus); a
Turan-type value is computed on values divided by the largest modulus read. A value v with reference scale S (sum of
the moduli of its monomials; for a determinant the permanent of the moduli) is decided when abs(Re v) > 1e-9 S;
otherwise it is undecided (0).
- Strict reading: (a) needs all 24 positives decided and equal. A control member rejects when it is decided and
  opposite.
- Favourable reading: (a) needs the decided positives equal and at least 12 decided. Any functional that meets the
  pattern only in the favourable reading goes to the ball recheck as well.

## 6. Registered decomposition and predictions

Per family (D1; D2-F1..F5; D3a; D3b-F1..F5) and per positive set (P0, P1, P2): number of functionals in the window;
number one-signed on the positives; for each class the pass fraction = share of the one-signed functionals on which no
training member of the class has the opposite sign; the same with the held-out members (share with fewer than 95%
opposite); the distribution of the number of classes rejected (0..9); the number at T-train, T-weak and full
criterion.

Predictions (registered before any run):
1. No survivor.
2. T-NR and E_a pass D1: for every D1 functional that is one-signed on P2, no T-NR member and no E_a member has the
   opposite sign (pass fraction 1). Reason on file: T-NR's kernel is a positive combination of three dilations of
   zeta's kernel; the local sequences of T-NR with negative real roots and of E_a are totally positive.
3. Not predicted (open before the run): the pass fractions of the other classes; whether prediction 2 extends to P0.

## 7. Controls of the search itself

- **Planted separator, kernel level.** Synthetic object set of the same shape: positives exp(-alpha u^2) (24 training,
  24 held-out, alpha log-uniform in (0.3, 3)); nine control classes of kernels exp(-alpha u^2)(1 + c u^2) with
  c in (2.5 alpha, 6 alpha) (not log-concave at 0). The whole pipeline is run on it. Required: F2 at u = 0, lam = 1 is
  reported as a survivor.
- **Planted separator, value level.** In the real run, 5 functionals per family (seed 133000) have their sign rows
  overwritten by the ideal pattern in a copy; the selection must return exactly those.
- **Label shuffles.** 200 permutations (seed 134000 + r) of the object labels over all objects, keeping the sizes of
  every group; the full criterion, T-train and T-weak are evaluated on each. False-positive rate = share of
  permutations with at least one survivor. If the sign matrix is too large the shuffles run on a registered
  subsample: every 5th functional.
- **Kernel validation.** Each kernel type is compared with an independent mpmath evaluation (50 digits; different
  formula where one exists: lattice sum of theta(ty) theta(t/y) for E_a at one point, the battery's value interface
  through a numerical Mellin transform for ZETA, DH, T-NR, E_a at one point) at 40 random points of the window, values
  and derivatives to the order used; the largest relative error is reported.
- **Ball recheck.** Every float64 survivor (strict or favourable, grid, random or adaptive) is re-evaluated in
  python-flint ball arithmetic on every object (truncation tails enclosed for the Gaussian sums; quadrature kernels
  HEAT and complex-order Bessel are enclosed with acb.integral) before it is reported as a survivor. A survivor whose
  ball signs differ from float64 is reported as a float artefact.

## 8. Compute plan

Decisive first test locally (through `scripts/memcap.sh 8`): kernel validation, the planted kernel-level run, and D2
on its grid (small). Server (through `rhrun` only; `rhstatus` first; at most 16 cores and 32 GB; units recorded in
RESULT.md and stopped or finished before the lane ends): D1 and D3a grids and the random draws, shuffles. GPU not
planned (the determinants are of order at most 4; no large dense algebra). Planned memory is printed before each
allocation; the largest object is the sign matrix int8[functionals x objects] (estimate at most 7e6 x 300 = 2.1 GB
per family).

## 9. What would change the verdict wording

- A survivor is a lead for round 14 and needs a stage A on paper before any score flag; this run sets no flag.
- "None" closes D on the registered grid and draws only. The requirement flags R1 to R4 stay false in both outcomes.

## 10. Amendments (written 2026-11-19, after local trial runs of the registered grid, before the server run)

State when these were written: the registered grid had been run locally in float64 (all 12 families; no functional met
even T-train in the strict reading, for P0, P1 or P2), the kernel-level planted run had passed, and a first ball
cross-check of 1,151 random (functional, object) pairs had found one float64 sign that was wrong. Nothing in sections
1 to 4 and 6 is changed; the question, the objects, the seeds, the grid and the criterion stand. The amendments make
the sign reading stricter and add work; none removes a registered item.

- **A1 (sign reading, section 5).** The float64 artefact: for a Hecke-compensated kernel with polar terms the polar
  parts cancel (e^(u/2) - p^(-1/2) e^((u + log p)/2) = 0), the entry is rounding noise, and the relative test of
  section 5 called it decided (D2-F2, row 36576, object SGNH-16: float64 +, ball -). Rule added: every kernel entry
  carries an absolute rounding-noise estimate (1e-15 times the sum of the moduli of its monomials, times 1 + w for
  the exponent of each Gaussian term); with rho the largest ratio noise/modulus over the entries a functional reads
  and deg its degree, a value is decided only when abs(Re v) > max(1e-9, 10 deg rho) S. Points are no longer rounded
  to 1e-12 before evaluation. Effect: some entries become undecided; none becomes decided.
- **A2 (ball stage, extends section 7).** Section 7 rechecks survivors. Added: every functional that float64 cannot
  exclude is resolved in balls. Selection: optimistic reading with the weakest positive set P0 = {zeta} (no positive
  of sign -s; every class has a training member of sign -s or undecided), which contains the corresponding sets for
  P1 and P2. Procedure: zeta in balls (precisions 300, 3000, 12000 bits) gives s; then, class by class, the undecided
  training members are resolved until one has sign -s; a class with no member of sign -s kills the functional; a
  functional killed by no class is completed on all objects in balls and read by the registered criterion. A
  functional on which zeta's ball contains 0 at 12000 bits has no strict sign and is counted separately.
- **A3 (more random draws).** Because the registered runs take minutes, a second set of random draws ten times larger
  is added: 4,000,000 per minor family, 1,000,000 per Turan family (F4: 100,000, parameter u only), seeds
  137000 + family index, same boxes. Reported separately from the registered draws; label `-rnd2`.
- **A4 (ball confirmation).** Per family: the 10 best near-misses are evaluated on every object in balls; 60 random
  functionals one-signed on P2 are evaluated on the 50 training objects in balls; for D1, 30 functionals on which
  T-NR has the opposite sign are evaluated in balls on the positives and T-NR (test of prediction 2). A cross-check of
  3,000 random (functional, object) pairs per grid family compares float64 with balls.
- **A5 (adaptive stage centres).** When fewer than 200 functionals are one-signed on P2 in a family, the list of
  centres is filled from the P1 list and then the P0 list.
- **Compute.** The registered grid needs minutes; the server run (one unit, at most 16 cores and 32 GB, through
  `rhrun`) executes the whole pipeline (`run_all.sh`) once more from scratch with A1 to A5 so that every reported
  number comes from one run. GPU not used.
