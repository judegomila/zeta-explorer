# Theta joint-sign region exists exactly when the first Laguerre sign fails

Status: independent analytic audit PASS. This is a logical dichotomy, not a determination of either side.

Let F be the complete theta Fourier transform and λ=2(F'²−FF''). The completed-Xi gamma envelope implies λ(t)→0 as |t|→∞. The function λ is real analytic and not identically zero.

Then

 {t: λ(t)<0 and λ''(t)>0} is nonempty  iff  λ(t)<0 somewhere.      (1)

One implication is immediate. For the other, if λ takes a negative value, it attains a negative global minimum at some finite point t*. The minimum is strict locally because λ is nonconstant and analytic. Its first nonzero Taylor term has even degree 2k and positive coefficient, so λ'' is strictly positive on a sufficiently small punctured neighborhood of t*, where λ remains negative. This produces an open joint-sign interval. The same conclusion holds at its negative reflection.

Consequently, proving the joint-sign region empty is exactly proving λ≥0 everywhere, the still-open first Xi Laguerre inequality. Equation (1) does not prove that inequality, its failure, or RH.

Every nonzero polynomial q, in particular every actual inverse-selected residual, has only finitely many zeros. Hence if the joint-sign interval exists, its selected weighted masses

 J[q]=∫_{λ<0,λ''>0} λ''q²,      N*[q]=∫_{λ<0,λ''>0}(−λ)q²

are both strictly positive. On some compact subinterval I one may choose κ>0 with λ''≥κ(−λ)>0, giving J[q]≥κ∫_I(−λ)q²>0. These statements supply no degree-uniform lower bound on the selected mass and no comparison to the old positive derivative norm D_n.

At any real zero γ of F, λ(γ)=2F'(γ)²≥0, so an open negative λ interval lies where F≠0. There λ<0 is equivalently (log|F|)''>0; λ''=2(F''²−FF'''') is the independent four-jet sign. No simplicity or zero-free hypothesis is used.
