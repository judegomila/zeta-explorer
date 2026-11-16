# Motherbox: damped Weil form, DH vs zeta, larger supports (float Ritz, coefficient side only, numpy).
import numpy as np, math, sys, json, time
from galerkin import leg_orthonormal, S_of_u, vm_table, EG
from dh import dh_c
def build_multi(a, thetas, N, weights, pole, arch):
    xg, wg = np.polynomial.legendre.leggauss(N+4)
    ug, vg = np.polynomial.legendre.leggauss(N+80); u = a*(ug+1); v = a*vg
    I = np.eye(N); nt = len(thetas)
    Mp = [np.zeros((N,N)) for _ in thetas]; Ma = [np.zeros((N,N)) for _ in thetas]; Mr = [np.zeros((N,N)) for _ in thetas]
    for ui, vi in zip(u, v):
        S = S_of_u(ui, N, a, xg, wg)
        for i, th in enumerate(thetas):
            sh = 0.5+th + (0.0 if arch == 'zeta' else 1.0)
            if pole: Mp[i] += vi*2*math.exp(-th*ui)*2*math.cosh(ui/2)*S
            Ma[i] += vi*2*(math.exp(-2*ui)*I - math.exp(-sh*ui)*S)/(-math.expm1(-2*ui))
    c0 = -EG - math.log(-math.expm1(-4*a)) + (-math.log(math.pi) if arch == 'zeta' else math.log(arch/math.pi))
    for n, c in weights.items():
        ln = math.log(n)
        if ln >= 2*a or c == 0: continue
        S = S_of_u(ln, N, a, xg, wg)
        for i, th in enumerate(thetas): Mr[i] += (c*n**(-0.5-th)*2)*S
    return [Mp[i] + Ma[i] + c0*I - Mr[i] for i in range(nt)]
if __name__ == '__main__':
    Tres = float(sys.argv[1]); twoas = [float(s) for s in sys.argv[2].split(',')]; outp = sys.argv[3]
    thetas = [0.0, 0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.5]
    for twoa in twoas:
        a = twoa/2; N = int(1.25*a*Tres)+40; Nmax = int(math.exp(twoa))
        t0 = time.time()
        lam = vm_table(Nmax); wz = {n: lam[n] for n in range(2, Nmax+1) if lam[n] > 0}
        Mz = build_multi(a, thetas, N, wz, True, 'zeta')
        evz = [float(np.linalg.eigvalsh(M)[0]) for M in Mz]
        c = dh_c(Nmax); wd = {n: c[n] for n in range(2, Nmax+1)}
        Md = build_multi(a, thetas, N, wd, False, 5)
        evd = [float(np.linalg.eigvalsh(M)[0]) for M in Md]
        rec = dict(twoa=twoa, N=N, Nmax=Nmax, thetas=thetas, zeta=evz, dh=evd, sec=time.time()-t0)
        open(outp, 'a').write(json.dumps(rec)+"\n"); print(rec, flush=True)
