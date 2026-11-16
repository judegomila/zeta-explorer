# Finite-alignment deficit by complete lattice enumeration (target phases 0, or 1/2 cycle for the primes listed in `shift`).
# Statement checked: for every real gamma in [G0, G1],
#     Def_k(gamma) := sum_{i<=k} a_i (1 - cos(gamma log p_i))  >=  Delta := min( (sqrt(B) - sqrt(E))^2 , minbound ),
# where, with j the nearest integer to gamma/eta:
#   (i)  if Q(j) := sum 8 a_i ||j eta alpha_i||^2 > B then Def >= sum 8 a_i ||gamma alpha_i||^2 >= (sqrt(B)-sqrt(E))^2, E = 2 eta^2 sum a_i alpha_i^2;
#   (ii) if Q(j) <= B then j is in the enumerated list and Def(gamma) >= f(j eta) - |f'(j eta)| eta/2 - C2 eta^2/8, C2 = sum a_i log^2 p_i.
# Arithmetic: exact integer LLL (python-flint); Gram-Schmidt in 70-digit mpmath rounded to double; enumeration in double with
# relative radius slack 1e-7; phases j*eta*alpha_i mod 1 in 128-bit fixed point.  Not interval-certified.
import sys, subprocess, json, os, time
import mpmath as mp
from flint import fmpz_mat
mp.mp.dps = 80
HERE = os.path.dirname(os.path.abspath(__file__))
def primes(k):
    out = []; n = 2
    while len(out) < k:
        if all(n % p for p in out if p*p <= n): out.append(n)
        n += 1
    return out
def run(a, ps, G0, G1, B, eta=mp.mpf(1)/256, S=140, tsec=600, shift=None):
    k = len(ps); al = [mp.log(p)/(2*mp.pi) for p in ps]; s = [mp.sqrt(8*ai) for ai in a]
    J = G1/eta + 2; B0 = mp.mpf(B)/k; kap = mp.sqrt(B0)/J; sc = mp.mpf(2)**S; n = k + 1
    M = [[0]*n for _ in range(n)]
    for i in range(k):
        M[0][i] = int(mp.nint(eta*al[i]*s[i]*sc)); M[i+1][i] = int(mp.nint(s[i]*sc))
    kint = int(mp.nint(kap*sc)); M[0][k] = kint
    t0 = time.time(); Rm = fmpz_mat(n, n, [M[i][j] for i in range(n) for j in range(n)]).lll(delta=0.9999, eta=0.501)
    rows = [[int(Rm[i, j]) for j in range(n)] for i in range(n)]
    tj = []
    for r in rows:
        assert r[k] % kint == 0; tj.append(r[k]//kint); assert abs(tj[-1]) < 2**62
    R = [[mp.mpf(v)/sc for v in r] for r in rows]; bst = []; mu = [[0.0]*n for _ in range(n)]; bs2 = []
    for i in range(n):
        v = R[i][:]
        for j in range(i):
            m = sum(R[i][t]*bst[j][t] for t in range(n))/bs2[j]; mu[i][j] = float(m); v = [v[t] - m*bst[j][t] for t in range(n)]
        bst.append(v); bs2.append(sum(t*t for t in v))
    R2 = float((mp.mpf(B) + B0)*(1 + mp.mpf(10)**-7))
    jlo = int(mp.floor(G0/eta)) - 1; jhi = int(mp.ceil(G1/eta)) + 1
    C2 = float(sum(a[i]*mp.log(ps[i])**2 for i in range(k)))*(1 + 1e-9)
    lines = ['%d %.17g' % (n, R2), ' '.join('%.17g' % float(b) for b in bs2)]
    lines += [' '.join('%.17g' % mu[i][j] for j in range(n)) for i in range(n)]
    tau = [(s[i]*mp.mpf(shift[i]) if shift is not None else mp.mpf(0)) for i in range(k)] + [mp.mpf(0)]
    tstar = [float(sum(tau[t]*bst[i][t] for t in range(n))/bs2[i]) for i in range(n)]
    lines += [' '.join(str(t) for t in tj), ' '.join('%.17g' % v for v in tstar), '%d %d' % (jlo, jhi), '%d %.17g %.17g' % (k, float(eta), C2)]
    for i in range(k):
        fr = int(mp.floor(mp.frac(eta*al[i])*mp.mpf(2)**128)); sh = 0.0 if shift is None else shift[i]
        lines.append('%d %d %.17g %.17g %.3f' % (fr >> 64, fr & (2**64 - 1), float(a[i]), float(mp.log(ps[i])), sh))
    t1 = time.time()
    pr = subprocess.run([os.path.join(HERE, 'enum2')], input='\n'.join(lines) + '\n', capture_output=True, text=True, timeout=tsec)
    t2 = time.time(); out = json.loads(pr.stdout)
    E = 2*eta**2*sum(a[i]*al[i]**2 for i in range(k))
    far = float((mp.sqrt(B) - mp.sqrt(E))**2)
    out.update(k=k, pmax=ps[-1], B=float(B), E=float(E), far_bound=far, Delta=min(far, out['minbound']), sum_a=float(sum(a)), lll_s=round(t1-t0, 2), enum_s=round(t2-t1, 2))
    return out
def Bguess(a, k, G0, G1, target, eta=mp.mpf(1)/256):
    lv = mp.log(mp.pi)*k/2 - mp.loggamma(mp.mpf(k)/2 + 1) - sum(mp.log(8*ai) for ai in a)/2
    return float(mp.exp((mp.log(target) - mp.log((G1 - G0)/eta) - lv)*2/k))
if __name__ == '__main__':
    h = sys.argv[1]; k = int(sys.argv[2]); target = float(sys.argv[3]); fac = float(sys.argv[4]); tsec = float(sys.argv[5]) if len(sys.argv) > 5 else 600
    X = mp.mpf(6000000185827); G0 = (X - 8)/2; G1 = (X*mp.e**fac + 8)/2
    sig = (1 + mp.mpf(h))/2; ps = primes(k); a = [mp.log(p)*mp.mpf(p)**(-sig) for p in ps]
    B = Bguess(a, k, G0, G1, target)
    r = run(a, ps, G0, G1, B, tsec=tsec); r.update(h=float(h), fac=fac, target=target)
    print(json.dumps(r), flush=True)
