# Combination 1: Epstein census. For every primitive reduced form (a,b,c), b >= 0, of discriminant -Dmax <= D < 0:
#   double-precision Weil-form onset a* (both sectors, route-44 floor convention), off-line zeros by ball arithmetic,
#   Euler-detector data (first ratio, multiplicity ratio). One JSON line per form.
import sys, os, json, math, time
for _k in ('VECLIB_MAXIMUM_THREADS', 'OMP_NUM_THREADS', 'OPENBLAS_NUM_THREADS', 'MKL_NUM_THREADS'): os.environ[_k] = '1'
import numpy as np
import wf, objs
DMIN = int(sys.argv[1]); DMAX = int(sys.argv[2]); OUT = sys.argv[3]; NB = int(os.environ.get('NB', 170)); TMAX = float(os.environ.get('TMAX', 60))
STAGES = [float(v) for v in os.environ.get('STAGES', '1.3,2.3,3.5,5.0,6.4').split(',')]
WORKERS = int(os.environ.get('RH_WORKERS', 2)); DOZ = int(os.environ.get('ZEROS', 1))
B = None

def work(job):
    D, form, h = job; t0 = time.time(); rec = dict(D=D, form=list(form), h=h)
    try:
        lo = 0.15; res = None
        for amax in STAGES:
            s = objs.spec_epstein(form, amax, 2e-5)
            res = B.onset(s, lo=lo, hi=amax, tol=0.01)
            rec['info'] = s['info']
            if res[1] is not None: break
            lo = amax
        rec.update(a_pos=res[0], a_neg=res[1], sector=res[2], lam=res[3], amax=amax)
    except Exception as e:
        rec['err_onset'] = repr(e)
    rec['secs'] = round(time.time() - t0, 1)
    return rec

def workz(job):
    D, form, h = job; t0 = time.time(); rec = dict(D=D, form=list(form), h=h)
    try:
        import epzeros
        rec['zeros'] = epzeros.first_offline(form, Tmax=TMAX, budget=float(os.environ.get('ZBUDGET', 240)))
    except Exception as e:
        rec['err_zeros'] = repr(e)
    return rec

def loadset(fn):
    done = set()
    if os.path.exists(fn):
        for l in open(fn):
            try: done.add(tuple(json.loads(l)['form']))
            except Exception: pass
    return done

def work2(job):
    D, form, h, need_onset = job
    r1 = work((D, form, h)) if need_onset else None
    r2 = None
    if h > 1:
        t0 = time.time(); r2 = dict(D=D, form=list(form), h=h)
        try:
            import epzeros
            r2['zeros'] = epzeros.first_offline(form, Tmax=TMAX, budget=float(os.environ.get('ZBUDGET', 90)), skip_if_real=True)
        except Exception as e:
            r2['err_zeros'] = repr(e)
    return r1, r2

if __name__ == '__main__':
    import random, glob, multiprocessing as mp
    BUDGET = float(os.environ.get('BUDGET', 6000)); T00 = time.time()
    KK = int(os.environ.get('SPLIT_K', 1)); RR = int(os.environ.get('SPLIT_R', 0))
    jobs = []
    for D in range(-DMIN, -DMAX - 1, -1):
        if D % 4 not in (0, 1): continue
        fs = objs.reduced_forms(D)
        if not fs: continue
        h = objs.class_number(D)
        for f in fs: jobs.append((D, f, h))
    print('forms: %d; h=1: %d; principal: %d; basis N=%d' % (len(jobs), sum(j[2] == 1 for j in jobs), sum(j[1][0] == 1 for j in jobs), NB), flush=True)
    random.Random(20261119).shuffle(jobs)      # fixed random order: a partial run is a random sample
    done = set(); donez = set()
    for fn in glob.glob('census*.jsonl'):
        (donez if 'zeros' in fn else done).update(loadset(fn))
    mine = [j for i, j in enumerate(jobs) if i % KK == RR]
    todo = [(D, f, h, f not in done) for (D, f, h) in mine if (f not in done) or (h > 1 and f not in donez)]
    todo.sort(key=lambda j: j[3])               # forms that already have an onset first (zeros only)
    print('unit %d/%d: %d jobs (%d need onset)' % (RR, KK, len(todo), sum(j[3] for j in todo)), flush=True)
    B = wf.Basis(NB, cache='.')
    def gen(js):
        for j in js:
            if time.time() - T00 > BUDGET: return
            yield j
    O1 = OUT.replace('.jsonl', '_%d.jsonl' % RR); O2 = OUT.replace('.jsonl', '-zeros_%d.jsonl' % RR)
    with mp.get_context('fork').Pool(WORKERS) as pool, open(O1, 'a') as f1, open(O2, 'a') as f2:
        for i, (r1, r2) in enumerate(pool.imap_unordered(work2, gen(todo), chunksize=1)):
            if r1: f1.write(json.dumps(r1) + '\n'); f1.flush()
            if r2: f2.write(json.dumps(r2) + '\n'); f2.flush()
            if i % 100 == 0: print('%d/%d  %.0fs' % (i, len(todo), time.time() - T00), flush=True)
    print('done %.0fs' % (time.time() - T00), flush=True)
