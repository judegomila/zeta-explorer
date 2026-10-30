# Independent audit: coarse Suzuki certificates through 10^7, origin interval, and future representation budgets

> Curated mathematical source, 30 October 2026. Historical numerical cutoffs and producer statements below retain their original scope; the app module and bundled review identify the accepted current result. Internal review is not external peer review. References to original audit workspaces describe historical evidence; the publication manifest identifies which files are included here. Source and publication hashes are recorded in the manifest.

## Accepted result first

**PASS** for the frozen 10^6 certificate, the separate 10^7 extension, the origin supplement, the elementary-onset freezing budget, and the separately stated all-future prime-power hull-loss budget.

Putting the finite certificates together, with `a0=log(5/4)`, establishes the explicit **finite scalar** result

    Psi(0)=0,
    Psi(r)>=r/[100 log(5/4)]       for 0<=r<=a0,
    Psi(r)>1/100                  for a0<=r<=log(10^7).

Thus Psi is positive at every r in `(0,log(10^7)]`. No positive constant floor is claimed at the origin. This is not a whole-even-form certificate, a new whole-even support endpoint, or an RH proof.

All four coarse runs (10^6 and 10^7, each at 192 and 256 bits) reproduce **every receipt field after excluding only `elapsed_seconds`**. The elementary-onset, origin, and future-hull scalar receipts reproduce byte-for-byte. All supplied producer manifests pass.

A genuinely separate 384-bit check used an Euler least-prime-factor sieve, direct integer prime-power classification, direct log q, a digamma evaluation of b, and a lower-reserve test at **every** event, without the coarse hull. It independently passes all 665,134 event tests through 10^7 and reproduces both event digests. Separate higher-precision origin checks verify that every interval cell contains both endpoint enclosures.

The all-future quantities remain **representation/interpolation budgets**, not bounds on signed future endpoint movement. Their smallness cannot propagate the finite positive floor by itself.

## 1. Pinned scope and reproducibility

The exact source note hashes reviewed are:

| Note | SHA-256 |
|---|---|
| `COARSE_PREFIX_HULL_CERTIFICATE_TO_ONE_MILLION.md` | `9e6c9c10d19c894e3bc616ae61da2d97a0b32d5d0ea3c973721889957905aa49` |
| `ELEMENTARY_ONSET_AND_ALL_FUTURE_FREEZING_BUDGET.md` | `a631b9d64e8d4895e026974cb0c2697cac059c451e825e74572d89e06ca554d5` |
| `extension_10million/COARSE_CERTIFICATE_EXTENSION_TO_TEN_MILLION.md` | `5501227e96a32a68d8367a12b147b58ee64458cee99f8c9aaf326c428db2af75` |
| `origin_interval/ORIGIN_INTERVAL_CONCAVITY_CERTIFICATE.md` | `6d7f015138a1bcd0b77bebe4e70d438c15a5152ec6184b7b6f4b9a5c6a97313d` |
| `future_hull_budget/ALL_FUTURE_PRIME_POWER_HULL_LOSS.md` | `54a356d127929efecd97f2db67ef40d34adfbe08bc8a1347e8ef0cc1593ae033` |

The common coarse checker is pinned at `e9e83a7c0727b667459090d22db8774381edacb8dae2cbefc768f5bf9420762b`. Every reviewed source, receipt, and source manifest is copied under `source_snapshot/`. Full pins and dependency hashes are in `PROVENANCE_AND_REPLAY.json`.

The producer's source script necessarily records a different elapsed time on replay. No other field was omitted or normalized when comparing the coarse receipts. The smaller scalar checkers do not have this varying field and match byte-for-byte.

## 2. Coarse hull lemma: no unjustified reserve monotonicity

Keep the audited normalization

    H_n=S_n-b,
    F(H)=2H[log(H/2)-1],
    R_n=J_n-F(H_n)-4+T_infinity.

For a block from event a to b, let `D=S_b-S_a`, `Q=J_b-J_a`, `ell=log q_(a+1)`, `u=log q_b`. At an intermediate actual event i, `t=S_i-S_a` lies in `[0,D]`. Positive event weights and sorted event logs give the two exact lower bounds

    J_i-J_a>=ell*t,
    J_i-J_a>=Q-u(D-t).

