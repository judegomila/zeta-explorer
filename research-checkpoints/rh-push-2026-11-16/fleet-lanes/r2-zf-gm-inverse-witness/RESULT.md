# r2-zf-gm-inverse-witness: Guth-Maynard expansion for the inverse witness over the sextic twist family

Date 2026-11-16. Internal working note, not refereed. Round 2 of `../zf-large-values/`.
**Verdict: precise obstruction. No new count, no new abscissa.** 7/8 stays the unconditional abscissa (openai/math
manuscript, unrefereed). Everything about the Xu-Sang system (arXiv:2610.15291, binding bin 0.469345, ceiling
0.8748866) is an **unrefereed import**. RH open, no QED.

Labels: PROVED (here, elementary) / PROVED-rel X (relative to the named source, taken as stated) / CLASSICAL /
MEASURED / HEUR / OPEN.

Files (all in this directory): `checks.py`, `checks.out` (exponent arithmetic); `sieve_norm.py`, `big.json`, `big.log`,
`analyse.py`, `analyse.out`, `fit3.py`, `fit3.out` (operator norms, run on the motherbox, 20 min, 8 threads);
`price_levers.py`, `price_*.log` (pricing; a copy of the prior note's LP model with two extra count models);
`dl/gm.pdf`, `dl/gm.txt` (Guth-Maynard, arXiv:2405.20552, for the definitions of S1, S2, S3).

## 0. Plan: what is new relative to the atlas, the prior notes and the walls

Round 1 and its referee left four items: (a) the C1-C4 table was read from a summary; (b) the reduction of
"coefficient-specific Guth-Maynard on M_r" to TRO6 was asserted; (c) sextic (KD)^{2/3} sharpness was assumed by
analogy with the cubic case; (d) no expansion was written. This note does (a)-(d) and reprices. New here:

1. the certificate table checked against the manuscript text, with one unsupported row found (C4);
2. the exact cubic-trace expansion for the sextic family, the two inequalities a Guth-Maynard argument would need,
   and the size of the gap for each, in exponents;
3. a derivation that the expansion contains no Gauss sum and no theta coefficient, so the missing input is not TRO6;
4. a direct computation of the sextic, cubic and quadratic matrix norms up to K = 2*10^5 with the Gauss-sum test;
5. the observation that a Guth-Maynard count for the bare inverse witness is worth 0 at the binding configuration;
   the whole hypothetical gain sits in witness x prime slots.

Walls: every statement below is about row counts and holds for arbitrary coefficients (no Euler product), so it
cannot give zero information by itself (DH, section 6). No mean value is used to certify an every-row statement.

## 1. Check of "S/n <= delta" and of C1-C4 against Sections 8, 9, 17-19 (`~/lean-deps/qrh-verify/paper.txt`)

Notation: U family size, witness length U^n, squared size of the centrally normalised polynomial U^S.

| item | manuscript location | result |
|---|---|---|
| inverse witness: \|M_r\|^2 >= U^{delta r - eps} | Prop 8.3, (8.4), lines 3557-3572 | CONFIRMED |
| upper bounds \|M_r\|^2 <= U^{delta r + eps}, \|S_m\|^2 <= U^{delta min(m,1-m) + eps} | Lemma 8.2, (8.1)-(8.2), line 3485 | CONFIRMED. So S/n = delta for M_r (saturated), <= delta for S_m |
| slot amplitude g_i <= delta/2, product of selected slots >= U^{2qz}, q <= delta/2 | Lemma 19.1 and section 19.1-19.2, lines 11004-11090 | CONFIRMED. Slot spike per unit length 2q <= delta |
| products and powers | arithmetic | S/n is a length-weighted mean of ratios <= delta. **S/n <= delta holds for every counted polynomial. PROVED-rel manuscript** |
| C1: 1 - delta r - 2qz, z <= min((1-r)/2, (3-2r)/8) | Lemma 17.1 (r + 2z < m, 2r + 8z < 3m at m = 1), lines 6957-6975; Prop 19.2 | CONFIRMED. The manuscript uses z_M = (1-r)/2 only for r >= 23/37 (Xu-Sang: r >= 3/5), where the second condition is automatic |
| C2: e(r) - delta r, e(r) = max(1, (1+5r)/6) | Lemma 17.6, (17.88), (19.3) | CONFIRMED. In particular the mean-value count 1 - delta r holds for the bare M_r for every r <= 1 |
| C3: 1 - 2 delta m - 2qz, z <= (1-2m)/(6 kappa) | Lemma 18.1 case 2, (19.2) | CONFIRMED |
| C3': 1 - delta m - 2qz, z <= (1-m)/(6 kappa) | Lemma 18.1 with n_2 = 0 | Not used by the manuscript or by Xu-Sang. It follows from the lemma as stated (the second factor is a bounded nonzero constant). PROVED-rel |
| C4: "sextic large sieve on M_r^k or S_m^k, count 1 - k delta (length), for k x length <= 1/2" | Lemma 9.1, Prop 9.2 | **NOT SUPPORTED as written.** Lemma 9.1 needs squarefree columns and row-independent coefficients. It applies to M_r (Mobius-supported), giving Prop 9.2: max(1, 2(1+r)/3) - delta r. It does not apply to M_r^k (k >= 2) or to S_m without an extension to non-squarefree columns |

Effect of the C4 defect: none on any number used. For M_r, C2 gives 1 - delta r for all r <= 1. For S_m and S_m^2,
Lemma 18.1 with no slots gives 1 - delta m and 1 - 2 delta m. Powers k >= 3 need k m <= 1/2, and at both binding
configurations m* > 0.40. The proved counts (Prop 19.2; Xu-Sang Prop 4.1, value 0.590332 at the binding bin) do not
use C4; the row only appears in the prior note's minimax, where removing it cannot lower the count. The manuscript's Prop 19.2 also carries a loss Delta/4, absent from
the table; Xu-Sang Prop 4.1 states the count with kappa directly, without it.

Referee point confirmed: coefficient-specific mean-value counts exist at n > 1/2. For the bare inverse witness the
count 1 - delta r is proved for all r <= 1. It is a second moment over the **full** element family q_u <= U
(Lemma 17.1), then amplified (Lemma 17.6).

## 2. The Guth-Maynard expansion for the sextic family

**Setup.** Fix one presentation (nu, sign), one dyadic length D = U^r, one profile W >= 0. B is a set of
sixth-power-free rows, one per ideal, q_u ≍ U, R = #B = U^rho. Put

  b_n = mu(n) nu(n) W(q_n/D)^{1/2},  A = (W(q_n/D)^{1/2} chi_n(u))_{u in B, n squarefree},  P = A b,  P_u = D^{1/2} M_u.

||b||^2 <= cD. On B, D U^{delta r - eps} <= |P_u|^2 <= D U^{delta r + eps} (section 1). Let

  H = A A^* = Lambda + E,  h(u,u') = sum_n W(q_n/D) chi_n(u) conj(chi_n(u')),  Lambda_u = h(u,u) <= cD,  E = off-diagonal part.

