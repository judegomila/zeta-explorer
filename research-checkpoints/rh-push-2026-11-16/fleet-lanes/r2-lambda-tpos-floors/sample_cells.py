# Extract 50 substeps spread along the archived F2 run (math data only): t, q, rate, mode (h, r, lambda, ell, cap).
import gzip, json
from fractions import Fraction as F
DUMP = '/Users/USER/Documents/GitHub/mathexplorer/tmp/qrh-tune-out/F2_final.steps.jsonl.gz'
KER = json.load(open('/Users/USER/Documents/GitHub/mathexplorer/tmp/oai-lambda-out/KERNELS_raymond_backup.json'))['rows']
K = 59439; want = set(round(i*(K-1)/49) for i in range(50)); out = []; allr = []
with gzip.open(DUMP, 'rt') as f:
    for k, line in enumerate(f):
        d = json.loads(line)
        if d['lab'][0] == 'M':
            m = d['multi']; ch = m['choice'][0]; rec = dict(h=m['h'], ell=m['ell'], lam=m['lam'], cap=m['cap'], r=ch['r'], rho=ch.get('rho'), src='M:' + m['mid'])
        else:
            o = d['opt']; kr = KER[o['ki']] if o['kind'] == 'cat' else None
            rec = dict(h=o['h'], ell=o['ell'], cap=o['cap'], lam=kr['lambda'] if kr else None, r=kr['r'] if kr else None, rho=kr.get('rho') if kr else None, src='B:' + o['kind'] + ':' + str(d.get('set')))
            if kr is None: rec['opt'] = {a: b for a, b in o.items() if a not in ('rate',)}
        q = F(d['q']); c = F(d['rate'])
        allr.append((float(q), float(c)))
        if k in want:
            rec.update(k=k, t=k/512000, cell=k//128, q=float(q), rate=float(c))
            for a in ('h', 'ell', 'lam', 'cap', 'r', 'rho'):
                if rec.get(a) is not None: rec[a] = float(F(rec[a]))
            out.append(rec)
json.dump(out, open('cells50.json', 'w'), indent=0)
json.dump(allr, open('f2_path.json', 'w'))
for r in out[:3] + out[-3:]: print(r)
import collections; print(collections.Counter((r['r'], r['src'][:1]) for r in out))
