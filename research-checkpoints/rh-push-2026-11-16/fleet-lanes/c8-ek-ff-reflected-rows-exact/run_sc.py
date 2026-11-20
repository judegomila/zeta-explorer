"""Exact Moebius sums S_cop(k), k = 0..d, for every (q, N, lam, d) present in results_q*.txt (real weights). Local, single thread; writes sc_results.txt."""
import subprocess, glob, os
import genjobs
HERE = os.path.dirname(os.path.abspath(__file__))
cfgs = set()
for fn in glob.glob(os.path.join(HERE, 'results_q*.txt')):
    for line in open(fn):
        if line.startswith('EN '):
            h = line.split(); cfgs.add((int(h[1]), int(h[3]), int(h[4]), int(h[2])))
done = set()
out = os.path.join(HERE, 'sc_results.txt')
if os.path.exists(out):
    for line in open(out):
        h = line.split(); done.add((int(h[1]), int(h[3]), int(h[4]), int(h[2])))
f = open(out, 'a')
for (q, N, lam, d) in sorted(cfgs - done):
    W = genjobs.weights(q); args = []
    for n, w in W.items():
        if w[0] in (1, 5): continue
        args += [str(x) for x in w] + ['0']
    r = subprocess.run([os.path.join(HERE, 'ffx'), 'sc', str(q), str(d), str(N), str(lam)] + args, capture_output=True, text=True)
    f.write(r.stdout); f.flush()
print('configs', len(cfgs), 'new', len(cfgs - done))
