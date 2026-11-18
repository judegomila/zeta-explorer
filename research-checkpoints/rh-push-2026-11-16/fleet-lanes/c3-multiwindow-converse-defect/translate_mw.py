"""Lemma B check: zeta(s + i alpha) in m windows [T_j, T_j + H].  Exact relative defect on the line: |1 - exp(i Psi(t, alpha))|,
Psi(t, alpha) = 2 theta(t + alpha) - 2 theta(t).  Scan the lattice of window 1 (Psi(Tc_1, alpha_k) = 2 pi k), k <= KMAX, evaluate
the other windows; report eta_min(m) = min over alpha != 0 of max over windows and t of |1 - e^{i Psi}|; compare with
2 pi (H / (T log(T/2pi)))^(1/m).  Winner re-evaluated with mpmath.siegeltheta at 50 digits."""
import numpy as np, mpmath as mp, json
mp.mp.dps = 50
RAT = [1.0, 1.37, 1.93, 2.71, 3.59, 4.83]; H = 2.0; KMAX = 4_000_000
def psi(t, al):  # float64, cancellation-free form of 2 theta(t+al) - 2 theta(t) (Stirling, error O(al / t^2))
    return al * np.log(t / (2 * np.pi)) + (t + al) * np.log1p(al / t) - al - al / (24 * t * (t + al))
def psi_mp(t, al): return 2 * (mp.siegeltheta(mp.mpf(t) + mp.mpf(al)) - mp.siegeltheta(mp.mpf(t)))
out = []
print(f"planned arrays: {KMAX} float64 x ~8 = {KMAX*8*8/1e6:.0f} MB")
for T1 in (1e5, 1e7, 1e9, 1e11, 1e13):
    k = np.arange(1, KMAX + 1, dtype=float); Tc = T1 + H / 2
    al = 2 * np.pi * k / np.log(Tc / (2 * np.pi))
    for _ in range(4): al -= (psi(Tc, al) - 2 * np.pi * k) / (np.log(Tc / (2 * np.pi)) + al / Tc)   # Newton on the lattice of window 1
    al = np.concatenate([al, -al])
    for _ in range(3): al[KMAX:] -= (psi(Tc, al[KMAX:]) + 2 * np.pi * k) / (np.log(Tc / (2 * np.pi)) + al[KMAX:] / Tc)
    worst = np.where(np.abs(al) < T1 / 10, 0.0, 9.0)
    for m in range(1, 7):
        Tj = T1 * RAT[m - 1]
        for t in (Tj, Tj + H / 2, Tj + H):
            worst = np.fmax(worst, np.abs(2 * np.sin(psi(t, al) / 2)))
        i = int(np.argmin(worst)); a = float(al[i])
        ex = max(abs(1 - mp.e**(1j * psi_mp(T1 * RAT[j] + x, a))) for j in range(m) for x in (0, H / 2, H))
        pred = 2 * np.pi * (H / (T1 * np.log(T1 / (2 * np.pi))))**(1 / m)
        rec = dict(T1=T1, m=m, alpha=a, eta_float=float(worst[i]), eta_mp=float(ex), heuristic=pred, alpha_range=float(al[KMAX - 1]))
        out.append(rec); print(json.dumps(rec), flush=True)
json.dump(out, open("translate_mw.json", "w"), indent=1)
