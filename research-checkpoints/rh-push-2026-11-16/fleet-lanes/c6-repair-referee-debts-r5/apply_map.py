"""Map edits of lane c6-repair-referee-debts-r5. Exact-string replacements with assertions; the previous file is in
before/OBSTRUCTION_MAP.md. Run once: python3 apply_map.py"""
import os, json, re
HERE = os.path.dirname(os.path.abspath(__file__))
PATH = os.path.join(HERE, '..', 'OBSTRUCTION_MAP.md')
t = open(PATH, encoding='utf-8').read()
n0 = t.count('\n')
edits = []

def rep(old, new, name, count=1):
    global t
    assert t.count(old) == count, (name, t.count(old))
    t = t.replace(old, new)
    edits.append(name)

SRC = '`c5-device-table-extension` (one referee; wording corrected per its REFEREE.md section 4)'
# ---- 1. seven device rows (new subsection 3.9), with the six wording corrections applied
D = [
 ('D1', 'Baker bounds for linear forms in log p',
  'Coefficient-blind: the bound concerns the frequencies log n and holds for DH, every sign twist, THIN, U, WT. For integers it is weaker than abs(log m - log n) >= 1/max(m,n) (Montgomery-Vaughan input, a mean value: P27, P29). Its non-trivial content is a polylogarithmic gap for S-units with fixed S (measured exponent 2.9 to 3.4 for 4 primes), giving window-uniform mean squares of a fixed Euler stage. The constant that Baker-Matveev proves is doubly exponential in the stage length; the measured gaps follow the pigeonhole exponent k - 1, so this is a property of the provable constant, not of the frequencies. No finite stage carries the functional equation (G10, Q10).',
  'PROVED (elementary) / MEASURED', 'DH, TW+-, THIN, U, WT pass every step'),
 ('D2', 'Sum-product / multiplicative amplification',
  'The additive-against-multiplicative pairing for zeta is Vinogradov\'s method (power saving N^{-c eps^2} at N = t^eps); it gives the Vinogradov-Korobov region and no fixed strip, because a size bound converts to a region of width 1/log(size). A bilinear form sum a_m b_n (mn)^{it} over a rectangle has rank one (PROVED identity: no bilinear gain); for Vaughan-type forms with the cut mn <= x the same conclusion is ARGUED, not proved. The dual pairing gives Hurwitz/Estermann series (mean values over characters). Fails for DH at the 3-4-1 step and for sign twists and THIN at the interval-sum step; THIN passes any estimate with relative slack above x^{b-1}.',
  'CLASSICAL / ARGUED (rectangle identity PROVED)', 'none passes; the conclusion is the classical region'),
 ('D3', 'Carleson / corona / interpolating-sequence criteria for S = N/D',
  'Each theorem assumes the symbol bounded analytic in Re z > 0 (this is RH) or describes the zero set of an inner function; as criteria they hold for DH, HEAT, E_a, NR. The unconditional signed member is the Balazard-Saias-Yor Poisson-Jensen identity, whose sign is free and opposite to the one needed; RH is equality (no margin: S4, Q13). Corona data (N, D) measure simplicity of zeros of F. The zeros of S at height T sit at x about 1/(alpha lam^2), lam = (1/2) log(T/2 pi): Carleson mass 1/(pi alpha lam) per unit height. A prime-side Carleson embedding is Montgomery-Vaughan (P27, P29); that it is the only one is not proved.',
  'CLASSICAL / ARGUED (audit of literature statements cited from memory); MEASURED', 'DH, HEAT, EA, NR (criterion holds)'),
 ('D4', 'Tensor-power squeeze (Landau lemma on Sym^m x Sym^m, Newton-Thorne)',
  'Carries an inequality to the abscissa of convergence, for local parameters: output is abs(alpha_p) = 1 (SIZE). Empty for zeta; kills E_a and NR at the holomorphy step; sign twists, THIN, U, WT pass every step; not formulable for DH. Zeros are local parameters only in function fields (section 3.7). Positivity form is P25 with Fejer\'s cap a_1 < 2 a_0.',
  'CLASSICAL', 'TW+-, THIN, U, WT, B'),
 ('D5', 'p-adic interpolation / Iwasawa module as operator',
  'The p-adic data for all p are functions of zeta(1 - k), k >= 1. The interpolation twin zeta + c L(s, chi_-4) L(s, chi_5) (ordinary Dirichlet series, same pole, finite order; no functional equation and no Euler product) has the same values at all non-positive integers and, for complex c, a zero at any prescribed s0 with L(s0, chi_-4) L(s0, chi_5) != 0 (c = 1: zero at 0.8641 + 29.9504i, measured). p-adic zeros are compared with complex zeros only in function fields (one polynomial). Device type: exact uniqueness, no inequality. The twin is a control of DH type for devices that read values; it says nothing about devices that use the functional equation (Hamburger uniqueness).',
  'PROVED (twin); MEASURED (zeros)', 'interpolation twin passes every step'),
 ('D6', 'Turan power sums',
  'Finite form: coefficient-blind lower bound with loss e^{-cn}, holds for every control. Limit form: Turan\'s equivalence \'zero-free strip iff power saving in tau for sum_{p ~ N} p^{i tau}, N >= tau^a\' is a theorem for zeta (CLASSICAL, cited from memory, not re-read); its extension to other Euler products was not checked (it needs continuation of finite order to the strip, which a general sign twist does not have). It restates the target as a prime-sum bound whose proof from integer sums is the rank-one bilinear obstruction (fam-vaughan-split-landau). Not of type \'one zero forces many\'.',
  'CLASSICAL (not re-read)', 'DH, TW+-, THIN, U, WT (finite form); limit form: for zeta only, other Euler products not checked'),
 ('D7', 'Strip Dirichlet-to-Neumann identity for the phase of S (annulus DtN node with the Klein phase certificate)',
  '-theta\'(y) = T_b(y) + zero sum - pole sum, all kernels positive; -theta\' is the Laguerre expression; T_b is computed on Re s = 1/2 + b >= 1 and T_b > 0 is proved for zeta only (for DH, which has zeros with Re s > 1, negativity of u on the edge is measured in the windows used). It is the Poisson-Jensen formula of the strip: residue device, exact, sign of the pole sum undetermined (S1); it holds for DH with its pole terms (measured). T_b is a fraction about 1/(b alpha lam^2) of the mean phase derivative (measured 0.74 to 0.10 for T = 10^2 to 10^5). The hypothesis of the Klein phase-transport certificate is the absence of nearby poles of S (P40, G13).',
  'PROVED identity; MEASURED', 'DH (identity holds); HEAT, EA, NR argued'),
]
sec = ['### 3.9 Device types closed in campaign round 5', '',
       'Seven device types tested by one lane as candidates for carrying an inequality across Re s = 1. Each is closed. Row texts are the lane\'s, with the six wording corrections of its referee applied (lane `c6-repair-referee-debts-r5`).', '',
       '| # | Route (lane) | Where it stops | Status | Defeated by | Source |', '|---|---|---|---|---|---|']
