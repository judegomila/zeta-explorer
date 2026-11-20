"""Combination (3): negative index of the Pick matrix of R_a(w) = F(w-a)/F(w+a) on nested nodes in a box.
usage: run_index.py <out.jsonl> <code> <a> <Y0> <Y> <n> <bits> [planted delta:gamma ...] [--noplain] [--xlo=0.05] [--xhi=2]
Nodes: Halton(2,3) points of [xlo, xhi] x [Y0 - Y, Y0 + Y], in sequence order, so the pivot list of one run gives the
index of every leading section. Negative pivots counted until the first pivot ball that contains 0 (precision exhausted)."""
import sys, os, json, time, math, pickle
from multiprocessing import Pool
from flint import arb, acb, ctx, fmpz
import lib
from run_pick import pack, unpack

def halton(i, b):
    f = 1.0; r = 0.0
    while i > 0:
        f /= b; r += f * (i % b); i //= b
    return r

def nodes(n, Y0, Y, xlo, xhi):
    return [(xlo + (xhi - xlo) * halton(i + 1, 2), Y0 - Y + 2 * Y * halton(i + 1, 3)) for i in range(n)]

def work(args):
    code, a, x, y, bits = args
    ctx.prec = bits + 64
    o = lib.get(code)
    r = lib.ratio(o, acb(x, y), a)
    return (x, y), (pack(r.real), pack(r.imag))

def winding(code, a, Y, xhi=2.0, bits=128):
    """number of zeros of F in a < Re w < xhi + a, |Im w| < Y (argument principle, Arb integration)."""
    ctx.prec = bits
    o = lib.get(code); a = float(a)
    f = lambda w, _: lib.logder(o, w)
    c = [acb(a, -Y), acb(xhi + a, -Y), acb(xhi + a, Y), acb(a, Y), acb(a, -Y)]
    tot = acb(0)
    for p, q in zip(c[:-1], c[1:]): tot += acb.integral(f, p, q, rel_tol=2.0 ** -40)
    return tot / (2 * acb.pi() * acb(0, 1))

def main():
    a_ = [x for x in sys.argv[1:] if not x.startswith('--')]
    opt = dict(x[2:].split('=') for x in sys.argv[1:] if x.startswith('--') and '=' in x)
    out, code, a, Y0, Y, n, bits = a_[0], a_[1], a_[2], float(a_[3]), float(a_[4]), int(a_[5]), int(a_[6])
    planted = ([] if '--noplain' in sys.argv else [None]) + a_[7:]
    xlo = float(opt.get('xlo', 0.05)); xhi = float(opt.get('xhi', 2.0))
    pts = nodes(n, Y0, Y, xlo, xhi)
    os.makedirs('cache', exist_ok=True)
    fn = 'cache/R_%s_%s_%g_%g_%d_%d_%g_%g.pkl' % (code.replace('/', '_').replace(':', '_'), a, Y0, Y, n, bits, xlo, xhi)
    t0 = time.time()
    if os.path.exists(fn): res = pickle.load(open(fn, 'rb'))
    else:
        with Pool(int(os.environ.get('RH_WORKERS', '4'))) as pool:
            res = dict(pool.imap_unordered(work, [(code, a, x, y, bits) for x, y in pts], chunksize=2))
        pickle.dump(res, open(fn, 'wb'))
    tv = time.time() - t0
    ctx.prec = bits + 64
    w = [acb(x, y) for x, y in pts]
    R0 = [acb(unpack(res[p][0]), unpack(res[p][1])) for p in pts]
    ctx.prec = bits
    aa = arb(a)
    for spec in planted:
        if spec is None: R = R0; label = code
        else:
            d, g = spec.split(':'); lam = acb(arb(g), -arb(d)); lam = lam * lam
            def Q(z):
                z2 = z * z; return (z2 + lam) * (z2 + lam.conjugate())
            R = [R0[i] * Q(w[i] - aa) / Q(w[i] + aa) for i in range(n)]
            label = 'PL:%s:%s:%s' % (code, d, g)
        t1 = time.time()
        piv = lib.schur_cplx(w, [(acb(1), r) for r in R])
        s = lib.summarize(piv, n)
        negs = [(p[0] + 1, round(p[2], 1)) for p in piv if p[1] < 0]
        maxabsR = max(float(abs(r).mid()) for r in R)
        rec = dict(code=label, a=a, Y0=Y0, Y=Y, xlo=xlo, xhi=xhi, bits=bits, n=n, decided_up_to=(s['undecided_at'] if s['undecided_at'] is not None else n),
                   index=len(negs), negative_pivots_n_log2=negs[:12], max_abs_R_at_nodes=maxabsR,
                   profile=[(p[0], round(p[2], 1) if p[2] is not None else None, round(p[3], 1) if p[3] is not None else None) for p in piv[::max(1, len(piv) // 16)]],
                   values_sec=round(tv, 1), schur_sec=round(time.time() - t1, 1))
        open(out, 'a').write(json.dumps(rec) + '\n')
        print(json.dumps(rec), flush=True)

if __name__ == '__main__':
    if sys.argv[1] == 'winding':
        for Y in [float(v) for v in sys.argv[4:]]:
            v = winding(sys.argv[2], sys.argv[3], Y)
            print(json.dumps(dict(winding=True, code=sys.argv[2], a=sys.argv[3], Y=Y, count=float(v.real.mid()), rad=float(v.real.rad()))), flush=True)
    else: main()
