#!/usr/bin/env python3
"""preflight.py: runs pf_one.py for all 36 floors (4 at a time) and the consumer self-test; writes run/preflight.json."""
import os, sys, json, subprocess, time
from concurrent.futures import ThreadPoolExecutor
B = os.path.dirname(os.path.abspath(__file__)); F36 = json.load(open(B + '/floors36.json'))
env = dict(os.environ, OMP_NUM_THREADS='1', OPENBLAS_NUM_THREADS='1', MKL_NUM_THREADS='1')


def one(i):
    p = subprocess.run([sys.executable, '-B', B + '/pf_one.py', str(i)], capture_output=True, text=True, env=env)
    try: r = json.loads(p.stdout.strip().split('\n')[-1])
    except Exception: r = dict(idx=i, error=(p.stdout + p.stderr)[-1500:])
    r['rc'] = p.returncode; print(json.dumps(r), flush=True); return r


t0 = time.time()
with ThreadPoolExecutor(4) as ex: R = list(ex.map(one, sorted(int(k) for k in F36)))
ok = [r for r in R if 'error' not in r and r['rc'] == 0 and r['K0_equal'] and r['cnt']['exc'] == 0]
out = dict(floors=len(R), ok=len(ok), failed=[r['idx'] for r in R if r not in ok], max_rss_gb=max((r['maxrss_gb'] for r in ok), default=None),
           secs=time.time() - t0, rows=R)
t1 = time.time()
p = subprocess.run([sys.executable, '-B', B + '/consume.py', '--selftest'], capture_output=True, text=True)
out['consumer_selftest'] = p.stdout.strip().split('\n')[-1]; out['consumer_rc'] = p.returncode; out['consumer_secs'] = time.time() - t1
if p.returncode: out['consumer_err'] = (p.stdout + p.stderr)[-1500:]
json.dump(out, open(B + '/run/preflight.json', 'w'), indent=1)
print('PREFLIGHT ok %d/%d failed %s max_rss_gb %s consumer %s (%.0fs)' % (len(ok), len(R), out['failed'], out['max_rss_gb'], out['consumer_selftest'], out['consumer_secs']))
