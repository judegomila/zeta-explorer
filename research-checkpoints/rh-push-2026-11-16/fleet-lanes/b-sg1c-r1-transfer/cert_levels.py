# Certificate for Theorem 3: M(theta) = max over globally-minimal-pair configs at level Theta=theta of
# Phi = g^2 dTheta/ds equals the greedy fill value and is > 0 on (Theta_b, 1).
from fractions import Fraction as Fr
import math
def a(r): return Fr(1, r*(r+1))
def caps(J):  # c_1..c_J : 1/2,1/2,1/6,1/6,...
    return [a((j+2)//2) for j in range(J)]
def stage(J):
    c=caps(J+1); full=c[:J]; cap=c[J]
    S1=sum(full); S2=sum(x*x for x in full); S3=sum(x**3 for x in full)
    return S1,S2,S3,cap
def Phi(J,p):
    S1,S2,S3,cap=stage(J); Th=(S1+p)/2
    return Th, -4*Th*(2-Th)+6*(S2+p*p)+2*(S3+p**3)
print("stage J: Theta range, Phi(0), min over p (convex cubic), argmin")
for J in range(0,13):
    S1,S2,S3,cap=stage(J)
    eta=1-S1/2
    # dPhi/dp = 6p^2+14p-4eta ; root
    disc=196+96*eta
    pstar=(-14+math.sqrt(disc))/12
    Th0,P0=Phi(J,Fr(0)); Th1,P1=Phi(J,cap)
    if pstar<float(cap):
        # rigorous lower bound of min: evaluate at rational bracket of pstar, use convexity: min >= Phi(q) + Phi'(q)(pstar-q) ; take q rational near pstar, bound |Phi'(q)|*1e-9
        q=Fr(pstar).limit_denominator(10**9)
        d=6*q*q+14*q-4*eta
        lb=Phi(J,q)[1]-abs(d)*cap
        print(J, float(Th0), float(Th1), float(P0), "interior min >=", float(lb), "at p~", pstar, "cap", float(cap))
    else:
        print(J, float(Th0), float(Th1), float(P0), "decreasing on stage; min = Phi(cap) =", float(P1))
# J=1 stage: zero crossing = Theta_b
r=(-7+math.sqrt(73))/4
print("Theta_b", 0.25+r/2, (math.sqrt(73)-5)/8)
# analytic criterion check for K>=3: Phi_J(0) > 4 eta_J c_{J+1}
ok=True
for J in range(6,400):
    S1,S2,S3,cap=stage(J); eta=1-S1/2
    P0=Phi(J,Fr(0))[1]
    if not P0>4*eta*cap: ok=False; print("fail",J)
print("tangent criterion Phi_J(0) > 4 eta_J c_{J+1} holds exactly (rational) for J=6..399:",ok)
# asymptotics: Phi(K,K)*(K+1)^2 -> 4
for K in (5,20,100): 
    print(K, float(Phi(2*K,Fr(0))[1]*(K+1)**2))
# exact closed forms of the tangent margin (Theorem 6), K = 1..199
ok=True
for K in range(1,200):
    x=Fr(1,K+1); y=Fr(1,K+2)
    P,eta=Phi(2*K,Fr(0))[1],1-Phi(2*K,Fr(0))[0]
    ok&= P-4*eta*a(K+1)==4*x*x*(1-x-x*x)/(1+x)>0
    P,eta=Phi(2*K+1,Fr(0))[1],1-Phi(2*K+1,Fr(0))[0]
    ok&= P-4*eta*a(K+1)==(x+y)*((x+y)-2*(x*x+y*y))>0
print("tangent-margin closed forms exact and positive, K=1..199:",ok)
