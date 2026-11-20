# Combination 4, second node: linear-shear capture norm = a * sup_xi |d/dxi P(xi)|, P = |Phihat|^2 (imp-3400/3470).
# Source convention (imp-3470): one-sided transform Phihat(xi) = int_0^U Phi(u) e^{i xi u} du, scan xi in [0, 60], and the
# kernel coded there (prefactors e^{4u}, e^{2u}).  Known answer: xi* = 12.0667 for that kernel.
import numpy as np, json, math, klib
u, w = klib.gl_nodes(4000, 0.0, 3.0)
xi = np.arange(0.0, 60.0, 0.0005)
def run(name, ph):
    wp = w*ph
    S = np.zeros_like(xi)
    for k in range(0, len(xi), 20000):
        x = xi[k:k + 20000]
        c = np.cos(np.outer(x, u)); s = np.sin(np.outer(x, u))
        C = c@wp; Sn = s@wp; C1 = -(s@(wp*u)); S1 = c@(wp*u)
        S[k:k + 20000] = 2*(C*C1 + Sn*S1)
    i = int(np.argmax(np.abs(S)))
    P0 = float(np.sum(wp))**2
    r = {'name': name, 'xi_star': float(xi[i]), 'sup|P1|': float(abs(S[i])), 'sup|P1|/P(0)': float(abs(S[i])/P0)}
    print(json.dumps(r), flush=True); return r
out = [run('zeta_repo_kernel_as_typed (known xi* = 12.0667)', klib.phi_repo_np(u)), run('zeta_canonical_Phi', klib.phi_zeta_np(u))]
for q in (3, 4, 7, 5, 8):
    b, d = klib.real_char(q); out.append(run('chi_real_q%d' % q, klib.phi_F_np(u, b, q, d)))
out.append(run('DH', klib.phi_F_np(u, klib.DH_B, 5, 1)))
out.append(run('DH_n1_term_only', 4*np.exp(3*u)*np.exp(-math.pi*np.exp(4*u)/5)))
for tau in (-1.0, 1.0):
    out.append(run('zeta_canonical_heat_tau=%g' % tau, klib.phi_zeta_np(u)*np.exp(tau*u*u)))
json.dump(out, open('out/c4_capture.json', 'w'), indent=0)
