"""run the job list with a fixed number of single-thread worker slots."""
import sys, subprocess, time, os
jobs = [l.strip() for l in open(sys.argv[1]) if l.strip() and not l.startswith('#')]
slots = int(sys.argv[2])
env = dict(os.environ, OMP_NUM_THREADS='1', OPENBLAS_NUM_THREADS='1', MKL_NUM_THREADS='1', RH_WORKERS='1', SFS_NOGPU='1', SFS_ELEMS='1.5e7')
run = []; t0 = time.time(); k = 0
while jobs or run:
    while jobs and len(run) < slots:
        c = jobs.pop(0); k += 1
        out = c.split()[5]
        if os.path.exists(out):
            print('skip', c, flush=True); continue
        run.append((c, subprocess.Popen(['python'] + c.split(), env=env, stdout=open(out + '.log', 'w'), stderr=subprocess.STDOUT)))
        print('%.0f s start %d: %s' % (time.time() - t0, k, c), flush=True)
    time.sleep(2)
    for c, p in list(run):
        if p.poll() is not None:
            print('%.0f s done rc=%s: %s' % (time.time() - t0, p.returncode, c), flush=True)
            run.remove((c, p))
print('ALL DONE %.0f s' % (time.time() - t0), flush=True)
