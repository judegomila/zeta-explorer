"""s5 combination 3: Hardy-Littlewood correlations of the log-derivative coefficients as a finite coefficient statement.

C_k(H; X) = sum_{n <= X} c(n) c*(n + h_1) c(n + h_2) c*(n + h_3) ...   (c* = conjugate in the "conjugate form", = c in the plain form),
restricted to odd primes n, n + h_i (prime powers change C_k by O(X^(1/2) log^k X), the size of the conjectured error; stated in RESULT.md).
k = 2: every even h, 2 <= h <= 2 HH, by FFT cross-correlation of each segment (odd numbers only, lag h/2).
k = 3, 4: a fixed list of tuples by direct gathering.
Objects: ZETA c = log p;  CHI5C c = chi(p) log p, chi mod 5 with chi(2) = i (plain and conjugate forms);  CHI5R;  CHI4 (k = 3, 4; for k = 2 it is (-1)^(h/2) x ZETA);
RSGN c = eps_p log p (hash signs);  UNI c = e^{i theta_p} log p (conjugate form).   LIOU = (-1)^k ZETA on primes; T-NR differs from ZETA in O(1) terms.
Main terms:  S(H) X with S the singular series; twisted objects: S(H) X times the mean of the character product over the admissible residues (0 when that mean vanishes).
Checkpoints at X_j ~ 10^(j/4); output: cumulative sums at each checkpoint.
"""
import sys, os, math, json, time
import numpy as np
from multiprocessing import Pool
import psnu
PI = math.pi
HH = 5000                      # half-lags 1..HH  <->  h = 2..10000
SEG = (1 << 22) - 5120         # odd numbers per segment
NF = 1 << 22
TRIPLES = [(0, 2, 6), (0, 4, 6), (0, 6, 12), (0, 2, 8), (0, 6, 30), (0, 30, 60), (0, 210, 420), (0, 2310, 4620), (0, 1000, 9000), (0, 3600, 9240), (0, 2, 4), (0, 8, 22)]
QUADS = [(0, 2, 6, 8), (0, 4, 6, 10), (0, 6, 12, 18), (0, 30, 60, 90), (0, 2, 6, 12), (0, 210, 420, 630), (0, 10, 4002, 9000), (0, 2310, 4620, 6930), (0, 2, 4, 6)]
CHI5C_TAB = np.array([0, 1, 1j, -1j, -1])
K2 = ['ZETA', 'RSGN', 'CHI5R', 'CHI5C_conj', 'CHI5C_plain', 'UNI_conj']
KT_OBJ = ['ZETA', 'CHI4', 'CHI5R', 'RSGN', 'CHI5C_conj', 'UNI_conj']

def checkpoints(X):
    cps = []
    j = 28
    while 10 ** (j / 4.0) <= X * 1.0001:
        cps.append(int(round(10 ** (j / 4.0) / (2 * SEG))) * 2 * SEG); j += 1
    return sorted(set(c for c in cps if c > 0))

def xcorr(fa_conj, fb):
    return np.fft.irfft(fa_conj * fb, n=NF)[:HH + 1]

