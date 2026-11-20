#!/usr/bin/env python3
"""Arb (ball) parts.
 eta   : beta = 1, phases +, y(delta,t) = log|N_1(delta+it)| for delta = 2^-j, j = 2..60, at the 100 heights of
         common.heights(1,'plus').  N_1 = E(z) * prod_{k<=KC} (1 - e^{-lambda_k z})/(1 - e^{-k z}),
         E(z) = prod_{k>=1}(1 - e^{-kz}) from the Dedekind eta function (acb.modular_eta), lambda_k = log(prime
         nearest e^k).  ASSUMPTION for k > KC: |lambda_k - k| <= e^{-k/3} (added to the radius).
 cyc   : control CYC, prod_{k>=0} (1 + w^{2^k}), w = e^{-lambda_0 z}, lambda_0 = log 3, direct product.
 thin  : controls DEL (alpha = 0) and THIN (alpha = -1) on S_1: relative products at s = 1/2 + delta + it.
 cross : direct ball products for the float64 census (same definition of the frequencies), selected cells.
"""
import os, sys, json, math, time, argparse
from multiprocessing import Pool
from flint import arb, acb, fmpz, ctx
import common as C

def logabs(z): return abs(z).log()

def lam_table_b1(KC, prec):
    old = ctx.prec; ctx.prec = int(KC / math.log(2)) + 300
    qs = [C.nearest_prime(arb(k).exp()) for k in range(1, KC + 1)]
    ctx.prec = old
    assert len(set(qs)) == len(qs)
    return qs

G = {}
def eta_point(hi):
    ctx.prec = G['prec']
    t = G['t'][hi]; lam = G['lam']; KC = len(lam); out = []
    twopi = 2 * arb.pi()
    for j in range(G['jmin'], G['jmax'] + 1):
        d = arb(2) ** (-j)
        z = acb(d, t)
        tau = acb(-t / twopi, d / twopi)
        # E(z) = eta(tau) * exp(-pi i tau/12)
        le = logabs(tau.modular_eta()) + arb.pi() * d / twopi / 12
        corr = arb(0)
        for k in range(1, KC + 1):
            corr += logabs(1 - (-lam[k - 1] * z).exp()) - logabs(1 - (-k * z).exp())
        tail = abs(z) * 2 ** j * math.exp(-KC / 3) * 4      # assumption-based bound for k > KC
        y = le + corr
        out.append((float(y.mid()), float(y.rad()) + float(arb(tail).upper()), float(le.mid()), float(corr.mid())))
    return hi, out

def run_eta(a):
    ctx.prec = a.prec
    small, k0 = C.small_set(1.0)
    qs = lam_table_b1(a.kc, a.prec)
    assert qs[:len(small)] == small or sorted(qs[:k0 - 1]) == small, (qs[:10], small[:10])
    desc = C.heights(1.0, 'plus', 1, small)
    G.update(prec=a.prec, jmin=2, jmax=a.jmax, lam=[arb(q).log() for q in qs],
             t=[C.height_arb(d, 1.0, 'plus', 1, small) for d in desc])
    with Pool(a.workers) as p: res = dict(p.map(eta_point, range(len(desc))))
    json.dump(dict(part='eta', kc=a.kc, prec=a.prec, js=list(range(2, a.jmax + 1)), heights=[list(d) for d in desc],
                   t=[float(x.mid()) for x in G['t']], qs_first=[int(q) for q in qs[:40]],
                   eps_first=[float((arb(qs[k-1]).log() - k).mid()) for k in range(1, 41)],
                   rows=[res[i] for i in range(len(desc))]), open(a.out, 'w'))

def run_cyc(a):
    ctx.prec = a.prec
    l0 = arb(3).log(); twopi = 2 * arb.pi(); rows = []
    hs = [('pole1mw', n) for n in (1, 2, 3)] + [('zero_k', k, n) for k in (0, 1, 2, 5, 9) for n in (0, 1, 3)] + [('gen', 1.2345), ('gen', 7.77), ('gen', 3.3)]
    for h in hs:
        if h[0] == 'pole1mw': t = twopi * h[1] / l0                      # w = 1
        elif h[0] == 'zero_k': t = arb.pi() * (2 * h[2] + 1) / (l0 * 2 ** h[1])   # w^(2^k) = -1
        else: t = arb(h[1])
        ys = []
        for j in range(2, 61):
            z = acb(arb(2) ** (-j), t); y = arb(0)
            for k in range(0, 75):
                y += logabs(1 + (-(l0 * 2 ** k) * z).exp())
            ys.append((float(y.mid()), float(y.rad())))
        rows.append(dict(h=list(h), y=ys))
    json.dump(dict(part='cyc', rows=rows, js=list(range(2, 61))), open(a.out, 'w'))

