"""Map edits of lane c11-repair-del-referee-record: rows proposed by round-10 lanes 1, 3, 6, 7
(c10-ff-slot-cross-decomposition, c10-thin-deletion-zero-mode-control, c10-spectral-reciprocity-signed-moduli,
c10-ff-signal-intersection-square), each with the corrections of its referee file.
Anchored edits with assertions; previous file: before/OBSTRUCTION_MAP.md. Run once."""
import os, re, json
HERE = os.path.dirname(os.path.abspath(__file__))
PATH = os.path.join(HERE, '..', 'OBSTRUCTION_MAP.md')
t = open(PATH, encoding='utf-8').read()
assert t == open(os.path.join(HERE, 'before', 'OBSTRUCTION_MAP.md'), encoding='utf-8').read(), 'map changed since the copy'
assert 'c11-repair-del-referee-record' not in t, 'already applied'
n0 = t.count('\n')
edits = []
ROW_RE = re.compile(r'^\| ([A-Z]{1,2}\d{1,2}[a-z]?) \|', re.M)
ids0 = ROW_RE.findall(t)


def rep(old, new, name):
    global t
    assert t.count(old) == 1, (name, t.count(old))
    t = t.replace(old, new)
    edits.append(name)


def line_of(prefix):
    m = re.search(r'^%s.*$' % re.escape(prefix), t, re.M)
    assert m, prefix
    return m


def after_line(prefix, new_lines, name, ncell):
    global t
    m = line_of(prefix)
    for r in new_lines:
        assert r.startswith('| ') and r.endswith(' |') and r.count('|') == ncell + 1, (name, r[:40], r.count('|'))
    t = t[:m.end()] + '\n' + '\n'.join(new_lines) + t[m.end():]
    edits.append(name)


def cells(*c):
    for x in c:
        assert '|' not in x, x[:60]
    return '| ' + ' | '.join(c) + ' |'


# ============================================================ header
m = line_of('Update 2026-11-19, sixth (`c10-repair-record-referee-r9`)')
upd = ('\n\nUpdate 2026-11-19, seventh (`c11-repair-del-referee-record`): rows proposed by four lanes of campaign round 10, '
       'each worded after its referee file. Added: control DEL (section 2, table row and note; thin prime deletion, '
       'two referee files, relative to a short-interval prime theorem), row P52 (spectral window with reciprocity on '
       '(n, c); lead 4), row Z33 (squared signal of the probe as an intersection-form square in the function-field '
       'model), the round-10 slot split in row Z30, four rows of section 7. Row B (Beurling) is kept as a literature '
       'pointer; Statement O version 3 no longer uses it (row O1). No bound moves and section 1 is unchanged. Not '
       'entered: rows for `c10-ff-completed-rows-692` and `c10-tro6-dual-squarefree-type1-level` (no row text '
       'proposed by those lanes; their outcomes are in `campaign/ROUND_LOG.md`, round 10, and STRATEGY section 3.1 '
       'items 23, 24). The previous file is kept as `push/c11-repair-del-referee-record/before/OBSTRUCTION_MAP.md`.')
t = t[:m.end()] + upd + t[m.end():]
edits.append('header: update line "seventh"')

