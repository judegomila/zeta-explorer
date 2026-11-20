"""per-chunk ratios (pair criterion over prediction) on a list: dispersion against the Poisson error, and the height dependence.
Usage: c4_chunks.py LIST.npy q tau chunk"""
import sys, math, numpy as np, c4lib
g = np.load(sys.argv[1], mmap_mode='r'); q = int(sys.argv[2]); tau = float(sys.argv[3]); ch = int(sys.argv[4]); Bb = c4lib.Bbar()
rat = []; hts = []; Ds = []; Ps = []
for a in range(1000, len(g) - ch - 100, ch):
    gg = np.array(g[a:a + ch + 100]); Lloc = np.log(q * gg / (2 * math.pi)); x = np.concatenate([[0.0], np.cumsum(np.diff(gg) * 0.5 * (Lloc[1:] + Lloc[:-1]) / (2 * math.pi))])
    s = np.diff(x); i = np.nonzero(s < 0.45)[0]; i = i[(i > 45) & (i < ch + 50)]
    D = 2 * (c4lib.tau_c(s[i], c4lib.env_B(x, i, 40)) <= tau).sum(); P = ch * c4lib.pred(tau, float(np.median(Lloc)), q, Bb, 'bk')
    rat.append(D / P); hts.append(float(np.median(gg))); Ds.append(D); Ps.append(P)
rat = np.array(rat); Ds = np.array(Ds); Ps = np.array(Ps)
print('chunks %d of %d zeros, tau=%g: mean ratio %.4f, std over chunks %.4f, Poisson std %.4f; total ratio %.4f' % (len(rat), ch, tau, rat.mean(), rat.std(), math.sqrt(2 / Ps.mean()), Ds.sum() / Ps.sum()))
k = max(1, len(rat) // 10)
for j in range(0, len(rat), k): print('   heights %.3g..%.3g: ratio %.4f +- %.4f' % (hts[j], hts[min(j + k, len(rat)) - 1], Ds[j:j + k].sum() / Ps[j:j + k].sum(), math.sqrt(2 / Ps[j:j + k].sum())))
