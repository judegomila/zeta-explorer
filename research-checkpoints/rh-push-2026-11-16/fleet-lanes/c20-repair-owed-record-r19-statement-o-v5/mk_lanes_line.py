import json, os
HERE = os.path.dirname(os.path.abspath(__file__))
ME = 'c20-repair-owed-record-r19-statement-o-v5'
d = {
 "round": 20, "slug": ME, "kind": "repair", "verdict": "partial-result",
 "claim": ("Record lane; no attack; nothing about zeros of zeta; headline unchanged at 1 of 4. Owed list of round 19 entered. Map 215 -> 217 rows: X2 (HQ2 screen; Lemmas N, S, F, C with the referee's correction that the local-shape read is not independent of the pole clause in the finite class), "
           "G45 (cell U4 quadratic / joint-phase read with correction E1: the Liouville twist fails the cross-prime candidate at p q^2 for P > 12); control rows HQ3, HQ4 and an HQ2 addendum (16 controls in the table); addenda to Z37 (double-cover half run; Eisenstein and one self-dual cusp form not separated), "
           "D10 (X = 0; X(d) reduced to NL(d); row open), P58 (Lemma P as repaired by the referee; Riemann-Siegel sign-change completion closed by ZQ through the pair form); G44, X1 at two referee files; Q31 cites Montgomery-Vaughan MNT III (draft) Theorem K.3 and W5c in its refereed form; section 6 item 23; eight rows in section 7. "
           "E1 entered as notes in the lane's RESULT.md (seven places), its lanes line and the claim field of its campaign line; Lemma P repair entered as five notes. The 23 sentences to use: campaign/CORRECTIONS_R18.md (8 already in the map, 15 added or completed). "
           "Engine: control codes HQ2, HQ3, HQ4 (controls.json and CONTROL_CODE_RE); device block R19, no state change (band device stays closed, closedOn rewritten for five referee files; 55 closed / 1 floored / 0 open; cells 6 / 1 / 4, U6 (c) kept as cell pending a second referee file). "
           "STRATEGY: section 3.1 items 59 to 65 and the paragraph 'State of the cells after round 19'; no rule, weight or allocation changed. Statement O version 5 (new file): lines 13, 14, 16, 17 relabelled PROVED in the form the second referee file confirms, each with quoted sentences checked by script; "
           "line 15 (NR-q) not relabelled, because the second file covers Lemma A and Lemma D and not the construction; count PROVED 8, relative 1, MEASURED 1, ARGUED 7. campaign/CHECKPOINT_R20_DECISION_SHEET.md: evidence per condition of the checkpoint rule and the work for rounds 21 onward with cost estimates; checkpoint not applied. "
           "Reruns through memcap before and after: graph 1,750 -> 1,756 nodes (three control nodes, two rows, one section-6 item), rows 251 -> 253, edges 9,213 -> 9,236; top 60 identical (60 of 60 keys, scores and ranks); scoreboard: nodes 1,750 -> 1,756 and nodes marked closed 609 -> 611, every other entry unchanged until this line. merge_outcomes.py not run."),
 "aboutZeros": False, "refereeHolds": None, "referees": 0, "r1": False, "r2": False, "r3": False, "r4": False, "score": 0,
 "file": "tmp/research-2026-11-16/push/" + ME + "/RESULT.md",
 "heavy": False, "serverUnits": [], "nodes": [],
 "tags": ["repair", "record", "map-rows", "control-codes", "statement-o", "checkpoint-decision-sheet", "corrections"],
 "obstructionKind": "record", "restatement": False, "knownArchitecture": False, "brokenProved": 0, "lemmasDecided": 0,
 "lesson": ("Checking a second referee file against the closing step of a statement line, sentence by sentence, changes the outcome: of five lines listed as 'second file exists', one (NR-q) is not covered and one (the reflection translate of the span line) is covered only in a form that the referee of the second file had already corrected. "
            "A new control enters the generator only through the 'Defeated by' cells of map rows, so adding control codes changes edges and no ranking."),
 "followUp": ("Checkpoint after round 20: decide conditions A and B from the round-20 learn step (the explore lane on the last U4 read reports a stage-A stop, unrefereed); accept or reject Statement O version 5; a referee pass on table row F4 (NR-q) of c15-control-with-zeta-fe-classes-u1-u2 would allow line 15 to follow; "
              "set cell U6 (c) to closed in mk_devices.py block R19 when a second referee file for c19-u6c-double-cover-k3-run holds."),
 "owed": ("second referees for round-19 lanes 1 to 6 (lane 2 not assigned); map rows and states for round 20; Statement O lines for the records of rounds 17 to 19; enclosed tail bound for Theorem A; merge_outcomes.py not run; the round-18 lane files do not carry the 23 sentences as notes (register and map only)"),
}
line = json.dumps(d, ensure_ascii=False)
open(os.path.join(HERE, 'lanes.jsonl'), 'w', encoding='utf-8').write(line + '\n')
json.dump(d, open(os.path.join(HERE, 'lanes_line.json'), 'w', encoding='utf-8'), indent=1, ensure_ascii=False)
p = os.path.normpath(os.path.join(HERE, '..', '..', 'campaign', 'lanes.jsonl'))
raw = open(p, encoding='utf-8').read()
assert raw.endswith('\n') and not any(json.loads(l).get('slug') == ME for l in raw.split('\n') if l.strip())
tmp = p + '.tmp-' + ME
open(tmp, 'w', encoding='utf-8').write(line + '\n')
os.system('cat "%s" >> "%s" && rm "%s"' % (tmp, p, tmp))
print('appended; lines now', sum(1 for l in open(p, encoding='utf-8') if l.strip()))
