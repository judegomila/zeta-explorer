import mpmath as mp
Q = 3
def setup(dps): mp.mp.dps = dps
def kap(): return (mp.sqrt(10-2*mp.sqrt(5))-2)/(mp.sqrt(5)-1)
def xi(s): return mp.mpf(1)/2*s*(s-1)*mp.pi**(-s/2)*mp.gamma(s/2)*mp.zeta(s)
def Lxi(s):  # xi'/xi
    return 1/s + 1/(s-1) - mp.log(mp.pi)/2 + mp.digamma(s/2)/2 + mp.zeta(s, derivative=1)/mp.zeta(s)
def dh(s):
    a = [0, 1, kap(), -kap(), -1]
    return 5**(-s)*sum(a[k]*mp.zeta(s, mp.mpf(k)/5) for k in range(1,5))
def dh1(s):
    a = [0, 1, kap(), -kap(), -1]
    return -mp.log(5)*dh(s) + 5**(-s)*sum(a[k]*mp.zeta(s, mp.mpf(k)/5, derivative=1) for k in range(1,5))
def LamDH(s): return (5/mp.pi)**(s/2)*mp.gamma((s+1)/2)*dh(s)
def LDH(s): return mp.log(5/mp.pi)/2 + mp.digamma((s+1)/2)/2 + dh1(s)/dh(s)
half = lambda: mp.mpf(1)/2
# fields F(z) and log-derivatives L(z), z = s - 1/2
def make(name, c=None, a=None, q=Q):
    lq = mp.log(q)
    if name == 'zeta':
        return (lambda z: xi(half()+z)), (lambda z: Lxi(half()+z))
    if name == 'DH':
        return (lambda z: LamDH(half()+z)), (lambda z: LDH(half()+z))
    if name == 'NR':
        return (lambda z: xi(half()+z)*(2*mp.cosh(z*lq)+c)), (lambda z: Lxi(half()+z) + 2*lq*mp.sinh(z*lq)/(2*mp.cosh(z*lq)+c))
    if name == 'EA':
        return (lambda z: xi(half()+z+a)*xi(half()+z-a)), (lambda z: Lxi(half()+z+a)+Lxi(half()+z-a))
CONTROLS = [('zeta',{}),('DH',{}),('NR',{'c':2.2}),('NRt',{'c':1.0}),('EA',{'a':0.3})]
def get(label):
    for n,kw in CONTROLS:
        if n==label:
            kw2={k:mp.mpf(str(v)) for k,v in kw.items()}
            return make('NR' if n=='NRt' else n, **kw2)
_get0 = get
def get(label):   # also accepts 'NR:<c>', 'NR:<c>:<q>' and 'EA:<a>'
    if ':' in label:
        p = label.split(':')
        if p[0]=='NR': return make('NR', c=mp.mpf(p[1]), q=int(p[2]) if len(p)>2 else Q)
        if p[0]=='EA': return make('EA', a=mp.mpf(p[1]))
    return _get0(label)