For at least two new events, all weights are positive and the extreme logs are distinct. The weighted mean satisfies `ell<Q/D<u`, so the crossing

    t_*=(uD-Q)/(u-ell)

lies strictly between 0 and D. On either side of t_*, the lower reserve expression is affine minus F; its second derivative is `-2/(H_a+t)<0`. It is therefore concave **on each branch**, not necessarily globally concave. Each branch has its minimum at an endpoint, giving exactly the three tests at 0, t_*, D.

This is a valid hull argument; R_n itself is not assumed monotone. A block with one new event has only its two actual event prefixes and needs no crossing calculation. Empty event blocks are not used by the finite checker.

The conjugate error epsilon decreases on the actual range: writing `x=((H-delta0)/2)^2>2`, it is equivalently

    epsilon(H)=(4/25)/[sqrt(x)(x^2-1)].

Both denominator factors increase with H. Since H_i>=H_a, one common subtraction epsilon(H_a) is safe for every intermediate M_i. The actual block bound is thus the minimum of the three candidate values after this common subtraction.

The diagnostic `min(..., key=lower_endpoint)` in the program is not used in acceptance: **every candidate interval must be strictly above 1/100**. Therefore any ambiguity in ordering close diagnostic intervals cannot affect the proof. The displayed smallest block lower-test value is not asserted to be the actual minimum reserve or minimum of Psi.

## 3. Finite checker, event enumeration, and interval arithmetic

The producer uses an exact Eratosthenes byte sieve, marking multiples from p^2 through the integer cutoff. Every unmarked p is expanded into `(p^k,p,k)` records for all powers below the cutoff, with Python integers and no overflow. Records are sorted and distinct event integers are asserted. The source accounts for ordinary primes and all proper powers, with the correct weight `Lambda(p^k)=log p`, not `k log p`.

Arb computes log p once per prime, log q as k log p, the exact-argument square root, and every S and J update with outward enclosures. There is no ordinary binary floating-point arithmetic in the mathematical certificate; the elapsed-time field is unrelated to acceptance. The constants b, T_infinity, delta0, and the rational floor use Arb expressions with the accepted normalization.

The first-event interior-root gate is checked explicitly. Every epsilon call verifies x>2. Crossing denominators satisfy the certified `hi>lo`; the enclosed crossing is checked positive and below enclosed D. Interval dependency can widen these enclosures, but cannot invalidate a successful lower-bound comparison.

Indexing is correct: arrays S and J have initial zero at index 0; event i has record `ev[i-1]`. Consequently `rs[a]` is log q_(a+1), `rs[b-1]` is log q_b, and the initial blocks cover event indices 1 through N with shared heads. Every failed nonsingleton is bisected at an interior integer index. A failed singleton aborts rather than disappearing. The independent receipt validator confirms contiguous leaf coverage and total transition count N-1.

Verified counts and coverage:

| Cutoff | Primes | Distinct prime powers | Accepted blocks | Endpoint evaluations | Crossing evaluations | Last event |
|---|---:|---:|---:|---:|---:|---:|
| 10^6 | 78,498 | 78,734 | 441 | 442 | 574 | 999,983 |
| 10^7 | 664,579 | 665,134 | 2,732 | 2,733 | 2,865 | 9,999,991 |

Both runs split 133 parent blocks. The leaf count equals the number of initial blocks plus 133. All receipt block bounds, parsed again independently, remain strictly above the rational floor.

The independently generated event digests are

- 10^6: `75a8304f17e1c2010108b3ebbfa15bf0fc1dfbaf007678ce5357c32c4d77b36a`;
- 10^7: `4c24e9f9cdf8411292143f0e81281da86dabcf08ad0c20c6064bcdffd3da06c1`.

### Different-algorithm cross-check

`independent_spf_and_direct_reserve.py` uses a linear Euler least-prime-factor sieve, then scans integers and strips their least prime factor to recognize prime powers. It does not import the producer's event generator. At 384 bits it computes log q directly rather than as k log p, evaluates b via digamma, evaluates epsilon in the algebraically simplified form above, and directly tests each event reserve lower enclosure without a hull.

All event tests exceed the originally specified 1/100. The final H and R enclosures overlap the producer intervals. The smallest diagnostic direct lower test occurs at q=3089 and is approximately 0.02752057335; this is neither asserted to be the exact minimum of Psi nor used to advertise a new strengthened floor. No larger cutoff was tested.

