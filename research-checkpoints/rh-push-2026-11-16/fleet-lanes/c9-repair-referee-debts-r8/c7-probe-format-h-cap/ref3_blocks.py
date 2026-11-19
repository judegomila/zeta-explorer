"""Referee of Proposition B (blockwise Hilbert-Schmidt bound) of push/c8-repair-engine-map-r7/c7-probe-format-h-cap/REFEREE2.md.
Different cases from ref2_blocks.py: cubic-residue-symbol matrices over Z (complex unimodular entries), row-dependent column
partitions, and general rectangle tilings (guillotine). Largest array: 240 x 1500 complex128 = 5.8 MB (printed before allocation)."""
import numpy as np, sys
rng = np.random.default_rng(20261118)
def primes_1mod3(n):
    out = []; k = 7
    while len(out) < n:
        if k % 3 == 1 and all(k % d for d in range(2, int(k**.5) + 1)): out.append(k)
        k += 1
    return out
def cubic_matrix(Q, D):
    """T[m, j] = cubic residue character of m modulo the j-th prime p = 1 mod 3 (0 if p | m)"""
    ps = primes_1mod3(D)
    print("planned allocation: %d x %d complex128 = %.1f MB" % (Q, D, Q*D*16/1e6))
    T = np.zeros((Q, D), dtype=complex)
    zeta3 = np.exp(2j*np.pi/3)
    for j, p in enumerate(ps):
        g = next(g for g in range(2, p) if all(pow(g, (p - 1)//r, p) != 1 for r in set(f for f in range(2, p) if (p - 1) % f == 0 and all(f % d for d in range(2, int(f**.5) + 1)))))
        dl = {pow(g, k, p): k for k in range(p - 1)}
        for m in range(1, Q + 1):
            if m % p: T[m - 1, j] = zeta3**(dl[m % p] % 3)
    return T
def opnorm(M): return np.linalg.norm(M, 2) if M.size else 0.0
def cuts(n, k):
    c = sorted(set(rng.choice(np.arange(1, n), size=min(k, n - 1), replace=False).tolist())) if n > 1 else []
    return [0] + c + [n]
def guillotine(r0, r1, c0, c1, depth):
    if depth == 0 or (r1 - r0 < 4 and c1 - c0 < 4): return [(r0, r1, c0, c1)]
    if (rng.random() < 0.5 and r1 - r0 >= 4) or c1 - c0 < 4:
        k = int(rng.integers(r0 + 2, r1 - 1)); return guillotine(r0, k, c0, c1, depth - 1) + guillotine(k, r1, c0, c1, depth - 1)
    k = int(rng.integers(c0 + 2, c1 - 1)); return guillotine(r0, r1, c0, k, depth - 1) + guillotine(r0, r1, k, c1, depth - 1)
for Q, D in [(80, 1500), (240, 1500), (200, 200)]:
    T = cubic_matrix(Q, D)
    A = np.exp(2j*np.pi*rng.random(Q)) * (0.5 + rng.random(Q)); A /= np.linalg.norm(A)
    be = np.exp(2j*np.pi*rng.random(D)) * (0.5 + rng.random(D)); be /= np.linalg.norm(be)
    b1 = np.abs(be).max()*D**.5; a0 = np.abs(A).min()*Q**.5
    print("Q = %d, D = %d: entries of modulus 1: %.4f of all; ||T||^2 = %.0f, max(Q, D) = %d; b1 = %.3f, a0 = %.3f; |<A, T beta>| = %.3f (not zero)"
          % (Q, D, (np.abs(T) > .5).mean(), opnorm(T)**2, max(Q, D), b1, a0, abs(np.vdot(A, T @ be))))
    # (a) product partitions (Proposition B as stated)
    worst = np.inf
    for _ in range(25):
        rc = cuts(Q, int(rng.integers(1, 8))); cc = cuts(D, int(rng.integers(1, 12)))
        tot = 0.0; cmin = 1.0
        for i in range(len(rc) - 1):
            for j in range(len(cc) - 1):
                B = T[rc[i]:rc[i+1], cc[j]:cc[j+1]]; cmin = min(cmin, (np.abs(B) > .5).mean())
                tot += np.linalg.norm(A[rc[i]:rc[i+1]]) * opnorm(B) * np.linalg.norm(be[cc[j]:cc[j+1]])
        worst = min(worst, tot / (cmin**.5/b1 * D**.5))
    print("   (a) product partitions: min of blockwise sum / ((c^(1/2)/b1) ||A|| ||beta|| D^(1/2)) = %.3f" % worst)
    # (b) column partition depending on the row block
    worst = np.inf
    for _ in range(25):
        rc = cuts(Q, int(rng.integers(1, 8))); tot = 0.0; cmin = 1.0
        for i in range(len(rc) - 1):
            cc = cuts(D, int(rng.integers(1, 12)))
            for j in range(len(cc) - 1):
                B = T[rc[i]:rc[i+1], cc[j]:cc[j+1]]; cmin = min(cmin, (np.abs(B) > .5).mean())
                tot += np.linalg.norm(A[rc[i]:rc[i+1]]) * opnorm(B) * np.linalg.norm(be[cc[j]:cc[j+1]])
        worst = min(worst, tot / (cmin**.5/b1 * D**.5))
    print("   (b) row-dependent column partitions: min ratio = %.3f" % worst)
    # (c) general rectangle tilings, bound with lower flatness a0 of A
    worst = np.inf
    for _ in range(25):
        tiles = guillotine(0, Q, 0, D, int(rng.integers(2, 7))); tot = 0.0; cmin = 1.0
        assert sum((r1 - r0)*(c1 - c0) for r0, r1, c0, c1 in tiles) == Q*D
        for r0, r1, c0, c1 in tiles:
            B = T[r0:r1, c0:c1]; cmin = min(cmin, (np.abs(B) > .5).mean())
            tot += np.linalg.norm(A[r0:r1]) * opnorm(B) * np.linalg.norm(be[c0:c1])
        worst = min(worst, tot / (cmin**.5*a0/b1 * D**.5))
    print("   (c) rectangle tilings: min of blockwise sum / ((c^(1/2) a0/b1) ||A|| ||beta|| D^(1/2)) = %.3f" % worst)
