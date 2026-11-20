"""R5: independent dense sampling of the envelope inequality (72) for all 67 rows (numpy float64).
Nodes/envelopes taken from the final plan / hybrid plan / envelope files (data), not from the checker's output."""
import sys, json, math, os
from fractions import Fraction as F
import numpy as np
I = sys.argv[1]
ld = lambda p: json.load(open(p if p.startswith(I) else p.replace('/workspace', I, 1)))
cp = ld(I + '/lambda_round13/flow/PHYSICAL_REFINEMENT_CERTIFICATE.json'); PHc = cp['inputs']
old = ld(PHc['old_plan']['path'])['blocks']; envdir = os.path.dirname(PHc['old_plan']['path'].replace('/workspace', I, 1)) + '/envelopes/'
fin = ld(I + '/lambda_round14/material/m8_late/M8_LATE_PLAN.json')['rows']
hyb = ld(I + '/attack/latest_lambda_reconstructed/workspace/continuation_20261022e/probe_optimisation/SHARED_HYBRID_PLAN.json')['rows']
lam = np.concatenate([np.linspace(math.log(4096), 40, 2_000_001), np.linspace(40, 400, 400_001)])
worst = (0, None); tightest = []
for i in range(67):
    nodes = [(float(F(n['height'])), float(F(n['shift'])), float(F(n['weight']))) for n in fin[i]['nodes']]
    if hyb[i]['mode'] == 'retained':
        sc = F(old[i]['scale']); env = list(zip([float(sc * F(h)) for h in ('2', '109/50', '5/2', '3', '4', '5', '6')], [float(F(x)) for x in json.load(open(envdir + '%03d.json' % i))['dual']]))
    else:
        env = [(float(F(e['height'])), float(F(e['weight']))) for e in hyb[i]['envelope']]
    h0 = min(h for h, c in env)
    Fv = sum(w * np.exp(-(h - h0) * lam / 2) * np.cos(a * lam / 2) for h, a, w in nodes)
    Ev = sum(c * np.exp(-(h - h0) * lam / 2) for h, c in env)
    ratio = np.abs(Fv) / Ev; j = int(ratio.argmax())
    tightest.append((float(ratio[j]), i, float(lam[j])))
    if ratio[j] > worst[0]: worst = (float(ratio[j]), i, float(lam[j]))
    assert min(c for h, c in env) >= 0 and min(h for h, a, w in nodes) >= h0
tightest.sort(reverse=True)
print('max over 67 rows and 2.4e6 sample points of |F_i(lambda)| / envelope:', worst)
print('five tightest rows (ratio,row,lambda):', tightest[:5])
