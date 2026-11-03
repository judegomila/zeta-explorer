# Finite-jet characteristic form of the local moment hierarchy

Status: new exact reorganization awaiting review. It supplies analytic transport coefficients, not a signed inequality.

For any fixed spatial interval or radial union I define
 Z_k^I(lambda,z)=integral_I u exp(z u²)[g_lambda^(k)(u)]² du.
For the actual full theta this is entire in finite complex z, by super-exponential decay; on bounded I this is immediate. It generates M_(k,q)^I with exponential-series coefficients z^q/q!.

Summing the previously audited local moment recurrence gives
 (partial_lambda-2partial_z)Z_k
 =-2k(k+1)Z_(k-1)-4k z partial_z Z_(k-1)
   +k(k-1)[6z Z_(k-2)+4z² partial_z Z_(k-2)]
   +[Bcal_k(u;lambda,z)]_I,
where
 Bcal_k=e^{zu²}[2k u² g_(k-1)²
                 +2k(k-1)u g_(k-1)g_(k-2)
                 -k(k-1)(1+2zu²)g_(k-2)²].
Again zero-prefactor negative indices are omitted. For radial blocks use the same reflected boundary difference as LOCAL_MOMENT_FLUX.md. For the whole line the boundary term vanishes.

The characteristic is z(lambda)=z_final+2(lambda_final-lambda). Along it the k equation involves ONLY lower jet degrees. Thus the infinite raised-spatial-moment hierarchy can be evaluated as a finite triangular characteristic recursion through k<=n, using actual full-theta initial generating moments and explicit endpoint fluxes. No arbitrarily higher theta derivatives are required and no positivity is imposed on any generated moment.

Coefficient checks: sum_q q z^q M_(q-1)/q!=z Z; sum_q q(2q+1)z^q M_(q-1)/q!=z(2z partial_z+3)Z. The boundary coefficient sum of (2q+1)u^(2q)z^q/q! is (1+2zu²)e^{zu²}.

This recurrence and the analytic regression formula dot c=-A^-1(dot b+dot A c) provide the transport gauge without fitting. They do NOT establish a degree-uniform reserve: inversion of the actual signed A and comparison of the regional endpoint energies remain explicit. The purpose is to retain exact signed transfer before any positive-part extraction, rather than introduce a new coarse norm envelope.
