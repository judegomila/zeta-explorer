# Stage-B check 2: (a) Lemma R at the predicted point; (b) threshold in T for zeta and BLS-sym. MEASURED.
import mpmath as mp, random, json, sys
from gram import *
mp.mp.dps=50
random.seed(17)
def mk(zs):
    th=blaschke(zs); return lambda u: M_zeta(mp.mpc(u))*th(u)
def sym(a): a=mp.mpc(a); b=1-mp.conj(a); return [a,mp.conj(a),b,mp.conj(b)]
out={'lemmaR':[], 'threshold':{}}
print('(a) Lemma R: normalised diagonal K_T(lam,lam)*|eps|^2 at lam=(1-a+eps, a)')
for name,zs,a in [('unpaired a=0.8+3i',[mp.mpc('0.8','3'),mp.mpc('0.8','-3')],mp.mpc('0.8','3')),
                  ('unpaired a=0.2+3i',[mp.mpc('0.2','3'),mp.mpc('0.2','-3')],mp.mpc('0.2','3')),
                  ('unpaired a=1.3+3i',[mp.mpc('1.3','3'),mp.mpc('1.3','-3')],mp.mpc('1.3','3')),
                  ('sym a=0.3+3i',sym(mp.mpc('0.3','3')),mp.mpc('0.3','3')),
                  ('sym a=0.3+3i at partner',sym(mp.mpc('0.3','3')),mp.mpc('0.7','3'))]:
    M=mk(zs)
    for t in (0,2,6):
        T=(mp.mpf(t),mp.mpf(t)); row=[]
        for e in ('1e-2','1e-4','1e-6'):
            eps=mp.mpf(e)*mp.mpc(1,"0.37"); lam=(1-a+eps,a); o=orbit(lam,M); k=K(o,o,T).real
            row.append(mp.nstr(k*abs(eps)**2,8))
        # prediction: |r M(1-a)|^2 e^{2 Re<(a,-1),T>}/(2 Re a * (-2)),  r = residue of M at 1
        r=1/xi(mp.mpf(2)); pred=abs(r*M(1-a))**2*mp.exp(2*pair((a.real,mp.mpf(-1)),T))/(-4*a.real)
        print(name,'t=',t,row,'predicted limit',mp.nstr(pred,8)); out['lemmaR'].append({'case':name,'t':t,'eps2K':row,'pred':mp.nstr(pred,8)})
print('(b) thresholds')
def rnd_pt(remax=1.5,immax=6):
    return (mp.mpc(random.uniform(0.05,remax),random.uniform(-immax,immax)),mp.mpc(random.uniform(0.05,remax),random.uniform(-immax,immax)))
sets=[[rnd_pt() for _ in range(5)] for _ in range(10)]
singles=[rnd_pt(1.2,5) for _ in range(200)]
cases={'zeta':lambda u: M_zeta(mp.mpc(u)),'BLS-sym 0.3+3i':mk(sym(mp.mpc('0.3','3'))),'BLS-sym 0.1+1i':mk(sym(mp.mpc('0.1','1'))),'BLS-sym 0.3+40i':mk(sym(mp.mpc('0.3','40'))),'BLS-sym 0.45+2i':mk(sym(mp.mpc('0.45','2')))}
dirs={'(t,t)':(1,1),'(t,0)':(1,0),'(0,t)':(0,1)}
for name,M in cases.items():
    out['threshold'][name]={}
    for dn,d in dirs.items():
        row=[]
        for t in ('0','-0.05','-0.1','-0.2','-0.35','-0.5','-0.75','-1'):
            T=(mp.mpf(t)*d[0],mp.mpf(t)*d[1])
            worst=mp.inf
            for S in sets:
                me,_=min_eig_normalised(gram(S,M,T)); worst=min(worst,me)
            dneg=0
            for p in singles:
                o=orbit(p,M); dneg+= (K(o,o,T).real<0)
            row.append((t,mp.nstr(worst,4),int(dneg)))
        print(name,dn,row); sys.stdout.flush(); out['threshold'][name][dn]=row
json.dump(out,open('tmp/research-2026-11-16/push/c16-u6g-scattering-fe-rank2-bridge-stage-a/run2.json','w'),indent=1)
