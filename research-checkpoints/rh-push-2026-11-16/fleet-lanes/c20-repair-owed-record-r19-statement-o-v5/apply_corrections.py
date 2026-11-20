#!/usr/bin/env python3
"""Correction notes owed from round 19 (lane c20-repair-owed-record-r19-statement-o-v5).
(a) E1 of the referee of c19-u4-joint-prime-phase-quadratic-dp-zeros (the Liouville twist fails the cross-prime
    candidate (J) at p q^2 for P > 12): notes in its RESULT.md at every place the referee names, the lane's own
    lanes.jsonl line, and the claim field of its line in campaign/lanes.jsonl.
(b) Lemma P of c19-rs-real-zero-completion-band-server as repaired by its referee (E1): notes in its RESULT.md.
In RESULT.md files the original sentence stays and a bracketed note follows it. Previous files: before/lanefiles/,
before/lanes.jsonl. Each anchor must match exactly once."""
import os, json
HERE = os.path.dirname(os.path.abspath(__file__))
PUSH = os.path.normpath(os.path.join(HERE, '..'))
CAMP = os.path.normpath(os.path.join(HERE, '..', '..', 'campaign'))
ME = 'c20-repair-owed-record-r19-statement-o-v5'
TAG = '[Correction entered 2026-11-20 by lane ' + ME
U4 = 'c19-u4-joint-prime-phase-quadratic-dp-zeros'
RS = 'c19-rs-real-zero-completion-band-server'
E1 = (", from REFEREE.md E1: the Liouville twist does not pass step (2) of candidate (J). For a completely multiplicative eps, Lambda_eps(p^k) = eps(p)^k log p, so for Liouville the cross product Lambda(p^j) Lambda(q^k) = (-1)^(j+k) log p log q "
      "is negative whenever j + k is odd. First failing atom n = 12 = 3 * 4: mu_cross(12) = 2 Lambda(3) Lambda(4) = -2 log 2 log 3 = -1.523; also 18, 20, 28 for P up to 30 (recomputed by the referee). The lane's check used P = 10, where the only cross atom is 6 = p q. "
      "Liouville passes step (2) only for P <= 12 and fails at p q^2 for larger P; among sign chains only eps = +1 passes at every P. ")
