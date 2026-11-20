#!/usr/bin/env python3
"""Text edits of lane c16-repair-owed-record-r15 outside the map and the engine. Each file is rebuilt from its copy in
before/ (so the script can be rerun); every anchor must occur exactly once. No sentence is replaced silently: each
change carries a dated marker, and replaced sentences are quoted in a note."""
import os, json
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.normpath(os.path.join(HERE, '..', '..'))
TAG = '2026-11-19, `c16-repair-owed-record-r15`'
done = {}

class F:
    def __init__(self, before, live):
        self.live = os.path.join(ROOT, live); self.t = open(os.path.join(HERE, 'before', before), encoding='utf-8').read(); self.n = 0; self.name = live
    def repl(self, a, b):
        assert self.t.count(a) == 1, (self.name, self.t.count(a), a[:70]); self.t = self.t.replace(a, b); self.n += 1
    def after(self, a, add): self.repl(a, a + add)
    def line_append(self, prefix, add):
        ls = self.t.split('\n'); hit = [i for i, l in enumerate(ls) if l.startswith(prefix)]
        assert len(hit) == 1, (self.name, len(hit), prefix); ls[hit[0]] += add; self.t = '\n'.join(ls); self.n += 1
    def save(self):
        open(self.live, 'w', encoding='utf-8').write(self.t); done[self.name] = self.n

# ---------------------------------------------------------------- item 4a: pole clause of Lemma L, lane 2 of round 15
f = F('c15-control/RESULT.md', 'push/c15-control-with-zeta-fe-classes-u1-u2/RESULT.md')
C = '[correction ' + TAG + ', after REFEREE.md E1: '
f.after("The headline does not move. Labels: PROVED (elementary, in this file), CLASSICAL (cited as recalled),\nRELATIVE (to a source opened by another lane), MEASURED (mpmath, 30 digits, this lane), ARGUED, OPEN.\n",
        "\n**Correction note (" + TAG + ").** The independent referee (REFEREE.md, E1) found that the pole clause of Lemma L (\"no pole other than s = 1\") had been dropped in three places: table row F2, section 3 consequence (a), section 6 U2 POS branch. The clause is restored in those three places, each marked in square brackets; the text as filed is in `push/c16-repair-owed-record-r15/before/c15-control/RESULT.md`. Counterexample of the referee without the clause: G_+ = zeta m_+ with double real poles at 1/2 +- b, zeta's functional equation, exact atoms, Lambda_G >= Lambda >= 0 and an off-line quartet. Lemma L as stated in section 3 is unchanged and correct. The referee's corrections E2 to E5 (reading condition of the headline, Selberg's theorem as the classical input, scope of Lemma D, wording) are recorded in the obstruction map (section 2, note \"Controls ZQ, SG, NR-q and Lemma L\") and are not edited into this file.\n")
f.repl("| F2 rational with other poles | (z - w)/(z - v), v not at a zero of zeta | exact | exact on atoms | as F1 | fails | fail | yes |",
       "| F2 rational with other poles | (z - w)/(z - v), v not at a zero of zeta | exact | exact on atoms | as F1 | fails " + C + "POS can hold (D >= 0) at the price of real poles in (0, 1)] | fail | yes |")
f.repl("Consequences. (a) No member of the family with exact atoms keeps POS: with exact atoms POS is D >= 0.",
       "Consequences. (a) No member of the family with exact atoms " + C + "and with no pole other than s = 1] keeps POS: with exact atoms POS is D >= 0.")
f.repl("- U2, POS branch (Lambda >= 0 with FE): no member of the family with exact atoms keeps POS (Lemma L); the",
       "- U2, POS branch (Lambda >= 0 with FE): no member of the family with exact atoms " + C + "and with no pole other than s = 1] keeps POS (Lemma L); the")
f.save()

