# MEASURED validation of the sharp one-pair (density) model with real zeta zeros (Odlyzko table).
# Configuration: true zeros, except the two on-line zeros nearest H are replaced by the off-line pair H0 +- i*delta
# (H0 = their midpoint). Zero-side Weil form on g in L^2(-a,a) (modulated to height H0):
#   Q(g) = sum_{on-line gamma in window} |ghat(gamma)|^2 + 2 Re[ ghat(H0+i d) conj ghat(H0-i d) ]
# Report the support a* where lambda_min(Q) changes sign vs the density-model prediction
#   sinh(2 a d)/d - 2a = log(H/2pi).
import numpy as np, math, sys
from scipy.optimize import brentq
Z = np.load('/Users/USER/Documents/GitHub/mathexplorer/tmp/routes-b6-r22-lehmer/odlyzko1e6.npy')
def leg_on(x, N, a):
    t = x/a; P = np.empty((N, x.size)); P[0] = 1.0; P[1] = t
    for k in range(1, N-1): P[k+1] = ((2*k+1)*t*P[k] - k*P[k-1])/(k+1)
    return P*np.sqrt((2*np.arange(N)+1)/(2*a))[:,None]
def lam_min(a, d, idx, R=80.0, N=None):
    g0, g1 = Z[idx], Z[idx+1]; H0 = 0.5*(g0+g1)
    N = N or int(1.3*a*R)+40
    xg, wg = np.polynomial.legendre.leggauss(2*N+int(a*R)+40); x = a*xg; w = a*wg; x = a*xg; w = a*wg
    Phi = leg_on(x, N, a)*w
    lo, hi = np.searchsorted(Z, H0-R), np.searchsorted(Z, H0+R)
    gam = np.concatenate([Z[lo:idx], Z[idx+2:hi]]) - H0
    V = Phi @ np.exp(-1j*np.outer(x, gam))          # N x nzeros
    Q = V @ V.conj().T
    # zeros outside the window: smooth density L/2pi  ->  L*(I - band-limiting projector to |tau|<R)
    D = x[:,None]-x[None,:]
    KR = (R/np.pi)*np.sinc(R*D/np.pi)
    L = math.log(H0/(2*math.pi))
    Q = Q + L*(np.eye(N) - Phi @ KR @ Phi.T)
    up = Phi @ np.exp(d*x); um = Phi @ np.exp(-d*x)
    Q = Q + np.outer(up, um) + np.outer(um, up)
    return np.linalg.eigvalsh(Q)[0], H0
def model(a, d, L): return 2*a - math.sinh(2*a*d)/d + L
for idx in [int(s) for s in sys.argv[1:]] or [10000, 100000, 500000, 900000]:
    for d in (0.5, 0.375):
        H0 = 0.5*(Z[idx]+Z[idx+1]); L = math.log(H0/(2*math.pi))
        a_model = brentq(lambda a: model(a, d, L), 0.2, 60)
        f = lambda a: lam_min(a, d, idx)[0]
        a_star = brentq(f, 0.4*a_model, 1.4*a_model, xtol=1e-3)
        print(f"idx={idx} H={H0:.2f} L={L:.3f} delta={d}: measured a*={a_star:.4f}  density-model a={a_model:.4f}  ratio={a_star/a_model:.4f}  oversampling L/2a={L/(2*a_model):.2f}", flush=True)