jobs = {
 U4 + '/RESULT.md': [
  ("transfer theorem and a blindness statement. Flags: R1 = R2 = R3 = R4 = false.\n",
   "\n" + TAG + E1 + "Read 'E_a and DEL' in place of 'E_a, DEL and the Liouville twist' in the verdict. The stage-A stop and the verdict (precise obstruction) are unchanged: E_a and DEL pass every step carried out and HQ2 passes at each P. "
   "The member with all atoms in phase with the opposite sign is 1/zeta (Lambda = -Lambda_zeta; no functional equation of zeta's type; poles in the strip), a weaker control. Map row G45.]\n"),
  ("   (c > 2) or q p (c < -2); **E_a, DEL and the Liouville twist pass every step.** Stop.\n",
   "   " + TAG + ", REFEREE.md E1: sentence to use: 'Stage A: sign chains fail at a cross atom p q; the Liouville twist at p q^2 (P > 12); T-NR at q^2 p (c > 2) or q p (c < -2); E_a and DEL pass every step. Stop.']\n"),
  ("  does not use the sign at one prime: among sign chains exactly eps = +1 and eps = -1 (Liouville) pass.\n",
   "  " + TAG + ", REFEREE.md E1: false for eps = -1. The products at prime powers carry the sign (-1)^(j+k); among sign chains only eps = +1 passes at every P, and Liouville passes only for P <= 12. The step still does not read the sign at one prime in isolation: the opposite-sign member that passes is 1/zeta.]\n"),
  ("**Liouville (S = all primes) passes (1) to (3)**; lacks the functional equation |",
   "**Liouville (S = all primes) passes (1) to (3)**; lacks the functional equation " + TAG + ", REFEREE.md E1: false as written; Liouville fails (2) at the cross atom p q^2, first at n = 12 (coefficient -2 log 2 log 3), and passes (1) to (3) only for P <= 12] |"),
  ("below P/2 fail at p q; zeta passes) and it would not bear on E_a or DEL.\n",
   "\n" + TAG + ", REFEREE.md E1: in the paragraph above read 'E_a and DEL pass every step that is carried out' (Liouville fails at p q^2 for P > 12), and 'the read set of (J) is contained in all atoms of Lambda in phase' in the sense all >= 0 or all <= 0 over the primes that occur; Liouville is not in that set. "
   "The outcome of the server test that was not run is fixed by the sign tables with this correction: Liouville fails once P > 12.]\n"),
  ("- **R3 false.** E_a, DEL, Liouville pass every step carried out; HQ2 passes at each P; ZQ, DH, HEAT fail at\n  support, not at a cross-prime relation.\n",
   "  " + TAG + ", REFEREE.md E1: read 'E_a and DEL pass every step carried out'. R3 stays false.]\n"),
  ("of D_P at P = t^theta without the functional equation at height t.\"\n",
   "\n" + TAG + ", REFEREE.md E1, E3 to E5: the row is entered in `push/OBSTRUCTION_MAP.md` as G45 in the corrected form: 'sign chains fail at p q, the Liouville twist at p q^2 (P > 12), T-NR at q^2 p or q p; E_a and DEL pass; HQ2 passes at each P'; Lemma Q2 as a limit over heights with simple zeros assumed, CLASSICAL in content "
   "(second-derivative explicit formula of D_P), K1 as Bohr equivalence; the closing sentence limited to the pure cross form (J) and to sign conditions on atoms of Lambda_k; one referee.]\n"),
 ],
 RS + '/RESULT.md': [
  ("rho is concave for large x (vartheta''' < 0), so rho - rho_J >= 0 on J and sigma >= 0 for every point set G.\n",
   "\n" + TAG + ", from REFEREE.md E1: the last clause is false. On J the difference rho - rho_J is non-negative, but outside J the measure sigma has density rho(x) = (Re psi(1/4 + ix/2) - log pi)/(2 pi), which is negative near the origin: rho(0) = -0.8550, rho(3) = -0.118, rho(6) = -0.0075, "
   "sign change at abs(x) = 6.2898, negative mass 2.2479 (referee, mpmath). sigma is a signed measure for every point set G.]\n"),
  ("(ii) and (iii) are linearity. QED.\n",
   "\n" + TAG + ", from REFEREE.md E1: Lemma P as stated (hypothesis sigma >= 0) is correct, and it is the trivial direction of Bochner's theorem. Its hypothesis is not met by the constructed sigma, so T_sigma is not non-negative on H^1_0(I): for U = 10, h(s) = sin(pi s/10), "
   "int abs(g)^2 rho dx = -22.76 against norm(h)^2 = 5, hence <h, T_sigma(10) h> < -4.5 norm(h)^2 (the known negativity of the archimedean term at low frequency). **Repaired statement (Lemma P').** For the constructed sigma and every h, "
   "<h, T_sigma(U) h> >= -2.248 sup over abs(x) <= 6.29 of abs(g(x))^2. On m Fourier modes centred at t_w one has abs(g)^2 <= 4 m norm(c)^2/(t_w - span)^2 and norm(h)^2 = u norm(c)^2, so T_sigma >= -2.248 * 4m/(u t_w^2), "
   "which is 3e-10 in absolute value (3e-11 Lg) at t_w = 1e6 with m = 384 and smaller at 1e9 and 1e12. Parts (ii) and (iii) and every tolerance derived from them carry the same correction term: N(theta) holds on these mode spaces with tolerance -lambda_min(E) + 3e-11 Lg. "
   "The runs do not rely on the lemma for this: lambda_min(T_sigma) is enclosed per cell at or above 2.4e-6, 2.3e-3, 4.5e-3 Lg at the three heights with the exact digamma multiplier. No measured number and no control verdict changes. "
   "The statement holds on the mode spaces m = 96, 192, 384 centred at t_w, not on every band. Map row P58, round-19 addendum.]\n"),
 ],
}
for rel, edits in jobs.items():
    p = os.path.join(PUSH, rel); s = open(p, encoding='utf-8').read()
    assert TAG not in s, 'already applied: ' + rel
    for a, note in edits:
        assert s.count(a) == 1, (rel, a[:60], s.count(a))
        s = s.replace(a, (a[:-2] + ' ' + note[len(a[:-2]) + 1:]) if note.startswith(a[:-2]) else a + note)
    open(p, 'w', encoding='utf-8').write(s); print('patched', rel, len(edits))

