# zf-large-values: exact/numeric checks. Single process, sympy + plain python.
import sympy as sp
from fractions import Fraction as F
import math
d, y = sp.symbols('delta y', real=True)
# --- V1: Lemma 20.2 of the 7/8 paper (lines 11680-11720 of paper.txt)
py = 7 + 18*y + 8*y**2
jy = 185 + 170*y + (-138 + 12*y + 96*y**2)*d
Px = py/9; J = jy/108
negE = (1 + (3+8*y)*d)/48 - sp.Rational(13,32)*(sp.Rational(5,6)-d)*d*Px/J
# identity (20.9)
v = 51 + 41*y
lhs = sp.expand(10368*v*J*negE*1)
rhs = sp.expand((3+5*y)*((4*v*d-79)**2+49) + 4*y*(4*v*d*((1+3*y)*(15+32*y)*d+9-13*y)+265+3485*y))
print("V1a identity (20.9) holds:", sp.simplify(sp.cancel(lhs-rhs))==0)
# global min on the box by grid, then exact on y=0
best=(1,None)
f = sp.lambdify((d,y), negE, 'math')
N=1000
for i in range(N+1):
    for j in range(0,51):
        dd=5/6*i/N; yy=0.5*j/50
        val=f(dd,yy)
        if val<best[0]: best=(val,(dd,yy))
print("V1b grid min of -E*: %.6e at delta=%.4f, y=%.3f (x=1/2-y)"%(best[0],best[1][0],best[1][1]))
g = negE.subs(y,0); crit=[r for r in sp.solve(sp.diff(g,d),d) if 0<r<sp.Rational(5,6)]
ds=crit[0]; print("V1c exact delta* =", sp.nsimplify(ds), "=", sp.N(ds,12), " min =", sp.N(g.subs(d,ds),10),
      " a*=(1+delta*)/2 =", sp.N((1+ds)/2,8), " delta*<2/5:", bool(ds<sp.Rational(2,5)))
print("V1d Lemma lower bound 49/440640 = %.6e"%(49/440640))
# R* at binding bin and DH count 1-delta
Rstar = 1 - d + (sp.Rational(5,6)-d)*d*Px/(2*J)
print("V1e R*(delta*,1/2) =", sp.N(Rstar.subs({y:0,d:ds}),8), " 1-delta* =", sp.N(1-ds,8))
# --- V2: GM vs MV. exponents with N=1 unit, tau = log T/log N, s = sigma.
def MV(s,t): return max(2-2*s, t+1-2*s)
def GM(s,t): return max(2-2*s, 18/5-4*s, t+12/5-4*s)
def HUX(s,t): return max(2-2*s, t+4-6*s)
bad=0; win=0
for i in range(0,501):
    s=0.5+0.5*i/500
    for j in range(0,601):
        t=6*j/600
        if s<=0.7+1e-12 and GM(s,t)<MV(s,t)-1e-12: bad+=1
        if s>0.7 and GM(s,t)<min(MV(s,t),HUX(s,t))-1e-12: win+=1
print("V2 grid points with sigma<=7/10 where GM < MV:", bad, "; points sigma>7/10 where GM < min(MV,Huxley):", win)
# symbolic: third terms: (t+12/5-4s) - (t+1-2s) = 7/5-2s >=0 iff s<=7/10
# --- V3: witness ratio. every witness has spike/length S/n <= delta (q=x*delta<=delta/2).
# family GM (T->U): improves MV count (max(n,1)-S) only if 1+2n/5-2S < 1-S  <=> S>2n/5  => delta>2/5.
ds_ret = (49-sp.sqrt(921))/48
print("V3 paper retuned binding delta* =", sp.N(ds_ret,10), "<2/5:", bool(ds_ret<sp.Rational(2,5)),
      " ceiling =", sp.N((1507-2*sp.sqrt(921))/1653,12))
# --- V4: Xu-Sang system (imported): binding bin and what GM would need there
for kap in [sp.Rational(3,4), sp.Rational(29991,40000)]:
    c = 1/(3*kap)
    q = (216-18*c**2)*d**2 + (30*c**2+108*c-504)*d + 200-80*c
    r=[z for z in sp.solve(q,d) if 0<z<sp.Rational(5,6)][0]
    ell=(5-6*r)/(9+6*r*(1+c)); B=sp.Rational(11,12)-ell/4
    cnt = sp.Rational(5,9)+r*c/6   # b-neutral count 5/9 + delta*x*c/3 at x=1/2
    nmin = (1-cnt)/(2*r-sp.Rational(2,5))
    print("V4 kappa=%s: delta*=%s a*=%s B*=%s count=%s"%(kap, sp.N(r,9), sp.N((1+r)/2,7), sp.N(B,13), sp.N(cnt,8)))
    print("   intrinsic GM (T->U) third term 1+2n/5-2S with S<=delta*n beats count only for n >", sp.N(nmin,6),
          "; sextic large sieve exponent max(1,n,2(1+n)/3) there =", sp.N(2*(1+nmin)/3,6), "(MV-optimal needs n<=1/2)")
    # short witnesses n<=1/2 (where Lemma 9.1 is MV-optimal): best GM count
    best = min(max(n-r*n, 1.6*n-2*r*n, 1+0.4*n-2*r*n) for n in [0.5*k/1000 for k in range(1,1001)])
    print("   best intrinsic-GM count with n<=1/2:", sp.N(best,6), "(>= count: no gain)")
    # ambient closed family: T_eff = U^2
    amb = min(max(n*(1-r), n*(1.6-2*r), 2+0.4*n-2*r*n) for n in [20*k/20000 for k in range(1,20001)])
    print("   ambient (difference-conductor U^2) GM count, any length/power:", sp.N(amb,6), "(>= count: no gain)")
# sextic large sieve vs family MVT: gap exponent at K=U, D=U^n
for n in [0.5,0.7605,5/6,1.0]:
    print("V5 n=%.4f: Lemma 9.1 exponent %.4f vs optimal max(1,n)=%.4f"%(n, max(1,n,2*(1+n)/3), max(1,n)))
