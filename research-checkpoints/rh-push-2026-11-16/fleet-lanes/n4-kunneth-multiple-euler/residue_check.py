# Segment convolution of a rational model L0(w) = -sum 1/(w-rho): residue at s = rho1+rho2 on the straight-segment sheet.
import mpmath as mp
mp.mp.dps = 25
rhos = [mp.mpc(0.5, 14.1), mp.mpc(0.7, 21.0), mp.mpc(0.5, -14.1), mp.mpc(0.3, -21.0)]
L0 = lambda w: -sum(1/(w-r) for r in rhos)
c = mp.mpf(1)
C = lambda s: mp.quad(lambda t: L0(c+(s-2*c)*t)*L0(s-c-(s-2*c)*t)*(s-2*c), mp.linspace(0, 1, 41))/(2j*mp.pi)
for i in range(4):
    for j in range(i, 4):
        s0 = rhos[i]+rhos[j]; r = mp.mpf('1e-3')
        res = sum(C(s0+r*mp.expjpi(2*k/mp.mpf(16)))*r*mp.expjpi(2*k/mp.mpf(16)) for k in range(16))/16
        print("Im signs", int(mp.sign(rhos[i].imag)), int(mp.sign(rhos[j].imag)), " residue ~", mp.nstr(res, 6), " (x2 for i!=j ordered pairs)" if i != j else "")
