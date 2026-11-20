# brute-force validation of sieve output at a few checkpoints (double precision reference via mpmath)
import sys, mpmath as mp
mp.mp.dps=30
M=64
def smix(x):
    x=(x+0x9E3779B97F4A7C15)&(2**M-1); x=((x^(x>>30))*0xBF58476D1CE4E5B9)&(2**M-1); x=((x^(x>>27))*0x94D049BB133111EB)&(2**M-1); return x^(x>>31)
rows={}
for l in open(sys.argv[1]):
    t=l.split(); rows[int(t[0])]=t
X=int(sys.argv[2]); 
import math
sv=bytearray([1])*(X+1); sv[0]=sv[1]=0
for i in range(2,int(X**.5)+1):
    if sv[i]: sv[i*i::i]=bytearray(len(sv[i*i::i]))
acc=[mp.mpf(0)]*27; cnt=0
targets=sorted(x for x in rows if x<=X)[::max(1,len([x for x in rows if x<=X])//12)]+[max(x for x in rows if x<=X)]
ti=0; worst=0
for p in range(2,X+1):
    if sv[p]:
        L=mp.log(p); a=list(acc); cnt+=1
        def add(k,w):
            a[2*k]+=w*L; a[2*k+1]+=w*p*L
        add(0,1)
        if p&1: add(1,1 if p%4==1 else -1)
        if p%3: add(2,1 if p%3==1 else -1)
        if p%5: add(2+p%5,1)
        h=smix(p); add(7,-1 if h>>63 else 1)
        key=p if p<(1<<20) else (p|0xFFFFF)
        if (h&((1<<53)-1))/2.0**53 < 0.5*key**(-0.1): add(8,1)
        a[26]+=mp.log1p(mp.mpf(1)/p)
        add(9,mp.exp(0.1*L)); add(10,mp.exp(-0.1*L)); add(11,mp.cos(L)); add(12,mp.sin(L))
        acc=a
    while ti<len(targets) and targets[ti]==p:
        r=rows[p]; assert int(r[1])==cnt,(p,r[1],cnt)
        for k in range(27):
            d=abs(mp.mpf(r[2+k])-acc[k])/(abs(acc[k])+1); worst=max(worst,d)
        ti+=1
print('checked',len(targets),'checkpoints up to',X,'count ok; worst rel diff',mp.nstr(worst,3))
