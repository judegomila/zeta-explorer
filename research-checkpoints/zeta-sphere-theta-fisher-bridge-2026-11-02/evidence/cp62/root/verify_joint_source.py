#!/usr/bin/env python3
"""Original rational CP62 controls, not an imported theta/Arb producer."""
from fractions import Fraction as Q
from math import factorial
from pathlib import Path
import json

rows=[]
def check(name,test):
    assert test,name
    rows.append({'name':name,'pass':True})

check('e3_lower_partial8',sum(Q(3**k,factorial(k)) for k in range(9))>20)
check('theta_prefactor352',8*(2*4**2+3*4)==352)
check('gaussian_constant18',Q(352,20)<18)
check('series_ratio16expminus9',Q(16,20**3)<Q(1,2))
check('heat_alpha47over4',12-Q(1,2)/2==Q(47,4))
check('h_gaussian_exponent_gt10',Q(47,4)-1>10)
check('v_gaussian_exponent_gt11',Q(47,4)>11)
check('kernel_prefactor',2*18**2*2==1296)
check('heat_derivative_prefactor',Q(1296,2)==648)
check('Gaussian_h2_constant',Q(2,4*10*3)==Q(1,60))
check('Gaussian_h4_constant',Q(3*2,8*100*3)==Q(1,400))
check('Gaussian_v2_constant',Q(2,2*11*3)==Q(1,33))
check('L1_bound',1296*Q(1,60)*Q(2,3)==Q(72,5)<15)
check('weighted_L1_bound',1296*Q(1,60)*Q(1,11)==Q(108,55)<2)
check('time_derivative_L1_bound',648*(Q(1,400)*Q(2,3)+Q(1,60)*Q(1,33))==Q(387,275)<2)
nu=Q(7005081715,1000000); B=51718939276867
check('source_frequency_gate',2*nu<14012 and 2*nu==Q('14010.16343'))
check('positive_rational_epsilon_less_one',0<B<3**29<3**14012)
check('epsilon_rectangle_total_loss',2*Q(1,8)+2*Q(1,8)==Q(1,2))
check('positive_shift_boundary_height',2*Q(1,10000)==Q(1,5000))
check('negative_bound_exact_subtraction',3197245160046-(56962777800000-2046593363087)==-B)
check('boundary_S_over_y_normalization',Q(1,2)*Q(1,128)==Q(1,256))
Ap=3194699959754
check('positive_full_source_enclosing_integer',0<Ap<Q('3194699959754.6482204228640119832745725119367529746884547298'))
check('positive_full_rectangle_inside_negative_tail_rectangle',0<Ap<B)
check('H_y_Gaussian_exponent',6-Q(1,2)/4-1>4)
check('H_y_bound_constant',Q(18,16)*2*Q(1,8)==Q(9,32))
check('full_denominator_lower_constant',Q(1,256)/Q(9,32)==Q(1,72))

def mat(x):return [[Q(y) for y in row] for row in x]
def add(A,B):return [[a+b for a,b in zip(x,y)] for x,y in zip(A,B)]
def neg(A):return [[-a for a in row] for row in A]
def sub(A,B):return add(A,neg(B))
def scale(c,A):return [[c*a for a in row] for row in A]
def star(A):return [list(x) for x in zip(*A)]
def mul(A,B):return [[sum(a*b for a,b in zip(row,col)) for col in zip(*B)] for row in A]
def inv(A):
    a,b=A[0];c,d=A[1];det=a*d-b*c;assert det
    return scale(1/det,[[d,-b],[-c,a]])
def prod(*args):
    out=args[0]
    for a in args[1:]:out=mul(out,a)
    return out