for rid, route, stops, status, defe in D:
    for cell in (route, stops, status, defe):
        assert '|' not in cell, rid
    sec.append('| %s | %s | %s | %s | %s | %s |' % (rid, route, stops, status, defe, SRC))
sec += ['']
old_count = 'Row count: P 42, G 25, Q 22, S 11, Z 21, F 8, T 3, L 5 = 137.'
assert t.count(old_count) == 1
# ---- 2. rows Z15b and Z22 after row Z21
m = re.search(r'^\| Z21 \|.*$', t, re.M)
assert m
z15b = ('| Z15b | Target reflection in the 7/8 system; re-expression of the probe | The reflection of the target variable is MS Prop. 5.1 (already used; it produces M + l <= 1 as "dual length <= number of rows"). '
        'The signal constant c is an invariant of the probe (Lemma U): two high comparisons of one J in the Prop. 2.1 format have the same c, so no identity (row functional equation, Voronoi, approximate functional equation, target functional equation under the integral) changes h; the same holds for a change of the probe below the comparison error, and for a change of slope outside one degenerate configuration (second referee). A probe changed by as much as the top size of the signal is a different probe and is not covered. '
        'Ledger with height w = 4 tau and side choice, source geometry: 13/15 at w = 0; reflected >= 13/15 + w/15; unreflected (MS Lemma 9.1, polar term kept) >= 1; empty dual >= 11/12; 5/6 floor of Z15 unchanged. s <-> 1-s cannot act on 1/L (Lemma V). '
        'Free geometry (first referee\'s correction): with the polar term b/12 kept, vertices with h > 1 occur only at lx < l with a hypothetical optimal unreflected sieve or with the K- and P-losses deleted, and those runs fall below 1/2 at the search bound (the reduced system is inconsistent there). With the polar term deleted (G = 0) they also occur for Lemma 9.1 as stated (1/3 at h = 4; 2/3 at h = 2 in geometry M >= 2l) and for the reflected branch with the K-loss alone deleted: 7/9 at (lx, ly, l) = (0, 5/3, 1/3), h = 4/3, not below 1/2. These are MODEL vertices with hypothetical deletions; no lemma supplying the deleted inputs is stated. '
        '| PROVED (Lemma U, two referees; scalar steps); EXACT LP on MODEL inputs (one referee; `tiers_fe2.py` not rerun after the correction); relative to the unrefereed manuscripts | THIN, sign twists: unreflected branch only, abscissa 1 with the polar term (5/6 in source and 1/3 in free geometry without it); DH and E_a paragraphs ARGUED; Lemma U holds for every target family admitted by Prop. 2.1 '
        '| `c5-target-fe-order2-ledger` (+ REFEREE.md, REFEREE2.md) |')
