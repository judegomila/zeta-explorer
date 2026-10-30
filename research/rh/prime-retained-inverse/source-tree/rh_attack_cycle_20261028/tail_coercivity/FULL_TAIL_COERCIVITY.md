# Actual entire-tail coercivity: reconstructed derivation and fresh replay

28 October 2026, reconstruction after the workspace rollback reported at
10:25 UTC. **The earlier receipt files were not recovered.** This note
reconstructs the retained derivation; the accompanying interval receipts are
new computations, not assertions that lost artifacts survived. No ground
positivity or RH conclusion is asserted.

## 1. Exact actual operator, basis, and form domain

Put `W=2 log λ≥1`, `I=[−W/2,W/2]`,
`φ_j(x)=W^(−1/2)exp(2πijx/W)`, and `t_j=2πj/W`. Let P_N project onto
`|j|≤N` and Q_N=1−P_N. In physical L²(I), with zero extension, the
actual completed Weil form is

```
q = A_a + 2|c><c| − 2|s><s| − K − P,
a(t)=Re ψ(5/4+it/2)−log π,
c(x)=cosh(x/2), s(x)=sinh(x/2),
K(x,y)=exp(−|x−y|/2),
P=Σ_(2≤n<exp W) Λ(n)/sqrt(n) (S_log n+S_−log n).
```

The original gamma symbol has argument 1/4. The identity
`ψ(z+1)=ψ(z)+1/z` shifts it to 5/4, with multiplier difference
`4/(1+4t²)`, exactly the Fourier multiplier of K. The original pole
kernel is `2cosh((x−y)/2)=2cc−2ss`. This is the actual Weil operator,
not a prolate surrogate.

The existing checked source
`frequency_sensitive_bound/FREQUENCY_BLOCK_SUPPORT_BOUND.md`, §3a, proves
on the complete logarithmic form domain

```
A_a = diag_j a(t_j)+E_W.
```

Finite Fourier polynomials are a form core. The matrix formula is first
proved there and its remainder is bounded on all ℓ²(Z); closure identifies
the form domain with `Σ log(2+|t_j|)|v_j|²<∞`. The source also establishes
that a(t) is even and increasing in |t|. We sharpen its bounded-remainder
constant below, never its finite-M arithmetic estimate: that finite-M
estimate must NOT be used on the whole omitted tail.

## 2. Explicit improved gamma constant

Write `k(r)=2exp(−5r/2)/(1−exp(−2r))`. The source's exact gamma matrix
formulas give

```
|E_jj| ≤ W^−1∫₀∞ r k(r)dr + ∫_W∞ k(r)dr,
(E_off)_jl=[U(t_j)−U(t_l)]/[π(l−j)],  j≠l,
U(t)=−(1/2)∫₀^W k(r)sin(tr)dr.
```

The discrete Hilbert matrix `1/(j−l)` has norm π on ℓ²(Z). Thus the
full off-diagonal operator norm is at most `2||U||∞`, including all
cross-block interactions.

**Sine-lobe bound.** For any positive decreasing k with `rk(r)≤1`,

```
|∫₀^W k(r)sin(tr)dr| ≤ Si(π)=∫₀^π sin u/u du.
```

For t>0 split into half-waves of length π/t. Their absolute integrals
decrease. Pair each positive lobe after the first with its preceding
negative lobe to bound every truncated integral above by the first full
positive lobe. Pair each negative lobe with its preceding positive lobe
to prove nonnegativity. A truncated terminal lobe preserves these bounds.
The first lobe is at most Si(π), because rk≤1. Negative t follows by
oddness; t=0 is trivial. The actual k is positive decreasing and obeys
`rk=2r exp(−r/2)/(exp(2r)−1)≤1`.

The decreasing alternating series at π gives

```
Si(π) ≤ π−π³/18+π⁵/600−π⁷/35280+π⁹/3265920 < 1853/1000.
```

The last inequality is checked outward with Arb in the fresh receipt.
For the diagonal moment, the decreasing-series integral bound yields

