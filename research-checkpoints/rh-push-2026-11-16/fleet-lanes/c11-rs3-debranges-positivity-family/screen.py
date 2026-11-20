# Screen of the de Branges shift condition's necessary condition N2_h at zeros on the line:
#   q_h(rho) = -Re{ X'(rho) * X(rho+h) } >= 0   (X real on the critical line, X(s)=X(1-s))
# and of the phase condition P_h: Re{ X(s)/X(s+h) } >= 0 on Re s > 1/2.
# Functions: zeta (xi), GAM (gamma-only fake g(s)+g(1-s)), DH (Davenport-Heilbronn, completed).
import sys, json, time
from mpmath import mp, mpf, mpc, zeta, loggamma, exp, log, pi, zetazero, findroot, sqrt, im, re, diff, sign, fabs
mp.dps = 30
def gfac(s): return s*(s-1)*exp(-s/2*log(pi)+loggamma(s/2))
def xi(s): return gfac(s)*zeta(s)
def gam(s): return gfac(s)+gfac(1-s)
kap=(sqrt(10-2*sqrt(5))-2)/(sqrt(5)-1)
chi=[0,1,mpc(0,1),mpc(0,-1),-1]
def Lchi(s,conj=False):
    tot=0
    for a in range(1,5):
        c=chi[a].conjugate() if conj else chi[a]
        tot+=c*zeta(s,mpf(a)/5)
    return tot*mpf(5)**(-s)
def dh(s):
    f=(1-1j*kap)/2*Lchi(s)+(1+1j*kap)/2*Lchi(s,True)
    return exp(s/2*log(5/pi)+loggamma((s+1)/2))*f
def q(X,rho,h):
    d=diff(X,rho)   # complex derivative
    v=X(rho+h)
    val=-re(d*v)
    return val/(abs(d)*abs(v))   # normalised: sin of the phase margin, in [-1,1]
out={}
t0=time.time()
# reproduce Conrey-Li (3.2) and (3.4)
r34=mpc(0.5,im(zetazero(34)))
out['CL_3.2']=str(-re(diff(xi,r34)*xi(r34+1)))
out['CL_3.4']=str(re(xi(mpc(1,282))/xi(mpc(2,282))))
print(out,flush=True)
H=[mpf(x) for x in ('0.1','0.25','0.5','1','2','4')]
wins={'n1-100':range(1,101),'n620-680(t~1000)':range(620,681),'n10112-10172(t~1e4)':range(10112,10173)}
res={}
for name,rng in wins.items():
    fails={str(h):0 for h in H}; mn={str(h):1 for h in H}; N=0; tlo=thi=None
    for n in rng:
        rho=mpc(0.5,im(zetazero(n))); N+=1
        if tlo is None: tlo=float(rho.imag)
        thi=float(rho.imag)
        for h in H:
            v=q(xi,rho,h)
            if v<0: fails[str(h)]+=1
            mn[str(h)]=min(mn[str(h)],float(v))
    res[name]={'N':N,'t':[tlo,thi],'fails':fails,'min_q':mn}
    print(name,res[name],time.time()-t0,flush=True)
out['zeta']=res
# GAM fake: zeros of gam(1/2+it)
def zeros_on_line(X,a,b,step):
    zs=[];t=mpf(a);f0=re(X(mpc(0.5,t)))
    while t<b:
        t1=t+step;f1=re(X(mpc(0.5,t1)))
        if f0*f1<0:
            zs.append(findroot(lambda u: re(X(mpc(0.5,u))),(t,t1),solver='anderson'))
        t,f0=t1,f1
    return zs
res={}
for name,(a,b,st) in {'t10-200':(10,200,0.2),'t1000-1040':(1000,1040,0.1),'t10000-10030':(10000,10030,0.05)}.items():
    zs=zeros_on_line(gam,a,b,st)
    fails={str(h):0 for h in H}; mn={str(h):1 for h in H}
    for z in zs:
        for h in H:
            v=q(gam,mpc(0.5,z),h)
            if v<0: fails[str(h)]+=1
            mn[str(h)]=min(mn[str(h)],float(v))
    res[name]={'N':len(zs),'fails':fails,'min_q':mn}
    print('GAM',name,res[name],time.time()-t0,flush=True)
out['GAM']=res
# DH: on-line zeros in three windows
res={}
for name,(a,b,st) in {'t0-200':(1,200,0.05),'t1000-1020':(1000,1020,0.03),'t10000-10008':(10000,10008,0.02)}.items():
    zs=zeros_on_line(dh,a,b,st)
    fails={str(h):0 for h in H}; mn={str(h):1 for h in H}
    for z in zs:
        for h in H:
            v=q(dh,mpc(0.5,z),h)
            if v<0: fails[str(h)]+=1
            mn[str(h)]=min(mn[str(h)],float(v))
    res[name]={'N_online':len(zs),'fails':fails,'min_q':mn}
    print('DH',name,res[name],time.time()-t0,flush=True)
out['DH']=res
# DH off-line zero check (map values)
for z in (mpc('0.8085171825','85.6993484854'),mpc('0.6508300806','114.1633427308')):
    out.setdefault('DH_offline',[]).append([str(z),str(abs(dh(z))/abs(dh(z+0.01)))])
json.dump(out,open(__file__.replace('screen.py','screen.json'),'w'),indent=1)
print('done',time.time()-t0)
