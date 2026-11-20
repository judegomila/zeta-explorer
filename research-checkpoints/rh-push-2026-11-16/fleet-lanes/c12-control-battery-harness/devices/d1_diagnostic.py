"""D1 diagnostic: the recorded zero finder of c11-rs3 screen.py (mpmath findroot, solver anderson, default tolerance) re-run in the
window 1000 < t < 1020 and compared with the battery zeros. Usage: python d1_diagnostic.py <tables>"""
import sys, json; tables=sys.argv[1]
from mpmath import mp, mpf, mpc, zeta, loggamma, exp, log, pi, findroot, sqrt, im, re, diff
mp.dps=30
kap=(sqrt(10-2*sqrt(5))-2)/(sqrt(5)-1); chi=[0,1,mpc(0,1),mpc(0,-1),-1]
def Lchi(s,conj=False):
    tot=0
    for a in range(1,5):
        c=chi[a].conjugate() if conj else chi[a]; tot+=c*zeta(s,mpf(a)/5)
    return tot*mpf(5)**(-s)
def dh(s):
    f=(1-1j*kap)/2*Lchi(s)+(1+1j*kap)/2*Lchi(s,True)
    return exp(s/2*log(5/pi)+loggamma((s+1)/2))*f
def q(X,rho,h):
    d=diff(X,rho); v=X(rho+h); return -re(d*v)/(abs(d)*abs(v))
# record's zero finder
def zeros_on_line(X,a,b,step):
    zs=[];t=mpf(a);f0=re(X(mpc(0.5,t)))
    while t<b:
        t1=t+step;f1=re(X(mpc(0.5,t1)))
        if f0*f1<0: zs.append(findroot(lambda u: re(X(mpc(0.5,u))),(t,t1),solver='anderson'))
        t,f0=t1,f1
    return zs
rec=zeros_on_line(dh,1000,1020,0.03)
mine=[mpf(g) for g in json.load(open(tables+'/zeros_DH.json'))['online'] if 1000<float(g)<1020]
print(len(rec),len(mine))
rows=[]
for a,b in zip(rec,mine):
    rows.append(dict(record_method_ordinate=mp.nstr(a,22), battery_ordinate=mp.nstr(b,22), difference=float(a-b), q1_at_record_ordinate=float(q(dh,mpc(0.5,a),1)), q1_at_battery_ordinate=float(q(dh,mpc(0.5,b),1)), newton_residual_at_record_ordinate=float(abs(dh(mpc(0.5,a)))/abs(diff(dh,mpc(0.5,a))))))
    print(mp.nstr(a,20), mp.nstr(a-b,5), 'q1 rec-zero', mp.nstr(q(dh,mpc(0.5,a),1),12), 'q1 battery-zero', mp.nstr(q(dh,mpc(0.5,b),1),12), '|dh| rec', mp.nstr(abs(dh(mpc(0.5,a)))/abs(diff(dh,mpc(0.5,a))),3))
json.dump(dict(window='DH on-line zeros, 1000 < t < 1020', rows=rows, min_q1_record_method=min(r['q1_at_record_ordinate'] for r in rows), min_q1_battery=min(r['q1_at_battery_ordinate'] for r in rows), recorded_min_q1=-0.3348103021277858, max_ordinate_error_of_record_method=max(abs(r['difference']) for r in rows)), open(tables+'/device_D1_diagnostic.json','w'), indent=1)
