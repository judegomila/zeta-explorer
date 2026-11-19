# c15-nonhomogeneous-pair-triple-kernel-search: PREREG

Written 2026-11-19 before any run of this lane (only the c14 code had been copied as text: `kern.py`, `ballk.py`,
`funcs.py`, `jk.py`, `jobj.py`, `jf.py`, `jball.py`, `sets.py`; no value, sign or table of this lane existed).
Kind: compute (heavy), round 15. Nothing here is a statement about zeros of zeta. Predecessor:
c14-joint-zeta-twist-noncone-search (outcome "none" for pair functionals homogeneous in each kernel; its section 10
lists quotients, logarithms and triples as not run).

## 1. Registered question

In the dictionary DN of section 4 (sign functionals of a kernel pair or triple that are not polynomial in the point
values of each kernel, or that read the product kernel; a discrete label and at most three real parameters; every
point read lies in [-2.6, 2.6]), is there a functional that
(a) has one strict sign on every training positive (PA of section 3);
(b) has the opposite strict sign on at least one training member of each of the nine control classes;
(c) keeps the pattern on held-out members: at least 23 of the 24 held-out positives with the sign of (a), and in each
    class at least 23 of its 24 held-out members with the opposite sign?
Outcome "survivor": (a), (b), (c) hold in float64 and in the ball recheck. Outcome "none": otherwise; a statement
about the registered scan (MEASURED), not about all parameter values, except where section 5 states that one
parameter is solved exactly. Tiers as in c14: T-train = (a), (b); PZ = positives with zeta only; FE tier = classes
{T-NR, E_a, HEAT, BLS}. **Registered prediction: no survivor** (no functional one-signed on the L-function side,
rejected by all nine classes and holding out). Not predicted: which class blocks which family.

## 2. Paper step (done before any code; deletions are part of the registration)

Notation: pair (K_A, K_B), K_B = kernel of A twisted by chi; R = K_B/K_A (pointwise);
L2_X(u,h) = log|K_X(u-h)| - 2 log|K_X(u)| + log|K_X(u+h)|;
L3_X(u,h) = log|K_X(u+3h/2)| - 3 log|K_X(u+h/2)| + 3 log|K_X(u-h/2)| - log|K_X(u-3h/2)|;
g_tau(u) = exp(tau u^2/4). "Without" = A side without polar terms (K3), "with" = Kpol. HEAT pair without polar
terms: (g K3_zeta, g K_chi) (c14 lift).

- **Lemma J1-Q (quotient form of J1; PROVED, one line).** On the HEAT pair without polar terms R is the R of the
  positive pair (zeta, chi) with the same chi (g cancels pointwise). Every functional of R alone (values, minors of
  any order at any nodes, differences of log|R|) has the same value on both. A training HEAT pair is twisted by a
  training character, so such a functional, one-signed on PZ, cannot reject a training HEAT pair.
  DELETED: all of (a) without polar terms; the first mixed log difference without polar terms.
- **Lemma J1-L (logarithm form; PROVED).** log|g K| = tau u^2/4 + log|K|; the second difference of u^2 with step h
  is 2h^2 and the third difference is 0. Hence on the HEAT pair without polar terms: L3_A, L3_B unchanged;
  L2_A, L2_B both shifted by tau h^2/2. The twisted member never has polar terms, so L3_B is unchanged for both
  A-side readings. DELETED: every functional of (L3_A without, L3_B) alone, every functional of L3_B alone;
  L2_A - L2_B - mu without polar terms (the shifts cancel). KEPT: L2_A - lam L2_B (lam != 1), L2_A + L2_B - mu,
  single L2 - mu (shift tau h^2/2 != 0), and everything with polar terms (the heat kernel with polar terms is not
  g Kpol).
- **Lemma C (common-multiplier blindness, c14 pair design).** It concerns the quotient of the FUNCTIONS,
  L(s,chi)/zeta(s); on the kernel side that is the deconvolution quotient (coefficients chi * mu). Read that way,
  sub-dictionary (a) is closed by T-NR at a prime with chi(p0) = 1 (PROVED there) and is DELETED. Read as the
  pointwise quotient of kernels (the reading run here), Lemma C does not apply: T = shift(-l) + c + shift(l) acts on
  both kernels but does not commute with pointwise division. For (c), the function-side quotient "product over
  product of members" is identically 1 for every object; DELETED as empty. What is kept in (c) compares the product
  kernel (a convolution) with the pointwise product of member kernels.
