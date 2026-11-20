"""Combination 2, controls, zero side, ball arithmetic (python-flint).
A_{mn} = sum_rho w_T(rho) n^{-rho} m^{-(1-rho)},  w_T(rho) = exp(-(z - T)^2 / (2 Delta^2)), z = (rho - 1/2)/i,  Q_T(M) = b^* A b for M(s) = sum b_n n^{-s}.
On-line zeros give w |M(rho)|^2; a pair {rho, 1 - conj(rho)} gives 2 Re(w M(rho) conj(M(1 - conj rho))).
N* = smallest N for which the leading N x N block has a negative eigenvalue: found by LDL^H without pivoting, pivots as balls
(all pivots of the first N-1 positive and pivot N negative  <=>  A_{N-1} > 0 and A_N has exactly one negative eigenvalue).
Zeros with |gamma - T| <= CUT * Delta are used (weights below exp(-CUT^2/2) dropped; the dropped part is positive semidefinite for on-line zeros).
Usage: c2_zero_side.py case T d delta_or_- DeltaOverD NMAX     case in PLANT, DH, TNR, EA"""
import sys, json, math, time, os
from flint import acb, arb, acb_mat, ctx
CUT = float(os.environ.get("S2_CUT", "14"))
case = sys.argv[1]; T = float(sys.argv[2]); d = float(sys.argv[3]); dl = sys.argv[4]; rat = float(sys.argv[5]); NMAX = int(sys.argv[6])
HERE = os.path.dirname(os.path.abspath(__file__))
ZF = os.environ.get('S2_ZEROS', os.path.join(HERE, '../../../../scripts/.zeros-cache/zeros6'))
DHF = os.environ.get('S2_DH', os.path.join(HERE, '../c12-control-battery-harness/tables/zeros_DH.json'))
ctx.threads = int(os.environ.get('RH_WORKERS', '1'))

def zeta_zeros(lo, hi):
    out = []
    with open(ZF) as f:
        for line in f:
            g = float(line)
            if g > hi: break
            if g >= lo: out.append(line.strip())
    return out

def build_zero_list():
    """returns list of (beta_minus_half as str, gamma as str, mirror_index) ; on-line zeros have beta - 1/2 = '0' and mirror = self"""
    global T, d
    Delta = d * rat; lo = T - CUT * Delta; hi = T + CUT * Delta
    zs = []
    if case == 'PLANT':
        for g in zeta_zeros(max(lo, 0), hi): zs.append(('0', g))
        zs.append((dl, repr(T + d))); zs.append(('-' + dl, repr(T + d)))
        doff = d
    elif case == 'DH':
        tab = json.load(open(DHF)); assert hi <= 2000, 'DH table reaches height 2000'
        doff = 1e9
        for sg in ('', '-'):                 # real coefficients: zeros at conjugate ordinates as well
            for g in tab['online']:
                if lo <= float(sg + g) <= hi: zs.append(('0', sg + g))
            for b, g, _ in tab['offline']:
                if lo <= float(sg + g) <= hi:
                    bm = arb(b) - arb(1) / 2
                    zs.append((bm.str(32, radius=False), sg + g)); zs.append(((-bm).str(32, radius=False), sg + g)); doff = min(doff, abs(float(sg + g) - T))
        d = doff
    elif case == 'TNR':
        for g in zeta_zeros(max(lo, 0), hi): zs.append(('0', g))
        bq = math.acosh(1.1) / math.log(3); k = 0; doff = 1e9
        while True:
            g = (2 * k + 1) * math.pi / math.log(3)
            if g > hi: break
            if g >= lo: zs.append((repr(bq), repr(g))); zs.append((repr(-bq), repr(g))); doff = min(doff, abs(g - T))
            k += 1
    elif case == 'EA':
        for g in zeta_zeros(max(lo, 0), hi): zs.append(('0.25', g)); zs.append(('-0.25', g))
        doff = min(abs(float(g) - T) for b, g in zs)
    return zs, Delta, doff

