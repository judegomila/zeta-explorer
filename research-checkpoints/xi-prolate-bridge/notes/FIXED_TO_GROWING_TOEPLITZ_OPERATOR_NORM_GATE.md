# Fixed-to-growing Toeplitz operator-norm gate

## 0. Exact result and fail-closed boundary

Put

\[
 \ell=\log c,
 \qquad
 w(\beta)=\sum_{n\leq\csc\beta}{1\over2\pi n},
 \qquad 0<\beta\leq{\pi\over2},                         \tag{0.1}
\]

and define

\[
 \Gamma_r=\int_0^{\pi/2}w(\beta)\cos(4r\beta)\,d\beta,
 \qquad
 T_M=(\Gamma_{j-k})_{1\leq j,k\leq M}.                 \tag{0.2}
\]

The indices in (0.2) correspond to the candidate pure labels
`4,8,...,4M`.  The first conclusion is the exact, dimension-free symbol
floor

\[
 \boxed{T_M\succeq {1\over4}I_M\qquad(M\geq1).}         \tag{0.3}
\]

Suppose, conditionally, that an actual defect-white Hermitian matrix has
been decomposed as

\[
 A_{M,c}=\ell T_M+E_{M,c}.                              \tag{0.4}
\]

No growing version of (0.4) is asserted here.  If `E_-:=(-E)_+` is the
negative part, then the exact perturbation gate is

\[
 \boxed{
 A_{M,c}\succeq
 \left\{{\ell\over4}-\|(E_{M,c})_-\|\right\}I_M.}       \tag{0.5}
\]

Thus

\[
 \|(E_{M,c})_-\|=o(\ell)                               \tag{0.6}
\]

is sufficient to retain the asymptotic quarter-floor.  More generally,
for a fixed `delta>0`,

\[
 \|(E_{M,c})_-\|\leq\left({1\over4}-\delta\right)\ell  \tag{0.7}
\]

is sufficient for `A_(M,c) succeq delta*ell*I`.  A full operator estimate
`||E_(M,c)||=o(ell)` is sufficient but stronger than necessary.

If the only uniform information is the entrywise bound

\[
 \max_{j,k}|(E_{M,c})_{jk}|\leq r_{M,c},                \tag{0.8}
\]

then Schur's test gives

\[
 \boxed{\|E_{M,c}\|\leq Mr_{M,c}.}                     \tag{0.9}
\]

Consequently the sharp fail-closed sufficient rate available from
entrywise information alone is

\[
 Mr_{M,c}=o(\ell).                                      \tag{0.10}
\]

In the natural regime `M asymp ell`, equation (0.10) requires

\[
 \boxed{r_{M,c}=o(1).}                                  \tag{0.11}
\]

For a merely positive proportional floor and `M sim kappa*ell`, a uniform
small constant can replace (0.11), but it must satisfy the explicit
constant inequality inherited from (0.7).  An entrywise statement
`o(ell)`, even uniformly over the whole moving matrix, is not enough.

The new contribution of this note is (0.5)--(0.11), together with the
structured alternatives in Section 3 and the frozen-scope audit in
Sections 4--5.  The strict-PASS endpoint-null collective-dilation barrier
already identifies the missing operator-valued dilation block; it does not
state this Toeplitz error-accumulation threshold.

No arbitrary-pair fixed-label asymptotic, growing decomposition (0.4),
complete signed floor, singleton Schur floor, physical quotient comparison,
equation (5.2) of `DIRECT_RH_ATTACK.md`, determinant limit, Riemann-hypothesis
conclusion, or Lambda bound is proved.  The formal project state remains
`P0_INVALIDATED`.  The standard eight are not changed.

## 1. Frozen dependencies

The scope audit uses the following exact bytes.

