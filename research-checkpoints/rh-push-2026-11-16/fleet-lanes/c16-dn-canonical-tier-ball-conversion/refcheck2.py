"""c16 referee check 2: flagged nodes of amendment A1, values recomputed with mpmath (kernel series written here;
only the character value tables come from kern.py).  usage: refcheck2.py <flagged_allchars.json> <outjson>"""
import json, sys
import mpmath as mp
import jobj
mp.mp.dps = 40
d = json.load(open(sys.argv[1]))
chars = {c.name: c for c in jobj.char_objs(3, 60)}


def kz(t):
    t = abs(mp.mpf(t))
    s = mp.mpf(0)
    n = 1
    while True:
        w = mp.pi * n * n * mp.exp(2 * t)
        if w > 120:
            break
        s += mp.exp(-w)
        n += 1
    return mp.exp(t / 2) * (1 + 2 * s)


def kchi(c, t):
    """|K_chi(t)| from the series at t (no reflection): sum 2 chi(n) n^d exp((1/2+d)t - pi n^2 e^(2t)/q)"""
    t = mp.mpf(t)
    A = mp.pi * mp.exp(2 * t) / c.q
    s = mp.mpc(0)
    n = 1
    while A * n * n < 120:
        v = c.vals[n % c.q]
        if abs(v) > 1e-9:
            ph = mp.atan2(mp.mpf(float(v.imag)), mp.mpf(float(v.real)))
            # exact root of unity from the rounded phase (order divides 2 phi(q) <= 2000)
            k = mp.nint(ph * 2000 / (2 * mp.pi))
            s += 2 * mp.expjpi(2 * k / mp.mpf(2000)) * (n ** c.d) * mp.exp(-A * n * n)
        n += 1
    return abs(s) * mp.exp((mp.mpf(1) / 2 + c.d) * t)


def L3(K, u, h):
    l = lambda x: mp.log(K(x))
    u, h = mp.mpf(u), mp.mpf(h)
    return l(u + 3 * h / 2) - 3 * l(u + h / 2) + 3 * l(u - h / 2) - l(u - 3 * h / 2)


out = []
for r in d['nodes'][:6]:
    z = L3(kz, r['u'], r['h'])
    rec = dict(node=r['node'], u=r['u'], h=r['h'], s=r['s'], lo=r['lo'], up=r['up'], zeta=mp.nstr(z, 15), viol=[])
    for name in r['wrong_names'][:4]:
        v = L3(lambda x: kchi(chars[name], x), r['u'], r['h'])
        wrong = (v < r['lo']) if r['s'] == 1 else (v > r['up'])
        rec['viol'].append((name, mp.nstr(v, 12), bool(wrong)))
    print(rec, flush=True)
    out.append(rec)
json.dump(out, open(sys.argv[2], 'w'), indent=1)
print('REFCHECK2-DONE')
