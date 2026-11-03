# Explicit residual repair cost beyond fixed two-channel covariance

This is an exact consequence of the three-negative witness certificate, at a=0 and core [0,1/16]. It does not assert a failed full-kernel inequality.

Partition the ten-dimensional odd core moment matrix C using its first two channels, corresponding to k and k³:

C=[Ac Bc; Bc* Dc], Sc=Dc−Bc*Ac^(-1)Bc.

Ac is positive definite (also directly checkable from the first three certified moments). Let W be the exact rational 10-by-3 witness matrix in witnesses.json and write W=[U;Z]. Its certified Gram satisfies

W*CW <= −epsilon I3, epsilon=4/10^6.

Indeed the printed interval Gram has diagonal negative magnitude at least .0000044390098, and all off-diagonal absolute values less than 10^(-20); strict diagonal dominance certifies this more conservative epsilon.

Completing the square gives

Z*Sc Z = W*CW − (U+Ac^(-1)Bc Z)*Ac(U+Ac^(-1)Bc Z) <= −epsilon I3.

In particular Z has rank3. Thus the negative subspace survives removal of the two positive lower channels with the same quantitative deficit in the fixed witness parameter coordinates.

For any actual outer tail T with At>0, let St=Dt−Bt*At^(-1)Bt and let Rc=Ac^(-1)Bc, Rt=At^(-1)Bt. The Schur complement of C+T is

Sc+St+(Rc−Rt)*(Ac:At)(Rc−Rt).

The matrix L=(Rc−Rt)Z has only two rows. Choose any unit vector q in its kernel. Explicitly, if its rows are independent, their vector cross product, normalized, supplies q; in rank-deficient cases the kernel is larger. Then

q* Z* (Sc+St+covariance) Z q <= −epsilon + q*Z*St Zq.

Consequently positivity of the full Schur complement necessarily requires

q*Z*St Zq >= epsilon = 0.000004

for every such unit kernel vector, with strict inequality for strict positivity. This identifies a concrete tail-reserve direction missed by the fixed two-channel binary covariance repair. The coordinates Z are fixed exact rationals supplied by the certificate, not freely rescaled unspecified directions.

This is a necessary cost, not an upper estimate or a claimed contradiction: the actual outer tail may well pay it. A constructive next closure must bound its Schur reserve on ker((Rc−Rt)Z), enlarge the lower channel family, or use multiple spatial pieces. The rank bound here is for the binary merge only; a continuum or multi-region covariance can have higher rank.
