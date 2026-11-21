# Infinite sign-twisted ladders: exact reconstruction and the RH obligation

The user's proposal has exact mathematical realizations. They do not yet prove
RH: cancellation identities must be distinguished from a positivity or
holomorphic-continuation theorem in the required domain. The identities below
are elementary consequences of classical Euler products, not novelty claims.

## 1. An infinite family and an opposite-sign pairing

Choose one sign ε_p in {−1,+1} for each prime and set

\[
 Z_\varepsilon(s)=\prod_p(1-\varepsilon_p p^{-s})^{-1},\qquad \Re s>1.
\]

The signs extend completely multiplicatively, so the p^k rung receives ε_p^k.
Flipping every prime means replacing ε_p by −ε_p; it does not negate every
prime-power coefficient. At each prime,

\[
 (1-\varepsilon_p x)^{-1}(1+\varepsilon_p x)^{-1}=(1-x^2)^{-1}.
\]

Consequently, for every sign assignment,

\[
 Z_\varepsilon(s)Z_{-\varepsilon}(s)=\zeta(2s).
 \tag{1}
\]

The identity initially holds in the absolutely convergent half-plane. Writing
it with s/2 recovers ζ(s), but then its initially justified domain is Re s>2;
that change of variables does not establish a critical-strip identity between
independently constructed analytic factors.

## 2. A hierarchy that telescopes to ordinary zeta

The elementary identity

\[
 \prod_{j=0}^{J}(1+x^{2^j})=\frac{1-x^{2^{J+1}}}{1-x}
\]

gives, for Re s>1,

\[
 \zeta(s)=\prod_{j=0}^{\infty}A(2^j s),\qquad
 A(s)=\prod_p(1+p^{-s})=\frac{\zeta(s)}{\zeta(2s)}.
 \tag{2}
\]

This is an infinite hierarchy of factors with flipped local denominator signs
after inversion. The finite product equals ζ(s)/ζ(2^{J+1}s), and the denominator
tends to 1 locally uniformly in Re s>1. The tail j≥1 equals ζ(2s) and is already
holomorphic and nonzero in Re s>1/2. Thus analytically continuing the hierarchy
to that half-plane leaves the difficult zero information in A(s). Finite factors
having no zeros is not enough: the original Euler products do not converge
locally uniformly throughout that half-plane.

## 3. An exact positive Gram construction

Let Ω={−1,+1}^P carry independent fair signs. Define the squarefree twist

\[
 G_\varepsilon(s)=\prod_p(1+\varepsilon_p p^{-s})
 =\sum_{n\text{ squarefree}}\varepsilon(n)n^{-s}.
\]

For Re s>1/2 the finite-prime expansions converge in L²(Ω), because their
distinct squarefree characters are orthogonal and

\[
 \mathbb E|G_\varepsilon(s)|^2
 =\sum_n\mu(n)^2n^{-2\Re s}
 =\frac{\zeta(2\Re s)}{\zeta(4\Re s)}<\infty.
\]

For Re s, Re w>1/2 this yields the positive Gram kernel

\[
 K(s,w)=\mathbb E[G_\varepsilon(s)\overline{G_\varepsilon(w)}]
       =\frac{\zeta(s+\overline w)}{\zeta(2s+2\overline w)}.
 \tag{3}
\]

Ordinary zeta is therefore recovered exactly as
`ζ(s+conj(w))=ζ(2s+2conj(w))K(s,w)`. This realizes the proposed cancellation with
an infinite collection of twists. It does not supply Weil positivity:

- The argument of ζ on the right has real part greater than 1 in this Hilbert
  space construction. Accessing smaller real parts by the same diagonal
  construction would leave its L² convergence domain.
- A positive Gram kernel may have zero off-diagonal entries; positive
  definiteness is not a pointwise zero-free theorem for its values.
- This kernel is not the completed, pole-free Weil form from the previous work.

Orthogonality alone therefore does not close the existing arithmetic remainder.

## 4. Why a positive average cannot simply preserve ζ(s)

For fair independent signs, absolute convergence in Re s>1 permits averaging
term by term, giving

