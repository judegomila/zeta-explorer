# Actual pulse preimages: unavoidable cancellation and a Hardy-space defect formula

## Status and scope

This note continues the exact theta boundary-energy calculation. Its main new unconditional result is that the regularized preimages of the actual box pulse necessarily develop unbounded positive and negative mass. This happens independently of RH and rules out closing the argument through the previously proved cone of nonnegative preimages.

A second result identifies the actual right-tail leakage with an orthogonal projection onto a Hardy model space. It provides explicit finite Cauchy-Gram lower bounds for any hypothetical genuine right-half-plane pole, including multiplicities. Neither result proves that the leakage vanishes.

## 1. Setup

Use

\[
F(z)=\xi(1/2+z)=\int_{\mathbb R}\kappa(u)e^{zu/2}\,du,
\quad h_\pm(u)=(1\pm\alpha u/2)\kappa(u),\quad \alpha>0,
\]

\[
A=h_+*,\qquad A^*=h_-*,\qquad
D(z)=F(z)+\alpha F'(z),\quad N(z)=F(z)-\alpha F'(z),
\]

and the Fourier convention

\[
\widehat f(t)=\int_{\mathbb R}f(u)e^{itu/2}\,du,
\qquad \|f\|_2^2=\frac1{4\pi}\int_{\mathbb R}|\widehat f(t)|^2\,dt.
\]

The positive even theta kernel `kappa` is Schwartz, as are `h_+` and `h_-`. Therefore `D(it)` and all its derivatives are Schwartz functions of real `t`. The isolated zeros of `D(it)` have measure zero.

The boundary multiplier

\[
S(it)=\frac{N(it)}{D(it)}=\frac{\overline{D(it)}}{D(it)}
\]

defines a unitary `C_0` on ordinary `L^2(R)`. Let

\[
f_0=\mathbf1_{[0,1]},\qquad g_0=C_0f_0,\qquad T=A^*A,
\]

and define the actual Tikhonov preimages

\[
a_\epsilon=(T+\epsilon I)^{-1}A^*f_0,\qquad\epsilon>0.
\tag{1.1}
\]

Their Fourier transforms are

\[
\widehat a_\epsilon(t)
=\frac{\overline{D(it)}V(it)}{|D(it)|^2+\epsilon},
\qquad
V(z)=\frac{2(e^{z/2}-1)}z.
\tag{1.2}
\]

As proved in the preceding energy note, `Aa_epsilon -> f_0` and `A^*a_epsilon -> g_0` in ordinary `L^2`.

## 2. Main theorem: the actual preimages require unbounded sign cancellation

**Theorem.** As `epsilon` decreases to zero:

\[
\|a_\epsilon\|_2\longrightarrow\infty,
\qquad
\|a_\epsilon\|_1\longrightarrow\infty,
\tag{2.1}
\]

while

\[
\int_{\mathbb R}a_\epsilon(u)\,du
=\frac{F(0)}{F(0)^2+\epsilon}
\longrightarrow\frac1{F(0)}>0.
\tag{2.2}
\]

Each `a_epsilon` is real and Schwartz. Consequently,

\[
\int(a_\epsilon)_+(u)\,du\longrightarrow\infty,
\qquad
\int(a_\epsilon)_-(u)\,du\longrightarrow\infty,
\tag{2.3}
\]

where `a = a_+ - a_-` with both parts nonnegative. In particular, `a_epsilon` changes sign for every sufficiently small `epsilon`.

**Proof.** For fixed `epsilon`, the reciprocal of `|D(it)|^2+epsilon` is smooth with all derivatives bounded. Multiplying it by the Schwartz factor `conjugate(D(it))` and the smooth bounded-derivative function `V(it)` gives a Schwartz function. Fourier inversion shows that `a_epsilon` is Schwartz. The conjugation symmetry of (1.2) makes it real.

At `t=0`, evenness gives `F'(0)=0`, and `V(0)=1`, proving (2.2).

The box transform satisfies

\[
|V(it)|=\frac{4|\sin(t/4)|}{|t|}.
\tag{2.4}
\]

There are infinitely many disjoint intervals of fixed positive length on which `|sin(t/4)| >= 1/2`. On these intervals, the Schwartz bound for `D(it)` implies, for any fixed `M`,

\[
\left|\frac{V(it)}{D(it)}\right|
\ge c_M(1+|t|)^{M-1}
\tag{2.5}
\]

