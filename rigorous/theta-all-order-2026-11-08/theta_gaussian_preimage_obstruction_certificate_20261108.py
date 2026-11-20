"""Certify an obstruction to nonnegative theta preimages of a Gaussian.

For alpha=1, D=F+F', F(z)=xi(1/2+z). The script certifies D(-1)>0
and exactly one nonreal zero of D in a small disk in -1<Re z<0.
Together with positivity of Laplace transforms, these facts exclude every
nonnegative L2 preimage of every nonzero Gaussian under convolution by
h_+(u)=(1+u/2)kappa(u). See the accompanying mathematical note.

This does not exclude signed preimages and does not address RH itself.
Dependency: mpmath; interval arithmetic and analytic Simpson/tail bounds.
"""
from pathlib import Path
import json
from math import comb
import mpmath as mp

iv=mp.iv
iv.dps=35
step=iv.mpf(1)/1000
z0=iv.mpc(-iv.mpf(74626947)/10**8,iv.mpf(1461606607)/10**8)
radius=iv.mpf(1)/1000
assert abs(z0).b < 15
assert abs(z0.real).b+radius < 1
assert z0.real.b+radius < 0
assert z0.imag.a-radius > 0

polynomials=[
    [(0,1),(-3,1),(2,1)],
    [(0,1),(-15,4),(15,2),(-2,1)],
    [(0,1),(-75,16),(165,8),(-14,1),(2,1)],
    [(0,1),(-375,64),(1635,32),(-529,8),(45,2),(-2,1)],
    [(0,1),(-1875,256),(15465,128),(-266,1),(647,4),(-33,1),(2,1)],
]
kappa_caps=[2,9,53,376,3245]
ratio=(iv.mpf(3)/2)**(iv.mpf(25)/2)*iv.exp(-15)
assert ratio.b < iv.mpf(1)/20000
for j,row in enumerate(polynomials):
    bound=iv.mpf(0)
    for k,(num,den) in enumerate(row):
        if not num:
            continue
        q=iv.mpf(k)+iv.mpf(1)/4
        peak=iv.mpf(3) if k<=2 else q
        bound+=iv.mpf(abs(num))/den*(peak**q*iv.exp(-peak)
              +iv.mpf(12)**q*iv.exp(-12)/(1-iv.mpf(1)/20000))
    assert bound.b < kappa_caps[j]

theta_tail=(2*iv.pi**2*625*iv.exp(-25*iv.pi)
            /(1-iv.exp(iv.mpf(4)/5-10*iv.pi)))
assert theta_tail.b < iv.mpf('1e-30')


def kappa(u):
    e=iv.exp(u)
    out=iv.mpf(0)
    for n in range(1,5):
        x=iv.pi*n*n*e
        out+=iv.exp(u/4-x)*(2*x*x-3*x)
    return out+iv.mpf([0,'1e-30'])


sum_D=iv.mpc(0)
sum_Dprime=iv.mpc(0)
sum_real=iv.mpf(0)
for j in range(3001):
    u=j*step
    k=kappa(u)
    ep=iv.exp(z0*u/2)
    em=iv.exp(-z0*u/2)
    ch=(ep+em)/2
    sh=(ep-em)/2
    phi=ch+u*sh/2
    psi=u*sh/2+u*u*ch/4
    real_ep=iv.exp(u/2)
    real_em=iv.exp(-u/2)
    real_phi=(real_ep+real_em)/2-u*(real_ep-real_em)/4
    weight=1 if j in (0,3000) else (4 if j%2 else 2)
    sum_D+=weight*2*k*phi
    sum_Dprime+=weight*2*k*psi
    sum_real+=weight*2*k*real_phi
simpson_D=step*sum_D/3
simpson_Dprime=step*sum_Dprime/3
simpson_real=step*sum_real/3

