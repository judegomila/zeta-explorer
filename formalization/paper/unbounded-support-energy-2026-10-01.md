# Unbounded support: refinement, signed prime-pair energy, and random twists

**The required bound for ordinary zeta is still unproved.** This follow-up
attempts the actual signed estimate identified in the
[translation reduction](unbounded-support-translation-2026-10-01.md).
It obtains an unconditional unbounded-support energy bound for almost every
multiplicative prime-sign twist, but cannot transfer it to the all-plus
assignment. It also isolates a one-sided prime-pair estimate that would
finish the deterministic route, and rejects two tempting shortcuts.

The analytic derivations and implementation require independent review.
No novelty or formal-verification claim is made. The full-space local Weil
certificate remains at support width **2**; the computations here are not
larger full-space positivity certificates.

## 1. Definitions and the mean-square target

Keep the fixed real even spline h=Qg, Q=-d²/dx²+1/4, from the translation
note. Its autocorrelation C is supported in [-1,1], and

\[
 H(z)=\left(\frac14-z^2\right)
       \left(\frac{\sinh(z/16)}{z/16}\right)^8,
 \qquad \int C(v)e^{zv}\,dv=H(z)^2.
\]

Write c_n=Lambda(n)/sqrt(n), ell_n=log n, and

\[
 P(R)=\sum_n c_n C(R-\ell_n),\qquad
 I(L)=\int_1^L P(R)^2\,dR\quad(L>1).
 \tag{1}
\]

Every value of P and every finite integral in (1) uses only finitely many
prime powers. The translation interaction is k(R)=-P(R)-A_0(R), where
`A_0(R)=sum_{j>=1} H(2j+1/2)^2 exp(-(2j+1/2)R)` is bounded for R>=1 and
decays as R tends to infinity.

The following are equivalent, using the pole-detection argument already
derived in the translation note:

1. RH.
2. For every epsilon>0, `integral_1^infinity exp(-2 epsilon R) P(R)^2 dR`
   is finite.
3. For every delta>0, `I(L) <= A_delta exp(delta L)` for all L>1, with
   A_delta independent of L.
4. I(L) is bounded above by a polynomial in L.

Under RH, P is bounded, so in fact I(L)=O(L). The interest of (2) is that a
mean-square estimate suffices; no pointwise estimate has to be recovered
from it. If (2) holds, Cauchy–Schwarz gives, for Re z>epsilon,

\[
 \int_1^\infty |P(R)|e^{-(\Re z)R}\,dR
 \le
 \left(\int_1^\infty e^{-2\epsilon R}P(R)^2\,dR\right)^{1/2}
 \left(\int_1^\infty e^{-2(\Re z-\epsilon)R}\,dR\right)^{1/2}.
 \tag{2}
\]

These estimates, also with powers of R on compact sub-half-planes, make the
Laplace transform holomorphic on Re z>0. In its original domain Re z>1/2,
the exact identity for k is

