# r3-lemma181-a: the numerator average K = (3R+1)/4 built on manuscript Lemma 18.1

Internal working note, 2026-11-16. Slug `r3-lemma181-a`. Unrefereed. Nothing committed, pushed or posted.
Everything is relative to unrefereed inputs: the openai/math 7/8 manuscript (`~/lean-deps/qrh-verify/paper.txt`,
Lemma 18.1 at l.9354, proof l.9316-10966), Xu-Sang arXiv:2610.15291v2 (Prop 4.1, Prop 5.1), Liu arXiv:2610.26835v2
(Lemma 13.7, Prop 14.3, (14.7)); text copies in `../bypass-78/dl/`. Liu 2610.12234 uses the pointwise numerator only.
No new zero-free region. No abscissa below 0.874886647 is proved. RH open. NO QED.

**Verdict: precise obstruction, with one new proved statement (Theorem R).**

1. What is averaged is the first moment over a detected row class B of the reflected numerator
   L(1/2 + theta + it, psi_u). K = (3R+1)/4 is Hoelder (3/4, 1/4) between the class count U^R and the full-family
   fourth moment U^1 of Lemma 18.1. The prime factors give the extra -theta/2 up to theta = q/(6 kappa).
2. Theorem R (PROVED, classical Mellin argument): a row that carries the detector's plain witness
   |S_m|^2 >= U^{delta m} has a numerator of size at least U^{m(delta/2 - theta)} on the line 1/2 + theta. At the
   critical class the detector's balanced witness length is m_p = t* - r* = 0.418254, and
   R + m_p(delta/2 - theta) = (3R+1)/4 - theta/2 exactly at theta = q/(6 kappa) (both equal 2/3). So
   **on plain-witness rows the Xu-Sang/Liu numerator exponent is the count times a forced size. It contains no
   Hoelder loss that can be removed while the plain-branch count bound stands.** Any numerator saving d implies a
   count saving d on the plain-witness rows.
3. Consequence for the price list: "K -> R reaches 13/15" is not an independent input. K = R would force the
   plain-witness rows of the critical class to number at most U^{0.4922}, below the density-hypothesis exponent
   1 - delta = 0.5307. A numerator saving d (worth -0.183 d, MODEL) cannot be had without a count saving of at least
   d on the plain branch (CRITIC_R1 C3 restricted to plain-witness rows; worth -0.0225 per unit on its own, MODEL).
4. Approach A tools (second moment with primes, three copies, sixth moments, Halasz-Montgomery, general sextic
   large sieve) give no saving for that count at m_p. Table in section 5.

Labels: PROVED (argument written here) / PROVED-rel (relative to the sources as stated) / EXACT (algebra, checked
symbolically or to 40 digits) / NUMERICAL (float LP on a grid) / MODEL (hypothetical input priced, not a bound) / OPEN.

---

## 0. Plan; what differs from the closed lanes

Read in full: BRIEF, CRITIC_R1 (Tier C not rerun), bypass-78 RESULT and scripts, manuscript section 18 statement and
18.1-18.5, Xu-Sang sections 2, 4, 5, 6.1, Liu II Lemma 13.7, (14.5)-(14.9), Prop 14.3, Remark 14.14. Read for
verdicts and for the passages on the numerator, Lemma 18.1 and the counts: zf-hecke-all-fields, zf-audit-inputs,
zf-higher-rows, zf-large-values, r2-zf-critical-density, r2-zf-paired-rows, r2-zf-gm-inverse-witness and their
referee reports. The tro6 and r2-tro6 lanes were read at verdict level only; they concern the low side, which this
note does not touch.

Not repeated: the composition and free-geometry optimality of B_flat (bypass-78 sections 2-4), class-by-class mixing
of pointwise and averaged numerators (bypass-78 section 3), the hybrid target-row mean value and the density table
at real part 0.7347 (r2-zf-critical-density), Guth-Maynard on the inverse witness (r2-zf-gm-inverse-witness), TRO6.

Different here:
* bypass-78 priced K -> R as the largest single lever and did not attempt it. This note works on the numerator
  estimate block by block, not on the count and not on the geometry.
