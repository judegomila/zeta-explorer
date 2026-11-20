"""Combination 3 (two-line detector), low heights, Arb evaluation.
G = normalised function, analytic in Re s > 1/2 (poles removed by rational factors of modulus -> 1):
  ZETA zeta(s)(s-1)/s | L3 L(s,chi_-3) | DH f(s) | EA zeta(s+a)zeta(s-a)(s-1-a)(s-1+a)/s^2 | TNR zeta(s)(s-1)/s x local factor
  LIOU zeta(2s)(2s-1)/(2s zeta(s))  (zero at s = 1 kept) | LIOUN = LIOU x s/(s-1) (that zero divided out) | HEAT F_tau/g x (s-1)/s
D_[T_lo,T](w) = log|G(w)| - int_{T_lo <= |t| <= T} P_w(t) log|G(1/2+it)| dt,  P_w(t) = (a/pi)/(a^2 + (t - tau)^2), w = 1/2 + a + i tau.
Line integral: breakpoints at the zeros (poles) on the line, at local minima of |G| and on a uniform mesh; on each cell
Gauss-Legendre (m nodes) after the substitution t = a + (b-a)(6u^5 - 15u^4 + 10u^3) (absorbs logarithmic endpoint singularities).
Usage: t3_low.py NAME T_lo T_hi out.npz [m]"""
import sys, os, json, math, time
import numpy as np
import multiprocessing
from flint import acb, arb, ctx
import objs

NAME = sys.argv[1]; TLO = float(sys.argv[2]); THI = float(sys.argv[3]); OUT = sys.argv[4]
M = int(sys.argv[5]) if len(sys.argv) > 5 else 24
SIG1 = [1.0, 1.2, 1.5]
BASE = {'LIOUN': 'LIOU'}.get(NAME, NAME)
O = None; ZO = None

def init():
    global O, ZO
    O = objs.make(BASE, THI + 5); ZO = objs.Zeta()
    if BASE.startswith('HEAT'): O.setprec()
    else: ctx.prec = 128 + int(1.2 * THI)

def logabs(sig, t):
    """log|G(sig + i t)| as float"""
    if abs(sig - 1.0) < 1e-12 and abs(t) < 1e-9: t = 1e-6      # removable point s = 1
    s = acb(arb(sig), arb(t))
    if BASE == 'ZETA': v = s.zeta() * (s - 1) / s
    elif BASE in ('L3', 'DH'): v = O.plain(s)
    elif BASE == 'EA': a = arb(O.a); v = O.plain(s) * (s - 1 - a) * (s - 1 + a) / (s * s)
    elif BASE == 'TNR': v = O.plain(s) * (s - 1) / s
    elif BASE == 'LIOU':
        v = (2 * s).zeta() * (2 * s - 1) / (2 * s) / s.zeta()
        if NAME == 'LIOUN': v = v * s / (s - 1)
    else: v = O.jc(s, 1)[0] / objs.gfac(s) * (s - 1) / s
    return float(abs(v).log().mid())

def line_real(t):
    """a real function of t whose sign changes mark the zeros (or poles) of G on the line; None if there are none."""
    s = acb(arb(1) / 2, arb(t))
    if BASE in ('ZETA', 'TNR', 'LIOU'): v = ZO.comp(s); return v.real
    if BASE == 'L3' or BASE == 'DH':
        v = O.comp(s); return v.real if abs(float((v.real / abs(v)).mid())) > 0.5 else v.imag
    if BASE == 'EA': return None
    return O.jc(s, 1)[0].real

def scan(args):
    t0, t1, step = args
    out = []; mins = []
    n = int(round((t1 - t0) / step))
    prev = None; hist = []
    for k in range(n + 1):
        t = t0 + k * step
        v = line_real(t)
        if v is None:
            la = logabs(0.5, t); hist.append((t, la))
        else:
            sgn = 1 if float(v.mid()) > 0 else -1
            if prev is not None and sgn != prev[1]:
                lo, hi = arb(prev[0]), arb(t); slo = prev[1]
                for _ in range(70):
                    mid = (lo + hi) / 2; mid = arb(mid.mid())
                    sm = 1 if float(line_real(mid).mid()) > 0 else -1
                    if sm == slo: lo = mid
                    else: hi = mid
                out.append(float(((lo + hi) / 2).mid()))
            prev = (t, sgn)
            hist.append((t, logabs(0.5, t) if k % 1 == 0 else 0.0))
    for k in range(1, len(hist) - 1):
        if hist[k][1] < hist[k - 1][1] and hist[k][1] <= hist[k + 1][1]: mins.append(hist[k][0])
    return out, mins

