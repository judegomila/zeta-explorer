"""c16 control checks (PREREG section 6): Lemma J1-Q / J1-L as exact ties in balls on the HEAT pairs without polar
terms; every control kernel has a ball value excluding 0.  usage: cchk.py <outjson>"""
import json
import sys
import numpy as np
from flint import arb, acb, ctx
import jball
import jobj
import jk
import kern
import nball
import nobj

P = nobj.build({}, skip=(1, 5, 6, 7, 8, 9))
Z = [p for p in P if p.group == 'P'][0].A
heat = [p for p in P if p.group in ('C4', 'H4')]
r = np.random.Generator(np.random.PCG64(160002))
U = r.uniform(-1.5, 1.5, 20)
H = r.uniform(0.05, 0.4, 20)
ctx.prec = 256
res = dict(nodes=[(float(a), float(b)) for a, b in zip(U, H)], ties={}, contrast={}, nonzero={})


def stat(name, d, scale, store):
    """d: difference ball, scale: ball of the compared value"""
    d = acb(d)
    s = store.setdefault(name, dict(n=0, contains0=0, max_rad=0.0, max_rel_rad=0.0, max_abs_mid=0.0))
    s['n'] += 1
    s['contains0'] += int(d.contains(0))
    rad = float(max(d.real.rad(), d.imag.rad()))
    sc = max(1.0, float(abs(acb(scale)).upper()))
    s['max_rad'] = max(s['max_rad'], rad)
    s['max_rel_rad'] = max(s['max_rel_rad'], rad / sc)
    s['max_abs_mid'] = max(s['max_abs_mid'], float(abs(acb(d.real.mid(), d.imag.mid())).upper()))


for p in heat:
    chi = p.B.b            # jk.W of the character
    tau = p.B.tau
    pos = jobj.Pair('P', Z, chi)
    for u, h in zip(U, H):
        ub, hb = arb(float(u)), arb(float(h))
        nball._CACHE.clear()
        a = nball.bvalue('a1-without', u, h, p)[0]
        b = nball.bvalue('a1-without', u, h, pos)[0]
        stat('J1-Q: a1-without, HEAT pair minus (zeta, chi)', a - b, b, res['ties'])
        a = nball.bvalue('b2-without', u, h, p)[0]
        b = nball.bvalue('b2-without', u, h, pos)[0]
        stat('J1-L: L3_A without, HEAT minus zeta', a - b, b, res['ties'])
        a = nball._piece('d3', p.B, True, ub, hb)
        b = nball._piece('d3', pos.B, True, ub, hb)
        stat('J1-L: L3_B, HEAT twist minus chi', a - b, b, res['ties'])
        a = nball.bvalue('b1-Ao', u, h, p)[0]
        b = nball.bvalue('b1-Ao', u, h, pos)[0]
        stat('J1-L: L2_A without, HEAT minus zeta minus tau h^2/2', a - b - arb(tau) * hb * hb / 2, b, res['ties'])
        a = nball._piece('d2', p.B, True, ub, hb)
        b = nball._piece('d2', pos.B, True, ub, hb)
        stat('J1-L: L2_B, HEAT twist minus chi minus tau h^2/2', a - b - arb(tau) * hb * hb / 2, b, res['ties'])
        # contrast: the with-polar reads are not ties
        a = nball.bvalue('a1-with', u, h, p)[0]
        b = nball.bvalue('a1-with', u, h, pos)[0]
        stat('a1-with, HEAT pair minus (zeta, chi)', a - b, b, res['contrast'])
        a = nball.bvalue('b2-with', u, h, p)[0]
        b = nball.bvalue('b2-with', u, h, pos)[0]
        stat('b2-with, HEAT minus zeta', a - b, b, res['contrast'])
    print('heat pair', p.name, 'done', flush=True)

bad = []
n = 0
for p in P:
    if p.group[0] in 'CH' and p.group != 'PH':
        for side, k, pols in (('A', p.A, (True, False)), ('B', p.B, (True,))):
            for pol in pols:
                ok = False
                for u in (0.3, 0.7, 1.1):
                    v = acb(jball.bk(k).val(arb(u), pol))
                    if not v.contains(0):
                        ok = True
                        break
                n += 1
                if not ok:
                    bad.append((p.name, side, pol))
res['nonzero'] = dict(kernel_reads=n, zero_not_excluded=bad)
for k, v in res['ties'].items():
    print('TIE', k, v)
for k, v in res['contrast'].items():
    print('CONTRAST', k, v)
print('NONZERO', res['nonzero'])
json.dump(res, open(sys.argv[1], 'w'), indent=1)
print('CCHK-DONE')
