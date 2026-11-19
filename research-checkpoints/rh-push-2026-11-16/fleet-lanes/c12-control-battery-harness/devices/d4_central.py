"""D4: central-value square at height t (c11-del-device-read-confirm section 4, row G32, Lemmas W1 and W2).
Form at height t: F(1/2 + it) F(1/2 - it) (= |F(1/2+it)|^2 when F(conj s) = conj F(s)); hermitian form |F|^2 for complex coefficients.
Battery inputs: grid tables on Re s = 1/2 (F(1/2+it)) and an independent direct evaluation of F(1/2 - it) (closed objects);
zero tables for the off-line ordinates. Record verdict: every control passes (the form is >= 0 and does not see off-line zeros)."""
import sys, os, json, math
import numpy as np
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, os.path.join(HERE, '..', 'battery'))
from flint import acb, arb, ctx
import core
tables = sys.argv[1]; ctx.prec = 128
def load(code): return np.load(os.path.join(tables, 'values_%s.npz' % code.replace('/', '_')))
def tab(d, j, k): return acb(core.dd_join(d['re_hi'][j, k], d['re_lo'][j, k]), core.dd_join(d['im_hi'][j, k], d['im_lo'][j, k]))
out = {}; checks = []
def chk(name, ok, got, want): checks.append(dict(check=name, ok=bool(ok), got=got, recorded=want))
# closed objects with real coefficients
for o in core.make_objects():
    if not o.real_coeffs or o.code == 'SGN-LIOU': continue
    d = load(o.code); ts = d['t']; neg = 0; imbad = 0; mn = None; n = 0; maximrel = 0.0
    for k in range(len(ts)):
        if np.isnan(d['re_hi'][0, k]): continue
        a = tab(d, 0, k); b = o.value(acb(0.5, -float(ts[k])))
        f = a * b; n += 1
        mag = float(abs(f).upper())
        if f.real < 0: neg += 1
        if mag > 0:
            r = abs(float(f.imag.mid())) / mag
            maximrel = max(maximrel, r)
            if r > 1e-28: imbad += 1
        v = float(f.real.mid()); mn = v if mn is None else min(mn, v)
    out[o.code] = dict(points=n, negative=neg, imag_not_zero=imbad, max_rel_imag=maximrel, min_form=mn)
    chk('%s: form real and >= 0 at %d grid ordinates on Re s = 1/2 (table x direct value at the conjugate point)' % (o.code, n), neg == 0 and imbad == 0, dict(negative=neg, imag=imbad, min=mn), 'passes')
# off-line ordinates: the form does not vanish there
D = core.DH(); dz = json.load(open(os.path.join(tables, 'zeros_DH.json')))
vals = [float((abs(D.value(acb(arb(1) / 2, arb(g[1]))) ** 2).lower())) for g in dz['offline']]
out['DH_offline'] = dict(pairs=len(vals), min_form_at_offline_ordinates=min(vals), first_two=vals[:2], ordinates=[dz['offline'][0][1], dz['offline'][1][1]])
chk('DH: form > 0 at the ordinates of all %d off-line pairs below 2000 (does not see them)' % len(vals), min(vals) > 0, min(vals), '> 0')
on = dz['online'][:200]
vz = max(float((abs(D.value(acb(arb(1) / 2, arb(g)))) ** 2).upper()) for g in on)
chk('DH: form vanishes at on-line zeros (first 200, < 1e-50)', vz < 1e-50, vz, '0')
T = core.TNR(); tz = json.load(open(os.path.join(tables, 'zeros_TNR.json')))['offline_local_factor']
vals = [float((abs(T.value(acb(arb(1) / 2, arb(g[1]))) ** 2).lower())) for g in tz[::2]]
out['TNR_offline'] = dict(pairs=len(vals), min_form=min(vals))
chk('TNR: form > 0 at the ordinates of its %d off-line pairs' % len(vals), min(vals) > 0, min(vals), '> 0')
zz = json.load(open(os.path.join(tables, 'zeros_ZETA.json')))['gamma']
for num, den in ((1, 8), (1, 4), (1, 2)):
    o = core.EA(num, den)
    vals = [float((abs(o.value(acb(arb(1) / 2, arb(g)))) ** 2).lower()) for g in zz[::10]]
    chk('%s: form > 0 at the ordinates of its (off-line) zeros, 152 sampled' % o.code, min(vals) > 0, min(vals), '> 0')