* r2-zf-critical-density treated the count R as the unknown and the numerator as a consumer of it. Theorem R goes
  the other way: it bounds the numerator from below by the detector's plain witness. No earlier lane has a lower
  bound for the numerator.
* the price of the numerator lever is recomputed with count and numerator coupled.

Walls: nothing here is an argument for a zero-free region. Section 7 records the controls.

---

## 1. What is averaged and why (3R+1)/4 appears  [PROVED-rel, read from the sources]

Objects. Rows u sixth-power-free, q_u ~ U = Z^d. A row class B = B(a, x): rows whose presentations
X_u = {nu chi(u)^{+-1}} have largest zero real part in [a, a+e) (Liu II Lemma 13.7), delta = 2a - 1, and whose
physical prime sums have mean amplitude q = delta x, 0 <= x <= 1/2 (Xu-Sang (20)). Count #B <= U^{R + eps},
R = R_kappa(delta, x) (Xu-Sang Prop 4.1).

The averaged quantity (Xu-Sang (25) = Liu II (14.16)):

    Sum_{u in B} |L(1/2 + theta + it, psi_u*)|  <<  U^{(3R+1)/4 - theta/2 + eps} (1+H)^A',   |t| <= H.

It enters the class endpoint (Liu II (14.7) at d = h) as h(K + theta/2) - l_y(1/2 + theta): reflection costs
U^theta, the outside Mellin weight gives Y^{-theta}.

