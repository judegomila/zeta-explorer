"""merge_sieve.py -- merge the per-unit factor-sieve parts (c1s*_sievepart.npz) into c1_sieve.npz (cumulative sums at segment ends)"""
import glob, numpy as np
P = [np.load(f) for f in sorted(glob.glob("c1s*_sievepart.npz"))]; NS = int(P[0]["NS"]); rec = []
for p in P:
    off = 0
    for lo, n in zip(p["los"], p["nseg"]):
        rec.append((int(lo), p["I"][off:off + n], p["D"][off:off + n])); off += n
rec.sort(key=lambda r: r[0]); assert rec[0][0] == 1 and all(rec[i + 1][0] == rec[i][0] + (1 << 28) for i in range(len(rec) - 1))
I = np.concatenate([r[1] for r in rec]); D = np.concatenate([r[2] for r in rec])
ends = np.minimum((1 << 22) * (np.arange(len(I)) + 1), NS)
np.savez_compressed("c1_sieve.npz", ends=ends, I=np.cumsum(I, 0), D=np.cumsum(D, 0)); print("segments", len(I), "N", NS, "rough counts", np.cumsum(I, 0)[-1, :2])
