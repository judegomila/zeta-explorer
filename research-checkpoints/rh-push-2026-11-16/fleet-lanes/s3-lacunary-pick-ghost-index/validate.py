"""Validation on cases with known answers."""
import sys, math, mpmath as mp
from flint import acb, arb, ctx
import lib
ctx.prec = 400; mp.mp.prec = 400
def _m(x): return mp.mpf(x.mid().str(110, radius=False))
def tomp(x): return _m(x) if isinstance(x, arb) else mp.mpc(_m(x.real), _m(x.imag))
ok = True
# 1. functional equation F(w) = F(-w), and DH zero at 0.3085 + 85.699i
for code in ['ZETA', 'DH', 'LCHI4', 'LCHI5', 'EA-1/4', 'TNR', 'PL:ZETA:0.3:50']:
    o = lib.get(code); w = acb('0.37', '11.3')
    r = abs(lib.val(o, w) / lib.val(o, -w) - 1)
    print('FE', code, float(r.upper())); ok &= float(r.upper()) < 1e-60
ctx.prec = 128
o = lib.get('HEAT-0.5'); w = acb('0.37', '11.3'); r = abs(lib.val(o, w) / lib.val(o, -w) - 1); print('FE HEAT-0.5', float(r.mid())); ok &= float(r.mid()) < 1e-25
# heat off-line zero (battery table): 0.24295650648697380586 + 111.69422767246391911623 i
r = abs(lib.val(o, acb('0.24295650648697380586', '111.69422767246391911623'))) / abs(lib.val(o, acb('0.24295650648697380586', '111.2')))
print('HEAT-0.5 |F(zero)|/|F(nearby)|', float(r.mid())); ok &= float(r.mid()) < 1e-15
ctx.prec = 400
dh = lib.get('DH'); z = acb('0.30851718245663738555335196060684', '85.699348485377592171929267708942')
r = abs(lib.val(dh, z)) / abs(lib.val(dh, z + 1)); print('DH zero rel', float(r.mid())); ok &= float(r.mid()) < 1e-25
tn = lib.get('TNR'); z = acb(tn.delta(), math.pi / math.log(3)); r = abs(lib.val(tn, z)) / abs(lib.val(tn, z + 1)); print('TNR zero rel', float(r.mid()), 'delta', tn.delta()); ok &= float(r.mid()) < 1e-12
# 2. known float margins of route 13 / b-lacunary-threshold: lambda_min of normalised Pick matrix, xi: 6.7e-4 (4^k,K=7), 3.9e-9 (2^k,K=14), 1.1e-21 (2^{k/2},K=24); DH: 1.1e-2, 4.8e-6, 6.0e-15
def dense(code, nodes):
    o = lib.get(code); c = [lib.logder(o, x).real for x in nodes]
    n = len(nodes); cm = [tomp(x) for x in c]; nm = [tomp(x) for x in nodes]
    M = mp.matrix(n, n)
    for i in range(n):
        for j in range(n):
            M[i, j] = (cm[i] + cm[j]) / (nm[i] + nm[j]) * mp.sqrt(nm[i] * nm[j] / (cm[i] * cm[j]))
    ev = mp.eigsy(M, eigvals_only=True)
    piv = lib.schur_real(nodes, c, stop_at_negative=False)
    # det check: product of pivots (unnormalised) against det
    return min(ev), piv, sum(1 for e in ev if e < 0)
for q, K, exp_xi, exp_dh in ((4, 7, 6.7e-4, 1.1e-2), (2, 14, 3.9e-9, 4.8e-6), (arb(2).sqrt(), 24, 1.1e-21, 6.0e-15)):
    nodes = [arb(q) ** k for k in range(K + 1)]
    for code, ex in (('ZETA', exp_xi), ('DH', exp_dh)):
        lm, piv, nneg = dense(code, nodes)
        s = lib.summarize(piv, len(nodes))
        print('margin', code, 'q', float(arb(q).mid()), 'K', K, 'lambda_min', mp.nstr(lm, 4), 'expected', ex, 'negatives schur', s['negatives'], 'dense', nneg, 'min log2 piv', s['min_log2_pivot'])
        ok &= abs(float(lm) / ex - 1) < 0.1 and s['negatives'] == nneg == 0
# 3. inertia: planted quadruple, Schur-recursion negative count against dense eigenvalues (real nodes and complex nodes)
import random
random.seed(1)
for code, a in (('PL:ZETA:0.3:20', '0.1'), ('ZETA', '0.1'), ('TNR', '0.1'), ('EA-1/4', '0.1'), ('DH', '0.1')):
    o = lib.get(code)
    w = [acb(random.uniform(0.1, 2), random.uniform(-30, 30)) for _ in range(40)]
    if code == 'DH': w = [acb(random.uniform(0.1, 2), random.uniform(70, 100)) for _ in range(40)]
    R = [lib.ratio(o, x, a) for x in w]
    piv = lib.schur_cplx(w, [(acb(1), r) for r in R])
    n = len(w); M = mp.matrix(n, n)
    for i in range(n):
        for j in range(n):
            M[i, j] = (1 - tomp(R[i]) * mp.conj(tomp(R[j]))) / (tomp(w[i]) + mp.conj(tomp(w[j])))
    ev = mp.eigh(M, eigvals_only=True); nneg = sum(1 for e in ev if e < 0)
    s = lib.summarize(piv, n)
    print('index', code, 'a', a, 'schur negatives', s['negatives'], 'dense negatives', nneg, 'undecided', s['undecided_at'], 'min|ev|', mp.nstr(min(abs(e) for e in ev), 3))
    ok &= s['negatives'] == nneg and s['undecided_at'] is None
    # Caratheodory Pick of L on the same nodes
    L = [lib.logder(o, x) for x in w]
    piv = lib.schur_cplx(w, [(l + 1, l - 1) for l in L])
    for i in range(n):
        for j in range(n):
            M[i, j] = (tomp(L[i]) + mp.conj(tomp(L[j]))) / (tomp(w[i]) + mp.conj(tomp(w[j])))
    ev = mp.eigh(M, eigvals_only=True); nneg2 = sum(1 for e in ev if e < 0); s = lib.summarize(piv, n)
    print('   L-Pick', code, 'schur negatives', s['negatives'], 'dense', nneg2, 'undecided', s['undecided_at'])
    ok &= s['negatives'] == nneg2
print('VALIDATION', 'PASS' if ok else 'FAIL')
