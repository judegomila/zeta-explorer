"""Independent replay of a slice of the arc certificate (stdlib Fractions; own code).
Usage: python3 -I arc_slice.py <workspace_dir>
Own-pair jet term uses the binomial closed form, not the packet's Newton recurrence;
exp(-x) upper bound uses a truncated alternating Taylor series with even last index
(valid for 0<=x<1), not the packet's Pade form."""
import sys, json, gzip
from fractions import Fraction as F
from math import comb
ws = sys.argv[1]
plan = json.load(open(ws + '/lambda_round14/material/m8_late/M8_LATE_PLAN.json'))
src = json.load(open(ws + '/lambda_round15/flow_main_v2/MAIN_CLOCK_SOURCE.json'))
print('planned: decompress FLOW.json.gz (~%d MB JSON text) and parse' % 150, flush=True)
flow = json.load(gzip.open(ws + '/lambda_round16/ordinary_7_8_flow/full_flow/FLOW.json.gz', 'rt'))
arcs = flow['records']; n = len(arcs)
assert n == 221010
def own(q, row):
    tot = F(0)
    for nd in row['nodes']:
        h, v, w = F(nd['height']), F(nd['shift']), F(nd['weight'])
        assert h*h > q
        A = h*h + v*v - q
        tot += 2*w*h*A/(A*A + 4*v*v*q)
    ov = row.get('joint_jet_overlay')
    if ov is None: return tot
    tot *= F(ov['alpha'])
    for c in ov['centres']:
        p = F(c['p']); assert p*p > q
        for m, b in enumerate(map(F, c['b'])):
            # (1/m!) d^m/dp^m [2p/(p^2-q)] = (-1)^m [ (p-y)^-(m+1) + (p+y)^-(m+1) ]
            S = 2*sum(comb(m+1, 2*k)*p**(m+1-2*k)*q**k for k in range((m+1)//2+1))/(p*p-q)**(m+1)
            tot += 2*b*p**(m-1)*(-1)**m*S
    return tot
def exp_neg_upper(x, terms=16):
    assert 0 <= x < 1
    s = F(0); t = F(1)
    for k in range(terms+1):      # ends on even k: partial sum is an upper bound for 0<=x<1
        s += t if k % 2 == 0 else -t
        t = t*x/(k+1)
    return s
eta = F(1, 10**12); step = F(1, 2048000)
def chk(i):
    a = arcs[i]; r = a['row']; pr = plan['rows'][r]; sr = src['records'][r]
    t0, t1 = map(F, pr['time']); cap = F(pr['q_interval'][1])
    t = F(a['t']); dt = F(a['dt']); q0 = F(a['qin']); q1 = F(a['qout']); rate = F(a['rate'])
    s = F(a['source_lower']); o = F(a['own_upper'])
    if i == 0: assert t == 0 and q0 == F(9, 16) + F(1, 10**12)
    else:
        p = arcs[i-1]; assert F(p['t']) + F(p['dt']) == t and F(p['qout']) == q0 and p['row'] in (r, r-1)
    assert dt == step and t0 <= t < t + dt <= t1 and 0 < q0 <= cap
    M, N, A, B = (F(sr[k]) for k in ('main_lo', 'native_debit', 'first_hi', 'last_hi'))
    assert A >= B > 0 and [F(sr['t_lo']), F(sr['t_hi'])] == [t0, t1]
    th = (t - t0)/(t1 - t0); S = M - N - (1 - th)*A - th*B
    assert s <= S, ('source', i)
    assert o >= own(q0, pr), ('own', i)
    assert rate > 0 and 2*(s - o) - rate >= eta, ('rate', i)
    assert q0 - (2 + rate*q0)*dt > 0, ('positive', i)
    assert (q0 + 2/rate)*exp_neg_upper(rate*dt) - 2/rate <= q1 < q0, ('outgoing', i)
    d = q1.denominator; assert d & (d-1) == 0 and d <= 2**96
idx = list(range(0, 600)) + list(range(81915, 81975)) + list(range(163835, 163895)) + list(range(n-100, n))
for i in idx: chk(i)
last = arcs[-1]
T = F(last['t']) + F(last['dt']); qT = F(last['qout'])
assert T == F(22101, 204800) and qT == F(7902377963830536747158643, 2**96)
assert T + qT/2 == F(427693072077942473661578098491, 3961408125713216879677197516800)
r0 = F(arcs[0]['rate']); gap = eta - r0*(F(9,16)+eta)*F(1, 10**14)
assert r0 == F(122615339047817575291909362361, 9903520314283042199192993792) and gap > F(1, 2*10**12)
rows = [a['row'] for a in arcs]
counts = [rows.count(i) for i in range(67)]
assert counts == [5120]*20 + [2560]*46 + [850]
print(json.dumps({'arcs_in_slice': len(idx), 'slice': 'arcs 0-599, 81915-81974 (row 15/16 join), 163835-163894 (row 43/44 join), last 100', 'all_slice_checks_pass': True,
  'terminal_identity': True, 'startup_gap': float(gap), 'row_arc_counts_ok': True, 'rows_in_slice': sorted({arcs[i]['row'] for i in idx})}))
