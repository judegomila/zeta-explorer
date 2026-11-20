# usage: run_dh_zero.py <libdir> <zeros.json> <h> <n> <ratio> <dps>
# DH: Z from the zero side (zeros to height 200; tail bounded by exp(-v*200^2/2)) versus the prime side; and with the
# off-line quartets removed one at a time.
import sys, json, time, mpmath as mp
sys.path.insert(0, sys.argv[1])
from hlib import *
import harch
J = json.load(open(sys.argv[2]))
h = mp.mpf(sys.argv[3]); n = int(sys.argv[4]); r = mp.mpf(sys.argv[5]); mp.mp.dps = int(sys.argv[6]); dps = mp.mp.dps
s = r*h; v = 2*s*s; amp = s*mp.sqrt(mp.pi); c0 = amp*mp.sqrt(2*mp.pi*v)
on = [mp.mpf(x) for x in J['on']]; off = [(mp.mpf(b), mp.mpf(g)) for b, g in J['off']]
print('# h=%s n=%d s=%s c=%s ; %d on-line ordinates (max %s), off-line: %s' % (sys.argv[3], n, mp.nstr(s, 4), mp.nstr((n-1)*h, 4), len(on), mp.nstr(on[-1], 6), [(mp.nstr(b, 5), mp.nstr(g, 6)) for b, g in off]))
tail = mp.exp(-v*on[-1]**2/2)*c0*400 + mp.mpf(10)**(-23)*c0*60
print('# tail bound used as absolute entry radius: %s' % mp.nstr(tail, 3))
def Zk(d, skip=()):
    z = mp.mpf(0)
    for g in on: z += 2*c0*mp.exp(-v*g*g/2)*mp.cos(g*d)
    for i, (b, g) in enumerate(off):
        if i in skip: continue
        for sb in (1, -1):
            t = mp.mpc(g, -sb*(b-mp.mpf(1)/2))
            z += 2*mp.re(c0*mp.exp(-v*t*t/2)*mp.exp(1j*t*d))
    return z
def report(tag, K):
    M = mp.zeros(n)
    for j in range(n):
        for k in range(n): M[j, k] = -K[abs(j-k)]
    piv, done = pivots(M)   # midpoint elimination: entry errors (tail, 25-digit zeros) are NOT propagated
    pos = [k+1 for k, (sg, m, b) in enumerate(piv[:done]) if sg > 0]
    sm = min(piv[:done], key=lambda t: abs(t[2].mid())) if done else None
    print('%-34s determined %d/%d | positive pivots of -Z at stages %s | smallest |pivot| %s' % (tag, done, n, pos, sm[2].mid().str(4) if sm else '-'), flush=True)
report('zero side, all zeros', [Zk(j*h) for j in range(n)])
for i in range(len(off)):
    report('zero side, quartet %d removed' % (i+1), [Zk(j*h, skip=(i,)) for j in range(n)])
report('zero side, all quartets removed', [Zk(j*h, skip=tuple(range(len(off)))) for j in range(n)])
# prime side
Nmax = int(mp.exp(reach_of((n-1)*h, v, 1.2))) + 10
print('# prime side: Lambda_DH table %d' % Nmax); assert Nmax < 60000
O = make_objects(Nmax, Nmax); obj = O['DH']
T = harch.table_uniform(mp.mpf(3)/4, v, h, n, dps)
pp = [(mp.log(q), obj.lamfun(q)/mp.sqrt(q)) for q in range(2, Nmax+1) if obj.lamfun(q) != 0]
K = []
for j in range(n):
    d = j*h; A = obj.cond*amp*mp.exp(-d*d/(2*v)) + T[j]*c0
    Pr = mp.mpf(0)
    for l, w in pp: Pr += w*(mp.exp(-(l-d)**2/(2*v)) + mp.exp(-(l+d)**2/(2*v)))
    K.append(A - Pr*amp)
print('# max |Z_zero - Z_prime| over the kernel values: %s' % mp.nstr(max(abs(K[j]-Zk(j*h)) for j in range(0, n, 7)), 3))
report('prime side', K)
