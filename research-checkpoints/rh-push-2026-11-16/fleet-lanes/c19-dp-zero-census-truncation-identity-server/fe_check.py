# POST-HOC check (mpmath, 30 digits; MEASURED): at theta' = 1 the right zeros beta of D_P for zeta satisfy
# zeta(beta) = chi(beta) (1/2 + small): the n = 1 term of the reflected sum enters with the Fresnel weight 1/2
# because P = floor(t/2 pi) sits at the stationary point. Reads resBC_main.jsonl.
import json, sys, math
from mpmath import mp, mpf, mpc, zeta, loggamma, exp, log, pi
mp.dps = 30
T = float(sys.argv[1]); TH = float(sys.argv[2]); NMAX = int(sys.argv[3]) if len(sys.argv) > 3 else 40
W = int(sys.argv[4]) if len(sys.argv) > 4 else 0
import glob, itertools
def chi(s): return exp(loggamma((1 - s) / 2) - loggamma(s / 2) + (s - mpf(1) / 2) * log(pi))
res = []
for l in itertools.chain(*[open(f) for f in sorted(glob.glob('resBC_*.jsonl'))]):
    r = json.loads(l)
    if r['t'] == T and r['theta'] == TH and r['cls'] == 'zeta' and r['kind'] == 'real' and r['w'] == W:
        P = r['P']; Lg = math.log(T / (2 * math.pi))
        zs = r['zeros_right']; step = max(1, len(zs) // NMAX)
        for b, y in zs[::step]:
            s = mpc(0.5 + b, T + 200.0 * W + y)
            ratio = zeta(s) / chi(s)
            delta = (T + 200.0 * W + y) / (2 * math.pi) - P
            res.append({'b': b, 'y': y, 'ratio_re': float(ratio.real), 'ratio_im': float(ratio.imag), 'abs': float(abs(ratio)), 'delta_over_sqrt': delta / math.sqrt(T / (2 * math.pi)),
                        'b_pred': float(-(log(abs(zeta(s))) + math.log(2)) / Lg)})
import numpy as np
a = np.array([x['abs'] for x in res]); re = np.array([x['ratio_re'] for x in res]); im = np.array([x['ratio_im'] for x in res])
bp = np.array([x['b_pred'] for x in res]); b = np.array([x['b'] for x in res])
summ = {'t': T, 'theta': TH, 'w': W, 'delta_over_sqrt_range': [min(x['delta_over_sqrt'] for x in res), max(x['delta_over_sqrt'] for x in res)], 'n': len(res), 'ratio_re_mean': float(re.mean()), 'ratio_re_min': float(re.min()), 'ratio_re_max': float(re.max()), 'ratio_im_min': float(im.min()), 'ratio_im_max': float(im.max()),
        'abs_min': float(a.min()), 'abs_max': float(a.max()), 'max_abs_b_minus_pred': float(np.abs(b - bp).max()), 'sd_b': float(b.std())}
print(json.dumps(summ))
json.dump({'summary': summ, 'rows': res}, open('fe_check_%g_%g_w%d.json' % (T, TH, W), 'w'), indent=1)
