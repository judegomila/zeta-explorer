# Analysis of h5sieve output: one-sided statistic D_sigma(Y) and the harmonic statistic v_Y(s) on K.
# usage: h5an.py h5_TAG.bin out_prefix [tstep]
import sys, json, math, numpy as np
from h5lib import *
import mpmath as mp
mp.mp.dps=40
try:
    from scipy.special import expi, exp1
    HAVE=True
except Exception:
    HAVE=False
d=load_multi(sys.argv[1].split(',')); pre=sys.argv[2]; tstep=float(sys.argv[3]) if len(sys.argv)>3 else 0.25
NB=d['NB']; X=d['X']; LD=d['G'].dtype
jmax=int(np.searchsorted(d['B'],X,side='right'))-1   # complete blocks 0..jmax-1 (primes < B[jmax] <= X)
j0=int(math.ceil(BPU*math.log(2.0)))+1
jj=np.arange(j0,jmax+1)                               # checkpoint after block j-1: Y = exp(j/BPU) >= 2
logY=jj/BPU; Y=np.exp(logY)
print('blocks',NB,'complete',jmax,'Ymax',Y[-1],'primes',int(d['C'][:jmax].sum()),'dtype',LD)
def Ei_real(x):  # array of real x != 0, high precision
    return np.array([mp.ei(mp.mpf(float(v))) for v in x],dtype=object)
def Eint_real(sig):   # int_2^Y u^-sig du/log u = Ei((1-sig) log Y) - Ei((1-sig) log 2), longdouble
    a=1-sig
    v=Ei_real(a*logY); c=mp.ei(mp.mpf(a)*mp.log(2))
    return np.array([LD(str(mp.nstr(x-c,25))) if LD is np.longdouble else float(x-c) for x in v],dtype=LD)
def cum(si,fi): return np.cumsum(real_col(d,si,fi)[:jmax])[j0-1:]
dec=[int(round(BPU*math.log(10.0)*k)) for k in range(1,14)]
dec=[j-(j0-1) for j in dec if j<=jmax]
NJ=len(jj)
def summ(name,series,sig,out,ref=None):
    s=np.asarray(series,dtype=np.float64)
    rs=np.maximum.accumulate(s); ri=np.minimum.accumulate(s)
    rec=dict(sigma=sig,final=float(s[-1]),sup=float(s.max()),Y_at_sup=float(Y[s.argmax()]),inf=float(s.min()),Y_at_inf=float(Y[s.argmin()]),
             at_decades={('1e%d'%(k+1)):float(s[j-1]) for k,j in enumerate(dec)},
             runsup_decades={('1e%d'%(k+1)):float(rs[j-1]) for k,j in enumerate(dec)},
             runinf_decades={('1e%d'%(k+1)):float(ri[j-1]) for k,j in enumerate(dec)})
    # envelope exponent: slope of log(max |s| over each decade * log Y) against log Y over the last 4 decades
    # envelope exponent theta_eff: |s(Y) - ref| ~ Y^(theta-sig)/log Y ; ref = limit if given, else the final value.
    # decade maxima of |s - ref| log Y over decades 1e3..1e(n-2); slope + sig
    r0=s[-1] if ref is None else ref
    rec['ref']=float(r0); rec['ref_kind']='final value' if ref is None else 'limit'
    xs=[];ys=[];dm={}
    for k in range(3,len(dec)-(2 if ref is None else 0)):
        seg=np.abs(s[dec[k-1]:dec[k]]-r0)*logY[dec[k-1]:dec[k]]; m=float(seg.max()); dm['1e%d'%(k+1)]=m
        if m>0: xs.append(logY[dec[k]-1]); ys.append(math.log(m))
    rec['decade_max_abs_tail_times_logY']=dm
    if len(xs)>=3: rec['theta_eff']=float(np.polyfit(xs,ys,1)[0]+sig)
    out[name]=rec
    return s
