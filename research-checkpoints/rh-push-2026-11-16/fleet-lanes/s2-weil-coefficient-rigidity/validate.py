"""Validation of wlib against known answers (zeta):
 (a) A_log[0,0] = 1 and A_log = diag(H_n) + ... (diag check only: A_log[n,n] - H_n - log 2 + (1/2)<phi_n, log(1-s^2) phi_n> for n=0,1)
 (b) full-form [0,0] entry = 2 Psi(2a)/(2a), Psi = Suzuki function (PR 21 normalisation)
 (c) pole-free margins 9.5e-4 (2a = ln 3), 8.55e-8 (2a = ln 4) [route 11 / memory]; moment ladder at ln 3: 0.0334, 0.414, 0.799, 0.814
 (d) full even-block residual 9.404e-7 at a = 0.5, 5.634e-8 at (ln 3)/2, 8.39e-13 at ln 2; P_2(0.5) = 1.2504e-2 [imp-96091]
"""
import sys, json, time
from wlib import *
import mpmath as mp
N = int(sys.argv[1]) if len(sys.argv) > 1 else 40
setprec(int(sys.argv[2]) if len(sys.argv) > 2 else 256)
print('planned: %d GL nodes x %dx%d ball matrices, < 0.5 GB' % (2 * (N + 56), N, N), flush=True)
t0 = time.time()
A = {'ln3': arb(3).log() / 2, 'ln4': arb(4).log() / 2, '0.5': arb('0.5'), 'ln5': arb(5).log() / 2}
names = list(A)
Alog, T = assemble_arch(N, [(A[k], ['0.25']) for k in names], log=sys.stdout)
print('A_log[0,0] =', Alog[0, 0].str(20), ' A_log[1,1] =', Alog[1, 1].str(20), '(expect 1 and H_1 + log2 - (1/2)*(3/2)int s^2 log(1-s^2) ds = 1 + log 2 - (3/4)(4/3 log 2 - 16/9)... )')
mp.mp.dps = 30
v11 = 1 + mp.log(2) - mp.mpf(3) / 4 * mp.quad(lambda s: s * s * mp.log(1 - s * s), [-1, 0, 1])
print('  reference [1,1] =', v11)
out = {}
ev = [i for i in range(N) if i % 2 == 0]; od = [i for i in range(N) if i % 2 == 1]
for si, k in enumerate(names):
    a = A[k]
    M0 = arch_matrix(N, a, ['0.25'], Alog, T[si])
    R = {}
    for n in range(2, 6):
        C = rung(N, a, n)
        if C is not None: R[n] = C + C.transpose()
    cz = coef_zeta(5)
    Mpf = M0
    for n in R: Mpf = Mpf - R[n] * cz[n]
    vp = pole_vec(N, a, '0.5', 1); vm = pole_vec(N, a, '0.5', -1)
    vpm = arb_mat([[x] for x in vp]); vmm = arb_mat([[x] for x in vm])
    Mfull = Mpf + vpm * vpm.transpose() + vmm * vmm.transpose()
    # (b) Suzuki check
    W = 2 * float(a.mid())
    mp.mp.dps = 40
    Wm = mp.mpf(2) * mp.mpf(a.mid().str(40, radius=False))
    aa = (mp.digamma(mp.mpf(5) / 4) - mp.log(mp.pi)) / 2
    Tm = mp.nsum(lambda kk: (1 - mp.exp(-(2 * kk + mp.mpf(1) / 2) * Wm)) / (2 * kk + mp.mpf(1) / 2) ** 2, [1, mp.inf])
    D = sum(mp.mangoldt(n) / mp.sqrt(n) * (Wm - mp.log(n)) for n in range(2, 6) if mp.log(n) < Wm) - 4 * (mp.exp(Wm / 2) - 1) + 2 * Wm
    Psi = aa * Wm + Tm - D
    print(k, ' M_full[0,0] =', Mfull[0, 0].str(22), '  2Psi(2a)/(2a) =', mp.nstr(2 * Psi / Wm, 22), ' maxrad', maxrad(Mfull))
    res = {}
    for par, idx in (('even', ev), ('odd', od)):
        # full form
        r = eigmin_robust(sub(Mfull, idx))
        res['full_' + par] = r['lam_str']
        if par == 'even' and 2 in R:
            v = r['vec']
            res['P2_even'] = (quad(sub(R[2], idx), v) * cz[2]).mid().str(8, radius=False)
        # pole-free with k moments
        col = [vp[i] + (vm[i] if par == 'even' else -vm[i]) for i in idx]
        for kmom in range(0, 5):
            keep = [j for j, i in enumerate(idx) if i >= kmom]
            Z = complement([[col[j] for j in keep]], len(keep))
            Ms = sub(Mpf, [idx[j] for j in keep])
            Mc = Z.transpose() * Ms * Z
            res['pf_k%d_%s' % (kmom, par)] = eigmin_robust(Mc)['lam_str']
    out[k] = res
    print(k, json.dumps(res, indent=1), 'elapsed %.1f' % (time.time() - t0), flush=True)
json.dump(out, open('validate_N%d.json' % N, 'w'), indent=1)
