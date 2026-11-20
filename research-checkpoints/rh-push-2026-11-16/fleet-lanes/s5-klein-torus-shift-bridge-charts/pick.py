"""Combinations (2) and (3): inertia of Pick matrices of S_a(w) = X(w-a)/X(w+a) on nested node sets.

Kernels (w in the right half-plane Re w > 0; z = i w is the upper half-plane variable of E_a(z) = X(a - iz)):
  lin        P_ij = (1 - S_i conj S_j) / (w_i + conj w_j)                      (linear denominator; diagonal congruence of
                                                                               the de Branges kernel K_a of E_a: K_a = E E* P / (2 pi))
  sinh:Y     P_ij = (1 - S_i conj S_j) / (sinh(c w_i) + conj sinh(c w_j)),  c = pi/(2Y)   (half-strip Re w > 0, |Im w| < Y)
Nodes: Halton points (bases 2, 3) of the rectangle [x0, x1] x [y0, y1] (Re w, Im w), nested in n.
Output per kernel: relative pivots rho_k = d_k / P_kk of the LDL* factorisation in the node order (d_k = det_k/det_{k-1});
the number of negative pivots among the first n is the negative index of the n x n matrix; the first negative pivot is the
first order at which the nested matrix is indefinite.  Balls: the S values are evaluated with 64 guard bits, rounded to `bits` bits and given the radius 2^(16-bits); the
factorisation is in ball arithmetic and stops when a pivot ball contains zero ('undetermined'): every reported sign is certified.

usage: pick.py CODE a x0 x1 y0 y1 n bits OUT kernel [kernel ...]      (a, x0.. as decimal strings)"""
import sys, os, json, time, math
from multiprocessing import Pool
from flint import acb, arb, ctx
import objs

def halton(i, b):
    f = 1.0; r = 0.0
    while i > 0:
        f /= b; r += f * (i % b); i //= b
    return r

def nodes(x0, x1, y0, y1, n):
    out = []
    for i in range(1, n + 1):
        out.append((x0 + (x1 - x0) * halton(i, 2), y0 + (y1 - y0) * halton(i, 3)))
    return out

_G = {}
def _init(code, bits, a, tmax):
    ctx.prec = bits + 64
    _G['o'] = objs.get(code, tmax=tmax, bits=bits + 64) if code.startswith('HEAT') else objs.get(code)
    ctx.prec = bits + 64
    _G['a'] = arb(a)

def _S(node):
    w = acb(arb(node[0]), arb(node[1])); a = _G['a']; o = _G['o']
    s = objs.X(o, w - a) / objs.X(o, w + a)
    return objs.enc(s)

def ldl(A, n):
    """in place on the lower triangle A[i][j], j <= i; returns list of (pivot arb)"""
    piv = []
    for k in range(n):
        d = A[k][k].real
        piv.append(d)
        if d.contains(0): break
        inv = 1 / d
        col = [A[i][k] for i in range(k + 1, n)]
        colc = [c.conjugate() * inv for c in col]
        for ii in range(n - k - 1):
            ci = col[ii]; Ai = A[k + 1 + ii]; base = k + 1
            for jj in range(ii + 1):
                Ai[base + jj] -= ci * colc[jj]
    return piv

def _kern(args):
    kern, nd, Senc, bits = args
    ctx.prec = bits
    t0 = time.time(); n = len(nd)
    eps = arb(0, 1) * (arb(2) ** (16 - bits))        # input radius: the S values were rounded to `bits` bits; |S| <= 2 at the nodes used
    S = [objs.dec(t) + acb(eps, eps) for t in Senc]; Sc = [s.conjugate() for s in S]
    W = [acb(arb(x), arb(y)) for x, y in nd]
    if kern == 'lin': ph = W
    else:
        Y = arb(kern.split(':')[1]); c = arb.pi() / (2 * Y); ph = [(c * w).sinh() for w in W]
    phc = [p.conjugate() for p in ph]
    A = [[(1 - S[i] * Sc[j]) / (ph[i] + phc[j]) for j in range(i + 1)] for i in range(n)]
    diag = [A[i][i].real for i in range(n)]
    piv = ldl(A, n)
    rho = []; und = None; signs = []
    for k, d in enumerate(piv):
        if d > 0: sg = 1
        elif d < 0: sg = -1
        else: und = k + 1; break
        r = d / abs(diag[k]) if not diag[k].contains(0) else d
        rho.append(float(abs(r).log().mid()) / math.log(10)); signs.append(sg)
    negidx = [k + 1 for k, s in enumerate(signs) if s < 0]
    return dict(kernel=kern, n=n, bits=bits, first_negative=negidx[0] if negidx else None, n_negative=len(negidx),
                negative_orders=negidx[:40], undetermined_at=und, determined=len(rho),
                log10_rho=[round(r, 3) for r in rho],
                diag_neg=[i + 1 for i in range(n) if diag[i] < 0][:40], seconds=round(time.time() - t0, 1))

def main():
    code, a, x0, x1, y0, y1, n, bits, out = sys.argv[1:10]; kerns = sys.argv[10:]
    n = int(n); bits = int(bits)
    nd = nodes(float(x0), float(x1), float(y0), float(y1), n)
    nw = int(os.environ.get('RH_WORKERS', '1'))
    print('pick: %s a=%s rect [%s,%s]x[%s,%s] n=%d bits=%d kernels %d; matrix memory per kernel ~ %.2f GB' %
          (code, a, x0, x1, y0, y1, n, bits, len(kerns), n * (n + 1) / 2 * 2 * (bits / 8 + 48) / 1e9), flush=True)
    t0 = time.time()
    tmax = 2 * max(abs(float(y0)), abs(float(y1))) + 40
    with Pool(nw, initializer=_init, initargs=(code, bits, a, tmax)) as p:
        Senc = p.map(_S, nd, chunksize=1)
    print('S values: %.1f s' % (time.time() - t0), flush=True)
    ctx.prec = bits
    absS = [float(abs(objs.dec(t)).mid()) for t in Senc]
    res = dict(code=code, a=a, rect=[x0, x1, y0, y1], n=n, bits=bits, max_abs_S=max(absS), n_abs_S_gt_1=sum(1 for v in absS if v > 1),
               first_abs_S_gt_1=next((i + 1 for i, v in enumerate(absS) if v > 1), None), kernels=[])
    with Pool(min(nw, len(kerns))) as p:
        for r in p.imap(_kern, [(k, nd, Senc, bits) for k in kerns]):
            res['kernels'].append(r)
            print(r['kernel'], 'first_neg', r['first_negative'], 'n_neg', r['n_negative'], 'undet', r['undetermined_at'],
                  'last log10 rho', r['log10_rho'][-1] if r['log10_rho'] else None, r['seconds'], 's', flush=True)
            json.dump(res, open(out, 'w'))
    json.dump(res, open(out, 'w'))
    print('done %.1f s' % (time.time() - t0), flush=True)

if __name__ == '__main__':
    main()
