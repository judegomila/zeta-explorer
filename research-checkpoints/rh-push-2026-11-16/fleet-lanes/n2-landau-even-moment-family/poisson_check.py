# Exact check of the d-Poisson duality (Lemma P) and of the k=1 identity M = D + OD.
# Gaussian weight w(t)=exp(-pi t^2), w^ = w. Family: all integers d. Coefficients: log p on odd primes p<=x.
import math, cmath, json
def jac(a, n):
    a %= n; r = 1
    while a:
        while a % 2 == 0:
            a //= 2
            if n % 8 in (3, 5): r = -r
        a, n = n, a
        if a % 4 == 3 and n % 4 == 3: r = -r
        a %= n
    return r if n == 1 else 0
def w(t): return math.exp(-math.pi*t*t)
def tau(h, m):  # sum_b (b/m) e(bh/m)
    return sum(jac(b, m)*cmath.exp(2j*math.pi*b*h/m) for b in range(m))
def primal(m, X):
    R = int(8*X)+2
    return sum(w(d/X)*jac(d, m) for d in range(-R, R+1))
def dual(m, X, parts=False):
    Hh = int(8*m/X)+2
    t = {h: tau(h, m) for h in range(-Hh, Hh+1)}
    tot = sum((X/m)*w(h*X/m)*t[h] for h in t)
    if parts:
        sq = sum((X/m)*w(h*X/m)*t[h] for h in t if h > 0 and math.isqrt(h)**2 == h)
        return tot, (X/m)*t[0], sq
    return tot
out = {"lemmaP": [], "k1": []}
print("planned memory: negligible (< 50 MB)")
for m, X in [(15, 4.0), (105, 7.5), (9, 3.0), (45, 5.0), (3*5*7*11, 20.0), (49*3, 6.0), (11*13, 3.3)]:
    a, b = primal(m, X), dual(m, X)
    out["lemmaP"].append(dict(m=m, X=X, primal=a, dual_re=b.real, dual_im=b.imag, err=abs(a-b)))
    print(f"LemmaP m={m:5d} X={X:5.1f} primal={a:+.12f} dual={b.real:+.12f} im={b.imag:+.1e} err={abs(a-b):.1e}")
def primes_odd(x):
    s = bytearray([1])*(x+1); ps = []
    for i in range(2, x+1):
        if s[i]:
            if i > 2: ps.append(i)
            for j in range(i*i, x+1, i): s[j] = 0
    return ps
for x, X in [(40, 6.0), (40, 25.0), (60, 12.0), (60, 150.0)]:
    ps = primes_odd(x); lg = {p: math.log(p) for p in ps}
    R = int(8*X)+2
    M = 0.0; Msq = 0.0
    for d in range(-R, R+1):
        v = sum(lg[p]*jac(d, p) for p in ps)**2 * w(d/X)
        M += v
        if d > 0 and math.isqrt(d)**2 == d: Msq += v
    D = sum(lg[p]**2 * sum(w(d/X) for d in range(-R, R+1) if d % p) for p in ps)
    OD = 0.0; ODsq = 0.0; ODabs = 0.0
    for i, p in enumerate(ps):
        for q in ps:
            if q == p: continue
            t, t0, sq = dual(p*q, X, parts=True)
            OD += lg[p]*lg[q]*t.real; ODsq += lg[p]*lg[q]*sq.real
    out["k1"].append(dict(x=x, X=X, M=M, D=D, OD=OD, err=abs(M-D-OD), primal_square_d=Msq, dual_square_h=ODsq))
    print(f"k=1 x={x} X={X}: M={M:.8f} D={D:.8f} OD(dual)={OD:.8f} |M-D-OD|={abs(M-D-OD):.1e}  primal d=sq part={Msq:.4f}  dual h=sq part={ODsq:.4f}")
json.dump(out, open("poisson_check.json", "w"), indent=1)
