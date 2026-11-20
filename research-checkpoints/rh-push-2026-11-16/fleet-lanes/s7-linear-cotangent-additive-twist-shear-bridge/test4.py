# test4.py  Laurent data at s = 1 from zero lists: explicit formula with compact support and Hadamard sums.
import numpy as np, math, json, sys
import mpmath as mp
P='..'
EG=0.5772156649015329; XI=0.28407904384024578
def cdigamma(z):
    z=np.asarray(z,dtype=complex).copy(); s=np.zeros_like(z)
    for _ in range(14): s-=1/z; z+=1
    i=1/z; i2=i*i
    return s+np.log(z)-0.5*i-i2*(1/12-i2*(1/120-i2*(1/252-i2*(1/240-i2/132))))
def hfun(r,a,m):
    z=np.asarray(r,dtype=complex)*a/(2*m)
    with np.errstate(invalid='ignore',divide='ignore'):
        v=np.where(np.abs(z)<1e-8,1.0,np.sin(z)/z)
    return v**(2*m)
def gfun(u,a,m):   # density of a sum of n=2m uniforms on [-w,w], w=a/(2m)
    n=2*m; w=a/n; y=(abs(u)+n*w)/(2*w)   # symmetric
    if y>=n: return 0.0
    y=(u+n*w)/(2*w); s=mp.mpf(0)
    for j in range(int(math.floor(y))+1): s+=(-1)**j*mp.binomial(n,j)*(mp.mpf(y)-j)**(n-1)
    return float(s/mp.factorial(n-1)/(2*w))
def arch(a,m,par):
    R=min(4000.0,max(400.0,2*m/a*10**(13/(2*m)))); st=0.002; r=np.arange(-R,R+st/2,st)
    f=hfun(r,a,m).real*cdigamma(0.25+par/2+0.5j*r).real
    return float(np.trapezoid(f,r)/(2*math.pi)), float((2*m/(a*R))**(2*m)*R*math.log(R)/math.pi)
def zsum(on,off,a,m,H=None):
    """on: gammas>0 on the line; off: list of (beta,gamma) with beta>1/2 (pair partner implied). returns (sum on, sum off)"""
    if H is not None: on=on[on<H]; off=[(b,g) for b,g in off if g<H]
    so=2*float(hfun(on,a,m).real.sum())
    sf=0.0
    for b,g in off: sf+=4*float(hfun(g+1j*(b-0.5),a,m).real)
    return so,sf
def run(name,on,off,q,par,A,cn,H,supports,ms):
    rows=[]
    for m in ms:
        for a in supports:
            so,sf=zsum(on,off,a,m,H); ar,arerr=arch(a,m,par); g0=gfun(0,a,m)
            pole=float((hfun(0.5j,a,m)+hfun(-0.5j,a,m)).real)
            prime=sum(-2*c/math.sqrt(n)*gfun(math.log(n),a,m) for n,c in cn.items() if math.log(n)<a)
            rhs_nopole=g0*math.log(q/math.pi)+ar+prime
            # (i) pole order A recovered
            Aall=(so+sf-rhs_nopole)/pole; Aon=(so-rhs_nopole)/pole
            row={'m':m,'support':a,'A_true':A,'A_all_err':Aall-A,'A_online_err':Aon-A,'pair_term/pole':sf/pole}
            # (ii) coefficient at n=2 recovered when log 2 < a < log 3
            if math.log(2)<a<math.log(3):
                g2=gfun(math.log(2),a,m); base=g0*math.log(q/math.pi)+ar+A*pole
                c2all=(base-(so+sf))*math.sqrt(2)/(2*g2); c2on=(base-so)*math.sqrt(2)/(2*g2)
                row.update({'c2_true':cn.get(2,0.0),'c2_all_err':c2all-cn.get(2,0.0),'c2_online_err':c2on-cn.get(2,0.0)})
            # tail bound of the truncated zero sum
            Hh=H if H else float(on.max()); row['tail_bound']=float((2*m/(a*Hh))**(2*m)*Hh*math.log(Hh)/(math.pi*(2*m-1))); row['arch_trunc']=arerr
            rows.append(row)
    return rows
