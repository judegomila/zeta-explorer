"""Second reduced theta source determinants; diagnostics, never a certificate.

The exact checks validate universal determinant eliminations separately.
Numeric probes use precision comparisons and positive centered-tail integrals.
"""
import argparse
from functools import lru_cache
import json
from pathlib import Path
import sys
import mpmath as mp
import sympy as sp

_HERE = Path(__file__).resolve().parent
_PRIOR = _HERE / 'mathexplorer_second_preservation_checkpoint' / 'rigorous' / 'theta-second-preservation-2026-11-11' / 'diagnostics'
if _PRIOR.exists():
    sys.path.insert(0, str(_PRIOR))
if (_HERE / 'diagnostics').exists():
    sys.path.insert(0, str(_HERE / 'diagnostics'))
from theta_ratio_probe_20261110 import probe, anchor_p, theta_data
from theta_second_source_20261111 import normalized_theta_jets


@lru_cache(maxsize=512)
def first_data(a_text, t_text, dps):
    with mp.workdps(dps):
        return probe(a_text, t_text, dps, return_raw=True)


def ncolumn(data, q, order=3):
    a, p, t, N, Np = (data[k] for k in ['a', 'p', 't', 'N', 'Np'])
    out = [N, Np+q[1]*N]
    for j in range(order-1):
        out.append((a*a*out[j]-t*q[j+1]-(j+1+a*p)*q[j])/4)
    return out


def source_probe(a_value, c_value, t_value, dps=70, raw=False):
    with mp.workdps(dps):
        a,c,t = [mp.mpf(str(s)) for s in (a_value,c_value,t_value)]
        if a == c:
            raise ValueError('Use distinct anchors; coalescent exact formulas are separate.')
        ad = first_data(str(a),str(t),dps)
        cd = first_data(str(c),str(t),dps)
        p,q = ad['p'],cd['p']
        D = c*q-a*p
        r = (c*p-a*q)/D
        jets = normalized_theta_jets(t,5)
        na,nc = ncolumn(ad,jets),ncolumn(cd,jets)
        n2 = p*(na[0]-nc[0])/D
        k=jets[:4]
        tk=[t*jets[j+1]+j*jets[j] for j in range(4)]
        C=[ad['c'],-t/4,-(1+t*jets[1])/4,-(2*jets[1]+t*jets[2])/4]
        DH=mp.det(mp.matrix([[na[j],nc[j],k[j],C[j]] for j in range(4)]))
        DP=mp.det(mp.matrix([[na[j],nc[j],k[j],tk[j]] for j in range(4)]))
        WH=-r*p*p*DH/(a*c*D*n2**4)
        WP=-r*r*p*p*DP/(D*n2**4)
        data={'a':a,'c':c,'t':t,'r':r,'N2':n2,'WH':WH,'WP':WP,
              'WH_t6':WH/t**6,'WP_t6':WP/t**6,'DH':DH,'DP':DP}
        if raw:
            return data
        return {**{k:mp.nstr(v,36) for k,v in data.items()},'dps':dps,
                'expected_signs':bool(r>0 and n2>0 and WH>0 and WP>0)}


