#!/usr/bin/env python3
"""Exact event accounting + interval block-prefix hull certificate, not RH."""
import argparse,hashlib,json,math,time
from pathlib import Path
from flint import arb,ctx

def events_up_to(limit):
    sieve=bytearray(b'\1')*(limit+1);sieve[0:2]=b'\0\0'
    for p in range(2,math.isqrt(limit)+1):
        if sieve[p]:sieve[p*p:limit+1:p]=b'\0'*(((limit-p*p)//p)+1)
    ev=[]
    for p in range(2,limit+1):
        if sieve[p]:
            q=p;k=1
            while q<=limit:
                ev.append((q,p,k));q*=p;k+=1
    ev.sort();assert len({q for q,p,k in ev})==len(ev)
    return ev

def main():
    ap=argparse.ArgumentParser();ap.add_argument('--limit',type=int,default=1000000);ap.add_argument('--bits',type=int,default=192);ap.add_argument('--block',type=int,default=256);ap.add_argument('--output',default='COARSE_RESERVE_192BIT.json');args=ap.parse_args()
    ctx.prec=args.bits;started=time.monotonic();ev=events_up_to(args.limit);N=len(ev)
    logs={};rs=[];S=[arb(0)];J=[arb(0)]
    for q,p,k in ev:
        if p not in logs:logs[p]=arb(p).log()
        rp=logs[p];rq=k*rp;w=rp/arb(q).sqrt();rs.append(rq);S.append(S[-1]+w);J.append(J[-1]+w*rq)
    pi=arb.pi();b=-(arb.const_euler()+pi/2+3*arb(2).log()+pi.log())/2
    Tinf=pi*pi/4+2*arb.const_catalan()-4;delta0=arb(8)/15/(4*arb(2).sqrt());floor=arb(1)/100
    assert b>-3 and b<-2
    H=[ss-b for ss in S]
    def F(h):return 2*h*((h/2).log()-1)
    Rc={}
    def R(i):
        if i not in Rc:Rc[i]=J[i]-F(H[i])-4+Tinf
        return Rc[i]
    def epsilon(h):
        xm=((h-delta0)/2)**2
        assert xm>2
        return arb(4)/25/(xm*xm*xm.sqrt())/(1-1/(xm*xm))
    assert S[1]-b-delta0-2*arb(2).sqrt()>0
    first=R(1)-epsilon(H[1]);assert first>floor
    leaves=[];failed=0;star_checks=0;minimum=first
    def visit(a,bb):
        nonlocal failed,star_checks,minimum
        err=epsilon(H[a]);vals=[R(a)-err,R(bb)-err];star=None
        if bb>a+1:
            dm=S[bb]-S[a];dj=J[bb]-J[a];lo=rs[a];hi=rs[bb-1]
            assert hi>lo
            t=(hi*dm-dj)/(hi-lo)
            assert t>0 and t<dm
            star=J[a]+lo*t-F(H[a]+t)-4+Tinf-err;vals.append(star);star_checks+=1
        if all(v>floor for v in vals):
            low=min(vals,key=lambda z:z.lower())
            if low.lower()<minimum.lower():minimum=low
            leaves.append({'head_event_index':a,'tail_event_index':bb,'head_q':ev[a-1][0],'first_in_block_q':ev[a][0],'last_q':ev[bb-1][0],'events':bb-a,'common_lower_bound':str(low),'gamma_enclosure_error':str(err)})
        else:
            failed+=1
            if bb==a+1:
                raise RuntimeError('singleton floor failure at q='+str(ev[bb-1][0])+' bounds='+str(vals))
            mid=(a+bb)//2;visit(a,mid);visit(mid,bb)
    for a in range(1,N,args.block):visit(a,min(a+args.block,N))
    h=H[-1];future_debt=12*(1+1/h)**2*((h/6).log()+1)/h
    L=arb(args.limit).log();future_freeze_B3=8/L**2+arb(21)/(2*L)
    event_digest=hashlib.sha256('\n'.join(f'{q},{p},{k}' for q,p,k in ev).encode()).hexdigest()
    out={'status':'PASS','scope':'Finite scalar Suzuki reserve certificate only. Every prime power accounted exactly. No all-future reserve/credit bound or RH claim.','bits':args.bits,'limit':args.limit,'fixed_rational_floor':'1/100','event_count':N,'prime_count':len(logs),'first_event_lower_bound':str(first),'last_event':ev[-1][0],'last_H':str(h),'last_R':str(R(N)),'lowest_accepted_block_lower_bound':str(minimum),'initial_max_block':args.block,'accepted_blocks':len(leaves),'rejected_parent_blocks_split':failed,'intersection_evaluations':star_checks,'distinct_endpoint_R_evaluations':len(Rc),'all_future_positive_debt_upper_bound':str(future_debt),'all_future_prime_credit_freezing_B3_error_upper_bound':str(future_freeze_B3),'future_freezing_scope':'Error of block freezing only, not bound on retained signed credits; elementary-onset lemma requires X>=10000.','event_list_sha256':event_digest,'script_sha256':hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),'elapsed_seconds':time.monotonic()-started,'blocks':leaves}
    Path(args.output).write_text(json.dumps(out,indent=2,sort_keys=True)+'\n')
    print(json.dumps({k:v for k,v in out.items() if k!='blocks'},indent=2))
if __name__=='__main__':main()