\[
 \int_1^\infty k(R)e^{-zR}\,dR
 =H(z)^2\frac{\zeta'}{\zeta}(z+1/2)+E(z)+A(z).
 \tag{3}
\]

The small-prime correction E is entire, and A is holomorphic on Re z>0.
They are the explicit functions in the translation note; neither is
discarded. The pole at z=1/2 is removed by H. An off-line zero rho with
Re rho>1/2 would leave a pole at z=rho-1/2 because H has no zero there.
This contradicts (2), giving RH by symmetry. The starting Dirichlet-series
identity is [DLMF 27.4.12](https://dlmf.nist.gov/27.4.E12), only in its
absolute-convergence domain.

To compare the weighted-integral and finite-energy conditions: the first bounds
I(L) by a constant times exp(2 epsilon L). Conversely a subexponential
bound for I gives convergence of each weighted integral by integration by
parts, choosing delta<2 epsilon. Condition 4 implies condition 3, and RH
implies condition 4. These are equivalent criteria, not proved estimates
for the actual prime sum.

## 2. The diagonal is already controlled

Expand the finite integral before making any estimates:

\[
 I(L)=D(L)+X(L),
\]

\[
 D(L)=\sum_n c_n^2\int_1^L C(R-\ell_n)^2\,dR,
\]

\[
 X(L)=2\sum_{m<n}c_mc_n
       \int_1^L C(R-\ell_m)C(R-\ell_n)\,dR.
 \tag{4}
\]

Here X(L) is the sum of the off-diagonal terms.
All indices may be restricted to n<exp(L+1). Using only Lambda(n)<=log n
and the elementary harmonic-sum bound,

\[
 0\le D(L)\le\|C\|_2^2
       \sum_{n<e^{L+1}}\frac{\Lambda(n)^2}{n}
 \le \|C\|_2^2(L+1)^2(L+2).
 \tag{5}
\]

Thus an explicit surviving proof obligation is the **one-sided** bound

\[
 \boxed{\ \forall\delta>0\ \exists A_\delta<\infty\ \forall L>1:
 \quad X(L)\le A_\delta e^{\delta L}.\ }
 \tag{6}
\]

A polynomial upper bound for X would suffice. Equation (5) plus (6) gives
the energy criterion; conversely RH gives X(L)<=I(L)=O(L). No bound on the
absolute value of every summand is
needed. **Equation (6) is not proved here.**

There is also a weighted version. The diagonal of the energy with weight
exp(-2 epsilon R) is at most

\[
 \|e^{-\epsilon v}C(v)\|_2^2
 \sum_{n\ge2}\frac{\Lambda(n)^2}{n^{1+2\epsilon}}<\infty
 \quad(\epsilon>0),
 \tag{7}
\]

unconditionally. The signed off-diagonal upper bound remains the issue.

The finite matrix of integrals in (4) is a positive semidefinite Gram
matrix. That only gives X(L)>=-D(L), the opposite side from (6). It does
not bound the energy above by its diagonal. The full-line correlation
kernel `K(t)=integral C(v) C(v+t) dv` has both signs: its exact value at
t=1/8 is negative. For the actual primes the instantaneous cross density
`P(R)^2-sum c_n^2 C(R-ell_n)^2` is negative at R=1 and positive at R=3/2.
Consequently a pointwise nonpositive-cross-term argument is false.

## 3. A genuine unbounded estimate for random multiplicative twists

Let xi_p be independent fair signs on primes, and extend them completely
multiplicatively: xi(p^m)=xi_p^m. In particular even powers have sign +1;
this is not the squarefree-supported random model sometimes also called
a Rademacher multiplicative function. Define

\[
 P_\xi(R)=\sum_{p,m\ge1}
 \frac{\log p}{p^{m/2}}\xi_p^m C(R-m\log p).
 \tag{8}
\]

For this family, the following unconditional statement **can be derived**:
with probability one, for every epsilon>0,

\[
 \int_1^\infty e^{-2\epsilon R}|P_\xi(R)|^2\,dR<\infty.
 \tag{9}
\]

The proof keeps the shared prime signs and the even powers. Put

\[
 U(R)=\sum_{p,k\ge1}\frac{\log p}{p^k}C(R-2k\log p),
 \quad
 V_p(R)=\sum_{j\ge0}\frac{\log p}{p^{(2j+1)/2}}
                     C(R-(2j+1)\log p).
\]

Then P_xi=U+sum_p xi_p V_p, and independence gives exactly

\[
 \mathbb E P_\xi(R)=U(R),\qquad
 \mathbb E|P_\xi(R)|^2=U(R)^2+\sum_p V_p(R)^2.
 \tag{10}
\]

Let s=1/2+epsilon, M_epsilon=||exp(-epsilon v)C(v)||², and
b=1-2^(-2s)>0. The weighted L2 norm of a translate of C is
`sqrt(M_epsilon) exp(-epsilon ell)`. The triangle inequality therefore yields

\[
 \|e^{-\epsilon R}U\|_{L^2(\mathbb R)}
 \le \frac{\sqrt{M_\epsilon}}{b}
         \sum_{n\ge2}\frac{\log n}{n^{2s}},
\]

\[
 \sum_p\|e^{-\epsilon R}V_p\|_{L^2(\mathbb R)}^2
 \le \frac{M_\epsilon}{b^2}
          \sum_{n\ge2}\frac{(\log n)^2}{n^{2s}}.
 \tag{11}
\]

All series here converge absolutely since 2s>1. Tonelli and (10) give the
explicit bound

\[
 \mathbb E\int_1^\infty e^{-2\epsilon R}|P_\xi(R)|^2\,dR
 \le \frac{M_\epsilon}{(1-2^{-1-2\epsilon})^2}
 \left[\big(-\zeta'(1+2\epsilon)\big)^2
             +\zeta''(1+2\epsilon)\right]<\infty.
 \tag{12}
\]

There is no continuation toward the critical strip in this estimate:
both derivatives are evaluated in the absolutely convergent half-plane.
A nonnegative random variable with finite expectation is finite almost
surely. Apply this for epsilon=1/k, k=1,2,..., and use monotonicity in
epsilon to obtain (9) simultaneously for every positive epsilon.
This is an unbounded-support statement about the twisted family, not a
finite numerical observation or an assertion of novelty.

At epsilon=1/4 the checker encloses the right side of (12), divided by
`||h||_2^4`, below **15.014560**. This number is an upper bound for an
expectation over signs, not an upper bound for the all-plus assignment.

## 4. Why averaging the twists does not finish the zeta proof

Ordinary zeta corresponds to xi_p=+1 for every prime. This single assignment
has probability zero under the fair product measure, so (9) says nothing
about whether it satisfies the bound. The mean in (10) is U, not P.

More generally, any probability measure on sign assignments that recovers
every coefficient of P by averaging must have E xi_p=1 for each prime p.
Since xi_p is either -1 or +1, it follows that xi_p=+1 almost surely for
each p. The countable intersection then forces the measure to be the point
mass on the all-plus assignment. A nontrivial positive average cannot both
retain the random cancellation in (12) and recover every zeta coefficient.
This is a limitation of this averaging argument, not of all signed bridges.

Conditioning finitely many prime signs to +1 does give an exact recovery
on each finite R-window once all contributing primes have been conditioned.
For each fixed finite conditioning the weighted energy is still finite
almost surely. But the elementary expectation bound loses the reciprocal
probability of the event: forcing r independent signs costs at most a factor
2^r in that estimate. A subsequent
[completion attempt](all-plus-recovery-attempt-2026-10-01.md) establishes the
stronger obstruction: the raw conditional means have a moving cutoff edge
whose weighted energy grows as a positive constant times Y^(1-2 epsilon).
For epsilon<1/2 a raw conditioning-independent energy bound is false even
under RH. The follow-up removes this edge by exact continuum subtraction;
the uniform bound for that centered recovery remains unproved. It also
shows that any fixed positive bias retains the original deterministic
mean. Signed recovery weights would likewise need a separately proved norm
bound; no interchange of average and limit closes the argument.

## 5. The dyadic refinement identity does not reduce the separation

For a>0 let g_a(x)=a^(-1)g(x/a), h_a=Qg_a, and let C_a be its
autocorrelation. The pole-removing operator Q remains fixed; h_a is not
merely a rescaling of h. Its Laplace transform is

\[
 H_a(z)=\left(\frac14-z^2\right)
       \left(\frac{\sinh(az/16)}{az/16}\right)^8.
\]

The elementary identity sinh(2x)=2 sinh(x) cosh(x) gives

\[
 C_a(v)=2^{-16}\sum_{j=0}^{16}\binom{16}{j}
                C_{a/2}\left(v-\frac{(8-j)a}{16}\right).
 \tag{13}
\]

The weights are positive and sum to one. The same relation holds for P_a,
and for the full translation interaction k_a by translation invariance and
linearity in the autocorrelation. After d refinements, the total shift is
at most a(1-2^(-d)). Thus a large R is only replaced by nearby values in
[R-a,R+a]; it is never replaced by R/2. This provides no induction from the
certified local window to arbitrary separations.

There are two additional obstructions to this particular bootstrap:

- A mode `Re(H_a(lambda)^2 exp(lambda R))`, with 0<Re lambda<1/2,
  obeys (13) exactly and can grow exponentially. Its multiplier
  `cosh(a lambda/32)^16` never vanishes in that half-strip. Refinement alone
  therefore does not eliminate the modes that the global proof must exclude.
- The fine-scale limit is not uniformly bounded. Write B=u^(*16), so
  `C_a=Q²[a^(-1) B(v/a)]`. At an isolated prime-power location,
  `P_a(log p)=c_p C_a(0)` for small enough a, and

\[
 C_a(0)=a^{-5}B^{(4)}(0)-\tfrac12a^{-3}B''(0)
                    +\tfrac1{16}a^{-1}B(0),
 \quad B^{(4)}(0)=\frac{80863232}{4725}>0.
 \tag{14}
\]

Between prime-power locations P_a eventually vanishes as a tends to zero,
but at those locations it has spikes of order a^(-5). The integral of an
isolated squared spike has leading order a^(-9). Pointwise disappearance
away from the atoms cannot justify a dominated-convergence argument through
the refinement average. Equation (13) is useful algebra, not the missing
arithmetic estimate.

## 6. A cutoff can manufacture exponential energy even in the continuum

One must not substitute a full-line energy of the sharply truncated sum
`P_N(R)=sum_{n<=N} c_n C(R-log n)` for the finite-window integral in (1).
The upper cutoff loses the cancellation of the prime-density main term.

This can be seen without prime error. The continuum density e^(x/2) has
zero convolution with C on the whole line because H(1/2)=0. Cut it off
at x=L. Near the cutoff, write R=L+y, -1<=y<=1. The remaining convolution is

\[
 e^{L/2}B_*(y),\qquad
 B_*(y)=e^{y/2}\int_y^1 e^{-v/2}C(v)\,dv.
 \tag{15}
\]

B_* is not identically zero: otherwise differentiating its integral would
force C=0. Consequently the edge contributes exactly

\[
 b_\epsilon e^{(1-2\epsilon)L},\qquad
 b_\epsilon=\int_{-1}^1 e^{-2\epsilon y}B_*(y)^2\,dy>0
 \tag{16}
\]

to the weighted full-line energy. Taking the continuum only on 0<=x<=L
adds a disjoint, L-independent lower-edge contribution for L>2, so the
same upper-edge conclusion holds with a nonnegative-domain density.
For 0<epsilon<1/2 this grows exponentially, even though the untruncated
continuum has exact cancellation for every R>1.

This is also an actual obstruction for the prime cutoff. Put N=exp(L) and
use n<=N in P_N. The prime number theorem and partial summation give,
uniformly for y in [-1,1],

\[
 e^{-L/2}P_N(L+y)=B_*(y)+o(1).
 \tag{17}
\]

Indeed the only relevant n lie between exp(L-2) and exp(L); the normalized
Stieltjes measures `e^(-L) d psi(e^(L+t))` converge on this fixed t-window
to e^t dt, and the C-translates and their first derivatives are uniformly
bounded. This yields uniform partial summation, including at y=-1 and 1.
The PNT used here is only `psi(x)=x+o(x)`
([DLMF 25.16.3](https://dlmf.nist.gov/25.16.E3)).
Thus the edge energy for the actual truncated primes is
`(b_epsilon+o(1)) exp((1-2 epsilon)L)`. A cutoff-independent bound for this
raw full-line energy is false for epsilon<1/2, whether or not RH holds.

The correct finite computation of I(L) includes every prime power below
exp(L+1), while integrating only on 1<=R<=L. The one-unit collar makes
the sum exactly equal to P throughout the integration interval. Do not
integrate the artificial upper edge, or omit the collar.

## 7. Reproducible finite checks

Run with python-flint 0.8.0:

```bash
python scripts/audit-unbounded-energy.py \
  --output research-inputs/rh-positivity-audit/unbounded-energy.json
```

The checker uses rational coefficient identities and 512-bit Arb arithmetic.
Its dependency on the translation checker is source-hashed in the receipt.
It checks all 32 common polynomial pieces in (13), the isolated-prime spike,
the signed Gram-kernel lobe, both signs of the actual cross density, and all
32 relevant multiplicative prime-sign assignments at R=3/2. It evaluates
the finite upper bound (12) and the positive continuum-edge constant (16).

For the actual untwisted primes, it integrates over **whole intervals** by
sweeping every translated spline knot and integrating the resulting degree-30
polynomial exactly, with interval-enclosed coefficients. It separately
accumulates the individual squares for D. Independent local-spline evaluation
with 16-point Gauss integration on every knot interval checks I(2); the
polynomial degree makes this rule exact, leaving only enclosed arithmetic
error. Every contributing prime power is included, with the required collar.

Rounded diagnostics, each divided by `||h||_2^4`:

| Endpoint L | I(L), full energy | D(L), diagonal | X(L), signed cross terms |
|---|---:|---:|---:|
| 2 | 0.1794103853 | 0.2731533553 | -0.0937429700 |
| 4 | 0.5027086197 | 1.3328928654 | -0.8301842456 |
| 6 | 0.8179839988 | 3.2551910315 | -2.4372070327 |

The independent I(2) residual has absolute bound below 4e-125. At
epsilon=1/4, `b_epsilon/||h||_2^4` lies between 0.0012592240068 and
0.0012592240069. Increasing the continuum cutoff L by 4 multiplies its
upper-edge energy by exp(2)>7.389. These finite checks support the formulas
and reject the specified shortcuts. They do not bound I(L) for unbounded L.

## 8. What remains

The random signs provide enough cancellation to prove (9). Exact recovery
of ordinary zeta removes the independence that made that argument work.
For the deterministic route, the diagonal estimate (5) is complete; the
remaining problem is the signed, one-sided prime-pair bound (6), or another
estimate implying the equivalent weighted energy criterion.

The next useful proof attempt must control those arithmetic correlations
uniformly in the endpoint, or bound a valid centered recovery of the all-plus
twist. The [completion attempt](all-plus-recovery-attempt-2026-10-01.md)
rejects a uniform bound for raw conditioning and supplies the corrected
endpoint identity. More finite windows, Gram positivity alone,
fine-scale pointwise disappearance, and an almost-sure random bound do not
supply that implication. No completed RH proof is claimed.
