# c1_local_nb.py : local Nyman-Beurling distance with a sech window (combination 1).
#   d_N^2(T0,H) = min_c  sum_k w_k |1 - F(1/2+i t_k) sum_{n<=N} c_n n^{-i t_k}|^2,
#   t_k = T0 + off + u_k, u_k = -9H..9H step h, w_k = sech(pi u_k/H) h/(2H)   (sum_k w_k = 1/2).
# Reported value: rel = d_N^2 / sum_k w_k (1 at c = 0).
# Method: incremental orthonormal basis Q of the columns (two-pass block Gram-Schmidt + QR/SVD, directions with
# singular value < tolQ * column norm dropped), small Hermitian problem S = C C^H on the basis coordinates,
# Tikhonov ladder  min ||e - A c||^2 + mu nu^2 ||c||^2  (nu = common column norm).  float64: a screen.
# usage: c1_local_nb.py <T0> <out.json> <Nmax> <names,comma> <windows: H:off,H:off,...> [h]
import sys, json, math, time, numpy as np
import objs
xp = np      # linear algebra on CPU (many small factorisations; the shared GPU is slower for these); GPU only evaluates F
LAD = [1, 2, 3, 5, 10, 20, 50, 100, 200, 400, 1000, 2000, 5000, 10000, 20000]
MUS = [1e-2, 1e-4, 1e-6, 1e-8, 1e-10]

def solve_window(F, uu, H, h, Nmax, tolQ=1e-9, keep_coef=False):
    K = len(uu); w = (1/np.cosh(np.pi*uu/H))*h/(2*H); sk = np.sqrt(w)
    W0 = float(w.sum()); nu2 = float((w*np.abs(F)**2).sum()); nu = math.sqrt(nu2)
    meanF = complex((w*F).sum()/W0)
    rcap = int(min(K, 1.4*18*H*math.log(max(Nmax, 3))/(2*math.pi) + 400))
    print(f'  window K={K} rcap={rcap}; planned Q {16*K*rcap/1e9:.2f} GB, C {16*rcap*Nmax/1e9:.2f} GB, S {16*rcap*rcap/1e9:.2f} GB', flush=True)
    base = xp.asarray(sk*F); ug = xp.asarray(uu); e = xp.asarray(sk.astype(np.complex128))
    Q = xp.zeros((K, rcap), dtype=xp.complex128); C = xp.zeros((rcap, Nmax), dtype=xp.complex128)
    S = xp.zeros((rcap, rcap), dtype=xp.complex128); r = 0
    lad = [n for n in LAD if n <= Nmax]; rows = []; n0 = 1
    cuts = sorted(set(lad + list(range(256, Nmax+1, 256)) + [Nmax]))
    for n1 in cuts:                      # columns n0..n1
        ns = np.arange(n0, n1+1); logs = xp.asarray(np.log(ns.astype(np.float64)))
        B = base[:, None]*xp.exp(-1j*ug[:, None]*logs[None, :])
        cols = slice(n0-1, n1)
        if r > 0:
            C1 = Q[:, :r].conj().T @ B; B = B - Q[:, :r] @ C1
            C2 = Q[:, :r].conj().T @ B; B = B - Q[:, :r] @ C2
            C[:r, cols] = C1 + C2
        if r < rcap:
            Qb, R = xp.linalg.qr(B)
            Ur, Sv, Vh = xp.linalg.svd(R, full_matrices=False)
            keep = Sv > tolQ*nu; kk = int(keep.sum()); kk = min(kk, rcap-r)
            if kk > 0:
                Qn = Qb @ Ur[:, :kk]; Cn = Sv[:kk, None]*Vh[:kk, :]
                if r > 0:                 # re-orthogonalise the new directions against the basis (they come from a small residual)
                    for _ in range(2): Qn = Qn - Q[:, :r] @ (Q[:, :r].conj().T @ Qn)
                    Qn, Rn = xp.linalg.qr(Qn); Cn = Rn @ Cn
                Q[:, r:r+kk] = Qn; C[r:r+kk, cols] = Cn; r += kk
        S[:r, :r] += C[:r, cols] @ C[:r, cols].conj().T
        n0 = n1+1
        if n1 in lad:
            orth = float(xp.abs(Q[:, :r].conj().T @ Q[:, :r] - xp.eye(r)).max())
            g = Q[:, :r].conj().T @ e; eperp2 = max(W0 - float((xp.abs(g)**2).sum().real), 0.0)
            lam, V = xp.linalg.eigh(S[:r, :r]); lam = xp.maximum(lam.real, 0); p = xp.abs(V.conj().T @ g)**2
            row = {'N': n1, 'rank': r, 'orth': orth, 'eperp_rel': eperp2/W0, 'lam_max_rel': float(lam.max())/nu2, 'rel': {}, 'cnorm2': {}}
            for mu in MUS:
                d2 = eperp2 + float((p*mu*nu2/(lam+mu*nu2)).sum()); cn = float((p*lam/(lam+mu*nu2)**2).sum())
                row['rel']['%g' % mu] = d2/W0; row['cnorm2']['%g' % mu] = cn
            rows.append(row)
    return {'K': K, 'W0': W0, 'mean_absF2': nu2/W0, 'meanF': [meanF.real, meanF.imag], 'rank_final': r, 'rcap': rcap, 'rows': rows}

