# Combination 4: A(b) = sum_{a=2,(a,b)=1}^{b-1} |c0(h_a/a)| on the prime sample; small-inverse counts and histogram.
import sys, numpy as np, math, json
rows=np.array([[float(v) for v in l.split()[:13]] for l in open(sys.argv[1]) if l.strip()])
b=rows[:,0]; n=rows[:,1]; S=rows[:,2]; A=rows[:,3]; mx=rows[:,4]; cnt=rows[:,5:13]
assert np.all(n==b-2), 'sample is expected to consist of primes'
r=A/((b-1)*b); s=S/((b-1)*b)
print('primes in the sample:',len(b),' range %.0f .. %.0f'%(b.min(),b.max()))
out={'count':len(b)}
for lo,hi in ((1e5,1e6),(1e6,1e7),(1e7,1e8),(9.99e7,1e8)):
    m=(b>=lo)&(b<hi)
    if m.sum():
        i=np.argmax(np.where(m,r,-1)); print('[%.3g,%.3g): %d primes ; A/(phi b) min %.7f max %.7f (b=%d) mean %.7f ; S/(phi b) mean %.8f ; largest term/(phi b) max %.2e'%(lo,hi,m.sum(),r[m].min(),r[m].max(),b[i],r[m].mean(),s[m].mean(),(mx[m]/((b[m]-1)*b[m])).max()))
        out['%g_%g'%(lo,hi)]=dict(n=int(m.sum()),min=float(r[m].min()),max=float(r[m].max()),argmax=int(b[i]),mean=float(r[m].mean()),Smean=float(s[m].mean()))
i=np.argmax(r); print('sup over the sample: %.7f at b=%d ; -1/(4 pi) = %.8f'%(r[i],b[i],-1/(4*math.pi)))
HC=[1,2,3,5,10,30,100,1000]
print('small inverses: mean over the sample of #{a: h_a <= H}/(H (log(b/H) + 1)) for H =',HC)
print('  mean',' '.join('%.4f'%np.mean(cnt[:,j]/(H*(np.log(b/H)+1))) for j,H in enumerate(HC)))
print('  max ',' '.join('%.4f'%np.max(cnt[:,j]/(H*(np.log(b/H)+1))) for j,H in enumerate(HC)))
print('  max of #{h_a <= H}/phi(b): ',' '.join('%.2e'%np.max(cnt[:,j]/n) for j in range(8)))
json.dump(out,open(sys.argv[2],'w'),indent=1)
if len(sys.argv)>3:
    for l in open(sys.argv[3]):
        p=l.split(); bb=int(p[0]); nn=float(p[1]); h=np.array([float(v) for v in p[13:]]).reshape(20,2)
        print('b=%d: A/(phi b)=%.6f ; histogram of h_a/a in 20 bins: count share min %.5f max %.5f ; share of sum |c0|/a in the two end bins %.4f, in the 10 middle bins %.4f'%(bb,float(p[3])/(nn+1)/bb,(h[:,0]/nn).min(),(h[:,0]/nn).max(),(h[0,1]+h[19,1])/h[:,1].sum(),h[5:15,1].sum()/h[:,1].sum()))
