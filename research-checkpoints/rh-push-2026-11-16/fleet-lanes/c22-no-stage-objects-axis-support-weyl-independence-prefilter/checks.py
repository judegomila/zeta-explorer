# Sanity checks for RESULT.md (identities only; no proof input).
# Planned memory: sieve to 60000 ints (<1 MB), mpmath 30 digits. Single process.
import mpmath as mp, json, math
mp.mp.dps = 30
out = {}
M = 60000
# von Mangoldt
lam = [0.0]*(M+1)
sieve = bytearray([1])*(M+1)
for p in range(2, M+1):
    if sieve[p]:
        for q in range(p*p, M+1, p): sieve[q] = 0
        pk = p
        while pk <= M:
            lam[pk] = math.log(p); pk *= p
def L_zeta(s): return -mp.zeta(s, derivative=1)/mp.zeta(s)
def L_v6(s):
    w = mp.mpf(6)**(-s)
    return L_zeta(s) - 2*mp.log(6)*w/(1-w*w)
def lhs(L, s, d, N):
    tot = mp.mpc(0)
    for n in range(-6*N, 6*N+1):
        tot += mp.e**(-mp.pi*mp.mpf(n)**2/N**2) * L(s + 1j*n*d)
    return tot/N
def comb(theta, N):
    k0 = round(theta); tot = 0.0
    for k in (k0-1, k0, k0+1):
        tot += math.exp(-math.pi*N*N*(theta-k)**2)
    return tot
def rhs_zeta(s, d, N):
    tot = mp.mpc(0)
    for m in range(2, M+1):
        if lam[m]:
            c = comb(d*math.log(m)/(2*math.pi), N)
            if c > 1e-25: tot += lam[m]*c*mp.mpf(m)**(-s)
    return tot
def rhs_v6_extra(s, d, N):
    tot = mp.mpc(0); j = 1
    while 6**j <= 10**40:
        c = comb(d*j*math.log(6)/(2*math.pi), N)
        tot += -2*mp.log(6)*c*mp.mpf(6)**(-j*s); j += 2
    return tot
s = mp.mpc(3, 0.3)
rows = []
for name, x in (("x=2", 2.0), ("x=6", 6.0), ("x=4 (j0=2 at p=2)", 4.0), ("x=e (no prime power)", math.e)):
    d = 2*math.pi/math.log(x)
    for N in (4, 16, 64):
        a = lhs(L_zeta, s, d, N); b = rhs_zeta(s, d, N)
        a6 = lhs(L_v6, s, d, N); b6 = b + rhs_v6_extra(s, d, N)
        rows.append(dict(lattice=name, N=N, zeta_lhs=str(mp.nstr(a, 12)), zeta_rhs=str(mp.nstr(b, 12)),
                         zeta_diff=float(abs(a-b)), v6_lhs=str(mp.nstr(a6, 12)), v6_diff=float(abs(a6-b6))))
        print(name, N, mp.nstr(a, 12), mp.nstr(b, 12), float(abs(a-b)), "| V6", mp.nstr(a6, 12), float(abs(a6-b6)))
out["lattice_projection"] = rows
# predicted limits N -> inf
lim = {}
lim["zeta x=2"] = str(mp.nstr(mp.log(2)*mp.mpf(2)**(-s)/(1-mp.mpf(2)**(-s)), 12))
lim["zeta x=4"] = str(mp.nstr(mp.log(2)*mp.mpf(4)**(-s)/(1-mp.mpf(4)**(-s)), 12))
lim["zeta x=6"] = "0"
lim["v6 x=6"] = str(mp.nstr(-2*mp.log(6)*mp.mpf(6)**(-s)/(1-mp.mpf(6)**(-2*s)), 12))
out["limits"] = lim; print(lim)
# Lemma B-K: mass of the multiples k>=2 per unit of u, against first multiples
rowsK = []
for u in (4, 6, 8, 10):
    lo, hi = math.exp(u), math.exp(u+1)
    if hi > M: break
    first = sum(lam[m]/math.sqrt(m) for m in range(int(lo)+1, int(hi)+1) if lam[m] and sieve[m])
    higher = sum(lam[m]/math.sqrt(m) for m in range(int(lo)+1, int(hi)+1) if lam[m] and not sieve[m])
    rowsK.append(dict(u=u, first=first, higher=higher, pole_pred=2*(math.exp((u+1)/2)-math.exp(u/2))))
    print("u", u, "first multiples", first, "multiples k>=2", higher, "2(e^((u+1)/2)-e^(u/2))", rowsK[-1]["pole_pred"])
out["mass_split"] = rowsK
# R(s) = sum_p sum_{k>=2} log p p^{-ks} at sigma = 0.55, 0.6, 0.75 (absolute convergence right of 1/2)
for sig in (0.55, 0.6, 0.75):
    r = sum(lam[m]*m**(-sig) for m in range(2, M+1) if lam[m] and not sieve[m])
    print("R_abs partial to", M, "sigma", sig, r)
    out["R_abs_%s" % sig] = r
# finite-dimensional axis lemma: zeros of prod_j (1 - a_j e^{-l_j z}) are on Re z = log|a_j|/l_j
import cmath
fd = []
for a, l in ((0.7, math.log(2)), (0.7*cmath.exp(1j), math.log(3)), (1.0, math.log(5))):
    z = (cmath.log(a) + 2j*math.pi*3)/l
    val = abs(1 - a*cmath.exp(-l*z)); fd.append(dict(a=str(a), l=l, zero=str(z), abs_factor=val))
    print("finite-dim factor", a, l, "zero", z, "abs", val)
out["finite_dim"] = fd
json.dump(out, open("checks.json", "w"), indent=1)