# ============================================================ section 2: control DEL
DEL = cells(
 'DEL',
 'thin prime deletion: S a set of primes with pi_S(x) = int_2^x t^(b-1) dt/log t + D(x), -C x^(b-eta) <= D(x) <= 0 '
 '(greedy floor rule c_n = min(c_(n-1) + 1, floor L(p_n)); density one); F(s) = prod over p not in S of (1 - p^-s)^-1 '
 '= zeta(s)(s - b) W(s), any b in (1/2, 1)',
 'Euler product; Lambda_F >= 0 (Lambda on powers of primes outside S, 0 on powers of primes of S); abs(Lambda_F(n)) '
 '<= log n; prime-power support; ordinary Dirichlet series with coefficients 0 or 1, completely multiplicative; one '
 'simple pole at 1 (residue prod over p in S of (1 - 1/p) > 0); continuation to Re s > max(b - eta, b/2) with W '
 'analytic and non-vanishing there; partial sums G(1) x + O(x^(b+eps)). Zero: simple, real, at s = b; right of b its '
 'zeros are exactly those of zeta. Status: PROVED-rel a counting form of a short-interval prime theorem (Huxley 1972: '
 'pi(x) - pi(x - x^theta) ~ x^theta/log x for theta > 7/12, so eta up to 5/12 - eps; statement read in two secondary '
 'sources, primary text not opened); two referee files (`c10-thin-deletion-zero-mode-control/REFEREE.md`, which '
 'repaired the lower bound of Lemma 0 by a dyadic split; `c11-repair-del-referee-record/REFEREE2.md`). Relative to the '
 'classical prime number theorem alone: G(s)/(s - b) tends to a non-zero limit as s -> b+ (argued by the second '
 'referee). Numerics (not a proof of the zero: every finite truncation is positive at b): sets built to 1e7 in ball '
 'arithmetic at b = 0.75, 0.9 and in float64 at b = 0.6, 0.8, 0.85 (to 2e7); exponent of prod over p in S, p <= X of '
 '(1 - p^-b) against log X between 0.99998 and 1.00004; W(b) >= 1.53707 (b = 0.9) and 1.87837 (b = 0.75) '
 'unconditionally; upper ends relative to an explicit bound for pi(x) - li(x) beyond 1.4e25 (Trudgian 2016 Theorem 2 '
 'as printed, not confirmed by either referee)',
 'functional equation of any type (no gamma factor); periodicity of the coefficients modulo any q (Lemma N); '
 'unimodular local parameter at the primes of S (it is 0 there); any zero at non-zero height that is not a zero of '
 'zeta (Lemma C: a zero of the deleted factor on Re s = b at height tau != 0 comes with a real zero of that factor at '
 'b of at least the same order); a counting error with exponent below b; growth bounds for W left of b; values at '
 's <= 0; an attached object',
 'kills any argument for a zero-free half-plane that uses the target only through prime positivity, size, support, '
 'the Euler product, the pole and the integers, without the functional equation or periodicity. With THIN (which has '
 'unimodular parameters and lacks Lambda >= 0) it covers the read sets described by positivity without unimodular '
 'parameters on a thin set (DEL) or unimodular parameters without positivity (THIN); a read set with Lambda >= 0 and '
 'unimodular parameters at every rational prime contains zeta only among degree-one Euler products (Lemma I: an '
 'identification, no inequality); local parameters of modulus strictly between 0 and 1 are covered by neither. '
 'Density one half in the rule gives F = zeta (s - b)^(1/2) W: a branch point of order two at b, not a zero '
 '(measured exponent 0.4999 to 0.5007 in X and 0.493 to 0.496 in s - b at 0.0125). Device read (argued from recorded '
 'read sets, `c10-thin-deletion-zero-mode-control/DEVICE_READ.md`): DEL passes 14 of the 34 device types and does not '
 'pass 20, whose read sets are the functional equation at all heights, periodicity with unimodular parameters at every '
 'rational prime, an attached object, or finite-order positivity with zeta\'s archimedean side. A standard '
 'construction, written out; not new')
after_line('| THIN |', [DEL], 'section 2: control row DEL', 5)

rep('| B | Beurling zeta (literature; not re-read) | Euler product, Lambda >= 0, simple pole at 1, continuation; zeros up to any theta < 1 | functional equation; integers | kills prime positivity + pole without the functional equation |',
    '| B | Beurling zeta (literature; not re-read) | Euler product, Lambda >= 0, simple pole at 1, continuation; zeros up to any theta < 1 | functional equation; integers | kills prime positivity + pole without the functional equation. Literature pointer only: since round 10 the written control with these properties is DEL (below), which is over the integers and has only a real zero off zeta\'s set; B is still the only named source for zeros at non-zero height off zeta\'s set with Lambda >= 0, and for a counting error below the zero |',
    'section 2: row B, use cell')

