"""Pellikaan numerator P_C(T,u) for hyperelliptic curves from (N_1..N_g), and the set I_C of u>0 with all
zeros on |T| = u^{-1/2}, computed with certified root isolation (python-flint / Arb)."""
import sys, json, math
from fractions import Fraction as Fr
from flint import fmpz_poly, fmpq_poly, fmpq, fmpz, ctx, arb, fmpq_mat
import sympy as sp
ctx.prec = 200

# ---------- u-polynomials as python int lists (low degree first)
def padd(a, b):
    n = max(len(a), len(b)); return [(a[i] if i < len(a) else 0) + (b[i] if i < len(b) else 0) for i in range(n)]
def pmul(a, b):
    r = [0]*(len(a)+len(b)-1)
    for i, x in enumerate(a):
        for j, y in enumerate(b): r[i+j] += x*y
    return r
def pscale(a, c): return [c*x for x in a]

def weil_data(q, g, N):
    """L(T) (ints), h, A_m (effective divisor counts) from N_1..N_g."""
    D = 2*g + 3
    # exp(sum N_k T^k/k) up to degree g
    E = [Fr(1)] + [Fr(0)]*g
    for n in range(1, g+1):
        E[n] = sum(Fr(N[k-1]) * E[n-k] for k in range(1, n+1)) / n
    A = [int(e) for e in E]; assert all(Fr(a) == e for a, e in zip(A, E)), "non-integral A_m"
    L = [0]*(2*g+1)
    for n in range(g+1):
        L[n] = A[n] - (q+1)*(A[n-1] if n >= 1 else 0) + q*(A[n-2] if n >= 2 else 0)
    for n in range(g+1, 2*g+1):
        L[n] = q**(n-g) * L[2*g-n]
    return L, sum(L), A

