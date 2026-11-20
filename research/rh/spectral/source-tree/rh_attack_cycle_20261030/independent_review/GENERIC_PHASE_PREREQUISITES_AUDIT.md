# Independent audit: generic-support prime norm and near-phase moments

> Curated source/review. Mathematical formulas and proof order are retained. Operational reviewer identifiers and private executor paths were removed; the manifest records original and published hashes. Historical receipt locations refer to the original audit layout. Current accepted scope is stated in the app module; internal review is not external peer review.


## Scoped verdict

**PASS for the two mathematical prerequisites and the three-sample cache and
identity gates.** This is not acceptance of a generic actual head, full moment
matrix, infinite-tail/finite-head assembly, complete positivity certificate,
or support endpoint at `sqrt(16.001)`.

At the exact rational `X=16001/1000`, the full physical prime operator satisfies

    ||P|| < 3.803639828 < 3.80364.

The fixed three Gamma-integral pilots rigorously enclose their signed scaled
tails. Their retained in-memory real/imaginary accuracies are 944/944,
964/962, and 960/957 bits. A separate 350-digit sample cache preserves whole-ball
containment and at least 957, 942, and 960 bits after roundtrip. These are finite
validated checks of a proved scalar evaluation formula, not a 10,437-moment
certificate or a full operator sign test.

## Frozen sources and repaired provenance

Paths below are in `rh_attack_cycle_20261030/support_endpoint_continuity/`.

| Source | SHA256 |
|---|---|
| `GENERIC_PHASE_FEASIBILITY_AND_REPAIRS.md`, corrected final | `3b87a18f1ef18593b4267a60ace44d130903d00f8c11d4817cb8299cede49b06` |
| `generic_prime_power7_feasibility.py` | `b48f2274e7818d623995c9dba3759764c73e3808850a0204088025ac9754044d` |
| `quadrature_near_moments.py` | `f85172a4a196792880224c4adfbfa4ed86723cf5b31304b56a96d857a1afcaf6` |
| `check_moment_cache_roundtrip.py` | `d855b4d43f74f293bb032917000f4b5f1d178d62831360bc041e62f50c1dc36b` |
| `check_near_moment_identities.py` | `7225a5a8cdba6f104b885409aeaf8284247410bc722a82536e2ef3e9deae64af` |

The initial note hash was
`bbf49df81e8a7593d1afa210e664c66a823c2935449e1eb7bfc1e43d546d1f6d`.
Review found that its missing-output Lerch narrative contradicted the actual
terminal receipt: all six samples had completed, including the last hard sample
with a useless radius about 7.9e49. The producer corrected the prose and status
without rerunning a failed sample. Final `DIRECT_LERCH_PILOT_STATUS.json` has
SHA256 `09b9e0848b969c359c2d485eb401906538dedaa49d967d0cca311770bf776747`
(initially `df49fa06bee13383ba197fd6d649de549392ab8b14a3aff278fbad6fc96dc235`).
The numerical primitive sources did not change.

Review also distinguished in-memory accuracy from the 90-decimal-digit display
strings, which retain only about 298--301 relative bits. The corrected note
explicitly prohibits treating those summaries as 944-bit cache data. The new
350-digit roundtrip check addresses this issue directly.

Complete final artifact and replay pins, including the manifest, are recorded
in the accompanying JSON. Original-read snapshots are preserved in the isolated
review directory; the reviewer did not edit producer files.

## Isolated replay and bounded independent checks

All replay writes were confined to
`independent_review/generic_phase_prerequisite_replay/`. Using the existing
python-flint interpreter, the following passed:

- Complete fixed seventh-power enumeration: 20, 218, 1573, 8969, 43167,
  182191, **690634** states by depth, **14388** rational breakpoints. Replay
  31.22 seconds; all non-timing receipt fields match exactly.
- All three frozen Gamma-integral pilots: all non-timing fields match exactly.
- `check_moment_cache_roundtrip.py`: all non-timing fields match; sample-cache
  bytes are identical to the producer's.
- `check_near_moment_identities.py`: all non-timing fields match, including
  finite 17-term differences, conjugacy, strict Hurwitz absolute bounds, and
  overlap with a known-success low-order direct Lerch calculation.
- Reviewer-written `independent_checks.py`: exact replay comparison, independent
  phase classification and three one-step tail-start recurrences.

Every one of the 192 nonidentity grouped phases is certified strictly on one
side of the 0.1-radian threshold, not merely accepted through a failed interval
comparison. Exactly four are near; the minimum remaining phase distance exceeds
`0.1463942423046896412`. The four reduced ratios are exactly

    16001/16000, 256032001/256000000, 256000/16001, 16.

No high-order failed Lerch sample was rerun. No full moment batch, generic
head/matrix assembly, or full generic positivity run was launched by this
reviewer. The later production activity, if any, is outside this audit.

## 1. Exact path enumeration and odd-power norm bound

The actual compressed prime operator is a finite sum of paired translations
with nonnegative weights. It is bounded and selfadjoint, although not necessarily
positive semidefinite. Every positive integer power has a nonnegative measure
kernel. Therefore a positive-weight Schur row bound on `P^7` bounds its L2 norm,
and selfadjoint spectral mapping gives

    ||P||^7 = ||P^7|| <= B_7.

Odd power is legitimate; no PSD assertion concerning P or P^7 is needed.
The bound applies on the full physical L2 box, hence also to its even sector.

