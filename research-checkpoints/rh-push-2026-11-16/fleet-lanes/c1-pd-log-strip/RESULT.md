# c1-pd-log-strip: positive-definiteness of u -> log F(sigma+iu) left of Re s = 1

Verdict: **precise-obstruction (restatement; score 0).** The correctly compensated positive-definiteness
property CP(sigma) is equivalent, for each 1/2 < sigma < 1, to "zeta has no zeros with Re s > sigma". The
positivity of the prime atoms does no work in the direction CP => zero-free; the whole content is that the
Fourier transform of the compensated function is supported on the prime side (causality). The raw property is
false for every sigma < 1. No sigma-transport exists: the positive-definite kernel ends at the pole on the diagonal.
No statement about zeros of zeta is claimed.

Labels: PROVED (argument written here, unrefereed), CLASSICAL, MEASURED, OPEN.

## 1. Plan

Lead (OBSTRUCTION_MAP section 6 item 8, rows P29, Q10): for sigma > 1, phi_sigma(u) = log zeta(sigma+iu)
= sum_n c_n n^-sigma e^{-iu log n}, c_n = Lambda(n)/log n >= 0, is the Fourier transform of a positive measure,
hence positive-definite (Bochner). Tasks: (a) find the correct object for sigma <= 1; (b) its Fourier-side
meaning; (c) decide whether it is a restatement of a zero-free statement; (d) Gram-matrix test with controls;
(e) R4: is there a transport in sigma.

New relative to the map: P29 records the property on Re s > 1 only; item 8 lists the extension as untested.
This lane settles it: exact Fourier transform on every line 1/2 < sigma < 1 (Theorem 1), failure of the raw
property (Theorem 2), equivalence of the compensated property with ZF(sigma) (Theorem 3), no transport (Prop. 5).

## 2. Work

Notation. a = 1 - sigma. phi_sigma(u) = log zeta(sigma+iu), defined for every real u by continuation along the
horizontal segment from +infinity+iu (cuts: [sigma,1] on the real axis and [sigma+i gamma, rho] for each zero
rho = beta+i gamma with beta > sigma). Z(sigma) = set of zeros with beta > sigma; ZF(sigma): Z(sigma) empty.
D_b(x) = (e^{bx} - 1)/x, a smooth positive function on R for b > 0. Convention: phi(u) = int e^{-iux} d nu(x);
x > 0 is the prime side. A_sigma = sum_n c_n n^-sigma delta_{log n}.

### Theorem 1 (Fourier transform on a line in the strip). PROVED (contour shift; signs MEASURED to 1e-7)

For 1/2 < sigma < 1, as distributions tested against C_c^infinity(R) (and against Gaussians):

    nu_sigma := FT of phi_sigma = A_sigma - D_a(x) dx + sum_{rho in Z(sigma)} m_rho e^{i gamma x} D_{beta-sigma}(x) dx.

Proof sketch. For k in C_c^infinity put K(s) = int k(x) e^{(s-sigma)x} dx (entire, rapidly decreasing on vertical
lines, at most e^{(Re s - sigma) max supp k} to the right). Shift int_{Re s = sigma} log zeta(s) K(s) ds to the
right; horizontal edges vanish along heights T_n with zeta'/zeta << log^2 T_n (CLASSICAL). What remains: the far
right, which gives the atoms, and the two sides of each cut, where log zeta jumps by -2 pi i (pole) or
+2 pi i m_rho (zero). int_sigma^1 K(r) dr = int k(x) D_a(x) dx and int_sigma^beta K(r+i gamma) dr =
int k(x) e^{i gamma x} D_{beta-sigma}(x) dx. The zero sum converges absolutely for each test (terms O(gamma^-2)).
Equivalent Laplace form: log((w-b)/w) = -int_0^inf e^{-wx} D_b(x) dx for Re w > b and
= +int_{-inf}^0 e^{-wx} D_b(x) dx for Re w < 0: moving a pole or zero horizontally across the line moves its
density from one half-line to the other with the same formula D_b on both sides.
Numerical confirmation: section 3, test B (zeta: pole term; E_a at sigma = 0.6: fourteen zero terms).

Consequences. (i) For sigma > 1 the D terms are absent and nu_sigma = A_sigma >= 0. (ii) For sigma < 1 the
atoms A_sigma and the density D_a each grow like e^{ax}/x; only their difference is tempered. (iii) The density
part is negative on both half-lines and bounded by a near x = 0: no Levy-type singularity, so "conditionally
positive-definite of order k" does not help.

