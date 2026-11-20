# Step (3) of Theorem A': k-uniform bound C(delta) >= |J_k - k^{5/2} e^{5 i delta/2} exp(-2 pi k eta)| for every k,
# C(delta) = (1/2pi)[ int_{t0}^inf |chi - chi_+|(-3/2+it) e^{-delta t} dt + int_{-inf}^{t0} |chi_+(-3/2+it)| e^{-delta t} dt ],
# and direct values of the difference for several k (mpmath quadrature, 30 digits; not interval).
import mpmath as mp, json
mp.mp.dps = 30
def chiplus(s): return (1j/2)*(2*mp.pi)**s/mp.pi*mp.exp(-1j*mp.pi*s/2)*mp.gamma(1 - s)
def chifull(s): return 2**s*mp.pi**(s - 1)*mp.sin(mp.pi*s/2)*mp.gamma(1 - s)
t0 = 1; out = []
for delta in [1, 0.3, 0.01]:
    a = mp.quad(lambda t: abs(chifull(mp.mpc(-1.5, t)) - chiplus(mp.mpc(-1.5, t)))*mp.exp(-delta*t), mp.linspace(t0, 60, 60))
    b = mp.quad(lambda t: abs(chiplus(mp.mpc(-1.5, t)))*mp.exp(-delta*t), mp.linspace(-60, t0, 62))
    C = (a + b)/(2*mp.pi)
    row = {'delta': delta, 'C': float(C), 'diff': {}}
    for k in [1, 2, 5, 30, 1000]:
        e1 = mp.quad(lambda t: (chifull(mp.mpc(-1.5, t)) - chiplus(mp.mpc(-1.5, t)))*mp.exp(1j*t*mp.log(k) - delta*t), mp.linspace(t0, 60, 600))
        e2 = mp.quad(lambda t: chiplus(mp.mpc(-1.5, t))*mp.exp(1j*t*mp.log(k) - delta*t), mp.linspace(-60, t0, 620))
        row['diff'][k] = float(abs(e1 - e2)/(2*mp.pi))
    out.append(row); print(row)
json.dump(out, open('ref2_step3.json', 'w'), indent=1)
