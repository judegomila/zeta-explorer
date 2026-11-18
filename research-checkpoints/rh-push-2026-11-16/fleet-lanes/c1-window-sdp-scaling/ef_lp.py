"""Window LP for the explicit formula at bandwidth L (the linear part of the joint SDP), heights T = 1e2..1e6.
Model ("outside true"): zeros outside the window [T-Wm, T+Wm] are zeta's; inside: nonnegative measure on a grid
(sigma = 0 only: M1; sigma <= 3/8 or 1/2: M2) plus one quartet (delta, T+tq).  By the explicit formula (CLASSICAL) the
prime side at bandwidth L minus the outside zeros equals c_j = sum_{window zeros of zeta} Bhat(gamma - T - tau_j);
for a twisted prime side c_j is shifted by b_j(twist) - b_j(Lambda).  Rows: |sum mu kern_j + Q_j(delta) - c_j| <= eta + s,
|mass + 2 - N_win| <= cslack.  Minimise s; s* > 0 = infeasible; the LP dual is saved.  Column generation as in
stack-feasibility/run_cg.py.   usage: ef_lp.py T Lfactor func   (func: zeta | twist | liou | Ea)"""
import numpy as np, json, sys, time, os
from scipy.optimize import linprog
from lib import Bhat, B, prime_powers
def kern(tj, t, sig, L, m):
    if sig == 0: return Bhat(t[None, :] - tj[:, None], L, m).real
    return 2*Bhat(t[None, :] - tj[:, None] + 1j*sig, L, m).real
def zeros_window(T, W):
    from flint import arb, acb, ctx
    ctx.prec = 128
    lo = int(arb(T - W).zeta_nzeros().unique_fmpz()) if T - W > 14 else 0
    hi = int(arb(T + W).zeta_nzeros().unique_fmpz())
    return np.array([float(z.imag.mid()) for z in acb.zeta_zeros(lo+1, hi-lo)])
def prime_shift(tj, L, m, T, func):
    """b_j(func) - b_j(zeta): -2 sum (eps_n - 1) Lambda(n) n^-1/2 B(log n) cos((T+tau_j) log n)"""
    N = int(np.exp(L))
    if N < 2 or func == 'zeta': return np.zeros(len(tj)), 0
    n, lam = prime_powers(N)
    sm = np.zeros(N+1, np.int64)                       # smallest prime factor for prime powers
    for q in n:
        p = int(q); 
        for d in range(2, int(q**0.5)+1):
            if q % d == 0: p = d; break
        sm[q] = p
    k = np.rint(np.log(n)/np.log(sm[n])).astype(int)
    if func == 'liou': epsp = {int(p): -1.0 for p in set(sm[n])}
    else:
        rng = np.random.default_rng(20261117); ps = sorted(set(int(p) for p in sm[n])); sg = rng.choice([-1.0, 1.0], size=len(ps)); sg[0] = -1.0
        epsp = dict(zip(ps, sg))
    eps = np.array([epsp[int(p)]**kk for p, kk in zip(sm[n], k)])
    ln = np.log(n); w = (eps - 1)*lam/np.sqrt(n)*B(ln, L, m)
    return -2*(np.cos((T + tj)[:, None]*ln[None, :]) @ w), int((eps < 0).sum())
