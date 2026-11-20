"""Ball-arithmetic version of the exponential-frame form on the orthogonal lattice nu_k = pi k / a, |k| <= K (lane s5).
On this lattice e^{i d a} = (-1)^{k-l}, so with alpha_k = Im A(nu_k), beta_k = Re B(nu_k):
  M_lk = 2 (-1)^{k-l} (alpha_l - alpha_k)/(nu_k - nu_l),  M_kk = 2 beta_k,  Gram = 2a I,  alpha_{-k} = -alpha_k, beta_{-k} = beta_k.
Even sector: u_0 = e_0/sqrt(2a), u_k = (e_k + e_{-k})/sqrt(4a); odd sector: (e_k - e_{-k})/sqrt(4a).
Values are Ritz values (upper bounds for the infimum of the form); midpoint balls as in wlib.py.
usage: python arbsym.py out.jsonl K prec OBJ1,OBJ2,... 2a_1 2a_2 ...      objects: ZETA ZETApf CHI-4 CHI5 CHI-3 DH EA<b> TNR:q:c
env RH_WORKERS"""
import os, sys
os.environ['OMP_NUM_THREADS'] = '1'; os.environ['OPENBLAS_NUM_THREADS'] = '1'
import math, json, time
import numpy as np
import multiprocessing as mp
from flint import arb, acb, arb_mat, ctx
import wlib

def obj_spec(name, nmax):
    """zs (arb), logQ, poles (arb), coefficient list c[n] (arb), pf flag"""
    if name in ('ZETA', 'ZETApf'):
        return [arb('0.25')], arb(0), [arb('0.5')], wlib.coef_zeta(nmax), name.endswith('pf')
    if name.startswith('CHI'):
        D = int(name[3:]); q = abs(D)
        tabs = {-3: [0, 1, -1], -4: [0, 1, 0, -1], 5: [0, 1, -1, -1, 1], 8: [0, 1, 0, -1, 0, -1, 0, 1]}
        return [arb('0.25') if D > 0 else arb('0.75')], arb(q).log() / 2, [], wlib.coef_chi(nmax, tabs[D]), False
    if name == 'DH':
        return [arb('0.75')], arb(5).log() / 2, [], wlib.coef_dh(nmax), False
    if name.startswith('EA'):
        b = arb(name[2:])
        return [arb('0.25') + b / 2, arb('0.25') - b / 2], arb(0), [arb('0.5') + b, arb('0.5') - b], wlib.coef_ea(nmax, b), False
    if name.startswith('TNR'):
        _, q, c = name.split(':')
        return [arb('0.25')], arb(int(q)).log(), [arb('0.5')], wlib.coef_tnr(nmax, int(q), c), False
    raise ValueError(name)

def alpha_beta(spec, a, K):
    zs, logQ, poles, coef, pf = spec
    prec = ctx.prec
    logpi = arb.pi().log()
    J = int(prec * math.log(2) / (4 * float(a.mid()))) + 3
    al = []; be = []
    terms = [(n, coef[n] / arb(n).sqrt(), arb(n).log()) for n in range(2, len(coef)) if float(abs(coef[n].mid())) != 0 and arb(n).log() < 2 * a]
    for k in range(K + 1):
        nu = arb.pi() * k / a
        A_im = arb(0); B_re = 2 * a * logQ
        for z in zs:
            s = acb(z, -nu / 2)
            A_im += s.digamma().imag / 2
            B_re += a * (s.digamma().real - logpi) + s.polygamma(1).real / 4
            for j in range(J):
                x = 2 * z + 2 * j
                e = (-2 * a * x).exp()                 # e^{-2a s_j} with e^{2 a i nu} = 1
                sj = acb(x, -nu)
                A_im += (e / sj).imag; B_re -= (e / (sj * sj)).real
        if not pf:
            for p in poles:
                for sg in (1, -1):
                    kp = acb(sg * p, nu)
                    e = (2 * a * sg * p).exp()
                    A_im += ((e - 1) / kp).imag
                    B_re += ((e - 1 - 2 * a * kp) / (kp * kp)).real
        for n, cn, ln in terms:
            A_im -= cn * (nu * ln).sin(); B_re -= cn * (2 * a - ln) * (nu * ln).cos()
        al.append(arb(A_im.mid())); be.append(arb(B_re.mid()))
    return al, be

