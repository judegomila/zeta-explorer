# Uniform theta ratio signs at finite positive anchors

Research continuation, 11 November 2026. The tail comparison now works for complete intervals of finite positive reduction parameters. In particular,

$$
\boxed{(n_a/b_a)'(t)>0,\qquad(n_a/\kappa)'(t)<0
\quad\text{for every }0<a\le64\text{ and }t\ge4.}
\tag{1}
$$

This is an analytic continuum result, with rigorous ball checks of its threshold constants. It does not infer a continuum sign from point samples. Combining it with the [proved small-anchor coefficient](THETA_SMALL_ANCHOR.md) gives a further result: **there exists one $\delta>0$ for which both signs hold for every $0<a\le\delta$ and every $t>0$**. A numerical value of this global $\delta$ is not obtained here.

Exact Green comparisons remove the need for a finite-anchor Taylor approximation in the tail. The complete-theta error bounds from the preceding note remain part of the argument. Intermediate parameters on the remaining coordinate region and preservation at arbitrary reduction order are still open. No RH or novelty claim is made.

## Notation and established complete-kernel bounds

Use $F(z)=\xi(1/2+z)$, $p(a)=F'(a)/F(a)$, and the positive first reduced kernels

$$
n_a+a b_a=J,\qquad a n_a+4b_a''=p(a)\kappa,
\qquad J(t)=\frac14\int_{|t|}^\infty v\kappa(v)dv.
\tag{2}
$$

Here $a$ is a positive real reduction parameter and $t$ is the theta-kernel coordinate. Set

$$
x=\pi e^t,\qquad u=-\kappa'/\kappa,\qquad Q=u/t,\qquad h=J/\kappa.
$$

The [preceding complete-theta tail proof](THETA_SMALL_ANCHOR.md) established, for every $t\ge3$,

$$
x>60,\qquad x-3<u<x,\qquad x-1<u'<x+1,\qquad x-1<u''<x+1,
\tag{3}
$$

$$
Q>19,\quad Q'>0,\quad (Q'/Q^2)'<0,
\qquad 0<h<\frac1{4Q},\quad 0<-h'\le\frac{Q'}{4Q^2}.
\tag{4}
$$

These bounds include the entire theta sum: its logarithmic correction to the leading term and its first three derivatives were bounded by $2\cdot10^{-40}$ on this tail. They are not leading-term substitutions.

For later use, $p>0$, $p'>0$, and $c(a):=p(a)/a$ strictly decreases on $a>0$. These follow directly from the kernel. The tilted full-line density proportional to $\kappa(v)e^{av/2}$ gives

$$
p'(a)=\operatorname{Var}_a(v/2)>0.
$$

Also the transform identity $\mathcal LJ(a)=F'(a)/a$ gives

$$
c(a)=\frac{\int_0^\infty h(v)\kappa(v)\cosh(av/2)dv}
{\int_0^\infty\kappa(v)\cosh(av/2)dv}.
\tag{5}
$$

The known strict decrease of $h$ follows from the theta property $Q'>0$; see the earlier notes and [Csordas, Theorem 4.2(b)](https://arxiv.org/html/1309.0055v2). Differentiating (5) gives the covariance of decreasing $h(v)$ with increasing $v\tanh(av/2)/2$, which is strictly negative. In particular, for $0<a\le A$,

$$
c(a)\ge c_A:=p(A)/A>0,\qquad ap(a)\le P_A:=A p(A).
\tag{6}
$$

## A general finite-anchor tail theorem

**Theorem.** Fix any $A>0$. Choose $T\ge3$, put $X=\pi e^T$, and suppose

$$
\boxed{X\ge A+3,\qquad TX\ge8A p(A),\qquad
\frac{X-3}{T}>\frac{A}{2p(A)}.}
\tag{7}
$$

Then both signs in (1) hold for every $0<a\le A$ and every $t\ge T$.

Such a finite $T$ exists for every finite $A$. The three left-hand quantities in (7) increase for $T\ge3$, while their right-hand sides are fixed. In particular,

$$
\left(\frac{\pi e^t-3}{t}\right)'=
\frac{(t-1)\pi e^t+3}{t^2}>0.
$$

Thus testing (7) once at $T$ establishes its corresponding inequalities for every $t\ge T$.

## A monotone ratio lemma for the exact Green integral

Let $\mathcal D_a=4\partial_t^2-a^2$. If $f,f'$ decay faster than $e^{-at/2}$ at infinity, two integrations by parts give the exact identity

$$
f(t)=\frac1{2a}\int_t^\infty
\sinh\!\left(\frac a2(v-t)\right)(\mathcal D_af)(v)dv.
\tag{8}
$$

