"""Self-authored finite Arb certificate. No floating optimizer participates."""
import sys,json,time,math
from fractions import Fraction
sys.path.insert(0,'/workspace/shared/zeta_sphere_campaign/ball_dependencies')
from flint import arb,ctx
ctx.prec=100
N=int(sys.argv[1]) if len(sys.argv)>1 else 512
L=int(sys.argv[2]) if len(sys.argv)>2 else 128
pi=arb.pi();a=arb(1)/4;dh=arb(3)/N
P=[[Fraction(0),Fraction(-3),Fraction(2)]]
for j in range(9):
 q=[Fraction(0)]*(len(P[-1])+1)
 for k,c in enumerate(P[-1]):q[k]+=(Fraction(1,2)+2*k)*c;q[k+1]-=2*c
 P.append(q)
assert max(sum(map(abs,p)) for p in P)<2*10**9
P=[[arb(c.numerator)/c.denominator for c in p] for p in P]
# 4*2e9*z^12 exp(-z) dominates all derivatives, including exp(u/2).
assert 8*10**9*arb(363)**12*(-arb(363)).exp()/(1-arb('1e-19'))<arb('1e-110')
err=arb(0,arb('1e-110'));tail=arb(0,arb('1e-100'))
def ps(u,order):
 out=[arb(0) for _ in range(order+1)];z0=pi*(2*u).exp()
 for n in range(1,11):
  z=z0*n*n;e=4*(u/2-z).exp()
  for j in range(order+1):
   v=P[j][-1]
   for c in reversed(P[j][:-1]):v=v*z+c
   out[j]+=e*v
 return [v+err for v in out]
t=time.time();points=[];ranges=[]
for k in range(2*N+1):
 u=arb(3)*k/(2*N);points.append((u,ps(u,9)))
for k in range(N):
 u=arb(arb(3)*(2*k+1)/(2*N),arb(3)/(2*N));raw=ps(u,9);mid=points[2*k+1][1];d=arb(0,arb(3)/(2*N))
 dp=[arb(1),d,d*d,d*d*d,d*d*d*d]
 for j in range(6):raw[j]=sum((mid[j+r]*dp[r]/math.factorial(r) for r in range(4)),arb(0))+raw[j+4]*dp[4]/24
 for j in (6,7):raw[j]=mid[j]+mid[j+1]*d+raw[j+2]*dp[2]/2
 raw[8]=mid[8]+raw[9]*d
 ranges.append((u,raw))
print('precomputed',time.time()-t,flush=True,file=sys.stderr)
def gj(u,p,lam,order,sg):
 x=sg*u;r=a+2*lam*x;e=(a*x+lam*u*u).exp()
 E=[arb(1),r]
 for j in range(2,order+1):E.append(r*E[-1]+2*(j-1)*lam*E[-2])
 return [e*sum((math.comb(j,k)*E[j-k]*p[k]*(sg**k) for k in range(j+1)),arb(0)) for j in range(order+1)]
idx=[1,3,5];sign=[1,-1,1];pairs=[(i,j) for i in range(3) for j in range(i,3)]
def mv(u,g,h):return [sign[i]*sign[j]*u*(g[idx[i]]*g[idx[j]]-h[idx[i]]*h[idx[j]]) for i,j in pairs]
def fourth(u,g,h,i,j):
 def side(v):
  return u*sum((math.comb(4,k)*v[i+k]*v[j+4-k] for k in range(5)),arb(0))+4*sum((math.comb(3,k)*v[i+k]*v[j+3-k] for k in range(4)),arb(0))
 # Differentiation in positive reflected coordinate flips all odd orders.
 hh=[(-1)**k*v for k,v in enumerate(h)]
 # Original product of two odd derivatives has sign + under this conversion.
 return side(g)-side(hh)
def ipow(x,n):
 v=arb(1)
 for _ in range(n):v*=x
 return v