away from the discrete zero set. Thus `V(it)/D(it)` is unbounded and not square integrable. This argument uses the uniform upper Schwartz bound on `D`, and does not assume any lower bound or zero hypothesis.

By (1.2),

\[
|\widehat a_\epsilon(t)|^2
=\frac{|D(it)|^2|V(it)|^2}{(|D(it)|^2+\epsilon)^2}
\uparrow\frac{|V(it)|^2}{|D(it)|^2}
\]

almost everywhere as `epsilon` decreases. Monotone convergence and Plancherel prove the `L^2` divergence in (2.1).

For any prescribed large number `L`, choose a fixed real `t_L` with `D(it_L) != 0` and `|V(it_L)/D(it_L)| > 2L`. Equation (1.2) gives `|a_epsilon_hat(t_L)| > L` for all sufficiently small `epsilon`. Since

\[
\|a_\epsilon\|_1\ge\sup_t|\widehat a_\epsilon(t)|,
\]

the `L^1` divergence follows. Finally,

\[
\int(a_\epsilon)_\pm
=\frac12\left(\|a_\epsilon\|_1
\pm\int a_\epsilon\right)
\]

proves (2.3). This completes the proof.

**Distributional corollary.** The family `a_epsilon` has no limit in the space of tempered distributions, and no sequence with `epsilon -> 0` can converge there. Indeed, convolution by the Schwartz function `h_+` maps every tempered distribution to a smooth function and is continuous as a map into tempered distributions. A hypothetical limit `a` would satisfy `Aa = f_0`, since `Aa_epsilon -> f_0` in `L^2`. This is impossible: the box function does not agree almost everywhere with any smooth function. Thus the obstruction is the inversion of a smoothing operator, independent of the zeta zero question.

### Consequence for the energy strategy

The earlier direct cutoff identity was

\[
\|Q_cA^*a\|_2^2-\|Q_cAa\|_2^2
=-\langle a,\mathcal H_ca\rangle,
\qquad Q_c=\mathbf1_{(c,\infty)},
\]

with an entrywise positive kernel `H_c`. It gives an immediate inequality when `a` is a constant phase times a nonnegative function. The theorem proves that the actual regularized box preimages leave this cone and develop arbitrarily large cancellation. That route cannot reach the actual pulse by simply taking the regularization limit.

The theorem does **not** assert that either separate term in the decomposition

\[
\langle a_\epsilon,\mathcal H_1a_\epsilon\rangle
=\|B_1a_\epsilon\|_2^2
-\langle a_\epsilon,\Delta_1a_\epsilon\rangle
\]

diverges. Their difference has a finite limit, but its sign requires an estimate that survives these highly cancelling preimages.

## 3. Unconditional factorization of the scattering quotient

After canceling common zeros in `N/D`, let `Z_+` be the multiset of its genuine zeros in `Re z > 0`, and `Z_-` the multiset of its genuine poles there. For `a` in that half-plane, put

\[
b_a(z)=\frac{1-z/a}{1+z/\overline a}.
\]

This is the normalized half-plane Blaschke factor with `b_a(0)=1`. Define

\[
B_+(z)=\prod_{a\in Z_+}b_a(z),\qquad
B_-(z)=\prod_{p\in Z_-}b_p(z).
\]

Then, without RH,

\[
\boxed{\qquad S(z)=\frac{B_+(z)}{B_-(z)}.\qquad}
\tag{3.1}
\]

The products are coprime inner functions. Here is the growth audit for (3.1), so bounded type is not silently assumed.

1. Standard xi growth gives `log M_D(R) = O(R log R)` and hence `n_D(R) = O(R log R)` by Jensen's formula. In particular, the reciprocal squares of nonzero zeros are summable.
2. All zeros of `D` lie in a bounded vertical strip. On `Re z >= 1/2`, the xi zero product gives `Re(F'/F)>0`, so `D` has no zero. On a sufficiently far left half-plane, write `z=-u` and use `D(-u)=F(u)(1-alpha F'(u)/F(u))`. The gamma factor, Euler product, and digamma asymptotic give `Re(F'(u)/F(u)) > 1/alpha` uniformly for sufficiently large `Re u`, excluding that half-plane as well.
3. Bounded real parts and the zero count imply the Blaschke sums `sum Re(a)/(1+|a|^2)` for both multisets converge. They also imply absolute convergence of the real parts of the reciprocal zeros in the conjugate-paired Hadamard products.
4. Grouping conjugate zeros in the Hadamard products of `D(-z)/D(z)`, and canceling common factors, therefore gives

   \[
   S(z)=e^{cz}\frac{B_+(z)}{B_-(z)},\qquad c\in\mathbb R.
   \]

   The constant phase is one because all factors and `S` equal one at zero. Imaginary-axis zeros cancel; no simplicity hypothesis is used.
