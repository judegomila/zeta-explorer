#!/usr/bin/env python3
"""Combination 1: A_S = P_1 F_S P_1 for S = {inf, p_1..p_k}; top eigenvalues (Lanczos, full reorthogonalisation) and
traces of |A|^3, A^4 and f(A) = |A|^3/sqrt(1-A^2) on the complement of the converged top states (stochastic Lanczos quadrature on A^T A).
FFT-Mellin on a log grid (method of lane s2, spec.py); cupy on one device if available.
usage: c1_spec.py FAMILY K delta [NLAN NPROBE MSLQ OUT]
FAMILY: zeta | sign | uni | ea | ntp | ntp1 (ntp at 2, zeta elsewhere) | dh (DH parts at 2, 3, zeta elsewhere) | tnr | arch"""
import sys, math, time, json, os
import numpy as np
import lf
try:
    if os.environ.get('S6_NUMPY'): raise ImportError
    import cupy as xp
    xp.get_default_memory_pool().set_limit(size=int(float(os.environ.get('S6_POOL_GB', '22')) * 1024**3))
    GPU = True
except Exception:
    import numpy as xp
    GPU = False
FAM = sys.argv[1]; K = int(sys.argv[2]); delta = float(sys.argv[3])
NLAN = int(sys.argv[4]) if len(sys.argv) > 4 else 160
NPROBE = int(sys.argv[5]) if len(sys.argv) > 5 else 32
MSLQ = int(sys.argv[6]) if len(sys.argv) > 6 else 40
OUT = sys.argv[7] if len(sys.argv) > 7 else 'out1'
os.makedirs(OUT, exist_ok=True); t0 = time.time(); PI = math.pi
PR = [2, 3, 5, 7, 11, 13, 17, 19][:K]
if FAM == 'arch': parts = []
elif FAM == 'ntp1': parts = [('ntp', 2)] + [('zeta', p) for p in PR[1:]]
elif FAM == 'dh': parts = [('dh', p) for p in PR[:2]] + [('zeta', p) for p in PR[2:]]
elif FAM in ('chi5', 'chim4'):       # local factors of L(s, chi): 1/(1 - chi(p) z); the archimedean multiplier stays that of the cosine transform
    val = (lambda p: [0, 1, -1, -1, 1][p % 5]) if FAM == 'chi5' else (lambda p: [0, 1, 0, -1][p % 4])
    parts = [({1: 'zeta', -1: 'sign', 0: 'triv'}[val(p)], p) for p in PR]
else: parts = [(FAM, p) for p in PR]
v0, v1 = -34.0, 30.0
L = int(round((v1 - v0) / delta)); L -= L % 16
v = v0 + delta * np.arange(L)
inside = (v <= 0.0) & (v >= -16.0); idx_in = np.where(inside)[0]; nin = int(inside.sum())
is_complex = any(n == 'uni' for n, _ in parts)
isz = 16 if is_complex else 8
print(f'[{FAM} k={K} primes={PR}] gpu={GPU} delta={delta} L={L} inside={nin} complex={is_complex}; planned: Lanczos basis {(NLAN+1)*nin*isz/2**30:.2f} GB, FFT work arrays {8*L*16/2**30:.2f} GB', flush=True)
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
del w, logcos, s
for name, p in parts: mu *= lf.rho(name, p, tk)
unit_dev = float(np.max(np.abs(np.abs(mu) - 1)))
phi = np.exp(-1j * tk * v0)
rev = (-np.arange(L)) % L
TN = PI / delta; at = np.abs(tk) / TN
chi = np.where(at < 0.6, 1.0, np.where(at > 0.9, 0.0, 0.5 * (1 + np.cos(PI * (at - 0.6) / 0.3))))
kernel_k = xp.asarray(mu[rev] * np.conj(phi) ** 2 * chi)
del mu, phi, chi, at, tk
rev = xp.asarray(rev); idx = xp.asarray(idx_in)
i0, i1 = int(idx_in[0]), int(idx_in[-1]) + 1
dt = xp.complex128 if is_complex else xp.float64
if GPU: fft_, ifft_ = xp.fft.fft, xp.fft.ifft
else:
    import scipy.fft as sfft
    NW = int(os.environ.get('RH_WORKERS', '2')); fft_ = lambda a: sfft.fft(a, workers=NW); ifft_ = lambda a: sfft.ifft(a, workers=NW)