def evalnodes(ts):
    return [logabs(0.5, t) for t in ts]
def evalw(args):
    return [logabs(sg, t) for sg, t in args]

if __name__ == '__main__':
    multiprocessing.set_start_method('fork')
    nw = int(os.environ.get('RH_WORKERS', '4')); t_start = time.time()
    with multiprocessing.Pool(nw, initializer=init) as p:
        lo_scan = max(TLO, 0.0)
        segs = [(lo_scan + k * 2.0, min(THI, lo_scan + (k + 1) * 2.0), 0.02) for k in range(int(math.ceil((THI - lo_scan) / 2.0)))]
        sc = p.map(scan, segs)
        zeros = sorted(z for a, b in sc for z in a); mins = sorted(m for a, b in sc for m in b)
        mesh = list(np.arange(TLO, THI + 1e-9, 0.25))
        bp = sorted(set(mesh) | set(zeros) | set(mins))
        bp2 = [bp[0]]
        for b in bp[1:]:
            if b - bp2[-1] > 1e-9: bp2.append(b)
            elif b in zeros: bp2[-1] = b
        bp = np.array(bp2)
        gx, gw = np.polynomial.legendre.leggauss(M); u = (gx + 1) / 2; wu = gw / 2
        phi = 6 * u ** 5 - 15 * u ** 4 + 10 * u ** 3; dphi = 30 * u ** 2 * (1 - u) ** 2
        a = bp[:-1]; b = bp[1:]
        tn = (a[:, None] + (b - a)[:, None] * phi[None, :]); wt = (b - a)[:, None] * (dphi * wu)[None, :]
        flat = list(tn.ravel())
        print(NAME, 'zeros/poles on line', len(zeros), 'local minima', len(mins), 'cells', len(a), 'nodes', len(flat), flush=True)
        ch = [flat[i:i + 200] for i in range(0, len(flat), 200)]
        U = np.array([v for part in p.map(evalnodes, ch) for v in part]).reshape(tn.shape)
        taus = np.arange(TLO, THI + 1e-9, 0.25)
        wpts = [(0.5 + (s1 - 0.5), t) for s1 in SIG1 for t in taus]
        chw = [wpts[i:i + 100] for i in range(0, len(wpts), 100)]
        LW = np.array([v for part in p.map(evalw, chw) for v in part]).reshape(len(SIG1), len(taus))
    # cumulative Poisson integrals: C[sigma, tau, cell]
    cellint = np.empty((len(SIG1), len(taus), len(a)))
    for i, s1 in enumerate(SIG1):
        aa = s1 - 0.5
        for j, tau in enumerate(taus):
            P = (aa / math.pi) / (aa * aa + (tn - tau) ** 2)
            if TLO == 0.0: P = P + (aa / math.pi) / (aa * aa + (tn + tau) ** 2)
            cellint[i, j] = (P * U * wt).sum(axis=1)
    np.savez_compressed(OUT, name=NAME, TLO=TLO, THI=THI, M=M, sig1=np.array(SIG1), taus=taus, bp=bp, cell_hi=b, cellint=cellint, LW=LW,
                        zeros=np.array(zeros), mins=np.array(mins), int_U=float((U * wt).sum()))
    full = LW - cellint.sum(axis=2)
    print(NAME, 'done %.1fs; int U dt over [%.0f, %.0f] = %.6f; D over the full window, tau in [T_lo+20, T_hi-20]:' % (time.time() - t_start, TLO, THI, (U * wt).sum()), flush=True)
    m = (taus >= TLO + (20 if TLO > 0 else 0)) & (taus <= THI - 20)
    for i, s1 in enumerate(SIG1):
        if m.any(): print('   sigma1 %.1f  min D %.6f at tau %.2f   max D %.6f' % (s1, full[i][m].min(), taus[m][np.argmin(full[i][m])], full[i][m].max()), flush=True)
