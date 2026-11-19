"""precheck: reproduce round-8 records (exact integers) for one block with the new code path."""
import sys, json
from dual5 import *
q, k, N, lam, d = 7, 5, 3, 2, 5
nw = int(os.environ.get('RH_WORKERS', 1))
names = ['a', 'b', 'mu', 'lnu', 'n1', 'n2', 'rm', 'rma', 'thin', 'dh', 't', 'n:1', 'rm:1']
ff = FF(q, max(k, N + lam)); pairs = Pairs(ff)
rows, diag, nfreq = run_block(ff, pairs, k, N, lam, d, names, nw)
ref = {}
for fn in ['dual_q7.jsonl', 'dual_q7_d5.jsonl', 'dual_q7_d6.jsonl', 'dual_q7_d7.jsonl']:
    for l in open('../c8-eh-nonprincipal-row-cancellation/' + fn):
        b = json.loads(l)
        if (b['k'], b['N'], b['lam'], b['d']) == (k, N, lam, d): ref[b['w']] = b
ok = 0
for i, nm in enumerate(names):
    st = stats_from(q, rows, diag[i], i, k, N + lam, d)
    if nm in ref:
        b = ref[nm]; same = all(st[x] == b[x] for x in ('U', 'NP2', 'S2', 'princ2', 'diag', 'tot2', 'J2')) and nfreq == b['nfreq']
        ok += same
        print(nm, 'identical to round 8:', same, 'U', st['U'], 'NP2', st['NP2'], 'J2', st['J2'], 'refJ2', b['refJ2'])
    else: print(nm, 'new weight', st['U'], st['NP2'])
print('identical', ok, 'of', sum(1 for nm in names if nm in ref))