# ---------------------------------------------------------------- item 4b: sentence E1 of the c14 pre-filter lane
f = F('c14-prefilter/RESULT.md', 'push/c14-prefilter-sweep-geometric-nodes/RESULT.md')
f.after("   (Q-B does not apply; class t). The user's bridge, shear, antibridge and spinor square-root nodes fall on one\n   side or the other of this line; none sits between.\n",
        "\n   **Correction note (" + TAG + "; the text above is left as filed).** The sentence \"For a < 1/2 an off-line zero\n"
        "   is a pole and the Schur condition is the zero-free statement itself\" does not hold as written (this lane's\n"
        "   REFEREE.md, E1; second referee `push/c15-referee-r14-independent-checkpoint/REFEREE2_c14-prefilter-sweep-geometric-nodes.md`,\n"
        "   section 3). Replacement, from `push/c15-klein-transport-lemma-w-stage-a-and-e1/PROPOSED_E1_REPLACEMENT.md`\n"
        "   (Theorem E1', PROVED there and confirmed by that lane's independent referee): \"For a >= 1/2 the bridge ratio R_a is\n"
        "   Schur unconditionally and Blaschke-closed. For a < 1/2, R_a is Schur iff every zero with Re lambda > a has a\n"
        "   same-ordinate zero at lambda - 2a of at least its multiplicity (nodes 386, 358). The strip abs(Re lambda) <= a\n"
        "   implies it; it does not imply the strip at a single a; along a sequence a_n -> 0+ it is RH.\" The words \"none\n"
        "   sits between\" are withdrawn. Hypotheses of Theorem E1': X entire, even, real on the real axis, of order one, zeros\n"
        "   in a vertical strip; the sentence for a >= 1/2 \"for any X with zeros in the strip\" needs a growth hypothesis\n"
        "   (bounded type in the half-plane), true for X in the gamma class of xi (second referee). The same replacement\n"
        "   applies to section 2.2, row Q-B (a): \"the inequality is the cancellation-aware condition of node 386, which the\n"
        "   zero-free strip abs(Re lambda) <= a implies and which is RH along a -> 0+; the node stays typed X3\". Typing\n"
        "   consequence for the sweep: none (stated in the replacement file).\n")
f.save()

# ---------------------------------------------------------------- item 3: corrections E1 to E3 in the campaign report
f = F('CAMPAIGN_REPORT_R15.md', 'campaign/CAMPAIGN_REPORT_R15.md')
M = ' [corrected ' + TAG + '; see "Corrections" at the end]'
f.repl("- Every referee in this record is an internal adversarial pass by another agent of the same campaign. Nothing here has external review.",
       "- Every referee in this record is an internal pass by an agent of the same campaign: an adversarial pass by another agent, except the author passes of three repair lanes (`c12-repair-sources-statement-o-v3`, `c13-repair-map-engine-battery-records`, `c14-repair-map-engine-checkpoint-record`), four with the lane that wrote this report, which `lanes.jsonl` counts as referee passes." + M + " Nothing here has external review.")
f.repl("For U1, U2 and U3 the silence is by construction: no control on file has zeta's own functional equation, so requirement R3 cannot be tested there with the control table.",
       "For U3 the silence is by construction: no control on file that is an ordinary Dirichlet series has zeta's own functional equation (Hamburger); T-NR and HEAT keep the symmetry and lack exact local structure at one prime, respectively a Dirichlet series. U1 and the SIZE branch of U2 are cells of U3: read on prime-power atoms they have the control ZQ (round 15), read on ordinary coefficients they are inside the identification class." + M)
f.repl("- Zero-free abscissa, claimed: **0.8748866470** (scoreboard value 0.874886647; method infimum B_flat = 0.874886647039964...).",
       "- Zero-free abscissa, claimed: **0.8748866471** (rounded up; scoreboard value 0.874886647; method infimum B_flat = 0.874886647039964...)." + M)
f.repl("- Lanes run: 122, each refereed at least once. Referee hold rate: 90.2%.",
       "- Lanes run: 122, each with at least one referee record in `lanes.jsonl`; for the three repair lanes named in section 1 (four with the lane that wrote this report) that record is an author pass. Referee hold rate: 90.2% as counted by the scoreboard; with the three author passes not counted, 107 of 119, 89.9%." + M)
f.t = f.t.rstrip('\n') + "\n\n## Corrections (" + TAG + ")\n\nApplied from the independent referee of the writing lane (`../push/c15-repair-record-strategy-v4-report/REFEREE.md`, items E1 to E3; E4 concerns `STRATEGY.md` and was applied in its version 5). The report is otherwise the text of round 15 and describes the state after round 14; it was not regenerated (`mk_report.py` would overwrite these corrections).\n\n" \
    "- E1, section 2.4. As filed: \"For U1, U2 and U3 the silence is by construction: no control on file has zeta's own functional equation, so requirement R3 cannot be tested there with the control table.\" False as written: T-NR has zeta's gamma factor and functional equation (map section 2, row NR). The corrected sentence also carries the round-15 outcome on U1 and U2 (`../push/c15-control-with-zeta-fe-classes-u1-u2`, one independent referee; refereed checkpoint `../push/c15-referee-r14-independent-checkpoint/CHECKPOINT_R15_REFEREED.md`).\n" \
    "- E2, sections 1 and 4. As filed: \"Every referee in this record is an internal adversarial pass by another agent of the same campaign.\" and \"Lanes run: 122, each refereed at least once.\" Three repair lanes have an author pass recorded as a referee pass; other lanes were not audited for this, so the count may be larger.\n" \
    "- E3, section 3. As filed: \"0.8748866470\". As a bound on an abscissa the figure was rounded below the method infimum 0.874886647039964; printed now as 0.8748866471. No dependence on the last digit.\n" \
    "- Section 2.4 still describes eight classes U1 to U8 from the unrefereed draft. Current list: `STRATEGY.md` section 4.0 (version 5), from the refereed checkpoint. State of the record after this correction lane: map 205 rows (S12b, Q30, G41 added), 13 controls in the section 2 table, device types 53 closed / 1 floored / 11 open (the open ones are the silent cells, entered as nodes; not leads).\n"
