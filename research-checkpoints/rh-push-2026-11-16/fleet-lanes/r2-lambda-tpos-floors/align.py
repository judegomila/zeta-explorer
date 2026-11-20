# Finite-alignment deficit by lattice enumeration.
# Claim certified (float Gram-Schmidt with slack; candidates re-evaluated in 60-digit arithmetic):
#   for all gamma in [G0, G1]:  sum_{i<=k} a_i (1 - cos(gamma log p_i)) >= sum 8 a_i ||gamma log p_i / 2pi||^2 >= (sqrt(Qmin) - sqrt(E))^2
# where Qmin = min over integers j with j*eta in [G0-eta, G1+eta] of Q(j) = sum 8 a_i ||j eta alpha_i||^2, E = 2 eta^2 sum a_i alpha_i^2.
import sys, subprocess, json, math, os, time
import mpmath as mp
from flint import fmpz_mat, fmpz
mp.mp.dps = 70
HERE = os.path.dirname(os.path.abspath(__file__))
def primes(k):
    out = []; n = 2
    while len(out) < k:
        if all(n % p for p in out if p*p <= n): out.append(n)
        n += 1
    return out
def run(h, k, G0, G1, B, eta=mp.mpf(1)/256, S=130, tsec=None, weights=None):
    sig = (1 + mp.mpf(h))/2; ps = primes(k)
    a = [mp.log(p)*mp.mpf(p)**(-sig) for p in ps] if weights is None else weights
    al = [mp.log(p)/(2*mp.pi) for p in ps]
    s = [mp.sqrt(8*ai) for ai in a]
    J = G1/eta; B0 = mp.mpf(B)/k; kap = mp.sqrt(B0)/J
    sc = mp.mpf(2)**S
    n = k + 1
    M = [[0]*n for _ in range(n)]
    for i in range(k):
        M[0][i] = int(mp.nint(eta*al[i]*s[i]*sc)); M[i+1][i] = int(mp.nint(s[i]*sc))
    kint = int(mp.nint(kap*sc)); M[0][k] = kint
    A = fmpz_mat(n, n, [M[i][j] for i in range(n) for j in range(n)])
    t0 = time.time(); Rm = A.lll(delta=0.9999, eta=0.501)
    rows = [[int(Rm[i, j]) for j in range(n)] for i in range(n)]
    fl = [[float(mp.mpf(v)/sc) for v in r] for r in rows]
    # Gram-Schmidt in mp
    bst = []; mu = [[0.0]*n for _ in range(n)]; bs2 = []
    R = [[mp.mpf(v)/sc for v in r] for r in rows]
    for i in range(n):
        v = R[i][:]
        for j in range(i):
            m = sum(R[i][t]*bst[j][t] for t in range(n))/bs2[j]; mu[i][j] = float(m)
            v = [v[t] - m*bst[j][t] for t in range(n)]
        bst.append(v); bs2.append(sum(t*t for t in v))
    R2 = float((mp.mpf(B) + B0)*(1 + mp.mpf(10)**-7))
    inp = '%d %.17g\n' % (n, R2) + ' '.join('%.17g' % float(b) for b in bs2) + '\n' + '\n'.join(' '.join('%.17g' % mu[i][j] for j in range(n)) for i in range(n)) + '\n'
    t1 = time.time()
    pr = subprocess.run([os.path.join(HERE, 'enum')], input=inp, capture_output=True, text=True, timeout=tsec)
    t2 = time.time()
    cands = []
    for line in pr.stdout.splitlines():
        c = [int(v) for v in line.split()[:-1]]
        last = sum(c[i]*rows[i][k] for i in range(n))
        assert last % kint == 0
        j = abs(last // kint)
        if j == 0: continue
        g = j*eta
        if not (G0 - eta <= g <= G1 + eta): continue
        Q = sum(8*a[i]*(j*eta*al[i] - mp.nint(j*eta*al[i]))**2 for i in range(k))
        cands.append((Q, j))
    cands.sort()
    E = 2*eta**2*sum(a[i]*al[i]**2 for i in range(k))
    Qmin = cands[0][0] if cands and cands[0][0] < B else mp.mpf(B)
    proved = (mp.sqrt(Qmin) - mp.sqrt(E))**2
    # true cosine deficit at the best candidates (information only)
    info = []
    for Q, j in cands[:5]:
        g0 = j*eta
        f = lambda g: sum(a[i]*(1 - mp.cos(g*mp.log(ps[i]))) for i in range(k))
        best = min(f(g0 + d*eta/40) for d in range(-40, 41))
        info.append((float(Q), int(j), float(g0), float(best)))
    res = dict(h=float(h), k=k, pmax=ps[-1], G0=float(G0), G1=float(G1), B=float(B), enum_stderr=pr.stderr.strip(), n_inrange=len(cands),
               Qmin=float(Qmin), E=float(E), proved_deficit=float(proved), sum_a=float(sum(a)), best=info, lll_s=round(t1-t0, 2), enum_s=round(t2-t1, 2))
    return res
def Bguess(h, k, G0, G1, target, eta=mp.mpf(1)/256):
    sig = (1 + mp.mpf(h))/2; ps = primes(k)
    a = [mp.log(p)*mp.mpf(p)**(-sig) for p in ps]
    lv = mp.log(mp.pi)*k/2 - mp.loggamma(mp.mpf(k)/2 + 1) - sum(mp.log(8*ai) for ai in a)/2   # log vol of unit ellipsoid
    # count ~ (G1-G0)/eta * vol * B^{k/2} = target
    return float(mp.exp((mp.log(target) - mp.log((G1 - G0)/eta) - lv)*2/k))
if __name__ == '__main__':
    h = sys.argv[1]; k = int(sys.argv[2]); target = float(sys.argv[3]); fac = float(sys.argv[4]) if len(sys.argv) > 4 else 2.0
    X = mp.mpf(6000000185827); G0 = X/2; G1 = G0*mp.e**fac
    B = Bguess(h, k, G0, G1, target)
    r = run(h, k, G0, G1, B, tsec=float(sys.argv[5]) if len(sys.argv) > 5 else 600)
    print(json.dumps(r), flush=True)
