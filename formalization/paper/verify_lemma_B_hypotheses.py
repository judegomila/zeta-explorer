#!/usr/bin/env python3
"""Fail-closed checks that the computed artifacts match the hypotheses of formalization/paper/lemma-B-two-band.md.

This script checks the NUMERICAL hypotheses only (walls, window, far-field certificate, band outputs, time horizon).
It does not check the analytic arguments (those are in the .md), the band-barrier hypotheses (BB1)/(BB2) themselves,
FLINT's Platt/Turing error lemmas, or Raymond's AF section 3 wall transfer. Exit code 0 iff every check passes.

usage: python3 verify_lemma_B_hypotheses.py [--flint]
  --flint   recompute the two window-boundary zeros gamma_{n_first}, gamma_{n_last} with FLINT
            (acb_dirichlet_zeta_zeros, needs cc + FLINT at /opt/homebrew; about 20 CPU s). Without it the
            intervals recorded on 2026-10-01 are used.
"""
from __future__ import annotations

import json
import subprocess
import sys
import tempfile
from decimal import Decimal, getcontext
from fractions import Fraction as F
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
TMP = REPO / 'tmp'
FAIL: list[str] = []


def check(cond: bool, what: str) -> None:
    print(('PASS ' if cond else 'FAIL ') + what)
    if not cond:
        FAIL.append(what)


def rat(s) -> F:
    return F(str(s))


T_MAX = F(41, 250)          # wall horizon
QE = F(1, 10**8)            # terminal comparison level q_e
T_PT = F(3000175332800)     # PT Theorem 1 ordinate
D_W = 7252                  # far-field distance in H2

WALLS = {
    'X1 (PT-height head wall)': (F(6000000185827),
                                 [TMP / 's145-1-g1/out/WALLQ_X1.json', TMP / 's145-1-g1/out/WALL_X1_B.json']),
    'x_f(1.7X) (head wall)': (F('10200000023546.2402'),
                              [TMP / 'b145-B-out/walls/WALLQ_10200000023546.2402_A.json',
                               TMP / 'b145-B-out/walls/WALLQ_10200000023546.2402_B.json']),
    'x_L (window left wall)': (F('15600000002223.2344'),
                               [TMP / 'b145-B-out/walls/WALLQ_15600000002223.2344_A.json',
                                TMP / 'b145-B-out/walls/WALLQ_15600000002223.2344_B.json']),
    'x_R (window right wall)': (F('15600000009475.44'),
                                [TMP / 's145-1-g1/out/WALLQ_15600000009475.44_A.json',
                                 TMP / 's145-1-g1/out/WALLQ_15600000009475.44_B.json']),
}
XL = WALLS['x_L (window left wall)'][0]
XR = WALLS['x_R (window right wall)'][0]
XF17 = WALLS['x_f(1.7X) (head wall)'][0]
X1 = WALLS['X1 (PT-height head wall)'][0]

# FLINT 3.6.0 acb_dirichlet_zeta_zeros at prec 128, recorded 2026-10-01 (midpoint, radius)
GAMMA_REC = {
    33328427938874: (Decimal('7800000000999.9154155721322061502373079'), Decimal('4.51e-26')),
    33328427960538: (Decimal('7800000005887.9204439594352324475199348'), Decimal('5.70e-26')),
}

C_SRC = r'''
#include <stdio.h>
#include <flint/flint.h>
#include <flint/fmpz.h>
#include <flint/arb.h>
#include <flint/acb.h>
#include <flint/acb_dirichlet.h>
int main(int argc,char**argv){ fmpz_t n; fmpz_init(n); acb_t z; acb_init(z); arf_t u;
  for(int i=1;i<argc;i++){ fmpz_set_str(n,argv[i],10); acb_dirichlet_zeta_zeros(z,n,1,128);
    printf("%s ",argv[i]); arb_printn(acb_imagref(z),45,ARB_STR_NO_RADIUS); printf(" ");
    mag_fprint(stdout, arb_radref(acb_imagref(z))); printf("\n"); }
  return 0; }
'''


