# Independent analytic audit and complete replay: X=16.001

> Curated source/review. Mathematical formulas and proof order are retained. Operational reviewer identifiers and private executor paths were removed; the manifest records original and published hashes. Historical receipt locations refer to the original audit layout. Current accepted scope is stated in the app module; internal review is not external peer review.


## Accepted theorem

**PASS: the generic analytic majorant and the complete independent numerical
pipeline both pass.** At the exact rational cutoff `X=16001/1000`, equivalently
`lambda=sqrt(16001/1000)`, the actual canonical closed reflection-even supported
Weil form is coercive:

    q_lambda[f] >= c_* ||f||_2^2

for some `c_*>0` on its entire zero-extension logarithmic Fourier form domain.
Exact centered zero extension gives the same positive constant on every smaller
centered even support, hence for all `1<lambda<=sqrt(16001/1000)`.

**No numerical value of c_* is extracted.** In particular neither a minimum
LDL pivot nor the previous lambda4 numerical floor is transplanted into this
new claim. No odd-sector positivity, global-ground identification, cofinal
support theorem, complexity theorem or RH result follows.

## Frozen source and evidence pins

The following paths are in `rh_attack_cycle_20261030/support_endpoint_continuity/`.

| File | SHA256 |
|---|---|
| `GENERIC_FULL_MAJORANT_METHOD.md` | `63a29ab9c8d308842ac3ffaea9a1bd13a90aae3ef7c07bd51ef496d5625f0627` |
| `generic_full_inputs.py` | `749dbde6154b03bf3ecf858fbdb0259d1476291fbd49d949e7a40f7ff1588c8e` |
| `certify_generic_X16001.py` | `f07fd6e12421b1f5e6db4ee12df902980128ce20f98b48371e32ea8d070e42a0` |
| `generic_actual_head_pilot.py` | `5f445ed152eefc96539b1af7f9b1d2deed1618a3e786f8658d8ef5aab2b427de` |
| `quadrature_near_moments_production.py` | `8a94380ef617b34d27902c9c1ae18e8dcc034d57d5a1f25652a23b2981834a04` |
| `compute_generic_moment_cache_v2.py` | `b8878ab8b70a5b96d4fc34022535bdd91ae61b6f48473bb3c1130b0b84842bf2` |
| `GENERIC_MOMENT_CACHE_V2.jsonl` | `124a650c0eb45aeda57e4de4b53e6e3cc76a1880a4e583458a78ff3ef65e26ce` |
| `GENERIC_MOMENT_CACHE_V2_META.json` | `e1832457d421cf6686db09a5743c0bead305a280c91bcf298c28754cbb83cf5e` |
| `GENERIC_MOMENT_CACHE_V2_COMPLETE.json` | `e62c6873fcad98776b519ccf32fd8b758440b8dad36e138ccbdbb0ca2c4a9c06` |
| `GENERIC_FULL_EVEN_CERTIFICATE.json` | `589f88eb475bd51023abacb58af4bbf473041b9c0610184c33561c5f14a396c2` |

The JSON receipt additionally pins the accepted all-W tail inputs, the previous
signed/step-weight majorant proof, the exact structured/factor routines, the
seventh-power prerequisite audit, and independent replay scripts/results.
Producer sources and numerical receipts were not edited by this reviewer.

## Complete independent execution, including every cached moment

The root-relative source layout and frozen cache were copied to
`independent_review/generic_full_majorant_replay_workspace/`. All hashes matched.
Only copied scripts wrote replay outputs. The existing python-flint 0.9.0
interpreter was used; precision remained fixed at 1000 bits.

1. **Actual-entry gate:** all non-timing fields match the producer. It checks
   the generic prime entries against literal physical translated-cosine
   integrals and the X16 specialization against the accepted builder.
2. **33-mode complete small gate:** all non-timing fields match, including the
   direct dense lower-surrogate test and generator/permutation checks.
3. **Every V2 scalar cache entry independently recomputed:** all **10,437**
   source-keyed rows reproduce every non-timing field exactly. All original
   roundtrip, finiteness and precision assertions were rerun; minimum retained
   accuracy is **942 bits**. This took 131.03 seconds with four workers. The
   frozen cache was not overwritten.
4. **Complete generic sign gate:** all **2049 core**, **72 coefficient-H**, and
   **72 whitened Schur** pivots pass. Minimum relative accuracies are
   **314/939/316 bits**. Replay took **236.36 seconds**, versus producer 207.83.
   Every non-timing field matches, including the permutation, interval strings,
   all source/cache maps, whole-tail floor and geometric remainder.

The full replay receipt SHA256 is
`caac1531f4bdccf5bd39170c162a73be46535b3ad0eba50b4839786b7b00c150`.
Executable comparison is `compare_generic_replays.py`; terminal comparison is
`INDEPENDENT_GENERIC_REPLAY_COMPARISON.json`. The complete scalar recomputation
is recorded separately in `INDEPENDENT_COMPLETE_CACHE_RECOMPUTATION.json`.

