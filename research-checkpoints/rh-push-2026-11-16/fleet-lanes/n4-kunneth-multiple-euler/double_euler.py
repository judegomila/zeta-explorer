# Double Euler series for the Kurokawa tensor square of zeta: growth in the cutoff.
# Single process; largest allocation: chunk(400) x 9.7e3 complex128 arrays, about 62 MB each.
import numpy as np, json, math, mpmath as mp
XMAX = 10**5
sieve = np.ones(XMAX+1, bool); sieve[:2] = False
for i in range(2, int(XMAX**0.5)+1):
    if sieve[i]: sieve[i*i::i] = False
primes = np.nonzero(sieve)[0]
Ns, lam = [], []
for p in primes:
    q = int(p)
    while q <= XMAX:
        Ns.append(q); lam.append(math.log(p)); q *= int(p)
o = np.argsort(Ns); N = np.array(Ns, float)[o]; lam = np.array(lam)[o]
u = np.log(N); kap = lam/u; n = len(N)
print("prime powers <= 1e5:", n, " planned chunk allocation ~", 400*n*16/1e6, "MB per array")
cuts = [10**e for e in (2, 2.5, 3, 3.5, 4, 4.5, 5)]
idx = [int(np.searchsorted(N, c, side='right')) for c in cuts]
out = {"cuts": cuts, "A": {}, "B": {}, "C": {}, "ff": {}}

def rows_A(sig):
    r = np.zeros(n); ra = np.zeros(n)
    for i0 in range(0, n, 400):
        i1 = min(n, i0+400); I = np.arange(i0, i1)[:, None]; J = np.arange(n)[None, :]
        du = u[i0:i1, None] - u[None, :]
        mask = J < I
        du_safe = np.where(mask, du, 1.0)
        t1 = lam[i0:i1, None]*kap[None, :]*N[i0:i1, None]**(-(sig-1))/N[None, :]/du_safe      # (N_i, M_j)
        t2 = lam[None, :]*kap[i0:i1, None]*N[None, :]**(-(sig-1))/N[i0:i1, None]/(-du_safe)   # (N_j, M_i)
        r[i0:i1] = np.where(mask, t1+t2, 0).sum(1); ra[i0:i1] = np.where(mask, abs(t1)+abs(t2), 0).sum(1)
    return np.cumsum(r), np.cumsum(ra)

def rows_B(s, c=1.0):
    a = s - 2*c
    r = np.zeros(n, complex); ra = np.zeros(n)
    for i0 in range(0, n, 400):
        i1 = min(n, i0+400); I = np.arange(i0, i1)[:, None]; J = np.arange(n)[None, :]
        du = u[i0:i1, None] - u[None, :]; mask = J < I
        du_safe = np.where(mask, du, 1.0)
        D = np.exp(-a*u[i0:i1, None])*(-np.expm1(a*du_safe))/du_safe   # (e^{-a u_i} - e^{-a u_j})/(u_i-u_j)
        t = 2*lam[i0:i1, None]*lam[None, :]*(N[i0:i1, None]*N[None, :])**(-c)*D
        r[i0:i1] = np.where(mask, t, 0).sum(1); ra[i0:i1] = np.where(mask, abs(t), 0).sum(1)
    diag = np.cumsum(lam**2*N**(-2*c)*(-a)*N**(-a))
    return np.cumsum(r), np.cumsum(ra), diag

gx, gw = np.polynomial.legendre.leggauss(400); th = (gx+1)/2; tw = gw/2
def oneD(s, k, pure, c=1.0):
    # -a int_0^1 A(c+a th) A(c+a(1-th)) dth, A = truncated Dirichlet sum (minus smooth part if pure)
    a = s - 2*c; X = N[k-1] if False else cuts[idx.index(k)]
    def A(w):
        v = (lam[:k, None]*N[:k, None]**(-w[None, :])).sum(0)
        if pure: v = v - (X**(1-w)-1)/(1-w)
        return v
    w1 = c + a*th; w2 = c + a*(1-th)
    return complex(-a*np.sum(tw*A(w1)*A(w2)))