def flint_gammas(indices):
    d = Path(tempfile.mkdtemp(prefix='lemmaB_'))
    (d / 'z.c').write_text(C_SRC)
    subprocess.run(['cc', '-O2', '-o', str(d / 'z'), str(d / 'z.c'), '-I/opt/homebrew/include', '-L/opt/homebrew/lib',
                    '-lflint', '-lgmp', '-lmpfr', '-lm'], check=True)
    out = subprocess.run([str(d / 'z')] + [str(i) for i in indices], check=True, capture_output=True, text=True).stdout
    res = {}
    for line in out.strip().splitlines():
        idx, mid, rad = line.split()[:3]
        # mag_fprint prints e.g. (12345 * 2^-80); fall back to a generous radius bound if unparsable
        try:
            a, b = rad.strip('()').split('*')
            rad_d = Decimal(int(a)) * (Decimal(2) ** int(b.split('^')[1]))
        except Exception:
            rad_d = Decimal('1e-6')
        res[int(idx)] = (Decimal(mid), rad_d)
    return res


def q_mty_upper(x: F) -> Decimal:
    getcontext().prec = 60
    lg = (Decimal(x.numerator) / Decimal(x.denominator) / 2).ln()
    q = (1 - 2 / (Decimal('5.558691') * lg)) ** 2
    return q + Decimal('1e-40')   # pad for the 60-digit evaluation


