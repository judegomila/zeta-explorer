# Second-pass checks written after the lane's runs, from the statements in RESULT.md (not from run2.py).
import mpmath as mp, json
from gram import xi, M_zeta, blaschke, orbit, K, pair
mp.mp.dps=40
out={}
r=1/xi(mp.mpf(2))
# C1 Lemma R limit, with the residue of the control (r_B = r*Theta(1)).
rows=[]
for a in (mp.mpc('0.8','3'),mp.mpc('0.2','3'),mp.mpc('0.35','1.5'),mp.mpc('1.3','3')):
    th=blaschke([a,mp.conj(a)]); M=lambda u: M_zeta(mp.mpc(u))*th(u)
    rB=r*th(mp.mpf(1)); A=a.real
    for T in ((mp.mpf(0),mp.mpf(0)),(mp.mpf('0.7'),mp.mpf('1.9'))):
        eps=mp.mpf('1e-9')*mp.mpc('0.6','-0.8'); lam=(1-a+eps,a); o=orbit(lam,M)
        meas=K(o,o,T).real*abs(eps)**2
        pred=rB*abs(M(1-a))**2*mp.exp(pair((2*A-1,mp.mpf(0)),T))*(1/(2*A-1)-rB*mp.exp(-T[1])/(4*A))
        rows.append([mp.nstr(a,4),[float(T[0]),float(T[1])],mp.nstr(meas,10),mp.nstr(pred,10),mp.nstr(abs(meas-pred)/abs(pred),3)])
out['C1_lemmaR']=rows
# C2 scalar form (*) against the 36-term formula, for a control with the pair a, 1-conj(a).
rows=[]
for eta,g in (('0.2','3'),('0.05','7'),('0.4','1')):
    eta=mp.mpf(eta); a=mp.mpc(mp.mpf('0.5')-eta,g); b=1-mp.conj(a)
    th=blaschke([a,mp.conj(a),b,mp.conj(b)]); M=lambda u: M_zeta(mp.mpc(u))*th(u)
    for t1,t2 in ((0,0),(0.4,1.3)):
        T=(mp.mpf(t1),mp.mpf(t2)); x=2*eta
        lam=(a,x+mp.mpc(0,'1e-12')); o=orbit(lam,M); meas=K(o,o,T).real
        Mr=lambda u: (M_zeta(mp.mpc(u))*th(u)).real
        m=Mr(x); dm=mp.diff(Mr,x); A=a.real
        E0=mp.exp((2*A+x)*(2*T[0]+T[1])/3)
        Q=mp.e**(x*T[1])/(4*A*x)-m*m*mp.e**(-x*T[1])/(4*(A+x)*x)-(dm-m*T[1]-m/(2*A+x))/(2*A+x)
        rows.append([mp.nstr(a,4),[t1,t2],mp.nstr(meas,10),mp.nstr(E0*Q,10),mp.nstr(abs(meas-E0*Q)/abs(meas),3)])
out['C2_star']=rows
# C3 differential-operator form: Theta cocycle = ctilde(w lam)/ctilde(lam), ctilde(nu)=prod_{alpha>0} g(nu_alpha), g(u)=prod (u+conj a_j).
zs=[mp.mpc('0.3','3'),mp.mpc('0.3','-3'),mp.mpc('0.9','1'),mp.mpc('0.9','-1')]
th=blaschke(zs); g=lambda u: mp.fprod([(u+mp.conj(z)) for z in zs]); sgn=(-1)**len(zs)
ct=lambda nu: g(nu[0])*g(nu[1])*g(nu[0]+nu[1])
lam=(mp.mpc('0.37','1.1'),mp.mpc('0.52','-0.4')); o=orbit(lam,th)
out['C3_Dg_max_defect']=mp.nstr(max(abs(c-ct(nu)/ct(lam)) for nu,c in o),3)
# C4 symmetric polynomial multiplier is a Blaschke factor: P(u)/P(u+1) with P(s)=prod (s-a_j), zero set closed under a->1-a and conj.
a=mp.mpc('0.3','3'); Z=[a,mp.conj(a),1-a,1-mp.conj(a)]
P=lambda s: mp.fprod([s-z for z in Z]); th=blaschke(Z); u=mp.mpc('0.44','2.2')
out['C4_poly_vs_blaschke']=mp.nstr(abs(P(u)/P(u+1)-th(u)),3)
# C5 T-shift along rho^vee equals M -> e^{-tu} M up to the factor e^{t<lam+conj mu, rho^vee>}.
M=lambda u: M_zeta(mp.mpc(u)); t=mp.mpf('0.37'); Mt=lambda u: mp.exp(-t*u)*M_zeta(mp.mpc(u))
mu=(mp.mpc('0.61','-1.7'),mp.mpc('0.25','2.3')); T=(mp.mpf('0.2'),mp.mpf('0.5'))
k1=K(orbit(lam,M),orbit(mu,M),(T[0]+t,T[1]+t)); k2=K(orbit(lam,Mt),orbit(mu,Mt),T)*mp.exp(t*(lam[0]+lam[1]+mp.conj(mu[0])+mp.conj(mu[1])))
out['C5_shift_defect']=mp.nstr(abs(k1-k2)/abs(k1),3)
for k,v in out.items(): print(k,v)
json.dump(out,open('tmp/research-2026-11-16/push/c16-u6g-scattering-fe-rank2-bridge-stage-a/ref_checks.json','w'),indent=1)
