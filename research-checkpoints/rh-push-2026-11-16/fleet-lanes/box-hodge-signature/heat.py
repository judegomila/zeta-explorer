# usage: heat.py <t> <h> <r> <n> <digits> <outdir> [c1 c2]
# Backward-heat control (de Bruijn-Newman family): H_t(x) = int_0^inf e^{t u^2} Phi(u) cos(x u) du,  F_t(z) = H_t(-2 i z)  (F_0(z) = xi(1/2+z)/8).
# No prime side exists for t != 0.  The zero side of the form is computed by a contour integral:
#   Z_t(d) = sum over zeros z_k of F_t of c0 e^{v z_k^2/2} e^{z_k d} = (c0/pi) Re int_{-inf}^{inf} L_t(c+iy) e^{v (c+iy)^2/2} cosh((c+iy) d) dy,
#   L_t = F_t'/F_t, valid when all zeros that matter lie in |Re z| < c.
# STATUS: MEASURED.  Quadrature errors are not bounded analytically; the entry radius is taken as 100 x the difference between two
# contours (c1, c2) plus 10^-digits, and t = 0 is compared with the certified prime-side table.  Given that radius, the inertia
# certificate (bh.certify) is exact.
import sys, os, json, time, math
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import bh
from flint import arb, acb, ctx

def table(t, hstr, rstr, n, digits, c, log):
    ctx.prec = 4000
    h = arb(hstr); s = h*arb(rstr); v, amp, c0 = bh.consts(s)
    vf = float(v.mid()); hf = float(h.mid()); dmax = hf*(n-1)
    D = (digits + 6)*math.log(10)
    ymax = math.sqrt(2*(D + c*dmax + vf*c*c/2)/vf) + 1
    sig = 0.25                                   # assumed clearance of the contour from the zeros
    dy = 2*math.pi*sig/(sig*dmax + D + 10)
    Ny = int(ymax/dy) + 1
    # u-quadrature (trapezoid on the even analytic integrand), strip half-width ~ pi/8
    hq = 2*math.pi*0.3/(2*ymax*0.3 + D + math.pi*ymax/4 + 40)
    U = 0.25*math.log((D + math.pi*ymax/4*1.0 + 60 + 2*c*1.5)/math.pi) + 0.15
    Nu = int(U/hq) + 1
    need = digits + int(math.pi*ymax/4/math.log(10)) + 40
    ctx.prec = int(need*3.3219) + 64
    log('c=%.2f: y-nodes %d (dy=%.4f, ymax=%.0f), u-nodes %d (hq=%.5f, U=%.2f), working digits %d' % (c, Ny, dy, ymax, Nu, hq, U, need))
    ta = arb(t); pi = arb.pi(); hqa = arb(hq)
    wu = []
    for i in range(Nu+1):
        u = hqa*i
        e4 = (4*u).exp(); ph = arb(0)
        for m in range(1, 40):
            term = (2*pi*pi*m**4*(9*u).exp() - 3*pi*m*m*(5*u).exp())*(-pi*m*m*e4).exp()
            ph += term
            if abs(term) < arb(10)**(-(need + 20)): break
        w = ph*(ta*u*u).exp()*hqa
        if i == 0: w = w/2
        wu.append((w, w*2*u))
    acc = [acb(0)]*n
    dya = arb(dy); ca = arb(c)
    for k in range(Ny+1):
        z = acb(ca, dya*k)
        E1 = (2*z*hqa).exp(); E1i = 1/E1
        E = acb(1); Ei = acb(1); F = acb(0); Fp = acb(0)
        zh2 = 2*z*hqa
        for i, (w, w2) in enumerate(wu):
            if i % 8 == 0 and i: E = (zh2*i).exp(); Ei = (-zh2*i).exp()
            F += w*(E + Ei); Fp += w2*(E - Ei)
            E = E*E1; Ei = Ei*E1i
        L = Fp/F                                   # the factors 1/2 cancel
        g = L*(v*z*z/2).exp()*dya
        if k > 0: g = 2*g
        e1 = (z*h).exp(); e1i = 1/e1; e = acb(1); ei = acb(1)
        zh = z*h
        for j in range(n):
            if j % 8 == 0 and j: e = (zh*j).exp(); ei = (-zh*j).exp()
            acc[j] = acc[j] + g*(e + ei)/2
            e = e*e1; ei = ei*e1i
    return [(c0/pi*a.real) for a in acc], v, c0

if __name__ == '__main__':
    t, hstr, rstr, n, digits, outdir = sys.argv[1], sys.argv[2], sys.argv[3], int(sys.argv[4]), int(sys.argv[5]), sys.argv[6]
    c1, c2 = (float(sys.argv[7]), float(sys.argv[8])) if len(sys.argv) > 8 else (1.0, 1.5)
    os.makedirs(outdir, exist_ok=True)
    tag = 'HEAT_t%s_h%s_r%s_n%d' % (t, hstr, rstr, n)
    fn = os.path.join(outdir, tag + '.json')
    if os.path.exists(fn): print(tag, 'already done'); sys.exit(0)
    def log(m): print('[%s %s] %s' % (time.strftime('%H:%M:%S'), tag, m), flush=True)
    t0 = time.time()
    print('[%s] planned: %d lags, two contour tables, one %dx%d certificate' % (tag, n, n, n), flush=True)
    Z1, v, c0 = table(t, hstr, rstr, n, digits, c1, log)
    Z2, _, _ = table(t, hstr, rstr, n, digits, c2, log)
    diff = max(float(abs(a.mid() - b.mid()).upper()) for a, b in zip(Z1, Z2))
    rad = 100*diff + 10.0**(-digits)
    log('max |Z(c1) - Z(c2)| = %.3e ; entry radius used %.3e ; Z(0) = %s' % (diff, rad, Z1[0].str(15)))
    res = dict(obj='HEAT', t=t, h=hstr, r=rstr, n=n, digits=digits, contour_diff=diff, entry_radius=rad, Z_first=[Z1[j].mid().str(20, radius=False) for j in range(min(n, 4))])
    if float(t) == 0:
        bh.setprec(digits + 20)
        T = bh.lag_table(bh.make_obj('zeta'), hstr, rstr, n, digits + 20)
        res['max_diff_vs_prime_side'] = max(float(abs(a.mid() + b.mid()).upper()) for a, b in zip(Z1, T['mZ']))
        log('t=0: max |Z_contour - Z_prime side| = %.3e' % res['max_diff_vs_prime_side'])
    bh.setprec(digits + 60)
    mZ = [-(a.mid()) + arb(0, 1)*arb(rad) for a in Z1]
    rows = bh.levinson_mid(mZ)
    mcert, piv, worst = bh.certify(bh.toeplitz_mat(mZ), rows)
    pos = [i+1 for i in range(mcert) if piv[i] > 0]
    lg = [bh.log10abs(p) for p in piv[:mcert]]
    res.update(determined=mcert, pos_pivot_stages=pos, first_pos=(pos[0] if pos else None),
               first_pos_cutoff=((pos[0]-1)*float(hstr) if pos else None), min_log10_abs_pivot=(min(lg) if lg else None), log10_abs_pivot=[round(x, 2) for x in lg],
               gershgorin_max_rowsum=worst, seconds=round(time.time()-t0, 1))
    json.dump(res, open(fn, 'w'))
    log('certified %d/%d (given the radius), positive pivots %d, first %s, min log10|pivot| %.1f, %.0fs' % (mcert, n, len(pos), res['first_pos'], min(lg) if lg else 0, time.time()-t0))
