# A direct prime-delay geometry: exact construction and stopping point

Date: 21 November 2026. Status: an independent exact identity and an obstruction to one proposed estimate. This does not prove RH. It refines the previously recorded difference-of-squared-norm bridge rather than claiming a new positivity criterion.

## 1. Fixed arithmetic form

Use the normalization from the arithmetic-theta manuscript:

\[
F(w)=\xi(1/2+w),\qquad L(w)=F'(w)/F(w),\qquad
v(t)=\sum_{j=1}^n b_j e^{-x_jt},\quad x_*:=\min_jx_j>1/2.
\]

Write \(S_\ell v(t)=v(t+\ell)\), and use the ordinary norm on \(L^2(0,\infty)\). Put

\[
C_v(\ell)=\int_0^\infty v(t+\ell)\overline{v(t)}\,dt,
\quad J_\lambda(t)=\int_0^\infty e^{-\lambda u}v(t+u)\,du,
\quad H_\lambda=v-\lambda J_\lambda.
\]

For \(\lambda_k=2k+5/2\), define

\[
E_\gamma(v)=\sum_{k\ge0}
\left(|J_{\lambda_k}(0)|^2+\frac2{\lambda_k}\|H_{\lambda_k}\|_2^2\right),
\qquad c_0=\tfrac12(\log\pi-\psi(5/4)).
\]

The previously established exact form is

\[
Q_L(v)=E_\gamma(v)+|J_{-1/2}(0)|^2-\|J_{-1/2}\|_2^2
-2c_0\|v\|_2^2
-2\sum_{n\ge2}\frac{\Lambda(n)}{\sqrt n}\Re C_v(\log n).
\tag{1}
\]

No RH is used in (1). It is valid on the displayed exponential test space by absolutely convergent arithmetic identities.

## 2. Construct the positive prime geometry before estimating it

Choose a real parameter

\[
\frac12<a<2x_*-\frac12.
\tag{2}
\]

Such a choice exists precisely because \(x_*>1/2\). Define the positive quantities

