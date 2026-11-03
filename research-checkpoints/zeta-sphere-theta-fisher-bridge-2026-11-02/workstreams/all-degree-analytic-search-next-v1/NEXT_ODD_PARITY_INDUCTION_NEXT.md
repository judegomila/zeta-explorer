# The next odd complete-theta Sobolev condition and its induction obstruction

## Scope and outcome

This note proves the next odd two-generator condition for the complete theta
source and asks whether the proved first-odd inequality

\[
 5m_1^2>m_0m_2,
 \qquad m_j=\int_{\mathbb R}t^{2j}W(t)^2\,dt,                 \tag{1}
\]

can seed an odd-parity induction for the two-generator auxiliary in
`THETA_SOBOLEV_AUXILIARY_NEXT.md`.

There are four exact conclusions.

1. At the next odd rung the residual is

   \[
    q_c(t)=t(t^2-c).
   \]

   Its five-scalar condition is one explicit degree-eight polynomial
   `F(c)>=0` in the residual coefficient.  The coefficient of `c^8` is
   precisely `m_0^2(5m_1^2-m_0m_2)`, so (1) controls the two ends
   `|c| -> infinity`.
2. For the complete theta source, exact first-two-orbit incomplete-gamma
   enclosures plus one uniform bound for every remaining orbit prove the
   stronger statement `F(c)>0` for every real `c`.  On the positive half-line
   in `c`, the proof reduces to an explicit integer polynomial whose exact
   Sturm chain has no positive root.  This closes the actual `(N,epsilon)=(1,1)`
   sufficient condition without estimating its signed residual coefficient.
3. The finite-`c` coefficients contain genuinely new moments through
   `m_4`.  They are not controlled by the first-odd gap.  This is not just
   a formal concern: an exact positive Gaussian Fourier model satisfies
   (1) strictly, has a positive first odd target moment, and nevertheless
   has a negative next odd Schur pivot for its **actual old-data residual**.
4. Consequently there is no source-free odd induction from the first-odd
   auxiliary, positive Fourier source, Schwartz decay, positive `W^2` Gram
   geometry, and old-residual orthogonality.  The complete-theta proof below
   succeeds precisely because it supplies new source-specific orbit bounds.

The countermodel is not the theta source and does not refute the theta
theorem proved here.  The proof retains every theta orbit; its finite interval
arithmetic only encloses exact incomplete-gamma expressions and an analytic
infinite tail.  No higher rung, parity induction, all-degree theorem,
Xi--Laguerre theorem, or RH conclusion is claimed.

## 1. Exact next-odd reduction

Let

\[
 q_c(t)=t^3-ct,
 \qquad m_j=\int_{\mathbb R}t^{2j}W(t)^2\,dt
 \quad(0\leq j\leq4).                                      \tag{2}
\]

The five positive-weight scalars are

\[
\begin{aligned}
 A&=9m_2-6cm_1+c^2m_0,\\
 B&=6(m_2-cm_1),\\
 C&=m_3-2cm_2+c^2m_1,\\
 D&=m_4-2cm_3+c^2m_2,\\
 E&=3m_3-4cm_2+c^2m_1.                                      \tag{3}
\end{aligned}
\]

Here

\[
 \Delta=AD-E^2>0                                             \tag{4}
\]

whenever `q_c'W` and `tq_cW` are linearly independent in `L^2`.  This holds
for every nonzero Schwartz `W` which is positive on a set of positive
measure.  Equation (13) of `SOBOLEV_FIVE_SCALAR_NEXT.md` becomes

\[
 \boxed{
 F(c):=\{AC+E(A-B)\}^2-(AD-E^2)(A^2-B^2)\geq0.}             \tag{5}
\]

The sufficient remainder is exactly

\[
 \boxed{\mathcal H(c)={F(c)\over4A\Delta}.}                  \tag{6}
\]

Thus no denominator sign is hidden in (5).

For an audit-ready symbolic form, write

\[
 F(c)=\sum_{k=0}^8f_kc^k.                                    \tag{7}
\]

