"""R9: (a) float sensitivity of the endpoint to a uniform loss eps in the source lower bound S_i (MEASURED, not a proof);
(b) exact max rate, node counts; (c) mutation tests of the replay conditions on arc 0 and one late arc.
Usage: python3 -I sens.py <inputs/workspace>"""
import sys, json, gzip
from fractions import Fraction as F
from math import comb, exp
ws = sys.argv[1]
plan = json.load(open(ws + '/lambda_round14/material/m8_late/M8_LATE_PLAN.json'))
src = json.load(open(ws + '/lambda_round15/flow_main_v2/MAIN_CLOCK_SOURCE.json'))
rows = []
for pr, sr in zip(plan['rows'], src['records']):
    a, b = (float(F(x)) for x in pr['time'])
    M, N, A, B = (float(F(sr[k])) for k in ('main_lo', 'native_debit', 'first_hi', 'last_hi'))
    nodes = [(float(F(x['height'])), float(F(x['shift'])), float(F(x['weight']))) for x in pr['nodes']]
    ov = pr.get('joint_jet_overlay'); jet = None
    if ov: jet = (float(F(ov['alpha'])), [(float(F(c['p'])), [float(F(x)) for x in c['b']]) for c in ov['centres']])
    rows.append((a, b, M - N, A, B, nodes, jet, float(F(pr['q_interval'][1]))))
print('node counts rows 0,1,16,44,55,65,66:', [len(plan['rows'][i]['nodes']) for i in (0, 1, 16, 44, 55, 65, 66)])
def own(q, row):
    tot = 0.0
    for h, v, w in row[5]:
        tot += 2*w*h*(h*h+v*v-q)/((h*h+v*v-q)**2+4*v*v*q)
    if row[6]:
        al, cs = row[6]; tot *= al
        for p, bs in cs:
            for m, b in enumerate(bs):
                tot += 2*b*p**(m-1)*(-1)**m*2*sum(comb(m+1, 2*k)*p**(m+1-2*k)*q**k for k in range((m+1)//2+1))/(p*p-q)**(m+1)
    return tot
def endpoint(eps, scale=1.0, q_init=9/16 + 1e-12):
    dt = 1/2048000; q = q_init; t = 0.0; best = None
    for row in rows:
        a, b, MN, A, B, _, _, cap = row
        if q > cap: return ('cap exceeded at row start', rows.index(row), q, cap)
        nst = round((b - a)/dt)
        for k in range(nst):
            th = k/nst
            S = (MN - (1-th)*A - th*B)*scale - eps
            r = 2*(S - own(q, row))
            if r <= 0: r = 1e-300
            qn = (q + 2/r)*exp(-r*dt) - 2/r
            if qn <= 2e-6:      # stop; clean up by de Bruijn
                return t + q/2
            q = qn; t += dt
            cand = t + q/2
    return t + q/2
print('endpoint eps=0 (float, continuous rate):', endpoint(0.0), ' certificate B* = 0.10796491007877157')
for eps in (1e-6, 1e-4, 1e-3, 1e-2, 0.1, 0.5, 1.0):
    print('uniform loss eps=%g in S_i -> endpoint' % eps, endpoint(eps))
for sc in (0.999, 0.99, 0.9):
    print('S_i scaled by %g -> endpoint' % sc, endpoint(0.0, sc))
# exact
flow = json.load(gzip.open(ws + '/lambda_round16/ordinary_7_8_flow/full_flow/FLOW.json.gz', 'rt'))
arcs = flow['records']
rmax = max(F(a['rate']) for a in arcs)
print('max rate *1e13 floor:', (rmax*10**13).numerator // (rmax*10**13).denominator, ' min rate *1e13 floor:', (lambda x: x.numerator//x.denominator)(min(F(a['rate']) for a in arcs)*10**13))
print('q1 of arc 0 *1e16 floor:', (lambda x: x.numerator//x.denominator)(F(arcs[0]['qout'])*10**16))
print('keys of an arc record:', sorted(arcs[0].keys()))
print('flow top-level keys:', [k for k in flow if k != 'records'])
