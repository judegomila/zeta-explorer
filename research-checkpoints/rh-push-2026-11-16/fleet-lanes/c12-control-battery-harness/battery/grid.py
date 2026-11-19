"""Grid value tables. Usage: python grid.py <tables> <closed|stage|product|beu> [tmax] [tstep]
Grid: Re s in core.SIGMAS (13 abscissae), Im s = 0, tstep, ..., tmax.
closed : 30-digit values (python-flint, 128-bit balls) as double-double pairs + absolute radius; values_<code>.npz
stage  : THIN-0.9, DEL-0.75, DEL-0.9 = zeta(s) * finite product over the set to 1e7 (128-bit balls); values_<code>.npz
product: U-00..23 and SGN-00..23, Re s > 1 only, Euler product over p <= 1e7 in float64 (series in p^-s for p > 1000); values_U.npz, values_SGN.npz
beu    : H_X(s) = prod_{p <= 1e7} (1 - p^-s)/(1 - (p + 1/2)^-s) in float64; zeta_B = ZETA table * H_X; values_BEU.npz
Every large allocation is announced. Workers: RH_WORKERS (default 4).
"""
import os, sys
os.environ['OMP_NUM_THREADS'] = '1'; os.environ['OPENBLAS_NUM_THREADS'] = '1'; os.environ['MKL_NUM_THREADS'] = '1'
import math, time, json
import numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from flint import acb, arb, ctx
import core, coeffs as C, sets
import multiprocessing as _mp
Pool = _mp.get_context("fork").Pool

PREC = 128
STAGE_PREC = 320   # stage products: complex ball multiplication inflates the radius by up to exp(sum p^-sigma) over the set (1e42 at sigma = 1/2 for DEL-0.9); 128 bits left O(1) relative radii there
W = int(os.environ.get('RH_WORKERS', '4'))
SIG = core.SIGMAS


def fname(code): return code.replace('/', '_')


def tgrid(tmax, tstep): return [k * tstep for k in range(int(round(tmax / tstep)) + 1)]


# ---------------- closed ----------------
_obj = None; _conj = False
def _init_closed(code, conj):
    global _obj, _conj
    _obj = core.by_code(code); _conj = conj; ctx.prec = PREC


def _row_closed(t):
    out = np.full((5, len(SIG)), np.nan)
    for j, sg in enumerate(SIG):
        s = acb(sg, t)
        try:
            v = _obj.conj_value(s) if _conj else _obj.value(s)
        except Exception:
            continue
        if not (v.real.is_finite() and v.imag.is_finite()): continue
        out[0, j], out[1, j] = core.dd_split(v.real); out[2, j], out[3, j] = core.dd_split(v.imag)
        out[4, j] = float(abs(acb(v.real.rad(), v.imag.rad())).upper())
    return out


def save_dd(path, rows, ts, meta):
    A = np.stack(rows, axis=2)      # (5, nsig, nt)
    np.savez_compressed(path, sigmas=np.array(SIG), t=np.array(ts), re_hi=A[0], re_lo=A[1], im_hi=A[2], im_lo=A[3], rad=A[4], meta=json.dumps(meta))


def build_closed(tables, ts):
    for o in core.make_objects():
        for conj in ([False, True] if not o.real_coeffs else [False]):
            t0 = time.time()
            with Pool(W, initializer=_init_closed, initargs=(o.code, conj)) as p:
                rows = p.map(_row_closed, ts, chunksize=16)
            code = o.code + ('-CONJ' if conj else '')
            meta = dict(code=code, kind='closed', prec_bits=PREC, real_coeffs=o.real_coeffs, poles=o.poles(), fe=o.fe, local=o.local,
                        negative_t='F(conj s) = conj F(s)' if o.real_coeffs else 'F(conj s) = conj(value of table %s-CONJ at s)' % o.code,
                        note='nan = pole on the grid')
            save_dd(os.path.join(tables, 'values_%s.npz' % fname(code)), rows, ts, meta)
            print('closed %s: %d rows, %.1f s' % (code, len(ts), time.time() - t0), flush=True)


