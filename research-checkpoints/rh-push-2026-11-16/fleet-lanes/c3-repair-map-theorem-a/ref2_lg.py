# Landau-Gonek side (dual of Theorem A'): sums over zeta zeros with Abel weights, and one row of tables.txt.
# Zeros: acb.zeta_zeros (python-flint, rigorous isolation); sums in ball arithmetic. Planned memory: 20000 acb, < 50 MB.
import json, math, time
from flint import acb, arb, ctx
ctx.prec = 80
t = time.time()
NZ = 20000
Z = acb.zeta_zeros(1, NZ); G = [z.imag for z in Z]
print('zeros', NZ, 'last', G[-1], 'seconds', round(time.time() - t, 1))
PI = arb.pi(); out = {}
def primes(n): return [p for p in range(2, n + 1) if all(p % q for q in range(2, int(p**0.5) + 1))]
def zS2(P, g):          # |zeta_S(1/2 + i g)|^2
    v = arb(1)
    for p in primes(P):
        v *= abs(1 - acb(p)**(-acb(arb(1)/2, g)))**(-2)
    return v
def MP(P): return math.prod(1/(1 - 1/p) for p in primes(P))
def cP(P): return sum(math.log(p)/(p - 1) for p in primes(P))
# (i) table row: T0 = 1e3, 2000 zeros from the first zero above 1e3, P = 10 and 100 (tables.txt TABLE 1: 0.3595, 0.0705)
i0 = next(i for i, g in enumerate(G) if g > 1000)
blk = G[i0:i0 + 2000]
for P in (10, 100):
    A0 = sum((zS2(P, g) for g in blk), arb(0)); r = A0/(2000*MP(P))
    out['table1_T0=1e3_P=%d_Rref' % P] = str(r); print('Rref 1e3 P', P, r)
# (ii) Abel-weighted Landau sums: sum_{gamma>0} n^{i gamma} e^{-delta gamma} + Lambda(n) n^{-1/2}/(2 pi delta) stays O(log 1/delta)
Lam = {2: math.log(2), 3: math.log(3), 4: math.log(2), 5: math.log(5), 6: 0.0, 7: math.log(7), 8: math.log(2), 10: 0.0}
rows = []
for d in (0.02, 0.01, 0.005, 0.0025):
    w = [(-arb(d)*g).exp() for g in G]
    N = sum(w, arb(0))
    row = {'delta': d, 'N_delta': str(N), 'L_delta=2 pi delta N': float((2*PI*d*N).mid()),
           'pred (log(1/(2 pi delta)) - gamma_E)': math.log(1/(2*math.pi*d)) - 0.5772156649}
    for n in Lam:
        s = sum(((acb(0, 1)*g*math.log(n)).exp()*wi for g, wi in zip(G, w)), acb(0))
        row['n=%d: 2 pi delta sum n^(i gamma) e^(-delta gamma)' % n] = [float((2*PI*d*s).real.mid()), float((2*PI*d*s).imag.mid())]
        row['n=%d: pred -Lambda(n)/sqrt(n)' % n] = -Lam[n]/math.sqrt(n)
    for P in (2, 3, 10):
        A = sum((zS2(P, g)*wi for g, wi in zip(G, w)), arb(0))
        row['P=%d: R = A/(N M_P)' % P] = float((A/(N*MP(P))).mid())
        row['P=%d: 1 - 2 c_P/L_delta' % P] = 1 - 2*cP(P)/float((2*PI*d*N).mid())
    rows.append(row); print(json.dumps(row))
out['abel_landau'] = rows
out['truncation'] = 'zeros to height %.1f; weight at the cut for delta=0.0025: %.1e' % (float(G[-1].mid()), math.exp(-0.0025*float(G[-1].mid())))
json.dump(out, open('ref2_lg.json', 'w'), indent=1)
print('seconds', round(time.time() - t, 1))
