"""Combination 1: zero-detector large values at sigma = 3/4.
D_F(t) = sum_{X < n <= Y} c_F(n) n^(-3/4 - it),  c_F = (Dirichlet inverse of F truncated at X) * a_F,  X = floor(T^(1/4)), Y = floor(T^(1/2)).
R(V, T) = number of unit cells [k, k+1) in [T, 2T] that contain a grid point (spacing 1/16) with |D_F| >= V
(between 1/2 and 1 times the largest 1-separated set). Full coverage of [T, 2T] when T <= FULL, else NW windows of 2^LOGM points spread over [T, 2T].
Usage: c1.py OUT.jsonl T OBJ[,OBJ..] [FULL=1e9] [NW=64] [LOGM=22]"""
import sys, json, math, time, numpy as np
import core, lp
from core import xp
VS = [0.125, 0.25, 0.5, 1.0, 2.0, 4.0, 8.0]
PER = 16; H = 1.0 / PER

def run(obj, T, FULL, NW, LOGM, check=False):
    X = int(round(T ** 0.25)); Y = int(round(T ** 0.5))
    while X ** 4 > T: X -= 1
    while Y * Y > T: Y -= 1
    a = lp.coefs(obj, Y)
    c, chk, invmax = lp.detector_coefs(a, X, Y)
    n = np.arange(1, Y + 1, dtype=np.float64)
    coef = c[1:] * n ** -0.75
    m2 = float(np.sum(np.abs(coef) ** 2)); l1 = float(np.sum(np.abs(coef)))
    M = 1 << LOGM
    while M // PER > 4 * T and M > 4096: M //= 2
    span = M // PER
    if T <= FULL:
        nw = int(math.ceil(T / span)); starts = [T + i * span for i in range(nw)]
    else:
        nw = NW; starts = [T + int(i * (T - span) / (NW - 1)) for i in range(NW)]
    core.announce('window grid complex128 x 2 (oversampled FFT)', 2 * M * 16 * 2)
    cg = xp.asarray(coef.astype(np.complex128))
    cnt = np.zeros(len(VS), dtype=np.int64); cells = 0; ssq = 0.0; npts = 0; mx = 0.0; t_mx = 0.0; err = None
    vs = xp.asarray(VS)
    t0 = time.time()
    for s0 in starts:
        tc = float(s0 + span / 2)
        win = core.Win(tc, H, M, Y)
        Dv = xp.abs(win.dsum(cg))
        if check and err is None:
            j = np.array([0, 1, M // 3, M - 1]); tt = tc + (j - M // 2) * H
            ld = core.lnn_ld(Y)
            ref = np.array([np.sum(coef * np.exp(-1j * np.fmod(core.LD(t) * ld, core.TWOPI_LD).astype(np.float64))) for t in tt])
            err = float(np.max(np.abs(np.abs(ref) - core.asnp(Dv[j]))))
        cm = Dv.reshape(-1, PER).max(1)
        if T <= FULL:
            k = xp.arange(len(cm)) + s0
            keep = k < 2 * T; cm = cm[keep]; Dk = Dv[:int(keep.sum()) * PER]
        else: Dk = Dv
        cnt += core.asnp((cm[None, :] >= vs[:, None]).sum(1)).astype(np.int64)
        cells += int(len(cm)); ssq += float((Dk * Dk).sum()); npts += int(len(Dk))
        i = int(xp.argmax(Dv)); v = float(Dv[i])
        if v > mx: mx = v; t_mx = tc + (i - M // 2) * H
        del win, Dv, cm
    scale = T / cells
    r = dict(obj=obj, T=T, X=X, Y=Y, inv_check=chk, inv_max=invmax, m2_pred=m2, l1=l1, m2_meas=ssq / npts, cells=cells, full=bool(T <= FULL),
             V=VS, count=[int(x) for x in cnt], R=[float(x * scale) for x in cnt], frac=[float(x / cells) for x in cnt],
             gauss_frac=[1 - (1 - math.exp(-v * v / m2)) ** 1 for v in VS], max=mx, t_max=t_mx, nufft_err=err, sec=time.time() - t0, gpu=core.GPU, ext=bool(core.EXT))
    return r

if __name__ == '__main__':
    out = sys.argv[1]; T = int(float(sys.argv[2])); objs = sys.argv[3].split(',')
    FULL = float(sys.argv[4]) if len(sys.argv) > 4 else 1e9; NW = int(sys.argv[5]) if len(sys.argv) > 5 else 64; LOGM = int(sys.argv[6]) if len(sys.argv) > 6 else 22
    for o in objs:
        r = run(o, T, FULL, NW, LOGM, check=True)
        print(json.dumps(r), flush=True)
        open(out, 'a').write(json.dumps(r) + '\n')