These are independent executions of the reviewed algorithms and Arb library,
not a separate arithmetic implementation or proof-assistant formalization.
The historical frozen-direction gate is supplemental and was not needed as a
substitute for any complete sign test. Its old near-null alignment is not
assumed to survive at the new support.

## 1. Actual generic entries and full infinite-tail comparison

The gamma and continuum entry formulas are the already accepted all-W formulas
with W replaced by the exact `log(16001/1000)`, with the same explicit 150-term
exponential-series remainder. The prime entries now sum all ten active prime
powers without old quarter/half-phase shortcuts. In particular, prime4's sine
is not set to zero, prime2/8 are not combined using an old alias, and prime16
is genuinely present.

The literal overlap integral proves the generic prime diagonal and off-diagonal
formulas for arbitrary integer indices, not merely the checked sample. For
example, the negative-prime diagonal for j>0 is `-pd+bprime_j/j`; the constant
diagonal is `-pd`. These follow directly from product-to-sum integration over
the actual overlap interval. The accepted displacement form therefore remains
valid for the new generic coefficients. The builder computes every b_j through
16385 and every head diagonal through 2048; no tail index is silently filled
by an old phase formula.

The independently accepted seventh-power bound gives the exact safe rational
envelope `Pschur=3.80364` for the full prime operator. The accepted all-W gamma
remainder bound and positive-kernel tail trace hold for W>=1, not just W=log16.
Together, in the even sector they give the actual form inequality

    D >= diag_(j>N) d_j,
    d_j=a(2pi j/W)-Gamma_ref(W)-Pschur-H_K(W)/N.

The even negative sinh pole vanishes; the positive pole is discarded only for
this lower estimate and is retained in actual head/coupling entries. The gamma
series proves d_j strictly increases for every future j. The certified initial
tail floor is greater than `0.7311865968`; the far denominator at J+1 is greater
than `2.8102009659`. Therefore positive inverse order supplies
`D^(-1)<=diag(1/d_j)` on the full tail. No sampled finite minimum or squared-
inverse ordering is substituted for this statement.

The global Euler coefficient bound remains

    |b_j-beta_j| <= C(W)/j,
    C(W)=[2W sinh^2(W/4)+1/2+55W^2/48]/pi^2 <1.3.

Here beta retains all ten exact sine phases. Its absolute envelope is below
1.88776, so for every j>=2, `|b_j|<1.88776+C(W)/2<2.51738<3`; b1 is explicitly
checked. Thus **B=3** is justified for the entire sequence. No old B=2 claim
is transplanted.

## 2. Exact phase algebra and conjugacy

For the 21 raw rational ratios,

    c_1=1/4, c_n=-i w_n/(2pi), c_(1/n)=conj(c_n),
    beta_j=sum_r c_r exp(2pi i j log r/W).

Their exact rational convolution has 193 keys. There are no additional exact
X-power aliases: every raw ratio is supported on primes 2,3,5,7,11,13, whereas
`gcd(16001,2*3*5*7*11*13)=1`. Thus a nontrivial power of X cannot equal a quotient
of two raw ratios. No near-identity channel may be relabeled as a mean.

Reviewer-written checks verify reciprocal conjugacy for all keys, compare
literal beta and beta-squared sums at representative near/far integer rows,
and independently verify the retained coefficients:

    q_1=1/16+sum_n w_n^2/(2pi^2),
    q_16=-(2w_2 w_8+w_4^2)/(4pi^2)-i w_16/(4pi),
    q_256=-w_16^2/(4pi^2).

For real inverse weights, `M_s(1/r)=conj(M_s(r))`. Therefore the code's signed
pairings `2Re(q_16 M_s(16))`, `2Re(q_256 M_s(256))`, and
`2Re(c_16 M_s(16))` have the correct conjugacy, sign and factor. They are not
absolute-value replacements or assumed favorable contributions.

## 3. Cache integrity, step endpoints, and global Abel error

The V2 primitive differs from the reviewed scalar pilot by the fixed tighter
950-bit quadrature target, not a different integral identity or tail formula.
The earlier 900-target attempt failed its required retained-accuracy gate and
is not mixed into V2. The V2 metadata binds exact X, J, U, arithmetic precision,
serialization digits, tolerance and primitive hash. The reader validates every
row, excludes duplicate keys and verifies exact coverage:

    ratio16:  p=2,...,143 at all 49 starts,
    ratio256: p=2,4,...,142 at all 49 starts.

This is precisely 10,437 entries. The underlying scaled integral enclosures and
their explicit incomplete-gamma tails were independently recomputed for every
key, so this audit does not merely trust a `roundtrip_contains_original` flag.

There are 48 finite bands `a_i<j<=a_(i+1)` from J to 64J, plus the infinite
plateau starting at 64J+1. Their weights `1/d_(a_i+1)` are positive,
nonincreasing, and majorize the actual inverse diagonal everywhere. Finite
differences of tails at A=a_i and A=a_(i+1) include exactly the intended integer
endpoints. The last infinite tail is retained, not truncated.