def main() -> int:
    # ---- (W) walls -------------------------------------------------------------------------------------------
    for name, (x, files) in WALLS.items():
        lanes = []
        for f in files:
            d = json.load(open(f))
            lanes.append(d.get('lane'))
            check(d.get('PASS') is True and rat(d['x']) == x, f'(W) {name}: lane {d.get("lane")} PASS at x = {x}')
            check([str(v) for v in d['t_range']] == ['0', '41/250'] and [str(v) for v in d['y_range']] == ['0', '1'],
                  f'(W) {name}: lane {d.get("lane")} covers 0 <= t <= 41/250, 0 <= y <= 1')
            check(rat(d['physical_floor']) > 0, f'(W) {name}: lane {d.get("lane")} certified floor |H_t/B_t| > {d["physical_floor"]} > 0')
            pfe = d.get('physical_floor_expression')
            if isinstance(pfe, dict) and 'lo' in pfe:
                check(rat(pfe['lo']) > rat(d['physical_floor']),
                      f'(W) {name}: lane {d.get("lane")} floor expression lower end {float(rat(pfe["lo"])):.6f} > {d["physical_floor"]}')
        check(sorted(lanes) == ['A', 'B'], f'(W) {name}: both lanes present')

    # ---- geometry ----------------------------------------------------------------------------------------------
    check(X1 < XF17 < XL < XR, '(G) ordering X1 < x_f(1.7X) < x_L < x_R')
    check(XR - XL > D_W, f'(G) window width x_R - x_L = {float(XR - XL):.4f} > D_W = {D_W} (cross-band distance)')
    check(XF17 > 1 and X1 > 1, '(G) head walls > 1 (mirror zeros at distance > 1 from every band)')

    # ---- (RH-win) window -----------------------------------------------------------------------------------------
    rows = [json.loads(l) for l in open(TMP / 'b145-B-out/walls/chain_window_rerun.jsonl') if l.strip()]
    ok = all(r['status'] == 'OK' and r['ordered_disjoint'] for r in rows)
    contig = all(int(rows[i + 1]['n_first']) == int(rows[i]['n_last']) + 1 for i in range(len(rows) - 1))
    nf, nl = int(rows[0]['n_first']), int(rows[-1]['n_last'])
    found = sum(r['found'] for r in rows)
    check(ok and contig, '(RH-win) chunks OK, ordered/disjoint, consecutive indices (gluing lemma input)')
    check(found == nl - nf + 1 == 21665, f'(RH-win) {found} zeros = indices {nf}..{nl}')
    gam = flint_gammas([nf, nl]) if '--flint' in sys.argv else GAMMA_REC
    src = 'recomputed now' if '--flint' in sys.argv else 'recorded 2026-10-01'
    g1_hi = gam[nf][0] + gam[nf][1]
    g2_lo = gam[nl][0] - gam[nl][1]
    xl2 = Decimal(XL.numerator) / Decimal(XL.denominator) / 2
    xr2 = Decimal(XR.numerator) / Decimal(XR.denominator) / 2
    check(g1_hi < xl2, f'(RH-win) gamma_n_first <= {g1_hi:.6f} < x_L/2 = {xl2:.6f} (margin {xl2 - g1_hi:.3f}; {src})')
    check(g2_lo > xr2, f'(RH-win) gamma_n_last >= {g2_lo:.6f} > x_R/2 = {xr2:.6f} (margin {g2_lo - xr2:.3f}; {src})')
    check(Decimal(rows[0]['t_first_lo']) <= gam[nf][0] and gam[nl][0] <= Decimal(rows[-1]['t_last_hi']),
          '(RH-win) recomputed boundary zeros lie inside the chain log range [t_first_lo, t_last_hi]')

    # ---- (H2) far field --------------------------------------------------------------------------------------------
    h2 = json.load(open(TMP / 'b145-B-out/H2.json'))
    check(h2['all_PASS'] is True and int(h2['D_W']) == D_W and rat(h2['B_max_normalised']) == F(9, 4),
          '(H2) catalogue + sharp law: PASS for |d| >= 7252, b^2/h^2 <= 9/4 (b <= 1 at h >= 2/3)')
    bm = json.load(open(TMP / 'b145-refB-out/H2_BMAX52.json'))
    check(all(k['PASS'] for k in bm) and len(bm) == 24, '(H2) referee rerun B_max = 5/2 (h >= sqrt(2/5)): 24/24 PASS')
    h2mh = json.load(open(TMP / 'b145-B-out/H2_MH.json'))
    check(h2mh['all_PASS'] is True, '(H2) two-height kernels: all PASS')

    # ---- band outputs ------------------------------------------------------------------------------------------------
    s17 = json.load(open(TMP / 'b145-B-out/stack_X170.json'))
    s1 = json.load(open(TMP / 'b145-B-out/stack_X1.json'))
    s26 = json.load(open(TMP / 'b145-B-out/stack_XW26.json'))
    U2 = rat(s26['cert'])
    U1_17 = rat(s17['band_U1'])
    U1_PT = F(18409208597849, 125000000000000)   # b145-stack ptHeight.band_trackA_grid_MH (consume_mh_grid_X1_band)
    for tag, U1 in (('1.7X', U1_17), ('PT', U1_PT)):
        check(U1 < T_MAX and U2 < T_MAX, f'(T) {tag}: U1 = {float(U1):.15f}, U2 = {float(U2):.15f} < 41/250')
        check(U1 > U2, f'(T) {tag}: max(U1, U2) = U1, so the band-2 persistence step (unbounded cell, Lemma B.2 with b = inf) is needed')
    check(U1_17 == F(18108446112627, 125000000000000) and U1_17 < F(145, 1000),
          f'(T) 1.7X headline max(U1, U2) = {float(U1_17):.15f} < 0.145')
    te2_lo = U2 - QE / 2 - F(1, 10**15)
    check(te2_lo > F(1, 10), f'(Conf) band-2 terminal time t_e2 >= {float(te2_lo):.6f} > 0 (P15 Thm 1.5(i) applies on [t_e2, 41/250])')
    qm = q_mty_upper(XL)
    for tag, s in (('1.7X', s17), ('PT', s1)):
        q0 = rat(s['q0_band'])
        check(Decimal(q0.numerator) / Decimal(q0.denominator) > qm + Decimal('1.99e-6'),
              f'(BB1-entry) {tag}: band-1 start q0 = {float(q0):.12f} exceeds q_MTY(x_L) = {qm:.12f} by > 1.99e-6')
        check(s['band_strict_entry_ok'] is True, f'(BB1-entry) {tag}: strict-entry flag recorded true')

    # ---- (RH-head) -------------------------------------------------------------------------------------------------------
    check(T_PT >= (X1 + 1) / 2, f'(RH-head) PT height: ordinate (X+1)/2 = {float((X1 + 1) / 2):.1f} <= T_PT (PT Theorem 1)')
    check((XF17 + 1) / 2 > T_PT, f'(RH-head) 1.7X: ordinate (x_f+1)/2 = {float((XF17 + 1) / 2):.2f} > T_PT: beyond PT: open hypothesis (recorded, not a pass of RH)')

    # ---- strip ------------------------------------------------------------------------------------------------------------
    check(2 * T_MAX < 1, '(S) 2 * 41/250 < 1: sqrt(1 - 2t) in (0, 1) for 0 < t <= 41/250')

    print(f'\n{len(FAIL)} failure(s)')
    return 1 if FAIL else 0


if __name__ == '__main__':
    sys.exit(main())