Direct expansion of (3)--(5) gives

\[
\begin{aligned}
f_8={}&5m_0^2m_1^2-m_0^3m_2,\\
f_7={}&-36m_0m_1^3-14m_0^2m_1m_2+2m_0^3m_3,\\
f_6={}&36m_1^4+210m_0m_1^2m_2+25m_0^2m_2^2
       -14m_0^2m_1m_3-m_0^3m_4,\\
f_5={}&-324m_1^3m_2-492m_0m_1m_2^2-18m_0^2m_2m_3
       +18m_0^2m_1m_4,\\
f_4={}&1053m_1^2m_2^2+72m_1^3m_3+441m_0m_2^3
       +228m_0m_1m_2m_3-72m_0m_1^2m_4\\
     &\quad+25m_0^2m_3^2-27m_0^2m_2m_4,\\
f_3={}&-1782m_1m_2^3-288m_1^2m_2m_3-474m_0m_2^2m_3
       -156m_0m_1m_3^2+252m_0m_1m_2m_4,\\
f_2={}&1215m_2^4+1170m_1m_2^2m_3+36m_1^2m_3^2
       -216m_1^2m_2m_4+306m_0m_2m_3^2-207m_0m_2^2m_4,\\
f_1={}&-1350m_2^3m_3-540m_1m_2m_3^2+594m_1m_2^2m_4,\\
f_0={}&729m_2^2m_3^2-405m_2^3m_4
       =81m_2^2(9m_3^2-5m_2m_4).                            \tag{8}
\end{aligned}
\]

The leading coefficient is exactly

\[
 \boxed{f_8=m_0^2(5m_1^2-m_0m_2).}                          \tag{9}
\]

It is positive for the complete theta source by the proved first-odd norm
bound.  But already `f_6` and `f_0` contain the new moment `m_4`, which (1)
does not constrain.

This leading-coefficient inheritance is not special to degree three.  If
`q_0` is any fixed residual candidate and

\[
 q_c=(t^2-c)q_0,                                             \tag{10}
\]

then every scalar `A,B,C,D,E` for `q_c` has leading term `c^2` times the
corresponding scalar for `q_0`.  Therefore

\[
 \boxed{F[q_c]=c^8F[q_0]+O(c^7),
 \qquad \mathcal H[q_c]=c^2\mathcal H[q_0]+O(c).}            \tag{11}
\]

An old positive margin controls only the escape to infinity in the new
coefficient.  It does not control the finite-coefficient interior.

## 2. An exact positive-Fourier countermodel

Consider

\[
 \boxed{W_G(t)=e^{-t^2/2}+e^{-49t^2/2}.}                     \tag{12}
\]

It is positive, even, entire, and Schwartz.  Under the nonunitary Fourier
convention its inverse transform is the strictly positive Gaussian sum

\[
 \psi_G(h)={1\over\sqrt{2\pi}}e^{-h^2/2}
 +{1\over7\sqrt{2\pi}}e^{-h^2/98}>0.                         \tag{13}
\]

Thus the obstruction persists inside the ambient class of positive Fourier
sources; it is not caused by a sign-changing physical profile.

Remove the common factor `sqrt(pi)` from the positive moments and write
`m_k=sqrt(pi) mu_k`.  Since

\[
 W_G^2=e^{-t^2}+2e^{-25t^2}+e^{-49t^2},
\]

one has the exact rational formula

\[
 \boxed{
 \mu_k={(2k-1)!!\over2^k}
 \left(1+{2\over5^{2k+1}}+{1\over7^{2k+1}}\right).}          \tag{14}
\]

The first-odd sufficient gap is strictly positive:

\[
 \boxed{
 5\mu_1^2-\mu_0\mu_2
 ={256959378\over1838265625}>0.}                              \tag{15}
\]

It remains to use the **actual** next residual rather than choosing `c`
freely.  Put

\[
 J_G=W_G'^2-W_GW_G''.
\]

Direct differentiation gives

