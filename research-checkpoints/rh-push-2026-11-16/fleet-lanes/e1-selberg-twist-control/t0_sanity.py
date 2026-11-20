import sys, time, numpy as np, json
sys.path.insert(0, 'tmp/research-2026-11-16/push/e1-selberg-twist-control')
from sel import *
a, b = 0.03, 0.05
# homomorphism checks
import itertools, random
random.seed(1)
gens = [T, L, inv(T), inv(L), S]
mx = 0
for _ in range(200):
    g = random.choice(gens); h = random.choice(gens)
    for _ in range(4): g = mul(g, random.choice(gens)); h = mul(h, random.choice(gens))
    mx = max(mx, np.abs(rho(g, a, b) @ rho(h, a, b) - rho(mul(g, h), a, b)).max())
print('max |rho(g)rho(h)-rho(gh)| =', mx)
print('chi(A), chi(B), chi(AB^-1) exponents:', ab_exponents(((1,2),(0,1))), ab_exponents(((1,0),(2,1))), ab_exponents(mul(((1,2),(0,1)), inv(((1,0),(2,1))))))
print('eigenphases rho(T):', sorted(np.round(np.angle(np.linalg.eigvals(rho(T,a,b)))/(2*np.pi),6)))
print('eigenphases rho(L):', sorted(np.round(np.angle(np.linalg.eigvals(rho(L,a,b)))/(2*np.pi),6)))
t0=time.time()
for K in (20, 28, 36):
    print('K', K, 'Z(2)=', Ztw(2, a, b, K=K), 'Z(0.8)=', Ztw(0.8, a, b, K=K), 'Z(0.3+2i)=', Ztw(complex(0.3,2), a, b, K=K), round(time.time()-t0,1), flush=True)
for tmax in (60, 400):
    acc, ntr, cnt = euler_logZ([2, 3, complex(1.5, 2)], a, b, tmax)
    print('tmax', tmax, 'words', cnt, 'exp(logZ) s=2:', np.exp(acc[0]), 's=3:', np.exp(acc[1]), 's=1.5+2i:', np.exp(acc[2]), flush=True)
print('det s=3:', Ztw(3, a, b, K=36), 'det s=1.5+2i:', Ztw(complex(1.5,2), a, b, K=36))
# trivial character: compare trivial-rep sum
acc, ntr, cnt = euler_logZ([2], 0.0, 0.0, 400)
print('chi=1: Euler Z_Gamma(2)(2)=', np.exp(acc[0]), ' det:', Ztw(2, 0.0, 0.0, K=36), ' Z_PSL2Z(2)=', Zmod(2))
