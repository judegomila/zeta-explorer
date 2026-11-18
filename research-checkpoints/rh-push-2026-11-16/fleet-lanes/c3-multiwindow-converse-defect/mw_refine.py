"""Refine one case of mw.py from its saved survivor with a larger iteration budget.  usage: mw_refine.py T layout m delta [nfev]"""
import numpy as np, json, sys, time
from scipy.optimize import least_squares
from mw import *
T = float(sys.argv[1]); layout = sys.argv[2]; m = int(sys.argv[3]); d = float(sys.argv[4]); nfev = int(sys.argv[5]) if len(sys.argv) > 5 else 3000
tag = f"{layout}_T{T:g}"; N = int(round(3.2 * np.sqrt(T / (2 * np.pi)))); ps = primes_upto(N); P = len(ps); E = expo_matrix(N, ps)
hs = heights(T, layout, max(m, 2))[:m]
print(f"planned: N={N} P={P} windows={m}; rows {m*K*(J-1)} x {N} complex x2 = {m*K*(J-1)*N*32/1e6:.0f} MB", flush=True)
t0 = time.time(); full = [window_rows(Tj, N) for Tj in hs]; Rm = compress(np.vstack([compress(realmap(*w)) for w in full]))
o1, o2, z1, z2 = zero_rows(T, N, d); Z = np.vstack([realmap(o1[None, :], o2[None, :]), realmap(z1, z2)])
fz, jz = make_fun(np.vstack([Rm, Z]), E); th = np.load(f"surv_{tag}_m{m}_d{d}.npy")
def report(th, label):
    a = np.exp(1j * (E @ th)); md = max(float(np.abs(D1 @ a + D2 @ np.conj(a)).max()) for D1, D2 in full)
    rec = dict(T=T, layout=layout, m=m, delta=d, label=label, maxdef=md, absF=abs(complex(o1 @ a + o2 @ np.conj(a))), s0_xindep=float(np.abs(z1 @ a + z2 @ np.conj(a)).max()), sec=round(time.time() - t0))
    print(json.dumps(rec), flush=True); open("mw_refine.jsonl", "a").write(json.dumps(rec) + "\n")
report(th, "start")
for rnd in range(4):
    r = least_squares(fz, th, jac=jz, method="trf", xtol=1e-15, ftol=1e-15, gtol=1e-15, max_nfev=nfev); th = r.x
    report(th, f"round{rnd} nfev={r.nfev} status={r.status}"); np.save(f"refined_{tag}_m{m}_d{d}.npy", th)
    if r.status != 0: break
