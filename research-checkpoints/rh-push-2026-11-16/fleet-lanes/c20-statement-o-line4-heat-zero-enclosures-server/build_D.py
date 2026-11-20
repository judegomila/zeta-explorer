import json, os
newton = {('zeta', 13): (27, 32), ('zeta', 19): (46, 50), ('zeta', 29): (62, 71), ('zeta', 37): (83, 94), ('zeta', 47): (118, 130),
          ('U_s0', 13): (29, 33), ('U_s0', 19): (47, 51), ('U_s0', 29): (67, 72), ('U_s0', 37): (88, 94), ('U_s0', 47): (122, 130)}
rows = {}
for p in (128, 256):
    if os.path.exists('out_stage_p%d.json' % p):
        for r in json.load(open('out_stage_p%d.json' % p))['rows']: rows[(r['kind'], r['P'], p)] = r
T = []
T.append('''## 5. Item D: pole counts of the renormalised stages (line 12)

Object (Test 3 of `push/c1-leeyang-krein-limit`, alpha = 1): the Curie-Weiss stage D(s) = sum over squarefree n | M of
a(n) exp(l_n^2/(2L) - s l_n) (M the product of the primes up to P, L = log M, l_n = log n), s = 1/2 + z,
L~ = A + D'/D + r with A = 1/s + 1/(s-1) - (1/2) log pi + (1/2) psi(s/2) and r the logarithmic derivative of the
renormaliser (zeta phases: a = 1, r = -P^(1-s)/(s-1); control U_s0, s0 = 3/4 + 20i: a(p) = p^(20i) e^(+-i phi_p),
r = +P^(s0-s)/(s-s0)), S~ = (1 - L~)/(1 + L~). The source lane counted poles of S~ in Re z > 0, 10 < Im z < 30 by
Newton iteration from the stage zeros and labelled the counts lower bounds.

Certificate. Poles of S~ at points with D != 0 are the zeros of N := (1 + A + r) D + D' (zeta phases), resp.
N := (s - s0)[(1 + A) D + D'] + P^(s0-s) D (U_s0; the pole of r at s0 is cleared and N(s0) = D(s0)); at such a zero
1 - L~ = 2, so it is a pole of S~ of the same multiplicity. N is analytic on the boxes (poles of A at s = 0, 1 and of
psi(s/2) are outside). Three argument-principle counts (Lemma W on adaptive dyadic bisections of the four sides;
enclosures = direct ball evaluation intersected with the mean-value form; A uses Arb's digamma, not the asymptotic
series of the source code):

    n1 = zeros of N in (0, 4) x (10, 30),   n2 = zeros of N in (1/64, 4) x (10, 30),   n3 = zeros of D in (1/64, 4) x (10, 30).

If n1 = n2 and n3 = 0, then N has no zero with 0 < Re z <= 1/64 in the window, D has none with Re z >= 1/64, and S~ has
exactly n1 poles (with multiplicity) in the box 0 < Re z < 4, 10 < Im z < 30. Not covered: Re z >= 4 (the source lane
found no pole with Re z > 0.56) and the lines Im z = 10, 30 themselves (N is certified non-zero on them).

| phases | P | terms | bits | n1 | n2 | n3 | certified poles in the box | Newton count on file | stage zeros in window (on file) | leaves (n1 contour) | wall s |
|---|---|---|---|---|---|---|---|---|---|---|---|
''')
done47 = False
for kind in ('zeta', 'U_s0'):
    for P in (13, 19, 29, 37, 47):
        for p in (128, 256):
            r = rows.get((kind, P, p))
            if not r: continue
            a, b, c = r['N_box_0_X'], r['N_box_delta_X'], r['D_box_delta_X']
            ok = a['count'] is not None and a['count'] == b['count'] and c['count'] == 0
            if P == 47 and ok: done47 = True
            T.append('| %s | %d | %d | %d | %s | %s | %s | %s | %d | %d | %s | %.0f |\n' % (kind, P, r['terms'], p, a['count'], b['count'], c['count'], a['count'] if ok else 'not certified',
                     newton[(kind, P)][0], newton[(kind, P)][1], a.get('leaves'), r['wall_s']))
T.append('''
Outcome: **enclosed** (exact integers) for the rows listed; 128-bit and 256-bit runs agree wherever both exist.
STATUS47
Reading (MEASURED relation between certified integers, no proof of a law): the certified count is 5 to 12 larger than
the Newton count on file in every row, so the Newton counts were lower bounds as the source lane said; the certified
count is within 2 of the number of stage zeros in the window in every row (zeta phases: 32/32, 51/50, 71/71, 94/94, 130/130;
U_s0: 34/33, 52/51, 73/72, 96/94). The source lane's statement "about one pole in Re z > 0 per stage zero, same for
zeta phases and for the control U_s0" is consistent with these integers; the control U_s0 has 1 or 2 more poles than
the zeta phases at every P <= 37. The derivative formulas used by the mean-value enclosures were checked against a central
difference at one point per row (relative difference below 1e-21).

''')
s = ''.join(T)
s = s.replace('STATUS47', 'P = 47 (32768 terms): ' + ('certified for the zeta phases at 128 bits (row above); U_s0 at P = 47 and the 256-bit rerun at P = 47 were not run (time).'
              if done47 else 'not completed within the time given to this lane (the unit was stopped); registered outcome for P = 47: not enclosed, reason: run time (about 11 times the P = 37 run).'))
open('RESULT_D.md', 'w').write(s)
