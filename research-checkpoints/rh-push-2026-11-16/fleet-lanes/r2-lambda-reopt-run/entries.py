# Distinct floor entries (cell, r, h, ell, source) and kernel rows (r, lambda, rho) used by each dump, and those not used by F2.
import gzip, json, sys
T = '/Users/USER/Documents/GitHub/mathexplorer/tmp/'
CAT = json.load(open(T + 'oai-lambda-out/KERNELS_raymond_backup.json'))['rows']
def sets(p):
    fl = set(); kr = set(); pairs = set()
    with gzip.open(p, 'rt') as f:
        for k, line in enumerate(f):
            d = json.loads(line); i = k // 128
            if 'multi' in d:
                m = d['multi']; c = m['choice'][0]; src = m['mid'].rsplit(':', 1)[0] if m['mid'].startswith('X:') else 'multi'
                fl.add((i, c['r'], m['h'], m['ell'], src)); kr.add((c['r'], c['lam'], c['rho'])); pairs.add((src, i, m['h']))
            else:
                o = d['opt']; kk = CAT[o['ki']]
                fl.add((i, kk['r'], o['h'], o['ell'], 'cat:' + d['set'])); kr.add((kk['r'], kk['lambda'], kk['rho'])); pairs.add(('cat:' + d['set'], i, o['h']))
    return fl, kr, pairs
f2 = sets(T + 'qrh-tune-out/F2_final.steps.jsonl.gz')
print('F2: floor entries', len(f2[0]), 'kernel rows', len(f2[1]), '(source, cell, height) triples', len(f2[2]))
out = {}
for name in sys.argv[1:]:
    s = sets(f'dump-{name}.steps.jsonl.gz')
    nf = sorted(s[0] - f2[0]); nk = sorted(s[1] - f2[1]); np_ = sorted(s[2] - f2[2])
    out[name] = dict(floor_entries=len(s[0]), kernel_rows=len(s[1]), triples=len(s[2]), floor_entries_not_in_F2=nf, kernel_rows_not_in_F2=nk, triples_not_in_F2=np_)
    print(name, 'floor entries', len(s[0]), 'kernel rows', len(s[1]), 'triples', len(s[2]), '| not in F2: floors', len(nf), 'kernels', len(nk), 'triples', len(np_))
    for x in nf[:12]: print('   new floor', x)
    for x in nk[:12]: print('   new kernel', x)
json.dump(out, open('entries.json', 'w'), indent=1)