```
∫₀∞ r k(r)dr = 8Σ_(m≥0)(4m+5)^−2
 ≤ 8Σ_(m=0)^15(4m+5)^−2 + 2/65 < 3/5.
```

Here the tail m≥16 is bounded by the integral starting at15; its value
is 2/65. The final comparison is exact rational arithmetic. Finally
`∫_W∞k≤(4/5)exp(−5W/2)/(1−exp(−2W))`. Therefore

```
||E_W|| ≤ Γ_ref(W)
 :=1853/1000 + 3/(5W) + (4/5)exp(−5W/2)/(1−exp(−2W)).       (G)
```

For comparison, the simpler half-wave bound Si(π)<2 and the elementary
moment bound18/25 give
`Γ_base=2+18/(25W)+(4/5)exp(−5W/2)/(1−exp(−2W))<14/5`
for W≥1. The source used the still coarser constant4. All three bounds
are evaluated in the fresh receipt; Γ_ref≤Γ_base.

## 3. Exact prime-shift norms

For `0<r<W`, disintegrate I into chains `x₀+kr`, `0≤x₀<r` after a
translation of I. On each fiber, `S_r+S_−r` is finite path adjacency.
The maximal number of vertices occurring on positive measure is
`ceil(W/r)`; at an integer ratio the extra endpoint has measure zero.
Consequently

```
||S_r+S_−r||=2cos[π/(ceil(W/r)+1)],
P_*(W)=Σ_(2≤n<exp W) Λ(n)/sqrt(n) · 2cos[π/(ceil(W/log n)+1)],
||P||≤P_*(W).                                             (P)
```

A prime power exactly at exp W is an endpoint shift with zero overlap
and is excluded. Shifts tending to W from below retain norm1, not a
norm tending to zero. No false operator-norm continuity is used.

The source's elementary Chebyshev partial-summation bound is
`Σ_(n≤X)Λ(n)/sqrt(n)≤6sqrt(X)−3`. Splitting at n=exp(W/2), using norm≤2
below and norm1 above, gives
`P_*≤6exp(W/2)+6exp(W/4)−6=O(λ)`.
The exact finite sum is much better at the present supports.

## 4. Genuine compressed negative-pole and decaying-kernel tails

For j≠0 direct integration gives

```
|<φ_j,s>|²=4t_j²sinh²(W/4)/[W(t_j²+1/4)²].
```

Using `Σ_(j>N)j^−2≤1/N`, for every integer N≥1,

```
2||Q_Ns||² ≤ H_s(W)/N,
H_s(W)=4W sinh²(W/4)/π².
```

The positive pole part `2|c><c|` is discarded only in the lower direction.
In the even sector s is exactly absent, so H_s may be omitted there.

K is positive trace class. Its exact Fourier diagonal is

```
<φ_j,Kφ_j>=1/(t_j²+1/4)
 +[2(1−exp(−W/2))/W](t_j²−1/4)/(t_j²+1/4)².
```

Each nonzero-j entry is at most
`[1+2(1−exp(−W/2))/W]/t_j²`. Summing both tails and using positivity
(norm≤trace) gives

```
||Q_N K Q_N||≤H_K(W)/N,
H_K(W)=W[W+2(1−exp(−W/2))]/(2π²),
H(W)=H_K(W)+H_s(W).                                      (H)
```

These are actual compressed-operator estimates, not estimates for one
trial vector or a finite selection of high modes.

## 5. Full-tail theorem with quantifiers

**For every W≥1, integer N≥1, and every actual form-domain vector f
with P_Nf=0,**

```
q[f]≥d_N(W)||f||²,
d_N(W)=a(2π(N+1)/W)−Γ_ref(W)−P_*(W)−H(W)/N.               (T)
```

Use H_K in place of H in the even sector. This follows by summing the
one-sided bounds above. If D_N denotes the operator of the compressed
closed form, then for every real α and δ>0,

```
d_N(W)≥α+δ  =>  D_N−α≥δI,   ||(D_N−α)^−1||≤1/δ.
```

