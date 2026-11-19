"""Builds STATEMENT_O_v3.md in this directory from push/c9-obstruction-record-statement/STATEMENT_O.md (read only;
copy of the source in before/STATEMENT_O.c9-2026-11-18.md). Changes: header paragraph and count; line 1, line 3,
line 5 blocks; section C rows 1b and 2a; one sentence of section D and one of section E. The replaced text is
kept verbatim in an appendix of the new file. Anchored edits with assertions. Run once."""
import os, re
HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, 'before', 'STATEMENT_O.c9-2026-11-18.md')
OUT = os.path.join(HERE, 'STATEMENT_O_v3.md')
t = open(SRC, encoding='utf-8').read()
live = open(os.path.join(HERE, '..', 'c9-obstruction-record-statement', 'STATEMENT_O.md'), encoding='utf-8').read()
assert t == live, 'c9 file changed since the copy'
kept = []


def block(title_re, next_re):
    m = re.search(title_re, t, re.M); n = re.search(next_re, t[m.end():], re.M)
    assert m and n
    return m.start(), m.end() + n.start()


def replace_block(title_re, next_re, new, name):
    global t
    a, b = block(title_re, next_re)
    kept.append((name, t[a:b].rstrip('\n')))
    t = t[:a] + new.rstrip('\n') + '\n\n' + t[b:]


def rep(old, new, name):
    global t
    assert t.count(old) == 1, (name, t.count(old))
    kept.append((name, old))
    t = t.replace(old, new)


# ------------------------------------------------------------------ header
old_title = '# Statement O: record of obstructions (lane A of the round-8 checkpoint)\n'
assert t.startswith(old_title)
t = ('# Statement O, version 3: record of obstructions\n\n'
     '**Version 3, 2026-11-19 (lane `c11-repair-del-referee-record`).** This file is\n'
     '`push/c9-obstruction-record-statement/STATEMENT_O.md` (state of 2026-11-18 22:22, after the second pass of\n'
     '`c10-repair-record-referee-r9`; unchanged copy in `before/STATEMENT_O.c9-2026-11-18.md`) with five changes:\n'
     '(1) line 3 repaired (two sentences, from E1 of `c10-repair-record-referee-r9/REFEREE.md`): the proved form is\n'
     'narrowed to the inputs {EP, POS, FE, finite order}, and the part that reads ZF(theta) is ARGUED;\n'
     '(2) line 1 rewritten with the control DEL_b (thin prime deletion) as the positivity-keeping member with a real\n'
     'zero in (1/2, 1); (3) line 5 rewritten with DEL_b in place of the Beurling source that was never opened;\n'
     '(4) section C rows 1b and 2a rewritten against DEL; (5) the control list, one sentence of section D and one of\n'
     'section E updated. Lines 2, 4, 6 to 12, section A and the rest of sections C to E are unchanged. The replaced\n'
     'text is kept verbatim in the appendix "Previous text" at the end. The c9 file itself was not edited.\n'
     'Basis for (2) to (4): Lemma 1 of `c10-thin-deletion-zero-mode-control` now has two referee files\n'
     '(`c10-thin-deletion-zero-mode-control/REFEREE.md` and `c11-repair-del-referee-record/REFEREE2.md`); it is proved\n'
     'relative to a short-interval prime theorem (Huxley 1972, asymptotic for theta > 7/12) whose statement was read\n'
     'in two secondary sources and whose primary text was not opened. The lane that wrote the second referee file\n'
     'also wrote this version; no reader stands between the two (the same reservation as E3 of the round-10 referee).\n'
     'The statements remain separate conditional statements, one per read class; there is no joint clause.\n\n'
     '---\n\n'
     '*Original header (c9 lane):* Statement O: record of obstructions (lane A of the round-8 checkpoint)\n') + t[len(old_title):]

rep('- Control codes are those of map section 2: DH, HEAT, TW+, TW-, EA (E_a), NR (T-NR twin), B (Beurling), WT, THIN,\n'
    '  U, the Liouville twist, the interpolation twin, cluster lifts.',
    '- Control codes are those of map section 2: DH, HEAT, TW+, TW-, EA (E_a), NR (T-NR twin), B (Beurling; a literature\n'
    '  pointer, used by no line of version 3), WT, THIN, DEL (thin prime deletion; lines 1 and 5), U, the Liouville\n'
    '  twist, the interpolation twin, cluster lifts.', 'control list (conventions)')

