#!/usr/bin/env python3
"""Independent Euler-SPF enumeration and every-event reserve check through 10^7 only."""
from array import array
from pathlib import Path
from collections import Counter
import json,hashlib,time
from flint import arb,ctx
ctx.prec=384
limit=10_000_000
started=time.monotonic()
# Linear Euler sieve, unlike the producer's Eratosthenes sieve/power expansion.
spf=array('I',[0])*(limit+1)
primes=array('I')
for n in range(2,limit+1):
    if spf[n]==0:
        spf[n]=n;primes.append(n)
    sn=spf[n]
    for p in primes:
        if p>sn or p>limit//n:break
        spf[p*n]=p
S=arb(0);J=arb(0)
b=(arb(5)/4).digamma()/2-arb.pi().log()/2-2
T=arb.pi()**2/4+2*arb.const_catalan()-4
delta=arb(2).sqrt()/15
floor=arb(1)/100
digest=hashlib.sha256();counts=Counter();count=0;last=0;minimum=None;minimum_q=None
checkpoints={}
for q in range(2,limit+1):
    p=int(spf[q]);rem=q;k=0
    while rem%p==0:
        rem//=p;k+=1
    if rem==1:
        digest.update(('\n' if count else '').encode()+f'{q},{p},{k}'.encode())
        count+=1;counts[k]+=1;last=q
        lp=arb(p).log();lq=arb(q).log() # independent from k*log p
        w=lp/arb(q).sqrt();S+=w;J+=w*lq
        H=S-b
        if count==1:assert H-delta-2*arb(2).sqrt()>0
        xm=((H-delta)/2)**2
        assert xm>2
        # Algebraically equal to the producer's epsilon, with different evaluation order.
        eps=arb(4)/(25*xm.sqrt()*(xm*xm-1))
        R=J-2*H*(H/2).log()+2*H-4+T
        lower=R-eps
        assert lower>floor,(q,lower)
        if minimum is None or lower.lower()<minimum.lower():
            minimum=lower;minimum_q=q
    if q in (1_000_000,10_000_000):
        checkpoints[str(q)]={'event_count':count,'prime_count':counts[1],'last_event':last,'exponent_counts':dict(sorted(counts.items())),'event_list_sha256':digest.hexdigest(),'all_event_lower_tests_pass':True,'last_H':str(H),'last_R':str(R),'smallest_direct_lower_test_interval':str(minimum),'smallest_direct_lower_test_q':minimum_q}
expected={1_000_000:(78734,78498,'75a8304f17e1c2010108b3ebbfa15bf0fc1dfbaf007678ce5357c32c4d77b36a'),10_000_000:(665134,664579,'4c24e9f9cdf8411292143f0e81281da86dabcf08ad0c20c6064bcdffd3da06c1')}
for n,(ec,pc,hh) in expected.items():
    x=checkpoints[str(n)]
    assert x['event_count']==ec and x['prime_count']==pc and x['event_list_sha256']==hh
report={'status':'PASS','bits':ctx.prec,'limit':limit,'method':'Independent Euler least-prime-factor sieve; scan integers and strip least-prime factors to detect prime powers; log q computed directly; b evaluated with digamma; every event reserve tested without coarse hulls.','scope':'Independent finite scalar floor cross-check only. No further scale escalation, global positivity, or whole-even form conclusion. Diagnostic smallest direct lower test is not asserted to equal the exact minimum of Psi.','fixed_floor':'1/100','checkpoints':checkpoints,'script_sha256':hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),'elapsed_seconds':time.monotonic()-started}
out=Path(__file__).with_name('INDEPENDENT_SPF_DIRECT_384BIT.json')
out.write_text(json.dumps(report,indent=2,sort_keys=True)+'\n')
print(json.dumps(report,indent=2))
