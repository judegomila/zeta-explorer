"""Zeros of the Davenport-Heilbronn function with Re s > 1 (poles of its scattering quotient in Re(2s) > 1).
Winding of DH(1 + it) in t (float64 Euler-Maclaurin Hurwitz), then Newton refinement with mpmath."""
import numpy as np, math, json, mpmath as mp
XI = (math.sqrt(10 - 2*math.sqrt(5)) - 2)/(math.sqrt(5) - 1)
def hurw(s, a, N=400):
    n = np.arange(N)[:, None]; x = N + a
    S = np.sum((n + a)**(-s[None, :]), axis=0)
    S += x**(1-s)/(s-1) + x**(-s)/2
    B = [1/6, -1/30, 1/42, -1/30, 5/66]; term = s*x**(-s-1); f = 2.0
    for k, b in enumerate(B, start=1):
        S += b/f*term
        term = term*(s+2*k-1)*(s+2*k)/x**2; f *= (2*k+1)*(2*k+2)
    return S
def dh(s): return 5.0**(-s)*(hurw(s, .2) + XI*hurw(s, .4) - XI*hurw(s, .6) - hurw(s, .8))
def dh_mp(s): return 5**(-s)*(mp.zeta(s, mp.mpf(1)/5) + XI*mp.zeta(s, mp.mpf(2)/5) - XI*mp.zeta(s, mp.mpf(3)/5) - mp.zeta(s, mp.mpf(4)/5))
T = 4000.0; t = np.arange(0.5, T, 0.02)
mn = np.full(len(t), 9.0)
for sg in (1.0, 1.02, 1.04, 1.06, 1.08, 1.1, 1.12):
    v = np.concatenate([abs(dh(sg + 1j*t[i:i+20000])) for i in range(0, len(t), 20000)])
    if sg == 1.0: print('check float vs mp:', abs(v[1234] - abs(complex(dh_mp(mp.mpc(1, t[1234]))))))
    mn = np.minimum(mn, v)
loc = np.nonzero((mn[1:-1] < mn[:-2]) & (mn[1:-1] <= mn[2:]) & (mn[1:-1] < 0.3))[0] + 1
print('smallest grid minima:', sorted([(round(float(mn[k]),4), round(float(t[k]),2)) for k in loc])[:12])
cands = [float(t[k]) for k in loc]
print('winding done; candidates', len(cands), flush=True)
found = []
def newton(z):
    for _ in range(60):
        f = dh(np.array([z]))[0]; h = 1e-6; d = (dh(np.array([z+h]))[0] - dh(np.array([z-h]))[0])/(2*h)
        step = f/d; z = z - step
        if abs(step) < 1e-12: return z
    return None
for c in cands:
    best = None
    for sg in (1.02, 1.06, 1.1):
        for dt in (-0.2, 0, 0.2):
            z = newton(complex(sg, c+dt))
            if z is not None and z.real > 1 and abs(z.imag - c) < 1.0: best = z; break
        if best is not None: break
    if best is not None and not any(abs(best - f) < 1e-6 for f in found): found.append(best)
mp.mp.dps = 30
pol = []
for z in found[:12]:
    try: pol.append(mp.findroot(dh_mp, mp.mpc(z.real, z.imag), tol=1e-25))
    except Exception as e: pol.append(mp.mpc(z.real, z.imag))
print('polished (30 digits):', [(mp.nstr(z.real, 15), mp.nstr(z.imag, 15)) for z in pol])
found = [mp.mpc(z.real, z.imag) for z in found]
found.sort(key=lambda z: z.imag)
print('candidates', len(cands), 'zeros found', len(found))
for z in found[:25]: print(mp.nstr(z.real, 12), mp.nstr(z.imag, 14))
json.dump([[str(z.real), str(z.imag)] for z in found], open(__file__.replace('dhzeros.py','out/dh_right_zeros.json'), 'w'), indent=0)
