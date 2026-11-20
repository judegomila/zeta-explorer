"""Coefficient-only supremum by continuation: start from a measured zero (sigma0, t0) of D_tau (theta_p = t0 log p), then raise sigma in steps while a
minimum-norm Newton step in theta keeps F(sigma, theta) = 0.  Lower bound for sigma+ computed from the coefficients alone (the start only seeds theta).
Needs absolute convergence of the lifted series on the primes used: run for tau >= 1.  Usage: bohr_climb.py"""
import json, math, os, numpy as np
from bohr import setup
def newton(c, V, th):
    for it in range(80):
        e = c*np.exp(-1j*(V @ th)); F = e.sum()
        if abs(F) < 1e-13: return th, True
        J = (-1j*V*e[:, None]).sum(0)
        d, *_ = np.linalg.lstsq(np.array([J.real, J.imag]), -np.array([F.real, F.imag]), rcond=None)
        nd = np.linalg.norm(d)
        if nd > 0.5: d = d*0.5/nd
        th = th + d
    return th, False
def gradstep(c, l, V, th):
    """direction in theta that allows increasing sigma: d sigma/d theta along the zero set; here simple randomised ascent is used instead."""
    return None
out = []
rng = np.random.default_rng(3)
for tau in (1.0, 4.0, 16.0):
    for kind in ('zeta', 'chi4', 'dh', 'tnr', 'ea'):
        f = 'out/esc_%s_%g.json' % (kind, tau)
        if not os.path.exists(f): continue
        d = json.load(open(f)); s0, t0 = d['top'][0][0], d['top'][0][1]
        N, PMAX = (4000, 61) if tau == 1.0 else (600, 31)
        a, g, l, V, ps = setup(kind, tau, N, PMAX)
        th = np.array([(t0*math.log(p)) % (2*math.pi) for p in ps])
        best = None
        sig = s0 - 0.05                      # start slightly below the measured zero (truncation to PMAX-smooth n shifts the zero)
        th, ok = newton(a*g*np.exp(-sig*l), V, th)
        if not ok: out.append(dict(kind=kind, tau=tau, measured=s0, climb=None)); print(kind, tau, 'start failed'); continue
        step = 0.01
        for it in range(4000):
            # try to raise sigma; on failure perturb theta randomly (keeps the solution on the zero set after Newton) and halve the step
            th2, ok = newton(a*g*np.exp(-(sig + step)*l), V, th)
            if ok: sig += step; th = th2
            else:
                tried = False
                for _ in range(12):
                    th3, ok3 = newton(a*g*np.exp(-(sig + step)*l), V, th + 0.3*rng.standard_normal(len(th)))
                    if ok3: sig += step; th = th3; tried = True; break
                if not tried:
                    step /= 2
                    if step < 2e-6: break
        r = dict(kind=kind, tau=tau, measured_sigma_max=s0, at_t=t0, T=d['T'], coefficient_only_sup_lower_bound=sig, N=N, PMAX=PMAX, sigma_abs=d['bounds']['sigma_abs'])
        out.append(r); print(json.dumps(r), flush=True)
json.dump(out, open('out/bohr_climb.json', 'w'), indent=1)
