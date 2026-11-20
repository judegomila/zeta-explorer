"""Test 2. Local rigidity at alpha = 1.
G_alpha = F * prod_{p<=P} (1 - a0_p p^-s)/(1 - alpha_p p^-s) (a0_p the parameter of F at p; a0_p = 1 for zeta).
Completed residual r(s) = Lam_G(s) - Lam_G(1-s). At alpha = a0 (F with r = 0):
   d r / d alpha_p = Lam_F(s) * [ g_p(s) - g_p(1-s) ],   g_p(s) = 1/(p^s - a0_p).
Relative residual (divide by Lam_F(s)): J[(s), p] = g_p(s) - g_p(1-s).  The base F does not occur.
Rows: n_t heights t in (0, T], Re s in {1/2, 1/4}.  complex unknowns: sigma_min of complex J;
real unknowns: sigma_min of [Re J; Im J].  Column-normalised version = frame constant of the columns.
Non-FE bases (unimodular twist zeta(s+i a), Liouville): r0 != 0;  rows A g_p(s) - B g_p(1-s), normalised by
sqrt(|A|^2+|B|^2); reported: sigma_min and the first-order repairable fraction of r0.
"""
import sys, json, math, time
import numpy as np

def primes_upto(P):
    s = np.ones(P+1, dtype=bool); s[:2] = False
    for i in range(2, int(P**0.5)+1):
        if s[i]: s[i*i::i] = False
    return np.nonzero(s)[0]

def heights(T, n_t, seed=20261120):
    rng = np.random.default_rng(seed); return np.sort(rng.uniform(0.0, 1.0, n_t))*T

def rows(xp, t, sig, lp, a0):
    # g_p(s) - g_p(1-s), s = sig + i t;  p^s = exp(s log p)
    s = sig + 1j*t[:, None]
    return 1/(xp.exp(s*lp[None, :]) - a0[None, :]) - 1/(xp.exp((1-s)*lp[None, :]) - a0[None, :])

def gram_stats(xp, P, T, n_t, a0=None, lines=(0.5, 0.25), block=4000, AB=None):
    p = primes_upto(P); lp = xp.asarray(np.log(p.astype(np.float64)))
    a0v = xp.ones(len(p), dtype=xp.complex128) if a0 is None else xp.asarray(a0(p).astype(np.complex128))
    t = heights(T, n_t); n = len(p)
    print(f"P={P} T={T} n_t={n_t} cols={n}; planned Gram {n}x{n} complex = {n*n*16/2**30:.2f} GiB, block {block*n*16/2**30:.2f} GiB", flush=True)
    Gc = xp.zeros((n, n), dtype=xp.complex128)      # J^* J  (complex unknowns)
    Gr = xp.zeros((n, n), dtype=xp.float64)         # Re(J)^T Re(J) + Im(J)^T Im(J) (real unknowns) = Re(J^* J)
    for sig in lines:
        for b in range(0, n_t, block):
            Jb = rows(xp, xp.asarray(t[b:b+block]), sig, lp, a0v)
            Gc += Jb.conj().T @ Jb
    Gr = Gc.real.copy()
    m = n_t*len(lines)
    out = dict(P=P, T=T, n_t=n_t, cols=n, rows_complex=m)
    for tag, G in (('complex', Gc), ('real', Gr)):
        w, V = xp.linalg.eigh(G/m)
        d = xp.sqrt(xp.diag(G).real/m)
        wn = xp.linalg.eigvalsh(G/m/d[:, None]/d[None, :])
        w = np.asarray(w.get() if hasattr(w, 'get') else w); wn = np.asarray(wn.get() if hasattr(wn, 'get') else wn)
        v = V[:, 0]; v = np.asarray(v.get() if hasattr(v, 'get') else v)
        top = np.argsort(-abs(v))[:6]
        out[tag] = dict(smin=float(np.sqrt(max(w[0], 0))), smax=float(np.sqrt(w[-1])), raw_lmin=float(w[0]),
                        frame_min=float(np.sqrt(max(wn[0], 0))), frame_max=float(np.sqrt(wn[-1])),
                        top_primes=[int(p[i]) for i in top], top_coef=[complex(v[i]).real if tag == 'real' else abs(complex(v[i])) for i in top],
                        one_signed=bool(tag == 'real' and (np.all(v.real >= -1e-9) or np.all(v.real <= 1e-9))))
    out['smin_pred_Phalf'] = float(P**-0.5)
    return out, (p, t)

