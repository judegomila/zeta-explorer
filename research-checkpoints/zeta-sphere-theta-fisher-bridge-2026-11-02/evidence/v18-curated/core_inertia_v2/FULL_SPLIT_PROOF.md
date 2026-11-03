# Complete signed-core repair through odd degree19 at normalized a=0

Status: interval checker, independent analytic review, and replay using independently recomputed moments all passed.

## Scope
This closes the **entire10-by-10 odd moment block** [mu_(i+j+1)] for0<=i,j<=9, at normalized shift a=0. It also certifies the actual outer-tail odd block for h>=1/16 and the exact inertia of the complementary core. It does **not** prove the even block through degree18, full H19, nonzero shifts, any all-degree statement, or RH.

The proof reuses the independently reviewed full-theta core and full-moment interval certificates in this folder. Decimal endpoint reloads are padded outward by10^(-90)(1+|lo|+|hi|).

## Exact finite congruences
`full_split_coordinates.json` contains fixed positive rational scaling constants and a fixed rational8-by-8 matrix U, selected numerically but subsequently treated only as exact rational data. The checker proves U*U positive definite, hence U invertible. No assertion that U consists of exact eigenvectors is used.

Apply the rational diagonal scaling to the10-by-10 core C and actual tail T. Eliminate their first two odd channels separately, obtaining positive Ac,At and their8-by-8 Schur residuals Sc,St. Positivity of Ac and At is checked at every inversion. The checker independently verifies St>0, rather than assuming tail positivity.

Apply U to the core residual and partition its first three versus final five coordinates:

U*Sc U=[Cnn Cnp; Cpn P].

The checker verifies P>0. Put H=P^(-1)Cpn and N=−Cnn+Cnp H. The checker verifies N>0. The invertible exact triangular congruence L=[I0;−HI] consequently yields

L*U*Sc UL=diag(−N,P).

Therefore Sc has exactly three negative and five positive eigenvalues. Since Ac>0 has dimension2, the complete core odd matrix has exactly **three negative and seven positive** eigenvalues; no zero eigenvalues.

## Actual tail and complement coupling
Apply precisely the same L and U to the actual tail residual, calling its blocks Tnn,Tnp,Tpp. These are computed with interval arithmetic, including the exact rational candidate-coordinate uncertainty and the interval enclosure of H. The checker proves

Tnn−600N>0,

(995/1000)Tnn−Tnp(P+Tpp)^(-1)Tpn>0.

Equivalently, kappa>600 and the actual complement-coupling operator norm squared

eta=||Tnn^(-1/2)Tnp(P+Tpp)^(-1/2)||²

is below .995. Hence

Tnn−Tnp(P+Tpp)^(-1)Tpn−N
> .005Tnn−N >2N>0.

Since P+Tpp>0, the Schur criterion proves Sc+St>0 on the complete8-dimensional residual space. This already ignores the additional nonnegative binary core/tail covariance term, so the Schur complement of C+T is positive as well. Thus the actual full odd matrix is positive definite.

For redundancy, the checker directly runs positive LDL on the entire10-by-10 full odd matrix, independently of this structural implication.

## Executed bounds
All bounds refer to the fixed coordinates; pivots are not claimed as invariant eigenvalue bounds.

- U*U positive pivots: approximately1.
- P positive LDL minimum lower pivot: >.0001656894.
- N positive LDL minimum lower pivot: >.0000044392894.
- St positive LDL minimum lower pivot: >.5299112.
- Tnn−600N positive LDL minimum lower pivot: >.0040522.
- .995Tnn−Tnp(P+Tpp)^(-1)Tpn minimum lower pivot: >.0006427198.
- Full odd10-by-10 matrix positive LDL minimum lower pivot: >.5308742.

The result is a completed finite-order demonstration of actual-tail-normalized signed-core repair, including all complement couplings. The remaining all-degree challenge is to establish analogous relative inequalities uniformly as degree grows; the finite constants here alone do not imply that.
