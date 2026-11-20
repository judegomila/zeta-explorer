# Independent audit: weighted prime-credit variation and block freezing

> Curated mathematical source, 30 October 2026. Historical numerical cutoffs and producer statements below retain their original scope; the app module and bundled review identify the accepted current result. Internal review is not external peer review. References to original audit workspaces describe historical evidence; the publication manifest identifies which files are included here. Source and publication hashes are recorded in the manifest.

## Result first

**PASS for the mathematical estimates (1)–(3), the finite-total-error freezing conclusion, and the exact rank-class convergence statements.** In particular, for B=3 the future freezing-error bound is exactly `6/L^2+17/(2L)`, with no missing factor, prime-count term, or unfinished-block excursion.

The all-prefix interpretation requires combining **both** facts proved in the source: the absolute summability of within-block errors and the vanishing bound on the unfinished frozen contribution. I supply that argument explicitly below. Rank-class offsets really converge; mere boundedness is not being substituted for convergence.

**Minor receipt-scope qualification:** the producer's last evidence paragraph says its script verifies “derivative/jump algebra,” but the pinned script's six symbolic checks do not include an event-jump identity. That jump is correct analytically. The separate independent check here explicitly verifies it, along with nine other identities. No mathematical theorem needs correction; the producer receipt should not itself be described as having checked a jump identity it does not contain.

Copied-source 192/256-bit replays pass and match the producer receipts byte-for-byte. The separate 384-bit verification also passes. None of these computations enumerates primes, certifies a new positivity range, or bounds the retained signed prefixes.

### Producer pins

- `WEIGHTED_CREDIT_VARIATION_AND_CRITICAL_BLOCK_FREEZING.md`: `d9cc475ebec5115d1dc1b4d770a3857381a19af73909c5e862dbd7d0fbd40579`
- `check_variation_constants.py`: `ffa49b6c7c5fe987c4873468a08d5d400dfa8c95e411241b46cc383336ab26f8`
- `VARIATION_CHECKS_192BIT.json`: `bfbf65589b78c04483c7a1193c65fb840aa7f96057a17025e914f764dba7ac05`
- `VARIATION_CHECKS_256BIT.json`: `c0dced9252e0ddc10e8efcf5b0282cf47ecd60664ae6546015b83521decef0d3`

Frozen copies are in `source_snapshot/`; dependency pins and comparisons are in `PROVENANCE_AND_REPLAY.json`.

## 1. State normalization and every-real-point envelope

The state includes all ordinary primes in P, including 2, even though the credit sequence under study begins with primes greater than 2. At an included event `r_n=log p_n`,

    H(r_n-)=sum_(p<p_n)log p/sqrt p + r_n/2+kappa-b,
    c_n=f(r_n-).

This agrees with the independently audited renormalized predictor. Its event jump is `w(r_n)`, not a proper-power jump; between ordinary primes its derivative is exactly 1/2. The `r/2` memory and `r^2/4` moment counterterms are not lost.

For r>=512, the existing full weighted-state estimate applies to either one-sided state at every real point. Its proof is the exact partial-summation formula with either the event subtraction or zero subtraction, not interpolation between sampled events. Therefore

    1.5 exp(r/2) <= H_full(r-) <= H_full(r) < 6 exp(r/2).

Writing `P-b=H_full-B` and using `0<=B<=r^3` gives the lower prime-only base state `P-b>=1.25 exp(r/2)` because `exp(r/2)>=4r^3`. The upper base state is at most `6exp(r/2)`.

The elementary kappa bounds are valid. For `g(x)=log(x)x^(-3/2)`, its derivative is negative on x>=2 because `log 2>2/3`. Its integral over `[1,infinity)` is 4, and g(2)<1. Hence

    sum_p log p/[sqrt p(p-1)]
      <=2 sum_(n>=2)g(n)<10,
    -1<kappa<10.

The estimate `r/2+10<exp(r/2)` holds at 512 and persists because the difference has positive derivative thereafter. Adding `r/2+kappa` therefore yields the claimed right/left bounds

    exp(r/2) <= H(r-) <= H(r) <=7 exp(r/2).

The lower bound is deliberately weaker than the available 1.25 coefficient on this range. From `H/(2exp(r/2))` in `[1/2,7/2]`, `|ell|<=3` follows from `2log(7/2)<3`; the other endpoint is smaller. Thus `|c_n|<=3r_n exp(-r_n/2)` and c_n tends to zero.

The existing PNT input is the unconditional Fiori–Kadiri–Swidinsky estimate previously checked in the prime-memory audit. No new RH-size prime error or gap hypothesis enters.

