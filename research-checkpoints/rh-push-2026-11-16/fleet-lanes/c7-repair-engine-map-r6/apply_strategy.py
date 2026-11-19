"""STRATEGY.md edits of lane c7-repair-engine-map-r6. Anchored edits with assertions; previous file before/STRATEGY.md."""
import os, re
HERE = os.path.dirname(os.path.abspath(__file__))
P = os.path.join(HERE, '..', '..', 'campaign', 'STRATEGY.md')
t = open(P, encoding='utf-8').read()
assert 'c7-repair-engine-map-r6' not in t
def rep(old, new):
    global t
    assert t.count(old) == 1, (old[:70], t.count(old))
    t = t.replace(old, new)
def append_line(start_regex, addition):
    global t
    ms = list(re.finditer(start_regex + r'.*$', t, re.M))
    assert len(ms) == 1, (start_regex, len(ms))
    m = ms[0]
    t = t[:m.end()] + ' ' + addition + t[m.end():]
# 1. stale line: leads never run
rep('Never run by this campaign: leads 7 and 8 (square realisation with a point-spectrum intertwiner; the box run; Lorentzian degree >= 3), lead 22 (quadratic positivity with automorphic companions; device node `map-open-9`, state open), lead 2',
    'Corrected after round 6 (`c7-repair-engine-map-r6`): the square realisation with a point-spectrum intertwiner (leads 7, 8) was not "never run": `res-point-spectrum-square` ran it before the campaign and `c6-square-intertwiner-weyl` added Theorem H2 and the Casimir class (map rows G27 to G30; closed for a fixed Hecke rule on a GL_2 cuspidal target and for the Casimir class; rank >= 2 compact-at-infinity squares without a Hecke rule stay open and carry no R1). Lead 22 was run in round 6 (`c6-quadratic-companion-positivity`, map row P50): device node `map-open-9` is closed for pointwise outputs; the density half was not run and MV-CAP applies to it. Never run by this campaign: the box run and Lorentzian degree >= 3 of leads 7 and 8, lead 2')
# 2. ORDER-2: normaliser requirement
append_line(r'^\*\*Missing lemma \(ORDER-2\)\.\*\*',
    '**Added requirement (round 6, `c6-marks-bc-manuscript-check` Lemma H, two referees; map row Z24): the normaliser H of the probe has no zeros in Re s > 1/2.** For the sextic rows of the manuscript H_eta contains L^S(6s - 3, (alpha eta)^6), with zeros in 7/12 <= Re s < 2/3, so hypothesis (2.2) fails below 7/12 and the unconditional conclusion of the format stops at abscissa 2/3 (admissible sigma_0 > 2/3; h = 2, effective order 3). A probe aimed at h = r/2 must have a zero-free normaliser on Re s > 1/2, or enlarge the family to contain the normaliser character and exclude common zeros.')
# 3. items 2, 3, 4 of section 4.0
append_line(r'^2\. Deepen: epsilon factor of a nonabelian order >= 3 family',
    'Obstruction recorded (round 6, `c6-gl3-cover-epsilon-cocycle`, map row Z23; the referee holds a narrower claim only): given the recalled Gelfand-Tsetlin recipe, in the local data of a double cover of any rank the quadratic symbol occurs only together with q^(-1/2), and quadratic twist families of any GL(n) form carry no Jacobi-type epsilon value, so no absorption of mu at shift 0 through local data. Not covered: global Whittaker constants of a genuine cusp form; chi(-1) = -1; sources not opened.')
append_line(r'^3\. Deepen: the false input in the region lx < l',
    'Obstruction recorded (round 6, `c6-unreflected-marks-kd23`; referee does not hold the headline, the measurement and two identities stand): unreflected theta rows show no (KD)^(2/3) term (random rows pass the same test, so flatness is not an arithmetic test); the dual coefficients are mu times a Hecke character, so the row norm K + D is itself a zero-free statement about the target family (argued). "No consistent vertex with h > 1" is not shown; vertices with 1 < h <= 3 are underived. Probes of higher degree in the target do not change the ledger (`c6-pair-probe-bridge-order2`, map row Z15c).')
append_line(r'^4\. Deepen: Theorems B and C of `c5-marks-circularity-order2` against the manuscript text',
    'Obstruction recorded (round 6, `c6-marks-bc-manuscript-check`, map rows Z24, Z26; Lemma H, Lemma S and Theorem B1\' checked by a second referee, `REFEREE2.md`): the reduced system omitted the normaliser; "low input equivalent to GRH" is replaced by the chain GRH => (N) => (R), with (R) => GRH open; the long-marks branch gives no input weaker than its conclusion.')
append_line(r'^Second lead, lower priority \(explore slot if no new device type is proposed\): lead 22',
    'Status after round 6: tested and closed for pointwise outputs (map row P50); no longer an open device type.')
# 4. change log
t = t.rstrip('\n') + '\n' + ('- 2026-11-18 (`c7-repair-engine-map-r6`, repair slot of round 7): section 3.1, the line "never run" for the square intertwiner lead and for lead 22 corrected '
    '(both were run; map rows G27 to G30 and P50). Section 4.0: obstructions recorded on items 2, 3, 4; requirement "normaliser has no zeros in Re s > 1/2" added to ORDER-2 (map row Z24, two referees). '
    'What is left under 4.0 is derivation work (round-6 lesson 1): the uncompensated high side from manuscript (12.5)/(16.1) with the normaliser kept, and the compensated principal signal below Re s = 3/5. '
    'Engine: `map-open-9` closed for pointwise outputs, `map-open-1` narrowed, three open device nodes added (`laurent-shell-gamma-section`, `ff-order2-vertex-probe`, `landau-siegel-2026-mechanism`). No allocation rule changed.\n')
open(P, 'w', encoding='utf-8').write(t)
print('STRATEGY.md edited')
