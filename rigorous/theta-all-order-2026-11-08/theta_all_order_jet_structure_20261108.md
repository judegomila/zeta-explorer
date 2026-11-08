# Arbitrary-order theta jets: exact recurrence and unavoidable boundary cancellation

Research note, 8 November 2026. This develops the full algebraic derivative hierarchy of the actual theta cutoff-energy kernel. It gives exact formulas at every order and two obstructions to proposed positive representations. It does not prove positive semidefiniteness of the full theta hierarchy or RH.

## 1. Setup and normalization

Let `kappa` be the positive even theta kernel from the preceding notes, and let `alpha > 0`. The actual cutoff-zero energy kernel is

\[
H_\alpha(u,v)=\alpha\int_0^\infty
(2r-u-v)\kappa(r-u)\kappa(r-v)\,dr.
\]

Evenness also gives

\[
H_\alpha(u,v)=\alpha\int_0^\infty
(2r+u+v)\kappa(r+u)\kappa(r+v)\,dr.
\tag{1.1}
\]

Define

\[
J_{mn}=\partial_u^m\partial_v^nH_\alpha(0,0),
\qquad k_j=\kappa^{(j)}(0),
\qquad I_j=\int_0^\infty r\bigl(\kappa^{(j)}(r)\bigr)^2\,dr.
\]

Odd `k_j` vanish. The theta estimates and holomorphic-feature argument in the preceding analytic-localization note justify every differentiation and integration by parts below.

## 2. Exact polynomial energy at every degree

For a complex polynomial `P`, put

\[
f=P(D)\kappa,\qquad q=P'(D)\kappa,\qquad D=d/dr.
\]

Here `P'` differentiates the polynomial symbol. If `P(t)=sum c_m t^m`, direct differentiation of (1.1) gives

\[
\boxed{
\sum_{m,n}\overline{c_m}J_{mn}c_n
=2\alpha\int_0^\infty
\left[r|f(r)|^2+\operatorname{Re}(\overline{f(r)}q(r))\right]dr.
}
\tag{2.1}
\]

Equivalently, since `[P(D),r]=P'(D)`,

\[
\sum\overline{c_m}J_{mn}c_n
=2\alpha\operatorname{Re}\int_0^\infty
\overline{P(D)\kappa}\,P(D)(r\kappa)\,dr.
\tag{2.2}
\]

The first term in (2.1) is positive. The second is an exact boundary correction after parity splitting; it has no general favorable sign.

## 3. A rank-two displacement identity

Differentiating (1.1) in the diagonal direction produces a total derivative in `r`:

\[
\boxed{
(\partial_u+\partial_v)H_\alpha(u,v)
=-\alpha(u+v)\kappa(u)\kappa(v).
}
\tag{3.1}
\]

The upper endpoint vanishes by theta decay. Therefore

\[
\boxed{
J_{m+1,n}+J_{m,n+1}
=-\alpha\left[m k_{m-1}k_n+n k_mk_{n-1}\right],
}
\tag{3.2}
\]

where a term with coefficient zero is omitted. This is a rank-two displacement relation, valid at every order. Also `J_mn=0` whenever `m+n` is odd.

Set

\[
a_p=(-1)^p k_{2p},
\qquad
E_{pq}=\frac{(-1)^{p+q}}\alpha J_{2p,2q},
\qquad
O_{pq}=\frac{(-1)^{p+q}}\alpha J_{2p+1,2q+1}.
\tag{3.3}
\]

The signs are a diagonal congruence and do not affect positive semidefiniteness. Equation (3.2) becomes

\[
\boxed{
O_{pq}=E_{p,q+1}-(2q+1)a_pa_q
=E_{p+1,q}-(2p+1)a_pa_q,
}
\tag{3.4}
\]

and hence

\[
\boxed{
E_{p+1,q}-E_{p,q+1}=2(p-q)a_pa_q.
}
\tag{3.5}
\]

Thus the odd block is determined by the even block and the boundary derivatives. The even block is a structured correction of a Hankel array, not an arbitrary matrix.

## 4. Closed formula for every even and odd entry

The balanced entries are especially simple:

\[
E_{pp}=2I_{2p},\qquad E_{p,p+1}=2I_{2p+1}.
\tag{4.1}
\]

The first identity follows directly from (2.1), since the relevant odd boundary derivative vanishes. For the second, put `m=2p` and integrate by parts:

\[
\int_0^\infty r\kappa^{(m)}\kappa^{(m+2)}dr
=\frac{k_m^2}{2}-I_{m+1},
\]

\[
\int_0^\infty\kappa^{(m)}\kappa^{(m+1)}dr=-\frac{k_m^2}{2},
\qquad
\int_0^\infty\kappa^{(m-1)}\kappa^{(m+2)}dr=\frac{k_m^2}{2}
\]

when `m>0`; the last term is absent when `m=0`. Substitution gives `J_(m,m+2)/alpha=-2I_(m+1)` and proves (4.1).