rep('Count after the second pass (lane `c10-repair-record-referee-r9`, 2026-11-19; file `c10-repair-record-referee-r9/REFEREE2.md`, one section per line):\n'
    '12 lines; PROVED 4 (lines 3, 6, 8, 9, each an elementary construction, in the narrowed form of its label field);\n'
    'MEASURED 1 (line 2); ARGUED 7 (lines 1, 4, 5, 7, 10, 11, 12), each labelled "relative to" its source. Count at\n'
    'first writing: PROVED 0, ARGUED 9, MEASURED 3.',
    'Count in version 3 (2026-11-19): 12 lines; PROVED 4 (lines 3, 6, 8, 9, each an elementary construction, in the\n'
    'narrowed form of its label field; line 3 for the inputs {EP, POS, FE, finite order} only); PROVED relative to a\n'
    'cited theorem 1 (line 5: two referee files on the closing step, conditional on Huxley 1972, primary text not\n'
    'opened); MEASURED 1 (line 2); ARGUED 6 (lines 1, 4, 7, 10, 11, 12), each labelled "relative to" its source.\n'
    'Count after the second pass of `c10-repair-record-referee-r9` (file `c10-repair-record-referee-r9/REFEREE2.md`):\n'
    'PROVED 4, MEASURED 1, ARGUED 7, with line 3 not confirmed as then written. Count at first writing: PROVED 0,\n'
    'ARGUED 9, MEASURED 3.', 'count paragraph (header)')

