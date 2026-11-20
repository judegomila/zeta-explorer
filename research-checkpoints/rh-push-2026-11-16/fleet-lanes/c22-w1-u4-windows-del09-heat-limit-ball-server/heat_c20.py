"""Item A: certified enclosure of a zero of the backward-heat function
   F(z) = H_{-tau}(z) = int_R H_0(z-u) G_tau(u) du,  H_0(w) = xi((1+iw)/2)/8,  G_tau(u) = (4 pi tau)^(-1/2) exp(-u^2/(4 tau)),
by the argument principle in Arb ball arithmetic (python-flint). All statements below are proved in RESULT.md section 2.

Representation (Lemma S, Cauchy shift):  F(z) = int_R H_0(t + i y0) G_tau(z - t - i y0) dt,  y0 < -1 fixed, sigma0 = (1-y0)/2 in (1,2].
Quadrature (Lemma Q): trapezoid rule with step h on the nodes t_j = XC + j h, |j| <= n, U = n h.
   |F(z) - h sum_{|j|<=n} H_0(t_j + i y0) G_tau(z - t_j - i y0)| <= eps_trap + eps_tail,
   eps_trap = 2 M_a / (exp(2 pi a / h) - 1)   (trapezoid rule for functions analytic in a strip of half-width a),
   M_a, eps_tail from the envelope of Lemma T:
   |H_0(t + i y)| <= M_sigma(|t|) := zeta(sigma) (1/16) (sigma + |t|/2)^2 pi^(-sigma/2) Gamma(sigma/2) sqrt((pi|t|/4)/sinh(pi|t|/4)),
   sigma = (1-y)/2 in (1,2];  M_sigma decreasing in t for t >= 7;  |H_0(t + i y)| <= xi(sigma)/8 for all real t.
Everything is scaled by exp(-REF), REF a fixed double.

Winding number: vertices z_0..z_m = z_0 counterclockwise; F(z_k) as tight balls; for each closed segment [z_k, z_{k+1}] an enclosure
E_k of F on the box hull of the endpoints with 0 not in E_k. E_k is a box (convex) not containing 0, so the continuous change of
arg F along the segment equals the principal Arg(F(z_{k+1})/F(z_k)). W = (1/2 pi) sum_k Arg(F(z_{k+1})/F(z_k)) encloses an integer.

usage: heat_encl.py <config.json> <prec> <outfile>
"""
import sys, json, math, time, os
from multiprocessing import Pool
from flint import acb, arb, ctx

CFG = json.load(open(sys.argv[1])); PREC = int(sys.argv[2]); OUT = sys.argv[3]
WORKERS = int(os.environ.get('RH_WORKERS', '4'))
ctx.prec = PREC
TAU = arb(CFG['tau']); XC = arb(CFG['XC']); Y0 = arb(CFG['y0']); U = arb(CFG['U']); JL = int(CFG['JL']); A = arb(CFG['a'])
TB = PREC - 24                                                   # target bits for the quadrature error
NN = int(math.ceil(float(CFG['U'])*(TB*math.log(2) + 12)/(2*math.pi*float(CFG['a']))))
H = U/NN
I = acb(0, 1)
R2 = 2*TAU.sqrt()
SIG0 = (1 - Y0)/2

def lgf(s):
    """log of J_0 = (1/16) s (s-1) pi^(-s/2) Gamma(s/2)."""
    return s.log() + (s-1).log() - acb(16).log() - s*acb.pi().log()/2 + (s/2).lgamma()

REF = arb(round(float(lgf(SIG0 + I*XC/2).real.mid()), 3))          # exact double: fixed scaling constant
REF0 = arb(round(float(lgf((1 + arb(CFG['eta']))/2 + I*(XC + arb(CFG['dx']))/2).real.mid()), 3))

def logM(t, smin, smax):
    """log of an upper bound for sup_{smin<=sigma<=smax} M_sigma(t), t > 0, 1 < smin <= smax <= 2:
    zeta and Gamma(./2) are decreasing on the ranges used, pi^(-sigma/2) decreasing, (sigma + t/2)^2 increasing in sigma."""
    x = arb.pi()*t/4
    logsinh = x + ((1 - (-2*x).exp())/2).log()
    key = (smin.str(40), PREC)
    if key not in _CM:                       # t-independent part, cached (same value as the inline expression)
        _CM[key] = smin.zeta().log() - arb(16).log() - smin*arb.pi().log()/2 + (smin/2).lgamma()
    return _CM[key] + 2*(smax + t/2).log() + (x.log() - logsinh)/2
