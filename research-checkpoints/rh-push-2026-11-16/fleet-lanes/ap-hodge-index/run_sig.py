# usage: run_sig.py <libdir> <h> <n> <ratio s/h> <dps> <obj,obj,...>
# nested family: Gaussians at x_j = j*h, j=0..n-1, width s = ratio*h.  Leading pivots of I = Prime - A.
import sys, time, mpmath as mp
sys.path.insert(0, sys.argv[1])
from hlib import *
import harch
n = int(sys.argv[3]); mp.mp.dps = int(sys.argv[5]); dps = mp.mp.dps
names = sys.argv[6].split(',')
h = mp.mpf(sys.argv[2]); r = mp.mpf(sys.argv[4])
s = r*h; v = 2*s*s; amp = s*mp.sqrt(mp.pi)
c = (n-1)*h
Nmax = int(mp.exp(reach_of(c, v, 1.2))) + 10
print('# h=%s n=%d s=%s cutoff c=%s dps=%d ; planned: %dx%d mp matrix (~%.1f MB), Lambda table %d entries' % (sys.argv[2], n, mp.nstr(s, 5), mp.nstr(c, 5), dps, n, n, n*n*dps/2e6, Nmax), flush=True)
assert Nmax < 3_000_000
O = make_objects(Nmax, min(Nmax, 60000) if 'DH' in names else 10)
base = {'DH': 0, 'EA_0.2': 2}
archtab = {}
def arch(z):
    key = mp.nstr(z, 20)
    if key not in archtab:
        t0 = time.time()
        archtab[key] = harch.table_uniform(z, v, h, n, dps)
        print('# arch table z=%s built in %.0fs' % (key, time.time()-t0), flush=True)
    return archtab[key]
G = [amp*mp.exp(-(j*h)**2/(2*v)) for j in range(n)]
if len(sys.argv) > 7:      # cross-check a few arch values against direct quadrature at low precision
    T = arch(mp.mpf(1)/4)
    mp.mp.dps = 50
    for j in (0, 1, n//2, n-1):
        print('# check arch j=%d  trapezoid %s  quad %s' % (j, mp.nstr(T[j]*amp*mp.sqrt(2*mp.pi*v), 30), mp.nstr(arch_int(mp.mpf(1)/4, j*h, v, amp), 30)))
    mp.mp.dps = dps
for nm in names:
    t0 = time.time(); obj = O[nm]
    K = []
    for j in range(n):
        d = j*h
        A = obj.cond*G[j]
        for z in obj.gam: A += arch(z)[j]*amp*mp.sqrt(2*mp.pi*v)
        N = int(mp.floor(mp.exp(reach_of(d, v, obj.growth))))+1
        if getattr(obj, 'pp', None) is None:
            obj.pp = []
            for q in range(2, Nmax+1):
                ln = obj.lamfun(q) if q < 60000 or nm != 'DH' else 0
                if ln != 0: obj.pp.append((mp.log(q), ln/mp.sqrt(q)))
        Pr = mp.mpf(0); lim = mp.log(N); i2v = 1/(2*v)
        for l, w in obj.pp:
            if l > lim: break
            Pr += w*(mp.exp(-(l-d)**2*i2v) + mp.exp(-(l+d)**2*i2v))
        K.append(Pr*amp - A)
    I = mp.zeros(n)
    for j in range(n):
        for k in range(n): I[j, k] = K[abs(j-k)]
    piv, done = pivots(I)
    b = base.get(nm, 1)
    cum = 0; first = None; hist = []
    for k, (sg, mid, ball) in enumerate(piv):
        if sg == 0: break
        if sg > 0:
            cum += 1; hist.append(k+1)
            if cum > b and first is None: first = k+1
    smallest = min(piv[:done], key=lambda t: abs(t[2].mid())) if done else None
    offneg = sum(1 for j in range(1, n) if K[j] < 0)
    print('%-12s base %d | determined %d/%d | i_+ final %d | first stage i_+ > base: %s (cutoff %s) | positive pivots at %s | smallest |pivot| %s | K(0)=%s, negative off-diagonal K(jh): %d of %d | %.0fs' % (
        nm, b, done, n, cum, first, mp.nstr((first-1)*h, 4) if first else '-', hist[:10], smallest[2].mid().str(4) if smallest else '-', mp.nstr(K[0], 4), offneg, n-1, time.time()-t0), flush=True)