m = line_of('- Control THIN (`c4-thin-twist-control-78`, refereed once; table row above)')
note = ('\n- Control DEL (`c10-thin-deletion-zero-mode-control`, two referee files; table row above) is the member of TW+ '
        'with a zero in the open right half of the strip: positivity, size and support of Lambda, the Euler product, the '
        'pole and the integers are all kept, and the function vanishes at a prescribed real b in (1/2, 1). It replaces '
        'the Beurling source in Statement O (version 3, lines 1 and 5; row O1). In the input-level sets of the note '
        'above it lacks FE and GEOM (on S) and has INT. Each finite stage of DEL is zeta\'s stage with z_p = 0 for p '
        'in S, so every stage property is inherited and the limit has a zero at b (an example for row Q19). The zero '
        'comes from the theorem, not from data: a list of S below any bound is compatible with completions that have '
        'no zero. Engine: proposed as control code DEL in `engine/curated/controls.json` (entered by the same lane).')
t = t[:m.end()] + note + t[m.end():]
edits.append('section 2: note on control DEL')

# ============================================================ row Z30: round-10 slot split
old = ('The model excess and the Z[omega] screen (no target excess) are not reconciled (lane `c10-ff-slot-cross-decomposition`); '
       'outstanding bounded check: completed rows (6, 9, 2) at q = 7 (lane `c10-ff-completed-rows-692`).')
new = ('Round 10, slot split of the exact F_q[T] row energy (`c10-ff-slot-cross-decomposition`; one referee, four corrections): '
       'long marks (lam > N, lam > d), q = 7 (N + lam <= 14, one run at 15) and q = 13 (<= 10), N = 2, 3, d <= 3, 58 '
       'configurations, exact integers, rules fixed before the runs. R = sum over marked primes P of R^P, the block of P '
       'being chi_P(m) times the unmarked row twisted by a cubic character. The slot-diagonal part equals the diagonal up '
       'to O(N q^(N - lam/2)) (prime sum of a non-principal cubic character; measured within 2.4e-3 for lam >= 7), so the '
       'excess over the diagonal is the cross term over pairs of distinct marked primes, and random signs on the marked '
       'primes return every vector to the diagonal in the mean (per-seed scatter about 0.4 at d = 1). The exact squared '
       'signal B on the Gauss-sum rows is carried by pairs of distinct primes; with n = (E - B)/D: n <= 1.5 in 583 of 596 '
       'vector-configurations, the registered statistic c_perp in [-1.05, 1.5] in 593 of 596, and n = 5.3 for the second '
       'target at (2, 12, 1), so the registered rule "excess = coherent cross" is not awarded. Post hoc: a second squared '
       'signal in the vector\'s own character u(m), supported for non-invariant vectors at d = 1 only (7 rows, one q); for '
       'the translation-invariant vectors (one, mu) at d = 2 the vanishing remainder is a dimension count (referee). The '
       'target is not separated from random multiplicative signs (50 of 51). Reconciliation with the Z[omega] screen '
       '(sizes, not a disagreement): at short marks the model has no target excess for the six interior target values at '
       'N >= 4 (ratio 0.975 to 0.997; at the window edge and at N = 3 the target values 1.12 to 1.17 lie outside the '
       'control ranges, small samples), and in Z[omega] the predicted coherent cross is 1.5e-4 to 3.2e-4 of the diagonal '
       'at Z = 2000 to 16000 against resolution 0.01 to 0.02; visibility would need of the order of 1e10 columns with '
       'P >= Z^2 (ARGUED estimate from a float proxy, extrapolated over 13 to 15 orders of magnitude). The completed-row '
       'run (6, 9, 2) at q = 7 was made by `c10-ff-completed-rows-692` (no row text proposed by that lane; outcome in '
       '`campaign/ROUND_LOG.md`, round 10: the literal band is met through offsetting deviations and the completed-row '
       'law fails with exact inputs).')
rep(old, new, 'row Z30: round-10 slot split in place of "not reconciled"')
rep('window in F_q[T]: EXACT integers, Lemma P PROVED, one referee (holds narrowed, corrections E1 to E9) |',
    'window in F_q[T]: EXACT integers, Lemma P PROVED, one referee (holds narrowed, corrections E1 to E9); round-10 slot '
    'split: identity and slot-diagonal lemma PROVED (Weil), EXACT integers, rule outcomes MEASURED, second squared '
    'signal POST-HOC, visibility size ARGUED, one referee |', 'row Z30: status cell')