def run_thin(a):
    ctx.prec = a.prec
    small, k0 = C.small_set(1.0)
    qs = lam_table_b1(120, a.prec); lam = [arb(q).log() for q in qs]
    desc = C.heights(1.0, 'plus', 1, small)
    sel = [0, 7, 25, 28, 40, 50, 60, 70]
    rows = []
    for hi in sel:
        t = C.height_arb(desc[hi], 1.0, 'plus', 1, small)
        yd = []; yt = []
        for j in range(2, 61):
            s = acb(arb(0.5) + arb(2) ** (-j), t)
            D = arb(0); Tn = arb(0)
            for l in lam:
                w = (-l * s).exp()
                D += -logabs(1 - w)                      # alpha = 0:  R = prod 1/(1 - q^-s)
                Tn += logabs(1 + w) - logabs(1 - w)      # alpha = -1
            yd.append(float(D.mid())); yt.append(float(Tn.mid()))
        rows.append(dict(h=list(desc[hi]), DEL=yd, THIN=yt))
    json.dump(dict(part='thin', rows=rows, js=list(range(2, 61)), note='120 primes; tail below sum_{k>120} 2 e^{-k/2}'), open(a.out, 'w'))

def cross_cell(args):
    beta, mode, seed, hi, j, prec = args
    ctx.prec = prec
    small, k0 = C.small_set(beta); ctx.prec = prec
    desc = C.heights(beta, mode, seed, small)
    t = C.height_arb(desc[hi], beta, mode, seed, small)
    # the float64 run uses the float midpoint of t; use the same number here
    t = arb(float(t.mid()))
    z = acb(arb(2) ** (-j), t); twopi = 2 * arb.pi()
    K = int(math.ceil((40.0 * 2.0 ** j) ** (1 / beta))) + 1
    y = arb(0)
    for i, q in enumerate(small):
        th = twopi * arb(C.u_hash(i, seed)) if mode == 'rand' else arb(0)
        y += logabs(1 - (acb(0, th) - arb(q).log() * z).exp())
    for k in range(k0, K):
        th = twopi * arb(C.u_hash(k + (1 << 40), seed)) if mode == 'rand' else arb(0)
        y += logabs(1 - (acb(0, th) - C.beta_pow(k, beta) * z).exp())
    return dict(beta=beta, mode=mode, hi=hi, j=j, K=K, y=float(y.mid()), rad=float(y.rad()))

def run_cross(a):
    cells = []
    for beta, jx in ((1.0, 14), (0.75, 9), (0.5, 5)):
        for mode in ('plus', 'rand'):
            for hi in (0, 13, 26, 37, 55, 80):
                for j in (4, jx): cells.append((beta, mode, 1, hi, j, 128))
    with Pool(a.workers) as p: res = p.map(cross_cell, cells)
    json.dump(dict(part='cross', cells=res), open(a.out, 'w'))


def run_btype(a):
    """beta = 1, phases +: heights t = 2 pi x, x a quadratic irrational (bounded partial quotients).
    Theorem E (b) predicts y - (1/4) log(1/delta) bounded."""
    ctx.prec = a.prec
    qs = lam_table_b1(a.kc, a.prec); lam = [arb(q).log() for q in qs]
    twopi = 2 * arb.pi()
    xs = [('golden', (arb(5).sqrt() - 1) / 2), ('sqrt2-1', arb(2).sqrt() - 1), ('sqrt3-1', arb(3).sqrt() - 1),
          ('1+golden', (arb(5).sqrt() + 1) / 2), ('sqrt7-2', arb(7).sqrt() - 2), ('(sqrt13-1)/2', (arb(13).sqrt() - 1) / 2)]
    rows = []
    for name, x in xs:
        t = twopi * x; ys = []
        for j in range(2, a.jmax + 1):
            d = arb(2) ** (-j); z = acb(d, t); tau = acb(-t / twopi, d / twopi)
            le = logabs(tau.modular_eta()) + arb.pi() * d / twopi / 12
            corr = arb(0)
            for k in range(1, a.kc + 1):
                corr += logabs(1 - (-lam[k - 1] * z).exp()) - logabs(1 - (-k * z).exp())
            y = le + corr
            ys.append((float(y.mid()), float(le.mid()), float(corr.mid()), float(y.rad())))
        rows.append(dict(name=name, t=float(t.mid()), y=ys))
    json.dump(dict(part='btype', js=list(range(2, a.jmax + 1)), rows=rows), open(a.out, 'w'))

if __name__ == '__main__':
    ap = argparse.ArgumentParser()
    ap.add_argument('part'); ap.add_argument('--out', required=True)
    ap.add_argument('--prec', type=int, default=512); ap.add_argument('--kc', type=int, default=400)
    ap.add_argument('--jmax', type=int, default=60)
    ap.add_argument('--workers', type=int, default=int(os.environ.get('RH_WORKERS', '1')))
    a = ap.parse_args(); t0 = time.time()
    dict(eta=run_eta, cyc=run_cyc, thin=run_thin, cross=run_cross, btype=run_btype)[a.part](a)
    print(a.part, 'done', time.time() - t0, flush=True)
