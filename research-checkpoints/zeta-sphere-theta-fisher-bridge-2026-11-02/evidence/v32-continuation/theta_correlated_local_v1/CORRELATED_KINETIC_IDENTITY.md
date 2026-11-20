# Correlated signed source and the actual regression kinetic metric

This conditional identity applies where the actual integrated old matrix A(H) and the actual local old density L(H)=A'(H) are positive definite. It does not assert that the local condition holds at all degrees. The successful midpoint recovery calculation verifies A throughout the interval and L only at the evaluation midpoints. It does not use this positive-action lemma, which is kept conditional here; midpoint positivity alone would not justify its integrated inequalities.

Let l=b', d=c', z=-A^-1b, and zloc=-L^-1l. With sloc=d-l^TL^-1l and r=Lz+l,
 S'=sloc+(z-zloc)^TL(z-zloc)
    =sloc+z'^T A L^-1 A z'.                             (1)
Here z'=-A^-1r. This is the exact fully correlated sum of moving bulk, mixed inverse and flux derivative; no sign of sloc is assumed.

Set W=A L^-1 A, Q=integral_a^b W^-1=A(a)^-1-A(b)^-1, and v=z(b)-z(a). Matrix Cauchy--Schwarz gives
 integral_a^b z'^TWz' >= v^TQ^-1v.                      (2)
One direct proof subtracts W^-1Q^-1v inside the positive quadratic integral. The exact nonnegative excess is integral(z'-W^-1Q^-1v)^T W(z'-W^-1Q^-1v). Every inverse is an actual old metric; no target pivot is used.

## Why the endpoint action bound is not a new reserve

Let Ltot=A(b)-A(a)>0 and let zM=-Ltot^-1(b(b)-b(a)) be the optimizer of the finite shell. The endpoint lower bound in(2) equals exactly the previously reviewed merge correction
 v^TQ^-1v
 =(z(a)-z(b))^TA(a)(z(a)-z(b))
  +(zM-z(b))^TLtot(zM-z(b)).                            (3)
Indeed Q^-1=A(a)Ltot^-1A(b)=A(a)+A(a)Ltot^-1A(a), and zM-z(b)=Ltot^-1A(a)v. These identities do not assume commutation.

Moreover, integrating(1) and comparing with finite-shell regression gives the exact decomposition
 integral z'^TWz' = v^TQ^-1v
                   +integral(zloc-zM)^TL(zloc-zM).       (4)
The last term is the within-shell regression variance, since the shell Schur remainder equals integral sloc plus that variance.

Thus the kinetic formulation exposes a useful positive action and preserves signed local source, but its endpoint-only Cauchy bound reproduces the existing finite merge correction. It does not automatically pay the negative integral of sloc or the starting debt. A degree-dependent improvement must quantitatively control the within-shell term, signed source, or their correlation using theta structure. Simply renaming(2) as an information-energy bound would not close the gap.

Where L is indefinite the positive-action interpretation is unavailable, even if A remains positive. The more general endpoint-only signed transport identity remains valid there, but equations(2)-(4) cannot be invoked as positive-metric inequalities without verifying L>0. No universal local positivity or all-degree conclusion is made.
