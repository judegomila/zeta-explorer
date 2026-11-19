"""Own re-implementation of the arc conditions (91)-(93) of hexagon:2611.00460v1, written from the
paper's formulas (sec 3.8, 4.1-4.5), not from the packet's checker.
Usage: python -I own_arcs.py <workspace_dir> <out_json> [--sample-fractions N]

Differences from the packet checker (verify_arcs_fresh.py):
 * ordinary own pair: from the kernel definition K_h(d,b) of sec 3.8 at d=v, b=sqrt(q):
     K = 2h(h^2+v^2-q) / ((h^2+v^2+q)^2 - 4 h^2 q)     (the packet uses the denominator of (87))
 * jet terms: (1/m!) d^m/dp^m [2p/(p^2-q)] = (-1)^m [ (p-y)^-(m+1) + (p+y)^-(m+1) ], y^2=q, evaluated
   by exact arithmetic in Q[y]/(y^2-q): (p+y)^(m+1) = a + b y, value = (-1)^m 2a/(p^2-q)^(m+1)
   (the packet uses the Newton recurrence (98))
 * e^{-x} upper bound: 1/(1+x+...+x^8/8!) for x>=0 (the packet uses the [6/6] Pade form (95)-(96))
 * time cells and joins are tracked independently of the stored 't' strings (integer arc index k: t = k/2048000)
Pass 1: all arcs with python-flint fmpq. Pass 2: a subset recomputed with stdlib fractions.Fraction.
"""
import sys, json, gzip, random, time, hashlib
from fractions import Fraction as F
from flint import fmpq as Q

ws, out = sys.argv[1], sys.argv[2]
FAILFAST = '--failfast' in sys.argv
WIT = sys.argv[sys.argv.index('--witness') + 1] if '--witness' in sys.argv else None
t_start = time.monotonic()
praw = open(ws + '/lambda_round14/material/m8_late/M8_LATE_PLAN.json', 'rb').read()
sraw = open(ws + '/lambda_round15/flow_main_v2/MAIN_CLOCK_SOURCE.json', 'rb').read()
fraw = open(ws + '/lambda_round16/ordinary_7_8_flow/full_flow/FLOW.json.gz', 'rb').read()
digests = {'plan': hashlib.sha256(praw).hexdigest(), 'source': hashlib.sha256(sraw).hexdigest(), 'flow': hashlib.sha256(fraw).hexdigest()}
plan = json.loads(praw); src = json.loads(sraw)
print('planned: parse FLOW.json (about 125 MB text, 221010 records; Python objects about 1 GB)', flush=True)
flow = json.loads(gzip.decompress(fraw)); del fraw
arcs = flow['records']; n = len(arcs)
fails = []
def bad(i, what):
    fails.append((i, what))
    if len(fails) <= 50: print('FAIL', i, what, flush=True)
    if FAILFAST: print('REJECTED at arc', i, ':', what, flush=True); sys.exit(1)

def mk(N):
    """Build row data and the three functions in number type N (fmpq or Fraction)."""
    rows = []
    for i, (pr, sr) in enumerate(zip(plan['rows'], src['records'])):
        a, b = N(pr['time'][0]), N(pr['time'][1]); c0, c = N(pr['q_interval'][0]), N(pr['q_interval'][1])
        M, Nd, A, Bh = (N(sr[k]) for k in ('main_lo', 'native_debit', 'first_hi', 'last_hi'))
        nodes = [(N(x['height']), N(x['shift']), N(x['weight'])) for x in pr['nodes']]
        ov = pr.get('joint_jet_overlay')
        jet = None
        if ov is not None:
            jet = (N(ov['alpha']), [(N(cc['p']), [N(x) for x in cc['b']]) for cc in ov['centres']])
        rows.append(dict(a=a, b=b, c=c, c0=c0, M=M, Nd=Nd, A=A, B=Bh, nodes=nodes, jet=jet,
                         sa=N(sr['t_lo']), sb=N(sr['t_hi']), sc=[N(x) for x in sr['q_interval']], mode=(pr['mode'], sr['mode']), idx=(pr['row'], sr['row'])))
    def S(row, t):
        th = (t - row['a']) / (row['b'] - row['a'])
        return row['M'] - row['Nd'] - (1 - th) * row['A'] - th * row['B']
    def O(row, q):
        tot = N(0)
        for h, v, w in row['nodes']:
            num = 2 * h * (h * h + v * v - q)
            den = (h * h + v * v + q) ** 2 - 4 * h * h * q
            assert den > 0 and h * h > q
            tot += w * num / den
        if row['jet'] is None: return tot
        alpha, centres = row['jet']
        tot = alpha * tot
        for p, bs in centres:
            pole = p * p - q
            assert pole > 0
            ra, rb = p, N(1)          # (p + y)^1 = ra + rb*y
            polepow = pole
            ppow = 1 / p              # p^(m-1)
            jsum = N(0)
            for m, bm in enumerate(bs):
                val = 2 * ra / polepow
                jsum += bm * ppow * (val if m % 2 == 0 else -val)
                ra, rb = ra * p + rb * q, ra + rb * p     # multiply by (p + y), y^2 = q
                polepow = polepow * pole; ppow = ppow * p
            tot += 2 * jsum
        return tot
    fact = [1, 1, 2, 6, 24, 120, 720, 5040, 40320]
    def expneg_upper(x):
        assert x >= 0
        s = N(0); xp = N(1)
        for k in range(9):
            s += xp / fact[k]; xp = xp * x
        return 1 / s
    return rows, S, O, expneg_upper

