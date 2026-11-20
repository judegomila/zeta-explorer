# Cutoff compatibility and phase-aware curvature: independent audit

2 November 2026. PASS for the narrowly stated obstruction and exact conditional criterion, subject to the source wording correction recorded below.

The existing adaptive contour tail uses k=2tau; the reference notation has k=2t, so tau=t. Its convenient beyond-turning envelope requires M+1>=t/(sqrt(2)pi), and attachment to a different retained set requires that every omitted pair have product above M. An Euler box must therefore contain every prime p<=M, via pair (1,p). Its absolute derivative cost is at least M^-delta sum_(p<=M)log p. The prime number theorem and partial summation give the latter sum asymptotic to M. Hence in the required M~t or larger regime this sufficient sign-bound cost dominates log t. This disproves compatibility of these two particular sufficient estimates, not positivity of a larger Euler box.

For a polylogarithmic prime cutoff Y, an omitted prime in (Y,2Y] has orbit argument 2pi p/t tending to zero. It is inside the turning range, so the existing beyond-turning majorant cannot be used for that remainder. Higher prime-power exponents do not insert omitted primes. Checked the primary PNT statement at NIST DLMF 27.2.3, https://dlmf.nist.gov/27.2.E3 .

Source wording correction requested: coverage forces the largest REQUIRED prime to be asymptotic to M, or the largest included prime to be at least (1-o(1))M; the largest included prime could be larger. The lower-cost proof does not rely on an equality for that largest included prime.

For F=g|Z|² with Z nonzero, differentiating log F gives exactly F''/F=(b+2Re L_Z)²+T+2Re R_Z. If b>0, |Re L_Z|<=b/4 and Re R_Z>=-b²/16, the lower bound b²/8+T is correct. The finite geometric-factor logarithmic derivatives and their signs check. Product logarithmic derivatives add, and the linear factor contributes 1/(s-.5+it) and its negative square.

The prime-power expansions and partial summation formula are exact, with the left endpoint interpreted as S(2-)=0. For each fixed m with m delta>1, the weighted integer majorant converges; only finitely many smaller m require retained oscillation. No all-height cancellation estimate of the required strength has been proved, and no compatible omitted-prime/modular remainder is established. These formulas specify a remaining arithmetic obligation rather than resolving it.

Final wording corrections verified: source now says largest required prime (and allows larger included primes); the phase-aware note explicitly inherits the delta-restricted shift domain or excludes the linear-factor zero at (s,t)=(1/2,0). These remove the two wording caveats above without changing the mathematics.