## 2. Derivative, jump, and exact neighbor indexing

For `w=r exp(-r/2)` and `ell=r-2log(H/2)`, the chain rule on an open prime gap is

    f'=w'ell+w(1-1/H).

This uses `H'=1/2`; the derivative term would be wrong if the logarithmic memory were omitted. Since H>=1, `|1-1/H|<=1`, and since `|w'|<=(r/2)exp(-r/2)`,

    |f'| <=(5/2)r exp(-r/2).

At a prime, r and w are fixed while H increases by w. Consequently

    f(r+)-f(r-)=-2w log(1+w/H),
    |jump|<=2w^2/H<=2r^2 exp(-3r/2).

This is a downward jump and uses the **pre-event** H. The new independent symbolic check verifies this exact jump identity; the analytic bound is the elementary `log(1+t)<=t` for t>=0.

The identity connecting successive pre-event credits is exactly

    c_(n+1)-c_n = jump_at_r_n + integral_(r_n)^(r_(n+1)) f'(r)dr.

The jump at r_n is included and the jump at r_(n+1) is not. There is no intervening ordinary-prime jump. Proper-power times cause no jump in this prime-only state. This verifies the indexing needed for the tail sums, including an event exactly at the lower cutoff.

## 3. Weighted total variation and constants

For a nonnegative increasing log-scale weight G,

    G(r_n)|Delta c_n|
      <= G(r_n)|jump_n| + integral_(r_n)^(r_(n+1)) G(r)|f'(r)|dr.

The intervals are disjoint. Summing finite partial tails and then passing to a monotone limit proves equation (11). Extending the continuous integral down to L when the first prime lies strictly above exp L only enlarges it. No endpoint atom is dropped from the jump sum.

### Subcritical alpha

For `G(r)=exp(alpha r)`, `0<=alpha<1/2`, set `delta=1/2-alpha>0`, `beta=1+delta`. The jump sum is

    2 integral_[X,infinity) (log x)x^(-beta) dtheta(x).

The Stieltjes weight decreases on the stated range. Its lower boundary is `-theta(X-)g(X)<=0`, including when X is prime; its upper boundary vanishes. With theta(x)<=3x,

    integral_[X,infinity) g dtheta
       <=3[Xg(X)+integral_X^infinity g(x)dx]
       =3exp(-delta L)[L+L/delta+1/delta^2].

The continuous contribution is `(5/2)exp(-delta L)(L/delta+1/delta^2)`. Multiplying the prime bound by 2 and adding gives

    exp(-delta L)[6L+(17/2)(L/delta+1/delta^2)].

At alpha=0, delta=1/2, this is `(23L+34)exp(-L/2)`. Equations (1) and (2) have exactly the correct constants.

### Critical power with log saving

For fixed B>2,

    G(r)=exp(r/2)/r^B,
    G'(r)=G(r)(1/2-B/r).

Thus the weighted-variation assertion uses precisely the stated range `L>=max(512,2B)`. The B=3 application automatically satisfies this at L>=512. All general-B applications can retain this onset condition without qualification.

The continuous integral is `(5/[2(B-2)])L^(2-B)`. The prime term is `2sum_(p>=X)(log p)^(2-B)/p`. Its Stieltjes weight is `g(x)=(log x)^(1-B)/x`, with

    -g'(x)=x^(-2)[(log x)^(1-B)+(B-1)(log x)^(-B)]>0.

The boundary at infinity vanishes, and the same endpoint-inclusive integration gives

    sum_(p>=X)(log p)^(2-B)/p
      <=3[L^(1-B)+L^(2-B)/(B-2)].

Adding the continuous term yields exactly

    6L^(1-B)+17L^(2-B)/[2(B-2)].

For B=3 this is `6/L^2+17/(2L)`, equal to `0.01662445068359375` at L=512. The source correctly does not claim B>2 is the optimal threshold for the **sampled** sequence; it is the range of this particular absolute flow/jump bound.

## 4. Block freezing: full and unfinished blocks

For a block `[N,N+K-1]`, repeated telescoping and the triangle inequality give the sharper intermediate estimate

    sum_(n=N)^(N+K-1)|c_n-c_N|
      <=sum_(m=N)^(N+K-2)(N+K-1-m)|Delta c_m|
      <=K sum_(m=N)^(N+K-2)|Delta c_m|.

