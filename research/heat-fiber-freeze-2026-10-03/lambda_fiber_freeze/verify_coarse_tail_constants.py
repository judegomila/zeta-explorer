"""Exact/interval constant checks for ANALYTIC_TAIL.md.
The universally quantified inequalities and monotonicities are proved there.
"""
from fractions import Fraction as Q
from mpmath import iv
from pathlib import Path
import json
iv.dps=50
t=Q(24727519,200000000);N=10**20;X=10**41
assert Q(123,1000)<t<Q(1,8)
assert iv.log(10)>iv.mpf(23)/10 and 41*iv.log(10)<100
assert iv.exp(iv.mpf(1)/2)<2
assert Q(1,2048*N*N)+Q(1,800*N**4)<Q(1,1000)
assert Q(3,5)+Q(123,4000)*46-Q(1,1000)>2
assert Q(123,4000)*46-Q(1,1000)>Q(7,5)
assert 20*iv.log(10)/N**2<iv.mpf(1)/2
assert Q(2)*(Q(10000,1024)+Q(626,1000))/X<Q(1,10**39)
assert Q(634,X)<Q(1,10**38)
assert Q(1,10**19)+Q(1,10**38)<Q(1,10**18)
assert iv.exp(iv.mpf(1)/10**18)<2
assert Q(4,10**12)+Q(4,10**39)<Q(5,10**12)
assert 1-Q(7516,10000)-Q(5,10**12)>Q(31,125)
Nsmall=10**17;Xsmall=10**35
assert Q(3,5)+Q(123,4000)*Q(391,10)-Q(1,1000)>Q(9,5)
assert Q(123,4000)*Q(391,10)-Q(1,1000)>Q(6,5)
p=iv.mpf(9)/5
zeta_tail=sum(iv.power(n,-p) for n in range(2,9))+iv.power(8,1-p)/(p-1)
assert zeta_tail.b<iv.mpf(9)/10
assert Nsmall>2000**5 and Nsmall**3>10**50
assert Q(1,2048*Nsmall*Nsmall)+Q(1,800*Nsmall**4)<Q(1,1000)
assert 17*iv.log(10)/Nsmall**2<iv.mpf(1)/2
assert Q(2)*(Q(10000,1024)+Q(626,1000))/Xsmall<Q(1,10**33)
assert Q(1,10**16)+Q(634,Xsmall)<Q(1,10**15)
assert iv.exp(iv.mpf(1)/10**15)<2
assert Q(4,10**10)+Q(4,10**33)<Q(5,10**10)
assert 1-Q(913,1000)-Q(5,10**10)>Q(43,500)
result={'constant_checks_passed':True,'precision_dps':iv.dps,'tail_index_min':str(Nsmall),'heat_time':str(t),'height_range':['1/5','1'],'normalized_H_modulus_lower':'43/500','stronger_tail':{'index_min':str(N),'normalized_H_modulus_lower':'31/125'},'zeta_nine_fifths_tail_upper_interval':str(zeta_tail),'global_lambda_claim':'not_certified','proof':'ANALYTIC_TAIL.md','note':'Checks constants only; proof document supplies universal inequalities.'}
Path('coarse_tail_constant_results.json').write_text(json.dumps(result,indent=2));print(json.dumps(result,indent=2))
