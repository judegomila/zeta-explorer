#!/usr/bin/env python3
"""quartic_analyse2.py data.npz -- class-e quartic Kubota sums over Q(i), e = 0,1,2,3, and the Moebius-twisted family.

  K_e(h, D, t) = sum_n alpha(n) conj(gamma_1(n)) chi_n(h)^e N(n)^{it} V(N n / D)     (class e, index h^e)
  TEST(h,D,t)  = sum_n mu(n) gamma_1(n) conj(chi_n(h)) N(n)^{it} V(N n / D)           (Poisson dual of the Moebius family)
n squarefree primary, prime to 2h.  Lemma Q3: |TEST| relates to class 3 by a periodic twist (checked below).
F = <|sum|^2> / sum V^2, averaged over t in T and over the primes h of the same norm.
"""
import sys, math
import numpy as np
d = np.load(sys.argv[1])
norms, gam, mus, als, exps = d['norms'], d['gam'], d['mus'], d['als'], d['exps']
hnorm = d['hnorm']; X = norms.max()
I4 = np.array([1, 1j, -1, -1j])
T = np.linspace(-1.0, 1.0, 9)
Ds = np.exp(np.linspace(math.log(4), math.log(X / 5.0), 14 * 4 + 1))
V = lambda x: x * np.exp(-x * x)
logn = np.log(norms)
uniq = sorted(set(int(x) for x in hnorm if x <= 61))
names = ['e=0', 'e=1', 'e=2', 'e=3', 'TEST']
avg = {u: np.zeros((5, len(Ds))) for u in uniq}
# Lemma Q3 check: mu gamma_1 conj(chi_n(h)) = alpha gamma_2 chi_n(-1) * conj(gamma_1) chi_n(h)^3 with gamma_2 chi_n(-1) of modulus 1
for u in uniq:
    ks = [k for k, x in enumerate(hnorm) if int(x) == u]
    for k in ks:
        ok = exps[:, k] >= 0
        chi = I4[exps[ok, k]]; nn = norms[ok]; ln = logn[ok]
        base = als[ok] * np.conj(gam[ok])
        fam = [base, base * chi, base * chi ** 2, base * chi ** 3, mus[ok] * gam[ok] * np.conj(chi)]
        if k == ks[0]:
            ratio = fam[4] / fam[3]
            assert np.abs(np.abs(ratio) - 1).max() < 1e-9 and np.abs(ratio ** 2 - 1).max() < 1e-9, 'Q3'
        for i, D in enumerate(Ds):
            w = V(nn / D); den = (w * w).sum()
            ph = np.exp(1j * np.outer(T, ln)) * w            # (T, n)
            for j in range(5):
                avg[u][j, i] += (np.abs(ph @ fam[j]) ** 2).mean() / den / len(ks)
print('Lemma Q3 on the data: TEST/class-3 is a sign (+-1) for every n: checked')
print('X = %d, n = %d; F averaged over t in [-1,1] (9 values) and conjugate h' % (X, len(norms)))
def oct_mean(F):   # means over consecutive octave-like blocks of 4 grid points
    return [F[i:i + 4].mean() for i in range(0, len(Ds) - 1, 4)]
edges = [Ds[i] for i in range(0, len(Ds), 4)]
for u in uniq:
    print('\nN(h) = %d   block means of F over D in [D_lo, D_hi)' % u)
    print('   D_lo    ' + ' '.join('%7.0f' % e for e in edges[:-1]))
    for j in range(5):
        print('   %-6s  ' % names[j] + ' '.join('%7.3f' % v for v in oct_mean(avg[u][j])))
print('\nSummary: last three blocks (largest D) mean of F')
print('  N(h)   ' + ' '.join('%8s' % n for n in names) + '    D range')
for u in uniq:
    print('  %-6d ' % u + ' '.join('%8.4f' % np.mean(oct_mean(avg[u][j])[-3:]) for j in range(5)) + '    [%.0f, %.0f]' % (edges[-4], edges[-1]))
np.savez('analysis_' + sys.argv[1].replace('.npz', '') + '.npz', Ds=Ds, **{'N%d' % u: avg[u] for u in uniq})
