# Actual-theta spatial factorization of the frozen-residue form

## Scope and normalization

This note identifies the exact spatial form of

\[
M_0=\dot H-\dot u\,e^*-e\,\dot u^*+\dot\gamma\,ee^*.
\]

It gives an unconditional signed-square factorization, not a positive Gram
factorization. In particular, its negative leg has rank growing with the
parity prefix. No target positivity or all-degree inertia bound is assumed.

Use the actual half-line parent inner product

\[
\langle f,g\rangle_a
 :=\int_0^\infty h e^{2ah}f(h)\overline{g(h)}\,dh,
 \qquad |a|\leq\frac12. \tag{1}
\]

At `a=0` write simply `\langle\cdot,\cdot\rangle_0`. Thus the two residue
constants used elsewhere are, without any hidden change of measure,

\[
\Gamma=\langle\chi,\chi\rangle_0
      =\int_0^\infty h|\chi(h)|^2\,dh,
\qquad
A=\langle h\chi,\chi\rangle_0
      =\int_0^\infty h^2|\chi(h)|^2\,dh. \tag{2}
\]

For completeness, the actual complete-theta raw feature and residue profile
are

\[
z_m=\pi m^2e^{2h},\qquad
\Psi_A(h)=\sum_{m\geq1}e^{h/2}4z_m(2z_m-3)e^{-z_m}A(z_m),
\]

\[
\chi(h)=\sum_{m\geq1}e^{h/2}4z_me^{-z_m}. \tag{3}
\]

For a differential-symbol polynomial `p`, let `Psi_p` denote the corresponding
raw feature obtained from the triangular derivative-polynomial channel, and
let `e(p)` be its scalar residue. The corrected feature is exactly

\[
F_p=p(D)\psi=\Psi_p-e(p)\chi. \tag{4}
\]

The shifted residue EGF is `E_a(t)=-e^{at}C(t)`. Hence