5. If the real parts of the Blaschke zeros are bounded by `A`, then, for real `x>2A`,

   \[
   \frac{|\log|b_a(x)||}{x}
   \le C\frac{\operatorname{Re}a}{x^2+(\operatorname{Im}a)^2}.
   \]

   Dominated convergence using the Blaschke sum proves `log|B_+(x)|/x -> 0` and the same for `B_-`.
6. On the positive real axis, `F'(x)/F(x) ~ (1/2) log(x/(2 pi))`, so `S(x) -> -1` and `log|S(x)|/x -> 0`. Therefore `c=0`.

This establishes (3.1) without assuming that either the original entire function `D` or the quotient is already of bounded type. A genuine pole of `S` lies in `0<Re p<1/2`.

## 4. Exact model-space formula for the actual pulse leakage

Shift the cutoff to zero:

\[
\widetilde f(u)=f_0(u+1)=\mathbf1_{[-1,0]}(u),\qquad
\widetilde g(u)=g_0(u+1)=C_0\widetilde f(u).
\]

The transform of the shifted pulse is

\[
\widetilde V(z)=\int_{-1}^0e^{zu/2}\,du
=\frac{2(1-e^{-z/2})}{z}=e^{-z/2}V(z).
\tag{4.1}
\]

It has no zeros in `Re z>0`.

Let `H^2` mean the right-half-plane Hardy space with boundary norm

\[
\|U\|_{H^2}^2=\frac1{4\pi}\int_{\mathbb R}|U(it)|^2\,dt.
\]

With the chosen plus Fourier sign, it corresponds to physical functions supported on `(-infinity,0]`. Define the model space

\[
K_{B_-}=H^2\ominus B_-H^2.
\]

Since `B_+` is inner, `h=B_+\widetilde V` belongs to `H^2`. Orthogonally decompose

\[
h=B_-h_1+k,\qquad k=P_{K_{B_-}}h.
\]

On the boundary,

\[
S\widetilde V=h_1+\overline{B_-}k.
\]

The second term is orthogonal to `H^2`, since `k` is orthogonal to `B_-H^2`; its norm equals `||k||`. Fourier inversion therefore gives the exact formula

\[
\boxed{\quad
\|\mathbf1_{(1,\infty)}g_0\|_2^2
=\left\|P_{K_{B_-}}(B_+\widetilde V)\right\|_{H^2}^2.
\quad}
\tag{4.2}
\]

Combining this with the actual Tikhonov energy limit identifies the previously uncontrolled correction exactly:

\[
\lim_{\epsilon\downarrow0}
\left[\langle a_\epsilon,\Delta_1a_\epsilon\rangle
-\|B_1a_\epsilon\|_2^2\right]
=\left\|P_{K_{B_-}}(B_+\widetilde V)\right\|_{H^2}^2.
\tag{4.3}
\]

The notation `B_1` on the left denotes the earlier positive Gram operator; it is distinct from the inner functions `B_+` and `B_-` on the right.

## 5. Finite Cauchy-Gram detection bounds

The Hardy evaluation kernel at `p` is

\[
k_p(z)=\frac2{z+\overline p},\qquad
\|k_p\|_{H^2}^2=\frac1{\operatorname{Re}p}.
\]

Every genuine pole `p` of `S` is a zero of `B_-`, so `k_p` belongs to `K_{B_-}`. If `p=sigma+i tau`, projection and Cauchy-Schwarz in (4.2) give

\[
\boxed{\quad
\|\mathbf1_{(1,\infty)}g_0\|_2^2
\ge \sigma\,|B_+(p)\widetilde V(p)|^2>0.
\quad}
\tag{5.1}
\]

The strict inequality uses coprimeness and the zero-free shifted pulse. Its explicit pulse factor is

\[
|\widetilde V(p)|^2
=\frac{4\left(1+e^{-\sigma}
-2e^{-\sigma/2}\cos(\tau/2)\right)}{\sigma^2+\tau^2}.
\tag{5.2}
\]

For any finite set of distinct genuine poles `p_1,...,p_n`, let

\[
G_{ij}=\frac2{p_i+\overline{p_j}},\qquad
v_i=B_+(p_i)\widetilde V(p_i).
\]

This is a positive-definite Cauchy Gram matrix, and the sharper bound is

