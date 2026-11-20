# Part 1: Theorem A (form V0) with an enclosed tail; Part 1b: second-order (Lemma Q2, Hermitian form) at fixed T.
# python-flint ball arithmetic. Zero certification: functions of c19 runA.py (copied unchanged as runA_c19.py).
import os, sys, json, math, time
os.environ['OMP_NUM_THREADS'] = '1'
import numpy as np
import flint
from flint import arb, acb
import runA_c19 as A
from runA_c19 import DP, series, strip, path_arg, float_zeros, certify_zero, forms, lam, Deep
PREC_W, PREC_Z = A.PREC_W, A.PREC_Z
SLAB = A.SLAB
CK = {0: (3, 8), 1: (-1, 4), -1: (-1, 4), 2: (1, 16), -2: (1, 16)}

def cterms(u, tau):
    """<h, C_a h> = sum_l (alpha_l + beta_l a) exp(i nu_l a) in balls"""
    pi = arb.pi(); I = acb(0, 1)
    ck = {k: arb(v[0]) / v[1] for k, v in CK.items()}
    om = {k: 2 * pi * k / u for k in ck}
    out = []
    for l in ck:
        al = acb(ck[l] ** 2 * u)
        for k in ck:
            if k != l: al += 2 * ck[k] * ck[l] / (I * (om[l] - om[k]))
        out.append((al, acb(-ck[l] ** 2), -(arb(tau) + om[l])))
    return out

def taylor_logder(D, order):
    """Taylor coefficients at s = 1/2 of D'/D and D''/D"""
    d = []
    for k in range(order + 3):
        s = arb(0)
        for a, L in zip(D.a, D.L):
            if a != 0: s += a * (-L / 2).exp() * (-L) ** k
        d.append(s / arb.fac_ui(k) if hasattr(arb, 'fac_ui') else s / arb(math.factorial(k)))
    e = [(k + 1) * d[k + 1] for k in range(order + 1)]
    f = [(k + 2) * (k + 1) * d[k + 2] for k in range(order + 1)]
    def ratio(num):
        r = []
        for k in range(order + 1):
            r.append((num[k] - sum(r[i] * d[k - i] for i in range(k))) / d[0])
        return r
    return ratio(e), ratio(f)

