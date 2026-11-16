"""High-precision validation of Lemma R where double precision fails (large tau L^2):
F by acb trapezoid (prec 400) on the horizontal line through z; D_tau by the direct Dirichlet series."""
import math, numpy as np, json, sys
from multiprocessing import Pool
from flint import acb, ctx
from esc import log_gamma_factor, model_parts, c128
def Dser(s, tau, N, chunk=10**7):
    tot = 0j
    for a in range(1, N+1, chunk):
        n = np.arange(a, min(a+chunk, N+1), dtype=float); l = np.log(n)
        tot += np.sum(np.exp(-(tau/4)*l*l - s*l))
    return tot
def job(a):
    x, eta, tau = a
    ctx.prec = 400
    h = 0.1; M = int(10*math.sqrt(2*tau)/h) + 5
    tot = acb(0)
    for j in range(-M, M+1):
        u = j*h; s = acb((1+eta)/2, (x-u)/2)
        if eta >= 1.0:
            tot += (log_gamma_factor(s) + s.zeta().log() - acb(u*u/(4*tau))).exp()
        else:
            tot += (log_gamma_factor(s) - acb(u*u/(4*tau))).exp()*s.zeta()
    tot = tot*h/math.sqrt(4*math.pi*tau)
    lT, se = model_parts(x, eta, tau)
    G = c128(tot/lT.exp()); sef = c128(se)
    L = math.log(x/(4*math.pi))
    Ds = Dser(sef, tau, 6*10**8 if sef.real < -4 else 10**8)
    return dict(x=x, eta=eta, tau=tau, s_eff=[sef.real, sef.imag], G=[G.real, G.imag], Dseries=[Ds.real, Ds.imag], rel=abs(G-Ds)/abs(Ds), L2overx=L*L/x)
if __name__ == '__main__':
    jobs = [(1e8, 0.0, 1.0), (1e8, 1.5, 1.0), (1e8, 3.0, 1.0), (1e10, 0.0, 1.0), (1e10, 3.0, 1.0), (1e6, 0.0, 4.0), (1e4, 2.0, 4.0), (1e8, 6.0, 4.0)]
    with Pool(8) as p: out = p.map(job, jobs, chunksize=1)
    for r in out: print(json.dumps(r))
    json.dump(out, open('check3.json', 'w'), indent=1)
