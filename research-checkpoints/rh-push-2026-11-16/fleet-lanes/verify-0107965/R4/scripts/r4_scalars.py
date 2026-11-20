"""R4 own re-computation of the scalar constants of Prop 3.2 (MEASURED with mpmath, 60 digits; not interval)."""
from mpmath import mp, mpf, mpc, log, exp, sqrt, pi, zeta, quad, floor, inf, re, im, fabs
mp.dps = 60
X = mpf(6000000185827); xs = X - 4
Ls = log(xs/(4*pi)); print("L*=", Ls, " 26.89<L*<26.90:", 26.89 < Ls < 26.90, " L*>2log690988:", Ls > 2*log(690988))
th = mpf(19)/125
# --- Polymath slip: 1/(12(T'/2-0.33)) <= c/(4(T-3)) needs c>=2/3 not 1/3
T = xs/2
print("Stirling term 1/(12(T/2-.33)) / [1/(4(T-3))] =", (1/(12*(T/2-mpf('0.33'))))*(4*(T-3)), "(Polymath claims <=1/3; needs 2/3)")
# --- G
D = xs/2 - 3
def G(sig, c, t, D=D, K=mpf(11)/12):
    return exp(K/D + (sig**2/D + sig*c + t*c**2/4)/(1-t/D))/sqrt(1-t/D)
def Gquad(sig, c, t, D, K=mpf(11)/12):
    f = lambda u: exp((u*u+K)/D + c*u - (u-sig)**2/t)/sqrt(pi*t)
    return quad(f, [sig-12, sig-3, sig, sig+3, sig+12])
# closed form versus quadrature at a small D (so that the D-terms are visible)
for (sig,c,t,Dd) in [(4,log(9),th,mpf(50)),(-3,-log(2),th,mpf(50)),(1.5,log(9),mpf('0.05'),mpf(20))]:
    print("G closed/quad:", G(mpf(sig),c,t,Dd), Gquad(mpf(sig),c,t,Dd))
g4 = G(4, log(9), th); gm3 = G(-3, -log(2), th); g40 = G(4, 0, th)
print("G4(log9)=", g4, "<8104", g4 < 8104, "; G-3(-log2)=", gm3, "<8.5", gm3 < 8.5)
# max over sigma in [-3,4] on a grid (convexity claim)
import itertools
grid = [mpf(-3) + mpf(7)*k/700 for k in range(701)]
print("max_sigma G(log9) at", max(grid, key=lambda s: G(s, log(9), th)), " max G(-log2) at", max(grid, key=lambda s: G(s, -log(2), th)), " max G(0) at", max(grid, key=lambda s: G(s, 0, th)))
br = g40/2 + mpf('0.2')/(690000-mpf('0.865'))*g4 + mpf('0.029')/(690000-mpf('0.353'))*gm3 + mpf(10)**-100
print("bracket=", br, "<1", br < 1)
# 3(|u|-1)^2 identity
for u in [0, 0.3, 1, 2.5, -7]:
    u = mpf(u); assert abs(4*(u*u+mpf(11)/12) - (u*u+6*abs(u)+mpf(2)/3) - 3*(abs(u)-1)**2) < mpf(10)**-50
# with 5/6 the square completion fails at |u|=1:
print("4(u^2+5/6)-(u^2+6|u|+2/3) at u=1:", 4*(1+mpf(5)/6)-(1+6+mpf(2)/3), "(negative => 5/6 insufficient once Stirling term is 2/3)")
# negative tail integrand
for r in [100, 150, 1000, 1e6, 1e12]:
    r = mpf(r); assert -4*r*r+40*r+20+(r*r+1)/D <= -3*r*r
# --- alpha bounds on |Re s|<=4, Im s = x'/2
def alpha(s): return 1/(2*s) + 1/(s-1) + log(s/(2*pi))/2
def dalpha(s): return -1/(2*s*s) - 1/(s-1)**2 + 1/(2*s)
worst = 0; worstd = 0
for sg in [mpf(-4)+mpf(8)*k/80 for k in range(81)]:
    for sign in (1,-1):
        s = mpc(sg, sign*xs/2)
        dv = abs(alpha(s) - (Ls/2 + sign*mpc(0,1)*pi/4))*xs
        worst = max(worst, dv); worstd = max(worstd, abs(dalpha(s))*xs)
        assert abs(alpha(s)) < Ls/2+1
