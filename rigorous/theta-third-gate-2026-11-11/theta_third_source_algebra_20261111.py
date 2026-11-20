"""Exact next-source identities, separated from diagnostic quadrature."""
import json
import sympy as sp

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

if __name__ == '__main__':
    if not __debug__:
        raise SystemExit('Run verification without python -O.')
    print(json.dumps(exact_checks(),indent=2,sort_keys=True))
