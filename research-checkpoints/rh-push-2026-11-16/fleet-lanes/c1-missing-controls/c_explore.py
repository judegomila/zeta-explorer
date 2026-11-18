# exploration (non-rigorous): DH kernel log-derivatives on a grid, mpmath
import mpmath as mp
mp.mp.dps = 40
k0 = (mp.sqrt(10-2*mp.sqrt(5))-2)/(mp.sqrt(5)-1)
a = [0, 1, k0, -k0, -1]
c = mp.pi/5
def kap(u):
    x = mp.e**u
    return mp.e**(3*u/4)*sum(a[n%5]*n*mp.e**(-c*n*n*x) for n in range(1,60) if n%5)
def L(u): return mp.log(kap(u))
print('k0', k0)
print('evenness check kappa(-u)/kappa(u) - 1:', [mp.nstr(kap(-u)/kap(u)-1, 5) for u in (0.3, 1.0, 2.0)])
print('u, kappa, L1, L2, L3, L4, h=u*L2-L1')
for u in [0, 0.05, 0.1, 0.2, 0.4, 0.6, 0.8, 1.0, 1.25, 1.5, 2.0, 2.5, 3.0]:
    u = mp.mpf(u)
    d = [mp.diff(L, u, k) for k in (1,2,3,4)]
    print(mp.nstr(u,4), mp.nstr(kap(u),8), [mp.nstr(v,8) for v in d], mp.nstr(u*d[1]-d[0],8))
