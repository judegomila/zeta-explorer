# Combinations 2 and 4, periodic comparison functions and Davenport-Heilbronn: tables of mode P.
import sys, numpy as np, json, math
out={}
for name,path,s0 in [(a.split('=')[0],a.split('=')[1],float(a.split('=')[2])) for a in sys.argv[1:]]:
    d=np.loadtxt(path); b=d[:,0]; n=d[:,1]; phi=n+1; QI=d[:,10]; e1=d[:,11]; e2=d[:,12]; FI=d[:,13]; sAL=d[:,5]; sL=d[:,4]
    lo=b>=1000; top=b>=b.max()/2
    R=QI/phi; k=np.argmax(np.where(lo,R,-1e9)); k2=np.argmin(np.where(lo,R,1e9))
    print('%s (b <= %d): Q_F/phi on b>=1000 in [%.5f (b=%d), %.5f (b=%d)], mean on top half %.5f ; quadrature s0_F %.5f'%(name,b.max(),R[k2],b[k2],R[k],b[k],R[top].mean(),s0))
    D=QI-s0*phi; print('   Q_F - s0_F phi on b>=1000: min %.3f max %.3f ; over log b: [%.3f, %.3f] ; over log^2 b: [%.3f, %.3f]'%(D[lo].min(),D[lo].max(),(D[lo]/np.log(b[lo])).min(),(D[lo]/np.log(b[lo])).max(),(D[lo]/np.log(b[lo])**2).min(),(D[lo]/np.log(b[lo])**2).max()))
    print('   sup |I_F(a,b)|/a: b>=100 %.5f ; top half %.5f ; sup |I_F|/(a(1+log(b/a))): %.5f ; kappa_F(b)=F/(phi b) top-half mean %.6f'%(e1[b>=100].max(),e1[top].max(),e2[b>=100].max(),(FI[top]/(phi[top]*b[top])).mean()))
    rA=sAL/(phi*b); k=np.argmax(np.where(lo,rA,-1)); print('   A_F(b)/(phi b) (leaf absolute sum): b>=1000 in [%.5f, %.5f (b=%d)], top-half mean %.5f ; |leaf sum|/A_F top-half mean %.4f'%(rA[lo].min(),rA[k],b[k],rA[top].mean(),(np.abs(sL[top])/sAL[top]).mean()))
    out[name]=dict(N=int(b.max()),Qphi_min=float(R[k2]),Qphi_max=float(R[np.argmax(np.where(lo,R,-1e9))]),Qphi_top=float(R[top].mean()),s0=s0,env_a=float(e1[b>=100].max()),env_log=float(e2[b>=100].max()),A_sup=float(rA[k]),A_top=float(rA[top].mean()))
json.dump(out,open('per_analysis.json','w'),indent=1)