mp.mp.dps = 30
def L0(w): return -mp.zeta(w, derivative=1)/mp.zeta(w) - 1/(w-1)
def exact_pure(s, c=1):
    a = s - 2*c
    return complex(-a*mp.quad(lambda t: L0(c+a*t)*L0(c+a*(1-t)), [0, 0.5, 1]))

def expo(v):
    v = np.abs(np.array(v)); return [round(float(np.log(v[j+1]/v[j])/np.log(cuts[j+1]/cuts[j])), 3) for j in range(len(v)-1)]

print("\n(A) Akatsuka first sum, unsymmetrised, real s: sum_{N!=M<=X} Lam(N) kappa(M) N^{-(s-1)} M^{-1}/(log N - log M)")
for sig in (1.6, 1.8, 2.0, 2.2):
    S, Sa = rows_A(sig); v = [S[k-1] for k in idx]; va = [Sa[k-1] for k in idx]
    out["A"][sig] = {"signed": v, "abs": va, "exp_signed": expo(v), "exp_abs": expo(va)}
    print(f"sigma={sig}: signed", [f"{x:.4g}" for x in v], "exp", expo(v)); print("          abs   ", [f"{x:.4g}" for x in va], "exp", expo(va))

print("\n(B) symmetrised series  sum_{N!=M<=X} Lam Lam (NM)^{-1} D_s(log N, log M);  (C) pure part (dE x dE) via 1-D identity")
for s in (1.3, 1.6, 1.8, 1.6+5j, 1.8+5j, 2.0+5j, 2.5):
    S, Sa, dg = rows_B(s)
    v = [S[k-1] for k in idx]; va = [Sa[k-1] for k in idx]
    chk = [abs(S[k-1]+dg[k-1]-oneD(s, k, False))/abs(S[k-1]+dg[k-1]) for k in idx]
    P = [oneD(s, k, True) for k in idx]
    ex = exact_pure(s) if (s.real > 1.5) else None
    out["B"][str(s)] = {"signed": [[x.real, x.imag] for x in v], "abs": va, "exp_abs": expo(va), "exp_signed": expo(v), "identity_relerr_max": max(chk)}
    out["C"][str(s)] = {"P": [[x.real, x.imag] for x in P], "exact": None if ex is None else [ex.real, ex.imag]}
    print(f"s={s}: |signed|", [f"{abs(x):.4g}" for x in v], "exp", expo(v))
    print("      abs      ", [f"{x:.4g}" for x in va], "exp", expo(va), " double-sum vs 1-D identity max rel err %.2e" % max(chk))
    print("      pure P(X)", [f"{x.real:.5f}{x.imag:+.5f}i" for x in P], " analytic value:", ex)

print("\nFunction-field control: pure k-fold coefficient E_n^k, E_n = sum alpha_i^n; sigma_k/k = max log_q|alpha|; full object has pole(x)pole at q^k")
for name, (b, q) in {"E: 1-2T+5T^2 (genuine, q=5)": (2, 5), "fake: 1-5T+5T^2 (q=5)": (5, 5)}.items():
    al = np.roots([1, -b, q]); m = max(abs(al)); nn = 400
    En = abs(sum(a**nn for a in al)); rate = math.log(En)/nn/math.log(q) if En > 0 else float('nan')
    out["ff"][name] = {"abs_alpha": [float(abs(x)) for x in al], "sigma_k_over_k": math.log(m)/math.log(q), "measured_n400": rate}
    print(name, "|alpha| =", abs(al), " sigma_k/k =", round(math.log(m)/math.log(q), 4), " (log|E_400|/400 log q =", round(rate, 4), ")")
json.dump(out, open("double_euler.json", "w"), indent=1)
