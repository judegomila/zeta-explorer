import mpmath as m
m.mp.dps=55
c=[-134,383,-230,-315,297,308,-308,-297,315,230,-383,134]
def psi(u):
 u=abs(u); e=m.exp(2*u)
 return m.fsum(4*m.exp(u/2)*r*(2*r-3)*m.exp(-r) for r in [m.pi*k*k*e for k in range(1,8)])
def moment(n,v):
 f=lambda h:h**(2*n)*psi(h-v)*psi(h+v)
 edges=sorted(set([m.mpf(0),v]+[m.mpf(i)/4 for i in range(1,13)]))
 return m.quad(f,edges)
g=[]
for j in range(12):
 v=m.mpf(j)/10
 g.append(moment(5,v)/moment(4,v))
 print(j,m.nstr(g[-1],45),flush=True)
Q=m.fsum(c[j]*c[k]*g[abs(j-k)] for j in range(12) for k in range(12))
print('Q=',m.nstr(Q,45))
