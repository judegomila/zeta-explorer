# c6: companions (Delta), DH in the pole slot, local-factor ratio H_p, Bochner test for DH. n <= 10^4.
# Planned memory: lists of length 10^4 of arb/acb (< 100 MB). Run through scripts/memcap.sh 8.
import json, math, time
from flint import fmpz_poly, arb, acb, ctx
ctx.prec = 600
N = 10**4; out = {"N": N}; t0 = time.time()
# tau(n): Delta = q * (sum_k (-1)^k (2k+1) q^{k(k+1)/2})^8  (Jacobi)
c = [0]*N; k = 0
while k*(k+1)//2 < N:
    c[k*(k+1)//2] = (-1)**k*(2*k+1); k += 1
P = fmpz_poly(c); R = fmpz_poly([1])
def trunc(p): return fmpz_poly([int(p[i]) for i in range(min(N, p.degree()+1))])
P2 = trunc(P*P); P4 = trunc(P2*P2); P8 = trunc(P4*P4)
tau = [0]+[int(P8[n-1]) for n in range(1, N+1)]
assert tau[1:8] == [1, -24, 252, -1472, 4830, -6048, -16744], tau[1:8]
out["tau_check"] = tau[1:8]
# Delta^2 (weight 24, not a Hecke eigenform): coefficients c2(n) = sum tau(k) tau(n-k)
D2 = trunc(fmpz_poly([0]+tau[1:N])*fmpz_poly([0]+tau[1:N]))
c2 = [int(D2[n]) for n in range(0, N)]
out["Delta^2: c(2), c(3), c(6), c(2)c(3)/c(2)^... (not multiplicative; c(1)=0)"] = [c2[1], c2[2], c2[3], c2[6]]
lam = [arb(0)]+[arb(tau[n])/arb(n)**arb("5.5") for n in range(1, N+1)]
out["max |lambda(n)|/d(n) check n<=N (Deligne)"] = float(max(abs(lam[n]) for n in range(1, N+1)))
primes = [p for p in range(2, N+1) if all(p % q for q in range(2, int(p**0.5)+1))]
# G3: log-coefficient of sum lambda(n)^2 n^-s at p^2 is B - A^2/2, A = lambda(p)^2, B = lambda(p^2)^2
negp = []
for p in primes:
    if p*p > N: break
    v = lam[p*p]**2 - lam[p]**4/2
    if v < 0: negp.append((p, float(v)))
out["G3_primes p<=100 where the p^2 log-coefficient of sum lambda^2 n^-s is negative"] = negp
def conv(a, b):
    r = [acb(0)]*(N+1)
    for d in range(1, N+1):
        ad = a[d]
        for m in range(1, N//d+1): r[d*m] += ad*b[m]
    return r
def rep(name, r):
    neg = [n for n in range(1, N+1) if r[n].real < 0]
    und = [n for n in range(1, N+1) if not (r[n].real < 0) and not (r[n].real >= 0) and not (r[n].real > 0)]
    out[name] = {"certified_negative": len(neg), "undecided": len(und), "first_negative_n": neg[:8],
                 "first_negative_values": [float(r[n].real.mid()) for n in neg[:8]]}
    print(name, out[name], flush=True)
kap = ((10-2*arb(5).sqrt()).sqrt()-2)/(arb(5).sqrt()-1)
aDH = [acb(0)]+[acb({0: arb(0), 1: arb(1), 2: kap, 3: -kap, 4: arb(-1)}[n % 5]) for n in range(1, N+1)]
one = [acb(0)]+[acb(1)]*N
issq = [acb(0)]*(N+1)
for j in range(1, 101): issq[j*j] = acb(1)
mu = [0]*(N+1); mu[1] = 1
for i in range(1, N+1):
    for j in range(2*i, N+1, i): mu[j] -= mu[i]
muc = [acb(m) for m in mu]
lam2 = [acb(0)]+[acb(lam[n]**2) for n in range(1, N+1)]
RS = conv(lam2, issq)            # zeta(s) L(s, sym^2 Delta) = L(s, Delta x Delta)
SYM2 = conv(RS, muc)             # L(s, sym^2 Delta)
rep("G0_L(s,sym^2 Delta) alone (control: sign-indefinite expected)", SYM2)
for g in ["14.134725141734693", "85.6993484854"]:
    lg = [acb(0)]+[acb(lam[n])*(acb(0, -1)*arb(g)*arb(n).log()).exp() for n in range(1, N+1)]
    lgb = [acb(0)]+[v.conjugate() if hasattr(v, "conjugate") else acb(v.real, -v.imag) for v in lg[1:]]
    pair = conv(lg, lgb)
    full = conv(conv(one, pair), RS)
    rep("G1_zeta: L(s, Pi x Pi~), Pi = 1 + Delta|.|^{i g}, g=%s" % g, full)
    dh1 = conv(conv(aDH, pair), conv(aDH, SYM2))
    rep("G2_DH in both zeta slots: f * L(s+ig,Delta) L(s-ig,Delta) * f * L(sym^2), g=%s" % g, dh1)
    # coefficient-square with DH: b = aDH * lambda n^{-ig}; |b|^2 >= 0 trivially; defect at (2,3)
    b = conv(aDH, lg); bz = conv(one, lg)
    q = lambda v: v.real*v.real+v.imag*v.imag
    out["G4_|b|^2 at 6 versus (|b|^2 at 2)(|b|^2 at 3), g=%s" % g] = {
        "DH": [float(q(b[6]).mid()), float((q(b[2])*q(b[3])).mid())],
        "zeta": [float(q(bz[6]).mid()), float((q(bz[2])*q(bz[3])).mid())]}
    # H_p for Pi = 1 + Delta|.|^{ig} at sigma = 1: S_p = sum_k |lambda_Pi(p^k)|^2 p^-k ; R_p = L_p(1, Pi x Pi~)
    worst = 0.0; rows = []
    for p in primes[:25]:
        lp = lam[p]; x = arb(1)/p
        # Satake: alpha + 1/alpha = lambda(p), |alpha| = 1
        th = (lp/2).acos(); al = acb(th.cos(), th.sin()); alb = acb(th.cos(), -th.sin())
        ph = (acb(0, -1)*arb(g)*arb(p).log()).exp()
        eig = [acb(1), al*ph, alb*ph]
        # complete homogeneous h_k by recurrence from 1/prod(1 - e x)
        K_ = 200  # tail at p = 2: sum_{k>=200} (k+2)^4 2^-k < 1e-50
        e1 = eig[0]+eig[1]+eig[2]; e2 = eig[0]*eig[1]+eig[0]*eig[2]+eig[1]*eig[2]; e3 = eig[0]*eig[1]*eig[2]
        h = [acb(1), e1, e1*e1-e2]
        for kk in range(3, K_): h.append(e1*h[-1]-e2*h[-2]+e3*h[-3])
        S = arb(0); xp = arb(1)
        for kk in range(K_):
            S += q(h[kk])*xp; xp *= x
        Rr = acb(1)
        for u in eig:
            for v in eig:
                Rr *= 1/(1-u*(acb(v.real, -v.imag))*x)
        lh = (S/Rr.real).log()
        val = float(lh.mid())*p*p; rows.append((p, float(lh.mid()), val)); worst = max(worst, abs(val))
    out["G5_log H_p(1), Pi=1+Delta|.|^{ig}, first 25 primes, g=%s" % g] = {"max p^2 |log H_p(1)|": worst, "rows(p, log H_p, p^2 log H_p)": rows[:6],
        "sum over first 25 primes": float(sum(r[1] for r in rows))}
    print(out["G5_log H_p(1), Pi=1+Delta|.|^{ig}, first 25 primes, g=%s" % g], flush=True)
# T3 (Bochner / max modulus on a line right of 1) for DH: sup_t |f(2+it)| against f(2); tail beyond N <= sum_{n>N} n^-2 < 1.0001e-4
import cmath
af = [0.0]+[float(aDH[n].real.mid()) for n in range(1, N+1)]
w = [0.0]+[af[n]/n**2 for n in range(1, N+1)]
lg_ = [0.0]+[math.log(n) for n in range(1, N+1)]
f2 = sum(w)
best = (0, 0)
def val(t): return abs(sum(w[n]*cmath.exp(-1j*t*lg_[n]) for n in range(1, 400)))  # screen with 400 terms
tt = 0.0
while tt < 60:
    v = val(tt)
    if v > best[0]: best = (v, tt)
    tt += 0.01
tbest = best[1]
vfull = abs(sum(w[n]*cmath.exp(-1j*tbest*lg_[n]) for n in range(1, N+1)))
out["T3_DH_line_sigma=2"] = {"f(2) partial N": f2, "t": tbest, "|f(2+it)| partial N": vfull, "tail bound": 1.0001e-4,
                             "violates |f(2+it)| <= f(2)": bool(vfull - f2 > 2.1e-4)}
print(out["T3_DH_line_sigma=2"])
out["seconds"] = time.time()-t0
json.dump(out, open("tmp/research-2026-11-16/push/c6-quadratic-companion-positivity/test2.json", "w"), indent=1)
print("done", out["seconds"])
