"""Validate: (a) H_{-tau} via xi-convolution vs model Tsharp*D(s_eff); (b) D via zeta-average vs direct series;
(c) referee roots of route 43 are zeros of D at s_eff."""
import sys, math, numpy as np, json
from esc import *
out = []
def one(x, eta, tau, half=None):
    L = math.log(x/(4*math.pi))
    kappa = eta - tau*L/2          # saddle line
    sigc = (1+kappa)/2
    half = half or 9*math.sqrt(2*tau) + 2
    ln = Line(x, half, 0.05, sigc)
    F = complex(ln.F(x, eta, tau))
    lT, se = model_parts(x, eta, tau)
    G = F/c128((lT - ln.ref).exp())          # F / Tsharp
    sef = c128(se)
    Dz = complex(ln.D(sef.real, sef.imag, tau))
    r = dict(x=x, eta=eta, tau=tau, L=L, s_eff=[sef.real, sef.imag], G=[G.real, G.imag], D=[Dz.real, Dz.imag], absdiff=abs(G-Dz), L2overx=L*L/x)
    if tau >= 1 and sef.real > -0.6:
        Ds = complex(D_series(sef, tau, 3*10**7 if tau < 2 else 10**6)); r['Dseries'] = [Ds.real, Ds.imag]; r['abs_D_minus_series'] = abs(Dz-Ds)
    out.append(r); print(json.dumps(r), flush=True)
# (c) referee roots (mirror to lower half-plane)
one(5040.39086, 1.41159, 1.0)
one(192.93262, 3.58704, 4.0)
for x in [1e4, 1e6, 1e8]:
    for tau in [0.25, 1.0]:
        for eta in [0.0, 0.7, 1.5, 3.0]:
            one(x, eta, tau)
json.dump(out, open('check.json', 'w'), indent=1)