### Theorem 2 (the raw property fails). PROVED from CLASSICAL inputs, unconditional

For every sigma in (1/2, 1), u -> log|zeta(sigma+iu)| and u -> log zeta(sigma+iu) are not positive-definite and
not conditionally positive-definite of order 1.
Proof. A positive-definite function satisfies |phi(u)| <= phi(0); a conditionally positive-definite one of order
1 satisfies Re phi(u) <= phi(0). Here phi(0) = log|zeta(sigma)| is finite and log|zeta(sigma+iu)| is unbounded
above (CLASSICAL Omega-theorem, Titchmarsh Thm 8.12). Fourier-side reason, by Theorem 1: on (0, log 2) there are
no atoms and the density is -D_a < 0 up to zero terms.
MEASURED: test A, about half of the eigenvalues of every Gram matrix are negative for sigma < 1.

### The compensated object

CP(sigma): the distribution T_sigma := nu_sigma + D_a(x) dx is a positive measure on R.
Equivalently, for every g with ghat in C_c^infinity (or Gaussian):

    int int phi_sigma(u-v) g(u) conj g(v) du dv + int D_a(x) |ghat(x)|^2 dx >= 0.

This is the unique compensator that restores the sigma > 1 statement: by Theorem 1,
T_sigma = A_sigma + sum_{Z(sigma)} m_rho e^{i gamma x} D_{beta-sigma}(x) dx. Subtracting log(1/(s-1)) instead
(the other candidate in the assignment) gives A_sigma - e^{ax}/x dx on the prime side, which is not positive on
any line, including sigma > 1. The compensator is not a tempered distribution, so CP is a statement about
band-limited or Gaussian tests; it has no pointwise Gram-matrix form for sigma < 1.
Height: the kernel is stationary, so a "window at height T" is a node set whose differences reach T; a zero at
height gamma enters through differences u_j - u_k near gamma. CP for all node sets is height-uniform by form.

### Theorem 3 (CP(sigma) is ZF(sigma)). PROVED

For 1/2 < sigma < 1 the following are equivalent: (a) CP(sigma); (b) T_sigma restricted to x < 0 is >= 0;
(c) T_sigma restricted to x < 0 is zero (support of T_sigma in [0, inf)); (d) ZF(sigma).
Proof. (d) => (a): T_sigma = A_sigma >= 0. (a) => (b) trivial; (c) follows from (d). (b) => (d): on x < 0,
T_- = sum_{Z(sigma)} m_rho e^{i gamma x}(e^{bx}-1)/x dx with b = beta - sigma in (0, 1/2). Test with
kappa(x) = |x| e^{x} >= 0 through cutoffs chi_n increasing to 1 on (-inf, 0) (monotone convergence on the
measure side; on the zero side two integrations by parts give the uniform bound O(b gamma^-2) per term, the
cutoff near 0 being harmless because e^{x}(e^{bx}-1) = O(b|x|) there, so dominated convergence applies):

    int kappa dT_- = - sum_rho m_rho int_{-inf}^0 e^{(1+i gamma)x}(e^{bx}-1) dx = sum_rho m_rho b/((1+b+i gamma)(1+i gamma)),

and for a conjugate pair the real part is b(1+b - gamma^2)/(((1+b)^2+gamma^2)(1+gamma^2)) < 0 because
gamma^2 > 14^2 > 1.5 (CLASSICAL). So Z(sigma) nonempty gives int kappa dT_- < 0, contradicting (b).
Lemma S (PROVED, same computation): if Z(sigma) is nonempty, T_- is neither >= 0 nor <= 0: the test e^{x}
gives sum m_rho (1/2) log(((1+b)^2+gamma^2)/(1+gamma^2)) > 0. Closed forms checked numerically (thmB_check.py).

Reading. No prime enters (b) => (d): x < 0 carries no atoms. CP(sigma) = "FT of the compensated function is
supported on the prime side" + "atoms are >= 0"; the second part is automatic for zeta and the first is the
analyticity of log(zeta(s)(s-1)/(s-sigma)) in Re s > sigma. Answer to the assignment's question: equivalent to
a zero-free statement of equal strength (restatement), not strictly weaker.

### Proposition 4 (prime side alone, on the prime-free interval). PROVED up to one constant

