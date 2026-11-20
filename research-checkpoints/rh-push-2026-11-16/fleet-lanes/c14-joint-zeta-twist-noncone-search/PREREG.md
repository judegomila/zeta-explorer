# c14-joint-zeta-twist-noncone-search: PREREG

Written 2026-11-19 before any run of this lane (no kernel pair, functional or table of this lane existed when this
file was written; `kern.py`, `ballk.py`, `funcs.py` are copies of the c13 files). Kind: compute (heavy), round 14.
Nothing here is a statement about zeros of zeta. Predecessor: c13-noncone-kernel-separator-search (outcome "none" for
functionals of ONE kernel; its section 9 lists "a functional that reads two kernels at once" and "Hermitian forms for
complex kernels" as different questions that were not run).

## 1. Registered question

In the dictionary DJ of section 5 (functionals of a PAIR of kernels (K_A, K_B), K_B = the kernel of the object A
twisted by a Dirichlet character; a discrete label and at most three real parameters), is there a functional that
(a) takes one strict sign on every training positive pair (section 3): all pairs (zeta, L(chi)) and all ordered pairs
    (L(chi), L(chi')), chi != chi', over the 23 primitive characters of conductor <= 13 (one per conjugate pair);
(b) takes the opposite strict sign on at least one training pair of each of the nine control classes (section 4);
(c) on held-out members keeps the pattern: at least 23 of the 24 held-out positive pairs have the sign of (a), and in
    each control class at least 23 of its 24 held-out pairs have the opposite sign?

- Outcome "survivor": at least one functional meets (a), (b), (c) in float64 and in the ball recheck (section 8).
- Outcome "none": no functional meets (a), (b), (c). "None" is a statement about the registered grid and the
  registered random draws (MEASURED), not about all real parameter values.
- Secondary tiers (registered so that they are not chosen afterwards): T-train = (a) and (b) only; T-weak = (a), (b),
  no held-out positive of the wrong sign and at least one opposite held-out pair per class. Positive sets:
  PZ = the 23 pairs (zeta, L(chi)); PA = PZ and the 506 ordered pairs (L(chi), L(chi')) (the registered set).
  FE tier: the criterion read on the control classes whose twisted member keeps a functional equation only (Lemma T,
  section 2), because a class whose twisted member has no functional equation can be rejected by a functional that
  only detects the missing reflection symmetry.
- Registered prediction: no survivor. Not predicted: which class blocks which family.

## 2. First lemma (registered exclusion, not a result): functional equation of the twisted control

Convention as in c13: Lambda(1/2 + z) = int K(u) e^(zu) du; n^(-s) acts as K(u) -> n^(-1/2) K(u + log n); a
functional equation with root number of modulus 1 is K(-u) = eps conj K(u), and after division by omega (omega^2 =
eps) K(-u) = conj K(u). "Twisted member" = the lift of section 4. Status per class, to be stated with its label in
RESULT.md (PROVED / CLASSICAL / MEASURED residual of K(-u) - eps conj K(u) at two points):

| class | twisted member | expected status |
|---|---|---|
| T-NR | conj(chi(p0)) K_chi(u - log p0) + c K_chi(u) + chi(p0) K_chi(u + log p0) | kept (one-line proof from K_chi(-u) = conj K_chi(u)) |
| E_a | kernel of Lambda(s+a, chi) Lambda(s-a, chi) | kept (classical; root number eps(chi)^2) |
| HEAT | e^(tau u^2/4) K_chi(u) | kept (even real multiplier) |
| BLS | P_b(D) K_chi, P_b real even | kept |
| DH | series with coefficients a_DH(n) psi(n) | lost in general: the two constituents L(chi_G psi), L(conj(chi_G) psi) are exchanged by the reflection only when psi is real, and then with the right constants only for some psi; measured per member |
| theta^w | sum over m of r_w(m) chi(m) exp(-pi m e^(2u)/q) | kept at w = 1 (it is the kernel of L(chi^2)), 2, 4 (Euler-product cases, excluded from the class); not expected otherwise; measured per member |
| U, THIN, BEU | coefficientwise twist of a series with no functional equation on file | none before the twist, none claimed after; measured per member |

The lemma decides which classes enter the FE tier of section 1. It is an exclusion rule of the search. It is not
counted as a result of the lane.

## 3. Positives

Kernels of zeta and of primitive chi: exactly the c13 kernels (`kern.ZETA`, `kern.Chi`: omega-normalised, Re omega >
0; zeta with polar terms Kpol or without K3 = (D^2 - 1/4) Kpol; characters have no polar term).
- Training (529 pairs): (zeta, chi) for the 23 characters of conductor <= 13 (9 real, 14 complex, smaller Conrey
  number of each conjugate pair); (chi, chi') for all 506 ordered pairs of distinct members of the same list.
- Held-out (24 pairs): from the sorted list L of primitive characters of conductor 14 to 40 (one per conjugate pair),
  rng = numpy PCG64(140000): 12 pairs (zeta, L[i]) with i = sorted choice of 12 without replacement, then 12 pairs
  (L[i], L[j]) with (i, j) = 24 further indices drawn without replacement, in draw order.

## 4. Control pairs (G, G twisted by chi): nine classes

Class numbering and members. G-side kernels are the c13 kernels where c13 has the class. Twists: Tw5 = the five
characters chi3.2 (real, odd), chi4.3 (real, odd), chi5.2 (complex), chi7.2 (complex), chi8 (real even: the even
primitive character mod 8). Pool H = the list L of section 3. rng_k = PCG64(140000 + k).

General rule for a twisted member of a Dirichlet-type G with coefficients a(n), parity d_G, conductor-type scale N_G:
K_B(u) = conj(omega_chi) e^((1/2+d)u) sum_{n>=1} 2 a(n) chi(n) n^d exp(-pi n^2 e^(2u)/(N_G q)), d = (d_G + d_chi) mod 2;
no n = 0 term. For zeta itself this is K_chi.

| k | class | G (training) | twisted member | training pairs | held-out (24) |
|---|---|---|---|---|---|
| 1 | DH | c13 battery DH (q = 5, Re) | general rule, N_G = 5, d_G = 1 | psi in Tw5 without q = 5 (4 pairs) | G = Re or Im part for a complex primitive chi_G of conductor 7..24 (c13 DHType), drawn by rng_1 from the sorted list; psi drawn by rng_1 from the primitive characters of conductor 3..13 coprime to the conductor of G |
| 2 | T-NR | (p0, c) = (3, 2.2) | section 2 | Tw5 without q = 3 (4 pairs) | (p0, c) by the c13 rule with rng_2; chi from H coprime to p0 |
| 3 | E_a | a = 1/8, 1/4 | 4 y^(1/2+d) sum chi(n) n^(a+d) sigma_(-2a)(n) K_a(2 pi n y/q), y = e^u, divided by omega (omega^2 = measured eps) | 2 x Tw5 (10 pairs) | a uniform (0.03, 0.47) by rng_3; chi from the members of H of conductor <= 24 |
| 4 | HEAT | tau = -0.1, -0.5 | section 2 | 2 x Tw5 (10) | tau = -10^x, x uniform (-1.7, 0.3) by rng_4; chi from H |
| 5 | theta^w | w = 1/2, 3 | conj(omega_chi) e^(wu/2) sum_{m>=1} r_w(m) chi(m) exp(-pi m e^(2u)/q), theta^w = sum r_w(m) e^(-pi m y) | 2 x {chi3.2, chi4.3, chi5.2} (6) | w by the c13 rule with rng_5 (uniform (0.25, 6), redrawn within 0.05 of 1, 2, 4); chi drawn from the primitive characters of conductor 7..13 |
| 6 | U | U-00, U-01, U-02 (seeds 120000 + j) | general rule (N_G = 1, d_G = 0) | 3 x {chi3.2, chi5.2, chi8} (9) | seeds 123000 + j, j = 0..23; chi from H |
| 7 | THIN | THIN-0.9, THIN-0.75 (greedy floor sets, battery rule) | general rule | 2 x {chi3.2, chi5.2, chi8} (6) | b = round(uniform(0.55, 0.98), 4) by rng_7; chi from H |
| 8 | BLS | b = 0.25 + 2i, 0.1 + 5i | P_b(D) K_chi, P_b(D) = (D^2 - b^2)(D^2 - conj(b)^2) | 2 x Tw5 (10) | Re b uniform (0.05, 0.45), Im b uniform (0.5, 8) by rng_8; chi from H |
| 9 | BEU | Beurling primes p + 1/2 (battery) | general rule over the generalised integers nu, chi_B completely multiplicative with chi_B(p_n + delta) = chi(p_n) | Tw5 (5) | delta uniform (0.1, 0.9) by rng_9; chi from H |

Definitions made in this lane (conventions, stated so that a different choice is a different run):
- BLS: the completed function is multiplied by (z^2 - b^2)(z^2 - conj(b)^2), which adds four zeros off the line in
  the strip; G-side kernels P_b(D) Kpol_zeta and P_b(D) K3_zeta. This is the polynomial form of the Blaschke control
  (zeros added). The quotient form (a zero pair of zeta moved off the line) is NOT-RUN.
- BEU: G-side kernel e^(u/2)(1 + 2 sum over generalised integers nu >= 1 of exp(-pi nu^2 e^(2u))) (the n = 0 term kept
  by the c13 convention for objects without functional equation), K3 = (D^2 - 1/4) of it. Its zeros in Re s > 0 are
  zeta's; it is in the question as a class and is a control for arguments that use integer frequencies.
- theta^w twist: the twist acts on the index m of e^(-pi m y) (at w = 1 it gives chi^2).
- "Coefficientwise" for HEAT and BLS, which have no Dirichlet coefficients: the same operation is applied to K_chi.
- SGN, DEL and EIS-w of c13 are not classes of this question (not in the assignment) and are not run.

## 5. Dictionary DJ

Window: every point at which a kernel is read lies in [-2.6, 2.6] (shifts inside T-NR exempt). `pol` in {with,
without} selects Kpol or K3 for the A side (the twisted side never has a polar term). Value read = real part.
i = 0..m-1 throughout.

- **(a) JA: mixed minors.** Order m in {2, 3, 4}; alternation alt in {0, 1} (row i reads K_A when i + alt is even,
  else K_B); columns N = {n_1 < ... < n_m} subset of {1..13}; nodes u_i = u_0 + i h + i^2 g strictly increasing;
  value Re det[k_i(u_i + log n_j)]. Grid: u_0 in {-2.6, -2.4, ..., 2.6}; h in {0.05, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.8,
  1.0, log 2, log 3, log(3/2)}; g in {-0.05, 0, 0.05} (g = 0 only for m = 2).
- **(b) JB1: Hermitian minors.** M = cos(t) K_B + sin(t) K_A; nodes u_i = i h + i^2 g strictly increasing,
  u_(m-1) <= 2.6; H_ii = Re M(0), H_ij = M(u_i - u_j) for i > j and conj for i < j (the kernels are read at u >= 0 only, so H is
  Hermitian for every object, with or without functional equation); m in {2, 3, 4}; value det H (real).
  Grid: h = 0.02 k, k = 1..65; g in {-0.08, -0.05, -0.03, -0.01, 0, 0.01, 0.03, 0.05, 0.08} (0 for m = 2);
  t = pi k/32, k = 0..31.
- **(b) JB2: Hermitian forms.** Q = sum_{i,j} c_i conj(c_j) H_ij with c_i = e^(i phi i), u_i = i h, H as in JB1 from
  M = cos(t) K_B + sin(t) K_A: Q = m M(0) + 2 sum_{d=1}^{m-1} (m - d) Re(e^(i phi d) M(d h)); m in {2, 3, 4, 6, 8, 12};
  grid: h = 0.02 k, k = 1..65 with (m-1) h <= 2.6; phi = 2 pi k/24, k = 0..23; t = pi k/32, k = 0..31.
- **(c) JC1: Turan cross.** Re[K_A(u - s h) K_B(u + s h) - lam K_A(u) K_B(u)], s in {+1, -1} (label); u in {-2.5,
  -2.45, ..., 2.5}; h in {0.02, 0.05, 0.1, 0.2, 0.3, 0.5, 0.75, 1.0, 1.5}; lam in {-1, 0, 0.5, 0.75, 0.9, 1, 1.1, 1.25,
  1.5, 2, 4}.
- **(c) JC2: Turan ratio comparison.** Re[K_A(u-h) conj K_A(u+h)] abs(K_B(u))^2 - lam abs(K_A(u))^2
  Re[K_B(u-h) conj K_B(u+h)]; same grid as JC1 (no label s).
- **Random draws** (continuous parameters, same families; PCG64 seed 141000 + family index, family order JA-with,
  JA-without, JB1-with, JB1-without, JB2-with, JB2-without, JC1-with, JC1-without, JC2-with, JC2-without):
  JA 1,000,000 per pol (m, alt, N uniform over labels; u_0, h, g uniform over [-2.6, 2.6], [0.02, 1.2], [-0.12, 0.12];
  rejected outside the window); JB1, JB2, JC1, JC2 500,000 per pol (labels uniform; h uniform [0.01, 1.3] (JB) or
  [0.01, 1.5] (JC); g uniform [-0.1, 0.1]; t uniform [0, pi); phi uniform [0, 2 pi); u uniform [-2.5, 2.5]; lam
  uniform [-2, 4]; rejected outside the window).
- **Adaptive stage (allowed once, after grid and draws).** Per family, around the 200 functionals one-signed on PZ
  that reject the largest number of classes (ties: larger minimum over classes of the held-out opposite fraction):
  200 Gaussian perturbations each of the real parameters (sd 0.05 in u, u_0; 0.3 h in h; 0.02 in g; 0.1 in t and
  phi; 0.1 max(abs(lam), 0.1) in lam), seed 142000 + family index. Their survivors count as survivors.

## 6. Sign reading (c13 section 5 with its amendment A1)

Float64. Matrices are equilibrated (rows, then columns, by the largest modulus) before a determinant; other values
are computed on entries divided by their largest modulus where the expression is homogeneous. Every kernel entry
carries an absolute rounding-noise estimate (1e-15 times the sum of the moduli of its terms, times 1 + w per Gaussian
term). A value v with reference scale S (sum of the moduli of its monomials; permanent of moduli for a determinant)
and rho = largest noise/modulus ratio over the entries read is decided when abs(v) > max(1e-9, 10 deg rho) S,
otherwise undecided (0). Strict reading: (a) needs every positive decided and equal; a control pair rejects when it is
decided and opposite. Favourable reading (reported, and sent to balls): decided positives equal and at least half
decided.

## 7. Evaluation order (a cascade; it changes cost, not the criterion)

Stage 1: every functional on the 23 PZ pairs. Stage 2: the functionals with no two opposite decided signs on PZ, on
every other object (506 positive pairs, 24 held-out positives, all control pairs). In addition every 20th functional
of every family (index = 0 mod 20) is evaluated on every object regardless of stage 1; label shuffles use this
subsample.

## 8. Controls of the search

- **Planted separator, kernel level.** Synthetic pairs of the same group shape: positives K_A = exp(-al u^2),
  K_B = exp(-be u^2); control pairs K_A = exp(-al u^2), K_B = exp(-be u^2)(1 + c u^2), c in (2.5 be, 6 be), al, be
  log-uniform in (0.3, 3) (seed 145000). Required: the pipeline reports survivors, among them JB1 with m = 2, t = 0
  and h = 0.1 (det = K_B(0)^2 - K_B(h)^2, positive for the positives and negative for the controls).
- **Planted separator, value level.** In the real run, 5 stage-2 functionals per family (seed 143000 + family index)
  have their sign rows overwritten by the ideal pattern in a copy; the selection must return exactly those.
- **Label shuffles.** 200 permutations (seed 144000 + r) of the object labels over all objects (group sizes kept) on
  the subsample of section 7; full criterion, T-train and T-weak; false-positive rate = share of permutations with
  at least one survivor.
- **Kernel validation.** Each new twisted kernel type against python-flint balls at 30 random points of the window
  (largest relative error reported); checks at exact cases: theta^w twist at w = 1 against K of chi^2; T-NR twist at
  c = 0 against shifted K_chi; E_a twist against an independent Bessel evaluation (acb.bessel_k); functional-equation
  residuals of section 2.
- **Ball recheck (python-flint, server).** Every functional that float64 cannot exclude from T-train under the
  optimistic reading (undecided entries count in its favour), for PA and for the FE tier, is resolved in balls
  (precisions 256, 1024, 4096 bits): positives first, then class by class until a member of opposite sign is found;
  a functional not excluded is completed on all objects in balls and read by the registered criterion. A cross-check
  of 2,000 random float64-decided (functional, pair) entries per family against balls is run. If the optimistic set
  exceeds the time budget, the unresolved remainder is reported as unresolved, not as excluded.

## 9. Compute plan

Local (through `scripts/memcap.sh 8`, float64 only; python-flint is not installed locally): kernel sanity and
functional-equation residuals, the planted kernel-level run, the grids of JB1, JB2, JC1, JC2. Server (through `rhrun`
only, `rhstatus` first, at most 16 cores and 32 GB, each job <= 3 h, own units stopped or finished before the lane
ends): the whole pipeline once from scratch, ball stage, validation. GPU 1: not planned (order <= 4 determinants and
exp-sums with per-point truncation; CPU suffices); if used it is a float64 screen only. Largest planned allocations
(printed before allocation): sign matrix int8[stage-2 functionals x about 830 objects] per chunk of 20,000
functionals = 17 MB; exp-sum blocks of at most 4e6 float64 entries (32 MB) per worker.

## 10. What would change the verdict wording

- A ball-confirmed survivor on the held-out members is a lead for round 15 (three lanes) and needs a stage A on
  paper before any score flag; this run sets no flag in either outcome (R1 = R2 = R3 = R4 = false).
- "None" closes DJ on the registered grid and draws only. A different pair definition, normalisation, lift or
  functional type is a different run (NOT-RUN).

## 11. Amendments (written 2026-11-19 after a local trial, before the server run)

State when written: kernels built locally without class 7 (python-flint and scipy are needed for the THIN sets and
exist only on the server); the functional-equation residuals of section 2 had been printed; the planted kernel-level
run had passed on three families; three grid families (JC1-with, JC2-with, JB1-with) had been run locally in float64
on the real pairs without class 7 (no functional at T-train for PZ or PA; the whole run took 27 seconds). The local
trial outputs are not part of the record; every reported number comes from the server run. Sections 1 to 5 are not
changed.

- **B1 (sign reading of JB2).** JB2 is linear in the kernel values, so the relative rule of section 6 is replaced by
  the absolute one: decided when abs(Q) > 1e-9 S and abs(Q) > 20 nz, nz = the weighted sum of the entry noises.
- **B2 (more draws).** Because the registered run costs minutes, a second set of draws ten times larger is added
  (JA 10,000,000 per pol, the others 5,000,000 per pol; seeds 147000 + family index; same boxes), label `-rnd2`,
  reported separately. The adaptive stage uses the grid and the registered draws only (100 centres from each).
- **B3 (theta^w coefficients).** r_w(m) is computed by the recurrence m r(m) = sum_k 2 (w k^2 - (m - k^2)) r(m - k^2)
  in fixed point with 192 + 6.8 sqrt((w+1) M) bits (in float64 the recurrence is unstable); checked at w = 1, 2.
- **B4 (planted kernel-level set).** Group sizes of the synthetic set: 23 + 60 + 24 positives, 5 + 24 per class;
  random draws at one fifth of the registered number.
- **B5 (ball stage scope).** The twisted theta^w member needs up to 1.7e5 q terms of a recurrence in balls at window
  points u < 0; it is evaluated in balls at one precision only where feasible, otherwise its entries are reported as
  float64-only. Classes are visited in the order 2, 8, 1, 6, 7, 9, 3, 4, 5.
