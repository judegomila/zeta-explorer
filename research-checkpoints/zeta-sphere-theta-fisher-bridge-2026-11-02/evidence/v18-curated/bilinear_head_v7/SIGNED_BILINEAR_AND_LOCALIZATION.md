# Signed product-head bilinear form and the averaged-to-pointwise obligation

2 November 2026. New post-v5-snapshot work; independent hierarchy-lane review PASS; see REVIEW_HIERARCHY.md.

## 1. Exact signed bilinear form

Fix a in (0,1/2], and hold the product cutoff M fixed when varying height t. Define the real orbit amplitude

 w_j(a,t)=(1/(32a))partial_a{P_a(2t) integral_1^infinity
      2x^(-1/2)cosh(a logx) K_(it)(2pi jx)dx}.

Then the exact normalized product-head density is

 Q_M(a,t)=hat A_a(2t)/a + sum_(nm<=M) w_(nm)(a,t) exp[-it log(n/m)].

Writing z_n(t)=exp(it log n) and B_nm=1_(nm<=M)w_(nm), this is axis+z*Bz. Its diagonal/off-diagonal decomposition is

 Q_M=axis + sum_(n²<=M)w_(n²)
              +2 sum_(n<m,nm<=M)w_(nm)cos[t log(m/n)].  (1)

The first sum is a candidate diagonal reserve, not automatically a proved positive reserve. The arithmetic phase is not arbitrary: the vector z(t) lies on a one-parameter curve, rather than ranging over all complex vectors.

## 2. An actual obstruction to a PSD orbit matrix

Fix any 0<a<1/2 and let p=1/2+a. For any fixed j, the already proved completed-Mellin decomposition gives, as t tends to infinity,

 w_j=c(t)j^(-p)[L(t)-log j]+o(c(t)/log t),
 c(t)=P_a(2t)g_p(t)/(128a)>0,
 L(t)=partial_a log[P_a(2t)g_p(t)]~log(t/(2pi)).          (2)

Here the differentiated dual-parent error divided by c is O_a(t^(-2a)log t), and the fixed-j low-integral correction divided by c is O_a(t^(-p-5/2)). Both are o(1/log t). Thus (2) has enough precision to compute a fixed minor, not merely the leading diagonal size.

For every M>=4, the principal matrix on indices1,2 has determinant

 w_1 w_4-w_2²
   =-c(t)² 2^(-2p)(log2)²+o(c(t)²)<0                 (3)

at all sufficiently large t. Indeed its leading entries are cL, c2^(-p)(L-log2), c2^(-2p)(L-2log2). Their determinant is exactly the negative term in (3); multiplying the o(c/logt) entry errors by O(c logt) gives o(c²).

Therefore the actual mixed-orbit matrix is indefinite at high frequency, even though the corrected N=1 scalar head is positive. No positive-feature Gram representation of this orbit matrix exists. This is NOT a negative-head or RH counterexample: the physical coefficients z_n(t) are constrained, and this minor initially omits the separate collective axis. Even the natural assignment of the entire axis to the (1,1) entry (since z_1=1) does not repair the negative determinant: axis/c=O_a(t^(-p-2)logt)=o(1/logt), so its determinant correction is o(c²). It identifies why replacing the signed bilinear arithmetic problem by arbitrary-vector matrix positivity is too strong.

## 3. Exact local averaging with varying amplitudes

Let I=[T-H,T+H], H>0, and keep M fixed throughout I (choose M large enough for the contour budget at its upper endpoint). For n<m set omega_nm=log(m/n)>0. Integration by parts gives

 |(1/(2H)) integral_I w_(nm)(t)exp(i omega_nm t)dt|
 <=[|w_(nm)(T-H)|+|w_(nm)(T+H)|
                 +integral_I |partial_t w_(nm)(t)|dt]/(2H omega_nm). (4)

This retains coefficient variation; freezing the amplitudes without an error budget would be invalid. With bar denoting the interval average, (1) implies the rigorous sufficient averaged reserve

 bar Q_M >= bar axis +sum_(n²<=M)bar w_(n²)
   -sum_(n<m,nm<=M)[|w_(nm)(T-H)|+|w_(nm)(T+H)|
                  +integral_I|partial_t w_(nm)|]/(H omega_nm).    (5)

This elementary bound is generally wasteful, but fully explicit once amplitude bounds are supplied. Sharper Hilbert/large-sieve tools may improve the averaged off-diagonal cost. They do not by themselves turn an average into a pointwise lower bound.

For comparison, frozen coefficients b_n obey the exact mean-square identity

 (1/(2H))integral_I |sum b_n exp(it log n)|²dt
 =sum|b_n|²+sum_(n!=m)b_n conj(b_m)exp(iT log(n/m))
                       sin(H log(n/m))/(H log(n/m)).      (6)

Diagonal dominance in this average does not imply diagonal dominance at t=T. The actual head in(1) is also not a single positive square: its product coefficients and outward derivative are signed, as(3) demonstrates.

## 4. A valid localization criterion, and its unresolved cost

If an independent estimate proves |partial_t Q_M(a,t)|<=L on I, then

                 Q_M(a,T)>=bar Q_M-LH/2.                (7)

This follows by averaging |Q_M(T)-Q_M(t)|<=L|t-T|. With the reviewed contour allowance

 epsilon(T)=5T^(3/2)exp[-(1+pi/4)T],
 M+1>=T/(sqrt(2)pi),

one sufficient pointwise full-kernel certificate is

                       bar Q_M>LH/2+epsilon(T).          (8)

Thus a positive averaged reserve can be used only after paying a quantified localization cost. A phase-aware derivative estimate smaller than the naive sum of absolute derivatives would be genuine additional arithmetic input.

No averaging theorem alone provides(8). The elementary counterexample f(t)=1-(1+eta)cos(omega(t-T)), eta>0, has positive period average1 but f(T)=-eta. This is a generic inference counterexample, not a claim about the theta kernel. It persists for smooth real analytic functions, so smoothness alone does not close the gap.

The head frequencies satisfy omega_nm>=1/(sqrt(M)+1) for n<m,nm<=M. Indeed n<sqrt(M), m/n>=1+1/n>=1+1/sqrt(M), and log(1+x)>=x/(1+x). Adjacent indices near sqrt(M) attain this scale up to constants. Consequently removing the slowest off-diagonal oscillation by a plain window requires widths on the scale sqrt(M) or larger. At the natural M comparable to T this is not a microscopic window. This is a scale warning for simple dephasing, not a theorem that more refined arithmetic cancellation cannot localize.

## Literature scope

Montgomery and Vaughan, Hilbert's Inequality, J. London Math. Soc. (1974), DOI https://doi.org/10.1112/jlms/s2-8.1.73, is a primary source for the sharper Hilbert-inequality approach to separated frequencies. Its bibliographic record was checked here; no uninspected theorem or optimal constant from it is used in(4)-(8), which are derived directly. A full application of a large-sieve estimate to the varying signed Bessel amplitudes remains unproved in this note.