If T_sigma >= 0 only on (0, log 2), then ZF(sigma). There T_sigma = H(x)/x dx,
H = sum_{Z(sigma)} m_rho e^{i gamma x}(e^{bx}-1). Test H with a smooth cutoff tau = 1 near 0, supported in
[0, log 2): Re int_0^L tau(x)(e^{bx}-1) cos(gamma x) dx = -b/gamma^2 + R, |R| <= (b^3 + b C_tau)/gamma^4, so each
term is negative once gamma^2 > 1/4 + C_tau. C_tau was not computed (OPEN detail); it is a fixed number and
zeros off the line have |gamma| > 3e12 (CLASSICAL, verified height). So even the half that contains the primes
is decided on the interval where there are no primes.

### Proposition 5 (R4: no transport in sigma). PROVED / CLASSICAL

(i) For sigma > 1 and fixed coefficients c, Q_sigma(c) = sum_n c_n n^-sigma |sum_j c_j e^{-i u_j log n}|^2 is
completely monotone in sigma; lambda_min(sigma) is non-increasing in sigma and lambda_max is log-convex.
(ii) The kernel K(s,w) = log zeta(s + conj w) is positive-definite and sesqui-analytic on Re s > 1/2. The
continuation theorem for positive-definite sesqui-analytic kernels (CLASSICAL) needs analyticity on the
diagonal; K(s,s) = log zeta(2 Re s) is singular at Re s = 1/2 (Pringsheim-Landau: a Laplace transform of a
positive measure is singular at the real point of its abscissa). This holds for every F whose logarithm has
non-negative coefficients; it is not specific to zeta.
(iii) Q_sigma(c) continues analytically through sigma = 1 only after adding |c|^2 log(sigma-1), i.e. for
log((s-1)zeta(s)), whose measure A - e^{ax}/x is not positive on either side of 1. The compensator that keeps
positivity (D_a) changes with sigma and is not the continuation of anything on sigma > 1.
(iv) A three-lines argument would bound a subharmonic quantity between two lines; the left line would have to
carry CP(sigma_0) for some sigma_0 < 1, which is ZF(sigma_0) by Theorem 3. Nothing one-sided is available.
MEASURED (N = 80, T = 0): lambda_min = +0.0124 (sigma 1.3), +0.2505 (1.1), +4.17 (1.001), -1.38 (0.9),
-4.42 (0.75), -8.62 (0.6): increasing towards the pole from the right, negative immediately to the left.

### Remark 6 (finite-order consequences are weaker and let zeros through). Not proved; reasoning only

2x2 minors of CP(sigma) with Gaussian tests give sup_T |(phi_sigma * gamma_w)(T)| <= M(sigma,w)
= sum c_n n^-sigma e^{-w^2 log^2 n}, a uniform bound for smoothed log zeta on the line. Under Theorem 1 a zero
at distance b to the right changes the left side by a bounded term C_b(T - gamma), so a single zero does not
violate a fixed-order minor; only all orders together (= the support condition) exclude it. This matches the
map (finite Pick orders are Euler-blind; MV-CAP).

## 3. Decisive test (local, scripts/memcap.sh 8, mpmath + numpy, about 25 min total)

Files: lib.py, raw_gram.py/.log/.json, comp_gram.py/.log/.json, comp_gram_sparse.py/.log/.json,
comp_gram*_ea_fixed.* (E_a rerun after a fix: the pole cut is now placed at u = 0 with its known multiplicity;
the first E_a rows in comp_gram*.json are superseded), thmB_check.py. Server not used.

**Test A (raw Gram, G_jk = phi(u_j-u_k), diagonal Re log F(sigma), 80 nodes spacing 0.5, second cluster at T).**
min eigenvalue [number negative / size]:

