"""Certified one-zero channels for the heat-deformed xi, F_tau = exp(tau/4 d_s^2) xi.

For zero index k and tau-cell [t0-w, t0+w], with an exact rational centre c = 1/2 + i*y:
  F_tau(c+h) = sum_{2m+n<J} a_{n+2m} (n+2m)!/(n! m! 4^m) tau^m h^n  +  tail,
  a_j = Taylor coefficients of xi at c (Arb acb_series).
  |tail| <= TAIL(J, dmax, rmax)   (positive-kernel bound, see RESULT.md section 3.1)
Rouche against b_1(tau) h on |h| = r, uniformly in tau in the cell:
  |b_0| + sum_{n>=2} |b_n| r^n + TAIL < |b_1| r   =>  exactly one zero in D(c, r).
Cell enclosure: b_n(tau) in b_n(t0) + [-w,w] * (n+2)(n+1)/4 * |b_{n+2}(cell ball)|  (heat equation).

usage: channels.py kmin kmax tau_lo tau_hi ncells out.json [J] [prec]
       tau cells are processed outward from 0 (forward cells, then backward cells).
"""
import sys, json, time
from fractions import Fraction as Fr
from flint import acb, acb_series, arb, ctx, fmpq
from mpmath import mp, zetazero

kmin, kmax = int(sys.argv[1]), int(sys.argv[2])
tau_lo, tau_hi, ncells = Fr(sys.argv[3]), Fr(sys.argv[4]), int(sys.argv[5])
out = sys.argv[6]
J = int(sys.argv[7]) if len(sys.argv) > 7 else 300
PREC = int(sys.argv[8]) if len(sys.argv) > 8 else 1500
ctx.prec = PREC
ctx.cap = J
DMAX, RMAX, U = 2, 4, 5   # tail valid for |tau| <= DMAX, r <= RMAX

def q2arb(q):
    return arb(fmpq(q.numerator, q.denominator))

def tail_bound():
    # 8 int Phi(u) sum_{2m+n>=J} (d u^2)^m (2ur)^n/(m! n!) du, Phi <= 2 pi^2 K0 e^{-pi} e^{-8 pi u^2}
    pi = arb.pi()
    K0 = arb(0)
    for n in range(1, 40):
        K0 += arb(n)**4*(-pi*(n*n-1)).exp()
    K0 += arb(10)**(-1000)       # n >= 40 remainder, far below this
    C = 16*pi*pi*K0*(-pi).exp()
    first = C*(arb(DMAX*U*U+2*U*RMAX)).exp()/arb(U)**J*(arb(J+1)/2).gamma()/(2*(8*pi)**(arb(J+1)/2))
    second = C*(arb(-21*U*U)).exp()/(42*U)   # 8pi - DMAX - 2*RMAX/U > 21
    return first+second

TAIL = tail_bound()

def xi_jet(y):
    c = acb(arb(1)/2, q2arb(y))
    s = acb_series([c, 1], J)
    pi = arb.pi()
    return s*(s-1)/2*((-s/2)*pi.log()).exp()*(s/2).gamma()*s.zeta()

FACT = [arb(1)]
for i in range(1, J+2):
    FACT.append(FACT[-1]*i)

def coeff_table(jet):
    # p[n][m] = a_{n+2m} (n+2m)!/(n! m! 4^m)
    p = []
    for n in range(J):
        row = []
        m = 0
        while n+2*m < J:
            row.append(jet[n+2*m]*FACT[n+2*m]/(FACT[n]*FACT[m]*arb(4)**m))
            m += 1
        p.append(row)
    return p

def horner(row, t):
    v = acb(0)
    for cf in reversed(row):
        v = v*t+cf
    return v

def upper(x):
    return x.abs_upper()

def lower(x):
    return x.abs_lower()

RGRID = [r for r in [Fr(11, 10)**i/500 for i in range(0, 81)] if r <= RMAX]   # 0.002 .. 4