rep('`c9-mv6-ff-window-exact` (+ REFEREE.md) |\n| Z31 |',
    '`c9-mv6-ff-window-exact` (+ REFEREE.md); `c10-ff-slot-cross-decomposition` (+ REFEREE.md; `MAP_ROW_PROPOSED.md`) |\n| Z31 |',
    'row Z30: source cell')

# ============================================================ row Z33 (lane 7)
Z33 = cells(
 'Z33',
 'Squared signal of the Prop. 2.1 probe as an intersection-form square, as the crossing device of the function-field '
 'model (generator ranks 17, 26; neighbours T3, Z26, Z30)',
 'F_q[T], prime cubic conductor, N <= 3, exact (q = 7; referee reruns at q = 5, 11). The Moebius sum of the probe is '
 'S_cop(k) = sum_j c_j t_j with c = c(q, N, lam, k) independent of the curve (Lemma 1, proved; uses "sums over primes '
 'of the character are Frobenius traces"). For every vector c and every real quadratic 1 - a u + q u^2, with roots on '
 'or off the circle, (sum_j c_j t_j)^2 = -D.D/(2 q^N) with D = sum_j c_j (P_(N+j) + q^j P_(N-j)); the equality is '
 'deg[m] = m^2 on an elliptic curve, uses no index theorem and carries no positivity (it holds for genus-1 fakes with '
 'off-line zeros; the counts 3444 of 3444 and 9408 of 9408 test nothing beyond Lemma 1). B_coh of the round-8 law is a '
 'non-negative combination of such numbers. In genus 2 the equality fails (0 of 80 at q = 7; 0 of 624 at q = 5) and '
 'becomes l^2 = (g/2)(-D.D)/q^N - sum (phi_m - phi_n)^2 for trace-linear signals; the probe signal M_N = h_N is not '
 'trace-linear for g >= 2, N >= 2. The Riemann hypothesis of the target enters only as the Weil upper bound on the '
 'signal. Corrections of the referee: the sentence "the squared signal is (P_0 . D)^2" is false (P_0 . D carries the '
 'extra factor t_N; the correct form is S = -(1/2) P_0 . P_[m]); "h > 1 comes from the sixth-power count of the probe '
 'rows" holds only within the round-8 law (measured for r <= 5, extrapolated). No new input is named. Not covered: the '
 'probe J_k itself for r >= 6 on conductor degree >= 5 (genus >= 2 targets; lane `c11-ff-genus2-probe-jk`).',
 'PROVED (Lemma 1; square identity as an algebraic identity); EXACT (q = 7, N <= 3, 112 curves; 80 curves of genus 2); '
 'one referee, holds with corrections',
 'genus-1 fakes with zeros off the line, the Liouville-twisted target and the aligned vector satisfy the identity; '
 'random multiplicative signs have no curve-independent c; trivial target and w = mu have no primitive class',
 '`c10-ff-signal-intersection-square` (+ REFEREE.md)')
after_line('| Z32 |', [Z33], 'section 3.5: row Z33', 6)

