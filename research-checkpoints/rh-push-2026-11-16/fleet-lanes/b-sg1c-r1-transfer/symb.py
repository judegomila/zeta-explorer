# Symbolic proof of the exact identity for N=3 and N=4 (pair + 1 or 2 environment particles).
# Both sides are sums of 1-body and symmetric 2-body environment terms, so N=3 and N=4 imply all N.
import sympy as sp
def check(n_env):
    a,b=sp.symbols('a b'); ys=sp.symbols('y1:%d'%(n_env+1))
    X=[a,b]+list(ys)
    vel={x: -2*sum(1/(x-z) for z in X if z is not x) for x in X}
    g=b-a
    T=[1/((a-y)*(b-y)) for y in ys]
    Theta=g**2*sum(T)/2
    q=(1-Theta)/g
    dq=sum(sp.diff(q,x)*vel[x] for x in X)
    mus=[g**2*t for t in T]
    D=4-6*sum(m**2 for m in mus)-2*sum(m**3 for m in mus)
    r1=sp.simplify(sp.together(dq-D/g**3))
    dg=sum(sp.diff(g,x)*vel[x] for x in X)
    r2=sp.simplify(sp.together(dg+4*(1-Theta)/g))
    dTh=sum(sp.diff(Theta,x)*vel[x] for x in X)
    r3=sp.simplify(sp.together(dTh-(-4*Theta*(2-Theta)/g**2+(6*sum(m**2 for m in mus)+2*sum(m**3 for m in mus))/g**2)))
    return r1,r2,r3
for n in (1,2):
    print("env particles:",n,"residuals (identity Q, Lemma E, Lemma 2):",check(n))
