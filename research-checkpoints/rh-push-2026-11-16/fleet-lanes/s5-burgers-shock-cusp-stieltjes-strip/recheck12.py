"""30-digit re-check (mpmath, Riemann-Siegel) of M(x, Y) = (1/2) Re xi'/xi(1/2 + Y/2 + i t) at the minima found at height 1e12:
zero-side minima of c4_zeta12.json and the prime-side minima of p4_zeta_1000000000000.json. Parallel over points (RH_WORKERS)."""
import json, os, sys
import mpmath as mp
HERE = os.path.dirname(os.path.abspath(__file__)); OUT = os.environ.get('RH_OUT', os.path.join(HERE, 'out'))
P_REQ = 4.37426
def one(a):
    Y, T, off, src, val = a
    mp.mp.dps = 34
    de = mp.mpf(Y) / 2; t = mp.mpf(T) + mp.mpf(repr(off)); s = mp.mpc(mp.mpf(1) / 2 + de, t); h = mp.mpf('1e-9')
    lz = (mp.log(mp.zeta(s + h)) - mp.log(mp.zeta(s - h))) / (2 * h)
    full = lz + 1 / s + 1 / (s - 1) - mp.log(mp.pi) / 2 + mp.digamma(s / 2) / 2
    return dict(Y=Y, t_offset=off, T=T, source=src, screen_value=val, mpmath_value=float(full.real) / 2, p_req=P_REQ, below=bool(float(full.real) / 2 < P_REQ))
if __name__ == '__main__':
    pts = []
    d = json.load(open(os.path.join(OUT, 'c4_zeta12.json')))
    for k, r in d['widths'].items(): pts.append((r['Y'], '1000000000000', r['t_at_min_offset'], 'zero side (list, grid minimum)', r['min']))
    p = json.load(open(os.path.join(OUT, 'p4_zeta_1000000000000.json')))
    for k, r in p['cols'].items(): pts.append((r['Y'], '1000000000000', r['t_at_min_minus_T'], 'prime side M_K (grid minimum over 1.34e8 samples)', r['M_K']['min']))
    from multiprocessing import Pool
    with Pool(int(os.environ.get('RH_WORKERS', '2'))) as P:
        res = []
        for r in P.imap(one, pts): res.append(r); print(json.dumps(r), flush=True)
    json.dump(res, open(os.path.join(OUT, 'c4_recheck_1e12.json'), 'w'), indent=1)
