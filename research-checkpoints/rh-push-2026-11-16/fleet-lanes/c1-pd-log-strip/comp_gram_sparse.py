# Test B: compensated Gram matrices with Gaussian tests g_j(u)=g(u-u_j), |ghat(x)|^2 = exp(-w^2 x^2).
#   Phi(D) = (phi_sigma * gamma)(D) + sum_{poles a_i>0} C_{a_i}(D),  gamma = N(0,2w^2) density,
#   C_a(D) = int (e^{a x}-1)/x * exp(-w^2 x^2) * exp(-i D x) dx.
# Claimed identity (no zeros right of sigma): Phi(D) = P(D) = sum_n c_n n^-sigma exp(-w^2 log^2 n) n^{-iD}.
# With zeros rho=beta+i gamma right of sigma: Phi(D) = P(D) + sum_rho C_{beta-sigma}(D-gamma).
import lib, numpy as np, json, math
from multiprocessing import Pool
from scipy.special import erf
w, N, d, h, PAD = 0.5, 20, 1.5, 0.05, 5.0   # sparse-node variant: better conditioned
XG = np.arange(-16, 16, 2e-3) + 1e-3
GW = np.exp(-w*w*XG*XG)
def C(a, D):
    D = np.atleast_1d(D).astype(float); out = np.zeros(len(D), complex)
    base = (np.expm1(a*XG)/XG)*GW*2e-3
    for i, x in enumerate(D):
        if abs(x) < 60: out[i] = np.sum(base*np.exp(-1j*x*XG))
    return out
def primepowers(X):
    s = np.ones(X+1, bool); s[:2] = False
    for i in range(2, int(X**0.5)+1):
        if s[i]: s[i*i::i] = False
    res = []
    for p in np.nonzero(s)[0]:
        q, k = int(p), 1
        while q <= X: res.append((q, int(p), k)); q *= int(p); k += 1
    return res
PP = primepowers(int(math.exp(12.6)))
def P(name, sigma, D):
    n = np.array([t[0] for t in PP], float); p = np.array([t[1] for t in PP]); k = np.array([t[2] for t in PP], float)
    wt = n**(-sigma)/k*np.exp(-w*w*np.log(n)**2)
    if name == 'ea': wt = wt*(n**lib.A_EA + n**(-lib.A_EA))
    if name == 'tw2': wt = np.where(p == 2, wt*(-1.0)**k, wt)
    ln = np.log(n)
    return np.array([np.sum(wt*np.exp(-1j*x*ln)) for x in np.atleast_1d(D)])
def poles(name, sigma):
    if name in ('zeta', 'tw2', 'lift'): return [1-sigma] if sigma < 1 else []
    if name == 'ea': return [a for a in (1+lib.A_EA-sigma, 1-lib.A_EA-sigma) if a > 0]
    return []
def block(pool, name, sigma, lo, hi):
    """smoothed phi on [lo,hi]: returns function D -> (phi*gamma)(D); cuts located by bisection."""
    u = np.arange(lo-PAD, hi+PAD, h) + h/2
    phi = np.array(pool.map(lib.task, [(name, sigma, float(x)) for x in u], chunksize=8))
    cuts = []
    for i in np.nonzero(np.abs(np.diff(phi.imag)) > 2.5)[0]:
        a, b, fa, fb = float(u[i]), float(u[i+1]), phi[i], phi[i+1]
        if a < 0 < b:      # pole cut(s) on the real axis: location and multiplicity are known exactly
            cuts.append((0.0, -len(poles(name, sigma)))); continue
        for _ in range(34):
            m = 0.5*(a+b); fm = lib.logF(name, sigma, m)
            if abs(fm.imag-fa.imag) > abs(fb.imag-fm.imag): b, fb = m, fm
            else: a, fa = m, fm
        cuts.append((0.5*(a+b), int(round((fb.imag-fa.imag)/(2*math.pi)))))
    for g, m in cuts: phi = phi - 1j*math.pi*m*np.sign(u-g)
    def sm(D):
        D = np.atleast_1d(D); out = np.zeros(len(D), complex)
        for i, x in enumerate(D):
            out[i] = h*np.sum(phi*np.exp(-(x-u)**2/(4*w*w)))/math.sqrt(4*math.pi*w*w)
            for g, m in cuts: out[i] += 1j*math.pi*m*erf((x-g)/(2*w))
        return out
    return sm, cuts