print("max |alpha-(L/2±i pi/4)|*x' =", worst, "(<10)   max|alpha'|*x' =", worstd, "(<2)")
# --- e_AB
d = (th**2*(mpf('26.90')/2+1)**2/8 + th/4 + mpf(1)/6)/(xs/2-mpf('3.33'))
print("d=", d, " 18(e^d-1)=", 18*(exp(d)-1), "<5.5e-12", 18*(exp(d)-1) < mpf('5.5e-12'))
# --- moments of n^{-5/4}
q = mpf(5)/4
m0 = zeta(q); m1 = -zeta(q, derivative=1); m2 = zeta(q, derivative=2)
print("zeta(5/4)=", m0, " -zeta'=", m1, " zeta''=", m2, "; x1.01:", m0*1.01, m1*1.01, m2*1.01, " caps 6/22/180")
# --- eta bound (2.2)
u = (th/16 + mpf(2)/(4*pi))*4*pi/xs
print("|u|<=", u, " |eta|<=", u/(2*(1-u)), "<1e-12")
# --- S minimum under the row guard and E0,E1 vs baselines
cs = mpf(2689)/400
Smin = mpf(5)/2*cs
print("S > 2.5 c* =", Smin, " 8e^-S+5e-10=", 8*exp(-Smin)+mpf('5e-10'), "<5e-7 ; 800e^-S+7e-9=", 800*exp(-Smin)+mpf('7e-9'), "<5e-5")
print("4e^.1+3e^1e-5=", 4*exp(mpf('0.1'))+3*exp(mpf('1e-5')))
# --- normaliser: exact log|M0(iT')| e^{t pi^2/64} / |M_t(s_+)| versus the claimed exponent
def logM0(s): return log(s)+log(s-1)-s/2*log(pi)+log(sqrt(2*pi)/16)+(s/2-mpf(1)/2)*log(s/2)-s/2
def logMt(s,t): return logM0(s)+t*alpha(s)**2/4
print("normaliser check: slack = claimed exponent - exact exponent (must be >=0); 'unused' = slack available below the 1/10 reserve")
for xx in [xs, X+10**6, X*100]:
    for y in [mpf(0), mpf('0.5'), mpf(2), mpf(4), mpf('6.01')]:
        for t in [mpf(0), mpf('0.05'), th]:
            Tp = xx/2 + pi*t/8; L = log(xx/(4*pi))
            sp = mpc((1+y)/2, -xx/2)
            ex = re(logM0(mpc(0,Tp))) + t*pi**2/64 - re(logMt(sp,t))
            cl = -(1+y)*L/4 - t*L*L/16 + mpf(1)/10
            assert cl - ex > 0, (xx,y,t)
            if xx == xs and t in (0, th): print("  x*: y=%s t=%s exact-(main)= %s  (reserve 0.1)" % (y, t, mp.nstr(ex + (1+y)*L/4 + t*L*L/16, 8)))
# --- fixed fees
Lu = mpf('26.9'); y = mpf('6.01'); Cg = 10+th*(Lu/2+1)
lv = (440*th+12*y*Cg)/xs; ld = (y*Cg*(6*Lu+22)+5*th*(22*Lu+360)+12*Cg+44*th)/xs
Bf = (30+2*th*(Lu+3))/(X-2); cv = 36*Bf; cd = 18*Bf*(Lu+1)+36/(X-2)
print("leading value", mp.nstr(lv,6), "deriv", mp.nstr(ld,6), " common value", mp.nstr(cv,6), "deriv", mp.nstr(cd,6))
print("E0 fixed:", mp.nstr(mpf('5.5e-12')+lv+cv,6), "<5e-10 ; E1 fixed:", mp.nstr(mpf('5.5e-10')+ld+cd,6), "<7e-9")
