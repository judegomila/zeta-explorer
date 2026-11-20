#!/usr/bin/env python3
"""height.py k N theta.npy rho out.json [sig_back]: construct a height T with -T log p = theta*_p (mod 2 pi) to weighted
accuracy rho (simultaneous inhomogeneous Diophantine approximation by LLL + Kannan embedding, exact integer
arithmetic), then locate the zero of D_N near sigma* + iT in float64 from the exact phases.  MEASURED; the
certificate is cert_zero.py."""
import sys, json, math, time
import numpy as np
from flint import fmpz_mat, fmpz, arb, ctx
import tor

k = float(sys.argv[1]); N = int(sys.argv[2]); seed = np.load(sys.argv[3]); rho = float(sys.argv[4]); out = sys.argv[5]
w, ln, V, ps = tor.setup(k, N)
sig, th = float(seed[0]), seed[1:]
if len(sys.argv) > 6:
    sig2 = sig - float(sys.argv[6]); r, th = tor.solve(w, ln, V, sig2, th); assert r < 1e-12; sig = sig2
a = w * np.exp(-sig * ln); e = np.exp(1j * (V @ th))
B0 = a @ e
J = 1j * (V.T @ (a * e)); c = np.abs(J)
Bs = -(a * ln) @ e
print('N', N, 'primes', len(ps), 'sigma*', sig, '|B|', abs(B0), '|dB/ds|', abs(Bs), 'sum c', c.sum(), flush=True)
# primes with negligible sensitivity are left unconstrained
free = c * math.pi < rho / (4 * math.sqrt(len(ps)))
idx = np.nonzero(~free)[0]; d = len(idx)
print('constrained primes', d, 'free', int(free.sum()), 'worst-case free contribution', float((c[free] * math.pi).sum()), flush=True)
DELTA_LOG2 = 10
logdet_target = (d + 1) * math.log(rho / (3 * math.sqrt((d + 1) / 17.0)))
logkappa = logdet_target - np.sum(np.log(2 * math.pi * c[idx]))
P = int(-logkappa / math.log(2)) + 80
ctx.prec = P + 200
print('log10 kappa', logkappa / math.log(10), 'scale bits', P, 'expected log10 T about', (math.log(rho) - logkappa) / math.log(10) - DELTA_LOG2 * 0.30103, flush=True)
sc = arb(2) ** P
def toint(x):
    return int((x * sc).floor().unique_fmpz()) if (x * sc).floor().unique_fmpz() is not None else int((x * sc).mid().floor().unique_fmpz())
twopi = 2 * arb.pi()
rows = []
for jj, j in enumerate(idx):
    r = [0] * (d + 2); r[jj] = toint(twopi * arb(float(c[j]))); rows.append(r)
r = [toint(arb(int(ps[j])).log() * arb(float(c[j])) / 2 ** DELTA_LOG2) for j in idx] + [max(1, toint(arb(math.exp(1)) ** arb(logkappa))), 0]
K = r[d]; rows.append(r)
Mp = toint(arb(rho / 3))
# target: q*Delta*log p*c - 2 pi m c  ~  -theta* c
rows.append([toint(arb(float(-th[j])) * arb(float(c[j]))) for j in idx] + [0, Mp])
A = fmpz_mat(rows)
t0 = time.time(); R = A.lll(); print('LLL seconds', time.time() - t0, flush=True)
best = None
for i in range(d + 2):
    last = int(R[i, d + 1])
    if abs(last) == Mp:
        v = [int(R[i, j]) for j in range(d + 1)]
        sgn = 1 if last > 0 else -1
        nrm = math.sqrt(sum((float(arb(x) / sc)) ** 2 for x in v[:d]))
        if best is None or nrm < best[0]:
            best = (nrm, sgn, v)
assert best is not None, 'no embedding vector found'
nrm, sgn, v = best
# reduced vector = sgn*(target - lattice point): kappa-coordinate = -sgn*q*K
q = -sgn * v[d]; assert q % K == 0; q //= K
print('weighted distance', nrm, 'q bits', abs(q).bit_length(), flush=True)
ctx.prec = abs(q).bit_length() + 300
T = arb(q) / 2 ** DELTA_LOG2
thT = np.array([float(((-T * arb(int(p)).log()) / twopi - ((-T * arb(int(p)).log()) / twopi).floor()).mid()) * 2 * math.pi for p in ps])
dth = (thT - th + math.pi) % (2 * math.pi) - math.pi
print('max |err| constrained', float(np.abs(dth[idx]).max()), 'weighted norm', float(np.sqrt(np.sum((c[idx] * dth[idx]) ** 2))), flush=True)
# zero of D_N(sigma + i(T + tau)) from the exact phases
s = complex(sig, 0.0); avec = w
for it in range(100):
    ee = avec * np.exp(-s * ln) * np.exp(1j * (V @ thT))
    f = ee.sum(); fp = -(ee * ln).sum(); s -= f / fp
    if abs(f / fp) < 1e-15: break
print('zero of D_N at sigma', s.real, 'tau', -s.imag if False else s.imag, '|D|', abs(f), '|D\'|', abs(fp), flush=True)
json.dump(dict(k=k, N=N, q=str(q), delta_log2=DELTA_LOG2, T_log10=float(arb(abs(q)).log() / arb(10).log()) - DELTA_LOG2 * 0.30103,
               sigma_torus=sig, sigma_zero=s.real, tau=s.imag, weighted_distance=nrm, constrained=d, primes=len(ps)), open(out, 'w'))
