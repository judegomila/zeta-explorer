import sys, os, numpy as np
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ['RH_BACKEND'] = 'cpu'
import zf, json
for nm in ('DH', 'HEAT--0.1', 'HEAT--0.5', 'TNR'):
    on, off = zf.table(nm); g = sorted(g for b, g in off); b = [b for b, g in off]
    print(nm, 'online', len(on), 'pairs', len(off), 'first off-line ordinates', [round(v, 3) for v in g[:3]], 'b range %.4f..%.4f median %.4f' % (min(b), max(b), float(np.median(b))))
