import json, mpmath as mp
mp.mp.dps = 25
d = json.load(open('nodes.json'))
# SMOOTH: ordinates g_n with theta(g_n)/pi + 1 = n - 1/2 (inverse of the smooth zero-counting function of zeta); no arithmetic input
out = []; g = mp.mpf(14)
for n in range(1, 3475):
    f = lambda t: mp.siegeltheta(t) / mp.pi + 1 - (n - mp.mpf(1) / 2)
    g = mp.findroot(f, g + (0 if n == 1 else 1)); out.append(float(g))
d['SMOOTH'] = dict(online=out, offline=[], H=4000.0)
json.dump(d, open('nodes.json', 'w')); print(out[:5], out[-1], d['ZETA']['online'][-1])