| F | sigma | T = 0 | T = 1e3 | T = 1e5 |
|---|---|---|---|---|
| zeta | 0.6 | -8.62 [52/80] | -13.09 [105/160] | -15.10 [103/160] |
| zeta | 0.75 | -4.42 [50] | -5.93 [111] | -6.18 [110] |
| zeta | 0.9 | -1.38 [29] | -1.84 [83] | -1.81 [86] |
| zeta | 1.0 (diag at 1.001) | +4.17 [0] | +3.99 [0] | +4.02 [0] |
| zeta | 1.1 | +0.2505 [0] | +0.1889 [0] | +0.2015 [0] |
| zeta | 1.3 | +0.0124 [0] | +0.0067 [0] | +0.0077 [0] |
| E_a, a=0.2 | 0.6 / 0.75 / 0.9 / 1.0 / 1.1 | -18.2 / -10.6 / -5.27 / -3.31 / -1.37 | -48.5 / -17.6 / -7.49 / -4.37 / -1.83 | -82.3 / -20.3 / -7.97 / -4.38 / -1.79 |
| E_a | 1.3 (right of its pole 1.2) | +0.2513 [0] | +0.1894 [0] | +0.2024 [0] |
| sign twist at p=2 | 0.6 ... 1.3 | -58.3 ... -32.3 | -112 ... -64.9 | -111 ... -64.7 |
| Liouville twist zeta(2s)/zeta(s) | 0.6 ... 1.3 | -49.0 ... -33.2 | -98.7 ... -65.0 | not run |
| pair lift (zero at 0.85+17.58i) | 0.6 ... 1.3 | -53.4 ... -40.4 | -68.5 ... -43.7 | not run |
| DH | 0.6 ... 1.3 | -37.6 ... -13.7 | (T=85.70) -71.1 ... -27.6 | (T=1e3) -69.6 ... -27.5 |

Raw positive-definiteness holds for zeta exactly on sigma >= 1 and for E_a exactly right of its pole; it fails
for DH, both sign twists and the lift on every line tested, including sigma > 1.

**Test B (compensated, Gaussian tests |ghat|^2 = e^{-w^2 x^2}, w = 0.5; Phi = phi*gamma + pole compensators).**
Identity error = max |Phi - prime sum|. Sparse nodes (20 per cluster, spacing 1.5) are the conditioned case;
dense nodes (40, spacing 0.75) have prime-sum min eigenvalue about 1e-7 to 1e-9, below quadrature error, and
are not used for signs.

| F | sigma | identity error (near / far block) | min eig, sparse: T=0, 1e3, 1e5 | prime-sum min eig (T=0) |
|---|---|---|---|---|
| zeta | 0.6 | 9.9e-8 / 2.8e-7 | 9.18e-3, 1.5e-4, 1.3e-4 | 9.18e-3 |
| zeta | 0.75 | 3e-12 / 6.5e-11 | 4.36e-3, 6.4e-5, 5.1e-5 | 4.36e-3 |
| zeta | 0.9 | 1.0e-7 / 5.6e-11 | 2.07e-3, 2.7e-5, 1.9e-5 | 2.07e-3 |
| zeta | 1.1 | 1.0e-7 / 9e-13 | 7.65e-4, 8.4e-6, - | 7.65e-4 |
| E_a | 0.9, 1.1 | 1.0e-7 | 6.37e-3, 2.36e-3 | same |
| E_a | 0.75 (zeros at Re 0.7, left) | 5.3e-5 (zeros 0.05 from the line, grid 0.05) | +1.33e-2 | 1.34e-2 |
| E_a | 0.6 (zeros at Re 0.7, right) | 0.36; with the 14 zero terms of Theorem 1: 9.9e-8 | -0.637 [2 negative] | 2.83e-2 |
| sign twist p=2 | 0.75, 1.1 | 2e-12, 1e-7 (signed prime sum) | -10.5, -8.25 | same |
| pair lift | 0.75, 0.9, 1.1 | - | -11.0, -10.8, -10.1 | - |
| DH | 0.75, 0.9, 1.3 | - | -4.67, -3.80, -2.20; T=85.70: -9.20, -7.62, -4.40 | - |

Reading: the identity of Theorem 1 holds numerically for zeta at heights 0, 1e3, 1e5 (no zeros to the right);
for E_a at sigma = 0.6 the defect is exactly the zero terms. The cut detector found the DH zero at
u = 85.69934849 on sigma = 0.75 and the lift zero at 17.57838239 (jump +2 pi each), the pole at 0 (jump -2 pi).
For zeta the compensated minimum eigenvalue equals that of the prime-sum matrix; it is positive and small
because the tests overlap, not because of a margin statement.

## 4. Controls (R3): failing step for each

The object is an equivalence, so the question for each control is where "CP(sigma) holds on some sigma < 1"
fails, and whether that failure uses multiplicativity.