\[
 \mathbb E Z_\varepsilon(s)=\zeta(2s),
\]

since the expectation of ε(n) vanishes unless n is a square.

More generally, suppose a fixed probability measure ν on Ω satisfies
`∫Z_ε(s)dν(ε)=ζ(s)` for all Re s>1. Uniqueness of absolutely convergent Dirichlet
series gives `∫ε_p dν=1` for every prime. Since ε_p≤1, each ε_p is +1 almost
surely. There are countably many primes, so ν must be the point mass at the
all-plus assignment. This rules out a nontrivial positive linear mixture in
this specified class, not correlated products, auxiliary spaces, or all possible
twisted-ladder constructions.

At N primes the conditioning density that exactly selects the untwisted value
is `D_N=∏_{j≤N}(1+ε_{p_j})`. It is nonnegative with mean one, but
`||D_N||₂=2^{N/2}` and it tends to zero almost surely. It is not uniformly
integrable; its measures tend to a singular point mass. Consequently an
ordinary L² or dominated-convergence argument cannot silently identify generic
twists with the all-plus limit. This does not forbid every other limit method.

## 5. Flipping every prime gives a precise RH-equivalent target

For the deterministic all-minus choice, ε(n)=λ(n)=(-1)^{Ω(n)}, the Liouville
function, and

\[
 Z_-(s)=\sum_{n\ge1}\frac{\lambda(n)}{n^s}
       =\frac{\zeta(2s)}{\zeta(s)},\qquad \Re s>1.
 \tag{4}
\]

An independent holomorphic continuation of this Dirichlet series to Re s>1/2
would imply RH. Indeed ζ(2s) is holomorphic and nonzero there; a zero of ζ(s)
there would force a pole of the quotient. The pole of ζ at s=1 instead gives a
zero of the quotient, so it causes no obstruction. The functional equation
then reflects any nontrivial zero left of the critical line to one on the
right. Conversely RH makes this quotient holomorphic in Re s>1/2.

One sufficient route, formulated entirely with signs, is to prove

\[
 \sum_{n\le x}\lambda(n)=O_\delta(x^{1/2+\delta})
 \quad\text{for every }\delta>0.
 \tag{5}
\]

Partial summation would then give a locally uniformly convergent holomorphic
Dirichlet series on Re s>1/2. Equation (5) is not proved here. Random-sign
cancellation does not automatically imply cancellation for this particular
deterministic assignment.

For the existing Weil program, the alternative useful target would be an
explicit arithmetic construction of a linear map h↦F_h into a positive Hilbert
space satisfying `W(h)=||F_h||²` for every smooth compact pole-free h, with all
prime powers and no uncontrolled signed remainder. Such a representation would
prove RH. Defining F_h by taking a square root of W would assume the positivity
being sought. Equations (1)–(4) alone do not construct it.

## Checks and sources

`python scripts/audit-sign-twisted-ladders.py` checks opposite-pair cancellation,
averaging, conditioning, the finite dyadic hierarchy, the finite Gram identity,
and the Liouville quotient using exact rational arithmetic on four primes.
These checks validate the algebra, not critical-strip convergence or RH.

The underlying classical Euler products, including the Liouville and squarefree
quotients, are listed in [DLMF §27.4](https://dlmf.nist.gov/27.4), equations
27.4.3, 27.4.7, and 27.4.8. The derivations here specify the domains and the
extra theorem the proposed sign-flipping construction would need.

The [correlated-twist follow-up](correlated-twist-bridge-2026-09-30.md) constructs
weighted reciprocal-zeta recovery and an explicitly positive finite direct/dual
product. It proves why the simple norm bound and the raw infinite product do
not close the continuation step.

The [unbounded-energy follow-up](unbounded-support-energy-2026-10-01.md)
derives an unconditional weighted energy bound for almost every completely
multiplicative prime-sign twist of the fixed spline interaction. It keeps
even prime powers and correlations between odd powers of the same prime.
Positive averaging cannot recover all zeta coefficients without collapsing
to the all-plus assignment; finite conditioning still needs a uniform bound.
The ordinary zeta estimate remains unproved.
