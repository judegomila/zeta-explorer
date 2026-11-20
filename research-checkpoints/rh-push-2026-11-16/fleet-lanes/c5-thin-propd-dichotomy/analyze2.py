"""analyze2.py -- cross-moment (regression) analysis of the coherent term.

For weights w and a reference v (liou, d75), over the rows 0 < N(m) <= Z:
  X_wv  = sum_m C_w(m) conj C_v(m),   Dx_wv = sum_m sum_{(cn, m) = 1} w(cn^3) v(cn^3) |coefficient|^2  (cross diagonal)
  E_v   = X_vv - Dx_vv  (off-diagonal part of MS_v)
  rho_w = Re(X_wv - Dx_wv) / E_v          regression of the off-diagonal part of C_w on that of C_v
  se(rho_w) = sqrt( sum_m (Re C_w conj C_v - dx_m)^2 ) / E_v   (row noise), relative error of E_v added in quadrature
Model ("coherent term"): C_w(m) = M_w u(m) + generic, u the same for all multiplicative w, M_w the Mertens-type sum
  => rho_w = M_w / M_v,  r_w := rho_w M_v / M_w = 1;   no coherent component in C_w => r_w = 0.
Coherent part of MS_w: Ecoh_w = rho_w^2 E_v  (= |<C_w, u>|^2 up to the generic part of C_v); exponent in Z by WLS.
Usage: python analyze2.py test Z1 Z2 ... [--dir data] [--json out.json] [--zmin Z]
"""
import sys, os, json, math
import numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from analyze import load, masks, wfit, WEIGHTS, BZERO