# ---------------- row-level coverage (exact endpoints) ----------------
rows, S, O, EU = mk(Q)
row_report = {}
assert len(rows) == 67 and len(src['records']) == 67 and len(plan['rows']) == 67
prev = Q(0)
for i, r in enumerate(rows):
    if r['idx'] != (i, i): bad(-1, 'row index %d' % i)
    if not (r['a'] == prev and r['a'] < r['b']): bad(-1, 'cell join row %d' % i)
    if not (r['sa'] == r['a'] and r['sb'] == r['b']): bad(-1, 'source/plan time row %d' % i)
    if not (r['c0'] == 0 and r['c'] > 0 and r['sc'] == [r['c0'], r['c']]): bad(-1, 'cap row %d' % i)
    if not (r['A'] >= r['B'] > 0): bad(-1, 'A>=B>0 row %d' % i)
    if r['mode'][0] != r['mode'][1]: bad(-1, 'mode row %d' % i)
    for h, v, w in r['nodes']:
        if not (h > 0 and h * h > r['c'] and abs(v) <= Q(39, 20)): bad(-1, 'node pole/shift row %d' % i)
    if r['jet'] is not None:
        if not r['jet'][0] >= 0: bad(-1, 'alpha row %d' % i)
        for p, bs in r['jet'][1]:
            if not (p > 0 and p * p > r['c'] and len(bs) > 0): bad(-1, 'jet pole row %d' % i)
    prev = r['b']
if prev != Q(87, 800): bad(-1, 'horizon')
row_report['cells_tile_0_to_87_800'] = not fails
row_report['jet_rows'] = [i for i, r in enumerate(rows) if r['jet'] is not None]
row_report['cell_lengths'] = sorted({str(r['b'] - r['a']) for r in rows})

# ---------------- pass 1: every arc, fmpq ----------------
DEN = 2048000
delta = Q(1, DEN); eta = Q(1, 10 ** 12)
qinit = Q(9, 16) + Q(1, 10 ** 12)
q = qinit; last_row = 0
counts = [0] * 67
mins = {}
def track(name, val, i):
    if name not in mins or val < mins[name][0]: mins[name] = (val, i)