\[
d(p):=\left.\partial_a e\bigl(p(\,\cdot+a)\bigr)\right|_{a=0}
     =e(p'),
\qquad d_j=je_{j-1}. \tag{5}
\]

## Frozen versus actual derivative

Put `p_a(z)=p(z+a)`. The raw and corrected parent data are

\[
H_a(p,q)=\langle\Psi_{p_a},\Psi_{q_a}\rangle_a,
\quad
u_a(p)=\langle\Psi_{p_a},\chi\rangle_a,
\quad
\gamma_a=\langle\chi,\chi\rangle_a,
\]

\[
G_a=H_a-u_ae_a^*-e_au_a^*+\gamma_ae_ae_a^*,
\qquad e_a(p)=e(p_a). \tag{6}
\]

Embed the corrected feature in the fixed Hilbert space
`L^2((0,infinity),dh)` by

\[
J_p(a,h)=\sqrt h\,e^{ah}\{\Psi_{p_a}(h)-e_a(p)\chi(h)\}.
\]

If the residue coefficient is frozen at `e(p)` while the weight and raw
feature are differentiated, then

\[
\dot J_p^{\rm fr}(0,h)
=\sqrt h\{hF_p(h)+\Psi_{p'}(h)\}. \tag{7}
\]

The actual derivative also differentiates the residue:

\[
\dot J_p(0,h)
=\sqrt h\{hF_p(h)+\Psi_{p'}(h)-d(p)\chi(h)\}
=\sqrt h\{hF_p(h)+F_{p'}(h)\}. \tag{8}
\]

Equation (7) is precisely the derivative encoded by `M_0`; equation (8)
is the derivative encoded by the actual target `M=dot G`.

## Exact spatial and signed-square forms

All `L^2(dh)` pairings and norms in (9)--(12) use ordinary Lebesgue measure;
the factor `h` from the weighted parent (1) has been absorbed into the
displayed features.

Polarizing the frozen derivative gives

\[
\begin{aligned}
M_0(p,q)={}&2\langle hF_p,hF_q\rangle_{L^2(dh)}\\
&+\langle\Psi_{p'},hF_q\rangle_{L^2(dh)}
 +\langle hF_p,\Psi_{q'}\rangle_{L^2(dh)}. \tag{9}
\end{aligned}
\]

In particular,

\[
M_0[p]
=2\int_0^\infty h^2|F_p|^2\,dh
+2\operatorname{Re}\int_0^\infty hF_p\overline{\Psi_{p'}}\,dh. \tag{10}
\]

Pointwise in `h`, the integrand is

\[
\begin{pmatrix}F_p\\ \Psi_{p'}\end{pmatrix}^{\!*}
\begin{pmatrix}2h^2&h\\ h&0\end{pmatrix}
\begin{pmatrix}F_p\\ \Psi_{p'}\end{pmatrix}. \tag{11}
\]

The fiber matrix has determinant `-h^2`, so it has exactly one positive and
one negative direction for every `h>0`. Completing the fiber square yields
the exact Krein-space factorization

\[
\boxed{
M_0[p]=\frac12\left(
 \|2hF_p+\Psi_{p'}\|_{L^2(dh)}^2
-\|\Psi_{p'}\|_{L^2(dh)}^2\right).
} \tag{12}
\]

Equivalently, with

\[
X_0p=2hF_p+\Psi_{p'},\qquad Y_0p=\Psi_{p'},
\]

one has `M_0=(X_0^*X_0-Y_0^*Y_0)/2`. This is a signed Gram, not a
positive Gram.

## Exact residue-drift cross compensation

Define the weighted retained-residue correlation

\[
v(p)=u_0(p)-\Gamma e(p)
    =\langle F_p,\chi\rangle_0
    =\int_0^\infty hF_p\overline\chi\,dh. \tag{13}
\]

Since `Psi_(p')=F_(p')+d(p)chi`, comparison of (7) and (8) gives

\[
\boxed{M=M_0-vd^*-dv^*,\qquad
       M_0=M+vd^*+dv^*.} \tag{14}
\]

Quadratically,

\[
M_0[p]=M[p]+2\operatorname{Re}
 \bigl(v(p)\overline{d(p)}\bigr). \tag{15}
\]

Thus the corrected-feature/residue-drift cross term is part of the exact
form. There is no standalone `|d|^2` term: the two such terms in the square
difference cancel.

As a normalization check, the formal pure-residue sector has

\[
M_{0,{\rm res}}=2Aee^*,\qquad v_{\rm res}=-\Gamma e,
\]

and therefore

\[
M_{\rm res}=2Aee^*+\Gamma(ed^*+de^*), \tag{16}
\]

whose `(e,d)` coefficient matrix is
`[[2A,Gamma],[Gamma,0]]`, exactly as in the rank-two balance calculation.

## The negative leg has growing rank

For `epsilon in {0,1}` let

\[
\mathcal P_n^{(\epsilon)}
=\operatorname{span}\{z^{\epsilon+2j}:0\leq j\leq n\}. \tag{17}
\]

Differentiation has rank

\[
\operatorname{rank}(p\mapsto p'|_{\mathcal P_n^{(0)}})=n,
\qquad
\operatorname{rank}(p\mapsto p'|_{\mathcal P_n^{(1)}})=n+1. \tag{18}
\]

The raw lift is injective. Indeed, its derivative-channel polynomials are
triangular with nonzero leading coefficients. If a nonzero channel
polynomial `A` satisfied `Psi_A=0`, then as `h` tends to infinity the first
theta orbit in (3) dominates all higher orbits. The identity would make the
first-orbit polynomial factor exponentially small along arbitrarily large
`z`, contradicting the growth of a nonzero polynomial.

Consequently

\[
\operatorname{rank}(Y_0|_{\mathcal P_n^{(0)}})=n,
\qquad
\operatorname{rank}(Y_0|_{\mathcal P_n^{(1)}})=n+1. \tag{19}
\]

The one-negative-direction signature in (11) is therefore only fiberwise.
It does not supply a single global negative direction after integration. Any
representation `M_0=P-rr^*` with `P>=0` uniformly across the complete parity
ladder would require a new, global cancellation theorem; it cannot be read
off from the existing theta/residue algebra.

`M0_INERTIA_EQUIVALENCE_AUDIT.md` proves that such a compatible all-prefix
one-negative-direction statement is equivalent to the endpoint target.
`SPECTRAL_DEFECT_CLOSURE.md` supplies the underlying polynomial-density
mechanism: a negative open set of the Xi Laguerre density creates arbitrarily
large negative inertia. These facts explain why a global rank-one negative
representation is target-level information rather than a formal consequence
of the signed square above.
