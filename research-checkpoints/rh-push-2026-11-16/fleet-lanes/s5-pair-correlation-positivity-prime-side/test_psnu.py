"""known-answer checks of psnu.py: E, D against the direct sums of w3.dirichlet_sums (X = 2e5, n = 512) for every family; DH recursion against w3.dh_logder."""
import os, sys, json, math, numpy as np
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
import psnu, w3
if __name__ == '__main__':
    X = 2e5; n = 512; nu0s = [1234.5, 1.0e7 + 0.25]
    fams = [['ZETA', [0, 1]], ['CHI4', [0]], ['CHI5R', [0]], ['LIOU', [0]], ['RSGN', [0]], ['UNI', [0]], ['EA:0.05', [0]], ['TNR:1009:2.2', [0]]]
    out = os.path.join(HERE, 'out', 'test_ps.npz')
    psnu.run(X, n, nu0s, fams, 2, out, seg=1 << 14, log=lambda s: None)
    z = np.load(out); L = math.log(X); res = {}
    N, P, K = w3.prime_powers(X); lp = np.log(P.astype(float))
    for fam, js in fams:
        for j in js:
            if fam.startswith('TNR'):
                c = lp.astype(complex)
                for (m, e) in psnu.tnr_extra(X, 1009, 2.2): c[np.searchsorted(N, m)] += e
            else: c = psnu.coeff(fam, P, K, lp).astype(complex)
            nu = nu0s[j] + 2 * math.pi / L * np.arange(n)
            E, D = w3.dirichlet_sums(dict(n=N.astype(float), c=c), nu)
            e1 = np.max(np.abs(z['E|%s|%d' % (fam, j)] - E)); d1 = np.max(np.abs(z['D|%s|%d' % (fam, j)] - D))
            res['%s|%d' % (fam, j)] = [float(e1), float(d1), float(np.max(np.abs(E)))]
            print('%-14s nu0=%-12g max|dE| %.2e  max|dD| %.2e   (max|E| %.1f)' % (fam, nu0s[j], e1, d1, np.max(np.abs(E))))
    c = psnu.dh_coeffs(20000); nn, cc = w3.dh_logder(20000)
    res['dh_recursion_max_diff'] = float(np.max(np.abs(c[nn] - cc))); print('DH recursion against w3.dh_logder (n <= 20000): max diff %.2e; c(2), c(4), c(6) = %.5f %.5f %.5f' % (res['dh_recursion_max_diff'], c[2], c[4], c[6]))
    json.dump(res, open(os.path.join(HERE, 'out', 'test_ps.json'), 'w'), indent=1)
