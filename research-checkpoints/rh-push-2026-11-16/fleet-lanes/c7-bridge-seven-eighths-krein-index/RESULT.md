# c7-bridge-seven-eighths-krein-index: the anticausal Hankel block summed over a twist family, with the 7/8 theorem as input

Internal working note, 2026-11-18. Slug `c7-bridge-seven-eighths-krein-index`. Kind: combine (square-root lane x 7/8
mechanism). Not refereed. Nothing committed, pushed or posted. Files: `family_gap.py`, `family_gap.log` (numpy double,
one local run through `scripts/memcap.sh 8`, under 1 minute, largest array 24 MB). The compute server was not used.

Nothing here proves or refutes RH. No statement about any zero of zeta is made. No bound moves. The 7/8 theorem
(openai/math manuscript, unrefereed) is an input; statements using it are marked PROVED-rel 7/8.

Labels: PROVED (argument given here, author-checked only) / PROVED-rel X / CLASSICAL / MEASURED (double precision,
rational toys) / ARGUED / OPEN.

## Verdict

**Precise obstruction. The decisive test returns gain 0, and the family bound on the summed index is a density
statement. The pair bridge with family is closed.** Five statements.

1. **First lemma (PROVED, finitely many simple poles; MEASURED).** The single-cutoff trace tr Gamma_-* Gamma_- does not
   depend on c. The weights e^{-(beta - 1/2) c} belong to the gapped block Gamma_-^[c] = 1_{x < -c} S 1_{y > 0}:
   tr Gamma_-^[c]* Gamma_-^[c] = sum_{j,k} conj(r_j) r_k e^{-(conj z_j + z_k) c} / (conj z_j + z_k)^2, over the poles
   z_j of S in Re z > 0. The rank is the same for every c. As alpha -> 0 the poles tend to the off-line zeros and the
   weights are e^{-(beta_j - 1/2) c} e^{-(beta_k - 1/2) c}.
2. **No prime-side expression (PROVED-rel sq-hankel-traces Thm 4).** The prime-side value of every Gamma_-(chi) is zero
   before any sum over the family. The family sum against a positive semidefinite row Gram matrix G is an explicit
   positive form in the off-line data of all members. Orthogonal rows (G diagonal) remove the cross traces between
   members and keep the diagonal sum of the member traces; they do not remove the diagonal.
3. **Decisive test (PROVED for finite pole sets; PROVED-rel 7/8; MEASURED).** Decay rate in c of a member trace =
   2 min_j Re z_j. Decay rate of a positive-weight family sum = 2 min over members. The 7/8 theorem gives
   Re z_j < 3/8 for every member, at every height, with the same constant for a single member and for the family:
   gain 0. The family sum reads the pole nearest the line in the whole family; the 7/8 mechanism bounds the pole
   farthest from the line. The two quantities are at opposite ends of the pole set.
4. **Summed index (PROVED-rel sq-krein-index Thm A; MEASURED).** The sum of the bridge forms of the members with
   weights c_chi > 0 is the bridge form of the product prod F_chi^{c_chi}; its negative index is the number of
   distinct off-line zeros of the union. So "family sum of bridges" is the bridge of a Dedekind-type product and
   carries the member-wise count, nothing shared.
5. **Every window or density (PROVED-rel 7/8 for (a); ARGUED for (b)).** (a) Every-window, height-uniform: the tilted
   block of every member vanishes at tilt a >= 3/8, so the summed tilted index is 0 there. This is row G20 (W3 of
   h-seven-eighths-in-bridge) applied member by member; it is the input restated. (b) Below tilt 3/8 a bound on the
   weighted family sum of indices in a window bounds a member only by (family bound)/(weight of the member); the
   index is an integer, so a conclusion needs the family bound below one unit. For a family of unimodular twists
   n^{-i alpha_k} the family sum is exactly a sum over height translates of one member. This is MV-CAP and row P23.

No R4 was expected and none is present: every object here lives either on the axis (exact, valid for the controls)
or in the half-plane where the prime side converges, and the only transport between them is the residue theorem.

## 0. Plan; relation to closed rows