# ------------------------------------------------------------------ line 1
LINE1 = '''### Line 1. Size, positivity or support of Lambda

*(Version 3: the zero-mode members are restated with DEL_b; B is removed from the line. Items (a) to (d) of the
step field are unchanged.)*

- **Read class.** R = {POS or SIZE0 or SUPP, any linear functional of Lambda, optionally EP, INT, a simple pole at
  1, continuation to a half-plane Re s > sigma_1 with sigma_1 < 1}; FE optional for the step mode only. Linear
  positivity arguments and primes-only quadratic forms belong here.
- **Controls and construction.** TW+: Lambda -> eps_n Lambda, 0 <= eps_n <= 1. TW-: the same with abs(eps_n) <= 1.
  Exact member of TW-: the Liouville twist sum lambda(n) n^-s = zeta(2s)/zeta(s). Member of TW- with a zero in the
  open right half of the strip: THIN (line 7). Member of TW+ with a zero there: **DEL_b**
  (`c10-thin-deletion-zero-mode-control`, Lemma 1): S a set of primes with
  pi_S(x) = int_2^x t^(b-1) dt/log t + D(x), -C x^(b-eta) <= D(x) <= 0 (greedy floor rule; density one), eps = 0 on
  powers of primes of S and 1 on the other prime powers, F(s) = prod over p not in S of (1 - p^-s)^-1 =
  zeta(s)(s - b) W(s) with W analytic and non-vanishing on Re s > max(b - eta, b/2). E_a (line 3) is a further
  member with POS and FE; it lacks SIZE.
- **Step at which the control satisfies the class.** (a) P23 (`twist-rigidity`, T1 to T4): the character-family
  identity holds with Lambda replaced by any function on prime powers; non-negative weights annihilate prime terms
  up to e^T only at total weight >= 1 + floor(T/log 2). (b) P9 (`screw-canonical`): the admissible window of one
  coefficient w_2 at T = 2 lies within [-2.5e-26, +5.8e-29], so the positivity is not stable under moving one
  coefficient; TW+ and TW- fail the positivity, which is therefore not a consequence of POS, SIZE0 or SUPP. (c) P6
  (Theorem R, `pick-induction`, refereed in `r2-pick-euler-entry` for eta supported on n >= 2): for real eta != 0
  the perturbed function has a non-positive-semidefinite finite Pick matrix on every interval; no property stable
  under Lambda -> Lambda + eta implies all-order positivity. (d) Map section 2, Q3: three results (Theorem R;
  `g-channel-geometry` Thm C; `sq-causal-cascade` Thm 3) give "positivity, size and support of Lambda with the
  functional equation do not suffice". (e) DEL_b: Lambda_F equals Lambda on powers of primes outside S and 0 on
  powers of primes of S, so POS, SIZE0 (abs(Lambda_F(n)) <= log n, pole at 1 only), SUPP, EP and INT hold by
  construction; continuation and the zero come from sum over p in S of p^-s = E_1((s - b) log 2) + A(s) with A
  analytic on Re s > b - eta.
- **Mode and floor.** (S) for TW+ and TW- as classes (the map notes that a finite sign twist passes "no zeros in a
  region" conclusions trivially). (Z) through named members, as separate statements:
  (Z-1) A device whose read set lies inside {POS, SUPP, SIZE0, EP, INT, simple pole at 1, continuation} is
  defeated by DEL_b: simple zero at any real b in (1/2, 1). Floor: nothing below 1. Relative to Huxley 1972.
  (Z-2) A device whose read set lies inside {SUPP, SIZE0, EP, GEOM, INT, pole, continuation} is defeated by THIN:
  simple zero at any real b in (1/2, 1), and at b + i tau after the twist n^(-i tau) (which moves the pole).
  Floor: nothing below 1. Relative to the same theorem.
  (Z-3) A device whose read set lies inside {EP, POS, FE} is defeated by E_a (line 3).
  Limits of (Z-1): the zero of DEL_b is real; a zero of the deleted factor G = prod over p in S of (1 - p^-s) on
  Re s = b at height tau != 0 comes with a real zero of G at b of at least the same order (Lemma C of the lane),
  so DEL does not supply an isolated non-real zero with POS; F = zeta G also vanishes at any zero of zeta, about
  which the lemma says nothing. Density one half in the rule gives a branch point of order two at b, not a zero.
  Not covered by (Z-1) and (Z-2) together: a read set containing both POS and GEOM at every rational prime (among
  degree-one Euler products that set contains zeta only, Lemma I of the lane: Lambda_F(p) = a(p) log p >= 0 and
  abs(a(p)) = 1 give a(p) = 1; this is an identification, mode (I), not a floor), and read sets using local
  parameters with 0 < abs(a(p)) < 1.
  The Liouville twist has zeros at rho/2, in Re s < 1/2: it defeats only conclusions of the form "all zeros in the
  open strip lie on Re s = 1/2" (re-run: abs(F) = 3.0e-41 at 1/4 + 7.06736257087i, `recheck_controls.json`).
- **Numerical record for DEL_b.** The location of the zero is exact by the lemma; finite data do not enclose it
  (every finite truncation of the product is positive at b). Lane: sets built to 1e7 in ball arithmetic at
  b = 0.75, 0.9; unconditional lower bounds W(b) >= 1.87837 and 1.53707 (from D <= 0); upper ends relative to
  Trudgian 2016 Theorem 2 as printed (not confirmed by either referee). First referee: b = 0.8. Second referee:
  b = 0.6 and 0.85 to 2e7 (`c11-repair-del-referee-record/ref2_del.json`): exponent of G at b equal to 1.0000 at
  density one and 0.5 at density one half in both the X-direction and the s-direction; G(2) = 0.93121 and 0.91503,
  so the function is neither zero nor zeta.
- **Map rows.** P9, P23, P6; section 2 rows TW+, TW-, DEL, Q3.
- **Lanes and referee count.** `screw-canonical` 1 ref; `twist-rigidity` 1 ref; `r2-pick-euler-entry` 1 ref;
  `pick-induction` 0 ref; `g-channel-geometry` 1 ref; `sq-causal-cascade` 0 ref;
  `c10-thin-deletion-zero-mode-control` 1 ref file in its directory and a second in
  `c11-repair-del-referee-record/REFEREE2.md`.
- **Label.** ARGUED, relative to `screw-canonical` (P9) and `twist-rigidity` (P23), one referee each, for the step
  mode. Statement (Z-1): two referee files cover the closing step (membership of DEL_b and its zero), relative to
  Huxley 1972 (asymptotic pi(x) - pi(x - x^theta) ~ x^theta/log x for theta > 7/12; statement read in two
  secondary sources, primary text not opened). Statement (Z-2): as line 7. Statement (Z-3): as line 3. The
  Liouville twist and E_a were re-run by REFEREE.md and by `c10-repair-record-referee-r9/REFEREE2.md` (section 1).
- **Owed.** The primary text of one short-interval theorem (shared with lines 5 and 7). A second pass on P9 or P23
  for the step mode. `sq-causal-cascade` Thm 3 has no referee, so read item (d) as two refereed results and one
  unrefereed.
'''
replace_block(r'^### Line 1\. ', r'^### Line 2\. ', LINE1, 'line 1 (whole block)')

