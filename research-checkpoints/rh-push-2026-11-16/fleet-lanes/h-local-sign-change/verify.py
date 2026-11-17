# Task (1),(2): zeros of X_c(z) = xi(1/2+z) * (2cosh(z log q) + c); threshold and locality.
import mpmath as mp, json, sys
mp.mp.dps = 20
def xi(s): return mp.mpf(1)/2*s*(s-1)*mp.pi**(-s/2)*mp.gamma(s/2)*mp.zeta(s)
def Lxi(s): return 1/s + 1/(s-1) - mp.log(mp.pi)/2 + mp.digamma(s/2)/2 + mp.zeta(s, derivative=1)/mp.zeta(s)
def Lc(z, c, lq): return Lxi(mp.mpf(1)/2+z) + 2*lq*mp.sinh(z*lq)/(2*mp.cosh(z*lq)+c)
def count(c, q, x0, x1, y0, y1):
    """winding number of the full field X_c around the box (adaptive phase tracking); no use of L_c"""
    lq = mp.log(q)
    F = lambda z: xi(mp.mpf(1)/2+z)*(2*mp.cosh(z*lq)+c)
    corners = [mp.mpc(x0,y0), mp.mpc(x1,y0), mp.mpc(x1,y1), mp.mpc(x0,y1), mp.mpc(x0,y0)]
    tot = mp.mpf(0)
    def seg(a, fa, b, fb, depth):
        d = mp.arg(fb/fa)
        if abs(d) < 0.4 or depth > 40: return d
        m = (a+b)/2; fm = F(m)
        return seg(a, fa, m, fm, depth+1) + seg(m, fm, b, fb, depth+1)
    for a,b in zip(corners[:-1], corners[1:]):
        n = max(8, int(abs(b-a)/(float(x0)/2 if abs(a.real-x0)<1e-12 and abs(b.real-x0)<1e-12 else 0.1))+1)
        pts = [a + (b-a)*mp.mpf(k)/n for k in range(n+1)]
        fs = [F(p) for p in pts]
        for k in range(n): tot += seg(pts[k], fs[k], pts[k+1], fs[k+1], 0)
    return mp.mpc(tot/(2*mp.pi), 0)
def predicted(c, q, x0, x1, y0, y1):
    lq = mp.log(q)
    if abs(c) <= 2: return 0, None
    d0 = mp.acosh(abs(c)/2)/lq
    if not (x0 < d0 < x1): return 0, d0
    n = 0; k = -50
    while k < 400:
        t = (mp.pi*(2*k+1) if c > 2 else 2*mp.pi*k)/lq
        if y0 < t < y1: n += 1
        k += 1
    return n, d0
out = []
Y0, Y1 = mp.mpf('-0.37'), mp.mpf('40.3')
X0, X1 = mp.mpf('0.004'), mp.mpf('3.3')
cs = [-3,-2.75,-2.5,-2.25,-2.1,-2.01,-2.001,-2,-1.999,-1.75,-1.5,-1,-0.5,0,0.5,1,1.5,1.75,1.999,2,2.001,2.01,2.1,2.25,2.5,2.75,3]
qs = [2,3,5,11] if len(sys.argv) < 2 else [int(v) for v in sys.argv[1:]]
for q in qs:
    for c in cs:
        cm = mp.mpf(str(c))
        pred, d0 = predicted(cm, q, X0, X1, Y0, Y1)
        # c=+-2.001: delta0 = acosh(1.0005)/log q may be < X0; shrink the left edge
        x0 = X0 if (d0 is None or d0 > 2*X0) else d0/2
        pred, d0 = predicted(cm, q, x0, X1, Y0, Y1)
        cnt = count(cm, q, x0, X1, Y0, Y1)
        row = dict(q=q, c=c, delta0=(float(d0) if d0 is not None else None), predicted=pred,
                   counted=float(cnt.real), counted_im=float(cnt.imag), x0=float(x0))
        # locate first zero directly on the full field (no use of the factorisation in the solver)
        if d0 is not None:
            lq = mp.log(q)
            t0 = mp.pi/lq if c > 0 else mp.mpf(0)
            F = lambda z: xi(mp.mpf(1)/2+z)*(2*mp.cosh(z*lq)+cm)
            try:
                r = mp.findroot(F, mp.mpc(d0*1.07+0.003, t0+0.01))
                row['root_re'] = float(r.real); row['root_im'] = float(r.imag); row['re_s'] = float(r.real)+0.5
                row['root_minus_pred'] = float(abs(r - mp.mpc(d0, t0)))
            except Exception as e:
                row['root_err'] = str(e)
        out.append(row)
        print(row, flush=True)
json.dump(out, open('verify.json' if len(sys.argv)<2 else 'verify_%s.json' % '_'.join(sys.argv[1:]), 'w'), indent=1)
