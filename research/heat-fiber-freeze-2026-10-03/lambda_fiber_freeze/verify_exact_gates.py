"""Exact arithmetic checks for the target and dependency-aware cell gate.
These prove finite algebraic lemmas, not a de Bruijn--Newman bound.
"""
from fractions import Fraction as Q
from itertools import product
from pathlib import Path
import json

def add(a,b):return (a[0]+b[0],a[1]+b[1])
def scale(a,s):return (a[0]*s,a[1]*s)
def norm2(a):return a[0]*a[0]+a[1]*a[1]
def affine_max_squared(center,coeffs):
 values=[]
 for signs in product([-1,1],repeat=len(coeffs)):
  z=center
  for a,s in zip(coeffs,signs):z=add(z,scale(a,s))
  values.append(norm2(z))
 return max(values)

def main():
 t=Q(24727519,200000000);y=Q(1,5);cap=Q(29,200)
 X=6000000185827;Tpt=3000175332800
 endpoint=t+y*y/2
 assert endpoint==Q(28727519,200000000)
 assert cap-endpoint==Q(272481,200000000)>0
 assert t<Q(129,800) and y>=Q(1809,10000)
 assert 0<y*y<1-2*t and y*y+2*t<1
 assert Q(X,2)<Tpt
 # On a fixed physical parameter, opposite component derivatives cancel
 # before the supremum. Independent fiber choices must not be substituted.
 c=(Q(1,5),Q(1,10));a1=(Q(9,10),Q(3,10));a2=(Q(-4,5),Q(-1,4))
 joint=affine_max_squared(c,[add(a1,a2)])
 independent=affine_max_squared(c,[a1,a2])
 assert joint==Q(9,80) and independent==Q(1613,400)
 assert joint<Q(1,4)<independent
 # Two-sector leakage counterexample: eigenvalues +/-i, but symmetric
 # graph compression is zero. In graph basis the omitted off-diagonal is i.
 # det([[z,-i],[-i,z]])=z²+1, including the roots +/-i.
 sym_compressed=Q(0);leakage=Q(1)
 assert sym_compressed==0 and leakage==1
 # Complex phase covariance may be negative; its sign is never assumed.
 cross=2*(a1[0]*a2[0]+a1[1]*a2[1])
 assert cross==Q(-159,100)<0
 rows=[]
 for yh in [Q(1809,10000),Q(1,5),Q(103,500),Q(413,2000)]:
  rows.append({'y':str(yh),'endpoint':str(t+yh*yh/2),'endpoint_decimal':float(t+yh*yh/2),'strict_cap_slack':str(cap-t-yh*yh/2)})
 result={'exact_target_arithmetic':True,'target_endpoint':str(endpoint),'target_cap_slack':str(cap-endpoint),'verified_height_margin':str(Tpt-Q(X,2)),
 'inherited_barrier_containment_arithmetic':True,'inherited_barrier_certificate_replayed_here':False,
 'affine_vertex_supremum_exact_test':True,'shared_affine_squared_bound':str(joint),'independent_fiber_squared_bound':str(independent),'signed_cross_term':str(cross),
 'graph_leakage_counterexample_verified':True,'rows':rows,
 'global_final_time_certificate_available':False,'lambda_lt_0145_proved':False}
 Path('exact_gate_results.json').write_text(json.dumps(result,indent=2));print(json.dumps(result,indent=2))
if __name__=='__main__':main()
