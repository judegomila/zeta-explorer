# usage: run_pp.py <tasks.txt> <outdir>     (row workers = $RH_WORKERS)
# task line: obj P X s dps0 dpsmax
# Prime-power family: classes D_q, q = 1 and q = p^k <= X with p <= P (ordered by q), Gaussian of width s at log q; fibre classes eliminated
# analytically (bh.py header): certified inertia of M = (-Z)(log q - log q') on the nested family (leading blocks = smaller cutoffs).
import sys, os, json, time, math, bisect, resource
import multiprocessing as mp
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import bh
from flint import arb, arb_mat
bh.STREAM_LIMIT = 10**10          # this runner needs the weight table in memory (planned size printed below)
bh.TABLE_CAP = 3000000

G = {}
def row(j):
    xs = G['xs']; ar = G['arch']; ps = G['ps']; obj = G['obj']; v = G['v']; amp = G['amp']; c0 = G['c0']
    logs = G['logs']; W = ps.W; R = ps.R; i2v = ps.i2v
    out = []
    for k in range(j+1):
        d = xs[j] - xs[k]
        df = float(d.mid())
        acc = arb(0)
        lo = bisect.bisect_left(logs, df - R); hi = bisect.bisect_right(logs, df + R)
        for i in range(lo, hi):
            x = W[i][2] - d; acc += W[i][1]*(-(x*x)*i2v).exp()
        hi2 = bisect.bisect_right(logs, R - df)
        for i in range(0, hi2):
            x = W[i][2] + d; acc += W[i][1]*(-(x*x)*i2v).exp()
        Pr = amp*(acc + ps.rad)
        Ar = obj.cond*amp*(-(d*d)/(2*v)).exp()
        for a in ar: Ar += a.at(d, c0)
        e = Pr - Ar - bh.pole_term(obj, d, v, c0)
        # the decimal string of the midpoint is rounded at dps+20 digits: that rounding is added to the radius
        out.append((e.mid().str(G['dps']+20, radius=False), float(e.rad())*1.0001 + float(abs(e.mid()).upper())*10.0**(-(G['dps']+15)) + 1e-300))
    return j, out

def run_task(line, outdir, workers):
    name, P, X, s_str, dps0, dpsmax = line.split(); P = int(P); X = int(X); dps = int(dps0); dpsmax = int(dpsmax)
    tag = '%s_P%d_X%d_s%s' % (name, P, X, s_str)
    fn = os.path.join(outdir, tag + '.json')
    if os.path.exists(fn):
        res = json.load(open(fn))
        if res.get('done'): return tag + ' (already done)'
        dps = max(dps, int(res['dps']*1.6))
    qs = [1] + [q for q, p, k in bh.prime_powers(X) if p <= P]
    n = len(qs)
    while True:
        t0 = time.time()
        bh.setprec(dps)
        obj = bh.make_obj(name)
        s = arb(s_str); v, amp, c0 = bh.consts(s)
        xs = [arb(q).log() for q in qs]
        dmax = math.log(X)
        L_, _ = bh.table_limit(dmax, float(v.mid()), dps, obj.growth)
        print('[%s dps=%d] planned weight table: integers up to %.3g (sieve list ~ %.0f MB)' % (tag, dps, math.exp(L_), math.exp(L_)*40/1e6), flush=True)
        assert math.exp(L_) < 2e7, 'weight table too large for this runner'
        ps = bh.PrimeSide(obj, v, dmax, dps)
        arch = [bh.Arch(z, v, dmax, dps) for z in obj.gam]
        print('[%s dps=%d] n=%d classes; planned: %d entries, each a %d-term trapezoid sum + <= %d prime terms; matrices ~ %.0f MB' % (
            tag, dps, n, n*(n+1)//2, arch[0].K, len(ps.W), n*n*(5*(96 + dps*0.84) + 100)/1e6), flush=True)
        G.update(xs=xs, arch=arch, ps=ps, obj=obj, v=v, amp=amp, c0=c0, logs=[float(w[2].mid()) for w in ps.W], dps=dps)
        M = [[None]*n for _ in range(n)]
        maxrad = 0.0
        with mp.get_context('fork').Pool(workers) as pool:
            for j, out in pool.imap_unordered(row, range(n), chunksize=1):
                for k, (m, r) in enumerate(out):
                    e = arb(m) + arb(0, 1)*arb(r)
                    M[j][k] = M[k][j] = e
                    maxrad = max(maxrad, r)
        t1 = time.time()
        L = bh.ldl_mid(M)
        Xm = arb_mat(n, n, [x for r_ in L for x in r_]).inv()
        Xrows = [[Xm[i, j].mid() for j in range(i+1)] for i in range(n)]
        mcert, piv, worst = bh.certify(arb_mat(n, n, [x for r_ in M for x in r_]), Xrows)
        t2 = time.time()
        pos = [i+1 for i in range(mcert) if piv[i] > 0]
        lg = [bh.log10abs(p) for p in piv[:mcert]]
        res = dict(obj=name, P=P, X=X, s=s_str, n=n, dps=dps, determined=mcert, complete=(mcert == n), done=(mcert == n) or dps >= dpsmax,
                   npoles=len(obj.poles), classes=qs, pos_pivot_stages=pos, pos_pivot_q=[qs[i-1] for i in pos],
                   first_pos_q=(qs[pos[0]-1] if pos else None), n_neg=mcert - len(pos),
                   inertia_full_at_determined=[len(obj.poles) + len(pos), len(obj.poles) + mcert - len(pos)],
                   log10_abs_pivot=[round(x, 2) for x in lg], min_log10_abs_pivot=(min(lg) if lg else None),
                   max_entry_radius=maxrad, gershgorin_max_rowsum=worst, t_entries=round(t1-t0, 1), t_cert=round(t2-t1, 1),
                   maxrss_mb=resource.getrusage(resource.RUSAGE_SELF).ru_maxrss/(1024 if sys.platform != 'darwin' else 1048576), note=obj.note)
        json.dump(res, open(fn + '.tmp', 'w')); os.replace(fn + '.tmp', fn)
        print('[%s dps=%d] certified %d/%d, positive pivots %d (first at q=%s), min log10|pivot| %s, entries %.0fs cert %.0fs' % (
            tag, dps, mcert, n, len(pos), res['first_pos_q'], res['min_log10_abs_pivot'], t1-t0, t2-t1), flush=True)
        if res['done']: break
        dps = min(dpsmax, int(dps*1.6))
    return tag

if __name__ == '__main__':
    if sys.argv[1] == '--one':
        os.makedirs(sys.argv[3], exist_ok=True)
        print(time.strftime('%H:%M:%S'), 'finished', run_task(sys.argv[2], sys.argv[3], int(os.environ.get('PP_WORKERS', '1'))), flush=True); sys.exit(0)
    tasks = [l.strip() for l in open(sys.argv[1]) if l.strip() and not l.startswith('#')]
    out = sys.argv[2]; os.makedirs(out, exist_ok=True)
    W = int(os.environ.get('RH_WORKERS', '2'))
    for t in tasks:
        try:
            print(time.strftime('%H:%M:%S'), 'finished', run_task(t, out, W), flush=True)
        except Exception as e:
            import traceback; traceback.print_exc(); print('FAILED', t, flush=True)
    print('ALL DONE', flush=True)