def cell_cert(p, t0, w):
    """return (list of (r, margin_rel_lower, abs_margin_lower) for r in grid with positive margin), A_lower, b0_upper"""
    t0a = q2arb(t0)
    wa = q2arb(w)
    tball = t0a+wa*arb("0 +/- 1")
    bmid = [horner(p[n], acb(t0a)) for n in range(J)]
    bcell = [horner(p[n], acb(tball)) for n in range(J)]
    up = []
    for n in range(J):
        extra = wa*(n+2)*(n+1)/4*upper(bcell[n+2]) if n+2 < J else arb(0)
        up.append(upper(bmid[n])+extra)
    extra1 = wa*3*2/4*upper(bcell[3])
    A = lower(bmid[1])-extra1          # lower bound for |b_1(tau)| on the cell
    res = []
    for r in RGRID:
        ra = q2arb(r)
        tot = up[0]+TAIL
        rp = ra*ra
        for n in range(2, J):
            tot += up[n]*rp
            rp *= ra
        marg = A*ra-tot
        if marg > 0:
            res.append((r, float((marg/(A*ra)).lower()), float(marg.lower())))
    return res, (float(A.lower()) if A > 0 else 0.0), float(up[0].upper()), bmid

def newton_shift(bmid_next):
    # imaginary shift dy with F(c + i dy) = 0, float Newton on the truncated polynomial at the next tau
    dy = 0.0
    for _ in range(40):
        h = acb(0, dy)
        v = acb(0); dv = acb(0)
        for n in range(len(bmid_next)-1, -1, -1):
            dv = dv*h+v
            v = v*h+bmid_next[n]
        step = complex((v/dv))
        # move along the line only
        dy -= (step/1j).real if abs(step.imag) > 0 else 0.0
        if abs(step) < 1e-25:
            break
    return dy

def run_direction(k, y0, p0, cells):
    recs = []
    y = y0
    p = p0
    for (t0, w) in cells:
        # predict the centre at the cell midpoint from the previous jet (float Newton), then one exact jet
        bm = [horner(p[n], acb(q2arb(t0))) for n in range(40)]
        dy = newton_shift(bm)
        y = y+Fr(round(dy*10**12), 10**12)
        p = coeff_table(xi_jet(y))
        res, A, b0, bmid = cell_cert(p, t0, w)
        rec = {"k": k, "t0": str(t0), "w": str(w), "y": str(y), "A": A, "b0": b0,
               "ok": bool(res)}
        if res:
            best = max(res, key=lambda z: z[1])
            babs = max(res, key=lambda z: z[2])
            rec.update({"r_in": str(res[0][0]), "r_max": str(res[-1][0]),
                        "mu_best": best[1], "r_best": str(best[0]), "abs_best": babs[2],
                        "contiguous": len(res) == RGRID.index(res[-1][0])-RGRID.index(res[0][0])+1})
        recs.append(rec)
        if not res:
            break
    return recs

mp.dps = 25
w = (tau_hi-tau_lo)/ncells/2
mids = [tau_lo+(2*i+1)*w for i in range(ncells)]
fwd = [(t, w) for t in mids if t > 0]
bwd = [(t, w) for t in reversed(mids) if t < 0]
allrecs = []
T0 = time.time()
for k in range(kmin, kmax+1):
    g = zetazero(k).imag
    y0 = Fr(int(g*10**15), 10**15)
    p0 = coeff_table(xi_jet(y0))
    recs = run_direction(k, y0, p0, fwd)+run_direction(k, y0, p0, bwd)
    allrecs += recs
    okc = sum(r["ok"] for r in recs)
    print(k, float(y0), "cells ok %d/%d" % (okc, len(recs)), "min mu %.3f" % min([r.get("mu_best", -1) for r in recs]),
          "t=%.0fs" % (time.time()-T0), flush=True)
    json.dump({"J": J, "prec": PREC, "tail": float(TAIL.upper()), "tau_lo": str(tau_lo), "tau_hi": str(tau_hi),
               "ncells": ncells, "recs": allrecs}, open(out, "w"))
