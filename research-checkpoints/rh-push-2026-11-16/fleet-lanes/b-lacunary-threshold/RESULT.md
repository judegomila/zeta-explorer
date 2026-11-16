# b-lacunary-threshold: the near-threshold regime of lacunary Weil cones (Route 13)

Date: 2026-11-16. Scratch research note, single agent, no external referee. No RH claim, no change to any bound.
Labels: PROVED (argument given here), CLASSICAL, CERTIFIED (route 13 Arb run, project-internal), MEASURED (high-precision
floating point, not interval-certified), ARGUED (heuristic), OPEN.

## 0. Plan (what is new against the atlas and the walls)

Object. F(w) = xi(1/2 + w), L = F'/F, Pi = {Re w > 0}. For a node set Lambda in Pi, W(Lambda) is the statement that every
finite Pick matrix P = [(L(w_i) + conj L(w_j)) / (w_i + conj w_j)] with nodes in Lambda is PSD. For real nodes this is Weil
positivity on the Muntz cone spanned by e^{-nu t} 1_{t>0}, nu in Lambda (route 13, PICK-WEIL).

Route 13 left three items open: (i) "a complete discrete Lambda forces RH" was conditional on a bounded-type lemma for L;
(ii) the near-threshold regime (ratio q -> 1+, or nu_k = k^p) was graded open/heuristic; (iii) the horizon law T*h ~ 7 was
a precision-dependent lower bound. The atlas (PR 27) has no lacunary/Muntz/Blaschke entry, so nothing here re-runs a closed
route. The eq48 and pick notes treat all-node or fixed-order statements; this note treats infinite node sets graded by
their Blaschke sum, which is a different grading.

Work items: (A) prove the bounded-type lemma and with it the exact Muntz/Blaschke dichotomy; (B) settle the q -> 1+ family;
(C) measure the detection law at fixed q with stable precision and state the horizon; (D) decide whether cones "aligned
with log p" have a proof from primes; (E) DH control.

Walls. DH: every theorem below is an equivalence or a blindness statement and holds verbatim for DH; none of them proves
positivity for xi. Verified height: section 4 shows that at fixed q the cone statement is a verified-height statement with
horizon ~ 1/(h log(1/h)). MV-CAP and flow-blindness are not engaged (no mean values; each W(Lambda) with a margin is open,
hence flow-stable, as route 13 recorded).

## 1. Theorem BT (bounded type) and the Muntz dichotomy. PROVED

Setting (class E). F is a real entire function, even, with zero multiset Z (closed under rho -> -rho and rho -> conj rho),
Z contained in a strip |Re rho| <= sigma_0, sum over Z of 1/|rho|^2 finite, and F'/F = sum over Z of 1/(w - rho) with
the symmetric grouping (absolutely convergent after pairing rho, -rho). F(w) = xi(1/2 + w) is in E (sigma_0 = 1/2); so is
the Davenport-Heilbronn function centred at 1/2 times its gamma factor, and so is xi times any finite product of
quadruple factors (w^2 + lambda)(w^2 + conj lambda).

Split Z = Z_0 (Re = 0), Z_+ (Re > 0), Z_- = -conj Z_+. Put

    L_C(w) = sum_{Z_0} 1/(w - rho) + sum_{Z_-} 1/(w - rho) + sum_{Z_+} 1/(w + conj rho),
    D(w)   = L(w) - L_C(w) = sum_{Z_+} 2 Re(rho) / ((w - rho)(w + conj rho)),
    B(w)   = prod_{Z_+} b_rho(w),   b_rho(w) = (w - rho)/(w + conj rho).

**Lemma 1.** L_C is a Caratheodory function on Pi (holomorphic, Re L_C >= 0). Each term has
Re 1/(w - rho) = (Re w - Re rho)/|w - rho|^2 > 0 for Re rho <= 0 < Re w; the conjugate-paired series converges locally
uniformly because the terms are O(|w|/|rho|^2).

**Lemma 2.** B converges (Blaschke condition sum_{Z_+} Re rho/(1 + |rho|^2) <= sigma_0 sum 1/|rho|^2 < inf), and on Pi

    |B(w) L(w)| <= 3 |L_C(w)|.

