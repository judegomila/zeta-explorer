"""R9 independent full replay of the 221,010-arc certificate. Own code, stdlib only.
Usage: python3 -I arc_full.py <inputs/workspace dir> <out.json> [limit]
Differences from the packet checker (verify_arcs_fresh.py):
  - arithmetic: Python int/Fraction, not FLINT fmpq
  - node own-pair: denominator written as (h^2+v^2+q)^2 - 4 h^2 q  [= ((h-y)^2+v^2)((h+y)^2+v^2)]
  - jet own-pair: binomial closed form of (p-y)^-(m+1) + (p+y)^-(m+1), not the Newton recurrence
  - exp(-x) upper bound: alternating Taylor partial sum ending on an even index (needs 0<=x<=1)
  - source bound S_i(t0) from (86) directly, not intercept/slope
Reads only the three input files named below (paths from argv)."""
import sys, json, gzip, hashlib, time
from fractions import Fraction as F
from math import comb
ws, outp = sys.argv[1], sys.argv[2]
limit = int(sys.argv[3]) if len(sys.argv) > 3 else None
FILES = {'plan': ('/lambda_round14/material/m8_late/M8_LATE_PLAN.json', 'ec346b7c1136eda38021eb6323033b3b48ed21e6f7458eeeac7cc9579db2497a'),
         'source': ('/lambda_round15/flow_main_v2/MAIN_CLOCK_SOURCE.json', 'b59905d7b994d3424ba14f9347be75a2429ae4d4b0de2c2404971ffda1d4d536'),
         'flow': ('/lambda_round16/ordinary_7_8_flow/full_flow/FLOW.json.gz', 'a664e829a3681d96e474bcf875d80cba7b16fe8f65e050c69f01b5ea07de4737')}
raw = {}
for k, (rel, dig) in FILES.items():
    b = open(ws + rel, 'rb').read()
    assert hashlib.sha256(b).hexdigest() == dig, ('digest', k)
    raw[k] = b
plan = json.loads(raw['plan']); src = json.loads(raw['source'])
print('planned allocation: FLOW json text ~150 MB, parsed ~1.5 GB', flush=True)
flow = json.loads(gzip.decompress(raw['flow'])); del raw
arcs = flow['records']; n = len(arcs)
assert n == 221010 == flow['steps']
t_start = time.time()
# ---- rows
rows = []; prev_end = F(0)
for i, (pr, sr) in enumerate(zip(plan['rows'], src['records'])):
    assert pr['row'] == sr['row'] == i and pr['mode'] == sr['mode']
    a, b = map(F, pr['time']); c0, cap = map(F, pr['q_interval'])
    assert a == prev_end < b and c0 == 0 < cap
    assert [F(sr['t_lo']), F(sr['t_hi'])] == [a, b] and [F(x) for x in sr['q_interval']] == [c0, cap]
    M, N, A, B = (F(sr[k]) for k in ('main_lo', 'native_debit', 'first_hi', 'last_hi'))
    assert A >= B > 0
    nodes = [(F(x['height']), F(x['shift']), F(x['weight'])) for x in pr['nodes']]
    for h, v, w in nodes: assert h > 0 and h*h > cap and abs(v) <= F(39, 20)
    ov = pr.get('joint_jet_overlay'); jet = None
    if ov is not None:
        alpha = F(ov['alpha']); assert alpha >= 0
        cs = [(F(c['p']), [F(x) for x in c['b']]) for c in ov['centres']]
        for p, bs in cs: assert p > 0 and p*p > cap and bs
        jet = (alpha, cs)
    rows.append(dict(a=a, b=b, cap=cap, M=M, N=N, A=A, B=B, nodes=nodes, jet=jet,
                     minpole=min([h*h for h, _, _ in nodes] + ([p*p for p, _ in jet[1]] if jet else []))))
    prev_end = b