# ============================================================ row P52 (lanes n4 + c10 lane 6)
P52 = cells(
 'P52',
 'Unit spectral window with non-negative central values and a long Moebius polynomial (lead 4), and its reopening by '
 'spectral reciprocity over signed moduli',
 'Window positivity (L(1/2, phi_j) >= 0, Katok-Sarnak) isolates the Eisenstein member, and an off-line zero would '
 'force S(T, X) large if the mollifier length X = T^A had A > 1 (detector P2: ARGUED, not proved; no region of '
 'convergence in t for a comparison). The long-polynomial off-diagonal needs Moebius cancellation against characters '
 'of conductor at least the length, summed with signs over the moduli: coefficient-blind tools give A = 1/2 (A = 1 '
 'under Lindelof for the family, or with GRH for Dirichlet L-functions termwise), so the output abscissa '
 '1/2 + 1/(2A) is >= 1 (`n4-spectral-window-moebius`, unrefereed ledger). Round 10: the exact reciprocity dual of '
 'sum_c S(n, l; c)/c (Poisson in n, additive reciprocity, Poisson in the modulus; Lemma R, CLASSICAL, re-derived, '
 'checked to 1e-13) is a coprime-lattice sum over (m, c) whose second dual is a Kloosterman sum to the moduli m. Both '
 'steps act on (n, c); the twist l, which carries A, is a parameter and is not moved: ledger map A -> A, dual side '
 'T^(2A-1) terms per l against T (equal at A = 1, longer beyond). The statement "the composite is the functional '
 'equation of L(s, phi_j)" is supported by matching of ranges only (referee C3). Variants with a second family on the '
 'dual side (Motohashi type cubic weight; Blomer-Khan level reciprocity; Humphries-Khan, Kwan) are a ledger over '
 'RECALLED formulas, not derived: lengths (T, X^2) -> (T, X^2) or a dual family of size >= X^2; known range A <= 1/4 '
 'for the long-window mollified fourth moment (recalled). No A > 1/2 obtained. Reopen only with a reciprocity that '
 'acts on the Moebius variable l (lane `c11-rs1-twist-modulus-reciprocity`).',
 'n4 ledger: ARGUED (author; unrefereed). Lemma R: CLASSICAL, PROVED with the hypotheses completed by the referee '
 '(w smooth on (0, inf) with rapid decay; sum abs(w(c)) c finite); weight-1 closure PROVED; variants ARGUED over '
 'recalled formulas; one referee, holds with corrections C1 to C8',
 'E_a with real a passes the positivity of the degree >= 4 weights by the functional equation alone '
 '(L(1/2 + a, phi_j) L(1/2 - a, phi_j) >= 0 on even forms; proved); T-NR passes the weight-1 positivity as a finite '
 'Hecke polynomial at q; DH fails at Hecke linearisation; THIN and U have no automorphic family. Control rates '
 '("false for E_a at rate X^(2a)") rest on the unproved detector and were not computed',
 '`n4-spectral-window-moebius`; `c10-spectral-reciprocity-signed-moduli` (+ REFEREE.md)')
after_line('| P51 |', [P52], 'section 3.1: row P52', 6)

# ============================================================ row O1
rep('Euler product + positivity + pole without FE or integers (Beurling; relative to literature not opened);',
    'Euler product + positivity + pole without FE (version 3: DEL, thin prime deletion, relative to a short-interval prime '
    'theorem; previously Beurling, relative to literature not opened);', 'row O1: class list, line 5')
rep('ARGUED 7 (lines 1, 4, 5, 7, 10, 11, 12), each labelled "relative to" its source. Both passes are internal |',
    'ARGUED 7 (lines 1, 4, 5, 7, 10, 11, 12), each labelled "relative to" its source. Both passes are internal. Round-10 '
    'referee of that pass (E1): line 3 is confirmed only for the inputs {EP, POS, FE}. Version 3 '
    '(`c11-repair-del-referee-record/STATEMENT_O_v3.md`, a new file; the c9 file is unchanged): line 3 narrowed to '
    '{EP, POS, FE, finite order} with the ZF(theta) part ARGUED; lines 1 and 5 and section C rows 1b, 2a rewritten against '
    'DEL; line 5 PROVED relative to Huxley 1972 (two referee files on the DEL lemma); count PROVED 4, PROVED-relative 1, '
    'MEASURED 1, ARGUED 6. The lane that wrote the second DEL referee file also wrote version 3 |',
    'row O1: status cell')
rep('`c10-repair-record-referee-r9/REFEREE2.md`; outline `campaign/OBSTRUCTION_RECORD_OUTLINE.md` |',
    '`c10-repair-record-referee-r9/REFEREE2.md`; `c11-repair-del-referee-record/STATEMENT_O_v3.md`; outline `campaign/OBSTRUCTION_RECORD_OUTLINE.md` |',
    'row O1: source cell')