def run(T, fac, func, Wt=5.0, Wm=35.0, eta=1e-5, cslack=7.0, m=3, dg=0.004, outdir='out'):
    Ls = 0.5*np.log(T/(2*np.pi)); L = fac*Ls; a = L/(2*m)
    zt = zeros_window(T, Wm) - T; Nwin = len(zt)
    zi = np.where(np.abs(zt[:-1]) < 4)[0]; i = zi[np.argmin(np.diff(zt)[zi])]; j = zi[np.argmax(np.diff(zt)[zi])]
    tqs = {'pair': float((zt[i]+zt[i+1])/2), 'gap': float((zt[j]+zt[j+1])/2)}
    tj = np.arange(-Wt, Wt+1e-9, min(np.pi/(2*L), 1.0)); J = len(tj)
    if func == 'Ea':            # E_a = zeta(s+a) zeta(s-a), a = 0.2: every window zero is a pair at sigma = +-0.2 (true configuration)
        c = 2*Bhat(zt[None, :] - tj[:, None] + 0.2j, L, m).real.sum(1); nneg = 0; Nwin2 = 2*Nwin
    else:
        sh, nneg = prime_shift(tj, L, m, T, func); c = Bhat(zt[None, :] - tj[:, None], L, m).real.sum(1) + sh; Nwin2 = Nwin
    tf = np.arange(-Wm, Wm+1e-9, dg)
    out = dict(T=T, fac=fac, L=L, Lstar=Ls, N=float(np.exp(L)), func=func, J=J, Nwin=Nwin, tqs=tqs, gaps=[float(zt[i+1]-zt[i]), float(zt[j+1]-zt[j])],
               eta=eta, cslack=cslack, Wm=Wm, twisted_terms=nneg, rows=[], tj=tj.tolist(), c=c.tolist())
    print(f'## T={T:g} fac={fac} L={L:.3f} N={np.exp(L):.1f} func={func} J={J} Nwin={Nwin} pos={tqs}', flush=True)
    for name, smax in (('M1', 0.0), ('M2_3/8', 0.375), ('M2_1/2', 0.5)):
        sigs = [0.0] if smax == 0 else list(np.linspace(0, smax, 21))
        print(f'  planned allocation KF: {J} x {len(tf)*len(sigs)} float64 = {J*len(tf)*len(sigs)*8/1e9:.3f} GB', flush=True)
        KF = np.hstack([kern(tj, tf, s, L, m) for s in sigs]); massF = np.concatenate([np.full(len(tf), 1.0 if s == 0 else 2.0) for s in sigs])
        active = np.zeros(KF.shape[1], bool); active[::5] = True
        def solve(delta, tq):
            Q = np.zeros(J) if delta is None else 2*Bhat(tq - tj + 1j*delta, L, m).real; qm = 0.0 if delta is None else 2.0
            for rnd in range(60):
                idx = np.nonzero(active)[0]; A = KF[:, idx]; n = len(idx)
                Aub = np.vstack([np.hstack([A, -np.ones((J, 1))]), np.hstack([-A, -np.ones((J, 1))]),
                                 np.hstack([massF[idx][None, :], [[0.0]]]), np.hstack([-massF[idx][None, :], [[0.0]]])])
                bub = np.concatenate([c + eta - Q, -(c - eta - Q), [Nwin2 + cslack - qm], [-(Nwin2 - cslack - qm)]])
                cc = np.zeros(n+1); cc[-1] = 1
                r = linprog(cc, A_ub=Aub, b_ub=bub, bounds=[(0, None)]*(n+1), method='highs')
                if r.status != 0: raise RuntimeError(r.status)
                s = r.x[-1]
                if s <= 1e-9:
                    w = r.x[:-1]; nz = np.nonzero(w > 1e-12)[0]
                    return 0.0, dict(atoms=[[float(np.tile(tf, len(sigs))[idx[q]]), float(np.repeat(sigs, len(tf))[idx[q]]), float(w[q])] for q in nz])
                mu = -r.ineqlin.marginals; u, v, cp, cm = mu[:J], mu[J:2*J], mu[2*J], mu[2*J+1]
                G = (u-v) @ KF + (cp-cm)*massF
                if G.min() >= -s/(20*(Nwin2+cslack)):
                    return s, dict(u=u.tolist(), v=v.tolist(), cp=float(cp), cm=float(cm), Gq=float((u-v)@Q + (cp-cm)*qm), Gmin_fine=float(G.min()),
                                   bound=float(u@(c+eta) - v@(c-eta) + cp*(Nwin2+cslack) - cm*(Nwin2-cslack)), s=float(s), mass_bound=Nwin2+cslack)
                neg = np.nonzero(G < 0)[0]; neg = neg[np.argsort(G[neg])][:1500]; active[neg] = True
            raise RuntimeError('column generation did not converge')
        tic = time.time(); row = dict(model=name)
        try:
            s0, _ = solve(None, 0.0); row['base_s'] = s0
            for nm, tq in tqs.items():
                hi = 0.5 if smax == 0 else smax; lo = 0.0
                s, cert = solve(hi, tq)
                if s == 0: row[nm] = None; row[nm+'_feas'] = dict(delta=hi, **cert)
                else:
                    chi = cert; flo = None
                    for _ in range(10):
                        mid = (lo+hi)/2; s, cert = solve(mid, tq)
                        if s > 0: hi, chi = mid, cert
                        else: lo = mid; flo = dict(delta=mid, **cert)
                    row[nm] = hi; chi['delta'] = hi; chi['tq'] = tq; row[nm+'_cert'] = chi; row[nm+'_feas'] = flo
                if func == 'Ea' and nm == 'pair':
                    k0 = int(np.argmin(np.abs(zt))); row['true_pos'] = float(zt[k0]); row['scan_true_pos'] = {}
                    for dl in (0.05, 0.1, 0.15, 0.19, 0.2, 0.21, 0.25, 0.3, 0.4):
                        if dl <= (0.5 if smax == 0 else smax): row['scan_true_pos'][str(dl)] = solve(dl, float(zt[k0]))[0]
                    print('   Ea scan at a true ordinate (s* per delta):', row['scan_true_pos'], flush=True)
                print(f'  {name} {nm}: delta* = {row[nm]}  base_s={s0:.2e}  {time.time()-tic:.0f}s atoms={active.sum()}', flush=True)
        except RuntimeError as e:
            row['error'] = str(e); print('  ', name, 'ERROR', e, flush=True)
        out['rows'].append(row)
    os.makedirs(outdir, exist_ok=True)
    json.dump(out, open(f'{outdir}/lp_{func}_{T:g}_{fac:g}.json', 'w'), default=float)
    return out
if __name__ == '__main__':
    run(float(sys.argv[1]), float(sys.argv[2]), sys.argv[3])