def sector_matrices(al, be, a, K):
    nu = [arb.pi() * k / a for k in range(K + 1)]
    sg = lambda k: -1 if k % 2 else 1
    E = arb_mat(K + 1, K + 1); O = arb_mat(K, K)
    inv2a = 1 / (2 * a)
    E[0, 0] = 2 * be[0] * inv2a
    for k in range(1, K + 1):
        m0k = -2 * sg(k) * al[k] / nu[k]                  # M[0,k], alpha_0 = 0
        E[0, k] = m0k / (a * arb(2).sqrt()); E[k, 0] = E[0, k]
        mk_mk = -2 * al[k] / nu[k]                        # M[k,-k]
        E[k, k] = (2 * be[k] + mk_mk) * inv2a
        O[k - 1, k - 1] = (2 * be[k] - mk_mk) * inv2a
        for l in range(1, k):
            m1 = 2 * sg(k - l) * (al[l] - al[k]) / (nu[k] - nu[l])       # M[l,k]
            m2 = -2 * sg(k + l) * (al[l] + al[k]) / (nu[k] + nu[l])      # M[l,-k]
            E[l, k] = (m1 + m2) * inv2a; E[k, l] = E[l, k]
            O[l - 1, k - 1] = (m1 - m2) * inv2a; O[k - 1, l - 1] = O[l - 1, k - 1]
    return E, O

def pole_cols(p, a, K):
    """constraint vectors (even, odd) for ghat(+-ip) = 0 in the sector bases (common factors dropped)"""
    ev = [1 / p / arb(2).sqrt()]; od = []
    for k in range(1, K + 1):
        nu = arb.pi() * k / a; s = -1 if k % 2 else 1
        ev.append(s * p / (p * p + nu * nu)); od.append(s * nu / (p * p + nu * nu))
    return ev, od

def lam_of(Bm):
    Bf = wlib.tofloat(Bm)
    w, V = np.linalg.eigh((Bf + Bf.T) / 2)
    lam = float(w[0]); how = 'f64'; lam_s = repr(lam); extra = {}
    if abs(lam) < 1e-7:
        r = wlib.eigmin_subspace(Bm, w, V); lam = r['lam']; how = 'ball'; lam_s = r['lam_str']
        extra = dict(r=r.get('r'), fallback=r.get('fallback'), second=(r['cluster'][1] if r.get('cluster') and len(r['cluster']) > 1 else None))
    return lam, how, lam_s, extra

def task(args):
    name, twoa, K, prec = args
    ctx.prec = prec; t0 = time.time()
    a = arb(twoa) / 2
    nmax = int(math.exp(float(twoa)) + 1e-9)
    spec = obj_spec(name, max(nmax, 4))
    al, be = alpha_beta(spec, a, K)
    E, O = sector_matrices(al, be, a, K)
    rec = dict(obj=name, twoa=float(twoa), twoa_s=twoa, K=K, prec=prec)
    for nm, Mx, idx in (('even', E, 0), ('odd', O, 1)):
        if spec[4]:
            cols = [pole_cols(p, a, K)[idx] for p in spec[2]]
            Z = wlib.complement(cols, Mx.nrows()); Mx = Z.transpose() * Mx * Z
        lam, how, lam_s, extra = lam_of(Mx)
        rec[nm] = lam_s; rec['how_' + nm] = how; rec['x_' + nm] = extra
    rec['lam'] = min(float(rec['even']), float(rec['odd'])); rec['sec'] = round(time.time() - t0, 1)
    return rec

if __name__ == '__main__':
    out, K, prec = sys.argv[1], int(sys.argv[2]), int(sys.argv[3])
    names = sys.argv[4].split(','); sups = sys.argv[5:]
    W = int(os.environ.get('RH_WORKERS', '4'))
    done = set()
    if os.path.exists(out):
        for line in open(out):
            r = json.loads(line); done.add((r['obj'], r['twoa_s'], r['K']))
    tasks = [(n, s, K, prec) for s in sups for n in names if (n, s, K) not in done]
    print('arbsym: %d tasks, K = %d (sector sizes %d, %d), %d bits; planned memory per worker: 3 ball matrices %dx%d, about %.2f GB' % (
        len(tasks), K, K + 1, K, prec, K + 1, K + 1, 3 * (K + 1) ** 2 * (112 + prec / 8) / 1e9), flush=True)
    t0 = time.time()
    with mp.get_context('fork').Pool(min(W, max(1, len(tasks)))) as pool:
        for r in pool.imap_unordered(task, tasks, chunksize=1):
            print('%-10s 2a=%-8s K=%d even %s (%s) odd %s (%s)  %.0fs [%.0fs]' % (r['obj'], r['twoa_s'], K, '%.4e' % float(r['even']), r['how_even'], '%.4e' % float(r['odd']), r['how_odd'], r['sec'], time.time() - t0), flush=True)
            with open(out, 'a') as f: f.write(json.dumps(r) + '\n')
    print('done %.0fs' % (time.time() - t0), flush=True)