For `M_s(r)=J^(s-2) sum omega_j exp(i theta_r j)/j^s`, M_s(1) uses direct
weighted Hurwitz differences, and the retained signed phases use the complete
cache. The inverse weights are already in all M_s; there is no second division
by a tail floor.

Every nonretained phase has a strictly positive finite geometric denominator.
Because `omega_j/j^s` is globally nonincreasing, its entire Abel error is at most
the phase partial-sum bound times its **first** weighted term. The scaled entry
bound is at most `C omega_first/(J+1)^2`; the L-by-L matrix norm is at most L
times this bound. This proves

    delta_A=L C_AA omega_first/(J+1)^2,
    delta_X=L C_AC omega_first/(J+1)^2.

Only separated phases enter these constants. Retained channels are neither
omitted nor charged twice. The mixed error obeys
`2 delta_X||A||||C|| <= delta_X(sigma||A||^2+sigma^(-1)||C||^2)` for fixed
sigma=1/8, including arbitrary complex feature vectors.

## 4. Complete far matrix normalization and geometric remainder

The actual principal coupling is `sqrt(2)(-1)^j(b_j U_j-V_j)`, where

    U_j=sum_l A_l J^(2l)/j^(2l+1),
    V_j=sum_l C_l J^(2l+1)/j^(2l+2).

After the geometric Young split and the beta-error Young split, put
`kappa=2(1+eps)(1+epsb)`, eps=epsb=1/10. Direct expansion gives exactly

    H_AA[p,q]=kappa AA_(2p+2q+2)
       +2(1+eps)(1+1/epsb) Cbeta^2 M_(2p+2q+4)(1)/J^2,
    H_CC[p,q]=kappa M_(2p+2q+4)(1),
    H_AC[p,q]=-kappa AC_(2p+2q+3).

The source adds `kappa(delta_A+sigma delta_X)` to AA and
`kappa delta_X/sigma` to CC. The cross-block quadratic therefore carries the
required **minus twice** the retained beta mixed moment. The beta-error matrix
has the required `1/J^2`; CC's and AC's differing powers of J are not lost.
AA reaches order 142, AC order 143, and CC/beta-error use zero-phase order 144.

Expanding `(j^2-k^2)^(-1)` geometrically produces the displayed features P.
For the omitted terms, `|b_j|,|b_k|<B=3` gives the all-head remainder

    4 B^2 sum_(k=1)^N k^(4L)
       /[J^(4L+1)(4L+1)(1-N/(J+1))^2]
       *(1+1/eps)/d_(J+1).

This follows by the squared row-norm bound and the decreasing-power tail
integral; k=0 has no omitted geometric term. The safe first inverse denominator
is appropriate here. The resulting remainder is about `1.0219562e-133` and
is retained as an isotropic head charge.

Consequently, on every complex head vector,

    K*D^(-1)K <= K_near*diag(1/d_j)K_near + P*H P + rem I.

This is an upper majorant of the true full self-energy, not an asserted
additive split of the true inverse into separate near/far inverses.

## 5. Full sign and actual form-domain implication

The copied unmodified rank-four routine constructs
`C=A_head-K_near*diag(1/d_j)K_near-rem I` from every actual near row through J.
The legacy constant-coordinate lift is removed. Index zero belongs to the
2049-dimensional actual head. Arbitrary complex coefficients are covered by
the real symmetric matrix's Hermitian form.

The interval factor recursion encloses the exact factor H=F F*; residual overlap
is only a regression check. With Q=F*P, all complete sign tests prove

    C>0, I-Q C^(-1)Q*>0, hence C-P*H P>0.

Every sign decision uses a full outward interval; midpoints only choose pivot
order. The actual Schur complement is therefore strictly positive. No LDL
pivot is interpreted as its smallest eigenvalue.

The actual head vectors lie in the supported operator domain, and their tail
coupling K is bounded. D has a uniform positive floor. Square completion on
the entire form domain gives

    q[x+y]=<S_actual x,x>+q_D[y+D^(-1)Kx].

The finite positive Schur matrix has some positive minimum eigenvalue, and the
inverse triangular map is bounded. This supplies some positive whole-even
coercivity constant. The old continuum bound 6 at lambda4 is not silently used
to assign a new numerical constant at the enlarged support.

Exact zero extension from a smaller centered support preserves norm, evenness,
the logarithmic form domain and the actual arithmetic form. It therefore
transfers this same existential positive floor to every smaller support. The
newly active prime16 causes no exception to nesting: its correlation is zero
whenever the smaller support has no overlap at that shift.

## Preserved scope and execution record

This accepts the full physical even supported problem at one larger rational
cutoff, not merely a coefficient-space resonance inequality or positive finite
compression. The complete actual-domain tail and coupling analysis is essential.
No physical-complement conclusion is inferred from a finite norm alone.

No odd-sector, simplicity/ground-state, cofinal-support, generic next-support,
asymptotic-cost or RH claim is made. Further support changes require new actual
inputs and complete gates. The prior lambda4 quantitative floor remains a
separate theorem; this new full test does not quantify its own floor.