def direct_stats(xp, P, T, n_t, a0=None, lines=(0.5, 0.25), W=None, r0=None):
    """direct SVD (accurate small singular values). W: optional (A, B) arrays per line for a base without FE."""
    p = primes_upto(P); lp = xp.asarray(np.log(p.astype(np.float64))); n = len(p)
    a0v = xp.ones(n, dtype=xp.complex128) if a0 is None else xp.asarray(a0(p).astype(np.complex128))
    t = heights(T, n_t); m = n_t*len(lines)
    print(f"P={P} T={T} n_t={n_t} cols={n}; planned J {m}x{n} complex = {m*n*16/2**30:.2f} GiB (x4 with real copy and SVD work)", flush=True)
    J = xp.empty((m, n), dtype=xp.complex128)
    for k, sig in enumerate(lines):
        tt = xp.asarray(t); s = sig + 1j*tt[:, None]
        if W is None:
            J[k*n_t:(k+1)*n_t] = rows(xp, tt, sig, lp, a0v)
        else:
            A = xp.asarray(W[k][0])[:, None]; B = xp.asarray(W[k][1])[:, None]
            J[k*n_t:(k+1)*n_t] = (A/(xp.exp(s*lp[None, :]) - 1) - B/(xp.exp((1-s)*lp[None, :]) - 1))/xp.sqrt(abs(A)**2 + abs(B)**2)
    out = dict(P=P, T=T, n_t=n_t, cols=n, rows_complex=m, route='svd')
    for tag in ('complex', 'real'):
        M = J if tag == 'complex' else xp.vstack([J.real, J.imag])
        U, sv, Vh = xp.linalg.svd(M, full_matrices=False)
        d = xp.sqrt((abs(M)**2).sum(axis=0))
        svn = xp.linalg.svd(M/d[None, :], compute_uv=False)
        g = lambda z: np.asarray(z.get() if hasattr(z, 'get') else z)
        sv = g(sv)/math.sqrt(m); svn = g(svn); v = g(Vh[-1].conj())
        top = np.argsort(-abs(v))[:6]
        vr = v.real
        out[tag] = dict(smin=float(sv[-1]), smax=float(sv[0]), s2=float(sv[-2]), frame_min=float(svn[-1]), frame_max=float(svn[0]),
                        top_primes=[int(p[i]) for i in top], top_coef=[float(vr[i]) if tag == 'real' else float(abs(v[i])) for i in top],
                        one_signed=bool(tag == 'real' and (np.all(vr >= -1e-9) or np.all(vr <= 1e-9))))
        if tag == 'real':
            # cone of positivity-preserving directions (delta alpha_p <= 0): projected gradient upper bound for min |Mx|/|x|, x >= 0
            Mr = M; x = xp.abs(Vh[-1]); x = x/xp.linalg.norm(x); L = float(sv[0]*math.sqrt(m))**2
            for it in range(3000):
                gvec = Mr.T @ (Mr @ x); x = xp.maximum(x - gvec/L, 0); x = x/xp.linalg.norm(x)
            out['cone_ub'] = float(xp.linalg.norm(Mr @ x))/math.sqrt(m)
            out['cone_support'] = int((g(x) > 1e-8).sum())
            if r0 is not None:
                rr = xp.asarray(np.concatenate([r0.real, r0.imag]))
                sol = xp.linalg.lstsq(Mr, -rr, rcond=None)[0]
                out['r0_rms'] = float(xp.linalg.norm(rr))/math.sqrt(m); out['r0_after_first_order'] = float(xp.linalg.norm(rr + Mr @ sol))/math.sqrt(m)
        del U, Vh, M
    out['smin_pred_Phalf'] = float(P**-0.5)
    return out

def direct_svd_check(P, T, n_t):
    """known-answer / cross-check: direct SVD of the stacked matrix against the Gram route."""
    p = primes_upto(P); lp = np.log(p.astype(float)); t = heights(T, n_t); a0 = np.ones(len(p), dtype=complex)
    J = np.vstack([rows(np, t, 0.5, lp, a0), rows(np, t, 0.25, lp, a0)])
    sc = np.linalg.svd(J, compute_uv=False)/math.sqrt(2*n_t)
    sr = np.linalg.svd(np.vstack([J.real, J.imag]), compute_uv=False)/math.sqrt(2*n_t)
    return float(sc[-1]), float(sr[-1]), J

