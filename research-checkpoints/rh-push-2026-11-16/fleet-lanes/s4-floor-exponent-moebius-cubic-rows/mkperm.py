# Combination 4(b) control: copy of the squarefree-node table sf_1e7.npz with the sextic Gauss sums gamma_1(n) permuted among nodes.
# Permutation: nodes sorted by (class mod 4, norm); random permutation inside blocks of 64 consecutive nodes (class and norm scale kept,
# the link between gamma_1(n) and n removed). All other fields (cubic gamma_2, quadratic gamma_3, mu, prime arrays) unchanged.
import sys, numpy as np
src, dst = sys.argv[1], sys.argv[2]
d = dict(np.load(src)); n = len(d['N']); print('nodes', n, 'fields', sorted(d.keys()), flush=True)
order = np.lexsort((d['N'], d['m4'])); rng = np.random.default_rng(20261120); perm = np.arange(n)
for s in range(0, n, 64):
    blk = order[s:s+64]; perm[blk] = blk[rng.permutation(len(blk))]
g1 = d['g1']; moved = float((perm != np.arange(n)).mean())
d['g1'] = g1[perm]
print('fraction of nodes moved %.4f ; mean |g1 - g1_perm| %.4f ; corr(g1, g1_perm) %.5f' % (moved, float(np.abs(g1 - d['g1']).mean()), float(abs(np.vdot(g1, d['g1']))/n)))
np.savez(dst, **d); print('written', dst)
