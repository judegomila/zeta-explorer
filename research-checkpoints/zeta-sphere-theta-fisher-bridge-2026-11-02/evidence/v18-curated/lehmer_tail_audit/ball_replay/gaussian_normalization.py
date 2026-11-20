import sys,json
from pathlib import Path
P=Path(__file__).resolve().parent;sys.path.insert(0,str(P.parent.parent/'ball_dependencies'))
from flint import arb,acb,ctx
ctx.prec=100;N=4096;m=2*N;L=arb(8);dx=2*L/N;t=arb(3);y=arb(2)/5;H=arb(1)/16;B=2*H;ii=acb(0,1)
g=[]
for k in range(N):
 x=-L+k*dx;u=acb(x,y);g.append((-u*u+ii*t*x).exp())
g.extend([acb(0)]*N);G=acb.dft(g);s=(G[0]*G[0].conjugate()).real*2*B**3/3
for j in range(1,N+1):
 w=2*arb.pi()*j/(4*L);x=w*B;W=2*B**3*((x*x-2)*x.sin()+2*x*x.cos())/x**3
 s+=(1 if j==N else 2)*(1 if j%2==0 else -1)*(G[j]*G[m-j].conjugate()).real*W
value=(-2*t*y).exp()*dx/m*s/8
exact=(arb.pi()/2).sqrt()*(-t*t/2).exp()*(arb.pi().sqrt()/(4*arb(2).sqrt())*(arb(2).sqrt()*H).erf()-H/2*(-2*H*H).exp())
err=abs(value-exact);assert err<arb('1e-20')
out={'gaussian_value':str(value),'exact':str(exact),'absolute_difference':str(err),'role':'DFT sign/normalization/origin sanity check; full theorem uses independent analytic error bounds'};print(json.dumps(out,indent=2));(P/'gaussian_normalization.json').write_text(json.dumps(out,indent=2))
