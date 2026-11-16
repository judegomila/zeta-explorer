# Motherbox scan: distribution of measured one-pair detection support a* over many locations in the Odlyzko table.
# Same form as pair_validate.py (true zeros, the two on-line zeros adjacent to the insertion point replaced by an
# off-line pair at their midpoint, density background outside +-R). numpy only.
import numpy as np, math, sys, json
Z = np.load(sys.argv[1]); start, stop, step, d = int(sys.argv[2]), int(sys.argv[3]), int(sys.argv[4]), float(sys.argv[5])
out = open(sys.argv[6], 'a')
def leg_on(x, N, a):
    t = x/a; P = np.empty((N, x.size)); P[0] = 1.0; P[1] = t
    for k in range(1, N-1): P[k+1] = ((2*k+1)*t*P[k] - k*P[k-1])/(k+1)
    return P*np.sqrt((2*np.arange(N)+1)/(2*a))[:,None]
def lam_min(a, d, idx, R=80.0):
    g0, g1 = Z[idx], Z[idx+1]; H0 = 0.5*(g0+g1)
    N = int(1.3*a*R)+40
    xg, wg = np.polynomial.legendre.leggauss(2*N+int(a*R)+40); x = a*xg; w = a*wg
    Phi = leg_on(x, N, a)*w
    lo, hi = np.searchsorted(Z, H0-R), np.searchsorted(Z, H0+R)
    gam = np.concatenate([Z[lo:idx], Z[idx+2:hi]]) - H0
    V = Phi @ np.exp(-1j*np.outer(x, gam)); Q = V @ V.conj().T
    D = x[:,None]-x[None,:]; KR = (R/np.pi)*np.sinc(R*D/np.pi); L = math.log(H0/(2*math.pi))
    Q = Q + L*(np.eye(N) - Phi @ KR @ Phi.T)
    up = Phi @ np.exp(d*x); um = Phi @ np.exp(-d*x)
    Q = Q + np.outer(up, um) + np.outer(um, up)
    return np.linalg.eigvalsh(Q)[0]
def bis(f, lo, hi, tol=2e-3):
    flo, fhi = f(lo), f(hi)
    if flo < 0 or fhi > 0: return None
    while hi-lo > tol:
        m = 0.5*(lo+hi)
        if f(m) > 0: lo = m
        else: hi = m
    return 0.5*(lo+hi)
def model_root(d, L):
    lo, hi = 0.2, 60.0
    for _ in range(80):
        m = 0.5*(lo+hi)
        if 2*m - math.sinh(2*m*d)/d + L > 0: lo = m
        else: hi = m
    return lo
for idx in range(start, stop, step):
    H0 = 0.5*(Z[idx]+Z[idx+1]); L = math.log(H0/(2*math.pi)); am = model_root(d, L)
    a_star = bis(lambda a: lam_min(a, d, idx), 0.3*am, 1.5*am)
    gaps = [(Z[idx+j+1]-Z[idx+j])*L/(2*math.pi) for j in (-1, 0, 1)]
    out.write(json.dumps(dict(idx=idx, H=H0, L=L, d=d, a_star=a_star, a_model=am, gaps=gaps))+"\n"); out.flush()