def lj(u,g,r,sg):
 x=sg*u;out=[]
 for j in range(len(g)):
  out.append(sum((math.comb(j,k)*math.factorial(2*r)//math.factorial(2*r-k)*ipow(x,2*r-k)*g[j-k] for k in range(min(j,2*r)+1)),arb(0)))
 return out
def crossmv(u,g,h,v,w):return [sign[i]*sign[j]*u*(g[idx[i]]*v[idx[j]]-h[idx[i]]*w[idx[j]]) for i,j in pairs]
def crossfourth(u,g,h,v,w,i,j):
 def side(g,v):return u*sum((math.comb(4,k)*g[i+k]*v[j+4-k] for k in range(5)),arb(0))+4*sum((math.comb(3,k)*g[i+k]*v[j+3-k] for k in range(4)),arb(0))
 return side(g,v)-side([(-1)**k*z for k,z in enumerate(h)],[(-1)**k*z for k,z in enumerate(w)])
def moments(lam):
 mid=lam.mid();delta=lam-mid;vals=[]
 for u,p in points:
  g=gj(u,p,mid,5,1);h=gj(u,p,mid,5,-1);v=lj(u,g,1,1);w=lj(u,h,1,-1)
  v0=mv(u,g,h);v1=crossmv(u,g,h,v,w);v2=crossmv(u,v,w,g,h)
  vals.append((v0,[x+y for x,y in zip(v1,v2)]))
 sums=[[arb(0) for _ in pairs] for _ in range(2)];rem=[arb(0) for _ in pairs];data=[]
 for k,(u,p) in enumerate(ranges):
  g=gj(u,p,mid,9,1);h=gj(u,p,mid,9,-1);v=lj(u,g,1,1);w=lj(u,h,1,-1)
  gg=gj(u,p,lam,6,1);hh=gj(u,p,lam,6,-1);data.append((u,gg,hh));vv=lj(u,gg,1,1);ww=lj(u,hh,1,-1);rr=lj(u,gg,2,1);ss=lj(u,hh,2,-1)
  b0=crossmv(u,gg,hh,rr,ss);b1=crossmv(u,vv,ww,vv,ww);b2=crossmv(u,rr,ss,gg,hh)
  for z,(i,j) in enumerate(pairs):
   fs=[fourth(u,g,h,idx[i],idx[j]),crossfourth(u,g,h,v,w,idx[i],idx[j])+crossfourth(u,v,w,g,h,idx[i],idx[j])]
   for r in range(2):
    val=dh*(vals[2*k][r][z]+4*vals[2*k+1][r][z]+vals[2*k+2][r][z])/6
    rad=abs(fs[r])*dh**5/2880;sums[r][z]+=val+arb(0,rad.upper())
   rem[z]+=(b0[z]+2*b1[z]+b2[z])*dh
 H=[[arb(0) for _ in idx] for _ in idx]
 for z,(i,j) in enumerate(pairs):H[i][j]=H[j][i]=sums[0][z]+delta*sums[1][z]+delta*delta*rem[z]/2+tail
 return H,data
def schur(H):
 A=H[0][0];B=H[0][1];C=H[1][1];b=H[0][2];d=H[1][2];det=A*C-B*B
 assert A>0 and det>0, ('positive',str(A),str(det))
 Am=A.mid();Bm=B.mid();Cm=C.mid();bm=b.mid();dm=d.mid();detm=Am*Cm-Bm*Bm
 x0=((Bm*dm-Cm*bm)/detm).mid();x1=((Bm*bm-Am*dm)/detm).mid()
 r0=b+A*x0+B*x1;r1=d+B*x0+C*x1
 c0=x0+(B*r1-C*r0)/det;c1=x1+(B*r0-A*r1)/det
 assert abs(c0)<1000000 and abs(c1)<100000, ('coeff',str(c0),str(c1))
 return [c0,c1,arb(1)],H[2][2]+c0*b+c1*d,A,det
fits=[[arb(69251)/100,-arb(3032)/100],[arb(72742)/100,-arb(2956)/100],[arb(90366)/100,-arb(2942)/100]]
def gauge(lam,k):
 j=0 if 2*k<L else 1;v=2*lam-j
 return [(1-v)*fits[j][i]+v*fits[j+1][i] for i in range(2)]
def run():
 budget=arb(0);rows=[]
 for k in ([0,L//2,L-1] if len(sys.argv)>3 and sys.argv[3]=="probe" else range(L)):
  lam=arb(arb(2*k+1)/(2*L),arb(1)/(2*L));H,data=moments(lam);c,S,A,det=schur(H);ga=gauge(lam,k);cost=arb(0)
  for z,(u,g,h) in enumerate(data):
   um,pp=points[2*z+1];gm=gj(um,pp,lam,5,1);hm=gj(um,pp,lam,5,-1)
   def terms(x,g,der=False):
    F=sum((c[i]*sign[i]*g[idx[i]] for i in range(3)),arb(0));K=sum((c[i]*sign[i]*idx[i]*g[idx[i]-1] for i in range(3)),arb(0));Q=ga[0]*g[1]-ga[1]*g[3]
    if not der:return x*x*x*F*F+2*x*x*F*K+x*F*Q
    Ft=sum((c[i]*sign[i]*g[idx[i]+1] for i in range(3)),arb(0));Kt=sum((c[i]*sign[i]*idx[i]*g[idx[i]] for i in range(3)),arb(0));Qt=ga[0]*g[2]-ga[1]*g[4]
    return 3*x*x*F*F+2*x*x*x*F*Ft+4*x*F*K+2*x*x*(Ft*K+F*Kt)+F*Q+x*(Ft*Q+F*Qt)
   J=terms(um,gm)+terms(-um,hm);Jd=terms(u,g,True)-terms(-u,h,True)
   cost+=(((J+abs(J))/2).upper()+abs(Jd).upper()*dh/4)*dh
  cost+=arb('1e-100');budget+=2*cost/L
  row=dict(k=k,c=list(map(str,c)),A=str(A),det=str(det),cost_upper=str(cost.upper()));rows.append(row)
  if k%8==0:print('cell',k,'cost',cost,'elapsed',time.time()-t,flush=True,file=sys.stderr)
 H,_=moments(arb(1));c,S,A,det=schur(H);res=dict(N=N,L=L,terminal=str(S),budget=str(budget),lower=str(S-budget),PASS=bool(S>budget) and len(rows)==L,seconds=time.time()-t,rows=rows)
 print(json.dumps(res,indent=2));return res
if __name__=='__main__':run()
