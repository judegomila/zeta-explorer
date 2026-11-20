"""Test 3. Multiplicative Gram matrices of dilates.
A_N(sigma)[i,j] = <D_i F, D_j F>/<F,F>, F = sum a(n) n^-sigma e_n in l^2, D_i e_n = e_{in}.
With g=gcd(i,j), i'=i/g, j'=j/g:  A[i,j] = (i'j')^-sigma * sum_k a(k i') conj a(k j') k^(-2 sigma) / Z.
 multiplicative a:  A[i,j] = U(i') conj U(j'),  U multiplicative (local normalised correlations)
 q-periodic a (real): A[i,j] = (i'j')^-sigma * T[i' mod q, j' mod q],
     T[x,y] = sum_r a(rx)a(ry) H_r / sum_r a(r)^2 H_r,  H_r = sum_{k = r mod q} k^(-2 sigma)
     (sigma = 1/2: limit sigma -> 1/2+, H_r equal for all r; the normaliser is the pole coefficient).
Modes:
  dense  : full symmetric eigensolve (cupy if present, else numpy), float64, + residual check of the
           extreme pairs in extended precision.
  sparse : zeta-type objects only (|a(p)| = 1 completely multiplicative on an index set closed under
           divisors): A = C^T C, C = diag(sqrt J(d)) [d|i] diag(i^-sigma), J = mu * id^(2 sigma);
           lambda_max by eigsh on C^T C, lambda_min = 1/lambda_max(C^-1 C^-T) with the Moebius inverse.
"""
import sys, json, math, time
import numpy as np

XI = (math.sqrt(10 - 2*math.sqrt(5)) - 2)/(math.sqrt(5) - 1)
DH_A = np.array([0.0, 1.0, XI, -XI, -1.0])
CHI5 = np.array([0.0, 1.0, -1.0, -1.0, 1.0])
CHI4 = np.array([0.0, 1.0, 0.0, -1.0])

def hurwitz_r(q, sigma):
    import mpmath as mp
    if abs(sigma - 0.5) < 1e-15:
        return np.array([1.0]*q)          # limit normalisation: equal weights (incl. r = 0)
    return np.array([float(mp.zeta(2*sigma, mp.mpf(r if r else q)/q)/mp.mpf(q)**(2*sigma)) for r in range(q)])

def periodic_table(a, sigma):
    q = len(a); H = hurwitz_r(q, sigma)
    T = np.zeros((q, q)); Z = sum(a[r]**2*H[r] for r in range(q))
    for x in range(q):
        for y in range(q):
            T[x, y] = sum(a[(r*x) % q]*a[(r*y) % q]*H[r] for r in range(q))/Z
    return T

def spf_sieve(N):
    spf = np.arange(N+1, dtype=np.int64)
    for p in range(2, int(N**0.5)+1):
        if spf[p] == p:
            v = spf[p*p::p]; v[v == np.arange(p*p, N+1, p)] = p
    return spf

def U_mult(N, local):
    """U(n) for multiplicative U given local(p, v) -> U(p^v)."""
    spf = spf_sieve(N); U = np.ones(N+1); cache = {}
    for n in range(2, N+1):
        p = int(spf[n]); m = n; v = 0
        while m % p == 0: m //= p; v += 1
        key = (p, v)
        if key not in cache: cache[key] = local(p, v)
        U[n] = U[m]*cache[key]
    return U

def local_Ea(a, sigma, E=4000):
    def f(p, v):
        lp = math.log(p)
        # s_e = sum_{j=0}^e p^{a(2j-e)};  weights p^{-sigma(2e+v)}
        num = 0.0; den = 0.0
        for e in range(E):
            w = math.exp(-2*sigma*e*lp)
            if w < 1e-18 and e > 5: break
            se = sum(math.exp(a*(2*j-e)*lp) for j in range(e+1))
            sev = sum(math.exp(a*(2*j-e-v)*lp) for j in range(e+v+1))
            num += sev*se*w; den += se*se*w
        return math.exp(-sigma*v*lp)*num/den
    return f

