# The exact positive gamma ladder and the nonperturbative arithmetic cancellation

Research continuation, 8 November 2026. This note constructs a passive
realization of the actual anchored gamma contribution to the xi logarithmic
derivative. It then proves that the arithmetic correction cannot be an
additive passive system, cannot have a strict relative passivity margin,
and is not a bounded multiplicative perturbation of that baseline. These
are unconditional structural statements. They do not establish RH.

## 1. Preserve the pole cancellation before splitting the response

Write

\[
F(w)=\xi(1/2+w),\qquad L(w)=F'(w)/F(w),\qquad s=1/2+w.
\]

Using the gamma recurrence in the completed xi definition gives

\[
\boxed{\xi(s)=\pi^{-s/2}\Gamma(1+s/2)B(s),
\qquad B(s)=(s-1)\zeta(s).}
\tag{1.1}
\]

The entire function B has B(1)=1. This grouping keeps the cancellation at
the zeta pole explicit. Splitting off 1/(s-1) as though it were the response
of a separate analytic positive system would introduce an interior pole
at w=1/2 which the complete xi response does not have.

Define

\[
A(w)=\frac12\left[\psi\!\left(\frac54+\frac w2\right)
                          -\psi\!\left(\frac54\right)\right],
\qquad
c_0=\frac{\log\pi-\psi(5/4)}2.
\tag{1.2}
\]

Then the exact split is

