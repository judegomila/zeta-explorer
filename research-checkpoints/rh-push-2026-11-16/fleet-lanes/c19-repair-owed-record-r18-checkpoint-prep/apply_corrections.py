#!/usr/bin/env python3
"""Correction notes owed from round 18, entered in three lane files (lane c19-repair-owed-record-r18-checkpoint-prep).
The original sentence stays; a bracketed note follows it. Previous files: before/lanefiles/. Each anchor matches once."""
import os
HERE = os.path.dirname(os.path.abspath(__file__))
PUSH = os.path.normpath(os.path.join(HERE, '..'))
TAG = '[Correction entered 2026-11-20 by lane c19-repair-owed-record-r18-checkpoint-prep'
jobs = {
 'c18-tz-one-sided-bound-fe-reserve-bridge/RESULT.md': [
  ("    <h, kappa_beta h> = int int conj(h(s)) h(s') e^((beta - 1/2) abs(s - s')) ds ds'      (real coefficients; zeros in conjugate pairs).      (A)\n",
   "\n" + TAG + ", from REFEREE.md E1: the term log abs(a_P) in display (A) is spurious. Corrected display: -2 Re <h, A_P h> = -u norm(h)^2 + sum over zeros beta of D_P of <h, kappa_beta h>, for every a_P != 0, with truncation tail (u - 2 log abs(a_P))/(pi T). Hand check: D = 1 + a 2^(-s), P = 2, has left side 0 and zero sum u norm(h)^2. With the printed constant the identity fails by exactly log abs(a_P) on series with a_P != 1 (referee table: 1.0986, 1.3863, 0.6931, 0.6931). The verdict item 1, the claim line and the proposed map row already carry the constant -u. For the Davenport-Heilbronn series a_n = 0 at multiples of 5, so P must not be a multiple of 5. Map row P58.]\n"),
  ("where c_0 is absorbed in the term log abs(a_P) of (A) (c_0 = 0 for a_P = 1).\n",
   "\n" + TAG + ", from REFEREE.md E1: there is no c_0. D_P'/D_P(s) = -(log P)/2 + lim sum over abs(Im beta) < T of 1/(s - beta) for every a_P != 0; the sentence 'c_0 is absorbed in the term log abs(a_P)' is deleted.]\n"),
 ],
 'c18-exact-relation-rigidity-klein-spinor/RESULT.md': [
  ("the failure sets of INT and MULT are not open in the topology in which zeros move continuously.\n",
   "\n" + TAG + ", from REFEREE.md E1: part (c) has a gap as written. The three witnesses are taken 'on a rectangle'; convergence on one rectangle is not convergence in T_strip, and the exhaustion argument needs f non-vanishing on all of 1/2 < Re s < 1, which for f = 2 zeta is RH and for the Davenport-Heilbronn function is false. Repair: use targets non-vanishing on the whole half-strip and outside the hold set, for example f(s) = 1 + 2^-s/4 + 3^-s/4 (abs(f - 1) < 1/2; a(6) = 0 != a(2) a(3)) for MULT and f = 2 for a(1). Statement 6 of the verdict then reads: (a), (b) PROVED; non-closedness of the hold sets of INT and MULT in T_strip is CLASSICAL on the right half-strip after the repair, and OPEN inside the functional-equation class (part (d)). The verdict uses (a), (b) and Proposition F only and is unchanged. Map row X1.]\n"),
 ],
 'c18-d10-inertia-law-theorem-t-lemma-d/RESULT.md': [
  ("The model inertia law is stated here for even numbers of real zeros only.\n",
   "\n" + TAG + ", from REFEREE.md E-1: the preceding paragraph is wrong as stated. For odd degree g(-u)/g(u) is minus the Blaschke product Theta of the round-17 lane, so b = (u - 1) g is the model of M_0 (-Theta); the model of M_0 Theta for an odd number of real zeros is b = u (u - 1) g. With b = u (u - 1) g the exact inertia is (2, 1) for a real zero at a = 3/4, 11/20, 9/10 (1 negative square) and (1, 2) at a = 1/4 (2 negative squares), with or without a quartet ((16, 1) and (15, 2) with the quartet (1/4, 2)): the round-17 measured law, parity clause included, in the cases tested. The growth with degree quoted above is a property of M_0 (-Theta). The rows of table 3.5 for a single real zero (8 of 75 configurations) and the control row E1 are computations for -Theta. Even-degree statements are unaffected. Map row D10, round-18 addendum.]\n"),
  ("- c17 inertia law: the parity clause should be restricted to the zeta-base measurement; in the model it fails in that form.\n",
   TAG + ", from REFEREE.md E-1: this note is withdrawn. With the model b = u (u - 1) g for an odd number of real zeros the rational model reproduces the parity clause in the cases tested; see the note in section 3.]\n"),
 ],
}
for rel, edits in jobs.items():
    p = os.path.join(PUSH, rel); s = open(p, encoding='utf-8').read()
    assert TAG not in s, 'already applied: ' + rel
    for a, note in edits:
        assert s.count(a) == 1, (rel, a[:60], s.count(a))
        s = s.replace(a, a + note)
    open(p, 'w', encoding='utf-8').write(s); print('patched', rel, len(edits))
