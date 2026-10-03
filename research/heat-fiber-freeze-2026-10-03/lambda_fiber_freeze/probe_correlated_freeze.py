"""Numerical reconnaissance only. Long-double phase sums are not certificates.

Keeps the common physical x, gamma, both ladders, Euler scalar, and P97 rough
projection together. No independently selected fiber phases are permitted.
"""
import os
os.environ['OPENBLAS_NUM_THREADS']='1'
os.environ['OMP_NUM_THREADS']='1'
import json,time,math,argparse
from pathlib import Path
import numpy as np
import mpmath as mp
mp.mp.dps=90
LD=np.longdouble
P=[2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97]
T=mp.mpf(24727519)/200000000
X=mp.mpf(6000000185827)

def alpha(s):return 1/(2*s)+1/(s-1)+mp.log(s/(2*mp.pi))/2
def logM(s,t):
 return mp.log(s)+mp.log(s-1)-s*mp.log(mp.pi)/2+mp.log(mp.sqrt(2*mp.pi)/16)+(s/2-mp.mpf('.5'))*mp.log(s/2)-s/2+t*alpha(s)**2/4
def ldc(z):return LD(str(mp.re(z)))+1j*LD(str(mp.im(z)))
def setup(N):
 n=np.arange(1,N+1,dtype=np.int64);ln=np.log(n.astype(LD))
 rough=np.ones(N,dtype=bool)
 for p in P:rough[p-1::p]=False
 return n,ln,rough
def probe(N,x,y,setup_data):
 n,ln,rough=setup_data
 s=(1+y-1j*x)/2;ar=alpha(s);ss=s+T*ar/2
 k=T*(alpha((1-y+1j*x)/2)-alpha((1+y+1j*x)/2))/2
 gamma=mp.exp(logM((1-y+1j*x)/2,T)-logM(s,T))
 sig=LD(str(mp.re(ss)));tau=LD(str(mp.im(ss)));kr=LD(str(mp.re(k)));ki=LD(str(mp.im(k)))
 w=np.exp(LD(str(T))/4*ln*ln-sig*ln)
 theta=-tau*ln
 primary=w*(np.cos(theta)+1j*np.sin(theta))
 reflected=w*np.exp((LD(str(y))-kr)*ln)*(np.cos(-theta-ki*ln)+1j*np.sin(-theta-ki*ln))
 gv=ldc(gamma)
 B=primary.sum(dtype=np.clongdouble);A=gv*reflected.sum(dtype=np.clongdouble)
 # Common Euler gauge; both ladders remain in their physical combination.
 A97=mp.mpc(1);A11=mp.mpc(1)
 for p in P:
  fac=1-mp.exp(T*mp.log(p)**2/4-ss*mp.log(p))
  A97*=fac
  if p<=11:A11*=fac
 f=B+A; C=(primary[rough]+gv*reflected[rough]).sum(dtype=np.clongdouble)
 E=C-ldc(A97)*f
 z11=ldc(A11)*f-1;z97=ldc(A97)*f-1
 return {'N':N,'x_exact_input':str(x),'y':str(y),'abs_f':float(abs(f)),
  'abs_B':float(abs(B)),'abs_gamma_A':float(abs(A)),
  'coupled_P11_disk_radius':float(abs(z11)),'coupled_P97_disk_radius':float(abs(z97)),
  'P97_cocycle_modulus':float(abs(E)),
  'independent_P11_piece_radius':float(abs(ldc(A11)*B-1)+abs(ldc(A11)*A)),
  'rough_core_modulus':float(abs(C)),
  'P97_mollifier_modulus':float(abs(ldc(A97))),
  'phase_sum_arithmetic':'numpy long double, non-rigorous',
  'kappa_retained':True,'directed_error_budget_certified':False}
def main():
 global T
 ap=argparse.ArgumentParser();ap.add_argument('--samples',type=int,default=9);ap.add_argument('--N',type=int,nargs='+',default=[690988,1000000,4050000]);ap.add_argument('--t',default='0.123637595');ap.add_argument('--y',nargs='+',default=['.1809','.2','.2065']);ap.add_argument('--output',default='probe_results.json');args=ap.parse_args();T=mp.mpf(args.t)
 start=time.time();out=[]
 for N in args.N:
  data=setup(N)
  lo=max(X+1,4*mp.pi*(N*N-T/16));hi=4*mp.pi*((N+1)**2-T/16)
  for i in range(args.samples):
   # Strictly interior deterministic irrational offsets avoid index seams.
   x=lo+(hi-lo)*mp.mpf(2*i+1)/(2*args.samples)
   for y in map(mp.mpf,args.y):
    r=probe(N,x,y,data);out.append(r);print(json.dumps(r),flush=True)
  del data
 result={'status':'diagnostic_only','heat_time':str(T),'new_Lambda_bound_certified':False,'seconds':time.time()-start,'rows':out}
 Path(args.output).write_text(json.dumps(result,indent=2))
if __name__=='__main__':main()
