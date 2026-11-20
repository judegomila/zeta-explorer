# Recount of the lane's table 3.1 (registered grid, P2, strict reading) and the T-train / held-out criterion from
# the stored sign matrices, with the referee's own selection code written from PREREG sections 1, 5, 6.
import sys, os, json
import numpy as np
LANE = sys.argv[1]
meta = json.load(open(os.path.join(LANE, 'out', 'meta.json')))
g = np.array(meta['groups'])
P = np.nonzero(g == 'P')[0]
PH = np.nonzero(g == 'PH')[0]
C = [np.nonzero(g == 'C%d' % k)[0] for k in range(1, 10)]
H = [np.nonzero(g == 'H%d' % k)[0] for k in range(1, 10)]
out = {}
tot_fun = 0
for fam in ['D1', 'D2-F1', 'D2-F2', 'D2-F3', 'D2-F4', 'D2-F5', 'D3a', 'D3b-F1', 'D3b-F2', 'D3b-F3', 'D3b-F4', 'D3b-F5']:
    S = np.load(os.path.join(LANE, 'out', 'signs_%s.npy' % fam), mmap_mode='r')
    n = S.shape[0]
    tot_fun += n
    one = 0
    rej = np.zeros(9, dtype=np.int64)
    ttrain = 0
    full = 0
    tweak = 0
    best_min_frac = 0.0
    p0_one = 0
    p0_ttrain = 0
    for a in range(0, n, 100000):
        B = np.asarray(S[a:a + 100000])
        s = B[:, P[0]]
        ok = (B[:, P] != 0).all(axis=1) & (B[:, P] == s[:, None]).all(axis=1)
        one += int(ok.sum())
        r = np.stack([(B[:, c] == -s[:, None]).any(axis=1) for c in C], axis=1)
        rej += (r & ok[:, None]).sum(axis=0)
        tt = ok & r.all(axis=1)
        ttrain += int(tt.sum())
        hf = np.stack([(B[:, h] == -s[:, None]).mean(axis=1) for h in H], axis=1)
        posok = (B[:, PH] == s[:, None]).mean(axis=1) >= 0.95
        full += int((tt & posok & (hf >= 23 / 24 - 1e-12).all(axis=1)).sum())
        tweak += int((tt & (hf > 0).all(axis=1) & ~(B[:, PH] == -s[:, None]).any(axis=1)).sum())
        if ok.any():
            best_min_frac = max(best_min_frac, float(hf[ok].min(axis=1).max()))
        z = s != 0
        p0_one += int(z.sum())
        p0_ttrain += int((z & r.all(axis=1)).sum())
    out[fam] = dict(functionals=n, one_signed_P2=one, pass_fraction=[None if one == 0 else round(1 - int(x) / one, 3) for x in rej], T_train_P2=ttrain, T_weak_P2=tweak, full_P2=full,
                    best_min_over_classes_heldout_fraction_P2=best_min_frac, one_signed_P0=p0_one, T_train_P0=p0_ttrain)
    print(fam, out[fam], flush=True)
out['total_functionals'] = tot_fun
out['total_one_signed_P2'] = sum(v['one_signed_P2'] for v in out.values() if isinstance(v, dict))
json.dump(out, open(sys.argv[2], 'w'), indent=1)
print(out['total_functionals'], out['total_one_signed_P2'])
