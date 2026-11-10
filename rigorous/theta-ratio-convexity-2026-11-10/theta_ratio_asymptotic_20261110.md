# Boundary regimes for the two actual-theta ratio inequalities

Research continuation, 10 November 2026. This note proves the two proposed
ratio signs in nontrivial boundary regimes. It also gives the exact
small-anchor limiting test. The companion
[global proof](theta_ratio_global_20261110.md) establishes both original
ratio signs on the full domain by a different argument. These boundary
estimates provide additional structure; they do not establish
preservation under later Schur reductions.

## 1. Setup

Use the actual kernel, on the positive half-line,

$$
\kappa(t)=e^{t/4}\sum_{n\ge1}
\left[2(\pi n^2e^t)^2-3\pi n^2e^t\right]e^{-\pi n^2e^t},
$$

extended evenly. Put

$$
C(t)=\frac14\int_t^\infty s\kappa(s)\,ds,
\qquad Q(t)=-\frac{\kappa'(t)}{t\kappa(t)},
\qquad H(t)=C(t)/\kappa(t).
$$

The established theta input is $Q>0$, $Q'>0$ for $t>0$.
The first canceled pair at anchor $a>0$, with $p=L(a)>0$, satisfies

$$
n_a+a b_a=C,\qquad
(4\partial_t^2-a^2)n_a=-(t\kappa)' -ap\kappa.
\tag{1}
$$

All kernels are even and smooth. The previously proved first-pair
positivity gives $n_a,b_a>0$. The targets are

$$
(n_a/b_a)'(t)>0,\qquad(n_a/\kappa)'(t)<0.
\tag{2}
$$

The prime/gamma formula for actual xi gives
$p=L(a)=\tfrac12\log(a/(2\pi))+O(1/a)$ as $a\to\infty$.
Only $p\to\infty$ and $p=O(\log a)$ are needed in Section 2.

## 2. Both signs hold on every fixed compact interval for large anchors

**Theorem.** For every finite $T>0$, there is an $A_T$ such that both
inequalities (2) hold for every $a\ge A_T$ and $0<t\le T$.

This is uniform down to the origin after dividing the odd derivatives
by t. It gives no uniform conclusion when t grows with a.

### Exact approximate-identity representation

Define the even probability kernel

$$
J_a(s)=\frac a4 e^{-a|s|/2},\qquad \int_{\mathbb R}J_a(s)ds=1.
$$

The full-line Green solution of (1) is exactly

$$
\boxed{
n_a=\frac pa J_a*\kappa
       +\frac1{a^2}J_a*(t\kappa)'.
}
\tag{3}
$$

Here $(a^2-4\partial_t^2)^{-1}=a^{-2}J_a*$.
There is no uncontrolled expansion of the canceled tail integral.

For a smooth f with bounded derivatives,

$$
\|J_a*f-f\|_{C^r(\mathbb R)}
\le \frac4{a^2}\|f\|_{C^{r+2}(\mathbb R)}.
\tag{4}
$$

Indeed, the odd Taylor term integrates to zero and
$\int s^2J_a(s)ds=8/a^2$. All derivatives needed here are bounded
for actual theta. Therefore, in $C^r(\mathbb R)$,

$$
n_a=\frac pa\kappa+\frac1{a^2}(t\kappa)'
       +O_r(p/a^3+a^{-4}).
\tag{5}
$$

Division by the strictly positive kernel on $[-T,T]$ gives, in $C^2$,

$$
\boxed{
\frac{n_a(t)}{\kappa(t)}
=\frac pa+\frac{1-t^2Q(t)}{a^2}
 +O_T(p/a^3).
}
\tag{6}
$$

All remainders are even. Hence their first derivatives divided by t are
bounded by the corresponding $C^2$ remainder norm, uniformly including
the removable limit at zero. Thus

$$
\frac1t\left(\frac{n_a}{\kappa}\right)'
=-\frac{2Q(t)+tQ'(t)}{a^2}+O_T(p/a^3).
\tag{7}
$$

For actual theta, $Q$ extends continuously to zero with $Q(0)>0$;
an elementary certificate is supplied in Section 5. Consequently the
leading coefficient is bounded away from zero on $[0,T]$. Since
$p/a\to0$, (7) proves the second sign uniformly.

### The numerator-to-denominator ratio

By $b_a=(C-n_a)/a$, (5) and the positive minimum of C on $[-T,T]$,

$$
\boxed{
\frac{n_a}{b_a}
=p\frac\kappa C+O_T(p^2/a)
\quad\text{in }C^2([-T,T]).
}
\tag{8}
$$

The already established strict tail inequality $4QH<1$ extends to
t=0. Indeed, strict increase of Q and $Q(0)>0$ give

$$
4C(0)=\int_0^\infty\frac{-\kappa'(s)}{Q(s)}ds
<\frac{\kappa(0)}{Q(0)}.
$$

Since $H'=t(QH-1/4)$,

$$
\frac1t\left(\frac\kappa C\right)'
=\frac{1/4-QH}{H^2}>0
\quad(0\le t\le T).
\tag{9}
$$

The continuous right side has a positive minimum on $[0,T]$.
Applying evenness again to the remainder in (8) proves

$$
\frac1t\left(\frac{n_a}{b_a}\right)'
=p\frac{1/4-QH}{H^2}+O_T(p^2/a)>0
$$

for all sufficiently large a. This completes the theorem.

## 3. Both signs hold in the far spatial tail at each fixed anchor

**Theorem.** For each fixed $a>0$, there is a $T_a$ such that (2) holds
for every $t\ge T_a$.

Put $P=\pi e^t$. The first theta term gives

$$
\kappa(t)=2\pi^2e^{9t/4-P}
\left(1-\frac3{2P}\right)
\left[1+O(e^{-3P})\right].
\tag{10}
$$

The remainder and its first fixed number of t-derivatives are bounded by
polynomials in P times $e^{-3P}$. This follows by comparing the terms
with $n\ge2$ against $n=1$; their relative exponential factor is
$e^{-(n^2-1)P}$. The series bounds remain valid under differentiation.

The substitution $q=P(e^s-1)$ in a tail integral starting at t gives

$$
\frac{\kappa(t+s)}{\kappa(t)}ds
=\frac{e^{-q}}P(1+q/P)^{5/4}
\frac{1-3/[2(P+q)]}{1-3/(2P)}\,dq
$$

for the leading theta term. Higher terms are exponentially smaller.
Taylor expansion of the displayed factors under this exponentially
dominated integral yields

$$
\frac C\kappa
=\frac1{4P}\left[t+\frac{5t/4+1}{P}
                 +O(t/P^2)\right].
\tag{11}
$$

The expansion remains valid after one or two t-derivatives: split
$q\le P/2$ for the Taylor estimate and $q>P/2$ for an exponentially
small tail, then differentiate the explicit integral. No numerical
asymptotics are used as a sign proof.

The canceled Green formula for the denominator is

$$
\frac{b_a(t)}{\kappa(t)}
=\frac1{2a}\int_0^\infty
\sinh(as/2)\frac{\kappa(t+s)}{\kappa(t)}
\left[p-aH(t+s)\right]ds.
\tag{12}
$$

For fixed a and p, $H(t+s)=O((t+s)e^{-t-s})$. In the same q-variable,
$\sinh[\tfrac a2\log(1+q/P)]/(2a)=q/(4P)+O_a((q+q^3)/P^2)$
on the Taylor region. The complement is controlled by $e^{-q}$ times
a fixed polynomial in $1+q/P$. Hence, with differentiated remainders,

$$
\boxed{\frac{b_a}{\kappa}
=\frac p{4P^2}\left[1+O_a(t/P)\right].}
\tag{13}
$$

Using $n_a=C-a b_a$, equations (11)--(13) give

$$
\frac{n_a}{\kappa}
=\frac t{4P}+O_a(t/P^2),
\qquad
\left(\frac{n_a}{\kappa}\right)'
=\frac{1-t}{4P}+O_a(t/P^2)<0
$$

eventually. They also give

$$
\frac{n_a}{b_a}
=\frac{tP}{p}\left[1+O_a(t/P)\right],
\qquad
\left(\frac{n_a}{b_a}\right)'
=\frac{(t+1)P}{p}\left[1+O_a(t/P)\right]>0
$$

eventually. All constants in this section may depend on the fixed
anchor. The theorem therefore does not fill the joint transition
region where both a and t diverge.

## 4. The small-anchor limit isolates a new exact test

Let $\ell_1=L'(0)=F''(0)/F(0)>0$, so
$p=\ell_1a+O(a^3)$. Expanding the canceled Green formula, with
superexponential domination, gives on every compact interval in every
fixed differentiability order

$$
b_a(t)=a B_0(t)+O(a^3),\qquad
n_a(t)=C(t)-a^2 B_0(t)+O(a^4),
\tag{14}
$$

where

$$
\boxed{B_0(t)=\frac14\int_t^\infty
(s-t)[\ell_1\kappa(s)-C(s)]ds.}
\tag{15}
$$

The source has zero ordinary half-line mass and exactly one
negative-to-positive crossing, because H strictly decreases and
$\ell_1=\mathcal LC(0)/F(0)$. Subtracting the increasing weight
$(s-t)_+$ at the crossing proves $B_0(t)>0$.

The second sign in (2) consequently holds for all sufficiently small a,
uniformly on $0<t\le T$, by the strict negative sign of $H'/t$.
For the first sign, however, the leading condition is exactly

$$
\left(\frac{n_a}{b_a}\right)'
=\frac1a\left(\frac C{B_0}\right)'+O_T(a).
\tag{16}
$$

This note does not prove $(C/B_0)'>0$ globally. It is a genuine
additional limiting test, not a consequence asserted from $Q'>0$.

For a useful origin diagnostic, define
$I_k=\int_0^\infty t^k\kappa(t)dt$. Then

$$
\ell_1=\frac{I_2}{4I_0},\quad C(0)=I_1/4,\quad
B_0(0)=\ell_1C(0)-I_3/32,
$$

and the exact leading Wronskian coefficient is

$$
\boxed{
\lim_{t\downarrow0}
\frac{C'B_0-CB_0'}t
=\frac{\kappa(0)}4
\left[-2\ell_1C(0)+\frac{I_3}{32}
                   +\frac{C(0)^2}{\kappa(0)}\right].
}
\tag{17}
$$

The sign of (17) should be certified if this endpoint is used in a
global proof. Exploratory quadrature gives it positive for actual
theta, but no numerical value is used as a theorem here.

## 5. Elementary certificate that Q(0)>0

Termwise differentiation of the theta series gives

$$
\kappa''(0)=\sum_{n\ge1}P_2(\pi n^2)e^{-\pi n^2},\qquad
P_2(x)=\frac{x(32x^3-224x^2+330x-75)}{16}.
$$

For $3<x<22/7$, $P_2(x)<-40$. One direct verification sets
$x=3+y$, $0<y<1/7$, and uses

$$
-P_2(3+y)-40
=\frac{71}{16}+\frac{687}{16}y
-\frac{21}{8}y^2-10y^3-2y^4>0.
$$

For $n\ge2$, $P_2(\pi n^2)<2(\pi n^2)^4$.
The ratio of consecutive terms $n^8e^{-3n^2}$ is at most
$(3/2)^8e^{-15}<1/1000$, and

$$
\sum_{n\ge2}n^8e^{-3n^2}
<\frac{1000}{999}\,256\left(\frac38\right)^{12}
<\frac1{500},
$$

using $e>8/3$. Since $\pi<22/7$ and $(22/7)^4<100$,
the positive upper bound on the $n\ge2$ tail is less than $2/5$.
The first term is less than $-40e^{-\pi}<-40/81$, using
$\pi<4$ and $e<3$. Therefore

$$
\boxed{\kappa''(0)<-\frac{38}{405}<0,\qquad Q(0)>0.}
$$

All comparisons in this certificate are rational except the elementary
$8/3<e<3$ and $3<\pi<22/7$. A short exact audit checks the polynomial
and rational parts.

## Scope and dependencies

The result rules out counterexamples at fixed a sufficiently far in t,
and at sufficiently large a on any fixed compact t-interval. It also
proves the numerator-to-theta sign at sufficiently small anchors on
compact intervals. These boundary estimates alone leave a joint
transition region and a small-anchor limiting test. The companion global
comparison proof settles the original two ratio signs without needing
to patch those asymptotic regimes together.

The exact theta series and the first pair are in the preceding PR #48
and PR #50 notes. The asymptotic of L follows directly from the gamma
and prime formula displayed in the PR #50 actual-xi proof. The known
theta property $Q'>0$ is the same external concavity input used there.
No new zero-location hypothesis or finite-height verification is used
in this note.
