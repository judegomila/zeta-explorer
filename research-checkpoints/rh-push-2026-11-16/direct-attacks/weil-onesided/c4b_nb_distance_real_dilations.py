# Baez-Duarte distance d_N(target)^2 = dist^2( y^{x-1/2} 1_(0,1) , span{ {1/(k y)} : k<=N } ) in L^2(0,inf),
# compared with Q_L(e_x)/log N = (L(x)/x)/log N  (Theorem C lower bound; equality conjectured, BCF for x=1/2).
import numpy as np, mpmath as mp, math, sys
mp.mp.dps = 30
N = int(sys.argv[1]) if len(sys.argv) > 1 else 1500
# --- validate Vasyunin's formula on (1,2),(2,3),(3,7) by exact piecewise integration
def I_direct(h, k, P=400000):
    # int_0^inf {ht}{kt} dt/t^2 ; pieces between consecutive breakpoints j/(h k) (h,k coprime)
    j = np.arange(1, P, dtype=np.float64)
    t0 = j/(h*k); t1 = (j+1)/(h*k); tm = (t0+t1)/2
    a = np.floor(h*tm); b = np.floor(k*tm)
    # (ht-a)(kt-b)/t^2 = hk - (hb+ka)/t + ab/t^2
    val = h*k*(t1-t0) - (h*b+k*a)*np.log(t1/t0) + a*b*(1/t0-1/t1)
    head = h*k*(1.0/(h*k))            # t in (0, 1/(hk)): integrand = hk
    # tail beyond P/(hk): mean of {ht}{kt} over a period is 1/4 + 1/(12 h k)
    tail = (0.25 + 1.0/(12*h*k))/(P/(h*k))
    return head + val.sum() + tail
C = float(mp.log(2*mp.pi) - mp.euler)
def Vas(h, k):
    m = np.arange(1, k); return float(np.sum(((m*h) % k)/k/np.tan(np.pi*m/k))) if k > 1 else 0.0
def I_vas(h, k):
    return C/2*(h+k) + (k-h)/2*math.log(h/k) - math.pi/2*(Vas(h, k) + Vas(k, h))
for (h, k) in [(1, 1), (1, 2), (2, 3), (3, 7)]:
    print("validate I(%d,%d): direct %.8f  Vasyunin %.8f" % (h, k, I_direct(h, k), I_vas(h, k)))
# --- Gram matrix
Vt = [None]*(N+1)     # Vt[k][r] = V(r,k) for residues r
for k in range(1, N+1):
    if k == 1: Vt[k] = np.zeros(1); continue
    m = np.arange(1, k); cot = 1/np.tan(np.pi*m/k)
    r = np.arange(k)
    Vt[k] = (((np.outer(r, m)) % k)/k) @ cot
G = np.zeros((N, N))
gc = np.gcd.outer(np.arange(1, N+1), np.arange(1, N+1))
for h in range(1, N+1):
    for k in range(h, N+1):
        g = gc[h-1, k-1]; hh, kk = h//g, k//g
        I = C/2*(hh+kk) + ((kk-hh)/2*math.log(hh/kk) if hh != kk else 0.0) - math.pi/2*(Vt[kk][hh % kk] + Vt[hh][kk % hh])
        G[h-1, k-1] = G[k-1, h-1] = g*I
print("Gram built, N=%d" % N, flush=True)
def Lc(p):
    s = mp.mpf(1)/2 + p
    return 1/s + 1/(s-1) - mp.log(mp.pi)/2 + mp.digamma(s/2)/2 + mp.zeta(s, derivative=1)/mp.zeta(s)
ks = np.arange(1, N+1, dtype=np.float64)
targets = {}
for x in [0.5, 1.0, 1.5, 3.0]:
    s = x + 0.5
    if x == 0.5:
        bvec = ('half',)
        QL = float(2 + mp.euler - mp.log(4*mp.pi))
    else:
        bvec = (s,)
        QL = float(Lc(mp.mpf(x))/x)
    targets[x] = (bvec, 1/(2*x), QL)

def bq(s, q):
    th = np.arange(1, q+1)/q
    if s == 'half': return th*(1 - float(mp.euler) - np.log(th))
    return -th**s*float(mp.zeta(s))/s + th/(s-1)

def Qpick(bs, xs):
    return float(sum(bi*bj*(Lc(xi)+Lc(xj))/(xi+xj) for bi, xi in zip(bs, xs) for bj, xj in zip(bs, xs)))
def nrm2(bs, xs):
    return float(sum(bi*bj/(xi+xj) for bi, xi in zip(bs, xs) for bj, xj in zip(bs, xs)))
targets = {k: v for k, v in targets.items() if k in (0.5, 3.0)}
combos = {'x=20': ([1], [20]), 'e1-2e2': ([1, -2], [1, 2]), 'e1-e2': ([1, -1], [1, 2]), 'pf3': ([0.5, -1, 0.5], [1, 2, 3]), 'e.6-e.9': ([1, -1], [mp.mpf('0.6'), mp.mpf('0.9')])}
for k, (bs, xs) in combos.items():
    targets[k] = (None, nrm2(bs, xs), Qpick(bs, xs))
print("# dilations theta = a/q, a = 1..q ; Lambda = log q")
print("%8s %6s %14s %14s %12s" % ("target", "q", "d_q^2", "d_q^2 log q", "/Q_L"))
for key, (bv, nrm, QL) in targets.items():
    for q in [25, 50, 100, 200, 400, 800, 1500, 2500]:
        if q > N: break
        b = sum(float(bi)*bq(float(xi)+0.5, q) for bi, xi in zip(*combos[key])) if key in combos else bq(bv[0], q)
        sol = np.linalg.lstsq(G[:q, :q]/q, b, rcond=1e-13)[0]
        d2 = nrm - 2*(b @ sol) + sol @ (G[:q, :q]/q) @ sol
        print("%8s %6d %14.8e %14.8e %12.6f   (Q_L=%.6e)" % (key, q, d2, d2*math.log(q), d2*math.log(q)/QL, QL), flush=True)
