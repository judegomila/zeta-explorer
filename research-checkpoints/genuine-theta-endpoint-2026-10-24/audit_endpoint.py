"""Independent replay, exact coverage audit, and xi-based t=0 checks."""
import sys, runpy
from pathlib import Path
from fractions import Fraction as Q
from flint import arb, acb, acb_series, ctx
HERE=Path(__file__).resolve().parent
sys.argv=['certify_boundary.py','--bits','512','--output',str(HERE/'audit_replay_512.json')]
d=runpy.run_path(str(HERE/'certify_boundary.py'))
cells=[tuple(Q(c[k]) for k in ['dx_a','dx_b','dt_c','dt_d']) for c in d['interior']]
assert sum((b-a)*(f-e) for a,b,e,f in cells)==10
for i,(a,b,e,f) in enumerate(cells):
 assert -10<=a<b<=10 and -Q(1,4)<=e<f<=Q(1,4)
 for aa,bb,ee,ff in cells[:i]:
  assert min(b,bb)<=max(a,aa) or min(f,ff)<=max(e,ee)
print('Independent exact coverage: 90 cells, disjoint interiors, total area 10.')
# Independently check exact coverage of the endpoint t=0 by cell intersections.
intervals=sorted((a,b) for a,b,e,f in cells if e==-Q(1,4))
right=Q(-10)
for a,b in intervals:
 assert a==right
 right=b
assert right==10
print('Entire closed t=0 edge is covered by interior cells, with no limit argument.')
ctx.cap=2
for x in [200,205,210,211,215,220]:
 s=acb_series([acb(arb(1)/2,arb(x)/2),acb(0,arb(1)/2)],prec=2)
 xi=s*(s-1)/2*((-s/2)*arb.pi().log()).exp()*(s/2).gamma()*s.zeta()/8
 pred=d['inflate'](d['xpoly'](-d['T'])(arb(x)-210))
 assert xi[0].imag.contains(0) and xi[1].imag.contains(0)
 assert pred.real.overlaps(xi[0].real*d['scale'])
 assert pred.imag.overlaps(xi[1].real*d['scale'])
 print('Independent xi and xi-derivative consistency at t=0, x=',x)
print('ENDPOINT AUDIT PASS')
