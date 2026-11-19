import numpy as np, math
from scipy.optimize import minimize
kap = (math.sqrt(10 - 2*math.sqrt(5)) - 2)/(math.sqrt(5) - 1); c1, c2 = (1 - 1j*kap)/2, (1 + 1j*kap)/2
CHI = {1: 1, 2: 1j, 3: -1j, 4: -1, 0: 0}
def E(P, th, tw): 
    r = 1
    for p, t, x in zip(P, th, tw): r = r/(1 - p**-0.5*np.exp(1j*t)*x)
    return r
def D(P, th): ch = [CHI[p % 5] for p in P]; return c1*E(P, th, ch) + c2*E(P, th, [np.conj(x) for x in ch])
rng = np.random.default_rng(1)
for P in ([2], [2, 3], [2, 3, 7], [2, 3, 37], [2, 3, 31]):
    for nm, f in (('ReE', lambda th: E(P, th, [1]*len(P)).real), ('ReD', lambda th: D(P, th).real), ('absD', lambda th: abs(D(P, th)))):
        best = min((minimize(f, rng.uniform(0, 2*np.pi, len(P)), method='Nelder-Mead', options={'xatol': 1e-11, 'fatol': 1e-14}).fun for _ in range(60)))
        print(P, nm, 'min', round(float(best), 6))
    print(P, 'sum arcsin deg', sum(math.degrees(math.asin(p**-0.5)) for p in P))
# L1 norms
n = 2000; th = 2*np.pi*np.arange(n)/n
print('L1 E {2}', np.abs(E([2], [th], [1])).mean(), 'L1 D {2}', np.abs(D([2], [th])).mean())
A, B = np.meshgrid(th[::2], th[::2], indexing='ij'); print('L1 E {2,3}', np.abs(E([2, 3], [A, B], [1, 1])).mean(), 'L1 D {2,3}', np.abs(D([2, 3], [A, B])).mean(), 'mean D', D([2,3],[A,B]).mean())
# reserve inequality
from sympy import primerange
for t in (1e4, 1e12):
    L = math.log(t/(2*math.pi)); s = 0; last = None
    for p in primerange(2, 200):
        s += 2*math.log(p)/(math.sqrt(p) - 1)
        if s < L: last = p
        else: break
    print('t', t, 'log(t/2pi)', L, 'largest admitted prime', last)
for P in ([2, 3], [2, 3, 5]):
    s = sum(2*math.log(p)/(math.sqrt(p) - 1) for p in P); print(P, 'threshold t', 2*math.pi*math.exp(s))
# A2 prediction
P = [2, 3, 5, 7, 11]; th = [5.430, 5.331, 5.236, 5.186, 5.224]; r = 1
for p, t in zip(P, th): r = r/(1 - p**-0.5*(1 if p == 11 else 0.7)*np.exp(1j*t))
print('A2 pred', r)
