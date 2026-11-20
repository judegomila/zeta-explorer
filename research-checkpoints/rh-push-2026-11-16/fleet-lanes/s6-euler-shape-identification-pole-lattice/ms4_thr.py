"""Local (mpmath, 1200 bits, no enclosures): threshold in Y for the first negative pivot, order <= 120, design W1."""
import sys, json
sys.argv = ['x']
import importlib.util
spec = importlib.util.spec_from_file_location('ms4', __file__.replace('ms4_thr.py', 'ms4.py')); m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m)
out = []
for obj in ('zeta', 'T-NR', 'DH', 'chi_5'):
    phis = None
    for Y in ('1/2', '9/10', '95/100', '99/100', '999/1000', '1/1'):
        r, phis = m.gram_pivots(obj, 'W1', 120, Y, 1200, phis)
        out.append(r); print(obj, Y, 'first negative order', r['first_negative_order'], 'positive orders', r['orders_certified_positive'], 'min pivot', r['min_pivot'], flush=True)
json.dump(out, open(__file__.replace('ms4_thr.py', 'out/ms4_threshold_local.json'), 'w'), indent=1)
