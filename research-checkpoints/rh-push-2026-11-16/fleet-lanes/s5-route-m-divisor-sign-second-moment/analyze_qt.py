# Combination 2: Q(b) = sum_{a=2,(a,b)=1}^{b-1} I(a,b)^2/a^2 for every b <= B (merged slices of mode QT).
import numpy as np, sys, json, math
B=int(sys.argv[1]); nsl=int(sys.argv[2]); pre=sys.argv[3]; s0=float(sys.argv[4]) if len(sys.argv)>4 else 2.9193028619
print('planned memory %.2f GB'%(8*8*(B+1)/1e9))
Q=np.zeros(B+1); F=np.zeros(B+1); E=np.zeros(B+1); Em=np.full(B+1,1e300)
for i in range(nsl):
    d=np.fromfile('%s_qt_%d_%d.bin'%(pre,i,nsl)).reshape(4,B+1); Q+=d[0]; E=np.maximum(E,d[1]); Em=np.minimum(Em,d[2]); F+=d[3]
np.savez_compressed('%s_qt_merged.npz'%pre,Q=Q,E=E,Em=Em,F=F)
b=np.arange(B+1,dtype=np.float64); phi=np.arange(B+1,dtype=np.int64); om=np.zeros(B+1,dtype=np.int64)
for p in range(2,B+1):
    if phi[p]==p: phi[p::p]-=phi[p::p]//p; om[p::p]+=1
isp=(phi==np.arange(B+1)-1); isp[:2]=False
out={'B':B,'s0':s0}
K=F[3:]/(phi[3:]*b[3:]); 
def rng(v,lo): i=lo+int(np.argmin(v[lo:])); j=lo+int(np.argmax(v[lo:])); return (float(v[i]),i,float(v[j]),j)
kap=np.zeros(B+1); kap[3:]=K
out['kappa_check']={str(lo):rng(kap,lo) for lo in (100000,) if lo<B}
print('check of the tree against s4: kappa(b)=F(b)/(phi b), b>=1e5: min %.8f at %d, max %.8f at %d'%rng(kap,min(100000,B//2)))
T=2*np.cumsum(np.where(b>=3,Q/np.maximum(b,1)**2,0)); out['T']={}
prev=None
for M in (250,1000,10000,100000,1000000,2000000):
    if M<=B:
        sl=(T[M]-prev[1])/math.log(M/prev[0]) if prev else float('nan'); out['T'][M]=(float(T[M]),sl); print('T(%d) = %.6f   increment slope since previous %.4f   (12 s0/pi^2 = %.4f)'%(M,T[M],sl,12*s0/math.pi**2)); prev=(M,T[M])
R=np.zeros(B+1); R[3:]=Q[3:]/phi[3:]; Rb=np.zeros(B+1); Rb[3:]=Q[3:]/b[3:]
out['Q_over_phi']={}; out['Q_over_b']={}
for lo in (3,100,10000,100000,500000,1000000):
    if lo<B:
        out['Q_over_phi'][lo]=rng(R,lo); out['Q_over_b'][lo]=rng(Rb,lo)
        print('b>=%d: Q/phi in [%.6f (b=%d), %.6f (b=%d)] ; Q/b in [%.6f (b=%d), %.6f (b=%d)]'%(lo,*rng(R,lo),*rng(Rb,lo)))
half=B//2; print('mean of Q/b on (B/2,B]: %.6f  (s0 6/pi^2 = %.6f) ; mean of Q/phi: %.6f'%(Rb[half:].mean(),s0*6/math.pi**2,R[half:].mean()))
out['mean_Q_over_b_top']=float(Rb[half:].mean())
D=Q-s0*phi; D[:3]=0
i=3+int(np.argmax(D[3:])); j=3+int(np.argmin(D[3:])); print('Q - s0 phi: max %.4f at b=%d ; min %.4f at b=%d'%(D[i],i,D[j],j)); out['Q_minus_s0phi']=(float(D[i]),i,float(D[j]),j)
lb=np.log(np.maximum(b,2)); 
pm=isp&(b>=1000); c2=-D[pm]/lb[pm]**2; print('primes >= 1000: (s0 phi - Q)/log^2 b in [%.5f, %.5f], mean %.5f ; last decade mean %.5f'%(c2.min(),c2.max(),c2.mean(),(-D[isp&(b>=B/10)]/lb[isp&(b>=B/10)]**2).mean()))
out['prime_deficit_over_log2']=(float(c2.min()),float(c2.max()),float(c2.mean()))
# fit for primes: s0 phi - Q = c2 log^2 b + c1 log b + c0
pp=isp&(b>=1000); A=np.vstack([lb[pp]**2,lb[pp],np.ones(pp.sum())]).T; co=np.linalg.lstsq(A,-D[pp],rcond=None)[0]; print('primes: s0 phi - Q ~ %.5f log^2 b + %.5f log b + %.5f, rms residual %.4f'%(co[0],co[1],co[2],np.sqrt(np.mean((A@co+D[pp])**2)))); out['prime_fit']=[float(v) for v in co]
al=b>=1000; r3=np.abs(D[al])/(2.0**om[al]*lb[al]**3); print('all b >= 1000: |Q - s0 phi|/(2^omega log^3 b) max %.5f ; |Q - s0 phi|/(2^omega log^2 b) max %.5f'%(r3.max(),(np.abs(D[al])/(2.0**om[al]*lb[al]**2)).max()))
for w in range(1,8):
    m=(om==w)&(b>=1000)
    if m.sum(): print(' omega=%d: (Q - s0 phi)/log^2 b in [%.4f, %.4f]'%(w,(D[m]/lb[m]**2).min(),(D[m]/lb[m]**2).max()))
i=3+int(np.argmax(E[3:])); print('envelope: sup over b<=B and a of I(a,b)/(a(1+log(b/a))) = %.9f at b=%d ; log(2pi)-gamma = %.9f'%(E[i],i,math.log(2*math.pi)-0.5772156649015329)); out['env']=(float(E[i]),i)
for lo in (100,10000,100000):
    if lo<B: print('  b>=%d: per-b envelope maximum in [%.6f, %.6f]'%(lo,E[lo:].min(),E[lo:].max()))
j=4+int(np.argmin(Em[4:])); print('min over b>=4, a of I(a,b)/a = %.9f at b=%d (L2: >= 1)'%(Em[j],j)); out['min_I_over_a']=(float(Em[j]),j)
json.dump(out,open('%s_qt_analysis.json'%pre,'w'),indent=1)