_CM = {}

def logB(smin, smax):
    """log of an upper bound for sup xi(sigma)/8 on [smin, smax]."""
    return smin.zeta().log() - arb(16).log() + smax.log() + (smax - 1).log() - smin*arb.pi().log()/2 + (smin/2).lgamma()

def half_erfc(d):
    return (d/R2).erfc()/2

def env_far(smin, smax, d0, start):
    """bound for exp(-REF) * [ contribution of |t - XC| >= start ] of  M(t) * (Gaussian mass), where the distance of the
    region {t >= XC + start + j} resp. {t <= XC - start - j} to Re z is at least start + j - d0."""
    assert XC - start - JL > 8 and start - d0 > 0
    tot = (logM(XC + start, smin, smax) - REF).exp()*half_erfc(start - d0)                 # t >= XC + start, M decreasing
    for j in range(JL):                                                                     # [XC-start-j-1, XC-start-j]
        tot += (logM(XC - start - j - 1, smin, smax) - REF).exp()*half_erfc(start + j - d0)
    tot += (logM(arb(8), smin, smax) - REF).exp()*half_erfc(start + JL - d0)               # 8 <= t <= XC-start-JL
    tot += (logB(smin, smax) - REF).exp()*half_erfc(XC - 8 - d0)                           # t <= 8 (negative t included)
    return tot

def error_bounds(bmax, dmax):
    """(eps_trap, eps_tail, M_a) uniform for z with |Im z - y0| <= bmax, |Re z - XC| <= dmax."""
    smin, smax = SIG0 - A/2, SIG0 + A/2
    assert smin > 1 and smax <= 2 and SIG0 > 1
    K = int(math.ceil(float(dmax.upper() if hasattr(dmax, 'upper') else dmax))) + 1         # central layers [XC+j, XC+j+1], -K <= j < K: mass <= 1
    Ma = arb(0)
    for j in range(-K, K):
        Ma += (logM(XC + j, smin, smax) - REF).exp()                                        # M decreasing: sup on the layer at its left end
    Ma += env_far(smin, smax, dmax, arb(K))
    Ma = Ma*(((bmax + A)**2)/(4*TAU)).exp()
    eps_trap = 2*Ma/((2*arb.pi()*A/H).exp() - 1)
    eps_tail = env_far(SIG0, SIG0, dmax + H, U)*((bmax*bmax)/(4*TAU)).exp()                 # dropped nodes |t_j - XC| > U
    return eps_trap, eps_tail, Ma

def _sample(j):
    ctx.prec = PREC
    s = SIG0 + I*(XC + H*j)/2
    return pack((lgf(s) - REF).exp()*s.zeta())

def _pk(x):
    """exact transfer of an arb between processes: midpoint and radius as integer mantissa/exponent pairs."""
    m, e = x.mid().man_exp(); rm, re_ = x.rad().man_exp()
    return (int(m), int(e), int(rm), int(re_))
def _up(t):
    m, e, rm, re_ = t
    mid = arb(m)*arb(2)**e; rad = arb(rm)*arb(2)**re_
    assert mid.rad() == 0
    return arb(mid, arb(rad.upper()))
def pack(v): return (_pk(v.real), _pk(v.imag))
def unpack(t): return acb(_up(t[0]), _up(t[1]))

SAMP = None
def Fsum(dzx, zy, deriv=False):
    """h/sqrt(4 pi tau) * sum_j c_j exp(-(z - w_j)^2/(4 tau)) [* -(z-w_j)/(2 tau)], z = XC + dzx + i zy (balls allowed)."""
    tot = acb(0); b = zy - Y0; q = 1/(4*TAU)
    for j, c in SAMP:
        d = acb(dzx - H*j, b)
        v = c*(-d*d*q).exp()
        if deriv: v = v*(-d*2*q)
        tot += v
    return tot*H/(4*arb.pi()*TAU).sqrt()

