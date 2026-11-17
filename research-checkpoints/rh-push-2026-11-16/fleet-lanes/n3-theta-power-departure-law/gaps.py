import numpy as np, sys, pickle
d=np.load(sys.argv[1]); ws=d['ws']; tau=d['tau']; F=d['F']; eps=float(d['eps'])
j1=int(np.argmin(np.abs(ws-1))); h=ws[j1+1]-ws[j1]
sc_all={}
def zeros_of(f):
    sc=np.nonzero(np.sign(f[1:])*np.sign(f[:-1])<0)[0]
    return tau[sc]-f[sc]*(tau[sc+1]-tau[sc])/(f[sc+1]-f[sc]), sc
f=F[:,j1]; z1,sc1=zeros_of(f)
Fw=(F[:,j1+1]-F[:,j1-1])/(2*h)
Fww=(F[:,j1+1]-2*f+F[:,j1-1])/h**2
print('zeta zeros found',len(z1),'first',z1[:3],'last',z1[-1])
rows=[]
for k in range(len(z1)-1):
    a,b=sc1[k]+1,sc1[k+1]+1
    ff=f[a:b]; fw=Fw[a:b]; fww=Fww[a:b]
    if np.any(np.sign(fw)!=np.sign(fw[0])):
        d1=np.nan
    else:
        R=-ff/fw; i=np.argmax(np.abs(R)); d1=R[i]
    # second order: smallest |delta| of each sign with min over gap of sign(f)*(f+d fw+d^2/2 fww) <=0
    s=np.sign(ff[len(ff)//2]); d2=[np.nan,np.nan]
    for sg_i,sg in enumerate((1,-1)):
        lo,hi=0.0,0.5
        g=lambda dd: (s*(ff+dd*fw+0.5*dd*dd*fww)).max()
        if g(sg*hi)>0: continue
        for _ in range(40):
            mid=(lo+hi)/2
            if g(sg*mid)>0: lo=mid
            else: hi=mid
        d2[sg_i]=sg*hi
    rows.append((k,z1[k],z1[k+1],d1,d2[0],d2[1]))
rows=np.array(rows)
# direct: for each grid w, which gaps lost their pair (positive minimum inside gap)
direct={}
for j,w in enumerate(ws):
    if j==j1: continue
    g=F[:,j]; i=np.arange(1,len(g)-1)
    ext=i[(np.abs(g[i])<np.abs(g[i-1]))&(np.abs(g[i])<=np.abs(g[i+1]))&(np.sign(g[i-1])==np.sign(g[i+1]))&(np.sign(g[i])==np.sign(g[i-1]))]
    te=tau[ext]; te=te[te>10]
    ks=np.searchsorted(z1,te)-1
    direct[float(w)]=(te,ks,len(zeros_of(g)[0]))
pickle.dump(dict(rows=rows,direct=direct,ws=ws),open(sys.argv[1].replace('.npz','_gaps.pkl'),'wb'))
d1=rows[:,3]
print('gaps',len(rows),'with F_w sign change (no first-order merge):',int(np.isnan(d1).sum()))
print('direct lost gaps per w vs first/second-order prediction (gap index sets):')
for w in sorted(direct):
    te,ks,nz=direct[w]; dl=w-1
    pred1=set(int(k) for k in rows[:,0][(np.sign(d1)==np.sign(dl))&(np.abs(d1)<abs(dl))])
    col=4 if dl>0 else 5
    pred2=set(int(k) for k in rows[:,0][np.abs(rows[:,col])<abs(dl)])
    ds=set(int(k) for k in ks)
    print(f' w={w:.3f} on-line={nz} lost={len(ds)} pred1={len(pred1)} pred2={len(pred2)} lost&pred2={len(ds&pred2)} lost-only={sorted(ds-pred2)[:6]} pred2-only={sorted(pred2-ds)[:6]} T1 direct={te.min() if len(te) else None}')
