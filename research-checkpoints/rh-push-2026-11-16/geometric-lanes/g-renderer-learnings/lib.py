from mpmath import mp, mpf, mpc, zeta, digamma, log, pi, sqrt, dirichlet, gamma, findroot, diff, re, im
mp.dps = 25
kap = (sqrt(10-2*sqrt(5))-2)/(sqrt(5)-1)
chi  = [0,1,1j,-1j,-1]
chib = [0,1,-1j,1j,-1]
def fdh(s,d=0):
    return (1-1j*kap)/2*dirichlet(s,chi,d) + (1+1j*kap)/2*dirichlet(s,chib,d)
def xi_dh(s):
    return (pi/5)**(-s/2)*gamma((s+1)/2)*fdh(s)
def xi_z(s):
    return s*(s-1)/2*pi**(-s/2)*gamma(s/2)*zeta(s)
def G_z(s):   # xi'/xi
    return 1/s+1/(s-1)-log(pi)/2+digamma(s/2)/2+zeta(s,derivative=1)/zeta(s)
def G_dh(s):
    return -log(pi/5)/2+digamma((s+1)/2)/2+fdh(s,1)/fdh(s)