res={'X':X,'Ymax':float(Y[-1]),'real':{},'complex':{}}
series={}
FI={n:i for i,n in enumerate(FAM)}
def tnr_real(sig,q,c):
    b=math.acosh(c/2)/math.log(q); al=-q**(0.5+b); be=-q**(0.5-b)
    out=np.zeros(NJ); k=1
    while q**k<=Y[-1]:
        out[Y>=q**k]+=-(al**k+be**k)/k*q**(-k*sig); k+=1
    return out
for si,sig in enumerate(RS):
    E=Eint_real(sig); o={}
    z=cum(si,FI['all'])-E
    lim=float(mp.re(mp.primezeta(mp.mpf(str(sig)))+mp.ei((1-mp.mpf(str(sig)))*mp.log(2)))) if sig>0.5 else None
    series['zeta_%g'%sig]=summ('zeta',z,sig,o,ref=lim)
    zf=np.asarray(z,dtype=np.float64)
    if lim is not None: series['zeta_tailnorm_%g'%sig]=summ('zeta_tail_normalised_(D-limit)*Y^(sig-1/2)*logY',(zf-lim)*np.exp((sig-0.5)*logY)*logY,sig,o)
    summ('liouville_primes(-zeta)',-zf,sig,o)
    series['chi4_%g'%sig]=summ('chi4',cum(si,FI['chi4']),sig,o)
    summ('chi3',cum(si,FI['chi3']),sig,o)
    summ('chi5_re',cum(si,FI['m5_1'])-cum(si,FI['m5_4']),sig,o)
    summ('chi5_im',cum(si,FI['m5_2'])-cum(si,FI['m5_3']),sig,o)
    series['eps_%g'%sig]=summ('eps_random_sign',cum(si,FI['eps']),sig,o)
    series['thin_%g'%sig]=summ('THIN_b0.8(all-2S1-E)',z-2*cum(si,FI['S1']),sig,o)
    series['del_%g'%sig]=summ('DEL_b0.8(all-S2-E)',z-cum(si,FI['S2']),sig,o)
    # thin sets with their own main term removed: sum_S p^-sig - (1/2) int t^(b-1-sig)/log t
    Eb=Eint_real(sig+1-THIN_B)
    summ('S1_minus_own_main',cum(si,FI['S1'])-0.5*Eb,sig,o)
    summ('S2_minus_own_main',cum(si,FI['S2'])-Eb,sig,o)
    for (q,c) in ((3,2.2),(1000003,2.2),(3,2.02)):
        series['tnr_q%d_c%g_%g'%(q,c,sig)]=summ('TNR_q%d_c%g'%(q,c),zf+tnr_real(sig,q,c),sig,o)
    res['real']['%g'%sig]=o
# E_a with its own two poles removed, a = 0.15, sigma = 0.6: D_0.45 + D_0.75
o={}
ea=series['zeta_0.45']+series['zeta_0.75']; summ('EA_a0.15_sigma0.6_ownpoles',ea,0.6,o); res['real']['EA']=o
# ---- complex statistic on K
tg=np.arange(0,100+1e-9,tstep)
print('planned complex table %.1f MB per (sigma,family)'%(jmax*len(tg)*16/1e6))
def ccum(ksi,kfi): return np.cumsum(block_sums(d,ksi,kfi,tg)[:jmax],axis=0).real[j0-1:]
def Eint_cplx(sig):  # Re [Ei((1-s) log Y) - Ei((1-s) log 2)], s = sig + i t ; shape [jmax, nt]
    out=np.empty((NJ,len(tg)))
    a=1-sig
    if HAVE:
        z=(a-1j*tg[None,:])*logY[:,None]; z2=(a-1j*tg)*math.log(2)
        nz=tg!=0
        out[:,nz]=(-exp1(-z[:,nz])).real-(-exp1(-z2[nz])).real[None,:]
        if (~nz).any(): out[:,~nz]=(expi(a*logY)-expi(a*math.log(2)))[:,None]
    else:
        for i,t in enumerate(tg):
            c=mp.ei(mp.mpc(a,-t)*mp.log(2))
            out[:,i]=[float((mp.ei(mp.mpc(a,-t)*L)-c).real) for L in logY]
    return out