def coalescent_probe(a_value,t_value,dps=70,raw=False):
    """Analytically differentiated centered integrals, not finite differences."""
    with mp.workdps(dps):
        a,t=[mp.mpf(str(s)) for s in (a_value,t_value)]
        if a == mp.mpf('.5'):
            raise ValueError('The zeta pole cancellation requires a separate formula at .5.')
        p=anchor_p(str(a),dps)
        s=a+mp.mpf('.5')
        zeta=mp.zeta(s)
        pp=-1/s**2-1/(s-1)**2+mp.polygamma(1,s/2)/4+mp.diff(mp.zeta,s,2)/zeta-(mp.diff(mp.zeta,s)/zeta)**2
        logkt,Vp,_=theta_data(t)
        lam=a/2
        end=max(t+1,mp.log((a+100+4*dps)/mp.pi)+2)
        def ratio(v):
            return mp.exp(theta_data(abs(v))[0]-logkt)
        def breaks(limit,extra=()):
            values=[mp.mpf(0),limit]
            step=mp.mpf(1)
            while step<limit:
                values.append(step)
                step*=4
            return sorted(set(values+list(extra)))
        def right(plus):
            tilt=lam if plus else -lam
            scale=max(mp.mpf(1),Vp-tilt)
            limit=(end-t)*scale
            def fun(w):
                v=t+w/scale
                val=v-2*p if plus else v+2*p
                deriv=(v-t)*val/2-2*pp if plus else -(v-t)*val/2+2*pp
                return (val+1j*deriv)*ratio(v)*mp.exp(tilt*(v-t))/scale
            return mp.quad(fun,breaks(limit))
        if t>=2*p:
            cp=right(True)
        else:
            scale=max(mp.mpf(1),lam-Vp)
            limit=(t+end)*scale
            def left(w):
                v=t-w/scale
                val=2*p-v
                deriv=2*pp+(v-t)*val/2
                return (val+1j*deriv)*ratio(v)*mp.exp(-lam*w/scale)/scale
            cp=mp.quad(left,breaks(limit,[t*scale]))
        cm=right(False)
        tp,tm=mp.re(cp),mp.re(cm)
        dp,dm=mp.im(cp),mp.im(cm)
        jets=normalized_theta_jets(t,5)
        na=[(tp+tm)/8,a*(tm-tp)/16-t/4]
        dan=[(dp+dm)/8,(tm-tp+a*(dm-dp))/16]
        for j in range(2):
            na.append((a*a*na[j]-t*jets[j+1]-(j+1+a*p)*jets[j])/4)
            dan.append((2*a*na[j]+a*a*dan[j]-(p+a*pp)*jets[j])/4)
        C0=first_data(str(a),str(t),dps)['c']
        C=[C0,-t/4,-(1+t*jets[1])/4,-(2*jets[1]+t*jets[2])/4]
        tk=[t*jets[j+1]+j*jets[j] for j in range(4)]
        DH=mp.det(mp.matrix([[na[j],dan[j],jets[j],C[j]] for j in range(4)]))
        DP=mp.det(mp.matrix([[na[j],dan[j],jets[j],tk[j]] for j in range(4)]))
        da=p+a*pp
        r=(p-a*pp)/da
        N2=-p*dan[0]/da
        WH=-r*p*p*DH/(a*a*da*N2**4)
        WP=-r*r*p*p*DP/(da*N2**4)
        data={'a':a,'t':t,'r':r,'N2':N2,'WH':WH,'WP':WP,
              'WH_t6':WH/t**6,'WP_t6':WP/t**6,'DH':DH,'DP':DP}
        if raw:
            return data
        return {**{k:mp.nstr(v,36) for k,v in data.items()},'dps':dps,
                'expected_signs':bool(r>0 and N2>0 and WH>0 and WP>0)}


def higher_source_probe(a_value,t_value,dps=70):
    with mp.workdps(dps):
        a,t=[mp.mpf(str(s)) for s in (a_value,t_value)]
        ad=first_data(str(a),str(t),dps)
        p=ad['p']
        jets=normalized_theta_jets(t,7)
        na=ncolumn(ad,jets,4)
        k=jets[:5]
        tk=[t*jets[j+1]+j*jets[j] for j in range(5)]
        k2=jets[2:7]
        tk3=[t*jets[j+3]+j*jets[j+2] for j in range(5)]
        C=[ad['c']]+[-(t*jets[j]+j*jets[j-1])/4 for j in range(4)]
        DH=mp.det(mp.matrix([[na[j],k[j],tk[j],k2[j],C[j]] for j in range(5)]))
        DQ=mp.det(mp.matrix([[na[j],k[j],tk[j],k2[j],tk3[j]] for j in range(5)]))
        SH=-4*p*p/a*DH/na[0]**5
        SQ=16*p*p*DQ/na[0]**5
        return {'a':str(a),'t':str(t),'dps':dps,'SH':mp.nstr(SH,36),'SQ':mp.nstr(SQ,36),
                'SH_t10':mp.nstr(SH/t**10,36),'SQ_t10':mp.nstr(SQ/t**10,36)}


