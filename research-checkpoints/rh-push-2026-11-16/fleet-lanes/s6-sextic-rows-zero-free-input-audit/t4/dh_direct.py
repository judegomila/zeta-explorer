#!/usr/bin/env python3
"""dh_direct.py -- Poisson strength P_F(T) = (1/2) log(5 T / 2 pi) + Re F'/F(sigma + iT) for F = Davenport-Heilbronn and
F = L(s, chi_5) (real character mod 5, even: mean term the same up to O(1/T)), evaluated directly:
F(s) = sum_n a(n) n^{-s} v(n/Mc),  v = 1 on [0, 1], smooth, 0 beyond 2,  Mc = CUT * 5 Tmax / (2 pi)  (CUT = 10 by default),
on T_k = Tc + k delta (k = -M/2..M/2-1, M = 2^19, delta = 0.05) by the same Gaussian-gridding NUFFT as desc.py.
usage: dh_direct.py outdir Tc [CUT]"""
import sys, os, math, json, time
import numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import desc as Dm
QS, SIG, M, MR, MSP, DELTA, TAU, H = Dm.QS, Dm.SIG, Dm.M, Dm.MR, Dm.MSP, Dm.DELTA, Dm.TAU, Dm.H
KAPPA = (math.sqrt(10 - 2 * math.sqrt(5)) - 2) / (math.sqrt(5) - 1)

def vcut(x):
    t = np.clip(2.0 - x, 0.0, 1.0)                      # 1 for x <= 1, 0 for x >= 2
    with np.errstate(divide='ignore', over='ignore', invalid='ignore'):
        a = np.where(t > 0, np.exp(-1.0 / np.maximum(t, 1e-300)), 0.0); b = np.where(t < 1, np.exp(-1.0 / np.maximum(1 - t, 1e-300)), 0.0)
    return a / (a + b)