| Dependency | SHA-256 |
|---|---|
| `notes/GROWING_TRANSITION_EQUALITY_CONDUCTOR_GARDING_THEOREM.md` | `f746d5e8e9efdcd585ace947789597954d9a8f7b57319f4398612bf3986b0079` |
| `tests/test_growing_transition_equality_conductor_garding_theorem.py` | `61713e1f3007042eecfea5be0f1178b02311e5b9d4387af8c0123be293fc73ba` |
| `notes/GROWING_TRANSITION_ENDPOINT_NULL_COLLECTIVE_DILATION_FRAME_REDUCTION.md` | `bbffec21c91b1e1150e36c9b2120b9255f1d0aa1bd4a1c7ec226e02db8d6abe6` |
| `tests/test_growing_transition_endpoint_null_collective_dilation_frame_reduction.py` | `eb25ab43e4f5fdeea96d89aa425ac2a9ab4f7cbdd0feaad3294e494387840f66` |
| `notes/GROWING_TRANSITION_ORDERED_PRIME_NEAR_BAND_FOLD_LARGE_SIEVE_THEOREM.md` | `93a42acf8f33a2706e67ca53a929755d021c291a0dd3907099eb3176524e2675` |
| `tests/test_growing_transition_ordered_prime_near_band_fold_large_sieve_theorem.py` | `4d1075a2b61ef9d1cb510b2e21ac0225b94f702829b426014b8581c5ee6a72e6` |
| `notes/GROWING_TRANSITION_ORDERED_PRIME_FAR_ANNULUS_DILATION_LARGE_SIEVE_THEOREM.md` | `c09ae35ef96a9d897446221354199e6a945c7e4b6d118a4b934b223452e137cc` |
| `tests/test_growing_transition_ordered_prime_far_annulus_dilation_large_sieve_theorem.py` | `1b09dd1eac6356e5a9faecbee8b400911d28577e473ee3583cfb1df349587f1b` |
| `notes/FIXED_EVEN_PREFIX_ARITHMETIC_SYNTHESIS_THEOREM.md` | `1ef5e05f1a17ecf74e8337d16e799f81e02470ae71dc15d2b7f4fb96d42df0f4` |
| `tests/test_fixed_even_prefix_arithmetic_synthesis_theorem.py` | `6e89f2f1af22260e5796eb67221fccd86d2668556e9cb23dd903ea283d5f069f` |
| `notes/FIXED_EVEN_8_12_PLANE_ARCHIMEDEAN_ARITHMETIC_FLOOR_THEOREM.md` | `e23e5c832db2ae4c0d499a0a692252205197db0cd91b9ae4144416455f2a4f17` |
| `tests/test_fixed_even_8_12_plane_archimedean_arithmetic_floor_theorem.py` | `545fe85867f427cf778aabbb2b4a57dcc268d99ff13e5ca096d84d52d1cdf09f` |
| `notes/FIXED_LABEL_4_12_WEIGHTED_ARCHIMEDEAN_CROSS_LIMIT_THEOREM.md` | `b6fd0f311d9b0822d2a0ad13c6b5d246c48bd694f692b3fb53ba5a7a47458a2e` |
| `tests/test_fixed_label_4_12_weighted_archimedean_cross_limit_theorem.py` | `9a11a4e23a3a31f871f8654debf4a6b48d244cc29843c1e04118fd8c8737efbe` |
| `notes/FIXED_4_12_COMPLETE_NONARCHIMEDEAN_CROSS_THEOREM.md` | `efde844cb3aa14a97277d3a7f62af4bf51f02578e4c2a06f1dc4354934713dca` |
| `tests/test_fixed_4_12_complete_nonarchimedean_cross_theorem.py` | `12a8624458a1da4cdc361e71b36356acfe0097284cb9ddb8c3bd4e15a238bca1` |
| `notes/FIXED_EVEN_PREFIX_DIAGONAL_COVARIANCE_COLLAPSE_AND_SIGNED_TAIL_DICHOTOMY.md` | `6d8be3d8bef6002d7fa2f1581e09bf27aa0dc12b2a3805fa7cd5e92863cd70d8` |
| `tests/test_fixed_even_prefix_diagonal_covariance_collapse_and_signed_tail_dichotomy.py` | `cd772d51fce2136756e82aff09831d690b26ec5aaf704f8aa8108e1f157a304a` |

No moving fixed-prefix theorem is pinned.  In particular, this note does
not depend on any concurrent draft that might establish (0.4) only for
each fixed `M`.

## 2. The exact Toeplitz floor and the accumulation counterexample

The `n=1` term in (0.1) is present for every beta.  Hence

\[
 w(\beta)\geq{1\over2\pi}.                              \tag{2.1}
\]

For a real vector `x` put

\[
 P_x(\beta)=\sum_{j=1}^M x_je^{4ij\beta}.               \tag{2.2}
\]

Pairing the two orientations in the real quadratic form gives

\[
 x^TT_Mx=\int_0^{\pi/2}w(\beta)|P_x(\beta)|^2\,d\beta. \tag{2.3}
\]

The exponentials are orthogonal on this interval:

\[
 \int_0^{\pi/2}|P_x(\beta)|^2\,d\beta
 ={\pi\over2}\|x\|_2^2.                               \tag{2.4}
\]

Equations (2.1)--(2.4) prove (0.3) for real vectors.  Since `T_M` is real
symmetric, applying the same result separately to the real and imaginary
parts proves the Hermitian statement.

Weyl's inequality, or directly `E succeq -||E_-||*I`, proves (0.5).
Equation (0.9) is the maximum absolute row-sum bound.  These arguments use
no asymptotic information.

Here is a counterexample to the tempting replacement of (0.10) by uniform
entrywise `o(ell)`.  Let `mathbf 1` be the all-ones vector and set

\[
 E_M=-{\ell\over\sqrt M}\,\mathbf1\mathbf1^T,
 \qquad
 u_M={\mathbf1\over\sqrt M}.                            \tag{2.5}
\]

Every entry of `E_M` is `o(ell)`, uniformly as `M` tends to infinity, but

\[
 u_M^TE_Mu_M=-\ell\sqrt M.                              \tag{2.6}
\]

The actual candidate Toeplitz matrix does not rescue this example.  The
elementary harmonic bound and `sin(beta)>=2*beta/pi` give

\[
 w(\beta)\leq C\{1+\log_+(1/\beta)\}.                   \tag{2.7}
\]

Moreover the normalized Dirichlet polynomial in (2.5) obeys, away from
the two period endpoints,

\[
 |P_{u_M}(\beta)|^2
 \leq\min\left\{M,{C\over M\sin^2(2\beta)}\right\}.    \tag{2.8}
\]

Split the integral at `1/M` and at `pi/4`.  Equations (2.7)--(2.8), and
boundedness of `w` near `pi/2`, give

\[
 u_M^TT_Mu_M=O(\log(M+1)).                               \tag{2.9}
\]

Therefore

\[
 u_M^T(\ell T_M+E_M)u_M
 \leq C\ell\log(M+1)-\ell\sqrt M<0                     \tag{2.10}
\]

for all sufficiently large `M`.  Thus even a uniform moving-matrix
`o(ell)` entry bound can coexist with a negative eigenvalue.  The factor
`M` in (0.9) is a genuine worst-case obstruction, not bookkeeping.

## 3. Structure that can remove the modal-count loss

There are three useful distinctions.

First, suppose the whole remainder is a Toeplitz compression of a
bounded real symbol:

\[
 (E_{M,c})_{jk}
 =\int_0^{\pi/2}\rho_c(\beta)
       \cos\{4(j-k)\beta\}\,d\beta.                    \tag{3.1}
\]

The same calculation as (2.3)--(2.4) yields

\[
 \boxed{\|E_{M,c}\|\leq{\pi\over2}\|\rho_c\|_\infty,} \tag{3.2}
\]

uniformly in `M`.  Hence `||rho_c||_infty=o(ell)` is sufficient.  This is
a symbol theorem, not merely the statement that entries depend on `j-k`.

Second, Schur summability gives the elementary structured gates

\[
 \| (e_{j-k})_{j,k=1}^M\|
 \leq\sum_{|r|<M}|e_r|,                                 \tag{3.3}
\]

\[
 \| (h_{j+k})_{j,k=1}^M\|
 \leq\max_{1\leq j\leq M}\sum_{k=1}^M|h_{j+k}|.        \tag{3.4}
\]

Either right side being `o(ell)` is sufficient.  For example,
`|h_n|<=C/(n+1)` costs at most `O(log M)`, which is `o(ell)` when
`M asymp ell`.

Third, the words Toeplitz, Hankel, finite rank, or oscillatory do not alone
remove accumulation.  The constant Toeplitz matrix and the constant Hankel matrix
are both `mathbf 1*mathbf 1^T`, have bounded entries, and have norm
`M`.  Likewise a constant-amplitude trigonometric Hankel sequence can have
rank two and norm comparable to `M`.  A bounded symbol, summable
coefficients, a Hilbert-type inequality, almost orthogonality, or a direct
quadratic-form estimate must actually be proved.

## 4. Audit of the frozen routes

### 4.1 The equality-conductor subsystem already has the right uniformity

The growing-transition equality-conductor Garding theorem does not pass
through fixed-pair limits.  In its notation it proves, on every admitted
zero-integral synthesis range and in the exact full exterior metric,

\[
 Q_{\rm eq}\succeq
 \left({L\over4}-{1\over4}\log L-C\right)D_{\rm full}. \tag{4.1}
\]

