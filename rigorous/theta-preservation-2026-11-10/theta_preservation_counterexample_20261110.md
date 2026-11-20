# A certified counterexample to the proposed stronger-class invariance

Research continuation, 10 November 2026. The proposed stronger class
from PR #51 is **not preserved in general** by a Schur reduction and
canonical swap. The counterexample below consists of a globally
admissible pair and one explicit anchor. Its input signs have exact
polynomial proofs. A rigorous two-integral certificate proves that an
output convexity has the wrong sign near the spatial origin.

This is an auxiliary-pair counterexample. It is not a counterexample to
the actual theta ratio theorem, actual theta preservation, or RH. In
particular, this example does not impose the additional special relation
u=C_v used by the original theta pair.

## 1. The pair satisfies every proposed input sign globally

Take

$$
v(t)=e^{-t^2},\qquad
u(t)=\frac{e^{-t^2}}{\sqrt{t^2+5}}.
\tag{1}
$$

Both kernels are positive, smooth, even, and rapidly decreasing with
all required transform moments. Their bilateral Laplace transforms
are entire. Put q=t^2 and define the ratios in PR #51:

$$
H=\frac uv=(q+5)^{-1/2},\qquad
B=\frac{4u''}{v},\qquad J=\frac{4v''}{v}=16q-8.
$$

Here primes on u and v denote derivatives in t; subscripts q below
denote derivatives in q. Direct differentiation gives

$$
B=\frac{4(4q^3+42q^2+102q-55)}{(q+5)^{5/2}},
$$

$$
H_q=-\frac1{2(q+5)^{3/2}}<0,\qquad J_q=16>0,
$$

$$
B_q=\frac{2(4q^3+78q^2+534q+1295)}{(q+5)^{7/2}}>0,
$$

$$
B_{qq}=-\frac{4q^3+114q^2+1110q+3725}{(q+5)^{9/2}}<0.
\tag{2}
$$

The two convexity numerators are

$$
\boxed{
H_{qq}B_q-H_qB_{qq}
=\frac{2(2q^3+30q^2+123q+40)}{(q+5)^6}>0,
}
\tag{3}
$$

$$
\boxed{
J_{qq}B_q-J_qB_{qq}
=\frac{16(4q^3+114q^2+1110q+3725)}{(q+5)^{9/2}}>0.
}
\tag{4}
$$

Every polynomial in (2)--(4) has strictly positive coefficients.
Since q increases with t>0, these identities prove H'<0, B'>0,
J'>0 and strict convexity of H and J as functions of B on the entire
positive half-line. This is exactly the stronger input class proposed
in PR #51; there is no independent choice of incompatible H,B,J.

## 2. One explicit reduction

Use the transform convention

$$
U(z)=\int_{\mathbb R}u(t)e^{zt/2}dt,\qquad
V(z)=\int_{\mathbb R}v(t)e^{zt/2}dt,
\qquad R(z)=zU(z)/V(z).
$$

Fix a=10, put

$$
\mu=U(a)/V(a),\qquad r=R(a)=a\mu,
$$

and let n,b be the canceled pair:

$$
n+ab=u,\qquad an+4b''=rv,
\qquad (4D_t^2-a^2)n=4u''-arv.
\tag{5}
$$

The input signs just proved permit the PR #51 comparison theorem, so
n,b are positive and N=n/v strictly decreases for t>0. The canonical
new pair is (b,n), with

$$
z=1/N,\qquad
H_{\rm new}=(Hz-1)/a,\qquad
B_{\rm new}=rz-a.
$$

For any increasing coordinate q with N_q<0,

$$
\boxed{
\frac{d^2 H_{\rm new}}{dB_{\rm new}^2}
=\frac{N^3}{ar^2(-N_q)^3}
\bigl(H_qN_{qq}-H_{qq}N_q\bigr).
}
\tag{6}
$$

Thus a negative value of the last bracket disproves the required
output convexity. The bracket can be evaluated at q=0 using only
the transform ratio mu and one canceled-kernel value.

## 3. Two rigorous integrals determine the origin coefficient

Completing the square in the Gaussian transform gives

$$
\mu=\frac1{\sqrt\pi}\int_{\mathbb R}
\frac{e^{-(s-5/2)^2}}{\sqrt{s^2+5}}ds.
\tag{7}
$$

