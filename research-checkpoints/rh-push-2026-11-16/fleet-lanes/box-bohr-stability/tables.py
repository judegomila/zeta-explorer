"""Build markdown data tables from results/ (used for RESULT.md section 4)."""
import json, collections, glob, math, re
def load(pat):
    out = []
    for f in sorted(glob.glob(pat)):
        for ln in open(f):
            try: out.append(json.loads(ln))
            except Exception: pass
    return out
ex = load('results/exactAll.jsonl')
# retries with a smaller eta (exactR.jsonl) replace the UNRESOLVED record of the same window
_R = [d for d in load('results/exactR.jsonl') if d['result'].get('verdict') in ('PASS', 'FAIL')]
_k = lambda d: (d['task']['kind'], d['task']['scheme'], d['task']['inp'], d['task']['size'], round(d['task'].get('T1', 0), 6), bool(d['task'].get('phi')))
_rk = {_k(d) for d in _R}
ex = [d for d in ex if _k(d) not in _rk] + _R[-1:]
th = json.load(open('results/thresholds.json'))
P = print
def vcount(v):
    return sum(1 for x in v if x.startswith('PASS')), sum(1 for x in v if x.startswith('FAIL')), sum(1 for x in v if not (x.startswith('PASS') or x.startswith('FAIL')))

P('### 4.1 S1: zeros of the lifted Dirichlet factor in the critical polydisc\n')
P('Screen: GPU float64, Gauss-Newton on (x, phases) from B random starts, then climbing in x along the zero set (B = 50,000-200,000 starts, 500 iterations per object). Certificates: `s1zero` = a zero with all |w_p| < 1 isolated by `acb_poly.roots()` at 256 bits; `s1pass` = interval subdivision of the torus plus the diagonal slice (objects in at most 3 variables).\n')
P('| object | input | sizes screened | first size with a zero in the polydisc | x_sup there | x_sup at largest size | certified zero (sizes) | certified zero-free (sizes) |')
P('|---|---|---|---|---|---|---|---|')
rows = collections.defaultdict(dict)
for d in load('results/big_s1.jsonl'):
    k = d['key'].split('|'); rows[(k[1], k[2], k[4])][int(k[3])] = d
cz = collections.defaultdict(list); cp = collections.defaultdict(list)
for d in ex:
    t, r = d['task'], d['result']
    key = (t['scheme'], t['inp'], str(t.get('K')) if t['scheme'] == 'euler' else t.get('weight', 'sharp'))
    if t['kind'] == 's1zero' and r['verdict'] == 'ZERO_IN_OPEN_POLYDISC': cz[key].append(t['size'])
    if t['kind'] == 's1pass' and r['verdict'] == 'ZERO_FREE_ON_CLOSED_POLYDISC': cp[key].append(t['size'])
def rng(v):
    v = sorted(set(v))
    if not v: return '-'
    return f'{v[0]}..{v[-1]} ({len(v)})' if len(v) > 3 else ','.join(map(str, v))
for key in sorted(rows):
    r = rows[key]; sz = sorted(r)
    ff = next((s for s in sz if r[s]['n_zero_xge0'] > 0), None)
    name = ('AFE ' + key[2]) if key[0] == 'afe' else ('Euler K=' + ('oo' if key[2] == '0' else key[2]))
    P(f"| {name} | {key[1]} | {sz[0]}..{sz[-1]} | {ff if ff else 'none'} | {('%.4f' % r[ff]['x_sup']) if ff else '-'} | {('%.4f' % r[sz[-1]]['x_sup']) if r[sz[-1]]['n_zero_xge0'] else 'no zero'} | {rng(cz[key])} | {rng(cp[key])} |")

