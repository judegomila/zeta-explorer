# Exact theta modular dynamics, a positive Volterra system, and two transfer obstructions

Research note, 8 November 2026. The calculations below retain the exact Jacobi theta structure at every derivative order. They construct a positive canonical system, then show that its natural Weyl coefficient does not equal the xi logarithmic derivative. A separate argument excludes a proposed positive Gaussian-mixture coefficient for the actual theta kernel. Neither result proves or disproves RH, and no novelty claim is made.

## 1. Normalizations and a closed polynomial system

Put \(t=e^u\) and use standard Jacobi theta constants

\[
T_j(t)=\theta_j(0\mid it),\qquad
\vartheta(t)=T_3(t)=\sum_{n\in\mathbb Z}e^{-\pi n^2t},
\]

\[
H(u)=e^{u/4}\vartheta(e^u),\qquad
\kappa=(D_u^2-1/16)H.
\]

Let \(X=T_2^4\), \(Y=T_4^4\), and \(E=E_2(it)\), with

\[
E_2(\tau)=1-24\sum_{n\ge1}\frac{n e^{2\pi in\tau}}{1-e^{2\pi in\tau}}.
\]

The standard theta differential identities, together with \(T_3^4=X+Y\), give

\[
\partial_t\log T_3=-\frac\pi{12}(E+X-Y),
\]

\[
\partial_t X=-\frac\pi3X(E+X+2Y),\quad
\partial_t Y=-\frac\pi3Y(E-2X-Y),\quad
\partial_t E=-\frac\pi6(E^2-X^2-XY-Y^2).
\]

These normalizations follow from Proposition 1, equation (8), of Brezhnev--Lyakhovich--Sharapov, with their Weierstrass \(\eta=\pi^2E_2/12\). The quartic theta identity is also DLMF 20.7.5. Sources:

- https://arxiv.org/pdf/1012.1429
- https://dlmf.nist.gov/20.7.E5

Define real functions along the positive imaginary modular axis by

