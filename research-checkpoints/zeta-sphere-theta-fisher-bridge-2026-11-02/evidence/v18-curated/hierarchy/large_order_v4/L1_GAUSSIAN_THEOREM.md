# Quantitative large-order Gaussian limit for the complete theta hierarchy

Status: analytic proof with explicit conservative constants; independently reviewed by the foundations lane (see REVIEW.md). No RH assumption. Earlier v1–v3 outputs are unchanged.

## Theorem

Let psi be the complete Riemann theta profile in the campaign normalization, and

    M_n(v)=integral_0^infinity h^(2n)psi(h-v)psi(h+v)dh,
    m_n=M_n(0).

For every integer n>=700 let H=H_n be the unique positive solution of

    2n/H+9=4pi exp(2H)=:k,
    s=s_n=k^(-1/2),  F_n(x)=M_n(sx)/m_n.

Then

    ||F_n−exp(−x²)||_(L1(R)) <=250s_n.                      (T)

The constant is intentionally loose. In particular the proposed Gaussian limit holds in L1, not only pointwise, and the error is O(s_n)=O(sqrt(log n/n)).

For Fourier transform convention hat f(xi)=integral f(x)exp(−i xi x)dx,

    |hat F_n(xi)−sqrt(pi)exp(−xi²/4)|<=250s_n                (F)

uniformly for every real xi. Whenever sqrt(pi)>500s_n, this proves strict positivity on

    |xi|<=2sqrt(log(sqrt(pi)/(500s_n))).                     (B1)

Equivalently, in the original Xi-height variable,

    L_n[Xi](t)>0 whenever
    |t|<=s_n^(-1)sqrt(log(sqrt(pi)/(500s_n))).               (B2)

The L1 theorem starts at n=700, but the displayed positive band need not be nonempty there. A simple explicit sufficient threshold for a nonempty band is **n>=210000**. Indeed, k is increasing with n; at k=90000 the corresponding H=(1/2)log(k/(4pi))<9/2 and n=H(k−9)/2<202500. Hence n>=210000 gives k>90000 and sqrt(pi)>500/sqrt(k), using pi>3.

The band in (B2) is asymptotic to sqrt(2n). Thus, for each fixed epsilon in (0,sqrt(2)), all sufficiently large n have L_n[Xi](t)>0 throughout |t|<=(sqrt(2)−epsilon)sqrt(n).

This does not establish positivity for every frequency at any order, or positivity for every order at arbitrary height. The region outside (B1)/(B2) remains uncontrolled in sign.

## 1. Uniform full-theta bounds

For u>=0 write

    psi(u)=8pi² exp(9u/2−pi exp(2u)) A(u),
    A(u)=sum_(m>=1)[m^4−(3/(2pi))m²exp(−2u)]
                    exp[−pi(m²−1)exp(2u)].

Every summand is positive. Uniformly for u>=0,

    1/2<=A(u)<=2,     |A(u)−1|<=exp(−2u).                  (1)

To check the constants: the first summand is 1−(3/(2pi))exp(−2u), with 3/(2pi)<1/2. The remaining positive terms are bounded by sum_(m>=2)m^4exp[−pi(m²−1)exp(2u)]. If z=exp(2u)>=1, then z exp(−cz)<=exp(−c) for c>=9. The latter sum is consequently at most exp(−2u) sum_(m>=2)m^4exp[−3(m²−1)]<32exp(−9)exp(−2u)<(1/2)exp(−2u). The successive-term ratio is bounded above by 1/2. These inequalities prove (1) with slack. No theta-index truncation is used in the theorem.

Extend by evenness and define

    U(u)=pi exp(2|u|)−(9/2)|u|.

For every h>=0 and real v,

    U(h-v)+U(h+v)−2U(h)>=4pi exp(2h)v².                     (2)

For |v|<=h the left side is exactly 2pi exp(2h)(cosh(2v)−1). For |v|>h, put d=|v|−h. The left side equals that same expression plus

    2pi sinh(2d)−9d >=(4pi−9)d>=0.

The bound follows from cosh(2v)−1>=2v². Thus there is no unexamined region across h=|v|.

Let r_h(v)=psi(h-v)psi(h+v)/psi(h)². Equations (1)–(2) give the global slice envelope

    0<r_h(sx)<=16 exp[−exp(2(h−H))x²],
    integral_R r_h(sx)dx<=16sqrt(pi)exp(−(h−H)).             (3)

This envelope will control the entire x-axis and the small-h tail, not just a neighborhood of the saddle.

## 2. Saddle probability and quantitative concentration

Set

    ell(h)=2n log h+9h−2pi exp(2h),
    Z=integral_0^infinity exp(ell(h))A(h)²dh,
    dmu_n(h)=Z^(-1)exp(ell(h))A(h)²dh.

The exact constant (8pi²)² cancels, so

    F_n(x)=E_mu[r_h(sx)].                                  (4)

Since ell''<0, ell has the unique maximum at H defined in the theorem. For n>=700, H>2 and k>600: ell'(2)=n+9−4pi exp(4)>0 using pi<22/7 and exp(4)<55; also pi>3 and exp(4)>50 give k>600.

Write delta=h−H and d=1/4. On |delta|<=d,

    −4k<=ell''(h)<=−k.                                    (5)

Indeed −ell''=H(k−9)/(H+delta)²+2k exp(2delta). The first term is at most (32/49)k, and the second at most 2exp(1/2)k<(10/3)k; their sum is less than 4k. The second term alone is greater than k.

Integrating over |delta|<=s/2 gives

    Z>=(s/2)exp(ell(H)).                                   (6)

Here ell>=ell(H)−1/2; A(h)²>9/10 since h>=H−1/4>7/4; and exp(−1/2)>3/5, so the actual lower bound exceeds (27/50)s exp(ell(H)).

