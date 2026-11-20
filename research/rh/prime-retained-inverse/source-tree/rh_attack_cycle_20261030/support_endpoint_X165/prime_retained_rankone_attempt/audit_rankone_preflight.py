#!/usr/bin/env python3
"""Exact rational fast forward/transpose action and source-pin preflight audit."""
import ast
import hashlib
import json
from fractions import Fraction as Q
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[2]
BUILDER = HERE/'retained_prime_rankone_inputs.py'
DRIVER = HERE/'certify_prime_retained_rankone.py'
SMALL = HERE/'PRIME_RETAINED_RANKONE_SMALL_GATE.json'
HELPER = HERE.parent/'near_tail_inverse_repair/audit_prime_retained_inverse.py'
def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()
before = {str(p.relative_to(ROOT)):sha(p) for p in [BUILDER,DRIVER,SMALL,HELPER,Path(__file__).resolve()]}
r = json.loads(SMALL.read_text())
assert r['source_sha256_before'] == r['source_sha256_after']
for p,h in r['source_sha256_before'].items():
    assert sha(ROOT/p) == h,p
assert r['status']=='PASS' and r['dimension']==33
assert all(r[k]['pass_positive'] for k in ['core','coefficient_H','whitened_Schur'])
assert r['dense_checks']['all_direct_dense_and_rank6_entries_overlap']
assert r['dense_checks']['permuted_repaired_core_pivots_overlap']

env={'Q':Q,'arb':Q}
tree=ast.parse(HELPER.read_text())
defs=[n for n in tree.body if isinstance(n,ast.ClassDef) and n.name=='ExactPoly']
exec(compile(ast.Module(body=defs,type_ignores=[]),str(HELPER),'exec'),env)
env['arb_poly']=env['ExactPoly']
tree=ast.parse(BUILDER.read_text())
defs=[n for n in tree.body if isinstance(n,ast.FunctionDef) and n.name=='cauchy_action']
exec(compile(ast.Module(body=defs,type_ignores=[]),str(BUILDER),'exec'),env)
cauchy=env['cauchy_action']
checks=[]
for N,J in [(1,3),(3,8),(7,17),(16,41)]:
    n=N+1
    # A free rational s tests the algebraic normalization in place of sqrt(2).
    # Both paths use the same s; no irrational arithmetic is needed for identities.
    s=Q(7,5)
    aa=[Q(1)]+[s*(-1)**k for k in range(1,n)]
    v=[Q((-1)**k*(k+1),2*k+3) for k in range(n)]
    t=[Q(0)]+[Q(j*(2-j),j+3) for j in range(1,J+1)]
    ds={j:Q(j+2,j+1) for j in range(N+1,J+1)}
    av=[aa[k]*v[k] for k in range(n)]
    seed=av[1:]+[Q(0)]*(J-N)
    h=cauchy(seed,1)
    ht=cauchy([seed[j-1]*t[j] for j in range(1,J+1)],1)
    x=[s*(t[j]*(v[0]/(j*j)+h[j-1])-ht[j-1])/ds[j] for j in range(N+1,J+1)]
    Y=[[s*aa[k]*(t[j]-t[k])/((j*j-k*k)*ds[j]) for k in range(n)]
       for j in range(N+1,J+1)]
    assert x==[sum((row[k]*v[k] for k in range(n)),Q(0)) for row in Y]
    bp=[Q((-1)**i*(i+1),i+3) for i in range(J-N)]
    tp=[(N+1+i)*bp[i] for i in range(J-N)]
    diag=[Q(i-3,i+2) for i in range(J-N)]
    hx=cauchy(x,N+1)
    htx=cauchy([tp[i]*x[i] for i in range(J-N)],N+1)
    bx=[(100+diag[i])*x[i]+2*(tp[i]*hx[i]-htx[i]) for i in range(J-N)]
    B=[[100+diag[i] if i==k else 2*(tp[i]-tp[k])/((N+1+i)**2-(N+1+k)**2)
        for k in range(J-N)] for i in range(J-N)]
    assert bx==[sum((row[k]*x[k] for k in range(J-N)),Q(0)) for row in B]
    ss=[Q(0)]*N+[bx[i]/ds[N+1+i] for i in range(J-N)]
    hss=cauchy(ss,1)
    htss=cauchy([ss[j-1]*t[j] for j in range(1,J+1)],1)
    e=[s*sum((ss[j-1]*t[j]/(j*j) for j in range(N+1,J+1)),Q(0))]
    e += [s*aa[k]*(t[k]*hss[k-1]-htss[k-1]) for k in range(1,n)]
    assert e==[sum((Y[i][k]*bx[i] for i in range(J-N)),Q(0)) for k in range(n)]
    E0=sum((x[i]*bx[i] for i in range(J-N)),Q(0))
    assert sum((e[k]*v[k] for k in range(n)),Q(0))==E0
    for i in range(n):
        for k in range(i):
            assert ((i*i*e[i])*e[k]-e[i]*(k*k*e[k]))/(i*i-k*k)==e[i]*e[k]
    checks.append({'N':N,'J':J,'forward_rows':J-N,'prime_action_rows':J-N,
                   'transpose_columns':n,'exact_energy_identity':True,'exact_wedge_identity':True})

after={p:sha(ROOT/p) for p in before}
assert before==after
out={'status':'PASS_ANALYTIC_SOURCE_AND_EXACT_SYNTHETIC_PREFLIGHT',
     'small_gate_pinned_pass_verified':True,'exact_synthetic_checks':checks,
     'source_sha256_before':before,'source_sha256_after':after,
     'full_producer_run_by_auditor':False,'endpoint_accepted':False,
     'scope':'Clearance of the displayed rank-one lower comparison and implementation for one parent-authorized full gate. A full PASS and independent isolated full replay are still required.'}
(HERE/'RANKONE_PREFLIGHT_INDEPENDENT_AUDIT.json').write_text(json.dumps(out,indent=2)+'\n')
print(json.dumps(out,indent=2))
