"""g_fft.py -- combination 1, spectral side: FFT of the shell polynomials f(theta) = sum_{n<M} c_n e(-n theta) on the grid j/M,
M = 2^k * 105, for the live shell Y_4 (n coprime to all primes <= 97), each killed shell Z_g and the full vector.
float64 on the GPU (screen); the alias values at a/q, q | 210, are re-checked exactly from residue-class sums (integers)."""
import argparse, json, math, os, time
from fractions import Fraction
import numpy as np
import s4lib as S

ap = argparse.ArgumentParser()
ap.add_argument("--k", type=int, default=22); ap.add_argument("--out", default="c1_fft.json"); ap.add_argument("--cpu", action="store_true"); ap.add_argument("--skip", default="")
a = ap.parse_args()
xp = np; GPU = False
if not a.cpu:
    try:
        import cupy as cp
        cp.get_default_memory_pool().set_limit(size=22 * 1024 ** 3); xp = cp; GPU = True
    except Exception as e:
        print("cupy not used:", e, flush=True)
M = (1 << a.k) * 105
print("M = %d, planned arrays: 3 x %.2f GB real + 2 x %.2f GB complex spectrum" % (M, M * 8 / 1e9, (M // 2 + 1) * 16 / 1e9), flush=True)
P = [int(p) for p in S.P97]; dec = P[::-1]; blocks = [dec[S.CUTS97[g]:S.CUTS97[g + 1]] for g in range(4)]


def shell_masks():
    """returns list of boolean masks: Z_1..Z_4, Y_4 (n = 0 excluded everywhere)"""
    live = xp.ones(M, dtype=bool); live[0] = False; out = []
    for blk in blocks:
        keep = live.copy()
        for p in blk: keep[::p] = False
        out.append(live & ~keep); live = keep
    out.append(live); return out


def coeffs(name):
    n = xp.arange(M, dtype=xp.int64)
    if name == "ONE": return [xp.ones(M)]
    if name == "CHI5":
        r = n % 5; return [xp.asarray(np.array([0, 1, 0, 0, -1.0]))[r], xp.asarray(np.array([0, 0, 1, -1, 0.0]))[r]]
    if name == "DH": return [xp.asarray(np.array([0, 1, S.KAPPA, -S.KAPPA, -1.0]))[n % 5]]
    if name == "CHI101": return [xp.asarray(np.array([S.leg101(x) for x in range(101)], dtype=float))[n % 101]]
    if name == "SGN97":
        v = xp.ones(M)
        for p in P:
            if S.sgn(p) < 0:
                q = p
                while q < M: v[::q] *= -1.0; q *= p
        return [v]
    if name == "TNR":
        v = xp.ones(M); v[::3] += S.TNR_C * math.sqrt(3); v[::9] += 3.0; return [v]
    if name == "SGNG":
        v = np.zeros(M); CH = 1 << 26
        for lo in range(1, M, CH):
            hi = min(M, lo + CH); _, _, so = S.factor_chunk(lo, hi, seg=1 << 20, doEA=0, want_sign=True); v[lo:hi] = so
        return [xp.asarray(v)]
    raise ValueError(name)


def free():
    if GPU: cp.get_default_memory_pool().free_all_blocks()


def fft_of(parts):
    """spectrum on j = 0..M/2 (real input, half = True) or on j = 0..M-1 (complex input)"""
    if len(parts) == 1: return xp.fft.rfft(parts[0]), True
    c = parts[0] + 1j * parts[1]; F = xp.fft.fft(c); del c; free(); return F, False


def at(F, half, j):
    return complex(F[j]) if (not half or j <= M // 2) else complex(F[M - j]).conjugate()


res = dict(M=M, gpu=GPU, objects={}); t0 = time.time()
masks = shell_masks()
A97 = float(np.prod([1 - 1 / p for p in P]))
alias_idx = sorted(set(int(Fraction(aa, 210) * M) for aa in range(210)))      # j = a M / 210
for name in ["ONE", "CHI5", "DH", "CHI101", "SGN97", "TNR", "SGNG"]:
    if name in a.skip.split(","): continue
    t1 = time.time(); parts = coeffs(name); o = {}
    Lp, half = fft_of(parts); o["L_sum"] = [float(Lp[0].real), float(Lp[0].imag)]
    y4 = [c * masks[4] for c in parts]
    o["shell_sums"] = [[float(sum(1j ** i * (c * m).sum() for i, c in enumerate(parts)).real), float(sum(1j ** i * (c * m).sum() for i, c in enumerate(parts)).imag)] for m in masks]
    en = float(sum((c * c).sum() for c in y4)); o["Y4_l2"] = en
    if name in ("ONE", "SGN97", "SGNG", "CHI101"):      # exact residue-class sums of the live shell (integers)
        n = xp.arange(M, dtype=xp.int64); rs = xp.bincount((n % 210)[masks[4]], weights=y4[0][masks[4]], minlength=210); del n
        rs = np.rint(xp.asnumpy(rs) if GPU else rs)
        ex = np.array([(rs * np.exp(-2j * np.pi * np.arange(210) * aa / 210)).sum() for aa in range(210)])
    del parts; free()
    Yp, half = fft_of(y4); del y4; free()
    o["Y4_sum"] = [float(Yp[0].real), float(Yp[0].imag)]
    ab2 = xp.abs(Yp) ** 2
    tot = float(ab2[0] + 2 * ab2[1:M // 2].sum() + ab2[M // 2]) if half else float(ab2.sum()); o["parseval_ratio"] = tot / (M * en)
    vals = {j: at(Yp, half, j) for j in alias_idx}; ea_ = sum(abs(v) ** 2 for v in vals.values())
    o["alias210_energy_fraction"] = ea_ / (M * en)
    y0 = max(1e-300, abs(vals[0]))
    o["Y4_at_1_over_q"] = {str(q): [vals[M // q].real / y0, vals[M // q].imag / y0] for q in (2, 3, 5, 7)}
    idx = xp.asarray(np.array([j for j in alias_idx if (not half or j <= M // 2)])); ab2[idx] = 0
    top = xp.argsort(ab2)[-12:][::-1]; top = [int(t) for t in (xp.asnumpy(top) if GPU else top)]
    o["top_off_alias"] = [dict(j=j, frac=str(Fraction(j, M).limit_denominator(100000)), rel=math.sqrt(float(ab2[j]) / (M * en))) for j in top]
    o["sup_off_alias_over_sqrt_energy"] = math.sqrt(float(ab2.max()) / (M * en)); del ab2; free()
    for An, Av in (("A=0.5", 0.5), ("A=A97", A97)):
        E = Yp - Av * Lp; aE = xp.abs(E)
        o["E_%s" % An] = dict(frac_Re_positive=float((E.real > 0).mean()), E0=[float(E[0].real), float(E[0].imag)], sup_abs=float(aE.max()), median_abs=float(xp.median(aE)))
        del E, aE; free()
    if name in ("ONE", "SGN97", "SGNG", "CHI101"):
        got = np.array([vals[int(Fraction(aa, 210) * M)] for aa in range(210)])
        o["alias_fft_vs_exact_maxabs"] = float(np.abs(ex - got).max()); o["alias_exact_energy_fraction"] = float((np.abs(ex) ** 2).sum() / (M * en))
    o["sec"] = time.time() - t1; res["objects"][name] = o
    print(name, json.dumps({k: v for k, v in o.items() if k not in ("top_off_alias", "shell_sums")}), flush=True)
    del Lp, Yp; free()
    json.dump(res, open(a.out, "w"), indent=1)
res["sec"] = time.time() - t0; res["A97"] = A97
res["predicted_alias210_fraction_periodic"] = float(np.prod([1 - 1 / p for p in P if p > 7]))
json.dump(res, open(a.out, "w"), indent=1); print("done %.0f s" % res["sec"], flush=True)