def hadamard(name,on,off,q,par,A,target,Hs,qtail=None):
    qtail=qtail or q
    rows=[]
    for H in Hs:
        o=on[on<H]; so=float((1/(0.25+o**2)).sum()); sf=0.0; sproj=0.0
        for b,g in off:
            if g<H: sf+=2*((1-b)/((1-b)**2+g*g)+b/(b*b+g*g)); sproj+=2/(0.25+g*g)
        tail=(math.log(qtail*H/(2*math.pi))+1)/(2*math.pi*H)   # sum over gamma>H of 1/gamma^2 with density (1/2pi) log(q t/2pi)
        const=-0.5*math.log(q/math.pi)-0.5*float(cdigamma((1+par)/2).real)-A
        rows.append({'H':H,'n_on':int(len(o)),'n_off_pairs':int(sum(1 for b,g in off if g<H)),'err_all':so+sf+tail+const-target,'err_online':so+tail+const-target,
                     'err_projected':so+sproj+tail+const-target,'pair_sum':sf})
    return rows
out={}
# zero lists
zz=np.fromfile(f'{P}/s4-cmv-li-krein-string-reach/zeros_od1e6.bin')
c4=np.array([float(v) for v in json.load(open(f'{P}/s4-cmv-li-krein-string-reach/zeros_LCHI4_big.json'))])
d=json.load(open(f'{P}/s3-truncated-euler-strip/zeros_DH.json')); dh_on=np.array([float(v) for v in d['online']]); dh_off=[(float(b),float(g)) for b,g,_ in d['offline']]
L2,L3=math.log(2),math.log(3)
sup=[0.3,0.5,0.65,0.69,0.9,1.093]; ms=[1,2,4]
mp.mp.dps=40
chi4=[0,1,0,-1]
t_chi4=float(mp.diff(lambda s: mp.dirichlet(s,chi4),1)/mp.dirichlet(1,chi4))
cdh=[1,XI,-XI,-1]
fdh=lambda s: sum(cdh[r-1]*mp.zeta(s,mp.mpf(r)/5) for r in range(1,5))*mp.mpf(5)**(-s)
t_dh=float((fdh(1+mp.mpf(10)**-12)-fdh(1-mp.mpf(10)**-12))/(2*mp.mpf(10)**-12)/fdh(1+mp.mpf(10)**-20))
print('targets',t_chi4,t_dh,file=sys.stderr)
qn=101; cnr=2.2; lq=math.log(qn); dl=math.acosh(cnr/2)/lq
def nr_off(H): return [(0.5+dl,math.pi*(2*j+1)/lq) for j in range(int(H*lq/(2*math.pi))+1) if math.pi*(2*j+1)/lq<H]
t_nr=EG+lq*(math.sqrt(qn)-1/math.sqrt(qn))/(math.sqrt(qn)+cnr+1/math.sqrt(qn))
a_e=0.25
out['explicit']={
 'zeta_1e6':run('zeta',zz,[],1,0,1,{2:L2,3:L3,4:L2},None,sup,ms),
 'zeta_H2000':run('zeta',zz,[],1,0,1,{2:L2,3:L3,4:L2},2000.0,sup,ms),
 'chi4_3615':run('chi4',c4,[],4,1,0,{2:0.0,3:-L3},None,sup,ms),
 'dh_H2000':run('dh',dh_on,dh_off,5,1,0,{2:XI*L2,3:-XI*L3},None,sup,ms),
 'nr101_H2000':run('nr',zz,nr_off(2000.0),qn*qn,0,1,{2:L2,3:L3,4:L2},2000.0,sup,ms),
}
# E_a = zeta(s+a)zeta(s-a): every zero off the line: (1/2+a, gamma) pairs with (1/2-a, gamma); gamma factor G(s+a)G(s-a); done as two shifted copies:
# sum_rho h = sum over zeta zeros of [h(gamma - i a) + h(gamma + i a)], both signs of gamma. Explicit formula of zeta with h_a(r) = h(r-ia)+h(r+ia).
def run_Ea(H,a_shift,supports,ms):
    rows=[]
    on=zz[zz<H]
    for m in ms:
        for a in supports:
            sall=4*float(hfun(on+1j*a_shift,a,m).real.sum())
            R=min(4000.0,max(400.0,2*m/a*10**(13/(2*m)))); st=0.002; r=np.arange(-R,R+st/2,st)
            hh=(hfun(r-1j*a_shift,a,m)+hfun(r+1j*a_shift,a,m)).real
            ar=float(np.trapezoid(hh*cdigamma(0.25+0.5j*r).real,r)/(2*math.pi))
            # g_a(u) = g(u) 2 cosh(a u) ; poles: h_a(i/2)+h_a(-i/2)
            g0=2*gfun(0,a,m); pole=float((hfun(0.5j-1j*a_shift,a,m)+hfun(0.5j+1j*a_shift,a,m)+hfun(-0.5j-1j*a_shift,a,m)+hfun(-0.5j+1j*a_shift,a,m)).real)
            prime=sum(-2*c/math.sqrt(n)*gfun(math.log(n),a,m)*2*math.cosh(a_shift*math.log(n)) for n,c in {2:L2,3:L3,4:L2}.items() if math.log(n)<a)
            Aall=(sall-(g0*math.log(1/math.pi)+ar+prime))/pole
            rows.append({'m':m,'support':a,'A_true':1,'A_all_err':Aall-1,'A_online_err':(0-(g0*math.log(1/math.pi)+ar+prime))/pole-1})
    return rows