z22 = ('| Z22 | Order-2 rows from group families: angular characters lambda^(6k) of Q(sqrt(-3)), ring-class / anticyclotomic characters | The transform in the family variable is Fourier inversion on a compact group; its kernel depends only on the class of sc and contains no Gauss sum. Root number +1 (Hecke theta inversion for lambda^(6k); Froehlich-Queyrut 1973 Theorem 2, opened and read, for finite-order characters of a quadratic extension trivial on the ideles of the base field). mu is not absorbed: every row is a combination of Moebius sums of the family. Below K = Y^(1/2 - eps) the probe equals its k = 0 row for arbitrary coefficients; in the ray regime the on-ray sum carries the weight N(c*)^(-1/2) (c* = c without its rational part; first referee\'s correction) and is at most the Cauchy-Schwarz level; the Cauchy-Schwarz ledger gives abscissa >= 1 for all K, Y (log factor in the large-sieve line). The model ledger (1 + kappa)/2 contains its conclusion: a mean-square low estimate over a row set contains the pointwise Moebius bound for the target\'s row with the same exponent (positivity of a sum of squares; PROVED). The statement for an abstract family "whose epsilon factor is a character of the family parameter" (Theorem 7 (iv)) is ARGUED: its set of admissible derivations is not defined. Reading, not used in a proof: mu enters a family only through a nontrivial Jacobi-sum cocycle of the epsilon factor (order >= 3; Weil 1952 recalled, not opened). '
       '| PROVED for the two families (one referee; second pass on Lemma 2 and Theorem 7 (iv)); abstract row ARGUED | every identity and ledger line is coefficient-blind: THIN, TW+-, arbitrary bounded coefficients pass (measured by the referee); no control is separated '
       '| `c5-angular-family-absorption` (+ REFEREE.md, REFEREE2.md) |')
t = t[:m.end()] + '\n' + z15b + '\n' + z22 + t[m.end():]
edits += ['row Z15b', 'row Z22']
# ---- insert section 3.9 before the row-count line, and correct the count
ids = re.findall(r'^\| ([A-Z]{1,2})\d{1,2}[a-z]? \|', t, re.M)
cnt = {}
for i in ids:
    cnt[i] = cnt.get(i, 0) + 1
order = ['P', 'G', 'Q', 'S', 'Z', 'F', 'T', 'L']
assert set(cnt) == set(order), cnt
new_cnt = dict(cnt); new_cnt['D'] = 7
line = 'Row count (recounted 2026-11-18 by `c6-repair-referee-debts-r5`): ' + ', '.join('%s %d' % (k, new_cnt[k]) for k in order + ['D']) + ' = %d.' % sum(new_cnt.values())
rep(old_count, '\n'.join(sec) + '\n' + line, 'section 3.9 rows D1-D7; row count')
# ---- 3. P46 and entry 49: largest real zero; referee status; section reference
rep('hence a real zero b in (theta, 1) satisfies b(1 - b) <= 10 theta, and a chi with E(x) << x^eps for every eps > 0 has no real zero in (0, 1) (r(0) = 0 for the exponent-zero class; zeros near 1 for small theta > 0 are not excluded).',
    'hence the largest real zero b of F in (theta, 1) satisfies b(1 - b) <= 10 theta (nothing is proved for a smaller real zero below it), and a chi with E(x) << x^eps for every eps > 0 has no real zero in (0, 1) (r(0) = 0 for the exponent-zero class; zeros near 1 for small theta > 0 are not excluded).',
    'P46 largest real zero')
rep('Second check and a complement (`c5-repair-engine-map-r4`, author only):', 'Second check and a complement (`c5-repair-engine-map-r4`; author and two referee passes):', 'P46 referee count')
rep('Complement PROVED (author), numerically checked, unrefereed. Thin-twist exponents MEASURED',
    'Complement PROVED (author; REFEREE.md and REFEREE2.md of `c5-repair-engine-map-r4`), numerically checked on sign twists and two complex chi. Thin-twist exponents MEASURED', 'P46 status')