Proof structure in the sources. The approximate functional equation writes the numerator as dyadic blocks
S_m(u) of length U^m with coefficient U^{-theta m}. For m <= 1/2, Lemma 18.1 with two copies of S_m and selected
prime slots of total length z_p = (1-2m)/(6 kappa) gives Sum_u |S_m|^4 |Q_sel|^2 << U^{1+eps}. On B,
|Q_sel|^2 >= U^{2 q z_p}. Hoelder:

    Sum_{u in B} |S_m| <= (#B)^{3/4} (Sum_{u in B} |S_m|^4)^{1/4} << U^{(3R+1)/4 - q z_p / 2}.

With theta = q/(6 kappa) the exponent -theta m - q(1-2m)/(12 kappa) equals -theta/2 for every m <= 1/2.

Why (3R+1)/4 and not R. The fourth moment is over all rows (exponent 1), the sum is over B (exponent R). Hoelder
pays (1 - R)/4. R would need Sum_{u in B} |S_m|^4 << U^{R}, a fourth moment restricted to the class.

Where 6 kappa comes from. Lemma 18.1 case 2 requires n_1 + n_2 + 6 kappa z <= M (18.3). kappa enters only through
the pointwise prime bound |Q|^2 <= Z^{kappa z} (18.12), licensed by beta_* <= (1+kappa)/2, and the places listed in
zf-audit-inputs section 1.2. The cap theta <= q/(6 kappa) is this capacity at block length m -> 0 scaled by q.

---

## 2. Blockwise exponent, and three closure statements

For a class (delta, x), with q = delta x, R, kappa, define on 0 <= m <= 1/2

    F4(m) = (3R+1)/4 - theta m - q(1-2m)/(12 kappa)     (Lemma 18.1, two copies, full prime capacity)
    P(m)  = R + (delta/2 - theta) m                      (class pointwise bound |S_m|^2 <= U^{delta m + eps}: manuscript Lemma 8.2,
                                                          (8.1)-(8.2); follows from Xu-Sang (8) by a contour shift)
    A(m)  = R + (1/2 - theta) m                          (absolute counting, Xu-Sang Prop 5.1 alternative 2)
    N(theta) = max_m min(F4, P)(m).

Let m_p be the crossing of F4 and P. It does not depend on theta:

    m_p = [(1-R)/4 - q/(12 kappa)] / [delta/2 - q/(6 kappa)],   and   F4(m_p) = P(m_p)  <=>  R = A_P(m_p),

where A_P(m) = 1 - 2 delta m - 2 q (1-2m)/(6 kappa) is the plain-witness count exponent of Xu-Sang Prop 4.1.

**Lemma C (chord) [EXACT].** N(theta) = (3R+1)/4 - theta/2 for theta <= q/(6 kappa), and
N(theta) = R + m_p(delta/2 - theta) for q/(6 kappa) <= theta <= delta/2, with N(delta/2) = R. The second piece is the
straight line from the averaged endpoint (theta = q/(6 kappa), Xu-Sang) to the pointwise endpoint (theta = delta/2,
manuscript). The class endpoint is affine in theta on that piece, so the blockwise hybrid of the two numerator
estimates gives nothing beyond a per-class choice between them. That choice was closed by bypass-78 section 3.
Checked: symbolic (`exact_checks.py` part B, chord end value 0) and by LP (`base.log`, rows M0, M0p, M0a, M0b all
0.8748866).

**Lemma S (saturation) [EXACT, statement about the inequality system].** Put F(m) = (1-R)/4 - q(1-2m)/(12 kappa).
Then R + 2F(m_1) + 2F(m_2) + 2qz - 1 = q(m_1 + m_2 + 6 kappa z - 1)/(3 kappa). So a formal set of U^R rows with
|S_m| = U^{min(delta m / 2, F(m))} for all m <= 1/2 and prime amplitude q satisfies every instance of Lemma 18.1
(18.2)-(18.3) with equality at full capacity, and the class pointwise bounds. On that profile
Sum_B |S_{1/2}| U^{-theta/2} = U^{(3R+1)/4 - theta/2}. No combination of instances of Lemma 18.1, the count and the
pointwise bounds, by inequalities valid for arbitrary nonnegative data, improves K. Section 3 shows the profile is
not an artefact: its value at m_p is forced.

**Lemma T (other Hoelder exponents) [EXACT].**
* Second moment with primes (Lemma 18.1 with n_2 = 0, capacity (1-m)/(6 kappa)) minus F4 equals
  (1-R)/4 - q/(12 kappa) for every m. This is positive on the whole rectangle because R <= 1 - 2 delta/3 and
  q/(3 kappa) <= 3 delta/13. The second-moment route never wins.
* A zero-slot sixth moment Sum |S_{n1} S_{n2} S_{n3}|^2 << U^{1+omega} helps only if omega < (1-R)/2. At the critical
  class (1-R)/2 = 0.204834. The class pointwise bound times the fourth moment gives omega = delta/2 = 0.234672. The
  difference is (R - (1-delta))/2 = 0.029839, half the excess of the count over the density-hypothesis exponent.
  At R = 1 - delta, (3R+1)/4 = R + delta/4: Hoelder and the pointwise bound coincide.
* A three-copy moment with primes for blocks m <= 1/3 does not touch the binding range. With the class pointwise
  bound the binding blocks are m in [m_p, 1/2] = [0.4183, 0.5], not (1/3, 1/2] (bypass-78 section 5) and not
  [0.1705, 0.5] (absolute counting).

Critical class data (`exact_checks.log` part A, 40 digits, kappa = 2 B_flat - 1):

| quantity | value |
|---|---|
| delta_c, a_c | 0.469344858698, 0.734672429349 |
| q = delta_c/2, theta cap q/(6 kappa) | 0.234672429349, 0.052165196956 |
| R_c | 0.590332353526 |
| K = (3R+1)/4, K - cap/2 | 0.692749265145, 2/3 |
| Hoelder level (1-R)/4, class pointwise level delta/4 | 0.102416911618, 0.117336214675 |
| m_p | 0.418253633785 |
| detector balance t*, r*, t* - r* | 1.163953577, 0.745699943, 0.418253634 |

---

## 3. Theorem R: the plain witness forces the numerator

**Lemma R [PROVED, classical].** Let psi be a Hecke character of F whose inducing character is nonprincipal, L^S
its L-function with finitely many Euler factors deleted, W smooth with compact support in (0, inf), W~ its Mellin
transform, D >= 1, omega real, and S = Sum_n psi(n) q_n^{-1/2 - i omega} W(q_n / D). For every sigma in [1/2, 1]:

    |S| <= (D^{sigma - 1/2} / 2 pi) Int_R |L^S(sigma + i(omega + v), psi)| |W~(sigma - 1/2 + iv)| dv.

Proof. S = (1/2 pi i) Int_{(c)} L^S(1/2 + i omega + s, psi) W~(s) D^s ds for c > 1/2 by Mellin inversion. L^S is
entire and of polynomial growth on vertical strips. W~ is entire and decays faster than any power on vertical
strips. Move the contour to Re s = sigma - 1/2 and take absolute values. QED.

**Theorem R [PROVED; the application to the sources is PROVED-rel Liu II Lemma 13.7 / Xu-Sang (9)].** Let B be a
row class with parameter delta, and let B_P(m) be the set of rows of B that carry a plain witness
|S_m(u)|^2 >= U^{delta m - eps} of length U^m (0 < m <= 1/2) for a presentation psi_u in X_u, with profile in the
bounded smooth family and twist height at most T_1 = Z^tau. Suppose that for some theta in [0, delta/2], some N and
H = U^eta >= 2 T_1,

    Sum_{u in B} |L^S(1/2 + theta + it, psi_u)| <= U^{N} (1 + H)^{A}     for all |t| <= H.          (*)

Then #B_P(m) << U^{N - m(delta/2 - theta) + eps + A eta}.

Proof. Lemma R with sigma = 1/2 + theta and D = U^m gives, for u in B_P(m),
U^{delta m/2 - eps/2} <= U^{theta m} Int |L^S(1/2 + theta + i(omega_u + v), psi_u)| |W~(theta + iv)| dv. The part
|v| > H/2 is at most U^{-10} by convexity for L^S and the decay of W~. Sum over u in B_P(m), exchange sum and
integral on |v| <= H/2, group the O((log U)^2) dyadic twist heights omega_u, and apply (*). QED.

**Corollary R1 (the averaged numerator exponent is count plus forced size) [EXACT + PROVED-rel].** For every class,
if R = A_P(m_p) then at theta = q/(6 kappa)

    (3R+1)/4 - theta/2 = R + m_p (delta/2 - theta).

(Identity: (1-R)/4 = delta m_p/2 + q(1-2m_p)/(12 kappa).) At the critical class both sides are 2/3 and
m_p(delta/2 - theta) = 0.076334313. Hence a bound (*) with N = (3R+1)/4 - theta/2 - d, d > 0, for the witness
presentations implies #B_P(m) << U^{R - d + eps} for every m >= m_p. On [q/(6 kappa), delta/2] the lower bound
R + m_p(delta/2 - theta) equals N(theta) of Lemma C at every theta: the whole chord is attained when the count is.

**Corollary R2 (who carries the count) [PROVED-rel Xu-Sang Prop 4.1].** In the proof of the count at the balanced
detector parameter t*, a row with witness pair (r, m), r + m >= t*, is counted by
* A_P(m) <= R if r <= r* (then m >= t* - r >= m_p), with equality only at m = m_p;
* A_I(r) < R if r* < r < 1;
* e(r) - delta r <= R_long(t*) = R if 1 <= r <= t*, with equality only at r = t*.
Verified to 40 digits: A_I(r*) = A_P(m_p) = R_long(t*) = R and t* - r* = m_p. So the rows that can attain the count
U^R are of two kinds: rows with a plain witness of length m_p (and inverse length r*), and rows with a long inverse
witness r = t* = 1.1640 and no plain witness of positive length. Theorem R applies with full strength to the first
kind and says nothing about the second. A numerator saving d for the class therefore needs both a count saving d on
the first kind (necessary, Corollary R1) and a numerator or count saving on the second kind (not forced by anything
here). [The second requirement is OPEN.]

**Corollary R3 (Lindeloef on the class).** K = R, read as (*) with N = R at theta = 0, implies
#B_P(m_p) << U^{R - m_p delta/2} = U^{0.492180} at the critical class. The density-hypothesis exponent is
1 - delta = 0.530655. So "the numerator is of Lindeloef size on the class" is false row by row on plain-witness rows
(each has sup_t |L(1/2 + it)| >= U^{0.098153}); it can hold on average only if those rows are rarer than the density
hypothesis predicts for the class.

Scope. (i) Theorem R concerns the presentation that carries the witness. The numerator presentation is chi(u)^{-1}
(Liu II Prop 14.3). If the witness presentation is nu chi(u)^{+-1} with nu != 1 the two L-functions differ. Every
estimate in the sources is uniform in the fixed twist, and no source bounds the number of rows with nu = 1 below #B.
A numerator estimate that uses nu != 1 would be a new kind of input. (ii) Theorem R shows that the first-moment
statement (*), uniform in t, cannot be improved without a count saving. It does not cover an argument that
integrates the numerator against the actual Mellin weights of the probe before taking absolute values.
(iii) Whether a class with #B_P = U^{R} exists is not asserted (atlas section 9: statements about the estimate
system).

