"""Owned two-point falsification; only the evaluation point changes in frozen checker."""
import hashlib,json,contextlib,io
from pathlib import Path
base=Path(__file__).parent;p=base/'check_selected20_canonical_obstruction.py'
src=p.read_text();sha=hashlib.sha256(p.read_bytes()).hexdigest()
assert sha=='3afa31f2a6e79789c355f35f0b1e95da963353ebfdd0ca112888d1a47acb1936'
assert src.count('u=arb(14)/25;')==1
results=[]
for num,den in [(11,25),(27,50)]:
 changed=src.replace('u=arb(14)/25;',f'u=arb({num})/{den};')
 ns={'__file__':str(p)}
 with contextlib.redirect_stdout(io.StringIO()):exec(compile(changed,str(p),'exec'),ns)
 f=ns['f'];dot=ns['dot'];g=ns['g'];N=ns['N']
 half=dot(ns['c0'],g[N:])+dot(ns['dy'],[dot(col,g[N:]) for col in ns['cols']])
 cross=f-half;ratio=f/(2*cross);z0=dot(ns['c0'],g)+dot(ns['dy'],[dot(col,g) for col in ns['cols']]);results.append((f,cross,ratio,z0))
f1,h1,r1,z01=results[0];f2,h2,r2,z02=results[1];arb=ns['arb'];bounds=ns['bounds']
assert h1.upper()<0 and h2.lower()>0
assert r1.lower()>-arb(1)/5000 and r2.upper()<-arb(1)/200
weight=h2/(h2-h1);objective=weight*f1+(1-weight)*f2
assert weight.lower()>0 and weight.upper()<1 and objective.upper()<0
uncancelled=weight*z01+(1-weight)*z02
assert not uncancelled.contains(0)
print(json.dumps({'status':'ALL_REAL_SCALAR_GAUGES_FAIL','dependency_sha256':sha,'point1':'11/25','point2':'27/50','theta_lower_requirement':bounds(r1),'theta_upper_requirement':bounds(r2),'point1_cross':bounds(h1),'point2_cross':bounds(h2),'point1_factor':bounds(f1),'point2_factor':bounds(f2),'point1_weight':bounds(weight),'projected_dual_objective':bounds(objective),'uncancelled_first_cross_component':bounds(uncancelled),'scope':'Two exact points forbid every real v=theta*c for the actual selected degree20 residual. The two-atom witness cancels only scalar c_dot_z, NOT the full N-component z; no negative optimized margin or target claim.'},indent=2))
