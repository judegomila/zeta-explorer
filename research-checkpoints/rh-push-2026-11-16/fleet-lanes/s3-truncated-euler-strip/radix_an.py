# Analysis of radix.c and dhradix.c output. usage: radix_an.py radix.txt dh.txt out.json
import sys, json, math
from mpmath import mp, mpf, zeta, log
mp.dps=34
rows=[[mpf(x) for x in l.split()] for l in open(sys.argv[1])]
N=[r[0] for r in rows]
def kern(Nv,n):
    Nv=int(Nv); m=Nv//n; return m*(n-1-Nv%n)-(Nv-n)
def tnr(Nv,q,c):
    b=math.acosh(c/2)/math.log(q); al=-mpf(q)**(0.5+b); be=-mpf(q)**(0.5-b); s=mpf(0); k=1
    while q**k<=Nv:
        s+=-(al**k+be**k)*log(q)*kern(Nv,q**k); k+=1
    return s
fam={}
fam['zeta']=[r[1] for r in rows]
fam['liouville_on_primes']=[-r[1] for r in rows]
fam['eps_random_sign']=[r[2] for r in rows]
fam['THIN_b0.8']=[r[1]-2*r[3] for r in rows]
fam['DEL_b0.8']=[r[1]-r[4] for r in rows]
fam['chi4_integer_kernel']=[r[5] for r in rows]
fam['chi4_twisted_kernel']=[r[6] for r in rows]
fam['TNR_q3_c2.2']=[r[1]+tnr(r[0],3,2.2) for r in rows]
fam['TNR_q3_c2.02']=[r[1]+tnr(r[0],3,2.02) for r in rows]
fam['TNR_q1000003_c2.2']=[r[1]+tnr(r[0],1000003,2.2) for r in rows]
def stats(Ns,vals,Nmin=1000):
    x=[(float(n),float(v/n**mpf(1.5))) for n,v in zip(Ns,vals) if n>=Nmin]
    sc=sum(1 for i in range(1,len(x)) if x[i][1]*x[i-1][1]<0)
    neg=[n for n,v in x if v<0]
    dec={}
    k=3
    while 10**k<x[-1][0]*1.0001:
        seg=[v for n,v in x if 10**k<=n<10**(k+1)]
        if seg: dec['1e%d'%k]=[min(seg),max(seg)]
        k+=1
    return dict(n_values=len(x),min=min(v for _,v in x),max=max(v for _,v in x),sign_changes=sc,first_negative_N=(neg[0] if neg else None),n_negative=len(neg),last=x[-1],by_decade_min_max=dec)
res={'Nmax':float(N[-1]),'normalisation':'value/N^(3/2), N >= 1000','families':{k:stats(N,v) for k,v in fam.items()}}
# zero-free arithmetic term: sum_p log p C_p(N) - N^2/2 = R + theta_1 - N^2/2 -> zeta(1/2)/3 N^(3/2)
U=[(float(r[0]),float((r[1]+r[7]-r[0]**2/2)/r[0]**mpf(1.5))) for r in rows if r[0]>=1000]
res['carry_sum_minus_half_N2_over_N1.5']=dict(expected=float(zeta(mpf(0.5))/3),last=U[-1],at={('%g'%n):v for n,v in U if n in (1e3,1e5,1e7,1e9,1e10,1e11,1e12)},
   max_dev_last_decade=max(abs(v-float(zeta(mpf(0.5))/3)) for n,v in U if n>=U[-1][0]/10))
res['RH_band']=[0.1336904124,2*0.1798822-0.1336904124]
b=0.8; Kb=((b-1)*float(zeta(b))-1)/(b*(b+1)); res['K(b=0.8)']=Kb
res['THIN_over_N^(1+b)_last']=float(fam['THIN_b0.8'][-1]/N[-1]**mpf(1+b))
res['DEL_over_N^(1+b)_last']=float(fam['DEL_b0.8'][-1]/N[-1]**mpf(1+b))
# random sign: normalised by N^(3/2) sqrt(log N); predicted std sqrt(1/8)
e=[float(v/(n**mpf(1.5)*mp.sqrt(log(n)))) for n,v in zip(N,fam['eps_random_sign']) if n>=1000]
res['eps_over_N1.5_sqrtlogN']=dict(rms=math.sqrt(sum(v*v for v in e)/len(e)),min=min(e),max=max(e),predicted_std=math.sqrt(0.125))
if len(sys.argv)>3:
    d=[[mpf(x) for x in l.split()] for l in open(sys.argv[2])]
    Nd=[r[0] for r in d]
    res['DH']={'Nmax':float(Nd[-1]),'R_i_integer_kernel':stats(Nd,[r[1] for r in d]),'R_ii_twisted_kernel':stats(Nd,[r[2] for r in d]),
       'H5_partial_sums_sum_Lam_n^-sig_over_log':{s:dict(last=float(d[-1][5+i]),max_abs=float(max(abs(r[5+i]) for r in d)),at={('%g'%float(r[0])):float(r[5+i]) for r in d if float(r[0]) in (1e3,1e4,1e5,1e6,1e7,1e8)}) for i,s in enumerate(['0.51','0.55','0.6','0.75','1.0','1.2'])}}
    # growth exponent of |R_ii| envelope: decade maxima
    env=[]
    k=3
    while 10**k<float(Nd[-1]):
        seg=[abs(float(r[2])) for r in d if 10**k<=r[0]<10**(k+1)]
        if seg: env.append((k+0.5,math.log10(max(seg))))
        k+=1
    if len(env)>=3:
        n=len(env); sx=sum(a for a,_ in env); sy=sum(b for _,b in env); sxx=sum(a*a for a,_ in env); sxy=sum(a*b for a,b in env)
        res['DH']['R_ii_envelope_exponent']=(n*sxy-sx*sy)/(n*sxx-sx*sx)
json.dump(res,open(sys.argv[-1],'w'),indent=1)
for k,v in res['families'].items(): print(k,'min %.5g max %.5g sign changes %d first neg %s last %.5g'%(v['min'],v['max'],v['sign_changes'],v['first_negative_N'],v['last'][1]))
print({k:res[k] for k in res if k not in ('families','DH')})
if 'DH' in res: print('DH',json.dumps(res['DH'])[:1800])
