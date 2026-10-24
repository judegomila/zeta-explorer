import sys,runpy,json
from fractions import Fraction
from pathlib import Path
HERE = Path(__file__).resolve().parent
from flint import arb,acb,ctx
sys.argv=['certify_boundary.py','--bits','512','--output',str(HERE / 'audit_replay_512.json')]
d=runpy.run_path(str(HERE / 'certify_boundary.py'))
cells=[tuple(Fraction(c[k]) for k in ['dx_a','dx_b','dt_c','dt_d']) for c in d['interior']]
area=sum((b-a)*(e-c) for a,b,c,e in cells)
assert area==Fraction(8,3),area
for i,(a,b,c,e) in enumerate(cells):
 assert -10<=a<b<=10 and Fraction(-1,15)<=c<e<=Fraction(1,15)
 for f,g,h,j in cells[i+1:]:
  assert min(b,g)<=max(a,f) or min(e,j)<=max(c,h)
print('INDEPENDENT exact-rational coverage:',len(cells),'disjoint interiors, full area 8/3 within domain.')
# Independent high-precision actual integrals: eight theta terms, integrate to 1.1.
pi=arb.pi()
def direct(t,x,m):
 def f(u,a):
  p=sum((2*pi*pi*n**4*(9*u).exp()-3*pi*n*n*(5*u).exp())*(-pi*n*n*(4*u).exp()).exp() for n in range(1,9))
  return (t*u*u).exp()*p*((x*u).cos() if m==0 else -u*(x*u).sin())
 return acb.integral(f,0,arb(11)/10,abs_tol=arb('1e-100'),rel_tol=arb('1e-90'),eval_limit=200000,depth_limit=40).real
for tr,x in [(Fraction(1,5),200),(Fraction(1,3),220),(Fraction(4,15),210),(Fraction(1,4),211),(Fraction(3,10),205)]:
 t=arb(tr.numerator)/tr.denominator;dx=arb(x)-210;dt=t-d['t0']
 pred=d['inflate'](d['xpoly'](dt)(dx))
 vals=[direct(t,arb(x),m)*d['scale'] for m in [0,1]]
 assert pred.real.overlaps(vals[0]) and pred.imag.overlaps(vals[1])
 print('Independent extended-integral consistency',str(tr),x)
print('AUDIT PASS')
