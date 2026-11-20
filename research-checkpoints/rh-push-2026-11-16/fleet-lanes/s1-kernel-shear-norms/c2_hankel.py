import sys, os, json, math, time
import numpy as np
import hlib, klib
def log(s): print(s, flush=True)
name = sys.argv[1]; a = float(os.environ.get('A', 0.25)); l = float(sys.argv[2]); h = float(sys.argv[3])
cshift = float(os.environ.get('CSHIFT', 2.0)); J = int(os.environ.get('J', 12))
nwin = int(os.environ.get('NWIN', 12))
N = 0 if name.startswith('heat') else int(math.exp(2*l)) + 2
t0 = time.time()
log('object %s a=%g l=%g (L=%.4f) h=%g N=%d GPU=%s; planned: coeff arrays %.2f GB, matrix %.2f GB' % (name, a, l, math.exp(l), h, N, hlib.GPU, 5*8*N/1e9, 3*8*(2*l/h)**2/1e9))
Afun, c, real = hlib.make_object(name, a, N)
if c is not None: log('coefficients done %.0fs; c[1..8]=%s max|c|=%.3e' % (time.time() - t0, np.array2string(np.asarray(c[1:9]), precision=5), np.abs(c).max()))
u, m, info = hlib.hankel_sequence(Afun, c, a, l, h, cshift=cshift, J=J, guard=float(os.environ.get('GUARD', 10.0)), log=log)
log('sequence done %.0fs %s; max|Im m|=%.2e max|m|=%.3e' % (time.time() - t0, info, np.abs(m.imag).max(), np.abs(m).max()))
wl = os.environ.get('WINDOWS')
if wl: windows = [float(x) for x in wl.split(',')]
else: windows = [l*(i + 1)/nwin for i in range(nwin)]
res = hlib.window_norms(m, l, h, windows, real=real, log=log)
out = {'name': name, 'a': a, 'l': l, 'h': h, 'N': N, 'cshift': cshift, 'J': J, 'info': info, 'windows': res, 'secs': time.time() - t0,
       'm_head': [[float(x), float(y.real)] for x, y in zip(u[::max(1, len(u)//400)], m[::max(1, len(u)//400)])]}
tag = os.environ.get('TAG', '')
json.dump(out, open(os.path.join(klib.HERE, 'out', 'c2_%s_l%g_h%g%s.json' % (name, l, h, tag)), 'w'))
log('done %.0fs' % (time.time() - t0))
