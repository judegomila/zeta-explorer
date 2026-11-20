"""Combination 4 (arm ratio).  Lambda(s) = pi^{-s/2} Gamma(s/2) zeta(s) = A(s) + A(1-s),
A(s) = -1/s + sum_n (pi n^2)^{-s/2} Gamma(s/2, pi n^2).   rho_A(sigma, t) = log|A(sigma+it)| - log|A(1-sigma+it)|.
On the line A(1/2+it) = R(t)/2 + i I(t) with R = Lambda(1/2+it) real, and (exact)
   d rho_A/d sigma at sigma = 1/2  =  2 Re(A'/A)  =  (I'R - R'I)/|A|^2  =  -(I^2/|A|^2) d/dt (R/I).
Mode 'direct' T0 T1 step: 2 Re(A'/A) from the incomplete-gamma series (mpmath), its sign changes, the identity above, the
   identity rho_A = log|1 - Lambda(s)/A(1-s)| off the line; the same for L(chi_-3) and DH (odd theta arms).
Mode 'count' T1: number of sign changes of Y(t) = Z'(t) + Z(t) (m'/m - I'/I) on [14, T1] (same sign changes as the derivative),
   against the number of zeros of Z; m = |pi^{-s/2} Gamma(s/2)|, I'/I and m'/m from their asymptotic series.
Mode 'windows' H T0 [T0 ...]: the same count on windows at large height (zgpu)."""
import sys, json, math, time
import numpy as np
import mpmath as mp
MODE = sys.argv[1]

def A_zeta(s, nmax=None):
    nmax = nmax or int(math.sqrt((mp.mp.dps * 2.31 + 20) / math.pi)) + 2
    return -1 / s + mp.fsum((mp.pi * n * n) ** (-s / 2) * mp.gammainc(s / 2, mp.pi * n * n) for n in range(1, nmax + 1))

def make_odd(q, coef):
    """arm of an odd self-dual periodic sequence: A(s) = sum a_n n (pi n^2/q)^{-(s+1)/2} Gamma((s+1)/2, pi n^2/q);
       Lambda(s) = (q/pi)^{(s+1)/2} Gamma((s+1)/2) L(s) = (q/pi)^{..}-free form: A(s) + A(1-s) up to the constant below."""
    def A(s):
        nmax = int(math.sqrt(q * (mp.mp.dps * 2.31 + 20) / math.pi)) + 2
        tot = mp.mpf(0)
        for n in range(1, nmax + 1):
            a = coef(n)
            if a == 0: continue
            x = mp.pi * n * n / q
            tot += a * n * x ** (-(s + 1) / 2) * mp.gammainc((s + 1) / 2, x)
        return tot
    return A

def kappa(): return (mp.sqrt(10 - 2 * mp.sqrt(5)) - 2) / (mp.sqrt(5) - 1)
def coef_dh(n): k = kappa(); return [0, 1, k, -k, -1][n % 5]
def coef_l3(n): return [0, 1, -1][n % 3]

