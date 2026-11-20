# Uniform mixed-source positivity in every comparable-scale tail sector

Research continuation of PR #54, 11 November 2026. This note proves an
eventual spatial-tail theorem, uniform when the anchor and the local
theta frequency have a ratio in a fixed positive compact interval.
It does not supply a numerical starting height or cover the two
escaping-ratio corners of the quadrant.

## 1. Statement and normalization

Use the actual theta kernel and first canonical numerator of PR #54,

$$
H=C/\kappa,\qquad B=4C''/\kappa,\qquad N(a,t)=n_a(t)/\kappa(t),
$$

$$
f_H=(H''/H')N_t-N_{tt},\qquad
f_P=N_{tt}-(B''/B')N_t.
$$

Put

$$
z=\pi e^t,\qquad q=\frac{a}{2z}.
$$

**Theorem.** For every compact interval `K=[epsilon,M]` contained in
`(0,infinity)`, uniformly for `q in K` as `t -> infinity`,

$$
f_H(a,t)=\frac{tq}{2z(1+q)^3}\{1+O_K(t^{-1})\},
\qquad
f_P(a,t)=\frac{t}{2z(1+q)^3}\{1+O_K(t^{-1})\},
\tag{1}
$$

and

$$
\boxed{\partial_a\partial_t\log f_j(a,t)
=\frac{3}{2z(1+q)^2}\{1+O_K(t^{-1})\}
=\frac{6z}{(a+2z)^2}\{1+O_K(t^{-1})\},
\quad j=H,P.}
\tag{2}
$$

The remainders in (1) admit the two `q` derivatives and one fixed-`q`
logarithmic `z` derivative used in (2), with the same order. Consequently
there exists `T_K` such that both mixed inequalities are strictly positive
whenever `t >= T_K` and `epsilon <= a/(2 pi exp(t)) <= M`.

The threshold is existential. Formula (2) is not asserted uniformly as
`q -> 0` or `q -> infinity`. In particular this theorem is neither a
complete quadrant certificate nor third full preservation.

## 2. A positive integral for the log-gamma centered tail

For `k>0`, let

$$
g_k(y)=\frac{e^{ky-e^y}}{\Gamma(k)},\qquad
\tau_k(y)=\frac1{g_k(y)}\int_y^\infty
(x-\psi(k))g_k(x)\,dx.
$$

Here `psi` is the digamma function and `z=exp(y)` in this section.
There is an exact positive representation

$$
\boxed{\tau_k(y)=\int_0^\infty\int_0^\infty
\frac{\exp\{-kw-z(e^v-1)\}}{1-e^{-v-w}}\,dw\,dv.}
\tag{3}
$$

To derive it, the digamma difference series gives, initially for
exponentials and then by Fourier uniqueness for smooth compactly
supported test functions,

$$
E[(Y-\psi(k))h(Y)]
=\int_0^\infty\frac{e^{-ku}}{1-e^{-u}}
E[h(Y)-h(Y-u)]\,du,
\tag{4}
$$

where `Y` has density `g_k`. Indeed its moment generating function is
`Gamma(k+lambda)/Gamma(k)`, and the two sides of (4), with
`h(y)=exp(lambda y)`, differ precisely by the identity

$$
\psi(k+\lambda)-\psi(k)
=\int_0^\infty
\frac{e^{-ku}(1-e^{-\lambda u})}{1-e^{-u}}\,du.
$$

Write `h(Y)-h(Y-u)=int_0^u h'(Y-v)dv`, interchange the absolutely
convergent integrals, and divide the resulting coefficient of `h'(y)`
by `g_k(y)`. Expanding `1/(1-e^{-u})` yields

$$
\tau_k(y)=\int_0^\infty e^{-z(e^v-1)}
\sum_{n\ge0}\frac{e^{-nv}}{k+n}\,dv.
$$

The additional Laplace integral for `1/(k+n)` gives (3). The integrable
singularity at the double origin is of order `1/(v+w)`. Exponential
decay controls the other endpoints. The coefficient is the centered
tail by integration by parts; the boundary constant is fixed by the
integrable tail. Thus the argument does not assume a Stein-kernel
formula as an external input.

### An explicit uniform remainder, including the saddle

Set `k=qz`, rescale `v=r/z,w=s/z`, and write

$$
E_z(r)=\exp\{-z(e^{r/z}-1-r/z)\},\qquad
\mathcal B(x)=\frac{x}{1-e^{-x}}.
$$

Then

$$
z\tau_{qz}(\log z)
=\int_0^\infty\int_0^\infty
\frac{e^{-r-qs}}{r+s}E_z(r)
\mathcal B((r+s)/z)\,ds\,dr.
\tag{5}
$$

The limit integral is

$$
\mathcal L(q)=\int_0^\infty\int_0^\infty
\frac{e^{-r-qs}}{r+s}\,ds\,dr
=\frac{\log q}{q-1},\qquad \mathcal L(1)=1.
\tag{6}
$$

For every integer `m>=0`, `q>0`, and `z>=2`,

$$
\boxed{\left|\partial_q^m
\{z\tau_{qz}(\log z)-\mathcal L(q)\}\right|
\le\frac{3m!}{q^{m+1}z}.}
\tag{7}
$$

This bound follows directly from

$$
0\le\mathcal B(x)-1\le x,
\qquad
0\le1-E_z(r)\le\frac{r^2e^{r/z}}{2z}.
$$

Differentiating in `q` contributes `(-s)^m`. Split
`E_z B-1=(E_z-1)+E_z(B-1)`. The second part integrates to at most
`m!/(q^(m+1)z)`. For the first use `r^2/(r+s)<=r` and
`exp(-r+r/z)<=exp(-r/2)`; it contributes at most twice that amount.

The same representation proves the required differentiated asymptotics
in `z`. For any fixed nonnegative integers `m,l`, on a fixed compact
positive `q` interval,

$$
\partial_q^m(z\partial_z)^l
\{z\tau_{qz}(\log z)-\mathcal L(q)\}=O_{K,m,l}(z^{-1}).
\tag{8}
$$

For completeness, differentiation of `E_z` produces Bell polynomials
in logarithmic derivatives of
`A_z(r)=z(e^{r/z}-1-r/z)`. Every nonzero such derivative is bounded by
`z^(-1)` times a polynomial in `r` times `exp(r/z)`, for `z>=1`.
Products of at most `l` factors retain a factor `z^(-1)` and are
dominated, after multiplication by `exp(-r)`, by a polynomial times
`exp(-r/2)` once `z>=2(l+1)`. Logarithmic derivatives of
`B((r+s)/z)` of positive order are bounded by a constant depending on
the order times `(r+s)/z`; this follows from its smooth extension at
zero and its linear growth at infinity. Its order-zero bound is
`1+(r+s)/z`. All resulting majorants are integrable against
`exp(-r- epsilon s)/(r+s)`. This proves (8), including mixed derivatives.

No division by `q-1` occurs in these estimates. In particular the
turning region `q=1` is included, rather than patched by a separate
unverified saddle approximation.

## 3. The actual theta centered tail

Return to `z=pi exp(t)` and put `k=a/2+1/4`. The first theta mode has
tilted density, apart from constants,

$$
z^k(2z^2-3z)e^{-z}.
$$

Its total mass and logarithmic mean are

$$
G(k)=2\Gamma(k+2)-3\Gamma(k+1)
=k(2k-1)\Gamma(k),
$$

$$
\mu_0(k)=\psi(k)+\frac1k+\frac2{2k-1}-\log\pi.
$$

The first mode alone is a signed density at sufficiently negative `t`;
no positivity assumption about that signed density is used below. For
the large `k` in this theorem its mass and moment identities are valid.
Termwise whole-line integration of all modes uses `a>1/2` (equivalently
`2k>1`), which holds eventually uniformly on every sector in the theorem.

Let `tau_0(a,t)` be its centered tilted tail, normalized by its value
at `t`. Incomplete-gamma recurrence gives the exact identity

$$
\boxed{\tau_0(a,t)=
\frac{2z^2\tau_{k+2}(\log z)-3z\tau_{k+1}(\log z)
-6z/((k+1)(2k-1))}{2z^2-3z}.}
\tag{9}
$$

For example the two logarithmic-mean differences are
`psi(k+2)-(mu_0+log pi)=-3/((k+1)(2k-1))` and
`psi(k+1)-(mu_0+log pi)=-2/(2k-1)`. Their incomplete-gamma terms
combine by `Gamma(k+2,z)=(k+1)Gamma(k+1,z)+z^(k+1)exp(-z)`
to give the last term in (9).

It follows from (7)-(8), with the bounded shape shifts retained, that

$$
\tau_0(a,t)=z^{-1}\mathcal L(q)+O_K(z^{-2})
\tag{10}
$$

in any fixed finite collection of `q` and fixed-`q` logarithmic `z`
derivatives.

The complete theta mass is `pi^(-k) G(k) zeta(2k)`. Therefore its
mean is

$$
2p(a)=\mu_0(k)+2\frac{\zeta'(2k)}{\zeta(2k)}
=t+\log q+O_K(z^{-1}).
\tag{11}
$$

The zeta correction and any fixed differentiated order are
exponentially small on `q in K`, by the absolutely convergent
Dirichlet series at `2k -> infinity`.

### Why omitted modes are also uniformly negligible

Let `tau_+(a,t)` be the full-theta centered tilted tail. To compare it
with (9), use right centered tails for `q<=1` and left centered tails
for `q>=1`. The latter are equal to the negatives of the corresponding
left integrals because the complete centered integrals vanish. This
choice avoids estimating a tiny mean correction times an exponentially
large, uncanceled gamma tail.

With `r=exp(s-t)`, the normalized exponential for mode `n` is

$$
\exp\{z[q\log r-n^2r+1]\}.
$$

For the right integral, `q<=1,r>=1` gives

$$
q\log r-n^2r+1
\le -(n^2-1)-(n^2-q)(r-1).
$$

For the left integral, `q>=1,0<r<=1`, its maximum is at
`r=min(q/n^2,1)` and is at most `-2 log n`. In the first case this
uses that `q log(q/n^2)-q+1` decreases for `1<=q<=n^2`; in the
second case use `n^2-1>=2 log n`.

Thus the omitted modes on the left are bounded by sums of the form
`C z^d sum_(n>=2) n^(d-2z)`, and on the right by still smaller
exponential bounds. Any specified finite derivative order only adds
fixed powers of `z,n,log n,log r`; any fixed logarithmic power of `n`
can be absorbed into a larger fixed polynomial power of `n`. The
remaining factor `r^(-3/4)` at zero
is integrable with every fixed logarithmic power. These statements
justify the mode sums and differentiated estimates uniformly on `K`.

The uncentered first-mode integral multiplying the zeta mean correction
is polynomially bounded on the chosen side: for `n=1`, the exponent is
at most `log r-r+1<=0`. This gives

$$
\tau_+(a,t)-\tau_0(a,t)
=O_{K,J}(z^{d_J}e^{-c_Kz})
\tag{12}
$$

in any fixed finite jet `J`, with some `c_K>0`. One can take any
`c_K<2 min(epsilon,1) log 2`, absorbing the fixed polynomial factors
by decreasing the exponential rate. The normalization by the full
theta value changes (12) only by exponentially small terms, since
`kappa/kappa_1=1+O(exp(-3z))` in the positive spatial tail.

## 4. The first numerator and the two source factors

The exact centered-integral formula for the first numerator is

$$
N(a,t)=\frac18\{\tau_+(a,t)+\chi_-(a,t)\},
\qquad
\chi_- =\int_t^\infty (s+2p(a))
\frac{\kappa(s)}{\kappa(t)}e^{-a(s-t)/2}\,ds.
\tag{13}
$$

The minus tail is a regular endpoint Laplace integral on every `K`.
Putting `s=t+r/z` gives, using (11),

$$
\chi_-=
\frac{2t+\log q}{z(1+q)}+O_K(tz^{-2}),
\tag{14}
$$

with any fixed finite number of `q,z partial_z` derivatives. This
follows by Taylor expansion under a majorant consisting of a polynomial
times `exp(-(1+epsilon)r/2)`; the higher theta modes are exponentially
small. Combining (10), (12), and (14) gives

$$
\boxed{N(a,t)=\frac{t}{4z(1+q)}
+\frac{q\log q}{4z(q^2-1)}+O_K(tz^{-2}).}
\tag{15}
$$

The second term is interpreted continuously at `q=1`, where it is
`1/(8z)`. The estimates preceding (15) prove the remainder in every
fixed finite `q` and fixed-`q` logarithmic `z` jet, not merely at the
level of function values.

The original theta quantities satisfy

$$
H=t/(4z)+O(tz^{-2}),\qquad
B=tz+O(t),
$$

with the required spatial jets, so
`H''/H'=-1+O(t^(-1))` and `B''/B'=1+O(t^(-1))`.
At fixed anchor the spatial derivative is

$$
D_t=z\partial_z-q\partial_q,
\tag{16}
$$

where `z partial_z` in this formula holds `q` fixed and includes
`z partial_z t=1`. Applying (16) twice to (15) proves (1) with the
stated differentiated remainders. Four `q` derivatives of (15), already
allowed above, suffice for the subsequent mixed source derivative.

Finally `partial_a=(2z)^(-1)partial_q`. Thus for any smooth positive `f`,

$$
\partial_a\partial_t\log f
=\frac1{2z}\{z\partial_z-q\partial_q-1\}
\partial_q\log f.
\tag{17}
$$

For the two leading expressions in (1), the expression in braces is
exactly `3/(1+q)^2`; the same identity holds for both factors. The
differentiated relative errors contribute `O_K(t^(-1))` to that
expression. Its positive minimum on `K` proves (2) and eventual
strict positivity.

## 5. A separate fixed-anchor spatial-tail theorem

There is also eventual positivity uniformly on every compact positive
anchor interval `I=[a_-,a_+]`, without requiring the anchor to grow
with `z`. With `p=L(a)` and ordinary anchor derivative `p'`,

$$
\boxed{\partial_a\partial_t\log f_H(a,t)
=\frac{3(p-ap')}{4p^2}\frac{t}{z}
\{1+O_I(t^{-1})\},}
\tag{18}
$$

$$
\boxed{\partial_a\partial_t\log f_P(a,t)
=\frac{3(p+ap')}{tz}\{1+O_I(t^{-1})\}.}
\tag{19}
$$

The fixed earlier theta comparison results give `p>0`, `p-ap'>0`,
and `p+ap'>0`. Their continuous positive coefficients have positive
minima on `I`; (18)-(19) therefore prove both desired signs for all
`a in I` and sufficiently large `t`. These statements make no
uniformity claim as `a_- -> 0` or `a_+ -> infinity`.

Here is a derivation that retains the cancellations needed for the
mixed derivatives. The canceled Volterra formula is

$$
\frac{b_a(t)}{\kappa(t)}
=\frac1{2a}\int_0^\infty\sinh(a\delta/2)
\{p-aH(t+\delta)\}\frac{\kappa(t+\delta)}{\kappa(t)}d\delta,
\qquad N=H-a b_a/\kappa.
$$

Set `delta=r/z`. For the leading theta mode,

$$
\frac{\kappa(t+r/z)}{\kappa(t)}
=e^{-r}\left[1+\frac{(9/4)r-r^2/2}{z}+O(z^{-2})\right],
$$

where the integrated remainder and its required derivatives have an
integrable polynomial-times-`exp(-r/2)` majorant. The other modes
are exponentially small. Also
`sinh(ar/(2z))=ar/(2z)+O_I(r^3 exp(a_+ r/(2z))/z^3)` and
`H(t+r/z)=t/(4z)+O((t+1)(r+1)/z^2)` in the same integrated sense.
The integrals of `r,r^2,r^3` against `exp(-r)` give

$$
\frac{b_a}{\kappa}
=\frac{p}{4z^2}
+\frac{(3/2)p-at/4}{4z^3}+O_I(tz^{-4}),
$$

$$
\boxed{N=H-\frac{ap}{4z^2}-\frac{3ap}{8z^3}
+\frac{a^2t}{16z^3}+O_I(tz^{-4}).}
\tag{20}
$$

The remainder holds after one anchor derivative and every fixed
finite spatial derivative needed here. This follows by differentiating
the rescaled integrand: the anchor is in a fixed compact interval,
and the spatial derivatives add only polynomial factors under the
same exponential majorants.

Write `L_H h=(H''/H')h'-h''`. It annihilates `H`, so (20) gives

$$
f_H=ap A(t)\{1+(a/p)E(t)+O_I(tz^{-2})\},
$$

where

$$
A=L_H(-1/(4z^2)-3/(8z^3)),\qquad
E=\frac{L_H(t/(16z^3))}{A},
$$

$$
A\sim\frac1{2z^2},\qquad
E=-\frac{3t}{4z}\{1+O(t^{-1})\},\qquad
E'=\frac{3t}{4z}\{1+O(t^{-1})\}.
$$

The prefactor `ap A(t)` has zero mixed logarithmic derivative. The
first remaining anchor dependence is `a/p`, whose derivative is
`(p-ap')/p^2`. Differentiating the displayed relative expansion proves
(18); products of the small correction terms are lower order.

Similarly, with `L_P h=h''-(B''/B')h'` and `f_{P,0}=L_P H`,

$$
f_P=f_{P,0}(t)\{1+ap F(t)+O_I(z^{-2})\},
\qquad F=-\frac{L_P(1/(4z^2)+3/(8z^3))}{f_{P,0}},
$$

$$
f_{P,0}\sim\frac{t}{2z},\qquad
F=-\frac3{tz}\{1+O(t^{-1})\},\qquad
F'=\frac3{tz}\{1+O(t^{-1})\}.
$$

The first anchor derivative is now `(ap)'=p+ap'`, which proves (19).
All the last expansions hold with the derivatives used to differentiate
the logarithms; they follow from (20) and the actual theta ratio jets.

## 6. Scope and reproducibility

The companion script verifies the finite algebraic identities in the
derivation. The actual sign theorem is the analytic differentiated
asymptotic proof above; finite symbolic checks do not certify a starting
height. This asymptotic component alone claims no numerical tail
threshold, all-anchor spatial tail, global source gate, or six-node
Pick conclusion. The separate scalar-source and orientation argument
in `theta_third_preservation_global_20261111.md` supplies the global
mixed-source theorem and its six-node consequence. RH remains open.

The sector theorem includes the difficult comparable-frequency region
`a approximately 2 pi exp(t)`. Directions outside these asymptotic theorems
include paths with `a/(2 pi exp(t)) -> 0` or `infinity` while both
`a` and `t` escape, as well as potential approaches to `a=0` with
unbounded `t`. The separate compact-anchor theorem does not cover
those directions. Results for a fixed spatial compact set do not
automatically close them either.

Primary formula sources used to check the standard inputs:

- NIST DLMF 5.7.6, digamma difference series:
  <https://dlmf.nist.gov/5.7.E6>.
- NIST DLMF 5.9.1, gamma integral:
  <https://dlmf.nist.gov/5.9.E1>.
- NIST DLMF 5.11.2, large-positive-argument digamma expansion:
  <https://dlmf.nist.gov/5.11.E2>.
- NIST DLMF 25.2.1, absolutely convergent zeta Dirichlet series:
  <https://dlmf.nist.gov/25.2.E1>.

The identities (3), (7), and the theta specialization are derived here;
no claim of novelty relative to the literature is made.
