# Combination 4: sum_{h<=H} d(b h - 1) for the b of hist_list.txt (bound for #{a<b,(a,b)=1 : b^{-1} mod a <= H}); exact count for comparison:
# b^{-1} mod a = h  <=>  a | b h - 1 and h < a, so the count is sum_{h<=H} #{a | bh-1 : max(h,1) < a < b}.
import json, math
def small_primes(n):
    s=bytearray([1])*(n+1); s[0:2]=b'\x00\x00'
    for i in range(2,int(n**.5)+1):
        if s[i]: s[i*i::i]=bytearray(len(s[i*i::i]))
    return [i for i in range(n+1) if s[i]]
PR=small_primes(4_000_000)
def divisors(n):
    f=[]; m=n
    for p in PR:
        if p*p>m: break
        if m%p==0:
            e=0
            while m%p==0: m//=p; e+=1
            f.append((p,e))
    if m>1: f.append((m,1))
    ds=[1]
    for p,e in f: ds=[d*p**k for d in ds for k in range(e+1)]
    return ds
HC=[1,2,3,5,10,30,100,1000]; out={}
for b in [int(x) for x in open('hist_list.txt').read().split()]:
    bound=0; exact=0; res=[]; h=0
    for H in HC:
        while h<H:
            h+=1; ds=divisors(b*h-1); bound+=len(ds); exact+=sum(1 for a in ds if h<a<b and a>=2)
        res.append((H,bound,exact))
    out[b]=res; print(b,res,flush=True)
json.dump(out,open('divbound.json','w'))