Proof. B/(w - rho) = (B/b_rho) / (w + conj rho) and |B/b_rho| <= 1 on Pi, so
|B D| <= sum_{Z_+} 2 Re rho / |w + conj rho|^2 <= 2 sum_{Z_+} Re 1/(w + conj rho) <= 2 Re L_C(w),
using Re 1/(w + conj rho) = (Re w + Re rho)/|w + conj rho|^2 >= Re rho/|w + conj rho|^2. Then
|B L| <= |B||L_C| + |B D| <= 3|L_C|. QED

**Theorem BT.** For every F in E, L = F'/F is of bounded type in Pi: B L lies in the Nevanlinna class N(Pi).
Proof. A Caratheodory function is in N (it is outer; after the Cayley transform it lies in H^p of the disc for p < 1,
Duren, Theory of H^p spaces, Thm 3.2). By Lemma 2, log^+|B L| <= log 3 + log^+|L_C| has a harmonic majorant. QED

This is unconditional and removes the hypothesis flagged by the route-13 referee (refereeKilled[0]). Note that xi itself
is not of bounded type in Pi (log xi(1/2 + x) ~ (x/2) log x); the logarithmic derivative is.

**Theorem M (Muntz/Blaschke dichotomy).** Let F be in E and let Lambda be a set of distinct points of Pi, none a zero of
F, with

    sum_{w in Lambda} Re w / (1 + |w|^2) = infinity.                                   (non-Blaschke)

Then W_F(Lambda) holds if and only if Z_+ is empty. For F = xi(1/2 + .): W(Lambda) <=> RH.

Proof. If Z_+ is empty then L = L_C is Caratheodory and all Pick matrices are PSD (CLASSICAL). Conversely, PSD of all
finite Pick matrices gives, by Pick's theorem for the half-plane and a normal-families limit (Caratheodory functions with
a fixed value at one node form a normal family by Harnack), a Caratheodory G with G = L on Lambda. Then
phi = B G - B L is in N(Pi) (|B G| <= |G|, and Theorem BT) and vanishes on Lambda. The zero set of a non-zero function in
N(Pi) satisfies the Blaschke condition (CLASSICAL), so phi = 0, G = L off the poles, and L has no poles in Pi. QED

Corollaries (all PROVED; equivalences, no positivity is proved for xi).

- **M1 (discrete complete sets).** Lambda = {1, 2, 3, ...} (s = 3/2, 5/2, ...), or nu_k = k^p with p <= 1, or any
  real sequence with sum 1/nu_k = infinity: W(Lambda) <=> RH. Every entry of these Pick matrices is a value of
  xi'/xi at a real point s >= 3/2, i.e. an absolutely convergent prime sum plus digamma and pole terms.
- **M2 (ratio -> 1+).** Let q_n -> 1+ and Lambda_q = {q^k : k >= 0}. Then (W(Lambda_{q_n}) for all n) <=> RH.
  Proof: any finite subset X of [1, inf) is a limit of finite subsets X_n of Lambda_{q_n} (gaps <= (q_n - 1) x); L is
  continuous on [1, inf), so P(X) = lim P(X_n) is PSD; [1, inf) contains non-Blaschke sequences; apply M. The converse is
  the Caratheodory direction.
  So the family with ratio tending to 1 carries, in the limit, the full statement. Each member is strictly weaker at the
  class level (section 2); the information enters through the margin going to 0 (section 4).
- **M3 (exact threshold in the power family).** nu_k = k^p: W <=> RH for p <= 1; Blaschke for p > 1. The route-13
  question "does p in (1, 1.13] carry new information" is therefore a question about a Blaschke set and is governed by
  the density law of section 4, not by a completeness theorem.
