# usage: run_div.py <libdir> <N> <s> <dps> [integers]
# "Divisor-class" space: H, V (wide Gaussians, width 1, centres 0 and log N), e_1, and e_q for prime powers q <= N
# (or all integers 2..N with the flag), e_q = Gaussian of width s at log q.   Form I = Prime - A = P - Z.
import sys, time, mpmath as mp
sys.path.insert(0, sys.argv[1])
from hlib import *
import harch
N = int(sys.argv[2]); s = mp.mpf(sys.argv[3]); mp.mp.dps = int(sys.argv[4]); dps = mp.mp.dps
allint = len(sys.argv) > 5
L = mangoldt_table(max(N, 10))
qs = [1] + [q for q in range(2, N+1) if allint or L[q] != 0]
xs = [mp.mpf(0), mp.log(N)] + [mp.log(q) for q in qs]
ss = [mp.mpf(1), mp.mpf(1)] + [s]*len(qs)
n = len(xs)
v = 2*s*s
Nmax = int(mp.exp(reach_of(mp.log(N), v, 1.2))) + 10
print('# N=%d classes: H,V + %d point classes, s=%s dps=%d ; planned %dx%d matrix, Lambda table %d' % (N, len(qs), sys.argv[3], dps, n, n, Nmax), flush=True)
O = make_objects(Nmax, 10)
zeros = [mp.im(mp.zetazero(k)) for k in range(1, 4)]
q4 = mp.mpf(1)/4
# narrow-narrow arch values at all distinct d
ds = sorted({mp.nstr(abs(xs[j]-xs[k]), dps+10) for j in range(2, n) for k in range(2, j+1)})
t0 = time.time()
vals = harch.table_points(q4, v, [mp.mpf(d) for d in ds], dps)
AT = dict(zip(ds, vals))
print('# %d distinct arch values in %.0fs' % (len(ds), time.time()-t0), flush=True)
amp = s*mp.sqrt(mp.pi)
def Ppair(j, k):
    d, vv, a = pair(xs[j], ss[j], xs[k], ss[k])
    return a*mp.sqrt(2*mp.pi*vv)*mp.exp(vv/8)*2*mp.cosh(d/2)
def Zzeros(j, k):
    d, vv, a = pair(xs[j], ss[j], xs[k], ss[k])
    return sum(2*a*mp.sqrt(2*mp.pi*vv)*mp.exp(-vv*g*g/2)*mp.cos(g*d) for g in zeros)
def delta_wide(j, k, p, dfun, condshift):
    d, vv, a = pair(xs[j], ss[j], xs[k], ss[k])
    tot = -condshift*a*mp.exp(-d*d/(2*vv)); kk = 1
    while True:
        l = kk*mp.log(p)
        if l - abs(d) > mp.sqrt(2*vv*mp.log(10)*(dps+40)) + 30*vv: break
        tot += dfun(kk)*a*(mp.exp(-(l-d)**2/(2*vv)) + mp.exp(-(l+d)**2/(2*vv)))
        kk += 1
    return tot
Lq = mp.log(2); beta = (-mp.mpf('2.2') + mp.sqrt(mp.mpf('2.2')**2-4))/2
ctrl = {   # name: (prime, k -> (Lam_obj(p^k)-Lam(p^k))/sqrt(p^k), shift of cond)
 'zeta': None,
 'drop2': (2, lambda k: -mp.log(2)/mp.sqrt(mp.mpf(2)**k), 0),
 'drop3': (3, lambda k: -mp.log(3)/mp.sqrt(mp.mpf(3)**k), 0),
 'drop7': (7, lambda k: -mp.log(7)/mp.sqrt(mp.mpf(7)**k), 0),
 'tw-_2': (2, lambda k: ((-1)**k-1)*mp.log(2)/mp.sqrt(mp.mpf(2)**k), 0),
 'tw+_2half': (2, lambda k: (mp.mpf(1)/2**k-1)*mp.log(2)/mp.sqrt(mp.mpf(2)**k), 0),
 'NR_q2_c2.2': (2, lambda k: -Lq*(beta**k+beta**(-k)), 2*Lq),
}
for nm, spec in ctrl.items():
    if spec and spec[0] > N and nm.startswith('drop'): continue
    obj = O[nm]; t0 = time.time()
    I = mp.zeros(n)
    for j in range(n):
        for k in range(j+1):
            if k < 2:      # a wide class is involved: I = P - Z (zeros) + control difference
                val = Ppair(j, k) - Zzeros(j, k)
                if spec: val += delta_wide(j, k, *spec)
            else:
                d, vv, a = pair(xs[j], ss[j], xs[k], ss[k])
                A = obj.cond*a*mp.exp(-d*d/(2*vv)) + AT[mp.nstr(abs(d), dps+10)]*a*mp.sqrt(2*mp.pi*vv)
                if getattr(obj, 'pp', None) is None:
                    obj.pp = [(mp.log(q), obj.lamfun(q)/mp.sqrt(q)) for q in range(2, Nmax+1) if obj.lamfun(q) != 0]
                lim = reach_of(abs(d), vv, obj.growth); i2v = 1/(2*vv); Pr = mp.mpf(0)
                for l, w in obj.pp:
                    if l > lim: break
                    Pr += w*(mp.exp(-(l-d)**2*i2v) + mp.exp(-(l+d)**2*i2v))
                val = Pr*a - A
            I[j, k] = I[k, j] = val
    piv, done = pivots(I)
    cum = 0; first = None
    for k, (sg, mid, ball) in enumerate(piv[:done]):
        if sg > 0:
            cum += 1
            if cum > 1 and first is None: first = k
    neg_off = sum(1 for j in range(2, n) for k in range(2, j) if I[j, k] < 0)
    neg_diag = sum(1 for j in range(2, n) if I[j, j] < 0)
    lab = lambda k: ('H', 'V')[k] if k < 2 else 'e_%d' % qs[k-2]
    print('%-11s determined %d/%d | inertia (+,-) = (%d,%d) | class at which i_+ first reaches 2: %s | point classes: negative diagonal %d/%d, negative off-diagonal %d/%d | I(H,H)=%s I(H,V)=%s I(e_2,e_2)=%s | %.0fs' % (
        nm, done, n, cum, done-cum, lab(first) if first is not None else '-', neg_diag, n-2, neg_off, (n-2)*(n-3)//2,
        mp.nstr(I[0, 0], 5), mp.nstr(I[0, 1], 5), mp.nstr(I[3, 3], 5), time.time()-t0), flush=True)