| Control | Outcome | Failing step |
|---|---|---|
| DH | fails on every line (MEASURED) | log DH is not supported on prime powers and has negative coefficients (n = 3); also zeros right of 1 |
| Backward heat | not run; structural | not an ordinary Dirichlet series, so the FT of its log is not atomic on {log n}; the first step is not formulable (no quantitative handle) |
| Sign twist TW- | fails on every line (MEASURED, p = 2 twist and Liouville) | negative atoms; a sign condition, visible already at sigma > 1 |
| Sign twist TW+ (0 <= eps <= 1) | **passes** | atoms stay >= 0; CP(sigma) holds exactly where its continuation is zero-free. Not excluded |
| Unimodular twist | fails at sigma > 1 for generic phases; not run | atoms become complex. For p^{-i tau} phases it is a vertical translate of zeta and the property is restored after translating the nodes. Not excluded structurally |
| E_a | **passes** for sigma > 1/2 + a (MEASURED at 0.75, 0.9, 1.1); fails at sigma = 0.6 | fails only through its zeros to the right of the line (the zero terms of Theorem 1), i.e. through the conclusion itself |
| T-NR | fails at sigma > 1; not run | the local factor at q has log-coefficients of non-constant or negative sign: a sign condition at one prime |
| Beurling | **passes**; not run | positive measure, pole at 1; CP(sigma) is equivalent to zero-freeness of the Beurling zeta, which can fail up to any theta < 1 |
| Phase-rotated transfer operator, theta^w | not run; structural | no Dirichlet series with a positive measure for the logarithm; not formulable |

Three controls pass. The property separates zeta from DH, signed twists, lifts and T-NR by the sign of the
log-coefficients (already known on sigma > 1, row P29), and from E_a and Beurling only by their zeros.

## 5. Requirement flags

- **R1 (multiplicativity essential): no.** Multiplicativity enters only as "log F has non-negative coefficients"
  in the trivial direction ZF => CP. The direction CP => ZF (Theorem 3) uses the half-line with no primes.
  TW+, Beurling and E_a satisfy the same equivalence.
- **R2 (height-uniform, every window): no.** CP(sigma) is height-uniform in form (stationary kernel, all node
  sets), but it is not established for zeta on any sigma < 1; by Theorem 3 it is ZF(sigma). Numerics cover
  heights up to 1e5 only and add nothing beyond verified height.
- **R3 (fails for every control): no.** TW+, Beurling and E_a (for sigma > 1/2 + a) pass; see section 4.
- **R4 (reaches the critical line): no.** Proposition 5: the positive-definite kernel ends at the pole on the
  diagonal; no monotonicity or convexity of lambda_min crosses sigma = 1; the compensated property on a line
  left of 1 is the zero-free statement for that line.

## 6. Why the idea dies, and pivot

Exact reason: for sigma < 1, positivity of the compensated transform splits into a support condition on the
half-line x < 0 (equivalent to ZF(sigma), no arithmetic) and a sign condition on the atoms (automatic). There is
no intermediate statement between "all orders" (= ZF(sigma)) and finite-order minors (true under ZF, not
excluding zeros; Remark 6). Map entry to update: section 6 item 8 is closed as a restatement; row P29 extends to
"on 1/2 < sigma < 1 the compensated form is ZF(sigma) (c1-pd-log-strip Thm 3)".

Pivot considered (not pursued further): fixed-order minors of CP as height-uniform inequalities. Remark 6 gives
the reason they cannot exclude a zero; the route coincides with finite Pick orders (Euler-blind) in the map.

Usable by-product: Theorem 1 is an exact, numerically confirmed formula for the Fourier transform of
log zeta on a line inside the strip, with pole and zero terms of one shape D_b. It gives a windowed detector:
with Gaussian tests the defect Phi - (prime sum) at difference Delta equals sum_rho m_rho C_{beta-sigma}(Delta - gamma),
which is a verification computation at height gamma (same class as verified height).

## 7. Three weakest steps

1. Theorem 1 is a sketch: horizontal-edge bounds, zeros exactly on the line Re s = sigma (integrable log
   singularities), and the exchange of the zero sum with the test pairing are stated, not written out. The
   numerical confirmation covers zeta (no zero terms occur) and E_a at low height with Gaussian tests only.
2. Theorem 3 (b) => (d): the limit through cutoffs (monotone convergence on the measure side, dominated
   convergence on the zero side with the O(b gamma^-2) bound) is given in outline. Proposition 4 leaves the
   constant C_tau uncomputed and uses verified height.
3. Controls: backward heat, unimodular twist, T-NR, Beurling, phase-rotated transfer operator and theta^w were
   assessed structurally, not run. In test A the sigma = 1 row uses the diagonal at 1.001 (the true diagonal is
   infinite), and dense-node rows of test B are below the quadrature noise floor.
