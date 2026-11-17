# Checks of the Lee-Yang lemma at k=8 (256 terms): zeros in a wide box vs in a thin strip about the predicted line.
from lib import *
k=8; P=first_primes(k); lp=np.log(P); L=lp.sum(); ln,mu=subset_logs(lp); T0,T1=0.37,40.0
rng=np.random.default_rng(1)
def count(coef,logs,line,label,w=0.02):
    f=lambda z: dsum(coef,logs,z)
    wide,_=winding(f,complex(-1.5,T0),complex(2.5,T1),20000); thin,st=winding(f,complex(line-w,T0),complex(line+w,T1),20000)
    print(f"{label:58s} zeros in box Re in[-1.5,2.5]: {wide:8.3f}   in strip |Re s-{line}|<{w}: {thin:8.3f}   (max arg step {st:.2f})")
    return round(wide),round(thin)
out={}
out['rank1 c=1/2']=count(mu*np.exp(ln**2/(2*L)),ln,0.5,"rank-one, c=1/2")
out['rank1 c=0.3']=count(mu*np.exp(0.3*ln**2/L),ln,0.3,"rank-one, c=0.3 (line moved by choice of c)")
out['rank1 c=0.8']=count(mu*np.exp(0.8*ln**2/L),ln,0.8,"rank-one, c=0.8")
out['backward heat']=count(mu*np.exp(-0.5*ln**2/(2*L)),ln,-0.25,"backward heat t<0 (a_pq>1): formal line -1/4")
M=np.exp(rng.normal(size=(k,k))); M=(M+M.T)/2
J,res=scale_rows(M,0.5*lp); Q=pair_form(J)
out['general J']=count(mu*np.exp(Q),ln,0.5,f"random ferromagnetic J, row sums (1/2)log p (res {res:.1e})")
eps=np.array([1,-1,1,-1,-1,1,-1,-1.]); mue=np.ones(1)
for e in eps: mue=np.concatenate([mue,-e*mue])
out['sign twist']=count(mue*np.exp(Q),ln,0.5,"same J, completely multiplicative sign twist")
B=P*(1+0.1*np.sin(np.arange(1,k+1))); lb=np.log(B); lnb,_=subset_logs(lb)
Jb,res=scale_rows(M,0.5*lb); out['beurling']=count(mu*np.exp(pair_form(Jb)),lnb,0.5,"Beurling primes p_j(1+0.1 sin j), random J")
# relaxed rows: R_p = c_p log p, c_p<=1/2 non-constant -> zeros in the strip min c_p <= Re s <= max c_p, not on a line
cp=0.5*(1-0.6*lp/lp[-1]); Jr,res=scale_rows(M,cp*lp); out['relaxed']=count(mu*np.exp(pair_form(Jr)),ln,0.35,"row sums c_p log p, c_p in [0.2,0.44] (strip, w=0.16)",w=0.16)
# E_a: two sites per prime with fields p^{+-a}: zeros of prod(1-p^{-s-a})(1-p^{-s+a}) coupled mean-field
a=0.2; l2=np.concatenate([lp,lp]); sh=np.concatenate([np.full(k,a),np.full(k,-a)]); L2=l2.sum()
ln2,mu2=subset_logs(l2); shs,_=subset_logs(sh)   # sum of shifts
out['E_a']=count(mu2*np.exp(ln2**2/(2*L2)-shs),ln2,0.5,"E_a two-site gas a=0.2 (strip |Re s-1/2|<=a, w=0.21)",w=0.21)
count(mu2*np.exp(ln2**2/(2*L2)-shs),ln2,0.5,"E_a two-site gas a=0.2: thin strip w=0.02",w=0.02)
json.dump(out,open(HERE+"/selftest.json","w"))
