# Second pass of Part 1 (direct interval enclosures, no mean-value form; 400 bits, M = 50, start width 1/100): ball certificate for the DH theta kernel. Own derivation (Stirling/Touchard form, mean-value form).
import json, sys, time
from math import comb
from flint import arb, ctx
ctx.prec = 400
t0 = time.time()
PI = arb.pi(); C = PI/5
s5 = arb(5).sqrt()
k0 = ((10 - 2*s5).sqrt() - 2)/(s5 - 1)
A = [arb(0), arb(1), k0, -k0, arb(-1)]
M = 50; JMAX = 5
# Stirling numbers of the second kind
S = [[0]*(JMAX+2) for _ in range(JMAX+2)]; S[0][0] = 1
for j in range(1, JMAX+2):
    for k in range(1, j+1):
        S[j][k] = k*S[j-1][k] + S[j-1][k-1]
def Bj(j):
    tot = arb(0)
    for k in range(0, j+1):
        if S[j][k]:
            tot += S[j][k]*((2*arb(k)/arb(1).exp())**k if k > 0 else arb(1))
    return tot
bb = PI/10
TAIL = [Bj(j)*(-bb*M*M).exp()/(2*bb) for j in range(JMAX+2)]   # valid for x >= 1
def pm(r):  # ball [-r, r]
    r = arb(r); return arb(0, r.abs_upper())
def thetas(u, jmax):
    """enclosures of D^j theta at x = e^u, j = 0..jmax; u a ball with e^u >= 1"""
    x = u.exp()
    out = [arb(0) for _ in range(jmax+1)]
    for n in range(1, M+1):
        a = A[n % 5]
        if n % 5 == 0: continue
        y = C*n*n*x
        e = (-y).exp()*a*n
        my = -y; pw = [arb(1)]
        for k in range(1, jmax+1): pw.append(pw[-1]*my)
        for j in range(jmax+1):
            p = arb(0)
            for k in range(j+1):
                if S[j][k]: p += S[j][k]*pw[k]
            out[j] += p*e
    return [out[j] + pm(TAIL[j]) for j in range(jmax+1)]
def Lders(u, nmax):
    """L^(1..nmax) enclosures and theta_0, from theta_0..theta_nmax"""
    th = thetas(u, nmax)
    g = []
    for n in range(nmax):
        acc = th[n+1]
        for k in range(n): acc -= comb(n, k)*g[k]*th[n-k]
        g.append(acc/th[0])
    Ld = [None, arb(3)/4 + g[0]] + g[1:]
    return th[0], Ld          # Ld[k] = L^(k)
def ball(lo, hi):
    m = (arb(lo)+arb(hi))/2; r = (arb(hi)-arb(lo))/2
    return m, r, m + pm(r)
from fractions import Fraction as Fr
def fr2arb(q): return arb(q.numerator)/arb(q.denominator)
def certify(lo, hi, test, minw, stats, bad):
    stack = []
    w0 = Fr(1, 100); q = lo
    while q < hi:
        stack.append((q, min(q+w0, hi))); q += w0
    n_ok = 0
    while stack:
        a, b = stack.pop()
        ok, vals = test(fr2arb(a), fr2arb(b))
        if ok:
            n_ok += 1
            for key, v in vals.items():
                stats[key] = max(stats.get(key, -1e300), v)
            stats['minwidth'] = min(stats.get('minwidth', 1.0), float(b-a))
        elif b - a <= minw:
            bad.append((float(a), float(b), {k: v for k, v in vals.items()}))
        else:
            mid = (a+b)/2; stack.append((a, mid)); stack.append((mid, b))
    return n_ok
def up(z): return float(z.upper())
def lo_(z): return float(z.lower())
def testA(a, b):
    m, r, I = ball(a, b)
    thI, LI = Lders(I, 5)
    thm, Lm = Lders(m, 4)
    L2 = LI[2]
    L4 = LI[4]
    ok = (thI > 0) and (L2 < 0) and (L4 < 0)
    return bool(ok), {'neg_theta_lower': -lo_(thI), 'L2_upper': up(L2), 'L4_upper': up(L4)}