\[
a=\frac{H'}H=\frac14-\frac{\pi t}{12}(E+X-Y),\quad
c=\pi t(Y-X),\quad v=\pi^2t^2XY.
\]

A direct change of variables gives the exact polynomial system

\[
\boxed{
a'=2a^2+\frac{v-1}{8},\qquad
c'=4ac+2v,\qquad
v'=v(8a-c).
} \tag{1}
\]

Also

\[
\boxed{q:=\frac\kappa H=3a^2+\frac v8-\frac3{16}.} \tag{2}
\]

At \(u=0\),

\[
a(0)=c(0)=0,\quad
v_0=\pi^2\theta_2(0\mid i)^8
=\pi^2\theta_4(0\mid i)^8,
\]

\[
H_0=\theta_3(0\mid i),\qquad
q_0=\frac{2v_0-3}{16}>0,\qquad
a_1:=a'(0)=\frac{v_0-1}{8}>0.
\]

The approximate value \(v_0=4.78926794949\ldots\) is only a normalization aid; no proof below depends on this decimal.

### All derivative orders and exact modular parity

Let \(\mathcal V\) be the polynomial vector field in (1). Then

\[
\kappa^{(n)}(u)=H(u)R_n(a(u),c(u),v(u)),\qquad
R_0=q,\quad R_{n+1}=(\mathcal V+a)R_n. \tag{3}
\]

Every \(R_n\) is a polynomial with rational coefficients. This is an exact recurrence, with no finite theta-index truncation.

The modular transformation gives \(H(-u)=H(u)\), \(a(-u)=-a(u)\), \(c(-u)=-c(u)\), and \(v(-u)=v(u)\). The vector field reverses parity under \((a,c,v)\mapsto(-a,-c,v)\). Consequently induction in (3) proves

\[
R_n(-a,-c,v)=(-1)^nR_n(a,c,v).
\]

In particular every odd endpoint derivative vanishes exactly. This preserves the cancellation that a finite theta-index approximation can lose.

The recurrence by itself is not a positivity theorem. For example, the region \(a,c\ge0\), \(v>0\), \(q\ge0\) is not invariant for general initial data of (1). On its boundary \(q=0\),

\[
q'=\frac3{16}(1-16a^2)(10a-c).
\]

At \((a,c,v)=(1/8,2,9/8)\), this is \(-27/256<0\). Moreover, the two off-diagonal Jacobian entries linking \(c\) and \(v\) have product

\[
(\partial_v c')(\partial_c v')=2(-v)=-2v<0.
\]

No fixed diagonal sign change can therefore turn this variational system into a cooperative system with every off-diagonal entry nonnegative. These facts exclude those particular coordinate-cone arguments, not every possible invariant cone.

## 2. A positive two-state system from the exact theta trajectory

Introduce

\[
w=\frac1{16}-a^2,\qquad d=c-16a.
\]

Equations (1)--(2) yield

\[
\boxed{
\begin{aligned}
a'&=q+w,\\
d'&=4ad+32a^2+2,\\
q'&=-(d+2a)q-3w(d+6a),\\
w'&=-2a(q+w).
\end{aligned}} \tag{4}
\]

### Signs on the actual theta trajectory

These signs require the actual theta solution, rather than arbitrary initial data of the polynomial system.

For \(u\ge0\), every term in the exact series

\[
\kappa(u)=e^{u/4}\sum_{n\ge1}
\bigl[2(\pi n^2e^u)^2-3\pi n^2e^u\bigr]e^{-\pi n^2e^u}
\]

is positive. Thus \(q>0\). Also
\(a=1/4+t\vartheta'(t)/\vartheta(t)<1/4\), since \(\vartheta'(t)<0\).
Starting at \(a(0)=0\), the equation
\(a'=q+1/16-a^2\) prevents \(a\) from crossing zero downward. Therefore

\[
0<a(u)<1/4,\qquad w(u)>0\qquad(u>0).
\]

Here \(v>0\) follows directly from its theta definition. The equations for \(c\) and \(d\), with \(c(0)=d(0)=0\), give \(c(u)>0\) and \(d(u)>0\) for \(u>0\). Thus (4) further gives \(q'<0\), \(w'<0\), and \(a'>0\). None of these sign arguments assumes RH or an all-orders jet inequality.

The commutator coefficient also has an exact modular expression:

\[
-\frac{\kappa'}{\kappa}
=d+a+\frac{3w(d+6a)}q>0,\qquad
b(u)=\frac{u}{d+a+3w(d+6a)/q}. \tag{4a}
\]

This proves \(\kappa'<0\) on the positive real axis directly from this system and makes every derivative of \(b\) computable within the same differential field. It does not assign signs to all of those derivatives.

Define

\[
U=\frac{q}{vH^6},\qquad V=H^2w,
\]

and positive coefficients, for \(u>0\),

\[
\boxed{
\beta=\frac{3(d+6a)}{vH^8},\qquad
\gamma=2avH^8.
} \tag{5}
\]

Using \(H'=aH\) and \(v'/v=-(d+8a)\), all diagonal terms cancel:

\[
\boxed{U'=-\beta V,\qquad V'=-\gamma U.} \tag{6}
\]

This is an exact theta-specific positive backward propagation system.

### Origin and infinity

The values at the regular left endpoint are

\[
U_0=\frac{q_0}{v_0H_0^6},\qquad
V_0=\frac{H_0^2}{16}.
\]

Since \(d'(0)=2\) and \(a'(0)=a_1\),

\[
\beta(u)=\beta_1u+O(u^3),\qquad
\gamma(u)=\gamma_1u+O(u^3),
\]

\[
\beta_1=\frac{3(2+6a_1)}{v_0H_0^8}>0,
\qquad
\gamma_1=2a_1v_0H_0^8>0. \tag{7}
\]

The exact theta series at infinity gives, with \(t=e^u\),

\[
H\sim t^{1/4},\quad
q\sim2\pi^2t^2e^{-\pi t},\quad
v\sim16\pi^2t^2e^{-\pi t},\quad
w\sim\pi t e^{-\pi t},\quad c\sim\pi t.
\]

Therefore

\[
\boxed{
\begin{aligned}
U&\sim\tfrac18e^{-3u/2},&
V&\sim\pi e^{3u/2-\pi e^u},\\
\beta&\sim\tfrac{3}{16\pi}e^{-3u+\pi e^u},&
\gamma&\sim8\pi^2e^{4u-\pi e^u}.
\end{aligned}} \tag{8}
\]

In particular \(U,V\to0\). Integrating (6) from infinity gives the positive Volterra identities

\[
\boxed{
U(u)=\int_u^\infty\beta(s)V(s)\,ds,
\qquad
V(u)=\int_u^\infty\gamma(s)U(s)\,ds.
} \tag{9}
\]

All displayed integrals converge by (8). Differentiating the product also gives an exact positive energy identity:

\[
\boxed{
U_0V_0=\int_0^\infty
\bigl(\gamma U^2+\beta V^2\bigr)\,du>0.
} \tag{10}
\]

This energy is attached to the modular pair \((U,V)\). It has not been identified with the cutoff-energy form for arbitrary derivative pulses.

## 3. A positive canonical lift and a proved mismatch with the xi target

Let

\[
J=\begin{pmatrix}0&-1\\1&0\end{pmatrix},\qquad
\mathscr H(u)=\operatorname{diag}(\gamma(u),\beta(u)).
\]

Consider the canonical system with a new spectral parameter \(z\):

\[
Y'(u,z)=zJ\mathscr H(u)Y(u,z). \tag{11}
\]

Its Hamiltonian is positive definite for \(u>0\), locally integrable at zero, and has divergent trace integral at infinity by (8). Thus the right endpoint is limit point. Standard canonical-system theory supplies a Weyl coefficient. The convention here is

\[
q_{\rm can}(z)=-\frac{Y_2(0,z)}{Y_1(0,z)}
\]

for the square-integrable Weyl solution; this convention has positive imaginary part in the upper half-plane.

At the single spectral value \(z=i\), the exact theta state is

\[
Y(u,i)=(U(u),-iV(u))^T.
\]

It satisfies (11), and (10) proves its weighted square integrability. Hence

\[
q_{\rm can}(i)=i\frac{V_0}{U_0}
=i\frac{v_0H_0^8}{16q_0}
=i\frac{4v_0^2}{\pi^2(2v_0-3)}. \tag{12}
\]

For the final equality, use \(H_0^8=4v_0/\pi^2\), a consequence of the quartic theta identity at \(t=1\).

The new spectral parameter is not the original theta modulus \(u\), nor has it been identified with the xi argument. The following test shows that the natural lift does not already have the required xi impedance.

### Elementary high-energy audit

For \(z=iy\), \(y>0\), finite right-endpoint Dirichlet approximants have the real form \((U_y,-iV_y)\) with nonnegative slope \(m_y=V_y/U_y\) when propagated backward. Their Riccati equation is

\[
m_y'=y(\beta m_y^2-\gamma). \tag{13}
\]

Fix a small \(\delta>0\), and choose positive constants \(r_-\), \(r_+\) so that

\[
r_-\le\sqrt{\gamma(u)/\beta(u)}\le r_+
\qquad(0<u\le\delta).
\]

Write \(B_\delta=\int_0^\delta\beta(u)\,du>0\). After using \(\tau=\int_0^u\beta\) and reversing direction from \(\delta\) to zero, (13) becomes

\[
\frac{dm}{d\ell}=y(r(\ell)^2-m^2).
\]

Scalar comparison with the constant-coefficient solutions beginning at zero and at positive infinity gives, uniformly over every nonnegative terminal slope,

\[
r_-\tanh(yr_-B_\delta)
\le m_y(0)\le
r_+\coth(yr_+B_\delta). \tag{14}
\]

The same bounds pass to the Weyl limit of the finite-endpoint approximants. Letting \(y\to\infty\), then \(\delta\downarrow0\), and using (7), proves

\[
\boxed{
q_{\rm can}(iy)\longrightarrow
i\sqrt{\gamma_1/\beta_1}\qquad(y\to\infty).
} \tag{15}
\]

This also follows from standard regular-endpoint canonical asymptotics after the reparameterization \(x=u^2/2\), which gives a finite positive diagonal Hamiltonian at zero. Argument (14) makes the particular limit self-contained apart from standard Weyl existence and convergence.

For the target \(F(s)=\xi(1/2+s)\), the corresponding candidate is

\[
q_\xi(z)=i\frac{F'(-iz)}{F(-iz)}.
\]

Along the positive imaginary axis, Stirling's formula and the convergent Dirichlet series at large positive real argument give, unconditionally,

\[
q_\xi(iy)=\frac i2\log\!\left(\frac{y}{2\pi}\right)+O(1/y),
\qquad y\to\infty. \tag{16}
\]

It diverges, in contrast with (15). Therefore this natural positive canonical lift does not have the desired xi Weyl coefficient. Constant diagonal gauge changes and fixed positive spectral scalings preserve finiteness of the limit in (15), so they cannot repair the mismatch. This does not rule out a different, singular endpoint construction or a more substantial transformation.

The companion [endpoint note](theta_logarithmic_endpoint_20261108.md) strengthens this conclusion to every fixed real symplectic boundary normalization, gives an exact mismatch at `z=i`, and constructs a different positive endpoint with the correct leading logarithmic growth. That auxiliary endpoint is not identified with xi.

For standard canonical-system definitions, Weyl limits, and endpoint asymptotics see:

- Langer--Pruckner--Woracek, *Estimates for the Weyl coefficient of a two-dimensional canonical system*, https://arxiv.org/abs/2106.07391 .
- Eckhardt--Kostenko--Teschl, *Spectral asymptotics for canonical systems*, https://arxiv.org/abs/1412.0277 .

## 4. First integral and projective geometry

The quartic theta identity gives

\[
W:=\sqrt{c^2+4v}=\pi H^4.
\]

Indeed (1) gives \((W^2)'=8aW^2\), so \(W/H^4\) is constant. Define

\[
\eta=\operatorname{artanh}(c/W)
=2\log(T_4/T_2).
\]

Then

\[
\eta'=W/2=\pi H^4/2,\qquad
v=(\eta')^2\operatorname{sech}^2\eta,
\]

\[
\{\eta,u\}:=\frac{\eta'''}{\eta'}
-\frac32\left(\frac{\eta''}{\eta'}\right)^2
=\frac{v-1}{2}. \tag{17}
\]

These identities relate the modular lift to a projective differential equation. They do not supply the missing cutoff-energy inequality or alter the explicit Weyl mismatch above.

## 5. Exact rational cusps exclude a Gaussian-mixture commutator coefficient

Recall the coefficient in the previously derived jet commutator identity:

\[
b(u)=-\frac{u\kappa(u)}{\kappa'(u)}>0\quad(u>0),
\qquad B(x)=b(\sqrt x)\quad(x>0).
\]

A possible way to organize derivatives of every order would be a positive mixture

\[
b(u)=\int_{[0,\infty)}e^{-s u^2}\,d\mu(s). \tag{18}
\]

Such a representation would make \(B\) completely monotone. It was only a candidate building block; no assertion that it alone would settle the energy theorem is needed here.

### Theorem: the actual theta coefficient has no full right-half-plane extension

There is no holomorphic function on \(\Re x>0\) whose restriction to positive real \(x\) equals \(B(x)\). In particular (18) is impossible for a nonnegative measure, and \(B\) is not completely monotone on \((0,\infty)\).

**Proof.** First compute an exact family of theta cusp asymptotics. Choose positive coprime integers \(m,n\) with \(n\) odd, and set

\[
t_0=2im/n,\qquad t=\epsilon+t_0,\qquad\epsilon\downarrow0.
\]

Splitting the theta sum into residue classes modulo \(n\), then applying Poisson summation to each Gaussian arithmetic progression, gives

\[
\vartheta(\epsilon+t_0)
=\frac1{n\sqrt\epsilon}
\sum_{\ell\in\mathbb Z}e^{-\pi\ell^2/(n^2\epsilon)}
\sum_{r=0}^{n-1}e^{-2\pi imr^2/n}e^{2\pi i\ell r/n}.
\]

The zero-frequency Gauss sum

\[
G_{m,n}=\sum_{r=0}^{n-1}e^{-2\pi imr^2/n}
\]

has \(|G_{m,n}|^2=n\). To verify this, expand the square and make the invertible change \((r,s)\mapsto(r-s,r+s)\) modulo the odd integer \(n\). The resulting double sum of \(e^{-2\pi imab/n}\) equals \(n\), because \(m\) is coprime to \(n\). In particular the leading coefficient is nonzero.

Thus

\[
\vartheta(\epsilon+t_0)
=\frac{G_{m,n}}{n}\epsilon^{-1/2}
+O(\epsilon^{-1/2}e^{-\pi/(n^2\epsilon)}).
\]

Termwise differentiation of the exponentially convergent Poisson series gives the corresponding differentiated asymptotics through every fixed order. For \(u=\log t\), on the branch with \(0<\Im u<\pi/2\),

\[
\kappa(u)=t^{1/4}\left[t^2\vartheta''(t)+\frac32t\vartheta'(t)\right].
\]

Consequently, writing \(C=G_{m,n}/n\ne0\),

\[
\kappa(\log t)\sim\frac34 C t_0^{9/4}\epsilon^{-5/2},
\qquad
\kappa'(\log t)\sim-\frac{15}{8}C t_0^{13/4}\epsilon^{-7/2},
\]

and therefore

\[
b(\log t)\sim\frac{2\log t_0}{5t_0}\epsilon\longrightarrow0. \tag{19}
\]

Now suppose a holomorphic extension \(\mathcal B\) of \(B\) exists on \(\Re x>0\). The theta series is holomorphic for \(|\Im u|<\pi/2\). On the connected domain

\[
\mathcal W=\{u:\Re u>|\Im u|,\ |\Im u|<\pi/2\},
\]

the function

\[
\kappa'(u)\mathcal B(u^2)+u\kappa(u)
\]

is holomorphic and vanishes for positive real \(u\). It therefore vanishes throughout \(\mathcal W\). Cross multiplication is deliberate: it avoids assuming that \(\kappa'\) has no complex zeros.

Choose \(2m/n>e^{\pi/2}\). The limiting point

\[
u_0=\log(2m/n)+i\pi/2,\qquad x_0=u_0^2
\]

satisfies \(\Re x_0>0\). For sufficiently small \(\epsilon>0\), the approaching points \(u=\log(\epsilon+2im/n)\) lie in \(\mathcal W\), and \(\kappa'(u)\ne0\) by its nonzero leading asymptotic. Equation (19) and continuity of \(\mathcal B\) imply \(\mathcal B(x_0)=0\).

Reduced positive rationals \(2m/n\) with odd denominator are dense. Restricting, for example, to \(e^2<2m/n<e^3\), their squared logarithmic cusp points have accumulation points strictly inside \(\Re x>0\). The identity theorem forces \(\mathcal B\equiv0\), contradicting \(B(x)>0\) for real \(x>0\).

Finally, a positive Laplace representation \(\mathcal B(x)=\int e^{-sx}d\mu(s)\), finite for every positive real \(x\), is holomorphic on \(\Re x>0\) by dominated differentiation on compact subsets. This excludes (18). Bernstein's representation theorem then excludes complete monotonicity. \(\square\)

Poisson summation is recorded at https://dlmf.nist.gov/1.8.iv . For Bernstein's representation theorem see Schilling--Song--Vondraček, *Bernstein Functions: Theory and Applications*, Theorem 1.4, https://doi.org/10.1515/9783110269338 . The cusp proof itself is supplied in full above.

This obstruction concerns the actual theta coefficient, not an auxiliary counterexample. It does not imply that a specific low-order derivative sign fails, and it excludes neither every change of variables nor every possible positive representation of the full energy form.

## 6. What has and has not been achieved

The exact nonlinear theta system provides an all-orders algebraic recurrence, a positive two-state Volterra realization, and a genuine positive canonical Hamiltonian with a verified finite-energy theta state. Its natural Weyl coefficient, however, has the wrong high-energy behavior for the xi logarithmic derivative. A positive Gaussian-mixture representation for the commutator coefficient is separately impossible because of the exact rational cusps.

The remaining task is still to control the full derivative-pulse energy form. A useful transformation must preserve the required xi boundary observable, including its logarithmic high-energy growth, while controlling all derivative orders. Merely adjoining a spectral parameter to the positive modular system does not do that. The finite-dimensional recurrence (3) remains available for investigating a more appropriate, possibly singular endpoint or nonlocal, transformation.

The companion script verifies the polynomial identities symbolically and separately audits their normalization against the theta series. Its finite numerical checks are not presented as evidence for all-orders positivity. The cusp obstruction and Riccati comparison are analytic arguments.
