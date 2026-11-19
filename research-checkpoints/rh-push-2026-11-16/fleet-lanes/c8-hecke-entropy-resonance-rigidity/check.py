# Checks for c8-hecke-entropy-resonance-rigidity. mpmath only, small memory (no arrays > few kB).
# A. T_n y^w = tau_w(n) y^w  (exact identity, checked numerically)
# B. Parseval horocycle mass I(y) = int_0^1 |E(x+iy,w)|^2 dx at resonance w = 1 - rho/2 and off resonance,
#    window-averaged against c0(E(.,2 sigma)) = y^{2s} + phi(2s) y^{1-2s}.
# C. exponent cancellation: sum_{p<=P} |lambda_p(w)|^2 / (P^{2sigma-1}/(2sigma-1)) vs P/log P.
import json, sys
from mpmath import mp, mpf, mpc, zeta, gamma, pi, besselk, zetazero, exp, log, sqrt, primepi
mp.dps = 30
def xi(s): return pi**(-s/2)*gamma(s/2)*zeta(s)
def phi(w): return xi(2*w-1)/xi(2*w)
def sig(a,n):
    return sum(mpc(d)**a for d in range(1,n+1) if n%d==0)
def tau(w,n):  # sum_{ad=n} (a/d)^{w-1/2}
    return mpc(n)**(w-mpf(1)/2)*sig(1-2*w,n)
out={}
# A
w=mpc('0.8','3.7'); y=mpf('1.3'); errs=[]
for n in [2,3,4,6,12,30]:
    s=0
    for d in range(1,n+1):
        if n%d==0:
            a=n//d; s+= d*(mpf(a)*y/d)**w      # b mod d: d points at height a y/d
    lhs=s/sqrt(n); rhs=tau(w,n)*y**w
    errs.append(float(abs(lhs-rhs)/abs(rhs)))
out['A_max_rel_err']=max(errs)
# B
def I(y,w,scale):
    # scale = exp(pi|t|/2) factor handled by mp; returns (const part, nonconst part)
    c0=abs(y**w+phi(w)*y**(1-w))**2
    X=xi(2*w); nu=w-mpf(1)/2; s=mpf(0); n=1
    T=abs(w.imag)
    while True:
        k=besselk(nu,2*pi*n*y)
        term=abs(tau(w,n))**2*abs(k)**2
        s+=term
        if 2*pi*n*y>T+30 and term<mpf(10)**(-25)*s: break
        n+=1
        if n>4000: break
    return c0, 8*y*s/abs(X)**2, n
cases=[]
z1=zetazero(1); z2=zetazero(30); z3=zetazero(127)
for name,w in [('res_rho1',1-z1/2),('res_rho30',1-z2/2),('res_rho127',1-z3/2),
               ('off_s0.75_t60.3',mpc('0.75','-60.3')),('off_s0.65_t141.1',mpc('0.65','-141.1')),('off_s0.85_t141.1',mpc('0.85','-141.1'))]:
    sg=w.real; ys=[mpf(1)+mpf(k)/20 for k in range(0,21)]   # y in [1,2]
    num=mpf(0); den=mpf(0); p2=phi(2*sg); rows=[]
    for y in ys:
        c0,nc,n=I(y,w,None)
        pred=y**(2*sg)+p2*y**(1-2*sg)
        num+=(c0+nc)/y**2; den+=pred/y**2
        rows.append([float(y),float(c0),float(nc),float(pred)])
    cases.append(dict(name=name,w=[float(w.real),float(w.imag)],abs_phi=float(abs(phi(w))),ratio_window=float(num/den),rows=rows[::5]))
    print(name,float(abs(phi(w))),float(num/den),flush=True)
out['B']=cases
# C
def primes(N):
    s=bytearray([1])*(N+1); s[0:2]=b'\0\0'
    for i in range(2,int(N**.5)+1):
        if s[i]: s[i*i::i]=bytearray(len(s[i*i::i]))
    return [i for i in range(N+1) if s[i]]
C=[]
for sg in [0.55,0.65,0.75,0.85,0.95]:
    for P in [10**3,10**4,10**5]:
        ps=primes(P); t=7.07
        S=sum(abs(complex(p)**complex(sg-.5,t)+complex(p)**complex(.5-sg,-t))**2 for p in ps)
        M=P**(2*sg-1)/(2*sg-1)
        import math
        C.append([sg,P,S/M/(P/math.log(P))])
out['C_ratio_to_P_over_logP']=C
json.dump(out,open('check.json','w'),indent=1)
print(json.dumps({k:out[k] for k in ['A_max_rel_err','C_ratio_to_P_over_logP']}))