assert len(rows) == 67 and prev_end == F(87, 800)
jet_rows = [i for i, r in enumerate(rows) if r['jet']]
def own(q, row):
    tot = F(0)
    for h, v, w in row['nodes']:
        hh = h*h; vv = v*v; s = hh + vv + q
        D = s*s - 4*hh*q
        assert D > 0
        tot += 2*w*h*(hh + vv - q)/D
    if row['jet'] is None: return tot
    alpha, cs = row['jet']; tot *= alpha
    for p, bs in cs:
        pole = p*p - q; assert pole > 0
        for m, b in enumerate(bs):
            num = 2*sum(comb(m+1, 2*k)*p**(m+1-2*k)*q**k for k in range((m+1)//2 + 1))
            tot += 2*b*p**(m-1)*(-1)**m*num/pole**(m+1)
    return tot
def exp_neg_upper(x, last=12):
    assert 0 <= x <= 1 and last % 2 == 0
    s = F(0); term = F(1)
    for k in range(last + 1):
        s += term if k % 2 == 0 else -term
        term = term*x/(k+1)
    return s
eta = F(1, 10**12); step = F(1, 2048000)
qinit = F(9, 16) + eta
assert F(flow['initial_q']) == qinit and flow['step_denominator'] == 2048000
t = F(0); q = qinit; last_row = -1
N_ = n if limit is None else limit
mins = {}; maxs = {}
def track(k, v, i):
    if k not in mins or v < mins[k][0]: mins[k] = (v, i)
    if k not in maxs or v > maxs[k][0]: maxs[k] = (v, i)
counts = [0]*67; entry = {}; exitq = {}
nchecks = 0
for idx in range(N_):
    a = arcs[idx]; i = a['row']
    assert isinstance(i, int) and i in (last_row, last_row + 1) and 0 <= i < 67, ('rowseq', idx)
    row = rows[i]
    t0 = F(a['t']); dt = F(a['dt']); q0 = F(a['qin']); q1 = F(a['qout']); r = F(a['rate'])
    s = F(a['source_lower']); o = F(a['own_upper'])
    assert t0 == t and q0 == q, ('join', idx)
    assert dt == step and row['a'] <= t0 < t0 + dt <= row['b'], ('cell', idx)                  # (91)
    assert 0 < q0 <= row['cap'], ('cap', idx)                                                   # (91)
    th = (t0 - row['a'])/(row['b'] - row['a'])
    S = row['M'] - row['N'] - (1 - th)*row['A'] - th*row['B']                                   # (86)
    assert s <= S, ('source', idx)                                                              # (92)
    O = own(q0, row)
    assert o >= O, ('own', idx)                                                                 # (92)
    margin = 2*(s - o) - r
    assert r > 0 and margin >= eta, ('rate', idx)                                               # (92)
    ell = q0 - (2 + r*q0)*dt
    assert ell > 0 and ell == F(a['linear_positive_lower']), ('positive', idx)                  # (93)
    x = r*dt
    Qup = (q0 + 2/r)*exp_neg_upper(x) - 2/r
    assert Qup <= q1 < q0, ('outgoing', idx)                                                    # (93)
    d = q1.denominator
    assert d & (d - 1) == 0 and d <= 2**96, ('dyadic', idx)
    if i == 55:
        assert ell >= F(289, 10000) and q1 >= F(289, 10000) and q0 <= F(361, 10000), ('tube', idx)
    nchecks += 9
    track('source_slack', S - s, idx); track('own_slack', o - O, idx); track('rate_margin_minus_eta', margin - eta, idx)
    track('true_margin_2(S-O)-r', 2*(S - O) - r, idx)
    track('outgoing_slack', q1 - Qup, idx); track('ell', ell, idx); track('cap_clearance', row['cap'] - q0, idx)
    track('rate', r, idx); track('x=r*dt', x, idx); track('pole_clearance', row['minpole'] - q0, idx)
    track('S', S, idx); track('O', O, idx)
    if counts[i] == 0: entry[i] = (t0, q0)
    counts[i] += 1; exitq[i] = (t0 + dt, q1)
    t = t0 + dt; q = q1; last_row = i
    if (idx + 1) % 20000 == 0: print('checked', idx + 1, 'row', i, round(time.time() - t_start, 1), 's', flush=True)
res = {'arcs_checked': N_, 'full': limit is None, 'conditions_checked': nchecks, 'jet_rows': jet_rows,
       'mins': {k: [float(v[0]), str(v[0]) if v[0].denominator < 10**60 else None, v[1]] for k, v in mins.items()},
       'maxs': {k: [float(v[0]), v[1]] for k, v in maxs.items()},
       'row_entry': {i: [str(entry[i][0]), float(entry[i][1])] for i in entry},
       'row_exit': {i: [str(exitq[i][0]), float(exitq[i][1])] for i in exitq}}
if limit is None:
    T = F(22101, 204800); qT = F(7902377963830536747158643, 2**96)
    assert t == T == F(flow['terminal_t']) and q == qT == F(flow['terminal_q'])
    assert 0 < qT <= F(1, 10000)
    Bs = F(427693072077942473661578098491, 3961408125713216879677197516800)
    assert T + qT/2 == Bs == F(flow['endpoint']) and Bs < F(107964910079, 10**12) < Bs + eta
    assert T < F(19, 125) and Bs < F(41, 250) and T < rows[66]['b']
    assert counts == [5120]*20 + [2560]*46 + [850]
    assert all(exitq[i][0] == rows[i]['b'] for i in range(66))          # every row except the last runs to its cell end
    tau = F(1, 10**14); r0 = F(arcs[0]['rate'])
    assert r0 == F(122615339047817575291909362361, 9903520314283042199192993792)
    gap = eta - r0*qinit*tau
    assert gap == F(921380903213784218478552545296645590637639, 990352031428304219919299379200000000000000000000000000) and gap > F(1, 2*10**12) and 0 < tau < step
    assert mins['cap_clearance'][0] == F(21059999, 10**12)
    a0 = arcs[0]
    assert F(a0['source_lower']) == F(18915863536666823719831936483, 2475880078570760549798248448)
    assert F(a0['own_upper']) == F(114846276982028443785727385843, 79228162514264337593543950336)
    assert 2*(F(a0['source_lower']) - F(a0['own_upper'])) - r0 == F(39614081257132169, 39614081257132168796771975168)
    assert F(a0['linear_positive_lower']) == F(11408766623905503936988141385986459896876653639, 20282409603651670423947251286016000000000000000)
    assert F(a0['qout']) == F(5570686828209889305941576421, 9903520314283042199192993792)
    res.update(terminal_pair_ok=True, Bstar_ok=True, startup_ok=True, startup_gap=float(gap), row_counts_ok=True, first_record_ok=True,
               Bstar=str(Bs), Bstar_float=float(Bs))
res['seconds'] = time.time() - t_start
json.dump(res, open(outp, 'w'), indent=1)
print(json.dumps(res, indent=1))
