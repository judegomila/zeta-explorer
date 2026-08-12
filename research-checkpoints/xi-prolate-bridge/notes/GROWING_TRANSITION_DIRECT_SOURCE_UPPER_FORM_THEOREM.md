# Growing-transition direct-source upper-form theorem

## 0. Exact result and fail-closed boundary

This note reconstructs the complete ordered central--outer form directly
from the source correlation, before any scalar mask decomposition.  For the
physical global radical `K=X+O`, two-sided radicality gives

\[
 \boxed{
 Q_X(j,k)=q_\lambda(X_j,X_k)
 =-\mathcal W_Z(X_j,O_k)
 =-\mathcal W_Z(O_j,X_k).}                           \tag{0.1}
\]

The ordered upper representative is therefore

\[
 Q^\uparrow(j,k):=-\mathcal W_Z(X_j,O_k).             \tag{0.2}
\]

The two physical boundaries add in (0.2); they are not the upper and lower
Hermitian orientations.  The lower orientation is the adjoint
`Q^downarrow=(Q^uparrow)^*`.  Thus a partial or cutoff upper form is made
Hermitian by `(Q^uparrow+Q^downarrow)/2`, not by their unnormalized sum.

The note proves the exact source formula (3.4), its pole--Archimedean--prime
signs and factors, the ordered `m`-left/`ln`-right prime expansion (5.7), and
the finite-length endpoint and tail identities (4.4) and (6.6).  It also
defines a valid finite-Fejer ordered cross form

\[
 Q^\uparrow_{M,L}:=-\mathcal W_Z(X_M,O_M),            \tag{0.3}
\]

whose ordered limit is the physical form.  The finite-cutoff pair
`X_M,O_M` is not asserted to be the two pieces of a global radical, so
(0.1) is not asserted at finite `M`.

No `R,C_R,C_L,B` mask assignment is needed for (0.2)--(0.3).  Midpoint
half-rows belong to an alternative partition of the same prime integral
and must not be added to the direct source formula.  The local
Archimedean `1/r` coefficient, and hence the isolated `m=l=1` upper Weber
conjugated-Hilbert principal, survives on the full profile space.  This
does not exclude cancellation after compression to the special growing
transition columns and proves no complete edge floor, no `PA`, and no RH.
The project state remains `P0_INVALIDATED`.

## 1. Frozen inputs and source status

The following inputs are byte-frozen for this package.

| Dependency | SHA-256 |
|---|---|
| `vendor/CCM-ZST-2511.22755v1.pdf` | `c98d89f7fc999d038e15e80a9aaaee2af797c17711c4329ca7ce48ad49cb336b` |
| `notes/EXACT_RADICAL_LEAKAGE_IDENTITY.md` | `76dd6586357a2448ef689380a106eea5e9aedb95f68e731f10f1d6626040fddc` |
| `notes/OUTER_PROJECTION_RADICAL_REDUCTION.md` | `3d8b4f79d4d9249d36abe8a898a50565528d34711fc8b151f2f72c1c13bb2edd` |
| `notes/CHEBYSHEV_ERROR_REWRITE.md` | `164482f280284c49eda27c6d22607f32d5e16db4ab053b965c97f8bbd81db20a` |
| `notes/NEAR_SIGNED_HANKEL_REDUCTION.md` | `fba7078c9695951fa7160e2587ff774dc1d10730bd94dc3efdec4b851ef9408e` |
| `notes/GROWING_TRANSITION_COMPLETE_CENTRAL_FORM_REDUCTION.md` | `6c853ad2ab666bc79b33fafc498f25c6c0059812ed829fbf8ce42486983b1de9` |
| `notes/GROWING_TRANSITION_COMPLETE_CENTRAL_PLEMELJ_CAUCHY_FLOOR_THEOREM.md` | `a3a874470e62daa012dc97d6c908e12ac13378ff7e23219e0fbe3cee56b27a85` |
| `notes/GROWING_TRANSITION_EDGE_CARLEMAN_SCATTERING_OBSTRUCTION.md` | `1edd9639d69980f2a8662b0d0fab0b8fdfb49f853b4599c9a945092358c6018d` |
| `notes/GROWING_TRANSITION_FINITE_FEJER_XI_WRONSKIAN_ASSEMBLY_GATE.md` | `41dad88fd3e5bcb3277ccadb6baaa4bfa40ab683d15c747bebe8a50ce759ff23` |
| `tests/test_growing_transition_finite_fejer_xi_wronskian_assembly_gate.py` | `dcb9640a5294ae5c44502f983f20f9eadcdf8271dd02099b9d3887f255460aee` |