def run(prec, zs, Delta, N):
    ctx.prec = prec
    Z = len(zs)
    T_ = arb(repr(T)); D2 = 2 * arb(repr(Delta)) ** 2
    rho = []; w = []
    for b, g in zs:
        bm = arb(b); gm = arb(g)
        rho.append(acb(arb(1) / 2 + bm, gm))
        z = acb(gm - T_, -bm)                      # (rho - 1/2)/i - T = gamma - T - i (beta - 1/2)
        w.append((-(z * z) / D2).exp())
    logn = [arb(n).log() for n in range(1, N + 1)]
    # U[n][j] = n^{-rho_j};  mirror column: n^{-(1 - conj rho_j)} ;  A_{mn} = sum_j w_j U[n][j] conj(Umir[m][j])  with Umir[m][j] = m^{-(1 - conj(rho_j))}
    U = acb_mat(N, Z); Vc = acb_mat(Z, N)
    for i in range(N):
        for j in range(Z):
            U[i, j] = (-rho[j] * logn[i]).exp() * w[j]
            Vc[j, i] = (-(1 - rho[j].conjugate()) * logn[i]).exp().conjugate()
    At = U * Vc                                     # At[n][m] = A_{mn}
    # LDL^H on H = A (Hermitian): H[i][j] = A_{ij} = At[j][i]
    Lm = [[None] * N for _ in range(N)]; dv = []
    for i in range(N):
        for j in range(i):
            s = At[j, i]
            for k in range(j):
                s -= Lm[i][k] * Lm[j][k].conjugate() * dv[k]
            Lm[i][j] = s / dv[j]
        s = At[i, i].real
        for k in range(i):
            s -= (Lm[i][k].real ** 2 + Lm[i][k].imag ** 2) * dv[k]
        if s > 0: dv.append(s); continue
        if s < 0: return i + 1, s, dv, At
        return None, s, dv, At                      # sign not decided at this precision
    return 0, None, dv, At

zs, Delta, doff = build_zero_list()
on = [float(g) for b, g in zs if b == '0']
K_d = sum(1 for g in on if abs(g - T) < doff)
woff = math.exp(-doff ** 2 / (2 * Delta ** 2))
K_w = sum(1 for g in on if math.exp(-(g - T) ** 2 / (2 * Delta ** 2)) >= woff)
print('case %s T %g nearest off-line ordinate at distance %.3f, Delta %.3f, zeros used %d (on-line %d), on-line zeros nearer than the off-line one: %d' % (case, T, doff, Delta, len(zs), len(on), K_d), flush=True)
res = {'CUT': CUT, 'case': case, 'T': T, 'd': doff, 'Delta': Delta, 'zeros': len(zs), 'online': len(on), 'K_d': K_d, 'NMAX': NMAX, 'delta': dl}
t0 = time.time(); prec = 256; N = min(NMAX, max(16, int(1.3 * K_d) + 12))
while True:
    ns, piv, dv, At = run(prec, zs, Delta, N)
    if ns is None:
        prec *= 2; print('  pivot %d undecided at %d bits -> %d bits' % (len(dv) + 1, prec // 2, prec), flush=True)
        if prec > 32768: res['status'] = 'undecided at 32768 bits at pivot %d' % (len(dv) + 1); break
        continue
    if ns == 0:
        if N >= NMAX: res['status'] = 'positive definite up to N = %d' % N; res['Nstar'] = None; res['min_pivot'] = float(min(dv).mid()) if dv else None; break
        N = min(NMAX, 2 * N); continue
    res['Nstar'] = ns; res['pivot'] = piv.str(8); res['prev_pivot'] = dv[-1].str(8) if dv else None; res['status'] = 'negative pivot'
    res['tail_weight_bound'] = math.exp(-CUT ** 2 / 2); break
res['prec'] = prec; res['seconds'] = time.time() - t0
print(json.dumps(res), flush=True)
open(os.path.join(HERE, 'c2_zero_side.jsonl'), 'a').write(json.dumps(res) + '\n')
