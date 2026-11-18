# Shared definitions. log F on a vertical line by horizontal continuation from the right.
import mpmath as mp, math, cmath
mp.mp.dps = 15
TANTH = (math.sqrt(10-2*math.sqrt(5))-2)/(math.sqrt(5)-1)
G1, G2 = 14.134725141734693, 21.022039638771555
RA = complex(0.85, (G1+G2)/2)          # pair-lift off-line zero
def F_zeta(s): return complex(mp.zeta(s))
def F_dh(s):
    s = mp.mpc(s)
    v = mp.zeta(s, mp.mpf(1)/5) + TANTH*mp.zeta(s, mp.mpf(2)/5) - TANTH*mp.zeta(s, mp.mpf(3)/5) - mp.zeta(s, mp.mpf(4)/5)
    return complex(v*mp.power(5, -s))
A_EA = 0.2
def F_ea(s): return complex(mp.zeta(s+A_EA)*mp.zeta(s-A_EA))
def F_tw2(s):                       # sign twist at p=2: local factor (1+2^-s)^-1
    z = complex(mp.power(2, -mp.mpc(s)))
    return complex(mp.zeta(s))*(1-z)/(1+z)
def F_liou(s): return complex(mp.zeta(2*mp.mpc(s))/mp.zeta(s))   # eps_p=-1 at all p
def F_lift(s):                      # pair lift: zeros 1/2+iG1, 1/2+iG2 (and conj) -> quadruple RA
    s = complex(s); r1 = complex(0.5, G1); r2 = complex(0.5, G2)
    num = (s-RA)*(s-RA.conjugate())*(s-(1-RA))*(s-(1-RA.conjugate()))
    den = (s-r1)*(s-r1.conjugate())*(s-r2)*(s-r2.conjugate())
    return complex(mp.zeta(s))*num/den
FUN = dict(zeta=F_zeta, dh=F_dh, ea=F_ea, tw2=F_tw2, liou=F_liou, lift=F_lift)
R0 = 6.0
def logF(name, sigma, u):
    """log F(sigma+iu), continued along the horizontal segment from R0+iu (principal value there)."""
    F = FUN[name]
    r = R0; f = F(complex(r, u)); val = cmath.log(f)
    step = 0.5
    while r > sigma + 1e-15:
        st = min(step, r - sigma)
        while True:
            f2 = F(complex(r - st, u))
            q = f2/f
            if abs(cmath.phase(q)) < 0.7 or st < 1e-9: break
            st *= 0.5
        val += cmath.log(q); r -= st; f = f2
        step = min(0.5, st*2)
    return val
def task(args):
    name, sigma, u = args
    return logF(name, sigma, u)
