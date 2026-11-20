"""Combination 4: modulated box functional
  Psi_alpha(L) = arch_alpha(L) + pole_alpha(L) - sum_{n<e^L} c(n) n^{-1/2} (L - log n) cos(alpha log n)
              = sum over zeros of (1 - cos((gamma - alpha) L))/(gamma - alpha)^2          (>= 0 for every alpha, L iff all zeros on the line)
on a grid of alpha and L, from the cell moments of the prime measure written by sweep.c / dh2.c
(M_k(cell) = sum over atoms in the cell of w (u - u_c)^k, u = log n; Taylor expansion of e^{i alpha u} inside each cell).
usage: python c4.py <sweep prefix> <N> <out.json> [dh prefix] [Ndh]"""
import sys, os, json, math, numpy as np, mpmath as mp
import lib
DELTA = 0.005; NCELL = 5600; KM = 13
FACT = np.array([math.factorial(k) for k in range(KM)], float)
UC = (np.arange(NCELL) + 0.5)*DELTA

def load_mom(fn, nobj):
    import os
    raw = np.fromfile(fn, dtype=(np.float64 if os.path.getsize(fn) == nobj*NCELL*KM*8 else np.longdouble))
    return raw.reshape(nobj, NCELL, KM).astype(np.float64)

def atoms_to_mom(ns, ws):
    M = np.zeros((NCELL, KM)); u = np.log(np.asarray(ns, float)); c = (u/DELTA).astype(int); t = u - (c + 0.5)*DELTA
    x = np.asarray(ws, float).copy()
    for k in range(KM):
        np.add.at(M[:, k], c, x); x = x*t
    return M

def F_sum(M, z, Lidx):
    """sum_{u < L} w (L - u) e^{i z u} for complex z (array), L = cell boundaries Lidx*DELTA; returns (len(z), len(Lidx)) complex"""
    out = np.empty((len(z), len(Lidx)), complex); ncell = int(max(Lidx)); Mc = M[:ncell]; uc = UC[:ncell]
    M1 = np.zeros_like(Mc); M1[:, :-1] = Mc[:, 1:]            # M_{k+1}
    B0 = M1 + uc[:, None]*Mc                                  # moments of w u (u - u_c)^k   (k <= KM-2 exact)
    for s in range(0, len(z), 500):
        zz = z[s:s+500]; iz = 1j*zz
        pw = np.ones((len(zz), KM), complex)
        for k in range(1, KM): pw[:, k] = pw[:, k-1]*iz/k
        pA = pw @ Mc.T; pB = pw[:, :KM-1] @ B0[:, :KM-1].T
        E = np.exp(1j*zz[:, None]*uc[None, :])
        cA = np.cumsum(E*pA, axis=1); cB = np.cumsum(E*pB, axis=1)
        L = np.asarray(Lidx)*DELTA
        out[s:s+500] = L[None, :]*cA[:, np.asarray(Lidx) - 1] - cB[:, np.asarray(Lidx) - 1]
    return out

_tg = {}
def trigamma_c(c2, alphas):
    key = (float(c2), len(alphas), float(alphas[-1]))
    if key not in _tg:
        mp.mp.dps = 20
        _tg[key] = np.array([complex(mp.zeta(2, (mp.mpf(c2) - 1j*mp.mpf(float(a)))/2)) for a in alphas])
    return _tg[key]
def arch_alpha(c2list, logN, alphas, L):
    """(L/2)[log N - d log pi + sum_j Re psi(c_j + i alpha/2)] + sum_j sum_k Re[(1 - e^{-z_k L})/z_k^2], z_k = 2k + 2c_j - i alpha; shape (alpha, L)"""
    from scipy.special import digamma
    L = np.asarray(L, float); al = np.asarray(alphas, float)
    v = np.zeros((len(al), len(L)))
    lin = logN - len(c2list)*math.log(math.pi)
    for c2 in c2list:
        lin = lin + digamma(c2/2 + 0.5j*al).real
        tot = trigamma_c(c2, al).real/4                        # sum_k Re 1/z_k^2
        v += tot[:, None]
        K = int(45/(2*L.min())) + 2
        for k in range(K):
            z = 2*k + c2 - 1j*al
            v -= (np.exp(-z[:, None]*L[None, :])/(z**2)[:, None]).real
    v += (L[None, :]/2)*np.asarray(lin)[:, None]
    return v
def pole_alpha(kappas, alphas, L):
    al = np.asarray(alphas, float); L = np.asarray(L, float); v = np.zeros((len(al), len(L)))
    for kap in kappas:
        for z0 in (1j*kap, -1j*kap):
            z = z0 - al
            v += ((1 - np.cos(z[:, None]*L[None, :]))/(z**2)[:, None]).real
    return v

def summarize(name, psi, alphas, L, extra=None):
    mn = psi.min(0); mx = psi.max(0); E = np.abs(psi).max(0)
    rec = dict(obj=name, L=list(map(float, L)), min=mn.tolist(), argmin=alphas[psi.argmin(0)].tolist(), max=mx.tolist(), argmax=alphas[psi.argmax(0)].tolist())
    neg = np.nonzero(mn < -1e-6)[0]
    rec['first_L_negative'] = float(L[neg[0]]) if len(neg) else None
    rec['alpha_at_first_negative'] = float(alphas[psi[:, neg[0]].argmin()]) if len(neg) else None
    # lowest modulation frequency with a negative value, per L (None if no negative value on the grid)
    isneg = psi < -1e-6; anyneg = isneg.any(0); amin = np.where(anyneg, alphas[isneg.argmax(0)], np.nan)
    rec['alpha_min_negative'] = [None if not a == a else float(a) for a in amin]
    rec['E'] = E.tolist()
    fits = {}
    for a, b in ((3, 6), (6, 10), (10, 15), (15, 20), (20, 24), (24, 27.6)):
        m = (L >= a) & (L <= b) & (E > 0)
        if m.sum() >= 3: fits['%g-%g' % (a, b)] = float(2*np.polyfit(L[m], np.log(E[m]), 1)[0])
    rec['p_fit'] = fits
    if extra: rec.update(extra)
    return rec