def main():
    args = sys.argv[1:]
    ddir = 'data'; jout = None; zmin = 0
    if '--dir' in args: i = args.index('--dir'); ddir = args[i + 1]; del args[i:i + 2]
    if '--json' in args: i = args.index('--json'); jout = args[i + 1]; del args[i:i + 2]
    if '--zmin' in args: i = args.index('--zmin'); zmin = int(args[i + 1]); del args[i:i + 2]
    test = args[0]; Zs = [int(z) for z in args[1:]]
    D = {Z: load(os.path.join(ddir, f'agg_{test}_{Z}.bin')) for Z in Zs}
    side = {Z: json.load(open(os.path.join(ddir, f'in_{test}_{Z}.bin.side.json'))) for Z in Zs}
    Mw = np.array([[side[Z]['mertens'][w] for w in WEIGHTS] for Z in Zs])
    lz = np.log(np.array(Zs, float))
    out = {'test': test, 'Z': Zs, 'weights': WEIGHTS, 'mertens': Mw.tolist(), 'ref': {}}
    tw = ['e99', 'e97', 'e95', 'e90', 'e60', 'rm95a', 'rm95b', 'rm90', 'd75', 'liou', 'd50', 'iid', 'shuf95', 'one']
    for stratum in ('all', 'sqfree'):
        for ref in ('liou', 'd75'):
            v = WEIGHTS.index(ref)
            rho = np.zeros((len(Zs), len(WEIGHTS))); srho = np.zeros_like(rho); Ev = np.zeros(len(Zs)); sEv = np.zeros(len(Zs)); imag = np.zeros_like(rho); Dg = np.zeros(len(Zs)); xraw = np.zeros_like(rho)
            for i, Z in enumerate(Zs):
                d = D[Z]; sel = masks(d)[stratum]
                X = d['xm'][sel].sum(axis=0); Dx = d['xd'][sel].sum(axis=0); XV = d['xv'][sel].sum(axis=0)
                Ev[i] = X[v, v].real - Dx[v, v]; sEv[i] = math.sqrt(XV[v, v]); Dg[i] = Dx[0, 0]; xraw[i] = np.diag(X).real / Dx[0, 0] - 1
                rho[i] = (X[:, v].real - Dx[:, v]) / Ev[i]
                imag[i] = X[:, v].imag / Ev[i]
                srho[i] = np.sqrt(XV[:, v] / Ev[i] ** 2 + (rho[i] * sEv[i] / Ev[i]) ** 2)
            pred = Mw / Mw[:, [v]]
            rec = {'D': Dg.tolist(), 'x_raw': xraw.tolist(), 'E_ref': Ev.tolist(), 'se_E_ref': sEv.tolist(), 'rho': rho.tolist(), 'se_rho': srho.tolist(), 'pred': pred.tolist(), 'pooled_r': {}, 'coh_exp': {}}
            print(f"\n=== test {test}, rows {stratum}, reference {ref}:  rho_w (se) / prediction M_w/M_ref ===")
            print("       Z   E_ref/Z " + " ".join(f"{w:>22s}" for w in tw if w != ref))
            for i, Z in enumerate(Zs):
                print(f"{Z:8d} {Ev[i] / Z:8.4f}  " + " ".join(f"{rho[i, WEIGHTS.index(w)]:+.4f}({srho[i, WEIGHTS.index(w)]:.4f})/{pred[i, WEIGHTS.index(w)]:+.4f}" for w in tw if w != ref))
            keep = np.array(Zs) >= zmin
            print(f"pooled r_w = rho_w M_ref/M_w (weighted mean over scales Z >= {zmin}; r = 1 coherent term with the reference constant, r = 0 absent),")
            print("and exponent in Z of the coherent part Ecoh_w = rho_w^2 E_ref of MS_w (WLS on log, errors propagated; scaled by sqrt(chi2/dof) if > 1):")
            for w in tw:
                if w == ref: continue
                j = WEIGHTS.index(w)
                r = rho[keep, j] / pred[keep, j]; sr = srho[keep, j] / np.abs(pred[keep, j])
                wt = 1 / sr ** 2
                rm = float((wt * r).sum() / wt.sum()); srm = float(1 / math.sqrt(wt.sum()))
                chi1 = float((wt * (r - 1) ** 2).sum()); chi0 = float((wt * r ** 2).sum()); chim = float((wt * (r - rm) ** 2).sum())
                rec['pooled_r'][w] = [rm, srm, chi1, chi0, chim, int(keep.sum())]
                line = f"   {w:7s} r = {rm:+.4f} +- {srm:.4f}   chi2(r=1) {chi1:9.1f}  chi2(r=0) {chi0:10.1f}  chi2(fit) {chim:7.1f}  ({int(keep.sum())} scales)"
                good = keep & (np.abs(rho[:, j]) > 3 * srho[:, j])
                if good.sum() >= 4 and w in BZERO:
                    y = np.log(rho[good, j] ** 2 * Ev[good]); sy = np.sqrt((2 * srho[good, j] / np.abs(rho[good, j])) ** 2)
                    b, sb, chi2, dof, sbs, a = wfit(lz[good], y, sy)
                    bM = np.polyfit(lz[good], np.log(Mw[good, j] ** 2), 1)[0]
                    rec['coh_exp'][w] = [b, sb, sbs, chi2, dof, int(good.sum()), float(bM)]
                    line += f"   | exponent of Ecoh: {b:.4f} +- {sbs:.4f} (chi2/dof {chi2:.1f}/{dof}, {int(good.sum())} scales); asymptotic 2b-5/6 = {2 * BZERO[w] - 5 / 6:.4f}; minus 1: {b - 1:+.4f} vs {2 * (BZERO[w] - 11 / 12):+.4f}"
                if w in BZERO and w != 'liou':
                    f = rho[:, j] ** 2 * Ev / Dg
                    sl = float(np.polyfit(lz[keep], np.log1p(f[keep]), 1)[0])
                    rec.setdefault('coh_fraction', {})[w] = [f.tolist(), sl]
                    line += f"   | coherent fraction rho^2 E_ref/D at the top scale {100 * f[-1]:.3f}% (raw MS_w/D - 1 = {100 * xraw[-1, j]:+.3f}%); exponent it contributes to MS_w: {sl:+.5f}"
                print(line)
            b, sb, chi2, dof, sbs, a = wfit(lz[keep], np.log(np.abs(Ev[keep])), sEv[keep] / np.abs(Ev[keep]))
            bk, sbk, chi2k, dofk, sbks, ak = wfit(lz[keep], np.log(np.abs(Ev[keep]) / Mw[keep, v] ** 2), sEv[keep] / np.abs(Ev[keep]))
            rec['exp_E_ref'] = [b, sbs, chi2, dof]; rec['exp_kappa_ref'] = [bk, sbks, chi2k, dofk]
            print(f"   reference {ref}: exponent of E_ref = {b:.4f} +- {sbs:.4f} (chi2/dof {chi2:.1f}/{dof}); of kappa = E_ref/M_ref^2: {bk:+.4f} +- {sbks:.4f} (sixth-power count: +0.1667)")
            out['ref'][f'{stratum}:{ref}'] = rec
    if jout: json.dump(out, open(jout, 'w'), indent=1)

if __name__ == '__main__':
    main()
