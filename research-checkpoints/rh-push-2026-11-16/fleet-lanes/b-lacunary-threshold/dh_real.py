import mpmath as mp
from aligned import Lxi, Ldh, mineig
mp.mp.dps = 60
for q, K in ((4, 7), (2, 14), (mp.sqrt(2), 24)):
    nodes = [mp.mpf(q)**k for k in range(K+1)]
    print('q', mp.nstr(q, 6), 'K', K, 'xi', mineig(Lxi, nodes), 'DH', mineig(Ldh, nodes), flush=True)
