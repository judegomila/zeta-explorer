import numpy as np, pickle, sys
P=pickle.load(open(sys.argv[1],'rb')); rows=P['rows']
k,g0,g1,d1=rows[:,0],rows[:,1],rows[:,2],rows[:,3]
mid=(g0+g1)/2; ng=(g1-g0)*np.log(mid/(2*np.pi))/(2*np.pi)
N=lambda T: T/(2*np.pi)*np.log(T/(2*np.pi*np.e))+7/8
ok=~np.isnan(d1)
print('gaps',len(k),'first-order mergeable',ok.sum(),'positive side',(d1[ok]>0).sum(),'negative side',(d1[ok]<0).sum())
for sg,name in ((1,'w>1'),(-1,'w<1')):
    m=ok&(np.sign(d1)==sg); best=np.inf; rec=[]
    for i in np.nonzero(m)[0]:
        if abs(d1[i])<best:
            best=abs(d1[i]); rec.append((mid[i],d1[i],ng[i],int(k[i])))
    print(name,'records (height, delta_k, normalised gap, gap index):')
    for r in rec: print('   %.2f  %+.5f  %.3f  %d'%r)
    R=np.array(rec); R=R[R[:,0]>50]
    T=R[:,0]; dl=np.abs(R[:,1])
    # model A: |delta| log(T/2pi) = const ; model B: |delta| = C N(T)^-a ; model C: |delta| = C T^-a
    A=dl*np.log(T/(2*np.pi)); print('   A: |delta| log(T/2pi) along records:',np.round(A,4),' ratio first/last %.2f'%(A[0]/A[-1]))
    a,b=np.polyfit(np.log(N(T)),np.log(dl),1); print('   B: |delta| = %.3f N(T)^%.3f'%(np.exp(b),a))
    a,b=np.polyfit(np.log(T),np.log(dl),1); print('   C: |delta| = %.3f T^%.3f'%(np.exp(b),a))
# bulk statistics by height band
print('band: n gaps | frac mergeable | median |delta_k| | 10% quantile | min | median*log(T/2pi)')
edges=[14,100,200,400,700,1000,1400,2000]
for a,b in zip(edges[:-1],edges[1:]):
    m=(mid>=a)&(mid<b)
    if m.sum()==0: continue
    dd=np.abs(d1[m&ok])
    if len(dd)<5: continue
    print(' [%d,%d): %d | %.2f | %.4f | %.4f | %.4f | %.3f'%(a,b,m.sum(),len(dd)/m.sum(),np.median(dd),np.quantile(dd,0.1),dd.min(),np.median(dd)*np.log((a+b)/2/(2*np.pi))))
# dependence on normalised gap
m=ok&(mid>100)
a,b=np.polyfit(np.log(ng[m]),np.log(np.abs(d1[m])),1); print('log|delta_k| vs log(normalised gap): slope %.2f, const %.3f, corr %.2f'%(a,np.exp(b),np.corrcoef(np.log(ng[m]),np.log(np.abs(d1[m])))[0,1]))
# count law: number of gaps with |delta_k|<x up to T (both signs)
for x in (0.01,0.02,0.04,0.08):
    print('  #gaps with |delta_k|<%.2f:'%x,[(int(T),int((ok&(np.abs(d1)<x)&(mid<T)).sum())) for T in (400,1000,2000) if T<=mid.max()+50])
