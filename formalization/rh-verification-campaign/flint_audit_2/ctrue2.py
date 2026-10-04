# Rigorous enclosure of Platt's C(sigma,t0,h,k) using monotonicity on each cell:
#   Gp(x) = |Gamma((sigma+ix)/2)| e^{pi x/4} is increasing in x (proof: d/dx log Gp = pi/4 - Im psi((sigma+ix)/2)/2 > 0, since
#   Im psi(a+ib) = sum_n b/((n+a)^2+b^2) < pi/2 for a >= 1/2, b > 0, and < 0 for b < 0);
#   Gaussian e^{-t^2/2h^2} decreasing in |t|; |1/2+sigma-it|^k increasing in |t|.
# Each factor is evaluated at exact cell endpoints (tight balls); cells straddle no sign change of t.
import sys, subprocess, math
from flint import arb, acb, ctx
ctx.prec = 256
def Gp(x, sigma):
    return abs(acb(arb(sigma)/2, x/2).gamma()) * (arb.pi()*x/4).exp()
def C_enclosure(sigma, t0s, hs, k, M=20000, Lfac=16):
    t0 = arb(t0s); h = arb(hs); s = arb(sigma)
    L = Lfac*h; w = L/M
    gauss = lambda t: (-(t*t)/(2*h*h)).exp()
    poly = lambda t: abs(acb(s + arb(1)/2, -t))**k if k else arb(1)
    lo = arb(0); hi = arb(0)
    for i in range(M):                       # cells [a,b] in [0,L] and mirrored [-b,-a]
        a = i*w; b = (i+1)*w
        ga, gb = gauss(a), gauss(b); pa, pb = poly(a), poly(b)
        # right cell [a,b]: Gp(t0+a) <= Gp <= Gp(t0+b)
        lo += w * (Gp(t0+a, s)*gb*pa).lower(); hi += w * (Gp(t0+b, s)*ga*pb).upper()
        # left cell [-b,-a]: Gp(t0-b) <= Gp <= Gp(t0-a)
        lo += w * (Gp(t0-b, s)*gb*pa).lower(); hi += w * (Gp(t0-a, s)*ga*pb).upper()
    # tail t in [L, T1] (and mirror, which is smaller): Gp <= Gp(t0+T1), poly <= poly(T1)
    T1 = max(arb(2e5), 8*h*h)
    gtail = h*(arb.pi()/2).sqrt()*((-(L*L)/(2*h*h)).exp())          # >= int_L^inf gauss
    tail = 2 * Gp(t0+T1, s) * poly(T1) * gtail
    # t > T1: Gp(x) <= 2^{1-s/2} sqrt(pi) (s^2+x^2)^{(s-1)/4} e^{(1+2 sqrt2)/(6x)}*e (generous), poly <= (s+1/2+t)^k;
    # with x=t0+t <= 2 t0 e^{t/t0}: product * gauss <= Kc * e^{t((s-1)/(2t0) + k/T1)} e^{-t^2/2h^2} <= Kc e^{-t^2/(4h^2)} for t >= T1 >= 8h^2 (huge margin)
    Kc = arb(2)**(1-s/2)*arb.pi().sqrt()*(s*s+4*t0*t0)**((s-1)/4)*arb(3)*(s+arb(1)/2+T1)**k
    tail += 2 * Kc * h*arb.pi().sqrt()*((-(T1*T1)/(4*h*h)).exp())
    fac = (2*arb.pi())**k
    return fac*lo, fac*(hi+tail)
def flint_cb(sigma, t0, h, k):
    return arb(subprocess.check_output(['./cb2', str(sigma), t0, h, str(k)]).decode().strip())
cases = [(3,'100','2',0,20000),(5,'1000','5',0,20000),(3,'50','3',2,20000),(7,'500','4',1,20000),(9,'1000','3',0,20000),
         (25,'10000','1.478',0,20000),(25,'7800000000000','1.4777',0,4000),(1961,'7800000000000','117.75',0,4000),(1961,'7800000000000','117.75',40,4000)]
for (s,t0,h,k,M) in cases:
    lo, hi = C_enclosure(s, t0, h, k, M=M)
    cb = flint_cb(s, t0, h, k)
    lcorr = arb.pi().log() + (arb(s)-1)/4*((1+arb(s)**2/arb(t0)**2)/2).log()
    rl, rh = (lo/cb), (hi/cb)
    print(f"s={s:4d} t0={t0:>13s} h={h:>6s} k={k:2d}: ratio C_true/FLINT in [{rl.lower().str(5,radius=False) if float(rl.mid())>1e-300 else rl.log().mid().str(6,radius=False)+'(log)'}, "
          f"{rh.upper().str(5,radius=False) if float(rh.mid())>1e-300 else rh.log().mid().str(6,radius=False)+'(log)'}]   log ratio in [{rl.log().lower().str(6,radius=False)}, {rh.log().upper().str(6,radius=False)}]   log corr.factor={lcorr.mid().str(6,radius=False)}")
