"""D1: de Branges shift positivity (c11-rs3-debranges-positivity-family, screen.json). Battery inputs: zero tables of ZETA and DH,
completed functions of core.py. q_h(rho) = -Re{X'(rho) X(rho+h)}/(|X'(rho)| |X(rho+h)|)."""
import sys, os, json
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, os.path.join(HERE, '..', 'battery'))
from flint import acb, arb, ctx
import core
tables = sys.argv[1]
ctx.prec = 200
Z = core.Zeta(); D = core.DH()
zz = json.load(open(os.path.join(tables, 'zeros_ZETA.json')))['gamma']
dz = json.load(open(os.path.join(tables, 'zeros_DH.json')))['online']
H = ['0.1', '0.25', '0.5', '1', '2', '4']
def q(obj, gamma, h, normalise=True):
    rho = acb(arb(1) / 2, arb(gamma))
    _, d = core.deriv_completed(obj, rho)
    v = obj.completed(rho + arb(h))
    val = -(d * v).real
    return val / (abs(d) * abs(v)) if normalise else val
def window(obj, gammas):
    fails = {h: 0 for h in H}; mn = {h: None for h in H}; undecided = 0; first = {h: None for h in H}; small = []
    for i, g in enumerate(gammas):
        for h in H:
            v = q(obj, g, h)
            if v < 0:
                fails[h] += 1
                if first[h] is None: first[h] = i + 1
                if h in ('0.1', '0.25', '0.5'): small.append([h, i + 1, str(g)[:22], float(v.mid())])
            elif not (v > 0): undecided += 1
            f = float(v.mid())
            mn[h] = f if mn[h] is None else min(mn[h], f)
    return dict(N=len(gammas), fails=fails, min_q=mn, first_failing_index=first, undecided_signs=undecided, failures_at_h_le_half=small)
out = {}
cl = q(Z, zz[33], '1', normalise=False)
out['CL_3.2'] = cl.str(25); out['CL_3.2_mid'] = cl.mid().str(25, radius=False)
out['zeta_1_100'] = window(Z, zz[0:100])
out['zeta_620_680'] = window(Z, zz[619:680])
out['DH_t1_200'] = window(D, [g for g in dz if 1 < float(g) < 200])
out['DH_t1000_1020'] = window(D, [g for g in dz if 1000 < float(g) < 1020])
# full battery height (new relative to the record): every zero below 2000
out['zeta_all_2000'] = window(Z, zz)
out['DH_all_2000'] = window(D, dz)
rec = dict(CL=-5.38910050718e-69,
           zeta_1_100=dict(N=100, fails=[0, 0, 0, 2, 50, 99], min05=0.531848072452459, min1=-0.17845535996405765),
           zeta_620_680=dict(N=61, fails=[0, 0, 0, 6, 33, 57], min1=-0.4774690487348363),
           DH_t1_200=dict(N=122, fails=[0, 0, 0, 2, 54, 122], min1=-0.18900481690394497),
           DH_t1000_1020=dict(N=17, fails=[0, 0, 0, 3, 10, 16], min1=-0.3348103021277858))
checks = []
def chk(name, ok, got, want): checks.append(dict(check=name, ok=bool(ok), got=got, recorded=want))
clf = float(cl.mid())
chk('CL (3.2) value, rel 1e-11', abs(clf / rec['CL'] - 1) < 1e-11, out['CL_3.2_mid'], rec['CL'])
chk('zeta fails at zero 34, h = 1 (sign certified by ball)', bool(cl < 0), out['CL_3.2'], '< 0')
chk('first failing zero of zeta at h = 1 is the 34th', out['zeta_1_100']['first_failing_index']['1'] == 34, out['zeta_1_100']['first_failing_index']['1'], 34)
for k in ('zeta_1_100', 'zeta_620_680', 'DH_t1_200', 'DH_t1000_1020'):
    r = rec[k]; o = out[k]
    chk(k + ' zero count', o['N'] == r['N'], o['N'], r['N'])
    chk(k + ' fail counts h = 0.1..4', [o['fails'][h] for h in H] == r['fails'], [o['fails'][h] for h in H], r['fails'])
    chk(k + ' min q_1, abs 1e-9', abs(o['min_q']['1'] - r['min1']) < 1e-9, o['min_q']['1'], r['min1'])
    chk(k + ' no undecided sign', o['undecided_signs'] == 0, o['undecided_signs'], 0)
chk('zeta_1_100 min q_0.5, abs 1e-9', abs(out['zeta_1_100']['min_q']['0.5'] - rec['zeta_1_100']['min05']) < 1e-9, out['zeta_1_100']['min_q']['0.5'], rec['zeta_1_100']['min05'])
out['checks'] = checks; out['reproduced'] = all(c['ok'] for c in checks)
out['verdict'] = 'zeta fails (N2) at zero 34, h = 1; DH fails at the same step on its on-line zeros' if out['reproduced'] else 'MISMATCH'
json.dump(out, open(os.path.join(tables, 'device_D1.json'), 'w'), indent=1)
for c in checks: print(('ok   ' if c['ok'] else 'FAIL ') + c['check'], '| got', c['got'], '| recorded', c['recorded'])
print('D1 reproduced:', out['reproduced'])
print('extension: zeta all zeros < 2000:', out['zeta_all_2000']['fails'], 'DH:', out['DH_all_2000']['fails'], out['DH_all_2000']['N'])
