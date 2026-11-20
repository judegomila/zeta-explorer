# Folding the twin reflection: an exact heat route and two cutoff obstructions

Date: 20 November 2026.

## Status and purpose

This note gives exact analytic identities, a classical RH-equivalent positivity condition, and two proved obstructions to a tempting finite-prime completion. It does **not** prove that positivity condition. It does not assume the correctness of the external Alpöge formalization.

The useful role of the twin reflection here is precise: it removes the duplication of centered zeros under \(z\mapsto-z\), converts the problem to a logarithmic derivative in the squared variable, and separates the existing Weil/Pick matrix into two resolvent kernels. It does not supply positivity of those kernels.

We use \(\mathcal T\) for the heat trace. This is a different object from Suzuki's screw function, which is sometimes denoted by \(\Psi\).

## 1. The branch-free fold

Use the normalization from the main manuscript:

\[
\xi(s)=\tfrac12s(s-1)\pi^{-s/2}\Gamma(s/2)\zeta(s),\qquad
F(z)=\xi(\tfrac12+z),\qquad L(z)=F'(z)/F(z).
\]

The function \(F\) is real entire, even, of order one, and \(F(0)>0\). If
\(F(z)=\sum_{k\ge0}a_kz^{2k}\), define

\[
H(u)=\sum_{k\ge0}a_ku^k.
\]

Thus \(H(z^2)=F(z)\). The notation \(H(u)=F(\sqrt u)\) is convenient but introduces **no choice of branch**. The power series is the definition. Also
\(M_H(r)=M_F(\sqrt r)\), so \(H\) has order \(1/2\).

Let \(\rho\) denote a centered zero of \(F\), counted with multiplicity. Choose one representative of each pair \(\{\rho,-\rho\}\), and put \(\lambda=\rho^2\). The genus-zero Hadamard product gives

\[
H(u)=H(0)\prod_{\{\rho,-\rho\}}
\left(1-\frac{u}{\rho^2}\right),\qquad
\sum_{\{\rho,-\rho\}}\frac1{|\rho|^2}<\infty.
\tag{1}
\]

There is no additional exponential factor: the order of \(H\) is less than one. Therefore