Iterating (3.5) toward the balanced entry gives the explicit formula

\[
\boxed{
E_{pq}=2I_{p+q}
+\sum_{j=\min(p,q)}^{\max(p,q)-1}
|p+q-1-2j|\,a_j a_{p+q-1-j}.
}
\tag{4.2}
\]

An empty sum is zero. For example,

\[
E_{02}=2I_2+2a_0a_1,\qquad
E_{03}=2I_3+4a_0a_2,\qquad
E_{13}=2I_4+2a_1a_2.
\]

Equation (3.4), combined with (4.2), supplies every odd entry. In particular,

\[
\boxed{
O_{pp}=2I_{2p+1}-(2p+1)a_p^2.
}
\tag{4.3}
\]

These formulas require only the one-index arrays of derivative energies `I_j` and even boundary derivatives `a_j`. No positivity assumption has entered their derivation.

## 5. Why the apparent Hankel decomposition is not a positive representation

The array `[2I_(p+q)]` in (4.2) has nonnegative entries, but it is not automatically a positive moment matrix. This fails even for the completely solvable Gaussian model

\[
\kappa(u)=e^{-u^2/2}.
\]

For this model,

\[
(I_0,I_1,I_2,I_3,I_4)
=\left(\frac12,\frac12,\frac12,\frac32,\frac92\right),
\quad (a_0,a_1,a_2)=(1,1,3).
\]

Hence the order-two Hankel array is

\[
M=\begin{pmatrix}
1&1&1\\1&1&3\\1&3&9
\end{pmatrix},\qquad \det M=-4.
\tag{5.1}
\]

The boundary correction in (4.2) is

\[
C=\begin{pmatrix}
0&0&2\\0&0&0\\2&0&0
\end{pmatrix},
\tag{5.2}
\]

which is itself indefinite. Nevertheless,

\[
M+C=
\begin{pmatrix}1&1&3\\1&1&3\\3&3&9\end{pmatrix}
=\begin{pmatrix}1\\1\\3\end{pmatrix}
\begin{pmatrix}1&1&3\end{pmatrix}\succeq0.
\tag{5.3}
\]

Indeed the full Gaussian kernel is exactly

\[
H_\alpha(u,v)=\alpha e^{-u^2/2}e^{-v^2/2}.
\]

Thus exact cancellation between two indefinite pieces is essential even when a full positive rank-one answer is already known. Treating the derivative energies as moments, or dropping the boundary correction, is invalid.

## 6. The original boundary form cannot be made rank one by a basis change

Let

\[
B_{mn}=\int_0^\infty\kappa^{(m)}\kappa^{(n)}dr.
\]

The boundary correction in (2.1) has entries

\[
C_{mn}=mB_{m-1,n}+nB_{m,n-1}.
\]

All same-parity entries of `C` are determined by boundary derivatives through

\[
B_{m+1,n}+B_{m,n+1}=-k_mk_n,
\qquad
B_{0,2r+1}=-\frac12\sum_{j=0}^{r}k_{2j}k_{2(r-j)}.
\tag{6.1}
\]

Already on the even polynomial basis `1,D^2`,

\[
C_{\rm even}=
\begin{pmatrix}0&-k_0^2\\-k_0^2&0\end{pmatrix}.
\tag{6.2}
\]

It has rank two and both signs. On the odd basis `D,D^3`,

\[
C_{\rm odd}=-
\begin{pmatrix}k_0^2&k_0k_2\\k_0k_2&3k_2^2\end{pmatrix},
\tag{6.3}
\]

which has rank two if `k_0 k_2 != 0`, as for the actual theta kernel. Rank and inertia are invariant under an invertible change of this differential-symbol basis. Therefore these exact boundary corrections cannot become rank-one forms through such a basis change. Rearranging the positive integral itself would be a different construction and would require a new proof.

## 7. A stronger all-order obstruction: the boundary trace is unbounded

The rank-two displacement suggests introducing a vector representing the boundary data `a_p`, then correcting the shift by a rank-one operator. For theta, that vector cannot be bounded in the putative positive jet norm.

### Theorem

There is no finite positive constant `C` such that, for every finite coefficient sequence,

\[
\boxed{
\left|\sum_p c_pa_p\right|^2
\le C\sum_{p,q}\overline{c_p}E_{pq}c_q.
}
\tag{7.1}
\]

This is an unconditional no-go for a uniform bounded boundary-trace estimate. It does not assert that `E` has a negative direction.

**Proof: analytic extension of the proposed estimate.** In the earlier localization construction,

\[
\Phi(z)=(h_+(r-z),h_-(r-z))_{r>0},\qquad
J=\operatorname{diag}(I,-I),
\]

is Hilbert-valued holomorphic on `|Im z|<pi/2`. On every compact substrip, the theta series bounds its tails by `C(1+r)exp(9r/4-c exp(r))`, with `c>0`, which justifies the Hilbert-valued analyticity. Define its even part `Phi_e(z)=(Phi(z)+Phi(-z))/2` and the augmented analytic curve

