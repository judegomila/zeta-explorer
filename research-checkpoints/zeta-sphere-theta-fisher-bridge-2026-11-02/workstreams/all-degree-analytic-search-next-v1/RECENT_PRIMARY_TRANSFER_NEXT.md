# What the 2026 reciprocal-Xi positivity theorem transfers

## Scope

Sra's 2026 preprint proves strong unconditional positivity for reciprocal-Xi
probability laws and all generalized Xi Laguerre inequalities on the interval
covered by published zero verification.  This note checks exactly what those
results contribute to the present first-Laguerre blocker.  They give a clean
positive Laplace representation before the first zero and a rigorous finite
frequency band.  They do not prove the global sign or the all-degree endpoint
moment statement.

Primary source: Suvrit Sra, *On some positivity properties of the Riemann Xi
function*, arXiv:2611.02944v1 (2026):
<https://arxiv.org/abs/2611.02944>.

## Exact change of variables

Use Sra's normalized functions

\[
 F(z)={\Xi(z)\over c_0},\qquad
 h(s)={\xi(1/2+\sqrt{s})\over c_0},
 \qquad B(s)=\log h(s),                            \tag{1}
\]

where `c_0=xi(1/2)>0`.  On the compatible branches,

\[
 \boxed{F(x)=h(-x^2).}                             \tag{2}
\]

Away from zeros, differentiating (2) gives the exact identity

\[
 {\Xi'(x)^2-\Xi(x)\Xi''(x)\over\Xi(x)^2}
 =-\{\log\Xi\}''(x)
 =2B'(-x^2)-4x^2B''(-x^2).                        \tag{3}
\]

Sra proves

\[
 B'(s)=\int_0^\infty e^{-st}\mathcal H(t)\,dt,
 \qquad \mathcal H(t)>0,                           \tag{4}
\]

for `s>=0`.  Sra's Proposition B.1 gives the large-`t` asymptotic that
continues this ordinary Laplace integral, together with its first
`s`-derivative, to real `s>-gamma_1^2`; the boundary is the first squared
zero.  Here `mathcal H` is the zero heat sum in that paper, not the Hankel
matrix or the theta interaction profile `R` used elsewhere in this
workstream.

Let `gamma_1` be the first positive critical-line zero ordinate.  For
`|x|<gamma_1`, substitute (4) and its derivative into (3):

\[
 \boxed{
 -\{\log\Xi\}''(x)
 =2\int_0^\infty e^{x^2t}
   (1+2x^2t)\mathcal H(t)\,dt>0.}                 \tag{5}
\]

Thus the reciprocal-law theorem yields a direct, noncircular proof of the
first Laguerre sign before the first zero.  Formula (5) ceases to be an
ordinary convergent Laplace integral at the first squared-zero singularity;
it cannot simply be continued with a positive integrand through successive
zeros.

## The verified band

Sra's Theorem 1.3 states that if RH is verified through height `T>1/2`, then
every generalized Laguerre expression satisfies

\[
 L_n[\Xi](x)\geq0
 \qquad(n\geq0,\ |x|\leq T-1/2).                  \tag{6}
\]

With the cited published verification, `T=3*10^12` is admissible.  For
`n=1`, (6) is exactly a rigorous positive band for the density in the present
endpoint moment problem.  It is much stronger finite-frequency information
than a floating scan, but it is still bounded in `x`.

An all-degree parity polynomial can concentrate in any negative open set of
the complementary density.  Consequently (6), for any fixed finite `T`, does
not imply positivity of every endpoint Hankel block or the directional
paid-Schur inequality at every grade.

## Why reciprocal PF order does not transfer

Sra also proves that the positive densities with transforms `1/h` and
`1/Xi` have very high finite Polya-frequency order.  Those are reciprocal
transform kernels.  The present profile is instead

\[
 \widehat R=\Xi'^2-\Xi\Xi''.                       \tag{7}
\]

There is no cone-preserving operation in the cited theorem that sends finite
PF minors of a reciprocal density to positive definiteness of `R`.
Likewise, positivity and monotonicity of `mathcal H` make `B` a Bernstein
function on the positive `s` axis, but the target (3) samples `B` on the
negative axis.  Sra proves that complete monotonicity of `mathcal H`
(equivalently, the complete-Bernstein property of `B`) is equivalent to RH.
Invoking that stronger property here would be circular.

The same guardrail applies to the 2026 theta-kernel concavity preprint
arXiv:2608.19160.  It concerns derivatives of the theta kernel before Fourier
transformation; it does not supply the global Fourier sign in (7).

## Transferable proof target

The genuinely transferable ingredient is the retained-low-zero versus
oscillatory-tail comparison used to prove `mathcal H>0`.  A new proof would
need an analogue directly for (3), or for Csordas' sine-tail criterion, that
survives each real-zero singularity and controls a hypothetical nonreal pair
without assuming its displacement from the critical line.  The existing
reciprocal theorem does not provide that analogue.

## Nonclaims

- Formula (5) proves only the pre-first-zero interval; it is not a global
  Laguerre theorem.
- The verified band (6) is rigorous finite-frequency evidence, not an
  all-degree polynomial-moment proof.
- Finite PF order of reciprocal-Xi densities does not imply positive
  definiteness of the conditional-variance profile `R`.
- Nothing here proves RH or extends published zero verification.