**(E1) Zero frequency = diagonal. PROVED.** n -> chi_n(u) conj(chi_n(u')) = chi_n(u u'^5). For sixth-power-free u, u'
this is trivial on ideals prime to uu' only if v_p(u) + 5 v_p(u') ≡ 0 mod 6 at every prime, i.e. (u) = (u'). So with
one row per ideal, h(u,u') has a polar (zero-frequency) term exactly on the diagonal. In the t-aspect this is the
T^eps-separation of Guth-Maynard Lemma 4.5.

**(E2) Halasz step. CLASSICAL.** ||P||^2 = <b, A^* P> <= ||b|| <P, H P>^{1/2}, hence

  R U^{delta r - eps} <= c^2 D + c <P, E P>/||P||^2 <= c^2 D + c lambda_max(E_B).   (2.1)

**(E3) Cubic trace. PROVED** (from Guth-Maynard Lemma 4.2, CLASSICAL). F = E + cD·I is positive semidefinite
(H >= 0, Lambda <= cD) with constant diagonal, so tr F = cDR and
tr F^3 - (tr F)^3/R^2 = 3cD tr(E^2) + tr(E^3). Lemma 4.2 of Guth-Maynard gives

  lambda_max(E_B) <= 8cD + 8 (S2 + S3)^{1/3},
  S2 = 3cD sum_{u != u' in B} |h(u,u')|^2,   S3 = sum_{u1,u2,u3 pairwise distinct in B} h(u1,u2) h(u2,u3) h(u3,u1).   (2.2)

In Guth-Maynard's labelling (their (5.5)): the all-zero frequency is the diagonal R(cD)^3 and cancels; S1 (exactly one
nonzero frequency) is tr(Lambda^2 E) = 0 identically; S2 (exactly two) is the Hilbert-Schmidt term; S3 (all three
nonzero) is the triple product. (2.1) and (2.2) give: either R <= C D U^{-delta r + eps} (exponent r(1-delta), the
term N^{2-2sigma}), or

  R^3 U^{3 delta r - 3 eps} <= C (S2 + S3).   (2.3)

**(E4) What a count rho < rho_0 := 1 - delta r needs.** By (2.3) it suffices that for every B with #B = U^rho:

  (HB6)  mean over pairs u != u' in B of |h(u,u')|^2 / D  <=  U^{rho + 3 delta r - 2r - eps},
  (T6)   S3 = tr(E_B^3)  <=  U^{-eps} R^3 U^{3 delta r}.