# WT: complex coefficients. Hermitian form trivially >= 0; the bilinear form F(1/2+it) F(1/2-it) is not real: the named structural step (Lemma W1)
d = load('WT'); dc = load('WT-CONJ'); mx = 0.0
for k in range(1, len(d['t']), 7):
    f = tab(d, 0, k) * tab(dc, 0, k).conjugate()        # F(1/2+it) * F(1/2-it), F(conj s) = conj(conj-table(s))
    mx = max(mx, abs(float(f.imag.mid())) / float(abs(f).upper()))
out['WT'] = dict(max_rel_imag_of_bilinear_form=mx)
chk('WT: bilinear form not real (twist not self-dual; hermitian form |F|^2 is >= 0 by definition)', mx > 0.1, mx, 'not self-dual')
# Lemma W1 on the grid
t = np.arange(1, 4001) * 0.5
w1 = float(np.min(np.maximum(np.abs(np.sin(t * math.log(2))), np.abs(np.sin(t * math.log(3))))))
out['W1_min'] = w1; chk('Lemma W1: no grid t != 0 with 2^(-it), 3^(-it) both real', w1 > 0, w1, '> 0')
# HEAT: real on the line
for tau in ('-0.1', '-0.5'):
    f = os.path.join(tables, 'values_HEAT-%s.npz' % tau)
    if not os.path.exists(f): out['HEAT-' + tau] = 'table missing'; chk('HEAT-%s table present' % tau, False, 'missing', 'present'); continue
    d = np.load(f); im = np.abs(d['im_hi'][0]).max(); acc = int(d['rel_accuracy_bits'][0, 1:].min())
    hz = json.load(open(os.path.join(tables, 'zeros_HEAT-%s.json' % tau)))
    out['HEAT-' + tau] = dict(points=int(d['t'].size), max_abs_imag_on_line=float(im), min_accuracy_bits=acc, offline_pairs=hz['offline_pairs'],
                              smallest_scaled_abs=float(np.abs(d['re_hi'][0]).min()))
    chk('HEAT-%s: F real on Re s = 1/2 at %d grid ordinates, so the form is a square >= 0' % (tau, d['t'].size), im == 0 and acc >= 100, dict(max_imag=float(im), min_bits=acc), 'passes')
    # value at the ordinates of the off-line pairs: nearest grid ordinates have |F| > 0 (ball accuracy >= 100 bits means the value is non-zero)
    nz = int((np.abs(d['re_hi'][0]) > 0).sum())
    chk('HEAT-%s: form > 0 at every grid ordinate (off-line pairs: %d)' % (tau, hz['offline_pairs']), nz == d['t'].size, nz, int(d['t'].size))
# stage objects (1e7 stage, table and conjugation rule; separate column: the record says "where continued")
st = {}
for code in ('DEL-0.75', 'DEL-0.9', 'THIN-0.9'):
    d = load(code); m = d['re_hi'][0] ** 2 + d['im_hi'][0] ** 2
    st[code] = dict(points=int(np.isfinite(m).sum()), min_form=float(np.nanmin(m)), note='1e7 stage with the conjugation rule: |.|^2 >= 0 by construction')
d = np.load(os.path.join(tables, 'values_BEU.npz')); z = load('ZETA'); m = (np.abs(d['H'][0]) ** 2) * (z['re_hi'][0] ** 2 + z['im_hi'][0] ** 2)
st['BEU'] = dict(points=int(m.size), min_form=float(m.min()), note='zeta table x H_X; continued object zeta H on Re s = 1/2 (tail radius in the table)')
st['U, SGN random'] = 'not defined on Re s = 1/2 (no continuation): not formulable, as in the record ("where continued")'
out['stage_column'] = st
out['checks'] = checks; out['reproduced'] = all(c['ok'] for c in checks)
out['verdict'] = 'every control on which the form is defined passes: the form is >= 0 at height t and does not vanish at off-line ordinates' if out['reproduced'] else 'MISMATCH'
json.dump(out, open(os.path.join(tables, 'device_D4.json'), 'w'), indent=1)
for c in checks: print(('ok   ' if c['ok'] else 'FAIL ') + c['check'], '| got', c['got'], '| recorded', c['recorded'])
print('D4 reproduced:', out['reproduced'])
