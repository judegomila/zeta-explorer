import math, json
import gpuline as g
for obj in ['CHI4', 'DH']:
    for (a, b) in [(100.0, 3000.0), (20000.0, 23000.0)]:
        r = g.scan(obj, a, b, 0.025, 'out/t_%s_small' % obj, block=20000)
        print('##', obj, a, b, 'zeros', r['stat']['zeros'], 'theta diff/pi', (r['theta_T1'] - r['theta_T0']) / math.pi, 'pairs', r['stat']['pairs'],
              'half', r['half_gram']['fraction'], 'gram', r['gram']['fraction'], 'lagneg', r['stat']['lag_neg'], 'wneg', r['stat']['w_neg'])
