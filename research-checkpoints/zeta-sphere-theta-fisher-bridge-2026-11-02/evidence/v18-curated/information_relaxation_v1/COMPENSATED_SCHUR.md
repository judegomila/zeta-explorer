# Paid Newman relaxation: an exact Schur defect and positive energy budget

Status: new exact derivation; independent audit requested. This is a certificate template, not an evaluated theta certificate or all-degree theorem.

Fix a in (0,1/2) and F_lambda(z)=integral_0^infinity e^{lambda u²}psi(u)cos(zu)du. Write W_lambda(t)=Re(iF_lambda'(t+ia) conjugate(F_lambda(t+ia))). Define Hermitian quadratic and parent energies, with Lebesgue dt throughout,
 Q_lambda[p]=integral_R |p(t)|² W_lambda(t)dt,
 Q_lambda^{[r]}[p]=integral_R |p(t)|² W[F_lambda^{(r)}](t)dt,
 G_{r,lambda}[p]=integral_R |p(t)|² |F_lambda^{(r)}(t+ia)|²dt >=0.
These are the actual jet forms up to fixed Fourier normalization and the fixed diagonal basis change t^j <-> (2t)^j. No positivity of W or Q is assumed. All finite polynomial moments converge for the full theta profile at finite lambda.

## 1. Transport the test polynomial, not the original zeros
For any differentiable real or complex polynomial p_lambda,
 dQ_lambda[p_lambda]/dlambda
 =2 Re Q_lambda[partial_lambda p_lambda-p_lambda'',p_lambda]
  -2 Q_lambda[p_lambda']+2 Q_lambda^{[1]}[p_lambda].
Here primes on p mean t derivatives, whereas primes on F mean z derivatives. This follows by twice integrating -partial_t²W against |p|²; boundary terms vanish. Thus choosing the finite-dimensional heat transport partial_lambda p=p'' gives
 dQ_lambda[p]/dlambda=2D_lambda[p],
 D_lambda[p]:=Q_lambda^{[1]}[p]-Q_lambda[p'].
The derivative-ladder forcing is retained, not declared positive.

## 2. Exact Schur residual envelope
Choose degree n and the same-parity lower polynomial space span{t^{n-2},t^{n-4},...}. Suppose its actual Q_lambda Gram block A_lambda is strictly positive on a parameter interval. Let
 p_lambda^*(t)=t^n-beta_lambda^T v_lower(t),
 beta_lambda=A_lambda^{-1}b_lambda,
 S_lambda=Q_lambda[p_lambda^*]=d_lambda-b_lambda^* A_lambda^{-1}b_lambda.
This is the stationary minimum over monic polynomials; S itself is NOT presumed positive. Because both partial_lambda p_lambda^* and (p_lambda^*)'' lie in the lower space and Q_lambda[p_lambda^*,v_lower]=0, the cross terms vanish exactly. Hence
 S_lambda'=2[Q_lambda^{[1]}[p_lambda^*]-Q_lambda[(p_lambda^*)']].
The same formula applies with all lower degrees rather than a parity block. When n=0 or 1 with empty parity-lower space, partial_lambda p_lambda^* and (p_lambda^*)'' vanish and the formula remains valid. For n=1, (p_lambda^*)'=1 does NOT vanish: the term -Q_lambda[1] is retained.

This identifies an actual signed defect, rather than treating entropy dissipation as the Schur derivative.

## 3. A paid positive-energy envelope with no assumed target sign
Pointwise |W[G]|<=|G'||G| and Cauchy give the explicit upper bound
 D_lambda[p]<=B_lambda[p],
 B_lambda[p]=sqrt(G_1[p] G_2[p])+sqrt(G_0[p'] G_1[p']).
Every G is a positive parent Sobolev Gram energy of the COMPLETE theta profile, computable by Parseval or direct integrals. Neither W[F'] nor Q[p'] was assumed positive. If an independently proved opposite-parity block gives Q[p']>=0, its second term may be omitted; do not omit it for an isolated odd-block certificate.

For any positive scalar eta,zeta, a purely quadratic envelope is
 B_lambda[p] <= (eta G_1[p]+eta^{-1}G_2[p]
                 +zeta G_0[p']+zeta^{-1}G_1[p'])/2.
This defines a positive cost matrix; eta,zeta can be optimized or interval-bounded without changing the original zeros.

Define the compensated functional
 L_lambda=S_lambda-2 integral_0^lambda B_r[p_r^*]dr.
Then L_lambda'<=0, so a verified terminal reserve gives
 S_0 >= S_Lambda-2 integral_0^Lambda B_r[p_r^*]dr.
Consequently a sufficient finite-degree certificate is:
 (i) certify lower A_r>0 on [0,Lambda];
 (ii) certify S_Lambda>0;
 (iii) certify 2 integral B_r < S_Lambda.
This is a constructive, non-circular paid-backward-relaxation test. The bound may be too coarse; it has not been evaluated here. A terminal anchor alone does not suffice, and claiming a uniform all-degree inequality requires controlling the residual coefficients and positive energies in the actual lower metric.

A sharper implementation may upper-bound the signed D directly, retaining cancellation. The displayed B is a safe, explicit envelope that pays every forcing term.

## 4. Exact Gaussian check: even positive bridges have nonmonotone Schur residuals
For psi(u)=exp(-beta u²), put b=beta-lambda>0. Then
 F_lambda(z)=sqrt(pi)/(2sqrt(b)) exp[-z²/(4b)],
 W_lambda(t)=a pi/(8b²) exp[a²/(2b)] exp[-t²/(2b)].
Its monic degree-n residual is the monic Hermite polynomial for Gaussian variance b, including the same-parity residual. Therefore
 S_n(lambda)=a pi sqrt(2pi)/8 * n! * b^{n-3/2} exp[a²/(2b)],
 S_n'/S_n=-(n-3/2)/b+a²/(2b²).
For n>=2 and a²<(2n-3)b this derivative is negative, although every block is positive. Thus neither an unqualified positive nor an unqualified negative Schur-flow sign follows from Gaussian/entropy relaxation. The paid defect is essential.

## 5. Exact remaining estimate
The new finite certificate requires bounding a positive Sobolev energy budget evaluated on ACTUAL Schur residual polynomials along a controlled deformation. The prospective all-degree theorem would require theta-specific cancellation/orthogonality to make that integrated budget smaller than the terminal reserve uniformly in degree, or to sharpen B to a signed-cost bound. No such estimate is proved here. This complements, rather than replaces, the genuine bridge-density Fisher/Stein identity in fisher_bridge_v1 and the orbit-law Fisher decay in theta_fisher_decay_v1.