## 4. Why every real interevent point is included

On each actual event cell `[log q_n,log q_(n+1)]`, the Suzuki function agrees with its affine continuation plus the common convex archimedean part. Its global constrained minimum is M_n. Therefore

    Psi(r)>=M_n>1/100

throughout that cell. This argument does not require monotonicity of Psi on the cell, nor sampling a local minimum numerically.

The first checked event is 2, so the main certificate begins at log 2. Exact event completeness through X proves that the final held cell extends at least to log X. Thus the unsampled tails after 999,983 and 9,999,991, respectively, are covered. The prime-event hinge is zero at its own event time, so the closed cell endpoints are consistent.

The segment below log 2 is handled separately, as follows.

## 5. Origin supplement: rigorous closed-cell coverage and concavity

Before the first event, including its zero hinge at log 2,

    Psi(r)=4exp(r/2)+br-4+T(r).

Every T summand is nonnegative for r>=0 and bounded by a summable 1/alpha_k^2 sequence. Dominated convergence proves continuity at zero and Psi(0)=0.

For r>0 the differentiated series is uniformly convergent on every compact interval bounded away from zero. Thus the displayed second derivative is valid there. Multiplication by a positive factor reduces its sign to

    exp(3r)-exp(r)-1.

For `1<=y<=5/4`, the polynomial `y^3-y-1` increases and its endpoint value is `-19/64`. Hence C''<0 on `(0,a0]`. Concavity extends to `[0,a0]` by continuity. No finite derivative at the origin is assumed; in particular the singular limiting derivative is not overlooked.

The positive 128-term truncation proves `C(a0)>1/100`. The chord inequality with C(0)=0 gives `Psi(r)>=r/[100a0]`, and strict positivity for r>0 in this segment.

For `[a0,log 2]`, each constructed Arb argument interval contains the entire corresponding closed cell. I independently checked, at 384 bits, that every cell contains **both** of its endpoint enclosures. Since neighboring cells share the same exact endpoint formula, there are no uncovered gaps. Natural interval evaluation of the finite sum encloses its value at every real argument in a cell; repeated occurrences of r only enlarge the enclosure. All 256 lower-test intervals are strictly above 1/100.

The omitted T terms are positive throughout these cells. Their sign, not a guessed finite numerical tail, justifies discarding them for a lower certificate. The separate high-precision check recomputes b via digamma and reproduces the same conclusion. This closes the entire origin-to-log-2 segment.

## 6. Elementary onset and prime-only future freezing budget

The central-binomial argument is valid. For every prime p and k>=1,

    floor(2n/p^k)-2floor(n/p^k) is 0 or 1.

Consequently the binomial logarithm is at most psi(2n). The largest-binomial-coefficient bound gives

    psi(2n)>=2n log 2-log(2n+1).

For real x, `n=floor(x/2)` yields the weaker continuous lower envelope `(x-2)log2-log(x+1)`. Its margin above x/2 is positive at 32 and increasing thereafter. The same continuous envelope also holds for the left limit by taking points approaching x from below, including x=32; no jump assumption is needed.

Weighted partial summation gives, for either event limit,

    S(x)>=sqrt(x)-sqrt(8),  x>=32.

Using -b>2 gives the stated weaker `H_full>=sqrt(x)-1`. The even proper-power part is at most `3+3log y`, using only psi<=3x; the complete odd part is below 10 by the accepted integer majorant. Thus `B(r)<=13+3r/2`, and

    H_prime(r)>=exp(r/2)-r-15>=0.75exp(r/2),
    H_prime(r)<=7exp(r/2),  r>=log 10000.

The two onset inequalities are outward-checked and persist by positive derivatives. The logarithm bound |ell|<=3 remains valid at the weaker lower ratio 3/8, and H>=1 keeps the continuous derivative estimate unchanged.

Only the event-jump coefficient changes from 2 to 8/3. Repeating the previously audited Stieltjes calculation therefore changes the constants to

    unweighted: (29L+42)exp(-L/2),
    subcritical: exp(-delta L)[8L+(21/2)(L/delta+1/delta^2)],
    critical: 8L^(1-B)+21L^(2-B)/[2(B-2)].

All constants and the critical monotonicity onset `L>=max(log10000,2B)` are correct. The B=3 future freezing-error values are 0.80192905377... at 10^6 and 0.68223546930... at 10^7.