P('\nNotes. x_sup values from the screen are lower bounds (largest zero found). Larger sizes (`big_s1x.jsonl`, 40,000 starts each, N = 52, 56, ..., 128): a zero in the polydisc was found at every size for sharp zeta, sharp DH, sharp tw2h, Riesz zeta and Riesz DH (largest x found at N = 128: 0.408, 0.484, 0.373, 0.092, 0.222). The Euler rows for zeta, tw2m, tw2h, liou are sanity runs of the proved statement T4(i); the S1 unit was stopped before the liou K = 2 and E_a Euler rows completed (E_a Euler K = 1, 2 at P = 3, 5 were screened locally: x_sup = 0.5216, 0.3211; for K = 1 the zero is explicit, w_2 = -sqrt 2/(2^{1/4} + 2^{-1/4}) = -0.697).')
P('\n### 4.2 Torus-uniform threshold t*(X) (T2)\n')
P('Closed form (sum over primes of one-variable suprema, float64) for products; 2-variable grid for DH. X = 1/2 for K finite, 0.45 for K = oo. Adversarial check on the GPU (4,000,000 random torus points per x, then 300 ascent steps from the best 2,000): for products the largest value found never exceeds the closed form; for the two DH cases it exceeds the 400 x 400 grid value by at most 4e-6.\n')
P('| P | zeta K=1 | zeta K=2 | zeta K=oo (X=0.45) | tw2h K=1 | DH K=1 | DH K=2 | DH K=oo |')
P('|---|---|---|---|---|---|---|---|')
def g(k):
    v = th.get(k)
    return '-' if v is None else ('oo (S1 fails)' if v == math.inf or v > 1e290 or (k.startswith('dh') and v > 1e20) else '%.4g' % v)
for Pp in (2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 37, 47, 97, 199, 997):
    P(f"| {Pp} | {g(f'zeta|P{Pp}|K1|X0.5')} | {g(f'zeta|P{Pp}|K2|X0.5')} | {g(f'zeta|P{Pp}|K0|X0.45')} | {g(f'tw2h|P{Pp}|K1|X0.5')} | {g(f'dh|P{Pp}|K1|X0.5')} | {g(f'dh|P{Pp}|K2|X0.5')} | {g(f'dh|P{Pp}|K0|X0.45')} |")
P('\n(tw2m and liou have the same thresholds as zeta: T3. DH for P >= 7: no finite threshold, T5.)\n')
P('GPU adversarial check (`hb` stage): object, sup found at x = 0.5, closed form, excess:\n')
for d in load('results/big_hb.jsonl'):
    r = d['rows'][-1]; P(f"- {d['key'][3:].replace('|', ' ')}: {r['sup_adversarial']} vs {r['closed_form']} (max excess over all x: {d['max_excess_over_closed']:.1e})")

P('\n### 4.3 Sections of Euler-type objects (c) and of the twin ladder (d): certified windows\n')
P('Windows of length 50 from t = 3.0137, |Re s - 1/2| < 0.5 (0.45 for K = oo and for the ladder). PASS = every zero in the window certified on the line; FAIL = certified zero off the line.\n')
P('| scheme | input | P | K | windows run (t up to) | PASS | FAIL | UNRES | last window with FAIL starts at | t* (T2) |')
P('|---|---|---|---|---|---|---|---|---|---|')
res = collections.defaultdict(list)
for d in ex:
    t, r = d['task'], d['result']
    if t['kind'] == 'win' and t['scheme'] in ('euler', 'ladder') and not t.get('phi') and abs(t['T2'] - t['T1'] - 50) < 1e-6:
        res[(t['scheme'], t['inp'], t['size'], t.get('K'))].append((t['T1'], r['verdict']))
for k in sorted(res, key=lambda k: (k[0], k[1], k[3] if k[3] else 99, k[2])):
    v = sorted(res[k]); p, f, u = vcount([x[1] for x in v]); fl = [x[0] for x in v if x[1].startswith('FAIL')]
    Pk = 3 if (k[1] == 'dh' and k[2] == 5) else k[2]
    key = f"{k[1]}|P{Pk}|K{k[3]}|X{0.5 if k[3] else 0.45}"
    ts = g(key) if k[0] == 'euler' and (k[1] in ('zeta', 'tw2h', 'tw2m', 'liou') or (k[1] == 'dh' and Pk <= 3)) else ('oo (S1 fails)' if k[1] == 'dh' and k[0] == 'euler' else '')
    if k[1] == 'dh' and th.get(key, 0) > 1e20: ts = 'oo (S1 fails)'
    P(f"| {k[0]} | {k[1]} | {k[2]} | {'oo' if k[3] == 0 else k[3]} | {len(v)} ({v[-1][0] + 50:.0f}) | {p} | {f} | {u} | {('%.0f' % fl[-1]) if fl else '-'} | {ts} |")

