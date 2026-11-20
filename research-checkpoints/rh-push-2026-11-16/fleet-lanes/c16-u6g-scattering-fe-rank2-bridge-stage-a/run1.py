# Stage-B check 1: rank-2 Gram form for zeta and for scattering-level controls. MEASURED (mpmath, 50 digits), no interval certificate.
import mpmath as mp, random, json, sys
from gram import *
mp.mp.dps=50
random.seed(16)
def mk(zs): 
    th=blaschke(zs); return lambda u: M_zeta(mp.mpc(u))*th(u)
a_s=mp.mpc('0.3','3'); b_s=1-mp.conj(a_s)
a_r=mp.mpc('0.8','3')
ea=mp.mpf('0.2')
cases={
 'zeta': lambda u: M_zeta(mp.mpc(u)),
 'BLS-sym a=0.3+3i (zeros a, 1-conj a, conjugates)': mk([a_s,mp.conj(a_s),b_s,mp.conj(b_s)]),
 'BLS-sym a=0.1+1i': mk([mp.mpc('0.1','1'),mp.mpc('0.1','-1'),mp.mpc('0.9','1'),mp.mpc('0.9','-1')]),
 'BLS-unpaired a=0.8+3i': mk([a_r,mp.conj(a_r)]),
 'BLS-unpaired a=0.2+3i': mk([mp.mpc('0.2','3'),mp.mpc('0.2','-3')]),
 'E_a a=0.2: M(u+a)M(u-a)': lambda u: M_zeta(mp.mpc(u)+ea)*M_zeta(mp.mpc(u)-ea),
 'Theta alone (zeros 0.3+3i, conj)': blaschke([a_s,mp.conj(a_s)]),
}
def rnd_pt(remax=1.5,immax=6):
    return (mp.mpc(random.uniform(0.05,remax),random.uniform(-immax,immax)),mp.mpc(random.uniform(0.05,remax),random.uniform(-immax,immax)))
Ts=[(mp.mpf(t),mp.mpf(t)) for t in (0,0.5,1,2)]
sets=[[rnd_pt() for _ in range(5)] for _ in range(12)]
singles=[rnd_pt(1.2,5) for _ in range(300)]
out={}
for name,M in cases.items():
    res={}
    for T in Ts:
        worst=mp.inf; nneg=0
        for S in sets:
            G=gram(S,M,T); me,_=min_eig_normalised(G)
            worst=min(worst,me); nneg+= (me< -mp.mpf(10)**-30)
        dmin=mp.inf; dneg=0; arg=None
        for p in singles:
            o=orbit(p,M); k=K(o,o,T).real; kn=k/mp.exp(2*pair((p[0].real,p[1].real),T))*(4*p[0].real*p[1].real)
            if kn<dmin: dmin=kn; arg=p
            dneg+= (k<0)
        res[str(float(T[0]))]={'gram5_min_norm_eig':mp.nstr(worst,6),'gram5_negative_sets':int(nneg),'of':len(sets),'diag_min_ratio_to_identity_term':mp.nstr(dmin,6),'diag_negative':int(dneg),'of_pts':len(singles),'argmin':[mp.nstr(arg[0],6),mp.nstr(arg[1],6)]}
        print(name,'| t=',float(T[0]),res[str(float(T[0]))]); sys.stdout.flush()
    out[name]=res
json.dump(out,open('tmp/research-2026-11-16/push/c16-u6g-scattering-fe-rank2-bridge-stage-a/run1.json','w'),indent=1)