if __name__ == '__main__':
    mode = sys.argv[1]
    try:
        import os
        if os.environ.get('S6_NOGPU'): raise RuntimeError('cpu requested')
        import cupy as xp
        xp.get_default_memory_pool().set_limit(size=24*1024**3)
    except Exception:
        xp = np
    if mode == 'selftest':
        # (a) finite-difference check of the Jacobian against the exact residual of G_alpha, zeta base, mpmath 30 digits
        import mpmath as mp
        mp.mp.dps = 30
        def lam(s, al, pr):
            v = mp.pi**(-s/2)*mp.gamma(s/2)*mp.zeta(s)
            for a, q in zip(al, pr): v *= (1 - mp.mpf(q)**(-s))/(1 - a*mp.mpf(q)**(-s))
            return v
        pr = [2, 3, 5, 7]; s = mp.mpc('0.25', '17.3'); h = mp.mpf(10)**-12
        base = lam(s, [1]*4, pr)
        for k, q in enumerate(pr):
            al = [mp.mpf(1)]*4; al[k] = 1 + h
            fd = ((lam(s, al, pr) - lam(1-s, al, pr)) - (lam(s, [1]*4, pr) - lam(1-s, [1]*4, pr)))/h/base
            ex = 1/(mp.mpf(q)**s - 1) - 1/(mp.mpf(q)**(1-s) - 1)
            print('p', q, 'finite difference vs formula:', mp.nstr(abs(fd-ex), 5))
        # (b) Gram route vs direct SVD
        o, _ = gram_stats(np, 300, 1e4, 2000)
        sc, sr, J = direct_svd_check(300, 1e4, 2000)
        print('gram', o['complex']['smin'], o['real']['smin'], 'direct', sc, sr)
        # (c) known answer: on Re s = 1/2 the entries are purely imaginary: 2i Im(1/(p^s - 1))
        print('max |Re J| on the critical line:', float(np.abs(J[:2000].real).max()))
        o2 = direct_stats(np, 300, 1e4, 2000); print('direct_stats', o2['complex']['smin'], o2['real']['smin'], 'cone_ub', o2['cone_ub'], o2['real']['top_primes'])
    elif mode == 'grid':
        Ps = [int(float(x)) for x in sys.argv[2].split(',')]; Ts = [float(x) for x in sys.argv[3].split(',')]
        ntmode = sys.argv[4]      # '2000' or 'x4' (n_t = max(2000, 4 pi(P)))
        res = []
        for P in Ps:
            for T in Ts:
                n_t = 2000 if ntmode == '2000' else max(2000, 4*len(primes_upto(P)))
                t0 = time.time(); big = 2*n_t*len(primes_upto(P))*16 > 1*2**30
                o = gram_stats(xp, P, T, n_t)[0] if big else direct_stats(xp, P, T, n_t); o['secs'] = time.time()-t0; o['gpu'] = xp is not np
                res.append(o); print(json.dumps(o), flush=True)
                json.dump(res, open(f'out/jac2_grid_{ntmode}_{sys.argv[5] if len(sys.argv) > 5 else "a"}.json', 'w'), indent=1)
                if xp is not np: xp.get_default_memory_pool().free_all_blocks()
    elif mode == 'chi':
        # positive comparisons: a0_p = chi(p)
        chi4 = lambda p: np.array([0, 1, 0, -1])[p % 4]; chi5 = lambda p: np.array([0, 1, -1, -1, 1])[p % 5]
        res = []
        for name, f in (('chi_-4', chi4), ('chi_5', chi5)):
            for P, T in ((1000, 1e5), (10000, 1e5), (10000, 1e3)):
                o = direct_stats(xp, P, T, max(2000, 4*len(primes_upto(P))), a0=f); o['obj'] = name; res.append(o); print(json.dumps(o), flush=True)
        json.dump(res, open('out/jac2_chi.json', 'w'), indent=1)
    elif mode == 'twist':
        # bases without zeta's functional equation: unimodular twist zeta(s + i a) and Liouville zeta(2s)/zeta(s)
        import mpmath as mp
        mp.mp.dps = 20; P = int(float(sys.argv[2])); T = float(sys.argv[3]); n_t = int(sys.argv[4]); t = heights(T, n_t); res = []
        gam = lambda s: mp.exp(-s/2*mp.log(mp.pi) + mp.loggamma(s/2))
        def AB(F, sig):
            A = []; B = []
            for tk in t:
                s = mp.mpc(sig, tk); a = F(s); b = gam(1-s)/gam(s)*F(1-s)      # common factor gam(s) removed
                A.append(complex(a)); B.append(complex(b))
            return np.array(A), np.array(B)
        for name, F in (('zeta (check: A = B)', lambda s: mp.zeta(s)), ('unimodular twist a=1.7', lambda s: mp.zeta(s + 1.7j)), ('Liouville', lambda s: mp.zeta(2*s)/mp.zeta(s))):
            W = [AB(F, 0.5), AB(F, 0.25)]
            r0 = np.concatenate([(a - b)/np.sqrt(abs(a)**2 + abs(b)**2) for a, b in W])
            o = direct_stats(xp, P, T, n_t, W=W, r0=r0); o['obj'] = name; res.append(o); print(json.dumps(o), flush=True)
        json.dump(res, open('out/jac2_twist.json', 'w'), indent=1)
