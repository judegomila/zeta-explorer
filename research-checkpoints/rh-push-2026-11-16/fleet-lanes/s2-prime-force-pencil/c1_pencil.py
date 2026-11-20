"""Combination 1: pencil Z_F(x) + (tau/2) W_c(x) on the line (Hardy normalisation of Xi_F + tau Psi_c, Lemma A of the source).
 form A: W_c(x) = Re( e^{i theta_F(x)} D_c(x) ),  form B: W_c(x) = Re D_c(x),  D_c(x) = sum_{p<=P} c(p) log p p^(-1/2 - i x).
Real-zero count n(tau) = sign changes of Z_F + (tau/2) W_c on a grid of step h over the window; tau_plus / tau_minus = first |tau| at which
n(tau) != n(0) (bracket on a log grid from 1e-4, then bisection: an upper bound for the first loss).
Usage: c1_pencil.py OBJ A B PMAX OUT.json     OBJ: zeta | chi | dh   (chi, dh: sampled Hardy functions of lane s1-zero-flow-dynamics, upsampled)
For zeta the families are: true, rsign, thin, dhc (DH coefficients), uni (p^-i), tnr2, tnr101, tnr1000003 (true + c sqrt(q) at q, c = 2.2).
For chi: own (chi(p), with the root-number phase), conj (chibar(p) on the zeros of chi), true(1). For dh: own (a_DH(p)), chi, true."""
import sys, os, json, math, time, numpy as np
from concurrent.futures import ThreadPoolExecutor
import lib, primes
from lib import log

SIG = 1.6; J = 10; RX = 3.0
CHI = {0: 0, 1: 1, 2: 1j, 3: -1j, 4: -1}
TAUG = sum(CHI[a] * np.exp(2j * np.pi * a / 5) for a in (1, 2, 3, 4)); WROOT = TAUG / (1j * math.sqrt(5))

def D_grid(A, h, M, pr, cf, levels_idx, CHP=4000000):
    """D(x_m) = sum_p c(p) log p p^(-1/2) exp(-i x_m log p), x_m = A + m h, m < M, cumulative over prime index ranges [0, levels_idx[k]).
    Gaussian gridding in the frequency h*log p, FFT of size Kx >= RX*M; primes processed in chunks. cf(i0, i1, u) -> coefficients."""
    Kx = int(2 ** math.ceil(math.log2(RX * M)))
    m = np.arange(M); dec = np.exp(0.5 * SIG * SIG * (2 * math.pi * m / Kx) ** 2) / (SIG * math.sqrt(2 * math.pi)); del m
    out = []; c = np.zeros(Kx, dtype=np.complex128); prev = 0
    for li in levels_idx:
        for i0 in range(prev, li, CHP):
            i1 = min(li, i0 + CHP); pf = pr[i0:i1].astype(np.float64); u = np.log(pf)
            dd = cf(i0, i1, u) * (u / np.sqrt(pf)) * np.exp(-1j * np.mod(A * u, 2 * math.pi))
            a = h * u * Kx / (2 * math.pi); n0 = np.rint(a).astype(np.int64); fr = a - n0
            lo = int(n0.min()) - J; hi = int(n0.max()) + J + 1; assert lo >= 0 and hi < Kx // 2
            for j in range(-J, J + 1):
                w = np.exp(-(j - fr) ** 2 / (2 * SIG * SIG)); idx = n0 + j - lo
                c.real[lo:hi] += np.bincount(idx, weights=w * dd.real, minlength=hi - lo); c.imag[lo:hi] += np.bincount(idx, weights=w * dd.imag, minlength=hi - lo)
        prev = li
        out.append(np.fft.fft(c)[:M] * dec)
    return out

def count(Z, W, tau):
    f = Z + (0.5 * tau) * W
    return int(np.count_nonzero(f[1:] * f[:-1] < 0))

