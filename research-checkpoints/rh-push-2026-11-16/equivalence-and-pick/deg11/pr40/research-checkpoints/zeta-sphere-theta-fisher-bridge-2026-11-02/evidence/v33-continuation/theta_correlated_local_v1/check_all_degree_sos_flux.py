"""Owned formal algebra checks. No theta numerical certificate or degree extension."""
import sympy as s
X,Y,L,t,r=s.symbols('X Y L t r')
W=X+Y; a=(X-Y)/(2*s.I)
for n in range(1,7):
 cs=s.symbols('c0:'+str((n+1)//2))
 p=t**n+sum(cs[k]*t**(n%2+2*k) for k in range(n//2))
 # root-free deletion polynomial, valid for arbitrary p coefficients
 K=s.cancel((s.diff(p,t)*p.subs(t,r)-p*s.diff(p,t).subs(t,r))/(r-t))
 D0=-s.expand(K.subs({t:s.I*X,r:-s.I*Y},simultaneous=True))
 D2=s.expand((p.subs(t,s.I*X)*p.subs(t,-s.I*Y)-p.subs(t,a)**2)/2)
 U2=s.cancel(2*D2/W);U1=s.cancel(-8*D2/W**2)
 U0=s.cancel(2*(D0+8*D2/W**2)/W)
 for u in [U2,U1,U0]:s.Poly(u,X,Y)
 R=L*L*U2+L*U1+U0
 assert s.expand(s.diff(R,L)+W*R/2-L*L*D2-D0)==0
 print('degree',n,'polynomial divisions and exact flux: PASS')
print('No remainder positivity or selected-pivot sign tested.')