\[
 \boxed{
 J_G(t)=e^{-t^2}+49e^{-49t^2}
 +(50-2304t^2)e^{-25t^2}.}                                   \tag{16}
\]

Let

\[
 I_k(r)={(2k-1)!!\over2^kr^{2k+1}},
 \qquad
 \tau_k={1\over\sqrt\pi}\int_{
 \mathbb R}t^{2k}J_G(t)\,dt.
\]

Then

\[
 \tau_k=I_k(1)+49I_k(7)+50I_k(5)-2304I_{k+1}(5),             \tag{17}
\]

and, exactly,

\[
 \tau_1={4779\over21875}>0,
 \quad
 \tau_2={7598421\over10718750},
 \quad
 \tau_3={49070403153\over26260937500}.                      \tag{18}
\]

The old odd block is therefore positive and invertible.  The actual monic
old-data residual is

\[
 q_G(t)=t(t^2-c_G),
 \qquad
 \boxed{c_G={\tau_2\over\tau_1}={281423\over86730}.}         \tag{19}
\]

However its next signed Schur pivot has the strict opposite sign:

\[
 \boxed{
 \tau_3-{\tau_2^2\over\tau_1}
 =-{334398467889\over774697656250}<0.}                        \tag{20}
\]

Indeed the campaign normalization is

\[
 M_k={1\over4\pi}\int t^{2k}J_G(t)\,dt
 ={\tau_k\over4\sqrt\pi},                                  \tag{21}
\]

so (20) is exactly the sign of
`M_3-M_2^2/M_1`.  By the exact auxiliary-square identity,

\[
 2\pi\mathcal S_{1,1}
 =\min_{\alpha,\beta}
 \|q_GW_G'+(\alpha q_G'+\beta tq_G)W_G\|_2^2
 +\mathcal H(c_G),                                           \tag{22}
\]

and (20) forces `mathcal H(c_G)<0`.  Thus the degree-eight condition (5)
fails at the actual old-data coefficient even though the first-odd
condition (15) holds strictly.

Direct substitution of (14) and (19) into (3)--(6) gives the independently
audited exact value

\[
 {\mathcal H(c_G)\over\sqrt\pi}
 =-{3474498340212340134350677167894900778101
 \over4643159398830406621419659733518227122500}<0.           \tag{23}
\]

This is an analytic identity with rational signs.  It is not a sampled
counterexample.

## 3. Consequence for an odd-parity induction

Equations (9) and (11) explain why a naive induction can look plausible:
the old margin is literally the leading coefficient of the next condition.
Equation (20) shows why it is false: the inherited leading form does not pay
the finite-coefficient interior.

More explicitly, no implication of the following form is valid in the
positive-Fourier Schwartz class:

\[
 \begin{gathered}
 \text{old two-generator margin}>0,
 \quad\text{old signed block}>0,
 \quad q_{\rm new}=\text{actual old-data residual}
 \\
 \Longrightarrow\quad
 \text{next two-generator margin}\geq0.
 \end{gathered}                                               \tag{24}
\]

The Gaussian model lacks the discrete Jacobi orbit law, modular seam
cancellation, and theta-scale tail.  It therefore leaves open an
actual-theta theorem, but proves that such a theorem must use that additional
arithmetic rather than the base case as a black-box induction hypothesis.

## 4. Complete-orbit bounds through the fourth derivative

For the complete theta source, the next odd problem is

\[
 \boxed{F_\theta(c_\theta)>0,
 \qquad c_\theta={\mathsf M_2\over\mathsf M_1},}              \tag{25}
\]

with `F_theta` given by (7)--(8).  We prove the stronger coefficient-free
statement

\[
 \boxed{F_\theta(c)>0\quad\text{for every real }c.}           \tag{26}
\]

It closes the rung without estimating the signed residual coefficient.  The
Gaussian countermodel above shows why it is a new theta theorem rather than
an induction from (1).

The complete-orbit method used for the first even proof extends exactly one
derivative further.  On `h>=0`,