def testB(a, b):
    m, r, I = ball(a, b)
    thI, LI = Lders(I, 3)
    thm, Lm = Lders(m, 2)
    L2 = LI[2]
    h = I*LI[2] - LI[1]
    ok = (thI > 0) and (L2 < 0) and (h < 0)
    return bool(ok), {'neg_theta_lower': -lo_(thI), 'L2_upper': up(L2), 'h_upper': up(h)}
res = {'prec_bits': ctx.prec, 'M': M, 'k0': str(k0), 'tail_radius_j0..5': [str(t) for t in TAIL[:6]]}
minw = Fr(1, 2**20)
stA, badA = {}, []
nA = certify(Fr(0), Fr(3, 5), testA, minw, stA, badA)
stB, badB = {}, []
nB = certify(Fr(1, 4), Fr(3), testB, minw, stB, badB)
res['regionA'] = {'range': [0, 0.6], 'intervals_certified': nA, 'not_certified': badA, 'stats': stA}
res['regionB'] = {'range': [0.25, 3], 'intervals_certified': nB, 'not_certified': badB, 'stats': stB}
# point values at 0
th0, L0 = Lders(arb(0), 5)
res['at0'] = {'theta': str(th0), 'L1': str(L0[1]), 'L2': str(L0[2]), 'L3': str(L0[3]), 'L4': str(L0[4]), 'L5': str(L0[5])}
# evenness check: theta(1/x) = x^{3/2} theta(x); needs x < 1, so use a separate full sum with more terms
def theta_any(x, N=400):
    tot = arb(0)
    for n in range(1, N+1):
        if n % 5: tot += A[n % 5]*n*(-C*n*n*x).exp()
    # tail: n e^{-c n^2 x}, sum_{n>N} <= e^{-c x N^2}/(2 c x)
    return tot + pm((-C*x*N*N).exp()/(2*C*x))
ev = {}
for xs in ['0.5', '0.25', '0.8']:
    x = arb(xs); d = theta_any(1/x) - x**arb('1.5')*theta_any(x)
    ev[xs] = {'diff': str(d), 'contains0': bool(d.contains(0))}
res['evenness'] = ev
# tail region u >= 3
X0 = arb(3).exp()
rho = []
for j in range(3):
    tot = arb(0)
    for n in range(2, M+1):
        if n % 5 == 0: continue
        y = C*(n*n-1)*X0
        p = arb(0)
        for k in range(j+1):
            if S[j][k]: p += S[j][k]*y**k
        tot += n*p*(-y).exp()      # |a(n)| <= 1
    rho.append(tot + TAIL[j])
e1 = rho[1]/(1-rho[0]); e2 = (rho[2]*(1+rho[0]) + rho[1]**2)/(1-rho[0])**2
cX = C*X0
L2_tail = -cX + e2
h_tail = -(3-1)*(cX - e2) - arb(3)/4 + e2 + e1
res['tail'] = {'U': 3, 'min_y': str(C*3*X0), 'rho': [str(r) for r in rho], 'e1': str(e1), 'e2': str(e2),
               'one_minus_rho0_positive': bool(1-rho[0] > 0), 'cX0_minus_e2_positive': bool(cX-e2 > 0),
               'L2_upper_bound': str(L2_tail), 'L2_neg': bool(L2_tail < 0),
               'h_upper_bound_at_u=3 (decreasing in u)': str(h_tail), 'h_neg': bool(h_tail < 0)}
res['seconds'] = time.time()-t0
res['verdict'] = {'uncertified_subintervals': len(badA)+len(badB),
                  'all': bool(len(badA)+len(badB) == 0 and L2_tail < 0 and h_tail < 0 and 1-rho[0] > 0)}
json.dump(res, open('ref_part1.json', 'w'), indent=1)
print(json.dumps(res, indent=1))
