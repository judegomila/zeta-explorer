# Klein phase transport and the bridge-coupling estimate

Research checkpoint, 2026-11-14. This is an independent derivation from the exact quotient and bridge definitions in the zeta-view repository. It does not prove RH or assert a new global bound for the theta bridge.

## Result

The Klein formulation makes the phase and orientation bookkeeping exact, and it supplies a useful amplitude-weighted phase formula for every bridge correlation. It does not improve the optimal relative coupling constant merely by folding the cover. That constant is invariant under the correct quotient isometry and, more generally, under invertible block congruences.

The useful quantitative target in the phase formulation is a bound on the amplitude-weighted negative correlations. At the operator level, the target is a relative bound on the actual bridge coupling, on its specified test space. The annulus supplies a more convenient positive reference operator for attempting that bound. Its reference energy cannot replace the theta bridge energy without an explicit comparison.

## 1. Scope and conventions

Let \(M=E_r\setminus\{p_+,p_-\}\), and let \(K=M/A\), where

\[
A(w,\eta)=(1/\bar w,-\bar\eta/\bar w^2).
\]

Use the flat conformal metric from the elliptic uniformization; \(A\) is an orientation-reversing isometry. Let \(f=F\circ s\), where \(F\) is completed xi, its symmetric real heat family, or a stated symmetric analytic control. Then

\[
f\circ A=\bar f,\qquad f\circ D=f.
\]

The second identity is the deck invariance. All phase formulas below exclude zeros and the essential punctures unless explicitly interpreted as currents.

In a positively oriented spectral chart \(x=\sigma-\tfrac12,t\), use

\[
*dx=dt,\qquad *dt=-dx.
\]

The flat spectral metric is only a local conformal representative. A spectral ramification point is handled in a regular elliptic coordinate; spectral gradients must not be used there as if the spectral coordinate were nonsingular.

## 2. Hodge duality removes a possible sign misunderstanding

Put

\[
u=\log|f|,\qquad j=\operatorname{Im}(df/f).
\]

The Cauchy--Riemann equations give

\[
\boxed{j=*du,\qquad *j=-du.}
\]