\[
m(u):=\frac{H'(u)}{H(u)}
=\frac{L(\sqrt u)}{2\sqrt u}
=\sum_{\{\rho,-\rho\}}\frac1{u-\rho^2},
\tag{2}
\]

locally uniformly away from its poles. The formula at \(u=0\) is interpreted by analytic continuation. The equality of the zero multiplicities in (1) follows because \(z\mapsto z^2\) is locally invertible at every nonzero zero of \(F\).

**No RH assumption has entered.** A noncritical quartet
\(\rho,-\rho,\bar\rho,-\bar\rho\) becomes a pair of conjugate, generally nonreal zeros \(\rho^2,\bar\rho^2\) of \(H\). Replacing these squared zeros by positive real ordinates at this stage would assume the conclusion.

### Proposition 1: the Stieltjes criterion

RH is equivalent to the existence of a positive measure \(\mu\) on \([0,\infty)\), with
\(\int(1+a)^{-1}\,d\mu(a)<\infty\), such that

\[
m(u)=\int_{[0,\infty)}\frac{d\mu(a)}{u+a}\qquad(u>0).
\tag{3}
\]

**Proof.** Under RH, \(\rho=i\gamma\), so (2) becomes (3) with
\(\mu=\sum_{\gamma>0}m_\gamma\delta_{\gamma^2}\). Conversely, (3) defines a holomorphic function on \(\mathbb C\setminus(-\infty,0]\). It agrees with the meromorphic function \(H'/H\) on the positive real axis, so uniqueness of meromorphic continuation forbids a pole of \(H'/H\) off that cut. Every zero of \(H\) produces such a pole with its positive integer multiplicity as residue. Since \(H(0)>0\), all its zeros must be strictly negative. Their square roots are purely imaginary, which is RH. \(\square\)

This is an equivalence, not an independent construction of the positive measure.

## 2. Exact decomposition of the existing Weil/Pick matrix

For distinct real rates \(x_i>1/2\), let \(u_i=x_i^2\), \(D=\operatorname{diag}(x_i)\), and retain the project's matrix

\[
P_{ij}=\frac{L(x_i)+L(x_j)}{x_i+x_j}.
\]

Define the two divided-difference kernels

\[
A(u,v)=-\frac{m(u)-m(v)}{u-v},\qquad
B(u,v)=\frac{u m(u)-v m(v)}{u-v},
\tag{4}
\]

with diagonal values \(A(u,u)=-m'(u)\) and \(B(u,u)=m(u)+um'(u)\).

### Proposition 2: two-channel identity

For every such finite configuration, unconditionally,

\[
\boxed{P=2(DAD+B).}
\tag{5}
\]

**Proof.** Substitute \(L(x)=2xm(x^2)\) and use

\[
xyA(x^2,y^2)+B(x^2,y^2)
=\frac{xm(x^2)+ym(y^2)}{x+y}.
\]

The diagonal follows by continuity. \(\square\)

Under RH, the two channels are genuine Gram kernels:

\[
A(u,v)=\sum_{\gamma>0}\frac{m_\gamma}{(u+\gamma^2)(v+\gamma^2)},\qquad
B(u,v)=\sum_{\gamma>0}\frac{m_\gamma\gamma^2}{(u+\gamma^2)(v+\gamma^2)}.
\tag{6}
\]

These two formulas separate the numerator \(xy+\gamma^2\) in the contribution of a reflected zero pair. They explain exactly how the reflection enters the Gram structure.

An equivalent algebraic description uses
\(J_{ij}=(L(x_i)-L(x_j))/(x_i-x_j)\), with \(J_{ii}=L'(x_i)\):

\[
P-J=4DAD,\qquad P+J=4B.
\tag{7}
\]

There is no implication that a single finite positive matrix \(P\) makes both \(P-J\) and \(P+J\) positive. Their positivity still needs proof.

### An explicit rank-two defect

A nonreal squared zero \(\lambda=\alpha+i\beta\), \(\beta\ne0\), and its conjugate contribute

\[
A_\lambda(u,v)=2\operatorname{Re}\frac1{(u-\lambda)(v-\lambda)}
=2\bigl(r(u)r(v)-s(u)s(v)\bigr),
\]

where
\[
r(u)=\frac{u-\alpha}{(u-\alpha)^2+\beta^2},\qquad
s(u)=\frac{\beta}{(u-\alpha)^2+\beta^2}.
\]

For two distinct real nodes,

\[
\det[A_\lambda(u_i,u_j)]_{i,j=1}^2
=-\frac{4\beta^2(u_1-u_2)^2}
{\bigl((u_1-\alpha)^2+\beta^2\bigr)^2
 \bigl((u_2-\alpha)^2+\beta^2\bigr)^2}<0.
\tag{8}
\]

Thus the fold compresses a noncritical quartet to a rank-two form with one positive and one negative direction. Other zero contributions can mask that direction on a given finite set; (8) is not a claim that every full two-node zeta matrix detects a hypothetical quartet.

## 3. The heat trace and the exact positivity requirement

Define, without assuming RH,

\[
\mathcal T(t)=\sum_{\{\rho,-\rho\}}e^{\rho^2t},\qquad t>0.
\tag{9}
\]

This is real: nonreal squared zeros occur with their conjugates. If \(\rho=\sigma+i\gamma\), the unconditional zero strip gives
\(\operatorname{Re}(\rho^2)=\sigma^2-\gamma^2\le1/4-\gamma^2\). The zero-counting bound \(N(T)=O(T\log(2+T))\) therefore gives absolute and locally uniform convergence in \(t>0\), also after every fixed number of differentiations. In particular, \(\mathcal T\in C^\infty(0,\infty)\).

For real \(u>1/4\), absolute Fubini gives

\[
\int_0^\infty e^{-ut}\mathcal T(t)\,dt
=\sum_{\{\rho,-\rho\}}\frac1{u-\rho^2}=m(u).
\tag{10}
\]

Indeed, the sum of the absolute integrals is bounded by
\(\sum_\rho (u-\operatorname{Re}\rho^2)^{-1}<\infty\).

### Proposition 3: complete monotonicity of the heat trace

RH is equivalent to

\[
(-1)^k\mathcal T^{(k)}(t)\ge0
\qquad\text{for every integer }k\ge0\text{ and every }t>0.
\tag{11}
\]

**Proof.** Under RH, (9) is \(\sum_{\gamma>0}m_\gamma e^{-\gamma^2t}\), and termwise differentiation proves (11). Conversely, Bernstein's theorem for completely monotone functions supplies a positive measure \(\mu\) such that
\(\mathcal T(t)=\int e^{-at}\,d\mu(a)\). Tonelli and (10) give
\[
m(u)=\int\frac{d\mu(a)}{u+a}\qquad(u>1/4).
\]
Finiteness at one such \(u\) supplies the required integrability of the measure. This Stieltjes transform extends holomorphically to the slit plane and agrees there meromorphically with \(H'/H\); the same pole argument as in Proposition 1 proves RH. \(\square\)

**Knownness.** The squared-variable, genus-zero and heat-kernel approach predates this note. Zhang's *On Certain Genus 0 Entire Functions*, Lemmas 2–3, develops the heat/logarithmic-derivative relation and complete-monotonicity criterion, and its Section 3 applies the approach to Riemann Xi. MacKay also explicitly uses evenness to pass to a function of squared zeros of order \(1/2\). The proof above is included to fix this project's signs, factors of two, and initial transform domain; no novelty is claimed for the general criterion. See References 1–3.

## 4. Exact arithmetic expression for the heat trace

Set

\[
\lambda_j=2j+\tfrac52,\qquad
c_0=\tfrac12\bigl(\log\pi-\psi(5/4)\bigr),
\]

where \(\psi=\Gamma'/\Gamma\). The project's completed logarithmic derivative, valid for real \(z>1/2\), is

\[
L(z)=\sum_{j\ge0}\frac{z}{\lambda_j(\lambda_j+z)}
 +\frac1{z-1/2}-c_0
 -\sum_{n\ge2}\frac{\Lambda(n)}{\sqrt n}e^{-z\log n}.
\tag{12}
\]

Here \(\Lambda(n)\) is the von Mangoldt function. Dividing by \(2z\), putting \(z=\sqrt u\), and inverting the Laplace transform gives the following identity for every \(t>0\):

\[
\begin{aligned}
\mathcal T(t)={}&
\frac12e^{t/4}\operatorname{erfc}(-\sqrt t/2)
-\frac{c_0}{2\sqrt{\pi t}}\\
&+\sum_{j\ge0}\left[
 \frac1{2\lambda_j\sqrt{\pi t}}
 -\frac12e^{\lambda_j^2t}\operatorname{erfc}(\lambda_j\sqrt t)
 \right]\\
&-\frac1{2\sqrt{\pi t}}
 \sum_{n\ge2}\frac{\Lambda(n)}{\sqrt n}
       \exp\!\left(-\frac{(\log n)^2}{4t}\right).
\end{aligned}
\tag{13}
\]

### Derivation and convergence

The elementary transform identities used are

\[
\begin{aligned}
\mathcal L\!\left[\frac{e^{-\ell^2/(4t)}}{\sqrt{\pi t}}\right](u)
 &=\frac{e^{-\ell\sqrt u}}{\sqrt u},\qquad \ell\ge0,\ u>0,\\
\mathcal L\!\left[e^{a^2t}\operatorname{erfc}(a\sqrt t)\right](u)
 &=\frac1{\sqrt u(\sqrt u+a)}.
\end{aligned}
\tag{14}
\]

The second identity holds for \(u>0\) when \(a\ge0\), and for \(u>a^2\) when \(a<0\). One derivation differentiates
\(E_a(t)=e^{a^2t}\operatorname{erfc}(a\sqrt t)\):
\(E_a'=a^2E_a-a/\sqrt{\pi t}\), \(E_a(0)=1\). Integration by parts and continuity at the removable algebraic case \(u=a^2\) give (14).

For the gamma term, (14) gives exactly

\[
\mathcal L\!\left[
\frac1{2\lambda\sqrt{\pi t}}
-\frac12e^{\lambda^2t}\operatorname{erfc}(\lambda\sqrt t)
\right](u)=\frac1{2\lambda(\lambda+\sqrt u)}.
\tag{15}
\]

Write the bracket as \(g_\lambda(t)\). For \(\lambda,t>0\),

\[
0\le g_\lambda(t)\le\frac1{4\sqrt\pi\lambda^3t^{3/2}}.
\tag{16}
\]

For example, use
\(e^{z^2}\operatorname{erfc}(z)=\pi^{-1/2}\int_0^\infty e^{-zv-v^2/4}\,dv\)
and \(0\le1-e^{-v^2/4}\le v^2/4\). Thus the gamma series converges locally uniformly. More strongly,

\[
g_\lambda(t)=\frac1{2\pi\lambda}
\int_0^\infty\frac{\sqrt a}{a+\lambda^2}e^{-at}\,da,
\tag{17}
\]

so each gamma summand is completely monotone. Equation (17) also gives locally uniform convergence after every fixed number of derivatives by comparison with a constant times \(\sum\lambda_j^{-3}\).

For fixed \(t>0\), the Gaussian in \(\log n\) dominates every power of \(n\), so the prime series and its differentiated series converge locally uniformly in \(t>0\). Tonelli applies to the nonnegative gamma summands. It also applies separately to the unsigned prime summands for \(u>1/4\), since their transformed sum is the absolutely convergent Dirichlet series in (12). The pole and constant terms have absolutely convergent transforms there. Thus the right side of (13) has transform \(m(u)\) for \(u>1/4\). Uniqueness of the Laplace transform, together with (10) and continuity, proves (13).

The gamma part's complete monotonicity does not prove (11) for the full expression. The pole term and the infinite prime sum have a cancellation that cannot be discarded.

## 5. A countercontrol: positive heat trace is insufficient

Consider the explicitly even real polynomial

\[
F_*(z)=(z^2+1)^2
\bigl((z-\tfrac14)^2+4\bigr)
\bigl((z+\tfrac14)^2+4\bigr).
\tag{18}
\]

Its off-axis zeros are \(\pm1/4\pm2i\), lying strictly inside the same centered strip \(|\operatorname{Re}z|<1/2\). Its other zeros are \(\pm i\), each of multiplicity two. Folding gives

\[
H_*(u)=(u+1)^2\left[(u+\tfrac{63}{16})^2+1\right],
\]

and therefore

\[
\begin{aligned}
m_*(u)&=\frac2{u+1}
 +\frac{2(u+63/16)}{(u+63/16)^2+1},\\
\mathcal T_*(t)&=2e^{-t}+2e^{-63t/16}\cos t.
\end{aligned}
\tag{19}
\]

For every \(t>0\),

\[
\mathcal T_*(t)\ge2(e^{-t}-e^{-63t/16})>0.
\]

Consequently \(m_*\) is completely monotone, because it is the Laplace transform of this positive function. Nevertheless \(m_*\) is **not Stieltjes**: it has the nonreal poles \(-63/16\pm i\). Nor is \(\mathcal T_*\) completely monotone. The failure is explicit:

\[
\lim_{t\downarrow0}(-1)^7\mathcal T_*^{(7)}(t)
=2+2\operatorname{Re}(63/16-i)^7
=-\frac{829940726081}{134217728}<0.
\tag{20}
\]

Continuity gives failure at small strictly positive \(t\), not just at the endpoint. This control refutes both shortcuts

\[
\mathcal T\ge0\ \Longrightarrow\ \mathrm{RH},\qquad
m\text{ completely monotone}\ \Longrightarrow\ \mathrm{RH}
\]

as general deductions from this analytic structure. The required stronger condition is complete monotonicity of \(\mathcal T\), equivalently the Stieltjes property of \(m\). This polynomial is a control for those logical implications; it does not reproduce the exact zeta prime coefficients.

## 6. Two unconditional obstructions to a fixed prime cutoff

Let \(L_X\) be (12) with its prime sum restricted to \(n\le X\), retaining the full gamma series, the pole, and the constant. Let \(\mathcal T_X\) be the analogous truncation of (13).

### Proposition 4: no fixed prime truncation is a completely monotone heat trace

For every fixed finite \(X\),

\[
\mathcal T_X(t)=e^{t/4}+O_X(t^{-1/2})\qquad(t\to\infty).
\tag{21}
\]

In particular \(\mathcal T_X\) is not completely monotone on \((0,\infty)\).

**Proof.** The pole term is
\[
\tfrac12e^{t/4}\operatorname{erfc}(-\sqrt t/2)
=e^{t/4}-\tfrac12e^{t/4}\operatorname{erfc}(\sqrt t/2)
=e^{t/4}+O(t^{-1/2}).
\]
Equation (16) bounds the entire gamma series by \(O(t^{-3/2})\). The constant and fixed finite prime sum contribute \(O_X(t^{-1/2})\). This proves (21). A completely monotone function is nonnegative and nonincreasing, so cannot tend to positive infinity. \(\square\)

This excludes a completion based on proving complete monotonicity for every finite prime truncation and then taking the cutoff to infinity. A valid approximation must couple the cutoff to the tested range and derivative order, or retain the infinite cancellation in a different exact representation.

### Proposition 5: every fixed prime cutoff eventually fails the sparse Pick test

Keep the manuscript's rates \(x_j=1+1/(j+1)\), and define

\[
(P_{X,n})_{ij}=\frac{L_X(x_i)+L_X(x_j)}{x_i+x_j}.
\]

Then, unconditionally,

\[
\boxed{\forall X<\infty\quad\exists n\ge1:\quad P_{X,n}\not\succeq0.}
\tag{22}
\]

**Proof.** The meromorphic function \(L_X\) has an uncancelled simple pole at \(z=1/2\) with residue \(1\). All its other displayed terms are holomorphic there, and throughout \(\operatorname{Re}z>0\) it has no other pole. For real \(x>1/2\),
\[
L_X(x)=L(x)+\sum_{n>X}\frac{\Lambda(n)}{\sqrt n}e^{-x\log n}>0.
\]
Here \(L(x)>0\) is the unconditional consequence of the positive theta representation of \(F\) used in the main manuscript.

Suppose all prefixes were positive semidefinite. The Cayley transformation and finite Nevanlinna–Pick interpolation, followed by a normal-family limit, give a holomorphic positive-real function \(h\) on \(\operatorname{Re}z>0\) satisfying \(h(x_j)=L_X(x_j)\) for all \(j\). This is the same interpolation argument as the manuscript's sparse completion theorem; it uses only the finite matrices and positive real data.

The function
\[
A_X(z)=(z-1/2)\bigl(h(z)-L_X(z)\bigr)
\]
extends holomorphically throughout that half-plane. It vanishes at the sequence \(x_j\to1\), so the identity theorem gives \(A_X\equiv0\). At the removed pole, however, \(A_X(1/2)=-1\). This contradiction proves (22). \(\square\)

The obstruction is the uncancelled completion pole, not numerical conditioning. It explains a necessary order of limits: for each fixed \(n\), \(P_{X,n}\to P_n\), but no one finite cutoff works for every \(n\). Under RH, strict positivity of each fixed \(P_n\) would make that prefix positive for sufficiently large \(X\); it would still not reverse the quantifiers in (22).

## 7. A closed prime-tail bound for fixed heat time

For an integer \(X\ge8\), let \(b=\log X\). The cutoff error has a known sign and an explicit bound:

\[
\begin{aligned}
0\le\mathcal T_X(t)-\mathcal T(t)
&=\frac1{2\sqrt{\pi t}}
\sum_{n>X}\frac{\Lambda(n)}{\sqrt n}e^{-(\log n)^2/(4t)}\\
&\le e^{t/4}\left[
\sqrt{\frac t\pi}\,e^{-(b-t)^2/(4t)}
+\frac t2\operatorname{erfc}\!\left(\frac{b-t}{2\sqrt t}\right)
\right].
\end{aligned}
\tag{23}
\]

**Proof.** Use \(0\le\Lambda(n)\le\log n\). The function
\((\log y)y^{-1/2}\exp[-(\log y)^2/(4t)]\) is decreasing for \(y\ge e^2\), so its tail sum is at most the integral from \(X\) to infinity. Substituting \(v=\log y\) gives
\[
\frac1{2\sqrt{\pi t}}\int_b^\infty v e^{v/2-v^2/(4t)}\,dv,
\]
and completing the square evaluates this integral as the right side of (23). \(\square\)

The bound tends to zero as \(X\to\infty\) for each fixed \(t>0\), locally uniformly in \(t\). This is a truncation estimate, not a sign proof: \(\mathcal T_X\) lies above the exact trace. Alternating derivative inequalities require bounds for the differentiated tails as well.

## 8. What this attack establishes and what remains

The fold yields a branch-free entire function of smaller order, an exact two-channel decomposition of the project's Weil/Pick matrix, an arithmetic heat formula with all completion constants, and explicit controls distinguishing weak positivity from the required condition. The two cutoff propositions impose genuine restrictions on a proposed completion.

What remains is a proof of (11) for the complete arithmetic expression (13), or an independently established positive Stieltjes representation in (3), or the previously stated all-prefix arithmetic Gram comparison. Rephrasing that requirement as a spectral measure, a heat trace, or a resolvent does not discharge it. The finite cutoff obstruction also prevents replacing it by positivity of all uncorrected finite-prime models.

## References and verification

1. R. S. MacKay, *Towards a spectral proof of Riemann's hypothesis*, arXiv:1708.00440, pp. 2–3: evenness, squared zeros, order \(1/2\), and a resolvent trace. [Primary preprint](https://arxiv.org/pdf/1708.00440).
2. R. Zhang, *On Certain Genus 0 Entire Functions*, arXiv:2206.05104v8 (2023), especially Lemmas 2–3 and Section 3. [Primary preprint](https://arxiv.org/pdf/2206.05104v8). The normalization of the present note is specified independently in (1), (2), and (9).
3. R. L. Schilling, R. Song and Z. Vondraček, *Bernstein Functions: Theory and Applications*, second edition, 2012, Chapter 1 (Bernstein's theorem) and Chapter 2 (Stieltjes functions). [Publisher](https://doi.org/10.1515/9783110269338); [author's book page](https://motapa.de/bernstein_functions/index.shtml).
4. J. Agler and J. E. McCarthy, *Nevanlinna–Pick Kernels and Localization*, Theorem 0.1, for the finite interpolation input in Proposition 5. [Primary preprint](https://arxiv.org/pdf/1610.01965).
5. NIST, DLMF, [§25.4](https://dlmf.nist.gov/25.4), completed zeta and reflection formula; the source release's exact arithmetic normalization is rederived in the accompanying main manuscript rather than imported as a new theorem.

The companion `check_folded_heat.py` checks finite exact algebra, the countercontrol's poles and derivative failure, and the closed tail-integral formula. The recorded run passes **20 of 20 exact checks**, with results in `folded_heat_check_report.json`. Its report does not certify RH, all-order positivity, the external proof, or all analytic convergence arguments above.