If `K<=G(r_N)`, monotonicity gives `K<=G(r_m)` for every within-block increment m. Summing over arbitrary disjoint consecutive finite blocks proves the displayed absolute freezing bound. Boundary increments between blocks need not be charged: discarding them from the positive weighted-variation sum is safe. There is no assumption about the number-theoretic size of prime gaps inside a block.

Write `e_n=c_n-c_(N_j)` for n in block j. Equation (15) proves `sum|e_n|<infinity`; therefore the cumulative **signed** freezing correction converges, rather than merely remaining bounded. At completed-block endpoints this immediately gives the claimed comparison with `sum K_j c_(N_j)`.

For an arbitrary prefix ending at m in block j, decompose its unfinished actual contribution as

    sum_(n=N_j)^m c_n
       =(m-N_j+1)c_(N_j)+sum_(n=N_j)^m e_n.

The first term has absolute value at most

    K_j|c_(N_j)| <=3(log p_(N_j))^(1-B) ->0.

The second is bounded by the absolute error of that block, which tends to zero because the block errors form a summable nonnegative series. Hence the unfinished actual contribution tends to zero uniformly over the location of m inside its block. The all-prefix difference from the sum of completed frozen blocks converges to the **same** correction constant as at block endpoints.

This establishes the no-hidden-partial-block-excursion statement. It uses both equation (15) and the source's displayed unfinished frozen bound; either fact alone would be insufficient. The analogous subcritical argument has `K|c_start|<=3r exp(-(1/2-alpha)r)->0`.

The exact future error bound controls the total absolute freezing correction on the chosen tail. It does not bound the signed sum of frozen block contributions. Under the prior oscillation theorem, that unresolved signed behavior persists after the convergent correction.

## 5. Fixed-rank classes: actual convergence, not just bounds

Let a_n be any fixed periodic zero-mean sequence and `A_N=sum_(n<=N)a_n`. The sequence A_N is bounded. Summation by parts gives

    sum_(n=1)^N a_n c_n
       =A_N c_N+sum_(n=1)^(N-1)A_n(c_n-c_(n+1)).

The first term tends to zero since c_N tends to zero. The series on the right converges **absolutely** because the unweighted neighbor variation is finite. Thus the left-hand weighted credit sum has an ordinary finite limit. This is the exact convergence mechanism proved here; no inference “bounded implies convergent” is made.

Choosing `a_n=1_(n congruent a mod k)-1/k` proves, at every prime-index prefix N,

    sum_(n<=N, n congruent a mod k)c_n
      -(1/k)sum_(n<=N)c_n -> finite constant.

For parity, the difference between the two sampled sums therefore converges, including prefixes ending on either parity; the leftover c_N tends to zero. The adjacent-pair absolute-difference bound is also an immediate subseries of the total variation.

The Jordan-divergence transfer has an equally precise proof. Both functions `x -> x_+` and `x -> (-x)_+` are 1-Lipschitz. Hence the sequences `(c_n)_+` and `(-c_n)_+` also tend to zero and have finite neighbor variation. The same Abel argument yields

    class_positive_prefix -(1/k)full_positive_prefix -> constant,
    class_negative_prefix -(1/k)full_negative_prefix -> constant.

The previously established divergence of both full Jordan sums thus forces both sums in every fixed residue class to diverge. This is stronger and more explicit than merely saying that a finite blockwise perturbation preserves divergence. It does not assume the full signed prefix converges, and it does not establish a lower bound on that prefix.

“Same phase” here has this precise prefix-comparison meaning. It is not an assumption of random signs, a claim of zero-ordinate independence, or a proof that separated macroscopic stages cancel.

## 6. Evidence scope and disposition

Local files include frozen producer copies, byte-identical 192/256-bit replays, the independent 384-bit jump/weight check and its receipt, provenance, and a verified SHA-256 manifest.

The pinned producer script has six exact symbolic checks: continuous derivative, two subcritical integral/derivative identities, two critical integral/derivative identities, and the unweighted constant. It also checks finitely many Arb scalar gates. It does **not** contain a jump-algebra check; this narrow wording mismatch is recorded rather than silently upgraded. The separate independent script adds the actual exact event-jump identity and checks ten identities in total.

All-real monotonicity, endpoint-inclusive Stieltjes integration, partial-block control, and rank-class convergence are analytic arguments supplied above. They are not established by sampling finite scalar values. No prime sequence or new zero-height range has been computed.

**Disposition:** accept the weighted variation and finite-error compression theorems, with accurate receipt scope. No change to the producer mathematics is required. The retained block credits remain an unbounded-quantifier signed arithmetic problem; no new RH conclusion or whole-even support extension follows.
