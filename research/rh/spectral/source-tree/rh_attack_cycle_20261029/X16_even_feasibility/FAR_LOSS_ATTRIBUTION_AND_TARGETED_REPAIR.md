# X16: adversarial far-loss attribution and one supported repair

> Curated source/review. Mathematical formulas and proof order are retained. Operational reviewer identifiers and private executor paths were removed; the manifest records original and published hashes. Historical receipt locations refer to the original audit layout. Current accepted scope is stated in the app module; internal review is not external peer review.

29 October 2026. **Producer interval results complete; final independent signed/weighted replay pending.** This is a targeted finite-vector/full-tail budget result, not a new full-space positivity certificate. The earlier X16 strict-surrogate-failure/finite-compression checkpoint and accepted X12 theorem remain frozen.

## Findings first

The historically saved lambda4,N128 vector was a **miss**: its old lower-surrogate Rayleigh remained positive. It cannot explain the failed first far-Schur feature. A single authorized reconstruction of `C^-1Q^T e0` instead produced a new exact-decimal frozen head vector v, and direct Arb evaluation verifies that it **does** reproduce the failure.

For this essentially unit-normalized rational v:

- Actual head Rayleigh: `+1.84854868916e-74`.
- Original weighted near upper charge: `1.76030231594e-74`.
- Positive original core quadratic: `8.82463732266e-76`.
- Original complete lower-surrogate Rayleigh: `-1.31393087812e-75`.

The original far **estimate components**, not separate physical operator energies, have shares:

| Analytic upper-bound component | Share |
|---|---:|
| Mean beta² AA term, with Young factor |83.71610%|
| AA oscillation allowance |8.82623%|
| CC term, with Young factor |7.45766%|
| beta-to-b error |0.00001744%|
| Isotropic geometric remainder |about1.68e-13%|

Thus polishing beta-error or the isotropic remainder cannot materially repair this witness. AA and CC denote the two **moment-vector pieces** of the analytic tail expansion; they are not the physical archimedean and prime operators.

The controlled sequence of scalar tests is:

| Same frozen v; all relevant charges included | Lower-surrogate Rayleigh |
|---|---:|
| Original J8192, separated AA/CC, constant far inverse |`-1.31393e-75`|
| J8192, signed mean A–C restored, mixed oscillation bounded |`-5.05624e-76`|
| J16384, actual added near rows, original separated far bound |`-3.98311e-76`|
| J16384, actual added near rows, signed cross, constant inverse |`-7.48296e-77`|
| **J16384, signed cross and fixed monotone step inverse weights** |**`+6.89844e-78`**|

J doubling alone is therefore **rejected as a repair**, with no need to repeat a full matrix test: its proposed scalar lower bound already fails on this exact rational witness. Restoring the signed cross term alone also fails. The final combined majorant repairs this witnessed obstruction with a positive outward margin. It does not establish the sign of the complete new head matrix or the actual full operator atlambda4.

## 1. Provenance, adversarial selection, and actual geometry

`core_direction/extract_core_witness.py` makes one single-RHS diagnostic solve, not another full positivity sweep. Its RHS is exactly the first natural-order whitened feature

    q0 = P_mom^T H[:,0]/sqrt(H00).

The accepted core recurrence is reused with the same source/inputs, and its inverse-energy interval agrees with `S00=2.30298311051148...`. Original-index triangular-factor columns are saved as640-bit midpoint dyadics, with250-digit forward-solve entries. These are **discovery data only**. The final normalized180-digit decimal coordinates define an exact rational vector independently of any reconstruction accuracy claim.

`certify_X16_core_witness_budget.py` directly evaluates that frozen vector afresh: actual signed head form, full weighted near charge and rigorous infinite far majorant. Its strict negative old-surrogate value is the evidence that the frozen vector captures the obstruction; the discovery identity alone is not used to certify its sign.