TAUS = np.array([1e-4, 2e-4, 5e-4, 1e-3, 2e-3, 5e-3, 1e-2, 2e-2, 5e-2, 0.1, 0.2, 0.3, 0.5, 0.7, 1.0, 1.22, 1.5, 2.0])
def analyse(Z, W):
    n0 = count(Z, W, 0.0); res = dict(n0=n0, plus=[], minus=[])
    for sgn, key in ((1, 'plus'), (-1, 'minus')):
        cs = [count(Z, W, sgn * t) for t in TAUS]; res[key] = cs
        j = next((i for i, c in enumerate(cs) if c != n0), None)
        if j is None: res['tau_' + key] = None
        else:
            lo = 0.0 if j == 0 else TAUS[j - 1]; hi = TAUS[j]
            for _ in range(18):
                mid = 0.5 * (lo + hi)
                if count(Z, W, sgn * mid) != n0: hi = mid
                else: lo = mid
            res['tau_' + key] = float(hi)
    return res

if __name__ == '__main__':
    obj = sys.argv[1]; A = float(sys.argv[2]); B = float(sys.argv[3]); pmax = int(float(sys.argv[4])); out = sys.argv[5]
    hW = 2 * math.pi / math.log(pmax) / 8
    if obj == 'zeta':
        h = hW; M = int((B - A) / h); x = A + h * np.arange(M)
        t0 = time.time(); Z = lib.hardy_Z(x); th = lib.theta_zeta(x); log('Z sampled: %d points step %.4f (%.0fs)' % (M, h, time.time() - t0))
    else:
        for p in (os.path.join(lib.DATA, 'dir_samples.npz'), os.path.join(os.path.dirname(os.path.abspath(__file__)), 'data', 'dir_samples.npz'), os.path.join(lib.DATA, 'dir2e5_samples.npz')):
            if os.path.exists(p): break
        d = np.load(p); hs = float(d['h']); Ufac = int(math.ceil(hs / hW)); h = hs / Ufac
        S = d['Z1'] if obj == 'chi' else (d['Z1'] + d['Z2'] if bool(d['dh_plus']) else d['Z1'] - d['Z2'])
        i0 = max(int(A / hs), 30); i1 = min(int(B / hs), len(S) - 30); A = i0 * hs
        t = i0 + np.arange((i1 - i0) * Ufac) / Ufac
        Z = lib.sinc_interp(S, t, 4, 20); M = len(Z); x = A + h * np.arange(M); th = lib.theta_chi5(x)
        log('%s: %d points step %.4f from samples (upsampling %d)' % (obj, M, h, Ufac))
    nsc = int(np.count_nonzero(Z[1:] * Z[:-1] < 0)); log('window [%.1f, %.1f]: sign changes of Z_F: %d' % (x[0], x[-1], nsc))
    pr = np.concatenate(list(primes.prime_segments(pmax)))
    log('primes %d ; planned memory: primes %.2f GB, FFT grid 2^%d (%.2f GB), %d level arrays of %.2f GB' % (len(pr), len(pr) * 8 / 1e9, math.ceil(math.log2(RX * M)), 2 ** math.ceil(math.log2(RX * M)) * 16 / 1e9, int(round(math.log10(pmax))) - 1, M * 16 / 1e9))
    levels = [10 ** k for k in range(2, int(round(math.log10(pmax))) + 1)]; lidx = [int(np.searchsorted(pr, L, side='right')) for L in levels]
    DHC = np.array([0.0, 1.0, lib.KAPPA, -lib.KAPPA, -1.0]); chit = np.array([CHI[a] for a in range(5)]); ubar = np.conj(np.sqrt(WROOT))
    fam = {}
    if obj == 'zeta':
        thin = primes.Thin(0.9); tf = np.concatenate([thin.flags(pr[i:i + 4000000]) for i in range(0, len(pr), 4000000)])
        fam['true'] = lambda i0, i1, u: np.ones(i1 - i0); fam['rsign'] = lambda i0, i1, u: primes.sign_hash(pr[i0:i1])
        fam['thin'] = lambda i0, i1, u: np.where(tf[i0:i1], -1.0, 1.0); fam['dhc'] = lambda i0, i1, u: DHC[pr[i0:i1] % 5]; fam['uni'] = lambda i0, i1, u: np.exp(-1j * u)
    elif obj == 'chi':
        fam['own'] = lambda i0, i1, u: ubar * chit[pr[i0:i1] % 5]; fam['conj'] = lambda i0, i1, u: ubar * np.conj(chit)[pr[i0:i1] % 5]; fam['true'] = lambda i0, i1, u: np.ones(i1 - i0)
    else:
        cdh = ((1 - 1j * lib.KAPPA) / 2 * np.sqrt(WROOT)).real
        fam['own'] = lambda i0, i1, u: DHC[pr[i0:i1] % 5] / cdh; fam['chi'] = lambda i0, i1, u: ubar * chit[pr[i0:i1] % 5]; fam['true'] = lambda i0, i1, u: np.ones(i1 - i0)
    res = dict(obj=obj, A=float(x[0]), B=float(x[-1]), h=h, M=M, pmax=pmax, n_signchanges=nsc, levels=levels, taus=TAUS.tolist(), rows=[])
    eth = np.exp(1j * th)
    for name, cf in fam.items():
        t0 = time.time(); Ds = D_grid(float(x[0]), h, M, pr, cf, lidx)
        if name == 'true' and obj == 'zeta':   # direct check of the gridding at a few points, largest level
            ii = np.random.default_rng(3).integers(0, M, 3); err = 0.0
            for i in ii:
                tot = 0j
                for i0 in range(0, len(pr), 4000000):
                    pf = pr[i0:i0 + 4000000].astype(np.float64); uu = np.log(pf); tot += (uu / np.sqrt(pf) * np.exp(-1j * np.mod(x[i] * uu, 2 * math.pi))).sum()
                err = max(err, abs(tot - Ds[-1][i]))
            log('gridding check (3 points, P=%g): max |direct - fft| = %.2e, rms |D| = %.3f' % (pmax, err, np.sqrt(np.mean(np.abs(Ds[-1]) ** 2)))); res['grid_check'] = float(err)
        jobs = []
        for L, D in zip(levels, Ds):
            jobs.append((name, L, 'A', (eth * D).real)); jobs.append((name, L, 'B', D.real.copy()))
            if name == 'true' and obj == 'zeta':
                for q in (2, 101, 1000003):
                    if q <= L:
                        add = 2.2 * math.log(q) * np.cos(th - x * math.log(q)); jobs.append(('tnr%d' % q, L, 'A', (eth * D).real + add))
        def run(jb):
            nm, L, form, W = jb; r = analyse(Z, W); r.update(family=nm, P=L, form=form, W_rms=float(np.sqrt(np.mean(W * W)))); return r
        with ThreadPoolExecutor(lib.NW) as ex: rr = list(ex.map(run, jobs))
        res['rows'] += rr
        for r in rr:
            if r['P'] in (levels[0], levels[-1]) or r['P'] == 10 ** 6:
                log('  %-10s P=%-6g form %s: n0 %d tau+ %s tau- %s ; n(+-0.1) %d %d ; n(+-1) %d %d ; rms W %.2f' % (r['family'], r['P'], r['form'], r['n0'], r['tau_plus'], r['tau_minus'], r['plus'][9], r['minus'][9], r['plus'][14], r['minus'][14], r['W_rms']))
        log('family %s done (%.0fs)' % (name, time.time() - t0)); json.dump(res, open(out, 'w'))
    # source premise: mean-field pencil (1 - tau) Z + tau cos(theta)  (zeta only)
    if obj == 'zeta':
        cth = np.cos(th); cs = []
        tg = np.round(np.arange(-2.0, 3.0001, 0.02), 4)
        for t in tg:
            f = (1 - t) * Z + t * cth; cs.append(int(np.count_nonzero(f[1:] * f[:-1] < 0)))
        cs = np.array(cs); i0 = int(np.argmin(np.abs(tg))); n0 = cs[i0]
        up = next((tg[i] for i in range(i0, len(tg)) if cs[i] != n0), None); dn = next((tg[i] for i in range(i0, -1, -1) if cs[i] != n0), None)
        res['meanfield'] = dict(tau=tg.tolist(), counts=cs.tolist(), n0=int(n0), first_change_up=up, first_change_down=dn)
        log('mean-field pencil (1-tau)Z + tau cos(theta): n0=%d ; first tau>0 with a different count: %s ; first tau<0: %s ; n(1)=%d' % (n0, up, dn, cs[int(np.argmin(np.abs(tg - 1)))]))
        json.dump(res, open(out, 'w'))
