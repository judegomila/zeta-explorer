# Independent audit: proper-power credit tail, prime memory, and prime-only flow

> Curated mathematical source, 30 October 2026. Historical numerical cutoffs and producer statements below retain their original scope; the app module and bundled review identify the accepted current result. Internal review is not external peer review. References to original audit workspaces describe historical evidence; the publication manifest identifies which files are included here. Source and publication hashes are recorded in the manifest.

## Result first

**PASS for claims (A)–(E), their displayed explicit tail bounds, and the separate prime-only flow addendum.** The claimed reduction is unconditional, retains the audited pre-event convention, and imports no RH-quality prime error. The ordinary-prime signed-prefix problem remains unproved and RH-strength.

**Storage-scope qualification:** the parent note's final storage exclusion is rigorous for potentials that actually tend to a finite limit—for example fixed stable exponential filters of the relative theta error, followed by a map continuous at the limiting zero state. Boundedness and “made only from” a vanishing error, without those regularity/stability restrictions, do **not** imply convergence. The audit does not endorse an exclusion of arbitrary bounded nonlinear/state-dependent, singular-gain, or explicitly time-dependent storage.

Copied-source replays at 192 and 256 bits pass and reproduce the producer JSON files **byte for byte**. A separately written 384-bit check passes 13 symbolic identities and additional scalar onset inequalities. These receipts certify algebra and finitely many scalar inequalities, not primes at huge cutoffs, a signed-prefix estimate, or a new positivity range.

### Exact producer pins

- `PROPER_POWER_CREDIT_TAIL_AND_PRIME_MEMORY.md`: `1a933084ef789e42fcca1273c6f45a9f46c13b5d9f772debe44f8157582ba57d`
- `check_prime_only_algebra.py`: `60425e59e6b39f7037170d55bed2cc047f73149ec976eff400e170d5c866f557`
- `PRIME_ONLY_ALGEBRA_192BIT.json`: `f452ed6816194782161f37385fdb7196da547773e5c3ce5d68059f7c0dce5052`
- `PRIME_ONLY_ALGEBRA_256BIT.json`: `30adbfee615fb1ca4998591a13ff4e57ec29fd7aaf5204bed3216cba2509ba7e`
- Separate `PRIME_ONLY_RESERVE_FLOW_ADDENDUM.md`: `6140f2c37f0c24bddbabc443d2c1c9f9ab4ffedbf448e133d0f976ece03021a4`

Frozen copies of these files are in `source_snapshot/`. The main-note pin was unchanged when the addendum was added and on completion of this review. Additional dependency hashes and replay comparisons are recorded in `PROVENANCE_AND_REPLAY.json`.

## 1. Normalization and admissible input

I compared the note with `../../suzuki_recurrence_attack/CLOSED_RESERVE_AND_SUMMABLE_DEBT.md`, `../SUZUKI_BREGMAN_CREDIT_REDUCTION.md`, and the two signed-credit/storage notes listed in the provenance receipt.

With `w=Lambda(q)/sqrt(q)`, `H=S(q-)-b`, and `F(H)=2H[log(H/2)-1]`, the original exact increment is

    Delta R = w log q - [F(H+w)-F(H)]
            = w[log q-2 log(H/2)] - d(H,w),
    d(H,w)=2H[(1+w/H)log(1+w/H)-w/H].

This is exactly the credit used in the new note; `Lambda(p^k)=log p`, not `k log p`. The pre-event value is essential. No post-event predictor was silently substituted. The recurrence begins after the event 2; allowing a formal credit at 2 changes only a finite initial constant. For real X, R(X) is the right-continuous event reserve held constant between prime-power events.

The existing debt proof gives nonnegative summable debts. Its upper Chebyshev input also gives `2<H(q-)<6 sqrt(q)` because `-3<b<-2` and `S(x)<=6 sqrt(x)-3`.