CASES = [('zeta',0.6,[0,1e3,1e5]),('zeta',0.75,[0,1e3,1e5]),('zeta',0.9,[0,1e3,1e5]),('zeta',1.1,[0,1e3]),
         ('tw2',0.75,[0]),('tw2',1.1,[0]),('ea',0.6,[0]),('ea',0.75,[0]),('ea',0.9,[0]),('ea',1.1,[0]),
         ('lift',0.75,[0]),('lift',0.9,[0]),('lift',1.1,[0]),
         ('dh',0.75,[0,85.6993484854]),('dh',0.9,[0,85.6993484854]),('dh',1.3,[0,85.6993484854])]
ZZ = [14.134725141734693,21.022039638771555,25.010857580145688,30.424876125859513,32.935061587739189,37.586178158825671,40.918719012147495,43.327073280914999,48.005150881167159]
import os
if os.environ.get('ONLY'): CASES = [c for c in CASES if c[0] in os.environ['ONLY'].split(',')]
OUT = os.environ.get('OUT', 'comp_gram_sparse.json')
if __name__ == '__main__':
    out = []; idx = np.subtract.outer(np.arange(N), np.arange(N)); kpos = np.arange(N)*d
    with Pool(6) as pool:
        for name, sigma, Ts in CASES:
            sm0, cuts0 = block(pool, name, sigma, -(N-1)*d, (N-1)*d)   # includes D<0 for a hermiticity check
            comp = lambda D: sum((C(a, D) for a in poles(name, sigma)), np.zeros(len(np.atleast_1d(D)), complex))
            ph = sm0(kpos) + comp(kpos); phm = sm0(-kpos) + comp(-kpos)
            herm = float(np.max(np.abs(phm-np.conj(ph))))
            Pv = P(name, sigma, kpos) if name in ('zeta','ea','tw2') else None
            zt = None
            if name == 'ea' and 0.5+lib.A_EA > sigma:      # zero terms of zeta(s-a) at Re = 1/2+a
                zt = sum(C(0.5+lib.A_EA-sigma, kpos-s*g) for g in ZZ for s in (1, -1))
            G0 = np.where(idx >= 0, ph[np.abs(idx)], np.conj(ph[np.abs(idx)]))
            for T in Ts:
                rec = dict(F=name, sigma=sigma, T=T, w=w, N=N, d=d, herm_defect=herm, cuts=[(round(g,8), m) for g, m in cuts0])
                if T == 0: G = G0
                else:
                    smT, cutsT = block(pool, name, sigma, T-(N-1)*d, T+(N-1)*d)
                    kk = T + np.arange(-(N-1), N)*d; far = smT(kk)
                    Cm = np.conj(far[(-idx)+(N-1)]); G = np.block([[G0, Cm], [Cm.conj().T, G0]])
                    rec['cutsT'] = [(round(g,8), m) for g, m in cutsT]
                    if Pv is not None: rec['identity_err_T'] = float(np.max(np.abs(far-P(name, sigma, kk))))
                ev = np.linalg.eigvalsh((G+G.conj().T)/2)
                rec.update(n=G.shape[0], diag=float(ph[0].real), min_eig=float(ev[0]), max_eig=float(ev[-1]), n_neg=int((ev < -1e-7).sum()))
                if Pv is not None:
                    rec['identity_err'] = float(np.max(np.abs(ph-Pv)))
                    if zt is not None: rec['identity_err_with_zero_terms'] = float(np.max(np.abs(ph-zt-Pv)))
                    GP = np.where(idx >= 0, Pv[np.abs(idx)], np.conj(Pv[np.abs(idx)]))
                    rec['min_eig_primesum'] = float(np.linalg.eigvalsh(GP)[0])
                out.append(rec); print(json.dumps(rec), flush=True)
    json.dump(out, open(OUT, 'w'), indent=1)
