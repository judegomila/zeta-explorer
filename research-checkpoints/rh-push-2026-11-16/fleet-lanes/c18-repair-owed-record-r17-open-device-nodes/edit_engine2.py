#!/usr/bin/env python3
"""Follow-up to edit_engine.py (same lane, same day). While this lane ran, lane c18-exact-relation-rigidity-klein-spinor
filed a RESULT.md (0 referees) reporting that the exact-relation branch closes for the relation 'multiplicativity'.
The device type stays 'open' until a referee holds (practice of the record lanes: a state changes on a referee file);
its status line and evidence now say what is on file."""
import os
HERE = os.path.dirname(os.path.abspath(__file__))
p = os.path.normpath(os.path.join(HERE, '..', '..', 'engine', 'curated', 'mk_devices.py'))
s = open(p, encoding='utf-8').read()
jobs = [
 (" 'exact-relation-rigidity': dict(\n  status='proposed, untested',",
  " 'exact-relation-rigidity': dict(\n  status='proposed, untested by a refereed lane; one unrefereed lane (c18-exact-relation-rigidity-klein-spinor) reports the branch closed for the relation multiplicativity',"),
 ("No relation is on file; no lane has passed stage A; lane c18-exact-relation-rigidity-klein-spinor had not reported when this entry was written.",
  "No relation is on file; no lane has passed stage A. Lane push/c18-exact-relation-rigidity-klein-spinor reported while this entry was written (author only, 0 referees; verdict precise obstruction): with R = multiplicativity the branch closes; multiplicativity is independent of every clause of Hamburger and of Theorem P (twins TN1 with the functional equation deleted, NR-q and Proposition W with integrality or support deleted, new control HQ2 = zeta(s)(1 + eps u^2/(1 - u)^4), u = q^(1/2 - s), with the pole clause deleted: exact functional equation, integer frequencies, multiplicative coefficients >= 1, zeros at distance eps^(1/4)/(sqrt 2 log q) from the line, quadruple poles on the line). If a referee holds this, the next record lane sets the type to closed (HQ2 becomes a control that must fail for any exact relation); until then the state is open and the type is not to be used as a lead."),
]
for a, b in jobs:
    assert s.count(a) == 1, (a[:60], s.count(a)); s = s.replace(a, b)
open(p, 'w', encoding='utf-8').write(s); print('patched mk_devices.py', len(jobs))
