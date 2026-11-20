# de Faveri arXiv:2610.04045 Cor. 1.5 exponent delta_n(sigma), transcribed from the PDF text; continuity checked at the two breakpoints.
from fractions import Fraction as F
def delta(n,s):
    if s<=F(1,2)+F(1,n): return (2*s-1)/((1-2*s)*n+4)
    if s<=1-F(1,2*n): return (2*s-1)*((2*s-1)*n*n-(6*s-2)*n+3)/((2*s-1)*(3-2*s)*n*n-4*s*n+2)
    return (8*s*s-10*s+3)/(1-4*(1-s)**2*n)
for n in (3,4,6):
    a=F(1,2)+F(1,n); b=1-F(1,2*n)
    e=F(1,10**9)
    print('n',n,'continuity',float(delta(n,a)-delta(n,a+e)),float(delta(n,b)-delta(n,b+e)),'delta(1)=',delta(n,F(1)))
    print('  sigma: 1-delta_n   ', ' '.join(f"{float(s):.4f}:{float(1-delta(n,s)):.4f}" for s in (F(2,3),F(3,4),F(5,6),F(7,8),F(9,10),F(11,12),F(599,600))))
# large sieve: range where the new off-diagonal term exceeds A+B, and size at A=B, against (AB)^(2/3)
for n in (3,4,6):
    print('n',n,'extra term dominates for B^%s < A < B^%s; at A=B: A^%s (old A^4/3)'%(F(n-2,n-1),F(n-1,n-2),F(n+1,n)))
