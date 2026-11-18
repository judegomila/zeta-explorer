import sys, json
from rslib import *
out = []
for T0, H in ((10000, 2000), (100000, 2000), (1000000, 2000)):
    out.append(run_window('zeta', T0, H))
json.dump(out, open('pilot_zeta.json', 'w'))
for o in out:
    print(o['T0'], 'right zeros', o['count_right'], 'newton', o['newton_right'], 'density', o['right_density'], 'model', o['model_right_density'],
          'fracDneg', o['frac_D_neg'], 'model', o['model_frac_neg'], 'Zdens', o['zeros_of_Z_density'])
