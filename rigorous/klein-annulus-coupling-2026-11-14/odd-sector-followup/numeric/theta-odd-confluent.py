"""First confluent odd-theta Gram diagnostic. Numerical, not interval certified."""
from pathlib import Path
import json
import mpmath as mp

HERE=Path(__file__).resolve().parent
mp.mp.dps=70


def polynomial(j,v):
    if j==0:return 2*v**2-3*v
    if j==1:return -2*v**3+mp.mpf(15)/2*v**2-mp.mpf(15)/4*v
    if j==2:return 2*v**4-14*v**3+mp.mpf(165)/8*v**2-mp.mpf(75)/16*v
    if j==3:return -2*v**5+mp.mpf(45)/2*v**4-mp.mpf(529)/8*v**3+mp.mpf(1635)/32*v**2-mp.mpf(375)/64*v
    raise ValueError(j)


def derivative(j,u):
    return mp.exp(u/4)*mp.fsum(polynomial(j,mp.pi*n*n*mp.exp(u))*mp.exp(-mp.pi*n*n*mp.exp(u)) for n in range(1,9))


moments=[mp.quad(lambda u:u*derivative(j,u)**2,[0,1,2,5]) for j in [1,2,3]]
k0,k2=derivative(0,mp.mpf(0)),derivative(2,mp.mpf(0))
i1,i2,i3=moments
J=mp.matrix([[4*i1-2*k0*k0,-(2*i2+k0*k2)/3],[-(2*i2+k0*k2)/3,i3/9-k2*k2/6]])
N=mp.matrix([[J[i,j]/mp.sqrt(J[i,i]*J[j,j]) for j in range(2)] for i in range(2)])
fmt=lambda x:mp.nstr(x,60)
out={'scope':'Necessary local odd-PSD diagnostic; numerical integral evaluation, no global certificate',
     'precision_digits':70,'theta_terms':8,'derivative_integral_cutoff':5,
     'kappa0':fmt(k0),'kappa_second0':fmt(k2),'moments_I1_I2_I3':[fmt(z) for z in moments],
     'jet_matrix':[[fmt(J[i,j]) for j in range(2)] for i in range(2)],
     'determinant':fmt(mp.det(J)),
     'normalized_correlation':fmt(N[0,1]),
     'normalized_determinant':fmt(mp.det(N))}
(HERE/'theta-odd-confluent.json').write_text(json.dumps(out,indent=2)+'\n')
print(json.dumps(out,indent=2))