---

## 4. What estimate would lower K, stated exactly

By section 3, at the critical class (delta_c, 1/2), with theta in [q/(6 kappa), delta/2]:

    numerator exponent  <  (3R+1)/4 - theta/2   requires   #B_P(m_p) << U^{R - d},  d > 0,

that is, a large-values estimate for the plain polynomial of length U^{0.418254} at level |S_m|^2 >= U^{delta m}
(= U^{0.196305}) on rows that also have prime sums of amplitude x = 1/2, below U^{0.590332}. This is the M2 branch
of the count (Lemma 18.1, two copies, prime length (1 - 2m)/(6 kappa)).

Conversely a saving on #B_P alone is not sufficient for the same numerator saving: the level sets
|S_m| >= U^{F(m) - d} for m_p < m <= 1/2 lie below witness size and need a fourth moment restricted to B. [OPEN]

So the lever "K -> R" of the bypass-78 price list contains the count lever of CRITIC_R1 C3 on the plain branch as a
necessary part. It cannot be pulled as an independent input at fixed count.

---

## 5. Approach A: analytic tools against #B_P(m_p) and against the central block

Target exponent to beat: 0.590332 (count of rows with |S_m|^2 >= U^{delta m}, m = 0.418254, x = 1/2).

| tool | exponent obtained | status |
|---|---|---|
| Lemma 18.1, two copies, prime length (1-2m)/(6 kappa) | 0.590332 | the source bound (definition of R_c on this branch) |
| Lemma 18.1 with n_2 = 0, prime length (1-m)/(6 kappa) | 0.743001 | PROVED-rel; worse |
| three copies S_m^3, length 3m = 1.2548 > 1, perfect large sieve (not available) | 0.665845 | MODEL; worse even if granted |
| three copies, general sextic large sieve Q + N + (QN)^{2/3} (Heath-Brown cubic form; order-n version of Blomer-Goldmakher-Louvel) | 0.914258 | CLASSICAL form; worse |
| Halasz-Montgomery | none | off-diagonal sums have length N = U^{0.418} = C^{0.209} for conductor C = U^2 of psi_u conj(psi_u'), below the Burgess range C^{1/4}; with the trivial bound the inequality R V^2 <= N + R N is void |
| pointwise subconvexity for L(1/2, psi_u) | none | irrelevant to a count; for the numerator the class bound delta/4 = 0.1173 is already below Weyl strength 1/6, and Hoelder needs a level below (1-R)/4 = 0.1024 |
| sixth moment at the centre, Sum_B |L(1/2+theta)|^6 << U^{1+omega} | needs omega < 0.204834 | available 0.234672; perfect large sieve at length 3/2 gives 0.5; by Theorem R any omega < 0.2048 is a count saving |

No tool in the list gives d > 0. The second row was not in the sources (r2-zf-gm-inverse-witness C3') and is never
better (Lemma T). Mean-value methods at m_p are at the edge of the perfect fourth moment: length 2 m_p = 0.8365 plus
prime cost 6 kappa z = 0.1635 fills the capacity 1 exactly.

---

## 6. Abscissa under hypothetical inputs  [MODEL except row 0; all values depend on the unrefereed inputs]

System: Liu II (14.3), (14.5), (14.7), section 15.1; free lengths, l_y >= h/2, kappa = 2B - 1, classes delta >= 1/8,
gates of Liu II Remark 14.1 not imposed (optimistic; r2-zf-critical-density section 4 gives gated variants).

**6.1 Exact certificate [EXACT lower bound of the system, 40 digits, `exact_checks.py` part C].** With the numerator
exponent K - d the positive combination w_0 L_0 + w_K L_K + w_H H at the class where its gradient in (l_x, l_y, l)
vanishes (bypass-78 Prop U) gives B >= B_cert(d):

| uniform numerator saving d | B_cert(d) | LP value (grid 81 x 17, rho scan) |
|---|---|---|
| 0 | 0.874886647039964 (Liu's quartic residual 3e-36) | 0.8748866 |
| 1e-4 | 0.874868363123 | 0.8748683 |
| 1e-3 | 0.874703608949 | 0.8747036 |
| 2e-3 | 0.874520128061 | 0.8745199 |
| 5e-3 | 0.873967016929 | 0.8739664 |
| 1e-2 | 0.873036199199 | 0.8730360 |
| 2e-2 | 0.871140398463 | 0.8711517 |
| 3e-2 | 0.869198005733 | 0.8692107 |
| >= 0.042676808566 | 13/15 (low floor) | 0.8666666 at d = 0.05 |

dB/dd at 0 is -0.182817. The certificate is a lower bound for the system; the LP supplies a feasible point on its
grid (for d >= 2e-2 the rho grid is coarse and the LP value is 1e-5 above the certificate). The floor 13/15 is
reached at d = 0.04268, which is 42% of K - R = 0.1024.

By Theorem R these rows are not available without a count saving of the same size d on the plain-witness rows.

**6.2 Coupled prices [MODEL, NUMERICAL; `coupled.py`, `coupled.log`].** Count and numerator changed together.

| hypothetical input | abscissa | gain |
|---|---|---|
| none | 0.8748866 | 0 |
| plain-witness count saving tau = 1/120 (A_P -> A_P - tau, detector re-balanced, K = (3R'+1)/4) | 0.8746991 | 1.9e-4 |
| tau = 0.02 | 0.8743933 | 4.9e-4 |
| tau = 0.05 | 0.8735251 | 1.4e-3 |
| tau = 0.1 | 0.8720148 | 2.9e-3 |
| prime capacity of Lemma 18.1 doubled (cost 3 kappa), in count and numerator | 0.8736974 | 1.2e-3 |
| prime capacity doubled, numerator only (bypass-78 row; not consistent with Theorem R when the count is attained) | 0.8741892 (equals the bypass-78 value) | 7.0e-4 |
| prime capacity doubled, count only | 0.8743753 | 5.1e-4 |

First-order rate for the plain-count lever alone: dR/dtau = -(1-x)(alpha - delta)/J = -0.1635 at the critical
class, so dB/dtau = -0.0225 (measured -0.0225). The uniform count saving of the earlier price list (-0.138 per unit)
assumes the inverse branches are improved too. A numerator saving d together with the plain-count saving d it
entails is worth about -(0.183 + 0.0225) d to first order.

**6.3 Sixth moment [MODEL, NUMERICAL; `sixth.log`].** Zero-slot sixth moment U^{1+omega} added blockwise:

| omega | abscissa |
|---|---|
| 0.30, 0.25, 0.22, 0.20 | 0.8748866 (no change) |
| 0.18 | 0.8747788 |
| 0.15 | 0.8742402 |
| 0.10 | 0.8724859 |
| 0.05 | 0.8712718 |
| 0 (Lindeloef-on-average sixth moment at every length) | 0.8694267 |

For omega < 0.2 the optimum sits on the coarse part of the rho grid (step 0.01 to 0.02); those values are upper
estimates with error about 1e-5. Even omega = 0 does not reach 13/15. `central.log`: lowering F4 by d on every block
with theta free reproduces the uniform column of 6.1 (0.8747036, 0.8739664, 0.8730360).

No gain until omega < (1-R_c)/2 = 0.2048, as in Lemma T.

---

## 7. Controls

Nothing here is an argument for a zero-free region; the note bounds what one estimate inside the base method can
give. Lemma R and Theorem R use only Mellin inversion and entireness of L. They hold for Davenport-Heilbronn type
functions and for sign-twisted Euler products as well, as an obstruction statement should. The base method's use of
the Euler product is unchanged (bypass-78 section 7: scalar Euler identity, inverse witness with Moebius
coefficients, prime polynomials with |Q|^2 <= Z^{kappa z}). Lemma 18.1 itself uses the Euler product only through
(18.4) (multiplicativity of row characters) and (18.11)-(18.12) (log-derivative bound from the family zero-free
hypothesis). MV-CAP is not in play: the statements are about counts and first moments that the method consumes.

---

## 8. Three weakest steps

1. **Scope of Theorem R with respect to the presentation.** The lower bound is for the L-function of the witness
   presentation nu chi(u)^{+-1}. The numerator of Prop 14.3 is chi(u)^{-1}. For rows whose witness has nu != 1 the
   theorem says nothing about the numerator. The obstruction is to estimates uniform in the fixed twist, which is
   what all four sources prove. It does not exclude a twist-sensitive numerator estimate.
2. **Theorem R concerns the intermediate statement (14.16) / (25)**, uniform in |t| <= H, not every way of bounding
   the row sum. An argument that keeps the t-integration with the probe's own Mellin weights, or keeps the sign of
   numerator times inverse denominator across rows, is outside it. r2-zf-critical-density Lemma H closed the
   phase-blind hybrid version for a single target; a phase-sensitive version is open.
   Rows of the second kind in Corollary R2 (long inverse witness, no plain witness) can attain the count and are
   not constrained by Theorem R, so the theorem gives a necessary condition for a numerator saving, not a full
   characterisation.
3. **Transcription and numerics.** All exponent formulas are transcribed from unrefereed preprints. Section 6.1 is a
   40-digit root of the certificate equations, not an interval proof, and its optimality is supported by a float LP
   on an 81 x 17 class grid with a rho scan, not a certificate over all classes. Sections 6.2-6.3 extrapolate the
   count formula R_kappa outside the range in which Xu-Sang prove it (c <= 6/13) and omit the Remark 14.1 gates.
   The proof of Lemma 18.1 (manuscript l.9316-10966) was read for its statement, sections 18.1-18.5 and the places
   where kappa enters; it was not re-verified line by line.

---

## 9. Pivot (once)

The assigned target (lower K at fixed count) is closed by Theorem R. The adjacent target it points to is the M2
branch of the count at (m, V) = (0.4183, U^{delta m / 2}): a fourth moment of S_m with prime factors at the exact
capacity 2m + 6 kappa z = 1. Two concrete inputs would move it, both changes to Lemma 18.1 itself:
* a smaller prime cost than 6 kappa in (18.3). Coupled price for cost 3 kappa: 0.8736974 (section 6.2);
* a restricted moment: Sum over rows with prime amplitude x = 1/2 of |S_m|^4 below U^{1 - 2 q z}. On such rows the
  prime sums saturate the zero at a_c; this is the density problem of r2-zf-critical-density on the plain branch.
Neither was attempted beyond section 5. [OPEN]

---

## 10. Files

* `numerator_system.py`: scalar system with blockwise numerator options; `base.log` (validation and chord test),
  `uniform.log` (section 6.1 LP column), `sixth.log` (6.3), `central.log` (F4 lowered blockwise, theta free).
* `exact_checks.py`, `exact_checks.log`: critical-class data, identities of sections 2-3 (sympy), certificate of 6.1.
* `coupled.py`, `coupled.log`: section 6.2.
* `mellin_check.py`, `mellin_check.log`: numerical sanity check of the identity in Lemma R for a cubic character
  mod 7 (contour integral equals the direct sum to 1e-8 on two lines; not a proof input).
* Environment: `python3.12 -m venv venv && venv/bin/pip install numpy scipy sympy mpmath` (venv removed after the runs).
