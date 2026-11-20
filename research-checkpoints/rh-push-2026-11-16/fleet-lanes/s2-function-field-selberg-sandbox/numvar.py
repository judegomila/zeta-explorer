"""numvar.py: number variance of smoothed level counts from the periodic-orbit side.
Fluctuating count in a window of width D centred at E, Gaussian-smoothed with width eps in r:
   n(E, D) = (2/pi) sum_t A_t exp(-eps^2 l_t^2/2) cos(l_t E) sin(l_t D/2)/l_t,
A_t = l_t w_t/(N_t^{1/2} - N_t^{-1/2}) summed over all classes of length l_t (Selberg), A_n = Lambda(n)/sqrt(n), l = log n (zeta; overall sign irrelevant),
A_n = 2 Lambda(n)/n at l = 2 log n (scattering part of the PSL2(Z) discrete count).
Long-band average (distinct lengths decorrelate): Var(D) = (2/pi^2) sum_t A_t^2 exp(-eps^2 l_t^2) sin^2(l_t D/2)/l_t^2; plateau P = (1/pi^2) sum A^2 exp(-eps^2 l^2)/l^2.
Outputs: plateau and its split by length, D_90 = first D with running mean of Var >= 0.9 P, Berry scale 1/l_0, and a direct band check.
usage: numvar.py geod.txt out.json [family_geod.txt]"""
import sys, json, math
import numpy as np
import tf
G = tf.load_geod(sys.argv[1])
def objects():
    obs = {}
    lam = tf.mangoldt_upto(int(math.exp(G['ell'][-1] / 2)) + 2); idx = np.nonzero(lam)[0]
    Lp, Ap = 2 * np.log(idx), 2 * lam[idx] / idx
    obs['PSL2Z_geodesics_only'] = (G['ell'], G['amp'] * G['cnt'])
    obs['PSL2Z_discrete(geodesics+scattering primes)'] = (np.concatenate([G['ell'], Lp]), np.concatenate([G['amp'] * G['cnt'], Ap]))
    for c in range(len(G['a'])):
        obs[f'G2_chi_{G["a"][c]:.4g}_{G["b"][c]:.4g}'] = (G['ell'], G['amp'] * G['tw'][:, c])
    nmax = int(math.exp(min(G['ell'][-1], 16.2)))
    lam = tf.mangoldt_upto(nmax); idx = np.nonzero(lam)[0]
    obs['zeta'] = (np.log(idx), lam[idx] / np.sqrt(idx))
    chi4 = np.where(idx % 2 == 0, 0.0, np.where(idx % 4 == 1, 1.0, -1.0))
    obs['L_chi4'] = (np.log(idx), chi4 * lam[idx] / np.sqrt(idx))
    rng = np.random.default_rng(1)
    # sign twist: completely multiplicative random signs on primes (eps_{p^k} = eps_p^k)
    sg = {}
    def sign_of(n):
        # n is a prime power p^k
        for p in range(2, int(n ** 0.5) + 2):
            if n % p == 0:
                k = 0; m = n
                while m % p == 0: m //= p; k += 1
                return p, k
        return n, 1
    sgn = np.ones(len(idx))
    primes = {}
    for i, n in enumerate(idx):
        if n < 2: continue
        p, k = sign_of(int(n)) if n < 10 ** 7 and lam[n] != math.log(n) else (int(n), 1)
        if p not in primes: primes[p] = rng.choice([-1.0, 1.0])
        sgn[i] = primes[p] ** k
    obs['zeta_sign_twist'] = (np.log(idx), sgn * lam[idx] / np.sqrt(idx))
    return obs
def var_curve(l, A, eps, Ds):
    w = A * A * np.exp(-eps * eps * l * l) / (l * l)
    keep = w > 1e-18 * w.max(); l, w = l[keep], w[keep]
    P = float(np.sum(w) / math.pi ** 2)
    V = np.array([float(2 / math.pi ** 2 * np.sum(w * np.sin(l * D / 2) ** 2)) for D in Ds])
    return P, V
