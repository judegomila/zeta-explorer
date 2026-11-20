# Failure of a positive matrix-increment transfer for weighted log-concavity

Status: algebraic result and Gaussian counterexample; independent analytic audit PASS. This does not assert a failure for the actual theta at N=2 or rule out a different all-degree form argument.

Fix a shift a and suppose the relevant old pivots are strictly positive, so the normalized triangular reflection matrix and feature vector are defined. Nest the reflection and features as

 R_N = [[R_{N-1}, 0], [r^T, epsilon]],   Y_N=(y,t),   epsilon=(-1)^N.

With G_N=I+R_N^T R_N and w(h)=h e^{-4ah}, the weighted metric admits the **exact** increment

 rho_N = w Y_N^T G_N Y_N = rho_{N-1} + w[t²+(r^T y+epsilon t)²].    (1)

This is a pointwise sum of squares with the actual shift, reflection row, signs and old pivots, not a Loewner assertion about equal-size G matrices. In particular rho_N >= rho_{N-1}. Nevertheless a positive increment does not preserve log-concavity. On an interval where rho_M and Delta=rho_N-rho_M are strictly positive, set p=rho_M/rho_N. Differentiation gives the exact identity

 (log rho_N)'' = p (log rho_M)'' + (1-p)(log Delta)''
                  + p(1-p)[(log rho_M)'-(log Delta)']².                (2)

The positive score-variance term is the obstruction to a naive mixture proof. Formula (2) is local, applies to any M<N by summing (1), and requires no density or limit interchange. Where Delta vanishes, use (1) and direct derivatives or a limiting interpretation rather than taking log Delta.

A decisive auxiliary-model test is ψ(h)=exp(-c h²/2), c>17. Its normalized bridge is a Gaussian at every real a and all pivots are positive. At a→0, with y=ch² and positive scalar normalizations discarded, the N=1 and N=2 weighted metric densities are respectively

 rho_1 = h e^{-y}(1+2y),    rho_2 = h e^{-y}(3/2+2y²).

The exact first curvature is

 (log rho_1)''/c = -(8y³+20y²+2y+1)/[y(2y+1)²] < 0,   y>0,

whereas at y=3/5, (log rho_2)''/c = 61/4107 >0. The latter strict sign continues for sufficiently small positive a by finite-dimensional smooth dependence. At that same h the first curvature also remains negative. In fact N=1 is globally strictly log-concave for every a>0: put A=1+2a²/c, then its density is proportional to h exp(-2ah-y)(A+2y), and its log curvature divided by c is -2-(A²+12y²)/[y(A+2y)²]<0. Thus the same positive-shift Gaussian has a globally strictly log-concave N=1 density, all pivots positive, and a non-log-concave N=2 density for all sufficiently small a>0.

Thus any viable theta-specific all-degree mixture or form argument must use information beyond exact nested positivity, every pivot positive, strong log-concavity of the underlying ψ, and N=1 weighted log-concavity. In particular it must directly control the signed total or the score-variance contribution; neither the identity nor Gaussian counterexample itself controls theta's moving Schur complement.
