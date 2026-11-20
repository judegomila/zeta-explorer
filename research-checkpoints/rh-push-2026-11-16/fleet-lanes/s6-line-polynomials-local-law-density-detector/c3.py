"""Combination 3: prefix certificates with coefficient sequences altered beyond the prefix.
A  P13 triangle certificate (t = 1607/10000, y0^2 = 87677/2500000, primes <= 13): T(N), margin T - E, and the share of the
   absolute sum carried by n = G j with j not 13-smooth.            c3.py A OUT OBJ[:MOLL] N[,N..]
B  P97 prefix (t = 26399999/2e8, y = sqrt(7/25 - 2t)): on the physical orbit, J points per window,
   P_100 = E (D_100(s_B) + g D_100(s_A)),  T_smooth / T_rough = the same for 100 < n <= N split by 97-smoothness, E = prod_{p<=97} (1 - a(p) b_p p^-s_B).
                                                                     c3.py B OUT OBJ[:MOLL] N[,N..] [J] [t]
C  minimum of Re P_100 over the torus of the 25 prime phases (search; zeta coefficients).   c3.py C OUT N [starts]
MOLL: zeta (a(p) = 1 in E; default), own (a(p) of the object), none, dh96."""
import sys, json, math, time, numpy as np
import lp, tri, orbit
T13 = 1607 / 10000; T97 = 26399999 / 2e8
P97 = [int(p) for p in lp.primes_upto(97)]; P13 = [2, 3, 5, 7, 11, 13]