# line-anchored notes in the RS result (long single-line paragraphs)
p = os.path.join(PUSH, RS, 'RESULT.md'); L = open(p, encoding='utf-8').read().split('\n')
def after_line(prefix, note):
    idx = [k for k, l in enumerate(L) if l.startswith(prefix)]
    assert len(idx) == 1, (prefix, len(idx))
    L.insert(idx[0] + 1, note)
after_line("1. Object. The additive reflected atoms of the c18 Form C are replaced by a measure that is positive by construction:",
           "   " + TAG + ", from REFEREE.md E1: 'positive by construction' and 'Lemma P (PROVED): T_sigma >= 0 on every band' are false in this generality (the Arch density is negative for abs(x) < 6.29; sigma is signed). "
           "Sentence to use: 'Lemma P holds under sigma >= 0; for the constructed sigma, T_sigma >= -3e-11 Lg on the mode spaces m = 96, 192, 384 centred at t_w (and is enclosed non-negative per cell), not on every band.' The repaired statement is in the note after Lemma P in section 2.]")
after_line("4. Where the positivity of the completion comes from. sigma is positive for every point set;",
           "   " + TAG + ", from REFEREE.md E1: 'sigma is positive for every point set' is false (signed measure); the sentence holds for the part of sigma on J and, on the mode spaces used, up to the term 3e-11 Lg.]")
after_line("Proposed map text (addendum to rows Q30 and P45;",
           TAG + ", from REFEREE.md E1 to E4: the text is entered as the round-19 addendum of map row P58 (the row of the band device) with the referee's corrections: Lemma P in the repaired form; 'medians 1.3 to 2.1, cells 0.7 to 3.3' for the scaled defect (E2); "
           "the ZQ obstruction stated as 'at tolerance tau Lg an off-line pair with (u eta)^2 below about 6 tau Lg/u is not excluded', with the height dependence of the eta = 0.01 row (E3); 422 of 432 brackets certified (E4).]")
open(p, 'w', encoding='utf-8').write('\n'.join(L)); print('patched', RS + '/RESULT.md', 'three line-anchored notes')

# lanes lines
NEW = "sign chains fail at pq, the Liouville twist at p q^2 (P > 12; referee E1: the lane had it passing), T-NR at q^2 p or qp; E_a and DEL pass every step"
p = os.path.join(PUSH, U4, 'lanes.jsonl'); raw = open(p, encoding='utf-8').read(); rows = [l for l in raw.split('\n') if l.strip()]
assert len(rows) == 1
d = json.loads(rows[0]); old = "sign chains fail at pq, T-NR at q^2 p or qp; E_a, DEL, Liouville pass every step"
assert d['claim'].count(old) == 1
d['claimAsFiled'] = d['claim']; d['claim'] = d['claim'].replace(old, NEW)
d['correction'] = 'E1 of REFEREE.md entered 2026-11-20 by ' + ME + ': Liouville fails candidate (J) at the cross atom p q^2, first at n = 12, and passes only for P <= 12. The filed claim is kept in claimAsFiled.'
open(p, 'w', encoding='utf-8').write(json.dumps(d, ensure_ascii=False) + '\n'); print('patched', U4 + '/lanes.jsonl')

p = os.path.join(CAMP, 'lanes.jsonl'); raw = open(p, encoding='utf-8').read(); rows = raw.split('\n')
idx = [k for k, l in enumerate(rows) if l.strip() and json.loads(l).get('slug') == U4]
assert len(idx) == 1, idx
d = json.loads(rows[idx[0]]); old2 = "sign chains fail at pq, T-NR at q^2 p or qp; E_a, DEL, Liouville pass every step"
assert d['claim'].count(old2) == 1 and d['claim'].endswith('Unrefereed.') and d['laneClaim'].count(old2) == 1
before = dict(d)
d['claim'] = d['claim'].replace(old2, NEW)[:-len('Unrefereed.')] + 'One referee: does not hold as worded, holds after E1 (applied in this field 2026-11-20 by ' + ME + '; laneClaim keeps the lane\'s text).'
changed = [k for k in d if d[k] != before.get(k)]
assert changed == ['claim'], changed
rows[idx[0]] = json.dumps(d, ensure_ascii=False)
open(p, 'w', encoding='utf-8').write('\n'.join(rows)); print('patched campaign/lanes.jsonl line', idx[0] + 1, 'field claim only; lines', len([r for r in rows if r.strip()]))
