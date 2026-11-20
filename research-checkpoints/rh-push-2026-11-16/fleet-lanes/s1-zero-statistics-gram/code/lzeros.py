"""Zeros of Z_chi, Z_chibar, DH = Z_chi + Z_chibar, DHALT = Z_chi - Z_chibar and of cos(phi) Z_chi + sin(phi) Z_chibar from the sample files.
Usage: lzeros.py OUT.npz LS_A.npz:lo:hi LS_B.npz:lo:hi ...   (zeros with lo <= t < hi kept from each block)
Output arrays per object: t_<name> (ordinates), x_<name> (theta0(t)/pi, unit mean density for the full zero set of L(chi))."""
import sys, math, json, numpy as np
import rsref as R
import lsample as Ls

def zeros_from_samples(S, t0, h):
    W, U = R.W, R.U
    J = len(S); SEG = 2000000; parts = []; nh = 0
    for s0 in range(W, J - W, SEG):
        s1 = min(s0 + SEG, J - W)
        Fs = R.upsample(S[s0 - W: s1 + W])
        rr, nn = R.find_roots(Fs, W * U, (s1 - s0 + W) * U + 1)
        parts.append(rr / U + (s0 - W)); nh += nn
    rc = np.concatenate(parts)
    rp = R.polish(S, rc)
    bad = int((np.diff(rp) <= 0).sum())
    if bad == 0: rc = rp
    return t0 + rc * h, nh, bad

if __name__ == '__main__':
    out = sys.argv[1]
    phis = {'CHI': None, 'CHIBAR': None, 'DH': math.pi / 4, 'DHALT': -math.pi / 4,
            'MIX05': 0.05 * math.pi / 4, 'MIX20': 0.2 * math.pi / 4, 'MIX50': 0.5 * math.pi / 4, 'MIX80': 0.8 * math.pi / 4}
    acc = {k: [] for k in phis}; meta = {}
    for spec in sys.argv[2:]:
        f, lo, hi = spec.split(':'); lo = float(lo); hi = float(hi)
        d = np.load(f); t0 = float(d['t0']); h = float(d['h']); Z1 = d['Z1']; Z2 = d['Z2']
        for k, phi in phis.items():
            S = Z1 if k == 'CHI' else Z2 if k == 'CHIBAR' else math.cos(phi) * Z1 + math.sin(phi) * Z2
            t, nh, bad = zeros_from_samples(S, t0, h)
            t = t[(t >= lo) & (t < hi)]
            acc[k].append(t)
            exp = (Ls.theta0(np.array([hi]))[0] - Ls.theta0(np.array([lo]))[0]) / math.pi
            meta['%s|%s' % (k, spec)] = dict(n=int(len(t)), expected_full=float(exp), hidden=int(nh), order_violations=bad, imres=float(d['imres']))
            print(k, spec, json.dumps(meta['%s|%s' % (k, spec)]), flush=True)
    res = {}
    for k in phis:
        t = np.concatenate(acc[k]); res['t_' + k] = t; res['x_' + k] = Ls.theta0(t) / math.pi
    np.savez(out, meta=json.dumps(meta), **res)
