"""known-answer check of cert.py: prime side (psnu.py, X = 4e4) against the zero side built from the list of zeta zeros (window at 2e4 .. )"""
import os, sys, json, math, numpy as np
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
import psnu, cert, lists
if __name__ == '__main__':
    out = os.path.join(HERE, 'out', 'test_cert_ps.npz'); res = {}
    for X, nu0 in ((3183.0, 20000.0), (4.0e4, 20000.0), (1.0e6, 20000.0)):
        n = 1024; L = math.log(X)
        psnu.run(X, n, [nu0], [['ZETA', [0]], ['LIOU', [0]], ['RSGN', [0]], ['EA:0.05', [0]], ['TNR:1009:2.2', [0]]], 2, out, seg=1 << 14, log=lambda s: None)
        rows = cert.analyse(out, 1024, False, log=lambda s: None)
        lst = lists.load('ZS'); t = lst['d']; nu = nu0 + 2 * math.pi / L * np.arange(n)
        mg = 8000 * 2 * math.pi / L
        m = (t > nu0 - mg) & (t < nu[-1] + mg); y = (t[m] - nu0) * L / (2 * math.pi)
        Gz = cert.zero_side(y, n)
        z = np.load(out); Gp, _ = cert.build(cert.fam_meta('ZETA'), nu, z['E|ZETA|0'], z['D|ZETA|0'], L, nu0)
        r0 = rows[0]
        print('X=%.4g lam=%.3f: zeta prime side vs zero side (%d zeros): max entry diff %.2e; tr %.4f / %.4f; fro2 %.4f / %.4f;  R=%.4f (sine %.4f)' % (
            X, r0['lam'], m.sum(), np.max(np.abs(Gz - Gp)), np.trace(Gp), np.trace(Gz), np.sum(Gp * Gp), np.sum(Gz * Gz), r0['R'], r0['R_sine']))
        # EA: zero side with complex ordinates gamma -+ i a
        a = 0.05; yc = np.concatenate([y - 1j * a * L / (2 * math.pi), y + 1j * a * L / (2 * math.pi)])
        U = np.sinc(yc[:, None] - np.arange(n)[None, :]); Ge = (U.T @ U).real
        Gpe, _ = cert.build(cert.fam_meta('EA:0.05'), nu, z['E|EA:0.05|0'], z['D|EA:0.05|0'], L, nu0)
        print('     EA a=0.05: max entry diff %.2e; fro2 %.3f / %.3f' % (np.max(np.abs(Ge - Gpe)), np.sum(Gpe * Gpe), np.sum(Ge * Ge)))
        for r in rows: print('     %-14s lam=%.3f R=%.4f c=%.4f n_neg=%d ev_min=%.3g true=%s' % (r['family'], r['lam'], r['R'], r['c'], r['n_neg_total'], r['ev_min'], r['true_fraction']))
        res['X%g' % X] = dict(max_entry_diff=float(np.max(np.abs(Gz - Gp))), ea_diff=float(np.max(np.abs(Ge - Gpe))), rows=[{k: v for k, v in r.items() if k != 'windows'} for r in rows])
    json.dump(res, open(os.path.join(HERE, 'out', 'test_cert.json'), 'w'), indent=1)
