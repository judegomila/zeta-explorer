from mpmath import *
import json
mp.dps=40
d=json.load(open('../cell2_q5_p1_L_T500.json')); rec=d['records']
print('records',len(rec),'in strip & ball_ok & wn 1:',sum(1 for r in rec if r.get('in_strip') and r.get('ball_ok') and r.get('ball_wn','').startswith('[1.0000000')),'max sigma',max(float(r['sigma']) for r in rec if r.get('in_strip')))
c5={1:1,2:1j,3:-1j,4:-1}
def L5(s,cj=False): return mpf(5)**(-s)*fsum((conj(c5[a]) if cj else c5[a])*zeta(s,mpf(a)/5) for a in range(1,5))
def w0(s): return 1/(L5(s)*L5(2-s,True))+1/(L5(s,True)*L5(2-s))
r=mpc(rec[1]['sigma'],rec[1]['t'])
print('second zero',nstr(r,15),'|w0|',nstr(abs(w0(r)),4),'|w0(r+1e-3)|',nstr(abs(w0(r+mpf('0.001'))),4))
N=48; rad=mpf(10)**-6; tot=0; prev=w0(r+rad)
for j in range(1,N+1):
    cur=w0(r+rad*exp(2j*pi*j/N)); tot+=arg(cur/prev); prev=cur
print('winding',nstr(tot/(2*pi),10))
def G(s): return (mpf(5)/pi)**(s/2)*gamma((s+1)/2)
def m(s): return 2*cosh((s-mpf(1)/2)*log(2))+mpf(5)/2
def S(t,nr=False):
    out=[]
    for cj in (False,True):
        a=G(mpc(0.5,t))*L5(mpc(0.5,t),cj); b=G(mpc(1.5,t))*L5(mpc(1.5,t),cj)
        if nr: a*=m(mpc(0.5,t)); b*=m(mpc(1.5,t))
        out.append(a*conj(b))
    return fsum(re(x) for x in out)/fsum(abs(x) for x in out)
for t in (8.5,8.55,8.6): print('q5 pair S_v',t,nstr(S(mpf(t)),6))
for t in (3.2,3.23,3.24,3.3,4.0): print('q5 pair T-NR S_v',t,nstr(S(mpf(t),True),6),' zeta-family at same t',nstr(S(mpf(t)),6))