On the central region, ell(h)<=ell(H)−k delta²/2, A²<=4. Hence

    E_mu[|delta| ; |delta|<=d]<=16s.                        (7)

This follows by integrating |delta|exp(−kdelta²/2) over the whole real line, whose integral is 2/k, and then applying (6).

Global concavity and the slopes at H±d give, for y>=0 and h>=0,

    ell(H±(d+y))<=ell(H)−k/32−(k/4)y.                      (8)

For the minus sign only the portion with H−d−y>=0 exists; extending its positive upper bound to all y>=0 is conservative. This explicitly includes the small-h region.

## 3. Conditional L1 approximation at a central saddle point

For |delta|<=d we claim

    ||r_h(s .)−exp(−x²)||_1<=3|delta|+4000/k.               (9)

Here are explicit bounds behind the conservative constant. Put a=exp(2delta), so 3/5<a<5/3. On |sx|<=1/4, h±sx>0 and

    r_h(sx)=B(h,sx) exp[−a (cosh(2sx)−1)/(2s²)],
    B(h,v)=A(h-v)A(h+v)/A(h)².

By (1), every A in this expression differs from 1 by at most

    epsilon=exp(−2(H−1/2))=4pi e/k<40/k<=1/15.

The elementary product/quotient estimate gives |B−1|<=7epsilon<1000/k. Its contribution to the L1 error is less than

    (1000/k)sqrt(pi/(3/5))<2300/k.

Also cosh Taylor's formula on |sx|<=1/4 gives

    0<=(cosh(2sx)−1)/(2s²)−x²<=(1/2)s²x^4.

Using 1−exp(−y)<=y, the resulting exponential-shape error is at most

    s² integral_R x^4exp(−3x²/5)dx<10/k.

The change in Gaussian width has the exact whole-line bound

    ||exp(−a x²)−exp(−x²)||_1
      =sqrt(pi)|exp(−delta)−1|<3|delta|.

Finally, outside |x|<=sqrt(k)/4, (3) and the Gaussian itself give an error at most

    114 k^(-1/2)exp(−3k/80)<1000/k   (k>=600).

Adding these bounds proves (9). No fixed compact-x restriction remains.

## 4. Weighted probability-tail contribution

From (3),

    ||r_h(s .)−exp(−x²)||_1
       <=16sqrt(pi)exp(−delta)+sqrt(pi).                    (10)

For delta=d+y the right side is below 31. For delta=−d−y it is below 45exp(y). Combine (8), A²<=4 and (6). The upper tail contributes at most

    [(496/k)exp(−k/32)]/(s/2),

and the lower tail at most

    [(900/k)exp(−k/32)]/(s/2),

where (k/4−1)^(-1)<=5/k for k>=20. Therefore

    E_mu[||r_h(s .)−exp(−x²)||_1 ; |delta|>d]
       <=2800s exp(−k/32).                                (11)

The factor exp(−delta) from broad small-h slices is retained in this estimate; it has not been replaced by a uniform local saddle approximation.

## 5. Completion of the L1 proof

Tonelli and the triangle inequality apply to the positive mixture (4). Using (7), (9), and (11),

    ||F_n−exp(−x²)||_1
      <=48s+4000s²+2800s exp(−k/32)
      <250s   (k>=600).

For the last numerical comparison, s<1/24 and exp(−600/32)<10^(-4) already suffice: the coefficient is less than 48+167+0.28<250. This proves (T) with explicit constants.

## 6. Fourier band and relation to the Laguerre hierarchy

The elementary L1 Fourier bound proves (F). On (B1) the Gaussian transform is at least 500s, leaving a lower margin of 250s. Scaling gives

    hat M_n(2t)=s m_n hat F_n(2st),
    L_n[Xi](t)=2^(2n)/(2n)! hat M_n(2t),

so (B2) follows, with the explicit lower bound

    L_n[Xi](t)>=[2^(2n)/(2n)!] 250 s² m_n

inside the stated nonempty band.

From the saddle equation H~(1/2)log n and s²~log n/(4n). Thus

    s^(-2)log(sqrt(pi)/(500s))~2n,

which proves the asserted asymptotic height band. No quantifier exchange with all heights is made.

## 7. Escaping negative frequencies remain possible

The theorem controls all Fourier errors in absolute size, but the Gaussian comparison tends to zero at high frequency. Small L1 error alone cannot establish global positive definiteness. For an explicit example, take epsilon→0 and K=4sqrt(log(1/epsilon)), and set

    f_epsilon(x)=exp(−x²)(1−epsilon cos(Kx))/(1−epsilon).

This is positive, even, smooth, and f_epsilon(0)=1. Its L1 distance from exp(−x²) is at most sqrt(pi)epsilon/(1−epsilon). Nevertheless its Fourier transform at xi=K is negative for small epsilon, because it equals

    sqrt(pi)/(1−epsilon)
      [exp(−K²/4)−(epsilon/2)(1+exp(−K²))].

This example is not a theta counterexample. It demonstrates exactly why the proved expanding band must not be advertised as global positivity: any negative theta frequencies, if they exist, could lie beyond the controlled band with absolute magnitude <=250s after rescaling.

## 8. Source and novelty boundary

The originating private research thread's 2026-11-02 18:01 message, read in both pages, proposed precisely this saddle, scaling, and quantitative-L1 target. Its conversation and message identifiers are redacted for repository publication.

The present result supplies an analytic error proof and a scoped expanding Fourier band. No priority or publication novelty claim is made; comparison with prior large-order Laguerre/asymptotic results remains to be done. The proof uses the actual complete theta series and elementary estimates, not RH, numerical zero verification, acquired code, or a claimed positive Fourier factorization.
