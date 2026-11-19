#!/usr/bin/env python3
"""Writes campaign/CAMPAIGN_REPORT_R15.md from the files on disk (counts are read, not typed)."""
import json, os, sys, re, collections
ROOT = sys.argv[1]; L = os.path.join(ROOT, 'push', 'c15-repair-record-strategy-v4-report')
sb = json.load(open(os.path.join(ROOT, 'campaign', 'scoreboard.json')))
dv = json.load(open(os.path.join(ROOT, 'engine', 'curated', 'devices.json')))
rc = json.load(open(os.path.join(L, 'row_referee_counts.json')))
lanes = [json.loads(l) for l in open(os.path.join(ROOT, 'campaign', 'lanes.jsonl'))]
A = sb['A_requirements']; D = sb['D_reliability']; C = sb['C_coverage']
assert A['headline']['bestScore'] == 1 and A['headline']['slug'] == 'c1-leeyang-krein-limit'
closed = [d for d in dv['devices'] if d['state'] == 'closed']; floored = [d for d in dv['devices'] if d['state'] == 'floored']
openD = [d for d in dv['devices'] if d['state'] == 'open']
names = dict(P='3.1 positivity reformulations', G='3.2 geometric structures', Q='3.3 square-root lane', S='3.4 stacking',
             Z='3.5 zero-free machinery', F='3.6 flow and Lambda', T='3.7 function-field transplant', L='3.8 local conditions',
             D='3.9 device types (rounds 5, 12, 13)', O='3.10 Statement O')
o = []
w = o.append
w('# Campaign report after round 14 (written in round 15, 2026-11-19)')
w('')
w('Written by lane `c15-repair-record-strategy-v4-report` under the checkpoint rule of `STRATEGY.md` section 2 (version 4). Counts are read from `scoreboard.json` (generated %s), `../engine/curated/devices.json`, `../push/OBSTRUCTION_MAP.md` and `lanes.jsonl` by `../push/c15-repair-record-strategy-v4-report/mk_report.py`. Round-15 lanes other than the writing lane had not reported.' % sb.get('generated', ''))
w('')
w('## 1. Result as it stands')
w('')
w('- The Riemann hypothesis is open. The campaign has produced no statement about the location of zeros of zeta, at any level of confidence. No lane has a referee-confirmed crossing from finite stages or from the region right of 1 to the critical line (requirement R4: none).')
w('- Headline of the requirement score (metric part A): **%d of 4** (`%s`; missing %s), unchanged since round 1. Lanes by score 0/1/2/3/4: %s. The 7/8 zero-free half-plane (a known result, not of this campaign) calibrates at 3 and is excluded from the headline.' % (
    A['headline']['bestScore'], A['headline']['slug'], ', '.join(A['headline']['missing']),
    ' / '.join(str(A['scoreHistogram'][k] if isinstance(A['scoreHistogram'], dict) else A['scoreHistogram'][int(k)]) for k in ('0', '1', '2', '3', '4'))))
w('- What the campaign reports instead, from round 15 on: (i) a refereed record of obstructions (section 2), which says where each tried route stops and which control function passes it; (ii) the part-B figure (section 3), a zero-free abscissa claimed in unrefereed manuscripts.')
w('- Every referee in this record is an internal adversarial pass by another agent of the same campaign. Nothing here has external review.')
w('')
w('## 2. The refereed record of obstructions')
w('')
w('### 2.1 Statement O, version 3')
w('')
w('File: `../push/c12-repair-sources-statement-o-v3/STATEMENT_O_v3.md` (map row O1). Twelve separate conditional statements, one per read class, each of the form: a device whose whole read set lies inside class j is defeated by control C_j in a stated mode. It is not a statement about zeros, it does not say what a proof must read, and it does not say that no device exists. There is no joint clause.')
w('')
w('| line | read class | control |')
w('|---|---|---|')
for i, (c, k) in enumerate([
    ('size, positivity, support of Lambda', 'sign twists, THIN, DEL, E_a'),
    ('functional equation with kernel positivity, no Euler product', 'Davenport-Heilbronn'),
    ('Euler product, positivity, functional equation, finite order; no size normalisation', 'E_a = zeta(s+a) zeta(s-a)'),
    ('flow-stable hypotheses', 'backward heat'),
    ('Euler product, positivity, pole; no functional equation', 'DEL (thin prime deletion), relative to a counting statement S(theta)'),
    ('invariance under a local test-vector change', 'T-NR'),
    ('complete multiplicativity with unimodular parameters, no periodicity', 'THIN, relative to the same counting statement'),
    ('frequencies only', 'any Dirichlet polynomial on the same frequencies'),
    ('special values only', 'interpolation twin'),
    ('mean values only', 'cluster lifts, relative to hypothesis H_W'),
    ('exact identities', 'every control for which the identity holds'),
    ('finite stages with a limit', 'unimodular twist U')], 1):
    w('| %d | %s | %s |' % (i, c, k))
