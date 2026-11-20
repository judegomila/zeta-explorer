# Independent first-orbit cumulative-tail asymptotic audit
2026-11-02 22:31 UTC. PASS for the model and nonuniformity warning only.

Independently expanded f(h-v)f(h+v): the polynomial is 4z^4+9z^2-12z^3 cosh(2v). With Fourier convention exp(-ikv), its exponential transform is K_(ik/2)(2z), so the derivative term is +6z^3 partial_z K. Multiplication by 2h^2 and dh=dz/(2z) yields the 16/sqrt(pi) prefactor. Integration by parts converts +9h^2 into -6h^2 and adds -6h, with boundary -96 H^2 z_H^(5/2) K/sqrt(pi). All signs and powers agree.

The I-series bound follows from |(1+i tau)_j|>=tau^j. The K/I connection and |Gamma(1+i tau)|=tau|Gamma(i tau)| give exactly |Gamma(i tau)|, with no missing factor two. Bound is uniform for 0<z<=z_H, and the logarithmic weights are integrable at zero. The stated A_H includes the endpoint, giving O_H(k^-1/2 exp(-pi k/4)).

The complete Mellin integral is (1/4)|Gamma(nu/2+ik/4)|^2. Since h=(log z-log pi)/2, the coefficients of L^2 M_(9/2), L^2 M_(5/2), L M_(5/2) are respectively 1,-3/2,-3. Stirling, uniformly differentiable in a fixed nu-neighborhood, gives the positive leading coefficient 8 sqrt(pi) (k/4)^(7/2) exp(-pi k/4) log^2(k/(4pi)). Thus the compact replacement/boundary error is lower by O_H(k^-4/log^2 k). Eventual positivity is valid for each fixed H, without an effective threshold supplied here.

Mixed-pair substitutions and phase exp[(ik/2)log(m/n)] checked. Complete Mellin replacement yields non-absolutely summable coefficients (nm)^-1/2 with shifted log weights, while its endpoint constants grow with nm. Therefore no interchange with the full theta sum is justified by this estimate. Actual full-theta cumulative-tail sign remains unresolved. An oscillatory fixed-H endpoint alone is not a valid obstruction proof even for this model.

Primary identities consulted: https://dlmf.nist.gov/10.25.E2 ; https://dlmf.nist.gov/10.27.E4 ; https://dlmf.nist.gov/10.43.E19 . No acquired code executed. No numerical evidence promoted to a theorem.