# ------------------------------------------------------------------ line 3 (two-sentence repair, in place)
rep('- **Label.** PROVED under the label rule (elementary; closing step covered by REFEREE.md sections 1, 2 and\n'
    '  `c10-repair-record-referee-r9/REFEREE2.md` section 3). By A3 and A4 the lemma closes with membership of E_a in the\n'
    '  read class and one zero right of 1/2; the sentence "every inequality built from these inputs holds for E_a" (Z16,\n'
    '  lane `bootstrap`, no referee) is then a consequence of A3 and is not needed as a source.',
    '- **Label.** PROVED under the label rule for the read set {EP, POS, FE (degree 2, gamma factor\n'
    '  Gamma((s+a)/2) Gamma((s-a)/2)), finite order} (elementary; closing step covered by REFEREE.md sections 1, 2 and\n'
    '  `c10-repair-record-referee-r9/REFEREE2.md` section 3): E_a has these inputs and vanishes on Re s = 1/2 + a.\n'
    '  **Repair (version 3; E1 of `c10-repair-record-referee-r9/REFEREE.md`).** The input ZF(theta) is not part of the\n'
    '  proved form: with Theta the supremum of the real parts of the zeros of zeta, E_a satisfies ZF(theta) exactly for\n'
    '  theta >= Theta + a, so membership of E_a in the class with theta = 1/2 + a is equivalent to RH and is not\n'
    '  claimed. For a device that also reads ZF(theta) the floor max(Theta, 1/2 + theta - Theta) (equal to theta if\n'
    '  and only if Theta = 1/2), the sentence "the bootstrap map is f(theta) = theta" and the sentence "every inequality\n'
    '  built from these inputs holds for E_a" are ARGUED, relative to lane `bootstrap` (Z16, no referee).\n'
    '  "Growth: inherited from zeta" reads: polynomial growth in vertical strips with exponents twice those of zeta; a\n'
    '  device that reads zeta\'s own convexity exponent is outside the class. E_a has poles at 1 + a and 1 - a and\n'
    '  abscissa of convergence 1 + a, consistent with "without SIZE" (A1 puts "pole at 1 only" inside SIZE).',
    'line 3, label field (first part)')
rep('- **Read class.** R = {EP, POS, FE, explicit formula, ZF(theta) as hypothesis, growth in vertical strips}; SIZE\n'
    '  and GEOM not read.',
    '- **Read class.** Proved form: R = {EP, POS, FE, finite order (explicit formula, polynomial growth in vertical\n'
    '  strips)}; SIZE and GEOM not read. Argued extension: the same with ZF(theta) as a hypothesis (see the label\n'
    '  field).', 'line 3, read class')
rep('  (re-run at a = 0.2, gamma_1: abs = 9.3e-42). Floor: a device reading only R outputs nothing below 1/2 + a for\n'
    '  each a < 1/2, hence nothing below 1.',
    '  (re-run at a = 0.2, gamma_1: abs = 9.3e-42). Floor: a device reading only the proved form of R outputs nothing\n'
    '  below 1/2 + a for each a < 1/2, hence nothing below 1.', 'line 3, floor sentence')
rep('- **Owed.** None for the closing step. Both passes are internal.\n\n### Line 4.',
    '- **Owed.** None for the closing step in the proved form. A referee on lane `bootstrap` for the ZF(theta) part.\n'
    '  Both passes are internal.\n\n### Line 4.', 'line 3, owed')

