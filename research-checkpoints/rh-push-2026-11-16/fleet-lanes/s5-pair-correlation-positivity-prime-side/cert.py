"""s5 combination 1: band-limited proportion certificate from the prime side.

Input: E(nu_a), D(nu_a) of psnu.py.  Matrix (m23 certificate; formulas of w3.py, s3 lane): box window on [-L/2, L/2], L = log X,
  G = W/L^2,  W = POLE + ARCH - PRIME  (prime sum over n <= X only),  zero side: G = sum_rho u_rho u_rho^T, u_rho(a) = sinc(pi(y_rho - a)).
Bandwidth lam = L / log(N (t/2pi)^d) (the family's own density).  For an object with the functional equation the multiset of ordinates is
closed under conjugation; an on-line zero contributes a rank-one positive block of trace 1, an off-line pair a block of signature (1,1) and trace 2
(|a|^2 - |b|^2 = 1), and the rank-trace lemma (m23 doc 01) gives, on the infinite grid,
      #(distinct on-line zeros) >= 2 tr G - tr G^2,     certified proportion  c = 2 - tr G^2 / tr G.
Sine-kernel value of R = tr G^2/tr G:  1/lam + lam/3 (lam <= 1),  1 + 1/(3 lam^2) (lam >= 1);  without off-diagonal prime correlations
(form factor |alpha| continued past 1): 1/lam + lam/3 for every lam.
Windows of nw consecutive nodes (finite sections; edge effects O(log nw / nw)).
Usage: cert.py OUT.json nw PS.npz [PS.npz ...]   (zero-side comparison for ZETA when a list covers the window: S5_LISTS=1)
"""
import sys, os, math, json, time
import numpy as np
import w3
PI = math.pi

def fam_meta(fam):
    if fam in ('ZETA', 'LIOU', 'RSGN', 'UNI'): return dict(mu=[0.0], logN=0.0, poles=[0.5], fe=(fam == 'ZETA'))
    if fam == 'CHI4': return dict(mu=[1.0], logN=math.log(4), poles=[], fe=True)
    if fam == 'CHI5R': return dict(mu=[0.0], logN=math.log(5), poles=[], fe=True)
    if fam == 'DH': return dict(mu=[1.0], logN=math.log(5), poles=[], fe=True)
    if fam.startswith('EA:'):
        a = float(fam[3:]); return dict(mu=[a, -a], logN=0.0, poles=[0.5 + a, 0.5 - a], fe=True)
    if fam.startswith('TNR'):
        q = int(fam.split(':')[1]); return dict(mu=[0.0], logN=2 * math.log(q), poles=[0.5], fe=True)
    raise ValueError(fam)

def true_fraction(fam, T):
    """fraction of zeros (with multiplicity) on the line near height T, where known"""
    if fam in ('ZETA', 'CHI4', 'CHI5R'): return 1.0, 'all zeros on the line at this height (verified height / GRH range)'
    if fam.startswith('EA'): return 0.0, 'every zero at distance a from the line'
    if fam.startswith('TNR'):
        q = int(fam.split(':')[1]); l = math.log(T / (2 * PI)); return l / (l + 2 * math.log(q)), 'zeta zeros on the line; local-factor pairs at density 2 log q / 2 pi'
    if fam == 'DH': return 0.90, 'measured by the s1 lane: 0.9023 below 7e4, 0.8940 below 1e6'
    return None, 'no functional equation: the matrix is not a sum over zeros'

def gue_R(lam): return 1 / lam + lam / 3 if lam <= 1 else 1 + 1 / (3 * lam * lam)

def build(meta, nu, E, D, L, nu0):
    fam = dict(mu=meta['mu'], logN=meta['logN'])
    J, Jdiag, Om = w3.arch_terms(fam, nu, L, nu0)
    v = (L / (2 * PI)) * J + (L / PI) * E.imag
    diag = Jdiag - 2 * (L * E.real - D.real)
    n = len(nu); idx = np.arange(n)
    dd = idx[:, None] - idx[None, :]; np.place(dd, dd == 0, 1)
    G = (v[:, None] - v[None, :]) / dd
    sg = 1.0 - 2.0 * (idx % 2); G *= sg[:, None]; G *= sg[None, :]
    for b in meta['poles']:
        F = 2 * np.sin((1j * b - nu) * L / 2) / (1j * b - nu)
        G += 2 * (F[:, None] * F[None, :]).real; diag = diag + 2 * (F * F).real
    G[idx, idx] = diag
    return G / L ** 2, Om

def zero_side(y, n):
    U = np.sinc(y[:, None] - np.arange(n)[None, :])
    return U.T @ U