P('\n**GPU screen of the same sections on 3 < t < 30003** (windows of length 1000, float64; "last" = start of the last window containing an off-line zero in |Re s - 1/2| < 0.5 (0.45 for K = oo)):\n')
P('| input | K | ' + ' | '.join(f'P={p}' for p in (2, 3, 5, 7, 11, 13, 17, 19, 23, 29)) + ' |')
P('|---|---|' + '---|' * 10)
eu = collections.defaultdict(dict)
for d in load('results/big_euler.jsonl'):
    k = d['key'].split('|'); eu[(k[1], k[3])][int(k[2])] = d
for key in sorted((k for k in eu if not (k[0].startswith('ea') and k[1] == 'K0')), key=lambda k: (k[1], k[0])):
    cells = []
    for p in (2, 3, 5, 7, 11, 13, 17, 19, 23, 29):
        d = eu[key].get(p)
        if not d: cells.append(''); continue
        cells.append('none' if d['off'] == 0 else f"{d['off']} off, last {d['last_off_window']:.0f}" + (f" ({d['unresolved']} unres.)" if d.get('unresolved') else ''))
    P(f"| {key[0]} | {'oo' if key[1] == 'K0' else key[1][1:]} | " + ' | '.join(cells) + ' |')
P('\n### 4.4 Sharp AFE sections (a)\n')
P('**Matched windows, certified** (each size N on its own window 2 pi N^2/q < t < 2 pi (N+1)^2/q, |Re s - 1/2| < 1):\n')
P('| input | sizes run | PASS | FAIL | UNRES | first FAIL | zeros counted | certified off-line zeros |')
P('|---|---|---|---|---|---|---|---|')
m = collections.defaultdict(list)
for d in ex:
    t, r = d['task'], d['result']
    if t['kind'] == 'win' and t['scheme'] == 'afe' and not t.get('phi') and abs(t['T2'] - t['T1'] - 50) > 1e-6:
        m[t['inp']].append((t['size'], r['verdict'], r.get('n_tot', 0), r.get('n_up', 0)))
for inp in ('zeta', 'dh', 'tw2m', 'liou', 'tw2h'):
    v = sorted(m[inp]); p, f, u = vcount([x[1] for x in v]); fl = [x[0] for x in v if x[1] == 'FAIL']
    passes = [x[0] for x in v if x[1] == 'PASS']
    P(f"| {inp} | {v[0][0]}..{v[-1][0]} ({len(v)}) | {p} (N = {','.join(map(str, passes[:14]))}{'...' if len(passes) > 14 else ''}) | {f} | {u} | N = {fl[0] if fl else '-'} | {sum(x[2] or 0 for x in v)} | {sum(2 * (x[3] or 0) for x in v)} |")
P('\n**Matched windows, GPU screen** (float64 winding and sign changes; fraction of zeros off the line by range of N):\n')
P('| input | N range | max t | windows with off-line zeros | N 1-10 | 11-30 | 31-100 | 101-200 | 201-400 | 401-600 |')
P('|---|---|---|---|---|---|---|---|---|---|')
mm = collections.defaultdict(dict)
for d in load('results/big_matched.jsonl'):
    k = d['key'].split('|'); mm[k[1]][int(k[2])] = d
for inp, r in mm.items():
    Ns = sorted(r); cells = []
    for lo, hi in ((1, 10), (11, 30), (31, 100), (101, 200), (201, 400), (401, 600)):
        sel = [n for n in Ns if lo <= n <= hi]
        cells.append('%.4f' % (sum(r[n]['off'] for n in sel) / max(1, sum(r[n]['tot'] for n in sel))) if sel else '-')
    P(f"| {inp} | 1..{Ns[-1]} | {r[Ns[-1]]['tb']:.3g} | {sum(1 for n in Ns if r[n]['off'] > 0)}/{len(Ns)} | " + ' | '.join(cells) + ' |')
