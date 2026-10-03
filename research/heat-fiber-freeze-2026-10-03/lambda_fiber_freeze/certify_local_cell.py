"""Outward-rounded local H_t nonvanishing using mpmath.iv.

This is a finite positive-area cell, not global coverage and not a Lambda bound.
All finite terms, gamma and kappa are retained. Error uses Polymath Thm 1.3
equation (23) and the conservative 10.50 corollary of Proposition 6.6(vi).
"""
from mpmath import iv
from pathlib import Path
import json,time,argparse
iv.dps=40
I=iv.mpf;ONE=I(1);J=iv.mpc(0,1)
def alpha(s):return 1/(2*s)+1/(s-1)+iv.log(s/(2*iv.pi))/2
def logM(s,t):return iv.log(s)+iv.log(s-1)-s*iv.log(iv.pi)/2+iv.log(iv.sqrt(2*iv.pi)/16)+(s/2-ONE/2)*iv.log(s/2)-s/2+t*alpha(s)**2/4
def main():
 ap=argparse.ArgumentParser();ap.add_argument('--benchmark',type=int,default=0);ap.add_argument('--dps',type=int,default=40);ap.add_argument('--output',default='local_cell_certificate.json');args=ap.parse_args();iv.dps=args.dps;start=time.time()
 t=I(24727519)/200000000;y=I([ (ONE/5).a,(ONE/5+ONE/1000000).b ])
 xc=I(6000000186827);h=ONE/10000;x=I([(xc-h).a,(xc+h).b])
 assert t.a>0 and t.b<=ONE/2 and y.a>=0 and y.b<=1 and x.a>=200
 index=iv.sqrt(x/(4*iv.pi)+t/16);N=690988
 assert index.a>N and index.b<N+1
 s=(1+y-J*x)/2;ss=s+t*alpha(s)/2
 k=t*(alpha((1-y+J*x)/2)-alpha((1+y+J*x)/2))/2
 gamma=iv.exp(logM((1-y+J*x)/2,t)-logM(s,t))
 B=iv.mpc(0);A=iv.mpc(0);roughB=iv.mpc(0);roughA=iv.mpc(0);S=I(0)
 gabs=abs(gamma);nk=iv.exp(abs(k)*iv.log(I(N)))
 limit=args.benchmark or N
 for n in range(1,limit+1):
  ln=iv.log(I(n));bt=t*ln*ln/4
  bn=iv.exp(bt-ss*ln);an=iv.exp(bt+(y-iv.mpc(ss.real,-ss.imag)-k)*ln)
  B+=bn;A+=an
  S+=(1+gabs*nk*iv.exp(y*ln))*iv.exp(bt-ss.real*ln)
  if n%100000==0:print('terms',n,'seconds',time.time()-start,flush=True)
 if args.benchmark:
  print(json.dumps({'terms':limit,'seconds':time.time()-start,'gamma':str(gamma),'partial_B':str(B)}));return
 f=B+gamma*A
 z=x/(4*iv.pi);lz=iv.log(z)
 # For all n<=N, |log(z/n²)| <= log(z), since z> N²/2 and z>2.
 assert z.a>I(N)**2/2 and z.a>2
 eAB=S*iv.expm1((t*t*lz*lz/16+I(626)/1000)/(x-I(666)/100))
 eC=iv.exp(-(1+y)*lz/4-t*lz*lz/16+(I(124)/100)*(iv.exp(y*iv.log(I(3)))+iv.exp(-y*iv.log(I(3))))/(N-I(1)/8)+(3*abs(lz+J*iv.pi/2)+I(21)/2)/(x-12))
 error=eAB+eC
 M=iv.mpc(1)
 primes=[2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97]
 for p in primes:
  lp=iv.log(I(p));M*=1-iv.exp(t*lp*lp/4-ss*lp)
 radius=abs(M*f-1)+abs(M)*error
 margin=abs(f)-error
 result={'precision_dps':iv.dps,'N':N,'heat_time':'24727519/200000000','x_center':'6000000186827','x_halfwidth':'1/10000','y_interval':['1/5','200001/1000000'],'index':str(index),'f':str(f),'abs_f':str(abs(f)),'effective_error':str(error),'P97_disk_radius_including_error':str(radius),'nonvanishing_margin':str(margin),'local_H_nonvanishing_certified':bool(margin.a>0),'local_P97_disk_certified':bool(radius.b<1),'global_coverage_certified':False,'lambda_lt_0145_proved':False,'seconds':time.time()-start}
 print(json.dumps(result,indent=2),flush=True);Path(args.output).write_text(json.dumps(result,indent=2))
 assert result['local_H_nonvanishing_certified']
if __name__=='__main__':main()
