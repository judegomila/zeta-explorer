# Independent checker for a per-substep dump of tmp/qrh-tune-consume.py.  Shares no code with the consumer, with
# tmp/qrh-tune-verify.py or with round 1's replay.py.  Exact rationals throughout.
# usage: check_dump.py DUMP(.gz) THETA RUNJSON_or_- OUT.json [--replay TH1,TH2,...]
# Per substep k (cell i = k div 128, delta = 1/512000):
#   R   rate recomputed from the mode record, c = (2 lam / h)(ell - cap / h), equals the dumped rate; c > 0; 0 < c delta < 1
#   C1  v = q / h^2 <= rho^2 and r h < 2
#   C2  cap >= sup_{[0,v]} s_r, decided exactly (not sampled): with a = r^2, u = 1 + a - v', s = 2u/(u^2 + 4a(1+a-u)),
#       ds/du has the sign of 4a(1+a) - u^2.  3a >= 1: sup = s(0) = 2/(1+a).  3a < 1: sup = s(v) if (1+a-v)^2 >= 4a(1+a),
#       else the peak 1/(u* - 2a), u* = 2 sqrt(a(1+a)), and cap >= peak  <=>  4a(1+a) >= (2a + 1/cap)^2.
#   W   no window floor (qlo null, kind 'cat' or single-row M with weight 1)
#   Q   dumped q equals the recomputed enclosure chain from q0 = (2 theta - 1)^2 + 1e-7; dumped outq equals the one-step value
#   FX  for X rows: floor ell re-read from the set's TABLES.json at cell i, and h equals the set's plan height at cell i
#   KC  M rows: the named kernel certificate file has PASS true and the same (r, lambda, rho), w = 0, kappa = 1;
#       cat rows: (r, lambda, rho) read from Raymond's catalogue file by index
#   S1, terminal (C5), horizon (C6); U recomputed.
# --replay: fixed-mode replay (Lemma R) of this dump's rates from lower starts, with q'_k <= q_k checked at every k.
import sys, json, gzip, collections
from fractions import Fraction as F
T = 'tmp/'
CAT = json.load(open(T + 'oai-lambda-out/KERNELS_raymond_backup.json'))['rows']
DELTA = F(1, 512000); QE = F(1, 10**8)
def up(x, den): return F(-((-x.numerator * den) // x.denominator), den)
def em(x):
    s = t = F(1)
    for j in range(1, 19):
        t = t * (-x) / j; s += t
    return s
def cap_ok(r, v, cap):
    a = r * r
    if not (0 <= v < 1 + a and cap > 0): return False
    if 3 * a >= 1: return cap >= 2 / (1 + a)
    u = 1 + a - v
    if u * u >= 4 * a * (1 + a): return cap >= 2 * u / (u * u + 4 * a * v)
    return 4 * a * (1 + a) >= (2 * a + 1 / cap)**2
def terminal(k, q, c):
    z = c * (q - QE) / (2 + c * QE); ok = 0 < z < 1
    lag = sum(((-1)**(m + 1) * z**m / m for m in range(1, 12)), F(0)) / c
    ok = ok and 0 < lag <= DELTA
    U = up(k * DELTA + lag + QE / 2, 10**15)
    return U, ok and U < F(41, 250), lag
def main():
    path, theta, runjson, out = sys.argv[1:5]
    th = F(theta); qb = (2 * th - 1)**2; q0 = qb + F(1, 10**7)
    xs = {}
    if runjson != '-':
        for lab, tp, pp, lo, hi in json.load(open(runjson))['xsets']:
            tb = json.load(open(tp)); pl = {r['time_index']: F(r['height']) for r in json.load(open(pp))['rows']}
            xs[lab] = (tb, pl)
    fails = collections.Counter(); kinds = collections.Counter(); heights = collections.defaultdict(set); certs = {}
    modes = collections.defaultdict(set)
    rows = []; q = q0; n = 0; U = None; minadm = None; mincap = None; s1 = None; hmin = hmax = None
    op = gzip.open if path.endswith('.gz') else open
    with op(path, 'rt') as f:
        for k, line in enumerate(f):
            d = json.loads(line); i = k // 128; n += 1
            dq = F(d['q']); c = F(d['rate'])
            if U is not None: fails['rows-after-terminal'] += 1
            if dq != q: fails['Q-chain'] += 1
            if d['lab'][0] == 'M':
                m = d['multi']; ch = m['choice']
                if not (len(ch) == 1 and len(m['cw']) == 1 and F(m['cw'][0][0]) == 1 and ch[0]['kind'] == 'row' and len(m['caps']) == 1):
                    fails['W-not-single-row'] += 1; continue
                r = F(ch[0]['r']); lam = F(ch[0]['lam']); rho = F(ch[0]['rho']); h = F(m['h']); ell = F(m['ell']); cap = F(m['cap'])
                if lam != F(m['lam']) or F(m['caps'][0]) != cap or F(m['v']) != dq / (h * h): fails['M-record'] += 1
                if 'qlo' in d and d['qlo'] is not None: fails['W-window'] += 1
                cert = ch[0]['cert']; cp = cert if cert.startswith('/') else T + 'routes-b2-r3-out/kernels/' + cert
                if cp not in certs:
                    cc = json.load(open(cp))
                    certs[cp] = (cc['PASS'] is True or cc['PASS'] == 'True') and F(cc['r']) == r and F(cc['lambda']) == lam and F(cc['rho']) == rho \
                        and F(cc['w']) == 0 and F(cc['kappa']) == 1
                    certs[cp] = (certs[cp], (r, lam, rho))
                if not certs[cp][0] or certs[cp][1] != (r, lam, rho): fails['KC'] += 1
                if m['mid'].startswith('X:'):
                    lab = m['xset']; kinds['X:' + lab] += 1
                    if lab not in xs: fails['FX-noset'] += 1
                    else:
                        tb, pl = xs[lab]
                        if not (pl.get(i) == h and F(tb[str(i)][m['mode']]['both']) == ell and m['mode'] == 'r_' + ch[0]['r'].replace('/', '_')): fails['FX'] += 1
                    modes[i].add(('X', lab, str(h), str(r)))
                else:
                    kinds['multi:' + m['mid']] += 1; modes[i].add(('multi', m['mid'], str(h), str(r)))
            else:
                o = d['opt']
                if o['kind'] != 'cat': fails['W-kind-' + o['kind']] += 1; continue
                if d.get('qlo') is not None or o.get('qlo') is not None: fails['W-window'] += 1
                kk = CAT[o['ki']]; r = F(kk['r']); lam = F(kk['lambda']); rho = F(kk['rho']); h = F(o['h']); ell = F(o['ell']); cap = F(o['cap'])
                kinds['cat:' + d['set']] += 1; modes[i].add(('cat', d['set'], str(h), str(r)))
            v = dq / (h * h)
            if not (v <= rho * rho): fails['C1-rho'] += 1
            if not (r * h < 2): fails['C1-rh'] += 1
            if not cap_ok(r, v, cap): fails['C2-cap'] += 1
            cc_ = 2 * lam / h * (ell - cap / h)
            if cc_ != c: fails['R-rate'] += 1
            if not (c > 0 and 0 < c * DELTA < 1): fails['R-range'] += 1
            adm = rho * rho - v; minadm = adm if minadm is None or adm < minadm else minadm
            heights[i].add(h); hmin = h if hmin is None or h < hmin else hmin; hmax = h if hmax is None or h > hmax else hmax
            if k == 0:
                s1 = dq - (2 + c * dq) * F(1, 10**8) - qb
                if not (s1 > 0 and dq > qb): fails['S1'] += 1
            outq = (dq + 2 / c) * em(c * DELTA) - 2 / c
            if F(d['outq']) != outq: fails['Q-outq'] += 1
            rows.append((dq, c))
            if outq <= QE:
                U, ok, lag = terminal(k, dq, c); kterm = k
                if not ok: fails['terminal'] += 1
                tm = dict(q_K=float(dq), outq_minus_qe=float(outq - QE), lag_over_delta=float(lag / DELTA), U_unrounded_gap=float(U - (k * DELTA + lag + QE / 2)),
                          horizon_margin=float(F(41, 250) - U))
            else:
                q = up(outq, 2**96)
    if U is None: fails['no-terminal'] += 1
    multi = {i: sorted(map(str, hs)) for i, hs in heights.items() if len(hs) > 1}
    res = dict(dump=path, theta=str(th), q0=str(q0), substeps=n, U=str(U), U_float=float(U) if U else None, terminal_k=kterm, cell=kterm // 128, sub=kterm % 128,
               fails=dict(fails), S1_margin=float(s1), min_admissibility_margin=float(minadm), heights=[str(hmin), str(hmax)], terminal=tm,
               kinds=dict(kinds), kernel_certs_checked=len(certs), cells_with_two_or_more_heights=multi,
               substeps_in_multi_height_cells={i: collections.Counter() for i in multi})
    # detail of multi-height cells
    if multi:
        with op(path, 'rt') as f:
            for k, line in enumerate(f):
                i = k // 128
                if i in multi:
                    d = json.loads(line); h = d['multi']['h'] if 'multi' in d else d['opt']['h']
                    lab = d['multi']['mid'] if 'multi' in d else 'cat:' + d['set']
                    res['substeps_in_multi_height_cells'][i][f'{lab}@h={h}'] += 1
        res['substeps_in_multi_height_cells'] = {i: dict(c) for i, c in res['substeps_in_multi_height_cells'].items()}
    if '--replay' in sys.argv:
        res['replay'] = []
        for ths in sys.argv[sys.argv.index('--replay') + 1].split(','):
            t2 = F(ths); qb2 = (2 * t2 - 1)**2; q = qb2 + F(1, 10**7); mono = True; U2 = None
            for k, (qo, c) in enumerate(rows):
                if q > qo: mono = False
                if k == 0: s12 = q - (2 + c * q) * F(1, 10**8) - qb2
                outq = (q + 2 / c) * em(c * DELTA) - 2 / c
                if outq <= QE:
                    U2, ok, lag = terminal(k, q, c); break
                q = up(outq, 2**96)
            res['replay'].append(dict(theta=ths, U=str(U2), U_float=float(U2) if U2 else None, terminal_k=k, monotone=mono, S1_margin=float(s12), S1_ok=s12 > 0,
                                      terminal_ok=bool(U2 is not None and ok), lag_over_delta=float(lag / DELTA) if U2 else None))
    json.dump(res, open(out, 'w'), indent=1)
    print(json.dumps({k_: v_ for k_, v_ in res.items() if k_ not in ('kinds',)}, indent=1))
main()
