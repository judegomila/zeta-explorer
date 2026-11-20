# independent check: direct Hurwitz evaluation, different window (DH off-line zero near t=114.16)
from mpmath import mp, mpf, mpc, pi, sqrt, gamma, zeta, arg, findroot, re, im
mp.dps = 30
kap = (sqrt(10-2*sqrt(5))-2)/(sqrt(5)-1)
def L(s):
    f = 5**(-s)*(zeta(s, mpf(1)/5)+kap*zeta(s, mpf(2)/5)-kap*zeta(s, mpf(3)/5)-zeta(s, mpf(4)/5))
    return (5/pi)**(s/2)*gamma((s+1)/2)*f
# functional equation + reality check
s0 = mpc('0.3','7.7'); print('FE', abs(L(s0)-L(1-s0))/abs(L(s0)), 'real on line', abs(im(L(mpc(0.5,100)))/re(L(mpc(0.5,100)))))
def path(a,b,step=mpf('0.02')):
    n=int(abs(b-a)/step)+1; return [a+(b-a)*k/n for k in range(n+1)]
def darg(pts):
    v=[L(p) for p in pts]; tot=0; mx=0
    for a,b in zip(v,v[1:]):
        d=arg(b/a); tot+=d; mx=max(mx,abs(d))
    return tot, mx
for (t1,t2) in [(mpf(110),mpf(118)), (mpf(81),mpf(89))]:
    X=mpf('1.5')
    # outer arc C: right half of rectangle from 1/2+it1 to 1/2+it2
    C = path(mpc(0.5,t1),mpc(0.5+X,t1))+path(mpc(0.5+X,t1),mpc(0.5+X,t2))+path(mpc(0.5+X,t2),mpc(0.5,t2))
    dC,mx = darg(C)
    ts=path(t1,t2,mpf('0.01')); v=[re(L(mpc(0.5,t))) for t in ts]
    Non=sum(1 for a,b in zip(v,v[1:]) if a*b<0)
    # seam flux at offset a
    a=mpf('0.002'); fl,mx2=darg(path(mpc(0.5+a,t1),mpc(0.5+a,t2),mpf('0.0005')))
    print('window',t1,t2,'N_K=dC/pi=',mp.nstr(dC/pi,8),'maxstep',mp.nstr(mx,3),'N_on=',Non,'seamflux/pi=',mp.nstr(fl/pi,8),'N_right=',mp.nstr((dC-pi*Non)/(2*pi),8),'signs',int(v[0]>0),int(v[-1]>0))
z=findroot(L, mpc('0.650830','114.163343')); print('offline zero', mp.nstr(z,12))