# ------------------------------------------------------------------ line 5
LINE5 = '''### Line 5. Euler product + Lambda >= 0 + pole, without the functional equation

*(Version 3: control DEL_b in place of the Beurling source. The title drops "or the integers": the control is an
ordinary Dirichlet series over the integers. Text after the lane's draft, with the corrections of both referees.)*

- **Read class.** R = {EP, POS, SUPP, SIZE0, simple pole at 1, continuation to Re s > sigma_1 for some
  sigma_1 < 1, INT (optional), GEOM at the primes of the system (optional)}. Not read: FE; PER; GEOM at every
  rational prime; the value of the residue at 1.
- **Control and construction.** DEL_b (`c10-thin-deletion-zero-mode-control`, Lemma 1), read in two ways.
  (i) As an ordinary Dirichlet series over the integers: coefficients a(n) = 1 if n has no prime factor in S and 0
  otherwise, completely multiplicative; INT holds; the local parameter is 1 at primes outside S and 0 at primes of
  S. (ii) As a Beurling system: generalised primes = the primes outside S, generalised integers = the integers with
  no prime factor in S, counting function G(1) x + O(x^(b+eps)) with G(1) = prod over p in S of (1 - 1/p) > 0; its
  zeta function is F, with unimodular local parameter at each generalised prime.
  In both readings: Lambda_F >= 0, a simple pole at 1, continuation to Re s > max(b - eta, b/2), and a simple zero
  at the real point b, for any prescribed b in (1/2, 1); right of b the zeros of F are exactly those of zeta.
  The literature control B (map section 2 row B, "literature; not re-read") is not used by this line.
  DEL does not reproduce two things attributed to that literature: a counting function with error exponent below
  the real part of the zero (here: exponent b + eps only), and zeros at non-zero height that are not zeros of zeta.
- **Step at which the control satisfies the class.** EP, POS, SUPP, SIZE0 and the pole hold by construction.
  Continuation and the zero: P_S(s) = E_1((s - b) log 2) + A(s), A analytic on Re s > b - eta (Lemma 0: the
  discrepancy D satisfies -C x^(b-eta) <= D <= 0; the lower bound uses the dyadic split of the first referee);
  G = (s - b) W with W = log 2 e^gamma exp(-Ein((s - b) log 2) - A + T) non-vanishing; zeta(b) is finite and
  non-zero. P46 (`c4-helson-discrepancy-zerofree`, Theorem 1) in the transferred form: F/zeta = exp(-(P_S - T)),
  and P_S - T has non-negative coefficients; Landau's theorem gives abscissa b. P25: 3-4-1 positivity with
  translates holds (POS). P36 is not cited for DEL in this version: the DEL lane says the Legendre-LP dual inputs
  hold (Lambda_F >= 0, over the integers); the row-by-row re-read of `c11-del-device-read-confirm` (author's check
  only) says the separating step of P36 is a logarithmic counting discrepancy that is not shown for DEL. Undecided.
  The read set must not contain the residue normalisation "residue 1 at s = 1" (equivalently sum_{n<=Y} a(n) =
  Y + o(Y)): for a completely multiplicative a with abs(a(p)) <= 1 and a(p_0) != 1 at one prime,
  abs(F(s))/zeta(s) <= (1 - p_0^-s)/abs(1 - a(p_0) p_0^-s) < 1 on real s > 1, so limsup (s - 1) abs(F(s)) < 1;
  residue 1 identifies zeta (Lemma J of `c11-del-device-read-confirm`; the one-line proof is checked here). DEL
  has residue G(1) < 1.
- **Mode and floor.** (Z): a device whose read set lies inside R is defeated by DEL_b. Floor: nothing below 1
  from R alone, for real zeros. For zeros at non-zero height the control gives only the zeros of zeta (Lemma C of
  the lane concerns the deleted factor). Relative to S(theta): there are theta < 1 and c > 0 with
  pi(y + y^theta) - pi(y) >= c y^theta/log y for y >= y_0; source Huxley 1972 (asymptotic
  pi(x) - pi(x - x^theta) ~ x^theta/log x for theta > 7/12), statement read in two secondary sources (the article
  "Prime gap" of Wikipedia, by the lane; the introduction of arXiv:2308.04458v8, by the second referee), primary
  text not opened. Without that theorem, and relative to the classical prime number theorem only, the weaker
  statement "G(s)/(s - b) tends to a non-zero limit as s -> b from the right" stands (second referee, C4, argued).
- **Map rows.** P46, P25; section 2 row DEL (row B stays in the map as a literature pointer). P36 was cited by
  the previous text for B and is not cited here.
- **Lanes and referee count.** `c10-thin-deletion-zero-mode-control` 1 ref file in its directory, second pass in
  `c11-repair-del-referee-record/REFEREE2.md` (re-derivation of Lemma 0, Lemma 1 and the tail bounds; new cases
  b = 0.6, 0.85); `c4-helson-discrepancy-zerofree` 1 ref; second derivation of Theorem 1 and the complement
  Theorem 2 in `c5-repair-engine-map-r4` 2 ref files; `e1-cofinal-legendre-dual` 1 ref; `sym-power-positivity`
  1 ref.
- **Label.** PROVED relative to Huxley 1972 (two referee files cover the closing step: membership of DEL_b in R
  and the simple zero at b; the cited theorem is classical and its primary text was not opened, so the label is
  not PROVED outright). The cell for P25 is ARGUED from the read set; the cell for P36 is undecided.
- **Owed.** The primary text of one short-interval theorem (shared with lines 1 and 7). A reader between the
  second referee file and this version. The debt "open the Beurling source" is removed from this line; it returns
  only if a control with POS and a zero at non-zero height off zeta's set, or with counting error below the zero,
  is wanted.
'''
replace_block(r'^### Line 5\. ', r'^### Line 6\. ', LINE5, 'line 5 (whole block)')