slack_rate = [None] * n; slack_src = [None] * n; slack_own = [None] * n; slack_out = [None] * n
wit = gzip.open(WIT, 'rt') if WIT else None; wit_cmp = 0; wit_bad = 0; pade_vs_own = None; max_out = None; max_src = None; max_own = None
prevO = None; mono_viol = 0; row_first = {}; rate_min = None; rate_max = None
for k, a in enumerate(arcs):
    i = a['row']
    if not (isinstance(i, int) and 0 <= i < 67 and i in (last_row, last_row + 1)): bad(k, 'row sequence'); break
    r = rows[i]
    t0 = Q(k, DEN)                          # independent clock
    if Q(a['t']) != t0: bad(k, 'stored t differs from k/2048000')
    if Q(a['dt']) != delta: bad(k, 'dt')
    q0 = Q(a['qin'])
    if q0 != q: bad(k, 'qin differs from previous qout (or qinit)')
    if not (r['a'] <= t0 and t0 + delta <= r['b']): bad(k, 'arc not inside its row cell')
    if i != last_row:
        # row change: must occur exactly at the common cell endpoint
        if t0 != r['a'] or t0 != rows[last_row]['b']: bad(k, 'row change not at cell endpoint')
        prevO = None
    if i not in row_first: row_first[i] = k
    if not (0 < q0 <= r['c']): bad(k, 'cap')
    s = Q(a['source_lower']); o = Q(a['own_upper']); rate = Q(a['rate']); q1 = Q(a['qout'])
    Sv = S(r, t0); Ov = O(r, q0)
    if not s <= Sv: bad(k, 'source_lower above S_i(t0)')
    if not o >= Ov: bad(k, 'own_upper below O_pair(q0)')
    m = 2 * (s - o) - rate - eta
    if not (rate > 0 and m >= 0): bad(k, 'rate')
    ell = q0 - (2 + rate * q0) * delta
    if not ell > 0: bad(k, 'ell')
    if Q(a['linear_positive_lower']) != ell: bad(k, 'stored ell differs')
    Qd = (q0 + 2 / rate) * EU(rate * delta) - 2 / rate
    if not (Qd <= q1 < q0): bad(k, 'outgoing')
    d = int(q1.denominator)
    if d & (d - 1) or d > 2 ** 96: bad(k, 'dyadic')
    # necessary condition for the own-pair monotonicity used in Lemma 4.2: q decreases along a row, so O must not increase
    if prevO is not None and Ov > prevO: mono_viol += 1
    prevO = Ov
    if wit:
        wr = json.loads(wit.readline()); wit_cmp += 1
        # same quantities, computed by different formulas: must agree exactly
        if not (wr['arc'] == k and Q(wr['source_downward_slack']) == Sv - s and Q(wr['own_upward_slack']) == o - Ov
                and Q(wr['rate_margin_after_required_eta']) == m and Q(wr['whole_arc_positive_floor']) == ell
                and Q(wr['cap_clearance']) == r['c'] - q0 and Q(wr['qout']) == q1):
            wit_bad += 1; bad(k, 'packet witness differs from own value')
        dd = Q(wr['pade_outgoing_slack']) - (q1 - Qd)      # own exp bound minus Pade bound, >= 0 if own bound is the looser one
        pade_vs_own = dd if pade_vs_own is None or abs(dd) > abs(pade_vs_own) else pade_vs_own
    for nm_, val_ in (('out', q1 - Qd), ('src', Sv - s), ('own', o - Ov)):
        pass
    max_out = q1 - Qd if max_out is None or q1 - Qd > max_out else max_out
    max_src = Sv - s if max_src is None or Sv - s > max_src else max_src
    max_own = o - Ov if max_own is None or o - Ov > max_own else max_own
    slack_rate[k] = m; slack_src[k] = Sv - s; slack_own[k] = o - Ov; slack_out[k] = q1 - Qd
    track('rate_margin_after_eta', m, k); track('source_slack', Sv - s, k); track('own_slack', o - Ov, k)
    track('outgoing_slack', q1 - Qd, k); track('ell', ell, k); track('cap_clearance', r['c'] - q0, k)
    track('true_margin_2(S-O)-r-eta', 2 * (Sv - Ov) - rate - eta, k)
    rate_min = rate if rate_min is None or rate < rate_min else rate_min
    rate_max = rate if rate_max is None or rate > rate_max else rate_max
    counts[i] += 1; q = q1; last_row = i
    if (k + 1) % 20000 == 0: print('own pass 1:', k + 1, 'row', i, round(time.monotonic() - t_start, 1), 's', flush=True)
T = Q(n, DEN); qT = q
endpoint = T + qT / 2
claimed = Q(427693072077942473661578098491, 3961408125713216879677197516800)
r0 = Q(arcs[0]['rate']); tau = Q(1, 10 ** 14)
startup = eta - r0 * qinit * tau
terminal = {
  'arcs': n, 'T': str(T), 'T_is_22101/204800': T == Q(22101, 204800), 'qT': str(qT),
  'qT_is_claimed': qT == Q(7902377963830536747158643, 2 ** 96), 'endpoint_T_plus_qT_over_2': str(endpoint),
  'endpoint_equals_claimed_fraction': endpoint == claimed, 'endpoint_string_equal': str(endpoint) == '427693072077942473661578098491/3961408125713216879677197516800',
  'endpoint_lt_0.107964910079': endpoint < Q(107964910079, 10 ** 12), 'T_inside_last_cell': rows[last_row]['a'] < T <= rows[last_row]['b'],
  'last_row': last_row, 'counts_ok': counts == [5120] * 20 + [2560] * 46 + [850],
  'startup_gap': str(startup), 'startup_gap_gt_1/(2e12)': startup > Q(1, 2 * 10 ** 12), 'tau_lt_delta': tau < delta,
  'startup_gap_equals_paper_102': startup == Q(921380903213784218478552545296645590637639, 990352031428304219919299379200000000000000000000000000),
  'r0_equals_paper': r0 == Q(122615339047817575291909362361, 9903520314283042199192993792),
  'flow_declared': {k: flow.get(k) for k in ('initial_q', 'terminal_t', 'terminal_q', 'endpoint', 'headline', 'startup_tau', 'steps', 'step_denominator')},
  'witness_records_compared': wit_cmp, 'witness_mismatches': wit_bad,
  'largest_abs_difference_between_packet_Pade_slack_and_own_slack': None if pade_vs_own is None else int(pade_vs_own.numerator) / int(pade_vs_own.denominator),
  'max_outgoing_slack_times_2^96': int((max_out * 2 ** 96).numerator) / int((max_out * 2 ** 96).denominator),
  'max_source_slack': int(max_src.numerator) / int(max_src.denominator), 'max_own_slack': int(max_own.numerator) / int(max_own.denominator),
  'rate_min': str(rate_min), 'rate_max': str(rate_max), 'own_pair_increase_events_along_rows': mono_viol}
