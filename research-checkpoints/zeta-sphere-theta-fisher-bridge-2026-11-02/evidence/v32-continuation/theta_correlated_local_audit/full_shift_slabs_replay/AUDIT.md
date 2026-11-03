# Independent compact shift/cutoff and global outer-strip audit

Numerical and analytic PASS, 2026-11-03. Independent copied-source replay used 16 shift slabs, 4000 spatial-tail cells, and 4000 cutoff cells, with previously independently reviewed full-theta derivative20 implementation. No acquired code executed. result.json has no failed slabs in either parity.

The actual normalized matrices are B_eps(a,H)=2 integral_H^infinity u^2 sinhc(2au) psi(u)^2 [g_(i+j+eps)(u)]_(i,j=0..4) du. eps=0 gives degrees0,2,4,6,8 and eps=1 gives1,3,5,7,9. Candidate P is an exact rational nonsingular upper-triangular basis; its floating selection is not a proof premise. All signs remain in transformed entries. Every partial cutoff cell uses its signed entrywise increment hull and verifies actual full five-dimensional interval LDL. No local density PSD is used.

For sinhc(2au)=integral_0^1 cosh(2aut)dt, valid spatial derivative bounds are cosh(x), a*sinh(x), and (4a^2/3)cosh(x). Consequently v0|sigma''|+2v1|sigma'|+v2|sigma| rigorously encloses the transformed weighted second derivative. The exact midpoint error is width^3 sup|f''|/24, including interval shift endpoints. These are continuous shift enclosures, not sampling.

The full shifted spatial tail follows sinhc(2au)<=exp(u) for a<=1/2 and the previously audited moment envelope. Multiplying the unshifted envelope by exp(u)=sqrt(z/pi) gives (256/pi)(2j)!9^j Z^(j+5)exp(-2Z), Z=pi*exp(4), j<=9. The logarithmic power slope satisfies 2-14/Z>1. Absolute transformed coefficient sums pay every omitted entry. Orbit derivatives through20 and all omitted n>=9 use the reviewed theta20_density bounds, not a finite-orbit approximation assumption.

Accepted compact scope: both five-channel blocks strictly positive simultaneously for every 0<=a<=1/2 and 0<=H<=1/8, including the normalized a=0 endpoint. LDL pivots are not eigenvalue lower bounds. Monic Schur conversion is valid because P is upper triangular: divide its last LDL pivot by P[4,4]^2.

## Independent outer completion, H=0 only
Let Xi(z)=xi(1/2+iz). The nontrivial zeta zeros lie strictly in 0<Re(s)<1, hence Xi zeros rho=gamma+i delta obey |delta|<1/2. Primary source checked: https://dlmf.nist.gov/25.10. Evenness and order one give the paired product Xi(z)=Xi(0) product_(rho,-rho)(1-z^2/rho^2). There is no linear exponential term. For a>=1/2,
 -Im Xi'/Xi(t+ia)=sum_rho (a-delta)/[(t-gamma)^2+(a-delta)^2]>0.
The imaginary sum converges absolutely since delta is bounded and sum |rho|^-2 converges; every numerator is strictly positive. Xi is nonzero at these points. The full bridge spectral density is -Im[Xi'(t+ia) conjugate(Xi(t+ia))], up to the already fixed positive normalization, and is strictly positive. Gamma-factor vertical decay gives every polynomial moment finite at each fixed a. Thus every finite full-kernel moment Gram is strictly positive in the outer region, independently of any finite-order numerical certificate.

Combined conclusion: at H=0 the actual full signed spectral Gram on degrees<=9 is positive for every a>0, with its normalized a=0 limit also positive. Mixed parity spectral entries vanish by evenness; no auxiliary physical cross-parity Gram is substituted. This does not extend cutoff H>0 into a>1/2, does not prove all-degree compact positivity, and is not RH. The compact explicit pivot constants are not asserted in the outer strip.

Final owned FULL_SHIFT_DEGREE9.md reviewed in full; consequence checker independently replayed using our output. Common final LDL lower bounds exceed .9943138291693995 (even) and .9558060316867640 (odd). Monic Schur lower bounds exceed 658509314218 and 82637820677424 respectively. Exact sixteen-slab coverage and every directed pivot checked. Accepted final theorem and named-prior-scope comparison; only normal computer-assisted proof dependencies remain, no mathematical gap identified.
