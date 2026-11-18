"""Part C. Interval certificate (python-flint Arb) for the Davenport-Heilbronn theta kernel
   kappa(u) = e^{3u/4} theta(e^u),  theta(x) = sum_{n>=1, 5 !| n} a(n) n exp(-pi n^2 x / 5),  a = (1,k0,-k0,-1) mod 5,
   on u >= 0 (kappa is even in u by the theta inversion theta(1/x) = x^{3/2} theta(x); CLASSICAL input).
   Claims certified, with L = log kappa:
     (P)  kappa(u) > 0                 for all u >= 0
     (LC) L''(u) < 0                   for all u >= 0
     (CS) h(u) = u L''(u) - L'(u) < 0  for all u > 0   (<=> -log kappa(sqrt t) strictly convex in t = u^2)
   Method.  [0,U0]: Arb jets (arb_series) on a cover by closed intervals certify kappa > 0 and L'''' < 0;
            with L'(0) = L'''(0) = 0 (evenness) this gives L''' < 0 on (0,U0], L'' <= L''(0) < 0, and
            h(u) = int_0^u s L'''(s) ds < 0.  Independent of evenness, L'' < 0 is also certified directly on the cover,
            and h < 0 directly on [U1,U0].
            [U0,inf): analytic tail bound (see tail()).
   Memory: a few thousand arb numbers; planned allocation < 50 MB."""
import json, sys, time
from flint import arb, arb_series, ctx, fmpq
ctx.prec = 200
ctx.cap = 5
U0 = fmpq(2); U1 = fmpq(1, 4)
NT = 40                      # terms n <= NT kept explicitly
PI = arb.pi(); C = PI / 5
s5 = arb(5).sqrt()
K0 = ((10 - 2 * s5).sqrt() - 2) / (s5 - 1)
A = {1: arb(1), 2: K0, 3: -K0, 4: arb(-1)}
BELL = [1, 1, 2, 5, 15]
FACT = [1, 1, 2, 6, 24]
print('planned allocation: < 50 MB (interval jets of length 5, %d terms)' % NT, flush=True)

def trunc_tail(j, X):
    """Bound for |D^j sum_{n>NT} a(n) n exp(-C n^2 x)|, D = d/du, uniformly for 1 <= x <= X.
       D^j e^{-y} = e^{-y} sum_k S(j,k)(-y)^k, |.| <= Bell(j) y^j e^{-y} for y >= 1 (y = C n^2 x >= C n^2 > 1).
       n (C n^2 X)^j e^{-C n^2} <= (C X)^j n^9 e^{-C n^2} <= (C X)^j e^{-C n^2/2} for n >= 41 (41^9 < e^{C 41^2/2}),
       sum_{n>NT} e^{-C n^2/2} <= e^{-C (NT+1)^2/2} / (1 - e^{-C NT})."""
    assert NT >= 40
    g = (-C * (NT + 1) ** 2 / 2).exp() / (1 - (-C * NT).exp())
    return BELL[j] * (C * X) ** j * g

def jets(ui):
    """ui: arb interval contained in [0,U0]. Returns enclosures of kappa-positivity quantity theta and L', L'', L''', L''''."""
    u = arb_series([ui, 1])
    x = u.exp()
    th = arb_series([0])
    for n in range(1, NT + 1):
        if n % 5 == 0: continue
        th = th + A[n % 5] * n * (x * (-C * n * n)).exp()
    X = arb(U0.p) / U0.q
    X = X.exp()
    co = [th[k] + arb(0, 1) * trunc_tail(k, X) / FACT[k] for k in range(5)]
    th = arb_series(co)
    Ls = u * arb(3) / 4 + th.log()
    return co[0], [Ls[k] * FACT[k] for k in range(1, 5)]

def neg(v): return v.upper() < 0
def pos(v): return v.lower() > 0

def cover(lo, hi, test, w0):
    """adaptive cover of [lo,hi] by closed intervals on which test(interval) is True; returns (count, min width)"""
    stack = [(lo, hi)]; cnt = 0; wmin = hi - lo
    while stack:
        a, b = stack.pop()
        if b - a > w0:
            m = (a + b) / 2; stack += [(a, m), (m, b)]; continue
        am = arb(a.p) / a.q; bm = arb(b.p) / b.q
        ui = am.union(bm)
        if test(ui):
            cnt += 1; wmin = min(wmin, b - a)
        else:
            if b - a < fmpq(1, 10 ** 9): raise RuntimeError('cover failed near u=%s' % float((a + b) / 2))
            m = (a + b) / 2; stack += [(a, m), (m, b)]
    return cnt, wmin

worst = {'theta_min': None, 'L4_max': None, 'L2_max': None, 'h_max': None}
def upd(key, v, mx=True):
    val = float(v.upper()) if mx else float(v.lower())
    if worst[key] is None or (val > worst[key] if mx else val < worst[key]): worst[key] = val