if __name__ == '__main__':
    T0 = float(sys.argv[1]); outp = sys.argv[2]; Nmax = int(sys.argv[3]); names = sys.argv[4].split(',')
    wins = [(float(a.split(':')[0]), float(a.split(':')[1])) for a in sys.argv[5].split(',')]
    h = float(sys.argv[6]) if len(sys.argv) > 6 else 0.05
    Umax = max(9*H + abs(off) for H, off in wins) + 4.0
    nU = int(round(Umax/h)); u = np.arange(-nU, nU+1)*h
    print(f'T0={T0} grid {len(u)} points h={h} GPU={objs.GPU} workers={objs.WORKERS}', flush=True)
    t0 = time.time()
    import os
    npz = os.environ.get('C1_NPZ')
    if npz:                                   # values precomputed on the server by c1_eval.py
        dz = np.load(npz); u = dz['u']; assert abs(float(dz['T0'])-T0) < 1e-9 and abs(float(dz['h'])-h) < 1e-12 and u.max() >= Umax-4.0-1e-9
        vals = {nm: dz[nm] for nm in names}
    else:
        vals = objs.eval_objects(T0, u, names, h=h)
    print(f'values done {time.time()-t0:.0f}s', flush=True)
    out = {'T0': T0, 'h': h, 'Nmax': Nmax, 'tolQ': 1e-9, 'mus': MUS, 'gpu': objs.GPU, 'cases': []}
    for nm in names:
        v = vals[nm]; m = 0
        if isinstance(v, tuple): v, m = v[0], v[1]
        elif np.isnan(v).any(): m = int(np.isnan(v).sum()//2); v = v[m:len(u)-m]
        uv = u[m:len(u)-m]
        for H, off in wins:
            idx = np.where(np.abs(uv-off) <= 9*H+1e-9)[0]
            t1 = time.time(); res = solve_window(v[idx], uv[idx]-off, H, h, Nmax)
            res.update({'obj': nm, 'H': H, 'off': off, 'center': T0+off, 'sec': time.time()-t1})
            out['cases'].append(res)
            print(nm, 'H', H, 'centre', T0+off, 'rank', res['rank_final'], ' '.join('%d:%.4f' % (r['N'], r['rel']['1e-08']) for r in res['rows']), f'{time.time()-t1:.0f}s', flush=True)
            json.dump(out, open(outp, 'w'))
    print('ALLDONE', f'{time.time()-t0:.0f}s')