# ---------------- stage ----------------
_logp = None; _psig = None; _mode = None
def _init_stage(S, mode):
    global _logp, _psig, _mode
    ctx.prec = STAGE_PREC; _mode = mode
    _logp = [arb(int(p)).log() for p in S]
    _psig = [[(-arb(sg) * lp).exp() for sg in SIG] for lp in _logp]


def _row_stage(t):
    ns = len(SIG)
    num = [acb(1)] * ns; den = [acb(1)] * ns
    mit = acb(0, -t)
    thin = _mode == 'thin'
    for lp, ps in zip(_logp, _psig):
        z = (mit * lp).exp()
        if thin:
            for j in range(ns):
                u = ps[j] * z
                num[j] = num[j] * (1 - u); den[j] = den[j] * (1 + u)
        else:
            for j in range(ns):
                num[j] = num[j] * (1 - ps[j] * z)
    out = np.full((5, ns), np.nan)
    for j, sg in enumerate(SIG):
        s = acb(sg, t)
        if sg == 1.0 and t == 0: continue
        v = s.zeta() * (num[j] / den[j] if thin else num[j])
        out[0, j], out[1, j] = core.dd_split(v.real); out[2, j], out[3, j] = core.dd_split(v.imag)
        out[4, j] = float(abs(acb(v.real.rad(), v.imag.rad())).upper())
    return out


def stage_tail(b, m, c, sizeS, X=10 ** 7):
    """radius of log F - log F_stage for sigma > b: c * (1 + 1e-3) * [ -D(X) X^-sigma + m E_1((sigma - b) log X) ]  (uses D <= 0; c10 Lemma 0)"""
    ctx.prec = PREC
    DX = arb(sizeS) - sets.Lball(X, b, m)
    out = []
    for sg in SIG:
        if sg <= float(b): out.append(float('nan')); continue
        v = (-DX) * arb(X) ** (-arb(sg)) + arb(m) * ((arb(sg) - arb(b)) * arb(X).log()).expint(1)
        out.append(float((c * arb('1.001') * v).upper()))
    return out


def build_stage(tables, ts):
    spf = C.spf_sieve(core.N_COEF); primes = C.primes_of(spf)
    for code, mode, b, m, c in (('DEL-0.75', 'del', '0.75', '1', 1), ('THIN-0.9', 'thin', '0.9', '0.5', 2), ('DEL-0.9', 'del', '0.9', '1', 1)):
        t0 = time.time()
        only = os.environ.get('C12_STAGE_ONLY')
        outp = os.path.join(tables, 'values_%s.npz' % fname(code)); mark = outp + '.inprogress'
        if (only and code not in only.split(',')) or ((os.path.exists(outp) or os.path.exists(mark)) and not os.environ.get('C12_STAGE_FORCE')):
            print('stage %s: skipped (not selected, present, or in progress in another unit)' % code, flush=True); continue
        open(mark, 'w').write(str(os.getpid()))
        fS = os.path.join(tables, 'set_%s.npy' % code)
        S = np.load(fS) if os.path.exists(fS) else sets.build(primes, b, m)[0]
        C.announce('%s: %d primes x %d abscissae of 128-bit balls per worker (x %d workers)' % (code, len(S), len(SIG), W), len(S) * len(SIG) * 120 * W)
        with Pool(W, initializer=_init_stage, initargs=(S, mode)) as p:
            rows = p.map(_row_stage, ts, chunksize=4)
        meta = dict(code=code, kind='stage', prec_bits=STAGE_PREC, real_coeffs=True, b=b, density=m, sizeS=int(len(S)), X=core.N_COEF, poles=[(1.0, 0.0)], fe=None,
                    local='alpha_p = %s for p in S, 1 otherwise' % ('0' if mode == 'del' else '-1'),
                    tail_log_radius=stage_tail(b, m, c, len(S)),
                    note='table = zeta(s) * product over the primes of S below 1e7 (the 1e7 stage). For sigma > b the object differs from the stage by exp of a quantity '
                         'bounded by tail_log_radius[sigma]; for sigma <= b the object is not determined by the table (c10 verdict item 3). The stage has no zero at b.')
        save_dd(outp, rows, ts, meta); os.remove(mark)
        print('stage %s: |S| = %d, %d rows, %.1f s' % (code, len(S), len(ts), time.time() - t0), flush=True)


