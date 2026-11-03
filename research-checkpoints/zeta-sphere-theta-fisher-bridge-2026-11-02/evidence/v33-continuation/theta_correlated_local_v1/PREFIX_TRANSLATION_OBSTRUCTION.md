# Reflection is not contraction in the actual theta prefix

Status: independent analytic review PASS. This tests a proposed all-degree mechanism, not the bridge sign.

Fix a positive shift a with a positive definite actual full polynomial prefix L_a through degree n-1. Its moments are real and even. Freeze this functional; introduce a separate translation length b>0. Let T_b=exp(i b D) act on that finite prefix. Coefficient vectors, inner products and differentiation matrices have the exact conventions of HARDY_PREFIX_COMPRESSION.md.

## 1. An actual-prefix contraction is impossible

For prefix dimension at least two, D is nonzero nilpotent. Hence T_b is nonidentity unipotent and det T_b=1. If its operator norm in this positive metric were at most1, every singular value would be at most1; their product1 forces all to equal1. Then T_b would be unitary, hence diagonalizable, and all its eigenvalues1 would force T_b=I. Contradiction. Thus
                         ||T_b||_(L_a)>1.                  (1)
This holds in the actual theta prefix whenever that prefix is positive; no unknown next norm is required. It rules out unrestricted imaginary-translation contraction as the payment mechanism. It does not rule out a bound on a particular residual vector, or a differently weighted operator.

Reflection Rq(t)=q(-t) is unitary because L_a is even and satisfies
                         R T_b R=T_b^(-1).                 (2)
Consequently modular/even reflection gives reversibility, not contraction. Translation mixes parity, while reflection preserves it; a contraction asserted only on one parity must specify its codomain and cannot silently discard the other parity contribution.

Already the subspace span(1,t) gives a quantitative obstruction. With m_j=L_a[t^j], its normalized basis is1/sqrt(m0),t/sqrt(m2), and T_b has matrix
 [[1, i c],[0,1]], c=b sqrt(m0/m2)>0.
Therefore the full-prefix norm is at least
                      (sqrt(4+c^2)+c)/2>1.                 (3)
All quantities are actual known-prefix moments.

## 2. The selected residual has an unavoidable positive higher-order debit

Let p_n be the actual monic degree-n orthogonal residual, selected without assuming its norm. Its real roots are r_j and q_S deletes the labeled subset S. Orthogonality and the real-root product identity give exactly, for every b,
 L_a[|p_n(t+ib)-p_n(t)|^2]
       =sum_(S nonempty) b^(2|S|) L_a[q_S^2].                (4)
Every coefficient on the right is strictly positive since degree q_S<n. In particular the debit is an absolutely monotone polynomial in b^2, not an alternating cancellation that reflection can remove.

The first coefficient equals L_a[(p_n')^2]: the identity sum_j q_j^2=(p_n')^2-p_n p_n'' and actual orthogonality eliminate the latter product. The last coefficient is m0>0. Hence for n>=2,
 L_a[|p_n(t+ib)-p_n(t)|^2]
       >= b^2 L_a[(p_n')^2]+b^(2n)m0,                       (5)
with equality for n=2 and additional positive intermediate coefficients for n>2. In particular an upper bound by the first-order cost b^2 L_a[(p_n')^2] is false for every such actual theta residual. For n=1 the first-order formula is exact.

For the first even nonconstant residual p_2=t^2-alpha, this is directly
 debit=4b^2 m2+b^4m0,
independent of alpha. No finite numerical certificate is needed to demonstrate the failure of the proposed first-order contraction bound.

## 3. What remains possible

Setting b=a gives the exact debit in the correlated Hardy excess formula. Statements(1)-(5) do not say the Hardy excess is too small: a positive source can still pay a strictly expanding translation cost. They show that a solution cannot simply attribute contraction or coefficient cancellation to modular reflection. Any all-degree theta estimate must pay the positive degree-dependent terms in(4), or retain the exact prefix vector norm, against the *correlated* full-theta excess. No bound completing that payment is established here.
