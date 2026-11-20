import json, re, collections
R = open('RESULT_template.md').read()
tab = open('results/tables.md').read()
ex = []
for ln in open('results/exactAll.jsonl'):
    try: ex.append(json.loads(ln))
    except Exception: pass
import glob
for ln in open('results/exactR.jsonl'):
    d = json.loads(ln)
    if d['result'].get('verdict') == 'FAIL':
        ex = [e for e in ex if not (e['task']['kind'] == 'win' and e['task']['scheme'] == 'afe' and e['task']['inp'] == 'zeta' and e['task']['size'] == d['task']['size'] and not e['task'].get('phi') and abs(e['task']['T1'] - d['task']['T1']) < 1e-6)] + [d]
        break
zm = sorted((d['task']['size'], d['result']['verdict']) for d in ex if d['task']['kind'] == 'win' and d['task']['scheme'] == 'afe' and d['task']['inp'] == 'zeta' and not d['task'].get('phi') and abs(d['task']['T2'] - d['task']['T1'] - 50) > 1e-6)
nf = sum(1 for x in zm if x[1] == 'FAIL')
ZM = f"{nf} of the {len(zm)} sizes N = {zm[0][0]}..{zm[-1][0]} run (C)"
thz = sorted(d['task']['T2'] for d in ex if d['task']['kind'] == 'winpt' and d['task']['inp'] == 'zeta' and d['task']['size'] == 10 and not d['task'].get('phi') and d['result'].get('verdict', '').startswith('PASS'))
TH = '%.0f' % thz[-1] if thz else '?'
trn = sorted({d['task']['size'] for d in ex if d['task']['kind'] == 'win' and d['task']['scheme'] == 'afe' and (d['task'].get('tag') or '').startswith('rand')})
table = open('table.part').read().replace('@@ZM@@', ZM).replace('@@TH@@', TH).replace('@@TRN@@', str(trn[-1]))
for key, f in (('@@VERDICT@@', 'verdict.part'), ('@@THEORY@@', 'theory.part'), ('@@CONTROLS@@', 'controls.part'), ('@@RAN@@', 'ran.part'), ('@@WEAK@@', 'weak.part')):
    R = R.replace(key, open(f).read().strip())
R = R.replace('@@TABLE@@', table.strip()).replace('@@DATA@@', tab.strip())
open('RESULT.md', 'w').write(R)
print(len(R), ZM, TH, trn[-1])
