#!/usr/bin/env python3
"""Combination 1/3: spectrum of A = P_1 F_S P_1 with swapped local factors (FFT-Mellin on a log grid, Lanczos).
(F_S f)^(1/2+it) = mu(t) f^(1/2-it), mu = m_inf(t) * prod_{p in S} rho_p(t); every rho_p is unimodular, so F_S is unitary.
Real coefficients: A is real symmetric -> Lanczos on A. Complex coefficients: Lanczos on A^* A (singular values).
usage: spec.py CONFIG delta [nlan]      CONFIG = name@p[+name@p...]  e.g. zeta@2, sign@2+zeta@3, arch
"""
import sys, math, time, json, os
import numpy as np
try:
    if os.environ.get('SPEC_NUMPY'): raise ImportError
    import scipy.fft as sfft
    W = int(os.environ.get('SPEC_THREADS', '2'))
    fft = lambda a: sfft.fft(a, workers=W); ifft = lambda a: sfft.ifft(a, workers=W)
except Exception:
    fft = np.fft.fft; ifft = np.fft.ifft
import lf
CONFIG = sys.argv[1]; delta = float(sys.argv[2]) if len(sys.argv) > 2 else 2e-4
NLAN = int(sys.argv[3]) if len(sys.argv) > 3 else 120
OUT = sys.argv[4] if len(sys.argv) > 4 else 'out'
os.makedirs(OUT, exist_ok=True)
t0 = time.time(); PI = math.pi
parts = [] if CONFIG == 'arch' else [(q.split('@')[0], int(q.split('@')[1])) for q in CONFIG.split('+')]
v0, v1 = -34.0, 30.0
L = int(round((v1 - v0) / delta)); L -= L % 16
v = v0 + delta * np.arange(L); x = np.exp(v)
inside = (v <= 0.0) & (v >= -16.0); idx_in = np.where(inside)[0]; nin = int(inside.sum())
is_complex = any(n == 'uni' for n, _ in parts)
bytes_Q = (NLAN + 1) * nin * (16 if is_complex else 8)
print(f'[{CONFIG}] delta={delta} L={L} inside={nin} complex={is_complex}; planned Lanczos basis {bytes_Q/2**30:.2f} GB, FFT work arrays {6*L*16/2**30:.2f} GB', flush=True)
B2K = [1/6, -1/30, 1/42, -1/30, 5/66, -691/2730, 7/6, -3617/510, 43867/798, -174611/330]
def loggamma(z):
    z = np.asarray(z, dtype=complex); shift = np.zeros_like(z); zz = z.copy()
    for _ in range(14):
        small = np.abs(zz) < 14
        if not small.any(): break
        shift = shift + np.where(small, np.log(zz), 0); zz = zz + np.where(small, 1, 0)
    s = (zz - 0.5) * np.log(zz) - zz + 0.5 * math.log(2 * PI)
    zi = 1 / zz; pw = zi
    for k in range(1, 11):
        s = s + B2K[k - 1] / (2 * k * (2 * k - 1)) * pw; pw = pw * zi * zi
    return s - shift
tk = 2 * PI * np.fft.fftfreq(L, d=delta); s = 0.5 + 1j * tk
w = PI * s / 2
with np.errstate(over='ignore', invalid='ignore'):
    logcos = np.where(tk >= 0, -1j * w + np.log((1 + np.exp(2j * w)) / 2), 1j * w + np.log((1 + np.exp(-2j * w)) / 2))
mu = np.exp(math.log(2) - s * math.log(2 * PI) + loggamma(s) + logcos)
for name, p in parts: mu = mu * lf.rho(name, p, tk)
print(f'max||mu|-1| = {np.max(np.abs(np.abs(mu)-1)):.2e}', flush=True)
phi = np.exp(-1j * tk * v0)
rev = (-np.arange(L)) % L
TN = PI / delta; at = np.abs(tk) / TN
chi = np.where(at < 0.6, 1.0, np.where(at > 0.9, 0.0, 0.5 * (1 + np.cos(PI * (at - 0.6) / 0.3))))
kernel_k = mu[rev] * np.conj(phi) ** 2 * chi
kernel_adj = np.conj(kernel_k)
del mu, phi, s, w, logcos
def FS(ft):
    return ifft(kernel_k * fft(ft)[rev])