- **M4 (prime-aligned vertical cones).** For a prime p and a > 0 let Lambda_{p,a} = {a + 2 pi i k/log p : k in Z}. Its
  Blaschke product is an Euler-factor-shaped Moebius function of p^{-w}:

      B_{p,a}(w) = (1 - p^a p^{-w}) / (p^a - p^{-w}),

  (zeros where p^{w-a} = 1, poles where p^{w+a} = 1, modulus 1 on Re w = 0). Each Lambda_{p,a} is Blaschke
  (sum ~ (log p / 2) a / sqrt(1 + a^2)); a finite union over primes is Blaschke; the union over all primes is not
  (sum over p of log p diverges). Hence for every a > 1/2:
  W(union over all p of Lambda_{p,a}) <=> RH, with all nodes in the half-plane Re s > 1 of absolute convergence.

## 2. Sharpness at the class level: a Blaschke cone does not see high zeros. PROVED given the route-13 certificate

**Proposition S.** Let gamma >= 1000 and 0 < delta <= 1/2, lambda = (gamma - i delta)^2, and
F_tw(w) = xi(1/2 + w) (w^2 + lambda)(w^2 + conj lambda). Then F_tw is in E, has the off-line quadruple
+-delta +- i gamma, and W_{F_tw}(Lambda_4) holds for Lambda_4 = {4^k : k >= 0}.

Proof. c_tw(nu) = c(nu) + 2 g(nu) + E(nu) with g(nu) = 2 nu/(nu^2 + gamma^2) (Pick kernel PSD, rank 2) and
E(nu) = 4 nu Re[(gamma^2 - lambda)/((nu^2 + lambda)(nu^2 + gamma^2))]. Since |gamma^2 - lambda| <= delta^2 + 2 gamma delta
and |nu^2 + lambda| >= (nu^2 + gamma^2)/2,
sup |E| <= 8 (gamma + 1/4) max_nu nu/(nu^2 + gamma^2)^2 = 8 (gamma + 1/4) * 0.32476/gamma^3 <= 2.599e-6 at gamma = 1000
(decreasing in gamma). In route 13's normalisation M_ij = P_ij sqrt(nu_i nu_j / (c_i c_j)) the perturbation N_E has
entries bounded by (|E_i| + |E_j|) / (2 cosh((i - j) h/2) sqrt(c_i c_j)), h = ln 4, so by the Schur test
||N_E|| <= sup|E| * S / c_min, with S = sum_{k in Z} sech(k ln 2) = 4.532 and c_min = c(1) = xi'/xi(3/2) = 0.046136
(c is increasing on [1, inf), route 13). This gives ||N_E|| <= 2.553e-4 < 3.6346e-4 <= lambda_min(M) (CERTIFIED,
route 13). Hence M + N_psd + N_E > 0 and every finite Pick matrix of F_tw on Lambda_4 is positive definite. QED

The same bound covers any multiset of added quadruples with sum of 2.599 (gamma + 1/4)/gamma^3 below 3.70e-6. So
Theorem M is sharp in the only form that has content: for the Blaschke set Lambda_4 the implication
"W_F(Lambda) => Z_+ empty" is false in E. This upgrades route 13's conditional double-zero horizon to an unconditional
class-level statement (with a cruder, first-order constant: 1000 instead of 80).

## 3. Measured detection thresholds at fixed ratio (real geometric lattices)

