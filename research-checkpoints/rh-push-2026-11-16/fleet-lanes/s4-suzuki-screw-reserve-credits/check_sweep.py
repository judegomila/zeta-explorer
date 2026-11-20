"""compare sweep output with the mpmath reference (lib.py) at chunk starts, and the final R with the PR-23 receipt."""
import sys, math, numpy as np, mpmath as mp
from lib import *
mp.mp.dps = 30
pref = sys.argv[1]; N = int(float(sys.argv[2]))
K = consts()
tot = {}
for ln in open(pref + '.totals.txt'):
    if ln.startswith('P='): continue
    nm, s, j = ln.split(); tot[nm] = (mp.mpf(s[2:]), mp.mpf(j[2:]))
S, J = tot['zeta']; H = S - K['b']; Rf = J - 2*H*(mp.log(H/2) - 1) - 4 + K['Tinf']
print('zeta final R at N =', N, ':', mp.nstr(Rf, 20), ' (receipt at 1e7: 0.0379442133347272172)')
rows = [ln.split() for ln in open(pref + '.chk.txt')]
pp = prime_powers(min(N, 10**7))
import bisect
qs = [q for q, p, k in pp]
worst = 0
for row in rows[1:8:2] + rows[-1:]:
    lo = int(row[0])
    if lo > 10**7: continue
    r = mp.log(lo); m = bisect.bisect_left(qs, lo)
    for oi, o in enumerate(OBJ):
        ref = Cfun(obj_bridge(o), r) - mp.fsum(obj_weight(o, p, k)*(r - mp.log(q)) for q, p, k in pp[:m])
        got = mp.mpf(row[1 + 4*oi + 2])
        worst = max(worst, abs(ref - got)/(1 + abs(ref)))
        if lo == int(rows[-1][0]): print('  %-11s Psi(log %d) sweep %.12g  reference %.12g' % (o['name'], lo, got, ref))
print('max relative difference sweep vs reference at chunk starts:', mp.nstr(worst, 5))
