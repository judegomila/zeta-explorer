import sys
sys.path.insert(0, sys.argv[0].rsplit('/',1)[0])
from common import *
from mpmath import exp, expm1, fabs
mp.dps = 60
nu = zetazero(1) - 1
u = mpf(1000)
def W2(u, nu, M, J):
    tot = zeta(nu)/u - zeta(nu+1)/2
    for m in range(1, M):
        h = u/m
        tot += mpf(m)**(-nu-1)*(1/expm1(h) - 1/h + mpf(1)/2)
    tail = 0
    for j in range(1, J+1):
        tail += bernoulli(2*j)/factorial(2*j)*u**(2*j-1)*zeta(nu+2*j, M)
    return tot, tail
for M, J in ((1030, 14), (4030, 14), (4030, 30), (8000, 30), (8000, 60)):
    a, b = W2(u, nu, M, J)
    print(M, J, mp.nstr(a+b, 15), mp.nstr(fabs(b), 5))
print("pred", mp.nstr(gamma(nu)*zeta(nu)*u**(-nu), 15))
print(mp.nstr(zeta(nu+2, 4030), 20), mp.nstr(sum(mpf(m)**(-nu-2) for m in range(4030, 200000)), 12))
