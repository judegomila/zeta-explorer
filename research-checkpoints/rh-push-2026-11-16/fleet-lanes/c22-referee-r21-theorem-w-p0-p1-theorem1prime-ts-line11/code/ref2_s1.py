# S1 at t = 0 with the census lane's stated convention (q_k = nearest prime to exp(e^(k/2))), trying k from 0 and from 1.
import json, flint, mpmath as mp
from flint import arb, fmpz
flint.ctx.prec = 300; mp.mp.dps = 1200
def nearest_prime(x):
    c = int(mp.floor(x)); best = None
    lo = c
    while not fmpz(lo).is_probable_prime(): lo -= 1
    hi = c + 1
    while not fmpz(hi).is_probable_prime(): hi += 1
    return lo if (x - lo) <= (hi - x) else hi
out = {}
for kstart in (0, 1):
    L = []; pr = []
    for k in range(kstart, 76):
        fk = mp.exp(mp.mpf(k)/2)
        if k <= 13:
            p = nearest_prime(mp.exp(fk)); pr.append(str(p) if k < 6 else None); L.append(arb(fmpz(p)).log())
        else:
            L.append(arb(mp.nstr(fk, 80)) + arb(0, 2.0**-200))
    row = []
    for j in (4, 10, 16, 22, 28, 34, 40):
        d = arb(2)**(-j); y = arb(0)
        for lk in L:
            y += -(1 - (-d*lk).exp()).log() + (1 - (-(arb(1)/2 + d)*lk).exp()).log()
        row.append((j, float(y.mid())))
    out['kstart_%d' % kstart] = dict(first_primes=pr[:6], y=row)
out['census_reported'] = [8.797, 51.03, 128.06, 239.68, 385.89, 566.70, 782.10]
print(json.dumps(out, indent=1)); json.dump(out, open('s1.json', 'w'), indent=1)