def lam2(D):
    P = D.P; L = [arb(0)] * (P + 1)
    for n in range(2, P + 1):
        v = D.a[n - 1] * D.L[n - 1] ** 2
        for dd in range(2, n):
            if n % dd == 0: v -= L[dd] * D.a[n // dd - 1]
        L[n] = v
    return L

def ddf(D, s):
    r = acb(0)
    for a, L in zip(D.a, D.L):
        if a != 0: r += a * L * L * (-s * L).exp()
    return r

def run(name, TS):
    t0 = time.time()
    flint.ctx.prec = PREC_Z
    a = series(name); D = DP(a); P = D.P
    flint.ctx.prec = PREC_W
    sL, sR = strip(D)
    Tmax = TS[-1]
    res = {'name': name, 'P': P, 'a_P': a[-1], 'sigma_L': sL, 'sigma_R': sR, 'rows': [], 'rows2': []}
    c0 = 0.3
    cuts = [-c0, c0] + [SLAB * k for k in range(1, int(Tmax / SLAB) + 1)]
    xL, xR = sL - 0.5, sR + 0.5
    H = []
    for i, y in enumerate(cuts):
        for tr in range(40):
            try:
                H.append(path_arg(D, xL, y, xR, y, 0.25)); break
            except Deep:
                y += 0.0037
        else: raise RuntimeError('cut failed')
        cuts[i] = y
    twopi = 2 * arb.pi()
    wind = []
    for k in range(len(cuts) - 1):
        R = path_arg(D, xR, cuts[k], xR, cuts[k + 1], 0.25)
        Lf = path_arg(D, xL, cuts[k], xL, cuts[k + 1], 0.2)
        n = (H[k] + R - H[k + 1] - Lf) / twopi
        m = n.unique_fmpz()
        if m is None: raise RuntimeError('winding not an integer ball: %s' % n)
        wind.append(int(m))
    res['winding_total_upper'] = sum(wind)
    uf = float(D.u)
    dev = max(abs(wn - SLAB * uf / (2 * math.pi)) for wn in wind[1:])
    res['max_slab_count_deviation'] = dev; res['count_bound_P_minus_1'] = P - 1
    print(name, 'strip', sL, sR, 'winding', sum(wind), 'slabs', len(wind), 'max slab deviation %.2f' % dev, 't=%.0fs' % (time.time() - t0), flush=True)
    dx, dy = 0.2, 0.1
    slab_z = [[] for _ in wind]
    todo = list(range(len(wind)))
    for attempt in range(4):
        if not todo: break
        cand = []
        if attempt == 0:
            for y0 in range(0, len(cuts) - 1, 80):      # chunks of 80 slabs: bounded memory
                y1 = min(len(cuts) - 1, y0 + 80)
                cand.extend(float_zeros(D, sL - 0.4, sR + 0.4, cuts[y0] - 0.2, cuts[y1] + 0.2, dx, dy))
        else:
            for k in todo: cand.extend(float_zeros(D, sL - 0.4, sR + 0.4, cuts[k] - 0.2, cuts[k + 1] + 0.2, dx / 4 ** attempt, dy / 4 ** attempt))
        for k in todo: slab_z[k] = []
        tds = set(todo)
        for z in cand:
            B, ok = certify_zero(D, z)
            if not ok: continue
            k0 = max(0, int(float(B.imag.mid()) // SLAB))
            for k in (k0 - 1, k0, k0 + 1, k0 + 2):
                if k in tds and B.imag > cuts[k] and B.imag < cuts[k + 1]:
                    if not any(B.overlaps(B2) for B2 in slab_z[k]): slab_z[k].append(B)
        flint.ctx.prec = PREC_W
        todo = [k for k in todo if len(slab_z[k]) != wind[k]]
        print(name, 'attempt', attempt, 'deficient slabs', len(todo), 't=%.0fs' % (time.time() - t0), flush=True)
    res['complete'] = not todo
    res['deficient_slabs'] = [(cuts[k], cuts[k + 1], wind[k], len(slab_z[k])) for k in todo]
    if todo:
        return res
    flint.ctx.prec = PREC_Z
    D.setprec(); u = D.u; LAM = lam(D); LAM2 = lam2(D)
    ell, emm = taylor_logder(D, 6)
    I = acb(0, 1)
    Pb = (arb(sR) - arb(0.5)) * u
    Pfac = Pb.exp() if sR > 0.5 else arb(1)
    for tau in [0.0, 7.3]:
        n2, n2p, shift, kap = forms(D, tau)
        ct = cterms(u, tau)
        q = []
        for k in range(6):
            s = acb(0)
            for al, be, nu in ct:
                s += al * (I * nu) ** k + (k * be * (I * nu) ** (k - 1) if k > 0 else 0)
            q.append(2 * s.real)
        sup6 = arb(0)
        for al, be, nu in ct:
            sup6 += 2 * ((abs(al) + abs(be) * u) * abs(nu) ** 6 + 6 * abs(be) * abs(nu) ** 5)
        K6 = Pfac * u * sup6
        C0 = sum((al for al, be, nu in ct), acb(0)); C1 = sum((al * I * nu + be for al, be, nu in ct), acb(0))
        def Gf(w):
            r = acb(0)
            for al, be, nu in ct:
                l = w + I * nu
                r += (l * u).exp() * ((al + be * u) / l - be / (l * l)) - (al / l - be / (l * l))
            return r
        lhs = arb(0); S2 = acb(0)
        for n in range(2, P):
            sh = shift(D.L[n - 1]) / arb(n).sqrt()
            if LAM[n] != 0: lhs -= 2 * (LAM[n] * sh).real
            if LAM2[n] != 0: S2 += LAM2[n] * sh
        const1 = 2 * n2 * ell[0] + sum((-1) ** k * q[k] * ell[k] for k in range(1, 6))
        const2 = C0 * (emm[0] - u * u / 4) - C1 * emm[1]
        Sreg = arb(0); S0 = arb(0); Z2 = acb(0); cnt = 0; k = 0
        def reg1(w):
            v = kap(w)
            return v, v - sum((-1) ** (j + 1) * q[j] / w ** (j + 1) for j in range(6))
        def term2(B):
            w = B - acb(0.5)
            r = ddf(D, B) / D.df(B)
            return r * (Gf(w) + C0 / w - C1 / (w * w))
        for T in TS:
            while k < len(wind) and cuts[k + 1] <= T + 0.2:
                for B in slab_z[k]:
                    w = B - acb(0.5)
                    v, vr = reg1(w)
                    mult = 1 if k == 0 else 2
                    S0 += mult * v.real; Sreg += mult * vr.real; cnt += mult
                    Z2 += term2(B)
                    if k > 0: Z2 += term2(B.conjugate())
                k += 1
            Tc = arb(cuts[k])
            rem = K6 * arb(12) / 5 * (u * Tc / (2 * arb.pi()) + P - 1) / Tc ** 6
            diff = lhs - (Sreg + const1)
            ok = bool(abs(diff) <= rem)
            V0lim = Sreg + const1 + u * n2                 # enclosure centre of lim_T sum <h, kappa_beta h>
            row = {'tau': tau, 'T': float(Tc), 'zeros': cnt, 'lhs_over_n2': float(lhs / n2), 'lhs_rad': float((lhs / n2).rad()),
                   'diff_over_n2': float(diff / n2), 'diff_rad_over_n2': float((diff / n2).rad()),
                   'tail_bound_over_n2': float((rem / n2).upper()), 'enclosed': ok,
                   'V0_partial_over_n2': float(S0 / n2), 'V0_limit_centre_over_n2': float(V0lim / n2), 'V0_limit_halfwidth_over_n2': float(((rem + V0lim.rad()) / n2).upper()),
                   'V0_limit_expected_over_n2': float((lhs + u * n2) / n2),
                   'raw_tail_times_T_over_pred': float((lhs + u * n2 - S0) / n2 * Tc * arb.pi() / (u - 2 * abs(D.a[-1]).log())),
                   'K6': float(K6), 'q': [float(x) for x in q], 'q_odd_rad': [float(q[1].rad()), float(q[3].rad()), float(q[5].rad())]}
            res['rows'].append(row); print(json.dumps(row), flush=True)
            d2 = S2 - (Z2 + const2)
            row2 = {'tau': tau, 'T': float(Tc), 'S2_over_n2': [float((S2 / n2).real), float((S2 / n2).imag)],
                    'defect_abs_over_n2': float(abs(d2) / n2), 'defect_rad': float((abs(d2) / n2).rad()),
                    'defect_times_T2': float(abs(d2) / n2 * Tc * Tc),
                    'defect_if_const_zero': float(abs(d2 + C0 * (-u * u / 4)) / n2), 'u2_over_4': float(u * u / 4)}
            res['rows2'].append(row2); print('Q2', json.dumps(row2), flush=True)
    flint.ctx.prec = PREC_W
    res['seconds'] = time.time() - t0
    return res

if __name__ == '__main__':
    names = sys.argv[1].split(',')
    TS = [float(x) for x in sys.argv[2].split(',')]
    for nm in names:
        r = run(nm, TS)
        json.dump(r, open('tailA_%s.json' % nm, 'w'), indent=1)
