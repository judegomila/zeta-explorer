"""Device (g): size of the prime-side term T_b(y) against the mean phase derivative 2*lam, lam = (1/2) log(T/2pi),
and against the model 2/(b*alpha*lam). alpha = 1, b = 1/2 (line Re s = 1) and b = 3/4. Trapezoid rule, step 1/20."""
import json
from mpmath import mp, mpf, mpc, zeta, digamma, log, pi, cosh, fabs
mp.dps = 20
def L(z):
    s = mpf(1)/2 + z
    return 1/s + 1/(s-1) - log(pi)/2 + digamma(s/2)/2 + zeta(s, derivative=1)/zeta(s)
alpha = mpf(1); rows = []
for T in (mpf(100), mpf(1000), mpf(10000), mpf(100000)):
    for b in (mpf(1)/2, mpf(3)/4):
        h = mpf(1)/20; R = 6*b
        tot = mpf(0); k = -int(R/h)
        while k <= int(R/h):
            yy = T + k*h; Lv = L(mpc(b, yy))
            tot += -log(fabs((1 - alpha*Lv)/(1 + alpha*Lv)))/cosh(pi*(k*h)/(2*b))**2
            k += 1
        Tb = (pi/(4*b*b))*tot*h
        lam = log(T/(2*pi))/2
        rows.append({"T": float(T), "b": float(b), "T_b": float(Tb), "mean_minus_theta_prime_2lam": float(2*lam),
                     "fraction": float(Tb/(2*lam)), "model_fraction_1_over_b_alpha_lam2": float(1/(b*alpha*lam**2))})
        print(rows[-1], flush=True)
json.dump(rows, open("tb_fraction.json", "w"), indent=1)
