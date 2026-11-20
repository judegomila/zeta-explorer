# Stage-B check 3: adversarial search for a negative direction of the rank-2 Gram form at T >= 0
# for the controls that survive Lemma R (BLS-sym, BLS-right) and for zeta as baseline. MEASURED, mpmath 30 digits.
import mpmath as mp, random, json, sys
from gram import *
mp.mp.dps=30
random.seed(18)
def mk(zs):
    th=blaschke(zs); return lambda u: M_zeta(mp.mpc(u))*th(u)
def sym(a): a=mp.mpc(a); b=1-mp.conj(a); return [a,mp.conj(a),b,mp.conj(b)]
def pr(a): a=mp.mpc(a); return [a,mp.conj(a)]
cases={
 'zeta':(lambda u: M_zeta(mp.mpc(u)),[mp.mpc('0.5','14.134725')]),
 'BLS-sym 0.3+3i':(mk(sym(mp.mpc('0.3','3'))),sym(mp.mpc('0.3','3'))),
 'BLS-sym 0.45+2i':(mk(sym(mp.mpc('0.45','2'))),sym(mp.mpc('0.45','2'))),
 'BLS-sym 0.05+0.5i':(mk(sym(mp.mpc('0.05','0.5'))),sym(mp.mpc('0.05','0.5'))),
 'BLS-right 0.8+3i':(mk(pr(mp.mpc('0.8','3'))),pr(mp.mpc('0.8','3'))),
 'BLS-right 0.55+1i':(mk(pr(mp.mpc('0.55','1'))),pr(mp.mpc('0.55','1'))),
 'BLS-right 1.6+2i':(mk(pr(mp.mpc('1.6','2'))),pr(mp.mpc('1.6','2'))),
}
Ts=[(mp.mpf(0),mp.mpf(0)),(mp.mpf('0.3'),mp.mpf(0)),(mp.mpf(0),mp.mpf('0.3')),(mp.mpf(1),mp.mpf(1))]
def special(zs):
    S=list(zs)+[1-z for z in zs]+[mp.mpc(1),mp.mpc('0.5')]
    for z in zs:
        for w in zs:
            d=w-z
            if d.real>0.01: S.append(d)
    return S
def draw(S):
    def coord():
        if random.random()<0.6:
            s=random.choice(S); sc=10**random.uniform(-3,-0.5)
            z=s+sc*mp.mpc(random.gauss(0,1),random.gauss(0,1))
        else:
            z=mp.mpc(random.uniform(0.02,1.6),random.uniform(-5,5))
        return z
    while True:
        z1,z2=coord(),coord()
        if random.random()<0.3: z1=random.choice(S)-z2+10**random.uniform(-3,-1)*mp.mpc(random.gauss(0,1),random.gauss(0,1))
        if z1.real>0.01 and z2.real>0.01 and abs(z1-1)>1e-4 and abs(z2-1)>1e-4 and abs(z1+z2-1)>1e-4: return (z1,z2)
def score(S_,M,T):
    try:
        me,_=min_eig_normalised(gram(S_,M,T))
    except ZeroDivisionError:
        return mp.inf
    return me
out={}
for name,(M,zs) in cases.items():
    S=special(zs); out[name]={}
    for T in Ts:
        best=[]
        for it in range(160):
            n=random.choice([1,2,3,3])
            pts=[draw(S) for _ in range(n)]
            best.append((score(pts,M,T),pts))
        best.sort(key=lambda x:x[0])
        # local descent on the five lowest
        lows=[]
        for sc,pts in best[:5]:
            cur,curp=sc,pts
            for it in range(40):
                step=10**random.uniform(-3,-1)
                newp=[(p[0]+step*mp.mpc(random.gauss(0,1),random.gauss(0,1)),p[1]+step*mp.mpc(random.gauss(0,1),random.gauss(0,1))) for p in curp]
                if any(p[0].real<0.005 or p[1].real<0.005 for p in newp): continue
                s2=score(newp,M,T)
                if s2<cur: cur,curp=s2,newp
            lows.append((cur,curp))
        lows.sort(key=lambda x:x[0])
        w=lows[0]
        rec={'min_norm_eig_random':mp.nstr(best[0][0],6),'min_after_descent':mp.nstr(w[0],6),'n_negative_random':int(sum(1 for b in best if b[0]< -mp.mpf(10)**-20)),'of':len(best),'argmin':[[mp.nstr(p[0],8),mp.nstr(p[1],8)] for p in w[1]]}
        out[name][f'T=({float(T[0])},{float(T[1])})']=rec
        print(name,f'T=({float(T[0])},{float(T[1])})',{k:v for k,v in rec.items() if k!='argmin'}); sys.stdout.flush()
json.dump(out,open('tmp/research-2026-11-16/push/c16-u6g-scattering-fe-rank2-bridge-stage-a/run3.json','w'),indent=1)