# ---------------- product (U, SGN) ----------------
PSMALL = 1000
SIGP = [s for s in SIG if s > 1.0]
_g = {}
def _row_product(t):
    g = _g
    z = np.exp(-1j * t * g['lp'])
    nb = g['nbig']; ns = len(SIGP)
    w = g['psig'] * z[:, None]                    # (npr, ns)
    wb = w[g['nsmall']:]; wsm = w[:g['nsmall']]
    outU = np.zeros((2, 24, ns), dtype=np.complex128); outS = np.zeros((24, ns), dtype=np.complex128)
    # small primes: exact logs
    for sign, zz in ((0, wsm), (1, np.conj(wsm))):
        outU[sign] = -np.log1p(-g['chi_small'][:, :, None] * zz[None, :, :]).sum(axis=1)
    outS[:] = -np.log1p(-g['eps_small'][:, :, None] * wsm[None, :, :]).sum(axis=1)
    wk = wb.copy()
    for k in range(1, 5):
        if k > 1: wk = wk * wb
        both = np.concatenate([wk, np.conj(wk)], axis=1)                 # (nbig, 2 ns)
        r = g['chik'][k - 1] @ both / k                                   # (24, 2 ns)
        outU[0] += r[:, :ns]; outU[1] += r[:, ns:]
        if k % 2 == 1:
            outS += (g['eps_big'] @ wk.real + 1j * (g['eps_big'] @ wk.imag)) / k
        else:
            outS += wk.sum(axis=0)[None, :] / k
    return np.exp(outU), np.exp(outS)


def build_product(tables, ts):
    spf = C.spf_sieve(core.N_COEF); primes = C.primes_of(spf); del spf
    npr = len(primes); nsmall = int(np.searchsorted(primes, PSMALL)); nbig = npr - nsmall
    C.announce('chi^k matrices complex128[4 x 24 x %d]' % nbig, 4 * 24 * nbig * 16)
    C.announce('per worker: p^-sigma float64[%d x 8] and complex work arrays [%d x 16] x 3' % (npr, nbig), npr * 8 * 8 + nbig * 16 * 16 * 3)
    lp = np.log(primes.astype(np.float64))
    U = np.stack([C.u_params(j, npr) for j in range(24)]); E = np.stack([C.sgn_params(j, npr) for j in range(24)]).astype(np.float64)
    chi = np.exp(2j * np.pi * U)
    _g.update(lp=lp, nsmall=nsmall, nbig=nbig, psig=np.exp(-np.outer(lp, np.array(SIGP))),
              chi_small=chi[:, :nsmall].copy(), eps_small=E[:, :nsmall].copy(), eps_big=np.ascontiguousarray(E[:, nsmall:]),
              chik=[np.ascontiguousarray(chi[:, nsmall:] ** k) for k in range(1, 5)])
    t0 = time.time()
    with Pool(W) as p:          # fork: workers share the matrices
        res = p.map(_row_product, ts, chunksize=8)
    Upos = np.stack([r[0][0] for r in res], axis=2); Uneg = np.stack([r[0][1] for r in res], axis=2); Sg = np.stack([r[1] for r in res], axis=2)
    X = core.N_COEF
    tail = [1.25506 * 1.000001 * s / (s - 1) * X ** (1 - s) / math.log(X) for s in SIGP]
    note = ('value = finite Euler product over p <= 1e7; the object equals value * exp(e), |e| <= tail_log_radius[sigma] '
            '(pi(x) <= 1.25506 x/log x, Rosser-Schoenfeld, RECALLED). float64 summation error about 1e-12. No continuation to Re s <= 1 exists on file.')
    np.savez_compressed(os.path.join(tables, 'values_U.npz'), sigmas=np.array(SIGP), t=np.array(ts), pos=Upos, neg=Uneg, tail_log_radius=np.array(tail),
                        meta=json.dumps(dict(code='U-00..U-23', kind='product', seeds=[120000 + j for j in range(24)], real_coeffs=False,
                                             negative_t='neg[j, sigma, t] = F_j(sigma - i t)', note=note)))
    np.savez_compressed(os.path.join(tables, 'values_SGN.npz'), sigmas=np.array(SIGP), t=np.array(ts), pos=Sg, tail_log_radius=np.array(tail),
                        meta=json.dumps(dict(code='SGN-00..SGN-23', kind='product', seeds=[121000 + j for j in range(24)], real_coeffs=True,
                                             negative_t='F(conj s) = conj F(s)', note=note)))
    print('product U, SGN: %d rows, %.1f s' % (len(ts), time.time() - t0), flush=True)


