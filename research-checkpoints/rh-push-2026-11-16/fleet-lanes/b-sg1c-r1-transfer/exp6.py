# (1) exact identity d/ds[(1-Theta)/g] = (4 - 6 sum mu^2 - 2 sum mu^3)/g^3 for ANY adjacent pair (finite differences, mpmath 40 digits)
# (2) lattice constants: 12 sum a_r^2 + 4 sum a_r^3 = 4 ; Phi(K,K) = 4K/(K+1)^3
# (3) upward crossing with eps small at K=5,8 (initial derivative sign via exact formula)
import mpmath as mp, random
from fractions import Fraction as Fr
mp.mp.dps=40
def force(x):
    return [ -2*mp.fsum(1/(x[k]-x[j]) for j in range(len(x)) if j!=k) for k in range(len(x))]
def q(x,i):
    g=x[i+1]-x[i]
    E=mp.fsum(1/((x[i]-x[j])*(x[i+1]-x[j])) for j in range(len(x)) if j not in (i,i+1))
    return (1-g*g*E/2)/g
random.seed(5); worst=0
for t in range(20):
    N=random.randint(3,9)
    x=[mp.mpf(0)]
    for k in range(N-1): x.append(x[-1]+mp.mpf(random.uniform(0.3,2.5)))
    F=force(x); h=mp.mpf(10)**-12
    for i in range(N-1):
        xp=[a+h*f for a,f in zip(x,F)]; xm=[a-h*f for a,f in zip(x,F)]
        fd=(q(xp,i)-q(xm,i))/(2*h)
        g=x[i+1]-x[i]
        mus=[g*g/((x[i]-x[j])*(x[i+1]-x[j])) for j in range(N) if j not in (i,i+1)]
        ex=(4-6*mp.fsum(m*m for m in mus)-2*mp.fsum(m**3 for m in mus))/g**3
        worst=max(worst,abs(fd-ex)/(1+abs(ex)))
print("identity d/ds[(1-Theta)/g] = D/g^3, all adjacent pairs, max rel err:",mp.nstr(worst,5))
S2=mp.nsum(lambda r:1/(r*(r+1))**2,[1,mp.inf]); S3=mp.nsum(lambda r:1/(r*(r+1))**3,[1,mp.inf])
print("sum a^2 - (pi^2/3-3):",mp.nstr(S2-(mp.pi**2/3-3),5),"  sum a^3 - (10-pi^2):",mp.nstr(S3-(10-mp.pi**2),5),"  12S2+4S3 =",mp.nstr(12*S2+4*S3,30))
def a(r): return Fr(1,r*(r+1))
ok=True
for K in range(1,60):
    mus=[a(r) for r in range(1,K+1)]*2; Th=sum(mus)/2
    Phi=-4*Th*(2-Th)+6*sum(m*m for m in mus)+2*sum(m**3 for m in mus)
    ok&=(Phi==Fr(4*K,(K+1)**3))
print("Phi(K,K) == 4K/(K+1)^3 exactly for K=1..59:",ok)