The former N128 proposal has phase-aligned L2 distance about`0.00011396144` from this new frozen vector, while the new vector's squared mass above index128 is only`2.58706e-75`. These are exact finite-vector geometry checks. Neither vector is asserted to be an actual eigenvector. They demonstrate how a small rotation within retained low modes can matter even when the added Fourier mass is minute.

The N128 miss is retained in `X16_FIXED_TRIAL_REPAIR_BUDGET.json`; it is not silently replaced or mislabeled as a first-Schur witness.

## 2. J changes alter both budgets

For the frozen v, moving J from8192 to16384 directly evaluates every added **actual signed** coupling row, with the valid diagonal inverse upper weight. The added near charge is

    5.28315776895e-76.

The far denominator, moment scales, phase-error allowance and geometric remainder are all recomputed at the new J. The remaining old-style far charge is`7.52458981252e-76`, leaving a still negative scalar lower bound. This comparison never treats the original core C as fixed under a J change.

The actual intermediate finite-space operator positivity from the earlier checkpoint remains valid. These additional scalar calculations make no enlarged finite-matrix positivity claim.

## 3. Signed mean cross terms: the sign is adverse here

Let the accepted even tail expansion use real moment vectors A,C, with

    U_j=sum_(l<L) A_l J^(2l)/j^(2l+1),
    V_j=sum_(l<L) C_l J^(2l+1)/j^(2l+2).

Its principal actual coupling is `sqrt(2)(-1)^j(b_j U_j-V_j)`. The remainder is the already bounded geometric tail. Write `b_j=beta_j+e_j`, `|e_j|<=Cbeta/j`, with Cbeta13/10. The exact phase means are `mean beta=1/4` and `mean beta²=m`.

Define the usual HA,HC and the mixed matrix

    HX_lp=J^(2l+2p+1) zeta(2l+2p+3,J+1).

The mean principal expression is

    m A^T HA A + C^T HC C - (1/2) A^T HX C.

It is PSD because pointwise its mean covariance is `(m-1/16)U²+(V-U/4)²`. The linear phase Dirichlet constant

    Clin=sum_(nonconstant beta keys r) 2|c_r|/|1-exp(i theta_r)|
        =2.57288289980...

bounds the mixed oscillatory matrix by `delta_lin=L Clin/(J+1)²`. Thus the scalar allowance is `2 delta_lin ||A|| ||C||`, alongside the existing AA oscillation allowance. The original beta-error and geometric-remainder terms remain.

On this witness A0 is positive and C0 negative. The mixed mean `A^T HX C` is **negative**, so its retained contribution adds charge; it is not a beneficial cancellation. Nevertheless exact retention is substantially smaller than the worst-case AA/CC Young separation. At J16384 the signed/constant-inverse far upper is`4.28977580840e-76`, still too large for the remaining core. The numerical scalar construction and its analytic allowances are in `check_signed_cross_moment_budget.py` and its receipt.

## 4. Monotone step inverse weights with one global Abel allowance

For the **final single partition**, fix J16384 and divide each of six dyadic octaves `[2^o J,2^(o+1)J]`, o=0,...,5, into eight equal integer subintervals. There are48 finite bands; beyond64J retain one final constant weight.

For a finite band `a<j<=b`, put

    w_j=1/d_(a+1),

and beyond64J put `w_j=1/d_(64J+1)`. Here the exact entire-tail denominator is

    d_j=Re psi(5/4+i*pi*j/W)-log(pi)-Gamma_ref(W)-Pschur-H_K(W)/N.

The non-j terms are constant, including H_K/N. The positive digamma-series derivative
`d/dt Re psi(a+it)=sum_(k>=0)2t(k+a)/[(k+a)^2+t^2]^2>0` for a=5/4,t>0 proves strict monotonicity at every future index, not only sampled band endpoints. Hence `w_j>=1/d_j` and w_j is nonnegative and nonincreasing. The exact inverse-order self-energy bound therefore remains valid after this substitution. More precisely, this is the far contribution to the **diagonal-inverse majorant for the full N-tail self-energy**. The true inverse D_N^-1 is not split additively into independent near and far pieces. The complete upper bound is the near diagonal-inverse charge plus this weighted far contribution and the geometric remainder. No ordinary polylog is substituted for a weighted tail sum.

