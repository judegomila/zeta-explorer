# Exact odd-kernel obstruction and a positive comparison class

Research derivation, 14 November 2026. This note continues the odd-sector question isolated in PR #56. It provides an exact counterexample to a proof using only the stronger convexity of the kernel, including an explicit smooth oscillatory test. The obstruction survives a specified perturbation giving double-exponential tails and an order-one Laplace transform. None of these controls is the Jacobi theta kernel.

## 1. Normalization and conclusion

For an even positive rapidly decreasing kernel `k`, fix `alpha=1` and use

\[
H_0(u,v)=2\int_{|(u+v)/2|}^{\infty}
 t\,k\!\left(t-\frac{u-v}{2}\right)
 k\!\left(t+\frac{u-v}{2}\right)dt,
\qquad H_-(x,y)=H_0(x,y)-H_0(x,-y).
\]

The associated convolution kernels are `h±(u)=(1±u/2)k(u)`. If `A` is convolution by `h+` and `Q` is the right-half-line projection, then

\[
H=A^*QA-AQA^*.
\]

The unitary odd embedding `p -> a`, with `a(x)=p(x)/sqrt(2)` and `a(-x)=-p(x)/sqrt(2)`, identifies its odd restriction with `H_-` on `L²(0,infinity)`.

The strict convexity of `V(t)=-log k(sqrt(t))` proves `H_-(x,y)>0` for `x,y>0`, as derived in PR #56 from the known theta concavity. It cannot establish positivity for arbitrary oscillatory tests: the explicit control below satisfies that strict convexity but has a negative quadratic form, and every two-node odd Gram at distinct positive nodes is indefinite.

## 2. Exact polynomial-Gaussian family

Let

\[
k(u)=(1+a u^2+b u^4)e^{-\lambda u^2},
\qquad a,b,\lambda>0.
\]

Set `P(t)=1+a t+b t²`. Then

\[
V(t)=\lambda t-\log P(t),\qquad
V''(t)=\frac{a^2-2b+2ab t+2b^2t^2}{P(t)^2}.
\]

Thus `a²>=2b` gives convexity, with strictness for `t>0`; `a²>2b` gives strictness even at zero.

Direct Gaussian integration gives a finite-rank odd kernel:

\[
\boxed{
H_-(x,y)=e^{-\lambda(x^2+y^2)}
\begin{pmatrix}x&x^3\end{pmatrix}
M\begin{pmatrix}y\\y^3\end{pmatrix},
}
\]

where

\[
M=\begin{pmatrix}
\dfrac{a^2\lambda^2+2ab\lambda+3b^2-2b\lambda^2}{\lambda^4}
&\dfrac{ab}{\lambda^2}\\[4pt]
\dfrac{ab}{\lambda^2}&\dfrac{2b^2}{\lambda^2}
\end{pmatrix}.
\]

Its determinant is

\[
\boxed{
\det M=\frac{b^2}{\lambda^6}
\bigl[a^2\lambda^2+4ab\lambda+6b^2-4b\lambda^2\bigr].
}
\]

To verify the integration, write `m=(x+y)/2`, `d=(x-y)/2` and expand `P((t-d)²)P((t+d)²)` into even powers of `t`. For each monomial the required identity is

\[
2\int_{|m|}^{\infty}t^{2j+1}e^{-2\lambda t^2}dt
=e^{-2\lambda m^2}\frac{j!}{(2\lambda)^{j+1}}
\sum_{r=0}^{j}\frac{(2\lambda m^2)^r}{r!}.
\]

Multiply by `exp(-2lambda d²)`, substitute `m,d`, and subtract the value at `y -> -y`. All odd features above degree three cancel. The companion symbolic audit carries out exactly these finite polynomial operations.

Under `a²>=2b`, the diagonal entries of `M` are positive. Odd-sector PSD therefore requires the additional condition

\[
a^2\lambda^2+4ab\lambda+6b^2-4b\lambda^2\ge0,
\]

which is stronger than the convexity condition. This is an explicit missing higher-order restriction in a fully solvable model.

## 3. An exact counterexample with a smooth L² witness

Take

\[
k_0(u)=\left(1+\frac{u^2}{10}+\frac{u^4}{300}\right)e^{-u^2}.
\]

