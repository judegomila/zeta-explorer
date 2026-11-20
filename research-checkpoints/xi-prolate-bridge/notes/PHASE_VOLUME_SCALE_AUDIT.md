# Phase-volume scale audit: exact stationary law and the finite-orbit obstruction

## 1. Scope

This note audits the missing phase-volume estimate in
`notes/PARITY_MULTIPLIER_SCHUR_REDUCTION.md`.  It separates four logically
different statements:

1. exact Cesaro and Haar identities for the source prime polynomial;
2. a rigorous obstruction to the usual fixed-moment/equidistribution proof
   architecture at the required scale;
3. the finite upper and lower estimates actually proved from the pinned
   source inputs; and
4. a random-phase prediction which is useful diagnostically but is **not** a
   theorem about the actual phase volume.

No zero table, global Weil positivity, or location of a nontrivial zeta zero
is used.  This note proves neither a polynomial phase-volume bound nor a
signed-sector floor.  It does not change the repository status.

Fix `lambda>1`, and put

\[
 x=\lambda^2,\qquad \ell=\log\lambda .                         \tag{1.1}
\]

In the convention of the source-normalized multiplier, define

\[
 S_\lambda(t)=
 \sum_{p^r\leq x}{\log p\over p^{r/2}}
                    \cos(rt\log p),                            \tag{1.2}
\]

so that

\[
 m_\lambda(t)=2\theta'(t)-2S_\lambda(t).                       \tag{1.3}
\]

The sum in (1.2) is exactly the inclusive prime-power sum at
`n<=lambda^2`.  In particular, no prime power is omitted and the minus sign
on the prime block in `m_lambda` is retained.

## 2. Exact Cesaro variance and the Haar model

For each fixed finite `lambda`, unique factorization gives

\[
 \lim_{T\to\infty}{1\over2T}\int_{-T}^{T}S_\lambda(t)\,dt=0,    \tag{2.1}
\]

and

\[
 \boxed{
 V_\lambda:=
 \lim_{T\to\infty}{1\over2T}\int_{-T}^{T}S_\lambda(t)^2\,dt
 ={1\over2}\sum_{p^r\leq\lambda^2}{(\log p)^2\over p^r}.}     \tag{2.2}
\]

Indeed, the frequency `r log p` equals `s log q` only when `p=q` and
`r=s`.  All other cosine products have zero Cesaro mean.  Formula (2.2) is
an identity for the actual source frequencies, not a probabilistic
assumption.

There is an equivalent fixed-`lambda` Haar formulation.  Give each prime an
independent angle `Theta_p`, uniform on `[0,2*pi]`, and set

\[
 X_{p,\lambda}(\Theta_p)=
 \sum_{1\leq r\leq \log x/\log p}
 {\log p\over p^{r/2}}\cos(r\Theta_p).                         \tag{2.3}
\]

The logarithms of distinct primes are rationally independent, so the
Kronecker orbit `t -> (t log p)_p` is uniquely ergodic on this finite prime
torus.  Consequently every fixed continuous function of `S_lambda` has the
same infinite-time average as the corresponding function of
`sum_p X_(p,lambda)`.

The prime groups are uniformly bounded:

\[
 |X_{p,\lambda}|
 \leq {\log p\over\sqrt p-1}
 \leq C_{\rm group},\qquad
 C_{\rm group}:=\sup_{q\geq2}{\log q\over\sqrt q-1}<\infty.   \tag{2.4}
\]

The pinned unconditional PNT in `P3_SOURCE_LOCK.json`, together with
elementary partial summation, gives the explanatory asymptotics

\[
 \sum_{p^r\leq\lambda^2}{\log p\over p^{r/2}}
       =2\lambda+o(\lambda),                                   \tag{2.5}
\]

\[
 V_\lambda=\ell^2+o(\ell^2).                                  \tag{2.6}
\]

For (2.6), the `r=1` contribution before the factor `1/2` is
`(1/2)(log x)^2+o((log x)^2)`; the sum over `r>=2` is bounded.  Equations
(2.4) and (2.6) verify the Lindeberg condition for the independent prime
groups.  Hence the following **iterated Haar limit** is rigorous:

\[
 {\sum_pX_{p,\lambda}\over\log\lambda}
 \ \Longrightarrow\ \ N(0,1)\qquad(\lambda\to\infty).        \tag{2.7}
\]

The order of limits matters.  Equation (2.7) first replaces the finite
orbit by its infinite-time Haar law for each fixed `lambda`; it supplies no
uniform rate at a time `T=T(lambda)`.

## 3. What the Haar scale predicts, and what it does not prove

For large real `t`, the exact digamma term has the asymptotic scale

\[
 2\theta'(t)=\log(|t|/(2\pi))+o(1).                            \tag{3.1}
\]

Thus at `t` of size `lambda^A`, with `A>0` fixed and `U+g=o(ell)`, the
deficit condition is, at its leading scale,

