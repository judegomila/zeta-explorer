"""Check of `ffx sc` (exact Moebius sums S_cop(k)) against the S_cop values stored in the c7 block files."""
import json, subprocess, os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
TG = {'mu': (4, 0, 0, 0), 'a': (0, 3, 2, 3), 'b': (0, 3, 8, 3), 'n1': (2, 21, 0, 0), 'n2': (2, 22, 0, 0), 'dh': (3, 3, 2, 8), 't': (0, 0, 0, 0)}
tot = bad = 0
for q, d in ((7, 3), (7, 4), (7, 5), (13, 3)):
    S = {}
    for line in open(os.path.join(HERE, '..', 'c7-ff-order2-vertex-exact', f'blocks_q{q}_d{d}.jsonl')):
        r = json.loads(line)
        if 'S_cop' in r and r['target'] in TG and r['k'] <= d and r['N'] <= 6 and r['lam'] <= 6 and (q == 7 or r['target'] not in ('b', 'dh')):
            S.setdefault((r['target'], r['N'], r['lam']), {})[r['k']] = int(r['S_cop'])
    for (tg, N, lam), dd in sorted(S.items()):
        t = TG[tg]
        out = subprocess.run([os.path.join(HERE, 'ffx'), 'sc', str(q), str(d), str(N), str(lam)] + [str(x) for x in t] + ['0'], capture_output=True, text=True).stdout
        v = [int(x) for x in out.split('|')[1].split()]
        for k, s in dd.items():
            tot += 1
            if v[k] != s: bad += 1; print('MISMATCH', q, d, tg, N, lam, k, v[k], s)
print(f'S_cop values compared {tot}, mismatches {bad}')