# ============================================================ section 7
S7 = [
 cells('Lemma 0 (lower bound of the discrepancy) labelled PROVED-rel S(theta); "for a deletion product a zero on Re s = b at height tau != 0 comes with a real zero"; "no continuation across b" at half density',
       'c10-thin-deletion-zero-mode-control',
       'The step pi(y) - pi(x) >= c\'(y - x)/log x is covered by the range form only for y - x <= x; repaired by additivity of B and a dyadic split, conclusion unchanged. The zero statement holds for the deleted factor G only (F = zeta G also vanishes at zeros of zeta). Half density gives a branch point of order two (continuation along paths avoiding b exists). Control row DEL'),
 cells('"n <= 1.5 in 593 of 596"; post hoc "second squared signal" for all vector classes; "no target excess at short marks"',
       'c10-ff-slot-cross-decomposition',
       '593 of 596 is the count for the registered statistic c_perp; n <= 1.5 holds in 583 of 596. The second signal is supported at d = 1 for non-invariant vectors only; for one and mu at d = 2 the vanishing remainder is a dimension count. Short marks: six interior target values at N >= 4, not the window edge or N = 3 (row Z30)'),
 cells('"The composite of the two dual steps is the functional equation of L(s, phi_j)"; "weight 3 is the lowest weight with a dual family"; control rates for E_a and T-NR',
       'c10-spectral-reciprocity-signed-moduli',
       'Supported by matching of ranges only; proved and sufficient: the twist l is not moved by either step. The weight statement has no proof or reference; the variants are recalled, not derived. The rates rest on the unproved detector P2 and were not computed (row P52)'),
 cells('"The squared signal is the square (P_0 . D)^2 of an intersection number with the diagonal class"; "h > 1 comes from the sixth-power count of the probe rows"; counts 3444 of 3444 as the decisive test',
       'c10-ff-signal-intersection-square',
       '(P_0 . D)^2 = t_N^2 S^2; the correct form is S = -(1/2) P_0 . P_[m]. The h > 1 sentence holds only within the round-8 law (measured, extrapolated). The counts test nothing beyond Lemma 1; the square identity is algebraic (row Z33)'),
]
m = None
for m in re.finditer(r'^\| .*\| c9-szego-sum-rule-prime-cascade \|.*$', t, re.M):
    pass
assert m
for r in S7:
    assert r.count('|') == 4
t = t[:m.end()] + '\n' + '\n'.join(S7) + t[m.end():]
edits.append('section 7: four rows (round 10)')

# ============================================================ row count
ids1 = ROW_RE.findall(t)
assert len(ids1) == len(set(ids1)), 'duplicate row id'
new_ids = [i for i in ids1 if i not in ids0]
assert new_ids == ['P52', 'Z33'], new_ids
from collections import Counter
cnt = Counter(re.match(r'[A-Z]+', i).group(0) for i in ids1)
order = ['P', 'G', 'Q', 'S', 'Z', 'F', 'T', 'L', 'D', 'O']
assert set(cnt) == set(order), cnt
rep('Row count (recounted 2026-11-19 by `c10-repair-record-referee-r9`): P 51, G 31, Q 27, S 12, Z 35, F 8, T 3, L 5, D 7, O 1 = 180.',
    'Row count (recounted 2026-11-19 by `c11-repair-del-referee-record`): %s = %d. Controls in the section 2 table: %d (DEL added).'
    % (', '.join('%s %d' % (k, cnt[k]) for k in order), len(ids1),
       len(re.findall(r'^\| (?:DH|HEAT|TW\+|TW-|EA|NR|B|WT|THIN|DEL|PT|TW) \|', t, re.M))), 'row count line')
open(PATH, 'w', encoding='utf-8').write(t)
json.dump(dict(edits=edits, linesBefore=n0, linesAfter=t.count('\n'), rowsBefore=len(ids0), rowsAfter=len(ids1),
               newRowIds=new_ids, counts={k: cnt[k] for k in order}),
          open(os.path.join(HERE, 'map_edits.json'), 'w'), indent=1)
print(json.dumps(dict(linesBefore=n0, linesAfter=t.count('\n'), rowsBefore=len(ids0), rowsAfter=len(ids1), new=new_ids,
                      counts={k: cnt[k] for k in order}, edits=edits), indent=1))