I=mat([[1,0],[0,1]]);D=mat([[2,0],[0,3]]);Di=inv(D)
K1=mat([[1,2],[-1,0]]);K2=mat([[0,1],[2,-1]])
L1=mat([[2,-1],[1,1]]);L2=mat([[-1,2],[0,1]])
K=add(K1,K2);L=add(L1,L2)
A01=scale(Q(10),I);A02=scale(Q(10),I)
B01=mat([[2,1],[-1,2]]);B02=mat([[-1,2],[3,0]])
C01=scale(Q(15),I);C02=scale(Q(15),I)
A0=add(A01,A02);B0=add(B01,B02);C0=add(C01,C02)
A=sub(A0,prod(star(K),Di,K));BB=sub(B0,prod(star(K),Di,L));C=sub(C0,prod(star(L),Di,L))
parts=[]
for Ai,Bi,Ci,Ki,Li in ((A01,B01,C01,K1,L1),(A02,B02,C02,K2,L2)):
    aa=sub(Ai,scale(Q(1,2),add(prod(star(Ki),Di,K),prod(star(K),Di,Ki))))
    bb=sub(Bi,scale(Q(1,2),add(prod(star(Ki),Di,L),prod(star(K),Di,Li))))
    cc=sub(Ci,scale(Q(1,2),add(prod(star(Li),Di,L),prod(star(L),Di,Li))))
    parts.append((aa,bb,cc))
check('full_inverse_partition_A',add(parts[0][0],parts[1][0])==A)
check('full_inverse_partition_B',add(parts[0][1],parts[1][1])==BB)
check('full_inverse_partition_C',add(parts[0][2],parts[1][2])==C)
check('cross_inverse_not_zero',prod(star(K1),Di,L2)!=mat([[0,0],[0,0]]))
check('discard_cross_inverse_changes_B',sub(B0,add(prod(star(K1),Di,L1),prod(star(K2),Di,L2)))!=BB)
check('postfeedback_anchor_positive',A[0][0]>0 and A[0][0]*A[1][1]-A[0][1]*A[1][0]>0)

for i,(xx,zz) in enumerate((((1,0),(0,1)),((1,-2),(3,1)),((Q(1,3),Q(2,5)),(-1,Q(3,7))))):
    x=[[Q(v)] for v in xx];z=[[Q(v)] for v in zz]
    v=add(mul(K,x),mul(L,z));u=neg(mul(Di,v))
    def scalar(*args):return prod(*args)[0][0]
    full=scalar(star(u),D,u)+2*scalar(star(u),v)+scalar(star(x),A0,x)+2*scalar(star(x),B0,z)+scalar(star(z),C0,z)
    red=scalar(star(x),A,x)+2*scalar(star(x),BB,z)+scalar(star(z),C,z)
    check(f'full_complement_minimizer_{i}',full==red)

R=mul(inv(A),BB);Xi=mat([[0,0],[0,0]]);Om=mat([[0,0],[0,0]])
for alpha,(_,bb,cc) in zip((Q(1,3),Q(2,3)),parts):
    P=scale(alpha,A);e=sub(bb,mul(P,R))
    Xi=add(Xi,sub(cc,prod(star(bb),inv(P),bb)))
    Om=add(Om,prod(star(e),inv(P),e))
check('same_anchor_all_exceptional_columns',add(Xi,Om)==sub(C,prod(star(BB),inv(A),BB)))
check('covariance_retains_nondiagonal',Om[0][1]!=0)
check('reserve_subtracted_once',sub(add(Xi,Om),scale(Q(1,100),I))==add(sub(Xi,scale(Q(1,100),I)),Om))
check('angular_source_example_scalar',Q(3)-Q(1,2)-1==Q(3,2)>0)

result={'status':'PASS','controls':len(rows),'checks':rows,
 'scope':'Original exact rational constants, full-inverse allocation and finite joint algebra controls. The actual negative Fourier input is source-verified v15; this script does not compute it or replay Arb. Infinite-index and source majorants require the accompanying analytic proof.',
 'source_Arb_replay_performed':False,'RH_proved':False}
Path(__file__).with_name('joint_source_controls.json').write_text(json.dumps(result,indent=2)+'\n')
print(json.dumps({'status':'PASS','controls':len(rows)}))
