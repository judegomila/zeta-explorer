# Suzuki's scalar criterion and the signed reserve recurrence

**Status: accepted, scoped analytic results.** The all-scale signed arithmetic bound remains **open**. This module does not prove RH. “Accepted” means internal mathematical review of the stated argument, not external peer review or formal verification.

## 1. Actual arithmetic normalization

Let \(\Lambda\) be the von Mangoldt function, \(\psi_0\) the digamma function, and
\[
a=\frac{\psi_0(5/4)-\log\pi}{2},\quad b=a-2,\quad
\alpha_k=2k+\tfrac12,\quad
T(r)=\sum_{k\ge1}\frac{1-e^{-\alpha_k r}}{\alpha_k^2},\quad
T_\infty=\frac{\psi_0'(5/4)}4.
\]
For real \(r\ge0\), define
\[
D(r)=\sum_{n\le e^r}\frac{\Lambda(n)}{\sqrt n}(r-\log n)
       -4(e^{r/2}-1)+2r,
\qquad \Psi(r)=ar+T(r)-D(r).
\]
The endpoint hinge is zero when \(n=e^r\). This is Suzuki's normalization: the screw function is \(-\Psi\), not \(\Psi\). Suzuki's global nonnegativity criterion is a known equivalence with RH, not a new conclusion of this module. [Suzuki, *Aspects of the screw function corresponding to the Riemann zeta-function*, Theorem 1.7](https://arxiv.org/abs/2206.03682).

For the actual zero-extended even Weil form on a centered interval of width \(W\), the normalized constant box \(e_0=W^{-1/2}1_{[-W/2,W/2]}\) satisfies
\[
\Psi(W)=\frac W2 q_W[e_0].
\]
Indeed its correlation is \(R_0(s)=(1-s/W)_+\). With \(K(s)=2\sum_{k\ge1}e^{-\alpha_k s}\), the gamma diagonal is
\[
A_{00}=2a+W^{-1}\int_0^W sK(s)\,ds+\int_W^\infty K(s)\,ds.
\]
Termwise positive integration gives \((W/2)A_{00}=aW+T(W)\), while the arithmetic pairing is \(2D(W)/W\). The box belongs to the logarithmic Fourier form domain since its Fourier transform is \(O(|t|^{-1})\). Thus finite scalar positivity tests **one direction**, not every even test function.

## 2. Exact event reserves

Order the distinct prime powers as \(q_1<q_2<\cdots\), and put
\[
r_n=\log q_n,\quad w_n=\frac{\Lambda(q_n)}{\sqrt{q_n}},\quad
S_n=\sum_{j\le n}w_j,\quad J_n=\sum_{j\le n}w_jr_j,\quad H_n=S_n-b.
\]
For \(r\ge r_0=\log2\), set
\[
C(r)=4e^{r/2}+br-4+T(r),\qquad C^*(s)=\sup_{r\ge r_0}\{sr-C(r)\},\qquad M_n=J_n-C^*(S_n).
\]
Here \(C''(r)=e^{r/2}-e^{-5r/2}/(1-e^{-2r})>0\) on \([r_0,\infty)\). On each actual cell \([r_n,r_{n+1}]\),
\[
\Psi(r)=C(r)-S_nr+J_n\ge M_n.
\]
The same affine continuation majorizes \(\Psi\) globally: before an included event its hinge is premature and positive; after an omitted event the missing hinge only decreases the true function. Therefore
\[
\Psi(r)\ge0\ (r\ge r_0)\quad\Longleftrightarrow\quad M_n\ge0\ \text{for every }n.
\]
If \(u=(C^*)'\) is the constrained maximizer, exact subtraction gives
\[
M_{n+1}-M_n=\int_{S_n}^{S_n+w_{n+1}}(r_{n+1}-u(s))\,ds.
\]
Convexity alone does not fix this sign.

## 3. Explicit enclosure and signed-credit/positive-debt identity

Set
\[
\delta_0=\frac8{15}2^{-5/2},\quad
x_-(H)=\left(\frac{H-\delta_0}{2}\right)^2,\quad
\epsilon(H)=\frac4{25}\frac{x_-(H)^{-5/2}}{1-x_-(H)^{-2}},
\]
\[
R_n=J_n-2H_n\left[\log(H_n/2)-1\right]-4+T_\infty.
\]
**Theorem.** At every actual event,
\[
R_n-\epsilon(H_n)\le M_n\le
R_n-\frac4{25}(H_n/2)^{-5}.
\]
To prove it, let \(U=T_\infty-T\) and \(C_0=C+U\). The series gives
\[
0<T'(r)\le\delta_0,\qquad
0<U(r)\le\frac4{25}\frac{e^{-5r/2}}{1-e^{-2r}}.
\]
The verified first-event inequality \(H_1-\delta_0>2\sqrt2\) implies every maximizer is interior. Solving \(C'(u)=S_n\) bounds it between \(2\log((H_n-\delta_0)/2)\) and \(2\log(H_n/2)\). Compare \(C^*\) with the explicit conjugate of \(C_0\), evaluating one at the other's maximizer; monotonicity of \(U\) gives the enclosure.

For the next event \(q\), abbreviate \(H=H_n\), \(w=\Lambda(q)/\sqrt q\). Then exactly
\[
R_{n+1}-R_n=c_q-d_q,\qquad
c_q=w\log\frac{q}{(H/2)^2},\qquad
d_q=2H\left[(1+w/H)\log(1+w/H)-w/H\right].
\]
The integral remainder of \(\phi(z)=(1+z)\log(1+z)-z\), with \(\phi''(z)=1/(1+z)\), proves
\[
\frac{w^2}{H+w}\le d_q\le\frac{w^2}{H}.
\]
The credit depends on the entire weighted prime history through \(H\); a short ordinary prime gap does not determine its sign.

## 4. The debt is summable; the signed credits are not controlled

The elementary bound \(\psi(x)\le3x\) gives by partial summation \(S(x)\le6\sqrt x-3\). Since \(-3<b<-2\), a pre-event state satisfies \(H<6\sqrt q\); also \(w<1\). For a starting state \(H_0\ge6e\), monotonicity of \((\log q)/\sqrt q\) yields
\[
\sum_{\text{events after }H_0}d_q
\le12(1+H_0^{-1})^2\frac{\log(H_0/6)+1}{H_0}.
\]
Indeed \(d_q\le g(H)w\), \(g(t)=12\log(t/6)/t^2\), and adjacent state intervals \([H,H+w]\) convert the sum into the integral of \(g\), with the displayed ratio allowance. Thus all positive convexity debt has finite total.

Writing \(G_N=\sum_{n<N}c_{q_{n+1}}\), the exact recurrence is \(R_N=R_1+G_N-\sum_{n<N}d_{q_{n+1}}\). Hence a finite lower bound for \(R_N\) is equivalent to a finite lower bound for \(G_N\). Through the one-sided Landau criterion for \(D\), either bound would imply RH. Neither is proved here. It is invalid to subtract only the future positive debt from the present reserve and ignore future negative credits.

## Evidence and reproducibility

The detailed source/audit mapping is in the publication manifest. The companion finite-certificate module supplies runnable outward-rounded event checks. The accepted analytic audit is `SUZUKI_BREGMAN_CREDIT_REDUCTION.md`; the normalization audit is `SUZUKI_FOLLOWTHROUGH_ADDENDUM.md`. Historical numerical scans and prior endpoint statements are not imported as premises.
