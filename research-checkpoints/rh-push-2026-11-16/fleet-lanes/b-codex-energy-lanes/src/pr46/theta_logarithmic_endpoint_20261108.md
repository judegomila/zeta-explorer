# The required endpoint for a xi realization, and an explicit logarithmic prototype

Research note, 8 November 2026. The exact positive modular system in
`theta_modular_system_20261108.md` does not have the required xi Weyl
coefficient. This note strengthens that exclusion, derives a necessary
endpoint condition for a positive xi realization, and constructs a positive
model with the correct leading logarithmic growth. The model is not
identified with xi and does not prove RH.

## 1. Fix the spectral observable before constructing a positive system

Let

\[
F(z)=\xi(1/2+z),\qquad
M_\xi(z)=i\frac{F'(-iz)}{F(-iz)}.
\tag{1.1}
\]

This is a meromorphic target, not an already established Weyl function in
the whole upper half-plane. RH would make it a Herglotz function there.
Conversely, its identification with a Herglotz function excludes zeros of
`F` in the right half-plane and therefore proves RH by the xi symmetry.
At a zero of `F`, its logarithmic derivative has a nonremovable simple pole
even when the zero has higher multiplicity.

On the positive imaginary axis, use `s=y+1/2` to obtain

\[
\frac{F'(y)}{F(y)}
=\frac1s+\frac1{s-1}-\frac12\log\pi
 +\frac12\psi(s/2)+\frac{\zeta'(s)}{\zeta(s)}.
\tag{1.2}
\]

The digamma asymptotic and the absolutely convergent Dirichlet series at
large real `s` give, unconditionally,

\[
\boxed{
M_\xi(iy)=\frac i2\log\!\left(\frac{y}{2\pi}\right)+O(1/y).
}
\tag{1.3}
\]

More generally,

\[
M_\xi(z)=\frac i2\log\!\left(\frac{-iz}{2\pi}\right)+O(1/|z|)
\tag{1.4}
\]

uniformly in closed nonreal sectors of the upper half-plane as `|z|`
tends to infinity. Here `Re(-iz)>0`, so the principal logarithm is
unambiguous; the real part of `s=1/2-iz` tends uniformly to positive
infinity. No RH assumption is used in this outer-sector asymptotic.

The prime data are present in (1.2), through

\[
\frac{\zeta'(s)}{\zeta(s)}
=-\sum_{n\ge2}\frac{\Lambda(n)}{n^s}
=-\sum_p\sum_{m\ge1}(\log p)\,p^{-ms},\qquad\Re s>1.
\tag{1.5}
\]

After `s=1/2-iz`, these are precisely the prime-power frequencies
`m log p`. Matching only the leading logarithm does not retain this
arithmetic part of the twin ladder.

## 2. The natural modular lift fails every fixed real boundary normalization

The exact theta construction yields a positive Hamiltonian

\[
\mathscr H_{\rm mod}(u)=\operatorname{diag}(\gamma(u),\beta(u)),
\quad
\beta(u)=\beta_1u+O(u^3),\quad
\gamma(u)=\gamma_1u+O(u^3),
\]

where both leading coefficients are positive. Its Weyl coefficient obeys

\[
M_{\rm mod}(iy)\longrightarrow i r_0,
\qquad r_0=\sqrt{\gamma_1/\beta_1}\in(0,\infty).
\tag{2.1}
\]

The companion modular note proves this with a reversed Riccati comparison.
It also follows from the canonical endpoint asymptotic after the change
of variable `x=u^2/2`.

A fixed real symplectic change of boundary coordinates changes the Weyl
coefficient by a real fractional-linear transformation

\[
M\longmapsto\frac{aM+b}{cM+d},\qquad ad-bc>0.
\]

At `M=i r0`, the denominator cannot vanish: for real `c,d`,
`c i r0+d=0` would force `c=d=0`. The image is another finite point
strictly inside the upper half-plane. Consequently no such fixed real
boundary change can turn (2.1) into the logarithmic divergence (1.3).
Positive constant spectral rescaling, or an ordinary monotone spatial
reparameterization, does not repair it either.

There is an exact mismatch even at one finite point in the original
normalization. With the modular notation `v0>3/2`,

\[
\frac{M_{\rm mod}(i)}i
=\frac{4v_0^2}{\pi^2(2v_0-3)}
\ge\frac{12}{\pi^2}>1.
\tag{2.2}
\]

The inequality uses `v0^2-3(2v0-3)=(v0-3)^2>=0`.
The earlier certified inequality `F(1)-F'(1)=D(-1)>0` instead gives

\[
\frac{M_\xi(i)}i=\frac{F'(1)}{F(1)}<1.
\tag{2.3}
\]

Equation (2.2) excludes the unmodified normalization; (2.1) excludes its
repair by fixed real boundary normalizations. Neither excludes a more
substantial transformation with a genuinely different endpoint.

## 3. A necessary rank-one endpoint condition

Use the standard canonical convention

\[
JY'(x,z)=z\mathscr H(x)Y(x,z),\qquad
J=\begin{pmatrix}0&-1\\1&0\end{pmatrix},
\tag{3.1}
\]

with a positive semidefinite, locally integrable Hamiltonian, nonzero
almost everywhere, and a limit-point right endpoint. Its Weyl coefficient is the initial ratio
`Y2/Y1` of the square-integrable solution. This agrees with the modular
note's convention after replacing its second coordinate by its negative.

Suppose a positive canonical system has Weyl coefficient exactly
`M_xi`. This supposition is a target identification, not a premise used to
claim RH has been proved. Rotate the boundary coordinates by `J`. The
new Hamiltonian and coefficient are

\[
\widetilde{\mathscr H}=-J\mathscr HJ,
\qquad \widetilde M=-1/M_\xi.
\]

Equation (1.4) gives `M_tilde(z)->0` uniformly in closed nonreal sectors.
The endpoint characterization in Eckhardt--Kostenko--Teschl, Corollary 3.2,
therefore gives

\[
\frac{\int_0^x\widetilde{\mathscr H}(t)\,dt}
     {\int_0^x\operatorname{tr}\widetilde{\mathscr H}(t)\,dt}
\longrightarrow
\begin{pmatrix}0&0\\0&1\end{pmatrix}.
\]

Rotate back to obtain the necessary condition

\[
\boxed{
\frac{\int_0^x\mathscr H(t)\,dt}
     {\int_0^x\operatorname{tr}\mathscr H(t)\,dt}
\longrightarrow
\begin{pmatrix}1&0\\0&0\end{pmatrix}
\qquad(x\downarrow0).
}
\tag{3.2}
\]

Thus the two channels must have a degenerate averaged endpoint in this
normalization. A balanced positive-definite endpoint is incompatible with
the required xi observable. The statement is about the averaged,
trace-normalized Hamiltonian; it does not require that every coefficient
have an ordinary pointwise limit or become unbounded.

This is a necessary design condition. It does not determine the full
Hamiltonian, its rate of degeneration, or the xi arithmetic.

## 4. An explicit positive endpoint with the correct leading logarithm

Define on the positive half-line

\[
\mathscr H_{\log}(x)=\operatorname{diag}(1,\beta(x)),
\quad
\beta(x)=
\begin{cases}
4/[\log(e/x)]^2,&0<x\le1,\\
4,&x\ge1.
\end{cases}
\tag{4.1}
\]

This Hamiltonian is positive definite for every `x>0`, locally integrable
at zero, and has infinite trace integral. Its endpoint satisfies (3.2).
Let `M_log` be its Weyl coefficient in convention (3.1).

### Proposition

\[
\boxed{M_{\log}(iy)\sim\frac i2\log y
\qquad(y\to\infty).}
\tag{4.2}
\]

This is a positive canonical model with the correct leading growth for
xi. No equality with `M_xi`, no matching of its constant or lower-order
terms, and no assertion about matching its poles is made.

**Proof by an explicit scaling and canonical continuity.** Put

\[
a_y=\tfrac12\log y,\qquad t_y=a_y/y,
\qquad y>1.
\]

At `z=iy`, write a real Weyl solution as `(U,iV)`. It satisfies

\[
U'=-y\beta V,\qquad V'=-yU.
\]

Set `x=t_y s` and `V=a_y W`. The rescaled system at spectral parameter
`i` has Hamiltonian

\[
\mathscr H_y(s)=\operatorname{diag}(1,b_y(s)),
\qquad b_y(s)=a_y^2\beta(t_y s),
\tag{4.3}
\]

and Weyl coefficient

\[
M_y(i)=M_{\log}(iy)/a_y.
\tag{4.4}
\]

The original weighted square norm becomes `t_y` times the rescaled
weighted square norm, so this change also preserves the Weyl integrability
condition; it is not only a formal transformation of the equations.

For each fixed `S<infinity` and all sufficiently large `y`, one has
`t_y S<1` and

\[
b_y(s)=
\left[
\frac{\log y}{\log y-\log a_y+1-\log s}
\right]^2,
\qquad0<s\le S.
\tag{4.5}
\]

It tends to one at each `s>0`. On this whole interval it is eventually
bounded by four: its maximum is at `s=S`, and that maximum tends to one.
Dominated convergence gives `H_y -> I` in `L1_loc`.

To apply canonical continuity with the required normalization explicitly,
let

\[
\tau_y(s)=\int_0^s(1+b_y(r))\,dr.
\]

These strictly increasing functions tend locally uniformly to `2s`.
Their inverses `s_y(tau)` tend locally uniformly to `tau/2`. For the
trace-normalized Hamiltonian, the cumulative first and second diagonal
entries are exactly

\[
s_y(\tau),\qquad \tau-s_y(\tau).
\]

They both tend locally uniformly to `tau/2`. Proposition 2.3 of
Eckhardt--Kostenko--Teschl therefore gives convergence of the Weyl
coefficients to that of the constant Hamiltonian `I/2`, namely `i` at
spectral parameter `i`. Equation (4.4) proves (4.2).

Every Hamiltonian in this argument is independently positive. The limit
does not assume that the target xi function is Herglotz. The result is an
asymptotic construction for an auxiliary model, not an inverse spectral
reconstruction of xi. \(\square\)

## 5. Implication for the proof strategy

The precise positive-system route is to construct a Hamiltonian from the
actual theta or prime data and prove its Weyl coefficient is (1.1).
Positivity would then imply the required global analytic inequality.

The positive modular lift fails a necessary endpoint test. The model (4.1)
passes that leading test and demonstrates that a positive system can have
the required logarithmic endpoint growth. It does not supply the missing
identification: the arithmetic series (1.5), the remaining gamma and
rational terms, and the full continuation must all be preserved.

This gives a concrete restriction on future canonical constructions.
Searching only among systems with a balanced regular endpoint cannot
produce the desired xi observable, even when the systems arise naturally
from exact theta differential identities. A viable construction must
handle the degenerate endpoint and establish the full transfer identity,
with its actual operator domains.

## Sources

- Jonathan Eckhardt, Aleksey Kostenko, Gerald Teschl, *Spectral asymptotics
  for canonical systems*, J. Reine Angew. Math. 736 (2018), 285–315.
  Proposition 2.3 (continuity), Theorem 3.1 and Corollary 3.2 (endpoint
  characterization), equations (2.21)–(2.23) (constant Hamiltonian).
  https://www.mat.univie.ac.at/~gerald/ftp/articles/AsymCS.pdf
  https://arxiv.org/abs/1412.0277
- NIST DLMF, §5.11, digamma asymptotic:
  https://dlmf.nist.gov/5.11.E2 . Equation (1.2) follows directly by
  logarithmic differentiation of the completed xi definition.
- The exact modular positive system is proved in
  `theta_modular_system_20261108.md`. The previously certified
  `D(-1)>0` is in PR #45:
  https://github.com/[user]/mathexplorer/pull/45 .

The new endpoint calculations and scaling are derived above and received
an independent analytical audit. No novelty or RH proof claim is made.
