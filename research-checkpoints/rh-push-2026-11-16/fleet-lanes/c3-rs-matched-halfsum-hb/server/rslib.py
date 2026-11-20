"""c3-rs-matched-halfsum-hb: Riemann-Siegel half-sums F_N(s) = sum_{n<=N} a_n n^-s at matched height.
float64 screen (numpy, or cupy when RS_GPU=1). Base phases T0*log n mod 2pi come from arb, so only
u*log n (u = t - T0 <= 1e4) is formed in float64. Planned allocations are printed."""
import numpy as np, math, os, sys, json, time
GPU = os.environ.get('RS_GPU', '0') == '1'
xp = np
if GPU:
    try:
        import cupy as cp
        cp.get_default_memory_pool().set_limit(size=int(float(os.environ.get('RS_POOL_GB', '24')) * 1024 ** 3))
        xp = cp
    except Exception as e:
        print('cupy unavailable, numpy fallback:', e, flush=True); GPU = False
BUDGET = float(os.environ.get('RS_CHUNK_GB', '1.0')) * 1024 ** 3
KAPPA = (math.sqrt(10 - 2 * math.sqrt(5)) - 2) / (math.sqrt(5) - 1)
TWO_PI = 2 * math.pi
def asnp(a): return cp.asnumpy(a) if GPU and not isinstance(a, np.ndarray) else np.asarray(a)

def base_phases(T0, nmax):
    """(T0 * log n) mod 2pi, n = 1..nmax, T0 an exact integer; arb at 192 bits."""
    from flint import arb, ctx
    ctx.prec = 192
    T0 = int(T0); tp = 2 * arb.pi(); out = np.empty(nmax)
    for n in range(1, nmax + 1):
        x = arb(n).log() * T0; k = (x / tp).floor(); out[n - 1] = float((x - k * tp).mid())
    return out

def coeffs(kind, nmax, seed=1):
    n = np.arange(1, nmax + 1)
    if kind in ('zeta', 'transl'): return np.ones(nmax, complex), 1
    if kind == 'dh': return np.array([0.0, 1.0, KAPPA, -KAPPA, -1.0])[n % 5].astype(complex), 5
    if kind == 'chi5': return np.array([0, 1, 1j, -1j, -1])[n % 5].astype(complex), 5
    if kind == 'rand': return np.random.default_rng(seed).choice([-1.0, 1.0], nmax).astype(complex), 1
    if kind == 'per3': return np.array([1.0, 1.0, -1.0])[n % 3].astype(complex), 1   # non-multiplicative, period 3, no FE
    raise ValueError(kind)

class Fam:
    """c_n = a_n w_n n^(-1/2) e^(-i T0 log n) (plus translate phase); F(1/2+ds + i(T0+u)) = sum c_n n^-ds e^(-i u log n)."""
    def __init__(self, kind, T0, nmax, w=None, alpha_mult=0):
        self.kind, self.T0, self.nmax = kind, int(T0), nmax
        a, self.q = coeffs(kind, nmax)
        n = np.arange(1, nmax + 1, dtype=float)
        ph = base_phases(self.T0 * (1 + alpha_mult), nmax)      # translate: phases at T0*(1+alpha_mult), length and theta from T0
        c = a * n ** -0.5 * np.exp(-1j * ph)
        if w is not None: c = c * w
        self.ln = xp.asarray(np.log(n)); self.c = xp.asarray(c)
    def line(self, N, u, dsig):
        """F, G (M x K) on the lines ds in dsig; dF/ds = -G."""
        ln, c = self.ln[:N], self.c[:N]; u = np.asarray(u, float); M = u.size; K = len(dsig)
        W = xp.stack([c * xp.exp(-d * ln) for d in dsig], axis=1); WL = W * ln[:, None]
        F = np.empty((M, K), complex); G = np.empty((M, K), complex)
        mc = max(1, int(BUDGET / (16 * 3 * N)))
        for i in range(0, M, mc):
            E = xp.exp(-1j * xp.outer(xp.asarray(u[i:i + mc]), ln))
            F[i:i + mc] = asnp(E @ W); G[i:i + mc] = asnp(E @ WL); del E
        return F, G
    def point(self, N, ds, u):
        ln, c = self.ln[:N], self.c[:N]; ds = np.asarray(ds, float); u = np.asarray(u, float); M = u.size
        F = np.empty(M, complex); G = np.empty(M, complex); cl = c * ln
        mc = max(1, int(BUDGET / (16 * 3 * N)))
        for i in range(0, M, mc):
            E = xp.exp(-xp.outer(xp.asarray(ds[i:i + mc] + 1j * u[i:i + mc]), ln))
            F[i:i + mc] = asnp(E @ c); G[i:i + mc] = asnp(E @ cl); del E
        return F, G

def wrap(d): return (d + np.pi) % TWO_PI - np.pi

