# Scalar form (*): diagonal Gram value at lambda=(a, 2 eta), a = 1/2 - eta + i g, under the hypothesis M(a)=M(1-conj a)=0.
# Q(eta,t2) = e^{2 eta t2}/(4 eta (1-2eta)) - M^2 e^{-2 eta t2}/(4 eta (1+2eta)) - M' + (1+t2) M,  M = M(2 eta) (real point).
import mpmath as mp
from gram import xi
mp.mp.dps=40
M=lambda u: xi(u)/xi(u+1)
def Q(eta,t2):
    x=2*eta; m=M(x); dm=mp.diff(M,x)
    return mp.e**(x*t2)/(4*eta*(1-x)) - m*m*mp.e**(-x*t2)/(4*eta*(1+x)) - dm + (1+t2)*m
print('eta   M(2eta)   M\'(2eta)   Q at t2 = -1, -0.5, 0, 0.5, 1, 2')
for eta in ['0.001','0.01','0.05','0.1','0.2','0.3','0.4','0.45','0.49']:
    e=mp.mpf(eta)
    print(eta, mp.nstr(M(2*e),8), mp.nstr(mp.diff(M,2*e),8), [mp.nstr(Q(e,mp.mpf(t)),6) for t in (-1,-0.5,0,0.5,1,2)])
print('Q/eta^2 small eta:',[mp.nstr(Q(mp.mpf(10)**-k,0)/mp.mpf(10)**(-2*k),8) for k in (2,3,4)], [mp.nstr(Q(mp.mpf(10)**-k,1)/mp.mpf(10)**(-2*k),8) for k in (2,3,4)])