This is positive, even, smooth and faster than every linear exponential. The corresponding convexity is explicit:

\[
\boxed{
V_0''(t)=\frac{2(t^2+30t+150)}{(t^2+30t+300)^2}>0
\quad(t\ge0).
}
\]

It is also decreasing on the positive axis: `V0'(t)>0`, because `t²+30t+300-(2t+30)=t²+28t+270>0`.

Nevertheless,

\[
M=\begin{pmatrix}121/30000&1/3000\\1/3000&1/45000\end{pmatrix},
\qquad \det M=-\frac{29}{1350000000}<0.
\]

Equivalently,

\[
\boxed{
H_-(x,y)=\frac{xy\,e^{-x^2-y^2}}{90000}
\bigl[363+30(x^2+y^2)+2x^2y^2\bigr].
}
\]

Every entry is strictly positive for positive `x,y`. For any distinct positive nodes `x,y`, however,

\[
\det\begin{pmatrix}H_-(x,x)&H_-(x,y)\\H_-(y,x)&H_-(y,y)\end{pmatrix}
=e^{-2(x^2+y^2)}x^2y^2(y^2-x^2)^2\det M<0.
\]

At nodes `1,2`, coefficients `(19e/3,-8e^4/3)` have feature moments `(1,-15)` and exact energy `-29/30000`. The determinant of that two-node Gram is `-29e^-10/37500000`. In the full-line kernel this odd test uses four nodes `-2,-1,1,2`, so it does not contradict the earlier two-point theorem for the full kernel.

There is also an explicit smooth square-integrable witness, avoiding point masses:

\[
p(x)=e^{-x^2}x(65-84x^2),\qquad x>0.
\]

Its two feature moments are

\[
\int_0^{\infty}p(x)e^{-x^2}
\begin{pmatrix}x\\x^3\end{pmatrix}dx
=\frac{\sqrt\pi}{4\sqrt2}\begin{pmatrix}1\\-15\end{pmatrix}.
\]

Therefore

\[
\boxed{\langle p,H_-p\rangle=-\frac{29\pi}{960000}<0.}
\]

This witness changes sign once within the positive half-line. It lies outside the constant-phase nonnegative class proved in PR #56.

The Laplace transform supplies a separate exact check:

\[
\int_{\mathbb R}k_0(u)e^{zu/2}du
=\frac{\sqrt\pi}{76800}e^{z^2/16}
\bigl(z^4+528z^2+80832\bigr).
\]

Its polynomial factor has `z²=-264±8i sqrt(174)`, giving an off-axis quartet. More generally, the discriminant of the quadratic polynomial in `z²` in the polynomial-Gaussian family has the same sign as `det M`. The odd energy detects that obstruction exactly in this model.

## 4. Explicit double-exponential/order-one strengthening

The Gaussian example has an order-two Laplace transform. That growth difference is not essential to the obstruction. Define

\[
\boxed{k_\varepsilon(u)=k_0(u)e^{-\varepsilon\cosh u},
\qquad \varepsilon=10^{-9}.}
\]

The kernel is positive, even and smooth, and has double-exponential tails. Moreover

\[
V_\varepsilon(t)=V_0(t)+\varepsilon\cosh\sqrt t.
\]

The second derivative of `cosh sqrt(t)=sum t^j/(2j)!` is nonnegative on `t>=0`, so strict convexity is retained. Hence the odd kernel still has strictly positive entries.

The same oscillatory test still has strictly negative energy. This can be proved with elementary operator bounds, not an unchecked numerical perturbation.

Let `A_epsilon` be the corresponding convolution operator and `H_epsilon=A_epsilon* Q A_epsilon-A_epsilon Q A_epsilon*`. Set

\[
M_0=\int_{\mathbb R}|1+u/2|k_0(u)du,
\quad
N_0=\int_{\mathbb R}|1+u/2|k_0(u)\cosh u\,du.
\]

The bound `|1+u/2| <= (5+u²)/4` and exact Gaussian moments give

\[
M_0\le\frac{187\sqrt\pi}{128}<3,
\qquad
N_0\le\frac{40477\sqrt\pi e^{1/4}}{25600}<5.
\]