# ---------------- BEU ----------------
def _row_beu(t):
    g = _g
    z1 = np.exp(-1j * t * g['lp']); z2 = np.exp(-1j * t * g['lq'])
    out = np.zeros(len(SIG), dtype=np.complex128)
    for j in range(len(SIG)):
        out[j] = np.sum(np.log1p(-g['psig'][:, j] * z1) - np.log1p(-g['qsig'][:, j] * z2))
    return np.exp(out)


def build_beu(tables, ts):
    spf = C.spf_sieve(core.N_COEF); primes = C.primes_of(spf); del spf
    lp = np.log(primes.astype(np.float64)); lq = np.log(primes.astype(np.float64) + 0.5)
    C.announce('BEU p^-sigma, q^-sigma float64[2 x %d x 13]' % len(primes), 2 * len(primes) * 13 * 8)
    _g.update(lp=lp, lq=lq, psig=np.exp(-np.outer(lp, np.array(SIG))), qsig=np.exp(-np.outer(lq, np.array(SIG))))
    t0 = time.time()
    with Pool(W) as p:
        res = p.map(_row_beu, ts, chunksize=8)
    Hx = np.stack(res, axis=1)
    X = core.N_COEF
    # |log H - log H_X| <= (|s|/2) * sum_{p > X} p^(-sigma-1)/(1 - p^-sigma) <= (|s|/2) (1 + 3.2e-4) 1.25506 (sigma+1)/sigma X^-sigma / log X
    T, S_ = np.meshgrid(np.array(ts), np.array(SIG))
    tail = np.abs(S_ + 1j * T) / 2 * 1.00032 * 1.25506 * (S_ + 1) / S_ * X ** (-S_) / math.log(X)
    np.savez_compressed(os.path.join(tables, 'values_BEU.npz'), sigmas=np.array(SIG), t=np.array(ts), H=Hx, tail_log_radius=tail,
                        meta=json.dumps(dict(code='BEU', kind='stage', real_coeffs=True, shift=0.5,
                                             note='zeta_B(s) = zeta(s) H(s); table H = H_X (product over p <= 1e7, float64); multiply by the ZETA table. '
                                                  '|log H - log H_X| <= tail_log_radius[sigma, t]. H is analytic and zero-free on Re s > 0, so the zeros of zeta_B there are those of zeta.')))
    print('BEU: %d rows, %.1f s' % (len(ts), time.time() - t0), flush=True)


if __name__ == '__main__':
    tables, which = sys.argv[1], sys.argv[2]
    tmax = float(sys.argv[3]) if len(sys.argv) > 3 else core.T_MAX
    tstep = float(sys.argv[4]) if len(sys.argv) > 4 else core.T_STEP
    os.makedirs(tables, exist_ok=True)
    ts = tgrid(tmax, tstep)
    print('grid: %d abscissae x %d ordinates, workers %d' % (len(SIG), len(ts), W), flush=True)
    {'closed': build_closed, 'stage': build_stage, 'product': build_product, 'beu': build_beu}[which](tables, ts)