The decaying Green kernel for 4D_t^2-a^2 is
$-e^{-a|t|/2}/(4a)$. Applying it to the equation for b at t=0 gives

$$
b(0)=\frac12\int_0^\infty e^{-5s-s^2}
\bigl[(s^2+5)^{-1/2}-\mu\bigr]ds.
$$

Set

$$
I_u=\int_0^\infty\frac{e^{-s^2-5s}}{\sqrt{s^2+5}}ds,
\qquad
I_v=\frac{\sqrt\pi}{2}e^{25/4}\operatorname{erfc}(5/2).
$$

Since v(0)=1, equation (5) gives

$$
N_0=N(0)=\frac1{\sqrt5}-5(I_u-\mu I_v).
\tag{8}
$$

Writing (5) in q and matching its constant and linear coefficients
gives exact derivative identities

$$
N_q(0)=\frac{B(0)-100\mu+108N_0}{8},
$$

$$
N_{qq}(0)=\frac{B_q(0)+140N_q(0)-16N_0}{24}.
\tag{9}
$$

The required known input derivatives are

$$
H_q(0)=-\frac1{10\sqrt5},\quad
H_{qq}(0)=\frac3{100\sqrt5},\quad
B(0)=-\frac{44}{5\sqrt5},\quad
B_q(0)=\frac{518}{25\sqrt5}.
$$

Equivalently, the failure coefficient simplifies to

$$
\Delta_0:=H_q(0)N_{qq}(0)-H_{qq}(0)N_q(0)
=\frac{\sqrt5}{15000}
\bigl(23000\mu-24640N_0+353\sqrt5\bigr).
\tag{10}
$$

### Explicit integral tails and branch handling

The executable integrates (7) over [-T,T] and I_u over [0,T],
with T=20 and exact half-unit subdivisions. FLINT complex ball
integration encloses each finite piece. The callback evaluates
`(s*s+5).sqrt(analytic=analytic)`, so a complex ball touching a
square-root branch cut is not silently treated as holomorphic.

The inequality
$\int_L^\infty e^{-x^2}dx\le e^{-L^2}/(2L)$, L>0, gives

$$
E_\mu\le\frac1{\sqrt{5\pi}}
\left[
\frac{e^{-(T-5/2)^2}}{2(T-5/2)}
+\frac{e^{-(T+5/2)^2}}{2(T+5/2)}
\right].
\tag{11}
$$

Convexity of s^2+5s and $(s^2+5)^{-1/2}\le1/\sqrt5$ give

$$
E_{I_u}\le\frac{e^{-T^2-5T}}{(2T+5)\sqrt5}.
\tag{12}
$$

Both finite integral enclosures are enlarged by symmetric error balls
with these rigorous radii. The Gaussian integral I_v uses an Arb erfc
evaluation. No quadrature output is used without its error bound.

## 4. Certified failure and conclusion

At 256-bit precision, the certificate obtains

$$
\mu\in0.30185515350111671718504243166717061641699325147286849
\ \pm3.18\cdot10^{-54},
$$

$$
N_0\in0.3138035844738202499171711921330239898933010667369435
\ \pm1.05\cdot10^{-53},
$$

and

$$
\boxed{
\Delta_0\in
-1.78579621350399572791500356384512212732771691748\cdot10^{-5}
\ \pm8.26\cdot10^{-53}
<-0.0000178.
}
\tag{13}
$$

The same calculation certifies N_0>0 and N_q(0)<0. All quantities
in (6) are continuous in q near zero, with a strictly positive
prefactor there. Therefore

$$
\frac{d^2H_{\rm new}}{dB_{\rm new}^2}<0
$$

for every sufficiently small positive t. One reduction at a=10 has
left the proposed stronger class despite all input hypotheses holding
strictly and globally. This proves that those hypotheses alone cannot
support the proposed universal preservation induction.

## 5. Reproduce and research implication

With SymPy and python-flint installed, run

```bash
python theta_preservation_counterexample_20261110.py
```

The script checks nine exact identities/coefficient conditions and
recomputes the two rigorous integral enclosures. Captured output is in
`theta_preservation_counterexample_replay_20261110.json`.

A successful actual-theta preservation theorem must use information
not contained in this general class. The original relation u=C_v is
one such additional constraint; higher comparisons of the source
curvatures may be another. This counterexample makes no claim that
either proposed strengthening is sufficient. The two global actual
theta ratio signs proved in PR #51 remain unaffected.
