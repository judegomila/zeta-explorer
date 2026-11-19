"""Pivot check: rank-one family for the non-L^2 functional (point evaluation on GL(1)):
rho(t) = |zeta(1/2+it)|^2, F(E) = PV int rho(t) dt/(t-E) (symmetric PV at infinity) = 2E PV int_0^inf rho/(t^2-E^2).
A zero gamma is an eigenvalue of the member with coupling alpha = -1/F(gamma). Question: is F(gamma_n) constant in n?
Planned memory: one array of T/h = 1e5 floats (0.8 MB). Single process.
"""
import json, math, sys, time
import numpy as np
import mpmath as mp
mp.mp.dps = 15
t0 = time.time()
T, h = 2000.0, 0.02
n = int(T/h)
ts = (np.arange(n) + 0.5)*h
print("planned array:", n, "floats", flush=True)
rho = np.array([float(mp.siegelz(float(t)))**2 for t in ts])
print("rho computed", time.time()-t0, "s; mean of rho on [T/2,T]:", rho[n//2:].mean(), " predicted", (T*(math.log(T/(2*math.pi))+2*0.5772156649-1) - (T/2)*(math.log(T/(4*math.pi))+2*0.5772156649-1))/(T/2), flush=True)
g0 = 0.5772156649015329
def tail(E, Tc):
    return float(2*E*mp.quad(lambda t: (mp.log(t/(2*mp.pi)) + 2*g0)/(t*t - E*E), [Tc, 10*Tc, 100*Tc, mp.inf]))
def F(E, Tc):
    m = ts < Tc
    return float(2*E*np.sum(rho[m]/(ts[m]**2 - E*E))*h) + tail(E, Tc)
zs = [float(mp.im(mp.zetazero(k))) for k in range(1, 16)]
rows = []
for k, g in enumerate(zs, 1):
    f2, f1 = F(g, 2000.0), F(g, 1000.0)
    rows.append({"n": k, "gamma": g, "F_T2000": f2, "F_T1000": f1, "alpha": -1/f2})
    print(f"n={k:2d} gamma={g:10.6f} F(T=2000)={f2:+.6f} F(T=1000)={f1:+.6f} alpha={-1/f2:+.5f}", flush=True)
vals = [r["F_T2000"] for r in rows]
print("pi^2/2 =", math.pi**2/2, " mean F =", np.mean(vals), " spread (max-min) =", max(vals)-min(vals), " max |T2000-T1000| =", max(abs(r["F_T2000"]-r["F_T1000"]) for r in rows))
json.dump({"T": T, "h": h, "rows": rows, "seconds": time.time()-t0}, open(sys.argv[1], "w"), indent=1)