print('pass 1 done; failures:', len(fails), flush=True)

# ---------------- pass 2: subset with stdlib Fraction ----------------
rowsF, SF, OF, EUF = mk(F)
random.seed(20261117)
sample = set(random.sample(range(n), 2500))
order = sorted(range(n), key=lambda k: slack_rate[k])
smallest = order[:200]
sub = set(sample) | set(smallest)
for k in smallest:
    for j in (k - 1, k + 1):
        if 0 <= j < n: sub.add(j)
for i, k in row_first.items():           # every row-change join, both sides
    sub.add(k)
    if k > 0: sub.add(k - 1)
sub |= {0, n - 1}
for nm in ('source_slack', 'own_slack', 'outgoing_slack'):
    arr = {'source_slack': slack_src, 'own_slack': slack_own, 'outgoing_slack': slack_out}[nm]
    for k in sorted(range(n), key=lambda kk: arr[kk])[:50]: sub.add(k)
etaF = F(1, 10 ** 12); deltaF = F(1, DEN); f2 = 0; joins = 0
def fr(x): return F(int(x.numerator), int(x.denominator))
for k in sorted(sub):
    a = arcs[k]; r = rowsF[a['row']]
    t0 = F(k, DEN); q0 = F(a['qin']); q1 = F(a['qout']); s = F(a['source_lower']); o = F(a['own_upper']); rate = F(a['rate'])
    ok = F(a['t']) == t0 and F(a['dt']) == deltaF and r['a'] <= t0 and t0 + deltaF <= r['b'] and 0 < q0 <= r['c']
    Sv = SF(r, t0); Ov = OF(r, q0)
    ok = ok and s <= Sv and o >= Ov and rate > 0 and 2 * (s - o) - rate >= etaF
    ok = ok and q0 - (2 + rate * q0) * deltaF > 0 and (q0 + 2 / rate) * EUF(rate * deltaF) - 2 / rate <= q1 < q0
    ok = ok and Sv == fr(S(rows[a['row']], Q(k, DEN))) and Ov == fr(O(rows[a['row']], Q(a['qin'])))   # two libraries agree exactly
    if k > 0:
        pa = arcs[k - 1]; joins += 1
        ok = ok and F(pa['qout']) == q0 and F(pa['t']) + F(pa['dt']) == t0 and pa['row'] in (a['row'], a['row'] - 1)
    if k + 1 < n:
        na = arcs[k + 1]; joins += 1
        ok = ok and F(na['qin']) == q1 and F(na['t']) == t0 + deltaF
    if not ok: f2 += 1; bad(k, 'pass 2 (Fraction) failure')
res = {'input_sha256': digests, 'row_level': row_report, 'pass1_arcs_checked': n, 'pass1_failures': len(fails),
       'failure_list_first_50': [[i, w] for i, w in fails[:50]], 'terminal': terminal,
       'minima': {k: {'value': str(v[0]), 'approx': int(v[0].numerator) / int(v[0].denominator), 'arc': v[1], 'row': arcs[v[1]]['row']} for k, v in mins.items()},
       'pass2': {'arithmetic': 'stdlib fractions.Fraction', 'arcs': len(sub), 'random_sample': len(sample), 'smallest_rate_slack': 200,
                 'join_checks': joins, 'failures': f2, 'row_change_joins_included': len(row_first) - 1},
       'smallest_rate_slack_arcs_first_10': [[k, int(slack_rate[k].numerator) / int(slack_rate[k].denominator), arcs[k]['row']] for k in smallest[:10]],
       'seconds': time.monotonic() - t_start}
json.dump(res, open(out, 'w'), indent=1)
print(json.dumps({k: v for k, v in res.items() if k != 'failure_list_first_50'}, indent=1))
sys.exit(1 if fails else 0)
