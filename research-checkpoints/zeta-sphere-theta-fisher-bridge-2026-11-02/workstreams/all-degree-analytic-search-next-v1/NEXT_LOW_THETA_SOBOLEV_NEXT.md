# The first even complete-theta Sobolev condition

## Scope and outcome

This note treats the first nonconstant even residual,
`(N,epsilon)=(1,0)`, in equation (24) of
`THETA_SOBOLEV_AUXILIARY_NEXT.md`.  With the exact normalization

\[
 W(t)=\widehat\psi(t)=2\Xi(t),
\]

the actual old-data residual is

\[
 q(t)=t^2-c,\qquad c={\mathsf M_1\over\mathsf M_0},             \tag{1}
\]

where `mathsf M_j` are the signed target moments and old-block
invertibility says `mathsf M_0` is nonzero.

The five-scalar sufficient condition is proved strictly for this residual.
In fact, the proof establishes it for **every real** `c`.  The coefficient
is eliminated by an exact quadratic-discriminant reduction, leaving one
sixth-moment inequality for the positive measure `W^2 dt`.  That inequality
is then certified from the complete Jacobi-theta expansion by assembling
the first two orbits exactly and bounding every orbit `n>=3` by one
geometric tail.  The calculation uses rational incomplete-gamma bounds, not
sampled quadrature or a finite orbit truncation.

This closes only the first even instance of the two-generator sufficient
auxiliary.  It is not an equivalence with the target pivot, does not settle
the next odd or any general rung, and makes no RH claim.

## 1. Exact five-scalar reduction

Put

\[
 m_k=\int_{\mathbb R}t^{2k}W(t)^2dt
     =2\pi\|\psi^{(k)}\|_2^2\qquad(0\leq k\leq3).             \tag{2}
\]

For `q=t^2-c`, the five positive-weight scalars of
`SOBOLEV_FIVE_SCALAR_NEXT.md` are exactly

\[
 \begin{aligned}
 A&=4m_1,&
 B&=2(m_1-cm_0),\\
 C&=m_2-2cm_1+c^2m_0,&
 D&=m_3-2cm_2+c^2m_1,\\
 E&=2(m_2-cm_1).
 \end{aligned}                                                \tag{3}
\]

In particular,

\[
 \Delta=AD-E^2=4\delta,
 \qquad \delta=m_1m_3-m_2^2>0.                               \tag{4}
\]

Strictness in (4) is the moment Gram inequality for `tW` and `t^3W`.

There is a useful fixed-basis form of the projection in that note.  Since