if __name__ == '__main__':
    pref = sys.argv[1]; N = int(float(sys.argv[2])); out = sys.argv[3]
    dhp = sys.argv[4] if len(sys.argv) > 4 else None; Ndh = int(float(sys.argv[5])) if len(sys.argv) > 5 else 0
    amax = float(os.environ.get('C4_AMAX', '100')); na = int(os.environ.get('C4_NA', '100000'))
    alphas = np.linspace(0, amax, na, endpoint=False) + amax/na/2      # avoid alpha = 0 exactly
    Lmax = math.log(N); Lidx = np.arange(100, int(Lmax/DELTA) + 1, 20); L = Lidx*DELTA
    mom = load_mom(pref + '.mom.bin', 3)                      # primes only: zeta, chi_-4, chi_5
    pp = lib.prime_powers(N, kmin=2); ns = np.array([q for q, p, k in pp], float)
    def ppmom(amp): return atoms_to_mom(ns, [amp(p, k)*math.log(p)/p**(k/2.0) for q, p, k in pp])
    res = []
    def run(name, M, c2list, logN, kappas, zshift=None, add=None):
        if zshift is None: S = F_sum(M, alphas.astype(complex), Lidx).real
        else: S = (F_sum(M, alphas + 1j*zshift, Lidx) + F_sum(M, alphas - 1j*zshift, Lidx)).real
        psi = arch_alpha(c2list, logN, alphas, L) + pole_alpha(kappas, alphas, L) - S
        if add is not None: psi = psi + add
        rec = summarize(name, psi, alphas, L); res.append(rec)
        print(name, 'first L negative', rec['first_L_negative'], 'alpha', rec['alpha_at_first_negative'], 'p_fit', {k: round(v, 3) for k, v in rec['p_fit'].items()}, flush=True)
        return psi
    Mz = mom[0] + ppmom(lambda p, k: 1.0)
    psi_z = run('zeta', Mz, [0.5], 0.0, [0.5])
    # profile of zeta at the largest L for the record (coarse)
    np.save(out.replace('.json', '_zeta_profile.npy'), psi_z[::20, ::10].astype(np.float32))
    run('L_chi-4', mom[1] + ppmom(lambda p, k: float(lib.chi4(p))**k), [1.5], math.log(4), [])
    run('L_chi5', mom[2] + ppmom(lambda p, k: float(lib.chi5(p))**k), [0.5], math.log(5), [])
    run('liouville(zeta bridge)', -mom[0] + ppmom(lambda p, k: (-1.0)**k), [0.5], 0.0, [0.5])
    for a in (0.05, 0.10, 0.25):
        run('Ea%.2f' % a, Mz, [0.5 + a, 0.5 - a], 0.0, [0.5 - a, 0.5 + a], zshift=a)
    for q0, c in ((3, 2.2), (3, 2.01), (2, 2.2), (101, 2.2)):
        for own in (True, False):
            add = np.zeros((len(alphas), len(L)))
            k = 1
            while k*math.log(q0) < Lmax:
                ex = lib.tnr_extra(q0, c, k); u = k*math.log(q0)
                add -= ex*np.maximum(L[None, :] - u, 0)*np.cos(alphas[:, None]*u); k += 1
            if own: add += L[None, :]*math.log(q0)
            rec = summarize('TNR%d_%g_%s' % (q0, c, 'own' if own else 'zb'), psi_z + add, alphas, L,
                            extra=dict(delta_off=math.acosh(c/2)/math.log(q0), gamma_off=math.pi/math.log(q0), log_q0=math.log(q0)))
            res.append(rec); print(rec['obj'], 'first L negative', rec['first_L_negative'], 'p_fit', {k2: round(v, 3) for k2, v in rec['p_fit'].items()}, flush=True)
    # unimodular twist cos(3 log n) Lambda(n), zeta's bridge: prime side = (1/2)[F(alpha+3) + F(alpha-3)]
    S = 0.5*(F_sum(Mz, (alphas + 3.0).astype(complex), Lidx) + F_sum(Mz, (alphas - 3.0).astype(complex), Lidx)).real
    psi = arch_alpha([0.5], 0.0, alphas, L) + pole_alpha([0.5], alphas, L) - S
    res.append(summarize('unimod3(zeta bridge)', psi, alphas, L)); print('unimod3', res[-1]['first_L_negative'], res[-1]['p_fit'], flush=True)
    if dhp:
        Md = load_mom(dhp + '.mom.bin', 1)[0]
        Ld = Lidx[Lidx*DELTA <= math.log(Ndh)]
        S = F_sum(Md, alphas.astype(complex), Ld).real
        psi = arch_alpha([1.5], math.log(5), alphas, Ld*DELTA) - S
        res.append(summarize('DH', psi, alphas, Ld*DELTA)); print('DH', res[-1]['first_L_negative'], res[-1]['alpha_at_first_negative'], res[-1]['p_fit'], flush=True)
        np.save(out.replace('.json', '_dh_profile.npy'), psi[::5, ::10].astype(np.float32))
    json.dump(dict(N=N, alpha_max=amax, n_alpha=na, results=res), open(out, 'w'))
