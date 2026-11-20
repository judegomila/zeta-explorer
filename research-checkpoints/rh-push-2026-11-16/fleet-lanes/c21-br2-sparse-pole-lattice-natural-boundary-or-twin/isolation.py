# Disturbance statistic of Theorem W (float64; illustration of the counting step, not a proof input).
# E_n = sum over (k, m) != (k0, n) of lam_k |That(n lam_k0 - m lam_k)|, window T(y) = b((y - yc)/h),
# b = (4/3) cos^4(pi u/2) on [-1, 1]; That(xi) = h bhat(h xi), bhat(0) = 1.  Main term: lam_k0 h.
# Good n: E_n < lam_k0 h / 2.   Planned allocation: arrays of at most 2e4 x 41 float64 = 7 MB.
import numpy as np, json, math
def sinc(x):
    x = np.asarray(x, dtype=float); out = np.ones_like(x); nz = np.abs(x) > 1e-9
    out[nz] = np.sin(x[nz])/x[nz]; return out
def bhat(xi):
    return (4/3)*(1/8)*(6*sinc(xi) + 4*(sinc(xi+np.pi)+sinc(xi-np.pi)) + sinc(xi+2*np.pi)+sinc(xi-2*np.pi))
def seq(kind, lam_max):
    f = {'ek': lambda k: math.exp(k), 'ek2': lambda k: math.exp(k/2), 'k3': lambda k: float(k)**3,
         'k2': lambda k: float(k)**2, 'k1.5': lambda k: float(k)**1.5, 'cyc': lambda k: math.log(3)*2.0**(k-1),
         'k3pert': lambda k: float(k)**3 + math.sqrt(2)*math.sin(k*k)}[kind]   # k3pert: generic (non-integer) model
    out, k = [], 1
    while f(k) <= lam_max: out.append(f(k)); k += 1
    return np.array(out)
def stat(kind, k0, h, nmax, skip_first=0):
    l0 = seq(kind, 1e300 if False else 1e7)[k0-1] if kind not in ('ek','ek2','cyc') else {'ek': math.exp(k0), 'ek2': math.exp(k0/2), 'cyc': math.log(3)*2.0**(k0-1)}[kind]
    lam = seq(kind, nmax*l0 + 80/h)[skip_first:]
    i0 = int(np.argmin(np.abs(lam - l0)))
    M = np.arange(-20, 21)[None, :]
    ratios = []
    for n in range(1, nmax+1):
        w = n*l0
        sel = lam <= w + 80/h
        L = lam[sel]
        m0 = np.rint(w/L)[:, None]
        mm = m0 + M
        d = w - mm*L[:, None]
        val = np.abs(bhat(h*d))*(mm >= 1)
        if i0 < len(L): val[i0, 20] = 0.0          # remove the main term (k0, n)
        ratios.append(float((L[:, None]*val).sum()/l0))
    r = np.array(ratios)
    return dict(kind=kind, k0=k0, lam_k0=l0, h=h, nmax=nmax, skip_first=skip_first, n_lattices=int(len(lam)),
                frac_good=float((r < 0.5).mean()), median=float(np.median(r)), min=float(r.min()), max=float(r.max()),
                frac_good_second_half=float((r[nmax//2:] < 0.5).mean()))
if __name__ == '__main__':
    out = []
    for kind, k0, h, nmax, skip in (('ek', 5, 1.0, 2000, 0), ('ek', 7, 0.25, 2000, 0), ('ek2', 10, 1.0, 2000, 0),
                              ('ek2', 14, 0.25, 2000, 4), ('k3pert', 6, 1.0, 2000, 0), ('k3pert', 10, 0.25, 2000, 2),
                              ('k3', 7, 1.0, 2000, 0), ('k3', 11, 0.25, 2000, 2), ('k2', 20, 1.0, 1000, 3),
                              ('k1.5', 60, 1.0, 400, 8), ('cyc', 6, 1.0, 2000, 0), ('cyc', 9, 0.25, 2000, 0)):
        s = stat(kind, k0, h, nmax, skip); out.append(s); print(s, flush=True)
    json.dump(out, open(__file__.replace('isolation.py', 'isolation.json'), 'w'), indent=1)
