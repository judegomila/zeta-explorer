"""K_P(n) = Im(a_n/rho_n) for all prime powers n <= NMAX from a zero file (GPU). Output json."""
import numpy as np, sys, math, json, torch, mpmath as mp
f = sys.argv[1]; NMAX = int(float(sys.argv[2]))
dev = torch.device('cuda')
d = np.load(f); T0 = int(float(d['T0'])); delta = d['delta']; x = d['x']; x = x / np.mean(np.diff(x))
phi = 2 * x[1:-1] - x[:-2] - x[2:]; dl = delta[1:-1]; N = len(dl)
L = math.log((T0 + float(np.median(delta))) / (2 * math.pi))
sv = np.ones(NMAX + 1, dtype=bool); sv[:2] = False
for i in range(2, int(NMAX ** 0.5) + 1):
    if sv[i]: sv[i * i::i] = False
pp = []
for p in np.nonzero(sv)[0]:
    q = int(p); m = 1
    while q <= NMAX: pp.append((q, int(p), m)); q *= int(p); m += 1
pp.sort()
mp.mp.dps = 40
ns = np.array([q for q, _, _ in pp], dtype=np.float64)
ph0 = np.array([float(mp.fmod(mp.mpf(T0) * mp.log(q), 2 * mp.pi)) for q, _, _ in pp])
logn = torch.tensor(np.log(ns), device=dev); p0 = torch.tensor(ph0, device=dev)
ph = torch.tensor(phi, device=dev); dt = torch.tensor(dl, device=dev)
rho = torch.zeros(len(pp), dtype=torch.complex128, device=dev); a = torch.zeros(len(pp), dtype=torch.complex128, device=dev)
B = max(1, int(2e8 // len(pp)))
for s in range(0, N, B):
    E = torch.exp(1j * (torch.outer(dt[s:s + B], logn) + p0[None, :]))
    rho += E.sum(0); a += (ph[s:s + B].to(torch.complex128)[:, None] * E).sum(0)
rho = rho.cpu().numpy() / N; a = a.cpu().numpy() / N
rows = [dict(n=q, p=p, m=m, k=2 * math.pi * math.log(q) / L, rho=float(rho[i].real), ima=float(a[i].imag), rea=float(a[i].real), KP=float((a[i] / rho[i]).imag)) for i, (q, p, m) in enumerate(pp)]
json.dump(dict(L=L, N=N, T0=T0, rows=rows), open(f.replace('.npz', '_kp.json'), 'w'))
print('done', len(pp), L)