def summarize(name, l, A):
    order = np.argsort(l); l, A = l[order], A[order]
    nz = A != 0; l0 = float(l[nz][0])
    rec = dict(l0=l0, berry_D=1 / l0, n_lengths=int(nz.sum()), eps={})
    Ds = np.linspace(0.005, 12.0, 2400)
    for eps in (0.6, 0.4, 0.3, 0.25, 0.2, 0.15):
        if 5.5 / eps > l[-1]: continue          # smoothing must cut before the end of the length list
        P, V = var_curve(l, A, eps, Ds)
        run = np.cumsum(V) / np.arange(1, len(V) + 1)
        i90 = int(np.argmax(V >= 0.9 * P)) if np.any(V >= 0.9 * P) else None
        i50 = int(np.argmax(V >= 0.5 * P)) if np.any(V >= 0.5 * P) else None
        w = A * A * np.exp(-eps * eps * l * l) / (l * l) / math.pi ** 2
        cum = np.cumsum(w); lhalf = float(l[np.searchsorted(cum, 0.5 * cum[-1])])
        share0 = float(np.sum(w[np.abs(l - l0) < 1e-9]) / cum[-1])
        rec['eps'][str(eps)] = dict(plateau=P, D50=float(Ds[i50]) if i50 is not None else None, D90=float(Ds[i90]) if i90 is not None else None,
                                    D50_times_l0=float(Ds[i50]) * l0 if i50 is not None else None, median_length_of_plateau=lhalf, share_of_shortest=share0,
                                    D50_times_lmedian=float(Ds[i50]) * lhalf if i50 is not None else None)
    return rec
def band_check(l, A, eps, D, E1, E2, nE):
    """direct band average of n(E,D)^2 against the diagonal formula."""
    wt = A * np.exp(-eps * eps * l * l / 2) * np.sin(l * D / 2) / l
    keep = np.abs(wt) > 1e-14 * np.abs(wt).max(); l, wt = l[keep], wt[keep]
    Es = np.linspace(E1, E2, nE); acc = 0.0
    print(f'   band check: planned memory {len(l) * 128 * 8 / 1e9:.3f} GB per chunk', flush=True)
    for i in range(0, nE, 128):
        e = Es[i:i + 128]; acc += float(np.sum((2 / math.pi * (np.cos(np.outer(e, l)) @ wt)) ** 2))
    diag = float(2 / math.pi ** 2 * np.sum(wt * wt))
    return acc / nE, diag
out = {}
obs = objects()
if len(sys.argv) > 3:
    F = tf.load_geod(sys.argv[3])
    for c in range(len(F['a'])): obs[f'fam_chi_{F["a"][c]:.4g}_{F["b"][c]:.4g}'] = (F['ell'], F['amp'] * F['tw'][:, c])
for name, (l, A) in obs.items():
    out[name] = summarize(name, np.asarray(l, float), np.asarray(A, float))
    e = out[name]['eps']
    print(name, 'l0=%.4f' % out[name]['l0'], {k: (round(v['plateau'], 4), v['D50'] and round(v['D50_times_l0'], 3), round(v['median_length_of_plateau'], 2), round(v['share_of_shortest'], 3)) for k, v in e.items()}, flush=True)
for name in ('PSL2Z_geodesics_only', 'G2_chi_0.03_0.05', 'zeta'):
    l, A = obs[name]; l = np.asarray(l, float); A = np.asarray(A, float); nz = A != 0
    emp, diag = band_check(l[nz], A[nz], 0.4, 1.0, 200.0, 1200.0, 8192)
    out[name]['band_check_eps0.4_D1'] = dict(band_average=emp, diagonal=diag)
    print(name, 'band [200,1200] average', emp, 'diagonal formula', diag, flush=True)
json.dump(out, open(sys.argv[2], 'w'))
