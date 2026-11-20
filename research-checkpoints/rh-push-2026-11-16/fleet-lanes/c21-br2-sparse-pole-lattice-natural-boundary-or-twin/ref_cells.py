# Second implementation of three cells of radial.json: direct complex product, no shared code. < 10 MB.
import json
from mpmath import mp, mpf, mpc, exp, log, pi, sqrt, fabs
mp.dps = 60
R = {(x['kind'], x['theta']): x for x in json.load(open(__file__.replace('ref_cells.py', 'radial.json')))}
def lam(kind, k, exact):
    if k <= len(exact): return log(mpf(int(exact[k-1])))
    return exp(mpf(k)) if kind == 'ek' else mpf(k)**3
def cell(kind, th, rowi, j):
    x = R[(kind, th)]; row = x['rows'][rowi]; d = mpf(10)**(-j); ex = x['exact_primes']
    thf = (lambda k: mpf(0)) if th == 'zero' else (lambda k: 2*pi*((k*(sqrt(mpf(5))-1)/2) % 1))
    if row['type'] == 'pole': t = (thf(row['k']) + 2*pi*row['n'])/lam(kind, row['k'], ex)
    else:                         # generic t = m/2^53*100 regenerated from the seed (the stored float is rounded)
        import random; rnd = random.Random(20261120)
        ts = [mpf(rnd.getrandbits(53))/2**53*100 for _ in range(5)]; t = ts[rowi-20]
    s = mpc(mpf(1)/2 + d, t); y = mpf(0); k = 1
    while True:
        L = lam(kind, k, ex)
        if L*d > 150: break
        if row['type'] == 'pole' and k == row['k']: den = 1 - exp(-L*d)
        else: den = 1 - exp(mpc(0, thf(k)))*exp(-L*(s - mpf(1)/2))
        num = 1 - exp(-L*s)
        y += log(fabs(num)) - log(fabs(den)); k += 1
    return float(y), row['y'][j-1]
for args in (('ek', 'rot', 7, 30), ('k3', 'rot', 22, 8), ('k3', 'zero', 3, 9), ('ek', 'zero', 21, 20)):
    a, b = cell(*args); print(args, 'direct %.12f  stored %.12f  diff %.2e' % (a, b, a-b))
