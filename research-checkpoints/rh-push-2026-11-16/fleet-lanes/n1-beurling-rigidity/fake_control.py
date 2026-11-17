# Integer-mass positive self-dual measure that is not a multiple of the Dirac comb:
# mu = 4 III_{2Z} + 2 III_{Z/2} + 4 III_{4Z} + III_{Z/4};  mass at 0 is 11, smallest atom 1 at t=1/4.
from mpmath import mp, mpf, exp, pi, sqrt, zeta, acosh, log, mpc, nstr, findroot
mp.dps=30
def m(k):  # mass at t=k/4, k != 0
    return 1 + 2*(k%2==0) + 4*(k%8==0) + 4*(k%16==0)
def Th(x): return 11 + 2*sum(m(k)*exp(-pi*(mpf(k)/4)**2*x) for k in range(1,400))
for x in ['0.3','0.7','1.9']:
    x=mpf(x); print("x",x,"theta defect",nstr(Th(x)-Th(1/x)/sqrt(x),5))
D=lambda s: 4*(2**(-s)+2**(s-1))+4*(4**(-s)+4**(s-1))
w=(-4*sqrt(2)-sqrt(32+128))/16
s0=mpf(1)/2+(acosh(-w)+1j*pi)/log(2)
print("w_-",nstr(w,8),"zero s0",nstr(s0,12),"|D(s0)|",nstr(abs(D(s0)),5),"|D zeta(s0)|",nstr(abs(D(s0)*zeta(s0)),5))
# Dirichlet series check at s=3: sum m(k)(k/4)^-3 vs D(3) zeta(3)
print("series check",nstr(sum(m(k)*(mpf(k)/4)**-3 for k in range(1,200000))-D(3)*zeta(3),5))
