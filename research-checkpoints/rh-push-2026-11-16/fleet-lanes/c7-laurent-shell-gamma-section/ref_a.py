# Referee check of Lemma 1 on a case the note did not run: trigonometric-polynomial density (the PROVED case),
# P={2,3}, pb=3, rho(phi)=1+c cos(phi-a), phi=-gamma log2 - th2, poles gamma_k=(2 pi k - th3)/log3.
# float accumulation of acb midpoints at 80 bits: MEASURED, not a ball run.
import sys, math, cmath, time
from flint import acb, arb, ctx, dirichlet_char
ctx.prec = 80
func = sys.argv[1]; deltas = [float(x) for x in sys.argv[2].split(',')]
c, a, th2, th3 = 0.9, 1.0, 2.0, 2.5
kap = (math.sqrt(10 - 2*math.sqrt(5)) - 2)/(math.sqrt(5) - 1); c1, c2 = (1 - 1j*kap)/2, (1 + 1j*kap)/2
CHI = {1: 1, 2: 1j, 3: -1j, 4: -1, 0: 0}
def lau(ch2, ch3):   # sum over n=3^j and n=2*3^j of chi(n) n^-1/2 c_nu(n)/c_nu(1)
    return (1 + ch2*c*cmath.exp(1j*(th2 + a))/(2*math.sqrt(2)))/(1 - ch3*3**-0.5*cmath.exp(1j*th3))
def extra(ch2, ch3): # what the modes at q=3^j/2 (non-integral) would add if they counted
    z = ch3*3**-0.5*cmath.exp(1j*th3)
    return (c/2)*cmath.exp(-1j*(th2 + a))*math.sqrt(2)/ch2*z/(1 - z)
if func == 'zeta': pred = lau(1, 1); ex = extra(1, 1)
else: pred = c1*lau(1j, -1j) + c2*lau(-1j, 1j); ex = c1*extra(1j, -1j) + c2*extra(-1j, 1j)
CH = dirichlet_char(5, 2); CHB = dirichlet_char(5, 3); C1 = acb(0.5, -kap/2); C2 = acb(0.5, kap/2)
tmax = 45/min(deltas); L3 = math.log(3); L2 = math.log(2); T0 = time.time()
S = {d: 0j for d in deltas}; S1 = {d: 0.0 for d in deltas}; n = 0
k = 1
while True:
    g = (2*math.pi*k - th3)/L3; k += 1
    if g < 1: continue
    if g > tmax: break
    r = (1 + c*math.cos(-g*L2 - th2 - a))/L3
    sv = acb(0.5, g); v = sv.zeta() if func == 'zeta' else C1*CH.l(sv) + C2*CHB.l(sv)
    v = complex(float(v.real.mid()), float(v.imag.mid())); n += 1
    for d in deltas:
        w = r*math.exp(-d*g); S[d] += w*v; S1[d] += w
print(func, 'poles', n, 'pred(Laurent)', pred, 'non-integral modes would add about', ex, 'sec', round(time.time() - T0))
for d in deltas: print(' delta', d, 'S/S1', S[d]/S1[d], 'diff', abs(S[d]/S1[d] - pred))
