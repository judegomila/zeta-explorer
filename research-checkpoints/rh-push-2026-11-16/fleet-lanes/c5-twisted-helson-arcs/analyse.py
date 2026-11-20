"""Analyse thin.c output: exponents of E and M_g, twisted-sum main terms."""
import json, sys, math, cmath
pre = sys.argv[1]
d = json.load(open(pre + ".json")); b = d["b"]; N = d["N"]; c = d["c"]
print(f"== {pre}: b={b} N={N:.3g} |S|={d['size_S']} c={c:.12g} S(N)={d['S_N']} maxdev~{d['greedy_maxdev_proxy']}")
E = d["E_bins"]
# octave aggregation (8 bins per octave)
octs = {}
for k, lo, hi, mx, rms, mean, Eh in E:
    o = k // 8
    a = octs.setdefault(o, [0.0, 0.0, 0])
    a[0] = max(a[0], mx); a[1] += rms * rms * (hi - lo + 1); a[2] += hi - lo + 1
rows = [(o, v[0], math.sqrt(v[1] / v[2])) for o, v in sorted(octs.items()) if v[2] >= 0.99 * 2 ** o]
print("octave k: max|E| rms  max/x^(b/2)  rms/x^(b/2)   [x=2^(k+1)]")
for o, mx, rms in rows:
    if o >= 10: print(f"  {o:2d} {mx:12.1f} {rms:12.1f} {mx/2**((o+1)*b/2):8.4f} {rms/2**((o+0.5)*b/2):8.4f}")
def fit(rows, idx, k0, k1=99):
    pts = [(o * math.log(2), math.log(r[idx])) for o, *r in [(r[0], r[1], r[2]) for r in rows] if k0 <= o <= k1]
    n = len(pts); sx = sum(p[0] for p in pts); sy = sum(p[1] for p in pts)
    sxx = sum(p[0] ** 2 for p in pts); sxy = sum(p[0] * p[1] for p in pts)
    return (n * sxy - sx * sy) / (n * sxx - sx * sx)
kmax = rows[-1][0]
for k0 in (12, 16, 20, 24, 28):
    if k0 + 3 <= kmax:
        print(f"  slope k>={k0}: max {fit(rows,0,k0):.4f}  rms {fit(rows,1,k0):.4f}")
for k0 in range(12, kmax - 5, 4):
    print(f"  local slope k in [{k0},{k0+6}]: max {fit(rows,0,k0,k0+6):.4f} rms {fit(rows,1,k0,k0+6):.4f}")
M = d["Mg_bins"]
print("M_g(y): y, M_g, N_S(y), sum g^2, |M_g|/y^(b/2), N_S/y^b, V/(y^b L^3)")
mo = {}
for k, y, m, cnt, V in M:
    o = k // 8; a = mo.setdefault(o, [0, 0.0, 0]); a[0] = max(a[0], abs(m)); a[1] += m * m; a[2] += 1
    if k % 16 == 15 and k >= 16 * 8 - 1:
        L = math.log(y); print(f"  {y:14d} {m:12d} {cnt:12d} {V:14.6g} {abs(m)/y**(b/2):8.4f} {cnt/y**b:8.4f} {V/(y**b*L**3):9.5f}")
mrows = [(o, v[0], math.sqrt(v[1] / v[2])) for o, v in sorted(mo.items()) if v[2] == 8]
for k0 in (12, 16, 20, 24, 28):
    if k0 + 3 <= mrows[-1][0]:
        print(f"  M_g slope k>={k0}: max {fit(mrows,0,k0):.4f} rms {fit(mrows,1,k0):.4f}")
# twisted sums
print("twisted sums T(x; a/q)/x against predicted c_q = -2c/(p-1) for q=p in S, 0 for q not an S-number")
import mpmath as mp
def greedy_S(b, lim=1000):
    S=[]; cnt=0; e2=mp.ei(b*mp.log(2))
    for n in range(2, lim):
        if all(n % k for k in range(2, int(n**0.5)+1)):
            if cnt + 1 <= mp.ei(b*mp.log(n)) - e2: S.append(n); cnt += 1
    return set(S)
S20 = greedy_S(b)
for line in open(pre + "_twist.txt"):
    f = line.split(); x = int(f[0]); q = int(f[1]); R = [int(v) for v in f[2:]]
    if x < N: continue
    out = []
    for a in range(1, q):
        if math.gcd(a, q) != 1: continue
        T = sum(R[r] * cmath.exp(2j * math.pi * a * r / q) for r in range(q))
        out.append(T)
    worst = max(out, key=lambda T: abs(T)); 
    def cq(q):
        # sum_{q|d} g(d)/d for q an S-number: c * prod_{p^k||q} [ sum_{j>=k} 2(-1)^j p^-j ] / [(p-1)/(p+1)]
        v = c; n = q; p = 2
        while n > 1:
            if n % p == 0:
                k = 0
                while n % p == 0: n //= p; k += 1
                if p not in S20: return 0.0
                v *= (2 * (-1) ** k * p ** (-k) / (1 + 1 / p)) / ((p - 1) / (p + 1))
            p += 1
        return v
    pred = cq(q)
    dev = max(abs(T - pred * x) for T in out)
    print(f"  q={q:4d} x={x:.0e}: pred c_q={pred:+.8f}  max_a |T - c_q x| = {dev:10.1f}  (= x^{math.log(max(dev,1))/math.log(x):.3f}),  T(1/q)/x = {out[0].real/x:+.8f}{out[0].imag/x:+.2e}i")