(HB6) is the analogue of Heath-Brown's theorem (Guth-Maynard Theorem 1.6, used for their S2); (T6) is the analogue
of their Proposition 11.2.

**(E5) Size of both terms with proved inputs. PROVED-rel Lemma 9.1** (squarefree rows; the powerful part is handled
as in Prop 9.2). ||A_B||^2 <= ||A||^2 << U^eps (U + D + (UD)^{2/3}) = U^{2(1+r)/3 + eps} for 1/2 <= r <= 2. Then
sum_{u'} |h(u,u')|^2 <= ||A||^2 Lambda_u, so mean |h|^2/D <= ||A||^2/R, and |S3| <= ||E|| ||E||_HS^2.
At delta* = 0.469345 (`checks.out`):

| r | rho_0 = 1 - delta r | Guth-Maynard-shape count | (HB6) allows, at rho_0 | proved | excess | count from (2.1) + Lemma 9.1 |
|---|---|---|---|---|---|---|
| 0.7605 | 0.6431 | 0.5903 | U^{0.193} | U^{0.531} | U^{0.338} | 0.8167 |
| 0.8000 | 0.6245 | 0.5690 | U^{0.151} | U^{0.576} | U^{0.425} | 0.8245 |
| 0.8333 | 0.6089 | 0.5511 | U^{0.116} | U^{0.613} | U^{0.498} | 0.8311 |
| 0.8700 | 0.5917 | 0.5753 | U^{0.077} | U^{0.655} | U^{0.578} | 0.8383 |

So **both S2 and S3 exceed the mean-value count with proved inputs**; S2 already by U^{0.34} to U^{0.58}. The
cubic-trace route gives a worse count than (2.1) alone, and (2.1) with Lemma 9.1 gives 0.82-0.84, far above the
count 1 - delta r that Lemma 17.1 already proves with the actual coefficients.

**(E6) Under pairwise Lindelof the obstruction is S3 alone. PROVED (arithmetic).** Assume |h(u,u')| << D^{1/2} U^eps
for all u != u' (this is GRH-strength for L(s, chi_{u u'^5})). Then (HB6) holds with room (allowed exponent > 0 in the
table). But |S3| <= R^3 D^{3/2} and (T6) asks for R^3 U^{3 delta r}; since delta* < 1/2 this needs a further saving
of U^{3r(1/2 - delta)} = U^{0.070}...U^{0.080} from sign cancellation in the triple products, for every B. Equivalently
(2.1) with ||E_B|| <= R D^{1/2} gives no count when delta < 1/2. So **even GRH for all pair characters does not give
a gain at the Xu-Sang bin**; a genuine Guth-Maynard-type cancellation in S3 is required. Random-matrix size
||E_B|| ≈ (RD)^{1/2} = U^{0.72} would give it with margin (needed: U^{1 - eta}, eta <= 0.058). That is a heuristic
level, not a proved or conjectured-in-print statement.

