"""30-digit re-check (mpmath) of the prime-side minima at height 1e15 (no zero list exists there): Y = 0.33, 0.4, 1."""
import json, os
from recheck12 import one, OUT
if __name__ == '__main__':
    p = json.load(open(os.path.join(OUT, 'p4_zeta_1000000000000000.json')))
    pts = [(r['Y'], '1000000000000000', r['t_at_min_minus_T'], 'prime side M_K (grid minimum over 1.34e8 samples)', r['M_K']['min']) for k, r in p['cols'].items() if r['Y'] > 0.2]
    from multiprocessing import Pool
    res = []
    with Pool(3) as P:
        for r in P.imap(one, pts): res.append(r); print(json.dumps(r), flush=True)
    json.dump(res, open(os.path.join(OUT, 'c4_recheck_1e15.json'), 'w'), indent=1)
