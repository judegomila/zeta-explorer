# Hole model: on-line zeros at smooth density L/2pi everywhere except a zero-free gap (-r, r) around the pair.
#   Q(g) = L*(||g||^2 - <g, B_r g>) + 2 Re[ ghat(i d) conj ghat(-i d) ],  B_r = band-limiting to |tau|<r.
# r = 0 is the density model (closed form). Reports the support 2a* where lambda_min(Q) = 0.
import numpy as np, math
def leg_on(x, N, a):
    t = x/a; P = np.empty((N, x.size)); P[0] = 1.0; P[1] = t
    for k in range(1, N-1): P[k+1] = ((2*k+1)*t*P[k] - k*P[k-1])/(k+1)
    return P*np.sqrt((2*np.arange(N)+1)/(2*a))[:,None]
def lam_min(a, d, L, r):
    N = int(3*a*max(r,1.0))+30
    xg, wg = np.polynomial.legendre.leggauss(2*N+40); x = a*xg; w = a*wg
    Phi = leg_on(x, N, a)*w
    D = x[:,None]-x[None,:]; KR = (r/np.pi)*np.sinc(r*D/np.pi) if r > 0 else 0*D
    Q = L*(np.eye(N) - Phi @ KR @ Phi.T)
    up = Phi @ np.exp(d*x); um = Phi @ np.exp(-d*x)
    return np.linalg.eigvalsh(Q + np.outer(up, um) + np.outer(um, up))[0]
def root(d, L, r):
    lo, hi = 0.05, 12.0
    for _ in range(40):
        m = 0.5*(lo+hi)
        if lam_min(m, d, L, r) > 0: lo = m
        else: hi = m
    return 0.5*(lo+hi)
L = math.log(3e12/(2*math.pi)); sp = 2*math.pi/L
print(f"X=3e12, L={L:.3f}, mean spacing={sp:.4f}")
print("r (gap half-width), gap in mean spacings, 2a*(delta=1/2), 2a*(delta=3/8), 2a*(delta=0.374887)")
for r in (0.0, sp/2, sp, 1.5*sp, 2*sp, 3*sp, 0.75, 1.0, 1.5):
    print(f"{r:.4f} {2*r/sp:6.2f}  {2*root(0.5,L,r):.4f}  {2*root(0.375,L,r):.4f}  {2*root(0.374887,L,r):.4f}", flush=True)
