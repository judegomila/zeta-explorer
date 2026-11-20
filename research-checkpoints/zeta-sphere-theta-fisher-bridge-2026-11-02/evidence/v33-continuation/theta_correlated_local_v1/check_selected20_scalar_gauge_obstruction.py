"""Owned falsification replay. No new degree or target integral.
Uses the previously reviewed full-theta selected20 checker as a frozen dependency.
"""
import runpy,hashlib,json,contextlib,io
from pathlib import Path
base=Path(__file__).parent
p=base/'check_selected20_canonical_obstruction.py'
assert hashlib.sha256(p.read_bytes()).hexdigest()=='3afa31f2a6e79789c355f35f0b1e95da963353ebfdd0ca112888d1a47acb1936'
with contextlib.redirect_stdout(io.StringIO()):ns=runpy.run_path(str(p))
f=ns['f'];dot=ns['dot'];c0=ns['c0'];g=ns['g'];N=ns['N'];dy=ns['dy'];cols=ns['cols'];bounds=ns['bounds']
half=dot(c0,g[N:])+dot(dy,[dot(col,g[N:]) for col in cols])
cross=f-half
assert f.upper()<0
assert half.upper()<0
assert cross.lower()>0
out={'status':'SCALAR_GAUGE_FAMILY_NEGATIVE','point':'u=14/25','shift':'normalized a=0','degree':20,'frozen_dependency_sha256':hashlib.sha256(p.read_bytes()).hexdigest(),'canonical_factor':bounds(f),'half_coefficient_factor':bounds(half),'actual_c_dot_z':bounds(cross),'directed_checks':{'f_upper_below_minus2697':bool(f.upper()<-2697),'half_upper_below_minus419835':bool(half.upper()<-419835),'cross_lower_above417138':bool(cross.lower()>417138)},'scope':'Every gauge v=theta*c, theta>=0, has f-2theta*c_dot_z<0 at this point. No negative optimized margin or target pivot claim; no target M20 integral read.'}
print(json.dumps(out,indent=2))
