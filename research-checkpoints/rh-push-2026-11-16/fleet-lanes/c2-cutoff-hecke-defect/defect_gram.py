#!/usr/bin/env python3
"""c2-cutoff-hecke-defect: inertia of the Hecke-defect form on the window (c - 2 log P, c].

Object (RESULT.md Lemma 2).  For an even kernel kappa and a test a supported in (-inf, c],
    <a, H_c a> = alpha * int_0^inf int_0^inf conj a(u) M(u,v) a(v) du dv   (u = c - position >= 0),
    M(u,v) = int_0^inf (2 r + u + v) kappa(r + u) kappa(r + v) dr = Gamma_1 Gamma_0 + Gamma_0 Gamma_1,
Gamma_j = Hankel operator with kernel x^j kappa(x).  The range of D_p = [Q_c, V_p] is L^2(c - 2 log p, c],
so the Gram matrix of {D_p y} in the H_c form is a restriction of M to (0, 2 log p].
Tests here: point masses at nodes u_i = (i + 1/2) h (limits of L^2 bumps; M is continuous).
Output: inertia (n+, n-, unresolved) of [M(u_i, u_j)] for the nodes inside each prime window.

Arithmetic: python-flint arb balls.  The r-quadrature is composite Gauss-Legendre on a graded mesh;
its truncation error is NOT inside the balls (checked by rerunning with different m): MEASURED.
"""
import sys, json, time, math, argparse
from flint import arb, arb_mat, ctx

ap = argparse.ArgumentParser()
ap.add_argument('--kernel', default='zeta')
ap.add_argument('--P', type=int, default=7)
ap.add_argument('--h', type=float, default=0.05)
ap.add_argument('--m', type=int, default=120)
ap.add_argument('--dps', type=int, default=300)
ap.add_argument('--tol', type=float, default=1e-100)
ap.add_argument('--ltol', type=float, default=None, help='log10 of the pivot tolerance (for values below float range)')
ap.add_argument('--tau', type=float, default=-2.0)
ap.add_argument('--a', type=float, default=0.2)
ap.add_argument('--panel', type=float, default=0.25)
ap.add_argument('--out', default='')
args = ap.parse_args()
ctx.dps = args.dps
PREC = ctx.prec
PI = arb.pi()
C2 = 2 * PI * PI
C1 = 3 * PI
LOG2x2 = 2 * arb(2).log()

def liouville(n):
    s = 1; d = 2
    while d * d <= n:
        while n % d == 0:
            n //= d; s = -s
        d += 1
    if n > 1: s = -s
    return s

def kappa_zeta(x, coef=None, nmax=10**9):
    """sum_n coef(n) (2 pi^2 n^4 e^{9x/4} - 3 pi n^2 e^{5x/4}) exp(-pi n^2 e^x), x real."""
    E = x.exp(); q = (-PI * E).exp(); E14 = E.root(4)
    t9 = E * E * E14; t5 = E * E14
    Ef = float(E.mid()) if E < 1e300 else 1e300
    tot = arb(0); n = 1
    while n <= nmax:
        if n > 1 and math.pi * Ef * (n * n - 1) * 1.4427 > PREC + 40: break
        c = 1 if coef is None else coef(n)
        if c:
            n2 = n * n
            tot += c * (C2 * (n2 * n2) * t9 - C1 * n2 * t5) * q ** n2
        n += 1
    return tot

def kappa_zeta_even(x):
    return kappa_zeta(abs(x))

SQ5 = arb(5).sqrt()
XI = ((10 - 2 * SQ5).sqrt() - 2) / (SQ5 - 1)
DHA = [arb(0), arb(1), XI, -XI, arb(-1)]
def kappa_dh(x):
    """e^{3x/4} sum a(n) n exp(-pi n^2 e^x / 5): xi_DH(1/2+z) = const * int kappa e^{zu/2} du."""
    E = x.exp(); q = (-PI * E / 5).exp()
    Ef = float(E.mid()) if E < 1e300 else 1e300
    tot = arb(0); n = 1
    while True:
        if n > 1 and math.pi * Ef / 5 * (n * n - 1) * 1.4427 > PREC + 40: break
        r = n % 5
        if r: tot += DHA[r] * n * q ** (n * n)
        n += 1
    return (x * 3 / 4).exp() * tot

