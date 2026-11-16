# Rung-operator norm lambda_R(a,theta) = lambda_max( sum_{n<e^{2a}} Lambda(n) n^{-1/2-theta} 2 S(log n) ) on L^2(-a,a)
# (aligned phases = torus sup, since all coefficients are >= 0), and the floor height T = 2 pi exp(lambda_R)
# below which a prime-only certificate has to control the twisted rung operator at every t.
import numpy as np, math
from galerkin import S_of_u, vm_table
def lamR(twoa, thetas, N=90):
    a = twoa/2; Nmax = int(math.exp(twoa)); lam = vm_table(Nmax)
    xg, wg = np.polynomial.legendre.leggauss(N+4)
    M = [np.zeros((N,N)) for _ in thetas]; crude = [0.0]*len(thetas)
    for n in range(2, Nmax+1):
        if lam[n] == 0 or math.log(n) >= twoa: continue
        S = S_of_u(math.log(n), N, a, xg, wg)
        for i, th in enumerate(thetas):
            M[i] += lam[n]*n**(-0.5-th)*2*S; crude[i] += 2*lam[n]*n**(-0.5-th)
    return [float(np.linalg.eigvalsh(m)[-1]) for m in M], crude
ths = [0.0, 0.1, 0.2, 0.3, 0.375]
for twoa, tag in ((math.log(11),'ln 11'), (7.0511,'crossover d0=1/2'), (8.7672,'crossover d0=3/8, theta=0'), (11.043,'crossover d0=3/8, theta=0.1'), (12.0,'12')):
    for N in (60, 90):
        lr, cr = lamR(twoa, ths, N)
        print(tag, f"2a={twoa:.3f} N={N}", " ".join(f"th={t}: lamR={l:.2f} (crude {c:.1f}; log10 T_floor={(l+math.log(2*math.pi))/math.log(10):.1f})" for t, l, c in zip(ths, lr, cr)), flush=True)