def analyse(fn, nw, lists_ok, log=print):
    z = np.load(fn); X = float(z['X']); L = float(z['L']); n = int(z['n']); nu0s = z['nu0s']; fams = json.loads(str(z['fams']))
    rows = []
    for fam, js in fams:
        meta = fam_meta(fam)
        for j in js:
            nu0 = float(nu0s[j]); nu = nu0 + 2 * PI / L * np.arange(n)
            E = z['E|%s|%d' % (fam, j)]; D = z['D|%s|%d' % (fam, j)]
            wins = []
            for a0 in range(0, n - nw + 1, nw):
                sl = slice(a0, a0 + nw)
                G, Om = build(meta, nu[sl], E[sl], D[sl], L, nu0)
                tr = float(np.trace(G)); fro = float(np.sum(G * G)); ev = np.linalg.eigvalsh(G)
                tol = 1e-10 * nw
                dens = float(np.mean(Om))               # log of (analytic conductor): zeros per unit height = dens / 2 pi
                wins.append(dict(a0=a0, tr=tr, fro2=fro, R=fro / tr, c=2 - fro / tr, lam=L / dens, ev_min=float(ev[0]), ev_max=float(ev[-1]),
                                 n_neg=int((ev < -tol).sum()), n_above_half=int((ev > 0.5).sum()), zeros_smooth=nw * dens / L))
                del G
            R = np.array([w['R'] for w in wins]); lam = float(np.mean([w['lam'] for w in wins])); T = nu0 + 0.5 * n * 2 * PI / L
            tf, why = true_fraction(fam, T)
            row = dict(file=os.path.basename(fn), family=fam, X=X, L=L, nu0=nu0, T_mid=T, n=n, nw=nw, nwin=len(wins), lam=lam,
                       tr_per_node=float(np.mean([w['tr'] for w in wins]) / nw), one_over_lam=1 / lam,
                       R=float(R.mean()), R_se=float(R.std(ddof=1) / math.sqrt(len(R))) if len(R) > 1 else None, c=float(2 - R.mean()),
                       R_sine=gue_R(lam), c_sine=2 - gue_R(lam), R_no_offdiag=1 / lam + lam / 3,
                       n_neg_total=int(sum(w['n_neg'] for w in wins)), ev_min=float(min(w['ev_min'] for w in wins)), ev_max=float(max(w['ev_max'] for w in wins)),
                       true_fraction=tf, true_note=why, has_fe=meta['fe'], windows=wins)
            if lists_ok and fam == 'ZETA':
                try:
                    import lists
                    for nm in ('Z0', 'Z7', 'Z8', 'Z9', 'Z10', 'Z11', 'Z12'):
                        kind, path, key, tm = lists.SPECS[nm]
                        lst = None
                        if nm == 'Z0':
                            if nu0 < 1.0e6: lst = lists.load(nm)
                        else:
                            T0 = float(np.load(path)['T0'])
                            if T0 <= nu0 < T0 * 1.05: lst = lists.load(nm)
                        if lst is None: continue
                        t = lst['t0'] + lst['d']; mg = 6000 * 2 * PI / L
                        if t[0] > nu0 - mg or t[-1] < nu[nw - 1] + mg: continue
                        i0, i1 = np.searchsorted(t, [nu0 - mg, nu[nw - 1] + mg])
                        y = (lst['d'][i0:i1] - (nu0 - lst['t0'])) * L / (2 * PI)
                        Gz = zero_side(y, nw); Gp, _ = build(meta, nu[:nw], E[:nw], D[:nw], L, nu0)
                        row['zero_side'] = dict(list=nm, zeros_used=int(i1 - i0), max_entry_diff=float(np.max(np.abs(Gz - Gp))), tr_zero=float(np.trace(Gz)), tr_prime=float(np.trace(Gp)),
                                                fro2_zero=float(np.sum(Gz * Gz)), fro2_prime=float(np.sum(Gp * Gp)), zeros_in_window=int(((y >= 0) & (y < nw)).sum()))
                        break
                except Exception as e:
                    row['zero_side_error'] = repr(e)
            rows.append(row)
            log('%-16s X=%.3g T=%.4g lam=%.3f  R=%.4f +- %s  c=%.4f  (sine %.4f, no off-diagonal %.4f)  n_neg=%d ev_min=%.3g  true=%s %s' % (
                fam, X, T, lam, row['R'], ('%.4f' % row['R_se']) if row['R_se'] is not None else '-', row['c'], row['c_sine'], 2 - row['R_no_offdiag'], row['n_neg_total'], row['ev_min'], tf,
                ('zero side: ' + json.dumps(row['zero_side'])) if 'zero_side' in row else ''))
    return rows

if __name__ == '__main__':
    out = sys.argv[1]; nw = int(sys.argv[2]); res = []
    print('planned allocation: G %d x %d float64 = %.2f GB (x4 with temporaries)' % (nw, nw, nw * nw * 8 / 1e9), flush=True)
    for fn in sys.argv[3:]:
        res += analyse(fn, nw, os.environ.get('S5_LISTS') == '1', log=lambda s: print(s, flush=True))
        json.dump(res, open(out, 'w'), indent=1)
