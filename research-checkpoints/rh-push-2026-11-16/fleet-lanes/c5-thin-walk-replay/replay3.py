import random, cmath, math
print("planned memory: < 10 MB")
random.seed(7); worst=0
for _ in range(2000):
    Q=random.choice([7,13,31,97]); x=complex(random.uniform(.6,2),random.uniform(-5,5)); w=complex(random.uniform(.5,2),random.uniform(-5,5)); z=complex(random.uniform(.2,1),random.uniform(-5,5))
    e=cmath.exp(2j*math.pi*random.random()); r=cmath.exp(2j*math.pi*random.randrange(6)/6); a=cmath.exp(2j*math.pi*random.random())
    V=Q**(-6*z); R=(a*e**3)**2*Q**(4-6*x-6*z); W=r*Q**(-w)
    J=-e/r*Q**(-x)+W*R
    Ps=((R*(1-1/Q)-e*(Q-1)*Q**(-x-w)*V)/(1-V)+J)/(1-R)
    Pp=1/(1-V)+W/(1-W)+Ps
    for D in (e*r*Q**(-x), e/r*Q**(-x)):
        H=Pp*(1-V)*(1-W)/(1-D); E=Ps+D
        rhs=(D*(V+W-V*W)-V*W+(1-V)*(1-W)*E)/(1-D)
        worst=max(worst,abs(H-1-rhs)/(1+abs(H)))
print("max relative residual of (7.17), 2000 random points, both conventions for D:", worst)