P('\n**Fixed N on 3 < t < 20003, GPU screen** (zeros in |Re s - 1/2| < 1; off = not on the line), and certified windows of length 50:\n')
P('| input | N | S1 | zeros | off-line | windows (of 80, length 250) with off-line zeros | certified windows PASS/FAIL (t up to) |')
P('|---|---|---|---|---|---|---|')
fx = collections.defaultdict(list)
for d in ex:
    t, r = d['task'], d['result']
    if t['kind'] == 'win' and t['scheme'] == 'afe' and not t.get('phi') and abs(t['T2'] - t['T1'] - 50) < 1e-6:
        fx[(t['inp'], t['size'])].append((t['T1'], r['verdict']))
s1first = {'zeta': 3, 'dh': 6, 'tw2m': 3, 'liou': 3, 'tw2h': 5}
for d in load('results/big_fixed.jsonl'):
    k = d['key'].split('|'); inp, N = k[1], int(k[2])
    v = sorted(fx.get((inp, N), [])); p, f, u = vcount([x[1] for x in v])
    P(f"| {inp} | {N} | {'holds' if N < s1first[inp] else 'fails'} | {d['tot']} | {d['off']} | {d['n_off_windows']} | {(str(p) + '/' + str(f) + ' (' + ('%.0f' % (v[-1][0] + 50)) + ')') if v else '-'} |")

P('\n### 4.5 Torus translates (TR)\n')
P('**AFE, matched windows, certified.** For each N: 30 random torus points (independent uniform phases for all p <= N), 11 points on the line phi_2 = 2 pi k/12, and the single flips phi_p = pi.\n')
P('| N | random: real-rooted / run | random: mean off-line zeros | line phi_2: real-rooted / run | diagonal verdict |')
P('|---|---|---|---|---|')
tr = collections.defaultdict(lambda: collections.defaultdict(list))
for d in ex:
    t, r = d['task'], d['result']
    if t['kind'] == 'win' and t['scheme'] == 'afe' and t.get('phi'):
        tr[t['size']][re.sub(r'\d+$', '', t.get('tag', ''))].append((r['verdict'], 2 * (r.get('n_up') or 0)))
diag = {x[0]: x[1] for x in m['zeta']}
for N in sorted(tr):
    a = tr[N]['rand']; b = tr[N]['line']
    if not a: continue
    P(f"| {N} | {sum(1 for x in a if x[0] == 'PASS')}/{len(a)} | {sum(x[1] for x in a) / len(a):.1f} | {sum(1 for x in b if x[0] == 'PASS')}/{len(b)} | {diag.get(N, '?')} |")
P('\n**AFE, matched windows, GPU screen** (60 random torus points per N; 24 points on the line phi_2):\n')
P('| N | diagonal off/tot | random: fraction real-rooted | random: mean off / mean tot | line phi_2 = 2 pi k/24, off-line zeros for k = 0..23 |')
P('|---|---|---|---|---|')
for d in load('results/big_translate.jsonl'):
    N = int(d['key'].split('|')[2])
    if N in (2, 3, 4, 5, 6, 8, 10, 15, 20, 25, 30, 35, 40):
        P(f"| {N} | {d['diag'][3]}/{d['diag'][1]} | {d['frac_random_real_rooted']:.2f} | {d['mean_off_random']:.1f}/{d['mean_tot_random']:.1f} | {' '.join(str(x[3]) for x in d['line2'])} |")
P('\n**Near the diagonal, GPU screen** (off-line zeros in the matched window; phi_2 = e, phi_3 = e, and the time shift phi_p = e log p, i.e. Dirichlet part at t + e with the gamma phase at t):\n')
for d in load('results/big_near.jsonl'):
    N = d['key'].split('|')[2]; tot = d['rows'][0]['phi2'][0]
    P(f"- N = {N} ({tot} zeros): " + '; '.join(f"e={r['e']}: {r['phi2'][1]}/{r['phi3'][1]}/{r['shift'][1]}" for r in d['rows']))
