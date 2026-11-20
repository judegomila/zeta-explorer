"""s4 combination (3): Pick Gram of R_a(w) = X(w-a)/X(w+a) with all nodes at |Im w| <= H0; first detection of the ghost.
P_ij = (1 - R_i conj R_j)/(w_i + conj w_j). LDL pivots by the displacement recursion (lib.schur_cplx), Arb balls at <bits>.
A pivot ball strictly negative = certified negative square of the leading section. The run stops at the first pivot ball
containing 0 (precision exhausted) and reports the number of nodes decided.
usage: c3_lead.py <out.jsonl> <code> <a> <H0> <bits> <nmax> <mesh: box|geo> [planted delta:gamma ...] [--noplain]
mesh box: Halton(2,3) points of [0.05, 2] x [-H0, H0] in sequence order.
mesh geo: lattice x_j = 0.05 * 1.6^j (j = 0..15, up to 57.6), y_k = H0 (2 h_k - 1), h = van der Corput(2); ordered by (k, j) so
          every block of 16 nodes is a full x-column at a new height; 4096 nodes = 16 x 256.
"""
import sys, os, json, time, math
from multiprocessing import Pool
from flint import arb, acb, ctx, fmpz
import lib

def schur_mid(w, U, bits, margin=100):
    """midpoint version of lib.schur_cplx (MEASURED): radii are discarded after every operation; stops when a pivot falls
    below the rounding floor 2^-(bits - margin) relative to the diagonal entry."""
    n = len(w); M = lambda z: acb(z.real.mid(), z.imag.mid())
    a = [M(acb(u[0])) for u in U]; b = [M(acb(u[1])) for u in U]; w = [M(z) for z in w]
    p0 = [((a[i] * a[i].conjugate() - b[i] * b[i].conjugate()) / (w[i] + w[i].conjugate())).real.mid() for i in range(n)]
    out = []
    for k in range(n):
        ak = a[k].conjugate(); bk = b[k].conjugate(); wk = w[k].conjugate()
        d = ((a[k] * ak - b[k] * bk) / (w[k] + wk)).real.mid()
        r = (d / abs(p0[k])).mid()
        l2 = lib._log2(r)
        if l2 is None or l2 < -(bits - margin):
            out.append((k, 0, l2, None)); break
        out.append((k, 1 if r > 0 else -1, l2, None))
        dinv = 1 / d; a_k = a[k]; b_k = b[k]
        for i in range(k + 1, n):
            l = M((a[i] * ak - b[i] * bk) / (w[i] + wk) * dinv)
            a[i] = M(a[i] - l * a_k); b[i] = M(b[i] - l * b_k)
    return out

def pack(x):
    m, e = x.mid().man_exp(); rm, re_ = x.rad().man_exp()
    return (int(m), int(e), int(rm), int(re_))
def unpack(t):
    m = arb(fmpz(t[0])) * (arb(2) ** fmpz(t[1])) if t[0] else arb(0)
    if not t[2]: return m
    r = arb(fmpz(t[2])) * (arb(2) ** fmpz(t[3]))
    return m + arb(0, 1) * r      # ball [m - r, m + r]

def halton(i, b):
    f = 1.0; r = 0.0
    while i > 0:
        f /= b; r += f * (i % b); i //= b
    return r

def nodes(mesh, n, H0):
    if mesh == 'box':
        return [(0.05 + 1.95 * halton(i + 1, 2), -H0 + 2 * H0 * halton(i + 1, 3)) for i in range(n)]
    out = []
    k = 0
    while len(out) < n:
        y = H0 * (2 * halton(k + 1, 2) - 1)
        for j in range(16): out.append((0.05 * 1.6 ** j, y))
        k += 1
    return out[:n]

def work(args):
    code, a, x, y, bits = args
    ctx.prec = bits + 64
    o = lib.get(code)
    r = lib.ratio(o, acb(arb(x), arb(y)), a)
    return (x, y), (pack(r.real), pack(r.imag))

def main():
    a_ = [x for x in sys.argv[1:] if not x.startswith('--')]
    out, code, a, H0, bits, nmax, mesh = a_[0], a_[1], a_[2], float(a_[3]), int(a_[4]), int(a_[5]), a_[6]
    planted = ([] if '--noplain' in sys.argv else [None]) + a_[7:]; MID = '--mid' in sys.argv
    todo = list(planted); res = {}
    n = min(256, nmax); t0 = time.time()
    pool = Pool(int(os.environ.get('RH_WORKERS', '4')))
    done = {}
    while todo:
        pts = nodes(mesh, n, H0)
        new = [p for p in pts if p not in res]
        res.update(dict(pool.imap_unordered(work, [(code, a, x, y, bits) for x, y in new], chunksize=2)))
        ctx.prec = bits + 64
        w = [acb(arb(x), arb(y)) for x, y in pts]
        R0 = [acb(unpack(res[p][0]), unpack(res[p][1])) for p in pts]
        ctx.prec = bits
        aa = arb(a); nxt = []
        for spec in todo:
            if spec is None: R = R0; label = code
            else:
                d, g = spec.split(':'); lam = acb(arb(g), -arb(d)); lam = lam * lam
                def Q(z):
                    z2 = z * z; return (z2 + lam) * (z2 + lam.conjugate())
                R = [R0[i] * Q(w[i] - aa) / Q(w[i] + aa) for i in range(n)]
                label = 'PL:%s:%s:%s' % (code, d, g)
            t1 = time.time()
            piv = schur_mid(w, [(acb(1), r) for r in R], bits) if MID else lib.schur_cplx(w, [(acb(1), r) for r in R])
            negs = [(p[0] + 1, round(p[2], 1)) for p in piv if p[1] < 0]
            und = [p[0] for p in piv if p[1] == 0]
            decided = und[0] if und else n
            if not negs and not und and n < nmax:
                nxt.append(spec); continue
            l2 = [p[2] for p in piv if p[2] is not None]
            rec = dict(mode=('mid' if MID else 'ball'), code=label, a=a, H0=H0, mesh=mesh, bits=bits, n=n, decided_up_to=decided, index=len(negs),
                       first_negative=(negs[0] if negs else None), negatives=negs[:8], min_log2_pivot=round(min(l2), 1),
                       last_log2_pivot=round(l2[-1], 1), max_abs_R=max(float(abs(r).mid()) for r in R),
                       sec=round(time.time() - t0, 1), schur_sec=round(time.time() - t1, 1))
            open(out, 'a').write(json.dumps(rec) + '\n'); print(json.dumps(rec), flush=True)
        todo = nxt; n = min(2 * n, nmax)
    pool.close()

if __name__ == '__main__':
    main()
