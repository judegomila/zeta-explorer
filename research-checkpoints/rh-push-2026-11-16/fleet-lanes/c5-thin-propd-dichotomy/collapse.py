"""collapse.py -- coherent term as a function of the row cutoff M and the column scale Z.

From the shell-resolved aggregates: for M = 2^k <= Z (rows 0 < N(m) < M),
  E_ref(M, Z) = sum_{N(m) < M} (|C_ref(Z; m)|^2 - D_m),  ref = liou
Poisson heuristic (RESULT.md section 1): E_ref(M, Z) = (M / Z) M_ref(Z)^2 * N(Z^2 / M) + noise, N(Y) = (weighted) number
of coherent dual frequencies H with N(H) <~ Y.  Printed: nu = E_ref Z / (M M_ref^2) against Y = Z^2/M.
Usage: python collapse.py test Z1 Z2 ... [--dir d] [--json out]
"""
import sys, os, json, math
import numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from analyze import load, WEIGHTS, wfit

def main():
    args = sys.argv[1:]
    ddir = 'data'; jout = None; ref = 'liou'
    if '--dir' in args: i = args.index('--dir'); ddir = args[i + 1]; del args[i:i + 2]
    if '--json' in args: i = args.index('--json'); jout = args[i + 1]; del args[i:i + 2]
    if '--ref' in args: i = args.index('--ref'); ref = args[i + 1]; del args[i:i + 2]
    test = args[0]; Zs = [int(z) for z in args[1:]]
    v = WEIGHTS.index(ref)
    pts = []
    for Z in Zs:
        d = load(os.path.join(ddir, f'agg_{test}_{Z}.bin')); s = json.load(open(os.path.join(ddir, f'in_{test}_{Z}.bin.side.json')))
        Mr = s['mertens'][ref]
        xm = d['xm'].sum(axis=(1, 2))[:, v, v].real; xd = d['xd'].sum(axis=(1, 2))[:, v, v]; xv = d['xv'].sum(axis=(1, 2))[:, v, v]
        cnt = d['cnt'].sum(axis=(1, 2))
        E = np.cumsum(xm - xd); V = np.cumsum(xv); n = np.cumsum(cnt)
        for k in range(len(E)):
            M = 2 ** (k + 1)
            if M > Z or M < 64: continue
            nu = E[k] * Z / (M * Mr ** 2); snu = math.sqrt(V[k]) * Z / (M * Mr ** 2)
            pts.append((Z * Z / M, nu, snu, Z, M, int(n[k])))
    pts.sort()
    P = np.array([(p[0], p[1], p[2]) for p in pts])
    print(f"test {test}, ref {ref}: {len(pts)} points (Z, M); nu = E Z/(M M_ref^2) binned in log2 Y, Y = Z^2/M (weighted mean, se, chi2 of the spread within the bin)")
    out = {'test': test, 'ref': ref, 'points': pts, 'bins': []}
    lo = math.floor(math.log2(P[:, 0].min())); hi = math.ceil(math.log2(P[:, 0].max()))
    for b in range(lo, hi + 1, 2):
        sel = (np.log2(P[:, 0]) >= b) & (np.log2(P[:, 0]) < b + 2)
        if sel.sum() == 0: continue
        w = 1 / P[sel, 2] ** 2; m = (w * P[sel, 1]).sum() / w.sum(); se = 1 / math.sqrt(w.sum()); chi = (w * (P[sel, 1] - m) ** 2).sum()
        out['bins'].append([b, int(sel.sum()), float(m), float(se), float(chi)])
        print(f"  log2 Y in [{b:2d},{b + 2:2d}): n = {int(sel.sum()):3d}  nu = {m:8.3f} +- {se:.3f}   chi2/(n-1) = {chi:.1f}/{int(sel.sum()) - 1}   Y^(1/6) = {2 ** ((b + 1) / 6):.2f}")
    good = P[:, 1] > 3 * P[:, 2]
    for ymin in (2 ** 12, 2 ** 16, 2 ** 20):
        g = good & (P[:, 0] >= ymin)
        if g.sum() < 5: continue
        b, sb, chi2, dof, sbs, a = wfit(np.log(P[g, 0]), np.log(P[g, 1]), P[g, 2] / P[g, 1])
        print(f"  exponent of nu in Y (points with nu > 3 se, Y >= 2^{int(math.log2(ymin))}; {int(g.sum())} points): {b:.4f} +- {sbs:.4f} (chi2/dof {chi2:.0f}/{dof}); sixth-power count 0.1667")
        out[f'exp_ymin_{int(math.log2(ymin))}'] = [b, sb, sbs, chi2, dof, int(g.sum())]
    if jout: json.dump(out, open(jout, 'w'), indent=1)

if __name__ == '__main__':
    main()