Singleton blocks are important: when the critical weight is below the desired integer block length, a singleton has zero freezing error. For `K=max(1,floor G)`, every nonsingleton satisfies K<=G; the same absolute-error argument applies after removing the zero-error singletons.

For an unambiguous continuation after cutoff X, start a new partition at the first ordinary prime after X (or at any block head p>=X). The stated tail budget applies to such a block-head tail. An arbitrary cut through an already frozen block would additionally require its partial-block carry error; it should not silently be treated as a fresh block-head budget. The source's finite-head continuation can use the fresh partition and is valid as stated in that intended setting.

These state-onset and variation estimates need neither a quantitative PNT theorem nor a zero-height computation. The previously accepted link of renormalized credits to the original reserve is a separate result and is not being re-proved by the elementary onset argument.

## 7. Final companion: all-future original prime-power hull loss

For a block with D>0, moment mean mu=Q/D, and log range `[ell,u]`, the chord moment `mu*t` exceeds the lower hull by at most

    E_hull=D(mu-ell)(u-mu)/(u-ell)<=D(u-ell)/4.

The maximum occurs at the two-branch crossing. Degenerate empty and singleton blocks are assigned zero loss for actual interior event prefixes, so no undefined division is needed when there is no nontrivial range.

Convexity of F gives the correct inequality direction: subtracting F at an intermediate mass lies **above** the linear interpolation of the two endpoint reserves. Combining it with the moment loss gives

    R_i>=min(R_a,R_b)-E_hull.

This is a within-block comparison; it does not bound either endpoint.

For `h(t)=eta exp(-t/2)/t^2`, `0<eta<=1`, `t_0=L>=log10000`, and `t_(j+1)=t_j+h(t_j)`, the grid increases to infinity. A finite accumulation point would have positive limiting step size, a contradiction. Since `|(log h)'|=1/2+2/t<1` and each step is at most 1/100, every event r in its grid cell satisfies

    h(t_j)<=exp(1/100)h(r)<2eta exp(-r/2)/r^2.

Therefore

    sum_j E_j <=(eta/2)sum_(q>exp L)Lambda(q)/[q(log q)^2].

This sum retains all original prime-power weights. Stieltjes integration of `g(x)=1/[x(log x)^2]` against psi, using psi<=3x and dropping only the nonpositive lower boundary, gives exactly

    sum_j E_j <=(3eta/2)(1/L+1/L^2).

The endpoint convention is strict after the cutoff; an event at the cutoff belongs to the finite head. Both strict and inclusive Stieltjes forms have a nonpositive lower boundary, so no positive atom has been lost.

At eta=1/20, the budget is 0.005821622059... at 10^6 and 0.004941846536... at 10^7. The scalar receipt reproduces byte-for-byte. The grid-width asymptotic `eta sqrt(x)/(log x)^2` follows from `exp(t+h)-exp(t)~exp(t)h`; it does not imply any future node was evaluated.

If a separate theorem bounded **all future grid endpoint reserves** below by K, this hull estimate would transfer it to every future event with loss at most the displayed total. One further uniform epsilon(H at the starting cutoff) would then transfer to exact event minima and their real cells. This conditional argument is valid. Its endpoint hypothesis is unproved here; the future endpoint values are uncontrolled, not proved actually unbounded. A budget smaller than 1/100 does not by itself propagate the finite 1/100 floor.

## 8. Disposition and evidence boundaries

The verified conclusion is the finite scalar positivity statement at the top, plus separately proved all-future representation/interpolation bounds. The actual signed future supply remains unresolved. Neither subtracting the total positive convexity debt from the final R nor subtracting a compression budget from the finite floor controls future signed credits.

Artifacts in this directory include:

- frozen source copies and all source manifests;
- four coarse replays and three byte-identical scalar replays;
- `independent_spf_and_direct_reserve.py` and `INDEPENDENT_SPF_DIRECT_384BIT.json`;
- `verify_receipts_and_origin_cells.py` and `INDEPENDENT_RECEIPT_AND_ORIGIN_CHECKS_384BIT.json`;
- provenance and the review integrity manifest.

**Disposition: accept all five scoped pieces.** No source correction is required. No larger-scale scan, publication, upload, global positivity conclusion, or whole-even support extension was performed or inferred.
