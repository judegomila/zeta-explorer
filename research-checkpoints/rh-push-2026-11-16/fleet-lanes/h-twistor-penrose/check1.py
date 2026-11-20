# Checks for h-twistor-penrose. Normalisation: kappa(q)=2*Phi(q/2)=sum_n n^{-1/2} f(q+log n),
# X_t(w)=int kappa(q) exp(t q^2/4 + w q) dq  (Polymath t; X_0(w)=xi(1/2+w)).
import mpmath as mp, json
mp.mp.dps=30
pi=mp.pi
def f(q): return 2*(2*pi**2*mp.e**(mp.mpf(9)*q/2)-3*pi*mp.e**(mp.mpf(5)*q/2))*mp.e**(-pi*mp.e**(2*q))
def kappa(q,N=40): return mp.nsum(lambda n: n**-0.5*f(q+mp.log(n)),[1,N]) if False else sum(mp.mpf(n)**-0.5*f(q+mp.log(n)) for n in range(1,N))
def kap_even(q): return kappa(abs(q))
def X(t,w): return mp.quad(lambda q: kap_even(q)*mp.e**(t*q*q/4)*(mp.e**(w*q)+mp.e**(-w*q)),[0,0.5,1,2,3,5])
def gam(t,w): return mp.quad(lambda v: f(v)*mp.e**(t*v*v/4+w*v),[-40,-20,-10,-5,-2,0,1,2,3])
def xi(s): return mp.mpf(1)/2*s*(s-1)*pi**(-s/2)*mp.gamma(s/2)*mp.zeta(s)
out={}
# (0) normalisation X_0(w)=xi(1/2+w)
w=mp.mpc(0.3,5); out['X0_vs_xi']=str(abs(X(0,w)-xi(0.5+w))/abs(xi(0.5+w)))
# (1) sheared Dirichlet series / operator Euler product, t<0:
#  X_t(w)=sum_n n^{-1/2-w} e^{t L^2/4} gam_t(w - t L/2)
def series(t,w,N): return sum(mp.mpf(n)**(-0.5-w)*mp.e**(t*mp.log(n)**2/4)*gam(t,w-t*mp.log(n)/2) for n in range(1,N+1))
for t,N in [(-4,60),(-8,25)]:
    for w in [mp.mpc(0.3,5),mp.mpc(0,14.1),mp.mpc(-0.7,3)]:
        a=X(t,w); b=series(t,w,N); out[f'series_t{t}_w{w}']=str(abs(a-b)/abs(a))
# (2) operator Euler product over primes 2,3,5 (5-smooth n) vs the same smooth sum: commutativity + homomorphism
#  W_p F(w)= e^{t Lp^2/4} p^{-1/2-w} F(w - t Lp/2).  check W_2 W_3 = W_3 W_2 = W_6 on gam_t at a point.
t=-4; w=mp.mpc(0.3,5)
def W(n,F): 
    L=mp.log(n); return lambda w: mp.e**(t*L*L/4)*mp.mpf(n)**(-0.5-w)*F(w-t*L/2)
G=lambda w: gam(t,w)
a=W(2,W(3,G))(w); b=W(3,W(2,G))(w); c=W(6,G)(w)
out['W2W3_vs_W6']=str(abs(a-c)/abs(c)); out['W3W2_vs_W6']=str(abs(b-c)/abs(c))
# scalar coefficient alone is not multiplicative: c6/(c2 c3)=exp(t/2 log2 log3)
out['cocycle']=str(mp.e**(t*mp.log(6)**2/4)/(mp.e**(t*mp.log(2)**2/4)*mp.e**(t*mp.log(3)**2/4))-mp.e**(t*mp.log(2)*mp.log(3)/2))
# (3) conjugation identity G_t D_a G_t^{-1} = e^{-t a^2/4} M_{-t a/2} D_a on a test function
h=lambda q: mp.e**(-(q-0.3)**2)*(1+q); a_=mp.log(3); q0=mp.mpf('0.77')
lhs=mp.e**(t*q0**2/4)*(mp.e**(-t*(q0+a_)**2/4)*h(q0+a_)); rhs=mp.e**(-t*a_**2/4)*mp.e**(-t*a_*q0/2)*h(q0+a_)
out['conj']=str(abs(lhs-rhs))
json.dump(out,open('check1.json','w'),indent=1); print(json.dumps(out,indent=1))
