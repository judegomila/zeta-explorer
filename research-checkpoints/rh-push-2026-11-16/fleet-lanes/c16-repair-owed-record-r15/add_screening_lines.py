#!/usr/bin/env python3
"""Item 6: one lanes.jsonl line per screening lane push/s1-* (referees = 0, no refereeHolds field, so the scoreboard
counts the lane as run and not as refereed). Writes screening_lines.jsonl next to itself; with --append, appends
the lines whose slug is not yet in campaign/lanes.jsonl."""
import os, sys, json
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.normpath(os.path.join(HERE, '..', '..'))
LANES = os.path.join(ROOT, 'campaign', 'lanes.jsonl')
C = {
 's1-antibridge-cutoff-energy': 'Four combinations (antibridge x certificate / de-branges / theta / heat-flow), no survivor. Each statistic is a weighted average, a pointwise value or a boundary limit of W = Re(F\' conj F), or a quadratic form over right-half-plane zeros of F + alpha F\'; a negative value occurs only inside the half-disk of an off-line zero, and every control failed exactly there (lane text, MEASURED).',
 's1-kernel-shear-norms': 'Four combinations screened (Volterra shear norm, thin truncated Hankel norm, saddle, capture), survivors 0 (lane text, MEASURED; float64 or ball arithmetic without enclosed truncation tails).',
 's1-prime-tents-controls': 'Four prime-tent combinations against the controls, zero survivors: sign twist, THIN, DEL cannot violate the tent inequalities (Lemma 1 of the lane); T-NR violates from small N (lane text; MEASURED, float accumulation; one definition reconstructed).',
 's1-prime-torus-orbit': 'Four torus combinations, 0 survivors: each test separates zeta from a control only where the prime cutoff exceeds the height, through coefficient size right of 1, through a count of on-line zeros, or at the level "not an Euler product" (lane text; MEASURED float64, rechecked at 40 digits).',
 's1-primon-kinetic-truncation': 'Four finite-prime combinations, 0 survivors: each statistic is, after its main term, the explicit-formula sum over zeros at cutoff P; controls separate through the pole or the missing functional equation, or through the term of an off-line zero; T-NR identical to zeta in tests 1 and 4 (lane text; MEASURED).',
 's1-scattering-one-line': 'Four combinations on the scattering coefficient, 0 survivors: every separation is a property of the coefficients alone (Bohr torus law), the argument principle on the window, or a mean value (lane text; MEASURED float64, GPU values a screen).',
 's1-shift-field-spectra': 'Four shift-field combinations, no survivor: mollified means, window variance, sign of W = Re(F\' conj F), interlacing failures; failures of controls start at their first off-line zero (lane text; MEASURED, ball arithmetic for the first sign changes).',
 's1-zero-flow-dynamics': 'Four zero-flow combinations, survivors 0: each test is a statistic of the list of on-line ordinates, and T-NR with c > 2 has the same list as zeta (proved in the lane, one line), so no test of this form can fail T-NR (lane text; MEASURED float64).',
 's1-zero-statistics-gram': 'Four combinations, no survivor: the small-gap exponent of on-line zeros separates DH, backward-heat lists and mixtures of L(chi), L(chibar) from zeta without a counting function, but is identical for zeta and T-NR and blind to a small heat step (lane text; MEASURED).',
 's1-klein-annulus-energy': 'No RESULT.md in the lane directory on 2026-11-19 (code, data, logs and tables only): the lane has not reported; nothing is claimed from it.',
}
out = []
for slug in sorted(C):
    d = os.path.join(ROOT, 'push', slug)
    assert os.path.isdir(d), slug
    has = os.path.exists(os.path.join(d, 'RESULT.md'))
    assert not os.path.exists(os.path.join(d, 'REFEREE.md')), slug
    out.append(dict(round=15, slug=slug, kind='screen', verdict='dead' if has else 'not-reported',
                    claim='No statement about zeros of zeta. Screening arm (parallel workflow of 2026-11-19), not a campaign lane of round 15. ' + C[slug] + ' No REFEREE.md: the statements are the lane\'s own and are not entered in the map.',
                    aboutZeros=False, referees=0, r1=False, r2=False, r3=False, r4=False, score=0,
                    file=os.path.join(d, 'RESULT.md') if has else d, heavy=False, restatement=False, knownArchitecture=False,
                    brokenProved=0, lemmasDecided=0, nodes=[], tags=['screen'], screening=True, resultFile=has,
                    enteredBy='c16-repair-owed-record-r15', owed='independent referee before any statement is entered in the map'))
open(os.path.join(HERE, 'screening_lines.jsonl'), 'w').write(''.join(json.dumps(x) + '\n' for x in out))
print('screening lines: %d (%d with RESULT.md)' % (len(out), sum(x['resultFile'] for x in out)))
if '--append' in sys.argv:
    have = {json.loads(l)['slug'] for l in open(LANES) if l.strip()}
    new = [x for x in out if x['slug'] not in have]
    with open(LANES, 'a') as f:
        f.write(''.join(json.dumps(x) + '\n' for x in new))
    print('appended %d lines; lanes.jsonl now has %d lines' % (len(new), sum(1 for l in open(LANES) if l.strip())))
