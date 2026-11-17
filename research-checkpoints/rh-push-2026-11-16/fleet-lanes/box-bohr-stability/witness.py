"""Locate explicit off-line zeros (mpmath, 30 digits) for first-failure objects, as witnesses for the certified counts."""
import mpmath as mp, numpy as np, math, json
import bl
mp.mp.dps = 30
def G(s): return mp.pi ** (-s / 2) * mp.gamma(s / 2)
def afe(N, eps=lambda n: 1):
    def F(s):
        D = lambda w: mp.fsum(eps(n) * mp.mpf(n) ** (-w) for n in range(1, N + 1))
        return G(s) * D(s) + G(1 - s) * D(1 - s)
    return F
def euler(P, K=1):
    ps = bl.primes_upto(P)
    def F(s):
        E = lambda w: mp.fprod(mp.fsum(mp.mpf(p) ** (-k * w) for k in range(K + 1)) for p in ps)
        return G(s) * E(s) + G(1 - s) * E(1 - s)
    return F
def scan(obj, ta, tb, W):
    # float grid for a minimum of |F| off the line, then Newton
    ts = np.linspace(ta, tb, int((tb - ta) / 0.02)); best = []
    for x in np.linspace(0.03, W, 40):
        v = np.abs(bl.to_np(obj.F(bl.xp.asarray(0.5 + x + 1j * ts))))
        j = int(np.argmin(v)); best.append((v[j], x, ts[j]))
    out = []
    for v, x, t in sorted(best)[:6]:
        out.append((x, t))
    return out
res = {}
for name, F, obj, ta, tb, W in (('zeta afe N=5 matched', afe(5), bl.Obj('zeta', 'afe', 5), 157.09, 226.21, 1.0),
                                ('zeta afe N=2 [3,53]', afe(2), bl.Obj('zeta', 'afe', 2), 3.01, 53.01, 1.0),
                                ('zeta euler P=11 K=1 [3,103]', euler(11), bl.Obj('zeta', 'euler', 11, K=1), 3.01, 103.01, 0.5),
                                ('tw2m afe N=3 matched', afe(3, lambda n: (-1) ** bl.factor(n).get(2, 0)), bl.Obj('tw2m', 'afe', 3), 56.56, 100.54, 1.0)):
    found = []
    for x, t in scan(obj, ta, tb, W):
        try:
            z = mp.findroot(F, mp.mpc(0.5 + x, t))
            if abs(z.real - 0.5) > 1e-6 and ta < z.imag < tb and all(abs(z - w) > 1e-6 for w in found):
                found.append(z)
        except Exception:
            pass
    res[name] = [(mp.nstr(z.real, 12), mp.nstr(z.imag, 12), mp.nstr(abs(F(z)) / abs(G(z)), 3)) for z in found]
    print(name, res[name], flush=True)
json.dump(res, open('results/witness.json', 'w'), indent=1)
