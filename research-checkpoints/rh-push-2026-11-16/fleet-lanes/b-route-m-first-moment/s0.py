import mpmath as mp
mp.mp.dps=20
f=lambda t: abs(mp.zeta(mp.mpc(0.5,t)))**4/(0.25+t*t)**2
T=400
pts=list(range(0,T+1,2))
v=mp.quad(f,pts)
# tail bound: |zeta(1/2+it)| <= 3 t^{1/4} (crude, t>=3)  => int_T^inf 81 t /t^4 dt = 81/(2T^2)
s0=v/(2*mp.pi)   # (1/4pi) * 2 * int_0^inf
print("s0 (to T=%d)="%T, s0, " crude tail <=", 81/(2*T**2)/(2*mp.pi))
open('s0.txt','w').write(str(float(s0)))
# sup of W, and W at a few points
W=lambda t: abs(mp.zeta(mp.mpc(0.5,t)))**2/(0.25+t*t)
print("W(0)=",W(0)," W(1)=",W(1)," W(2)=",W(2), "W(5)=",W(5))
