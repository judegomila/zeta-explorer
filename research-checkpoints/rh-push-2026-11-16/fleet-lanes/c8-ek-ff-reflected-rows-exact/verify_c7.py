"""First-lemma check: the new 'en' kernel against the exact row norms stored in the c7 block files.
For every distinct (target, N, lam, d) in ../c7-ff-order2-vertex-exact/blocks_q{q}_d{d}.jsonl with cost q^(d+N+lam) <= LIMIT:
  nr2 (c7, exact integer) == q^(N+lam) * sumnorm (this lane);  and for d >= N+lam: row_excess_over_diag == sumnorm/diagsum - 1."""
import json, subprocess, sys, os
HERE = os.path.dirname(os.path.abspath(__file__))
TG = {'mu': (4, 0, 0, 0), 'a': (0, 3, 2, 3), 'b': (0, 3, 8, 3), 'r1': (1, 11, 0, 0), 'r2': (1, 12, 0, 0), 'n1': (2, 21, 0, 0), 'n2': (2, 22, 0, 0), 'dh': (3, 3, 2, 8), 't': (0, 0, 0, 0)}
q = int(sys.argv[1]); ds = [int(x) for x in sys.argv[2].split(',')]; LIMIT = float(sys.argv[3])
tot = bad = badx = nx = 0
for d in ds:
    seen = {}
    for line in open(os.path.join(HERE, '..', 'c7-ff-order2-vertex-exact', f'blocks_q{q}_d{d}.jsonl')):
        r = json.loads(line); key = (r['target'], r['N'], r['lam'])
        if key not in seen: seen[key] = r
    for (tg, N, lam), r in sorted(seen.items()):
        if tg not in TG or q ** (d + N + lam) > LIMIT or N > 6 or lam > 6: continue
        t = TG[tg]
        out = subprocess.run([os.path.join(HERE, 'ffx'), 'en', str(q), str(d), str(N), str(lam), str(t[0]), str(t[1]), str(t[2]), str(t[3]), '0'], capture_output=True, text=True).stdout
        f = [x.strip() for x in out.split('|')]
        sumnorm, diag = int(f[2]), int(f[3]); tot += 1
        ok = q ** (N + lam) * sumnorm == int(r['nr2'])
        if not ok: bad += 1; print('MISMATCH', tg, N, lam, d, q ** (N + lam) * sumnorm, r['nr2'])
        if 'row_excess_over_diag' in r and d >= N + lam and diag:
            nx += 1
            if abs(sumnorm / diag - 1 - r['row_excess_over_diag']) > 1e-9 * max(1, abs(r['row_excess_over_diag'])): badx += 1; print('EXCESS MISMATCH', tg, N, lam, d, sumnorm / diag - 1, r['row_excess_over_diag'])
print(f'q={q} d={ds}: row vectors compared {tot}, nr2 mismatches {bad}; excess compared {nx}, mismatches {badx}')