def make_kernel(name):
    if name == 'zeta': return kappa_zeta
    if name == 'seed': return lambda x: kappa_zeta(x, nmax=1)          # n = 1 term only (no theta sum)
    if name == 'liouville': return lambda x: kappa_zeta(x, coef=liouville)  # Hankel (symmetrised) form
    if name == 'dh': return kappa_dh
    if name == 'heat':
        tau = arb(args.tau)
        return lambda x: kappa_zeta(x) * (tau * x * x / 16).exp()
    if name == 'tnr':   # xi(s) (2^z + 2^-z + 2.05): kappa(u - 2 log 2) + kappa(u + 2 log 2) + 2.05 kappa(u)
        c = arb('2.05')
        return lambda x: kappa_zeta_even(x - LOG2x2) + kappa_zeta(x + LOG2x2) + c * kappa_zeta(x)
    if name == 'ea':    # xi(s+a) xi(s-a): Bessel-K double sum (RESULT.md section 4)
        a = arb(str(args.a))
        def k(x):
            Eh = (x / 2).exp(); Ef = float(Eh.mid())
            tot = arb(0)
            # terms (alpha, cn, pn) x (beta, cm, pm): c * n^pn e^{alpha v}, alpha in {9/4, 5/4}
            T = [(arb(9) / 4, C2, 4), (arb(5) / 4, -C1, 2)]
            mn = 1
            while True:
                if mn > 1 and 2 * math.pi * Ef * (mn - 1) * 1.4427 > PREC + 40: break
                for n in range(1, mn + 1):
                    if mn % n: continue
                    mm = mn // n
                    z = 2 * PI * mn * Eh
                    ratio = arb(mm) / n * Eh
                    for (al, ca, pa) in T:
                        for (be, cb, pb) in T:
                            nu = al - be + a
                            tot += ca * cb * n ** pa * mm ** pb * ((be - a / 2) * x).exp() \
                                   * ratio ** nu * 2 * z.bessel_k(nu)
                mn += 1
            return tot
        return k
    if name == 'ea2':   # xi(s+a) xi(s-a) by direct convolution: kappa_a(x) = e^{-ax/2} int kappa(v) kappa(x-v) e^{av} dv
        a = arb(str(args.a)); mi = 40; VM = 4.25
        gli = [arb.legendre_p_root(mi, k, True) for k in range(mi)]
        def k(x):
            xf = float(x.mid())
            bk = sorted(set([-VM + 0.25 * i for i in range(int((xf + 2 * VM) / 0.25) + 2) if -VM + 0.25 * i < xf + VM] + [0.0, xf + VM]))
            pts = [arb(b) for b in bk]
            # insert the exact point x so every panel is analytic (kappa(|.|) is analytic and even; kept as a safeguard)
            pts = sorted(pts + [x], key=lambda t: float(t.mid()))
            tot = arb(0)
            for lo, hi in zip(pts[:-1], pts[1:]):
                hw = (hi - lo) / 2; md = (hi + lo) / 2
                if not (hw > 0): continue
                for (xk, wk) in gli:
                    v = md + hw * xk
                    tot += hw * wk * kappa_zeta_even(v) * kappa_zeta_even(x - v) * (a * v).exp()
            return (-a * x / 2).exp() * tot
        return k
    raise SystemExit('unknown kernel')

kap = make_kernel(args.kernel)
primes = [p for p in range(2, args.P + 1) if all(p % d for d in range(2, int(p ** 0.5) + 1))]
U = 2 * math.log(args.P)
nodes = []
i = 0
while (i + 0.5) * args.h <= U:
    nodes.append((i + 0.5) * args.h); i += 1
n = len(nodes)

# rate of the slowest / fastest decay of kappa(r+u) in e^r
rate = math.pi / 5 if args.kernel == 'dh' else math.pi
lam_max = 2 * rate * math.exp(U)
lam_min = 2 * rate
target = (args.dps * 0.5) * math.log(10)           # tail neglected below 10^(-dps/2) relative
Rmax = math.log(1 + target / lam_min)
if args.kernel in ('ea', 'ea2'): Rmax = 2 * math.log(1 + target / (4 * math.pi))   # decay exp(-4 pi e^{x/2})
# graded panels: [0,d],[d,2d],... doubling to args.panel, then uniform
d0 = min(args.panel, 100.0 / lam_max)
brk = [0.0, d0]
while brk[-1] < args.panel: brk.append(brk[-1] * 2)
while brk[-1] < Rmax: brk.append(brk[-1] + args.panel)
t0 = time.time()
gl = [arb.legendre_p_root(args.m, k, True) for k in range(args.m)]
rn = []; rw = []
for a_, b_ in zip(brk[:-1], brk[1:]):
    hw = (arb(b_) - arb(a_)) / 2; mid = (arb(a_) + arb(b_)) / 2   # exact in arb: float a_+b_ would round (1e-17 gaps)
    for (xk, wk) in gl:
        rn.append(mid + hw * xk); rw.append(hw * wk)
Nr = len(rn)
print(f'kernel={args.kernel} P={args.P} window U={U:.4f} nodes n={n} h={args.h} panels={len(brk)-1} '
      f'r-nodes={Nr} Rmax={Rmax:.3f} dps={args.dps}', flush=True)
print(f'planned allocation: 2 x {n} x {args.m} per panel + 3 x {n}^2 = {2*n*args.m+3*n*n} arb of {PREC} bits ~ {(2*n*args.m+3*n*n)*(PREC/8+64)/1e6:.0f} MB', flush=True)

