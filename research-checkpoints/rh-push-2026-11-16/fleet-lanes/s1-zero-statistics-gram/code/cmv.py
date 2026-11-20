"""Herglotz / CMV detector (Route L form) for completed functions with functional equation s <-> 1-s.
L(z) = Xi'/Xi(1/2 + z) is positive-real on Re z > 0 iff no zero has Re s > 1/2 (plus the real-axis sign condition).
With z = a (1+w)/(1-w):  C(w) = L(z(w)) = c_0 + 2 sum_{n>=1} c_n w^n ;  Toeplitz [c_{|i-j|}] ; Levinson reflection coefficients alpha_n.
N_det = first n with |alpha_n| >= 1 (ball arithmetic: decided only if the ball excludes 1).
Completed functions re-typed from push/c12-control-battery-harness/battery/core.py (ZETA, DH, EA, TNR); CHIPROD and the
quadruple-modified zeta (Route L validation rows) added here.
Usage: cmv.py OBJ NMAX PREC [a=20]
"""
import sys, json, time
from flint import acb, arb, ctx, acb_series, arb_series

def kappa(): return ((10 - 2 * arb(5).sqrt()).sqrt() - 2) / (arb(5).sqrt() - 1)
def powc(base, s): return (s * arb(base).log()).exp()

def xi_zeta(s): return s * (s - 1) * powc(arb.pi(), -s / 2) * (s / 2).gamma() * s.zeta()
def xi_dh(s):
    k = kappa(); c = (arb(1), k, -k, arb(-1)); tot = 0
    for a in (1, 2, 3, 4): tot = tot + c[a - 1] * s.zeta(arb(a) / 5)
    return powc(5 / arb.pi(), s / 2) * ((s + 1) / 2).gamma() * tot * powc(5, -s)
def xi_chiprod(s):
    i = acb(0, 1); chi = (acb(1), i, -i, acb(-1)); t1 = 0; t2 = 0
    for a in (1, 2, 3, 4):
        h = s.zeta(arb(a) / 5); t1 = t1 + chi[a - 1] * h; t2 = t2 + chi[a - 1].conjugate() * h
    g = powc(5 / arb.pi(), s / 2) * ((s + 1) / 2).gamma() * powc(5, -s)
    return g * g * t1 * t2
def xi_ea(num, den):
    a = arb(num) / den
    return lambda s: (s + a) * (s + a - 1) * (s - a) * (s - a - 1) * powc(arb.pi(), -s) * ((s + a) / 2).gamma() * ((s - a) / 2).gamma() * (s + a).zeta() * (s - a).zeta()
def xi_tnr(s, q=3, c='2.2'):
    D = 1 + arb(c) * powc(q, arb(1) / 2 - s) + powc(q, 1 - 2 * s)
    return powc(q, s) * xi_zeta(s) * D
def xi_quad(k, delta, weight):
    """zeta with zero number k (ordinate g) replaced by the quadruple 1/2 +- delta +- i g; weight 1: four simple zeros; weight 1/2: handled in logder"""
    return (k, arb(delta), weight)

OBJ = {'ZETA': xi_zeta, 'DH': xi_dh, 'CHIPROD': xi_chiprod, 'EA-1/8': xi_ea(1, 8), 'EA-1/4': xi_ea(1, 4), 'EA-1/2': xi_ea(1, 2), 'TNR': xi_tnr}