Read: BRIEF to the end; OBSTRUCTION_MAP section 2 (controls) and rows P23, G20, Q1-Q9, Q17-Q20, S1, Z15b;
`g-spinor-square-root` RESULT + REFEREE; `h-seven-eighths-in-bridge` RESULT; `sq-krein-index` (Theorems A, B);
`sq-hankel-traces` (Theorems 1-4, Proposition 5, controls); `c6-pair-probe-bridge-order2` (verdict, Lemma P);
`twist-rigidity` RESULT + REFEREE.

Not repeated: the inertia theorem (Q6), the single-member traces (Q1), the Cayley expansion (Q4), the wall dictionary
(G20), the Weil-form family identity (P23), the pair probe (c6).

New here: (i) the gapped block and its trace, which is where the cutoff weights live; (ii) the family sum against a
Gram matrix, with a lower bound by the diagonal sum; (iii) the two-sided rate bound and the statement that the family
rate is the minimum over members; (iv) the identification of the summed form with the bridge of the product and the
additivity of the index; (v) the comparison of what the 7/8 input bounds (largest real part) with what the summed
anticausal block reads (smallest real part, and a count).

Requirements, as planned: R1 and R3 were to come from the 7/8 input, R2 from an every-window bound on the summed
index. The test decides R2.

## 1. Setting

