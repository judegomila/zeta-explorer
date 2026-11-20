# Independent H6 audit of original sphere update23:54

PASS for full H6 at every a>0 and normalized endpoint a0. The numerical reserves below are uniform only on0<=a<=1/2. RH and all-order closure remain open.

Source provenance: private source capture with ZIP SHA256 `f198435db92efafddf0540eb76ead3914a71fdc373c9430b4088c54f910a8570`; private conversation and storage identifiers are omitted from this public derivative. The captured source was read only; none of its checkers was executed. `replay_h6.py` is a newly authored independent Arb implementation, with different direct derivative polynomials and conservative complete tails.

## Independent interval proof
Use psi^(j)=e^(h/2)sum Pj(z_n)e^-z_n, P0=8z²-12z, Pnext=2zP'+(.5-2z)P. The mathematical moment derivatives follow Leibniz; derivatives through14 bound second spatial derivatives of every even4x4 basis entry.

The explicit six-orbit portion is evaluated with Arb256, using polynomial midpoint/mean-value enclosures. If Cj is the exact rational coefficient sum, the omitted n>=7 contribution is bounded by Cj147^(j+9/4)e^-147/(1-rj), rj=(8/7)^(2j+9/2)e^-45<1. This follows z>=3n², e^(h/2)<=z^.25 and monotonicity of z^(j+9/4)e^-z beyond147; subsequent ratios decrease. Each derivative gets the full symmetric tail radius.

Set f=2h² times the basis moment density. The shift multiplier r_a(h)=sinh(2ah)/(2ah)=integral_0^1 cosh(2ath)dt lies between1 andsinh(h)/h on0<=a<=.5. Its first two derivatives on0<=h<=2 are each bounded in absolute value byexp2<8. Therefore |(r_af)''|<=8(|f''|+2|f'|+|f|). Composite midpoint error on each closed cell is width³ times this bound/24. The checker uses512 exact cells on[0,2], with the entire shift multiplier interval at each midpoint, not shift sampling.

For h>=2,z=pi exp2h>150, each derivative is bounded by2Cj e^(h/2)z^(j+2)e^-z; the orbit geometric ratio is <1/2 uniformly for j<=12. The normalized bridge weight <=2exp3h. Transform dh=dz/(2z) and e4h=(z/pi)² to bound moment-n tails by (4/9)sum_j binom(2n,j)CjC(2n-j) times150^(2n+5)e^-300/(2-(2n+5)/150). These complete infinite-h tails are included entrywise.

Independent minimum Gershgorin bound is .0170093334380758... >1/60; normalization upper .0318323627008881... <4/125. Thus the full stated polynomial-basis Gram exceeds I/60, with its exact rational coefficients including p6. The printed Arb short forms are display enclosures; sign decisions use the full live intervals. The exact Schur corollary is2875000²/(60*(4/125))=12915039062500/3; determinant lower is(66*10500*2875000)²/(60⁴*(4/125)⁴)>2e23. These reserves refer to the specified basis/normalization, not arbitrary norm coordinates.

Our previously audited odd H5 block supplies the other parity, so the combined seven-channel H6 is positive for0<=a<=.5. This does not rely on executing or accepting the source's new Schur-window checker.

## Larger shifts
The classical zero strip0<Re(s)<1 (NIST DLMF25.10, https://dlmf.nist.gov/25.10) places Xi zeros gamma+i delta in |delta|<.5. Pair the canonical product at rho and-rho, removing linear exponential ambiguity by evenness. For a>=.5, -Im Xi'/Xi(t+ia)=sum_rho (a-delta)/((t-gamma)²+(a-delta)²)>0. The imaginary-part sum converges absolutely since delta is bounded and sum|rho|^-2 converges. There are no zeros on this evaluation line. Multiplication by |Xi|² gives strictly positive bridge spectral density, hence every finite polynomial moment form is positive there. This uses the known strip, not RH. Only the critical shift interval needs the finite H6 certificate.

The source's remaining same-parity transfer formulation agrees with our already-reviewed signed Sobolev/twin-ladder framework. Its all-order contraction is still unproved. Separate finite H5 Schur-window bounds have not yet been independently replayed in this audit.
