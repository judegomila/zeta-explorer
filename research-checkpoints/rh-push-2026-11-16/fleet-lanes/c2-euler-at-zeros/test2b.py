"""Check of the finite prime correction in the S-periodised formula when Tw > log(2 N_S):
   correction = 2 (-1)^{|S|+1} Re sum_{n>=2; m,m' in N_S; N m m' n <= e^Tw} Lambda(n) (N m/(m' n))^{1/2} C_w(-log(N m m' n)),
   C_w(-x) = int w(t) conj w(t+x) dt."""
import numpy as np, math, json
from lib import *
import test2 as t2
def Cw_neg(x, T, Tw, npts=200001):
    if x >= Tw: return 0.0
    t = np.linspace(0, Tw - x, npts); b = lambda u: np.sin(math.pi * u / Tw) ** 6
    f = b(t) * b(t + x)
    return np.trapezoid(f, t) * np.exp(-1j * T * x)
out = []
for S, Tw, T in [([2], 2.5, 3000.0), ([2, 3], 4.0, 3000.0), ([3], 3.2, 5000.0)]:
    r = t2.run(S, Tw, T)
    N = int(np.prod(S)); X = math.exp(Tw); sm = smooth_numbers(S, int(X)); corr = 0.0; nterms = 0
    lam = {}
    for p in primes_upto(int(X) + 1):
        pk = int(p)
        while pk <= X: lam[pk] = math.log(p); pk *= int(p)
    for m in sm:
        for mp_ in sm:
            for n, l in lam.items():
                x = math.log(N * int(m) * int(mp_) * n)
                if x < Tw:
                    corr += 2 * (-1) ** (len(S) + 1) * (l * math.sqrt(N * int(m) / (int(mp_) * n)) * Cw_neg(x, T, Tw)).real; nterms += 1
    r['prime_correction'] = corr; r['nterms'] = nterms; r['diff_after'] = r['diff'] - corr
    print('   prime correction (%d terms) %.12g   diff before %.3e  after %.3e (rel %.1e)' % (nterms, corr, r['diff'], r['diff_after'], r['diff_after'] / r['zero_side']), flush=True)
    out.append(r)
json.dump(out, open('test2b.json', 'w'), indent=1)
