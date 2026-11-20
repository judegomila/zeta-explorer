# Exploratory test of a structurally improved piecewise-linear residual certificate.
import sys
sys.path.insert(0,'/workspace/shared/zeta_sphere_campaign/hierarchy/suzuki_v8')
exec(open('/workspace/shared/zeta_sphere_campaign/hierarchy/suzuki_v8/block_probe.py').read().split('for w in [.4,.49]:')[0])
w=.4;n=256;m=4194304;M=m//n;R=16/15*np.log(2);dx=R/m;h=R/n;shift=15*m//16;c2=(2**w-2**(-w))/np.sqrt(2)
Qs=Q(np.arange(m+1)*dx,w)
def at(idx):return Qs[np.maximum(idx,0)]
A=np.zeros((n,n));S=np.zeros((n,n))
# Process in moderately sized chunks to keep memory bounded.
bs=1024
for row in range(n):
 sums=np.zeros(n)
 for start in range(row*M,(row+1)*M,bs):
  i=np.arange(start,min(start+bs,(row+1)*M))[:,None]
  hi=i+(np.arange(n)[None,:]+1)*M-m
  vl=(at(hi)-at(hi-M)+c2*(at(hi-shift)-at(hi-shift-M)))/np.sqrt(h)
  vr=(at(hi+1)-at(hi+1-M)+c2*(at(hi+1-shift)-at(hi+1-shift-M)))/np.sqrt(h)
  mid=(vl+vr)/2;diff=vr-vl
  sums+=mid.sum(axis=0)
  S+=dx*(mid.T@mid+(diff.T@diff)/12)
 A[row]=dx/np.sqrt(h)*sums
 if row%64==0:print('row',row,flush=True)
G=S-A.T@A
rho=.99995;d=2*(1+c2)*Q(h,w)+2*h*abs(q(R,w))
c=(2*np.pi)**w/gamma(w);K=c/w;D=6.5*c/(w+1)
I=1/(2*w+1)-2/(w+2)+1/3;J=1/(w+1)-.5
esing=K*dx**(w+.5)*np.sqrt(I)+2*D*dx**(w+1.5)
eother=c*dx**(w+.5)/8*(.6*np.sqrt(1+1/2.2)+2.9*dx*np.sqrt(1+1/.2)+.4*dx**1.6*np.sqrt(m))
ebase=np.sqrt(2*n/h)*np.hypot(esing,eother)
e=eBase=ebase*(1+c2/4)+2e-6
l1=K*dx**(w+1)*J+2*D*dx**(w+2)+c*dx**(w+1)/8*(.6*(1+1/.6)+2.9*dx*(1+(m**.4-1)/.4)+.4*dx**1.6*m)
ae=2*(1+c2)*l1/h+2e-6
rn=np.sqrt(abs(G).sum(axis=1).max());ge=2*rn*e+e*e+1e-7
margin=1-eigvalsh((A+A.T)/2+G/(1-d))[-1]
cm=rho-eigvalsh((A+A.T)/2+G/(rho-d))[-1]-ae-ge/(rho-d)
print(dict(d=d,e=e,ae=ae,rn=rn,ge=ge,margin=margin,certmargin=cm,Sdiag=S.diagonal().max()),flush=True)
np.savez('/workspace/shared/zeta_sphere_campaign/hierarchy/suzuki_v9/support_linear_probe.npz',A=A,G=G)
