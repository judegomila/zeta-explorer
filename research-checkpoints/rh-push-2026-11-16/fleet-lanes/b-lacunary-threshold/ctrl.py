import mpmath as mp
from aligned import Lxi, Ldh, mineig
mp.mp.dps = 80
for n in (6, 8, 10, 14):
    nodes = [mp.mpf('0.55') + 1j*(75 + 21*mp.mpf(i)/(n-1)) for i in range(n)]
    print('uniform n', n, 'xi', mineig(Lxi, nodes), 'DH', mineig(Ldh, nodes))