P('\n**Euler K = 1 sections of zeta, 20-40 random torus points per P, certified windows of length 50** (T2 predicts PASS for every translate once the window lies above t*):\n')
P('| P | t* | windows below t*: PASS/FAIL | windows entirely above t*: PASS/FAIL/UNRES |')
P('|---|---|---|---|')
et = collections.defaultdict(list)
for d in ex:
    t, r = d['task'], d['result']
    if t['kind'] == 'win' and t['scheme'] == 'euler' and t.get('phi'):
        et[t['size']].append((t['T1'], r['verdict']))
for Pp in sorted(et):
    ts = th[f'zeta|P{Pp}|K1|X0.5']
    lo = [x[1] for x in et[Pp] if x[0] < ts]; hi = [x[1] for x in et[Pp] if x[0] >= ts]
    P(f"| {Pp} | {ts:.4g} | {vcount(lo)[0]}/{vcount(lo)[1]} | {vcount(hi)[0]}/{vcount(hi)[1]}/{vcount(hi)[2]} |")

P('\n### 4.6 Q(x0): zeros of the sharp main sum right of 1/2 + x0 in the matched window (certified argument principle)\n')
P('Mean number of zeros of D_N with Re s > 1/2 + x0 per matched window, by range of N. "zeta+rand" = 10-20 random torus translates of the zeta main sum.\n')
dw = collections.defaultdict(lambda: collections.defaultdict(dict))
for d in ex:
    t, r = d['task'], d['result']
    if t['kind'] != 'dwin' or 'n_right' not in r: continue
    who = t['inp'] + ('+rand' if t.get('phi') else '')
    dw[who][t['x0']].setdefault(t['size'], []).append(r['n_right'])
bins = ((1, 5), (6, 10), (11, 20), (21, 40), (41, 70), (71, 100))
P('| input | x0 | N run | first N with a zero | ' + ' | '.join(f'N {a}-{b}' for a, b in bins) + ' |')
P('|---|---|---|---|' + '---|' * len(bins))
for who in ('zeta', 'zeta+rand', 'tw2m', 'liou', 'tw2h', 'dh'):
    for x0 in sorted(dw[who]):
        r = dw[who][x0]; Ns = sorted(r)
        first = next((n for n in Ns if max(r[n]) > 0), None)
        cells = []
        for lo, hi in bins:
            sel = [n for n in Ns if lo <= n <= hi]
            cells.append('%.2f' % (sum(sum(r[n]) / len(r[n]) for n in sel) / len(sel)) if sel else '-')
        P(f"| {who} | {x0} | {Ns[0]}..{Ns[-1]} ({len(Ns)}) | {first} | " + ' | '.join(cells) + ' |')

P('\n### 4.7 Theta form (b)\n')
P('Zeros in the window (30 units of t, |Re s - 1/2| < 1): "total/real". Totals are point-sampled windings at 256-700 bits (not interval-certified); the real counts are certified sign changes. `true` rows are fully certified windows for the functions themselves (N = oo).\n')
tw = collections.defaultdict(dict)
for d in ex:
    t, r = d['task'], d['result']
    if t['kind'] != 'winpt' or 'n_tot' not in r: continue
    tag = (t.get('tag') or 'diag'); tagc = 'rand' if tag.startswith('rand') else (tag if tag.startswith('near') else ('line2' if tag == 'line2' else 'diag'))
    tw[(t['inp'], t['size'], tagc)].setdefault(round(t['T1']), []).append((r['n_tot'], r['n_real']))
T1s = sorted({T for r in tw.values() for T in r})
P('| input | N | point | ' + ' | '.join(f't from {T}' for T in T1s) + ' |')
P('|---|---|---|' + '---|' * len(T1s))
for k in sorted(tw, key=lambda k: (k[0], k[2], k[1])):
    r = tw[k]; cells = []
    for T in T1s:
        if T not in r: cells.append('')
        elif len(r[T]) == 1: cells.append('%d/%d' % r[T][0])
        else: cells.append('mean %.1f/%.1f (n=%d)' % (sum(x[0] for x in r[T]) / len(r[T]), sum(x[1] for x in r[T]) / len(r[T]), len(r[T])))
    P(f"| {k[0]} | {k[1]} | {k[2]} | " + ' | '.join(cells) + ' |')
