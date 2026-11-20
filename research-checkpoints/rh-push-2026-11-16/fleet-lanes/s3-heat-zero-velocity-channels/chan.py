"""Shared library, lane s3-heat-zero-velocity-channels.

Normalisation (zeta-view docs/ZERO-CHANNELS-MATH.md): F_tau(s), d_tau F = (1/4) F_ss, F_0 = completed function, symmetric
under s -> 1 - conj s.  At a simple zero rho' = -F_ss/(4 F_s).

Everything is computed from Taylor jets of the completed function in python-flint balls (acb_series).  The heat family of ANY
entire F of order 1 is obtained from the jet by the coefficient formula
    a_m(tau) = sum_j (tau/4)^j / j! * (m+2j)!/m! * a_{m+2j}          (F_tau = exp((tau/4) d_s^2) F)
(the formula of node zv-polynomial-heat-coefficients; the series converges for every tau for entire functions of order 1,
and the truncation is checked by changing the jet length).  Ball radii are propagated by Arb, but truncation of the jets and
sampling of circles are not enclosed: results are MEASURED unless stated.

Objects (code):
  ZETA      xi(s) = s(s-1)/2 pi^(-s/2) Gamma(s/2) zeta(s)
  L3, L4    (q/pi)^(s/2) Gamma((s+1)/2) L(s, chi_-q)   (odd real characters mod 3, mod 4)
  DH        (5/pi)^(s/2) Gamma((s+1)/2) 5^-s [zeta(s,1/5) + k zeta(s,2/5) - k zeta(s,3/5) - zeta(s,4/5)]
  TNR       xi(s) (2 cosh((s-1/2) log 3) + 2.2)
  EA:a      xi(s+a) xi(s-a)
  HEAT:tau0 exp((tau0/4) d_s^2) xi   (backward heat for tau0 < 0)
  POLY      polynomial given by coefficients (calibration)
"""
import math
from flint import acb, arb, acb_series, acb_poly, arb_poly, ctx, fmpq, dirichlet_char

TNR_Q = 3; TNR_C = fmpq(11, 5)
HEAT_J = 44      # number of heat terms kept when a heat-shifted jet is formed


def setprec(bits, cap):
    ctx.prec = bits; ctx.cap = cap


def kappa():
    s5 = arb(5).sqrt()
    return ((10 - 2 * s5).sqrt() - 2) / (s5 - 1)


def _ser(s, n):
    return acb_series([acb(s), 1], prec=n)


def _xi_ser(x):
    return x * (x - 1) / 2 * (-(x / 2) * arb.pi().log()).exp() * (x / 2).gamma() * x.zeta()


def _coeffs(p, n):
    return [p[i] for i in range(n)]


