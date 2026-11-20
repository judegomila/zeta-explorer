"""Combination 4: orthogonal block sandwich on octave blocks of the object's zero ordinates (real rates; off-line pairs doubled).
Order: highest octave first.  T = exp(dA).  For the node set P_j = all ordinates below 2^{j+1}:
  Lambda_j = ||T[P_j, P_j]||^2,  LambdaPerp_{k,j} = ||T[P_j, V_k]||^2 (k <= j),  certificate value S_j(d) = sum_k LambdaPerp_{k,j}.
The sandwich max_k <= Lambda_j <= S_j holds for every matrix; the statistic is where S_j < 1.
mode f: float64 (numpy / cupy; absolute error about 2^s * 1e-16 * K), mode a<prec>: Arb.
usage: t4.py out.jsonl mode Hmax obj dlist(comma)"""
import sys, json, math, time, numpy as np
import pen
outp, mode, Hmax, obj = sys.argv[1], sys.argv[2], float(sys.argv[3]), sys.argv[4]; dl = [float(x) for x in sys.argv[5].split(',')]
import t2 as _t2  # ordinates()
def get(obj):
    if obj == 'ZETA-big': return sorted(json.load(open('zeta_big.json'))), ''
    return _t2.ordinates(obj)
rates, note = get(obj); rates = [g for g in rates if g < Hmax]
m0 = int(math.floor(math.log2(rates[0]))); m1 = int(math.floor(math.log2(rates[-1])))
blocks = [[g for g in rates if 2.0 ** m <= g < 2.0 ** (m + 1)] for m in range(m1, m0 - 1, -1)]      # highest first
ms = list(range(m1, m0 - 1, -1)); nu = [g for b in blocks for g in b]; K = len(nu)
off = np.cumsum([0] + [len(b) for b in blocks])
print(obj, 'K =', K, 'octaves', ms, 'sizes', [len(b) for b in blocks], 'planned memory %.2f GB' % (5 * K * K * 8 / 1e9), flush=True)
if mode == 'f':
    try:
        import cupy as xp; xp.get_default_memory_pool().set_limit(size=24 * 1024 ** 3)
    except Exception:
        xp = np
    A = xp.asarray(pen.gen_A(np.array(nu)))
def nrm(X):
    if X.shape[0] == 0 or X.shape[1] == 0: return 0.0
    if min(X.shape) <= 64 or xp is np: return float(xp.linalg.norm(X, 2)) if xp is np else float(xp.linalg.svd(X, compute_uv=False)[0])
    v = xp.ones(X.shape[1]) / math.sqrt(X.shape[1]); prev = -1.0
    for rnd in range(8):               # power iteration on X^T X, 24 steps between convergence checks (lower bound of the norm)
        for it in range(24):
            w = X.T @ (X @ v); nw = xp.linalg.norm(w); v = w / (nw + 1e-300)
        nv = float(nw)
        if nv == 0: return 0.0
        if abs(nv - prev) <= 1e-6 * nv: break
        prev = nv
    return math.sqrt(nv)
def evaluate(T, d, s, relrad):
    t0 = time.time(); rows = []
    for j in range(len(ms)):           # prefix = octaves ms[j:], i.e. all ordinates below 2^{ms[j]+1}
        r0 = int(off[j])
        perp = [nrm(T[r0:, int(off[k]):int(off[k + 1])]) ** 2 for k in range(j, len(ms))]
        lam = nrm(T[r0:, r0:]) ** 2
        rows.append(dict(top_octave=ms[j], n_nodes=K - r0, Lambda=lam, S=sum(perp), max_perp=max(perp), argmax_octave=ms[j + int(np.argmax(perp))], perp_top=perp[0]))
    rec = dict(obj=obj, mode=mode, Hmax=Hmax, d=d, K=K, squarings=s, relrad=relrad, octaves=ms, sizes=[len(b) for b in blocks], rows=rows, seconds=time.time() - t0)
    open(outp, 'a').write(json.dumps(rec) + '\n')
    print(obj, 'd=%g' % d, ' '.join('%d:%.3g/%.3g' % (r['top_octave'], r['Lambda'], r['S']) for r in rows), '(%.0f s)' % rec['seconds'], flush=True)
if mode == 'f':
    nd = int(sys.argv[6])              # ladders: d = d0 * 2^j, j < nd, one squaring per step
    for d0 in dl:
        T, s = pen.expm_ss(A, d0, xp, deg=12)
        for j in range(nd):
            evaluate(T, d0 * 2 ** j, s + j, None)
            if j < nd - 1: T = T @ T
else:
    xp = np; prec = int(mode[1:])
    for d in dl:
        TT = pen.arb_expm([repr(g) for g in nu], None, d, prec)
        X, e, mr = pen.mat_to_np(TT); evaluate(X * 2.0 ** e, d, None, mr)
