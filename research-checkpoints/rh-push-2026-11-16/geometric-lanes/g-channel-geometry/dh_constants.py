# Constants of the archimedean-envelope separated-tail theorem for the DH kernel (double precision, not interval-certified)
import math
lam = math.pi/5; p = 0.5
def E(R, d):
    eR = math.exp(-R); dR = 0.6*math.exp(-3*lam/eR) if R < 6 else 0.0; c = p*eR/(2*lam); b = eR/(2*lam*R)
    eta = ((1+dR)/(1-dR))**4*(1/(1-c)+b/(1-c)**2)-1
    return 4*eta/(math.exp(d/2)-1)+32*(1+eta)/(math.e**2*R*R*(math.exp(d/4)-1)), eta
def ell(d): return (4-math.pi**2/3)/d/math.cosh(4*math.pi/d)
for d, R in [(8, 8), (4, 20), (2, 100), (1, 2000), (0.5, 1200000)]:
    e, eta = E(R, d); print(f"delta={d} R={R}: eta_R={eta:.3e} E={e:.3e} ell_delta={ell(d):.3e} margin={ell(d)-e:.3e}")