def evaluate(Tc, cut=10.0, chunk=1 << 19, sigs=SIG):
    Tmax = Tc + DELTA * M / 2
    Mc = max(2000.0, cut * 5 * Tmax / (2 * math.pi)); nmax = int(2 * Mc)
    nch = 4 * len(sigs)                                  # per sigma: DH, DH', chi5, chi5'
    print(f"Tc = {Tc:g}: n <= {nmax}, channels {nch}; grid alloc {nch * MR * 16 / 2**30:.2f} GB; chunk alloc {nch * chunk * 16 * 3 / 2**30:.2f} GB", flush=True)
    grid = np.zeros((nch, MR + 4 * MSP + 8), complex); OFF = 2 * MSP + 4
    aDH = np.array([0.0, 1.0, KAPPA, -KAPPA, -1.0]); aC = np.array([0.0, 1.0, -1.0, -1.0, 1.0])
    twopi = 2 * np.arctan2(np.longdouble(0), np.longdouble(-1))
    for a in range(1, nmax + 1, chunk):
        n = np.arange(a, min(a + chunk, nmax + 1), dtype=np.int64); n = n[n % 5 != 0]
        om_l = np.log(n.astype(np.longdouble)); u = np.longdouble(Tc) * om_l / twopi
        fr = (u - np.floor(u)).astype(np.float64); om = om_l.astype(np.float64)
        base = vcut(n / Mc) * np.exp(-2j * np.pi * fr)
        x = DELTA * om; j0 = np.rint(x / H).astype(np.int64); d = x - j0 * H
        W = np.empty((nch, len(n)), complex)
        for i, sg in enumerate(sigs):
            sq = base * np.exp(-sg * om)
            W[4 * i] = sq * aDH[n % 5]; W[4 * i + 1] = -W[4 * i] * om; W[4 * i + 2] = sq * aC[n % 5]; W[4 * i + 3] = -W[4 * i + 2] * om
        chg = np.flatnonzero(np.diff(j0) != 0); ends = np.concatenate([chg, [len(n) - 1]]); cells = j0[ends]
        for o in range(-MSP, MSP + 1):
            C = np.cumsum(W * np.exp(-(d - o * H) ** 2 / (4 * TAU)), axis=1)
            S = C[:, ends]; S[:, 1:] -= C[:, ends[:-1]]
            np.add.at(grid, (slice(None), cells + o + OFF), S) if len(np.unique(cells)) != len(cells) else grid.__setitem__((slice(None), cells + o + OFF), grid[:, cells + o + OFF] + S)
    # x = delta log n >= 0 can be within MSP cells of 0 (n = 1): wrap the left padding
    g = grid[:, OFF:OFF + MR].copy(); g[:, MR - OFF:] += grid[:, :OFF]; g[:, :OFF] += grid[:, OFF + MR:OFF + MR + OFF] if grid.shape[1] >= OFF + MR + OFF else 0
    Fk = np.fft.fft(g, axis=1)
    kk = np.concatenate([np.arange(0, M // 2), np.arange(-M // 2, 0)])
    D = Fk[:, kk % MR] * (np.exp(kk.astype(float) ** 2 * TAU) * (H / math.sqrt(4 * math.pi * TAU)))
    o = np.argsort(kk); D = D[:, o]; kk = kk[o]
    return Tc + DELTA * kk, D, nmax

def direct(T, sig, nmax, Mc):
    n = np.arange(1, nmax + 1); n = n[n % 5 != 0]; om = np.log(n.astype(float))
    aDH = np.array([0.0, 1.0, KAPPA, -KAPPA, -1.0])[n % 5]
    w = vcut(n / Mc) * np.exp(-(sig + 1j * T) * om)
    return np.sum(w * aDH), np.sum(-w * aDH * om)

def main():
    outdir, Tc = sys.argv[1], float(sys.argv[2]); cut = float(sys.argv[3]) if len(sys.argv) > 3 else 10.0
    os.makedirs(outdir, exist_ok=True); t0 = time.time()
    T, D, nmax = evaluate(Tc, cut)
    Mc = nmax / 2
    rng = np.random.default_rng(2); errs = []
    for ks in rng.integers(0, M, 4):
        for i in (0, len(SIG) - 1):
            f, fp = direct(T[ks], SIG[i], nmax, Mc)
            errs.append(abs(f - D[4 * i, ks]) / max(1, abs(f))); errs.append(abs(fp - D[4 * i + 1, ks]) / max(1, abs(fp)))
    print(f"  nufft vs direct: max rel err {max(errs):.2e}; {time.time() - t0:.0f}s", flush=True)
    res = {'Tc': Tc, 'cut': cut, 'nmax': nmax, 'T_lo': float(T[0]), 'T_hi': float(T[-1]), 'nufft_err': max(errs), 'rows': {}}
    ok = T > 3.0
    mean = np.where(ok, 0.5 * np.log(5 * np.maximum(T, 3.0) / (2 * math.pi)), 0)
    keepP = {}
    for i, q in enumerate(QS):
        for nm, c in (('DH', 0), ('chi5', 2)):
            F = D[4 * i + c]; Fp = D[4 * i + c + 1]
            Pw = (mean + (Fp / F).real)[ok]; Tk = T[ok]
            neg = Pw < 0
            i0 = int(np.argmin(Pw))
            # connected runs of negative P: first few locations
            idx = np.flatnonzero(neg); runs = []
            if len(idx):
                br = np.flatnonzero(np.diff(idx) > 1); st = np.concatenate([[idx[0]], idx[br + 1]]); en = np.concatenate([idx[br], [idx[-1]]])
                runs = [(float(Tk[a]), float(Tk[b]), float(Pw[a:b + 1].min())) for a, b in zip(st[:12], en[:12])]
                nruns = len(st)
            else: nruns = 0
            res['rows'][f"{nm}|{q}"] = dict(q=q, sigma=SIG[i], minP=float(Pw[i0]), T_minP=float(Tk[i0]), medP=float(np.median(Pw)), fracP_lt0=float(neg.mean()),
                fracP_lt217=float(np.mean(Pw < 2.17)), fracP_lt437=float(np.mean(Pw < 4.37)), n_neg_runs=nruns, first_neg_runs=runs,
                meansq_F=float(np.mean(np.abs(F[ok]) ** 2)), min_absF=float(np.abs(F[ok]).min()))
            keepP[f"{nm}|{q}"] = Pw.astype(np.float32)
    np.savez_compressed(os.path.join(outdir, f"P_{Tc:g}.npz"), T=T[ok], **{k.replace('|', '_'): v for k, v in keepP.items()})
    json.dump(res, open(os.path.join(outdir, f"dh_{Tc:g}.json"), 'w'), indent=0)
    for q in (QS[0], QS[3], QS[-1]):
        r = res['rows'][f"DH|{q}"]; c = res['rows'][f"chi5|{q}"]
        print(f"  q = {q}: DH minP {r['minP']:.2f} at T = {r['T_minP']:.2f}, frac P<0 {r['fracP_lt0']:.4f}, runs {r['n_neg_runs']}, first {r['first_neg_runs'][:3]} | chi5 minP {c['minP']:.3f}, frac<0 {c['fracP_lt0']:.5f}", flush=True)
    print(f"done {time.time() - t0:.0f}s", flush=True)

if __name__ == '__main__':
    main()