def pellikaan_P(q, g, N, hyper=True):
    """Return (P, h, b): P[n] = u-polynomial coefficient of T^n, n=0..2g."""
    L, h, A = weil_data(q, g, N)
    pi = lambda j: (q**(j+1)-1)//(q-1)
    # R_m: rational effective divisors of degree m without hyperelliptic fibre (m <= g-1)
    R = []
    for m in range(g):
        R.append(A[m] - sum(pi(j)*R[m-2*j] for j in range(1, m//2+1)))
    assert all(r >= 0 for r in R)
    b = {}
    for n in range(g):                      # n <= g-1
        row = {}
        k = 1
        while n - 2*(k-1) >= 0:
            row[k] = R[n-2*(k-1)]; k += 1
        row[0] = h - sum(row.values()); assert row[0] >= 0
        b[n] = row
    for n in range(g-1, 2*g-1):             # n >= g-1 by Riemann-Roch
        n2 = 2*g-2-n
        row = {k + n + 1 - g: v for k, v in b[n2].items()}
        if n == g-1: assert row == b[n]
        b[n] = row
    D = 2*g + 3
    Z = []
    for n in range(D+1):
        row = b[n] if n <= 2*g-2 else {n+1-g: h}
        z = [0]
        for k, v in row.items():
            if k >= 1: z = padd(z, [v]*k)          # (u^k-1)/(u-1) = 1+..+u^{k-1}
        Z.append(z)
    P = []
    for n in range(D+1):
        c = Z[n]
        if n >= 1: c = padd(c, pmul([-1, -1], Z[n-1]))
        if n >= 2: c = padd(c, pmul([0, 1], Z[n-2]))
        while len(c) > 1 and c[-1] == 0: c.pop()
        P.append(c)
    # self-tests: degree 2g, value at u=q is L, functional equation, P(1,u) = h
    assert all(P[n] == [0] for n in range(2*g+1, D+1)), "numerator degree"
    ev = lambda c, x: sum(ci*x**i for i, ci in enumerate(c))
    assert [ev(P[n], q) for n in range(2*g+1)] == L, "u=q is not L"
    for k in range(g+1):
        lhs = P[2*g-k] + [0]*0
        rhs = [0]*(g-k) + P[k]
        strip = lambda c: (lambda c: c if c else [0])([x for x in c][:max((i+1 for i, x in enumerate(c) if x), default=0)])
        assert strip(lhs) == strip(rhs), "FE"
    tot = [0]
    for n in range(2*g+1): tot = padd(tot, P[n])
    while len(tot) > 1 and tot[-1] == 0: tot.pop()
    assert tot == [h], "P(1,u)=h"
    return P[:2*g+1], h, b, L

# ---------- G(y,u): P(T,u) T^{-g} u^{-g/2}.. in y = alpha + u/alpha  (zeros T = 1/alpha)
Y, U, S = sp.symbols('y u s')
def G_poly(P, g):
    Dk = [sp.Integer(2), Y]
    for k in range(2, g+1): Dk.append(sp.expand(Y*Dk[-1] - U*Dk[-2]))
    pu = lambda c: sum(ci*U**i for i, ci in enumerate(c))
    G = pu(P[g]) + sum(pu(P[g-k])*Dk[k] for k in range(1, g+1))
    return sp.Poly(sp.expand(G), Y)

def to_fmpz_poly(expr, var):
    p = sp.Poly(expr, var)
    co = p.all_coeffs()[::-1]
    den = sp.ilcm(*[sp.Rational(c).q for c in co]) if co else 1
    return fmpz_poly([int(sp.Rational(c)*den) for c in co])

def pos_real_roots(fp):
    """certified positive real roots (arb balls) of squarefree part of fmpz_poly fp."""
    if fp.degree() < 1: return []
    out = []
    for fac, mult in fp.factor()[1]:
        for r, m in fac.complex_roots():
            if r.imag == 0 and r.real > 0: out.append((r.real, mult))
            elif r.imag == 0 and not (r.real < 0) and not (r.real == 0): raise RuntimeError("undecided sign")
    return out

def member(Gy, g, s):
    """exact test at rational s>0 (generic): all g roots of G(y,s^2) real, distinct, in (-2s,2s)?  returns (bool, generic)"""
    co = [sp.Rational(c.subs(U, s*s)) for c in Gy.all_coeffs()[::-1]]
    den = sp.ilcm(*[c.q for c in co])
    fp = fmpz_poly([int(c*den) for c in co])
    n = 0
    for fac, mult in fp.factor()[1]:
        for r, m in fac.complex_roots():
            if r.imag == 0:
                x = r.real; b = arb(fmpq(int(s.p), int(s.q)))*2
                if x < b and x > -b: n += mult
                elif x > b or x < -b: pass
                else: raise RuntimeError("undecided")
    return n == g

def to_fmpq_poly_u(expr):
    p = sp.Poly(sp.expand(expr), U)
    return fmpq_poly([fmpq(int(sp.Rational(c).p), int(sp.Rational(c).q)) for c in p.all_coeffs()[::-1]])

def member_closed(Gy, g, u0):
    """exact closed test at rational u0: all roots (with multiplicity) real and in [-2 sqrt u0, 2 sqrt u0]."""
    co = [sp.Rational(c.subs(U, u0)) for c in Gy.all_coeffs()[::-1]]
    den = sp.ilcm(*[c.q for c in co])
    fp = fmpz_poly([int(c*den) for c in co])
    edge = fmpz_poly([-4*int(u0.p), 0, int(u0.q)])          # q y^2 - 4p
    b = (arb(fmpq(int(u0.p), int(u0.q)))).sqrt()*2
    n = 0
    for fac, mult in fp.factor()[1]:
        if fac.degree() >= 1 and (edge % fac if False else edge.gcd(fac)).degree() == fac.degree():
            n += fac.degree()*mult; continue
        for r, m in fac.complex_roots():
            if r.imag == 0:
                x = r.real
                if x < b and x > -b: n += mult
                elif x > b or x < -b: pass
                else: raise RuntimeError("undecided")
    return n == g

def I_C(P, g):
    Gy = G_poly(P, g)
    Gs = Gy.as_expr()
    crit = {}
    disc = sp.discriminant(Gy.as_expr(), Y) if g >= 2 else sp.Integer(1)
    crit['coll'] = to_fmpz_poly(sp.expand(disc.subs(U, S**2)), S) if g >= 2 else fmpz_poly([1])
    crit['cen+'] = to_fmpz_poly(sp.expand(Gs.subs({Y: 2*S, U: S**2})), S)     # alpha = +sqrt u : zero at T = +u^{-1/2}
    crit['cen-'] = to_fmpz_poly(sp.expand(Gs.subs({Y: -2*S, U: S**2})), S)    # zero at T = -u^{-1/2}
    critu = [to_fmpq_poly_u(disc), to_fmpq_poly_u(sp.expand(Gs.subs(Y, 2*S).subs(S, sp.sqrt(U)) * Gs.subs(Y, -2*S).subs(S, sp.sqrt(U))))]
    roots = []
    for name, fp in crit.items():
        for r, mu in pos_real_roots(fp): roots.append((r, name if mu == 1 else name + '^%d' % mu))
    roots.sort(key=lambda t: float(t[0].mid()))
    # merge coincident roots (same ball overlap) -> list of (ball, set(names))
    merged = []
    for r, name in roots:
        if merged and merged[-1][0].overlaps(r): merged[-1][1].add(name)
        else: merged.append([r, {name}])
    # sample points
    pts = []
    def rat_between(a, b):
        return sp.Rational(str(Fr((a+b)/2).limit_denominator(10**12)))
    fl = [float(m[0].mid()) for m in merged]
    for i in range(len(merged)+1):
        lo = 0.0 if i == 0 else fl[i-1]; hi = (fl[-1]*2+1 if fl else 1.0) if i == len(merged) else fl[i]
        smp = rat_between(lo, hi)
        if i > 0: assert merged[i-1][0] < arb(fmpq(int(smp.p), int(smp.q)))
        if i < len(merged): assert merged[i][0] > arb(fmpq(int(smp.p), int(smp.q)))
        pts.append(member(Gy, g, smp))
    # isolated points: critical values with no member neighbour interval; exact closed test when u0 = s0^2 is rational
    iso = []; undet = 0
    for i, (r, names) in enumerate(merged):
        if pts[i] or pts[i+1]: continue
        if len(names) == 1 and '^' not in next(iter(names)): continue      # a single simple event cannot give an isolated member
        u0 = Fr(float(r.mid())**2).limit_denominator(1000)
        if not (r*r).overlaps(arb(fmpq(u0.numerator, u0.denominator))) or not any(
                c(fmpq(u0.numerator, u0.denominator)) == 0 for c in critu):
            undet += 1; continue
        if member_closed(Gy, g, sp.Rational(u0.numerator, u0.denominator)): iso.append((float(u0), names))
    I_C.iso = iso; I_C.undet = undet
    comps = []; i = 0
    while i < len(pts):
        if pts[i]:
            j = i
            while j+1 < len(pts) and pts[j+1]: j += 1
            lo = (0.0, {'zero'}) if i == 0 else (fl[i-1], merged[i-1][1])
            hi = (math.inf, {'inf'}) if j == len(merged) else (fl[j], merged[j][1])
            comps.append((lo, hi)); i = j+1
        else: i += 1
    return comps, Gy, crit