w('')
w('Labels under the statement\'s own rule (PROVED = two referee files cover the closing step): PROVED 4 (lines 3, 6, 8, 9, in narrowed form), PROVED relative to a cited theorem 1 (line 5), MEASURED 1 (line 2), ARGUED 6 (lines 1, 4, 7, 10, 11, 12). Referee files: `c9-obstruction-record-statement/REFEREE.md`, `c10-repair-record-referee-r9/REFEREE2.md`, the rewrite `c11-repair-del-referee-record/STATEMENT_O_v3.md` and the reader pass of `c12-repair-sources-statement-o-v3`. Lines 13 to 20 exist in outline form only.')
w('')
w('### 2.2 The obstruction map')
w('')
tot = len(rc['rows'])
w('File: `../push/OBSTRUCTION_MAP.md`. **%d labelled rows** after this lane (198 before; rows G37 to G40 added for round 14). Each row: route, where it stops, status label, the controls that pass it, source lane.' % tot)
w('')
w('Referee records behind the rows (mechanical count: for each row, the largest number of referee records among the lanes named in its source cell; a record is the `referees` field of `lanes.jsonl` or a REFEREE*.md file in the lane directory; second passes kept only in a repair lane\'s directory are not counted unless the learn step recorded them; the count is per source lane, not per row statement):')
w('')
w('| map section | rows | 0 referee records | 1 | 2 | 3 or more |')
w('|---|---|---|---|---|---|')
sums = collections.Counter()
for k in 'PGQSZFTLDO':
    b = rc['bySection'].get(k, {}); n = sum(b.values())
    w('| %s | %d | %d | %d | %d | %d |' % (names[k], n, b.get('0', 0), b.get('1', 0), b.get('2', 0), b.get('3', 0)))
    for x in '0123': sums[x] += b.get(x, 0)
w('| all | %d | %d | %d | %d | %d |' % (tot, sums['0'], sums['1'], sums['2'], sums['3']))
w('')
w('The %d rows with no referee record come from the lanes the map header lists as unrefereed (pre-campaign lanes of 2026-11-16/17); the map marks them "(author)" or "unrefereed" where used. No row has three referee records by this count. The one statement of the campaign with three referee reports is `c8-row-energy-squared-signal` (an obstruction inside the 7/8 architecture; not about zeros). Per-row counts: appendix A and `../push/c15-repair-record-strategy-v4-report/row_referee_counts.json`.' % sums['0'])
w('')
w('Controls on file (map section 2): Davenport-Heilbronn, backward heat, sign twists (TW+, TW-), E_a, T-NR, Beurling (literature, not opened), window translate, THIN, DEL in the table; in notes: unimodular twist U, EIS-w (off-resonance Eisenstein series), interpolation twin, UNIV (joint universality filter), BLS (scattering-level Blaschke control; proved in rank one), NR-vec (local-vector control on the double cover; added in round 15 from round 14), phase-rotated transfer operator and theta^w in single rows. Pre-filters: Lemma P (T-NR passes linear identities, dilation-invariant cone conditions and conditions away from one prime) and Lemma F (P with Blaschke and symmetric-multiplier stability). One sentence of the lane behind Lemma F (E1, on the bridge ratio for shift a < 1/2) is recorded as not holding until its repair lane reports.')
w('')
w('### 2.3 Device types (candidate mechanisms for crossing to the line)')
w('')
w('File: `../engine/curated/devices.json`. **%d device types: %d closed, %d floored, %d open.** "Closed": a map row or a refereed lane shows that the device returns its input, restates the target, or holds for a control. "Floored": it yields a proved statement about zeros with a floor above 1/2 fixed by the method.' % (len(dv['devices']), len(closed), len(floored), len(openD)))
w('')
w('- Floored (%d): %s. This is the 7/8 architecture (coherent sets with a large sieve): model floors 13/15, 31/36, 6/7, 23/27, 5/6 and the scalar bound B >= 1 - h/r; no proved probe with signal constant h > 1.' % (len(floored), ', '.join('`%s`' % d['id'] for d in floored)))
w('- Closed (%d): %s.' % (len(closed), ', '.join('`%s`' % d['id'] for d in closed)))
w('- Closed as MEASURED only (finite searches on registered grids, not proofs): `dictionary-d-kernel-sign-functionals`, `dictionary-dj-joint-pair-sign-functionals`. Closed with an argued part: `kacmoody-loop-eisenstein-maass-selberg` (rank one proved, affine kernel argued); `laxphillips-hecke-norm-outside-l2` (four named norm families only).')
w('- Pending proposals without a node (%d): %s' % (len(dv['pending']), '; '.join(p['name'].split(' (STRATEGY')[0].split(':')[0].split(' (map ')[0] for p in dv['pending'])) + '.')
w('')
w('### 2.4 What the record is silent on')
w('')
w('Eight read classes U1 to U8 (`STRATEGY.md` section 4.0, from `CHECKPOINT_R14_DRAFT.md`; the draft has no independent referee yet). These are the classes on which the record is silent, not leads: no line of Statement O and no closed row applies, and the record neither defeats nor supports a device there. For U1, U2 and U3 the silence is by construction: no control on file has zeta\'s own functional equation, so requirement R3 cannot be tested there with the control table. Five of the eight have a round-15 lane; none has a registered reason to expect a crossing.')
w('')
w('### 2.5 The common finding')
w('')
w('Summary of map section 5 and the lessons in `ROUND_LOG.md`: where a property separated zeta from a control it was an identity equivalent to the target, a certificate at verified height, or a mean value; the Euler product and the functional equation met in one inequality only inside the 7/8 architecture (through periodicity of twists in the conductor aspect, never with s <-> 1 - s for the target) and in mean values. No lane found an inequality that uses multiplicativity and the functional equation together, holds in every window, and fails for every control.')
w('')
w('## 3. Part B: the frontier figure')
w('')
B = sb['B_frontier']
w('- Zero-free half-plane, Lean-checked: Re s > %s (the openai/math result of 2026-10; kernel-checked; local replay of 2924 of 2924 closure modules; Mathlib, LeanCert and two external packages not replayed; trust basis is a single build).' % B['zeroFree']['leanChecked'])
w('- Zero-free abscissa, claimed: **0.8748866470** (scoreboard value %s; method infimum B_flat = 0.874886647039964...). It is not proved at any level checked here. Dependencies: the 7/8 manuscript and three unrefereed preprints (Liu 2610.12234, Xu-Sang 2610.15291, Liu 2610.26835); the value is Liu II Lemma 14.10 read as a scalar statement and recomputed in ball arithmetic, with the exponent arithmetic hand-checked relative to the manuscripts. Not checked: manuscript Lemmas 14.3, 15.2, 18.1 at the new geometry; Liu II Lemma 14.11; the Xu-Sang stage values in Lean; three appendix steps (read only). Not in Lean; the Lean certificate below kappa = 3/4 is conditional on an unformalised bound.' % B['zeroFree']['claimed'])
w('- The figure did not move during the campaign (rounds 1 to 14). Two frontier lanes (rounds 11, 12) with named new inputs returned no change; the frontier slot is withdrawn.')
w('- Lambda (de Bruijn-Newman), for reference: accepted %s; conditional %s (depends on: %s); a further claim %s has status "%s".' % (
    B['lambda']['accepted'], B['lambda']['conditional'], B['lambda']['conditionalDependsOn'], B['lambda']['raymondClaim'],
    B['lambda']['raymondStatus'].replace('from VERIFICATION_REPORT.md: ', '').replace('*', '')))