Member: F_chi(z) entire, zero set symmetric under rho -> -conj rho, L_chi = F_chi'/F_chi = sum_rho m_rho/(z - rho)
in symmetric order (class (H) of sq-krein-index; for a non-self-dual Hecke character take the product of the
completed functions of eta and conj eta, which is even and real; ARGUED, standard). alpha > 0,
S_chi = (1 - alpha L_chi)/(1 + alpha L_chi), unimodular on the axis. Z_+(chi) = poles of S_chi in Re z > 0 = roots of
1 + alpha L_chi = 0 there, residues r_j = 2/(alpha L_chi'(z_j)) (sq-hankel-traces Thm 1(b)). Kernel
k_chi(u) = (1/2 pi) int S_chi(it) e^{itu} dt; for finitely many simple poles k_chi(u) = -sum_j r_j e^{z_j u} on u < 0.

Family: a finite set of members, weights c_chi >= 0, or a positive semidefinite Hermitian matrix G = (G_{chi chi'}).
The intended family is {L(s, eta chi_m)}: the target eta of the manuscript twisted by the sextic residue characters of
the rows m. Every member is a finite-order Hecke L-function over Q(sqrt(-3)), so the 7/8 theorem applies to each
member with one constant (the manuscript's eps does not depend on eta; h-seven-eighths-in-bridge section 2).

Gapped block: Gamma_-^[c](chi) := 1_{(-inf, -c)} S_chi 1_{(0, inf)}, c >= 0. Gamma_-^[0] is the anticausal block.

## 2. First lemma: traces with the cutoff weights

**Lemma 1 [PROVED for Z_+ finite with simple poles].**
(a) The block Q_c S P_c with one cutoff has Hilbert-Schmidt norm independent of c (translation invariance of a
convolution operator; sq-hankel-traces section 1).
(b) tr Gamma_-^[c]* Gamma_-^[c] = int_c^inf (u - c) |k(-u)|^2 du
    = sum_{j,k} conj(r_j) r_k e^{-(conj z_j + z_k) c} / (conj z_j + z_k)^2 =: T(c).
(c) rank Gamma_-^[c] = |Z_+| for every c >= 0. The nonzero spectrum of Gamma_-^[c]* Gamma_-^[c] is that of
R* D_c* A D_c R conj(A), A_jk = 1/(conj z_j + z_k), D_c = diag(e^{-z_j c}).
(d) Two-sided bound. With A2 = (1/(conj z_j + z_k)^2) (positive definite) and x_j = Re z_j:
    lam_min(A2) sum_j |r_j|^2 e^{-2 x_j c} <= T(c) <= lam_max(A2) sum_j |r_j|^2 e^{-2 x_j c}.
Hence -lim (1/2c) log T(c) = min_j x_j.
(e) Zeros instead of poles. As alpha -> 0, each pole is z_j = rho_j - alpha m_j + O(alpha^2) at an off-line zero
rho_j = (beta_j - 1/2) + i gamma_j, r_j = -2 alpha m_j (1 + O(alpha)), and
    T(c)/(4 alpha^2) -> sum_{j,k} m_j m_k e^{-(beta_j - 1/2) c} e^{-(beta_k - 1/2) c} e^{i(gamma_j - gamma_k) c} / (conj rho_j + rho_k)^2.
(f) Isolated pair at distance beta: both singular values of Gamma_-^[c] equal
(alpha/sqrt(alpha^2 + beta^2)) e^{-w c}, w = sqrt(alpha^2 + beta^2) - alpha < beta.

Proof. (b): the kernel is k(x - y) on x < -c, y > 0; the set {y - x = u} has length u - c; insert the pole sum and
integrate (u - c) e^{-(conj z_j + z_k) u} over u > c. (c): Gamma_-^[c] = -sum_j r_j |a_j^c><b_j| with
a_j^c = e^{z_j x} 1_{x < -c} = e^{-z_j c} x (translate of a_j^0); the Gram matrices are D_c* A D_c and conj A, both
invertible. (d): T(c) = v* A2 v with v_j = r_j e^{-z_j c}; A2 is the Gram matrix of u^{1/2} e^{-z_j u} in L^2(0, inf),
positive definite for distinct z_j. (e): near rho_j, L = m_j/(z - rho_j) + h(z); 1 + alpha L = 0 gives
z - rho_j = -alpha m_j/(1 + alpha h); L' = -m_j/(z - rho_j)^2 + h'. Poles near axis zeros move to Re z < 0. (f): (d)
of sq-hankel-traces Thm 1(e) with D_c. QED

MEASURED (`family_gap.log` T1, T2): rational toy with one off-line quartet (beta = 0.3) and six axis zeros,
alpha = 0.7: quadrature of int (u - c)|k(-u)|^2 against the pole formula, c = 0, 1, 3, 6: 1.147736 / 1.147738,
0.957647 / 0.957649, 0.666704 / 0.666705, 0.387205 / 0.387205 (k from a 1.5e6-point transform of S, independent of the
poles; max |k_quad - k_pole| = 9.9e-6). Isolated pair, (alpha, beta, c) in 8 cases including beta = 3/8: agreement to
1e-7; at alpha = 0.01, beta = 0.375: Re z_j = 0.365133 (rho - alpha = 0.365), singular value 0.026657 (alpha/beta = 0.026667).

Davenport-Heilbronn instance from the measured pole of sq-hankel-traces (alpha = 0.3; z_j = 0.136468 + 85.724561i,
|r_j|/(2 Re z_j) = 0.6614): the one-pole term of the gapped singular value is 0.6614 e^{-0.1365 c} (PROVED-rel that
measurement, one pole only; DH has infinitely many, case OPEN).

## 3. The family sum and what orthogonality does

**Lemma 2 [PROVED, finite pole sets].** For G positive semidefinite,

    T_G(c) := sum_{chi, chi'} G_{chi chi'} tr( Gamma_-^[c](chi)* Gamma_-^[c](chi') )
            = sum_{(chi,j),(chi',k)} G_{chi chi'} conj(r_j^chi) r_k^chi' e^{-(conj z_j^chi + z_k^chi') c} / (conj z_j^chi + z_k^chi')^2  >= 0.

If the pole sets of different members are disjoint, T_G(c) >= (min_chi G_{chi chi}) lam_min(A2) sum_{chi,j} |r_j^chi|^2 e^{-2 x_j^chi c},
A2 taken over the union. For G = v v* it is the squared Hilbert-Schmidt norm of the gapped block of the symbol
sum_chi v_chi S_chi. For G diagonal (orthogonal rows) it is sum_chi G_{chi chi} T_chi(c).

Proof. Gamma is linear in the symbol; the cross trace is computed as in Lemma 1(b). The form is v*(G~ o A2)v with G~
the block inflation of G (positive semidefinite) and o the Schur product; lam_min(G~ o A2) >= (min diag G~) lam_min(A2)
(Schur product theorem in its eigenvalue form, CLASSICAL). QED

**Theorem A (no prime side; PROVED-rel sq-hankel-traces Thm 4).** For every member, in Re z > sigma_0(alpha) the
symbol is S_chi = -1 + sum_m g_m P_chi^m, P_chi^m = sum_n chi(n) Lambda^{*m}(n) n^{-1/2 - z} (chi completely
multiplicative, so the twist passes through the Dirichlet convolution powers), and the transform of S_chi along
Re z = sigma is supported on u >= 0. Therefore:
(i) the prime-side value of k_chi on u < 0 is 0 for each chi, and the prime-side value of T_G(c) is 0 for every G and
every c, before any use of orthogonality;
(ii) orthogonality acts on the causal side only: sum_chi v_chi S_chi has coefficients vhat(n) Lambda^{*m}(n),
vhat(n) = sum_chi v_chi chi(n), supported on the split locus of the family;
(iii) (i) and (ii) hold with Lambda replaced by any lambda with |lambda(n)| <= log n (Thm 4(c) there). The formula of
Lemma 2 is therefore independent of the prime data in the sense of twist-rigidity Theorem 4.

Answer to the assignment's question. There is no prime-side expression of the family sum of Gamma_-(chi) in which
orthogonality removes a diagonal. Two separate reasons. (1) Each term has prime-side value 0. (2) The trace is
quadratic and positive; for a positive quadratic family sum, orthogonality removes the cross terms between members
and keeps the diagonal (the large-sieve structure), and by Lemma 2 the Gram-weighted sum is bounded below by the
diagonal sum. In the manuscript the probe is linear in the target, the sum over rows selects the frequency row u = 1
(sixth powers), and the remainder is bounded by Cauchy-Schwarz. The bridge traces have no frequency variable dual to
the row index.

The signed version does have a prime side. For a fixed test a, <a, H_c(chi) a> is the Weil form of a one-sided test
(eq48), linear in the zero measure. Its family sum is twist-rigidity Theorem 1 (prime terms off the split locus are
removed) with the obstruction of Theorem 4 there. Section 5 identifies that sum.

## 4. Decisive test: the rate the family inherits from 7/8

**Theorem B [PROVED for finite pole sets; the 7/8 part PROVED-rel 7/8].**
(a) Single member: rate(chi) := -lim (1/2c) log T_chi(c) = min_j Re z_j^chi (Lemma 1(d)).
(b) Family, weights c_chi > 0: rate = min_chi rate(chi). Family with G = v v*, disjoint pole sets: the same minimum
over the members with v_chi != 0. A member with weight 1e-6 and the smallest rate fixes the family rate.
(c) Under the 7/8 theorem for every member: 0 < Re z_j^chi < b_rho <= 3/8 for every pole (W3(ii) of
h-seven-eighths-in-bridge: a pole lies in a half-disk of radius b_rho about the foot of an off-line pair). So every
mode weight satisfies e^{-2 Re z_j c} > e^{-3c/4}, for every member, at every height. Without the theorem the same
holds with 1/2 and e^{-c}.
(d) The bound in (c) is the same for one member and for the family. Summation over the family changes no exponent.

Proof. (a) is Lemma 1(d). (b): a sum of non-negative terms; Lemma 2 for G = v v*. (c), (d): quoted. QED

Reading. The 7/8 input bounds max Re z_j (the mode farthest from the line). It bounds the decay rate of the gapped
trace from above, that is, it bounds each mode's weight from below. It gives no upper bound on T(c) and no bound on
the number of modes. The rate of T_chi(c) and of the family sum is min Re z_j, which the input does not control
(nothing known prevents min Re z_j = 0+ if off-line zeros exist). The largest real part is visible on the other side:
the causal prime-side kernel grows like e^{(max Re z_j) u} (sq-hankel-traces Thm 4(d)), and "growth exponent of a
summatory function bounds the half-plane of analyticity" is the device by which Proposition 2.1 is height-uniform
(c6-pair-probe section 1; Landau-type, CLASSICAL). That device returns a supremum of real parts. It cannot return a
rank: for fixed max Re z_j the rank is arbitrary (Blaschke quotient, sq-hankel-traces Prop. 5).

MEASURED (`family_gap.log` T3, T4; alpha = 0.3; four rational toy members; off-line distances 0.36; 0.20 and 0.33;
0.05; none):

| member | min Re z_j | measured -d log T/(2 dc) on c in [60, 80] | two-sided bound of Lemma 1(d) |
|---|---|---|---|
| chi1 (beta = 0.36) | 0.198885 | 0.198715 | holds at c = 0, 5, 20, 60 |
| chi2 (beta = 0.20, 0.33) | 0.062918 | 0.062908 | holds |
| chi3 (beta = 0.05) | 0.004164 | 0.004164 | holds |
| chi4 (no off-line zero) | none | T = 0 | - |

Family sum with weights (1, 1, 1e-6, 1): local rate 0.0998, 0.0785, 0.0635, 0.0627, 0.0205, 0.004164, 0.004164 on
c in [0,5], [5,10], [20,25], [60,65], [120,125], [400,405], [1500,1505]: it passes through the chi2 rate and ends at
the chi3 rate. Rank-one Gram coupling with complex v over the 8 poles of chi1, chi2, chi3: lam_min(A2) = 6.27 > 0,
rate on [60, 80] = 0.0043 (still converging to 0.004164).

**Outcome of the test.** Single-member rate bound under 7/8: Re z_j < 3/8. Family-sum rate bound under 7/8:
Re z_j < 3/8. Gain 0. The inherited statement is uniform in height because the input is; it is row G20 for each
member. No bound on the summed index follows.

## 5. The summed form is the bridge of the product; the index adds

**Theorem C [PROVED-rel sq-krein-index Theorem A].** For weights c_chi > 0,

    sum_chi c_chi (L_chi(z) + conj L_chi(w))/(z + conj w) = (L_c(z) + conj L_c(w))/(z + conj w),   L_c = sum_chi c_chi L_chi,

and L_c is the logarithmic derivative of prod_chi F_chi^{c_chi}. Its number of negative squares on Re z > 0 is the
number of distinct points that are off-line zeros of at least one member. With S_c = (1 - alpha L_c)/(1 + alpha L_c),
rank Gamma_-(S_c) is the same number (finite case). If the members have no common off-line zero, it is
sum_chi kappa_chi.

Proof. L_c = sum over the union of zeros of (sum of c_chi m_rho^chi)/(z - rho), positive weights, symmetric set. The
proof of Theorem A of sq-krein-index uses the multiplicities only as positive weights in (2.1) (read here; integer
values are not used in the upper bound, the isotropic lemma or the lower bound). Theorem B there gives the pole count
for S_c by the same argument-principle contour. QED

MEASURED (`family_gap.log` T5; Pick matrices on 60 nodes, 5 on a circle of radius 0.03 about each right-half-plane
zero and 20 random): member indices 2, 4, 2, 0; sum of the four kernels: 8 negative eigenvalues, 8 poles of S_c in
Re z > 0; weights (1, 7.3, 0.01) on (chi1, chi4, chi3): 4 negative eigenvalues. On 60 real nodes the double-precision
Pick matrix does not resolve any negative eigenvalue (lowest -4.9e-14); that sub-test decides nothing.

Consequences.
- "Sum the bridges over the family" has two readings. Direct sum (independent tests per member): index
  sum_chi kappa_chi, traces of Lemmas 1-2, prime side 0. Sum of forms (one test for all members): the bridge of the
  product, for c = indicator of the characters of a cyclic field K the bridge of zeta_K; index again
  sum_chi kappa_chi over distinct zeros. Neither reading couples the members.
- The prime-free family identity of twist-rigidity (Theorems 1, 3) is the statement that the product form is
  non-negative on tests of support at most T with e^T below the least split prime power and below q. It restricts the
  test class, not the index: the full form has index sum_chi kappa_chi whatever the inert range is. A test class of
  bounded support is a finite stage (R4), and by twist-rigidity Theorem 4 the identity holds for arbitrary prime data.
- In the Cayley expansion of S_c the prime sum is P_c = sum_n chat(n) Lambda(n) n^{-1/2 - z}: orthogonality thins the
  causal kernel on 0 < u < T to its archimedean part. The anticausal side stays 0.

## 6. Every window or density

**Proposition D.**
(a) [PROVED-rel 7/8] For every member, every window (t_0, Dl) and every u < 0 with |u| Dl^2 >= 3/8:
I_chi(u) = -2 pi sum_{Z_+(chi)} r_j W(z_j) e^{z_j u} + remainder, |remainder| <= sqrt(2 pi) Dl exp(3u/8 + 9/(128 Dl^2))
at x = 3/8 (and exp(-u^2 Dl^2/2) at x = |u| Dl^2), since |S_chi| <= 1 on Re z >= 3/8 (sq-hankel-traces Thm 3 with
Delta_F <= 3/8). The tilted block of S_chi(a + .) vanishes for a >= 3/8 (W3). Summed over any family the tilted index
at a >= 3/8 is 0 in every window. This is height-uniform and it is the input.
(b) [ARGUED] For 0 <= a < 3/8 let kappa_chi(a; I) be the number of zeros of member chi with Re z > a and ordinate in
the window I. A family bound sum_chi c_chi kappa_chi(a; I) <= M gives kappa_chi(a; I) <= M/c_chi. The index is an
integer, so kappa_chi = 0 follows only if M < c_chi. Known family bounds (large sieve, zero-density estimates in the
conductor aspect) give M of the order of a positive power of the family size times the total weight: a proportion of
members, not an empty set. This is MV-CAP in the family variable.
(c) [PROVED, elementary] For the family of unimodular twists chi_k(n) = n^{-i alpha_k} of one member,
S_{chi_k}(it) = S(i(t + alpha_k)), Gamma_-(chi_k) is unitarily equivalent to Gamma_- by a modulation, and
sum_k c_k kappa_{chi_k}(a; I) = sum_k c_k kappa(a; I + alpha_k): the family sum is a sum over height windows of one
member. For this family every family bound is a density statement in height by construction.
(d) What would be needed for an every-window statement: a family identity that is not a sum of member-wise positive
terms, that is, a coupling between Gamma_-(chi) and Gamma_-(chi') for chi != chi'. By Lemma 2 the only coupling in the
traces is the cross Gram entry 1/(conj z_j^chi + z_k^chi')^2 between poles of different members, and it enters with a
positive semidefinite weight. No arithmetic relation between the off-line poles of different twists is known; the 7/8
mechanism does not provide one (its conclusion is member-wise, its family is the row index of the probe for one
target).

## 7. Controls

The identities of sections 2-5 use the functional equation and Hadamard only. The single arithmetic input is the
imported 7/8 theorem, whose failing steps on the controls are tabulated in h-seven-eighths-in-bridge section 4 and
`c4-thin-twist-control-78`. No new step of this lane fails on a control.

| Control | Lemma 1, Lemma 2, Thm B(a,b), Thm C | 7/8 input (Thm B(c), Prop. D(a)) | Named step |
|---|---|---|---|
| DH | hold; one measured pole z_j = 0.1365 + 85.72i (alpha = 0.3), gapped singular value 0.6614 e^{-0.1365 c}; infinitely many poles in total (trace formula OPEN in that case); the full-group twist family of twist-rigidity section 5 gives a positive prime-free family form while the member has off-line zeros | false (zeros with Re s > 1): rates are not bounded by 3/8 | signal extraction of the manuscript: target not completely multiplicative (h-lane Lemma 4.1). No step of this lane |
| THIN (zero at b in (7/8, 1), no functional equation) | not formulable: S is not unimodular on the axis, H_c is not a Krein square with the involution J. As a completely multiplicative target the Cayley expansion and "prime-side anticausal kernel = 0" hold verbatim | false (zero at b > 7/8) | Poisson dual uniform in the modulus (periodicity of the twists), `c4-thin-twist-control-78`. No step of this lane |
| U (unimodular completely multiplicative twist) | for n^{-i alpha}: unitarily equivalent blocks, same traces and index (Prop. D(c)); general U: no functional equation, not formulable on the axis | holds for n^{-i alpha} (a height translate), not available otherwise | none; U shows that a family sum can be a height average |
| Backward heat (tau < 0) | Lemma 1 and Thm C hold (toy E of sq-hankel-traces: tau = -0.05 gives 2 poles, trace 1.753); no Dirichlet series, so no twist family and no Theorem A | false: zeros leave every strip (b-escape-law), rates unbounded | not formulable as a family |
| EA = zeta(s+a) zeta(s-a) | hold; EA is the product form of Theorem C for the two shifted factors; its index in a window is the number of zeros of zeta in the window (all of them are off-line for EA); mode rates <= a | returns Re s <= 7/8 + a (non-unitary constituent) | unitarity of the target (h-lane table) |

Consequence for R3: the geometric side holds for every control with a functional equation; the arithmetic side is
the imported theorem. The combination adds no step at which a control fails.

## 8. Pivot (once): the causal side

After the test, the adjacent idea is the side on which the 7/8 input does act: the causal prime-side kernel
T_chi(u), u > 0, whose growth exponent is max_j Re z_j^chi (sq-hankel-traces Thm 4(d)).
- Family sum: sum_chi v_chi T_chi has Dirichlet-type coefficients vhat(n) Lambda^{*m}(n) (Theorem A(ii)), so
  orthogonality does act here and removes every n off the split locus.
- Growth exponent of the family sum: at most max_chi max_j Re z_j^chi, with equality when the poles of different
  members are distinct (finite exponential sums with distinct exponents are linearly independent). Under 7/8 this is
  < 3/8; for a single member it is < 3/8. Gain 0 again, because the manuscript's constant is already independent of
  the target.
- The object is the Cayley transform of the logarithmic derivative of the product (Theorem C): the statement
  "growth exponent <= a" for it is the zero-free half-plane of the product, which is the conjunction of the
  member-wise statements.
The pivot produces no new object. Stopped here.

## 9. Requirement flags

| Flag | Value | Evidence |
|---|---|---|
| R1 multiplicativity essential | not established | The new statements (Lemmas 1-2, Theorems B(a,b), C) use no arithmetic. Theorem A holds for every sign twist. Multiplicativity is present only inside the imported 7/8 theorem |
| R2 height-uniform, every window | not established for a new statement | Prop. D(a) is every-window and height-uniform, and is the input restated (row G20). The summed index below tilt 3/8 has only family-mean bounds (Prop. D(b), (c)) |
| R3 fails for every control at a structural step | not established | Section 7: no step of this lane fails on DH, heat or EA; the failing steps are those of the input |
| R4 passage to the critical line | not established; not expected | Prime side is 0 on u < 0 (Theorem A); the transport between Re z > sigma_0 and the axis is the residue sum (sq-hankel-traces Thm 4(d)); support-restricted family positivity is a finite stage |

Score for the campaign metric: 0 new requirements. Closure: "pair bridge with family" (bridge Krein index x 7/8
family) is closed by Theorems A, B, C and Proposition D.

## 10. Three weakest steps

1. **Finite pole sets.** Lemma 1, Lemma 2 and Theorem B are proved for finitely many simple poles in Re z > 0. For
   infinitely many (DH; any hypothetical infinite off-line set) the pole expansion of k on u < 0 needs a summability
   statement that sq-hankel-traces left open; the rate becomes an infimum and can be 0, and lam_min(A2) can tend to
   0. The windowed form (Prop. D(a)) does not need this. Disjointness of the pole sets of different members
   (Lemma 2 lower bound, Theorem B(b) for G = v v*, the pivot) is an assumption, not a theorem.
2. **Which family.** The members were taken to be the L-functions L(s, eta chi_m). In the manuscript the rows are
   sums of cubic theta coefficients twisted by chi_.(m), not L-functions, and the manuscript was not re-read here
   (the description of Proposition 2.1 is taken from h-seven-eighths-in-bridge and c6-pair-probe). A bridge built on
   the Dirichlet series of a row (a metaplectic object with a functional equation of a different shape) was not
   formed; whether it has a unimodular symbol on some axis is not known to this lane.
3. **Imported proofs and unrun controls.** Theorem C relies on reading the proof of sq-krein-index Theorem A with
   non-integer positive weights (unrefereed lane; the product F^{c} is not entire for non-integer c, only its
   logarithmic derivative is used). The reduction of non-self-dual members to class (H) is ARGUED. The THIN and heat
   rows of section 7 are by inspection of hypotheses; only rational toys and one quoted DH pole were computed.
   Proposition D(b) quotes the form of family zero-density bounds without a specific theorem.

## 11. Next step

None on this object. The one item this lane leaves that is not a restatement is weakest step 2: the bridge of a
single row series B_m (if its completed Dirichlet series has an axis of unimodularity). It is a question about the
cubic theta functional equation (manuscript Prop. 5.1), not about the Krein index.
