# Detection threshold delta*(gamma,h) for an added off-line quadruple, on the lacunary lattice nu_k = q^k (k>=0), h = ln q.
# c(nu) = xi'/xi(1/2+nu) evaluated on the prime side (mpmath), LDL sign test in Arb balls. MEASURED (inputs are mp floats).
import sys, json, math
import mpmath as mp
from flint import arb, ctx
DPS = int(sys.argv[3]) if len(sys.argv) > 3 else 220
mp.mp.dps = DPS; ctx.prec = int(DPS*3.33)+20

def c0(nu):
    s = mp.mpf(1)/2 + nu
    z = mp.zeta(s, derivative=1)/mp.zeta(s) if s < 900 else mp.mpf(0)
    return 1/s + 1/(s-1) - mp.log(mp.pi)/2 + mp.digamma(s/2)/2 + z

def A(x): return arb(mp.nstr(x, DPS))

def pd(nus, cs):
    """LDL on normalised Pick matrix; returns (True, minpivot) or (False, index)."""
    n = len(nus)
    sq = [ (nus[i]/cs[i]).sqrt() for i in range(n)]
    M = [[(cs[i]+cs[j])/(nus[i]+nus[j])*sq[i]*sq[j] for j in range(i+1)] for i in range(n)]
    d = [None]*n; L = [[None]*n for _ in range(n)]; mn = None
    for j in range(n):
        s = M[j][j]
        for k in range(j): s -= L[j][k]*L[j][k]*d[k]
        if not (s > 0): return (False, j, float(s.mid()))
        s = s.mid(); d[j] = s; mn = s if mn is None or s < mn else mn
        for i in range(j+1, n):
            t = M[i][j]
            for k in range(j): t -= L[i][k]*L[j][k]*d[k]
            L[i][j] = (t/s).mid()
    return (True, float(mn.mid()))

def run(m, gam, numax_log=None):
    h = mp.log(2)/m
    top = (numax_log or (math.log(gam)+float(sys.argv[4]) if len(sys.argv)>4 else math.log(gam)+25))
    K = int(top/float(h))
    nus_mp = [mp.exp(k*h) for k in range(K+1)]
    c_mp = [c0(v) for v in nus_mp]
    nus = [A(v) for v in nus_mp]
    def cs(delta):
        lam = (mp.mpf(gam) - 1j*mp.mpf(delta))**2
        return [A(c_mp[i] + 2*mp.re(2*nus_mp[i]/(nus_mp[i]**2+lam))) for i in range(len(nus_mp))]
    base = pd(nus, [A(x) for x in c_mp])
    lo, hi = 0.0, None
    d = float(h)*gam/(2*math.pi)  # unit: x = 2 pi delta/(gamma h) = 1
    x = 1.0
    while True:
        r = pd(nus, cs(x*d))
        if r[0]: lo = x; x *= 2
        else: hi = x; break
        if x > 4000: break
    if hi is None: return dict(m=m, gam=gam, K=K, base=base, xstar=None)
    for _ in range(14):
        mid = (lo+hi)/2
        if pd(nus, cs(mid*d))[0]: lo = mid
        else: hi = mid
    return dict(m=m, gam=gam, K=K, h=float(h), base=base, xstar=(lo+hi)/2, delta_star=(lo+hi)/2*d)

if __name__ == '__main__':
    m = int(sys.argv[1]); gam = float(sys.argv[2])
    print(json.dumps(run(m, gam)), flush=True)
