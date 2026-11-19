"""D1 of c12-control-battery-harness (devices/d1_debranges.py) rerun against a record file in the format of screen.json.
The 20 registered checks, their order, tolerances and the battery inputs (tables/zeros_ZETA.json, tables/zeros_DH.json,
battery/core.py) are those of d1_debranges.py; the only change is that the recorded numbers are read from the record file
instead of being typed into the script. Not counted in the threshold: the comparison of all 24 minima (4 windows x 6 shifts).
Usage: python d1_corrected.py <battery lane dir> <record.json> <out.json>"""
import sys, os, json
lane, recf, outf = sys.argv[1:4]
sys.path.insert(0, os.path.join(lane, 'battery'))
from flint import acb, arb, ctx
import core
tables = os.path.join(lane, 'tables')
ctx.prec = 200
Z = core.Zeta(); D = core.DH()
zz = json.load(open(os.path.join(tables, 'zeros_ZETA.json')))['gamma']
dz = json.load(open(os.path.join(tables, 'zeros_DH.json')))['online']
H = ['0.1', '0.25', '0.5', '1', '2', '4']; RK = ['0.1', '0.25', '0.5', '1.0', '2.0', '4.0']
def q(obj, gamma, h, normalise=True):
    rho = acb(arb(1) / 2, arb(gamma))
    _, d = core.deriv_completed(obj, rho)
    v = obj.completed(rho + arb(h))
    val = -(d * v).real
    return val / (abs(d) * abs(v)) if normalise else val
def window(obj, gammas):
    fails = {h: 0 for h in H}; mn = {h: None for h in H}; undecided = 0; first = {h: None for h in H}
    for i, g in enumerate(gammas):
        for h in H:
            v = q(obj, g, h)
            if v < 0:
                fails[h] += 1
                if first[h] is None: first[h] = i + 1
            elif not (v > 0): undecided += 1
            f = float(v.mid())
            mn[h] = f if mn[h] is None else min(mn[h], f)
    return dict(N=len(gammas), fails=fails, min_q=mn, first_failing_index=first, undecided_signs=undecided)
R = json.load(open(recf))
def clnum(s):
    s = s.strip()
    if s.startswith('['): s = s[1:].split('+/-')[0]
    return float(s)
rw = {'zeta_1_100': R['zeta']['n1-100'], 'zeta_620_680': R['zeta']['n620-680(t~1000)'], 'DH_t1_200': R['DH']['t0-200'], 'DH_t1000_1020': R['DH']['t1000-1020']}
rec = dict(CL=clnum(R['CL_3.2']))
for k, w in rw.items():
    rec[k] = dict(N=w.get('N', w.get('N_online')), fails=[w['fails'][x] for x in RK], min1=w['min_q']['1.0'], min05=w['min_q']['0.5'], min_all=[w['min_q'][x] for x in RK])
out = dict(record=recf)
cl = q(Z, zz[33], '1', normalise=False)
out['CL_3.2'] = cl.str(25); out['CL_3.2_mid'] = cl.mid().str(25, radius=False)
out['zeta_1_100'] = window(Z, zz[0:100])
out['zeta_620_680'] = window(Z, zz[619:680])
out['DH_t1_200'] = window(D, [g for g in dz if 1 < float(g) < 200])
out['DH_t1000_1020'] = window(D, [g for g in dz if 1000 < float(g) < 1020])
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
assert len(checks) == 20
out['checks'] = checks; out['numbers_ok'] = sum(c['ok'] for c in checks); out['numbers_total'] = len(checks); out['reproduced'] = all(c['ok'] for c in checks)
out['verdict'] = 'zeta fails (N2) at zero 34, h = 1; DH fails at the same step on its on-line zeros' if out['reproduced'] else 'MISMATCH'
ext = []
for k in rw:
    for h, x in zip(H, rec[k]['min_all']):
        ext.append(dict(window=k, h=h, got=out[k]['min_q'][h], recorded=x, ok=abs(out[k]['min_q'][h] - x) < 1e-9))
out['extension_all_minima'] = ext; out['extension_ok'] = sum(e['ok'] for e in ext); out['extension_total'] = len(ext)
json.dump(out, open(outf, 'w'), indent=1)
for c in checks: print(('ok   ' if c['ok'] else 'FAIL ') + c['check'], '| got', c['got'], '| recorded', c['recorded'])
print('D1 registered numbers: %d of %d; reproduced: %s' % (out['numbers_ok'], len(checks), out['reproduced']))
print('extension (not registered), minima within 1e-9: %d of %d; differing:' % (out['extension_ok'], len(ext)), [(e['window'], e['h'], e['got'], e['recorded']) for e in ext if not e['ok']])