def seg_stats(lo, bp, lean=False):
    """segment of odd numbers lo + 2 i, i in [0, SEG); pairs (n, n + h) with n in the segment"""
    hi = lo + 2 * (SEG + HH + 8)
    p = psnu.seg_primes(lo, hi, bp); p = p[p > 1]
    idx = ((p - lo) // 2).astype(np.int64)
    lp = np.log(p.astype(np.float64))
    nL = SEG + HH + 8
    arr = {}
    lam = np.zeros(nL); lam[idx] = lp; arr['ZETA'] = lam
    eps = psnu.eps_sign(p); a = np.zeros(nL); a[idx] = lp * eps; arr['RSGN'] = a
    a = np.zeros(nL); a[idx] = lp * psnu.CHI5R_TAB[p % 5]; arr['CHI5R'] = a
    a = np.zeros(nL); a[idx] = lp * psnu.CHI4_TAB[p % 4]; arr['CHI4'] = a
    c5 = CHI5C_TAB[p % 5]; ar = np.zeros(nL); ai = np.zeros(nL); ar[idx] = lp * c5.real; ai[idx] = lp * c5.imag; arr['C5r'] = ar; arr['C5i'] = ai
    th = psnu.theta_uni(p); ur = np.zeros(nL); ui = np.zeros(nL); ur[idx] = lp * np.cos(th); ui[idx] = lp * np.sin(th); arr['Ur'] = ur; arr['Ui'] = ui
    out = {}
    def F(v, first):          # first: restricted to n in the segment
        w = v[:SEG] if first else v
        return np.fft.rfft(w, n=NF)
    fz_a = np.conj(F(arr['ZETA'], True)); out['ZETA'] = xcorr(fz_a, F(arr['ZETA'], False)).astype(np.complex128)
    out['RSGN'] = xcorr(np.conj(F(arr['RSGN'], True)), F(arr['RSGN'], False)).astype(np.complex128)
    zero = np.zeros(HH + 1, dtype=np.complex128)
    if lean:
        for k in ('CHI5R', 'CHI5C_conj', 'CHI5C_plain', 'UNI_conj'): out[k] = zero
    else: out['CHI5R'] = xcorr(np.conj(F(arr['CHI5R'], True)), F(arr['CHI5R'], False)).astype(np.complex128)
    for nm, (r, i) in ((('CHI5C', ('C5r', 'C5i')), ('UNI', ('Ur', 'Ui'))) if not lean else ()):
        far = np.conj(F(arr[r], True)); fai = np.conj(F(arr[i], True)); fbr = F(arr[r], False); fbi = F(arr[i], False)
        rr = xcorr(far, fbr); ii = xcorr(fai, fbi); ri = xcorr(far, fbi); ir = xcorr(fai, fbr)
        out[nm + '_conj'] = (rr + ii) + 1j * (ir - ri)          # sum c(n) conj c(n+h)
        if nm == 'CHI5C': out[nm + '_plain'] = (rr - ii) + 1j * (ri + ir)
    k2 = np.stack([out[k] for k in K2])
    # k = 3, 4 by gathering at the primes of the segment
    m = idx < SEG; i0 = idx[m]
    cz = arr['ZETA']; cplx = dict(ZETA=cz, CHI4=arr['CHI4'], CHI5R=arr['CHI5R'], RSGN=arr['RSGN'], CHI5C_conj=arr['C5r'] + 1j * arr['C5i'], UNI_conj=arr['Ur'] + 1j * arr['Ui'])
    kt = np.zeros((len(KT_OBJ), len(TRIPLES) + len(QUADS)), dtype=np.complex128)
    for ti, H in enumerate(TRIPLES + QUADS):
        sel = i0
        for h in H[1:]:
            sel = sel[cz[sel + h // 2] != 0.0]
        if len(sel) == 0: continue
        for oi, nm in enumerate(KT_OBJ):
            c = cplx[nm]; v = c[sel]
            for r, h in enumerate(H[1:]):
                w = c[sel + h // 2]
                v = v * (np.conj(w) if (r % 2 == 0 and nm.endswith('_conj')) else w)
            kt[oi, ti] = v.sum()
    return k2, kt, int(m.sum())

def worker(args):
    wid, s0, s1, X, lean_seg = args
    bp = psnu.small_primes(int((X + 4 * SEG) ** 0.5) + 2)
    k2 = np.zeros((len(K2), HH + 1), dtype=np.complex128); kt = np.zeros((len(KT_OBJ), len(TRIPLES) + len(QUADS)), dtype=np.complex128); cnt = 0
    for s in range(s0, s1):
        lo = 2 * SEG * s + 1
        a, b, c = seg_stats(lo, bp, s >= lean_seg)          # segment 0 starts at 1; the number 1 is removed in seg_stats
        k2 += a; kt += b; cnt += c
    return wid, s0, s1, k2, kt, cnt

def run(X, workers, out, log=print, part=None, lean_from=1e10):
    cps = checkpoints(X); nseg_tot = cps[-1] // (2 * SEG)
    log('X=%.3g: %d segments of %d odd numbers; checkpoints %s; planned allocation per worker: about 30 arrays of %d float64 = %.2f GB' % (X, nseg_tot, SEG, ['%.3g' % c for c in cps], NF, 30 * NF * 8 / 1e9))
    # tasks: between consecutive checkpoints, split into chunks of at most 16 segments
    lean_cp = min(cps, key=lambda c: abs(c - lean_from)) if lean_from else None
    lean_seg = lean_cp // (2 * SEG) if lean_from else 10 ** 12
    log('k = 2 for CHI5R, CHI5C, UNI only up to X = %s (lean segments from %d)' % (lean_cp, lean_seg))
    tasks = []; prev = 0; wid = 0
    for c in cps:
        s_end = c // (2 * SEG); s = prev
        while s < s_end:
            e = min(s_end, s + 16); tasks.append((wid, s, e, X, lean_seg)); wid += 1; s = e
        prev = s_end
    cp_seg = [c // (2 * SEG) for c in cps]
    if part is not None: tasks = [t for t in tasks if t[0] % part[1] == part[0]]
    part_d = {}; t0 = time.time(); done = 0; ntask = 0
    def save_part():
        z2 = np.zeros((len(K2), HH + 1), dtype=np.complex128); zt = np.zeros((len(KT_OBJ), len(TRIPLES) + len(QUADS)), dtype=np.complex128)
        tmpf = out + '.tmp.npz'
        np.savez(tmpf, X=np.array(cps, dtype=np.float64), k2_part=np.stack([part_d[j][0] if j in part_d else z2 for j in range(len(cps))]),
                 kt_part=np.stack([part_d[j][1] if j in part_d else zt for j in range(len(cps))]), n_part=np.array([part_d[j][2] if j in part_d else 0 for j in range(len(cps))]),
                 seg_part=np.array([part_d[j][3] if j in part_d else 0 for j in range(len(cps))]), cp_seg=np.array(cp_seg), full_upto=float(lean_cp or cps[-1]),
                 K2=json.dumps(K2), KT=json.dumps(KT_OBJ), TRIPLES=json.dumps(TRIPLES), QUADS=json.dumps(QUADS), SEG=SEG, segments_done=done)
        os.replace(tmpf, out)
    with Pool(workers) as pool:
        for wid, s0, s1, k2, kt, cnt in pool.imap_unordered(worker, tasks, chunksize=1):
            j = next(i for i, cs in enumerate(cp_seg) if s1 <= cs)          # interval index
            if j not in part_d: part_d[j] = [np.zeros_like(k2), np.zeros_like(kt), 0, 0]
            part_d[j][0] += k2; part_d[j][1] += kt; part_d[j][2] += cnt; part_d[j][3] += s1 - s0; done += s1 - s0; ntask += 1
            if part is not None and ntask % 10 == 0: save_part()
            if wid % 50 < (part[1] if part else 1): log('  %d/%d segments, %.0fs' % (done, nseg_tot, time.time() - t0))
    if part is not None:
        save_part()
        log('part done %.0fs' % (time.time() - t0)); return
    k2c = np.zeros((len(cps), len(K2), HH + 1), dtype=np.complex128); ktc = np.zeros((len(cps), len(KT_OBJ), len(TRIPLES) + len(QUADS)), dtype=np.complex128); cn = np.zeros(len(cps))
    acc2 = 0; acct = 0; ac = 0
    for j in range(len(cps)):
        acc2 = acc2 + part_d[j][0]; acct = acct + part_d[j][1]; ac += part_d[j][2]
        k2c[j] = acc2; ktc[j] = acct; cn[j] = ac
    np.savez(out, full_upto=float(lean_cp or cps[-1]), X=np.array(cps, dtype=np.float64), k2=k2c, kt=ktc, nprimes=cn, K2=json.dumps(K2), KT=json.dumps(KT_OBJ), TRIPLES=json.dumps(TRIPLES), QUADS=json.dumps(QUADS), SEG=SEG)
    log('done %.0fs' % (time.time() - t0))

if __name__ == '__main__':
    part = (int(sys.argv[3]), int(sys.argv[4])) if len(sys.argv) > 4 else None
    run(float(sys.argv[2]), int(os.environ.get('RH_WORKERS', '2')), sys.argv[1], log=lambda s: print(s, flush=True), part=part, lean_from=float(os.environ.get('HL_LEAN', '1e10')))
