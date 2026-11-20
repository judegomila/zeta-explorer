"""Combination (4) analysis.
  own <code> <a> <Tmax> <dt> <zero-file|none> T1 T2 ...   control with its own coefficients: E_-, E_- of the causalised function, excess
  planted <base> <a> <dt> <Tmax> delta gamma1 gamma2 ...  planted quadruple on the base at T = gamma/4, gamma/2, 0.9 gamma, 1.5 gamma (when <= Tmax)
  sigma <code> <a> <Tmax> <dt> T                           spread of E_-(a; T') about a linear fit, T' in [0.8 T, T], 33 values
Output: json lines on stdout."""
import sys, json, math, os
import numpy as np
import run_em as E
W = int(os.environ.get('RH_WORKERS', '4'))

def offline(code, a, zf):
    """off-line zeros (delta, gamma) with delta > a"""
    a = float(a)
    if code == 'DH':
        z = json.load(open(zf)); return [(float(b) - 0.5, float(g)) for b, g, _ in z['offline'] if float(b) - 0.5 > a]
    if code == 'TNR':
        d = 0.4037532248277235; L = math.log(3)
        return [(d, (2 * k + 1) * math.pi / L) for k in range(0, 400)] if d > a else []
    if code.startswith('EA-'):
        n, dn = code[3:].split('/'); d = int(n) / int(dn)
        from flint import acb
        return [(d, float(acb.zeta_zero(k).imag.mid())) for k in range(1, 400)] if d > a else []
    return []

def pad_for(N):
    return 32 if N < 2 ** 19 else (8 if N < 2 ** 23 else (4 if N < 2 ** 24 else 2))

def em(ghalf, n, dt, factor=None):
    g = E.full(ghalf, n)
    if factor is not None: g = g * factor
    return E.eminus(g, dt, pad_for(len(g)))

def sigma(gh, dt, T, mult=None):
    Ts = np.linspace(0.8 * T, T, 33); es = []
    for Tp in Ts:
        n = int(round(Tp / dt)); f = None if mult is None else mult(E.tgrid(n, dt)); es.append(em(gh, n, dt, f))
    es = np.array(es); c = np.polyfit(Ts, es, 1); res = es - np.polyval(c, Ts)
    return float(res.std()), float(c[0]), float(es[-1])

def main():
    mode = sys.argv[1]
    if mode == 'own':
        code, a, Tmax, dt, zf = sys.argv[2], sys.argv[3], float(sys.argv[4]), float(sys.argv[5]), sys.argv[6]
        gh = E.vals(code, a, Tmax, dt, W); af = float(a); offz = offline(code, a, zf)
        def fixf(t):
            f = np.ones_like(t, dtype=complex)
            for d, g in offz: f *= E.fix_factor(t, af, d, g)
            return f
        for T in [float(x) for x in sys.argv[7:]]:
            n = int(round(T / dt)); t = E.tgrid(n, dt)
            e = em(gh, n, dt); ef = em(gh, n, dt, fixf(t)) if offz else e
            sg = sigma(gh, dt, T, fixf if offz else None) if T >= 4 else (None, None, None)
            print(json.dumps(dict(mode='own', code=code, a=af, T=T, dt=dt, n_offline_fixed=len(offz), first_offline=(offz[0] if offz else None),
                                  E_minus=e, E_minus_causalised=ef, excess=e - ef, sigma_causalised=sg[0], slope=sg[1],
                                  excess_over_sigma=((e - ef) / sg[0] if sg[0] else None))), flush=True)
    elif mode == 'planted':
        base, a, dt, Tmax, delta = sys.argv[2], sys.argv[3], float(sys.argv[4]), float(sys.argv[5]), float(sys.argv[6])
        gh = E.vals(base, a, Tmax, dt, W); af = float(a)
        for gamma in [float(x) for x in sys.argv[7:]]:
            for frac in (0.25, 0.5, 0.9, 1.5):
                T = frac * gamma
                if T > Tmax + 1e-9: continue
                n = int(round(T / dt)); t = E.tgrid(n, dt)
                pf = E.planted_factor(t, af, delta, gamma)
                e0 = em(gh, n, dt); e = em(gh, n, dt, pf)
                ef = em(gh, n, dt, pf * E.fix_factor(t, af, delta, gamma)) if delta > af else e
                sg = sigma(gh, dt, T) if n < 3e6 else sigma(gh[:int(3e6)], dt, 3e6 * dt)
                print(json.dumps(dict(mode='planted', base=base, a=af, delta=delta, gamma=gamma, T=T, T_over_gamma=frac, dt=dt, E_minus_base=e0,
                                      E_minus_planted=e, E_minus_planted_causalised=ef, excess=e - ef, sigma_base=sg[0],
                                      sigma_window=(T if n < 3e6 else 3e6 * dt), excess_over_sigma=(e - ef) / sg[0])), flush=True)
    elif mode == 'mirror':
        # E_- of g (poles), g*beta (poles reflected to zeros: causal), g*beta^2 (causal, each reflected zero doubled)
        code, a, Tmax, dt, zf = sys.argv[2], sys.argv[3], float(sys.argv[4]), float(sys.argv[5]), sys.argv[6]
        gh = E.vals(code, a, Tmax, dt, W); af = float(a)
        if code.startswith('PLZ:'):
            pass
        offz = offline(code, a, zf)
        for T in [float(x) for x in sys.argv[7:]]:
            n = int(round(T / dt)); t = E.tgrid(n, dt); f = np.ones_like(t, dtype=complex)
            for d, g in offz: f *= E.fix_factor(t, af, d, g)
            e0 = em(gh, n, dt); e1 = em(gh, n, dt, f); e2 = em(gh, n, dt, f * f)
            print(json.dumps(dict(mode='mirror', code=code, a=af, T=T, first_offline=(offz[0] if offz else None), E_poles=e0, E_causal=e1, E_causal_doubled=e2,
                                  excess=e0 - e1, causal_step=e1 - e2, second_difference=e0 - 2 * e1 + e2)), flush=True)
    elif mode == 'sigma':
        code, a, Tmax, dt, T = sys.argv[2], sys.argv[3], float(sys.argv[4]), float(sys.argv[5]), float(sys.argv[6])
        gh = E.vals(code, a, Tmax, dt, W); s = sigma(gh, dt, T)
        print(json.dumps(dict(mode='sigma', code=code, a=float(a), T=T, dt=dt, sigma=s[0], slope=s[1], E_minus=s[2])), flush=True)


if __name__ == '__main__':
    main()