# ------------------------------------------------------------------ section C rows 1b, 2a
rep('| 1b | the coefficients at all primes jointly through that relation, not their sizes, signs or support | TW+, TW- (step); THIN, E_a, B (zero) | (S), (Z) | 1 | P9, P23, P6 |',
    '| 1b | (version 3) for a device whose read set lies inside {POS, SIZE0, SUPP, EP, INT, pole at 1, continuation}: nothing below 1. For a device whose read set lies inside {SIZE0, SUPP, EP, GEOM, INT, pole, continuation}: nothing below 1. Two separate statements; a read set with POS and GEOM together is addressed by neither (Lemma I: zeta only, an identification) | TW+, TW- (step); DEL (zero; first statement); THIN (zero; second statement); E_a (zero; read set {EP, POS, FE}) | (S), (Z) | 1 | P9, P23, P6; control row DEL |',
    'section C, row 1b')
rep('| 2a | the functional equation or an equivalent global symmetry (the integers) | B (no FE, no integers); THIN, U (no FE) | (Z) | 5, 7 | P46, P36, P51 |',
    '| 2a | (version 3) the functional equation, or periodicity of the coefficients, or both POS and GEOM at every rational prime, or the residue normalisation at 1: a device that reads none of these and stays inside the class of line 5 or of line 7 outputs nothing below 1. "The integers" is dropped from the item: DEL and THIN are ordinary Dirichlet series, so INT does not separate them from zeta, and no control lacking INT is on file as opened | DEL (no FE, no PER; has POS and INT; local parameter 0 on S); THIN, U (no FE, no PER; have GEOM; lack POS) | (Z) | 5, 7 | P46, P51; control row DEL (P36, cited by the previous text for B, is not cited for DEL; `c11-del-device-read-confirm` proposes to cite it in row 3 for E_a: not applied, that lane has no independent referee) |',
    'section C, row 2a')

# ------------------------------------------------------------------ section E sentence
rep('- Mode (Z) of lines 5, 7 and 10 is relative to inputs not on file (Beurling literature; short-interval theorem;\n'
    '  hypothesis H_W).',
    '- Mode (Z) of lines 5, 7 and 10 and of statement (Z-1) of line 1 is relative to inputs not on file (a\n'
    '  short-interval prime theorem for lines 1, 5 and 7, primary text not opened; hypothesis H_W for line 10). The\n'
    '  Beurling literature is no longer an input of any line.', 'section E, last item')
rep('`c10-repair-record-referee-r9/REFEREE2.md`). Also Z15b (Lemma U)',
    '`c10-repair-record-referee-r9/REFEREE2.md`), line 3 only in the form {EP, POS, FE, finite order}; (5) Lemma 1 of\n'
    'the DEL lane (lines 1 and 5), relative to Huxley 1972 (`c10-thin-deletion-zero-mode-control/REFEREE.md`,\n'
    '`c11-repair-del-referee-record/REFEREE2.md`). Also Z15b (Lemma U)', 'section D, list of sub-statements with two files')

# ------------------------------------------------------------------ appendix with the previous text
app = ['\n---\n\n## Appendix. Previous text (replaced in version 3; verbatim from the c9 file of 2026-11-18 22:22)\n']
for name, old in kept:
    app.append('\n### Previous: %s\n\n' % name + '\n'.join('> ' + l if l else '>' for l in old.split('\n')) + '\n')
t = t.rstrip('\n') + '\n' + ''.join(app)
assert 'joint clause' in t or 'not a joint clause' in t
open(OUT, 'w', encoding='utf-8').write(t)
print('written', OUT, 'lines', t.count('\n'), 'replaced items', len(kept))
for name, _ in kept:
    print(' -', name)
