"""Tables for RESULT.md from out1, out2, arb files (analysis only)."""
import json, glob, os, math, numpy as np
print('== statistic 2')
IK = 4 * 1.5 * 151 * math.pi / 315      # int |K|^2
for f in sorted(glob.glob('out2/*.json')):
    R = json.load(open(f)); n = R['name']; V = R['V'][-1]; mv = R['M'][-1] / V
    if n.startswith(('D1', 'INJ', 'ETA')): diag = IK * (0.5 + 7.0 / 3) * V ** 2
    elif n.startswith('D2'): diag = IK * (2.0 / 3 + 7.5) * V ** 3
    else: diag = None
    le = [math.log(R['M'][i + 1] / R['M'][i]) / math.log(2) if R['M'][i] > 1e-200 and R['M'][i + 1] > 1e-200 else None for i in range(len(R['M']) - 1)]
    print(n, 'V=2^%d..2^%d' % (round(math.log2(R['V'][0])), round(math.log2(V))), 'e=', None if R['e'] is None else round(R['e'], 4), 'pass2', R['pass2'],
          'M/V last %.4g' % mv, 'ratio to diagonal %.4f' % (mv / diag) if diag else '', 'local e last3', [None if v is None else round(v, 3) for v in le[-3:]], 'spikes', R['nspikes'][-1])
print('== statistic 1')
for f in sorted(glob.glob('out1/*.json')):
    S = json.load(open(f)); z = np.load(f[:-5] + '.npz'); y = z['y']; cls = z['cls']; g = cls == 1
    print(S['name'], 'j', S['js'], 'n', S['n'], 'count', S.get('count'), 'frac_int %.4f' % S['frac_int'], 'pass1', S['pass1'],
          'beta sd %.4g min %.4g max %.4g' % (S['beta_sd'], S['beta_min'], S['beta_max']),
          'generic: beta sd %.4g, y sd by j %s' % (S['generic']['beta_sd'], ' '.join('%.3g' % v for v in y[g].std(axis=0))),
          'y range last [%.4g, %.4g]' % (S['y_last_min'], S['y_last_max']))