In coordinates `t=exp(x) in [1,X]`, a path with accumulated rational shift q
maps the starting t to tq. A new step with product z imposes
`1/z <= t <= X/z`. The code updates precisely the intersection of that interval
with the previous admissible interval. Fraction arithmetic makes all comparisons,
keys and breakpoints exact. Paths are discarded only when their allowed interval
has zero measure. Merging equal `(q,lo,hi)` triples adds their full positive
coefficient. All ten active prime powers, including 16, appear; no prime 17 is
active at X=16.001.

With `rho(x)=cosh((2/3)(x-W/2))`, the weighted ratio contributed by shift q is

    cosh((2/3)log q)
      + tanh((2/3)(x-W/2)) sinh((2/3)log q).

Thus on each exact breakpoint interval the accumulated row sum is `A+B tanh(...)`.
For its exact fixed coefficient B this is monotone or constant. Checking both
endpoints bounds the supremum regardless of the sign of B; no sampled interior
maximum or midpoint sign is trusted. Endpoint one-sided limits suffice because
the boundary sets have measure zero. Directed Arb evaluations enclose all
weights, hyperbolic values and endpoint sums.

The maximum of the outward upper endpoints is a genuine upper bound B7. Its
positive real seventh root is computed with Arb, and the resulting ball lies
strictly below 3.803639828. The local variable name `fourth` is merely a legacy
name; the loop runs seven levels and the root is explicitly seventh.

The reported `0.731186769...` tail-floor number is verified as evaluation of
the stated scalar expression with this improved norm. It is a candidate input
to a generic tail/head construction, not acceptance here of that entire new
construction. The fourth- and sixth-power historical comparisons and the
transplanted-core stress calculation were not independently replayed in this
focused review and are not promoted to new actual-operator conclusions.

## 2. Gamma-integral identity, scaling, and endpoints

For integer p>=2 and a=A+1, start with the Laplace identity for j^(-p), sum the
geometric series, and substitute u=at. Absolute convergence justifies the
interchange, yielding

    sum_(j>A) z^j/j^p
      = z^a/[a^p Gamma(p)]
          integral_0^infinity u^(p-1)e^(-u)/(1-z e^(-u/a)) du.

The implementation includes exactly `z^a`, `a^(-p)`, `(p-1)!` and the requested
scaling `J^(p-2)`. In particular, the endpoint is A+1, not A. Reviewer one-step
recurrences verify

    scaled_F(A)-scaled_F(A+1)
      = J^(p-2) z^(A+1)/(A+1)^p

for each frozen pilot, with zero enclosed by the computed residual. The separate
17-term, conjugacy and absolute-Hurwitz checks also pass.

The logs forming theta are real logs of positive exact inputs. Inside the
integration callback, the variable u occurs only in integer powers, exponentials
and one reciprocal: the callback is meromorphic and has no logarithm or root
branch. The installed `acb.integral` contract explicitly permits ignoring its
analytic flag for meromorphic callbacks because a ball containing a pole must
evaluate non-finitely. Direct interval division supplies that behavior here.
The exact phases tested are not the identity, so the positive integration path
does not meet a pole. Zero-phase moments retain their separate Hurwitz-zeta
route. A quadrature tolerance is a target, not an error certificate by itself;
the returned finite Arb ball is the enclosure used by the implementation.

Although the stored ball for z encloses values off the unit circle, the target
z is exactly `exp(i theta)` and has modulus one. Finite interval integration
encloses that target. The separate analytic tail estimate is applied to the
exact target, so it does not require all points of the parameter ball to have
unit modulus.

## 3. Infinite quadrature tail is explicitly paid

For real u>0 and exact |z|=1,

    |1-z exp(-u/a)| >= 1-exp(-u/a) >= u/(a+u).

The last inequality follows from `exp(v)>=1+v`. Consequently the omitted
integral is bounded by the integrals of
`[u^(p-1)+a u^(p-2)]exp(-u)`. The integer incomplete-gamma formula gives exactly

    J^(p-2)/a^p * exp(-U) *
       [sum_(k=0)^(p-1) U^k/k!
        + a/(p-1) sum_(k=0)^(p-2) U^k/k!].

The code implements this expression with outward arithmetic and U=1600.
Adding its upper endpoint to both real and imaginary radii encloses the entire
complex tail. The bound is positive and finite in all pilots; no numerical
convergence heuristic replaces it. Formula validity extends to all stated
p>=2 and integer starts, but neither universal runtime nor uniformly adequate
precision over all 10,437 planned entries follows from these three tests.

## 4. Precision-preserving sample cache

The new cache stores real and imaginary ball strings separately at 350 digits.
Its keys include exact X and ratio, p, A, J, U, precision, tolerance and primitive
source hash. Reloaded balls enclose the **entire original balls**, not just their
midpoints, with minimum relative accuracies 957, 942 and 960 bits and a checked
minimum of 900 bits. Producer and independent replay cache bytes agree.

A production cache must validate those exact keys, finiteness, containment or
equivalent outward generation guarantees, and its required retained accuracy.
The 90-digit pilot summaries are not suitable high-precision cache inputs.
This review approves the demonstrated sample roundtrip scheme, not an unrun
full-cache population or a complete 72-dimensional coefficient factorization.

## Remaining obligations and execution limits

Generic actual entries, absence of old quarter/half-phase shortcuts, all near
rows, all-sequence beta bounds, signed near moments, separated-channel Abel
errors, far remainder, coefficient-matrix sign, and the complete corrected-head
Schur test remain separate obligations. The historical frozen direction must
be evaluated under the new actual matrix, not only under a denominator
transplant. No practical support positivity or RH conclusion follows here.