\[
\Psi(z)=\left(\frac{\Phi_e(z)}{\sqrt\alpha},\ \kappa(z)\right).
\]

Use the bounded indefinite form `diag(J,-1/C)` on the augmented Hilbert space. Its signed even derivatives at zero have Gram matrix `E_pq-a_pa_q/C`. Thus (7.1) says this bounded form is nonnegative on the span of all those derivatives.

That derivative span has the same closure as the span of `Psi(u)` for all real `u`. Indeed a vector orthogonal to every derivative gives an analytic scalar function with every Taylor coefficient zero, hence a function identically zero on the connected strip. Boundedness of the indefinite form therefore extends (7.1) to the actual real features. It follows that

\[
\kappa(u)^2
\le\frac{C}{2\alpha}
\bigl(H_\alpha(u,u)+H_\alpha(u,-u)\bigr)
\le\frac C\alpha H_\alpha(u,u).
\tag{7.2}
\]

The last inequality follows directly from squared-variable log concavity.
For real `r,u`, Jensen's inequality gives

\[
\kappa(r-u)\kappa(r+u)
\le\kappa\left(\sqrt{r^2+u^2}\right)^2.
\]

Consequently

\[
0<H_\alpha(u,-u)
\le2\alpha\int_0^\infty r\kappa(\sqrt{r^2+u^2})^2dr
=2\alpha\int_{|u|}^\infty t\kappa(t)^2dt
=H_\alpha(u,u).
\]

**Proof: an explicit theta tail bound contradicts (7.2).** For `t>=1`, the theta series can be written

\[
\kappa(t)=2\pi^2e^{9t/4-\pi e^t}L(t),
\qquad
1-d_t\le L(t)\le1,
\qquad d_t=\frac{3e^{-t}}{2\pi}.
\tag{7.3}
\]

For completeness, the first theta term supplies the lower bound. The sum of the remaining relative positive terms is at most

\[
\sum_{n\ge2}n^4e^{-\pi(n^2-1)e^t}
\le\frac{16e^{-3\pi e^t}}{1-e^{2-5\pi e^t}}
\le d_t\qquad(t\ge1),
\]

which proves the upper bound. To check the last elementary inequality,
divide the bound by `d_t`: its logarithmic derivative is negative for
`t>=1`, and its value at `t=1` is less than one. For example,
`3<pi<4` and `2<e<3` already give a strict conservative bound there.

For `u>=1,s>=0`, using `e^s-1>=s` gives

\[
\frac{\kappa(u+s)}{\kappa(u)}
\le\frac{e^{-c_us}}{1-d_u},
\qquad c_u=\pi e^u-\frac94>0.
\]

Since

\[
H_\alpha(u,u)=2\alpha\int_u^\infty t\kappa(t)^2dt,
\]

we obtain the explicit bound

\[
\boxed{
\frac{H_\alpha(u,u)}{\alpha\kappa(u)^2}
\le(1-d_u)^{-2}
\left(\frac u{c_u}+\frac1{2c_u^2}\right)
\longrightarrow0.
}
\tag{7.4}
\]

Equations (7.2) and (7.4) are incompatible with any finite `C`. This proves the theorem.

### Consequence for a shift/operator construction

Formally, (3.4) would make the corrected shift

\[
e_p\longmapsto e_{p+1}-(2p+1)a_p h
\]

symmetric if a vector `h` represented the functional `e_p -> a_p` in a positive space with Gram matrix `E`. The theorem proves that no such bounded representing vector can exist for theta. An operator construction along these lines must handle an unbounded boundary trace, with domains and a trace estimate appropriate to that unbounded operator. A bounded finite-channel repair does not follow from the displacement identity.

## 8. What remains after this pass

The entire jet hierarchy is now given by the exact scalar arrays `I_j,a_j` and formulas (3.4), (4.2). The unresolved task is positivity of these full coupled arrays, or an estimate on the actual signed pulse limit that survives the known divergent preimages. The formulas do not make either task automatic.

Two specific proposed simplifications have been ruled out:

- The derivative-energy array cannot be assumed to be a positive Hankel moment matrix: the Gaussian example already disproves that.
- A uniform bounded boundary-trace estimate cannot control the correction: the actual theta tail contradicts it.

These obstructions coexist with every previously proved finite jet certificate and separated-tail positivity theorem. They concern the uniform, arbitrary-order completion.

## Sources and context

- The definitions, signed feature representation, and analytic derivative-span argument continue `theta_flux_analytic_localization_20261108.md`.
- The actual-theta two-point inequality used in (7.2) follows from the stronger concavity in George Csordas, *Fourier Transforms of Positive Definite Kernels and the Riemann xi-Function*, Theorem 4.2(b), together with the majorization argument recorded in the preceding boundary-energy note: https://arxiv.org/pdf/1309.0055
- All displacement relations, closed parity formulas, Gaussian cancellations, and the unbounded-trace theorem are derived in this note. No claim of a new theorem about the Riemann zeros is made.
