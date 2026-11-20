"""adaptive stage (PREREG section 5): centres = the 100 best near-misses of the grid and of the registered draws of each
family (200 centres), 200 perturbations each. usage: jad.py <outdir> <base fams>"""
import os
import sys
import numpy as np
import jf

out = sys.argv[1]
for fam in sys.argv[2].split(','):
    kind, pol = jf.fam_info(fam)
    tabs = []
    for src in (fam, fam + '-rnd'):
        p = dict(np.load(os.path.join(out, src + '_params.npz')))
        top = np.load(os.path.join(out, src + '_top.npy'))[:100]
        tabs.append(jf.take(p, top))
    c = jf.cat(tabs)
    t = jf.perturb(kind, c, 200, 142000 + jf.FAMS.index(fam))
    np.savez(os.path.join(out, fam + '-adp_params.npz'), **t)
    print(fam, 'centres', jf.nfun(c), 'perturbed in window', jf.nfun(t), flush=True)
