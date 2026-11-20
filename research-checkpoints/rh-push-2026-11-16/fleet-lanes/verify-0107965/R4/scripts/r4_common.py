"""R4 numerical test (MEASURED, python-flint ball arithmetic used as high-precision floats, 256 bits) of rows 3-4 of the
App C.2 table at the anchor: exact-source fixed-N model versus the frozen common model f_x, value and h-derivative,
and of the crossing-pair cost. Falsification test only."""
import sys
from fractions import Fraction as F
from flint import arb, acb, ctx
ctx.prec = 256
pi = arb.pi(); I = acb(0,1)
def A(q): q = F(q); return arb(q.numerator)/q.denominator
def alpha(s): return 1/(2*s) + 1/(s-1) + (s/(2*pi)).log()/2
def dalpha(s): return -1/(2*s*s) - 1/((s-1)*(s-1)) + 1/(2*s)
def logM0(s): return s.log()+(s-1).log()-s/2*pi.log()+((2*pi).sqrt()/16).log()+(s/2-A(F(1,2)))*(s/2).log()-s/2
def logMt(s,t): return logM0(s)+t*alpha(s)*alpha(s)/4
def beta(s,t): return alpha(s)+t/2*alpha(s)*dalpha(s)
def mag(z): return float(abs(z).mid()) if hasattr(abs(z),'mid') else float(abs(z))
def run(x, v, h, t, tag=""):
    x = A(x); v = A(v); h = A(h); t = A(t)
    L = (x/(4*pi)).log(); tau = x/2 + pi*t/8
    N = int(((L.exp() + t/16).sqrt()).floor().unique_fmpz())
    xp = x + v
    a = acb((1+h)/2, -xp/2); b = 1 - a
    aa, ab = alpha(a), alpha(b)
    sU = a + t/2*aa; sV = b + t/2*ab
    lg = logMt(b,t) - logMt(a,t); gam = lg.exp()
    sUp = (1 + t/2*dalpha(a))/2; sVp = -(1 + t/2*dalpha(b))/2
    lgp = -(beta(b,t) + beta(a,t))/2
    Gam = (logMt(acb(A(F(1,2)), x/2), t) - logMt(acb(A(F(1,2)), -x/2), t)).exp()
    zeta = acb(h, -v)
    e1 = -A(F(1,2)) - t*L/4 + I*tau - zeta/2
    e2 = -A(F(1,2)) - t*L/4 - I*tau + zeta/2
    pref2 = Gam*(-zeta*L/2).exp()
    S1=S1l=S2=S2l=C1=C1l=C2=C2l = acb(0)
    m0=m1=m2 = arb(0)
    for n in range(1, N+1):
        r = arb(n).log(); bt = t*r*r/4
        u = (bt - sU*r).exp(); w = (bt - sV*r).exp()
        S1 += u; S1l += r*u; S2 += w; S2l += r*w
        c = (bt + e1*r).exp(); d = (bt + e2*r).exp()
        C1 += c; C1l += r*c; C2 += d; C2l += r*d
        au = abs(u); m0 += au; m1 += r*au; m2 += r*r*au
    Fex = S1 + gam*S2
    dFex = -sUp*S1l + gam*(lgp*S2 - sVp*S2l)
    f = C1 + pref2*C2
    df = -C1l/2 + pref2*(-(L/2)*C2 + C2l/2)
    M2b = [abs(gam)*sum_ for sum_ in (1,)]
    print("%s x=X+%s v=%s h=%s t=%s N=%d : |Fex-f|=%.4e  |dFex-df|=%.4e   first-branch moments M0=%.4f M1=%.4f M2=%.3f  |Fex|=%.5f" % (
        tag, str(x - 6000000185827)[:12], v, h, t, N, mag(Fex-f), mag(dFex-df), float(m0.mid()), float(m1.mid()), float(m2.mid()), mag(Fex)))
    sys.stdout.flush()
    return mag(Fex-f), mag(dFex-df)
X = 6000000185827
fee_v = 1.57747e-10 + 2.34538e-10; fee_d = 2.38662e-9 + 3.2778e-9
worst_v = worst_d = 0.0
cases = [(X, F(39,20), F(6), F(19,125)), (X, F(-39,20), F(6), F(19,125)), (X, F(39,20)+F(1,100), F(601,100), F(19,125)),
         (X-F(0), F(1), F(3), F(1,10)), (X, F(-39,20), F(3,2), F(19,125)), (X, F(0), F(6), F(19,125)), (X, F(39,20), F(5,2), F(0))]
for (x,v,h,t) in cases:
    dv, dd = run(x, v, h, t)
    worst_v = max(worst_v, dv); worst_d = max(worst_d, dd)
print("worst value diff %.4e vs fee %.4e ; worst derivative diff %.4e vs fee %.4e ; %s" % (worst_v, fee_v, worst_d, fee_d, "OK" if worst_v <= fee_v and worst_d <= fee_d else "VIOLATION"))
# crossing pair: centre just below the activation of m = N+1, translated point above it
ctxp = ctx.prec
for (h, t) in [(F(6), F(19,125)), (F(3,2), F(19,125)), (F(5,2), F(0)), (F(2), F(1,20))]:
    m = 690989
    tt = A(t)
    xm = 4*pi*(arb(m)**2 - tt/16)
    for (xc, v) in [(xm - A(F(1,2)), A(F(39,20))), (xm + A(F(1,2)), A(F(-39,20)))]:
        for hh in (A(h) - A(F(1,100)), A(h)):
            xp = xc + v
            a = acb((1+hh)/2, -xp/2); b = 1 - a
            sU = a + tt/2*alpha(a); sV = b + tt/2*alpha(b)
            gam = (logMt(b,tt) - logMt(a,tt)).exp()
            r = arb(m).log(); bt = tt*r*r/4
            pair = abs((bt - sU*r).exp()) + abs(gam*(bt - sV*r).exp())
            cs = A(F(2689,400)); S = (1 + A(h) - A(F(1,100)))*cs + tt*cs*cs
            bound = 3*A(F(1,100000)).exp()*(-S).exp()
            print("pair h=%s (eval y=%s) t=%s centre %s activation: |pair|=%.6e  3e^{1e-5}e^{-S}=%.6e  ratio=%.4f %s" % (
                h, str(hh)[:5], t, "below" if float(v.mid())>0 else "above", float(pair.mid()), float(bound.mid()), float((pair/bound).mid()), "OK" if pair < bound else "VIOLATION"))
