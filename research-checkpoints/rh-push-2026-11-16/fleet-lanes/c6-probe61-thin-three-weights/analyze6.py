"""analyze6.py -- tables and fits for the probe (6.1) runs.  Usage: python analyze6.py <dir> <tag> [--zmin Z] [--json out.json]

Per scale Z and weight w:
  I      the probe I_w(Z^(1/2), Z^(1/2), Z)                               (probe.c)
  F      c_S f_w(Z), the manuscript's Mellin signal (2.3), (10.1)          (prep6.py)
  P      the principal row u = 1 with the residue at w = 1 only and the exact sum over sixth-power frequencies
  D      I - F   (the quantity bounded by the high comparison (2.5));     R = I - P
  CS     sum_sigma ||a_sigma|| ||B_sigma||  (Cauchy-Schwarz bound for |I|, direct form of the step in Proposition 6.3)
  RP     (sum_m |sum_sigma xi(m) a_{m,sigma} B_{m,sigma}|^2)^(1/2), the size of I if the rows had independent phases
Fits: least squares of log|q| on log Z; standard error from the residual scatter (the scales overlap, see RESULT.md).
"""
import sys, os, json, math, argparse
import numpy as np
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from show import load

def fit(lz, ly):
    lz = np.asarray(lz); ly = np.asarray(ly)
    n = len(lz)
    A = np.vstack([lz, np.ones(n)]).T
    co, res, rk, sv = np.linalg.lstsq(A, ly, rcond=None)
    r = ly - A @ co
    s2 = (r @ r) / max(n - 2, 1)
    cov = s2 * np.linalg.inv(A.T @ A)
    return co[0], math.sqrt(cov[0, 0]), co[1], math.sqrt(s2)

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('dir'); ap.add_argument('tag'); ap.add_argument('--zmin', type=float, default=0); ap.add_argument('--json', default=None)
    ap.add_argument('--weights', default=None)
    a = ap.parse_args()
    files = [f for f in os.listdir(a.dir) if f.startswith(f'out_{a.tag}_') and f.endswith('.txt')]
    Zs = sorted(int(f[len(f'out_{a.tag}_'):-4]) for f in files)
    Zs = [z for z in Zs if z >= a.zmin]
    rec = {}
    for Z in Zs:
        info, Na2, NA02, res = load(os.path.join(a.dir, f'out_{a.tag}_{Z}.txt'))
        side = json.load(open(os.path.join(a.dir, f'in_{a.tag}_{Z}.bin.side.json')))
        W = side['weights']; cS = side['cS']; Q = 12.0 * Z; Y = side['Y']
        for w, d in enumerate(res):
            F = cS * complex(*side['f'][w]); P = complex(*side['P'][w]); I = d['I']
            rec[(Z, W[w])] = dict(I=I, F=F, P=P, D=I - F, R=I - P, CS=float(sum(math.sqrt(Na2[s] * d['NB2'][s]) for s in range(4))),
                                  CS0=float(sum(math.sqrt(NA02[s] * d['NB2'][s]) for s in range(4))), RP=math.sqrt(d['RP2']), NB2=float(d['NB2'].sum()),
                                  Na2=float(Na2.sum()), A02=float(Q * NA02.sum()), QY=Q / Y, rows=info['rows'], M=side['mertens'][w], ns=side['ns'],
                                  XB=d['XB'])
    Wn = W if a.weights is None else a.weights.split(',')
    lz = np.log(np.array(Zs, float))
    print(f"scales: {len(Zs)}, Z = {Zs[0]} .. {Zs[-1]}; c_S = {cS:.6g}")
    print("\n== per scale: s-values, rows, ||A_0||^2/(Q/Y), sum|a|^2, ||B_one||^2/rows, RP_one")
    for Z in Zs:
        r = rec[(Z, 'one')]
        print(f"Z={Z:7d} ns={r['ns']:4d} rows={r['rows']:9d} A0^2/(Q/Y)={r['A02'] / r['QY']:.4f} Na2={r['Na2']:.4e} NB2/rows={r['NB2'] / r['rows']:.4f} NB2/Z={r['NB2'] / Z:.4f} RP={r['RP']:.5f} CS={r['CS']:.4f}")
    print("\n== I (re, im) | P | F = c_S f | per weight and scale")
    for w in Wn:
        print(f"-- {w}")
        for Z in Zs:
            r = rec[(Z, w)]
            print(f"Z={Z:7d} I={r['I'].real:+.5f}{r['I'].imag:+.5f}i P={r['P'].real:+.5f}{r['P'].imag:+.5f}i F={r['F'].real:+.5f}{r['F'].imag:+.5f}i |R|={abs(r['R']):.5f} |D|={abs(r['D']):.5f} RP={r['RP']:.5f} |R|/RP={abs(r['R']) / r['RP']:.2f} |I|/CS={abs(r['I']) / r['CS']:.5f} NB2/NB2_one={r['NB2'] / rec[(Z, 'one')]['NB2']:.5f}")
    out = {'Z': Zs, 'fits': {}, 'pooled': {}}
    print("\n== fitted exponents in Z (slope +- se; all scales | upper half of the scales)")
    half = len(Zs) // 2
    hdr = ['|I|', '|D|=|I-F|', '|R|=|I-P|', '|P|', '|F|', 'CS', 'RP', '||B||^2']
    print("weight  " + "  ".join(f"{h:>22s}" for h in hdr))
    for w in Wn:
        cols = []
        out['fits'][w] = {}
        for name, fn in (('I', lambda r: abs(r['I'])), ('D', lambda r: abs(r['D'])), ('R', lambda r: abs(r['R'])), ('P', lambda r: abs(r['P'])),
                         ('F', lambda r: abs(r['F'])), ('CS', lambda r: r['CS']), ('RP', lambda r: r['RP']), ('B2', lambda r: r['NB2'])):
            y = np.log(np.array([fn(rec[(Z, w)]) for Z in Zs]))
            s, se, c, sd = fit(lz, y)
            s2, se2, c2, sd2 = fit(lz[half:], y[half:])
            cols.append(f"{s:+.3f}({se:.3f})|{s2:+.3f}({se2:.3f})")
            out['fits'][w][name] = {'all': [s, se], 'upper': [s2, se2], 'resid_sd': sd}
        print(f"{w:6s}  " + "  ".join(f"{c:>22s}" for c in cols))
    print("\n== pooled regression of I on P over scales: r = sum Re(I conj P)/sum |P|^2; se from RP (independent-phase model); chi2 of r = 1 and of r = 0 with RP as sigma per component")
    for w in Wn:
        I = np.array([rec[(Z, w)]['I'] for Z in Zs]); P = np.array([rec[(Z, w)]['P'] for Z in Zs]); F = np.array([rec[(Z, w)]['F'] for Z in Zs])
        RP = np.array([rec[(Z, w)]['RP'] for Z in Zs])
        wt = 1.0 / RP ** 2
        r = (wt * (I * np.conj(P)).real).sum() / (wt * np.abs(P) ** 2).sum(); se = 1.0 / math.sqrt((wt * np.abs(P) ** 2).sum()) / math.sqrt(2.0)
        rF = (wt * (I * np.conj(F)).real).sum() / (wt * np.abs(F) ** 2).sum()
        chi1 = (np.abs(I - P) ** 2 * wt * 2).sum(); chi0 = (np.abs(I) ** 2 * wt * 2).sum(); dof = 2 * len(Zs)
        rms = math.sqrt(np.mean(np.abs(I - P) ** 2 / RP ** 2))
        print(f"{w:6s} r_P = {r:+.3f} +- {se:.3f}   r_F = {rF:+.3f}   chi2(I=P) = {chi1:.1f}  chi2(I=0) = {chi0:.1f}  (dof {dof})   rms |I-P|/RP = {rms:.2f}")
        out['pooled'][w] = {'r_P': r, 'se': se, 'r_F': rF, 'chi2_P': chi1, 'chi2_0': chi0, 'dof': dof, 'rms_R_over_RP': rms}
    print("\n== normalised remainders rho = (I - P)/RP: rms over scales, lag-1 correlation between adjacent scales, max; and |P|/RP at the top scale")
    for w in W:
        rho = np.array([(rec[(Z, w)]['I'] - rec[(Z, w)]['P']) / rec[(Z, w)]['RP'] for Z in Zs])
        c1 = (rho[1:] * np.conj(rho[:-1])).real.sum() / math.sqrt((np.abs(rho[1:]) ** 2).sum() * (np.abs(rho[:-1]) ** 2).sum())
        top = rec[(Zs[-1], w)]
        print(f"{w:6s} rms {math.sqrt(np.mean(np.abs(rho) ** 2)):.2f}  mean {rho.mean().real:+.2f}{rho.mean().imag:+.2f}i  lag1 {c1:+.2f}  max {np.abs(rho).max():.2f}   |P|/RP(top) {abs(top['P']) / top['RP']:.1f}  |F|/RP(top) {abs(top['F']) / top['RP']:.1f}")
        out.setdefault('remainder', {})[w] = {'rms': math.sqrt(np.mean(np.abs(rho) ** 2)), 'lag1': c1, 'max': float(np.abs(rho).max())}
    print("\n== row-norm ratio ||B_w||^2/||B_one||^2: value at the bottom and top scale, fitted exponent (all scales | upper half); |I|/CS at the top; exponent of |I|/CS")
    for w in W:
        y = np.log(np.array([rec[(Z, w)]['NB2'] / rec[(Z, 'one')]['NB2'] for Z in Zs]))
        s_, se_, _, _ = fit(lz, y); s2_, se2_, _, _ = fit(lz[half:], y[half:])
        yc = np.log(np.array([abs(rec[(Z, w)]['I']) / rec[(Z, w)]['CS'] for Z in Zs]))
        c_, ce_, _, _ = fit(lz[half:], yc[half:])
        print(f"{w:6s} {math.exp(y[0]):.5f} -> {math.exp(y[-1]):.5f}   {s_:+.5f}({se_:.5f}) | {s2_:+.5f}({se2_:.5f})   |I|/CS(top) = {math.exp(yc[-1]):.5f}   exponent(upper) {c_:+.3f}({ce_:.3f})")
        out.setdefault('rownorm', {})[w] = {'ratio_exp_all': [s_, se_], 'ratio_exp_upper': [s2_, se2_], 'I_over_CS_top': math.exp(yc[-1])}
    print("\n== upper scales: I/P and |R|/|P|")
    for w in Wn:
        s = []
        for Z in Zs[-6:]:
            r = rec[(Z, w)]
            q = r['I'] / r['P']
            s.append(f"{q.real:+.3f}{q.imag:+.3f}i")
        print(f"{w:6s} " + "  ".join(s))
    if a.json:
        out['records'] = {f"{Z}:{w}": {k: ([v.real, v.imag] if isinstance(v, complex) else v) for k, v in rec[(Z, w)].items()} for (Z, w) in rec}
        json.dump(out, open(a.json, 'w'), indent=1)

if __name__ == '__main__':
    main()