Script detect.py. Lattice nu_k = 2^{k/m}, k = 0..K, h = ln 2/m, nu_K >= gamma e^{12} (results unchanged between
gamma e^{10}, e^{14}, e^{25} in the cases checked). c(nu) from the prime side in mpmath at 300 digits (500 for m = 18);
LDL sign test in Arb midpoint arithmetic. Twin: xi with one added quadruple +-delta +- i gamma (delta unrestricted, so
the model also covers delta > 1/2). delta* = smallest delta at which positive definiteness fails (bisection). Results are
identical at 150 and 300 digits where both were run; a row is kept only if the unperturbed matrix passes at that
precision. Delta = h gamma/pi is the resolution length 1/sum_nu 2nu/(nu^2 + gamma^2) (route 13's Delta_Lambda); gap =
2 pi/log(gamma/2 pi) is the mean zero spacing; r = Delta/gap.

| gamma | m | h | min LDL pivot (delta = 0) | Delta | r = Delta/gap | delta* |
|---|---|---|---|---|---|---|
| 30 | 1 | 0.6931 | 7.0e-5 | 6.62 | 1.65 | 21.1 |
| 30 | 2 | 0.3466 | 1.7e-10 | 3.31 | 0.82 | 4.12 |
| 30 | 3 | 0.2310 | 1.1e-16 | 2.21 | 0.55 | 0.541 |
| 30 | 4 | 0.1733 | 1.9e-23 | 1.65 | 0.41 | 0.161 |
| 30 | 5 | 0.1386 | 1.5e-30 | 1.32 | 0.33 | 0.0122 |
| 30 | 6, 7, 8 | 0.1155 .. 0.0866 | 6.7e-38 .. 1.4e-53 | 1.10 .. 0.83 | 0.27 .. 0.21 | < 1.7e-5 (bisection floor) |
| 100 | 2 | 0.3466 | 1.7e-10 | 11.0 | 4.86 | 48.1 |
| 100 | 3 | 0.2310 | 1.1e-16 | 7.35 | 3.24 | 27.8 |
| 100 | 4 | 0.1733 | 1.9e-23 | 5.52 | 2.43 | 16.5 |
| 100 | 5 | 0.1386 | 1.5e-30 | 4.41 | 1.94 | 11.2 |
| 100 | 6 | 0.1155 | 6.7e-38 | 3.68 | 1.62 | 8.05 |
| 100 | 8 | 0.0866 | 1.4e-53 | 2.76 | 1.21 | 4.84 |
| 100 | 10 | 0.0693 | 2.6e-70 | 2.21 | 0.97 | 2.69 |
| 100 | 12 | 0.0578 | 9.0e-88 | 1.84 | 0.81 | 1.49 |
| 100 | 14 | 0.0495 | 6.5e-106 | 1.58 | 0.69 | 0.956 |
| 100 | 18 | 0.0385 | 3.5e-144 | 1.23 | 0.54 | 9.4e-5 (500 digits) |
| 300 | 2 | 0.3466 | 1.7e-10 | 33.1 | 20.4 | 320 |
| 300 | 3 | 0.2310 | 1.1e-16 | 22.1 | 13.6 | 144 |
| 300 | 4 | 0.1733 | 1.9e-23 | 16.5 | 10.2 | 96.4 |
| 300 | 5 | 0.1386 | 1.5e-30 | 13.2 | 8.1 | 68.8 |
| 300 | 14 | 0.0495 | 6.5e-106 | 4.73 | 2.91 | 15.0 |
| 100 | 1 | 0.6931 | 7.0e-5 | 22.1 | 9.7 | none (no failure for delta up to 4000 Delta/2) |

(The row gamma = 300, m = 20 failed its own delta = 0 check at 300 digits and is discarded.)

Readings (MEASURED).
1. delta* is a function of r to first approximation: delta* > Delta when r >~ 1, and delta* collapses faster than exponentially once r < 0.5
   (gamma = 30: 0.54, 0.16, 0.012, < 1.7e-5 for r = 0.55, 0.41, 0.33, 0.27).
2. A zero in the strip (delta <= 1/2) is detected only when r <= r_c with r_c between 0.5 and 0.7
   (gamma = 30: r = 0.55 gives delta* = 0.54; gamma = 100: r = 0.69 gives delta* = 0.96 and r = 0.54 gives
   delta* = 9.4e-5). The collapse below r_c is abrupt and depends on where gamma sits among the true zeros
   (30 is 0.42 from a zero, 100 lies mid-gap).
3. The unperturbed margin is at most the minimum LDL pivot, which falls by a factor 10^{-6.2} .. 10^{-9} per unit of m;
   the Toeplitz tail symbol gives lambda_min <= (2 pi/h) * 2 sech(pi^2/h) ~ (4 pi/h) e^{-pi^2/h}.

## 4. The density law and the horizon at fixed ratio. ARGUED from sections 1-3

Mechanism (PROVED part). By the proof of Theorem M, W_F(Lambda) for Blaschke Lambda is the existence of Q with
L + B_Lambda Q Caratheodory, where Q cancels the poles of L: at an off-line zero rho the residue of Q is -1/B_Lambda(rho).
For real nodes and rho = delta + i gamma, -log|B_Lambda(rho)| = delta * sum_nu 2 nu/(nu^2 + gamma^2) (1 + O(delta^2/gamma^2))
= delta/Delta_Lambda(gamma), and d/dt arg B_Lambda(it) = 1/Delta_Lambda(t). So route 13's resolution length is exactly
the inverse boundary phase density of the node Blaschke product; for the geometric lattice Delta = h gamma/pi (two-sided
sum; the one-sided lattice from nu = 1 differs by O(1/gamma)).

Law (MEASURED on the rows above, then extrapolated). An off-line zero inside the strip at height gamma is detected by
W(Lambda) iff

    Delta_Lambda(gamma) <= r_c * 2 pi / log(gamma/2 pi),      r_c in [0.5, 0.7],

i.e. iff the node phase density exceeds about 1.4 to 2 radians per mean zero gap. Below that density the interpolation
problem has room (many zeros per resolution cell) and the cone is blind; above it the margin and the threshold collapse
together. This replaces route 13's "T h ~ 7" (their heights 23..60 give T h = 2 pi^2 r_c/log(T/2 pi) = 4.4 .. 10.6).

Horizon. For Lambda_q, h = ln q:   T(h) log(T(h)/2 pi) = 2 pi^2 r_c / h  ~ (10 .. 14)/h.

Consequences (ARGUED; they rest on extrapolating a law measured for gamma <= 300):
- q = 4: T ~ 12 .. 13 (below the first zero); q = 2: T ~ 15 .. 18 (about the first zero; consistent with route 13's
  "none" for m = 1).
- To see past the verified height 3e12 one needs h <= (1.2 .. 1.7)e-13, i.e. q = 1 + 1.5e-13.
- At that ratio the margin is at most (4 pi/h) e^{-pi^2/h} = exp(-(6 .. 8)e13), and the number of nodes below T is
  log(T)/h ~ 2e14.
- Power family nu_k = k^p, p > 1: sum_k 2nu/(nu^2 + gamma^2) ~ gamma^{1/p - 1} pi/(p cos(pi/2p)), so the law reads
  gamma^{-(p-1)/p} pi/(p cos(pi/2p)) >= log(gamma/2 pi)/(2 pi r_c). The horizon is finite for every p > 1. At
  gamma = 3e12 and r_c = 0.6 the left side is 0.57 (p = 1.13), 6.6 (p = 1.06), 10.2 (p = 1.05) against 7.1, so the
  horizon passes the verified height only for p <~ 1.06. Route 13's p ~ 1.13 is the same law with a different constant;
  neither is certified, and for p this close to 1 the sum is dominated by nodes far above gamma, a regime the
  measurements do not cover.

Proof from primes. Every Pick entry on real nodes nu >= 1 is a prime-side quantity, and on the cone the prime side of
the quadratic form is -2 sum_n Lambda(n) n^{-1/2} A_g(log n), A_g the autocorrelation of g = sum c_nu e^{-nu t}. Lacunarity
of the exponents does not thin this sum (every n meets every node) and A_g(log n) has no sign, so Lambda(n) >= 0 gives no
term-by-term positivity; positivity is carried by the archimedean and pole terms exactly as in Weil's criterion. What a
certificate can do is evaluate. Its cost at horizon T is at least (number of nodes)^2 entries, each to pi^2/(h ln 10) ~
T log T/(4.6 r_c) decimal digits: more than T^3 digit-operations, against T^{1+o(1)} for verifying RH to height T
directly. So at fixed ratio the cone statement is a verified-height statement obtained at higher cost, and in the limit
it is RH (M2). There is no intermediate regime in which the cone is both certifiable and informative.

## 5. Cones aligned with log p. PROVED (M4) / MEASURED / ARGUED

The alignment dual to the lattice {k log p} of prime powers is the vertical progression Lambda_{p,a} of M4: the samples
L(a + 2 pi i k/log p) are the Fourier coefficients of the measure e^{-au} dm(u) folded modulo log p, where
L(w) = int e^{-wu} dm(u) on Re w > 1/2 and dm = archimedean density + pole term - sum Lambda(n) n^{-1/2} delta_{log n}. All
powers of p fold to the origin.

MEASURED (aligned.py, aligned_union.py, ctrl.py, ctrl2.py; normalised minimum eigenvalue, 40 to 80 digits). The DH
function has an off-line zero at delta = 0.3085, gamma = 85.699.

| node set | n | xi | DH |
|---|---|---|---|
| Lambda_{2,a}, |k| <= 24 (height 217), a = 1 (|k| <= 12), 0.55, 0.35, 0.1 | 25 / 49 | 6.3e-3 .. 7.6e-3 | 0.40 .. 0.63 |
| Lambda_{3,0.55}, |k| <= 20 | 41 | 5.5e-7 | 0.29 |
| union p <= 3, a = 0.55, heights 75..96 | 5 | 0.048 | 0.17 |
| union p <= 5, same window | 10 | 3.9e-5 | -6.2e-3 |
| union p <= 7 / p <= 13, same window | 16 / 33 | 2.1e-13 / 9.3e-48 | -0.033 / -0.16 |
| the p <= 5 set shifted by +2.0 / -3.0 | 10 | 1.6e-4 / 5.6e-5 | +1.6e-3 / +2.0e-3 |
| 14 equally spaced nodes on the same window | 14 | 5.7e-6 | +5.2e-3 |
| two nodes 0.55 + 85.6i, 0.55 + 85.8i | 2 | 6.6e-3 | -0.026 |
| two nodes 0.55 + 80.0i, 0.55 + 80.2i | 2 | 4.9e-3 | +0.012 |
| real lattices 4^k (k<=7), 2^k (k<=14), 2^{k/2} (k<=24) | 8/15/25 | 6.7e-4, 3.9e-9, 1.1e-21 | 1.1e-2, 4.8e-6, 6.0e-15 |

Readings.
1. A single aligned cone is blind to the DH zero for every a tried, including a = 0.1 < delta (nodes to the left of the
   zero). Its boundary phase density is periodic in height with mean log p (peaks log p * coth(a log p/2) at the nodes),
   and 1 - |B_{p,a}(rho)|^2 = (p^{2a} - 1)(1 - p^{-2 delta})/|p^a - p^{-rho}|^2, so it has no horizon in the sense of
   section 4; but the mean density log 2 = 0.69 is below the density of DH zeros at height 86 (r ~ 1 on average), and
   the nearest nodes are at heights 81.6 and 90.6.
2. The p <= 5 union detects DH with 10 nodes at Re s = 1.05, but the detection is not arithmetic: the set happens to
   contain 0.55 + 85.79i and 0.55 + 85.89i, next to the zero. Shifting the same set by 2 or 3 units removes the
   detection; two nodes at the zero suffice; two nodes at height 80 do not. Alignment with log p plays no role.
3. Two-node limit (CLASSICAL Schwarz-Pick): RH implies |L'(w)| <= Re L(w)/Re w on Pi, and DH violates this near
   0.55 + 85.7i. Unconditionally one has the same inequality with Re w - 1/2 in the denominator (L is Caratheodory on
   Re w > 1/2 because every zero has Re rho < 1/2 there). For Re w = a > 1/2 the two sides are absolutely convergent
   Dirichlet series plus digamma terms: |sum Lambda(n) log n n^{-s} - A'(s)| <= Re(A(s) - sum Lambda(n) n^{-s})/a.
   The right side grows like (1/2a) log t while the prime sums are bounded by their values at real s, so the inequality
   is automatic for log t >~ C/(sigma - 1)^2 and has content only in the region (sigma - 1)^2 log t <~ 1 (ARGUED). That is
   a zero-free-region statement in disguise (local pole excess 4 a delta^2/(a^2 - delta^2)^2 against a slack of order
   log t), i.e. an instance of round-1 Lemma L (floors are equivalent to half-planes), not a new input.
4. By M4, a finite set of primes gives a Blaschke set and the full set of primes gives RH. With phase density
   ~ theta(X) = sum_{p <= X} log p the law of section 4 puts the horizon of the p <= X union at
   log(T/2 pi) ~ 2 pi r_c theta(X) (ARGUED, not measured), with margins collapsing as in the last column above
   (3.9e-5, 2.1e-13, 9.3e-48 on one window).

So the answer to "do cones aligned with log p admit proofs from primes" is: their entries are prime sums in the region
of absolute convergence, and that is all. High blocks of a single aligned cone are positive for every
absolutely convergent Dirichlet series on Re s > 1 (archimedean log t against a bounded perturbation; ARGUED, and MEASURED for DH),
which is why they are blind. Where they are not blind they are local tests near a zero, i.e. verified height.

## 6. DH control

- Theorems BT and M hold for DH (it is in E). For DH they say: W_DH fails on every non-Blaschke node set. They prove no
  positivity for xi, so no step needs the Euler product, and none is claimed to use it.
- Proposition S uses the route-13 certificate, which is a numerical evaluation of xi'/xi; the analogous evaluation for
  DH also passes (table, last row). Positivity on separated lacunary cones is therefore Euler-blind (MEASURED).
- The measured law of section 4 is a statement about twins of xi in E; DH obeys it in the cases run (blind on every
  sparse set, detected by two adjacent nodes at its zero).
- The only place Lambda(n) >= 0 could enter is the sign of the prime side; section 4 shows it gives nothing on these
  cones.

## 7. Verdict

precise-obstruction, with three new proved statements.

PROVED: Theorem BT (xi'/xi(1/2 + w) is of bounded type in Re w > 0, unconditionally); Theorem M (W(Lambda) <=> RH exactly
for non-Blaschke node sets, real or complex; closes the conditional item of route 13); M2 (the family of geometric cones
with ratio -> 1+ is equivalent to RH); M4 (Blaschke product of a prime-aligned cone is the Moebius factor
(1 - p^a p^{-w})/(p^a - p^{-w}); all primes together are equivalent to RH inside Re s > 1); Proposition S (Lambda_4 does
not see an off-line quadruple at height >= 1000; given the route-13 certificate).

MEASURED: detection thresholds on 2^{k/m} at gamma = 30, 100, 300, stable under precision; critical ratio
r_c = Delta/gap in [0.5, 0.7]; DH passes every sparse cone tested and fails a two-node test at its zero.

OBSTRUCTION: at fixed ratio q = e^h a lacunary cone is a verified-height statement with horizon
T log(T/2 pi) ~ (10 .. 14)/h; reaching 3e12 needs h ~ 1.5e-13 with margin <= exp(-6e13); a prime-side certificate costs
more than T^3 against T^{1+o(1)} for direct verification; in the limit the statement is RH. Prime-aligned cones are
governed by the same phase-density law and add no arithmetic mechanism. The A6 loophole of NS-RIGID is closed in this
sense: it is a one-parameter interpolation between verified height and RH with no certifiable informative member.

OPEN: a proof of the density law (an upper and a lower bound for delta*(gamma, Lambda) in terms of Delta_Lambda and the
local zero gap). The natural route is the Q-residue form of section 4 plus Beurling-type sampling density.

No bound changes. RH open. No QED.

## 8. Three weakest steps

1. The density law and r_c are measured at gamma <= 300 with one added quadruple (delta allowed above 1/2) and then
   extrapolated twelve orders of magnitude. The horizon figures (h ~ 1.5e-13, p - 1 <~ 0.05..0.1) depend on it. The
   functional form (Delta against zero gap) is supported by the Blaschke-residue mechanism but not proved.
2. Proposition S inherits route 13's certificate (project-internal, one internal referee pass, benign non-interval inputs
   listed there) and the monotonicity of c on [1, inf); the constant 1000 is first-order and crude.
3. Section 5 reading 3-4 (automatic positivity of high blocks, horizon of prime unions) is argued, not proved; the
   measurements cover one window and one off-line zero of DH. Theorem M for DH also assumes DH (with gamma factor) lies in
   class E, which was checked by description, not written out.

Files (this directory): detect.py, grid_partial.out, g30.out, g100.out, g100b.out, g300.out, aligned.py, aligned.out,
aligned_union.py, union.out, ctrl.py, ctrl2.py, dh_real.py.
