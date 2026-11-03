"""Exploratory, NON-INTERVAL check of exact Ewald grouping. Original local code."""
import mpmath as m
m.mp.dps=35

def axis_poly(r,y,k):
 # coefficients ascending, recurrence (r-2y)p+2y p'.
 c=[m.mpf(1)]
 for _ in range(k):
  d=[m.mpf(0)]*(len(c)+1)
  for j,z in enumerate(c):d[j]+=(r+2*j)*z;d[j+1]-=2*z
  c=d
 return sum(z*y**j for j,z in enumerate(c))

def integrand(x,v,a,N,axis=True):
 l=m.log(x);ca=m.cosh(a*l);da=l*m.sinh(a*l)/a
 coeff=8*a*a+2;constant=(4*a*a-1)**2
 total=m.mpf(0)
 if axis:
  for n in range(1,8):
   y=m.pi*n*n*x*m.exp(2*v);ex=m.exp(-y)
   LP=[];DP=[]
   for r in (0,1):
    p2=axis_poly(r,y,2);p4=axis_poly(r,y,4)
    LP.append(p4-coeff*p2+constant)
    DP.append(-16*p2+16*(4*a*a-1))
   total+=ex*(da*(LP[0]/m.sqrt(x)-m.exp(v)*LP[1]/x)+ca*(DP[0]/m.sqrt(x)-m.exp(v)*DP[1]/x))/32
 for n in range(1,N+1):
  for k in range(1,N+1):
   left=n*n*m.exp(-2*v);right=k*k*m.exp(2*v)
   y=m.pi*x*(left+right);z=2*m.pi*x*(right-left)
   p2=z*z-4*y
   p4=z**4-24*y*z*z+16*z*z+48*y*y-16*y
   lp=p4-coeff*p2+constant;dp=-16*p2+16*(4*a*a-1)
   total+=m.exp(-y)/m.sqrt(x)*(da*lp+ca*dp)/16
 return total

def grouped(v,a,N):return m.quad(lambda x:integrand(x,v,a,N),[1,2,4,8,16])
if __name__=='__main__':
 a=m.mpf(1)/4
 for v in [m.mpf(0),m.mpf(1)/4,m.mpf(1)/2]:
  ax=grouped(v,a,0);d=grouped(v,a,3)
  print('v',v,'axis/a',m.nstr(ax,25),'D3/a',m.nstr(d,25),flush=True)
 vals=[grouped(m.mpf(j)/4,a,3) for j in range(3)]
 G=m.matrix([[vals[abs(j-k)] for j in range(3)] for k in range(3)])
 print('3node eigenvalues (exploratory only)',list(m.eigsy(G,eigvals_only=True)),flush=True)
