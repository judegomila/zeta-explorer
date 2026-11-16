"""Check: zeros of the damped Riemann-Siegel sum Z_tau (mode n damped by exp(-tau*lambda(k_n)), lambda(k)=k(2pi-k), k_n=2pi log n/L)
against the exact Dyson drift ODE dx_k/dtau = 2 sum' 1/(x_k - x_j) started from the true zeros (unfolded), near T0."""
import numpy as np, sys, math
sys.path.insert(0, '.')
import rs_zeros as R
T0 = int(float(sys.argv[1])); dev = sys.argv[2]; taus = [float(v) for v in sys.argv[3:]]
nz = 6000
d0, x0, _ = R.run(T0, nz, dev, log=lambda s: None)
def drift(x, J=600):
    n = len(x); v = np.zeros(n)
    X = x[:, None] - x[None, :]
    np.fill_diagonal(X, np.inf)
    v = 2 * (1 / X).sum(1)
    # continuum tails (unit density) beyond both ends
    a = x[0] - 0.5; b = x[-1] + 0.5
    v += 2 * (np.log((b - x) / (x - a)))   # int_{-inf}^{a} dy/(x-y) + int_b^inf dy/(x-y) (principal, symmetric cutoff) = log((b-x)/(x-a))... sign: int_b^R dy/(x-y) = -log((R-x)/(b-x)), int_{-R}^a = log((x+R)/(x-a))
    return v
def flow(x, tau, dt=2e-5):
    x = x.copy(); n = int(round(tau / dt))
    for _ in range(n):
        k1 = drift(x); k2 = drift(x + 0.5 * dt * k1); k3 = drift(x + 0.5 * dt * k2); k4 = drift(x + dt * k3)
        x = x + dt / 6 * (k1 + 2 * k2 + 2 * k3 + k4)
    return x
L0 = math.log(T0 / (2 * math.pi))
for tau in taus:
    dt_, xt, _ = R.run(T0, nz, dev, log=lambda s: None, tau=tau)
    xf = flow(x0, tau)
    # compare the central 1000 zeros: match by index after aligning counts
    if len(xt) != len(x0): print('tau', tau, 'count mismatch', len(xt), len(x0))
    c = len(x0) // 2; sl = slice(c - 500, c + 500)
    off = np.median(xt[sl] - xf[sl])
    dif = xt[sl] - xf[sl] - off
    gt = np.diff(xt[sl]); gf = np.diff(xf[sl]); g0 = np.diff(x0[sl])
    print('tau=%.4f  common drift offset %.5f  rms position diff %.2e  max %.2e | rms gap diff %.2e | V: start %.4f flowed-ODE %.4f damped-RS %.4f' % (tau, off, dif.std(), np.abs(dif).max(), (gt - gf).std(), g0.var(), gf.var(), gt.var()))
