#!/usr/bin/env python3
"""hsearch.py k N theta.npy out.jsonl rho1,rho2,.. ntau: many candidate heights T for one stage N.
For each tolerance rho and each shift tau of the target along the diagonal (theta* - tau log p is again on the zero
set of the lift, with the same sigma), LLL + Kannan embedding gives T with -T log p ~ theta*_p - tau log p (mod 2 pi);
the zero of D_N near sigma* + i(T + tau) is then solved in float64 from the exact phases.  MEASURED."""
import sys, json, math, time
sys.set_int_max_str_digits(0)
import numpy as np
from flint import fmpz_mat, arb, ctx
import tor

def candidates(k, N, seed, rhos, taus, sig_back=0.005, extra_bits=0, epsarg=None):
    w, ln, V, ps = tor.setup(k, N)
    sig, th0 = float(seed[0]) - sig_back, seed[1:]
    if sig_back:
        r, th0 = tor.solve(w, ln, V, sig, th0); assert r < 1e-12
    lp = np.log(ps.astype(float))
    a = w * np.exp(-sig * ln)
    DL = 10
    if epsarg is None: epsarg = np.zeros(len(ps))
    for rho in rhos:
        for tau in taus:
            th = th0 - tau * lp
            e = np.exp(1j * (V @ th)); J = 1j * (V.T @ (a * e)); c = np.abs(J)
            free = c * math.pi < rho / (4 * math.sqrt(len(ps)))
            idx = np.nonzero(~free)[0]; d = len(idx)
            logkappa = (d + 1) * math.log(rho / (3 * math.sqrt((d + 1) / 17.0))) - np.sum(np.log(2 * math.pi * c[idx]))
            logkappa -= extra_bits * math.log(2)
            P = int(-logkappa / math.log(2)) + 80
            ctx.prec = P + 200
            sc = arb(2) ** P
            toint = lambda x: int((x * sc).mid().floor().unique_fmpz())
            twopi = 2 * arb.pi()
            rows = []
            for jj, j in enumerate(idx):
                rw = [0] * (d + 2); rw[jj] = toint(twopi * arb(float(c[j]))); rows.append(rw)
            K = max(1, toint((arb(logkappa)).exp()))
            rows.append([toint(arb(int(ps[j])).log() * arb(float(c[j])) / 2 ** DL) for j in idx] + [K, 0])
            Mp = toint(arb(rho / 3))
            rows.append([toint(arb(float(-(th[j] - epsarg[j]))) * arb(float(c[j]))) for j in idx] + [0, Mp])
            R = fmpz_mat(rows).lll()
            best = None
            for i in range(d + 2):
                last = int(R[i, d + 1])
                if abs(last) == Mp:
                    nrm = math.sqrt(sum(float(arb(int(R[i, j])) / sc) ** 2 for j in range(d)))
                    if best is None or nrm < best[0]:
                        best = (nrm, 1 if last > 0 else -1, int(R[i, d]))
            if best is None:
                continue
            nrm, sgn, vq = best
            q = -sgn * vq
            if q % K or q == 0: continue
            q //= K
            ctx.prec = abs(q).bit_length() + 200
            T = arb(q) / 2 ** DL
            ph = [(-T * arb(int(p)).log()) / twopi for p in ps]
            thT = np.array([float((x - x.floor()).mid()) for x in ph]) * 2 * math.pi + epsarg
            s = complex(sig, tau); ok = False
            for it in range(60):
                ee = w * np.exp(-s * ln) * np.exp(1j * (V @ thT))
                f = ee.sum(); fp = -(ee * ln).sum(); s -= f / fp
                if abs(f / fp) < 1e-14: ok = True; break
            rec = dict(k=k, N=N, rho=rho, tau_target=float(tau), q=str(q), delta_log2=DL, log10T=math.log10(abs(q)) - DL * 0.30103,
                       dist=nrm, sigma_torus=sig, converged=ok, sigma_zero=s.real, tau_zero=s.imag, constrained=d)
            yield rec

if __name__ == '__main__':
    k = float(sys.argv[1]); N = int(sys.argv[2]); seed = np.load(sys.argv[3]); out = sys.argv[4]
    rhos = [float(x) for x in sys.argv[5].split(',')]; ntau = int(sys.argv[6])
    taus = np.linspace(-0.5, 0.5, ntau) if ntau > 1 else [0.0]
    f = open(out, 'a'); t0 = time.time()
    for rec in candidates(k, N, seed, rhos, taus):
        f.write(json.dumps(rec) + '\n'); f.flush()
        if rec['converged'] and rec['sigma_zero'] > 0.52 and abs(rec['tau_zero'] - rec['tau_target']) < 0.3:
            print(json.dumps({x: rec[x] for x in ('N', 'rho', 'tau_target', 'log10T', 'dist', 'sigma_zero', 'tau_zero')}), flush=True)
    print('seconds', time.time() - t0)
