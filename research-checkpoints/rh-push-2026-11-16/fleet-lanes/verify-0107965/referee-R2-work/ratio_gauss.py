import mpmath as mp
mp.mp.dps=50
X=mp.mpf(6000000185827); L=mp.log(X/(4*mp.pi)); N=690988
def logM0(s): return mp.log(s)+mp.log(s-1)-(s/2)*mp.log(mp.pi)+mp.log(mp.sqrt(2*mp.pi)/16)+(s/2-mp.mpf(1)/2)*mp.log(s/2)-s/2
def alpha(s): return 1/(2*s)+1/(s-1)+mp.log(s/(2*mp.pi))/2
print('ratio R = e^{t pi^2/64}|M0(iT\')|/|M_t(s+)|  vs  lead = exp(-(1+y)L/4 - tL^2/16); paper allows 2*exp(0.1)*lead per pair of remainders (4 e^{.1} total with bracket<1 each)')
worst=0
for t in [mp.mpf(0),mp.mpf(1)/100,mp.mpf(41)/1000,mp.mpf(82)/1000,mp.mpf(41)/250,mp.mpf(1)/5]:
    for y in [mp.mpf(0),mp.mpf(1)/2,mp.mpf(1)]:
        Tp=X/2+mp.pi*t/8; s=mp.mpc((1+y)/2,-X/2)
        lr=t*mp.pi**2/64+mp.re(logM0(mp.mpc(0,Tp)))-mp.re(logM0(s)+t*alpha(s)**2/4)
        lead=-(1+y)*L/4-t*L**2/16
        worst=max(worst,lr-lead)
        print('t',mp.nstr(t,4),'y',mp.nstr(y,3),'log R - log lead =',mp.nstr(lr-lead,8))
print('max log(R/lead) =',mp.nstr(worst,8),' (paper reserve 1/10; Polymath published reserve ~ (3|L+i pi/2|+3.58)/(x-8.52) =',mp.nstr((3*abs(L+1j*mp.pi/2)+3.58)/(X-8.52),5),')')
# Gaussian identity (paper eq. (gaussian) with 11/12), small D for a visible test
def G(sig,c,t,D): return mp.exp(mp.mpf(11)/(12*D)+(sig**2/D+sig*c+t*c**2/4)/(1-t/D))/mp.sqrt(1-t/D)
for (sig,c,t,D) in [(2,mp.log(9),mp.mpf(1)/5,mp.mpf(50)),(-1,-mp.log(2),mp.mpf(1)/10,mp.mpf(20)),(0.5,0,mp.mpf(41)/250,mp.mpf(100))]:
    num=mp.quad(lambda u: mp.exp((u*u+mp.mpf(11)/12)/D+c*u-(u-sig)**2/t)/mp.sqrt(mp.pi*t),[-mp.inf,sig,mp.inf])
    print('Gaussian identity check',sig,mp.nstr(c,4),mp.nstr(t,3),D,mp.nstr(num,15),mp.nstr(G(mp.mpf(sig),c,t,D),15))
# square completion with corrected Stirling constant: 1/(12(T'/2-0.33)) vs (1/3)/(4(T-3)) and (2/3)/(4(T-3))
for T in [mp.mpf(100),X/2]:
    print('T',mp.nstr(T,6),'stirling term',mp.nstr(1/(12*(T/2-mp.mpf('0.33'))),8),' (1/3)/(4(T-3))',mp.nstr(1/(12*(T-3)),8),' (2/3)/(4(T-3))',mp.nstr(1/(6*(T-3)),8))
D=X/2-3; t=mp.mpf(1)/5
print('wall bracket: G_2(0)-1 =',mp.nstr(G(mp.mpf(2),0,t,D)-1,5),' G_2(log 9) =',mp.nstr(G(mp.mpf(2),mp.log(9),t,D),8),' bracket =',mp.nstr(G(mp.mpf(2),0,t,D)/2+mp.mpf('0.2')/(N-mp.mpf('0.865'))*G(mp.mpf(2),mp.log(9),t,D)+mp.mpf('0.029')/(N-mp.mpf('0.353'))*G(mp.mpf(-1),-mp.log(2),t,D),10))
