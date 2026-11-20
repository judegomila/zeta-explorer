# validation of the Bessel-K kernel of xi(s+a)xi(s-a): compare with direct convolution (mpmath quad) and evenness
import sys; sys.argv=['x','--dps','150','--kernel','ea','--a','0.2']
exec(open('defect_gram.py').read().split("primes = [p for p")[0])
import mpmath as mp
mp.mp.dps=25
def kz(x):
    E=mp.exp(abs(x)); return mp.nsum(lambda n:(2*mp.pi**2*n**4*E**2.25-3*mp.pi*n**2*E**1.25)*mp.exp(-mp.pi*n*n*E),[1,mp.inf])
a=mp.mpf('0.2')
for x in ['0.4','1.3']:
    X=mp.mpf(x)
    d=mp.quad(lambda v:kz(v)*mp.exp(a*v/2)*kz(X-v)*mp.exp(-a*(X-v)/2),[-8,-2,0,X/2,X,3,8])
    print(x, kap(arb(x)).str(20), d)