def Fval(dzx, zy, eps):
    e = arb(eps.upper())
    return Fsum(dzx, zy) + acb(arb(0, 1)*e, arb(0, 1)*e)

def Fseg(dzx, zy, eps):
    """enclosure of F on the box (dzx, zy) by the mean-value form: the trapezoid sum S is entire in z, and for z in the box and m its
    midpoint S(z) - S(m) = (z - m) int_0^1 S'(m + th (z - m)) dth lies in (box - m) * [box enclosure of S'], because the enclosure of
    S' on the box is convex. Then F(z) in S(z) + [-eps, eps]^2."""
    e = arb(eps.upper())
    mx, my = arb(dzx.mid()), arb(zy.mid())
    return Fsum(mx, my) + Fsum(dzx, zy, deriv=True)*acb(dzx - mx, zy - my) + acb(arb(0, 1)*e, arb(0, 1)*e)

def H0val(dzx, zy):
    """zeta control: exp(-REF0) H_0(z) evaluated directly (z may be a wide ball)."""
    s = (1 - zy)/2 + I*(XC + dzx)/2
    return (lgf(s) - REF0).exp()*s.zeta()

def S(a):
    return [a.real.str(30), a.imag.str(30)] if isinstance(a, acb) else a.str(30)

def contains0(v):
    return (not v.is_finite()) or (v.real.contains(0) and v.imag.contains(0))

def lowabs(v):
    """lower bound for |w| over the box v: max over the two coordinates of the distance of the interval to 0."""
    best = 0.0
    for c in (v.real, v.imag):
        if not c.contains(0):
            best = max(best, float(min(abs(c.lower()), abs(c.upper())))*(1 - 1e-12))
    return best

def newton(dzx, zy, n=6):
    z = acb(dzx, zy)
    for _ in range(n):
        z = acb(z.real.mid(), z.imag.mid())
        f = Fsum(z.real, z.imag); d = Fsum(z.real, z.imag, deriv=True)
        z = z - f/d
    z = acb(z.real.mid(), z.imag.mid())
    return z, Fsum(z.real, z.imag), d

