# Re-run of the Epstein onsets with the exponentially tilted atom computation (objs.epstein_atoms, tilt=True) for the forms listed in
# fix_list.json (those whose untilted FFT step had a growth exponent (sg0 - 1/2) * 2 amax > 5). Output overrides the first-pass records.
import sys, os, json, time
for _k in ('VECLIB_MAXIMUM_THREADS', 'OMP_NUM_THREADS', 'OPENBLAS_NUM_THREADS', 'MKL_NUM_THREADS'): os.environ[_k] = '1'
sys.argv = [sys.argv[0], '3', '2000', 'census.jsonl'] + sys.argv[1:]
import census_epstein as ce, wf
K = int(sys.argv[4]); R = int(sys.argv[5])
todo = [(D, tuple(f), h) for i, (f, D, h, sg0, amax, an) in enumerate(json.load(open(os.environ.get('FIXLIST', 'fix_list.json')))) if i % K == R]
todo.sort(key=lambda j: -j[1][0])
ce.B = wf.Basis(ce.NB, cache='.')
import multiprocessing as mp
t0 = time.time()
with mp.get_context('fork').Pool(ce.WORKERS) as pool, open(os.environ.get('FIXOUT', 'census_zfix') + '_%d.jsonl' % R, 'w') as fo:
    for i, rec in enumerate(pool.imap_unordered(ce.work, todo, chunksize=1)):
        rec['tilt'] = True; fo.write(json.dumps(rec) + '\n'); fo.flush()
        if i % 100 == 0: print(i, len(todo), '%.0fs' % (time.time() - t0), flush=True)
print('done %.0fs' % (time.time() - t0), flush=True)