rep('| `c4-helson-discrepancy-zerofree`; `c5-repair-engine-map-r4` section 3 |', '| `c4-helson-discrepancy-zerofree`; `c5-repair-engine-map-r4` section 2.3 |', 'P46 source section')
rep('Corollary with entry 48: a real zero b of F in (theta, 1) has b(1 - b) <= 10 theta. `c5-repair-engine-map-r4` section 3, Theorem 2 (PROVED (author), checked numerically on three thin twists, unrefereed; no bearing on zeros of zeta).',
    'Corollary with entry 48: the largest real zero b of F in (theta, 1) has b(1 - b) <= 10 theta (a smaller real zero is not bounded by this argument). `c5-repair-engine-map-r4` section 2.3, Theorem 2 (PROVED: author and two referee passes; checked numerically on three thin sign twists and two complex chi; no bearing on zeros of zeta).',
    'section 4 entry 49')
# ---- 4. control THIN: short-interval input
rep('Status: PROVED-rel a short-interval prime theorem of Hoheisel type (eta > 0; eta = 0.475 with Baker-Harman-Pintz), **cited from memory** until `c5-thin-walk-replay` reports;',
    'Status: PROVED-rel a counting form of a short-interval prime theorem of Hoheisel type (eta > 0: Huxley\'s asymptotic, eta = 5/12 - eps, CLASSICAL; the existence statements of Huxley and Baker-Harman-Pintz confirmed in a secondary source; the Baker-Harman-Pintz counting constant, eta = 0.475, recalled). Ray-class variant over Q(sqrt(-3)) (`c5-thin-walk-replay` Theorem 2: regular in every ray class, twists by finite-order ray class characters continue to Re s > max(b - eta, b/3)): PROVED-rel Coleman 1990 (Proc. LMS (3) 61, 433-456) Theorem 2.1, exponent 19/24 + eps independent of the modulus (eta = 5/24 - eps), statement read through two secondary quotations (arXiv:2008.09677v2 p. 1; Harman-Kumchev-Lewis 2004 p. 2), primary text not opened (`c5-thin-walk-replay/REFEREE2.md`);',
    'control THIN status')
rep('Engine code: ctl-THIN (status conjectural until the short-interval input is re-read).',
    'Engine code: ctl-THIN (status proved-relative: the short-interval inputs are located as stated theorems, see the table row; the primary texts were not opened).',
    'THIN note')
# auxiliary control
rep('- Control THIN (`c4-thin-twist-control-78`, refereed once; table row above)',
    '- Interpolation twin (`c5-device-table-extension`, row D5): zeta + c L(s, chi_-4) L(s, chi_5) agrees with zeta at every non-positive integer and has a zero at a prescribed point; no Euler product, no functional equation. Auxiliary control for devices that read special values (p-adic interpolation, Iwasawa data). Engine code: ctrl-interpolation-twin.\n- Control THIN (`c4-thin-twist-control-78`, refereed once; table row above)',
    'interpolation twin note')
# ---- 5. header update line
anchor = '\n---\n\n## 1. Status in ten lines'
assert t.count(anchor) == 1
upd = ('\nUpdate 2026-11-18, fourth (`c6-repair-referee-debts-r5`): referee debts of campaign round 5. Added: section 3.9 (rows D1 to D7, the seven device types of `c5-device-table-extension` with its referee\'s six wording corrections), row Z15b (Lemma U with a second referee; corrected free-geometry statement), row Z22 (group families; Theorem 7 (iv) labelled ARGUED), the interpolation twin as an auxiliary control. Corrected: row P46 and section 4 entry 49 ("largest real zero"; Theorem 2 has two referee passes), control THIN (short-interval inputs located; ray-class variant relative to Coleman 1990 as quoted). Sources opened: Froehlich-Queyrut 1973 (page scans), arXiv:2008.09677v2, Harman-Kumchev-Lewis 2004. Not applied: rows for `c5-twisted-helson-arcs` (its proposed number P44 is taken), `c5-thin-propd-dichotomy`, `c5-marks-circularity-order2`; section 7 entries for round 5; update of Z15 and section 6 item 1 (waits for the manuscript check of Theorems B, C).\n')
t = t.replace(anchor, upd + anchor)
edits.append('header update line')
open(PATH, 'w', encoding='utf-8').write(t)
json.dump(dict(lines_before=n0, lines_after=t.count('\n'), edits=edits, row_count=new_cnt), open(os.path.join(HERE, 'map_edits.json'), 'w'), indent=1)
print(n0, '->', t.count('\n'), edits, new_cnt)