**(E7) Why Guth-Maynard's treatment of S3 has no analogue. CLASSICAL (functional equation).** Their S3 analysis
starts by Poisson summation in n, which replaces length N by T/N (at T = N^{6/5}: N^{1/5}), because t - t' stays
in [-T, T]. Here chi_n(u u'^5) is a Hecke character in n of conductor norm ≍ U^2 for coprime rows, and D = U^r < U.
The dual length is U^2/D = U^{2-r} >= U^{1.107} > D. For squarefree pairwise coprime rows in fixed ray classes mod 36,

  h_D(u,u') = (D/U) · eps(cls u, cls u') · g~(u) conj(g~(u')) · conj(h^dual_{U^2/D}(u,u')) + (squarefree-sieve remainder),

with g~ the normalised sextic Gauss sum and eps a fixed bicharacter of the classes (twisted multiplicativity of Gauss
sums plus sextic reciprocity). The unitary diagonal factors g~(u) cancel in |h|^2 and in every cyclic product
h(u1,u2)h(u2,u3)h(u3,u1). So S2 and S3 at length D equal, up to (D/U)^2 resp. (D/U)^3 and class signs, the same
sums at the longer length U^{2-r}. Poisson lengthens, and Guth-Maynard sections 7-11 (the function R(v) on short
dual sums, additive energy of W) have no starting point. This is the "T_eff = U^2" statement of round 1, now
derived: with T = U^2 the Guth-Maynard shape gives a count >= 1.10.

**(E8) The coefficient-specific form.** Keeping the Mobius coefficients means stopping at (2.1) before taking the
operator norm. The exact quantity is

  <P, E P> = sum_n W(q_n/D) |sum_{u in B} conj(P_u) chi_n(u)|^2 - sum_u Lambda_u |P_u|^2 = sum_{u != u'} conj(P_u) h(u,u') P_{u'},

and a count rho_0 - eta is equivalent, within this argument, to

  **(MI)  sum_{u != u' in B} conj(M_u) M_{u'} h_D(u,u')  <=  U^{1 - eta - eps} sum_{u in B} |M_u|^2**  for every admissible B.

Since |M_u| is flat on B (saturation), (MI) is a bound for sum_{u != u'} e^{i(theta_{u'} - theta_u)} h(u,u') with
theta_u = arg M_u. Nothing in the proof constrains B or the phases beyond the zero that produced the witness, so the
usable sufficient condition is the coefficient-free one:

  **(GM6[r, delta, eta])  for every B of sixth-power-free rows q_u ≍ U with #B <= U^{1 - delta r}:  lambda_max(E_B) << U^{1 - eta + eps}.**

Status of the exponent of lambda_max(E_B): proved min(1 - delta r + r, 2(1+r)/3) (1.222 at r = 5/6); needed 1 - eta
with eta = (delta - 2/5) r for r <= 5/6 to reach the Guth-Maynard shape (0.058 at r = 5/6); pairwise Lindelof gives
1 - delta r + r/2 = 1.026. The cancellation that would remove the excess is between **rows** (signs of h over B x B
and over triangles), not inside the coefficient sequence mu(n). The Mobius coefficients enter (MI) only through the
phases theta_u.

For the full family, Lemma 17.1 says ||A b||^2 << U^{1+eps} ||b||^2 for r < 1: the Mobius column vector is not
aligned with the extremal column vectors of section 4. That is a statement about b under A. (MI) is a statement about
P under A_B^*, on a subset; the form is not monotone in B, and Lemma 17.1 gives nothing for it.

## 3. Classification of the missing input

**Not TRO6-natural.** TRO6-natural is a power saving for sums over the full lattice of rows m of sextic theta
coefficients against cubic rows (`../tro6-sieve/RESULT.md`). Theta coefficients arise from Poisson summation in the
**row** variable (complete sums give Gauss sums g~(n), whose Dirichlet series has the theta residue). In (2.2), (MI)
and (GM6) the row sums run over an arbitrary thin set B and are never completed; Gauss sums appear only as root
numbers in (E7) and cancel. So the round-1 sentence "the large-values route reduces to the TRO6-type input" is
**withdrawn**. Precisely:

* TRO6-type input is **not sufficient**: it can only improve full-family estimates. In the window no full-family
  estimate helps (PROVED arithmetic, `checks.out`): the second moment of M_r is already at exponent 1 (C2); a
  mean-value-optimal moment of M_r^k, k >= 2, gives k r (1 - delta) >= 1 - delta r for r >= 1/(2 - delta) = 0.653;
  and a coefficient-free full-family norm is >= U^{17/16} (section 4), count >= 17/16 - delta r.
* TRO6-type input is **not necessary**: (GM6) contains no Gauss sum.
* (GM6) is a different statement: a large sieve for sextic residue symbols restricted to arbitrary sparse row sets,
  with the gain coming from sign cancellation among pair sums of conductor U^2 and length U^r, r < 1. It is stronger
  than pairwise Lindelof in the direction that matters (E6). No method known to this note proves it for any eta > 0,
  or even proves lambda_max(E_B) << U^{1+eps} (eta = 0) for r > 1/2.

**Exact missing inequality.** For the polynomial "inverse witness x selected prime slots" of total length U^r, with r in
the capacity range [0.7457, 0.8728] of the binding configuration and inside the window (0.7605, 0.8927):

  lambda_max(E_B) << U^{0.5903 + 0.4693 r - eps'}  for every admissible B   (0.981 at r = 5/6; 1.000 at r = 0.8728).

This is (GM6) with eta = 0.4097 - 0.4693 r + eps' measured against U^1. Proved exponent: 2(1+r)/3 (1.222 at r = 5/6).
The Guth-Maynard shape would be 1 - (delta* - 2/5) r = 0.942 at r = 5/6.

The one full-family lever in the window that is not excluded is the slot capacity of Lemma 17.1 (r + 2z < 1 instead of
the natural r + z < 1), which at x = 1/2 would give 1 - delta. It is a different question (prior note, "natural
capacities") and was not studied here.

## 4. Is the sextic (KD)^{2/3} term sharp at these lengths?

**Not settled. Three facts.**

**(N1) Lower bound of size K^{5/6} D^{1/3}. PROVED-rel [Xu26], unverified.** Xu-Sang (introduction, lines 97-105 of
`../bypass-78/dl/2610.15291.txt`) state that a companion manuscript (Y. Xu, "A sharp lower bound for the sextic large
sieve", unpublished, October 2026; not available to this note) proves a lower bound of scale A^{5/6} B^{1/3} for the
squared norm of the squarefree sextic matrix over Z[omega] in the range B^{16/11 + d} <= A <= B^{2 - d}. With
A = K = U this covers D <= U^{11/16}, not the window. The norm is monotone in D (a column submatrix), so

  ||A(U, U^r)||^2 >= U^{17/16 - eps} for every r >= 11/16.

So relative to [Xu26] the coefficient-free norm is not mean-value-optimal anywhere in the window, whatever the
truth about (KD)^{2/3}. Heuristic source of the scale: c_n = conj(g~_6(n)) gives row values
sum_n g~_6(u, n) ≈ D^{2/3} q_u^{-1/12} tau~(u) (pole of the Kubota series at 1 + 1/6, theta coefficient tau~), and
K · D^{4/3} K^{-1/6} / D = K^{5/6} D^{1/3}. The same computation for order 3 gives (KD)^{2/3} (Dunn-Radziwill).

**(N2) Direct computation. MEASURED** (`big.json`, `analyse.out`, `fit3.out`). Matrix chi_n(k) = (k/n)_6^j, j = 1, 2, 3
(orders 6, 3, 2), primary squarefree k, n prime to 6, q_k <= K, q_n <= K^r; K = 3125 ... 200000 (56434 rows),
r in {0.5, 0.6875, 0.76, 0.8333, 0.89} and r = 1 up to K = 50000. Gauss sums were computed exactly for primes and
by twisted multiplicativity, checked against brute force on 12 composite n (error 2e-15). "Gauss span" = span of
conj(g~) restricted to each of the 108 classes mod 36.

| r = 0.8333 | lambda_1/#rows at K = 3125 | at K = 200000 | log-slope of lambda_1 in K (K >= 12500) | top eigenvector inside Gauss span (random level 0.12) | lambda_1/lambda_2 |
|---|---|---|---|---|---|
| order 3 (control) | 3.21 | 6.88 | 1.188 (Heath-Brown term: 1.222) | 0.982 | 1.48 |
| order 6 | 2.29 | 2.82 | 1.056 (theta: 1.111; (KD)^{2/3}: 1.222) | 0.907 | 1.008 |
| order 2 (control) | 1.98 | 1.94 | 1.013 (mean value: 1) | 0.135 | 1.05 |

Other lengths, order 6, log-slope of lambda_1: 1.024 (r = 0.6875), 1.057 (0.76), 1.060 (0.89), 1.085 (1.0); against
theta 1.062, 1.087, 1.130, 1.167 and (KD)^{2/3} 1.125, 1.173, 1.260, 1.333. Order 3: 1.086, 1.135, 1.227, 1.292.
Two-term fits lambda_1 = a (sqrt(#rows) + sqrt(#cols))^2 + b #rows^p #cols^q over all r > 1/2, K >= 12500: order 3
selects (KD)^{2/3} (rms 1.7 % against 22 % for the theta shape; free fit p = 0.675, q = 0.70). Order 6: theta shape
4.0 %, (KD)^{2/3} shape 5.6 %, free fit p = 0.875, q = 0.45 (2.1 %).

Reading: (i) the cubic control reproduces the Dunn-Radziwill picture (extremal vector = cubic Gauss sums, 2/3-law)
at these sizes; (ii) for order 6 the norm grows faster than the mean value, the top eigenvector is a Gauss-sum
vector (0.91, against 0.12 for a random vector and 0.09 for the unconjugated g~), and the growth is 3 to 4 times slower
than in the cubic case at the same sizes; (iii) there is no isolated top eigenvalue for order 6 (a near-degenerate
cluster), and the exponent is not resolved: the data are pre-asymptotic (the expected excess K^{(2r-1)/6} is
only a factor 1.6 over the whole range). The data are consistent with K + D + K^{5/6} D^{1/3} and do not show
(KD)^{2/3} with a constant comparable to the cubic one. They do not exclude it at larger K.

**(N3) No improvement proved.** An upper bound K^{5/6} D^{1/3} in place of (KD)^{2/3} for order 6 is OPEN. It would
not change any count used here: at r in the window it gives 5/6 + r/3 - delta r >= 0.713 > 1 - delta r.

Restricted to B the Gauss-sum vector is not an obstruction to (GM6): its contribution to ||A_B||^2 is about
R D^{1/3} U^{-1/6} <= U^{0.73} for flat theta coefficients, below U^{1 - eta}. (HEUR; no bound on individual sextic
theta coefficients is used.)

## 5. Pricing in the scalar system (Xu-Sang system, unrefereed import; prior LP model, HEUR)

`price_levers.py` is the prior note's LP model with two added count models. Single-bin minimax at (delta*, x = 1/2)
(`price_bin.log`) and system value (`price_*.log`):

| count model | count at the binding bin | B |
|---|---|---|
| Xu-Sang certificates (proved-rel imports) | 0.590332 | 0.8748866 |
| Guth-Maynard shape on the **bare** inverse witness M_r only | 0.590332 | 0.8748866 (difference 6e-8, below grid accuracy) |
| Guth-Maynard shape on inverse witness x selected slots (C1 only) | 0.564875 | 0.8744074 |
| Guth-Maynard shape on every certificate (prior note, reproduced) | 0.564875 | 0.8744074 |

* **This note proves no count, so the proved gain is 0.**
* The bare witness is outside the window at the binding configuration: r* = 0.74570 < 0.7605, Guth-Maynard-shape
  count 0.5983 > 0.5903. A gain needs the product M_r x slots at total length ≈ 5/6 (inside [0.7457, 0.8728]). That
  polynomial has prime-slot factors with coefficients fixed across rows, so (GM6) applies to it unchanged, with
  columns that are no longer squarefree.
* If (GM6) held at full Guth-Maynard shape for that product, the model value is B = 0.8744074: 4.8e-4 below the
  Xu-Sang ceiling, 5.9e-4 below 7/8. The plain-witness certificates contribute nothing extra. The envelope of the
  prior note (7.2e-4 below 7/8, any count improvement confined to delta >= 2/5) is not reached.

## 6. DH control

All statements here concern row counts or matrix norms and hold for arbitrary column coefficients; none uses the
Euler product, and none yields zero information. In the 7/8 argument the Euler product enters in three places that
this note leaves untouched: the witness is a partial sum of 1/L(s, psi_u) (Mobius coefficients, Prop 8.3); Lemma 17.1
is specific to mu(n) and product-form prime slots; the prime amplitudes come from the logarithmic derivative
(Lemma 19.1). For Davenport-Heilbronn there is no bounded-coefficient inverse and no witness, so nothing in
sections 2-5 could succeed for it by accident. (GM6), if proved, would be coefficient-free and would still need those
three inputs to produce a zero-free statement.

## 7. Verdict

Precise obstruction.

* PROVED-rel manuscript: S/n <= delta for every counted polynomial; C1, C2, C3 as tabulated; C3' follows from
  Lemma 18.1; the C4 row is not supported by Lemma 9.1 beyond the bare M_r and is not needed.
* PROVED: the cubic-trace expansion (2.2)-(2.3) for the sextic family; both S2 and S3 exceed the mean-value count
  with proved inputs (S2 by U^{0.34}-U^{0.58}); under pairwise Lindelof only S3 remains, with a required extra saving
  U^{3r(1/2 - delta)}; Poisson in n lengthens the sums (U^{2-r} > U^r) and Gauss sums cancel.
* Exact missing inequality: lambda_max(E_B) << U^{0.5903 + 0.4693 r - eps'} for every admissible row set B, for the
  polynomial witness x slots of length U^r, r in (0.7605, 0.8728]. Proved exponent: 2(1+r)/3 (1.222 against 0.981 at
  r = 5/6). It is not TRO6-natural; the round-1 reduction is withdrawn.
* Sextic (KD)^{2/3}: sharpness not settled. PROVED-rel [Xu26] (unverified): norm >= U^{17/16} in the window.
  MEASURED to K = 2*10^5: Gauss-sum extremal vectors, growth above the mean value and well below the cubic growth.
* Price: proved gain 0. Hypothetical value of (GM6) at full strength: B = 0.8744074 (model). Bare-witness version: 0.

No pivot was run. The adjacent full-family lever (slot capacity r + z < 1 in Lemma 17.1) is named in section 3 only.

## 8. Three weakest steps

1. Section 4: [Xu26] was not seen; only its description in the Xu-Sang introduction was read. The measured
   exponents are pre-asymptotic (the cubic control itself reads 1.19 against 1.22), the class span has 108 dimensions,
   and the two-term fits do not separate the sextic models cleanly.
2. Section 3: "(GM6) is the missing inequality" is exact only for arguments of Halasz / cubic-trace type on the set B.
   (MI) => count is an equivalence inside that argument; no claim is made that every proof of a count gain must pass
   through it. (E7) was derived for squarefree, pairwise coprime rows in fixed classes; shared factors and the
   powerful parts of sixth-power-free rows were not worked out, and the squarefree-sieve remainder was not bounded.
3. Section 5: the prices come from the prior heuristic LP model (grid accuracy about 1e-5 for the Guth-Maynard
   models) on the imported, unrefereed Xu-Sang system; (GM6) on witness x slots involves non-squarefree columns,
   which Lemma 9.1 does not cover as stated.