def FS(full): return ifft_(kernel_k * fft_(full)[rev])
def FSadj(full): return ifft_((xp.conj(kernel_k) * fft_(full))[rev])
def A(u):
    full = xp.zeros(L, dtype=xp.complex128); full[i0:i1] = u
    r = FS(full)[i0:i1]
    return r if is_complex else r.real
def Aadj(u):
    full = xp.zeros(L, dtype=xp.complex128); full[i0:i1] = u
    r = FSadj(full)[i0:i1]
    return r if is_complex else r.real
def Bop(u): return Aadj(A(u))
op = Bop if is_complex else A
vin = xp.asarray(v[idx_in]); g = xp.exp(vin / 2) * xp.exp(-PI * xp.exp(2 * vin))
print(f'max||mu|-1| = {unit_dev:.2e}; setup {time.time()-t0:.0f}s', flush=True)
def nrm(a): return float(xp.sqrt(xp.vdot(a, a).real))
rng = np.random.default_rng(1)
q = xp.asarray(rng.standard_normal(nin)) * xp.exp(vin / 2); q = q.astype(dt); q /= nrm(q)
Q = xp.zeros((NLAN + 1, nin), dtype=dt); Q[0] = q
alpha = np.zeros(NLAN); beta = np.zeros(NLAN); nl = NLAN
for j in range(NLAN):
    wv = op(Q[j]); alpha[j] = float(xp.vdot(Q[j], wv).real)
    wv = wv - alpha[j] * Q[j]
    if j > 0: wv -= beta[j - 1] * Q[j - 1]
    for _ in range(2):
        coef = xp.conj(Q[:j + 1] @ xp.conj(wv)) if is_complex else Q[:j + 1] @ wv      # no copy of the basis
        wv -= coef @ Q[:j + 1]
    beta[j] = nrm(wv)
    if beta[j] < 1e-12: nl = j + 1; break
    Q[j + 1] = wv / beta[j]
    if j % 40 == 0: print(f'  lanczos step {j} [{time.time()-t0:.0f}s]', flush=True)
T = np.diag(alpha[:nl]) + np.diag(beta[:nl - 1], 1) + np.diag(beta[:nl - 1], -1)
ev, U = np.linalg.eigh(T)
order = np.argsort(-np.abs(ev)); ev = ev[order]; U = U[:, order]
KK = min(80, nl)
X = xp.asarray(U[:, :KK].T.astype(complex if is_complex else float)) @ Q[:nl]
del Q
res = np.array([nrm(op(X[n]) - ev[n] * X[n]) for n in range(KK)])
sv = np.sqrt(np.maximum(ev[:KK], 0)) if is_complex else ev[:KK]
conv = [n for n in range(KK) if res[n] < 1e-7]
print(f'top values (value, 1-value^2, residual); converged (res<1e-7): {len(conv)}')
for n in range(min(KK, 12)): print(f'   n={n:2d} {sv[n]:+.10f}  {1-sv[n]**2:.6e}  res={res[n]:.1e}', flush=True)
Xc = X[conv] if conv else None; lam_c = np.array([sv[n] for n in conv])
del X
def deflate(z):
    if Xc is None: return z
    return z - (xp.conj(Xc @ xp.conj(z)) if is_complex else Xc @ z) @ Xc
