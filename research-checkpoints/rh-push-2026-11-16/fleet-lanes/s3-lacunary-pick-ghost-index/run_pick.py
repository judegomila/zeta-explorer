"""Combinations (1) and (2): Pick matrix of L = F'/F on real node families, by the Schur recursion in ball arithmetic.
usage: run_pick.py <out.jsonl> <family> <n> <bits> <code> [planted specs delta:gamma ...] [--lmin] [--all]
  family: geo:<m>  nodes 2^(k/m), k = 0..n-1      pow:<p>  nodes k^p, k = 1..n
  code:   object code of lib.get; planted specs add one off-line quadruple to the base object (base values reused).
Precision is doubled (up to 3 times) when a pivot ball contains 0."""
import sys, os, json, time, math, pickle
from multiprocessing import Pool
from flint import arb, acb, ctx, fmpz
import lib

def pack(x):
    m, e = x.mid().man_exp(); rm, re_ = x.rad().man_exp()
    return (int(m), int(e), int(rm), int(re_))
def unpack(t):
    m = arb(fmpz(t[0])) * (arb(2) ** fmpz(t[1])) if t[0] else arb(0)
    r = arb(fmpz(t[2])) * (arb(2) ** fmpz(t[3])) if t[2] else arb(0)
    return m + arb(0, float(r.upper()) if float(r.upper()) > 0 else 0) if float(r.upper()) > 0 else m

def node(family, k, bits):
    ctx.prec = bits + 64
    kind, par = family.split(':')
    if kind == 'geo':
        return (arb(2).log() * k / int(par)).exp()
    p = arb(par)
    return (p * arb(k + 1).log()).exp()

def work(args):
    code, family, k, bits = args
    ctx.prec = bits + 64
    o = lib.get(code)
    nu = node(family, k, bits)
    c = lib.logder(o, nu).real
    return k, pack(c)

def values(code, family, n, bits, pool):
    os.makedirs('cache', exist_ok=True)
    fn = 'cache/%s_%s_%d_%d.pkl' % (code.replace('/', '_').replace(':', '_'), family.replace(':', '_'), n, bits)
    if os.path.exists(fn):
        return pickle.load(open(fn, 'rb'))
    t = time.time()
    res = dict(pool.imap_unordered(work, [(code, family, k, bits) for k in range(n)], chunksize=4))
    out = [res[k] for k in range(n)]
    pickle.dump(out, open(fn, 'wb'))
    print('  values', code, family, n, bits, 'sec %.1f' % (time.time() - t), flush=True)
    return out

def lmin_inverse_iteration(nu, c, bits):
    """lambda_min of the normalised matrix M = S P S (unit diagonal) by LDL + inverse iteration (midpoint arithmetic; MEASURED)."""
    n = len(nu); x = list(c); y = [arb(1)] * n; Lc = []; D = []
    for k in range(n):
        xk = x[k]; yk = y[k]; d = xk * yk / nu[k]; D.append(arb(d.mid())); dinv = 1 / d; col = []
        for i in range(k + 1, n):
            l = (x[i] * yk + y[i] * xk) / (nu[i] + nu[k]) * dinv
            x[i] = x[i] - l * xk; y[i] = y[i] - l * yk; col.append(arb(l.mid()))
        Lc.append(col)
    S = [arb((nu[i] / c[i]).sqrt().mid()) for i in range(n)]
    v = [arb(1)] * n; lam = None
    for it in range(8):
        z = [v[i] / S[i] for i in range(n)]
        for k in range(n):                     # L z' = z
            zk = z[k]; col = Lc[k]
            for i in range(k + 1, n): z[i] = z[i] - col[i - k - 1] * zk
        z = [z[i] / D[i] for i in range(n)]
        for k in range(n - 1, -1, -1):         # L^T z'' = z'
            s = z[k]; col = Lc[k]
            for i in range(k + 1, n): s = s - col[i - k - 1] * z[i]
            z[k] = arb(s.mid())
        z = [z[i] / S[i] for i in range(n)]
        nrm = sum((t * t for t in z), arb(0)).sqrt(); nv = sum((t * t for t in v), arb(0)).sqrt()
        new = float((nv / nrm).mid().log().mid()) / math.log(2) if nrm > 0 else None
        v = [arb((t / nrm).mid()) for t in z]
        if lam is not None and new is not None and abs(new - lam) < 1e-6: lam = new; break
        lam = new
    return lam

def horizon(h, rc):
    """T with T log(T/2pi) = 2 pi^2 rc / h (b-lacunary-threshold law), bisection on T > 2 pi"""
    target = 2 * math.pi ** 2 * rc / h; lo = 2 * math.pi; hi = 1e30
    for _ in range(200):
        mid = math.sqrt(lo * hi)
        if mid * math.log(mid / (2 * math.pi)) < target: lo = mid
        else: hi = mid
    return lo

def run(out, family, n, bits, code, planted, want_lmin, pool, full=False, maxatt=4):
    for attempt in range(maxatt):
        t0 = time.time()
        ctx.prec = bits + 64
        base = [unpack(t) for t in values(code, family, n, bits, pool)]
        nu = [node(family, k, bits) for k in range(n)]
        ctx.prec = bits
        retry = False
        for spec in planted:
            if spec is None: c = base; label = code
            else:
                d, g = spec.split(':'); lam = acb(arb(g), -arb(d)); lam = lam * lam
                c = [base[k] + (2 * nu[k] / (nu[k] * nu[k] + lam)).real * 2 for k in range(n)]
                label = 'PL:%s:%s:%s' % (code, d, g)
            t1 = time.time()
            piv = lib.schur_real(nu, c, stop_at_negative=not full)
            s = lib.summarize(piv, n)
            if s['undecided_at'] is not None and attempt < maxatt - 1:
                print('  undecided', label, family, n, bits, 'at', s['undecided_at'], '-> double precision', flush=True); retry = True; break
            rec = dict(code=label, family=family, bits=bits, schur_sec=round(time.time() - t1, 1), **s)
            fn = s['first_negative']
            if fn is not None: rec['first_negative_node'] = float(nu[fn].mid())
            rec['nu_max'] = float(nu[-1].mid())
            # decay profile: log2 pivot at a few indices
            rec['profile'] = [(p[0], round(p[2], 1) if p[2] is not None else None) for p in piv[::max(1, len(piv) // 24)]]
            if family.startswith('geo'):
                h = math.log(2) / int(family[4:]); rec['h'] = h; rec['law_T_rc0.5'] = horizon(h, 0.5); rec['law_T_rc0.7'] = horizon(h, 0.7)
            if want_lmin and s['negatives'] == 0 and s['undecided_at'] is None:
                rec['log2_lambda_min'] = lmin_inverse_iteration(nu, c, bits)
            open(out, 'a').write(json.dumps(rec) + '\n')
            print(json.dumps({k: v for k, v in rec.items() if k != 'profile'}), flush=True)
        if not retry: return
        bits *= 2

if __name__ == '__main__':
    a = [x for x in sys.argv[1:] if not x.startswith('--')]
    out, family, n, bits, code = a[0], a[1], int(a[2]), int(a[3]), a[4]
    planted = [None] + a[5:] if '--noplain' not in sys.argv else a[5:]
    with Pool(int(os.environ.get('RH_WORKERS', '4'))) as pool:
        run(out, family, n, bits, code, planted, '--lmin' in sys.argv, pool, '--all' in sys.argv, 1 if '--nodouble' in sys.argv else 4)