def herglotz_series(name, n, a):
    """coefficients of C(w) = L(z(w)), z = a(1+w)/(1-w), to order n (real arb list).
    Step 1: Taylor coefficients l_k of L at z = a (series in x = z - a).  Step 2: x = 2a w/(1-w), so
    C_n = sum_{k=1..n} l_k (2a)^k binom(n-1, k-1) for n >= 1 and C_0 = l_0."""
    ctx.cap = n + 4
    x = acb_series([0, 1], prec=n + 3)
    z = a + x
    s = z + arb(1) / 2
    quad = None
    if name.startswith('QUAD'):
        _, k, delta, wt = name.split(':'); quad = (int(k), arb(delta), arb(wt)); f = xi_zeta
    else:
        f = OBJ[name]
    X = f(s)
    Ls = X.derivative() / X
    if quad:
        k, d, wt = quad
        g = acb.zeta_zeros(k, 1)[0].imag
        I = acb(0, 1)
        Ls = Ls - (1 / (z - I * g) + 1 / (z + I * g))
        for sr in (1, -1):
            for si in (1, -1):
                Ls = Ls + wt / (z - (sr * d + si * I * g))
    l = [Ls[j].real for j in range(n + 1)]
    from flint import fmpz
    out = [l[0]]
    p2a = [arb(1)]
    for k in range(1, n + 1): p2a.append(p2a[-1] * 2 * a)
    for m in range(1, n + 1):
        acc = arb(0); binom = fmpz(1)          # binom(m-1, k-1), k = 1
        for k in range(1, m + 1):
            acc += l[k] * p2a[k] * arb(binom)
            binom = binom * (m - k) // k
        out.append(acc)
    return out

def levinson(c, nmax, ball=False):
    """c[0] real > 0, C = c0 + 2 sum c_n w^n; Toeplitz t_k: t_0 = c_0, t_n = c_n/2. Returns list of (n, alpha_n, e_n/e_0).
    ball=False: midpoint arithmetic at the working precision (radii dropped after every operation; ball Levinson loses
    about sum_k log2(e_0/e_k) bits to the dependency problem and stops near n = 50 at 3000 bits)."""
    M = (lambda x: x) if ball else (lambda x: arb(x.mid()))
    t = [M(c[0])] + [M(x / 2) for x in c[1:]]
    a = [arb(1)]; e = t[0]; out = []
    for n in range(1, nmax + 1):
        acc = t[n]
        for j in range(1, n): acc = acc + a[j] * t[n - j]
        k = M(-acc / e)
        na = [arb(1)] + [M(a[j] + k * a[n - j]) for j in range(1, n)] + [k]
        a = na; e = M(e * (1 - k * k))
        out.append((n, k, e / t[0]))
        if not (abs(k) < 1): break
    return out

def run(name, nmax, prec, a):
    ctx.prec = prec
    t0 = time.time()
    c = herglotz_series(name, nmax, a)
    relrad = max(float((x.rad() / (abs(x.mid()) + arb(10) ** -300)).mid()) if x.rad() > 0 else 0.0 for x in c)
    t1 = time.time()
    out = levinson(c, nmax)
    n, k, e = out[-1]
    det = n if bool(abs(k) > 1) else None
    return dict(obj=name, a=float(a.mid()), nmax=nmax, prec=prec, N_det=det, last_n=n, last_alpha=k.str(30, radius=False),
                e_prev_over_e0=(out[-2][2].str(8, radius=False) if len(out) > 1 else None),
                e_last_over_e0=e.str(8, radius=False),
                min_one_minus_abs_alpha=min(float((1 - abs(x[1])).mid()) for x in out[:-1]) if len(out) > 1 else None,
                argmin=min(out[:-1], key=lambda x: float((1 - abs(x[1])).mid()))[0] if len(out) > 1 else None,
                max_rel_radius_of_moments=relrad, secs=[round(t1 - t0, 1), round(time.time() - t1, 1)],
                alphas=[x[1].str(25, radius=False) for x in out])

if __name__ == '__main__':
    name = sys.argv[1]; nmax = int(sys.argv[2]); prec = int(sys.argv[3]); a = arb(sys.argv[4]) if len(sys.argv) > 4 else arb(20)
    r1 = run(name, nmax, prec, a); r2 = run(name, nmax, prec * 3 // 2, a)
    m = min(len(r1['alphas']), len(r2['alphas']))
    agree = max(abs(float(x) - float(y)) for x, y in zip(r1['alphas'][:m], r2['alphas'][:m]))
    r1['N_det_at_1.5x_precision'] = r2['N_det']; r1['last_alpha_at_1.5x_precision'] = r2['last_alpha']; r1['max_abs_alpha_diff_between_precisions'] = agree
    al = r1.pop('alphas'); r1['alphas_head'] = al[:8]
    print(json.dumps(r1), flush=True)
    if len(sys.argv) > 5: json.dump(dict(r1, alphas=al), open(sys.argv[5], 'w'))