\[
 \psi^{(j)}(h)=\sum_{n\geq1}4e^{h/2}P_j(\pi n^2e^{2h})
 e^{-\pi n^2e^{2h}},
 \quad
 P_{j+1}={P_j\over2}+2z(P_j'-P_j),                            \tag{27}
\]

and the new polynomial is

\[
 P_4(z)=32z^6-528z^5+2588z^4-4256z^3
       +{15465\over8}z^2-{1875\over16}z.                    \tag{28}
\]

For `z>=9pi`, elementary coefficient grouping gives

\[
 \boxed{0<P_4(z)<32z^6.}                                     \tag{29}
\]

Indeed the lower bound follows by grouping the consecutive pairs
`32z^6-528z^5`, `2588z^4-4256z^3`, and
`(15465/8)z^2-(1875/16)z`; each is positive already on this domain.  For the
upper bound, group

\[
 32z^6-P_4(z)
 =z^4(528z-2588)+z^2(4256z-15465/8)+1875z/16>0.              \tag{30}
\]

Let

\[
 n_j=\|\psi^{(j)}\|_{L^2(0,\infty)}^2.
\]

All `m_j` equal the corresponding `n_j` times the same positive factor
`4pi`.  Define

\[
 F_+(c):=(4\pi)^{-4}F_\theta(c).                              \tag{31}
\]

Then (7)--(8), with `m_j` replaced by `n_j`, give the coefficients of
`F_+`, and `F_theta=(4pi)^4F_+` has the same sign.  The numerical bounds
below apply to this explicitly normalized polynomial.

Retain the first two Jacobi orbits together.  With

\[
\begin{aligned}
 G_{j,mn}&=8\int_1^\infty x^{-1/2}
 P_j(\pi m^2x)P_j(\pi n^2x)e^{-\pi(m^2+n^2)x}\,dx,\\
 U_j&=G_{j,11}+2G_{j,12}+G_{j,22},                           \tag{32}
\end{aligned}
\]

`U_j` is exactly the squared norm of the assembled first-two-orbit block.
Expanding the two polynomials reduces every entry to

\[
 J_d(\lambda)=\int_1^\infty x^{d-1/2}e^{-\lambda x}\,dx
 =\lambda^{-d-1/2}\Gamma(d+1/2,\lambda),                    \tag{33}
\]

at `lambda in {2pi,5pi,8pi}`.  Thus no sampled-height quadrature enters.

For every remaining orbit, (29) and its already proved lower-order analogues
give

\[
 \|\phi_n^{(j)}\|_{2,+}\leq b_{j,n}:=
 {\sqrt8\,2^{j+1}\pi^{j+3/2}n^{2j+3}e^{-\pi n^2}
  \over\sqrt{2-(2j+7/2)/(\pi n^2)}}
 \quad(0\leq j\leq4).                                      \tag{34}
\]

For `n>=3`,

\[
 {b_{j,n+1}\over b_{j,n}}
 \leq(4/3)^{11}e^{-7\pi}<1/2.                               \tag{35}
\]

Therefore the full tail after the second orbit has norm at most
`tau_j=2b_(j,3)`.  Rational outward evaluation gives

\[
\begin{aligned}
 \tau_0&<6.527\,10^{-10},&
 \tau_1&<3.763\,10^{-8},&
 \tau_2&<2.171\,10^{-6},\\
 \tau_3&<0.000125313,&
 \tau_4&<0.007241877.                                      \tag{36}
\end{aligned}
\]

Minkowski and the reverse triangle inequality now enclose the complete
infinite orbit sum by

\[
 (\sqrt{U_j}-\tau_j)^2\leq n_j
 \leq(\sqrt{U_j}+\tau_j)^2.                                 \tag{37}
\]

The lower endpoints are positive.  Evaluating the exact expressions (32)--
(33) with 300-bit `python-flint 0.9.0`/Arb outward ball arithmetic, followed
by rational outward rounding, gives

\[
\boxed{
\begin{array}{rcl}
0.6395036226&<&n_0<0.6395036248,\\
6.5277744550&<&n_1<6.5277748400,\\
191.63712160&<&n_2<191.63724190,\\
8973.2404&<&n_3<8973.2880,\\
563469.09&<&n_4<563490.85.
\end{array}}                                                 \tag{38}
\]

These boxes include the signed cross term between the first two orbits and
the analytic norm bound for every orbit `n>=3`.  They are not a finite-orbit
substitution.  Arb is the numerical trusted base only for the displayed
incomplete-gamma enclosures; the orbit tail, coefficient reduction, and
Sturm chain are independently exact.  The bounded deterministic replay is
[`src/verify_next_odd_theta.py`](src/verify_next_odd_theta.py), run as

```text
/Users/USER/Documents/GitHub/mathexplorer/.venv-arb/bin/python src/verify_next_odd_theta.py --output results/next_odd_theta_verification.json
```

Its frozen [`results/next_odd_theta_verification.json`](results/next_odd_theta_verification.json)
receipt records the `python-flint`/Arb version and precision, every orbit and
tail enclosure, the complete rational Sturm sequence, component hashes,
scope, and nonclaims.

## 5. Exact Sturm payment for every residual coefficient

Substitute (38) outward into the exact coefficient formulas (8) for
`F_+`.  Write `F_+(c)=sum_(k=0)^8 f_k^+c^k`.  The even coefficients are
strictly positive, the odd coefficients strictly negative,
and the following conservative rational bounds hold:

\[
\begin{array}{c|ccccc}
k&0&2&4&6&8\\ \hline
f_k^+>&549500000000000&3564000000000&3974300000&1054700&37
\end{array}                                                   \tag{39}
\]

and

\[
\begin{array}{c|cccc}
k&1&3&5&7\\ \hline
f_k^+>&-59420000000000&-141800000000&-78290000&-8873.
\end{array}                                                   \tag{40}
\]

For `c<=0`, the sign alternation makes every term `f_k^+c^k` nonnegative,
and the constant term is strictly positive, so `F_+(c)>0`.  For `c>=0`,
(39)--(40) give the rigorous lower bound

\[
\boxed{
\begin{aligned}
F_+(c)>P(c):={}&37c^8-8873c^7+1054700c^6-78290000c^5\\
&+3974300000c^4-141800000000c^3\\
&+3564000000000c^2-59420000000000c\\
&+549500000000000.
\end{aligned}}                                               \tag{41}
\]

It remains to prove one integer polynomial positive on the half-line.  Use
the exact rational Sturm sequence `S_0=P`, `S_1=P'`,
`S_(j+1)=-rem(S_(j-1),S_j)`.  Exact Euclidean division gives the following
endpoint sign table:

\[
\begin{array}{c|ccccccccc|c}
 &S_0&S_1&S_2&S_3&S_4&S_5&S_6&S_7&S_8&\text{variations}\\ \hline
c=0&+&-&-&-&+&+&-&-&+&4\\
c=+\infty&+&+&-&+&+&-&-&+&+&4.
\end{array}                                                   \tag{42}
\]

The sequence degrees are respectively `8,7,6,5,4,3,2,1,0`; no endpoint
entry is zero.  Sturm's theorem therefore gives no root in `(0,infinity)`.
Since `P(0)>0`,

\[
 \boxed{P(c)>0\quad(c\geq0).}                                \tag{43}
\]

Equations (39)--(43) prove `F_+(c)>0`, and (31) therefore proves (26).
Since `A>0` and `Delta>0`, (6) gives
`mathcal H(c)>0` for every real coefficient.  In particular it holds at
the actual old-data value `c_theta=mathsf M_2/mathsf M_1`, and the exact
two-generator implication proves the `(N,epsilon)=(1,1)` complete-theta
pivot strictly positive.

This is one new fixed rung.  The source-free countermodel in Section 2 shows
that its proof does not iterate from the first-odd margin without new
complete-theta information.  No induction to the next odd rung is asserted.