def run_direct(name, A, T0, T1, step, check):
    out = dict(name=name, T0=T0, T1=T1, step=step)
    ts = np.arange(T0, T1 + 1e-9, step); D = []; Rv = []
    for t in ts:
        mp.mp.dps = int(40 + 0.36 * t)
        s = mp.mpc(0.5, t); h = mp.mpf(10) ** (-(mp.mp.dps // 3))
        a = A(s); ap = (A(s + h) - A(s - h)) / (2 * h)
        D.append(2 * (ap / a).real); Rv.append(a)
    sg = [1 if d > 0 else -1 for d in D]
    ch = [0.5 * (ts[i] + ts[i + 1]) for i in range(len(ts) - 1) if sg[i] != sg[i + 1]]
    out['sign_changes'] = len(ch); out['first_sign_changes'] = [float(c) for c in ch[:12]]
    out['sign_at_T0'] = sg[0]
    # which component of A vanishes at the zeros (A = e^{i phi}(R/2 + i I) with a constant phase)
    a0 = Rv[len(Rv) // 3]
    out['max_abs_derivative'] = float(max(abs(d) for d in D)); out['min_abs_derivative'] = float(min(abs(d) for d in D))
    out.update(check())
    return out

if MODE == 'direct':
    T0 = float(sys.argv[2]); T1 = float(sys.argv[3]); step = float(sys.argv[4])
    res = []
    def chk_zeta():
        mp.mp.dps = 80; r = {}
        s = mp.mpc(0.7, 30.3)
        lam = mp.pi ** (-s / 2) * mp.gamma(s / 2) * mp.zeta(s)
        r['split_identity_rel_err'] = float(abs(A_zeta(s) + A_zeta(1 - s) - lam) / abs(lam))
        rho = mp.log(abs(A_zeta(s))) - mp.log(abs(A_zeta(mp.mpc(0.3, 30.3))))
        r['rho_A(0.7,30.3)'] = float(rho); r['log|1-Lambda/A(1-s)|'] = float(mp.log(abs(1 - lam / A_zeta(1 - s))))
        # (I'R - R'I)/|A|^2 against 2 Re(A'/A) at t = 30.3
        t = mp.mpf('30.3'); h = mp.mpf(10) ** -25
        f = lambda u: A_zeta(mp.mpc(0.5, u))
        a = f(t); da = (f(t + h) - f(t - h)) / (2 * h)
        R, I = 2 * a.real, a.imag; Rp, Ip = 2 * da.real, da.imag
        s0 = mp.mpc(0.5, t); ap = (A_zeta(s0 + h) - A_zeta(s0 - h)) / (2 * h)
        r['identity_lhs_2Re(A\'/A)'] = float(2 * (ap / a).real); r['identity_rhs'] = float((Ip * R - Rp * I) / abs(a) ** 2)
        r['A(1/2+30.3i)'] = [float(a.real), float(a.imag)]; r['theta3(1)/t'] = float(mp.jtheta(3, 0, mp.exp(-mp.pi)) / t)
        return r
    res.append(run_direct('ZETA', A_zeta, T0, T1, step, chk_zeta))
    print(json.dumps(res[-1]), flush=True)
    for name, q, cf in [('L3', 3, coef_l3), ('DH', 5, coef_dh)]:
        A = make_odd(q, cf)
        def chk():
            mp.mp.dps = 80; s = mp.mpc(0.7, 30.3)
            if name == 'L3': L = 3 ** (-s) * (mp.zeta(s, mp.mpf(1) / 3) - mp.zeta(s, mp.mpf(2) / 3))
            else:
                k = kappa(); L = 5 ** (-s) * (mp.zeta(s, mp.mpf(1) / 5) + k * mp.zeta(s, mp.mpf(2) / 5) - k * mp.zeta(s, mp.mpf(3) / 5) - mp.zeta(s, mp.mpf(4) / 5))
            lam = (q / mp.pi) ** ((s + 1) / 2) * mp.gamma((s + 1) / 2) * L
            a1, a2 = A(s), A(1 - s)
            # Lambda = c1 A(s) + c2 A(1-s): solve the two constants from two points
            s2 = mp.mpc(0.4, 11.7); L2 = None
            if name == 'L3': L2 = 3 ** (-s2) * (mp.zeta(s2, mp.mpf(1) / 3) - mp.zeta(s2, mp.mpf(2) / 3))
            else: L2 = 5 ** (-s2) * (mp.zeta(s2, mp.mpf(1) / 5) + k * mp.zeta(s2, mp.mpf(2) / 5) - k * mp.zeta(s2, mp.mpf(3) / 5) - mp.zeta(s2, mp.mpf(4) / 5))
            lam2 = (q / mp.pi) ** ((s2 + 1) / 2) * mp.gamma((s2 + 1) / 2) * L2
            M = mp.matrix([[a1, a2], [A(s2), A(1 - s2)]]); c = mp.lu_solve(M, mp.matrix([lam, lam2]))
            s3 = mp.mpc(0.6, 44.1)
            if name == 'L3': L3_ = 3 ** (-s3) * (mp.zeta(s3, mp.mpf(1) / 3) - mp.zeta(s3, mp.mpf(2) / 3))
            else: L3_ = 5 ** (-s3) * (mp.zeta(s3, mp.mpf(1) / 5) + k * mp.zeta(s3, mp.mpf(2) / 5) - k * mp.zeta(s3, mp.mpf(3) / 5) - mp.zeta(s3, mp.mpf(4) / 5))
            lam3 = (q / mp.pi) ** ((s3 + 1) / 2) * mp.gamma((s3 + 1) / 2) * L3_
            return {'split_constants_c1_c2': [complex(c[0]).__repr__(), complex(c[1]).__repr__()],
                    'split_identity_rel_err_third_point': float(abs(c[0] * A(s3) + c[1] * A(1 - s3) - lam3) / abs(lam3))}
        res.append(run_direct(name, A, max(T0, 1.0), T1, step, chk))
        print(json.dumps(res[-1]), flush=True)

def corr(t):
    """m'/m - I'/I: m = |pi^{-s/2} Gamma(s/2)| on the line (m'/m = -(1/2) Im psi(1/4 + it/2)), I = Im A ~ theta3/t (I'/I = -1/t + O(t^-3))."""
    y = t / 2; z = 0.25 + 1j * y
    psi = np.log(z) - 1 / (2 * z) - 1 / (12 * z ** 2) + 1 / (120 * z ** 4)
    return -0.5 * psi.imag + 1 / t

if MODE == 'count':
    T1 = float(sys.argv[2])
    import zgpu
    tot_y = 0; tot_z = 0; t_start = time.time(); rows = []
    # low part with mpmath
    mp.mp.dps = 20
    lowT = 2 * math.pi * 4 ** 2 + 1
    ts = np.arange(14.0, min(lowT, T1), 0.05)
    Zv = np.array([float(mp.siegelz(t)) for t in ts]); Zd = np.array([float(mp.siegelz(t, derivative=1)) for t in ts])
    Y = Zd + Zv * corr(ts)
    cy = int((np.sign(Y[1:]) != np.sign(Y[:-1])).sum()); cz = int((np.sign(Zv[1:]) != np.sign(Zv[:-1])).sum())
    first = [float(0.5 * (ts[i] + ts[i + 1])) for i in np.where(np.sign(Y[1:]) != np.sign(Y[:-1]))[0][:12]]
    tot_y += cy; tot_z += cz; rows.append(dict(t0=14.0, t1=float(ts[-1]), sign_changes_Y=cy, zeros_Z=cz))
    N = 4
    while 2 * math.pi * N * N < T1:
        lo = max(2 * math.pi * N * N, ts[-1]); hi = min(2 * math.pi * (N + 1) ** 2, T1)
        T0 = 0.5 * (lo + hi); w = zgpu.Win(T0)
        sp = 2 * math.pi / math.log(T0 / (2 * math.pi)); n = int((hi - lo) / (sp / 24)) + 2
        d = np.linspace(lo - T0 + 1e-9, hi - T0 - 1e-9, n)
        Z, Zp, _ = w.eval(d, [0.0], order=1)
        Y = Zp[0].real + Z[0].real * corr(T0 + d)
        cy = int((np.sign(Y[1:]) != np.sign(Y[:-1])).sum()); cz = int((np.sign(Z[0].real[1:]) != np.sign(Z[0].real[:-1])).sum())
        tot_y += cy; tot_z += cz
        if N % 50 == 0: zgpu.log('N %d t in [%.0f, %.0f]: running sign changes of the derivative %d, zeros of Z %d' % (N, lo, hi, tot_y, tot_z))
        N += 1
    out = dict(mode='count', T1=T1, sign_changes_of_derivative=tot_y, zeros_of_Z_seen=tot_z, first_sign_changes=first,
               riemann_von_mangoldt_minus_N14=T1 / (2 * math.pi) * math.log(T1 / (2 * math.pi * math.e)) + 7 / 8.0, sec=time.time() - t_start)
    print(json.dumps(out), flush=True)

if MODE == 'windows':
    import zgpu
    H = float(sys.argv[2])
    for T in [float(a) for a in sys.argv[3:]]:
        N, lo, hi = zgpu.block_of(T); T0 = lo + 2 if T - 2 < lo or T + H + 2 > hi else T
        w = zgpu.Win(T0); sp = 2 * math.pi / math.log(T0 / (2 * math.pi)); n = int(H / (sp / 24)) + 2
        d = np.linspace(0, H, n)
        Z, Zp, _ = w.eval(d, [0.0], order=1)
        Y = Zp[0].real + Z[0].real * corr(T0 + d)
        cy = int((np.sign(Y[1:]) != np.sign(Y[:-1])).sum()); cz = int((np.sign(Z[0].real[1:]) != np.sign(Z[0].real[:-1])).sum())
        print(json.dumps(dict(mode='windows', T0=T0, H=H, sign_changes_of_derivative=cy, zeros_of_Z=cz)), flush=True)
