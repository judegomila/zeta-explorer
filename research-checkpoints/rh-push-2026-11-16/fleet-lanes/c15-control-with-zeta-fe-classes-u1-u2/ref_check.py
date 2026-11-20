# same-lane re-check by different routes (not an independent referee)
import json, mpmath as mp
mp.mp.dps=30
out={}
g1,g2=[mp.zetazero(k).imag for k in (6709,6710)]; gb=(g1+g2)/2; d=(g2-g1)/2; eta=mp.mpf('0.25')
old=[mp.mpc(0.5,g1),mp.mpc(0.5,-g1),mp.mpc(0.5,g2),mp.mpc(0.5,-g2)]
new=[mp.mpc(0.5+eta,gb),mp.mpc(0.5-eta,gb),mp.mpc(0.5+eta,-gb),mp.mpc(0.5-eta,-gb)]
def m(s):   # product over zeros, not the t^2 form
    r=mp.mpf(1)
    for n in new: r*=(s-n)
    for o in old: r/=(s-o)
    return r
G=lambda s: mp.zeta(s)*m(s)
# R1 symmetry and reality of m
s=mp.mpc('0.37','11.3')
out['m_symmetry_defect']=float(abs(m(s)-m(1-s))); out['m_reality_defect']=float(abs(m(mp.conj(s))-mp.conj(m(s))))
# R2 zero count of G and of zeta in the box 0.55<Re<1.5, 7004<Im<7006 by the argument principle on the boundary
def boxcount(f,x0,x1,y0,y1,n=1500):
    P=[mp.mpc(x0,y0),mp.mpc(x1,y0),mp.mpc(x1,y1),mp.mpc(x0,y1),mp.mpc(x0,y0)]
    tot=0
    for a,b in zip(P,P[1:]):
        prev=f(a)
        for k in range(1,n+1):
            cur=f(a+(b-a)*k/n); tot+=mp.arg(cur/prev); prev=cur
    return float(tot/(2*mp.pi))
out['box_right_of_line_G']=boxcount(G,0.55,1.5,7004,7006)
out['box_right_of_line_zeta']=boxcount(mp.zeta,0.55,1.5,7004,7006)
out['box_across_line_G']=boxcount(G,-0.5,1.5,7004.9,7005.3)
out['box_across_line_zeta']=boxcount(mp.zeta,-0.5,1.5,7004.9,7005.3)
# R3 partial fractions of 1/m: 1/m = 1 + sum R/(s-rho'), R = 1/m'(rho')
R=[1/mp.diff(m,n) for n in new]
out['one_over_m_partial_fraction_defect']=float(abs(1/m(s)-1-sum(r/(s-n) for r,n in zip(R,new))))
out['C_E']=float(sum(abs(r) for r in R))
# R4 bound sup|D| <= 8 e^-2 (eta^2+d^2)/(1/2-eta)^2 on a fine grid with log x up to 200, three parameter sets
def supD(gb,d,eta):
    f=lambda L: abs(4*mp.e**(-L/2)*mp.cos(gb*L)*(mp.cosh(eta*L)-mp.cos(d*L)))
    return max(f(mp.mpf(k)/500) for k in range(1,100000))
rows=[]
for (d_,e_) in ((d,mp.mpf('0.01')),(d,mp.mpf('0.25')),(mp.mpf('3.4436572485'),mp.mpf('0.3')),(mp.mpf('0.001'),mp.mpf('0.001')),(mp.mpf('0.5'),mp.mpf('0.45'))):
    rows.append([float(d_),float(e_),float(supD(gb,d_,e_)),float(8*mp.e**-2*(e_**2+d_**2)/(mp.mpf(1)/2-e_)**2)])
out['supD_vs_bound_rows_[d,eta,sup,bound]']=rows; out['bound_holds_all']=all(r[2]<=r[3] for r in rows)
# R5 -G'/G at s=3 equals sum Lambda(n) n^-s + int x^-s D(x) dx (the integral in closed form by partial fractions)
s3=mp.mpf(3)
lhs=-mp.diff(G,s3)/G(s3)
rhs=-mp.diff(mp.zeta,s3)/mp.zeta(s3)+sum(1/(s3-o) for o in old)-sum(1/(s3-n) for n in new)
out['log_derivative_split_defect']=float(abs(lhs-rhs))
# R6 Lemma L sanity: for SG (D <= 0) and its sign-reversed density -D >= 0 the function exp(int) has a real pole, not a zero
b=mp.mpf('0.3'); g=mp.zetazero(1).imag
minv=lambda s: ((s-mp.mpc(0.5,g))*(s-mp.mpc(0.5,-g)))/((s-0.5-b)*(s-0.5+b))
out['sign_reversed_SG_has_real_pole_at_0.8']=float(abs(minv(mp.mpf('0.8')+mp.mpf('1e-12'))))
json.dump(out,open(__file__.replace('ref_check.py','ref_check.json'),'w'),indent=1); print(json.dumps(out,indent=1))