For every required integer p>=2 evaluate

    M_p=sum_bands [zeta(p,a+1)-zeta(p,b+1)]/d_(a+1)
                 +zeta(p,64J+1)/d_(64J+1)

directly in Arb. The weighted HA,HC,HX use these exact step-weight moments with the same powers of J as above.

Crucially, `w_j/j^p` is globally nonincreasing. The Abel/Dirichlet bound is therefore controlled **once** by its initial value:

    |sum_(j>J) oscillation_j w_j/j^p|
       <= C w_(J+1)/(J+1)^p.

It is not the sum of48 separate oscillation penalties. Thus the AA and mixed matrix allowances are

    delta_A=L Cosc w_first/(J+1)²,
    delta_X=L Clin w_first/(J+1)².

For a fixed rational sigma=1/8, valid for every head vector,

    2 delta_X ||A|| ||C||
       <=delta_X [sigma||A||²+sigma^-1||C||²].

The final analytic coefficient matrix has blocks

    H_AA=2(1+eps_b)(1+eps)[m HA_weighted
                           +(delta_A+sigma delta_X)I]
          +2(1+1/eps_b)(1+eps) Cbeta² HC_weighted/J²,
    H_CC=2(1+eps_b)(1+eps)[HC_weighted+sigma^-1 delta_X I],
    H_AC=-(1+eps_b)(1+eps) HX_weighted/2.

These formulas include the inverse weights already: **there is no second division by d_first** in their principal or beta-error terms. The geometric remainder may safely retain the original first-denominator bound, since every step weight is at most w_first. All72 coefficient-matrix pivots pass in an outward factorization.

This construction is an analytic all-head quadratic/Loewner upper majorant for the far self-energy. It is **not claimed to be Loewner-smaller than the previous majorant in every direction**. Only the frozen witness has been evaluated against it in this pass.

## 5. Supported next action and stopping condition

On the witnessed vector, the final far upper is

    3.47249516868e-76,

versus the available post-added-near budget about`3.54148e-76`, leaving the positive scalar margin`6.89844e-78`. It is about19.05% below the signed/constant-floor scalar bound (despite using a fixed universal sigma rather than vector-optimal mixed Young). Compared with the separated bound at the same J, it is about46.15% as large.

The **one justified candidate repair** is therefore the specified combination: retain actual added near rows throughJ16384, restore the signed mean mixed moment, and use this fixed monotone inverse-weight partition with global Abel error. A future full structured test of this new valid majorant is warranted by a repaired adversarial witness, but it can still fail on another direction. No such full retry has been run at this scalar checkpoint. Parent has now conditionally authorized one separate full modified-majorant test after independent proof, source and small-dense gates; it is not part of the scalar result.

This scalar checkpoint stops at the independently reproducible targeted bound; any later authorized full test is a separate result. It makes no support extension, actual eigenvalue floor, actual-negative-mode, global-ground, cofinal or RH claim. It rejects blind J doubling, beta/remainder polishing and presumed favorable cross cancellation as unsupported repairs.

## Files and replay

- `core_direction/X16_CORE_INVERSE_FROZEN_TRIAL.json`: exact rational witness.
- `X16_CORE_WITNESS_REPAIR_BUDGET.json`: actual head, near/far shares and honest J-doubling test.
- `X16_SIGNED_CROSS_MOMENT_BUDGET.json`: signed mean cross test, still failing.
- `X16_WEIGHTED_SIGNED_CROSS_BUDGET.json`: fixed-partition combined repair on this witness.
- `check_frozen_vector_geometry.py`: exact finite-vector geometry only.

The three budget scripts pin frozen inputs and imported actual/structured source hashes. Verification can start from the frozen witness; it need not repeat the factor discovery. The saved dyadic factors permit reproducing discovery without another factorization, but are not trusted by the final sign calculation. All files remain local; accepted sources and V5 were not changed.