\[
\Gamma_a=\sum_{n\ge2}\frac{\Lambda(n)}{n^{a+1/2}}
=-\frac{\zeta'(a+1/2)}{\zeta(a+1/2)},
\qquad
B_a(t)=\sum_{2\le n\le e^t}\Lambda(n)n^{a-1/2}.
\tag{3}
\]

Define an actual positive prime-delay energy

\[
\mathcal D_a(v)=
\sum_{n\ge2}\Lambda(n)n^{a-1/2}
\|S_{\log n}v-n^{-a}v\|_2^2\ge0.
\tag{4}
\]

This is a Gram form constructed directly from the prime powers. No matrix is factored after assuming its positivity. Its feature map is

\[
v\longmapsto
\left(\sqrt{\Lambda(n)}\,n^{(a-1/2)/2}
   (S_{\log n}v-n^{-a}v)\right)_{n\ge2}
\in\bigoplus_{n\ge2}L^2(0,\infty).
\tag{5}
\]

### Proposition 1: the exact counterterm

For the tests above,

\[
\boxed{
-2\sum_{n\ge2}\frac{\Lambda(n)}{\sqrt n}\Re C_v(\log n)
=\mathcal D_a(v)-\Gamma_a\|v\|_2^2
-\int_0^\infty B_a(t)|v(t)|^2\,dt.
}
\tag{6}
\]

**Proof.** For every \(r>0\),

\[
\frac1r\|S_\ell v-rv\|_2^2
=\frac1r\|S_\ell v\|_2^2+r\|v\|_2^2-2\Re C_v(\ell).
\]

Apply this with \(r=n^{-a}\), multiply by \(\Lambda(n)/\sqrt n\), and sum. Tonelli's theorem gives

\[
\sum_{n\ge2}\Lambda(n)n^{a-1/2}\|S_{\log n}v\|_2^2
=\int_0^\infty\left(\sum_{n\le e^t}\Lambda(n)n^{a-1/2}\right)|v(t)|^2\,dt.
\]

All quantities are finite. If \(A=\sum_j|b_j|\), then
\(\|S_{\log n}v\|_2^2\le A^2n^{-2x_*}/(2x_*)\).
The series with coefficient \(\Lambda(n)n^{a-1/2}\) therefore converges when \(2x_*-a>1/2\); the other series converges when \(a>1/2\). These are (2). The square norm in (4) is bounded by twice the sum of these two convergent contributions. This proves the identity and its domain. ∎

### The resulting complete geometric identity

Combining (1) and (6) yields

\[
\boxed{
Q_L(v)=E_\gamma(v)+|J_{-1/2}(0)|^2+\mathcal D_a(v)
-\|J_{-1/2}\|_2^2
-\int_0^\infty\bigl(2c_0+\Gamma_a+B_a(t)\bigr)|v(t)|^2\,dt.
}
\tag{7}
\]

The weight in the last integral is positive: \(\Gamma_a\ge0\), \(B_a\ge0\), and \(c_0>0\). For the last assertion, monotonicity of the digamma function gives \(\psi(5/4)<\psi(2)=1-\gamma_E<1<\log\pi\).

Thus there are explicit maps into positive Hilbert spaces,

\[
\begin{aligned}
\mathcal C_+(v)&=
\left((J_{\lambda_k}(0),\sqrt{2/\lambda_k}\,H_{\lambda_k})_{k\ge0},
J_{-1/2}(0),
(\sqrt{\Lambda(n)}n^{(a-1/2)/2}(S_{\log n}v-n^{-a}v))_{n\ge2}\right),\\
\mathcal C_-(v)&=
\left(J_{-1/2},\sqrt{2c_0+\Gamma_a+B_a(t)}\,v\right),
\end{aligned}
\]

with

\[
Q_L(v)=\|\mathcal C_+(v)\|^2-\|\mathcal C_-(v)\|^2.
\tag{8}
\]

Every feature is independently defined using the arithmetic and gamma data. The construction is exact, but it is a difference of positive forms. Replacing (8) by \(Q_L=\|\mathcal C_+\|^2\) would discard a nonzero negative term.

## 3. Geometric interpretation: a weighted prime graph

Set \(v(t)=e^{-at}f(t)\). Equation (4) becomes

\[
\mathcal D_a(v)=
\sum_{n\ge2}\frac{\Lambda(n)}{n^{a+1/2}}
\int_0^\infty e^{-2at}|f(t+\log n)-f(t)|^2\,dt.
\tag{9}
\]

This is a genuine positive difference energy on a half-line with prime-power edges of length \(\log n\). The exponential ground state \(v(t)=e^{-at}\), corresponding to constant \(f\), has \(\mathcal D_a(v)=0\). Its original Weil form is \(Q_L(e^{-at})=L(a)/a>0\), an already known one-dimensional fact. Equation (9) does not extend that fact to arbitrary sums without controlling the gamma and counterterm contributions in (7).

The extra multiplication weight \(B_a(t)\) is the exact contribution of the reverse endpoint of each edge on the half-line. It cannot be omitted as a boundary convention.

## 4. An explicit obstruction to a simple domination estimate

The sparse project rates are \(x_j=1+1/(j+1)\). We can take \(a=1\) for every finite prefix, since all these rates exceed one. Let

\[
B_1(t)=\sum_{n\le e^t}\Lambda(n)\sqrt n.
\]

### Proposition 2: the potential is not bounded by the unweighted norm

There is no finite constant \(C\) such that

\[
\int_0^\infty B_1(t)|v(t)|^2\,dt\le C\|v\|_2^2
\tag{10}
\]

for all finite combinations of the sparse project exponentials. This is true without invoking PNT or any unproved hypothesis.

**Proof.** For \(t\ge\log2\), retain the largest power \(2^k\le e^t\). Because \(\Lambda(2^k)=\log2\),

\[
B_1(t)\ge(\log2)2^{k/2}
\ge\frac{\log2}{\sqrt2}e^{t/2}.
\tag{11}
\]

Consider \(w_m(t)=t^me^{-t}\). The elementary gamma integral gives

\[
\frac{\int_0^\infty e^{t/2}|w_m(t)|^2\,dt}{\|w_m\|_2^2}
=\left(\frac43\right)^{2m+1}.
\]

Since \(e^{t/2}\le\sqrt2\) on \([0,\log2]\), (11) implies

\[
\frac{\int_0^\infty B_1(t)|w_m(t)|^2\,dt}{\|w_m\|_2^2}
\ge\frac{\log2}{\sqrt2}
\left(\left(\frac43\right)^{2m+1}-\sqrt2\right)
\longrightarrow\infty.
\tag{12}
\]

To transfer this to the exact sparse test space, take divided differences of the function \(x\mapsto e^{-xt}\) at \(m+1\) distinct sparse nodes tending to one. Multiplying the divided difference by \((-1)^m m!\) yields finite combinations \(v_{m,N}\) converging pointwise to \(w_m\). The integral formula for divided differences gives \(|v_{m,N}(t)|\le t^me^{-t}\), because every node exceeds one. Finally,

\[
B_1(t)\le t\sum_{n\le e^t}\sqrt n\le t e^{3t/2},
\]

so \((1+B_1(t))t^{2m}e^{-2t}\) is integrable. Dominated convergence proves convergence in both norms in (12). Each finite combination belongs to some finite project prefix. The ratios in (12) are therefore approximated arbitrarily closely inside the actual test space, contradicting (10). ∎

This rules out absorbing the explicit counterterm into one fixed multiple of the ordinary \(L^2\) norm. It does **not** rule out a coupled inequality using \(E_\gamma\), the pole functional, and the complete prime-gradient energy together.

## 5. Precise stopping point of this proof attempt

The positive geometry (5)/(9) is constructed, and all mixed entries are accounted for by (7). To deduce positivity, one would still need to prove, on every finite sparse test space,

\[
\|J_{-1/2}\|_2^2+
\int_0^\infty(2c_0+\Gamma_a+B_a(t))|v(t)|^2\,dt
\le E_\gamma(v)+|J_{-1/2}(0)|^2+\mathcal D_a(v).
\tag{13}
\]

By (7), (13) is exactly the original Weil positivity problem in these explicit geometric variables. The available arithmetic identity supplies equality of the full form; it does not prove this inequality. A bound with a constant larger than one, a positive diagonal check, or dropping \(B_a\) would not close the proof. Proposition 2 also excludes the most immediate bounded-potential estimate.

**Outcome:** a concrete independent positive prime-graph construction exists, but its exact arithmetic counterterm survives. This attempt has not produced a direct RH proof. It gives a precise geometric object and a proved obstruction to one proposed way of controlling its counterterm.

## Sources and scope

The input (1) is Proposition 3.2 in the project's `RH_Arithmetic_Theta_Completion.tex`, pinned at public repository commit `694eb35f9144ad223d6f8a6afa7398a116146b1b`, under `research-checkpoints/rh-arithmetic-theta-2026-11-20/release-v0.1/`. The scalar square expansion, Tonelli rearrangement, divided-difference argument, and bounds (11)–(12) are proved above. The earlier difference-of-norms bridge is acknowledged; no literature-novelty claim is made.