def refined_darg(tau, vals, fn, thr=1.0, maxit=60):
    """Total continuous change of arg along a path sampled at tau (sorted) with values vals; subdivide while a step exceeds thr.
    Returns (delta_arg, n_unresolved)."""
    tau = np.asarray(tau, float).copy(); vals = np.asarray(vals).copy()
    for it in range(maxit):
        d = wrap(np.diff(np.angle(vals)))
        idx = np.nonzero(np.abs(d) > thr)[0]
        if idx.size == 0: return float(d.sum()), 0
        mid = 0.5 * (tau[idx] + tau[idx + 1])
        ok = (mid > tau[idx]) & (mid < tau[idx + 1])
        if not ok.all(): break
        tau = np.insert(tau, idx + 1, mid); vals = np.insert(vals, idx + 1, fn(mid))
    d = wrap(np.diff(np.angle(vals)))
    return float(d.sum()), int((np.abs(d) > thr).sum())

def gaussian_r(c2, lnN_eff, ln):
    """Model constants from second moments. c2 = |c_n|^2 (already includes 1/n), frequencies lam_n = thp - log n."""
    lam = lnN_eff - ln
    c0 = c2.sum(); c1 = (c2 * lam).sum(); cc2 = (c2 * lam * lam).sum()
    return dict(r=float(c1 / math.sqrt(c0 * cc2)), frac_neg=float(0.5 * (1 - c1 / math.sqrt(c0 * cc2))),
                right_density=float((c2 * ln).sum() / c0 / TWO_PI), mean_D=float(c1 / c0))

def analyse(fam, N, ua, ub, ppu=16, K=12, find=True, label=''):
    """One constant-length segment [T0+ua, T0+ub): winding counts of zeros right of each level, phase-derivative statistics, Newton zeros."""
    t0 = time.time(); T0 = fam.T0; q = fam.q
    L = math.log(N); step = 0.4 / L; dsig = [k * step for k in range(K)]
    M = int(math.ceil((ub - ua) * ppu)) + 1; u = np.linspace(ua, ub, M)
    print(f'[{label}] N={N} M={M} K={K} chunk rows={max(1, int(BUDGET / (48 * N)))} planned chunk bytes<={BUDGET:.3g}; F,G host arrays {2 * M * K * 16 / 1e9:.3f} GB', flush=True)
    F, G = fam.line(N, u, dsig)
    thp = 0.5 * np.log(q * (T0 + u) / TWO_PI)
    D = thp - (G[:, 0] / F[:, 0]).real
    res = dict(label=label, kind=fam.kind, T0=T0, N=N, ua=ua, ub=ub, M=M, step=step, dsig=dsig,
               frac_D_neg=float((D < 0).mean()), median_D=float(np.median(D)), mean_log_absF=float(np.log(np.abs(F[:, 0])).mean()),
               mean_abs2=float((np.abs(F[:, 0]) ** 2).mean()))
    c2 = np.abs(asnp(fam.c[:N])) ** 2
    res['model'] = gaussian_r(c2, float(thp.mean()), asnp(fam.ln[:N]))
    # windings
    SMAX = 3.0; counts = []; unres = 0; W0 = None
    Fr, _ = fam.point(N, np.full(2, SMAX - 0.5), np.array([ua, ub])); dright = float(np.angle(Fr[1]) - np.angle(Fr[0]))
    for k, d in enumerate(dsig):
        Wk, nu = refined_darg(u, F[:, k], lambda x, d=d: fam.point(N, np.full(x.size, d), x)[0]); unres += nu
        E = []
        for ue in (ua, ub):
            sg = np.linspace(d, SMAX - 0.5, 400)
            Fe = fam.point(N, sg, np.full(sg.size, ue))[0]
            e, nu = refined_darg(sg, Fe, lambda x, ue=ue: fam.point(N, x, np.full(x.size, ue))[0]); unres += nu; E.append(e)
        cnt = (E[0] + dright - E[1] - Wk) / TWO_PI; counts.append(cnt)
        if k == 0: W0 = Wk
    res['counts_right_of_level'] = [float(c) for c in counts]; res['unresolved_steps'] = unres
    res['count_right'] = int(round(counts[0])); res['count_int_err'] = float(max(abs(c - round(c)) for c in counts))
    H = ub - ua
    res['right_density'] = res['count_right'] / H
    res['mean_rate_arg_fF'] = float(thp.mean() + W0 / H)     # mean d/dt arg(e^{i theta} F) on the line
    res['zeros_of_Z_density'] = float(thp.mean() / math.pi)
    if find:
        delta = F / G; ad = np.abs(delta)
        seeds_ds, seeds_u = [], []
        for k, d in enumerate(dsig):
            a = ad[:, k]; loc = np.nonzero((a[1:-1] <= a[:-2]) & (a[1:-1] <= a[2:]) & (a[1:-1] < 0.8 / L))[0] + 1
            for e in (0, M - 1):
                if a[e] < 0.8 / L: loc = np.append(loc, e)
            seeds_ds.append(d + delta[loc, k].real); seeds_u.append(u[loc] + delta[loc, k].imag)
        ds = np.concatenate(seeds_ds); uu = np.concatenate(seeds_u)
        print(f'[{label}] seeds {ds.size}', flush=True)
        for it in range(14):
            Fp, Gp = fam.point(N, ds, uu); dl = Fp / Gp
            big = np.abs(dl) > 0.5 / L; dl[big] *= (0.5 / L) / np.abs(dl[big])
            ds = ds + dl.real; uu = uu + dl.imag
        Fp, Gp = fam.point(N, ds, uu); conv = np.abs(Fp / Gp) < 1e-9
        ds, uu, Gp = ds[conv], uu[conv], Gp[conv]
        o = np.lexsort((ds, uu)); ds, uu, Gp = ds[o], uu[o], Gp[o]
        keep = np.ones(ds.size, bool)
        for i in range(1, ds.size):
            j = i - 1
            while j >= 0 and uu[i] - uu[j] < 1e-6:
                if keep[j] and abs(ds[i] - ds[j]) < 1e-6: keep[i] = False; break
                j -= 1
        ds, uu, Gp = ds[keep], uu[keep], Gp[keep]
        inw = (uu >= ua) & (uu < ub)
        ds, uu, Gp = ds[inw], uu[inw], Gp[inw]
        res['newton_counts_right_of_level'] = [int((ds > d).sum()) for d in dsig]
        res['newton_found_total'] = int(ds.size)
        res['newton_left_within_search'] = int((ds < 0).sum())
        right = ds > 0
        res['right_zeros'] = [[float(a), float(b), float(abs(g))] for a, b, g in zip(ds[right], uu[right], Gp[right])]
        res['near_line_ambiguous'] = int((np.abs(ds) < 1e-8).sum())
        res['right_ds_quantiles_timesL'] = [float(x * L) for x in np.quantile(ds[right], [0.1, 0.25, 0.5, 0.75, 0.9, 0.99])] if right.any() else []
    res['seconds'] = time.time() - t0
    print(f"[{label}] count_right={res['count_right']} (int err {res['count_int_err']:.2e}, unresolved {unres}) density={res['right_density']:.4f} model={res['model']['right_density']:.4f} "
          f"fracDneg={res['frac_D_neg']:.4f} model={res['model']['frac_neg']:.4f} newton={res.get('newton_counts_right_of_level', ['-'])[0]} {res['seconds']:.1f}s", flush=True)
    return res

