"""Second pass of the map edits of c11-repair-del-referee-record (same day): the DEL row's device-read sentence is
updated with the row-by-row re-read of the sibling lane c11-del-device-read-confirm, which reported while this lane ran."""
import os
HERE = os.path.dirname(os.path.abspath(__file__))
PATH = os.path.join(HERE, '..', 'OBSTRUCTION_MAP.md')
t = open(PATH, encoding='utf-8').read()
old = ("DEL passes 14 of the 34 device types and does not "
       "pass 20, whose read sets are the functional equation at all heights, periodicity with unimodular parameters at every "
       "rational prime, an attached object, or finite-order positivity with zeta's archimedean side.")
new = ("DEL passes 14 of the 34 device types and does not "
       "pass 20, whose read sets are the functional equation at all heights, periodicity with unimodular parameters at every "
       "rational prime, an attached object, or finite-order positivity with zeta's archimedean side. A row-by-row re-read "
       "(`c11-del-device-read-confirm`, author's check only, no independent referee) changes three cells and gives 11 "
       "(6 in full, 5 in part) against 23; it adds that a read set containing the residue normalisation at 1 is an "
       "identification (a completely multiplicative a with abs(a(p)) <= 1 and residue 1 is zeta).")
assert t.count(old) == 1
open(PATH, 'w', encoding='utf-8').write(t.replace(old, new))
print('applied')
