"""locate.py: float64 location of the zero of the Dirichlet factor D_N and of the off-axis zero of F near a height."""
import sys, json, math, numpy as np
import fscreen as S
def newton(f, z, it=60):
    for _ in range(it):
        h = 1e-6
        d = (f(z + h) - f(z - h)) / (2 * h)
        st = f(z) / d
        z = z - st
        if abs(st) < 1e-11: break
    return z, abs(f(z))
def run(sch, inp, N, w, x):
    o = S.Obj(sch, inp, N, w)
    D = lambda s: complex(o.D(np.array([s]))[0])
    F = lambda z: complex(o.F(np.array([z]))[0])
    # grid search for min |D| on sigma in [0.5,1], t in [x, x+1]
    sg = np.linspace(0.5, 1.0, 101); tt = np.linspace(x, x + 1, 401)
    best = None
    for s0 in sg:
        v = np.abs(o.D(s0 + 1j * tt)); i = int(np.argmin(v))
        if best is None or v[i] < best[0]: best = (v[i], s0, tt[i])
    sD, rD = newton(D, complex(best[1], best[2]))
    yy = np.linspace(0.02, 0.49, 48); bestF = None
    for y0 in yy:
        v = np.abs(o.F(tt + 1j * y0)); i = int(np.argmin(v))
        if bestF is None or v[i] < bestF[0]: bestF = (v[i], tt[i], y0)
    zF, rF = newton(F, complex(bestF[1], bestF[2]))
    ps = S.primes_upto(N)
    th = (-sD.imag * np.log(ps)) % (2 * math.pi)
    return dict(scheme=sch, input=inp, N=N, weight=w, D_zero=[sD.real, sD.imag], D_resid=rD,
                F_zero_s=[0.5 + zF.imag, zF.real], F_resid=rF, phases_over_pi=[round(float(a / math.pi), 3) for a in th])
if __name__ == '__main__':
    for a in sys.argv[1:]:
        sch, inp, N, w, x = a.split(',')
        print(json.dumps(run(sch, inp, int(N), w, float(x))))