f3 = lambda y: np.maximum(y, 0) ** 1.5
f4 = lambda y: y ** 2
ff = lambda y: np.maximum(y, 0) ** 1.5 / np.sqrt(np.maximum(1 - y, 1e-300))
fn = lambda y: (y > 0.01).astype(float)            # count of |lambda| > 0.1
est = {m: {'t3': [], 't4': [], 'tf': [], 'n01': []} for m in (MSLQ // 2, MSLQ)}
tr2 = []
for pr in range(NPROBE):
    z = xp.asarray(rng.choice([-1.0, 1.0], size=nin)).astype(dt); z = deflate(z); z = deflate(z)
    n2 = float(xp.vdot(z, z).real); q0 = z / math.sqrt(n2)
    a_ = np.zeros(MSLQ); b_ = np.zeros(MSLQ); qp = None; qc = q0; ml = MSLQ
    for j in range(MSLQ):
        wv = Bop(qc); wv = deflate(wv)
        if j == 0: tr2.append(n2 * float(xp.vdot(qc, wv).real))
        a_[j] = float(xp.vdot(qc, wv).real); wv = wv - a_[j] * qc
        if qp is not None: wv -= b_[j - 1] * qp
        b_[j] = nrm(wv)
        if b_[j] < 1e-14: ml = j + 1; break
        qp = qc; qc = wv / b_[j]
    for m in est:
        mm = min(m, ml)
        Tm = np.diag(a_[:mm]) + np.diag(b_[:mm - 1], 1) + np.diag(b_[:mm - 1], -1)
        th, S = np.linalg.eigh(Tm); wt = S[0] ** 2
        est[m]['t3'].append(n2 * float(np.sum(wt * f3(th)))); est[m]['t4'].append(n2 * float(np.sum(wt * f4(th))))
        est[m]['tf'].append(n2 * float(np.sum(wt * ff(th)))); est[m]['n01'].append(n2 * float(np.sum(wt * fn(th))))
    if pr % 8 == 0: print(f'  probe {pr} [{time.time()-t0:.0f}s]', flush=True)
def ms(a): a = np.array(a); return float(a.mean()), float(a.std(ddof=1) / math.sqrt(len(a))) if len(a) > 1 else float('nan')
top3 = float(np.sum(np.abs(lam_c) ** 3)); top4 = float(np.sum(lam_c ** 4)); topf = float(np.sum(np.abs(lam_c) ** 3 / np.sqrt(1 - lam_c ** 2)))
out = dict(family=FAM, k=K, primes=PR, delta=delta, L=L, nin=nin, gpu=GPU, complex=is_complex, unit_dev=unit_dev, values=[float(x) for x in sv], res=res.tolist(), nconv=len(conv),
           gap=float(1 - np.max(np.abs(sv))), top3=top3, top4=top4, topf=topf, tr2_rest=ms(tr2), seconds=None)
for m in est:
    out[f'm{m}'] = {k_: ms(v_) for k_, v_ in est[m].items()}
m = MSLQ
out['Sigma'] = topf + out[f'm{m}']['tf'][0]; out['Sigma_err'] = out[f'm{m}']['tf'][1]
out['Tr3'] = top3 + out[f'm{m}']['t3'][0]; out['Tr4'] = top4 + out[f'm{m}']['t4'][0]
G = np.prod([1 / (1 - p ** -0.5) for p in PR]); H = np.prod([1 / (1 - 1 / p) for p in PR])
out['model_tail3'] = 0.25 * (G - 1); out['model_tail4'] = 0.125 * (H - 1); out['seconds'] = time.time() - t0
print(f"RESULT1 {FAM} k={K} delta={delta}: gap 1-sup|lam| = {out['gap']:.6e}; nconv={len(conv)}; Sigma = {out['Sigma']:.4f} +- {out['Sigma_err']:.4f} (top part {topf:.4f}); "
      f"Tr|A|^3 = {out['Tr3']:.4f} (top {top3:.4f}, rest {out[f'm{m}']['t3'][0]:.4f} +- {out[f'm{m}']['t3'][1]:.4f}; half-m rest {out[f'm{m//2}']['t3'][0]:.4f}); "
      f"TrA^4 = {out['Tr4']:.4f} (top {top4:.4f}, rest {out[f'm{m}']['t4'][0]:.4f} +- {out[f'm{m}']['t4'][1]:.4f}); TrA^2 rest = {out['tr2_rest'][0]:.2f}; model tails (zeta-type): cubic {out['model_tail3']:.4f}, quartic {out['model_tail4']:.4f}; {out['seconds']:.0f}s", flush=True)
json.dump(out, open(f'{OUT}/c1_{FAM}_k{K}_d{delta:g}.json', 'w'))