# On [0,3], |Re(z0/2)|<1/2 and |z0/2|<15/2.
w=iv.mpf(15)/2
phi_caps=[]
psi_caps=[]
for j in range(5):
    p=iv.mpf(5)/2*w**j
    q=iv.mpf(15)/4*w**j
    if j:
        p+=iv.mpf(j)/2*w**(j-1)
        q+=2*j*w**(j-1)
    if j>=2:
        q+=iv.mpf(comb(j,2))/2*w**(j-2)
    phi_caps.append(iv.exp(iv.mpf(3)/2)*p)
    psi_caps.append(iv.exp(iv.mpf(3)/2)*q)
D_fourth=2*sum(iv.mpf(comb(4,j))*kappa_caps[j]*phi_caps[4-j] for j in range(5))
Dprime_fourth=2*sum(iv.mpf(comb(4,j))*kappa_caps[j]*psi_caps[4-j] for j in range(5))
D_error=iv.mpf(3)/180*step**4*D_fourth
Dprime_error=iv.mpf(3)/180*step**4*Dprime_fourth

# kappa(u)<=3*pi^2*exp(9*u/4-pi*exp(u)), u>=0.
heat_sum=16*iv.exp(-3*iv.pi)/(1-iv.exp(2-4*iv.pi))
assert heat_sum.b < iv.mpf(1)/2
tail_D=(15*iv.pi**2*iv.exp(iv.mpf(33)/4-iv.pi*iv.exp(3))
        /(iv.pi*iv.exp(3)-iv.mpf(11)/4-iv.mpf(1)/5))
tail_Dprime=(iv.mpf(45)/2*iv.pi**2*iv.exp(iv.mpf(33)/4-iv.pi*iv.exp(3))
             /(iv.pi*iv.exp(3)-iv.mpf(11)/4-iv.mpf(2)/3))
assert tail_D.b < iv.mpf('1e-20')
assert tail_Dprime.b < iv.mpf('1e-20')
box=iv.mpc(iv.mpf([-1,1]),iv.mpf([-1,1]))
D_at_center=simpson_D+box*(D_error+tail_D)
Dprime_at_center=simpson_Dprime+box*(Dprime_error+tail_Dprime)
D_at_minus_one=simpson_real+iv.mpf([-1,1])*(D_error+tail_D)
assert abs(D_at_center).b < iv.mpf('1e-7')
assert abs(Dprime_at_center).a > iv.mpf('0.001')
assert D_at_minus_one.a > iv.mpf('0.48')

# For all |Re z|<=1, |D''(z)| is at most the positive integral
# integral_0^infinity kappa(u)*exp(u/2)*(u^2/2+u^3/4)du.
# On [0,1], use kappa<=2; on [1,infinity], use the theta bound above.
second_bound_near=4*iv.exp(iv.mpf(1)/2)*(iv.mpf(1)/12+iv.mpf(1)/32)
second_bound_far=(iv.mpf(9)/4*iv.pi**2*iv.exp(iv.mpf(11)/4-iv.pi*iv.exp(1))
                  /(iv.pi*iv.exp(1)-iv.mpf(23)/4))
second_bound=second_bound_near+second_bound_far
assert second_bound.b < iv.mpf('0.8')
rouche_left=abs(D_at_center)+second_bound*radius**2/2
rouche_right=abs(Dprime_at_center)*radius
assert rouche_left.b < rouche_right.a

result={
    'status':'Interval/Rouche certificate for a Gaussian positive-preimage obstruction; not an RH proof.',
    'alpha':1,
    'center_real':'-74626947/100000000',
    'center_imaginary':'1461606607/100000000',
    'radius':'1/1000',
    'interval_decimal_precision':35,
    'D_at_center':str(D_at_center),
    'Dprime_at_center':str(Dprime_at_center),
    'D_at_minus_one':str(D_at_minus_one),
    'D_quadrature_error_bound':str(D_error),
    'Dprime_quadrature_error_bound':str(Dprime_error),
    'Dsecond_uniform_bound_abs_Re_z_le_1':str(second_bound),
    'rouche_remainder_bound':str(rouche_left),
    'rouche_linear_boundary_lower_bound':str(rouche_right),
    'conclusion':'D has exactly one zero in the stated disk inside -1<Re z<0, and D(-1)>0.'
}
Path(__file__).with_suffix('.json').write_text(json.dumps(result,indent=2)+'\n')
print(json.dumps(result,indent=2))