def segments(T0, H, q, xmult=1.0):
    """Split [T0, T0+H) into pieces of constant N = floor(xmult*sqrt(q t/2pi))."""
    out = []; a = 0.0
    while a < H - 1e-9:
        N = int(math.floor(xmult * math.sqrt(q * (T0 + a + 1e-7) / TWO_PI)))
        tend = TWO_PI * ((N + 1) / xmult) ** 2 / q - T0
        b = min(H, tend); out.append((N, a, b)); a = b
    return out

def run_window(kind, T0, H, ppu=16, K=12, find=True, w_c=None, alpha_mult=0, xmult=1.0, label=None, fixedN=False):
    coefq = {'dh': 5, 'chi5': 5}.get(kind, 1)
    label = label or f'{kind}@{T0:g}'
    if w_c is not None:
        Nc = math.sqrt(coefq * (T0 + H / 2) / TWO_PI); nmax = int(Nc * math.exp(6.2 / w_c)) + 1
        from scipy.special import erfc
        w = 0.5 * erfc(w_c * np.log(np.arange(1, nmax + 1) / Nc))
        fam = Fam(kind, T0, nmax, w=w, alpha_mult=alpha_mult); segs = [(nmax, 0.0, float(H))]
    else:
        segs = segments(T0, H, coefq, xmult) if not fixedN else [(int(xmult * math.sqrt(coefq * T0 / TWO_PI)), 0.0, float(H))]
        nmax = max(s[0] for s in segs)
        fam = Fam(kind, T0, nmax, alpha_mult=alpha_mult)
    out = [analyse(fam, N, a, b, ppu=ppu, K=K, find=find, label=f'{label} seg{i}') for i, (N, a, b) in enumerate(segs)]
    tot = dict(label=label, kind=kind, T0=T0, H=H, w_c=w_c, alpha_mult=alpha_mult, xmult=xmult, segs=out)
    Hs = np.array([s['ub'] - s['ua'] for s in out])
    tot['count_right'] = int(sum(s['count_right'] for s in out)); tot['right_density'] = tot['count_right'] / H
    tot['model_right_density'] = float(sum(s['model']['right_density'] * h for s, h in zip(out, Hs)) / H)
    tot['frac_D_neg'] = float(sum(s['frac_D_neg'] * h for s, h in zip(out, Hs)) / H)
    tot['model_frac_neg'] = float(sum(s['model']['frac_neg'] * h for s, h in zip(out, Hs)) / H)
    tot['zeros_of_Z_density'] = float(sum(s['zeros_of_Z_density'] * h for s, h in zip(out, Hs)) / H)
    tot['mean_rate_arg_fF'] = float(sum(s['mean_rate_arg_fF'] * h for s, h in zip(out, Hs)) / H)
    tot['mean_log_absF'] = float(sum(s['mean_log_absF'] * h for s, h in zip(out, Hs)) / H)
    if find:
        tot['newton_right'] = int(sum(s['newton_counts_right_of_level'][0] for s in out))
    return tot
