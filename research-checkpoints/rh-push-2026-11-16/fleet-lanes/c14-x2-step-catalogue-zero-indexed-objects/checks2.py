# Second check file: constant-term coefficients of the three Eisenstein objects (30 digits). No large allocation.
import sys, json, mpmath as mp
mp.mp.dps = 30
xi = lambda u: mp.pi**(-u/2)*mp.gamma(u/2)*mp.zeta(u)
out = {}
rows = []
for k in (1, 2, 3):
    rho = mp.zetazero(k)
    rows.append({"zero": k, "gamma": float(rho.imag),
      "O1: |xi(rho)| (coefficient of y^(rho/2))": float(abs(xi(rho))),
      "O1: |xi(rho-1)| (coefficient of y^(1-rho/2))": float(abs(xi(rho-1))),
      "O1: |xi(2-rho)| (same by FE; argument right of 1)": float(abs(xi(2-rho))),
      "O2 shadow E*(z,rho): |xi(2rho)|": float(abs(xi(2*rho))),
      "O2 shadow E*(z,rho): |xi(2rho-1)|": float(abs(xi(2*rho-1))),
      "central value zeta(rho)zeta(1-rho) of the shadow": float(abs(mp.zeta(rho)*mp.zeta(1-rho)))})
out["constant_term_coefficients_at_zeros"] = rows
# generic parameter (not a zero): both exponents present for O1-type object
w = mp.mpc("0.7", "14.1347")
out["generic_O1_type"] = {"s0": "w/2, w=0.7+14.1347i", "|xi(w)|": float(abs(xi(w))), "|xi(w-1)|": float(abs(xi(w-1)))}
# edge template E10: at s0 = 1/2 + i t the two coefficients xi(1+2it), xi(2it) have equal modulus (vanish together)
t = mp.mpf("7.3")
out["edge_equal_modulus"] = {"t": 7.3, "|xi(1+2it)|": float(abs(xi(1+2j*t))), "|xi(2it)|": float(abs(xi(2j*t)))}
# Hermitian test of the Casimir value s(1-s): imaginary parts for O1 (s=rho/2) and O2 (s=1/4+rho/2) at an off-line test point beta=0.7
for b in ("0.5", "0.7"):
    rho = mp.mpc(b, mp.zetazero(1).imag)
    s1 = rho/2; s2 = mp.mpf(1)/4 + rho/2
    out["casimir_beta_"+b] = {"Im s(1-s), O1": float((s1*(1-s1)).imag), "Im s(1-s), O2": float((s2*(1-s2)).imag)}
json.dump(out, open(sys.argv[1], "w"), indent=1); print(json.dumps(out, indent=1))
