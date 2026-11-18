# Stage functions for the prime-built chain. s-plane; z = i(s-1/2), Im z = Re s - 1/2.
import mpmath as mp, json, sys, random
mp.mp.dps = 30
def primes(n):
    sv=[True]*(n+1); out=[]
    for i in range(2,n+1):
        if sv[i]:
            out.append(i)
            for j in range(i*i,n+1,i): sv[j]=False
    return out
PR = primes(500)
def Lam(s): return mp.pi**(-s/2)*mp.gamma(s/2)
def fac(p,s,u=1): return 1/(1-u*mp.mpf(p)**(-s))
def theta_p(p,s,u=1):   # f_p^#(s)/f_p(s), f^#(s)=conj f(1-conj s)
    return (1-u*mp.mpf(p)**(-s))/(1-mp.conj(u)*mp.mpf(p)**(s-1))
def theta_arch(s): return Lam(1-s)/Lam(s)
out={}
# T1 identity |theta_p|^2-1 = (p^(sig-1)-p^(-sig))(2cos(t log p)-p^(-sig)-p^(sig-1))/|1-p^(s-1)|^2
random.seed(1); mx=0
for _ in range(200):
    p=random.choice(PR[:20]); sg=mp.mpf(random.uniform(0.5,2.5)); t=mp.mpf(random.uniform(0,60)); s=mp.mpc(sg,t)
    lhs=abs(theta_p(p,s))**2-1
    rhs=(mp.mpf(p)**(sg-1)-mp.mpf(p)**(-sg))*(2*mp.cos(t*mp.log(p))-mp.mpf(p)**(-sg)-mp.mpf(p)**(sg-1))/abs(1-mp.mpf(p)**(s-1))**2
    mx=max(mx,abs(lhs-rhs)/(1+abs(lhs)))
out['T1_identity_max_rel_err']=mp.nstr(mx,5)
# T2 kernel diagonal at 20 points, X over primes <= 500
pts=[mp.mpc(a,b) for a in (0.55,0.75,0.95,1.05,1.5) for b in (3,14.5,40,200)]
def run_T2(u_of_p,label):
    rows=[]
    for s in pts:
        A=(s-1)*Lam(s); Ash=(-s)*Lam(1-s)        # assigned: (s-1) factor
        S=s*Lam(s);     Ssh=(1-s)*Lam(1-s)       # alternative: s factor
        th0=theta_arch(s); P=mp.mpf(1); Psh=mp.mpf(1)
        KA=[];KS=[];KN=[]
        for p in PR:
            u=u_of_p(p)
            P*=fac(p,s,u); Psh*=1/(1-mp.conj(u)*mp.mpf(p)**(s-1)); 
            d=4*mp.pi*(s.real-mp.mpf(1)/2)
            KA.append((abs(A*P)**2-abs(Ash*Psh)**2)/d)
            KS.append((abs(S*P)**2-abs(Ssh*Psh)**2)/d)
            KN.append((1-abs(th0*Psh/P)**2)/d)
        def summ(K):
            up=sum(1 for i in range(1,len(K)) if K[i]>K[i-1]); dn=len(K)-1-up
            return dict(up=up,down=dn,neg=sum(1 for k in K if k<0),
                        X2=mp.nstr(K[0],6),X47=mp.nstr(K[14],6),X499=mp.nstr(K[-1],6))
        rows.append(dict(s=[float(s.real),float(s.imag)],assigned=summ(KA),sfactor=summ(KS),normalised=summ(KN)))
    out['T2_'+label]=rows
run_T2(lambda p:1,'zeta')
run_T2(lambda p:-1,'liouville')
random.seed(7); UU={p:mp.expj(random.uniform(0,2*mp.pi)) for p in PR}
run_T2(lambda p:UU[p],'randomU')
# limit in Re s>1: compare K_X (assigned) at X=499 with Hardy value |E_inf|^2/(4 pi Im w) and with K of E_inf
lim=[]
for s in (mp.mpc(2,10),mp.mpc(1.5,40),mp.mpc(3.5,7)):
    P=mp.mpf(1);Psh=mp.mpf(1)
    for p in PR: P*=fac(p,s); Psh*=fac(p,1-s)
    d=4*mp.pi*(s.real-0.5)
    KX=(abs((s-1)*Lam(s)*P)**2-abs(s*Lam(1-s)*Psh)**2)/d
    Einf=(s-1)*Lam(s)*mp.zeta(s); Einfsh=(-s)*Lam(1-s)*mp.zeta(1-s)
    lim.append(dict(s=[float(s.real),float(s.imag)],K_X499=mp.nstr(KX,8),hardy=mp.nstr(abs(Einf)**2/d,8),
        K_limit_function=mp.nstr((abs(Einf)**2-abs(Einfsh)**2)/d,8),abs_theta_X499=mp.nstr(abs(s*Lam(1-s)*Psh/((s-1)*Lam(s)*P)),5)))
out['T2_limit_right_of_1']=lim
# T3 poles of Theta_X = theta_arch * prod theta_p in the upper half-plane
def Theta(s,X,u_of_p=lambda p:1):
    v=theta_arch(s)
    for p in PR:
        if p>X: break
        v*=theta_p(p,s,u_of_p(p))
    return v
T3=[]
for X in (2,47,499):
    for s0 in (mp.mpf(3),mp.mpf(5),mp.mpc(1,2*mp.pi/mp.log(2)),mp.mpf(1)):
        e=mp.mpf(10)**-8
        T3.append(dict(X=X,s0=mp.nstr(s0,8),eps_times_Theta=mp.nstr(e*Theta(s0+e,X),8)))
out['T3_residues']=T3
if __name__=="__main__": json.dump(out,open("stage_T123.json","w"),indent=1)
if __name__=="__main__":
    print(json.dumps({k:out[k] for k in ('T1_identity_max_rel_err','T2_limit_right_of_1','T3_residues')},indent=0))
    for lab in ('zeta','liouville','randomU'):
        print(lab)
        for r in out['T2_'+lab]:
            print(r['s'],'A',r['assigned'],'| S',r['sfactor'],'| N',r['normalised'])