def rough_mask(N, primes):
    m = np.arange(1, N + 1)
    for p in primes:
        while True:
            d = (m % p == 0)
            if not d.any(): break
            m = np.where(d, m // p, m)
    return (m > 1)

def partA(obj, moll, N):
    a = lp.coefs(obj, N); t = T13; y = tri.Y0
    ap = [1.0] * 6 if moll == 'zeta' else [a[p] for p in P13]
    lam = {1: 1.0} if moll == 'none' else orbit.euler_dict(P13, ap, t)
    D = 1 if moll == 'none' else 30030
    T = tri.Tri(a, D, N); jw = tri.xp.asarray(rough_mask(N, P13).astype(np.float64))
    v, p = T.value(N, t, y, lam, parts=True, jw=jw)
    E = tri.err_budget(N, t, y)
    return dict(part='A', obj=obj, moll=moll, N=N, T=v, E=E, margin=v - E, S=p['S'], S_rough=p['S_jw'], share_rough=p['S_jw'] / p['S'], g=p['g'], sigma=p['sigma'], M=p['M'], corr=p['corr'])

def partB(obj, moll, N, J, t, seed=3):
    a = lp.coefs(obj, N); y = math.sqrt(7 / 25 - 2 * T97)
    xN, L, sigma, K, g = tri.consts(N, t, y)
    n = np.arange(1, N + 1, dtype=np.float64); ln = np.log(n); heat = np.exp((t / 4) * ln * ln)
    wB = a[1:] * heat * np.exp(-sigma * ln); wA = np.conj(a[1:]) * heat * np.exp((y - sigma) * ln)
    rough = rough_mask(N, P97); pre = (n <= 100)
    masks = np.stack([pre, (~pre) & (~rough), (~pre) & rough], axis=1).astype(np.float64)
    fr = (np.arange(J) + np.random.default_rng(seed).uniform(0, 1)) / J
    B, A = orbit.sums(N, t, fr, wB[:, None] * masks, wA[:, None] * masks)
    if moll == 'none': E = np.ones(J, dtype=complex)
    elif moll == 'dh96':
        d = json.load(open('dh_lam_690988_t0.json')); E = orbit.moll_values(N, t, fr, {int(k): float(v) for k, v in d.items()}, sigma)
    else:
        ap = [1.0] * 25 if moll == 'zeta' else [a[p] for p in P97]
        E = orbit.euler_values(N, t, fr, P97, ap, sigma)
    parts = E[:, None] * (B + g * A)
    P = parts[:, 0]; Ts = parts[:, 1]; Tr = parts[:, 2]; full = P + Ts + Tr; Tt = Ts + Tr
    i = int(np.argmin(full.real)); k = int(np.argmin(np.abs(full)))
    return dict(part='B', obj=obj, moll=moll, N=N, J=J, t=t, y=y, sigma=sigma, g=g, minRe_P100=float(P.real.min()), max_absT=float(np.abs(Tt).max()), rms_Tsmooth=float(np.sqrt(np.mean(np.abs(Ts) ** 2))),
                rms_Trough=float(np.sqrt(np.mean(np.abs(Tr) ** 2))), max_Trough=float(np.abs(Tr).max()), minRe_full=float(full.real.min()), min_abs_full=float(np.abs(full).min()),
                at_min=dict(f=float(fr[i]), P100=float(P[i].real), Tsmooth=float(Ts[i].real), Trough=float(Tr[i].real)), absE=[float(np.abs(E).min()), float(np.abs(E).max())],
                min_abs_F=float(np.abs(full / E).min()), share_rough_at_min=float(Tr[i].real / full[i].real) if full[i].real != 0 else None)

def partC(N, starts, lam=0.0):
    from scipy.optimize import minimize
    t = (26399999 + lam) / 2e8; y = math.sqrt(7 / 25 - 2 * t)
    xN, L, sigma, K, g = tri.consts(N, t, y)
    V = np.zeros((100, 25))
    for n in range(1, 101):
        m = n
        for i, p in enumerate(P97):
            while m % p == 0: V[n - 1, i] += 1; m //= p
    nn = np.arange(1, 101.0); ln = np.log(nn); heat = np.exp((t / 4) * ln * ln)
    wB = heat * nn ** -sigma; wA = heat * nn ** (y - sigma)
    cp_ = np.array([tri.bt(p, t) * p ** -sigma for p in P97])
    def f(phi):
        z = np.exp(-1j * (V @ phi)); E = np.prod(1 - cp_ * np.exp(-1j * phi))
        return float((E * (wB @ z + g * (wA @ np.conj(z)))).real)
    rng = np.random.default_rng(5); best = (9.0, None); vals = []
    for s in range(starts):
        r = minimize(f, rng.uniform(0, 2 * math.pi, 25), method='L-BFGS-B', options=dict(maxiter=400))
        vals.append(r.fun)
        if r.fun < best[0]: best = (r.fun, r.x)
    tri_lb = None
    return dict(part='C', N=N, lam=lam, t=t, y=y, sigma=sigma, g=g, torus_min_Re_P100=best[0], phases=[float(v % (2 * math.pi)) for v in best[1]], starts=starts,
                n_within_1e6_of_min=int(np.sum(np.array(vals) < best[0] + 1e-6)), source_bound=0.26842844879751026)

if __name__ == '__main__':
    part, out = sys.argv[1], sys.argv[2]
    if part == 'C':
        rs = [partC(int(float(sys.argv[3])), int(sys.argv[4]) if len(sys.argv) > 4 else 200, lam=float(sys.argv[5]) if len(sys.argv) > 5 else 0.0)]
    else:
        spec = sys.argv[3].split(':'); obj = spec[0]; moll = spec[1] if len(spec) > 1 else 'zeta'
        Ns = [int(float(v)) for v in sys.argv[4].split(',')]
        rs = []
        for N in Ns:
            t0 = time.time()
            if part == 'A': r = partA(obj, moll, N)
            else: r = partB(obj, moll, N, int(sys.argv[5]) if len(sys.argv) > 5 else 1000, float(sys.argv[6]) if len(sys.argv) > 6 else T97)
            r['sec'] = time.time() - t0; rs.append(r)
            print(json.dumps(r), flush=True); open(out, 'a').write(json.dumps(r) + '\n')
    if part == 'C':
        for r in rs: print(json.dumps(r), flush=True); open(out, 'a').write(json.dumps(r) + '\n')
