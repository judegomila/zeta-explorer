# float64 trapezoid checks (analytic, rapidly decaying integrands). Planned memory: chunks of
# 500 x 33001 complex128 = 264 MB at most.
import numpy as np, json, math, os
HERE = os.path.dirname(os.path.abspath(__file__))
def g0(u):
    x = np.exp(np.minimum(u, 6.0)); return (2*np.pi**2*x**2.25 - 3*np.pi*x**1.25)*np.exp(-np.pi*x)
uk = np.linspace(-16, 16, 64001); du = uk[1]-uk[0]
def kap(u):
    a = np.abs(u); return sum(g0(a + 2*math.log(n))/math.sqrt(n) for n in range(1, 80))
def H(tau, z, shift=0.0):   # transform of G_tau kappa(. + shift)
    return np.sum(np.exp(tau*uk**2/16)*kap(uk+shift)*np.exp(z*uk/2))*du
ug = np.linspace(-60, 6, 33001); dg = ug[1]-ug[0]; g0g = g0(ug)
def ghat(tau, w):           # w array
    w = np.atleast_1d(w)
    return (np.exp(tau*ug**2/16)*g0g)[None, :] @ np.exp(np.outer(ug/2, w)) * dg if False else \
           np.exp(np.outer(w, ug/2)) @ (np.exp(tau*ug**2/16)*g0g) * dg
out = {}
rel = {}
for tau in [-0.4, 0.25]:
    for p in [2, 3, 7, 47]:
        L = math.log(p); z = 0.15 + 6.3j
        a = p**(-0.5 - z)*math.exp(tau*L*L/4)*H(tau, z - tau*L/2)
        b = H(tau, z, shift=2*L)/math.sqrt(p)
        rel['tau=%g,p=%d' % (tau, p)] = abs(a-b)/abs(b)
out['sheared_Vp_equals_multiplier_times_real_translation_relerr'] = rel
ex = {}
for tau, lmax in [(-2.0, 7.6), (-1.2, 9.2), (-0.8, 10.8)]:
    N = int(math.exp(lmax))
    for z in [14.134725j, 3.0j, 0.3 + 21.0j]:
        s = 0; sa = 0
        for a in range(1, N+1, 500):
            n = np.arange(a, min(a+500, N+1)); l = np.log(n)
            t = n**(-0.5 - z)*np.exp(tau*l*l/4)*ghat(tau, z - tau*l/2)
            s += t.sum(); sa += np.abs(t).sum()
        h = H(tau, z)
        ex['tau=%g,z=%s' % (tau, z)] = {'N': N, 'H_tau': [h.real, h.imag], 'series': [s.real, s.imag], 'abs_err': abs(h-s), 'sum_abs_terms': sa}
out['sheared_expansion_tau_negative'] = ex
l1 = {}
for tau in [-2.0, -1.0, -0.5, -0.3]:
    N = int(min(2e7, math.exp(2/abs(tau) + 12/math.sqrt(abs(tau)))))
    n = np.arange(1, N+1, dtype=float)
    l1[str(tau)] = {'N': N, 'sum': float(np.sum(n**-0.5*np.exp(tau*np.log(n)**2/4))), 'model': math.sqrt(4*math.pi/abs(tau))*math.exp(1/(4*abs(tau)))}
out['l1_chain'] = l1
json.dump(out, open(HERE + '/transport.json', 'w'), indent=1); print(json.dumps(out, indent=1))
