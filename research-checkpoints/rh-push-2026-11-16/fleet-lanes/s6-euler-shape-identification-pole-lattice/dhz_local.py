"""Local float64 screen: min over sigma in {1, 1.04, 1.08, 1.12} of |DH(sigma + it)|, t <= T (Euler-Maclaurin Hurwitz
with N = max(200, t/4) terms), candidates refined by float Newton and one mpmath evaluation."""
import numpy as np, math, json, sys, mpmath as mp
XI = (math.sqrt(10 - 2*math.sqrt(5)) - 2)/(math.sqrt(5) - 1)
def hurw(s, a, N):
    ln = np.log(np.arange(N) + a)[:, None]; x = N + a
    S = np.exp(-s[None, :]*ln).sum(axis=0)
    S += x**(1-s)/(s-1) + x**(-s)/2
    B = [1/6, -1/30, 1/42, -1/30, 5/66, -691/2730, 7/6]; term = s*x**(-s-1); f = 2.0
    for k, b in enumerate(B, start=1):
        S += b/f*term
        term = term*(s+2*k-1)*(s+2*k)/x**2; f *= (2*k+1)*(2*k+2)
    return S
def dh(s, N): return 5.0**(-s)*(hurw(s, .2, N) + XI*hurw(s, .4, N) - XI*hurw(s, .6, N) - hurw(s, .8, N))
def dh_mp(s): return 5**(-s)*(mp.zeta(s, mp.mpf(1)/5) + XI*mp.zeta(s, mp.mpf(2)/5) - XI*mp.zeta(s, mp.mpf(3)/5) - mp.zeta(s, mp.mpf(4)/5))
T = float(sys.argv[1]); h = 0.05; CH = 1000; cands = []; gmin = 9.0
for i0 in range(0, int(T/h), CH):
    t = 0.5 + h*np.arange(i0-1, i0+CH+1); N = max(200, int(t[-1]/4))
    mn = np.min([abs(dh(sg + 1j*t, N)) for sg in (1.0, 1.04, 1.08, 1.12)], axis=0)
    loc = np.nonzero((mn[1:-1] < mn[:-2]) & (mn[1:-1] <= mn[2:]) & (mn[1:-1] < 0.25))[0] + 1
    cands += [(float(t[k]), float(mn[k])) for k in loc]; gmin = min(gmin, float(mn.min()))
    if i0 % 40000 == 0: print('t', t[-1], 'grid min so far', gmin, 'cands', len(cands), flush=True)
mp.mp.dps = 20
print('check vs mpmath at t=', cands[-1][0] if cands else None, abs(dh(np.array([1.04 + 1j*(cands[-1][0] if cands else 100.0)]), max(200, int(T/4)))[0] - complex(dh_mp(mp.mpc(1.04, cands[-1][0] if cands else 100.0)))))
zs = []
for c, m in cands:
    N = max(400, int(c/3))
    for sg in (1.02, 1.06, 1.1):
        z = complex(sg, c); ok = False
        for _ in range(40):
            f = dh(np.array([z]), N)[0]; d = (dh(np.array([z+1e-6]), N)[0] - dh(np.array([z-1e-6]), N)[0])/2e-6
            if not np.isfinite(f) or d == 0: break
            st = f/d; z -= st
            if abs(st) < 1e-11: ok = True; break
        if ok and z.real >= 1.0 and abs(z.imag - c) < 0.6:
            if not any(abs(z - w) < 1e-6 for w in zs): zs.append(z)
            break
print('grid minimum', gmin, 'candidates', len(cands), 'zeros with Re >= 1:', len(zs))
for z in zs: print(z, 'mpmath |DH| there:', mp.nstr(abs(dh_mp(mp.mpc(z.real, z.imag))), 5))
json.dump(dict(T=T, grid_min=gmin, n_candidates=len(cands), zeros=[[z.real, z.imag] for z in zs]), open(__file__.replace('dhz_local.py', 'out/dh_right_zeros_local.json'), 'w'), indent=1)