For the second loose inequality, `sqrt(pi)<2` and `e^(1/4)<4/3` already suffice. By `1-e^-v<=v`, Young's inequality and `k_epsilon<=k_0`,

\[
\|A_\varepsilon-A_0\|\le\varepsilon N_0,
\quad \|A_\varepsilon\|,\|A_0\|\le M_0,
\]

\[
\|H_\varepsilon-H_0\|
\le2(\|A_\varepsilon\|+\|A_0\|)
\|A_\varepsilon-A_0\|
<60\varepsilon.
\]

The odd restriction obeys the same bound. For the fixed test,

\[
\|p\|_2^2=\frac{1325}{4}\sqrt{\frac\pi2}<500.
\]

Thus, using `pi>3`,

\[
\begin{aligned}
\langle p,H_{\varepsilon,-}p\rangle
&<-\frac{29\pi}{960000}+30000\varepsilon\\
&<-\frac{29}{320000}+\frac{3}{100000}
=-\frac{97}{1600000}<0.
\end{aligned}
\]

Finally the Laplace transform is entire of order one. A direct bound uses `cosh u>=e^|u|/2`: after `v=e^|u|`, the maximum-modulus estimate reduces to a gamma-type integral with parameter proportional to `|z|`, giving `log M(R)=O(R log(R+2))`. Along positive real `z=R`, integration over a fixed-width neighborhood of `u=log(R/epsilon)` gives a matching positive lower scale `c R log R` for sufficiently large `R`; the Gaussian factor costs only `O((log R)²)`. Thus the order is exactly one.

This control meets positivity, evenness, strong convexity, double-exponential decay and order-one transform growth, yet violates odd-sector positivity. It does not preserve the Jacobi theta integer-square coefficient structure. Any successful theta argument must use information beyond those shared properties.

## 5. A genuine positive comparison class

An independently derived and cross-checked positive class is

\[
k(u)=e^{-a u^4-bu^2},\qquad a>0,\ b\in\mathbb R.
\]

With `q=t²-m²`, direct expansion gives

\[
\boxed{
H_-(x,y)=2k(x)k(y)\int_0^{\infty}
e^{-2a q^2-2bq}
e^{-4aqx^2}e^{-4aqy^2}
\sinh(4aqxy)\,dq.
}
\]

Indeed the sum of fourth powers in the same-sign integrand is

\[
x^4+y^4+2q^2+4q(x^2+y^2-xy),
\]

and the opposite-sign integrand changes `-xy` to `+xy`. Expanding `sinh` into odd powers gives an actual positive Gram representation with features proportional to

\[
k(x)e^{-4aqx^2}x^{2n+1},\qquad n\ge0,
\]

and nonnegative weights

\[
2e^{-2aq^2-2bq}\frac{(4aq)^{2n+1}}{(2n+1)!}\,dq.
\]

Compactly supported tests justify the series and integration directly; boundedness extends the resulting positive form to `L²`. This identifies a specific factorization property that convexity by itself does not supply. It should be used as a comparison model only after proving a bound for the complete actual theta remainder, including directions with small model energy.

## 6. Consequence for the actual theta attack

The counterexample makes a precise distinction: the PR #56 positive-entry theorem is correct, but it cannot be upgraded to all-test positivity using only its convexity input, even after adding theta-like growth and decay. The quartic class shows what a real positive factorization would look like.

A useful next estimate must therefore retain the special theta series or an exact transform of it, and must control the oscillatory remainder in an energy norm that is nonzero on the test directions at issue. An absolute pointwise envelope or a finite collection of positive entries cannot perform that step.

## Provenance

- Kernel and operator normalization: frozen Math Explorer `theta_boundary_energy.md`, commit `69d4049f289217812051188378a0a9f3f061a169`.
- The convexity-based positive-entry result is derived in the current PR #56 annulus note from Csordas, *Fourier Transforms of Positive Definite Kernels and the Riemann xi-Function*, [arXiv:1309.0055](https://arxiv.org/pdf/1309.0055), Theorem 4.2(b).
- The counterexample, exact witness, operator perturbation bounds and finite polynomial calculations above are explicit derivations. They make no claim about an off-axis zero of actual xi and no claim of novelty in the literature.