I reopened [Fiori–Kadiri–Swidinsky, Corollary 1.4, v3](https://arxiv.org/html/2204.02588v3#S1.SS2) on 30 October 2026. Its constants are exactly `A=9.22022`, `c=0.8476836`, with the asserted strict bound for all `x>2`. Replacing strict inequality by weak inequality is harmless. The paper expressly uses published finite-height verification; this is an unconditional theorem, not an assumption of RH or of an unverified all-height estimate. The audit does not re-certify that external theorem's computation.

The input `psi(x)-x=O(x log(x)^(3/2) exp(-c sqrt(log x)))` is much weaker than square-root-size error. The Laurent expansion used to identify the constant at s=1 is likewise not an RH-strength import.

## 2. Relative predictor estimate and both proper-power tails

The lower constant in the exact partial summation identity is correctly `-1`:

    S(q)-2 sqrt(q) = -1 + E(q)/sqrt(q)
                         + (1/2) integral_1^q E(v)v^(-3/2) dv.

Subtracting b and the pre-event jump and dividing by `2 sqrt(q)` gives the note's error terms. Splitting at `sqrt(q)`, the low integral contributes at most `exp(-r/4)`, the constant contributes less than `exp(-r/2)`, and the omitted jump contributes at most `(r/2)exp(-r)`. The point term and high integral together are at most `A r^(3/2)exp(-c sqrt(r/2))`.

For `r>=512`, `c/sqrt(2)>0.59`, `A<10`, and

    exp(-r/4) + (r/2)exp(-3r/4) <= 1

show the final envelope `Delta(r)=10r^(3/2)exp(-0.59 sqrt(r))+2exp(-r/4)`. Both summands decrease there. Independent Arb evaluation gives `Delta(512)=0.18450033528...<0.185<1/4`. Thus

    2|log(1+delta)| <= (8/3)|delta| <= (8/3)Delta(r)
                   <= 30 r^(3/2)exp(-0.59 sqrt(r)).

The last step uses `2exp(-r/4)<=r^(3/2)exp(-0.59 sqrt(r))` and `88/3<30`. The required decreasing ratios and their onset inequalities check.

### Squares

Put `f(v)=30v^(3/2)exp(-a sqrt(v))`, `a=0.59`, and `Y=exp(L/2)`. The square weight is exactly

    (log p)/p * f(2 log p).

For `g(y)=f(2log y)/y`, integration over `[Y,infinity)` gives the lower boundary `-theta(Y-)g(Y)`, which is nonpositive even when Y is a prime. Dropping that boundary and using `theta(y)<=3y` yields

    integral_[Y,infinity) g dtheta
      <= 3 f(L) + (3/2) integral_L^infinity f(v) dv.

The substitution `v=s^2` gives exactly the polynomial and coefficient 90 in T2(L). There is no lost lower-endpoint prime atom and no missing factor of two.

### Exponents at least three

The elementary count `R3(x)<=x^(1/3)(log x)^2/log 2` is safely coarse. From `1<(H/2)^2<9q`, the credit logarithm lies between `-log 9` and `log q`; hence its absolute value is at most `log q` on the chosen range.

The decreasing weight `(log x)/sqrt(x)` gives

    tail <= [1/(2log 2)] integral_exp(L)^infinity x^(-7/6)(log x)^3 dx.

Its antiderivative is exactly T3(L). Again the lower boundary is nonpositive and the upper boundary vanishes. Both T2 and T3 tend to zero; their sum has the stated `O(L^2 exp(-0.59 sqrt L))` order. Earlier credits are a finite collection with positive predictors. This proves absolute summability (A).

## 3. Memory identity and the constant kappa

The even/odd split is exact:

    B(r) = sum_(n<=exp(r/2)) Lambda(n)/n
           + sum_(p^k<=exp r, k>=3 odd) log(p)/p^(k/2).

In the first term, `n=p^j` represents the original even exponent `2j`; there is no extra j or factor of two in Lambda. The complete odd sum is `sum_p log p/[sqrt(p)(p-1)]`, absolutely convergent by comparison with `sum_n log n/n^(3/2)`.

For `A1(y)=sum_(n<=y)Lambda(n)/n`, partial summation gives

    A1(y)=log y+C+E(y)/y-integral_y^infinity E(v)/v^2 dv,
    C=1+integral_1^infinity E(v)/v^2 dv.

The integral converges under the cited PNT error. Abel summation of this asymptotic gives `-zeta'/zeta(1+epsilon)=1/epsilon+C+o(1)`. Its Laurent constant is `-gamma`, so

    kappa = -gamma + sum_p log p/[sqrt(p)(p-1)].

The sign is correct. The odd missing tail uses weight `x^(-1/2)` and is bounded by

    [1/(2log 2)] integral_exp(r)^infinity x^(-7/6)(log x)^2 dx,

which is exactly the second term of B0(r). The even remainder is bounded by `A J_c(r/2)`. These prove the stated memory bound, including its exponent and polynomial order. In particular the memory itself grows as r/2 even though its event-credit variation is finite.

## 4. Summable prime replacement and real-cutoff reserve identity

At an ordinary prime no proper power equals p, so the strict pre-event identity (11) is exact. Since `kappa>-1` and `-b>2`, the replacement predictor is positive at every prime, including 2.

Here is an explicit derivation of the abbreviated coarse memory estimate:

    R2(x) <= sqrt(x)(log x)^2/log 2
    implies B(r) <= r^2/log 2 + r^3/(6log 2) <= r^3,  r>=6.

The final scalar inequality follows already from `1/(3log 2)<1` at r=6 and improves thereafter. Together with `H>=1.5 sqrt(p)` and `exp(r/2)>=4r^3`, this gives `H_p^(0)>=1.25 sqrt(p)` and `H_tilde>=sqrt(p)` on the tail. The mean-value bound

    |c_p-c_tilde_p| <= 2(log p)/p * B0(log p)

is therefore justified. B0 decreases on this range: the derivative of its J term has the sign of `f'-f<0`, and the odd-tail derivative is negative.

Stieltjes integration of `B0(log x)/x` against theta, retaining the endpoint convention, gives exactly

    sum_(p>=exp L)|c_p-c_tilde_p|
        <= 6[B0(L)+integral_L^infinity B0(r)dr].

This is finite and has the claimed order. Combining it with the proper-power tail and the existing debt tail proves (C) and (D), for every real cutoff, not merely a subsequence. It proves convergence of the **difference**, not boundedness or convergence of either term separately.

The prior theorem establishing both infinite Jordan sums transfers because the deleted proper-power terms and the ordinary-prime perturbations have finite absolute total. No implication about the signs of individual proper-power credits is needed.

## 5. Naive-deletion drift

The identity

    c_p^(0)-c_p = 2(log p)/sqrt(p) * log(1+B/H_p^(0)) >= 0

has the correct sign. Taylor expansion, the predictor lower bound, and `B<=r^3` give precisely the three summable error classes stated in the note. In particular, the main linearized term is

    (log p)/p * (r/2+kappa),

not twice that term.

To check the two prime partial sums used here, write `E_theta=theta-x`. The elementary proper-power count gives

    |E_theta(exp r)|exp(-r)
      <= A r^(3/2)exp(-c sqrt r) + r^2 exp(-r/2)/log 2.

Partial summation thus gives `sum_(p<=X)log p/p=log X+C_theta+rho(log X)`, where rho is integrable on the log scale and `r rho(r)->0`. Applying partial summation once more gives

    sum_(p<=X)(log p)^2/p = (log X)^2/2+C1+o(1).

The `C_theta log X` contributions cancel. Consequently the drift is exactly

    (log X)^2/4 + kappa log X + C0 + o(1).

There is no unaccounted linear logarithmic term. The finitely omitted prime 2 only changes C0. This establishes (E), not merely its leading quadratic coefficient.

## 6. Separate addendum: exact flow and convergence constant

The addendum is separately pinned above and was not silently incorporated into the main-note hash.

For `H_*=P+r/2+kappa-b`, global positivity follows from `kappa-b>1`. Differentiation between ordinary-prime events gives

    Rcal'(r)=r/2-log(H_*/2),

exactly its equation (2). At a prime, `Delta J_P=r w` and `Delta H_*=w`, giving precisely `c_tilde_p-d(H_*,w)` with the pre-event H. At a proper power there is no jump in Rcal.

The parent's relative-error proof applies directly to the right-continuous full sum at every real x; the event-only subtraction is simply absent. Subtracting the exponentially small relative memory error then proves the addendum's uniform `H_*/(2exp(r/2))=1+O(r^(3/2)exp(-0.59 sqrt r))`. Thus the continuous derivative is absolutely integrable on the infinite tail. On every compact interval there are finitely many jumps and H_* stays positive, so there is no near-origin integrability problem. The prime debts satisfy a convergent bound by `sum_(n>=2)(log n)^2/n^(3/2)`.

Let `epsilon=B-r/2-kappa` on all r>=0. It is integrable and `r epsilon(r)->0`; its finite initial piece causes no difficulty. The exact Stieltjes moment identity is

    J_B(r)=rB(r)-integral_0^r B(u)du
          =r^2/4+C_J+r epsilon(r)+integral_r^infinity epsilon(u)du,
    C_J=-integral_0^infinity epsilon(u)du.

No boundary atom occurs at r=0 because B(0)=0. The weighted moment is correctly `k(log p)^2/p^(k/2)`. The kappa-r terms cancel in this moment, rather than producing an extra linear term.

Finally `H_full=H_*+epsilon`, and `F'(H)=2log(H/2)=O(r)` uniformly between these two asymptotic predictors. Hence `F(H_full)-F(H_*)=O(r|epsilon|)->0`. This proves the addendum's precise limit

    R(exp r)-Rcal(r) -> C_J.

This is stronger than merely knowing both reserves differ from the signed-prime sum by unspecified convergent terms. It still supplies no all-scale bound on either reserve.

## 7. Exact storage exclusion and its limitations

The rigorous general statement supported by the calculation is:

> No prime-event potential tending to a finite limit can represent the remaining prime credits with an ordinarily convergent cumulative remainder.

Indeed such a representation would make the prime-credit prefix converge. Equation (D), or the addendum, would force the original reserve to converge, contradicting the already established reserve-oscillation dichotomy.

For a concrete filter class, let `e_theta(r)=(theta(exp r)-exp r)exp(-r)`. It tends to zero. Every fixed stable causal exponential state

    Z_lambda(r)=exp(-lambda r)Z_lambda(0)
                + integral_0^r exp(-lambda(r-s))e_theta(s)ds,
    lambda>0,

also tends to zero. A fixed finite-dimensional potential `Phi(Z_lambda1,...,Z_lambdam)` continuous at zero therefore tends to `Phi(0)` and is excluded if its cumulative remainder converges. The same argument allows an additional correction with a finite limit.

But a bounded function of an input tending to zero need not converge: singular maps such as `sin(log z)` on positive z approaching zero demonstrate why continuity at the limiting state matters. This observation is a limitation of the inference, not a constructed storage for the actual primes. Unstable or time-dependent gains, noncontinuous maps, general nonlinear state-dependent controls, and nonconvergent remainders with a proved one-sided prefix bound are not excluded by this argument.

The producer's reference to the original signed task is appropriate: a one-sided-prefix bound for such a remainder is additional arithmetic content, not a consequence of small relative PNT error. The earlier positive-filter and constant convex-energy obstructions retain only their explicitly stated classes.

## 8. Reproducibility and disposition

Artifacts in this review directory:

- `source_snapshot/`: pinned producer copies;
- `REPLAY_192BIT.json`, `REPLAY_256BIT.json`: copied-source runs, byte-identical to the respective producer receipts;
- `independent_symbolic_checks.py`, `INDEPENDENT_CHECKS_384BIT.json`: separately written identity and scalar checks;
- `PROVENANCE_AND_REPLAY.json`: hashes, dependencies, command scope, comparison results, and source verification;
- `SHA256SUMS`: review-file integrity manifest.

The code does not prove the analytic Stieltjes inequalities or all-real-scale monotonicity merely by testing sample values; those arguments are supplied above. Neither the producer nor audit receipts enumerate primes, establish a new positivity interval, or verify an all-scale arithmetic cancellation claim.

**Disposition:** accept the prime-memory reduction and the exact prime-only reserve flow as unconditional results, with the narrow storage interpretation recorded in Section 7. No new RH conclusion and no change to the whole-even support endpoint is supported.
