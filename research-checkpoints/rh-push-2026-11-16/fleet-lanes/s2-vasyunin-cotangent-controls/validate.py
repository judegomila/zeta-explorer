# Independent checks of nbcore pair values by piecewise-exact integration of the defining integral
#   I_F(a,b) = int_0^inf rho(bx) rho(ax) dx/x^2,  rho = {.} (zeta) or S(t)=sum_{n<=t} c_n (periodic).
import subprocess, sys, math
from fractions import Fraction as Fr
import mpmath as mp
mp.mp.dps = 30
XI = (math.sqrt(10-2*math.sqrt(5))-2)/(math.sqrt(5)-1)
def brute_zeta(a,b,M=400):
    # integrate on [0,M] exactly piecewise, tail ~ mean/M with Euler-Maclaurin style correction by doubling
    def part(M):
        pts = sorted(set([Fr(j,b) for j in range(1,b*M+1)]+[Fr(k,a) for k in range(1,a*M+1)]))
        tot = mp.mpf(0); x0 = Fr(0)
        for x1 in pts:
            j = (b*x0).__floor__(); k = (a*x0).__floor__()
            if x0 == 0: tot += a*b*mp.mpf(x1.numerator)/x1.denominator
            else:
                X0 = mp.mpf(x0.numerator)/x0.denominator; X1 = mp.mpf(x1.numerator)/x1.denominator
                tot += a*b*(X1-X0) - (b*k+a*j)*mp.log(X1/X0) + j*k*(1/X0-1/X1)
            x0 = x1
        return tot
    mean = mp.mpf(1)/4 + mp.mpf(1)/(12*a*b)
    v1 = part(M)+mean/M; v2 = part(2*M)+mean/(2*M)
    return v2 + (v2-v1)/3, abs(v2-v1)   # error of tail-corrected value ~ 1/M^2
def brute_per(c,a,b,M=400):
    q = len(c); cc = lambda n: c[(n-1)%q]
    Sc = [0]
    for n in range(1,q+1): Sc.append(Sc[-1]+cc(n))
    S = lambda fl: Sc[fl % q]
    def part(M):
        X = q*M
        pts = sorted(set([Fr(j,b) for j in range(1,b*X+1)]+[Fr(k,a) for k in range(1,a*X+1)]))
        tot = mp.mpf(0); x0 = Fr(0); per = mp.mpf(0)
        for x1 in pts:
            f = S((b*x0).__floor__())*S((a*x0).__floor__())
            if x0 > 0 and f != 0:
                tot += f*(mp.mpf(x0.denominator)/x0.numerator - mp.mpf(x1.denominator)/x1.numerator)
            if x1 <= q: per += f*(mp.mpf(x1.numerator)/x1.denominator - mp.mpf(x0.numerator)/x0.denominator)
            x0 = x1
        return tot, per/q
    t1, mean = part(M); t2, _ = part(2*M)
    v1 = t1 + mean/(q*M); v2 = t2 + mean/(2*q*M)
    return v2 + (v2-v1)/3, abs(v2-v1)
def core(*args):
    return [float(x) for x in subprocess.run(['./nbcore_local']+[str(a) for a in args],capture_output=True,text=True).stdout.split()]
worst = 0
for (a,b) in [(1,1),(1,2),(2,3),(3,7),(5,12),(7,4),(11,13)]:
    v,e = brute_zeta(a,b,60); c = core('XZ',20,a,b)[3]
    print('zeta',a,b,mp.nstr(v,14),c,'diff',float(abs(v-c)),'brute err~',float(e)); worst=max(worst,float(abs(v-c)))
for name,cf in [('chi-3',[1,-1,0]),('chi5',[1,-1,-1,1,0]),('DH',[1,XI,-XI,-1,0]),('chi-4',[1,0,-1,0])]:
    for (a,b) in [(1,1),(1,2),(2,3),(3,7),(5,6),(7,4),(4,9)]:
        v,e = brute_per(cf,a,b,40); c = core('XP',len(cf),*cf,a,b)[3]
        print(name,a,b,mp.nstr(v,14),c,'diff',float(abs(v-c)),'brute err~',float(e)); worst=max(worst,float(abs(v-c)))
# T-NR pair against the 5-term combination computed from brute zeta values
q,cT=3,2.2
for (a,b) in [(1,1),(2,5),(3,4)]:
    w={-2:1,-1:2*cT,0:cT*cT+2,1:2*cT,2:1}; tot=mp.mpf(0)
    for d in range(-2,3):
        x=a*q**max(d,0); y=b*q**max(-d,0); g=math.gcd(x,y); x//=g; y//=g
        v,e=brute_zeta(x,y,30); tot+= b*w[d]*mp.mpf(q)**(-mp.mpf(d)/2)*v/y
    c=core('XT',60,q,cT,a,b)[3]; print('tnr3',a,b,mp.nstr(tot,14),c,'diff',float(abs(tot-c))); worst=max(worst,float(abs(tot-c)))
print('WORST',worst)
