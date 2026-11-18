"""Prime-side run. usage: run_prime.py <name> <T> <Nmax> <P: 0|7> <out.json> [gc]"""
import sys, json, time, math, numpy as np, scipy.linalg as sla
from plib import *
name, T, Nmax, P = sys.argv[1], float(sys.argv[2]), int(sys.argv[3]), int(sys.argv[4])
out = sys.argv[5]; gc = float(sys.argv[6]) if len(sys.argv) > 6 else 85.7
ps = [p for p in (2, 3, 5, 7) if p <= P]
tab = mobius_ratio_table(ps) if ps else [(0.0, 1.0)]
shifts = [s for s, c in tab]; coef = np.array([c for s, c in tab])
smax = max(abs(s) for s in shifts)
X = math.exp(T + smax) * 1.0000001
print(f"name={name} T={T} Nmax={Nmax} primes={ps} shifts={len(shifts)} X={X:.4g}; planned: atoms<= {2*X*8*3/1e9:.2f} GB worst case (DH), matrices {Nmax**2*16*4/1e9:.3f} GB", flush=True)
t0 = time.time()
kern = make_kernel(name, X); gk = make_kernel('gram', X)
print(f"atoms={len(kern.ay)} built in {time.time()-t0:.1f}s", flush=True)
mm = mode_index(Nmax); om = gc + 2 * np.pi * mm / T
E, D = ED(kern, T, om, shifts); Eg, Dg = ED(gk, T, om, shifts)
print(f"E,D done {time.time()-t0:.1f}s", flush=True)
res = {"name": name, "T": T, "gc": gc, "primes": ps, "X": X, "rows": []}
i0 = min(range(len(shifts)), key=lambda i: abs(shifts[i]))
Qfull = loewner(E[i0], D[i0], mm)
Qp = loewner(coef @ E, coef @ D, mm); Gp = loewner(coef @ Eg, coef @ Dg, mm)
res["herm_defect_full"] = float(np.abs(Qfull - Qfull.conj().T).max())
res["herm_defect_prim"] = float(np.abs(Qp - Qp.conj().T).max())
np.save(out.replace('.json', '_Qfull.npy'), Qfull)
for N in [n for n in (12, 25, 50, 100, 200, 400) if n <= Nmax]:
    A = Qfull[:N, :N]; A = (A + A.conj().T) / 2
    ev = np.linalg.eigvalsh(A)
    row = {"N": N, "full_min": float(ev[0]), "full_max": float(ev[-1]), "full_neg": int((ev < -1e-8).sum())}
    if ps:
        B = Qp[:N, :N]; B = (B + B.conj().T) / 2; G = Gp[:N, :N]; G = (G + G.conj().T) / 2
        eg = np.linalg.eigvalsh(G)
        evp = sla.eigh(B, G, eigvals_only=True)
        evb = np.linalg.eigvalsh(B)
        row.update({"prim_min": float(evp[0]), "prim_neg": int((evb < -1e-8).sum()), "prim_neg_gen": int((evp < -1e-8).sum()),
                    "gram_min": float(eg[0]), "gram_max": float(eg[-1])})
    res["rows"].append(row); print(row, flush=True)
json.dump(res, open(out, 'w'), indent=1)
print(f"total {time.time()-t0:.1f}s")