\[
 \operatorname {span}\{q'W,tqW\}
 =\operatorname {span}\{tW,t^3W\},                            \tag{5}
\]

integration by parts gives, with `Y=qW'`,

\[
 2\langle Y,tW\rangle=p:=cm_0-3m_1,
 \qquad
 2\langle Y,t^3W\rangle=w:=3cm_1-5m_2.                       \tag{6}
\]

The sufficient remainder `mathcal H` is therefore

\[
 \boxed{
 \mathcal H=
 {m_3p^2-2m_2pw+m_1w^2\over4\delta}+p.}                      \tag{7}
\]

Thus `mathcal H>=0` is equivalent to `N(c)>=0`, where

\[
 N(c)=m_3p^2-2m_2pw+m_1w^2+4p\delta.                          \tag{8}
\]

The five-scalar polynomial in equation (13) of
`SOBOLEV_FIVE_SCALAR_NEXT.md` is exactly `16m_1N(c)`, so (8) has
introduced neither a stronger nor a weaker condition.

Expanding (8) gives

\[
 N(c)=Lc^2+Rc+T,                                               \tag{9}
\]

with

\[
 \begin{aligned}
 L&=m_0^2m_3-6m_0m_1m_2+9m_1^3,\\
 R&=-2m_0m_1m_3+6m_0m_2^2-12m_1^2m_2,\\
 T&=m_1(7m_2^2-3m_1m_3).
 \end{aligned}                                                \tag{10}
\]

Normalize `W^2dt` to a probability measure and let `X=t^2`.  Then

\[
 L=m_0^3\,\mathbb E\{X(X-3\mathbb EX)^2\}>0.                 \tag{11}
\]

The inequality is strict because the complete-theta measure is not
supported only at zero and three times the mean of `X`.

Define the scale-free ratios

\[
 r={m_0m_2\over m_1^2},\qquad
 s={m_0^2m_3\over m_1^3}.                                    \tag{12}
\]

Direct factorization of the discriminant of (9) gives

\[
 \boxed{
 \operatorname {disc}N
 =4m_0^6\left({m_1\over m_0}\right)^8
 (s-r^2)\{4s-9r^2-6r+27\}.}                                  \tag{13}
\]

The factor `s-r^2` is strictly positive, since

\[
 s-r^2={m_0^2(m_1m_3-m_2^2)\over m_1^4}>0.                  \tag{14}
\]

Consequently the source-only inequality

\[
 \boxed{4s<9r^2+6r-27}                                      \tag{15}
\]

makes the discriminant negative.  Equations (11) and (13) then imply
`N(c)>0`, and hence `mathcal H>0`, for every real `c`.  It remains only to
prove (15) for the complete-theta source.

## 2. Complete-theta derivative orbits

For `h>=0`, write

\[
 z_n=\pi n^2e^{2h},\qquad
 \phi_n^{(j)}(h)=4e^{h/2}P_j(z_n)e^{-z_n},\qquad
 \psi^{(j)}(h)=\sum_{n\geq1}\phi_n^{(j)}(h).                 \tag{16}
\]

The exact recurrence

\[
 P_{j+1}={P_j\over2}+2z(P_j'-P_j)                             \tag{17}
\]

starts with `P_0=2z^2-3z` and gives

\[
 \begin{aligned}
 P_0(z)&=2z^2-3z,\\
 P_1(z)&=-4z^3+15z^2-{15\over2}z,\\
 P_2(z)&=8z^4-56z^3+{165\over2}z^2-{75\over4}z,\\
 P_3(z)&=-16z^5+180z^4-529z^3
          +{1635\over4}z^2-{375\over8}z.
 \end{aligned}                                                \tag{18}
\]

Modular completion makes `psi` even.  Set

\[
 n_j=\|\psi^{(j)}\|_{L^2(0,\infty)}^2.                       \tag{19}
\]

Because all four whole-line norms in (2) acquire the same factor two,

\[
 r={n_0n_2\over n_1^2},\qquad
 s={n_0^2n_3\over n_1^3}.                                    \tag{20}
\]

Thus no Fourier or `2 pi` factor is lost in passing to the half-line.

## 3. Exact assembly of the first two orbits

For `0<=j<=3` and `m,n` in `{1,2}`, define

\[
 G_{j,mn}=8\int_1^\infty x^{-1/2}
 P_j(\pi m^2x)P_j(\pi n^2x)
 e^{-\pi(m^2+n^2)x}dx.                                       \tag{21}
\]

The substitution `x=e^(2h)` shows exactly that

\[
 U_j:=\|\phi_1^{(j)}+\phi_2^{(j)}\|_{2,+}^2
 =G_{j,11}+2G_{j,12}+G_{j,22}.                               \tag{22}
\]

Every entry in (21) is a finite half-integer incomplete-gamma expression.
For an explicit rational enclosure, put

\[
 J_d(\lambda)=\int_1^\infty x^{d-1/2}e^{-\lambda x}dx.
\]

Integration by parts gives

\[
 J_d(\lambda)={e^{-\lambda}\over\lambda}
 +{d-1/2\over\lambda}J_{d-1}(\lambda)\qquad(d\geq1).         \tag{23}
\]

Five further integrations by parts at the base give the two-sided bound

\[
 \begin{aligned}
 {e^{-\lambda}}\sum_{k=0}^4
 {(-1)^k(2k-1)!!\over2^k\lambda^{k+1}}
 -{945e^{-\lambda}\over32\lambda^6}
 &<J_0(\lambda)\\
 &<{e^{-\lambda}}\sum_{k=0}^4
 {(-1)^k(2k-1)!!\over2^k\lambda^{k+1}}.
 \end{aligned}                                                \tag{24}
\]

This is an alternating integration-by-parts enclosure with a signed
integral remainder; it is not an asymptotic equality.

For reproducibility, expand (21) in the `J_d` and apply (23)--(24) at
`lambda=2pi,5pi,8pi`.  The rational bounds

\[
 3.141592653589793<\pi<3.141592653589794                       \tag{25}
\]

follow, for example, from Machin's identity and the alternating arctangent
series.  At each rational endpoint, the positive Taylor series for
`e^lambda` through order 120, with its remaining geometric tail, bounds
`e^{-lambda}` after inversion.  Straight rational outward evaluation then
gives

\[
 \boxed{
 {639\over1000}<U_0<{16\over25},\quad
 {163\over25}<U_1<{327\over50},\quad
 191<U_2<192,\quad
 8950<U_3<9000.}                                               \tag{26}
\]

All three pairings `(1,1)`, `(1,2)`, and `(2,2)` are retained in (26),
including the signed cross terms.  No orbitwise positivity is assumed.

## 4. One bound for every remaining orbit

For `z>=9pi`, the four exact polynomials in (18) satisfy

\[
 |P_j(z)|<2^{j+1}z^{j+2}\qquad(0\leq j\leq3).                 \tag{27}
\]

For `j=3`, one may check this without root numerics: `P_3(z)<0` once
`z>45/4`, while `P_3(z)+16z^5>0` for `z>=3`.  The lower-order cases follow
by the same coefficient grouping.

Changing variables separately in the `n`th orbit and using

\[
 \int_a^\infty z^pe^{-2z}dz
 \leq {a^pe^{-2a}\over2-p/a}
 \qquad(a>p/2)                                                 \tag{28}
\]

gives

\[
 \|\phi_n^{(j)}\|_{2,+}\leq b_{j,n}:=
 {\sqrt8\,2^{j+1}\pi^{j+3/2}n^{2j+3}e^{-\pi n^2}
  \over
  \sqrt{2-(2j+7/2)/(\pi n^2)}}.                              \tag{29}
\]

For `n>=3`,

\[
 {b_{j,n+1}\over b_{j,n}}
 \leq\left({4\over3}\right)^9e^{-7\pi}<{1\over2}.          \tag{30}
\]

The same rational exponential evaluation as above, now using
`e^(9pi)>1.8*10^12`, gives

\[
 b_{0,3}<9\mathbin{\cdot}10^{-10},\quad
 b_{1,3}<6\mathbin{\cdot}10^{-8},\quad
 b_{2,3}<3\mathbin{\cdot}10^{-6},\quad
 b_{3,3}<1.7\mathbin{\cdot}10^{-4}.                           \tag{31}
\]

Minkowski and the geometric ratio (30) therefore bound the complete
remaining tails

\[
 \tau_j:=\left\|\sum_{n\geq3}\phi_n^{(j)}\right\|_{2,+}
\]

by

\[
 \boxed{
 \tau_0<2\mathbin{\cdot}10^{-9},\quad
 \tau_1<2\mathbin{\cdot}10^{-7},\quad
 \tau_2<10^{-5},\quad
 \tau_3<10^{-3}.}                                             \tag{32}
\]

Every theta orbit occurs either in the exact block (22) or in (32).

## 5. The sixth-moment inequality and the first even rung

The triangle and reverse-triangle inequalities give

\[
 (\sqrt{U_j}-\tau_j)^2\leq n_j
 \leq(\sqrt{U_j}+\tau_j)^2.                                  \tag{33}
\]

The lower bound is valid as written because (26) and (32) make
`sqrt(U_j)>tau_j` in every case.

Combining the wholly rational bounds (26) and (32) yields the convenient
boxes

\[
 \boxed{
 0.638<n_0<0.641,\qquad
 6.50<n_1<6.56,\qquad
 190<n_2<193,\qquad
 8900<n_3<9050.}                                               \tag{34}
\]

Consequently

\[
 r>{(319/500)190\over(164/25)^2}
 ={151525\over53792}>{14\over5},                              \tag{35}
\]

and

\[
 s<{(641/1000)^2 9050\over(13/2)^3}
 ={74369461\over5492500}<14.                                  \tag{36}
\]

Since `9r^2+6r` is increasing for positive `r`, (35)--(36) give the exact
rational margin

\[
 9r^2+6r-27-4s
 >9\left({14\over5}\right)^2+6\left({14\over5}\right)-27-56
 ={109\over25}>0.                                             \tag{37}
\]

This proves (15).  The discriminant in (13) is therefore strictly negative,
while the leading coefficient (11) is strictly positive.  Hence

\[
 \boxed{\mathcal H>0\quad\hbox{for every real }c.}            \tag{38}
\]

In particular, (38) holds for the actual coefficient (1), without any sign
or size estimate for the old signed moments.  The first even
`(N,epsilon)=(1,0)` instance of equation (24) is proved, and the exact
two-generator implication gives the corresponding target pivot sign.
Only that sufficient implication is used: the five-scalar condition is not
asserted to be target-equivalent.
