"""Screening driver. usage: server_run.py <jobset>; writes res_<label>.json per job and DONE_<jobset> at the end."""
import sys, json, os, time
from rslib import *
J = {
 'main': [dict(kind='zeta', T0=10**8, H=10000), dict(kind='dh', T0=10**8, H=10000), dict(kind='chi5', T0=10**8, H=10000),
          dict(kind='transl', T0=10**8, H=10000, alpha_mult=3), dict(kind='per3', T0=10**8, H=10000), dict(kind='rand', T0=10**8, H=10000),
          dict(kind='zeta', T0=10**10, H=10000), dict(kind='dh', T0=10**10, H=2000), dict(kind='chi5', T0=10**10, H=2000),
          dict(kind='zeta', T0=10**12, H=10000), dict(kind='dh', T0=10**12, H=500)],
 'var': [dict(kind='zeta', T0=10**8, H=10000, w_c=8.0, label='zeta-smooth8@1e8'), dict(kind='zeta', T0=10**8, H=10000, w_c=2.0, label='zeta-smooth2@1e8'),
         dict(kind='dh', T0=10**8, H=10000, w_c=8.0, label='dh-smooth8@1e8'), dict(kind='zeta', T0=10**10, H=2000, w_c=8.0, label='zeta-smooth8@1e10')] +
        [dict(kind='zeta', T0=10**8, H=2000, xmult=x, fixedN=True, label=f'zeta-x{x}@1e8', find=(x <= 128)) for x in (0.25, 0.5, 1.5, 2, 4, 16, 128, 1024)] +
        [dict(kind='zeta', T0=10**8, H=300, xmult=3989.4228, fixedN=True, label='zeta-xt2pi@1e8', find=False)],
 'test': [dict(kind='zeta', T0=10**6, H=300), dict(kind='dh', T0=10**6, H=300), dict(kind='chi5', T0=10**6, H=200), dict(kind='transl', T0=10**6, H=200, alpha_mult=3),
          dict(kind='per3', T0=10**6, H=200), dict(kind='zeta', T0=10**6, H=200, w_c=8.0, label='zeta-smooth8@1e6'), dict(kind='zeta', T0=10**6, H=200, xmult=4, fixedN=True, label='zeta-x4@1e6')],
}
js = sys.argv[1]
for job in J[js]:
    t0 = time.time(); r = run_window(**job); r['seconds'] = time.time() - t0
    lab = r['label'].replace('+', '')
    json.dump(r, open(f'res_{lab}.json', 'w'))
    print('JOB', lab, 'right', r['count_right'], 'newton', r.get('newton_right'), 'dens', round(r['right_density'], 4), 'model', round(r['model_right_density'], 4),
          'Zdens', round(r['zeros_of_Z_density'], 4), 'fracDneg', round(r['frac_D_neg'], 4), 'model', round(r['model_frac_neg'], 4), f"{r['seconds']:.0f}s", flush=True)
open(f'DONE_{js}', 'w').write('done')
