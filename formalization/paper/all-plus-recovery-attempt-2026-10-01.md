# All-plus recovery: completion attempt and the remaining gap

**This attempt does not complete an RH proof.** It tests three ways of
closing the [unbounded-energy argument](unbounded-support-energy-2026-10-01.md):
forcing prime signs to plus, introducing a small sign bias, and bounding the
prime-pair sum term by term. The raw conditioning bound is false because of
a moving cutoff edge. A centered replacement has an exact error identity,
but its required uniform bound remains unproved. Nonzero bias retains the
original deterministic obstruction, and absolute prime-pair bounds grow
exponentially.

These deductions require independent mathematical review. They are not
formally verified or claimed to be novel. The strongest full-space local
certificate in this branch remains at support width 2.

## 1. The higher prime powers are a bounded background

Keep C, P, U, and V_p from the energy note. Thus C is the fixed real even
autocorrelation supported on [-1,1],

\[
 P(R)=\sum_{p,m\ge1}\frac{\log p}{p^{m/2}}C(R-m\log p)
     =U(R)+\sum_p V_p(R),
 \qquad \int C(v)\,dv=H(0)^2=\frac1{16}.
 \tag{1}
\]

U contains the even powers; V_p contains the odd powers of p. Also write

\[
 \Pi(R)=\sum_p\frac{\log p}{\sqrt p}C(R-\log p),\qquad
 T(R)=P(R)-\Pi(R).
\]

Both T and U are bounded for R>=1, unconditionally. To see this, put
theta(x)=sum_{p<=x} log p and choose K with theta(x)<=Kx for x>=1.
For prime squares the relevant primes lie in [a,ea],
a=exp((R-1)/2). Partial summation gives

\[
 \sum_{a<p\le ea}\frac{\log p}{p}
 \le K+K\log(ea/a)=2K.
\]

For powers of exponent at least 3, the entire coefficient sum converges:

\[
 \sum_p\sum_{m\ge3}\frac{\log p}{p^{m/2}}
 \le\frac1{1-2^{-1/2}}\sum_{n\ge2}\frac{\log n}{n^{3/2}}<\infty.
 \tag{2}
\]

Multiplying these bounds by ||C||_infinity proves the assertion. The same
bound works for every subset of the terms of exponent at least 3.

In fact, the prime number theorem gives

\[
 T(R)\longrightarrow\frac12\int C(v)\,dv=\frac1{32},
 \qquad U(R)\longrightarrow\frac1{32}.
 \tag{3}
\]

