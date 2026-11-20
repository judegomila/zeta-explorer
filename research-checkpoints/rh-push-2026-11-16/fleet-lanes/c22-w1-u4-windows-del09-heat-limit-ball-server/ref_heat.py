# Referee recomputation (mpmath, floating point, not balls) of HEAT cells, separate code and separate quadrature parameters:
# F(w) = (h/sqrt(4 pi tau)) sum_j H_0(t_j + i y0) exp(-(w - t_j - i y0)^2/(4 tau)),  y0 = -1.4, h = 0.03, global grid t_j = j h,
# nodes with abs(t_j - Re w) <= 34; no reflection, no mean-value form, no slabs. Contour integrals by mpmath quadrature on unit pieces.
# Usage: python ref_heat.py cells_heat.json out.json "1,4"
import sys, json, time
import mpmath as mp
mp.mp.dps = 34
D = json.load(open(sys.argv[1])); OUT = sys.argv[2]; KS = [int(x) for x in sys.argv[3].split(',')]
TAU = mp.mpf(D['tau']); CZ = mp.mpf(D['CZ']); CW = 2*CZ; IMW = 2*D['XZ']
Y0 = mp.mpf('-1.4'); HST = mp.mpf('0.03'); CUT = 34
NODE = {}
def H0(v):
    s = (1 + 1j*v)/2
    return s*(s-1)/16*mp.power(mp.pi, -s/2)*mp.gamma(s/2)*mp.zeta(s)
def node(j):
    if j not in NODE: NODE[j] = H0(j*HST + 1j*Y0)
    return NODE[j]
def FF(w):
    jc = int(mp.nint(mp.re(w)/HST)); J = int(CUT/HST)
    q = 1/(4*TAU); f = mp.mpc(0); f1 = mp.mpc(0)
    for j in range(jc - J, jc + J + 1):
        d = w - j*HST - 1j*Y0; e = node(j)*mp.exp(-d*d*q)
        f += e; f1 -= e*2*d*q
    return f, f1
def Lw(w):
    f, f1 = FF(w); return f1/f
RATES = {'P8': ([(mp.mpf('0.375'), mp.mpf('2500.921875'))], [mp.mpc(1)]),
         'P1': ([(mp.mpf('0.375'), mp.mpf('2500.921875')), (mp.mpf('0.625'), mp.mpf('2500.625'))], [mp.mpc(1), mp.mpc('-0.75', '0.5')])}
def hfun(row, z):
    V = 0; Vs = 0
    for (x, t), b in zip(*RATES[row]):
        zj = mp.mpc(x, -t); V += b/(z + zj); Vs += mp.conj(b)/(mp.conj(zj) - z)
    return V*Vs
def Lz(z): return -2j*Lw(-2j*z)
out = dict(dps=34, y0='-1.4', step='0.03', rows=[])
t0 = time.time()
Q = {}
for row in RATES:
    zs = [mp.mpc(x, -t) for x, t in RATES[row][0]]; bs = RATES[row][1]; tot = 0
    for i, zi in enumerate(zs):
        for j, zj in enumerate(zs): tot += bs[i]*mp.conj(bs[j])*(Lz(mp.conj(zj)) - Lz(-zi))/(zi + mp.conj(zj))
    Q[row] = tot
    out['Qgen_' + row] = mp.nstr(tot, 25); print('Q_gen', row, mp.nstr(tot, 25), 'lane', D['Qgen_' + row][0], flush=True)
# every zero of the lane's list: abs(F/F') at the listed point
worst = 0
for zr in D['zeros']:
    w = mp.mpc(zr['re_w'], zr['im_w']); f, f1 = FF(w); worst = max(worst, abs(f/f1))
out['zeros_checked'] = len(D['zeros']); out['max_abs_F_over_Fprime_at_listed_zeros'] = float(worst)
print('zeros checked', len(D['zeros']), 'max abs(F/F\') =', float(worst), '%.0fs' % (time.time() - t0), flush=True)
for Y in KS:
    k = [r for r in D['table'] if r['Y'] == Y][0]
    xl = CW - 2*Y; xr = CW + 2*Y
    segs = [(mp.mpc(xl + j, -IMW), mp.mpc(xl + j + 1, -IMW)) for j in range(4*Y)] + [(mp.mpc(xr, -IMW + j), mp.mpc(xr, -IMW + j + 1)) for j in range(2*IMW)] \
         + [(mp.mpc(xr - j, IMW), mp.mpc(xr - j - 1, IMW)) for j in range(4*Y)] + [(mp.mpc(xl, IMW - j), mp.mpc(xl, IMW - j - 1)) for j in range(2*IMW)]
    I0 = 0; I8 = 0; I1 = 0; nev = [0]
    for a, b in segs:
        memo = {}
        def L(s, a=a, b=b):
            if s not in memo: nev[0] += 1; memo[s] = Lw(a + (b - a)*s)
            return memo[s]
        d = b - a
        I0 += d*mp.quad(lambda s: L(s), [0, 0.5, 1]); I8 += d*mp.quad(lambda s: L(s)*hfun('P8', 1j*(a + d*s)/2), [0, 0.5, 1]); I1 += d*mp.quad(lambda s: L(s)*hfun('P1', 1j*(a + d*s)/2), [0, 0.5, 1])
    N = I0/(2j*mp.pi); C8 = I8/(2j*mp.pi); C1 = I1/(2j*mp.pi)
    # W_R from the lane's zero list (both partners of each off-line representative)
    W = {'P8': 0, 'P1': 0}; cnt = 0
    for zr in D['zeros']:
        w = mp.mpc(zr['re_w'], zr['im_w'])
        if not (xl < mp.re(w) < xr): continue
        reps = [w] if zr['on_line_box'] else [w, mp.conj(w)]
        for ww in reps:
            cnt += 1
            for row in W: W[row] += hfun(row, 1j*ww/2)
    r = dict(Y=Y, count_ref=mp.nstr(N, 15), zeros_in_R_from_list=cnt, evaluations=nev[0], seconds=time.time() - t0)
    for row, C in (('P8', C8), ('P1', C1)):
        r[row] = dict(C_R_ref=mp.nstr(C, 20), C_R_lane=k[row]['C_R'], W_R_ref=mp.nstr(W[row], 20), cell_ref=float(abs(Q[row] - W[row] + C)))
    print(json.dumps(r), flush=True); out['rows'].append(r)
    json.dump(out, open(OUT, 'w'), indent=1)
print('DONE %.0fs' % (time.time() - t0))
