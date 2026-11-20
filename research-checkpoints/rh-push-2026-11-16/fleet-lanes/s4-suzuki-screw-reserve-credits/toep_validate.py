import numpy as np, math, json
from toep import *
res = {}
ob = Obj('zeta', 60)
# (1) mesh refinement identity U* H_{h/2,2m} U = H_{h,m}
W = arb('2.5'); m = 32
q1, _ = psi_q(ob.pieces(W, m)); q2, _ = psi_q(ob.pieces(W, 2*m))
q1 = fl(q1); q2 = fl(q2)
i = np.arange(m); H1 = q1[np.abs(i[:, None] - i[None, :])]; j = np.arange(2*m); H2 = q2[np.abs(j[:, None] - j[None, :])]
Um = np.zeros((2*m, m)); Um[2*i, i] = Um[2*i + 1, i] = 1/math.sqrt(2)
res['refinement_identity_maxerr'] = float(np.abs(Um.T @ H2 @ Um - H1).max())
# (2) the constant vector reproduces Psi(W): e0 = m^{-1/2} sum e_i, (W/2) q[e0] = Psi(W)
pc = ob.pieces(W, m); psiW = float((pc['arch'][m] + pc['pole'][m] - pc['pp'][m] + pc['pm'][m] + pc['k0']/2*W).mid())
res['box_from_matrix'] = float(2.5/2*np.ones(m) @ H1 @ np.ones(m)/m); res['Psi(W)'] = psiW
# (3) Toeplitz entries against a direct zero-side Gram entry is not available for step functions (slow convergence); instead
#     compare the quadratic form on a smooth vector with the zero side: f = sum_i g(x_i) e_i with g a narrow Gaussian is still a step function.
# (4) network decomposition
B, C, qf, info = network(pc)
res['network_decomposition_error'] = float(np.abs(B - C - H1).max()); res['lamB_min'] = float(np.linalg.eigvalsh(B)[0]); res['lamC_min'] = float(np.linalg.eigvalsh(C)[0]); res.update(info)
res['lam_min_zeta_W2.5_m32'] = float(np.linalg.eigvalsh(H1)[0]); res['G_1e-6'] = gain(B, C, 1e-6)
# (5) zero side for the full matrix: entry_{ij} = sum_gamma |hat e(gamma)|^2 cos(gamma (i-j) h), hat e = h^{-1/2} 2 sin(gamma h/2)/gamma  (slow 1/gamma^2 tail)
Z = json.load(open('../s3-truncated-euler-strip/zeros_ZETA.json')); gz = np.array([float(x) for x in Z['gamma']])
h = 2.5/m
from validate_zero import tail_mean
qz = np.array([2*np.sum((4*np.sin(gz*h/2)**2/(h*gz**2))*np.cos(gz*d*h)) for d in range(m)]); qz[0] += tail_mean(2000.0, 1)*2/h
res['q_vs_zero_side_maxdiff'] = float(np.abs(qz - q1).max()); res['q0'] = float(q1[0]); res['q_first'] = q1[:4].tolist(); res['qz_first'] = qz[:4].tolist()
# (6) DH: sign of lambda_min at W = 3.3 and 3.8 (rounds 2-3: full-form onset 3.44-3.56)
obd = Obj('DH', 60)
for Wd in (3.0, 3.8):
    rec, _ = evaluate(obd, Wd, 128); res['DH_W%.1f_m128' % Wd] = rec
rec, _ = evaluate(ob, 3.0, 128); res['zeta_W3.0_m128'] = rec
print(json.dumps(res, indent=1)); json.dump(res, open('toep_validate.json', 'w'), indent=1)
