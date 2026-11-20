# re-certify the argmin points of adv_diag.json: diagonal K_0(lam,lam) as a ball at 1024 bits, and the 3-point Gram at lam and two neighbours.
import json
from flint import acb, arb, ctx
import k2, search
res = json.load(open('adv_diag.json'))
cf = {c['name']: c for c in search.configs()}
out = []; nneg = 0; npos = 0; nund = 0
for r in res:
    if r['argmin'] is None: continue
    p = r['argmin']; cfg = cf[r['cfg']]
    ctx.prec = 1024
    M = k2.make_M(k2.M_zeta, cfg['zeros'])
    lam = (acb(p[0], p[1]), acb(p[2], p[3]))
    o = k2.orbit(lam, M, (0, 0))
    d = k2.Kentry(o, o).real
    tot = sum(abs(c*c2.conjugate()/((a+a2.conjugate())*(b+b2.conjugate()))) for (a, b, c) in o for (a2, b2, c2) in o)
    sign = 'pos' if d > 0 else ('neg' if d < 0 else 'undecided')
    npos += sign == 'pos'; nneg += sign == 'neg'; nund += sign == 'undecided'
    out.append(dict(cfg=r['cfg'], point=p, q_160bit=r['min_q'], sign_1024bit=sign, q_1024bit=float((d/tot).mid())))
out.sort(key=lambda x: x['q_1024bit'])
print('argmin points', len(out), 'certified positive', npos, 'negative', nneg, 'undecided', nund)
for x in out[:6]: print(x['cfg'], ['%.6g' % v for v in x['point']], 'q(160) %.2e' % x['q_160bit'], 'q(1024) %.3e' % x['q_1024bit'], x['sign_1024bit'])
json.dump(out, open('adv_recheck.json', 'w'), indent=0)
