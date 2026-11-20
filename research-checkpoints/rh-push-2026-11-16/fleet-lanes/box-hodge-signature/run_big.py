# usage: run_big.py <obj> <h> <r> <n> <dps> <outdir>     (workers = $RH_WORKERS)
# Same object as run_u.py (uniform nested family, certified inertia of -Z), for cutoffs where the prime sum dominates:
# the prime sum over p <= N is split into segments and run on a fork pool (segmented sieve per segment); prime powers p^k, k >= 2,
# and everything else run in the parent.  zeta-type objects only (weights eps(p,k) Lambda(p^k)/sqrt(p^k)).
# Checkpoint: finished segments are appended to <tag>.segments (one JSON line each); a restart skips them.
import sys, os, json, time, math, resource
import multiprocessing as mp
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import bh
from flint import arb

G = {}
def seg_primes(lo, hi, base):
    """primes in (lo, hi], lo >= 2"""
    size = hi - lo
    sv = bytearray([1])*size                    # index i <-> lo+1+i
    for p in base:
        if p*p > hi: break
        st = max(p*p, ((lo + p)//p)*p)
        sv[st-lo-1::p] = bytes(len(range(st-lo-1, size, p)))
    return [lo+1+i for i in range(size) if sv[i]]

def work(seg):
    idx, lo, hi = seg
    h = G['h']; n = G['n']; R = G['R']; i2v = G['i2v']; eps = G['eps']; hf = G['hf']
    acc = {}
    cnt = 0
    for p in seg_primes(lo, hi, G['base']):
        e = eps(p, 1, p)
        if e is None: continue
        l = arb(p).log(); w = l*e/arb(p).sqrt(); lf = float(l.mid()); cnt += 1
        j0 = max(0, int(math.ceil((lf - R)/hf))); j1 = min(n-1, int(math.floor((lf + R)/hf)))
        for j in range(j0, j1+1):
            x = l - h*j
            acc[j] = acc.get(j, 0) + w*(-(x*x)*i2v).exp()
    d = G['dps']
    return idx, cnt, {j: (a.mid().str(d + 30, radius=False), float(a.rad())) for j, a in acc.items()}

if __name__ == '__main__':
    name, hs, rs, n, dps, outdir = sys.argv[1], sys.argv[2], sys.argv[3], int(sys.argv[4]), int(sys.argv[5]), sys.argv[6]
    W = int(os.environ.get('RH_WORKERS', '2'))
    os.makedirs(outdir, exist_ok=True)
    tag = '%s_h%s_r%s_n%d' % (name, hs, rs, n)
    fn = os.path.join(outdir, tag + '.json')
    if os.path.exists(fn):
        old = json.load(open(fn))
        if old.get('complete') or old['dps'] >= dps: print(tag, 'already done'); sys.exit(0)
    def log(m): print('[%s %s] %s' % (time.strftime('%H:%M:%S'), tag, m), flush=True)
    t0 = time.time()
    bh.setprec(dps); bh.STREAM_LIMIT = 0
    obj = bh.make_obj(name)
    h = arb(hs); s = h*arb(rs); v, amp, c0 = bh.consts(s)
    hf = float(hs); dmax = hf*(n-1)
    ps = bh.PrimeSide(obj, v, dmax, dps)        # streamed: no table; gives N, R and the proved radius
    N = ps.N; R = ps.R
    sq = int(math.isqrt(N)) + 1
    base = list(bh.prime_iter(sq))
    assert math.log(sq) > R + 0.1, 'mirror terms would be needed for primes above sqrt N'
    nseg = max(W*8, int(N/2e7) + 1)
    step = (N - sq)//nseg + 1
    segs = [(i, sq + i*step, min(N, sq + (i+1)*step)) for i in range(nseg) if sq + i*step < N]
    log('N=%d (X=e^%.2f, reach R=%.3f); %d segments of %d integers (sieve bytes per worker %d); planned: %d lags, %dx%d certificate ~ %.1f GB' % (
        N, dmax, R, len(segs), step, step, n, n, n, n*n*(5*(96 + dps*0.84) + 150)/1e9))
    G.update(h=h, n=n, R=R, i2v=ps.i2v, eps=obj.weights.eps, hf=hf, base=base, dps=dps)
    acc = [arb(0)]*n
    def add(j, m, r):
        acc[j] = acc[j] + arb(m) + arb(0, 1)*(arb(r)*1.0001 + abs(arb(m))*arb(10)**(-(dps + 25)))
    segfile = os.path.join(outdir, tag + '.segments')
    done = set(); nprimes = 0
    if os.path.exists(segfile):
        for line in open(segfile):
            try: rec = json.loads(line)
            except Exception: continue
            if rec['dps'] != dps or rec['nseg'] != len(segs): continue
            done.add(rec['idx']); nprimes += rec['cnt']
            for j, (m, r) in rec['acc'].items(): add(int(j), m, r)
        log('resumed %d segments from checkpoint' % len(done))
    # parent part: primes <= sq with all powers, and powers k >= 2 of them (p^2 <= N iff p <= sq)
    i2v = ps.i2v; eps = obj.weights.eps
    for p in base:
        lp = arb(p).log(); q = p; k = 1
        while q <= N:
            e = eps(p, k, q)
            if e is not None:
                w = lp*e/arb(q).sqrt(); l = lp*k; lf = float(l.mid())
                j0 = max(0, int(math.ceil((lf - R)/hf))); j1 = min(n-1, int(math.floor((lf + R)/hf)))
                for j in range(j0, j1+1):
                    x = l - h*j; acc[j] = acc[j] + w*(-(x*x)*i2v).exp()
                if lf < R:
                    for j in range(0, min(n-1, int(math.floor((R - lf)/hf))) + 1):
                        x = l + h*j; acc[j] = acc[j] + w*(-(x*x)*i2v).exp()
            q *= p; k += 1
    todo = [sg for sg in segs if sg[0] not in done]
    with mp.get_context('fork').Pool(W) as pool, open(segfile, 'a') as sf:
        for idx, cnt, part in pool.imap_unordered(work, todo, chunksize=1):
            sf.write(json.dumps(dict(idx=idx, cnt=cnt, dps=dps, nseg=len(segs), acc=part)) + '\n'); sf.flush()
            nprimes += cnt; done.add(idx)
            for j, (m, r) in part.items(): add(j, m, r)
            if len(done) % max(1, len(segs)//20) == 0: log('segments %d/%d, primes so far %d, %.0fs' % (len(done), len(segs), nprimes, time.time()-t0))
    Pr = [amp*(a + ps.rad) for a in acc]
    t1 = time.time(); log('prime side done: %d primes above sqrt N, %.0fs' % (nprimes, t1-t0))
    Ar = [obj.cond*amp*(-(h*j)**2/(2*v)).exp() for j in range(n)]
    for z in obj.gam:
        ar = bh.Arch(z, v, dmax, dps); t = ar.uniform(h, n, c0)
        Ar = [Ar[j] + t[j] for j in range(n)]
    mZ = [Pr[j] - Ar[j] - bh.pole_term(obj, h*j, v, c0) for j in range(n)]
    maxrad = max(float(x.rad()) for x in mZ)
    t2 = time.time(); log('arch done %.0fs; max entry radius %.2e' % (t2-t1, maxrad))
    rows = bh.levinson_mid(mZ)
    mcert, piv, worst = bh.certify(bh.toeplitz_mat(mZ), rows)
    pos = [i+1 for i in range(mcert) if piv[i] > 0]
    lg = [bh.log10abs(p) for p in piv[:mcert]]
    res = dict(obj=name, h=hs, r=rs, n=n, dps=dps, determined=mcert, complete=(mcert == n), done=True, base=obj.base, npoles=len(obj.poles),
               pos_pivot_stages=pos, n_neg=mcert-len(pos), first_pos=(pos[0] if pos else None), first_pos_cutoff=((pos[0]-1)*hf if pos else None),
               inertia_full_at_determined=[len(obj.poles) + len(pos), len(obj.poles) + mcert - len(pos)],
               log10_abs_pivot=[round(x, 2) for x in lg], min_log10_abs_pivot=min(lg), max_entry_radius=maxrad, gershgorin_max_rowsum=worst,
               N_prime_limit=N, primes_used=nprimes + len(base), t_table=round(t2-t0, 1), t_levinson=round(time.time()-t2, 1),
               maxrss_mb=resource.getrusage(resource.RUSAGE_SELF).ru_maxrss/(1024 if sys.platform != 'darwin' else 1048576), note='parallel prime sum (run_big.py)')
    json.dump(res, open(fn, 'w'))
    log('certified %d/%d, positive pivots %d, min log10|pivot| %.1f, total %.0fs' % (mcert, n, len(pos), min(lg), time.time()-t0))
