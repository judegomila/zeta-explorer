"""check_ext.py -- identity gamma_2(c)^3 = mu(c) alpha(c) on every node of a squarefree table. Usage: python check_ext.py table.npz"""
import sys, numpy as np
d = np.load(sys.argv[1]); na, nb, N, g2, mu = d['na'], d['nb'], d['N'], d['g2'], d['mu']
al = (na - nb / 2 + 1j * nb * np.sqrt(3) / 2) / np.sqrt(N)
dev = np.abs(g2 ** 3 - mu * al)
print(f"X = {int(d['X'])}, nodes {len(N)}, primes {len(d['pp'])}; max |gamma_2^3 - mu alpha| = {dev.max():.3e}; nodes with N > 1e7: {(N > 1e7).sum()}, max dev there {dev[N > 1e7].max():.3e}")