def exact_checks():
    """All columns are free derivative vectors; only stated ODE identities used."""
    a,c,p,r,D=sp.symbols('a c p r D',nonzero=True)
    X=sp.eye(4)
    na,nc,k,C=[X[:,j] for j in range(4)]
    n2=p*(na-nc)/D
    ba=(C-na)/a
    ba2=(p*k-a*na)/4
    n22=(c*c*n2+4*ba2-c*r*na)/4
    b2=(ba-n2)/c
    b22=(r*na-c*n2)/4
    # Independent vector for na'' is expressed through a fourth free column tk.
    tk=C
    na2=(a*a*na-(1+a*p)*k-tk)/4
    b24=(r*na2-c*n22)/4
    h_direct=sp.Matrix.hstack(n2,4*b22,4*n22,-b2).det()
    h_target=-r*p*p/(a*c*D)*X.det()
    p_direct=sp.Matrix.hstack(n2,4*b22,4*n22,16*b24).det()
    p_target=-r*r*p*p/D*X.det()
    assert sp.cancel(h_direct-h_target)==0
    assert sp.cancel(p_direct-p_target)==0
    # Quotient and constant-column orientation: W(Na,Nc,1,H)=W(Na',Nc',H').
    mat=sp.Matrix(4,4,sp.symbols('q0:16'))
    mat[:,2]=sp.Matrix([1,0,0,0])
    assert sp.expand(mat.det()-mat[1:,[0,1,3]].det())==0
    # Change of anchors n2(c,a)=q/p n2(a,c); positive scalar has no spatial effect.
    q=sp.symbols('q',nonzero=True)
    assert sp.cancel(q*(nc[0]-na[0])/(-D)-(q/p)*n2[0])==0
    # Cancel the fourth-order source determinants via mixed-ratio derivatives.
    f,g,h=sp.symbols('f g h',cls=sp.Function)
    t=sp.symbols('t')
    fs,gs,hs=f(t),g(t),h(t)
    W=sp.det(sp.Matrix([[sp.diff(v,t,j) for v in (fs,gs,hs)] for j in range(3)]))
    expected=fs**3*(sp.diff(gs/fs,t)*sp.diff(hs/fs,t,2)-sp.diff(gs/fs,t,2)*sp.diff(hs/fs,t))
    assert sp.simplify(W-expected)==0
    # Higher first-pair sources. Columns are an arbitrary basis of derivative jets.
    n,k,tk,k2,last=[sp.eye(5)[:,j] for j in range(5)]
    b=(last-n)/a
    b2=(p*k-a*n)/4
    n2=(a*a*n-(1+a*p)*k-tk)/4
    b4=(p*k2-a*n2)/4
    sh=sp.Matrix.hstack(n,4*b2,4*n2,16*b4,b).det()
    assert sp.cancel(sh+4*p*p/a)==0
    C4=-(3*k2+last)/4
    n4=(a*a*n2+4*C4-a*p*k2)/4
    sq=sp.Matrix.hstack(n,4*b2,4*n2,16*b4,16*n4).det()
    assert sp.cancel(sq-16*p*p)==0
    # Normalized higher-source orientation and the first nonvanishing asymptotic term.
    B,J,P,H=[sp.eye(4)[:,j] for j in range(4)]
    leading=-B/a**2+p*J/a**3-P/a**4
    assert sp.cancel(sp.Matrix.hstack(leading,B,J,H).det()+a**(-4))==0
    B,J,P,Q=[sp.eye(4)[:,j] for j in range(4)]
    leading=-B/a**2+p*J/a**3-P/a**4+p*Q/a**5
    assert sp.cancel(sp.Matrix.hstack(leading,B,J,P).det()+p/a**5)==0
    # Even normalization has power ten and constant 2^10.
    u=sp.symbols('u')
    fs=[t**(2*j) for j in range(1,5)]
    left=sp.Matrix([[sp.diff(f,t,j) for f in fs] for j in range(1,5)]).det()
    right=(2*t)**10*sp.Matrix([[sp.diff(u**i,u,j) for i in range(1,5)] for j in range(1,5)]).det()
    assert sp.expand(left-right)==0
    # Analytic confluent limits use the anchor derivative, not a finite difference.
    eps,pp,Na,Nad=sp.symbols('eps pp Na Nad')
    dc=(a+eps)*(p+pp*eps)-a*p
    assert sp.limit(p*(Na-(Na+Nad*eps))/dc,eps,0)==-p*Nad/(p+a*pp)
    assert sp.limit(((a+eps)*p-a*(p+pp*eps))/dc,eps,0)==(p-a*pp)/(p+a*pp)
    return {'exact_checks':12,'passed':True}