For example, if \(F'/F=q_r+iq_i\), then

\[
du=q_r\,dx-q_i\,dt,\qquad
j=q_i\,dx+q_r\,dt.
\]

Because \(u\circ A=u\),

\[
A^*du=du,\qquad A^*j=-j.
\]

An orientation-reversing isometry anticommutes with the Hodge star on one-forms:

\[
A^*(*\alpha)=-*A^*\alpha.
\]

Consequently

\[
\boxed{A^*(*j)=*j.}
\]

Thus \(j\) is a one-form with values in the orientation line bundle of the Klein surface, whereas \(-*j=du\) is an ordinary exact one-form on it. The sign reversal of phase is accompanied by the sign reversal of orientation. It does not produce two opposite physical zero charges that can be discarded.

For \(F=U+iV\), \(U\) is an ordinary scalar on the quotient and \(V\) is an orientation-valued scalar. This is the natural real rank-two field bundle \(\mathbb R\oplus o_K\). Treating both components as ordinary global scalars changes the problem.

## 3. Zero circulation and seam flux

Near a zero of order \(m\), in a regular complex coordinate \(\zeta\),

\[
f(\zeta)=a\zeta^m(1+O(\zeta)),\qquad
u=m\log|\zeta|+\log|a|+O(|\zeta|),
\]

\[
j=m\,d\arg\zeta+\operatorname{Im}(d\log(1+O(\zeta))).
\]

Therefore a small positively oriented circle has

\[
\oint j=2\pi m.
\]

Under a conjugating chart transition, both the orientation of the circle and the local phase sign reverse. The integer \(m\) remains nonnegative. On the oriented double cover, in the distributional convention \(\Delta=\partial_x^2+\partial_t^2\),

\[
dj=(\Delta u)\,dA
=2\pi\sum_z m_z\,\delta_z\,dA,
\]

away from the essential punctures. This descends as a positive orientation-valued top-degree current on \(K\), rather than as an alternating cancellation of zero orders. At a ramification point, the multiplicity is the pullback multiplicity in its regular elliptic coordinate.

The unweighted phase energy has the familiar local divergence

\[
\frac12\int_{\epsilon<|\zeta|<R}|j|^2dA
=\pi m^2\log(R/\epsilon)+O(1).
\]

It cannot be used as a finite global Lyapunov functional without defining subtractions and boundary terms.

On a zero-free truncated region \(\Omega\), Green's formula is

\[
\int_\Omega |du|^2dA
=\int_{\partial\Omega}u\,\partial_nu\,d\ell.
\]

When the Klein surface is cut into its fundamental annulus, the seam values obey

\[
u_1(gx)=u_0(x),\qquad
\partial_nu_1(gx)=-\partial_nu_0(x).
\]

The two seam terms cancel exactly after a change of boundary parameter. This is a sewing identity; it supplies no positive remainder. Nonzero terms remain at zero holes, infinity cutoffs and other genuine truncation edges. An essential puncture must not be filled just to obtain a compact-boundary cancellation.

## 4. What the phase flow can, and cannot, trap

On an oriented local chart, the phase-gradient vector is \(X=j^\sharp\). Its exact identity is

\[
du(X)=\langle du,*du\rangle=0.
\]

It transports probes along contours of \(\log|F|\). Around an isolated zero, sufficiently small regular contours can be closed, but this is neutral level-set confinement of tracers. It is not attraction, and it is not a law for moving zeros.

On the Klein quotient, \(j^\sharp\) is an orientation-valued vector. It defines local transport with a reversed clock on reversing charts, or an unoriented line field where it is nonzero. It is not automatically an ordinary global vector field with one time orientation.

In a chosen oriented chart, adding a dissipative term gives

\[
X_{\alpha,\beta}=\beta j^\sharp-\alpha(du)^\sharp,\qquad
du(X_{\alpha,\beta})=-\alpha|du|^2.
\]

For \(\alpha>0\), a compact regular sublevel region is forward invariant. This is a valid probe-capture construction, but the dissipative dynamics are additional data. A global Klein version must also specify how its phase coefficient transforms; an ordinary scalar coefficient cannot convert an orientation-valued phase vector into an ordinary global vector.

Actual heat zeros satisfy a different equation. For

\[
\partial_\tau F_\tau=\tfrac14F_\tau'',
\]

a simple zero \(\rho(\tau)\) obeys

\[
\boxed{\dot\rho=-\tfrac14F_\tau''(\rho)/F_\tau'(\rho).}
\]

Its phase residue records its multiplicity, not this velocity. A simple critical-line zero remains on the line locally by the reflection symmetry; the implicit-function argument fails at a multiple zero. The exact heat control

\[
F_\tau(s)=(s-\tfrac12)^2+\tau/2
\]

has total local circulation \(4\pi\) on both sides of its collision at \(\tau=0\), while its zeros are on the critical line for \(\tau>0\) and off that line for \(\tau<0\). Circulation conservation therefore does not exclude the collision mechanism.

## 5. Exact bridge correlations are weighted phase transport

Fix \(a>0\), and define the existing boundary trace

\[
U_a(t)=F(\tfrac12+a+it)=A_a(t)e^{i\theta_a(t)}.
\]

On an interval without zeros, choose a continuous unwrapped phase. Then

\[
\theta_a'(t)
=\operatorname{Re}\frac{F'}F(\tfrac12+a+it)
=j(\partial_t),
\]

\[
W(\tfrac12+a+it)=|U_a(t)|^2\theta_a'(t).
\]

For two distinct heights,

\[
\boxed{
P_a(t_1,t_2)=
\frac{A_a(t_1)A_a(t_2)}
{a(t_2-t_1)}
\sin\!\left(\int_{t_1}^{t_2}j(\partial_t)\,dt\right).
}
\]

At zeros of the trace, the original Cartesian numerator remains the definition; a nonexistent phase must not be assigned by this formula.

Equivalently, the numerator is the oriented area

\[
\operatorname{Im}(\bar U_a(t_1)U_a(t_2))
=\det\begin{pmatrix}\operatorname{Re}U_a(t_1)&\operatorname{Re}U_a(t_2)\\
\operatorname{Im}U_a(t_1)&\operatorname{Im}U_a(t_2)\end{pmatrix}.
\]

The critical reflection sends \(a\mapsto-a\) and \(U_a\mapsto\bar U_a\). It reverses both this determinant and the factor \(a\) in the denominator. Hence

\[
\boxed{P_{-a}=P_a.}
\]

The signed bridge correlations survive the conjugating quotient exactly. In particular, phase reversal does not remove the negative off-diagonal entries.

For the height pair \(t-r,t+r\), set

\[
\Delta_a(t,r)=\int_{t-r}^{t+r}\theta_a'(v)\,dv,\qquad
C_a(t,r)=\frac{A_a(t-r)A_a(t+r)}{2ar}\sin\Delta_a(t,r).
\]

The existing even/odd energy identity becomes

\[
\boxed{\frac{W_h(t)}h
=E_+(t)-E_-(t)
=\int_0^\infty\omega_{a,h}(r)C_a(t,r)\,dr.}
\]

This is the useful phase-transport formulation of the same estimate. It is an identity, not a new inequality.

## 6. A rigorous positive-core / negative-tail certificate

The phase formula yields a sufficient bound with all missing information visible. Suppose \(0<h<a\), the boundary trace is nonzero on \([t-R,t+R]\), and

\[
0<\mu\le\theta_a'(v)\le M
\quad(t-R\le v\le t+R),\qquad
R\le\frac{\pi}{4M}.
\]

Then \(2\mu r\le\Delta_a(t,r)\le\pi/2\) for \(0\le r\le R\). The elementary inequality \(\sin y\ge2y/\pi\) on this interval gives

\[
C_a(t,r)\ge
\frac{2\mu}{\pi a}A_a(t-r)A_a(t+r).
\]

For \(r>R\), retain the absolute bound \(\sin\Delta\ge-1\). Thus

\[
\boxed{
\frac{W_h(t)}h\ge
\frac{2\mu}{\pi a}
\int_0^R\omega_{a,h}(r)A_a(t-r)A_a(t+r)\,dr
-
\int_R^\infty\omega_{a,h}(r)
\frac{A_a(t-r)A_a(t+r)}{2ar}\,dr.
}
\]

Positivity of the right-hand side is a genuine sufficient certificate. It is not known uniformly for the actual theta boundary data in the required \(h,t\) range.

The tail admits an explicit elementary kernel envelope. Let \(\beta=\pi h/a\), \(q=e^{-\pi r/a}\). The exact density can be written

\[
\omega_{a,h}(r)=
\frac{2\pi r\sin\beta}{ah}
\frac{q(1-q^2)}{(1+2q\cos\beta+q^2)^2}.
\]

Since \(1+2q\cos\beta+q^2\ge(1-q)^2\), for \(r\ge R>0\),

\[
\omega_{a,h}(r)
\le\frac{2\pi\sin\beta}{ah(1-e^{-\pi R/a})^4}
r e^{-\pi r/a}.
\]

The absolute negative-tail term is therefore at most

\[
\boxed{
\frac{\pi\sin(\pi h/a)}
{a^2h(1-e^{-\pi R/a})^4}
\int_R^\infty e^{-\pi r/a}A_a(t-r)A_a(t+r)\,dr.
}
\]

This bound requires an amplitude envelope, not merely a phase-speed bound. Its \(h\downarrow0\) prefactor has the finite limit
\(\pi^2/[a^3(1-e^{-\pi R/a})^4]\). The endpoint \(h=a\) uses the separate point measure and is not evaluated through this density estimate.

One can sharpen this certificate by integrating the actual positive phase windows rather than only \(0\le r\le R\), and bounding only the complement. That improves a computable bound without changing the target. It still requires certified phase and amplitude bounds and an infinite-tail estimate.

## 7. Monotone boundary phase and boundary PSD are insufficient

An exact polynomial control demonstrates why the tail condition cannot be dropped. Take

\[
F_\delta(s)=(s-\tfrac12)^2-\delta^2,\qquad a>\delta>0.
\]

On the outer boundary,

\[
U_a(t)=a^2-\delta^2-t^2+2iat,\qquad
\theta_a'(t)=
\frac{2a(a^2-\delta^2+t^2)}{|U_a(t)|^2}>0.
\]

Its kernel is

\[
P_a(t_1,t_2)=2(a^2-\delta^2+t_1t_2).
\]

This is a PSD rank-two Gram kernel because
\(P_a=2\langle(\sqrt{a^2-\delta^2},t_1),
(\sqrt{a^2-\delta^2},t_2)\rangle\).
Nevertheless

\[
C_a(t,r)=2(a^2-\delta^2+t^2-r^2)
\]

becomes negative for large enough \(r\). At \(t=0\), the sign change occurs at
\(R_0=\sqrt{a^2-\delta^2}\), exactly where the unwrapped phase advance crosses \(\pi\).

The energy components are

\[
E_+=2(a^2-\delta^2+t^2),\qquad
E_-=2(a^2-h^2),
\]

\[
\boxed{E_+-E_-=2(h^2+t^2-\delta^2).}
\]

Thus outer monotone phase and a PSD starting-boundary kernel coexist with negative inward shear for \(h^2+t^2<\delta^2\). This is a negative control for a proposed argument, not a counterexample to RH.

For \(a=1,\delta=0.4,h=0.2,t=0\), 50-digit mpmath quadrature independently gave

| Quantity | Value |
|---|---:|
| Probability mass | \(1\) |
| Second moment | \(0.96\) |
| Positive correlation contribution | \(0.58380240304243031712545466301422048\) |
| Absolute negative contribution | \(0.82380240304243031712545466301422048\) |
| Signed total | \(-0.24\) |
| Exact direct shear | \(-0.24\) |

The exact algebraic formulas establish the negative result; the quadrature only checks their numerical implementation.

## 8. The sharp relative coupling target and quotient invariance

Write the actual bridge block form, with its own admissible test spaces and domains, as

\[
Q=
\begin{pmatrix}E&B^*\\B&D\end{pmatrix}.
\]

This notation matches the requested Schur target
\(S=E-B^*D^{-1}B\); the application's live/frozen letters differ.

When \(E,D\) are strictly positive and the expressions are bounded on the relevant energy spaces, define

\[
T=D^{-1/2}BE^{-1/2}.
\]

Then

\[
\boxed{S=E^{1/2}(I-T^*T)E^{1/2},\qquad
S\ge0\iff\|T\|\le1.}
\]

A strict bound \(\|T\|\le c<1\) gives
\(S\ge(1-c^2)E\).

An equivalent form that does not silently invert a zero mode is

\[
\boxed{
|\langle Bx,y\rangle|^2
\le\langle Ex,x\rangle\,\langle Dy,y\rangle
\quad\text{for all admissible }x,y.
}
\]

For a Hermitian block form with \(E,D\ge0\), this inequality is equivalent to \(Q\ge0\): sufficiency follows by bounding the cross term by the geometric mean; necessity follows by testing arbitrary scalar multiples of \(x,y\). It also forces the required compatibility with nullspaces.

Now take correct invertible changes of coordinates \(S_E,S_D\):

\[
E'=S_E^*ES_E,\quad D'=S_D^*DS_D,\quad B'=S_D^*BS_E.
\]

Let

\[
U_E=E^{1/2}S_E(E')^{-1/2},\qquad
U_D=D^{1/2}S_D(D')^{-1/2}.
\]

Both are unitary, and direct multiplication gives

\[
\boxed{T'=U_D^*TU_E,\qquad \|T'\|=\|T\|.}
\]

This includes a faithful quotient representation. More concretely, the normalized pullback \(q\mapsto2^{-1/2}\pi^*q\) is a real-Hilbert-space isometry from sections of \(\mathbb R\oplus o_K\) to the equivariant subspace on the oriented cover. If the actual operator and domain preserve the corresponding real structure, its quotient is conjugated by this isometry.

With unnormalized pullbacks the cover's three blocks all acquire the same factor:

\[
E_M=2E_K,\quad D_M=2D_K,\quad B_M=2B_K,
\qquad S_M=2S_K.
\]

The normalized coupling constant remains identical. Halving the domain does not produce a factor-of-two improvement in the relative estimate.

This conclusion requires a faithful representation of the actual test space. Restricting to a convenient parity sector without proving equivalence can delete the very negative direction under investigation.

## 9. A conjugating symmetry does not force the coupling block to vanish

Consider the finite Hermitian control

\[
Q_b=\begin{pmatrix}1&ib\\-ib&1\end{pmatrix},
\qquad
J(z_1,z_2)=(\bar z_1,-\bar z_2).
\]

\(J\) is antiunitary, \(J^2=1\), and \(Q_bJ=JQ_b\). Its diagonal blocks are positive. Its fixed real subspace consists of vectors \((x,iy)\), and on that subspace

\[
\langle Q_b(x,iy),(x,iy)\rangle=x^2+y^2-2bxy.
\]

The conjugating symmetry simply changes the displayed imaginary coupling into an ordinary real coupling. The eigenvalues remain \(1\pm b\), and the Schur complement remains \(1-b^2\). Choosing \(b=11/10\) gives a negative Schur complement \(-21/100\).

This is an algebraic negative control for a symmetry-only block-diagonalization claim. It does not purport to be the theta bridge operator.

## 10. What to carry into the annulus proof attempt

The exact Klein model is useful for enforcing the correct bundle and seam rules and for expressing the bridge correlations through phase transport. The annulus is better suited to displaying boundary traces and a positive Dirichlet-to-Neumann reference form.

A concrete sufficient comparison, on subspaces where the reference forms are positive, would be

\[
E\ge eP_E,\qquad D\ge dP_D,\qquad
\|P_D^{-1/2}BP_E^{-1/2}\|\le b,
\]

which implies

\[
S\ge(e-b^2/d)P_E.
\]

The target is therefore \(b^2\le ed\), with strict inequality giving a margin. The constants must be proved for the actual theta bridge, its admissible test functions, and its infinity limits. The annulus DtN spectrum alone does not provide them.

Actual loaded fields also obey \(f\circ D=f\). On the fundamental annulus,
\(D(u,v)=(\tfrac12-u,1-v)\), exchanging the two boundaries and fixing the two interior branch points. Arbitrary smooth annulus boundary data form a larger class than the actual xi pullbacks; deck symmetry and essential-puncture asymptotics must be retained.

Changing the torus parameter \(r\) changes the explicit annulus reference spectrum, but it is only a coordinate/reference change for fixed spectral bridge data. Any claimed improvement must survive carrying the full operator and weights through that change. The invariant relative coupling norm supplies a useful audit of such a claim.

## 11. Specialization to the actual verified-head residual

The frozen Math Explorer checkpoint
[theta_rational_residual_20261109.md, §4](https://github.com/judegomila/mathexplorer/blob/146ce77aa8407e912ed54c73e30664d86936c253/rigorous/theta-fourth-stage-2026-11-09/theta_rational_residual_20261109.md)
states the finite-node decomposition

\[
P_L=H+E,\qquad
\mathbb C^N=\operatorname{ran}H\oplus\ker H.
\]

Here \(H\) is the verified positive head and \(E\) is the actual residual, not an arbitrarily selected perturbation. In that decomposition,

\[
P_L=
\begin{pmatrix}
A&E_{RK}\\E_{KR}&E_{KK}
\end{pmatrix},\qquad A=H_R+E_{RR}.
\]

When \(A>0\), the exact unresolved condition is

\[
\boxed{
S_K=E_{KK}-E_{KR}A^{-1}E_{RK}\succeq0.
}
\]

A faithful quotient carries \(\ker H\) to the kernel of the represented head and carries the range to its represented range. It conjugates all four blocks and \(S_K\); it cannot turn a head-null vector into a direction with a verified head margin.

If \(E_{KK}>0\), the precise normalized target is

\[
\boxed{
\left\|A^{-1/2}E_{RK}E_{KK}^{-1/2}\right\|\le1.
}
\]

The same constant is obtained on the cover, on the Klein real bundle, and in a faithful annulus representation. If \(E_{KK}\) has a null vector \(k\), positivity requires \(E_{RK}k=0\); otherwise

\[
\langle S_Kk,k\rangle
=-\|A^{-1/2}E_{RK}k\|^2<0.
\]

This is the most immediate null-sector audit. Neither a positive annulus reference eigenvalue nor the verified \(H_R\) gap supplies the missing sign of \(E_{KK}\).

A conditional quantitative version is useful for a proof attempt. If, on the actual node/test spaces,

\[
H_R\ge h_0I,\quad E_{RR}\ge-\delta I,\quad
E_{KK}\ge eI,\quad \|E_{RK}\|\le b,\qquad \delta<h_0,
\]

then

\[
\boxed{
S_K\ge
\left(e-\frac{b^2}{h_0-\delta}\right)I.
}
\]

The necessary new work is therefore a lower sign bound \(e\) on the actual head-null residual together with a coupling bound \(b\). An absolute small bound on the whole residual does not supply \(e\): any negative amount on a head-null vector defeats positivity. More refined weighted reference forms can replace the identity, but they do not remove this obligation.

The same checkpoint's equation (4.4) is

\[
\Delta_{2m}^{\mathrm{full}}(x)
\le Q_{\mathrm{tail}}(v_{\mathrm{head\text{-}null}}).
\]

The head-null trial vector supplies an upper bound on the full minimized Schur residual. A positive trial value is therefore not a positivity certificate for that minimum. The quotient preserves this variational direction; it does not convert that upper bound into the lower bound needed for the proof.

If \(A\) is only semidefinite, the checkpoint correctly requires a range condition and a generalized Schur treatment. The formulas with an ordinary inverse above are explicitly limited to \(A>0\).

## Sources and verification

- Exact geometric conventions: zeta-view/docs/KLEIN-ANNULUS.md and zeta-view/dist/quotient.js.
- Actual bridge density, energies and Gram blocks: zeta-view/docs/BRIDGE-RESEARCH.md and zeta-view/dist/research-math.js.
- Actual verified-head/null-space residual: [Math Explorer frozen checkpoint, §4](https://github.com/judegomila/mathexplorer/blob/146ce77aa8407e912ed54c73e30664d86936c253/rigorous/theta-fourth-stage-2026-11-09/theta_rational_residual_20261109.md).
- Standard local zero multiplicity, reflection and argument-principle background: [NIST DLMF §1.10](https://dlmf.nist.gov/1.10).
- The Hodge parity, phase-correlation formula, core/tail inequality, congruence invariance and finite negative controls above are derived explicitly in this note.
- The numerical illustration was evaluated at 50 decimal digits with mpmath. It is not an interval certificate, and its exact polynomial formulas are the proof of the stated obstruction.