For the squares, replace d theta(t) by dt in the fixed-ratio moving window:
the main integral is `integral C(R-2 log t) dt/t = (1/2) integral C`.
Partial summation makes its error o(1). Terms with exponent at least 3 tend
to zero by (2) and dominated convergence. The needed PNT is just
`psi(x)=x+o(x)`; subtracting higher powers gives theta(x)=x+o(x).
See [DLMF 25.16.3](https://dlmf.nist.gov/25.16.E3).

Thus the deterministic global difficulty already occurs in the first prime
powers. The bounded square-prime background must be kept in identities but
does not obstruct any of the weighted L2 conditions below.

## 2. A nonzero sign bias keeps the entire deterministic problem

Let the prime signs be independent with E_b xi_p=b, where 0<=b<=1, and
extend them completely multiplicatively. At each R the sums are finite, and

\[
 P_\xi(R)=bP(R)+(1-b)U(R)+N_b(R),
 \qquad N_b(R)=\sum_p(\xi_p-b)V_p(R).
 \tag{4}
\]

Independence gives

\[
 \mathbb E_b N_b(R)^2=(1-b^2)\sum_p V_p(R)^2,
\]

\[
 \mathbb E_b P_\xi(R)^2=
       [bP(R)+(1-b)U(R)]^2+(1-b^2)\sum_p V_p(R)^2.
 \tag{5}
\]

For every epsilon>0, the preceding energy note proves

\[
 \sum_p\int_1^\infty e^{-2\epsilon R}V_p(R)^2\,dR<\infty.
 \tag{6}
\]

Consequently N_b belongs almost surely to
`H_epsilon=L2([1,infinity), exp(-2 epsilon R)dR)` by Tonelli. The statement
holds simultaneously for all positive epsilon by first intersecting the
probability-one events at epsilon=1/k. U also belongs to every H_epsilon.

For **every fixed b>0**, equation (4) therefore gives

\[
 P_\xi\in H_\epsilon\ \Longleftrightarrow\ P\in H_\epsilon
 \quad\text{almost surely}.
 \tag{7}
\]

If P does not belong to one such space, adding the almost-sure H_epsilon
fluctuation cannot make it belong. Using the earlier Laplace criterion,
the event that a biased twist has finite weighted energy for every epsilon
has probability one if RH holds, and probability zero if RH fails.

At b=0 the deterministic P term disappears, which explains why fair signs
gave an unconditional result. An arbitrarily small fixed positive b brings
back a nonzero multiple of that whole term. The finite-window formulas are
polynomial in b; this does not justify passing an unbounded-support norm
through b=0. The variance estimate (6) controls only the fluctuation, not
the mean in (5). This rules out the proposed small-bias transfer from the
fair-sign theorem.

## 3. The raw uniform conditioning bound is false

Condition fair signs to xi_p=+1 for all p<=Y. Their conditional mean is

\[
 M_Y(R)=U(R)+\sum_{p\le Y}V_p(R).
 \tag{8}
\]

For each fixed Y it has finite H_epsilon norm. But these norms are not
uniform in Y when 0<epsilon<1/2. This strengthens the earlier statement
that the conditioning estimate loses a factor 2^pi(Y): the raw uniform
bound is not merely unavailable; it is false.

Put L=log Y and -1<=y<=1. Equation (2) and the bound for U show that
M_Y differs by a uniformly bounded function from
`sum_{p<=Y} (log p)/sqrt(p) C(R-log p)`.
PNT and uniform partial summation on the fixed-ratio interval then yield

\[
 Y^{-1/2}M_Y(L+y)=B_*(y)+o(1),\qquad
 B_*(y)=e^{y/2}\int_y^1e^{-v/2}C(v)\,dv,
 \tag{9}
\]

uniformly on [-1,1]. The continuum profile B_* is nonzero. Hence

\[
 \int_{L-1}^{L+1} e^{-2\epsilon R}M_Y(R)^2\,dR
 =\big(b_\epsilon+o(1)\big)Y^{1-2\epsilon},
 \quad b_\epsilon=\int_{-1}^1e^{-2\epsilon y}B_*(y)^2\,dy>0.
 \tag{10}
\]

By Jensen, the corresponding conditional expected energy is at least this
large. It diverges for epsilon<1/2, regardless of RH. The earlier
suggestion to seek a raw conditioning-independent energy bound must
therefore be replaced by a centered construction or an estimate on an
interior window with its full collar. Pointwise recovery of P does not
control this moving edge.

## 4. Centering repairs the cutoff, but does not prove the needed estimate

Define an exactly centered first-prime cutoff

\[
 G_Y(R)=\sum_{p\le Y}\frac{\log p}{\sqrt p}C(R-\log p)
       -\int_1^Y t^{-1/2}C(R-\log t)\,dt,
 \qquad \widetilde P_Y(R)=G_Y(R)+T(R).
 \tag{11}
\]

For R>1 the subtracted integral is exactly
`sqrt(Y) B_*(R-log Y)`, supported on the moving edge
[log Y-1,log Y+1]. Outside that edge it vanishes, using H(1/2)=0.
For each fixed compact R-window with upper endpoint R_max, tilde P_Y agrees
exactly with P once Y>exp(R_max+1). Each tilde P_Y has finite
H_epsilon norm unconditionally, since G_Y has compact support in R and
T is bounded.

The valid, but unproved, uniform target is

\[
 \forall\epsilon>0:\quad
 \sup_{Y\ge2}\int_1^\infty e^{-2\epsilon R}
                         |\widetilde P_Y(R)|^2\,dR<\infty.
 \tag{12}
\]

Fatou would pass (12) to P and finish the earlier RH implication.
To investigate (12), write E_theta(t)=theta(t)-t and
J(v)=C(v)/2+C'(v). Stieltjes integration by parts gives the exact identity

\[
 \boxed{G_Y(R)=\frac{E_\theta(Y)}{\sqrt Y}C(R-\log Y)
       +\int_1^Y E_\theta(t)t^{-3/2}J(R-\log t)\,dt.}
 \tag{13}
\]

The upper endpoint cannot be discarded. The lower endpoint is zero for
R>1 because C(R)=0. The derivative of
`t^(-1/2) C(R-log t)` is `-t^(-3/2) J(R-log t)`, which fixes the sign.

The attempted absolute estimate stops here. PNT gives E_theta(t)=o(t),
so (13) implies only

\[
 |G_Y(R)|=o(e^{R/2})\quad(R\to\infty),
 \tag{14}
\]

uniformly in Y. Every nonzero term samples t between exp(R-1) and
exp(R+1), which supplies the uniformity. This bound does not imply (12)
for small positive epsilon. No signed improvement of (13) is established.

For comparison, **assuming RH** gives, for every eta>0,
`|E_theta(t)|<=K_eta t^(1/2+eta)`. This follows from the classical RH
criterion for psi in [DLMF 25.16.4](https://dlmf.nist.gov/25.16.E4), since
`psi(t)-theta(t)=O(sqrt(t) log(t)^2)` by elementary counting of higher
powers. Inserting it into (13) gives

\[
 |G_Y(R)|\le K_\eta e^{\eta R}
 \left(e^\eta\|C\|_\infty+
             \int_{-1}^1e^{-\eta v}|J(v)|\,dv\right),
 \tag{15}
\]

uniformly in Y. Choosing eta<epsilon proves (12), conditional on RH.
Thus (12) is equivalent to RH. Applying (15) unconditionally would assume
the unresolved estimate; centering by itself supplies no such estimate.

## 5. Direct prime-pair estimates must preserve signed cancellation

The alternative completion target from the energy note is a one-sided
subexponential upper bound for

\[
 X(L)=2\sum_{m<n}c_mc_n K_L(\log m,\log n),\qquad
 K_L(u,v)=\int_1^L C(R-u)C(R-v)\,dR.
\]

The termwise absolute bound

\[
 A(L)=2\sum_{m<n}c_mc_n|K_L(\log m,\log n)|
 \tag{16}
\]

grows at least exponentially, unconditionally. This remains true though
the kernel is positive semidefinite and the original diagonal is only
polynomially large.

Here is a quantitative proof. Let `K(t)=integral C(v)C(v+t)dv`,
K_0=||C||², and K_1=||C'||². Translation in H1 gives

\[
 K_0-K(t)=\tfrac12\|C(\cdot+t)-C\|_2^2
           \le\tfrac12t^2K_1.
 \tag{17}
\]

Exact rational integration verifies delta² K_1<K_0 for delta=1/64.
Thus K(t)>=K_0/2 whenever |t|<=delta. Restrict (16) to distinct primes
with log p in [L-2,L-2+delta]. Their translated supports lie entirely
inside [1,L] for L>4, so K_L equals the full kernel K there. Put
`S_L=sum (log p)/sqrt(p)` and `D_L=sum (log p)^2/p` over this short
logarithmic interval. Then

\[
 A(L)\ge\frac{K_0}{2}(S_L^2-D_L).
\]

PNT and partial summation give
`S_L ~ 2 exp((L-2)/2)(exp(delta/2)-1)`, while elementary bounds give
D_L=O(L²). Therefore

\[
 \liminf_{L\to\infty} e^{-L}A(L)
 \ge 2K_0e^{-2}(e^{\delta/2}-1)^2>0.
 \tag{18}
\]

After division by ||h||_2^4, the positive constant on the right exceeds
3.31126e-6. This rejects a termwise absolute or triangle-inequality proof
of the desired subexponential bound. It does not exclude methods that
retain cancellation between the positive and negative Gram-kernel lobes.
The boundedness of the random variance does not control these deterministic
cross terms.

Related prime-variance literature cannot be imported without checking its
hypotheses. For example, the improved bounds described by
[Carneiro, Chandee, Chirre, and Milinovich](https://arxiv.org/abs/2108.09258)
explicitly assume RH. That source supplies context, not an unconditional
estimate for X(L) here.

## 6. Verification and proof status

```bash
python scripts/audit-all-plus-recovery.py \
  --output research-inputs/rh-positivity-audit/all-plus-recovery.json
```

The checker uses rational spline algebra and 512-bit Arb arithmetic. Nine
groups check the constants and finite identities used above, including:

- independent exact calculations of K_0 and K_1, including
  `-K''(0)=||C'||²`, and the positive-kernel radius in (17);
- all 32 relevant prime-sign assignments at R=3/2 for biases
  0, 1/10, 1/2, and 1, keeping correlations across powers of a prime;
- explicit convergent upper bounds for the weighted variance and the
  absolute coefficient sum in (2), using zeta derivatives only at 3/2;
- the centered identity (13) at Y=100, R=log(100)+1/8, independently
  integrating across every theta jump and spline knot;
- the positive edge constant and finite moving-edge diagnostics at
  Y=100, 1000, 10000, with all contributing prime powers included.

The residual in (13) is enclosed within 4e-129. Its endpoint contribution
divided by ||h||² exceeds 0.2625, so omission is decisively rejected. The
moving-edge samples are not monotone and are not an asymptotic certificate;
the divergence claim (10) rests on its PNT proof, not those samples.
Source hashes include both imported audit dependencies.

| Proposed completion | Result of this attempt |
|---|---|
| Uniform energy under raw finite all-plus conditioning | False: moving-edge energy diverges for epsilon<1/2 |
| Transfer from fair signs using a small fixed positive bias | Retains a nonzero multiple of the original P; no transfer |
| Remove the continuum edge before recovery | Exact construction and endpoint identity; uniform bound (12) unproved |
| Bound each prime-pair term in absolute value | Exponential lower bound (18), so too large |
| Prove a signed upper bound directly for X(L) | Still unresolved |

The remaining inequality is not an omitted algebraic step. It is the
unproved arithmetic cancellation statement on which this route depends.
These checks and counterexamples prevent incorrect completions; they do
not establish RH or certify progress toward a smaller unconditional
exponential growth rate for P.
