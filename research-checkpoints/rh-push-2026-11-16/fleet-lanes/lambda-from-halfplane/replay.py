# Fixed-mode replay of the F2 run (value (ii) of the paper) from a lower start q0' = (2 theta' - 1)^2 + 10^-7.
# Uses the dumped per-substep rates c_k unchanged.  Exact rational arithmetic, same enclosures as the consumer
# (degree-18 Taylor bound for exp(-x), upward rounding to 2^-96, degree-11 alternating log bound, ceil to 1e-15).
import gzip, json, math, sys
from fractions import Fraction as F
DUMP = '/Users/USER/Documents/GitHub/mathexplorer/tmp/qrh-tune-out/F2_final.steps.jsonl.gz'
KER = json.load(open('/Users/USER/Documents/GitHub/mathexplorer/tmp/oai-lambda-out/KERNELS_raymond_backup.json'))['rows']
QE = F(1, 10**8); DELTA = F(1, 512000)
def expminus(x):
    s = term = F(1)
    for j in range(1, 19): term *= -x / j; s += term
    return s
def ceilq(x, den):
    n = x.numerator * den; d = x.denominator
    return F(-((-n) // d), den)
rows = []
with gzip.open(DUMP, 'rt') as f:
    for line in f:
        i = line.index('"outq"') if '"outq"' in line else None
        d = json.loads(line)
        if d['lab'][0] == 'M': lam = F(d['multi']['lam']); h = F(d['multi']['h']); ell = F(d['multi']['ell'])
        else:
            lam = F(KER[d['opt']['ki']]['lambda']) if d['opt']['kind'] == 'cat' else None
            h = F(d['opt']['h']); ell = F(d['opt']['ell'])
        rows.append((F(d['q']), F(d['rate']), lam, h, ell))
print('substeps in dump', len(rows), ' lam missing', sum(1 for r in rows if r[2] is None))
def run(q0, qbound, scale=None, check=True):
    q = F(q0); ok_mono = True
    for k, (q_old, c, lam, h, ell) in enumerate(rows):
        if scale is not None: c = c * scale(k, lam)
        if check and not (q <= q_old): ok_mono = False
        if k == 0:
            s1 = q - (2 + c * q) * F(1, 10**8) - qbound
            assert s1 > 0, 'S1'
        assert 0 < c * DELTA < 1
        outq = (q + 2 / c) * expminus(c * DELTA) - 2 / c
        if outq <= QE:
            z = c * (q - QE) / (2 + c * QE); assert 0 < z < 1
            lag = sum(((-1)**(j + 1) * z**j / j for j in range(1, 12)), F(0)) / c
            assert 0 < lag <= DELTA
            U = ceilq(k * DELTA + lag + QE / 2, 10**15)
            return U, k, ok_mono, s1
        q = ceilq(outq, 2**96)
    return None, None, ok_mono, s1
th0 = F(7, 8); off = F(1, 10**7)
U0, k0, m0, s0 = run((2*th0-1)**2 + off, (2*th0-1)**2)
print('control theta=7/8: U =', U0, float(U0), 'terminal k', k0, 'monotone', m0, 'S1 margin', float(s0))
for ths in ['874886647/1000000000', '8748866/10000000', '87488665/100000000']:
    th = F(ths); qb = (2*th-1)**2
    U, k, m, s1 = run(qb + off, qb)
    print('theta =', ths, float(th), ' q_bound', float(qb), ' U =', U, '=', float(U), ' terminal k', k, ' q_k<=q_k(F2) all k:', m, ' S1 margin', float(s1))
    print('   U(7/8) - U =', float(U0 - U), '  slope dU/dtheta ~', float((U0-U)/(th0-th)))
# sensitivity: A = prod exp(-c_k delta) up to terminal
lg = sum(float(c)*float(DELTA) for (_, c, _, _, _) in rows)
print('int c dt =', lg, ' A = exp(-int c) =', math.exp(-lg), ' predicted dU/dq0 = A/2 =', math.exp(-lg)/2, ' dU/dtheta = 4(2theta-1)A/2 =', 3*math.exp(-lg)/2)
print('mean rate', lg/(len(rows)*float(DELTA)), ' c first/last', float(rows[0][1]), float(rows[-1][1]))
# models (float, NOT certified): uniformly scaled rates, and lambda -> 2
def fl(scalef):
    q = float((2*th0-1)**2 + off); dl = float(DELTA)
    for k, (_, c, lam, h, ell) in enumerate(rows):
        c = float(c) * scalef(k, lam); nq = (q + 2/c) * math.exp(-c*dl) - 2/c
        if nq <= 1e-8: return k*dl + math.log(1 + c*(q-1e-8)/(2+c*1e-8))/c + 5e-9
        q = nq
    return None
print('model control (scale 1):', fl(lambda k, lam: 1.0))
for s in [1.04, 1.086, 1.134, 1.21, 1.5, 2.0, 3.0]:
    print('model: all rates x %.3f -> %.6f' % (s, fl(lambda k, lam: s)))
print('model: lambda -> 2 on the selected floors (caps unchanged):', fl(lambda k, lam: float(2/lam) if lam else 2/1.99))
hs = [float(r[3]) for r in rows]; print('h range', min(hs), max(hs), ' rho=y/h at start', math.sqrt(float(rows[0][0]))/hs[0])
import statistics
for kk in [0, 10000, 20000, 30000, 40000, 50000, 59000]:
    q, c, lam, h, ell = rows[kk]; y = math.sqrt(float(q))
    print('k=%d t=%.5f y=%.4f h=%.3f rho=%.3f ell=%.4f lam=%s c=%.3f pull c*y=%.3f  (mean-field 4*pi*D=26.89)' % (kk, kk*float(DELTA), y, float(h), y/float(h), float(ell), float(lam) if lam else None, float(c), float(c)*y))