def objects(N, sigma):
    """returns dict name -> ('U', Uarray) or ('T', q, table)."""
    n = np.arange(N+1, dtype=np.float64); n[0] = 1
    o = {}
    o['zeta'] = ('T', 1, np.ones((1, 1)))
    o['chi_-4'] = ('T', 4, np.outer(CHI4, CHI4))
    o['chi_5'] = ('T', 5, np.outer(CHI5, CHI5))
    o['DH'] = ('T', 5, periodic_table(DH_A, sigma))
    o['E_a(0.02)'] = ('U', U_mult(N, local_Ea(0.02, sigma)))
    o['E_a(0.2)'] = ('U', U_mult(N, local_Ea(0.2, sigma)))
    # completely multiplicative comparison with |f(p)| = |a_DH(p)| (1 for p = +-1 mod 5, XI for p = +-2 mod 5, 0 at 5)
    o['DHabs'] = ('U', U_mult(N, lambda p, v: (abs(DH_A[p % 5])*p**(-sigma))**v))
    # same sizes with signs: f(p) = a_DH(p)
    o['DHsgn'] = ('U', U_mult(N, lambda p, v: (DH_A[p % 5]*p**(-sigma))**v))
    return o

def build_dense(xp, N, sigma, spec, idx=None, block=2000):
    if idx is None: idx = np.arange(1, N+1)
    I = xp.asarray(idx, dtype=xp.int64); n = len(idx)
    print(f"planned allocation: {n}x{n} float64 = {n*n*8/2**30:.2f} GiB (x3 with eigensolver work)", flush=True)
    A = xp.empty((n, n), dtype=xp.float64)
    if spec[0] == 'U': U = xp.asarray(spec[1])
    else: q = spec[1]; T = xp.asarray(spec[2])
    for b in range(0, n, block):
        Ib = I[b:b+block, None]; g = xp.gcd(Ib, I[None, :])
        ip = Ib//g; jp = I[None, :]//g
        if spec[0] == 'U':
            A[b:b+block] = U[ip]*U[jp]
        else:
            A[b:b+block] = (ip*jp).astype(xp.float64)**(-sigma)*T[ip % q, jp % q]
    return A

def dense_run(N, sigma, names, lac=True, want_vec=False):
    try:
        import os
        if os.environ.get('S6_NOGPU'): raise RuntimeError('cpu requested')
        import cupy as xp
        xp.get_default_memory_pool().set_limit(size=24*1024**3); gpu = True
    except Exception:
        xp = np; gpu = False
    objs = objects(N, sigma); out = {}
    for name in names:
        spec = objs[name]; t0 = time.time()
        A = build_dense(xp, N, sigma, spec)
        A = (A + A.T)/2
        w, V = xp.linalg.eigh(A)
        w = xp.asnumpy(w) if gpu else w
        res = {}
        for tag, k in (('min', 0), ('max', -1)):
            v = V[:, k]; r = A @ v - float(w[k])*v
            res[tag] = float(xp.linalg.norm(r))
        vmin = xp.asnumpy(V[:, 0]) if gpu else V[:, 0]
        out[name] = dict(N=N, sigma=sigma, lam_min=float(w[0]), lam_max=float(w[-1]), lam_2=float(w[1]),
                         resid_min=res['min'], resid_max=res['max'], n_neg=int((w < -1e-10).sum()),
                         top_idx_min=[int(i)+1 for i in np.argsort(-abs(vmin))[:8]], gpu=gpu, secs=time.time()-t0)
        if lac:
            ks = [4**k for k in range(0, 40) if 4**k <= N]
            if len(ks) >= 2:
                Al = build_dense(np, N, sigma, (spec[0],) + tuple(np.asarray(x) if not isinstance(x, int) else x for x in spec[1:]), idx=np.array(ks))
                wl = np.linalg.eigvalsh(Al)
                out[name]['lac4_n'] = len(ks); out[name]['lac4_min'] = float(wl[0]); out[name]['lac4_max'] = float(wl[-1])
        print(json.dumps({name: out[name]}), flush=True)
        del A, V
        if gpu: xp.get_default_memory_pool().free_all_blocks()
    return out