- **Single log second differences are Turan expressions.** sign(L2_X - mu) = sign(|K(u-h) K(u+h)| - e^mu |K(u)|^2):
  the c13 family F1 with absolute values, read here on the pair positives. Kept (cheap), marked "not new in type".
- **Pre-filter (c13 PREFILTER).** Q-P: every kept functional is of type X5 (a kernel condition outside a
  dilation-invariant convex cone: log-concavity type, quotient signs) or compares a convolution with a pointwise
  product; none is of type S1 to S3, so Lemma P does not give T-NR a pass. Q-B: none of the kept functionals is
  invariant under P_b(D) (BLS acts by a differential operator, not by a pointwise multiplier). Q-S: quotients and
  logarithms are division-type reads; a pointwise multiplier common to both members is invisible to (a) and to L3:
  this is exactly the HEAT deletion above. No further sub-dictionary is closed on paper.

## 3. Objects

**Pairs (for (a), (b)).** The c14 pair set (`jobj.build`): positives PZ = 23 pairs (zeta, chi), conductor <= 13;
PX = 506 pairs (chi, chi'); 24 held-out positives (conductors 14..40); nine control classes lifted to (G, G x chi)
exactly as in c14 PREREG section 4, with ONE change: class 2 (T-NR) is taken at a split prime for the character of
the pair. Training: for each chi in Tw5, p0 = the smallest prime with chi(p0) = 1 and c = 2 + 0.5 (p0^(1/2) +
p0^(-1/2) - 2) (5 pairs). Held-out: chi = H[rng_2 draw] as in c14, p0 = one of the three smallest primes with
chi(p0) = 1 (rng_2), c = 2 + t (p0^(1/2) + p0^(-1/2) - 2), t uniform (0.05, 0.95). With chi(p0) = 1 the pair is
(T K_zeta, T K_chi) with the same real T (Lemma C form).

**Triples and product pairs (for (c)).** chi cubic: object (F, F x chi, F x chi^2); chi quadratic: (F, F x chi).
Cubic characters (one per conjugate pair): training conductors 7, 9, 13; held-out 19, 31, 37. Quadratic: training =
the 9 real primitive characters of conductor <= 13; held-out = the real primitive characters of conductor 14..40.
- Positives: PZ3 = (zeta; chi) for the 3 + 9 training chi (12 objects). PX3 = (chi_a; chi) for chi_a among the 23
  training characters with conductor coprime to that of chi and chi_a chi, chi_a chi^2 primitive (product
  characters). PA3 = PZ3 and PX3. Held-out (24): (zeta; chi) for the 3 held-out cubic chi and 9 held-out quadratic
  chi drawn by PCG64(150000); 12 objects (chi_a; chi), chi held-out, chi_a training coprime, same generator.
- Controls, classes 1..9 as in c14, G-side and parameter rules as in c14 section 4. Training twists Tw5c = {cubic 7,
  cubic 9, chi3.2, chi8 even, chi5 real}; training G parameters as in c14 (first parameter only for classes with
  two, so 5 objects per class; DH: twists coprime to 5; T-NR at the split prime rule above). Held-out: 24 per
  class, parameters by the c14 rule with PCG64(150000 + k), twist drawn from Tw5c and the held-out cubic/quadratic
  lists subject to the c14 pool limits (E_a: conductor <= 24; theta^w, DH: training conductors only, DH coprime to
  the conductor of G; T-NR: split prime <= 150).

Lift conventions of this lane (each is a definition; a different choice is a different run; **all are pending the
ruling of lane c15-referee-r14-independent-checkpoint**):
- L1. Member lifts: the c14 rules (general rule for Dirichlet-type classes, "same operation on K_chi" for HEAT and
  BLS, twist on the index m for theta^w, transported character for Beurling). chi^2 member: the same rule with
  chi^2 (= conj chi for cubic chi).
- L2. Product kernel C = kernel of the product of the completed members with the A member read without polar
  terms = additive convolution K3_A * K_B (* K_C). For classes whose members decay on both sides (positives, T-NR,
  E_a, HEAT, BLS) it is computed as that convolution. For Dirichlet-type classes whose twisted members have no
  functional equation (DH, theta^w, U, THIN, BEU) it is DEFINED by the theta-side series: with member atoms
  K_i(u) = sum_k w_ik phi_(beta_i)(u + s_ik), phi_beta(t) = e^(beta t) exp(-pi e^(2t)), and without the n = 0 term,
  C(u) = sum over index triples of w_1 w_2 w_3 Phi(u + s_1 + s_2 + s_3), Phi = [(D^2 - beta_A^2) phi_(beta_A)] *
  phi_(beta_2) * phi_(beta_3) (no operator for DH, which has no n = 0 term). For the positives both definitions are
  the same function; this equality is the validation of the theta-side code.
- L3. (c) reads u on the lattice (1/32) Z in [-1, 2.6] (objects with a functional equation carry the same
  information on both sides; the theta-side series needs e^(-2u) times more terms on the left).
- L4. Complex kernels: log|K| in (b); real part of R, of determinants, of C and of the pointwise product in (a), (c).
- L5. T-NR split-prime rule above (class 2 differs from c14's class 2, which used p0 = 3 for every twist).

## 4. Dictionary DN (after the deletions of section 2)

Pair families; `with`/`without` = A-side reading. Real parameters in brackets.
- **a1-with**: Re R(u) - mu [u, mu].
- **a2-with, a3-with**: Re det[R(u_i + log n_j)], orders 2, 3; u_i = u_0 + i h + i^2 g increasing (g = 0 at order 2);
  columns n_1 < .. < n_m in {1..13} (label) [u_0, h, g].
- **b1**: L2_A - mu (with, without), L2_B - mu [u, h, mu].
- **b2-with**: L3_A - mu [u, h, mu].
- **b3**: L2_A - lam L2_B (with, without) [u, h, lam].
- **b4**: L2_A - L2_B - mu (with only); L2_A + L2_B - mu (with, without) [u, h, mu].
- **b5-with**: L3_A - lam L3_B [u, h, lam]; L3_A - s L3_B - mu, s = +-1 [u, h, mu].
- **b6-with**: log|R(u+h)| - log|R(u)| - mu [u, h, mu].
Product families (A without polar terms; Pi_h(u) = K_A(u-h) K_B(u) K_C(u+h) for triples, K_A(u-h) K_B(u+h) for
product pairs; u, h on the lattice 1/32, h >= 0):
- **c1 (minus)**: Re C(u) - lam Re Pi_h(u) [u, h, lam].
- **c2 (divided)**: Re[C(u)/Pi_h(u)] - mu [u, h, mu].
- **c3 (log)**: L2_C(u,h) - lam (sum of L2 of the members at (u,h)) [u, h, lam].

## 5. Scan and sign reading

- **Exact third parameter.** In every family except a2, a3 the last parameter (mu or lam) enters as V - mu or
  V1 - lam V2 with V, V1, V2 depending on the object and on the other parameters only. For each node (labels and
  the first two parameters) the set of mu (lam) for which (a) and (b) hold is computed exactly as a union of
  intervals from the object values; the node is "feasible" when that set is non-empty. So for these families the
  scan is over two real parameters and is exhaustive in the third. At a feasible node the held-out rule (c) is read
  at the midpoint of every feasible interval (unbounded intervals: endpoint +- 1).
- **Nodes.** Pair families: grid u in {-2.5, -2.48, .., 2.5}, h in {0.02, 0.04, .., 1.6} (h unused for a1), inside
  the window; plus 300,000 random nodes per node group, u uniform [-2.6, 2.6], h uniform [0.005, 1.7], rejected outside
  the window, PCG64(151000 + group index); node groups (families of one group share their nodes, which shares the
  kernel evaluations): g0 = {a1} (u only: grid step 0.002 and 300,000 random u), g1 = {b1, b3, b4, b6} (points
  u, u +- h), g2 = {b2, b5} (points u +- h/2, u +- 3h/2). a2, a3: the c14 JA grid restricted to orders 2, 3 and 2,000,000 random
  draws per order with the c14 boxes, PCG64(152000 + order). Product families: every lattice node (u, h) in the
  window [-1, 2.6].
- **Noise.** Float64 with the c14 entry-noise estimates. A value V carries a half-width e_V (propagated: quotient
  and log by first-order relative noise, floor 1e-12 relative; entries with noise/modulus > 1e-3 are undecided).
  Strict reading: positives and rejecting controls must be decided with margin (intervals V +- e_V do not touch
  the threshold). Optimistic reading: undecided entries count in favour of feasibility. A node feasible in the
  optimistic reading and not in the strict one is "undecided" and goes to the ball stage. Product kernels carry
  1e-13 times the convolution of moduli (convolution route) or 1e-8 times the sum of moduli (theta-side route:
  interpolation of the Phi table), so undecided nodes are expected in (c).
- **Ball stage (python-flint, CPU, server).** Every undecided or feasible node of the pair families is recomputed
  in balls (256, 1024 bits) with the c14 ball kernels and the same interval logic; members with no ball kernel
  (theta^w twist) are reported. Product families have no ball evaluation in this lane: feasible or undecided nodes
  of (c) are reported as float64 leads, not as survivors.
- **Order of evaluation.** Positives PZ first; nodes at which no mu (lam) keeps PZ one-signed and rejects are
  counted and dropped only in the exact-parameter sense (the interval logic is run on all objects; cost is small).

## 6. Controls of the search

- Planted separator, kernel level: the c14 synthetic pairs (Gaussians against Gaussians times (1 + c u^2)) through
  the same pair pipeline; required: family b1 (L2_B - mu) reports feasible nodes holding out (log of a Gaussian has
  constant second difference -2 be h^2 < 0; the control has a larger one near u = 0).
- Planted value level: at 5 random nodes per family the control values are overwritten by an ideal pattern in a
  copy; the selection must return exactly those nodes in addition to its own.
- Label shuffles: 200 permutations of the object labels (group sizes kept), PCG64(153000 + r), on every 10th node of
  each exact-parameter family; share of permutations with a T-train-feasible node and with a full survivor.
- Kernel validation: Lemma J1-Q and J1-L identities measured on the HEAT pairs (deleted families evaluated at 2,000
  random nodes: differences must be at rounding level); product kernel of every positive by both routes of L2.
- Float64 against balls: 300 random decided (node, object) values per pair family.

## 7. Compute plan

Local (through `scripts/memcap.sh 8`, `.venv-arb/bin/python`): smoke tests with reduced node counts. Server
(through `rhrun` only, `rhstatus` first, heavy allowance: at most 16 cores and 32 GB, each job <= 3 h, own units
stopped or ended before the lane closes): the whole pipeline once from scratch; every reported number comes from
that run. GPU 1: not planned. Planned memory (printed before allocation): value matrices float64[nodes x objects],
at most 3.4e5 x 870 x 8 B = 2.4 GB per family for the pair families, processed in chunks of 20,000 nodes (140 MB per
worker); a2/a3 sign matrices int8[stage-2 rows x 870] per chunk of 20,000 (17 MB); product kernels: 116 lattice
values per object, Phi tables 4,609 x 2 float64, theta^w coefficient lists of at most 3e5 big integers of at most
1e4 bits (375 MB per worker; at most 8 workers at a time).

## 8. What would change the verdict wording

A float64 survivor confirmed in balls on the held-out members is a lead for round 16 (three lanes: proof step,
controls, referee) and sets no flag. "None" closes DN on the registered scan under conventions L1 to L5 only.
R1 = R2 = R3 = R4 = false in either outcome.

## 9. Amendments

State when A1 to A3 were written (2026-11-19): the pair pipeline (`nf.py`, `nsolve.py`, `nrun.py`, `nmin.py`) had been
smoke-tested locally at 1/100 to 1/200 of the registered random nodes (synthetic set: planted family b1-B recovered;
real pairs: no PA T-train node in a1, a2, a3, b1 to b6; these local outputs are not part of the record). No product
kernel had been computed and no (c) value existed. Sections 1, 2 and the pair families are not changed.

- **A1 (product families split by kind).** A triple reads three kernels and a product pair two, so one threshold
  cannot be shared. Kind T (cubic chi, triples) and kind Q (quadratic chi, product pairs) are separate families
  c1-T, c2-T, c3-T, c1-Q, c2-Q, c3-Q, each with its own objects: positives P (zeta; chi) for the training chi of
  the kind (3 for T, 9 for Q), PX (chi_a; chi) for all coprime training chi_a, 24 held-out positives ((zeta; chi)
  for held-out chi: 3 for T, 9 for Q; the rest (chi_a; chi) with chi held-out, chi_a training, coprime), PCG64(150000)
  for T and PCG64(150050) for Q; controls: 5 training and 24 held-out objects per class and kind, generators
  PCG64(150000 + k) (T) and PCG64(150050 + k) (Q). Training controls of kind T: twists cubic 7, 9, 13 with the first
  c14 parameter and cubic 7, 9 with the second (T-NR: smallest and second smallest split prime; DH: Re and Im part
  of chi5.2; U seeds 120000, 120001; BEU delta 0.5, 0.25). Kind Q: the first five real training characters (DH:
  coprime to 5) with the first parameter. Held-out E_a twists: conductor <= 24 (kind T: 19 only).
- **A2 (lattice count).** The lattice of L3 has 116 points u = -1 + j/32, j = 0..115 (largest 2.59375).
- **A3 (theta-side truncation and tables).** Phi and Phi' are tabulated with step 1/256 on [-19, 4] from trapezoid
  convolutions on [-20, 4] and read by cubic Hermite interpolation; terms with Phi below 1e-24 of its maximum are
  dropped. The convolution route uses step 1/64 on [-11, 11].
- **A4 (ball stage scope; written after the local trial of the ball stage on reduced node sets, before the server
  run).** (i) Nodes of exact reflection symmetry (b6 at u + h = -u; b2, b5 at u = 0) have value 0 for every pair
  with K(-u) = conj K(u), positives and FE-class controls alike; they are excluded by that identity (PROVED) and not
  sent to balls. (ii) Ball stage in full for: every node undecided or feasible in tier PA/all and every node
  feasible in tier PA/FE. Nodes undecided in the FE tier only: a random sample of at most 150 per family
  (PCG64(156000 + family index)); the remainder is reported as unresolved in float64. Reason found in the trial:
  for the A-side kernel with polar terms, log Kpol_zeta is linear to below 1e-13 where pi e^(2|u|) > 30, and the
  same holds for HEAT, so second and third log differences tie at rounding level in that region; a ball decides only
  where its radius is below the size e^(-pi e^(2|u|)) of the tail. (iii) Refinement: besides the float64-undecided
  entries, the entries whose float64 interval lies within 20 half-widths of an optimistic feasible interval are
  recomputed in balls, repeatedly (at most 5 rounds).
- **A5 (noise of the theta-side route; written while the server run was in its pair stages, before any product
  kernel of the record was computed).** The referee check R3 (closed form of phi_(1/2) * phi_(3/2)) gives table
  values exact to 4e-15 and a Hermite interpolation error of up to 2.6e-7 relative in the steep right tail. The
  theta-side noise is therefore set to 1e-6 times the sum of moduli (section 5 said 1e-8).
- **A6 (tiers requested by the referee ruling; written after the server run, when
  `c15-referee-r14-independent-checkpoint/LIFT_RULING.md` had appeared).** The ruling (section 4) asks for every
  tier three ways and for BLS, theta^w and BEU outside the decisive tier. Two tiers are added: canon = {T-NR, E_a,
  HEAT} (canonical lifts only) and six = {DH, T-NR, E_a, HEAT, U, THIN}. The exact-parameter pair stage is run a
  second time with the same nodes and seeds (`out2/`); the registered tiers must reproduce the first run. Product
  families: the two tiers are read locally from the saved product arrays (member noise not saved: set to 0 there).
  Not implemented from the ruling: the per-member FE-respecting DH class (item 2), a theta^w lift that restricts to
  (zeta, chi) at w = 1 (item 4), a HEAT class with unequal tau on the members (section 5). The histogram bin "no lam
  keeps the positives one-signed" was merged with the bin "no class rejected" in the first run (initial value 0
  instead of -1 in `nsolve.analyse`); corrected in the second run.