sw = [w.sqrt() for w in rw]
# built panel by panel (chunk = one panel) so that only n x m arbs are alive at a time
G = arb_mat(n, n)
ua = [arb(u) for u in nodes]
for c0 in range(0, Nr, args.m):
    cols = range(c0, min(c0 + args.m, Nr))
    B0 = arb_mat(n, len(cols)); B1 = arb_mat(n, len(cols))
    for i in range(n):
        for jj, j in enumerate(cols):
            x = ua[i] + rn[j]
            v = kap(x) * sw[j]
            B0[i, jj] = v
            B1[i, jj] = v * x
    G = G + B1 * B0.transpose()
    if (c0 // args.m) % 10 == 0: print(f'  panel {c0 // args.m}/{Nr // args.m}  {time.time()-t0:.0f}s', flush=True)
M = G + G.transpose()
print(f'matrix built {time.time()-t0:.0f}s', flush=True)

def mag10(x):
    """log10 |mid(x)| as float, safe for tiny values."""
    m = abs(x.mid())
    if m == 0: return -1e9
    return float(m.log() / arb(10).log())

diag_log = [mag10(M[i, i]) for i in range(n)]
dsc = []
for i in range(n):
    d = abs(M[i, i])
    dsc.append(1 / d.sqrt() if d > 0 else arb(1))

def inertia(k, tol):
    """pivoted symmetric elimination (1x1 and 2x2 pivots) on the scaled leading k x k block."""
    A = [[M[i, j] * dsc[i] * dsc[j] for j in range(k)] for i in range(k)]
    act = list(range(k)); pos = neg = 0; piv = []; uncertain = 0
    ltol = args.ltol if args.ltol is not None else math.log10(tol)
    while act:
        bd, bi = -1e9, None
        for i in act:
            m_ = mag10(A[i][i])
            if m_ > bd: bd, bi = m_, i
        bo, bij = -1e9, None
        for x_, i in enumerate(act):
            for j in act[x_ + 1:]:
                m_ = mag10(A[i][j])
                if m_ > bo: bo, bij = m_, (i, j)
        if max(bd, bo) < ltol: break
        if bd >= bo - 1 or bij is None:
            p = bi; d = A[p][p]
            if d > 0: pos += 1; piv.append((1, round(bd, 2)))
            elif d < 0: neg += 1; piv.append((-1, round(bd, 2)))
            else: uncertain += 1
            if not (d > 0 or d < 0): break
            act.remove(p)
            col = {i: A[i][p] / d for i in act}
            for i in act:
                ci = col[i]
                for j in act:
                    if j >= i:
                        A[i][j] = A[i][j] - ci * A[p][j]; A[j][i] = A[i][j]
        else:
            p, q = bij
            a_, b_, c_ = A[p][p], A[p][q], A[q][q]
            det = a_ * c_ - b_ * b_
            if not (det < 0 or det > 0): uncertain += 1; break
            if det < 0: pos += 1; neg += 1; piv.append((0, round(bo, 2)))
            else:
                if a_ + c_ > 0: pos += 2
                else: neg += 2
                piv.append((2, round(bo, 2)))
            act.remove(p); act.remove(q)
            rows = {i: (A[i][p], A[i][q]) for i in act}
            for i in act:
                x1, x2 = rows[i]
                y1 = (x1 * c_ - x2 * b_) / det; y2 = (x2 * a_ - x1 * b_) / det
                for j in act:
                    if j >= i:
                        A[i][j] = A[i][j] - y1 * A[p][j] - y2 * A[q][j]; A[j][i] = A[i][j]
    return pos, neg, len(act), uncertain, piv

res = {'kernel': args.kernel, 'P': args.P, 'h': args.h, 'm': args.m, 'dps': args.dps, 'tol': args.tol,
       'tau': args.tau, 'a': args.a, 'n': n, 'Nr': Nr, 'diag_log10': diag_log, 'windows': []}
# a few raw entries for the quadrature cross-check between runs
res['probe'] = {f'{i},{j}': M[i, j].str(60, radius=False) for (i, j) in [(0, 0), (0, min(5, n-1)), (n//2, n//2), (n-1, n-1), (0, n-1)]}
for p in primes:
    k = sum(1 for u in nodes if u <= 2 * math.log(p))
    if k == 0: continue
    pos, neg, unres, unc, piv = inertia(k, args.tol)
    negp = [x[1] for x in piv if x[0] <= 0]
    print(f'window p={p:3d} (0,{2*math.log(p):.3f}] nodes={k:3d}: n+={pos} n-={neg} unresolved={unres} '
          f'uncertain={unc} smallest resolved log10|pivot|={min([x[1] for x in piv], default=0)} '
          f'neg/2x2 pivots log10={negp[:8]}  {time.time()-t0:.0f}s', flush=True)
    res['windows'].append({'p': p, 'nodes': k, 'pos': pos, 'neg': neg, 'unresolved': unres, 'uncertain': unc,
                           'pivots': piv})
if args.out:
    json.dump(res, open(args.out, 'w'))
print('done', time.time() - t0)