tv = collections.defaultdict(list)
for d in ex:
    t, r = d['task'], d['result']
    if t['kind'] == 'win' and t['scheme'] == 'true':
        tv[t['inp']].append((t['T1'], r['verdict'], r.get('n_tot', 0), r.get('n_up', 0)))
P('')
for inp in tv:
    v = sorted(tv[inp]); p, f, u = vcount([x[1] for x in v]); fl = [x[0] for x in v if x[1] == 'FAIL']
    P(f"- `true` {inp}: {len(v)} certified windows of length 50 up to t = {v[-1][0] + 50:.0f}: PASS {p}, FAIL {f}, UNRES {u}; zeros {sum(x[2] or 0 for x in v)}, off-line {sum(2 * (x[3] or 0) for x in v)}; first FAIL window starts at {fl[0] if fl else '-'}.")

P('\n### 4.8 Circle property C, multi-affine symmetrisation MA, witnesses, cross-checks\n')
ci = json.load(open('results/circ.json'))
P('**C** (numpy roots, 3000 random torus points per variable; fraction of points at which all zeros in w_q are on the circle). Prediction for a K = 1 product: 1 - (2/pi) arccos(eps_q q^{-1/2}) = 0.5, 0.392, 0.295, 0.247, 0.195, 0.179 for q = 2, 3, 5, 7, 11, 13.\n')
P('| object | ' + ' | '.join(f'w_{q}' for q in (2, 3, 5, 7, 11, 13)) + ' |')
P('|---|' + '---|' * 6)
for k in ('euler|zeta|P13|K1', 'euler|tw2m|P13|K1', 'euler|tw2h|P13|K1', 'euler|dh|P13|K1', 'afe|zeta|N2', 'afe|zeta|N6', 'afe|zeta|N20', 'afe|dh|N6', 'afe|dh|N20'):
    P(f"| {k.replace('|', ' ')} | " + ' | '.join(('%.3f' % ci[k][str(q)]) if str(q) in ci[k] else '' for q in (2, 3, 5, 7, 11, 13)) + ' |')
po = json.load(open('results/polar.json'))
P('\n**MA** (float64 search, 3000 starts each): object: zero in the polydisc before / after polarisation (variables after):\n')
P('; '.join(f"{k}: {'zero' if v['orig_zero'] else 'none'} / {'zero' if v['pol_zero'] else 'none'} ({v['pol_vars']})" for k, v in po.items()) + '.')
wi = json.load(open('results/witness.json'))
P('\n**Witnesses** (mpmath, 30 digits, residual |F|/|G| below 1e-29): explicit off-line zeros behind four certified FAIL verdicts:\n')
for k, v in wi.items():
    P(f"- {k}: " + '; '.join(f"{a} + {b} i" for a, b, c in v))
P('\n**Cross-checks.** (i) GPU float counts against certified counts on identical windows (`xcheck.py`): 309 matched windows and 132 translate windows, identical (total, on-line) counts in all. (ii) T3: the translate phi_2 = pi of the zeta Euler P = 5 section and the tw2m section give the same certified counts (n_up = 1, n_tot = 18, n_real = 16 on 3.0137 < t < 53.0137). (iii) T5 (`dh_phase.py`): x_sup(P) from the closed form 0.153042 (P = 7), 0.269668 (13), 0.377424 (23), 0.433974 (47) against the GPU search, which gives lower bounds, 0.1530, 0.2681, 0.3714 and 0.3823 (the last with only 915 starts in 14 variables); all primes: 1/2 + x_sup = 1.12036249. (iv) Self-test of `bl.py` against mpmath: |F_float - F_mp| < 2e-14 at three points; DH poly against the product form: 7e-16.')