\[
\boxed{\quad
\|\mathbf1_{(1,\infty)}g_0\|_2^2
\ge v^*G^{-1}v.
\quad}
\tag{5.3}
\]

This formula retains interference between pole modes instead of summing separate one-pole estimates.

For poles of multiplicity `m_i`, include derivative evaluations of orders `r=0,...,m_i-1`. The data and Gram matrix are

\[
v_{i,r}=(B_+\widetilde V)^{(r)}(p_i),
\]

\[
G_{(i,r),(j,s)}
=\frac{2(-1)^{r+s}(r+s)!}
{(p_i+\overline{p_j})^{r+s+1}}.
\tag{5.4}
\]

The same bound holds with this confluent matrix. The signs and factors follow directly by integrating the physical representers `(u/2)^r exp(conjugate(p_i)u/2) 1_(u<=0)`.

If all poles form a finite multiset, (5.3)-(5.4) with all multiplicities give equality. For infinitely many poles, the supremum over finite subsets, with multiplicities, equals the exact leakage in (4.2). Indeed these evaluation kernels span the model space densely: a Hardy function orthogonal to them has all the zeros of `B_-`, and division by their finite Blaschke subproducts followed by the bounded `H^2` limit shows it belongs to `B_-H^2`.

These are diagnostic lower bounds, not a pole-exclusion proof. They can be compared with independent certified upper bounds for the actual pulse leakage.

### No universal positive leakage gap

The model-space formula also shows why a strictly positive upper bound alone
cannot be converted to zero by a generic unitary-operator argument. For the
single inverse Blaschke multiplier `S_p=1/b_p`, with `p` in the right
half-plane, its model space is one dimensional and the pulse leakage is
exactly

\[
L_p=(\operatorname{Re}p)
\left|\frac{2(1-e^{-p/2})}{p}\right|^2>0.
\]

For real `p=sigma` tending to zero this is `L_p ~ sigma -> 0`. For fixed
positive real part and imaginary part tending to infinity it also tends to
zero. Hence these unitary toy multipliers have genuine wrong-side leakage
arbitrarily close to zero. They are not xi multipliers or counterexamples to
RH. They establish only that the unitarity, pulse, and projection framework
has no universal positive gap that could turn a finite numerical upper bound
into exact zero.

For the actual theta multiplier, the new certificate gives
`0 <= ||Q_1 g_0||^2 < 0.124030166`. Together with (5.3), this constrains every
hypothetical finite pole configuration by `v* G^(-1) v < 0.124030166`; it does
not exclude every such configuration or establish a new zero-free height.

## 6. An additional parity inequality

At cutoff zero, the exact kernel is reflection invariant:

\[
H_0(-u,-v)=H_0(u,v).
\]

The known strict convexity of `-log kappa(sqrt(t))` also implies

\[
H_0(u,v)>H_0(u,-v)>0\qquad(u,v>0).
\tag{6.1}
\]

For the proof, put `m=(u+v)/2`, `d=(u-v)/2`, and use the change of variable `s=t^2-m^2` in the same-sign kernel. For the opposite-sign kernel interchange `m` and `d`. The squared arguments in the two products have the same sum, but their squared half-spreads differ by

\[
m^2(s+d^2)-d^2(s+m^2)=uvs>0.
\]

Convexity gives (6.1) after integration. Hence both parity-reduced kernels `H_0(u,v)+H_0(u,-v)` and `H_0(u,v)-H_0(u,-v)` have positive entries on the positive half-line. This is an entrywise result, not a full operator sign. In particular, the positive Gram operator `B_0` is even in its input coordinate and annihilates the odd sector; that sector cannot be controlled by its positive Gram term alone.

## References and attribution

- NIST DLMF, §25.4, for the xi definition and functional equation: https://dlmf.nist.gov/25.4
- Masatoshi Suzuki, *Chains of reproducing kernel Hilbert spaces generated by unimodular functions*, arXiv:2012.11121, for the surrounding Hardy/model-space and xi scattering framework: https://arxiv.org/pdf/2012.11121
- George Csordas, *Fourier Transforms of Positive Definite Kernels and the Riemann xi-Function*, Theorem 4.2(b), for the stronger theta concavity used in §6: https://arxiv.org/pdf/1309.0055

The actual-preimage cancellation theorem, the normalization-specific model-space formula and Cauchy bounds, and the parity deduction are derived explicitly in this note. The canonical-product audit in §3 expands the bounded-strip argument used in the preceding research notes; it does not assume RH.
