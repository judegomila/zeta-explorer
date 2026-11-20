#!/usr/bin/env python3
"""Apply the round-3 owed edits to push/OBSTRUCTION_MAP.md (lane c4-repair-map-engine-r3).

Text edits only. Each edit is an exact-string anchor; the script stops if an anchor is missing or
not unique, and does nothing if the marker of this lane is already in the file.
Run:  python3 apply_map_r3.py            (writes the map; previous file is in before/)
      python3 apply_map_r3.py --check    (reports anchors only)
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
MAP = os.environ.get('MAP_PATH') or os.path.normpath(os.path.join(HERE, '..', 'OBSTRUCTION_MAP.md'))
MARK = '`c4-repair-map-engine-r3`'

edits = []          # (label, anchor, replacement)


def after(label, anchor, addition):
    edits.append((label, anchor, anchor + addition))


def replace(label, anchor, new):
    edits.append((label, anchor, new))


# ---- header ------------------------------------------------------------------------------------
after('header update line',
      'The previous file is kept as `push/c3-repair-map-theorem-a/OBSTRUCTION_MAP.before.md`.',
      '\n\nUpdate 2026-11-18, second (' + MARK + '): campaign round 3 (`c3-*`, each refereed once) is added: '
      'the twisted fixed-s form in row T2 (cross-reference in P10), row P43 (Lemma B as a restatement, with its '
      'shifted form), row S12 and the fixed-window-count filter entry (section 2, Q2; control WT; section 5), '
      'the Euler-stage negative-square count in rows G10 and Q10, and the round-3 paragraph of section 5. '
      'Round-3 lanes without a row here: `c3-helson-tail-fe-selector`, `c3-rs-matched-halfsum-hb` (closed '
      'families in `engine/closed_families.json`; the second stops at row P27). The previous file is kept as '
      '`push/c4-repair-map-engine-r3/before/OBSTRUCTION_MAP.md`.')

# ---- section 2: control WT, Q2 -----------------------------------------------------------------
after('WT row, use column',
      'a mechanism must read the angles t log p jointly and non-locally in height (Riemann-Siegel length, or all '
      'heights). Source: `c2-euler-cone-fe-rigidity` (refereed once, seven wording corrections)',
      '. Fixed-window-count filter (`c3-multiwindow-converse-defect`, refereed once): WT passes any test in m '
      'windows with m, window length and tolerance independent of T (row S12)')

after('Q2 filter entry',
      'Positivity on finite tests has no margin (eq48 Theorem 4).',
      ' Fixed-window-count filter (row S12): a functional-equation test in m windows with m, the window length H '
      'and the tolerance eta independent of T is passed by a height translate zeta(s + i alpha) above a height '
      'T_0(m, H, eta); an argument whose functional-equation input is of that form fails against WT, and the '
      'window count at which the test becomes rigid is of Riemann-Siegel size, about sqrt(T)/log T.')

# ---- row P10: cross-reference ------------------------------------------------------------------
after('P10 cross-reference',
      'The bound with slack is itself the target.',
      ' Twisted fixed-s form (a one-sided bound in P at one strip point): row T2.')

# ---- row P41: Lemma B pointer ------------------------------------------------------------------
after('P41 pointer to P43',
      'it holds for every control with the functional equation.',
      ' Closed as a restatement in round 3: row P43.')

# ---- new row P43 after P42 ---------------------------------------------------------------------
P42_END = '| `c2-projection-domination-gonek` |\n'
P43 = ('| P43 | Pole-lattice test multipliers (Lemma B: the S-periodised explicit formula; theta-family and shifted '
       'forms) as a route to an inequality | By Poisson summation in k the residue sum over the poles '
       '1 + 2 pi i k/log p equals Weil\'s pole term minus the prime sum for the test Z_S w, truncated together: '
       'Lemma B is the Weil explicit formula for a non-compactly supported test, regularised. It has no sign of its '
       'own; the enlarged support threshold log(2 N_S) is bookkeeping, not a gain; the only inequality step is the '
       'classical zero-free region (Littlewood / Vinogradov-Korobov form). Proved for abs(S) = 1 (finite-smoothness '
       'profiles included); for abs(S) >= 2 for C_c^inf tests, with absolute convergence from a Baker-type bound '
       'whose constant was not checked against the source. Shifted form (multiplier zeta_S(s - 1 + sigma_0), poles '
       'on Re s = sigma_0; `c3-lemmab-halfplane-growing-s`): a correct identity; with the residues bounded in '
       'absolute value through sup bounds of zeta\'/zeta on the line, positivity is certified only for support '
       'T_w <= f(sigma_0) log log T, f = (sigma_0 - Theta)/((1 - Theta)(sigma_0 - 1/2)), f(1) = 2 for every Theta '
       'including RH (the Littlewood scale X = (log T)^2). Support c log T is not reached and the 7/8 half-plane '
       'adds no range. This is an obstruction of the bounding method, not a proof that positivity fails beyond '
       '2 log log T; a signed treatment of the lattice sum is the target (P10). | PROVED (abs(S) = 1; refereed '
       'once, seven corrections); abs(S) >= 2 PROVED-rel the Baker-type bound (Proposition P and the constant: '
       'referee debt); DH check MEASURED (14 cases, two codes, relative error at most 5.4e-12, off-line pairs up to '
       '61% of the zero side); shifted identity MEASURED (30 cases, at most 2.0e-10); range bound PROVED for the '
       'method (refereed once) | DH (satisfies the identity); EA (the shifted identity holds for it, measured); '
       'TW- (Liouville twist: the identity exists); target for the signed form; heat, generic twist argued, not '
       'run | `c3-lemmab-referee-dh-poisson`; `c3-lemmab-halfplane-growing-s`; first stated in `c2-euler-at-zeros` '
       '(row P41) |\n')
after('row P43', P42_END, P43)

# ---- row G10: negative-square count ------------------------------------------------------------
G10_TAIL = 'Gamma reserve covers primes up to Q* = 37 at t = 1e12.'
after('G10 negative-square count', G10_TAIL,
      ' Stages reflected about Re s = 1/2 (`c3-twinladder-prime-built-chain`, refereed once, four non-fatal '
      'errors): for every X >= 2 and every real symmetric normalisation, Theta_X = E_X^#/E_X has poles in '
      'Re s > 1/2 at 1 + 2 pi i k/log p (simple, k != 0, p <= X), at s = 1 (order pi(X) + 1) and at s = 3, 5, 7, '
      '... (simple); T theta(X)/pi + O(pi(X)) of them have abs(Im s) <= T, theta(X) = sum_{p <= X} log p. By '
      'Krein-Langer (recalled, source not opened) the stage kernel has infinitely many negative squares, at '
      'density theta(X)/pi per unit height, and no stage de Branges space, Pontryagin space or Hamiltonian '
      'exists. As recorded by the lane, the count goes to infinity along the stages and to zero in the limit, so '
      'no monotone or semicontinuous limit device (de Branges ordering, Krein-Langer counts) follows it. '
      'abs(theta_p)^2 - 1 has the sign of 2 cos(t log p) - p^{-sigma} - p^{sigma-1} for sigma > 1/2 (exact, also '
      'for unimodular twists): adjoining a prime is neither contractive nor expansive; K_X(w, w) is not monotone '
      'in X (MEASURED at 20 points, sign changes at 14; the same for the Liouville twist and random U). The Euler '
      'factor is lossless only about Re s = 0; the functional equation is not an input of any finite Euler stage. '
      'Not closed by this: a stage that takes the functional equation as an input (functional-equation-symmetrised '
      'stage, `c4-fe-stage-rouche-crossing`).')
replace('G10 status', '| PROVED (modulo classical inputs) | TW (size-only); DH breaks at a parallel junction',
        '| PROVED (modulo classical inputs); reflected-stage pole count PROVED (refereed once), kernel non-monotonicity '
        'MEASURED | TW (size-only); U, TW-, EA, B (reflected stages: not separated from zeta, all fail at the same '
        'step); DH breaks at a parallel junction')
replace('G10 source', '| `g-passive-cascade` |\n', '| `g-passive-cascade`; `c3-twinladder-prime-built-chain` |\n')

# ---- row Q10: negative-square count ------------------------------------------------------------
after('Q10 negative-square count',
      'the gap between the l^1 and l^2 thresholds of (p^{-sigma} log p).',
      ' Euler stages reflected about Re s = 1/2 are not sections of any Hermite-Biehler chain: the stage kernel has '
      'negative squares at density theta(X)/pi per unit height (about T theta(X)/pi poles of Theta_X in Re s > 1/2 '
      'below height T), for zeta and for every unimodular twist; statement and status in row G10 '
      '(`c3-twinladder-prime-built-chain`).')
replace('Q10 source', 'EA has threshold 1/2 + a | `sq-causal-cascade` |\n',
        'EA has threshold 1/2 + a; U, TW-, EA, B (reflected stages: not separated from zeta) | `sq-causal-cascade`; `c3-twinladder-prime-built-chain` |\n')

# ---- new row S12 after S11 ---------------------------------------------------------------------
S12 = ('| S12 | Window functional-equation rigidity with a fixed number of windows (rotation lemma of Q21 with the '
       'window-translate lemma of control WT) | For fixed m, H, eta there is an integer alpha != 0 such that '
       'zeta(s + i alpha) passes all m window tests above a height T_0(m, H, eta) (phase identity, defect '
       '2 abs(sin(Psi/2)); Dirichlet simultaneous approximation): no statement "defect at most eta in m windows '
       'implies chi(p) = 1" holds with m and eta independent of T. In the finite model (smoothed approximate '
       'functional equation, windows of length 2, all primes p <= N = 3.2 sqrt(T/2 pi) free as unimodular phases) '
       'unimodular Euler products with window defect below 1e-9 and a simple off-line zero of the model function '
       'exist for m below a crossover m* of order pi(N)/30 (within a factor about 2); beyond it local search found '
       'none, with no certificate of infeasibility. Past the crossover the conclusion is "F = zeta on the window", '
       'which holds for bounded non-multiplicative sequences as well (Hamburger). The test reads the conductor, one '
       'phase and about 30 reals per window, not the Euler product. Rigidity needs a window count of Riemann-Siegel '
       'size, about sqrt(T)/log T. | PROVED (translate statement; refereed once, seven statements weakened); '
       'MEASURED (finite model: witnesses at tolerance 1e-5 for m = 1 at T = 1e5 and m <= 4 at T = 1e6; one survivor '
       're-evaluated by the referee in ball arithmetic; none found at T <= 1e4, at m >= 2 for T = 1e5, at m >= 8 for '
       'T = 1e6; certified infeasibility or witness at T = 1e5, m = 2 and T = 1e6, m = 8: referee debt) | WT, U '
       '(height translate passes any fixed number of windows at large height); constructed unimodular Euler products '
       'with a prescribed off-line zero (m < m*); DH and L(chi_5) fail only by conductor at m >= 2, at the same step '
       'as non-multiplicative sequences | `c3-multiwindow-converse-defect`; `c2-euler-cone-fe-rigidity` |\n')
S11_END = '| `c1-window-sdp-scaling` |\n'
after('row S12', S11_END, S12)

# ---- row T2: twisted fixed-s form --------------------------------------------------------------
after('T2 twisted form',
      'Multiplicity step needs f(s)^k = f(ks), false in characteristic 0.',
      ' Twisted fixed-s form (`c3-fixedt-growingp-onesided`, refereed once, corrections E1-E5): for fixed '
      's = sigma + it, 1/2 < sigma < 1, t != 0, put G(P; s) = sum_{p <= P} p^{-s} + E_1((s - 1) log P). Its Laplace '
      'transform in log P is (1/w)[log((s + w - 1) zeta(s + w)) - log(s - 1) - H(s + w)], H analytic in '
      'Re(s + w) > 1/2, with singular points w = 0 and w = rho - s for every zero rho at every height. A lower '
      'bound Re G(P; s) >= -C P^alpha for all large P at that one point gives Theta <= sigma + alpha (no '
      'exceptional ordinate for this sign: referee E3); an upper bound Re G(P; s) <= C P^alpha gives '
      'beta <= max(sigma + alpha, beta_t) for every zero, beta_t the largest real part of a zero with ordinate '
      '+-t; conversely Theta <= sigma + alpha gives the two-sided bound O(P^{alpha + eps}). The statement is '
      'global, not a window statement: a zero at distance Delta from s enters with weight '
      'P^{beta - sigma}/(Delta log P), so a test with P <= Pmax does not separate zeta from a control whose zero '
      'is farther than about Pmax^{beta - sigma}/log Pmax (MEASURED, float64, P <= 1e7, on U, RZ_b and DH; '
      'referee rerun to 4e6 at other points). The criterion holds verbatim for U, RZ_b and DH. For the Liouville '
      'twist G_lambda = -G_zeta identically, so a derivation of a one-sided bound that uses only complete '
      'multiplicativity, real unimodular local parameters and meromorphy gives the two-sided bound; this does not '
      'cover derivations that use the functional equation, which the Liouville twist lacks (referee E1). That no '
      'unconditional input gives the one-sided bound without the two-sided one is ARGUED (a survey of four input '
      'types), not a theorem. The step from fixed P to all P is the statement to be proved.')
replace('T2 status/defeated/source',
        '| PROVED (Prop S; author; unrefereed); sieve row ARGUED | function-field fakes (1 - 5T + 5T^2: Euler product, '
        'FE, rationality); DH satisfies the equivalence and fails the bound | `ff-transplant` |',
        '| PROVED (Prop S; author; unrefereed); sieve row ARGUED; twisted fixed-s form PROVED (Lemma 1, Thm. 1, '
        'Prop. 2(i),(iii) re-derived by the referee; Landau\'s theorem CLASSICAL), tables MEASURED | function-field '
        'fakes (1 - 5T + 5T^2: Euler product, FE, rationality); DH satisfies the equivalence and fails the bound; '
        'twisted form: U, TW-, DH (the criterion holds verbatim for U, RZ_b, DH; the Liouville twist is the exact '
        'mirror); target | `ff-transplant`; `c3-fixedt-growingp-onesided` |')

# ---- section 5: round-3 paragraph --------------------------------------------------------------
after('section 5 round 3',
      'A mechanism has to read the angles t log p jointly and non-locally in height, or act on a limit step directly.',
      '\n\nRound 3 (8 lanes, each refereed once): the identity rated least blocked after round 2 (Lemma B) is the '
      'explicit formula on a non-compactly supported test (P43); sup bounds of zeta\'/zeta on a vertical line stop '
      'at support 2 log log T for every Theta including RH (P43); a one-sided bound in P at one fixed strip point is '
      'a global Landau equivalence that holds as a criterion for every control (T2); no finite Euler stage carries '
      'the functional equation, and its kernel has negative squares at density theta(X)/pi (G10, Q10); on T^inf '
      'strip zeros are a tail datum and the functional equation a one-orbit datum, so no tail-measurable, generic, '
      'almost-everywhere or rotation-invariant property reaches chi = 1 (`c3-helson-tail-fe-selector`); the '
      'Riemann-Siegel half-sum splitting is unmollified Levinson with loss equal to its right-zero count '
      '(`c3-rs-matched-halfsum-hb`, row P27); a functional-equation test in a fixed number of windows is passed by '
      'height translates (S12); first-moment no-go statements of Theorem A\' type rest on Schwarz-Pick and hold for '
      'DH (Q22). Filter entries added: (i) fixed window count (section 2, Q2; row S12); (ii) a fixed-height test '
      'with P <= Pmax does not separate a control whose zero is farther than about Pmax^{beta - sigma}/log Pmax '
      '(T2); (iii) a limit device must not be monotone or semicontinuous in the stage index, because the '
      'negative-square count of reflected Euler stages is not (G10). Forms left open by round 3 and taken up in '
      'round 4: a stage that is a finite Blaschke product by construction with the functional equation as input; a '
      'quantitative non-tail property tied to chi = 1 (bounded discrepancy of partial sums).')

# ---- section 7: referee-broken claims of round 3 ------------------------------------------------
after('section 7 header rows',
      '| Claim | Lane | Correction |\n|---|---|---|\n',
      '| Prop. 2(ii): the Liouville mirror covers hypotheses including "a functional equation of the same type" | '
      'c3-fixedt-growingp-onesided | zeta(2s)/zeta(s) has no functional equation of that type; the mirror rules out '
      'only derivations from complete multiplicativity, real unimodular local parameters and meromorphy |\n'
      '| "No input that holds at Re s >= 1 or at finite stages produces the one-sided bound", in the verdict line '
      'without a label | c3-fixedt-growingp-onesided | A survey of four input types (ARGUED), not a theorem |\n'
      '| Half-sum failure depends on "second moments of abs(a_n) only" | c3-rs-matched-halfsum-hb | The size of the '
      'failure depends on multiplicativity, in the adverse direction (Bohr random-multiplicative model reproduces the '
      'zeta / chi_5 excess and the DH deficit) |\n')


def main():
    check = '--check' in sys.argv
    text = open(MAP, encoding='utf-8').read()
    if MARK in text:
        print('marker of this lane already present: nothing done')
        return
    report = []
    for label, anchor, new in edits:
        n = text.count(anchor)
        if n != 1:
            sys.exit(f'STOP: anchor for "{label}" found {n} times')
        report.append(label)
        if not check:
            text = text.replace(anchor, new)
    if not check:
        open(MAP, 'w', encoding='utf-8').write(text)
    print(('checked ' if check else 'applied ') + str(len(report)) + ' edits:')
    for r in report:
        print('  ' + r)


if __name__ == '__main__':
    main()
