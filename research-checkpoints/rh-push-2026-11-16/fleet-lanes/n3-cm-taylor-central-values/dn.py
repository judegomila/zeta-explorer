# Taylor coefficients d(n) of theta_3 at i (Romik normalisation), exact integers by high-precision series.
# G(z) = (1+z)^(-1/2) theta((1-z)/(1+z)) = theta(1) sum d(n) Phi^n z^(2n)/(2n)!,  theta(x)=sum_m exp(-pi m^2 x)
import sys, json
from mpmath import mp, mpf, pi, gamma, exp, binomial, factorial, nint
NMAX=int(sys.argv[1]); DPS=int(sys.argv[2])
mp.dps=DPS
K=2*NMAX+1
# exp(-a(1-z)/(1+z)) = e^{-a} exp(2a z/(1+z)); coefficients q_k: series of exp(b*z/(1+z)), b=2a
# f=exp(b z/(1+z)), f' = b/(1+z)^2 f => (1+2z+z^2) sum (k+1)q_{k+1} z^k = b sum q_k z^k
def coeffs(b):
    q=[mpf(1)]
    for k in range(K):
        # (k+1)q_{k+1} + 2k q_k + (k-1) q_{k-1} = b q_k
        v=(b-2*k)*q[k]
        if k>=1: v-=(k-1)*q[k-1]
        q.append(v/(k+1))
    return q
tot=[mpf(0)]*(K+1)
tot[0]=mpf(1)  # m=0 term: 1
m=1
while True:
    a=pi*m*m
    q=coeffs(2*a); e=exp(-a)
    big=max(abs(x) for x in q)*e
    for k in range(K+1): tot[k]+=2*e*q[k]
    if big<mpf(10)**(-DPS+5): break
    m+=1
print("m terms",m,file=sys.stderr)
# multiply by (1+z)^(-1/2)
bn=[binomial(mpf(-1)/2,k) for k in range(K+1)]
G=[sum(bn[j]*tot[k-j] for j in range(k+1)) for k in range(K+1)]
th1=G[0]
Phi=gamma(mpf(1)/4)**8/(128*pi**4)
from mpmath import nstr; print("odd coeff max",nstr(max(abs(G[k]) for k in range(1,K+1,2)),5),file=sys.stderr)
d=[];err=0
for n in range(NMAX+1):
    v=G[2*n]/th1*factorial(2*n)/Phi**n
    r=nint(v); err=max(err,abs(v-r)); d.append(int(r))
print("max integrality err",nstr(err,5),file=sys.stderr)
json.dump([str(x) for x in d],open("dn_%d.json"%NMAX,"w"))
print(d[:10])