def heat_shift(a, tau, n, J=None):
    """jet of F_tau from the jet a of F_0 (length >= n + 2J)."""
    J = HEAT_J if J is None else J
    J = min(J, (len(a) - n) // 2)
    q = arb(tau) / 4
    out = []
    for m in range(n):
        s = acb(0); c = arb(1)       # c = q^j/j! * (m+2j)!/m!
        for j in range(J + 1):
            s += c * a[m + 2 * j]
            c = c * q / (j + 1) * (m + 2 * j + 1) * (m + 2 * j + 2)
        out.append(s)
    return out


def jet(code, s, n):
    """Taylor coefficients a_0..a_{n-1} of the completed function at s (acb list)."""
    if ctx.cap < n + 2 * HEAT_J + 2: ctx.cap = n + 2 * HEAT_J + 2
    if code.startswith('HEAT:'):
        tau = float(code[5:]); N = n + 2 * HEAT_J
        return heat_shift(_coeffs(_xi_ser(_ser(s, N)), N), tau, n)
    x = _ser(s, n)
    if code == 'ZETA':
        f = _xi_ser(x)
    elif code in ('L3', 'L4'):
        q = int(code[1]); chi = dirichlet_char(q, q - 1)
        f = ((x / 2) * (arb(q) / arb.pi()).log()).exp() * ((x + 1) / 2).gamma() * x.dirichlet_l(chi)
    elif code == 'DH':
        k = kappa()
        d = x.zeta(acb(fmpq(1, 5))) - x.zeta(acb(fmpq(4, 5))) + (x.zeta(acb(fmpq(2, 5))) - x.zeta(acb(fmpq(3, 5)))) * k
        f = ((x / 2) * (arb(5) / arb.pi()).log()).exp() * ((x + 1) / 2).gamma() * (-x * arb(5).log()).exp() * d
    elif code == 'TNR':
        w = (x - fmpq(1, 2)) * arb(TNR_Q).log()
        f = _xi_ser(x) * (w.exp() + (-w).exp() + arb(TNR_C))
    elif code.startswith('EA:'):
        a = arb(code[3:])
        f = _xi_ser(_ser(acb(s) + a, n)) * _xi_ser(_ser(acb(s) - a, n))
    else:
        raise ValueError(code)
    return _coeffs(f, n)


def arch_ld(code, s):
    """logarithmic derivative of the archimedean (and conductor) factor; None when the object has no Dirichlet series."""
    s = acb(s); lp = arb.pi().log()
    def az(z): return 1 / z + 1 / (z - 1) - lp / 2 + (z / 2).digamma() / 2
    if code == 'ZETA': return az(s)
    if code == 'TNR': return az(s) + arb(TNR_Q).log()
    if code in ('L3', 'L4', 'DH'):
        q = 5 if code == 'DH' else int(code[1])
        return (arb(q).log() - lp) / 2 + ((s + 1) / 2).digamma() / 2
    if code.startswith('EA:'):
        a = arb(code[3:]); return az(s + a) + az(s - a)
    return None


def zeta_ld_real(sig):
    """zeta'/zeta(sigma), sigma > 1 real (negative)."""
    z = _ser(acb(sig), 2).zeta()
    return (z[1] / z[0]).real


def newton(code, s, online, it=60, tol_bits=None):
    """refine a zero; online=True keeps Re s = 1/2."""
    s = acb(s); tol = arb(2) ** (-(tol_bits or (ctx.prec - 24)))
    for _ in range(it):
        a = jet(code, s, 3)
        st = a[0] / a[1]
        s = acb((s - st).mid())
        if online: s = acb(arb(fmpq(1, 2)), s.imag)
        if abs(st) < tol * (1 + abs(s)): break
    return s, float(abs(st).mid()) if True else 0.0


def f(x):
    """float of an arb midpoint."""
    return float(arb(x).mid())


def lg10(x):
    """log10 of a positive arb with arbitrary exponent, as float."""
    x = arb(x)
    if not (x > 0): return float('-inf') if x.mid() == 0 else float('nan')
    return float((x.log() / arb(10).log()).mid())


# ------------------------------------------------------------------ real-point jets and the positivity perturbation bound
class Pbound:
    """P(delta, r) = F_delta(1/2 + r) - F_0(1/2 + r) = sum_{j>=1} (delta/4)^j/j! F^(2j)(1/2 + r):
    for a kernel that is >= 0 on u >= 0 this is sup over |Re s - 1/2| <= r, |tau| <= delta of |F_tau - F_0|
    (node zv-phi-positivity-heat-perturbation-bound, written through the jet at the real point 1/2)."""
    def __init__(self, code, order=260):
        self.code = code
        a = jet(code, acb(fmpq(1, 2)), order)
        self.p = arb_poly([c.real for c in a])
        self.d = [self.p]
        for _ in range(2 * 14):
            self.d.append(self.d[-1].derivative())
    def K(self, j, r):
        return self.d[2 * j](arb(r))
    def P(self, delta, r, J=14):
        q = arb(delta) / 4; s = arb(0); c = arb(1)
        for j in range(1, J + 1):
            c = c * q / j
            s += c * self.K(j, r)
        return s
    def solve(self, m, r):
        """delta with P(delta, r) = m (m > 0 arb); returns arb midpoint value (bisection on the convex increasing P)."""
        K1 = self.K(1, r)
        d = 4 * arb(m) / K1                      # first-order solution, an upper bound for delta
        if d < arb(10) ** -8: return d
        lo = arb(0); hi = arb(d.mid())
        for _ in range(80):
            mid = arb(((lo + hi) / 2).mid())
            if self.P(mid, r) < m: lo = mid
            else: hi = mid
        return lo


# ------------------------------------------------------------------ per-zero analysis
def circle_nodes(n):
    return [acb(0, 2 * arb.pi() * k / n).exp() for k in range(n)]


def analyse_zero(code, s0, online, g, n=128, eta_pts=True, do_c2=True, do_c4=True, pb=None, nodes=None, rmult=None, rexit=(0.7,),
                 vcap=None, poly=None):
    """All per-zero quantities.  s0: zero (refined here), g: distance to the nearest other zero (float),
    poly: optional explicit jet (calibration).  Returns a dict of floats."""
    half = arb(fmpq(1, 2))
    if poly is None:
        rho, res = newton(code, s0, online)
        a = jet(code, rho, n)
    else:
        rho = acb(s0); res = 0.0; a = poly; n = len(a)
    x = rho.real - half; gam = rho.imag
    a1 = a[1]
    b = [c / a1 for c in a]
    Q = 2 * b[2]
    out = {'code': code, 're': f(rho.real), 'im': f(gam), 'x': f(x), 'online': bool(online), 'res': res, 'g': g,
           'lg_a1': lg10(abs(a1)), 'lg_a0': lg10(abs(a[0])) if not (abs(a[0]) == 0) else -9999.0,
           'Qre': f(Q.real), 'Qim': f(Q.imag)}
    # combination 3
    out['M'] = f(x * Q.real)                       # M = x Re(F_ss/F_s);  D' = -M/2
    kap = (6 * b[3] - 4 * b[2] * b[2]).real        # Re d_s (F_ss/F_s) at the zero
    out['kappa'] = f(kap)
    # combination 1 (off-line zeros, x > 0): y = 2x, dy/dt = -Re Q / 2
    if not online and eta_pts and poly is None:
        y = 2 * x; v = -Q.real / 2
        out['y'] = f(y); out['v'] = f(v)
        e0 = arb(5).sqrt() * y
        emin = e0 if e0 > arb('1.02') else arb('1.02')
        etas = [('sqrt5y', e0)] + [('m%g' % k, emin * arb(str(k))) for k in (1, 1.3, 2, 4)]
        rows = []
        for name, eta in etas:
            sg = half + eta / 2; pt = acb(sg, gam)
            c = jet(code, pt, 2); ld = (c[1] / c[0]).real
            B4 = -1 / y + 4 * y / (eta * eta - y * y) - (y / eta) * ld
            row = {'eta': f(eta), 'sigma': f(sg), 'ReLD': f(ld), 'B4': f(B4)}
            al = arch_ld(code, pt)
            if al is not None and sg > 1:
                zl = zeta_ld_real(sg)
                row['arch'] = f(al.real); row['zld'] = f(zl)
                row['B5z'] = f(-1 / y + 4 * y / (eta * eta - y * y) - (y / eta) * (al.real + zl))
                row['E'] = f(ld - al.real - zl)        # Re f'/f(sigma + i gamma) - zeta'/zeta(sigma); < 0 breaks |Lambda_F| <= Lambda
            rows.append(row)
        out['eta'] = rows
    P = acb_poly(b)
    # combination 2: circles |w| = r, direct Rouche floor min|F|/|F'(rho)| and Taylor-Rouche floor r - |a0/a1| - B r^2/2
    if do_c2:
        nodes = nodes or circle_nodes(64)
        P2 = P.derivative().derivative()
        rm = rmult or [0.05 * k for k in range(1, 20)]
        best = {'R': None, 'TR': None}
        E = abs(b[0])
        for mlt in rm:
            r = arb(g) * arb(str(round(mlt, 4)))
            mn = None; B = arb(0)
            for e in nodes:
                w = r * e
                v0 = abs(P(w)); v2 = abs(P2(w))
                if mn is None or v0 < mn: mn = arb(v0.mid())
                if v2 > B: B = arb(v2.mid())
            tr = r - E - B * r * r / 2
            for key, val in (('R', mn), ('TR', tr)):
                if val > 0:
                    if pb is not None:
                        d = pb.solve(val * abs(a1), half * 0 + r + abs(x))
                        sc = lg10(d)
                    else:
                        sc = lg10(val)
                    if best[key] is None or sc > best[key][0]: best[key] = (sc, mlt, f(val))
        for key in best:
            if best[key] is not None:
                out['lgdel_' + key] = best[key][0]; out['ropt_' + key] = best[key][1]; out['floor_' + key] = best[key][2]
        if pb is not None: out['lgK1'] = lg10(pb.K(1, abs(x)))
    # combination 4 (on-line zeros): line function phi(h) = F(rho + i h)/(i F'(rho)) real; backward heat v = -tau:
    # phi_v = exp((v/4) d_h^2) phi
    if do_c4 and online:
        I = acb(0, 1); pw = acb(1); pc = []; imax = 0.0
        for m in range(n):
            c = b[m] * pw / I if m > 0 else b[0] / I
            pc.append(arb(c.real.mid()))
            if m <= 40:
                sc = abs(float(c.imag.mid())) * (g ** max(m - 1, 0)); imax = max(imax, sc)
            pw = pw * I
        out['sym_im'] = imax
        out.update(c4_events(pc, g, rexit, vcap))
    return out


class Line:
    """phi_v = sum_j (v/4)^j/j! D^(2j) phi_0  (real polynomial truncation of the line function)."""
    def __init__(self, pc, J=None):
        n = len(pc)
        self.d = [arb_poly(pc)]
        J = J if J is not None else min(64, (n - 1) // 2)
        for _ in range(J):
            self.d.append(self.d[-1].derivative().derivative())
        self.cache = {}
    def at(self, v):
        q = arb(v) / 4; c = arb(1); p = self.d[0]
        for j in range(1, len(self.d)):
            c = c * q / j
            p = p + self.d[j] * c
        return p


def c4_events(pc, g, rexit=(0.7,), vcap=None, ntrunc=None):
    """collision time of the branch h(0) = 0 (v_coll) and the first change of the zero count of the disk |h| <= r (v_exit)."""
    out = {}
    L = Line(pc if ntrunc is None else pc[:ntrunc])
    vcap = vcap if vcap is not None else 10.0 * g * g
    v = arb(0); h = arb(0); steps = 0; vc = None; hc = None; status = 'cap'
    dvmax = 0.04 * g * g
    def d123(p, hh):
        p1 = p.derivative(); p2 = p1.derivative(); p3 = p2.derivative()
        return p(hh), p1(hh), p2(hh), p3(hh)
    def fold_newton(v0, h0):
        vv = arb(v0); hh = arb(h0)
        for _ in range(40):
            p = L.at(vv); f0, f1, f2, f3 = d123(p, hh)
            # equations f0 = 0, f1 = 0; Jacobian [[f2/4, f1], [f3/4, f2]]
            det = f2 * f2 / 4 - f1 * f3 / 4
            if not (abs(det) > 0): return None
            dv = (f0 * f2 - f1 * f1) / det
            dh = (f1 * f2 / 4 - f0 * f3 / 4) / det
            vv = arb((vv - dv).mid()); hh = arb((hh - dh).mid())
            if abs(dv) < arb(10) ** -25 * (1 + abs(vv)) and abs(dh) < arb(10) ** -20 * g: return vv, hh
        return None
    while steps < 600:
        steps += 1
        p = L.at(v); f0, f1, f2, f3 = d123(p, h)
        if not (abs(f2) > 0): dv_est = None
        else:
            hh = f1 / f2; dv_est = float((2 * hh * hh).mid())
        if dv_est is not None and dv_est < max(2e-3 * float(v.mid()), 1e-7 * g * g) + 1e-30 or (dv_est is not None and dv_est < 0.02 * g * g and steps > 3 and dv_est < 0.05 * float(v.mid())):
            r = fold_newton(v + dv_est, h - f1 / f2)
            if r is not None and r[0] > v - arb(1e-6) * g * g and abs(r[1] - h) < 3 * g:
                vc, hc = r; status = 'ok'; break
        step = dvmax if dv_est is None else min(dvmax, 0.3 * dv_est)
        ok = False
        for _ in range(30):
            vn = v + step; pn = L.at(vn); p1 = pn.derivative(); hn = h; good = True
            for _ in range(12):
                d = p1(hn)
                if not (abs(d) > 0): good = False; break
                st = pn(hn) / d
                hn = arb((hn - st).mid())
                if abs(st) > 0.5 * g: good = False; break
                if abs(st) < arb(10) ** -30 * g: break
            if good and abs(hn - h) < 0.25 * g: ok = True; break
            step = step / 2
            if step < 1e-12 * g * g: break
        if not ok:
            r = fold_newton(v, h)
            if r is not None and r[0] > v - arb(1e-6) * g * g and abs(r[1] - h) < 3 * g: vc, hc = r; status = 'ok'
            else: status = 'stall'
            break
        v = arb(vn.mid()); h = hn
        if v > vcap: break
    out['c4_status'] = status; out['c4_steps'] = steps
    if vc is not None:
        out['v_coll'] = f(vc); out['h_coll'] = f(hc)
    vend = f(vc) if vc is not None else float(v.mid())
    # exit: first v with a zero of phi_v on the circle |h| = r.  On-line crossings are sign changes of phi_v(+-r) in v;
    # the winding number at the grid points detects crossings off the real axis.
    nodes = circle_nodes(48)
    for rx in rexit:
        r = arb(g) * arb(str(rx)); key = 'v_exit_%g' % rx
        G = 48; vmax = 1.3 * vend
        prev = None; found = None; how = None; pv = 0.0
        for i in range(0, G + 1):
            vi = vmax * i / G; p = L.at(vi)
            sp = (p(r).mid() > 0, p(-r).mid() > 0)
            wn = winding(p, r, nodes)
            if prev is not None:
                if sp[0] != prev[0][0] or sp[1] != prev[0][1]:
                    side = r if sp[0] != prev[0][0] else -r
                    lo, hi = arb(pv), arb(vi); slo = (L.at(lo)(side).mid() > 0)
                    for _ in range(60):
                        md = arb(((lo + hi) / 2).mid())
                        if (L.at(md)(side).mid() > 0) == slo: lo = md
                        else: hi = md
                    found = f(lo); how = 'line+' if side is r else 'line-'; break
                if wn != prev[1]:
                    lo, hi = pv, vi; nd = circle_nodes(192)
                    for _ in range(24):
                        md = (lo + hi) / 2
                        if winding(L.at(md), r, nd) == prev[1]: lo = md
                        else: hi = md
                    found = lo; how = 'offline'; break
            else:
                out['wind0_%g' % rx] = wn
            prev = (sp, wn); pv = vi
        if found is not None:
            out[key] = found; out[key + '_how'] = how
    return out


def winding(p, r, nodes):
    tot = 0.0; prev = None; first = None
    for e in nodes:
        z = p(r * e)
        a = math.atan2(float(z.imag.mid() / abs(z).mid()) if True else 0, float(z.real.mid() / abs(z).mid()))
        if prev is None: first = a
        else:
            d = a - prev
            while d > math.pi: d -= 2 * math.pi
            while d < -math.pi: d += 2 * math.pi
            tot += d
        prev = a
    d = first - prev
    while d > math.pi: d -= 2 * math.pi
    while d < -math.pi: d += 2 * math.pi
    tot += d
    return int(round(tot / (2 * math.pi)))
