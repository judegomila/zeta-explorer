import numpy as np
K=4
def w(x):
    # sinc(x/(2K))^(2K); entire, FT supported in [-1,1]
    y=np.asarray(x,dtype=complex)/(2*K)
    s=np.where(np.abs(y)<1e-8, 1-y*y/6, np.sin(y)/np.where(np.abs(y)<1e-8,1,y))
    return s**(2*K)
def dw(x,h=1e-5): return (w(x+h)-w(x-h))/(2*h)
def what(xi):
    # FT of w: int w(x) e^{-i xi x} dx, by quadrature (w decays like x^-8)
    x=np.linspace(-2000,2000,800001); wx=w(x).real
    xi=np.atleast_1d(xi)
    return np.array([np.trapezoid(wx*np.cos(q*x),x) for q in xi])
def mangoldt(N):
    L=np.zeros(N+1); sieve=np.ones(N+1,bool); sieve[:2]=False
    for p in range(2,N+1):
        if sieve[p]:
            sieve[2*p::p]=False; q=p
            while q<=N: L[q]=np.log(p); q*=p
    return L
