# Small-case tests of the cover dictionary. Exact / float, single process.
import numpy as np, cmath, math
from fractions import Fraction as Fr

def primes_upto(n):
    s = np.ones(n+1, bool); s[:2] = False
    for i in range(2, int(n**.5)+1):
        if s[i]: s[i*i::i] = False
    return np.nonzero(s)[0]

def primroot(p):
    fs = set(); m = p-1; d = 2
    while d*d <= m:
        while m % d == 0: fs.add(d); m //= d
        d += 1
    if m > 1: fs.add(m)
    g = 2
    while any(pow(g, (p-1)//f, p) == 1 for f in fs): g += 1
    return g

def chars(p, r):
    """order-r character chi on F_p^* as complex array indexed by x (chi[0]=0), via discrete log."""
    g = primroot(p); ind = np.zeros(p, np.int64); x = 1
    for k in range(p-1):
        ind[x] = k; x = x*g % p
    chi = np.exp(2j*np.pi*(ind % r)/r); chi[0] = 0
    return chi, ind, g

def gauss(chi, p):
    x = np.arange(p)
    return np.sum(chi*np.exp(2j*np.pi*x/p))

print("== T1 Gauss-lemma holonomy on E[pi], E = C/Z[omega], Aut(E) = mu_6 (split primes p = 1 mod 6)")
ok = tot = 0
for p in [7, 13, 19, 31, 37, 43, 61, 67, 73, 79, 97, 103, 109, 127, 139, 151, 157, 163, 181, 193, 199]:
    g = primroot(p); z = pow(g, (p-1)//6, p)           # generator of mu_6 in F_p^* = (O/pi)^*
    mu6 = [pow(z, k, p) for k in range(6)]
    seen = {}; R = []
    for x in range(1, p):
        if x not in seen:
            R.append(x)
            for k, u in enumerate(mu6): seen[x*u % p] = (x, k)   # x*zeta^k -> (rep, k)
    for a in range(2, min(p, 40)):
        e = sum(seen[a*r % p][1] for r in R) % 6        # total deck exponent of mult-by-a on E[pi]/mu_6
        tot += 1; ok += (pow(z, e, p) == pow(a, (p-1)//6, p))
print(f"   transfer exponent == sextic symbol a^((Np-1)/6): {ok}/{tot}")

print("== T2 Moebius absorption by the quadratic (spin) character, r = 6 -> nu = 3")
mx = 0
for p in [7, 13, 19, 31, 37, 43, 61, 67, 73, 79, 97, 103, 109, 127]:
    chi, ind, g = chars(p, 6); rho = np.exp(1j*np.pi*(ind % 2)); rho[0] = 0
    for sg in (1, -1):
        c = chi if sg == 1 else np.conj(chi)
        x = np.arange(p)
        J = np.sum(c[x]*rho[(1-x) % p])
        lhs = -gauss(c, p)                              # mu(pi) g(chi^sg)
        rhs = -J*gauss(c*rho, p)/gauss(rho, p)
        mx = max(mx, abs(lhs-rhs))
        cr = c*rho; o = [k for k in range(1, 7) if np.allclose(cr[1:]**k, 1)][0]
        assert o == 3
print(f"   max |mu g(chi) - (-J(chi,rho)) g(chi rho)/g(rho)| = {mx:.2e}; ord(chi rho) = 3 in all cases")

print("== T3 deck holonomy (normalised Gauss sum) by cover degree, primes p = 1 mod 12, p < 40000")
ps = [int(p) for p in primes_upto(40000) if p % 12 == 1]
for r in (2, 3, 4, 6):
    vals = []
    for p in ps:
        chi, ind, g = chars(p, r)
        vals.append(gauss(chi, p)/math.sqrt(p))
    vals = np.array(vals)
    ang = np.angle(vals)
    # distinct values up to 1e-6 and order-r power test
    nd = len(set(np.round(ang, 6)))
    print(f"   r={r}: primes {len(ps)}, max||g|/sqrt p - 1| = {np.max(np.abs(np.abs(vals)-1)):.1e}, distinct arg values = {nd}, |mean| = {abs(vals.mean()):.4f}, |mean of (g/sqrt p)^r| = {abs((vals**r).mean()):.4f}")

print("== T4 wall arithmetic (exact): sigma0 = 1 - h/r + G + k/2, distance d = sigma0 - 1/2")
def wall(lx, ly, l, r=6):
    M = lx+ly; b = ly-lx; h = 1-lx+l
    G = max(Fr(0), b/(2*r), b-ly/2)
    k = max(Fr(0), (1+3*l-2*M)/4, M+l-1, (3*l-1)/2)
    return 1-h/r+G+k/2, h, G, k
for name, (lx, ly, l) in {"Part I (balanced, no primes)": (Fr(1,2), Fr(1,2), Fr(0)),
                          "low-side floor point": (Fr(2,5), Fr(2,5), Fr(1,5))}.items():
    s, h, G, k = wall(lx, ly, l); print(f"   {name}: lx,ly,l={lx},{ly},{l}: h={h}, G={G}, k={k}, sigma0={s}, d={s-Fr(1,2)}")
# Part II: find geometry with h = 13/16, b = 1/8 on the balanced line M + l = 1
# h = 1 - lx + l = 13/16, b = ly - lx = 1/8, M + l = 1  -> solve
import sympy as sp
lx, ly, l = sp.symbols('lx ly l')
sol = sp.solve([1-lx+l-sp.Rational(13,16), ly-lx-sp.Rational(1,8), lx+ly+l-1], [lx, ly, l])
s, h, G, k = wall(Fr(sol[lx].p, sol[lx].q), Fr(sol[ly].p, sol[ly].q), Fr(sol[l].p, sol[l].q))
print(f"   Part II (h=13/16, b=1/8, M+l=1): lx,ly,l={sol[lx]},{sol[ly]},{sol[l]}: G={G}, k={k}, sigma0={s}, d={s-Fr(1,2)}")
print("   ideal floor by deck order r (h = 1, G = k = 0): d = 1/2 - 1/r")
for r in (2, 3, 4, 6, 8, 12):
    print(f"     r={r}: sigma0 = {1-Fr(1,r)}, d = {Fr(1,2)-Fr(1,r)}")
