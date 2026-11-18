#!/usr/bin/env python3
"""summ.py opt_XX.json ... -- tables: rho_hat against random-phase rows, per stratum and projection."""
import sys, json, numpy as np
SN = ['sqfree', 'max exp 2', 'max exp >=3', 'all']
keys = ['t_triv', 't_al', 'f1mean', 'f1max', 'f2mean', 'f2max', '30', '100', '300', '1000', 'small', 'all', 'opt2_all']
def val(c, key):
    return c[key] if key in c else c['opt'][key]
for f in sys.argv[1:]:
    d = json.load(open(f)); m = d['meta']
    print(f"\n=== k={d['k']} Q={d['Q']:.0f} R={d['R']:.0f} windows {m['nw0']}+{m['nw1']} free {m['nfree0']} F1 {m['f1_targets']} F2 {m['f2_targets']} valid {m.get('valid0')}")
    print("row counts per stratum", m['row_cnt'], "norm2 (sum over 12 classes)", [round(float(np.sum(x)), 3) for x in m['row_norm2']])
    for proj in ('loo', 'band'):
        print(f"-- {proj}:  statistic: rho_hat mean over 12 classes | random rows mean over 24 +- sd of one column | z of rho mean")
        for s in range(4):
            line = f"{SN[s]:12s}"
            for key in keys:
                a = np.array([val(c, key) for c in d['cols'] if c['s'] == s and c['proj'] == proj and c['v'] == 0])
                b = np.array([val(c, key) for c in d['cols'] if c['s'] == s and c['proj'] == proj and c['v'] > 0])
                z = (a.mean() - b.mean()) / (b.std(ddof=1) * np.sqrt(1 / len(a) + 1 / len(b)))
                line += f" | {key}: {a.mean():.4g} / {b.mean():.4g}+-{b.std(ddof=1):.3g} z={z:+.1f}"
            print(line)
    # polar share
    for s in range(4):
        sh = []
        for v in (0, 1, 2):
            El = sum(c['E'] for c in d['cols'] if c['s'] == s and c['proj'] == 'loo' and c['v'] == v)
            Eb = sum(c['E'] for c in d['cols'] if c['s'] == s and c['proj'] == 'band' and c['v'] == v)
            sh.append(1 - Eb / El)
        print(f"polar share {SN[s]:12s}: rho {sh[0]:.4f}  rnd {sh[1]:.4f} {sh[2]:.4f}  excess {sh[0]-(sh[1]+sh[2])/2:.4f}")
