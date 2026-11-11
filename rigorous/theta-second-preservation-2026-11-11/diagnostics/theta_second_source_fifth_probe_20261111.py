"""Diagnostic fifth theta sources; no certified quadrature or rounding bound."""
import argparse
import json
import mpmath as mp
from theta_second_source_20261111 import normalized_theta_jets
from theta_ratio_probe_20261110 import theta_data

def fifth(t,dps=80):
 with mp.workdps(dps):
  t=mp.mpf(t);q=normalized_theta_jets(t,8)
  logk,vp,_=theta_data(t)
  scale=max(mp.mpf(1),vp)
  end=max(t+1,mp.log((100+4*dps)/mp.pi)+2)
  limit=(end-t)*scale
  breaks=[mp.mpf(0),limit];z=mp.mpf(1)
  while z<limit:breaks.append(z);z*=4
  h=mp.quad(lambda w:(t+w/scale)*mp.exp(theta_data(t+w/scale)[0]-logk)/(4*scale),sorted(breaks))
  k=q[:5]
  tk=[t*q[j+1]+j*q[j] for j in range(5)]
  k2=q[2:7]
  tk3=[t*q[j+3]+j*q[j+2] for j in range(5)]
  c=[h]+[-(t*q[j-1]+(j-1)*q[j-2])/4 if j>1 else -t/4 for j in range(1,5)]
  k4=q[4:9]
  sh=16*mp.det(mp.matrix([[k[j],tk[j],k2[j],tk3[j],c[j]] for j in range(5)]))
  sq=256*mp.det(mp.matrix([[k[j],tk[j],k2[j],tk3[j],k4[j]] for j in range(5)]))
  return {'t':str(t),'dps':dps,'SH':mp.nstr(sh,35),'SQ':mp.nstr(sq,35),'SH_t10':mp.nstr(sh/t**10,35),'SQ_t10':mp.nstr(sq/t**10,35),'signs':bool(sh>0 and sq>0)}

if __name__=='__main__':
 parser=argparse.ArgumentParser()
 parser.add_argument('--t',default='0.001,0.125,0.5,1,2,4,6,8')
 parser.add_argument('--dps',type=int,default=80)
 args=parser.parse_args()
 for t in args.t.split(','):
  print(json.dumps(fifth(t,args.dps)),flush=True)