def FSadj(ft):
    return ifft((kernel_adj * fft(ft))[rev])
g = np.exp(v / 2) * np.exp(-PI * x ** 2)
Fg = FS(g)
print(f'unitarity ||F_S g||/||g|| = {np.linalg.norm(Fg)/np.linalg.norm(g):.10f}; ||F_S^* F_S g - g||/||g|| = {np.linalg.norm(FSadj(Fg)-g)/np.linalg.norm(g):.2e}; max|Im F_S g|/||.|| = {np.max(np.abs(Fg.imag))/np.max(np.abs(Fg)):.1e}', flush=True)
dt = complex if is_complex else float
def A(u):
    full = np.zeros(L, dtype=dt); full[idx_in] = u
    r = FS(full)[idx_in]
    return r if is_complex else r.real
def Aadj(u):
    full = np.zeros(L, dtype=dt); full[idx_in] = u
    return FSadj(full)[idx_in]
op = (lambda u: Aadj(A(u))) if is_complex else A
rng = np.random.default_rng(1)
q = rng.standard_normal(nin) * np.exp(v[idx_in] / 2); q = q.astype(dt)
q /= math.sqrt(np.vdot(q, q).real * delta)
Q = np.zeros((NLAN + 1, nin), dtype=dt); Q[0] = q
alpha = np.zeros(NLAN); beta = np.zeros(NLAN)
for j in range(NLAN):
    wv = op(Q[j])
    alpha[j] = (np.vdot(Q[j], wv) * delta).real
    wv = wv - alpha[j] * Q[j]
    if j > 0: wv -= beta[j - 1] * Q[j - 1]
    for _ in range(2):
        coef = (np.conj(Q[:j + 1] @ np.conj(wv)) if is_complex else Q[:j + 1] @ wv) * delta; wv -= coef @ Q[:j + 1]   # no (j+1) x nin temporary
    beta[j] = math.sqrt(np.vdot(wv, wv).real * delta)
    if beta[j] < 1e-12: NLAN = j + 1; break
    Q[j + 1] = wv / beta[j]
    if j % 20 == 0: print(f'  lanczos step {j} [{time.time()-t0:.0f}s]', flush=True)
T = np.diag(alpha[:NLAN]) + np.diag(beta[:NLAN - 1], 1) + np.diag(beta[:NLAN - 1], -1)
ev, U = np.linalg.eigh(T)
order = np.argsort(-np.abs(ev)); ev = ev[order]; U = U[:, order]
K = min(40, NLAN); lam = ev[:K]; Xi = U[:, :K].T @ Q[:NLAN]
res = np.array([math.sqrt(np.vdot(r, r).real * delta) for r in (op(Xi[n]) - lam[n] * Xi[n] for n in range(K))])
if is_complex: sv = np.sqrt(np.maximum(lam, 0)); label = 'singular value'
else: sv = lam; label = 'eigenvalue'
print(f'top {label}s (value, 1-value^2, residual):')
for n in range(min(K, 16)): print(f'   n={n:2d} {sv[n]:+.8f}  {1-sv[n]**2:.4e}  res={res[n]:.1e}', flush=True)
out = {'config': CONFIG, 'delta': delta, 'L': L, 'complex': is_complex, 'kind': label, 'values': sv.tolist(), 'res': res.tolist(), 'seconds': time.time() - t0}
json.dump(out, open(f'{OUT}/spec_{CONFIG.replace("+","_").replace("@","")}_d{delta:g}.json', 'w'))
print(f'done {time.time()-t0:.0f}s', flush=True)
