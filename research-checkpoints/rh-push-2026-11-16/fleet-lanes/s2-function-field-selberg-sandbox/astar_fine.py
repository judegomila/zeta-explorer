"""astar_fine.py: first failing support A* of the twisted Weil form on a fine grid (d = 0.0125, step 0.0125) for the characters of a geod file.
usage: astar_fine.py geodfile s0.json out.json [Amax]"""
import sys, json, math, numpy as np, tf
G = tf.load_geod(sys.argv[1]); s0 = {(round(r['a'], 6), round(r['b'], 6)): r['zeros'] for r in json.load(open(sys.argv[2]))}
d = float(sys.argv[5]) if len(sys.argv) > 5 else 0.0125; Amax = float(sys.argv[4]) if len(sys.argv) > 4 else 9.5; n = int(round(Amax / d)) - 1
print(f'n={n}; planned memory {3 * n * n * 8 / 1e9:.3f} GB', flush=True)
I1 = tf.arch_entries(n, d, lambda g, gp, S, pc: tf.ident(g, gp, S, 1.0, pc))
G0 = np.zeros(n); G0[0] = d * 2 / 3; G0[1] = d / 6; Gm = tf.gram(n, d); l0 = float(G['ell'][np.nonzero(G['tw'][:, 0])[0][0]])
out = []
for c in range(len(G['a'])):
    a, b = G['a'][c], G['b'][c]; z = s0.get((round(a, 6), round(b, 6)), [])
    m = 2 * math.pi * I1 + tf.deposit(G['ell'], G['amp'] * G['tw'][:, c], d, n) - tf.cusp_const(a, b) * G0
    M = tf.toeplitz(m, n)
    f = lambda k: tf.min_eig(M[:k, :k], Gm[:k, :k])[0]
    if f(n) >= -1e-9: first = None
    else:
        lo, hi = 8, n          # bisection on the nested family (min eig is nonincreasing in k)
        while hi - lo > 1:
            mid = (lo + hi) // 2
            if f(mid) < -1e-9: hi = mid
            else: lo = mid
        first = (hi + 1) * d
    kap = (z[0] - 0.5) if z else None
    w0 = float(G['tw'][np.nonzero(G['tw'][:, 0])[0][0], c])
    rec = dict(a=a, b=b, kappa=kap, Astar=first, Astar_over_l0=(first / l0 if first else None), Astar_kappa=(first * kap if first and kap else None), cusp_const=tf.cusp_const(a, b), w_trace6=w0,
               mineig_at_Amax=f(n))
    out.append(rec); print(json.dumps(rec), flush=True)
json.dump(dict(l0=l0, d=d, Amax=Amax, rows=out), open(sys.argv[3], 'w'))
