import math
def jac(a,n):
    a%=n; r=1
    while a:
        while a%2==0:
            a//=2
            if n%8 in (3,5): r=-r
        a,n=n,a
        if a%4==3 and n%4==3: r=-r
        a%=n
    return r if n==1 else 0
def kron(D,n):
    # Kronecker symbol (D/n), D discriminant (0,1 mod 4), n>=1
    if n==0: return 0
    r=1
    while n%2==0:
        n//=2
        if D%2==0: return 0
        r*= 1 if D%8 in (1,7) else -1
    return r*jac(D,n) if n>1 else r
def sqfree(n):
    p=2
    while p*p<=n:
        if n%(p*p)==0: return False
        p+=1
    return True
def is_fund(D):
    if D%4==1: return sqfree(abs(D)) and D!=1
    if D%4==0:
        m=D//4; return m%4 in (2,3) and sqfree(abs(m))
    return False
def neg_fund(X): return [-d for d in range(3,X+1) if is_fund(-d)]
def chilist(D):
    q=abs(D); return [kron(D,n) if n else 0 for n in range(q)]
