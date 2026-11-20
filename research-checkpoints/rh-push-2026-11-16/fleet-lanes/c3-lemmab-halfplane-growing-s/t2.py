"""c3 t2: (a) for sigma0 > 1 the residue sum of the shifted Lemma B equals minus the Weil prime sum of the test Z_S w
 (absolutely convergent):  residues = -2 Re sum_n Lambda(n) n^-1/2 (1/2pi) int n^(-i tau) |zeta_S(delta+i tau) W(i tau)|^2 d tau  (+ pole term, O(T^-A)).
 (b) scan S = {p}, Tw = log p: actual E, sum of |residue terms|, against p^delta.   MEASURED float64."""
import numpy as np, math, json, sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from t1 import *
from lib import primes_upto
def weil_prime_sum(S, Tw, T, sigma0, N, m=3):
    S = np.array(S); d = sigma0 - 0.5; om = 2 * math.pi * m / Tw; X = 12 * om; h = 0.01
    tau = np.arange(T - X, T + X, h)
    f = np.abs(zS(d + 1j * tau, S)) ** 2 * np.abs(Wfun(1j * tau, T, Tw, m)) ** 2
    den = h * np.sum(f) / (2 * math.pi)
    ps = primes_upto(N); ns = []; lam = []
    for p in ps:
        q = int(p)
        while q <= N: ns.append(q); lam.append(math.log(p)); q *= int(p)
    ns = np.array(ns, float); lam = np.array(lam); ln = np.log(ns)
    ch = 100; print('prime powers', len(ns), 'grid', tau.size, 'chunk alloc %.0f MB' % (ch * tau.size * 16 / 1e6), flush=True)
    tot = 0.0; tot_abs = 0.0; part = {}
    order = np.argsort(ns); ns = ns[order]; lam = lam[order]; ln = ln[order]
    marks = [1e2, 1e3, 1e4, 1e5, 1e6]; mi = 0
    for i in range(0, len(ns), ch):
        I = (np.exp(-1j * np.outer(ln[i:i + ch], tau)) @ f) * h / (2 * math.pi)
        c = lam[i:i + ch] / np.sqrt(ns[i:i + ch]) * I
        tot += -2 * float(np.sum(c.real)); tot_abs += 2 * float(np.sum(np.abs(c)))
        while mi < len(marks) and (i + ch >= len(ns) or ns[min(i + ch, len(ns) - 1)] > marks[mi]):
            part[marks[mi]] = tot; mi += 1
    return tot, tot_abs, den, part
if __name__ == "__main__":
    out = {}
    r = run([2], 0.65, 3000.0, 2.0)
    P, Pabs, den, part = weil_prime_sum([2], 0.65, 3000.0, 2.0, int(sys.argv[1]) if len(sys.argv) > 1 else 1000000)
    print('sigma0=2 S={2}: residue sum %.10g   -Weil prime sum %.10g   diff %.2e   partial sums %s   sum|terms| %.4g' % (r['residues'], P, r['residues'] - P, part, Pabs), flush=True)
    out['poisson'] = dict(residues=r['residues'], weil_prime_sum=P, diff=r['residues'] - P, partial=part, abs_sum=Pabs, den_t1=r['den'], den_t2=den)
    scan = []
    for s0 in [0.9, 1.0, 1.25]:
        for p in [2, 3, 5, 7, 11, 23, 47, 101, 211]:
            x = run([p], math.log(p), 6000.0, s0)
            x['p_delta'] = p ** (s0 - 0.5); scan.append(x)
    out['scan'] = scan
    json.dump(out, open('t2.json', 'w'), indent=1)
    print('\n sigma0  p   Tw   Obar   E   sum|res|/den  p^delta  M  B1bound')
    for x in scan: print(' %.2f %4d %.3f %.3f %8.4f %9.4f %8.3f %.3f %9.2f' % (x['sigma0'], x['S'][0], x['Tw'], x['Obar'], x['E'], x['absE'], x['p_delta'], x['M'], x['B1_bound']))