Suppose $\mathcal D_af>0$ on the tail and $g=(\mathcal D_ay)/(\mathcal D_af)$ is strictly decreasing there. Then $y/f$ is strictly decreasing. Indeed, (8) makes $y/f$ the average of $g(v)$ under a positive density proportional to

$$
\sinh\!\left(\frac a2(v-t)\right)(\mathcal D_af)(v),\qquad v>t.
$$

Its logarithmic derivative with respect to $t$ is

$$
s_t(v)=-\frac a2\coth\!\left(\frac a2(v-t)\right),\qquad
\partial_vs_t(v)=\frac{a^2}{4}\operatorname{csch}^2\!\left(\frac a2(v-t)\right)>0.
$$

Consequently $(y/f)'=\operatorname{Cov}_t(g,s_t)<0$. The lower-end boundary term vanishes because the hyperbolic sine vanishes there. Its logarithmic derivative has an integrable singularity after multiplication by the density. Superexponential decay justifies differentiation at the upper endpoint. The covariance sign can equivalently be read from the double integral of
$[g(v)-g(w)][s_t(v)-s_t(w)]$, which is strictly negative off the diagonal.

This lemma concerns an exact positive tail weight. It does not assume a sign for the original signed source on the full line.

## Applying the lemma to b divided by J

Fix $0<a\le A$, and abbreviate $p=p(a)$, $c=p/a$, $d=tu-1=t^2Q-1$. From (2),

$$
\mathcal D_ab=\kappa(p-ah),\qquad
\mathcal D_aJ=\kappa(d-a^2h).
\tag{9}
$$

For $t\ge T$, (7) and (3) give $u>x-3\ge A\ge a$. Therefore

$$
d-a^2h>tu-1-\frac{a^2t}{4u}
\ge\frac34tu-1>0.
$$

Also $Q>(x-3)/t>1/(2c_A)$, so $c-h>0$. The source ratio is

$$
g_b=\frac{\mathcal D_ab}{\mathcal D_aJ}
=a\frac{c-h}{d-a^2h}.
$$

Differentiation cancels the mixed terms exactly:

$$
\frac{g_b'}a=
\frac{(-h')(d-a^2c)-(c-h)d'}{(d-a^2h)^2}.
\tag{10}
$$

Using (4), $d<t^2Q$, and $d'>t^2Q'$, we obtain

$$
\frac{g_b'}a
<-\frac{t^2Q'}{(d-a^2h)^2}
\left(c_A-\frac1{2Q}\right)<0.
\tag{11}
$$

The Green lemma gives $(b/J)'<0$. Since $n/b=J/b-a$, this proves $(n/b)'>0$. The division by $a$ in (11) makes the estimate meaningful all the way toward the small-anchor endpoint, while the conclusion remains strict for each $a>0$.

## Applying the lemma to n divided by kappa

The first-pair equations give a second exact source identity:

$$
\mathcal D_an=\kappa(d-ap),\qquad
\mathcal D_a\kappa=\kappa E,
\qquad E=4(u^2-u')-a^2.
\tag{12}
$$

For $t\ge T$, $x\ge60$, $a\le A\le x$, and $ap\le P_A\le tx/8$. Bounds (3) imply

$$
0<3x^2-28x+32<E<4x^2,\qquad
E'=8uu'-4u''>7x^2,
\tag{13}
$$

$$
d'=u+tu'<\frac{27}{20}tx,\qquad
 d-ap>tx\left(\frac78-\frac3x-\frac1{tx}\right)>
\frac45tx.
\tag{14}
$$

For clarity, $E'>8x^2-36x+20\ge7x^2$; and
$7/8-3/60-1/180=59/72>4/5$. The source ratio $g_n=(d-ap)/E$ therefore satisfies the uniform quantitative bound

$$
g_n'=\frac{d'E-(d-ap)E'}{E^2}
<-\frac{tx^3}{5E^2}<0.
\tag{15}
$$

Apply (8) with reference $f=\kappa$ to obtain $(n/\kappa)'<0$. This finishes the theorem. No Taylor expansion in $a$ was used.

## Explicit certified parameter bands

[certify_finite_anchor_tail.py](certify_finite_anchor_tail.py) evaluates $p(A)$ from the completed xi formula using 192-bit Arb power series and verifies all three inequalities in (7). [Recorded enclosures](finite-anchor-tail-certificate.json) cover the following bands:

| All first anchors | All kernel coordinates |
|---|---|
| $0<a\le1$ | $t\ge3$ |
| $0<a\le8$ | $t\ge3$ |
| $0<a\le32$ | $t\ge4$ |
| $0<a\le64$ | $t\ge4$ |
| $0<a\le256$ | $t\ge6$ |
| $0<a\le1024$ | $t\ge7$ |

For example, at $(A,T)=(64,4)$ the enclosures give

$$
p(64)=1.18785399033183225\ldots,
$$

and the three threshold margins exceed respectively $104$, $77$, and $15$. The precise balls are retained in the JSON. Each row is a continuum consequence of the theorem, including parameters arbitrarily close to zero; it is not a list of sampled $(a,t)$ pairs.

The already established real-axis asymptotic $p(A)=\tfrac12\log(A/(2\pi))+O(A^{-1})$ also shows that $T(A)=\log(2A)$ satisfies (7) for all sufficiently large $A$. This is an asymptotic statement; no transition value of $A$ is claimed. The threshold need grow only logarithmically in the maximum anchor, although the coupled large-anchor region below it remains unresolved.

## One common small-anchor interval for every positive coordinate

The earlier coefficient theorem proved

$$
Y(t)=-\left(B_0/J\right)'(t)>0\quad(t>0),
\qquad
\alpha_a(t):=\left(\log(n_a/J)\right)'=a^2Y(t)+O(a^4).
$$

We now make the endpoint $t=0$ explicit. The exact kernels are even in $t$, and $n_a$ is even in $a$ with $n_0=J$. Their canceled integral formula and superexponential decay give smooth dependence and small-$a$ expansions with any fixed number of coordinate derivatives on $[0,3]$. Hence

$$
G(a,t):=\frac{\alpha_a(t)}{a^2t}
$$

extends continuously across both $a=0$ and $t=0$, with
$G(0,t)=Y(t)/t$ for $t>0$. The previously certified bounds give a strictly positive uniform lower bound on this entire closed interval:

$$
G(0,t)\ge\frac1{30000}\qquad(0\le t\le3).
\tag{16}
$$

Indeed $Y/t>3/5000$ through $1/8$, and $Y>1/10000$ on $[1/8,3]$. The value at zero is its continuous limit. Compactness therefore makes $G(a,t)>0$ on $[0,3]$ for every sufficiently small positive $a$.

For the other sign, write

$$
\beta_a=H-\alpha_a,\qquad
H=-(\log(J/\kappa))',\qquad
\frac{H(t)}t=\frac{\kappa(t)}{4J(t)}-Q(t).
$$

This last expression extends continuously and positively to zero. With $Q_0=\lim_{t\downarrow0}Q(t)$, strict increase of $Q$ gives

$$
\kappa(0)-4Q_0J(0)
=\int_0^\infty v[Q(v)-Q_0]\kappa(v)dv>0.
\tag{17}
$$

Thus $\beta_a/t$ is uniformly positive on $[0,3]$ for sufficiently small positive $a$ as well. Combine these compact-coordinate facts with the proved tail band $0<a\le1$, $t\ge3$:

**Global small-anchor corollary.** There is a single $\delta\in(0,1]$ such that both ratio signs hold for every $0<a\le\delta$ and every $t>0$.

The corollary asserts existence of a common parameter range. It does not assign a numerical value to $\delta$, and it does not assert a positive unscaled margin uniform as $a\downarrow0$.

By the [exact sufficient criterion in PR #50](https://github.com/judegomila/mathexplorer/blob/146ce77aa8407e912ed54c73e30664d86936c253/rigorous/theta-fourth-stage-2026-11-09/theta_second_kernel_structure_20261109.md), this also makes both second canceled kernels strictly positive for every second anchor $c>0$, whenever the first anchor satisfies $0<a\le\delta$. It does not prove the derivative-ratio conditions required at the following stage.

## Validation and remaining work

Run from this checkpoint's cluster directory:

```sh
python3 certify_finite_anchor_tail.py
```

Dependencies: python-flint 0.9.0 and SymPy. The checker verifies the source-ratio derivatives, Green normalization and score, monotonicity of the threshold functions, the rational tail estimates, and the six explicit parameter bands. The analytic proof uses the complete-theta bounds already justified in `THETA_SMALL_ANCHOR.md`; the global small-anchor corollary also uses its whole-interval certificate. The check is not presented as formal proof-assistant verification.

The next useful computation is an explicit value of $\delta$, using normalized core inequalities that divide out both $a^2$ and $t$. The remaining first-pair domain then includes intermediate anchors on bounded coordinates and the coupled large-$a$, large-$t$ region below the logarithmic tail threshold. Positivity must still be accompanied by a property preserved at every alternating reduction. The separate all-height arithmetic correlation-gain bound and RH remain open.