\[
 S_\lambda(t)>{A\over2}\ell.                                  \tag{3.2}
\]

This is a fixed-standard-deviation event in (2.7), not a growing-deviation
event.  If `Z` is standard normal, the Haar model predicts the positive
mean

\[
 c_A:=\mathbb E(2Z-A)_+
 =2\varphi(A/2)-A\,\overline\Phi(A/2)>0,                       \tag{3.3}
\]

where `varphi` and `bar(Phi)` are the standard normal density and upper
tail.  A Haar-distributed block of length `lambda^A` would therefore have
deficit mass on the scale

\[
 c_A\lambda^A\log\lambda.                                    \tag{3.4}
\]

Equation (3.4) is **not an estimate for the actual**
`Phi_lambda(U,g)`.  Turning it into one would require a quantitative
equidistribution theorem uniform in `lambda` on precisely the finite orbit
before the archimedean term turns the deficit off.  No such theorem is in
the source locks.  Numerical sampling can test (3.4), but cannot replace
that missing uniform theorem.

The purpose of (2.7)--(3.4) is adversarial: PNT information, coefficient
norms, and the infinite-time phase law are all compatible with mass much
larger than `lambda^2/log(lambda)`.  Therefore those inputs alone cannot be
used to assert the desired polynomial upper bound.

## 4. The finite-orbit and moment-length obstruction

Put

\[
 D_\lambda(t)=\sum_{n\leq x}{\Lambda(n)\over\sqrt n}n^{it},
 \qquad S_\lambda(t)=\operatorname {Re}D_\lambda(t).          \tag{4.1}
\]

The `k`-th power of `D_lambda` is a Dirichlet polynomial supported on
integers at most `x^k`.  More elementarily, a torus monomial of total degree
at most `k` has frequency

\[
 \omega=\sum_pj_p\log p=\log(a/b),qquad
 a,b\leq x^k.                                                  \tag{4.2}
\]

When `omega` is nonzero, unique factorization and the elementary spacing of
distinct positive integers give

\[
 |\omega|\geq {1\over x^k+1}.                                 \tag{4.3}
\]

The normalized average of that monomial on an interval of length `T` has
absolute value at most `2/(T|omega|)`.  Thus the usual termwise moment or
Fourier-discrepancy argument only resolves degree `k` uniformly when its
time scale dominates `x^k`.  At

\[
 T=\lambda^A=x^{A/2},                                         \tag{4.4}
\]

this architecture is restricted to

\[
 k<A/2.                                                       \tag{4.5}
\]

This conflicts with the tail strength required by the phase-volume
integral.  Even granting an ideal subgaussian moment estimate of the form

\[
 {1\over T}\int_T^{2T}|S_\lambda(t)|^{2k}\,dt
 \leq (Ck\ell^2)^k,                                          \tag{4.6}
\]

Markov's inequality at the threshold `(A/2)ell` gives only

\[
 {1\over T}\left|
 \{t\in[T,2T]:S_\lambda(t)>(A/2)\ell\}\right|
 \leq\left({4Ck\over A^2}\right)^k.                         \tag{4.7}
\]

Under (4.5), the logarithmic saving obtainable from (4.7) is at most on the
scale `A log A`.  Controlling the contribution of a block of length
`lambda^A` by a fixed polynomial in `lambda` would instead require a saving
on the scale `A ell`.  For fixed `A`, the former has no dependence on
`ell`.  This is a rigorous obstruction to the standard
`raise-to-a-moment, diagonalize, and apply Markov` route; it is not an
impossibility theorem for every conceivable arithmetic method.

Full-torus discrepancy is still more poorly matched to the available time
scale.  Let `d=pi(x)`.  The `2^d` distinct subset sums of the numbers
`log p`, `p<=x`, lie in an interval of length `theta_C(x)=sum_(p<=x)log p`.
By pigeonhole, two have nonzero difference `omega_lambda` satisfying

\[
 0<|\omega_\lambda|
 \leq {\theta_C(x)\over2^d-1}.                                \tag{4.8}
\]

The corresponding Fourier character stays close to constant until a time
at least `(2^d-1)/theta_C(x)`.  Since the pinned PNT gives
`d` on the scale `x/log x`, this elementary discrepancy scale is

\[
 \exp\!\left(\Theta\left({\lambda^2\over\log\lambda}\right)\right).
                                                                    \tag{4.9}
\]

No lower bound for a linear form in logarithms can remove the actual close
frequency constructed in (4.8).  By contrast, the finite absolute envelope
in the next section makes the deficit vanish after `exp(O(lambda))` when
`U+g=O(lambda)`.  Hence a discrepancy argument uniform over all full-prime
Fourier characters reaches its natural scale only after the relevant
integrand has already vanished.

The zero-free and PNT source locks control the `n`-aspect size of the
coefficients.  They do not supply the missing critical-line, long-time
large-deviation estimate for (4.1).  Importing a conditional long-mean
theorem would be circular and is outside this project.

## 5. The finite upper bound that is actually proved

