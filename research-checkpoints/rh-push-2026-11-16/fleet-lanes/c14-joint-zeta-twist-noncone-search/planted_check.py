"""is the registered planted functional (JB1, m = 2, t = 0, h = 0.1) a full survivor of the synthetic run?"""
import json
import sys
import numpy as np
import jan
o = sys.argv[1]
res = {}
for fam in ('JB1-with', 'JB1-without'):
    p = dict(np.load('%s/%s_params.npz' % (o, fam)))
    i = np.nonzero((p['m'] == 2) & (np.abs(p['a'] - 0.1) < 1e-9) & (p['c'] == 0))[0]
    g, s1, idx2, S = jan.load(o, fam)
    R = jan.criterion(S, jan.gidx(g), 'PA', 'strict', jan.ALLC)
    k = int(np.searchsorted(idx2, i[0]))
    res[fam] = dict(row=int(i[0]), in_stage2=bool(idx2[k] == i[0]), full=bool(R['full'][k]), sign=int(R['s'][k]), heldout=[int(v) for v in R['hf'][k]], ph_same=int(R['ph_same'][k]))
print(json.dumps(res))
json.dump(res, open('planted_check.json', 'w'), indent=1)