def diagnostic_replay():
    rows=[]
    for a,ts,dps in [('1',['.001','.125','.5','1','4'],70),
                     ('100',['.01','.25','1','4'],80),
                     ('.01',['.001','1'],80),
                     ('10000',['.0625','1'],100)]:
        for t in ts:rows.append({'kind':'coalescent',**coalescent_probe(a,t,dps)})
    for a,ts,dps in [('1',['.001','.125','.5','1','4'],70),
                     ('10000',['.0625','.5'],100)]:
        for t in ts:rows.append({'kind':'higher_source',**higher_source_probe(a,t,dps)})
    for a,c,t in [('1','1.00001','.125'),('1','100','1'),('1','2','.125')]:
        rows.append({'kind':'distinct',**source_probe(a,c,t,80)})
    precision=[]
    for baseline,repeat,keys in [
            (rows[0],coalescent_probe('1','.001',100),('WH','WP')),
            (rows[18],higher_source_probe('10000','.0625',140),('SH','SQ'))]:
        for key in keys:assert baseline[key]==repeat[key]
        precision.append({'baseline_dps':baseline['dps'],'repeat_dps':repeat['dps'],
                          'matching_printed_significant_digits':36,'values':repeat})
    assert all(row.get('expected_signs',True) for row in rows)
    return {'status':'diagnostic_only','sample_count':len(rows),'rows':rows,
            'precision_comparisons':precision,
            'scope':'Positive sampled actual next-sources and sign-changing higher first-pair sources. No sample is used as a proof input.'}


def main():
    p=argparse.ArgumentParser()
    p.add_argument('--exact',action='store_true')
    p.add_argument('--coalescent',action='store_true')
    p.add_argument('--higher',action='store_true')
    p.add_argument('--replay',action='store_true')
    p.add_argument('--a',default='1')
    p.add_argument('--c',default='2')
    p.add_argument('--t',default='0.01,0.125,0.5,1,4')
    p.add_argument('--dps',type=int,default=70)
    args=p.parse_args()
    if args.replay:
        result=diagnostic_replay()
        Path('theta_third_source_diagnostic_replay_20261111.json').write_text(json.dumps(result,indent=2)+'\n')
        print(json.dumps(result,indent=2),flush=True)
    elif args.exact:
        print(json.dumps(exact_checks()),flush=True)
    else:
        for t in args.t.split(','):
            result=higher_source_probe(args.a,t,args.dps) if args.higher else coalescent_probe(args.a,t,args.dps) if args.coalescent else source_probe(args.a,args.c,t,args.dps)
            print(json.dumps(result),flush=True)


if __name__=='__main__':
    main()
