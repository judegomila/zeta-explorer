# Union over primes p<=X of aligned nodes a + i*(2pi/log p)*k restricted to a height window. xi vs DH. MEASURED.
import sys, mpmath as mp
from aligned import Lxi, Ldh, mineig
mp.mp.dps = int(sys.argv[5]) if len(sys.argv) > 5 else 80
a = mp.mpf(sys.argv[1]); lo = float(sys.argv[2]); hi = float(sys.argv[3])
print('DH zero check |f|-log-deriv pole:', mp.nstr(abs(Ldh(mp.mpf('0.308517')+ 85.699348j)), 5))
primes = [2,3,5,7,11,13,17,19,23,29,31,37,41,43,47]
for X in [int(x) for x in sys.argv[4].split(',')]:
    ts = set()
    for p in primes:
        if p > X: break
        tau = 2*mp.pi/mp.log(p); k = int(lo/float(tau))
        while tau*k <= hi:
            if tau*k >= lo: ts.add(tau*k)
            k += 1
    ts = sorted(ts); nodes = [a + 1j*t for t in ts]
    print('X', X, 'n', len(nodes), 'xi', mineig(Lxi, nodes), 'DH', mineig(Ldh, nodes), flush=True)
