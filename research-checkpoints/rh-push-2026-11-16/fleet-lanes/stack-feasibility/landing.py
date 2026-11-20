"""Constraint (v): forward heat flow F_tau = exp((tau/4) d_s^2) xi.  Zero ODE y' = (1/2) sum 1/(y - y_j) (y = ordinate, complex off the line).
For the quartet y = g +- i d among frozen real neighbours: d' = -1/(4d) - (1/2) sum_k d/((g-g_k)^2 + d^2).
Landing time tau*(delta) = int_0^delta dd / (1/(4d) + (1/2) sum_k d/((g-g_k)^2+d^2)).  Frozen-neighbour estimate (MEASURED/heuristic)."""
import numpy as np, json
d = json.load(open('zeros_3e12.json')); zt = np.array(d['zeros_tau']); dens = d['theta1']/np.pi
cand = np.where(np.abs(zt[:-1]) < 20)[0]; i0 = cand[np.argmin(np.diff(zt)[cand])]; tq = (zt[i0]+zt[i0+1])/2
x = np.delete(zt, [i0, i0+1]) - tq
def rate(dd): return 1/(4*dd) + 0.5*(dd/(x**2 + dd**2)).sum() + dd*dens/130   # + tail of zeros beyond the window
for delta in (0.02, 0.1, 0.2, 0.3, 0.375, 0.5):
    s = np.linspace(1e-6, delta, 20001); f = np.array([1/rate(v) for v in s]); tau = np.trapezoid(f, s)
    print(f'delta={delta}: tau* ~ {tau:.5f}   (isolated-pair de Bruijn value 2 delta^2 = {2*delta**2:.4f}); lands before tau=0.2: {tau < 0.2}')