The low block can still have unknown sign and unknown multiplicity.

For a wholly explicit growth rate,

```
a(t)≥log(|t|/(2π))−4/5,  t≠0.
```

To prove this, set x=5/4, y=t/2 and h(u)=u/(u²+y²). The digamma series
and sum-integral comparison imply
`Re ψ(x+iy)≥log|x+iy|−TV(h;[x,∞))`. The variation is at most1/x:
when |y|≤x it equals h(x), and otherwise it equals1/|y|−h(x)≤1/x.
Since Γ_ref<14/5, a sufficient integer cutoff is

```
N ≥ max{1,H(W),W exp[P_*(W)+α+δ+23/5]}.                  (C)
```

Then H/N≤1 and log((N+1)/W) strictly exceeds the required sum. A ceiling
of the maximum gives an explicit integer. Thus fixed-support tail
coercivity is constructively attainable. For bounded α,δ, this sufficient
strategy has log N=O(λ); it is not a lower bound on the cutoff or cost
required by a better arithmetic method.

## 6. Fresh interval results and scope

The script `certify_tail_cutoffs.py` reconstructs all constants directly,
uses exact rational λ² to choose prime-power endpoints and path lengths,
and freshly evaluates the digamma lower bound using Arb/Acb at192 bits.
It does not read lost receipts. A chain length is decided exactly by
`ceil(W/log n)=min{k:n^k≥λ²}`. It checks positive sign at N and negative
sign at N−1, for margins0 and1. Therefore “first” refers to this monotone
sufficient bound, not the actual smallest positive-tail cutoff.

| λ | first N with d_N>0 | first N with d_N>1 | power-of-two N | bound at that N |
|---:|---:|---:|---:|---:|
| 2 |43|117|128|>1.09443|
| 2.5 |179|487|512|>1.05109|
| 3 |597|1621|2048|>1.23395|
| 3.5 |2537|6896|8192|>1.17227|
| 4 |5584|15177|16384|>1.07654|

The full head has dimension2N+1 and its even block dimensionN+1.
No matrix of those dimensions is constructed by this script. At λ=2.5,
N512 gives a513-dimensional even head and a full-tail floor exceeding1.
This is a useful interface for a directional signed self-energy certificate,
not that certificate itself.

## 7. Uniform support interface on 2≤λ≤2.5

Put Wmin=log4, Wmax=log6.25. The gamma symbol is |t|-increasing,
Γ_ref(W) is decreasing, P_*(W) is nondecreasing (atoms and path norms),
and H(W) is increasing. Hence for every λ∈[2,2.5],

```
d_512(W)≥a(2π·513/Wmax)−Γ_ref(Wmin)−P_*(Wmax)−H(Wmax)/512
        =d_512(Wmax)−Γ_ref(Wmin)+Γ_ref(Wmax)
        >0.9274317005.
```

Thus the entire tail satisfies `D_(512,λ)≥0.92743I` uniformly, and for
α<0.92743 its inverse at α has norm at most(0.92743−α)^−1. Unitary
dilation to fixed interval[−1,1] preserves the Fourier index cutoff and
the physical L² spectral bound. Prime-threshold jumps are handled by a
monotone envelope, not norm continuity. The script freshly records this
uniform bound and the inverse bound.

## 8. Provenance and remaining gap

Existing accessible sources used: the complete-basis gamma identity and
arithmetic normalization in `frequency_sensitive_bound/FREQUENCY_BLOCK_SUPPORT_BOUND.md`;
the actual pole/gamma form and operator domains in
`ground_state_bridge_20261025/analytic_bridge.md`.
The local λ=2 actual ground certificate remains the earlier independent
full-form certificate, not this tail calculation. The candidate energy
bounds are only trial-vector upper estimates and are not used as lower
bounds here.

Not proved: a new λ=2.5 low-block sign or ground theorem, unbounded-support
simple-even branch eligibility, candidate-to-ground convergence, or RH.