\[
\boxed{L(w)=A(w)+R(w),\qquad
R(w)=\frac{B'(1/2+w)}{B(1/2+w)}-c_0.}
\tag{1.3}
\]

Since F is even and F(0) is nonzero, L(0)=0. Thus

\[
\frac{B'(1/2)}{B(1/2)}=c_0,
\qquad A(0)=R(0)=0.
\]

The constant is positive: psi is increasing on the positive real axis,
psi(5/4)<psi(2)=1-gamma<1<log pi. Its approximate value
0.68609170961283279 is a normalization aid, not an input to the proofs.

In the Euler-product region Re w>1/2, (1.3) becomes

\[
R(w)=\frac1{w-1/2}-c_0
-\sum_{n\ge2}\Lambda(n)n^{-1/2}e^{-w\log n}.
\tag{1.4}
\]

This absolutely convergent prime series is not asserted to converge on
the critical boundary Re w=0. Across w=1/2 the combined B'/B is the
regular quantity; its two separated terms must not be continued as
independent physical responses.

## 2. Exact positive-real expansion of the gamma baseline

Put lambda_n=2n+5/2, for n=0,1,2,... . Subtracting two digamma partial
fraction expansions yields

\[
\boxed{
A(w)=\sum_{n=0}^\infty
\left(\frac1{\lambda_n}-\frac1{\lambda_n+w}\right)
=\sum_{n=0}^\infty\frac{w}{\lambda_n(\lambda_n+w)}.
}
\tag{2.1}
\]

The series converges locally uniformly away from its negative real poles.
For w=x+iy with x>0, each term has real part

\[
\operatorname{Re}\frac{w}{\lambda(\lambda+w)}
=\frac{x(\lambda+x)+y^2}
{\lambda[(\lambda+x)^2+y^2]}>0.
\tag{2.2}
\]

Consequently A is analytic and strictly positive-real on Re w>0.
Equivalently M_A(z)=iA(-iz) is Herglotz on the upper half-plane.

There is also the exact positive-kernel integral

\[
\boxed{
A(w)=\int_0^\infty(1-e^{-wt})
\frac{e^{-5t/2}}{1-e^{-2t}}\,dt.
}
\tag{2.3}
\]

Near t=0 the second factor is asymptotic to 1/(2t), which is canceled by
1-e^{-wt}=O(t). At infinity there is exponential decay. These estimates
justify the sum-integral exchange for Re w>0 and local uniform convergence.
The digamma asymptotic also gives

\[
A(w)=\tfrac12\log(w/2)-\tfrac12\psi(5/4)+O(1/w)
\]

in closed right-half-plane sectors. Thus this is an exact gamma model with
the correct logarithmic leading order, not an arbitrary asymptotic model.

## 3. An explicit state-space realization and a positive energy law

For a time-dependent complex input v(tau), introduce one state for each
lambda_n:

\[
\dot q_n=-\lambda_n q_n+v,
\qquad
i_n=\frac{v}{\lambda_n}-q_n
=\frac{\dot q_n}{\lambda_n}.
\tag{3.1}
\]

With zero initial states, the Laplace transfer from v to i_n is precisely
w/[lambda_n(lambda_n+w)]. Moreover,

\[
\boxed{
\operatorname{Re}(\overline v\,i_n)
=\frac12\frac d{d\tau}|q_n|^2
+\frac{|\dot q_n|^2}{\lambda_n}.
}
\tag{3.2}
\]

The first term is stored energy and the second is nonnegative dissipation.
This provides a direct passive realization without an inverse-spectral
existence assumption.

The infinite limit is controlled on a concrete input domain. If v is C1
on [0,T], v(0)=0, and every q_n(0)=0, then

\[
|q_n|\le\frac{\|v\|_\infty}{\lambda_n},
\qquad
|\dot q_n|\le\frac{\|\dot v\|_\infty}{\lambda_n},
\qquad
|i_n|\le\frac{\|\dot v\|_\infty}{\lambda_n^2}.
\]

Thus i=sum i_n converges uniformly, the storage sum converges, and the
dissipation sum is integrable. Summing (3.2) and passing to the limit gives

\[
\boxed{
\int_0^T\operatorname{Re}(\overline v\,i)\,d\tau
=\frac12\sum_{n\ge0}|q_n(T)|^2
+\sum_{n\ge0}\frac1{\lambda_n}
  \int_0^T|\dot q_n|^2\,d\tau\ge0.
}
\tag{3.3}
\]

In normalized circuit units, each summand can also be realized as the
admittance of a series RC pair with R_n=lambda_n and C_n=lambda_n^(-2),
and the complete A is their parallel admittance. Formula (3.3), rather
than a circuit analogy alone, is the energy proof.

## 4. The arithmetic correction cancels all boundary dissipation

At a real t where F(it) is nonzero, F(it) is real. Differentiating it with
respect to t shows that F'(it) is imaginary. Hence

\[
\operatorname{Re}L(it)=0.
\tag{4.1}
\]

In contrast, (2.1) gives

\[
\boxed{
d_A(t):=\operatorname{Re}A(it)
=\sum_{n\ge0}\frac{t^2}
{\lambda_n(\lambda_n^2+t^2)}>0\quad(t\ne0).
}
\tag{4.2}
\]

Therefore the exact remainder obeys

\[
\boxed{\operatorname{Re}R(it)=-d_A(t)<0}
\tag{4.3}
\]

at every regular nonzero boundary point. This uses neither RH nor a
conjecture about zero simplicity.

Three consequences follow.

1. **R cannot be a positive-real additive subsystem.** At each such point
   R is analytic in a neighborhood, and continuity makes its real part
   negative at nearby points with Re w>0. This is an actual local
   obstruction, independent of any possible poles elsewhere.

2. **There is no strict uniform relative passivity bound.** For every
   eta<1, an inequality

   \[
   \operatorname{Re}R(w)\ge-\eta\operatorname{Re}A(w)
   \]

   valid throughout the right half-plane where the functions are regular
   fails by approaching any regular nonzero boundary point. The limiting
   ratio is exactly -1. The eta=1 inequality would simply be the original
   desired positivity of L; it supplies no margin.

3. **There is no bounded multiplicative small-gain correction R/A.**
   Take any known critical-line zero w=i gamma of F, with multiplicity m.
   As x decreases to zero through positive reals,

   \[
   L(x+i\gamma)=\frac m x+O(1),
   \qquad A(x+i\gamma)\longrightarrow A(i\gamma)\ne0.
   \]

   Thus |R/A| tends to infinity. Existence of critical-line zeros is
   unconditional, and no simplicity assumption is required.

These conclusions exclude positive addition and bounded small-gain repair
of this baseline. They do not exclude nonadditive conservative couplings,
unbounded perturbations, or a different positive realization with a
separately proved relation to the full xi response.

## 5. Spectral-density meaning of the cancellation

For the Herglotz function M_A(z)=iA(-iz), the boundary density is

\[
\boxed{
\rho_A(t)=\frac1\pi\operatorname{Im}M_A(t+i0)
=\frac1\pi\sum_{n\ge0}
\frac{t^2}{\lambda_n(\lambda_n^2+t^2)}.
}
\tag{5.1}
\]

This is smooth, strictly positive except at t=0, and grows logarithmically
at large |t|. The full target M_xi(z)=iL(-iz) is real on every regular
real interval. Thus its continued meromorphic boundary function has no
continuous imaginary component there. The arithmetic part cancels (5.1)
pointwise away from the boundary zeros, as (4.3) states.

Under RH, the usual symmetric zero product gives the Herglotz measure

\[
\mu_\xi=\sum_{\gamma}m_\gamma\delta_\gamma,
\]

with both positive and negative ordinates included. At a real zero
ordinate gamma the Weyl function has residue -m_gamma, consistent with
the Herglotz term m_gamma/(gamma-z). In this conditional interpretation,
the arithmetic correction removes the entire continuous baseline density
and replaces it with the discrete zero masses. This is a singular spectral
rearrangement, not a uniformly small positive correction.

The conditional measure statement is not used to prove any unconditional
claim above. Equations (4.1)–(4.3) already establish the exact cancellation.

## 6. What this suggests for the next construction

The gamma contribution now has an explicit exact passive realization,
including an infinite-dimensional energy identity and its input domain.
This is useful input data for a reconstruction, but it cannot be completed
by attaching an independently passive arithmetic admittance in parallel.

A viable continuation must implement the arithmetic through a conservative
coupling or another transformation that preserves the full transfer
identity while changing the boundary spectral type. Alternatively it must
prove the complete theta energy directly. The required cancellation must
remain inside that exact identity; bounding its separate pieces by their
absolute sizes loses the decisive structure.

No such arithmetic coupling is constructed here. The statements above
sharpen the design requirement and exclude a proposed perturbative route;
they do not move the missing RH-strength inequality into an established
theorem.

## Sources and scope

- NIST DLMF 25.4.4 gives the xi definition and 25.4.3 its reflection
  symmetry: https://dlmf.nist.gov/25.4 .
- NIST DLMF 5.7.6 gives the digamma partial-fraction series used in (2.1):
  https://dlmf.nist.gov/5.7.E6 .
- NIST DLMF 5.11.2 gives the digamma high-energy expansion:
  https://dlmf.nist.gov/5.11.E2 .
- NIST DLMF 25.10(i) records the unconditional existence of critical-line
  zeros: https://dlmf.nist.gov/25.10.i .

The state-space energy, exact boundary cancellation, and perturbation
obstructions are derived explicitly above. The only decimal is an
illustrative normalization value. No novelty, external peer review,
formal verification, or RH proof claim is made.