def tnr_cplx(sig,q,c):
    b=math.acosh(c/2)/math.log(q); al=-q**(0.5+b); be=-q**(0.5-b)
    out=np.zeros((NJ,len(tg))); k=1
    while q**k<=Y[-1]:
        out[Y>=q**k,:]+=(-(al**k+be**k)/k*np.exp(-k*(sig+1j*tg)*math.log(q))).real[None,:]; k+=1
    return out
KI={n:i for i,n in enumerate(KF)}
Msup={}
vfinal={}
for ksi,sig in enumerate(KS):
    E=Eint_cplx(sig)
    Sall=ccum(ksi,KI['all'])
    vz=Sall-E; del Sall
    fam={'zeta':vz}
    fam['TNR_q3_c2.2']=vz+tnr_cplx(sig,3,2.2)
    fam['THIN']=vz-2*ccum(ksi,KI['S1'])
    fam['DEL']=vz-ccum(ksi,KI['S2'])
    fam['chi4']=ccum(ksi,KI['chi4'])
    fam['eps']=ccum(ksi,KI['eps'])
    for n,v in fam.items():
        m=v.max(axis=1); am=v.argmax(axis=1)
        Msup.setdefault(n,[]).append((m,tg[am]))
        vfinal['%s_%g'%(n,sig)]=v[-1].copy()
        if n=='zeta': vfinal['zeta_mid_%g'%sig]=v[dec[len(dec)//2]-1].copy()
    del fam,vz,E
for n,lst in Msup.items():
    M=np.max(np.stack([m for m,_ in lst]),axis=0); which=np.argmax(np.stack([m for m,_ in lst]),axis=0)
    targ=np.choose(which,[t for _,t in lst])
    o={}
    summ('M',M,0.0,o); r=o['M']; r.pop('abs_env_slope_plus_sigma',None)
    r['sigma_at_sup']=KS[int(which[M.argmax()])]; r['t_at_sup']=float(targ[M.argmax()])
    r['per_sigma_sup']={('%g'%KS[i]):float(lst[i][0].max()) for i in range(len(KS))}
    r['per_sigma_final_max']={('%g'%KS[i]):float(lst[i][0][-1]) for i in range(len(KS))}
    res['complex'][n]=r; series['M_'+n]=M
# known-answer check: v_Y(s) -> Re[P(s) + Ei((1-s) log 2)] (limit under RH), a few points
chk=[]
for ksi,sig in enumerate(KS):
    for t in (0.0,10.0,14.25,50.0,100.0):
        i=int(round(t/tstep))
        if i>=len(tg) or abs(tg[i]-t)>1e-9: continue
        s=mp.mpc(sig,t)
        try:
            lim=float((mp.primezeta(s)+mp.ei((1-s)*mp.log(2))).real)
        except Exception as e:
            lim=None
        chk.append(dict(sigma=sig,t=t,vY=float(vfinal['zeta_%g'%sig][i]),limit=lim))
res['limit_check']=chk
json.dump(res,open(pre+'.json','w'),indent=1)
sub=slice(None,None,8)
np.savez_compressed(pre+'.npz',logY=logY[sub],tg=tg,**{k:np.asarray(v,dtype=np.float64)[sub] for k,v in series.items()},**{'vfinal_'+k:v for k,v in vfinal.items()})
print(json.dumps({k:res['real'][k]['zeta'] for k in res['real'] if k!='EA'},indent=0)[:1500])
print('complex',json.dumps(res['complex'],indent=0)[:2500])
print('limit check',chk)
