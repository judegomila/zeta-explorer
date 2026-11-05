# Fixed window averages and the remaining prime memory bound

Research continuation for Jude Gomila — 21 October 2026

**Outcome:** a certified finite window margin, exact formulas separating inherited state from recent prime charges, and two explicit obstructions to using smoothing as a proof of confinement. The infinite signed-memory bound remains unproved. There is no new zero-free region or RH proof here, and no novelty claim for the window-mean criterion.

For the response \(\Psi\) defined in `REPORT.md`, the new finite result is

\[
W_1(t):=\int_t^{t+1}\Psi(u)\,du>0.0431381
\quad\text{for }0\le t\le\log(10^6)-1.
\tag{1}
\]

This is a quantitative margin inside the already certified range, not an extension of that range. The main analytic finding is that averaging retains the full signed prime history. It therefore improves finite stability without supplying the missing infinite bound.

## 1. Which filters preserve the proposed zero detector

Put \(F(w)=\xi(1/2+w)\), \(Z=F'/F\), and recall Suzuki's identity [1]
\(\mathcal L\Psi(w)=Z(w)/w^2\) for \(\Re w>1/2\).

Let K be a real finite measure supported on \([0,L]\), with total mass one, and define

\[
Y_K(t)=\int_0^L\Psi(t+u)\,dK(u),\qquad
M_K(w)=\int_0^L e^{wu}\,dK(u).
\]

Changing the order of integration gives

\[
\mathcal L Y_K(w)=M_K(w)\frac{Z(w)}{w^2}-E_K(w),
\tag{2}
\]
\[
E_K(w)=\int_0^L e^{wu}\int_0^u e^{-wv}\Psi(v)\,dv\,dK(u).
\]

The function \(E_K\) is entire because all its integration variables range over compact intervals. A zero \(\lambda\) of F, with multiplicity m and \(\Re\lambda>0\), therefore produces a pole of the filtered transform with residue

\[
\frac{mM_K(\lambda)}{\lambda^2}.
\tag{3}
\]

The relevant filter requirement is **\(M_K(w)\ne0\) in the right half-plane**. Positivity of K alone does not establish it.

For a fixed uniform box of width h,

\[
W_h(t)=\frac1h\int_t^{t+h}\Psi(u)du,\qquad
M_h(w)=\frac{e^{hw}-1}{hw}.
\]

Its only zeros are nonzero integer multiples of \(2\pi i/h\), all on the imaginary axis. More quantitatively, if \(w=b+i\gamma\) with b>0,

\[
|M_h(b+i\gamma)|\ge
\frac{e^{bh}-1}{h\sqrt{b^2+\gamma^2}}>0.
\tag{4}
\]

Every fixed finite convolution of such boxes also preserves all off-axis poles. It can attenuate their amplitudes strongly, but does not change the exponent b of a mode \(e^{(b+i\gamma)t}\).

### One-sided strip criterion

For fixed h>0 and \(\beta\ge0\),

\[
\boxed{W_h(t)\ge-Ce^{\beta t}\text{ eventually}
\quad\Longrightarrow\quad
|\Re\rho-\tfrac12|\le\beta\text{ for every nontrivial zero }\rho.}
\tag{5}
\]

To prove this, choose any \(\alpha>\beta\). The negative part of \(W_h\) has a finite Laplace integral at \(\alpha\). The nonnegative-transform abscissa argument in `GLOBAL_TAIL.md`, applied to (2), makes \(\mathcal L W_h\) holomorphic in \(\Re w>\alpha\): the right side has no singularity at a positive real abscissa because F is positive on the real axis. Equation (4) excludes cancellation of any zero pole there. Let \(\alpha\downarrow\beta\), and use reflection symmetry. A polynomial lower bound on \(W_h\) is sufficient for RH by the same argument, using every \(\alpha>0\).

Thus a target \(\beta<3/8\) would give a strip with upper edge below 7/8. No such exponential estimate has been established in this computation.

## 2. Why fixed windows have a margin under RH

Under RH the zero ordinates \(\gamma\) in Suzuki's absolutely convergent zero sum are real, and termwise averaging gives

\[
W_h(t)=\sum_\gamma\frac{
1-\operatorname{sinc}(\gamma h/2)\cos(\gamma(t+h/2))}{\gamma^2},
\qquad\operatorname{sinc}x=\frac{\sin x}{x}.
\]

Consequently,

\[
W_h(t)\ge\mu_-(h):=
\sum_\gamma\frac{1-|\operatorname{sinc}(\gamma h/2)|}{\gamma^2}>0.
\tag{6}
\]

Strictness follows from \(|\sin x|<|x|\) for nonzero real x; convergence follows from \(\sum_\gamma\gamma^{-2}<\infty\). This proves a conditional margin, not an unconditional tail estimate. The fixed-window margin and the bounded-below RH criterion are also explicitly described in the prior preprint [2].

One possible fixed filter design is to convolve boxes of widths \(h_j=2\pi/\gamma_j\) for finitely many independently verified on-line ordinates. Its multiplier vanishes at those known line modes but nowhere in \(\Re w>0\). Such a construction removes selected on-line oscillations while retaining every off-line pole. Implementing exact notches numerically would require certified ordinate intervals and residual bounds. It still leaves the unknown-zero tail, and its order must remain fixed in a global inference.

## 3. Exact prime formulas and inherited state

Let \(q_n=\Lambda(n)/\sqrt n\), \(t_n=\log n\), and \(x_+=\max(x,0)\). Direct integration gives

\[
W_h(t)=\frac1h\int_t^{t+h}A(u)du
-\sum_{n\le e^{t+h}}\frac{q_n}{2h}
\left[(t+h-t_n)_+^2-(t-t_n)_+^2\right].
\tag{7}
\]

For t>0, let \(v(t^+)=\Psi'(t^+)\). Using the smooth acceleration
\(a(u)=e^{u/2}-e^{-u/2}/(e^{2u}-1)\) and its downward impulse jumps gives the more informative identity

\[
\boxed{
W_h(t)=\Psi(t)+\frac h2v(t^+)
+\frac1{2h}\int_t^{t+h}(t+h-u)^2a(u)du
-\frac1{2h}\sum_{t<t_n\le t+h}q_n(t+h-t_n)^2.}
\tag{8}
\]

The first two terms contain the entire inherited prime history. Only the last two terms are confined to the recent window. At a prime event the right derivative puts that event into the inherited slope, avoiding double counting.

For an old prime power with \(t_n\le t\), the weight in (7) is simply
\(q_n(t+h/2-t_n)\). Averaging does not eliminate that old contribution. A bound on primes inside each recent window must therefore be accompanied by control of the inherited state.

The finite audit makes the cancellation visible:

| Block starting at t | Inherited state \(\Psi+v/2\) | Smooth recovery | New prime charge | Window mean |
|---|---:|---:|---:|---:|
| 5.31 | −0.167523896 | 2.699477791 | 2.487207062 | 0.044746832 |
| \(\log(10^6)-1\), to displayed precision | −0.187979516 | 115.101423736 | 114.868482724 | 0.044961495 |

The last row is evaluated at the lower endpoint of the interval enclosure of \(\log(10^6)-1\), differing from the exact endpoint by less than \(10^{-46}\). The numerical result is inherited state plus recovery minus charge. Bounding recovery and charge separately by their magnitudes would discard the information that keeps the result small.

## 4. The exact one-sided prime memory target

Define the Chebyshev error
\(E(x)=\psi_C(x)-x\), where \(\psi_C(x)=\sum_{n\le x}\Lambda(n)\).
Stieltjes integration by parts gives

\[
\sum_{n\le e^t}q_n(t-\log n)
=\int_1^{e^t}\psi_C(x)x^{-3/2}
\left(1+\tfrac12(t-\log x)\right)dx.
\]

Separating the contribution \(\psi_C(x)=x+E(x)\) yields

\[
\Psi(t)=b(t)-\int_1^{e^t}E(x)x^{-3/2}
\left(1+\tfrac12(t-\log x)\right)dx,
\]
\[
b(t)=4e^{-t/2}-4+(c+1)t+C-J_2(t).
\]

Averaging again gives

\[
W_h(t)=\bar b_h(t)-I_h(t),\qquad
I_h(t)=\int_1^{e^{t+h}}E(x)x^{-3/2}K_{t,h}(\log x)dx,
\tag{9}
\]

where \(\bar b_h=h^{-1}\int_t^{t+h}b(u)du\) and the positive kernel is

\[
K_{t,h}(y)=
\begin{cases}
1+\tfrac12(t-y)+h/4,&y\le t,\\
(t+h-y)/h+(t+h-y)^2/(4h),&t<y\le t+h,\\
0,&y>t+h.
\end{cases}
\]

The required one-sided arithmetic estimate can now be stated without a vortex metaphor:

\[
\boxed{I_h(t)\le\bar b_h(t)+Ce^{\beta t}
\quad\text{for every sufficiently large }t.}
\tag{10}
\]

Together with (5), this gives a strip of half-width \(\beta\). The unproved assertion is (10), not its implication for zeros. The positivity of K does not fix the sign of the oscillating error E.

### What the available absolute bound actually gives

Applying a fixed box to the unconditional bound used in this package,
\(\Psi(t)=O(\exp(t/2-c\sqrt t))\), preserves the coefficient 1/2 of t in its exponent. For every fixed \(\beta<1/2\),

\[
\exp(t/2-c\sqrt t)/\exp(\beta t)\longrightarrow\infty.
\]

Therefore this estimate, after smoothing, does not provide (5) for any such \(\beta\). This is a limitation of the specific imported bound and argument; it is not a survey claim about the strongest results elsewhere.

A sufficient mean-square substitute would be

\[
\int_X^{2X}|E(x)|^2dx\ll X^{2+2\beta}(\log X)^A
\quad\text{uniformly for large }X.
\tag{11}
\]

Indeed, Cauchy–Schwarz on each dyadic block bounds its contribution to (9) by
\(O_h(X^\beta(\log X)^{A/2}(1+t+h-\log X))\). Summing the blocks gives exponential order at most \(\beta\) for \(I_h\); polynomial factors are absorbed using \(\beta+\varepsilon\), then \(\varepsilon\downarrow0\). For \(\beta=0\) the bound is polynomial in t and implies RH. This explains why assuming a sufficiently strong global variance bound would simply import a zero-confinement result. No unconditional estimate of the required strength is supplied here.

The more economical target remains the signed, one-sided integral (10). It does not demand pointwise smallness of E or the full two-sided mean-square estimate (11).

## 5. Two explicit ways smoothing can manufacture false positivity

### Positive weights can erase an off-axis pole

Let \(K=(2/3)\delta_0+(1/3)\delta_2\). This is a positive probability measure, but

\[
M_K(w)=\frac{2+e^{2w}}3
\]

vanishes at \(\lambda=(\log2+i\pi)/2\), whose real part lies strictly between 0 and 1/2. For the real signal

\[
f(t)=1+\Re(e^{\lambda t}),
\]

the filter produces \(Y_K(t)=1\) for every t, despite the exponentially growing oscillation and the poles at \(\lambda,\bar\lambda\) in its original Laplace transform. Convolving K with a positive box density yields a positive compactly supported density with the same offending multiplier zeros. Consequently positivity of an averaging density, or its interpretation as a probability distribution, cannot replace the nonvanishing check in (3).

### Increasing the number of safe averages with time can hide growth

Let \(B_1 f(t)=\int_t^{t+1}f(u)du\) and

\[
f(t)=1+e^{t/10}\cos(100t),\qquad r(t)=\lceil t/10\rceil+1.
\]

Each fixed iterate \(B_1^r\) preserves the off-axis poles. Nevertheless,

\[
|M_1(1/10+100i)|
\le\frac{e^{1/10}+1}{\sqrt{100^2+1/100}}
<4/100<e^{-1}.
\]

Thus

\[
\boxed{(B_1^{r(t)}f)(t)\ge1-e^{t/10-r(t)}
\ge1-e^{-1}>1/2\quad(t\ge0).}
\tag{12}
\]

The unsmoothed signal has arbitrarily large negative excursions, but increasing the averaging order with t makes the resulting values uniformly positive. Those values are not the output of one fixed filter, so the transform argument (2) does not apply to them. Extending a finite certificate by changing the filter cannot be turned into an infinite zero-exclusion theorem without an additional uniform argument.

Both examples are signal counterexamples to invalid inference rules, not counterexamples to RH. They explain why a numerical relaxation process must be checked for whether it retains the information about off-axis poles.

## 6. Finite verification and its scope

`window_audit.py` reconstructs three prime moments from the existing 78,734 certified prime-power events:

\[
S(x)=\sum_{t_n\le x}q_n,\quad
T(x)=\sum_{t_n\le x}q_nt_n,\quad
U(x)=\sum_{t_n\le x}q_nt_n^2.
\]

The positive-part square sum in (7) is \(x^2S(x)-2xT(x)+U(x)\). An antiderivative of A is

\[
8e^{t/2}-8e^{-t/2}+(C-8)t+ct^2/2+J_3(t).
\]

All operations use the outward-rounded decimal interval engine from the original certificate. Positive geometric tail bounds enclose \(J_j(t)\) at t>0. At t=0, the \(J_3\) tail after 10,000 terms is bounded above and below by the integral test. Event membership is accepted only when its logarithm interval is separated from the query endpoint; ambiguous membership would stop the calculation.

The audit evaluates 1,283 grid points with gaps at most 0.01. The smallest grid lower endpoint is
\(0.0447468323121082\ldots\), at t=5.31. It establishes \(0\le\Psi\le M\) throughout the underlying finite interval, with \(M<0.321739605\), using the original positivity certificate, initial interval enclosures, and convexity between prime events. Consequently

\[
|W_1'(t)|=|\Psi(t+1)-\Psi(t)|\le M.
\]

The maximum distance to a grid point is at most 0.005, apart from a separately covered interval-rounding remainder below \(10^{-46}\). Subtracting this Lipschitz allowance gives the rigorous continuum lower endpoint

\[
0.043138134288212981357144750467378397465995649018708.
\]

Four separate checks integrate the response event by event and overlap the moment-formula enclosures. Selected blocks verify (8) by interval residuals containing zero. These checks validate the implementation but are not proof-assistant verification of Python or its runtime.

Run `python window_audit.py`. Results are in `window_audit.json` and `window_values.csv`. Optional `plot_window_audit.py` produces the comparison figure using Matplotlib. The diagram and floating-point plotting are not used to establish (1).

## 7. Literature overlap and remaining task

Suzuki [1] supplies the underlying response and transform. Mittermeier's October 19, 2026 preprint record [2] explicitly describes fixed-window margins and a bounded-below RH criterion, as well as a substantially longer finite window certificate. The record was read; its PDF could not be retrieved in this session, so its detailed proof and computation were not independently audited. Its reported numerical ranges are not imported into this certificate. The present derivations should not be presented as a new discovery of the window-mean criterion.

The concrete next analytic target is (10): a uniform one-sided bound on the signed Chebyshev memory, with a fixed admissible filter. The finite margin and the two smoothing counterexamples sharpen what a valid proof must accomplish. Neither supplies that arithmetic bound.

## References

1. M. Suzuki, *Aspects of the screw function corresponding to the Riemann zeta-function*, https://arxiv.org/abs/2206.03682.
2. R. A. Mittermeier, *A Zero-Side Positivity Certificate for Suzuki's Screw Function through 4·10²⁰: Window Means and One-Sided Criteria — Companion to Part 5*, preprint, 19 October 2026. https://zenodo.org/records/23481975. Used to identify overlap from the public record, not as an independently verified numerical input.
