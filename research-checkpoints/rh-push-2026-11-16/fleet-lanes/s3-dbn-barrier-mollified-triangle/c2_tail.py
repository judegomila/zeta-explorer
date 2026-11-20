"""Combination 2, second part. One-cutoff reduction: the triangle functional with the fixed tail mollifier of TAIL_LEMMA.md (support
{1,2,3,4,5,6,7,10,11,13,14}) at N >= N* = 3,840,000, coefficient 1 replaced by a_F(n). Contraction D_F(N) = g + sum_{n>=2}(|b| + g|a0|) n^-sigma
(must be < 1) and its monotonicity in N; for completely multiplicative F the table is twisted by a_F(d)."""
import sys, json, math
from lib import *
LAM = {1: 1.0, 2: -1.021, 3: -1.054, 4: -0.045, 5: -1.119, 6: 1.001, 7: -1.043, 10: 1.024, 11: -0.805, 13: -0.894, 14: 0.912746}
D = 60060
Ns = [3840000, 4050000, 5000000, 7000000, 10000000, 15000000, 20000000]
if len(sys.argv) > 1: Ns = [N for N in Ns if N <= int(float(sys.argv[1]))]
NMAX = max(Ns); out = []
announce('about 16 float64/complex128[%d]' % NMAX, 16 * 16 * NMAX)
def tw(nm, d):
    if d == 1: return 1.0
    v = 1.0
    for p, e in factor(d).items(): v = v * a_prime(nm, p) ** e
    return v
for nm in ('ZETA', 'SGN', 'LCHI5', 'CHIM3', 'CHIM4', 'DH/table', 'DH/none', 'TNR/table', 'EA/table', 'SGN/table'):
    base = nm.split('/')[0]
    if '/' not in nm: lam = {d: v * tw(base, d) for d, v in LAM.items()}; lam = {d: v for d, v in lam.items() if v != 0}
    elif nm.endswith('none'): lam = {1: 1.0}
    else: lam = dict(LAM)
    tr = Tri(coefs(base, NMAX), D if len(lam) > 1 else 1, NMAX); rows = []
    for N in Ns:
        T, pr = tr.value(N, T0, Y0, lam, parts=True)
        rows.append(dict(N=N, T=T, contraction=pr['g'] + pr['S'], M=pr['M'], E=err_budget(N, T0, Y0)))
    Dv = [r['contraction'] for r in rows]
    o = dict(F=nm, rows=rows, contraction_below_1_at_Nstar=Dv[0] < 1, contraction_decreasing=all(b < a for a, b in zip(Dv, Dv[1:])), margin_increasing=all(b['T'] > a['T'] for a, b in zip(rows, rows[1:])))
    out.append(o); print(json.dumps(o), flush=True); del tr
json.dump(out, open('c2_tail.json', 'w'), indent=1); print('done')