def dec(x, digs):
    q = round(float(x.mid())*10**digs)
    sgn = '-' if q < 0 else ''; q = abs(q)
    return '%s%d.%0*d' % (sgn, q//10**digs, digs, q % 10**digs)

def winding(fun, cx, cy, hs, nside, maxref=14, segfun=None):
    segfun = segfun or fun
    """fun(x_ball, y_ball) -> acb enclosure. Square centre (cx, cy), half-width hs (decimal strings), counterclockwise.
    Vertices on the dyadic lattice c + hs*(i + I j)/scale. Returns dict; winding_integer None if not certified."""
    h = arb(hs); N = nside
    lat = [(i, -N) for i in range(-N, N, 2)] + [(N, j) for j in range(-N, N, 2)] + [(i, N) for i in range(N, -N, -2)] + [(-N, j) for j in range(N, -N, -2)]
    scale = N
    def P(p, sc): return (arb(cx) + h*p[0]/sc, arb(cy) + h*p[1]/sc)
    vals = {}; segs = {}; nev = 0
    for rnd in range(maxref + 1):
        bad = []
        m = len(lat)
        for a in range(m):
            p, q = lat[a], lat[(a+1) % m]
            kp = (p[0]/scale, p[1]/scale); kq = (q[0]/scale, q[1]/scale)
            if kp not in vals:
                x, y = P(p, scale); vals[kp] = fun(x, y); nev += 1
            if (kp, kq) not in segs:
                x0, y0 = P(p, scale); x1, y1 = P(q, scale)
                E = segfun(x0.union(x1), y0.union(y1)); nev += 1
                if contains0(E): bad.append((p, q))
                else: segs[(kp, kq)] = E
        if not bad: break
        badset = {((2*p[0], 2*p[1]), (2*q[0], 2*q[1])) for p, q in bad}
        lat = [(2*p[0], 2*p[1]) for p in lat]; scale *= 2
        new = []
        m = len(lat)
        for a in range(m):
            p, q = lat[a], lat[(a+1) % m]
            new.append(p)
            if (p, q) in badset: new.append(((p[0]+q[0])//2, (p[1]+q[1])//2))
        lat = new
    out = dict(n_segments=len(lat), refinement_rounds=rnd, n_evaluations=nev)
    if bad:
        out['winding_integer'] = None; out['failure'] = '%d segment enclosures contain 0 after %d refinements' % (len(bad), maxref); return out
    tot = arb(0); mv = None; ms = None; m = len(lat)
    for a in range(m):
        p, q = lat[a], lat[(a+1) % m]
        kp = (p[0]/scale, p[1]/scale); kq = (q[0]/scale, q[1]/scale)
        fp, fq = vals[kp], vals[kq]
        if contains0(fp) or contains0(fq):
            out['winding_integer'] = None; out['failure'] = 'vertex enclosure contains 0'; return out
        tot += (fq/fp).arg()
        x = lowabs(fp); mv = x if mv is None or x < mv else mv
        x = lowabs(segs[(kp, kq)]); ms = x if ms is None or x < ms else ms
    W = tot/(2*arb.pi())
    ui = W.unique_fmpz()
    out.update(winding_enclosure=W.str(30), winding_radius=float(W.rad()), winding_integer=(int(ui) if ui is not None else None),
               min_abs_vertices_lower=float(mv), min_abs_segment_enclosures_lower=float(ms),
               max_vertex_radius=max(float(v.rad()) for v in vals.values()))
    return out

if __name__ == '__main__':
    t0 = time.time()
    nsamp = 2*NN + 1
    print('PLAN: prec %d bits; strip half-width a=%s; nodes %d (h=%s, U=%s); target quadrature error 2^-%d; workers %d (samples only); '
          'largest allocation: %d acb samples (< 10 MB)' % (PREC, CFG['a'], nsamp, H.str(8), CFG['U'], TB, WORKERS, nsamp), flush=True)
    with Pool(WORKERS) as pool:
        cs = [unpack(t) for t in pool.map(_sample, range(-NN, NN + 1), chunksize=16)]
    SAMP = list(zip(range(-NN, NN + 1), cs))
    print('samples done in %.1fs; max |c_j| = %s; max sample radius %.3g' % (time.time()-t0, max(abs(c) for c in cs).str(8), max(float(c.rad()) for c in cs)), flush=True)
    res = dict(config=CFG, prec=PREC, REF=REF.str(12), REF0=REF0.str(12), sigma0=SIG0.str(10), n_nodes=nsamp, h=H.str(20),
               t_samples_s=time.time()-t0, max_abs_sample=max(abs(c) for c in cs).str(8))
    z, f, d = newton(arb(CFG['dx']), -arb(CFG['eta']))
    print('newton (non-rigorous) root: dx =', z.real.str(30), ' y =', z.imag.str(30), ' |F| =', abs(f).str(5), " |F'| =", abs(d).str(8), flush=True)
    res['newton_root_nonrigorous'] = dict(dx=z.real.str(30), y=z.imag.str(30), absF=abs(f).str(5), absdF=abs(d).str(8))
    res['rects'] = []
    for hs, digs in CFG['rects']:
        t1 = time.time()
        cx, cy = dec(z.real, digs), dec(z.imag, digs)
        h = arb(hs)
        bmax = arb((abs(arb(cy) - Y0) + h).upper()); dmax = arb((abs(arb(cx)) + h).upper())
        et, el, Ma = error_bounds(bmax, dmax)
        eps = et + el
        r = dict(centre_dx=cx, centre_y=cy, half_width=hs, x_centre_abs=(XC + arb(cx)).str(30), prec=PREC,
                 eps_trap=et.str(6), eps_tail=el.str(6), M_a=Ma.str(6))
        r['F'] = winding(lambda x, y: Fval(x, y, eps), cx, cy, hs, CFG.get('nside', 16), segfun=lambda x, y: Fseg(x, y, eps))
        r['zeta_control_H0'] = winding(H0val, cx, cy, hs, CFG.get('nside', 16))
        r['centre_value_scaled'] = S(Fval(arb(cx), arb(cy), eps))
        r['wall_s'] = time.time()-t1
        print(json.dumps(r), flush=True)
        res['rects'].append(r)
        json.dump(res, open(OUT, 'w'), indent=1)
    res['wall_s'] = time.time()-t0
    json.dump(res, open(OUT, 'w'), indent=1)
    print('DONE %.1fs' % (time.time()-t0))
