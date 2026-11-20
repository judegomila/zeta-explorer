# Actual selected-prefix obstruction to degree-uniform Hermite transfer

Status: independent analytical review PASS. This is an obstruction to uniform Hermite transfer, not to actual optimized dual positivity.

## 1. Scope and normalization

Retain the original full-theta shifted bridge density Lambda_a and actual monic selected polynomials p_n(t;a). This note works only in the independently positive exterior region a>=1/2+delta, delta>0. It does not assume critical-strip positivity. Let h_n=integral p_n^2 Lambda_a, beta_n=h_n/h_(n-1), and m_(2j)=integral t^(2j)Lambda_a. The spatial moments from EVENTUAL_SELECTED_DUAL_MARGIN satisfy m_(2j)/m_0=M_j/M_0; the common normalization cancels.

Use the already independently audited explicit constant
C_delta=pi/2+2/(1+delta)+2/delta+2[-zeta'/zeta](1+delta).
The exterior Ward estimate gives beta_j>=j^2/C_delta^2 for every j>=1, uniformly over this exterior region. All quantities here are actual selected norms, not positive-parent surrogates.

## 2. Prefix-only coefficient obstruction, both parities

Evenness of Lambda_a gives the monic recurrence
p_(j+1)=t p_j-beta_j p_(j-1).
Write p_n=t^n-B_n t^(n-2)+... for n>=2. Direct coefficient comparison gives

B_n=sum_(j=1)^(n-1) beta_j
   >=n(n-1)(2n-1)/(6 C_delta^2).                              (1)

Only known prefix norms through h_(n-1) enter this bound. In particular, no h_n sign is needed to compute B_n; exterior positivity is used independently to justify the Ward estimate on that prefix. The argument covers both parity ladders through the adjacent recurrence.

The large-shift Hermite limit instead has coefficient
B_n^Gaussian=a n(n-1)/2.
Consequently

B_n/B_n^Gaussian >=(2n-1)/(3a C_delta^2).                    (2)

For any fixed K>=1, a bounded-relative Hermite coefficient comparison
B_n<=K a n(n-1)/2
can hold only when

a >=(2n-1)/(3K C_delta^2).                                  (3)

For example, fix delta=1/2, so the domain is a>=1 and C_(1/2) is a fixed finite explicit constant. Every such comparison, with K independent of degree, requires a growing at least linearly with n. For each fixed exterior a the ratio in (2) tends to infinity.

This is not merely poor conditioning of a chosen basis or an artifact of coefficientwise interval bounds: it concerns an exact single coefficient of the actual selected monic polynomial. Equivalently B_n is one half of the sum of squared roots. No floating root computation is used.

## 3. Failure of uniform moment convergence

Because the exterior density is independently positive, the monic extremal property gives m_(2j)>=h_j. The audited Ward product bound implies

M_j/(M_0 a^j (2j-1)!!)
 >= (j!)^2/[(2j-1)!! (a C_delta^2)^j].                       (4)

The right side equals 2^j(j!)^3/[(2j)! (a C_delta^2)^j]. Stirling's formula yields, for fixed a and delta,

right side = sqrt(2) pi j [j/(2e a C_delta^2)]^j (1+O(1/j)). (5)

Thus the fixed-j moment convergence to Gaussian moments as a tends to infinity cannot be uniform in j at any fixed exterior shift. Equation (4), not the asymptotic, is the exact bound. The factorial constant in (5) is included only to quantify the mismatch.

## 4. What this rules out, and what it does not

The proof of eventual selected dual positivity uses fixed-degree Gaussian moment convergence and the resulting Hermite coefficients. Equations (2)-(5) show that making those comparisons bounded-relative uniformly in degree is impossible at a fixed exterior shift, already where the true bridge is positive. In particular, a proof that attempts to bring the same uniform Hermite approximation to a fixed critical shift needs a genuinely different estimate, not simply tighter numerical constants in the fixed-degree O_n(1/a) errors.

This does NOT show that the smallest shift at which the uncorrected canonical factor becomes positive grows linearly. It does NOT give a lower bound on the true threshold A_n of eventual margin positivity. Positive canonical or optimized margin could survive after Hermite approximation fails. It does NOT prove a negative optimized dual witness, or make a claim about fixed critical-shift coefficients, where this exterior proof cannot be applied.

The precise remaining alternatives are unchanged: construct a theta-specific supporting plane at fixed critical shift with an independently positive lower margin, or construct an exact zero-cross-moment atomic witness of nonpositive dual objective and separately prove the actual target pivot positive. The certified degree20 pointwise negativity establishes neither of those optimized-dual outcomes.

Dependencies: independently audited EXTERIOR_WARD_LOWER_BOUND.md and EVENTUAL_SELECTED_DUAL_MARGIN.md. No new numerical positivity certificate or external code is used.