out['explicit']['Ea_0.25_H2000']=run_Ea(2000.0,a_e,sup,ms)
out['explicit']['Ea_0.25_1e6']=run_Ea(1e9,a_e,sup,ms)
out['explicit']['nr101_1e6']=run('nr',zz,nr_off(600269.0),qn*qn,0,1,{2:L2,3:L3,4:L2},600269.0,sup,ms)
Hs=[50,100,200,500,1000,2000]
out['hadamard']={
 'zeta':hadamard('zeta',zz,[],1,0,1,EG,Hs+[5000,20000,100000,600000]),
 'chi4':hadamard('chi4',c4,[],4,1,0,t_chi4,Hs+[3400]),
 'dh':hadamard('dh',dh_on,dh_off,5,1,0,t_dh,Hs),
 'nr101':hadamard('nr',zz,nr_off(600000.0),1,0,1,t_nr,Hs+[5000,20000,100000,600000],qtail=qn*qn),
}
out['targets']={'chi4':t_chi4,'dh':t_dh,'nr101':t_nr,'zeta':EG}
out['dh_first_offline']=dh_off[:3]; out['nr101_first_offline']=nr_off(5.0)
json.dump(out,open('out/test4.json','w'),indent=1)
for k,v in out['explicit'].items():
    print(k)
    for r in v:
        print('  m=%d a=%.3f A_all_err=% .3e A_on_err=% .3e'%(r['m'],r['support'],r['A_all_err'],r['A_online_err']), ('pair=% .3e'%r['pair_term/pole']) if 'pair_term/pole' in r else '', ('c2_all_err=% .3e c2_on_err=% .3e'%(r['c2_all_err'],r['c2_online_err'])) if 'c2_all_err' in r else '', 'tail<=%.1e'%r.get('tail_bound',0))
for k,v in out['hadamard'].items():
    print(k)
    for r in v: print('  H=%g n_on=%d pairs=%d err_all=% .3e err_online=% .3e err_proj=% .3e pair_sum=%.3e'%(r['H'],r['n_on'],r['n_off_pairs'],r['err_all'],r['err_online'],r['err_projected'],r['pair_sum']))