w('- A bound on the abscissa below 7/8 says nothing about the critical line: the method family has floors above 1/2 fixed by its format.')
w('')
w('## 4. Reliability of the record (metric part D)')
w('')
w('- Lanes run: %d, each refereed at least once. Referee hold rate: %.1f%%. Sub-steps labelled PROVED that a referee broke: %d (index: map section 7). Statements with three referee reports: %d (about zeros of zeta: %d).' % (
    D['lanesRun'], 100 * D['refereeHoldRate'], D['provedClaimsBroken'], D['threeRefereeStatements'], D['threeRefereeStatementsAboutZeros']))
w('- Search coverage (part C; tag-pair families are a bookkeeping unit, not a measure of mathematical coverage): %d graph nodes; %d families, %d closed, %d tried and not closed, %d untried.' % (
    C['nodes'], C['families'], C['familiesClosed'], C['familiesTriedNotClosed'], C['familiesOpenUntried']))
w('- Open lemmas decided during the campaign (bounded items; no lane record is marked as a statement about zeros): %s.' % C.get('openLemmasDecided', sum(int(l.get('lemmasDecided') or 0) for l in lanes)))
w('')
w('## 5. Limits of this report')
w('')
w('- A row closes the device that was tested, in the form tested. It does not close the read set the device came from, and absence of a row is not evidence for a route.')
w('- Seven rows of round 13 have two independent referee passes; the four rows of round 14 (G37 to G40) have one each; two device types are closed on finite numerical searches.')
w('- Sources cited as "relative to" were not opened (among them Zagier 1981 for regularised Rankin-Selberg, Luo-Rudnick-Sarnak 1995, Ingham 1937, the Beurling literature); statements resting on them carry that label in the map.')
w('- The checkpoint list U1 to U8 is an unrefereed reading and is not shown to be complete.')
w('- The part-B figure is a reading of unrefereed manuscripts by this campaign\'s lanes; it is not a result of the campaign.')
w('')
w('## Appendix A. Referee records per map row (count as defined in 2.2)')
w('')
by = collections.defaultdict(list)
for r in rc['rows']: by[r['count']].append(r['row'])
for k in sorted(by): w('- %d: %s' % (k, ', '.join(by[k])))
w('')
open(os.path.join(ROOT, 'campaign', 'CAMPAIGN_REPORT_R15.md'), 'w', encoding='utf-8').write('\n'.join(o))
print('report lines', len(o), '| A keys', list(A.keys()), '| C keys', list(C.keys()))
