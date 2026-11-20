"""Independent Arb full-theta / DFT arithmetic certificate for one H=1 candidate.
Analytic sampling/periodization errors are supplied separately.
"""
import sys,json,time,gc
from pathlib import Path
P=Path(__file__).resolve().parent;sys.path.insert(0,str(P.parent/'ball_dependencies'))
from flint import acb,arb,ctx
ctx.prec=80
power=20;N=2**power;m=2*N;L=arb(6);dx=12/arb(N);t=arb('7005.081715');y=arb.pi()/4-2/t;pi=arb.pi();ii=acb(0,1);st=time.time()
g=[acb(0)]*m
# Full theta from validated Jacobi theta derivatives, not finite orbit truncation.
for k in range(N//2+1):
 x=dx*k;u=acb(x,y);ez=(2*u).exp();z=pi*ez;tau=ii*ez
 d2=acb(0).modular_theta(tau,2)[2];d4=acb(0).modular_theta(tau,4)[2]
 psi=(u/2).exp()*(z*z*d4/(4*pi**4)+3*z*d2/(2*pi*pi))
 val=psi*(ii*t*x).exp()
 if k<N//2:g[N//2+k]=val
 g[N//2-k]=val.conjugate()
 if k%65536==0:print('samples half',k,'seconds',time.time()-st,flush=True)
print('DFT starting',time.time()-st,flush=True)
G=acb.dft(g);del g;gc.collect();print('DFT completed',time.time()-st,flush=True)
# W_j=int_-2^2 q² exp(i omega_j q)dq. omega_j*2=j*pi/6.
sines=[(pi*j/6).sin() for j in range(12)];cosines=[(pi*j/6).cos() for j in range(12)]
sumv=(G[0]*G[0].conjugate()).real*(arb(16)/3)
for j in range(1,N+1):
 x=pi*j/6;W=16*((x*x-2)*sines[j%12]+2*x*cosines[j%12])/(x**3)
 C=(G[j]*G[m-j].conjugate()).real
 sumv+=(1 if j==N else 2)*(1 if j%2==0 else -1)*C*W
 if j%262144==0:print('weighted sum',j,'seconds',time.time()-st,flush=True)
result=(arb(4).exp()/8)*dx/m*sumv
out={'scope':'Arb enclosure of finite trig-interpolant weighted convolution, before analytic alias/truncation errors','power':power,'precision_bits':ctx.prec,'t':'7005.081715','H':'1','delta':'2/t','scaled_core_ball':str(result),'lower':str(result.lower()),'upper':str(result.upper()),'seconds':time.time()-st}
print(json.dumps(out,indent=2),flush=True);(P/'ball_fft_certificate.json').write_text(json.dumps(out,indent=2))
assert result>arb(56962777821815)
assert result<arb(56962777822971)