Its constant is independent of the number of labels.  Since
`L=log c+O(1)` on the locked schedule, (4.1) is already the required
dimension-free quarter-floor for the equality subsystem, including after
the exact endpoint shear.  A growing Toeplitz limit is not needed to
reprove (4.1).

The same theorem explicitly excludes unequal-sample correlations,
non-equality prime terms, reflected-tail correlations, the pole term,
compact projection terms, and their crosses.  It therefore supplies no
bound for `E_(M,c)` in (0.4) when that error denotes the complete signed
complement.

### 4.2 The fixed-prefix results have the wrong quantifier order

The fixed even-prefix synthesis theorem gives, for every fixed `M`, metric
equivalences with errors `O_M(lambda^(-8))` or smaller and fixed-dimensional
operator consequences.  It explicitly says that its constants and
thresholds depend on `M`.  The fixed label-`8/12` plane theorem is uniform
only on one two-dimensional unit sphere.  Neither provides a joint rate
when `M=M(c)`.

The weighted label-`4/12` theorem and its complete non-Archimedean companion
determine one fixed off-diagonal asymptotic.  They do not prove an
arbitrary-pair formula, a uniform label bound, or (0.10).  The resulting
nonzero cross is compatible with (0.3): it is one coefficient of the
positive Toeplitz main matrix, not a contradiction to its floor.

The diagonal covariance theorem permits a non-effective diagonal schedule
after taking every fixed-prefix threshold.  It explicitly does not give a
prescribed schedule `M asymp log c`.  Ordinary diagonal extraction cannot
supply the rate (0.10).

### 4.3 The near/far dilation sieves remain fixed-packet statements

Both ordered-prime dilation large-sieve theorems first prove scalar modal
Gram estimates and then synthesize a fixed `2m`-mode packet using

\[
 \left(\sum_\gamma|b_\gamma|\right)^2
 \leq2m\sum_\gamma|b_\gamma|^2.                        \tag{4.2}
\]

Their final constants are `C_m`, with no uniform control as `m` grows.
They also concern the specified transition packets; they are not stated
for the slowly growing low-label inventory `4,8,...,4M`.  Consequently
their pairwise sample-index Schur estimates cannot be inserted as a proof
of (0.6), (0.10), or (3.2) on the growing prefix.

### 4.4 The endpoint-null reduction identifies the missing block

The strict-PASS endpoint-null collective-dilation reduction already tracks
the loss in (4.2).  In its exact full exterior metric it defines the
operator-valued unequal-dilation blocks

\[
 \mathfrak K_{m,l}^{({\rm ctr},y)}
\quad\hbox{and}\quad
 \mathfrak K_{m,l}^{(\Delta,{\rm ctr},y)},              \tag{4.3}
\]

and asks for dimension-free block-Gram bounds (6.6)--(6.7) of that note.
Pairwise scalar modal bounds followed by (4.2) do not prove those bounds.
The present note neither repeats nor supersedes that reduction; it shows
the exact `o(log c)` negative-operator scale at which such a bound must
enter a Toeplitz/Garding floor argument.

## 5. Earliest remaining lemma

Write the exact exterior-white, endpoint-sheared complete matrix, whenever
its full decomposition has been justified, as

\[
 \widehat Q_{\rm full}
 =\widehat Q_{\rm eq}+\widehat Q_{\rm comp}.             \tag{5.1}
\]

Equation (4.1) reduces a growing positive-floor proof to the one-sided
operator estimate

\[
 \boxed{
 \| (\widehat Q_{\rm comp})_-\|=o(L),}                  \tag{5.2}
\]

or, more generally, to an explicit constant smaller than the available
quarter-margin.  It is unnecessary to prove a two-sided norm bound if the
positive part of the complement is large.

The earliest named missing analytic input toward (5.2) is the
dimension-free operator-valued unequal-dilation Gram estimate (6.6)--(6.7)
of the endpoint-null collective-dilation reduction, proved after the exact
endpoint-null projection and in the exact full exterior metric.  It must
then be assembled with every remaining central, higher-sampler, pole, and
projection block at the one-sided scale in (5.2).  No frozen theorem carries
out that complete assembly.

There is therefore no contradiction: the candidate Toeplitz floor is
rigorous, the equality subsystem already has its growing floor, and the
complete growing signed floor remains open precisely because the complement
has no dimension-free negative-operator estimate.  Fixed-entry limits and
fixed-plane positivity do not decide it.