f.n += 1
f.save()

# ---------------------------------------------------------------- item 3: STRATEGY (E3, E4 were applied by version 5)
f = F('STRATEGY.md', 'campaign/STRATEGY.md')
assert 'default per lane up to 8 cores, 12 GB and 6 hours' in f.t.split('\n')[2]          # E4 present in the header
assert f.t.count('0.8748866470 ') == 1 and f.t.count('0.8748866471') == 3                 # E3: one historical mention left (change log)
f.repl("(refereed record of obstructions plus the part-B figure 0.8748866470 relative to unrefereed manuscripts;",
       "(refereed record of obstructions plus the part-B figure 0.8748866470 [as printed in version 4; rounded below the method infimum, referee E3; printed 0.8748866471 since version 5] relative to unrefereed manuscripts;")
f.repl("C(theta) (U7 lane; row Q25 proposed).**", "C(theta) (U7 lane; map row Q30, proposed by the lane as Q25, a label that was taken).**")
f.repl("| every statement found there is F = zeta on the window (combinable 4); no row yet | none (record: row S12b) |",
       "| every statement found there is F = zeta on the window (combinable 4); map row S12b (applied " + TAG + ") | none |")
f.after("Caveat for U1, U2 and U3 together (referee of the draft, defect 1): with FE read as zeta's own functional equation (conductor 1, zeta's gamma factor) every control that is an ordinary Dirichlet series lacks FE by Hamburger's theorem. The record is therefore silent on U1 and U2 for the same by-construction reason as on U3, and requirement R3 cannot be tested there with the control table.",
        " [Note " + TAG + ": superseded. Round 15 built controls with zeta's own functional equation that are not ordinary Dirichlet series (ZQ, SG, NR-q; map section 2); U1 and the SIZE branch of U2 are cells of U3 and R3 is tested there by the relaxation family (section 4.0).]")
f.repl("\n## Directive from the user, 2026-11-19 (applies to every round from now on)",
       "\n- Record edits of " + TAG + " (no version change; no rule or allocation changed). Section 4.0: row labels Q30 (for the proposed Q25) and S12b entered; a note in section 4.0c on the superseded caveat; a note at the version-4 figure in this log. Corrections E3 and E4 of the version-4 referee were already in version 5 (checked: header limits of 2026-11-19; figure 0.8748866471 in sections 0a and 0b); E1 and E2 are applied in `CAMPAIGN_REPORT_R15.md`. The silent cells of section 4.0 now have engine nodes (`../engine/nodes/nodes-21.json`) as open device types: with the current weights 57 of the top 60 generator candidates stand on them (`../engine/curated/CHANGELOG_c16-repair.md`); this is an effect of the open-device weight, not evidence for any cell. Previous file: `../push/c16-repair-owed-record-r15/before/STRATEGY.md`.\n\n## Directive from the user, 2026-11-19 (applies to every round from now on)")
f.save()

# ---------------------------------------------------------------- item 2 (restriction 30): ROUND_LOG, round 14
f = F('ROUND_LOG.md', 'campaign/ROUND_LOG.md')
NOTE = " [Correction " + TAG + " (restriction 30 of `push/c15-referee-r14-independent-checkpoint/LABEL_RESTRICTIONS.md`): \"no control on file has zeta's own functional equation\" is false as written (T-NR in symmetric form has it); read \"no control on file has zeta's own functional equation together with an ordinary Dirichlet series (INT)\". Checkpoint to use: `push/c15-referee-r14-independent-checkpoint/CHECKPOINT_R15_REFEREED.md` (U1, U2 as cells of U3 with INT in the read set; U4, U6 (a), (b), (g), U8 narrowed).]"
f.line_append("8. `c14-repair-map-engine-checkpoint-record` (repair): partial result, score 0. Map 191 -> 198 rows;", NOTE)
f.line_append("6. Closing the devices that tested a read set does not close the read set (lane 8): the record speaks only where a control lies inside the class.", NOTE)
f.save()
json.dump(done, open(os.path.join(HERE, 'patch_text.json'), 'w'), indent=1)
print(done)