The vendored paper is the binding source for the correlation and the three
explicit-form blocks.  No external zero table, prime estimate, Hilbert
matrix theorem, or numerical prolate data is used.

## 2. Source correlation, radical normalization, and adjoint

For logarithmic-line functions put, for `r>=0`,

\[
 \mathfrak q(v,w;r)=\int_{\mathbb R}
 \{\overline {v(t)}w(t+r)+\overline {v(t+r)}w(t)\}\,dt. \tag{2.1}
\]

For `x>=1`, set `F_(v,w)(x)=mathfrak q(v,w;log x)`.  On the admitted
physical cross domain define the source extension

\[
 \mathcal W_Z(v,w)=\Psi^\#(F_{v,w}),\qquad
 \Psi^\#=W_{0,2}^\#-W_{\mathbb R}^\#-W_p^\#,          \tag{2.2}
\]

where

\[
\begin{aligned}
 W_{0,2}^\#(F)
 &=\int_1^\infty F(x)(x^{1/2}+x^{-1/2})\,{dx\over x},\\
 W_{\mathbb R}^\#(F)
 &={\log(4\pi)+\gamma\over2}F(1)
   +\int_1^\infty{x^{1/2}F(x)-F(1)\over x-x^{-1}}\,{dx\over x},\\
 W_p^\#(F)
 &=\sum_{n\geq2}{\Lambda(n)\over\sqrt n}F(n).
\end{aligned}                                                \tag{2.3}
\]

The compact form `q_lambda` is the restriction of `mathcal W_Z` to its
compact--compact form domain.  In particular
`q_lambda(X_j,X_k)=mathcal W_Z(X_j,X_k)`.  This distinction is essential:
`q_lambda(X,O)` is not automatically defined by compact-form closure.

Let `K_j=X_j+O_j` be a physical global radical.  On the admitted physical
cross, the source radical theorem is two-sided:

\[
 \mathcal W_Z(X_j,K_k)=0,\qquad
 \mathcal W_Z(K_j,X_k)=0.                             \tag{2.4}
\]

Expanding (2.4) proves (0.1).  Sesquilinearity of (2.1)--(2.3) also gives

\[
 -\mathcal W_Z(O_j,X_k)
 =\overline{-\mathcal W_Z(X_k,O_j)}
 =(Q^\uparrow)^*_{jk}.                               \tag{2.5}
\]

Since `q_lambda(X,X)` is Hermitian, the complete physical matrix
`Q^uparrow` is already Hermitian.  For a partial branch or a finite cutoff,
the correctly normalized Hermitian part is

\[
 \operatorname {Herm}Q^\uparrow
 ={Q^\uparrow+(Q^\uparrow)^*\over2}.                 \tag{2.6}
\]

Using the sum instead of the average doubles the physical form.  The factor
two from the two physical boundaries below is logically separate from
(2.6).

## 3. Both physical boundaries and the direct complete formula

Put `L=2 log lambda`, `ell=L/2`, and use right-boundary profiles

\[
\begin{aligned}
 A_j(s)&=X_j(\ell-s),&0\leq s\leq L,\\
 B_k(t)&=O_k(\ell+t),&t\geq0,\\
 a_j(s)&=e^{s/2}\overline {A_j(s)},&
 b_k(t)&=e^{t/2}B_k(t).
\end{aligned}                                                \tag{3.1}
\]

If `X_j,O_k` have inversion parities `epsilon_j,epsilon_k`, splitting the
two terms in (2.1) at the right and reflected-left boundaries gives

\[
 \mathfrak q(X_j,O_k;r)
 =(1+\varepsilon_j\varepsilon_k)
   (\overline A_j*B_k)(r).                            \tag{3.2}
\]

Thus opposite parities vanish.  In the admitted equal-parity sector both
physical boundaries give the same ordered `X_j -> O_k` convolution.  Put

\[
 C_{jk}(r)=\int_0^{\min(L,r)}a_j(s)b_k(r-s)\,ds.       \tag{3.3}
\]

Then `F_(X_j,O_k)(e^r)=2e^(-r/2)C_(jk)(r)` and `F(1)=0`.
Substitution in all three lines of (2.3), followed by the minus sign in
(0.2), proves

