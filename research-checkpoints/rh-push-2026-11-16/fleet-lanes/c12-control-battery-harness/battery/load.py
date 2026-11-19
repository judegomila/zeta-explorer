"""Consumer interface of the control battery (read-only). See README.md.
    import load
    B = load.Battery('/path/to/tables')
    B.codes()                       list of object codes
    B.obj('DH').value(acb(...))     direct evaluation (closed-form objects; core.py)
    B.values('DH')                  dict: sigmas, t, F (complex128 view), ball(j, k) -> acb with radius (30 digits)
    B.zeros('DH')                   dict from zeros_<code>.json
    B.coef('U-07')                  numpy array a[0..1e7] (memory-mapped; index = n)
    B.local()                       primes, U parameters, SGN parameters, sets
"""
import os, json
import numpy as np
import core

CLOSED = ['ZETA', 'DH', 'EA-1/8', 'EA-1/4', 'EA-1/2', 'TNR', 'WT', 'WT-CONJ', 'SGN-LIOU']
STAGE = ['THIN-0.9', 'DEL-0.75', 'DEL-0.9']
HEAT = ['HEAT--0.1', 'HEAT--0.5']


def _fn(code): return code.replace('/', '_')


class Battery:
    def __init__(self, tables): self.t = tables
    def codes(self):
        return CLOSED + STAGE + HEAT + ['BEU'] + ['U-%02d' % j for j in range(24)] + ['SGN-%02d' % j for j in range(24)]
    def obj(self, code): return core.by_code(code)
    def values(self, code):
        from flint import acb, arb
        if code.startswith('U-') or (code.startswith('SGN-') and code != 'SGN-LIOU'):
            d = np.load(os.path.join(self.t, 'values_%s.npz' % code.split('-')[0])); j = int(code.split('-')[1])
            out = dict(sigmas=d['sigmas'], t=d['t'], F=d['pos'][j], tail_log_radius=d['tail_log_radius'], meta=json.loads(str(d['meta'])))
            out['F_neg'] = d['neg'][j] if 'neg' in d else np.conj(d['pos'][j])
            return out
        if code == 'BEU':
            d = np.load(os.path.join(self.t, 'values_BEU.npz')); z = self.values('ZETA')
            return dict(sigmas=d['sigmas'], t=d['t'], F=z['F'] * d['H'], H=d['H'], tail_log_radius=d['tail_log_radius'], meta=json.loads(str(d['meta'])))
        d = np.load(os.path.join(self.t, 'values_%s.npz' % _fn(code)))
        out = dict(sigmas=d['sigmas'], t=d['t'], meta=json.loads(str(d['meta'])))
        if code in HEAT:
            out['mantissa'] = d['re_hi'] + 1j * d['im_hi']; out['exp10'] = d['exp10']; out['rel_accuracy_bits'] = d['rel_accuracy_bits']
            def ball(j, k):
                return acb(core.dd_join(d['re_hi'][j, k], d['re_lo'][j, k]), core.dd_join(d['im_hi'][j, k], d['im_lo'][j, k])) * arb(10) ** int(d['exp10'][j, k])
        else:
            out['F'] = d['re_hi'] + 1j * d['im_hi']; out['rad'] = d['rad']
            def ball(j, k):
                r = float(d['rad'][j, k])
                return acb(core.dd_join(d['re_hi'][j, k], d['re_lo'][j, k]) + arb(0, r + 1e-31 * abs(d['re_hi'][j, k])), core.dd_join(d['im_hi'][j, k], d['im_lo'][j, k]) + arb(0, r + 1e-31 * abs(d['im_hi'][j, k])))
        out['ball'] = ball
        return out
    def zeros(self, code):
        if code.startswith('U-') or (code.startswith('SGN-') and code != 'SGN-LIOU'): code = 'U_SGN'
        return json.load(open(os.path.join(self.t, 'zeros_%s.json' % _fn(code))))
    def coef(self, code): return np.load(os.path.join(self.t, 'coef_%s.npy' % _fn(code)), mmap_mode='r')
    def local(self):
        g = lambda f: np.load(os.path.join(self.t, f), mmap_mode='r')
        return dict(primes=g('local_primes.npy'), U=g('local_U.npy'), SGN=g('local_SGN.npy'), sets={c: g('set_%s.npy' % c) for c in STAGE}, beu_integers=g('beu_integers.npy'))
