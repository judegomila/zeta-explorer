# Single-height variant of a dumped run: in every cell where the dump uses more than one probe height, one of the modes used
# in that cell is applied on all 128 substeps (variant 'first': the mode of the first substep of the cell extended forward;
# variant 'last': the mode of the last substep extended backward).  All other substeps keep the dumped mode.  Because q may now
# lie above the dumped q_k, nothing is inherited by monotonicity: C1 (v <= rho^2, r h < 2), C2 (cap >= sup s_r on [0, v], exact),
# c > 0, 0 < c delta < 1, S1 and the terminal conditions are checked at the actual q of the variant on every substep.
# usage: single_height.py DUMP(.gz) OUT.json TH1,TH2,...
import sys, json, gzip, collections
from fractions import Fraction as F
sys.argv_saved = sys.argv; 
T = '/Users/USER/Documents/GitHub/mathexplorer/tmp/'
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
path, out, ths = sys.argv[1:4]
modes = []
op = gzip.open if path.endswith('.gz') else open
with op(path, 'rt') as f:
    for line in f:
        d = json.loads(line)
        if d['lab'][0] == 'M':
            m = d['multi']; ch = m['choice'][0]; assert len(m['choice']) == 1
            modes.append((F(ch['r']), F(ch['lam']), F(ch['rho']), F(m['h']), F(m['ell']), F(m['cap']), m['mid']))
        else:
            o = d['opt']; assert o['kind'] == 'cat'; k = CAT[o['ki']]
            modes.append((F(k['r']), F(k['lambda']), F(k['rho']), F(o['h']), F(o['ell']), F(o['cap']), 'cat:' + d['set']))
ncell = (len(modes) + 127) // 128
hs = collections.defaultdict(set)
for k, m in enumerate(modes): hs[k // 128].add(m[3])
multi = sorted(i for i in hs if len(hs[i]) > 1)
def variant(which):
    ms = list(modes)
    for i in multi:
        lo, hi = 128 * i, min(128 * i + 128, len(modes))
        src = ms[lo] if which == 'first' else ms[hi - 1]
        for k in range(lo, hi): ms[k] = src
    return ms
def run(ms, theta):
    th = F(theta); qb = (2 * th - 1)**2; q = qb + F(1, 10**7); fails = collections.Counter(); k = 0; minadm = None
    while True:
        if k < len(ms): m = ms[k]
        else:
            m = ms[-1]
            if k // 128 != (len(ms) - 1) // 128: return dict(theta=theta, U=None, note='ran past the last cell of the dump')
        r, lam, rho, h, ell, cap, _ = m; v = q / (h * h)
        if not (v <= rho * rho): fails['C1-rho'] += 1
        if not (r * h < 2): fails['C1-rh'] += 1
        if not cap_ok(r, v, cap):
            # cap recomputed at the variant's own v by the exact sup rule (3a < 1 rows only: sup = s_r(v) before the peak)
            a = r * r; u = 1 + a - v
            if 3 * a < 1 and u * u >= 4 * a * (1 + a):
                cap = 2 * u / (u * u + 4 * a * v); fails['note:cap-recomputed'] += 1
            if not cap_ok(r, v, cap): fails['C2-cap'] += 1
        c = 2 * lam / h * (ell - cap / h)
        if not (c > 0 and 0 < c * DELTA < 1): fails['R-range'] += 1
        adm = rho * rho - v; minadm = adm if minadm is None or adm < minadm else minadm
        if k == 0:
            s1 = q - (2 + c * q) * F(1, 10**8) - qb
            if not s1 > 0: fails['S1'] += 1
        outq = (q + 2 / c) * em(c * DELTA) - 2 / c
        if outq <= QE:
            z = c * (q - QE) / (2 + c * QE); lag = sum(((-1)**(j + 1) * z**j / j for j in range(1, 12)), F(0)) / c
            if not (0 < z < 1 and 0 < lag <= DELTA): fails['terminal'] += 1
            U = up(k * DELTA + lag + QE / 2, 10**15)
            if not U < F(41, 250): fails['horizon'] += 1
            return dict(theta=theta, U=str(U), U_float=float(U), terminal_k=k, fails=dict(fails), S1_margin=float(s1), min_admissibility_margin=float(minadm))
        q = up(outq, 2**96); k += 1
res = dict(dump=path, multi_height_cells={i: sorted(map(str, hs[i])) for i in multi}, runs=[])
for which in (['first', 'last'] if multi else ['asdumped']):
    ms = variant(which) if multi else modes
    for i in multi: res.setdefault('mode_used', {})[f'{which}:{i}'] = [str(x) for x in ms[128 * i]]
    for th in ths.split(','):
        r = run(ms, th); r['variant'] = which; res['runs'].append(r); print(json.dumps(r), flush=True)
json.dump(res, open(out, 'w'), indent=1)
