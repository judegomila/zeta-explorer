# Newman drift in the positive-innovation decomposition

Status: exact commutator derivation, pending audit. Coordinates match fisher_bridge_v1: B_j=(-2)^j(D+a)^j psi_lambda / psi_lambda, psi_lambda=e^{lambda u²}psi, a fixed.

The full feature drift is finite and explicit:
 partial_lambda B_j=-4j u B_{j-1}+4j(j-1)B_{j-2}.
Indeed [(D+a)^j,u²]=2j u(D+a)^{j-1}+j(j-1)(D+a)^{j-2}. Set negative-index terms to zero. No high-jet source is omitted.

Use UNNORMALIZED positive half-line measures dmu_+=1_{u>0}u e^{2au}psi_lambda²du and dmu_-=1_{u<0}(-u)e^{2au}psi_lambda²du. Then partial_lambda dmu_±=2u²dmu_±. Write E± for integrals, not normalized expectations.

For v=(B_j) in the old parity block, let A+=E+[vv*], b+=E+[v B_n], alpha=A+^{-1}b+, R=B_n-alpha* v. Put A=A+−A−>0 and w=E−[vR] (real features/coefficient convention; complex Hermitian extension is immediate). Then the unscaled signed Schur residual is
 S=E+[R²]−E−[R²]−w* A^{-1}w.

All terms can be differentiated without inventing a dissipative sign:
 alpha'=A+^{-1}(b+'−A+'alpha),
 R'=B_n'−alpha'*v−alpha*v',
 (E+[R²])'=2E+[u²R²]+2E+[R(B_n'−alpha*v')],
 (E−[R²])'=2E−[u²R²]+2E−[R(B_n'−alpha*v')]−2alpha'*w,
 w'=2E−[u²vR]+E−[v'R+vR'],
 A'=2(E+−E−)[u²vv*]+(E+−E−)[v'v*+vv'*],
 (w*A^{-1}w)'=2Re(w'*A^{-1}w)−w*A^{-1}A'A^{-1}w.
The plus innovation derivative loses the alpha' term by E+[vR]=0. The negative innovation retains exactly the coupling that must be paid. Substituting the explicit feature drift above turns every derivative into finite weighted theta Sobolev integrals and actual inverse blocks.

These formulas are a concrete compensated-entropy/innovation accounting system, not a positivity proof. Bounds must jointly exploit the positive innovation reserve, negative reflected innovation and A^{-1} feedback; dropping any displayed drift/coupling term is invalid. Independent cross-check: after fixed Fourier/basis normalization, the combined S derivative must agree with the Schur envelope identity in COMPENSATED_SCHUR.md. Note that this document's features use powers of 2t, whereas that document's monic polynomials use t.

## A finite positive-density source estimate from established theta curvature
Assume the campaign's established global ell''<=-17 for ell=log psi. For lambda<17/2 the normalized full-line density q proportional to e^{2au+2lambda u²}psi² has potential V=-log q with V''>=kappa=34-4lambda>0. Its unique mode m satisfies 0<=m<=2a/kappa. For every sufficiently decaying differentiable real/complex test f, integration by parts and strong convexity give
 kappa integral (u-m)²|f|²q
 <=integral (u-m)V'|f|²q
 =integral |f|²q+2Re integral (u-m)conj(f)f' q.
Young's inequality therefore yields the explicit paid multiplier estimate
 integral (u-m)²|f|²q
 <=(2/kappa)integral |f|²q+(4/kappa²)integral |f'|²q.
In particular norm(u f)_q <= [m+sqrt(2/kappa)]norm(f)_q+(2/kappa)norm(f')_q. Applying the same bound to (u-m)f also controls u² sources using f' and f'' with explicit finite constants. This is a genuine theta-curvature estimate that can enter the positive Gram budget. It is NOT an all-degree free contraction: derivative norms on the right must still be paid in the actual residual metric.

The positive innovation decomposition being differentiated here is developed and sharpened independently in fisher_bridge_v2/PAID_TWIN_INNOVATION.md. Its unscaled polynomial basis is diagonally congruent to this document's B_j basis; no sign conclusion changes under that congruence.

For an entirely explicit second-multiplier version, set A0=sqrt(2/kappa), B0=2/kappa. Applying the first multiplier inequality twice gives
 norm((u-m)²f)_q <=(4/kappa)norm(f)_q+(4sqrt(2/kappa)/kappa)norm(f')_q+(4/kappa²)norm(f'')_q,
 and hence
 norm(u²f)_q <=[m²+2m sqrt(2/kappa)+4/kappa]norm(f)_q
 +[4m/kappa+4sqrt(2/kappa)/kappa]norm(f')_q
 +(4/kappa²)norm(f'')_q.
All norms are under the same positive q; m>=0 here. This pays the u² source by two derivative levels rather than suppressing it.
