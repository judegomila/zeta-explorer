# nested real-node Pick pivots of P_ij=(L_i+L_j)/(x_i+x_j) for each control; first negative order
import sys, json, time, mpmath as mp
from common import *
label = sys.argv[1]; N = int(sys.argv[2]); dps = int(sys.argv[3]); fam = sys.argv[4]
setup(dps)
F, L = get(label)
if fam=='geo': xs = [mp.mpf('0.6')*mp.mpf('1.3')**k for k in range(N)]
elif fam=='lin': xs = [mp.mpf('0.6')+mp.mpf('0.35')*k for k in range(N)]
elif fam=='cheb': xs = [mp.mpf('0.55')+ 6*(1-mp.cos(mp.pi*(2*k+1)/(2*N)))/2 for k in range(N)]
t=time.time()
Ls = [mp.re(L(x)) for x in xs]
A = mp.matrix(N,N)
for i in range(N):
    for j in range(N): A[i,j] = (Ls[i]+Ls[j])/(xs[i]+xs[j])
piv=[]; first=None
for k in range(N):
    d = A[k,k]; piv.append(d)
    if d<0 and first is None: first=k+1
    if d==0: break
    for i in range(k+1,N):
        f = A[i,k]/d
        for j in range(k+1,N): A[i,j] -= f*A[k,j]
out = dict(label=label,N=N,dps=dps,fam=fam,first_negative_order=first,
  pivots=[mp.nstr(p,6) for p in piv], secs=time.time()-t)
print(json.dumps(out)); 