def test_main(ui):
    th, (L1, L2, L3, L4) = jets(ui)
    ok = pos(th) and neg(L4) and neg(L2)
    if ok:
        upd('theta_min', th, False); upd('L4_max', L4); upd('L2_max', L2)
    return ok
def test_h(ui):
    th, (L1, L2, L3, L4) = jets(ui)
    h = ui * L2 - L1
    ok = pos(th) and neg(h)
    if ok: upd('h_max', h)
    return ok

t0 = time.time()
n1, w1 = cover(fmpq(0), U0, test_main, fmpq(1, 64))
print("[0,U0] cover for kappa>0, L2<0, L4<0: %d intervals, min width %s" % (n1, float(w1)), flush=True)
n2, w2 = cover(U1, U0, test_h, fmpq(1, 256))
print('[U1,U0] direct cover for h<0: %d intervals, min width %s' % (n2, float(w2)), flush=True)

# evenness inputs at u = 0 (enclosures must contain 0; the exact zero is the theta inversion, CLASSICAL)
th0, (L1_0, L2_0, L3_0, L4_0) = jets(arb(0))
print('at u=0: L1 =', L1_0.str(10), ' L3 =', L3_0.str(10), ' L2 =', L2_0.str(20), ' L4 =', L4_0.str(20), ' theta(1) =', th0.str(20))
assert L1_0.contains(0) and L3_0.contains(0)
# theta inversion checked at three points to the working precision (MEASURED consistency check, not part of the proof)
def theta(xv, N=200):
    s = arb(0)
    for n in range(1, N + 1):
        if n % 5: s += A[n % 5] * n * (-C * n * n * xv).exp()
    return s
inv = []
for xs in ('0.5', '0.25', '0.8'):
    xv = arb(xs); d = theta(1 / xv) - xv ** arb('1.5') * theta(xv)
    inv.append(d.str(5)); assert d.contains(0)
print('theta(1/x) - x^{3/2} theta(x) at x = 0.5, 0.25, 0.8:', inv)

def tail():
    """u >= U0, x >= X0 = e^{U0}. theta = e^{-Cx}(1 + r), r = sum_{n>=2} a(n) n e^{-lam_n x}, lam_n = C(n^2-1).
       |D^j r| <= rho_j := sum_{n>=2} n Q_j(lam_n X0) e^{-lam_n X0}, Q_j(y) = sum_k S(j,k) y^k, since Q_j(y)e^{-y} is
       decreasing for y >= j and lam_2 X0 >= 2 (checked).  Then
         kappa > 0             if rho_0 < 1
         L'' = -C x + e2,      |e2| <= rho_2/(1-rho_0) + (rho_1/(1-rho_0))^2
         L'  = 3/4 - C x + e1, |e1| <= rho_1/(1-rho_0)
         h   = -C x (u-1) - 3/4 + u e2 - e1 <= -(u-1)(C X0 - E2) - 3/4 + E2 + E1  (u >= U0 >= 1)."""
    X0 = (arb(U0.p) / U0.q).exp()
    S = [[1], [0, 1], [0, 1, 1]]
    assert (C * 3 * X0).lower() > 2
    rho = []
    for j in range(3):
        s = arb(0)
        for n in range(2, 61):
            y = C * (n * n - 1) * X0
            s += n * sum(S[j][k] * y ** k for k in range(j + 1)) * (-y).exp()
        # n >= 61: n Q_j(y) e^{-y} <= e^{-y/2} (y > 2000), sum <= 2 e^{-C(61^2-1)X0/2}
        s += 2 * (-C * (61 * 61 - 1) * X0 / 2).exp()
        rho.append(s)
    assert rho[0].upper() < 1
    E1 = rho[1] / (1 - rho[0]); E2 = rho[2] / (1 - rho[0]) + E1 * E1
    L2up = -C * X0 + E2
    slope = C * X0 - E2
    hup = -(arb(U0.p) / U0.q - 1) * slope - arb(3) / 4 + E2 + E1
    assert neg(L2up) and pos(slope) and neg(hup)
    return dict(X0=X0.str(12), rho=[r.str(8) for r in rho], E1=E1.str(8), E2=E2.str(8), L2_upper=L2up.str(10), h_upper_at_U0=hup.str(10))
T = tail()
print('tail u >= U0:', T)
out = dict(precision_bits=ctx.prec, U0=str(U0), U1=str(U1), terms=NT, intervals_main=n1, min_width_main=float(w1),
           intervals_h=n2, min_width_h=float(w2), worst=worst,
           at_zero=dict(L1=L1_0.str(10), L2=L2_0.str(20), L3=L3_0.str(10), L4=L4_0.str(20), theta1=th0.str(20)),
           theta_inversion_residuals=inv, tail=T, k0=K0.str(30), seconds=round(time.time() - t0, 2),
           certified="kappa>0 and (log kappa)''<0 on u>=0; u (log kappa)'' - (log kappa)' < 0 on u>0")
json.dump(out, open('partC_dh_cert.json', 'w'), indent=1)
print('CERTIFIED:', out['certified'], '| worst:', worst, '| seconds', out['seconds'])