Define the exact source sum and scalar

\[
 \Sigma_\lambda=
 \sum_{p^r\leq\lambda^2}{\log p\over p^{r/2}},
 \qquad
 A_\lambda(U,g)=g+U+2\Sigma_\lambda
                 -\psi(1/4)+\log\pi.                          \tag{5.1}
\]

The digamma lower bound reconstructed in
`notes/PARITY_MULTIPLIER_SCHUR_REDUCTION.md` proves the finite formula

\[
 \boxed{
 \Phi_\lambda(U,g)\leq
 \begin{cases}
 0,&A_\lambda(U,g)\leq0,\\[1mm]
 \sqrt{e^{2A_\lambda(U,g)}-1}
 -\arctan\sqrt{e^{2A_\lambda(U,g)}-1},
 &A_\lambda(U,g)>0.
 \end{cases}}                                                 \tag{5.2}
\]

This is still the only proved source-locked global phase-volume upper
bound.  With the exact pinned constant

\[
 C_\psi=1+9.22022
 \left({3\over0.8476836}\right)^3e^{-3},                      \tag{5.3}
\]

one has the fully finite estimate

\[
 \Sigma_\lambda\leq C_\psi(2\lambda-1).                      \tag{5.4}
\]

Thus (5.2)--(5.4) are exponential in `lambda` when `U+g=O(lambda)`.  The
asymptotic (2.5) identifies the sharper explanatory exponent
`exp(4lambda+o(lambda))` when `U+g=o(lambda)`, but that shorthand is not
substituted for the finite formulas (5.2)--(5.4).

## 6. An exact near-zero lower check

The opposite direction has a simple finite bound which is useful for scale
checking.  Put

\[
 C_{\rm arch}(\lambda)=
 \operatorname {Re}\psi\!\left({1\over4}
              +{i\over4\log\lambda}\right)-\log\pi.          \tag{6.1}
\]

The positive series for
`Re psi(1/4+iy)-psi(1/4)` is increasing in `|y|`.  If
`|t|<=1/(2ell)` and `p^r<=lambda^2`, then
`|rt log p|<=1`, and therefore

\[
 S_\lambda(t)\geq\cos(1)\Sigma_\lambda,qquad
 2\theta'(t)\leq C_{\rm arch}(\lambda).                       \tag{6.2}
\]

Integration over this interval gives the exact finite lower bound

\[
 \boxed{
 \Phi_\lambda(U,g)\geq{1\over\log\lambda}
 \left[g+U-C_{\rm arch}(\lambda)
       +2\cos(1)\Sigma_\lambda\right]_+.}                     \tag{6.3}
\]

For a schedule on which `U+g` is bounded below, the pinned PNT and (2.5)
make (6.3) of order at least `lambda/log(lambda)` asymptotically.  This does
not contradict the target `lambda^2/log(lambda)` and does not decide its
truth.

## 7. Consequences for the Schur program

The following proposed deductions are rejected:

1. replacing the actual finite orbit by its Haar law;
2. inferring a polynomial phase volume from PNT coefficient bounds;
3. using a fixed number of mean values or a mean-square/large-sieve bound to
   sum all logarithmic time blocks;
4. treating sampled deficit masses as an asymptotic theorem; or
5. importing positivity or a zero distribution which already assumes the
   desired conclusion.

The estimate

\[
 \Phi_\lambda(U_\lambda,g_\lambda)
 \ll {\lambda^2\over\log\lambda}                              \tag{7.1}
\]

is neither proved nor rigorously disproved here.  The exact source inputs
currently prove only (5.2) and (6.3).  Closing (7.1) would require genuinely
new finite-orbit large-deviation information at logarithmic thresholds.

A different reduction is to retain the actual finite Fourier
compression before taking a trace.  With source modes `phi_n`, its exact
trace is

\[
 \operatorname {tr}(P_NT_vP_N)
 ={1\over2\pi}\int_{\mathbb R}v(t)
   \sum_{|n|\leq N}|\widehat\phi_n(t)|^2\,dt.                 \tag{7.2}
\]

Unlike the full trace, (7.2) suppresses frequencies far beyond the selected
Fourier band.  `notes/COMPRESSED_MULTIPLIER_TRACE_THEOREM.md` proves, by a
self-contained dyadic logarithmic-Hilbert argument, an explicit
`O(lambda^2 log lambda)` trace and `O(lambda^2)` dangerous-rank scale on a
polynomial finite schedule under the displayed shift-growth hypothesis.  No
Montgomery--Vaughan source is used.  The explicit finite constants can still
make the rank bound order-vacuous, and the theorem leaves an
`O(lambda^2)` signed Schur complement; it does not prove capture by the
physical prolate range or an exact sector floor.  Alternatively one must
prove that finite dangerous-space Schur complement directly.

The signed-sector floors, the residual--gap limit, and locally uniform
determinant convergence remain open.  The formal repository state remains
`P0_INVALIDATED`.
