# Arithmetic checks of the displayed identities of RESULT.md (not a stage-B computation).
# Small: no array above 60x60. mpmath 30 digits.
import sys, json
from fractions import Fraction
from math import gcd
import mpmath as mp
mp.mp.dps = 30
out = {}
def primes_of(b):
    ps=[];p=2
    while p*p<=b:
        if b%p==0:
            ps.append(p)
            while b%p==0: b//=p
        p+=1
    if b>1: ps.append(b)
    return ps
def f(beta,b):
    r = mp.mpf(b)**(-beta)
    for p in primes_of(b): r *= (1-mp.mpf(p)**(beta-1))/(1-mp.mpf(1)/p)
    return r
e = lambda x: mp.e**(2j*mp.pi*x)
# C1: f_beta(b) equals Galois average of periodic zeta / zeta, beta>1
mx=0
for beta in (mp.mpf(2), mp.mpf('1.5'), mp.mpf(3)):
    for b in range(2,31):
        tot=0;cnt=0
        for a in range(1,b):
            if gcd(a,b)==1:
                tot += sum(e(mp.mpf(a*j)/b)*mp.zeta(beta,mp.mpf(j)/b) for j in range(1,b+1))*mp.mpf(b)**(-beta); cnt+=1
        mx=max(mx,abs(tot/cnt/mp.zeta(beta)-f(beta,b)))
out['C1_fbeta_vs_periodic_zeta_maxerr']=float(mx)
# C2: KMS covariance of f_beta through the relation mu_n e(r) mu_n^* = (1/n) sum_{ns=r} e(s), all beta>0
mx=0
for beta in (mp.mpf('0.5'),mp.mpf('0.3'),mp.mpf(1),mp.mpf('1.7')):
    for n in (2,3,4,6,10):
        for b in (1,2,3,4,5,6,9,12):
            for a in range(b):
                if gcd(a,b)!=1 and b>1: continue
                r=Fraction(a,b)
                lhs=sum(f(beta,((r+j)/n).denominator) for j in range(n))/n
                mx=max(mx,abs(lhs-mp.mpf(n)**(-beta)*f(beta,r.denominator)))
out['C2_KMS_covariance_maxerr']=float(mx)
# C3: positive definiteness of r -> f_beta(den r) on (1/N)Z/Z, and pointwise sign
N=60
res={}
for beta in ('0.5','1.0','2.0'):
    bt=mp.mpf(beta)
    M=mp.matrix(N,N)
    for i in range(N):
        for j in range(N):
            M[i,j]=f(bt,Fraction(i-j,N).denominator)
    ev=mp.eigsy(M,eigvals_only=True)
    res[beta]={'min_eig':float(min(ev)),'min_value':float(min(f(bt,Fraction(i,N).denominator) for i in range(N)))}
out['C3_posdef_N60']=res
# C4: T-NR density D = 1 + c sqrt(q) P_q + q P_{q^2}
q=3;c=mp.mpf('2.1')
a=lambda k: 1 + (c*mp.sqrt(q) if k%q==0 else 0) + (q if k%(q*q)==0 else 0)
F=lambda s: mp.zeta(s)*(1+c*mp.sqrt(q)*q**(-s)+q*q**(-2*s))
s0=mp.mpf(3)
out['C4a_dirichlet_coeff_err']=float(abs(mp.nsum(lambda k:a(int(k))*k**(-s0),[1,mp.inf])-F(s0))) if False else float(abs(sum(a(k)*mp.mpf(k)**(-8) for k in range(1,4000))-F(8)))
out['C4b_min_density']=float(min(a(k) for k in range(1,200)))
z=mp.mpf(1)/2+(mp.acosh(c/2)+1j*mp.pi)/mp.log(q)
out['C4c_offline_zero']={'s':str(mp.nstr(z,12)),'absF':float(abs(F(z))),'absF_at_shifted_point':float(abs(F(z+0.1)))}
# multiplicative but not completely: a(q^2) vs a(q)^2
out['C4d_a_q2_minus_a_q_sq']=float(a(q*q)-a(q)**2)
# theta self-duality G(lam) = (q lam)^-1 G(1/(q^2 lam)), Gaussian
Th=lambda lam: mp.jtheta(3,0,mp.e**(-mp.pi*lam**2))
G=lambda lam: Th(lam)+c*mp.sqrt(q)*Th(q*lam)+q*Th(q*q*lam)
out['C4e_theta_selfdual_err']=float(max(abs(G(l)-G(1/(q*q*l))/(q*l)) for l in (mp.mpf('0.2'),mp.mpf('0.37'),mp.mpf(1),mp.mpf('2.3'))))
# C5: DH density in C*(Q/Z): period 5 values (1,kappa,-kappa,-1,0)
kap=(mp.sqrt(10-2*mp.sqrt(5))-2)/(mp.sqrt(5)-1)
ad=lambda k:[0,1,kap,-kap,-1][k%5]
coef=[sum(ad(k)*e(-mp.mpf(j*k)/5) for k in range(5))/5 for j in range(5)]
out['C5_DH']={'kappa':float(kap),'min_eigenvalue_of_D':float(min(ad(k) for k in range(5))),
  'a6_minus_a2a3':float(ad(6)-ad(2)*ad(3)),
  'fourier_coeffs_abs':[float(abs(x)) for x in coef],
  'selfadjoint_check':float(max(abs(coef[j]-mp.conj(coef[(-j)%5])) for j in range(5)))}
# C6: Poisson step for e(a/b): sum_{k in Z} F(lam k) e(ak/b) = lam^-1 sum_m Fhat((m - a/b)/lam), Gaussian
mx=0
for (aa,bb,lam) in ((1,3,mp.mpf('0.7')),(2,5,mp.mpf('1.3')),(1,4,mp.mpf('0.4'))):
    lhs=sum(mp.e**(-mp.pi*(lam*k)**2)*e(mp.mpf(aa*k)/bb) for k in range(-60,61))
    rhs=sum(mp.e**(-mp.pi*((m-mp.mpf(aa)/bb)/lam)**2) for m in range(-60,61))/lam
    mx=max(mx,abs(lhs-rhs))
out['C6_poisson_e_r_maxerr']=float(mx)
# C7: zeta(beta+it)/zeta(beta) -> indicator of t=0 as beta -> 1+
out['C7_ratio_at_t1']={str(b):float(abs(mp.zeta(mp.mpf(b)+1j)/mp.zeta(mp.mpf(b)))) for b in ('2','1.1','1.01','1.001')}
json.dump(out,open(sys.argv[1],'w'),indent=1); print(json.dumps(out,indent=1))