\[
\boxed{
\begin{aligned}
 Q^\uparrow_{jk}
 &=-2\int_0^\infty(1+e^{-r})C_{jk}(r)\,dr\\
 &\quad+2\int_0^\infty{C_{jk}(r)\over e^r-e^{-r}}\,dr
 +2\sum_{n\geq2}{\Lambda(n)\over n}C_{jk}(\log n).
\end{aligned}}                                                \tag{3.4}
\]

The ordered upper pole, Archimedean, and prime signs are therefore

\[
 \boxed{(-,+,+),}                                     \tag{3.5}
\]

and every displayed factor two is the equal-parity physical-boundary
factor.  The outer--outer mask formula `-2(G-B)` uses a different radical
representative and cannot be pasted blockwise onto (3.4): only the complete
combined distribution is radical.

## 4. Exact complete-kernel boundary identity

Let

\[
 \delta_*(r)=e^{-r}\left\{
 e^r-\psi_C(e^r)-{1\over2}\log(1-e^{-2r})\right\}.    \tag{4.1}
\]

The cancellation-preserving source rewrite turns (3.4) into

\[
 Q^\uparrow_{jk}
 =\int_0^\infty\delta_*(r)
   \{\Omega'_{jk}(r)-\Omega_{jk}(r)\}\,dr,\qquad
 \Omega_{jk}=2(a_j*b_k).                              \tag{4.2}
\]

Here `a_j` is extended by zero outside `[0,L]`.  Define

\[
 (H_{\delta_*}b_k)(s)=\int_0^\infty
       \delta_*(s+t)b_k(t)\,dt,\qquad
 \beta_{h,k}=(H_{\delta_*}b_k)(h).                   \tag{4.3}
\]

The distributional derivative of `a_j 1_[0,L]` has a positive first jump
and a negative last jump.  Fubini therefore gives the exact identity

\[
\boxed{
\begin{aligned}
 Q^\uparrow_{jk}
 &=2a_j(0)\beta_{0,k}
 +2\int_0^L\{a'_j(s)-a_j(s)\}
       (H_{\delta_*}b_k)(s)\,ds\\
 &\quad-2a_j(L)\beta_{L,k}.
\end{aligned}}                                                \tag{4.4}
\]

At the physical uncut limit, inversion gives

\[
 a_j(0)=\overline {\Gamma_{{\rm in},j}},\qquad
 a_j(L)=\lambda\overline {\Gamma_{{\rm in},j}},      \tag{4.5}
\]

so the oriented endpoint part is

\[
 2\Gamma_{\rm in}^*(\beta_0-\lambda\beta_L).         \tag{4.6}
\]

Equation (4.4), rather than (4.6), is the stable formula at a finite
sampler cutoff.  The first boundary participates in the Plemelj/Carleman
completion and the last boundary is already part of the finite-length
correction.  Neither may be appended a second time.

## 5. A valid ordered finite-Fejer cross form

Let `f` be an admitted even source, `H=F_a f`, and let `omega_M` be a
finitely supported Fejer weight with `0<=omega_M(m)<=1` and
`omega_M(m)->1` for every fixed `m`.  Define the right profiles

\[
\begin{aligned}
 \mathfrak a_{f,M}(s)
 &={\sqrt\lambda\over2}\sum_{m\geq1}\omega_M(m)
       \{f+H\}(m\lambda e^{-s}),&0\leq s\leq L,\\
 b_{f,M}(t)
 &={\sqrt\lambda e^t\over2}\sum_{l\geq1}\omega_M(l)
       H(l\lambda e^t),&t\geq0.
\end{aligned}                                                \tag{5.1}
\]

Use `mathfrak a_(f,M)=e^(s/2)A_(f,M)` and
`b_(f,M)=e^(t/2)B_(f,M)` to define `X_(f,M)` on the central interval and
`O_(f,M)` on the right exterior, and reflect them with the same inversion
parity as the physical pair.  In the polarized formulas of Sections 3--4,
the conjugated first-slot profile is
`a_(j,M)=overline(mathfrak a_(f_j,M))`.  This gives honest functions and the
ordered cross form

\[
 Q^\uparrow_{M,L}(j,k)
 :=-\mathcal W_Z(X_{f_j,M},O_{f_k,M}).               \tag{5.2}
\]

The frozen Abel/Fejer convention for the full Poisson profiles is precisely
the ordered limit of (5.1).  Hence

\[
 \lim_{M\to\infty}^{\rm ordered}Q^\uparrow_{M,L}
 =-\mathcal W_Z(X,O)=Q_X.                            \tag{5.3}
\]

No finite-`M` global radical is used.  In general `X_(f,M)+O_(f,M)` does
not have the zeta-zero Mellin factor, and

\[
 \mathfrak a_{f,M}(L)\neq\lambda\mathfrak a_{f,M}(0). \tag{5.4}
\]

Thus `Q^uparrow_(M,L)` need not be Hermitian and need not equal
`q_lambda(X_M,X_M)`.  Its finite-cutoff Hermitian version is exactly

\[
 {Q^\uparrow_{M,L}+(Q^\uparrow_{M,L})^*\over2}
 =-{\mathcal W_Z(X_M,O_M)+\mathcal W_Z(O_M,X_M)\over2}. \tag{5.5}
\]

Let

\[
 u_n=\max\{\lambda/n,\lambda^{-1}\}.                 \tag{5.6}
\]

Substituting (5.1) into the prime line of (3.4), and changing variables
`u=lambda e^(-s)`, gives

\[
\boxed{
 Q^\uparrow_{p,M}(j,k)
 ={1\over2}\sum_{m,n,l}
 \omega_M(m)\Lambda(n)\omega_M(l)
 \int_{u_n}^{\lambda}
 \overline{\{f_j+H_j\}(mu)}H_k(l n u)\,du.}         \tag{5.7}
\]

Here `n>=2`, and the finite sampler supports make the `m,l` sums finite.
Equation (5.7) proves directly that in the upper orientation `m` is the
left label-`j` sampler and `ln` is the right label-`k` prime sampler.  It is
the ordered `W_(0,M,j)^* W_(1,M,k)` product.  The adjoint is
`W_(1,M,j)^* W_(0,M,k)`.  No scalar mask bridge is needed.

The continuous integral in (5.7) has its ordinary endpoint values.  If the
same sum is repartitioned into open mask cells, equality layers must be
split with midpoint half-weights so that the partition recombines to
(5.7).  Those half-rows are bookkeeping for the alternate representation;
adding them to (3.4) or (5.7) double-counts the source prime integral.

## 6. Laplace/Mellin diagnostic and exact finite-length tail

For `Re p,Re q>0`, `p!=q`, take

\[
 a(u)=e^{-pu},\qquad b(v)=e^{-qv},\qquad
 D(z)=\int_0^\infty\delta_*(r)e^{-zr}\,dr.            \tag{6.1}
\]

The exact transform is

\[
 D(z)={1\over z}
 +{\zeta'(z+1)/\zeta(z+1)\over z+1}
 +{\psi((z+3)/2)-\psi(1)\over2(z+1)}.               \tag{6.2}
\]

Consequently, with `s=p+1,t=q+1` and

\[
 g(s)={1\over2}s(s-1)\pi^{-s/2}\Gamma(s/2),\qquad
 \xi_R(s)=g(s)\zeta(s),                               \tag{6.3}
\]

the infinite-half-line carrier is

\[
\boxed{
 I_*(p,q)=2{(p+1)D(p)-(q+1)D(q)\over p-q}
 =2{{\xi_R'\over\xi_R}(s)-{\xi_R'\over\xi_R}(t)
       \over s-t}.}                                   \tag{6.4}
\]

For the finite inward interval put

\[
 A_z(L)=\int_0^L\delta_*(r)e^{-zr}\,dr,\qquad
 T_z(L)=\int_L^\infty\delta_*(r)e^{-zr}\,dr,\qquad
 E=e^{(q-p)L}.                                        \tag{6.5}
\]

Direct evaluation of the positive first boundary, the bulk, and the
negative last boundary in (4.4) gives

\[
\boxed{
\begin{aligned}
 {I_{*,L}(p,q)\over2}
 &={(p+1)A_p(L)-(q+1)A_q(L)
       +(q+1)(E-1)T_q(L)\over p-q},\\
 I_{*,L}(p,q)
 &=I_*(p,q)
 +{2\{(q+1)E T_q(L)-(p+1)T_p(L)\}\over p-q}.
\end{aligned}}                                                \tag{6.6}
\]

The diagonal is the continuous divided-difference limit.  Formula (6.6)
shows explicitly that the tail correction already contains the retained
last endpoint.

For a pure two-slot carrier define

\[
 Z_M(s)=\sum_m\omega_M(m)m^{-s},\qquad
 P_M(s)=-{\zeta'(s)\over\zeta(s)}Z_M(s).              \tag{6.7}
\]

The Laplace/Mellin image of the direct ordered infinite-half-line form is

\[
\boxed{
 K_M(s,t)={2\over s-t}\left[
 Z_M(s)P_M(t)-P_M(s)Z_M(t)
 +Z_M(s)Z_M(t)
 \left\{{g'\over g}(s)-{g'\over g}(t)\right\}
 \right].}                                           \tag{6.8}
\]

Its finite-length correction is

\[
\boxed{
 \Delta_{M,L}(s,t)
 ={2Z_M(s)Z_M(t)\over s-t}
 \{t e^{(t-s)L}T_{t-1}(L)-sT_{s-1}(L)\}.}           \tag{6.9}
\]

Thus the carrier-level direct source formula is `K_M+Delta_(M,L)`.
Appending the endpoint part of (4.4) once more would double-count it.
Equations (6.8)--(6.9) validate the core and tail terms proposed in the
earlier Xi-Wronskian assembly gate without any mask orientation table.
They do not turn a generic transition column into a pure exponential
carrier and do not license critical-line continuation of the tails.

## 7. The surviving full-profile Archimedean principal

Below the first prime location, `0<r<log 2`, the direct continuous kernel
in (3.4) is

\[
 k_{\rm cont}(r)
 ={2\over e^r-e^{-r}}-2(1+e^{-r})
 ={1\over r}-4+O(r).                                  \tag{7.1}
\]

The `1/r` coefficient is exactly `+1`; it comes only from the
Archimedean block.  The pole block is regular at zero and the prime block
has no support there.  Equivalently, after the boundary integration in
(4.4), the singular principal is the Carleman kernel

\[
 \int_0^L\int_0^\infty{a_j(s)b_k(t)\over s+t}\,dt\,ds. \tag{7.2}
\]

For the `m=l=1` flat Weber profiles, put

\[
\begin{gathered}
 c=2\pi\lambda^2,\qquad h={\pi\over4},\qquad
 \chi_0(\alpha)=(1+e^{-\pi\alpha/2})^{-1/2},\\
 X_\chi=\operatorname {diag}(\chi_0(\alpha_j)),\qquad
 E_h=\operatorname {diag}(e^{h\alpha_j}),\qquad
 Z_e=\operatorname {diag}(e_j/\sqrt {d_j}),\\
 {\mathsf H}_{jk}=(\alpha_j-\alpha_k)^{-1}\quad(j\neq k),
 \qquad {\mathsf H}_{jj}=0.
\end{gathered}                                                \tag{7.3}
\]

The frozen edge calculation converts the upper part of (7.2) into

\[
\boxed{
 U_{11,M}={\lambda\omega_M(1)^2\over2c}
 Z_e(I+X_\chi)E_h{\mathsf H}E_h^{-1}X_\chi Z_e.}    \tag{7.4}
\]

The coefficient in (7.4) is nonzero.  Kernels supported away from
`s+t=0`, kernels smooth at that corner, and finitely many endpoint rows
cannot cancel its full-profile conormal principal.  In particular the
Carleman kernel has infinite rank: for distinct positive `t_1,...,t_N`,
the rational functions `1/(s+t_j)` are linearly independent for every
`N`.  Multiplication and Weber conjugation preserve this rank statement.

This is not a spectral floor on the admitted transition columns.  A
regular same-order operator can cancel or dominate the matrix obtained
after compression to a special growing subspace even though it cannot
erase the full-profile singular symbol.  The sign and size of that
compressed complete assembly remain open.

## 8. Exact conclusion and remaining gate

The source-level ordered slot bridge is complete:

1. both physical boundaries give `X_j -> O_k`;
2. the adjoint gives `O_j -> X_k`;
3. (5.7) gives `W_(0,M,j)^*W_(1,M,k)` before scalar masks;
4. pole and Archimedean terms use the same ordered profiles by (3.4); and
5. the finite-length endpoint is already allocated by (4.4) and (6.6).

What remains is not a missing mask orientation table.  It is an operator
estimate for the complete source-level form after restriction to the
actual transition columns, including the regular kernel, the Weber edge,
edge--bulk crosses, and the full source congruence.  This note supplies no
such estimate and makes no complete-central positivity claim.