def sparse_run(N, sigma, q=1):
    """zeta-type on the index set {n <= N, (n,q)=1}."""
    import scipy.sparse as sp
    from scipy.sparse.linalg import eigsh, LinearOperator
    t0 = time.time()
    spf = spf_sieve(N)
    idx = np.array([n for n in range(1, N+1) if math.gcd(n, q) == 1], dtype=np.int64) if q > 1 else np.arange(1, N+1, dtype=np.int64)
    pos = -np.ones(N+1, dtype=np.int64); pos[idx] = np.arange(len(idx))
    # J(n) = n^{2 sigma} prod_{p|n}(1 - p^{-2 sigma}); mu(n)
    J = np.ones(N+1); mu = np.ones(N+1, dtype=np.int8)
    for n in range(2, N+1):
        p = int(spf[n]); m = n//p
        if m % p == 0: mu[n] = 0; J[n] = J[m]*p**(2*sigma)
        else: mu[n] = -mu[m]; J[n] = J[m]*(p**(2*sigma) - 1)
    rows = []; cols = []; mv = []
    for d in idx:
        mult = np.arange(d, N+1, d); ok = pos[mult] >= 0; mult = mult[ok]
        rows.append(np.full(len(mult), pos[d])); cols.append(pos[mult]); mv.append(mu[mult//d])
    rows = np.concatenate(rows); cols = np.concatenate(cols); mv = np.concatenate(mv).astype(np.float64)
    n = len(idx); nnz = len(rows)
    print(f"sparse: n={n} nnz={nnz} planned ~{nnz*40/2**30:.2f} GiB", flush=True)
    sj = np.sqrt(J[idx]); isig = idx.astype(np.float64)**(-sigma)
    B = sp.csr_matrix((np.ones(nnz), (rows, cols)), shape=(n, n))      # B[d,i] = [d|i]
    C = sp.diags(sj) @ B @ sp.diags(isig)
    nzm = mv != 0
    Mi = sp.csr_matrix((mv[nzm], (rows[nzm], cols[nzm])), shape=(n, n))  # Mi[i,d] = mu(d/i)[i|d] = B^-1
    Cinv = sp.diags(1/isig) @ Mi @ sp.diags(1/sj)
    Ct = C.T.tocsr(); Cit = Cinv.T.tocsr()
    lmax = eigsh(LinearOperator((n, n), matvec=lambda x: Ct @ (C @ x)), k=1, which='LA', tol=1e-10, return_eigenvectors=False)[0]
    w, v = eigsh(LinearOperator((n, n), matvec=lambda x: Cinv @ (Cit @ x)), k=1, which='LA', tol=1e-10)
    lmin = 1/w[0]; v = v[:, 0]
    # check: A v = lmin v with A = C^T C
    r = Ct @ (C @ v) - lmin*v
    top = [int(idx[i]) for i in np.argsort(-abs(v))[:8]]
    out = dict(N=N, sigma=sigma, q=q, n=n, lam_min=float(lmin), lam_max=float(lmax), resid_min=float(np.linalg.norm(r)),
               top_idx_min=top, secs=time.time()-t0)
    print(json.dumps(out), flush=True)
    return out

if __name__ == '__main__':
    mode = sys.argv[1]
    if mode == 'selftest':
        N = 300; sigma = 0.75
        o = objects(N, sigma)
        A = build_dense(np, N, sigma, o['zeta'])
        # known answer 1: brute force Gram of dilates with truncated l^2 sums for chi_5 and DH at sigma=0.75
        import mpmath as mp
        def brute(a, i, j, K=200000):
            g = math.gcd(i, j); ip = i//g; jp = j//g; q = len(a)
            k = np.arange(1, K+1); s = np.sum(a[(k*ip) % q]*a[(k*jp) % q]*k**(-2*sigma)); z = np.sum(a[k % q]**2*k**(-2*sigma))
            return (ip*jp)**(-sigma)*s/z
        Ad = build_dense(np, N, sigma, o['DH'])
        errs = [abs(Ad[i-1, j-1] - brute(DH_A, i, j)) for (i, j) in [(1, 2), (6, 4), (15, 35), (7, 49), (12, 18), (2, 3)]]
        print('DH table vs brute (tail error ~ K^-0.5 = 2e-3):', max(errs))
        # known answer 2: E_a U against brute force sums, at sigma = 1.5 where the sums converge fast
        a_ = 0.2; sg2 = 1.5
        def coef(n): return sum(d**(2*a_) for d in range(1, n+1) if n % d == 0)*n**(-a_)
        K = 3000; cf = np.array([0]+[coef(n) for n in range(1, 10*K+1)])
        def bruteE(ip, jp):
            k = np.arange(1, K+1); return (ip*jp)**(-sg2)*np.sum(cf[k*ip]*cf[k*jp]*k**(-2*sg2))/np.sum(cf[k]**2*k**(-2*sg2))
        Ue = U_mult(60, local_Ea(a_, sg2))
        print('E_a U(i\')U(j\') vs brute at sigma=1.5: max abs diff', max(abs(float(Ue[x]*Ue[y]) - float(bruteE(x, y))) for (x, y) in [(2, 1), (4, 3), (9, 2), (5, 7), (8, 1)]))
        # known answer 3: sigma=1 zeta: lambda_max -> zeta(1)... use classical: A = C^T C identity check dense vs sparse
        d = np.linalg.eigvalsh(A)
        idx5 = np.array([n for n in range(1, N+1) if n % 5]); A5 = build_dense(np, N, sigma, o['chi_5']); d5 = np.linalg.eigvalsh(A5[np.ix_(idx5-1, idx5-1)]); dfull = np.linalg.eigvalsh(A5)
        try:
            s = sparse_run(N, sigma); s5 = sparse_run(N, sigma, q=5)
            print('dense vs sparse zeta:', d[0], s['lam_min'], d[-1], s['lam_max'])
            print('chi_5 coprime block dense vs sparse:', d5[0], s5['lam_min'], d5[-1], s5['lam_max'], ' full-matrix min/max', dfull[0], dfull[-1])
        except ImportError:
            print('scipy missing: sparse check skipped here (run on the server). dense zeta', d[0], d[-1], 'chi_5 block', d5[0], d5[-1], 'full', dfull[0], dfull[-1])
        # unimodular and sign twist: exact diagonal conjugation
        n = np.arange(1, N+1); alpha = 3.7; Dg = np.exp(-1j*alpha*np.log(n))
        I, Jm = np.meshgrid(n, n, indexing='ij'); g = np.gcd(I, Jm)
        Atw = ((I//g)*(Jm//g))**(-sigma)*np.exp(-1j*alpha*(np.log(I//g) - np.log(Jm//g)))
        print('unimodular twist: max |A_tw - D A D^*| =', np.abs(Atw - Dg[:, None]*A*np.conj(Dg)[None, :]).max())
        # Kac-Murdock-Szego: lacunary {4^k} known range ((1-r)/(1+r), (1+r)/(1-r)), r = 4^-sigma
        r = 4**(-sigma); print('lacunary bounds', (1-r)/(1+r), (1+r)/(1-r))
        dense_run(N, sigma, ['zeta', 'DH'])
    elif mode == 'dense':
        N = int(float(sys.argv[2])); sig = float(sys.argv[3]); names = sys.argv[4].split(',')
        out = dense_run(N, sig, names)
        json.dump(out, open(f"out/gram3_dense_{N}_{sig}_{'-'.join(x.replace('(','').replace(')','') for x in names)}.json", 'w'), indent=1)
    elif mode == 'sparse':
        sig = float(sys.argv[3]); q = int(sys.argv[4]) if len(sys.argv) > 4 else 1
        res = [sparse_run(int(float(x)), sig, q) for x in sys.argv[2].split(',')]
        json.dump(res, open(f"out/gram3_sparse_{sig}_q{q}.json", 'w'), indent=1)
